import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
import { sepolia, localhost } from 'wagmi/chains';

// Get WalletConnect project ID from environment
// For MetaMask-only setup, we use a dummy ID since RainbowKit requires it
// even though we're not using WalletConnect wallets
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'METAMASK_ONLY_NO_WC';

if (projectId === 'METAMASK_ONLY_NO_WC') {
  console.info(
    '🦊 Using MetaMask only (no WalletConnect). This is fine for development.'
  );
}

// Configure only MetaMask wallet (injected connector)
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet],
    },
  ],
  {
    appName: 'Zuno Marketplace',
    projectId, // Required by RainbowKit but not used for MetaMask
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
