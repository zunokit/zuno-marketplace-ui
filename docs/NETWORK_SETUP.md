# Network Setup Guide

## 🌐 Supported Networks

### 1. Sepolia Testnet (Recommended for Testing)

**Default network** - No setup needed!

- **Chain ID:** 11155111
- **RPC URL:** Public Sepolia RPC
- **Block Explorer:** https://sepolia.etherscan.io/
- **Faucet:** https://sepoliafaucet.com/

**Steps:**
1. Open MetaMask
2. Switch to **Sepolia Test Network**
3. Get test ETH from faucet
4. Done! Ready to test

### 2. Anvil Local Chain (For Contract Development)

**Chain ID:** 31337
**RPC URL:** http://127.0.0.1:8545

#### Setup Anvil:

```bash
# Start Anvil
cd zuno-marketplace-contracts
anvil
```

#### Add to MetaMask:

1. Open MetaMask
2. Click network dropdown → **Add Network** → **Add a network manually**
3. Fill in:
   - **Network Name:** Anvil Local
   - **RPC URL:** http://127.0.0.1:8545
   - **Chain ID:** 31337
   - **Currency Symbol:** ETH
4. Click **Save**

#### Enable in App:

Edit `src/shared/config/wagmi.ts`:

```typescript
// Change this line:
chains: [sepolia], // Start with testnet only

// To:
chains: [anvil, sepolia], // Both local and testnet

// And uncomment:
transports: {
  [sepolia.id]: http(),
  [anvil.id]: http(), // Uncomment this
},
```

## 🔧 Current Configuration

The app is configured to use **Sepolia testnet only** by default.

This avoids the MetaMask chain ID errors you were seeing.

## 🐛 Troubleshooting

### Error: "Unrecognized chain ID 0x539"

This means the app is trying to use a chain that's not configured in MetaMask.

**Solution:**
- Use Sepolia testnet (already configured)
- Or add Anvil network to MetaMask (see above)

### Error: "Could not add network"

MetaMask already has a network with that RPC endpoint.

**Solution:**
- Use the existing network
- Or change the RPC URL in wagmi config

### Error: "Wrong network"

You're connected to a different network than the app expects.

**Solution:**
- Switch MetaMask to **Sepolia**
- Or click "Wrong network" button in RainbowKit UI

## 🚀 Quick Start

**Easiest way to test:**

1. **Open MetaMask**
2. **Switch to Sepolia Test Network**
3. **Get test ETH:** https://sepoliafaucet.com/
4. **Refresh the app**
5. **Connect wallet**
6. **Sign in**
7. ✅ Done!

## 📝 Environment Variables

Add to `.env`:

```bash
# Optional - only if using Anvil
NEXT_PUBLIC_ANVIL_RPC=http://127.0.0.1:8545
```

## 🔄 Switching Networks

### To use only Sepolia (current):
```typescript
chains: [sepolia],
```

### To use only Anvil:
```typescript
chains: [anvil],
```

### To use both:
```typescript
chains: [anvil, sepolia],
```

Make sure the corresponding transports are uncommented!

## ⚠️ Important Notes

- **Sepolia** works immediately, no setup needed
- **Anvil** requires running local node and MetaMask configuration
- For production, add mainnet chains
- Never commit private keys or mnemonics

## 🎯 Recommended Approach

**For Development:**
1. Start with **Sepolia** (no setup)
2. Test authentication flow
3. Test all features
4. Later add Anvil for contract testing

**For Contract Testing:**
1. Use **Anvil** local chain
2. Deploy contracts locally
3. Test contract interactions
4. Then deploy to Sepolia

## 📚 References

- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Foundry Anvil Docs](https://book.getfoundry.sh/anvil/)
- [MetaMask Network Guide](https://support.metamask.io/hc/en-us/articles/360043227612)
- [Wagmi Chains](https://wagmi.sh/core/api/chains)
