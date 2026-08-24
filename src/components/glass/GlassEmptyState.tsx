import React from 'react';
import { Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { GlassButton } from './GlassButton';

interface GlassEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const GlassEmptyState: React.FC<GlassEmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <GlassCard variant="elevated" className={`p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}>
      <div className="p-4 rounded-3xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 mb-4 shadow-lg shadow-cyan-950/30">
        {icon || <BookOpen className="w-8 h-8" />}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <GlassButton variant="primary" onClick={onAction} rightIcon={<ArrowRight className="w-4 h-4" />}>
          {actionText}
        </GlassButton>
      )}
    </GlassCard>
  );
};
