const fs = require("fs");
let p = fs.readFileSync("next.config.ts", "utf8");
// Let's add an encoded version for adopt
p = p.replace(
  "{ source: '/אמץ-אברך', destination: '/adopt', permanent: true },",
  "{ source: '/אמץ-אברך', destination: '/adopt', permanent: true },\n      { source: '/%D7%90%D7%9E%D7%A5-%D7%90%D7%91%D7%A8%D7%9A', destination: '/adopt', permanent: true },"
);
fs.writeFileSync("next.config.ts", p, "utf8");
