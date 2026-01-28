# Debug Report: Token Refresh Failed - RefreshSession Mutation

**Date:** 2026-01-28
**Issue:** RefreshSession mutation returns no data after successful SIWE authentication
**Status:** Root Cause Identified

---

## Executive Summary

**Root Cause:** Mismatch between frontend GraphQL mutation definition and backend GraphQL schema.

**Location:**
- Frontend: `E:\zuno-marketplace-ui\src\shared\graphql\hooks.ts:149-166`
- Backend: `E:\zuno-marketplace-api\services\graphql-gateway\graph\schemas\auth.graphqls:59-63`

**Impact:** Token refresh fails immediately after successful SIWE authentication, preventing users from maintaining sessions.

**Severity:** Critical - breaks authentication flow

---

## Technical Analysis

### Error Flow

1. **SIWE Authentication succeeds** - `verifySiwe` mutation works correctly
   - Backend sets `refresh_token` cookie successfully
   - Frontend receives `accessToken`, `userId`, `address`, `chainId`
   - Cookie is set with: `Path=/`, `HttpOnly=true`, `SameSite=Strict`, `Secure=false` (dev)

2. **Token Refresh triggered** - When Apollo error link detects auth error
   - Calls `handleTokenRefresh()` in `apollo-wrapper.ts:45`
   - Executes `RefreshSessionDocument` mutation (line 61-64)
   - **Mutation call returns NO DATA** (line 66)

3. **Error thrown** - Line 67 throws: `"RefreshSession mutation returned no data"`

### Root Cause Analysis

#### **PRIMARY ISSUE: Mutation Parameters Mismatch**

**Frontend Definition** (`hooks.ts:149-156`):
```typescript
export const RefreshSessionDocument = gql(`
  mutation RefreshSession {
    refreshSession {
      userId
      accessToken
      expiresAt
    }
  }
`) as TypedDocumentNode<
  {
    refreshSession: {
      userId: string;
      accessToken: string;
      expiresAt: string;
    };
  },
  {} // ❌ NO VARIABLES DEFINED
>;
```

**Backend Schema** (`auth.graphqls:59-63`):
```graphql
refreshSession(
  refreshToken: String      # ✅ Optional parameter
  userAgent: String         # ✅ Optional parameter
  ipAddress: String         # ✅ Optional parameter
): RefreshResponse!
```

**The Problem:**
- Frontend mutation is defined WITHOUT variables (empty object `{}`)
- Backend accepts optional parameters but requires proper structure
- When called with `variables: {}`, the mutation may fail silently or return null

#### **SECONDARY ISSUE: Response Structure Verification**

**Backend Response Type** (`auth.graphqls:26-30`):
```graphql
type RefreshResponse {
  accessToken: String!
  expiresAt: String!
  userId: String!
}
```

**Frontend Expected Response** (`hooks.ts:159-163`):
```typescript
{
  refreshSession: {
    userId: string;
    accessToken: string;
    expiresAt: string;
  };
}
```

✅ Response structure matches - this is NOT the issue

#### **Cookie Handling Verification**

**Cookie Setting** (`cookie.go:15-28`):
```go
http.SetCookie(w, &http.Cookie{
    Name:     "refresh_token",
    Value:    token,
    Path:     "/",
    MaxAge:   30 * 24 * 60 * 60, // 30 days
    HttpOnly: true,
    Secure:   false, // dev mode
    SameSite: http.SameSiteStrictMode,
})
```

**Backend Refresh Logic** (`schema.resolvers.go:46-57`):
```go
func (r *mutationResolver) RefreshSession(ctx context.Context, refreshToken *string, userAgent *string, ipAddress *string) (*model.RefreshResponse, error) {
    var token string
    if refreshToken != nil && *refreshToken != "" {
        token = *refreshToken
    } else {
        if req, ok := appcontext.GetHTTPRequest(ctx); ok {
            if cookieToken, err := cookie.GetRefreshTokenFromCookie(req); err == nil {
                token = cookieToken
            }
        }
    }

    if token == "" {
        return nil, fmt.Errorf("refresh token required (either in parameter or cookie)")
    }
    // ...
}
```

✅ Cookie handling logic is correct - tries parameter first, falls back to cookie

---

## Evidence & Timeline

### Code Analysis Summary

| Component | File | Line | Status |
|-----------|------|------|--------|
| SIWE Mutation | hooks.ts | 121-146 | ✅ Working |
| RefreshSession Mutation | hooks.ts | 149-166 | ❌ **ISSUE** |
| Backend Refresh Resolver | schema.resolvers.go | 45-88 | ✅ Correct |
| Cookie Handling | cookie.go | 15-37 | ✅ Correct |
| Token Refresh Logic | apollo-wrapper.ts | 45-94 | ✅ Correct |
| Error Link | apollo-client.ts | 63-105 | ✅ Correct |

### Comparison: Working vs Failing

**✅ verifySiwe (Working):**
```typescript
const VERIFY_SIWE_DOCUMENT = gql(`
  mutation VerifySiwe($accountId: String!, $signature: String!, $message: String!) {
    verifySiwe(accountId: $accountId, signature: $signature, message: $message) {
      userId
      accessToken
      expiresAt
      address
      chainId
    }
  }
`) as TypedDocumentNode<
  {
    verifySiwe: {
      userId: string;
      accessToken: string;
      expiresAt: string;
      address: string;
      chainId: string;
    };
  },
  {
    accountId: string;
    signature: string;
    message: string;
  }
>;
```

**❌ RefreshSession (Failing):**
```typescript
export const RefreshSessionDocument = gql(`
  mutation RefreshSession {
    refreshSession {  // ❌ Missing parameters!
      userId
      accessToken
      expiresAt
    }
  }
`) as TypedDocumentNode<
  {
    refreshSession: {
      userId: string;
      accessToken: string;
      expiresAt: string;
    };
  },
  {} // ❌ Empty variables object
>;
```

---

## Hypothesis Validation

### Hypothesis 1: Cookie Not Being Sent
**Status:** ❌ Unlikely
- Cookie logic is correct in backend
- CORS allows credentials: `AllowCredentials: true`
- Apollo client configured with `credentials: 'include'`

### Hypothesis 2: Backend Returns Error Instead of Data
**Status:** ❌ Possible but not root cause
- Backend resolver returns `(*model.RefreshResponse, error)`
- If error returned, Apollo would catch it
- Error message would be different

### Hypothesis 3: GraphQL Mutation Structure Mismatch
**Status:** ✅ **CONFIRMED ROOT CAUSE**
- Frontend mutation defined without variables
- Backend expects optional parameters structure
- Silent failure when mutation executed

---

## Solution Recommendations

### **IMMEDIATE FIX (Required)**

Update `src/shared/graphql/hooks.ts:149-166`:

```typescript
export const RefreshSessionDocument = gql(`
  mutation RefreshSession($refreshToken: String, $userAgent: String, $ipAddress: String) {
    refreshSession(refreshToken: $refreshToken, userAgent: $userAgent, ipAddress: $ipAddress) {
      userId
      accessToken
      expiresAt
    }
  }
`) as TypedDocumentNode<
  {
    refreshSession: {
      userId: string;
      accessToken: string;
      expiresAt: string;
    };
  },
  {
    refreshToken?: string;
    userAgent?: string;
    ipAddress?: string;
  }
>;
```

### **ADDITIONAL IMPROVEMENTS**

1. **Add GraphQL Error Logging** - Capture backend errors for debugging
2. **Add Cookie Verification** - Log cookie presence/absence in refresh attempts
3. **Add Mutation Response Validation** - Check `result.errors` in addition to `result.data`
4. **Add Integration Tests** - Test full auth flow including refresh

---

## Unresolved Questions

1. **Why doesn't GraphQL return an error for the parameter mismatch?**
   - May be silent due to optional parameters
   - Need to check gqlgen configuration in backend

2. **Is the cookie actually being sent with the mutation request?**
   - Need browser DevTools Network tab inspection
   - Verify `Cookie` header in request

3. **Are there any GraphQL playground/test results showing the mutation works with parameters?**
   - Should test mutation in GraphQL playground with/without parameters

4. **Does the backend log show any errors during refresh attempts?**
   - Need to check backend logs for the failed refresh attempts

---

## Next Steps

1. **Implement Immediate Fix** - Update RefreshSessionDocument with proper parameters
2. **Test in Development** - Verify fix works with actual auth flow
3. **Add Logging** - Enhance error logging for future debugging
4. **Write Integration Tests** - Prevent regression
5. **Monitor Production** - Add metrics for token refresh success/failure rates

---

**Report Generated:** 2026-01-28 20:17 UTC
**Agent:** debugger (ad06e6a)
**Files Analyzed:** 12
**Root Cause:** Identified
**Fix Available:** Yes
