import React, { useState } from 'react';
import { CURRICULUM_TOPICS, CurriculumTopic } from '../data/germanCurriculumData';
import { UserProfile, UserTokenState } from '../types';
import { 
  CheckCircle2, Lock, Play, Star, Sparkles, Search, Compass, 
  Award, Clock, ArrowRight, BookOpen, ChevronRight, Zap
} from 'lucide-react';
import { GlassCard } from './glass/GlassCard';
import { GlassButton } from './glass/GlassButton';

interface LessonsPathViewProps {
  currentUser: UserProfile | null;
  tokenState: UserTokenState;
  activeTopicId: string;
  onSelectTopic: (topic: CurriculumTopic) => void;
  onUnlockWithCredits: (topic: CurriculumTopic) => void;
}

export const LessonsPathView: React.FC<LessonsPathViewProps> = ({
  currentUser,
  tokenState,
  activeTopicId,
  onSelectTopic,
  onUnlockWithCredits
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'basics' | 'speaking' | 'grammar' | 'exam_ai'>('all');

  const isTopicUnlocked = (topic: CurriculumTopic): boolean => {
    if (topic.creditCost === 0) return true;
    if (currentUser?.isPremium) return true;
    return (tokenState.unlockedLessons || []).includes(topic.id);
  };

  const isTopicCompleted = (topicId: string): boolean => {
    return (tokenState.completedLessons || []).includes(topicId);
  };

  // Filter topics while preserving their EXACT 1-16 natural index
  const filteredTopics = CURRICULUM_TOPICS.filter((topic) => {
    // Search match
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match = topic.titleDe.toLowerCase().includes(q) ||
                    topic.titleTr.toLowerCase().includes(q) ||
                    topic.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Category match
    if (categoryFilter === 'basics') {
      return ['alphabet', 'numbers', 'spelling', 'pronunciation', 'vocabulary'].includes(topic.id);
    }
    if (categoryFilter === 'speaking') {
      return ['alltagsdeutsch', 'extra_questions', 'w_fragen', 'goethe_sprechen', 'conversation_practice'].includes(topic.id);
    }
    if (categoryFilter === 'grammar') {
      return ['important_verbs', 'prepositions_adjectives', 'w_fragen'].includes(topic.id);
    }
    if (categoryFilter === 'exam_ai') {
      return ['quiz_arena', 'ai_writing', 'ai_pronunciation', 'goethe_exam_simulation'].includes(topic.id);
    }

    return true;
  });

  const getStageTitle = (topicNumber: number): string | null => {
    if (topicNumber === 1) return 'Aşama 1: Temel A1 Fonetik & Tanışma';
    if (topicNumber === 6) return 'Aşama 2: Günlük İletişim & Soru Kalıpları';
    if (topicNumber === 8) return 'Aşama 3: Temel Fiiller, Edatlar & Kelime Haznesi';
    if (topicNumber === 11) return 'Aşama 4: Sınav Arenası & Yapay Zeka Koçluğu';
    return null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 animate-fadeIn">
      
      {/* 1. PATH HEADER & FILTERS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>📚</span>
              <span>Almanca Öğrenme Yolculuğu</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
              16 Kademeli Pedagojik Sıralama — Her ders bir öncekinin üzerine inşa edilir.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              🪙 {(tokenState.completedLessons || []).length} / {CURRICULUM_TOPICS.length} Tamamlandı
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ders adı, konu veya kelime ara..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Temizle
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all' as const, label: 'Tümü (16)' },
              { id: 'basics' as const, label: 'Temel A1' },
              { id: 'speaking' as const, label: 'Konuşma' },
              { id: 'grammar' as const, label: 'Fiil/Edat' },
              { id: 'exam_ai' as const, label: 'Sınav & AI' },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setCategoryFilter(chip.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === chip.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-white/5'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. BUSUU-STYLE VISUAL LEARNING ROADMAP (EXACT PEDAGOGICAL ORDER PRESERVED) */}
      <div className="relative pt-2 space-y-5">
        
        {filteredTopics.map((topic, index) => {
          const unlocked = isTopicUnlocked(topic);
          const completed = isTopicCompleted(topic.id);
          const isCurrent = topic.id === activeTopicId;
          const stageHeader = categoryFilter === 'all' && !searchTerm ? getStageTitle(topic.number) : null;

          return (
            <React.Fragment key={topic.id}>
              {/* Stage Milestone Divider */}
              {stageHeader && (
                <div className="pt-4 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-cyan-500/10" />
                    <span className="px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-black text-xs uppercase tracking-wider shadow-sm">
                      {stageHeader}
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-cyan-500/30 to-cyan-500/10" />
                  </div>
                </div>
              )}

              {/* Lesson Node Card */}
              <div
                onClick={() => {
                  if (unlocked) {
                    onSelectTopic(topic);
                  } else {
                    onUnlockWithCredits(topic);
                  }
                }}
                className={`group relative p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer border ${
                  isCurrent
                    ? 'bg-gradient-to-r from-cyan-950/80 via-slate-900 to-slate-900 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)] scale-[1.01]'
                    : completed
                    ? 'bg-slate-900/70 hover:bg-slate-900 border-emerald-500/30 hover:border-emerald-400'
                    : unlocked
                    ? 'bg-slate-900/60 hover:bg-slate-900 border-white/10 hover:border-white/20'
                    : 'bg-slate-950/80 border-amber-500/20 hover:border-amber-500/40 opacity-90'
                }`}
              >
                <div className="flex items-start sm:items-center justify-between gap-4">
                  
                  {/* Left Node Number & Details */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    
                    {/* Circle Indicator Badge */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 shadow-inner transition-transform group-hover:scale-105 ${
                        completed
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                          : isCurrent
                          ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                          : !unlocked
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-200 border border-white/10'
                      }`}
                    >
                      {completed ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      ) : !unlocked ? (
                        <Lock className="w-5 h-5 text-amber-400" />
                      ) : (
                        `#${topic.number}`
                      )}
                    </div>

                    {/* Lesson Titles */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`text-base sm:text-lg font-black truncate ${
                          isCurrent ? 'text-cyan-300' : 'text-white group-hover:text-cyan-200'
                        }`}>
                          {topic.titleDe}
                        </h3>

                        {/* Badges */}
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                          completed 
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : isCurrent
                            ? 'bg-cyan-400/20 text-cyan-300'
                            : 'bg-indigo-500/20 text-indigo-300'
                        }`}>
                          {topic.badge}
                        </span>

                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{topic.estimatedMinutes} dk</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 font-medium mt-0.5">
                        {topic.titleTr}
                      </p>

                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                        {topic.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Action / Reward Indicator */}
                  <div className="shrink-0 flex items-center gap-2">
                    {!unlocked ? (
                      <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black flex items-center gap-1.5 shadow-sm">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{topic.creditCost} Kredi</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="hidden sm:inline-flex px-2.5 py-1 rounded-lg bg-slate-800/80 text-amber-400 text-xs font-black border border-white/5">
                          +{topic.tokenReward} 🪙
                        </span>
                        
                        <div className={`p-2.5 rounded-xl transition-all ${
                          isCurrent 
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-white/10'
                        }`}>
                          {isCurrent ? <Play className="w-4 h-4 fill-slate-950" /> : <ChevronRight className="w-4 h-4" />}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </React.Fragment>
          );
        })}

        {filteredTopics.length === 0 && (
          <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-white/10">
            <p className="text-sm text-slate-300">Aramanızla eşleşen bir ders bulunamadı.</p>
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setCategoryFilter('all'); }}
              className="mt-2 text-xs text-cyan-400 hover:underline font-bold"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
