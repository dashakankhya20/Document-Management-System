import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import image1 from "../images/image2.jpg";
import image2 from "../images/image3.jpg";
import image3 from "../images/bisag_bgImage.jpg";
import "./CarouselContainer.css";

const CarouselContainer = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const images = [image1, image2, image3];

  return (
    <Box className="carousel">
      {/* Previous button */}
      <IconButton className="icon-button prev" onClick={prevSlide}>
        <ArrowBackIosIcon />
      </IconButton>
      {/* Next button */}
      <IconButton className="icon-button next" onClick={nextSlide}>
        <ArrowForwardIosIcon />
      </IconButton>
      {/* Images */}
      <Box data-slides>
        {images.map((img, index) => (
          <Box key={index} className={`image-container ${index === activeIndex ? 'active' : ''}`}>
            <img src={img} alt={`Carousel ${index + 1}`} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CarouselContainer;
