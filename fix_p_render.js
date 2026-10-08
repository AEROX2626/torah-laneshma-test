const fs = require('fs');
let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

// The block to replace:
// <p 
//   dangerouslySetInnerHTML={{ __html: paragraph }} 
//   style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
//   className={`font-serif leading-loose ${isDarkMode ? 'text-slate-50' : 'text-slate-900'}`}
// />

code = code.replace(
  /<p\s*dangerouslySetInnerHTML=\{\{\s*__html:\s*paragraph\s*\}\}\s*style=\{\{\s*fontSize:[^}]+\}\}\s*className=[^>]+\/>/,
  `<p 
    style={{ fontSize: \`\${fontSize}px\`, lineHeight: '1.8' }}
    className={\`font-serif leading-loose \${isDarkMode ? 'text-slate-50' : 'text-slate-900'}\`}
  >
    <span className="font-bold text-slate-400 dark:text-slate-500 ml-2 select-none" style={{ fontSize: \`\${Math.max(12, fontSize - 6)}px\` }}>{numberToHebrew(idx + 1)}.</span>
    <span dangerouslySetInnerHTML={{ __html: paragraph }} />
  </p>`
);

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
console.log('Successfully replaced paragraph rendering');
