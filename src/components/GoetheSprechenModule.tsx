import React, { useState, useMemo } from 'react';
import { 
  SPRECHEN_BITTEN_130_ITEMS, 
  SPRECHEN_CATEGORY_GROUPS, 
  VERBOT_WARNING_PATTERNS,
  SprechenBittenItem
} from '../data/sprechenBittenData';
import { getSprechenCardVisual, SprechenCardVisual } from '../data/sprechenImages';
import { speakText, speakSequence } from '../utils/speechUtils';
import { playCoinSound, playSuccessChime } from '../utils/audioEffects';
import { 
  Volume2, CheckCircle2, Sparkles, Search, 
  Filter, Layers, ArrowRight, ArrowLeft, 
  RotateCcw, ShieldCheck, Check, Mic,
  Hand, ShoppingCart, UtensilsCrossed, MapPin, Users,
  CheckCircle, Calendar, Power, Ban, Info, Shuffle,
  Eye, EyeOff, MessageSquare, Image as ImageIcon,
  Sparkle, Award, Compass, RefreshCw
} from 'lucide-react';

interface GoetheSprechenModuleProps {
  onEarnTokens?: (amount: number, message: string) => void;
  onOpenPronunciation?: (phrase: string) => void;
}

export const GoetheSprechenModule: React.FC<GoetheSprechenModuleProps> = ({
  onEarnTokens,
  onOpenPronunciation
}) => {
  // State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [speechSpeed, setSpeechSpeed] = useState<number>(0.70);
  const [viewMode, setViewMode] = useState<'cards' | 'flashcards' | 'dialogue_trainer'>('cards');
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());
  
  // Track failed images to display resilient illustration fallback
  const [imageErrorMap, setImageErrorMap] = useState<Record<number, boolean>>({});

  // Flashcard State
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Dialogue Trainer State
  const [trainerIndex, setTrainerIndex] = useState<number>(0);
  const [trainerStep, setTrainerStep] = useState<'question' | 'answer'>('question');
  const [trainerScore, setTrainerScore] = useState<number>(0);

  // Reset indices when category or search changes to prevent out-of-bound errors
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setFlashcardIndex(0);
    setTrainerIndex(0);
    setIsFlipped(false);
    setTrainerStep('question');
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setFlashcardIndex(0);
    setTrainerIndex(0);
    setIsFlipped(false);
    setTrainerStep('question');
  };

  // Filtered items
  const filteredItems = useMemo(() => {
    return SPRECHEN_BITTEN_130_ITEMS.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term || 
        item.number.toString().includes(term) ||
        item.questionSentenceDe.toLowerCase().includes(term) ||
        item.questionSentenceTr.toLowerCase().includes(term) ||
        item.wordDe.toLowerCase().includes(term) ||
        item.wordTr.toLowerCase().includes(term) ||
        item.verbDe.toLowerCase().includes(term) ||
        (item.pronunciation && item.pronunciation.toLowerCase().includes(term));
      
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  // Safe Clamped Indices
  const safeFlashcardIndex = Math.min(flashcardIndex, Math.max(0, filteredItems.length - 1));
  const safeTrainerIndex = Math.min(trainerIndex, Math.max(0, filteredItems.length - 1));

  // Handle Play Audio
  const handlePlay = async (text: string, id: string) => {
    setPlayingId(id);
    try {
      await speakText(text, 'de', speechSpeed);
    } finally {
      setPlayingId(null);
    }
  };

  // Handle Play Dialogue (Question + Answer)
  const handlePlayDialogue = async (item: SprechenBittenItem) => {
    const id = `dialogue_${item.id}`;
    setPlayingId(id);
    try {
      await speakSequence([
        { text: item.questionSentenceDe, languageId: 'de', rate: speechSpeed, pauseAfterMs: 600 },
        { text: item.answerDe, languageId: 'de', rate: speechSpeed, pauseAfterMs: 200 }
      ]);
    } finally {
      setPlayingId(null);
    }
  };

  // Toggle Item Completed & Earn Tokens
  const handleToggleComplete = (itemId: number) => {
    setCompletedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
        if (onEarnTokens) {
          playCoinSound();
          onEarnTokens(5, `Tebrikler! Goethe A1 Sprechen Kart #${itemId} tamamlandı! (+5 Jeton)`);
        }
      }
      return next;
    });
  };

  // Get Category Icon
  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'geben': return <Hand className="w-4 h-4 text-amber-400" />;
      case 'kaufen': return <ShoppingCart className="w-4 h-4 text-emerald-400" />;
      case 'bringen': return <UtensilsCrossed className="w-4 h-4 text-rose-400" />;
      case 'zeigen': return <MapPin className="w-4 h-4 text-sky-400" />;
      case 'mit_mir': return <Users className="w-4 h-4 text-purple-400" />;
      case 'bitte_tun': return <CheckCircle2 className="w-4 h-4 text-indigo-400" />;
      case 'termin_info': return <Calendar className="w-4 h-4 text-teal-400" />;
      case 'auf_zu_schalten': return <Power className="w-4 h-4 text-orange-400" />;
      case 'verbote': return <Ban className="w-4 h-4 text-red-400" />;
      default: return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  const activeGroup = SPRECHEN_CATEGORY_GROUPS.find(g => g.id === selectedCategory);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-500/30 px-3.5 py-1.5 rounded-full text-indigo-300 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Goethe A1 Sınavı Sprechen & Bitten Modülü</span>
            </div>

            <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Tamamlanan: <strong className="text-white">{completedItems.size}</strong> / 130</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              130 Resimli Goethe A1 Sprechen Kartları
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Sınavda karşılaşabileceğiniz tüm rica kalıpları (<em>geben, kaufen, bringen, zeigen, auf/zumachen, anschalten</em>), randevu diyalogları ve 25 yasak tabelası (<em>Man darf hier nicht...</em>) sesli telaffuzlarıyla.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
              <div className="text-xs text-slate-400">Toplam Kalıp</div>
              <div className="text-lg font-black text-white">130 Resimli Kart</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
              <div className="text-xs text-slate-400">9 Ana Kategori</div>
              <div className="text-lg font-black text-indigo-300">A1-Garantili</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
              <div className="text-xs text-slate-400">Sesli Telaffuz</div>
              <div className="text-lg font-black text-amber-300">Soru + Cevap</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
              <div className="text-xs text-slate-400">Jeton Kazanımı</div>
              <div className="text-lg font-black text-emerald-400">+650 Jeton</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Switcher & Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'cards'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Kart Listesi (130)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setViewMode('flashcards');
              setFlashcardIndex(0);
              setIsFlipped(false);
            }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'flashcards'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shuffle className="w-4 h-4" />
            <span>Flashcard / Ezber</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setViewMode('dialogue_trainer');
              setTrainerIndex(0);
              setTrainerStep('question');
            }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'dialogue_trainer'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Diyalog Antrenörü</span>
          </button>
        </div>

        {/* Speed & Search Bar */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">Hız:</span>
            {[
              { rate: 0.55, label: '0.55x (Yavaş & Net)' },
              { rate: 0.70, label: '0.70x (İdeal)' },
              { rate: 0.85, label: '0.85x' },
              { rate: 1.0, label: '1.0x' }
            ].map(s => (
              <button
                key={s.rate}
                type="button"
                onClick={() => setSpeechSpeed(s.rate)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  speechSpeed === s.rate ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title={`Seslendirme hızı: ${s.label}`}
              >
                {s.rate}x
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Kelimede veya cümlede ara..."
              className="w-full bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <Filter className="w-4 h-4 text-indigo-400" />
            <span>Kategori ve Konu Grupları</span>
          </h2>
          <span className="text-xs text-slate-400">{filteredItems.length} kalıp listeleniyor</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={`shrink-0 flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tüm Kalıplar (130)</span>
          </button>

          {SPRECHEN_CATEGORY_GROUPS.map(group => {
            const isSelected = selectedCategory === group.id;
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => handleCategoryChange(group.id)}
                className={`shrink-0 flex items-center space-x-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {getCategoryIcon(group.id)}
                <span>{group.title}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {group.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Category Header & Pattern Formula */}
      {activeGroup && (
        <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/30 p-5 rounded-3xl space-y-3 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {getCategoryIcon(activeGroup.id)}
              </div>
              <div>
                <h3 className="text-base font-black text-white">{activeGroup.title}</h3>
                <p className="text-xs text-indigo-300">{activeGroup.badge}</p>
              </div>
            </div>
            <div className="text-xs text-slate-400 font-mono">Kalıp #{activeGroup.itemsRange}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Soru Şablonu (Frage):</span>
              <p className="text-white font-bold">{activeGroup.patternDe}</p>
              <p className="text-slate-400 italic">🇹🇷 {activeGroup.patternTr}</p>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Cevap Şablonu (Antwort):</span>
              <p className="text-white font-bold">{activeGroup.answerPatternDe}</p>
              <p className="text-slate-400 italic">🇹🇷 {activeGroup.answerPatternTr}</p>
            </div>
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {filteredItems.length === 0 && (
        <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-3xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Sonuç Bulunamadı</h3>
            <p className="text-xs text-slate-400">"{searchTerm}" aramasına uygun kelime veya kalıp bulunamadı.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchTerm('');
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            Filtreleri Temizle
          </button>
        </div>
      )}

      {/* VIEW MODE 1: CARDS LIST */}
      {viewMode === 'cards' && filteredItems.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredItems.map(item => {
              const isItemPlaying = playingId === `item_${item.id}`;
              const isDialoguePlaying = playingId === `dialogue_${item.id}`;
              const isAnsPlaying = playingId === `ans_${item.id}`;
              const isCompleted = completedItems.has(item.id);
              const visual = getSprechenCardVisual(item.id, item.wordTr);
              const hasImageError = !!imageErrorMap[item.id];
              const isVerbot = item.category === 'verbote' || visual.signType === 'prohibition';

              return (
                <div
                  key={item.id}
                  className={`group bg-slate-900/90 border rounded-3xl overflow-hidden p-4 sm:p-5 space-y-4 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 ${
                    isCompleted ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-slate-800'
                  }`}
                >
                  {/* 1. GÖRSEL KART BAŞLIĞI (NET VE ANLAŞILIR GOETHE SINAV KARTI) */}
                  <div className="relative h-52 sm:h-56 w-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border border-slate-800/80 group-hover:border-indigo-500/40 transition-all flex items-center justify-center">
                    
                    {isVerbot ? (
                      /* Otantik Goethe Yasak / Kural Tabelası (Kırmızı Yuvarlak & Net Çapraz Çizgi) */
                      <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 relative">
                        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-[6px] border-red-600 bg-white flex items-center justify-center shadow-2xl shadow-red-500/30">
                          <div className="absolute w-[104%] h-2.5 bg-red-600 rotate-45 pointer-events-none rounded-full z-10" />
                          <span className="text-5xl sm:text-6xl drop-shadow select-none z-0">
                            {visual.emoji.replace('🚫', '') || '⛔'}
                          </span>
                        </div>
                        <span className="mt-2 text-[11px] font-black text-red-400 uppercase tracking-widest bg-red-950/90 px-3 py-1 rounded-full border border-red-500/40 shadow-sm">
                          ⛔ RAUCHEN / HANDY / ESSEN VERBOTEN
                        </span>
                      </div>
                    ) : !hasImageError ? (
                      <img
                        src={visual.photoUrl}
                        alt={`${visual.wordDe} (${visual.wordTr})`}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        onError={() => {
                          setImageErrorMap(prev => ({ ...prev, [item.id]: true }));
                        }}
                      />
                    ) : (
                      /* Illustrated Fallback Banner with rich icon and emoji */
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 space-y-2">
                        <span className="text-6xl sm:text-7xl drop-shadow-md">
                          {visual.emoji}
                        </span>
                        <span className="text-sm font-black text-indigo-300 bg-indigo-950/80 px-3 py-1 rounded-xl border border-indigo-500/30">
                          {visual.themeTag}
                        </span>
                      </div>
                    )}
                    
                    {/* Subtle Gradient Overlay for Text Readability without obscuring images */}
                    {!isVerbot && (
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
                    )}

                    {/* Top Overlay: Number, Category & Action Buttons */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
                      <div className="flex items-center space-x-2 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700/60 shadow-lg">
                        <span className="w-6 h-6 rounded-lg bg-indigo-500/30 text-indigo-300 font-mono font-black text-xs flex items-center justify-center border border-indigo-500/40">
                          #{item.number}
                        </span>
                        <span className="text-xs font-bold text-white flex items-center space-x-1">
                          {getCategoryIcon(item.category)}
                          <span className="truncate max-w-[120px] sm:max-w-[160px]">{visual.themeTag || item.categoryTitle}</span>
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5 bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/60 shadow-lg">
                        {/* Full Dialogue Audio */}
                        <button
                          type="button"
                          onClick={() => handlePlayDialogue(item)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-all ${
                            isDialoguePlaying
                              ? 'bg-amber-500 text-slate-950 animate-pulse'
                              : 'bg-slate-800/80 hover:bg-slate-700 text-amber-300'
                          }`}
                          title="Diyaloğu Dinle (Soru + Cevap)"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Diyalog</span>
                        </button>

                        {/* AI Pronunciation Jump */}
                        {onOpenPronunciation && (
                          <button
                            type="button"
                            onClick={() => onOpenPronunciation(item.questionSentenceDe)}
                            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition-all"
                            title="Mikrofon ile AI Telaffuz Koçunda Pratik Yap"
                          >
                            <Mic className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Complete Checkbox */}
                        <button
                          type="button"
                          onClick={() => handleToggleComplete(item.id)}
                          className={`p-1.5 rounded-lg transition-all ${
                            isCompleted
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                          title={isCompleted ? 'Tamamlandı (+5 Jeton kazanıldı)' : 'Tamamlandı olarak işaretle'}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Image Tag: Visual Keyword & Turkish Meaning */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-700/70">
                      <div className="flex items-center space-x-2">
                        <span className="text-base">{visual.emoji}</span>
                        <span className="text-sm font-black text-white">{item.wordDe}</span>
                      </div>
                      <span className="text-xs font-semibold text-amber-300">🇹🇷 {item.wordTr}</span>
                    </div>
                  </div>

                  {/* 2. RESMİN ALTINDAKİ BİLGİLER: ANLAMI, CÜMLELERİ VE CEVAPLARI */}
                  <div className="space-y-3 pt-1">
                    
                    {/* A. KELİME ANLAMI VE OKUNUŞU (WORT & BEDEUTUNG) */}
                    <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kelime:</span>
                        <strong className="text-indigo-300 font-bold text-sm">{item.wordDe}</strong>
                        <span className="text-slate-400">({item.wordTr})</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-xs text-amber-300 font-mono bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                        <span className="text-slate-400 font-sans text-[10px]">Okunuş:</span>
                        <span>[{item.pronunciation}]</span>
                      </div>
                    </div>

                    {/* B. ALMANCA RİCA / SORU CÜMLESİ (FRAGESATZ / BITTE) */}
                    <div className="space-y-2 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-950 p-4 rounded-2xl border border-indigo-500/30">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider flex items-center space-x-1">
                          <Sparkles className="w-3 h-3 text-indigo-400" />
                          <span>Almanca Rica / Soru Cümlesi:</span>
                        </span>
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handlePlay(item.questionSentenceDe, `item_${item.id}`)}
                            className={`p-1.5 rounded-xl transition-all ${
                              isItemPlaying
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 animate-pulse'
                                : 'bg-indigo-950/80 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30'
                            }`}
                            title="Almanca Soruyu Dinle"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-base sm:text-lg font-black text-white leading-snug tracking-tight">
                        {item.questionSentenceDe}
                      </p>

                      <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                        🇹🇷 <strong className="text-slate-200">Türkçe Anlamı:</strong> {item.questionSentenceTr}
                      </p>
                    </div>

                    {/* C. STANDART CEVAP (ANTWORT) */}
                    <div className="space-y-2 bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-950 p-4 rounded-2xl border border-emerald-500/30">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Standart Sınav Cevabı (Antwort):</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handlePlay(item.answerDe, `ans_${item.id}`)}
                          className={`p-1.5 rounded-xl transition-all ${
                            isAnsPlaying
                              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 animate-pulse'
                              : 'bg-emerald-950/80 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30'
                          }`}
                          title="Cevabı Dinle"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-sm sm:text-base font-black text-white leading-snug">
                        {item.answerDe}
                      </p>

                      <p className="text-xs text-slate-300 font-medium leading-relaxed bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                        🇹🇷 <strong className="text-slate-200">Cevap Çevirisi:</strong> {item.answerTr}
                      </p>
                    </div>

                    {/* D. EYLEM / FİİL & ÖZEL NOT BÖLÜMÜ */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                      <div className="text-slate-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 flex items-center space-x-1.5">
                        <span className="text-indigo-400 font-bold">Fiil:</span>
                        <strong className="text-slate-200 font-bold">{item.verbDe}</strong>
                        <span className="text-slate-500">({item.verbTr})</span>
                      </div>

                      {item.note && (
                        <div className="w-full text-[11px] text-amber-300/95 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl flex items-start space-x-2">
                          <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                          <span className="leading-relaxed"><strong>Sınav İpucu:</strong> {item.note}</span>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: FLASHCARD / EZBER MODU */}
      {viewMode === 'flashcards' && filteredItems.length > 0 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Kart {safeFlashcardIndex + 1} / {filteredItems.length}</span>
            <span>{isFlipped ? 'Cevap / Almanca gösteriliyor' : 'Soru / Türkçe gösteriliyor'}</span>
          </div>

          {/* Flashcard Box with Image */}
          {(() => {
            const current = filteredItems[safeFlashcardIndex] || filteredItems[0];
            if (!current) return null;
            const currentVisual = getSprechenCardVisual(current.id, current.wordTr);
            const hasImageError = !!imageErrorMap[current.id];
            const isVerbot = current.category === 'verbote' || currentVisual.signType === 'prohibition';

            return (
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className={`cursor-pointer min-h-[380px] sm:min-h-[420px] rounded-3xl p-6 sm:p-8 border transition-all duration-300 flex flex-col justify-between shadow-2xl relative select-none overflow-hidden ${
                  isFlipped 
                    ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-indigo-500/50 shadow-indigo-500/20'
                    : 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-slate-800 shadow-black/40'
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/20 px-2.5 py-1 rounded-lg border border-indigo-500/30">
                    Kart #{current.number} • {currentVisual.themeTag || current.categoryTitle}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center space-x-1">
                    {isFlipped ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-amber-400" />}
                    <span>{isFlipped ? 'Çevir (Gizle)' : 'Tıkla ve Çevir'}</span>
                  </span>
                </div>

                {/* Card Image preview */}
                <div className="my-3 relative h-40 w-full rounded-2xl overflow-hidden border border-slate-700/50 shadow-md flex items-center justify-center bg-slate-950">
                  {isVerbot ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950">
                      <div className="relative w-20 h-20 rounded-full border-4 border-red-600 bg-white flex items-center justify-center shadow-lg">
                        <div className="absolute w-[104%] h-2 bg-red-600 rotate-45 pointer-events-none rounded-full z-10" />
                        <span className="text-3xl select-none z-0">
                          {currentVisual.emoji.replace('🚫', '') || '⛔'}
                        </span>
                      </div>
                      <span className="mt-1 text-[10px] font-black text-red-400 tracking-wider">
                        ⛔ VERBOTEN
                      </span>
                    </div>
                  ) : !hasImageError ? (
                    <img
                      src={currentVisual.photoUrl}
                      alt={`${currentVisual.wordDe} (${currentVisual.wordTr})`}
                      className="w-full h-full object-cover"
                      onError={() => setImageErrorMap(prev => ({ ...prev, [current.id]: true }))}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-3 text-center">
                      <span className="text-4xl">{currentVisual.emoji}</span>
                      <span className="text-xs font-bold text-indigo-300 mt-1">{current.wordDe}</span>
                    </div>
                  )}
                  {!isVerbot && (
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  )}
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs z-10">
                    <span className="font-bold text-white bg-slate-900/90 px-2 py-0.5 rounded-lg border border-slate-700 flex items-center space-x-1">
                      <span>{currentVisual.emoji}</span>
                      <span>{current.wordDe}</span>
                    </span>
                    <span className="text-amber-300 font-semibold bg-slate-900/90 px-2 py-0.5 rounded-lg border border-slate-700">
                      🇹🇷 {current.wordTr}
                    </span>
                  </div>
                </div>

                {/* Center Content */}
                <div className="text-center space-y-3 my-auto py-2">
                  {!isFlipped ? (
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">Türkçe Rica / Soru:</div>
                      <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                        {current.questionSentenceTr}
                      </h3>
                      <div className="text-xs text-slate-400">
                        Kelime: <strong className="text-indigo-300">{current.wordTr}</strong> ({current.wordDe})
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Almanca Cümle:</div>
                      <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                        {current.questionSentenceDe}
                      </h3>
                      <div className="text-xs font-mono text-amber-300">
                        [{current.pronunciation}]
                      </div>
                      <div className="pt-2 border-t border-slate-800 max-w-md mx-auto text-xs text-slate-300">
                        <span className="font-bold text-emerald-400">Cevap: </span>
                        {current.answerDe}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Bar with Audio */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <span className="text-xs text-slate-500">Çevirmek için karta tıklayın</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlay(current.questionSentenceDe, `fc_${current.id}`);
                    }}
                    className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all"
                    title="Almanca Cümleyi Dinle"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Flashcard Navigation Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              disabled={safeFlashcardIndex === 0}
              onClick={() => {
                setFlashcardIndex(prev => Math.max(0, prev - 1));
                setIsFlipped(false);
              }}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white font-bold text-xs disabled:opacity-40 hover:bg-slate-800 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Önceki Kart</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-6 py-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 font-bold text-xs hover:bg-indigo-600/30 transition-all"
            >
              {isFlipped ? 'Soruyu Göster' : 'Cevabı Göster'}
            </button>

            <button
              type="button"
              disabled={safeFlashcardIndex >= filteredItems.length - 1}
              onClick={() => {
                setFlashcardIndex(prev => Math.min(filteredItems.length - 1, prev + 1));
                setIsFlipped(false);
              }}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs disabled:opacity-40 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30"
            >
              <span>Sonraki Kart</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: DIYALOG ANTRENÖRÜ (DIALOGUE TRAINER) */}
      {viewMode === 'dialogue_trainer' && filteredItems.length > 0 && (
        <div className="max-w-3xl mx-auto space-y-6">
          {(() => {
            const current = filteredItems[safeTrainerIndex] || filteredItems[0];
            if (!current) return null;
            const currentVisual = getSprechenCardVisual(current.id, current.wordTr);
            const hasImageError = !!imageErrorMap[current.id];
            const isVerbot = current.category === 'verbote' || currentVisual.signType === 'prohibition';

            return (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5 text-emerald-400" />
                      <span>Goethe A1 Sprechen Rol Yapma Simülatörü</span>
                    </h3>
                    <p className="text-xs text-slate-400">Kart {safeTrainerIndex + 1} / {filteredItems.length} • Puan: {trainerScore}</p>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-bold border border-emerald-500/30">
                    +10 Jeton / Tamamlama
                  </span>
                </div>

                {/* Scenario Image Banner */}
                <div className="relative h-36 sm:h-44 w-full rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center bg-slate-950">
                  {isVerbot ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950">
                      <div className="relative w-20 h-20 rounded-full border-4 border-red-600 bg-white flex items-center justify-center shadow-lg">
                        <div className="absolute w-[104%] h-2 bg-red-600 rotate-45 pointer-events-none rounded-full z-10" />
                        <span className="text-3xl select-none z-0">
                          {currentVisual.emoji.replace('🚫', '') || '⛔'}
                        </span>
                      </div>
                      <span className="mt-1 text-[10px] font-black text-red-400 tracking-wider">
                        ⛔ VERBOTEN
                      </span>
                    </div>
                  ) : !hasImageError ? (
                    <img
                      src={currentVisual.photoUrl}
                      alt={`${currentVisual.wordDe} (${currentVisual.wordTr})`}
                      className="w-full h-full object-cover"
                      onError={() => setImageErrorMap(prev => ({ ...prev, [current.id]: true }))}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-2">
                      <span className="text-4xl">{currentVisual.emoji}</span>
                      <span className="text-xs font-bold text-indigo-300 mt-1">{current.wordDe}</span>
                    </div>
                  )}
                  {!isVerbot && (
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
                  )}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs z-10">
                    <span className="font-bold text-white bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-700 flex items-center space-x-1.5">
                      <span>{currentVisual.emoji}</span>
                      <span>Konu: {current.wordDe} ({current.wordTr})</span>
                    </span>
                    <span className="text-indigo-300 font-mono bg-indigo-950/90 px-3 py-1 rounded-xl border border-indigo-500/30">
                      [{current.pronunciation}]
                    </span>
                  </div>
                </div>

                {/* Dialogue Chat Simulation */}
                <div className="space-y-4">
                  {/* Person A: Question Bubble */}
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-lg">
                      Sen
                    </div>
                    <div className="bg-indigo-950/60 border border-indigo-500/30 rounded-2xl rounded-tl-sm p-4 space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-indigo-300 uppercase">1. Adım: Rica Cümlesi Kur</span>
                        <button
                          type="button"
                          onClick={() => handlePlay(current.questionSentenceDe, 'trainer_q')}
                          className="p-1 text-indigo-300 hover:text-white"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-base font-black text-white">{current.questionSentenceDe}</p>
                      <p className="text-xs text-slate-300">🇹🇷 {current.questionSentenceTr}</p>
                      <p className="text-xs font-mono text-amber-300">[{current.pronunciation}]</p>
                    </div>
                  </div>

                  {/* Person B: Answer Bubble */}
                  {trainerStep === 'answer' && (
                    <div className="flex items-start space-x-3 flex-row-reverse space-x-reverse animate-fadeIn">
                      <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-lg">
                        Goethe
                      </div>
                      <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-2xl rounded-tr-sm p-4 space-y-2 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-emerald-300 uppercase">2. Adım: Partnerin Yanıtı</span>
                          <button
                            type="button"
                            onClick={() => handlePlay(current.answerDe, 'trainer_a')}
                            className="p-1 text-emerald-300 hover:text-white"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-base font-black text-white">{current.answerDe}</p>
                        <p className="text-xs text-slate-300">🇹🇷 {current.answerTr}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setTrainerIndex(prev => (prev + 1) % filteredItems.length);
                      setTrainerStep('question');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:text-white"
                  >
                    Atla / Sonraki
                  </button>

                  {trainerStep === 'question' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setTrainerStep('answer');
                        handlePlay(current.answerDe, 'trainer_a');
                      }}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-2"
                    >
                      <span>Cevabı Dinle & Yanıtla</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setTrainerScore(s => s + 10);
                        if (onEarnTokens) {
                          playSuccessChime();
                          onEarnTokens(10, `Harika diyalog tamamlandı! (+10 Jeton)`);
                        }
                        setTrainerIndex(prev => (prev + 1) % filteredItems.length);
                        setTrainerStep('question');
                      }}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Tamamladım (+10 Jeton)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Special Verbot Pattern Cheat Sheet */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
            <Ban className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Goethe A1 Yasak & Kural Cümlesi Kalıpları</h3>
            <p className="text-xs text-slate-400">Sınavda yasak tabelaları veya ricaya ret durumlarında kullanılan 4 ana formül</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {VERBOT_WARNING_PATTERNS.map((p, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-red-400">Formül #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handlePlay(p.exampleDe, `verb_pat_${idx}`)}
                  className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs font-bold text-white">{p.patternDe}</p>
              <p className="text-[11px] text-slate-400">🇹🇷 {p.patternTr}</p>
              <div className="bg-slate-900/90 p-2 rounded-xl text-[11px] border border-slate-800">
                <span className="text-amber-300 font-bold">Örnek: </span>
                <span className="text-slate-200">{p.exampleDe}</span>
                <span className="text-slate-400 block italic">({p.exampleTr})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
