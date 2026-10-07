import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  RefreshCw,
  Package,
  Search,
  Phone,
  Calendar,
  MapPin,
  Truck,
  CheckCircle2,
  Clock,
  Radio,
  Bell,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface AdminOrderDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
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
  status: string;
  paymentMethod?: string;
  paymentStatus?: string;
  adminNotes?: string;
  trackingNumber?: string;
}

const STATUS_FILTERS = ['전체', '결제 완료', '배송중', '배송완료', '수거 완료'];

export const AdminOrderDashboard: React.FC<AdminOrderDashboardProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [newOrderAlert, setNewOrderAlert] = useState<OrderRecord | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  // Audio tone helper
  const playAlertSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio might be blocked without user interaction, ignore
    }
  };

  // Fetch initial orders
  const fetchOrders = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(prev => {
          // Check if there are newly arrived orders
          if (prev.length > 0 && data.orders.length > prev.length) {
            const newest = data.orders[0];
            if (newest && newest.id !== prev[0]?.id) {
              setNewOrderAlert(newest);
              playAlertSound();
            }
          }
          return data.orders;
        });
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  // Real-time synchronization (SSE stream + automatic short polling fallback)
  useEffect(() => {
    if (!isOpen) return;

    fetchOrders();

    // 1. Setup Server-Sent Events (SSE) for zero-latency instant updates
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/orders/stream');

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'NEW_ORDER' && payload.order) {
            setOrders(prev => {
              // Avoid duplicates
              if (prev.some(o => o.id === payload.order.id || o.orderNumber === payload.order.orderNumber)) {
                return prev;
              }
              setNewOrderAlert(payload.order);
              playAlertSound();
              return [payload.order, ...prev];
            });
          } else if (payload.type === 'STATUS_CHANGE' && payload.order) {
            setOrders(prev =>
              prev.map(o => (o.id === payload.order.id ? payload.order : o))
            );
          }
        } catch (e) {
          console.error('SSE parse error:', e);
        }
      };

      eventSource.onerror = () => {
        // SSE might retry automatically or fallback to polling
      };
    } catch (err) {
      console.error('SSE connection error:', err);
    }

    // 2. Continuous 3-second auto-polling fallback
    // User requested: "새 주문이 들어오면 내가 새로고침 안해도 자동으로 목록에 뜨게 해줘"
    const pollInterval = setInterval(() => {
      fetchOrders(true);
    }, 3000);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(pollInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Change Status Handler
  // User requested: "각 주문을 '배송중' '배송완료'로 바꾸는 버튼도 넣어줘"
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setIsUpdatingStatus(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev =>
          prev.map(o => (o.id === orderId || o.orderNumber === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  // Filter & Search logic
  const filteredOrders = orders.filter(o => {
    const statusMatches =
      filterStatus === '전체' ||
      o.status === filterStatus ||
      (filterStatus === '결제 완료' && (o.status.includes('결제') || o.status.includes('접수') || o.status.includes('입금')));

    const term = searchTerm.toLowerCase().trim();
    const searchMatches =
      !term ||
      o.orderNumber.toLowerCase().includes(term) ||
      o.customerName.toLowerCase().includes(term) ||
      o.phone.includes(term) ||
      o.babyName.toLowerCase().includes(term);

    return statusMatches && searchMatches;
  });

  // Summary counts
  const totalCount = orders.length;
  const inDeliveryCount = orders.filter(o => o.status === '배송중').length;
  const deliveredCount = orders.filter(o => o.status === '배송완료').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const getStatusBadgeStyle = (status: string) => {
    if (status === '배송중') {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (status === '배송완료') {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
    if (status.includes('결제') || status.includes('입금')) {
      return 'bg-amber-100 text-amber-900 border-amber-200';
    }
    if (status === '수거 완료' || status === '완료') {
      return 'bg-slate-100 text-slate-800 border-slate-200';
    }
    return 'bg-rose-100 text-rose-800 border-rose-200';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-[#E8DDD0] overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#342A22] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C98A72] flex items-center justify-center font-bold">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#534336] px-2 py-0.5 rounded text-[#EBD7C9] font-bold">
                  판매자 전용
                </span>
                {/* Live Stream Pulse Indicator */}
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>실시간 자동 감지 활성 (새로고침 불필요)</span>
                </span>
              </div>
              <h3 className="font-brand text-xl sm:text-2xl font-bold tracking-tight">
                몽글데이 주문관리 대시보드
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchOrders()}
              disabled={isLoading}
              title="지금 수동 새로고침"
              className="p-2.5 rounded-full bg-[#4D3F33] hover:bg-[#635142] text-[#E0D3C7] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-[#4D3F33] hover:bg-[#635142] text-[#E0D3C7] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time New Order Toast Alert */}
        {newOrderAlert && (
          <div className="bg-emerald-500 text-white px-6 py-3 flex items-center justify-between animate-bounce transition-all shrink-0">
            <div className="flex items-center gap-2 text-sm sm:text-base font-bold">
              <Bell className="w-5 h-5 text-yellow-200 animate-wiggle" />
              <span>
                🎉 새로운 주문이 방금 도착했습니다! [주문번호: {newOrderAlert.orderNumber}] - {newOrderAlert.customerName}님 ({newOrderAlert.totalPrice.toLocaleString()}원)
              </span>
            </div>
            <button
              onClick={() => setNewOrderAlert(null)}
              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-md cursor-pointer"
            >
              닫기
            </button>
          </div>
        )}

        {/* 4 Summary Stat Cards */}
        <div className="p-4 sm:px-6 bg-[#FAF6F0] border-b border-[#EAE0D3] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center shrink-0">
          <div className="p-3 bg-white rounded-2xl border border-[#EDE2D4]">
            <span className="text-xs text-[#806E61]">총 접수 주문</span>
            <p className="font-brand text-2xl font-bold text-[#352A20] tabular-nums">{totalCount}건</p>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-[#EDE2D4]">
            <span className="text-xs text-[#806E61]">현재 배송중</span>
            <p className="font-brand text-2xl font-bold text-blue-600 tabular-nums">{inDeliveryCount}건</p>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-[#EDE2D4]">
            <span className="text-xs text-[#806E61]">배송 완료</span>
            <p className="font-brand text-2xl font-bold text-emerald-600 tabular-nums">{deliveredCount}건</p>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-[#EDE2D4]">
            <span className="text-xs text-[#806E61]">누적 대여 매출</span>
            <p className="font-brand text-2xl font-bold text-[#C98A72] tabular-nums">
              {totalRevenue.toLocaleString()}원
            </p>
          </div>
        </div>

        {/* Controls Bar: Filters & Search */}
        <div className="p-4 sm:px-6 border-b border-[#EAE0D3] flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0 bg-white">
          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {STATUS_FILTERS.map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
                  filterStatus === st
                    ? 'bg-[#C98A72] text-white shadow-xs'
                    : 'bg-[#F2ECE2] text-[#69584B] hover:bg-[#E8DFC8]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="주문번호, 주문자, 전화번호 검색"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EDE2D5] bg-white text-xs sm:text-sm text-[#352B23] focus:ring-2 focus:ring-[#C98A72]/30 outline-none"
            />
            <Search className="w-4 h-4 text-[#9A8777] absolute left-3 top-3" />
          </div>
        </div>

        {/* Table Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF8F5]">
          {filteredOrders.length === 0 ? (
            <div className="py-20 text-center text-[#8C7665] bg-white rounded-2xl border border-[#EDE2D5]">
              <Package className="w-12 h-12 mx-auto mb-3 text-[#C4B2A3]" />
              <p className="text-base font-bold text-[#382E25]">등록된 주문이 없습니다.</p>
              <p className="text-xs text-[#8F7D70] mt-1">
                새 주문이 접수되면 화면을 새로고침하지 않아도 자동으로 표에 추가됩니다.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#EDE2D5] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  {/* Table Header */}
                  <thead>
                    <tr className="bg-[#FAF4ED] text-[#5C4D41] border-b border-[#EAE0D3] font-bold text-xs uppercase tracking-wider">
                      <th className="py-3.5 px-4">주문번호 / 일시</th>
                      <th className="py-3.5 px-4">주문자 정보</th>
                      <th className="py-3.5 px-4">대여 상품 & 옵션</th>
                      <th className="py-3.5 px-4 text-right">금액</th>
                      <th className="py-3.5 px-4 text-center">현재 상태</th>
                      <th className="py-3.5 px-4 text-center">상태 변경 관리</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-[#F2ECE1]">
                    {filteredOrders.map(order => {
                      const isExpanded = expandedOrderId === order.id;
                      return (
                        <React.Fragment key={order.id}>
                          <tr className="hover:bg-[#FAF6F1] transition-colors">
                            {/* 1. 주문번호 / 일시 */}
                            <td className="py-4 px-4 font-mono">
                              <span className="font-bold text-[#C98A72] block text-xs sm:text-sm">
                                {order.orderNumber}
                              </span>
                              <span className="text-[11px] text-[#9A8778] block">
                                {new Date(order.createdAt).toLocaleDateString('ko-KR', {
                                  month: 'numeric',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </td>

                            {/* 2. 주문자 */}
                            <td className="py-4 px-4">
                              <div className="font-bold text-[#382E25] flex items-center gap-1.5">
                                <span>{order.customerName}</span>
                                {order.babyName && (
                                  <span className="text-[11px] font-normal text-[#8A7667]">
                                    ({order.babyName} 아기)
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-[#7D6B5D] block">
                                {order.phone}
                              </span>
                            </td>

                            {/* 3. 상품 */}
                            <td className="py-4 px-4">
                              <div className="font-bold text-[#352B21]">
                                {order.eventType === 'baekil' ? '온유 백일상 풀세트' : '온유 첫돌상 풀세트'}
                              </div>
                              <div className="text-[11px] text-[#806E61]">
                                행사일: <strong className="text-[#A56752]">{order.eventDate}</strong>
                                {order.hanbokColor && ` · ${order.hanbokColor.slice(0, 10)}`}
                              </div>
                            </td>

                            {/* 4. 금액 */}
                            <td className="py-4 px-4 text-right">
                              <span className="font-bold text-[#382E25] block text-sm tabular-nums">
                                {order.totalPrice.toLocaleString()}원
                              </span>
                              <span className="text-[11px] text-[#9C8A7B] block">
                                {order.paymentMethod ? order.paymentMethod.replace(' (연습용)', '') : '가짜결제'}
                              </span>
                            </td>

                            {/* 5. 상태 */}
                            <td className="py-4 px-4 text-center">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeStyle(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </td>

                            {/* 6. 상태 변경 버튼 ("배송중", "배송완료") */}
                            {/* User requested: 각 주문을 "배송중""배송완료"로 바꾸는 버튼도 넣어줘 */}
                            <td className="py-4 px-4 text-center">
                              <div className="inline-flex items-center gap-1.5">
                                {/* '배송중' Button */}
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(order.id, '배송중')}
                                  disabled={isUpdatingStatus === order.id}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    order.status === '배송중'
                                      ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-300'
                                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                                  }`}
                                >
                                  배송중
                                </button>

                                {/* '배송완료' Button */}
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(order.id, '배송완료')}
                                  disabled={isUpdatingStatus === order.id}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    order.status === '배송완료'
                                      ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-300'
                                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                  }`}
                                >
                                  배송완료
                                </button>

                                {/* Toggle Detail Button */}
                                <button
                                  type="button"
                                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                  className="p-1.5 rounded-lg text-[#8C7665] hover:bg-[#F2ECE1] transition-colors cursor-pointer"
                                  title="주소 및 상세 보기"
                                >
                                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Detail Row (Address & Notes) */}
                          {isExpanded && (
                            <tr className="bg-[#FAF7F2] text-xs text-[#55473A]">
                              <td colSpan={6} className="p-4 border-b border-[#EAE0D3]">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-[#EDE2D4]">
                                  <div>
                                    <span className="font-bold text-[#806E61] block mb-0.5">배송지 주소:</span>
                                    <p className="text-[#382E25]">
                                      {order.address} {order.detailAddress}
                                    </p>
                                    {order.deliveryNote && (
                                      <p className="text-[#A56752] mt-0.5">
                                        요청: {order.deliveryNote}
                                      </p>
                                    )}
                                  </div>
                                  <div>
                                    <span className="font-bold text-[#806E61] block mb-0.5">아기 정보:</span>
                                    <p>
                                      이름: {order.babyName || '미입력'} ({order.babyGender === 'girl' ? '여아' : '남아'})
                                    </p>
                                    <p>한복: {order.hanbokColor}</p>
                                  </div>
                                  <div>
                                    <span className="font-bold text-[#806E61] block mb-0.5">추가 옵션:</span>
                                    <p>
                                      {order.addFakeRiceCake ? '모형떡 무료 대여 / ' : ''}
                                      {order.addTable ? '테이블 대여(+15,000) / ' : ''}
                                      {order.addBumboCover ? '범보커버(+5,000)' : '기본구성'}
                                    </p>
                                    <div className="mt-1 flex items-center gap-1">
                                      <span className="text-[#7A695C]">상태 즉시 전환:</span>
                                      <button
                                        onClick={() => handleUpdateStatus(order.id, '결제 완료')}
                                        className="text-[11px] underline text-[#806E61] hover:text-[#382E25]"
                                      >
                                        [결제완료]
                                      </button>
                                      <button
                                        onClick={() => handleUpdateStatus(order.id, '수거 완료')}
                                        className="text-[11px] underline text-[#806E61] hover:text-[#382E25]"
                                      >
                                        [수거완료]
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="px-6 py-3.5 bg-[#FAF4ED] border-t border-[#EDE2D4] flex flex-col sm:flex-row items-center justify-between text-xs text-[#806E61] gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>실시간 웹소켓/SSE 연결 상태 정상 (새 주문 유입 시 소리 및 배너 알림 작동)</span>
          </div>
          <div>
            주문 데이터는 서버 <code className="bg-[#EFE6DC] px-1.5 py-0.5 rounded text-[#382E25]">data/orders.json</code>에 영구 보존됩니다.
          </div>
        </div>
      </div>
    </div>
  );
};
