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

  // Compute full filtered arrays for each category (without slicing)
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
        className="bg-[#183917] text-white min-h-screen flex items-center justify-center px-4 md:px-8 relative overflow-hidden"
      >
        <div>
          {/* Title Text */}
          <div
            className="absolute top-0 left-[13vw] bg-[#227541] rounded-br-[7vw] rounded-bl-[7vw] flex items-center justify-center text-white font-bold"
            style={{
              zIndex: 0,
              height: "10vw",
              width: "30vw",
              boxShadow: "-18px 0 2px 0 rgba(0, 0, 0, 0.3)",
              fontFamily: "'Noto Sans', sans-serif",
              textAlign: "center",
            }}
          >
            <h2 className="relative text-center">
              <span
                className="absolute inset-0"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: "900",
                  fontSize: "5vw",
                  top: "-2rem",
                  left: "-1rem",
                  color: "transparent",
                  WebkitTextStroke: "1px #ffffff",
                  zIndex: 1,
                }}
              >
                DONATE
              </span>
              <span
                className="relative text-white"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: "900",
                  fontSize: "5vw",
                  textShadow: "0px 10px 4px rgba(0, 0, 0, 0.25)",
                  zIndex: 2,
                }}
              >
                DONATE
              </span>
            </h2>
          </div>

          {/* Lighter Green Square on Right */}
          <div
            className="absolute top-12 right-0 h-full bg-[#267738] rounded-tl-[13vw] rounded-bl-[13vw]"
            style={{
              zIndex: 0,
              width: "30.5%",
              height: "90vh",
              boxShadow: "-25px 1px 2px 0 rgba(0, 0, 0, 0.3)",
            }}
          ></div>

          <div className="max-w-8xl mx-auto flex flex-col md:flex-row items-center gap-4 relative z-10">
            {/* Text Content */}
            <div className="w-[100vw] z-10 flex flex-col justify-center items-center text-center h-full">
              <div
                className="relative bg-[#183917] right-[3vw] rounded-[2.5vw] border-[0.2rem] border-white shadow-lg mt-[8vw] py-4 px-0 w-[27vw]"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  color: "#ffffff",
                  maxWidth: "90%",
                }}
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
                <p
                  style={{
                    fontFamily: "'Noto Sans', sans-serif",
                    fontWeight: "900",
                    fontSize: "5vw",
                    margin: "0 auto",
                    paddingTop: "2.25vw",
                    lineHeight: "1rem",
                  }}
                >
                  100+
                </p>
                <p
                  style={{
                    fontFamily: "'Noto Sans', sans-serif",
                    fontWeight: "900",
                    fontSize: "3vw",
                    maxWidth: "85%",
                    margin: "0 auto",
                    paddingTop: "1.25vw",
                    lineHeight: "5vw",
                  }}
                >
                  organizations
                </p>
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
              </div>
              {/* EXPLORE OPPORTUNITIES Button */}
              <button
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
              >
                EXPLORE OPPORTUNITIES
              </button>
            </div>

            {/* Image Content - Support Image */}
            <div className="relative h-full right-[15vw] z-1">
              <div className="relative z-50">
                <img
                  src="/images/donate.png"
                  alt="Support graphic"
                  className="w-[60vw] h-auto"
                />
              </div>
              {/* Vertical Texts */}
              <div
                className="absolute w-[40vw] top-[14vw] left-[18vw] text-green-100 font-extrabold -rotate-90 z-20"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: "900",
                  fontSize: "5.5vw",
                  color: "#194218",
                  textShadow: "0px 2px 2px rgba(0, 0, 0, 0.3)",
                }}
              >
                GIVE CHANGE
              </div>
              <div
                className="absolute w-[40vw] top-[13vw] left-[23.5vw] text-green-100 font-extrabold -rotate-90 z-20"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: "900",
                  fontSize: "5.5vw",
                  WebkitTextStroke: "2px #194218",
                  color: "transparent",
                }}
              >
                FOR CHANGE
              </div>
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
          }}
        >
          <Head>
            <title>LA Relief - Discover Aid Near You</title>
            <meta name="description" content="Find aid and resources near you for emergencies and support." />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link
              href="https://fonts.googleapis.com/css2?family=Tilt+Warp:wght@400;700&family=Noto+Sans:wght@700&display=swap"
              rel="stylesheet"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700;900&display=swap"
              rel="stylesheet"
            />
          </Head>

          <div className="px-8 pt-8 select-none overflow-x-hidden">
            <div className="heading-container max-w-7xl flex flex-col md:flex-row md:items-baseline gap-6">
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
                  <div className="search-filter-containers relative flex items-center">
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
                  </div>
                  <div className="date-picker-container relative flex gap-4 items-center">
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
                  </div>
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
            <div className="flex items-center justify-between w-full mt-4">
              <div className="flex items-center gap-4">
                <h2
                  className="text-xl font-bold"
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
              </div>
              <div className="flex gap-2">
                {visibleEssentials < filteredEssentials.length && (
                  <button
                    onClick={handleShowMoreEssentials}
                    className="bg-white text-black font-bold py-1.5 px-3 rounded-full flex gap-1 items-center"
                    style={{ fontFamily: "'Noto Sans', sans-serif" }}
                  >
                    <FontAwesomeIcon icon={faChevronDown} width="16px" />
                    <span>Show More</span>
                  </button>
                )}
                {visibleEssentials > 4 && (
                  <button
                    onClick={handleShowLessEssentials}
                    className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                    style={{ fontFamily: "'Noto Sans', sans-serif" }}
                  >
                    <FontAwesomeIcon icon={faChevronUp} width="16px" />
                    <span>Show Less</span>
                  </button>
                )}
              </div>
            </div>
            <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center -mx-[4.8vw] w-[100vw] pr-[4vw]">
              {filteredEssentials.slice(0, visibleEssentials).map((resource) => (
                <DonationCard key={resource.id} resource={resource} />
              ))}
            </div>

           {/* Shelter & Support Services Category */}
           <div className="flex flex-wrap gap-4 mt-4 items-center">
              <h2
                className="text-xl font-bold"
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
              <CategoryButtons
                categories={[
                  "Emergency Supplies",
                  "Monetary Donations (Shelter & Support Services)",
                ]}
                selectedCategories={selectedSubCategories["Shelter & Support Services"] || []}
                handleCategoryClick={(subCategory) =>
                  handleSubCategoryClick("Shelter & Support Services", subCategory)
                }
                mainCategory="Shelters"
              />
              <div className="w-full flex justify-end gap-2">
                {visibleShelter < filteredShelter.length && (
                  <button
                    onClick={handleShowMoreShelter}
                    className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                    style={{ fontFamily: "'Noto Sans', sans-serif" }}
                  >
                    <FontAwesomeIcon icon={faChevronDown} width="16px" />
                    <span>Show More</span>
                  </button>
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
            <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center -mx-[4.8vw] w-[100vw] pr-[4vw]">
              {filteredShelter.slice(0, visibleShelter).map((resource) => (
                <DonationCard key={resource.id} resource={resource} />
              ))}
            </div>

            {/* Medical & Health Category */}
            <div className="flex items-center justify-between w-full mt-4">
              <div className="flex items-center gap-4">
                <h2
                  className="text-xl font-bold"
                  style={{
                    fontFamily: "'Potta One', normal",
                    fontSize: "50px",
                    color: "#ffffff",
                    marginTop: "15px",
                    marginBottom: "20px",
                  }}
                >
                  Medical & Health
                </h2>
                <CategoryButtons
                  categories={[
                    "Medical Supplies",
                    "Monetary Donations (Medical & Health)",
                  ]}
                  selectedCategories={selectedSubCategories["Medical & Health"] || []}
                  handleCategoryClick={(subCategory) =>
                    handleSubCategoryClick("Medical & Health", subCategory)
                  }
                  mainCategory="Medical & Health"
                />
              </div>
              <div className="flex gap-2">
                {visibleMedical < filteredMedical.length && (
                  <button
                    onClick={handleShowMoreMedical}
                    className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                    style={{ fontFamily: "'Noto Sans', sans-serif" }}
                  >
                    <FontAwesomeIcon icon={faChevronDown} width="16px" />
                    <span>Show More</span>
                  </button>
                )}
                {visibleMedical > 4 && (
                  <button
                    onClick={handleShowLessMedical}
                    className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                    style={{ fontFamily: "'Noto Sans', sans-serif" }}
                  >
                    <FontAwesomeIcon icon={faChevronUp} width="16px" />
                    <span>Show Less</span>
                  </button>
                )}
              </div>
            </div>
            <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center -mx-[4.8vw] w-[100vw] pr-[4vw]">
              {filteredMedical.slice(0, visibleMedical).map((resource) => (
                <DonationCard key={resource.id} resource={resource} />
              ))}
            </div>

            {/* Animal Support Category */}
            <div className="flex items-center justify-between w-full mt-4">
              <div className="flex items-center gap-4">
                <h2
                  className="text-xl font-bold"
                  style={{
                    fontFamily: "'Potta One', normal",
                    fontSize: "50px",
                    color: "#ffffff",
                    marginTop: "15px",
                    marginBottom: "20px",
                  }}
                >
                  Animal Support
                </h2>
                <CategoryButtons
                  categories={[
                    "Pet Supplies",
                    "Monetary Donations (Animal Support)",
                  ]}
                  selectedCategories={selectedSubCategories["Animal Support"] || []}
                  handleCategoryClick={(subCategory) =>
                    handleSubCategoryClick("Animal Support", subCategory)
                  }
                  mainCategory="Animal Support"
                />
              </div>
              <div className="flex gap-2">
                {visibleAnimal < filteredAnimal.length && (
                  <button
                    onClick={handleShowMoreAnimal}
                    className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                    style={{ fontFamily: "'Noto Sans', sans-serif" }}
                  >
                    <FontAwesomeIcon icon={faChevronDown} width="16px" />
                    <span>Show More</span>
                  </button>
                )}
                {visibleAnimal > 4 && (
                  <button
                    onClick={handleShowLessAnimal}
                    className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                    style={{ fontFamily: "'Noto Sans', sans-serif" }}
                  >
                    <FontAwesomeIcon icon={faChevronUp} width="16px" />
                    <span>Show Less</span>
                  </button>
                )}
              </div>
            </div>
            <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center -mx-[4.8vw] w-[100vw] pr-[4vw]">
              {filteredAnimal.slice(0, visibleAnimal).map((resource) => (
                <DonationCard key={resource.id} resource={resource} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
