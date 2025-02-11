# Use an official JDK runtime as a parent image
FROM eclipse-temurin:21-jdk

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven wrapper and the pom.xml file
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Grant execution permissions to the Maven wrapper
RUN chmod +x mvnw

# Download dependencies (this helps with caching layers)
RUN ./mvnw dependency:go-offline

# Copy the rest of the application
COPY src ./src

# Build the application
RUN ./mvnw package -DskipTests

# Expose the default Spring Boot port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]
