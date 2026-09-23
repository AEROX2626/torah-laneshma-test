const fs = require("fs");
let config = fs.readFileSync("next.config.ts", "utf8");

// Regex to find Hebrew characters in the source paths
// We will simply encode the whole source path (only encoding the Hebrew parts)

const newConfig = config.replace(/source:\s*'([^']+)'/g, (match, p1) => {
  // If the path contains Hebrew, encode it
  if (/[\u0590-\u05FF]/.test(p1)) {
    // split by slash, encode components
    const encoded = p1.split('/').map(segment => {
      // Don't encode things like :path* or regexes if possible, but in this case, 
      // none of our Hebrew sources have variables in the same segment.
      // Wait, let's just encodeURI the whole path (which ignores slashes).
      return encodeURI(segment);
    }).join('/');
    return `source: '${encoded}'`;
  }
  return match;
});

fs.writeFileSync("next.config.ts", newConfig, "utf8");
console.log("Updated config to use encoded URIs");
