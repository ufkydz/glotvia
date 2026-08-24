import React, { useState } from 'react';
import { UserProfile, LanguageId } from '../types';
import { LANGUAGES_LIST } from '../data/languagesData';
import { FLASHCARDS_DATA } from '../data/flashcardsData';
import { CurriculumProgressChart } from './CurriculumProgressChart';
import { 
  updateUserProfileData, 
  updateUserTargetLanguage, 
  updateUserNativeLanguage, 
  logoutUser, 
  getLanguageMasteredCardIds, 
  getTotalMasteredWordsCount 
} from '../utils/authStorage';
import { getI18n } from '../utils/i18n';
import { 
  User, Award, Flame, Star, Trophy, BookOpen, CheckCircle, 
  LogOut, Edit3, Save, Globe2, Sparkles, Heart, CheckCircle2,
  TrendingUp, Compass, ArrowRight, BarChart3, Search, Check,
  Zap, Target, Layers, Settings, ShieldCheck
} from 'lucide-react';

interface ProfileDashboardProps {
  currentUser: UserProfile;
  onUserUpdate: (updatedUser: UserProfile) => void;
  onGoToCards: () => void;
  onOpenAuthModal: () => void;
  onLogoutTrigger?: () => void;
}

const AVATARS = ['🌟', '🚀', '🎓', '👑', '🦁', '🦊', '🦉', '🌍', '⚡', '💡', '💎', '🔥'];

export const ProfileDashboard: React.FC<ProfileDashboardProps> = ({
  currentUser,
  onUserUpdate,
  onGoToCards,
  onOpenAuthModal,
  onLogoutTrigger
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editAvatar, setEditAvatar] = useState(currentUser.avatar);
  const [editNativeLang, setEditNativeLang] = useState<LanguageId>(currentUser.nativeLanguage);
  
  // Progress tracker filter & search
  const [trackerFilter, setTrackerFilter] = useState<'all' | 'in_progress' | 'completed' | 'not_started'>('all');
  const [trackerSearch, setTrackerSearch] = useState('');
  
  // Mastered showcase language selector (defaults to user's target language)
  const [showcaseLangId, setShowcaseLangId] = useState<LanguageId>(currentUser.targetLanguage);

  const t = getI18n(currentUser.nativeLanguage);
  const targetLang = LANGUAGES_LIST.find(l => l.id === currentUser.targetLanguage) || LANGUAGES_LIST[0];
  const nativeLang = LANGUAGES_LIST.find(l => l.id === currentUser.nativeLanguage) || LANGUAGES_LIST.find(l => l.id === 'tr') || LANGUAGES_LIST[0];
  const totalCardsCount = FLASHCARDS_DATA.length;
  const totalMasteredWords = getTotalMasteredWordsCount(currentUser);

  const handleSaveProfile = () => {
    let updated = updateUserProfileData(editName, editAvatar);
    if (editNativeLang !== currentUser.nativeLanguage) {
      updated = updateUserNativeLanguage(editNativeLang);
    }
    onUserUpdate(updated);
    setIsEditing(false);
  };

  const handleSwitchLanguage = (langId: LanguageId, navigateToCards: boolean = false) => {
    const updated = updateUserTargetLanguage(langId);
    setShowcaseLangId(langId);
    onUserUpdate(updated);
    if (navigateToCards) {
      onGoToCards();
    }
  };

  const handleSwitchNativeLanguage = (langId: LanguageId) => {
    const updated = updateUserNativeLanguage(langId);
    setEditNativeLang(langId);
    onUserUpdate(updated);
  };

  const handleLogout = () => {
    logoutUser();
    if (onLogoutTrigger) {
      onLogoutTrigger();
    } else {
      onOpenAuthModal();
    }
  };

  // Calculate language statistics
  const languageStats = LANGUAGES_LIST.map((lang) => {
    const masteredIds = getLanguageMasteredCardIds(currentUser, lang.id);
    const masteredCount = masteredIds.length;
    const percentage = totalCardsCount > 0 ? Math.round((masteredCount / totalCardsCount) * 100) : 0;
    const isCurrentActive = currentUser.targetLanguage === lang.id;
    const isCurrentNative = currentUser.nativeLanguage === lang.id;
    const isCompleted = percentage >= 100;
    const isInProgress = percentage > 0 && percentage < 100;
    const isNotStarted = percentage === 0;

    return {
      ...lang,
      masteredCount,
      percentage,
      isCurrentActive,
      isCurrentNative,
      isCompleted,
      isInProgress,
      isNotStarted,
      masteredIds
    };
  });

  // Filtered tracks
  const filteredTracks = languageStats.filter((track) => {
    if (trackerFilter === 'in_progress' && !track.isInProgress) return false;
    if (trackerFilter === 'completed' && !track.isCompleted) return false;
    if (trackerFilter === 'not_started' && !track.isNotStarted) return false;

    if (trackerSearch.trim()) {
      const q = trackerSearch.toLowerCase().trim();
      const matchName = track.name.toLowerCase().includes(q);
      const matchNative = track.nativeName.toLowerCase().includes(q);
      if (!matchName && !matchNative) return false;
    }
    return true;
  });

  // Summary Metrics
  const activeTracksCount = languageStats.filter(t => t.masteredCount > 0).length;
  const completedTracksCount = languageStats.filter(t => t.isCompleted).length;
  const inProgressTracksCount = languageStats.filter(t => t.isInProgress).length;
  const notStartedTracksCount = languageStats.filter(t => t.isNotStarted).length;

  const totalPossibleWords = totalCardsCount * LANGUAGES_LIST.length;
  const overallMasteryPercentage = totalPossibleWords > 0 
    ? Math.round((totalMasteredWords / totalPossibleWords) * 100) 
    : 0;

  // Active target language stats
  const activeTrackStats = languageStats.find(t => t.id === currentUser.targetLanguage) || languageStats[0];

  // Mastered cards in showcase language
  const showcaseMasteredIds = getLanguageMasteredCardIds(currentUser, showcaseLangId);
  const showcaseMasteredCards = FLASHCARDS_DATA.filter(c => showcaseMasteredIds.includes(c.id));
  const showcaseLang = LANGUAGES_LIST.find(l => l.id === showcaseLangId) || targetLang;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Profile Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
            
            {/* Avatar */}
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border-2 border-amber-400 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl shadow-xl">
                {currentUser.avatar}
              </div>
              <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full uppercase shadow">
                Lv. {currentUser.stats.level}
              </span>
            </div>

            {/* Name & Email & Dual Language Badges */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white">{currentUser.name}</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                  title={t.editProfile}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <p className="text-xs text-slate-400 font-medium">{currentUser.email}</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                {/* Native Language Tag */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-bold">
                  <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ana Dil: {nativeLang.flag} {nativeLang.name}</span>
                </div>

                {/* Target Language Tag */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 font-bold">
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hedef Dil: {targetLang.flag} {targetLang.name}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400 font-semibold">{activeTrackStats.masteredCount}/{totalCardsCount} (%{activeTrackStats.percentage})</span>
                </div>
              </div>

            </div>
          </div>

          {/* Logout / Switch Account */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 text-slate-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.logout}</span>
            </button>
          </div>
        </div>

        {/* Edit Profile Panel */}
        {isEditing && (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-4 animate-in fade-in duration-200">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.editProfile}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">{t.fullName}</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">{t.nativeLanguageLabel}</label>
                <select
                  value={editNativeLang}
                  onChange={(e) => setEditNativeLang(e.target.value as LanguageId)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                >
                  {LANGUAGES_LIST.map((lang) => (
                    <option key={lang.id} value={lang.id} className="bg-slate-900 text-white">
                      {lang.flag} {lang.name} ({lang.nativeName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">{t.chooseAvatar}</label>
                <div className="flex flex-wrap gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setEditAvatar(av)}
                      className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                        editAvatar === av ? 'bg-amber-500/30 border border-amber-400' : 'hover:bg-slate-800'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{t.saveChanges}</span>
            </button>
          </div>
        )}

      </div>

      {/* Main Highlights Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Mastered Words Highlight */}
        <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl space-y-2 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400/90">Tüm 16 Dil</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white flex items-baseline gap-1.5">
            <span>{totalMasteredWords}</span>
            <span className="text-xs font-bold text-emerald-400">Kelime</span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">{t.totalMasteredWords}</div>
        </div>

        {/* Total XP & Level */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-sm">💎</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{t.totalXp}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{currentUser.stats.xp} XP</div>
          <div className="text-[11px] text-slate-400 font-medium">Seviye {currentUser.stats.level} Polyglot</div>
        </div>

        {/* Streak */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-orange-400">
            <Flame className="w-5 h-5 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{t.dailyStreak}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{currentUser.stats.streak} Gün</div>
          <div className="text-[11px] text-slate-400 font-medium">Kesintisiz Çalışma</div>
        </div>

        {/* Active Languages Count */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-cyan-400">
            <Globe2 className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Dil Dağılımı</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{activeTracksCount} / 16</div>
          <div className="text-[11px] text-slate-400 font-medium">Aktif Çalışılan Dil</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📊 RECHARTS A1-B1 CURRICULUM PROGRESS & TIMELINE DATA VISUALIZATION       */}
      {/* ========================================================================= */}
      <CurriculumProgressChart currentUser={currentUser} />

      {/* ========================================================================= */}
      {/* 🚀 VISUAL PROGRESS TRACKER FOR EACH LANGUAGE TRACK                         */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Tracker Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] font-black text-amber-400">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{t.progressTrackerTitle}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>16 Dil İlerleme Takibi & Kelime Hakimiyeti</span>
            </h3>
            <p className="text-xs text-slate-400">
              {t.progressTrackerDesc}
            </p>
          </div>

          {/* Overall Multilingual Completion Badge */}
          <div className="flex items-center space-x-4 bg-slate-950 p-3.5 px-4 rounded-2xl border border-slate-800 shrink-0">
            <div className="text-center">
              <div className="text-lg font-black text-amber-400">%{overallMasteryPercentage}</div>
              <div className="text-[10px] text-slate-400 font-bold">Genel Tamamlanma</div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center">
              <div className="text-lg font-black text-emerald-400">{totalMasteredWords}</div>
              <div className="text-[10px] text-slate-400 font-bold">Ustalaşılan Kelime</div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Filter Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
            <button
              onClick={() => setTrackerFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                trackerFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Tüm Diller ({LANGUAGES_LIST.length})
            </button>
            <button
              onClick={() => setTrackerFilter('in_progress')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                trackerFilter === 'in_progress'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t.inProgressBadge} ({inProgressTracksCount})
            </button>
            <button
              onClick={() => setTrackerFilter('completed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                trackerFilter === 'completed'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t.completedBadge} ({completedTracksCount})
            </button>
            <button
              onClick={() => setTrackerFilter('not_started')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                trackerFilter === 'not_started'
                  ? 'bg-slate-800 text-white font-black'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t.notStartedBadge} ({notStartedTracksCount})
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Dil ara..."
              value={trackerSearch}
              onChange={(e) => setTrackerSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>
        </div>

        {/* Language Tracks Grid */}
        {filteredTracks.length === 0 ? (
          <div className="text-center py-12 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
            <div className="text-3xl">🔍</div>
            <div className="text-sm font-bold text-white">Bu filtreye uygun dil parkuru bulunamadı</div>
            <div className="text-xs text-slate-400">Arama sorgusunu veya filtreyi değiştirebilirsiniz.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTracks.map((track) => {
              const isSelectedForShowcase = showcaseLangId === track.id;

              return (
                <div
                  key={track.id}
                  className={`p-5 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between space-y-4 ${
                    track.isCurrentActive
                      ? 'bg-slate-950/90 border-amber-500/60 shadow-xl shadow-amber-950/20 ring-1 ring-amber-500/30'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Background Glow */}
                  {track.isCompleted && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                  )}
                  {track.isCurrentActive && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                  )}

                  {/* Card Top: Flag, Names & Badges */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl sm:text-4xl">{track.flag}</span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-base font-black text-white">{track.name}</h4>
                            {track.isCurrentActive && (
                              <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black rounded-lg uppercase">
                                Aktif Hedef
                              </span>
                            )}
                            {track.isCurrentNative && (
                              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded-lg">
                                Ana Dil
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 font-medium">
                            {track.nativeName} • <span className="text-[11px] text-slate-500">{track.difficulty} {t.difficulty}</span>
                          </div>
                        </div>
                      </div>

                      {/* Percentage Badge */}
                      <div className={`px-3 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1 ${
                        track.percentage === 100 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : track.percentage > 0
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}>
                        <span>%{track.percentage}</span>
                      </div>
                    </div>

                    {/* Progress Bar & Word Count */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-400">
                          {track.masteredCount} / {totalCardsCount} {t.wordsMastered}
                        </span>
                        <span className={
                          track.percentage === 100 ? 'text-emerald-400' :
                          track.percentage > 0 ? 'text-amber-400' : 'text-slate-500'
                        }>
                          {track.percentage === 100 ? `✓ ${t.completedBadge}` : 
                           track.percentage > 0 ? t.inProgressBadge : t.notStartedBadge}
                        </span>
                      </div>

                      {/* Visual Progress Track */}
                      <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            track.percentage === 100
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                              : track.percentage > 0
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                              : 'bg-slate-800'
                          }`}
                          style={{ width: `${Math.max(track.percentage, 0)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-slate-900 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setShowcaseLangId(track.id)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                        isSelectedForShowcase
                          ? 'bg-slate-800 text-amber-300 border border-amber-500/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{t.showWords}</span>
                    </button>

                    {track.isCurrentActive ? (
                      <button
                        onClick={onGoToCards}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 rounded-xl text-[11px] font-black transition-all flex items-center gap-1 shadow"
                      >
                        <span>{t.openCards}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSwitchLanguage(track.id, false)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1"
                      >
                        <span>{t.studyThisLanguage}</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 📚 MASTERED WORDS SHOWCASE WITH LANGUAGE SELECTOR                          */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <span>{showcaseLang.flag} {showcaseLang.name} {t.wordsMastered} ({showcaseMasteredCards.length})</span>
            </h3>
            <p className="text-xs text-slate-400">
              Bu dil için öğrendim olarak işaretlediğiniz kelimeleri ve çevirilerini inceleyin.
            </p>
          </div>

          {/* Language Switcher for Showcase */}
          <div className="flex items-center space-x-2">
            <select
              value={showcaseLangId}
              onChange={(e) => setShowcaseLangId(e.target.value as LanguageId)}
              className="bg-slate-950 border border-slate-800 text-xs font-bold text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
            >
              {LANGUAGES_LIST.map((l) => {
                const count = getLanguageMasteredCardIds(currentUser, l.id).length;
                return (
                  <option key={l.id} value={l.id}>
                    {l.flag} {l.name} ({count} Kelime)
                  </option>
                );
              })}
            </select>

            <button
              onClick={onGoToCards}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl transition-all flex items-center gap-1 shadow shrink-0"
            >
              <span>{t.openCards}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {showcaseMasteredCards.length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-3">
            <div className="text-3xl">🎴</div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {showcaseLang.name} dilinde henüz öğrenildi olarak işaretlenmiş kart bulunmuyor. Resimli kartlar sekmesinden çalıştığınız kartların üzerindeki tik (✓) simgesine tıklayarak kelimeleri hafızanıza kaydedebilirsiniz.
            </p>
            <button
              onClick={() => handleSwitchLanguage(showcaseLangId, true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-xl transition-all inline-flex items-center gap-1.5"
            >
              <span>{showcaseLang.name} {t.studyThisLanguage}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {showcaseMasteredCards.map((card) => {
              const trans = card.translations[showcaseLangId] || card.translations['en'];
              const nativeTrans = card.translations[currentUser.nativeLanguage] || card.translations['tr'];
              const nativeMeaning = nativeTrans ? nativeTrans.word : card.turkishMeaning;

              return (
                <div
                  key={card.id}
                  className="p-3.5 bg-slate-950 border border-slate-800/90 rounded-2xl flex items-center space-x-3 hover:border-slate-700 transition-colors"
                >
                  <img
                    src={card.imageUrl}
                    alt={trans.word}
                    loading="lazy"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                  />
                  <div className="overflow-hidden space-y-0.5">
                    <div className="text-xs font-black text-white truncate flex items-center gap-1">
                      <span>{trans.word}</span>
                      {trans.article && (
                        <span className="text-[9px] text-amber-400 uppercase font-mono">({trans.article})</span>
                      )}
                    </div>
                    <div className="text-[10px] text-amber-400/90 font-mono truncate">{trans.phonetic}</div>
                    <div className="text-[10px] text-emerald-400 font-semibold truncate">{nativeMeaning}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
