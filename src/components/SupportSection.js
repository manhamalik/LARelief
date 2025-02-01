import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ScrollArrow from "@/components/ScrollArrow";
import ResourceCard from "@/components/ResourceCard";
import Dropdown from "@/components/Dropdown";
import { Link } from "react-scroll";
import { scroller } from "react-scroll";
import { Link as ScrollLink } from "react-scroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  faMagnifyingGlass,
  faArrowDown,
  faCalendar,
  faCalendarAlt,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import "@fontsource/potta-one";
import CategoryButtons from "@/components/CategoryButtons";
import { filterResources } from "../components/filter";
import { motion, useInView } from "framer-motion";

// Dummy navigate function (replace with your own navigation logic)
const navigate = (url) => {
  window.location.href = url;
};

const SupportSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="support"
      className="bg-[#267738] min-h-screen flex items-center pb-8 overflow-hidden"
    >
      <div className="bg-[#267738]">
        <div className="w-[100vw] px-4 md:px-10 flex flex-col lg:flex-row">
          {/* Text Content */}
          <div className="flex flex-col justify-center items-start lg:w-1/2 text-white text-left">
            <div className="flex flex-col justify-center items-start h-full mx-auto">
              <h2 className="text-5xl md:text-6xl font-bold mb-4 w-[400px]">
                <span
                  className="text-[5.5rem]"
                  style={{
                    fontFamily: "'Dancing Script', cursive",
                    fontWeight: 400,
                  }}
                >
                  Be the hope
                </span>
                <br />
                <span
                  className="text-white text-[6rem]"
                  style={{
                    fontFamily: "'Noto Sans', sans-serif",
                    fontWeight: 800,
                  }}
                >
                  SOMEONE NEEDS
                </span>
              </h2>
              <motion.p
                className="text-[1.65rem] mb-8 w-[550px]"
                style={{ fontFamily: "'Noto Sans', sans-serif" }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                The Los Angeles community needs your help to provide essentials,
                shelter, medical care, and support for animals affected by the
                wildfires. Offer your time or resources to support those in
                need!
              </motion.p>
              <motion.div
                className="flex flex-col gap-4"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <button
                  onClick={() => navigate("/volunteer")}
                  className="bg-[#183917] text-white font-bold py-2 px-6 rounded-2xl hover:bg-white hover:text-[#183917] border border-white transition-all duration-300 flex items-center justify-between w-[16.3rem]"
                  style={{
                    fontFamily: "'Noto Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.8rem",
                  }}
                >
                  <span className="flex-grow text-left">VOLUNTEER</span>
                  <FontAwesomeIcon icon={faCaretRight} />
                </button>
                <button
                  onClick={() => navigate("/donate")}
                  className="bg-[#183917] text-white font-bold py-2 px-6 rounded-2xl hover:bg-white hover:text-[#183917] border border-white transition-all duration-300 flex items-center justify-between w-[16.3rem]"
                  style={{
                    fontFamily: "'Noto Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.8rem",
                  }}
                >
                  <span className="flex-grow text-left">DONATE</span>
                  <FontAwesomeIcon icon={faCaretRight} />
                </button>
              </motion.div>
            </div>
          </div>

          {/* Graphic Content Group, right side */}
          <div className="flex justify-center items-center lg:w-1/2">
            <div className="relative w-full flex justify-center">
              {/* Background SUPPORT text */}
              <div
                className="absolute inset-0 flex flex-col justify-center items-center z-0 text-[#184822] mr-10"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: 800,
                  lineHeight: "0.88",
                  fontSize: "12rem",
                  letterSpacing: "-0.5rem",
                }}
              >
                <motion.span
                  initial={{ y: 200, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  SUPPORT
                </motion.span>
                <motion.span
                  initial={{ y: 210, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  SUPPORT
                </motion.span>
                <motion.span
                  initial={{ y: 220, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  SUPPORT
                </motion.span>
                <motion.span
                  initial={{ y: 230, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  SUPPORT
                </motion.span>
              </div>

              {/* Globe Image */}
              <img
                src="/images/globe.png"
                alt="Earth Graphic"
                className="relative z-10 w-[45.25vw] mt-[9.5rem] ml-[3rem] mr-10"
              />
            </div>
          </div>
        </div>
        {/* Scroll Arrow Component */}
        <ScrollArrow to="faq" />
      </div>
    </section>
  );
};

export default SupportSection;
