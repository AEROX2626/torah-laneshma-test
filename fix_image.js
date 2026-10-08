const fs = require('fs');

let data = JSON.parse(fs.readFileSync('app/articles/content.json', 'utf8'));

// Change image for ha-azinu (the newest one)
const article = data.find(a => a.slug === 'ha-azinu' || a.slug === 'haazinu');
if (article) {
  article.image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Masada_Sunrise_2.jpg/1280px-Masada_Sunrise_2.jpg';
}

fs.writeFileSync('app/articles/content.json', JSON.stringify(data, null, 2), 'utf8');

console.log('Fixed image');
