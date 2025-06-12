/* eslint-disable @next/next/no-img-element */
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
      icono: <JavascriptIcon size={80} />,
      level: 80,
    },
    {
      icono: <ReactIcon size={80} />,
      level: 80,
    },
    {
      icono: <ExpressIcon size={80} />,
      level: 110,
    },
    {
      icono: <LaravelIcon size={80} />,
      level: 70,
    },
    {
      icono: <DockerIcon size={80} />,
      level: 50,
    },
    {
      icono: <MongoLogo size={80} />,
      level: 110,
    },
    {
      icono: <ShopifyIcon size={80} />,
      level: 70,
    },
    {
      icono: <WordpressIcon size={80} />,
      level: 70,
    },
    {
      icono: <TypeScriptLogo size={80} />,
      level: 70,
    },
    {
      icono: <PostgreSQLLogo size={80} />,
      level: 70,
    },
    {
      icono: <TailwindIcon size={80} />,
      level: 80,
    },
    {
      icono: <PythonLogo size={80} />,
      level: 60,
    },
    {
      icono: <BlenderLogo size={80} />,
      level: 70,
    },
    {
      icono: <Cordova size={80} />,
      level: 40,
    },
    {
      icono: <CSharpLogo size={80} />,
      level: 40,
    },
    {
      icono: <Java size={80} />,
      level: 40,
    },
  ],
  projects: [
    {
      projectName: "ZAIFO",
      enterpriseicono: (
        props: JSX.IntrinsicAttributes &
          ClassAttributes<HTMLImageElement> &
          ImgHTMLAttributes<HTMLImageElement>
        // eslint-disable-next-line @next/next/no-img-element
      ) => <img src="./Images/ZAIFOminilogo.png" alt="ZAIFO logo" {...props} />,
      projectImage: ["./Images/ZAIFOHome.png", "./Images/ZAIFOChat.png"],

      date: "2018-07-01",
      description:
        "It's basically an appweb for hire professionals for construction. It was my first entrepreneurship, an appweb where you can hire some constructor or plumber for example, to fix something or start some new project at home. The professionals could create their own profile and the users could search for them by location, price, etc.",
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
      projectImage: ["./Images/DOHome.png"],
      date: "2020-10-20",
      description:
        "It was my second entrepreneurship, we were a 3 people team. It was an app where you could find someone to solve any kind of task or service or you could search for tasks and/or services to do. It would be running in Argentina. We created the product, we developed the application with another development team, but then the company went down because of a team mistake",
      technologies: [
        "Figma",
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
          src="./Images/ClubSanMartinLogo.jpg"
          alt="Club San Martín logo"
          className="w-6 h-6 object-contain"
        />
      ),
      projectImage: [""],
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
      projectImage: ["./Images/Mateworld_CRUDCart.png"],
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
  experience: [
    {
      projectName: "Ceconni's, Berlin, Germany",
      enterpriseicono: "",
      projectImage: "",
      date: "Now",
      description:
        "I'm working for now as a waiter in a restaurant in Soho House, Berlin, Germany. I have been working here for 4 months.",
      technologies: [
        "Teamwork",
        "Diverse Languages",
        "Customer Service",
        "Adaptability",
      ],
      link: "",
    },
    {
      projectName: "Frontend Developer",
      enterpriseicono: "",
      projectImage: "",
      date: " 09/09/2023",
      description:
        "I have experience in full-stack development, where I contributed to the creation of shopping cart, dashboard, prepayment, and context modules for a catering service application with Angel Servers, using Typescript, Next.js, and TailwindCSS for the front-end. For the backend I used Prisma and PostgreSQL. We used CI/CD pipelines with Github Actions for source control workflows and code review processes, which facilitates efficient teamwork in dynamic environments.",
      technologies: [
        "Teamwork",
        "CD/CI pipelines",
        "Typescript",
        "Next.js",
        "Prisma",
        "PostgreSQL",
        "TailwindCSS",
        "GitHub Actions",
        "Problem Solving",
        "Communication",
        "Time Management",
        "Adaptability",
      ],
      link: "",
    },

    {
      projectName: "System Analyst / Functional Consultor",
      enterpriseicono: "",
      projectImage: "",
      date: "2023-06-30",
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
      projectName: "DO",
      enterpriseicono: "",
      projectImage: "",
      date: "2020-10-20",
      description:
        "I founded and led a digital startup from scratch, together with two friends who were also passionate about entrepreneurship. We developed an app to connect users with tasks and services in Argentina. I was responsible for ideation, product validation, team formation, and development supervision. Although the project didn't launch due to a negative experience with the developer who built the app, the experience taught me the importance of risk management, code ownership, legal contracts, and milestone-based payments. Today, I apply all of these lessons in my new projects.",
      technologies: [
        "Product Management",
        "React Native",
        "Firebase",
        "Scrum",
        "Project Owner",
      ],
      link: "https://google.com",
    },
    {
      projectName: "Front-End developer project",
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
        <img
          src="./Images/Mateworld_CRUDCart.png"
          alt="Front-End Project logo"
        />
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
