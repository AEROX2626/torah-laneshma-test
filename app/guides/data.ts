import { GuideCategoryMeta, GuideItem } from "./types";
import { shabbatAndTefillaGuides } from "./data-shabbat-tefilla";
import { limudAndLifestyleGuides } from "./data-limud-zikaron";
import { glossaryGuides } from "./data-glossary";

export const guideCategories: GuideCategoryMeta[] = [
  {
    id: "shabbat",
    title: "שבת ומועדים",
    subtitle: "הלכות, זמנים, ברכות ומנהגים לשולחן השבת והחגים",
    badgeLabel: "שבת",
    icon: "fa-🕯️",
    colorClass: "bg-amber-50 text-amber-700 border-amber-200"
  },
  {
    id: "tefilla",
    title: "תפילה, ברכות ומצוות הבית",
    subtitle: "מדריכים מעשיים לתפילין, קריאת שמע, ברכות המזון והנהנין וקביעת מזוזה",
    badgeLabel: "תפילה ומצוות",
    icon: "fa-scroll",
    colorClass: "bg-primary-50 text-primary-700 border-primary-200"
  },
  {
    id: "limud",
    title: "עולם הלימוד והחברותא",
    subtitle: "איך לומדים בחברותא, מפת ארון הספרים היהודי, הדף היומי וצורת הדף",
    badgeLabel: "עולם הלימוד",
    icon: "fa-book-open",
    colorClass: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  {
    id: "kehila",
    title: "בית, מידות ואורח חיים",
    subtitle: "הלכות צדקה ומעשר כספים, שמירת הלשון וערכי חיי היומיום",
    badgeLabel: "בית ומידות",
    icon: "fa-heart",
    colorClass: "bg-rose-50 text-rose-700 border-rose-200"
  },
  {
    id: "zmanim",
    title: "זמני היום והמועדים",
    subtitle: "חישוב שעות זמניות, זמני התפילה, וארבע התעניות והצומות בלוח העברי",
    badgeLabel: "זמנים ומועדים",
    icon: "fa-clock",
    colorClass: "bg-indigo-50 text-indigo-700 border-indigo-200"
  }
];

export const mainGuides: GuideItem[] = [
  ...shabbatAndTefillaGuides,
  ...limudAndLifestyleGuides
];

export { glossaryGuides };

export const allGuides: GuideItem[] = [...mainGuides, ...glossaryGuides];

export function getGuideBySlug(slug: string): GuideItem | undefined {
  return allGuides.find((item) => item.slug === slug);
}
