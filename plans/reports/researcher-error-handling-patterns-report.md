# Error Handling, Retry & State Persistence Patterns - Research Report

**Date:** 2026-02-01
**Scope:** React/Web3 Applications

---

## 1. Error Handling Patterns for Multi-Step Workflows

### Layered Error Boundary Architecture
```tsx
// Component-level + Layout-level boundaries
<MultiStepErrorBoundary>
  <StepIndicator />
  <ErrorBoundary key={currentStep}>
    <CurrentStepComponent />
  </ErrorBoundary>
</MultiStepErrorBoundary>
```

### 2025 Stack Recommendation
- **React Hook Form + Zod** - Per-step validation
- **Zustand** - State management with persistence
- **react-error-boundary** - Simplified error boundary hooks

### Async Error Handling Pattern
```tsx
function StepWithData({ stepData }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData()
      .catch(err => setError(err)); // Local state for recoverable errors
      // OR: throw err for critical errors (triggers Error Boundary)
  }, []);

  if (error) return <StepErrorFallback error={error} onRetry={...} />;
}
```

---

## 2. Retry Mechanisms with Exponential Backoff

### TypeScript Implementation
```typescript
interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  jitter?: boolean;
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 5, baseDelay = 1000, maxDelay = 30000, jitter = false } = options;
  let attempt = 0;

  const execute = async (): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= maxRetries) throw error;

      let delayMs = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      if (jitter) delayMs = delayMs * (0.5 + Math.random() * 0.5);

      await new Promise(resolve => setTimeout(resolve, delayMs));
      attempt++;
      return execute();
    }
  };

  return execute();
}
```

### Using NPM Package
```typescript
import { backOff } from "exponential-backoff";

const response = await backOff(() => fetchData(), {
  numOfAttempts: 5,
  startingDelay: 100,
  maxDelay: 10000,
  jitter: "full"
});
```

---

## 3. State Persistence Strategies

### Storage Options Comparison
| Option | Best For | Limitations |
|--------|----------|-------------|
| localStorage | User preferences, form data | 5-10MB, synchronous |
| sessionStorage | Temporary session data | Cleared on tab close |
| IndexedDB | Large datasets, offline apps | Complex API, async |

### useLocalStorage Hook Pattern
```typescript
import { useLocalStorage } from 'usehooks-ts';

function App() {
  const [formData, setFormData] = useLocalStorage('form-data', {});
  // Auto-syncs with localStorage
}
```

### Zustand with Persistence
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFormStore = create(
  persist(
    (set, get) => ({
      currentStep: 0,
      formData: {},
      saveStepState: (stepIndex, values) => set({
        currentStep: stepIndex,
        formData: { ...get().formData, [stepIndex]: values }
      })
    }),
    { name: 'multi-step-form-storage' }
  )
);
```

### Security Warning
- Never store JWTs or PII in localStorage
- Use HTTP-only cookies for authentication
- Validate data from storage before use

---

## 4. Recovery Patterns for Failed Blockchain Transactions

### Error Classification
| Retryable (Transient) | Non-Retryable (Permanent) |
|----------------------|---------------------------|
| Network timeouts | Insufficient funds |
| RPC node unavailable | Smart contract reverts |
| Rate limiting | Invalid transaction data |

### Web3 Retry Pattern
```typescript
async function executeWithRetry(transaction, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await validatePreconditions();
      const result = await sendTransaction(transaction);
      const confirmed = await waitForConfirmation(result.hash);
      if (confirmed) return result;
    } catch (error) {
      if (!isRetryableError(error) || attempt === maxAttempts) throw error;

      await delay(Math.pow(2, attempt) * 1000);
      transaction = await refreshTransactionParams(transaction); // Update gas/blockhash
    }
  }
}

function isRetryableError(error): boolean {
  const retryableCodes = ['TIMEOUT', 'NETWORK_ERROR', 'RATE_LIMITED'];
  return retryableCodes.some(code => error.message?.includes(code));
}
```

### Key Patterns
- **Fallback RPC Nodes** - Redundancy for read operations
- **Nonce Management** - Prevent transaction collisions
- **Idempotency Keys** - Prevent duplicate transactions on retry
- **Pre-flight Checks** - Validate before submission

---

## 5. Optimistic UI Patterns

### TanStack Query (Recommended 2025)
```typescript
const updateMutation = useMutation({
  mutationFn: async (newTodo) => {
    return fetch('/api/todos', { method: 'POST', body: JSON.stringify(newTodo) });
  },

  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    const previousTodos = queryClient.getQueryData(['todos']);

    queryClient.setQueryData(['todos'], (old) => ({
      ...old,
      items: [...old.items, { id: 'temp-' + Date.now(), ...newTodo }]
    }));

    return { previousTodos };
  },

  onError: (err, newTodo, context) => {
    queryClient.setQueryData(['todos'], context.previousTodos); // Rollback
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  }
});
```

### SWR vs TanStack Query (2025)
| Feature | SWR | TanStack Query |
|---------|-----|----------------|
| Optimistic Updates | Manual | Built-in |
| Bundle Size | 5.3KB | ~16KB |
| DevTools | No | Yes |

---

## Summary

| Pattern | Recommendation |
|---------|---------------|
| Multi-step errors | Layered Error Boundaries + Zustand persistence |
| Retry logic | `exponential-backoff` npm package or custom hook with jitter |
| State persistence | Zustand + localStorage for form data |
| Web3 recovery | Classify errors, refresh params on retry |
| Optimistic UI | TanStack Query v5 with `onMutate`/`onError` |

---

## Sources
- [TanStack Query Optimistic Updates](https://tanstack.com/query/v5/docs/react/guides/optimistic-updates)
- [Exponential Backoff in Modern JavaScript](https://javascript.plainenglish.io/exponential-backoff-in-modern-javascript-f725457215b8)
- [React Error Boundaries 2025](https://www.sharetech.in/articles/467/react-error-boundaries-explained-with-example-2025)
- [Web3 UX Guide 2025](https://23stud.io/blog/web3-products-that-convert-ux-guide-founders)
- [Retrying Transactions in Solana](https://www.csharp.com/article/retrying-transactions-in-solana/)
