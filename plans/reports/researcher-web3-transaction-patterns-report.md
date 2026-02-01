# Web3 Transaction Handling Best Practices

**Date:** 2026-02-01
**Focus:** Gas estimation, transaction replacement, state management, nonce handling, multi-chain patterns

---

## 1. Pre-flight Gas Estimation & Balance Checking

### Pattern: Simulate-Write Flow (Recommended)
```typescript
import { useSimulateContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

function TransactionComponent() {
  // 1. Simulate first
  const { data: simulateData, error: simulateError } = useSimulateContract({
    address: CONTRACT_ADDRESS,
    abi: contractAbi,
    functionName: 'mint',
    args: [tokenId],
  })

  // 2. Execute with validated request
  const { writeContract, data: hash } = useWriteContract()

  const handleSubmit = () => {
    if (simulateData?.request) {
      writeContract(simulateData.request)
    }
  }

  // 3. Wait for confirmation
  const { isSuccess } = useWaitForTransactionReceipt({ hash })
}
```

### Gas Buffer Strategy
| Scenario | Buffer |
|----------|--------|
| Standard | 20-25% |
| Complex contracts | 30-50% |
| Network congestion | 50%+ |

```typescript
const gasEstimate = await publicClient.estimateGas(txParams)
const gasWithBuffer = (gasEstimate * 125n) / 100n  // 25% buffer
```

### Balance Check Pattern
```typescript
const { data: balance } = useBalance({ address: userAddress })
const { data: feeData } = useEstimateFeesPerGas()

const hasEnoughBalance = balance?.value > (gasEstimate * feeData.maxFeePerGas)
```

---

## 2. Transaction Replacement (Speed Up / Cancel)

### The 10% Rule
To replace a pending transaction, increase gas price by **at least 10%** over the pending tx.

```typescript
// Speed up pattern
const speedUpTransaction = async (pendingTx: Transaction) => {
  const newGasPrice = (pendingTx.gasPrice * 110n) / 100n  // +10%

  return await walletClient.sendTransaction({
    to: pendingTx.to,
    value: pendingTx.value,
    data: pendingTx.data,
    nonce: pendingTx.nonce,        // Same nonce
    gasPrice: newGasPrice,         // Higher gas price
  })
}

// Cancel pattern (send 0 ETH to self)
const cancelTransaction = async (nonce: number, currentGasPrice: bigint) => {
  const [account] = await walletClient.getAddresses()

  return await walletClient.sendTransaction({
    to: account,                   // Self
    value: 0n,                     // Zero value
    nonce,                         // Same nonce as pending tx
    gasPrice: (currentGasPrice * 110n) / 100n,
  })
}
```

---

## 3. Transaction State Machine

```typescript
type TransactionState =
  | 'idle'
  | 'estimating'
  | 'awaiting_signature'
  | 'submitting'
  | 'pending'
  | 'confirming'
  | 'success'
  | 'failed'
  | 'cancelled'

interface TransactionMachine {
  state: TransactionState
  hash?: `0x${string}`
  error?: Error
  retryCount: number
}

// State transitions
const transitions: Record<TransactionState, TransactionState[]> = {
  idle: ['estimating'],
  estimating: ['awaiting_signature', 'failed'],
  awaiting_signature: ['submitting', 'cancelled', 'failed'],
  submitting: ['pending', 'failed'],
  pending: ['confirming', 'failed'],
  confirming: ['success', 'failed'],
  success: [],
  failed: ['idle'],  // Allow retry
  cancelled: ['idle'],
}
```

### React Hook Implementation
```typescript
function useTransactionState() {
  const [state, setState] = useState<TransactionState>('idle')
  const [hash, setHash] = useState<`0x${string}` | undefined>()

  const transition = useCallback((newState: TransactionState) => {
    setState(prev => {
      if (transitions[prev].includes(newState)) {
        return newState
      }
      throw new Error(`Invalid transition: ${prev} -> ${newState}`)
    })
  }, [])

  return { state, hash, setHash, transition }
}
```

---

## 4. Nonce Management

### Off-Chain Nonce Store (High-Frequency)
```typescript
class NonceManager {
  private nonces: Map<`0x${string}`, number> = new Map()

  async initialize(address: `0x${string}`, publicClient: PublicClient) {
    const count = await publicClient.getTransactionCount({ address })
    this.nonces.set(address, count)
  }

  getNextNonce(address: `0x${string}`): number {
    const current = this.nonces.get(address) || 0
    this.nonces.set(address, current + 1)
    return current
  }

  // Reset on error
  reset(address: `0x${string}`, publicClient: PublicClient) {
    this.nonces.delete(address)
    return this.initialize(address, publicClient)
  }
}
```

### Retry with Same Nonce
```typescript
const sendWithRetry = async (txParams: TransactionRequest, maxRetries = 3) => {
  let nonce = await nonceManager.getNextNonce(address)

  for (let i = 0; i < maxRetries; i++) {
    try {
      const hash = await walletClient.sendTransaction({
        ...txParams,
        nonce,
        gasPrice: txParams.gasPrice + BigInt(i * 10), // Increment gas
      })
      return hash
    } catch (error) {
      if (error.message.includes('nonce too low')) {
        nonce = await publicClient.getTransactionCount({ address })
      }
      if (i === maxRetries - 1) throw error
    }
  }
}
```

---

## 5. Multi-Chain Transaction Handling

### Chain-Agnostic Pattern
```typescript
import { createConfig, http, useAccount, useSwitchChain } from 'wagmi'
import { mainnet, optimism, arbitrum } from 'wagmi/chains'

const config = createConfig({
  chains: [mainnet, optimism, arbitrum],
  transports: {
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
  },
})

function MultiChainTransaction() {
  const { chain } = useAccount()
  const { switchChain } = useSwitchChain()

  const executeOnChain = async (targetChainId: number, txParams: any) => {
    if (chain?.id !== targetChainId) {
      await switchChain({ chainId: targetChainId })
    }
    // Execute transaction...
  }
}
```

### Chain-Specific Gas Configuration
```typescript
const chainGasConfig: Record<number, { buffer: number; maxFeeMultiplier: number }> = {
  1: { buffer: 1.25, maxFeeMultiplier: 1.5 },      // Mainnet
  10: { buffer: 1.1, maxFeeMultiplier: 1.2 },      // Optimism
  42161: { buffer: 1.15, maxFeeMultiplier: 1.3 },  // Arbitrum
}
```

---

## Key Recommendations

| Area | Recommendation |
|------|----------------|
| Gas | Always simulate before execute; add 20-25% buffer |
| Replacement | Use same nonce + 10% higher gas price minimum |
| State | Use explicit state machine, not boolean flags |
| Nonce | Off-chain manager for bulk; auto for normal usage |
| Multi-chain | Abstract chain config; validate before execute |

## Sources
- [Kaia Nonce Management](https://docs.kaia.io/build/cookbooks/how-to-manage-nonce/)
- [WAGMI Basics](https://shapkarin.me/articles/WAGMI-basics/)
- [Wagmi Send Transaction](https://wagmi.sh/react/guides/send-transaction)
- [ChainScore Multi-Chain Wallet](https://www.chainscorelabs.com/en/guides/web3-ux-account-abstraction-on-off-ramps-etc/wallet-and-dapp-connectivity/how-to-design-a-multi-chain-wallet-integration)
- [Ethereum Stack Exchange - Replacement Underpriced](https://ethereum.stackexchange.com/questions/27256/error-replacement-transaction-underpriced)
