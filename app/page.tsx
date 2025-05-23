"use client";

import AboutMe from "@/components/Aboutme/Aboutme";
import Skills from "@/components/Skills/Skills";
import PortfolioSection from "@/components/PortfolioSection/PortfolioSection";
import ContactSection from "@/components/Contact/Contact";
import userData from "@/components/userData";

export default function Home() {
  return (
    <div className="w-full mx-0">
      <AboutMe userData={userData} />
      <Skills userData={userData} />
      <PortfolioSection userData={userData} />
      <ContactSection userData={userData} />
    </div>
  );
}
