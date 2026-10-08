const url1 = 'https://www.hebcal.com/shabbat?cfg=json&geonameid=293308&lg=he&gy=2026&gm=10&gd=3';
const url2 = 'https://www.hebcal.com/shabbat?cfg=json&geonameid=293308&lg=he&gy=2026&gm=10&gd=3&b=29';
Promise.all([fetch(url1).then(r=>r.json()), fetch(url2).then(r=>r.json())]).then(([d1, d2]) => {
  const h1 = d1.items.find(i=>i.category==='havdalah');
  const h2 = d2.items.find(i=>i.category==='havdalah');
  console.log('Without b:', h1);
  console.log('With b=29:', h2);
});
