const fs = require('fs');
let code = fs.readFileSync('app/layout.tsx', 'utf8');

const newMetadata = `export const metadata: Metadata = {
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
};`;

code = code.replace(/export const metadata: Metadata = {[\s\S]*?};/, newMetadata);
fs.writeFileSync('app/layout.tsx', code, 'utf8');
console.log("Updated layout metadata");
