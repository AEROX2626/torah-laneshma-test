const fs = require("fs");
let p = fs.readFileSync("app/components/Navbar.tsx", "utf8");
p = p.replace('btn-primary mr-3 px-7 py-3', 'btn-primary mr-1 lg:mr-3 px-4 lg:px-6 py-2.5');
fs.writeFileSync("app/components/Navbar.tsx", p, "utf8");
