# Microservices Architecture Diagram

Client (React :3000)
  -> API Gateway (:8080)
    -> Auth Service (:8081)
    -> User Service (:8082)
    -> Restaurant Service (:8083)
    -> Table Service (:8084)
    -> Slot Service (:8085)
    -> Reservation Service (:8086)
    -> Payment Service (:8087)
    -> Notification Service (:8088)

Infrastructure:
  -> Service Registry / Eureka (:8761)
  -> Config Server (:8888)
  -> PostgreSQL 16 (:5432)
  -> pgAdmin (:5051)

Service-to-service: WebClient HTTP calls via Eureka discovery
