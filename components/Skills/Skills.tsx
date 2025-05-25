import React from "react";
import { TitleSeparator } from "../TitleSeparator/TitleSeparator";
import { Progress } from "@heroui/react";
import CustomIcon from "@/components/Icons/CustomIcon";
import { UserProps } from "@/types";

const Skills: React.FC<UserProps> = (userData) => {
  return (
    <section className="flex flex-col w-full mx-0 " id="skillsSection">
      <TitleSeparator titleText="Skills" />
      <div className="flex flex-wrap w-full gap-4 my-5 ml-5">
        {Object.entries(userData.userData.skills).map(([skill, details]) => (
          <div
            key={skill}
            className="flex flex-col items-center w-30 h-30 mx-4 mb-10 bottom-0"
          >
            <div className="">
              {details.icono && (
                <CustomIcon svgContent={details.icono} className="w-30 h-30" />
              )}
            </div>
            <Progress
              className="sm mt-6"
              color="primary"
              aria-label={skill}
              value={details.level}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
