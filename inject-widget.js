const fs = require("fs");
let p = fs.readFileSync("app/page.tsx", "utf8");

p = p.replace(
  `import Navbar from "./components/Navbar";`,
  `import Navbar from "./components/Navbar";\nimport DailyTipWidget from "./components/DailyTipWidget";`
);

p = p.replace(
  `{/* About Section */}`,
  `<DailyTipWidget />\n\n      {/* About Section */}`
);

fs.writeFileSync("app/page.tsx", p, "utf8");
