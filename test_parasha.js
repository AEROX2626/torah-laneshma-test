async function run() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  const url = `https://www.hebcal.com/shabbat?cfg=json&geonameid=293397&b=18&m=50&date=${dateStr}`;
  const res = await fetch(url);
  const data = await res.json();
  const parashaEvent = data.items.find(i => i.category === 'parashat');
  console.log(parashaEvent);
}
run();
