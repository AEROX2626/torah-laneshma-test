export type GuideCategoryId =
  | "shabbat"
  | "tefilla"
  | "limud"
  | "kehila"
  | "zmanim"
  | "glossary";

export interface GuideCategoryMeta {
  id: GuideCategoryId;
  title: string;
  subtitle: string;
  badgeLabel: string;
  icon: string;
  colorClass: string;
}

export interface BlessingBox {
  title: string;
  blessingText?: string;
  sephardicCustom?: string;
  ashkenazicCustom?: string;
  practicalTip?: string;
}

export interface GuideSection {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface GuideSource {
  title: string;
  description: string;
  url?: string;
}

export interface GuideItem {
  slug: string;
  title: string;
  questionTitle: string;
  metaDescription: string;
  category: GuideCategoryId;
  categoryBadge: string;
  isGlossary?: boolean;
  shortSummary: string;
  tldr: string;
  blessingBox?: BlessingBox;
  showShabbatWidget?: boolean;
  sections: GuideSection[];
  faqs: GuideFaq[];
  sources: GuideSource[];
  relatedSlugs: string[];
  keywords: string[];
}
