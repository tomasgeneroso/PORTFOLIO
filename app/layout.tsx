import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar/Navbar";
import clsx from "clsx";
import userData from "@/components/userData";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
};
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF6C7" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          "min-h-screen mx-1 bg-background font-sans antialiased ",
          fontSans.variable
        )}
        style={{ height: "100%" }}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <Navbar userLinks={userData.links} />
          <main className="container flex w-full h-full mx-auto pt-2 ">
            {/*Cambiar cuando 3d listo*/}
            {/*<div className="flex w-4/5 mb-16">{children}</div>*/}
            <div className="flex w-full  mb-16">{children}</div>
            {/*GRAFICO 3D */}
            {/*  <div className="container bg-black w-1/5 justify-self-end "></div>*/}
          </main>
        </Providers>
      </body>
    </html>
  );
}
