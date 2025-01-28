import React, { useState } from "react";
import DetailImageCarousel from "@/components/DetailImageCarousel";
import { format, addDays } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCalendar,
  faEnvelope,
  faLink,
  faLocationDot,
  faPhone,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faTwitter,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";

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

export async function getServerSideProps({ params }) {
  const res = await fetch(`http://localhost:3000/api/donations?slug=${params.slug}`);
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

export default function Resource({ resource }) {
  console.log("Resource prop:", resource);

  const [scheduleOpen, setScheduleOpen] = useState(false);

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
  const currentHours = parseHours(hours_of_operation, currentDay) || [
    startTime,
    endTime,
  ];

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

  return (
    <div className="page-layout">
      <style jsx>{`
        .page-layout {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: flex-start;
          width: 100vw;
          height: 100vh;
          // background-color: #f9f9f9;
          font-family: "Noto Sans", sans-serif;
        }
        .carousel-container {
          width: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .details-container {
          width: 50%;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
        .categories {
          margin-bottom: 1.5rem;
        }
        .categories p {
          margin: 0.25rem 0;
        }
        .header {
          margin-bottom: 1.5rem;
          font-size: 2rem;
          font-weight: bold;
        }
          .owned-by {
            display: flex;
            align-items: center;
            font-size: 1rem;
            color: #555;
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
        }
        .schedule {
          cursor: pointer;
        }
        .schedule-dropdown {
          background-color: #ebebeb;
          border-radius: 10px;
          padding: 1rem;
          margin: 1rem 0;
          width: 100%;
          text-align: left;
        }
        .additional-info {
          margin-top: 2rem;
          display: flex;
          justify-content: center;
          width: 100%;
        }
        .info-column {
          width: 45%;
          text-align: center;
        }
        .buttons-container {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
          gap: 1rem;
        }
        .button {
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 0.75rem 1.5rem;
          cursor: pointer;
          font-size: 1rem;
        }
        .button:hover {
          background-color: #0056b3;
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
        .pills-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 1rem;
        }
        .categories-container {
          display: flex;
          gap: 0.5rem; /* Spacing between category pills */
        }
        .pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: bold;
          font-size: 0.9rem;
        }
        .pill.category {
          background-color: #f5f5f5;
          color: #000000;
          border: 1px solid #000000;
        }
        .pill.donation {
          background-color: #000;
          color: #fff;
        }
      `}</style>

      {/* Left: Carousel */}
      <div className="carousel-container">
        <DetailImageCarousel imageArray={carousel_images} />
      </div>

        {/* Right: Details */}
        <div className="details-container">
       {/* Pills */}
<div className="pills-container">
  <div className="categories-container">
    {categories.map((category, index) => (
      <div key={index} className="pill category">
        <FontAwesomeIcon icon={faLocationDot} />
        {category}
      </div>
    ))}
  </div>
  <div className="pill donation">
    <FontAwesomeIcon icon={faLink} />
    Donation
  </div>
</div>


        <h1 className="header">{organization_name}</h1>
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
      ? format(today, "EEEE, MMMM d, yyyy") // Display current day
      : `${format(startDisplayDate, "EEEE, MMMM d, yyyy")}${
          endDate ? ` - ${format(endDisplayDate, "EEEE, MMMM d, yyyy")}` : ""
        }`}
  </p>
  <FontAwesomeIcon
    icon={scheduleOpen ? faChevronUp : faChevronDown}
    style={{ marginLeft: "1rem" }}
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
  <p>
    {currentHours
      ? `Hours: ${currentHours[0]} - ${currentHours[1]}`
      : "Closed today"}
  </p>
</div>

        <h3><b>About</b></h3>
        <p>{about}</p>
        <br></br>
        <h3><b>Accepting Items</b></h3>
        <p>{items_needed}</p>
        <br></br>
        {/* Donation Link Button */}
        {link_to_donate && (
          <a
            href={link_to_donate}
            target="_blank"
            rel="noopener noreferrer"
            className="donation-button"
          >
            <FontAwesomeIcon icon={faLink} />
            Link to Donate
          </a>
        )}
<br></br>
<div className="info-column">
  <h2><b>Additional Info</b></h2>
  <h3>Organization Contact</h3>
  {contact_info && Object.keys(contact_info).length > 0 ? (
    Object.keys(contact_info).map((key) => {
      const value = contact_info[key];
      if (!value) return null; // Skip empty or null values

      switch (key) {
        case "website":
          return (
            <p key={key}>
              <FontAwesomeIcon icon={faLink} className="icon" />
              <a href={value} target="_blank" rel="noopener noreferrer">
                {value}
              </a>
            </p>
          );
        case "phone":
          return (
            <p key={key}>
              <FontAwesomeIcon icon={faPhone} className="icon" />
              {formatPhoneNumber(value)}
            </p>
          );
        case "email":
          return (
            <p key={key}>
              <FontAwesomeIcon icon={faEnvelope} className="icon" />
              {value}
            </p>
          );
        case "instagram":
          return (
            <p key={key}>
              <FontAwesomeIcon icon={faInstagram} className="icon" />
              <a
                href={`https://instagram.com/${value.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                @{value.replace(/^@/, "")}
              </a>
            </p>
          );
        case "twitter":
          return (
            <p key={key}>
              <FontAwesomeIcon icon={faTwitter} className="icon" />
              <a
                href={`https://twitter.com/${value.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                @{value.replace(/^@/, "")}
              </a>
            </p>
          );
        case "tiktok":
          return (
            <p key={key}>
              <FontAwesomeIcon icon={faTiktok} className="icon" />
              <a
                href={`https://tiktok.com/@${value.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                @{value.replace(/^@/, "")}
              </a>
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
    Donate
  </button>
  <button
    className="button"
    onClick={() => {
      window.open("/volunteer", "_blank");
    }}
  >
    Volunteer
  </button>
  <button
  className="button"
  onClick={() => {
    // Get specific content
    const organizationName = document.querySelector(".header").innerText;
    const dates = document.querySelector(".schedule-dropdown")?.innerText;
    const hours = document.querySelector(".horizontal-container p").innerText;
    const about = document.querySelector("h3 + p").innerText;
    const itemsNeeded = document.querySelector("h3 + p").innerText;
    
    // Get contact info if available
    let contactInfo = '';
    const contactElements = document.querySelectorAll(".info-column p");
    contactElements.forEach((el) => {
      contactInfo += el.innerText + '\n';
    });

    // Format the text you want to copy
    const textToCopy = `
      Organization: ${organizationName}
      Address: ${hours || "No address information available"}
      About: ${about || "No description available"}
      Items Needed: ${itemsNeeded || "No items needed information available"}
      Contact Info:
      ${contactInfo || "No contact information available"}
    `;

    // Copy the selected text to the clipboard
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("Information copied to clipboard! Please share this opportunity!"); 
      })
      .catch((err) => {
        console.error("Failed to copy content: ", err);
      });
  }}
>
  Share
</button>

</div>

      </div>
    </div>
  );
}