import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

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
