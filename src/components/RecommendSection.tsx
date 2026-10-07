import React from 'react';
import { RECOMMEND_TARGETS } from '../data/rentalData';
import { Check, Heart, Sparkles, Users } from 'lucide-react';

interface RecommendSectionProps {
  onOpenOrder: () => void;
}

export const RecommendSection: React.FC<RecommendSectionProps> = ({ onOpenOrder }) => {
  return (
    <section id="recommend" className="py-16 md:py-24 bg-[#F8F4ED]/60 border-y border-[#EDE3D6]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE6DA] text-[#856752] text-sm md:text-base font-semibold mb-3">
            <Heart className="w-4 h-4 text-[#C98A72]" />
            <span>FOR SPECIAL MOMENTS</span>
          </div>
          <h2 className="font-brand text-3xl sm:text-4xl md:text-5xl font-bold text-[#352B23] tracking-tight leading-snug">
            이분들께 추천해요
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-[#67574A] font-normal leading-relaxed text-balance">
            소중한 일상, 우리 아이의 첫 백일과 돌잔치를 앞두신 모든 부모님께
            <br className="hidden sm:inline" />
            몽글데이가 가장 편안하고 감동적인 하루를 선물합니다.
          </p>
        </div>

        {/* 4 Recommend Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {RECOMMEND_TARGETS.map((item, index) => {
            return (
              <div
                key={item.id}
                className="bg-white/90 rounded-3xl p-7 sm:p-9 border border-[#EBE1D3] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs sm:text-sm font-bold tracking-widest text-[#B5735B] uppercase bg-[#FAF1EB] px-3 py-1 rounded-full">
                      {item.badge}
                    </span>
                    <span className="text-base font-bold text-[#A8988B]">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="font-brand text-2xl sm:text-2xl font-bold text-[#382E25] mb-3 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-base sm:text-lg text-[#655547] leading-relaxed mb-6 font-normal">
                    {item.desc}
                  </p>
                </div>

                {/* Bullet Points */}
                <div className="pt-5 border-t border-[#F0E8DD] space-y-2.5">
                  {item.bulletPoints.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#F4ECE2] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-[#C98A72]" />
                      </div>
                      <span className="text-sm sm:text-base text-[#4E4136] font-medium leading-snug">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout Banner */}
        <div className="mt-12 md:mt-16 bg-[#F3ECE1] rounded-3xl p-6 sm:p-8 border border-[#E4D7C7] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-brand text-xl sm:text-2xl font-bold text-[#3A2F25]">
              우리 아이에게 평생 기억될 단 하루의 상차림
            </h4>
            <p className="text-sm sm:text-base text-[#6B5A4D]">
              외출 없이 집에서, 편안한 컨디션으로 가장 자연스러운 웃는 얼굴을 남겨주세요.
            </p>
          </div>
          <button
            onClick={onOpenOrder}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#C98A72] text-white font-bold text-base hover:bg-[#B7775F] active:scale-[0.98] transition-all shadow-xs shrink-0 cursor-pointer"
          >
            대여 신청하기
          </button>
        </div>
      </div>
    </section>
  );
};
