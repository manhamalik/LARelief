import React, { useEffect, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Utility function to cluster markers
const clusterMarkers = (resources, zoomLevel) => {
  const clusters = [];
  const threshold = zoomLevel < 7 ? Number.MAX_VALUE : zoomLevel < 15 ? 0.002 : 0.005; // Adjust cluster radius based on zoom
  
  resources.forEach((resource) => {
    let added = false;

    for (const cluster of clusters) {
      const [lat, lon] = cluster.center;
      const distance = Math.sqrt(
        Math.pow(lat - resource.latitude, 2) + Math.pow(lon - resource.longitude, 2)
      );

      if (distance < threshold) {
        cluster.resources.push(resource);
        cluster.center = [
          (lat * cluster.resources.length + resource.latitude) / (cluster.resources.length + 1),
          (lon * cluster.resources.length + resource.longitude) / (cluster.resources.length + 1),
        ];
        added = true;
        break;
      }
    }

    if (!added) {
      clusters.push({ center: [resource.latitude, resource.longitude], resources: [resource] });
    }
  });

  return clusters;
};

const typeColors = {
    "Food & Water": "#015BC3",
    "Clothing & Personal Items": "#015BC3",
    "Hygiene & Sanitation": "#015BC3",
    "Financial Support": "#015BC3",
    "Shelters & Housing Assistance": "#4D03CD",
    "Transportation Assistance": "#4D03CD",
    "Legal Aid": "#4D03CD",
    "Medical Aid & First Aid": "#CC0000",
    "Mental Health Support": "#CC0000",
    "Animal Boarding": "#CF5700",
    "Veterinary Care & Pet Food": "#CF5700",
  };
// Custom icon generator for clusters
const createClusterIcon = (resources, typeColors) => {
    // Determine all unique colors for the types in the cluster
    const colors = Array.from(
      new Set(resources.flatMap((resource) => resource.types.map((type) => typeColors[type] || "#000")))
    );
  
    // Generate a smooth linear gradient for the cluster icon
    const gradient = colors.join(", "); // Join colors in the order they should appear
  
    return L.divIcon({
      html: `<div style="
        background: linear-gradient(135deg, ${gradient});
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
      ">
        ${resources.length}
      </div>`,
      className: "custom-cluster-icon",
      iconSize: [40, 40],
    });
  };
  
  

const ClusteredMarkers = ({ resources, createCustomIcon, handleMarkerClick }) => {
  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());
  const [clusteredResources, setClusteredResources] = useState([]);

  useEffect(() => {
    const handleZoom = () => setZoomLevel(map.getZoom());
    map.on("zoomend", handleZoom);
    return () => map.off("zoomend", handleZoom);
  }, [map]);

  useEffect(() => {
    setClusteredResources(clusterMarkers(resources, zoomLevel));
  }, [resources, zoomLevel]);

  return (
    <>
      {clusteredResources.map((cluster, index) => {
        if (zoomLevel < 10 || cluster.resources.length > 1) {
          // Render cluster marker
          return (
            <Marker
  key={index}
  position={cluster.center}
  icon={createClusterIcon(cluster.resources, typeColors)}
>
  <Popup>
    <strong>{cluster.resources.length} Resources</strong>
    <ul>
      {cluster.resources.slice(0, 10).map((resource) => (
        <li key={resource.name}>{resource.name}</li>
      ))}
      {cluster.resources.length > 10 && <li>And more...</li>}
    </ul>
  </Popup>
</Marker>

          );
        } else {
          // Render individual marker
          const resource = cluster.resources[0];
          return (
            <Marker
              key={resource.name}
              position={[resource.latitude, resource.longitude]}
              icon={createCustomIcon(resource.types)}
              eventHandlers={{ click: () => handleMarkerClick(resource) }}
            >
              <Popup>
                <strong>{resource.name}</strong>
                <p>{resource.address}</p>
              </Popup>
            </Marker>
          );
        }
      })}
    </>
  );
};

export default ClusteredMarkers;
