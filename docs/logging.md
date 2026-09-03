# Logging Configuration
# Framework: SLF4J + Logback (Spring Boot default)
# Levels: ERROR, WARN, INFO, DEBUG, TRACE
# Pattern: %d{HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
# File rotation: Daily, 30 day retention, 10MB max size
# Environment-specific:
#   - Local: DEBUG level, console output
#   - Production: INFO level, structured JSON output
# Correlation: Request ID tracing via MDC
