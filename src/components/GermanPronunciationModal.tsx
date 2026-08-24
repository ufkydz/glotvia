import React, { useState, useEffect } from 'react';
import {
  Mic, MicOff, Volume2, Sparkles, CheckCircle2, AlertCircle,
  RotateCcw, X, ShieldAlert, Zap, Snail, Award, ArrowRight, HelpCircle, Check
} from 'lucide-react';
import { playGermanText, stopGermanSpeech, SpeechSpeedMode } from '../services/germanTtsService';
import {
  germanSpeechRecognizer,
  SpeechRecognitionErrorCode,
  isSpeechRecognitionSupported
} from '../services/germanSpeechRecognitionService';
import {
  evaluateGermanPronunciation,
  PronunciationEvaluationResult,
  WordEvaluation,
  getGermanWordPhoneticAndTip
} from '../services/germanPronunciationEvaluator';
import { playCoinSound, playSuccessChime } from '../utils/audioEffects';

interface GermanPronunciationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetText: string;
  translationTr?: string;
  phoneticTr?: string;
  tipTr?: string;
  onAwardCoins?: (amount: number, reason: string) => void;
}

export const GermanPronunciationModal: React.FC<GermanPronunciationModalProps> = ({
  isOpen,
  onClose,
  targetText,
  translationTr,
  phoneticTr,
  tipTr,
  onAwardCoins
}) => {
  const [speedMode, setSpeedMode] = useState<SpeechSpeedMode>('normal');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const [isListening, setIsListening] = useState(false);
  const [interimSpoken, setInterimSpoken] = useState('');
  const [finalSpoken, setFinalSpoken] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [evaluation, setEvaluation] = useState<PronunciationEvaluationResult | null>(null);
  const [selectedWordTip, setSelectedWordTip] = useState<WordEvaluation | null>(null);
  const [hasRewarded, setHasRewarded] = useState(false);

  // Reset states on open/close or targetText change
  useEffect(() => {
    if (isOpen) {
      setInterimSpoken('');
      setFinalSpoken('');
      setErrorMessage(null);
      setEvaluation(null);
      setSelectedWordTip(null);
      setHasRewarded(false);
      setIsListening(false);
    } else {
      stopGermanSpeech();
      germanSpeechRecognizer.stop();
    }
  }, [isOpen, targetText]);

  if (!isOpen) return null;

  const handlePlayTargetAudio = async (forcedSpeed?: SpeechSpeedMode) => {
    const activeSpeed = forcedSpeed || speedMode;
    try {
      setIsPlayingAudio(true);
      await playGermanText(targetText, { speedMode: activeSpeed });
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const handlePlaySingleWord = async (word: string) => {
    try {
      setPlayingWord(word);
      await playGermanText(word, { speedMode: 'slow' });
    } finally {
      setPlayingWord(null);
    }
  };

  const handleStartListening = async () => {
    setErrorMessage(null);
    setInterimSpoken('');
    setFinalSpoken('');
    setEvaluation(null);

    const started = await germanSpeechRecognizer.start({
      onStart: () => {
        setIsListening(true);
      },
      onInterimResult: (transcript) => {
        setInterimSpoken(transcript);
      },
      onFinalResult: (res) => {
        setIsListening(false);
        setFinalSpoken(res.transcript);

        // Perform instant on-device phonetic and Levenshtein evaluation
        const evalResult = evaluateGermanPronunciation(targetText, res.transcript);
        setEvaluation(evalResult);

        // Chimes & Coins
        if (evalResult.score >= 75 && !hasRewarded) {
          playSuccessChime();
          playCoinSound();
          setHasRewarded(true);
          onAwardCoins?.(10, 'Harika Almanca Telaffuz Bonusu');
        } else if (evalResult.score >= 50 && !hasRewarded) {
          playSuccessChime();
          setHasRewarded(true);
          onAwardCoins?.(5, 'Telaffuz Deneme Bonusu');
        }
      },
      onError: (code: SpeechRecognitionErrorCode, msg: string) => {
        setIsListening(false);
        setErrorMessage(msg);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });

    if (!started && !errorMessage) {
      setIsListening(false);
    }
  };

  const handleStopListening = () => {
    germanSpeechRecognizer.stop();
    setIsListening(false);
  };

  // Get score color classes
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
    if (score >= 75) return 'text-teal-400 bg-teal-950/60 border-teal-500/40';
    if (score >= 60) return 'text-blue-400 bg-blue-950/60 border-blue-500/40';
    if (score >= 40) return 'text-amber-400 bg-amber-950/60 border-amber-500/40';
    return 'text-rose-400 bg-rose-950/60 border-rose-500/40';
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-indigo-500/30 rounded-3xl shadow-2xl shadow-indigo-950/50 p-5 sm:p-7 text-slate-100 flex flex-col gap-5">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                Almanca Telaffuz Testi
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
                  de-DE (Cihaz Üzeri)
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Doğru telaffuzu dinleyin, mikrofona söyleyin ve anında analiz edin.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Phrase Card */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-indigo-400">Hedef Cümle / Kelime</span>
            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/60 rounded-xl p-0.5">
              <button
                onClick={() => setSpeedMode('normal')}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium transition ${
                  speedMode === 'normal'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3 h-3" />
                Normal (1x)
              </button>
              <button
                onClick={() => setSpeedMode('slow')}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium transition ${
                  speedMode === 'slow'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Snail className="w-3 h-3" />
                Yavaş Telaffuz
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {targetText}
              </div>
              {phoneticTr && (
                <div className="text-sm font-mono text-indigo-300/90 mt-0.5">
                  {phoneticTr}
                </div>
              )}
              {translationTr && (
                <div className="text-sm text-slate-300 mt-1">
                  🇹🇷 {translationTr}
                </div>
              )}
            </div>

            {/* Quick Listen Button */}
            <button
              onClick={() => handlePlayTargetAudio()}
              disabled={isPlayingAudio}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition ${
                isPlayingAudio
                  ? 'bg-indigo-700 text-white ring-2 ring-indigo-400 animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              {isPlayingAudio ? 'Okunuyor...' : '🔊 Dinle'}
            </button>
          </div>

          {tipTr && (
            <div className="text-xs text-slate-400 bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-start gap-2 mt-1">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{tipTr}</span>
            </div>
          )}
        </div>

        {/* Microphone Recording Action Zone */}
        <div className="flex flex-col items-center justify-center py-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 text-center">
          {isListening ? (
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-40" />
                <button
                  onClick={handleStopListening}
                  className="relative w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-900/50 transition active:scale-95"
                >
                  <MicOff className="w-7 h-7" />
                </button>
              </div>
              <div className="text-sm font-bold text-rose-400 animate-pulse">
                🎙️ Dinleniyor... Şimdi cümleyi Almanca söyleyin!
              </div>
              {interimSpoken && (
                <div className="text-xs font-mono text-slate-300 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg max-w-sm">
                  "{interimSpoken}"
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5">
              <button
                onClick={handleStartListening}
                className="group flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-950/60 active:scale-95 transition"
              >
                <Mic className="w-5 h-5 group-hover:scale-110 transition" />
                🎤 Telaffuzumu Test Et
              </button>
              <span className="text-xs text-slate-400">
                Mikrofon düğmesine basın ve cümleyi yüksek sesle söyleyin.
              </span>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-3 text-xs text-rose-300 bg-rose-950/50 border border-rose-800/60 rounded-xl p-3 flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{errorMessage}</p>
                <p className="text-[11px] text-rose-400/90 mt-0.5">
                  İpucu: Cihazınızda mikrofon izninin açık olduğundan ve gürültüsüz ortamda konuştuğunuzdan emin olun.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Evaluation Results Breakdown */}
        {evaluation && (
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 animate-in slide-in-from-bottom-2 duration-300">
            
            {/* Top Score Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-2xl border font-extrabold text-2xl tracking-tight flex items-baseline gap-1 ${getScoreColor(evaluation.score)}`}>
                  <span>{evaluation.score}</span>
                  <span className="text-xs font-normal opacity-80">/ 100</span>
                </div>
                <div>
                  <div className="font-bold text-base text-white flex items-center gap-1.5">
                    {evaluation.grade}
                    {evaluation.score >= 90 && <span>🌟</span>}
                  </div>
                  <div className="text-xs text-slate-400">
                    {evaluation.overallFeedbackTr}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlayTargetAudio('slow')}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition font-medium"
                >
                  <Snail className="w-3.5 h-3.5" />
                  Yavaş Dinle
                </button>
                <button
                  onClick={handleStartListening}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Tekrar Söyle
                </button>
              </div>
            </div>

            {/* Recognized Speech Comparison */}
            <div className="bg-slate-900/90 border border-slate-800/60 rounded-xl p-3 text-xs flex flex-col gap-1.5">
              <div className="text-slate-400 flex items-center justify-between">
                <span>Hedef:</span>
                <span className="font-semibold text-white">{targetText}</span>
              </div>
              <div className="text-slate-400 flex items-center justify-between">
                <span>Söylediğiniz:</span>
                <span className={`font-semibold ${evaluation.score >= 70 ? 'text-emerald-300' : 'text-amber-300'}`}>
                  "{evaluation.spokenText || 'Ses algılanamadı'}"
                </span>
              </div>
            </div>

            {/* Word-by-Word Breakdown: Doğru (✓) & Geliştir (⚠) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Correct Words */}
              <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3 flex flex-col gap-2">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Doğru Telaffuz ({evaluation.correctWords.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {evaluation.correctWords.length > 0 ? (
                    evaluation.correctWords.map((cw, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedWordTip(cw)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition"
                      >
                        <span>✓</span>
                        <span>{cw.word}</span>
                      </button>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">Doğru kelime bulunamadı.</span>
                  )}
                </div>
              </div>

              {/* Needs Improvement Words */}
              <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-3 flex flex-col gap-2">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  Geliştirilmeli ({evaluation.needsImprovementWords.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {evaluation.needsImprovementWords.length > 0 ? (
                    evaluation.needsImprovementWords.map((nw, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedWordTip(nw)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition"
                      >
                        <span>⚠</span>
                        <span>{nw.word}</span>
                      </button>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-400 italic">Tüm kelimeler doğru telaffuz edildi!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Word Inspector & Phonetic Tutor Card */}
            {selectedWordTip && (
              <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-4 flex flex-col gap-2 text-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-white">{selectedWordTip.word}</span>
                    <span className="font-mono text-indigo-300">{selectedWordTip.phoneticTarget}</span>
                  </div>
                  <button
                    onClick={() => handlePlaySingleWord(selectedWordTip.word)}
                    disabled={playingWord === selectedWordTip.word}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Kelimeyi Dinle
                  </button>
                </div>
                {selectedWordTip.phoneticRuleTip && (
                  <p className="text-slate-300 mt-0.5">
                    💡 <span className="font-semibold text-amber-300">Telaffuz Kuralı: </span>
                    {selectedWordTip.phoneticRuleTip}
                  </p>
                )}
              </div>
            )}

            {/* Realism & Honesty Disclaimer */}
            <div className="text-[11px] text-slate-400 bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>{evaluation.disclaimer}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
