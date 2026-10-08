const fs = require('fs');

let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

code = code.replace(
  '  prev?: string;',
  `  prev?: string;
  sectionNames?: string[];
  sections?: (string | number)[];
  indexTitle?: string;
  heIndexTitle?: string;
  book?: string;`
);

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
