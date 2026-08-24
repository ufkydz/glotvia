import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { GlassButton } from './GlassButton';

interface GlassErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export const GlassErrorState: React.FC<GlassErrorStateProps> = ({
  title = 'Bir şeyler ters gitti',
  description = 'Lütfen internet bağlantınızı kontrol edip tekrar deneyin.',
  onRetry,
  className = ''
}) => {
  return (
    <GlassCard variant="elevated" className={`p-8 sm:p-10 text-center flex flex-col items-center justify-center max-w-md mx-auto border-rose-500/25 bg-rose-950/20 ${className}`}>
      <div className="p-4 rounded-3xl bg-rose-500/15 border border-rose-500/30 text-rose-400 mb-4 shadow-lg shadow-rose-950/30">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-white tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-300 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {onRetry && (
        <GlassButton variant="secondary" onClick={onRetry} leftIcon={<RotateCcw className="w-4 h-4" />}>
          Tekrar Dene
        </GlassButton>
      )}
    </GlassCard>
  );
};
