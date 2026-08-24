import React from 'react';

interface GlassCapsuleProps {
  icon?: React.ReactNode;
  label: string;
  value?: string | number;
  subValue?: string;
  variant?: 'default' | 'cyan' | 'purple' | 'amber' | 'emerald' | 'rose';
  onClick?: () => void;
  className?: string;
}

export const GlassCapsule: React.FC<GlassCapsuleProps> = ({
  icon,
  label,
  value,
  subValue,
  variant = 'default',
  onClick,
  className = ''
}) => {
  let variantStyles = 'bg-slate-900/60 border-white/10 text-slate-200';
  let iconContainer = 'bg-white/10 text-cyan-400';

  if (variant === 'cyan') {
    variantStyles = 'bg-cyan-950/40 border-cyan-500/25 text-cyan-200 shadow-sm shadow-cyan-950/20';
    iconContainer = 'bg-cyan-500/20 text-cyan-300';
  } else if (variant === 'purple') {
    variantStyles = 'bg-purple-950/40 border-purple-500/25 text-purple-200 shadow-sm shadow-purple-950/20';
    iconContainer = 'bg-purple-500/20 text-purple-300';
  } else if (variant === 'amber') {
    variantStyles = 'bg-amber-950/40 border-amber-500/25 text-amber-200 shadow-sm shadow-amber-950/20';
    iconContainer = 'bg-amber-500/20 text-amber-300';
  } else if (variant === 'emerald') {
    variantStyles = 'bg-emerald-950/40 border-emerald-500/25 text-emerald-200 shadow-sm shadow-emerald-950/20';
    iconContainer = 'bg-emerald-500/20 text-emerald-300';
  } else if (variant === 'rose') {
    variantStyles = 'bg-rose-950/40 border-rose-500/25 text-rose-200 shadow-sm shadow-rose-950/20';
    iconContainer = 'bg-rose-500/20 text-rose-300';
  }

  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl backdrop-blur-xl border shadow-md transition-all ${variantStyles} ${isClickable ? 'cursor-pointer hover:scale-[1.02] active:scale-95 hover:border-white/20' : ''} ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      {icon && (
        <div className={`p-1.5 rounded-xl shrink-0 ${iconContainer}`}>
          {icon}
        </div>
      )}
      <div className="flex flex-col text-left leading-tight min-w-0">
        <span className="text-[11px] font-medium text-slate-400 tracking-wide uppercase truncate">{label}</span>
        {value !== undefined && (
          <span className="text-sm font-bold text-white tracking-tight flex items-baseline gap-1">
            {value}
            {subValue && <span className="text-[10px] text-slate-400 font-normal">{subValue}</span>}
          </span>
        )}
      </div>
    </div>
  );
};

export const GlassBadge: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'cyan' | 'purple' | 'amber' | 'emerald' | 'gold';
  className?: string;
}> = ({
  children,
  variant = 'default',
  className = ''
}) => {
  let style = 'bg-white/10 text-slate-200 border-white/10';
  if (variant === 'cyan') style = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
  if (variant === 'purple') style = 'bg-purple-500/15 text-purple-300 border-purple-500/30';
  if (variant === 'amber') style = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  if (variant === 'emerald') style = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
  if (variant === 'gold') style = 'bg-gradient-to-r from-amber-400/20 to-yellow-400/20 text-yellow-300 border-amber-400/40 shadow-sm shadow-amber-950/40';

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-md border ${style} ${className}`}>
      {children}
    </span>
  );
};
