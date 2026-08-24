import React from 'react';

interface GlassIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'cyan' | 'purple' | 'amber' | 'emerald' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  className?: string;
}

export const GlassIconButton: React.FC<GlassIconButtonProps> = ({
  children,
  variant = 'default',
  size = 'md',
  active = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8 rounded-xl text-xs',
    md: 'w-11 h-11 rounded-2xl text-sm min-w-[44px] min-h-[44px]',
    lg: 'w-14 h-14 rounded-2xl text-base min-w-[48px] min-h-[48px]'
  }[size];

  let variantStyles = 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 hover:text-white border border-white/10 hover:border-white/25 shadow-md shadow-black/20';

  if (variant === 'primary' || active) {
    variantStyles = 'bg-gradient-to-tr from-cyan-500/30 to-blue-600/30 text-cyan-200 border border-cyan-400/40 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400/30';
  } else if (variant === 'cyan') {
    variantStyles = 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-950/20';
  } else if (variant === 'purple') {
    variantStyles = 'bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 shadow-md shadow-purple-950/20';
  } else if (variant === 'amber') {
    variantStyles = 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-950/20';
  } else if (variant === 'emerald') {
    variantStyles = 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 shadow-md shadow-emerald-950/20';
  } else if (variant === 'ghost') {
    variantStyles = 'bg-transparent hover:bg-white/10 text-slate-300 hover:text-white border border-transparent';
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={`relative inline-flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 select-none overflow-hidden ${sizeStyles} ${variantStyles} ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} ${className}`}
      {...props}
    >
      <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
      {children}
    </button>
  );
};
