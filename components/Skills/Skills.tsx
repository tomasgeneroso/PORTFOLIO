import React from "react";
import { TitleSeparator } from "../TitleSeparator/TitleSeparator";
import { Progress } from "@nextui-org/react";
import CustomIcon from "@/components/Icons/CustomIcon";
import { UserProps } from "@/types";

const Skills: React.FC<UserProps> = (userData) => {
  return (
    <section className="flex flex-col w-full mx-0 h-screen" id="skillsSection">
      <TitleSeparator titleText="Skills" />
      <div className="flex flex-wrap w-full gap-4">
        {Object.entries(userData.userData.skills).map(([skill, details]) => (
          <div key={skill} className="flex flex-col items-center w-40 h-40">
            <div>
              {details.icono && (
                <CustomIcon svgContent={details.icono} className="w-40 h-40" />
              )}
            </div>
            <Progress
              className="sm"
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
