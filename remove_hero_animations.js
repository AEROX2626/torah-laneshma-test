const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

// The hero section is from the beginning up to the Marquee container.
// Let's replace ' reveal' and ' reveal-scale' only in the first part of the file.
const splitIndex = code.indexOf('marquee-container');
let firstPart = code.substring(0, splitIndex);
let secondPart = code.substring(splitIndex);

firstPart = firstPart.replace(/ reveal-scale/g, '');
firstPart = firstPart.replace(/ reveal/g, '');

code = firstPart + secondPart;

fs.writeFileSync('app/page.tsx', code, 'utf8');
console.log('Removed LCP delaying animations');
