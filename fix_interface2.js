const fs = require('fs');
let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

code = code.replace(
  /interface Bookmark\s*\{[^}]+\}/,
  'interface Bookmark {\n  ref: string;\n  heRef: string;\n  timestamp: number;\n  verseIdx?: number;\n}'
);

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
