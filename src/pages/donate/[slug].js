import React, { useState } from "react";
import DetailImageCarousel from "@/components/DetailImageCarousel";
import { format, addDays } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {
  faClock,
  faCalendar,
  faEnvelope,
  faLink,
  faLocationDot,
  faPhone,
  faChevronDown,
  faChevronUp,
  faHandHoldingHeart,
  faCircleDollarToSlot,
  faPaperPlane,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faTwitter,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";

// Load the Noto Sans Multani font
<link
  href="https://fonts.googleapis.com/css2?family=Noto+Sans+Multani&display=swap"
  rel="stylesheet"
/>;

// Helper function to truncate a URL to its hostname (or a fallback truncation)
const truncateUrl = (url, maxLength = 30) => {
  try {
    const { hostname } = new URL(url);
    return hostname;
  } catch (err) {
    return url.length > maxLength ? url.slice(0, maxLength) + "..." : url;
  }
};

// Utility functions
const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  const formattedString = string.replace(/([A-Z])/g, " $1");
  return formattedString.charAt(0).toUpperCase() + formattedString.slice(1);
};

const formatPhoneNumber = (phone) => {
  const cleaned = ("" + phone).replace(/\D/g, "");
  if (cleaned.length === 10) {
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : null;
  }
  return phone;
};

// Updated parseHours function: returns "Closed" if hours are missing, empty, or "closed"
const parseHours = (hoursOfOperation, day) => {
  if (!hoursOfOperation) return null;
  const hours = hoursOfOperation[day];
  if (!hours || hours.trim() === "" || hours.toLowerCase() === "closed") {
    return "Closed";
  }
  return hours.split(" - ");
};

// Resource data
const resources = [
  {
    slug: "union-station",
    categories: ["Essentials", "Shelter & Support Services"],
    organization_name: "Union Station Homeless Services (USHS)",
    owner: "Katie Hill",
    address: "412 S. Raymond Avenue, Pasadena, CA 91104",
    startDate: "2025-01-26",
    endDate: null,
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    about: "Supporting homeless individuals in Pasadena.",
    items_needed: "These are items needed.",
    link_to_donate: "https://ushs.org/donate/",
    contact_info: {
      website: "https://ushs.org",
      phone: "123.456.7890",
      email: "contact@unionstation.org",
      instagram: "unionstationhs",
      twitter: "UnionStationHS",
      tiktok: "unionstationhs",
    },
    organization_image: "/images/image.jpg",
    carousel_images: [
      "/images/resource-1.jpg",
      "/images/resource-2.jpg",
      "/images/resource-3.jpg",
    ],
    hours_of_operation: {
      Friday: "8:30 AM - 5:00 PM",
      Monday: "8:30 AM - 5:00 PM",
      Tuesday: "8:30 AM - 5:00 PM",
      Thursday: "8:30 AM - 5:00 PM",
      Wednesday: "8:30 AM - 5:00 PM",
      Sunday: "closed",
      Saturday: "closed",
    },
  },
];

export async function getServerSideProps({ params, req }) {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? `https://${req.headers.host}`
      : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/donations?slug=${params.slug}`);
  const donation = await res.json();

  if (!donation || donation.error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      resource: donation,
    },
  };
}

// Helper function to return pin color based on category
const getPinColor = (category) => {
  switch (category) {
    case "Essentials":
      return "#015BC3";
    case "Shelter & Support Services":
      return "#4D03CD";
    case "Medical & Health":
      return "#CC0000";
    case "Animal Support":
      return "#CF5700";
    default:
      return "#000000";
  }
};

export default function Resource({ resource }) {
  console.log("Resource prop:", resource);

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);

  if (!resource) {
    return <p>Resource not found</p>;
  }

  const {
    organization_name,
    owner,
    address,
    about,
    items_needed,
    carousel_images,
    link_to_donate,
    startDate,
    endDate,
    startTime,
    endTime,
    categories,
    contact_info,
    hours_of_operation,
  } = resource;

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const today = new Date();
  const currentDay = weekdays[today.getDay()];
  const currentHours =
    parseHours(hours_of_operation, currentDay) || [startTime, endTime];

  const startDisplayDate = startDate ? new Date(startDate) : today;
  const endDisplayDate = endDate ? new Date(endDate) : null;

  const getDatesRange = () => {
    const dates = [];
    const today = new Date();
    const limit = addDays(today, 6);
    let current = today;
    while (current <= limit) {
      dates.push(new Date(current));
      current = addDays(current, 1);
    }
    return dates;
  };

  // Note: getDatesRange does not currently use startDisplayDate/endDisplayDate.
  const displayedDates = getDatesRange();

  const toggleSchedule = () => setScheduleOpen(!scheduleOpen);

  // Updated handleShareClick function with popup notification
  const handleShareClick = () => {
    const organizationName = document.querySelector(".header")?.innerText;
    const dates = document.querySelector(".schedule-dropdown")?.innerText;
    const hours = document.querySelector(".horizontal-container p")?.innerText;
    const aboutText = document.querySelector("h3 + p")?.innerText;
    const itemsNeeded = document.querySelector("h3 + p")?.innerText || "";
    let contactInfo = "";
    const contactElements = document.querySelectorAll(".info-column p");
    contactElements.forEach((el) => {
      contactInfo += el.innerText + "\n";
    });

    const textToCopy = `
      Organization: ${organizationName}
      Address: ${hours || "No address information available"}
      About: ${aboutText || "No description available"}
      Items Needed: ${itemsNeeded || "No items needed information available"}
      Contact Info:
      ${contactInfo || "No contact information available"}
    `;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setShowSharePopup(true);
        setTimeout(() => setShowSharePopup(false), 3000);
      })
      .catch((err) => {
        console.error("Failed to copy content: ", err);
      });
  };

  return (
    <div className="page-layout">
      <style jsx>{`
        .page-layout {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: flex-start;
          width: 100vw;
          min-height: 100vh;
          font-family: "Noto Sans Multani", sans-serif;
        }
        .carousel-container {
          width: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .schedule-dropdown {
          margin-top: -1vw;
          padding: 10px;
          background: #f9f9f9;
          border-radius: 10px;
          width: 28vw;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
          animation: fadeIn 0.3s ease-in-out;
        }
        /* New styling for each dropdown option with line separation */
        .schedule-dropdown p {
          margin: 0;
          padding: 10px 0;
        }
        .schedule-dropdown p:not(:last-child) {
          border-bottom: 1px solid #ccc;
        }
        .details-container {
          width: 50%;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
        .header {
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
          font-size: 2rem;
          font-weight: bold;
        }
        .owned-by {
          display: flex;
          align-items: center;
          font-size: 1rem;
          color: black;
          margin-bottom: 1rem;
        }
        .organization-image {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
          object-fit: cover;
        }
        .horizontal-container {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          gap: 0.6rem;
        }
        .schedule {
          cursor: pointer;
        }
        .additional-info {
          margin: 0;
          display: flex;
          justify-content: center;
          width: 100%;
          margin-top: 2rem;
        }
        .info-column {
          text-align: center;
        }
        /* Left align paragraphs inside the info column */
        .info-column p {
          text-align: left;
        }
        .accessibility-tags {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0rem;
        }
        .tag {
          background-color: #ebebeb;
          border-radius: 15px;
          padding: 0.5rem 1rem;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
        }
        .buttons-container {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
          gap: 2rem;
        }
        .button {
          background-color: rgb(255, 255, 255);
          font-family: "Noto Sans Multani", sans-serif;
          color: black;
          border: none;
          border-radius: 15px;
          padding: 0.5rem 1.5rem;
          cursor: pointer;
          font-size: 1.2rem;
          font-weight: bold;
          box-shadow: -2px -2px 8px rgba(0, 0, 0, 0.1);
          text-decoration: none;
          display: flex;
          align-items: center;
          border: 1px solid #E0E0E0;
        }
        .button:hover {
          background-color: black;
          color: white;
        }
        /* Top row for pills: Categories & More Donations */
        .pills-container {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
          margin-bottom: 1rem;
          flex-wrap: nowrap;
        }
        .categories-container {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          flex: 1;
        }
        .pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 15px;
          font-weight: bold;
          font-size: 0.9rem;
          box-shadow: -2px -2px 8px rgba(0, 0, 0, 0.1);
        }
        .pill.category {
          background-color: white;
          color: #000000;
          border: 1px solid #E0E0E0;
        }
        .pill.donation {
          background-color: black;
          color: white;
        }
        .pill.donation:hover {
          background-color: white;
          color: black;
          border: 1px solid #E0E0E0;
        }
        .pill.donation.more-donations {
          flex-shrink: 0;
        }
        .more-donations-icon {
          color: white;
          margin-left: 5px;
        }
        .pill.donation.more-donations:hover .more-donations-icon {
          color: black;
        }
        .contact-text {
          margin-left: 0.5rem;
        }
        .accessibility-icon {
          margin-right: 0.5rem;
        }
        .accessibility-text {
          font-size: 0.8rem;
        }
        .share-popup {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background-color: #333;
          color: #fff;
          padding: 10px 20px;
          border-radius: 5px;
          font-size: 0.9rem;
          z-index: 9999;
          opacity: 0.9;
        }
      `}</style>

      {/* Left: Carousel */}
      <div className="carousel-container">
        <DetailImageCarousel imageArray={carousel_images} />
      </div>

      {/* Right: Details */}
      <div className="details-container">
        {/* Top Row: Categories & More Donations Button */}
        <div className="pills-container">
          <div className="categories-container">
            {categories.map((category, index) => (
              <div key={index} className="pill category">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  style={{ color: getPinColor(category) }}
                />
                {category}
              </div>
            ))}
          </div>
          <Link href="/donate/#resources" passHref>
            <div
              className="pill donation more-donations"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              More Donations
              <FontAwesomeIcon icon={faCaretRight} className="more-donations-icon" />
            </div>
          </Link>
        </div>

        <h1 data-no-translate="true" className="header">
          {organization_name}
        </h1>
        <p className="owned-by">
          <img
            src={resource.organization_image}
            alt={`${organization_name} logo`}
            className="organization-image"
          />
          Owned by {owner}
        </p>

        <div className="horizontal-container">
          <FontAwesomeIcon icon={faLocationDot} className="icon" />
          <p>{address}</p>
        </div>

        {/* Start and End Dates */}
        <div className="horizontal-container schedule" onClick={toggleSchedule}>
          <FontAwesomeIcon icon={faCalendar} className="icon" />
          <p>
            {startDate && !endDate
              ? format(today, "EEEE, MMMM d, yyyy")
              : `${format(startDisplayDate, "EEEE, MMMM d, yyyy")}${
                  endDate
                    ? ` - ${format(endDisplayDate, "EEEE, MMMM d, yyyy")}`
                    : ""
                }`}
          </p>
          <FontAwesomeIcon
            icon={scheduleOpen ? faChevronUp : faChevronDown}
            style={{ marginLeft: "0.1rem" }}
          />
        </div>

        {/* Dropdown Schedule */}
        {scheduleOpen && (
          <div className="schedule-dropdown">
            {displayedDates.map((date, index) => {
              const day = format(date, "EEEE");
              const hours = parseHours(hours_of_operation, day);
              return (
                <p key={index}>
                  {format(date, "EEEE, MMMM d, yyyy")} :{" "}
                  {hours === "Closed" ? "Closed" : `${hours[0]} - ${hours[1]}`}
                </p>
              );
            })}
          </div>
        )}

        {/* Time Section */}
        <div className="horizontal-container">
          <FontAwesomeIcon icon={faClock} className="icon" />
          <p>
            {currentHours === "Closed"
              ? "Closed"
              : currentHours
              ? `Hours: ${currentHours[0]} - ${currentHours[1]}`
              : "Closed today"}
          </p>
        </div>

        <h3 className="text-[24px] pb-1">
          <b>About</b>
        </h3>
        <p className="text-[15px] pr-[30px] pl-[30px]">{about}</p>
        <br />
        <h3 className="text-[24px] pb-1">
          <b>Accepting Items</b>
        </h3>
        <p className="text-[15px] pr-[30px] pl-[30px]">{items_needed}</p>
        <br />
        {/* Donation Link Button */}
        {link_to_donate && (
          <a
            href={link_to_donate}
            target="_blank"
            rel="noopener noreferrer"
            className="button"
          >
            <FontAwesomeIcon icon={faLink} className="mr-2" />
            Link to Donate
          </a>
        )}
        <br />
        <div className="info-column">
          <h2 className="text-[24px] pb-1">
            <b>Additional Info</b>
          </h2>
          <h3 className="pb-1">Organization Contact</h3>
          {contact_info && Object.keys(contact_info).length > 0 ? (
            Object.keys(contact_info).map((key) => {
              const value = contact_info[key];
              if (!value) return null;
              switch (key) {
                case "website":
                  return (
                    <p key={key}>
                      <FontAwesomeIcon icon={faLink} className="icon" />
                      <span className="contact-text">
                        <a
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {truncateUrl(value)}
                        </a>
                      </span>
                    </p>
                  );
                case "phone":
                  return (
                    <p key={key}>
                      <FontAwesomeIcon icon={faPhone} className="icon" />
                      <span className="contact-text">
                        {formatPhoneNumber(value)}
                      </span>
                    </p>
                  );
                case "email":
                  return (
                    <p key={key}>
                      <FontAwesomeIcon icon={faEnvelope} className="icon" />
                      <span className="contact-text">{value}</span>
                    </p>
                  );
                case "instagram":
                  return (
                    <p key={key}>
                      <FontAwesomeIcon icon={faInstagram} className="icon" />
                      <span className="contact-text">
                        <a
                          href={`https://instagram.com/${value.replace(/^@/, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          @{value.replace(/^@/, "")}
                        </a>
                      </span>
                    </p>
                  );
                case "twitter":
                  return (
                    <p key={key}>
                      <FontAwesomeIcon icon={faTwitter} className="icon" />
                      <span className="contact-text">
                        <a
                          href={`https://twitter.com/${value.replace(/^@/, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          @{value.replace(/^@/, "")}
                        </a>
                      </span>
                    </p>
                  );
                case "tiktok":
                  return (
                    <p key={key}>
                      <FontAwesomeIcon icon={faTiktok} className="icon" />
                      <span className="contact-text">
                        <a
                          href={`https://tiktok.com/@${value.replace(/^@/, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          @{value.replace(/^@/, "")}
                        </a>
                      </span>
                    </p>
                  );
                default:
                  console.log(`Unknown key: ${key}`);
                  return null;
              }
            })
          ) : (
            <p>No contact information available</p>
          )}
        </div>

        {/* Buttons */}
        <div className="buttons-container">
          <button
            className="button"
            onClick={() => {
              window.open("/donate", "_blank");
            }}
          >
            <FontAwesomeIcon
              icon={faCircleDollarToSlot}
              className="text-[#2B9FD0] mr-2"
            />
            Donate
          </button>
          <button
            className="button"
            onClick={() => {
              window.open("/volunteer", "_blank");
            }}
          >
            <FontAwesomeIcon
              icon={faHandHoldingHeart}
              className="text-[#D55858] mr-2"
            />
            Volunteer
          </button>
          <button className="button" onClick={handleShareClick}>
            <FontAwesomeIcon icon={faPaperPlane} className="share-icon mr-2" />
            Share
          </button>
        </div>
      </div>

      {/* Share Popup Notification */}
      {showSharePopup && (
        <div className="share-popup">
          Information copied to clipboard! Please share this opportunity!
        </div>
      )}
    </div>
  );
}
