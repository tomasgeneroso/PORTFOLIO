import { UserProps } from "@/types";
import React, { useState, useRef, MouseEvent } from "react";
import ImgProtfolioSlider from "@/components/PortfolioSection/ImgPortfolioSlider";
const TimeLine: React.FC<UserProps> = (userData) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchScrollLeft, setTouchScrollLeft] = useState<number>(0);
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
    const walk = (x - startX) * 2;
    if (listRef.current) {
      listRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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
            className="w-[95vw] sm:w-2/3 min-w-[80%] sm:min-w-[33.3333%] flex-shrink-0 px-4 py-2 relative"
          >
            <div className="mt-3 sm:pe-8 w-808">
              <div className="flex flex-col sm:flex-row gap-y-4 gap-x-8 my-4 text-center sm:text-left items-center">
                <div className="z-10 flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                  {enterpriseicono ? (
                    React.createElement(enterpriseicono, {
                      width: 40,
                      height: 40,
                    })
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

              <div className="w-full  h-auto overflow-hidden rounded-md my-2">
                {projectImage.length > 0 ? (
                  <ImgProtfolioSlider images={projectImage} />
                ) : null}
              </div>

              <p className="block my-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                {new Date(date).toLocaleDateString()}
              </p>
              <div className="text-left space-y-2 mt-2">
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-gray-100 text-xs px-3 py-1 rounded-full shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <p className="text-base font-normal text-wrap text-gray-500 dark:text-gray-400 md:text-sm">
                  {description}
                </p>

                <a href={link} className="text-blue-500 underline">
                  View Project
                </a>
              </div>
            </div>
          </li>
        )
      )}
    </ol>
  );
};

export default TimeLine;
