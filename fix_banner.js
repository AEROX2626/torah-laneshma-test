const fs = require('fs');
let code = fs.readFileSync('app/components/HolidayBanner.tsx', 'utf8');

code = '"use client";\n\nimport { usePathname } from "next/navigation";\n' + code;

code = code.replace(
  '  if (!holidayData || !holidayData.active) return null;',
  '  const pathname = usePathname();\n  if (!holidayData || !holidayData.active || pathname === "/study") return null;'
);

fs.writeFileSync('app/components/HolidayBanner.tsx', code, 'utf8');
console.log('Fixed HolidayBanner');
