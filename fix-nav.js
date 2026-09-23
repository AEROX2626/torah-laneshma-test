const fs = require("fs");
let c = fs.readFileSync("app/components/Navbar.tsx", "utf8");
c = c.replace(/<i className="fas fa-robot text-primary-500"><\/i>[^<]*<\/Link>/g, '<i className="fas fa-robot text-primary-500"></i>שאל את הרב</Link>');
fs.writeFileSync("app/components/Navbar.tsx", c, "utf8");
