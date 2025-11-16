import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { defineChain } from 'viem';

// Define Anvil local chain
const anvil = defineChain({
  id: 31337,
  name: 'Anvil',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_ANVIL_RPC || 'http://127.0.0.1:8545'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'http://localhost:8545' },
  },
  testnet: true,
});

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

// Use Sepolia for now - easier for testing
// To use local Anvil: change to [anvil, sepolia]
export const wagmiConfig = createConfig({
  connectors,
  chains: [sepolia], // Start with testnet only
  ssr: true,
  transports: {
    [sepolia.id]: http(),
    // Uncomment below to enable Anvil local chain
    // [anvil.id]: http(),
  },
});
