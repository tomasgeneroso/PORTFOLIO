"use client";
import AboutMe from "@/components/Aboutme/Aboutme";
import Skills from "@/components/Skills/Skills";
import PortfolioSection from "@/components/PortfolioSection/PortfolioSection";
import ContactSection from "@/components/Contact/Contact";
import Experience from "@/components/Experience/Experience";
import Certificates from "@/components/Certificates/Certificates";
import userData from "@/components/userData";
import LoadingScreen from "@/components/Loading/LoadingScreen";
import { SectionTracker } from "@/components/Analytics/SectionTracker";
import { SectionReveal } from "@/components/Animations/SectionReveal";
import React, { useEffect, useState } from "react";
const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  // Scroll a la sección si hay un hash en la URL
  useEffect(() => {
    if (!isLoading && window.location.hash) {
      const id = window.location.hash.slice(1);
      const offset = 60;

      // Pequeño delay para asegurar que el DOM esté completamente renderizado
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 100);
    }
  }, [isLoading]);

  if (isLoading) return <LoadingScreen />;
  return (
    <div className="w-full mx-0 overflow-hidden scroll-smooth">
      <SectionTracker sectionId="about" sectionName="About Me" threshold={7}>
        <SectionReveal direction="up" duration={0.8}>
          <AboutMe userData={userData} />
        </SectionReveal>
      </SectionTracker>

      <SectionTracker sectionId="skillsSection" sectionName="Skills" threshold={7}>
        <SectionReveal direction="up" delay={0.2}>
          <Skills userData={userData} />
        </SectionReveal>
      </SectionTracker>

      <SectionTracker sectionId="projects" sectionName="Projects" threshold={7}>
        <SectionReveal direction="up" delay={0.2}>
          <PortfolioSection userData={userData} />
        </SectionReveal>
      </SectionTracker>

      <SectionTracker sectionId="experience" sectionName="Experience" threshold={7}>
        <SectionReveal direction="up" delay={0.2}>
          <Experience userData={userData} />
        </SectionReveal>
      </SectionTracker>

      <SectionTracker sectionId="certificates" sectionName="Certificates" threshold={7}>
        <SectionReveal direction="up" delay={0.2}>
          <Certificates certificates={userData.certificates} />
        </SectionReveal>
      </SectionTracker>

      <SectionTracker sectionId="contact" sectionName="Contact" threshold={7}>
        <SectionReveal direction="up" delay={0.2}>
          <ContactSection userData={userData} />
        </SectionReveal>
      </SectionTracker>
    </div>
  );
};
export default Home;
