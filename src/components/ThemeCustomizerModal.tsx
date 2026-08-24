import React, { useState, useEffect } from 'react';
import { 
  AppDisplaySettings, 
  AppThemeId, 
  BgEffectType, 
  FontSizeScale, 
  FontFamilyType, 
  TextContrastType,
  APP_THEMES,
  FONT_SIZES,
  FONT_FAMILIES,
  BG_EFFECTS,
  loadDisplaySettings,
  saveDisplaySettings,
  DEFAULT_DISPLAY_SETTINGS
} from '../utils/themeManager';
import { playSuccessChime, playCoinSound } from '../utils/audioEffects';
import { 
  X, Palette, Sun, Moon, Sparkles, Type, Eye, 
  Check, RotateCcw, Sliders, Waves, CheckCircle2,
  Layers, Compass, Laptop, Zap
} from 'lucide-react';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [settings, setSettings] = useState<AppDisplaySettings>(() => loadDisplaySettings());
  const [activeTab, setActiveTab] = useState<'themes' | 'typography' | 'background'>('themes');
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(loadDisplaySettings());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpdate = (updated: Partial<AppDisplaySettings>) => {
    const fresh = { ...settings, ...updated };
    setSettings(fresh);
    saveDisplaySettings(fresh);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const handleSelectTheme = (themeId: AppThemeId) => {
    playSuccessChime();
    handleUpdate({ themeId });
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULT_DISPLAY_SETTINGS);
    saveDisplaySettings(DEFAULT_DISPLAY_SETTINGS);
    playCoinSound();
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const currentTheme = APP_THEMES.find(t => t.id === settings.themeId) || APP_THEMES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl shadow-cyan-950/50 p-4 sm:p-6 text-slate-100 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                Tema & Görünüm Özelleştirici
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {currentTheme.emoji} {currentTheme.name}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Arka planı iç açıcı yapın, renk paletini ve yazı boyutlarını dilediğiniz gibi ayarlayın.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Box */}
        <div 
          className="mt-4 p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 shadow-inner relative overflow-hidden"
          style={{
            backgroundColor: currentTheme.previewBg,
            borderColor: currentTheme.previewAccent + '40',
            color: currentTheme.previewTextColor
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{currentTheme.emoji}</span>
              <span className="text-xs font-bold font-mono uppercase tracking-wider opacity-80">
                Canlı Önizleme
              </span>
            </div>
            <span 
              className="text-[11px] font-black px-2 py-0.5 rounded-full border shadow-sm"
              style={{
                backgroundColor: currentTheme.previewAccent + '25',
                borderColor: currentTheme.previewAccent + '60',
                color: currentTheme.previewAccent
              }}
            >
              A1 Goethe Almanca
            </span>
          </div>

          <div 
            className="p-3 rounded-xl border backdrop-blur-md mb-2 flex items-center justify-between"
            style={{
              backgroundColor: currentTheme.previewCard,
              borderColor: currentTheme.previewAccent + '30'
            }}
          >
            <div>
              <p className="font-bold text-sm sm:text-base">Guten Tag! Wie geht es Ihnen?</p>
              <p className="text-xs opacity-75">İyi günler! Nasılsınız?</p>
            </div>
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg text-xs font-black text-white shadow-md transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: currentTheme.previewAccent }}
            >
              Dinle 🔊
            </button>
          </div>

          <p className="text-[11px] opacity-70 italic text-center">
            {currentTheme.description}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 mt-4 p-1 bg-slate-950/70 border border-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('themes')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'themes'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Renk Temaları (8)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('background')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'background'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Arka Plan & Atmosfer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('typography')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'typography'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Yazılar & Tipografi</span>
          </button>
        </div>

        {/* Tab 1: Themes Grid */}
        {activeTab === 'themes' && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1 no-scrollbar">
              {APP_THEMES.map((th) => {
                const isSelected = settings.themeId === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => handleSelectTheme(th.id)}
                    className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer group ${
                      isSelected
                        ? 'border-cyan-400 bg-slate-800/90 shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-500/50'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{th.emoji}</span>
                        <div>
                          <p className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                            {th.name}
                          </p>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                            th.isLight ? 'bg-amber-400/20 text-amber-300' : 'bg-indigo-400/20 text-indigo-300'
                          }`}>
                            {th.isLight ? '☀️ Ferah Açık Tema' : '🌙 Şık Koyu / Canlı'}
                          </span>
                        </div>
                      </div>
                      
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-black">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <div 
                            className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: th.previewBg }}
                          />
                          <div 
                            className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: th.previewAccent }}
                          />
                        </div>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {th.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Background Atmosphere */}
        {activeTab === 'background' && (
          <div className="mt-4 space-y-4 max-h-[320px] overflow-y-auto pr-1">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Arka Plan Görsel Deseni & Havası
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BG_EFFECTS.map((bg) => {
                  const isSelected = settings.bgEffect === bg.id;
                  return (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => handleUpdate({ bgEffect: bg.id })}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start space-x-3 ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/30 text-white ring-1 ring-cyan-500/40'
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="text-2xl">{bg.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-white">{bg.label}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{bg.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Sıvı Işık Animasyonu (Aura)
              </label>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div>
                  <p className="text-xs font-bold text-white">Yumuşak Işık Dalgaları</p>
                  <p className="text-[11px] text-slate-400">Arka planda estetik renk geçişli kürelerin süzülmesi</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleUpdate({ auraAnimation: !settings.auraAnimation })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    settings.auraAnimation
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {settings.auraAnimation ? 'Açık' : 'Kapalı'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Typography & Text Scaling */}
        {activeTab === 'typography' && (
          <div className="mt-4 space-y-4 max-h-[320px] overflow-y-auto pr-1">
            {/* Font Size Scaling */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Yazı Boyutu (Font Büyüklüğü)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {FONT_SIZES.map((fs) => {
                  const isSelected = settings.fontSize === fs.id;
                  return (
                    <button
                      key={fs.id}
                      type="button"
                      onClick={() => handleUpdate({ fontSize: fs.id })}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 font-black ring-1 ring-cyan-500'
                          : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <p className="text-xs font-bold">{fs.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Family */}
            <div className="pt-2 border-t border-slate-800">
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Yazı Tipi Karakteri (Font Ailesi)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FONT_FAMILIES.map((fam) => {
                  const isSelected = settings.fontFamily === fam.id;
                  return (
                    <button
                      key={fam.id}
                      type="button"
                      onClick={() => handleUpdate({ fontFamily: fam.id })}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/30 text-white ring-1 ring-cyan-500'
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <p className="text-xs font-bold text-white mb-0.5">{fam.label}</p>
                      <p className="text-xs text-slate-400 font-normal" style={{ fontFamily: fam.css }}>
                        {fam.sample}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contrast Mode */}
            <div className="pt-2 border-t border-slate-800">
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Yazı Kontrastı & Keskinlik
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdate({ contrast: 'normal' })}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    settings.contrast === 'normal'
                      ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 font-bold'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Standart Kontrast
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdate({ contrast: 'high' })}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    settings.contrast === 'high'
                      ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 font-black ring-1 ring-cyan-500'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  ⚡ Ultra Yüksek Kontrast (Net Okuma)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Varsayılana Sıfırla</span>
          </button>

          <div className="flex items-center space-x-2">
            {showSavedToast && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Uygulandı
              </span>
            )}
            
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Tamam
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
