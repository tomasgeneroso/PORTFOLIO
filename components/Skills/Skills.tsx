import React from "react";
import { TitleSeparator } from "../TitleSeparator/TitleSeparator";
import { Progress } from "@heroui/react";
import { UserProps } from "@/types";

const Skills: React.FC<UserProps> = ({ userData }) => {
  return (
    <section className="flex flex-col w-full" id="skillsSection">
      <TitleSeparator titleText="Skills" />
      <div className="flex flex-wrap justify-center gap-6 py-6">
        {userData.skills.map((skill, index) => (
          <div
            key={index}
            className="flex flex-col items-center w-16 sm:w-20 md:w-24"
          >
            <div className="w-10 h-10 md:w-36 md:h-36 flex items-center justify-center">
              {skill.icono}
            </div>
            <Progress
              className="w-full mt-3"
              color="primary"
              aria-label={`Skill ${index}`}
              value={skill.level}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
