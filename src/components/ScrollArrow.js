import React from "react";
import { Link } from "react-scroll";

export default function ScrollArrow({ to, offset = 0, duration = 500 }) {
  return (
    <div
      className="absolute bottom--50 w-full flex justify-center items-center"
    >
      <Link
        to={to}
        className="text-white cursor-pointer hover:text-gray-300 transition-all duration-300"
        spy={true}
        smooth={true}
        offset={offset}
        duration={duration}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-16 h-16"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Link>
    </div>
  );
}
