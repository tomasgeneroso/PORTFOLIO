"use client";
import { TitleSeparator } from "@/components/TitleSeparator/TitleSeparator";
import { UserProps } from "@/types";
import { useI18n } from "@/lib/i18n/context";
import { experienceTranslations } from "@/lib/i18n/userDataTranslations";
import React, { useState, useRef, MouseEvent } from "react";

const Experience: React.FC<UserProps> = ({ userData }) => {
  const { locale, t } = useI18n();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  // Añade una propiedad HTMLElement para las listas
  const listRef = useRef<HTMLOListElement | null>(null);

  const handleMouseDown = (e: MouseEvent<HTMLOListElement>) => {
    setIsDragging(true);
    setStartX(e.clientX);
    if (listRef.current) {
      setScrollLeft(listRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLOListElement>) => {
    if (!isDragging || startX === null) return;
    e.preventDefault();
    const x = e.clientX;
    const walk = (x - startX) * 2; // Velocidad del desplazamiento
    if (listRef.current) {
      const newScrollLeft = scrollLeft - walk;
      listRef.current.scrollLeft = newScrollLeft;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchScrollLeft, setTouchScrollLeft] = useState<number>(0);

  const handleTouchStart = (e: React.TouchEvent<HTMLOListElement>) => {
    setTouchStartX(e.touches[0].clientX);
    if (listRef.current) {
      setTouchScrollLeft(listRef.current.scrollLeft);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLOListElement>) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    const walk = (currentX - touchStartX) * 2;
    if (listRef.current) {
      listRef.current.scrollLeft = touchScrollLeft - walk;
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(null);
  };

  // Detectar el índice visible
  React.useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current) return;
      const scrollX = listRef.current.scrollLeft;
      const itemWidth = listRef.current.clientWidth;
      const index = Math.round(scrollX / itemWidth);
      setActiveIndex(index);
    };

    const ref = listRef.current;
    if (ref) ref.addEventListener("scroll", handleScroll);

    return () => {
      if (ref) ref.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="flex flex-col w-full" id="experienceSection">
      <TitleSeparator titleText={t.experience.title} />
      <div className="flex flex-wrap w-full gap-4">
        <ol
          className="flex flex-row p-1 sm:flex w-full overflow-x-auto md:overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{
            scrollBehavior: "smooth",
            userSelect: "none",
            whiteSpace: "nowrap",
            cursor: isDragging ? "grabbing" : "grab",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          ref={listRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {userData.experience.map(
            (
              {
                projectName,
                projectImage,
                date,
                description,
                technologies,
                link,
              },
              index
            ) => {
              const translation = experienceTranslations[index]?.[locale];
              return (
                <li
                  key={index}
                  className="relative mb-6 sm:mb-0 mx-2 sm:mx-4 py-2 flex-shrink-0 snap-center"
                  style={{ width: "100%" }}
                >
                  <div className="mt-3 sm:pe-8 w-full px-4 max-w-4xl mx-auto">
                    <div className="flex flex-row gap-x-8 my-8 text-center ">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        {translation?.projectName || projectName}
                      </h3>
                    </div>
                    <div className=" overflow-hidden rounded-md">
                      {projectImage}
                    </div>
                    <p className="block my-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                      {new Date(date).toLocaleDateString()}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2 w-full">
                      {(translation?.technologies || technologies).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="bg-gray-700 text-gray-100 text-xs px-3 py-1 rounded-full shadow-sm whitespace-nowrap"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="text-wrap ">
                      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 break-words">
                        {translation?.description || description}
                      </p>
                    </div>
                    <a
                      href={link}
                      className="text-grey-100 hover:underline transition duration-300 ease-in-out text-sm font-normal text-gray-700 dark:text-gray-300 hover:text-primary focus:text-primary focus:font-medium"
                    >
                      {t.experience.viewProject}
                    </a>
                  </div>
                </li>
              );
            }
          )}
        </ol>

        {/* Dots Navigation */}
        <div className="flex gap-2 mt-4 justify-center">
          {userData.experience.map((_, index) => (
            <span
              key={index}
              onClick={() => {
                if (listRef.current) {
                  const itemWidth = listRef.current.clientWidth;
                  listRef.current.scrollTo({
                    left: index * itemWidth,
                    behavior: "smooth",
                  });
                }
              }}
              className="w-3 h-3 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                backgroundColor: "#c2c2c2aa",
                opacity: activeIndex === index ? 1 : 0.4,
                transform: activeIndex === index ? "scale(1.2)" : "scale(1)",
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center my-10">
        <button
          type="submit"
          className="py-3 px-5 text-sm font-normal text-center text-gray-700  bg-amber-100 ring ring-amber-100 rounded-md
            sm:w-fit transition duration-300 ease-in-out
            hover:bg-white focus:ring-4 focus:outline-white focus:ring-amber-100
            dark:bg-[#3D2548] dark:text-gray-300 dark:ring-[#777272] dark:hover:ring-[#777272] dark:hover:bg-[#777272]"
          onClick={() => (window.location.href = "/experience")}
        >
          {t.experience.seeAll}
        </button>
      </div>
    </section>
  );
};

export default Experience;
