const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

// Add import
code = code.replace(
  'import PageEffects from "./components/PageEffects";',
  'import PageEffects from "./components/PageEffects";\nimport HeroCounters from "./components/HeroCounters";'
);

// Replace HTML
const regex = /<div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/;
code = code.replace(regex, '<HeroCounters />\n          </div>\n        </div>\n      </section>');

fs.writeFileSync('app/page.tsx', code, 'utf8');
console.log('Fixed hero counters');
