fetch(`https://www.hebcal.com/shabbat?cfg=json&geonameid=294801&lg=he&gy=2026&gm=10&gd=3`)
  .then(r => r.json())
  .then(data => {
    const candles = data.items.find((i) => i.category === 'candles');
    const havdalah = data.items.find((i) => i.category === 'havdalah' && (!candles || new Date(i.date) > new Date(candles.date)));
    console.log('Haifa outTime:', havdalah.title.match(/\d{1,2}:\d{2}/)?.[0]);
  });
