import React, { useState, useEffect } from 'react';
import { 
  Sparkles, CheckCircle2, AlertCircle, Volume2, Copy, Check, 
  RotateCcw, History, Award, BookOpen, ArrowRight, Lightbulb, 
  Layers, ShieldCheck, Zap, X, Trash2, Send, HelpCircle, ChevronRight
} from 'lucide-react';
import { TextCorrectionAnalysis, CorrectionCategory } from '../types';
import { analyzeGermanWritingText } from '../services/geminiService';
import { speakText } from '../utils/speechUtils';
import { playCoinSound, playSuccessChime } from '../utils/audioEffects';

interface AiWritingCorrectorProps {
  isOpen?: boolean;
  onClose?: () => void;
  onAwardCoins?: (amount: number, message: string) => void;
}

const SAMPLE_TEXTS = [
  {
    label: 'Kendini Tanıtma (Büyük Harf & Yaş)',
    text: 'ich heiße ufuk und ich bin 25 jahre alt.',
    desc: 'İsim ve yaş kuralları'
  },
  {
    label: 'Akkusativ & Artikel (Köpek & Kedi)',
    text: 'ich habe ein hund und ein katze.',
    desc: 'der/die/das ve -i hali'
  },
  {
    label: 'Yan Cümle & Fiil Sırası (weil)',
    text: 'ich lerne deutsch weil ich will in berlin arbeiten.',
    desc: 'weil bağlacında fiil sona gider'
  },
  {
    label: 'Ülke & Şehir Tanıtımı',
    text: 'mein name ist anna und ich komme aus türkei.',
    desc: 'aus der Türkei artikel kuralı'
  }
];

const GERMAN_SPECIAL_CHARS = ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'];

export const AiWritingCorrector: React.FC<AiWritingCorrectorProps> = ({
  isOpen = true,
  onClose,
  onAwardCoins
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'A1' | 'A2' | 'B1'>('A1');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<TextCorrectionAnalysis | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [history, setHistory] = useState<TextCorrectionAnalysis[]>(() => {
    try {
      const saved = localStorage.getItem('glotvia_writing_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState(false);

  const [appliedCorrectionMessage, setAppliedCorrectionMessage] = useState<string | null>(null);

  // Apply full corrected text into the input field
  const handleApplyFullCorrection = () => {
    if (!analysisResult) return;
    setInputText(analysisResult.correctedText);
    playSuccessChime();
    setAppliedCorrectionMessage('✅ Düzeltilmiş metin başarıyla metin kutunuza aktarıldı!');
    setTimeout(() => setAppliedCorrectionMessage(null), 3500);
  };

  // Apply a single specific correction into the input text
  const handleApplySingleCorrection = (corr: { originalPart: string; correctedPart: string }) => {
    if (!inputText) return;
    // Replace the first occurrence of the wrong part with the corrected part
    const updated = inputText.replace(corr.originalPart, corr.correctedPart);
    setInputText(updated);
    playCoinSound();
    setAppliedCorrectionMessage(`✅ "${corr.originalPart}" ➔ "${corr.correctedPart}" olarak düzeltildi!`);
    setTimeout(() => setAppliedCorrectionMessage(null), 3000);
  };

  // Instant Magic Auto-Fix without waiting
  const handleInstantMagicFix = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Lütfen önce düzeltilecek bir metin yazın.');
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const result = await analyzeGermanWritingText(inputText, selectedLevel);
      setAnalysisResult(result);
      setInputText(result.correctedText);
      saveToHistory(result);
      playSuccessChime();
      setAppliedCorrectionMessage('✨ Metninizdeki tüm hatalar otomatik olarak düzeltildi!');
      setTimeout(() => setAppliedCorrectionMessage(null), 4000);
      if (onAwardCoins) {
        onAwardCoins(15, '🪄 Otomatik Düzeltme Uygulandı (+15 Jeton)');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Düzeltme sırasında bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save history to localStorage
  const saveToHistory = (item: TextCorrectionAnalysis) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.originalText !== item.originalText);
      const updated = [item, ...filtered].slice(0, 10);
      try {
        localStorage.setItem('glotvia_writing_history', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('glotvia_writing_history');
    } catch (e) {
      console.error(e);
    }
  };

  const handleInsertChar = (char: string) => {
    setInputText(prev => prev + char);
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Lütfen analiz için en az bir kelime veya cümle yazın.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await analyzeGermanWritingText(inputText, selectedLevel);
      setAnalysisResult(result);
      saveToHistory(result);

      // Award tokens
      if (onAwardCoins) {
        onAwardCoins(15, '✍️ Yazı Analizi Tamamlandı (+15 Jeton)');
      } else {
        playCoinSound();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Analiz sırasında bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudio = async (text: string) => {
    try {
      setIsPlayingAudio(true);
      await speakText(text, 'de', 0.85);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getCategoryBadge = (type: CorrectionCategory) => {
    switch (type) {
      case 'capitalization':
        return { label: 'Büyük/Küçük Harf', bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30' };
      case 'article':
        return { label: 'Artikel (der/die/das)', bg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' };
      case 'grammar':
        return { label: 'Dilbilgisi / Çekim', bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30' };
      case 'word_order':
        return { label: 'Fiil / Kelime Sırası', bg: 'bg-purple-500/10 text-purple-300 border-purple-500/30' };
      case 'spelling':
        return { label: 'Yazım (Spelling / ß)', bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' };
      default:
        return { label: 'Kelime Bilgisi', bg: 'bg-blue-500/10 text-blue-300 border-blue-500/30' };
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-indigo-900/20 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">✍️</span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                glotvia AI Yazı Analizi & Akıllı Düzeltme
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow-md">
                Gemini Destekli
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Almanca yazdığınız cümleleri veya Türkçe çevirmek istediğiniz metinleri gönderin; yapay zeka artikelleri, fiil sıralarını, büyük harfleri ve telaffuzu anında analiz edip düzeltsin.
            </p>
          </div>

          {/* Quick Stats / History Toggle */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                showHistory 
                  ? 'bg-amber-500 text-slate-950 border-amber-400' 
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Geçmiş ({history.length})</span>
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Level Selector & Quick Sample Presets */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-bold">Hedef Seviye:</span>
            {(['A1', 'A2', 'B1'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                  selectedLevel === lvl
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs text-slate-400 hidden md:inline">Örnek Cümleler:</span>
            {SAMPLE_TEXTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputText(sample.text)}
                className="text-[11px] font-medium px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 rounded-lg whitespace-nowrap transition-colors"
                title={sample.desc}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Drawer if toggled */}
      {showHistory && (
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center space-x-2">
              <History className="w-4 h-4 text-amber-400" />
              <span>Önceki Yazı Analizleriniz ({history.length})</span>
            </h3>
            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center space-x-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Geçmişi Temizle</span>
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="text-xs text-slate-500 py-3">Henüz kaydedilmiş bir analiz geçmişi bulunmuyor.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setInputText(item.originalText);
                    setAnalysisResult(item);
                    setShowHistory(false);
                  }}
                  className="p-3 bg-slate-950 border border-slate-800/80 hover:border-amber-500/40 rounded-xl cursor-pointer transition-all space-y-1 group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono truncate max-w-[200px]">
                      {item.originalText}
                    </span>
                    <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                      item.score >= 90 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {item.score} Puan
                    </span>
                  </div>
                  <div className="text-xs text-amber-300 font-bold group-hover:text-amber-400 truncate">
                    ➔ {item.correctedText}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Input Area */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <span>Metninizi Girin (Almanca Cümle veya Türkçe İfade)</span>
          </label>
          <span className="text-xs text-slate-500 font-mono">
            {inputText.length} karakter • {inputText.trim() ? inputText.trim().split(/\s+/).length : 0} kelime
          </span>
        </div>

        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Örneğin: ich heiße ufuk und ich habe ein hund. ich lerne deutsch weil ich will in münchen arbeiten..."
            rows={4}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm sm:text-base text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-all font-sans leading-relaxed resize-y"
          />
        </div>

        {/* Special German Characters Toolbar & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="flex items-center space-x-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Özel Harfler:</span>
            {GERMAN_SPECIAL_CHARS.map((char) => (
              <button
                key={char}
                type="button"
                onClick={() => handleInsertChar(char)}
                className="w-8 h-8 rounded-lg bg-slate-950 hover:bg-amber-500 hover:text-slate-950 border border-slate-800 text-amber-400 font-black text-sm transition-all shadow-sm flex items-center justify-center active:scale-95"
              >
                {char}
              </button>
            ))}
            {inputText && (
              <button
                type="button"
                onClick={() => { setInputText(''); setAnalysisResult(null); }}
                className="text-xs text-slate-500 hover:text-rose-400 ml-2 transition-colors font-semibold"
              >
                Temizle
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {/* Quick Magic Fix button directly in input toolbar */}
            <button
              type="button"
              onClick={handleInstantMagicFix}
              disabled={isLoading || !inputText.trim()}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl font-black text-xs flex items-center justify-center space-x-1.5 border transition-all ${
                isLoading || !inputText.trim()
                  ? 'bg-slate-950 text-slate-600 border-slate-800 cursor-not-allowed'
                  : 'bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border-indigo-700/60 hover:border-indigo-500 shadow-md active:scale-95'
              }`}
              title="Metninizdeki hataları anında düzeltip metin kutusuna uygular"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>🪄 Hızlı Düzelt</span>
            </button>

            {/* Analyze & Detailed Report Button */}
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isLoading || !inputText.trim()}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 transition-all shadow-lg ${
                isLoading || !inputText.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/20 scale-105 active:scale-95'
              }`}
            >
              {isLoading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>İnceleniyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Metni İncele</span>
                  <span className="text-[10px] bg-slate-950 text-amber-400 px-1.5 py-0.5 rounded-full font-extrabold ml-1">
                    +15 🪙
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {appliedCorrectionMessage && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="font-bold">{appliedCorrectionMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Analysis Results View */}
      {analysisResult && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Top Result Banner: Score & Overall Feedback */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-slate-950/80 border border-slate-800/80 rounded-2xl">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black shadow-lg ${
                analysisResult.score >= 90
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                  : analysisResult.score >= 70
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                  : 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
              }`}>
                <span className="text-xl leading-none">{analysisResult.score}</span>
                <span className="text-[9px] uppercase tracking-wider font-bold opacity-80 mt-0.5">Puan</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-black text-white">
                    {analysisResult.isCorrect ? '🌟 Kusursuz Almanca Cümle!' : '🔍 Düzeltmeler & Geliştirmeler'}
                  </h3>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    analysisResult.isCorrect 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {analysisResult.corrections.length === 0 ? 'Hatasız' : `${analysisResult.corrections.length} Düzeltme`}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {analysisResult.overallFeedback}
                </p>
              </div>
            </div>

            {/* Quick Actions for Corrected Output */}
            <div className="flex items-center space-x-2 w-full md:w-auto justify-end flex-wrap gap-2">
              {/* 1-Click Replace/Apply to Input Text */}
              {!analysisResult.isCorrect && (
                <button
                  type="button"
                  onClick={handleApplyFullCorrection}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Metnimi Düzelt & Uygula</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handlePlayAudio(analysisResult.correctedText)}
                disabled={isPlayingAudio}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse text-amber-300' : ''}`} />
                <span>{isPlayingAudio ? 'Okunuyor...' : 'Dinle'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopy(analysisResult.correctedText)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all active:scale-95"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'Kopyalandı!' : 'Kopyala'}</span>
              </button>
            </div>
          </div>

          {/* Corrected Text Display Box */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                <span>✅ Doğru & Düzeltilmiş Almanca Cümle:</span>
              </h4>
              {!analysisResult.isCorrect && (
                <button
                  type="button"
                  onClick={handleApplyFullCorrection}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 transition-colors"
                >
                  <span>Metin Kutusunu Güncelle</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="p-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-amber-500/30 rounded-2xl space-y-3 shadow-inner">
              <p className="text-base sm:text-lg font-black text-amber-300 tracking-wide leading-relaxed">
                {analysisResult.correctedText}
              </p>

              {analysisResult.phonetic && (
                <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                  <span className="text-amber-500/80 font-bold">Telaffuz:</span>
                  <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">
                    {analysisResult.phonetic}
                  </span>
                </div>
              )}

              {analysisResult.translationTr && (
                <div className="flex items-start space-x-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                  <span className="text-indigo-400 font-bold">Türkçe Çeviri:</span>
                  <span className="font-medium italic">{analysisResult.translationTr}</span>
                </div>
              )}
            </div>
          </div>

          {/* Corrections Breakdown Cards with 1-Click Fix Button */}
          {analysisResult.corrections.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                <span>🔍 Yapılan Düzeltmeler ve Hata Sebepleri:</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {analysisResult.corrections.map((corr, idx) => {
                  const badge = getCategoryBadge(corr.type);
                  return (
                    <div
                      key={idx}
                      className="p-4 bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-2xl space-y-2.5 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        
                        {/* 1-Click Fix This Individual Mistake */}
                        <button
                          type="button"
                          onClick={() => handleApplySingleCorrection(corr)}
                          className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all flex items-center space-x-1"
                          title="Bu hatayı metin kutunuzda anında düzeltir"
                        >
                          <Check className="w-3 h-3" />
                          <span>Bu Hatayı Düzelt</span>
                        </button>
                      </div>

                      {/* Before / After */}
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="line-through text-rose-400 font-mono bg-rose-950/30 px-2 py-0.5 rounded border border-rose-900/50">
                          {corr.originalPart}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-emerald-400 font-bold font-mono bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/50">
                          {corr.correctedPart}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        💡 {corr.explanationTr}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Vocabulary Insights (Nouns, Articles & Meanings) */}
          {analysisResult.vocabularyInsights && analysisResult.vocabularyInsights.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Cümledeki Önemli İsimler & Artikeller (der/die/das):</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {analysisResult.vocabularyInsights.map((vocab, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        {vocab.article && (
                          <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                            vocab.article === 'der' ? 'bg-blue-500/20 text-blue-400' :
                            vocab.article === 'die' ? 'bg-rose-500/20 text-rose-400' :
                            'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {vocab.article}
                          </span>
                        )}
                        <span className="text-sm font-black text-white">{vocab.word}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(`${vocab.article ? vocab.article + ' ' : ''}${vocab.word}`)}
                        className="p-1 text-slate-400 hover:text-white bg-slate-900 rounded"
                        title="Dinle"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-xs text-slate-300 font-semibold">{vocab.meaningTr}</div>
                    {vocab.example && (
                      <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-900">
                        {vocab.example}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Alternatives */}
          {analysisResult.suggestedAlternatives && analysisResult.suggestedAlternatives.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                <span>Alternatif ve Doğal İfade Biçimleri:</span>
              </h4>
              <div className="space-y-2">
                {analysisResult.suggestedAlternatives.map((alt, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs text-slate-200"
                  >
                    <span className="font-medium">💬 {alt}</span>
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(alt)}
                      className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded-lg ml-2"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grammar Rule Summary */}
          {analysisResult.grammarRuleSummary && (
            <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-2xl flex items-start space-x-3 text-xs text-indigo-200">
              <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-indigo-300 mb-0.5">Altın Gramer Kuralı:</span>
                <span>{analysisResult.grammarRuleSummary}</span>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
