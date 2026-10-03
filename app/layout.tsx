import type { Metadata } from "next";
import Script from "next/script";
import { Assistant, Rubik } from "next/font/google";
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';
import '@fortawesome/fontawesome-free/css/brands.min.css';
import "./globals.css";
import HolidayBanner from "./components/HolidayBanner";

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  variable: "--font-assistant",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.torah-laneshma.org"),
  title: "תורה לנשמה | חברותא טלפונית ללימוד תורה, בקצב שלך",
  description: "חברותא טלפונית אישית ללימוד תורה, 929, דף יומי ופרשת שבוע. ללמוד חצי שעה בשבוע, בקצב שלך, מכל מקום ובחינם. פתרון קל ויעיל לחיבור למסורת בתוך שגרת החיים.",
  keywords: ["לימוד תורה", "חברותא", "דף יומי", "פרשת שבוע", "יהדות", "בית מדרש", "זוגיות ומידות"],
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: "https://www.torah-laneshma.org",
    title: "תורה לנשמה | חברותא טלפונית ללימוד תורה",
    description: "חברותא טלפונית אישית ללימוד תורה, מכל מקום ובחינם. פתרון קל לחיבור למסורת בשגרת החיים.",
    siteName: "תורה לנשמה",
  },
  twitter: {
    card: "summary_large_image",
    title: "תורה לנשמה | חברותא ללימוד תורה",
    description: "חברותא טלפונית ללימוד תורה, בקצב שלך, ללא עלות.",
  },
  alternates: {
    canonical: "https://www.torah-laneshma.org",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://www.torah-laneshma.org",
    "name": "תורה לנשמה",
    "description": "חברותא טלפונית אישית ללימוד תורה, מכל מקום ובחינם. פתרון קל לחיבור למסורת בשגרת החיים.",
    "publisher": {
      "@type": "Organization",
      "name": "תורה לנשמה"
    }
  };

  return (
    <html lang="he" dir="rtl" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#1f84ee" />
        <link rel="preconnect" href="https://upload.wikimedia.org" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="Torah Laneshima LLM Guide" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${assistant.variable} ${rubik.variable} antialiased`}>
        <HolidayBanner />
        <Script 
          src="https://analytics.ahrefs.com/analytics.js" 
          data-key="n9w2GKUrpeZ8gQf6pLCWlA" 
          strategy="afterInteractive" 
        />

        <main>{children}</main>
      </body>
    </html>
  );
}
