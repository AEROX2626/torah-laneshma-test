const fs = require("fs");
let p = fs.readFileSync("app/layout.tsx", "utf8");

if (!p.includes("import HolidayBanner")) {
  p = p.replace('import "./globals.css";', 'import "./globals.css";\nimport HolidayBanner from "./components/HolidayBanner";');
  p = p.replace('<body className', '<body className');
  p = p.replace('{children}', '<HolidayBanner />\n        {children}');
  fs.writeFileSync("app/layout.tsx", p, "utf8");
}
