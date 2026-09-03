# Spring Cloud Config Server
# Centralized configuration management
# Config source: services/config-server/src/main/resources/config-repo/
# Each service reads its config: application.yml from config server
# Override: Environment variables take precedence over config server
# Refresh: POST /actuator/refresh on each service after config change
# Profiles: local, production, test
