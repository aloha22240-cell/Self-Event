import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenLookup?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLookup, onOpenAdmin }) => {
  return (
    <footer className="bg-[#F2ECE1] border-t border-[#E5DACB] text-[#69594C] pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-brand text-2xl font-bold text-[#352B23]">
                MONGLE DAY
              </span>
              <span className="text-sm font-medium text-[#7D6B5D]">몽글데이</span>
            </div>
            <p className="text-sm text-[#6C5B4E] leading-relaxed max-w-md">
              소중한 우리 아이의 첫 순간, 복잡한 준비 없이 집에서도 호텔 연회장 부럽지 않은 프리미엄 감성 테이블을 만듭니다. 안심 소독과 왕복 무료 배송으로 가장 편안한 하루를 약속합니다.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#8A7565]">
              <ShieldCheck className="w-4 h-4 text-[#C98A72]" />
              <span>100% 안심 소독 인증 · 파손/오염 안심 케어 보증</span>
            </div>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="font-brand text-base font-bold text-[#352B23] mb-3">
              고객센터 안내
            </h4>
            <p className="text-xl font-bold text-[#C98A72] tabular-nums mb-1">
              070-8095-2311
            </p>
            <p className="text-xs text-[#7B6A5D] leading-relaxed">
              운영 시간: 매일 09:00 ~ 21:00
              <br />
              (주말 및 공휴일 실시간 상담 가능)
              <br />
              이메일: contact@mongleday.kr
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-brand text-base font-bold text-[#352B23] mb-3">
              대여 가이드
            </h4>
            <ul className="text-xs space-y-2 text-[#736355]">
              <li>
                <a href="#recommend" className="hover:text-[#352B23]">이분들께 추천해요</a>
              </li>
              <li>
                <a href="#rental-process" className="hover:text-[#352B23]">대여 절차 및 배송/반납 안내</a>
              </li>
              <li>
                <a href="#featured-sample" className="hover:text-[#352B23]">시그니처 온유 풀세트</a>
              </li>
              <li>
                <a href="#why-mongle" className="hover:text-[#352B23]">셀프 · 가성비 · 감성 디자인</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#352B23]">자주 묻는 질문</a>
              </li>
              {onOpenLookup && (
                <li>
                  <button
                    onClick={onOpenLookup}
                    className="text-[#C98A72] font-semibold hover:underline cursor-pointer"
                  >
                    실시간 내 주문 조회
                  </button>
                </li>
              )}
              {onOpenAdmin && (
                <li className="pt-2 border-t border-[#E5DACB]">
                  <button
                    onClick={onOpenAdmin}
                    className="text-xs text-[#8A7665] hover:text-[#382E25] cursor-pointer"
                  >
                    관리자 주문 관리 대시보드
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 border-t border-[#E5DACB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8E7C6F] gap-4">
          <p>© 2026 MONGLE DAY. All rights reserved. 프리미엄 백일상 · 돌상 대여 전문 브랜드.</p>
          <div className="flex items-center gap-1 text-[#8E7C6F]">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#C98A72] fill-current" />
            <span>for baby's first milestones</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
