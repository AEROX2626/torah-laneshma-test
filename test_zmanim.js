const { KosherZmanim, GeoLocation, ComplexZmanimCalendar } = require('kosher-zmanim');
const date = new Date('2026-10-09');
const geo = new GeoLocation("Haifa", 32.8191, 34.9983, 200, "Asia/Jerusalem");
const calendar = new ComplexZmanimCalendar(geo);
calendar.setDate(date);

console.log('Candle Lighting:', calendar.getCandleLighting().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }));
console.log('Sunset:', calendar.getSunset().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }));
console.log('Havdalah (3 stars):', calendar.getTzais().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }));
