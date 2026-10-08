const fs = require('fs');

let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

// 1. Add jump states
code = code.replace(
  'const searchTimeout = useRef<NodeJS.Timeout | null>(null);',
  `const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const [showJump, setShowJump] = useState(false);
  const [jumpInput, setJumpInput] = useState('');`
);

// 2. Add handleJumpSubmit
code = code.replace(
  'const handleSearch = (e: React.FormEvent) => {',
  `const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jumpInput.trim() && data) {
      // For complex texts, append to book title, for simple texts it just works
      const baseTitle = data.indexTitle || data.book || '';
      if (baseTitle) {
        fetchText(\`\${baseTitle} \${jumpInput.trim()}\`);
      }
      setShowJump(false);
      setJumpInput('');
    }
  };

  const handleSearch = (e: React.FormEvent) => {`
);

// 3. Update footer
const oldFooter = `<span className="text-slate-400 font-serif text-sm hidden md:block">
                  {data.heRef}
                </span>`;
const newFooter = `<div className="relative flex items-center justify-center">
                  <button 
                    onClick={() => setShowJump(!showJump)} 
                    className="text-slate-500 hover:text-blue-600 transition-colors font-serif font-bold text-sm md:text-base px-3 py-1.5 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 border border-transparent hover:border-blue-100"
                    title="נווט לחלק אחר בספר"
                  >
                    {data.heRef} <i className="fas fa-caret-up text-xs"></i>
                  </button>
                  
                  {showJump && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-4 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 w-64 md:w-72 flex flex-col gap-3 animate-fade-in">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-bold text-slate-700">קפיצה מהירה</p>
                        <button onClick={() => setShowJump(false)} className="text-slate-400 hover:text-slate-600"><i className="fas fa-times"></i></button>
                      </div>
                      <form onSubmit={handleJumpSubmit} className="flex gap-2">
                        <button type="submit" className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
                          עבור
                        </button>
                        <input 
                          type="text" 
                          value={jumpInput} 
                          onChange={e=>setJumpInput(e.target.value)} 
                          placeholder={data.sectionNames?.[0] === 'Daf' ? "לדוגמה: 5 או 2b" : "מספר פרק"} 
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center text-[15px] font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                          dir="ltr" 
                          autoFocus 
                        />
                      </form>
                      <p className="text-[11px] text-slate-400 text-center mt-1">
                        הכנס מספר פרק או דף כדי לקפוץ אליו ישירות
                      </p>
                    </div>
                  )}
                </div>`;

code = code.replace(oldFooter, newFooter);

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
