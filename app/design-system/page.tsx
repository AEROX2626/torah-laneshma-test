"use client";

import { useState } from "react";
import Link from "next/link";

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState<"tokens" | "typography" | "buttons" | "forms" | "cards">("tokens");
  const [toggleState, setToggleState] = useState(true);
  const [stepperValue, setStepperValue] = useState(1);
  const [accordionOpen, setAccordionOpen] = useState(true);

  return (
    <div className="min-h-screen bg-ink-50 font-sans text-ink-900 pb-24" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-ink-100 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <i className="fas fa-palette"></i>
            </div>
            <div>
              <h1 className="font-heading font-black text-2xl text-ink-950">שפת עיצוב ומשתנים (Design System)</h1>
              <p className="text-xs text-ink-500 font-medium">תורה לנשמה · Tokens, Components & UI Library</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              href="/" 
              className="text-xs font-bold text-ink-600 hover:text-primary-600 bg-ink-100 hover:bg-ink-200 px-3 py-2 rounded-lg transition-colors"
            >
              חזרה לאתר
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-6 flex gap-2 border-t border-ink-100/60 overflow-x-auto py-2">
          {[
            { id: "tokens", label: "משתנים ופלטת צבעים", icon: "fa-swatchbook" },
            { id: "typography", label: "טיפוגרפיה וטקסט", icon: "fa-font" },
            { id: "buttons", label: "כפתורים ופקדים", icon: "fa-hand-pointer" },
            { id: "forms", label: "טפסים ושדות קלט", icon: "fa-pen-to-square" },
            { id: "cards", label: "כרטיסים ומכולות", icon: "fa-layer-group" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-primary-500 text-white shadow-sm"
                  : "text-ink-600 hover:text-ink-900 hover:bg-ink-100"
              }`}
            >
              <i className={`fas ${tab.icon} text-xs`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-10">
        {/* TOKENS TAB */}
        {activeTab === "tokens" && (
          <section className="space-y-12 animate-fade-in">
            {/* Primary Colors */}
            <div className="bg-white rounded-3xl p-8 border border-ink-100 shadow-sm">
              <h2 className="font-heading font-black text-xl text-ink-950 mb-2">צבעי מותג (Primary Blues)</h2>
              <p className="text-sm text-ink-500 mb-6 font-medium">צבעי היסוד של המותג: משמשים לכפתורים ראשיים, קישורים, והדגשות.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
                {[
                  { name: "50", hex: "#eff8ff", bg: "bg-primary-50", text: "text-primary-900" },
                  { name: "100", hex: "#dbeefe", bg: "bg-primary-100", text: "text-primary-900" },
                  { name: "200", hex: "#b8ddfd", bg: "bg-primary-200", text: "text-primary-900" },
                  { name: "300", hex: "#84c5fb", bg: "bg-primary-300", text: "text-primary-900" },
                  { name: "400", hex: "#48a4f7", bg: "bg-primary-400", text: "text-white" },
                  { name: "500", hex: "#1f84ee", bg: "bg-primary-500", text: "text-white", border: true },
                  { name: "600", hex: "#1167cc", bg: "bg-primary-600", text: "text-white" },
                  { name: "700", hex: "#0f52a5", bg: "bg-primary-700", text: "text-white" },
                  { name: "800", hex: "#124688", bg: "bg-primary-800", text: "text-white" },
                  { name: "900", hex: "#153b70", bg: "bg-primary-900", text: "text-white" },
                ].map((c) => (
                  <div key={c.name} className="flex flex-col gap-2">
                    <div className={`h-20 rounded-2xl ${c.bg} ${c.border ? "ring-4 ring-primary-500/30" : ""} shadow-xs flex items-end p-2.5`}>
                      <span className={`text-xs font-black ${c.text}`}>{c.name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-ink-500 text-center">{c.hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Accent Colors */}
            <div className="bg-white rounded-3xl p-8 border border-ink-100 shadow-sm">
              <h2 className="font-heading font-black text-xl text-ink-950 mb-2">צבעי הדגשה (Accent Amber/Orange)</h2>
              <p className="text-sm text-ink-500 mb-6 font-medium">לתגיות מיוחדות, אזהרות, כוכבי דירוג וסמלי קדושה/זהב.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-3">
                {[
                  { name: "50", hex: "#fff7ed", bg: "bg-accent-50", text: "text-accent-900" },
                  { name: "100", hex: "#ffedd5", bg: "bg-accent-100", text: "text-accent-900" },
                  { name: "200", hex: "#fed7aa", bg: "bg-accent-200", text: "text-accent-900" },
                  { name: "300", hex: "#fdba74", bg: "bg-accent-300", text: "text-accent-900" },
                  { name: "400", hex: "#fb923c", bg: "bg-accent-400", text: "text-white" },
                  { name: "500", hex: "#f97316", bg: "bg-accent-500", text: "text-white", border: true },
                  { name: "600", hex: "#ea580c", bg: "bg-accent-600", text: "text-white" },
                  { name: "700", hex: "#c2410c", bg: "bg-accent-700", text: "text-white" },
                  { name: "800", hex: "#9a3412", bg: "bg-accent-800", text: "text-white" },
                ].map((c) => (
                  <div key={c.name} className="flex flex-col gap-2">
                    <div className={`h-20 rounded-2xl ${c.bg} ${c.border ? "ring-4 ring-accent-500/30" : ""} shadow-xs flex items-end p-2.5`}>
                      <span className={`text-xs font-black ${c.text}`}>{c.name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-ink-500 text-center">{c.hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ink Grays */}
            <div className="bg-white rounded-3xl p-8 border border-ink-100 shadow-sm">
              <h2 className="font-heading font-black text-xl text-ink-950 mb-2">גווני אפור ורקעים (Ink Scale)</h2>
              <p className="text-sm text-ink-500 mb-6 font-medium">לטקסטים, גבולות, משטחי קריאה ורקעים כהים/בהירים.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-11 gap-3">
                {[
                  { name: "50", hex: "#f6f7f9", bg: "bg-ink-50", text: "text-ink-900" },
                  { name: "100", hex: "#eceef2", bg: "bg-ink-100", text: "text-ink-900" },
                  { name: "200", hex: "#d4d9e1", bg: "bg-ink-200", text: "text-ink-900" },
                  { name: "300", hex: "#aeb6c4", bg: "bg-ink-300", text: "text-ink-900" },
                  { name: "400", hex: "#8290a3", bg: "bg-ink-400", text: "text-white" },
                  { name: "500", hex: "#627188", bg: "bg-ink-500", text: "text-white" },
                  { name: "600", hex: "#4d5a6e", bg: "bg-ink-600", text: "text-white" },
                  { name: "700", hex: "#3f4959", bg: "bg-ink-700", text: "text-white" },
                  { name: "800", hex: "#363e4b", bg: "bg-ink-800", text: "text-white" },
                  { name: "900", hex: "#1e2531", bg: "bg-ink-900", text: "text-white" },
                  { name: "950", hex: "#12171f", bg: "bg-ink-950", text: "text-white" },
                ].map((c) => (
                  <div key={c.name} className="flex flex-col gap-2">
                    <div className={`h-20 rounded-2xl ${c.bg} shadow-xs flex items-end p-2.5 border border-ink-200/40`}>
                      <span className={`text-xs font-black ${c.text}`}>{c.name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-ink-500 text-center">{c.hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shadows & Radii */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl p-8 border border-ink-100 shadow-sm">
                <h3 className="font-heading font-black text-lg text-ink-950 mb-4">רדיוסי פינות (Border Radii)</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-ink-50 rounded-lg border border-ink-200 text-xs font-bold">rounded-lg (8px)</div>
                  <div className="p-4 bg-ink-50 rounded-2xl border border-ink-200 text-xs font-bold">rounded-2xl (16px)</div>
                  <div className="p-4 bg-ink-50 rounded-[2rem] border border-ink-200 text-xs font-bold">rounded-[2rem] (32px)</div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-ink-100 shadow-sm">
                <h3 className="font-heading font-black text-lg text-ink-950 mb-4">צלליות (Shadow Tokens)</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-white rounded-2xl shadow-soft border border-ink-100/60 text-xs font-bold">shadow-soft</div>
                  <div className="p-4 bg-white rounded-2xl shadow-elevated border border-ink-100/60 text-xs font-bold">shadow-elevated</div>
                  <div className="p-4 bg-primary-500 text-white rounded-2xl shadow-glow text-xs font-bold">shadow-glow</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TYPOGRAPHY TAB */}
        {activeTab === "typography" && (
          <section className="bg-white rounded-3xl p-8 border border-ink-100 shadow-sm space-y-8 animate-fade-in">
            <div>
              <h2 className="font-heading font-black text-2xl text-ink-950 mb-1">סולמות גופנים (Typography Scale)</h2>
              <p className="text-sm text-ink-500 font-medium">כותרות בגופן Rubik, טקסט רץ בגופן Assistant.</p>
            </div>

            <div className="space-y-6 divide-y divide-ink-100">
              <div className="pt-4 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                <span className="text-xs font-mono text-ink-400">H1 (Hero) · 48-60px · font-black</span>
                <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl text-ink-950">
                  חיבור אנושי אמיתי, <span className="text-primary-500">מכל מקום</span>
                </h1>
              </div>

              <div className="pt-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                <span className="text-xs font-mono text-ink-400">H2 (Section) · 32-40px · font-black</span>
                <h2 className="font-heading font-black text-3xl md:text-4xl text-ink-950">
                  שיח פתוח ואמיתי, בלי אג'נדות נסתרות.
                </h2>
              </div>

              <div className="pt-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                <span className="text-xs font-mono text-ink-400">H3 (Card Title) · 24px · font-extrabold</span>
                <h3 className="font-heading font-extrabold text-2xl text-ink-900">
                  שאלות ותשובות נפוצות על המיזם
                </h3>
              </div>

              <div className="pt-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                <span className="text-xs font-mono text-ink-400">Body Large · 18px · font-medium</span>
                <p className="text-lg text-ink-600 font-medium max-w-2xl leading-relaxed">
                  הלימוד מתקיים פעם בשבוע בשיחה טלפונית נעימה ומכבדת, מותאם בדיוק לקצב ולנושאים שמעניינים אתכם.
                </p>
              </div>

              <div className="pt-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                <span className="text-xs font-mono text-ink-400">Body Base · 16px · font-normal</span>
                <p className="text-base text-ink-600 max-w-2xl leading-relaxed">
                  כל פונה מקבל מענה אישי ומותאם על ידי צוות המתנדבים המסור שלנו. הפרטים שלכם נשמרים בדיסקרטיות מלאה.
                </p>
              </div>

              <div className="pt-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                <span className="text-xs font-mono text-ink-400">Small / Caption · 14px · font-bold</span>
                <p className="text-sm font-bold text-ink-500">
                  * ההצטרפות הינה ללא עלות ובהתנדבות מלאה
                </p>
              </div>
            </div>
          </section>
        )}

        {/* BUTTONS TAB */}
        {activeTab === "buttons" && (
          <section className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 border border-ink-100 shadow-sm space-y-6">
              <h2 className="font-heading font-black text-2xl text-ink-950 mb-4">כפתורים (Button Styles & States)</h2>

              <div className="flex flex-wrap gap-4 items-center">
                {/* Primary */}
                <button className="px-6 py-3.5 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-base shadow-sm hover:shadow-md transition-all">
                  כפתור ראשי (Primary)
                </button>

                {/* Gradient */}
                <button className="px-7 py-3.5 rounded-2xl bg-gradient-to-l from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-black text-base shadow-lg shadow-primary-500/25 hover:-translate-y-0.5 transition-all">
                  כפתור גרדיאנט בולט
                </button>

                {/* Secondary */}
                <button className="px-6 py-3.5 rounded-2xl bg-ink-100 hover:bg-ink-200 text-ink-800 font-bold text-base transition-colors">
                  כפתור משני (Secondary)
                </button>

                {/* Outline */}
                <button className="px-6 py-3.5 rounded-2xl border-2 border-primary-500 text-primary-600 hover:bg-primary-50 font-bold text-base transition-all">
                  כפתור קו (Outline)
                </button>

                {/* WhatsApp */}
                <button className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base shadow-sm flex items-center gap-2 transition-all">
                  <i className="fab fa-whatsapp text-lg"></i>
                  <span>וואטסאפ</span>
                </button>

                {/* Disabled */}
                <button disabled className="px-6 py-3.5 rounded-2xl bg-ink-200 text-ink-400 font-bold text-base cursor-not-allowed">
                  מנוטרל (Disabled)
                </button>

                {/* Loading */}
                <button disabled className="px-6 py-3.5 rounded-2xl bg-primary-500 text-white font-bold text-base flex items-center gap-2 opacity-80 cursor-wait">
                  <i className="fas fa-circle-notch fa-spin"></i>
                  <span>שולח...</span>
                </button>
              </div>
            </div>

            {/* Badges and Chips */}
            <div className="bg-white rounded-3xl p-8 border border-ink-100 shadow-sm space-y-4">
              <h3 className="font-heading font-black text-xl text-ink-950 mb-4">תגיות וסטטוסים (Badges & Statuses)</h3>

              <div className="flex flex-wrap gap-3 items-center">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <i className="fas fa-check-circle mr-1"></i> טופלה בהצלחה
                </span>
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <i className="fas fa-clock mr-1"></i> בטיפול
                </span>
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-200">
                  <i className="fas fa-sparkles mr-1"></i> פנייה חדשה
                </span>
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  <i className="fas fa-trash-alt mr-1"></i> סל מיחזור
                </span>
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-ink-100 text-ink-700">
                  טיוטה
                </span>
              </div>
            </div>
          </section>
        )}

        {/* FORMS TAB */}
        {activeTab === "forms" && (
          <section className="bg-white rounded-3xl p-8 border border-ink-100 shadow-sm space-y-8 animate-fade-in max-w-2xl">
            <div>
              <h2 className="font-heading font-black text-2xl text-ink-950 mb-1">שדות קלט וטפסים (Form Controls)</h2>
              <p className="text-sm text-ink-500 font-medium">השדות התקניים של מערכת הניהול והאתר.</p>
            </div>

            <div className="space-y-5">
              {/* Text Input with Icon */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-ink-800">שם מלא (עם אייקון)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-ink-400">
                    <i className="fas fa-user"></i>
                  </div>
                  <input
                    type="text"
                    defaultValue="ישראל ישראלי"
                    className="w-full bg-ink-50 focus:bg-white border-2 border-transparent focus:border-primary-400 rounded-2xl pr-12 pl-4 py-3.5 text-ink-900 font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
                  />
                </div>
              </div>

              {/* Select */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-ink-800">בחירה מתוך רשימה (Select)</label>
                <div className="relative">
                  <select
                    defaultValue="gemara"
                    className="w-full bg-ink-50 focus:bg-white border-2 border-transparent focus:border-primary-400 rounded-2xl px-4 py-3.5 text-ink-900 font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all appearance-none cursor-pointer"
                  >
                    <option value="parasha">פרשת שבוע</option>
                    <option value="gemara">גמרא / תלמוד</option>
                    <option value="halacha">הלכה ומשפט עברי</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-ink-400">
                    <i className="fas fa-chevron-down text-sm"></i>
                  </div>
                </div>
              </div>

              {/* Stepper */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-ink-800">פקד מספר (Stepper)</label>
                <div className="inline-flex items-center gap-3 bg-ink-50 p-2 rounded-2xl border border-ink-200">
                  <button 
                    onClick={() => setStepperValue((v) => Math.max(0, v - 1))}
                    className="w-9 h-9 rounded-xl bg-white text-ink-700 font-bold shadow-xs hover:bg-ink-100 flex items-center justify-center transition-colors"
                  >
                    <i className="fas fa-minus text-xs"></i>
                  </button>
                  <span className="font-heading font-black text-lg text-ink-950 w-12 text-center">{stepperValue}</span>
                  <button 
                    onClick={() => setStepperValue((v) => v + 1)}
                    className="w-9 h-9 rounded-xl bg-white text-ink-700 font-bold shadow-xs hover:bg-ink-100 flex items-center justify-center transition-colors"
                  >
                    <i className="fas fa-plus text-xs"></i>
                  </button>
                </div>
              </div>

              {/* Switch Toggle */}
              <div className="flex items-center justify-between p-4 bg-ink-50 rounded-2xl border border-ink-100">
                <div>
                  <span className="block text-sm font-bold text-ink-900">מוצג באתר (סטטוס מפורסם)</span>
                  <span className="text-xs text-ink-500">האם השאלה גלויה לגולשים באקורדיון</span>
                </div>
                <button
                  type="button"
                  onClick={() => setToggleState(!toggleState)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out relative ${
                    toggleState ? "bg-primary-500" : "bg-ink-300"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                      toggleState ? "-translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>

              {/* Textarea */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-ink-800">הערות פנימיות (Textarea)</label>
                <textarea
                  rows={3}
                  defaultValue="הפונה מעוניין בלימוד בשעות הערב בימי שלישי."
                  className="w-full bg-ink-50 focus:bg-white border-2 border-transparent focus:border-primary-400 rounded-2xl p-4 text-ink-900 font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all resize-none"
                ></textarea>
              </div>
            </div>
          </section>
        )}

        {/* CARDS & CONTAINERS TAB */}
        {activeTab === "cards" && (
          <section className="space-y-8 animate-fade-in">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Elevated Card */}
              <div className="bg-white rounded-3xl p-8 border border-ink-100 shadow-elevated">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center text-xl mb-5">
                  <i className="fas fa-shield-halved"></i>
                </div>
                <h3 className="font-heading font-black text-xl text-ink-950 mb-2">כרטיס מורם (Elevated)</h3>
                <p className="text-sm text-ink-600 font-medium leading-relaxed">
                  כרטיס קלאסי בעל עומק רך של shadow-elevated המשמש לתיבות מידע מרכזיות ומודלים.
                </p>
              </div>

              {/* Glassmorphic Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-soft">
                <div className="w-12 h-12 rounded-2xl bg-accent-50 text-accent-600 flex items-center justify-center text-xl mb-5">
                  <i className="fas fa-wand-magic-sparkles"></i>
                </div>
                <h3 className="font-heading font-black text-xl text-ink-950 mb-2">כרטיס זכוכית (Glass)</h3>
                <p className="text-sm text-ink-600 font-medium leading-relaxed">
                  רקע שקוף חלקית עם טשטוש זכוכית (Backdrop Blur), פופולרי באזורי נחיתה וטפסים מודרניים.
                </p>
              </div>

              {/* Dark Container */}
              <div className="bg-ink-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl"></div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-primary-400 flex items-center justify-center text-xl mb-5 relative z-10">
                  <i className="fas fa-moon"></i>
                </div>
                <h3 className="font-heading font-black text-xl text-white mb-2 relative z-10">מכולה כהה (Dark Section)</h3>
                <p className="text-sm text-ink-300 font-medium leading-relaxed relative z-10">
                  קונטיינר עמוק לסקשנים דרמטיים עם גוני כחול זוהרים וניגודיות מלאה.
                </p>
              </div>
            </div>

            {/* Accordion FAQ Preview */}
            <div className="bg-white rounded-3xl p-8 border border-ink-100 shadow-sm max-w-3xl">
              <h3 className="font-heading font-black text-xl text-ink-950 mb-4">תצוגת רכיב אקורדיון (FAQ Preview)</h3>
              
              <div className="border border-ink-200 rounded-2xl overflow-hidden transition-all">
                <button
                  onClick={() => setAccordionOpen(!accordionOpen)}
                  className="w-full p-5 bg-ink-50/60 hover:bg-ink-100/50 flex items-center justify-between text-right font-heading font-bold text-ink-900 transition-colors"
                >
                  <span className="text-base">האם השירות כרוך בתשלום כלשהו?</span>
                  <i className={`fas fa-chevron-down text-sm text-primary-500 transform transition-transform duration-200 ${
                    accordionOpen ? "rotate-180" : ""
                  }`}></i>
                </button>
                {accordionOpen && (
                  <div className="p-5 bg-white text-ink-600 text-sm font-medium leading-relaxed border-t border-ink-100">
                    לא, המיזם הינו יוזמה התנדבותית מלאה שמטרתה לחבר ולבנות גשרים בעם ישראל. הלימוד והשיחות ניתנים באהבה וללא כל תמורה.
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
