import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";

import { link as linkStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";

import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, SearchIcon } from "@/components/icons";

export const Navbar = () => {
  const title = process.env.NEXT_PUBLIC_PORTFOLIO_NAME || "Portafolios";

  return (
    <NextUINavbar maxWidth="xl" position="sticky" className="shadow-lg">
      {/* FOR DESKTOP */}
      <NavbarContent
        className="hidden md:flex basis-1/5 sm:basis-full"
        justify="center"
      >
        <div className="w-full hidden md:flex justify-between">
          <NextLink href="/" className="w-48">
            {title}
          </NextLink>
          <ul className="flex gap-4 justify-start ml-2">
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </ul>
          <div className="w-48 flex justify-end">
            <ThemeSwitch />
          </div>
        </div>
      </NavbarContent>

      {/* FOR MOBILE */}
      <NavbarContent className="sm:hidden basis-1 pl-4 w-full">
        <div className="flex justify-between items-center w-full">
          <NextLink href="/" className="w-48">
            {title}
          </NextLink>
          <ThemeSwitch />
        </div>
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link href="#" size="lg">
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
