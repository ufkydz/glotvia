import React, { useState, useEffect } from 'react';
import { UserProfile, Flashcard, QuizQuestion } from '../types';
import { FLASHCARDS_DATA } from '../data/flashcardsData';
import { LANGUAGES_LIST } from '../data/languagesData';
import { speakText } from '../utils/speechUtils';
import { recordQuizResult } from '../utils/authStorage';
import { 
  Award, Sparkles, Volume2, CheckCircle2, XCircle, RotateCcw, 
  ArrowRight, Flame, Trophy, Star
} from 'lucide-react';

interface FlashcardQuizProps {
  currentUser: UserProfile;
  onUserUpdate: (updatedUser: UserProfile) => void;
  onGoToCards: () => void;
}

export const FlashcardQuiz: React.FC<FlashcardQuizProps> = ({
  currentUser,
  onUserUpdate,
  onGoToCards
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const targetLang = LANGUAGES_LIST.find(l => l.id === currentUser.targetLanguage) || LANGUAGES_LIST[0];

  // Generate 5 dynamic questions based on current target language
  const generateQuiz = () => {
    const shuffledCards = [...FLASHCARDS_DATA].sort(() => Math.random() - 0.5);
    const selected = shuffledCards.slice(0, 5);

    const generated: QuizQuestion[] = selected.map((card, idx) => {
      const typeNum = idx % 3; // Cycle through 3 formats
      const qType: QuizQuestion['type'] = 
        typeNum === 0 ? 'image-to-word' : 
        typeNum === 1 ? 'audio-to-word' : 'word-to-image';

      const correctTrans = card.translations[currentUser.targetLanguage] || card.translations['en'];

      // Generate 3 wrong options from other cards
      const otherCards = FLASHCARDS_DATA.filter(c => c.id !== card.id).sort(() => Math.random() - 0.5).slice(0, 3);
      
      const rawOptions = [
        {
          id: card.id,
          text: correctTrans.word,
          imageUrl: card.imageUrl,
          phonetic: correctTrans.phonetic,
          isCorrect: true
        },
        ...otherCards.map(oc => {
          const ocTrans = oc.translations[currentUser.targetLanguage] || oc.translations['en'];
          return {
            id: oc.id,
            text: ocTrans.word,
            imageUrl: oc.imageUrl,
            phonetic: ocTrans.phonetic,
            isCorrect: false
          };
        })
      ].sort(() => Math.random() - 0.5);

      let prompt = '';
      if (qType === 'image-to-word') {
        prompt = `Aşağıdaki görselin ${targetLang.name} karşılığı nedir?`;
      } else if (qType === 'audio-to-word') {
        prompt = `Sesli telaffuzu dinleyin ve doğru kelimeyi seçin:`;
      } else {
        prompt = `"${correctTrans.word}" (${card.turkishMeaning}) kelimesini temsil eden görseli seçin:`;
      }

      return {
        id: `q_${idx}`,
        type: qType,
        targetLanguage: currentUser.targetLanguage,
        flashcard: card,
        prompt,
        options: rawOptions
      };
    });

    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  useEffect(() => {
    generateQuiz();
  }, [currentUser.targetLanguage]);

  // Handle Option Click
  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (isAnswered) return;

    setSelectedOptionId(optionId);
    setIsAnswered(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  // Play audio for question
  const handlePlayAudio = (text: string) => {
    speakText(text, currentUser.targetLanguage);
  };

  // Next Question
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      // Finish Quiz & Save XP
      setQuizFinished(true);
      const percentage = Math.round((score / questions.length) * 100);
      const xpGained = score * 20 + 20; // Bonus XP
      const updated = recordQuizResult(percentage, xpGained);
      onUserUpdate(updated);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin text-4xl">⏳</div>
        <p className="text-sm text-slate-400 mt-2">Test soruları hazırlanıyor...</p>
      </div>
    );
  }

  // Quiz Results Summary Screen
  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const xpGained = score * 20 + 20;

    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
          
          <div className="inline-flex p-4 bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-3xl text-amber-400">
            <Trophy className="w-12 h-12 animate-bounce" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
              Test Tamamlandı
            </span>
            <h2 className="text-3xl font-black text-white">
              {percentage >= 80 ? '🎉 Harika Bir Performans!' : percentage >= 50 ? '👏 Tebrikler, İyi İş!' : '💪 Pratik Yapmaya Devam!'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {targetLang.name} kelime dağarcığınızı pekiştirdiniz ve seviye atladınız.
            </p>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <div className="text-2xl font-black text-amber-400">{score} / {questions.length}</div>
              <div className="text-[11px] font-bold text-slate-400">Doğru Cevap</div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <div className="text-2xl font-black text-emerald-400">%{percentage}</div>
              <div className="text-[11px] font-bold text-slate-400">Başarı Oranı</div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <div className="text-2xl font-black text-cyan-400">+{xpGained}</div>
              <div className="text-[11px] font-bold text-slate-400">Kazanılan XP</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={generateQuiz}
              className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Yeni Bir Test Başlat</span>
            </button>

            <button
              onClick={onGoToCards}
              className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all"
            >
              Resimli Kartlara Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const targetTrans = currentQ.flashcard.translations[currentUser.targetLanguage] || currentQ.flashcard.translations['en'];

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      
      {/* Progress & Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
            {targetLang.flag} {targetLang.name} Pratik
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-xs font-bold text-slate-400">
            Soru {currentIndex + 1} / {questions.length}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs font-bold">
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> {score} Doğru
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
        <div 
          className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Prompt */}
        <div className="text-center space-y-2">
          <h3 className="text-lg sm:text-xl font-black text-white">
            {currentQ.prompt}
          </h3>
        </div>

        {/* Question Media Area */}
        <div className="flex flex-col items-center justify-center">
          {currentQ.type === 'image-to-word' && (
            <div className="w-64 h-44 rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
              <img 
                src={currentQ.flashcard.imageUrl} 
                alt={currentQ.flashcard.turkishMeaning} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {currentQ.type === 'audio-to-word' && (
            <button
              onClick={() => handlePlayAudio(targetTrans.word)}
              className="p-8 bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 hover:scale-105 border-2 border-amber-400 text-amber-400 rounded-3xl transition-all shadow-xl flex flex-col items-center gap-3"
            >
              <Volume2 className="w-10 h-10 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                Sesi Tekrar Dinle
              </span>
            </button>
          )}

          {currentQ.type === 'word-to-image' && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center">
              <div className="text-2xl font-black text-amber-400 tracking-wide">
                {targetTrans.word}
              </div>
              <div className="text-xs font-bold text-slate-400 font-mono mt-1">
                {targetTrans.phonetic}
              </div>
            </div>
          )}
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentQ.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            let btnClass = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-white';

            if (isAnswered) {
              if (option.isCorrect) {
                btnClass = 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-950/40';
              } else if (isSelected && !option.isCorrect) {
                btnClass = 'bg-rose-500/20 border-rose-500 text-rose-300';
              } else {
                btnClass = 'bg-slate-950/40 border-slate-800 opacity-50 text-slate-500';
              }
            }

            return (
              <button
                key={option.id}
                disabled={isAnswered}
                onClick={() => handleSelectOption(option.id, option.isCorrect)}
                className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all flex items-center justify-between ${btnClass}`}
              >
                {/* Text or Image Option */}
                {currentQ.type === 'word-to-image' && option.imageUrl ? (
                  <div className="flex items-center space-x-3 w-full">
                    <img 
                      src={option.imageUrl} 
                      alt="" 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0" 
                    />
                    <span className="text-xs font-bold text-slate-300">{option.text}</span>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <div>{option.text}</div>
                    {option.phonetic && (
                      <div className="text-[11px] text-slate-400 font-mono font-normal">
                        {option.phonetic}
                      </div>
                    )}
                  </div>
                )}

                {/* Feedback Icons */}
                {isAnswered && (
                  <div>
                    {option.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Feedback Banner & Next Button */}
        {isAnswered && (
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs">
              <span className="text-slate-400">Doğru Telaffuz: </span>
              <span className="font-bold text-amber-400">{targetTrans.word} {targetTrans.phonetic}</span>
            </div>

            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>{currentIndex === questions.length - 1 ? 'Sonuçları Gör' : 'Sonraki Soru'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
