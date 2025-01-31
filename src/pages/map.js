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
  faMapPin,
  faBurger,
  faBath,
  faUsers,
  faCircleInfo,
  faDog,
  faSearch,
  faClock,
  faDollarSign,
  faHandsHelping,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import resources from "@/data/resources";

// Dynamically import Leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const ClusteredMarkers = dynamic(() => import("@/components/ClusteredMarkers"), { ssr: false });

let L;
if (typeof window !== "undefined") {
  L = require("leaflet");
}

// Icon configuration
const iconConfig = {
  "Food & Water": { icon: "fa-solid fa-burger", color: "#015BC3" },
  "Clothing & Personal Items": { icon: "fa-solid fa-tshirt", color: "#015BC3" },
  "Hygiene & Sanitation": { icon: "fa-solid fa-bath ", color: "#015BC3" },
  "Financial Support": { icon: "fa-solid fa-money-bill-wave", color: "#015BC3" },
  "Shelters & Housing Assistance": { icon: "fa-solid fa-home", color: "#4D03CD" },
  "Transportation Assistance": { icon: "fa-solid fa-car", color: "#4D03CD" },
  "Legal Aid": { icon: "fa-solid fa-gavel", color: "#4D03CD" },
  "Medical Aid & First Aid": { icon: "fa-solid fa-briefcase-medical", color: "#CC0000" },
  "Mental Health Support": { icon: "fa-solid fa-users", color: "#CC0000" },
  "Animal Boarding": { icon: "fa-solid fa-dog", color: "#CF5700" },
  "Veterinary Care & Pet Food": { icon: "fa-solid fa-paw", color: "#CF5700" },
};

const createCustomIcon = (types) => {
  if (typeof window === "undefined" || !L) return null; // Guard for SSR

  const icons = types.map((type) => ({
    color: iconConfig[type]?.color || "#000",
    iconClass: iconConfig[type]?.icon.replace("fa-solid ", "") || "fa-circle",
  }));

  // Generate HTML for the marker with Font Awesome icons
  const iconHTML = icons
    .map(
      (icon) =>
        `<i class="fa ${icon.iconClass}" style="color: ${icon.color}; font-size: 18px; margin-right: 4px;"></i>`
    )
    .join("");

  return L.divIcon({
    html: `<div style="display: flex; align-items: center; justify-content: center;">
              ${iconHTML}
           </div>`,
    className: "custom-div-icon", // Optional CSS class for further styling
    iconSize: [30, 30], // Size of the marker
    iconAnchor: [15, 30], // Anchor point for positioning
  });
};

export default function MapPage() {
  const categories = [
    {
      label: "Essentials",
      icon: faMapPin,
      subcategories: [
        { label: "Food & Water", icon: faBurger },
        { label: "Clothing & Personal Items", icon: faTshirt },
        { label: "Hygiene & Sanitation", icon: faBath },
        { label: "Financial Support", icon: faMoneyBillWave },
      ],
    },
    {
      label: "Shelter & Support Services",
      icon: faMapPin,
      subcategories: [
        { label: "Shelters & Housing Assistance", icon: faHome },
        { label: "Transportation Assistance", icon: faCar },
        { label: "Legal Aid", icon: faGavel },
      ],
    },
    {
      label: "Medical & Health",
      icon: faMapPin,
      subcategories: [
        { label: "Medical Aid & First Aid", icon: faBriefcaseMedical },
        { label: "Mental Health Support", icon: faUsers },
      ],
    },
    {
      label: "Animal Support",
      icon: faMapPin,
      subcategories: [
        { label: "Animal Boarding", icon: faDog },
        { label: "Veterinary Care & Pet Food", icon: faPaw },
      ],
    },
  ];

  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [sidebar, setSidebar] = useState("resources"); // Active sidebar: resources, donations, volunteering

  const handleButtonClick = (type) => {
    setSidebar(type);
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
    if (selectedSubcategories.length === 0) return true; // Show all resources if no subcategories are selected

    return resource.types.some((type) => selectedSubcategories.includes(type));
  });

  const renderSidebar = () => {
    if (sidebar === "resources") {
      return (
        <aside className="w-full md:w-1/4 bg-white text-black p-6">
          <h3 className="text-2xl font-bold mb-4">Resource Options</h3>
          <ul className="space-y-4">
            {categories.map((category) => (
              <li key={category.label}>
                <div className="flex items-center gap-3 font-bold">
                  <FontAwesomeIcon icon={category.icon} />
                  {category.label}
                </div>
                <button
                  className="text-sm text-blue-300 hover:underline mt-1"
                  onClick={() =>
                    setSelectedSubcategories((prev) =>
                      prev.some((sub) =>
                        category.subcategories.map((sub) => sub.label).includes(sub)
                      )
                        ? prev.filter(
                            (sub) =>
                              !category.subcategories
                                .map((sub) => sub.label)
                                .includes(sub)
                          )
                        : [...prev, ...category.subcategories.map((sub) => sub.label)]
                    )
                  }
                >
                  Select All
                </button>
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
              </li>
            ))}
          </ul>
        </aside>
      );
    } else if (sidebar === "donations") {
      return (
        <aside className="w-full md:w-1/4 bg-white text-black p-6">
          <h3 className="text-2xl font-bold mb-4">Donation Options</h3>
          {/* Add donation options */}
        </aside>
      );
    } else if (sidebar === "volunteering") {
      return (
        <aside className="w-full md:w-1/4 bg-white text-black p-6">
          <h3 className="text-2xl font-bold mb-4">Volunteer Options</h3>
          {/* Add volunteering options */}
        </aside>
      );
    }
  };

  return (
    <div className="relative">
      <Head>
        <title>LA Relief - Map of Resources</title>
      </Head>

      <section id="map" className="relative bg-green-900 text-white">
        {/* Top Buttons */}
        <div className="flex justify-between items-center p-4 bg-gray-100">
          <input
            type="text"
            placeholder="Search or use my current location"
            className="p-2 border rounded-md w-full max-w-md"
          />
          <div className="flex gap-4">
            <button
              className="p-2 bg-green-500 text-white rounded-md"
              onClick={() => handleButtonClick("resources")}
            >
              <FontAwesomeIcon icon={faClock} /> Open Now
            </button>
            <button
              className="p-2 bg-blue-500 text-white rounded-md"
              onClick={() => handleButtonClick("donations")}
            >
              <FontAwesomeIcon icon={faDollarSign} /> Donations Needed
            </button>
            <button
              className="p-2 bg-red-500 text-white rounded-md"
              onClick={() => handleButtonClick("volunteering")}
            >
              <FontAwesomeIcon icon={faHandsHelping} /> Volunteer Opportunities
            </button>
            <button className="p-2 bg-orange-500 text-white rounded-md">
              <FontAwesomeIcon icon={faFire} /> Wildfire Warning
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          {renderSidebar()}

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
