import React from 'react';

interface GlassProgressProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  subLabel?: string;
  variant?: 'cyan' | 'purple' | 'amber' | 'emerald';
  showPercent?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const GlassProgress: React.FC<GlassProgressProps> = ({
  value,
  max = 100,
  label,
  subLabel,
  variant = 'cyan',
  showPercent = false,
  size = 'md',
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const heightClass = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4.5'
  }[size];

  let barGradient = 'from-cyan-500 via-blue-500 to-indigo-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]';
  if (variant === 'purple') {
    barGradient = 'from-purple-500 via-pink-500 to-rose-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]';
  } else if (variant === 'amber') {
    barGradient = 'from-amber-400 via-orange-500 to-red-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]';
  } else if (variant === 'emerald') {
    barGradient = 'from-emerald-400 via-teal-500 to-cyan-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]';
  }

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {(label || showPercent || subLabel) && (
        <div className="flex items-center justify-between text-xs font-semibold px-0.5">
          <div className="flex items-center gap-2">
            {label && <span className="text-slate-200">{label}</span>}
            {subLabel && <span className="text-slate-400 font-normal">{subLabel}</span>}
          </div>
          {showPercent && <span className="text-cyan-400 font-mono font-bold">%{percentage}</span>}
        </div>
      )}
      <div className={`w-full bg-slate-950/80 rounded-full p-0.5 border border-white/10 backdrop-blur-md overflow-hidden ${heightClass}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-500 ease-out relative overflow-hidden`}
          style={{ width: `${percentage}%` }}
        >
          {/* Subtle Liquid Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
};
