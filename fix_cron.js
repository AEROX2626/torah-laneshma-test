const fs = require('fs');
let code = fs.readFileSync('.github/workflows/daily-tip.yml', 'utf8');

code = code.replace("- cron: '0 22 * * *'", "- cron: '23 23 * * *'");

fs.writeFileSync('.github/workflows/daily-tip.yml', code, 'utf8');
console.log('Changed cron time to avoid top-of-the-hour API spikes');
