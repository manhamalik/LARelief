package com.larelief.api.controllers;

import com.larelief.api.geojson.Feature;
import com.larelief.api.geojson.Geometry;
import com.larelief.api.services.GeoJsonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/airquality")
public class AirQualityNeighborhoodController {

    @Value("${openweather.api.key}")
    private String openWeatherApiKey;

    @Autowired
    private GeoJsonService geoJsonService;

    @GetMapping("/neighborhoods")
    public ResponseEntity<?> getNeighborhoodAirQuality() {
        // Load all neighborhoods (features) from LA Times GeoJSON
        List<Feature> neighborhoods = geoJsonService.getNeighborhoods();
        List<Map<String, Object>> results = new ArrayList<>();

        // Prepare a RestTemplate to call OpenWeather
        RestTemplate restTemplate = new RestTemplate();

        for (Feature feature : neighborhoods) {
            // "name" is in properties
            String neighborhoodName = (String) feature.getProperties().get("name");
            if (neighborhoodName == null) {
                neighborhoodName = "Unknown Neighborhood";
            }

            // Attempt to compute a rough centroid
            Geometry geometry = feature.getGeometry();
            double[] centroid = computeCentroid(geometry);
            double lat = centroid[1];
            double lon = centroid[0];

            // Make a call to OpenWeather
            int aqi = -1;
            if (lat != 0 && lon != 0) {
                try {
                    String url = "http://api.openweathermap.org/data/2.5/air_pollution?lat="
                            + lat + "&lon=" + lon + "&appid=" + openWeatherApiKey;

                    Map<String, Object> apiResponse = restTemplate.getForObject(url, Map.class);
                    if (apiResponse != null && apiResponse.containsKey("list")) {
                        List<?> list = (List<?>) apiResponse.get("list");
                        if (!list.isEmpty()) {
                            Map<String, Object> first = (Map<String, Object>) list.get(0);
                            Map<String, Object> main = (Map<String, Object>) first.get("main");
                            aqi = (int) main.get("aqi");
                        }
                    }
                } catch (Exception e) {
                    // log or handle error
                    aqi = -1;
                }
            }

            // Build a response object
            Map<String, Object> obj = new HashMap<>();
            obj.put("name", neighborhoodName);
            obj.put("aqi", aqi);
            obj.put("geometry", geometry); // raw geometry from the GeoJSON
            results.add(obj);
        }

        return ResponseEntity.ok(results);
    }

    /**
     * Compute a naive centroid for a Polygon or MultiPolygon.
     * If geometry is anything else, returns [0,0].
     */
    private double[] computeCentroid(Geometry geometry) {
        if (geometry == null || geometry.getCoordinates() == null) {
            return new double[]{0, 0};
        }

        String type = geometry.getType();
        Object coords = geometry.getCoordinates();

        double sumLon = 0;
        double sumLat = 0;
        int count = 0;

        if ("Polygon".equalsIgnoreCase(type)) {
            // coords is List<List<List<Double>>]
            // Outer list = array of linear rings, usually 1 ring for boundary
            List<List<List<Double>>> polygon = (List<List<List<Double>>>) coords;
            // We only look at the outer ring (index 0)
            List<List<Double>> outerRing = polygon.get(0);

            for (List<Double> coordinate : outerRing) {
                // coordinate = [lon, lat]
                sumLon += coordinate.get(0);
                sumLat += coordinate.get(1);
                count++;
            }
        } else if ("MultiPolygon".equalsIgnoreCase(type)) {
            // coords is List<List<List<List<Double>>>>
            // Outer list => each polygon => each ring => each coordinate
            List<List<List<List<Double>>>> multi = (List<List<List<List<Double>>>>) coords;

            for (List<List<List<Double>>> singlePoly : multi) {
                // singlePoly is a list of rings
                // We'll just handle the outer ring (index 0) for centroid
                List<List<Double>> ring = singlePoly.get(0);
                for (List<Double> coord : ring) {
                    sumLon += coord.get(0);
                    sumLat += coord.get(1);
                    count++;
                }
            }
        } else {
            // If not polygon or multipolygon, skip
            return new double[]{0, 0};
        }

        if (count == 0) {
            return new double[]{0, 0};
        }

        double centerLon = sumLon / count;
        double centerLat = sumLat / count;
        return new double[]{centerLon, centerLat};
    }
}
