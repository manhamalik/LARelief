import React, { useState, useEffect } from "react";
import Head from "next/head";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
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
} from "@fortawesome/free-solid-svg-icons";
import "@fontsource/potta-one";
import CategoryButtons from "@/components/CategoryButtons";
import { filterResources } from "../components/filter";

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
  if (!resources || resources.length === 0)
    return <p>No resources available.</p>;

  // const resources = [
  // 	{
  // 	  title: "Union Station Homeless Services",
  // 	  address: "412 S. Raymond Avenue, Pasadena, CA",
  // 	  date: "Feb 3, 2025",
  // 	  time: "8:30AM - 5:00PM",
  // 	  image: "/images/resource-1.jpg",
  // 	},
  // 	{
  // 	  title: "La Puente Food Distribution",
  // 	  address: "1720 N. Walnut Ave, La Puente, CA",
  // 	  date: "Feb 11, 2025",
  // 	  time: "3:00PM - 6:00PM",
  // 	  image: "/images/resource-2.jpg",
  // 	},
  // 	{
  // 	  title: "Compassion Connection",
  // 	  address: "1711 N Van Ness Ave, Hollywood, CA",
  // 	  date: "Feb 4, 2025",
  // 	  time: "9:30AM - 3:00PM",
  // 	  image: "/images/resource-3.jpg",
  // 	},
  // 	{
  // 	  title: "Food Pantry Distribution",
  // 	  address: "4368 Santa Anita Ave, El Monte, CA",
  // 	  date: "Feb 4, 2025",
  // 	  time: "9:00AM - 12:00PM",
  // 	  image: "/images/resource-4.jpg",
  // 	},
  //   ];

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
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Hero Section */}
      <div
        id="hero"
        className="absolute inset-0 bg-cover bg-center h-screen z-0"
        style={{
          backgroundImage: "url('/images/image.jpg')",
        }}
      >
        {" "}
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
      </div>

      {/* Navigation Bar */}
      <NavBar />

      {/* Landing Section */}
      <div
        className="flex flex-col justify-center items-center text-center text-white relative z-10"
        style={{ height: "calc(100vh - 4.15rem)" }} // Adjust for navbar height
      >
        <h1
          className="text-6xl md:text-8xl mb-9"
          style={{
            fontFamily: "'Tilt Warp', sans-serif",
            textShadow: "0px 11.36px 11.36px rgba(0, 0, 0, 0.15)",
          }}
        >
          Discover Aid Near You
        </h1>

        <Link
          to="map"
          className="flex justify-center items-center border border-white text-white hover:text-black hover:bg-white transition-all duration-300 cursor-pointer"
          style={{
            fontFamily: "'Noto Sans', sans-serif",
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
        <div className="absolute bottom-8 w-full flex justify-center items-center">
          {/* Scroll Arrow Component */}
          <ScrollArrow to="mission" />
        </div>
      </div>

      {/* Mission Section */}
      <section
        section
        id="mission"
        className="bg-[#183917] text-white min-h-screen flex items-center justify-center px-4 md:px-8 relative overflow-hidden"
      >
        <div>
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
              {/* Title */}
              <h2
                className="mb-6"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: "900",
                  fontSize: "94px",
                  lineHeight: "1.1",
                  whiteSpace: "nowrap",
                  textShadow: "0px 10px 4px rgba(0, 0, 0, 0.25)",
                }}
              >
                OUR MISSION
              </h2>

              {/* Paragraph */}
              <p
                className="text-lg md:text-xl mb-8 leading-relaxed"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: "400",
                  fontSize: "22px",
                }}
              >
                Our mission is to stand with communities affected by the Los
                Angeles wildfires. We’re here to make it easier to find the
                resources, support, and opportunities needed to recover and
                rebuild. Whether it’s through donations, volunteering, or simply
                offering a helping hand, we believe in the power of coming
                together to make a real difference.
              </p>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  className="bg-white text-[#183917] font-bold py-3 px-8 rounded-full border-2 border-white hover:bg-[#183917] hover:text-white hover:border-white transition-all duration-300 cursor-pointer"
                  style={{
                    fontFamily: "'Noto Sans', sans-serif",
                    fontSize: "20px",
                  }}
                  onClick={() =>
                    scroller.scrollTo("map", {
                      smooth: true,
                      duration: 500,
                      offset: -72, // Adjust based on navbar height
                    })
                  }
                >
                  EXPLORE RESOURCES
                </button>

                <button
                  className="bg-transparent border-2 border-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-green-900 transition-all duration-300"
                  style={{
                    fontFamily: "'Noto Sans', sans-serif",
                    fontSize: "20px",
                  }}
                >
                  GET SUPPORT
                </button>
              </div>
            </div>

            {/* Image Content */}
            <div className="md:w-[55%] relative h-full pl-16">
              <div className="relative z-10">
                <img
                  src="/images/mission-graphic.png"
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
                  color: "#ffffff",
                  textShadow: "0px 2px 2px rgba(0, 0, 0, 0.3)",
                }}
              >
                SUPPORT
              </div>

              <div
                className="absolute top-1/2 transform -translate-y-1/2 right-[-11.75rem] text-green-100 font-extrabold -rotate-90 z-20"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: "900",
                  fontSize: "102px",
                  letterSpacing: "normal",
                  WebkitTextStroke: "1px #ffffff",
                  color: "transparent",
                }}
              >
                SUPPORT
              </div>
            </div>
          </div>
          <ScrollArrow to="map" />
        </div>
      </section>

      {/* Map Section */}
      <section
        section
        id="map"
        className="text-black py-16"
        style={{ backgroundColor: "#267738" }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Section Header */}
          <h2
            className="text-center relative z-20 flex justify-center items-center gap-2"
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontWeight: "900",
              fontSize: "94px",
              color: "white",
              textShadow: "0px 10px 4px rgba(0, 0, 0, 0.25)",
            }}
          >
            MAP
            {/* Info Icon */}
            <span className="relative group">
              <i className="fas fa-circle-info text-lg cursor-pointer text-white"></i>
              <span
                className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-max px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ whiteSpace: "nowrap" }}
              >
                This is the map and it tells you what to do
              </span>
            </span>
          </h2>

          {/* Map Content */}
          <div className="relative">
            {/* Sidebar */}
            <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-green-900 text-white p-4">
              <h3 className="text-lg font-bold mb-4">Options</h3>
              <ul className="space-y-3">
                <li>
                  <h4 className="font-semibold">Essentials</h4>
                  <ul className="pl-4">
                    <li>Food & Water</li>
                    <li>Clothing & Personal Items</li>
                    <li>Hygiene & Sanitation</li>
                    <li>Financial Support</li>
                  </ul>
                </li>
                <li>
                  <h4 className="font-semibold">Shelter & Support Services</h4>
                  <ul className="pl-4">
                    <li>Shelters & Housing Assistance</li>
                    <li>Transportation Assistance</li>
                    <li>Legal Aid</li>
                  </ul>
                </li>
                <li>
                  <h4 className="font-semibold">Medical & Health</h4>
                  <ul className="pl-4">
                    <li>Medical Aid & First Aid</li>
                    <li>Mental Health Support</li>
                  </ul>
                </li>
                <li>
                  <h4 className="font-semibold">Animal Support</h4>
                  <ul className="pl-4">
                    <li>Animal Boarding</li>
                    <li>Veterinary Care & Pet Food</li>
                  </ul>
                </li>
              </ul>
            </div>

            {/* Map */}
            <div className="ml-1/4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d423286.27420444146!2d-118.69193090298795!3d34.02016130663307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c7b96e0e5b7d%3A0x70ef1cfdf7b09ad4!2sLos%20Angeles%2C%20CA!5e0!3m2!1sen!2sus!4v1613951903575!5m2!1sen!2sus"
                width="100%"
                height="600"
                className="border-0 w-full"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
            {/* Scroll Arrow Component */}
            <ScrollArrow to="resources" />
          </div>
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
            <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center -mx-[4.8vw] w-[100vw] pr-[4vw]">
              {essentialsResources
                .slice(0, visibleResources)
                .map((resource) => (
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
                  handleSubCategoryClick(
                    "Shelter & Support Services",
                    subCategory
                  )
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
      </section>

      <section className="bg-[#183917]" style={{ height: "5vw" }}>
        <ScrollArrow to="support" />
      </section>

      {/* Support Section */}
      <section
        id="support"
        className="bg-[#267738] min-h-screen flex items-center pb-20"
      >
        <div className="bg-[#267738]">
          <div className="w-[100vw] px-4 md:px-10 flex flex-col lg:flex-row">
            {/* Text Content */}
            <div className="flex flex-col justify-center items-start lg:w-1/2 text-white text-left">
              <div className="flex flex-col justify-center items-start h-full mx-auto">
                <h2 className="text-5xl md:text-6xl font-bold mb-4 w-[400px]">
                  <span
                    className="text-[5.5rem]"
                    style={{
                      fontFamily: "'Dancing Script', cursive",
                      fontWeight: 400,
                    }}
                  >
                    Be the hope
                  </span>
                  <br />
                  <span
                    className="text-white text-[6rem]"
                    style={{
                      fontFamily: "'Noto Sans', sans-serif",
                      fontWeight: 800,
                    }}
                  >
                    SOMEONE NEEDS
                  </span>
                </h2>

                <p
                  className="text-[1.65rem] mb-8 w-[550px]"
                  style={{ fontFamily: "'Noto Sans', sans-serif" }}
                >
                  The Los Angeles community needs your help to provide
                  essentials, shelter, medical care, and support for animals
                  affected by the wildfires. Offer your time or resources to
                  support those in need!
                </p>
                <div className="flex flex-col gap-4">
                  <button
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
                </div>
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
                  <span>SUPPORT</span>
                  <span>SUPPORT</span>
                  <span>SUPPORT</span>
                  <span>SUPPORT</span>
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
          {/* Section Header */}
          <h2 className="relative text-center">
            {/* Stroke/Outline Layer */}
            <span
              className="absolute inset-0 text-center"
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontWeight: "900",
                fontSize: "5.5rem",
                top: "-0.25rem", // Slight offset upwards
                left: "-0.75rem", // Slight offset to the left
                color: "transparent",
                WebkitTextStroke: "1px #ffffff",
              }}
            >
              FAQs
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
              FAQs
            </span>
          </h2>

          {/* FAQ Dropdowns */}
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
