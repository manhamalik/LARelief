package com.larelief.api.geojson;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Geometry {
    private String type;

    /**
     * For a Polygon, coordinates are typically List<List<List<Double>>>
     * For a MultiPolygon, coordinates are List<List<List<List<Double>>>>
     *
     * We store it as Object to handle both.
     */
    private Object coordinates;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Object getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(Object coordinates) {
        this.coordinates = coordinates;
    }
}
