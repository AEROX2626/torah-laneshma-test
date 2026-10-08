const fs = require('fs');

let data = JSON.parse(fs.readFileSync('app/articles/content.json', 'utf8'));

const article = data.find(a => a.slug === 'ha-azinu' || a.slug === 'haazinu');
if (article) {
  article.image = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1280&q=80';
}

fs.writeFileSync('app/articles/content.json', JSON.stringify(data, null, 2), 'utf8');
