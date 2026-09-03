# API Architecture
# Client -> API Gateway (8080) -> Service -> Database
# Gateway handles: routing, JWT validation, rate limiting, CORS, circuit breaker
# Service discovery via Netflix Eureka
# Auth flow: Login -> JWT (access+refresh) -> Bearer token -> Gateway validates -> Forward
