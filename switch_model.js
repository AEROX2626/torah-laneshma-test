const fs = require('fs');

function useStableModel(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(
    "const modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash';",
    "const modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-3.5-flash';"
  );
  fs.writeFileSync(file, code, 'utf8');
}

useStableModel('scripts/generate-daily-tip.mjs');
useStableModel('scripts/generate-daily-features.mjs');
console.log('Switched to stable gemini-3.5-flash model');
