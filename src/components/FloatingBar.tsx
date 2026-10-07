import React from 'react';
import { Calendar, PhoneCall, Gift, Truck } from 'lucide-react';
import { FEATURED_SAMPLE } from '../data/rentalData';

interface FloatingBarProps {
  onOpenOrder: () => void;
  onOpenInquiry: () => void;
  onOpenLookup?: () => void;
  onOpenAdmin?: () => void;
}

export const FloatingBar: React.FC<FloatingBarProps> = ({
  onOpenOrder,
  onOpenInquiry,
  onOpenLookup,
  onOpenAdmin,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8DFC8] py-3 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left price info - hidden on very tiny screens */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white bg-[#C98A72] px-2 py-0.5 rounded">
              39% 특가
            </span>
            <span className="font-brand text-xl font-bold text-[#352B21] tabular-nums">
              {FEATURED_SAMPLE.salePrice.toLocaleString()}원
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#7B6A5C]">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#C98A72]" /> 왕복 무료배송
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Gift className="w-3.5 h-3.5 text-[#C98A72]" /> 무료 한복 대여
            </span>
          </div>
        </div>

        {/* Buttons right / full on mobile */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="px-3.5 py-3 rounded-2xl bg-[#3A3026] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="판매자 주문관리"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>주문관리</span>
            </button>
          )}
          <button
            onClick={onOpenInquiry}
            className="hidden xs:flex px-3.5 py-3 rounded-2xl bg-[#EFE7DC] hover:bg-[#E5DCCF] text-[#5C4D40] font-semibold text-xs sm:text-sm items-center justify-center gap-1 transition-colors cursor-pointer shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#C98A72]" />
            <span>문의</span>
          </button>
          <button
            onClick={onOpenOrder}
            className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-[#C98A72] hover:bg-[#B7775F] active:scale-[0.98] text-white font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
          >
            <Calendar className="w-4 h-4" />
            <span>주문하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
