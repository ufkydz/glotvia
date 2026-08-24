import React, { useState } from 'react';
import { UserProfile, UserTokenState } from '../types';
import { CURRICULUM_TOPICS } from '../data/germanCurriculumData';
import { getLanguageInfo } from '../data/languagesData';
import { 
  User, Settings, Palette, Globe, Volume2, ShieldCheck, 
  Trash2, LogOut, Crown, Award, Coins, Flame, CheckCircle2, 
  CreditCard, ChevronRight, Sparkles, AlertTriangle
} from 'lucide-react';
import { GlassCard } from './glass/GlassCard';
import { GlassButton } from './glass/GlassButton';

interface ProfileSettingsTabProps {
  currentUser: UserProfile | null;
  tokenState: UserTokenState;
  onOpenShop: () => void;
  onOpenThemeModal: () => void;
  onOpenLanguageModal: () => void;
  onOpenPrivacy: () => void;
  onOpenAccountSettings?: () => void;
  onLogout: () => void;
  alphabetSpeechSpeed: number;
  onSpeedChange: (speed: number) => void;
}

export const ProfileSettingsTab: React.FC<ProfileSettingsTabProps> = ({
  currentUser,
  tokenState,
  onOpenShop,
  onOpenThemeModal,
  onOpenLanguageModal,
  onOpenPrivacy,
  onOpenAccountSettings,
  onLogout,
  alphabetSpeechSpeed,
  onSpeedChange
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const completedCount = (tokenState.completedLessons || []).length;
  const progressPercent = Math.round((completedCount / CURRICULUM_TOPICS.length) * 100);

  const targetLang = getLanguageInfo(currentUser?.targetLanguage || 'de');
  const nativeLang = getLanguageInfo(currentUser?.nativeLanguage || 'tr');

  const handleDeleteAccount = () => {
    if (deleteConfirmText.trim().toUpperCase() === 'SİL') {
      alert('Hesabınız ve tüm verileriniz başarıyla silindi.');
      setIsDeleteModalOpen(false);
      onLogout();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 animate-fadeIn">
      
      {/* 1. PROFILE HERO CARD */}
      <GlassCard variant="glow" glowColor="cyan" className="p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          
          {/* Avatar */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-1 shadow-[0_0_25px_rgba(6,182,212,0.4)] shrink-0">
            <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center text-4xl">
              {currentUser?.avatar || '👤'}
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white truncate">
                {currentUser?.name || 'Misafir Öğrenci'}
              </h2>
              {currentUser?.isPremium ? (
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[10px] uppercase shadow-sm">
                  PRO VIP
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-extrabold text-[10px] border border-cyan-500/30">
                  Ücretsiz Paket
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 font-medium truncate">
              {currentUser?.email || 'Giriş yapılmadı'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs">
              <span className="px-3 py-1 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-bold">
                🎯 {targetLang.flag} {targetLang.name} Öğreniyor
              </span>
              <span className="px-3 py-1 rounded-xl bg-purple-500/15 border border-purple-400/30 text-purple-300 font-bold">
                🏆 CEFR A1.1 Seviyesi
              </span>
            </div>
          </div>

          {/* Edit / Quick Action */}
          {onOpenAccountSettings && (
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={onOpenAccountSettings}
              className="text-xs font-bold shrink-0"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Düzenle</span>
            </GlassButton>
          )}
        </div>

        {/* 3 Metrics in Profile */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/10 text-center">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-base sm:text-lg font-black text-amber-400">🔥 {tokenState.streakDays || 1} Gün</div>
            <div className="text-[11px] text-slate-400 font-medium">Çalışma Serisi</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-base sm:text-lg font-black text-cyan-400">🪙 {tokenState.coins} Kredi</div>
            <div className="text-[11px] text-slate-400 font-medium">Cüzdan Bakiyesi</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-base sm:text-lg font-black text-emerald-400">%{progressPercent}</div>
            <div className="text-[11px] text-slate-400 font-medium">Müfredat Skoru</div>
          </div>
        </div>
      </GlassCard>

      {/* 2. WALLET & CREDIT MANAGEMENT */}
      <GlassCard variant="liquid" className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl font-black">
              🪙
            </div>
            <div>
              <h3 className="text-base font-black text-white">Glotvia Kredi & Cüzdan</h3>
              <p className="text-xs text-slate-400">Tamamlanan her ders için <strong>+0.1 Kredi</strong> hesabınıza yansır.</p>
            </div>
          </div>

          <GlassButton
            variant="warning"
            size="sm"
            onClick={onOpenShop}
            className="text-slate-950 font-black text-xs"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Kredi Satın Al</span>
          </GlassButton>
        </div>
      </GlassCard>

      {/* 3. CENTRALIZED SETTINGS MENU */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-white uppercase tracking-wider px-1">
          Uygulama & Tercih Ayarları
        </h3>

        <div className="bg-slate-900/90 rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden">
          
          {/* Theme & Background */}
          <button
            type="button"
            onClick={onOpenThemeModal}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white">Tema & Görünüm Ayarları</div>
                <div className="text-[11px] text-slate-400">Ferah, Sıcak, Koyu ve Gece temaları</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Language Pair */}
          <button
            type="button"
            onClick={onOpenLanguageModal}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white">Dil Seçenekleri (19+ Dil)</div>
                <div className="text-[11px] text-slate-400">{nativeLang.name} ➔ {targetLang.name}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Audio & Speech Speed */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white">Ses & Okuma Hızı</div>
                <div className="text-[11px] text-slate-400">Telaffuz ses hızı kontrolü</div>
              </div>
            </div>

            {/* Speed Options */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              {[
                { label: '0.55x (Yavaş)', val: 0.55 },
                { label: '0.70x (Normal)', val: 0.70 },
                { label: '0.85x (Akıcı)', val: 0.85 },
              ].map((s) => (
                <button
                  key={s.val}
                  type="button"
                  onClick={() => onSpeedChange(s.val)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    alphabetSpeechSpeed === s.val
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Policy */}
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white">Gizlilik Politikası & KVKK</div>
                <div className="text-[11px] text-slate-400">Google Play Data Safety standartları</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Account Deletion */}
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-rose-300">Hesabı ve Verileri Sil</div>
                <div className="text-[11px] text-slate-400">Kalıcı veri silme süreci</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-400" />
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Glotvia hesabınızdan çıkış yapmak istediğinize emin misiniz?')) {
                onLogout();
              }
            }}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
                <LogOut className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white">Hesaptan Çıkış Yap</div>
                <div className="text-[11px] text-slate-400">Oturumu güvenli bir şekilde kapat</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

        </div>
      </div>

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <GlassCard variant="liquid" className="w-full max-w-md p-6 space-y-4 border-rose-500/40">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-black text-white">Hesabı Kalıcı Olarak Sil</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Bu işlem geri alınamaz. İlerlemeniz, kazandığınız krediler ve tüm sertifikalarınız kalıcı olarak silinecektir.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">
                Onaylamak için büyük harflerle <strong>SİL</strong> yazınız:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="SİL"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-rose-500/30 text-white font-bold text-sm focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                İptal
              </button>
              <GlassButton
                variant="danger"
                size="sm"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText.trim().toUpperCase() !== 'SİL'}
                className="text-xs font-black"
              >
                Kalıcı Olarak Sil
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      )}

    </div>
  );
};
