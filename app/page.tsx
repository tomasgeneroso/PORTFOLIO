"use client";
import { useEffect, useState } from "react";
import AboutMe from "@/components/Aboutme/Aboutme";
import Skills from "@/components/Skills/Skills";
import PortfolioSection from "@/components/PortfolioSection/PortfolioSection";
import ContactSection from "@/components/Contact/Contact";
import Testimonies from "@/components/Testimonies/Testimonies";
//import userController from "@/components/Controllers/userController";
import userData from "@/components/userData";

export default function Home() {
  /*
  //const [userData, setUserData] = useState<User | null>(null);
  
   
  //const [loading, setLoading] = useState(true);
  //const [error, setError] = useState("");
  
  let user = {
    name: "Tomas",
    surname: "Generos",
    phone: "+39 351 382 2180",
    email: "tomasgeneroso9@gmail.com",
    photo: "../images/Tomasfotocvchica.jpg",
    aboutMe:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Solu tempora eligendi at ipsum. Iste delectus perferendis fuga iure ullam nulla ipsa alias, nostrum nam harum? Nihil modi nostrum perspiciatis quos!",
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
    links: {
      Github: "https://github.com/tomasgeneroso/PORTAFOLIO",
      Linkedin: "https://www.linkedin.com/in/tomas-generoso/",
      Gmail: "tomasgeneroso90@gmail.com",
    },
    skills: [
      {
        name: "Tailwind",
        icono: "<svg>...</svg>",
        level: 60,
        color: "primary",
      },
      {
        name: "Nodejs",
        icono: "<svg>...</svg>",
        level: 50,
        color: "success",
      },
    ],
    projects: [
      {
        projectName: "ProjectName1",
        enterpriseLogo: "../images/Tomasfotocvchica.jpg",
        projectImage: "../images/prueba1.png",
        date: new Date("2023-12-01").toISOString(),
        description:
          "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Solu tempora eligendi at ipsum.",
        technologies: ["Nodejs", "Tailwind", "MongoDB"],
        link: "https://github.com/tomasgeneroso/PORTAFOLIO",
      },
      {
        projectName: "ProjectName3",
        enterpriseLogo: "../images/Tomasfotocvchica.jpg",
        projectImage: "../images/prueba1.png",
        date: new Date("2023-12-01").toISOString(),
        description:
          "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Solu tempora eligendi at ipsum.",
        technologies: ["Nodejs", "Tailwind", "MongoDB"],
        link: "https://google.com",
      },
    ],
  };
  setUserData(userData);
 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        //destructurar userData

        const data = await userController.getUserData(); // Si es una función asíncrona
        console.log("🚀 ~ fetchUserData ~ data:", data);
        await userController.postUserData(user).then((data) => {
        console.log("🚀 ~ fetchUserData ~ data:", data);
        });
        setUserData(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="mx-auto text-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
*/
  return (
    <div className="w-full mx-0">
      {userData && <AboutMe userData={userData} />}

      {userData && <Skills userData={userData} />}
      {userData && <PortfolioSection userData={userData} />}

      <Testimonies testimonies={userData?.testimonies || []} />

      {userData && <ContactSection userData={userData} />}
    </div>
  );
}
