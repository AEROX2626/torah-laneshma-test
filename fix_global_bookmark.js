const fs = require('fs');
let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

code = code.replace(
  'disabled={bookmarks.some(b => b.ref === data.ref)}',
  'disabled={bookmarks.some(b => b.ref === data.ref && b.verseIdx === undefined)}'
);
code = code.replace(
  '${bookmarks.some(b => b.ref === data.ref) \n                        ? \'bg-amber-100 text-amber-700\'',
  '${bookmarks.some(b => b.ref === data.ref && b.verseIdx === undefined) \n                        ? \'bg-amber-100 text-amber-700\''
);

// We need to fix the addBookmark function to only check for undefined verseIdx
code = code.replace(
  'if (bookmarks.some(b => b.ref === data.ref)) return;',
  'if (bookmarks.some(b => b.ref === data.ref && b.verseIdx === undefined)) return;'
);

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
console.log('Fixed global bookmark logic');
