const fs = require('fs');
let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

const targetStr = '<p \r\n                            dangerouslySetInnerHTML={{ __html: paragraph }} \r\n                            style={{ fontSize: `${fontSize}px`, lineHeight: \'1.8\' }}\r\n                            className={`font-serif leading-loose ${isDarkMode ? \'text-slate-50\' : \'text-slate-900\'}`}\r\n                          />';
const targetStr2 = '<p \n                            dangerouslySetInnerHTML={{ __html: paragraph }} \n                            style={{ fontSize: `${fontSize}px`, lineHeight: \'1.8\' }}\n                            className={`font-serif leading-loose ${isDarkMode ? \'text-slate-50\' : \'text-slate-900\'}`}\n                          />';

const replaceStr = `<p 
                            style={{ fontSize: \`\${fontSize}px\`, lineHeight: '1.8' }}
                            className={\`font-serif leading-loose \${isDarkMode ? 'text-slate-50' : 'text-slate-900'}\`}
                          >
                            <span className="font-bold text-slate-400 dark:text-slate-500 ml-2 select-none" style={{ fontSize: \`\${Math.max(12, fontSize - 6)}px\` }}>{numberToHebrew(idx + 1)}.</span>
                            <span dangerouslySetInnerHTML={{ __html: paragraph }} />
                          </p>`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replaceStr);
  console.log("Replaced targetStr (CRLF)");
} else if (code.includes(targetStr2)) {
  code = code.replace(targetStr2, replaceStr);
  console.log("Replaced targetStr2 (LF)");
} else {
  console.log("COULD NOT FIND STRING TO REPLACE!");
}

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
