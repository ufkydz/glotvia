import React from 'react';
import { Mic, Volume2, Sparkles, Bot } from 'lucide-react';

interface AiVoiceOrbProps {
  state?: 'idle' | 'listening' | 'speaking' | 'processing';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  label?: string;
}

export const AiVoiceOrb: React.FC<AiVoiceOrbProps> = ({
  state = 'idle',
  size = 'md',
  onClick,
  className = '',
  label
}) => {
  const sizeConfig = {
    sm: {
      container: 'w-20 h-20',
      orb: 'w-16 h-16',
      icon: 'w-6 h-6',
      waves: 3,
    },
    md: {
      container: 'w-32 h-32',
      orb: 'w-24 h-24',
      icon: 'w-9 h-9',
      waves: 4,
    },
    lg: {
      container: 'w-44 h-44',
      orb: 'w-32 h-32',
      icon: 'w-12 h-12',
      waves: 5,
    }
  }[size];

  const isListening = state === 'listening';
  const isSpeaking = state === 'speaking';
  const isProcessing = state === 'processing';

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Outer Ripple Waves */}
      <div className={`relative flex items-center justify-center ${sizeConfig.container}`}>
        {(isListening || isSpeaking) && (
          <>
            <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping opacity-40" />
            <div className="absolute -inset-3 rounded-full border border-purple-500/30 animate-pulse opacity-30" />
          </>
        )}

        {/* The Central Glowing Liquid Orb */}
        <button
          type="button"
          onClick={onClick}
          aria-label={label || 'AI Ses Orb'}
          className={`relative z-10 flex items-center justify-center rounded-full transition-all duration-300 ai-voice-orb-glow ${sizeConfig.orb} ${
            isListening ? 'ai-voice-orb-listening' : isSpeaking ? 'ai-voice-orb-speaking' : 'hover:scale-105'
          } ${onClick ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
        >
          {/* Surface Specular Glare */}
          <div className="absolute top-1 left-2 w-1/3 h-1/4 rounded-full bg-gradient-to-b from-white/60 to-transparent pointer-events-none filter blur-[1px]" />

          {/* Inner Waveform or Icon */}
          {isListening ? (
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-6 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-9 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-12 bg-white rounded-full animate-bounce" />
              <span className="w-1.5 h-9 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-6 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
            </div>
          ) : isSpeaking ? (
            <Volume2 className={`${sizeConfig.icon} text-white animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]`} />
          ) : isProcessing ? (
            <Sparkles className={`${sizeConfig.icon} text-white animate-spin drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]`} />
          ) : (
            <Bot className={`${sizeConfig.icon} text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]`} />
          )}
        </button>
      </div>

      {label && (
        <span className="mt-3 text-xs sm:text-sm font-semibold tracking-wide text-slate-300 text-center flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-cyan-400 animate-ping' : isSpeaking ? 'bg-purple-400 animate-pulse' : 'bg-slate-500'}`} />
          {label}
        </span>
      )}
    </div>
  );
};
