const fs = require('fs');
let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

code = code.replace(
  '${isDarkMode ? \'bg-slate-800 focus:bg-slate-900 text-slate-200 placeholder-slate-400\' : \'bg-slate-100 focus:bg-white text-slate-900\'}',
  '${isDarkMode ? \'bg-slate-800 focus:bg-slate-900 text-slate-100 placeholder:text-slate-400\' : \'bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-500\'}'
);

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
console.log('Fixed search bar placeholder and text color');
