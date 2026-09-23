const fs = require("fs");
let p = fs.readFileSync("app/page.tsx", "utf8");
if (!p.includes("<DailyInspiration />")) {
  p = p.replace('<section id="about"', '<DailyInspiration />\n\n      <section id="about"');
  fs.writeFileSync("app/page.tsx", p, "utf8");
}
