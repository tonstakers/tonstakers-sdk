import { beginCell, Address, toNano, fromNano } from "@ton/core";
import { HttpClient, Api } from "tonapi-sdk-js";
import { CONTRACT, BLOCKCHAIN, TIMING } from "./constants";

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
}

class Tonstakers extends EventTarget {
  private connector: IWalletConnector;
  private client?: Api<any>;
  private walletAddress?: Address;
  private stakingContractAddress?: Address;
  private referralCode: number;
  private static jettonWalletAddress?: Address;
  private tonApiKey?: string;

  constructor({ connector, referralCode = CONTRACT.REFERRAL_CODE, tonApiKey }: TonstakersOptions) {
    super();
    this.connector = connector;
    this.referralCode = referralCode;
    this.tonApiKey = tonApiKey;

    this.initialize().catch((error) => {
      console.error("Initialization error:", error);
      throw error;
    });
  }

  private async initialize(): Promise<void> {
    this.connector.onStatusChange(async (wallet) => {
      if (wallet?.account?.address) {
        this.setupClient(wallet);
      } else {
        this.deinitialize();
      }
    });
  }

  private deinitialize(): void {
    console.log("Deinitializing Tonstakers...");
    this.client = undefined;
    this.walletAddress = undefined;
    this.stakingContractAddress = undefined;
    Tonstakers.jettonWalletAddress = undefined;

    this.dispatchEvent(new Event("deinitialized"));
  }

  private async setupClient(wallet: any): Promise<void> {
    console.log("Initializing Tonstakers...");
    const isTestnet = wallet.account.chain === BLOCKCHAIN.CHAIN_DEV;
    const baseApiParams = this.tonApiKey
      ? {
          headers: {
            Authorization: `Bearer ${this.tonApiKey}`,
            "Content-type": "application/json",
          },
        }
      : {};
    const httpClient = new HttpClient({
      baseUrl: isTestnet ? BLOCKCHAIN.API_URL_TESTNET : BLOCKCHAIN.API_URL,
      baseApiParams,
    });
    this.client = new Api(httpClient);
    this.walletAddress = Address.parse(wallet.account.address);
    this.stakingContractAddress = Address.parse(isTestnet ? CONTRACT.STAKING_CONTRACT_ADDRESS_TESTNET : CONTRACT.STAKING_CONTRACT_ADDRESS);
    if (!Tonstakers.jettonWalletAddress) {
      Tonstakers.jettonWalletAddress = await Tonstakers.getJettonWalletAddress(this.client, this.stakingContractAddress, this.walletAddress);
    }

    this.dispatchEvent(new Event("initialized"));
  }

  async stake(amount: number): Promise<void> {
    if (!this.client || !this.stakingContractAddress || !Tonstakers.jettonWalletAddress) {
      throw new Error("Tonstakers is not fully initialized.");
    }
    try {
      await this.validateAmount(amount);
      const totalAmount = toNano(amount + CONTRACT.STAKE_FEE_RES); // Includes transaction fee
      const payload = this.preparePayload("stake", amount);
      await this.sendTransaction(this.stakingContractAddress, totalAmount, payload);
      console.log(`Staked ${amount} TON successfully.`);
    } catch (error) {
      console.error("Staking failed:", error instanceof Error ? error.message : error);
      throw new Error("Staking operation failed.");
    }
  }

  async stakeMax(): Promise<void> {
    try {
      const availableBalance = await this.getAvailableBalance();
      await this.stake(availableBalance);
      console.log(`Staked maximum amount of ${availableBalance} TON successfully.`);
    } catch (error) {
      console.error("Maximum staking failed:", error instanceof Error ? error.message : error);
      throw new Error("Maximum staking operation failed.");
    }
  }

  async unstake(amount: number): Promise<void> {
    if (!Tonstakers.jettonWalletAddress) {
      throw new Error("Jetton wallet address is not set.");
    }
    try {
      await this.validateAmount(amount);
      const payload = this.preparePayload("unstake", amount);
      await this.sendTransaction(Tonstakers.jettonWalletAddress, toNano(CONTRACT.UNSTAKE_FEE_RES), payload); // Includes transaction fee
      console.log(`Initiated unstaking of ${amount} tsTON.`);
    } catch (error) {
      console.error("Unstaking failed:", error instanceof Error ? error.message : error);
      throw new Error("Unstaking operation failed.");
    }
  }

  async unstakeInstant(amount: number): Promise<void> {
    if (!Tonstakers.jettonWalletAddress) {
      throw new Error("Jetton wallet address is not set.");
    }
    try {
      await this.validateAmount(amount);
      const payload = this.preparePayload("unstake", amount, false, true);
      await this.sendTransaction(Tonstakers.jettonWalletAddress, toNano(CONTRACT.UNSTAKE_FEE_RES), payload); // Includes transaction fee
      console.log(`Initiated instant unstaking of ${amount} tsTON.`);
    } catch (error) {
      console.error("Instant unstaking failed:", error instanceof Error ? error.message : error);
      throw new Error("Instant unstaking operation failed.");
    }
  }

  async unstakeBestRate(amount: number): Promise<void> {
    if (!Tonstakers.jettonWalletAddress) {
      throw new Error("Jetton wallet address is not set.");
    }
    try {
      await this.validateAmount(amount);
      const payload = this.preparePayload("unstake", amount, true);
      await this.sendTransaction(Tonstakers.jettonWalletAddress, toNano(CONTRACT.UNSTAKE_FEE_RES), payload); // Includes transaction fee
      console.log(`Initiated unstaking of ${amount} tsTON at the best rate.`);
    } catch (error) {
      console.error("Best rate unstaking failed:", error instanceof Error ? error.message : error);
      throw new Error("Best rate unstaking operation failed.");
    }
  }

  private preparePayload(operation: "stake" | "unstake", amount: number, waitTillRoundEnd: boolean = false, fillOrKill: boolean = false): string {
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
          .storeAddress(this.walletAddress)
          .storeMaybeRef(beginCell().storeUint(Number(waitTillRoundEnd), 1).storeUint(Number(fillOrKill), 1).endCell());
        break;
    }

    return cell.endCell().toBoc().toString("base64");
  }

  private static async getJettonWalletAddress(client: Api<any>, stakingContractAddress: Address, walletAddress: Address): Promise<Address> {
    try {
      const responsePool = await client.staking.getStakingPoolInfo(stakingContractAddress.toString());
      const jettonMinterAddress = Address.parse(responsePool.pool.liquid_jetton_master!);
      const responseJetton = await client.blockchain.execGetMethodForBlockchainAccount(jettonMinterAddress.toString(), "get_wallet_address", { args: [walletAddress.toString()] });
      return Address.parse(responseJetton.decoded.jetton_wallet_address);
    } catch (error) {
      console.error("Failed to get jetton wallet address:", error instanceof Error ? error.message : error);
      throw new Error("Could not retrieve jetton wallet address.");
    }
  }

  async getStakedBalance(): Promise<number> {
    if (!this.client || !Tonstakers.jettonWalletAddress) {
      throw new Error("Tonstakers is not fully initialized.");
    }
    try {
      const jettonWalletData = await this.client.blockchain.execGetMethodForBlockchainAccount(Tonstakers.jettonWalletAddress.toString(), "get_wallet_data");
      const formattedBalance = jettonWalletData.decoded.balance;
      console.log(`Current tsTON balance: ${formattedBalance}`);
      return formattedBalance;
    } catch {
      return 0;
    }
  }

  async getAvailableBalance(): Promise<number> {
    if (!this.client || !this.walletAddress) {
      throw new Error("Tonstakers is not fully initialized.");
    }
    try {
      const account = await this.client.accounts.getAccount(this.walletAddress.toString());
      return Number(fromNano(account.balance)) - CONTRACT.RECOMMENDED_FEE_RESERVE;
    } catch {
      return 0;
    }
  }

  async getCurrentApy(): Promise<number> {
    if (!this.client || !this.stakingContractAddress) {
      throw new Error("Tonstakers is not fully initialized.");
    }
    try {
      const response = await this.client.staking.getStakingPoolInfo(this.stakingContractAddress.toString());
      return response.pool.apy;
    } catch {
      console.error("Failed to get current APY");
      throw new Error("Could not retrieve current APY.");
    }
  }

  async getHistoricalApy(): Promise<any> {
    if (!this.client || !this.stakingContractAddress) {
      throw new Error("Tonstakers is not fully initialized.");
    }
    try {
      const response = await this.client.staking.getStakingPoolHistory(this.stakingContractAddress.toString());
      return response.apy;
    } catch {
      console.error("Failed to get historical APY");
      throw new Error("Could not retrieve historical APY.");
    }
  }

  private async validateAmount(amount: number): Promise<void> {
    if (typeof amount !== "number" || amount <= 0) {
      throw new Error("Invalid amount specified");
    }
  }

  private async sendTransaction(address: Address, amount: bigint, payload: string): Promise<void> {
    const validUntil = +new Date() + TIMING.TIMEOUT;
    const transaction = {
      validUntil,
      messages: [
        {
          address: address.toString(),
          amount: amount.toString(),
          payload,
        },
      ],
    };
    await this.connector.sendTransaction(transaction);
  }
}

export { Tonstakers };
