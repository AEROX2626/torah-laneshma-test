"use client";
import { useEffect } from "react";
import { scrollToJoinForm } from "./scrollToJoin";

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

    // Check for #join or #contact hash on initial page load / navigation from other pages
    let timer1: NodeJS.Timeout | null = null;
    let timer2: NodeJS.Timeout | null = null;
    if (window.location.hash === "#join" || window.location.hash === "#contact") {
      timer1 = setTimeout(() => {
        scrollToJoinForm({ smooth: false });
      }, 60);
      timer2 = setTimeout(() => {
        scrollToJoinForm({ smooth: true });
      }, 350);
    }

    // Listen for hash changes
    const handleHashChange = () => {
      if (window.location.hash === "#join" || window.location.hash === "#contact") {
        scrollToJoinForm();
      }
    };
    window.addEventListener("hashchange", handleHashChange);

    // Global click interceptor for all links pointing to #join or #contact on homepage
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href*='#join'], a[href*='#contact']");
      if (!anchor) return;

      const rawHref = anchor.getAttribute("href") || "";
      if (
        rawHref === "#join" ||
        rawHref === "#contact" ||
        rawHref.endsWith("/#join") ||
        rawHref.endsWith("/#contact")
      ) {
        if (window.location.pathname === "/") {
          e.preventDefault();
          scrollToJoinForm();
        }
      }
    };
    document.addEventListener("click", handleAnchorClick, { passive: false });

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
        window.removeEventListener("hashchange", handleHashChange);
        document.removeEventListener("click", handleAnchorClick);
        if (timer1) clearTimeout(timer1);
        if (timer2) clearTimeout(timer2);
        observer.disconnect();
      };
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
      document.removeEventListener("click", handleAnchorClick);
      if (timer1) clearTimeout(timer1);
      if (timer2) clearTimeout(timer2);
    };
  }, []);

  return null;
}
