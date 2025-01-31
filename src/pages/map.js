import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ResourceCard from "@/components/ResourceCard";
import DonationCard from "@/components/DonationCard";
import VolunteerCard from "@/components/VolunteerCard";

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
  faDollarSign,
  faHandsHelping,
  faFire,
  faMapPin,
} from "@fortawesome/free-solid-svg-icons";

// import resources from "@/data/resources";
// import donations from "@/data/donations";
// import volunteering from "@/data/volunteering";

// Dynamically import Leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const ClusteredMarkers = dynamic(() => import("@/components/ClusteredMarkers"), {
  ssr: false,
});

// Leaflet CSS
import "leaflet/dist/leaflet.css";

// Icon config for each subcategory
const iconConfig = {
  "Food & Water": { icon: "fa-solid fa-burger", color: "#015BC3" },
  "Clothing & Personal Items": { icon: "fa-solid fa-tshirt", color: "#015BC3" },
  "Hygiene & Sanitation": { icon: "fa-solid fa-bath ", color: "#015BC3" },
  "Financial Support": { icon: "fa-solid fa-money-bill-wave", color: "#015BC3" },
  "Shelters & Housing Assistance": { icon: "fa-solid fa-home", color: "#4D03CD" },
  "Transportation Assistance": { icon: "fa-solid fa-car-side", color: "#4D03CD" },
  "Legal Aid": { icon: "fa-solid fa-gavel", color: "#4D03CD" },
  "Medical Aid & First Aid": { icon: "fa-solid fa-briefcase-medical", color: "#CC0000" },
  "Mental Health Support": { icon: "fa-solid fa-people-group", color: "#CC0000" },
  "Animal Boarding": { icon: "fa-solid fa-dog", color: "#DB5D02" },
  "Veterinary Care & Pet Food": { icon: "fa-solid fa-paw", color: "#DB5D02" },
  "Clothing & Bedding": { icon: "fa-solid fa-tshirt", color: "#015BC3" },
  "Hygiene & Sanitation Supplies": { icon: "fa-solid fa-bath ", color: "#015BC3" },
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

// Utility for converting 12-hour to 24-hour time
function convertTo24Hour(timeStr) {
  if (!timeStr) return null;
  const [time, ampm] = timeStr.split(" ");
  let [hour, minute] = time.split(":");
  hour = parseInt(hour, 10);
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

// Checks if a location is currently “open”
function isLocationOpen(location) {
  const now = new Date();

  // A) Date range check
  let startDate = location.start_date ? new Date(location.start_date) : new Date(0);
  let endDate = location.end_date ? new Date(location.end_date) : new Date(9999, 11, 31);

  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startMidnight = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const endMidnight = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  if (todayMidnight < startMidnight) return false;
  if (todayMidnight > endMidnight) return false;

  // B) Hours-of-operation for today's day-of-week
  const dayOfWeek = now.toLocaleString("en-US", { weekday: "long" });
  const todayHours = location.hours_of_operation?.[dayOfWeek];
  if (!todayHours) return false;

  const [startTime, endTime] = todayHours.split(" - ");
  if (!startTime || !endTime) return false;

  // Convert times
  const currentTime12h = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const currentTime24 = convertTo24Hour(currentTime12h);
  const startTime24 = convertTo24Hour(startTime);
  const endTime24 = convertTo24Hour(endTime);

  return currentTime24 >= startTime24 && currentTime24 <= endTime24;
}

export default function MapPage() {
  // -------------- STATE --------------
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
  const searchInputRef = useRef(null);

  const mapRef = useRef(null);
  const [fireIcon, setFireIcon] = useState(null);
  const [customCreateIcon, setCustomCreateIcon] = useState(null);

  // Master data
  const dataSources = {
    resources: resourcesData,
    donations: donationsData,
    volunteering: volunteeringData
  };
  
  const combinedData = [...resourcesData, ...donationsData, ...volunteeringData];

  // Track which location to center on
  const [currentLocation, setCurrentLocation] = useState(null);

  // -------------- EFFECTS --------------

  // Fetch Resources
useEffect(() => {
  const fetchResources = async () => {
    try {
      const res = await fetch("/api/resource-list");
      const data = await res.json();
      setResourcesData(data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };
  fetchResources();
}, []);

// Fetch Donations
useEffect(() => {
  const fetchDonations = async () => {
    try {
      const res = await fetch("/api/donate-list");
      const data = await res.json();

      // Normalize data
      const normalizedData = data.map((item) => ({
        ...item,
        name: item.organization_name || item.name, // Add a fallback for `name`
      }));

      setDonationsData(normalizedData);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };
  fetchDonations();
}, []);



// Fetch Volunteer
useEffect(() => {
  const fetchVolunteering = async () => {
    try {
      const res = await fetch("/api/volunteer-list");
      const data = await res.json();
      setVolunteeringData(data);
    } catch (error) {
      console.error("Error fetching volunteering:", error);
    }
  };
  fetchVolunteering();
}, []);


  // 1. Load Leaflet + custom icons
  useEffect(() => {
    if (typeof window !== "undefined") {
      const L = require("leaflet");

      // Fix marker paths in Next.js
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
      });

      // Fire icon
      const fire = L.icon({
        iconUrl: "/images/fire.png",
        iconSize: [48, 48],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
      setFireIcon(fire);

      // Create multi-icon function
      const createCustomIcon = (types) => {
        const iconsHTML = types
          .map((type) => {
            const cfg = iconConfig[type] || {};
            return `<i class="fa ${
              (cfg.icon || "fa-circle").replace("fa-solid ", "")
            }" style="color: ${cfg.color || "#000"}; font-size:18px;"></i>`;
          })
          .join("");
        return L.divIcon({
          html: `<div style="display:flex;align-items:center;justify-content:center;">${iconsHTML}</div>`,
          className: "custom-div-icon",
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });
      };
      setCustomCreateIcon(() => createCustomIcon);
    }
  }, []);

  // 2. Filter data based on sidebar, subcategories, openNow
  useEffect(() => {
    let data = [];
    if (sidebar === "resources") {
      data = resourcesData;
    } else if (sidebar === "donations") {
      data = donationsData;
    } else if (sidebar === "volunteering") {
      data = volunteeringData;
    }
  
    // Filter by subcategory
    if (selectedSubcategories.length > 0) {
      data = data.filter((item) =>
        item.types?.some((type) => selectedSubcategories.includes(type))
      );
    }
  
    // Filter by "Open Now"
    if (openNow) {
      data = data.filter(isLocationOpen);
    }
  
    setFilteredData(data);
  }, [
    sidebar,
    selectedSubcategories,
    openNow,
    resourcesData,
    donationsData,
    volunteeringData,
  ]);
  

  // 3. Fetch wildfires if active
  useEffect(() => {
    if (wildfireActive) {
      const fetchWildfires = async () => {
        try {
          const response = await fetch("/api/wildfires");
          const data = await response.json();
          setWildfires(data);
        } catch (err) {
          console.error("Failed to fetch wildfire data:", err);
          setWildfires([]);
        }
      };
      fetchWildfires();
    } else {
      setWildfires([]);
    }
  }, [wildfireActive]);

  // 4. Re-center the map if currentLocation changes
  useEffect(() => {
    if (currentLocation && mapRef.current) {
      mapRef.current.setView([currentLocation.lat, currentLocation.lng], 15);
    }
  }, [currentLocation]);

  // 5. Close suggestions if clicking outside
  useEffect(() => {
    const handleClickOutside = (evt) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(evt.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -------------- HANDLERS --------------

  // Toggle the main top-level sidebar category
  const handleButtonClick = (type) => {
    if (type === "open_now") {
      setOpenNow((prev) => !prev);
      setCurrentLocation(null);
      setSelectedResource(null);
    } else if (type === "wildfire") {
      setWildfireActive((prev) => !prev);
    } else if (sidebar === type) {
      // If user clicks same button again, revert to “resources”
      setSidebar("resources");
      setSelectedSubcategories([]);
      setOpenNow(false);
      setCurrentLocation(null);
      setSelectedResource(null);
    } else {
      // Switch to new “sidebar”
      setSidebar(type);
      setSelectedSubcategories([]);
      setOpenNow(false);
      setCurrentLocation(null);
      setSelectedResource(null);
    }
  };

  // Toggle a subcategory
  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((item) => item !== subcategory)
        : [...prev, subcategory]
    );
    setCurrentLocation(null);
    setSelectedResource(null);
  };

  // When a marker is clicked
  const handleMarkerClick = (resource) => {
    setSelectedResource(resource);
    setCurrentLocation({
      lat: resource.latitude,
      lng: resource.longitude,
      address: resource.address,
      organization_name: resource.organization_name,
    });
  };
  
  // Handle search submission
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

  // Handle typing in the search input
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

  // User clicks an autocomplete suggestion
  const handleSuggestionClick = (suggestion) => {
    const query = suggestion.organization_name || suggestion.name || "";
    setSearchQuery(query);
    setSuggestions([]);
    setShowSuggestions(false);
    // Immediately run the search
    handleSearch({ preventDefault: () => {} });
  };

  // -------------- CATEGORY DEFINITIONS --------------
  const categories = {
    resources: [
      {
        label: "Essentials",
        icon: faMapPin,
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
        subcategories: [
          { label: "Shelters & Housing Assistance", icon: faHome, color: "#4D03CD" },
          { label: "Transportation Assistance", icon: faCarSide, color: "#4D03CD" },
          { label: "Legal Aid", icon: faGavel, color: "#4D03CD" },
        ],
      },
      {
        label: "Medical & Health",
        icon: faMapPin,
        subcategories: [
          { label: "Medical Aid & First Aid", icon: faBriefcaseMedical, color: "#CC0000" },
          { label: "Mental Health Support", icon: faPeopleGroup, color: "#CC0000" },
        ],
      },
      {
        label: "Animal Support",
        icon: faMapPin,
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
        subcategories: [
          { label: "Food & Water", icon: faBurger, color: "#015BC3" },
          { label: "Clothing & Bedding", icon: faTshirt, color: "#015BC3" },
          { label: "Hygiene & Sanitation Supplies", icon: faBath, color: "#015BC3" },
        ],
      },
      {
        label: "Shelter & Support Services",
        icon: faMapPin,
        subcategories: [
          { label: "Emergency Supplies", icon: faHome, color: "#4D03CD" },
        ],
      },
      {
        label: "Medical & Health",
        icon: faMapPin,
        subcategories: [
          { label: "Medical Supplies", icon: faBriefcaseMedical, color: "#CC0000" },
        ],
      },
      {
        label: "Animal Support",
        icon: faMapPin,
        subcategories: [
          { label: "Pet Supplies", icon: faDog, color: "#DB5D02" },
        ],
      },
    ],
    volunteering: [
      {
        label: "Essentials",
        icon: faMapPin,
        subcategories: [
          { label: "Food & Water Distribution", icon: faBurger, color: "#015BC3" },
          { label: "Clothing & Supplies Distribution", icon: faTshirt, color: "#015BC3" },
          { label: "Donation Sorting & Packing", icon: faBoxOpen, color: "#015BC3" },
        ],
      },
      {
        label: "Shelter & Support Services",
        icon: faMapPin,
        subcategories: [
          { label: "Shelter Assistance", icon: faHome, color: "#4D03CD" },
          { label: "Transportation & Delivery Support", icon: faCarSide, color: "#4D03CD" },
        ],
      },
      {
        label: "Medical & Health",
        icon: faMapPin,
        subcategories: [
          { label: "Medical Aid Support", icon: faBriefcaseMedical, color: "#CC0000" },
          { label: "Mental Health Support", icon: faPeopleGroup, color: "#CC0000" },
        ],
      },
      {
        label: "Animal Support",
        icon: faMapPin,
        subcategories: [
          { label: "Animal Shelter Assistance", icon: faDog, color: "#DB5D02" },
          { label: "Animal Rescue & Transport", icon: faPaw, color: "#DB5D02" },
          { label: "Pet Supply Distribution", icon: faBowlFood, color: "#DB5D02" },
        ],
      },
    ],
  };

  // -------------- RENDER SIDEBAR --------------
  const renderSidebar = () => {
    let sidebarHeading = "Resource Options";
    if (sidebar === "donations") sidebarHeading = "Donations Needed";
    else if (sidebar === "volunteering") sidebarHeading = "Volunteer Opportunities";

    return (
      <aside className="w-[320px] h-[calc(100vh-80px)] overflow-y-auto bg-white p-6 shadow-xl flex-shrink-0 rounded-tr-2xl rounded-br-2xl">
        <h3 className="text-2xl font-bold mb-4">{sidebarHeading}</h3>
        {categories[sidebar]?.length > 0 ? (
          <ul className="space-y-4">
            {categories[sidebar].map((category) => (
              <li key={category.label}>
                {/* Category label */}
                <div className="flex items-center gap-3 font-bold">
                  <FontAwesomeIcon icon={category.icon} />
                  {category.label}
                </div>
                {/* “Select All” button */}
                <button
                  className="text-sm text-blue-500 hover:underline mt-1"
                  onClick={() => {
                    const subsInThisCat = category.subcategories.map((s) => s.label);
                    // For “donations,” also add monetary donation subcategory
                    if (sidebar === "donations") {
                      subsInThisCat.push(`Monetary Donations (${category.label})`);
                    }
                    const currentlySelected = subsInThisCat.every((sub) =>
                      selectedSubcategories.includes(sub)
                    );
                    if (currentlySelected) {
                      // remove them all
                      setSelectedSubcategories((prev) =>
                        prev.filter((s) => !subsInThisCat.includes(s))
                      );
                    } else {
                      // add them all
                      setSelectedSubcategories((prev) => [
                        ...new Set([...prev, ...subsInThisCat]),
                      ]);
                    }
                  }}
                >
                  Select All
                </button>

                {/* Subcategory list */}
                <ul className="pl-6 mt-2 space-y-2">
                  {category.subcategories.map((subcategory) => (
                    <li
                      key={subcategory.label}
                      className={`cursor-pointer flex items-center gap-3 ${
                        selectedSubcategories.includes(subcategory.label)
                          ? "font-bold text-blue-700"
                          : ""
                      }`}
                      onClick={() => handleSubcategoryClick(subcategory.label)}
                    >
                      <FontAwesomeIcon
                        icon={subcategory.icon}
                        style={{ color: subcategory.color }}
                      />
                      {subcategory.label}
                    </li>
                  ))}

                  {/* For “donations,” also show “Monetary Donations” for each category */}
                  {sidebar === "donations" && (
                    <li
                      key={`Monetary Donations (${category.label})`}
                      className={`cursor-pointer flex items-center gap-3 ${
                        selectedSubcategories.includes(
                          `Monetary Donations (${category.label})`
                        )
                          ? "font-bold text-blue-700"
                          : ""
                      }`}
                      onClick={() =>
                        handleSubcategoryClick(`Monetary Donations (${category.label})`)
                      }
                    >
                      <FontAwesomeIcon
                        icon={faMoneyBillWave}
                        style={{
                          color: iconConfig[`Monetary Donations (${category.label})`]?.color,
                        }}
                      />
                      <span>Monetary Donations</span>
                    </li>
                  )}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p>No options available.</p>
        )}
      </aside>
    );
  };

  // -------------- MAIN RETURN --------------
  return (
    <div>
      <Head>
        <title>LA Relief - Map</title>
      </Head>

      {/* Main area: sidebar + map */}
      <div className="flex">
        {/* Left: Sidebar */}
        {renderSidebar()}

        {/* Right: Map area */}
        <div className="flex-grow h-[calc(100vh-80px)]">
          <MapContainer
            center={[34.0522, -118.2437]}
            zoom={11}
            scrollWheelZoom
            className="w-full h-full relative"
            whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {/* 
              1) Render your search + toggle buttons 
                 in an absolutely positioned container 
                 *inside* the MapContainer 
            */}
            <div
              className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] 
                         flex items-center gap-4 bg-white p-3 shadow-lg rounded"
              ref={searchInputRef}
            >
              {/* Search box */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search or use my current location"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  className="w-64 rounded-md border border-gray-300 py-1 pl-3 pr-10 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
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

                {/* Autocomplete suggestions */}
                {showSuggestions && (
                  <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md">
                    {suggestions.map((item, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-sm"
                        onClick={() => handleSuggestionClick(item)}
                      >
                        {item.organization_name || item.name}
                      </li>
                    ))}
                  </ul>
                )}
              </form>

              {/* The four toggle buttons */}
              <button
                className={`px-2 py-1 rounded ${
                  openNow ? "bg-green-700 text-white" : "bg-green-500 text-black"
                }`}
                onClick={() => handleButtonClick("open_now")}
              >
                <FontAwesomeIcon icon={faClock} className="mr-1" />
                Open Now
              </button>

              <button
                className={`px-2 py-1 rounded ${
                  sidebar === "donations"
                    ? "bg-blue-700 text-white"
                    : "bg-blue-500 text-black"
                }`}
                onClick={() => handleButtonClick("donations")}
              >
                <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
                Donations
              </button>

              <button
                className={`px-2 py-1 rounded ${
                  sidebar === "volunteering"
                    ? "bg-red-700 text-white"
                    : "bg-red-500 text-black"
                }`}
                onClick={() => handleButtonClick("volunteering")}
              >
                <FontAwesomeIcon icon={faHandsHelping} className="mr-1" />
                Volunteer
              </button>

              <button
                className={`px-2 py-1 rounded ${
                  wildfireActive ? "bg-orange-700 text-white" : "bg-orange-500 text-black"
                }`}
                onClick={() => handleButtonClick("wildfire")}
              >
                <FontAwesomeIcon icon={faFire} className="mr-1" />
                Wildfire
              </button>
            </div>
            {/* end of the absolute container for controls */}

            {/* Clustered resource markers */}
            {customCreateIcon && (
              <ClusteredMarkers
                resources={filteredData}
                createCustomIcon={customCreateIcon}
                handleMarkerClick={handleMarkerClick} 
              />
            )}

            {/* Wildfire markers */}
            {fireIcon &&
              wildfireActive &&
              wildfires.map((incident) => {
                const {
                  UniqueId,
                  Latitude,
                  Longitude,
                  Name,
                  Started,
                  Updated,
                  County,
                  Location,
                  AcresBurned,
                  PercentContained,
                } = incident;
                if (!Latitude || !Longitude) return null;

                return (
                  <Marker key={UniqueId} position={[Latitude, Longitude]} icon={fireIcon}>
                    <Popup>
                      <div>
                        <h3 style={{ marginTop: 0 }}>{Name}</h3>
                        <p>
                          <strong>Start Date:</strong> {Started}
                        </p>
                        <p>
                          <strong>Last Updated:</strong> {Updated}
                        </p>
                        <p>
                          <strong>County:</strong> {County}
                        </p>
                        <p>
                          <strong>Location:</strong> {Location}
                        </p>
                        <p>
                          <strong>Acres Burned:</strong> {AcresBurned}
                        </p>
                        <p>
                          <strong>Percent Contained:</strong> {PercentContained}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
          </MapContainer>

          {/* “Floating” popup for selected resource */}
          {selectedResource && (
  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50
                  bg-white text-black rounded-xl shadow-lg p-4 w-80">
    {sidebar === "resources" && (
      <ResourceCard resource={selectedResource} />
    )}
    {sidebar === "donations" && (
  <>
    {console.log("Selected Resource Passed to DonationCard:", selectedResource)}
    <DonationCard resource={selectedResource} />
  </>
)}

    {sidebar === "volunteering" && (
      <VolunteerCard resource={selectedResource} />
    )}
  </div>
)}

        </div>
      </div>
    </div>
  );
}
