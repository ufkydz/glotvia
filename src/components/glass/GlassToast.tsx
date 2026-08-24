import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles, Flame, X } from 'lucide-react';

export interface GlassToastProps {
  id?: string;
  type?: 'success' | 'streak' | 'xp' | 'error' | 'info';
  title: string;
  message?: string;
  onClose?: () => void;
}

export const GlassToast: React.FC<GlassToastProps> = ({
  type = 'success',
  title,
  message,
  onClose,
}) => {
  let icon = <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
  let borderStyle = 'border-emerald-500/30 bg-emerald-950/40';
  let glow = 'shadow-[0_0_25px_rgba(16,185,129,0.3)]';

  if (type === 'streak') {
    icon = <Flame className="w-5 h-5 text-amber-400 animate-bounce" />;
    borderStyle = 'border-amber-500/30 bg-amber-950/40';
    glow = 'shadow-[0_0_25px_rgba(245,158,11,0.35)]';
  } else if (type === 'xp') {
    icon = <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />;
    borderStyle = 'border-cyan-500/30 bg-cyan-950/40';
    glow = 'shadow-[0_0_25px_rgba(6,182,212,0.35)]';
  } else if (type === 'error') {
    icon = <AlertCircle className="w-5 h-5 text-rose-400" />;
    borderStyle = 'border-rose-500/30 bg-rose-950/40';
    glow = 'shadow-[0_0_25px_rgba(244,63,94,0.35)]';
  } else if (type === 'info') {
    icon = <Sparkles className="w-5 h-5 text-purple-400" />;
    borderStyle = 'border-purple-500/30 bg-purple-950/40';
    glow = 'shadow-[0_0_25px_rgba(139,92,246,0.35)]';
  }

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-2xl border ${borderStyle} ${glow} text-white shadow-2xl transition-all duration-300 animate-slideDown max-w-[92vw] sm:max-w-md`}
    >
      <div className="shrink-0 p-2 rounded-xl bg-white/10">{icon}</div>
      <div className="flex flex-col min-w-0 pr-2">
        <span className="text-sm font-bold tracking-tight text-white">{title}</span>
        {message && <span className="text-xs text-slate-300 truncate">{message}</span>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors ml-auto shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
