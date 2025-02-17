import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBurger,
  faShirt,
  faBath,
  faMoneyBillWave,
  faHouse,
  faBriefcaseMedical,
  faPaw,
  faLaptop,
  faDoorOpen,
  faDoorClosed,
  faUser, // imported for in-person donation icon
} from "@fortawesome/free-solid-svg-icons";

// Mapping categories to icons with colors
const categoryIcons = {
  "Food & Water": { icon: faBurger, color: "#015BC3" },
  "Clothing & Bedding": { icon: faShirt, color: "#015BC3" },
  "Hygiene & Sanitation Supplies": { icon: faBath, color: "#015BC3" },
  "Monetary Donations (Essentials)": { icon: faMoneyBillWave, color: "#015BC3" },
  "Emergency Supplies": { icon: faHouse, color: "#4D03CD" },
  "Monetary Donations (Shelter & Support Services)": {icon: faMoneyBillWave, color: "#4D03CD" },
  "Medical Supplies": { icon: faBriefcaseMedical, color: "#CC0000" },
  "Monetary Donations (Medical & Health)": { icon: faMoneyBillWave, color: "#CC0000" },
  "Pet Supplies": { icon: faPaw, color: "#CF5700" },
  "Monetary Donations (Animal Support)": { icon: faMoneyBillWave, color: "#CF5700" },
};

// Safely parse a time string (e.g. "9:00 AM") into a Date object
function parseTime(timeStr, referenceDate) {
  // If timeStr is missing or not in the "HH:MM AM/PM" format, return null
  if (!timeStr || !timeStr.includes(" ")) {
    return null;
  }

  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  // Convert 12-hour format to 24-hour format
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const date = new Date(referenceDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

// Helper function to determine operating status
const getOperatingStatus = (hoursOfOperation) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const now = new Date();
  const todayIndex = now.getDay();
  const todayName = daysOfWeek[todayIndex];
  const todaysHours = hoursOfOperation?.[todayName];

  // If today's hours are missing, "Not Open", or do not contain " - ", look ahead
  if (
    !todaysHours ||
    todaysHours === "Not Open" ||
    !todaysHours.includes(" - ")
  ) {
    for (let i = 1; i < 7; i++) {
      const nextDayIndex = (todayIndex + i) % 7;
      const nextDayName = daysOfWeek[nextDayIndex];
      const nextDayHours = hoursOfOperation?.[nextDayName];

      // Found a future day that has valid hours
      if (
        nextDayHours &&
        nextDayHours !== "Not Open" &&
        nextDayHours.includes(" - ")
      ) {
        const [openStr] = nextDayHours.split(" - ");
        return {
          status: "closed",
          nextOpenDay: nextDayName,
          nextOpenTime: openStr,
        };
      }
    }
    // If no open day is found, return closed with no next open day/time
    return { status: "closed", nextOpenDay: null, nextOpenTime: null };
  }

  // We have valid hours for today in the format "9:00 AM - 5:00 PM"
  const [openStr, closeStr] = todaysHours.split(" - ");
  const openTime = parseTime(openStr, now);
  const closeTime = parseTime(closeStr, now);

  // If either parseTime returned null, treat as closed
  if (!openTime || !closeTime) {
    return { status: "closed", nextOpenDay: null, nextOpenTime: null };
  }

  if (now < openTime) {
    // Before today's opening time
    return {
      status: "closed",
      nextOpenDay: todayName,
      nextOpenTime: openStr,
    };
  } else if (now >= openTime && now < closeTime) {
    // Currently open
    return { status: "open", closeTime: closeStr };
  } else {
    // After today's closing time, look ahead for next open day
    for (let i = 1; i < 7; i++) {
      const nextDayIndex = (todayIndex + i) % 7;
      const nextDayName = daysOfWeek[nextDayIndex];
      const nextDayHours = hoursOfOperation?.[nextDayName];

      if (
        nextDayHours &&
        nextDayHours !== "Not Open" &&
        nextDayHours.includes(" - ")
      ) {
        const [nextOpenStr] = nextDayHours.split(" - ");
        return {
          status: "closed",
          nextOpenDay: nextDayName,
          nextOpenTime: nextOpenStr,
        };
      }
    }
    return { status: "closed", nextOpenDay: null, nextOpenTime: null };
  }
};

const DonateCard = ({ resource }) => {
  if (!resource) return null; // Do not render if no data is passed

  const {
    id,
    organization_name,
    address,
    hours_of_operation,
    carousel_images,
    organization_image,
    types,
    online_donation_available,
    slug,
  } = resource;

  // Determine operating status for displaying open/closed information
  const operatingStatus = getOperatingStatus(hours_of_operation);
  let operatingText = null;

  if (operatingStatus.status === "open") {
    operatingText = <>Open until {operatingStatus.closeTime}</>;
  } else if (operatingStatus.status === "closed") {
    const todayName = new Date().toLocaleString("en-US", { weekday: "long" });
    if (operatingStatus.nextOpenDay === todayName) {
      operatingText = (
        <>
          Opens at{" "}
          <span style={{ color: "forestgreen" }}>
            {operatingStatus.nextOpenTime}
          </span>
        </>
      );
    } else if (operatingStatus.nextOpenDay) {
      operatingText = (
        <>
          Opens at{" "}
          <span style={{ color: "forestgreen" }}>
            {operatingStatus.nextOpenTime} on {operatingStatus.nextOpenDay}
          </span>
        </>
      );
    } else {
      // Means there's no upcoming open day
      operatingText = "Currently Closed";
    }
  }

  // Choose door icon and color based on status
  const doorIcon =
    operatingStatus.status === "open" ? faDoorOpen : faDoorClosed;
  const doorColor =
    operatingStatus.status === "open" ? "forestgreen" : "#444444";

  // For donation method icon: show laptop if online donation is available,
  // otherwise show a person icon for in-person donation.
  const donationIcon = online_donation_available ? faLaptop : faUser;
  const donationIconColor = "#2B5CBA"; // Adjust this color if needed

  const onlineAvailable =
    online_donation_available === true
      ? "Online Donation Available"
      : "Donation In-Person";

  return (
    <div
      key={id}
      className="outerContainer"
      style={{
        fontFamily: "'Noto Sans Multani', sans-serif",
        position: "relative",
        left: "15%",
      }}
    >
      <Link
        href={`/donate/${slug}`}
        style={{
          textDecoration: "inherit",
          color: "inherit",
          width: "100%",
        }}
      >
        <div
          className="cardContainer"
          style={{
            backgroundImage: `url(${
              carousel_images?.[0] || "default-image.jpg"
            })`,
          }}
        >
          {/* Card Top: Organization Logo and Category Icons */}
          <div className="boxStroke">
            <div
              className="organization-logo flex"
              style={{
                position: "absolute",
                top: "13px",
                left: "15px",
                width: "75px",
                height: "75px",
                borderRadius: "50%",
                overflow: "hidden",
                boxShadow: "0px 1.79px 4px 4px rgba(0, 0, 0, 0.15)",
              }}
            >
              <img
                src={organization_image}
                alt={organization_name}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <div
              className="flex"
              style={{
                position: "absolute",
                top: "13px",
                right: "13px",
                gap: "5px",
              }}
            >
              {Array.isArray(types) &&
                types.map((category) => (
                  <div key={category} className="items-center gap-1">
                    {categoryIcons[category]?.icon && (
                      <FontAwesomeIcon
                        icon={categoryIcons[category].icon}
                        style={{
                          color: categoryIcons[category].color,
                          width: "23px",
                          height: "23px",
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                          borderRadius: "50%",
                          padding: "4px",
                        }}
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Card Content */}
          <div className="cardContent">
            <div className="cardTop">
              <div className="name-container">
                <h2 className="resourceName">{organization_name}</h2>
                <p>{address}</p>
              </div>
            </div>
            <div className="cardBottom">
              <FontAwesomeIcon
                icon={doorIcon}
                className="icon"
                style={{
                  color: doorColor,
                  width: "1.5rem",
                  height: "1.5rem",
                }}
              />
              <span
                style={{
                  color: "#6C727D",
                  marginLeft: "7px",
                  fontSize: "1rem",
                }}
              >
                {operatingText}
              </span>
            </div>
            <div className="timeContainer" style={{ marginTop: "10px" }}>
              <FontAwesomeIcon
                icon={donationIcon}
                className="icon"
                style={{
                  color: donationIconColor,
                  width: "1.3rem",
                }}
              />
              <span
                style={{
                  marginLeft: "6px",
                  color: "#6C727D",
                }}
              >
                {onlineAvailable}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Styles */}
      <style jsx>{`
        .outerContainer {
          width: 400px;
          position: relative;
        }
        .cardContainer {
          border-radius: 12px;
          height: 390px;
          background-color: #f9f8f8;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          display: flex;
          flex-direction: column;
          justify-content: end;
          padding: 10px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
          transition: transform 0.2s ease-out;
          transform: scale(0.9);
        }
        .cardContainer:hover {
          transform: scale(0.91);
          cursor: pointer;
        }
        .cardContent {
          background-color: #fefefe;
          border-radius: 12px;
          padding: 15px;
        }
        .cardTop {
          margin-bottom: 12px;
        }
        .cardBottom {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        .resourceName {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: bold;
        }
        .timeContainer {
          display: flex;
          align-items: center;
          font-size: 1rem;
        }
        .icon {
          font-size: 1.5rem !important;
        }
        p {
          color: #6c727d;
          margin: 0;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
};

export default DonateCard;
