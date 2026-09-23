const fs = require("fs");
let p = fs.readFileSync("app/page.tsx", "utf8");

p = p.replace('name="name"', 'name="שם_מלא"');
p = p.replace('name="phone"', 'name="טלפון"');
p = p.replace('name="topic"', 'name="נושא_מועדף"');
// Note: textarea did not have a name attribute
p = p.replace('id="notes" rows={3}', 'id="notes" name="הערות" rows={3}');

p = p.replace('value="bitachon"', 'value="פילוסופיה של הנפש / חובת הלבבות"');
p = p.replace('value="parasha"', 'value="אקטואליה ופרשת השבוע"');
p = p.replace('value="talmud"', 'value="תלמוד או גמרא לעומק"');
p = p.replace('value="halacha"', 'value="הלכה ומושגי יסוד"');
p = p.replace('value="open"', 'value="תפתיעו אותי – אשמח להמלצה"');

fs.writeFileSync("app/page.tsx", p, "utf8");
console.log("Replacements applied successfully!");
