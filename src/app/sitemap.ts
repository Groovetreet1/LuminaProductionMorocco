import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["fr", "ar"];
  const paths = ["", "/produits", "/blog", "/contact"];

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
      alternates: {
        languages: {
          fr: `${baseUrl}/fr${path}`,
          ar: `${baseUrl}/ar${path}`,
        },
      },
    }))
  );
}