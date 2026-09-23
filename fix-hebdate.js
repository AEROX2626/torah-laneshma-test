const fs = require("fs");
let code = `"use client";

import { useEffect, useState } from "react";

export default function HebrewDate() {
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const d = new Date().toISOString().split('T')[0];
    fetch(\`https://www.hebcal.com/converter?cfg=json&date=\${d}&g2h=1&strict=1\`)
      .then(r => r.json())
      .then(data => {
         // Remove nikud for cleaner look
         const cleanText = data.hebrew.replace(/[\\u0591-\\u05C7]/g, '');
         setDateStr(cleanText);
      })
      .catch(() => {});
  }, []);
  
  if (!dateStr) return null;

  return (
    <a 
      href="https://www.yeshiva.org.il/calendar"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary-100 text-primary-700 font-bold text-sm shadow-soft hover:bg-primary-50 transition-colors group"
      title="צפו בלוח השנה המלא"
    >
      <i className="fas fa-calendar-alt text-primary-500 group-hover:scale-110 transition-transform"></i>
      <span>{dateStr}</span>
    </a>
  );
}
`;
fs.writeFileSync("app/components/HebrewDate.tsx", code, "utf8");
