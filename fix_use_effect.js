const fs = require('fs');
let code = fs.readFileSync('app/components/ShabbatTimes.tsx', 'utf8');

code = code.replace(
  /useEffect\(\(\) => \{\s*const saved = localStorage\.getItem\("shabbatLocation"\);\s*if \(saved\) \{\s*try \{\s*const \{ query, cityName \} = JSON\.parse\(saved\);\s*fetchShabbatTimes\(query, cityName\);\s*\} catch \(e\) \{\s*fetchShabbatTimes\("geonameid=281184", "ירושלים"\);\s*\}\s*\} else \{\s*fetchShabbatTimes\("geonameid=281184", "ירושלים"\);\s*\}\s*\}, \[\]\);/,
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
  }, [targetDate]);`
);

fs.writeFileSync('app/components/ShabbatTimes.tsx', code, 'utf8');
console.log('Fixed useEffect dependency');
