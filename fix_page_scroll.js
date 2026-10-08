const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

code = code.replace(
  '  const [scrollProgress, setScrollProgress] = useState(0);',
  ''
);

code = code.replace(
  '      setScrollProgress((scrollTop / docHeight) * 100);',
  '      const el = document.getElementById("scroll-progress");\n      if (el) el.style.width = `${(scrollTop / docHeight) * 100}%`;'
);

code = code.replace(
  '      <div id="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>',
  '      <div id="scroll-progress" style={{ width: `0%` }}></div>'
);

fs.writeFileSync('app/page.tsx', code, 'utf8');
console.log('Optimized scroll handler');
