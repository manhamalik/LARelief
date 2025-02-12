package com.larelief.api.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api")
public class AirQualityDistrictController {

    // The OpenWeather API key is injected from your environment variable (set on Render or locally)
    @Value("${openweather.api.key}")
    private String openWeatherApiKey;

    @GetMapping("/airquality/districts")
    public ResponseEntity<?> getDistrictAirQuality() {
        List<Map<String, Object>> results = new ArrayList<>();
        RestTemplate restTemplate = new RestTemplate();

        // Define district data with a center (for API calls) and an approximate curved boundary.
        // (The coordinates below are approximations.)
        List<Map<String, Object>> districts = Arrays.asList(
            createDistrict("Downtown LA", 34.054, -118.250, Arrays.asList(
                new double[]{34.057, -118.267},
                new double[]{34.062, -118.255},
                new double[]{34.058, -118.240},
                new double[]{34.044, -118.235},
                new double[]{34.032, -118.245},
                new double[]{34.034, -118.263},
                new double[]{34.044, -118.270},
                new double[]{34.057, -118.267}
            )),
            createDistrict("Hollywood", 34.106, -118.343, Arrays.asList(
                new double[]{34.113, -118.355},
                new double[]{34.121, -118.332},
                new double[]{34.103, -118.323},
                new double[]{34.095, -118.350},
                new double[]{34.108, -118.360},
                new double[]{34.113, -118.355}
            )),
            createDistrict("Westside", 34.035, -118.455, Arrays.asList(
                new double[]{34.040, -118.480},
                new double[]{34.050, -118.460},
                new double[]{34.035, -118.445},
                new double[]{34.020, -118.455},
                new double[]{34.025, -118.475},
                new double[]{34.040, -118.480}
            )),
            createDistrict("Pasadena", 34.150, -118.150, Arrays.asList(
                new double[]{34.160, -118.160},
                new double[]{34.170, -118.130},
                new double[]{34.140, -118.120},
                new double[]{34.130, -118.150},
                new double[]{34.150, -118.170},
                new double[]{34.160, -118.160}
            )),
            createDistrict("Burbank", 34.185, -118.320, Arrays.asList(
                new double[]{34.190, -118.330},
                new double[]{34.200, -118.310},
                new double[]{34.180, -118.300},
                new double[]{34.170, -118.320},
                new double[]{34.185, -118.340},
                new double[]{34.190, -118.330}
            )),
            createDistrict("Inglewood", 33.965, -118.357, Arrays.asList(
                new double[]{33.970, -118.370},
                new double[]{33.980, -118.350},
                new double[]{33.960, -118.340},
                new double[]{33.950, -118.360},
                new double[]{33.960, -118.380},
                new double[]{33.970, -118.370}
            )),
            createDistrict("Long Beach", 33.780, -118.195, Arrays.asList(
                new double[]{33.785, -118.215},
                new double[]{33.795, -118.195},
                new double[]{33.775, -118.175},
                new double[]{33.760, -118.190},
                new double[]{33.765, -118.210},
                new double[]{33.785, -118.215}
            )),
            createDistrict("Santa Monica", 34.025, -118.500, Arrays.asList(
                new double[]{34.030, -118.520},
                new double[]{34.040, -118.490},
                new double[]{34.020, -118.470},
                new double[]{34.000, -118.480},
                new double[]{34.010, -118.510},
                new double[]{34.030, -118.520}
            ))
        );

        for (Map<String, Object> district : districts) {
            double lat = (double) district.get("lat");
            double lon = (double) district.get("lon");
            String url = "http://api.openweathermap.org/data/2.5/air_pollution?lat=" 
                    + lat + "&lon=" + lon + "&appid=" + openWeatherApiKey;
            int aqi = -1;
            try {
                Map<String, Object> apiResponse = restTemplate.getForObject(url, Map.class);
                if (apiResponse != null && apiResponse.containsKey("list")) {
                    List list = (List) apiResponse.get("list");
                    if (!list.isEmpty()) {
                        Map<String, Object> first = (Map<String, Object>) list.get(0);
                        Map<String, Object> main = (Map<String, Object>) first.get("main");
                        aqi = (int) main.get("aqi");
                    }
                }
            } catch (Exception e) {
                // Log or handle error as needed; leave aqi as -1 if error occurs.
            }
            Map<String, Object> result = new HashMap<>();
            result.put("name", district.get("name"));
            result.put("aqi", aqi);
            result.put("polygon", district.get("polygon"));
            results.add(result);
        }
        return ResponseEntity.ok(results);
    }

    private Map<String, Object> createDistrict(String name, double lat, double lon, List<double[]> polygon) {
        Map<String, Object> district = new HashMap<>();
        district.put("name", name);
        district.put("lat", lat);
        district.put("lon", lon);
        district.put("polygon", polygon);
        return district;
    }
}
