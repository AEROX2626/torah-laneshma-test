const fs = require("fs");
let p = fs.readFileSync("app/page.tsx", "utf8");

// Revert Hebrew names back to English because Web3Forms API drops non-ASCII form keys.
p = p.replace('name="שם_מלא"', 'name="Full_Name"');
p = p.replace('name="טלפון"', 'name="Phone"');
p = p.replace('name="נושא_מועדף"', 'name="Preferred_Topic"');
p = p.replace('name="הערות"', 'name="Additional_Notes"');

fs.writeFileSync("app/page.tsx", p, "utf8");
console.log("Reverted keys to English successfully!");
