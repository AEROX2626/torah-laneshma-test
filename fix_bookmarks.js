const fs = require('fs');
let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

// 1. Change the button to toggle and ALWAYS show (not just md:flex)
code = code.replace(
  '<button onClick={() => setSidebarOpen(true)} className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full font-medium text-slate-700 transition-colors">',
  '<button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full font-medium text-slate-700 transition-colors">'
);

// 2. Fix the sidebar classes so it hides/shows on desktop too
code = code.replace(
  "${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0 hidden md:flex'}",
  "${sidebarOpen ? 'translate-x-0 flex' : 'translate-x-full hidden'}"
);

// 3. Make sure the overlay only applies on mobile
// (Wait, the overlay already has `md:hidden`, so it's fine)

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
console.log('Fixed bookmarks button');
