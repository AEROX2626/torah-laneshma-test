import { MetadataRoute } from "next";
import { articles } from "./articles/data";
import { allGuides } from "./guides/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.torah-laneshma.org";

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => {
    const lastModifiedDate = article.date
      ? new Date(article.date.split(".").reverse().join("-"))
      : new Date();

    return {
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: isNaN(lastModifiedDate.getTime())
        ? new Date()
        : lastModifiedDate,
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });

  const guideEntries: MetadataRoute.Sitemap = allGuides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: guide.isGlossary ? 0.8 : 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/study`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ask`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/relationships-guide`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/adopt`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...guideEntries,
    ...articleEntries,
  ];
}
