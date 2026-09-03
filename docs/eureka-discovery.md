# Netflix Eureka Service Discovery
# Registry URL: http://localhost:8761/eureka/
# Each service registers on startup and sends heartbeats
# Discovery: Services resolve each other via Eureka client
# Dashboard: http://localhost:8761 - lists all registered instances
# Configuration:
#   - eureka.client.serviceUrl.defaultZone: Registry URL
#   - eureka.instance.preferIpAddress: true (Docker)
#   - eureka.client.fetchRegistry: true
