import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'interactive' | 'cyan' | 'purple' | 'amber' | 'emerald';
  className?: string;
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  className = '',
  glow = false,
  ...props
}) => {
  let variantStyles = 'bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20';

  if (variant === 'elevated') {
    variantStyles = 'bg-slate-900/75 backdrop-blur-2xl border border-white/15 shadow-xl shadow-black/35';
  } else if (variant === 'interactive') {
    variantStyles = 'glass-card-interactive cursor-pointer';
  } else if (variant === 'cyan') {
    variantStyles = 'bg-gradient-to-br from-cyan-950/40 via-slate-900/65 to-slate-900/80 backdrop-blur-xl border border-cyan-500/25 shadow-lg shadow-cyan-950/30';
  } else if (variant === 'purple') {
    variantStyles = 'bg-gradient-to-br from-purple-950/40 via-slate-900/65 to-slate-900/80 backdrop-blur-xl border border-purple-500/25 shadow-lg shadow-purple-950/30';
  } else if (variant === 'amber') {
    variantStyles = 'bg-gradient-to-br from-amber-950/40 via-slate-900/65 to-slate-900/80 backdrop-blur-xl border border-amber-500/25 shadow-lg shadow-amber-950/30';
  } else if (variant === 'emerald') {
    variantStyles = 'bg-gradient-to-br from-emerald-950/40 via-slate-900/65 to-slate-900/80 backdrop-blur-xl border border-emerald-500/25 shadow-lg shadow-emerald-950/30';
  }

  const glowStyle = glow ? 'ring-1 ring-cyan-400/30 shadow-[0_0_25px_-5px_rgba(6,182,212,0.3)]' : '';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl transition-all duration-200 ${variantStyles} ${glowStyle} ${className}`}
      {...props}
    >
      {/* Specular Edge Highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
