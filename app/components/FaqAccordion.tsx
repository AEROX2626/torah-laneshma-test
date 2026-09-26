"use client";
import { useState } from "react";

export default function FaqAccordion({ faqs }: { faqs: { q: string, a: string }[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <div key={i} className="bg-white rounded-2xl border border-ink-100 hover:border-primary-200 transition-colors overflow-hidden reveal" style={{ transitionDelay: `${i * 0.05}s` }}>
          <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="faq-toggle w-full flex items-center justify-between gap-4 text-right p-6 md:p-7">
            <span className="font-heading font-extrabold text-lg text-ink-900">{faq.q}</span>
            <i className={`fas fa-chevron-down accordion-icon text-primary-500 flex-shrink-0 ${openFaq === i ? "open" : ""}`}></i>
          </button>
          <div className={`accordion-content px-6 md:px-7 pb-6 md:pb-7 ${openFaq === i ? "open" : ""}`}>
            <p className="text-ink-600 leading-relaxed font-medium">{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
