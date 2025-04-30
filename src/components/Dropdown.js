import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const Dropdown = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="max-w-thirdLargest mx-auto my-4">
      {/* Dropdown button */}
      <div
        className={`bg-black text-white px-4 ${
          isOpen ? "rounded-t-2xl" : "rounded-2xl"
        } shadow-md shadow-black/20 w-full mx-auto`}
      >
        <button
          onClick={toggleDropdown}
          className="flex justify-between w-full p-4 text-left focus:outline-none md:text-[1.15rem]"
          style={{
            fontFamily: "'Noto Sans', sans-serif",
            fontWeight: "bold",
          }}
        >
          <span>{title}</span>
          <FontAwesomeIcon
            icon={isOpen ? faChevronUp : faChevronDown}
            className="w-10 h-10 transition-transform duration-300"
          />
        </button>
      </div>

      {/* Dropdown content */}
      <div
        className={`w-full mx-auto bg-snow rounded-b-2xl shadow-md shadow-black/10 overflow-x-auto custom-scrollbar md:text-[1.1rem]`}
      >
        <div
          ref={contentRef}
          style={{
            maxHeight: isOpen ? `${contentRef.current.scrollHeight}px` : "0px",
            transition: "max-height 0.5s ease",
          }}
        >
          <div
            className="p-4 text-black"
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontWeight: "400",
            }}
          >
            <p className="text-left">{content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
