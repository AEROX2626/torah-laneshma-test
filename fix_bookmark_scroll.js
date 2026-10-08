const fs = require('fs');
let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

const targetStr = `  const handleBookmarkClick = (b: Bookmark) => {
    setSidebarOpen(false);
    if (b.verseIdx !== undefined) {
      setPendingScrollVerse(b.verseIdx);
    } else {
      setPendingScrollVerse(null);
    }
    fetchText(b.ref);
  };`;
const targetStrLF = targetStr.replace(/\r\n/g, '\n');

const replaceStr = `  const handleBookmarkClick = async (b: Bookmark) => {
    setSidebarOpen(false);
    
    // Only fetch if we are not already on this exact page
    if (!data || data.ref !== b.ref) {
      await fetchText(b.ref);
    }
    
    if (b.verseIdx !== undefined) {
      setPendingScrollVerse(b.verseIdx);
    } else {
      setPendingScrollVerse(null);
    }
  };`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replaceStr);
  console.log("Replaced handleBookmarkClick (CRLF)");
} else if (code.includes(targetStrLF)) {
  code = code.replace(targetStrLF, replaceStr);
  console.log("Replaced handleBookmarkClick (LF)");
} else {
  // Regex fallback
  code = code.replace(/const handleBookmarkClick = \(b: Bookmark\) => \{[\s\S]*?fetchText\(b\.ref\);\s*\};/, replaceStr);
  console.log("Replaced handleBookmarkClick (REGEX)");
}

fs.writeFileSync('app/study/SefariaReader.tsx', code, 'utf8');
