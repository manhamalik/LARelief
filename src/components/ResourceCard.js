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
  faCalendar,
  faClock,
  faBriefcaseMedical,
  faPeopleGroup,
  faDog,
  faPaw,
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

const getCurrentDayHours = (hoursOfOperation) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const todayIndex = new Date().getDay();
  const today = daysOfWeek[todayIndex];
  return hoursOfOperation?.[today] || "Hours N/A";
};

const formatDate = (date) => {
  if (!date) return null;
  const options = { year: "numeric", month: "short", day: "2-digit" };
  return new Date(date).toLocaleDateString("en-US", options);
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
  } = resource;

  const displayDate = (() => {
    const start = new Date(start_date);
    const end = new Date(end_date);
    if (end_date) {
      if (start.getFullYear() === end.getFullYear()) {
        return `${start.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        })} - ${end.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })}`;
      } else {
        return `${formatDate(start_date)} - ${formatDate(end_date)}`;
      }
    }
    return formatDate(start_date);
  })();

  const currentDayHours = getCurrentDayHours(hours_of_operation);

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
        href={`${resource.slug}`}
        style={{
          textDecoration: "inherit",
          color: "inherit",
          width: "100%",
        }}
      >
        <div
          className="cardContainer"
          style={{
            backgroundImage: `url(${carousel_images?.[0] || "default-image.jpg"})`,
          }}
        >
          {/* Resource Card Content */}
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
                <h2 className="resourceName" style={{ fontFamily: "'Noto Sans Multani', sans-serif" }}>
                  {name}
                </h2>
                <p style={{ fontFamily: "'Noto Sans Multani', sans-serif" }}>{address}</p>
              </div>
            </div>
            <div className="cardBottom">
              <div className="timeContainer">
                <FontAwesomeIcon
                  icon={faCalendar}
                  className="icon"
                  style={{
                    color: "forestgreen",
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
                  {displayDate}
                </span>
              </div>
              <div className="timeContainer">
                <FontAwesomeIcon
                  icon={faClock}
                  className="icon"
                  style={{
                    color: "#2B5CBA",
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
                  {currentDayHours}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
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
          justify-content: space-between;
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

export default ResourceCard;
