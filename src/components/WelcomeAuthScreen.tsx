import React, { useState } from 'react';
import { UserProfile, LanguageId } from '../types';
import { LANGUAGES_LIST } from '../data/languagesData';
import { registerWithFirebase, loginWithFirebase, sendUserPasswordReset } from '../services/authenticationService';
import { EmailVerificationBox } from './EmailVerificationBox';
import { getI18n } from '../utils/i18n';
import { ThemeCustomizerModal } from './ThemeCustomizerModal';
import { 
  Sparkles, LogIn, UserPlus, Mail, Lock, Eye, EyeOff, User, Globe2, ShieldCheck, 
  CheckCircle2, AlertCircle, ArrowRight, BookOpen, Layers, Flame,
  Award, PlayCircle, Star, KeyRound, RefreshCw, Palette
} from 'lucide-react';

interface WelcomeAuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

const AVATARS = ['🌟', '🚀', '🎓', '👑', '🦁', '🦊', '🦉', '🌍', '⚡', '💡', '💎', '🔥'];

export const WelcomeAuthScreen: React.FC<WelcomeAuthScreenProps> = ({ onLoginSuccess }) => {
  const [tab, setTab] = useState<'register' | 'login'>('register');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [interfaceLang, setInterfaceLang] = useState<LanguageId>('tr');
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nativeLang, setNativeLang] = useState<LanguageId>('tr');
  const [targetLang, setTargetLang] = useState<LanguageId>('de');
  const [avatar, setAvatar] = useState('🚀');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  const t = getI18n(interfaceLang);

  const handleInterfaceLanguageChange = (lang: LanguageId) => {
    setInterfaceLang(lang);
    setNativeLang(lang);
  };

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
        setTimeout(() => onLoginSuccess(result.user!), 400);
      } else {
        setErrorMsg(result.message);
      }
    } else {
      if (!name.trim()) {
        setErrorMsg('Lütfen adınızı ve soyadınızı eksiksiz giriniz.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Şifreniz en az 6 karakter uzunluğunda olmalıdır.');
        return;
      }
      if (nativeLang === targetLang) {
        setErrorMsg('Ana diliniz ve öğrenmek istediğiniz hedef dil aynı olamaz. Lütfen farklı diller seçiniz.');
        return;
      }

      setLoading(true);
      const regRes = await registerWithFirebase(
        name.trim(),
        cleanEmail,
        password,
        targetLang,
        nativeLang,
        avatar
      );
      setLoading(false);

      if (regRes.success && regRes.user) {
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
    setSuccessMsg('Hesabınız başarıyla oluşturuldu ve doğrulandı!');
    loginWithFirebase(email.trim(), password).then(res => {
      if (res.user) {
        setTimeout(() => onLoginSuccess(res.user!), 400);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-amber-500 selection:text-slate-950">
      
      {/* Background Decorative Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Language Selector */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-black text-xl">
            P
          </div>
          <div>
            <span className="font-black text-lg text-white tracking-tight">Polyglot<span className="text-amber-400">AI</span></span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold rounded-md">
              16 Dilli Sistem
            </span>
          </div>
        </div>

        {/* Action Cluster: Theme Customizer & Interface Language Dropdown */}
        <div className="flex items-center space-x-2">
          
          {/* Theme / Appearance Button */}
          <button
            type="button"
            onClick={() => setIsThemeModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-200 hover:text-white rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
            title="Tema ve Görünüm Ayarları (Açık Ferah, Font Boyutu)"
          >
            <Palette className="w-3.5 h-3.5 text-cyan-400" />
            <span>🎨 Tema</span>
          </button>

          {/* Interface Language Quick Dropdown */}
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-2xl shadow">
            <Globe2 className="w-4 h-4 text-amber-400" />
            <select
              value={interfaceLang}
              onChange={(e) => handleInterfaceLanguageChange(e.target.value as LanguageId)}
              className="bg-transparent text-xs font-bold text-slate-300 focus:outline-none cursor-pointer"
            >
              {LANGUAGES_LIST.map((l) => (
                <option key={l.id} value={l.id} className="bg-slate-900 text-white">
                  {l.flag} {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 py-4 flex-1 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-14">
        
        {/* Left Side: Pitch & Feature Highlights */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs font-black text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>Kişiselleştirilmiş Çok Dilli Öğrenme Deneyimi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Dünyanın <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">16 Dilini</span> İstediğiniz Ana Dilden Öğrenin
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
            {t.welcomeSubtitle} Yüksek çözünürlüklü resimli kartlar, yerel fonetik telaffuzlar, akıllı kelime testleri ve yapay zeka destekli dil koçu tek bir platformda.
          </p>

          {/* Feature Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-lg mx-auto lg:mx-0">
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center space-x-2.5">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                <Layers className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-white">16 Dil Desteği</div>
                <div className="text-[10px] text-slate-400">Serbest Ana/Hedef Dil</div>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center space-x-2.5">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-white">Resimli Kartlar</div>
                <div className="text-[10px] text-slate-400">Fonetik & Cümleler</div>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center space-x-2.5 col-span-2 sm:col-span-1">
              <div className="p-2 bg-yellow-500/20 text-yellow-400 rounded-xl">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-white">Gemini AI Koç</div>
                <div className="text-[10px] text-slate-400">Canlı Dil Pratiği</div>
              </div>
            </div>
          </div>

          {/* One-click Demo Button */}
          <div className="pt-2">
            <button
              onClick={handleQuickDemoLogin}
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-white rounded-2xl text-xs sm:text-sm font-black transition-all inline-flex items-center gap-2 shadow-lg group"
            >
              <ShieldCheck className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>{t.quickDemoLogin}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

        </div>

        {/* Right Side: Auth & Language Setup Card */}
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
          
          {isVerifyingCode ? (
            <EmailVerificationBox
              email={email.trim()}
              userName={name.trim()}
              purpose="register"
              onVerified={handleVerificationSuccess}
              onCancel={() => setIsVerifyingCode(false)}
            />
          ) : isForgotPassword ? (
            /* Forgot Password Screen */
            <div className="space-y-5">
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 bg-cyan-500/20 border border-cyan-400/30 rounded-2xl text-cyan-400 mb-1">
                  <KeyRound className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-black text-white">Şifremi Sıfırla</h2>
                <p className="text-xs text-slate-400">
                  Kayıtlı e-posta adresinizi giriniz. Şifre sıfırlama bağlantısı e-postanıza gönderilecektir.
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
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
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
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:brightness-110 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
              {/* Tabs */}
              <div className="grid grid-cols-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
                <button
                  type="button"
                  onClick={() => { setTab('register'); setErrorMsg(null); }}
                  className={`py-2.5 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
                    tab === 'register'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Yeni Kayıt</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setTab('login'); setErrorMsg(null); }}
                  className={`py-2.5 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
                    tab === 'login'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Giriş Yap</span>
                </button>
              </div>

              {/* Alerts */}
              {errorMsg && (
                <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {tab === 'register' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      {t.fullName}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="Örn: Ufuk Dilbilimci"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {t.emailAddress} {tab === 'register' && <span className="text-amber-400 font-bold">(Onay kodu gönderilir)</span>}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="ornek@polyglot.app"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
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
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {tab === 'register' && (
                  <>
                    {/* Dual Language Selector: Native Language & Target Language */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      
                      {/* Native Language (Ana Dil) */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          {t.nativeLanguageLabel}
                        </label>
                        <div className="relative">
                          <select
                            value={nativeLang}
                            onChange={(e) => {
                              const val = e.target.value as LanguageId;
                              setNativeLang(val);
                              setInterfaceLang(val);
                            }}
                            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold appearance-none cursor-pointer"
                          >
                            {LANGUAGES_LIST.map((lang) => (
                              <option key={lang.id} value={lang.id} className="bg-slate-900 text-white">
                                {lang.flag} {lang.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Target Language (Hedef Dil) */}
                      <div>
                        <label className="block text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                          {t.targetLanguageLabel}
                        </label>
                        <div className="relative">
                          <select
                            value={targetLang}
                            onChange={(e) => setTargetLang(e.target.value as LanguageId)}
                            className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3 py-2.5 text-xs text-amber-300 focus:outline-none focus:border-amber-400 font-bold appearance-none cursor-pointer"
                          >
                            {LANGUAGES_LIST.map((lang) => (
                              <option key={lang.id} value={lang.id} className="bg-slate-900 text-white">
                                {lang.flag} {lang.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                    </div>

                    {/* Avatar Picker */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {t.chooseAvatar}
                      </label>
                      <div className="flex flex-wrap gap-1.5 p-2 bg-slate-950 border border-slate-800 rounded-xl">
                        {AVATARS.map((av) => (
                          <button
                            key={av}
                            type="button"
                            onClick={() => setAvatar(av)}
                            className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all ${
                              avatar === av
                                ? 'bg-amber-500/30 border border-amber-400 scale-110'
                                : 'hover:bg-slate-800'
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
                  className="w-full mt-3 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : tab === 'register' ? (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Onay Kodu Gönder & Kayıt Ol</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>{t.loginBtn}</span>
                    </>
                  )}
                </button>

              </form>

              {/* Switch tab footer note */}
              <div className="mt-4 pt-4 border-t border-slate-800 text-center">
                <button
                  type="button"
                  onClick={() => { setTab(tab === 'register' ? 'login' : 'register'); setErrorMsg(null); }}
                  className="text-xs text-slate-400 hover:text-amber-400 font-semibold transition-colors"
                >
                  {tab === 'register' ? t.alreadyHaveAccount : t.dontHaveAccount}
                </button>
              </div>
            </>
          )}

        </div>

      </main>

      {/* Modern Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-400">PolyglotAI</span> • 16 Dilde Özelleştirilebilir Dil Platformu
          </div>
          <div>
            Tüm hakları saklıdır © 2026
          </div>
        </div>
      </footer>

      {/* Theme Customizer Modal */}
      {isThemeModalOpen && (
        <ThemeCustomizerModal
          isOpen={isThemeModalOpen}
          onClose={() => setIsThemeModalOpen(false)}
        />
      )}

    </div>
  );
};
