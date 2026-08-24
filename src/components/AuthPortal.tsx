import React, { useState } from 'react';
import { UserProfile, LanguageId, LanguageLevel, AgeGroup } from '../types';
import { LANGUAGES_LIST, COUNTRIES_LIST, getCountryInfo } from '../data/languagesData';
import { 
  registerWithFirebase, 
  loginWithFirebase, 
  sendUserPasswordReset,
  formatAuthErrorMessage,
  checkEmailVerifiedStatus
} from '../services/authenticationService';
import { EmailVerificationBox } from './EmailVerificationBox';
import { 
  LogIn, UserPlus, Mail, Lock, User, Globe2, ShieldCheck, 
  CheckCircle2, AlertCircle, ArrowRight, Eye, EyeOff, LogOut,
  Sparkles, KeyRound, UserCheck, RefreshCw, Layers, Shield,
  Compass, Clock, Target, Award
} from 'lucide-react';

interface AuthPortalProps {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  onOpenPrivacy?: () => void;
}

const AVATARS = ['🌟', '🚀', '🎓', '👑', '🦁', '🦊', '🦉', '🌍', '⚡', '💡', '💎', '🔥'];

const LEVELS: { id: LanguageLevel; label: string; desc: string }[] = [
  { id: 'A1', label: 'A1 - Başlangıç', desc: 'Sıfırdan öğreniyorum' },
  { id: 'A2', label: 'A2 - Temel', desc: 'Basit cümleler kurabiliyorum' },
  { id: 'B1', label: 'B1 - Orta', desc: 'Günlük konuşmaları anlıyorum' },
  { id: 'B2', label: 'B2 - İyi', desc: 'Akıcı iletişim kurabiliyorum' },
  { id: 'C1', label: 'C1 - İleri / C2', desc: 'Akademik / Profesyonel düzey' }
];

const AGE_GROUPS: { id: AgeGroup; label: string }[] = [
  { id: '13-17', label: '13-17 (Genç)' },
  { id: '18-29', label: '18-29 (Genç Yetişkin)' },
  { id: '30-49', label: '30-49 (Yetişkin)' },
  { id: '50+', label: '50+ (Deneyimli)' }
];

const DAILY_GOALS: { minutes: number; label: string }[] = [
  { minutes: 5, label: '5 dk / gün (Rahat)' },
  { minutes: 15, label: '15 dk / gün (Standart)' },
  { minutes: 30, label: '30 dk / gün (Ciddi)' },
  { minutes: 60, label: '60 dk / gün (Yoğun)' }
];

export const AuthPortal: React.FC<AuthPortalProps> = ({
  currentUser,
  isAuthenticated,
  onLoginSuccess,
  onLogout,
  onOpenPrivacy
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('TR');
  const [nativeLang, setNativeLang] = useState<LanguageId>('tr');
  const [targetLang, setTargetLang] = useState<LanguageId>('de');
  const [level, setLevel] = useState<LanguageLevel>('A1');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('18-29');
  const [dailyGoal, setDailyGoal] = useState<number>(15);
  const [avatar, setAvatar] = useState('🚀');

  const handleCountryChange = (cCode: string) => {
    setCountryCode(cCode);
    const cInfo = getCountryInfo(cCode);
    if (cInfo.defaultNativeLang) {
      setNativeLang(cInfo.defaultNativeLang);
    }
  };

  // States
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Lütfen şifrenizi giriniz.');
      return;
    }

    setLoading(true);
    const result = await loginWithFirebase(cleanEmail, password);
    setLoading(false);

    if (result.success && result.user) {
      setSuccessMsg(`Giriş başarılı! Hoş geldiniz, ${result.user.name}.`);
      setTimeout(() => onLoginSuccess(result.user!), 400);
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setErrorMsg('Lütfen adınızı ve soyadınızı giriniz.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Şifreniz en az 6 karakterden oluşmalıdır.');
      return;
    }
    if (nativeLang === targetLang) {
      setErrorMsg('Ana diliniz ve öğrenmek istediğiniz hedef dil aynı olamaz.');
      return;
    }

    const cInfo = getCountryInfo(countryCode);

    setLoading(true);
    const result = await registerWithFirebase(
      cleanName,
      cleanEmail,
      password,
      targetLang,
      nativeLang,
      avatar,
      countryCode,
      level,
      ageGroup,
      dailyGoal,
      cInfo.currency
    );
    setLoading(false);

    if (result.success && result.user) {
      setSuccessMsg('E-posta adresinize doğrulama bağlantısı gönderildi. Gelen kutunuzu ve spam klasörünüzü kontrol edin.');
      setIsVerifyingCode(true);
    } else {
      setErrorMsg(result.message);
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Lütfen şifre sıfırlama bağlantısının gönderileceği geçerli bir e-posta adresi giriniz.');
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
    setSuccessMsg('E-posta adresiniz başarıyla doğrulandı!');
    if (currentUser) {
      const updated = {
        ...currentUser,
        isEmailVerified: true,
        emailVerifiedAt: Date.now()
      };
      onLoginSuccess(updated);
    } else {
      loginWithFirebase(email, password).then((res) => {
        if (res.user) {
          onLoginSuccess(res.user);
        }
      });
    }
  };

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92dvh] relative">
      
      {/* Top Specular Accent Glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none" />

      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-950/60 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-black text-xl shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            🇩🇪
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-black text-white truncate">
              Glotvia Almanca Öğrenme
            </h2>
            <p className="text-xs text-slate-300 truncate">
              {isVerifyingCode 
                ? 'E-posta Doğrulama Adımı'
                : activeTab === 'register' 
                ? 'Yeni Hesap Oluştur' 
                : 'Hesabınıza Giriş Yapın'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Tabs (only when not verifying code) */}
      {!isVerifyingCode && !isForgotPassword && (
        <div className="flex border-b border-white/10 bg-slate-950/40 px-3 pt-2 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'login'
                ? 'bg-slate-900/90 text-cyan-300 border-t-2 border-cyan-400 border-x border-white/10 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-slate-900/90 text-cyan-300 border-t-2 border-cyan-400 border-x border-white/10 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Kayıt Ol
          </button>
        </div>
      )}

      {/* Scrollable Form Body */}
      <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
        
        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-2xl text-xs flex items-start gap-2 backdrop-blur-md animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-2xl text-xs flex items-start gap-2 backdrop-blur-md animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span className="leading-snug">{successMsg}</span>
          </div>
        )}

        {/* 1. VERIFICATION CODE STEP */}
        {isVerifyingCode ? (
          <EmailVerificationBox
            email={email}
            userName={name || email.split('@')[0]}
            purpose="register"
            onVerified={handleVerificationSuccess}
            onCancel={() => setIsVerifyingCode(false)}
          />
        ) : isForgotPassword ? (
          /* 2. FORGOT PASSWORD VIEW */
          <form onSubmit={handlePasswordResetSubmit} className="space-y-4 animate-fadeIn">
            <div className="text-center space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-white">Şifremi Sıfırla</h3>
              <p className="text-xs text-slate-300">
                Hesabınıza ait e-posta adresinizi giriniz. Şifre sıfırlama talimatları gönderilecektir.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                E-posta Adresiniz
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="adiniz@ornek.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-950/60 border border-white/15 rounded-xl text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition-all placeholder:text-slate-500 backdrop-blur-md"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:brightness-110 text-white font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 active:scale-98"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
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
              ← Giriş Ekranına Geri Dön
            </button>
          </form>
        ) : activeTab === 'login' ? (
          /* 3. LOGIN TAB */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="adiniz@ornek.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-950/60 border border-white/15 rounded-xl text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition-all placeholder:text-slate-500 backdrop-blur-md"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Şifre
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(true);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  Şifremi Unuttum?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-slate-950/60 border border-white/15 rounded-xl text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition-all placeholder:text-slate-500 backdrop-blur-md"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:brightness-110 text-white font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 active:scale-98"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span>Giriş Yap</span>
            </button>
          </form>
        ) : (
          /* 4. REGISTER & PERSONALIZATION TAB */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            
            {/* Country & Regional Currency Setup */}
            <div className="p-3 bg-slate-950/70 border border-white/15 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                <span className="flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4 text-cyan-400" />
                  1. Ülke & Bölgesel Ayarlar
                </span>
                <span className="text-[11px] text-slate-400">
                  Para Birimi: {getCountryInfo(countryCode).currencySymbol} ({getCountryInfo(countryCode).currency})
                </span>
              </div>
              <select
                value={countryCode}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full py-2.5 px-3 bg-slate-900 border border-white/20 rounded-xl text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none"
              >
                {COUNTRIES_LIST.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} — {c.currency} ({c.currencySymbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Language Pair Selection */}
            <div className="p-3 bg-slate-950/70 border border-white/15 rounded-2xl space-y-3">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-400" />
                2. Dil Çifti (Hangi dilden hangi dili öğreneceksiniz?)
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Bildiğiniz / Ana Dil:
                  </label>
                  <select
                    value={nativeLang}
                    onChange={(e) => setNativeLang(e.target.value as LanguageId)}
                    className="w-full py-2 px-2.5 bg-slate-900 border border-white/20 rounded-xl text-white text-xs focus:border-cyan-400 focus:outline-none"
                  >
                    {LANGUAGES_LIST.map((lang) => (
                      <option key={lang.id} value={lang.id}>
                        {lang.flag} {lang.name} ({lang.nativeName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Öğrenmek İstediğiniz Dil:
                  </label>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value as LanguageId)}
                    className="w-full py-2 px-2.5 bg-slate-900 border border-cyan-400/50 rounded-xl text-cyan-200 text-xs focus:border-cyan-400 focus:outline-none font-bold"
                  >
                    {LANGUAGES_LIST.map((lang) => (
                      <option key={lang.id} value={lang.id} disabled={lang.id === nativeLang}>
                        {lang.flag} {lang.name} ({lang.nativeName}) {lang.id === nativeLang ? '(Seçilemez)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Level, Age Group, Daily Goal */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-cyan-400" />
                  Mevcut Seviye
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as LanguageLevel)}
                  className="w-full py-2 px-2.5 bg-slate-950/70 border border-white/15 rounded-xl text-white text-xs focus:border-cyan-400 focus:outline-none"
                >
                  {LEVELS.map((lvl) => (
                    <option key={lvl.id} value={lvl.id}>
                      {lvl.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                  Yaş Grubu
                </label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                  className="w-full py-2 px-2.5 bg-slate-950/70 border border-white/15 rounded-xl text-white text-xs focus:border-cyan-400 focus:outline-none"
                >
                  {AGE_GROUPS.map((ag) => (
                    <option key={ag.id} value={ag.id}>
                      {ag.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Günlük Hedef
                </label>
                <select
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(Number(e.target.value))}
                  className="w-full py-2 px-2.5 bg-slate-950/70 border border-white/15 rounded-xl text-white text-xs focus:border-cyan-400 focus:outline-none"
                >
                  {DAILY_GOALS.map((dg) => (
                    <option key={dg.minutes} value={dg.minutes}>
                      {dg.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Account Credentials */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Adınız & Soyadınız
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Örn: Ahmet Yılmaz"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-white/15 rounded-xl text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition-all placeholder:text-slate-500 backdrop-blur-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  E-posta Adresiniz
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="adiniz@ornek.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-white/15 rounded-xl text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition-all placeholder:text-slate-500 backdrop-blur-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Şifre Belirleyin (En az 6 karakter)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950/60 border border-white/15 rounded-xl text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition-all placeholder:text-slate-500 backdrop-blur-md"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Profil Avatarınız
                </label>
                <div className="grid grid-cols-6 gap-1 sm:gap-1.5">
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setAvatar(av)}
                      className={`p-1.5 sm:p-2 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                        avatar === av
                          ? 'bg-cyan-600/40 border-2 border-cyan-400 scale-105 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                          : 'bg-slate-950/50 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 bg-cyan-950/30 border border-cyan-400/30 rounded-xl text-[11px] text-cyan-200 leading-relaxed flex items-start gap-2 backdrop-blur-md">
              <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Kayıt olduğunuzda seçtiğiniz dil çiftine özel müfredatınız ve kelime kartlarınız anında hazır hale getirilir.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(251,191,36,0.3)] flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 active:scale-98"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              <span>Kayıt Ol ve Öğrenmeye Başla</span>
            </button>
          </form>
        )}

      </div>

      {/* Footer */}
      <div className="p-3 sm:p-4 border-t border-white/10 bg-slate-950/60 backdrop-blur-md flex items-center justify-between text-[11px] sm:text-xs text-slate-400 shrink-0">
        {onOpenPrivacy ? (
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="text-cyan-400 hover:text-cyan-300 underline font-medium cursor-pointer"
          >
            Gizlilik Politikası
          </button>
        ) : (
          <span>Glotvia Global Dil Platformu</span>
        )}
        <span className="text-slate-500">v3.0 Multi-Lang Engine</span>
      </div>

    </div>
  );
};
