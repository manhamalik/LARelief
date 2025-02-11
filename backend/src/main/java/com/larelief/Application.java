package com.larelief;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
// Ensure that both your controllers and config packages are scanned.
@ComponentScan(basePackages = {"com.larelief.api.controllers", "com.larelief.api.config"})
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
