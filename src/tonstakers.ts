import {
  Address,
  beginCell,
  Cell,
  Dictionary,
  fromNano,
  internal,
  loadMessageRelaxed,
  SendMode,
  storeMessageRelaxed,
  toNano,
} from "@ton/core";
import { Api, ApyHistory, HttpClient, NftItem } from "tonapi-sdk-js";
import { BLOCKCHAIN, CONTRACT, MULTISIG, TIMING } from "./constants";
import { log } from "./utils";

interface SendTransactionResponse {
  boc: string;
}

interface TransactionMessage {
  address: string;
  amount: string;
  payload: string;
}

interface TransactionDetails {
  validUntil: number;
  messages: TransactionMessage[];
}

export interface IWalletConnector {
  sendTransaction: (
    transactionDetails: TransactionDetails,
  ) => Promise<SendTransactionResponse>;
  onStatusChange: (callback: (wallet: any) => void) => void | (() => void);
}

interface TonstakersOptions {
  connector: IWalletConnector;
  partnerCode?: number;
  tonApiKey?: string;
}

interface NftItemWithEstimates extends NftItem {
  estimatedPayoutDateTime: number;
  roundEndTime: number;
  tsTONAmount: number;
}

export interface RoundInfo {
  withdrawal_payout: string;
  cycle_start: number;
  cycle_end: number;
}

export interface WithdrawalPayoutData {
  active_collections: RoundInfo[];
}

export interface MultisigData {
  address: Address;
  threshold: number;
  signers: Address[];
  proposers: Address[];
  nextOrderSeqno: bigint | null;
  allowArbitraryOrderSeqno: boolean;
  balance: bigint;
  isSigner: boolean;
  isProposer: boolean;
  signerIndex: number | null;
  proposerIndex: number | null;
}

export type MultisigOrderActionKind = "stake" | "unstake";

export interface MultisigOrderAction {
  kind: MultisigOrderActionKind;
  amount: bigint;
}

export interface MultisigOrderInfo {
  orderAddress: Address;
  multisigAddress: Address;
  seqno: bigint;
  threshold: number;
  approvalsNum: number;
  approvalsMask: bigint;
  approvals: boolean[];
  signers: Address[];
  expirationDate: number;
  executed: boolean;
  expired: boolean;
  canApprove: boolean;
  signerIndex: number | null;
  action: MultisigOrderAction | null;
}

export interface MultisigOrderOptions {
  expirationDate?: number;
  valueForDeploy?: bigint;
  queryId?: bigint;
  orderSeqno?: bigint;
}

export interface MultisigUnstakeOrderOptions extends MultisigOrderOptions {
  waitTillRoundEnd?: boolean;
  fillOrKill?: boolean;
}

interface TvmStackRecord {
  type: "cell" | "num" | "nan" | "null" | "tuple";
  cell?: string;
  slice?: string;
  num?: string;
  tuple?: TvmStackRecord[];
}

class Tonstakers extends EventTarget {
  private connector: IWalletConnector;
  private client!: Api<any>;
  private walletAddress?: Address;
  private stakingContractAddress?: Address;
  private partnerCode: number;
  private static jettonWalletAddress?: Address;
  private tonApiKey?: string;
  public ready: boolean;
  public isTestnet: boolean;

  constructor({
                connector,
                partnerCode = CONTRACT.PARTNER_CODE,
                tonApiKey,
              }: TonstakersOptions) {
    super();
    this.connector = connector;
    this.partnerCode = partnerCode;
    this.tonApiKey = tonApiKey;
    this.ready = false;
    this.isTestnet = false;

    this.setupClient();
    this.initialize().catch((error) => {
      console.error("Initialization error:", error);
    });
  }

  private async getWithdrawalPayouts(): Promise<WithdrawalPayoutData | undefined> {
    try {

      const requestOptions: RequestInit = {
        method: "GET",
        redirect: "follow",
      };

      const response = await fetch("https://api.tonstakers.com/api/v1/pool/withdrawal_payout", requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching withdrawal payouts:', error);
      return undefined;
    }
  }

  private async setupClient(): Promise<void> {
    log("Setting up Tonstakers SDK, isTestnet:", this.isTestnet);
    const baseApiParams = this.tonApiKey
      ? {
        headers: {
          Authorization: `Bearer ${this.tonApiKey}`,
          "Content-type": "application/json",
        },
      }
      : {};
    const httpClient = new HttpClient({
      baseUrl: this.isTestnet ? BLOCKCHAIN.API_URL_TESTNET : BLOCKCHAIN.API_URL,
      baseApiParams,
    });
    this.client = new Api(httpClient);
    this.stakingContractAddress = Address.parse(
      CONTRACT.STAKING_CONTRACT_ADDRESS,
    );
  }

  private async initialize(): Promise<void> {
    this.connector.onStatusChange(async (wallet) => {
      if (wallet?.account?.address) {
        await this.setupWallet(wallet);
      } else {
        this.deinitialize();
      }
    });
  }

  private deinitialize(): void {
    log("Deinitializing Tonstakers...");
    this.walletAddress = undefined;
    Tonstakers.jettonWalletAddress = undefined;
    this.dispatchEvent(new Event("deinitialized"));
  }

  private async setupWallet(wallet: any): Promise<void> {
    log("Setting up wallet for Tonstakers...");

    this.isTestnet = wallet.account.chain === BLOCKCHAIN.CHAIN_DEV;

    const newAddress = Address.parse(wallet.account.address);
    const walletChanged = !this.walletAddress || !newAddress.equals(this.walletAddress);

    this.walletAddress = newAddress;

    if (walletChanged || !Tonstakers.jettonWalletAddress) {
      Tonstakers.jettonWalletAddress = await this.getJettonWalletAddress(
        this.walletAddress,
      );
    }

    await this.setupClient();

    this.ready = true;
    this.dispatchEvent(new Event("initialized"));
  }

  async fetchStakingPoolInfo() {
    const getPoolInfo = async () => {
      const poolInfo = await this.client.staking.getStakingPoolInfo(
        this.stakingContractAddress!.toString(),
      );
      const poolFullData =
        await this.client.blockchain.execGetMethodForBlockchainAccount(
          this.stakingContractAddress!.toString(),
          "get_pool_full_data",
        );

      return {
        poolInfo: poolInfo.pool,
        poolFullData: poolFullData.decoded,
      };
    };

    return await getPoolInfo();
  }

  async getCurrentApy(): Promise<number> {
    if (!this.stakingContractAddress)
      throw new Error("Staking contract address not set.");
    try {
      const response = await this.fetchStakingPoolInfo();
      return response.poolInfo.apy;
    } catch {
      console.error("Failed to get current APY");
      throw new Error("Could not retrieve current APY.");
    }
  }

  async getHistoricalApy(): Promise<ApyHistory[]> {
    const stakingAddress = this.stakingContractAddress;

    if (!stakingAddress) throw new Error("Staking contract address not set.");

    try {
      const stakingHistory = await this.client!.staking.getStakingPoolHistory(stakingAddress.toString())
      return stakingHistory.apy;
    } catch {
      console.error("Failed to get historical APY");
      throw new Error("Could not retrieve historical APY.");
    }
  }

  async getTvl(): Promise<number> {
    if (!this.stakingContractAddress)
      throw new Error("Staking contract address not set.");
    try {
      const response = await this.fetchStakingPoolInfo();
      return response.poolInfo.total_amount;
    } catch {
      console.error("Failed to get TVL");
      throw new Error("Could not retrieve TVL.");
    }
  }

  async getStakersCount(): Promise<number> {
    if (!this.stakingContractAddress)
      throw new Error("Staking contract address not set.");
    try {
      const response = await this.fetchStakingPoolInfo();
      return response.poolInfo.current_nominators;
    } catch {
      console.error("Failed to get stakers count");
      throw new Error("Could not retrieve stakers count.");
    }
  }

  async getRates(): Promise<any> {
    if (!this.stakingContractAddress)
      throw new Error("Staking contract address not set.");
    try {
      const poolData = await this.fetchStakingPoolInfo();

      const poolBalance = poolData.poolFullData.total_balance;
      const poolSupply = poolData.poolFullData.supply;
      const tsTONTON = poolBalance / poolSupply;

      const poolProjectedBalance = poolData.poolFullData.projected_balance;
      const poolProjectedSupply = poolData.poolFullData.projected_supply;
      const tsTONTONProjected = poolProjectedBalance / poolProjectedSupply;

      const TONUSD = await this.getTonPrice();
      return {
        TONUSD,
        tsTONTON,
        tsTONTONProjected,
      };
    } catch {
      console.error("Failed to get rates");
      throw new Error("Could not retrieve rates.");
    }
  }

  private async getTonPrice(): Promise<number> {
    try {
      const response = await this.client!.rates.getRates({
        tokens: ["ton"],
        currencies: ["usd"],
      });
      const tonPrice = response.rates?.TON?.prices?.USD;

      return tonPrice || 0;
    } catch {
      return 0;
    }
  }

  async getStakedBalance(): Promise<number> {
    if (!Tonstakers.jettonWalletAddress)
      throw new Error("Jetton wallet address is not set.");

    const addressString = Tonstakers.jettonWalletAddress.toString();

    try {
      const jettonWalletData = await this.client!.blockchain.execGetMethodForBlockchainAccount(
        addressString,
        "get_wallet_data",
      );

      const formattedBalance = jettonWalletData.decoded.balance;
      log(`Current tsTON balance: ${formattedBalance}`);

      return formattedBalance;
    } catch {
      return 0;
    }
  }

  async getMultisigStakedBalance(
    multisigAddress: string | Address,
  ): Promise<number> {
    const addr =
      typeof multisigAddress === "string"
        ? Address.parse(multisigAddress)
        : multisigAddress;
    try {
      const jettonWallet = await this.getJettonWalletAddress(addr);
      const data = await this.client.blockchain.execGetMethodForBlockchainAccount(
        jettonWallet.toString(),
        "get_wallet_data",
      );
      return Number(data.decoded?.balance ?? 0);
    } catch {
      return 0;
    }
  }

  async getBalance(): Promise<number> {
    const walletAddress = this.walletAddress;
    if (!walletAddress) throw new Error("Wallet is not connected.");

    try {
      const account = await this.client!.accounts.getAccount(walletAddress.toString());
      return Math.max(Number(account.balance), 0);
    } catch {
      return 0;
    }
  }

  async getAvailableBalance(): Promise<number> {
    const walletAddress = this.walletAddress;
    if (!walletAddress) throw new Error("Wallet is not connected.");

    try {
      const balance = await this.getBalance()
      const availableBalance =
        balance - Number(toNano(CONTRACT.RECOMMENDED_FEE_RESERVE));

      return Math.max(availableBalance, 0);
    } catch {
      return 0;
    }
  }

  async getInstantLiquidity(): Promise<number> {
    const account = await this.client!.accounts.getAccount(
      this.isTestnet
        ? CONTRACT.STAKING_CONTRACT_ADDRESS_TESTNET
        : CONTRACT.STAKING_CONTRACT_ADDRESS,
    );

    return account.balance;
  }

  async stake(amount: bigint): Promise<SendTransactionResponse> {
    if (!this.walletAddress || !Tonstakers.jettonWalletAddress)
      throw new Error("Tonstakers is not fully initialized.");

    const feeRes = toNano(CONTRACT.STAKE_FEE_RES)
    const totalAmount = amount + feeRes; // Includes transaction fee
    const payload = this.preparePayload("stake", totalAmount);
    const result = await this.sendTransaction(
      this.stakingContractAddress!,
      totalAmount,
      payload,
    );
    log(`Staked ${fromNano(amount)} TON successfully.`);
    return result;
  }

  async stakeMax(): Promise<SendTransactionResponse> {
    const availableBalance = await this.getAvailableBalance();
    const result = await this.stake(toNano(availableBalance));
    log(`Staked maximum amount of ${availableBalance} TON successfully.`);
    return result;
  }

  async unstake(amount: bigint): Promise<SendTransactionResponse> {
    if (!Tonstakers.jettonWalletAddress)
      throw new Error("Jetton wallet address is not set.");

    const payload = this.preparePayload("unstake", amount);
    const result = await this.sendTransaction(
      Tonstakers.jettonWalletAddress,
      toNano(CONTRACT.UNSTAKE_FEE_RES),
      payload,
    ); // Includes transaction fee
    log(`Initiated unstaking of ${fromNano(amount)} tsTON.`);
    return result;
  }

  async unstakeInstant(amount: bigint): Promise<SendTransactionResponse> {
    if (!Tonstakers.jettonWalletAddress)
      throw new Error("Jetton wallet address is not set.");

    const payload = this.preparePayload("unstake", amount, false, true);
    const result = await this.sendTransaction(
      Tonstakers.jettonWalletAddress,
      toNano(CONTRACT.UNSTAKE_FEE_RES),
      payload,
    ); // Includes transaction fee
    log(`Initiated instant unstaking of ${fromNano(amount)} tsTON.`);
    return result;
  }

  async unstakeBestRate(amount: bigint): Promise<SendTransactionResponse> {
    if (!Tonstakers.jettonWalletAddress)
      throw new Error("Jetton wallet address is not set.");

    const payload = this.preparePayload("unstake", amount, true);
    const result = await this.sendTransaction(
      Tonstakers.jettonWalletAddress,
      toNano(CONTRACT.UNSTAKE_FEE_RES),
      payload,
    ); // Includes transaction fee
    log(`Initiated unstaking of ${fromNano(amount)} tsTON at the best rate.`);
    return result;
  }

  async getActiveWithdrawalNFTs(): Promise<NftItemWithEstimates[]> {
    try {
      const withdrawalPayouts = await this.getWithdrawalPayouts();

      if (!withdrawalPayouts) {
        throw new Error("Failed to get withdrawal payouts.");
      }
      const { active_collections } = withdrawalPayouts;

      const nftPromises = active_collections.map((collection) =>
        this.getFilteredByAddressNFTs(collection.withdrawal_payout, collection.cycle_end * 1000)
      );

      const nftResults = await Promise.all(nftPromises);
      return nftResults.flat();
    } catch (error) {
      console.error(
        "Failed to get active withdrawals:",
        error instanceof Error ? error.message : error,
      );
      throw new Error("Failed to get active withdrawals.");
    }
  }

  private async getFilteredByAddressNFTs(payoutAddress: string, endDate: number): Promise<NftItemWithEstimates[]> {
    try {
      const payoutNftCollection = await this.client.nft.getItemsFromCollection(payoutAddress);
      const endDateInSeconds = Math.floor(endDate / 1000);
      const filteredItems: NftItemWithEstimates[] = [];
      let itemsBeforeCount = 0;

      for (const item of payoutNftCollection.nft_items) {
        if (item.owner?.address === this.walletAddress?.toRawString()) {
          const positionBasedTime = itemsBeforeCount * TIMING.ESTIMATED_TIME_BW_TX_S;
          const estimatedPayoutTimeInSeconds = endDateInSeconds + positionBasedTime + TIMING.ESTIMATED_TIME_AFTER_ROUND_S;

          filteredItems.push({
            ...item,
            estimatedPayoutDateTime: estimatedPayoutTimeInSeconds,
            roundEndTime: endDateInSeconds,
            tsTONAmount: Number(item.metadata.name?.match(/[\d.]+/)?.[0]) || 0
          });
        }
        itemsBeforeCount++;
      }

      return filteredItems;
    } catch (error) {
      console.error("Failed to get withdrawal history:", error);
      return [];
    }
  }

  private buildStakePayload(): Cell {
    return beginCell()
      .storeUint(CONTRACT.PAYLOAD_STAKE, 32)
      .storeUint(1, 64)
      .storeUint(this.partnerCode, 64)
      .endCell();
  }

  private buildUnstakePayload(
    amount: bigint,
    ownerAddress: Address,
    waitTillRoundEnd: boolean = false,
    fillOrKill: boolean = false,
  ): Cell {
    return beginCell()
      .storeUint(CONTRACT.PAYLOAD_UNSTAKE, 32)
      .storeUint(0, 64)
      .storeCoins(amount)
      .storeAddress(ownerAddress)
      .storeMaybeRef(
        beginCell()
          .storeUint(Number(waitTillRoundEnd), 1)
          .storeUint(Number(fillOrKill), 1)
          .endCell(),
      )
      .endCell();
  }

  private preparePayload(
    operation: "stake" | "unstake",
    amount: bigint,
    waitTillRoundEnd: boolean = false,
    fillOrKill: boolean = false,
  ): string {
    const cell =
      operation === "stake"
        ? this.buildStakePayload()
        : this.buildUnstakePayload(
            amount,
            this.walletAddress!,
            waitTillRoundEnd,
            fillOrKill,
          );
    return cell.toBoc().toString("base64");
  }

  private async getJettonWalletAddress(
    walletAddress: Address,
  ): Promise<Address> {
    try {
      const responsePool = await this.fetchStakingPoolInfo();
      const jettonMinterAddress = Address.parse(
        responsePool.poolInfo.liquid_jetton_master!,
      );
      const responseJetton =
        await this.client.blockchain.execGetMethodForBlockchainAccount(
          jettonMinterAddress.toString(),
          "get_wallet_address",
          { args: [walletAddress.toString()] },
        );
      return Address.parse(responseJetton.decoded.jetton_wallet_address);
    } catch (error) {
      console.error(
        "Failed to get jetton wallet address:",
        error instanceof Error ? error.message : error,
      );
      throw new Error("Could not retrieve jetton wallet address.");
    }
  }

  async getMultisigData(
    multisigAddress: string | Address,
  ): Promise<MultisigData> {
    const addr = Tonstakers.toAddress(multisigAddress);
    const addrStr = addr.toString();

    const [methodResult, account] = await Promise.all([
      this.client.blockchain.execGetMethodForBlockchainAccount(
        addrStr,
        "get_multisig_data",
      ),
      this.client.accounts.getAccount(addrStr),
    ]);

    if (!methodResult.success || methodResult.exit_code !== 0) {
      throw new Error(
        `get_multisig_data failed (exit_code=${methodResult.exit_code})`,
      );
    }
    if (methodResult.stack.length < 4) {
      throw new Error("get_multisig_data returned unexpected stack");
    }

    const rawSeqno = Tonstakers.tvmNum(methodResult.stack[0]);
    const threshold = Number(Tonstakers.tvmNum(methodResult.stack[1]));
    const signers = Tonstakers.parseAddressDict(
      Tonstakers.tvmCellOpt(methodResult.stack[2]),
    );
    const proposers = Tonstakers.parseAddressDict(
      Tonstakers.tvmCellOpt(methodResult.stack[3]),
    );

    const allowArbitraryOrderSeqno = rawSeqno < BigInt(0);
    const nextOrderSeqno = allowArbitraryOrderSeqno ? null : rawSeqno;

    let signerIndex = -1;
    let proposerIndex = -1;
    if (this.walletAddress) {
      signerIndex = signers.findIndex((a) => a.equals(this.walletAddress!));
      proposerIndex = proposers.findIndex((a) =>
        a.equals(this.walletAddress!),
      );
    }

    return {
      address: addr,
      threshold,
      signers,
      proposers,
      nextOrderSeqno,
      allowArbitraryOrderSeqno,
      balance: BigInt(account.balance),
      isSigner: signerIndex >= 0,
      isProposer: proposerIndex >= 0,
      signerIndex: signerIndex >= 0 ? signerIndex : null,
      proposerIndex: proposerIndex >= 0 ? proposerIndex : null,
    };
  }

  async getMultisigPendingOrders(
    multisigAddress: string | Address,
    options?: { limit?: number; includeExpired?: boolean },
  ): Promise<MultisigOrderInfo[]> {
    const addr = Tonstakers.toAddress(multisigAddress);
    const limit = options?.limit ?? MULTISIG.TX_LOOKUP_DEFAULT_LIMIT;
    const includeExpired = options?.includeExpired ?? false;

    const txs = await this.client.blockchain.getBlockchainAccountTransactions(
      addr.toString(),
      { limit },
    );

    const orderAddrs = new Set<string>();
    const initOp = `0x${MULTISIG.OP_ORDER_INIT.toString(16)}`;
    for (const tx of txs.transactions) {
      for (const out of tx.out_msgs) {
        if (out.op_code?.toLowerCase() !== initOp) continue;
        const dst = out.destination?.address;
        if (dst) orderAddrs.add(dst);
      }
    }

    const now = Math.floor(Date.now() / 1000);
    const orders = await Promise.all(
      Array.from(orderAddrs).map((orderAddrRaw) =>
        this.readOrderData(orderAddrRaw).catch(() => null),
      ),
    );

    return orders
      .filter((o): o is MultisigOrderInfo => o !== null)
      .filter((o) => !o.executed)
      .filter((o) => includeExpired || !o.expired)
      .sort((a, b) => (a.seqno < b.seqno ? 1 : -1));
  }

  async createStakeOrder(
    multisigAddress: string | Address,
    amount: bigint,
    options: MultisigOrderOptions = {},
  ): Promise<SendTransactionResponse> {
    if (!this.stakingContractAddress) {
      throw new Error("Staking contract address not set.");
    }
    const data = await this.getMultisigData(multisigAddress);
    const innerValue = amount + toNano(CONTRACT.STAKE_FEE_RES);
    const action = this.buildMultisigSendAction(
      this.stakingContractAddress,
      innerValue,
      this.buildStakePayload(),
    );
    return this.submitMultisigOrder(data, [action], options);
  }

  async approveMultisigOrder(
    orderAddress: string | Address,
    options?: { signerIndex?: number; queryId?: bigint; value?: bigint },
  ): Promise<SendTransactionResponse> {
    if (!this.walletAddress)
      throw new Error("Wallet is not connected.");
    const addr = Tonstakers.toAddress(orderAddress);

    let signerIdx = options?.signerIndex;
    if (signerIdx === undefined) {
      const order = await this.readOrderData(addr.toString());
      if (!order) throw new Error("Order not found or not inited.");
      if (order.signerIndex === null) {
        throw new Error("Connected wallet is not a signer for this order.");
      }
      signerIdx = order.signerIndex;
    }

    const queryId = options?.queryId ?? BigInt(0);
    const body = beginCell()
      .storeUint(MULTISIG.OP_ORDER_APPROVE, 32)
      .storeUint(queryId, 64)
      .storeUint(signerIdx, 8)
      .endCell();

    const value = options?.value ?? toNano("0.1");
    return this.sendTransaction(addr, value, body.toBoc().toString("base64"));
  }

  async createUnstakeOrder(
    multisigAddress: string | Address,
    amount: bigint,
    options: MultisigUnstakeOrderOptions = {},
  ): Promise<SendTransactionResponse> {
    const data = await this.getMultisigData(multisigAddress);
    const multisigJettonWallet = await this.getJettonWalletAddress(data.address);
    const action = this.buildMultisigSendAction(
      multisigJettonWallet,
      toNano(CONTRACT.UNSTAKE_FEE_RES),
      this.buildUnstakePayload(
        amount,
        data.address,
        options.waitTillRoundEnd ?? false,
        options.fillOrKill ?? false,
      ),
    );
    return this.submitMultisigOrder(data, [action], options);
  }

  private async submitMultisigOrder(
    data: MultisigData,
    actions: Cell[],
    options: MultisigOrderOptions,
  ): Promise<SendTransactionResponse> {
    let isSigner: boolean;
    let addrIdx: number;
    if (data.isSigner) {
      isSigner = true;
      addrIdx = data.signerIndex!;
    } else if (data.isProposer) {
      isSigner = false;
      addrIdx = data.proposerIndex!;
    } else {
      throw new Error(
        "Connected wallet is not a signer or proposer of this multisig.",
      );
    }

    const expirationDate =
      options.expirationDate ??
      Math.floor(Date.now() / 1000) + MULTISIG.DEFAULT_EXPIRATION_SECONDS;
    const orderSeqno =
      options.orderSeqno ??
      (data.allowArbitraryOrderSeqno
        ? Tonstakers.randomUint256()
        : MULTISIG.ARBITRARY_SEQNO);
    const queryId = options.queryId ?? BigInt(0);
    const actionsCell = Tonstakers.buildOrderActionsCell(actions);

    let deployValue: bigint;
    if (options.valueForDeploy !== undefined) {
      deployValue = options.valueForDeploy;
    } else {
      deployValue = await this.estimateOrderValue(
        data.address,
        actionsCell,
        expirationDate,
      );
    }

    const body = beginCell()
      .storeUint(MULTISIG.OP_NEW_ORDER, 32)
      .storeUint(queryId, 64)
      .storeUint(orderSeqno, 256)
      .storeBit(isSigner)
      .storeUint(addrIdx, 8)
      .storeUint(expirationDate, 48)
      .storeRef(actionsCell)
      .endCell();

    return this.sendTransaction(
      data.address,
      deployValue,
      body.toBoc().toString("base64"),
    );
  }

  private async estimateOrderValue(
    multisigAddress: Address,
    actionsCell: Cell,
    expirationDate: number,
  ): Promise<bigint> {
    const fallback = toNano(MULTISIG.DEFAULT_DEPLOY_VALUE);
    try {
      const res = await this.client.blockchain.execGetMethodForBlockchainAccount(
        multisigAddress.toString(),
        "get_order_estimate",
        {
          args: [
            actionsCell.toBoc().toString("base64"),
            expirationDate.toString(),
          ],
        },
      );
      if (!res.success || res.exit_code !== 0 || res.stack.length < 1) {
        return fallback;
      }
      const estimate = Tonstakers.tvmNum(res.stack[0]);
      if (estimate <= BigInt(0)) return fallback;
      // 20% buffer on top of the contract's minimum, capped by a hard floor of
      // 0.05 TON so tiny estimates still leave room for forward fees.
      const withBuffer = (estimate * BigInt(120)) / BigInt(100);
      const minFloor = estimate + toNano("0.05");
      return withBuffer > minFloor ? withBuffer : minFloor;
    } catch {
      return fallback;
    }
  }

  private buildMultisigSendAction(
    to: Address,
    value: bigint,
    body: Cell,
    sendMode: SendMode = SendMode.PAY_GAS_SEPARATELY,
  ): Cell {
    const msg = internal({ to, value, bounce: true, body });
    const msgCell = beginCell().store(storeMessageRelaxed(msg)).endCell();
    return beginCell()
      .storeUint(MULTISIG.ACTION_SEND_MESSAGE, 32)
      .storeUint(sendMode, 8)
      .storeRef(msgCell)
      .endCell();
  }

  private static buildOrderActionsCell(actions: Cell[]): Cell {
    if (actions.length === 0 || actions.length > 255) {
      throw new Error("Action count must be in [1, 255]");
    }
    const dict = Dictionary.empty(
      Dictionary.Keys.Uint(8),
      Dictionary.Values.Cell(),
    );
    actions.forEach((a, i) => dict.set(i, a));
    return beginCell().storeDictDirect(dict).endCell();
  }

  private async readOrderData(
    orderAddrRaw: string,
  ): Promise<MultisigOrderInfo | null> {
    const res = await this.client.blockchain.execGetMethodForBlockchainAccount(
      orderAddrRaw,
      "get_order_data",
    );
    if (!res.success || res.exit_code !== 0) return null;
    if (res.stack.length < 8) return null;

    const multisig = Tonstakers.tvmAddress(res.stack[0]);
    const seqno = Tonstakers.tvmNum(res.stack[1]);
    const thresholdOpt = Tonstakers.tvmNumOpt(res.stack[2]);
    if (thresholdOpt === null) return null;
    const ZERO = BigInt(0);
    const ONE = BigInt(1);
    const executed = (Tonstakers.tvmNumOpt(res.stack[3]) ?? ZERO) !== ZERO;
    const signers = Tonstakers.parseAddressDict(
      Tonstakers.tvmCellOpt(res.stack[4]),
    );
    const approvalsMask = Tonstakers.tvmNumOpt(res.stack[5]) ?? ZERO;
    const approvalsNum = Number(Tonstakers.tvmNumOpt(res.stack[6]) ?? ZERO);
    const expirationDate = Number(Tonstakers.tvmNumOpt(res.stack[7]) ?? ZERO);
    const orderCell =
      res.stack.length > 8 ? Tonstakers.tvmCellOpt(res.stack[8]) : null;

    const approvals: boolean[] = [];
    for (let i = 0; i < signers.length; i++) {
      approvals.push(((approvalsMask >> BigInt(i)) & ONE) === ONE);
    }

    let signerIndex: number | null = null;
    let canApprove = false;
    if (this.walletAddress) {
      const idx = signers.findIndex((a) => a.equals(this.walletAddress!));
      if (idx >= 0) {
        signerIndex = idx;
        canApprove = !executed && !approvals[idx];
      }
    }

    const action = orderCell ? this.parseOrderAction(orderCell) : null;

    const now = Math.floor(Date.now() / 1000);
    return {
      orderAddress: Address.parse(orderAddrRaw),
      multisigAddress: multisig,
      seqno,
      threshold: Number(thresholdOpt),
      approvalsNum,
      approvalsMask,
      approvals,
      signers,
      expirationDate,
      executed,
      expired: expirationDate > 0 && expirationDate < now,
      canApprove,
      signerIndex,
      action,
    };
  }

  private parseOrderAction(orderCell: Cell): MultisigOrderAction | null {
    try {
      const dict = Dictionary.loadDirect(
        Dictionary.Keys.Uint(8),
        Dictionary.Values.Cell(),
        orderCell,
      );
      const first = dict.get(0);
      if (!first) return null;
      const slice = first.beginParse();
      const actionOp = slice.loadUint(32);
      if (actionOp !== MULTISIG.ACTION_SEND_MESSAGE) return null;
      slice.loadUint(8); // sendMode
      const msgCell = slice.loadRef();
      const msg = loadMessageRelaxed(msgCell.beginParse());
      if (msg.info.type !== "internal") return null;
      const innerValue = msg.info.value.coins;
      const bodySlice = msg.body.beginParse();
      if (bodySlice.remainingBits < 32) return null;
      const bodyOp = bodySlice.loadUint(32);
      if (bodyOp === CONTRACT.PAYLOAD_STAKE) {
        const amount = innerValue - toNano(CONTRACT.STAKE_FEE_RES);
        return { kind: "stake", amount: amount > BigInt(0) ? amount : innerValue };
      }
      if (bodyOp === CONTRACT.PAYLOAD_UNSTAKE) {
        bodySlice.loadUint(64); // query_id
        const amount = bodySlice.loadCoins();
        return { kind: "unstake", amount };
      }
      return null;
    } catch {
      return null;
    }
  }

  private static toAddress(addr: string | Address): Address {
    return typeof addr === "string" ? Address.parse(addr) : addr;
  }

  private static randomUint256(): bigint {
    const bytes = new Uint8Array(32);
    const g = globalThis as any;
    if (g.crypto?.getRandomValues) {
      g.crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < 32; i++) bytes[i] = Math.floor(Math.random() * 256);
    }
    let hex = "";
    for (let i = 0; i < bytes.length; i++) {
      hex += bytes[i].toString(16).padStart(2, "0");
    }
    return BigInt("0x" + hex);
  }

  private static parseTvmNumber(s: string): bigint {
    if (s.startsWith("-")) return -BigInt(s.slice(1));
    return BigInt(s);
  }

  private static tvmNum(item: TvmStackRecord): bigint {
    if (item.num !== undefined) return Tonstakers.parseTvmNumber(item.num);
    throw new Error(`Expected num stack item, got ${item.type}`);
  }

  private static tvmNumOpt(item: TvmStackRecord): bigint | null {
    if (item.type === "null" || item.type === "nan") return null;
    if (item.num !== undefined) return Tonstakers.parseTvmNumber(item.num);
    return null;
  }

  private static tvmCellOpt(item: TvmStackRecord): Cell | null {
    if (item.type === "null") return null;
    const hex = item.cell ?? item.slice;
    if (!hex) return null;
    return Cell.fromBoc(Buffer.from(hex, "hex"))[0];
  }

  private static tvmAddress(item: TvmStackRecord): Address {
    const cell = Tonstakers.tvmCellOpt(item);
    if (!cell) throw new Error("Address expected in stack");
    return cell.beginParse().loadAddress();
  }

  private static parseAddressDict(cell: Cell | null): Address[] {
    if (!cell) return [];
    const dict = Dictionary.loadDirect(
      Dictionary.Keys.Uint(8),
      Dictionary.Values.Address(),
      cell,
    );
    const keys = [...dict.keys()].sort((a, b) => a - b);
    return keys.map((k) => dict.get(k)!);
  }

  private sendTransaction(
    address: Address,
    amount: bigint,
    payload: string,
  ): Promise<SendTransactionResponse> {
    const validUntil = +new Date() + TIMING.TIMEOUT;
    const transaction: TransactionDetails = {
      validUntil,
      messages: [
        {
          address: address.toString({
            urlSafe: true,
            bounceable: true,
          }),
          amount: amount.toString(),
          payload,
        },
      ],
    };
    return this.connector.sendTransaction(transaction);
  }
}

export { Tonstakers };