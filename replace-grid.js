const fs = require('fs');

let p = fs.readFileSync('app/page.tsx', 'utf8');

if (!p.includes('import { articles } from "./articles/data";')) {
  p = p.replace('"use client";\nimport Link from "next/link";\n', '"use client";\nimport Link from "next/link";\nimport { articles } from "./articles/data";\n');
}

const gridStartStr = '<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">';
const gridStartIdx = p.indexOf(gridStartStr);

if (gridStartIdx !== -1) {
  // Find the closing div of this grid
  let divCount = 0;
  let closingIdx = -1;
  let i = gridStartIdx;
  
  while (i < p.length) {
    if (p.substring(i, i+4) === '<div') {
      divCount++;
      i += 4;
    } else if (p.substring(i, i+6) === '</div') {
      divCount--;
      if (divCount === 0) {
        closingIdx = i + 6;
        break;
      }
      i += 6;
    } else {
      i++;
    }
  }

  if (closingIdx !== -1) {
    const before = p.substring(0, gridStartIdx);
    const after = p.substring(closingIdx + 1); // +1 for the >

    const replacement = `<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {articles.map((article, index) => (
              <Link key={article.slug} href={\`/articles/\${article.slug}\`} className="group bg-white rounded-3xl overflow-hidden border border-ink-100 hover:border-primary-200 card-hover flex flex-col h-full reveal" style={{ transitionDelay: \`\${(index % 3) * 0.1}s\` }}>
                <div className="h-52 overflow-hidden relative">
                  <img src={article.image} className="w-full h-full img-cover transform group-hover:scale-110 transition duration-[1.2s] ease-out" alt={article.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-extrabold text-primary-700 shadow-sm border border-primary-100">{article.category}</div>
                </div>
                <div className="p-7 flex-grow flex flex-col">
                  <h3 className="font-heading text-xl font-extrabold text-ink-900 mb-3 group-hover:text-primary-600 transition-colors leading-snug">{article.title}</h3>
                  <p className="text-ink-600 text-sm line-clamp-3 mb-6 leading-relaxed font-medium">{article.excerpt}</p>
                  <div className="mt-auto flex items-center gap-2 text-sm text-primary-600 font-bold group-hover:gap-3 transition-all">
                    <span>המשך לקרוא</span>
                    <i className="fas fa-arrow-left mt-0.5 text-xs"></i>
                  </div>
                </div>
              </Link>
            ))}
          </div>`;

    p = before + replacement + after;
    fs.writeFileSync('app/page.tsx', p, 'utf8');
    console.log("Replaced successfully!");
  } else {
    console.log("Could not find closing div.");
  }
} else {
  console.log("Could not find grid start.");
}
