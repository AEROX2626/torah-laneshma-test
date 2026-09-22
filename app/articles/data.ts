import articlesData from "./content.json";

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date?: string;
  image: string;
  content: string;
}

export const articles: Article[] = articlesData;
