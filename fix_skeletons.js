const fs = require('fs');

// 1. HebrewDate
let hebrewCode = fs.readFileSync('app/components/HebrewDate.tsx', 'utf8');
hebrewCode = hebrewCode.replace(
  'if (!dateStr) return null;',
  `if (!dateStr) return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary-100 text-primary-200 shadow-soft animate-pulse h-[38px] min-w-[120px]">
      <i className="fas fa-calendar-alt"></i>
      <div className="h-3 bg-primary-100 rounded w-16"></div>
    </div>
  );`
);
fs.writeFileSync('app/components/HebrewDate.tsx', hebrewCode, 'utf8');

// 2. ShabbatTimes
let shabbatCode = fs.readFileSync('app/components/ShabbatTimes.tsx', 'utf8');
shabbatCode = shabbatCode.replace(
  'if (!times) return null;',
  `if (!times) return (
    <div className="flex items-center justify-center gap-4 bg-white/95 backdrop-blur-sm shadow-soft border border-ink-100 rounded-full px-5 py-2.5 h-[42px] min-w-[280px] animate-pulse">
      <div className="h-3.5 bg-ink-100 rounded w-20"></div>
      <div className="w-px h-4 bg-ink-100"></div>
      <div className="h-3.5 bg-ink-100 rounded w-24"></div>
      <div className="w-px h-4 bg-ink-100"></div>
      <div className="h-3.5 bg-ink-100 rounded w-16"></div>
    </div>
  );`
);
fs.writeFileSync('app/components/ShabbatTimes.tsx', shabbatCode, 'utf8');

console.log('Added skeletons to prevent CLS');
