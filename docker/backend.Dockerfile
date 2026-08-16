# syntax=docker/dockerfile:1

# ------------------------------------------------------------------
# Shared multi-stage Dockerfile for every Spring Boot microservice.
#   Build args:
#     MODULE : Maven module name, e.g. auth-service
#     PORT   : server.port used by the service
#   Builds the requested module (plus the shared `common` module)
#   with Maven, then packages it into a slim JRE 21 image.
# ------------------------------------------------------------------
ARG MODULE
ARG PORT=8080

FROM maven:3.9-eclipse-temurin-21 AS builder
ARG MODULE
ARG PORT=8080
WORKDIR /build

# Warm the Maven dependency cache using only the POM files.
COPY services/pom.xml ./services/pom.xml
COPY services/common/pom.xml ./services/common/pom.xml
RUN --mount=type=cache,target=/root/.m2 \
    mvn -B -q -f services/pom.xml -pl ${MODULE} -am dependency:go-offline -DskipTests || true

# Copy all sources and build the requested module + its dependencies.
COPY services ./services
RUN --mount=type=cache,target=/root/.m2 \
    mvn -B -f services/pom.xml -pl ${MODULE} -am package -DskipTests

FROM eclipse-temurin:21-jre-alpine AS runtime
ARG MODULE
ARG PORT=8080
RUN apk add --no-cache curl
WORKDIR /app
COPY --from=builder /build/services/${MODULE}/target/${MODULE}-1.0.0.jar app.jar
EXPOSE ${PORT}
HEALTHCHECK --interval=30s --timeout=5s --start-period=90s --retries=6 \
    CMD curl -fsS http://localhost:${PORT}/actuator/health || exit 1
ENTRYPOINT ["java", "-jar", "app.jar"]
