# Docker Health Check Configuration
# All services use Spring Boot Actuator /actuator/health
# Parameters: interval=15s, timeout=5s, retries=10, start_period=90s
# Service startup order: PostgreSQL -> Registry -> Config -> Gateway -> Business -> Frontend
