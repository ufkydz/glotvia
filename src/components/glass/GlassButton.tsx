import React from 'react';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'glow' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-semibold rounded-xl min-h-[36px] gap-1.5',
    md: 'px-4 py-2.5 text-sm font-semibold rounded-2xl min-h-[44px] gap-2',
    lg: 'px-6 py-3.5 text-base font-bold rounded-2xl min-h-[50px] gap-2.5'
  }[size];

  let variantStyles = '';
  if (variant === 'primary') {
    variantStyles = 'glass-btn-primary text-white shadow-lg shadow-cyan-500/20';
  } else if (variant === 'secondary') {
    variantStyles = 'glass-btn-secondary text-slate-100 hover:text-white';
  } else if (variant === 'ghost') {
    variantStyles = 'bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-transparent hover:border-white/10 transition-all';
  } else if (variant === 'glow') {
    variantStyles = 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold border border-white/30 shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:shadow-[0_0_35px_rgba(6,182,212,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all';
  } else if (variant === 'danger') {
    variantStyles = 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 shadow-lg shadow-rose-950/30 transition-all';
  }

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer active:scale-[0.98]';

  return (
    <button
      type="button"
      disabled={disabled}
      className={`relative inline-flex items-center justify-center font-medium transition-all duration-200 select-none overflow-hidden ${sizeStyles} ${variantStyles} ${disabledStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {/* Specular Highlight Overlay */}
      <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
