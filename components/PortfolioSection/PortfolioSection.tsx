"use client";
import { TitleSeparator } from "@/components/TitleSeparator/TitleSeparator";
import TimeLine from "./TimeLine";
import { UserProps } from "@/types";
const PortfolioSection: React.FC<UserProps> = ({ userData }) => {
  return (
    <section className="flex flex-col w-full" id="projectsSection">
      <TitleSeparator titleText="Projects" />
      <div className="flex flex-wrap w-full gap-4">
        <TimeLine userData={userData} />
      </div>
      <div className="flex justify-center my-10">
        <button
          type="submit"
          className="py-3 px-5 text-sm font-normal text-center text-gray-700  bg-amber-100 ring ring-amber-100 rounded-md
            sm:w-fit transition duration-300 ease-in-out 
            hover:bg-white focus:ring-4 focus:outline-white focus:ring-amber-100 
            dark:bg-[#3D2548] dark:text-gray-300 dark:ring-[#777272] dark:hover:ring-[#777272] dark:hover:bg-[#777272]"
          onClick={() => (window.location.href = "/projects")}
        >
          See all projects
        </button>
      </div>
    </section>
  );
};

export default PortfolioSection;
