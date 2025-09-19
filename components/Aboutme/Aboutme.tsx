import React from "react";
import { Avatar } from "@heroui/react";
import Github from "@/components/Icons/Github";
import Linkedin from "@/components/Icons/Linkedin";
import { TitleSeparator } from "@/components/TitleSeparator/TitleSeparator";
import { UserProps } from "@/types";
import tomasgenerosoimage from "@/components/Aboutme/tomasgenerosoimage.jpeg";
import Skills from "../Skills/Skills";
import SkillsSlider from "../Skills/SkillsSlider";
const AboutMe: React.FC<UserProps> = ({ userData }) => {
  return (
    <section className="flex flex-col w-full mx-0 px-2 " id="aboutMeSection">
      <TitleSeparator titleText="About me" />
      <div className="flex flex-col md:flex-row w-full mx-auto gap-4 p-8 bg-amber-200/10 rounded-lg shadow-lg dark:bg-[#2B1A33] dark:text-white ">
        <div className="flex flex-col items-center justify-center md:w-40">
          <Avatar
            src={tomasgenerosoimage.src}
            alt="Tomas Generoso"
            className="w-62 h-76 sm:w-24 sm:h-44 md:w-24 md:h-44 lg:w-42 lg:h-76 object-cover"
          />
          <div className="my-2">
            <p className="text-base sm:text-base md:text-lg xl:text-xl text-center ">
              {userData.name} {userData.surname}
            </p>
          </div>
          <div className="flex justify-center gap-2 ">
            <a href={userData.links.Linkedin}>
              <Linkedin size={25} />
            </a>
            <a href={userData.links.Github}>
              <Github size={25} />
            </a>
          </div>
        </div>

        <div className="flex-1 h-full  md:ml-4 my-auto    sm:mt-4 md:mt-0">
          <div className="text-sm sm:text-sm md:text-base xl:text-xl gap-4 p-4 ">
            {userData.aboutMe.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="">
        <SkillsSlider userData={userData} />
      </div>
    </section>
  );
};
export default AboutMe;
