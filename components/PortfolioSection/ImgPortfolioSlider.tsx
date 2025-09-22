"use client";
import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ImgProtfolioSliderProps } from "@/types";
import Image from "next/image";

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
    // Breakpoints opcionales para responsividad si deseas más de una imagen a la vez
    // breakpoints: {
    //   "(min-width: 768px)": {
    //     slides: {
    //       perView: 2,
    //       spacing: 20,
    //     },
    //   },
    //   "(min-width: 1024px)": {
    //     slides: {
    //       perView: 3,
    //       spacing: 30,
    //     },
    //   },
    // },
  });

  return (
    <div
      ref={sliderRef}
      className={`keen-slider rounded-md overflow-hidden my-2 ${className}`}
    >
      {images
        .filter((src) => src !== "")
        .map((src, index) => (
          <div
            // *** CAMBIO CLAVE AQUÍ: Define una altura fija o máxima para el slide ***
            // Por ejemplo, `h-80` (320px) o `max-h-[320px]` para que el slide tenga un límite.
            // O `aspect-video` si todas tus imágenes son 16:9, o `aspect-square` para 1:1.
            // Para la captura que enviaste, un `h-80` o `h-96` podría funcionar bien inicialmente.
            className="keen-slider__slide flex justify-center items-center h-80 p-2"
            key={index}
          >
            <Image
              src={src}
              alt={`${altPrefix} ${index + 1}`}
              width={600} // Valor intrínseco para Next.js, no el tamaño mostrado final
              height={400} // Valor intrínseco para Next.js
              // Asegúrate de que estas clases de la imagen trabajen dentro del contenedor
              className="w-full h-full object-contain rounded-lg shadow-md"
            />
          </div>
        ))}
    </div>
  );
};

export default ImgProtfolioSlider;
