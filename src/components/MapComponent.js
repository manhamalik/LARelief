// components/MapComponent.js
import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ZoomControl } from "react-leaflet";
import {
  faTshirt,
  faMoneyBillWave,
  faHome,
  faCarSide,
  faGavel,
  faBriefcaseMedical,
  faPeopleGroup,
  faDog,
  faPaw,
  faBoxOpen,
  faBowlFood,
  faSpinner,
  faCheck,
  faTimes,
  faBurger,
  faBath,
  faSearch,
  faClock,
  faCircleDollarToSlot,
  faHandHoldingHeart,
  faMapPin,
} from "@fortawesome/free-solid-svg-icons";

import "leaflet/dist/leaflet.css";

// Dynamically import Leaflet components (necessary for Next.js SSR)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Polygon = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polygon),
  { ssr: false }
);
const ClusteredMarkers = dynamic(
  () => import("@/components/ClusteredMarkers"),
  { ssr: false }
);

// -------------------------------------
// CONFIG
// -------------------------------------
const iconConfig = {
  "Food & Water": { icon: "fa-solid fa-burger", color: "#015BC3" },
  "Clothing & Personal Items": { icon: "fa-solid fa-tshirt", color: "#015BC3" },
  "Hygiene & Sanitation": { icon: "fa-solid fa-bath", color: "#015BC3" },
  "Financial Support": { icon: "fa-solid fa-money-bill-wave", color: "#015BC3" },
  "Shelters & Housing Assistance": { icon: "fa-solid fa-home", color: "#4D03CD" },
  "Transportation Assistance": { icon: "fa-solid fa-car-side", color: "#4D03CD" },
  "Legal Aid": { icon: "fa-solid fa-gavel", color: "#4D03CD" },
  "Medical Aid & First Aid": { icon: "fa-solid fa-briefcase-medical", color: "#CC0000" },
  "Mental Health Support": { icon: "fa-solid fa-people-group", color: "#CC0000" },
  "Animal Boarding": { icon: "fa-solid fa-dog", color: "#DB5D02" },
  "Veterinary Care & Pet Food": { icon: "fa-solid fa-paw", color: "#DB5D02" },
  "Clothing & Bedding": { icon: "fa-solid fa-tshirt", color: "#015BC3" },
  "Hygiene & Sanitation Supplies": { icon: "fa-solid fa-bath", color: "#015BC3" },
  "Emergency Supplies": { icon: "fa-solid fa-home", color: "#4D03CD" },
  "Medical Supplies": { icon: "fa-solid fa-briefcase-medical", color: "#CC0000" },
  "Pet Supplies": { icon: "fa-solid fa-dog", color: "#DB5D02" },
  "Monetary Donations (Essentials)": { icon: "fa-solid fa-money-bill-wave", color: "#015BC3" },
  "Monetary Donations (Shelter & Support Services)": {
    icon: "fa-solid fa-money-bill-wave",
    color: "#4D03CD",
  },
  "Monetary Donations (Medical & Health)": {
    icon: "fa-solid fa-money-bill-wave",
    color: "#CC0000",
  },
  "Monetary Donations (Animal Support)": {
    icon: "fa-solid fa-money-bill-wave",
    color: "#DB5D02",
  },
  "Food & Water Distribution": { icon: "fa-solid fa-burger", color: "#015BC3" },
  "Clothing & Supplies Distribution": { icon: "fa-solid fa-tshirt", color: "#015BC3" },
  "Donation Sorting & Packing": { icon: "fa-solid fa-box-open", color: "#015BC3" },
  "Shelter Assistance": { icon: "fa-solid fa-home", color: "#4D03CD" },
  "Transportation & Delivery Support": { icon: "fa-solid fa-car-side", color: "#4D03CD" },
  "Medical Aid Support": { icon: "fa-solid fa-briefcase-medical", color: "#CC0000" },
  "Animal Shelter Assistance": { icon: "fa-solid fa-dog", color: "#DB5D02" },
  "Animal Rescue & Transport": { icon: "fa-solid fa-paw", color: "#DB5D02" },
  "Pet Supply Distribution": { icon: "fa-solid fa-bowl-food", color: "#DB5D02" },
};

// -------------------------------------
// TIME UTILS
// -------------------------------------
function convertTo24Hour(timeStr) {
  if (!timeStr) return null;
  const [time, ampm] = timeStr.split(" ");
  let [hour, minute] = time.split(":");
  hour = parseInt(hour, 10);
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

function isLocationOpen(location) {
  const now = new Date();
  const startDate = location.start_date ? new Date(location.start_date) : new Date(0);
  const endDate = location.end_date ? new Date(location.end_date) : new Date(9999, 11, 31);
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startMidnight = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const endMidnight = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  if (todayMidnight < startMidnight) return false;
  if (todayMidnight > endMidnight) return false;
  const dayOfWeek = now.toLocaleString("en-US", { weekday: "long" });
  const todayHours = location.hours_of_operation?.[dayOfWeek];
  if (!todayHours) return false;
  const [startTime, endTime] = todayHours.split(" - ");
  if (!startTime || !endTime) return false;
  const currentTime24 = convertTo24Hour(
    now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
  );
  const startTime24 = convertTo24Hour(startTime);
  const endTime24 = convertTo24Hour(endTime);
  return currentTime24 >= startTime24 && currentTime24 <= endTime24;
}

// -------------------------------------
// MAIN COMPONENT
// -------------------------------------
export default function MapComponent() {
  // STATE
  const [resourcesData, setResourcesData] = useState([]);
  const [donationsData, setDonationsData] = useState([]);
  const [volunteeringData, setVolunteeringData] = useState([]);
  const [sidebar, setSidebar] = useState("resources");
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [openNow, setOpenNow] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [wildfireActive, setWildfireActive] = useState(false);
  const [wildfires, setWildfires] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [airQualityActive, setAirQualityActive] = useState(false);
  const [airQualityData, setAirQualityData] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [legendExpanded, setLegendExpanded] = useState(false);
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);
  const [fireIcon, setFireIcon] = useState(null);
  const [customCreateIcon, setCustomCreateIcon] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  // Define AQI levels with labels, colors, and detailed descriptions
  const aqiLevels = [
    { level: 1, label: "Good", color: "#00e400", description: "Air quality is great. Enjoy outdoor activities!" },
    { level: 2, label: "Fair", color: "#ffeb3b", description: "Air is mostly okay, but very sensitive individuals should limit prolonged outdoor exposure." },
    { level: 3, label: "Moderate", color: "#ff7e00", description: "Some pollutants may affect sensitive groups (children, elderly, respiratory conditions). Consider reducing outdoor activities." },
    { level: 4, label: "Unhealthy", color: "#ff0000", description: "Unhealthy for sensitive groups. Those with heart/lung conditions should stay indoors." },
    { level: 5, label: "Hazardous", color: "#8f3f97", description: "Dangerous air quality. Everyone should limit outdoor exposure; wear a mask if necessary." },
  ];

  // Helper function to return AQI category and description
  const getAQICategory = (aqi) => {
    if (aqi === -1) {
      return {
        category: "No data",
        description: "Air quality data is unavailable.",
      };
    }
    switch (aqi) {
      case 1:
        return {
          category: "Good",
          description: "Air quality is great. Enjoy outdoor activities!",
        };
      case 2:
        return {
          category: "Fair",
          description: "Air is mostly okay, but very sensitive individuals should limit prolonged outdoor exposure.",
        };
      case 3:
        return {
          category: "Moderate",
          description: "Some pollutants may affect sensitive groups (children, elderly, respiratory conditions). Consider reducing outdoor activities.",
        };
      case 4:
        return {
          category: "Unhealthy",
          description: "Unhealthy for sensitive groups. Those with heart/lung conditions should stay indoors.",
        };
      case 5:
        return {
          category: "Hazardous",
          description: "Dangerous air quality. Everyone should limit outdoor exposure; wear a mask if necessary.",
        };
      default:
        return {
          category: "Unknown",
          description: "Air quality information is unavailable.",
        };
    }
  };

  // Data loads
  useEffect(() => {
    fetch("/api/resource-list")
      .then((res) => res.json())
      .then(setResourcesData)
      .catch((error) => console.error("Error fetching resources:", error));
  }, []);

  useEffect(() => {
    fetch("/api/donate-list")
      .then((res) => res.json())
      .then((data) => {
        const normalized = data.map((item) => ({
          ...item,
          name: item.organization_name || item.name,
        }));
        setDonationsData(normalized);
      })
      .catch((error) => console.error("Error fetching donations:", error));
  }, []);

  useEffect(() => {
    fetch("/api/volunteer-list")
      .then((res) => res.json())
      .then(setVolunteeringData)
      .catch((error) => console.error("Error fetching volunteering:", error));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const L = require("leaflet");
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
      });
      const fire = L.icon({
        iconUrl: "/images/fire.png",
        iconSize: [48, 48],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
      setFireIcon(fire);
      const createCustomIcon = (types) => {
        const iconsHTML = types
          .map((type) => {
            const cfg = iconConfig[type] || {};
            return `<i class="fa ${(cfg.icon || "fa-circle").replace("fa-solid ", "")}" style="color: ${cfg.color || "#000"}; font-size:18px; margin: 0 2px;"></i>`;
          })
          .join("");
        return L.divIcon({
          html: `<div style="display:flex; align-items:center; justify-content:center;">${iconsHTML}</div>`,
          className: "custom-div-icon",
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });
      };
      setCustomCreateIcon(() => createCustomIcon);
    }
  }, []);

  useEffect(() => {
    let data = [];
    if (sidebar === "resources") data = resourcesData;
    else if (sidebar === "donations") data = donationsData;
    else if (sidebar === "volunteering") data = volunteeringData;
    if (selectedSubcategories.length > 0) {
      data = data.filter((item) =>
        item.types?.some((type) => selectedSubcategories.includes(type))
      );
    }
    if (openNow) data = data.filter(isLocationOpen);
    setFilteredData(data);
  }, [sidebar, selectedSubcategories, openNow, resourcesData, donationsData, volunteeringData]);

  useEffect(() => {
    if (wildfireActive) {
      fetch(`${API_BASE_URL}/api/wildfires`)
        .then((res) => res.json())
        .then(setWildfires)
        .catch((err) => {
          console.error("Wildfire API Fetch Error:", err);
          setWildfires([]);
        });
    } else {
      setWildfires([]);
    }
  }, [wildfireActive]);

  useEffect(() => {
    if (airQualityActive) {
      fetch(`${API_BASE_URL}/api/airquality/neighborhoods`)
        .then((res) => res.json())
        .then(setAirQualityData)
        .catch((err) => {
          console.error("Air Quality API Fetch Error:", err);
          setAirQualityData([]);
        });
    } else {
      setAirQualityData([]);
    }
  }, [airQualityActive]);

  useEffect(() => {
    if (currentLocation && mapRef.current) {
      mapRef.current.setView([currentLocation.lat, currentLocation.lng], 15);
    }
  }, [currentLocation]);

  useEffect(() => {
    const handleClickOutside = (evt) => {
      if (searchInputRef.current && !searchInputRef.current.contains(evt.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleButtonClick = (type) => {
    if (type === "open_now") {
      setOpenNow((prev) => !prev);
      setCurrentLocation(null);
      setSelectedResource(null);
    } else if (type === "wildfire") {
      setWildfireActive((prev) => !prev);
    } else if (sidebar === type) {
      setSidebar("resources");
      setSelectedSubcategories([]);
      setOpenNow(false);
      setCurrentLocation(null);
      setSelectedResource(null);
    } else {
      setSidebar(type);
      setSelectedSubcategories([]);
      setOpenNow(false);
      setCurrentLocation(null);
      setSelectedResource(null);
    }
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((item) => item !== subcategory)
        : [...prev, subcategory]
    );
    setCurrentLocation(null);
    setSelectedResource(null);
  };

  const handleMarkerClick = (resource) => {
    setSelectedResource(resource);
    setCurrentLocation({
      lat: resource.latitude,
      lng: resource.longitude,
      address: resource.address,
      organization_name: resource.organization_name,
    });
  };

  const combinedData = [...resourcesData, ...donationsData, ...volunteeringData];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchError(null);
    setSearchResult(null);
    setShowSuggestions(false);
    const lowerQuery = searchQuery.toLowerCase();
    const matchedResource = combinedData.find(
      (item) =>
        (item.organization_name &&
          item.organization_name.toLowerCase().includes(lowerQuery)) ||
        (item.name && item.name.toLowerCase().includes(lowerQuery))
    );
    if (matchedResource) {
      setFilteredData([matchedResource]);
      setSelectedResource(matchedResource);
      setCurrentLocation({
        lat: matchedResource.latitude,
        lng: matchedResource.longitude,
        address: matchedResource.address,
      });
      setSearchResult(matchedResource);
    } else {
      setSearchError("No matching resource found.");
      setFilteredData([]);
      setSelectedResource(null);
      setCurrentLocation(null);
    }
    setIsSearching(false);
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (!query) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filteredSuggestions = combinedData
      .filter(
        (item) =>
          (item.organization_name &&
            item.organization_name.toLowerCase().includes(lowerQuery)) ||
          (item.name && item.name.toLowerCase().includes(lowerQuery))
      )
      .slice(0, 5);
    setSuggestions(filteredSuggestions);
    setShowSuggestions(filteredSuggestions.length > 0);
  };

  const handleSuggestionClick = (suggestion) => {
    const query = suggestion.organization_name || suggestion.name || "";
    setSearchQuery(query);
    setSuggestions([]);
    setShowSuggestions(false);
    handleSearch({ preventDefault: () => {} });
  };

  const categories = {
    resources: [
      {
        label: "Essentials",
        icon: faMapPin,
        color: "#015BC3",
        subcategories: [
          { label: "Food & Water", icon: faBurger, color: "#015BC3" },
          { label: "Clothing & Personal Items", icon: faTshirt, color: "#015BC3" },
          { label: "Hygiene & Sanitation", icon: faBath, color: "#015BC3" },
          { label: "Financial Support", icon: faMoneyBillWave, color: "#015BC3" },
        ],
      },
      {
        label: "Shelter & Support Services",
        icon: faMapPin,
        color: "#4D03CD",
        subcategories: [
          { label: "Shelters & Housing Assistance", icon: faHome, color: "#4D03CD" },
          { label: "Transportation Assistance", icon: faCarSide, color: "#4D03CD" },
          { label: "Legal Aid", icon: faGavel, color: "#4D03CD" },
        ],
      },
      {
        label: "Medical & Health",
        icon: faMapPin,
        color: "#CC0000",
        subcategories: [
          { label: "Medical Aid & First Aid", icon: faBriefcaseMedical, color: "#CC0000" },
          { label: "Mental Health Support", icon: faPeopleGroup, color: "#CC0000" },
        ],
      },
      {
        label: "Animal Support",
        icon: faMapPin,
        color: "#DB5D02",
        subcategories: [
          { label: "Animal Boarding", icon: faDog, color: "#DB5D02" },
          { label: "Veterinary Care & Pet Food", icon: faPaw, color: "#DB5D02" },
        ],
      },
    ],
    donations: [
      {
        label: "Essentials",
        icon: faMapPin,
        color: "#015BC3",
        subcategories: [
          { label: "Food & Water", icon: faBurger, color: "#015BC3" },
          { label: "Clothing & Bedding", icon: faTshirt, color: "#015BC3" },
          { label: "Hygiene & Sanitation Supplies", icon: faBath, color: "#015BC3" },
        ],
      },
      {
        label: "Shelter & Support Services",
        icon: faMapPin,
        color: "#4D03CD",
        subcategories: [{ label: "Emergency Supplies", icon: faHome, color: "#4D03CD" }],
      },
      {
        label: "Medical & Health",
        icon: faMapPin,
        color: "#CC0000",
        subcategories: [{ label: "Medical Supplies", icon: faBriefcaseMedical, color: "#CC0000" }],
      },
      {
        label: "Animal Support",
        icon: faMapPin,
        color: "#DB5D02",
        subcategories: [{ label: "Pet Supplies", icon: faDog, color: "#DB5D02" }],
      },
    ],
    volunteering: [
      {
        label: "Essentials",
        icon: faMapPin,
        color: "#015BC3",
        subcategories: [
          { label: "Food & Water Distribution", icon: faBurger, color: "#015BC3" },
          { label: "Clothing & Supplies Distribution", icon: faTshirt, color: "#015BC3" },
          { label: "Donation Sorting & Packing", icon: faBoxOpen, color: "#015BC3" },
        ],
      },
      {
        label: "Shelter & Support Services",
        icon: faMapPin,
        color: "#4D03CD",
        subcategories: [
          { label: "Shelter Assistance", icon: faHome, color: "#4D03CD" },
          { label: "Transportation & Delivery Support", icon: faCarSide, color: "#4D03CD" },
        ],
      },
      {
        label: "Medical & Health",
        icon: faMapPin,
        color: "#CC0000",
        subcategories: [
          { label: "Medical Aid Support", icon: faBriefcaseMedical, color: "#CC0000" },
          { label: "Mental Health Support", icon: faPeopleGroup, color: "#CC0000" },
        ],
      },
      {
        label: "Animal Support",
        icon: faMapPin,
        color: "#DB5D02",
        subcategories: [
          { label: "Animal Shelter Assistance", icon: faDog, color: "#DB5D02" },
          { label: "Animal Rescue & Transport", icon: faPaw, color: "#DB5D02" },
          { label: "Pet Supply Distribution", icon: faBowlFood, color: "#DB5D02" },
        ],
      },
    ],
  };

  const renderSidebar = () => {
    let sidebarHeading = "Resource Options";
    if (sidebar === "donations") sidebarHeading = "Donation Options";
    else if (sidebar === "volunteering") sidebarHeading = "Volunteer Options";
    return (
      <aside
        className="w-[23.75vw] bg-white p-6 shadow-xl flex-shrink-0 rounded-tr-[6vw] rounded-br-[6vw] m-3 min-h-screen"
        style={{ fontFamily: "'Noto Sans Multani', sans-serif", zIndex: 2000 }}
      >
        <div className="inline-block px-2 py-0 text-black bg-white border-2 border-black rounded-full text-[0.8vw] font-bold shadow-sm mb-1">
          {sidebarHeading}
        </div>
        {categories[sidebar]?.length > 0 ? (
          <ul className="space-y-4">
            {categories[sidebar].map((category) => {
              const parentColor = category.color;
              const subsInThisCat = category.subcategories.map((s) => s.label);
              if (sidebar === "donations") {
                subsInThisCat.push(`Monetary Donations (${category.label})`);
              }
              const currentlySelected = subsInThisCat.every((sub) =>
                selectedSubcategories.includes(sub)
              );
              return (
                <li key={category.label}>
                  <div className="flex items-center gap-3 font-bold text-[1.2vw]">
                    <FontAwesomeIcon icon={category.icon} style={{ color: category.color }} />
                    {category.label}
                  </div>
                  <button
                    className="inline-block px-2 py-[0.2vw] text-white bg-black rounded-full text-[0.75vw] font-semibold shadow hover:bg-gray-800"
                    style={{ fontFamily: "'Noto Sans Multani', sans-serif" }}
                    onClick={() => {
                      if (currentlySelected) {
                        setSelectedSubcategories((prev) =>
                          prev.filter((s) => !subsInThisCat.includes(s))
                        );
                      } else {
                        setSelectedSubcategories((prev) => [
                          ...new Set([...prev, ...subsInThisCat]),
                        ]);
                      }
                    }}
                  >
                    {currentlySelected ? "Deselect All" : "Select All"}
                  </button>
                  <ul className="pl-6 mt-2 space-y-2">
                    {category.subcategories.map((subcategory) => (
                      <li
                        key={subcategory.label}
                        className={`cursor-pointer flex items-center gap-3 ${
                          selectedSubcategories.includes(subcategory.label) ? "font-bold" : ""
                        }`}
                        style={{
                          fontFamily: "'Noto Sans Multani', sans-serif",
                          color: selectedSubcategories.includes(subcategory.label)
                            ? parentColor
                            : undefined,
                        }}
                        onClick={() => handleSubcategoryClick(subcategory.label)}
                      >
                        <FontAwesomeIcon icon={subcategory.icon} style={{ color: subcategory.color }} />
                        {subcategory.label}
                      </li>
                    ))}
                    {sidebar === "donations" && (
                      <li
                        key={`Monetary Donations (${category.label})`}
                        className={`cursor-pointer flex items-center gap-3 ${
                          selectedSubcategories.includes(`Monetary Donations (${category.label})`)
                            ? "font-bold"
                            : ""
                        }`}
                        style={{
                          fontFamily: "'Noto Sans Multani', sans-serif",
                          color: selectedSubcategories.includes(
                            `Monetary Donations (${category.label})`
                          )
                            ? parentColor
                            : undefined,
                        }}
                        onClick={() => handleSubcategoryClick(`Monetary Donations (${category.label})`)}
                      >
                        <FontAwesomeIcon
                          icon={faMoneyBillWave}
                          style={{
                            color:
                              iconConfig[`Monetary Donations (${category.label})`]?.color || parentColor,
                          }}
                        />
                        <span>Monetary Donations</span>
                      </li>
                    )}
                  </ul>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No options available.</p>
        )}
      </aside>
    );
  };

  return (
    <div>
      <div className="relative w-full">
        <MapContainer
          center={[34.0522, -118.2437]}
          zoom={11}
          scrollWheelZoom={false}
          zoomControl={false}
          className="w-full min-h-screen z-0"
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          <ZoomControl position="topright" />
          {customCreateIcon && (
            <ClusteredMarkers
              resources={filteredData}
              createCustomIcon={customCreateIcon}
              handleMarkerClick={handleMarkerClick}
            />
          )}
          {fireIcon &&
            wildfireActive &&
            wildfires
              .filter((incident) => incident.Name && incident.Name.toLowerCase().includes("fire"))
              .map((incident) => {
                const { UniqueId, Latitude, Longitude, Name, Started, Updated, County, Location, AcresBurned, PercentContained } = incident;
                if (!Latitude || !Longitude) return null;
                return (
                  <Marker key={UniqueId} position={[Latitude, Longitude]} icon={fireIcon}>
                    <Popup>
                      <div>
                        <h3 style={{ marginTop: 0 }}>{Name}</h3>
                        <p><strong>Start Date:</strong> {Started}</p>
                        <p><strong>Last Updated:</strong> {Updated}</p>
                        <p><strong>County:</strong> {County}</p>
                        <p><strong>Location:</strong> {Location}</p>
                        <p><strong>Acres Burned:</strong> {AcresBurned}</p>
                        <p><strong>Percent Contained:</strong> {PercentContained}</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
  {airQualityActive &&
  airQualityData.map((feature, index) => {
    if (!feature.geometry) return null;
    let fillColor = "#000000";
    switch (feature.aqi) {
      case 1:
        fillColor = "#00e400";
        break;
      case 2:
        fillColor = "#ffeb3b";
        break;
      case 3:
        fillColor = "#ff7e00";
        break;
      case 4:
        fillColor = "#ff0000";
        break;
      case 5:
        fillColor = "#8f3f97";
        break;
      default:
        fillColor = "#000000";
    }
    const toLatLngs = (ring) => ring.map(([lng, lat]) => [lat, lng]);

    // Updated popup content rendering:
    const renderPopupContent = () => {
      if (feature.aqi === -1) return "No data";
      const { category, description } = getAQICategory(feature.aqi);
      return (
        <div
          className="text-center"
          style={{
            fontFamily: "'Noto Sans Multani', sans-serif",
            width: "275px",
            margin: "0 auto",
          }}
        >
          <div className="flex justify-center items-center">
            <span
              className="inline-block w-3 h-3 flex-none rounded-full mr-1"
              style={{ backgroundColor: fillColor }}
            ></span>
            <span>{`${category} (AQI: ${feature.aqi})`}</span>
          </div>
          <div className="mt-1">
            <em className="text-xs">{description}</em>
          </div>
        </div>
      );
    };

          // Render the aqi popup
          const popupContent = (
            <div
              className="text-center"
              style={{ fontFamily: "'Noto Sans Multani', sans-serif", maxWidth: "275px", margin: "0 auto" }}
            >
              <strong>{feature.name}</strong>
              <br />
              {renderPopupContent()}
            </div>
          );

          if (feature.geometry.type === "Polygon") {
            const rings = feature.geometry.coordinates;
            return (
              <Polygon
                key={index}
                positions={rings.map((ring) => toLatLngs(ring))}
                pathOptions={{ color: fillColor, fillColor, fillOpacity: 0.4 }}
              >
                <Popup>{popupContent}</Popup>
              </Polygon>
            );
          } else if (feature.geometry.type === "MultiPolygon") {
            const multi = feature.geometry.coordinates;
            return multi.map((poly, idx2) => (
              <Polygon
                key={`${index}-${idx2}`}
                positions={poly.map((ring) => toLatLngs(ring))}
                pathOptions={{ color: fillColor, fillColor, fillOpacity: 0.4 }}
              >
                <Popup>{popupContent}</Popup>
              </Polygon>
            ));
          }
          return null;
        })}

        </MapContainer>

        <div className="absolute z-[3000]" style={{ top: "-0.8vw", left: "-1vw" }}>
          {renderSidebar()}
        </div>

        <div
          className="absolute top-2 left-[59vw] transform -translate-x-1/2 z-[1000] flex items-center gap-2 p-3 w-[70vw] rounded-3xl"
          ref={searchInputRef}
          style={{ fontFamily: "'Noto Sans Multani', sans-serif" }}
        >
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search for organization"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              className="w-62 border border-gray-300 py-[0.4vw] pl-3 pr-10 focus:outline-none rounded-[20vw] shadow-lg placeholder-gray-500 text-[1vw]"
              style={{ fontFamily: "'Noto Sans Multani', sans-serif" }}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#70757A] text-[1.2vw]"
              style={{ fontFamily: "'Noto Sans Multani', sans-serif" }}
            >
              {isSearching ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : searchResult ? (
                <FontAwesomeIcon icon={faCheck} />
              ) : searchError ? (
                <FontAwesomeIcon icon={faTimes} />
              ) : (
                <FontAwesomeIcon icon={faSearch} />
              )}
            </button>
            {showSuggestions && (
              <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md">
                {suggestions.map((item, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-sm"
                    style={{ fontFamily: "'Noto Sans Multani', sans-serif" }}
                    onClick={() => handleSuggestionClick(item)}
                  >
                    {item.organization_name || item.name}
                  </li>
                ))}
              </ul>
            )}
          </form>

          <button
            className={`flex items-center px-4 py-[0.5vw] text-[0.9vw] rounded-[10vw] font-semibold whitespace-nowrap ${
              openNow ? "bg-[#027B00] text-white" : "bg-[#FFFFFF] text-black"
            }`}
            style={{ fontFamily: "'Noto Sans Multani', sans-serif" }}
            onClick={() => handleButtonClick("open_now")}
          >
            <FontAwesomeIcon
              icon={faClock}
              className="mr-2 text-lg"
              style={{ color: openNow ? "#FFFFFF" : "#027B00" }}
            />
            <span className="inline-block align-middle">Open Now</span>
          </button>

          <button
            className={`flex items-center px-4 py-[0.5vw] text-[0.9vw] rounded-[10vw] font-semibold whitespace-nowrap ${
              sidebar === "donations" ? "bg-[#2B9FD0] text-white" : "bg-[#FFFFFF] text-black"
            }`}
            style={{ fontFamily: "'Noto Sans Multani', sans-serif" }}
            onClick={() => handleButtonClick("donations")}
          >
            <FontAwesomeIcon
              icon={faCircleDollarToSlot}
              className="mr-2 text-lg"
              style={{ color: sidebar === "donations" ? "#FFFFFF" : "#2B9FD0" }}
            />
            <span className="inline-block align-middle">Donations Needed</span>
          </button>

          <button
            className={`flex items-center px-4 py-[0.5vw] text-[0.9vw] rounded-[10vw] font-semibold whitespace-nowrap ${
              sidebar === "volunteering" ? "bg-[#D55858] text-white" : "bg-[#FFFFFF] text-black"
            }`}
            style={{ fontFamily: "'Noto Sans Multani', sans-serif" }}
            onClick={() => handleButtonClick("volunteering")}
          >
            <FontAwesomeIcon
              icon={faHandHoldingHeart}
              className="mr-2 text-lg"
              style={{ color: sidebar === "volunteering" ? "#FFFFFF" : "#D55858" }}
            />
            <span className="inline-block align-middle">Volunteer Opportunities</span>
          </button>

          <button
            className={`flex items-center px-2 py-[0.5vw] text-[0.9vw] rounded-[10vw] font-semibold whitespace-nowrap min-w-[10.65vw] ${
              wildfireActive ? "bg-orange-500 text-black" : "bg-[#982525] text-white"
            }`}
            style={{ fontFamily: "'Noto Sans Multani', sans-serif" }}
            onClick={() => handleButtonClick("wildfire")}
          >
            <img
              src="/images/fire.png"
              alt="Wildfire"
              className="w-6 h-6 inline-block mr-2"
              style={{
                filter: wildfireActive
                  ? "brightness(0) saturate(100%) hue-rotate(25deg) contrast(150%)"
                  : "none",
              }}
            />
            <span className="inline-block align-middle">Wildfire Warning</span>
          </button>

          <button
            className={`flex items-center px-4 py-[0.5vw] text-[0.9vw] rounded-[10vw] font-semibold whitespace-nowrap min-w-[8.75vw] ${
              airQualityActive ? "bg-[#8cc1ffff] text-black" : "bg-[#154985ff] text-white"
            }`}
            style={{ fontFamily: "'Noto Sans Multani', sans-serif" }}
            onClick={() => setAirQualityActive((prev) => !prev)}
            title="Air Quality: Green=Good, Yellow=Fair, Orange=Moderate, Red=Unhealthy, Purple=Hazardous"
          >
            <img
              src="/images/air.png"
              alt="Air Quality"
              className="w-6 h-6 inline-block mr-2"
            />
            <span className="inline-block align-middle">Air Quality</span>
          </button>
        </div>

        {/* AQI Legend */}
        {airQualityActive && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[9999] bg-white px-4 py-2 rounded shadow-md w-[28vw]">
            {/* Centered Title (bolded) */}
            <div className="text-center text-base font-bold mb-2">Air Quality</div>

            {/* Centered categories row */}
            <div className="relative flex justify-evenly items-center">
              {/* Grey line spanning the container */}
              <div className="absolute top-1.5 left-1 w-[25vw] h-0.5 bg-gray-300 -z-10"></div>
              {aqiLevels.map((level) => (
                <div key={level.level} className="flex flex-col items-center">
                  <div className="w-3 h-3 flex-none rounded-full mb-1" style={{ backgroundColor: level.color }}></div>
                  <span className="text-xs text-center">{level.label}</span>
                </div>
              ))}
            </div>

            {/* "Air Quality Index • Learn More" below the line, left aligned */}
            <div className="mt-2 text-left text-xs">
              Air Quality Index •{" "}
              <button
                onClick={() => setLegendExpanded(!legendExpanded)}
                className="text-blue-500 underline"
              >
                {legendExpanded ? "Show less" : "Learn More"}
              </button>
            </div>

            {/* Expanded detailed view */}
            {legendExpanded && (
              <div className="mt-2 space-y-1">
                {aqiLevels.map((level) => (
                  <div key={level.level} className="flex items-center gap-2">
                    <div className="w-3 h-3 flex-none rounded-full" style={{ backgroundColor: level.color }}></div>
                    <span className="text-xs">
                      <strong>{level.label}:</strong> {level.description}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
