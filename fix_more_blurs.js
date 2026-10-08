const fs = require('fs');

// GlobalCTA.tsx
let code = fs.readFileSync('app/components/GlobalCTA.tsx', 'utf8');
code = code.replace(
  'bg-primary-200/20 rounded-full blur-3xl',
  'bg-[radial-gradient(circle,_#bfdbfe44_0%,_transparent_70%)] opacity-30'
);
code = code.replace(
  'bg-emerald-200/20 rounded-full blur-3xl',
  'bg-[radial-gradient(circle,_#a7f3d044_0%,_transparent_70%)] opacity-30'
);
fs.writeFileSync('app/components/GlobalCTA.tsx', code, 'utf8');

// adopt/page.tsx
let code2 = fs.readFileSync('app/adopt/page.tsx', 'utf8');
code2 = code2.replace(
  'bg-accent-500/20 rounded-full blur-3xl',
  'bg-[radial-gradient(circle,_#f59e0b44_0%,_transparent_70%)] opacity-30'
);
fs.writeFileSync('app/adopt/page.tsx', code2, 'utf8');

console.log('Fixed remaining blurs');
