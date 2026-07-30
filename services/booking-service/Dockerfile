FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/booking-service-*.jar app.jar
EXPOSE 8086
ENTRYPOINT ["java", "-jar", "app.jar"]
