const fs = require("fs");
let css = fs.readFileSync("app/globals.css", "utf8");
css = css.replace('#mobile-menu.open { max-height: 400px; }', '#mobile-menu.open { max-height: 800px; overflow-y: auto; }');
fs.writeFileSync("app/globals.css", css, "utf8");
