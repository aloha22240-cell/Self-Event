import React from 'react';
import { RENTAL_STEPS } from '../data/rentalData';
import { Calendar, PackageCheck, Camera, RotateCcw, Clock, ShieldCheck, Sparkles } from 'lucide-react';

const STEP_ICONS = [Calendar, PackageCheck, Camera, RotateCcw];

export const RentalProcessSection: React.FC = () => {
  return (
    <section id="rental-process" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F3EBE1] text-[#8C6D58] text-sm md:text-base font-semibold mb-3">
            <Clock className="w-4 h-4 text-[#C98A72]" />
            <span>HOW IT WORKS</span>
          </div>
          <h2 className="font-brand text-3xl sm:text-4xl md:text-5xl font-bold text-[#352B23] tracking-tight leading-snug">
            대여 절차 한눈에 보기
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-[#67574A] font-normal leading-relaxed text-balance">
            예약부터 무료 수거까지, 부모님께서 번거롭지 않도록
            <br className="hidden sm:inline" />
            몽글데이가 모든 배송과 반납을 알아서 챙겨드립니다.
          </p>
        </div>

        {/* Visual Showcase + Process Stepper Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center mb-12">
          {/* Left: Emotional Rental Packaging Image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-[#EBE2D5] shadow-md bg-[#FAF4ED]">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src="/assets/images/mongle_rental_process_1791342407738.jpg"
                  alt="몽글데이 정성 가득한 대여 포장 패키지"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 bg-white/95 border-t border-[#EDE5DA]">
                <div className="flex items-center gap-2 text-[#C98A72] text-sm font-bold uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% 안심 소독 보증</span>
                </div>
                <h4 className="font-brand text-lg sm:text-xl font-bold text-[#3A2F26]">
                  손상 없이 꼼꼼하게 밀봉된 전용 안심 박스
                </h4>
                <p className="text-sm text-[#665749] mt-1.5 leading-relaxed">
                  모든 직물은 피톤치드 살균 후 압축 포장되며, 원목과 도자기는 완충 파우치에 개별 넘버링되어 안전하게 배송됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Step 1 to 4 Details */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            {RENTAL_STEPS.map((item, idx) => {
              const IconComp = STEP_ICONS[idx];
              return (
                <div
                  key={item.step}
                  className="bg-white/80 rounded-2xl p-5 sm:p-6 border border-[#ECE2D5] hover:border-[#DFCBB8] shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row gap-4 sm:gap-5"
                >
                  {/* Step Badge & Icon */}
                  <div className="flex items-center sm:flex-col justify-between sm:justify-start gap-2 shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-[#F6EEE5] text-[#C98A72] flex items-center justify-center font-bold text-lg">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-[#A8988B] tracking-wider uppercase">
                      STEP {item.step}
                    </span>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-2 mb-1.5">
                      <h3 className="font-brand text-xl sm:text-2xl font-bold text-[#352A21]">
                        {item.title}
                      </h3>
                      <span className="text-xs sm:text-sm font-medium text-[#A06C59] bg-[#FAF2EB] px-2.5 py-0.5 rounded-md">
                        {item.subtitle}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-[#615245] leading-relaxed mb-3">
                      {item.description}
                    </p>

                    <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#7D6B5D] bg-[#F7F2EB] px-3 py-1.5 rounded-lg border border-[#EDE4D8]">
                      <Sparkles className="w-3.5 h-3.5 text-[#C98A72] shrink-0" />
                      <span>{item.tip}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline Summary Bar */}
        <div className="bg-[#FAF4ED] border border-[#E9DDCF] rounded-3xl p-6 sm:p-8">
          <h4 className="font-brand text-lg sm:text-xl font-bold text-[#3D3227] text-center mb-6">
            주말 행사 기준 안심 배송 타임라인
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            <div className="bg-white rounded-2xl p-4 border border-[#ECE0D0] text-center">
              <span className="text-xs font-bold text-[#C98A72]">D-3 (목요일)</span>
              <p className="font-bold text-[#382D23] mt-1 text-sm sm:text-base">문 앞 안심 도착</p>
              <p className="text-xs text-[#7A6B5F] mt-1">여유 있는 소품 확인 & 사전 세팅</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#ECE0D0] text-center">
              <span className="text-xs font-bold text-[#8C7564]">D-1 (금요일)</span>
              <p className="font-bold text-[#382D23] mt-1 text-sm sm:text-base">과일 & 떡 준비</p>
              <p className="text-xs text-[#7A6B5F] mt-1">동봉된 가이드북으로 구도 확인</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#C98A72] text-center shadow-xs bg-[#FDF8F3]">
              <span className="text-xs font-bold text-[#C98A72]">D-DAY (토/일)</span>
              <p className="font-bold text-[#382D23] mt-1 text-sm sm:text-base">감성 기념 촬영</p>
              <p className="text-xs text-[#7A6B5F] mt-1">15분 세팅 후 가족과 인생샷 촬영</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#ECE0D0] text-center">
              <span className="text-xs font-bold text-[#8C7564]">D+1 (월요일)</span>
              <p className="font-bold text-[#382D23] mt-1 text-sm sm:text-base">무료 방문 수거</p>
              <p className="text-xs text-[#7A6B5F] mt-1">박스 포장 후 문 앞 보관시 자동 회수</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
