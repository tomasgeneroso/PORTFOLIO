import React from "react";
import { Tooltip } from "@heroui/react";
import Copy from "@/components/Icons/Copy"; // Ajusta la ruta según tu estructura de archivos
import { ProjectsCardProps } from "@/types";

const ProjectsCard: React.FC<ProjectsCardProps> = ({ projects }) => {
  const projectList = Object.entries(projects);

  // Función para copiar el enlace al portapapeles
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => alert("Link copied!"),
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
              <span>{`${projectName}`}</span>
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
            <div className="flex flex-col text-center rounded border border-gray-300 justify-center px-10 py-4 w-full">
              <div className="flex flex-row items-center justify-center w-full space-x-10">
                <img
                  src={projectDetails.enterpriseicono}
                  alt={`${projectName} logo`}
                  className="w-14 h-14"
                />
                <h2 className="text-3xl py-2">{projectName}</h2>
              </div>
              <div className="flex flex-col items-center justify-center w-full">
                <img
                  src={projectDetails.projectImage}
                  alt={`${projectName} image`}
                  className="w-full h-auto my-4"
                />
                <p className="text-sm text-gray-500 py-2">
                  {projectDetails.date}
                </p>
                <p className="text-md py-2">{projectDetails.description}</p>
              </div>
            </div>
          </a>
        </Tooltip>
      ))}
    </div>
  );
};

export default ProjectsCard;
