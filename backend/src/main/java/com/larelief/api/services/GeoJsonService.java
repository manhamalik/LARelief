package com.larelief.api.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.larelief.api.geojson.Feature;
import com.larelief.api.geojson.FeatureCollection;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class GeoJsonService {

    /**
     * Loads the LA Times neighborhood GeoJSON from "losangeles.geojson"
     * in src/main/resources.
     */
    private FeatureCollection loadNeighborhoodGeoJson() {
        try {
            ClassPathResource resource = new ClassPathResource("losangeles.geojson");
            try (InputStream is = resource.getInputStream()) {
                ObjectMapper mapper = new ObjectMapper();
                FeatureCollection featureCollection = mapper.readValue(is, FeatureCollection.class);
                return featureCollection;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Returns all the features (neighborhoods) from the LA Times file.
     */
    public List<Feature> getNeighborhoods() {
        FeatureCollection fc = loadNeighborhoodGeoJson();
        if (fc != null && fc.getFeatures() != null) {
            return fc.getFeatures();
        }
        return Collections.emptyList();
    }
}
