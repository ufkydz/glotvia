import React, { useState, useEffect, useRef } from 'react';
import { 
  sendEmailVerificationCode, 
  verifyEmailCode, 
  getActiveSession,
  getSimulatedInbox,
  SimulatedEmail
} from '../services/emailVerificationService';
import { 
  Mail, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, 
  ArrowRight, Copy, Check, Sparkles, Inbox, Eye, EyeOff, Lock,
  ChevronDown, ChevronUp, Clock
} from 'lucide-react';
import { playSuccessChime, playCoinSound } from '../utils/audioEffects';
import { resendVerificationEmail, checkEmailVerifiedStatus } from '../services/authenticationService';
import { getCurrentUser } from '../utils/authStorage';

interface EmailVerificationBoxProps {
  email: string;
  userName?: string;
  purpose?: 'register' | 'login' | 'password_reset';
  onVerified: (verifiedData?: any) => void;
  onCancel?: () => void;
}

export const EmailVerificationBox: React.FC<EmailVerificationBoxProps> = ({
  email,
  userName = 'Kullanıcı',
  purpose = 'register' as 'register' | 'login' | 'password_reset',
  onVerified,
  onCancel
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingFirebase, setIsCheckingFirebase] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [activeCode, setActiveCode] = useState<string>('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize or fetch active verification session code
  useEffect(() => {
    const session = getActiveSession(email);
    if (session) {
      setActiveCode(session.code);
    }
  }, [email]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Auto focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleDigitChange = (index: number, val: string) => {
    setErrorMsg(null);
    const cleaned = val.replace(/\D/g, '');

    // Handle single digit
    if (cleaned.length <= 1) {
      const newDigits = [...digits];
      newDigits[index] = cleaned;
      setDigits(newDigits);

      // Auto-advance
      if (cleaned && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }

      // If all 6 filled, auto trigger submit
      if (cleaned && index === 5 && newDigits.every(d => d !== '')) {
        handleVerifyCode(newDigits.join(''));
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pastedData[i] || '';
    }
    setDigits(newDigits);

    if (pastedData.length === 6) {
      inputRefs.current[5]?.focus();
      handleVerifyCode(pastedData);
    } else if (pastedData.length > 0) {
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleAutoFill = () => {
    const session = getActiveSession(email);
    const codeToUse = session?.code || activeCode;
    if (codeToUse && codeToUse.length === 6) {
      const codeDigits = codeToUse.split('');
      setDigits(codeDigits);
      playCoinSound();
      setSuccessMsg('Kod otomatik olarak dolduruldu!');
      setTimeout(() => {
        handleVerifyCode(codeToUse);
      }, 300);
    }
  };

  const handleCopyCode = () => {
    const session = getActiveSession(email);
    const codeToUse = session?.code || activeCode;
    if (codeToUse) {
      navigator.clipboard.writeText(codeToUse);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    const res = await resendVerificationEmail(email, userName);
    setIsLoading(false);

    if (res.success) {
      const session = getActiveSession(email);
      if (session) {
        setActiveCode(session.code);
      }
      setCountdown(30);
      setCanResend(false);
      setDigits(['', '', '', '', '', '']);
      setSuccessMsg(res.message);
      playCoinSound();
      inputRefs.current[0]?.focus();
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleCheckEmailVerified = async () => {
    setIsCheckingFirebase(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const cur = getCurrentUser();
    const res = await checkEmailVerifiedStatus(cur);
    setIsCheckingFirebase(false);

    if (res.isVerified) {
      setSuccessMsg(res.message);
      playSuccessChime();
      setTimeout(() => {
        onVerified({ isEmailVerified: true });
      }, 500);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleVerifyCode = (fullCode?: string) => {
    const code = fullCode || digits.join('');
    setErrorMsg(null);
    setSuccessMsg(null);

    if (code.length !== 6) {
      setErrorMsg('Lütfen 6 haneli doğrulama kodunu eksiksiz giriniz.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = verifyEmailCode(email, code, purpose);
      setIsLoading(false);

      if (result.success) {
        setSuccessMsg(result.message);
        playSuccessChime();
        setTimeout(() => {
          onVerified(result.verifiedData);
        }, 500);
      } else {
        setErrorMsg(result.message);
      }
    }, 350);
  };

  return (
    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200 text-left w-full max-w-full">
      
      {/* Header Info */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex p-2.5 sm:p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-1">
          <Mail className="w-6 h-6 sm:w-7 sm:h-7 animate-bounce" />
        </div>
        <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
          E-posta Doğrulama Kodu
        </h3>
        <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed px-1">
          <span className="text-amber-400 font-bold break-all">{email}</span> adresinize doğrulama bağlantısı ve onay kodu gönderildi.
        </p>
      </div>

      {/* Spam Notice Warning */}
      <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-2xl text-xs text-amber-200/90 leading-relaxed flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300">Önemli:</strong> E-posta gelen kutunuza gönderilen <strong>6 haneli doğrulama kodunu</strong> aşağıdaki kutucuklara giriniz. E-posta ulaşmadıysa lütfen <strong>Spam / Gereksiz</strong> klasörünü kontrol ediniz.
        </div>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="p-3 bg-rose-500/15 border border-rose-500/40 text-rose-300 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      {/* 6 Digit Input Boxes */}
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2.5" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className={`w-9 h-12 sm:w-12 sm:h-13 text-center text-lg sm:text-2xl font-black font-mono rounded-xl bg-slate-950 border transition-all focus:outline-none ${
                digit 
                  ? 'border-amber-400 text-amber-300 shadow-md shadow-amber-500/20 scale-105' 
                  : 'border-slate-800 text-white focus:border-amber-500'
              }`}
            />
          ))}
        </div>

        {/* Resend Timer & Action */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs px-1 text-slate-400">
          <div className="flex items-center space-x-1.5 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {countdown > 0 ? (
                <span>Yeniden Gönder: <strong className="text-amber-400">{countdown}s</strong></span>
              ) : (
                <span className="text-slate-400">Tekrar gönderebilirsiniz</span>
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || isLoading}
            className={`font-bold transition-all flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs cursor-pointer ${
              canResend 
                ? 'text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30' 
                : 'text-slate-600 bg-slate-900 cursor-not-allowed opacity-50'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Doğrulama E-postasını Tekrar Gönder</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={() => handleVerifyCode()}
          disabled={isLoading || digits.some(d => d === '')}
          className={`w-full py-3 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg transition-all ${
            isLoading || digits.some(d => d === '')
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/20 hover:scale-[1.01] active:scale-95 cursor-pointer'
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              <span>Doğrulanıyor...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Kodu Onayla ve Başla</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>

        {/* Check Firebase Email Link Button */}
        <button
          type="button"
          onClick={handleCheckEmailVerified}
          disabled={isCheckingFirebase}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isCheckingFirebase ? 'animate-spin' : ''}`} />
          <span>E-postamı Doğruladım (Durumu Kontrol Et)</span>
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors text-center cursor-pointer"
          >
            ← Geri dön veya e-postayı değiştir
          </button>
        )}
      </div>

    </div>
  );
};
