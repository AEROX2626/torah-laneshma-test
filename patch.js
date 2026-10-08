const fs = require('fs');
let code = fs.readFileSync('app/study/SefariaReader.tsx', 'utf8');

// 1. Add states
code = code.replace(
  'const [sidebarOpen, setSidebarOpen] = useState(false);',
  `const [sidebarOpen, setSidebarOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);`
);

// 2. Add handleQueryChange function
code = code.replace(
  'const handleSearch = (e: React.FormEvent) => {',
  `const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.trim().length >= 2) {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(async () => {
        try {
          const res = await fetch(\`https://www.sefaria.org/api/name/\${encodeURIComponent(val)}\`);
          const data = await res.json();
          setSuggestions(data.completions || []);
          setShowSuggestions(true);
        } catch (e) {
          setSuggestions([]);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    fetchText(suggestion);
  };

  const handleSearch = (e: React.FormEvent) => {`
);
code = code.replace(
  'if (query.trim()) {',
  `setShowSuggestions(false);
    if (query.trim()) {`
);

// 3. Update the Desktop Form
code = code.replace(
  '<form onSubmit={handleSearch} className="relative">',
  '<form onSubmit={handleSearch} className="relative z-50">'
);
code = code.replace(
  'onChange={(e) => setQuery(e.target.value)}',
  'onChange={(e) => handleQueryChange(e.target.value)}\n              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}\n              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}'
);

// Insert suggestions dropdown after desktop search input
code = code.replace(
  '</form>\n        </div>\n\n        <div className="flex items-center gap-3">',
  `{showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-y-auto z-50 py-2">
                {suggestions.map((s, i) => (
                  <li key={i}>
                    <button 
                      type="button"
                      onMouseDown={() => selectSuggestion(s)}
                      className="w-full text-right px-4 py-2 hover:bg-blue-50 hover:text-blue-700 transition-colors text-slate-700 font-medium text-sm border-b border-slate-50 last:border-0"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </form>
        </div>

        <div className="flex items-center gap-3">`
);

// 4. Update the Mobile Form
code = code.replace(
  '<form onSubmit={handleSearch} className="relative">',
  '<form onSubmit={handleSearch} className="relative z-50">'
);
// We actually have two forms in the file (one desktop, one mobile). 
// The string replacement might have targeted both or one.
// Let's just use string replace that targets the specific instances.
