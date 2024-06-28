import { ApyHistory } from 'tonapi-sdk-js';

declare interface IWalletConnector {
    wallet: {
        account?: WalletAccount;
    };
    sendTransaction: (transactionDetails: TransactionDetails) => Promise<void>;
    onStatusChange: (callback: (wallet: any) => void) => void;
}

export declare class Tonstakers extends EventTarget {
    private connector;
    private client;
    private walletAddress?;
    private stakingContractAddress?;
    private referralCode;
    private static jettonWalletAddress?;
    private tonApiKey?;
    private cache;
    ready: boolean;
    constructor({ connector, referralCode, tonApiKey, cacheFor, }: TonstakersOptions);
    private setupClient;
    private initialize;
    private deinitialize;
    private setupWallet;
    fetchStakingPoolInfo(): Promise<any>;
    getCurrentApy(): Promise<number>;
    getHistoricalApy(): Promise<ApyHistory[]>;
    getRoundTimestamps(): Promise<[number, number]>;
    getTvl(): Promise<number>;
    getStakersCount(): Promise<number>;
    getRates(): Promise<any>;
    private getTonPrice;
    getStakedBalance(): Promise<number>;
    getAvailableBalance(): Promise<number>;
    stake(amount: number): Promise<void>;
    stakeMax(): Promise<void>;
    unstake(amount: number): Promise<void>;
    unstakeInstant(amount: number): Promise<void>;
    unstakeBestRate(amount: number): Promise<void>;
    private preparePayload;
    private getJettonWalletAddress;
    private validateAmount;
    private sendTransaction;
}

declare interface TonstakersOptions {
    connector: IWalletConnector;
    referralCode?: number;
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
