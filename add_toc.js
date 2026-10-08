const fs = require('fs');
let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

// 1. Add states
code = code.replace(
  'const [jumpInput, setJumpInput] = useState(\'\');',
  `const [jumpInput, setJumpInput] = useState('');
  const [currentToc, setCurrentToc] = useState<any>(null);
  const [bookTocData, setBookTocData] = useState<any>(null);
  const [showTocModal, setShowTocModal] = useState(false);`
);

// 2. Clear states on fetch
code = code.replace(
  'setSidebarOpen(false); // Close sidebar on mobile after selecting',
  `setSidebarOpen(false); // Close sidebar on mobile after selecting
    setShowSuggestions(false);
    setBookTocData(null);`
);

// 3. Handle complex text error and fetch TOC
code = code.replace(
  `        if (result.error.includes("complex' book-level ref")) {
          setError("הספר שבחרת מחולק לשערים או חלקים. אנא חפש שוב ובחר חלק ספציפי מתוך הרשימה (למשל: 'חובות הלבבות, שער ראשון').");
        } else {
          setError("שגיאה בטעינת הטקסט: " + result.error);
        }`,
  `        if (result.error.includes("complex' book-level ref")) {
          // Instead of error, fetch TOC and show it
          try {
            const idxRes = await fetch(\`https://www.sefaria.org/api/index/\${encodeURIComponent(ref)}\`);
            const idxData = await idxRes.json();
            if (idxData.schema) {
              setBookTocData({ title: ref, schema: idxData.schema });
              setError('');
              setData(null);
              return;
            }
          } catch(e) {}
          setError("הספר שבחרת מחולק לשערים או חלקים. אנא חפש שוב ובחר חלק ספציפי מתוך הרשימה (למשל: 'חובות הלבבות, שער ראשון').");
        } else {
          setError("שגיאה בטעינת הטקסט: " + result.error);
        }`
);

// 4. Fetch current TOC for normal text
code = code.replace(
  `localStorage.setItem('sefaria_last_read', result.ref);`,
  `localStorage.setItem('sefaria_last_read', result.ref);
        const baseBook = result.indexTitle || result.book;
        if (baseBook) {
          fetch(\`https://www.sefaria.org/api/index/\${encodeURIComponent(baseBook)}\`)
            .then(r => r.json())
            .then(d => { if (d.schema) setCurrentToc(d.schema); })
            .catch(()=>console.log('No TOC found'));
        }`
);

// 5. Render Book TOC instead of error if bookTocData is set
// Find the error rendering block: `) : error ? (`
// Replace it to handle bookTocData
code = code.replace(
  `) : error ? (
            <div className="absolute inset-0 flex flex-col justify-center items-center text-red-500 p-8 text-center">`,
  `) : bookTocData ? (
            <div className="absolute inset-0 flex flex-col p-6 md:p-12 overflow-y-auto custom-scrollbar bg-[#f8f5f0]">
               <div className="max-w-3xl mx-auto w-full">
                 <h2 className="text-3xl font-bold text-slate-800 font-serif mb-2 text-center">{bookTocData.schema.heTitle || bookTocData.title}</h2>
                 <p className="text-slate-500 text-center mb-8">בחר פרק או שער כדי להתחיל לקרוא</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   {bookTocData.schema.nodes ? (
                     bookTocData.schema.nodes.map((node: any, idx: number) => (
                       <button key={idx} onClick={() => fetchText(bookTocData.schema.title + ', ' + node.title)} className="p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-right group">
                         <span className="font-bold text-slate-800 group-hover:text-blue-700">{node.heTitle || node.title}</span>
                       </button>
                     ))
                   ) : bookTocData.schema.nodeType === 'JaggedArrayNode' ? (
                     Array.from({length: bookTocData.schema.lengths[0]}).map((_, idx) => (
                       <button key={idx} onClick={() => fetchText(bookTocData.schema.title + ' ' + (idx + 1))} className="p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all text-center group font-bold text-slate-700 hover:text-blue-700">
                         {bookTocData.schema.heSectionNames?.[0] || 'פרק'} {idx + 1}
                       </button>
                     ))
                   ) : (
                     <p className="text-slate-500 text-center col-span-2">מבנה הספר מורכב מדי לתצוגה זו.</p>
                   )}
                 </div>
               </div>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col justify-center items-center text-red-500 p-8 text-center">`
);

// 6. Update the Quick Jump button to open TOC modal!
// Find the button in the footer
code = code.replace(
  `onClick={() => setShowJump(!showJump)} 
                    className="text-slate-500 hover:text-blue-600 transition-colors font-serif font-bold text-sm md:text-base px-3 py-1.5 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 border border-transparent hover:border-blue-100"
                    title="נווט לחלק אחר בספר"
                  >
                    {data.heRef} <i className="fas fa-caret-up text-xs"></i>
                  </button>`,
  `onClick={() => { if(currentToc) { setShowTocModal(true); setShowJump(false); } else { setShowJump(!showJump); } }} 
                    className="text-slate-500 hover:text-blue-600 transition-colors font-serif font-bold text-sm md:text-base px-3 py-1.5 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 border border-transparent hover:border-blue-100"
                    title="פתח תוכן עניינים"
                  >
                    {data.heRef} <i className="fas fa-list text-xs"></i>
                  </button>`
);

// 7. Add TOC Modal at the very end of the component
code = code.replace(
  '    </div>\n  );\n}',
  `
      {/* TOC MODAL */}
      {showTocModal && currentToc && data && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowTocModal(false)}></div>
          <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl relative z-10 flex flex-col animate-fade-in">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <h3 className="font-bold text-xl text-slate-800 font-serif">{currentToc.heTitle || data.heIndexTitle || data.indexTitle}</h3>
              <button onClick={() => setShowTocModal(false)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-500 hover:text-slate-800 hover:shadow-sm transition-all"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {currentToc.nodes ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentToc.nodes.map((node: any, idx: number) => (
                    <button key={idx} onClick={() => { fetchText((data.indexTitle || '') + ', ' + node.title); setShowTocModal(false); }} className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-right font-semibold text-slate-700 hover:text-blue-700">
                      {node.heTitle || node.title}
                    </button>
                  ))}
                </div>
              ) : currentToc.nodeType === 'JaggedArrayNode' ? (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 dir-rtl">
                  {Array.from({length: currentToc.lengths[0]}).map((_, idx) => (
                    <button key={idx} onClick={() => { fetchText((data.indexTitle || '') + ' ' + (idx + 1)); setShowTocModal(false); }} className="p-2 bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm transition-all text-center font-bold text-slate-700 hover:text-blue-700">
                      {idx + 1}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-500 py-10">לא נמצא תוכן עניינים זמין.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`
);

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
console.log('Added smart TOC');
