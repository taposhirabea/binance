import '@web3modal/polyfills';
import { ethers } from 'ethers';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';
export function defaultConfig(options) {
    const { enableEIP6963 = true, enableInjected = true, enableCoinbase = true, metadata, rpcUrl, defaultChainId } = options;
    let injectedProvider = undefined;
    let coinbaseProvider = undefined;
    const providers = { metadata };
    function getInjectedProvider() {
        if (injectedProvider) {
            return injectedProvider;
        }
        if (typeof window === 'undefined') {
            return undefined;
        }
        if (!window.ethereum) {
            return undefined;
        }
        injectedProvider = new ethers.providers.Web3Provider(window.ethereum, 'any');
        return injectedProvider;
    }
    function getCoinbaseProvider() {
        if (coinbaseProvider) {
            return coinbaseProvider;
        }
        if (typeof window === 'undefined') {
            return undefined;
        }
        const coinbaseWallet = new CoinbaseWalletSDK({
            appName: metadata.name,
            appLogoUrl: metadata.icons[0],
            darkMode: false
        });
        const coinbaseWalletProvider = coinbaseWallet.makeWeb3Provider(rpcUrl, defaultChainId);
        coinbaseProvider = new ethers.providers.Web3Provider(coinbaseWalletProvider, 'any');
        return coinbaseProvider;
    }
    if (enableInjected) {
        providers.injected = getInjectedProvider();
    }
    if (enableCoinbase && rpcUrl && defaultChainId) {
        providers.coinbase = getCoinbaseProvider();
    }
    if (enableEIP6963) {
        providers.EIP6963 = true;
    }
    return providers;
}
//# sourceMappingURL=defaultConfig.js.map