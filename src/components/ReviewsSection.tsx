import React from 'react';
import { CUSTOMER_REVIEWS } from '../data/rentalData';
import { Star, MessageSquareHeart, CheckCircle } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-16 md:py-24 bg-[#FAF6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE4D6] text-[#8C6D58] text-sm md:text-base font-semibold mb-3">
            <MessageSquareHeart className="w-4 h-4 text-[#C98A72]" />
            <span>REAL PARENT REVIEWS</span>
          </div>
          <h2 className="font-brand text-3xl sm:text-4xl md:text-5xl font-bold text-[#352B23] tracking-tight leading-snug">
            실제 대여 부모님들의 생생한 후기
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="flex text-[#E49942]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="text-lg font-bold text-[#362C22] tabular-nums">4.98 / 5.0</span>
            <span className="text-sm text-[#7D6B5E]">· 누적 대여 4,800+ 건 돌파</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {CUSTOMER_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl p-7 border border-[#E9DFD2] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-[#E49942]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[#8C7665] bg-[#F7F0E8] px-2.5 py-1 rounded-md">
                    {review.tag}
                  </span>
                </div>

                <h3 className="font-brand text-lg sm:text-xl font-bold text-[#352B23] mb-3 leading-snug">
                  "{review.title}"
                </h3>

                <p className="text-sm sm:text-base text-[#655547] leading-relaxed mb-6">
                  {review.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F2EBE1] flex items-center justify-between text-xs sm:text-sm text-[#7C6B5E]">
                <div className="flex items-center gap-1.5 font-medium text-[#483B31]">
                  <CheckCircle className="w-3.5 h-3.5 text-[#C98A72]" />
                  <span>{review.name}</span>
                </div>
                <span>{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
