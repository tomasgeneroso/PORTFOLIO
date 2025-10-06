import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tomasgeneroso.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/projects", "/experience"];
  const locales = ["en", "es", "it", "fr", "de"];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  routes.forEach((route) => {
    sitemapEntries.push({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: route === "" ? 1.0 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((locale) => [locale, `${baseUrl}${route}`])
        ),
      },
    });
  });

  return sitemapEntries;
}
