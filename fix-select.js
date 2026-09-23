const fs = require("fs");
let p = fs.readFileSync("app/page.tsx", "utf8");

// Change option values to Hebrew
p = p.replace('value="bitachon"', 'value="פילוסופיה של הנפש / חובת הלבבות"');
p = p.replace('value="parasha"', 'value="אקטואליה ופרשת השבוע"');
p = p.replace('value="talmud"', 'value="תלמוד או גמרא לעומק"');
p = p.replace('value="halacha"', 'value="הלכה ומושגי יסוד"');
p = p.replace('value="open"', 'value="תפתיעו אותי – אשמח להמלצה"');

p = p.replace('value="morning"', 'value="בוקר (8:00 - 12:00)"');
p = p.replace('value="afternoon"', 'value="צהריים (12:00 - 17:00)"');
p = p.replace('value="evening"', 'value="ערב (17:00 - 22:00)"');
p = p.replace('value="flexible"', 'value="גמיש – נתאם כבר בשיחה"');

// Ensure names are correct and mapped nicely for email titles.
p = p.replace('name="topic"', 'name="נושא_מועדף"');
p = p.replace('name="timing"', 'name="שעות_נוחות"');
p = p.replace('name="name"', 'name="שם_מלא"');
p = p.replace('name="phone"', 'name="טלפון"');

fs.writeFileSync("app/page.tsx", p, "utf8");
