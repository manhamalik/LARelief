package com.larelief.api.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@RequestMapping("/api")
public class WildfireController {

    private final String CAL_FIRE_URL = "https://www.fire.ca.gov/umbraco/api/IncidentApi/List?inactiveIncidents=true";

    @GetMapping("/wildfires")
    public ResponseEntity<?> getWildfires() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<List> response = restTemplate.getForEntity(CAL_FIRE_URL, List.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                return ResponseEntity.ok(response.getBody());
            } else {
                return ResponseEntity.status(response.getStatusCode()).body("Failed to fetch data from CAL FIRE");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching wildfire data: " + e.getMessage());
        }
    }
}
