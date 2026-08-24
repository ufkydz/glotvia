import React, { useState } from 'react';
import { LanguageId, UserProfile } from '../types';
import { LANGUAGES_LIST, COMMON_PHRASES, getLanguageInfo } from '../data/languagesData';
import { speakText } from '../utils/speechUtils';
import { updateUserTargetLanguage, setCurrentUser } from '../utils/authStorage';
import { 
  Globe2, Sparkles, Volume2, Check, ArrowRight, BookOpen, 
  MessageSquare, Compass, Users, Award, ArrowLeftRight, CheckCircle2
} from 'lucide-react';

interface LanguagesHubProps {
  currentUser: UserProfile;
  onUserUpdate: (updatedUser: UserProfile) => void;
  onGoToCards: () => void;
}

export const LanguagesHub: React.FC<LanguagesHubProps> = ({
  currentUser,
  onUserUpdate,
  onGoToCards
}) => {
  const [selectedLangId, setSelectedLangId] = useState<LanguageId>(currentUser.targetLanguage || currentUser.currentLearningLanguage || 'de');
  const userNativeLang = currentUser.nativeLanguage || 'tr';

  const selectedLang = LANGUAGES_LIST.find(l => l.id === selectedLangId) || LANGUAGES_LIST[0];
  const nativeLangInfo = getLanguageInfo(userNativeLang);

  const handleSelectActive = (langId: LanguageId) => {
    setSelectedLangId(langId);
    const updated = updateUserTargetLanguage(langId);
    onUserUpdate(updated);
  };

  const handleUpdateNative = (nLangId: LanguageId) => {
    const updated: UserProfile = {
      ...currentUser,
      nativeLanguage: nLangId
    };
    setCurrentUser(updated);
    onUserUpdate(updated);
  };

  const handlePlayAudio = (text: string, langId: LanguageId) => {
    speakText(text, langId);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-white/10 p-6 sm:p-10 shadow-2xl">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-xs font-black text-cyan-400">
            <Globe2 className="w-4 h-4" />
            <span>19+ Küresel Dünya Dili • Çift Yönlü Öğrenme</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Glotvia Küresel Dil Merkezi
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Hangi dilden öğrenmek isterseniz isteyin: Türkçe, İngilizce, Fransızca, Almanca, İspanyolca, Lehçe, Romence veya diğer tüm diller arasında dilediğiniz gibi geçiş yapın.
          </p>

          {/* Current Language Pair Summary */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="p-2.5 px-4 bg-slate-950/80 border border-white/15 rounded-2xl flex items-center gap-3">
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Ana Diliniz</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  {nativeLangInfo.flag} {nativeLangInfo.name}
                </span>
              </div>
              <ArrowLeftRight className="w-4 h-4 text-cyan-400 mx-1" />
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Öğrenilen Dil</span>
                <span className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                  {getLanguageInfo(currentUser.targetLanguage || 'de').flag} {getLanguageInfo(currentUser.targetLanguage || 'de').name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-400">Ana Dil Değiştir:</label>
              <select
                value={userNativeLang}
                onChange={(e) => handleUpdateNative(e.target.value as LanguageId)}
                className="py-2 px-3 bg-slate-950 border border-white/20 rounded-xl text-white text-xs focus:border-cyan-400 focus:outline-none"
              >
                {LANGUAGES_LIST.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.flag} {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 19 Languages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <span>Öğrenilebilecek Tüm Diller</span>
          </h2>
          <span className="text-xs text-slate-400 font-bold">Toplam {LANGUAGES_LIST.length} Dil Hazır</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {LANGUAGES_LIST.map((lang) => {
            const isActive = (currentUser.targetLanguage || currentUser.currentLearningLanguage) === lang.id;
            const isViewing = selectedLangId === lang.id;
            const isNative = userNativeLang === lang.id;

            return (
              <div
                key={lang.id}
                onClick={() => setSelectedLangId(lang.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isActive
                    ? 'bg-amber-500/10 border-amber-400/80 shadow-lg shadow-amber-950/30'
                    : isViewing
                    ? 'bg-slate-900 border-cyan-400/50 shadow-md'
                    : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{lang.flag}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                      lang.difficulty === 'Kolay' ? 'bg-emerald-500/20 text-emerald-300' :
                      lang.difficulty === 'Orta' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {lang.difficulty}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-1.5">
                      <span>{lang.name}</span>
                      {isActive && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                      {isNative && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded font-bold">
                          Ana Diliniz
                        </span>
                      )}
                    </h3>
                    <div className="text-xs text-slate-400 font-medium">{lang.nativeName}</div>
                  </div>

                  <div className="text-xs text-slate-300 line-clamp-2">
                    {lang.description}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lang.speakers}</span>
                  </div>

                  {isActive ? (
                    <span className="text-[11px] font-black text-amber-400 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Aktif Dil
                    </span>
                  ) : isNative ? (
                    <span className="text-[10px] text-slate-500 font-bold">
                      Ana Diliniz
                    </span>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSelectActive(lang.id); }}
                      className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[11px] font-black transition-colors shadow-sm"
                    >
                      Dili Öğren
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Language Details & Common Travel Phrases */}
      <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/10 gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{selectedLang.flag}</span>
            <div>
              <h3 className="text-xl font-black text-white">
                {selectedLang.name} Pratik Kalıpları
              </h3>
              <p className="text-xs text-slate-400">
                {selectedLang.nativeName} • {selectedLang.speakers} Konuşan • {selectedLang.region}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {currentUser.targetLanguage !== selectedLang.id && userNativeLang !== selectedLang.id && (
              <button
                onClick={() => handleSelectActive(selectedLang.id)}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all"
              >
                Bu Dili Aktif Dil Yap
              </button>
            )}

            <button
              onClick={onGoToCards}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5"
            >
              <span>Resimli Kartlara Git</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Phrases List with Dynamic Native to Target Meaning */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COMMON_PHRASES.map((phrase) => {
            const targetTrans = phrase.translations[selectedLang.id] || phrase.translations['en'];
            const nativeTrans = phrase.translations[userNativeLang] || phrase.translations['tr'];

            return (
              <div
                key={phrase.id}
                className="p-4 bg-slate-950/80 border border-white/10 rounded-2xl space-y-2 hover:border-cyan-400/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-slate-900 border border-white/10 text-[10px] font-bold text-cyan-400 rounded-lg">
                    {phrase.category}
                  </span>
                  <button
                    onClick={() => handlePlayAudio(targetTrans.phrase, selectedLang.id)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 transition-all active:scale-95 cursor-pointer"
                    title="Sesli Telaffuz"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <div className="text-base font-black text-white">
                    {targetTrans.phrase}
                  </div>
                  {targetTrans.phonetic && (
                    <div className="text-xs font-bold text-cyan-400 font-mono mt-0.5">
                      {targetTrans.phonetic}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-white/10 text-xs text-slate-300 font-medium flex items-center justify-between">
                  <span>{nativeTrans.phrase}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{userNativeLang}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
