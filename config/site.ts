export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_PORTFOLIO_NAME || "Portfolio",
  description:"Tomas Generoso Portfolio",
  navItems: [
    {
      key: "aboutMe",
      href: "#aboutMeSection",
    },
    {
      key: "skills",
      href: "#skillsSection",
    },
    {
      key: "projects",
      href: "#projectsSection",
    },
    {
      key: "experience",
      href: "#experienceSection",
    },
    {
      key: "certificates",
      href: "#certificatesSection",
    },
    {
      key: "contact",
      href: "#contactSection",
    },
  ],
  navMenuItems: [
    {
      key: "aboutMe",
      href: "#aboutMeSection",
    },
    {
      key: "skills",
      href: "#skillsSection",
    },
    {
      key: "projects",
      href: "#projectsSection",
    },
    {
      key: "experience",
      href: "#experienceSection",
    },
    {
      key: "certificates",
      href: "#certificatesSection",
    },
    {
      key: "contact",
      href: "#contactSection",
    },
  ],
};
