import React, { useEffect, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import ResourceCard from "./ResourceCard";
import L from "leaflet";

const clusterMarkers = (resources, zoomLevel, sidebar) => {
  const clusters = [];
  const threshold = zoomLevel < 10 ? Number.MAX_VALUE : zoomLevel < 12 ? 0.05 : 0.01;

  resources.forEach((resource) => {
    let added = false;
    if (zoomLevel >= 14) {
      clusters.push({ center: [resource.latitude, resource.longitude], resources: [resource] });
      return;
    }
    for (const cluster of clusters) {
      const [lat, lon] = cluster.center;
      const distance = Math.sqrt(Math.pow(lat - resource.latitude, 2) + Math.pow(lon - resource.longitude, 2));
      if (distance < threshold) {
        cluster.resources.push(resource);
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

const createClusterIcon = (resources, typeColors) => {
  const colors = Array.from(new Set(resources.flatMap((resource) => resource.types.map((type) => typeColors[type] || "#000"))));
  const totalColors = colors.length;
  const gradientStops = colors.map((color, index) => `${color} ${(index / totalColors) * 80 + 10}%`).join(", ");
  const backgroundStyle = colors.length === 1 ? colors[0] : `linear-gradient(135deg, ${gradientStops})`;
  
  return L.divIcon({
    html: `<div style="background: ${backgroundStyle}; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: bold; border: 2px solid white;"><span>${resources.length}</span></div>`,
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

  return (
    <>
      {clusteredResources.map((cluster, index) => {
        if (zoomLevel < 14 && cluster.resources.length > 1) {
          return (
            <Marker key={index} position={cluster.center} icon={createClusterIcon(cluster.resources, typeColors)}>
              <Popup>
                <strong>{cluster.resources.length} Opportunities</strong>
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
          return cluster.resources.map((resource, i) => (
            <Marker
  key={`marker-${i}`}
  position={[resource.latitude, resource.longitude]}
  icon={createCustomIcon(resource.types)}
  eventHandlers={{ click: () => handleMarkerClick(resource) }}
>
<Popup 
offset={[0, -20]}            // moves the popup up 20px
    className="my-custom-popup">
    <ResourceCard resource={resource} />
  </Popup>
</Marker>
          ));
        }
      })}
    </>
  );
};

export default ClusteredMarkers;
