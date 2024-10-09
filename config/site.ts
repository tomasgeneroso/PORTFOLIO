export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_PORTFOLIO_NAME || "Portfolio",
  
  navItems: [
    {
      label: "Home",
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
    {
      label: "Testimonies",
      href: "#testimoniesSection",
    },
    {
      label: "Contact",
      href: "#contactSection",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
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
    {
      label: "Testimonies",
      href: "#testimoniesSection",
    },
    {
      label: "Contact",
      href: "#contactSection",
    },
  ],
};
