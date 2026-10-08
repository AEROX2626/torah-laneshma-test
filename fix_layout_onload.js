const fs = require('fs');
let code = fs.readFileSync('app/layout.tsx', 'utf8');

code = code.replace(
  '// @ts-ignore\n          onLoad="this.media=\'all\'"',
  'onLoad={(e) => { e.currentTarget.media = "all"; }}'
);

fs.writeFileSync('app/layout.tsx', code, 'utf8');
