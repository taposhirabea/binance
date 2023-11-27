import { Web3ModalScaffold } from '@web3modal/scaffold';
import { ConstantsUtil, PresetsUtil, HelpersUtil } from '@web3modal/utils';
import EthereumProvider from '@walletconnect/ethereum-provider';
import { ethers, utils } from 'ethers';
import { ProviderController } from './controllers/ProviderController.js';
import { addEthereumChain, getCaipDefaultChain, hexStringToNumber, numberToHexString } from './utils/helpers.js';
import { ERROR_CODE_DEFAULT, ERROR_CODE_UNRECOGNIZED_CHAIN_ID, WALLET_ID } from './utils/constants.js';
export class Web3Modal extends Web3ModalScaffold {
    constructor(options) {
        const { ethersConfig, chains, defaultChain, tokens, chainImages, _sdkVersion, ...w3mOptions } = options;
        if (!ethersConfig) {
            throw new Error('web3modal:constructor - ethersConfig is undefined');
        }
        if (!w3mOptions.projectId) {
            throw new Error('web3modal:constructor - projectId is undefined');
        }
        const networkControllerClient = {
            switchCaipNetwork: async (caipNetwork) => {
                const chainId = HelpersUtil.caipNetworkIdToNumber(caipNetwork?.id);
                if (chainId) {
                    await this.switchNetwork(chainId);
                }
            },
            getApprovedCaipNetworksData: async () => new Promise(async (resolve) => {
                const walletChoice = localStorage.getItem(WALLET_ID);
                if (walletChoice?.includes(ConstantsUtil.WALLET_CONNECT_CONNECTOR_ID)) {
                    const provider = await this.getWalletConnectProvider();
                    if (!provider) {
                        throw new Error('networkControllerClient:getApprovedCaipNetworks - connector is undefined');
                    }
                    const ns = (provider?.provider).signer?.session?.namespaces;
                    const nsMethods = ns?.[ConstantsUtil.EIP155]?.methods;
                    const nsChains = ns?.[ConstantsUtil.EIP155]?.chains;
                    const result = {
                        supportsAllNetworks: nsMethods?.includes(ConstantsUtil.ADD_CHAIN_METHOD) ?? false,
                        approvedCaipNetworkIds: nsChains
                    };
                    resolve(result);
                }
                else {
                    const result = {
                        approvedCaipNetworkIds: undefined,
                        supportsAllNetworks: true
                    };
                    resolve(result);
                }
            })
        };
        const connectionControllerClient = {
            connectWalletConnect: async (onUri) => {
                const connector = await this.getWalletConnectProvider();
                if (!connector) {
                    throw new Error('connectionControllerClient:getWalletConnectUri - connector is undefined');
                }
                const WalletConnectProvider = connector.provider;
                WalletConnectProvider.on('display_uri', (uri) => {
                    onUri(uri);
                });
                await WalletConnectProvider.connect();
                await this.setWalletConnectProvider();
            },
            connectExternal: async ({ id, info, provider }) => {
                if (id === ConstantsUtil.INJECTED_CONNECTOR_ID) {
                    const InjectedProvider = ethersConfig.injected;
                    if (!InjectedProvider) {
                        throw new Error('connectionControllerClient:connectInjected - connector is undefined');
                    }
                    await InjectedProvider.send('eth_requestAccounts', []);
                    this.setInjectedProvider(ethersConfig);
                }
                else if (id === ConstantsUtil.EIP6963_CONNECTOR_ID && info && provider) {
                    const EIP6963Provider = provider;
                    const EIP6963Info = info;
                    await EIP6963Provider.send('eth_requestAccounts', []);
                    this.setEIP6963Provider(EIP6963Provider, EIP6963Info.name);
                }
                else if (id === ConstantsUtil.COINBASE_CONNECTOR_ID) {
                    const CoinbaseProvider = ethersConfig.coinbase;
                    if (!CoinbaseProvider) {
                        throw new Error('connectionControllerClient:connectCoinbase - connector is undefined');
                    }
                    await CoinbaseProvider.send('eth_requestAccounts', []);
                    this.setCoinbaseProvider(ethersConfig);
                }
            },
            checkInstalled(ids) {
                if (!ids) {
                    return Boolean(window.ethereum);
                }
                if (ethersConfig.injected) {
                    if (!window?.ethereum) {
                        return false;
                    }
                }
                return ids.some(id => Boolean(window.ethereum?.[String(id)]));
            },
            disconnect: async () => {
                const provider = ProviderController.state.provider;
                const providerType = ProviderController.state.providerType;
                localStorage.removeItem(WALLET_ID);
                ProviderController.reset();
                if (providerType === ConstantsUtil.WALLET_CONNECT_CONNECTOR_ID) {
                    const WalletConnectProvider = provider?.provider;
                    await WalletConnectProvider.disconnect();
                }
                else if (provider) {
                    provider.emit('disconnect');
                }
            }
        };
        super({
            networkControllerClient,
            connectionControllerClient,
            defaultChain: getCaipDefaultChain(defaultChain),
            tokens: HelpersUtil.getCaipTokens(tokens),
            _sdkVersion: _sdkVersion ?? `html-ethers5-${ConstantsUtil.VERSION}`,
            ...w3mOptions
        });
        this.hasSyncedConnectedAccount = false;
        this.EIP6963Providers = [];
        this.options = undefined;
        this.options = options;
        this.metadata = ethersConfig.metadata;
        this.projectId = w3mOptions.projectId;
        this.chains = chains;
        this.createProvider();
        ProviderController.subscribeKey('address', () => {
            this.syncAccount();
        });
        ProviderController.subscribeKey('chainId', () => {
            this.syncNetwork(chainImages);
        });
        this.syncRequestedNetworks(chains, chainImages);
        this.syncConnectors(ethersConfig);
        if (ethersConfig.EIP6963) {
            if (typeof window !== 'undefined') {
                this.listenConnectors(ethersConfig.EIP6963);
                this.checkActive6963Provider();
            }
        }
        if (ethersConfig.injected) {
            this.checkActiveInjectedProvider(ethersConfig);
        }
        if (ethersConfig.coinbase) {
            this.checkActiveCoinbaseProvider(ethersConfig);
        }
    }
    getState() {
        const state = super.getState();
        return {
            ...state,
            selectedNetworkId: HelpersUtil.caipNetworkIdToNumber(state.selectedNetworkId)
        };
    }
    subscribeState(callback) {
        return super.subscribeState(state => callback({
            ...state,
            selectedNetworkId: HelpersUtil.caipNetworkIdToNumber(state.selectedNetworkId)
        }));
    }
    getAddress() {
        return ProviderController.state.address;
    }
    getChainId() {
        return ProviderController.state.chainId;
    }
    getIsConnected() {
        return ProviderController.state.isConnected;
    }
    getWalletProvider() {
        return ProviderController.state.provider;
    }
    getWalletProviderType() {
        return ProviderController.state.providerType;
    }
    getSigner() {
        return ProviderController.state.provider?.getSigner();
    }
    subscribeProvider(callback) {
        return ProviderController.subscribe(callback);
    }
    async disconnect() {
        const { provider, providerType } = ProviderController.state;
        localStorage.removeItem(WALLET_ID);
        ProviderController.reset();
        if (providerType === 'injected' || providerType === 'eip6963') {
            provider?.emit('disconnect');
        }
        else {
            const ethersProvider = provider?.provider;
            await ethersProvider.disconnect();
        }
    }
    createProvider() {
        if (!this.walletConnectProviderInitPromise && typeof window !== 'undefined') {
            this.walletConnectProviderInitPromise = this.initWalletConnectProvider();
        }
        return this.walletConnectProviderInitPromise;
    }
    async initWalletConnectProvider() {
        const walletConnectProviderOptions = {
            projectId: this.projectId,
            showQrModal: false,
            rpcMap: this.chains
                ? this.chains.reduce((map, chain) => {
                    map[chain.chainId] = chain.rpcUrl;
                    return map;
                }, {})
                : {},
            optionalChains: this.chains ? [0, ...this.chains.map(chain => chain.chainId)] : [0],
            metadata: {
                name: this.metadata ? this.metadata.name : '',
                description: this.metadata ? this.metadata.description : '',
                url: this.metadata ? this.metadata.url : '',
                icons: this.metadata ? this.metadata.icons : ['']
            }
        };
        this.walletConnectProvider = await EthereumProvider.init(walletConnectProviderOptions);
        this.ethersWalletConnectProvider = new ethers.providers.Web3Provider(this.walletConnectProvider, 'any');
        await this.checkActiveWalletConnectProvider();
    }
    async getWalletConnectProvider() {
        if (!this.ethersWalletConnectProvider) {
            await this.createProvider();
        }
        return this.ethersWalletConnectProvider;
    }
    syncRequestedNetworks(chains, chainImages) {
        const requestedCaipNetworks = chains?.map(chain => ({
            id: `${ConstantsUtil.EIP155}:${chain.chainId}`,
            name: chain.name,
            imageId: PresetsUtil.EIP155NetworkImageIds[chain.chainId],
            imageUrl: chainImages?.[chain.chainId]
        }));
        this.setRequestedCaipNetworks(requestedCaipNetworks ?? []);
    }
    async checkActiveWalletConnectProvider() {
        const provider = await this.getWalletConnectProvider();
        const WalletConnectProvider = provider?.provider;
        const walletId = localStorage.getItem(WALLET_ID);
        if (WalletConnectProvider) {
            if (walletId === ConstantsUtil.WALLET_CONNECT_CONNECTOR_ID) {
                await this.setWalletConnectProvider();
            }
        }
    }
    checkActiveInjectedProvider(config) {
        const InjectedProvider = config.injected?.provider;
        const walletId = localStorage.getItem(WALLET_ID);
        if (InjectedProvider) {
            if (walletId === ConstantsUtil.INJECTED_CONNECTOR_ID) {
                this.setInjectedProvider(config);
                this.watchInjected(config);
            }
        }
    }
    checkActiveCoinbaseProvider(config) {
        const CoinbaseProvider = config.coinbase?.provider;
        const walletId = localStorage.getItem(WALLET_ID);
        if (CoinbaseProvider) {
            if (walletId === ConstantsUtil.COINBASE_CONNECTOR_ID) {
                if (CoinbaseProvider._addresses && CoinbaseProvider._addresses?.length > 0) {
                    this.setCoinbaseProvider(config);
                    this.watchCoinbase(config);
                }
                else {
                    localStorage.removeItem(WALLET_ID);
                    ProviderController.reset();
                }
            }
        }
    }
    checkActive6963Provider() {
        const currentActiveWallet = window?.localStorage.getItem(WALLET_ID);
        if (currentActiveWallet) {
            const currentProvider = this.EIP6963Providers.find(provider => provider.name === currentActiveWallet);
            if (currentProvider) {
                this.setEIP6963Provider(currentProvider.provider, currentProvider.name);
            }
        }
    }
    async setWalletConnectProvider() {
        window?.localStorage.setItem(WALLET_ID, ConstantsUtil.WALLET_CONNECT_CONNECTOR_ID);
        const provider = await this.getWalletConnectProvider();
        const WalletConnectProvider = provider?.provider;
        if (WalletConnectProvider) {
            ProviderController.setChainId(WalletConnectProvider.chainId);
            ProviderController.setProviderType('walletConnect');
            ProviderController.setProvider(provider);
            ProviderController.setIsConnected(true);
            ProviderController.setAddress(WalletConnectProvider.accounts[0]);
            this.watchWalletConnect();
        }
    }
    async setInjectedProvider(config) {
        window?.localStorage.setItem(WALLET_ID, ConstantsUtil.INJECTED_CONNECTOR_ID);
        const InjectedProvider = config.injected;
        if (InjectedProvider) {
            const signer = InjectedProvider.getSigner();
            const chainId = await signer.getChainId();
            const address = await signer.getAddress();
            if (address && chainId) {
                ProviderController.setChainId(chainId);
                ProviderController.setProviderType('injected');
                ProviderController.setProvider(config.injected);
                ProviderController.setIsConnected(true);
                ProviderController.setAddress(address);
                this.watchCoinbase(config);
            }
        }
    }
    async setEIP6963Provider(provider, name) {
        window?.localStorage.setItem(WALLET_ID, name);
        if (provider) {
            const signer = provider.getSigner();
            const chainId = await signer.getChainId();
            const address = await signer.getAddress();
            if (address && chainId) {
                ProviderController.setChainId(chainId);
                ProviderController.setProviderType('eip6963');
                ProviderController.setProvider(provider);
                ProviderController.setIsConnected(true);
                ProviderController.setAddress(address);
                this.watchEIP6963(provider);
            }
        }
    }
    async setCoinbaseProvider(config) {
        window?.localStorage.setItem(WALLET_ID, ConstantsUtil.COINBASE_CONNECTOR_ID);
        const CoinbaseProvider = config.coinbase;
        if (CoinbaseProvider) {
            const signer = CoinbaseProvider.getSigner();
            const chainId = await signer.getChainId();
            const address = await signer.getAddress();
            if (address && chainId) {
                ProviderController.setChainId(chainId);
                ProviderController.setProviderType('coinbaseWallet');
                ProviderController.setProvider(config.coinbase);
                ProviderController.setIsConnected(true);
                ProviderController.setAddress(address);
                this.watchCoinbase(config);
            }
        }
    }
    async watchWalletConnect() {
        const provider = await this.getWalletConnectProvider();
        const WalletConnectProvider = provider?.provider;
        function disconnectHandler() {
            localStorage.removeItem(WALLET_ID);
            ProviderController.reset();
            WalletConnectProvider.removeListener('disconnect', disconnectHandler);
            WalletConnectProvider.removeListener('accountsChanged', accountsChangedHandler);
            WalletConnectProvider.removeListener('chainChanged', chainChangedHandler);
        }
        function chainChangedHandler(chainId) {
            if (chainId) {
                const chain = hexStringToNumber(chainId);
                ProviderController.setChainId(chain);
            }
        }
        const accountsChangedHandler = async (accounts) => {
            if (accounts.length > 0) {
                await this.setWalletConnectProvider();
            }
        };
        if (WalletConnectProvider) {
            WalletConnectProvider.on('disconnect', disconnectHandler);
            WalletConnectProvider.on('accountsChanged', accountsChangedHandler);
            WalletConnectProvider.on('chainChanged', chainChangedHandler);
        }
    }
    watchInjected(config) {
        const provider = config.injected;
        const InjectedProvider = provider?.provider;
        function disconnectHandler() {
            localStorage.removeItem(WALLET_ID);
            ProviderController.reset();
            InjectedProvider.removeListener('disconnect', disconnectHandler);
            InjectedProvider.removeListener('accountsChanged', accountsChangedHandler);
            InjectedProvider.removeListener('chainChanged', chainChangedHandler);
        }
        function accountsChangedHandler(accounts) {
            if (accounts.length === 0) {
                localStorage.removeItem(WALLET_ID);
                ProviderController.reset();
            }
            else {
                ProviderController.setAddress(accounts[0]);
            }
        }
        function chainChangedHandler(chainId) {
            if (chainId) {
                const chain = typeof chainId === 'string' ? hexStringToNumber(chainId) : Number(chainId);
                ProviderController.setChainId(chain);
            }
        }
        if (InjectedProvider && provider) {
            provider.on('disconnect', disconnectHandler);
            InjectedProvider.on('disconnect', disconnectHandler);
            InjectedProvider.on('accountsChanged', accountsChangedHandler);
            InjectedProvider.on('chainChanged', chainChangedHandler);
        }
    }
    watchEIP6963(provider) {
        const EIP6963Provider = provider.provider;
        function disconnectHandler() {
            localStorage.removeItem(WALLET_ID);
            ProviderController.reset();
            EIP6963Provider.removeListener('disconnect', disconnectHandler);
            EIP6963Provider.removeListener('accountsChanged', accountsChangedHandler);
            EIP6963Provider.removeListener('chainChanged', chainChangedHandler);
        }
        function accountsChangedHandler(accounts) {
            if (accounts.length === 0) {
                localStorage.removeItem(WALLET_ID);
                ProviderController.reset();
            }
            else {
                ProviderController.setAddress(accounts[0]);
            }
        }
        function chainChangedHandler(chainId) {
            if (chainId) {
                const chain = typeof chainId === 'string' ? hexStringToNumber(chainId) : Number(chainId);
                ProviderController.setChainId(chain);
            }
        }
        if (EIP6963Provider) {
            provider.on('disconnect', disconnectHandler);
            EIP6963Provider.on('disconnect', disconnectHandler);
            EIP6963Provider.on('accountsChanged', accountsChangedHandler);
            EIP6963Provider.on('chainChanged', chainChangedHandler);
        }
    }
    watchCoinbase(config) {
        const provider = config.coinbase;
        const CoinbaseProvider = provider?.provider;
        const walletId = localStorage.getItem(WALLET_ID);
        function disconnectHandler() {
            localStorage.removeItem(WALLET_ID);
            ProviderController.reset();
            CoinbaseProvider.removeListener('disconnect', disconnectHandler);
            CoinbaseProvider.removeListener('accountsChanged', accountsChangedHandler);
            CoinbaseProvider.removeListener('chainChanged', chainChangedHandler);
        }
        function accountsChangedHandler(accounts) {
            if (accounts.length === 0) {
                localStorage.removeItem(WALLET_ID);
                ProviderController.reset();
            }
            else {
                ProviderController.setAddress(accounts[0]);
            }
        }
        function chainChangedHandler(chainId) {
            if (chainId && walletId === ConstantsUtil.COINBASE_CONNECTOR_ID) {
                const chain = Number(chainId);
                ProviderController.setChainId(chain);
            }
        }
        if (CoinbaseProvider && provider) {
            provider.on('disconnect', disconnectHandler);
            CoinbaseProvider.on('disconnect', disconnectHandler);
            CoinbaseProvider.on('accountsChanged', accountsChangedHandler);
            CoinbaseProvider.on('chainChanged', chainChangedHandler);
        }
    }
    async syncAccount() {
        const address = ProviderController.state.address;
        const chainId = ProviderController.state.chainId;
        const isConnected = ProviderController.state.isConnected;
        this.resetAccount();
        if (isConnected && address && chainId) {
            const caipAddress = `${ConstantsUtil.EIP155}:${chainId}:${address}`;
            this.setIsConnected(isConnected);
            this.setCaipAddress(caipAddress);
            await Promise.all([
                this.syncProfile(address),
                this.syncBalance(address),
                this.getApprovedCaipNetworksData()
            ]);
            this.hasSyncedConnectedAccount = true;
        }
        else if (!isConnected && this.hasSyncedConnectedAccount) {
            this.resetWcConnection();
            this.resetNetwork();
        }
    }
    async syncNetwork(chainImages) {
        const address = ProviderController.state.address;
        const chainId = ProviderController.state.chainId;
        const isConnected = ProviderController.state.isConnected;
        if (this.chains) {
            const chain = this.chains.find(c => c.chainId === chainId);
            if (chain) {
                const caipChainId = `${ConstantsUtil.EIP155}:${chain.chainId}`;
                this.setCaipNetwork({
                    id: caipChainId,
                    name: chain.name,
                    imageId: PresetsUtil.EIP155NetworkImageIds[chain.chainId],
                    imageUrl: chainImages?.[chain.chainId]
                });
                if (isConnected && address) {
                    const caipAddress = `${ConstantsUtil.EIP155}:${chainId}:${address}`;
                    this.setCaipAddress(caipAddress);
                    if (chain.explorerUrl) {
                        const url = `${chain.explorerUrl}/address/${address}`;
                        this.setAddressExplorerUrl(url);
                    }
                    else {
                        this.setAddressExplorerUrl(undefined);
                    }
                    if (this.hasSyncedConnectedAccount) {
                        await this.syncBalance(address);
                    }
                }
            }
        }
    }
    async syncProfile(address) {
        const ensProvider = new ethers.providers.InfuraProvider('mainnet');
        const name = await ensProvider.lookupAddress(address);
        const avatar = await ensProvider.getAvatar(address);
        if (name) {
            this.setProfileName(name);
        }
        if (avatar) {
            this.setProfileImage(avatar);
        }
    }
    async syncBalance(address) {
        const chainId = ProviderController.state.chainId;
        if (chainId && this.chains) {
            const chain = this.chains.find(c => c.chainId === chainId);
            if (chain) {
                const JsonRpcProvider = new ethers.providers.JsonRpcProvider(chain.rpcUrl, {
                    chainId,
                    name: chain.name
                });
                if (JsonRpcProvider) {
                    const balance = await JsonRpcProvider.getBalance(address);
                    const formattedBalance = utils.formatEther(balance);
                    this.setBalance(formattedBalance, chain.currency);
                }
            }
        }
    }
    async switchNetwork(chainId) {
        const provider = ProviderController.state.provider;
        const providerType = ProviderController.state.providerType;
        if (this.chains) {
            const chain = this.chains.find(c => c.chainId === chainId);
            if (providerType === ConstantsUtil.WALLET_CONNECT_CONNECTOR_ID && chain) {
                const WalletConnectProvider = provider?.provider;
                if (WalletConnectProvider) {
                    try {
                        await WalletConnectProvider.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: numberToHexString(chain.chainId) }]
                        });
                        ProviderController.setChainId(chainId);
                    }
                    catch (switchError) {
                        if (switchError.code === ERROR_CODE_UNRECOGNIZED_CHAIN_ID ||
                            switchError.code === ERROR_CODE_DEFAULT ||
                            switchError?.data?.originalError?.code === ERROR_CODE_UNRECOGNIZED_CHAIN_ID) {
                            await addEthereumChain(WalletConnectProvider, chain, ConstantsUtil.WALLET_CONNECT_CONNECTOR_ID);
                        }
                        else {
                            throw new Error('Chain is not supported');
                        }
                    }
                }
            }
            else if (providerType === ConstantsUtil.INJECTED_CONNECTOR_ID && chain) {
                const InjectedProvider = provider;
                if (InjectedProvider) {
                    try {
                        await InjectedProvider.send('wallet_switchEthereumChain', [
                            { chainId: numberToHexString(chain.chainId) }
                        ]);
                        ProviderController.setChainId(chain.chainId);
                    }
                    catch (switchError) {
                        if (switchError.code === ERROR_CODE_UNRECOGNIZED_CHAIN_ID ||
                            switchError.code === ERROR_CODE_DEFAULT ||
                            switchError?.data?.originalError?.code === ERROR_CODE_UNRECOGNIZED_CHAIN_ID) {
                            await addEthereumChain(InjectedProvider, chain, ConstantsUtil.INJECTED_CONNECTOR_ID);
                        }
                        else {
                            throw new Error('Chain is not supported');
                        }
                    }
                }
            }
            else if (providerType === ConstantsUtil.EIP6963_CONNECTOR_ID && chain) {
                const EIP6963Provider = provider;
                if (EIP6963Provider) {
                    try {
                        await EIP6963Provider.send('wallet_switchEthereumChain', [
                            { chainId: numberToHexString(chain.chainId) }
                        ]);
                        ProviderController.setChainId(chain.chainId);
                    }
                    catch (switchError) {
                        if (switchError.code === ERROR_CODE_UNRECOGNIZED_CHAIN_ID ||
                            switchError.code === ERROR_CODE_DEFAULT ||
                            switchError?.data?.originalError?.code === ERROR_CODE_UNRECOGNIZED_CHAIN_ID) {
                            await addEthereumChain(EIP6963Provider, chain, ConstantsUtil.INJECTED_CONNECTOR_ID);
                        }
                        else {
                            throw new Error('Chain is not supported');
                        }
                    }
                }
            }
            else if (providerType === ConstantsUtil.COINBASE_CONNECTOR_ID && chain) {
                const CoinbaseProvider = provider;
                if (CoinbaseProvider) {
                    try {
                        await CoinbaseProvider.send('wallet_switchEthereumChain', [
                            { chainId: numberToHexString(chain.chainId) }
                        ]);
                        ProviderController.setChainId(chain.chainId);
                    }
                    catch (switchError) {
                        if (switchError.code === ERROR_CODE_UNRECOGNIZED_CHAIN_ID ||
                            switchError.code === ERROR_CODE_DEFAULT ||
                            switchError?.data?.originalError?.code === ERROR_CODE_UNRECOGNIZED_CHAIN_ID) {
                            await addEthereumChain(CoinbaseProvider, chain, ConstantsUtil.INJECTED_CONNECTOR_ID);
                        }
                    }
                }
            }
        }
    }
    syncConnectors(config) {
        const w3mConnectors = [];
        const connectorType = PresetsUtil.ConnectorTypesMap[ConstantsUtil.WALLET_CONNECT_CONNECTOR_ID];
        if (connectorType) {
            w3mConnectors.push({
                id: ConstantsUtil.WALLET_CONNECT_CONNECTOR_ID,
                explorerId: PresetsUtil.ConnectorExplorerIds[ConstantsUtil.WALLET_CONNECT_CONNECTOR_ID],
                imageId: PresetsUtil.ConnectorImageIds[ConstantsUtil.WALLET_CONNECT_CONNECTOR_ID],
                imageUrl: this.options?.connectorImages?.[ConstantsUtil.WALLET_CONNECT_CONNECTOR_ID],
                name: PresetsUtil.ConnectorNamesMap[ConstantsUtil.WALLET_CONNECT_CONNECTOR_ID],
                type: connectorType
            });
        }
        if (config.injected) {
            const injectedConnectorType = PresetsUtil.ConnectorTypesMap[ConstantsUtil.INJECTED_CONNECTOR_ID];
            if (injectedConnectorType) {
                w3mConnectors.push({
                    id: ConstantsUtil.INJECTED_CONNECTOR_ID,
                    explorerId: PresetsUtil.ConnectorExplorerIds[ConstantsUtil.INJECTED_CONNECTOR_ID],
                    imageId: PresetsUtil.ConnectorImageIds[ConstantsUtil.INJECTED_CONNECTOR_ID],
                    imageUrl: this.options?.connectorImages?.[ConstantsUtil.INJECTED_CONNECTOR_ID],
                    name: PresetsUtil.ConnectorNamesMap[ConstantsUtil.INJECTED_CONNECTOR_ID],
                    type: injectedConnectorType
                });
            }
        }
        if (config.coinbase) {
            w3mConnectors.push({
                id: ConstantsUtil.COINBASE_CONNECTOR_ID,
                explorerId: PresetsUtil.ConnectorExplorerIds[ConstantsUtil.COINBASE_CONNECTOR_ID],
                imageId: PresetsUtil.ConnectorImageIds[ConstantsUtil.COINBASE_CONNECTOR_ID],
                imageUrl: this.options?.connectorImages?.[ConstantsUtil.COINBASE_CONNECTOR_ID],
                name: PresetsUtil.ConnectorNamesMap[ConstantsUtil.COINBASE_CONNECTOR_ID],
                type: 'EXTERNAL'
            });
        }
        this.setConnectors(w3mConnectors);
    }
    eip6963EventHandler(event) {
        if (event.detail) {
            const { info, provider } = event.detail;
            const connectors = this.getConnectors();
            const existingConnector = connectors.find(c => c.name === info.name);
            if (!existingConnector) {
                const eip6963Provider = provider;
                const web3provider = new ethers.providers.Web3Provider(eip6963Provider, 'any');
                const type = PresetsUtil.ConnectorTypesMap[ConstantsUtil.EIP6963_CONNECTOR_ID];
                if (type) {
                    this.addConnector({
                        id: ConstantsUtil.EIP6963_CONNECTOR_ID,
                        type,
                        imageUrl: info.icon ?? this.options?.connectorImages?.[ConstantsUtil.EIP6963_CONNECTOR_ID],
                        name: info.name,
                        provider: web3provider,
                        info
                    });
                    const eip6963ProviderObj = {
                        name: info.name,
                        provider: web3provider
                    };
                    this.EIP6963Providers.push(eip6963ProviderObj);
                }
            }
        }
    }
    listenConnectors(enableEIP6963) {
        if (typeof window !== 'undefined' && enableEIP6963) {
            const handler = this.eip6963EventHandler.bind(this);
            window.addEventListener(ConstantsUtil.EIP6963_ANNOUNCE_EVENT, handler);
            window.dispatchEvent(new Event(ConstantsUtil.EIP6963_REQUEST_EVENT));
        }
    }
}
//# sourceMappingURL=client.js.map