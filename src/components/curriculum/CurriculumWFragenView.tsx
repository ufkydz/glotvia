import React, { useState } from 'react';
import { Volume2, PlayCircle, PauseCircle, Search, Shuffle, RotateCw, ChevronLeft, ChevronRight, Mic, Sparkles, HelpCircle } from 'lucide-react';
import { W_FRAGEN_ITEMS, WFrageItem } from '../../data/germanCurriculumData';

interface CurriculumWFragenViewProps {
  playingId: string | null;
  alphabetSpeechSpeed: number;
  handlePlayAudio: (text: string, id: string) => Promise<void>;
  handlePlayWFrage: (item: WFrageItem) => Promise<void>;
  handleOpenPronunciationWithPhrase: (phrase: string) => void;
  awardCoins: (amount: number, reason: string) => void;
}

export const CurriculumWFragenView: React.FC<CurriculumWFragenViewProps> = ({
  playingId,
  handlePlayAudio,
  handlePlayWFrage,
  handleOpenPronunciationWithPhrase,
}) => {
  const [wFragenSearchTerm, setWFragenSearchTerm] = useState('');
  const [wFragenCategoryFilter, setWFragenCategoryFilter] = useState<string>('all');
  const [wFragenViewMode, setWFragenViewMode] = useState<'cards' | 'flashcards'>('cards');
  const [wFragenCardIndex, setWFragenCardIndex] = useState<number>(0);
  const [wFragenFlipped, setWFragenFlipped] = useState<boolean>(false);
  const [selectedWFrageId, setSelectedWFrageId] = useState<string>('wf_1');
  const [customWFrageNoun, setCustomWFrageNoun] = useState('');

  const filteredWFragen = W_FRAGEN_ITEMS.filter(item => {
    if (wFragenCategoryFilter === 'zaman_yer') {
      if (!['Wann?', 'Wo?', 'Wohin?', 'Woher?'].includes(item.german)) return false;
    } else if (wFragenCategoryFilter === 'miktar_fiyat') {
      if (!['Wie viel?', 'Wie oft?'].includes(item.german)) return false;
    } else if (wFragenCategoryFilter === 'kisi_sebep') {
      if (!['Wer?', 'Warum?', 'Was?'].includes(item.german)) return false;
    } else if (wFragenCategoryFilter === 'adres_secim') {
      if (!item.german.includes('Welche')) return false;
    }
    if (wFragenSearchTerm) {
      const q = wFragenSearchTerm.toLowerCase();
      return (
        item.german.toLowerCase().includes(q) ||
        item.turkish.toLowerCase().includes(q) ||
        item.tipTr.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const currentCard = filteredWFragen[Math.min(wFragenCardIndex, Math.max(0, filteredWFragen.length - 1))];
  const activeWFrage = W_FRAGEN_ITEMS.find(w => w.id === selectedWFrageId) || W_FRAGEN_ITEMS[0];

  return (
    <div className="space-y-6">
      {/* Header & Category Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-black mb-2">
              <span>❓ 3. Not: W-Fragen & Temalı Kartlar</span>
              <span>•</span>
              <span>11 Temel Soru Kalıbı</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Goethe A1 Sınavı Soru Kalıpları (W-Fragen)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Sprechen 2. Bölüm (Thema Kartları) ve günlük yaşamda soru sormak için tüm W-Fragen kalıpları, mantıkları ve örnek diyaloglar.
            </p>
          </div>

          {/* Action buttons & View Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Switcher */}
            <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setWFragenViewMode('cards')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  wFragenViewMode === 'cards'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🔲 Grid Görünümü
              </button>
              <button
                type="button"
                onClick={() => {
                  setWFragenViewMode('flashcards');
                  setWFragenFlipped(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  wFragenViewMode === 'flashcards'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🗂️ Kartlı Sistem (Flip)
              </button>
            </div>

            {/* Sequence Play */}
            <button
              type="button"
              onClick={() => {
                filteredWFragen.forEach((wf, idx) => {
                  setTimeout(() => {
                    handlePlayWFrage(wf);
                  }, idx * 2500);
                });
              }}
              className="px-4 py-2.5 rounded-2xl text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white flex items-center space-x-2 transition-all shadow-md cursor-pointer hover:scale-105"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Sırayla Dinle ▶️</span>
            </button>
          </div>
        </div>

        {/* Categorized Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => { setWFragenCategoryFilter('all'); setWFragenCardIndex(0); setWFragenFlipped(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                wFragenCategoryFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Tüm Kalıplar ({W_FRAGEN_ITEMS.length})
            </button>
            <button
              type="button"
              onClick={() => { setWFragenCategoryFilter('zaman_yer'); setWFragenCardIndex(0); setWFragenFlipped(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                wFragenCategoryFilter === 'zaman_yer'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              ⏱️ Zaman & Mekan (Wann, Wo, Wohin)
            </button>
            <button
              type="button"
              onClick={() => { setWFragenCategoryFilter('miktar_fiyat'); setWFragenCardIndex(0); setWFragenFlipped(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                wFragenCategoryFilter === 'miktar_fiyat'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              🏷️ Miktar & Sıklık (Wie viel, Wie oft)
            </button>
            <button
              type="button"
              onClick={() => { setWFragenCategoryFilter('kisi_sebep'); setWFragenCardIndex(0); setWFragenFlipped(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                wFragenCategoryFilter === 'kisi_sebep'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              👤 Kişi & Sebep (Wer, Warum, Was)
            </button>
            <button
              type="button"
              onClick={() => { setWFragenCategoryFilter('adres_secim'); setWFragenCardIndex(0); setWFragenFlipped(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                wFragenCategoryFilter === 'adres_secim'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              📍 Seçim (Welche...)
            </button>
          </div>

          <div className="w-full sm:w-64 relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={wFragenSearchTerm}
              onChange={(e) => {
                setWFragenSearchTerm(e.target.value);
                setWFragenCardIndex(0);
              }}
              placeholder="Soru kalıbı veya anlam ara..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* SPRECHEN TEIL 2 KART GENERATOR LABORATUVARI */}
      <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-indigo-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Goethe Sınavı Sprechen Teil 2 Simülatörü</span>
            </div>
            <h3 className="text-xl font-black text-white mt-2">
              Thema Kartı ile W-Frage Soru Üretici
            </h3>
            <p className="text-xs text-slate-300">
              Sınavda masadaki karttan bir kelime çekersiniz (Örn: Thema: <strong>Essen & Trinken</strong>, Wort: <strong>Brot</strong>). Soru kalıbınızı seçip anında soru ve cevap oluşturun!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Step 1: Choose W-Frage */}
          <div className="p-5 bg-slate-950/90 border border-slate-800 rounded-3xl space-y-3">
            <span className="text-[11px] font-black uppercase text-amber-400">1. Soru Kalıbını Seçin</span>
            <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
              {W_FRAGEN_ITEMS.map((wf) => (
                <button
                  key={wf.id}
                  type="button"
                  onClick={() => setSelectedWFrageId(wf.id)}
                  className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-all cursor-pointer ${
                    selectedWFrageId === wf.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="font-black text-sm">{wf.german}</div>
                  <div className="text-[10px] opacity-80 truncate">{wf.turkish}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Thema / Card Word Input */}
          <div className="p-5 bg-slate-950/90 border border-slate-800 rounded-3xl space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[11px] font-black uppercase text-amber-400">2. Kart Kelimesi Yazın / Seçin</span>
              <input
                type="text"
                value={customWFrageNoun}
                onChange={(e) => setCustomWFrageNoun(e.target.value)}
                placeholder="Örn: Kaffee, Zug, Wochenende, Arzt..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400">Hızlı Örnek Kelimeler:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Kaffee', 'Brot', 'Zug', 'Wochenende', 'Arzt', 'Kurs', 'Handy', 'Urlaub'].map((wrd) => (
                    <button
                      key={wrd}
                      type="button"
                      onClick={() => setCustomWFrageNoun(wrd)}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-indigo-300 text-[11px] font-mono rounded-lg border border-slate-800 cursor-pointer"
                    >
                      {wrd}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
              💡 Seçili Soru Tipi: <strong className="text-white">{activeWFrage.german}</strong> ({activeWFrage.turkish})
            </div>
          </div>

          {/* Step 3: Generated Goethe Question & Answer */}
          <div className="p-5 bg-slate-950/90 border border-slate-800 rounded-3xl space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[11px] font-black uppercase text-emerald-400">3. Oluşturulan Sınav Diyaloğu</span>
              
              {/* Question */}
              <div className="p-3.5 bg-indigo-950/30 border border-indigo-500/30 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-indigo-400">SORU (FRAGE):</span>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(
                      customWFrageNoun ? `${activeWFrage.german.replace('?', '')} trinken/nehmen Sie ${customWFrageNoun}?` : activeWFrage.exampleDe,
                      'sim_q'
                    )}
                    className="text-amber-400 hover:text-amber-300 p-1"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div lang="de" translate="no" className="notranslate text-sm font-bold text-white">
                  {customWFrageNoun
                    ? `${activeWFrage.german.replace('?', '')} möchten Sie ${customWFrageNoun}?`
                    : activeWFrage.exampleDe}
                </div>
                <div className="text-xs text-slate-300">
                  {customWFrageNoun
                    ? `${activeWFrage.turkish} ${customWFrageNoun} istiyorsunuz?`
                    : activeWFrage.exampleTr}
                </div>
              </div>

              {/* Answer */}
              <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-emerald-400">CEVAP (ANTWORT):</span>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(activeWFrage.answerDe, 'sim_a')}
                    className="text-emerald-400 hover:text-emerald-300 p-1"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div lang="de" translate="no" className="notranslate text-sm font-bold text-emerald-300">
                  {activeWFrage.answerDe}
                </div>
                <div className="text-xs text-slate-300">
                  {activeWFrage.answerTr}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenPronunciationWithPhrase(
                customWFrageNoun
                  ? `${activeWFrage.german.replace('?', '')} möchten Sie ${customWFrageNoun}?`
                  : activeWFrage.exampleDe
              )}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Soruyu AI Koç ile Seslendir</span>
            </button>
          </div>
        </div>
      </div>

      {/* FLASHCARD INTERACTIVE FLIP MODE */}
      {wFragenViewMode === 'flashcards' && currentCard && (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Card Navigation & Progress */}
          <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-black">
                Kart {wFragenCardIndex + 1} / {filteredWFragen.length}
              </span>
              <span className="text-slate-400">W-Frage Soru Kalıbı</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const randomIdx = Math.floor(Math.random() * filteredWFragen.length);
                setWFragenCardIndex(randomIdx);
                setWFragenFlipped(false);
              }}
              className="flex items-center space-x-1 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Karıştır</span>
            </button>
          </div>

          {/* Flip Card Container */}
          <div
            onClick={() => setWFragenFlipped(!wFragenFlipped)}
            className="relative min-h-[350px] bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border-2 border-indigo-500/30 hover:border-amber-500/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all cursor-pointer group select-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
                {currentCard.german} • Soru Kalıbı
              </span>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayWFrage(currentCard);
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

            {!wFragenFlipped ? (
              /* FRONT OF CARD */
              <div className="text-center my-6 space-y-3">
                <div className="text-xs font-bold uppercase tracking-widest text-indigo-400">🇩🇪 W-FRAGE (SORU SÖZCÜĞÜ)</div>
                <h2 lang="de" translate="no" className="notranslate text-5xl sm:text-6xl font-black text-white group-hover:text-amber-300 transition-colors">
                  {currentCard.german}
                </h2>
                {currentCard.pronunciation && (
                  <div className="text-sm font-mono font-bold text-amber-400">
                    🗣️ [{currentCard.pronunciation}]
                  </div>
                )}
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-xl text-xs font-bold">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{currentCard.tipTr}</span>
                </div>
                <p className="text-xs text-slate-400 pt-3">
                  👆 Türkçe anlamını, örnek sınav sorusunu ve cevabını görmek için dokunun.
                </p>
              </div>
            ) : (
              /* BACK OF CARD */
              <div className="my-4 space-y-4 text-left">
                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <span className="text-[10px] font-black text-slate-400 block mb-1">🇹🇷 TÜRKÇE ANLAMI:</span>
                  <span className="text-xl font-black text-amber-300">{currentCard.turkish}</span>
                </div>

                <div className="p-3.5 bg-indigo-950/30 border border-indigo-500/30 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-indigo-400">ÖRNEK SINAV SORUSU:</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayAudio(currentCard.exampleDe, `wf_sent_${currentCard.id}`);
                      }}
                      className="text-amber-400 hover:text-amber-300 p-1"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div lang="de" translate="no" className="notranslate text-sm font-bold text-white">
                    {currentCard.exampleDe}
                  </div>
                  <div className="text-xs text-slate-300">{currentCard.exampleTr}</div>
                </div>

                <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-emerald-400">STANDART CEVAP KALIBI:</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayAudio(currentCard.answerDe, `wf_ans_${currentCard.id}`);
                      }}
                      className="text-emerald-400 hover:text-emerald-300 p-1"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div lang="de" translate="no" className="notranslate text-sm font-bold text-emerald-300">
                    {currentCard.answerDe}
                  </div>
                  <div className="text-xs text-slate-300">{currentCard.answerTr}</div>
                </div>
              </div>
            )}

            {/* Bottom action inside card */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400">
              <span>{wFragenFlipped ? '🔄 Ön Yüze Dön' : '🔄 Arka Yüzü Gör'}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenPronunciationWithPhrase(currentCard.exampleDe);
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
              disabled={wFragenCardIndex === 0}
              onClick={() => {
                setWFragenCardIndex(prev => Math.max(0, prev - 1));
                setWFragenFlipped(false);
              }}
              className={`flex-1 py-3 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 border transition-all cursor-pointer ${
                wFragenCardIndex === 0
                  ? 'bg-slate-950/40 text-slate-600 border-slate-900 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-800 hover:border-slate-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Önceki Kart</span>
            </button>

            <button
              type="button"
              onClick={() => setWFragenFlipped(!wFragenFlipped)}
              className="px-5 py-3 rounded-2xl font-black text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
              <span>{wFragenFlipped ? 'Ön Yüz' : 'Kartı Çevir'}</span>
            </button>

            <button
              type="button"
              disabled={wFragenCardIndex >= filteredWFragen.length - 1}
              onClick={() => {
                setWFragenCardIndex(prev => Math.min(filteredWFragen.length - 1, prev + 1));
                setWFragenFlipped(false);
              }}
              className={`flex-1 py-3 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 border transition-all cursor-pointer ${
                wFragenCardIndex >= filteredWFragen.length - 1
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

      {/* W-FRAGEN CARDS GRID */}
      {wFragenViewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWFragen.map((item) => {
            const isPlaying = playingId === `wf_${item.id}`;
            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 rounded-3xl space-y-3.5 transition-all shadow-lg flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">DE</span>
                        <h4 lang="de" translate="no" className="notranslate text-2xl font-black text-white group-hover:text-amber-300 transition-colors">
                          {item.german}
                        </h4>
                      </div>
                      {item.pronunciation && (
                        <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                          🗣️ [{item.pronunciation}]
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePlayWFrage(item)}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                        isPlaying ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-300 hover:text-white'
                      }`}
                      title="Sesli Dinle"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-2.5 bg-slate-900/50 border border-slate-800/60 rounded-xl space-y-0.5">
                    <span className="text-[10px] font-black text-slate-400 block">TÜRKÇE ANLAMI & İPUCU:</span>
                    <span className="text-sm font-bold text-slate-100">{item.turkish}</span>
                    <span className="text-[11px] text-indigo-300 block">{item.tipTr}</span>
                  </div>

                  {/* Example Q&A */}
                  <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold text-amber-400">❓ SORU:</span>
                      <div lang="de" translate="no" className="notranslate font-bold text-white">{item.exampleDe}</div>
                      <div className="text-[11px] text-slate-300">{item.exampleTr}</div>
                    </div>
                    <div className="pt-2 border-t border-slate-800 space-y-0.5">
                      <span className="text-[9px] font-bold text-emerald-400">💬 CEVAP:</span>
                      <div lang="de" translate="no" className="notranslate font-bold text-emerald-300">{item.answerDe}</div>
                      <div className="text-[11px] text-slate-300">{item.answerTr}</div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenPronunciationWithPhrase(item.exampleDe)}
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
