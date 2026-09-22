import { MetadataRoute } from "next";
import { articles } from "./articles/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://torah-laneshma.co.il"; // Assuming this is the real domain, the user will confirm

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/adopt`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...articleEntries,
  ];
}
