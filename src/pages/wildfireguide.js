import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { faAngleRight, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const essentials = [
  {
    image: "/images/water.png",
    title: "Survival Essentials",
    description:
      "Pack water, food, a flashlight, batteries, and a multi-tool to stay safe and self-sufficient",
  },
  {
    image: "/images/health.png",
    title: "Health & Safety",
    description:
      "Bring a first aid kit, medications, N95 masks, hygiene items, and protective clothing for safety.",
  },
  {
    image: "/images/communication.png",
    title: "Communication & Navigation",
    description:
      "Carry a phone, power bank, emergency radio, maps, and a whistle to stay informed and connected.",
  },
  {
    image: "/images/documents.png",
    title: "Important Documents & Money",
    description:
      "Keep IDs, insurance, cash, cards, keys, and a USB with backups for identification and recovery.",
  },
  {
    image: "/images/clothing.png",
    title: "Emergency Clothing & Shelter",
    description:
      "Wear sturdy shoes, long sleeves, fire-resistant clothes, and bring a blanket or tent for protection.",
  },
];

const homePreparation = [
  {
    image: "/images/lights.png",
    text: "Turn on all outdoor and indoor lights to improve visibility for firefighters",
  },
  {
    image: "/images/doors.png",
    text: "Close all windows, doors, and vents to prevent burning debris from getting inside.",
  },
  {
    image: "/images/hose.png",
    text: "Connect garden hoses to outdoor faucets so firefighters can access them.",
  },
  {
    image: "/images/furniture.png",
    text: "Bring in doormats and flammable outdoor furniture to reduce fire risk.",
  },
];

const personalSafety = [
  {
    image: "/images/clothing.png",
    text: "Wear long sleeves and pants made of heavy cotton or wool for better protection.",
  },
  {
    image: "/images/gloves.png",
    text: "Use leather gloves, closed-toe shoes, and head protection to shield against heat and debris.",
  },
  {
    image: "/images/mask.png",
    text: "Use an N95 respirator or cover your face with a dry cotton or wool bandana for protection.",
  },
  {
    image: "/images/flashlight.png",
    text: "Carry a headlamp and flashlight for visibility in low-light conditions.",
  },
  {
    image: "/images/essentials.png",
    text: "Bring essential items: car keys, wallet, ID, phone, and a spare battery.",
  },
  {
    image: "/images/essentials.png",
    text: "Inform an out-of-area contact of your phone number, location, and status.",
  },
];

const alertWays = [
  {
    image: "/images/wildfire_tracker.png",
    title: "Wildfire Tracker",
    description:
      "Track nearby wildfires to stay aware of potential threats. Use the LARelief Wildfire Tracker for real-time updates.",
    buttonText: "Wildfire Tracker",
  },
  {
    image: "/images/air_quality.png",
    title: "Air Quality Tracker",
    description:
      "Monitor air quality levels to protect your health during wildfire season. Check the LARelief Air Quality Tracker for live data.",
    buttonText: "Air Quality Tracker",
  },
  {
    image: "/images/lafd_alerts.png",
    title: "LAFD Alerts & Updates",
    description:
      "Stay updated on official alerts for evacuation notices and emergencies. Visit LAFD’s official alerts for the latest information.",
    buttonText: "LAFD Alerts & Updates",
  },
];

const restore = [
  {
    image: "/images/clothing.png",
    text: "Volunteer or donate to support local environmental efforts.",
  },
  {
    image: "/images/gloves.png",
    text: "Reconnect with nature by spending more time outdoors.",
  },
  {
    image: "/images/mask.png",
    text: "Create wild spaces in your garden or community for biodiversity.",
  },
  {
    image: "/images/flashlight.png",
    text: "Grow your own food to reduce reliance on mass agriculture.",
  },
  {
    image: "/images/essentials.png",
    text: "Cut down on waste by composting and recycling.",
  },
  {
    image: "/images/essentials.png",
    text: "Eat mainly local, organic, plant-based for sustainability.",
  },
  {
    image: "/images/essentials.png",
    text: "Stop using harmful chemicals in your home and garden.",
  },
  {
    image: "/images/essentials.png",
    text: "Buy less and prioritize nature over material things",
  },
  {
    image: "/images/essentials.png",
    text: "Buy from ethical brands with sustainable supply chains.",
  },
];

export default function WildfireGuide() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
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
        <div className="min-h-screen flex bg-gray-10 text-white">
          {/* Left Half */}
          <div className="relative  w-1/2 flex items-center justify-center">
            {/* Background Image behind text */}
            <img
              src="images/guideinfo.png"
              alt="Guide Info"
              className="absolute bottom-[15rem] right-16 z-10 size-[20%]"
            />

            {/* Title (positioned absolutely on top of the background image) */}
            <h1 className="absolute z-10 text-5xl md:text-8xl font-extrabold mb-6 center drop-shadow-[0_5px_5px_rgba(30,30,0,0.9)]">
              WILDFIRE <br />
              GUIDE
            </h1>

            {/* Foreground Book Image */}
            <img
              src="images/guidebook.png"
              alt="Guide Book"
              className="relative p-32 mb-6"
            />
          </div>

          {/* guide info */}
          <div className="flex flex-col flex-wrap items-center justify-center">
            <div className="flex flex-row items-center justify-center p-6 rounded-lg mb-6">
              {/*guide buttons*/}
              <div className="rounded-full bg-[#224D21] p-3 mr-4" />
              <p className="text-lg md:text-xl w-[20rem] text-start text-gray-200 font-semibold mr-2">
                Learn how to prepare with evacuation plans and essentials.
              </p>
              <button
                onClick={() => scrollToSection("wildfire-readiness")}
                className="flex px-[8rem] py-3 bg-[#183917] text-white font-extrabold rounded-[15px] border border-white hover:bg-lime-800 transitiont text-start"
              >
                WILDFIRE READINESS
                <FontAwesomeIcon icon={faAngleRight} className="" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Wildfire Monitoring Section */}
      <section
        id="wildfire-monitoring"
        className="w-full bg-[#183917] p-6 rounded-lg shadow-md mb-6"
      >
        <div className="text-white p-6 space-y-8">
          {/* Evacuation Essentials Section */}
          <h1 className="text-7xl font-bold text-center pt-12 pb-6">
            EVACUATION ESSENTIALS
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            {essentials.map((item, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="bg-white p-10 rounded-full">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12"
                  />
                </div>
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-sm text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Evacuation Planning Section */}
          <h1 className="text-7xl font-bold text-center pt-12 pb-6">
            EVACUATION PLANNING
          </h1>
          <div className="space-y-6">
            <Section title="Home Preparation" items={homePreparation} />
            <Section title="Personal Safety" items={personalSafety} />
          </div>
        </div>
        <div className="text-white p-6 space-y-8">
          {/* LARELIEF~ */}

          <img src="images/ㄴㄱ.png" alt="LARelief" className="objevt-over" />
          <div className=" flex flex-col p-6 items-center justify-center">
            <h1 className="text-2xl font-bold uppercase text-center">
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

          {/* Ways to Stay Alert Section */}
          <h2 className="text-6xl font-bold text-center">
            <span className="text-orange-400">3</span> Ways to Stay Alert About
            Wildfires
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
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
                <button className="bg-[#2D683A] border border-white inset-shadow-sm text-white px-4 py-2 rounded-[15px] flex items-center gap-2">
                  {item.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Post-Fire Recovery Section */}
      <section
        id="post-fire-recovery"
        className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-6xl font-bold text-center">
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
              <p className="text-gray-300">{item.description}</p>
              <button className="bg-[#2D683A] border border-white inset-shadow-sm text-white px-4 py-2 rounded-[15px] flex items-center gap-2">
                {item.buttonText}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const Section = ({ title, items }) => (
  <div className="space-y-6">
    <div className="text-center">
      <div className="flex items-center">
        <div className="flex-1 border-2 rounded-full border-white"></div>
        <img src="/images/fire.png" alt="fire" className="w-24 h-24" />

        <div className="flex-1 border-2 rounded-full border-white"></div>
      </div>
      <h2 className="text-2xl font-bold mx-4 text-[#8FF4AC]">{title}</h2>
    </div>
    <ul className="mt-4 space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <div className="bg-white p-2.5 rounded-full ml-2 mr-2">
            <img src={item.image} alt="icon" className="w-8 h-8" />
          </div>
          <span className="text-xl mt-2">{item.text}</span>
        </li>
      ))}
    </ul>
  </div>
);
