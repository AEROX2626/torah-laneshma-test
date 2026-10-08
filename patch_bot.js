const fs = require('fs');

function patchWorkflow(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/user\.name "github-actions\[bot\]"/g, 'user.name "TorahBot"');
  content = content.replace(/user\.email "41898282\+github-actions\[bot\]@users\.noreply\.github\.com"/g, 'user.email "bot@torah-laneshma.org"');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Patched', filePath);
}

patchWorkflow('.github/workflows/daily-tip.yml');
patchWorkflow('.github/workflows/parasha.yml');
