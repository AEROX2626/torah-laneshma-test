const fs = require('fs');
let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

code = code.replace(
  /\$\{bookmarks\.some\(b => b\.ref === data\.ref\)\s*\?\s*'bg-amber-100 text-amber-700'/g,
  '${bookmarks.some(b => b.ref === data.ref && b.verseIdx === undefined) ? \'bg-amber-100 text-amber-700\''
);

code = code.replace(
  /<i className=\{bookmarks\.some\(b => b\.ref === data\.ref\) \? "fas fa-bookmark" : "far fa-bookmark"\}><\/i>/g,
  '<i className={bookmarks.some(b => b.ref === data.ref && b.verseIdx === undefined) ? "fas fa-bookmark" : "far fa-bookmark"}></i>'
);

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
