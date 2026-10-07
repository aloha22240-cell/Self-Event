import React from 'react';
import { VALUE_PROPOSITIONS } from '../data/rentalData';
import { Sparkles, PiggyBank, Crown, Check, ArrowRight } from 'lucide-react';

interface KeyValuesSectionProps {
  onOpenOrder: () => void;
}

const ICONS = [Sparkles, PiggyBank, Crown];

export const KeyValuesSection: React.FC<KeyValuesSectionProps> = ({ onOpenOrder }) => {
  return (
    <section id="why-mongle" className="py-16 md:py-24 border-t border-[#EDE3D6]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#EFE5D7] text-[#8C6D58] text-sm md:text-base font-semibold mb-3">
            3 CORE PROMISES
          </span>
          <h2 className="font-brand text-3xl sm:text-4xl md:text-5xl font-bold text-[#352B23] tracking-tight leading-snug">
            몽글데이를 선택해야 하는 3가지 이유
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-[#67574A] font-normal leading-relaxed text-balance">
            셀프 이벤트의 편안함, 부담 없는 가성비, 그리고 사진을 압도하는 고급스러운 디자인까지.
            <br className="hidden sm:inline" />
            단 한 번뿐인 소중한 날, 부모님의 마음에 딱 맞춰 설계했습니다.
          </p>
        </div>

        {/* 3 Core Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {VALUE_PROPOSITIONS.map((val, idx) => {
            const IconComp = ICONS[idx];
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-[#EDE2D4] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#F6EDE3] text-[#C98A72] flex items-center justify-center mb-6">
                    <IconComp className="w-7 h-7" />
                  </div>

                  <span className="text-xs font-bold text-[#A56752] tracking-widest uppercase block mb-2">
                    {val.subtitle}
                  </span>

                  <h3 className="font-brand text-2xl font-bold text-[#352B22] mb-3 leading-snug">
                    {val.title}
                  </h3>

                  <p className="text-base text-[#655547] leading-relaxed mb-6 font-normal">
                    {val.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#F1E9DE] space-y-3">
                  {val.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#F3ECE2] flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-[#C98A72]" />
                      </div>
                      <span className="text-sm sm:text-base font-medium text-[#4D4036]">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Big Banner CTA */}
        <div className="bg-gradient-to-r from-[#FAF3EA] via-[#F6ECE0] to-[#FAF3EA] rounded-3xl p-8 sm:p-10 border border-[#E8D7C4] text-center max-w-4xl mx-auto shadow-sm">
          <h3 className="font-brand text-2xl sm:text-3xl font-bold text-[#352A20] mb-3">
            호텔보다 편안하고 스튜디오보다 따뜻한 우리 집 셀프 파티
          </h3>
          <p className="text-base sm:text-lg text-[#6C5B4E] mb-6 max-w-2xl mx-auto">
            망설이지 마시고 원하는 행사 날짜의 잔여 수량을 지금 확인해 보세요.
          </p>
          <button
            onClick={onOpenOrder}
            className="px-10 py-5 rounded-2xl bg-[#C98A72] hover:bg-[#B7775F] text-white font-bold text-lg sm:text-xl shadow-md hover:shadow-lg transition-all inline-flex items-center gap-3 cursor-pointer"
          >
            <span>지금 대여 예약하기</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
