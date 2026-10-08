fetch(`https://www.hebcal.com/shabbat?cfg=json&geonameid=293308&lg=he&gy=2026&gm=10&gd=10`)
  .then(r => r.json())
  .then(data => {
    const candles = data.items.find((i) => i.category === 'candles');
    const havdalah = data.items.find((i) => i.category === 'havdalah' && (!candles || new Date(i.date) > new Date(candles.date)));
    console.log('Oct 10 outTime:', havdalah.title.match(/\d{1,2}:\d{2}/)?.[0]);
  });
