import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { 
  AppDisplaySettings, 
  AppThemeId, 
  FontSizeScale, 
  FontFamilyType, 
  BgEffectType, 
  APP_THEMES, 
  FONT_SIZES, 
  FONT_FAMILIES, 
  BG_EFFECTS, 
  loadDisplaySettings, 
  saveDisplaySettings, 
  DEFAULT_DISPLAY_SETTINGS 
} from '../utils/themeManager';
import { updateUserProfileData } from '../utils/authStorage';
import { restoreUserPurchases } from '../services/paymentService';
import { requestAccountDeletion, executeAccountDeletion } from '../services/accountDeletionService';
import { playSuccessChime, playCoinSound } from '../utils/audioEffects';
import { 
  Settings, Palette, User, ShieldCheck, RefreshCw, Trash2, 
  Sun, Moon, Type, Sparkles, Check, CheckCircle2, AlertCircle, 
  Edit3, Save, Crown, KeyRound, Mail, ShieldAlert, BookOpen, RotateCcw,
  Sliders, Eye, Globe2, ArrowLeftRight, ChevronRight, LogOut
} from 'lucide-react';
import { LANGUAGES_LIST, getLanguageInfo } from '../data/languagesData';
import { LanguageId } from '../types';
import { updateUserTargetLanguage, setCurrentUser } from '../utils/authStorage';
import { signOutUser } from '../services/authenticationService';

interface AppSettingsViewProps {
  currentUser: UserProfile | null;
  onUserUpdate?: (updated: UserProfile) => void;
  onAccountDeleted?: () => void;
  onLogout?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenAuth?: () => void;
  initialTab?: 'theme' | 'language' | 'profile' | 'restore' | 'security';
}

export const AppSettingsView: React.FC<AppSettingsViewProps> = ({
  currentUser,
  onUserUpdate,
  onAccountDeleted,
  onLogout,
  onOpenPrivacyPolicy,
  onOpenAuth,
  initialTab = 'theme'
}) => {
  const [activeTab, setActiveTab] = useState<'theme' | 'language' | 'profile' | 'restore' | 'security'>(initialTab);
  
  // Theme & Display Settings
  const [displaySettings, setDisplaySettings] = useState<AppDisplaySettings>(() => loadDisplaySettings());
  const [themeNotice, setThemeNotice] = useState(false);

  // Logout state
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Language state in Settings
  const [langSearch, setLangSearch] = useState('');
  const [langSubTab, setLangSubTab] = useState<'target' | 'native'>('target');
  const [langNotice, setLangNotice] = useState<string | null>(null);

  // Profile
  const [name, setName] = useState(currentUser?.name || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '🚀');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Restore Purchases
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Delete Account Flow
  const [deleteEmailInput, setDeleteEmailInput] = useState('');
  const [isRequestingDeletion, setIsRequestingDeletion] = useState(false);
  const [deletionRequested, setDeletionRequested] = useState(false);
  const [receivedToken, setReceivedToken] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isExecutingDelete, setIsExecutingDelete] = useState(false);

  const AVATARS = ['🌟', '🚀', '🎓', '👑', '🦁', '🦊', '🦉', '🌍', '⚡', '💡', '💎', '🔥'];

  useEffect(() => {
    setDisplaySettings(loadDisplaySettings());
  }, []);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setAvatar(currentUser.avatar || '🚀');
    }
  }, [currentUser]);

  // Handle Theme Update
  const handleUpdateTheme = (updated: Partial<AppDisplaySettings>) => {
    const fresh = { ...displaySettings, ...updated };
    setDisplaySettings(fresh);
    saveDisplaySettings(fresh);
    playSuccessChime();
    setThemeNotice(true);
    setTimeout(() => setThemeNotice(false), 2500);
  };

  // Quick 1-click Light/Dark Toggle
  const currentTheme = APP_THEMES.find(t => t.id === displaySettings.themeId) || APP_THEMES[0];
  const handleToggleLightDark = () => {
    const nextThemeId: AppThemeId = currentTheme.isLight ? 'dark-obsidian' : 'light-daylight';
    handleUpdateTheme({ themeId: nextThemeId });
  };

  // Save Profile Changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    const updated = updateUserProfileData(name, avatar);
    if (onUserUpdate) onUserUpdate(updated);
    setSaveSuccess(true);
    playSuccessChime();
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Restore Purchases
  const handleRestorePurchases = async () => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    setIsRestoring(true);
    setRestoreMessage(null);
    const res = await restoreUserPurchases(currentUser);
    setIsRestoring(false);
    
    if (res.success) {
      setRestoreMessage({ text: res.message, isError: false });
      playSuccessChime();
      const stored = localStorage.getItem('polyglot_active_user_v1');
      if (stored && onUserUpdate) {
        try {
          onUserUpdate(JSON.parse(stored));
        } catch {}
      }
    } else {
      setRestoreMessage({ text: res.message, isError: true });
    }
  };

  // Request Account Deletion
  const handleRequestDeletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setDeleteError(null);

    const cleanInput = deleteEmailInput.trim().toLowerCase();
    const cleanCurrent = currentUser.email.trim().toLowerCase();

    if (!cleanInput) {
      setDeleteError('Lütfen hesabınızda kayıtlı e-posta adresinizi giriniz.');
      return;
    }

    if (cleanInput !== cleanCurrent) {
      setDeleteError('Girdiğiniz e-posta adresi, mevcut hesabınızın e-posta adresiyle eşleşmiyor.');
      return;
    }

    setIsRequestingDeletion(true);
    const res = await requestAccountDeletion(currentUser, cleanInput);
    setIsRequestingDeletion(false);

    if (res.success) {
      setDeletionRequested(true);
      if (res.rawToken) {
        setReceivedToken(res.rawToken);
      }
    } else {
      setDeleteError(res.message);
    }
  };

  const handleExecuteDeletionWithToken = async () => {
    if (!receivedToken.trim()) {
      setDeleteError('Lütfen silme doğrulama tokenını giriniz.');
      return;
    }

    setIsExecutingDelete(true);
    setDeleteError(null);

    const res = await executeAccountDeletion(receivedToken.trim());
    setIsExecutingDelete(false);

    if (res.success) {
      alert('Hesabınız başarıyla silindi.');
      if (onAccountDeleted) onAccountDeleted();
    } else {
      setDeleteError(res.message);
    }
  };

  const handleLogoutClick = async () => {
    setIsLoggingOut(true);
    try {
      await signOutUser();
      if (onLogout) {
        onLogout();
      }
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setIsLoggingOut(false);
      setIsLogoutConfirmOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-cyan-950/70 via-slate-900 to-indigo-950/60 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 rounded-full text-xs font-black shadow-inner">
              <Settings className="w-3.5 h-3.5" />
              <span>Sistem &amp; Tercih Kontrol Merkezi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              ⚙️ Uygulama Ayarları
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Temanızı, renk paletlerinizi, yazı boyutu ölçeğinizi ve hesap güvenlik tercihlerinizi buradan kolayca yönetebilirsiniz.
            </p>
          </div>

          {/* Quick 1-Click Light/Dark Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleToggleLightDark}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-lg active:scale-95 ${
                currentTheme.isLight
                  ? 'bg-amber-400 text-slate-950 shadow-amber-400/30 ring-2 ring-amber-300'
                  : 'bg-slate-800 text-cyan-300 border border-cyan-500/40 hover:bg-slate-700'
              }`}
            >
              {currentTheme.isLight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{currentTheme.isLight ? '☀️ Ferah Açık Mod' : '🌙 Koyu Gece Modu'}</span>
            </button>
          </div>
        </div>

        {/* Live Notification Indicator */}
        {themeNotice && (
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center space-x-2 text-emerald-400 font-bold text-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ayarlar anında uygulandı ve hafızaya kaydedildi!</span>
          </div>
        )}
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar border-b border-slate-800 pb-2">
        
        {/* TAB 1: THEME & DISPLAY (Primary) */}
        <button
          type="button"
          onClick={() => setActiveTab('theme')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'theme'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 scale-105'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>🎨 Tema &amp; Görünüm</span>
        </button>

        {/* TAB 2: LANGUAGE SELECTION */}
        <button
          type="button"
          onClick={() => setActiveTab('language')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'language'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-105'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Globe2 className="w-4 h-4" />
          <span>🌐 Dili Değiştir (19+ Dil)</span>
        </button>

        {/* TAB 3: PROFILE */}
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 scale-105'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>👤 Profil &amp; Hesap</span>
        </button>

        {/* TAB 3: RESTORE PURCHASES */}
        <button
          type="button"
          onClick={() => setActiveTab('restore')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'restore'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-105'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>💎 Satın Alımları Geri Yükle</span>
        </button>

        {/* TAB 4: SECURITY & DELETE */}
        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25 scale-105'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>🛡️ Güvenlik &amp; Hesap Sil</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: TEMA VE GÖRÜNÜM AYARLARI
      ======================================================== */}
      {activeTab === 'theme' && (
        <div className="space-y-6">
          
          {/* Quick Info Box */}
          <div className="p-4 rounded-3xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-cyan-400" />
                Aktif Tema: <span className="text-cyan-300">{currentTheme.emoji} {currentTheme.name}</span>
              </h3>
              <p className="text-xs text-slate-300">
                Aşağıdan dilediğiniz renk paletine tıklayarak uygulamayı anında özelleştirebilirsiniz.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setDisplaySettings(DEFAULT_DISPLAY_SETTINGS);
                saveDisplaySettings(DEFAULT_DISPLAY_SETTINGS);
                playCoinSound();
                setThemeNotice(true);
                setTimeout(() => setThemeNotice(false), 2000);
              }}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Varsayılana Sıfırla</span>
            </button>
          </div>

          {/* 8 Theme Cards Grid */}
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
              Mevcut Renk Temaları ({APP_THEMES.length} Seçenek)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {APP_THEMES.map((theme) => {
                const isSelected = displaySettings.themeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => handleUpdateTheme({ themeId: theme.id })}
                    className={`p-4 rounded-3xl border text-left transition-all cursor-pointer relative flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'border-cyan-400 bg-gradient-to-b from-cyan-950/70 to-slate-900 shadow-xl shadow-cyan-500/20 ring-2 ring-cyan-400/80 scale-[1.02]'
                        : 'border-slate-800 bg-slate-900/80 hover:bg-slate-850 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{theme.emoji}</span>
                        <div>
                          <h4 className="text-xs font-black text-white">{theme.name}</h4>
                          <span className="text-[10px] text-slate-400">
                            {theme.isLight ? '☀️ Ferah Açık' : '🌙 Koyu / Canlı'}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-black text-xs shadow">
                          ✓
                        </div>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {theme.description}
                    </p>

                    {/* Palette Swatches */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between w-full">
                      <span className="text-[9px] uppercase font-mono text-slate-500">Renkler</span>
                      <div className="flex items-center space-x-1.5">
                        <span 
                          className="w-3 h-3 rounded-full border border-white/20" 
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                        <span 
                          className="w-3 h-3 rounded-full border border-white/20" 
                          style={{ backgroundColor: theme.secondaryColor }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography / Font Size Section */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Type className="w-4 h-4 text-cyan-400" />
                Yazı Boyutu (Font Büyüklüğü)
              </h3>
              <p className="text-xs text-slate-400">
                Almanca örnek cümleleri ve gramer açıklamalarını daha rahat okumak için boyutu seçin.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {FONT_SIZES.map((fs) => {
                const isSelected = displaySettings.fontSize === fs.id;
                return (
                  <button
                    key={fs.id}
                    type="button"
                    onClick={() => handleUpdateTheme({ fontSize: fs.id })}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer space-y-1 ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/70 text-white shadow-lg ring-2 ring-cyan-400/50'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-400">{fs.label}</div>
                    <div className="text-lg font-black text-cyan-300">{fs.scale}</div>
                    <p className="text-[10px] text-slate-500">{fs.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Family Section */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Yazı Tipi (Font Ailesi)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {FONT_FAMILIES.map((ff) => {
                const isSelected = displaySettings.fontFamily === ff.id;
                return (
                  <button
                    key={ff.id}
                    type="button"
                    onClick={() => handleUpdateTheme({ fontFamily: ff.id })}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/70 text-white shadow-lg ring-2 ring-cyan-400/50'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">{ff.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <p className="text-[10px] text-slate-500">{ff.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Background Atmosphere */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Arka Plan Dokusu &amp; Işık Efekti
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {BG_EFFECTS.map((bg) => {
                const isSelected = displaySettings.bgEffect === bg.id;
                return (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => handleUpdateTheme({ bgEffect: bg.id })}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
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
                    <p className="text-[10px] text-slate-500">{bg.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
          TAB: DİLİ DEĞİŞTİRME & KÜRESEL DİL SEÇİMİ (19+ DİL)
      ======================================================== */}
      {activeTab === 'language' && (
        <div className="space-y-6">
          
          {/* Info Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-amber-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-black">
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>Küresel Çok Dilli Sistem • Çift Yönlü</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Dili Değiştirme ve Kişiselleştirme
                </h3>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  Glotvia ile dünyanın her yerinden kullanıcılar istedikleri dilden istedikleri başka bir dili öğrenebilir.
                </p>
              </div>

              {/* Current Active Language Pill */}
              <div className="p-3 bg-slate-950/80 border border-white/15 rounded-2xl flex items-center gap-3 shrink-0">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Ana Diliniz</span>
                  <span className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                    {getLanguageInfo(currentUser?.nativeLanguage || 'tr').flag} {getLanguageInfo(currentUser?.nativeLanguage || 'tr').name}
                  </span>
                </div>
                <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Öğrenilen Dil</span>
                  <span className="text-xs sm:text-sm font-black text-amber-400 flex items-center gap-1.5">
                    {getLanguageInfo(currentUser?.targetLanguage || 'de').flag} {getLanguageInfo(currentUser?.targetLanguage || 'de').name}
                  </span>
                </div>
              </div>
            </div>

            {langNotice && (
              <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{langNotice}</span>
              </div>
            )}
          </div>

          {/* Sub Tab Switcher: Target Lang vs Native Lang */}
          <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center bg-slate-950 border border-white/10 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setLangSubTab('target')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    langSubTab === 'target'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🎯 Öğrenmek İstediğim Dil ({LANGUAGES_LIST.length})
                </button>
                <button
                  type="button"
                  onClick={() => setLangSubTab('native')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    langSubTab === 'native'
                      ? 'bg-cyan-400 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🗣️ Bildiğim / Ana Dilim ({LANGUAGES_LIST.length})
                </button>
              </div>

              {/* Search filter input */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={langSearch}
                  onChange={(e) => setLangSearch(e.target.value)}
                  placeholder="Dil veya ülke ara..."
                  className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Language Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
              {LANGUAGES_LIST
                .filter(l => {
                  if (!langSearch.trim()) return true;
                  const q = langSearch.toLowerCase();
                  return l.name.toLowerCase().includes(q) || l.nativeName.toLowerCase().includes(q) || l.description.toLowerCase().includes(q);
                })
                .map((lang) => {
                  const isCurrentTarget = (currentUser?.targetLanguage || 'de') === lang.id;
                  const isCurrentNative = (currentUser?.nativeLanguage || 'tr') === lang.id;
                  const isSelected = langSubTab === 'target' ? isCurrentTarget : isCurrentNative;

                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => {
                        if (langSubTab === 'target') {
                          playSuccessChime();
                          if (currentUser) {
                            const updated = updateUserTargetLanguage(lang.id);
                            if (onUserUpdate) onUserUpdate(updated);
                          }
                          setLangNotice(`Öğrenilen hedef dil başarıyla "${lang.flag} ${lang.name}" olarak değiştirildi!`);
                          setTimeout(() => setLangNotice(null), 3000);
                        } else {
                          playCoinSound();
                          if (currentUser) {
                            const updated: UserProfile = {
                              ...currentUser,
                              nativeLanguage: lang.id
                            };
                            setCurrentUser(updated);
                            if (onUserUpdate) onUserUpdate(updated);
                          }
                          setLangNotice(`Ana diliniz başarıyla "${lang.flag} ${lang.name}" olarak güncellendi!`);
                          setTimeout(() => setLangNotice(null), 3000);
                        }
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between group active:scale-[0.98] ${
                        isSelected
                          ? langSubTab === 'target'
                            ? 'bg-gradient-to-r from-amber-500/25 to-yellow-500/15 border-amber-400 text-white shadow-lg ring-1 ring-amber-400'
                            : 'bg-gradient-to-r from-cyan-500/25 to-blue-500/15 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400'
                          : 'bg-slate-950/60 hover:bg-slate-800/80 border-white/10 hover:border-white/20 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">
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
                            {lang.speakers} konuşan • {lang.greeting}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 ml-2">
                        {isSelected ? (
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-slate-950 font-black shadow-md ${
                            langSubTab === 'target' ? 'bg-amber-400' : 'bg-cyan-400'
                          }`}>
                            <Check className="w-3 h-3" />
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

        </div>
      )}

      {/* ========================================================
          TAB: PROFİL VE HESAP AYARLARI
      ======================================================== */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {currentUser ? (
            <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-400" />
                Profil Bilgileri
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Adınız &amp; Soyadınız
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Profil Avatarınız
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setAvatar(av)}
                      className={`p-2.5 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                        avatar === av
                          ? 'bg-indigo-600/40 border-2 border-indigo-400 scale-110 shadow-lg'
                          : 'bg-slate-950/60 border border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Kayıtlı E-posta:</span>
                <span className="font-mono text-white font-bold">{currentUser.email}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Üyelik Durumu:</span>
                {currentUser.isPremium ? (
                  <span className="font-black text-amber-300 flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-400" />
                    PRO / VIP Aktif
                  </span>
                ) : (
                  <span className="text-slate-400 font-bold">Ücretsiz Başlangıç</span>
                )}
              </div>

              {/* Dil Tercihleri Kartı */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-950/50 to-cyan-950/30 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Globe2 className="w-4 h-4" />
                    Dil Tercihleriniz (19+ Dil)
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('language')}
                    className="text-xs font-black text-amber-400 hover:text-amber-300 underline cursor-pointer"
                  >
                    Dili Değiştir &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 flex items-center gap-2.5">
                    <span className="text-2xl">{getLanguageInfo(currentUser.nativeLanguage || 'tr').flag}</span>
                    <div className="min-w-0">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Ana Dil</span>
                      <span className="text-xs font-black text-white truncate block">
                        {getLanguageInfo(currentUser.nativeLanguage || 'tr').name}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center gap-2.5">
                    <span className="text-2xl">{getLanguageInfo(currentUser.targetLanguage || currentUser.currentLearningLanguage || 'de').flag}</span>
                    <div className="min-w-0">
                      <span className="text-[9px] uppercase tracking-wider text-amber-400/80 font-bold block">Öğrenilen Dil</span>
                      <span className="text-xs font-black text-amber-300 truncate block">
                        {getLanguageInfo(currentUser.targetLanguage || currentUser.currentLearningLanguage || 'de').name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {saveSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Profil bilgileriniz başarıyla güncellendi!</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:brightness-110 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <Save className="w-4 h-4" />
                  Değişiklikleri Kaydet
                </button>

                <button
                  type="button"
                  onClick={() => setIsLogoutConfirmOpen(true)}
                  className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-white/10 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98"
                  title="Hesaptan Çıkış Yap"
                >
                  <LogOut className="w-4 h-4 text-slate-400" />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 text-center space-y-4">
              <User className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-base font-black text-white">Giriş Yapmadınız</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Profil bilgilerinizi kaydetmek ve tüm derslerinize her cihazdan erişmek için ücretsiz giriş yapın.
              </p>
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg cursor-pointer"
              >
                Giriş Yap / Üye Ol
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 3: SATIN ALIMLARI GERİ YÜKLE
      ======================================================== */}
      {activeTab === 'restore' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5">
          <div className="space-y-2">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-400" />
              Satın Alımları ve Üyeliği Geri Yükle
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cihaz değiştirdiğinizde veya uygulamayı yeniden yüklediğinizde, daha önce satın aldığınız PRO / VIP paketlerinizi ve jetonlarınızı bulut kayıtlarımızdan geri yükleyebilirsiniz.
            </p>
          </div>

          {restoreMessage && (
            <div className={`p-4 rounded-2xl text-xs flex items-start gap-2.5 border ${
              restoreMessage.isError
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            }`}>
              {restoreMessage.isError ? (
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              )}
              <span>{restoreMessage.text}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleRestorePurchases}
            disabled={isRestoring}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 active:scale-98"
          >
            <RefreshCw className={`w-4 h-4 ${isRestoring ? 'animate-spin' : ''}`} />
            {isRestoring ? 'Kontrol Ediliyor...' : 'Satın Alımları Şimdi Geri Yükle'}
          </button>
        </div>
      )}

      {/* ========================================================
          TAB 4: GÜVENLİK VE HESAP SİLME
      ======================================================== */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Gizlilik Politikası ve Güvenlik Standartları
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verileriniz Firebase Firestore bulut altyapısında güvenle saklanmaktadır. Veri güvenliği politikamızı ve kullanıcı haklarınızı dilediğiniz an inceleyebilirsiniz.
            </p>
            {onOpenPrivacyPolicy && (
              <button
                type="button"
                onClick={onOpenPrivacyPolicy}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-cyan-300 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer"
              >
                Gizlilik Politikası Metnini Oku →
              </button>
            )}
          </div>

          {/* Session & Logout Box */}
          {currentUser && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-slate-800 text-slate-300">
                  <LogOut className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Oturum Güvenliği &amp; Çıkış
                  </h3>
                  <p className="text-xs text-slate-400">
                    Cihazınızdaki aktif Firebase oturumunu güvenle sonlandırıp giriş ekranına dönün.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogoutConfirmOpen(true)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-white/10 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <LogOut className="w-4 h-4 text-amber-400" />
                  <span>Oturumu Kapat (Hesaptan Çıkış Yap)</span>
                </button>
              </div>
            </div>
          )}

          {/* Delete Account Box */}
          {currentUser && (
            <div className="p-6 sm:p-8 rounded-3xl bg-rose-950/30 border border-rose-500/30 space-y-5">
              <h3 className="text-base font-black text-rose-300 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-400" />
                Hesabı Kalıcı Olarak Sil
              </h3>
              
              {!deletionRequested ? (
                <form onSubmit={handleRequestDeletion} className="space-y-4">
                  <p className="text-xs text-rose-200/80 leading-relaxed">
                    Hesabınızı sildiğinizde ders ilerlemeleriniz ve jetonlarınız kalıcı olarak kaldırılır.
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Onaylamak için kayıtlı e-posta adresinizi giriniz:
                    </label>
                    <input
                      type="email"
                      placeholder={currentUser.email}
                      value={deleteEmailInput}
                      onChange={(e) => setDeleteEmailInput(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950/70 border border-rose-500/40 rounded-xl text-white font-mono text-xs focus:border-rose-400 focus:outline-none"
                    />
                  </div>

                  {deleteError && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{deleteError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isRequestingDeletion || !deleteEmailInput.trim()}
                    className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-40"
                  >
                    <Mail className={`w-4 h-4 ${isRequestingDeletion ? 'animate-spin' : ''}`} />
                    {isRequestingDeletion ? 'Silme Talebi Gönderiliyor...' : 'Hesap Silme Onay E-postası Gönder'}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs">
                    Doğrulama tokenı <strong>{currentUser.email}</strong> adresine gönderildi.
                  </div>
                  <input
                    type="text"
                    value={receivedToken}
                    onChange={(e) => setReceivedToken(e.target.value)}
                    placeholder="E-postadaki silme tokenı..."
                    className="w-full px-4 py-3 bg-slate-950/70 border border-amber-400/40 rounded-xl text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleExecuteDeletionWithToken}
                    disabled={isExecutingDelete || !receivedToken.trim()}
                    className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isExecutingDelete ? 'Siliniyor...' : 'EVET, HESABIMI KALICI OLARAK SİL'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          LOGOUT CONFIRMATION MODAL POPUP
      ======================================================== */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleUp">
            
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center text-2xl shadow-lg shadow-amber-500/10">
                <LogOut className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-white">
                Çıkış Yapmak İstiyor musunuz?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                Hesabınızdan çıkış yaptığınızda ilerlemeleriniz Firebase bulut hesabınızda güvenle korunur. Dilediğiniz an tekrar giriş yapabilirsiniz.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(false)}
                disabled={isLoggingOut}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-white/10 text-slate-300 font-bold text-xs cursor-pointer transition-all active:scale-98"
              >
                Vazgeç
              </button>

              <button
                type="button"
                onClick={handleLogoutClick}
                disabled={isLoggingOut}
                className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98 disabled:opacity-50"
              >
                <LogOut className={`w-3.5 h-3.5 ${isLoggingOut ? 'animate-spin' : ''}`} />
                {isLoggingOut ? 'Çıkılıyor...' : 'Evet, Çıkış Yap'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
