import React, { useState } from 'react';
import { LanguageId, UserProfile } from '../types';
import { LANGUAGES_LIST, getLanguageInfo } from '../data/languagesData';
import { updateUserTargetLanguage, setCurrentUser } from '../utils/authStorage';
import { playSuccessChime, playCoinSound } from '../utils/audioEffects';
import { 
  Globe2, Check, X, ArrowLeftRight, Sparkles, 
  Search, BookOpen, Layers, CheckCircle2, ChevronRight 
} from 'lucide-react';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onUserUpdate?: (updated: UserProfile) => void;
  onOpenAuth?: () => void;
}

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdate,
  onOpenAuth
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'target' | 'native'>('target');
  const [searchQuery, setSearchQuery] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentTargetId = currentUser?.targetLanguage || currentUser?.currentLearningLanguage || 'de';
  const currentNativeId = currentUser?.nativeLanguage || 'tr';

  const targetLangInfo = getLanguageInfo(currentTargetId);
  const nativeLangInfo = getLanguageInfo(currentNativeId);

  const filteredLanguages = LANGUAGES_LIST.filter(l => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q)
    );
  });

  const handleSelectTargetLanguage = (langId: LanguageId) => {
    playSuccessChime();
    if (currentUser) {
      const updated = updateUserTargetLanguage(langId);
      if (onUserUpdate) onUserUpdate(updated);
    } else {
      // Guest or local fallback
      localStorage.setItem('glotvia_guest_target_lang', langId);
    }
    const info = getLanguageInfo(langId);
    setSuccessToast(`Öğrenilen dil başarıyla "${info.flag} ${info.name}" olarak değiştirildi!`);
    setTimeout(() => {
      setSuccessToast(null);
      onClose();
    }, 1200);
  };

  const handleSelectNativeLanguage = (langId: LanguageId) => {
    playCoinSound();
    if (currentUser) {
      const updated: UserProfile = {
        ...currentUser,
        nativeLanguage: langId
      };
      setCurrentUser(updated);
      if (onUserUpdate) onUserUpdate(updated);
    } else {
      localStorage.setItem('glotvia_guest_native_lang', langId);
    }
    const info = getLanguageInfo(langId);
    setSuccessToast(`Ana diliniz "${info.flag} ${info.name}" olarak güncellendi!`);
    setTimeout(() => {
      setSuccessToast(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900/95 border border-white/15 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden my-auto flex flex-col max-h-[92dvh]">
        
        {/* Glow Top Line */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-amber-400 to-indigo-500 pointer-events-none" />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/80 shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-cyan-500/25">
              <Globe2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black text-white truncate flex items-center gap-2">
                <span>Dili Değiştir &amp; Dil Seçimi</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-black uppercase">
                  19+ Dil
                </span>
              </h2>
              <p className="text-xs text-slate-300 font-medium truncate">
                Öğrenmek istediğiniz hedef dili ve ana dilinizi seçin
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Selection Pill Pair */}
        <div className="p-3 sm:p-4 bg-gradient-to-r from-indigo-950/60 via-slate-950/80 to-cyan-950/60 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Native Lang Card */}
            <button
              type="button"
              onClick={() => setActiveSubTab('native')}
              className={`p-2 sm:px-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'native'
                  ? 'bg-cyan-500/20 border-cyan-400 text-white ring-1 ring-cyan-400'
                  : 'bg-slate-950/60 border-white/10 text-slate-300 hover:border-slate-600'
              }`}
            >
              <span className="text-xl sm:text-2xl">{nativeLangInfo.flag}</span>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Ana Dilim</span>
                <span className="text-xs sm:text-sm font-bold text-white">{nativeLangInfo.name}</span>
              </div>
            </button>

            <ArrowLeftRight className="w-4 h-4 text-slate-500 shrink-0" />

            {/* Target Lang Card */}
            <button
              type="button"
              onClick={() => setActiveSubTab('target')}
              className={`p-2 sm:px-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'target'
                  ? 'bg-amber-500/20 border-amber-400 text-white ring-1 ring-amber-400'
                  : 'bg-slate-950/60 border-white/10 text-slate-300 hover:border-slate-600'
              }`}
            >
              <span className="text-xl sm:text-2xl">{targetLangInfo.flag}</span>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Öğrendiğim Dil</span>
                <span className="text-xs sm:text-sm font-bold text-amber-300">{targetLangInfo.name}</span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 hidden sm:inline">Hızlı Değiştir:</span>
            <button
              type="button"
              onClick={() => setActiveSubTab('target')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'target'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              🎯 Hedef Dil ({LANGUAGES_LIST.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('native')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'native'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              🗣️ Ana Dil ({LANGUAGES_LIST.length})
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="p-3 bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 animate-fadeIn shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="p-3 sm:p-4 border-b border-white/10 bg-slate-950/40 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeSubTab === 'target' ? 'Öğrenmek istediğiniz dili arayın (Almanca, İngilizce, Fransızca...)' : 'Ana dilinizi arayın (Türkçe, İngilizce, Fransızca...)'}
              className="w-full bg-slate-950/80 border border-white/15 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
            />
          </div>
        </div>

        {/* Language Grid (Scrollable) */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredLanguages.map((lang) => {
              const isCurrentTarget = currentTargetId === lang.id;
              const isCurrentNative = currentNativeId === lang.id;
              const isSelected = activeSubTab === 'target' ? isCurrentTarget : isCurrentNative;

              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => {
                    if (activeSubTab === 'target') {
                      handleSelectTargetLanguage(lang.id);
                    } else {
                      handleSelectNativeLanguage(lang.id);
                    }
                  }}
                  className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between group active:scale-[0.98] ${
                    isSelected
                      ? activeSubTab === 'target'
                        ? 'bg-gradient-to-r from-amber-500/25 to-yellow-500/15 border-amber-400/80 text-white shadow-lg ring-1 ring-amber-400/50'
                        : 'bg-gradient-to-r from-cyan-500/25 to-blue-500/15 border-cyan-400/80 text-white shadow-lg ring-1 ring-cyan-400/50'
                      : 'bg-slate-950/60 hover:bg-slate-800/80 border-white/10 hover:border-white/20 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="text-2xl sm:text-3xl shrink-0 transform group-hover:scale-110 transition-transform">
                      {lang.flag}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <h4 className="text-xs sm:text-sm font-black text-white truncate">
                          {lang.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 truncate">
                          ({lang.nativeName})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {lang.greeting} • {lang.speakers}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    {isSelected ? (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-slate-950 font-black shadow-md ${
                        activeSubTab === 'target' ? 'bg-amber-400' : 'bg-cyan-400'
                      }`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400">
            {activeSubTab === 'target' ? (
              <span>🎯 Seçilen dil tüm derslere ve AI koçuna uygulanır.</span>
            ) : (
              <span>🗣️ Seçilen ana dil tüm açıklamaları ve çevirileri belirler.</span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
