const fs = require("fs");
let p = fs.readFileSync("app/components/ShabbatTimes.tsx", "utf8");

p = p.replace(
  'inTime: new Date(candles.date).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jerusalem" }),',
  'inTime: candles.title.match(/\\d{1,2}:\\d{2}/)?.[0] || "",'
);

p = p.replace(
  'outTime: new Date(havdalah.date).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jerusalem" }),',
  'outTime: havdalah.title.match(/\\d{1,2}:\\d{2}/)?.[0] || "",'
);

fs.writeFileSync("app/components/ShabbatTimes.tsx", p, "utf8");
console.log("Rewrote ShabbatTimes.tsx");
