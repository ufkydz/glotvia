import React, { useState } from 'react';
import { ActiveTab, LanguageId, UserProfile } from '../types';
import { LANGUAGES_LIST } from '../data/languagesData';
import { getI18n } from '../utils/i18n';
import { 
  Sparkles, Layers, Award, Globe2, Bot, User, Flame, 
  ChevronDown, LogIn, Check, Languages
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: UserProfile;
  onLanguageChange: (langId: LanguageId) => void;
  onNativeLanguageChange: (langId: LanguageId) => void;
  onOpenAuthModal: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLanguageChange,
  onNativeLanguageChange,
  onOpenAuthModal,
  onOpenProfile
}) => {
  const [isTargetLangOpen, setIsTargetLangOpen] = useState(false);
  const [isNativeLangOpen, setIsNativeLangOpen] = useState(false);

  const t = getI18n(currentUser.nativeLanguage);
  const activeTargetLang = LANGUAGES_LIST.find(l => l.id === currentUser.targetLanguage) || LANGUAGES_LIST[0];
  const activeNativeLang = LANGUAGES_LIST.find(l => l.id === currentUser.nativeLanguage) || LANGUAGES_LIST[15];

  const handleSelectTargetLang = (langId: LanguageId) => {
    onLanguageChange(langId);
    setIsTargetLangOpen(false);
  };

  const handleSelectNativeLang = (langId: LanguageId) => {
    onNativeLanguageChange(langId);
    setIsNativeLangOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Language Switchers */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button 
              onClick={() => setActiveTab('flashcards')}
              className="flex items-center space-x-2.5 text-left group"
            >
              <div className="p-2.5 bg-gradient-to-tr from-amber-500 via-yellow-400 to-orange-500 rounded-2xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform text-slate-950 font-black">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-black text-lg sm:text-xl text-white tracking-tight">Polyglot</span>
                  <span className="font-black text-lg sm:text-xl bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">AI</span>
                </div>
                <span className="hidden sm:block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {t.flashcardsTab}
                </span>
              </div>
            </button>

            {/* Target Language Dropdown (Hedef Dil) */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsTargetLangOpen(!isTargetLangOpen);
                  setIsNativeLangOpen(false);
                }}
                className="flex items-center space-x-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-amber-500/40 rounded-2xl text-xs font-bold text-amber-300 transition-all shadow-sm"
                title={t.targetLanguageLabel}
              >
                <span className="text-base">{activeTargetLang.flag}</span>
                <span className="hidden xs:inline">{activeTargetLang.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
              </button>

              {isTargetLangOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 flex items-center justify-between">
                    <span>{t.targetLanguageLabel}</span>
                    <span className="text-slate-500">16 Dil</span>
                  </div>
                  {LANGUAGES_LIST.map((lang) => {
                    const isSelected = lang.id === currentUser.targetLanguage;
                    return (
                      <button
                        key={lang.id}
                        onClick={() => handleSelectTargetLang(lang.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="text-lg">{lang.flag}</span>
                          <div className="text-left">
                            <div className="font-semibold">{lang.name}</div>
                            <div className="text-[10px] text-slate-400">{lang.nativeName}</div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Native Language Dropdown (Ana Dil / UI Dili) */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => {
                  setIsNativeLangOpen(!isNativeLangOpen);
                  setIsTargetLangOpen(false);
                }}
                className="flex items-center space-x-2 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-2xl text-xs font-bold text-slate-400 hover:text-white transition-all shadow-sm"
                title={t.nativeLanguageLabel}
              >
                <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs">{activeNativeLang.flag} {activeNativeLang.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {isNativeLangOpen && (
                <div className="absolute left-0 mt-2 w-60 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    {t.nativeLanguageLabel}
                  </div>
                  {LANGUAGES_LIST.map((lang) => {
                    const isSelected = lang.id === currentUser.nativeLanguage;
                    return (
                      <button
                        key={lang.id}
                        onClick={() => handleSelectNativeLang(lang.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                          isSelected
                            ? 'bg-slate-800 text-white font-bold border border-slate-700'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-base">{lang.flag}</span>
                          <span className="font-semibold">{lang.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'flashcards'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{t.flashcardsTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'quiz'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{t.quizTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('languages')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'languages'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Globe2 className="w-4 h-4" />
              <span>{t.languagesTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('aitutor')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'aitutor'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>{t.aiTutorTab}</span>
            </button>
          </nav>

          {/* User Stats & Profile Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Streak Pill */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-2xl text-xs font-bold text-orange-400">
              <Flame className="w-4 h-4 animate-bounce" />
              <span>{currentUser.stats.streak} {t.streak}</span>
            </div>

            {/* XP Pill */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs font-bold text-amber-300">
              <span className="text-sm">💎</span>
              <span>{currentUser.stats.xp} XP</span>
            </div>

            {/* User Profile Button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl transition-all"
            >
              <div className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-base">
                {currentUser.avatar}
              </div>
              <div className="hidden md:block text-left text-xs font-bold text-white">
                <div>{currentUser.name}</div>
                <div className="text-[10px] text-amber-400 font-medium">Lv. {currentUser.stats.level}</div>
              </div>
            </button>

          </div>

        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center justify-around py-2.5 border-t border-slate-800/80 gap-1">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-[11px] font-bold transition-all ${
              activeTab === 'flashcards' ? 'text-amber-400 bg-slate-900' : 'text-slate-400'
            }`}
          >
            <Layers className="w-4 h-4 mb-0.5" />
            <span>{t.flashcardsTab}</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-[11px] font-bold transition-all ${
              activeTab === 'quiz' ? 'text-amber-400 bg-slate-900' : 'text-slate-400'
            }`}
          >
            <Award className="w-4 h-4 mb-0.5" />
            <span>{t.quizTab}</span>
          </button>
          <button
            onClick={() => setActiveTab('languages')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-[11px] font-bold transition-all ${
              activeTab === 'languages' ? 'text-amber-400 bg-slate-900' : 'text-slate-400'
            }`}
          >
            <Globe2 className="w-4 h-4 mb-0.5" />
            <span>16 Dil</span>
          </button>
          <button
            onClick={() => setActiveTab('aitutor')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-[11px] font-bold transition-all ${
              activeTab === 'aitutor' ? 'text-amber-400 bg-slate-900' : 'text-slate-400'
            }`}
          >
            <Bot className="w-4 h-4 mb-0.5" />
            <span>AI Koç</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-[11px] font-bold transition-all ${
              activeTab === 'profile' ? 'text-amber-400 bg-slate-900' : 'text-slate-400'
            }`}
          >
            <User className="w-4 h-4 mb-0.5" />
            <span>{t.myAccount}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
