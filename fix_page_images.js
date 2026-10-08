const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

if (!code.includes('import Image from "next/image"')) {
  code = code.replace('import Link from "next/link";', 'import Link from "next/link";\nimport Image from "next/image";');
}

// Hero Image
code = code.replace(
  '<img\n                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Westernwall2.jpg/1280px-Westernwall2.jpg"\n                  alt="הכותל המערבי – ירושלים"\n                  className="rounded-[2.5rem] shadow-elevated img-cover h-[420px] md:h-[560px] w-full border border-white"\n                />',
  '<div className="relative w-full h-[420px] md:h-[560px] rounded-[2.5rem] shadow-elevated border border-white overflow-hidden">\n                  <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Westernwall2.jpg/1280px-Westernwall2.jpg" alt="הכותל המערבי – ירושלים" fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />\n                </div>'
);

// About section image
code = code.replace(
  '<img\n                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Talmud-Druck_von_Daniel_Bomberg_und_Ambrosius_Froben.jpg/1280px-Talmud-Druck_von_Daniel_Bomberg_und_Ambrosius_Froben.jpg"\n                  alt="דף גמרא"\n                  className="rounded-3xl shadow-xl img-cover w-full h-full border border-ink-100"\n                />',
  '<div className="relative w-full h-[400px] md:h-full rounded-3xl overflow-hidden shadow-xl border border-ink-100">\n                  <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Talmud-Druck_von_Daniel_Bomberg_und_Ambrosius_Froben.jpg/1280px-Talmud-Druck_von_Daniel_Bomberg_und_Ambrosius_Froben.jpg" alt="דף גמרא" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />\n                </div>'
);

// Articles section image
code = code.replace(
  '<img src={article.image} className="w-full h-full img-cover transform group-hover:scale-110 transition duration-[1.2s] ease-out" alt={article.title} />',
  '<Image src={article.image} alt={article.title} fill className="object-cover transform group-hover:scale-110 transition duration-[1.2s] ease-out" sizes="(max-width: 768px) 100vw, 33vw" />'
);

fs.writeFileSync('app/page.tsx', code, 'utf8');
console.log('Fixed page images');
