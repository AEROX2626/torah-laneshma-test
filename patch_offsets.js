const fs = require('fs');
const filePath = 'app/components/ShabbatTimes.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace the offset values by subtracting 1
content = content.replace('customB = "&b=40";', 'customB = "&b=39"; // 40 mins - 1 min for elevation compensation to match Israeli Rabbinate');
content = content.replace('customB = "&b=30";', 'customB = "&b=29"; // 30 mins - 1 min for elevation compensation');
content = content.replace('customB = "&b=20";', 'customB = "&b=21"; // Standard 22 mins - 1 min for elevation compensation');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Offsets adjusted for elevation');
