import { Skill } from "@/types";

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
  aboutMe:
    " Lorem ipsum dolor, sit amet consectetur adipisicing elit. Solu tempora eligendi at ipsum. Iste delectus perferendis fuga iure ullam nulla ipsa alias, nostrum nam harum? Nihil modi nostrum perspiciatis quos!",
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
      icono: (
        <svg
          width="800"
          height="800"
          viewBox="-13 0 282 282"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMinYMin meet"
        >
          <g fill="#8CC84B">
            <path d="M116.504 3.58c6.962-3.985 16.03-4.003 22.986 0 34.995 19.774 70.001 39.517 104.99 59.303 6.581 3.707 10.983 11.031 10.916 18.614v118.968c.049 7.897-4.788 15.396-11.731 19.019-34.88 19.665-69.742 39.354-104.616 59.019-7.106 4.063-16.356 3.75-23.24-.646-10.457-6.062-20.932-12.094-31.39-18.15-2.137-1.274-4.546-2.288-6.055-4.36 1.334-1.798 3.719-2.022 5.657-2.807 4.365-1.388 8.374-3.616 12.384-5.778 1.014-.694 2.252-.428 3.224.193 8.942 5.127 17.805 10.403 26.777 15.481 1.914 1.105 3.852-.362 5.488-1.274 34.228-19.345 68.498-38.617 102.72-57.968 1.268-.61 1.969-1.956 1.866-3.345.024-39.245.006-78.497.012-117.742.145-1.576-.767-3.025-2.192-3.67-34.759-19.575-69.5-39.18-104.253-58.76a3.621 3.621 0 0 0-4.094-.006C91.2 39.257 56.465 58.88 21.712 78.454c-1.42.646-2.373 2.071-2.204 3.653.006 39.245 0 78.497 0 117.748a3.329 3.329 0 0 0 1.89 3.303c9.274 5.259 18.56 10.481 27.84 15.722 5.228 2.814 11.647 4.486 17.407 2.33 5.083-1.823 8.646-7.01 8.549-12.407.048-39.016-.024-78.038.036-117.048-.127-1.732 1.516-3.163 3.2-3 4.456-.03 8.918-.06 13.374.012 1.86-.042 3.14 1.823 2.91 3.568-.018 39.263.048 78.527-.03 117.79.012 10.464-4.287 21.85-13.966 26.97-11.924 6.177-26.662 4.867-38.442-1.056-10.198-5.09-19.93-11.097-29.947-16.55C5.368 215.886.555 208.357.604 200.466V81.497c-.073-7.74 4.504-15.197 11.29-18.85C46.768 42.966 81.636 23.27 116.504 3.58z" />
          </g>
        </svg>
      ),
      level: 80,
      color: "blue",
    },
    {
      icono: (
        <svg
          width="800"
          height="800"
          viewBox="-13 0 282 282"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMinYMin meet"
        >
          <g fill="#8CC84B">
            <path d="M116.504 3.58c6.962-3.985 16.03-4.003 22.986 0 34.995 19.774 70.001 39.517 104.99 59.303 6.581 3.707 10.983 11.031 10.916 18.614v118.968c.049 7.897-4.788 15.396-11.731 19.019-34.88 19.665-69.742 39.354-104.616 59.019-7.106 4.063-16.356 3.75-23.24-.646-10.457-6.062-20.932-12.094-31.39-18.15-2.137-1.274-4.546-2.288-6.055-4.36 1.334-1.798 3.719-2.022 5.657-2.807 4.365-1.388 8.374-3.616 12.384-5.778 1.014-.694 2.252-.428 3.224.193 8.942 5.127 17.805 10.403 26.777 15.481 1.914 1.105 3.852-.362 5.488-1.274 34.228-19.345 68.498-38.617 102.72-57.968 1.268-.61 1.969-1.956 1.866-3.345.024-39.245.006-78.497.012-117.742.145-1.576-.767-3.025-2.192-3.67-34.759-19.575-69.5-39.18-104.253-58.76a3.621 3.621 0 0 0-4.094-.006C91.2 39.257 56.465 58.88 21.712 78.454c-1.42.646-2.373 2.071-2.204 3.653.006 39.245 0 78.497 0 117.748a3.329 3.329 0 0 0 1.89 3.303c9.274 5.259 18.56 10.481 27.84 15.722 5.228 2.814 11.647 4.486 17.407 2.33 5.083-1.823 8.646-7.01 8.549-12.407.048-39.016-.024-78.038.036-117.048-.127-1.732 1.516-3.163 3.2-3 4.456-.03 8.918-.06 13.374.012 1.86-.042 3.14 1.823 2.91 3.568-.018 39.263.048 78.527-.03 117.79.012 10.464-4.287 21.85-13.966 26.97-11.924 6.177-26.662 4.867-38.442-1.056-10.198-5.09-19.93-11.097-29.947-16.55C5.368 215.886.555 208.357.604 200.466V81.497c-.073-7.74 4.504-15.197 11.29-18.85C46.768 42.966 81.636 23.27 116.504 3.58z" />
          </g>
        </svg>
      ),
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
