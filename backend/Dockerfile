# Use Eclipse Temurin JDK 21 as the base image
FROM eclipse-temurin:21-jdk

# Set the working directory
WORKDIR /app

# Copy Maven Wrapper and POM file first (for dependency caching)
COPY backend/pom.xml backend/mvnw backend/.mvn ./

# Run dependency resolution to speed up builds
RUN ./mvnw dependency:resolve

# Copy the entire backend source code
COPY backend/src ./src

# Build the Spring Boot application
RUN ./mvnw clean package -DskipTests

# Copy the built JAR to the container
COPY target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080 for the application
EXPOSE 8080

# Run the Spring Boot application
CMD ["java", "-jar", "app.jar"]
