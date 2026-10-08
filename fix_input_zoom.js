const fs = require('fs');
let code = fs.readFileSync('app/components/ShabbatTimes.tsx', 'utf8');

code = code.replace(
  'className="w-full bg-ink-50 border border-transparent focus:border-primary-300 focus:bg-white rounded-lg px-3 py-1.5 text-sm outline-none transition-all"',
  'className="w-full bg-ink-50 border border-transparent focus:border-primary-300 focus:bg-white rounded-lg px-3 py-1.5 text-[16px] md:text-sm outline-none transition-all"'
);

fs.writeFileSync('app/components/ShabbatTimes.tsx', code, 'utf8');
console.log('Fixed input font size');
