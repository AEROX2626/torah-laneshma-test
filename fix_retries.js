const fs = require('fs');

function enhanceRetry(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  const retryBlockOld = /const maxAttempts = 3;[\s\S]*?await new Promise\(r => setTimeout\(r, 2000\)\);\n  \}/m;
  const retryBlockNew = `const maxAttempts = 6;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/\${encodeURIComponent(modelName)}:generateContent?key=\${API_KEY}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    if (res.ok) return res.json();
    const errorText = await res.text();
    console.error(\`Gemini API error (attempt \${attempt}): \${res.status} - \${errorText}\`);
    if (attempt === maxAttempts) throw new Error(\`Gemini failed: \${res.status} - \${errorText}\`);
    
    // Exponential backoff: 5s, 10s, 20s, 40s, 80s
    const delay = Math.pow(2, attempt - 1) * 5000;
    console.log(\`Waiting \${delay}ms before next attempt...\`);
    await new Promise(r => setTimeout(r, delay));
  }`;
  
  if(code.match(retryBlockOld)) {
     code = code.replace(retryBlockOld, retryBlockNew);
     fs.writeFileSync(file, code, 'utf8');
     console.log('Fixed ' + file);
  } else {
     console.log('Regex not matched in ' + file);
  }
}

enhanceRetry('scripts/generate-daily-tip.mjs');
enhanceRetry('scripts/generate-daily-features.mjs');
