"use client";
import { useEffect } from "react";

export default function PageEffects() {
  useEffect(() => {
    // Scroll Progress
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const el = document.getElementById("scroll-progress");
      if (el) el.style.width = `${(scrollTop / docHeight) * 100}%`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Reveal Animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-8", "scale-95");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal, .reveal-scale, .reveal-right").forEach((el) => {
      observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return null;
}
