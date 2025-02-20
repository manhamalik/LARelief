import React, {
  useState,
  useEffect,
  lazy,
  Suspense,
  startTransition,
  useRef,
} from "react";
import Image from "next/image";
import Head from "next/head";
import dynamic from "next/dynamic";
import ScrollArrow from "@/components/ScrollArrow";
import ResourceCard from "@/components/ResourceCard";
import Dropdown from "@/components/Dropdown";
import { Link } from "react-scroll";
import { scroller } from "react-scroll";
import { Link as ScrollLink } from "react-scroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  faMagnifyingGlass,
  faArrowDown,
  faCalendar,
  faCalendarAlt,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import "@fontsource/potta-one";
import CategoryButtons from "@/components/CategoryButtons";
import { filterResources } from "../components/filter";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/router";
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

const bethehope = "Be the hope".split(" "); // Spaces included

// --- NEW: Helper functions for sorting resources by operating status ---
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Given a time string (e.g. "9:00 AM") and a base date, returns a Date object.
const parseTime = (timeStr, baseDate) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// For a given resource, returns an object with a flag (isOpen) and a nextOpen timestamp.
// - For currently open resources, nextOpen is set to 0 so they sort before closed ones.
// - For closed resources, nextOpen is a timestamp (ms) indicating when the location will next open.
const getOperatingSortKey = (resource) => {
  const hoursOfOperation = resource.hours_of_operation;
  const now = new Date();
  const todayIndex = now.getDay();
  const todayName = daysOfWeek[todayIndex];
  const todaysHours =
    hoursOfOperation &&
    hoursOfOperation[todayName] &&
    hoursOfOperation[todayName].toLowerCase() !== "closed"
      ? hoursOfOperation[todayName]
      : null;

  if (todaysHours) {
    const [openStr, closeStr] = todaysHours.split(" - ");
    const openTime = parseTime(openStr, now);
    const closeTime = parseTime(closeStr, now);
    if (now >= openTime && now < closeTime) {
      // Resource is open
      return { isOpen: true, nextOpen: 0 };
    }
    if (now < openTime) {
      // Not open yet today but will open later today.
      return { isOpen: false, nextOpen: openTime.getTime() };
    }
  }
  // If no valid hours today or already past closing time, check upcoming days.
  for (let i = 1; i < 7; i++) {
    const nextDayIndex = (todayIndex + i) % 7;
    const nextDayName = daysOfWeek[nextDayIndex];
    const nextDayHours =
      hoursOfOperation &&
      hoursOfOperation[nextDayName] &&
      hoursOfOperation[nextDayName].toLowerCase() !== "closed"
        ? hoursOfOperation[nextDayName]
        : null;
    if (nextDayHours) {
      const [nextOpenStr] = nextDayHours.split(" - ");
      const nextOpenDate = new Date(now);
      nextOpenDate.setDate(now.getDate() + i);
      const openTime = parseTime(nextOpenStr, nextOpenDate);
      return { isOpen: false, nextOpen: openTime.getTime() };
    }
  }
  // If no open day found, sort these last.
  return { isOpen: false, nextOpen: Infinity };
};

const sortByOperatingStatus = (a, b) => {
  const keyA = getOperatingSortKey(a);
  const keyB = getOperatingSortKey(b);
  if (keyA.isOpen && !keyB.isOpen) return -1;
  if (!keyA.isOpen && keyB.isOpen) return 1;
  if (!keyA.isOpen && !keyB.isOpen) return keyA.nextOpen - keyB.nextOpen;
  return 0; // Both open; preserve order.
};
// --- End New Sorting Helpers ---

export default function Home() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  // Default visible count per category.
  const defaultVisible = 4;
  const [visibleCounts, setVisibleCounts] = useState({
    Essentials: defaultVisible,
    "Shelter & Support Services": defaultVisible,
    "Medical & Health": defaultVisible,
    "Animal Support": defaultVisible,
  });

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  // When a main category is clicked (used in CategoryButtons)
  const handleCategoryClick = (category) => {
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.includes(category)
        ? prevSelectedCategories.filter((c) => c !== category)
        : [...prevSelectedCategories, category]
    );
    // Reset visible count for this category
    setVisibleCounts((prev) => ({ ...prev, [category]: defaultVisible }));
  };

  // When a subcategory is toggled for a given main category
  const handleSubCategoryClick = (mainCategory, subCategory) => {
    setSelectedSubCategories((prevSelectedSubCategories) => {
      const subCategoriesForCategory =
        prevSelectedSubCategories[mainCategory] || [];
      const updatedSubCategories = subCategoriesForCategory.includes(
        subCategory
      )
        ? subCategoriesForCategory.filter((sc) => sc !== subCategory)
        : [...subCategoriesForCategory, subCategory];
      return {
        ...prevSelectedSubCategories,
        [mainCategory]: updatedSubCategories,
      };
    });
    // Reset visible count for the affected main category
    setVisibleCounts((prev) => ({ ...prev, [mainCategory]: defaultVisible }));
  };

  const clearDateSelection = () => {
    setStartDate(null);
    setEndDate(null);
  };

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch("/api/resource-list");
        const data = await response.json();
        startTransition(() => {
          setResources(data);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error fetching resources:", error);
        startTransition(() => {
          setLoading(false);
        });
      }
    };
    fetchResources();
  }, []);

  // Functions to show more or less for a given category.
  const handleShowMore = (category) => {
    setVisibleCounts((prev) => ({ ...prev, [category]: prev[category] + 12 }));
  };

  const handleShowLess = (category) => {
    setVisibleCounts((prev) => ({ ...prev, [category]: defaultVisible }));
  };

  // For each category, first filter then sort the entire filtered array by operating status, then slice
  const filteredEssentials = filterResources(
    resources,
    "Essentials",
    selectedSubCategories["Essentials"] || [],
    searchInput,
    startDate,
    endDate
  );
  const sortedFilteredEssentials = [...filteredEssentials].sort(
    sortByOperatingStatus
  );
  const essentialsResources = sortedFilteredEssentials.slice(
    0,
    visibleCounts["Essentials"]
  );

  const filteredShelter = filterResources(
    resources,
    "Shelter & Support Services",
    selectedSubCategories["Shelter & Support Services"] || [],
    searchInput,
    startDate,
    endDate
  );
  const sortedFilteredShelter = [...filteredShelter].sort(
    sortByOperatingStatus
  );
  const shelterResources = sortedFilteredShelter.slice(
    0,
    visibleCounts["Shelter & Support Services"]
  );

  const filteredMedical = filterResources(
    resources,
    "Medical & Health",
    selectedSubCategories["Medical & Health"] || [],
    searchInput,
    startDate,
    endDate
  );
  const sortedFilteredMedical = [...filteredMedical].sort(
    sortByOperatingStatus
  );
  const medicalResources = sortedFilteredMedical.slice(
    0,
    visibleCounts["Medical & Health"]
  );

  const filteredAnimal = filterResources(
    resources,
    "Animal Support",
    selectedSubCategories["Animal Support"] || [],
    searchInput,
    startDate,
    endDate
  );
  const sortedFilteredAnimal = [...filteredAnimal].sort(sortByOperatingStatus);
  const animalResources = sortedFilteredAnimal.slice(
    0,
    visibleCounts["Animal Support"]
  );

  const deduplicateResources = (resources) => {
    return Array.from(new Map(resources.map((r) => [r.id, r])).values());
  };

  return (
    <div className="relative">
      <Head>
        <title>LA Relief - Discover Aid Near You</title>
        <meta
          name="description"
          content="Find aid and resources near you for emergencies and support."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tilt+Warp:wght@400;700&family=Noto+Sans:wght@700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400&family=Noto+Sans:wght@400;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Hero Section */}
      <div id="hero" className="relative h-screen w-full">
        {/* Background Image */}
        <img
          src="/images/imagenew.jpg"
          alt="Background Image"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-40"></div>

        {/* Landing Content (Heading, Explore Button) */}
        <div
          className="absolute inset-0 flex flex-col justify-center items-center text-center text-white"
          style={{ paddingTop: "4.15rem" }}
        >
          <motion.h1
            className="text-6xl md:text-8xl mb-9"
            style={{
              fontFamily: "'Tilt Warp', sans-serif",
              textShadow: "0px 11.36px 11.36px rgba(0, 0, 0, 0.15)",
            }}
            initial={{ y: 25, opacity: 0.2 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.05, ease: "easeInOut" }}
          >
            Discover Aid Near You
          </motion.h1>
          <motion.div
            className=" rounded-[22px]"
            initial={{ background: "rgba(206, 206, 206, 0.62)" }}
            animate={{
              background: "rgba(218, 218, 218, 0)",
              scale: [0.97, 1, 1],
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <Link
              to="map"
              className="flex justify-center items-center border border-white text-white hover:text-black hover:bg-white transition-all duration-300 cursor-pointer "
              style={{
                fontFamily: "'Noto Sans Multani', sans-serif",
                fontSize: "24px",
                fontWeight: "bold",
                borderRadius: "22px",
                padding: "10px 22px",
                borderWidth: "2px",
              }}
              spy={true}
              smooth={true}
              duration={500}
            >
              EXPLORE RESOURCES
            </Link>
          </motion.div>
        </div>

        {/* Scroll Arrow */}
        <div className="absolute bottom-8 w-full flex justify-center items-center">
          <ScrollArrow to="mission" />
        </div>
      </div>

      <section
        id="mission"
        className="bg-[#183917] text-white min-h-screen flex items-center justify-center px-4 md:px-8 relative overflow-hidden overflow-x-hidden"
      >
        <div>
          {/* Lighter green square on right with drop shadow */}
          <div
            className="absolute top-0 right-0 h-full bg-[#267738] rounded-tl-[160px] rounded-bl-[100px] hidden md:block "
            style={{
              zIndex: 0,
              width: "30.5%",
              boxShadow: "-25px 1px 2px 0 rgba(0, 0, 0, 0.3)",
            }}
          ></div>

          <div className="max-w-8xl mx-auto flex flex-col md:flex-row items-center gap-4 relative z-10">
            {/* Text Content */}
            <div className="md:w-[80%] lg:w-[50%] w-full z-10 flex flex-col justify-center items-center text-center h-full pl-16">
              {/* Title */}
              <h2
                className="mb-6 text-4xl md:text-[94px]"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: "900",
                  lineHeight: "1.1",
                  whiteSpace: "nowrap",
                  textShadow: "0px 10px 4px rgba(0, 0, 0, 0.25)",
                }}
              >
                OUR MISSION
              </h2>

              {/* Paragraph */}

              <motion.p
                className="text-md md:text-[22px] mb-8 leading-relaxed"
                style={{
                  fontFamily: "'Noto Sans Multani', sans-serif",
                  fontWeight: "400",
                }}
                initial={{ opacity: 0, y: 50 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                Our mission is to stand with communities affected by the Los
                Angeles wildfires. We’re here to make it easier to find the
                resources, support, and opportunities needed to recover and
                rebuild. Whether it’s through donations, volunteering, or simply
                offering a helping hand, we believe in the power of coming
                together to make a real difference.
              </motion.p>

              {/* Buttons */}
              <motion.div
                className="flex flex-col md:flex-row gap-4"
                initial={{ opacity: 0, y: 50 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                {/* Using ScrollLink to scroll to the section with id "map" */}
                <ScrollLink to="map" smooth={true} duration={500} offset={-70}>
                  <motion.button
                    className="bg-white text-[#183917] text-md md:text-[20px] font-bold py-3 px-8 rounded-full border-2 border-white hover:bg-[#183917] hover:text-white hover:border-white transition-all duration-300 cursor-pointer"
                    style={{
                      fontFamily: "'Noto Sans Multani', sans-serif",
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    EXPLORE RESOURCES
                  </motion.button>
                </ScrollLink>

                <motion.button
                  className="bg-transparent border-2 border-white text-md md:text-[20px] font-bold py-3 px-8 rounded-full hover:bg-white hover:text-green-900 transition-all duration-300"
                  style={{
                    fontFamily: "'Noto Sans Multani', sans-serif",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/contact")}
                >
                  GET SUPPORT
                </motion.button>
              </motion.div>
            </div>

            {/* Image Content */}
            <div className="md:w-[55%] relative h-full pr-8 md:left-0 left-1/4">
              <motion.div
                className="relative z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <img
                  src="/images/mission-graphic.png"
                  alt="Support graphic"
                  className="md:w-[73%] w-[50%] h-auto "
                />
              </motion.div>
              {/* Vertical Texts */}

              {/* VERTICAL (Desktop) Version */}
              <motion.div
                data-no-translate="true"
                className="hidden md:block absolute top-[16vw] transform -translate-y-[14vw] right-[-3rem] text-white font-extrabold z-20"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: "900",
                  fontSize: "105px", // Larger for desktop
                  textShadow: "0px 2px 2px rgba(0, 0, 0, 0.3)",
                }}
                initial={{ x: 150, opacity: 0, rotate: -90 }}
                whileInView={{ x: 0, opacity: 1, rotate: -90 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                SUPPORT
              </motion.div>

              <motion.div
                data-no-translate="true"
                className="hidden md:block absolute top-[10vh] md:top-[16vw] transform -translate-y-[64vw] right-[-8.7rem] text-green-100 font-extrabold z-10"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: "900",
                  fontSize: "105px",
                  letterSpacing: "normal",
                  WebkitTextStroke: "1px #ffffff",
                  color: "transparent",
                }}
                initial={{ x: 160, opacity: 0, rotate: -90 }}
                whileInView={{ x: 0, opacity: 1, rotate: -90 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                SUPPORT
              </motion.div>

              {/* HORIZONTAL (Mobile) Version */}
              <motion.div
                data-no-translate="true"
                className="block md:hidden absolute top-[8vh] left-4 text-white font-extrabold z-0"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: "900",
                  fontSize: "48px", // Smaller for mobile
                  textShadow: "0px 2px 2px rgba(0, 0, 0, 0.3)",
                }}
                initial={{ y: 50, opacity: 0, rotate: 0 }}
                whileInView={{ y: 0, opacity: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                SUPPORT
              </motion.div>
              <motion.div
                data-no-translate="true"
                className="block md:hidden absolute top-[13vh] left-4 text-white font-extrabold z-0"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: "900",
                  fontSize: "48px",
                  letterSpacing: "normal",
                  WebkitTextStroke: "1px #ffffff",
                  color: "transparent",
                }}
                initial={{ y: 50, opacity: 0, rotate: 0 }}
                whileInView={{ y: 0, opacity: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                SUPPORT
              </motion.div>
            </div>
          </div>
          <ScrollArrow to="map" />
        </div>
      </section>

      {/* Map Section */}
      <section
        id="map"
        className="w-full pt-16 pb-6 overflow-x-hidden"
        style={{ backgroundColor: "#267738" }}
      >
        <h2
          className="text-center relative z-20 flex justify-center items-center gap-2 mb-8"
          style={{
            fontFamily: "'Noto Sans', sans-serif",
            fontWeight: "900",
            fontSize: "94px",
            color: "white",
            textShadow: "0px 10px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          MAP
          <span className="relative group">
            <i className="fas fa-circle-info text-3xl cursor-pointer text-white"></i>
            <span
              className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-left rounded-lg"
              style={{ width: "40vw" }}
            >
              <p className="mt-2 font-semibold">
                Welcome to our interactive map!{" "}
              </p>
              <p className="mb-2 font-medium">
                Explore to find resources, donation options, or volunteer
                opportunities. Use the top buttons to toggle features like
                &apos;Open Now&apos;, wildfire alerts, and air quality overlays,
                and search for organizations using the search bar. Click on any
                marker to get detailed information, and check the legend for air
                quality details. This tool is designed to help you quickly find
                the support you need!
              </p>
            </span>
          </span>
        </h2>

        <div className="relative w-full">
          <MapComponent />
          <ScrollArrow to="resources" />
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources">
        <div
          style={{
            backgroundColor: "#183917",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Header */}
          <div className="px-8 pt-8 select-none">
            <div className="heading-container w-full flex flex-col md:flex-row md:items-baseline gap-6">
              <div className="max-w-2xl">
                <h2 className="relative text-center">
                  <span
                    className="absolute inset-0 text-center"
                    style={{
                      fontFamily: "'Noto Sans', sans-serif",
                      fontWeight: "900",
                      fontSize: "5.5rem",
                      top: "-0.25rem",
                      left: "-0.75rem",
                      color: "transparent",
                      WebkitTextStroke: "1px #ffffff",
                    }}
                  >
                    SEARCH FOR
                  </span>
                  <span
                    className="relative text-white"
                    style={{
                      fontFamily: "'Noto Sans', sans-serif",
                      fontWeight: "900",
                      fontSize: "5.5rem",
                      textShadow: "0px 10px 4px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    SEARCH FOR
                  </span>
                </h2>
              </div>
              <div
                className="search-container relative"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontSize: "16px",
                  fontWeight: "700",
                }}
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    className="search-filter-containers relative flex items-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <input
                      type="text"
                      placeholder="Name of organization"
                      onChange={handleSearch}
                      value={searchInput}
                      className="rounded-full py-2 px-4"
                    />
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      style={{
                        color: "#AAAAAA",
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        height: "15px",
                        transform: "translateY(-50%)",
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className="date-picker-container relative flex gap-4 items-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <DatePicker
                        selected={startDate}
                        onChange={(dates) => {
                          const [start, end] = dates;
                          setStartDate(start);
                          setEndDate(end);
                        }}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        placeholderText="Date"
                        className="rounded-full w-60 h-10 text-center pr-4"
                      />
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        style={{
                          color: "#71767B",
                          position: "absolute",
                          height: "20px",
                          top: "20%",
                          right: "12px",
                        }}
                      />
                    </div>
                  </motion.div>
                  {startDate && endDate && (
                    <button
                      onClick={clearDateSelection}
                      className="bg-white text-black font-bold py-2 px-4 rounded-full"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* --- Essentials Category --- */}
            <div className="mt-4">
              <h2
                className="text-xl font-bold mb-7"
                style={{
                  fontFamily: "'Potta One', normal",
                  fontSize: "50px",
                  color: "#ffffff",
                  marginTop: "15px",
                }}
              >
                Essentials
              </h2>

              <div className="flex flex-col md:flex-row items-start justify-between mb-[-1vw]">
                <CategoryButtons
                  categories={[
                    "Food & Water",
                    "Clothing & Personal Items",
                    "Hygiene & Sanitation",
                    "Financial Assistance",
                  ]}
                  selectedCategories={selectedSubCategories["Essentials"] || []}
                  handleCategoryClick={(subCategory) =>
                    handleSubCategoryClick("Essentials", subCategory)
                  }
                  mainCategory="Essentials"
                />
                <div className="flex gap-2 mt-3">
                  {visibleCounts["Essentials"] < filteredEssentials.length && (
                    <motion.button
                      onClick={() => handleShowMore("Essentials")}
                      className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                      style={{ fontFamily: "'Noto Sans', sans-serif" }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FontAwesomeIcon icon={faChevronDown} width="16px" />
                      <span>Show More</span>
                    </motion.button>
                  )}
                  {visibleCounts["Essentials"] > defaultVisible && (
                    <motion.button
                      onClick={() => handleShowLess("Essentials")}
                      className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                      style={{ fontFamily: "'Noto Sans', sans-serif" }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FontAwesomeIcon icon={faChevronUp} width="16px" />
                      <span>Show Less</span>
                    </motion.button>
                  )}
                </div>
              </div>
              <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center -mx-[4.8vw] w-[100vw] pr-[4vw]">
                {essentialsResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>

            {/* --- Shelter & Support Services Category --- */}
            <div className="mt-4">
              <h2
                className="text-xl font-bold mb-7"
                style={{
                  fontFamily: "'Potta One', normal",
                  fontSize: "50px",
                  color: "#ffffff",
                  marginTop: "15px",
                }}
              >
                Shelter & Support Services
              </h2>
              <div className="flex flex-col md:flex-row items-start justify-between mb-[-1vw]">
                <CategoryButtons
                  categories={[
                    "Shelters & Housing Assistance",
                    "Transportation Assistance",
                    "Legal Aid",
                  ]}
                  selectedCategories={
                    selectedSubCategories["Shelter & Support Services"] || []
                  }
                  handleCategoryClick={(subCategory) =>
                    handleSubCategoryClick(
                      "Shelter & Support Services",
                      subCategory
                    )
                  }
                  mainCategory="Shelter & Support Services"
                />
                <div className="flex gap-2 mt-3">
                  {visibleCounts["Shelter & Support Services"] <
                    filteredShelter.length && (
                    <motion.button
                      onClick={() =>
                        handleShowMore("Shelter & Support Services")
                      }
                      className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                      style={{ fontFamily: "'Noto Sans', sans-serif" }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FontAwesomeIcon icon={faChevronDown} width="16px" />
                      <span>Show More</span>
                    </motion.button>
                  )}
                  {visibleCounts["Shelter & Support Services"] >
                    defaultVisible && (
                    <motion.button
                      onClick={() =>
                        handleShowLess("Shelter & Support Services")
                      }
                      className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                      style={{ fontFamily: "'Noto Sans', sans-serif" }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FontAwesomeIcon icon={faChevronUp} width="16px" />
                      <span>Show Less</span>
                    </motion.button>
                  )}
                </div>
              </div>
              <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center -mx-[4.8vw] w-[100vw] pr-[4vw]">
                {shelterResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>

            {/* --- Medical & Health Category --- */}
            <div className="mt-4">
              <h2
                className="text-xl font-bold mb-7"
                style={{
                  fontFamily: "'Potta One', normal",
                  fontSize: "50px",
                  color: "#ffffff",
                  marginTop: "15px",
                }}
              >
                Medical & Health
              </h2>
              <div className="flex flex-col md:flex-row items-start justify-between mb-[-1vw]">
                <CategoryButtons
                  categories={[
                    "Medical Aid & First Aid",
                    "Mental Health Support",
                  ]}
                  selectedCategories={
                    selectedSubCategories["Medical & Health"] || []
                  }
                  handleCategoryClick={(subCategory) =>
                    handleSubCategoryClick("Medical & Health", subCategory)
                  }
                  mainCategory="Medical & Health"
                />
                <div className="flex gap-2">
                  {visibleCounts["Medical & Health"] <
                    filteredMedical.length && (
                    <motion.button
                      onClick={() => handleShowMore("Medical & Health")}
                      className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                      style={{ fontFamily: "'Noto Sans', sans-serif" }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FontAwesomeIcon icon={faChevronDown} width="16px" />
                      <span>Show More</span>
                    </motion.button>
                  )}
                  {visibleCounts["Medical & Health"] > defaultVisible && (
                    <motion.button
                      onClick={() => handleShowLess("Medical & Health")}
                      className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                      style={{ fontFamily: "'Noto Sans', sans-serif" }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FontAwesomeIcon icon={faChevronUp} width="16px" />
                      <span>Show Less</span>
                    </motion.button>
                  )}
                </div>
              </div>
              <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center -mx-[4.8vw] w-[100vw] pr-[4vw]">
                {medicalResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>

            {/* --- Animal Support Category --- */}
            <div className="mt-4">
              <h2
                className="text-xl font-bold mb-7"
                style={{
                  fontFamily: "'Potta One', normal",
                  fontSize: "50px",
                  color: "#ffffff",
                  marginTop: "15px",
                }}
              >
                Animal Support
              </h2>
              <div className="flex flex-col md:flex-row items-start justify-between mb-[-1vw]">
                <CategoryButtons
                  categories={["Animal Boarding", "Veterinary Care & Pet Food"]}
                  selectedCategories={
                    selectedSubCategories["Animal Support"] || []
                  }
                  handleCategoryClick={(subCategory) =>
                    handleSubCategoryClick("Animal Support", subCategory)
                  }
                  mainCategory="Animal Support"
                />
                <div className="flex gap-2">
                  {visibleCounts["Animal Support"] < filteredAnimal.length && (
                    <motion.button
                      onClick={() => handleShowMore("Animal Support")}
                      className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                      style={{ fontFamily: "'Noto Sans', sans-serif" }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FontAwesomeIcon icon={faChevronDown} width="16px" />
                      <span>Show More</span>
                    </motion.button>
                  )}
                  {visibleCounts["Animal Support"] > defaultVisible && (
                    <motion.button
                      onClick={() => handleShowLess("Animal Support")}
                      className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                      style={{ fontFamily: "'Noto Sans', sans-serif" }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FontAwesomeIcon icon={faChevronUp} width="16px" />
                      <span>Show Less</span>
                    </motion.button>
                  )}
                </div>
              </div>
              <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center -mx-[4.8vw] w-[100vw] pr-[4vw]">
                {animalResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#183917]" style={{ height: "5vw" }}>
        <ScrollArrow to="support" />
      </section>

      <section
        id="support"
        className="bg-[#267738] min-h-screen flex items-center pb-8 overflow-hidden"
      >
        <div className="bg-[#267738]">
          <div className="w-[100vw] px-4 md:px-10 flex flex-col lg:flex-row">
            {/* Text Content */}
            <div className="flex flex-col justify-center items-start lg:w-1/2 text-white text-left">
              <div className="flex flex-col justify-center items-start h-full mx-auto">
                <h2 className="text-5xl md:text-6xl font-bold mb-4 w-[400px]">
                  {bethehope.map((char, index) => (
                    <motion.span
                      key={index}
                      className="text-[5.5rem] mr-4"
                      style={{
                        fontFamily: "'Dancing Script', cursive",
                        fontWeight: 400,
                        display: "inline-block",
                      }}
                      initial={{ y: 0 }}
                      viewport={{ once: true }}
                      whileInView={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: 0,
                        repeatType: "loop",
                        ease: "easeInOut",
                        delay: index * 0.1,
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                  <br />
                  <span
                    data-no-translate="true"
                    className="text-white text-[6rem]"
                    style={{
                      fontFamily: "'Noto Sans', sans-serif",
                      fontWeight: 800,
                    }}
                  >
                    SOMEONE NEEDS
                  </span>
                </h2>
                <motion.p
                  className="text-[1.65rem] mb-8 w-[550px]"
                  style={{ fontFamily: "'Noto Sans', sans-serif" }}
                  initial={{ opacity: 0, y: 50 }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                >
                  The Los Angeles community needs your help to provide
                  essentials, shelter, medical care, and support for animals
                  affected by the wildfires. Offer your time or resources to
                  support those in need!
                </motion.p>
                <motion.div
                  className="flex flex-col gap-4"
                  initial={{ opacity: 0, y: 50 }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                >
                  <button
                    onClick={() => navigate("/volunteer")}
                    className="bg-[#183917] text-white font-bold py-2 px-6 rounded-2xl hover:bg-white hover:text-[#183917] border border-white transition-all duration-300 flex items-center justify-between w-[16.3rem]"
                    style={{
                      fontFamily: "'Noto Sans', sans-serif",
                      fontWeight: 800,
                      fontSize: "1.8rem",
                    }}
                  >
                    <span className="flex-grow text-left">VOLUNTEER</span>
                    <FontAwesomeIcon icon={faCaretRight} />
                  </button>
                  <button
                    onClick={() => navigate("/donate")}
                    className="bg-[#183917] text-white font-bold py-2 px-6 rounded-2xl hover:bg-white hover:text-[#183917] border border-white transition-all duration-300 flex items-center justify-between w-[16.3rem]"
                    style={{
                      fontFamily: "'Noto Sans', sans-serif",
                      fontWeight: 800,
                      fontSize: "1.8rem",
                    }}
                  >
                    <span className="flex-grow text-left">DONATE</span>
                    <FontAwesomeIcon icon={faCaretRight} />
                  </button>
                </motion.div>
              </div>
            </div>

            {/* Graphic Content Group, right side */}
            <div className="flex justify-center items-center lg:w-1/2">
              <div className="relative w-full flex justify-center">
                {/* Background SUPPORT text */}
                <div
                  className="absolute inset-0 flex flex-col justify-center items-center z-0 text-[#184822] mr-10"
                  style={{
                    fontFamily: "'Noto Sans', sans-serif",
                    fontWeight: 800,
                    lineHeight: "0.88",
                    fontSize: "12rem",
                    letterSpacing: "-0.5rem",
                  }}
                >
                  <motion.span
                    data-no-translate="true"
                    initial={{ y: 200, opacity: 0 }}
                    viewport={{ once: true }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  >
                    SUPPORT
                  </motion.span>
                  <motion.span
                    data-no-translate="true"
                    initial={{ y: 210, opacity: 0 }}
                    viewport={{ once: true }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  >
                    SUPPORT
                  </motion.span>
                  <motion.span
                    data-no-translate="true"
                    initial={{ y: 220, opacity: 0 }}
                    viewport={{ once: true }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  >
                    SUPPORT
                  </motion.span>
                  <motion.span
                    data-no-translate="true"
                    initial={{ y: 230, opacity: 0 }}
                    viewport={{ once: true }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  >
                    SUPPORT
                  </motion.span>
                </div>

                {/* Globe Image */}
                <img
                  src="/images/globe.png"
                  alt="Earth Graphic"
                  className="relative z-10 w-[45.25vw] mt-[9.5rem] ml-[3rem] mr-10"
                />
              </div>
            </div>
          </div>
          {/* Scroll Arrow Component */}
          <ScrollArrow to="faq" />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-[#183917] py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="relative text-center">
            <span
              className="absolute inset-0 text-center"
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontWeight: "900",
                fontSize: "5.5rem",
                top: "-0.25rem",
                left: "-0.75rem",
                color: "transparent",
                WebkitTextStroke: "1px #ffffff",
              }}
            >
              FAQs
            </span>
            <span
              className="relative text-white"
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontWeight: "900",
                fontSize: "5.5rem",
                textShadow: "0px 10px 4px rgba(0, 0, 0, 0.25)",
              }}
            >
              FAQs
            </span>
          </h2>
          <div className="space-y-4">
            <Dropdown
              title="How can I volunteer or contribute?"
              content="You can explore volunteer opportunities and donation needs by navigating through the interactive map or selecting the 'Volunteer Opportunities' or 'Donations Needed' buttons on the website. Additionally, you can click the 'Volunteer' or 'Donate' buttons in the navigation bar to visit dedicated pages and explore available opportunities or postings."
            />
            <Dropdown
              title="What types of donations are accepted?"
              content="We accept various types of donations, such as food, hygiene supplies, medical items, and pet supplies. Specific donation needs can be found under the 'Donations Needed' tab on the map and on the Donations page."
            />
            <Dropdown
              title="How do I find resources or assistance near me?"
              content="You can enter your address in the map's search bar to view nearby resources, shelters, and services. From there, you can explore by categories such as Essentials, Shelter & Support Services, Medical & Health, or Animal Support."
            />
            <Dropdown
              title="What should I do in case of a wildfire evacuation?"
              content="Follow designated evacuation routes and instructions from authorities. Bring essential documents, medications, and emergency supplies. Secure your home by locking doors and turning off utilities if time permits. Check on neighbors and assist those in need. Stay informed through updates from local emergency services."
            />
            <Dropdown
              title="How do I contact you to add information or organizations to the website?"
              content="If you would like to contribute information, suggest an organization, or report updates, please use the contact form on the 'Contact Us' page or email us directly."
            />
            <Dropdown
              title="How often is the map and resource list updated?"
              content="The map and resource list are updated daily to reflect the latest information about resources, donations, and volunteer needs."
            />
            <Dropdown
              title="Can I collaborate with LARelief to list my organization’s opportunities?"
              content="Absolutely! Use the Google Form on the Contact page to share your organization’s details, volunteer opportunities, or donation requests. Our team will review and add it to the platform."
            />
          </div>
        </div>
      </section>
    </div>
  );
}
