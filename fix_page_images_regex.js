const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

// Replace using regex for Hero Image
code = code.replace(
  /<img\s*src="https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/thumb\/1\/17\/Westernwall2\.jpg\/1280px-Westernwall2\.jpg"[\s\S]*?\/>/,
  '<div className="relative w-full h-[420px] md:h-[560px] rounded-[2.5rem] shadow-elevated border border-white overflow-hidden"><Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Westernwall2.jpg/1280px-Westernwall2.jpg" alt="הכותל המערבי – ירושלים" fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" /></div>'
);

// Replace About section image
code = code.replace(
  /<img\s*src="https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/thumb\/c\/ca\/Talmud-Druck_von_Daniel_Bomberg_und_Ambrosius_Froben\.jpg\/1280px-Talmud-Druck_von_Daniel_Bomberg_und_Ambrosius_Froben\.jpg"[\s\S]*?\/>/,
  '<div className="relative w-full h-[400px] md:h-full rounded-3xl overflow-hidden shadow-xl border border-ink-100"><Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Talmud-Druck_von_Daniel_Bomberg_und_Ambrosius_Froben.jpg/1280px-Talmud-Druck_von_Daniel_Bomberg_und_Ambrosius_Froben.jpg" alt="דף גמרא" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" /></div>'
);

fs.writeFileSync('app/page.tsx', code, 'utf8');
