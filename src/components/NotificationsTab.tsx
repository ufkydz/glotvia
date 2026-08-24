import React, { useState } from 'react';
import { UserProfile, UserTokenState } from '../types';
import { 
  Bell, Gift, Flame, Award, CheckCircle2, 
  Sparkles, Clock, ArrowRight, Trash2, Check
} from 'lucide-react';
import { GlassCard } from './glass/GlassCard';
import { GlassButton } from './glass/GlassButton';

interface NotificationsTabProps {
  currentUser: UserProfile | null;
  tokenState: UserTokenState;
  onGoToLessons: () => void;
  onOpenShop: () => void;
}

interface NotificationItem {
  id: string;
  type: 'reward' | 'streak' | 'exam' | 'system';
  title: string;
  description: string;
  time: string;
  read: boolean;
  actionLabel?: string;
  actionTarget?: 'lessons' | 'shop';
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({
  currentUser,
  tokenState,
  onGoToLessons,
  onOpenShop
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      type: 'reward',
      title: 'Ders Kredisi Eklendi (+0.1 Kredi)',
      description: 'Tamamlanan dersleriniz için bakiyenize +0.1 Kredi eklendi. Tebrikler!',
      time: '10 dakika önce',
      read: false,
      actionLabel: 'Cüzdanı Gör',
      actionTarget: 'shop'
    },
    {
      id: 'n2',
      type: 'streak',
      title: 'Seri Hatırlatması 🔥',
      description: `${tokenState.streakDays || 1} günlük çalışma serinizi kaybetmemek için bugünkü dersinizi tamamlayın.`,
      time: '2 saat önce',
      read: false,
      actionLabel: 'Derse Başla',
      actionTarget: 'lessons'
    },
    {
      id: 'n3',
      type: 'exam',
      title: 'Goethe Sınav Simülatörü Hazır',
      description: '16. dersteki Goethe A1-B1 deneme sınavıyla seviyenizi ölçebilir ve yetkinlik karnesi alabilirsiniz.',
      time: '1 gün önce',
      read: true,
      actionLabel: 'Sınava Git',
      actionTarget: 'lessons'
    },
    {
      id: 'n4',
      type: 'reward',
      title: 'Günlük Giriş Bonusu',
      description: 'Glotvia platformuna her gün giriş yaparak +25 bonus puan kazanabilirsiniz.',
      time: '2 gün önce',
      read: true
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'reward' | 'streak' | 'exam'>('all');

  const filteredNotifications = notifications.filter(n => filter === 'all' || n.type === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleAction = (target?: 'lessons' | 'shop') => {
    if (target === 'lessons') onGoToLessons();
    if (target === 'shop') onOpenShop();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 animate-fadeIn">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>🔔</span>
            <span>Bildirimler & Başarılar</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
            Ders ödülleri, streak güncellemeleri ve sınav hatırlatmaları.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Tümünü Okundu Say</span>
          </button>
        )}
      </div>

      {/* FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all' as const, label: `Tümü (${notifications.length})` },
          { id: 'reward' as const, label: 'Ödüller 💎' },
          { id: 'streak' as const, label: 'Seri 🔥' },
          { id: 'exam' as const, label: 'Sınavlar 🏆' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === f.id
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-white/10'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* NOTIFICATIONS STREAM */}
      <div className="space-y-3">
        {filteredNotifications.map((n) => {
          let icon = <Bell className="w-5 h-5 text-cyan-400" />;
          let iconBg = 'bg-cyan-500/20';

          if (n.type === 'reward') {
            icon = <Gift className="w-5 h-5 text-emerald-400" />;
            iconBg = 'bg-emerald-500/20';
          } else if (n.type === 'streak') {
            icon = <Flame className="w-5 h-5 text-amber-400" />;
            iconBg = 'bg-amber-500/20';
          } else if (n.type === 'exam') {
            icon = <Award className="w-5 h-5 text-purple-400" />;
            iconBg = 'bg-purple-500/20';
          }

          return (
            <GlassCard
              key={n.id}
              variant="liquid"
              className={`p-4 sm:p-5 transition-all ${
                !n.read ? 'border-cyan-500/40 bg-slate-900/90' : 'border-white/5 opacity-85'
              }`}
            >
              <div className="flex items-start justify-between gap-3.5">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
                    {icon}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white">{n.title}</h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      )}
                    </div>

                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {n.description}
                    </p>

                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{n.time}</span>
                    </span>
                  </div>
                </div>

                {n.actionLabel && (
                  <GlassButton
                    variant="secondary"
                    size="sm"
                    onClick={() => handleAction(n.actionTarget)}
                    className="shrink-0 text-xs font-bold"
                  >
                    <span>{n.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </GlassButton>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

    </div>
  );
};
