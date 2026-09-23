const fs = require("fs");
let p = fs.readFileSync("app/page.tsx", "utf8");

p = p.replace('id="name" required', 'id="name" name="name" required');
p = p.replace('id="phone" required pattern="[0-9]{9,10}"', 'id="phone" name="phone" required pattern="[0-9]{9,10}"');
p = p.replace('id="topic" className="w-full', 'id="topic" name="topic" className="w-full');
p = p.replace('id="timing" className="w-full', 'id="timing" name="timing" className="w-full');

fs.writeFileSync("app/page.tsx", p, "utf8");
