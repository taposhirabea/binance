import type { CaipNetwork } from '@web3modal/scaffold';
import type { ethers } from 'ethers';
import EthereumProvider from '@walletconnect/ethereum-provider';
import type { Chain } from './types.js';
export declare function getCaipDefaultChain(chain?: Chain): CaipNetwork | undefined;
export declare function hexStringToNumber(value: string): number;
export declare function numberToHexString(value: number): string;
export declare function addEthereumChain(provider: ethers.providers.Web3Provider | EthereumProvider, chain: Chain, id: string): Promise<void>;
