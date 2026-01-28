# Create Collection - Diagrams Quick Reference

**Quick access to all Mermaid v11 diagrams from the workflow documentation.**

---

## 1. Happy Path - Sequence Diagram

**Complete success flow with all 6 phases**

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

---

## 2. Database State Transitions

**Collection status lifecycle**

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

## 3. Frontend Hook State Machine

**useCreateCollection internal states**

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

---

## 4. Edge Case: Wallet Rejection

**User cancels MetaMask transaction**

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

---

## 5. Edge Case: IPFS Pinning Timeout

**Background pinning takes too long**

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

---

## 6. Edge Case: Indexer Webhook Failure

**Webhook delivery with retry logic**

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

---

## 7. Error Recovery Decision Tree

**How errors are classified and recovered**

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

## 8. Edge Case Classification Overview

**All edge cases categorized**

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

    style Edge fill:#fa5252
    style User fill:#ffd43b
    style System fill:#ff6b6b
```

---

## Quick Navigation

- **Happy Path**: See diagram #1 (Sequence) or #2 (State)
- **User Errors**: See diagrams #4 (Wallet Rejection), #7 (Recovery Tree)
- **System Failures**: See diagrams #5 (IPFS Timeout), #6 (Webhook Failure)
- **All Edge Cases**: See diagram #8 (Classification)

---

**Reference Version**: 1.0
**Last Updated**: 2026-01-27
