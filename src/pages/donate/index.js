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
  faArrowDown,
  faCalendar,
  faCalendarAlt,
  faChevronDown,
  faLaptop,
} from "@fortawesome/free-solid-svg-icons";
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

  const filterResourcesByCategory = (mainCategory) => {
    if (!resources || resources.length === 0) return [];
    return filterResources(
      resources,
      mainCategory,
      selectedSubCategories[mainCategory] || [],
      searchInput,
      startDate,
      endDate
    ).slice(0, visibleResources);
  };

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

  if (loading) return <p>Loading resources...</p>;
  if (!resources || resources.length === 0)
    return <p>No resources available.</p>;
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

      <section
        section
        id="mission"
        className="bg-[#183917] text-white min-h-screen flex items-center justify-center px-4 md:px-8 relative overflow-hidden"
      >
        {/* title text =  */}
        <div
          className="absolute top-0 left-36 bg-[#267738] rounded-br-[160px] rounded-bl-[100px] flex items-center justify-center text-white font-bold"
          style={{
            zIndex: 0,
            height: "25.5%",
            width: "50.5%",
            boxShadow: "1px 25px 2px 0 rgba(0, 0, 0, 0.3)",
            fontFamily: "'Noto Sans', sans-serif",
            textAlign: "center",
          }}
        >
          <h2 className="relative text-center">
            {/* Stroke/Outline Layer */}
            <span
              className="absolute inset-0"
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontWeight: "900",
                fontSize: "7rem",
                top: "-2rem",
                left: "-1rem",
                color: "transparent",
                WebkitTextStroke: "2px #ffffff",
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
                fontSize: "7rem",
                textShadow: "0px 10px 4px rgba(0, 0, 0, 0.25)",
                zIndex: 2,
              }}
            >
              DONATE
            </span>
          </h2>
        </div>

        {/* <section id="resources" className="py-16" style={{ backgroundColor: "#183917" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8"> */}
        {/* lighter green square with drop shadow */}
        <div
          className="absolute top-0 right-0 h-full bg-[#267738] rounded-tl-[160px] rounded-bl-[100px]"
          style={{
            zIndex: 0,
            width: "30.5%",
            boxShadow: "-25px 1px 2px 0 rgba(0, 0, 0, 0.3)",
          }}
        ></div>

        <div className="max-w-8xl mx-auto flex flex-col md:flex-row items-center gap-4 relative z-10">
          {/* Text Content */}
          <div className="md:w-[80%] lg:w-[50%] w-full z-10 flex flex-col justify-center items-center text-center h-full pl-16">
            <div
              className="relative bg-[#183917] rounded-3xl border-[0.2rem] border-white shadow-lg py-8 px-6"
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                color: "#ffffff",
                maxWidth: "90%",
              }}
            >
              {/* Circle with Star */}
              <div
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full w-16 h-16 flex items-center justify-center"
                style={{
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                }}
              >
                <i
                  className="fas fa-star text-[#183917]"
                  style={{
                    fontSize: "30px",
                  }}
                ></i>
              </div>

              {/* Text Content */}
              <p
                className="mb-2 pt-3"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: "600", // Semi-bold
                  fontSize: "1.9rem", // Custom font size
                  maxWidth: "60%", // Custom width
                  margin: "0 auto", // Center text
                }}
              >
                Help by donating to any of the
              </p>
              <p
                className=""
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: "900",
                  fontSize: "6.8rem",
                  // width: "85%",
                  margin: "0 auto",
                  lineHeight: "6.25rem",
                }}
              >
                100+
              </p>
              <p
                className=""
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: "900",
                  fontSize: "4rem",
                  maxWidth: "85%",
                  margin: "0 auto",
                  // lineHeight: "3rem",
                }}
              >
                organizations
              </p>

              <p
                className=""
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: "600", // Normal
                  fontSize: "1.9rem", // Custom font size
                  maxWidth: "75%", // Custom width
                  margin: "0 auto", // Center text
                }}
              >
                supporting Los Angeles through wildfires
              </p>
            </div>

            {/* Button */}
            <button
              className="mt-6 bg-white text-[#194218] font-bold py-3 px-8 rounded-full border-2 border-white hover:bg-[#194218] hover:text-white transition-all duration-300"
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontSize: "20px",
              }}
            >
              EXPLORE OPPORTUNITIES
            </button>
          </div>

          {/* Image Content */}
          <div className="md:w-[55%] relative h-full pl-16 z-100">
            <div className="relative z-100">
              <img
                src="/images/donate.png"
                alt="Support graphic"
                className="w-[73%] h-auto"
              />
            </div>
            {/* Vertical Texts */}
            <div
              className="absolute top-1/2 transform -translate-y-1/2 right-[-6.20rem] text-green-100 font-extrabold -rotate-90 z-20"
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontWeight: "900",
                fontSize: "102px",
                letterSpacing: "normal",
                color: "#194218",
                textShadow: "0px 2px 2px rgba(0, 0, 0, 0.3)",
              }}
            >
              GIVE CHANGE
            </div>

            <div
              className="absolute top-1/2 transform -translate-y-1/2 right-[-11.75rem] text-green-100 font-extrabold -rotate-90 z-20"
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontWeight: "900",
                fontSize: "102px",
                letterSpacing: "normal",
                WebkitTextStroke: "3px #194218",
                color: "transparent",
              }}
            >
              FOR CHANGE
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section>
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
                    "Food & Water",
                    "Clothing & Bedding",
                    "Hygiene & Sanitation Supplies",
                    "Monetary Donations (Essentials)",
                    ,
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
            </div>
            <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center -mx-[4.8vw] w-[100vw] pr-[4vw]">
              {shelterResources.slice(0, visibleResources).map((resource) => (
                <DonationCard key={resource.id} resource={resource} />
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
            </div>
            <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center -mx-[4.8vw] w-[100vw] pr-[4vw]">
              {medicalResources.slice(0, visibleResources).map((resource) => (
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
                Animal Support
              </h2>
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
            </div>
            <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center -mx-[4.8vw] w-[100vw] pr-[4vw]">
              {animalResources.slice(0, visibleResources).map((resource) => (
                <DonationCard key={resource.id} resource={resource} />
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
