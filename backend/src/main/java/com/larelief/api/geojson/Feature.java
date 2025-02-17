package com.larelief.api.geojson;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Map;

/**
 * Represents a single feature in the GeoJSON.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Feature {
    private String type;

    // Some GeoJSON files have an "id", some do not. Keep it optional.
    private int id;

    private Map<String, Object> properties;
    private Geometry geometry;

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public Map<String, Object> getProperties() {
        return properties;
    }
    public void setProperties(Map<String, Object> properties) {
        this.properties = properties;
    }

    public Geometry getGeometry() {
        return geometry;
    }
    public void setGeometry(Geometry geometry) {
        this.geometry = geometry;
    }
}
