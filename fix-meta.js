const fs = require("fs");
let p = fs.readFileSync("app/page.tsx", "utf8");

// Fix corrupted subject and from_name
p = p.replace(/formData\.append\("subject", ".*"\);/, 'formData.append("subject", "ליד חדש מהאתר - בקשה לחברותא!");');
p = p.replace(/formData\.append\("from_name", ".*"\);/, 'formData.append("from_name", "תורה לנשמה");');

fs.writeFileSync("app/page.tsx", p, "utf8");
console.log("Fixed Web3Forms metadata!");
