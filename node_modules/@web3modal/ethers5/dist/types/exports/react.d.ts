/// <reference types="node" />
import type { Web3ModalOptions } from '../src/client.js';
import { Web3Modal } from '../src/client.js';
export type { Web3ModalOptions } from '../src/client.js';
export declare function createWeb3Modal(options: Web3ModalOptions): Web3Modal;
export declare function useWeb3ModalSigner(): {
    walletProvider: {
        readonly provider: {
            readonly isMetaMask?: boolean | undefined;
            readonly isStatus?: boolean | undefined;
            readonly host?: string | undefined;
            readonly path?: string | undefined;
            readonly sendAsync?: ((request: {
                method: string;
                params?: any[] | undefined;
            }, callback: (error: any, response: any) => void) => void) | undefined;
            readonly send?: ((request: {
                method: string;
                params?: any[] | undefined;
            }, callback: (error: any, response: any) => void) => void) | undefined;
            readonly request?: ((request: {
                method: string;
                params?: any[] | undefined;
            }) => Promise<any>) | undefined;
        };
        readonly jsonRpcFetchFunc: import("@ethersproject/providers").JsonRpcFetchFunc;
        readonly send: (method: string, params: any[]) => Promise<any>;
        readonly connection: {
            readonly url: string;
            readonly headers?: {
                readonly [x: string]: string | number;
            } | undefined;
            readonly user?: string | undefined;
            readonly password?: string | undefined;
            readonly allowInsecureAuthentication?: boolean | undefined;
            readonly allowGzip?: boolean | undefined;
            readonly throttleLimit?: number | undefined;
            readonly throttleSlotInterval?: number | undefined;
            readonly throttleCallback?: ((attempt: number, url: string) => Promise<boolean>) | undefined;
            readonly skipFetchSetup?: boolean | undefined;
            readonly fetchOptions?: {
                readonly [x: string]: string;
            } | undefined;
            readonly errorPassThrough?: boolean | undefined;
            readonly timeout?: number | undefined;
        };
        readonly _pendingFilter: number;
        readonly _nextId: number;
        readonly _eventLoopCache: {
            readonly [x: string]: any;
        };
        readonly _cache: {
            readonly [x: string]: any;
        };
        readonly detectNetwork: () => Promise<import("@ethersproject/networks").Network>;
        readonly _uncachedDetectNetwork: () => Promise<import("@ethersproject/networks").Network>;
        readonly getSigner: (addressOrIndex?: string | number | undefined) => import("@ethersproject/providers").JsonRpcSigner;
        readonly getUncheckedSigner: (addressOrIndex?: string | number | undefined) => {
            sendTransaction(transaction: import("@ethersproject/properties").Deferrable<import("@ethersproject/abstract-provider").TransactionRequest>): Promise<import("@ethersproject/abstract-provider").TransactionResponse>;
            readonly provider: import("@ethersproject/providers").JsonRpcProvider;
            _index: number;
            _address: string;
            connect(provider: import("@ethersproject/abstract-provider").Provider): import("@ethersproject/providers").JsonRpcSigner;
            connectUnchecked(): import("@ethersproject/providers").JsonRpcSigner;
            getAddress(): Promise<string>;
            sendUncheckedTransaction(transaction: import("@ethersproject/properties").Deferrable<import("@ethersproject/abstract-provider").TransactionRequest>): Promise<string>;
            signTransaction(transaction: import("@ethersproject/properties").Deferrable<import("@ethersproject/abstract-provider").TransactionRequest>): Promise<string>;
            signMessage(message: string | import("ethers").Bytes): Promise<string>;
            _legacySignMessage(message: string | import("ethers").Bytes): Promise<string>;
            _signTypedData(domain: import("ethers").TypedDataDomain, types: Record<string, import("ethers").TypedDataField[]>, value: Record<string, any>): Promise<string>;
            unlock(password: string): Promise<boolean>;
            readonly _isSigner: boolean;
            getBalance(blockTag?: import("@ethersproject/abstract-provider").BlockTag | undefined): Promise<import("ethers").BigNumber>;
            getTransactionCount(blockTag?: import("@ethersproject/abstract-provider").BlockTag | undefined): Promise<number>;
            estimateGas(transaction: import("@ethersproject/properties").Deferrable<import("@ethersproject/abstract-provider").TransactionRequest>): Promise<import("ethers").BigNumber>;
            call(transaction: import("@ethersproject/properties").Deferrable<import("@ethersproject/abstract-provider").TransactionRequest>, blockTag?: import("@ethersproject/abstract-provider").BlockTag | undefined): Promise<string>;
            getChainId(): Promise<number>;
            getGasPrice(): Promise<import("ethers").BigNumber>;
            getFeeData(): Promise<import("@ethersproject/abstract-provider").FeeData>;
            resolveName(name: string): Promise<string>;
            checkTransaction(transaction: import("@ethersproject/properties").Deferrable<import("@ethersproject/abstract-provider").TransactionRequest>): import("@ethersproject/properties").Deferrable<import("@ethersproject/abstract-provider").TransactionRequest>;
            populateTransaction(transaction: import("@ethersproject/properties").Deferrable<import("@ethersproject/abstract-provider").TransactionRequest>): Promise<import("@ethersproject/abstract-provider").TransactionRequest>;
            _checkProvider(operation?: string | undefined): void;
        };
        readonly listAccounts: () => Promise<string[]>;
        readonly prepareRequest: (method: string, params: any) => [string, any[]];
        readonly perform: (method: string, params: any) => Promise<any>;
        readonly _startEvent: (event: import("@ethersproject/providers/lib/base-provider.js").Event) => void;
        readonly _startPending: () => void;
        readonly _stopEvent: (event: import("@ethersproject/providers/lib/base-provider.js").Event) => void;
        readonly _networkPromise: import("@ethersproject/networks").Network;
        readonly _network: {
            readonly name: string;
            readonly chainId: number;
            readonly ensAddress?: string | undefined;
            readonly _defaultProvider?: ((providers: any, options?: any) => any) | undefined;
        };
        readonly _events: readonly {
            readonly listener: import("@ethersproject/abstract-provider").Listener;
            readonly once: boolean;
            readonly tag: string;
            readonly _lastBlockNumber: number;
            readonly _inflight: boolean;
            readonly event: string | readonly (string | readonly string[])[] | {
                readonly address?: string | undefined;
                readonly topics?: readonly (string | readonly string[] | null)[] | undefined;
            } | {
                readonly expiry: number;
                readonly _isForkEvent?: boolean | undefined;
            };
            readonly type: string;
            readonly hash: string;
            readonly filter: {
                readonly fromBlock?: import("@ethersproject/abstract-provider").BlockTag | undefined;
                readonly toBlock?: import("@ethersproject/abstract-provider").BlockTag | undefined;
                readonly address?: string | undefined;
                readonly topics?: readonly (string | readonly string[] | null)[] | undefined;
            };
            readonly pollable: () => boolean;
        }[];
        readonly formatter: {
            readonly formats: {
                readonly transaction: {
                    readonly [x: string]: import("@ethersproject/providers/lib/formatter.js").FormatFunc;
                };
                readonly transactionRequest: {
                    readonly [x: string]: import("@ethersproject/providers/lib/formatter.js").FormatFunc;
                };
                readonly receipt: {
                    readonly [x: string]: import("@ethersproject/providers/lib/formatter.js").FormatFunc;
                };
                readonly receiptLog: {
                    readonly [x: string]: import("@ethersproject/providers/lib/formatter.js").FormatFunc;
                };
                readonly block: {
                    readonly [x: string]: import("@ethersproject/providers/lib/formatter.js").FormatFunc;
                };
                readonly blockWithTransactions: {
                    readonly [x: string]: import("@ethersproject/providers/lib/formatter.js").FormatFunc;
                };
                readonly filter: {
                    readonly [x: string]: import("@ethersproject/providers/lib/formatter.js").FormatFunc;
                };
                readonly filterLog: {
                    readonly [x: string]: import("@ethersproject/providers/lib/formatter.js").FormatFunc;
                };
            };
            readonly getDefaultFormats: () => import("@ethersproject/providers/lib/formatter.js").Formats;
            readonly accessList: (accessList: any[]) => import("@ethersproject/transactions").AccessList;
            readonly number: (number: any) => number;
            readonly type: (number: any) => number;
            readonly bigNumber: (value: any) => import("ethers").BigNumber;
            readonly boolean: (value: any) => boolean;
            readonly hex: (value: any, strict?: boolean | undefined) => string;
            readonly data: (value: any, strict?: boolean | undefined) => string;
            readonly address: (value: any) => string;
            readonly callAddress: (value: any) => string;
            readonly contractAddress: (value: any) => string;
            readonly blockTag: (blockTag: any) => string;
            readonly hash: (value: any, strict?: boolean | undefined) => string;
            readonly difficulty: (value: any) => number;
            readonly uint256: (value: any) => string;
            readonly _block: (value: any, format: any) => import("@ethersproject/abstract-provider").Block;
            readonly block: (value: any) => import("@ethersproject/abstract-provider").Block;
            readonly blockWithTransactions: (value: any) => import("@ethersproject/abstract-provider").Block;
            readonly transactionRequest: (value: any) => any;
            readonly transactionResponse: (transaction: any) => import("@ethersproject/abstract-provider").TransactionResponse;
            readonly transaction: (value: any) => any;
            readonly receiptLog: (value: any) => any;
            readonly receipt: (value: any) => import("@ethersproject/abstract-provider").TransactionReceipt;
            readonly topics: (value: any) => any;
            readonly filter: (value: any) => any;
            readonly filterLog: (value: any) => any;
        };
        readonly _emitted: {
            readonly [x: string]: number | "pending";
        };
        readonly _pollingInterval: number;
        readonly _poller: {
            readonly hasRef: () => boolean;
            readonly refresh: () => NodeJS.Timer;
            readonly [Symbol.toPrimitive]: () => number;
            readonly ref: () => NodeJS.Timer;
            readonly unref: () => NodeJS.Timer;
        };
        readonly _bootstrapPoll: {
            readonly hasRef: () => boolean;
            readonly refresh: () => NodeJS.Timer;
            readonly [Symbol.toPrimitive]: () => number;
            readonly ref: () => NodeJS.Timer;
            readonly unref: () => NodeJS.Timer;
        };
        readonly _lastBlockNumber: number;
        readonly _maxFilterBlockRange: number;
        readonly _fastBlockNumber: number;
        readonly _fastBlockNumberPromise: number;
        readonly _fastQueryDate: number;
        readonly _maxInternalBlockNumber: number;
        readonly _internalBlockNumber: {
            blockNumber: number;
            reqTime: number;
            respTime: number;
        };
        readonly anyNetwork: boolean;
        readonly disableCcipRead: boolean;
        readonly _ready: () => Promise<import("@ethersproject/networks").Network>;
        readonly ready: import("@ethersproject/networks").Network;
        readonly ccipReadFetch: (tx: import("ethers").Transaction, calldata: string, urls: string[]) => Promise<string | null>;
        readonly _getInternalBlockNumber: (maxAge: number) => Promise<number>;
        readonly poll: () => Promise<void>;
        readonly resetEventsBlock: (blockNumber: number) => void;
        readonly network: {
            readonly name: string;
            readonly chainId: number;
            readonly ensAddress?: string | undefined;
            readonly _defaultProvider?: ((providers: any, options?: any) => any) | undefined;
        };
        readonly getNetwork: () => Promise<import("@ethersproject/networks").Network>;
        readonly blockNumber: number;
        readonly polling: boolean;
        readonly pollingInterval: number;
        readonly _getFastBlockNumber: () => Promise<number>;
        readonly _setFastBlockNumber: (blockNumber: number) => void;
        readonly waitForTransaction: (transactionHash: string, confirmations?: number | undefined, timeout?: number | undefined) => Promise<import("@ethersproject/abstract-provider").TransactionReceipt>;
        readonly _waitForTransaction: (transactionHash: string, confirmations: number, timeout: number, replaceable: {
            data: string;
            from: string;
            nonce: number;
            to: string;
            value: import("ethers").BigNumber;
            startBlock: number;
        }) => Promise<import("@ethersproject/abstract-provider").TransactionReceipt>;
        readonly getBlockNumber: () => Promise<number>;
        readonly getGasPrice: () => Promise<import("ethers").BigNumber>;
        readonly getBalance: (addressOrName: string | Promise<string>, blockTag?: import("@ethersproject/abstract-provider").BlockTag | Promise<import("@ethersproject/abstract-provider").BlockTag> | undefined) => Promise<import("ethers").BigNumber>;
        readonly getTransactionCount: (addressOrName: string | Promise<string>, blockTag?: import("@ethersproject/abstract-provider").BlockTag | Promise<import("@ethersproject/abstract-provider").BlockTag> | undefined) => Promise<number>;
        readonly getCode: (addressOrName: string | Promise<string>, blockTag?: import("@ethersproject/abstract-provider").BlockTag | Promise<import("@ethersproject/abstract-provider").BlockTag> | undefined) => Promise<string>;
        readonly getStorageAt: (addressOrName: string | Promise<string>, position: import("ethers").BigNumberish | Promise<import("ethers").BigNumberish>, blockTag?: import("@ethersproject/abstract-provider").BlockTag | Promise<import("@ethersproject/abstract-provider").BlockTag> | undefined) => Promise<string>;
        readonly _wrapTransaction: (tx: import("ethers").Transaction, hash?: string | undefined, startBlock?: number | undefined) => import("@ethersproject/abstract-provider").TransactionResponse;
        readonly sendTransaction: (signedTransaction: string | Promise<string>) => Promise<import("@ethersproject/abstract-provider").TransactionResponse>;
        readonly _getTransactionRequest: (transaction: import("@ethersproject/properties").Deferrable<import("@ethersproject/abstract-provider").TransactionRequest>) => Promise<import("ethers").Transaction>;
        readonly _getFilter: (filter: import("@ethersproject/abstract-provider").Filter | import("@ethersproject/abstract-provider").FilterByBlockHash | Promise<import("@ethersproject/abstract-provider").Filter | import("@ethersproject/abstract-provider").FilterByBlockHash>) => Promise<import("@ethersproject/abstract-provider").Filter | import("@ethersproject/abstract-provider").FilterByBlockHash>;
        readonly _call: (transaction: import("@ethersproject/abstract-provider").TransactionRequest, blockTag: import("@ethersproject/abstract-provider").BlockTag, attempt: number) => Promise<string>;
        readonly call: (transaction: import("@ethersproject/properties").Deferrable<import("@ethersproject/abstract-provider").TransactionRequest>, blockTag?: import("@ethersproject/abstract-provider").BlockTag | Promise<import("@ethersproject/abstract-provider").BlockTag> | undefined) => Promise<string>;
        readonly estimateGas: (transaction: import("@ethersproject/properties").Deferrable<import("@ethersproject/abstract-provider").TransactionRequest>) => Promise<import("ethers").BigNumber>;
        readonly _getAddress: (addressOrName: string | Promise<string>) => Promise<string>;
        readonly _getBlock: (blockHashOrBlockTag: import("@ethersproject/abstract-provider").BlockTag | Promise<import("@ethersproject/abstract-provider").BlockTag>, includeTransactions?: boolean | undefined) => Promise<import("@ethersproject/abstract-provider").Block | import("@ethersproject/abstract-provider").BlockWithTransactions>;
        readonly getBlock: (blockHashOrBlockTag: import("@ethersproject/abstract-provider").BlockTag | Promise<import("@ethersproject/abstract-provider").BlockTag>) => Promise<import("@ethersproject/abstract-provider").Block>;
        readonly getBlockWithTransactions: (blockHashOrBlockTag: import("@ethersproject/abstract-provider").BlockTag | Promise<import("@ethersproject/abstract-provider").BlockTag>) => Promise<import("@ethersproject/abstract-provider").BlockWithTransactions>;
        readonly getTransaction: (transactionHash: string | Promise<string>) => Promise<import("@ethersproject/abstract-provider").TransactionResponse>;
        readonly getTransactionReceipt: (transactionHash: string | Promise<string>) => Promise<import("@ethersproject/abstract-provider").TransactionReceipt>;
        readonly getLogs: (filter: import("@ethersproject/abstract-provider").Filter | import("@ethersproject/abstract-provider").FilterByBlockHash | Promise<import("@ethersproject/abstract-provider").Filter | import("@ethersproject/abstract-provider").FilterByBlockHash>) => Promise<import("@ethersproject/abstract-provider").Log[]>;
        readonly getEtherPrice: () => Promise<number>;
        readonly _getBlockTag: (blockTag: import("@ethersproject/abstract-provider").BlockTag | Promise<import("@ethersproject/abstract-provider").BlockTag>) => Promise<import("@ethersproject/abstract-provider").BlockTag>;
        readonly getResolver: (name: string) => Promise<import("@ethersproject/providers").Resolver | null>;
        readonly _getResolver: (name: string, operation?: string | undefined) => Promise<string>;
        readonly resolveName: (name: string | Promise<string>) => Promise<string | null>;
        readonly lookupAddress: (address: string | Promise<string>) => Promise<string | null>;
        readonly getAvatar: (nameOrAddress: string) => Promise<string | null>;
        readonly _addEventListener: (eventName: import("@ethersproject/abstract-provider").EventType, listener: import("@ethersproject/abstract-provider").Listener, once: boolean) => import("@ethersproject/providers").Web3Provider;
        readonly on: (eventName: import("@ethersproject/abstract-provider").EventType, listener: import("@ethersproject/abstract-provider").Listener) => import("@ethersproject/providers").Web3Provider;
        readonly once: (eventName: import("@ethersproject/abstract-provider").EventType, listener: import("@ethersproject/abstract-provider").Listener) => import("@ethersproject/providers").Web3Provider;
        readonly emit: (eventName: import("@ethersproject/abstract-provider").EventType, ...args: any[]) => boolean;
        readonly listenerCount: (eventName?: import("@ethersproject/abstract-provider").EventType | undefined) => number;
        readonly listeners: (eventName?: import("@ethersproject/abstract-provider").EventType | undefined) => import("@ethersproject/abstract-provider").Listener[];
        readonly off: (eventName: import("@ethersproject/abstract-provider").EventType, listener?: import("@ethersproject/abstract-provider").Listener | undefined) => import("@ethersproject/providers").Web3Provider;
        readonly removeAllListeners: (eventName?: import("@ethersproject/abstract-provider").EventType | undefined) => import("@ethersproject/providers").Web3Provider;
        readonly getFeeData: () => Promise<import("@ethersproject/abstract-provider").FeeData>;
        readonly addListener: (eventName: import("@ethersproject/abstract-provider").EventType, listener: import("@ethersproject/abstract-provider").Listener) => import("@ethersproject/abstract-provider").Provider;
        readonly removeListener: (eventName: import("@ethersproject/abstract-provider").EventType, listener: import("@ethersproject/abstract-provider").Listener) => import("@ethersproject/abstract-provider").Provider;
        readonly _isProvider: boolean;
    } | undefined;
    walletProviderType: "walletConnect" | "injected" | "coinbaseWallet" | "eip6963" | undefined;
    signer: import("@ethersproject/providers").JsonRpcSigner | undefined;
};
export declare function useDisconnect(): {
    disconnect: () => Promise<void>;
};
export declare function useWeb3ModalAccount(): {
    address: `0x${string}` | undefined;
    isConnected: boolean;
    chainId: number | undefined;
};
export { useWeb3ModalTheme, useWeb3Modal, useWeb3ModalState, useWeb3ModalEvents } from '@web3modal/scaffold-react';
export { defaultConfig } from '../src/utils/defaultConfig.js';
