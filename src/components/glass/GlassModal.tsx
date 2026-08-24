import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { GlassIconButton } from './GlassIconButton';

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  showCloseButton?: boolean;
}

export const GlassModal: React.FC<GlassModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  maxWidth = 'lg',
  showCloseButton = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Liquid Dark Glass Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative w-full ${maxWidthClass} my-auto bg-slate-900/85 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden z-10 transition-all duration-300 animate-scaleUp modal-scroll-container`}
      >
        {/* Specular Top Reflection */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-cyan-500/15 filter blur-3xl pointer-events-none rounded-full" />

        {/* Header */}
        {(title || showCloseButton) && (
          <div className="relative px-5 sm:px-7 pt-5 sm:pt-6 pb-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3 min-w-0">
              {icon && (
                <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                  {icon}
                </div>
              )}
              <div className="min-w-0">
                {title && (
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-xs sm:text-sm text-slate-400 truncate mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {showCloseButton && (
              <GlassIconButton
                size="sm"
                variant="ghost"
                onClick={onClose}
                aria-label="Kapat"
                className="shrink-0 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </GlassIconButton>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="relative px-5 sm:px-7 py-5">
          {children}
        </div>
      </div>
    </div>
  );
};
