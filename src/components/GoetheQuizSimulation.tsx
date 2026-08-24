import React, { useState, useEffect, useRef } from 'react';
import { 
  GoetheLevel, 
  GoetheSection, 
  GoetheQuizQuestion, 
  GoetheSimulationConfig,
  QuestionUserResult,
  GoetheAssessmentSummary,
  getRandomizedSimulationQuestions, 
  calculateAssessmentSummary 
} from '../data/goetheQuizData';
import { speakText } from '../utils/speechUtils';
import { playCoinSound, playSuccessChime } from '../utils/audioEffects';
import { 
  Award, Sparkles, Volume2, CheckCircle2, XCircle, RotateCcw, 
  ArrowRight, ArrowLeft, Trophy, Star, Clock, HelpCircle, 
  Check, Play, Pause, Bookmark, BookmarkCheck, BarChart3, 
  Layers, Zap, BookOpen, AlertCircle, Share2, Download, 
  ChevronRight, ChevronLeft, ShieldCheck, Flame, Compass, MessageSquare, VolumeX
} from 'lucide-react';

interface GoetheQuizSimulationProps {
  onEarnReward?: (tokenAmount: number, xpAmount: number, msg: string) => void;
  onBackToCurriculum?: () => void;
}

export const GoetheQuizSimulation: React.FC<GoetheQuizSimulationProps> = ({
  onEarnReward,
  onBackToCurriculum
}) => {
  // Screen views: 'config' | 'exam' | 'summary' | 'review'
  const [currentView, setCurrentView] = useState<'config' | 'exam' | 'summary' | 'review'>('config');

  // Config State
  const [config, setConfig] = useState<GoetheSimulationConfig>({
    level: 'ALL',
    section: 'ALL',
    questionCount: 15,
    mode: 'exam',
    timeLimitMinutes: 15
  });

  // Active Exam State
  const [questions, setQuestions] = useState<GoetheQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number | null>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [examStartTime, setExamStartTime] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [practiceFeedbackRevealed, setPracticeFeedbackRevealed] = useState<boolean>(false);

  // Final Assessment Summary State
  const [assessmentSummary, setAssessmentSummary] = useState<GoetheAssessmentSummary | null>(null);
  const [resultsList, setResultsList] = useState<QuestionUserResult[]>([]);
  const [reviewedQuestionIndex, setReviewedQuestionIndex] = useState<number>(0);

  // Timer Ref
  const timerRef = useRef<any>(null);

  // Start Simulation Handler
  const handleStartSimulation = () => {
    const pulled = getRandomizedSimulationQuestions(config);
    if (pulled.length === 0) {
      alert('Seçilen kriterlere uygun soru bulunamadı. Lütfen filtreleri genişletiniz.');
      return;
    }

    const calculatedTimeSec = (config.timeLimitMinutes || config.questionCount) * 60;
    setQuestions(pulled);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setTimeRemainingSeconds(calculatedTimeSec);
    setIsTimerRunning(true);
    setExamStartTime(Date.now());
    setPracticeFeedbackRevealed(false);
    setCurrentView('exam');
  };

  // Timer countdown
  useEffect(() => {
    if (currentView === 'exam' && isTimerRunning && timeRemainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [currentView, isTimerRunning, timeRemainingSeconds]);

  // Audio Playback
  const handlePlayAudio = async (text?: string) => {
    if (!text || isPlayingAudio) return;
    try {
      setIsPlayingAudio(true);
      await speakText(text, 'de', 0.9);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  // Select Option
  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex
    }));

    if (config.mode === 'practice') {
      setPracticeFeedbackRevealed(true);
      const isCorrect = questions[currentIndex]?.options[optionIndex]?.isCorrect;
      if (isCorrect) {
        playCoinSound();
      }
    }
  };

  // Toggle Flag question
  const handleToggleFlag = (idx: number) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Navigation
  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setPracticeFeedbackRevealed(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setPracticeFeedbackRevealed(false);
    }
  };

  // Finish Exam & Calculate Score
  const handleFinishExam = () => {
    clearInterval(timerRef.current);
    const durationSeconds = Math.max(5, Math.round((Date.now() - examStartTime) / 1000));

    const finalResults: QuestionUserResult[] = questions.map((q, idx) => {
      const selectedOpt = userAnswers[idx] ?? null;
      const isCorrect = selectedOpt !== null ? (q.options[selectedOpt]?.isCorrect ?? false) : false;
      return {
        question: q,
        selectedOptionIndex: selectedOpt,
        isCorrect,
        timeSpentSeconds: Math.round(durationSeconds / questions.length),
        isFlagged: !!flaggedQuestions[idx]
      };
    });

    const summary = calculateAssessmentSummary(finalResults, durationSeconds);
    setResultsList(finalResults);
    setAssessmentSummary(summary);
    setCurrentView('summary');

    playSuccessChime();

    if (onEarnReward) {
      onEarnReward(
        summary.tokenReward, 
        summary.xpReward, 
        `🏆 Goethe Simülasyonu Tamamlandı! (${summary.gradeLabelDe} - %${summary.totalScorePercentage})`
      );
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = userAnswers[currentIndex] ?? null;
  const isCurrentFlagged = !!flaggedQuestions[currentIndex];

  return (
    <div className="w-full space-y-6">
      
      {/* ========================================================
          1. CONFIGURATION & LAUNCHER SCREEN
      ======================================================== */}
      {currentView === 'config' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 p-6 sm:p-8 text-white shadow-2xl">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-xs font-bold text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Goethe-Institut & Telc A1-B1 Sınav Formatı</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Goethe Sınav Simülatörü & <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">Değerlendirme Raporu</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Gerçek Goethe A1, A2 ve B1 soru bankasından dinamik olarak soru çeken simülasyon testini başlatın; zaman yönetiminizi test edin ve sınav sonunda detaylı yetkinlik raporu ile performans puanınızı alın.
              </p>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Level Selection Card */}
            <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 backdrop-blur-xl">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-200">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>1. Hedef Seviye</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'ALL', label: 'Tümü (A1 - B1)', desc: 'Karma Seviye' },
                  { id: 'A1', label: 'Goethe A1', desc: 'Start Deutsch 1' },
                  { id: 'A2', label: 'Goethe A2', desc: 'Start Deutsch 2' },
                  { id: 'B1', label: 'Goethe B1', desc: 'Zertifikat B1' }
                ].map(lvl => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setConfig(prev => ({ ...prev, level: lvl.id as any }))}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      config.level === lvl.id
                        ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{lvl.label}</div>
                    <div className="text-[10px] text-slate-400">{lvl.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Exam Length & Timing Card */}
            <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 backdrop-blur-xl">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-200">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>2. Soru Sayısı & Süre</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { count: 10, time: 10, label: '10 Soru', badge: 'Hızlı' },
                  { count: 15, time: 15, label: '15 Soru', badge: 'Standart' },
                  { count: 20, time: 20, label: '20 Soru', badge: 'Kapsamlı' }
                ].map(item => (
                  <button
                    key={item.count}
                    type="button"
                    onClick={() => setConfig(prev => ({ ...prev, questionCount: item.count, timeLimitMinutes: item.time }))}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      config.questionCount === item.count
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-black">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">⏱️ {item.time} Dk</div>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/5 text-slate-300">
                      {item.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Exam Mode Card */}
            <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 backdrop-blur-xl">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-200">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>3. Simülasyon Tarzı</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, mode: 'exam' }))}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    config.mode === 'exam'
                      ? 'bg-emerald-600/30 border-emerald-400 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold text-emerald-300">🎓 Resmi Sınav</div>
                  <div className="text-[10px] text-slate-400 leading-tight mt-1">Zamanlayıcı & Sonuçta Detaylı Rapor</div>
                </button>

                <button
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, mode: 'practice' }))}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    config.mode === 'practice'
                      ? 'bg-purple-600/30 border-purple-400 text-white shadow-lg shadow-purple-500/20'
                      : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold text-purple-300">💡 Alıştırma Modu</div>
                  <div className="text-[10px] text-slate-400 leading-tight mt-1">Anında Çözüm, İpucu & Analiz</div>
                </button>
              </div>
            </div>

          </div>

          {/* Launch Action Bar */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/40 backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Hazır mısınız? Sınav dinamik soru havuzundan oluşturulacak.</span>
              </div>
              <div className="text-xs text-slate-400">
                Seviye: <strong>{config.level}</strong> • Soru: <strong>{config.questionCount} Adet</strong> • Mod: <strong>{config.mode === 'exam' ? 'Resmi Sınav' : 'Alıştırma'}</strong>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              {onBackToCurriculum && (
                <button
                  type="button"
                  onClick={onBackToCurriculum}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-2xl transition-all cursor-pointer"
                >
                  Derslere Dön
                </button>
              )}
              <button
                type="button"
                onClick={handleStartSimulation}
                className="flex-1 sm:flex-initial px-8 py-3.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 text-sm font-black rounded-2xl shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
              >
                <span>🚀 Simülasyonu Başlat</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
          2. ACTIVE EXAM SIMULATION VIEW
      ======================================================== */}
      {currentView === 'exam' && currentQuestion && (
        <div className="space-y-5 animate-in fade-in duration-200">
          
          {/* Exam Header Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-white/10 backdrop-blur-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
            
            {/* Left: Progress & Question info */}
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 rounded-xl text-xs font-black">
                {currentQuestion.level} Sınavı
              </span>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Soru {currentIndex + 1} / {questions.length}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 text-[11px] font-normal">{currentQuestion.sectionLabelTr}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {currentQuestion.topic}
                </div>
              </div>
            </div>

            {/* Right: Timer & Actions */}
            <div className="flex items-center space-x-2">
              {/* Flag Bookmark */}
              <button
                type="button"
                onClick={() => handleToggleFlag(currentIndex)}
                title="Soruyu İşaretle (Gözden Geçir)"
                className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  isCurrentFlagged
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {isCurrentFlagged ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
                <span className="hidden sm:inline">{isCurrentFlagged ? 'İşaretlendi' : 'İşaretle'}</span>
              </button>

              {/* Timer Pill */}
              <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-black flex items-center gap-1.5 ${
                timeRemainingSeconds < 120 
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse' 
                  : 'bg-slate-950/80 border-white/10 text-amber-300'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(timeRemainingSeconds)}</span>
              </div>

              {/* End Exam Early */}
              <button
                type="button"
                onClick={() => {
                  if (confirm('Sınavı şimdi bitirip değerlendirme raporunu almak istiyor musunuz?')) {
                    handleFinishExam();
                  }
                }}
                className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Sınavı Bitir
              </button>
            </div>

          </div>

          {/* Progress Bar Strip */}
          <div className="w-full bg-slate-900/60 rounded-full h-1.5 overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-indigo-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Main Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 backdrop-blur-2xl space-y-6 shadow-2xl">
            
            {/* Prompt & German Passage */}
            <div className="space-y-3">
              <div className="text-base sm:text-xl font-bold text-white leading-relaxed">
                {currentQuestion.promptDe}
              </div>
              <div className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
                <span className="text-amber-400 font-bold">🇹🇷</span>
                <span>{currentQuestion.promptTr}</span>
              </div>
            </div>

            {/* Context Snippet (if Reading or Signage question) */}
            {currentQuestion.contextSnippet && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-amber-500/30 font-mono text-xs sm:text-sm text-amber-200/90 whitespace-pre-line leading-relaxed shadow-inner">
                {currentQuestion.contextSnippet}
              </div>
            )}

            {/* Audio Voice Player (if Listening question) */}
            {currentQuestion.audioText && (
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-indigo-400" />
                    <span>Goethe Ses Kaydı Simülasyonu</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Almanca anonsu dinlemek için butona tıklayınız.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handlePlayAudio(currentQuestion.audioText)}
                  disabled={isPlayingAudio}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-spin' : ''}`} />
                  <span>{isPlayingAudio ? 'Dinletiliyor...' : 'Sesi Çal'}</span>
                </button>
              </div>
            )}

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((opt, optIdx) => {
                const isSelected = selectedAnswer === optIdx;
                const optLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

                let optionStyles = 'bg-slate-950/60 border-white/10 text-slate-200 hover:border-white/30 hover:bg-slate-900';
                
                if (isSelected) {
                  optionStyles = 'bg-indigo-600/30 border-indigo-400 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400';
                }

                // In practice mode after answer
                if (config.mode === 'practice' && practiceFeedbackRevealed) {
                  if (opt.isCorrect) {
                    optionStyles = 'bg-emerald-950/60 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400';
                  } else if (isSelected && !opt.isCorrect) {
                    optionStyles = 'bg-rose-950/60 border-rose-400 text-rose-200 ring-1 ring-rose-400';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${optionStyles}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-7 h-7 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-xs font-black text-slate-300">
                        {optLetter}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold">{opt.text}</span>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Practice Mode Feedback Drawer */}
            {config.mode === 'practice' && practiceFeedbackRevealed && (
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-indigo-500/30 space-y-2 animate-in fade-in">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Çözüm & Sınav Stratejisi</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{currentQuestion.explanationTr}</p>
                <div className="pt-1 text-[11px] text-indigo-300 font-medium">
                  💡 İpucu: {currentQuestion.examTip}
                </div>
              </div>
            )}

            {/* Bottom Nav Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={handlePrevQuestion}
                className="px-4 py-2.5 rounded-2xl bg-slate-950/70 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Önceki</span>
              </button>

              <div className="text-xs text-slate-400 hidden sm:block">
                Cevaplanan: <strong>{Object.keys(userAnswers).length}</strong> / {questions.length}
              </div>

              {currentIndex === questions.length - 1 ? (
                <button
                  type="button"
                  onClick={handleFinishExam}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all active:scale-95"
                >
                  <span>Değerlendirmeyi Al</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 cursor-pointer transition-all"
                >
                  <span>Sonraki Soru</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

          {/* Quick Jump Question Matrix Palette */}
          <div className="p-4 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-2">
            <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
              <span>Soru Gezintisi:</span>
              <div className="flex items-center space-x-3 text-[10px]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Cevaplandı</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> İşaretli</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-700" /> Boş</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {questions.map((q, idx) => {
                const isAnswered = userAnswers[idx] !== undefined && userAnswers[idx] !== null;
                const isFlagged = !!flaggedQuestions[idx];
                const isCurrent = idx === currentIndex;

                let pillColor = 'bg-slate-950/80 text-slate-400 border-white/5';
                if (isCurrent) {
                  pillColor = 'bg-white text-slate-950 font-black border-white ring-2 ring-indigo-400';
                } else if (isFlagged) {
                  pillColor = 'bg-amber-500/30 text-amber-300 border-amber-500/50';
                } else if (isAnswered) {
                  pillColor = 'bg-indigo-600/40 text-indigo-200 border-indigo-500/40';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setPracticeFeedbackRevealed(false);
                    }}
                    className={`w-8 h-8 rounded-xl text-xs font-bold border flex items-center justify-center transition-all cursor-pointer ${pillColor}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
          3. FINAL ASSESSMENT SUMMARY & PERFORMANCE SCORING SCREEN
      ======================================================== */}
      {currentView === 'summary' && assessmentSummary && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Main Score & Grade Hero Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/40 text-white shadow-2xl space-y-6">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* Circular Score Visual */}
              <div className="flex items-center space-x-5">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-950 border-4 border-indigo-500 flex flex-col items-center justify-center text-center shadow-xl shadow-indigo-500/20">
                  <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                    %{assessmentSummary.totalScorePercentage}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">
                    {assessmentSummary.correctAnswersCount} / {assessmentSummary.totalQuestions} Doğru
                  </span>
                </div>

                <div className="space-y-1 text-center sm:text-left">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full text-xs font-black text-amber-300">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>{assessmentSummary.gradeLabelDe}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {assessmentSummary.gradeLabelTr}
                  </h2>
                  <p className="text-xs text-slate-300">
                    Toplam Süre: <strong>{Math.round(assessmentSummary.totalDurationSeconds / 60)} dakika</strong> • Soru Başına: <strong>{assessmentSummary.averageTimePerQuestion} sn</strong>
                  </p>
                </div>
              </div>

              {/* Rewards Box */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-center space-y-1 shrink-0 min-w-[160px]">
                <div className="text-[11px] text-slate-400">Kazanılan Ödül</div>
                <div className="text-lg font-black text-emerald-400 flex items-center justify-center gap-1">
                  <span>+{assessmentSummary.tokenReward} 🪙 Jeton</span>
                </div>
                <div className="text-[11px] font-mono text-indigo-300">
                  +{assessmentSummary.xpReward} XP Deneyim
                </div>
              </div>

            </div>

          </div>

          {/* Analytics Grid: CEFR Levels & Skill Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* By CEFR Level Breakdown */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4 backdrop-blur-xl">
              <div className="flex items-center space-x-2 text-sm font-bold text-white">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <span>Goethe Seviye Dağılımı (CEFR)</span>
              </div>
              <div className="space-y-3">
                {(['A1', 'A2', 'B1'] as GoetheLevel[]).map(lvl => {
                  const data = assessmentSummary.byLevelBreakdown[lvl];
                  if (data.total === 0) return null;
                  return (
                    <div key={lvl} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200">Goethe {lvl} Soruları</span>
                        <span className="text-indigo-300 font-mono font-bold">
                          {data.correct} / {data.total} (%{data.percentage})
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            data.percentage >= 80 ? 'bg-emerald-400' : data.percentage >= 60 ? 'bg-amber-400' : 'bg-rose-400'
                          }`}
                          style={{ width: `${data.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* By Section Breakdown */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4 backdrop-blur-xl">
              <div className="flex items-center space-x-2 text-sm font-bold text-white">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Beceri & Alan Yetkinliği</span>
              </div>
              <div className="space-y-3">
                {Object.entries(assessmentSummary.bySectionBreakdown).map(([secKey, data]) => {
                  if (data.total === 0) return null;
                  return (
                    <div key={secKey} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200">{data.labelTr}</span>
                        <span className="text-amber-300 font-mono font-bold">
                          {data.correct}/{data.total} (%{data.percentage})
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            data.percentage >= 80 ? 'bg-emerald-400' : data.percentage >= 60 ? 'bg-amber-400' : 'bg-rose-400'
                          }`}
                          style={{ width: `${data.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* AI Diagnostic Strengths & Recommendations */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-4">
            <div className="flex items-center space-x-2 text-sm font-bold text-white">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Kişiselleştirilmiş Gelişim Raporu & Öneriler</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Güçlü Yönleriniz:</span>
                </div>
                <ul className="space-y-1 text-slate-300 list-disc list-inside">
                  {assessmentSummary.strengths.map((str, i) => (
                    <li key={i}>{str}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-amber-300">
                  <AlertCircle className="w-4 h-4" />
                  <span>Önerilen Çalışma Planı:</span>
                </div>
                <ul className="space-y-1 text-slate-300 list-disc list-inside">
                  {assessmentSummary.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setReviewedQuestionIndex(0);
                setCurrentView('review');
              }}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20"
            >
              <BookOpen className="w-4 h-4" />
              <span>Tüm Soruları & Açıklamaları İncele</span>
            </button>

            <div className="flex items-center space-x-3">
              {onBackToCurriculum && (
                <button
                  type="button"
                  onClick={onBackToCurriculum}
                  className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-bold rounded-2xl transition-all cursor-pointer"
                >
                  Müfredata Dön
                </button>
              )}

              <button
                type="button"
                onClick={() => setCurrentView('config')}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs sm:text-sm font-black rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Yeni Simülasyon Başlat</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
          4. QUESTION-BY-QUESTION REVIEW SCREEN
      ======================================================== */}
      {currentView === 'review' && resultsList.length > 0 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          
          {/* Header */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-white/10 backdrop-blur-2xl flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('summary')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Özet Rapora Dön</span>
            </button>

            <div className="text-xs font-bold text-white">
              Soru {reviewedQuestionIndex + 1} / {resultsList.length} İncelemesi
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                disabled={reviewedQuestionIndex === 0}
                onClick={() => setReviewedQuestionIndex(prev => prev - 1)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={reviewedQuestionIndex === resultsList.length - 1}
                onClick={() => setReviewedQuestionIndex(prev => prev + 1)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Review Card */}
          {(() => {
            const currentResult = resultsList[reviewedQuestionIndex];
            const q = currentResult.question;
            const userChoice = currentResult.selectedOptionIndex;

            return (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 backdrop-blur-2xl space-y-6 shadow-2xl">
                
                {/* Result Pill */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-xl border border-indigo-500/30">
                    Goethe {q.level} • {q.sectionLabelTr}
                  </span>
                  <div className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 ${
                    currentResult.isCorrect 
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                  }`}>
                    {currentResult.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span>{currentResult.isCorrect ? 'Doğru Cevapladınız' : 'Yanlış / Boş Bırakıldı'}</span>
                  </div>
                </div>

                {/* Question text */}
                <div className="space-y-2">
                  <div className="text-base sm:text-lg font-bold text-white leading-relaxed">
                    {q.promptDe}
                  </div>
                  <div className="text-xs text-slate-300">
                    🇹🇷 {q.promptTr}
                  </div>
                </div>

                {/* Context snippet if any */}
                {q.contextSnippet && (
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-amber-200 text-xs font-mono whitespace-pre-line">
                    {q.contextSnippet}
                  </div>
                )}

                {/* Audio replay if any */}
                {q.audioText && (
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(q.audioText)}
                    className="px-4 py-2 bg-indigo-600/30 border border-indigo-400/40 hover:bg-indigo-600/40 text-indigo-300 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Sesi Tekrar Dinle</span>
                  </button>
                )}

                {/* Options Breakdown */}
                <div className="space-y-2.5">
                  {q.options.map((opt, oIdx) => {
                    const isUserChoice = userChoice === oIdx;
                    const isCorrect = opt.isCorrect;

                    let optBg = 'bg-slate-950/60 border-white/10 text-slate-300';
                    if (isCorrect) {
                      optBg = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                    } else if (isUserChoice && !isCorrect) {
                      optBg = 'bg-rose-950/60 border-rose-500 text-rose-200 ring-1 ring-rose-500';
                    }

                    return (
                      <div
                        key={oIdx}
                        className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 ${optBg}`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="w-6 h-6 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center font-bold">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                        {isCorrect && (
                          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Doğru Seçenek
                          </span>
                        )}
                        {isUserChoice && !isCorrect && (
                          <span className="text-[11px] font-bold text-rose-400">
                            Sizin Seçiminiz ❌
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-indigo-500/30 space-y-2">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Açıklama & Çözüm Analizi:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{q.explanationTr}</p>
                  <p className="text-[11px] text-slate-400 italic">🇩🇪 {q.explanationDe}</p>
                  <div className="pt-1 text-[11px] text-indigo-300 font-semibold">
                    💡 Sınav Stratejisi: {q.examTip}
                  </div>
                </div>

              </div>
            );
          })()}

        </div>
      )}

    </div>
  );
};
