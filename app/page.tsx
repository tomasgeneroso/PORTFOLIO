"use client";
import AboutMe from "@/components/Aboutme/Aboutme";
import Skills from "@/components/Skills/Skills";
import PortfolioSection from "@/components/PortfolioSection/PortfolioSection";
import ContactSection from "@/components/Contact/Contact";
import Experience from "@/components/Experience/Experience";
import userData from "@/components/userData";
import LoadingScreen from "@/components/Loading/LoadingScreen";
import React, { useEffect, useState } from "react";
const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) return <LoadingScreen />;
  return (
    <div className="w-full mx-0 overflow-hidden scroll-smooth">
      <AboutMe userData={userData} />
      <Skills userData={userData} />
      <PortfolioSection userData={userData} />
      <Experience userData={userData} />
      <ContactSection userData={userData} />
    </div>
  );
};
export default Home;
