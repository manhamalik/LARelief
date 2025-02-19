import React from "react";
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
  faBoxOpen,
  faBowlFood,
  faCar,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

// Mapping categories to icons with colors
const categoryIcons = {
  // resource categories
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
  // volunteer categories
  "Food & Water Distribution": { icon: faBurger, color: "#015BC3" },
  "Clothing & Supplies Distribution": { icon: faShirt, color: "#015BC3" },
  "Donation Sorting & Packing": { icon: faBoxOpen, color: "#015BC3" },
  "Shelter Assistance": { icon: faHouse, color: "#4D03CD" },
  "Transportation & Delivery Support": { icon: faCarSide, color: "#4D03CD" },
  "Medical Aid Support": { icon: faBriefcaseMedical, color: "#CC0000" },
  "Animal Shelter Assistance": { icon: faDog, color: "#CF5700" },
  "Animal Rescue & Transport": { icon: faPaw, color: "#CF5700" },
  "Pet Supply Distribution": { icon: faBowlFood, color: "#CF5700" },
  // donate categories
  "Clothing & Bedding": { icon: faShirt, color: "#015BC3" },
  "Hygiene & Sanitation Supplies": { icon: faBath, color: "#015BC3" },
  "Monetary Donations (Essentials)": {
    icon: faMoneyBillWave,
    color: "#015BC3",
  },
  "Emergency Supplies": { icon: faHouse, color: "#4D03CD" },
  "Monetary Donations (Shelter & Support Services)": {
    icon: faMoneyBillWave,
    color: "#4D03CD",
  },
  "Medical Supplies": { icon: faBriefcaseMedical, color: "#CC0000" },
  "Monetary Donations (Medical & Health)": {
    icon: faMoneyBillWave,
    color: "#CC0000",
  },
  "Pet Supplies": { icon: faPaw, color: "#CF5700" },
  "Monetary Donations (Animal Support)": {
    icon: faMoneyBillWave,
    color: "#CF5700",
  },
};

const CategoryButtons = ({
  categories,
  selectedCategories = [],
  handleCategoryClick,
  mainCategory,
}) => {
  return (
    <div className="category-buttons flex flex-wrap gap-4">
      {categories.map((category) => (
        <motion.button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={`flex items-center font-bold px-4 py-2 rounded-full ${
            selectedCategories.includes(category)
              ? "text-white"
              : "text-[#183917] bg-white"
          }`}
          style={{
            backgroundColor: selectedCategories.includes(category)
              ? categoryIcons[category].color
              : "white",
            fontFamily: "'Noto Sans Multani', sans-serif",
            fontWeight: "700",
            color: "black",
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          {categoryIcons[category] && (
            <FontAwesomeIcon
              icon={categoryIcons[category].icon}
              style={{
                color: selectedCategories.includes(category)
                  ? "white"
                  : categoryIcons[category].color,
                width: "24px",
              }}
              className="mr-2"
            />
          )}
          <span
            style={{
              color: selectedCategories.includes(category) ? "white" : "black",
              fontFamily: "'Noto Sans Multani', sans-serif",
            }}
          >
            {category}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryButtons;
