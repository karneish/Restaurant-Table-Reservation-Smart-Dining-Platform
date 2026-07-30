FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/movie-service-*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
