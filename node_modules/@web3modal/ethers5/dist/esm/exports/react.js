'use client';
import { Web3Modal } from '../src/client.js';
import { ConstantsUtil } from '@web3modal/utils';
import { ProviderController } from '../src/controllers/ProviderController.js';
import { getWeb3Modal } from '@web3modal/scaffold-react';
import { useSnapshot } from 'valtio';
let modal = undefined;
export function createWeb3Modal(options) {
    if (!modal) {
        modal = new Web3Modal({
            ...options,
            _sdkVersion: `react-ethers5-${ConstantsUtil.VERSION}`
        });
    }
    getWeb3Modal(modal);
    return modal;
}
export function useWeb3ModalSigner() {
    const state = useSnapshot(ProviderController.state);
    const walletProvider = state.provider;
    const walletProviderType = state.providerType;
    const signer = walletProvider?.getSigner();
    return {
        walletProvider,
        walletProviderType,
        signer
    };
}
export function useDisconnect() {
    async function disconnect() {
        await modal?.disconnect();
    }
    return {
        disconnect
    };
}
export function useWeb3ModalAccount() {
    const state = useSnapshot(ProviderController.state);
    const address = state.address;
    const isConnected = state.isConnected;
    const chainId = state.chainId;
    return {
        address,
        isConnected,
        chainId
    };
}
export { useWeb3ModalTheme, useWeb3Modal, useWeb3ModalState, useWeb3ModalEvents } from '@web3modal/scaffold-react';
export { defaultConfig } from '../src/utils/defaultConfig.js';
//# sourceMappingURL=react.js.map