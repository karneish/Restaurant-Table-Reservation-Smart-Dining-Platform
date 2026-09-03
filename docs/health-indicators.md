# Health Indicators
# Each service exposes /actuator/health via Spring Boot Actuator
# Response format: { "status": "UP", "components": { "db": {...}, "diskSpace": {...} } }
# Custom health checks:
#   - Database connectivity (db component)
#   - Eureka registration (discoveryClient component)
#   - Service-to-service connectivity (custom components)
# Gateway aggregates upstream health via circuit breaker state
