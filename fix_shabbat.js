const fs = require('fs');
let code = fs.readFileSync('app/components/ShabbatTimes.tsx', 'utf8');

// 1. Add states
const statesToInject = `  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const delay = setTimeout(() => {
        fetch(\`https://www.hebcal.com/complete?q=\${encodeURIComponent(searchQuery)}\`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) {
              setSearchResults(data.map(item => ({ id: String(item.id), name: item.name || item.value, value: item.value })));
            }
          });
      }, 300);
      return () => clearTimeout(delay);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);`;

code = code.replace(
  'const dropdownRef = useRef<HTMLDivElement>(null);',
  'const dropdownRef = useRef<HTMLDivElement>(null);\n' + statesToInject
);

// 2. Replace dropdown render
const oldDropdown = `{/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-ink-100 py-2 z-50 animate-fade-in text-sm font-medium">
          <button 
            onClick={handleLocationDetect}
            className="w-full text-right px-4 py-3 text-primary-600 hover:bg-primary-50 transition-colors flex items-center gap-2 border-b border-ink-50"
          >
            <i className="fas fa-location-arrow"></i>
            <span>איתור מיקום אוטומטי</span>
          </button>
          <div className="py-1">
            {CITIES.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCitySelect(c.id, c.name)}
                className={\`w-full text-right px-4 py-2 hover:bg-primary-50 transition-colors \${times.city === c.name ? "text-primary-600 bg-primary-50/50" : "text-ink-700"}\`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}`;

const oldDropdownLF = oldDropdown.replace(/\r\n/g, '\n');

const newDropdown = `{/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-ink-100 py-2 z-50 animate-fade-in text-sm font-medium">
          <div className="px-3 pb-2 mb-2 border-b border-ink-50">
            <input 
              type="text" 
              placeholder="חפש עיר בעולם..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-ink-50 border border-transparent focus:border-primary-300 focus:bg-white rounded-lg px-3 py-1.5 text-sm outline-none transition-all"
              autoFocus
            />
          </div>
          
          <button 
            onClick={handleLocationDetect}
            className="w-full text-right px-4 py-2 mb-1 text-primary-600 hover:bg-primary-50 transition-colors flex items-center gap-2"
          >
            <i className="fas fa-location-arrow"></i>
            <span>איתור מיקום אוטומטי</span>
          </button>
          
          <div className="max-h-48 overflow-y-auto custom-scrollbar">
            {(searchQuery.length >= 2 ? searchResults : CITIES).map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  handleCitySelect(c.id, c.name);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className={\`w-full text-right px-4 py-2 hover:bg-primary-50 transition-colors block truncate \${times.city === c.name ? "text-primary-600 bg-primary-50/50" : "text-ink-700"}\`}
                title={c.value || c.name}
              >
                {c.name}
              </button>
            ))}
            {searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className="text-center text-ink-400 py-3 text-xs">לא נמצאו ערים</div>
            )}
          </div>
        </div>
      )}`;

if (code.includes(oldDropdown)) {
  code = code.replace(oldDropdown, newDropdown);
  console.log("Replaced dropdown (CRLF)");
} else if (code.includes(oldDropdownLF)) {
  code = code.replace(oldDropdownLF, newDropdown);
  console.log("Replaced dropdown (LF)");
} else {
  console.log("Dropdown not found, trying regex");
  code = code.replace(/\{isDropdownOpen && \([\s\S]*?\}\)\}\s*<\/div>\s*<\/div>\s*\)\}/, newDropdown);
}

fs.writeFileSync('app/components/ShabbatTimes.tsx', code, 'utf8');
