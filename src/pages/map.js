import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faTshirt,
  faToilet,
  faMoneyBillWave,
  faHome,
  faCar,
  faGavel,
  faBriefcaseMedical,
  faBrain,
  faPaw,
  faBone,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import resources from "@/data/resources";
import ClusteredMarkers from "@/components/ClusteredMarkers";

// Dynamically import react-leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

let L;

if (typeof window !== "undefined") {
  L = require("leaflet");
}

// Icon configuration
const iconConfig = {
  "Food & Water": { icon: "fa-solid fa-utensils", color: "#015BC3" },
  "Clothing & Personal Items": { icon: "fa-solid fa-tshirt", color: "#015BC3" },
  "Hygiene & Sanitation": { icon: "fa-solid fa-toilet", color: "#015BC3" },
  "Financial Support": { icon: "fa-solid fa-money-bill-wave", color: "#015BC3" },
  "Shelters & Housing Assistance": { icon: "fa-solid fa-home", color: "#4D03CD" },
  "Transportation Assistance": { icon: "fa-solid fa-car", color: "#4D03CD" },
  "Legal Aid": { icon: "fa-solid fa-gavel", color: "#4D03CD" },
  "Medical Aid & First Aid": { icon: "fa-solid fa-briefcase-medical", color: "#CC0000" },
  "Mental Health Support": { icon: "fa-solid fa-brain", color: "#CC0000" },
  "Animal Boarding": { icon: "fa-solid fa-paw", color: "#CF5700" },
  "Veterinary Care & Pet Food": { icon: "fa-solid fa-bone", color: "#CF5700" },
};

const createCustomIcon = (types) => {
  const colors = types.map((type) => iconConfig[type]?.color || "#000");
  const icons = types.map((type) => iconConfig[type]?.icon || "fa-circle");

  // Generate HTML for stacked or inline icons
  const iconHTML = icons
    .map(
      (icon, index) =>
        `<i class="${icon}" style="color: ${colors[index]}; font-size: 16px; margin-right: 2px;"></i>`
    )
    .join("");

  return L.divIcon({
    html: `<div style="display: flex; align-items: center;">${iconHTML}</div>`,
    className: "custom-div-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};


export default function MapPage() {
  const categories = [
    {
      label: "Essentials",
      icon: faUtensils,
      subcategories: [
        { label: "Food & Water", icon: faUtensils },
        { label: "Clothing & Personal Items", icon: faTshirt },
        { label: "Hygiene & Sanitation", icon: faToilet },
        { label: "Financial Support", icon: faMoneyBillWave },
      ],
    },
    {
      label: "Shelter & Support Services",
      icon: faHome,
      subcategories: [
        { label: "Shelters & Housing Assistance", icon: faHome },
        { label: "Transportation Assistance", icon: faCar },
        { label: "Legal Aid", icon: faGavel },
      ],
    },
    {
      label: "Medical & Health",
      icon: faBriefcaseMedical,
      subcategories: [
        { label: "Medical Aid & First Aid", icon: faBriefcaseMedical },
        { label: "Mental Health Support", icon: faBrain },
      ],
    },
    {
      label: "Animal Support",
      icon: faPaw,
      subcategories: [
        { label: "Animal Boarding", icon: faPaw },
        { label: "Veterinary Care & Pet Food", icon: faBone },
      ],
    },
  ];

  const [isClient, setIsClient] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    setSelectedSubcategories([]);
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((item) => item !== subcategory)
        : [...prev, subcategory]
    );
  };

  const handleMarkerClick = (resource) => {
    setSelectedResource(resource);
  };

  const filteredResources = resources.filter((resource) => {
    if (!selectedCategory && selectedSubcategories.length === 0) return true;

    if (selectedSubcategories.length > 0) {
      return resource.types.some((type) => selectedSubcategories.includes(type));
    }

    return resource.mainCategory === selectedCategory;
  });

  if (!isClient) {
    return null; // Prevent SSR-related errors
  }

  return (
    <div className="relative">
      <Head>
        <title>LA Relief - Map of Resources</title>
      </Head>

      <section id="map" className="relative bg-green-800 text-white">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <aside className="w-full md:w-1/4 bg-green-900 text-white p-6">
            <h3 className="text-2xl font-bold mb-4">Resource Options</h3>
            <ul className="space-y-4">
              {categories.map((category) => (
                <li key={category.label}>
                  <div
                    className={`cursor-pointer flex items-center gap-3 ${
                      selectedCategory === category.label ? "font-bold" : ""
                    }`}
                    onClick={() => handleCategoryClick(category.label)}
                  >
                    <FontAwesomeIcon icon={category.icon} />
                    {category.label}
                  </div>
                  {selectedCategory === category.label && (
                    <ul className="pl-6 mt-2 space-y-2">
                      {category.subcategories.map((subcategory) => (
                        <li
                          key={subcategory.label}
                          className={`cursor-pointer flex items-center gap-3 ${
                            selectedSubcategories.includes(subcategory.label)
                              ? "font-bold"
                              : ""
                          }`}
                          onClick={() => handleSubcategoryClick(subcategory.label)}
                        >
                          <FontAwesomeIcon icon={subcategory.icon} />
                          {subcategory.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li
                className="cursor-pointer flex items-center gap-3 font-bold mt-4"
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubcategories([]);
                }}
              >
                <FontAwesomeIcon icon={faCircleInfo} />
                Show All
              </li>
            </ul>
          </aside>

          {/* Map */}
          <div className="relative w-full h-screen">
            <MapContainer
              center={[34.0522, -118.2437]} // Los Angeles center
              zoom={11}
              scrollWheelZoom={true}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <ClusteredMarkers
  resources={filteredResources}
  createCustomIcon={createCustomIcon}
  handleMarkerClick={handleMarkerClick}
/>

            </MapContainer>

            {/* Selected Resource Card */}
            {selectedResource && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white text-black rounded-xl shadow-lg p-6 w-96">
                <h4 className="text-xl font-bold mb-2">{selectedResource.name}</h4>
                <p className="text-sm mb-2">{selectedResource.organization_name}</p>
                <p className="text-sm mb-2">{selectedResource.address}</p>
                <p className="text-sm mb-2">
                  {selectedResource.start_date} | {selectedResource.start_time} - {selectedResource.end_time}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
