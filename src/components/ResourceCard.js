import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBurger,
  faShirt,
  faBath,
  faMoneyBillWave,
  faHouse,
  faCarSide,
  faGavel,
  faBriefcaseMedical,
  faPeopleGroup,
  faDog,
  faPaw,
  faDoorOpen, // door open icon
  faDoorClosed, // door closed icon (ensure this icon is available)
} from "@fortawesome/free-solid-svg-icons";

const categoryIcons = {
  "Food & Water": { icon: faBurger, color: "#015BC3" },
  "Clothing & Personal Items": { icon: faShirt, color: "#015BC3" },
  "Hygiene & Sanitation": { icon: faBath, color: "#015BC3" },
  "Financial Assistance": { icon: faMoneyBillWave, color: "#015BC3" },
  "Shelters & Housing Assistance": { icon: faHouse, color: "#4D03CD" },
  "Transportation Assistance": { icon: faCarSide, color: "#4D03CD" },
  "Legal Aid": { icon: faGavel, color: "#4D03CD" },
  "Medical Aid & First Aid": { icon: faBriefcaseMedical, color: "#CC0000" },
  "Mental Health Support": { icon: faPeopleGroup, color: "#CC0000" },
  "Animal Boarding": { icon: faDog, color: "#CF5700" },
  "Veterinary Care & Pet Food": { icon: faPaw, color: "#CF5700" },
};

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

  // Helper to parse a time string (e.g., "9:00 AM") into a Date object (using today's date)
  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    const date = new Date(now);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // If today's hours are not available or say "Not Open", look ahead for the next open day
  if (!todaysHours || todaysHours === "Not Open") {
    for (let i = 1; i < 7; i++) {
      const nextDayIndex = (todayIndex + i) % 7;
      const nextDayName = daysOfWeek[nextDayIndex];
      const nextDayHours = hoursOfOperation?.[nextDayName];
      if (nextDayHours && nextDayHours !== "Not Open") {
        const [openStr] = nextDayHours.split(" - ");
        return {
          status: "closed",
          nextOpenDay: nextDayName,
          nextOpenTime: openStr,
        };
      }
    }
    // If no open day is found, return null values.
    return { status: "closed", nextOpenDay: null, nextOpenTime: null };
  }

  // If we have valid hours for today, assume format "open - close"
  const [openStr, closeStr] = todaysHours.split(" - ");
  const openTime = parseTime(openStr);
  const closeTime = parseTime(closeStr);

  if (now < openTime) {
    // It's before today's opening time
    return {
      status: "closed",
      nextOpenDay: todayName,
      nextOpenTime: openStr,
    };
  } else if (now >= openTime && now < closeTime) {
    // Currently open
    return { status: "open", closeTime: closeStr };
  } else {
    // Today’s hours have passed. Look for the next day that is open.
    for (let i = 1; i < 7; i++) {
      const nextDayIndex = (todayIndex + i) % 7;
      const nextDayName = daysOfWeek[nextDayIndex];
      const nextDayHours = hoursOfOperation?.[nextDayName];
      if (nextDayHours && nextDayHours !== "Not Open") {
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

const ResourceCard = ({ resource }) => {
  if (!resource) return null; // Do not render if no data is passed

  const {
    id,
    name,
    organization_name,
    address,
    start_date,
    end_date,
    hours_of_operation,
    carousel_images,
    organization_image,
    types,
    slug,
  } = resource;

  // Determine the operating status
  const operatingStatus = getOperatingStatus(hours_of_operation);
  let operatingText;
  if (operatingStatus.status === "open") {
    // If currently open, show closing time
    operatingText = (
      <>
        Open{" "}
        <span style={{ color: "forestgreen" }}>
          until {operatingStatus.closeTime}
        </span>
      </>
    );
  } else if (operatingStatus.status === "closed") {
    // If closed, show next opening time with the time (and day) in forest green
    if (
      operatingStatus.nextOpenDay ===
      new Date().toLocaleString("en-US", { weekday: "long" })
    ) {
      operatingText = (
        <>
          Opens at{" "}
          <span style={{ color: "forestgreen" }}>
            {operatingStatus.nextOpenTime}
          </span>
        </>
      );
    } else {
      operatingText = (
        <>
          Opens at{" "}
          <span style={{ color: "forestgreen" }}>
            {operatingStatus.nextOpenTime} on {operatingStatus.nextOpenDay}
          </span>
        </>
      );
    }
  }

  // Choose icon based on operating status
  const doorIcon =
    operatingStatus.status === "open" ? faDoorOpen : faDoorClosed;

  return (
    <div
      key={id}
      className="outerContainer md:left-[15%]"
      style={{
        fontFamily: "'Noto Sans Multani', sans-serif",
        position: "relative",
      }}
    >
      <Link
        href={`${slug}`}
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
          {/* Top Section with Organization Logo and Category Icons */}
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
                alt={name}
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
          <div className="cardContent">
            <div className="cardTop">
              <div className="name-container">
                <h2
                  data-no-translate="true"
                  className="resourceName"
                  style={{ fontFamily: "'Noto Sans Multani', sans-serif" }}
                >
                  {name}
                </h2>
                <p style={{ fontFamily: "'Noto Sans Multani', sans-serif" }}>
                  {address}
                </p>
              </div>
            </div>
            <div className="cardBottom">
              <FontAwesomeIcon
                icon={doorIcon}
                className="icon"
                style={{
                  color:
                    operatingStatus.status === "open"
                      ? "forestgreen"
                      : "#201A1A",
                  width: "1.5rem",
                  height: "1.5rem",
                }}
              />
              <span
                style={{
                  color: "#6C727D",
                  marginLeft: "7px",
                  fontSize: "1rem",
                  fontFamily: "'Noto Sans Multani', sans-serif",
                }}
              >
                {operatingText}
              </span>
            </div>
          </div>
        </div>
      </Link>
      <style jsx>{`
        .outerContainer {
          width: 100%;
          max-width: 390px;
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
        }
        .resourceName {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: bold;
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

export default ResourceCard;
