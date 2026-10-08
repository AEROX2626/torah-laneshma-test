const fs = require('fs');
let code = fs.readFileSync('app/components/ShabbatTimes.tsx', 'utf8');

// Replace the specific useEffect
code = code.replace(
  /useEffect\(\(\) => \{\s*const saved = localStorage\.getItem\("shabbatLocation"\);[\s\S]*?handleClickOutside\);[\s\S]*?\}, \[\]\);/,
  `useEffect(() => {
    const saved = localStorage.getItem("shabbatLocation");
    if (saved) {
      try {
        const { query, cityName } = JSON.parse(saved);
        fetchShabbatTimes(query, cityName, targetDate);
      } catch (e) {
        fetchShabbatTimes("geonameid=281184", "ירושלים", targetDate);
      }
    } else {
      fetchShabbatTimes("geonameid=281184", "ירושלים", targetDate);
    }
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [targetDate]);`
);

fs.writeFileSync('app/components/ShabbatTimes.tsx', code, 'utf8');
console.log('Successfully replaced useEffect with targetDate dependency');
