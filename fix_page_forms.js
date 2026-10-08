const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

// Replace ALL forms
code = code.replace(/<form onSubmit=\{handleFormSubmit\}[\s\S]*?<\/form>/g, '<JoinForm />');

fs.writeFileSync('app/page.tsx', code, 'utf8');
console.log('Replaced all forms');
