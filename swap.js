const fs = require("fs");
let p = fs.readFileSync("app/page.tsx", "utf8");
p = p.replace('import DailyTipWidget from "./components/DailyTipWidget";', 'import DailyInspiration from "./components/DailyInspiration";');
p = p.replace('<DailyTipWidget />', '<DailyInspiration />');
fs.writeFileSync("app/page.tsx", p, "utf8");
