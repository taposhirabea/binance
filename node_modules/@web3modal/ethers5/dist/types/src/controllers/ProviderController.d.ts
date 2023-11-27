import type { ethers } from 'ethers';
import type { Address } from '../utils/types.js';
export interface ProviderControllerState {
    provider?: ethers.providers.Web3Provider;
    providerType?: 'walletConnect' | 'injected' | 'coinbaseWallet' | 'eip6963';
    address?: Address;
    chainId?: number;
    isConnected: boolean;
}
export declare const ProviderController: {
    state: ProviderControllerState;
    subscribeKey<K extends keyof ProviderControllerState>(key: K, callback: (value: ProviderControllerState[K]) => void): () => void;
    subscribe(callback: (newState: ProviderControllerState) => void): () => void;
    setProvider(provider: ProviderControllerState['provider']): void;
    setProviderType(providerType: ProviderControllerState['providerType']): void;
    setAddress(address: ProviderControllerState['address']): void;
    setChainId(chainId: ProviderControllerState['chainId']): void;
    setIsConnected(isConnected: ProviderControllerState['isConnected']): void;
    reset(): void;
};
