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
import {
  faWifi,
  faWheelchair,
  faRestroom,
  faDog,
  faParking,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";

// Updated Google Fonts link for Noto Sans Multani
<link
  href="https://fonts.googleapis.com/css2?family=Noto+Sans+Multani&display=swap"
  rel="stylesheet"
/>;

const accessibilityIcons = {
  wifi: faWifi,
  wheelchair: faWheelchair,
  washroom: faRestroom,
  pets: faDog,
  parking: faParking,
  veg: faUtensils,
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

// Function to parse the hours of operation
const parseHours = (hoursOfOperation, day) => {
  if (!hoursOfOperation) return null;
  const hours = hoursOfOperation[day];
  return hours ? (hours === "closed" ? null : hours.split(" - ")) : null;
};

// Resource data
const resources = [
  {
    slug: "red-cross",
    categories: ["Essentials", "Shelter & Support Services"],
    name: "Shelter & Health Support",
    organization_name: "American Red Cross",
    address: "1450 South Central Ave, Los Angeles, CA 90021",
    startDate: "2025-01-26",
    endDate: null,
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    about: "Supporting homeless individuals in Pasadena.",
    details: "These are the details needed.",
    contact_info: {
      website: "https://redcross.org",
      phone: "123.456.7890",
      email: "contact@redcross.org",
      instagram: "redCross",
      twitter: "redCross",
      tiktok: "redCross",
    },
    accessibility: {
      wheelchair: "Wheelchair accessible",
      washroom: "Washroom available",
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

  const res = await fetch(`${baseUrl}/api/resources?slug=${params.slug}`);
  const resourceData = await res.json();

  if (!resourceData || resourceData.error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      resource: resourceData,
    },
  };
}

export default function Resource({ resource }) {
  console.log("Resource prop:", resource);

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);

  if (!resource) {
    return <p>Resource not found</p>;
  }

  const {
    name,
    organization_name,
    address,
    about,
    details,
    carousel_images,
    startDate,
    endDate,
    startTime,
    endTime,
    categories,
    contact_info,
    hours_of_operation,
    accessibility,
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
  const currentHours = parseHours(hours_of_operation, currentDay) || [
    startTime,
    endTime,
  ];

  // Determine what to display for hours.
  const displayHours =
    currentHours[0] && currentHours[1]
      ? `Hours: ${currentHours[0]} - ${currentHours[1]}`
      : "Closed";

  const startDisplayDate = startDate ? new Date(startDate) : today;
  const endDisplayDate = endDate ? new Date(endDate) : null;

  const getDatesRange = () => {
    const dates = [];
    const today = new Date(); // Current day
    const limit = addDays(today, 6); // 6 days following today

    let current = today;
    while (current <= limit) {
      dates.push(new Date(current));
      current = addDays(current, 1);
    }

    return dates; // Return dates in natural order
  };

  // Helper function to add days to a date
  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const displayedDates = getDatesRange(startDisplayDate, endDisplayDate);

  const toggleSchedule = () => setScheduleOpen(!scheduleOpen);

  const handleShareClick = () => {
    // Get specific content from the page
    const organizationName = document.querySelector(".header")?.innerText;
    const dates = document.querySelector(".schedule-dropdown")?.innerText;
    const hours = document.querySelector(".horizontal-container p")?.innerText;
    const aboutText = document.querySelector("h3 + p")?.innerText;
    const itemsNeeded = document.querySelector("h3 + p")?.innerText;

    // Get contact info if available
    let contactInfo = "";
    const contactElements = document.querySelectorAll(".info-column p");
    contactElements.forEach((el) => {
      contactInfo += el.innerText + "\n";
    });

    // Format the text you want to copy
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
        // Show a small popup at bottom left.
        setShowSharePopup(true);
        setTimeout(() => setShowSharePopup(false), 3000);
      })
      .catch((err) => {
        console.error("Failed to copy content: ", err);
      });
  };

  // New helper function to get the pin color based on category type.
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
        return "#000000"; // Default color if category does not match any specified type
    }
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
          margin-top: 10px;
          padding: 15px;
          background: #f9f9f9;
          border-radius: 10px;
          width: 70%;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
          animation: fadeIn 0.3s ease-in-out;
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
          margin-top: 1rem;
        }
        .info-column-left {
          width: 45%;
          text-align: left;
          margin-right: -5rem;
        }
        .info-column-right {
          width: 35%;
          text-align: right;
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
          display: flex;
          align-items: center;
          border: 1px solid #E0E0E0;
        }
        .button:hover {
          background-color: black;
          color: white;
        }
        .share-icon {
          color: inherit;
          margin-right: 0.5rem;
        }
        .donation-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background-color: #28a745;
          color: white;
          text-decoration: none;
          padding: 0.75rem 1.5rem;
          border-radius: 5px;
          font-size: 1rem;
          margin-top: 1rem;
        }
        .donation-button:hover {
          background-color: #218838;
        }
        /* Top row for pills: categories & More Resources */
        .pills-container {
          display: flex;
          align-items: flex-start; /* Align items at the top */
          justify-content: space-between;
          width: 100%;
          margin-bottom: 1rem;
          flex-wrap: nowrap; /* Prevent the More Resources pill from wrapping */
        }
        .categories-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          flex: 1;
        }
        /* Ensure the More Resources pill never shrinks or wraps */
        .pill.donation.more-resources {
          flex-shrink: 0;
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
          background-color: #000;
          color: #fff;
        }
        .pill.donation:hover {
          background-color: white;
          color: black;
          border: 1px solid #E0E0E0;
        }
        /* Set default and hover color for the More Resources caret icon */
        .more-resources-icon {
          color: white;
        }
        .pill.donation.more-resources:hover .more-resources-icon {
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
        {/* Top row: Categories & More Resources */}
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
          <Link href="/#resources" passHref>
            <div
              className="pill donation more-resources"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              More Resources
              <FontAwesomeIcon
                icon={faCaretRight}
                className="more-resources-icon"
                style={{ marginLeft: "5px" }}
              />
            </div>
          </Link>
        </div>

        <h1 className="header">{name}</h1>
        <p className="owned-by">
          <img
            src={resource.organization_image}
            alt={`${name} logo`}
            className="organization-image"
          />
          Hosted by {organization_name}
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
                  {hours ? `${hours[0]} - ${hours[1]}` : "Closed"}
                </p>
              );
            })}
          </div>
        )}

        {/* Time Section */}
        <div className="horizontal-container">
          <FontAwesomeIcon icon={faClock} className="icon" />
          <p>{displayHours}</p>
        </div>

        <h3 className="text-[24px] pb-1">
          <b>About</b>
        </h3>
        <p className="text-[15px] pr-[30px] pl-[30px]">{about}</p>
        <br />
        <h3 className="text-[24px] pb-1">
          <b>Items Provided</b>
        </h3>
        <p className="text-[15px] pr-[30px] pl-[30px]">{details}</p>
        <br />
        <h2 className="text-[24px] pb-0">
          <b>Additional Info</b>
        </h2>
        <div className="additional-info">
          {/* Left Column: Contact Info */}
          <div className="info-column-left">
            <h3 className="pb-[10px]">Organization Contact</h3>
            {contact_info && Object.keys(contact_info).length > 0 ? (
              Object.keys(contact_info).map((key) => {
                const value = contact_info[key];
                if (!value) return null;
                switch (key) {
                  case "website":
                    return (
                      <p key={key} className="text-[0.9rem]">
                        <FontAwesomeIcon icon={faLink} className="icon" />
                        <span className="contact-text">
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {value}
                          </a>
                        </span>
                      </p>
                    );
                  case "phone":
                    return (
                      <p key={key} className="text-[0.9rem]">
                        <FontAwesomeIcon icon={faPhone} className="icon" />
                        <span className="contact-text">
                          {formatPhoneNumber(value)}
                        </span>
                      </p>
                    );
                  case "email":
                    return (
                      <p key={key} className="text-[0.9rem]">
                        <FontAwesomeIcon icon={faEnvelope} className="icon" />
                        <span className="contact-text">{value}</span>
                      </p>
                    );
                  case "instagram":
                    return (
                      <p key={key} className="text-[0.9rem]">
                        <FontAwesomeIcon icon={faInstagram} className="icon" />
                        <span className="contact-text">
                          <a
                            href={`https://instagram.com/${value.replace(
                              /^@/,
                              ""
                            )}`}
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
                      <p key={key} className="text-[0.9rem]">
                        <FontAwesomeIcon icon={faTwitter} className="icon" />
                        <span className="contact-text">
                          <a
                            href={`https://twitter.com/${value.replace(
                              /^@/,
                              ""
                            )}`}
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
                      <p key={key} className="text-[0.9rem]">
                        <FontAwesomeIcon icon={faTiktok} className="icon" />
                        <span className="contact-text">
                          <a
                            href={`https://tiktok.com/@${value.replace(
                              /^@/,
                              ""
                            )}`}
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

          {/* Right Column: Accessibility Info */}
          <div className="info-column-right">
            <h3>Accessibility</h3>
            <div className="accessibility-tags">
              {accessibility && Object.keys(accessibility).length > 0 ? (
                Object.entries(accessibility).map(([key, value]) => {
                  const isEnabled = value;
                  if (!isEnabled) return null;
                  return (
                    <div className="tag" key={key}>
                      <span className="accessibility-icon">
                        <FontAwesomeIcon
                          icon={accessibilityIcons[key]}
                          className="icon"
                        />
                      </span>
                      <span className="accessibility-text">{value}</span>
                    </div>
                  );
                })
              ) : (
                <p>No accessibility features available</p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="buttons-container pt-10">
          <button
            className="button"
            onClick={() => {
              window.open("/donate", "_blank");
            }}
          >
            <FontAwesomeIcon
              icon={faCircleDollarToSlot}
              className="mr-2"
              style={{ color: "#2B9FD0" }}
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
              className="mr-2"
              style={{ color: "#D55858" }}
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
