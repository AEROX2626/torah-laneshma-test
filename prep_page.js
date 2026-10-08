const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

// 1. Remove client directives and hooks
code = code.replace('"use client";\n', '');
code = code.replace(/import { useEffect, useState } from "react";\n/, '');

// 2. Add component imports
code = code.replace(
  'import Navbar from "./components/Navbar";',
  `import Navbar from "./components/Navbar";
import PageEffects from "./components/PageEffects";
import FaqAccordion from "./components/FaqAccordion";
import StatsCounters from "./components/StatsCounters";
import JoinForm from "./components/JoinForm";`
);

// 3. Remove state and event handlers from Home function
code = code.replace(/const \[openFaq, setOpenFaq\] = useState[\s\S]*?const scrollToSection = \(e: React\.MouseEvent<HTMLAnchorElement>, hash: string\) => \{\n\s*e\.preventDefault\(\);\n\s*document\.querySelector\(hash\)\?\.scrollIntoView\(\{ behavior: "smooth" \}\);\n\s*\};\n/g, '');

// Wait, the scrollToSection is used in the hero!
// If scrollToSection is used, we need it. But onClick is a client event!
// We can't use onClick in Server Components!
// Instead of onClick, standard href="#hash" works for anchor links!
// I will replace `onClick={(e) => scrollToSection(e, "#join")}` with nothing, just `href="#join"`.
