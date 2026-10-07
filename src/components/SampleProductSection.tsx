import React, { useState } from 'react';
import { FEATURED_SAMPLE } from '../data/rentalData';
import { CheckCircle2, Gift, Sparkles, Truck, ShieldCheck, Heart, ChevronRight, Layers } from 'lucide-react';

interface SampleProductSectionProps {
  onOpenOrder: () => void;
}

export const SampleProductSection: React.FC<SampleProductSectionProps> = ({ onOpenOrder }) => {
  const [activeTab, setActiveTab] = useState<'benefits' | 'items'>('benefits');
  const [selectedCelebration, setSelectedCelebration] = useState<'baekil' | 'dol'>('baekil');

  return (
    <section id="featured-sample" className="py-16 md:py-24 bg-[#FAF5EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#EFE4D6] text-[#8C6D58] text-sm md:text-base font-semibold mb-3">
            BEST SIGNATURE RENTAL SET
          </span>
          <h2 className="font-brand text-3xl sm:text-4xl md:text-5xl font-bold text-[#352B23] tracking-tight leading-snug">
            몽글데이 대표 샘플 & 대여 가격
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-[#67574A] font-normal leading-relaxed text-balance">
            단 하나의 풀세트로 완성되는 우리 아이 최고의 날.
            <br className="hidden sm:inline" />
            별도 추가 비용 없이 모든 필수 소품과 한복까지 모두 담았습니다.
          </p>
        </div>

        {/* Celebration Toggle (백일상 vs 첫돌상) */}
        <div className="flex justify-center mb-10">
          <div className="p-1.5 bg-[#EDE2D4] rounded-2xl flex items-center gap-1 shadow-inner max-w-md w-full sm:w-auto">
            <button
              onClick={() => setSelectedCelebration('baekil')}
              className={`flex-1 sm:px-8 py-3 rounded-xl font-bold text-base sm:text-lg transition-all cursor-pointer ${
                selectedCelebration === 'baekil'
                  ? 'bg-white text-[#382E25] shadow-xs'
                  : 'text-[#7D6B5D] hover:text-[#382E25]'
              }`}
            >
              백일상 (100일) 세트
            </button>
            <button
              onClick={() => setSelectedCelebration('dol')}
              className={`flex-1 sm:px-8 py-3 rounded-xl font-bold text-base sm:text-lg transition-all cursor-pointer ${
                selectedCelebration === 'dol'
                  ? 'bg-white text-[#382E25] shadow-xs'
                  : 'text-[#7D6B5D] hover:text-[#382E25]'
              }`}
            >
              첫돌상 (1st Birthday) 세트
            </button>
          </div>
        </div>

        {/* Featured Sample Card Container */}
        <div className="bg-white rounded-3xl sm:rounded-[32px] border border-[#E9DFD2] shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Column: Big Product Image Showcase */}
            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-[#FCFAF7] border-b lg:border-b-0 lg:border-r border-[#EFE5D8]">
              <div>
                <div className="relative rounded-2xl overflow-hidden border border-[#EAE0D3] shadow-sm mb-6 aspect-[4/3]">
                  <img
                    src={FEATURED_SAMPLE.image}
                    alt={FEATURED_SAMPLE.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold text-[#A56752] border border-[#EFE5DB] shadow-xs">
                    {selectedCelebration === 'baekil' ? '100일 백일상 특화' : '첫돌 12종 돌잡이 세트 무료'}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg">
                    실제 대여 고객 사진
                  </div>
                </div>

                {/* Selling Point Badges on Left */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 bg-white rounded-xl border border-[#EDE3D6]">
                    <span className="block text-xs text-[#8C7665]">셀프 세팅</span>
                    <span className="font-bold text-sm sm:text-base text-[#382E25]">단 15분 완성</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#EDE3D6]">
                    <span className="block text-xs text-[#8C7665]">소독 상태</span>
                    <span className="font-bold text-sm sm:text-base text-[#382E25]">100% UV 살균</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#EDE3D6]">
                    <span className="block text-xs text-[#8C7665]">왕복 배송</span>
                    <span className="font-bold text-sm sm:text-base text-[#C98A72]">무료 배송/수거</span>
                  </div>
                </div>
              </div>

              {/* Notice below image */}
              <div className="mt-6 pt-5 border-t border-[#EFE5D8] flex items-center justify-between text-xs sm:text-sm text-[#7D6B5E]">
                <span>전국 택배 발송 가능 (도서산간 제외)</span>
                <span className="font-semibold text-[#B87057]">행사 2~3일 전 도착 보장</span>
              </div>
            </div>

            {/* Right Column: Pricing, Specs, and Big Order Button */}
            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                {/* Title & Subtitle */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2 text-xs sm:text-sm font-bold tracking-wider text-[#B87057] uppercase">
                    <Sparkles className="w-4 h-4" />
                    <span>PREMIUM ALL-IN-ONE RENTAL</span>
                  </div>
                  <h3 className="font-brand text-2xl sm:text-3xl lg:text-4xl font-bold text-[#342A21] leading-tight">
                    {FEATURED_SAMPLE.name}
                  </h3>
                  <p className="mt-1.5 text-base sm:text-lg text-[#6E5D4F]">
                    {FEATURED_SAMPLE.subTitle}
                  </p>
                </div>

                {/* Price Display Block (Large typography) */}
                <div className="my-6 p-5 sm:p-6 bg-[#FAF3EC] rounded-2xl border border-[#E9DACB]">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-sm sm:text-base text-[#7C695A] font-medium">정상 대여가</span>
                    <span className="text-base sm:text-lg text-[#9C8A7C] line-through tabular-nums">
                      {FEATURED_SAMPLE.originalPrice.toLocaleString()}원
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between border-t border-[#E8D9CB] pt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-extrabold text-white bg-[#C98A72] px-2.5 py-1 rounded-md">
                        {FEATURED_SAMPLE.discountRate}% OFF
                      </span>
                      <span className="text-base sm:text-lg font-bold text-[#3E3228]">특별 혜택가</span>
                    </div>
                    <div className="text-right">
                      <span className="font-brand text-3xl sm:text-4xl lg:text-5xl font-bold text-[#352A20] tabular-nums">
                        {FEATURED_SAMPLE.salePrice.toLocaleString()}
                      </span>
                      <span className="text-xl sm:text-2xl font-bold text-[#352A20] ml-1">원</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#E8D9CB]/80 flex items-center justify-between text-xs sm:text-sm text-[#735E4E]">
                    <span className="flex items-center gap-1 font-medium">
                      <Truck className="w-4 h-4 text-[#C98A72]" /> 왕복 배송비 0원 무료
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Gift className="w-4 h-4 text-[#C98A72]" /> 명주실타래 증정
                    </span>
                  </div>
                </div>

                {/* Tab Controls for Detailed Specs */}
                <div className="flex border-b border-[#EDE2D5] mb-5">
                  <button
                    onClick={() => setActiveTab('benefits')}
                    className={`pb-3 px-4 font-bold text-sm sm:text-base transition-colors cursor-pointer ${
                      activeTab === 'benefits'
                        ? 'text-[#C98A72] border-b-2 border-[#C98A72]'
                        : 'text-[#827163] hover:text-[#382E25]'
                    }`}
                  >
                    무료 대여 혜택 (한복/돌잡이)
                  </button>
                  <button
                    onClick={() => setActiveTab('items')}
                    className={`pb-3 px-4 font-bold text-sm sm:text-base transition-colors cursor-pointer ${
                      activeTab === 'items'
                        ? 'text-[#C98A72] border-b-2 border-[#C98A72]'
                        : 'text-[#827163] hover:text-[#382E25]'
                    }`}
                  >
                    전체 구성품 목록
                  </button>
                </div>

                {/* Tab 1: Benefits */}
                {activeTab === 'benefits' && (
                  <div className="space-y-3 mb-6">
                    {FEATURED_SAMPLE.highlightPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#C98A72] shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base text-[#4C3F35] font-medium leading-snug">
                          {point}
                        </span>
                      </div>
                    ))}
                    {selectedCelebration === 'dol' && (
                      <div className="p-3.5 bg-[#FAF1EB] rounded-xl border border-[#E9DACD] text-xs sm:text-sm text-[#875543] font-medium">
                        첫돌 선택 혜택: 마패, 청진기, 판사봉, 붓, 엽전 등 12종 전통 돌잡이 용품이 기본 동봉됩니다.
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: All Items */}
                {activeTab === 'items' && (
                  <div className="space-y-3.5 mb-6 max-h-56 overflow-y-auto pr-1">
                    {FEATURED_SAMPLE.includedItems.map((cat, idx) => (
                      <div key={idx} className="bg-[#FAF6F0] p-3 rounded-xl border border-[#EDE3D6]">
                        <span className="text-xs font-bold text-[#A56752] uppercase block mb-1">
                          {cat.category}
                        </span>
                        <p className="text-xs sm:text-sm text-[#4E4136]">
                          {cat.items.join(' · ')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Big "주문하기" Button (Large Button per User Request) */}
              <div className="pt-4 border-t border-[#EFE5D8]">
                <button
                  onClick={onOpenOrder}
                  className="w-full py-5 sm:py-6 px-8 rounded-2xl bg-[#C98A72] hover:bg-[#B7775F] active:scale-[0.98] text-white font-bold text-xl sm:text-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer group"
                >
                  <span>주문하기</span>
                  <span className="text-sm sm:text-base font-normal bg-black/15 px-3 py-1 rounded-lg">
                    {selectedCelebration === 'baekil' ? '백일상 풀세트' : '첫돌상 풀세트'}
                  </span>
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-center text-xs sm:text-sm text-[#827164] mt-3">
                  행사 일정과 아기 한복 사이즈는 다음 주문서 단계에서 선택하실 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
