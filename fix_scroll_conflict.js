const fs = require('fs');
let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

// Fix 1: Remove smooth scrolling to top in fetchText to avoid conflicting with verse scrolling
code = code.replace(
  /contentRef\.current\.scrollTo\(\{\s*top:\s*0,\s*behavior:\s*'smooth'\s*\}\);/,
  'contentRef.current.scrollTo({ top: 0 });'
);

// Fix 2: Increase timeout to ensure DOM is fully rendered on slower mobile devices
code = code.replace(
  /setPendingScrollVerse\(null\);\s*\}, 300\);/,
  'setPendingScrollVerse(null);\n      }, 600);'
);

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
console.log('Fixed scroll conflict and timing');
