"use client";
import React from "react";
import { TitleSeparator } from "../TitleSeparator/TitleSeparator";
import { Progress } from "@heroui/react";
import { UserProps } from "@/types";
import { useI18n } from "@/lib/i18n/context";
import { StaggerContainer, StaggerItem } from "@/components/Animations/SectionReveal";

const Skills: React.FC<UserProps> = ({ userData }) => {
  const { t } = useI18n();

  return (
    <section className="flex flex-col w-full min-h-screen" id="skillsSection">
      <TitleSeparator titleText={t.skills.title} />
      <div className="w-full px-4 md:px-8 lg:px-12 py-6">
        <StaggerContainer
          staggerDelay={0.05}
          className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10 lg:gap-x-8 lg:gap-y-12 w-full"
        >
          {userData.skills.map((skill, index) => (
            <StaggerItem
              key={index}
              className="flex flex-col items-center justify-start w-full"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mb-3 transition-transform hover:scale-110 duration-300">
                {React.cloneElement(skill.icono as React.ReactElement, {
                  className: "w-20 h-20 md:w-24 md:h-24 object-contain"
                })}
              </div>
              <Progress
                className="w-full"
                color="primary"
                aria-label={`Skill ${index}`}
                value={skill.level}
                size="sm"
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default Skills;
