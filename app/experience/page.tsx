"use client";
import React from "react";
import { title } from "@/components/primitives";
import ExperienceCard from "@/app/experience/components/ExperienceCard";
import userData from "@/components/userData";

const ExperiencePage: React.FC = () => {
  const experience = userData.experience;
  return (
    <div className="w-full flex flex-col items-center justify-center text-center min-h-screen py-8">
      <h1 className={`${title()}, pb-1`}>Experience</h1>
      <div className="flex flex-col items-center justify-center mx-auto w-full max-w-4xl">
        <ExperienceCard experience={experience} />
      </div>
    </div>
  );
};

export default ExperiencePage;
