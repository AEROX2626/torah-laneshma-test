const fs = require('fs');
const filePath = 'app/components/HolidayBanner.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  'import holidayData from "../data/holiday.json";',
  'import holidayDataRaw from "../data/holiday.json";\nconst holidayData = holidayDataRaw as { active: boolean; hebrewName?: string; message?: string };'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed HolidayBanner.tsx type error');
