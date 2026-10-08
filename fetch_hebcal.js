const https = require('https');
https.get('https://www.hebcal.com/complete?q=' + encodeURIComponent('מודיעין'), (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { console.log(data); });
});
