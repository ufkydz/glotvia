import React from 'react';

export const GlassLoader: React.FC<{ message?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  message = 'Yükleniyor...',
  size = 'md'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-10 text-center select-none">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        <div className="absolute w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500/40 via-blue-500/30 to-purple-500/40 blur-sm animate-pulse" />
      </div>
      {message && (
        <p className="mt-4 text-sm font-medium text-slate-300 tracking-wide animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};
