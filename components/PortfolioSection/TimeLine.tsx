import { UserProps } from "@/types";
import React, { useState, useRef, MouseEvent } from "react";
import ScreenShot from "@/components/PortfolioSection/ScreenShot.png";
import DOLogo from "@/components/Images/DOlogoceleste.svg";
import logo from "@/components/Images/ClubSanMartinLogo.jpg";

const TimeLine: React.FC<UserProps> = (userData) => {
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

  return (
    <ol
      className="flex flex-row p-1 sm:flex w-full "
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
          <li
            key={index}
            className="relative mb-6 sm:mb-0  mx-4 py-2 "
            style={{ width: "600px" }}
          >
            <div className="mt-3 sm:pe-8 w-808">
              <div className="flex flex-row gap-x-8 my-8 text-center ">
                <div className="z-10 flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                  {enterpriseicono ? (
                    enterpriseicono({ width: 40, height: 40 }) // Ajusta el tamaño según sea necesario
                  ) : (
                    <svg
                      className="w-2.5 h-2.5 text-[#777272]"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {projectName}
                </h3>
              </div>
              {projectImage}
              <p className="block my-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                {new Date(date).toLocaleDateString()}
              </p>

              <div className="flex  gap-2 mb-2">
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 text-gray-100 text-xs px-3 py-1 rounded-full shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
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
