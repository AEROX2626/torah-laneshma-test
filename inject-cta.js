const fs = require("fs");
let p = fs.readFileSync("app/components/Footer.tsx", "utf8");

if (!p.includes("import GlobalCTA")) {
  p = p.replace('import { usePathname } from "next/navigation";', 'import { usePathname } from "next/navigation";\nimport GlobalCTA from "./GlobalCTA";');
  p = p.replace('<footer className="bg-ink-50', '{!isHome && <GlobalCTA />}\n      <footer className="bg-ink-50');
  fs.writeFileSync("app/components/Footer.tsx", p, "utf8");
  console.log("GlobalCTA injected into Footer.tsx");
} else {
  console.log("Already injected");
}
