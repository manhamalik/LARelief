import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const essentials = [
  {
    image: "images/wildfireguide/1-1.png",
    title: "Survival Essentials",
    description:
      "Pack water, food, a flashlight, batteries, and a multi-tool to stay safe and self-sufficient",
  },
  {
    image: "images/wildfireguide/1-2.png",
    title: "Health & Safety",
    description:
      "Bring a first aid kit, medications, N95 masks, hygiene items, and protective clothing for safety.",
  },
  {
    image: "images/wildfireguide/1-3.png",
    title: "Communication & Navigation",
    description:
      "Carry a phone, power bank, emergency radio, maps, and a whistle to stay informed and connected.",
  },
  {
    image: "images/wildfireguide/1-4.png",
    title: "Important Documents & Money",
    description:
      "Keep IDs, insurance, cash, cards, keys, and a USB with backups for identification and recovery.",
  },
  {
    image: "images/wildfireguide/1-5.png",
    title: "Emergency Clothing & Shelter",
    description:
      "Wear sturdy shoes, long sleeves, fire-resistant clothes, and bring a blanket or tent for protection.",
  },
];

const homePreparation = [
  {
    image: "images/wildfireguide/2-1.png",
    text: "Turn on all outdoor and indoor lights to improve visibility for firefighters",
  },
  {
    image: "images/wildfireguide/2-2.png",
    text: "Close all windows, doors, and vents to prevent burning debris from getting inside.",
  },
  {
    image: "images/wildfireguide/2-3.png",
    text: "Connect garden hoses to outdoor faucets so firefighters can access them.",
  },
  {
    image: "images/wildfireguide/2-4.png",
    text: "Bring in doormats and flammable outdoor furniture to reduce fire risk.",
  },
];

const personalSafety = [
  {
    image: "images/wildfireguide/3-1.png",
    text: "Wear long sleeves and pants made of heavy cotton or wool for better protection.",
  },
  {
    image: "images/wildfireguide/3-2.png",
    text: "Use leather gloves, closed-toe shoes, and head protection to shield against heat and debris.",
  },
  {
    image: "images/wildfireguide/3-3.png",
    text: "Use an N95 respirator or cover your face with a dry cotton or wool bandana for protection.",
  },
  {
    image: "images/wildfireguide/3-4.png",
    text: "Carry a headlamp and flashlight for visibility in low-light conditions.",
  },
  {
    image: "images/wildfireguide/3-5.png",
    text: "Bring essential items: car keys, wallet, ID, phone, and a spare battery.",
  },
  {
    image: "images/wildfireguide/3-6.png",
    text: "Inform an out-of-area contact of your phone number, location, and status.",
  },
];

const pet = [
  {
    image: "images/wildfireguide/4-1.png",
    text: "Secure pets in carriers for safe transport.",
  },
  {
    image: "images/wildfireguide/4-2.png",
    text: "Ensure pets have ID tags and are micro-chipped.",
  },
  {
    image: "images/wildfireguide/4-3.png",
    text: "Keep carriers by the front door with water and extra food.",
  },
];

const transport = [
  {
    image: "images/wildfireguide/5-1.png",
    text: "Turn on headlights, close windows, use inside air/AC, and tune in to local radio for updates.",
  },
  {
    image: "images/wildfireguide/5-2.png",
    text: "Drive slowly and defensively.",
  },
  {
    image: "images/wildfireguide/5-3.png",
    text: "Only evacuate on foot as a last resort.",
  },
  {
    image: "images/wildfireguide/5-4.png",
    text: "Stay inside a vehicle or building for better protection.",
  },
  {
    image: "images/wildfireguide/5-5.png",
    text: "If roads are blocked or you're trapped: ",
    detail: [
      {
        text: "Seek shelter in a car, building, or open area",
      },
      {
        text: "Stay away from vegetation",
      },
      {
        text: "Move to wide roads, parking lots, or open fields",
      },
      {
        text: "Notify an out-of-area contact of your location and status",
      },
    ],
  },
  {
    image: "images/wildfireguide/5-6.png",
    text: "Notify an out-of-area contact of your location and status.",
  },
];

const alertWays = [
  {
    image: "images/wildfireguide/a1.png",
    title: "Wildfire Tracker",
    description:
      "Track nearby wildfires to stay aware of potential threats. Use the LARelief Wildfire Tracker for real-time updates.",
    buttonText: "Wildfire Tracker",
    url: "https://larelief.onrender.com/map",
  },
  {
    image: "images/wildfireguide/a2.png",
    title: "Air Quality Tracker",
    description:
      "Monitor air quality levels to protect your health during wildfire season. Check the LARelief Air Quality Tracker for live data.",
    buttonText: "Air Quality Tracker",
    url: "https://larelief.onrender.com/map",
  },
  {
    image: "images/wildfireguide/a3.png",
    title: "LAFD Alerts & Updates",
    description:
      "Stay updated on official alerts for evacuation notices and emergencies. Visit LAFD’s official alerts for the latest information.",
    buttonText: "LAFD Alerts & Updates",
    url: "https://lafd.org/alerts",
  },
];

const restore = [
  {
    image: "images/wildfireguide/Group 416.png",
    description: "Volunteer or donate to support local environmental efforts.",
  },
  {
    image: "images/wildfireguide/Group 417.png",
    description: "Reconnect with nature by spending more time outdoors.",
  },
  {
    image: "images/wildfireguide/Group 418.png",
    description:
      "Create wild spaces in your garden or community for biodiversity.",
  },
  {
    image: "images/wildfireguide/Group 419.png",
    description: "Grow your own food to reduce reliance on mass agriculture.",
  },
  {
    image: "images/wildfireguide/Group 420.png",
    description: "Cut down on waste by composting and recycling.",
  },
  {
    image: "images/wildfireguide/Group 421.png",
    description: "Eat mainly local, organic, plant-based for sustainability.",
  },
  {
    image: "images/wildfireguide/Group 422.png",
    description: "Stop using harmful chemicals in your home and garden.",
  },
  {
    image: "images/wildfireguide/Group 423.png",
    description: "Buy less and prioritize nature over material things",
  },
  {
    image: "images/wildfireguide/Group 424.png",
    description: "Buy from ethical brands with sustainable supply chains.",
  },
];

export default function WildfireGuide() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  const [showPopup, setShowPopup] = useState(false);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-100"
      style={{
        fontFamily: "'Noto Sans', sans-serif",
        fontWeight: 900,
      }}
    >
      {/* Hero */}
      <section
        className="relative w-full h-screen flex flex-col justify-center items-center text-center"
        style={{
          backgroundImage: "url('images/wildfireguidebg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Optional overlay to darken the background for better text visibility */}
        <div className="min-h-screen flex-col md:flex-row flex bg-gray-10 text-white">
          {/* Left Half */}
          <div className="relative w-1/2 flex items-center justify-center">
            {/* Background Image behind text */}
            <img
              src="images/guideinfo.png"
              alt="Guide Info"
              className="absolute bottom-[16rem] -right-12 z-10 cursor-pointer"
              onMouseEnter={() => setShowPopup(true)}
            />

            {/* Title (positioned absolutely on top of the background image) */}
            <h1 className="absolute z-10 text-[3rem] md:text-[5rem] mb-[8.5vh] ml-3 drop-shadow-[0_5px_5px_rgba(30,30,0,0.9)] leading-[1.3]">
              WILDFIRE <br />
              GUIDE
            </h1>

            {/* Foreground Book Image */}
            <img
              src="images/guidebook.png"
              alt="Guide Book"
              className="relative w-full h-auto"
            />
          </div>
          {/* Popup */}{" "}
          {showPopup && (
            <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex justify-center items-center">
              <motion.div
                className="bg-white p-10 m-4 rounded-[3rem] max-w-md text-gray-900 text-left shadow-lg relative"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 flex justify-center items-center gap-3">
                  Your Complete Wildfire Safety Guide
                </h2>
                <p className="text-lg text-gray-700 text-center mb-4">
                  This guide helps you{" "}
                  <span className="text-red-500 font-semibold">prepare</span>,
                  <span className="text-yellow-500 font-semibold">
                    {" "}
                    stay safe
                  </span>
                  , and{" "}
                  <span className="text-green-500 font-semibold">
                    recover
                  </span>{" "}
                  from wildfires.
                </p>
                <div className="space-y-4 text-gray-700 text-lg">
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-600 text-2xl"
                    />
                    <span>Essential evacuation checklists</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-600 text-2xl"
                    />
                    <span>Real-time wildfire tracking tools</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-600 text-2xl"
                    />
                    <span>Tips to protect your home, pets, and loved ones</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-600 text-2xl"
                    />
                    <span>Post-fire recovery resources</span>
                  </div>
                </div>
                <p className="mt-6 text-center text-gray-700 text-lg">
                  📌 Explore the sections to learn more!
                </p>
                <button
                  className="mt-8 block mx-auto bg-red-500 text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-red-600 transition"
                  onClick={() => setShowPopup(false)}
                >
                  Close
                </button>
              </motion.div>
            </div>
          )}
          {/* guide info */}
          <div className="flex flex-col ustify-center pt-36 p-16">
            <div className="relative w-[55rem] h-[19rem] bg-[#817E7E] rounded-2xl shadow-lg p-6 flex items-center justify-center ">
              <div className="absolute -right-8 -top-7 w-[55rem] h-[19rem] bg-[#6A6A6A] rounded-2xl shadow-lg p-6 flex items-center justify-center">
                <div className="flex flex-col flex-wrap items-start justify-center">
                  <div className="flex flex-row items-start justify-center p-3 rounded-lg mb-2">
                    <div className="rounded-full bg-[#224D21] p-3 mr-4 mt-1" />
                    <p className="text-lg md:text-xl w-[22rem] text-start text-gray-200 font-semibold mr-2">
                      Learn how to prepare with evacuation plans and essentials.
                    </p>
                    <button
                      onClick={() => scrollToSection("wildfire-readiness")}
                      className="flex py-2 bg-[#183917] text-white font-extrabold rounded-[20px] border border-white hover:bg-lime-800 transitiont text-start text-[1.6rem] p-6"
                    >
                      WILDFIRE READINESS
                      <FontAwesomeIcon
                        icon={faCaretRight}
                        className="pl-10 pt-1"
                      />
                    </button>
                  </div>
                  <div className="flex flex-row items-start justify-center p-3 rounded-lg mb-2">
                    <div className="rounded-full bg-[#224D21] p-3 mr-4 mt-1" />
                    <p className="text-lg md:text-xl w-[22rem] text-start text-gray-200 font-semibold mr-2">
                      Stay updated on wildfire alerts and air quality.
                    </p>
                    <button
                      onClick={() => scrollToSection("wildfire-monitoring")}
                      className="flex py-2 bg-[#183917] text-white font-extrabold rounded-[20px] border border-white hover:bg-lime-800 transitiont text-start text-[1.6rem] p-6"
                    >
                      WILDFIRE MONITORING
                      <FontAwesomeIcon
                        icon={faCaretRight}
                        className="pl-10 pt-1"
                      />
                    </button>
                  </div>
                  <div className="flex flex-row items-start justify-center p-3 rounded-lg mb-2">
                    <div className="rounded-full bg-[#224D21] p-3 mr-4 mt-1" />
                    <p className="text-lg md:text-xl w-[22rem] text-start text-gray-200 font-semibold mr-2">
                      Support recovery through rebuilding and restoration
                      efforts.
                    </p>
                    <button
                      onClick={() => scrollToSection("post-fire-recovery")}
                      className="flex py-2 bg-[#183917] text-white font-extrabold rounded-[20px] border border-white hover:bg-lime-800 transitiont text-start text-[1.6rem] p-6"
                    >
                      POST-FIRE RECOVERY
                      <FontAwesomeIcon
                        icon={faCaretRight}
                        className="pl-10 pt-1"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="wildfire-readiness"
        className="w-full bg-[#183917] p-6 shadow-md"
      >
        <div className="text-white p-6 space-y-8">
          {/* Evacuation Essentials Section */}
          <h1 className="text-7xl font-bold text-center pt-12 pb-6">
            EVACUATION ESSENTIALS
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            {essentials.map((item, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <img src={item.image} alt={item.title} className="w-50 h-50" />
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wildfire Monitoring Section */}
      <section
        id="wildfire-monitoring"
        className="w-full bg-[#183917] p-6 shadow-md"
      >
        <div className="text-white p-6 space-y-8">
          {/* Evacuation Planning Section */}
          <h1 className="text-7xl font-bold text-center pt-12 pb-6">
            EVACUATION PLANNING
          </h1>
          <div className="space-y-6">
            <Section
              title="Home Preparation"
              items={homePreparation}
              image="images/wildfireguide/House.png"
            />
            <Section
              title="Personal Safety"
              items={personalSafety}
              image="images/wildfireguide/personal safety.png"
            />
            <Section
              title="Pet Safety & Evacuation"
              items={pet}
              image="images/wildfireguide/Animal shelter.png"
            />
            <Section
              title="Evacuation & Transport"
              items={transport}
              image="images/wildfireguide/Transportation.png"
            />
          </div>
        </div>
        <div className="text-white p-6 space-y-8">
          {/* LARELIEF~ */}
          <div
            className="relative flex flex-col items-center justify-center text-center text-white min-h-[50vh]"
            style={{
              backgroundImage: "url('images/ㄴㄱ.png')",
              backgroundSize: 1300,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className=" flex flex-col flex-wrap items-center justify-center">
              <h1 className="text-[1.8rem] font-bold uppercase text-center w-[75rem] p-6">
                Use the{" "}
                <img
                  src="images/larelieflogo.png"
                  alt="LARelief"
                  className="w-48 inline mb-4 ml-2"
                />{" "}
                website to stay updated on nearby wildfires and available
                resources
              </h1>
            </div>
          </div>

          {/* Ways to Stay Alert Section */}
          <h2 className="text-6xl font-bold text-center pb-5">
            <span className="text-orange-400">3</span> Ways to Stay Alert About
            Wildfires
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center min-h-[50vh]">
            {alertWays.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-4 p-6"
              >
                <div className="relative">
                  <span className="absolute -top-2 -left-5 text-md font-bold">
                    0{index + 1}
                  </span>
                  <img
                    src="images/numberCircle.png"
                    alt="fire"
                    className="absolute w-10 h-10 -top-4 -left-8"
                  />
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-40 h-40 bg-white p-4 rounded-full"
                  />
                </div>
                <p className="text-gray-300">{item.description}</p>
                <button
                  onClick={() => (window.location.href = item.url)}
                  className="flex py-2 bg-[#183917] text-white font-extrabold rounded-[15px] border border-white hover:bg-lime-800 transitiont text-start text-[1rem] p-6"
                >
                  {item.buttonText}
                  <FontAwesomeIcon icon={faCaretRight} className="pl-10 pt-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Post-Fire Recovery Section */}

      <section
        id="post-fire-recovery"
        className="w-full bg-[#183917] p-6 shadow-md min-h-screen"
      >
        <div className="text-white p-6 space-y-8">
          <h2 className="text-6xl pl-40 pr-40 font-bold text-center leading-[1.2] pb-5">
            <span className="text-orange-400">9</span> Ways to Restore Nature &
            Support Your Community
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {restore.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-4 p-6"
              >
                <div className="relative">
                  <span className="absolute -top-2 -left-5 text-md font-bold">
                    0{index + 1}
                  </span>
                  <img
                    src="images/numberCircle.png"
                    alt="fire"
                    className="absolute w-10 h-10 -top-4 -left-8"
                  />
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-40 h-40 bg-white p-4 rounded-full"
                  />
                </div>
                <p className="w-[15rem]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const Section = ({ title, items, image }) => (
  <div className="space-y-6">
    <div className="text-center">
      <div className="flex items-center">
        <div className="flex-1 border-2 rounded-full border-white"></div>
        <img src={image} alt="title" className="h-24 mr-3 ml-3" />

        <div className="flex-1 border-2 rounded-full border-white"></div>
      </div>
      <h2 className="text-3xl font-bold mx-4 text-[#8FF4AC]">{title}</h2>
    </div>
    <ul className="mt-4 space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <img src={item.image} alt="icon" className="w-18 h-18" />
          <span className="text-2xl mt-5 ml-4">{item.text}</span>
        </li>
      ))}
    </ul>
  </div>
);
