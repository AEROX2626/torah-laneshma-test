const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

const regex = /<form id="signup-form"[\s\S]*?<\/form>/;
code = code.replace(regex, '<JoinForm />');

fs.writeFileSync('app/page.tsx', code, 'utf8');
console.log('Replaced the large signup form');
