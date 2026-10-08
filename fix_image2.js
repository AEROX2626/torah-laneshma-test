const fs = require('fs');

let data = JSON.parse(fs.readFileSync('app/articles/content.json', 'utf8'));

const article = data.find(a => a.slug === 'ha-azinu' || a.slug === 'haazinu');
if (article) {
  article.image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/NahalHavarimNov212022_03.jpg/1280px-NahalHavarimNov212022_03.jpg';
}

fs.writeFileSync('app/articles/content.json', JSON.stringify(data, null, 2), 'utf8');
