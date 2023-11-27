// Import necessary modules
const { createWeb3Modal, defaultWagmiConfig, web3Button } = require('@web3modal/wagmi');
const { getAccount, signMessage  } = require('@wagmi/core');
const { mainnet, arbitrum, polygon } = require('viem/chains');

// 1. Define constants
const projectId = '53a58e69b07b6ceb3896491eb5bcdfd9';

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const chains = [mainnet, arbitrum];
const wagmiConfig = defaultWagmiConfig({ wagmiConfig, chains, projectId, metadata, ...options });

// 3. Create modal
const modal = createWeb3Modal({ wagmiConfig, projectId, chains });

// Create Ethereum client
const ethereumClient = new EthereumClient(wagmiClient, chains);

// Access the DOM and create elements programmatically
const web3ModalContainer = document.getElementById('web3ModalContainer');
const web3Modal = document.createElement('web3Modal');
web3Modal.projectId = ''; // Set your project ID here
web3Modal.ethreumClient = EthereumClient;

// Append the created element to the container
web3ModalContainer.appendChild(web3Modal);

