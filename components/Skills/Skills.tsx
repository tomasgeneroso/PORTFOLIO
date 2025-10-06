"use client";
import React from "react";
import { TitleSeparator } from "../TitleSeparator/TitleSeparator";
import { Progress } from "@heroui/react";
import { UserProps } from "@/types";
import { useI18n } from "@/lib/i18n/context";

const Skills: React.FC<UserProps> = ({ userData }) => {
  const { t } = useI18n();

  return (
    <section className="flex flex-col w-full min-h-screen" id="skillsSection">
      <TitleSeparator titleText={t.skills.title} />
      <div className="flex flex-wrap justify-center gap-8 md:gap-10 lg:gap-12 py-6 px-4">
        {userData.skills.map((skill, index) => (
          <div
            key={index}
            className="flex flex-col items-center w-20 sm:w-24 md:w-28 lg:w-32"
          >
            <div className="w-full aspect-square flex items-center justify-center mb-3">
              <div className="w-full h-full flex items-center justify-center">
                {React.cloneElement(skill.icono as React.ReactElement, {
                  size: undefined,
                  className: "w-full h-full object-contain",
                  style: { width: '100%', height: '100%' }
                })}
              </div>
            </div>
            <Progress
              className="w-full"
              color="primary"
              aria-label={`Skill ${index}`}
              value={skill.level}
              size="sm"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
