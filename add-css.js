const fs = require("fs");
let css = fs.readFileSync("app/globals.css", "utf8");
if(!css.includes(".no-scrollbar")) {
  css += `\n\n/* Hide scrollbar for clean UI */\n.no-scrollbar::-webkit-scrollbar {\n  display: none;\n}\n.no-scrollbar {\n  -ms-overflow-style: none;\n  scrollbar-width: none;\n}\n`;
  fs.writeFileSync("app/globals.css", css, "utf8");
}
