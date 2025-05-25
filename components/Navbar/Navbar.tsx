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
  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.getElementById(href.substring(1));
      if (element) {
        const offset = 60; // Offset de 20px
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="center">
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)}
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium scroll-smooth"
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
                onClick={(e) => handleScroll(e, item.href)}
                className="lg:text-lg"
                passHref
              >
                {item.label}
              </NextLink>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>

      <ThemeSwitch className="justify-end hidden-sm" />
      <div>
        <button
          type="submit"
          className="py-1 px-3 text-sm font-normal text-center text-gray-700
            bg-amber-100 ring-amber-100 rounded-md ring-1
            sm:w-fit transition duration-300 ease-in-out 
            hover:bg-white focus:ring-4 focus:outline-white focus:ring-amber-100 
            dark:bg-[#3D2548] dark:text-gray-300 dark:ring-[#777272] dark:hover:ring-[#777272] dark:hover:bg-[#777272]"
        >
          Download CV
        </button>
      </div>
    </NextUINavbar>
  );
};

export default Navbar;
