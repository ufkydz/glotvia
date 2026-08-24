import React, { useState } from 'react';
import { Volume2, PlayCircle, PauseCircle, Search, Shuffle, RotateCw, ChevronLeft, ChevronRight, Mic, Sparkles } from 'lucide-react';
import {
  ESSENTIAL_PREPOSITIONS_A1,
  ESSENTIAL_ADJECTIVES_A1,
  EssentialPrepositionA1,
  EssentialAdjectiveA1,
} from '../../data/germanCurriculumData';

interface CurriculumPrepositionsAdjectivesViewProps {
  playingId: string | null;
  handlePlayAudio: (text: string, id: string) => Promise<void>;
  handlePlayPreposition: (prep: EssentialPrepositionA1) => Promise<void>;
  handlePlayAdjective: (adj: EssentialAdjectiveA1) => Promise<void>;
  handleOpenPronunciationWithPhrase: (phrase: string) => void;
  awardCoins: (amount: number, reason: string) => void;
}

type UnifiedItem = 
  | { type: 'prep'; data: EssentialPrepositionA1 }
  | { type: 'adj'; data: EssentialAdjectiveA1 };

export const CurriculumPrepositionsAdjectivesView: React.FC<CurriculumPrepositionsAdjectivesViewProps> = ({
  playingId,
  handlePlayAudio,
  handlePlayPreposition,
  handlePlayAdjective,
  handleOpenPronunciationWithPhrase,
}) => {
  const [prepAdjTab, setPrepAdjTab] = useState<'all' | 'prepositions' | 'adjectives' | 'housing'>('all');
  const [prepAdjSearch, setPrepAdjSearch] = useState('');
  const [prepAdjViewMode, setPrepAdjViewMode] = useState<'cards' | 'flashcards'>('cards');
  const [prepAdjCardIndex, setPrepAdjCardIndex] = useState<number>(0);
  const [prepAdjFlipped, setPrepAdjFlipped] = useState<boolean>(false);

  // Build unified item list for flashcard mode
  const prepsFiltered = ESSENTIAL_PREPOSITIONS_A1.filter(p => {
    if (prepAdjTab === 'adjectives' || prepAdjTab === 'housing') return false;
    if (prepAdjSearch) {
      const q = prepAdjSearch.toLowerCase();
      return p.german.toLowerCase().includes(q) || p.turkish.toLowerCase().includes(q) || p.usageType.toLowerCase().includes(q);
    }
    return true;
  });

  const adjsFiltered = ESSENTIAL_ADJECTIVES_A1.filter(a => {
    if (prepAdjTab === 'prepositions') return false;
    if (prepAdjTab === 'housing' && a.category !== 'housing_card') return false;
    if (prepAdjTab === 'adjectives' && a.category === 'housing_card') return false;
    if (prepAdjSearch) {
      const q = prepAdjSearch.toLowerCase();
      return a.german.toLowerCase().includes(q) || a.turkish.toLowerCase().includes(q);
    }
    return true;
  });

  const unifiedList: UnifiedItem[] = [
    ...prepsFiltered.map(data => ({ type: 'prep' as const, data })),
    ...adjsFiltered.map(data => ({ type: 'adj' as const, data }))
  ];

  const currentCard = unifiedList[Math.min(prepAdjCardIndex, Math.max(0, unifiedList.length - 1))];

  return (
    <div className="space-y-6">
      {/* Header & Tab Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-black mb-2">
              <span>📍 4. Not: Edatlar & Sıfatlar</span>
              <span>•</span>
              <span>Konum, Yönelme & A1 Kart Kelimeleri</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Önemli Edatlar, Yön Belirteçleri & Sıfatlar
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              in/im, dort, hier, auf, neben, dabei, ins, ans, für, mit, nach, gern, ohne edatları ve Goethe A1 konuşma kartı sıfatları.
            </p>
          </div>

          {/* Action buttons & View Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Switcher */}
            <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setPrepAdjViewMode('cards')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  prepAdjViewMode === 'cards'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🔲 Grid Görünümü
              </button>
              <button
                type="button"
                onClick={() => {
                  setPrepAdjViewMode('flashcards');
                  setPrepAdjFlipped(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  prepAdjViewMode === 'flashcards'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🗂️ Kartlı Sistem (Flip)
              </button>
            </div>
          </div>
        </div>

        {/* Categorized Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => { setPrepAdjTab('all'); setPrepAdjCardIndex(0); setPrepAdjFlipped(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                prepAdjTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Tümü ({ESSENTIAL_PREPOSITIONS_A1.length + ESSENTIAL_ADJECTIVES_A1.length})
            </button>
            <button
              type="button"
              onClick={() => { setPrepAdjTab('prepositions'); setPrepAdjCardIndex(0); setPrepAdjFlipped(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                prepAdjTab === 'prepositions'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              📍 Edatlar ({ESSENTIAL_PREPOSITIONS_A1.length})
            </button>
            <button
              type="button"
              onClick={() => { setPrepAdjTab('adjectives'); setPrepAdjCardIndex(0); setPrepAdjFlipped(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                prepAdjTab === 'adjectives'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              🏷️ Sıfatlar ({ESSENTIAL_ADJECTIVES_A1.filter(a => a.category !== 'housing_card').length})
            </button>
            <button
              type="button"
              onClick={() => { setPrepAdjTab('housing'); setPrepAdjCardIndex(0); setPrepAdjFlipped(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                prepAdjTab === 'housing'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              🏠 Konut & Kart Kelimeleri ({ESSENTIAL_ADJECTIVES_A1.filter(a => a.category === 'housing_card').length})
            </button>
          </div>

          <div className="w-full sm:w-64 relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={prepAdjSearch}
              onChange={(e) => {
                setPrepAdjSearch(e.target.value);
                setPrepAdjCardIndex(0);
              }}
              placeholder="Edat, sıfat veya anlam ara..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* FLASHCARD INTERACTIVE FLIP MODE */}
      {prepAdjViewMode === 'flashcards' && currentCard && (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Card Navigation & Progress */}
          <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-black">
                Kart {prepAdjCardIndex + 1} / {unifiedList.length}
              </span>
              <span className="text-slate-400">
                {currentCard.type === 'prep' ? '📍 Edat / Yönelme' : currentCard.data.category === 'housing_card' ? '🏠 Konut Kartı' : '🏷️ Sıfat'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const randomIdx = Math.floor(Math.random() * unifiedList.length);
                setPrepAdjCardIndex(randomIdx);
                setPrepAdjFlipped(false);
              }}
              className="flex items-center space-x-1 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Karıştır</span>
            </button>
          </div>

          {/* Flip Card Container */}
          <div
            onClick={() => setPrepAdjFlipped(!prepAdjFlipped)}
            className="relative min-h-[350px] bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border-2 border-indigo-500/30 hover:border-amber-500/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all cursor-pointer group select-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
                {currentCard.type === 'prep'
                  ? `📍 ${currentCard.data.usageType}`
                  : currentCard.data.category === 'housing_card'
                  ? '🏠 Konut Kartı'
                  : '🏷️ A1 Sıfatı'}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentCard.type === 'prep') {
                      handlePlayPreposition(currentCard.data);
                    } else {
                      handlePlayAdjective(currentCard.data);
                    }
                  }}
                  className="p-2 rounded-full bg-amber-500 text-slate-950 hover:scale-110 transition-transform shadow-md"
                  title="Sesli Dinle"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-400 group-hover:text-amber-300 flex items-center space-x-1">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Çevir</span>
                </span>
              </div>
            </div>

            {!prepAdjFlipped ? (
              /* FRONT OF CARD */
              <div className="text-center my-6 space-y-3">
                <div className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                  🇩🇪 {currentCard.type === 'prep' ? 'ALMANCA EDAT' : 'ALMANCA SIFAT'}
                </div>
                <h2 lang="de" translate="no" className="notranslate text-4xl sm:text-5xl font-black text-white group-hover:text-amber-300 transition-colors">
                  {currentCard.data.german}
                </h2>
                {currentCard.data.pronunciation && (
                  <div className="text-sm font-mono font-bold text-amber-400">
                    🗣️ [{currentCard.data.pronunciation}]
                  </div>
                )}
                <p className="text-xs text-slate-400 pt-3">
                  👆 Türkçe anlamını, ipucunu ve örnek cümleyi görmek için dokunun.
                </p>
              </div>
            ) : (
              /* BACK OF CARD */
              <div className="my-4 space-y-4 text-left">
                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <span className="text-[10px] font-black text-slate-400 block mb-1">🇹🇷 TÜRKÇE ANLAMI:</span>
                  <span className="text-xl font-black text-amber-300">{currentCard.data.turkish}</span>
                </div>

                {currentCard.type === 'prep' && currentCard.data.tip && (
                  <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl space-y-1">
                    <span className="text-[10px] font-black uppercase text-indigo-300 flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Kullanım İpucu:</span>
                    </span>
                    <p className="text-xs text-slate-200">{currentCard.data.tip}</p>
                  </div>
                )}

                {currentCard.type === 'adj' && currentCard.data.opposite && (
                  <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-2xl">
                    <span className="text-[10px] font-black text-rose-300 block mb-0.5">↔️ ZIT ANLAMLISI (GEGENTEIL):</span>
                    <span className="text-sm font-mono font-bold text-white">{currentCard.data.opposite}</span>
                  </div>
                )}

                <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400">ÖRNEK CÜMLE:</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayAudio(currentCard.data.exampleSentenceDe, `pa_sent_${currentCard.data.id}`);
                      }}
                      className="text-amber-400 hover:text-amber-300 p-1 rounded-md cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div lang="de" translate="no" className="notranslate text-sm font-bold text-white">
                    {currentCard.data.exampleSentenceDe}
                  </div>
                  <div className="text-xs text-slate-300">{currentCard.data.exampleSentenceTr}</div>
                </div>
              </div>
            )}

            {/* Bottom action inside card */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400">
              <span>{prepAdjFlipped ? '🔄 Ön Yüze Dön' : '🔄 Arka Yüzü Gör'}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenPronunciationWithPhrase(currentCard.data.exampleSentenceDe);
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
              disabled={prepAdjCardIndex === 0}
              onClick={() => {
                setPrepAdjCardIndex(prev => Math.max(0, prev - 1));
                setPrepAdjFlipped(false);
              }}
              className={`flex-1 py-3 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 border transition-all cursor-pointer ${
                prepAdjCardIndex === 0
                  ? 'bg-slate-950/40 text-slate-600 border-slate-900 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-800 hover:border-slate-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Önceki Kart</span>
            </button>

            <button
              type="button"
              onClick={() => setPrepAdjFlipped(!prepAdjFlipped)}
              className="px-5 py-3 rounded-2xl font-black text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
              <span>{prepAdjFlipped ? 'Ön Yüz' : 'Kartı Çevir'}</span>
            </button>

            <button
              type="button"
              disabled={prepAdjCardIndex >= unifiedList.length - 1}
              onClick={() => {
                setPrepAdjCardIndex(prev => Math.min(unifiedList.length - 1, prev + 1));
                setPrepAdjFlipped(false);
              }}
              className={`flex-1 py-3 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 border transition-all cursor-pointer ${
                prepAdjCardIndex >= unifiedList.length - 1
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

      {/* GRID VIEW */}
      {prepAdjViewMode === 'cards' && (
        <div className="space-y-8">
          {/* PREPOSITIONS SECTION */}
          {(prepAdjTab === 'all' || prepAdjTab === 'prepositions') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-black text-white flex items-center space-x-2">
                  <span>📍 Önemli Edatlar & Yön Belirteçleri</span>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                    {prepsFiltered.length} Edat
                  </span>
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {prepsFiltered.map((prep) => {
                  const isPlaying = playingId === `prep_${prep.id}`;
                  return (
                    <div
                      key={prep.id}
                      className="p-4 sm:p-5 bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 rounded-3xl space-y-3.5 transition-all shadow-lg flex flex-col justify-between group"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                              {prep.usageType}
                            </span>
                            <div className="mt-1 flex items-baseline space-x-2">
                              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">🇩🇪 DE</span>
                              <h5 lang="de" translate="no" className="notranslate text-xl font-black text-white group-hover:text-amber-300 transition-colors tracking-wide">
                                {prep.german}
                              </h5>
                            </div>
                            {prep.pronunciation && (
                              <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                                🗣️ [{prep.pronunciation}]
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handlePlayPreposition(prep)}
                            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                              isPlaying ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-300 hover:text-white'
                            }`}
                            title="Sesli Dinle"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="p-2 bg-slate-900/50 border border-slate-800/60 rounded-xl">
                          <span className="text-[10px] font-black text-slate-400 block mb-0.5">🇹🇷 TÜRKÇE ANLAMI:</span>
                          <p className="text-xs font-bold text-slate-100">{prep.turkish}</p>
                        </div>

                        {prep.tip && (
                          <p className="text-[11px] text-slate-400 bg-indigo-950/20 border border-indigo-500/20 p-2 rounded-lg">
                            💡 {prep.tip}
                          </p>
                        )}

                        {/* Example sentence */}
                        <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-1.5">
                              <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded">🇩🇪</span>
                              <span lang="de" translate="no" className="notranslate font-bold text-white text-xs">{prep.exampleSentenceDe}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handlePlayAudio(prep.exampleSentenceDe, `prep_sent_${prep.id}`)}
                              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-[11px] text-slate-300 pl-4 border-l-2 border-slate-700">{prep.exampleSentenceTr}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenPronunciationWithPhrase(prep.exampleSentenceDe)}
                        className="w-full py-2 bg-slate-900 hover:bg-indigo-600 hover:text-white text-slate-300 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                      >
                        <Mic className="w-3 h-3 text-amber-400" />
                        <span>AI ile Telaffuz Et</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ADJECTIVES & HOUSING CARDS SECTION */}
          {(prepAdjTab === 'all' || prepAdjTab === 'adjectives' || prepAdjTab === 'housing') && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-black text-white flex items-center space-x-2">
                  <span>🏷️ Sıfatlar & Goethe A1 Konut/Konuşma Kartı Kelimeleri</span>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                    {adjsFiltered.length} Kelime
                  </span>
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {adjsFiltered.map((adj) => {
                  const isPlaying = playingId === `adj_${adj.id}`;
                  return (
                    <div
                      key={adj.id}
                      className="p-4 sm:p-5 bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 rounded-3xl space-y-3.5 transition-all shadow-lg flex flex-col justify-between group"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                              {adj.category === 'housing_card' ? '🏠 Konut / A1 Kartı' : adj.category === 'pronoun' ? '👤 Zamir' : '🎨 Sıfat'}
                            </span>
                            <div className="mt-1 flex items-baseline space-x-2">
                              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">🇩🇪 DE</span>
                              <h5 lang="de" translate="no" className="notranslate text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                                {adj.german}
                              </h5>
                            </div>
                            {adj.pronunciation && (
                              <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                                🗣️ [{adj.pronunciation}]
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handlePlayAdjective(adj)}
                            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                              isPlaying ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-300 hover:text-white'
                            }`}
                            title="Sesli Dinle"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="p-2 bg-slate-900/50 border border-slate-800/60 rounded-xl">
                          <span className="text-[10px] font-black text-slate-400 block mb-0.5">🇹🇷 TÜRKÇE ANLAMI:</span>
                          <p className="text-xs font-bold text-slate-100">{adj.turkish}</p>
                        </div>

                        {adj.opposite && (
                          <div className="text-[11px] font-mono text-rose-300 bg-rose-950/30 border border-rose-500/20 px-2.5 py-1 rounded-md">
                            ↔️ Zıt Anlamlısı: {adj.opposite}
                          </div>
                        )}

                        {/* Example sentence */}
                        <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-1.5">
                              <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded">🇩🇪</span>
                              <span lang="de" translate="no" className="notranslate font-bold text-white text-xs">{adj.exampleSentenceDe}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handlePlayAudio(adj.exampleSentenceDe, `adj_sent_${adj.id}`)}
                              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-[11px] text-slate-300 pl-4 border-l-2 border-slate-700">{adj.exampleSentenceTr}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenPronunciationWithPhrase(adj.exampleSentenceDe)}
                        className="w-full py-2 bg-slate-900 hover:bg-indigo-600 hover:text-white text-slate-300 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                      >
                        <Mic className="w-3 h-3 text-amber-400" />
                        <span>AI ile Telaffuz Et</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
