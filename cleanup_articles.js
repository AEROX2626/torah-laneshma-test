const fs = require('fs');
const contentPath = 'app/articles/content.json';
let articles = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

// Remove future parashiyot that were incorrectly seeded without dates
const toRemove = ['bereshit', 'noah', 'lech-lecha', 'vayera'];
articles = articles.filter(a => !toRemove.includes(a.slug));

fs.writeFileSync(contentPath, JSON.stringify(articles, null, 2), 'utf8');
console.log('Removed stale future parashiyot');
