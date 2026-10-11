"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { AdminUser } from "@/lib/auth";

export default function AdminShell({
  user,
  children,
}: {
  user: AdminUser | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/join";

  useEffect(() => {
    if (!user && !isAuthPage) {
      router.push("/admin/login");
    }
  }, [user, isAuthPage, router]);

  // If on login or join page, render children directly without admin shell
  if (isAuthPage) {
    return <>{children}</>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center font-bold text-neutral-600">
        טוען מערכת ניהול...
      </div>
    );
  }

  const handleLogout = async () => {
    await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/admin/login");
    router.refresh();
  };

  const navGroups = [
    {
      title: "פעילות שוטפת",
      items: [
        { href: "/admin", label: "לוח בקרה", icon: "fa-chart-pie", exact: true },
        { href: "/admin/submissions", label: "פניות ולידים", icon: "fa-inbox", badge: "חדש" },
        { href: "/admin/faqs", label: "שאלות ותשובות", icon: "fa-circle-question" },
      ],
    },
    {
      title: "תוכן האתר",
      items: [
        { href: "/admin/editor", label: "עורך ויזואלי", icon: "fa-wand-magic-sparkles" },
        { href: "/design-system", label: "שפת עיצוב", icon: "fa-palette" },
      ],
    },
    {
      title: "ניהול והרשאות",
      items: [
        { href: "/admin/users", label: "משתמשים והזמנות", icon: "fa-user-group" },
        { href: "/admin/settings", label: "הגדרות אתר", icon: "fa-sliders" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 font-sans text-neutral-900 flex" dir="rtl">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-neutral-950/50 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen z-50 bg-white border-l border-neutral-200/80 transition-all duration-300 flex flex-col ${
          collapsed ? "w-20" : "w-64"
        } ${mobileMenuOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}
      >
        {/* Brand */}
        <div className="h-16 border-b border-neutral-100 flex items-center justify-between px-5">
          {!collapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                ת
              </div>
              <div className="leading-tight">
                <span className="font-heading font-black text-sm text-neutral-950 block truncate">תורה לנשמה</span>
                <span className="text-[10px] text-neutral-400 font-bold block">מערכת ניהול ועורך</span>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-sm mx-auto">
              ת
            </div>
          )}

          {/* Collapse Button (desktop) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 items-center justify-center text-xs transition-colors cursor-pointer"
            title={collapsed ? "הרחב תפריט" : "כווץ תפריט"}
          >
            <i className={`fas fa-chevron-${collapsed ? "left" : "right"}`}></i>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!collapsed && (
                <p className="px-3 text-[11px] font-black uppercase tracking-wider text-neutral-400 mb-2">
                  {group.title}
                </p>
              )}
              {group.items.map((item) => {
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group relative ${
                      isActive
                        ? "bg-neutral-900 text-white shadow-xs"
                        : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/80"
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <i
                      className={`fas ${item.icon} text-sm ${
                        isActive ? "text-white" : "text-neutral-400 group-hover:text-neutral-800"
                      } ${collapsed ? "mx-auto" : ""}`}
                    ></i>
                    {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-primary-100 text-primary-700">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-neutral-100">
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-neutral-50 border border-neutral-100 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user.email.slice(0, 1).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0 leading-tight">
                <span className="block text-xs font-bold text-neutral-900 truncate">{user.email}</span>
                <span className="block text-[10px] text-neutral-400 font-semibold">
                  {user.role === "admin" ? "מנהל מערכת" : "עורך תוכן"}
                </span>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleLogout}
                className="w-7 h-7 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="התנתק מהמערכת"
              >
                <i className="fas fa-arrow-right-from-bracket"></i>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-neutral-200/80 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger on mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden w-9 h-9 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center text-sm cursor-pointer"
            >
              <i className="fas fa-bars"></i>
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
              <Link href="/admin" className="hover:text-neutral-900">
                ניהול
              </Link>
              <i className="fas fa-chevron-left text-[9px] text-neutral-300"></i>
              <span className="text-neutral-900">
                {pathname === "/admin"
                  ? "לוח בקרה"
                  : pathname.includes("submissions")
                  ? "פניות ולידים"
                  : pathname.includes("faqs")
                  ? "שאלות ותשובות"
                  : pathname.includes("users")
                  ? "משתמשים והרשאות"
                  : pathname.includes("editor")
                  ? "עורך ויזואלי"
                  : "הגדרות"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 rounded-xl border border-neutral-200 hover:border-neutral-900 text-xs font-bold text-neutral-700 hover:text-neutral-950 transition-colors flex items-center gap-1.5"
            >
              <i className="fas fa-arrow-up-right-from-square text-[10px]"></i>
              <span>צפה באתר הציבורי</span>
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
