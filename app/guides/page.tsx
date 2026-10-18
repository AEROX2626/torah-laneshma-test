import { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GuidesExplorer from "./GuidesExplorer";
import {
  allGuides,
  guideCategories,
  mainGuides,
  glossaryGuides,
} from "./data";

export const metadata: Metadata = {
  title: "מדריכי יהדות, הלכה ומונחים – מה זה... | תורה לנשמה",
  description:
    "מדריכים מלאים בעברית בגובה העיניים: הדלקת נרות שבת, קידוש, הבדלה, הנחת תפילין, קריאת שמע, ברכת המזון, חברותא, הדף היומי, מעשר כספים, שמירת הלשון ומילון זמני היום.",
  alternates: {
    canonical: "https://www.torah-laneshma.org/guides",
  },
  openGraph: {
    title: "מדריכי יהדות, הלכה ומונחים – מה זה... | תורה לנשמה",
    description:
      "הסבר מלא, נוסחי ברכות, הבדלי מנהגים (ספרדים ואשכנזים), שאלות ותשובות ומקורות לכל מצווה וזמן ביהדות.",
    url: "https://www.torah-laneshma.org/guides",
    siteName: "תורה לנשמה",
    locale: "he_IL",
    type: "website",
  },
};

export default function GuidesIndexPage() {
  const baseUrl = "https://www.torah-laneshma.org";

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
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "מדריכי הלכה, יהדות ומונחים – תורה לנשמה",
    description:
      "מאגר מדריכים מעשיים ומושגי יסוד ביהדות: שבת, תפילה, ברכות, לימוד בחברותא, מידות וזמני היום.",
    numberOfItems: allGuides.length,
    itemListElement: allGuides.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${baseUrl}/guides/${guide.slug}`,
      name: guide.title,
      description: guide.shortSummary,
    })),
  };

  const hubFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "he-IL",
    mainEntity: mainGuides.slice(0, 8).map((g) => ({
      "@type": "Question",
      name: g.faqs[0].question,
      acceptedAnswer: {
        "@type": "Answer",
        text: g.faqs[0].answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-ink-50 font-sans text-ink-900 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hubFaqSchema) }}
      />

      <Navbar />

      <main className="flex-grow pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-10">
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
              <li aria-current="page" className="text-ink-800 font-bold">
                מדריכים ומושגים
              </li>
            </ol>
          </nav>

          {/* Hero Header */}
          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 font-bold text-xs tracking-wide">
              <i className="fas fa-compass" aria-hidden="true"></i>
              <span>אנציקלופדיה מעשית בגובה העיניים · {allGuides.length} מדריכים ומונחים</span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-ink-950 leading-tight">
              מדריכי יהדות, הלכה ו<span className="text-gradient">מושגי יסוד</span>
            </h1>
            <p className="text-base sm:text-lg text-ink-600 font-medium leading-relaxed max-w-3xl">
              הסבר מלא ומסודר, נוסחי ברכות מנוקדים, הבדלי מנהגים בין ספרדים לאשכנזים, מקורות הלכתיים ותשובות לשאלות נפוצות – לכל מצווה, תפילה וזמן בלוח היהודי.
            </p>
          </header>

          {/* Interactive Explorer (All Guides + Glossary + Q&A rendered in SSR HTML) */}
          <GuidesExplorer
            categories={guideCategories}
            mainGuides={mainGuides}
            glossaryGuides={glossaryGuides}
          />

          {/* Bottom Interactive Help & Chavruta Banner */}
          <section className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 text-white p-7 sm:p-10 shadow-elevated flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-right max-w-xl">
              <span className="inline-block text-xs font-bold uppercase tracking-widest bg-white/15 px-3 py-1 rounded-full">
                לימוד אישי בחינם
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl leading-tight">
                רוצים להעמיק בנושאים האלו עם חברותא אישית?
              </h2>
              <p className="text-primary-100 text-sm sm:text-base font-medium leading-relaxed">
                אין תחליף לשיחה טובה בגובה העיניים. הירשמו לשיחת חברותא שבועית בטלפון (ללא עלות וללא התחייבות), או שאלו עכשיו את הרב החכם ב-AI כל שאלה הלכתית.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <Link
                href="/#join"
                className="px-6 py-3.5 rounded-2xl bg-white text-primary-700 font-heading font-extrabold text-sm sm:text-base shadow-lg hover:bg-primary-50 transition-all inline-flex items-center gap-2"
              >
                <span>תיאום חברותא בחינם</span>
                <i className="fas fa-arrow-left text-xs" aria-hidden="true"></i>
              </Link>
              <Link
                href="/ask"
                className="px-5 py-3.5 rounded-2xl bg-primary-700/70 border border-white/25 text-white font-heading font-bold text-sm sm:text-base hover:bg-primary-700 transition-all inline-flex items-center gap-2"
              >
                <i className="fas fa-robot" aria-hidden="true"></i>
                <span>שאל את הרב ב-AI</span>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
