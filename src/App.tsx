import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import { 
  getCurrentUser, 
  isUserLoggedIn, 
  setLoggedInState,
  setCurrentUser as saveLocalCurrentUser
} from './utils/authStorage';
import { GermanCurriculumView } from './components/GermanCurriculumView';
import { AuthPortal } from './components/AuthPortal';
import { SimulatedEmailNotificationToast } from './components/SimulatedEmailNotificationToast';
import { PaymentModal } from './components/PaymentModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { AccountSettingsModal } from './components/AccountSettingsModal';
import { AccountDeletionConfirmationModal } from './components/AccountDeletionConfirmationModal';
import { PasswordResetModal } from './components/PasswordResetModal';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';
import { initializeAppTheme } from './utils/themeManager';
import { syncUserToFirestore, getUserFromFirestore } from './services/firebaseDbService';
import { checkEmailVerifiedStatus, subscribeToAuthChanges, signOutUser } from './services/authenticationService';
import { X, Mail, ShieldAlert, CheckCircle2, ArrowRight, Sparkles, BookOpen, GraduationCap, ShieldCheck, Globe, LogOut } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return isUserLoggedIn() ? getCurrentUser() : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isUserLoggedIn() && !!getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentModalTab, setPaymentModalTab] = useState<'plans' | 'credits'>('plans');
  const [paymentCreditPkgId, setPaymentCreditPkgId] = useState<string | undefined>(undefined);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isAccountSettingsModalOpen, setIsAccountSettingsModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Initialize theme engine immediately on app mount
  useEffect(() => {
    initializeAppTheme();
  }, []);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (fbUser) => {
      if (fbUser && fbUser.email) {
        const cleanEmail = fbUser.email.toLowerCase();
        let profile = await getUserFromFirestore(cleanEmail);
        if (!profile) {
          const localUser = getCurrentUser();
          if (localUser && localUser.email?.toLowerCase() === cleanEmail) {
            profile = localUser;
          }
        }
        if (profile) {
          const updatedProfile = {
            ...profile,
            id: fbUser.uid || profile.id,
            email: cleanEmail,
            isEmailVerified: fbUser.emailVerified || profile.isEmailVerified
          };
          setCurrentUser(updatedProfile);
          setIsAuthenticated(true);
          setLoggedInState(true);
          saveLocalCurrentUser(updatedProfile);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // URL-based Token Deletion Confirmation
  const [deletionTokenModal, setDeletionTokenModal] = useState<{
    isOpen: boolean;
    token: string;
    tokenId?: string;
  }>({
    isOpen: false,
    token: '',
    tokenId: ''
  });

  // URL-based Password Reset Modal
  const [passwordResetModal, setPasswordResetModal] = useState<{
    isOpen: boolean;
    email: string;
  }>({
    isOpen: false,
    email: ''
  });

  // Check URL query parameters for action tokens
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const action = urlParams.get('action');
      const token = urlParams.get('token');
      const id = urlParams.get('id') || undefined;
      const emailParam = urlParams.get('email') || '';

      if (action === 'confirm_delete_account' && token) {
        setDeletionTokenModal({
          isOpen: true,
          token,
          tokenId: id
        });
      } else if (action === 'reset_password' && emailParam) {
        setPasswordResetModal({
          isOpen: true,
          email: emailParam
        });
      }
    }
  }, []);

  const handleOpenPricing = (tab: 'plans' | 'credits' = 'plans', packageId?: string) => {
    setPaymentModalTab(tab);
    setPaymentCreditPkgId(packageId);
    setIsPaymentModalOpen(true);
  };

  // Sync with Firestore Cloud Database on load & periodic email verification check
  useEffect(() => {
    if (currentUser?.email) {
      // Sync local profile to Firestore
      syncUserToFirestore(currentUser).catch((e) => console.warn('Firestore sync background:', e));

      // Check if user has remote cloud updates (e.g. active subscription or email verified)
      getUserFromFirestore(currentUser.email).then((cloudUser) => {
        if (cloudUser) {
          const merged = { ...currentUser, ...cloudUser };
          if (cloudUser.isPremium !== currentUser.isPremium || cloudUser.isEmailVerified !== currentUser.isEmailVerified) {
            setCurrentUser(merged);
            saveLocalCurrentUser(merged);
          }
        }
      }).catch((e) => console.warn('Firestore fetch background:', e));
    }
  }, [currentUser?.email]);

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setLoggedInState(true);
    setIsAuthModalOpen(false);
    saveLocalCurrentUser(user);
    syncUserToFirestore(user).catch(console.warn);
  };

  const handlePaymentSuccess = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    saveLocalCurrentUser(updatedUser);
    syncUserToFirestore(updatedUser).catch(console.warn);
  };

  const handleUserUpdate = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    saveLocalCurrentUser(updatedUser);
    syncUserToFirestore(updatedUser).catch(console.warn);
  };

  const handleLogout = async () => {
    await signOutUser();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoggedInState(false);
  };

  const handleAccountDeleted = () => {
    signOutUser();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoggedInState(false);
    setDeletionTokenModal({ isOpen: false, token: '', tokenId: '' });
    // Clean URL
    if (typeof window !== 'undefined' && window.history) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  return (
    <div translate="no" className="notranslate app-root-container relative min-h-screen w-full max-w-full overflow-x-hidden flex flex-col transition-colors duration-300">
      
      {/* Real-Time Email Notification Toast */}
      <SimulatedEmailNotificationToast />

      {/* Global Email Verification Notice Banner (if user logged in but not yet verified) */}
      {isAuthenticated && currentUser && !currentUser.isEmailVerified && (
        <div className="w-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-b border-amber-500/30 px-3 py-2 text-xs text-amber-200 flex flex-wrap items-center justify-between gap-2 z-30">
          <div className="flex items-center gap-2 min-w-0">
            <Mail className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
            <span className="truncate">
              E-posta adresiniz henüz doğrulanmadı. (<strong>{currentUser.email}</strong>)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold text-[11px] transition-all shrink-0 cursor-pointer shadow flex items-center gap-1"
          >
            <span>Şimdi Doğrula</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main App Content or Firebase Login Gate */}
      {isAuthenticated && currentUser ? (
        /* Primary View: Turkish to German Learning Curriculum (Step 1 -> Step 2) */
        <GermanCurriculumView
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenPricing={handleOpenPricing}
          onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
          onOpenAccountSettings={() => setIsAccountSettingsModalOpen(true)}
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
          onUserUpdate={handleUserUpdate}
        />
      ) : (
        /* Full-Screen Firebase Authentication Landing Screen */
        <div className="min-h-screen w-full flex flex-col justify-between relative overflow-hidden bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
          
          {/* Ambient Liquid Aura Lights */}
          <div className="liquid-aura-bg">
            <div className="liquid-orb-cyan" />
            <div className="liquid-orb-purple" />
            <div className="liquid-orb-amber" />
          </div>

          {/* Top Bar */}
          <header className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 font-black text-xl">
                🇩🇪
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-black text-lg sm:text-xl text-white tracking-tight">GLOTVİA</span>
                  <span className="px-2 py-0.5 bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[10px] font-extrabold rounded-md uppercase">
                    Firebase Auth
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Almanca A1-B1 İnteraktif Öğrenme Platformu</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsThemeModalOpen(true)}
                className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>🎨 Tema</span>
              </button>
            </div>
          </header>

          {/* Center Stage: Split Screen on Desktop, Stacked on Mobile */}
          <main className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 py-4 flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14">
            
            {/* Left Hero Pitch */}
            <div className="flex-1 space-y-5 text-center lg:text-left max-w-lg lg:max-w-none">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-cyan-500/10 border border-cyan-400/30 rounded-2xl text-xs font-bold text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Goethe Enstitüsü A1-B1 Sınav ve Müfredat Uyumu</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Almancayı <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">Akıcı & Kalıcı</span> Olarak Öğrenin
              </h1>

              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                Uygulamayı kullanmak için lütfen Firebase hesabınızla giriş yapın veya yeni bir hesap oluşturun. E-posta onayınızla birlikte kişiselleştirilmiş müfredatınız anında hazır olur.
              </p>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-slate-900/70 border border-white/10 rounded-2xl flex items-center space-x-3 backdrop-blur-md">
                  <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-xl">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">Adım Adım Müfredat</div>
                    <div className="text-[11px] text-slate-400">Fiiller, Edatlar, A1 Sınavı</div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-900/70 border border-white/10 rounded-2xl flex items-center space-x-3 backdrop-blur-md">
                  <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">Goethe Sprechen</div>
                    <div className="text-[11px] text-slate-400">Sesli Sınav Kartları & AI</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Authentication Card */}
            <div className="w-full max-w-md shrink-0">
              <AuthPortal
                currentUser={currentUser}
                isAuthenticated={isAuthenticated}
                onLoginSuccess={handleAuthSuccess}
                onLogout={handleLogout}
                onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
              />
            </div>

          </main>

          {/* Footer */}
          <footer className="relative z-10 border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-4 text-center text-xs text-slate-500">
            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-400">GLOTVİA</span> • Güvenli Firebase Kimlik Doğrulaması
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="text-slate-400 hover:text-cyan-300 underline transition-colors cursor-pointer"
                >
                  Gizlilik Politikası
                </button>
                <span>© 2026</span>
              </div>
            </div>
          </footer>

        </div>
      )}

      {/* Theme & Display Customizer Modal */}
      {isThemeModalOpen && (
        <ThemeCustomizerModal
          isOpen={isThemeModalOpen}
          onClose={() => setIsThemeModalOpen(false)}
        />
      )}

      {/* Payment & Subscription Checkout Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          currentUser={currentUser || getCurrentUser()}
          onPaymentSuccess={handlePaymentSuccess}
          onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
          initialTab={paymentModalTab}
          initialCreditPackageId={paymentCreditPkgId}
        />
      )}

      {/* Account Settings & In-App Deletion Modal */}
      {isAccountSettingsModalOpen && currentUser && (
        <AccountSettingsModal
          isOpen={isAccountSettingsModalOpen}
          onClose={() => setIsAccountSettingsModalOpen(false)}
          currentUser={currentUser}
          onUserUpdate={handleUserUpdate}
          onAccountDeleted={handleAccountDeleted}
          onLogout={handleLogout}
          onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
        />
      )}

      {/* Privacy Policy & Data Safety Modal */}
      {isPrivacyModalOpen && (
        <PrivacyPolicyModal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
          onOpenAccountSettings={() => {
            if (currentUser) {
              setIsAccountSettingsModalOpen(true);
            } else {
              setIsAuthModalOpen(true);
            }
          }}
        />
      )}

      {/* URL-based Account Deletion Confirmation Modal */}
      {deletionTokenModal.isOpen && (
        <AccountDeletionConfirmationModal
          isOpen={deletionTokenModal.isOpen}
          token={deletionTokenModal.token}
          tokenId={deletionTokenModal.tokenId}
          onClose={() => setDeletionTokenModal({ isOpen: false, token: '', tokenId: '' })}
          onSuccess={handleAccountDeleted}
        />
      )}

      {/* URL-based Password Reset Modal */}
      {passwordResetModal.isOpen && (
        <PasswordResetModal
          isOpen={passwordResetModal.isOpen}
          email={passwordResetModal.email}
          onClose={() => {
            setPasswordResetModal({ isOpen: false, email: '' });
            if (typeof window !== 'undefined' && window.history) {
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          }}
          onSuccess={() => {
            setPasswordResetModal({ isOpen: false, email: '' });
            setIsAuthModalOpen(true);
            if (typeof window !== 'undefined' && window.history) {
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          }}
        />
      )}

      {/* Auth Modal (Kayıt Ol / Giriş Yap) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-md my-auto">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute -top-2.5 -right-2.5 z-20 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 shadow-lg transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <AuthPortal
              currentUser={currentUser}
              isAuthenticated={isAuthenticated}
              onLoginSuccess={handleAuthSuccess}
              onLogout={handleLogout}
              onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
            />
          </div>
        </div>
      )}

    </div>
  );
}
