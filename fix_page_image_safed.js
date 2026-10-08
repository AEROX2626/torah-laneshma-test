const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

code = code.replace(
  /<img\s*src="https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/thumb\/a\/ac\/Safed1\.jpg\/1280px-Safed1\.jpg"[\s\S]*?\/>/,
  '<div className="relative w-full h-[440px] md:h-[520px] rounded-[2rem] shadow-2xl border border-ink-800 overflow-hidden"><Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Safed1.jpg/1280px-Safed1.jpg" alt="סמטאות ירושלים – מרחב בטוח ופתוח" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" loading="lazy" /></div>'
);

fs.writeFileSync('app/page.tsx', code, 'utf8');
