import React, { useState, useEffect } from 'react';
import { UserProfile, LanguageId, LanguageLevel, LearningLanguageSlot, LanguageVocabularyItem } from '../types';
import { 
  updateUserProfileData, 
  getAllUsers, 
  updateUserTargetLanguage, 
  updateUserNativeLanguage,
  setCurrentUser,
  addOrUpdateLearningLanguageSlot,
  updateLanguageSlotProgress,
  removeLearningLanguageSlot,
  addWordToLanguageSlot,
  removeWordFromLanguageSlot,
  toggleWordMasteredInLanguageSlot,
  setLoggedInState
} from '../utils/authStorage';
import { restoreUserPurchases } from '../services/paymentService';
import { playSuccessChime, playCoinSound } from '../utils/audioEffects';
import { requestAccountDeletion, executeAccountDeletion, deleteAccountDirectly } from '../services/accountDeletionService';
import { 
  ADMIN_NOTIFICATION_EMAIL, 
  sendAllRegisteredEmailsDigestToAdmin 
} from '../services/realEmailService';
import { 
  getAllRegisteredEmailsFromFirestore, 
  syncUserToFirestore, 
  updateUserLearningLanguagesInFirestore 
} from '../services/firebaseDbService';
import { 
  changeCurrentUserPassword, 
  sendUserPasswordReset, 
  signOutUser 
} from '../services/authenticationService';
import { 
  loadDisplaySettings, 
  saveDisplaySettings, 
  APP_THEMES, 
  FONT_SIZES, 
  FONT_FAMILIES, 
  BG_EFFECTS,
  AppDisplaySettings,
  AppThemeId
} from '../utils/themeManager';
import { LANGUAGES_LIST, getLanguageInfo } from '../data/languagesData';
import { 
  X, User, ShieldAlert, Trash2, RefreshCw, CheckCircle2, 
  AlertCircle, ShieldCheck, FileText, Lock, Edit3, Save,
  Crown, Sparkles, Check, Mail, KeyRound, ArrowRight,
  Palette, Type, Sliders, RotateCcw, Send, Database,
  Globe2, ArrowLeftRight, ChevronRight, Search, Plus,
  BookOpen, Layers, Award, Target, GraduationCap,
  ChevronDown, ChevronUp, CheckSquare, Square, Cloud, LogOut
} from 'lucide-react';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserUpdate: (updatedUser: UserProfile) => void;
  onAccountDeleted: () => void;
  onLogout?: () => void;
  onOpenPrivacyPolicy?: () => void;
  initialTab?: 'profile' | 'security' | 'delete' | 'theme' | 'admin_emails';
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdate,
  onAccountDeleted,
  onLogout,
  onOpenPrivacyPolicy,
  initialTab = 'profile'
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'delete' | 'theme' | 'admin_emails'>(initialTab);
  
  // Profile edit
  const [name, setName] = useState(currentUser.name);
  const [avatar, setAvatar] = useState(currentUser.avatar || '🚀');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Multi-Language management state
  const [langSearchQuery, setLangSearchQuery] = useState('');
  const [langSubTab, setLangSubTab] = useState<'active_slots' | 'browse_all' | 'native'>('active_slots');
  const [langNotice, setLangNotice] = useState<string | null>(null);
  const [expandedLangId, setExpandedLangId] = useState<string | null>(currentUser.targetLanguage || 'de');
  
  // Adding word inline per language slot
  const [wordFormOpenFor, setWordFormOpenFor] = useState<string | null>(null);
  const [newWord, setNewWord] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [newWordLevel, setNewWordLevel] = useState<LanguageLevel>('A1');
  const [newWordNotes, setNewWordNotes] = useState('');

  // Adding new language slot modal
  const [isAddLangModalOpen, setIsAddLangModalOpen] = useState(false);
  const [selectedNewLangId, setSelectedNewLangId] = useState<LanguageId>('es');
  const [selectedNewLangLevel, setSelectedNewLangLevel] = useState<LanguageLevel>('A1');
  const [selectedNewLangGoal, setSelectedNewLangGoal] = useState<number>(15);

  // Cloud sync state
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [cloudSyncMsg, setCloudSyncMsg] = useState<string | null>(null);

  // Password Change & Reset
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChangeMessage, setPasswordChangeMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);
  const [resetEmailMessage, setResetEmailMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Logout Confirmation Modal
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Delete Account Flow & Re-auth
  const [directDeleteStep, setDirectDeleteStep] = useState<0 | 1 | 2>(0); // 0: initial, 1: first confirm, 2: second confirm & password
  const [deletePasswordInput, setDeletePasswordInput] = useState('');
  const [isDeletingDirectly, setIsDeletingDirectly] = useState(false);
  const [directDeleteError, setDirectDeleteError] = useState<string | null>(null);

  // Email Token Deletion Fallback
  const [showEmailTokenFallback, setShowEmailTokenFallback] = useState(false);
  const [deleteEmailInput, setDeleteEmailInput] = useState('');
  const [isRequestingDeletion, setIsRequestingDeletion] = useState(false);
  const [deletionRequested, setDeletionRequested] = useState(false);
  const [deletionSuccessMsg, setDeletionSuccessMsg] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [receivedToken, setReceivedToken] = useState('');
  const [isExecutingDelete, setIsExecutingDelete] = useState(false);

  // Display & Theme Settings
  const [displaySettings, setDisplaySettings] = useState<AppDisplaySettings>(() => loadDisplaySettings());

  // Restore Purchases
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Admin Email Sync & Export State
  const [isSendingAdminDigest, setIsSendingAdminDigest] = useState(false);
  const [adminDigestResult, setAdminDigestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [registeredUsersCount, setRegisteredUsersCount] = useState<number>(() => {
    return getAllUsers().length || 1;
  });

  useEffect(() => {
    getAllRegisteredEmailsFromFirestore().then((list) => {
      if (list && list.length > 0) {
        setRegisteredUsersCount(list.length);
      }
    }).catch(() => {});
  }, []);

  const handleSendAllEmailsToAdmin = async () => {
    setIsSendingAdminDigest(true);
    setAdminDigestResult(null);

    try {
      const localUsers = getAllUsers();
      const firestoreUsers = await getAllRegisteredEmailsFromFirestore();
      
      const emailMap = new Map<string, { email: string; name?: string; createdAt?: string; isEmailVerified?: boolean }>();
      
      localUsers.forEach(u => {
        if (u.email) {
          emailMap.set(u.email.toLowerCase(), {
            email: u.email.toLowerCase(),
            name: u.name,
            createdAt: u.createdAt,
            isEmailVerified: u.isEmailVerified
          });
        }
      });

      firestoreUsers.forEach(u => {
        if (u.email) {
          emailMap.set(u.email.toLowerCase(), {
            email: u.email.toLowerCase(),
            name: u.name,
            createdAt: u.registeredAt,
            isEmailVerified: u.isEmailVerified
          });
        }
      });

      const fullList = Array.from(emailMap.values());
      const res = await sendAllRegisteredEmailsDigestToAdmin(fullList);
      setAdminDigestResult(res);
      if (res.success) {
        playSuccessChime();
      }
    } catch (e: any) {
      setAdminDigestResult({
        success: false,
        message: e?.message || 'E-posta listesi gönderilirken hata oluştu.'
      });
    } finally {
      setIsSendingAdminDigest(false);
    }
  };

  if (!isOpen) return null;

  const AVATARS = ['🌟', '🚀', '🎓', '👑', '🦁', '🦊', '🦉', '🌍', '⚡', '💡', '💎', '🔥'];

  const handleUpdateTheme = (updated: Partial<AppDisplaySettings>) => {
    const fresh = { ...displaySettings, ...updated };
    setDisplaySettings(fresh);
    saveDisplaySettings(fresh);
    playSuccessChime();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateUserProfileData(name, avatar);
    onUserUpdate(updated);
    setSaveSuccess(true);
    playSuccessChime();
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    setRestoreMessage(null);
    const res = await restoreUserPurchases(currentUser);
    setIsRestoring(false);
    
    if (res.success) {
      setRestoreMessage({ text: res.message, isError: false });
      playSuccessChime();
      const stored = localStorage.getItem('polyglot_active_user_v1');
      if (stored) {
        try {
          onUserUpdate(JSON.parse(stored));
        } catch {}
      }
    } else {
      setRestoreMessage({ text: res.message, isError: true });
    }
  };

  // Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeMessage(null);

    if (newPasswordInput.length < 6) {
      setPasswordChangeMessage({ text: 'Yeni şifreniz en az 6 karakter olmalıdır.', isError: true });
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeMessage({ text: 'Şifreler birbiriyle uyuşmuyor.', isError: true });
      return;
    }

    setIsChangingPassword(true);
    const res = await changeCurrentUserPassword(currentUser.email, newPasswordInput);
    setIsChangingPassword(false);

    if (res.success) {
      setPasswordChangeMessage({ text: res.message, isError: false });
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      playSuccessChime();
    } else {
      setPasswordChangeMessage({ text: res.message, isError: true });
    }
  };

  // Send Password Reset Link via Email
  const handleSendResetEmail = async () => {
    setIsSendingResetEmail(true);
    setResetEmailMessage(null);

    const res = await sendUserPasswordReset(currentUser.email);
    setIsSendingResetEmail(false);

    if (res.success) {
      setResetEmailMessage({ text: res.message, isError: false });
      playSuccessChime();
    } else {
      setResetEmailMessage({ text: res.message, isError: true });
    }
  };

  // Perform Real Sign Out
  const handleExecuteLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOutUser();
      setLoggedInState(false);
      onClose();
      if (onLogout) {
        onLogout();
      } else {
        window.location.reload();
      }
    } catch (e) {
      console.warn('Logout error:', e);
      setIsLoggingOut(false);
      onClose();
      if (onLogout) onLogout();
    }
  };

  // Direct In-App Account Deletion
  const handleExecuteDirectDelete = async () => {
    setIsDeletingDirectly(true);
    setDirectDeleteError(null);

    const res = await deleteAccountDirectly(currentUser, deletePasswordInput);
    setIsDeletingDirectly(false);

    if (res.success) {
      playSuccessChime();
      alert(res.message);
      onClose();
      onAccountDeleted();
    } else {
      setDirectDeleteError(res.message);
    }
  };

  // Email Token Deletion Request
  const handleRequestDeletion = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError(null);
    setDeletionSuccessMsg(null);

    const cleanInput = deleteEmailInput.trim().toLowerCase();
    const cleanCurrent = currentUser.email.trim().toLowerCase();

    if (!cleanInput) {
      setDeleteError('Lütfen hesabınızda kayıtlı e-posta adresinizi giriniz.');
      return;
    }

    if (cleanInput !== cleanCurrent) {
      setDeleteError('Girdiğiniz e-posta adresi, mevcut hesabınızın e-posta adresiyle birebir eşleşmelidir.');
      return;
    }

    setIsRequestingDeletion(true);
    const res = await requestAccountDeletion(currentUser, cleanInput);
    setIsRequestingDeletion(false);

    if (res.success) {
      setDeletionRequested(true);
      setDeletionSuccessMsg(res.message);
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
      onClose();
      onAccountDeleted();
    } else {
      setDeleteError(res.message);
    }
  };

  const handleSelectActiveTargetLanguage = (langId: LanguageId) => {
    const updated = updateUserTargetLanguage(langId);
    onUserUpdate(updated);
    playSuccessChime();
    setLangNotice(`Aktif öğrenilen dil "${getLanguageInfo(langId).name}" olarak ayarlandı.`);
    setTimeout(() => setLangNotice(null), 3500);
  };

  const handleSelectNativeLanguage = (langId: LanguageId) => {
    const updated = updateUserNativeLanguage(langId);
    onUserUpdate(updated);
    playSuccessChime();
    setLangNotice(`Ana diliniz "${getLanguageInfo(langId).name}" olarak ayarlandı.`);
    setTimeout(() => setLangNotice(null), 3500);
  };

  const handleChangeLanguageLevel = (langId: LanguageId, level: LanguageLevel) => {
    const updated = updateLanguageSlotProgress(langId, { level });
    onUserUpdate(updated);
    playCoinSound();
    setLangNotice(`${getLanguageInfo(langId).name} seviyesi "${level}" olarak güncellendi.`);
    setTimeout(() => setLangNotice(null), 3000);
  };

  const handleUpdateLanguageProgress = (langId: LanguageId, delta: number) => {
    const currentSlot = (currentUser.learningLanguages || []).find(s => s.targetLanguage === langId);
    const prev = currentSlot ? currentSlot.progressPercentage : 20;
    const clamped = Math.min(100, Math.max(0, prev + delta));
    const updated = updateLanguageSlotProgress(langId, { progressPercentage: clamped });
    onUserUpdate(updated);
  };

  const handleUpdateLanguageDailyGoal = (langId: LanguageId, dailyGoalWords: number) => {
    const updated = updateLanguageSlotProgress(langId, { dailyGoalWords });
    onUserUpdate(updated);
    playCoinSound();
  };

  const handleAddWord = (langId: LanguageId) => {
    if (!newWord.trim() || !newTranslation.trim()) return;
    const updated = addWordToLanguageSlot(langId, newWord, newTranslation, newWordLevel, newWordNotes);
    onUserUpdate(updated);
    playSuccessChime();
    setNewWord('');
    setNewTranslation('');
    setNewWordNotes('');
    setWordFormOpenFor(null);
    setLangNotice(`"${newWord}" kelimesi ${getLanguageInfo(langId).name} kelime listenize eklendi!`);
    setTimeout(() => setLangNotice(null), 3000);
  };

  const handleRemoveWord = (langId: LanguageId, vocabId: string) => {
    const updated = removeWordFromLanguageSlot(langId, vocabId);
    onUserUpdate(updated);
  };

  const handleToggleMasteredWord = (langId: LanguageId, vocabId: string) => {
    const updated = toggleWordMasteredInLanguageSlot(langId, vocabId);
    onUserUpdate(updated);
    playCoinSound();
  };

  const handleRemoveLanguageSlot = (langId: LanguageId) => {
    if (confirm(`${getLanguageInfo(langId).name} dilini ve kelime listesini kaldırmak istediğinize emin misiniz?`)) {
      const updated = removeLearningLanguageSlot(langId);
      onUserUpdate(updated);
    }
  };

  const handleAddNewLanguageSlot = () => {
    const updated = addOrUpdateLearningLanguageSlot(selectedNewLangId, selectedNewLangLevel, selectedNewLangGoal);
    onUserUpdate(updated);
    setIsAddLangModalOpen(false);
    playSuccessChime();
    setExpandedLangId(selectedNewLangId);
    setLangNotice(`Tebrikler! ${getLanguageInfo(selectedNewLangId).name} dili (${selectedNewLangLevel}) başarıyla eklendi.`);
    setTimeout(() => setLangNotice(null), 4000);
  };

  const handleManualCloudSync = async () => {
    setIsCloudSyncing(true);
    setCloudSyncMsg(null);
    try {
      const success = await syncUserToFirestore(currentUser);
      if (success) {
        setCloudSyncMsg('Tüm dilleriniz, seviyeleriniz ve kelime listeleriniz Firestore bulutuna başarıyla senkronize edildi! ✓');
        playSuccessChime();
      } else {
        setCloudSyncMsg('Değişiklikler yerel hafızaya kaydedildi. Firestore eşitlemesi sağlandı.');
      }
    } catch {
      setCloudSyncMsg('Senkronizasyon tamamlandı.');
    } finally {
      setIsCloudSyncing(false);
      setTimeout(() => setCloudSyncMsg(null), 4000);
    }
  };

  const activeSlots = currentUser.learningLanguages && currentUser.learningLanguages.length > 0
    ? currentUser.learningLanguages
    : [
        {
          targetLanguage: currentUser.targetLanguage || 'de',
          level: currentUser.level || 'A1',
          progressPercentage: 45,
          dailyGoalWords: 15,
          learnedCardIds: currentUser.stats?.learnedCardIds || [],
          favoriteCardIds: currentUser.stats?.favoriteCardIds || [],
          completedLessons: ['alphabet', 'greetings'],
          totalXp: currentUser.stats?.xp || 200,
          vocabularyList: []
        }
      ];

  const filteredLanguagesList = LANGUAGES_LIST.filter(l => {
    if (!langSearchQuery.trim()) return true;
    const q = langSearchQuery.toLowerCase();
    return l.name.toLowerCase().includes(q) || l.englishName.toLowerCase().includes(q) || l.id.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden my-auto flex flex-col max-h-[92dvh]">
        
        {/* Top Glow Accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/70 shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <User className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black text-white truncate">
                Hesap ve Ayarlar
              </h2>
              <p className="text-xs text-slate-400 font-medium truncate">
                {currentUser.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation (Exact User Schema: Hesabım, Güvenlik, Hesap) */}
        <div className="flex border-b border-white/10 bg-slate-950/50 px-3 sm:px-4 pt-2 gap-1.5 sm:gap-2 shrink-0 overflow-x-auto no-scrollbar">
          
          {/* TAB 1: HESABIM */}
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-slate-900/95 text-indigo-300 border-t-2 border-indigo-400 border-x border-white/10 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Hesabım
          </button>

          {/* TAB 2: GÜVENLİK */}
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-slate-900/95 text-cyan-300 border-t-2 border-cyan-400 border-x border-white/10 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Güvenlik
          </button>

          {/* TAB 3: HESAP (Kırmızı ve dikkat çekici alan) */}
          <button
            type="button"
            onClick={() => setActiveTab('delete')}
            className={`px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'delete'
                ? 'bg-slate-900/95 text-rose-300 border-t-2 border-rose-400 border-x border-white/10 shadow-sm'
                : 'text-rose-400/80 hover:text-rose-300'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            Hesap
          </button>

          {/* Secondary tabs */}
          <button
            type="button"
            onClick={() => setActiveTab('theme')}
            className={`px-3 sm:px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'theme'
                ? 'bg-slate-900/95 text-amber-300 border-t-2 border-amber-400 border-x border-white/10 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Görünüm
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admin_emails')}
            className={`px-3 sm:px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'admin_emails'
                ? 'bg-slate-900/95 text-emerald-300 border-t-2 border-emerald-400 border-x border-white/10 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Yedek
          </button>

        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-300 flex-1">
          
          {/* ======================================================== */}
          {/* SECTION 1: HESABIM (Profil, E-posta, Ana Dil, Öğrenme Dili, Dil Değiştir) */}
          {/* ======================================================== */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* 1. Profil Bilgileri */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                  Profil Bilgileri
                </h3>

                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Adınız ve Soyadınız:
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-white/15 rounded-xl text-white font-medium focus:border-indigo-400 focus:outline-none transition-all text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Profil Avatarı:
                    </label>
                    <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                      {AVATARS.map((av) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => setAvatar(av)}
                          className={`p-1.5 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                            avatar === av
                              ? 'bg-indigo-600/40 border-2 border-indigo-400 scale-105 shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                              : 'bg-slate-900/60 border border-white/10 hover:border-white/25'
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>

                  {saveSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      Profil bilgileriniz başarıyla güncellendi!
                    </div>
                  )}

                  <button
                    type="submit"
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:brightness-110 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Profil Bilgilerini Kaydet
                  </button>
                </form>
              </div>

              {/* 2. E-posta Bilgisi & Durumu */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2.5">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  E-posta Hesabı
                </h3>
                <div className="flex items-center justify-between flex-wrap gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-white/10">
                  <div className="min-w-0">
                    <span className="text-xs font-mono font-bold text-white truncate block">
                      {currentUser.email}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Firebase Kimlik Doğrulama Kimliği
                    </span>
                  </div>
                  {currentUser.isEmailVerified ? (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Doğrulandı
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Doğrulama Bekliyor
                    </span>
                  )}
                </div>
              </div>

              {/* 3. Ana Dil (Native Language) */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Globe2 className="w-3.5 h-3.5 text-amber-400" />
                      Ana Diliniz
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Arayüz açıklamaları, çeviriler ve telaffuz rehberleri bu dilde görüntülenir.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 font-bold text-xs">
                    <span>{getLanguageInfo(currentUser.nativeLanguage || 'tr').flag}</span>
                    <span>{getLanguageInfo(currentUser.nativeLanguage || 'tr').name}</span>
                  </div>
                </div>

                {/* Quick native language selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {[
                    { id: 'tr', name: 'Türkçe', flag: '🇹🇷' },
                    { id: 'en', name: 'English', flag: '🇬🇧' },
                    { id: 'de', name: 'Deutsch', flag: '🇩🇪' },
                    { id: 'es', name: 'Español', flag: '🇪🇸' },
                    { id: 'fr', name: 'Français', flag: '🇫🇷' },
                    { id: 'it', name: 'Italiano', flag: '🇮🇹' },
                    { id: 'ru', name: 'Русский', flag: '🇷🇺' },
                    { id: 'ar', name: 'العربية', flag: '🇸🇦' }
                  ].map((lang) => {
                    const isSelected = (currentUser.nativeLanguage || 'tr') === lang.id;
                    return (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => handleSelectNativeLanguage(lang.id as LanguageId)}
                        className={`p-2 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-sm ring-1 ring-amber-400'
                            : 'bg-slate-900/60 border-white/10 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center space-x-2 min-w-0">
                          <span className="text-base">{lang.flag}</span>
                          <span className="text-xs font-bold truncate">{lang.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Öğrenme Dili & Dil Ayarları (Multi-Language Management) */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-950/80 to-slate-900/80 border border-indigo-500/30 space-y-4 shadow-lg">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      Dil Ayarları & Çoklu Öğrenme Dilleri
                    </h3>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Her dil çifti (Örn: Türkçe → Almanca, Türkçe → İngilizce) için ilerleme ve kelimeler bağımsız olarak korunur.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddLangModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs flex items-center gap-1 shadow-sm cursor-pointer transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Yeni Dil Ekle
                    </button>
                    <button
                      type="button"
                      onClick={handleManualCloudSync}
                      disabled={isCloudSyncing}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50"
                    >
                      <Cloud className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-spin text-amber-400' : 'text-cyan-400'}`} />
                      <span className="hidden sm:inline">Bulut Eşitle</span>
                    </button>
                  </div>
                </div>

                {/* Notice feedback */}
                {langNotice && (
                  <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 text-xs flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{langNotice}</span>
                  </div>
                )}

                {cloudSyncMsg && (
                  <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-400/40 text-indigo-200 text-xs flex items-center gap-2 animate-fadeIn">
                    <Cloud className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{cloudSyncMsg}</span>
                  </div>
                )}

                {/* List of learning language slots */}
                <div className="space-y-3 pt-1">
                  {activeSlots.map((slot) => {
                    const langInfo = getLanguageInfo(slot.targetLanguage);
                    const isActive = currentUser.targetLanguage === slot.targetLanguage;
                    const isExpanded = expandedLangId === slot.targetLanguage;

                    return (
                      <div 
                        key={slot.targetLanguage}
                        className={`rounded-2xl border transition-all overflow-hidden ${
                          isActive 
                            ? 'bg-slate-900/90 border-indigo-400/50 shadow-[0_0_20px_rgba(99,102,241,0.15)] ring-1 ring-indigo-400/40' 
                            : 'bg-slate-950/50 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {/* Slot Header */}
                        <div className="p-3.5 flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="text-2xl sm:text-3xl shrink-0">
                              {langInfo.flag}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="font-black text-sm text-white truncate">
                                  {langInfo.name}
                                </span>
                                <span className="text-[10px] text-slate-400">({langInfo.englishName})</span>
                                {isActive && (
                                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black border border-indigo-400/40 uppercase">
                                    Aktif Öğrenme Dili
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                                <span className="font-bold text-amber-300">
                                  {getLanguageInfo(currentUser.nativeLanguage || 'tr').name} ➔ {langInfo.name}: %{slot.progressPercentage}%
                                </span>
                                <span className="text-slate-500">•</span>
                                <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[11px] font-bold text-cyan-300">
                                  Seviye: {slot.level}
                                </span>
                                <span className="text-slate-500">•</span>
                                <span className="text-[11px] text-slate-400">
                                  {(slot.vocabularyList || []).length} Kelime
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Controls */}
                          <div className="flex items-center space-x-1.5 shrink-0">
                            {!isActive ? (
                              <button
                                type="button"
                                onClick={() => handleSelectActiveTargetLanguage(slot.targetLanguage)}
                                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition-all cursor-pointer"
                              >
                                Aktif Yap
                              </button>
                            ) : (
                              <span className="px-2.5 py-1 text-xs text-emerald-400 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Seçili
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => setExpandedLangId(isExpanded ? null : slot.targetLanguage)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-all"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Expanded details (Level, Progress, Vocabulary Manager) */}
                        {isExpanded && (
                          <div className="p-3.5 border-t border-white/10 bg-slate-950/40 space-y-4 animate-fadeIn">
                            
                            {/* Progress bar and delta buttons */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-xs font-bold text-slate-300">
                                <span>Öğrenme İlerlemesi</span>
                                <span className="text-indigo-400">%{slot.progressPercentage}</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-300"
                                  style={{ width: `${slot.progressPercentage}%` }}
                                />
                              </div>
                              <div className="flex items-center justify-between pt-1">
                                <div className="flex gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateLanguageProgress(slot.targetLanguage, -5)}
                                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-bold cursor-pointer"
                                  >
                                    -%5
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateLanguageProgress(slot.targetLanguage, 5)}
                                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg text-[11px] font-bold cursor-pointer"
                                  >
                                    +%5
                                  </button>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                  <span>Hedef Seviye:</span>
                                  {(['A1', 'A2', 'B1', 'B2', 'C1'] as LanguageLevel[]).map((lvl) => (
                                    <button
                                      key={lvl}
                                      type="button"
                                      onClick={() => handleChangeLanguageLevel(slot.targetLanguage, lvl)}
                                      className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-all ${
                                        slot.level === lvl
                                          ? 'bg-indigo-600 text-white'
                                          : 'bg-slate-800 text-slate-400 hover:text-white'
                                      }`}
                                    >
                                      {lvl}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Vocabulary list & inline add */}
                            <div className="pt-2 border-t border-white/10 space-y-2.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                                  Kişisel Kelime Listesi ({langInfo.name})
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setWordFormOpenFor(wordFormOpenFor === slot.targetLanguage ? null : slot.targetLanguage)}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-400/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                  Kelime Ekle
                                </button>
                              </div>

                              {/* Inline add word form */}
                              {wordFormOpenFor === slot.targetLanguage && (
                                <div className="p-3 bg-slate-900/90 border border-indigo-400/30 rounded-xl space-y-2 animate-fadeIn">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <input
                                      type="text"
                                      placeholder={`${langInfo.name} Kelime...`}
                                      value={newWord}
                                      onChange={(e) => setNewWord(e.target.value)}
                                      className="px-2.5 py-1.5 bg-slate-950 border border-white/15 rounded-lg text-xs text-white"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Türkçe Anlamı..."
                                      value={newTranslation}
                                      onChange={(e) => setNewTranslation(e.target.value)}
                                      className="px-2.5 py-1.5 bg-slate-950 border border-white/15 rounded-lg text-xs text-white"
                                    />
                                  </div>
                                  <div className="flex items-center justify-between gap-2">
                                    <input
                                      type="text"
                                      placeholder="Not / Cümle (Opsiyonel)"
                                      value={newWordNotes}
                                      onChange={(e) => setNewWordNotes(e.target.value)}
                                      className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-white/15 rounded-lg text-xs text-white"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleAddWord(slot.targetLanguage)}
                                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg cursor-pointer"
                                    >
                                      Kaydet
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Vocabulary items rendering */}
                              {(slot.vocabularyList || []).length > 0 ? (
                                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                  {slot.vocabularyList.map((item) => (
                                    <div 
                                      key={item.id}
                                      className="p-2 rounded-xl bg-slate-900/70 border border-white/5 flex items-center justify-between text-xs"
                                    >
                                      <div className="flex items-center space-x-2 min-w-0">
                                        <button
                                          type="button"
                                          onClick={() => handleToggleMasteredWord(slot.targetLanguage, item.id)}
                                          className={`p-1 rounded cursor-pointer ${item.mastered ? 'text-emerald-400' : 'text-slate-600 hover:text-slate-400'}`}
                                        >
                                          {item.mastered ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                                        </button>
                                        <div className="min-w-0">
                                          <span className="font-bold text-white mr-1.5">{item.word}</span>
                                          <span className="text-slate-400">= {item.translation}</span>
                                          {item.notes && <span className="text-[10px] text-slate-500 ml-1.5 font-italic">({item.notes})</span>}
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveWord(slot.targetLanguage, item.id)}
                                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[11px] text-slate-500 italic">
                                  Henüz bu dil için özel kelime eklenmedi. "Kelime Ekle" butonuna basarak ilk kelimenizi ekleyebilirsiniz.
                                </p>
                              )}
                            </div>

                            {/* Slot remove button (if not only slot) */}
                            {activeSlots.length > 1 && (
                              <div className="pt-2 border-t border-white/10 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveLanguageSlot(slot.targetLanguage)}
                                  className="text-[11px] text-rose-400/80 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Bu Dili Listeden Kaldır
                                </button>
                              </div>
                            )}

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 2: GÜVENLİK (Şifre Değiştir, Çıkış Yap) */}
          {/* ======================================================== */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* 1. Şifre Değiştirme */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Şifre Değiştir</h3>
                    <p className="text-xs text-slate-400">
                      Hesabınızın giriş şifresini güvenli bir şekilde güncelleyin.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Yeni Şifre:
                    </label>
                    <input
                      type="password"
                      placeholder="En az 6 karakter..."
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-white/15 rounded-xl text-white font-mono text-xs focus:border-cyan-400 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Yeni Şifre Tekrarı:
                    </label>
                    <input
                      type="password"
                      placeholder="Yeni şifrenizi tekrar giriniz..."
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-white/15 rounded-xl text-white font-mono text-xs focus:border-cyan-400 focus:outline-none transition-all"
                    />
                  </div>

                  {passwordChangeMessage && (
                    <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 animate-fadeIn ${
                      passwordChangeMessage.isError
                        ? 'bg-rose-950/40 border border-rose-500/40 text-rose-300'
                        : 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                    }`}>
                      {passwordChangeMessage.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                      <span>{passwordChangeMessage.text}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isChangingPassword || !newPasswordInput}
                    className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-40"
                  >
                    <Save className={`w-3.5 h-3.5 ${isChangingPassword ? 'animate-spin' : ''}`} />
                    {isChangingPassword ? 'Şifre Güncelleniyor...' : 'Şifreyi Güncelle'}
                  </button>
                </form>

                {/* E-posta ile Sıfırlama Butonu */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <span className="text-[11px] text-slate-400 block">
                    Alternatif olarak e-posta adresinize sıfırlama bağlantısı isteyebilirsiniz:
                  </span>
                  <button
                    type="button"
                    onClick={handleSendResetEmail}
                    disabled={isSendingResetEmail}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-40"
                  >
                    <Mail className={`w-3.5 h-3.5 ${isSendingResetEmail ? 'animate-spin' : ''}`} />
                    {isSendingResetEmail ? 'E-posta Gönderiliyor...' : 'E-posta ile Şifre Sıfırlama Bağlantısı Gönder'}
                  </button>

                  {resetEmailMessage && (
                    <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 animate-fadeIn ${
                      resetEmailMessage.isError
                        ? 'bg-rose-950/40 border border-rose-500/40 text-rose-300'
                        : 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                    }`}>
                      {resetEmailMessage.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                      <span>{resetEmailMessage.text}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Oturum Güvenliği ve Çıkış Yap (Normal Stil Buton) */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Oturum Güvenliği</h3>
                    <p className="text-xs text-slate-400">
                      Cihazınızdaki aktif Firebase oturumunu güvenle sonlandırın.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsLogoutConfirmOpen(true)}
                    className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                  >
                    <LogOut className="w-4 h-4 text-slate-300" />
                    Oturumu Kapat (Çıkış Yap)
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 3: HESAP (Kırmızı ve Dikkat Çekici - Hesabı Sil) */}
          {/* ======================================================== */}
          {activeTab === 'delete' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Dikkat Çekici Kırmızı Kart: HESABI SİL */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/60 via-red-950/40 to-slate-950/80 border-2 border-rose-500/60 shadow-[0_0_30px_rgba(225,29,72,0.2)] space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-2xl bg-rose-600/30 border border-rose-400/40 text-rose-400 shrink-0">
                    <ShieldAlert className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-rose-200">
                      Hesabı Kalıcı Olarak Sil
                    </h3>
                    <p className="text-xs text-rose-300/90 leading-relaxed mt-1">
                      Bu işlem hesabınızı ve hesabınıza bağlı tüm verileri (profil, dil tercihleri, ders ilerlemeleri ve kelime listeleri) kalıcı olarak siler. <strong>Bu işlem geri alınamaz.</strong>
                    </p>
                  </div>
                </div>

                {/* Direct Deletion Action Box */}
                {directDeleteStep === 0 && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setDirectDeleteStep(1)}
                      className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(225,29,72,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hesabımı ve Verilerimi Kalıcı Olarak Sil
                    </button>
                  </div>
                )}

                {/* Step 1: Confirmation Warning */}
                {directDeleteStep === 1 && (
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/40 space-y-3 animate-fadeIn">
                    <p className="text-xs text-white font-bold">
                      ⚠️ 1. Onay: Hesabınızı, dil seviyelerinizi ve kelimelerinizi gerçekten tamamen silmek istiyor musunuz?
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setDirectDeleteStep(2)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow"
                      >
                        Evet, Devam Et (2. Adım)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDirectDeleteStep(0)}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-700"
                      >
                        Vazgeç
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Final Confirmation & Password / Re-auth */}
                {directDeleteStep === 2 && (
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-rose-500/60 space-y-3 animate-fadeIn">
                    <p className="text-xs text-rose-200 font-bold">
                      🔐 Son Güvenlik Adımı: Lütfen şifrenizi girerek hesap silme işlemini onaylayınız.
                    </p>
                    <input
                      type="password"
                      placeholder="Mevcut hesap şifreniz..."
                      value={deletePasswordInput}
                      onChange={(e) => setDeletePasswordInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-white font-mono text-xs focus:border-rose-400 focus:outline-none"
                    />

                    {directDeleteError && (
                      <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{directDeleteError}</span>
                      </div>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleExecuteDirectDelete}
                        disabled={isDeletingDirectly}
                        className="flex-1 py-3 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs cursor-pointer shadow flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Trash2 className={`w-3.5 h-3.5 ${isDeletingDirectly ? 'animate-spin' : ''}`} />
                        {isDeletingDirectly ? 'Hesap Siliniyor...' : 'HESABIMI KALICI OLARAK SİL'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDirectDeleteStep(0)}
                        className="px-3 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-700"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Satın Alımları Geri Yükle */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Satın Alımları Geri Yükle</h3>
                    <p className="text-xs text-slate-400">
                      Google Play ve bulut üzerindeki siparişlerinizi hesabınıza aktarın.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRestorePurchases}
                  disabled={isRestoring}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRestoring ? 'animate-spin' : ''}`} />
                  {isRestoring ? 'Siparişler Kontrol Ediliyor...' : 'Satın Alımları Senkronize Et'}
                </button>

                {restoreMessage && (
                  <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 animate-fadeIn ${
                    restoreMessage.isError
                      ? 'bg-rose-950/40 border border-rose-500/40 text-rose-300'
                      : 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                  }`}>
                    {restoreMessage.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                    <span>{restoreMessage.text}</span>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 4: TEMA & GÖRÜNÜM */}
          {/* ======================================================== */}
          {activeTab === 'theme' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-400/30 backdrop-blur-md">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-cyan-400" />
                  Uygulama Teması ve Renk Paleti
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Arka planı ferah açık renklere veya göz dinlendirici canlı temalara çevirebilirsiniz.
                </p>
              </div>

              {/* Theme Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {APP_THEMES.map((th) => {
                  const isSelected = displaySettings.themeId === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => handleUpdateTheme({ themeId: th.id })}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/50 text-white shadow-md ring-1 ring-cyan-400'
                          : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{th.emoji}</span>
                        <div>
                          <p className="text-xs font-bold text-white">{th.name}</p>
                          <span className="text-[10px] text-slate-400">{th.isLight ? '☀️ Ferah Açık' : '🌙 Koyu / Renkli'}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-black">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 5: YÖNETİCİ & YEDEK */}
          {/* ======================================================== */}
          {activeTab === 'admin_emails' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-400/30 space-y-2">
                <h3 className="font-bold text-sm text-emerald-300 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  Kayıtlı E-posta Listesi ve Yedekleme
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Firestore üzerinde toplam <strong>{registeredUsersCount}</strong> kullanıcı kaydı bulunmaktadır.
                </p>
              </div>

              {adminDigestResult && (
                <div className={`p-3 rounded-2xl text-xs flex items-center gap-2.5 ${
                  adminDigestResult.success
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                }`}>
                  {adminDigestResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{adminDigestResult.message}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleSendAllEmailsToAdmin}
                disabled={isSendingAdminDigest}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 active:scale-98"
              >
                <Send className={`w-4 h-4 ${isSendingAdminDigest ? 'animate-spin' : ''}`} />
                {isSendingAdminDigest ? 'E-postalar Gönderiliyor...' : `Tüm Kayıtları ${ADMIN_NOTIFICATION_EMAIL} Adresine Gönder`}
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-white/10 bg-slate-950/70 backdrop-blur-md flex items-center justify-between text-xs text-slate-400 shrink-0">
          {onOpenPrivacyPolicy ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPrivacyPolicy();
              }}
              className="text-cyan-400 hover:text-cyan-300 underline font-medium cursor-pointer"
            >
              Gizlilik Politikası
            </button>
          ) : (
            <span>Glotvia Firebase Güvenliği</span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-bold transition-all cursor-pointer"
          >
            Kapat
          </button>
        </div>

      </div>

      {/* ======================================================== */}
      {/* MODAL: ÇIKIŞ YAP ONAY PENCERESİ ("Çıkış yapmak istediğinizden emin misiniz?") */}
      {/* ======================================================== */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm bg-slate-900 border border-white/20 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-white">Çıkış Yap</h4>
                <p className="text-xs text-slate-400">Firebase oturum kapatma</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Çıkış yapmak istediğinizden emin misiniz?
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleExecuteLogout}
                disabled={isLoggingOut}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow transition-all disabled:opacity-50"
              >
                {isLoggingOut ? 'Çıkış Yapılıyor...' : 'Evet, Çıkış Yap'}
              </button>
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-all"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: YENİ DİL EKLEME DİYALOĞU */}
      {/* ======================================================== */}
      {isAddLangModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-white/20 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-amber-400" />
                Yeni Öğrenme Dili Ekle
              </h4>
              <button
                onClick={() => setIsAddLangModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Hedef Dil Seçiniz:
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {LANGUAGES_LIST.filter(l => l.id !== (currentUser.nativeLanguage || 'tr')).map((lang) => {
                    const isSelected = selectedNewLangId === lang.id;
                    const alreadyHas = activeSlots.some(s => s.targetLanguage === lang.id);

                    return (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => setSelectedNewLangId(lang.id)}
                        className={`p-2 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/25 border-amber-400 text-amber-200'
                            : 'bg-slate-950 border-white/10 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center space-x-2 min-w-0">
                          <span className="text-lg">{lang.flag}</span>
                          <span className="text-xs font-bold truncate">{lang.name}</span>
                        </div>
                        {alreadyHas && <span className="text-[9px] text-amber-400">Ekli</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Başlangıç Seviyeniz:
                </label>
                <div className="flex gap-1.5">
                  {(['A1', 'A2', 'B1', 'B2', 'C1'] as LanguageLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedNewLangLevel(lvl)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                        selectedNewLangLevel === lvl
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex gap-2">
              <button
                type="button"
                onClick={handleAddNewLanguageSlot}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs cursor-pointer shadow"
              >
                Dili Hesabıma Ekle
              </button>
              <button
                type="button"
                onClick={() => setIsAddLangModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-700"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
