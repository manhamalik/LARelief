import React from "react";
import Head from "next/head";
import NavBar from "@/components/NavBar";
import ScrollArrow from "@/components/ScrollArrow";
import ResourceCard from "@/components/ResourceCard";
import Dropdown from "@/components/Dropdown";
import { Link } from "react-scroll";
import { scroller } from "react-scroll";
import { Link as ScrollLink } from "react-scroll";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

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
        
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400&family=Noto+Sans:wght@400;800&display=swap" rel="stylesheet"></link>
		<link
		  href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700;900&display=swap"
		  rel="stylesheet"
		/>

      </Head>

{/* Map Section */}
<section section id="map" className="text-black py-16" style={{ backgroundColor: "#267738" }}>
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


    </div>
  );
}