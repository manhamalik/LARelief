import React, { useState, useEffect } from "react";
import Head from "next/head";
import { scroller } from "react-scroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ScrollArrow from "@/components/ScrollArrow";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  faMagnifyingGlass,
  faArrowDown,
  faCalendar,
  faCalendarAlt,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import VolunteerCard from "@/components/VolunteerCard";
import "@fontsource/potta-one";
import CategoryButtons from "@/components/CategoryButtons";
import { filterResources } from "@/components/filter";

export default function Home() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [visibleResources, setVisibleResources] = useState(4);

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.includes(category)
        ? prevSelectedCategories.filter((c) => c !== category)
        : [...prevSelectedCategories, category]
    );
    setVisibleResources(4); // Reset visible resources to initial value
  };

  const handleSubCategoryClick = (mainCategory, subCategory) => {
    setSelectedSubCategories((prevSelectedSubCategories) => {
      const subCategoriesForCategory =
        prevSelectedSubCategories[mainCategory] || [];
      const updatedSubCategories = subCategoriesForCategory.includes(
        subCategory
      )
        ? subCategoriesForCategory.filter((sc) => sc !== subCategory) // Remove if clicked again
        : [...subCategoriesForCategory, subCategory]; // Add if not already selected
      return {
        ...prevSelectedSubCategories,
        [mainCategory]: updatedSubCategories,
      };
    });

    setVisibleResources(4); // Reset visible resources to initial value
  };

  const clearDateSelection = () => {
    setStartDate(null);
    setEndDate(null);
  };

  useEffect(() => {
    console.log("Filtered resources:", filterResources);

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

  const handleShowMore = () => {
    setVisibleResources((prevVisibleResources) => prevVisibleResources + 12);
  };

  const numberOfRows = Math.ceil(visibleResources / 4);

  const essentialsResources = filterResources(
    resources,
    "Essentials",
    selectedSubCategories["Essentials"] || [],
    searchInput,
    startDate,
    endDate
  ).slice(0, visibleResources);

  const shelterResources = filterResources(
    resources,
    "Shelter & Support Services",
    selectedSubCategories["Shelter & Support Services"] || [],
    searchInput,
    startDate,
    endDate
  ).slice(0, visibleResources);

  const medicalResources = filterResources(
    resources,
    "Medical & Health",
    selectedSubCategories["Medical & Health"] || [],
    searchInput,
    startDate,
    endDate
  ).slice(0, visibleResources);

  const animalResources = filterResources(
    resources,
    "Animal Support",
    selectedSubCategories["Animal Support"] || [],
    searchInput,
    startDate,
    endDate
  ).slice(0, visibleResources);

  // if (loading) return <p>Loading resources...</p>;
  // if (!resources || resources.length === 0)
  //   return <p>No resources available.</p>;

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
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <section
      id="mission"
      className="bg-[#183917] text-white min-h-screen flex items-center justify-center px-4 px-8 relative overflow-hidden"
    >
      
      {/* --- The “road” background image --- */}
      <img
        src="/images/road.png"
        alt="Green road shape"
        className="absolute bottom-0 left-0 w-[full] md:h-auto object-cover"
        style={{ zIndex: 0 }}
      />

      {/* --- Large “VOLUNTEER” label in top/left corner with outline --- */}
      <div
        className="absolute top-0 left-0 bg-[#227541] rounded-br-[12vw] flex items-center justify-center"
        style={{
          zIndex: 1,
          height: "10vw",
          width: "43vw",
          // boxShadow: "-18px 0 2px 0 rgba(0, 0, 0, 0.3)",
          fontFamily: "'Noto Sans', sans-serif",
          textAlign: "center",
        }}
      >
        <h2 className="relative text-center font-bold text-white">
          {/* Stroke/Outline layer */}
          <span
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
          >
            VOLUNTEER
          </span>
          {/* Filled text layer */}
          <span
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
        </h2>
      </div>

      {/* --- Main Content Row --- */}
      <div className="relative z-10 flex flex-col md:flex-row items-center w-full max-w-7xl mt-[4vw] ml-[0vw]">
      
        <div className="w-full mt-0">
          <img
            src="/images/volunteer.png"
            alt="Volunteers"
            className="w-[70vw]"
          />
        </div>

        {/* -- Right Side: Text + Button -- */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left px-4">
          <h3
            className=""
            style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: "400",
              fontSize: "1.5vw",
              maxWidth: "100%",
              margin: "0 auto",  
            textAlign: "center"
            }}
          >
            Join a community of
          </h3>
          <h3
            className="font-extrabold mt-2"
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontWeight: "900",
              fontSize: "5.5vw",
              margin: "0 auto",
              paddingTop: "2.25vw",
              lineHeight: "1rem",
              textAlign: "center"
            }}
          >
            10,000+
          </h3>
          <p
            className=""
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontWeight: "900",
              fontSize: "5vw",
              maxWidth: "85%",
              margin: "0 auto",
              // paddingLeft: "0vw",
              paddingTop: "2.5vw",
              paddingRight: "5vw",
              lineHeight: "4vw",
              textAlign: "center"
  
            }}
          >
            volunteers
          </p>
          <p
            className="-mt-3vw"
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontWeight: "400", // Normal
              fontSize: "1.5vw", // Custom font size
              maxWidth: "46%", // Custom width
              margin: "0 auto", // Center text
              padding: "0vw",
              paddingTop: "0.5vw",
              textAlign: "center",
              lineHeight: "2vw",
              // paddingTop: "-5vw",
            }}
          >
            making a difference in Los Angeles
          </p>
          <button
              className="flex justify-center mt-6 bg-white text-[#194218] right-[9vw] ml-[5vw] font-bold py-3 px-8 rounded-full border-2 border-white hover:bg-[#194218] hover:text-white transition-all duration-300"
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontSize: "1.5vw",
              }}
            >
              EXPLORE OPPORTUNITIES
            </button>
        </div>
      </div>
    </section>
    <section className="bg-[#183917]" style={{ height: "2vw" }}>
    <ScrollArrow to="resources"  />
    </section>
      {/* Resources Section */}
      <section section id="resources">
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

          {/* Header */}
          <div className="px-8 pt-8 select-none">
            <div
              className="heading-container max-w-7xl flex flex-col md:flex-row
          md:items-baseline
          gap-6"
            >
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
                      placeholder="Name of Organization"
                      onChange={handleSearch}
                      value={searchInput}
                      className="rounded-full py-2 px-6"
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
            <div className="flex flex-wrap gap-4 mt-0 items-center justify-between">
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
                    "Food & Water Distribution",
                    "Clothing & Supplies Distribution",
                    "Donation Sorting & Packing",
                  ]}
                  selectedCategories={selectedSubCategories["Essentials"] || []}
                  handleCategoryClick={(subCategory) =>
                    handleSubCategoryClick("Essentials", subCategory)
                  }
                  mainCategory="Essentials"
                />
              </div>
              {visibleResources < essentialsResources.length && (
                <button
                  onClick={handleShowMore}
                  className="bg-white text-black font-bold py-1.5 px-4 rounded-full mt-3 flex flex-wrap gap-1 items-center"
                  style={{
                    fontFamily: "'Noto Sans', sans-serif",
                    position: "flex",
                    alignItems: "center",
                  }}
                >
                  <FontAwesomeIcon icon={faChevronDown} width="16px" />
                  <span>Show More</span>
                </button>
              )}
            </div>
            <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center -mx-[4.8vw] w-[100vw] pr-[4vw]">
              {essentialsResources
                .slice(0, visibleResources)
                .map((resource) => (
                  <VolunteerCard key={resource.id} resource={resource} />
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
                  "Shelter Assistance",
                  "Transporation & Delivery Support",
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
                mainCategory="Shelter"
              />
            </div>
            <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center -mx-[4.8vw] w-[100vw] pr-[4vw]">
              {shelterResources.slice(0, visibleResources).map((resource) => (
                <VolunteerCard key={resource.id} resource={resource} />
              ))}
            </div>

            {/* Medical & Health Category */}
            <div className="flex flex-wrap gap-4 mt-4 items-center ">
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
                categories={["Medical Aid Support", "Mental Health Support"]}
                selectedCategories={
                  selectedSubCategories["Medical & Health"] || []
                }
                handleCategoryClick={(subCategory) =>
                  handleSubCategoryClick("Medical & Health", subCategory)
                }
                mainCategory="Medical & Health"
              />
            </div>
            <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center -mx-[4.8vw] w-[100vw] pr-[4vw]">
              {medicalResources.slice(0, visibleResources).map((resource) => (
                <VolunteerCard key={resource.id} resource={resource} />
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
                Animal Support
              </h2>
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
            </div>
            <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center -mx-[4.8vw] w-[100vw] pr-[4vw]">
              {animalResources.slice(0, visibleResources).map((resource) => (
                <VolunteerCard key={resource.id} resource={resource} />
              ))}
            </div>

            {numberOfRows > 3 && numberOfRows % 2 === 1 && (
              <button
                onClick={handleShowMore}
                className="bg-blue-500 text-white font-bold py-2 px-6 rounded-full mt-4 flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faArrowDown} size="2x" />
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}