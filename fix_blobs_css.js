const fs = require('fs');
let code = fs.readFileSync('app/globals.css', 'utf8');

code = code.replace(
  /\.blob {[\s\S]*?}/,
  ''
);

fs.writeFileSync('app/globals.css', code, 'utf8');
