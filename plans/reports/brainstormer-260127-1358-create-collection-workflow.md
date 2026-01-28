# Create Collection Feature - Comprehensive Workflow Documentation

**Date**: 2026-01-27
**Status**: Draft
**Purpose**: Documentation + Implementation Plan
**Scope**: Happy Path + All Edge Cases (Detailed)

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Happy Path Workflow](#happy-path-workflow)
3. [Edge Case Workflows](#edge-case-workflows)
4. [Component State Transitions](#component-state-transitions)
5. [API Specifications](#api-specifications)
6. [Error Handling Matrix](#error-handling-matrix)
7. [Implementation Checklist](#implementation-checklist)

---

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CREATE COLLECTION ECOSYSTEM                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐                │
│  │   Frontend   │────▶│   Backend    │────▶│  Blockchain  │                │
│  │  (Next.js)   │     │  (Go gRPC)   │     │  (Ethereum)  │                │
│  │              │     │              │     │              │                │
│  │  ┌────────┐  │     │  ┌────────┐  │     │  ┌────────┐  │                │
│  │  │  UI    │  │     │  │ GraphQL│  │     │  │Factory │  │                │
│  │  │  Form  │  │     │  │ Gateway│  │     │  │Contract│  │                │
│  │  └────────┘  │     │  └────────┘  │     │  └────────┘  │                │
│  │  ┌────────┐  │     │  ┌────────┐  │     │              │                │
│  │  │   SDK  │  │     │  │Collection│     │              │                │
│  │  │Provider│  │     │  │ Service │  │     │              │                │
│  │  └────────┘  │     │  └────────┘  │     │              │                │
│  │  ┌────────┐  │     │              │     │              │                │
│  │  │Apollo  │  │     │              │     │              │                │
│  │  │Client  │  │     │              │     │              │                │
│  │  └────────┘  │     │              │     │              │                │
│  └──────────────┘     └──────────────┘     └──────────────┘                │
│         │                     │                     ▲                       │
│         │                     │                     │                       │
│         ▼                     ▼                     │                       │
│  ┌──────────────┐     ┌──────────────┐             │                       │
│  │    Wallet    │     │   Metadata   │─────────────┘                       │
│  │  (RainbowKit)│     │   Service    │     Events Emitted                 │
│  │              │     │ (IPFS/ImgKit) │                                      │
│  └──────────────┘     └──────────────┘                                      │
│         │                     │                                              │
│         ▼                     ▼                                              │
│  ┌──────────────┐     ┌──────────────┐                                      │
│  │     User     │     │     IPFS     │                                      │
│  │  Signature   │     │   (Pinata)   │                                      │
│  └──────────────┘     └──────────────┘                                      │
│                                                                              │
│                           ┌──────────────┐                                   │
│                           │   Indexer    │                                   │
│                           │   (Ponder)   │                                   │
│                           │              │                                   │
│                           │  ┌────────┐  │                                   │
│                           │  │Webhook │  │                                   │
│                           │  │ Client │──┼───To Backend                     │
│                           │  └────────┘  │                                   │
│                           └──────────────┘                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Summary

```mermaid
graph LR
    A[User] --> B[Frontend Form]
    B --> C[Upload Media]
    C --> D[Metadata Service]
    D --> E[ImageKit + IPFS]
    B --> F[Create Collection DB]
    F --> G[GraphQL Gateway]
    G --> H[Collection Service]
    H --> I[PostgreSQL]
    B --> J[Deploy Contract]
    J --> K[Zuno SDK]
    K --> L[User Wallet]
    L --> M[Blockchain]
    M --> N[Indexer]
    N --> O[Webhook]
    O --> H
```

---

## Happy Path Workflow

### Complete Success Flow - Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant User as 👤 User
    participant UI as 🎨 Frontend UI
    participant Hook as 🪝 useCreateCollection
    participant Upload as 📤 Media Upload
    participant GQL as 🔄 GraphQL Client
    participant Gateway as 🌉 GraphQL Gateway
    participant Collection as 📦 Collection Service
    participant DB as 💾 PostgreSQL
    participant SDK as 🔧 Zuno SDK
    participant Wallet as 👛 Wallet
    participant Chain as ⛓️ Blockchain
    participant Indexer as 🔍 Ponder Indexer
    participant Webhook as 🔔 Webhook Client

    Note over User,Webhook: PHASE 1: FORM SUBMISSION & MEDIA UPLOAD
    User->>UI: Fill form & submit
    UI->>Hook: submit(formData)
    Hook->>Hook: Validate auth & wallet
    Hook->>Upload: uploadFile(collectionImage)
    Upload->>Gateway: POST /api/upload/media
    Gateway->>Gateway: Verify JWT
    Gateway->>Gateway: Forward to Metadata Service
    Gateway-->>Upload: Return imageUrl (ImageKit CDN)
    Hook->>Hook: step1Status = 'success'

    Note over User,Webhook: PHASE 2: CREATE COLLECTION IN DATABASE
    Hook->>Hook: Build CreateCollectionInput
    Hook->>GQL: createCollectionMutation({ variables })
    GQL->>Gateway: POST /graphql (createCollection)
    Gateway->>Collection: gRPC CreateCollection()
    Collection->>DB: INSERT INTO collections
    Note over DB: status: PENDING<br/>contract_address: NULL
    DB-->>Collection: collection { id, status }
    Collection-->>Gateway: CreateCollectionResponse
    Gateway-->>GQL: { createCollection { id status } }
    GQL-->>Hook: data.createCollection
    Hook->>Hook: step2Status = 'success'

    Note over User,Webhook: PHASE 3: ADD ALLOWLIST (OPTIONAL)
    alt allowlistAddresses.length > 0
        Hook->>GQL: addToAllowlistMutation({ variables })
        GQL->>Gateway: POST /graphql (addToAllowlist)
        Gateway->>Collection: gRPC AddToAllowlist()
        Collection->>DB: INSERT INTO collection_allowlist
        DB-->>Collection: success
        Collection-->>Gateway: AddToAllowlistResponse
        Gateway-->>GQL: { addToAllowlist: true }
        GQL-->>Hook: success
    end
    Hook->>Hook: step3Status = 'success'

    Note over User,Webhook: PHASE 4: DEPLOY SMART CONTRACT
    Hook->>Hook: Build CollectionParams
    Hook->>SDK: createERC721.mutateAsync(params)
    SDK->>SDK: Prepare transaction
    SDK->>Wallet: Request signature
    Wallet->>User: Show MetaMask popup
    User->>Wallet: Confirm transaction
    Wallet-->>SDK: signature
    SDK->>Chain: sendTransaction(signedTx)
    Chain->>Chain: Execute createClone()
    Chain->>Chain: Emit CollectionCreated event
    Chain-->>SDK: receipt { hash, address }
    SDK-->>Hook: { address, tx { hash } }
    Hook->>Hook: step4Status = 'success'

    Note over User,Webhook: PHASE 5: UPDATE DATABASE WITH CONTRACT
    Hook->>GQL: updateCollectionMutation({ variables })
    GQL->>Gateway: POST /graphql (updateCollection)
    Gateway->>Collection: gRPC UpdateCollection()
    Collection->>DB: UPDATE collections
    Note over DB: status: DEPLOYED<br/>contract_address: 0x...<br/>deployed_at: NOW()
    DB-->>Collection: success
    Collection-->>Gateway: UpdateCollectionResponse
    Gateway-->>GQL: { updateCollection { status } }
    GQL-->>Hook: success
    Hook->>Hook: step5Status = 'success'

    Note over User,Webhook: PHASE 6: INDEXER DETECTION (ASYNC)
    Chain->>Indexer: CollectionCreated event
    Indexer->>Indexer: Process event
    Indexer->>DB: INSERT INTO event table
    Indexer->>Webhook: sendWebhook(payload)
    Webhook->>Gateway: POST /api/webhooks/indexer
    Gateway->>Gateway: Verify HMAC signature
    Gateway->>Collection: ProcessIndexerWebhook()
    Collection->>DB: UPDATE collections
    Note over DB: index_status: INDEXED<br/>indexed_at: NOW()
    DB-->>Collection: success
    Collection-->>Gateway: WebhookResponse
    Gateway-->>Webhook: 200 OK

    Note over User,Webhook: SUCCESS
    Hook->>User: toast.success('Deployed!')
    Hook->>UI: router.push('/my-collections')
```

### Database State Transitions - Happy Path

```mermaid
stateDiagram-v2
    [*] --> PENDING: createCollection()
    PENDING --> DEPLOYED: updateCollection(contractAddress)
    DEPLOYED --> INDEXED: webhook received
    INDEXED --> [*]

    note right of PENDING
        status = PENDING
        contract_address = NULL
        created_at = NOW()
    end note

    note right of DEPLOYED
        status = DEPLOYED
        contract_address = 0x...
        deployed_at = NOW()
    end note

    note right of INDEXED
        status = DEPLOYED
        index_status = INDEXED
        indexed_at = NOW()
    end note
```

---

## Edge Case Workflows

### Edge Case Classification

```mermaid
graph TB
    Edge[Edge Cases] --> User[User Errors]
    Edge --> System[System Failures]

    User --> UE1[Wallet Rejection]
    User --> UE2[Insufficient Gas]
    User --> UE3[Wrong Network]
    User --> UE4[Invalid Input]
    User --> UE5[Not Authenticated]
    User --> UE6[Allowlist Upload Fail]

    System --> SE1[IPFS Timeout]
    System --> SE2[Metadata Service Down]
    System --> SE3[Backend GraphQL Error]
    System --> SE4[Transaction Failed]
    System --> SE5[Indexer Webhook Fail]
    System --> SE6[Blockchain Reorg]
    System --> SE7[Database Connection Lost]
    System --> SE8[Network Timeout]
```

### Edge Case 1: User Rejects Wallet Signature

```mermaid
sequenceDiagram
    autonumber
    participant Hook as useCreateCollection
    participant SDK as Zuno SDK
    participant Wallet as User Wallet
    participant User as 👤 User
    participant UI as Frontend UI
    participant DB as PostgreSQL

    Note over Hook,DB: Steps 1-3: Upload, Create DB, Allowlist (SUCCESS)
    Hook->>Hook: step1-3 = 'success'

    Note over Hook,DB: Step 4: Deploy Contract - USER REJECTS
    Hook->>SDK: createERC721.mutateAsync(params)
    SDK->>Wallet: Request signature
    Wallet->>User: Show MetaMask popup
    User->>Wallet: Click "Reject"
    Wallet-->>SDK: Error: User rejected
    SDK-->>Hook: throw Error

    Hook->>Hook: step4Status = 'error'
    Hook->>Hook: Set error message
    Hook->>UI: toast.error('Transaction cancelled')

    Note over DB: DATABASE STATE (UNCHANGED)
    DB->>DB: collections.status = PENDING
    DB->>DB: collections.contract_address = NULL

    Note over Hook,DB: RECOVERY FLOW
    UI->>User: Show "Retry" button
    User->>UI: Click "Retry"
    UI->>Hook: submit(formData) - retry
    Hook->>SDK: createERC721.mutateAsync(params)
    Wallet->>User: Show popup again
    alt User approves
        User->>Wallet: Confirm
        Wallet-->>SDK: signature
        SDK-->>Hook: success
        Hook->>Hook: step4Status = 'success'
        Note over Hook: Continue to Step 5
    else User rejects again
        User->>Wallet: Reject
        Hook->>Hook: step4Status = 'error'
        UI->>User: Show retry again
    end
```

### Edge Case 2: Insufficient Gas Funds

```mermaid
flowchart TD
    Start([User submits form]) --> Steps[Complete Steps 1-3]
    Steps --> Step4{Step 4: Deploy Contract}
    Step4 --> SDK[SDK: createERC721.mutateAsync]
    SDK --> Wallet{Wallet check}

    Wallet -->|Insufficient ETH| GasError[SDK throws: Insufficient funds]
    Wallet -->|Sufficient| NormalFlow[Continue normal flow]

    GasError --> Hook[Hook catches error]
    Hook --> ErrorMsg[toast.error: 'Insufficient ETH for gas']
    ErrorMsg --> FaucetLink[Show faucet link]
    FaucetLink --> UserAction{User action?}

    UserAction -->|Add funds| Reload[User reloads wallet]
    Reload --> CheckBalance{Balance sufficient?}
    CheckBalance -->|Yes| Retry[Click Retry button]
    CheckBalance -->|No| Wait[Wait for user]

    Retry --> SDK
    UserAction -->|Cancel| Stay[Collection stays PENDING]

    NormalFlow --> Success([Continue to Step 5])
    Stay --> End([End])

    style GasError fill:#ff6b6b
    style ErrorMsg fill:#ff6b6b
    style Success fill:#51cf66
```

### Edge Case 3: IPFS Pinning Timeout

```mermaid
sequenceDiagram
    autonumber
    participant Hook as useCreateCollection
    participant Upload as Media Upload
    participant Meta as Metadata Service
    participant IPFS as Pinata IPFS
    participant User as 👤 User
    participant UI as Frontend UI

    Note over Hook,IPFS: Media Upload with IPFS Pinning
    Hook->>Upload: uploadFile(image)
    Upload->>Meta: POST /api/media
    Meta->>IPFS: Upload to IPFS
    IPFS-->>Meta: ipfsHash (not pinned yet)
    Meta-->>Upload: Return { ipfsHash, isPinned: false }

    Note over Hook,IPFS: POLLING LOOP (Background Pinning)
    Upload->>Upload: Start polling every 2s
    loop Poll IPFS Status
        Upload->>Meta: GET /api/metadata/{id}
        Meta->>IPFS: Check pin status
        alt isPinned = true
            IPFS-->>Meta: { isPinned: true, ipfsUrl }
            Meta-->>Upload: Success
            Upload->>Upload: Stop polling
            Upload-->>Hook: Return imageUrl
            Hook->>Hook: step1Status = 'success'
        else isPinned = false AND attempts < 15
            IPFS-->>Meta: { isPinned: false }
            Meta-->>Upload: Not ready yet
            Upload->>Upload: Wait 2s, retry
        else isPinned = false AND attempts >= 15
            Note over Upload: TIMEOUT (30 seconds elapsed)
            Upload->>Upload: Stop polling
            Upload-->>Hook: throw Error('IPFS pinning timeout')
            Hook->>Hook: step1Status = 'error'
            Hook->>UI: toast.error('IPFS pinning taking too long')
            UI->>User: Show options
        end
    end

    Note over Hook,IPFS: USER RECOVERY OPTIONS
    alt User clicks "Continue anyway"
        UI->>Hook: Proceed with IPFS hash
        Hook->>Hook: step1Status = 'success'
        Note over Hook: Continue to Step 2
    else User clicks "Retry upload"
        UI->>Hook: Retry file upload
        Hook->>Upload: uploadFile(image) - retry
    else User clicks "Cancel"
        UI->>Hook: Abort creation
        Hook->>Hook: Reset state
        Note over DB: No DB record created
    end
```

### Edge Case 4: Transaction Failed on Blockchain

```mermaid
stateDiagram-v2
    [*] --> Step4_Complete: Step 4 completes
    Step4_Complete --> Step5_Started: Step 5 starts

    Step5_Started --> CallUpdate: updateCollectionMutation
    CallUpdate --> SendingTx: Send transaction to blockchain

    SendingTx --> TxResult{Transaction result?}

    TxResult --> Success: Transaction confirmed
    TxResult --> Failed: Transaction reverted
    TxResult --> Dropped: Transaction dropped

    Success --> DBUpdate: Update DB with contract address
    DBUpdate --> Deployed: status = DEPLOYED

    Failed --> ErrorHandling: Error handler
    Dropped --> ErrorHandling: Error handler

    ErrorHandling --> LogError: Log error with details
    LogError --> NotifyUser: toast.error with reason
    NotifyUser --> Recovery{Recovery option?}

    Recovery --> Retry: User clicks Retry
    Recovery --> Abort: User cancels

    Retry --> CallUpdate: Retry Step 5
    Abort --> Stuck: status = PENDING, no contract

    Deployed --> [*]
    Stuck --> [*]

    note right of Failed
        Common reasons:
        - Out of gas
        - Contract reverted
        - Nonce mismatch
        - Network congestion
    end note

    note right of Stuck
        Manual cleanup required:
        - Delete collection record
        - OR retry deployment
    end note
```

### Edge Case 5: Indexer Webhook Failure

```mermaid
sequenceDiagram
    autonumber
    participant Chain as Blockchain
    participant Indexer as Ponder Indexer
    participant Webhook as Webhook Client
    participant Gateway as GraphQL Gateway
    participant Collection as Collection Service
    participant DB as PostgreSQL
    participant Retry as Retry Queue
    participant Alert as Monitoring

    Note over Chain,DB: EVENT DETECTED
    Chain->>Indexer: CollectionCreated event
    Indexer->>Indexer: Process event
    Indexer->>DB: Store in event table
    Indexer->>Webhook: sendWebhook(payload)

    Note over Chain,DB: WEBHOOK DELIVERY - ATTEMPT 1
    Webhook->>Gateway: POST /api/webhooks/indexer
    Gateway->>Gateway: Verify HMAC signature

    alt Gateway unavailable (503)
        Gateway-->>Webhook: 503 Service Unavailable
        Webhook->>Webhook: Log failure
        Webhook->>Retry: Add to retry queue (delay: 30s)

        Note over Chain,DB: RETRY ATTEMPT 2 (after 30s)
        Retry->>Webhook: Trigger retry
        Webhook->>Gateway: POST /api/webhooks/indexer

        alt Still unavailable
            Gateway-->>Webhook: 503
            Webhook->>Retry: Add to retry queue (delay: 60s)

            Note over Chain,DB: RETRY ATTEMPT 3 (after 60s)
            Retry->>Webhook: Trigger retry
            Webhook->>Gateway: POST /api/webhooks/indexer

            alt Success
                Gateway->>Gateway: Verify HMAC ✅
                Gateway->>Collection: ProcessIndexerWebhook()
                Collection->>DB: UPDATE index_status = INDEXED
                DB-->>Collection: success
                Collection-->>Gateway: 200 OK
                Gateway-->>Webhook: 200 OK
                Webhook->>Webhook: Remove from retry queue
            else Max retries (3) reached
                Gateway-->>Webhook: 503
                Webhook->>Alert: Trigger alert
                Alert->>Alert: Notify team
                Note over DB: Collection stays DEPLOYED<br/>index_status = NOT_INDEXED
            end
        end
    else HMAC verification fails
        Gateway->>Gateway: Invalid signature
        Gateway-->>Webhook: 401 Unauthorized
        Webhook->>Alert: Security alert
        Alert->>Alert: Notify team (potential attack)
    else Success
        Gateway->>Gateway: Verify HMAC ✅
        Gateway->>Collection: ProcessIndexerWebhook()
        Collection->>DB: UPDATE index_status = INDEXED
        DB-->>Collection: success
        Collection-->>Gateway: 200 OK
        Gateway-->>Webhook: 200 OK
    end
```

### Edge Case 6: Metadata Service Down

```mermaid
flowchart TD
    Start([User uploads image]) --> Upload[uploadFile called]
    Upload --> Proxy{Backend Upload Proxy}

    Proxy -->|Service Available| Success[Upload succeeds]
    Proxy -->|Service Down| Error[HTTP 503/504]

    Error --> Catch{Catch block}
    Catch --> Log[Log error to Sentry]
    Log --> UserMsg[toast.error: Metadata service unavailable]
    UserMsg --> Options{User choice?}

    Options -->|Wait| Wait[Wait 30s]
    Wait --> RetryAuto[Auto-retry 3x with exponential backoff]
    RetryAuto --> Check{Service up?}
    Check -->|Yes| Success
    Check -->|No| Manual[Manual retry required]

    Options -->|Skip| Skip[Use placeholder URL]
    Skip --> Warning[Warn user: can update later]
    Warning --> Success

    Options -->|Cancel| Cancel[Abort creation]

    Manual --> RetryBtn[Show Retry button]
    RetryBtn --> UserRetry{User clicks retry?}
    UserRetry -->|Yes| Upload
    UserRetry -->|No| Cancel

    Success --> Continue([Continue to Step 2])
    Cancel --> End([End])

    style Error fill:#ff6b6b
    style Success fill:#51cf66
    style Cancel fill:#ffd43b
```

### Edge Case 7: Blockchain Reorg

```mermaid
stateDiagram-v2
    [*] --> Deployed: Contract deployed
    Deployed --> Indexed: Indexer confirms

    Indexed --> ReorgDetected: Blockchain reorg detected
    ReorgDetected --> CheckDepth{Reorg depth?}

    CheckDepth -->|Shallow < 6 blocks| Rollback: Roll back indexer state
    CheckDepth -->|Deep >= 6 blocks| ManualReview: Flag for manual review

    Rollback --> RevertIndexer: Revert event table
    RevertIndexer --> CheckDB{DB contract exists?}

    CheckDB -->|Yes| KeepDB: Keep DB record (status=DEPLOYED)
    CheckDB -->|No| NoAction: No action needed

    KeepDB --> FlagIndex: Set index_status = REORG
    FlagIndex --> Notify: Notify backend via webhook
    Notify --> BackendVerify: Backend verifies on-chain

    BackendVerify --> StillExists{Contract still on-chain?}

    StillExists -->|Yes| Restore: Restore index_status = INDEXED
    StillExists -->|No| DeleteRec: Delete DB record or mark INVALID

    Restore --> [*]
    DeleteRec --> [*]
    ManualReview --> [*]

    note right of ReorgDetected
        Reorg detection:
        - Ponder detects chain reorg
        - Block hash mismatch
        - Event disappears from chain
    end note

    note right of FlagIndex
        New status values:
        - REORG: Reorg detected, verifying
        - INVALID: Contract no longer exists
    end note
```

### Edge Case 8: Database Connection Lost

```mermaid
sequenceDiagram
    autonumber
    participant Hook as useCreateCollection
    participant GQL as GraphQL Client
    participant Gateway as GraphQL Gateway
    participant Pool as DB Connection Pool
    participant DB as PostgreSQL
    participant Retry as Retry Logic
    participant UI as Frontend UI

    Note over Hook,DB: Step 2: Create Collection
    Hook->>GQL: createCollectionMutation()
    GQL->>Gateway: POST /graphql
    Gateway->>Pool: Get connection
    Pool-->>Gateway: Error: Connection lost

    Gateway->>Retry: Catch connection error
    Retry->>Retry: Attempt reconnection (3 retries)

    loop Reconnection attempts (max 3)
        Retry->>Pool: Try reconnect
        alt Reconnect successful
            Pool-->>Retry: Connected
            Retry->>DB: Retry query
            DB-->>Gateway: Query result
            Gateway-->>GQL: Success response
            GQL-->>Hook: data.createCollection
            Hook->>Hook: step2Status = 'success'
            Note over Hook: Continue to Step 3
        else All retries failed
            Pool-->>Retry: Connection failed
            Retry->>UI: Throw connection error
            UI->>UI: Show error message
            UI->>Hook: Handle error
            Hook->>Hook: step2Status = 'error'
            Hook->>UI: toast.error('Database connection lost')
            UI->>UI: Show "Retry" button

            Note over Hook,DB: USER RECOVERY
            alt User clicks Retry
                UI->>Hook: submit(formData) - retry
                Hook->>GQL: Retry entire flow
            else User waits
                UI->>UI: Auto-retry after 5s
                Hook->>GQL: createCollectionMutation()
            end
        end
    end
```

---

## Component State Transitions

### Frontend Hook State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle: Initial state
    Idle --> Step1_Loading: submit() called

    Step1_Loading --> Step1_Success: Image uploaded
    Step1_Loading --> Step1_Error: Upload failed

    Step1_Success --> Step2_Loading: Create collection
    Step1_Error --> ErrorState: Set error message

    Step2_Loading --> Step2_Success: Collection created
    Step2_Loading --> Step2_Error: Creation failed

    Step2_Success --> Step3_Loading: Add allowlist
    Step2_Error --> ErrorState

    Step3_Loading --> Step3_Success: Allowlist added
    Step3_Loading --> Step3_Skipped: No allowlist
    Step3_Loading --> Step3_Error: Add failed

    Step3_Success --> Step4_Loading: Deploy contract
    Step3_Skipped --> Step4_Loading
    Step3_Error --> ErrorState

    Step4_Loading --> Step4_Success: Contract deployed
    Step4_Loading --> Step4_Error: Deploy failed

    Step4_Success --> Step5_Loading: Update DB
    Step4_Error --> ErrorState

    Step5_Loading --> Step5_Success: DB updated
    Step5_Loading --> Step5_Error: Update failed

    Step5_Success --> Success: Complete flow
    Step5_Error --> ErrorState

    ErrorState --> Idle: reset() called
    Success --> Idle: reset() called
    Success --> Redirect: router.push()

    note right of Step4_Error
        Recovery possible:
        - Collection in DB (PENDING)
        - User can retry deployment
        - OR delete collection
    end note
```

### Collection Status State Machine

```mermaid
stateDiagram-v2
    [*] --> PENDING: createCollection()

    PENDING --> DEPLOYING: User clicks "Deploy"
    PENDING --> DELETED: User deletes or timeout

    DEPLOYING --> DEPLOYED: Transaction confirmed
    DEPLOYING --> FAILED: Transaction failed
    DEPLOYING --> PENDING: User cancelled

    DEPLOYED --> INDEXED: Webhook received
    DEPLOYED --> STALE: Indexer timeout (> 5 min)

    INDEXED --> ACTIVE: First NFT minted
    INDEXED --> REORG: Blockchain reorg

    STALE --> INDEXED: Webhook arrives late
    STALE --> FAILED: Manual intervention

    REORG --> INDEXED: Verified on-chain
    REORG --> INVALID: Contract disappeared

    FAILED --> [*]
    DELETED --> [*]
    INVALID --> [*]
    ACTIVE --> [*]

    note right of PENDING
        Database record exists
        No contract address
        Can be resumed or deleted
    end note

    note right of DEPLOYED
        Contract deployed
        Waiting for indexer
        Shows "Deploying..." in UI
    end note

    note right of INDEXED
        Fully indexed
        Ready for minting
        Shows on marketplace
    end note
```

---

## API Specifications

### GraphQL Mutations

#### 1. createCollection

```graphql
mutation CreateCollection($input: CreateCollectionInput!) {
  createCollection(input: $input) {
    id
    name
    symbol
    status
    contractAddress
    chainId
    tokenStandard
    imageUrl
    baseUri
    maxSupply
    mintPriceAllowlist
    mintPricePublic
    royaltyFeeBps
    createdAt
  }
}

input CreateCollectionInput {
  name: String!
  symbol: String!
  description: String
  chainId: String!
  tokenStandard: ApiTokenStandard!
  deployerAddress: String!
  imageUrl: String
  baseUri: String!
  maxSupply: Int!
  mintPriceAllowlist: String!
  mintPricePublic: String!
  mintStartTime: DateTime!
  allowlistStageEnd: DateTime
  mintLimitPerWallet: Int!
  royaltyFeeBps: Int!
  royaltyRecipient: String!
}

enum ApiTokenStandard {
  ERC721
  ERC1155
}

enum CollectionStatus {
  PENDING
  DEPLOYING
  DEPLOYED
  INDEXED
  ACTIVE
  FAILED
  INVALID
  REORG
}
```

#### 2. updateCollection

```graphql
mutation UpdateCollection($id: ID!, $input: UpdateCollectionInput!) {
  updateCollection(id: $id, input: $input) {
    id
    status
    contractAddress
    deployedAt
    indexedAt
  }
}

input UpdateCollectionInput {
  contractAddress: String
  status: CollectionStatus
  deployedAt: DateTime
}
```

#### 3. addToAllowlist

```graphql
mutation AddToAllowlist($input: AddToAllowlistInput!) {
  addToAllowlist(input: $input)
}

input AddToAllowlistInput {
  collectionId: ID!
  walletAddresses: [String!]!
  maxMintAmount: Int!
}
```

### SDK Methods

#### createERC721Collection

```typescript
interface CollectionParams {
  name: string;
  symbol: string;
  description?: string;
  tokenURI: string;
  maxSupply: number;
  mintPrice: string;
  allowlistMintPrice: string;
  publicMintPrice: string;
  royaltyFee: number; // basis points (500 = 5%)
  mintLimitPerWallet: number;
  allowlistStageDuration: number; // seconds
}

interface DeployResult {
  address: `0x${string}`;
  tx: {
    hash: `0x${string}`;
    chainId: number;
    blockNumber?: number;
  };
}

const { createERC721 } = useCollection();

const result: DeployResult = await createERC721.mutateAsync(params);
```

### Backend Upload Proxy Endpoints

#### POST /api/upload/media

```http
POST /api/upload/media HTTP/1.1
Host: localhost:8081
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

------Boundary
Content-Disposition: form-data; name="file"; filename="logo.png"
Content-Type: image/png

<binary data>
------Boundary--

Response:
{
  "success": true,
  "data": {
    "url": "https://ik.imagekit.io/zuno/logo.png",
    "ipfsHash": "QmXyz...",
    "ipfsUrl": "https://gateway.pinata.cloud/ipfs/QmXyz..."
  }
}
```

#### GET /api/upload/metadata/:id

```http
GET /api/upload/metadata/metadata_abc123 HTTP/1.1
Host: localhost:8081
Authorization: Bearer <JWT_TOKEN>

Response (polling):
{
  "id": "metadata_abc123",
  "isPinned": false,
  "ipfsHash": null,
  "ipfsUrl": null
}

Response (pinned):
{
  "id": "metadata_abc123",
  "isPinned": true,
  "ipfsHash": "QmXyz...",
  "ipfsUrl": "https://gateway.pinata.cloud/ipfs/QmXyz...",
  "pinnedAt": "2025-01-27T10:30:00Z"
}
```

### Indexer Webhook

#### POST /api/webhooks/indexer

```http
POST /api/webhooks/indexer HTTP/1.1
Host: localhost:8081
Content-Type: application/json
X-Webhook-Signature: sha256=<HMAC_SIGNATURE>
X-Webhook-Event: collection.created

{
  "event": "collection.created",
  "chainId": 11155111,
  "timestamp": 1737970800,
  "data": {
    "collectionAddress": "0xABC...",
    "creator": "0x123...",
    "tokenType": "ERC721",
    "blockNumber": 12345678,
    "txHash": "0xDEF..."
  }
}

Response:
HTTP/1.1 200 OK
{
  "success": true
}
```

---

## Error Handling Matrix

### Error Codes and Messages

| Error Code | Message | HTTP Status | Recovery Action | Component |
|------------|---------|-------------|-----------------|-----------|
| `ERR_AUTH_REQUIRED` | Please sign in first | 401 | Redirect to sign-in | Frontend |
| `ERR_WALLET_NOT_CONNECTED` | Wallet not connected | 400 | Show connect button | Frontend |
| `ERR_UPLOAD_FAILED` | Failed to upload image | 500 | Retry upload | Frontend/Metadata |
| `ERR_IPFS_TIMEOUT` | IPFS pinning timeout | 408 | Continue anyway or retry | Frontend |
| `ERR_COLLECTION_EXISTS` | Collection name already exists | 409 | Choose different name | Backend |
| `ERR_INVALID_INPUT` | Invalid form data | 400 | Show validation errors | Frontend |
| `ERR_WALLET_REJECTED` | Transaction rejected by user | 499 | Show retry button | Frontend/SDK |
| `ERR_INSUFFICIENT_GAS` | Insufficient ETH for gas | 400 | Show faucet link | Frontend/SDK |
| `ERR_WRONG_NETWORK` | Please switch to Sepolia | 400 | Trigger network switch | Frontend/SDK |
| `ERR_TX_FAILED` | Transaction failed: {reason} | 500 | Retry or contact support | SDK/Blockchain |
| `ERR_DB_CONNECTION` | Database connection lost | 503 | Auto-retry 3x | Backend |
| `ERR_WEBHOOK_FAILED` | Indexer webhook failed | 503 | Queue for retry | Indexer |
| `ERR_SERVICE_UNAVAILABLE` | Metadata service unavailable | 503 | Retry with backoff | Backend/Metadata |
| `ERR_HMAC_INVALID` | Invalid webhook signature | 401 | Block request | Backend |
| `ERR_REORG_DETECTED` | Blockchain reorganization | 500 | Manual review required | Indexer |

### Error Recovery Decision Tree

```mermaid
flowchart TD
    Start([Error occurs]) --> Classify{Error classification}

    Classify -->|User Error| User[User-triggered]
    Classify -->|System Error| System[System failure]
    Classify -->|Network Error| Network[Network issue]

    User --> UserRecovery{Can user fix?}
    UserRecovery -->|Yes| UserAction[Show user action button]
    UserRecovery -->|No| UserHelp[Show help link]

    UserAction --> Retry[Retry current step]
    UserHelp --> Contact[Contact support]

    System --> AutoRetry{Auto-retry possible?}
    AutoRetry -->|Yes| Exponential[Exponential backoff<br/>Max 3 retries]
    AutoRetry -->|No| ManualFix[Manual fix required]

    Exponential --> Success{Retry success?}
    Success -->|Yes| Continue[Continue flow]
    Success -->|No| Fallback[Fallback action]

    Network --> CheckTimeout{Timeout > 30s?}
    CheckTimeout -->|Yes| Abort[Abort with message]
    CheckTimeout -->|No| Wait[Wait and retry]

    ManualFix --> AlertTeam[Alert on-call team]
    Fallback --> SafeState[Return to safe state]
    Abort --> SafeState
    AlertTeam --> SafeState

    Continue --> End([Resume])
    Contact --> End
    SafeState --> End
    Wait --> End

    style User fill:#ffd43b
    style System fill:#ff6b6b
    style Network fill:#4dabf7
    style Continue fill:#51cf66
```

---

## Implementation Checklist

### Frontend Implementation (zuno-marketplace-ui)

#### Status: ✅ Partially Complete | ⏳ In Progress | ❌ Not Started

- [✅] **Step 1: UI Components**
  - [✅] CollectionForm component
  - [✅] CreateCollectionForm component
  - [✅] Multi-step form UI
  - [⏳] Progress indicators for each step
  - [⏳] Error state displays
  - [⏳] Recovery action buttons

- [✅] **Step 2: Hooks**
  - [✅] useCreateCollection hook
  - [✅] Step 1: Media upload
  - [✅] Step 2: Create collection in DB
  - [✅] Step 3: Add allowlist
  - [✅] Step 4: Deploy contract via SDK
  - [✅] Step 5: Update DB with contract
  - [⏳] Error handling for each step
  - [⏳] Retry logic

- [⏳] **Step 3: SDK Integration**
  - [✅] ZunoProvider wrapper
  - [✅] SDK hooks imported
  - [⏳] Wallet signature handling
  - [⏳] Transaction status monitoring
  - [⏳] Gas estimation UI

- [⏳] **Step 4: Error Handling**
  - [⏳] Wallet rejection handling
  - [⏳] Insufficient gas detection
  - [⏳] Network switch prompts
  - [⏳] IPFS timeout handling
  - [⏳] Transaction failure recovery

- [⏳] **Step 5: User Feedback**
  - [⏳] Toast notifications
  - [⏳] Progress indicators
  - [⏳] Transaction hash display
  - [⏳] Block explorer links
  - [⏳] Retry/Cancel buttons

### Backend Implementation (zuno-marketplace-api)

#### Status: ✅ Complete | ⏳ In Progress | ❌ Not Started

- [✅] **Step 1: Collection Service**
  - [✅] gRPC proto definitions
  - [✅] Repository layer
  - [✅] Service layer
  - [✅] gRPC server
  - [✅] Database models

- [✅] **Step 2: GraphQL Gateway**
  - [✅] GraphQL schema
  - [✅] createCollection resolver
  - [✅] updateCollection resolver
  - [✅] addToAllowlist resolver
  - [✅] Query resolvers

- [⏳] **Step 3: Webhook Handler**
  - [❌] Webhook endpoint implementation
  - [❌] HMAC signature verification
  - [❌] Event processing logic
  - [❌] Index status updates
  - [❌] Error handling

- [✅] **Step 4: Upload Proxy**
  - [✅] Media upload endpoint
  - [✅] Metadata creation endpoint
  - [✅] Polling endpoint
  - [✅] JWT authentication
  - [✅] API key forwarding

- [⏳] **Step 5: Error Handling**
  - [⏳] Connection pool management
  - [⏳] Retry logic
  - [⏳] Error logging
  - [⏳] Monitoring integration

### Indexer Implementation (zuno-marketplace-indexer)

#### Status: ✅ Complete | ⏳ In Progress | ❌ Not Started

- [✅] **Step 1: Event Indexing**
  - [✅] Ponder setup
  - [✅] Factory contract indexing
  - [✅] Event handlers
  - [✅] Database storage

- [❌] **Step 2: Webhook System**
  - [❌] Webhook client implementation
  - [❌] HMAC signature generation
  - [❌] Retry queue
  - [❌] Delivery tracking

- [❌] **Step 3: Error Handling**
  - [❌] Webhook failure handling
  - [❌] Reorg detection
  - [❌] Event replay logic

### Integration Tasks

- [⏳] **End-to-End Testing**
  - [ ] Happy path test
  - [ ] Wallet rejection test
  - [ ] Insufficient gas test
  - [ ] IPFS timeout test
  - [ ] Webhook failure test
  - [ ] Reorg handling test

- [⏳] **Documentation**
  - [ ] API documentation
  - [ ] Error handling guide
  - [ ] Troubleshooting guide
  - [ ] Monitoring setup

---

## Unresolved Questions

1. **IPFS Pinning Timeout**: What should be the maximum polling duration before giving up? Currently 30 seconds. Should this be configurable?

2. **Webhook Retry Strategy**: What is the acceptable delay between indexer webhook retries? Currently 30s, 60s, then manual. Should we extend this?

3. **Reorg Recovery**: For deep reorgs (>= 6 blocks), should we automatically mark collections as INVALID or require manual review?

4. **Stuck Collections**: Collections stuck in PENDING status (e.g., user cancelled after DB record created) - should we have a cleanup job?

5. **Gas Estimation**: Should we show estimated gas cost before user confirms transaction?

6. **Concurrent Creation**: What happens if user tries to create multiple collections simultaneously? Should we prevent this?

7. **Allowlist Size**: What is the maximum allowlist size we should support? Current implementation has no limit.

8. **Metadata Service Fallback**: If metadata service is down, should we allow direct IPFS upload as fallback?

---

## Next Steps

1. **Immediate** (This Week)
   - Complete error handling in frontend hook
   - Implement retry logic with exponential backoff
   - Add progress indicators for each step

2. **Short-term** (Next 2 Weeks)
   - Implement webhook system in indexer
   - Add webhook handler in backend
   - Write integration tests

3. **Medium-term** (Next Month)
   - Add monitoring and alerting
   - Implement cleanup jobs for stuck collections
   - Write comprehensive documentation

---

**Document Version**: 1.0
**Last Updated**: 2026-01-27
**Next Review**: After implementation completion
