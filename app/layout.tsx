import "../styles/globals.css";
import { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import clsx from "clsx";
import userData from "@/components/userData";
import { LanguageMetadata } from "@/components/LanguageMetadata";
import { StructuredData } from "@/components/StructuredData";
import Navbar from "@/components/Navbar/Navbar";
import { SkipToContent } from "@/components/Accessibility/SkipToContent";
import { PWAInstaller } from "@/components/PWA/PWAInstaller";

if (typeof window !== "undefined") {
  (window as any).USE_MONGO = true;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tomasgeneroso.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Tomas Generoso",
    "Full Stack Developer",
    "Web Developer",
    "Software Engineer",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Portfolio",
  ],
  authors: [{ name: "Tomas Generoso" }],
  creator: "Tomas Generoso",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["es_ES", "it_IT", "fr_FR", "de_DE"],
    url: baseUrl,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      en: `${baseUrl}`,
      es: `${baseUrl}`,
      it: `${baseUrl}`,
      fr: `${baseUrl}`,
      de: `${baseUrl}`,
      "x-default": `${baseUrl}`,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF6C7" },
    { media: "(prefers-color-scheme: dark)", color: "#3D2548" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="scroll-smooth overflow-x-hidden"
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3D2548" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={clsx(
          "min-h-screen mx-1 font-sans antialiased overflow-x-hidden",
          fontSans.variable
        )}
        style={{ height: "100%" }}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <SkipToContent />
          <PWAInstaller />
          <LanguageMetadata />
          <StructuredData />
          <Navbar userLinks={userData.links} />
          <main id="main-content" className="container flex w-full h-full mx-auto pt-2 max-w-full overflow-x-hidden">
            <div className="flex w-full mb-4 max-w-full">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
