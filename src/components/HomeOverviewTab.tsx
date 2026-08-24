import React from 'react';
import { UserProfile, UserTokenState } from '../types';
import { CURRICULUM_TOPICS, CurriculumTopic } from '../data/germanCurriculumData';
import { getLanguageInfo } from '../data/languagesData';
import { 
  Sparkles, Flame, Coins, Award, ArrowRight, Play, CheckCircle2, 
  BookOpen, Mic, Brain, ShieldCheck, Crown, Gift, Target, Compass
} from 'lucide-react';
import { GlassCard } from './glass/GlassCard';
import { GlassButton } from './glass/GlassButton';
import { GlassBadge } from './glass/GlassBadge';

interface HomeOverviewTabProps {
  currentUser: UserProfile | null;
  tokenState: UserTokenState;
  onSelectTopic: (topic: CurriculumTopic) => void;
  onOpenShop: () => void;
  onClaimDailyBonus: () => void;
  canClaimDailyBonus: boolean;
  onOpenLanguageModal: () => void;
  onOpenPricing?: () => void;
  onGoToLessons: () => void;
  onGoToMessages: () => void;
}

export const HomeOverviewTab: React.FC<HomeOverviewTabProps> = ({
  currentUser,
  tokenState,
  onSelectTopic,
  onOpenShop,
  onClaimDailyBonus,
  canClaimDailyBonus,
  onOpenLanguageModal,
  onOpenPricing,
  onGoToLessons,
  onGoToMessages,
}) => {
  const completedCount = (tokenState.completedLessons || []).length;
  const progressPercent = Math.round((completedCount / CURRICULUM_TOPICS.length) * 100);

  // Find next active or uncompleted lesson (Preserves exact pedagogical order!)
  const nextLesson = CURRICULUM_TOPICS.find(t => !tokenState.completedLessons.includes(t.id)) || CURRICULUM_TOPICS[0];

  const targetLang = getLanguageInfo(currentUser?.targetLanguage || 'de');
  const nativeLang = getLanguageInfo(currentUser?.nativeLanguage || 'tr');

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-24 animate-fadeIn">
      
      {/* 1. TOP GREETING & MULTI-LANGUAGE BADGE BANNER */}
      <GlassCard variant="glow" glowColor="cyan" className="p-6 sm:p-8 relative overflow-hidden">
        <div className="liquid-light-aura w-80 h-80 -top-24 -right-24 pointer-events-none opacity-40" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            
            {/* Language Pair Pill */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onOpenLanguageModal}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <span>{nativeLang.flag} {nativeLang.name}</span>
                <ArrowRight className="w-3 h-3 text-cyan-400" />
                <span>{targetLang.flag} {targetLang.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-400/30 text-white font-extrabold uppercase ml-1">Değiştir</span>
              </button>

              <GlassBadge variant="indigo" size="sm">
                CEFR A1 - B1 Müfredatı
              </GlassBadge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {currentUser ? `Hoş Geldin, ${currentUser.name} 👋` : 'Glotvia\'ya Hoş Geldiniz 👋'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Özenle sıralanmış 16 ders, sesli telaffuz motoru ve Goethe sınav simülatörüyle dil öğrenim yolculuğuna devam et.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Daily Streak */}
            <div className="flex-1 md:flex-none p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center gap-3 shadow-inner">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 text-xl font-black">
                🔥
              </div>
              <div>
                <div className="text-[11px] font-bold text-amber-300">Günlük Seri</div>
                <div className="text-base font-black text-white">{tokenState.streakDays || 1} Gün</div>
              </div>
            </div>

            {/* Wallet & Coins */}
            <button
              type="button"
              onClick={onOpenShop}
              className="flex-1 md:flex-none p-3.5 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 flex items-center gap-3 shadow-inner transition-all cursor-pointer text-left"
            >
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 text-xl font-black">
                🪙
              </div>
              <div>
                <div className="text-[11px] font-bold text-cyan-300">Cüzdan / Kredi</div>
                <div className="text-base font-black text-white">{tokenState.coins} Kredi</div>
              </div>
            </button>
          </div>
        </div>

        {/* Daily Bonus Claim Bar */}
        {canClaimDailyBonus && (
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent p-3 rounded-2xl">
            <div className="flex items-center gap-2.5 text-xs text-amber-200 font-bold">
              <Gift className="w-5 h-5 text-amber-400 animate-bounce" />
              <span>Günün giriş bonusu hazır! <strong>+25 Kredi</strong> kazanmak için tıkla.</span>
            </div>
            <GlassButton
              variant="warning"
              size="sm"
              onClick={onClaimDailyBonus}
              className="w-full sm:w-auto font-black text-xs text-slate-950"
            >
              🎁 Bonusu Al (+25)
            </GlassButton>
          </div>
        )}
      </GlassCard>

      {/* 2. CONTINUE LEARNING BANNER (CURRENT NEXT LESSON) */}
      <GlassCard variant="liquid" className="p-6 sm:p-7 relative overflow-hidden border-amber-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[11px] font-black border border-amber-400/30">
                Sıradaki Ders (#{nextLesson.number})
              </span>
              <span className="text-xs text-slate-400 font-medium">
                ⏱️ {nextLesson.estimatedMinutes} Dakika
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {nextLesson.titleDe}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
                {nextLesson.titleTr} — {nextLesson.description}
              </p>
            </div>

            {/* Micro Progress Track */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span>Genel Müfredat İlerlemesi</span>
                <span className="text-cyan-400">%{progressPercent} ({completedCount}/{CURRICULUM_TOPICS.length})</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-900 border border-white/10 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
            <GlassButton
              variant="primary"
              size="lg"
              onClick={() => onSelectTopic(nextLesson)}
              className="w-full justify-center text-slate-950 font-black shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Ders {nextLesson.number}'e Başla</span>
            </GlassButton>

            <button
              type="button"
              onClick={onGoToLessons}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all text-center cursor-pointer"
            >
              Tüm 16 Dersi Gör ➔
            </button>
          </div>
        </div>
      </GlassCard>

      {/* 3. CORE 4 LEARNING HUBS (QUICK PRACTICE MODULES) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Hızlı Pratik & Sınav Araçları</span>
          </h3>
          <span className="text-xs text-slate-400">Goethe A1-B1 Standartları</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Card 1: Goethe Sprechen 130 Kalıp */}
          <div
            onClick={() => {
              const sprechenTopic = CURRICULUM_TOPICS.find(t => t.id === 'goethe_sprechen');
              if (sprechenTopic) onSelectTopic(sprechenTopic);
            }}
            className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-purple-500/30 hover:border-purple-400 hover:scale-[1.02] transition-all duration-200 cursor-pointer group shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl mb-3 group-hover:bg-purple-500 group-hover:text-slate-950 transition-colors">
              🗣️
            </div>
            <div className="text-xs font-bold text-purple-300">130 Konuşma Kalıbı</div>
            <h4 className="text-sm font-black text-white group-hover:text-purple-200 mt-0.5">Goethe Sprechen</h4>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">Rica cümleleri, kartlar, yasaklar ve sesli sınav pratiği.</p>
          </div>

          {/* Card 2: AI Telaffuz & Konuşma Koçu */}
          <div
            onClick={() => {
              const pronTopic = CURRICULUM_TOPICS.find(t => t.id === 'ai_pronunciation');
              if (pronTopic) onSelectTopic(pronTopic);
            }}
            className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-rose-500/30 hover:border-rose-400 hover:scale-[1.02] transition-all duration-200 cursor-pointer group shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-xl mb-3 group-hover:bg-rose-500 group-hover:text-slate-950 transition-colors">
              🎙️
            </div>
            <div className="text-xs font-bold text-rose-300">Canlı Mikrofon Analizi</div>
            <h4 className="text-sm font-black text-white group-hover:text-rose-200 mt-0.5">AI Telaffuz Koçu</h4>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">Mikrofona konuş, fonetik tonlama ve vurgu skorunu anında gör.</p>
          </div>

          {/* Card 3: Goethe Sınav Simülatörü */}
          <div
            onClick={() => {
              const simTopic = CURRICULUM_TOPICS.find(t => t.id === 'goethe_exam_simulation');
              if (simTopic) onSelectTopic(simTopic);
            }}
            className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-amber-500/30 hover:border-amber-400 hover:scale-[1.02] transition-all duration-200 cursor-pointer group shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl mb-3 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              🏆
            </div>
            <div className="text-xs font-bold text-amber-300">Mock Goethe A1 Sınavı</div>
            <h4 className="text-sm font-black text-white group-hover:text-amber-200 mt-0.5">Sınav Simülatörü</h4>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">Süreyle yarış, yetkinlik karneni ve CEFR seviyeni öğren.</p>
          </div>

          {/* Card 4: AI Sesli Sohbet & Mesajlaşma */}
          <div
            onClick={onGoToMessages}
            className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-cyan-500/30 hover:border-cyan-400 hover:scale-[1.02] transition-all duration-200 cursor-pointer group shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl mb-3 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
              💬
            </div>
            <div className="text-xs font-bold text-cyan-300">İnteraktif Diyaloglar</div>
            <h4 className="text-sm font-black text-white group-hover:text-cyan-200 mt-0.5">Sesli Pratik & Sohbet</h4>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">Kafede sipariş, otel, havaalanı ve günlük senaryolarda pratik yap.</p>
          </div>

        </div>
      </div>

      {/* 4. CREDIT & PROGRESS REWARD BANNER (+0.1 CREDIT / LESSON) */}
      <GlassCard variant="glow" glowColor="emerald" className="p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl font-black text-emerald-300 shrink-0">
            💎
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-400">Glotvia Kredi & Ödül Sistemi</div>
            <div className="text-sm sm:text-base font-black text-white">Tamamlanan Her Ders İçin +0.1 Kredi Kazanırsın</div>
            <p className="text-xs text-slate-300">Kredilerini yeni dersleri açmak veya Goethe sınav denemelerinde kullanabilirsin.</p>
          </div>
        </div>

        <GlassButton
          variant="secondary"
          size="sm"
          onClick={onOpenShop}
          className="w-full sm:w-auto shrink-0 font-extrabold text-xs"
        >
          <span>Kredi Mağazası</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </GlassButton>
      </GlassCard>

    </div>
  );
};
