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

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
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
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
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
          <main className="container flex w-full h-full mx-2 pt-16  ">
            <div className="flex w-4/5 mb-16">{children}</div>
            {/*GRAFICO 3D */}
            <div className="container bg-black w-1/5 justify-self-end "></div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
