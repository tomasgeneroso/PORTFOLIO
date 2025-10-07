import { UserProps } from "@/types";
import React, { useState, useRef, MouseEvent, useEffect } from "react";
import ImgProtfolioSlider from "@/components/PortfolioSection/ImgPortfolioSlider";

const TimeLine: React.FC<UserProps> = (userData) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchScrollLeft, setTouchScrollLeft] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const listRef = useRef<HTMLOListElement | null>(null);

  const handleMouseDown = (e: MouseEvent<HTMLOListElement>) => {
    setIsDragging(true);
    setStartX(e.clientX);
    if (listRef.current) setScrollLeft(listRef.current.scrollLeft);
  };

  const handleMouseMove = (e: MouseEvent<HTMLOListElement>) => {
    if (!isDragging || startX === null) return;
    e.preventDefault();
    const walk = (e.clientX - startX) * 2;
    if (listRef.current) listRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent<HTMLOListElement>) => {
    setTouchStartX(e.touches[0].clientX);
    if (listRef.current) setTouchScrollLeft(listRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLOListElement>) => {
    if (touchStartX === null) return;
    const walk = (e.touches[0].clientX - touchStartX) * 2;
    if (listRef.current) listRef.current.scrollLeft = touchScrollLeft - walk;
  };

  const handleTouchEnd = () => setTouchStartX(null);

  // ➕ Detectar el índice visible
  useEffect(() => {
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
    <div className="w-full flex flex-col items-center">
      <ol
        className="flex flex-row p-1 sm:flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
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
        {userData.userData.projects.map((project, index) => (
          <li
            key={index}
            className="flex-shrink-0 snap-center px-4 py-2 relative"
            style={{ width: "100%" }}
          >
            <div className="mt-3 sm:pe-8 w-full max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-y-4 gap-x-8 my-4 text-center sm:text-left items-center">
                <div className="z-10 flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full ring-0 ring-white dark:bg-gray-800 sm:ring-8 dark:ring-gray-900 shrink-0">
                  {project.enterpriseicono ? (
                    React.createElement(project.enterpriseicono, {
                      width: 32,
                      height: 32,
                    })
                  ) : (
                    <svg
                      className="w-2.5 h-2.5 text-gray-700 dark:text-gray-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  {project.projectName}
                </h3>
              </div>

              <div className="w-full h-auto overflow-hidden rounded-md my-2">
                {project.projectImage.length > 0 && (
                  <ImgProtfolioSlider images={project.projectImage} />
                )}
              </div>

              <p className="block my-2 text-sm md:text-base font-normal leading-none text-gray-400 dark:text-gray-500">
                {new Date(project.date).toLocaleDateString()}
              </p>

              <div className="text-left space-y-2 mt-2">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-gray-100 text-sm px-2.5 py-1 rounded-full shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <p className="text-base md:text-sm font-normal text-wrap text-gray-500 dark:text-gray-400">
                  {project.description}
                </p>
                <a
                  href={project.link || "#"}
                  className="text-grey-100 hover:underline transition duration-300 ease-in-out text-base md:text-lg font-normal text-gray-700 dark:text-gray-300 hover:text-primary focus:text-primary focus:font-medium"
                >
                  View project
                </a>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* Indicador de puntos */}
      <div className="flex gap-2 mt-4">
        {userData.userData.projects.slice(0, 3).map((_, index) => (
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
  );
};

export default TimeLine;
