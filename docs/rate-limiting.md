# Rate Limiting Configuration
# API Gateway rate limiting via Resilience4j RateLimiter
# Defaults:
#   - limitForPeriod: 50 requests
#   - limitRefreshPeriod: 1 minute
#   - timeoutDuration: 0ms (reject immediately)
# Per-service customization via application.yml
# Circuit breaker:
#   - failureRateThreshold: 50%
#   - slowCallRateThreshold: 100%
#   - slowCallDurationThreshold: 2s
#   - waitDurationInOpenState: 30s
#   - permittedNumberOfHalfOpenCalls: 3
