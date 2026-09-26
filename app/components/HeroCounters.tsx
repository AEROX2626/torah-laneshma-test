"use client";
import { useEffect, useRef, useCallback } from "react";

export default function HeroCounters() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  const animateValue = useCallback((element: HTMLElement, end: number, duration: number, format: (n: number) => string) => {
    const startTime = performance.now();
    
    const update = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * end);
      element.textContent = format(current);
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    
    requestAnimationFrame(update);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            animatedRef.current = true;
            // Animate each counter
            const counters = container.querySelectorAll('[data-counter]');
            counters.forEach((el) => {
              const target = Number(el.getAttribute('data-counter'));
              const suffix = el.getAttribute('data-suffix') || '';
              const locale = el.getAttribute('data-locale') === 'true';
              animateValue(el as HTMLElement, target, 2000, (n) => {
                const formatted = locale ? n.toLocaleString('he-IL') : String(n);
                return formatted + suffix;
              });
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [animateValue]);

  return (
    <div ref={containerRef} className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
      <div className="text-center reveal">
        <div className="font-heading font-black text-4xl md:text-6xl text-white stat-number" aria-label="2,500">
          <span data-counter="2500" data-locale="true">0</span>
        </div>
        <div className="text-primary-300 font-bold mt-2 text-sm md:text-base">לומדים פעילים</div>
      </div>
      <div className="text-center reveal" style={{ transitionDelay: "0.1s" }}>
        <div className="font-heading font-black text-4xl md:text-6xl text-white stat-number" aria-label="120K+">
          <span data-counter="120" data-suffix="K+">0</span>
        </div>
        <div className="text-primary-300 font-bold mt-2 text-sm md:text-base">שעות של למידה</div>
      </div>
      <div className="text-center reveal" style={{ transitionDelay: "0.2s" }}>
        <div className="font-heading font-black text-4xl md:text-6xl text-white stat-number" aria-label="450+">
          <span data-counter="450" data-suffix="+">0</span>
        </div>
        <div className="text-primary-300 font-bold mt-2 text-sm md:text-base">מתנדבים ברחבי הארץ</div>
      </div>
      <div className="text-center reveal" style={{ transitionDelay: "0.3s" }}>
        <div className="font-heading font-black text-4xl md:text-6xl text-white stat-number" aria-label="4.9★">
          4.9<span className="text-accent-400 text-3xl">★</span>
        </div>
        <div className="text-primary-300 font-bold mt-2 text-sm md:text-base">דירוג שביעות רצון</div>
      </div>
    </div>
  );
}
