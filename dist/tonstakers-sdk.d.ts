import { Address } from '@ton/core';
import { ApyHistory } from 'tonapi-sdk-js';
import { NftItem } from 'tonapi-sdk-js';
import { PoolInfo } from 'tonapi-sdk-js';

declare interface IWalletConnector {
    sendTransaction: (transactionDetails: TransactionDetails) => Promise<SendTransactionResponse>;
    onStatusChange: (callback: (wallet: any) => void) => void | (() => void);
}

export declare interface MultisigData {
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

declare interface MultisigOrderAction {
    kind: MultisigOrderActionKind;
    amount: bigint;
}

declare type MultisigOrderActionKind = "stake" | "unstake";

export declare interface MultisigOrderInfo {
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

export declare interface MultisigOrderOptions {
    expirationDate?: number;
    valueForDeploy?: bigint;
    queryId?: bigint;
    orderSeqno?: bigint;
}

export declare interface MultisigUnstakeOrderOptions extends MultisigOrderOptions {
    waitTillRoundEnd?: boolean;
    fillOrKill?: boolean;
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
    fetchStakingPoolInfo(): Promise<{
        poolInfo: PoolInfo;
        poolFullData: any;
    }>;
    getCurrentApy(): Promise<number>;
    getHistoricalApy(): Promise<ApyHistory[]>;
    getTvl(): Promise<number>;
    getStakersCount(): Promise<number>;
    getRates(): Promise<any>;
    private getTonPrice;
    getStakedBalance(): Promise<number>;
    getMultisigStakedBalance(multisigAddress: string | Address): Promise<number>;
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
    private buildStakePayload;
    private buildUnstakePayload;
    private preparePayload;
    private getJettonWalletAddress;
    getMultisigData(multisigAddress: string | Address): Promise<MultisigData>;
    getMultisigPendingOrders(multisigAddress: string | Address, options?: {
        limit?: number;
        includeExpired?: boolean;
    }): Promise<MultisigOrderInfo[]>;
    createStakeOrder(multisigAddress: string | Address, amount: bigint, options?: MultisigOrderOptions): Promise<SendTransactionResponse>;
    approveMultisigOrder(orderAddress: string | Address, options?: {
        signerIndex?: number;
        queryId?: bigint;
        value?: bigint;
    }): Promise<SendTransactionResponse>;
    createUnstakeOrder(multisigAddress: string | Address, amount: bigint, options?: MultisigUnstakeOrderOptions): Promise<SendTransactionResponse>;
    private submitMultisigOrder;
    private estimateOrderValue;
    private buildMultisigSendAction;
    private static buildOrderActionsCell;
    private readOrderData;
    private parseOrderAction;
    private static toAddress;
    private static randomUint256;
    private static parseTvmNumber;
    private static tvmNum;
    private static tvmNumOpt;
    private static tvmCellOpt;
    private static tvmAddress;
    private static parseAddressDict;
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

export { }
