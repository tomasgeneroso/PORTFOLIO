"use client";
import React from "react";
import { title } from "@/components/primitives";
import ProjectsCard from "@/app/projects/components/ProjectsCard";

import userData from "@/components/userData";

const ProjectsPage: React.FC = () => {
  const projects = userData.projects;
  return (
    <div className="w-full justify-center text-center ">
      <h1 className={`${title()}, pb-1`}>Projects</h1>
      <div className="flex flex-col items-center justify-center mx-auto w-full">
        <ProjectsCard projects={projects} />
      </div>
    </div>
  );
};

export default ProjectsPage;
