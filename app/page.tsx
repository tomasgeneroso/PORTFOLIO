"use client";

import { useEffect, useRef, useState } from "react";
import AboutMe from "@/components/Aboutme/Aboutme";
import Skills from "@/components/Skills/Skills";
import PortfolioSection from "@/components/PortfolioSection/PortfolioSection";
import ContactSection from "@/components/Contact/Contact";
import userData from "@/components/userData";

export default function Home() {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    <AboutMe key="about" userData={userData} />,
    <Skills key="skills" userData={userData} />,
    <PortfolioSection key="portfolio" userData={userData} />,
    <ContactSection key="contact" userData={userData} />,
  ];

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      setCurrentSection((prev) => {
        if (e.deltaY > 0 && prev < sections.length - 1) {
          return prev + 1;
        } else if (e.deltaY < 0 && prev > 0) {
          return prev - 1;
        }
        return prev;
      });
    };
    const target = sectionRefs.current[currentSection];
    if (target) {
      const offsetTop = target.offsetTop - 70;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [sections.length, currentSection]);

  return (
    <div className="w-full overflow-auto scroll-smooth">
      {sections.map((Section, index) => (
        <div
          key={index}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
          className="min-h-screen w-full flex flex-col mb-2"
        >
          {Section}
        </div>
      ))}
    </div>
  );
}
