"use client";

import { useEffect, useRef, useState } from "react";
import AboutMe from "@/components/Aboutme/Aboutme";
import Skills from "@/components/Skills/Skills";
import PortfolioSection from "@/components/PortfolioSection/PortfolioSection";
import ContactSection from "@/components/Contact/Contact";
import userData from "@/components/userData";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
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

      if (e.deltaY > 0) {
        // scroll hacia abajo
        setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
      } else {
        // scroll hacia arriba
        setCurrentSection((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [sections.length]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: window.innerHeight * currentSection,
        behavior: "smooth",
      });
    }
  }, [currentSection]);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-hidden scroll-smooth"
      style={{ scrollBehavior: "smooth" }}
    >
      {sections.map((Section, index) => (
        <div key={index} style={{ height: "100vh" }}>
          {Section}
        </div>
      ))}
    </div>
  );
}
