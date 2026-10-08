const fs = require('fs');
let code = fs.readFileSync('app/components/ShabbatTimes.tsx', 'utf8');

const oldEvent = `<div className="flex items-center gap-2 text-ink-700">
          <i className="fas fa-star-of-david text-primary-500 text-[15px]"></i>
          <span className="font-bold text-sm">{times.eventName}</span>
        </div>`;

const newEvent = `<div className={\`flex items-center gap-2 text-ink-700 transition-opacity duration-300 \${isLoading ? 'opacity-30' : 'opacity-100'}\`}>
          <i className={\`fas fa-star-of-david text-primary-500 text-[15px] \${isLoading ? 'animate-spin' : ''}\`}></i>
          <span className="font-bold text-sm">{times.eventName}</span>
        </div>`;

code = code.replace(oldEvent, newEvent);

fs.writeFileSync('app/components/ShabbatTimes.tsx', code, 'utf8');
