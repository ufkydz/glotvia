import React from 'react';
import { Home, BookOpen, MessageSquare, Bell, User } from 'lucide-react';

export type MainNavTab = 'home' | 'lessons' | 'messages' | 'notifications' | 'profile';

interface BottomNavigationBarProps {
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  unreadNotificationsCount?: number;
}

export const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  activeTab,
  onSelectTab,
  unreadNotificationsCount = 0,
}) => {
  const tabs = [
    {
      id: 'home' as MainNavTab,
      label: 'Ana Sayfa',
      icon: Home,
      accent: 'cyan',
    },
    {
      id: 'lessons' as MainNavTab,
      label: 'Dersler',
      icon: BookOpen,
      accent: 'amber',
    },
    {
      id: 'messages' as MainNavTab,
      label: 'Pratik & Sohbet',
      icon: MessageSquare,
      accent: 'purple',
    },
    {
      id: 'notifications' as MainNavTab,
      label: 'Bildirimler',
      icon: Bell,
      accent: 'indigo',
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
    {
      id: 'profile' as MainNavTab,
      label: 'Profil & Ayarlar',
      icon: User,
      accent: 'emerald',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 px-2 py-2 safe-area-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-md sm:max-w-xl md:max-w-2xl mx-auto flex items-center justify-around gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex-1 py-1.5 px-2 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer select-none group ${
                isActive
                  ? 'text-white scale-105'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {/* Active Indicator Glow Pill */}
              {isActive && (
                <span className="absolute -top-1 w-8 h-1 rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-indigo-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
              )}

              <div className="relative">
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-white/10 text-cyan-300 shadow-inner'
                      : 'group-hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </div>

                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] font-extrabold tracking-tight mt-0.5 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)] font-black'
                    : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
