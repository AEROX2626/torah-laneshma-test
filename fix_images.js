const fs = require('fs');

let p = fs.readFileSync('app/page.tsx', 'utf8');
p = p.replace(/https:\/\/image\.pollinations\.ai\/prompt\/Western[^"']+/g, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Westernwall2.jpg/1280px-Westernwall2.jpg');
p = p.replace(/https:\/\/image\.pollinations\.ai\/prompt\/Jerusalem%20old%20city[^"']+/g, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Jerusalem_Alley_-_Old_City.jpg/1280px-Jerusalem_Alley_-_Old_City.jpg');
p = p.replace(/https:\/\/image\.pollinations\.ai\/prompt\/Sunrays[^"']+/g, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Judea_2_by_David_Shankbone.jpg/1280px-Judea_2_by_David_Shankbone.jpg');
p = p.replace(/https:\/\/image\.pollinations\.ai\/prompt\/Two%20people[^"']+/g, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Mahane_Yehuda_%28I%29_%2845298221191%29.jpg/1280px-Mahane_Yehuda_%28I%29_%2845298221191%29.jpg');
p = p.replace(/https:\/\/image\.pollinations\.ai\/prompt\/Beautiful%20Negev[^"']+/g, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/NahalHavarimNov212022_03.jpg/1280px-NahalHavarimNov212022_03.jpg');
p = p.replace(/https:\/\/image\.pollinations\.ai\/prompt\/Dead%20Sea[^"']+/g, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Dead_Sea_beach_00.JPG/1280px-Dead_Sea_beach_00.JPG');
p = p.replace(/https:\/\/image\.pollinations\.ai\/prompt\/Galilee[^"']+/g, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Kinneret_cropped.jpg/1280px-Kinneret_cropped.jpg');
p = p.replace(/https:\/\/image\.pollinations\.ai\/prompt\/Sunrise%20over[^"']+/g, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/%D7%9E%D7%92%D7%93%D7%9C_-%D7%93%D7%95%D7%93.jpg/1280px-%D7%9E%D7%92%D7%93%D7%9C_-%D7%93%D7%95%D7%93.jpg');
p = p.replace(/https:\/\/image\.pollinations\.ai\/prompt\/Jerusalem%20stone[^"']+/g, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Jerusalem_stone.jpg/1280px-Jerusalem_stone.jpg');
fs.writeFileSync('app/page.tsx', p);

let a = fs.readFileSync('app/adopt/page.tsx', 'utf8');
a = a.replace(/https:\/\/image\.pollinations\.ai\/prompt\/Jewish%20man[^"']+/g, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Men_praying_at_the_Western_Wall.jpg/1280px-Men_praying_at_the_Western_Wall.jpg');
a = a.replace(/https:\/\/image\.pollinations\.ai\/prompt\/Ancient%20Torah[^"']+/g, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Torah_scroll_case.jpg/1280px-Torah_scroll_case.jpg');
fs.writeFileSync('app/adopt/page.tsx', a);
