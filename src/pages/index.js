import React from "react";
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
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const resources = [
    {
      title: "Union Station Homeless Services",
      address: "412 S. Raymond Avenue, Pasadena, CA",
      date: "Feb 3, 2025",
      time: "8:30AM - 5:00PM",
      image: "/images/resource-1.jpg",
    },
    {
      title: "La Puente Food Distribution",
      address: "1720 N. Walnut Ave, La Puente, CA",
      date: "Feb 11, 2025",
      time: "3:00PM - 6:00PM",
      image: "/images/resource-2.jpg",
    },
    {
      title: "Compassion Connection",
      address: "1711 N Van Ness Ave, Hollywood, CA",
      date: "Feb 4, 2025",
      time: "9:30AM - 3:00PM",
      image: "/images/resource-3.jpg",
    },
    {
      title: "Food Pantry Distribution",
      address: "4368 Santa Anita Ave, El Monte, CA",
      date: "Feb 4, 2025",
      time: "9:00AM - 12:00PM",
      image: "/images/resource-4.jpg",
    },
  ];

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
        {/* Scroll Arrow Component */}
        <ScrollArrow to="map" />
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
      <section
        id="resources"
        className="py-16"
        style={{ backgroundColor: "#183917" }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Section Header */}
          <h2
            className="text-center text-white mb-12"
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontWeight: "900",
              fontSize: "64px",
              textShadow: "0px 10px 4px rgba(0, 0, 0, 0.25)",
            }}
          >
            SEARCH FOR RESOURCES
          </h2>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button className="bg-white text-[#183917] font-bold py-2 px-6 rounded-full">
              Food & Water
            </button>
            <button className="bg-white text-[#183917] font-bold py-2 px-6 rounded-full">
              Clothing & Personal Items
            </button>
            <button className="bg-white text-[#183917] font-bold py-2 px-6 rounded-full">
              Hygiene & Sanitation
            </button>
            <button className="bg-white text-[#183917] font-bold py-2 px-6 rounded-full">
              Financial Support
            </button>
          </div>
          {/* Resource Cards */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl">
              {resources.map((resource, index) => (
                <ResourceCard key={index} resource={resource} />
              ))}
            </div>
          </div>
        </div>
        {/* Scroll Arrow Component */}
        <ScrollArrow to="support" />
      </section>

      {/* Support Section */}
      <section
        id="support"
        className="bg-[#267738] min-h-screen flex items-center"
      >
        <div className="w-full px-4 md:px-0 flex flex-col lg:flex-row">
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
                The Los Angeles community needs your help to provide essentials,
                shelter, medical care, and support for animals affected by the
                wildfires. Offer your time or resources to support those in
                need!
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
