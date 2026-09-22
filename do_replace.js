const fs = require('fs');
let p = fs.readFileSync('app/page.tsx', 'utf8');

if (!p.includes('import Link from "next/link"')) {
  p = 'import Link from "next/link";\n' + p;
}

const search1 = '<a href="#join" onClick={(e) => scrollToSection(e, "#join")} className="group bg-white rounded-3xl overflow-hidden border border-ink-100 hover:border-primary-200 card-hover flex flex-col h-full reveal">';
const search2 = '<a href="#join" onClick={(e) => scrollToSection(e, "#join")} className="group bg-white rounded-3xl overflow-hidden border border-ink-100 hover:border-primary-200 card-hover flex flex-col h-full reveal" style={{ transitionDelay: "0.1s" }}>';
const search3 = '<a href="#join" onClick={(e) => scrollToSection(e, "#join")} className="group bg-white rounded-3xl overflow-hidden border border-ink-100 hover:border-primary-200 card-hover flex flex-col h-full reveal" style={{ transitionDelay: "0.2s" }}>';

const slugs = ['bitachon', 'chavruta', 'lech-lecha', 'noah', 'vayera', 'bereshit'];

p = p.replace(search1, `<Link href="/articles/${slugs[0]}" className="group bg-white rounded-3xl overflow-hidden border border-ink-100 hover:border-primary-200 card-hover flex flex-col h-full reveal">`);
p = p.replace(search2, `<Link href="/articles/${slugs[1]}" className="group bg-white rounded-3xl overflow-hidden border border-ink-100 hover:border-primary-200 card-hover flex flex-col h-full reveal" style={{ transitionDelay: "0.1s" }}>`);
p = p.replace(search3, `<Link href="/articles/${slugs[2]}" className="group bg-white rounded-3xl overflow-hidden border border-ink-100 hover:border-primary-200 card-hover flex flex-col h-full reveal" style={{ transitionDelay: "0.2s" }}>`);
p = p.replace(search1, `<Link href="/articles/${slugs[3]}" className="group bg-white rounded-3xl overflow-hidden border border-ink-100 hover:border-primary-200 card-hover flex flex-col h-full reveal">`);
p = p.replace(search2, `<Link href="/articles/${slugs[4]}" className="group bg-white rounded-3xl overflow-hidden border border-ink-100 hover:border-primary-200 card-hover flex flex-col h-full reveal" style={{ transitionDelay: "0.1s" }}>`);
p = p.replace(search3, `<Link href="/articles/${slugs[5]}" className="group bg-white rounded-3xl overflow-hidden border border-ink-100 hover:border-primary-200 card-hover flex flex-col h-full reveal" style={{ transitionDelay: "0.2s" }}>`);

// Now replace the closing tags (only the first 6 we encounter after finding the opening tags)
// We will do a generic regex that replaces the specific structure of the closing tags.
const regexClose = /<i className="fas fa-arrow-left mt-0\.5 text-xs"><\/i>(?:\r?\n)\s*<\/div>(?:\r?\n)\s*<\/div>(?:\r?\n)\s*<\/a>/g;
let count = 0;
p = p.replace(regexClose, (match) => {
  if (count < 6) {
    count++;
    return `<i className="fas fa-arrow-left mt-0.5 text-xs"></i>\n                </div>\n              </div>\n            </Link>`;
  }
  return match;
});

fs.writeFileSync('app/page.tsx', p);
