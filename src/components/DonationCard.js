import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock } from "@fortawesome/free-solid-svg-icons";

const ResourceCard = ({ resource }) => {
  const { title, address, date, time, image } = resource;

  return (
    <div className="outerContainer">
      <Link
        href="#"
        style={{ textDecoration: "inherit", color: "inherit", width: "100%" }}
      >
        <div className="cardContainer" style={{ backgroundImage: `url(${image})` }}>
          <div className="cardContent">
            <div className="cardTop">
              <div className="title-container">
                <h2 className="resourceName" title={title}>
                  {title}
                </h2>
                <p>{address}</p>
              </div>
            </div>
            <div className="cardBottom">
              <div className="timeContainer">
                <FontAwesomeIcon
                  icon={faCalendar}
                  className="icon"
                  style={{ color: "forestgreen" }}
                />
                <span style={{ color: "#6C727D", marginLeft: "6px" }}>{date}</span>
              </div>
              <div className="timeContainer">
                <FontAwesomeIcon
                  icon={faClock}
                  className="icon"
                  style={{ color: "#2B5CBA" }}
                />
                <span style={{ color: "#6C727D", marginLeft: "6px" }}>{time}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <style jsx>{`
        .outerContainer {
          width: 320px;
        }
        .cardContainer {
          border-radius: 12px;
          height: 320px;
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
        }
        .cardContainer:hover {
          transform: scale(1.01);
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
          font-size: 0.9rem;
        }
        .icon {
          font-size: 0.8rem !important; /* Override FontAwesome default styles */
        }
        p {
          color: #6c727d;
          margin: 0;
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default ResourceCard;
