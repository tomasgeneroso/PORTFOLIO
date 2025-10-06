"use client";
import Script from "next/script";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tomasgeneroso.com";

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Tomas Generoso",
    url: baseUrl,
    jobTitle: "Full Stack Developer",
    description: "Full Stack Developer specializing in React, Next.js, TypeScript, and Node.js",
    sameAs: [
      "https://github.com/tomasgeneroso",
      "https://linkedin.com/in/tomasgeneroso",
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "Web Development",
      "Full Stack Development",
    ],
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Tomas Generoso Portfolio",
    url: baseUrl,
    description: "Portfolio of Tomas Generoso, Full Stack Developer",
    inLanguage: ["en", "es", "it", "fr", "de"],
  };

  return (
    <>
      <Script
        id="structured-data-person"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Script
        id="structured-data-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
    </>
  );
}
