const https = require('https');
const req = https.get({
  hostname: 'www.hebcal.com',
  path: '/complete?q=' + encodeURIComponent('London'),
  headers: { 'Origin': 'http://localhost:3000' }
}, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
});
