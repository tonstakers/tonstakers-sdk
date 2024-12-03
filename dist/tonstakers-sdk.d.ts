import { ApyHistory } from 'tonapi-sdk-js';
import { NftItem } from 'tonapi-sdk-js';
import { PoolInfo } from 'tonapi-sdk-js';

declare interface IWalletConnector {
    wallet: {
        account?: WalletAccount;
    };
    sendTransaction: (transactionDetails: TransactionDetails) => Promise<void>;
    onStatusChange: (callback: (wallet: any) => void) => void;
}

declare interface NftItemWithEstimates extends NftItem {
    estimatedPayoutDateTime: number;
    roundEndTime: number;
    tsTONAmount: number;
}

export declare class Tonstakers extends EventTarget {
    private connector;
    private client;
    private walletAddress?;
    private stakingContractAddress?;
    private partnerCode;
    private static jettonWalletAddress?;
    private tonApiKey?;
    private cache;
    ready: boolean;
    isTestnet: boolean;
    constructor({ connector, partnerCode, tonApiKey, cacheFor, }: TonstakersOptions);
    private setupClient;
    private initialize;
    private deinitialize;
    private setupWallet;
    fetchStakingPoolInfo(ttl?: number): Promise<{
        poolInfo: PoolInfo;
        poolFullData: any;
    }>;
    getCurrentApy(ttl?: number): Promise<number>;
    getHistoricalApy(ttl?: number): Promise<ApyHistory[]>;
    getRoundTimestamps(): Promise<[number, number]>;
    getTvl(ttl?: number): Promise<number>;
    getStakersCount(ttl?: number): Promise<number>;
    getRates(ttl?: number): Promise<any>;
    clearStorageData(): Promise<void>;
    clearStorageUserData(): Promise<void>;
    private getTonPrice;
    getStakedBalance(ttl?: number): Promise<number>;
    getAvailableBalance(ttl?: number): Promise<number>;
    getInstantLiquidity(ttl?: number): Promise<number>;
    stake(amount: number): Promise<void>;
    stakeMax(): Promise<void>;
    unstake(amount: number): Promise<void>;
    unstakeInstant(amount: number): Promise<void>;
    unstakeBestRate(amount: number): Promise<void>;
    getActiveWithdrawalNFTs(ttl?: number): Promise<NftItemWithEstimates[]>;
    private getFilteredByAddressNFTs;
    private preparePayload;
    private getJettonWalletAddress;
    private validateAmount;
    private sendTransaction;
}

declare interface TonstakersOptions {
    connector: IWalletConnector;
    partnerCode?: number;
    tonApiKey?: string;
    cacheFor?: number;
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
