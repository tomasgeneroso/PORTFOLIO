import React from "react";
import { Tooltip } from "@heroui/react";
import Copy from "@/components/Icons/Copy"; // Ajusta la ruta según tu estructura de archivos
import { ProjectsCardProps } from "@/types";

const ProjectsCard: React.FC<ProjectsCardProps> = ({ projects }) => {
  const projectList = Object.entries(projects);

  // Función para copiar el enlace al portapapeles
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      //() => alert("Link copied!"),
      (err) => console.error("Failed to copy text: ", err)
    );
  };

  return (
    <div className="flex flex-col gap-6 md:py-4 w-full">
      {projectList.map(([projectName, projectDetails], index) => (
        <Tooltip
          key={index}
          content={
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(projectDetails.link)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Copy link"
              >
                <Copy size={16} />
              </button>
            </div>
          }
          placement="top"
          offset={-30}
          showArrow
        >
          <a
            href={projectDetails.link}
            className="flex flex-col items-center justify-center gap-4 w-full md:py-10"
          >
            <div className="flex flex-col text-center  justify-center px-10 py-4 w-full">
              {projectDetails.enterpriseicono && (
                <projectDetails.enterpriseicono className="w-6 h-6" />
              )}
              <h2 className="text-3xl text-white py-2">
                {projectDetails.projectName}
              </h2>
            </div>
            <div className="flex flex-col items-center justify-center w-full">
              {projectDetails.projectImage}
              <p className="text-sm text-gray-500 py-2">
                {projectDetails.date}
              </p>
              <p className="text-md py-2">{projectDetails.description}</p>
            </div>
          </a>
        </Tooltip>
      ))}
    </div>
  );
};

export default ProjectsCard;
