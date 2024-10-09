import React from "react";
import { Avatar } from "@nextui-org/react";
import Github from "@/components/Icons/Github";
import Linkedin from "@/components/Icons/Linkedin";
import { TitleSeparator } from "@/components/TitleSeparator/TitleSeparator";
import { UserProps } from "@/types";
import tomasgenerosoimage from "@/components/Aboutme/tomasgenerosoimage.jpeg";
const AboutMe: React.FC<UserProps> = ({ userData }) => {
  return (
    <section
      className="flex flex-col w-full mx-0 p-2 h-screen "
      id="aboutMeSection"
    >
      <TitleSeparator titleText="About me" />
      <div className="flex h-60 w-full mx-auto gap-1 ">
        <div className="flex w-40 border-r-2 border-amber-100 ml-5">
          <div className="flex flex-col items-center  justify-center">
            <Avatar
              src={tomasgenerosoimage.src}
              alt="devPhoto"
              className="w-30 h-36 text-large my-auto border-r-medium"
            />
            <div className="my-2">
              <p className="text-lg">
                {userData.name} {userData.surname}
              </p>
            </div>
            <div className="flex justify-center gap-1">
              <Linkedin size={25} />
              <Github size={25} />
            </div>
          </div>
        </div>
        <div className="flex-1 w-30 h-full m-auto  rounded-xl ">
          <p className=" text-lg p-10 items-center">{userData.aboutMe}</p>
        </div>
      </div>
    </section>
  );
};
export default AboutMe;
