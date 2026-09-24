import { MetadataRoute } from "next";
import { articles } from "./articles/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.torah-laneshma.org";

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => {
    // Attempt to parse the article date, fallback to current build date
    const lastModifiedDate = article.date ? new Date(article.date.split(".").reverse().join("-")) : new Date();
    // (If the date format in JSON is "DD.MM.YYYY", we reverse it for Date parsing, otherwise adjust accordingly)

    return {
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: isNaN(lastModifiedDate.getTime()) ? new Date() : lastModifiedDate,
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });

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
      priority: 0.8,
    },
    {
      url: `${baseUrl}/relationships-guide`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...articleEntries,
  ];
}
