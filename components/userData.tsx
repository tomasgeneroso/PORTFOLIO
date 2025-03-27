import { ReactIcon, JavascriptIcon } from "@/components/Icons/SkillIcons";
import React from "react";

const userData = {
  name: "Tomas",
  surname: "Generoso",
  phone: "+39 351 382 2180",
  email: "tomasgeneroso90@gmail.com",
  photo: "", //Está al pedo porque en realidad se carga directo en el componente. Está escrito para cuando sea de la DB
  links: {
    Github: "https://github.com/tomasgeneroso/PORTAFOLIO",
    Linkedin: "https://www.linkedin.com/in/tomas-generoso/",
    Gmail: "tomasgeneroso90@gmail.com",
  },
  aboutMe: `I'm Tomas, I'm 25 years old and I live in Berlin. I consider myself a positive, communicative, analytical and collaborative person, always motivated to improve and achieve my goals.

I enjoy sports and music, especially techno, rap, rock, reggae, blues and jazz. I speak Spanish (native), English (C1), Italian (C1) and German (A2). I am interested in emerging technologies, especially artificial intelligence and its application in process optimisation.

My background includes a bachelor's degree in Economics and three years of studies in Information Systems Engineering, as well as courses in UX/UI and backend development. Throughout my career, I have worked in software development, interface design, process optimization and entrepreneurship, gaining experience with SQL, PostgreSQL, MySQL, JavaScript, TypeScript, React, Java, C#, among other technologies.`,

  testimonies: [
    {
      author: "John Doe",
      photo: "https://placehold.co/",
      projectLink: "https://example.com/project1",
      testimonial:
        "This product has been a game-changer for my business. It has saved me so much time and money.",
    },
    {
      author: "Jane Smith",
      photo: "https://placehold.co/",
      projectLink: "https://example.com/project2",
      testimonial:
        "The team at NextUI is amazing. They are always there to help and their product is top-notch.",
    },
  ],
  skills: [
    {
      icono: <JavascriptIcon size={160} />,
      level: 80,
      color: "blue",
    },
    {
      icono: <ReactIcon size={160} />,
      level: 90,
      color: "red",
    },
  ],
  projects: [
    {
      projectName: "ProjectName1",
      enterpriseicono: "",
      projectImage: "../images/prueba1.png",
      date: new Date("2023-12-01").toISOString(),
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Solu tempora eligendi at ipsum.",
      technologies: ["Nodejs", "Tailwind", "MongoDB"],
      link: "https://github.com/tomasgeneroso/PORTAFOLIO",
    },
    {
      projectName: "ProjectName3",
      enterpriseicono: "",
      projectImage: "../images/prueba1.png",
      date: new Date("2023-12-01").toISOString(),
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Solu tempora eligendi at ipsum.",
      technologies: ["Nodejs", "Tailwind", "MongoDB"],
      link: "https://google.com",
    },
  ],
};
export default userData;
