/**
 * Universal smooth scrolling to the lead form across all pages, devices, and viewports.
 * - On Desktop: Frames #join-card cleanly right below the glass navbar (navOffset + 12px breather).
 * - On Mobile: Scrolls directly to #join-form-wrapper so form inputs are immediately visible and front-center.
 * - Adds a subtle highlight pulse and focuses the name input field automatically.
 */

let lastScrollTimestamp = 0;

export function scrollToJoinForm(options?: { focusInput?: boolean; smooth?: boolean }) {
  if (typeof window === "undefined") return;

  const now = Date.now();
  if (now - lastScrollTimestamp < 120) {
    return;
  }
  lastScrollTimestamp = now;

  const isHome = window.location.pathname === "/";
  if (!isHome) {
    window.location.href = "/#join";
    return;
  }

  // Ensure body scroll is unlocked (e.g. if mobile drawer was open)
  if (document.body.style.overflow === "hidden") {
    document.body.style.overflow = "";
  }

  const isMobile = window.innerWidth < 1024;
  const target = isMobile
    ? (document.getElementById("join-form-wrapper") || document.getElementById("join-card"))
    : (document.getElementById("join-card") || document.getElementById("join-form-wrapper"));

  if (!target) {
    const fallback = document.getElementById("join");
    if (fallback) {
      fallback.scrollIntoView({ behavior: options?.smooth !== false ? "smooth" : "auto" });
    }
    return;
  }

  const navbar = document.getElementById("navbar");
  const navHeight = navbar ? navbar.offsetHeight : (isMobile ? 70 : 88);
  const breather = isMobile ? 8 : 12;
  const offset = navHeight + breather;

  const targetRect = target.getBoundingClientRect();
  const targetTop = targetRect.top + window.pageYOffset - offset;

  window.scrollTo({
    top: Math.max(0, targetTop),
    behavior: options?.smooth !== false ? "smooth" : "auto",
  });

  // Highlight pulse animation on the card
  const card = document.getElementById("join-card") || target;
  if (card) {
    card.classList.add("highlight-pulse");
    setTimeout(() => {
      card.classList.remove("highlight-pulse");
    }, 2500);
  }

  // Smoothly focus the full name input inside the active form
  if (options?.focusInput !== false) {
    setTimeout(() => {
      const nameInput = target.querySelector<HTMLInputElement>("input[name='name']");
      if (nameInput && document.activeElement !== nameInput) {
        nameInput.focus({ preventScroll: true });
      }
    }, 450);
  }
}
