const fs = require("fs");
const code = fs.readFileSync("app/articles/data.ts", "utf8");
const arrStr = code.substring(code.indexOf("["), code.lastIndexOf("]") + 1);
const articles = eval(arrStr);
fs.writeFileSync("app/articles/content.json", JSON.stringify(articles, null, 2), "utf8");
fs.writeFileSync("app/articles/data.ts", 'import articlesData from "./content.json";\n\nexport const articles = articlesData;\n', "utf8");
