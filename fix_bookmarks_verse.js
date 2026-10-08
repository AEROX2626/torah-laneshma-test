const fs = require('fs');
let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

// 1. Add verseIdx to Bookmark interface
code = code.replace(
  'interface Bookmark {\n  ref: string;\n  heRef: string;\n  timestamp: number;\n}',
  'interface Bookmark {\n  ref: string;\n  heRef: string;\n  timestamp: number;\n  verseIdx?: number;\n}'
);

// 2. Add pendingScrollVerse state
code = code.replace(
  'const [bookTocData, setBookTocData] = useState<any>(null);',
  'const [bookTocData, setBookTocData] = useState<any>(null);\n  const [pendingScrollVerse, setPendingScrollVerse] = useState<number | null>(null);'
);

// 3. Add handleBookmarkClick and useEffect for scrolling
const scrollEffect = `
  useEffect(() => {
    if (data && pendingScrollVerse !== null) {
      setTimeout(() => {
        const el = document.getElementById(\`verse-\${pendingScrollVerse}\`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('bg-amber-100/50', 'dark:bg-amber-900/30', 'rounded-xl', 'transition-colors', 'duration-1000');
          setTimeout(() => el.classList.remove('bg-amber-100/50', 'dark:bg-amber-900/30'), 2500);
        }
        setPendingScrollVerse(null);
      }, 300);
    }
  }, [data, pendingScrollVerse]);

  const handleBookmarkClick = (b: Bookmark) => {
    setSidebarOpen(false);
    if (b.verseIdx !== undefined) {
      setPendingScrollVerse(b.verseIdx);
    } else {
      setPendingScrollVerse(null);
    }
    fetchText(b.ref);
  };

  const toggleVerseBookmark = (idx: number) => {
    if (!data) return;
    const isBookmarked = bookmarks.some(b => b.ref === data.ref && b.verseIdx === idx);
    if (isBookmarked) {
      saveBookmarks(bookmarks.filter(b => !(b.ref === data.ref && b.verseIdx === idx)));
    } else {
      const newBookmark: Bookmark = {
        ref: data.ref,
        heRef: data.heRef,
        timestamp: Date.now(),
        verseIdx: idx
      };
      saveBookmarks([newBookmark, ...bookmarks]);
    }
  };
`;
code = code.replace(
  'const addBookmark = () => {',
  scrollEffect + '\n  const addBookmark = () => {'
);

// 4. Update paragraph rendering to include the inline bookmark button
const oldParagraph = `<div key={idx} className="group">`;
const newParagraph = `<div key={idx} id={\`verse-\${idx}\`} className="group relative pr-8 md:pr-12">
                          <button 
                            onClick={() => toggleVerseBookmark(idx)}
                            className={\`absolute right-0 md:-right-2 top-2 p-1.5 rounded-lg transition-all \${bookmarks.some(b => b.ref === data.ref && b.verseIdx === idx) ? 'opacity-100 text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'opacity-0 group-hover:opacity-100 text-slate-300 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'}\`}
                            title="שמור סימניה לפסוק זה"
                          >
                            <i className={\`\${bookmarks.some(b => b.ref === data.ref && b.verseIdx === idx) ? 'fas' : 'far'} fa-bookmark\`}></i>
                          </button>`;
code = code.replace(oldParagraph, newParagraph);

// 5. Update the sidebar to call handleBookmarkClick and show the verse index
const oldSidebarLi = `<li key={b.ref} className="group flex justify-between items-center p-3 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all cursor-pointer" onClick={() => fetchText(b.ref)}>`;
const newSidebarLi = `<li key={b.ref + (b.verseIdx !== undefined ? '-' + b.verseIdx : '')} className="group flex justify-between items-center p-3 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all cursor-pointer" onClick={() => handleBookmarkClick(b)}>`;
code = code.replace(oldSidebarLi, newSidebarLi);

const oldSidebarTitle = `<span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-700 text-sm">{b.heRef || b.ref}</span>`;
const newSidebarTitle = `<span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-700 text-sm">{b.heRef || b.ref} {b.verseIdx !== undefined && <span className="text-xs text-slate-400 font-normal mr-1">(פסקה {b.verseIdx + 1})</span>}</span>`;
code = code.replace(oldSidebarTitle, newSidebarTitle);

// 6. Update removeBookmark to use both ref and verseIdx
code = code.replace(
  'const removeBookmark = (e: React.MouseEvent, ref: string) => {',
  'const removeBookmark = (e: React.MouseEvent, ref: string, verseIdx?: number) => {'
);
code = code.replace(
  'saveBookmarks(bookmarks.filter(b => b.ref !== ref));',
  'saveBookmarks(bookmarks.filter(b => !(b.ref === ref && b.verseIdx === verseIdx)));'
);
code = code.replace(
  'onClick={(e) => removeBookmark(e, b.ref)}',
  'onClick={(e) => { e.stopPropagation(); removeBookmark(e, b.ref, b.verseIdx); }}'
);

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
console.log('Added exact verse bookmarking');
