const fs = require('fs');
const content = fs.readFileSync('app/components/Navbar.tsx', 'utf8');
const lines = content.split('\n');
for (let i=0; i<lines.length; i++) {
    if (lines[i].includes('group')) {
        console.log(i, lines[i]);
    }
}
