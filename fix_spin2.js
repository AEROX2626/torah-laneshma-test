const fs = require('fs');
let code = fs.readFileSync('app/components/ShabbatTimes.tsx', 'utf8');

code = code.replace(
  "${isLoading ? 'animate-spin' : ''}",
  "${isLoading ? 'fa-spin' : ''}"
);

fs.writeFileSync('app/components/ShabbatTimes.tsx', code, 'utf8');
console.log('Replaced literally');
