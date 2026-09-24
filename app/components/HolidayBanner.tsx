"use client";

import { usePathname } from "next/navigation";
import holidayData from "../data/holiday.json";

export default function HolidayBanner() {
  const pathname = usePathname();
  if (!holidayData || !holidayData.active || pathname === "/study") return null;

  return (
    <div className="selection:bg-white/30 selection:text-white bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 text-white relative overflow-hidden shadow-md">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
      <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white/20 to-transparent skew-x-12 transform origin-top"></div>
      
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 text-center sm:text-right">
          <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm shadow-inner">
            <i className="fas fa-star text-yellow-300"></i>
            <span>מתכוננים ל{holidayData.hebrewName}</span>
          </div>
          
          <p className="text-sm md:text-base font-medium">
            {holidayData.message}
          </p>
        </div>
      </div>
    </div>
  );
}
