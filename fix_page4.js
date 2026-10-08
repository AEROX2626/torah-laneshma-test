const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

const footerIndex = code.indexOf('<Footer />');
if (footerIndex !== -1) {
  code = code.substring(0, footerIndex + 10) + '\n      </>\n    );\n  }\n';
}

fs.writeFileSync('app/page.tsx', code, 'utf8');
console.log('Fixed page end');
