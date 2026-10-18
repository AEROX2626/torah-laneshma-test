"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { GuideCategoryId, GuideCategoryMeta, GuideItem } from "./types";

interface GuidesExplorerProps {
  categories: GuideCategoryMeta[];
  mainGuides: GuideItem[];
  glossaryGuides: GuideItem[];
}

export default function GuidesExplorer({
  categories,
  mainGuides,
  glossaryGuides,
}: GuidesExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<GuideCategoryId | "all">("all");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Filter main guides
  const filteredMainGuides = useMemo(() => {
    return mainGuides.filter((guide) => {
      const matchesCategory =
        activeCategory === "all" || guide.category === activeCategory;
      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;

      const haystack = [
        guide.title,
        guide.questionTitle,
        guide.shortSummary,
        guide.tldr,
        ...guide.keywords,
        ...guide.faqs.map((f) => `${f.question} ${f.answer}`),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [mainGuides, activeCategory, normalizedQuery]);

  // Filter glossary guides
  const filteredGlossary = useMemo(() => {
    if (activeCategory !== "all" && activeCategory !== "glossary") {
      return [];
    }
    if (!normalizedQuery) return glossaryGuides;

    return glossaryGuides.filter((item) => {
      const haystack = [
        item.title,
        item.questionTitle,
        item.shortSummary,
        item.tldr,
        ...item.keywords,
        ...item.faqs.map((f) => `${f.question} ${f.answer}`),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [glossaryGuides, activeCategory, normalizedQuery]);

  // Extract matching long-tail Q&As when user searches (or curated top long-tail Q&As by default)
  const highlightedFaqs = useMemo(() => {
    const allItems = [...mainGuides, ...glossaryGuides];
    if (normalizedQuery) {
      const matches: {
        question: string;
        answer: string;
        guideTitle: string;
        guideSlug: string;
      }[] = [];

      for (const guide of allItems) {
        for (const faq of guide.faqs) {
          if (
            faq.question.toLowerCase().includes(normalizedQuery) ||
            faq.answer.toLowerCase().includes(normalizedQuery)
          ) {
            matches.push({
              question: faq.question,
              answer: faq.answer,
              guideTitle: guide.title,
              guideSlug: guide.slug,
            });
          }
        }
      }
      return matches.slice(0, 10);
    }

    // Default curated long-tail Q&As for search engines and quick scanning
    const defaultQuestions: {
      question: string;
      answer: string;
      guideTitle: string;
      guideSlug: string;
    }[] = [];

    for (const guide of mainGuides) {
      if (guide.faqs.length > 0) {
        defaultQuestions.push({
          question: guide.faqs[0].question,
          answer: guide.faqs[0].answer,
          guideTitle: guide.title,
          guideSlug: guide.slug,
        });
      }
    }
    return defaultQuestions.slice(0, 8);
  }, [mainGuides, glossaryGuides, normalizedQuery]);

  return (
    <div className="space-y-12">
      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft border border-ink-100 space-y-5">
        <div className="relative">
          <label htmlFor="guide-search" className="sr-only">
            חיפוש במדריכים, הלכות ושאלות נפוצות
          </label>
          <div className="flex items-center gap-3 rounded-2xl bg-ink-50 border-2 border-ink-100 focus-within:border-primary-400 focus-within:bg-white px-4 py-3.5 transition-all">
            <i
              className="fas fa-search text-primary-500 text-lg shrink-0"
              aria-hidden="true"
            ></i>
            <input
              id="guide-search"
              type="search"
              dir="rtl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חפשו מושג, הלכה או שאלה... (למשל: הדלקת נרות, קידוש, אורז, תפילין, רבינו תם, מעשר)"
              className="w-full bg-transparent outline-none text-ink-900 placeholder:text-ink-400 font-medium text-base"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs font-bold text-ink-500 hover:text-ink-800 bg-ink-200/60 px-2.5 py-1 rounded-lg shrink-0 transition-colors"
              >
                נקה
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div
          className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
          role="tablist"
          aria-label="סינון לפי קטגוריה"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === "all"
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-ink-50 text-ink-600 hover:bg-primary-50 hover:text-primary-700"
            }`}
          >
            הכל ({mainGuides.length + glossaryGuides.length})
          </button>
          {categories.map((cat) => {
            const count = mainGuides.filter((g) => g.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-primary-600 text-white shadow-sm"
                    : "bg-ink-50 text-ink-600 hover:bg-primary-50 hover:text-primary-700"
                }`}
              >
                {cat.title} ({count})
              </button>
            );
          })}
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === "glossary"}
            onClick={() => setActiveCategory("glossary")}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === "glossary"
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-ink-50 text-ink-600 hover:bg-primary-50 hover:text-primary-700"
            }`}
          >
            מילון מונחים ({glossaryGuides.length})
          </button>
        </div>
      </div>

      {/* Empty state if search finds nothing */}
      {filteredMainGuides.length === 0 &&
        filteredGlossary.length === 0 &&
        highlightedFaqs.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center border border-ink-100 shadow-soft space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto text-2xl">
              <i className="fas fa-search"></i>
            </div>
            <h2 className="font-heading font-bold text-2xl text-ink-900">
              לא נמצאו מדריכים התואמים לחיפוש &quot;{searchQuery}&quot;
            </h2>
            <p className="text-ink-600 max-w-md mx-auto">
              נסו לחפש מילה אחרת, או שאלו ישירות את הרב החכם שלנו ב-AI לקבלת תשובה הלכתית מיידית.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="px-5 py-2.5 rounded-xl bg-ink-100 text-ink-800 font-bold text-sm hover:bg-ink-200 transition-colors"
              >
                הצג את כל המדריכים
              </button>
              <Link
                href="/ask"
                className="btn-primary px-5 py-2.5 rounded-xl font-bold text-sm inline-flex items-center gap-2"
              >
                <i className="fas fa-robot"></i>
                <span>שאל את הרב ב-AI</span>
              </Link>
            </div>
          </div>
        )}

      {/* Thematic Categories Sections (Like zmanim.cc/mah-zeh) */}
      {activeCategory !== "glossary" &&
        categories.map((cat) => {
          const catGuides = filteredMainGuides.filter(
            (g) => g.category === cat.id
          );
          if (catGuides.length === 0) return null;

          return (
            <section
              key={cat.id}
              id={`category-${cat.id}`}
              aria-labelledby={`heading-${cat.id}`}
              className="space-y-4 scroll-mt-28"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-ink-200/70 pb-3">
                <div>
                  <h2
                    id={`heading-${cat.id}`}
                    className="font-heading font-extrabold text-2xl md:text-3xl text-ink-950"
                  >
                    {cat.title}
                  </h2>
                  <p className="text-sm text-ink-600 font-medium mt-0.5">
                    {cat.subtitle}
                  </p>
                </div>
                <span className="text-xs font-bold text-ink-500 bg-ink-100/80 px-3 py-1 rounded-full self-start sm:self-auto">
                  {catGuides.length} מדריכים
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {catGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="group rounded-2xl border border-ink-200/80 bg-white p-5 sm:p-6 shadow-xs hover:border-primary-400 hover:bg-primary-50/25 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-heading font-extrabold text-xl text-ink-900 group-hover:text-primary-600 transition-colors">
                          {guide.title}
                        </h3>
                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-bold ${cat.colorClass}`}
                        >
                          {guide.categoryBadge}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-primary-700/90 mb-2">
                        {guide.questionTitle}
                      </p>
                      <p className="text-sm text-ink-600 font-medium leading-relaxed">
                        {guide.shortSummary}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-ink-100/80 flex items-center justify-between text-xs font-bold text-primary-600">
                      <span>למדריך המלא, נוסח הברכה ושאלות נפוצות</span>
                      <i
                        className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"
                        aria-hidden="true"
                      ></i>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

      {/* Glossary Section (מילון מושגי יסוד וזמני היום) */}
      {filteredGlossary.length > 0 && (
        <section
          id="glossary"
          aria-labelledby="heading-glossary"
          className="heavy-section-deferred space-y-4 pt-8 border-t-2 border-ink-200/70 scroll-mt-28"
        >
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
              <i className="fas fa-book" aria-hidden="true"></i>
              <span>מילון מונחים הלכתי</span>
            </div>
            <h2
              id="heading-glossary"
              className="font-heading font-extrabold text-2xl md:text-3xl text-ink-950"
            >
              מילון זמני היום ומושגי יסוד ביהדות
            </h2>
            <p className="text-sm md:text-base text-ink-600 font-medium">
              הגדרה קצרה ומדויקת לכל מושג וזמן הלכתי במהלך היממה והשנה. לחצו על כל מונח להסבר המלא ושיטות החישוב.
            </p>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGlossary.map((item) => (
              <Link
                key={item.slug}
                href={`/guides/${item.slug}`}
                className="group rounded-2xl border border-ink-200/80 bg-white p-4 sm:p-5 shadow-xs hover:border-primary-400 hover:bg-primary-50/20 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="font-heading font-extrabold text-lg text-ink-900 group-hover:text-primary-600 transition-colors">
                      {item.title}
                    </h3>
                    <span className="shrink-0 rounded-full bg-ink-100 px-2.5 py-0.5 text-[11px] font-bold text-ink-600">
                      {item.categoryBadge}
                    </span>
                  </div>
                  <p className="text-sm text-ink-600 font-medium leading-relaxed">
                    {item.shortSummary}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-ink-50 flex items-center justify-between text-xs font-bold text-primary-600">
                  <span>מה זה {item.title.split(" ")[0]}?</span>
                  <i
                    className="fas fa-chevron-left text-[10px] group-hover:-translate-x-1 transition-transform"
                    aria-hidden="true"
                  ></i>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Long-Tail Quick Q&A Section (שאלות ותשובות נפוצות מהמדריכים) */}
      {highlightedFaqs.length > 0 && (
        <section
          id="popular-questions"
          aria-labelledby="heading-popular-questions"
          className="heavy-section-deferred space-y-4 pt-8 border-t-2 border-ink-200/70"
        >
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
              <i className="fas fa-circle-question" aria-hidden="true"></i>
              <span>תשובות מהירות ומסודרות</span>
            </div>
            <h2
              id="heading-popular-questions"
              className="font-heading font-extrabold text-2xl md:text-3xl text-ink-950"
            >
              {normalizedQuery
                ? `שאלות ותשובות שנמצאו עבור "${searchQuery}"`
                : "שאלות הלכתיות נפוצות (בקיצור ולעניין)"}
            </h2>
            <p className="text-sm md:text-base text-ink-600 font-medium">
              מענה ישיר לשאלות מעשיות שמתעוררות ביומיום ובשבת, מתוך מאגר המדריכים שלנו.
            </p>
          </div>

          <div className="space-y-3">
            {highlightedFaqs.map((faq, idx) => (
              <details
                key={idx}
                name="hub-faq-accordion"
                className="group rounded-2xl bg-white border border-ink-200/80 overflow-hidden shadow-xs hover:border-primary-300 transition-colors"
              >
                <summary className="cursor-pointer select-none px-5 py-4 text-base font-bold text-ink-900 flex items-center justify-between gap-4 list-none [&::-webkit-details-marker]:hidden">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-primary-50 text-primary-600 text-xs font-black flex items-center justify-center shrink-0">
                      ?
                    </span>
                    <span>{faq.question}</span>
                  </div>
                  <span
                    className="text-primary-600 transition-transform duration-200 group-open:rotate-180 shrink-0"
                    aria-hidden="true"
                  >
                    <i className="fas fa-chevron-down text-sm"></i>
                  </span>
                </summary>
                <div className="px-5 pb-5 pt-3 text-sm md:text-base leading-relaxed text-ink-700 border-t border-ink-100 bg-ink-50/40 space-y-3">
                  <p>{faq.answer}</p>
                  <div>
                    <Link
                      href={`/guides/${faq.guideSlug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-800"
                    >
                      <span>קראו עוד במדריך: {faq.guideTitle}</span>
                      <i className="fas fa-arrow-left text-[10px]"></i>
                    </Link>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
