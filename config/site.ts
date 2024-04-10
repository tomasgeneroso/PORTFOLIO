export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_PORTFOLIO_NAME || "Portafolios",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Skills",
      href: "/skills",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Testimonies",
      href: "/Tesimonies",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Skills",
      href: "/skills",
    },
    {
      label: "Portfolio",
      href: "/portfolio",
    },
    {
      label: "Testimonies",
      href: "/Tesimonies",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ],
};
