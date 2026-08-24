import React, { useState } from 'react';
import { UserProfile, LanguageId } from '../types';
import { LANGUAGES_LIST } from '../data/languagesData';
import { registerWithFirebase, loginWithFirebase, sendUserPasswordReset } from '../services/authenticationService';
import { EmailVerificationBox } from './EmailVerificationBox';
import { getI18n } from '../utils/i18n';
import { 
  X, Sparkles, LogIn, UserPlus, Mail, Lock, Eye, EyeOff, 
  User, Globe2, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, KeyRound 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  currentUser: UserProfile;
}

const AVATARS = ['🌟', '🚀', '🎓', '👑', '🦁', '🦊', '🦉', '🌍', '⚡', '💡', '💎', '🔥'];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentUser
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState<LanguageId>(currentUser.nativeLanguage || 'tr');
  const [targetLanguage, setTargetLanguage] = useState<LanguageId>(currentUser.targetLanguage || 'de');
  const [selectedAvatar, setSelectedAvatar] = useState('🚀');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  const t = getI18n(nativeLanguage);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }

    if (tab === 'login') {
      if (!password.trim()) {
        setErrorMsg('Lütfen şifrenizi giriniz.');
        return;
      }
      setLoading(true);
      const result = await loginWithFirebase(cleanEmail, password);
      setLoading(false);

      if (result.success && result.user) {
        setSuccessMsg(result.message);
        setTimeout(() => {
          onSuccess(result.user!);
          onClose();
        }, 500);
      } else {
        setErrorMsg(result.message);
      }
    } else {
      if (!name.trim()) {
        setErrorMsg('Lütfen adınızı ve soyadınızı giriniz.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Şifreniz en az 6 karakterden oluşmalıdır.');
        return;
      }
      if (nativeLanguage === targetLanguage) {
        setErrorMsg('Ana diliniz ile öğrenmek istediğiniz dil aynı olamaz.');
        return;
      }

      setLoading(true);
      const regRes = await registerWithFirebase(
        name.trim(),
        cleanEmail,
        password,
        targetLanguage,
        nativeLanguage,
        selectedAvatar
      );
      setLoading(false);

      if (regRes.success && regRes.user) {
        setSuccessMsg('Hesabınız oluşturuldu. E-posta adresinize gelen 6 haneli kodu doğrulayın.');
        setIsVerifyingCode(true);
      } else {
        setErrorMsg(regRes.message);
      }
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }

    setLoading(true);
    const result = await sendUserPasswordReset(cleanEmail);
    setLoading(false);

    if (result.success) {
      setSuccessMsg(result.message);
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleVerificationSuccess = (verifiedData?: any) => {
    setSuccessMsg('E-posta başarıyla doğrulandı!');
    loginWithFirebase(email.trim(), password).then(res => {
      if (res.user) {
        setTimeout(() => {
          onSuccess(res.user!);
          onClose();
        }, 500);
      } else {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-white relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isVerifyingCode ? (
          <EmailVerificationBox
            email={email.trim()}
            userName={name.trim() || email.split('@')[0]}
            purpose="register"
            onVerified={handleVerificationSuccess}
            onCancel={() => setIsVerifyingCode(false)}
          />
        ) : isForgotPassword ? (
          /* FORGOT PASSWORD SCREEN */
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-cyan-500/20 border border-cyan-400/30 rounded-2xl text-cyan-400 mb-1">
                <KeyRound className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-white">Şifremi Sıfırla</h2>
              <p className="text-xs text-slate-400">
                Kayıtlı e-posta adresinizi giriniz. Şifre sıfırlama bağlantısı e-posta adresinize gönderilecektir.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="adiniz@ornek.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:brightness-110 text-white font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                <span>Şifre Sıfırlama Bağlantısı Gönder</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors text-center cursor-pointer"
              >
                ← Giriş Ekranına Dön
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex p-3 bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl text-amber-400 mb-1">
                <Sparkles className="w-7 h-7 animate-pulse" />
              </div>
              <h2 className="text-2xl font-black text-white">
                {tab === 'login' ? t.loginBtn : t.createAccountBtn}
              </h2>
              <p className="text-xs text-slate-400">
                {tab === 'login' 
                  ? 'Tüm dillerdeki ilerlemenize, kartlarınıza ve skorlarınıza erişin.'
                  : 'Ücretsiz kaydolun, e-postanıza gelen kod ile hesabınızı aktifleştirin.'}
              </p>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => { setTab('login'); setErrorMsg(null); setSuccessMsg(null); }}
                className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  tab === 'login'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>{t.loginBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => { setTab('register'); setErrorMsg(null); setSuccessMsg(null); }}
                className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  tab === 'register'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Kayıt Ol</span>
              </button>
            </div>

            {/* Alerts */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'register' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    {t.fullName}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="Örn: Ufuk Yıldız"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {t.emailAddress}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="ornek@polyglot.app"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Şifre
                  </label>
                  {tab === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer font-semibold"
                    >
                      Şifremi Unuttum?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {tab === 'register' && (
                <>
                  {/* Dual Language Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        {t.nativeLanguageLabel}
                      </label>
                      <select
                        value={nativeLanguage}
                        onChange={(e) => setNativeLanguage(e.target.value as LanguageId)}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium cursor-pointer"
                      >
                        {LANGUAGES_LIST.map((lang) => (
                          <option key={lang.id} value={lang.id} className="bg-slate-900 text-white">
                            {lang.flag} {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                        {t.targetLanguageLabel}
                      </label>
                      <select
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value as LanguageId)}
                        className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-2.5 text-xs text-amber-300 focus:outline-none focus:border-amber-400 font-bold cursor-pointer"
                      >
                        {LANGUAGES_LIST.map((lang) => (
                          <option key={lang.id} value={lang.id} className="bg-slate-900 text-white">
                            {lang.flag} {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Avatar Selector */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      {t.chooseAvatar}
                    </label>
                    <div className="flex flex-wrap gap-1.5 p-2 bg-slate-950 border border-slate-800 rounded-xl">
                      {AVATARS.map((av) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => setSelectedAvatar(av)}
                          className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-transform cursor-pointer ${
                            selectedAvatar === av
                              ? 'bg-amber-500/30 border border-amber-400 scale-110'
                              : 'bg-slate-900 hover:bg-slate-800'
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                ) : tab === 'login' ? (
                  <LogIn className="w-4 h-4" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                <span>{tab === 'login' ? 'Giriş Yap ve Devam Et' : 'Kayıt Ol ve Kod Gönder'}</span>
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
};
