import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

// Custom dot component
const CustomDot = ({ onClick, ...rest }) => {
  const { active } = rest;
  return (
    <li
      className={`custom-dot ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <button />
      <style jsx>{`
        li.custom-dot {
          display: inline-block;
          margin: 0 8px;
          cursor: pointer;
          margin-bottom: 1vw;
        }
        li.custom-dot button {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: none;
          background-color: white; /* Inactive dot */
          outline: none;
        }
        li.custom-dot.active button {
          background-color: black; /* Active dot */
        }
      `}</style>
    </li>
  );
};

const DetailImageCarousel = ({ imageArray }) => {
  const responsiveProp = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 1 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
  };

  return (
    <div className="carousel-container">
      <Carousel
        swipeable={true}
        draggable={true}
        responsive={responsiveProp}
        infinite={true}
        showDots={true}
        customDot={<CustomDot />}
        transitionDuration={300}
      >
        {imageArray.map((image, index) => (
          <div className="carousel-image-container" key={index}>
            <img
              src={image}
              alt={`Image ${index + 1}`}
              className="carousel-image"
            />
          </div>
        ))}
      </Carousel>
      <style jsx>{`
        .carousel-container {
          width: 100%;
          height: 100%;
          position: relative;
        }
        .carousel-image-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
        .carousel-image {
          width: 100%;
          height: 100vh;
          object-fit: cover;
        }
        @media only screen and (max-width: 768px) {
          .carousel-image {
            height: 50vh;
          }
        }
      `}</style>
    </div>
  );
};

export default DetailImageCarousel;
