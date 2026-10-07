import React, { useState, useEffect } from 'react';
import { X, Calendar, Check, Gift, Truck, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { FEATURED_SAMPLE } from '../data/rentalData';
import { AuthUser } from './AuthModal';
import { OrderData } from './PaymentModal';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLookup?: () => void;
  currentUser?: AuthUser | null;
  onProceedToPayment: (data: OrderData) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onProceedToPayment
}) => {
  // Form State
  const [eventType, setEventType] = useState<'baekil' | 'dol'>('baekil');
  const [eventDate, setEventDate] = useState<string>('2026-10-24');
  const [babyName, setBabyName] = useState<string>('');
  const [babyGender, setBabyGender] = useState<'boy' | 'girl'>('girl');
  const [hanbokColor, setHanbokColor] = useState<string>('살구빛 단아 핑크 한복 (무료)');
  const [addFakeRiceCake, setAddFakeRiceCake] = useState<boolean>(true);
  const [addBumboCover, setAddBumboCover] = useState<boolean>(false);
  const [addTable, setAddTable] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>(currentUser?.name || '');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [detailAddress, setDetailAddress] = useState<string>('');
  const [deliveryNote, setDeliveryNote] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (currentUser?.name && !customerName) {
      setCustomerName(currentUser.name);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  // Price calculations
  const basePrice = FEATURED_SAMPLE.salePrice;
  const extraTablePrice = addTable ? 15000 : 0;
  const extraBumboPrice = addBumboCover ? 5000 : 0;
  const totalPrice = basePrice + extraTablePrice + extraBumboPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('주문자 성함을 입력해 주세요.');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('연락처(휴대폰 번호)를 입력해 주세요.');
      return;
    }

    if (!address.trim()) {
      setErrorMessage('배송받으실 기본 주소를 입력해 주세요.');
      return;
    }

    const orderPayload: OrderData = {
      eventType,
      eventDate,
      babyName: babyName.trim(),
      babyGender,
      hanbokColor,
      addFakeRiceCake,
      addBumboCover,
      addTable,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      detailAddress: detailAddress.trim(),
      deliveryNote: deliveryNote.trim(),
      totalPrice,
    };

    onProceedToPayment(orderPayload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E8DDD0] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#FAF4ED] border-b border-[#EDE2D4] flex items-center justify-between shrink-0">
          <div>
            <span className="text-xs font-bold text-[#A56752] uppercase tracking-wider block">
              MONGLE DAY RENTAL
            </span>
            <h3 className="font-brand text-xl sm:text-2xl font-bold text-[#352B23]">
              백일상 · 돌상 대여 예약 신청
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#736356] hover:text-[#332A22] flex items-center justify-center transition-colors border border-[#E9DFD3] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentUser && (
              <div className="p-3.5 bg-[#FAF0E8] rounded-2xl border border-[#E8D4C5] text-xs sm:text-sm text-[#875543] font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C98A72] shrink-0" />
                <span>
                  <strong className="text-[#C98A72] font-bold">{currentUser.name}</strong>님 환영합니다.
                  대여 예약 정보를 확인해 주세요.
                </span>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step 1: 행사 구분 */}
            <div>
              <label className="block text-sm font-bold text-[#3C3228] mb-2">
                1. 행사 구분을 선택해 주세요
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEventType('baekil')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    eventType === 'baekil'
                      ? 'border-[#C98A72] bg-[#FAF2EB] text-[#3A2E25] ring-2 ring-[#C98A72]/20'
                      : 'border-[#EDE2D5] bg-white text-[#655547] hover:border-[#D9C4B0]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-base sm:text-lg">백일상 (100일)</span>
                    {eventType === 'baekil' && <Check className="w-5 h-5 text-[#C98A72]" />}
                  </div>
                  <span className="text-xs text-[#8C7665]">단아한 전통 족자 & 백자 그릇 구성</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEventType('dol')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    eventType === 'dol'
                      ? 'border-[#C98A72] bg-[#FAF2EB] text-[#3A2E25] ring-2 ring-[#C98A72]/20'
                      : 'border-[#EDE2D5] bg-white text-[#655547] hover:border-[#D9C4B0]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-base sm:text-lg">첫돌상 (돌잔치)</span>
                    {eventType === 'dol' && <Check className="w-5 h-5 text-[#C98A72]" />}
                  </div>
                  <span className="text-xs text-[#8C7665]">전통 12종 돌잡이 세트 무료 포함</span>
                </button>
              </div>
            </div>

            {/* Step 2: 행사 일자 선택 */}
            <div>
              <label className="block text-sm font-bold text-[#3C3228] mb-2">
                2. 행사 날짜를 선택해 주세요
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-[#EDE2D5] bg-white text-base text-[#3A2E25] focus:outline-none focus:ring-2 focus:ring-[#C98A72]/40"
                />
              </div>
              <p className="mt-1.5 text-xs text-[#857162] flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#C98A72]" />
                <span>행사 2~3일 전(목요일) 문 앞으로 안전하게 도착하도록 발송됩니다.</span>
              </p>
            </div>

            {/* Step 3: 아기 정보 및 무료 한복 선택 */}
            <div className="p-4 rounded-2xl bg-[#FAF6F1] border border-[#ECE0D3] space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#A56752]">
                <Gift className="w-4 h-4" />
                <span>3. 아기 정보 & 무료 한복 선택 (추가금 0원)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#655547] mb-1">
                    아기 이름
                  </label>
                  <input
                    type="text"
                    placeholder="예: 김하온"
                    value={babyName}
                    onChange={(e) => setBabyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE2D5] bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#655547] mb-1">
                    성별
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setBabyGender('girl')}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium border cursor-pointer ${
                        babyGender === 'girl'
                          ? 'bg-[#FAF0E9] border-[#C98A72] text-[#A56752] font-bold'
                          : 'bg-white border-[#EDE2D5] text-[#716154]'
                      }`}
                    >
                      여아
                    </button>
                    <button
                      type="button"
                      onClick={() => setBabyGender('boy')}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium border cursor-pointer ${
                        babyGender === 'boy'
                          ? 'bg-[#FAF0E9] border-[#C98A72] text-[#A56752] font-bold'
                          : 'bg-white border-[#EDE2D5] text-[#716154]'
                      }`}
                    >
                      남아
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#655547] mb-1">
                  무료 대여 한복 색상 선택
                </label>
                <select
                  value={hanbokColor}
                  onChange={(e) => setHanbokColor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE2D5] bg-white text-sm text-[#382E25]"
                >
                  <option value="살구빛 단아 핑크 한복 (무료)">살구빛 단아 핑크 한복 (무료)</option>
                  <option value="은은한 옥빛 민트 한복 (무료)">은은한 옥빛 민트 한복 (무료)</option>
                  <option value="화사한 버터 베이지 한복 (무료)">화사한 버터 베이지 한복 (무료)</option>
                  <option value="한복 대여 안 함 (자택 옷 착용)">한복 대여 안 함 (자택 옷 착용)</option>
                </select>
              </div>
            </div>

            {/* Step 4: 추가 옵션 선택 */}
            <div>
              <label className="block text-sm font-bold text-[#3C3228] mb-2">
                4. 추가 옵션 선택
              </label>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-xl border border-[#EDE2D5] bg-white cursor-pointer hover:bg-[#FAF8F5]">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={addFakeRiceCake}
                      onChange={(e) => setAddFakeRiceCake(e.target.checked)}
                      className="w-4 h-4 text-[#C98A72] accent-[#C98A72] rounded"
                    />
                    <span className="text-sm font-medium text-[#45382E]">
                      촬영용 모형 백설기 & 수수팥떡 2종 대여
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#C98A72] bg-[#FAF2EB] px-2 py-0.5 rounded">
                    무료 혜택
                  </span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-[#EDE2D5] bg-white cursor-pointer hover:bg-[#FAF8F5]">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={addBumboCover}
                      onChange={(e) => setAddBumboCover(e.target.checked)}
                      className="w-4 h-4 text-[#C98A72] accent-[#C98A72] rounded"
                    />
                    <span className="text-sm font-medium text-[#45382E]">
                      범보의자 전용 내추럴 린넨 커버 추가
                    </span>
                  </div>
                  <span className="text-xs font-medium text-[#7C6A5D]">
                    +5,000원
                  </span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-[#EDE2D5] bg-white cursor-pointer hover:bg-[#FAF8F5]">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={addTable}
                      onChange={(e) => setAddTable(e.target.checked)}
                      className="w-4 h-4 text-[#C98A72] accent-[#C98A72] rounded"
                    />
                    <span className="text-sm font-medium text-[#45382E]">
                      원형 접이식 상차림 대여 테이블 (지름 80cm)
                    </span>
                  </div>
                  <span className="text-xs font-medium text-[#7C6A5D]">
                    +15,000원
                  </span>
                </label>
              </div>
            </div>

            {/* Step 5: 주문자 및 배송 정보 */}
            <div className="space-y-3 pt-2">
              <label className="block text-sm font-bold text-[#3C3228]">
                5. 주문자 & 배송지 정보 (실제 수령 주소)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="주문자 성함"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-[#EDE2D5] bg-white text-sm"
                />
                <input
                  type="tel"
                  required
                  placeholder="연락처 (예: 010-1234-5678)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-[#EDE2D5] bg-white text-sm"
                />
              </div>
              <input
                type="text"
                required
                placeholder="기본 배송 주소 (도로명 주소)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-[#EDE2D5] bg-white text-sm"
              />
              <input
                type="text"
                placeholder="상세 주소 (동, 호수)"
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-[#EDE2D5] bg-white text-sm"
              />
              <input
                type="text"
                placeholder="배송 기사님 요청사항 (예: 문 앞에 놓아주세요)"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-[#EDE2D5] bg-white text-sm"
              />
            </div>

            {/* Real-time Price Calculation Summary */}
            <div className="p-5 bg-[#FAF4ED] rounded-2xl border border-[#E9DACB] space-y-2">
              <div className="flex justify-between text-sm text-[#7D6B5D]">
                <span>대여 풀세트 기본가</span>
                <span className="font-semibold text-[#483A30] tabular-nums">{basePrice.toLocaleString()}원</span>
              </div>
              {addTable && (
                <div className="flex justify-between text-sm text-[#7D6B5D]">
                  <span>접이식 테이블 대여</span>
                  <span className="font-semibold text-[#483A30] tabular-nums">+15,000원</span>
                </div>
              )}
              {addBumboCover && (
                <div className="flex justify-between text-sm text-[#7D6B5D]">
                  <span>범보의자 커버 추가</span>
                  <span className="font-semibold text-[#483A30] tabular-nums">+5,000원</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-[#7D6B5D]">
                <span>왕복 택배비 (출고 + 무료 수거)</span>
                <span className="font-bold text-[#C98A72]">0원 (전액 무료)</span>
              </div>
              <div className="pt-3 border-t border-[#E8D9CA] flex items-baseline justify-between">
                <span className="font-bold text-base text-[#382E25]">최종 결제 예정 금액</span>
                <span className="font-brand text-2xl sm:text-3xl font-bold text-[#C98A72] tabular-nums">
                  {totalPrice.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* Big Action Button -> Leads to Payment Modal */}
            <button
              type="submit"
              className="w-full py-5 rounded-2xl bg-[#C98A72] hover:bg-[#B7775F] active:scale-[0.98] text-white font-bold text-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>다음: {totalPrice.toLocaleString()}원 결제하기</span>
              <span className="text-xs font-normal bg-black/15 px-2 py-0.5 rounded-md">연습용 가짜 결제</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-center text-xs text-[#8A7665]">
              * 다음 화면에서 신용카드(연습용 번호 자동입력) 및 네이버·카카오·토스페이 결제를 체험하실 수 있습니다.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
