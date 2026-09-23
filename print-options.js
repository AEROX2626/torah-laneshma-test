const fs = require("fs");
const lines = fs.readFileSync("app/page.tsx", "utf8").split('\n');
const start = lines.findIndex(l => l.includes('name="topic"'));
if(start > -1) {
  console.log(lines.slice(start - 2, start + 10).join('\n'));
}
