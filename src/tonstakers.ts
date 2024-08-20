import { beginCell, Address, toNano } from "@ton/core";
import { HttpClient, Api, ApyHistory } from "tonapi-sdk-js";
import { CONTRACT, BLOCKCHAIN, TIMING } from "./constants";
import { NetworkCache } from "./cache";
import { log } from "./utils";

interface TransactionMessage {
  address: string;
  amount: string;
  payload: string;
}

interface TransactionDetails {
  validUntil: number;
  messages: TransactionMessage[];
}

interface WalletAccount {
  address: string;
  chain: string;
}

interface IWalletConnector {
  wallet: { account?: WalletAccount };
  sendTransaction: (transactionDetails: TransactionDetails) => Promise<void>;
  onStatusChange: (callback: (wallet: any) => void) => void;
}

interface TonstakersOptions {
  connector: IWalletConnector;
  referralCode?: number;
  tonApiKey?: string;
  cacheFor?: number;
}

class Tonstakers extends EventTarget {
  private connector: IWalletConnector;
  private client!: Api<any>;
  private walletAddress?: Address;
  private stakingContractAddress?: Address;
  private referralCode: number;
  private static jettonWalletAddress?: Address;
  private tonApiKey?: string;
  private cache: NetworkCache;
  public ready: boolean;
  public isTestnet: boolean;

  constructor({
    connector,
    referralCode = CONTRACT.REFERRAL_CODE,
    tonApiKey,
    cacheFor,
  }: TonstakersOptions) {
    super();
    this.connector = connector;
    this.referralCode = referralCode;
    this.tonApiKey = tonApiKey;
    this.cache = new NetworkCache(
      cacheFor === undefined ? TIMING.CACHE_TIMEOUT : cacheFor,
    );
    this.ready = false;
    this.isTestnet = false;

    this.setupClient();
    this.initialize().catch((error) => {
      console.error("Initialization error:", error);
    });
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

    this.cache.clear();

    this.isTestnet = wallet.account.chain === BLOCKCHAIN.CHAIN_DEV;

    this.walletAddress = Address.parse(wallet.account.address);

    if (!Tonstakers.jettonWalletAddress) {
      Tonstakers.jettonWalletAddress = await this.getJettonWalletAddress(
        this.walletAddress,
      );
    }

    await this.setupClient();

    this.ready = true;
    this.dispatchEvent(new Event("initialized"));
  }

  async fetchStakingPoolInfo() {
    // several methods may fetch this at the same time, so the Promise is put to the cache instantly instead of waiting for the response
    // if we wait for the response instead, the cache may not be filled at the moment when the next caller tries to get it, and the request will be repeated

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

    return this.cache.get("poolInfo", getPoolInfo);
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
      const stakingHistory = await this.cache.get("stakingHistory", () =>
        this.client!.staking.getStakingPoolHistory(stakingAddress.toString()),
      );
      return stakingHistory.apy;
    } catch {
      console.error("Failed to get historical APY");
      throw new Error("Could not retrieve historical APY.");
    }
  }

  async getRoundTimestamps(): Promise<[number, number]> {
    if (!this.stakingContractAddress)
      throw new Error("Staking contract address not set.");

    try {
      const response = await this.fetchStakingPoolInfo();
      const poolInfo = response.poolInfo;
      return [poolInfo.cycle_start * 1000, poolInfo.cycle_end * 1000];
    } catch {
      console.error("Failed to get current APY");
      throw new Error("Could not retrieve current APY.");
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
      const response = await this.cache.get("tonPrice", () =>
        this.client!.rates.getRates({
          tokens: ["ton"],
          currencies: ["usd"],
        }),
      );

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
      const jettonWalletData = await this.cache.get(
        `stakedBalance-${addressString}`,
        () =>
          this.client!.blockchain.execGetMethodForBlockchainAccount(
            addressString,
            "get_wallet_data",
          ),
      );

      const formattedBalance = jettonWalletData.decoded.balance;
      log(`Current tsTON balance: ${formattedBalance}`);

      return formattedBalance;
    } catch {
      return 0;
    }
  }

  async getAvailableBalance(): Promise<number> {
    const walletAddress = this.walletAddress;
    if (!walletAddress) throw new Error("Wallet is not connected.");

    try {
      const account = await this.cache.get("account", () =>
        this.client!.accounts.getAccount(walletAddress.toString()),
      );

      const balance =
        Number(account.balance) -
        Number(toNano(CONTRACT.RECOMMENDED_FEE_RESERVE));

      return Math.max(balance, 0);
    } catch {
      return 0;
    }
  }

  async stake(amount: number): Promise<void> {
    if (!this.walletAddress || !Tonstakers.jettonWalletAddress)
      throw new Error("Tonstakers is not fully initialized.");
    try {
      await this.validateAmount(amount);
      const totalAmount = toNano(amount + CONTRACT.STAKE_FEE_RES); // Includes transaction fee
      const payload = this.preparePayload("stake", amount);
      const result = await this.sendTransaction(
        this.stakingContractAddress!,
        totalAmount,
        payload,
      );
      log(`Staked ${amount} TON successfully.`);
      return result;
    } catch (error) {
      console.error(
        "Staking failed:",
        error instanceof Error ? error.message : error,
      );
      throw new Error("Staking operation failed.");
    }
  }

  async stakeMax(): Promise<void> {
    try {
      const availableBalance = await this.getAvailableBalance();
      const result = await this.stake(availableBalance);
      log(`Staked maximum amount of ${availableBalance} TON successfully.`);
      return result;
    } catch (error) {
      console.error(
        "Maximum staking failed:",
        error instanceof Error ? error.message : error,
      );
      throw new Error("Maximum staking operation failed.");
    }
  }

  async unstake(amount: number): Promise<void> {
    if (!Tonstakers.jettonWalletAddress)
      throw new Error("Jetton wallet address is not set.");
    try {
      await this.validateAmount(amount);
      const payload = this.preparePayload("unstake", amount);
      const result = await this.sendTransaction(
        Tonstakers.jettonWalletAddress,
        toNano(CONTRACT.UNSTAKE_FEE_RES),
        payload,
      ); // Includes transaction fee
      log(`Initiated unstaking of ${amount} tsTON.`);
      return result;
    } catch (error) {
      console.error(
        "Unstaking failed:",
        error instanceof Error ? error.message : error,
      );
      throw new Error("Unstaking operation failed.");
    }
  }

  async unstakeInstant(amount: number): Promise<void> {
    if (!Tonstakers.jettonWalletAddress)
      throw new Error("Jetton wallet address is not set.");
    try {
      await this.validateAmount(amount);
      const payload = this.preparePayload("unstake", amount, false, true);
      const result = await this.sendTransaction(
        Tonstakers.jettonWalletAddress,
        toNano(CONTRACT.UNSTAKE_FEE_RES),
        payload,
      ); // Includes transaction fee
      log(`Initiated instant unstaking of ${amount} tsTON.`);
      return result;
    } catch (error) {
      console.error(
        "Instant unstaking failed:",
        error instanceof Error ? error.message : error,
      );
      throw new Error("Instant unstaking operation failed.");
    }
  }

  async unstakeBestRate(amount: number): Promise<void> {
    if (!Tonstakers.jettonWalletAddress)
      throw new Error("Jetton wallet address is not set.");
    try {
      await this.validateAmount(amount);
      const payload = this.preparePayload("unstake", amount, true);
      const result = await this.sendTransaction(
        Tonstakers.jettonWalletAddress,
        toNano(CONTRACT.UNSTAKE_FEE_RES),
        payload,
      ); // Includes transaction fee
      log(`Initiated unstaking of ${amount} tsTON at the best rate.`);
      return result;
    } catch (error) {
      console.error(
        "Best rate unstaking failed:",
        error instanceof Error ? error.message : error,
      );
      throw new Error("Best rate unstaking operation failed.");
    }
  }

  private preparePayload(
    operation: "stake" | "unstake",
    amount: number,
    waitTillRoundEnd: boolean = false,
    fillOrKill: boolean = false,
  ): string {
    let cell = beginCell();

    switch (operation) {
      case "stake":
        cell.storeUint(CONTRACT.PAYLOAD_STAKE, 32);
        cell.storeUint(1, 64).storeUint(this.referralCode, 64);
        break;
      case "unstake":
        cell.storeUint(CONTRACT.PAYLOAD_UNSTAKE, 32);
        cell
          .storeUint(0, 64)
          .storeCoins(toNano(amount))
          .storeAddress(this.walletAddress!)
          .storeMaybeRef(
            beginCell()
              .storeUint(Number(waitTillRoundEnd), 1)
              .storeUint(Number(fillOrKill), 1)
              .endCell(),
          );
        break;
    }

    return cell.endCell().toBoc().toString("base64");
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

  private async validateAmount(amount: number): Promise<void> {
    if (typeof amount !== "number" || amount <= 0) {
      throw new Error("Invalid amount specified");
    }
  }

  private sendTransaction(
    address: Address,
    amount: bigint,
    payload: string,
  ): Promise<void> {
    const validUntil = +new Date() + TIMING.TIMEOUT;
    const transaction: TransactionDetails = {
      validUntil,
      messages: [
        {
          address: address.toString(),
          amount: amount.toString(),
          payload,
        },
      ],
    };
    return this.connector.sendTransaction(transaction);
  }
}

export { Tonstakers };
