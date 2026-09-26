"use client";
import { useState, useEffect } from "react";

export default function StatsCounters() {
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">
      <div className="card-hover bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 hover:bg-white/20 transition-all text-center reveal">
        <div className="font-heading font-black text-4xl md:text-6xl text-white stat-number">{counters.learners.toLocaleString("he-IL")}</div>
        <div className="text-primary-300 font-bold mt-2 text-sm md:text-base">לומדים פעילים</div>
      </div>
      <div className="card-hover bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 hover:bg-white/20 transition-all text-center reveal" style={{ transitionDelay: "0.1s" }}>
        <div className="font-heading font-black text-4xl md:text-6xl text-white stat-number">
          <span>{counters.hours}</span>K+
        </div>
        <div className="text-primary-300 font-bold mt-2 text-sm md:text-base">שעות לימוד בשנה</div>
      </div>
      <div className="card-hover bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 hover:bg-white/20 transition-all text-center reveal" style={{ transitionDelay: "0.2s" }}>
        <div className="font-heading font-black text-4xl md:text-6xl text-white stat-number">
          <span>{counters.volunteers}</span>+
        </div>
        <div className="text-primary-300 font-bold mt-2 text-sm md:text-base">מתנדבים</div>
      </div>
      <div className="card-hover bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 hover:bg-white/20 transition-all text-center reveal" style={{ transitionDelay: "0.3s" }}>
        <div className="font-heading font-black text-4xl md:text-6xl text-white stat-number">4.9<span className="text-accent-400 text-3xl">★</span></div>
        <div className="text-primary-300 font-bold mt-2 text-sm md:text-base">דירוג שביעות רצון</div>
      </div>
    </div>
  );
}
