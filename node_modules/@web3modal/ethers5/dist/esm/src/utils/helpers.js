import { ConstantsUtil, PresetsUtil } from '@web3modal/utils';
import EthereumProvider from '@walletconnect/ethereum-provider';
export function getCaipDefaultChain(chain) {
    if (!chain) {
        return undefined;
    }
    return {
        id: `${ConstantsUtil.EIP155}:${chain.chainId}`,
        name: chain.name,
        imageId: PresetsUtil.EIP155NetworkImageIds[chain.chainId]
    };
}
export function hexStringToNumber(value) {
    const string = value.startsWith('0x') ? value.slice(2) : value;
    const number = parseInt(string, 16);
    return number;
}
export function numberToHexString(value) {
    return `0x${value.toString(16)}`;
}
export async function addEthereumChain(provider, chain, id) {
    if (id === 'walletConnect') {
        const WalletConnectProvider = provider;
        await WalletConnectProvider.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: numberToHexString(chain.chainId),
                    rpcUrls: chain.rpcUrl,
                    chainName: chain.name,
                    nativeCurrency: {
                        name: chain.currency,
                        decimals: 18,
                        symbol: chain.currency
                    },
                    blockExplorerUrls: chain.explorerUrl,
                    iconUrls: [PresetsUtil.EIP155NetworkImageIds[chain.chainId]]
                }
            ]
        });
    }
    else {
        const providerWeb3 = provider;
        await providerWeb3.send('wallet_addEthereumChain', [
            {
                chainId: numberToHexString(chain.chainId),
                rpcUrls: chain.rpcUrl,
                chainName: chain.name,
                nativeCurrency: {
                    name: chain.currency,
                    decimals: 18,
                    symbol: chain.currency
                },
                blockExplorerUrls: chain.explorerUrl,
                iconUrls: [PresetsUtil.EIP155NetworkImageIds[chain.chainId]]
            }
        ]);
    }
}
//# sourceMappingURL=helpers.js.map