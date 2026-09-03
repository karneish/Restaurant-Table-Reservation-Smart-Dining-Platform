# CORS Configuration
# API Gateway CORS settings:
#   - Allowed origins: Configurable via CORS_ALLOWED_ORIGIN_PATTERNS env var
#   - Default: https://*.vercel.app (cloud), http://localhost:* (local)
#   - Allowed methods: GET, POST, PUT, DELETE, OPTIONS
#   - Allowed headers: Authorization, Content-Type, X-User-Email
#   - Allow credentials: true
#   - Max age: 3600 seconds
# Per-service CORS disabled (handled by gateway only)
