# Use an official JDK runtime as a parent image
FROM eclipse-temurin:21-jdk

# Set the working directory inside the container
WORKDIR /app

# Copy Maven wrapper and pom.xml first to leverage Docker caching
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Grant execution permissions to the Maven wrapper
RUN chmod +x mvnw

# Download dependencies first to leverage caching
RUN ./mvnw dependency:go-offline

# Copy the rest of the source code AFTER dependencies are cached
COPY src ./src

# Build the application
RUN ./mvnw package -DskipTests

# Copy the built JAR file to avoid issues with missing JAR during execution
RUN cp target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose the default Spring Boot port
EXPOSE 1000

# Run the application
CMD ["java", "-jar", "app.jar"]
