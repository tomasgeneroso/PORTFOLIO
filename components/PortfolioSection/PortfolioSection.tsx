"use client";
import { TitleSeparator } from "@/components/TitleSeparator/TitleSeparator";
import TimeLine from "./TimeLine";
import { UserProps } from "@/types";
const PortfolioSection: React.FC<UserProps> = ({ userData }) => {
  return (
    <section
      className="flex flex-col w-full h-screen mb-4"
      id="projectsSection"
    >
      <TitleSeparator titleText="Projects" />
      <div className="flex flex-wrap w-full gap-4">
        <TimeLine userData={userData} />
      </div>
      <div className="flex justify-center mt-10">
        <button
          type="submit"
          className="py-3 px-5 text-sm font-normal text-center text-black  bg-amber-100 ring  ring-amber-100 sm:w-fit transition duration-300 ease-in-out hover:bg-white focus:ring-4 focus:outline-none focus:ring-amber-100 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          onClick={() => (window.location.href = "/projects")}
        >
          See all projects
        </button>
      </div>
    </section>
  );
};

export default PortfolioSection;
