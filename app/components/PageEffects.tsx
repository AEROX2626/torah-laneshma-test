"use client";
import { useEffect } from "react";

export default function PageEffects() {
  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Scroll Progress - with rAF throttle
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const el = document.getElementById("scroll-progress");
          if (el && docHeight > 0) el.style.width = `${(scrollTop / docHeight) * 100}%`;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Reveal Animations
    const revealElements = document.querySelectorAll(".reveal, .reveal-scale, .reveal-right");
    
    if (prefersReducedMotion) {
      // Immediately show all elements
      revealElements.forEach((el) => el.classList.add("active"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("active");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
      );

      revealElements.forEach((el) => observer.observe(el));
      
      return () => {
        window.removeEventListener("scroll", handleScroll);
        observer.disconnect();
      };
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}
