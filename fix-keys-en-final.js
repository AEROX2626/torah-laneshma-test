const fs = require("fs");
let p = fs.readFileSync("app/page.tsx", "utf8");

p = p.replace('name="שם_מלא"', 'name="Full Name"');
p = p.replace('name="מספר_טלפון"', 'name="Phone Number"');
p = p.replace('name="נושא_מועדף"', 'name="Preferred Topic"');
p = p.replace('name="הערות_נוספות"', 'name="Additional Notes"');

fs.writeFileSync("app/page.tsx", p, "utf8");
console.log("Reverted keys back to English with spaces");
