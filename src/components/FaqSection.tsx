import React, { useState } from 'react';
import { FAQS } from '../data/rentalData';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE5D7] text-[#8C6D58] text-sm md:text-base font-semibold mb-3">
            <HelpCircle className="w-4 h-4 text-[#C98A72]" />
            <span>FAQ</span>
          </div>
          <h2 className="font-brand text-3xl sm:text-4xl md:text-5xl font-bold text-[#352B23] tracking-tight leading-snug">
            자주 묻는 질문
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#6C5B4E]">
            대여 전 궁금하신 점들을 명쾌하게 정리해 드립니다.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#EDE2D4] overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-brand text-lg sm:text-xl font-bold text-[#352A20] hover:text-[#C98A72] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-[#C98A72] font-mono text-base">Q.</span>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#8F7D70] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#C98A72]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-sm sm:text-base text-[#615245] leading-relaxed border-t border-[#F3ECE2] pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
