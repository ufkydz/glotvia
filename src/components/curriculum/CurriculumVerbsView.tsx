import React, { useState } from 'react';
import { Volume2, PlayCircle, PauseCircle, Search, Shuffle, RotateCw, ChevronLeft, ChevronRight, Mic } from 'lucide-react';
import { ESSENTIAL_VERBS_A1, EssentialVerbA1 } from '../../data/germanCurriculumData';

interface CurriculumVerbsViewProps {
  playingId: string | null;
  handlePlayAudio: (text: string, id: string) => Promise<void>;
  handlePlayVerbDetails: (verb: EssentialVerbA1) => Promise<void>;
  handlePlayAllVerbs: (verbs: EssentialVerbA1[]) => Promise<void>;
  handleOpenPronunciationWithPhrase: (phrase: string) => void;
}

export const CurriculumVerbsView: React.FC<CurriculumVerbsViewProps> = ({
  playingId,
  handlePlayAudio,
  handlePlayVerbDetails,
  handlePlayAllVerbs,
  handleOpenPronunciationWithPhrase,
}) => {
  const [verbSearchTerm, setVerbSearchTerm] = useState('');
  const [verbCategoryFilter, setVerbCategoryFilter] = useState<string>('all');
  const [verbViewMode, setVerbViewMode] = useState<'cards' | 'flashcards'>('cards');
  const [verbCardIndex, setVerbCardIndex] = useState<number>(0);
  const [verbFlipped, setVerbFlipped] = useState<boolean>(false);

  const filteredVerbs = ESSENTIAL_VERBS_A1.filter(v => {
    if (verbCategoryFilter === 'Seyahat') {
      if (!['Seyahat', 'Ulaşım', 'Hareket'].includes(v.category)) return false;
    } else if (verbCategoryFilter === 'Hobi') {
      if (!['Hobi', 'Spor', 'Oyun & Hobi'].includes(v.category)) return false;
    } else if (verbCategoryFilter === 'Beslenme') {
      if (!['Beslenme', 'Mutfak'].includes(v.category)) return false;
    } else if (verbCategoryFilter === 'Sosyal') {
      if (!['Sosyal', 'İletişim', 'Tanışma'].includes(v.category)) return false;
    } else if (verbCategoryFilter === 'İş') {
      if (!['İş & Meslek', 'İş & Finans', 'Banka & Finans', 'Ödeme', 'Konaklama', 'Ev & Yaşam', 'Konut & Arama'].includes(v.category)) return false;
    } else if (verbCategoryFilter === 'Temel') {
      if (!['Temel Fiil', 'İhtiyaç', 'Düşünce', 'Plan', 'Eğitim', 'Alışveriş', 'Günlük', 'Varlık Kalıbı'].includes(v.category)) return false;
    }
    if (verbSearchTerm) {
      const q = verbSearchTerm.toLowerCase();
      return (
        v.german.toLowerCase().includes(q) ||
        v.turkish.toLowerCase().includes(q) ||
        v.pronunciation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const currentCard = filteredVerbs[Math.min(verbCardIndex, Math.max(0, filteredVerbs.length - 1))];

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-black mb-2">
              <span>⚡ 40+ Temel A1 Fiili</span>
              <span>•</span>
              <span>Çekimler & Kartlı Sistem</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Önemli Fiiller (Wichtige Verben)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Almanca A1 seviyesinde en çok kullanılan fiiller, ayrılabilen fiil (trennbare Verben) mantığı ve kategorize edilmiş kartlar.
            </p>
          </div>

          {/* Actions & View Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Switcher */}
            <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setVerbViewMode('cards')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  verbViewMode === 'cards'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🔲 Grid Görünümü
              </button>
              <button
                type="button"
                onClick={() => {
                  setVerbViewMode('flashcards');
                  setVerbFlipped(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  verbViewMode === 'flashcards'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🗂️ Kartlı Sistem (Flip)
              </button>
            </div>

            {/* Playlist button */}
            <button
              type="button"
              onClick={() => handlePlayAllVerbs(filteredVerbs)}
              className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center space-x-2 transition-all shadow-md cursor-pointer ${
                playingId === 'verb_all_playlist'
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 hover:scale-105'
              }`}
            >
              {playingId === 'verb_all_playlist' ? (
                <>
                  <PauseCircle className="w-4 h-4" />
                  <span>Durdur</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Tüm Fiilleri Dinle ▶️</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Categorized Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => { setVerbCategoryFilter('all'); setVerbCardIndex(0); setVerbFlipped(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                verbCategoryFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Tüm Fiiller ({ESSENTIAL_VERBS_A1.length})
            </button>
            <button
              type="button"
              onClick={() => { setVerbCategoryFilter('Seyahat'); setVerbCardIndex(0); setVerbFlipped(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                verbCategoryFilter === 'Seyahat'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              ✈️ Seyahat & Ulaşım
            </button>
            <button
              type="button"
              onClick={() => { setVerbCategoryFilter('Hobi'); setVerbCardIndex(0); setVerbFlipped(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                verbCategoryFilter === 'Hobi'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              ⚽ Hobi & Spor
            </button>
            <button
              type="button"
              onClick={() => { setVerbCategoryFilter('Beslenme'); setVerbCardIndex(0); setVerbFlipped(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                verbCategoryFilter === 'Beslenme'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              ☕ Beslenme & Mutfak
            </button>
            <button
              type="button"
              onClick={() => { setVerbCategoryFilter('Sosyal'); setVerbCardIndex(0); setVerbFlipped(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                verbCategoryFilter === 'Sosyal'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              📱 İletişim & Sosyal
            </button>
            <button
              type="button"
              onClick={() => { setVerbCategoryFilter('İş'); setVerbCardIndex(0); setVerbFlipped(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                verbCategoryFilter === 'İş'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              💼 İş & Finans
            </button>
            <button
              type="button"
              onClick={() => { setVerbCategoryFilter('Temel'); setVerbCardIndex(0); setVerbFlipped(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                verbCategoryFilter === 'Temel'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              ⚡ Temel Fiiller
            </button>
          </div>

          <div className="w-full sm:w-64 relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={verbSearchTerm}
              onChange={(e) => {
                setVerbSearchTerm(e.target.value);
                setVerbCardIndex(0);
              }}
              placeholder="Fiil veya anlam ara (reisen, haben...)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* FLASHCARD INTERACTIVE FLIP MODE */}
      {verbViewMode === 'flashcards' && currentCard && (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Card Navigation & Progress */}
          <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-black">
                Kart {verbCardIndex + 1} / {filteredVerbs.length}
              </span>
              <span className="text-slate-400">({currentCard.category})</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const randomIdx = Math.floor(Math.random() * filteredVerbs.length);
                setVerbCardIndex(randomIdx);
                setVerbFlipped(false);
              }}
              className="flex items-center space-x-1 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Karıştır</span>
            </button>
          </div>

          {/* Flip Card Container */}
          <div
            onClick={() => setVerbFlipped(!verbFlipped)}
            className="relative min-h-[350px] bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border-2 border-indigo-500/30 hover:border-amber-500/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all cursor-pointer group select-none"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black uppercase text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
                  {currentCard.category}
                </span>
                {currentCard.isSeparable && (
                  <span className="text-[10px] font-black text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-md">
                    ✂️ Ayrılabilir
                  </span>
                )}
                {currentCard.isIrregular && (
                  <span className="text-[10px] font-black text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-md">
                    ⚡ Düzensiz
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayVerbDetails(currentCard);
                  }}
                  className="p-2 rounded-full bg-amber-500 text-slate-950 hover:scale-110 transition-transform shadow-md"
                  title="Fiili ve Cümleyi Dinle"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-400 group-hover:text-amber-300 flex items-center space-x-1">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Çevir</span>
                </span>
              </div>
            </div>

            {!verbFlipped ? (
              /* FRONT OF CARD */
              <div className="text-center my-6 space-y-3">
                <div className="text-xs font-bold uppercase tracking-widest text-indigo-400">🇩🇪 ALMANCA FİİL</div>
                <h2 lang="de" translate="no" className="notranslate text-4xl sm:text-5xl font-black text-white group-hover:text-amber-300 transition-colors">
                  {currentCard.german}
                </h2>
                {currentCard.pronunciation && (
                  <div className="text-sm font-mono font-bold text-amber-400">
                    🗣️ [{currentCard.pronunciation}]
                  </div>
                )}
                <p className="text-xs text-slate-400 pt-3">
                  👆 Çekim tablosunu, Türkçe anlamını ve örnek cümleyi görmek için dokunun.
                </p>
              </div>
            ) : (
              /* BACK OF CARD */
              <div className="my-4 space-y-4 text-left">
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <span className="text-[10px] font-black text-slate-400 block mb-1">🇹🇷 TÜRKÇE ANLAMI:</span>
                  <span className="text-lg font-black text-amber-300">{currentCard.turkish}</span>
                </div>

                {currentCard.conjugationSummary && (
                  <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
                    <span className="text-[10px] font-black text-indigo-400">ÇEKİM TABLOSU:</span>
                    <div lang="de" translate="no" className="notranslate text-xs font-mono text-indigo-200 font-bold">
                      {currentCard.conjugationSummary}
                    </div>
                  </div>
                )}

                <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400">ÖRNEK KULLANIM CÜMLESİ:</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayAudio(currentCard.sampleSentenceDe, `v_sent_${currentCard.id}`);
                      }}
                      className="text-amber-400 hover:text-amber-300 p-1 rounded-md cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div lang="de" translate="no" className="notranslate text-sm font-bold text-white">
                    {currentCard.sampleSentenceDe}
                  </div>
                  <div className="text-xs text-slate-300">{currentCard.sampleSentenceTr}</div>
                </div>
              </div>
            )}

            {/* Bottom action inside card */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400">
              <span>{verbFlipped ? '🔄 Ön Yüze Dön' : '🔄 Arka Yüzü Gör'}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenPronunciationWithPhrase(currentCard.sampleSentenceDe);
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
              disabled={verbCardIndex === 0}
              onClick={() => {
                setVerbCardIndex(prev => Math.max(0, prev - 1));
                setVerbFlipped(false);
              }}
              className={`flex-1 py-3 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 border transition-all cursor-pointer ${
                verbCardIndex === 0
                  ? 'bg-slate-950/40 text-slate-600 border-slate-900 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-800 hover:border-slate-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Önceki Kart</span>
            </button>

            <button
              type="button"
              onClick={() => setVerbFlipped(!verbFlipped)}
              className="px-5 py-3 rounded-2xl font-black text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
              <span>{verbFlipped ? 'Ön Yüz' : 'Kartı Çevir'}</span>
            </button>

            <button
              type="button"
              disabled={verbCardIndex >= filteredVerbs.length - 1}
              onClick={() => {
                setVerbCardIndex(prev => Math.min(filteredVerbs.length - 1, prev + 1));
                setVerbFlipped(false);
              }}
              className={`flex-1 py-3 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 border transition-all cursor-pointer ${
                verbCardIndex >= filteredVerbs.length - 1
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

      {/* VERBS GRID VIEW */}
      {verbViewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVerbs.map((verb) => {
            const isPlaying = playingId === `verb_${verb.id}`;
            return (
              <div
                key={verb.id}
                className="p-4 sm:p-5 bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 rounded-3xl space-y-3.5 transition-all shadow-lg flex flex-col justify-between group"
              >
                <div className="space-y-2.5">
                  {/* Tags */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md">
                      {verb.category}
                    </span>

                    <div className="flex items-center space-x-1">
                      {verb.isSeparable && (
                        <span className="text-[10px] font-black text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-md">
                          ✂️ Ayrılabilir
                        </span>
                      )}
                      {verb.isIrregular && (
                        <span className="text-[10px] font-black text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-md">
                          ⚡ Düzensiz
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Verb Header */}
                  <div className="flex items-start justify-between pt-1">
                    <div>
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">🇩🇪 DE</span>
                        <h4 lang="de" translate="no" className="notranslate text-lg sm:text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                          {verb.german}
                        </h4>
                      </div>
                      <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                        🗣️ [{verb.pronunciation}]
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePlayVerbDetails(verb)}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                        isPlaying ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-300 hover:text-white'
                      }`}
                      title="Fiili ve Cümleyi Dinle"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-2 bg-slate-900/50 border border-slate-800/60 rounded-xl">
                    <span className="text-[10px] font-black text-slate-400 block mb-0.5">🇹🇷 TÜRKÇE ANLAMI:</span>
                    <span className="text-xs font-bold text-slate-100">{verb.turkish}</span>
                  </div>

                  {/* Conjugation Summary */}
                  {verb.conjugationSummary && (
                    <div className="p-2.5 bg-slate-900/70 border border-slate-800 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Çekim Özeti:</span>
                      <span lang="de" translate="no" className="notranslate text-xs font-mono text-indigo-300 font-semibold">{verb.conjugationSummary}</span>
                    </div>
                  )}

                  {/* Sample Sentence */}
                  <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded">🇩🇪</span>
                        <span lang="de" translate="no" className="notranslate font-bold text-white text-xs sm:text-sm">{verb.sampleSentenceDe}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(verb.sampleSentenceDe, `v_sent_${verb.id}`)}
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-300 pl-4 border-l-2 border-slate-700">{verb.sampleSentenceTr}</div>
                  </div>
                </div>

                {/* AI Pronunciation button */}
                <button
                  type="button"
                  onClick={() => handleOpenPronunciationWithPhrase(verb.sampleSentenceDe)}
                  className="w-full py-2 bg-slate-900 hover:bg-indigo-600 hover:text-white text-slate-300 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Mic className="w-3 h-3 text-amber-400" />
                  <span>AI ile Telaffuz Et</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
