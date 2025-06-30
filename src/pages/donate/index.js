import { React, useEffect, useState } from "react";
import Head from "next/head";
import { scroller } from "react-scroll";
import DonationCard from "@/components/DonationCard";
import ScrollArrow from "@/components/ScrollArrow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  faMagnifyingGlass,
  faCalendarAlt,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import "@fontsource/potta-one";
import CategoryButtons from "@/components/CategoryButtons";
import { filterResources } from "@/components/filter";
import { motion } from "framer-motion";

// --- Sorting Helpers for Donation Resources ---
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const parseTimeForDonation = (timeStr, baseDate) => {
  if (!timeStr || typeof timeStr !== "string" || !timeStr.includes(" ")) {
    return null;
  }
  const [time, modifier] = timeStr.split(" ");
  if (!time || !modifier) return null;
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const getOperatingSortKeyForDonation = (resource) => {
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
    const openTime = parseTimeForDonation(openStr, now);
    const closeTime = parseTimeForDonation(closeStr, now);
    if (openTime && closeTime) {
      if (now >= openTime && now < closeTime) {
        return { isOpen: true, nextOpen: 0 };
      }
      if (now < openTime) {
        return { isOpen: false, nextOpen: openTime.getTime() };
      }
    }
  }
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
      const openTime = parseTimeForDonation(nextOpenStr, nextOpenDate);
      if (openTime) {
        return { isOpen: false, nextOpen: openTime.getTime() };
      }
    }
  }
  return { isOpen: false, nextOpen: Infinity };
};

const sortByOperatingStatusForDonation = (a, b) => {
  const keyA = getOperatingSortKeyForDonation(a);
  const keyB = getOperatingSortKeyForDonation(b);
  if (keyA.isOpen && !keyB.isOpen) return -1;
  if (!keyA.isOpen && keyB.isOpen) return 1;
  if (!keyA.isOpen && !keyB.isOpen) return keyA.nextOpen - keyB.nextOpen;
  return 0;
};
// --- End Sorting Helpers ---

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
    // Reset visible counts when filters change
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
    // Reset visible counts when filters change
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
        const response = await fetch(`/api/donate-list`);
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

  // Handlers for show more/less
  const handleShowMoreEssentials = () =>
    setVisibleEssentials((prev) => prev + 12);
  const handleShowLessEssentials = () => setVisibleEssentials(4);
  const handleShowMoreShelter = () => setVisibleShelter((prev) => prev + 12);
  const handleShowLessShelter = () => setVisibleShelter(4);
  const handleShowMoreMedical = () => setVisibleMedical((prev) => prev + 12);
  const handleShowLessMedical = () => setVisibleMedical(4);
  const handleShowMoreAnimal = () => setVisibleAnimal((prev) => prev + 12);
  const handleShowLessAnimal = () => setVisibleAnimal(4);

  // Compute filtered arrays
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

  // Sort filtered arrays
  const sortedFilteredEssentials = [...filteredEssentials].sort(
    sortByOperatingStatusForDonation
  );
  const sortedFilteredShelter = [...filteredShelter].sort(
    sortByOperatingStatusForDonation
  );
  const sortedFilteredMedical = [...filteredMedical].sort(
    sortByOperatingStatusForDonation
  );
  const sortedFilteredAnimal = [...filteredAnimal].sort(
    sortByOperatingStatusForDonation
  );

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
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Tilt+Warp:wght@400;700&family=Noto+Sans:wght@700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Mission Section */}
      <section
        id="mission"
        className="bg-[#183917] text-white min-h-screen flex items-center justify-center md:px-8 relative overflow-hidden"
      >
        <div>
          {/* Title Text */}
          <div
            className="absolute top-0 pt-4 md:pt-2 left-[13vw] bg-[#227541] rounded-b-[4rem] md:rounded-b-[7vw] flex items-center justify-center text-white font-bold h-[16vh] md:h-[20vh] w-[82vw] md:w-[30vw]"
            style={{
              zIndex: 0,
              boxShadow: "-18px 0 2px 0 rgba(0, 0, 0, 0.3)",
              fontFamily: "'Noto Sans', sans-serif",
              textAlign: "center",
            }}
          >
            <motion.h2
              className="relative text-center"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <motion.span
                className="absolute inset-0 text-[3.8rem] md:text-[5.5rem] top-[-1rem] md:top-[-2rem] md:left-[-1rem]"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: "900",

                  color: "transparent",
                  WebkitTextStroke: "1px #ffffff",
                  zIndex: 1,
                }}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
              >
                DONATE
              </motion.span>
              <span
                className="relative text-white text-[3.8rem] md:text-[5.5rem]"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: "900",
                  textShadow: "0px 10px 4px rgba(0, 0, 0, 0.25)",
                  zIndex: 2,
                }}
              >
                DONATE
              </span>
            </motion.h2>
          </div>

          {/* Lighter Green Square on Right */}
          <div
            className="hidden md:block absolute top-12 right-0 h-full bg-[#267738] rounded-tl-[13vw] rounded-bl-[13vw]"
            style={{
              zIndex: 0,
              width: "30.5%",
              height: "90vh",
              boxShadow: "-25px 1px 2px 0 rgba(0, 0, 0, 0.3)",
            }}
          ></div>

          <div className="md:hidden relative w-full mt-[6rem]">
            <img
              src="/images/donate main mobile.png"
              alt="Donate main mobile"
              className="md:hidden w-full h-full object-cover"
            />

            {/* Box Overlay */}
            <div className="absolute inset-0 top-[38%] flex items-center justify-center z-10">
              <div className="max-w-8xl mx-auto flex flex-col md:flex-row items-center gap-4 relative z-10">
                {/* Text Content */}
                <div className="w-[100vw] z-10 flex flex-col justify-center items-center text-center h-full">
                  <motion.div
                    className="relative bg-[#183917] rounded-[2.5vw] border-[0.2rem] border-white shadow-lg mt-[8vw] py-2 px-4 w-[55vw]"
                    style={{
                      fontFamily: "'Noto Sans', sans-serif",
                      color: "#ffffff",
                      maxWidth: "90%",
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    whileHover={{ scale: 1.04 }}
                  >
                    {/* Circle with Star */}
                    <div
                      className="absolute -top-[7vw] left-[26vw] transform -translate-x-1/2 bg-white rounded-full w-[12vw] h-[12vw] flex items-center justify-center"
                      style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
                    >
                      <i
                        className="fas fa-star text-[#183917]"
                        style={{ fontSize: "1.2rem" }}
                      ></i>
                    </div>
                    {/* Text Content */}
                    <p
                      className="mb-2 pt-3 text-[1rem]"
                      style={{
                        fontWeight: "600",
                        margin: "0 auto",
                      }}
                    >
                      Help by donating to any of the
                    </p>
                    <motion.p
                      style={{
                        fontWeight: "900",
                        fontSize: "2.2rem",
                        margin: "0 auto",
                        paddingTop: "1rem",
                        lineHeight: "1rem",
                      }}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1 }}
                    >
                      100+
                    </motion.p>
                    <motion.p
                      style={{
                        fontWeight: "900",
                        fontSize: "1.2rem",
                        maxWidth: "85%",
                        margin: "0 auto",
                        paddingTop: "0.5rem",
                        lineHeight: "5vw",
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1 }}
                    >
                      organizations
                    </motion.p>
                    <p
                      style={{
                        fontWeight: "600",
                        fontSize: "0.7rem",
                        margin: "0 auto",
                        paddingTop: "0.7rem",
                      }}
                    >
                      supporting Los Angeles through wildfires
                    </p>
                  </motion.div>
                  {/* EXPLORE OPPORTUNITIES Button */}
                  <motion.button
                    onClick={() =>
                      scroller.scrollTo("resources", {
                        smooth: true,
                        duration: 500,
                        offset: -50,
                      })
                    }
                    className="mt-6 bg-white text-[#194218] font-bold py-3 px-8 rounded-full border-2 border-white hover:bg-[#194218] hover:text-white transition-all duration-300"
                    style={{ fontSize: "1.1rem" }}
                    whileHover={{ scale: 1.03 }}
                  >
                    EXPLORE OPPORTUNITIES
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex max-w-8xl mx-auto flex flex-col md:flex-row items-center gap-4 relative z-10">
            {/* Text Content */}
            <div className="w-[100vw] z-10 flex flex-col justify-center items-center text-center h-full">
              <motion.div
                className="relative bg-[#183917] right-[3vw] rounded-[2.5vw] border-[0.2rem] border-white shadow-lg mt-[8vw] py-4 px-0 w-[27vw]"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  color: "#ffffff",
                  maxWidth: "90%",
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                whileHover={{ scale: 1.04 }}
              >
                {/* Circle with Star */}
                <div
                  className="absolute -top-[3.5vw] left-[13.25vw] transform -translate-x-1/2 bg-white rounded-full w-[5vw] h-[5vw] flex items-center justify-center"
                  style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
                >
                  <i
                    className="fas fa-star text-[#183917]"
                    style={{ fontSize: "2.25vw" }}
                  ></i>
                </div>
                {/* Text Content */}
                <p
                  className="mb-2 pt-3"
                  style={{
                    fontFamily: "'Noto Sans', sans-serif",
                    fontWeight: "600",
                    fontSize: "1.5vw",
                    maxWidth: "50%",
                    margin: "0 auto",
                  }}
                >
                  Help by donating to any of the
                </p>
                <motion.p
                  style={{
                    fontFamily: "'Noto Sans', sans-serif",
                    fontWeight: "900",
                    fontSize: "5vw",
                    margin: "0 auto",
                    paddingTop: "2.25vw",
                    lineHeight: "1rem",
                  }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                >
                  100+
                </motion.p>
                <motion.p
                  style={{
                    fontFamily: "'Noto Sans', sans-serif",
                    fontWeight: "900",
                    fontSize: "3vw",
                    maxWidth: "85%",
                    margin: "0 auto",
                    paddingTop: "1.25vw",
                    lineHeight: "5vw",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                >
                  organizations
                </motion.p>
                <p
                  style={{
                    fontFamily: "'Noto Sans', sans-serif",
                    fontWeight: "600",
                    fontSize: "1.5vw",
                    maxWidth: "70%",
                    margin: "0 auto",
                    paddingTop: "0vw",
                  }}
                >
                  supporting Los Angeles through wildfires
                </p>
              </motion.div>
              {/* EXPLORE OPPORTUNITIES Button */}
              <motion.button
                onClick={() =>
                  scroller.scrollTo("resources", {
                    smooth: true,
                    duration: 500,
                    offset: -50,
                  })
                }
                className="mt-6 bg-white text-[#194218] mr-[6vw] font-bold py-3 px-8 rounded-full border-2 border-white hover:bg-[#194218] hover:text-white transition-all duration-300"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontSize: "1.75vw",
                }}
                transition={{ duration: 0, ease: "easeInOut" }}
                whileHover={{ scale: 1.03 }}
              >
                EXPLORE OPPORTUNITIES
              </motion.button>
            </div>

            {/* Desktop Image Content - Support Image */}
            <div className="hidden md:block relative h-full right-[15vw] z-1">
              <motion.div
                className=" relative z-50"
                initial={{ opacity: 0.7, y: 0 }}
                animate={{ opacity: 1, y: 0, scale: [1, 1.03, 1] }}
                transition={{ duration: 1, ease: "easeInOut" }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src="/images/donate.png"
                  alt="Support graphic"
                  className="w-[60vw] h-auto"
                />
              </motion.div>
              {/* Vertical Texts */}
              <motion.div
                data-no-translate="true"
                className="absolute w-[40vw] top-[14vw] left-[18vw] text-green-100 font-extrabold -rotate-90 z-20"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: "900",
                  fontSize: "5.5vw",
                  color: "#194218",
                  textShadow: "0px 2px 2px rgba(0, 0, 0, 0.3)",
                }}
                initial={{ x: 130, opacity: 0, rotate: -90 }}
                whileInView={{ x: 0, opacity: 1, rotate: -90 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                GIVE CHANGE
              </motion.div>
              <motion.div
                data-no-translate="true"
                className="absolute w-[40vw] top-[13vw] left-[23.5vw] text-green-100 font-extrabold -rotate-90 z-20"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: "900",
                  fontSize: "5.5vw",
                  WebkitTextStroke: "2px #194218",
                  color: "transparent",
                }}
                initial={{ x: 150, opacity: 0, rotate: -90 }}
                whileInView={{ x: 0, opacity: 1, rotate: -90 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                FOR CHANGE
              </motion.div>
            </div>
          </div>
          {/* Scroll Arrow Component */}
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
          </Head>

          <div className="px-2 md:px-8 pt-8 select-none overflow-x-hidden">
            <div className="heading-container max-w-7xl flex flex-col md:flex-row md:items-baseline gap-6">
              <div className="max-w-2xl">
                {/* Section Header */}
                <h2 className="relative text-center">
                  {/* Stroke/Outline Layer */}
                  <span
                    className="absolute inset-0 text-center text-[3.2rem] md:text-[5.5rem]"
                    style={{
                      fontFamily: "'Noto Sans', sans-serif",
                      fontWeight: "900",
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
                    className="relative text-white text-[3.2rem] md:text-[5.5rem]"
                    style={{
                      fontFamily: "'Noto Sans', sans-serif",
                      fontWeight: "900",
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
                <div className="flex flex-col gap-4 sm:flex-col md:flex-row">
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
                      className="rounded-full py-2 px-4 relative w-full md:w-[280px]"
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
                    <div className="relative w-full">
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
                        className="rounded-full w-[full] py-2 px-4 pl-5 md:w-[200px]"
                      />
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="right-[9.5rem] md:right-[2rem]"
                        style={{
                          color: "#71767B",
                          position: "absolute",
                          height: "20px",
                          top: "22%",
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
                    "Clothing & Bedding",
                    "Hygiene & Sanitation Supplies",
                    "Monetary Donations (Essentials)",
                  ]}
                  selectedCategories={selectedSubCategories["Essentials"] || []}
                  handleCategoryClick={(subCategory) =>
                    handleSubCategoryClick("Essentials", subCategory)
                  }
                  mainCategory="Essentials"
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
                {[...filteredEssentials]
                  .sort(sortByOperatingStatusForDonation)
                  .slice(0, visibleEssentials)
                  .map((resource) => (
                    <DonationCard key={resource.id} resource={resource} />
                  ))}
              </div>
            </div>

            {/* --- Shelter & Support Services Category --- */}
            <div className="mt-4">
              <h2
                className="text-[1.25rem] font-bold mb-7 sm:leading-[1.3rem]"
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
                    "Emergency Supplies",
                    "Monetary Donations (Shelter & Support Services)",
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
                  mainCategory="Shelters"
                />
                <div className="flex gap-2 mt-4 md:mt-0 pr-[2.2vw]">
                  {visibleShelter < filteredShelter.length && (
                    <motion.button
                      onClick={handleShowMoreShelter}
                      className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                      style={{ fontFamily: "'Noto Sans', sans-serif" }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FontAwesomeIcon icon={faChevronDown} width="16px" />
                      <span>Show More</span>
                    </motion.button>
                  )}
                  {visibleShelter > 4 && (
                    <motion.button
                      onClick={handleShowLessShelter}
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
              <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full px-4">
                {[...filteredShelter]
                  .sort(sortByOperatingStatusForDonation)
                  .slice(0, visibleShelter)
                  .map((resource) => (
                    <DonationCard key={resource.id} resource={resource} />
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
                    "Medical Supplies",
                    "Monetary Donations (Medical & Health)",
                  ]}
                  selectedCategories={
                    selectedSubCategories["Medical & Health"] || []
                  }
                  handleCategoryClick={(subCategory) =>
                    handleSubCategoryClick("Medical & Health", subCategory)
                  }
                  mainCategory="Medical & Health"
                />
                <div className="flex gap-2 mt-4 md:mt-0 pr-[2.2vw]">
                  {visibleMedical < filteredMedical.length && (
                    <motion.button
                      onClick={handleShowMoreMedical}
                      className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                      style={{ fontFamily: "'Noto Sans', sans-serif" }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FontAwesomeIcon icon={faChevronDown} width="16px" />
                      <span>Show More</span>
                    </motion.button>
                  )}
                  {visibleMedical > 4 && (
                    <motion.button
                      onClick={handleShowLessMedical}
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
              <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full px-4">
                {[...filteredMedical]
                  .sort(sortByOperatingStatusForDonation)
                  .slice(0, visibleMedical)
                  .map((resource) => (
                    <DonationCard key={resource.id} resource={resource} />
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
                  categories={[
                    "Pet Supplies",
                    "Monetary Donations (Animal Support)",
                  ]}
                  selectedCategories={
                    selectedSubCategories["Animal Support"] || []
                  }
                  handleCategoryClick={(subCategory) =>
                    handleSubCategoryClick("Animal Support", subCategory)
                  }
                  mainCategory="Animal Support"
                />
                <div className="flex gap-2 mt-4 md:mt-0 pr-[2.2vw]">
                  {visibleAnimal < filteredAnimal.length && (
                    <motion.button
                      onClick={handleShowMoreAnimal}
                      className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                      style={{ fontFamily: "'Noto Sans', sans-serif" }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FontAwesomeIcon icon={faChevronDown} width="16px" />
                      <span>Show More</span>
                    </motion.button>
                  )}
                  {visibleAnimal > 4 && (
                    <motion.button
                      onClick={handleShowLessAnimal}
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
              <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full px-4">
                {[...filteredAnimal]
                  .sort(sortByOperatingStatusForDonation)
                  .slice(0, visibleAnimal)
                  .map((resource) => (
                    <DonationCard key={resource.id} resource={resource} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
