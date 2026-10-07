import React from 'react';
import { Calendar, PhoneCall, User, LogOut, Sparkles } from 'lucide-react';
import { AuthUser } from './AuthModal';

interface HeaderProps {
  currentUser: AuthUser | null;
  onOpenOrder: () => void;
  onOpenInquiry: () => void;
  onOpenLookup: () => void;
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenOrder,
  onOpenInquiry,
  onOpenLookup,
  onOpenAdmin,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DFC8]/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Brand title wordmark */}
        <a href="#" className="flex items-center gap-2 group shrink-0">
          <span className="font-brand text-2xl sm:text-3xl font-bold tracking-tight text-[#3A3027] group-hover:text-[#9E6B55] transition-colors">
            MONGLE DAY
          </span>
          <span className="text-sm sm:text-base font-medium text-[#8C7665] tracking-normal">
            몽글데이
          </span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-7 text-base font-medium text-[#65574A]">
          <a
            href="#recommend"
            className="hover:text-[#9E6B55] transition-colors py-1 hover:underline underline-offset-8 decoration-[#E0C0AE]"
          >
            이분들께 추천해요
          </a>
          <a
            href="#rental-process"
            className="hover:text-[#9E6B55] transition-colors py-1 hover:underline underline-offset-8 decoration-[#E0C0AE]"
          >
            대여 절차 안내
          </a>
          <a
            href="#featured-sample"
            className="hover:text-[#9E6B55] transition-colors py-1 hover:underline underline-offset-8 decoration-[#E0C0AE]"
          >
            대표 샘플 & 가격
          </a>
          <a
            href="#why-mongle"
            className="hover:text-[#9E6B55] transition-colors py-1 hover:underline underline-offset-8 decoration-[#E0C0AE]"
          >
            3대 특장점
          </a>
          <a
            href="#reviews"
            className="hover:text-[#9E6B55] transition-colors py-1 hover:underline underline-offset-8 decoration-[#E0C0AE]"
          >
            고객 후기
          </a>
          <a
            href="#faq"
            className="hover:text-[#9E6B55] transition-colors py-1 hover:underline underline-offset-8 decoration-[#E0C0AE]"
          >
            자주 묻는 질문
          </a>
        </nav>

        {/* Zone 3: Primary Action + User Welcome & Auth */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* User Welcome greeting when logged in */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:py-2 rounded-full bg-[#FAF0E8] border border-[#E8D4C5] text-xs sm:text-sm font-bold text-[#A56752]">
              <Sparkles className="w-3.5 h-3.5 text-[#C98A72]" />
              <span className="whitespace-nowrap font-medium text-[#382E25]">
                <strong className="text-[#C98A72] font-bold">{currentUser.name}</strong>님 환영합니다.
              </span>
              <button
                onClick={onLogout}
                title="로그아웃"
                className="text-xs text-[#8A7665] hover:text-[#382E25] underline ml-1 cursor-pointer whitespace-nowrap"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold text-[#655547] bg-[#F2ECE2] hover:bg-[#E9E0D4] transition-colors cursor-pointer whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5 text-[#A56752]" />
              <span>로그인 / 가입</span>
            </button>
          )}

          <button
            onClick={onOpenLookup}
            className="hidden md:inline-flex items-center gap-1 px-3 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium text-[#655547] hover:bg-[#F2ECE2] transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>주문 조회</span>
          </button>

          <button
            onClick={onOpenInquiry}
            className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs sm:text-sm font-medium text-[#6B5A4E] bg-[#F2ECE1] hover:bg-[#EAE2D5] transition-colors cursor-pointer whitespace-nowrap"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#C98A72]" />
            <span>실시간 문의</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-[#3A3026] hover:bg-[#4E3F32] transition-colors cursor-pointer whitespace-nowrap shadow-xs"
            title="판매자 전용 실시간 주문 관리"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>주문관리</span>
          </button>

          <button
            onClick={onOpenOrder}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-bold text-white bg-[#C98A72] hover:bg-[#B7775F] active:scale-[0.98] shadow-sm hover:shadow-md transition-all whitespace-nowrap cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>주문하기</span>
          </button>
        </div>
      </div>
    </header>
  );
};
