const fs = require('fs');
let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

const hebrewNumberLogic = `
function numberToHebrew(num: number) {
  if (num <= 0) return '';
  const letters: [number, string][] = [
    [400, 'ת'], [300, 'ש'], [200, 'ר'], [100, 'ק'],
    [90, 'צ'], [80, 'פ'], [70, 'ע'], [60, 'ס'], [50, 'נ'], [40, 'מ'], [30, 'ל'], [20, 'כ'],
    [10, 'י'], [9, 'ט'], [8, 'ח'], [7, 'ז'], [6, 'ו'], [5, 'ה'], [4, 'ד'], [3, 'ג'], [2, 'ב'], [1, 'א']
  ];
  let res = '';
  for (const [val, letter] of letters) {
    while (num >= val) {
      if (num === 15) { res += 'טו'; num = 0; break; }
      if (num === 16) { res += 'טז'; num = 0; break; }
      res += letter;
      num -= val;
    }
  }
  return res;
}
`;

code = code.replace(
  'interface Bookmark {',
  hebrewNumberLogic + '\ninterface Bookmark {'
);

const oldParagraphRender = `
                          <p 
                            dangerouslySetInnerHTML={{ __html: paragraph }} 
                            style={{ fontSize: \`\${fontSize}px\`, lineHeight: '1.8' }}
                            className={\`font-serif leading-loose \${isDarkMode ? 'text-slate-50' : 'text-slate-900'}\`}
                          />`;

const newParagraphRender = `
                          <p 
                            style={{ fontSize: \`\${fontSize}px\`, lineHeight: '1.8' }}
                            className={\`font-serif leading-loose \${isDarkMode ? 'text-slate-50' : 'text-slate-900'}\`}
                          >
                            <span className="font-bold text-slate-400 dark:text-slate-500 ml-2 select-none" style={{ fontSize: \`\${Math.max(12, fontSize - 6)}px\` }}>{numberToHebrew(idx + 1)}.</span>
                            <span dangerouslySetInnerHTML={{ __html: paragraph }} />
                          </p>`;

code = code.replace(oldParagraphRender, newParagraphRender);

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
console.log('Added Hebrew paragraph numbers');
