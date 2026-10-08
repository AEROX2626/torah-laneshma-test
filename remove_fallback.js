const fs = require('fs');

function removeFallback(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(
    'const modelName = (attempt >= 4 && baseModelName === \'gemini-3.8-flash\') ? \'gemini-3.8-flash-lite\' : baseModelName;',
    'const modelName = baseModelName;'
  );
  // Increase backoff significantly to bypass 429 rate limit
  code = code.replace(
    'const delay = Math.pow(2, attempt - 1) * 5000;',
    'const delay = attempt === 1 ? 5000 : attempt === 2 ? 15000 : attempt === 3 ? 35000 : attempt === 4 ? 65000 : 120000;'
  );
  fs.writeFileSync(file, code, 'utf8');
}

removeFallback('scripts/generate-daily-tip.mjs');
removeFallback('scripts/generate-daily-features.mjs');
console.log('Removed invalid fallback model');
