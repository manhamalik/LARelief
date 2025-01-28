import React from "react";
import Head from "next/head";
import { scroller } from "react-scroll";
import ResourceCard from "@/components/ResourceCard";
import ScrollArrow from "@/components/ScrollArrow";
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

<section section id="mission" className="bg-[#183917] text-white min-h-screen flex items-center justify-center px-4 md:px-8 relative overflow-hidden">
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
    boxShadow: "-25px 1px 2px 0 rgba(0, 0, 0, 0.3)"
  }}>
  </div>

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
  <section id="resources" className="py-16" style={{ backgroundColor: "#183917" }}>
                <div className="max-w-7xl mx-auto px-4 md:px-8">
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

                    <div className="flex justify-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl">
                            {resources.map((resource, index) => (
                                <ResourceCard key={index} resource={resource} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
