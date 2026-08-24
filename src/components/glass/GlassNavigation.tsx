import React from 'react';
import { Home, BookOpen, Mic, BarChart3, Settings, User } from 'lucide-react';

export type GlassNavTab = 'home' | 'learn' | 'practice' | 'progress' | 'settings' | 'profile';

interface GlassNavigationProps {
  activeTab: GlassNavTab;
  onTabChange: (tab: GlassNavTab) => void;
  className?: string;
}

export const GlassNavigation: React.FC<GlassNavigationProps> = ({
  activeTab,
  onTabChange,
  className = ''
}) => {
  const navItems: { id: GlassNavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Ana Sayfa', icon: Home },
    { id: 'learn', label: 'Dersler', icon: BookOpen },
    { id: 'practice', label: 'AI Pratik', icon: Mic },
    { id: 'progress', label: 'Gelişim', icon: BarChart3 },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <div className={`fixed bottom-4 sm:bottom-6 inset-x-0 z-40 flex justify-center pointer-events-none px-3 sm:px-4 ${className}`}>
      <nav
        aria-label="Ana Navigasyon"
        className="pointer-events-auto flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-full glass-nav-bar max-w-lg w-full justify-between transition-all duration-300 shadow-2xl"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 sm:px-2 rounded-full transition-all duration-200 cursor-pointer select-none group ${
                isActive
                  ? 'text-cyan-300 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200 hover:scale-100'
              }`}
            >
              {/* Active Pill Glow Surface */}
              {isActive && (
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/25 via-blue-500/25 to-indigo-500/25 border border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.4)] pointer-events-none animate-fadeIn" />
              )}

              <div className="relative flex items-center justify-center w-6 h-6 mb-0.5">
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'group-hover:scale-110'}`} />
              </div>
              <span className="relative text-[9px] sm:text-[11px] tracking-tight leading-none whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
