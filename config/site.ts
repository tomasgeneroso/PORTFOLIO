export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_PORTFOLIO_NAME || "Portfolio",
  
  navItems: [
    {
      label: "About me",
      href: "/",
    },
    {
      label: "Skills",
      href: "#skillsSection",
    },
    {
      label: "Projects",
      href: "#projectsSection",
    },
    //Sacamos testimonies hasta que existan
    //{
     // label: "Testimonies",
     // href: "#testimoniesSection",
    //},
    {
      label: "Contact",
      href: "#contactSection",
    },
  ],
  navMenuItems: [
    {
      label: "About me",
      href: "/",
    },
    {
      label: "Skills",
      href: "#skillsSection", 
    },
    {
      label: "Portfolio",
      href: "/portfolio",
    },
    //Sacamos testimonies hasta que existan
   //{
     // label: "Testimonies",
     // href: "#testimoniesSection",
    //},
    {
      label: "Contact",
      href: "#contactSection",
    },
  ],
};
