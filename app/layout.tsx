import type { Metadata } from "next";
import { Assistant, Rubik } from "next/font/google";
import "./globals.css";
import HolidayBanner from "./components/HolidayBanner";

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  variable: "--font-assistant",
});

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  variable: "--font-rubik",
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
  return (
    <html lang="he" dir="rtl" className="scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={`${assistant.variable} ${rubik.variable} antialiased`}>
        <HolidayBanner />
        {children}
      </body>
    </html>
  );
}
