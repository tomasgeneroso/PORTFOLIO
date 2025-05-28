import React, { useEffect, useRef } from "react";
import { Progress } from "@heroui/react";
import CustomIcon from "@/components/Icons/CustomIcon";
import { UserProps } from "@/types";

const SkillsSlider: React.FC<UserProps> = ({ userData }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let scrollAmount = 0;
    const scrollStep = 1; // px per frame
    const scrollDelay = 20; // ms

    const interval = setInterval(() => {
      if (!slider) return;
      scrollAmount += scrollStep;
      slider.scrollLeft += scrollStep;

      // Reiniciar al llegar al final
      if (slider.scrollLeft >= slider.scrollWidth / 2) {
        slider.scrollLeft = 0;
      }
    }, scrollDelay);

    return () => clearInterval(interval);
  }, []);

  const skillEntries = Object.entries(userData.skills);
  const repeatedSkills = [...skillEntries, ...skillEntries];

  return (
    <div className="flex flex-col w-full mx-0 my-2 px-2">
      <div
        ref={sliderRef}
        className="overflow-hidden whitespace-nowrap w-full my-10"
      >
        <div className="inline-flex animate-scroll gap-8">
          {repeatedSkills.map(([skill, details], index) => (
            <div
              key={`${skill}-${index}`}
              className="flex flex-col items-center min-w-[100px]"
            >
              {details.icono && (
                <CustomIcon svgContent={details.icono} className="w-30 h-30" />
              )}
              <Progress
                className="mt-4 w-20"
                color="primary"
                aria-label={skill}
                value={details.level}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsSlider;
