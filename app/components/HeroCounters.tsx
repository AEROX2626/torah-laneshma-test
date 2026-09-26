"use client";
import { useState, useEffect } from "react";

export default function HeroCounters() {
  const [counters, setCounters] = useState({
    learners: 0,
    hours: 0,
    volunteers: 0,
  });

  useEffect(() => {
    // Number Counting Animation
    const animateValue = (key: keyof typeof counters, end: number, duration: number) => {
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCounters((prev) => ({ ...prev, [key]: end }));
          clearInterval(timer);
        } else {
          setCounters((prev) => ({ ...prev, [key]: Math.floor(start) }));
        }
      }, 16);
    };

    setTimeout(() => {
      animateValue("learners", 2500, 2000);
      animateValue("hours", 120, 2500);
      animateValue("volunteers", 450, 2000);
    }, 500);
  }, []);

  return (
    <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
      <div className="text-center reveal">
        <div className="font-heading font-black text-4xl md:text-6xl text-white stat-number">{counters.learners.toLocaleString("he-IL")}</div>
        <div className="text-primary-300 font-bold mt-2 text-sm md:text-base">לומדים פעילים</div>
      </div>
      <div className="text-center reveal" style={{ transitionDelay: "0.1s" }}>
        <div className="font-heading font-black text-4xl md:text-6xl text-white stat-number">
          <span>{counters.hours}</span>K+
        </div>
        <div className="text-primary-300 font-bold mt-2 text-sm md:text-base">שעות של למידה</div>
      </div>
      <div className="text-center reveal" style={{ transitionDelay: "0.2s" }}>
        <div className="font-heading font-black text-4xl md:text-6xl text-white stat-number">
          <span>{counters.volunteers}</span>+
        </div>
        <div className="text-primary-300 font-bold mt-2 text-sm md:text-base">מתנדבים ברחבי הארץ</div>
      </div>
      <div className="text-center reveal" style={{ transitionDelay: "0.3s" }}>
        <div className="font-heading font-black text-4xl md:text-6xl text-white stat-number">4.9<span className="text-accent-400 text-3xl">★</span></div>
        <div className="text-primary-300 font-bold mt-2 text-sm md:text-base">דירוג שביעות רצון</div>
      </div>
    </div>
  );
}
