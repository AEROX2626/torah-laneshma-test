const fs = require('fs');
const contentPath = 'app/articles/content.json';
let articles = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

const bereshit = articles.find(a => a.slug === 'bereshit');
if (bereshit) {
  bereshit.image = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1280&q=80'; // Beautiful space/creation image
}

fs.writeFileSync(contentPath, JSON.stringify(articles, null, 2), 'utf8');
console.log('Fixed Bereshit image to Unsplash');
