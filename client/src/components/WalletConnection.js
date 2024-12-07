import React, { useState } from 'react';
import { FaWallet, FaTimes } from 'react-icons/fa';

// Wallet connection options with their details
const walletOptions = [
  {
    name: 'MetaMask',
    logo: '/metamask-logo.png', // You'll need to add this logo to your public folder
    deepLink: 'https://metamask.app.link/dapp/your-tg-mini-app-url',
    chainDetails: {
      chainId: '0x1389', // Mantle Chain ID in hex
      chainName: 'Mantle',
      nativeCurrency: {
        name: 'MNT',
        symbol: 'MNT',
        decimals: 18
      },
      rpcUrls: ['https://rpc.mantle.xyz'],
      blockExplorerUrls: ['https://explorer.mantle.xyz']
    }
  },
  {
    name: 'Trust Wallet',
    logo: '/trust-wallet-logo.png',
    deepLink: 'https://link.trustwallet.com/open_url?coin_id=60&url=your-tg-mini-app-url'
  },
  {
    name: 'Bitget Wallet',
    logo: '/bitget-wallet-logo.png',
    deepLink: 'https://bga.so/dapp?url=your-tg-mini-app-url'
  },
  // Add more wallets as needed
];

const WalletConnection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleWalletConnect = (wallet) => {
    // Attempt to open the wallet's deep link
    window.open(wallet.deepLink, '_blank');

    // If using MetaMask, you might want to add chain switching logic
    if (wallet.name === 'MetaMask' && window.ethereum) {
      try {
        window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [wallet.chainDetails]
        });
      } catch (error) {
        console.error('Failed to add Mantle chain', error);
      }
    }
  };

  return (
    <div className="wallet-connection">
      <button 
        onClick={() => setIsModalOpen(true)}
        className="connect-wallet-btn bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
      >
        <FaWallet className="mr-2" /> Connect Wallet
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-sm text-gray-600 mb-4">
              Choose a wallet to connect to the Mantle Chain
            </p>
            <div className="grid grid-cols-2 gap-4">
              {walletOptions.map((wallet) => (
                <button
                  key={wallet.name}
                  onClick={() => handleWalletConnect(wallet)}
                  className="border rounded-lg p-4 flex flex-col items-center hover:bg-gray-100 transition"
                >
                  <img 
                    src={wallet.logo} 
                    alt={`${wallet.name} Logo`} 
                    className="w-16 h-16 mb-2"
                  />
                  <span>{wallet.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;