const fs = require("fs");
let p = fs.readFileSync("app/page.tsx", "utf8");

p = p.replace('name="Full_Name"', 'name="שם_מלא"');
p = p.replace('name="Phone"', 'name="מספר_טלפון"');
p = p.replace('name="Preferred_Topic"', 'name="נושא_מועדף"');
p = p.replace('name="Additional_Notes"', 'name="הערות_נוספות"');

fs.writeFileSync("app/page.tsx", p, "utf8");
console.log("Reverted keys to proper UTF-8 Hebrew successfully!");
