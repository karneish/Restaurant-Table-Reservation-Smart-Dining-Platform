# Error Codes Reference
# 400 BAD_REQUEST - Invalid input or validation failure
# 401 UNAUTHORIZED - Missing or invalid authentication token
# 403 FORBIDDEN - Insufficient permissions for requested action
# 404 NOT_FOUND - Requested resource does not exist
# 409 CONFLICT - Resource already exists or state conflict
# 422 UNPROCESSABLE - Valid syntax but semantic errors
# 429 TOO_MANY_REQUESTS - Rate limit exceeded
# 500 INTERNAL_ERROR - Unexpected server error
# 503 SERVICE_UNAVAILABLE - Downstream service unreachable
#
# Each error response includes: timestamp, status, message, errorCode
# Field validation errors include: fieldErrors map with field-level messages
