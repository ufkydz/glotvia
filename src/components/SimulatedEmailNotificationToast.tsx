import React, { useState, useEffect } from 'react';
import { Mail, Check, Copy, X, Sparkles, ShieldCheck } from 'lucide-react';
import { playCoinSound } from '../utils/audioEffects';

interface EmailToastData {
  email: string;
  code: string;
  purpose: string;
  subject: string;
}

export const SimulatedEmailNotificationToast: React.FC = () => {
  const [toast, setToast] = useState<EmailToastData | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const handleEmailEvent = (e: any) => {
      if (e.detail) {
        setToast(e.detail);
        playCoinSound();

        // Auto close after 12 seconds
        const timer = setTimeout(() => {
          setToast(null);
        }, 12000);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('glotvia_email_received', handleEmailEvent);
    return () => window.removeEventListener('glotvia_email_received', handleEmailEvent);
  }, []);

  if (!toast) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(toast.code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] max-w-sm w-[94vw] sm:w-full animate-slideDown pointer-events-auto">
      <div className="relative overflow-hidden bg-slate-900/85 border border-amber-400/30 rounded-3xl p-4 shadow-2xl shadow-black/80 backdrop-blur-2xl text-white space-y-2.5">
        
        {/* Specular Highlight */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-300/40 to-transparent pointer-events-none" />

        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Mail className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Gelen E-posta Bildirimi</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-bold">
                  İletildi
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate max-w-[180px]">
                {toast.email}
              </div>
            </div>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subject & Body */}
        <div className="text-xs text-slate-200 bg-slate-950/60 border border-white/10 rounded-2xl p-2.5 space-y-1">
          <div className="font-semibold text-cyan-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 shrink-0" />
            <span className="truncate">{toast.subject}</span>
          </div>
          <div className="text-[11px] text-slate-300 pt-1 border-t border-white/5">
            Doğrulama bağlantısı ve 6 haneli kod e-posta adresinize gönderildi. Lütfen gelen kutunuzu ve Spam klasörünü kontrol ediniz.
          </div>
        </div>
      </div>
    </div>
  );
};
