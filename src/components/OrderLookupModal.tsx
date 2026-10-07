import React, { useState } from 'react';
import { X, Search, Package, Calendar, Phone, MapPin, Truck, CheckCircle2, Clock } from 'lucide-react';

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderItem {
  id: string;
  orderNumber: string;
  createdAt: string;
  eventType: 'baekil' | 'dol';
  eventDate: string;
  babyName: string;
  babyGender: 'boy' | 'girl';
  hanbokColor: string;
  customerName: string;
  phone: string;
  address: string;
  detailAddress: string;
  totalPrice: number;
  status: string;
  trackingNumber?: string;
}

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setErrorMessage('');
    setHasSearched(true);

    try {
      const clean = query.trim();
      const isPhone = /^[0-9-]+$/.test(clean) && clean.length >= 4;
      const param = isPhone ? `phone=${encodeURIComponent(clean)}` : `orderNumber=${encodeURIComponent(clean)}`;

      const res = await fetch(`/api/orders?${param}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Lookup error:', err);
      setErrorMessage('주문 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#E9DFD3] overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-[#FAF4ED] border-b border-[#EDE2D4] flex items-center justify-between shrink-0">
          <div>
            <span className="text-xs font-bold text-[#A56752] uppercase tracking-wider block">
              REAL-TIME ORDER STATUS
            </span>
            <h3 className="font-brand text-xl sm:text-2xl font-bold text-[#352B23]">
              내 대여 주문 조회
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#736356] hover:text-[#332A22] flex items-center justify-center border border-[#E9DFD3] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <label className="block text-sm font-bold text-[#3B2F25] mb-2">
              주문 시 입력하신 휴대폰 번호 또는 주문 번호를 입력해 주세요
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="예: 010-1234-5678 또는 MG-..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-[#EDE2D5] bg-white text-base focus:ring-2 focus:ring-[#C98A72]/30 outline-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 rounded-xl bg-[#C98A72] hover:bg-[#B7775F] text-white font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors whitespace-nowrap"
              >
                <Search className="w-4 h-4" />
                <span>조회</span>
              </button>
            </div>
          </form>

          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm mb-4">
              {errorMessage}
            </div>
          )}

          {/* Results */}
          {isLoading ? (
            <div className="py-12 text-center text-[#8C7665]">
              <Clock className="w-8 h-8 animate-spin mx-auto mb-2 text-[#C98A72]" />
              <p>주문 내역을 실시간으로 확인하고 있습니다...</p>
            </div>
          ) : hasSearched && orders.length === 0 ? (
            <div className="py-12 text-center text-[#8C7665] bg-[#FAF7F2] rounded-2xl border border-[#ECE0D0]">
              <Package className="w-10 h-10 mx-auto mb-2 text-[#BCA594]" />
              <p className="font-bold text-[#382E25]">일치하는 대여 주문 내역이 없습니다.</p>
              <p className="text-xs text-[#806E61] mt-1">입력하신 휴대폰 번호나 주문 번호를 다시 한번 확인해 주세요.</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              <p className="text-xs text-[#7B6A5C] font-semibold">
                조회된 주문 내역 ({orders.length}건)
              </p>
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#EDE2D4] space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#EAE0D3] pb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#A56752]">
                        {ord.orderNumber}
                      </span>
                      <h4 className="font-brand text-lg font-bold text-[#382E25]">
                        {ord.eventType === 'baekil' ? '온유 백일상 풀세트' : '온유 첫돌상 풀세트'}
                        {ord.babyName && ` (${ord.babyName} 아기)`}
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#C98A72] text-white">
                      {ord.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-[#6B5A4D]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#C98A72]" />
                      <span>행사일: <strong>{ord.eventDate}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#C98A72]" />
                      <span>주문자: {ord.customerName}</span>
                    </div>
                    <div className="col-span-2 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C98A72] shrink-0 mt-0.5" />
                      <span className="truncate">배송지: {ord.address} {ord.detailAddress}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#EAE0D3] flex items-center justify-between text-xs">
                    <span className="text-[#806E61]">무료 대여 한복: {ord.hanbokColor}</span>
                    <span className="font-bold text-sm text-[#C98A72] tabular-nums">
                      {ord.totalPrice.toLocaleString()}원 (무료배송)
                    </span>
                  </div>

                  {ord.trackingNumber && (
                    <div className="p-2.5 bg-white rounded-lg border border-[#EDE2D5] flex items-center gap-2 text-xs text-[#382E25]">
                      <Truck className="w-4 h-4 text-[#C98A72]" />
                      <span>택배 송장번호: <strong>{ord.trackingNumber}</strong></span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
