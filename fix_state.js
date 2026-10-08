const fs = require('fs');
let code = fs.readFileSync('app/components/JewishCalendarWidget.tsx', 'utf8');

code = code.replace(
  'const [items, setItems] = useState<HebcalItem[]>([]);',
  'const [items, setItems] = useState<HebcalItem[]>([]);\n  const [touchStartX, setTouchStartX] = useState<number | null>(null);'
);

fs.writeFileSync('app/components/JewishCalendarWidget.tsx', code, 'utf8');
console.log('Fixed state missing');
