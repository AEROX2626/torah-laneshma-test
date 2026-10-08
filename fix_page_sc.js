const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

// 1. Remove "use client" and unused imports
code = code.replace('"use client";\n', '');
code = code.replace(/import { useEffect, useState } from "react";\n/, '');

// 2. Add new component imports
code = code.replace(
  'import Navbar from "./components/Navbar";',
  'import Navbar from "./components/Navbar";\nimport PageEffects from "./components/PageEffects";\nimport FaqAccordion from "./components/FaqAccordion";\nimport StatsCounters from "./components/StatsCounters";'
);

// 3. Remove state and useEffect from Home
code = code.replace(/const \[openFaq, setOpenFaq\] = useState<number \| null>\(null\);\n\s*const \[isModalOpen, setIsModalOpen\] = useState\(false\);\n\s*const \[isSubmitting, setIsSubmitting\] = useState\(false\);/, 'const isModalOpen = false; const setIsModalOpen = () => {}; const isSubmitting = false; const setIsSubmitting = () => {};');
// Wait, the Join Modal uses isModalOpen. I will extract JoinModalWrapper later or keep it as is.
// Actually, it's better to just extract the Join Modal logic into a separate component.
