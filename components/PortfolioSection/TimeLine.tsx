import { UserProps } from "@/types";
import React, { useState, useRef, MouseEvent } from "react";
import ScreenShot from "@/components/PortfolioSection/ScreenShot.png";
const TimeLine: React.FC<UserProps> = (userData) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  // Cambia el tipo a HTMLOListElement
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

  return (
    <ol
      className="items-center sm:flex w-full "
      style={{
        scrollBehavior: "smooth",
        userSelect: "none",
        whiteSpace: "nowrap",
        overflow: "hidden",
        cursor: isDragging ? "grabbing" : "grab",
      }}
      ref={listRef} // La referencia ahora es del tipo correcto
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {userData.userData.projects.map(
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
          <li key={index} className="relative mb-6 sm:mb-0 w-full mx-4">
            <div className="flex items-center">
              <div className="z-10 flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                {enterpriseicono ? (
                  <img src={enterpriseicono} alt="" />
                ) : (
                  <svg
                    className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                )}
              </div>
              <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
            </div>
            <div className="mt-3 sm:pe-8 w-808">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {projectName}
              </h3>
              <img src={ScreenShot.src} width={300} height={500} alt="" />
              <p className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                {new Date(date).toLocaleDateString()}
              </p>
              <span>{technologies.join(", ")}</span>
              <div className="text-wrap ">
                <p className="text-base font-normal text-gray-500 dark:text-gray-400 ">
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
  );
};

export default TimeLine;
