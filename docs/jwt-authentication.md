# JWT Authentication Flow
# 1. Client sends POST /api/auth/login with credentials
# 2. Auth service validates and generates:
#    - Access token (30 min expiry)
#    - Refresh token (7 day expiry)
# 3. Client stores tokens in localStorage
# 4. All API requests include Authorization: Bearer <token>
# 5. Gateway validates token signature and expiry
# 6. On 401, client calls POST /api/auth/refresh with refreshToken
# 7. New tokens issued, original request retried
# Token payload: { sub: email, role: USER_ROLE, exp: timestamp }
