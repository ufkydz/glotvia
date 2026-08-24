import React, { useState, useEffect } from 'react';
import { 
  AppDisplaySettings, 
  AppThemeId, 
  BgEffectType, 
  FontSizeScale, 
  FontFamilyType, 
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
  Palette, Sun, Moon, Sparkles, Type, Eye, Check, 
  RotateCcw, Sliders, Waves, CheckCircle2, BookOpen, Layers,
  Compass, Layout, Smartphone, Laptop, Zap
} from 'lucide-react';

interface ThemeSettingsViewProps {
  onGoBack?: () => void;
}

export const ThemeSettingsView: React.FC<ThemeSettingsViewProps> = ({ onGoBack }) => {
  const [settings, setSettings] = useState<AppDisplaySettings>(() => loadDisplaySettings());
  const [activeTab, setActiveTab] = useState<'themes' | 'typography' | 'background'>('themes');
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    setSettings(loadDisplaySettings());
  }, []);

  const handleUpdate = (updated: Partial<AppDisplaySettings>) => {
    const fresh = { ...settings, ...updated };
    setSettings(fresh);
    saveDisplaySettings(fresh);
    playSuccessChime();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleSelectTheme = (themeId: AppThemeId) => {
    handleUpdate({ themeId });
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULT_DISPLAY_SETTINGS);
    saveDisplaySettings(DEFAULT_DISPLAY_SETTINGS);
    playCoinSound();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const currentTheme = APP_THEMES.find(t => t.id === settings.themeId) || APP_THEMES[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-cyan-950/70 via-slate-900 to-indigo-950/60 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 rounded-full text-xs font-black shadow-inner">
              <Palette className="w-3.5 h-3.5" />
              <span>Görsel Deneyim & Tema Stüdyosu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              Tema, Renk &amp; Yazı Boyutu Ayarları
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Uygulamayı gözünüze en uygun şekilde özelleştirin. İç açıcı aydınlık gündüz modları, rahat okuma sağlayan büyük fontlar ve ferahlatıcı renk paletleri arasında anında geçiş yapın.
            </p>
          </div>

          {/* Quick Stats / Reset */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-4 py-2.5 bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95 shadow"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Varsayılana Dön</span>
            </button>
          </div>
        </div>

        {/* Live Active Theme Tag */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Aktif Tema:</span>
            <span className="font-bold text-cyan-300 px-2.5 py-1 rounded-xl bg-cyan-950/60 border border-cyan-400/40 flex items-center gap-1.5">
              <span>{currentTheme.emoji}</span>
              <span>{currentTheme.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">({currentTheme.isLight ? '☀️ Ferah Açık' : '🌙 Koyu Canlı'})</span>
            </span>
          </div>

          {savedNotice && (
            <div className="inline-flex items-center space-x-1 text-emerald-400 font-black animate-pulse">
              <CheckCircle2 className="w-4 h-4" />
              <span>Ayarlar anında kaydedildi &amp; uygulandı!</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('themes')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'themes'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>1. Temalar &amp; Renk Paletleri ({APP_THEMES.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('typography')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'typography'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>2. Yazı Boyutu &amp; Font</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('background')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'background'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>3. Arka Plan Dokusu</span>
        </button>
      </div>

      {/* TAB 1: THEMES SELECTION */}
      {activeTab === 'themes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {APP_THEMES.map((theme) => {
              const isSelected = settings.themeId === theme.id;

              return (
                <div
                  key={theme.id}
                  onClick={() => handleSelectTheme(theme.id)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'border-cyan-400 bg-gradient-to-b from-cyan-950/70 to-slate-900 shadow-xl shadow-cyan-500/20 ring-2 ring-cyan-400/80 scale-[1.02]'
                      : 'border-slate-800 bg-slate-900/80 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  {/* Visual Color Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{theme.emoji}</span>
                      <div>
                        <h3 className="text-sm font-black text-white">{theme.name}</h3>
                        <span className="text-[10px] text-slate-400">
                          {theme.isLight ? '☀️ Aydınlık & Ferah' : '🌙 Koyu & Dinlendirici'}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-black shadow-md">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {theme.description}
                  </p>

                  {/* Color Swatch Dots */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono text-slate-500">Renk Tonları</span>
                    <div className="flex items-center space-x-1.5">
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" 
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" 
                        style={{ backgroundColor: theme.secondaryColor }}
                      />
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" 
                        style={{ backgroundColor: theme.isLight ? '#f8fafc' : '#090d16' }}
                      />
                    </div>
                  </div>

                  {/* Select button */}
                  <button
                    type="button"
                    className={`w-full py-2 rounded-xl text-xs font-black transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {isSelected ? '✓ Aktif Tema' : 'Bu Temayı Seç'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TYPOGRAPHY & FONT SIZE */}
      {activeTab === 'typography' && (
        <div className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
          
          {/* Font Size Scales */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Type className="w-4 h-4 text-cyan-400" />
              Yazı Boyutu (Font Büyüklüğü)
            </h3>
            <p className="text-xs text-slate-400">
              Metinleri ve Almanca kelime kartlarını daha kolay okumak için yazı boyutunu büyütün veya küçültün.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {FONT_SIZES.map((fs) => {
                const isSelected = settings.fontSize === fs.id;
                return (
                  <button
                    key={fs.id}
                    type="button"
                    onClick={() => handleUpdate({ fontSize: fs.id })}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer space-y-1 ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/70 text-white shadow-lg ring-2 ring-cyan-400/50'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-400">{fs.label}</div>
                    <div className="text-xl font-black text-cyan-300">{fs.scale}</div>
                    <p className="text-[10px] text-slate-500">{fs.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Family Selection */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Yazı Tipi (Font Ailesi)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {FONT_FAMILIES.map((ff) => {
                const isSelected = settings.fontFamily === ff.id;
                return (
                  <button
                    key={ff.id}
                    type="button"
                    onClick={() => handleUpdate({ fontFamily: ff.id })}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/70 text-white shadow-lg ring-2 ring-cyan-400/50'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">{ff.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">{ff.desc}</p>
                    <div className="text-xs font-semibold text-slate-300 pt-1 border-t border-white/5 truncate">
                      Guten Tag! Wie geht es Ihnen?
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BACKGROUND TEXTURES */}
      {activeTab === 'background' && (
        <div className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
          <div className="space-y-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Arka Plan Dokusu &amp; Işık Atmosferi
            </h3>
            <p className="text-xs text-slate-400">
              Sayfa arkasındaki modern ızgara, cam dalgaları veya minimal desenleri seçin.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {BG_EFFECTS.map((bg) => {
                const isSelected = settings.bgEffect === bg.id;
                return (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => handleUpdate({ bgEffect: bg.id })}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/70 text-white shadow-lg ring-2 ring-cyan-400/50'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{bg.icon}</span>
                      {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <h4 className="text-xs font-black text-white">{bg.label}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{bg.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
