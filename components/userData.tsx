import {
  ReactIcon,
  JavascriptIcon,
  LaravelIcon,
  ExpressIcon,
  DockerIcon,
  MongoLogo,
  ShopifyIcon,
  WordpressIcon,
  TypeScriptLogo,
  PostgreSQLLogo,
  TailwindIcon,
  PythonLogo,
  BlenderLogo,
  Cordova,
  CSharpLogo,
  Java,
} from "@/components/Icons/SkillIcons";
import { JSX, ClassAttributes, ImgHTMLAttributes } from "react";

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
      level: 80,
      color: "red",
    },
    {
      icono: <ExpressIcon size={160} />,
      level: 90,
      color: "red",
    },
    {
      icono: <LaravelIcon size={160} />,
      level: 70,
      color: "red",
    },
    {
      icono: <DockerIcon size={160} />,
      level: 50,
      color: "red",
    },
    {
      icono: <MongoLogo size={160} />,
      level: 90,
      color: "red",
    },
    {
      icono: <ShopifyIcon size={160} />,
      level: 70,
      color: "red",
    },
    {
      icono: <WordpressIcon size={160} />,
      level: 70,
      color: "red",
    },
    {
      icono: <TypeScriptLogo size={160} />,
      level: 70,
      color: "red",
    },
    {
      icono: <PostgreSQLLogo size={160} />,
      level: 70,
      color: "red",
    },
    {
      icono: <TailwindIcon size={160} />,
      level: 80,
      color: "red",
    },
    {
      icono: <PythonLogo size={150} />,
      level: 60,
      color: "red",
    },
    {
      icono: <BlenderLogo size={150} />,
      level: 70,
      color: "red",
    },
    {
      icono: <Cordova size={150} />,
      level: 40,
      color: "red",
    },
    {
      icono: <CSharpLogo size={150} />,
      level: 40,
      color: "red",
    },
    {
      icono: <Java size={150} />,
      level: 40,
      color: "red",
    },
  ],
  projects: [
    {
      projectName: "ZAIFO",
      enterpriseicono: (
        props: JSX.IntrinsicAttributes &
          ClassAttributes<HTMLImageElement> &
          ImgHTMLAttributes<HTMLImageElement>
      ) => <img src="./Images/ZAIFOminilogo.svg" alt="ZAIFO logo" {...props} />,
      projectImage: <img src="./Images/prueba1.png" alt="ZAIFO logo" />,
      date: "2018-07-01",
      description:
        "It was my first entrepreneurship, an appweb where you can hire some constructor or plumber for example, to fix something or start some new project at home",
      technologies: ["HTML", "CSS", "Javascript", "Project Owner"],
      link: "https://github.com/tomasgeneroso/PORTAFOLIO",
    },
    {
      projectName: "DO",
      enterpriseicono: (
        props: JSX.IntrinsicAttributes &
          ClassAttributes<HTMLImageElement> &
          ImgHTMLAttributes<HTMLImageElement>
      ) => (
        <img
          src="./Images/DOlogoceleste.svg"
          alt="DO mini logo"
          className="w-6 h-6 object-contain"
        />
      ),
      projectImage: <img src="./Images/prueba1.png" alt="DO logo" />,
      date: "2020-10-20",
      description:
        "It was my second entrepreneurship, there were 3 of us in the team. It was an appweb where you could find someone to solve any kind of task or service or you could search for tasks and/or services to do. It would be running in Argentina. We created the product, we developed the application with another development team, but then the company went down because of a team mistake",
      technologies: [
        "AdobeXD",
        "React Native",
        "Firebase",
        "Scrum",
        "Project Owner",
      ],
      link: "https://google.com",
    },
    {
      projectName: "System Analyst / Functional Consultor",
      enterpriseicono: (
        props: JSX.IntrinsicAttributes &
          ClassAttributes<HTMLImageElement> &
          ImgHTMLAttributes<HTMLImageElement>
      ) => (
        <img
          src="./Images/sanmartin/minilogo.svg"
          alt="Club San Martín logo"
          className="w-6 h-6 object-contain"
        />
      ),
      // projectImage: (
      //   <img
      //     src="./Images/sanmartin/Sanmartinpileta.jpg"
      //     alt="Club San Martín ERP project"
      //   />
      // ),
      projectImage: "",
      date: "2023-06-30", // Corregida fecha inválida
      description:
        "I was responsible for analyzing and coordinating the flow of information between departments and implementing the club's ERP system, ensuring its integration with various sectors by studying the needs of the organizational system.",
      technologies: [
        "ERP Systems",
        "Functional Consulting",
        "Process Management",
        "User Training",
        "Negotiation",
      ],
      link: "",
    },
    {
      projectName: "Front-End developer",
      enterpriseicono: (
        props: JSX.IntrinsicAttributes &
          ClassAttributes<HTMLImageElement> &
          ImgHTMLAttributes<HTMLImageElement>
      ) => (
        <img
          src="./Images/DOlogoceleste.svg"
          alt="DO mini logo"
          className="w-6 h-6 object-contain"
        />
      ),
      projectImage: (
        <img src="./Images/prueba1.png" alt="Front-End Project logo" />
      ),
      date: "2024-09-12",
      description:
        "I developed different modules like cart, dashboard, prepayment and Context in Next.js, Typescript, using Prisma and PostgreSQL",
      technologies: [
        "Next.js",
        "TypeScript",
        "TailwindCSS",
        "PostgreSQL",
        "Prisma",
        "Sendgrid",
        "GitHub Actions",
      ],
      link: "",
    },
  ],
};
export default userData;
