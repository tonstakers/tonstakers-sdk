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
    private jettonWalletAddress?;
    private walletSetupId;
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
    private static assertPositiveAmount;
    stake(amount: bigint): Promise<SendTransactionResponse>;
    stakeMax(): Promise<SendTransactionResponse>;
    unstake(amount: bigint): Promise<SendTransactionResponse>;
    unstakeInstant(amount: bigint): Promise<SendTransactionResponse>;
    unstakeBestRate(amount: bigint): Promise<SendTransactionResponse>;
    getActiveWithdrawalNFTs(): Promise<NftItemWithEstimates[]>;
    getActiveMultisigWithdrawalNFTs(multisigAddress: string | Address): Promise<NftItemWithEstimates[]>;
    private collectWithdrawalNFTs;
    private getFilteredByAddressNFTs;
    private buildStakePayload;
    private buildUnstakePayload;
    private preparePayload;
    private jettonWalletCache;
    private getJettonWalletAddress;
    private fetchJettonWalletAddress;
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
        /** If set, the order must belong to this multisig. Recommended. */
        multisigAddress?: string | Address;
    }): Promise<SendTransactionResponse>;
    createUnstakeOrder(multisigAddress: string | Address, amount: bigint, options?: MultisigUnstakeOrderOptions): Promise<SendTransactionResponse>;
    private submitMultisigOrder;
    private estimateOrderValue;
    private buildMultisigSendAction;
    private static buildOrderActionsCell;
    /**
     * Reads an order and checks it is a genuine order of its multisig
     * (address matches multisig.get_order_address(seqno)). Returns null if the
     * order can't be read or verified, or belongs to a different multisig than
     * `expectedMultisig`.
     */
    private readOrderData;
    private isGenuineOrder;
    /**
     * Describes an order only if it has exactly the shape the SDK itself
     * builds: a single send-message action to the staking contract (stake) or
     * to the multisig's own tsTON wallet with the multisig as response address
     * (unstake). Anything else returns null so the UI can't mislabel an order
     * that actually moves funds elsewhere.
     */
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
