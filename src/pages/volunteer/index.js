import React, { useState, useEffect } from "react";
import Head from "next/head";
import { scroller } from "react-scroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  faMagnifyingGlass,
  faArrowDown,
  faCalendarAlt,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import VolunteerCard from "@/components/VolunteerCard";
import "@fontsource/potta-one";
import CategoryButtons from "@/components/CategoryButtons";
import { filterResources } from "@/components/filter";
import ScrollArrow from "@/components/ScrollArrow";

export default function Home() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  // Separate visible counts for each category
  const [visibleEssentials, setVisibleEssentials] = useState(4);
  const [visibleShelter, setVisibleShelter] = useState(4);
  const [visibleMedical, setVisibleMedical] = useState(4);
  const [visibleAnimal, setVisibleAnimal] = useState(4);

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    // Reset all visible counts when filters change
    setVisibleEssentials(4);
    setVisibleShelter(4);
    setVisibleMedical(4);
    setVisibleAnimal(4);
  };

  const handleSubCategoryClick = (mainCategory, subCategory) => {
    setSelectedSubCategories((prev) => {
      const subCats = prev[mainCategory] || [];
      const updated = subCats.includes(subCategory)
        ? subCats.filter((sc) => sc !== subCategory)
        : [...subCats, subCategory];
      return { ...prev, [mainCategory]: updated };
    });
    // Reset all visible counts when filters change
    setVisibleEssentials(4);
    setVisibleShelter(4);
    setVisibleMedical(4);
    setVisibleAnimal(4);
  };

  const clearDateSelection = () => {
    setStartDate(null);
    setEndDate(null);
  };

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch("/api/volunteer-list");
        const data = await response.json();
        setResources(data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  // Handlers for each category’s show more/less
  const handleShowMoreEssentials = () => {
    setVisibleEssentials((prev) => prev + 12);
  };
  const handleShowLessEssentials = () => {
    setVisibleEssentials(4);
  };

  const handleShowMoreShelter = () => {
    setVisibleShelter((prev) => prev + 12);
  };
  const handleShowLessShelter = () => {
    setVisibleShelter(4);
  };

  const handleShowMoreMedical = () => {
    setVisibleMedical((prev) => prev + 12);
  };
  const handleShowLessMedical = () => {
    setVisibleMedical(4);
  };

  const handleShowMoreAnimal = () => {
    setVisibleAnimal((prev) => prev + 12);
  };
  const handleShowLessAnimal = () => {
    setVisibleAnimal(4);
  };

  // Compute full filtered lists (without slicing)
  const filteredEssentials = filterResources(
    resources,
    "Essentials",
    selectedSubCategories["Essentials"] || [],
    searchInput,
    startDate,
    endDate
  );
  const filteredShelter = filterResources(
    resources,
    "Shelter & Support Services",
    selectedSubCategories["Shelter & Support Services"] || [],
    searchInput,
    startDate,
    endDate
  );
  const filteredMedical = filterResources(
    resources,
    "Medical & Health",
    selectedSubCategories["Medical & Health"] || [],
    searchInput,
    startDate,
    endDate
  );
  const filteredAnimal = filterResources(
    resources,
    "Animal Support",
    selectedSubCategories["Animal Support"] || [],
    searchInput,
    startDate,
    endDate
  );

  // Sorting Helpers

  // Safely converts a time string (e.g., "08:00") into a Date object using a base date.
  const parseTimeForVolunteer = (timeStr) => {
    return new Date(`1970-01-01T${timeStr}`);
  };

  // Examines the event’s hours_of_operation (format "HH:MM - HH:MM")
  // to determine if it is currently active (returns 0) or, if not,
  // when it will next open (in milliseconds).
  const getOperatingSortKeyForVolunteer = (hours_of_operation) => {
    if (!hours_of_operation || typeof hours_of_operation !== "string") {
      return Number.MAX_SAFE_INTEGER;
    }
    const [openTimeStr, closeTimeStr] = hours_of_operation
      .split("-")
      .map((s) => s.trim());
    const now = new Date();
    let openDate = parseTimeForVolunteer(openTimeStr);
    let closeDate = parseTimeForVolunteer(closeTimeStr);
    // Set open and close times to today's date
    openDate.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
    closeDate.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
    if (now >= openDate && now <= closeDate) {
      // Currently active – sort key of 0 means highest priority
      return 0;
    }
    let diff = openDate - now;
    if (diff < 0) {
      // If open time already passed today, assume next open is tomorrow.
      diff = openDate.getTime() + 24 * 60 * 60 * 1000 - now.getTime();
    }
    return diff;
  };

  // Sorting function that compares events first by their start_date,
  // then by end_date (if available, otherwise using start_date),
  // and finally by the operating hours.
  const sortVolunteerResources = (a, b) => {
    const startA = new Date(a.start_date);
    const startB = new Date(b.start_date);
    if (startA < startB) return -1;
    if (startA > startB) return 1;

    const endA = a.end_date ? new Date(a.end_date) : startA;
    const endB = b.end_date ? new Date(b.end_date) : startB;
    if (endA < endB) return -1;
    if (endA > endB) return 1;

    const opKeyA = getOperatingSortKeyForVolunteer(a.hours_of_operation);
    const opKeyB = getOperatingSortKeyForVolunteer(b.hours_of_operation);
    return opKeyA - opKeyB;
  };

  // Create sorted copies of the filtered lists before slicing.
  const sortedEssentials = filteredEssentials
    .slice()
    .sort(sortVolunteerResources);
  const sortedShelter = filteredShelter.slice().sort(sortVolunteerResources);
  const sortedMedical = filteredMedical.slice().sort(sortVolunteerResources);
  const sortedAnimal = filteredAnimal.slice().sort(sortVolunteerResources);

  return (
    <div className="relative">
      <Head>
        <title>LA Relief - Discover Aid Near You</title>
        <meta
          name="description"
          content="Find aid and resources near you for emergencies and support."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Original fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Tilt+Warp:wght@400;700&family=Noto+Sans:wght@700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Multani&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Mission Section */}
      <section
        id="mission"
        className="bg-[#183917] text-white min-h-screen flex items-center justify-center px-4 px-8 relative overflow-hidden"
      >
        {/* Road Background Image */}
        <motion.img
          src="/images/road.png"
          alt="Green road shape"
          className="absolute bottom-0 left-0 w-full md:h-auto object-cover"
          style={{ zIndex: 0 }}
          initial={{ x: -150, y: -100, opacity: 0.5 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* VOLUNTEER Label */}
        <div
          className="absolute top-0 left-0 bg-[#227541] rounded-br-[12vw] flex items-center justify-center"
          style={{
            zIndex: 1,
            height: "10vw",
            width: "43vw",
            fontFamily: "'Noto Sans', sans-serif",
            textAlign: "center",
          }}
        >
          <motion.h2
            className="relative text-center font-bold text-white"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.span
              data-no-translate="true"
              className="absolute inset-0"
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontWeight: 900,
                fontSize: "5vw",
                top: "-2rem",
                left: "-1vw",
                color: "transparent",
                WebkitTextStroke: "1px #ffffff",
                zIndex: 1,
              }}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3 }}
            >
              VOLUNTEER
            </motion.span>
            <span
              data-no-translate="true"
              className="relative text-white"
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontWeight: 900,
                fontSize: "5vw",
                textShadow: "0px 10px 4px rgba(0, 0, 0, 0.25)",
                zIndex: 2,
              }}
            >
              VOLUNTEER
            </span>
          </motion.h2>
        </div>

        {/* Main Content Row */}
        <div className="relative z-10 flex flex-col md:flex-row items-center w-full max-w-7xl mt-[4vw] ml-[0vw]">
          <div className="w-full mt-0">
            <img
              src="/images/volunteer.png"
              alt="Volunteers"
              className="w-[70vw]"
            />
          </div>

          {/* Right Side: Text + Button */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left px-4">
            <motion.h3
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontWeight: "400",
                fontSize: "1.5vw",
                maxWidth: "100%",
                margin: "0 auto",
                textAlign: "center",
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Join a community of
            </motion.h3>
            <motion.h3
              data-no-translate="true"
              className="font-extrabold mt-2"
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontWeight: "900",
                fontSize: "5.5vw",
                margin: "0 auto",
                paddingTop: "2.25vw",
                lineHeight: "1rem",
                textAlign: "center",
              }}
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              10,000+
            </motion.h3>
            <motion.p
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontWeight: "900",
                fontSize: "5vw",
                maxWidth: "85%",
                margin: "0 auto",
                paddingTop: "2.5vw",
                paddingRight: "5vw",
                lineHeight: "4vw",
                textAlign: "center",
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              volunteers
            </motion.p>
            <motion.p
              className="-mt-3vw"
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontWeight: "400",
                fontSize: "1.5vw",
                maxWidth: "46%",
                margin: "0 auto",
                padding: "0vw",
                paddingTop: "0.5vw",
                textAlign: "center",
                lineHeight: "2vw",
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              making a difference in Los Angeles
            </motion.p>
            {/* EXPLORE OPPORTUNITIES Button */}
            <motion.button
              onClick={() =>
                scroller.scrollTo("resources", {
                  smooth: true,
                  duration: 500,
                  offset: -50,
                })
              }
              className="flex justify-center mt-6 bg-white text-[#194218] ml-[5vw] font-bold py-3 px-8 rounded-full border-2 border-white hover:bg-[#194218] hover:text-white transition-all duration-300"
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontSize: "1.5vw",
              }}
              transition={{ duration: 0, ease: "easeInOut" }}
              whileHover={{ scale: 1.03 }}
            >
              EXPLORE OPPORTUNITIES
            </motion.button>
          </div>
        </div>
      </section>

      <section className="bg-[#183917]" style={{ height: "2vw" }}>
        <ScrollArrow to="resources" />
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
            paddingLeft: "2.5vw",
          }}
        >
          <Head>
            <title>LA Relief - Discover Aid Near You</title>
            <meta
              name="description"
              content="Find aid and resources near you for emergencies and support."
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Tilt+Warp:wght@400;700&family=Noto+Sans:wght@700&display=swap"
              rel="stylesheet"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700;900&display=swap"
              rel="stylesheet"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Noto+Sans+Multani&display=swap"
              rel="stylesheet"
            />
          </Head>

          {/* Header and Search */}
          <div className="px-8 pt-8 select-none overflow-x-hidden">
            <div className="heading-container w-[95vw] flex flex-col md:flex-row md:items-baseline gap-6">
              <div className="max-w-2xl">
                {/* Section Header */}
                <h2 className="relative text-center">
                  {/* Stroke/Outline Layer */}
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
                  {/* Main Filled Layer */}
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
                {/* Search and Date Filter */}
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
                      style={{ fontFamily: "'Noto Sans Multani', sans-serif" }}
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
                        style={{
                          fontFamily: "'Noto Sans Multani', sans-serif",
                        }}
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

            {/* Essentials Category */}
            <div className="mt-4">
              <h2
                className="text-xl font-bold mb-7"
                style={{
                  fontFamily: "'Potta One', normal",
                  fontSize: "50px",
                  color: "#ffffff",
                  marginTop: "15px",
                  marginBottom: "20px",
                }}
              >
                Essentials
              </h2>
              <div className="flex flex-col md:flex-row items-start justify-between mb-[-1vw]">
                <CategoryButtons
                  categories={[
                    "Food & Water Distribution",
                    "Clothing & Supplies Distribution",
                    "Donation Sorting & Packing",
                  ]}
                  selectedCategories={selectedSubCategories["Essentials"] || []}
                  handleCategoryClick={(subCategory) =>
                    handleSubCategoryClick("Essentials", subCategory)
                  }
                />
                <div className="flex gap-2 mt-4 md:mt-0">
                  {visibleEssentials < filteredEssentials.length && (
                    <motion.button
                      onClick={handleShowMoreEssentials}
                      className="bg-white text-black font-bold py-1.5 px-3 rounded-full flex gap-1 items-center"
                      style={{ fontFamily: "'Noto Sans', sans-serif" }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FontAwesomeIcon icon={faChevronDown} width="16px" />
                      <span>Show More</span>
                    </motion.button>
                  )}
                  {visibleEssentials > 4 && (
                    <motion.button
                      onClick={handleShowLessEssentials}
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
            </div>
            <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full px-4 pr-0">
              {sortedEssentials.slice(0, visibleEssentials).map((resource) => (
                <VolunteerCard key={resource.id} resource={resource} />
              ))}
            </div>

            {/* Shelter & Support Services Category */}
            <div className="mt-4">
              <h2
                className="text-xl font-bold mb-7"
                style={{
                  fontFamily: "'Potta One', normal",
                  fontSize: "50px",
                  color: "#ffffff",
                  marginTop: "15px",
                  marginBottom: "20px",
                }}
              >
                Shelter & Support Services
              </h2>
              <div className="flex flex-col md:flex-row items-start justify-between mb-[-1vw]">
                <CategoryButtons
                  categories={[
                    "Shelter Assistance",
                    "Transportation & Delivery Support",
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
                <div className="flex gap-2 mt-4 md:mt-0 pr-[1.9vw]">
                  {visibleEssentials < filteredEssentials.length && (
                    <motion.button
                      onClick={handleShowMoreEssentials}
                      className="bg-white text-black font-bold py-1.5 px-3 rounded-full flex gap-1 items-center"
                      style={{ fontFamily: "'Noto Sans', sans-serif" }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FontAwesomeIcon icon={faChevronDown} width="16px" />
                      <span>Show More</span>
                    </motion.button>
                  )}
                  {visibleEssentials > 4 && (
                    <motion.button
                      onClick={handleShowLessEssentials}
                      className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                      style={{ fontFamily: "'Noto Sans', sans-serif" }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FontAwesomeIcon icon={faChevronUp} width="16px" />
                      <span>Show Less</span>
                    </motion.button>
                  )}
                  {visibleShelter > 4 && (
                    <button
                      onClick={handleShowLessShelter}
                      className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                      style={{ fontFamily: "'Noto Sans', sans-serif" }}
                    >
                      <FontAwesomeIcon icon={faChevronUp} width="16px" />
                      <span>Show Less</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full px-4 pr-0">
              {sortedShelter.slice(0, visibleShelter).map((resource) => (
                <VolunteerCard key={resource.id} resource={resource} />
              ))}
            </div>

            {/* Medical & Health Category */}
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
                  categories={["Medical Aid Support", "Mental Health Support"]}
                  selectedCategories={
                    selectedSubCategories["Medical & Health"] || []
                  }
                  handleCategoryClick={(subCategory) =>
                    handleSubCategoryClick("Medical & Health", subCategory)
                  }
                  mainCategory="Medical & Health"
                />
                <div className="flex gap-2 mt-4 md:mt-0 pr-[1.9vw]">
                  {visibleEssentials < filteredEssentials.length && (
                    <motion.button
                      onClick={handleShowMoreEssentials}
                      className="bg-white text-black font-bold py-1.5 px-3 rounded-full flex gap-1 items-center"
                      style={{ fontFamily: "'Noto Sans', sans-serif" }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FontAwesomeIcon icon={faChevronDown} width="16px" />
                      <span>Show More</span>
                    </motion.button>
                  )}
                  {visibleEssentials > 4 && (
                    <motion.button
                      onClick={handleShowLessEssentials}
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
            </div>
            <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full px-4 pr-0">
              {sortedMedical.slice(0, visibleMedical).map((resource) => (
                <VolunteerCard key={resource.id} resource={resource} />
              ))}
            </div>

            {/* Animal Support Category */}
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
                  categories={[
                    "Animal Shelter Assistance",
                    "Animal Rescue & Transport",
                    "Pet Supply Distribution",
                  ]}
                  selectedCategories={
                    selectedSubCategories["Animal Support"] || []
                  }
                  handleCategoryClick={(subCategory) =>
                    handleSubCategoryClick("Animal Support", subCategory)
                  }
                  mainCategory="Animal Support"
                />
                <div className="flex gap-2 mt-4 md:mt-0 pr-[1.9vw]">
                  {visibleEssentials < filteredEssentials.length && (
                    <motion.button
                      onClick={handleShowMoreEssentials}
                      className="bg-white text-black font-bold py-1.5 px-3 rounded-full flex gap-1 items-center"
                      style={{ fontFamily: "'Noto Sans', sans-serif" }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FontAwesomeIcon icon={faChevronDown} width="16px" />
                      <span>Show More</span>
                    </motion.button>
                  )}
                  {visibleEssentials > 4 && (
                    <motion.button
                      onClick={handleShowLessEssentials}
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
              <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full px-4 pr-0">
                {sortedAnimal.slice(0, visibleAnimal).map((resource) => (
                  <VolunteerCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
