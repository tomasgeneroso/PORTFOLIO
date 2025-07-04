"use client";
import { TitleSeparator } from "@/components/TitleSeparator/TitleSeparator";
import { UserProps } from "@/types";
import React, { useState, useRef, MouseEvent } from "react";
const Experience: React.FC<UserProps> = ({ userData }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
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
  return (
    <section className="flex flex-col w-full" id="projectsSection">
      <TitleSeparator titleText="Experience" />
      <div className="flex flex-wrap w-full gap-4">
        <ol
          className="flex flex-row p-1 sm:flex w-full overflow-x-auto md:overflow-hidden"
          style={{
            scrollBehavior: "smooth",
            userSelect: "none",
            whiteSpace: "nowrap",
            cursor: isDragging ? "grabbing" : "grab",
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
                enterpriseicono,
                projectImage,
                date,
                description,
                technologies,
                link,
              },
              index
            ) => (
              <li
                key={index}
                className="relative mb-6 sm:mb-0 mx-2 sm:mx-4 py-2"
                style={{ width: "750px" }}
              >
                <div className="mt-3 sm:pe-8 w-[800px] px-4">
                  <div className="flex flex-row gap-x-8 my-8 text-center ">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {projectName}
                    </h3>
                  </div>
                  <div className=" overflow-hidden rounded-md">
                    {projectImage}
                  </div>
                  <p className="block my-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                    {new Date(date).toLocaleDateString()}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2 w-full">
                    {technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-gray-100 text-xs px-3 py-1 rounded-full shadow-sm whitespace-nowrap"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="text-wrap ">
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 break-words">
                      {description}
                    </p>
                  </div>
                  <a href={link} className="text-blue-500 underline">
                    View Project
                  </a>
                </div>
              </li>
            )
          )}
        </ol>
      </div>
      <div className="flex justify-center my-10">
        <button
          type="submit"
          className="py-3 px-5 text-sm font-normal text-center text-gray-700  bg-amber-100 ring ring-amber-100 rounded-md
            sm:w-fit transition duration-300 ease-in-out 
            hover:bg-white focus:ring-4 focus:outline-white focus:ring-amber-100 
            dark:bg-[#3D2548] dark:text-gray-300 dark:ring-[#777272] dark:hover:ring-[#777272] dark:hover:bg-[#777272]"
          onClick={() => (window.location.href = "/projects")}
        >
          See all projects
        </button>
      </div>
    </section>
  );
};

export default Experience;
