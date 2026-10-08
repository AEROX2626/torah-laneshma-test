const fs = require('fs');
const files = ['app/components/Footer.tsx', 'app/components/GlobalCTA.tsx'];
const msg = encodeURIComponent("שלום, אשמח לשמוע פרטים נוספים על החברותא בתורה לנשמה.");
const target = "https://wa.me/972585986685";
const replacement = target + "?text=" + msg;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.split(target).join(replacement);
  fs.writeFileSync(file, content, 'utf8');
}
console.log("Updated WhatsApp links with pre-filled message");
