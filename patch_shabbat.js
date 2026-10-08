const fs = require('fs');

const filePath = 'app/components/ShabbatTimes.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

const targetLine = "fetch(`https://www.hebcal.com/shabbat?cfg=json&${query}&lg=he&gy=${gy}&gm=${gm}&gd=${gd}`)";

const replacement = `
    let customB = "";
    if (/(ירושלים|פתח תקווה|בית שמש|מבשרת|מעלה אדומים|ביתר עילית)/.test(cityName)) {
      customB = "&b=40";
    } else if (/(חיפה|טירת כרמל|נשר|קריות|קרית אתא|קרית ביאליק|קרית מוצקין|קרית ים|צפת|זכרון יעקב)/.test(cityName)) {
      customB = "&b=30";
    } else if (query.includes('latitude=')) {
      customB = "&b=20";
    }

    fetch(\`https://www.hebcal.com/shabbat?cfg=json&\${query}&lg=he&gy=\${gy}&gm=\${gm}&gd=\${gd}\${customB}\`)
`;

content = content.replace(targetLine, replacement.trim());
fs.writeFileSync(filePath, content, 'utf-8');
console.log('Patched ShabbatTimes.tsx');
