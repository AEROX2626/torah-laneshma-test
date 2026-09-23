const fs = require("fs");
let p = fs.readFileSync("app/components/Navbar.tsx", "utf8");
p = p.replace(/text-\[14px\] lg:text-\[15px\] hover:text-primary-600 font-semibold text-\[15px\]/g, 'text-[14px] lg:text-[15px] hover:text-primary-600 font-semibold');
fs.writeFileSync("app/components/Navbar.tsx", p, "utf8");
