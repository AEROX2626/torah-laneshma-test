const fs = require("fs");
let p = fs.readFileSync("app/components/ShabbatTimes.tsx", "utf8");

p = p.replace(
  `fetchShabbatTimes(\`geonameid=\${cityId}\`, cityName);`,
  `fetchShabbatTimes(\`geonameid=\${cityId}\`, cityName);
    localStorage.setItem("shabbatLocation", JSON.stringify({ query: \`geonameid=\${cityId}\`, cityName }));`
);

p = p.replace(
  `fetchShabbatTimes(\`latitude=\${lat}&longitude=\${lng}&tzid=Asia/Jerusalem\`, locationName);
              setIsDropdownOpen(false);`,
  `fetchShabbatTimes(\`latitude=\${lat}&longitude=\${lng}&tzid=Asia/Jerusalem\`, locationName);
              localStorage.setItem("shabbatLocation", JSON.stringify({ query: \`latitude=\${lat}&longitude=\${lng}&tzid=Asia/Jerusalem\`, cityName: locationName }));
              setIsDropdownOpen(false);`
);

p = p.replace(
  `fetchShabbatTimes(\`latitude=\${lat}&longitude=\${lng}&tzid=Asia/Jerusalem\`, "לפי מיקום");
              setIsDropdownOpen(false);`,
  `fetchShabbatTimes(\`latitude=\${lat}&longitude=\${lng}&tzid=Asia/Jerusalem\`, "לפי מיקום");
              localStorage.setItem("shabbatLocation", JSON.stringify({ query: \`latitude=\${lat}&longitude=\${lng}&tzid=Asia/Jerusalem\`, cityName: "לפי מיקום" }));
              setIsDropdownOpen(false);`
);

const oldUseEffect = `  useEffect(() => {
    // Default to Jerusalem
    fetchShabbatTimes("geonameid=281184", "ירושלים");
    
    const handleClickOutside = (event: MouseEvent) => {`;

const newUseEffect = `  useEffect(() => {
    // Check localStorage first
    const saved = localStorage.getItem("shabbatLocation");
    if (saved) {
      try {
        const { query, cityName } = JSON.parse(saved);
        fetchShabbatTimes(query, cityName);
      } catch (e) {
        fetchShabbatTimes("geonameid=281184", "ירושלים");
      }
    } else {
      // Default to Jerusalem
      fetchShabbatTimes("geonameid=281184", "ירושלים");
    }
    
    const handleClickOutside = (event: MouseEvent) => {`;

p = p.replace(oldUseEffect, newUseEffect);

fs.writeFileSync("app/components/ShabbatTimes.tsx", p, "utf8");
console.log("Success");
