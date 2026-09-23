const fs = require("fs");
let p = fs.readFileSync("app/components/Navbar.tsx", "utf8");

// 1. Change fixed to sticky top-0
p = p.replace('className={`fixed w-full z-50', 'className={`sticky top-0 w-full z-50');
// Wait, if I change fixed to sticky top-0, I need to remove pt-32 from the page hero!
// Or wait, if I keep fixed, I can do `fixed top-0`, but it will overlap HolidayBanner.
// The best approach is `sticky top-0`.

// 2. Add whitespace-nowrap and reduce padding/text size for desktop links
// The class string to replace: "px-4 py-2.5 text-ink-600 hover:text-primary-600 font-semibold text-[15px] rounded-xl hover:bg-primary-50 transition-all"
// We want: "px-2 lg:px-3 py-2.5 whitespace-nowrap text-ink-600 hover:text-primary-600 font-semibold text-[14px] lg:text-[15px] rounded-xl hover:bg-primary-50 transition-all"
p = p.replace(/px-4 py-2.5 text-ink-600/g, 'px-2 lg:px-3 py-2 text-ink-600 whitespace-nowrap text-[14px] lg:text-[15px]');

p = p.replace(/px-4 py-2.5 font-semibold text-\[15px\]/g, 'px-2 lg:px-3 py-2 font-semibold text-[14px] lg:text-[15px] whitespace-nowrap');
p = p.replace(/px-4 py-2.5 font-bold text-\[15px\]/g, 'px-2 lg:px-3 py-2 font-bold text-[14px] lg:text-[15px] whitespace-nowrap');

// Update the solid glass class to be more opaque if needed.
// Wait, it uses the class "glass" which is defined in globals.css.
fs.writeFileSync("app/components/Navbar.tsx", p, "utf8");

let page = fs.readFileSync("app/page.tsx", "utf8");
// Decrease pt-32 to pt-12 md:pt-20 since the navbar is no longer absolutely positioned over it
page = page.replace('pt-32 md:pt-40', 'pt-12 md:pt-20');
fs.writeFileSync("app/page.tsx", page, "utf8");
