import React, { useState, useEffect } from "react";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  faMagnifyingGlass,
  faArrowDown,
  faCalendar,
  faCalendarAlt,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import ResourceCard from "@/components/ResourceCard";
import "@fontsource/potta-one";
import CategoryButtons from "@/components/CategoryButtons";
import { filterResources } from "../components/filter";

const Search = () => {
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
        const response = await fetch("/api/resource-list");
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
  if (!resources || resources.length === 0) return <p>No resources available.</p>;
  


  return (
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
        <div
          className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center -mx-[4.8vw] w-[100vw] pr-[4vw]"
        >
          {essentialsResources.slice(0, visibleResources).map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
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
              "Shelters & Housing Assistance",
              "Transportation Assistance",
              "Legal Aid",
            ]}
            selectedCategories={
              selectedSubCategories["Shelter & Support Services"] || []
            }
            handleCategoryClick={(subCategory) =>
              handleSubCategoryClick("Shelter & Support Services", subCategory)
            }
            mainCategory="Shelter & Support Services"
          />
        </div>
        <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center -mx-[4.8vw] w-[100vw] pr-[4vw]">
          {shelterResources.slice(0, visibleResources).map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
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
            categories={["Medical Aid & First Aid", "Mental Health Support"]}
            selectedCategories={selectedSubCategories["Medical & Health"] || []}
            handleCategoryClick={(subCategory) =>
              handleSubCategoryClick("Medical & Health", subCategory)
            }
            mainCategory="Medical & Health"
          />
        </div>
        <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center -mx-[4.8vw] w-[100vw] pr-[4vw]">
          {medicalResources.slice(0, visibleResources).map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
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
            categories={["Animal Boarding", "Veterinary Care & Pet Food"]}
            selectedCategories={selectedSubCategories["Animal Support"] || []}
            handleCategoryClick={(subCategory) =>
              handleSubCategoryClick("Animal Support", subCategory)
            }
            mainCategory="Animal Support"
          />
        </div>
        <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center -mx-[4.8vw] w-[100vw] pr-[4vw]">
          {animalResources.slice(0, visibleResources).map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
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
  );
};

export default Search;