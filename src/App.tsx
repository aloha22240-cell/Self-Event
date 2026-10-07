import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { RecommendSection } from './components/RecommendSection';
import { RentalProcessSection } from './components/RentalProcessSection';
import { SampleProductSection } from './components/SampleProductSection';
import { KeyValuesSection } from './components/KeyValuesSection';
import { ReviewsSection } from './components/ReviewsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { FloatingBar } from './components/FloatingBar';
import { OrderModal } from './components/OrderModal';
import { InquiryModal } from './components/InquiryModal';
import { OrderLookupModal } from './components/OrderLookupModal';
import { AdminOrderDashboard } from './components/AdminOrderDashboard';
import { AuthModal, AuthUser } from './components/AuthModal';
import { PaymentModal, OrderData } from './components/PaymentModal';

export default function App() {
  // Current Authenticated User state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('mongle_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modal open states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState<OrderData | null>(null);

  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Auth flow triggers
  const [authRedirectReason, setAuthRedirectReason] = useState<string>('');
  const [pendingOrderAfterAuth, setPendingOrderAfterAuth] = useState(false);

  // When clicking "주문하기":
  // User requested: "주문하면 먼저 회원가입하고 로그인하게 해줘."
  const handleOpenOrder = () => {
    if (!currentUser) {
      setAuthRedirectReason('대여 주문을 진행하시려면 먼저 회원가입 또는 로그인을 완료해 주세요.');
      setPendingOrderAfterAuth(true);
      setIsAuthModalOpen(true);
    } else {
      setIsOrderModalOpen(true);
    }
  };

  const handleCloseOrder = () => setIsOrderModalOpen(false);

  // Proceed from Order form to Payment Modal
  const handleProceedToPayment = (orderData: OrderData) => {
    setPendingOrderData(orderData);
    setIsOrderModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handleClosePayment = () => {
    setIsPaymentModalOpen(false);
  };

  const handleOpenAuth = () => {
    setAuthRedirectReason('');
    setPendingOrderAfterAuth(false);
    setIsAuthModalOpen(true);
  };

  const handleCloseAuth = () => {
    setIsAuthModalOpen(false);
    setPendingOrderAfterAuth(false);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('mongle_user', JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user to localStorage:', e);
    }

    // If user clicked "주문하기" beforehand, seamlessly open OrderModal now
    if (pendingOrderAfterAuth) {
      setPendingOrderAfterAuth(false);
      setTimeout(() => {
        setIsOrderModalOpen(true);
      }, 300);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('mongle_user');
    } catch (e) {
      console.error('Failed to clear user from localStorage:', e);
    }
  };

  const handleOpenInquiry = () => setIsInquiryModalOpen(true);
  const handleCloseInquiry = () => setIsInquiryModalOpen(false);

  const handleOpenLookup = () => setIsLookupModalOpen(true);
  const handleCloseLookup = () => setIsLookupModalOpen(false);

  const handleOpenAdmin = () => setIsAdminModalOpen(true);
  const handleCloseAdmin = () => setIsAdminModalOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#342D26] pb-20 sm:pb-24">
      {/* Top Navigation Bar with "()님 환영합니다." and Login/Logout */}
      <Header
        currentUser={currentUser}
        onOpenOrder={handleOpenOrder}
        onOpenInquiry={handleOpenInquiry}
        onOpenLookup={handleOpenLookup}
        onOpenAdmin={handleOpenAdmin}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Content Flow */}
      <main className="flex-1">
        {/* 1. Hero Section with "MONGLE DAY (몽글데이)" + Personalized greeting */}
        <HeroSection
          currentUser={currentUser}
          onOpenOrder={handleOpenOrder}
          onOpenInquiry={handleOpenInquiry}
        />

        {/* 2. "이분들께 추천해요" Section */}
        <RecommendSection onOpenOrder={handleOpenOrder} />

        {/* 3. Emotional Photos & Step-by-Step Rental Process */}
        <RentalProcessSection />

        {/* 4. Featured 1 Sample, Price & Big "주문하기" Button */}
        <SampleProductSection onOpenOrder={handleOpenOrder} />

        {/* 5. Core Values: 셀프 이벤트 · 압도적 가성비 · 고급스러운 디자인 */}
        <KeyValuesSection onOpenOrder={handleOpenOrder} />

        {/* 6. Real Parent Reviews & Social Proof */}
        <ReviewsSection />

        {/* 7. Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenLookup={handleOpenLookup}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Sticky Bottom Quick Action Bar */}
      <FloatingBar
        onOpenOrder={handleOpenOrder}
        onOpenInquiry={handleOpenInquiry}
        onOpenLookup={handleOpenLookup}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Auth Modal (회원가입 & 로그인) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuth}
        onLoginSuccess={handleLoginSuccess}
        redirectReason={authRedirectReason}
      />

      {/* Interactive Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={handleCloseOrder}
        onOpenLookup={handleOpenLookup}
        currentUser={currentUser}
        onProceedToPayment={handleProceedToPayment}
      />

      {/* Payment Checkout Modal (연습용 가짜 결제 & 네이버/토스/카카오페이/카드) */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePayment}
        orderData={pendingOrderData}
        currentUser={currentUser}
        onOrderCompleted={(orderNumber) => {
          console.log('Order created:', orderNumber);
        }}
        onOpenLookup={handleOpenLookup}
      />

      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={handleCloseInquiry}
      />

      <OrderLookupModal
        isOpen={isLookupModalOpen}
        onClose={handleCloseLookup}
      />

      <AdminOrderDashboard
        isOpen={isAdminModalOpen}
        onClose={handleCloseAdmin}
      />
    </div>
  );
}
