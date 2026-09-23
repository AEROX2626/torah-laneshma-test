const fs = require("fs");
let p = fs.readFileSync("app/page.tsx", "utf8");
p = p.replace('process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "YOUR_KEY_HERE"', 'process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "1b556ba1-7101-43c0-b8d2-890c4226ec11"');
fs.writeFileSync("app/page.tsx", p, "utf8");
