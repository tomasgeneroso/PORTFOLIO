"use client";
import React, { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ImgProtfolioSliderProps } from "@/types";
import Image from "next/image";

const ImgProtfolioSlider: React.FC<ImgProtfolioSliderProps> = ({
  images,
  altPrefix = "Slide",
  className = "",
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const filteredImages = images.filter((src) => src !== "");

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
      spacing: 15,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  return (
    <div className="relative">
      <div
        ref={sliderRef}
        className={`keen-slider rounded-md overflow-hidden my-2 scrollbar-hide ${className}`}
      >
        {filteredImages.map((src, index) => (
          <div
            className="keen-slider__slide flex justify-center items-center h-80 p-2"
            key={index}
          >
            <Image
              src={src}
              alt={`${altPrefix} ${index + 1}`}
              width={600}
              height={400}
              className="w-full h-full object-contain rounded-lg shadow-md"
            />
          </div>
        ))}
      </div>

      {/* Dots Navigation - solo mostrar si hay más de una imagen */}
      {filteredImages.length > 1 && (
        <div className="flex gap-2 mt-2 justify-center">
          {filteredImages.map((_, index) => (
            <span
              key={index}
              onClick={() => {
                instanceRef.current?.moveToIdx(index);
              }}
              className="w-2 h-2 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                backgroundColor: "#c2c2c2aa",
                opacity: currentSlide === index ? 1 : 0.4,
                transform: currentSlide === index ? "scale(1.2)" : "scale(1)",
              }}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImgProtfolioSlider;
