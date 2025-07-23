import { ApyHistory } from 'tonapi-sdk-js';
import { NftItem } from 'tonapi-sdk-js';
import { PoolInfo } from 'tonapi-sdk-js';

declare interface IWalletConnector {
    wallet: {
        account?: WalletAccount;
    };
    sendTransaction: (transactionDetails: TransactionDetails) => Promise<SendTransactionResponse>;
    onStatusChange: (callback: (wallet: any) => void) => void;
}

declare interface NftItemWithEstimates extends NftItem {
    estimatedPayoutDateTime: number;
    roundEndTime: number;
    tsTONAmount: number;
}

declare interface SendTransactionResponse {
    boc: string;
}

export declare class Tonstakers extends EventTarget {
    private connector;
    private client;
    private walletAddress?;
    private stakingContractAddress?;
    private partnerCode;
    private static jettonWalletAddress?;
    private tonApiKey?;
    ready: boolean;
    isTestnet: boolean;
    constructor({ connector, partnerCode, tonApiKey, }: TonstakersOptions);
    private getWithdrawalPayouts;
    private setupClient;
    private initialize;
    private deinitialize;
    private setupWallet;
    fetchStakingPoolInfo(ttl?: number): Promise<{
        poolInfo: PoolInfo;
        poolFullData: any;
    }>;
    getCurrentApy(ttl?: number): Promise<number>;
    getHistoricalApy(): Promise<ApyHistory[]>;
    getTvl(ttl?: number): Promise<number>;
    getStakersCount(ttl?: number): Promise<number>;
    getRates(): Promise<any>;
    private getTonPrice;
    getStakedBalance(): Promise<number>;
    getBalance(): Promise<number>;
    getAvailableBalance(): Promise<number>;
    getInstantLiquidity(): Promise<number>;
    stake(amount: bigint): Promise<SendTransactionResponse>;
    stakeMax(): Promise<SendTransactionResponse>;
    unstake(amount: bigint): Promise<SendTransactionResponse>;
    unstakeInstant(amount: bigint): Promise<SendTransactionResponse>;
    unstakeBestRate(amount: bigint): Promise<SendTransactionResponse>;
    getActiveWithdrawalNFTs(): Promise<NftItemWithEstimates[]>;
    private getFilteredByAddressNFTs;
    private preparePayload;
    private getJettonWalletAddress;
    private sendTransaction;
}

declare interface TonstakersOptions {
    connector: IWalletConnector;
    partnerCode?: number;
    tonApiKey?: string;
}

declare interface TransactionDetails {
    validUntil: number;
    messages: TransactionMessage[];
}

declare interface TransactionMessage {
    address: string;
    amount: string;
    payload: string;
}

declare interface WalletAccount {
    address: string;
    chain: string;
}

export { }
