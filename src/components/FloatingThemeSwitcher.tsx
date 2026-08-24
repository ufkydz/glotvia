import React, { useState, useEffect } from 'react';
import { 
  AppThemeId, 
  APP_THEMES, 
  loadDisplaySettings, 
  saveDisplaySettings, 
  AppDisplaySettings 
} from '../utils/themeManager';
import { playSuccessChime, playCoinSound } from '../utils/audioEffects';
import { Palette, Sun, Moon, Sparkles, X, Check, SlidersHorizontal } from 'lucide-react';

interface FloatingThemeSwitcherProps {
  onOpenFullCustomizer?: () => void;
}

export const FloatingThemeSwitcher: React.FC<FloatingThemeSwitcherProps> = ({
  onOpenFullCustomizer
}) => {
  const [settings, setSettings] = useState<AppDisplaySettings>(() => loadDisplaySettings());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleThemeChange = (e: any) => {
      if (e.detail) {
        setSettings(e.detail);
      }
    };
    window.addEventListener('glotvia_theme_changed', handleThemeChange);
    return () => window.removeEventListener('glotvia_theme_changed', handleThemeChange);
  }, []);

  const currentTheme = APP_THEMES.find(t => t.id === settings.themeId) || APP_THEMES[0];

  const handleToggleLightDark = () => {
    playSuccessChime();
    const nextThemeId: AppThemeId = currentTheme.isLight ? 'dark-obsidian' : 'light-daylight';
    const updated = { ...settings, themeId: nextThemeId };
    setSettings(updated);
    saveDisplaySettings(updated);
  };

  const handleSelectTheme = (themeId: AppThemeId) => {
    playSuccessChime();
    const updated = { ...settings, themeId };
    setSettings(updated);
    saveDisplaySettings(updated);
  };

  return (
    <>
      {/* Floating Quick Action Pill */}
      <aside 
        aria-label="Tema Seçici Hızlı Kontrolü"
        className="fixed top-20 right-3 sm:right-5 z-40 flex items-center space-x-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-cyan-500/50 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-right-4 duration-300"
      >
        {/* Quick Light / Dark 1-Tap Toggle */}
        <button
          type="button"
          onClick={handleToggleLightDark}
          className={`p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer active:scale-90 ${
            currentTheme.isLight
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/40'
              : 'bg-slate-800 text-amber-300 hover:bg-slate-700 hover:text-white'
          }`}
          title={currentTheme.isLight ? "Koyu Kristal Moduna Geç" : "İç Açıcı & Ferah Açık Moda Geç"}
        >
          {currentTheme.isLight ? (
            <Sun className="w-4 h-4 text-slate-950" />
          ) : (
            <Moon className="w-4 h-4 text-cyan-300" />
          )}
        </button>

        {/* Theme Menu Dropdown Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-md shadow-cyan-500/20 cursor-pointer active:scale-95 transition-all"
        >
          <Palette className="w-3.5 h-3.5 text-cyan-200" />
          <span className="text-[11px] hidden sm:inline">{currentTheme.emoji} {currentTheme.name}</span>
          <span className="text-[11px] sm:hidden">Tema</span>
        </button>
      </aside>

      {/* Floating Quick Theme Selector Dropdown Box */}
      {isOpen && (
        <div 
          className="fixed top-32 right-3 sm:right-5 z-50 w-72 sm:w-80 bg-slate-900/95 border border-cyan-500/40 rounded-3xl p-4 shadow-2xl shadow-cyan-950/80 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200 text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Tema Seçenekleri (8)
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Themes Grid */}
          <div className="grid grid-cols-2 gap-2 mt-3 max-h-64 overflow-y-auto pr-1 no-scrollbar">
            {APP_THEMES.map((theme) => {
              const isSelected = settings.themeId === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleSelectTheme(theme.id)}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1 relative ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/80 text-white shadow-md ring-2 ring-cyan-400/60'
                      : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{theme.emoji}</span>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-[10px] font-black">
                        ✓
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] font-bold truncate">{theme.name}</div>
                  <span className="text-[9px] text-slate-400">
                    {theme.isLight ? '☀️ Ferah Açık' : '🌙 Koyu'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Full Customizer Button */}
          {onOpenFullCustomizer && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenFullCustomizer();
              }}
              className="w-full mt-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer border border-slate-700"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Gelişmiş Yazı Boyutu &amp; Efektler</span>
            </button>
          )}
        </div>
      )}
    </>
  );
};
