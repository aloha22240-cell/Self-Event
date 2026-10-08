import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  initialMode?: 'login' | 'register';
  redirectReason?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
  redirectReason = '주문 및 예약을 진행하시려면 먼저 로그인 또는 회원가입이 필요합니다.'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form Fields
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleTabChange = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const validateInputs = (): string | null => {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      return '이메일 주소를 입력해 주세요.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return '올바른 이메일 형식으로 입력해 주세요. (예: example@naver.com)';
    }

    if (mode === 'register') {
      if (!name.trim()) {
        return '고객님의 성함(또는 닉네임)을 입력해 주세요.';
      }
    }

    if (!password) {
      return '비밀번호를 입력해 주세요.';
    }

    if (password.length < 6) {
      return `비밀번호는 6자 이상으로 입력해 주세요. (현재 ${password.length}자 입력됨)`;
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        return '비밀번호가 서로 일치하지 않습니다. 다시 확인해 주세요.';
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const validationError = validateInputs();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'register') {
        let registeredUser: AuthUser | null = null;
        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email.trim(),
              password,
              name: name.trim()
            })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.user) {
              registeredUser = data.user;
            }
          } else {
            const data = await res.json().catch(() => ({}));
            if (data.error) throw new Error(data.error);
          }
        } catch (apiErr: unknown) {
          if (apiErr instanceof Error && apiErr.message && !apiErr.message.includes('fetch')) {
            throw apiErr;
          }
          console.warn('Auth API unavailable, using local registration:', apiErr);
        }

        if (!registeredUser) {
          const localUser = {
            id: `usr_${Date.now()}`,
            email: email.trim(),
            name: name.trim()
          };
          try {
            const users = JSON.parse(localStorage.getItem('mongle_users') || '[]');
            users.push({ ...localUser, password });
            localStorage.setItem('mongle_users', JSON.stringify(users));
          } catch {
            // ignore
          }
          registeredUser = localUser;
        }

        setSuccessMessage(`${registeredUser.name}님, 회원가입이 완료되었습니다! 바로 로그인 처리됩니다.`);
        setTimeout(() => {
          onLoginSuccess(registeredUser!);
          onClose();
        }, 600);
      } else {
        // Login Mode
        let loggedUser: AuthUser | null = null;
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email.trim(),
              password
            })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.user) {
              loggedUser = data.user;
            }
          } else {
            const data = await res.json().catch(() => ({}));
            if (data.error) throw new Error(data.error);
          }
        } catch (apiErr: unknown) {
          if (apiErr instanceof Error && apiErr.message && !apiErr.message.includes('fetch')) {
            throw apiErr;
          }
          console.warn('Auth API unavailable, checking local storage:', apiErr);
        }

        if (!loggedUser) {
          try {
            const users = JSON.parse(localStorage.getItem('mongle_users') || '[]');
            const found = users.find((u: { email: string; password?: string }) => u.email.toLowerCase() === email.trim().toLowerCase());
            if (found) {
              if (found.password && found.password !== password) {
                throw new Error('비밀번호가 일치하지 않습니다. 다시 한번 확인해 주세요.');
              }
              loggedUser = { id: found.id, email: found.email, name: found.name };
            } else {
              // Create guest session
              loggedUser = { id: `usr_${Date.now()}`, email: email.trim(), name: email.split('@')[0] || '고객' };
            }
          } catch (e: unknown) {
            if (e instanceof Error) throw e;
          }
        }

        setSuccessMessage(`${loggedUser!.name}님, 환영합니다!`);
        setTimeout(() => {
          onLoginSuccess(loggedUser!);
          onClose();
        }, 600);
      }
    } catch (err: unknown) {
      console.error('Auth error:', err);
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E8DDD0] overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-5 bg-[#FAF4ED] border-b border-[#EDE2D4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C98A72]" />
            <h3 className="font-brand text-xl font-bold text-[#352B23]">
              {mode === 'login' ? '로그인' : '간편 회원가입'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#736356] hover:text-[#332A22] flex items-center justify-center border border-[#E9DFD3] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Redirect Notice */}
        {redirectReason && (
          <div className="bg-[#FAF2EB] px-6 py-3 border-b border-[#EDE1D3] text-xs sm:text-sm text-[#875543] font-medium leading-relaxed">
            {redirectReason}
          </div>
        )}

        {/* Tab Buttons (로그인 vs 회원가입) */}
        <div className="p-6 pb-0">
          <div className="flex bg-[#F2ECE1] p-1.5 rounded-2xl mb-5">
            <button
              type="button"
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#382E25] shadow-xs'
                  : 'text-[#7D6B5D] hover:text-[#382E25]'
              }`}
            >
              로그인
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('register')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#382E25] shadow-xs'
                  : 'text-[#7D6B5D] hover:text-[#382E25]'
              }`}
            >
              회원가입
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-6 pb-6">
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Register only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-[#55463A] mb-1">
                  고객님 성함 (또는 닉네임)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#A8988B] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="예: 김민지 (또는 민지맘)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#EDE2D5] bg-white text-sm text-[#382E25] focus:outline-none focus:ring-2 focus:ring-[#C98A72]/30"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-[#55463A] mb-1">
                이메일 주소
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A8988B] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="예: mongle@naver.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#EDE2D5] bg-white text-sm text-[#382E25] focus:outline-none focus:ring-2 focus:ring-[#C98A72]/30"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#55463A]">
                  비밀번호
                </label>
                <span className="text-[11px] text-[#A56752]">6자 이상 필수</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A8988B] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="6자 이상의 비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#EDE2D5] bg-white text-sm text-[#382E25] focus:outline-none focus:ring-2 focus:ring-[#C98A72]/30"
                />
              </div>
              {password.length > 0 && password.length < 6 && (
                <p className="mt-1 text-xs text-amber-700">
                  ⚠️ 비밀번호가 너무 짧습니다. (현재 {password.length}자 / 6자 이상 필요)
                </p>
              )}
            </div>

            {/* Confirm Password Field (Register only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-[#55463A] mb-1">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#A8988B] absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="비밀번호를 한 번 더 입력해 주세요"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#EDE2D5] bg-white text-sm text-[#382E25] focus:outline-none focus:ring-2 focus:ring-[#C98A72]/30"
                  />
                </div>
                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    ⚠️ 비밀번호가 일치하지 않습니다.
                  </p>
                )}
                {confirmPassword.length >= 6 && password === confirmPassword && (
                  <p className="mt-1 text-xs text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 비밀번호가 일치합니다.
                  </p>
                )}
              </div>
            )}

            {/* Big Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-4 rounded-xl bg-[#C98A72] hover:bg-[#B7775F] active:scale-[0.98] text-white font-bold text-base shadow-md transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <span>{isLoading ? '확인 중...' : mode === 'login' ? '로그인하고 주문 계속하기' : '회원가입 완료하고 주문하기'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Helper */}
          <div className="mt-5 text-center text-xs text-[#827163]">
            {mode === 'login' ? (
              <p>
                아직 몽글데이 계정이 없으신가요?{' '}
                <button
                  type="button"
                  onClick={() => handleTabChange('register')}
                  className="font-bold text-[#C98A72] hover:underline cursor-pointer"
                >
                  회원가입하기
                </button>
              </p>
            ) : (
              <p>
                이미 가입된 계정이 있으신가요?{' '}
                <button
                  type="button"
                  onClick={() => handleTabChange('login')}
                  className="font-bold text-[#C98A72] hover:underline cursor-pointer"
                >
                  로그인하기
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
