const fs = require("fs");
let p = fs.readFileSync("app/page.tsx", "utf8");

if (!p.includes("import HebrewDate")) {
  p = p.replace('import ShabbatTimes from "./components/ShabbatTimes";', 'import ShabbatTimes from "./components/ShabbatTimes";\nimport HebrewDate from "./components/HebrewDate";');
  p = p.replace('<ShabbatTimes />', '<ShabbatTimes />\n                <HebrewDate />');
  fs.writeFileSync("app/page.tsx", p, "utf8");
}
