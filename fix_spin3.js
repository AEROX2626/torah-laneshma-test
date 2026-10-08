const fs = require('fs');
let code = fs.readFileSync('app/components/ShabbatTimes.tsx', 'utf8');

code = code.replace(
  '<i className="fas fa-star-of-david text-primary-500 text-[15px]"></i>',
  '<i className={`fas fa-star-of-david text-primary-500 text-[15px] ${isLoading ? "fa-spin" : ""}`}></i>'
);

code = code.replace(
  '<div className="flex items-center gap-2 text-ink-700">',
  '<div className={`flex items-center gap-2 text-ink-700 transition-opacity duration-300 ${isLoading ? "opacity-30" : "opacity-100"}`}>'
);

fs.writeFileSync('app/components/ShabbatTimes.tsx', code, 'utf8');
console.log('Fixed literally');
