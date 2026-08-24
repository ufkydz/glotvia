import React from 'react';
import { UserProfile } from '../types';
import { getUserTier, getTierDisplayName, NormalizedTier } from '../utils/tierPermissions';
import { Crown, Sparkles, Lock, ShieldCheck, ArrowRight, X, Volume2, Mic, Bot, Award, Zap } from 'lucide-react';

export interface PremiumGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPricing: (tab?: 'plans' | 'credits', packageId?: string) => void;
  currentUser: UserProfile | null;
  featureTitle: string;
  featureDescription?: string;
  requiredTier?: 'premium' | 'plus';
  iconType?: 'audio' | 'speaking' | 'ai' | 'exam' | 'recovery' | 'generic';
}

export const PremiumGateModal: React.FC<PremiumGateModalProps> = ({
  isOpen,
  onClose,
  onOpenPricing,
  currentUser,
  featureTitle,
  featureDescription,
  requiredTier = 'plus',
  iconType = 'generic'
}) => {
  if (!isOpen) return null;

  const currentTier = getUserTier(currentUser);
  const isPlusRequired = requiredTier === 'plus';

  const renderIcon = () => {
    switch (iconType) {
      case 'audio':
        return <Volume2 className="w-8 h-8 text-cyan-400" />;
      case 'speaking':
        return <Mic className="w-8 h-8 text-amber-400 animate-pulse" />;
      case 'ai':
        return <Bot className="w-8 h-8 text-indigo-400" />;
      case 'exam':
        return <Award className="w-8 h-8 text-amber-400" />;
      case 'recovery':
        return <Zap className="w-8 h-8 text-purple-400" />;
      default:
        return <Crown className="w-8 h-8 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900/95 backdrop-blur-2xl border border-amber-400/30 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden text-slate-100 p-6 sm:p-7 flex flex-col space-y-5 animate-scaleUp">
        
        {/* Glowing Top Ambient */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-600" />

        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge and Icon */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-orange-500/20 border border-amber-400/40 flex items-center justify-center shadow-lg shadow-amber-500/20">
            {renderIcon()}
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-[11px] font-extrabold text-amber-300 uppercase tracking-wider">
            <Lock className="w-3 h-3" />
            <span>{isPlusRequired ? 'Premium Plus Üyeliği Gereklidir' : 'Premium Üyeliği Gereklidir'}</span>
          </div>

          <h3 className="text-xl font-black text-white tracking-tight">
            {featureTitle}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
            {featureDescription || (
              isPlusRequired
                ? 'Bu özellik 24/7 canlı yapay zeka ve telaffuz koçluğu sağlayan Premium Plus üyelerine özeldir.'
                : 'Bu özelliğe sınırsız erişmek için üyeliğinizi Premium plana yükseltin.'
            )}
          </p>
        </div>

        {/* Feature Highlights Pill */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 text-left space-y-2 text-xs text-slate-300">
          <div className="font-bold text-white flex items-center gap-1.5 text-[11px] text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isPlusRequired ? 'Premium Plus ile Açılan Ayrıcalıklar:' : 'Premium ile Açılan Ayrıcalıklar:'}</span>
          </div>
          {isPlusRequired ? (
            <ul className="space-y-1.5 text-[11px] text-slate-300 pl-1">
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Canlı Gemini 2.0 AI Sohbetleri ve Hata Düzeltme</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Sesli Telaffuz Analizi & Goethe Sprechen Modülleri</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Goethe A1-B1 Sınav Simülatörü & Telafi Alanı</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Sınırsız Dinleme, Çevrimdışı Mod & Reklamsız</span>
              </li>
            </ul>
          ) : (
            <ul className="space-y-1.5 text-[11px] text-slate-300 pl-1">
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Tüm dillerde sınırsız doğal sesli dinleme</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Kelime tekrarı ve dilbilgisi gözden geçirme</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Dersleri atlama ve resmi başarı sertifikaları</span>
              </li>
            </ul>
          )}
        </div>

        {/* Current status info */}
        <div className="text-[11px] text-slate-400 text-center">
          Şu anki Planınız: <span className="font-bold text-white capitalize">{getTierDisplayName(currentTier)}</span>
        </div>

        {/* Action Button */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenPricing('plans');
            }}
            className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-sm rounded-2xl shadow-[0_0_25px_rgba(251,191,36,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Crown className="w-4 h-4 stroke-[2.5]" />
            <span>{isPlusRequired ? 'Premium Plus Planına Geç' : 'Premium Planına Geç'}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Daha Sonra
          </button>
        </div>

      </div>
    </div>
  );
};
