const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

code = code.replace(
  '</>\n    );\n  }\n',
  '<PageEffects />\n      </>\n    );\n  }\n'
);

fs.writeFileSync('app/page.tsx', code, 'utf8');
console.log('Added PageEffects');
