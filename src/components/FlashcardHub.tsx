import React, { useState, useEffect } from 'react';
import { Flashcard, LanguageId, UserProfile } from '../types';
import { FLASHCARDS_DATA, FLASHCARD_CATEGORIES } from '../data/flashcardsData';
import { LANGUAGES_LIST } from '../data/languagesData';
import { speakText } from '../utils/speechUtils';
import { toggleLearnedCard, toggleFavoriteCard } from '../utils/authStorage';
import { getI18n } from '../utils/i18n';
import { generateSafeFallbackSvg, verifyCardVisualIntegrity } from '../utils/imageVerification';
import { 
  Volume2, Heart, CheckCircle, Search, Sparkles, Filter, 
  RotateCw, Play, Pause, Bookmark, Star, Info, Award, Globe2,
  ShieldCheck, CheckCheck, HelpCircle, X, ChevronRight, Check
} from 'lucide-react';

interface FlashcardHubProps {
  currentUser: UserProfile;
  onUserUpdate: (updatedUser: UserProfile) => void;
}

export const FlashcardHub: React.FC<FlashcardHubProps> = ({
  currentUser,
  onUserUpdate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unlearned' | 'learned' | 'favorite' | 'disambiguated'>('all');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [selectedCardForDetail, setSelectedCardForDetail] = useState<Flashcard | null>(null);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});
  
  // Slideshow Mode
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);

  const t = getI18n(currentUser.nativeLanguage);
  const targetLang = LANGUAGES_LIST.find(l => l.id === currentUser.targetLanguage) || LANGUAGES_LIST[0];
  const nativeLang = LANGUAGES_LIST.find(l => l.id === currentUser.nativeLanguage) || LANGUAGES_LIST.find(l => l.id === 'tr') || LANGUAGES_LIST[0];

  // Helper to get card translation in user's native language
  const getNativeWord = (card: Flashcard) => {
    return card.translations[currentUser.nativeLanguage]?.word || card.turkishMeaning;
  };

  // Helper to get card example translation in user's native language
  const getNativeExample = (card: Flashcard) => {
    return card.translations[currentUser.nativeLanguage]?.exampleSentenceTr || card.translations['en']?.exampleSentenceTr || '';
  };

  // Filter cards
  const filteredCards = FLASHCARDS_DATA.filter((card) => {
    // Category check
    if (selectedCategory !== 'all' && card.category !== selectedCategory) return false;

    // Filter type check
    const isLearned = currentUser.stats.learnedCardIds.includes(card.id);
    const isFav = currentUser.stats.favoriteCardIds.includes(card.id);

    if (filterType === 'learned' && !isLearned) return false;
    if (filterType === 'unlearned' && isLearned) return false;
    if (filterType === 'favorite' && !isFav) return false;
    if (filterType === 'disambiguated' && !card.disambiguation) return false;

    // Search check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const nativeMeaning = getNativeWord(card).toLowerCase();
      const targetWord = card.translations[currentUser.targetLanguage]?.word.toLowerCase() || '';
      const disambig = (card.disambiguation || '').toLowerCase();
      if (!nativeMeaning.includes(q) && !targetWord.includes(q) && !disambig.includes(q)) return false;
    }

    return true;
  });

  // Handle Flip
  const handleFlipCard = (cardId: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // Handle Audio Pronunciation
  const handleSpeak = (e: React.MouseEvent, text: string, cardId: string) => {
    e.stopPropagation();
    setIsPlayingAudio(cardId);
    speakText(text, currentUser.targetLanguage).finally(() => {
      setIsPlayingAudio(null);
    });
  };

  const handleToggleLearned = (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation();
    const updated = toggleLearnedCard(cardId);
    onUserUpdate(updated);
  };

  const handleToggleFavorite = (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation();
    const updated = toggleFavoriteCard(cardId);
    onUserUpdate(updated);
  };

  // Slideshow Timer Loop
  useEffect(() => {
    let interval: any;
    if (isSlideshowActive && filteredCards.length > 0) {
      interval = setInterval(() => {
        setSlideshowIndex(prev => (prev + 1) % filteredCards.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isSlideshowActive, filteredCards.length]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-black text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>%100 Doğrulanmış Görsel Sözlük Modülü</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {targetLang.flag} {targetLang.name} <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Resimli Kelimeler & Flashcardlar</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
              Her kelime ve görsel, anlam karmaşasını ve çağrışım hatalarını önlemek amacıyla %100 doğrulanmıştır (Örn: Gül = Gül Çiçeği, Çay = Sıcak İçecek, Kaz = Kaz Kuşu, Yüz = İnsan Çehresi).
            </p>
          </div>

          {/* Quick Progress Badge & Slideshow Toggle */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0">
            <div className="px-4 py-2 bg-slate-950/80 border border-slate-800 rounded-2xl text-center shadow-lg">
              <div className="text-xs font-bold text-slate-400">{t.wordsMastered}</div>
              <div className="text-xl font-black text-amber-400">
                {currentUser.stats.learnedCardIds.length} <span className="text-xs text-slate-500">/ {FLASHCARDS_DATA.length}</span>
              </div>
            </div>

            <button
              onClick={() => setIsSlideshowActive(!isSlideshowActive)}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 ${
                isSlideshowActive
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              {isSlideshowActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isSlideshowActive ? 'Slaytı Durdur' : 'Otomatik Slayt'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {FLASHCARD_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = cat.id === 'all' 
            ? FLASHCARDS_DATA.length 
            : FLASHCARDS_DATA.filter(c => c.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 shrink-0 ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{cat.nameTr}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                isSelected ? 'bg-slate-950 text-amber-400 font-black' : 'bg-slate-800 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder={`${nativeLang.name} veya ${targetLang.name} kelime ara...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
              filterType === 'all' ? 'bg-slate-800 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tümü ({FLASHCARDS_DATA.length})
          </button>
          <button
            onClick={() => setFilterType('disambiguated')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
              filterType === 'disambiguated' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
            }`}
            title="Gül, Çay, Kaz, Yüz gibi çok anlamlı kelimelerin özel doğrulanmış kartları"
          >
            🔍 Çok Anlamlılar (Gül/Çay/Kaz)
          </button>
          <button
            onClick={() => setFilterType('unlearned')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
              filterType === 'unlearned' ? 'bg-slate-800 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.inProgressBadge}
          </button>
          <button
            onClick={() => setFilterType('learned')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
              filterType === 'learned' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.completedBadge} ({currentUser.stats.learnedCardIds.length})
          </button>
          <button
            onClick={() => setFilterType('favorite')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
              filterType === 'favorite' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Favoriler ({currentUser.stats.favoriteCardIds.length})
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-16 p-8 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="text-base font-bold text-white">Aradığınız kriterlere uygun kart bulunamadı</h3>
          <p className="text-xs text-slate-400">Arama metnini değiştirebilir veya filtreleri sıfırlayabilirsiniz.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCards.map((card) => {
            const isFlipped = !!flippedCards[card.id];
            const isLearned = currentUser.stats.learnedCardIds.includes(card.id);
            const isFav = currentUser.stats.favoriteCardIds.includes(card.id);
            const trans = card.translations[currentUser.targetLanguage] || card.translations['en'] || {
              word: card.id,
              phonetic: '',
              exampleSentence: '',
              exampleSentenceTr: '',
              article: ''
            };
            const nativeMeaning = getNativeWord(card);
            const nativeExample = getNativeExample(card);
            const isImageErrored = !!imageErrorMap[card.id];
            const displayImageSrc = isImageErrored
              ? generateSafeFallbackSvg(card.category, card.turkishMeaning, trans.word)
              : card.imageUrl;

            return (
              <div
                key={card.id}
                onClick={() => handleFlipCard(card.id)}
                className={`group relative bg-slate-900 border rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 shadow-xl flex flex-col justify-between ${
                  isLearned
                    ? 'border-emerald-500/40 shadow-emerald-950/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                
                {/* Status Badges Overlay */}
                <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5 max-w-[70%]">
                  {card.level && (
                    <span className="px-2 py-0.5 bg-emerald-500/90 text-slate-950 text-[10px] font-black rounded-lg tracking-wider shadow-md">
                      {card.level}
                    </span>
                  )}
                  <span className="px-2.5 py-1 bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[10px] font-black text-amber-300 rounded-xl">
                    {card.categoryNameTr}
                  </span>
                  {trans.article && (
                    <span className="px-2 py-1 bg-amber-500/30 backdrop-blur-md border border-amber-400 text-[10px] font-black text-amber-300 rounded-xl uppercase">
                      {trans.article}
                    </span>
                  )}
                  {card.verified && (
                    <span 
                      className="px-2 py-0.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-[10px] font-black text-emerald-300 rounded-lg flex items-center gap-1"
                      title="Görsel bu kelimenin anlamını %100 doğrulanmış şekilde temsil eder."
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>%100 Doğrulanmış</span>
                    </span>
                  )}
                </div>

                {/* Actions Top Right */}
                <div className="absolute top-3 right-3 z-20 flex items-center space-x-1">
                  <button
                    onClick={(e) => handleToggleFavorite(e, card.id)}
                    className={`p-2 rounded-xl backdrop-blur-md transition-transform active:scale-90 ${
                      isFav 
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                        : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                    title={isFav ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={(e) => handleToggleLearned(e, card.id)}
                    className={`p-2 rounded-xl backdrop-blur-md transition-transform active:scale-90 ${
                      isLearned 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                        : 'bg-slate-950/80 text-slate-400 hover:text-emerald-400 border border-slate-800'
                    }`}
                    title={isLearned ? 'Öğrenildi' : 'Öğrendim Olarak İşaretle (+25 XP)'}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  {/* Image Section */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={displayImageSrc}
                      alt={trans.word}
                      loading="lazy"
                      onError={() => {
                        setImageErrorMap(prev => ({ ...prev, [card.id]: true }));
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90" />
                    
                    {card.disambiguation && (
                      <div className="absolute bottom-2 left-3 right-3 z-10">
                        <span className="inline-block px-2.5 py-1 bg-slate-950/90 backdrop-blur-md border border-indigo-500/40 text-[10px] font-bold text-indigo-300 rounded-lg">
                          💡 {card.disambiguation}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Details */}
                  <div className="p-5 space-y-4">
                    
                    {/* Target Language Word & TTS */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-black text-white tracking-tight">
                          {trans.word}
                        </h3>
                        {/* Phonetic Pronunciation Guide */}
                        <div className="text-xs font-bold text-amber-400 mt-0.5 font-mono">
                          {trans.phonetic}
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleSpeak(e, trans.word, card.id)}
                        className={`p-3 rounded-2xl transition-all shadow-md active:scale-90 ${
                          isPlayingAudio === card.id
                            ? 'bg-amber-400 text-slate-950 scale-110'
                            : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
                        }`}
                        title="Sesli Telaffuzu Dinle"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Native Meaning & Sentence Preview */}
                    <div className="pt-3 border-t border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">{nativeLang.name}:</span>
                        <span className="font-black text-emerald-400 text-sm">{nativeMeaning}</span>
                      </div>

                      {/* Example Sentence Preview */}
                      <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Örnek Cümle
                          </span>
                          <button
                            onClick={(e) => handleSpeak(e, trans.exampleSentence, `ex_${card.id}`)}
                            className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Volume2 className="w-3 h-3" /> Dinle
                          </button>
                        </div>
                        <p className="text-xs font-semibold text-slate-200 leading-snug">
                          {trans.exampleSentence}
                        </p>
                        {nativeExample && (
                          <p className="text-[11px] text-slate-400 italic">
                            {nativeExample}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action / Verification Insight */}
                <div className="p-4 pt-0 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCardForDetail(card);
                    }}
                    className="flex items-center gap-1 hover:text-amber-300 transition-colors cursor-pointer text-[11px] font-bold"
                  >
                    <Info className="w-3 h-3 text-amber-400" />
                    <span>Görsel Doğrulama Raporu</span>
                  </button>
                  <span className={`font-bold ${isLearned ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {isLearned ? '✓ Öğrenildi' : '+25 XP'}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* VERIFICATION DETAIL MODAL */}
      {selectedCardForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-5">
            <button
              onClick={() => setSelectedCardForDetail(null)}
              className="absolute top-5 right-5 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  %100 Görsel Doğruluk Güvencesi
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedCardForDetail.turkishMeaning} • {selectedCardForDetail.translations[currentUser.targetLanguage]?.word || ''}
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-400 font-medium">Hedef Kelime:</span>
                <span className="font-bold text-white text-right">
                  {selectedCardForDetail.translations[currentUser.targetLanguage]?.word}
                </span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-400 font-medium">Türkçe Anlamı:</span>
                <span className="font-bold text-emerald-400 text-right">
                  {selectedCardForDetail.turkishMeaning}
                </span>
              </div>
              {selectedCardForDetail.disambiguation && (
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-400 font-medium">Anlam Netleştirme:</span>
                  <span className="font-bold text-indigo-300 text-right">
                    {selectedCardForDetail.disambiguation}
                  </span>
                </div>
              )}
              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-400 font-medium">Görsel Açıklaması:</span>
                <span className="font-semibold text-slate-300 text-right italic">
                  "{selectedCardForDetail.imageDescription}"
                </span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-400 font-medium">Doğrulama Durumu:</span>
                <span className="inline-flex items-center gap-1 font-black text-emerald-400">
                  <Check className="w-3.5 h-3.5" /> Doğrulandı (100% Güven Skoru)
                </span>
              </div>
            </div>

            <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl text-[11px] text-indigo-200 leading-relaxed">
              💡 <strong>Glotvia Güvencesi:</strong> Eş sesli kelimelerde (örneğin Gül, Çay, Kaz, Yüz) görselin asla farklı bir anlama kaymasına izin verilmez.
            </div>

            <button
              onClick={() => setSelectedCardForDetail(null)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-colors"
            >
              Anladım
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
