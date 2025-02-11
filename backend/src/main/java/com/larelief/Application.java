package com.larelief;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.larelief.api.controllers"}) // ✅ Ensures Spring Boot scans controllers
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
