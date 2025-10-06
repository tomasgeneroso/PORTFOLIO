import React from "react";
import { Tooltip } from "@heroui/react";
import Copy from "@/components/Icons/Copy";
import { useI18n } from "@/lib/i18n/context";
import { experienceTranslations } from "@/lib/i18n/userDataTranslations";

interface ExperienceItem {
  projectName: string;
  enterpriseicono?: React.ComponentType<any>;
  projectImage: React.ReactNode;
  date: string;
  description: string;
  technologies: string[];
  link: string;
}

interface ExperienceCardProps {
  experience: ExperienceItem[];
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  const { locale } = useI18n();

  // Función para copiar el enlace al portapapeles
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {},
      (err) => console.error("Failed to copy text: ", err)
    );
  };

  return (
    <div className="flex flex-col gap-6 md:py-4 w-full">
      {experience.map((exp, index) => {
        const translation = experienceTranslations[index]?.[locale];
        return (
          <Tooltip
            key={index}
            content={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(exp.link)}
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
              href={exp.link}
              className="flex flex-col items-center justify-center gap-4 w-full md:py-10"
            >
              <div className="flex flex-col text-center justify-center px-10 py-4 w-full">
                {exp.enterpriseicono && (
                  <exp.enterpriseicono className="w-6 h-6 mx-auto" />
                )}
                <h2 className="text-3xl text-white py-2">
                  {translation?.projectName || exp.projectName}
                </h2>
              </div>
              <div className="flex flex-col items-center justify-center w-full">
                <div className="w-full max-w-4xl">{exp.projectImage}</div>
                <p className="text-sm text-gray-500 py-2">
                  {new Date(exp.date).toLocaleDateString()}
                </p>
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  {(translation?.technologies || exp.technologies).map(
                    (tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="bg-gray-700 text-gray-100 text-xs px-3 py-1 rounded-full shadow-sm"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
                <p className="text-md py-2 max-w-3xl text-center px-4">
                  {translation?.description || exp.description}
                </p>
              </div>
            </a>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default ExperienceCard;
