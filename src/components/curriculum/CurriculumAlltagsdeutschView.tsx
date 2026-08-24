import React, { useState } from 'react';
import { Volume2, PlayCircle, PauseCircle, Search, Shuffle, RotateCw, ChevronLeft, ChevronRight, Mic, Sparkles } from 'lucide-react';
import { ALLTAGSDEUTSCH_ITEMS, FEELING_DIALOGUES, AlltagsdeutschItem } from '../../data/germanCurriculumData';

interface CurriculumAlltagsdeutschViewProps {
  playingId: string | null;
  alltagsAudioMode: 'german_only' | 'with_turkish';
  setAlltagsAudioMode: (mode: 'german_only' | 'with_turkish') => void;
  handlePlayAudio: (text: string, id: string) => Promise<void>;
  handlePlayAlltagsItem: (item: AlltagsdeutschItem) => Promise<void>;
  handlePlayAllAlltags: (items: AlltagsdeutschItem[]) => Promise<void>;
  handleOpenPronunciationWithPhrase: (phrase: string) => void;
  awardCoins: (amount: number, reason: string) => void;
}

export const CurriculumAlltagsdeutschView: React.FC<CurriculumAlltagsdeutschViewProps> = ({
  playingId,
  alltagsAudioMode,
  setAlltagsAudioMode,
  handlePlayAudio,
  handlePlayAlltagsItem,
  handlePlayAllAlltags,
  handleOpenPronunciationWithPhrase,
}) => {
  const [alltagsCategoryFilter, setAlltagsCategoryFilter] = useState<'all' | 'begruessung' | 'abschied' | 'andere_saetze'>('all');
  const [alltagsSearchTerm, setAlltagsSearchTerm] = useState('');
  const [alltagsViewMode, setAlltagsViewMode] = useState<'cards' | 'flashcards'>('cards');
  const [alltagsCardIndex, setAlltagsCardIndex] = useState<number>(0);
  const [alltagsFlipped, setAlltagsFlipped] = useState<boolean>(false);
  const [selectedFeelingMood, setSelectedFeelingMood] = useState<Record<string, number>>({});

  const filteredItems = ALLTAGSDEUTSCH_ITEMS.filter(item => {
    if (alltagsCategoryFilter !== 'all' && item.category !== alltagsCategoryFilter) return false;
    if (alltagsSearchTerm) {
      const q = alltagsSearchTerm.toLowerCase();
      return (
        item.german.toLowerCase().includes(q) ||
        item.turkish.toLowerCase().includes(q) ||
        item.pronunciation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const currentCard = filteredItems[Math.min(alltagsCardIndex, Math.max(0, filteredItems.length - 1))];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-black mb-2">
              <span>💬 2. Not: Alltagsdeutsch</span>
              <span>•</span>
              <span>34 Günlük İfade + Diyaloglar</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Günlük Almanca: Selamlaşma, Veda & Nezaket Kalıpları
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Kuzey/Güney Almanya yerel selamlaşmaları, resmi & samimi hal-hatır sorma ve A1 sınavında hayat kurtaran ezber ifadeler.
            </p>
          </div>

          {/* Action buttons & View Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Switcher */}
            <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setAlltagsViewMode('cards')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  alltagsViewMode === 'cards'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🔲 Grid Görünümü
              </button>
              <button
                type="button"
                onClick={() => {
                  setAlltagsViewMode('flashcards');
                  setAlltagsFlipped(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  alltagsViewMode === 'flashcards'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🗂️ Kartlı Sistem (Flip)
              </button>
            </div>

            {/* Audio Mode toggle */}
            <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setAlltagsAudioMode('german_only')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  alltagsAudioMode === 'german_only'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🇩🇪 Sadece Almanca
              </button>
              <button
                type="button"
                onClick={() => setAlltagsAudioMode('with_turkish')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  alltagsAudioMode === 'with_turkish'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🇹🇷 Çift Ses (+Meal)
              </button>
            </div>

            {/* Play All button */}
            <button
              type="button"
              onClick={() => handlePlayAllAlltags(filteredItems)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center space-x-2 transition-all shadow-md cursor-pointer ${
                playingId === 'ad_all_playlist'
                  ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 hover:scale-105'
              }`}
            >
              {playingId === 'ad_all_playlist' ? (
                <>
                  <PauseCircle className="w-4 h-4" />
                  <span>Durdur</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Listeyi Dinle ▶️</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setAlltagsCategoryFilter('all');
                setAlltagsCardIndex(0);
                setAlltagsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                alltagsCategoryFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Tümü ({ALLTAGSDEUTSCH_ITEMS.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setAlltagsCategoryFilter('begruessung');
                setAlltagsCardIndex(0);
                setAlltagsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                alltagsCategoryFilter === 'begruessung'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              👋 Selamlaşma (Begrüßung)
            </button>
            <button
              type="button"
              onClick={() => {
                setAlltagsCategoryFilter('abschied');
                setAlltagsCardIndex(0);
                setAlltagsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                alltagsCategoryFilter === 'abschied'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              👋 Veda (Abschied)
            </button>
            <button
              type="button"
              onClick={() => {
                setAlltagsCategoryFilter('andere_saetze');
                setAlltagsCardIndex(0);
                setAlltagsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                alltagsCategoryFilter === 'andere_saetze'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              ⭐ Nezaket & Ezber
            </button>
          </div>

          <div className="w-full sm:w-64 relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={alltagsSearchTerm}
              onChange={(e) => {
                setAlltagsSearchTerm(e.target.value);
                setAlltagsCardIndex(0);
              }}
              placeholder="İfade veya anlam ara..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* HAL HATIR SORMA VE DİYALOG LABORATUVARI */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/30 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              🎭 İnteraktif Diyalog Laboratuvarı
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white mt-1.5">
              Nach dem Befinden fragen (Hal Hatır Sorma & Cevaplar)
            </h3>
            <p className="text-xs text-slate-300">
              Resmi (Formell - Ihnen) ve Samimi (Informell - dir) modları seçin; duygu durumuna göre yanıtları sesli dinleyin.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {FEELING_DIALOGUES.map((dlg) => {
            const currentSelectedMoodIdx = selectedFeelingMood[dlg.id] ?? 0;
            const activeResponse = dlg.responses[currentSelectedMoodIdx];
            const isPlayingQ = playingId === `dlg_q_${dlg.id}`;
            const isPlayingA = playingId === `dlg_a_${dlg.id}`;

            return (
              <div
                key={dlg.id}
                className="p-5 bg-slate-950/90 border border-slate-800 hover:border-indigo-500/40 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  {/* Header badge */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                      dlg.type === 'formell'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {dlg.type === 'formell' ? '🎩 Formell (Resmi / Siz)' : '👟 Informell (Samimi / Sen)'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {dlg.note}
                    </span>
                  </div>

                  {/* Question Bubble */}
                  <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-2xl space-y-1.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">FRAGE (SORU)</span>
                        <h4 className="text-base font-black text-white mt-0.5">{dlg.questionDe}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(dlg.questionDe, `dlg_q_${dlg.id}`)}
                        className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                          isPlayingQ ? 'bg-indigo-500 text-white' : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                        title="Soruyu Dinle"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    {dlg.questionPronunciation && (
                      <div className="text-xs font-mono font-bold text-amber-400">
                        [{dlg.questionPronunciation}]
                      </div>
                    )}
                    <div className="text-xs text-slate-300 font-semibold">{dlg.questionTr}</div>
                  </div>

                  {/* Mood Selector Tabs */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400">
                      Ruh Halinizi Seçin (Cevap Seçenekleri):
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {dlg.responses.map((resp, rIdx) => {
                        const isSelected = currentSelectedMoodIdx === rIdx;
                        return (
                          <button
                            key={rIdx}
                            type="button"
                            onClick={() => setSelectedFeelingMood(prev => ({ ...prev, [dlg.id]: rIdx }))}
                            className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md scale-105'
                                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <span className="text-base">{resp.emoji}</span>
                            <span className="truncate">
                              {resp.mood === 'positive' ? 'İyi' : resp.mood === 'neutral' ? 'Şöyle Böyle' : 'Kötü'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Response Display */}
                  {activeResponse && (
                    <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1.5">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">ANTWORT (CEVAP)</span>
                          <h4 className="text-sm sm:text-base font-black text-emerald-300 mt-0.5">
                            {activeResponse.emoji} {activeResponse.de}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(activeResponse.de, `dlg_a_${dlg.id}`)}
                          className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                            isPlayingA ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:text-white'
                          }`}
                          title="Cevabı Dinle"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      {activeResponse.pronunciation && (
                        <div className="text-xs font-mono font-bold text-amber-400">
                          [{activeResponse.pronunciation}]
                        </div>
                      )}
                      <div className="text-xs text-slate-300">{activeResponse.tr}</div>
                    </div>
                  )}
                </div>

                {/* AI Pronunciation Practice Button */}
                <button
                  type="button"
                  onClick={() => handleOpenPronunciationWithPhrase(activeResponse?.de || dlg.questionDe)}
                  className="w-full mt-2 py-2.5 bg-gradient-to-r from-indigo-600/20 to-amber-500/20 hover:from-indigo-600/40 hover:to-amber-500/40 border border-indigo-500/30 text-white rounded-xl font-black text-xs flex items-center justify-center space-x-2 transition-all hover:scale-102 cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mikrofon ile Telaffuzunu Dene (AI Koç)</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* FLASHCARD INTERACTIVE FLIP MODE */}
      {alltagsViewMode === 'flashcards' && currentCard && (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Card Navigation & Progress */}
          <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-black">
                Kart {alltagsCardIndex + 1} / {filteredItems.length}
              </span>
              <span className="text-slate-400">
                ({currentCard.category === 'begruessung' ? 'Selamlaşma' : currentCard.category === 'abschied' ? 'Veda' : 'Nezaket'})
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const randomIdx = Math.floor(Math.random() * filteredItems.length);
                setAlltagsCardIndex(randomIdx);
                setAlltagsFlipped(false);
              }}
              className="flex items-center space-x-1 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Karıştır</span>
            </button>
          </div>

          {/* Flip Card Container */}
          <div
            onClick={() => setAlltagsFlipped(!alltagsFlipped)}
            className="relative min-h-[350px] bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border-2 border-indigo-500/30 hover:border-amber-500/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all cursor-pointer group select-none"
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                currentCard.category === 'begruessung'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : currentCard.category === 'abschied'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {currentCard.category === 'begruessung' ? '👋 Selamlaşma' : currentCard.category === 'abschied' ? '👋 Veda' : '💬 Nezaket / Ezber'}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayAlltagsItem(currentCard);
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

            {!alltagsFlipped ? (
              /* FRONT OF CARD */
              <div className="text-center my-6 space-y-3">
                <div className="text-xs font-bold uppercase tracking-widest text-indigo-400">🇩🇪 ALMANCA İFADE</div>
                <h2 lang="de" translate="no" className="notranslate text-3xl sm:text-5xl font-black text-white group-hover:text-amber-300 transition-colors">
                  {currentCard.german}
                </h2>
                {currentCard.pronunciation && (
                  <div className="text-sm font-mono font-bold text-amber-400">
                    🗣️ [{currentCard.pronunciation}]
                  </div>
                )}
                {currentCard.isEzber && (
                  <span className="inline-block text-[11px] font-black bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-md">
                    ⭐ SINAV EZBER KALIBI
                  </span>
                )}
                <p className="text-xs text-slate-400 pt-3">
                  👆 Türkçe anlamını, bölge notunu ve örnek cümleyi görmek için dokunun.
                </p>
              </div>
            ) : (
              /* BACK OF CARD */
              <div className="my-4 space-y-4 text-left">
                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <span className="text-[10px] font-black text-slate-400 block mb-1">🇹🇷 TÜRKÇE ANLAMI:</span>
                  <span className="text-lg font-black text-amber-300">{currentCard.turkish}</span>
                </div>

                {currentCard.regionOrNote && (
                  <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl space-y-1">
                    <span className="text-[10px] font-black uppercase text-indigo-300 flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Kullanım Notu / Bölge:</span>
                    </span>
                    <p className="text-xs text-slate-200">{currentCard.regionOrNote}</p>
                  </div>
                )}

                {currentCard.exampleSentence && (
                  <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400">ÖRNEK KULLANIM:</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayAudio(currentCard.exampleSentence!, `ad_sent_${currentCard.id}`);
                        }}
                        className="text-amber-400 hover:text-amber-300 p-1 rounded-md"
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
              <span>{alltagsFlipped ? '🔄 Ön Yüze Dön' : '🔄 Arka Yüzü Gör'}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenPronunciationWithPhrase(currentCard.exampleSentence || currentCard.german);
                }}
                className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-1"
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
              disabled={alltagsCardIndex === 0}
              onClick={() => {
                setAlltagsCardIndex(prev => Math.max(0, prev - 1));
                setAlltagsFlipped(false);
              }}
              className={`flex-1 py-3 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 border transition-all cursor-pointer ${
                alltagsCardIndex === 0
                  ? 'bg-slate-950/40 text-slate-600 border-slate-900 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-800 hover:border-slate-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Önceki Kart</span>
            </button>

            <button
              type="button"
              onClick={() => setAlltagsFlipped(!alltagsFlipped)}
              className="px-5 py-3 rounded-2xl font-black text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
              <span>{alltagsFlipped ? 'Ön Yüz' : 'Kartı Çevir'}</span>
            </button>

            <button
              type="button"
              disabled={alltagsCardIndex >= filteredItems.length - 1}
              onClick={() => {
                setAlltagsCardIndex(prev => Math.min(filteredItems.length - 1, prev + 1));
                setAlltagsFlipped(false);
              }}
              className={`flex-1 py-3 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 border transition-all cursor-pointer ${
                alltagsCardIndex >= filteredItems.length - 1
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

      {/* ALLTAGSDEUTSCH CARDS GRID */}
      {alltagsViewMode === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredItems.map((item) => {
            const isPlaying = playingId === `ad_${item.id}`;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 flex flex-col justify-between group ${
                  item.isEzber
                    ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                    : 'bg-slate-950/80 border-slate-800 hover:border-indigo-500/40'
                }`}
              >
                <div className="space-y-2">
                  {/* Tags */}
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      item.category === 'begruessung'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : item.category === 'abschied'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {item.category === 'begruessung' ? '👋 Selamlaşma' : item.category === 'abschied' ? '👋 Veda' : '💬 Nezaket / Günlük'}
                    </span>

                    {item.isEzber && (
                      <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md animate-pulse">
                        ⭐ EZBER
                      </span>
                    )}
                  </div>

                  {/* German & Audio Button */}
                  <div className="flex items-start justify-between pt-1">
                    <div>
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">🇩🇪 DE</span>
                        <h4 lang="de" translate="no" className="notranslate text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                          {item.german}
                        </h4>
                      </div>
                      <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                        🗣️ [{item.pronunciation}]
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePlayAlltagsItem(item)}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                        isPlaying ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30' : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                      title="Sesli Dinle"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Turkish Meaning */}
                  <div className="p-2 bg-slate-900/50 border border-slate-800/60 rounded-xl">
                    <span className="text-[10px] font-black text-slate-400 block mb-0.5">🇹🇷 TÜRKÇE ANLAMI:</span>
                    <span className="text-xs font-bold text-slate-100">{item.turkish}</span>
                  </div>

                  {/* Note / Region */}
                  {item.regionOrNote && (
                    <div className="text-[11px] text-indigo-300/90 font-medium bg-indigo-950/40 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
                      💡 {item.regionOrNote}
                    </div>
                  )}
                </div>

                {/* Example sentence */}
                {item.exampleSentence && (
                  <div className="pt-2 border-t border-slate-850 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded">🇩🇪</span>
                        <span lang="de" translate="no" className="notranslate font-bold text-white text-xs">{item.exampleSentence}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(item.exampleSentence!, `ad_sent_${item.id}`)}
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-300 pl-4 border-l-2 border-slate-700">{item.exampleSentenceTr}</div>
                  </div>
                )}

                {/* AI Pronunciation Button */}
                <button
                  type="button"
                  onClick={() => handleOpenPronunciationWithPhrase(item.exampleSentence || item.german)}
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
