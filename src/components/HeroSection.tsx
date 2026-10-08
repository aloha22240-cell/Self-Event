import React from 'react';
import { ArrowDown, CheckCircle2, HeartHandshake, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { AuthUser } from './AuthModal';

interface HeroSectionProps {
  onOpenOrder: () => void;
  onOpenInquiry: () => void;
  currentUser?: AuthUser | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenOrder, currentUser }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
      {/* Background gentle pastel glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10 opacity-70">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#FBECE3] rounded-full blur-3xl" />
        <div className="absolute top-32 right-1/4 w-96 h-96 bg-[#F4EDE2] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Welcome Notice if logged in */}
        {currentUser && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF0E8] border border-[#E8D4C5] text-sm sm:text-base font-bold text-[#A56752] shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#C98A72]" />
              <span>
                <strong className="text-[#884B36]">{currentUser.name}</strong>님 환영합니다.
              </span>
              <span className="text-xs font-normal text-[#8A7665]">회원 전용 무료 한복 혜택이 적용됩니다</span>
            </div>
          </div>
        )}

        {/* Brand Kicker */}
        <div className="text-center mb-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#F3EBE1] text-[#8C6D58] text-sm md:text-base font-semibold tracking-wide">
            감성 백일상 · 돌상 프리미엄 셀프 대여
          </span>
        </div>

        {/* Top Brand Name Prominently Displayed */}
        <div className="text-center mb-6">
          <h1 className="font-brand text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#352B23] tracking-tight leading-tight">
            MONGLE DAY <span className="text-[#C98A72]">(몽글데이)</span>
          </h1>
          <p className="mt-4 text-xl sm:text-2xl md:text-3xl font-medium text-[#5E5145] max-w-3xl mx-auto text-balance leading-relaxed">
            가장 소중한 우리 아이의 첫 기념일,
            <br className="hidden sm:inline" />
            <span className="text-[#C98A72] font-semibold"> 15분 만에 완성하는 호텔급 감성 상차림</span>
          </p>
        </div>

        {/* 3 Core Value Pill Highlights (셀프 이벤트 / 가성비 / 고급스러운 디자인) */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-[#EBE2D5] shadow-xs text-sm sm:text-base font-semibold text-[#52453A]">
            <Sparkles className="w-4 h-4 text-[#C98A72]" />
            <span>누구나 쉬운 셀프 이벤트</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-[#EBE2D5] shadow-xs text-sm sm:text-base font-semibold text-[#52453A]">
            <HeartHandshake className="w-4 h-4 text-[#C98A72]" />
            <span>호텔 대비 1/10 압도적 가성비</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-[#EBE2D5] shadow-xs text-sm sm:text-base font-semibold text-[#52453A]">
            <ShieldCheck className="w-4 h-4 text-[#C98A72]" />
            <span>수제 원목 & 단아한 실크 디자인</span>
          </div>
        </div>

        {/* Hero Banner Showcase */}
        <div className="relative rounded-3xl overflow-hidden border border-[#EDE4D8] shadow-lg bg-[#FAF5EE] group">
          <div className="aspect-[16/9] w-full max-h-[560px] overflow-hidden relative">
            <img
              src="/assets/images/mongle_hero_table_1791342325865.jpg"
              alt="몽글데이 감성 백일상 돌상 대여 세트"
              className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            {/* Soft gradient bottom overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2F2620]/75 via-[#2F2620]/25 to-transparent flex flex-col justify-end p-6 sm:p-10 md:p-12 text-white">
              <div className="max-w-2xl">
                <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#FCEEE5] bg-white/20 backdrop-blur-md px-3 py-1 rounded-md inline-block mb-3">
                  Signature Warm Styling
                </span>
                <h2 className="font-brand text-2xl sm:text-3xl md:text-4xl font-bold leading-snug drop-shadow-sm text-balance">
                  따뜻한 햇살 아래, 평생 남을 우리 아이의 인생 첫 사진
                </h2>
                <p className="mt-2 text-sm sm:text-base md:text-lg text-[#F7ECE4] text-balance">
                  전통의 단아함과 북유럽의 내추럴함이 만나 거실 어디에 놓아도 눈부신 포토존이 됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Large Prominent Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenOrder}
            className="w-full sm:w-auto min-w-[280px] px-8 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold text-white bg-[#C98A72] hover:bg-[#B7775F] active:scale-[0.98] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>지금 대여 주문 & 날짜 확인하기</span>
            <span className="text-sm font-normal bg-black/15 px-2 py-0.5 rounded-md">무료 한복 증정</span>
          </button>
          <a
            href="#featured-sample"
            className="w-full sm:w-auto min-w-[220px] px-8 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-semibold text-[#5A4B3F] bg-[#F2ECE1] hover:bg-[#EAE2D5] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>샘플 및 가격 보기</span>
            <ArrowDown className="w-5 h-5 text-[#8C7462]" />
          </a>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 pt-6 border-t border-[#EDE4D8]/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm sm:text-base text-[#615245]">
            <Truck className="w-5 h-5 text-[#C98A72] shrink-0" />
            <span className="font-medium">왕복 택배비 100% 무료</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm sm:text-base text-[#615245]">
            <ShieldCheck className="w-5 h-5 text-[#C98A72] shrink-0" />
            <span className="font-medium">100% UV 살균 & 세탁 완료</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm sm:text-base text-[#615245]">
            <CheckCircle2 className="w-5 h-5 text-[#C98A72] shrink-0" />
            <span className="font-medium">행사 2~3일 전 안심 도착</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm sm:text-base text-[#615245]">
            <Sparkles className="w-5 h-5 text-[#C98A72] shrink-0" />
            <span className="font-medium">고급 아기 한복 1벌 무료 대여</span>
          </div>
        </div>
      </div>
    </section>
  );
};
