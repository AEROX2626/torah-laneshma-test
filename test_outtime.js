const query = 'geonameid=293308';
const customB = '&b=29';
fetch(`https://www.hebcal.com/shabbat?cfg=json&${query}&lg=he&gy=2026&gm=10&gd=3${customB}`)
  .then(r => r.json())
  .then(data => {
    const candles = data.items.find((i) => i.category === 'candles');
    const havdalah = data.items.find((i) => i.category === 'havdalah' && (!candles || new Date(i.date) > new Date(candles.date)));
    console.log('outTime:', havdalah.title.match(/\d{1,2}:\d{2}/)?.[0]);
  });
