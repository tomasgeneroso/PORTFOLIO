"use client";
import React from "react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import Github from "@/components/Icons/Github";
import clsx from "clsx";
import { UserLinks } from "@/types";
import NextLink from "next/link";

const Navbar: React.FC<UserLinks> = ({ userLinks }) => {
  const [showNavbar, setShowNavbar] = React.useState(true);
  const lastScrollY = React.useRef(0);

  const handleScrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.getElementById(href.substring(1));
      if (element) {
        const offset = 60; // Offset de 60px
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollThreshold = documentHeight * 0.2; // 2% from the top (or 98% remaining to scroll)

      if (currentScrollY > scrollThreshold) {
        setShowNavbar(false); // Scrolling down and past the initial threshold
      } else {
        setShowNavbar(true); // Scrolling up or within the initial threshold
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
  }, []);

  return (
    <NextUINavbar
      maxWidth="xl"
      className={clsx(
        "transition-transform duration-500 z-50",
        showNavbar ? "translate-y-0" : "-translate-y-full"
      )}
      position="sticky"
    >
      <NavbarContent className="basis-1/5 sm:basis-full flex text-2xl p-5 mb-8 justify-center">
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                href={item.href}
                onClick={(e) => handleScrollToSection(e, item.href)}
                className={clsx(
                  linkStyles,
                  "hover:text-primary hover:font-medium focus:text-primary focus:font-medium",
                  "data-[active=true]:text-primary data-[active=true]:font-medium scroll-smooth transition-all duration-300 ease-in-out"
                )}
                passHref
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      {/* Menu toggled */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        {Github && (
          <a href={userLinks.Github} aria-label="Github">
            <Github className="text-default-500" />
          </a>
        )}

        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.href}-${index}`}>
              <NextLink
                href={item.href}
                onClick={(e) => handleScrollToSection(e, item.href)}
                className="lg:text-lg"
                passHref
              >
                {item.label}
              </NextLink>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>

      <ThemeSwitch className="justify-end hidden-sm mb-8 " />
      <div className=" mr-4 mb-8 pr-5">
        <button
          type="submit"
          className="py-1 px-3 text-sm font-normal text-center text-gray-700
            bg-amber-100 ring-amber-100 rounded-md ring-1
            sm:w-fit transition duration-300 ease-in-out
            hover:bg-white focus:ring-4 focus:outline-white focus:ring-amber-100
            dark:bg-[#3D2548] dark:text-gray-300 dark:ring-[#777272] dark:hover:ring-[#777272] dark:hover:bg-[#777272]"
        >
          <a href="/pdf/TOMAS GENEROSO CV EN.pdf" download>
            CV
          </a>
        </button>
      </div>
    </NextUINavbar>
  );
};

export default Navbar;
