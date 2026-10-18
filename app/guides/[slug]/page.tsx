import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ShabbatTimes from "../../components/ShabbatTimes";
import HebrewDate from "../../components/HebrewDate";
import { allGuides, getGuideBySlug, guideCategories } from "../data";

export async function generateStaticParams() {
  return allGuides.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: "מדריך לא נמצא | תורה לנשמה",
    };
  }

  const canonicalUrl = `https://www.torah-laneshma.org/guides/${guide.slug}`;

  return {
    title: `${guide.questionTitle} | תורה לנשמה`,
    description: guide.metaDescription,
    keywords: guide.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${guide.questionTitle} | תורה לנשמה`,
      description: guide.metaDescription,
      url: canonicalUrl,
      siteName: "תורה לנשמה",
      locale: "he_IL",
      type: "article",
    },
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const baseUrl = "https://www.torah-laneshma.org";
  const pageUrl = `${baseUrl}/guides/${guide.slug}`;

  const categoryMeta = guideCategories.find((c) => c.id === guide.category);

  const relatedItems = guide.relatedSlugs
    .map((s) => getGuideBySlug(s))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const sameCategoryItems = allGuides
    .filter((g) => g.category === guide.category && g.slug !== guide.slug)
    .slice(0, 4);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "בית",
        item: `${baseUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "מדריכים ומושגים",
        item: `${baseUrl}/guides`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.title,
        item: pageUrl,
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.questionTitle,
    name: guide.title,
    description: guide.metaDescription,
    inLanguage: "he-IL",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    about: {
      "@type": "Thing",
      name: guide.title,
    },
    author: {
      "@type": "Organization",
      name: "תורה לנשמה – בית המדרש והחברותות",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "תורה לנשמה",
      url: baseUrl,
    },
  };

  const faqSchema =
    guide.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: "he-IL",
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: ["[data-speakable=\"tldr\"]", "[data-speakable=\"faq\"]"],
          },
          about: {
            "@type": "Thing",
            name: guide.title,
          },
          mainEntity: guide.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <div className="min-h-screen bg-ink-50 font-sans text-ink-900 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <Navbar />

      <main className="flex-grow pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-8">
          {/* Breadcrumbs */}
          <nav
            aria-label="פירורי לחם"
            className="text-xs font-semibold text-ink-500"
          >
            <ol className="flex items-center flex-wrap gap-1.5">
              <li>
                <Link
                  href="/"
                  className="hover:text-primary-600 transition-colors"
                >
                  בית
                </Link>
              </li>
              <li aria-hidden="true" className="text-ink-300">
                /
              </li>
              <li>
                <Link
                  href="/guides"
                  className="hover:text-primary-600 transition-colors"
                >
                  מדריכים ומושגים
                </Link>
              </li>
              <li aria-hidden="true" className="text-ink-300">
                /
              </li>
              <li aria-current="page" className="text-ink-800 font-bold">
                {guide.title}
              </li>
            </ol>
          </nav>

          {/* Header */}
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  categoryMeta?.colorClass ||
                  "bg-primary-50 text-primary-700 border-primary-200"
                }`}
              >
                {guide.categoryBadge}
              </span>
              {guide.isGlossary && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-ink-100 text-ink-700">
                  מילון מונחים הלכתי
                </span>
              )}
              {guide.showShabbatWidget && (
                <>
                  <ShabbatTimes />
                  <HebrewDate />
                </>
              )}
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-[2.65rem] text-ink-950 leading-[1.15]">
              {guide.questionTitle}
            </h1>

            <p className="text-base sm:text-lg text-ink-600 font-medium leading-relaxed">
              {guide.shortSummary}
            </p>
          </header>

          {/* TL;DR Summary Callout Box (תקציר) */}
          <aside
            aria-label={`תקציר: ${guide.title}`}
            data-speakable="tldr"
            className="rounded-2xl border-s-4 border-primary-600 bg-white p-5 sm:p-6 shadow-soft border border-ink-100"
          >
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary-600 mb-2">
              <i className="fas fa-bolt" aria-hidden="true"></i>
              <span>בקיצור – תשובה מהירה</span>
            </div>
            <p className="text-base sm:text-[1.05rem] leading-relaxed text-ink-900 font-semibold">
              {guide.tldr}
            </p>
          </aside>

          {/* Quick Jump Table of Contents (for guides with multiple sections) */}
          {guide.sections.length > 1 && (
            <nav
              aria-label="תוכן עניינים במדריך"
              className="rounded-2xl bg-white border border-ink-200/80 p-4 sm:p-5 shadow-xs"
            >
              <div className="text-xs font-extrabold uppercase tracking-wider text-ink-500 mb-2.5 flex items-center gap-2">
                <i className="fas fa-list-ul text-primary-500" aria-hidden="true"></i>
                <span>תוכן העניינים במדריך זה:</span>
              </div>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm font-bold text-primary-700">
                {guide.blessingBox && (
                  <li>
                    <a
                      href="#blessing-box"
                      className="hover:text-primary-900 hover:underline flex items-center gap-1.5"
                    >
                      <span className="text-primary-400">•</span>
                      <span>{guide.blessingBox.title}</span>
                    </a>
                  </li>
                )}
                {guide.sections.map((sec) => (
                  <li key={sec.id}>
                    <a
                      href={`#${sec.id}`}
                      className="hover:text-primary-900 hover:underline flex items-center gap-1.5"
                    >
                      <span className="text-primary-400">•</span>
                      <span>{sec.heading}</span>
                    </a>
                  </li>
                ))}
                {guide.faqs.length > 0 && (
                  <li>
                    <a
                      href="#faq-heading"
                      className="hover:text-primary-900 hover:underline flex items-center gap-1.5"
                    >
                      <span className="text-primary-400">•</span>
                      <span>שאלות נפוצות ({guide.faqs.length})</span>
                    </a>
                  </li>
                )}
                {guide.sources.length > 0 && (
                  <li>
                    <a
                      href="#sources-heading"
                      className="hover:text-primary-900 hover:underline flex items-center gap-1.5"
                    >
                      <span className="text-primary-400">•</span>
                      <span>מקורות הלכתיים</span>
                    </a>
                  </li>
                )}
              </ul>
            </nav>
          )}

          {/* Practical Blessing & Customs Box (הלכה למעשה ונוסח הברכה) */}
          {guide.blessingBox && (
            <section
              id="blessing-box"
              aria-labelledby="blessing-box-heading"
              className="rounded-3xl bg-gradient-to-br from-amber-50/90 via-white to-primary-50/50 border-2 border-amber-200/80 p-6 sm:p-7 shadow-soft space-y-5 scroll-mt-28"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                  <i className="fas fa-star-of-david text-sm" aria-hidden="true"></i>
                </div>
                <h2
                  id="blessing-box-heading"
                  className="font-heading font-extrabold text-xl sm:text-2xl text-ink-950"
                >
                  {guide.blessingBox.title}
                </h2>
              </div>

              {guide.blessingBox.blessingText && (
                <div className="rounded-2xl bg-white border border-amber-200/90 p-4 sm:p-5 shadow-xs">
                  <p className="text-lg sm:text-xl font-bold text-ink-950 leading-loose whitespace-pre-line">
                    {guide.blessingBox.blessingText}
                  </p>
                </div>
              )}

              {(guide.blessingBox.sephardicCustom ||
                guide.blessingBox.ashkenazicCustom) && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {guide.blessingBox.sephardicCustom && (
                    <div className="rounded-2xl bg-white/90 border border-ink-200/70 p-4 space-y-1.5">
                      <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full">
                        <span>מנהג ספרד ועדות המזרח</span>
                      </div>
                      <p className="text-sm text-ink-700 font-medium leading-relaxed">
                        {guide.blessingBox.sephardicCustom}
                      </p>
                    </div>
                  )}
                  {guide.blessingBox.ashkenazicCustom && (
                    <div className="rounded-2xl bg-white/90 border border-ink-200/70 p-4 space-y-1.5">
                      <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                        <span>מנהג אשכנז</span>
                      </div>
                      <p className="text-sm text-ink-700 font-medium leading-relaxed">
                        {guide.blessingBox.ashkenazicCustom}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {guide.blessingBox.practicalTip && (
                <div className="flex items-start gap-3 text-sm text-ink-700 bg-amber-100/50 rounded-xl p-3.5 border border-amber-200/60">
                  <i
                    className="fas fa-lightbulb text-amber-600 mt-1 shrink-0"
                    aria-hidden="true"
                  ></i>
                  <p className="font-medium leading-relaxed">
                    <strong className="font-bold text-ink-900">הלכה למעשה: </strong>
                    {guide.blessingBox.practicalTip}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Main Article Body */}
          <article className="space-y-8 bg-white rounded-3xl p-6 sm:p-8 border border-ink-100 shadow-soft">
            {guide.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="space-y-3.5 scroll-mt-28 first:pt-0 pt-4 border-t first:border-t-0 border-ink-100"
              >
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-ink-950">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-base sm:text-[1.05rem] leading-loose text-ink-800 font-normal whitespace-pre-line"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="list-disc list-inside space-y-2 text-base text-ink-800 pr-2">
                    {section.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>

          {/* Related Concepts & Guides (למידע נוסף) */}
          {(relatedItems.length > 0 || sameCategoryItems.length > 0) && (
            <section
              aria-label="למידע נוסף ומדריכים קשורים"
              className="rounded-3xl border border-ink-200/80 bg-white p-6 shadow-xs space-y-5"
            >
              <h2 className="font-heading font-extrabold text-lg text-ink-950">
                למידע נוסף במאגר המדריכים
              </h2>

              {relatedItems.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2.5">
                    מושגים ומדריכים קשורים
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {relatedItems.map((rel) => (
                      <li key={rel.slug}>
                        <Link
                          href={`/guides/${rel.slug}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-ink-50 px-3.5 py-1.5 text-sm font-bold text-ink-800 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        >
                          <span>{rel.title}</span>
                          <i
                            className="fas fa-arrow-left text-[10px] opacity-60"
                            aria-hidden="true"
                          ></i>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {sameCategoryItems.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2.5">
                    עוד בקטגוריית {guide.categoryBadge}
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {sameCategoryItems.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/guides/${item.slug}`}
                          className="inline-flex items-center rounded-full border border-ink-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-ink-700 hover:border-primary-500 hover:text-primary-600 transition-colors"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href="/guides"
                        className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1.5 text-sm font-bold text-primary-700 hover:bg-primary-100 transition-colors"
                      >
                        לכל המדריכים ←
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* FAQ Section (שאלות נפוצות) using native <details> */}
          {guide.faqs.length > 0 && (
            <section
              aria-labelledby="faq-heading"
              data-speakable="faq"
              className="heavy-section-deferred space-y-4 pt-2 scroll-mt-28"
            >
              <div className="flex items-center justify-between">
                <h2
                  id="faq-heading"
                  className="font-heading font-extrabold text-2xl sm:text-3xl text-ink-950"
                >
                  שאלות נפוצות – {guide.title}
                </h2>
                <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
                  {guide.faqs.length} תשובות
                </span>
              </div>

              <div className="space-y-3">
                {guide.faqs.map((faq, index) => (
                  <details
                    key={index}
                    name="guide-detail-faq"
                    open={index === 0}
                    className="group rounded-2xl bg-white border border-ink-200/80 overflow-hidden shadow-xs hover:border-primary-300 transition-colors"
                  >
                    <summary className="cursor-pointer select-none px-5 py-4 text-base font-bold text-ink-950 flex items-center justify-between gap-4 list-none [&::-webkit-details-marker]:hidden">
                      <span>{faq.question}</span>
                      <span
                        className="text-primary-600 transition-transform duration-200 group-open:rotate-180 shrink-0"
                        aria-hidden="true"
                      >
                        <i className="fas fa-chevron-down text-sm"></i>
                      </span>
                    </summary>
                    <div className="px-5 pb-5 pt-3 text-sm sm:text-base leading-relaxed text-ink-700 border-t border-ink-100 bg-ink-50/40">
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Sources Section (מקורות) */}
          {guide.sources.length > 0 && (
            <section
              aria-labelledby="sources-heading"
              className="heavy-section-deferred rounded-3xl border border-ink-200/80 bg-white p-6 shadow-xs space-y-4 scroll-mt-28"
            >
              <div className="flex items-center justify-between gap-2">
                <h2
                  id="sources-heading"
                  className="font-heading font-extrabold text-lg sm:text-xl text-ink-950 flex items-center gap-2"
                >
                  <i
                    className="fas fa-book-bookmark text-primary-600 text-base"
                    aria-hidden="true"
                  ></i>
                  <span>מקורות הלכתיים וסימוכין</span>
                </h2>
                <Link
                  href="/study"
                  className="text-xs font-bold text-primary-600 hover:text-primary-800 inline-flex items-center gap-1"
                >
                  <span>פתח בבית המדרש</span>
                  <i className="fas fa-external-link-alt text-[10px]"></i>
                </Link>
              </div>
              <ul className="space-y-2.5 text-sm leading-relaxed text-ink-600">
                {guide.sources.map((src, idx) => (
                  <li
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 pb-2 border-b last:border-b-0 border-ink-100"
                  >
                    <span className="font-bold text-ink-900 shrink-0">
                      • {src.title}:
                    </span>
                    <span>{src.description}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Contextual Chavruta & AI Rabbi CTA */}
          <section className="rounded-3xl bg-gradient-to-br from-ink-900 to-ink-950 text-white p-6 sm:p-8 shadow-elevated space-y-5">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                <i className="fas fa-comments" aria-hidden="true"></i>
                <span>תורה לנשמה · למידה אישית</span>
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl">
                רוצים ללמוד על {guide.title} בחברותא אישית?
              </h2>
              <p className="text-ink-300 text-sm sm:text-base leading-relaxed">
                המדריך שקראתם הוא רק טעימה. אתם מוזמנים לקבוע שיחת לימוד שבועית בטלפון עם חברותא קבוע בקצב שלכם (בחינם לגמרי), או לשאול שאלה ספציפית את הרב החכם שלנו ב-AI.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/#join"
                className="btn-primary px-6 py-3 rounded-2xl font-heading font-bold text-sm sm:text-base inline-flex items-center gap-2"
              >
                <span>הרשמה לחברותא אישית (חינם)</span>
                <i className="fas fa-arrow-left text-xs" aria-hidden="true"></i>
              </Link>
              <Link
                href="/ask"
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-heading font-bold text-sm sm:text-base transition-colors inline-flex items-center gap-2"
              >
                <i className="fas fa-robot text-primary-400" aria-hidden="true"></i>
                <span>שאל את הרב ב-AI</span>
              </Link>
              <Link
                href="/guides"
                className="px-4 py-3 rounded-2xl text-ink-300 hover:text-white font-bold text-sm transition-colors"
              >
                חזרה לכל המדריכים
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
