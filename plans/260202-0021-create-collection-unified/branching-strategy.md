# Create Collection - Branching Strategy

## Important Rules

1. **NO direct merge to develop** - Luôn tạo PR về `develop`
2. **zuno-marketplace-ui**: Implement trong branch hiện tại `feature/sub-kimi-implement-remaning-create-collections`
3. **zuno-marketplace-api**: Implement trong branch hiện tại `feature/sub-implement-create-collection`
4. Các projects khác: Tạo branch mới từ `develop`

---

## Existing Branches (Continue Using)

| Project | Branch | Status | Phases |
|---------|--------|--------|--------|
| zuno-marketplace-ui | `feature/sub-kimi-implement-remaning-create-collections` | Partially implemented | 04-07, 12-13, 16, 19 |
| zuno-marketplace-api | `feature/sub-implement-create-collection` | Partially implemented | 03, 09, 14 |

---

## New Branches (From develop)

### Group A: Infrastructure (Cross-project)

| Branch | Base | Phases | Projects | Owner |
|--------|------|--------|----------|-------|
| `feature/create-collection-error-handling-sdk` | `develop` | 01 | SDK | SDK Team |
| `feature/create-collection-error-handling-indexer` | `develop` | 01 | Indexer | Indexer Team |
| `feature/create-collection-error-handling-metadata` | `develop` | 01 | Metadata | Metadata Team |
| `feature/create-collection-error-handling-notifications` | `develop` | 01 | Notifications | Notifications Team |
| `feature/create-collection-shared-types` | `develop` | 02 | SDK + API | SDK/API Team |

**Note:** UI và API không cần branch mới cho Phase 01 vì đã có error handling cơ bản

---

### Group C: Core Implementation (New branches)

| Branch | Base | Phase | Project | Owner |
|--------|------|-------|---------|-------|
| `feature/create-collection-sdk-module` | `develop` | 08 | SDK | SDK Team |
| `feature/create-collection-indexer-handlers` | `develop` | 10 | Indexer | Indexer Team |
| `feature/create-collection-metadata-service` | `develop` | 11 | Metadata | Metadata Team |

---

### Group D: Integration (Cross-project)

| Branch | Base | Phase | Dependencies | PR Target |
|--------|------|-------|--------------|-----------|
| `feature/create-collection-notifications` | `develop` | 15 | Phase 14 | `develop` |

---

### Group E: Testing (New branches)

| Branch | Base | Phase | Dependencies | PR Target |
|--------|------|-------|--------------|-----------|
| `feature/create-collection-unit-tests-sdk` | `develop` | 17 (SDK) | Phase 08 | `develop` |
| `feature/create-collection-unit-tests-indexer` | `develop` | 17 (Indexer) | Phase 10 | `develop` |
| `feature/create-collection-unit-tests-metadata` | `develop` | 17 (Metadata) | Phase 11 | `develop` |
| `feature/create-collection-unit-tests-notifications` | `develop` | 17 (Notifications) | Phase 15 | `develop` |
| `feature/create-collection-integration-tests` | `develop` | 18 | All | `develop` |

---

## Branch Matrix by Project

### zuno-marketplace-ui (Use existing branch)

```
feature/sub-kimi-implement-remaning-create-collections (EXISTING)
├── Phase 04: UI Error Handling
├── Phase 05: State Persistence
├── Phase 06: Gas Estimation
├── Phase 07: State Machine
├── Phase 12: Enhanced Hook
├── Phase 13: UI-SDK Integration
├── Phase 16: UI Components
└── Phase 19: E2E Tests
```

**Workflow:**
1. Implement phases trong existing branch
2. Tạo PR từ `feature/sub-kimi-implement-remaning-create-collections` → `develop`
3. Review và merge qua PR (không merge trực tiếp)

---

### zuno-marketplace-api (Use existing branch)

```
feature/sub-implement-create-collection (EXISTING)
├── Phase 01: Error Handling (if needed)
├── Phase 02: Shared Types
├── Phase 03: Database Schema
├── Phase 09: API Collection Service
├── Phase 14: API-Indexer Sync
└── Phase 15: Notifications (partial)
```

**Workflow:**
1. Implement phases trong existing branch
2. Tạo PR từ `feature/sub-implement-create-collection` → `develop`
3. Review và merge qua PR (không merge trực tiếp)

---

### zuno-marketplace-sdk (New branches)

| Phase | Branch | PR Target |
|-------|--------|-----------|
| 01 | `feature/create-collection-error-handling-sdk` | `develop` |
| 02 | `feature/create-collection-shared-types` | `develop` |
| 08 | `feature/create-collection-sdk-module` | `develop` |
| 17 | `feature/create-collection-unit-tests-sdk` | `develop` |

---

### zuno-marketplace-indexer (New branches)

| Phase | Branch | PR Target |
|-------|--------|-----------|
| 01 | `feature/create-collection-error-handling-indexer` | `develop` |
| 10 | `feature/create-collection-indexer-handlers` | `develop` |
| 17 | `feature/create-collection-unit-tests-indexer` | `develop` |

---

### zuno-marketplace-metadata (New branches)

| Phase | Branch | PR Target |
|-------|--------|-----------|
| 01 | `feature/create-collection-error-handling-metadata` | `develop` |
| 11 | `feature/create-collection-metadata-service` | `develop` |
| 17 | `feature/create-collection-unit-tests-metadata` | `develop` |

---

### zuno-marketplace-notifications (New branches)

| Phase | Branch | PR Target |
|-------|--------|-----------|
| 01 | `feature/create-collection-error-handling-notifications` | `develop` |
| 15 | `feature/create-collection-notifications` | `develop` |
| 17 | `feature/create-collection-unit-tests-notifications` | `develop` |

---

## Cross-Project Integration Tests

| Branch | Purpose | Dependencies |
|--------|---------|--------------|
| `feature/create-collection-integration-tests` | Cross-project tests | All phases complete |

---

## Visual Flow

```
develop
  │
  ├──► zuno-marketplace-ui
  │     └──► feature/sub-kimi-implement-remaning-create-collections (EXISTING)
  │           ├── Phase 04-07, 12-13, 16, 19
  │           └── PR ──────────────────────────────► develop
  │
  ├──► zuno-marketplace-api
  │     └──► feature/sub-implement-create-collection (EXISTING)
  │           ├── Phase 01-03, 09, 14-15
  │           └── PR ──────────────────────────────► develop
  │
  ├──► zuno-marketplace-sdk
  │     ├──► feature/create-collection-error-handling-sdk
  │     │     └── PR ──────────────────────────────► develop
  │     ├──► feature/create-collection-shared-types
  │     │     └── PR ──────────────────────────────► develop
  │     ├──► feature/create-collection-sdk-module
  │     │     └── PR ──────────────────────────────► develop
  │     └──► feature/create-collection-unit-tests-sdk
  │           └── PR ──────────────────────────────► develop
  │
  ├──► zuno-marketplace-indexer
  │     ├──► feature/create-collection-error-handling-indexer
  │     │     └── PR ──────────────────────────────► develop
  │     ├──► feature/create-collection-indexer-handlers
  │     │     └── PR ──────────────────────────────► develop
  │     └──► feature/create-collection-unit-tests-indexer
  │           └── PR ──────────────────────────────► develop
  │
  ├──► zuno-marketplace-metadata
  │     ├──► feature/create-collection-error-handling-metadata
  │     │     └── PR ──────────────────────────────► develop
  │     ├──► feature/create-collection-metadata-service
  │     │     └── PR ──────────────────────────────► develop
  │     └──► feature/create-collection-unit-tests-metadata
  │           └── PR ──────────────────────────────► develop
  │
  ├──► zuno-marketplace-notifications
  │     ├──► feature/create-collection-error-handling-notifications
  │     │     └── PR ──────────────────────────────► develop
  │     ├──► feature/create-collection-notifications
  │     │     └── PR ──────────────────────────────► develop
  │     └──► feature/create-collection-unit-tests-notifications
  │           └── PR ──────────────────────────────► develop
  │
  └──► Integration Tests
        └──► feature/create-collection-integration-tests
              └── PR ──────────────────────────────► develop
```

---

## Commands Reference

### For Existing Branches (UI/API)

```bash
# UI - sử dụng branch hiện tại
git checkout feature/sub-kimi-implement-remaning-create-collections
git pull origin feature/sub-kimi-implement-remaning-create-collections

# Implement phases...

# Push và tạo PR
git push origin feature/sub-kimi-implement-remaning-create-collections
# Tạo PR: feature/sub-kimi-implement-remaning-create-collections → develop

# API - sử dụng branch hiện tại
git checkout feature/sub-implement-create-collection
git pull origin feature/sub-implement-create-collection

# Implement phases...

# Push và tạo PR
git push origin feature/sub-implement-create-collection
# Tạo PR: feature/sub-implement-create-collection → develop
```

### For New Branches (Other projects)

```bash
# Tạo branch mới từ develop
git checkout develop
git pull origin develop
git checkout -b feature/create-collection-{phase}-{project}

# Implement...

# Push và tạo PR
git push -u origin feature/create-collection-{phase}-{project}
# Tạo PR: feature/create-collection-{phase}-{project} → develop
```

---

## PR Requirements

### Mandatory
- [ ] PR title format: `[Create Collection] {Phase}: {Description}`
- [ ] PR template điền đầy đủ
- [ ] Tests pass
- [ ] Code review từ ít nhất 1 người
- [ ] Không merge conflict với `develop`

### PR Template
```markdown
## [Create Collection] Phase {XX}: {Description}

### Project
{UI/SDK/API/Indexer/Metadata/Notifications}

### Changes
- [ ] Mô tả changes

### Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

### Related
- Issue: #66
- Depends on: #{other_pr}
- Blocks: #{other_pr}

### Notes
- UI/API: Implement trong existing branch
- Others: Branch mới từ develop
```

---

## Execution Timeline

### Week 1: Infrastructure
- UI: Implement Phase 04-05 trong `feature/sub-kimi-implement-remaning-create-collections`
- API: Implement Phase 02-03 trong `feature/sub-implement-create-collection`
- SDK/Indexer/Metadata/Notifications: Tạo branch mới, implement Phase 01
- Review và merge các PR

### Week 2: Core Implementation
- UI: Phase 06-07 trong existing branch
- API: Phase 09 trong existing branch
- SDK: Phase 08 trong branch mới
- Indexer: Phase 10 trong branch mới
- Metadata: Phase 11 trong branch mới

### Week 3: Integration
- UI: Phase 12-13 trong existing branch
- API: Phase 14-15 trong existing branch
- Notifications: Phase 15 trong branch mới

### Week 4: UI Components + Testing
- UI: Phase 16, 19 trong existing branch
- All: Phase 17-18 trong branch mới

### Week 5: Final PRs
- Tạo PR cuối cùng cho UI và API
- Merge all to develop

---

## Checklist trước khi tạo PR

- [ ] Branch được rebase với `develop` mới nhất
- [ ] Tests pass locally
- [ ] Không có console.log hoặc debug code
- [ ] Code follows project conventions
- [ ] PR description đầy đủ
- [ ] Assign reviewer
- [ ] Link đến issue #66
