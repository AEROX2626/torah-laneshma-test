const fs = require("fs");
let p = fs.readFileSync("app/articles/[slug]/page.tsx", "utf8");

// Import
if (!p.includes("RabbiAIChat")) {
  p = p.replace('import Link from "next/link";', 'import Link from "next/link";\nimport RabbiAIChat from "../../components/RabbiAIChat";');
}

// Section
const chatSection = `
          <div className="mt-16 pt-12 border-t border-ink-100 mb-10">
            <div className="text-center mb-8">
              <h3 className="font-heading font-black text-2xl md:text-3xl text-ink-950 mb-3">יש לכם שאלות נוספות על הפרשה?</h3>
              <p className="text-ink-600 font-medium">הרב הווירטואלי שלנו ישמח לענות לכם על כל שאלה, כאן ועכשיו.</p>
            </div>
            <RabbiAIChat />
          </div>
`;

p = p.replace(
  `<div className="mt-14 pt-10 border-t border-ink-100 flex justify-center">`,
  chatSection + `\n          <div className="mt-14 pt-10 border-t border-ink-100 flex justify-center">`
);

fs.writeFileSync("app/articles/[slug]/page.tsx", p, "utf8");
console.log("Article page modified");
