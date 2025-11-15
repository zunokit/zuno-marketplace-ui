import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
import { sepolia, localhost } from 'wagmi/chains';

// Get WalletConnect project ID from environment
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

if (!projectId) {
  console.warn(
    'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. Some wallet features may not work. Get one at https://cloud.walletconnect.com/'
  );
}

// Configure only MetaMask wallet
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet],
    },
  ],
  {
    appName: 'Zuno Marketplace',
    projectId,
  }
);

export const wagmiConfig = createConfig({
  connectors,
  chains: [localhost, sepolia],
  ssr: true,
  transports: {
    [localhost.id]: http(),
    [sepolia.id]: http(),
  },
});
