FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY services/pom.xml services/pom.xml
COPY services/common/pom.xml services/common/pom.xml
WORKDIR /workspace/services
RUN mvn dependency:go-offline -B 2>/dev/null || true
WORKDIR /workspace
COPY services/ services/
ARG MODULE
RUN cd services && mvn clean package -DskipTests -pl $MODULE -am
FROM eclipse-temurin:21-jre-alpine
RUN apk add --no-cache curl
ARG MODULE PORT=8080
WORKDIR /app
COPY --from=build /workspace/services/$MODULE/target/*.jar app.jar
EXPOSE $PORT
HEALTHCHECK --interval=15s --timeout=5s --retries=10 --start-period=90s CMD curl -fsS http://localhost:$PORT/actuator/health || exit 1
ENTRYPOINT ["java", "-jar", "app.jar"]
