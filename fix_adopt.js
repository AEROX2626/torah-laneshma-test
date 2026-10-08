const fs = require('fs');
let code = fs.readFileSync('app/adopt/page.tsx', 'utf8');

const targetStr = `<div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="blob bg-primary-200 w-[600px] h-[600px] rounded-full top-[-200px] right-[-200px] animate-float"></div>
        <div className="blob bg-accent-100 w-[500px] h-[500px] rounded-full top-[30%] left-[-200px] animate-float-slow" style={{ animationDelay: "-4s" }}></div>
      </div>`;

const targetStrLF = targetStr.replace(/\r\n/g, '\n');

const replaceStr = `<div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-200px] right-[-200px] w-[800px] h-[800px] bg-[radial-gradient(circle,_rgba(184,221,253,0.3)_0%,_transparent_60%)] animate-float"></div>
        <div className="absolute top-[30%] left-[-200px] w-[700px] h-[700px] bg-[radial-gradient(circle,_rgba(254,215,170,0.25)_0%,_transparent_60%)] animate-float-slow" style={{ animationDelay: "-4s" }}></div>
      </div>`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replaceStr);
  console.log("Replaced blobs in adopt page (CRLF)");
} else if (code.includes(targetStrLF)) {
  code = code.replace(targetStrLF, replaceStr);
  console.log("Replaced blobs in adopt page (LF)");
} else {
  // Regex fallback
  code = code.replace(/<div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">[\s\S]*?<\/div>\s*<\/div>/, replaceStr);
  console.log("Replaced blobs in adopt page (REGEX)");
}

fs.writeFileSync('app/adopt/page.tsx', code, 'utf8');
