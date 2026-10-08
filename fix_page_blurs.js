const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

// The three feature icon background blurs
code = code.replace(
  'className="absolute inset-0 bg-primary-100 rounded-full blur-2xl opacity-60"',
  'className="absolute inset-0 bg-[radial-gradient(circle,_#dbeafe_0%,_transparent_70%)] opacity-80"'
);
code = code.replace(
  'className="absolute inset-0 bg-accent-100 rounded-full blur-2xl opacity-60"',
  'className="absolute inset-0 bg-[radial-gradient(circle,_#ffedd5_0%,_transparent_70%)] opacity-80"'
);
code = code.replace(
  'className="absolute inset-0 bg-emerald-100 rounded-full blur-2xl opacity-60"',
  'className="absolute inset-0 bg-[radial-gradient(circle,_#d1fae5_0%,_transparent_70%)] opacity-80"'
);

// The large background blobs
code = code.replace(
  'className="absolute top-1/3 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-[120px]"',
  'className="absolute top-1/3 left-0 w-96 h-96 bg-[radial-gradient(circle,_rgba(59,130,246,0.15)_0%,_transparent_70%)]"'
);
code = code.replace(
  'className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px]"',
  'className="absolute bottom-0 right-0 w-96 h-96 bg-[radial-gradient(circle,_rgba(245,158,11,0.1)_0%,_transparent_70%)]"'
);

// Form section blob
code = code.replace(
  'className="absolute -left-24 -top-24 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl"',
  'className="absolute -left-24 -top-24 w-64 h-64 bg-[radial-gradient(circle,_rgba(245,158,11,0.1)_0%,_transparent_70%)]"'
);

fs.writeFileSync('app/page.tsx', code, 'utf8');
console.log('Fixed giant performance-killing blur shapes');
