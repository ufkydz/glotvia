import React, { useState } from 'react';
import { Volume2, Sparkles, ArrowRight, Search, Shuffle, RotateCw, ChevronLeft, ChevronRight, Mic } from 'lucide-react';
import { ESSENTIAL_VOCABULARY, EssentialVocabItem } from '../../data/germanCurriculumData';

interface CurriculumVocabularyViewProps {
  playingId: string | null;
  handlePlayAudio: (text: string, id: string) => Promise<void>;
  handleOpenPronunciationWithPhrase: (phrase: string) => void;
  handleSelectTopic: (topicId: string) => void;
}

export const CurriculumVocabularyView: React.FC<CurriculumVocabularyViewProps> = ({
  playingId,
  handlePlayAudio,
  handleOpenPronunciationWithPhrase,
  handleSelectTopic,
}) => {
  const [vocabViewMode, setVocabViewMode] = useState<'cards' | 'flashcards' | 'list'>('cards');
  const [vocabCategoryFilter, setVocabCategoryFilter] = useState<string>('all');
  const [vocabSearchTerm, setVocabSearchTerm] = useState('');
  const [vocabCardIndex, setVocabCardIndex] = useState<number>(0);
  const [vocabFlipped, setVocabFlipped] = useState<boolean>(false);

  const getVocabEmoji = (item: EssentialVocabItem) => {
    if (item.german.includes('buchstabieren')) return '🔤';
    if (item.german.includes('Vorname')) return '🪪';
    if (item.german.includes('Nachname')) return '📇';
    if (item.german.includes('Geburtsort')) return '📍';
    if (item.german.includes('Wohnort')) return '🏡';
    if (item.german.includes('Mutter')) return '👩';
    if (item.german.includes('Vater')) return '👨';
    if (item.german.includes('Frau')) return '👰';
    if (item.german.includes('Mann')) return '🤵';
    if (item.german.includes('Verlobte')) return '💍';
    if (item.german.includes('Beruf')) return '💼';
    if (item.german.includes('Hobby')) return '⚽';
    if (item.german.includes('Telefon')) return '📱';
    if (item.german.includes('Alter')) return '🎂';
    return '🇩🇪';
  };

  const filteredVocab = ESSENTIAL_VOCABULARY.filter(item => {
    if (vocabCategoryFilter !== 'all' && item.category !== vocabCategoryFilter) return false;
    if (vocabSearchTerm) {
      const q = vocabSearchTerm.toLowerCase();
      return (
        item.german.toLowerCase().includes(q) ||
        item.turkish.toLowerCase().includes(q) ||
        (item.pronunciation && item.pronunciation.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const currentCard = filteredVocab[Math.min(vocabCardIndex, Math.max(0, filteredVocab.length - 1))];

  return (
    <div className="space-y-6">
      {/* Spotlight Banner to 130 Resimli Sprechen */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-purple-950/50 to-slate-950 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Sınav Odaklı Görsel Modül</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            🖼️ 130 Resimli Goethe A1 Sprechen & Bitten Kartları
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Goethe A1 sınavındaki tüm resimli rica kartları, diyalog simülatörü ve 25 yasak tabelası tek bir interaktif merkezde.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleSelectTopic('goethe_sprechen')}
          className="shrink-0 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>130 Resimli Kartı Aç</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Header & Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-black mb-2">
              <span>📚 1. Not: Wortschatz</span>
              <span>•</span>
              <span>Kişisel Bilgi & A1 Kelimeleri</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
              <span>Deutsch - Türkisch Temel Kelimeler (A1 Wortschatz)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Kendinizi tanıtırken ve form doldururken en çok kullanacağınız temel kelimeler, artikeller, okunuşları ve örnek cümleler.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setVocabViewMode('cards')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                vocabViewMode === 'cards'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔲 Görsel Kartlar
            </button>
            <button
              type="button"
              onClick={() => {
                setVocabViewMode('flashcards');
                setVocabFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                vocabViewMode === 'flashcards'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🗂️ Kartlı Sistem (Flip)
            </button>
            <button
              type="button"
              onClick={() => setVocabViewMode('list')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                vocabViewMode === 'list'
                  ? 'bg-indigo-600 text-white font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📋 Liste
            </button>
          </div>
        </div>

        {/* Categorized Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => { setVocabCategoryFilter('all'); setVocabCardIndex(0); setVocabFlipped(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                vocabCategoryFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Tüm Kelimeler ({ESSENTIAL_VOCABULARY.length})
            </button>
            <button
              type="button"
              onClick={() => { setVocabCategoryFilter('Kişisel Bilgi'); setVocabCardIndex(0); setVocabFlipped(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                vocabCategoryFilter === 'Kişisel Bilgi'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              🪪 Kişisel Bilgi
            </button>
            <button
              type="button"
              onClick={() => { setVocabCategoryFilter('Aile'); setVocabCardIndex(0); setVocabFlipped(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                vocabCategoryFilter === 'Aile'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              👨‍👩‍👧‍👦 Aile
            </button>
            <button
              type="button"
              onClick={() => { setVocabCategoryFilter('İş & Kariyer'); setVocabCardIndex(0); setVocabFlipped(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                vocabCategoryFilter === 'İş & Kariyer'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              💼 İş & Kariyer
            </button>
            <button
              type="button"
              onClick={() => { setVocabCategoryFilter('Günlük Yaşam'); setVocabCardIndex(0); setVocabFlipped(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                vocabCategoryFilter === 'Günlük Yaşam'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              ⚽ Günlük Yaşam
            </button>
          </div>

          <div className="w-full sm:w-64 relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={vocabSearchTerm}
              onChange={(e) => {
                setVocabSearchTerm(e.target.value);
                setVocabCardIndex(0);
              }}
              placeholder="Kelime veya anlam ara..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* FLASHCARD INTERACTIVE FLIP MODE */}
      {vocabViewMode === 'flashcards' && currentCard && (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Progress bar and shuffle */}
          <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-black">
                Kart {vocabCardIndex + 1} / {filteredVocab.length}
              </span>
              <span className="text-slate-400">({currentCard.category})</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const randomIdx = Math.floor(Math.random() * filteredVocab.length);
                setVocabCardIndex(randomIdx);
                setVocabFlipped(false);
              }}
              className="flex items-center space-x-1 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Karıştır</span>
            </button>
          </div>

          {/* Flip Card Container */}
          <div
            onClick={() => setVocabFlipped(!vocabFlipped)}
            className="relative min-h-[350px] bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border-2 border-indigo-500/30 hover:border-amber-500/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all cursor-pointer group select-none"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
                  {currentCard.category}
                </span>
                {currentCard.article && (
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-md border ${
                    currentCard.article.includes('der')
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                      : currentCard.article.includes('die')
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {currentCard.article}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayAudio(currentCard.german, `vocab_${currentCard.german}`);
                  }}
                  className="p-2 rounded-full bg-amber-500 text-slate-950 hover:scale-110 transition-transform shadow-md cursor-pointer"
                  title="Kelimeyi Dinle"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-400 group-hover:text-amber-300 flex items-center space-x-1">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Çevir</span>
                </span>
              </div>
            </div>

            {!vocabFlipped ? (
              /* FRONT OF CARD */
              <div className="text-center my-6 space-y-3">
                <div className="text-4xl sm:text-5xl">{getVocabEmoji(currentCard)}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-indigo-400">🇩🇪 ALMANCA KELİME</div>
                <h2 lang="de" translate="no" className="notranslate text-3xl sm:text-5xl font-black text-white group-hover:text-amber-300 transition-colors">
                  {currentCard.german}
                </h2>
                {currentCard.pronunciation && (
                  <div className="text-sm font-mono font-bold text-amber-400">
                    🗣️ [{currentCard.pronunciation}]
                  </div>
                )}
                <p className="text-xs text-slate-400 pt-3">
                  👆 Türkçe anlamını ve örnek cümleyi görmek için dokunun.
                </p>
              </div>
            ) : (
              /* BACK OF CARD */
              <div className="my-4 space-y-4 text-left">
                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <span className="text-[10px] font-black text-slate-400 block mb-1">🇹🇷 TÜRKÇE ANLAMI:</span>
                  <span className="text-xl font-black text-amber-300">{currentCard.turkish}</span>
                </div>

                {currentCard.exampleSentence && (
                  <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400">ÖRNEK KULLANIM:</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayAudio(currentCard.exampleSentence!, `vocab_sent_${currentCard.german}`);
                        }}
                        className="text-amber-400 hover:text-amber-300 p-1 rounded-md cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div lang="de" translate="no" className="notranslate text-sm font-bold text-white">
                      {currentCard.exampleSentence}
                    </div>
                    <div className="text-xs text-slate-300">{currentCard.exampleSentenceTr}</div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom action inside card */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400">
              <span>{vocabFlipped ? '🔄 Ön Yüze Dön' : '🔄 Arka Yüzü Gör'}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenPronunciationWithPhrase(currentCard.exampleSentence || currentCard.german);
                }}
                className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-1 cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Telaffuz</span>
              </button>
            </div>
          </div>

          {/* Navigation controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              disabled={vocabCardIndex === 0}
              onClick={() => {
                setVocabCardIndex(prev => Math.max(0, prev - 1));
                setVocabFlipped(false);
              }}
              className={`flex-1 py-3 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 border transition-all cursor-pointer ${
                vocabCardIndex === 0
                  ? 'bg-slate-950/40 text-slate-600 border-slate-900 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-800 hover:border-slate-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Önceki Kart</span>
            </button>

            <button
              type="button"
              onClick={() => setVocabFlipped(!vocabFlipped)}
              className="px-5 py-3 rounded-2xl font-black text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
              <span>{vocabFlipped ? 'Ön Yüz' : 'Kartı Çevir'}</span>
            </button>

            <button
              type="button"
              disabled={vocabCardIndex >= filteredVocab.length - 1}
              onClick={() => {
                setVocabCardIndex(prev => Math.min(filteredVocab.length - 1, prev + 1));
                setVocabFlipped(false);
              }}
              className={`flex-1 py-3 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 border transition-all cursor-pointer ${
                vocabCardIndex >= filteredVocab.length - 1
                  ? 'bg-slate-950/40 text-slate-600 border-slate-900 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
              }`}
            >
              <span>Sonraki Kart</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* CARDS VIEW (GRID) */}
      {vocabViewMode === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVocab.map((vocab) => {
            const isPlaying = playingId === `vocab_${vocab.german}`;
            const isSentPlaying = playingId === `sent_${vocab.german}`;
            const emoji = getVocabEmoji(vocab);

            return (
              <div
                key={vocab.german}
                className="bg-slate-950/90 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-5 space-y-4 transition-all group flex flex-col justify-between shadow-lg hover:shadow-amber-500/5"
              >
                <div className="space-y-3">
                  {/* Top Tag & Article */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      {vocab.category}
                    </span>
                    {vocab.article && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${
                        vocab.article.includes('der')
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                          : vocab.article.includes('die')
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {vocab.article}
                      </span>
                    )}
                  </div>

                  {/* Visual Illustration & German Word */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-850 flex items-center space-x-3.5">
                    <span className="text-3xl sm:text-4xl shrink-0 drop-shadow">{emoji}</span>
                    <div className="min-w-0">
                      <h4 className="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition-colors leading-tight">
                        {vocab.german}
                      </h4>
                      {vocab.pronunciation && (
                        <p className="text-[11px] text-amber-400 font-mono mt-0.5">
                          [{vocab.pronunciation}]
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Turkish Meaning */}
                  <div className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                    <span>🇹🇷</span>
                    <span className="text-slate-200">{vocab.turkish}</span>
                  </div>
                </div>

                {/* Example Sentence & Audio */}
                <div className="space-y-2 pt-2 border-t border-slate-900">
                  {vocab.exampleSentence && (
                    <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                      <div className="flex items-start justify-between gap-2 text-xs">
                        <span className="text-slate-200 font-bold leading-relaxed">{vocab.exampleSentence}</span>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(vocab.exampleSentence!, `sent_${vocab.german}`)}
                          className={`p-1.5 rounded-lg shrink-0 transition-colors cursor-pointer ${
                            isSentPlaying ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                          title="Cümleyi Dinle"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-slate-400 leading-normal">{vocab.exampleSentenceTr}</div>
                    </div>
                  )}

                  {/* Word Audio Button */}
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(vocab.german, `vocab_${vocab.german}`)}
                    className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      isPlaying
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Kelimeyi Dinle</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {vocabViewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredVocab.map((vocab) => {
            const isPlaying = playingId === `vocab_${vocab.german}`;
            return (
              <div
                key={vocab.german}
                className="p-4 bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl space-y-2.5 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded-md">
                        {vocab.category}
                      </span>
                      <h4 className="text-base font-black text-white mt-1 group-hover:text-amber-300 transition-colors">
                        {vocab.german}
                      </h4>
                      {vocab.pronunciation && (
                        <span className="text-[10px] text-amber-400 font-mono">[{vocab.pronunciation}]</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(vocab.german, `vocab_${vocab.german}`)}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        isPlaying ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                      title="Sesli Dinle"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-slate-300 mt-1">
                    {vocab.turkish}
                  </p>
                </div>

                {vocab.exampleSentence && (
                  <div className="p-2.5 bg-slate-900/60 border border-slate-850 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300 font-bold">{vocab.exampleSentence}</span>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(vocab.exampleSentence!, `sent_${vocab.german}`)}
                        className="text-slate-400 hover:text-white p-1 cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-400">{vocab.exampleSentenceTr}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
