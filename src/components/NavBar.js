import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

const NavBar = ({ opacity = 100, isShopEnabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (sectionId) => {
    if (router.pathname === "/") {
      // If already on the index page, scroll directly to the section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // Navigate to the index page and scroll to the section
      router.push(`/#${sectionId}`);
    }
  };

  useEffect(() => {
    const handleRouteChange = () => setIsOpen(false);

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    if (router.pathname === "/") {
      const handleScroll = () => {
        const scrollY = window.scrollY;
        const heroHeight = document.querySelector("#hero")?.offsetHeight || 0;
        const offset = 70;

        if (scrollY > heroHeight - offset) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(false);
    }
  }, [router.pathname]);

  const isHomePage = router.pathname === "/";
  const initialBackgroundColor = isHomePage ? "bg-transparent" : "bg-black";

  return (
    <nav
      className={`sticky top-0 z-50 py-4 md:px-4 text-white transition-all duration-300 ${
        isHomePage && isScrolled ? "bg-[#183917]" : initialBackgroundColor
      }`}
    >
      <div className="relative flex justify-between px-4 md:px-0 items-center">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Image
              src="/images/larelieflogo.png"
              alt="Logo"
              className="h-7 w-auto cursor-pointer"
              height={40}
              width={200}
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center">
          <div className="flex space-x-6">
            <span
              onClick={() => handleNavigation("map")}
              className="group relative font-sans font-semibold transition-transform ease-in-out duration-300 cursor-pointer"
            >
              Map
              <div className="h-0.5 bg-white transition-all duration-300 ease-in-out group-hover:w-full w-0"></div>
            </span>
            <Link href="/volunteer">
              <span className="group relative font-sans font-semibold transition-transform ease-in-out duration-300">
                Volunteer
                <div className="h-0.5 bg-white transition-all duration-300 ease-in-out group-hover:w-full w-0"></div>
              </span>
            </Link>
            <Link href="/donate">
              <span className="group relative font-sans font-semibold transition-transform ease-in-out duration-300">
                Donate
                <div className="h-0.5 bg-white transition-all duration-300 ease-in-out group-hover:w-full w-0"></div>
              </span>
            </Link>
            <span
              onClick={() => handleNavigation("faq")}
              className="group relative font-sans font-semibold transition-transform ease-in-out duration-300 cursor-pointer"
            >
              FAQs
              <div className="h-0.5 bg-white transition-all duration-300 ease-in-out group-hover:w-full w-0"></div>
            </span>
            <Link href="/contact">
              <span className="group relative font-sans font-semibold transition-transform ease-in-out duration-300">
                Contact
                <div className="h-0.5 bg-white transition-all duration-300 ease-in-out group-hover:w-full w-0"></div>
              </span>
            </Link>
          </div>

          {/* Language Dropdown */}
          <div
            className="relative ml-6"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              className={`flex items-center space-x-2 px-3 py-1 bg-transparent border border-gray-300 hover:bg-white hover:bg-opacity-30 focus:outline-none transition ease-in-out duration-300 ${
                isDropdownOpen ? "rounded-t-md" : "rounded-md"
              }`}
            >
              <img
                src="/images/language-icon.png"
                alt="Language Icon"
                className="w-auto h-3"
              />
              <span className="font-sans font-semibold text-white">English</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3"
                stroke="currentColor"
                className={`w-4 h-4 transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              className={`absolute ${
                isDropdownOpen ? "block" : "hidden"
              } bg-transparent shadow-lg w-full border border-gray-300 rounded-b-md`}
            >
              <ul className="bg-transparent">
                <li>
                  <Link
                    href="#"
                    className="block px-3 py-1 font-sans font-semibold bg-white bg-opacity-90 hover:bg-white hover:bg-opacity-100 text-gray-500"
                  >
                    English
                  </Link>
                </li>
                <li className="border-t border-gray-300">
                  <Link
                    href="#"
                    className="block px-3 py-1 font-sans font-semibold bg-white bg-opacity-90 hover:bg-white hover:bg-opacity-100 text-gray-500"
                  >
                    Spanish
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <Image
              src="/images/mobile-menu.png"
              alt="Menu"
              className="h-8 w-auto"
              width={32}
              height={32}
            />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
