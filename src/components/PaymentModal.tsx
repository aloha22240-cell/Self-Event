import React, { useState } from 'react';
import { X, CreditCard, ShieldAlert, CheckCircle2, Copy, Sparkles, Truck, Calendar, ArrowRight, Loader2, Smartphone } from 'lucide-react';
import { AuthUser } from './AuthModal';

export interface OrderData {
  eventType: 'baekil' | 'dol';
  eventDate: string;
  babyName: string;
  babyGender: 'boy' | 'girl';
  hanbokColor: string;
  addFakeRiceCake: boolean;
  addBumboCover: boolean;
  addTable: boolean;
  customerName: string;
  phone: string;
  address: string;
  detailAddress: string;
  deliveryNote: string;
  totalPrice: number;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: OrderData | null;
  currentUser: AuthUser | null;
  onOrderCompleted: (orderNumber: string) => void;
  onOpenLookup?: () => void;
}

type PaymentMethodType = 'card' | 'naver' | 'kakao' | 'toss';

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  orderData,
  currentUser,
  onOrderCompleted,
  onOpenLookup,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('card');
  const [cardNumber, setCardNumber] = useState('1111-2222-3333-4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('777');
  const [installment, setInstallment] = useState('일시불');

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [generatedOrderNumber, setGeneratedOrderNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !orderData) return null;

  const getMethodName = (type: PaymentMethodType) => {
    switch (type) {
      case 'card':
        return '신용/체크카드 (연습용)';
      case 'naver':
        return '네이버페이 (연습용)';
      case 'kakao':
        return '카카오페이 (연습용)';
      case 'toss':
        return '토스페이 (연습용)';
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderData,
          paymentMethod: getMethodName(selectedMethod),
          paymentStatus: '승인 완료 (연습용 가짜 결제)',
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || '결제 처리 중 오류가 발생했습니다.');
      }

      setGeneratedOrderNumber(result.order.orderNumber);
      setIsCompleted(true);
      onOrderCompleted(result.order.orderNumber);
    } catch (err: unknown) {
      console.error('Payment simulation error:', err);
      setErrorMessage(err instanceof Error ? err.message : '결제 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyOrderNumber = () => {
    if (generatedOrderNumber) {
      navigator.clipboard.writeText(generatedOrderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCloseAll = () => {
    setIsCompleted(false);
    setGeneratedOrderNumber('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#E8DDD0] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 sm:py-5 bg-[#FAF4ED] border-b border-[#EDE2D4] flex items-center justify-between shrink-0">
          <div>
            <span className="text-xs font-bold text-[#A56752] uppercase tracking-wider block">
              MONGLE DAY PAYMENT SIMULATION
            </span>
            <h3 className="font-brand text-xl sm:text-2xl font-bold text-[#352B23]">
              {isCompleted ? '주문완료' : '대여 주문 결제하기'}
            </h3>
          </div>
          <button
            onClick={handleCloseAll}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#736356] hover:text-[#332A22] flex items-center justify-center border border-[#E9DFD3] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* 1. Large Notice Banner: 실제로 결제되지 않는 연습용입니다 */}
          {!isCompleted && (
            <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
                <h4 className="text-base sm:text-lg font-extrabold text-amber-900">
                  실제로 결제되지 않는 연습용 입니다
                </h4>
              </div>
              <p className="mt-1.5 text-xs sm:text-sm text-amber-800 leading-relaxed pl-8">
                본 화면은 대여 프로세스 체험을 위한 <strong>모의 가짜 결제 화면</strong>입니다. 실제 돈이 빠져나가거나 신용카드 청구가 발생하지 않으니 안심하고 [결제하기]를 클릭해 보세요.
              </p>
            </div>
          )}

          {isCompleted ? (
            /* =================== 2. 주문완료 Screen =================== */
            <div className="text-center py-4 sm:py-6 space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold mb-2">
                  연습 결제 승인 완료
                </span>
                <h3 className="font-brand text-2xl sm:text-3xl font-bold text-[#352B23]">
                  주문이 성공적으로 완료되었습니다!
                </h3>
                <p className="mt-1.5 text-sm sm:text-base text-[#655547]">
                  {orderData.customerName} 님의 백일상·돌상 대여 접수가 완료되었습니다.
                </p>
              </div>

              {/* Order Number Box (ORD-YYYYMMDD-XXXX format) */}
              <div className="p-4 sm:p-5 bg-[#FAF4ED] rounded-2xl border border-[#E9DACB] max-w-lg mx-auto">
                <span className="text-xs text-[#827163] font-medium block mb-1">
                  발급된 대여 주문번호
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-brand text-2xl sm:text-3xl font-bold text-[#C98A72] tracking-wider tabular-nums">
                    {generatedOrderNumber}
                  </span>
                  <button
                    onClick={handleCopyOrderNumber}
                    className="p-1.5 rounded-lg bg-white border border-[#E5D5C5] text-[#715F52] hover:text-[#382E25] cursor-pointer"
                    title="주문번호 복사"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copied && (
                  <p className="text-xs text-[#C98A72] font-semibold mt-1">
                    주문번호가 복사되었습니다!
                  </p>
                )}
              </div>

              {/* Order Complete Details Receipt */}
              <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#EDE2D4] text-left text-xs sm:text-sm space-y-2.5 max-w-lg mx-auto">
                <div className="flex justify-between py-1 border-b border-[#EAE0D3]">
                  <span className="text-[#806E61]">신청 세트</span>
                  <span className="font-bold text-[#382E25]">
                    {orderData.eventType === 'baekil' ? '온유 백일상 풀세트' : '온유 첫돌상 풀세트 (돌잡이 12종 무료)'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EAE0D3]">
                  <span className="text-[#806E61]">행사 예정일</span>
                  <span className="font-bold text-[#C98A72]">{orderData.eventDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EAE0D3]">
                  <span className="text-[#806E61]">결제 수단</span>
                  <span className="font-medium text-[#4D4036]">{getMethodName(selectedMethod)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EAE0D3]">
                  <span className="text-[#806E61]">결제 금액</span>
                  <span className="font-bold text-base text-[#C98A72] tabular-nums">
                    {orderData.totalPrice.toLocaleString()}원 (실제 청구 0원)
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EAE0D3]">
                  <span className="text-[#806E61]">배송 일정</span>
                  <span className="font-medium text-[#4D4036]">행사 2~3일 전(목요일) 안전 도착</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#806E61]">수령 주소</span>
                  <span className="font-medium text-[#4D4036] truncate max-w-[240px]">
                    {orderData.address} {orderData.detailAddress}
                  </span>
                </div>
              </div>

              {/* Practice notice banner */}
              <p className="text-xs text-[#806E61]">
                * 본 주문은 연습용으로 실제 결제 없이 접수되었으며, 상단 메뉴의 <strong>[주문 조회]</strong>에서 실시간 확인하실 수 있습니다.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleCloseAll}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#C98A72] hover:bg-[#B7775F] text-white font-bold text-base shadow-md cursor-pointer transition-all"
                >
                  주문 확인 완료
                </button>
                {onOpenLookup && (
                  <button
                    onClick={() => {
                      handleCloseAll();
                      onOpenLookup();
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#F0E6D8] hover:bg-[#E5D7C5] text-[#5C4C3E] font-semibold text-base cursor-pointer transition-all"
                  >
                    내 주문 배송 조회
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* =================== 1. 결제화면 (Checkout Form) =================== */
            <form onSubmit={handlePay} className="space-y-6">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
                  {errorMessage}
                </div>
              )}

              {/* Order Info Summary Box */}
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EDE2D4] space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm text-[#7D6B5D]">
                  <span>대여 상품</span>
                  <span className="font-bold text-[#382E25]">
                    {orderData.eventType === 'baekil' ? '온유 백일상 풀세트' : '온유 첫돌상 풀세트'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm text-[#7D6B5D]">
                  <span>행사 일자</span>
                  <span className="font-semibold text-[#483A30]">{orderData.eventDate}</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm text-[#7D6B5D]">
                  <span>주문자</span>
                  <span className="font-semibold text-[#483A30]">
                    {orderData.customerName} ({orderData.phone})
                  </span>
                </div>
                <div className="pt-2 border-t border-[#EAE0D3] flex justify-between items-baseline">
                  <span className="font-bold text-sm text-[#382E25]">최종 결제 금액</span>
                  <span className="font-brand text-2xl font-bold text-[#C98A72] tabular-nums">
                    {orderData.totalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* Payment Methods Selection: Card, Naver Pay, Kakao Pay, Toss Pay */}
              <div>
                <label className="block text-sm font-bold text-[#382E25] mb-2.5">
                  결제 수단을 선택해 주세요 (네이버 · 카카오 · 토스 · 카드)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* 1. 신용/체크카드 */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedMethod === 'card'
                        ? 'border-[#C98A72] bg-[#FAF2EB] text-[#382E25] ring-2 ring-[#C98A72]/20 shadow-xs'
                        : 'border-[#EDE2D5] bg-white text-[#655547] hover:border-[#DFCEBC]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#C98A72]" />
                    <span className="block text-xs sm:text-sm font-bold">신용카드</span>
                    <span className="text-[10px] text-[#8C7665]">연습용 번호</span>
                  </button>

                  {/* 2. 네이버페이 */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('naver')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedMethod === 'naver'
                        ? 'border-[#03C75A] bg-[#F0FDF4] text-[#14532D] ring-2 ring-[#03C75A]/20 shadow-xs'
                        : 'border-[#EDE2D5] bg-white text-[#655547] hover:border-[#DFCEBC]'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-[#03C75A] text-white font-extrabold text-[11px] flex items-center justify-center mx-auto mb-1">
                      N
                    </div>
                    <span className="block text-xs sm:text-sm font-bold">네이버페이</span>
                    <span className="text-[10px] text-[#16A34A]">간편결제</span>
                  </button>

                  {/* 3. 카카오페이 */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('kakao')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedMethod === 'kakao'
                        ? 'border-[#FEE500] bg-[#FEFCE8] text-[#854D0E] ring-2 ring-[#FEE500]/40 shadow-xs'
                        : 'border-[#EDE2D5] bg-white text-[#655547] hover:border-[#DFCEBC]'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-[#FEE500] text-[#3C1E1E] font-extrabold text-[11px] flex items-center justify-center mx-auto mb-1">
                      pay
                    </div>
                    <span className="block text-xs sm:text-sm font-bold">카카오페이</span>
                    <span className="text-[10px] text-[#CA8A04]">간편결제</span>
                  </button>

                  {/* 4. 토스페이 */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('toss')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedMethod === 'toss'
                        ? 'border-[#0064FF] bg-[#EFF6FF] text-[#1E3A8A] ring-2 ring-[#0064FF]/20 shadow-xs'
                        : 'border-[#EDE2D5] bg-white text-[#655547] hover:border-[#DFCEBC]'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-[#0064FF] text-white font-bold text-[11px] flex items-center justify-center mx-auto mb-1">
                      toss
                    </div>
                    <span className="block text-xs sm:text-sm font-bold">토스페이</span>
                    <span className="text-[10px] text-[#2563EB]">원클릭</span>
                  </button>
                </div>
              </div>

              {/* Method Specific Form Area */}
              {selectedMethod === 'card' && (
                <div className="p-4 sm:p-5 bg-[#FAF7F2] rounded-2xl border border-[#EDE2D4] space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#5A4B3F]">
                      카드 정보 입력 (연습용 번호 자동 입력됨)
                    </span>
                    <span className="text-[11px] text-[#C98A72] font-semibold bg-[#FAF0E8] px-2 py-0.5 rounded">
                      자동 채움
                    </span>
                  </div>

                  {/* Card Number Input with pre-filled 1111-2222-3333-4444 */}
                  <div>
                    <label className="block text-xs font-semibold text-[#665547] mb-1">
                      카드번호
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1111-2222-3333-4444"
                      className="w-full px-3.5 py-3 rounded-xl border border-[#EDE2D5] bg-white text-base font-mono font-bold text-[#352B23] tracking-widest focus:ring-2 focus:ring-[#C98A72]/30 outline-none"
                    />
                    <p className="mt-1 text-[11px] text-[#8C7665]">
                      * 연습용 카드번호가 기본 입력되어 있습니다.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-[#665547] mb-1">
                        유효기간 (MM/YY)
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full px-3 py-2.5 rounded-xl border border-[#EDE2D5] bg-white text-sm font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#665547] mb-1">
                        CVC (3자리)
                      </label>
                      <input
                        type="password"
                        maxLength={3}
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="777"
                        className="w-full px-3 py-2.5 rounded-xl border border-[#EDE2D5] bg-white text-sm font-mono text-center"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-semibold text-[#665547] mb-1">
                        할부 개월
                      </label>
                      <select
                        value={installment}
                        onChange={(e) => setInstallment(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#EDE2D5] bg-white text-sm"
                      >
                        <option value="일시불">일시불</option>
                        <option value="2개월 (무이자)">2개월 (무이자)</option>
                        <option value="3개월 (무이자)">3개월 (무이자)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'naver' && (
                <div className="p-4 sm:p-5 bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#15803D]">
                      네이버페이 간편결제 (연습용)
                    </span>
                  </div>
                  <p className="text-xs text-[#166534] leading-relaxed">
                    네이버페이에 등록된 카드 또는 네이버 포인트로 안전하게 연습 결제됩니다. 실제 결제 승인은 되지 않습니다.
                  </p>
                  <div className="p-2.5 bg-white rounded-xl border border-[#DCFCE7] text-xs text-[#15803D] flex items-center justify-between">
                    <span>네이버페이 포인트 최대 3% 적립 예정</span>
                    <span className="font-bold">+2,370원 혜택</span>
                  </div>
                </div>
              )}

              {selectedMethod === 'kakao' && (
                <div className="p-4 sm:p-5 bg-[#FEFCE8] rounded-2xl border border-[#FEF08A] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#854D0E]">
                      카카오페이 간편결제 (연습용)
                    </span>
                  </div>
                  <p className="text-xs text-[#713F12] leading-relaxed">
                    카카오톡 앱 인증 없이 클릭 한 번으로 가짜 결제가 승인됩니다. 실제 청구는 되지 않습니다.
                  </p>
                  <div className="p-2.5 bg-white rounded-xl border border-[#FEF9C3] text-xs text-[#854D0E] flex items-center justify-between">
                    <span>카카오페이머니 및 등록 카드 결제</span>
                    <span className="font-bold text-[#EAB308]">모의 승인 대기중</span>
                  </div>
                </div>
              )}

              {selectedMethod === 'toss' && (
                <div className="p-4 sm:p-5 bg-[#EFF6FF] rounded-2xl border border-[#BFDBFE] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#1E40AF]">
                      토스페이 원클릭 결제 (연습용)
                    </span>
                  </div>
                  <p className="text-xs text-[#1E3A8A] leading-relaxed">
                    토스 앱 간편 인증 모드로 즉시 연습 승인이 진행됩니다. 실제 금융 거래는 일어나지 않습니다.
                  </p>
                  <div className="p-2.5 bg-white rounded-xl border border-[#DBEAFE] text-xs text-[#1D4ED8] flex items-center justify-between">
                    <span>토스 결제 수수료 무료</span>
                    <span className="font-bold">즉시 모의 결제</span>
                  </div>
                </div>
              )}

              {/* Big "결제하기" Button */}
              <div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-5 rounded-2xl bg-[#C98A72] hover:bg-[#B7775F] active:scale-[0.98] text-white font-bold text-xl shadow-lg transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>연습용 결제 승인 요청 중...</span>
                    </>
                  ) : (
                    <>
                      <span>{orderData.totalPrice.toLocaleString()}원 결제하기</span>
                      <span className="text-sm font-normal bg-black/15 px-2.5 py-0.5 rounded-lg">
                        연습용
                      </span>
                    </>
                  )}
                </button>
                <p className="mt-2 text-center text-xs text-[#8A7665]">
                  클릭하시면 고유 주문번호(ORD-...)가 생성되며 주문완료 화면이 나타납니다.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
