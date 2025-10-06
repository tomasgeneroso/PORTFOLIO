"use client";
import React from "react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import Github from "@/components/Icons/Github";
import clsx from "clsx";
import { UserLinks } from "@/types";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {
  trackCVDownload,
  trackGitHubClick,
  trackEmailClick,
} from "@/app/analytics/analytics";
const Navbar: React.FC<UserLinks> = ({ userLinks }) => {
  const [showNavbar, setShowNavbar] = React.useState(true);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const lastScrollY = React.useRef(0);
  const router = useRouter();

  const handleScrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.slice(1);
      const offset = 60;

      const scrollToId = () => {
        const el = document.getElementById(id);
        if (!el) return;
        const top =
          el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: "smooth" });
      };

      // Si el menú está abierto: cerralo primero y luego scrollea después de un pequeño delay.
      if (isMenuOpen) {
        setIsMenuOpen(false);
        setTimeout(() => {
          requestAnimationFrame(() => requestAnimationFrame(scrollToId));
        }, 80);
      } else {
        scrollToId();
      }
      return;
    }

    if (href === "/") {
      e.preventDefault();
      // Si el menú está abierto, cerrarlo y luego scrollear al top
      if (isMenuOpen) {
        setIsMenuOpen(false);
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 80);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    // Rutas externas/otras: cerramos menú y dejamos que NextLink haga la navegación normal
    if (isMenuOpen) setIsMenuOpen(false);
    // no preventDefault -> NextLink navegará
  };

  // Bloquear scroll cuando el menú está abierto
  React.useEffect(() => {
    if (isMenuOpen) {
      // Prevenir scroll en body
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = "0";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
      document.body.style.touchAction = "none";

      // Función para bloquear
      const preventDefault = (e: TouchEvent | WheelEvent) => {
        e.preventDefault();
      };

      document.addEventListener("touchmove", preventDefault, {
        passive: false,
      });
      document.addEventListener("wheel", preventDefault, { passive: false });

      return () => {
        // Restaurar estilos
        document.body.style.overflow = "unset";
        document.body.style.position = "unset";
        document.body.style.top = "unset";
        document.body.style.width = "unset";
        document.body.style.height = "unset";
        document.body.style.touchAction = "unset";

        document.removeEventListener("touchmove", preventDefault);
        document.removeEventListener("wheel", preventDefault);
      };
    } else {
      // Restaurar si se cierra el menú
      document.body.style.overflow = "unset";
      document.body.style.position = "unset";
      document.body.style.top = "unset";
      document.body.style.width = "unset";
      document.body.style.height = "unset";
      document.body.style.touchAction = "unset";
    }
  }, [isMenuOpen]);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollThreshold = documentHeight * 0.02;

      if (currentScrollY > scrollThreshold) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      {/* Desktop Navigation */}
      <NavbarContent className="basis-1/5 sm:basis-full flex text-2xl p-5 mb-8 ml-12 justify-center">
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

      {/* Desktop CV Button and Theme Switch */}
      <NavbarContent
        className="hidden lg:flex basis-1/5 justify-end"
        justify="end"
      >
        <div className="mr-4 mb-8 pr-5 space-x-4 flex items-center">
          <ThemeSwitch />
          <button
            type="button"
            className="py-1 px-3 text-sm font-normal text-center text-gray-700
              bg-amber-100 ring-amber-100 rounded-md ring-1
              sm:w-fit transition duration-300 ease-in-out
              hover:bg-white focus:ring-4 focus:outline-white focus:ring-amber-100
              dark:bg-[#3D2548] dark:text-gray-300 dark:ring-[#777272] dark:hover:ring-[#777272] dark:hover:bg-[#777272]"
          >
            <a
              href="/pdf/TOMAS GENEROSO CV EN.pdf"
              onClick={trackCVDownload}
              download
              className="flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              CV
            </a>
          </button>
        </div>
      </NavbarContent>

      {/* Mobile Navigation Controls */}
      <NavbarContent className="lg:hidden basis-1 pl-4" justify="end">
        {Github && userLinks?.Github && (
          <a
            href={userLinks.Github}
            onClick={trackGitHubClick}
            aria-label="Github"
          >
            <Github className="text-default-500" />
          </a>
        )}

        {/* Custom Hamburger Menu Button */}
        <button
          className="lg:hidden p-2 z-50 relative"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <div
              className={`w-full h-0.5 bg-current transition-all duration-300 ease-in-out ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <div
              className={`w-full h-0.5 bg-current transition-all duration-300 ease-in-out ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <div
              className={`w-full h-0.5 bg-current transition-all duration-300 ease-in-out ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </div>
        </button>
      </NavbarContent>

      {/* Mobile Menu - Full screen con fondo blanco sólido */}
      <div
        className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-6 bg-white">
          <h2 className="text-xl font-semibold text-center text-gray-800">
            Menu
          </h2>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Simple white space separator */}
        <div className="h-8 bg-white"></div>

        {/* Menu Content */}
        <div className="flex flex-col h-full bg-white">
          <div className="flex-1 px-6 bg-white">
            <nav>
              <ul className="space-y-6 justify-center items-center text-center">
                {siteConfig.navMenuItems.map((item, index) => (
                  <li key={`${item.href}-${index}`} className="bg-white">
                    <NextLink
                      href={item.href}
                      onClick={(e) => handleScrollToSection(e, item.href)}
                      className="block text-lg font-medium text-gray-700 
                          hover:text-primary transition-colors duration-200"
                      passHref
                    >
                      {item.label}
                    </NextLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Footer */}
          <div className="p-6 space-x-2  bg-white">
            <div className="flex items-center justify-center gap-4 mb-4">
              {Github && userLinks?.Github && (
                <div>
                  <a
                    href={userLinks.Github}
                    className="flex items-center gap-3 text-gray-700 
                      hover:text-primary transition-colors duration-200"
                    aria-label="Github"
                    onClick={() => (setIsMenuOpen(false), trackGitHubClick)}
                  >
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              )}

              <ThemeSwitch />
            </div>
            {/* CV Download Button */}
            <button
              type="button"
              className="w-full py-2 px-3 text-sm font-normal text-center text-gray-700
                  bg-amber-100 ring-amber-100 rounded-md ring-1
                  transition duration-300 ease-in-out
                  hover:bg-white focus:ring-4 focus:outline-white focus:ring-amber-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <a
                href="/pdf/TOMAS GENEROSO CV EN.pdf"
                download
                className="flex items-center justify-center gap-1 w-full"
                onClick={trackCVDownload}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                CV
              </a>
            </button>
          </div>
        </div>
      </div>
    </NextUINavbar>
  );
};

export default Navbar;
