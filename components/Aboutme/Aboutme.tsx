import React from "react";
import { Avatar } from "@heroui/react";
import Github from "@/components/Icons/Github";
import Linkedin from "@/components/Icons/Linkedin";
import { TitleSeparator } from "@/components/TitleSeparator/TitleSeparator";
import { UserProps } from "@/types";
import tomasgenerosoimage from "@/components/Aboutme/tomasgenerosoimage.jpeg";
const AboutMe: React.FC<UserProps> = ({ userData }) => {
  return (
    <section
      className="flex flex-col w-full mx-0 px-2 h-screen"
      id="aboutMeSection"
    >
      <TitleSeparator titleText="About me" />
      <div className="flex h-60 w-full mx-auto gap-1">
        <div className="flex w-40 ml-4">
          <div className="flex flex-col items-center justify-center">
            <Avatar
              src={tomasgenerosoimage.src}
              alt="Tomas Generoso"
              className="w-42 h-76 text-large my-auto "
            />
            <div className="my-2">
              <p className="text-lg">
                {userData.name} {userData.surname}
              </p>
            </div>
            <div className="flex justify-center gap-1">
              <a href={userData.links.Linkedin}>
                <Linkedin size={25} />
              </a>
              <a href={userData.links.Github}>
                <Github size={25} />
              </a>
            </div>
          </div>
        </div>
        <div className="flex-1 h-full mx-8 ">
          <div className="text-lg px-10 m-auto border-l-2 border-amber-100">
            {userData.aboutMe.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-2">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default AboutMe;
