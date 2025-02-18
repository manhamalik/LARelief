import React, {
  useState,
  useEffect,
  lazy,
  Suspense,
  startTransition,
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

const MissionSection = lazy(() => import("@/components/MissionSection"));
const SupportSection = lazy(() => import("@/components/SupportSection"));
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

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

  // Create full filtered arrays per category and then slice using the corresponding visibleCounts.
  const filteredEssentials = filterResources(
    resources,
    "Essentials",
    selectedSubCategories["Essentials"] || [],
    searchInput,
    startDate,
    endDate
  );
  const essentialsResources = filteredEssentials.slice(
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
  const shelterResources = filteredShelter.slice(
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
  const medicalResources = filteredMedical.slice(
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
  const animalResources = filteredAnimal.slice(
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
        <Image
          src="/images/imagenew.jpg"
          alt="Background Image"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-40"></div>

        {/* Landing Content (Heading, Explore Button) */}
        <div
          className="absolute inset-0 flex flex-col justify-center items-center text-center text-white"
          style={{ paddingTop: "4.15rem" }}
        >
          <h1
            data-no-translate="true"
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
        </div>

        {/* Scroll Arrow */}
        <div className="absolute bottom-8 w-full flex justify-center items-center">
          <ScrollArrow to="mission" />
        </div>
      </div>

      {/* Mission Section wrapped in its own Suspense boundary */}
      <Suspense fallback={null}>
        <MissionSection />
      </Suspense>

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

            {/* --- Essentials Category --- */}
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
              <div className="flex gap-2 mt-3">
                {visibleCounts["Essentials"] < filteredEssentials.length && (
                  <button
                    onClick={() => handleShowMore("Essentials")}
                    className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                    style={{ fontFamily: "'Noto Sans', sans-serif" }}
                  >
                    <FontAwesomeIcon icon={faChevronDown} width="16px" />
                    <span>Show More</span>
                  </button>
                )}
                {visibleCounts["Essentials"] > defaultVisible && (
                  <button
                    onClick={() => handleShowLess("Essentials")}
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
              {essentialsResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>

            {/* --- Shelter & Support Services Category --- */}
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
            <div className="flex gap-2 mt-3">
              {visibleCounts["Shelter & Support Services"] <
                filteredShelter.length && (
                <button
                  onClick={() => handleShowMore("Shelter & Support Services")}
                  className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                  style={{ fontFamily: "'Noto Sans', sans-serif" }}
                >
                  <FontAwesomeIcon icon={faChevronDown} width="16px" />
                  <span>Show More</span>
                </button>
              )}
              {visibleCounts["Shelter & Support Services"] > defaultVisible && (
                <button
                  onClick={() => handleShowLess("Shelter & Support Services")}
                  className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                  style={{ fontFamily: "'Noto Sans', sans-serif" }}
                >
                  <FontAwesomeIcon icon={faChevronUp} width="16px" />
                  <span>Show Less</span>
                </button>
              )}
            </div>
            <div className="resource-cards mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center -mx-[4.8vw] w-[100vw] pr-[4vw]">
              {shelterResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>

            {/* --- Medical & Health Category --- */}
            <div className="flex flex-wrap gap-4 mt-4 items-center justify-between">
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
              <div className="flex gap-2">
                {visibleCounts["Medical & Health"] < filteredMedical.length && (
                  <button
                    onClick={() => handleShowMore("Medical & Health")}
                    className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                    style={{ fontFamily: "'Noto Sans', sans-serif" }}
                  >
                    <FontAwesomeIcon icon={faChevronDown} width="16px" />
                    <span>Show More</span>
                  </button>
                )}
                {visibleCounts["Medical & Health"] > defaultVisible && (
                  <button
                    onClick={() => handleShowLess("Medical & Health")}
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
              {medicalResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>

            {/* --- Animal Support Category --- */}
            <div className="flex flex-wrap gap-4 mt-4 items-center justify-between">
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
              <div className="flex gap-2">
                {visibleCounts["Animal Support"] < filteredAnimal.length && (
                  <button
                    onClick={() => handleShowMore("Animal Support")}
                    className="bg-white text-black font-bold py-1.5 px-4 rounded-full flex gap-1 items-center"
                    style={{ fontFamily: "'Noto Sans', sans-serif" }}
                  >
                    <FontAwesomeIcon icon={faChevronDown} width="16px" />
                    <span>Show More</span>
                  </button>
                )}
                {visibleCounts["Animal Support"] > defaultVisible && (
                  <button
                    onClick={() => handleShowLess("Animal Support")}
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
              {animalResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#183917]" style={{ height: "5vw" }}>
        <ScrollArrow to="support" />
      </section>

      {/* Support Section wrapped in its own Suspense boundary */}
      <Suspense fallback={null}>
        <SupportSection />
      </Suspense>

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
