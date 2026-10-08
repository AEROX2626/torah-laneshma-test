const fs = require('fs');
let code = fs.readFileSync('app/globals.css', 'utf8');

if (!code.includes('@custom-variant dark')) {
  code = code.replace('@import "tailwindcss";', '@import "tailwindcss";\n\n@custom-variant dark (&:where(.dark, .dark *));');
  fs.writeFileSync('app/globals.css', code, 'utf8');
  console.log("Added custom-variant dark to globals.css");
}
