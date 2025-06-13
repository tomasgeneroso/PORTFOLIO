"use client";

import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ImgProtfolioSliderProps } from "@/types";

const ImgProtfolioSlider: React.FC<ImgProtfolioSliderProps> = ({
  images,
  altPrefix = "Slide",
  className = "",
}) => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
      spacing: 15,
    },
  });

  return (
    <div
      ref={sliderRef}
      className={`keen-slider rounded-md overflow-hidden my-2 ${className}`}
    >
      {images
        .filter((src) => src !== "")
        .map((src, index) => (
          <div className="keen-slider__slide" key={index}>
            <img
              src={src}
              className="h-80 w-full object-contain"
              alt={`${altPrefix} ${index + 1}`}
            />
          </div>
        ))}
    </div>
  );
};

export default ImgProtfolioSlider;
