import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBurger,
  faShirt,
  faBath,
  faMoneyBill,
  faHouse,
  faBus,
  faGavel,
  faKitMedical,
  faUsers,
  faDog,
  faPaw,
} from "@fortawesome/free-solid-svg-icons";

// Mapping categories to icons with colors
const categoryIcons = {
  "Food & Water": { icon: faBurger, color: "#015BC3" },
  "Clothing & Personal Items": { icon: faShirt, color: "#015BC3" },
  "Hygiene & Sanitation": { icon: faBath, color: "#015BC3" },
  "Financial Assistance": { icon: faMoneyBill, color: "#015BC3" },
  "Shelters & Housing Assistance": { icon: faHouse, color: "#4D03CD" },
  "Transportation Assistance": { icon: faBus, color: "#4D03CD" },
  "Legal Aid": { icon: faGavel, color: "#4D03CD" },
  "Medical Aid & First Aid": { icon: faKitMedical, color: "#CC0000" },
  "Mental Health Support": { icon: faUsers, color: "#CC0000" },
  "Animal Boarding": { icon: faDog, color: "#CF5700" },
  "Veterinary Care & Pet Food": { icon: faPaw, color: "#CF5700" },
};

// CategoryButtons component
const CategoryButtons = ({
  categories,
  selectedCategories = [],
  handleCategoryClick,
  mainCategory,
}) => {
  return (
    <div className="category-buttons flex flex-wrap gap-4">
      {categories.map((category) => (
        <button
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
            fontFamily: "'noto sans', sans-serif",
            fontWeight: "700",
            color: "black",
          }}
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
            }}
          >
            {category}
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategoryButtons;