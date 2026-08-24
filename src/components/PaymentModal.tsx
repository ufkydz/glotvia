import React, { useState, useEffect } from 'react';
import { UserProfile, PlayBillingProduct, PlayBillingState } from '../types';
import { 
  PLAY_BILLING_PRODUCTS, 
  queryPlayStoreProducts, 
  executePlayBillingPurchase, 
  openGooglePlaySubscriptionsManagement 
} from '../services/playBillingService';
import { 
  restoreUserPurchasesFromCloud, 
  hasActiveEntitlement 
} from '../services/backendVerificationService';
import { 
  getUserTier, 
  getTierDisplayName, 
  TIER_FEATURE_COMPARISON 
} from '../utils/tierPermissions';
import { playSuccessChime, playCoinSound } from '../utils/audioEffects';
import { 
  X, Crown, Check, ShieldCheck, Sparkles, 
  Lock, ArrowRight, CheckCircle2, AlertCircle, RefreshCw,
  ExternalLink, ArrowLeft, Layers, Zap, Info, ChevronDown, ChevronUp
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onPaymentSuccess: (updatedUser: UserProfile) => void;
  onOpenPrivacy?: () => void;
  initialTab?: 'plans' | 'credits';
  initialCreditPackageId?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onPaymentSuccess,
  onOpenPrivacy
}) => {
  const [products, setProducts] = useState<PlayBillingProduct[]>(() => 
    PLAY_BILLING_PRODUCTS.filter(p => p.isActive)
  );
  // Default selected is 12 Months Premium Plus (Best Value)
  const [selectedProduct, setSelectedProduct] = useState<PlayBillingProduct>(() => 
    PLAY_BILLING_PRODUCTS[0]
  );
  const [activeView, setActiveView] = useState<'plans' | 'comparison'>('plans');
  const [billingState, setBillingState] = useState<PlayBillingState>('IDLE');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreNotice, setRestoreNotice] = useState<{ text: string; isSuccess: boolean } | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  // Load dynamic pricing from Google Play (localized by user country & currency)
  useEffect(() => {
    let isMounted = true;
    queryPlayStoreProducts(currentUser.country, currentUser.currency).then((remoteProducts) => {
      if (isMounted && remoteProducts && remoteProducts.length > 0) {
        const activeList = remoteProducts.filter(p => p.isActive);
        setProducts(activeList);
        const currentSelected = activeList.find(p => p.id === selectedProduct.id) || activeList[0];
        setSelectedProduct(currentSelected);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [currentUser.country, currentUser.currency]);

  if (!isOpen) return null;

  const isAlreadySubscribed = hasActiveEntitlement(currentUser);
  const currentTier = getUserTier(currentUser);

  // Filter products by tier
  const plusProducts = products.filter(p => p.tierCategory === 'plus' || p.tier === 'plus' || p.id.startsWith('plus'));
  const premiumProducts = products.filter(p => p.tierCategory === 'premium' || p.tier === 'premium' || p.id.startsWith('premium'));

  // Execute Google Play Purchase Flow
  const handlePurchase = async () => {
    setBillingState('PURCHASING');
    setErrorMessage(null);
    setStatusMessage('Google Play ödeme ekranı başlatılıyor...');

    try {
      setBillingState('VERIFYING');
      setStatusMessage('Google Play Developer API ile satın alma doğrulanıyor...');

      const result = await executePlayBillingPurchase(
        selectedProduct,
        currentUser.id || currentUser.email,
        currentUser.email
      );

      if (result.success) {
        setBillingState('SUCCESS');
        setConfirmedOrderId(result.orderId || null);
        setStatusMessage('Tebrikler! Google Play satın almanız başarıyla doğrulandı.');

        playSuccessChime();
        playCoinSound();

        const updatedUser: UserProfile = {
          ...currentUser,
          isPremium: true,
          premiumPlan: result.tier || selectedProduct.tier,
          subscriptionPlan: result.tier || selectedProduct.tier,
          googlePlayOrderId: result.orderId,
          stats: {
            ...currentUser.stats,
            xp: currentUser.stats.xp + 150
          }
        };

        onPaymentSuccess(updatedUser);
      } else {
        if (result.error?.code === 'USER_CANCELED') {
          setBillingState('CANCELED');
          setErrorMessage('Ödeme işlemi iptal edildi.');
        } else if (result.error?.code === 'ITEM_ALREADY_OWNED') {
          setBillingState('ALREADY_OWNED');
          setErrorMessage('Bu ürün Google Play hesabınızda zaten mevcut. "Satın Almaları Geri Yükle" butonunu kullanabilirsiniz.');
        } else {
          setBillingState('ERROR');
          setErrorMessage(result.error?.userMessage || 'Satın alma tamamlanamadı. Lütfen tekrar deneyiniz.');
        }
      }
    } catch (err: any) {
      setBillingState('ERROR');
      setErrorMessage(err?.message || 'Beklenmeyen bir hata oluştu.');
    }
  };

  // Restore Purchases
  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    setRestoreNotice(null);
    setErrorMessage(null);

    const restoreRes = await restoreUserPurchasesFromCloud(currentUser.id || currentUser.email);
    setIsRestoring(false);

    if (restoreRes.restored) {
      setRestoreNotice({ text: restoreRes.message, isSuccess: true });
      playSuccessChime();
      const updatedUser: UserProfile = {
        ...currentUser,
        isPremium: true,
        premiumPlan: restoreRes.tier || 'plus',
        subscriptionPlan: restoreRes.tier || 'plus'
      };
      onPaymentSuccess(updatedUser);
    } else {
      setRestoreNotice({ text: restoreRes.message, isSuccess: false });
    }
  };

  const isPlusSelected = selectedProduct.tier === 'plus' || selectedProduct.tierCategory === 'plus';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-2xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-950/95 backdrop-blur-3xl border border-white/15 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden text-slate-100 flex flex-col max-h-[92dvh] my-auto">
        
        {/* Ambient Top Glow Orbs */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-b from-amber-500/25 via-yellow-500/15 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 pointer-events-none" />

        {/* Top Header */}
        <div className="relative p-4 sm:p-5 bg-slate-950/80 border-b border-white/10 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Geri"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">Bir plan seç</h3>
              <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Google Play Güvenli Ödeme</span>
              </div>
            </div>
          </div>

          {/* Toggle View: Plans vs Comparison */}
          <div className="flex items-center bg-slate-900/90 border border-white/10 rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveView('plans')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeView === 'plans' 
                  ? 'bg-amber-400 text-slate-950 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Planlar
            </button>
            <button
              type="button"
              onClick={() => setActiveView('comparison')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeView === 'comparison' 
                  ? 'bg-amber-400 text-slate-950 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Karşılaştır
            </button>
          </div>
        </div>

        {/* Scrollable Main Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 z-10">
          
          {/* Active Subscription Banner */}
          {isAlreadySubscribed && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-400/40 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-300">Aktif Üyelik Bulundu</div>
                  <div className="text-[11px] text-slate-300">
                    Planınız: <strong className="text-white uppercase">{getTierDisplayName(currentTier)}</strong>
                  </div>
                </div>
              </div>
              <button
                onClick={() => openGooglePlaySubscriptionsManagement(selectedProduct.id)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-white/10 flex items-center gap-1 transition-all cursor-pointer"
              >
                <span>Yönet</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Success Screen */}
          {billingState === 'SUCCESS' && (
            <div className="p-6 rounded-3xl bg-gradient-to-b from-emerald-950/60 to-slate-950/90 border border-emerald-400/50 text-center space-y-4 animate-scaleUp">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.35)]">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-lg font-black text-white">Üyeliğiniz Başarıyla Başlatıldı!</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Google Play satın almanız doğrulandı. 16 dilde tüm yapay zeka araçları, telaffuz koçluğu ve sınav modülleri hesabınıza tanımlandı.
                </p>
                {confirmedOrderId && (
                  <div className="mt-2 inline-block px-3 py-1 rounded-lg bg-slate-900 border border-white/10 font-mono text-[11px] text-emerald-400">
                    Sipariş: {confirmedOrderId}
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition-all cursor-pointer active:scale-95"
              >
                Hemen Başla 🚀
              </button>
            </div>
          )}

          {/* Plans Selection View (Screenshot 1 Style) */}
          {billingState !== 'SUCCESS' && activeView === 'plans' && (
            <div className="space-y-5">
              
              {/* 1. PREMIUM PLUS SECTION */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-black text-white tracking-tight">Premium Plus</span>
                  </div>
                  <span className="text-[11px] text-amber-300 font-semibold">Tüm Özellikler Açık</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  24/7 konuşma pratiği araçlarına ve özgüveninizi dönüştürecek özel içeriklere erişin.
                </p>

                <div className="space-y-2.5">
                  {plusProducts.map((product) => {
                    const isSelected = selectedProduct.id === product.id;
                    return (
                      <div
                        key={product.id}
                        onClick={() => {
                          if (billingState === 'PURCHASING' || billingState === 'VERIFYING') return;
                          setSelectedProduct(product);
                          setErrorMessage(null);
                        }}
                        className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-slate-900/90 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.25)] ring-1 ring-amber-400'
                            : 'bg-slate-950/60 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {product.badge && (
                          <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[9px] font-black uppercase shadow-md">
                            {product.badge}
                          </div>
                        )}

                        <div className="flex items-center space-x-3">
                          {/* Radio circle */}
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected 
                              ? 'border-amber-400 bg-amber-400 text-slate-950' 
                              : 'border-slate-600 bg-slate-900'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>

                          <div>
                            <div className="text-sm font-bold text-white flex items-center gap-2">
                              <span>{product.durationMonths === 12 ? '12 ay' : '1 ay'}</span>
                              {product.savingsPercent && (
                                <span className="text-xs text-amber-400 font-extrabold">
                                  - %{product.savingsPercent} tasarruf edin
                                </span>
                              )}
                            </div>
                            {product.monthlyEquivalent && (
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                {product.monthlyEquivalent}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Price Column */}
                        <div className="text-right">
                          {product.originalPriceFormatted && (
                            <div className="text-xs text-slate-500 line-through">
                              {product.originalPriceFormatted}
                            </div>
                          )}
                          <div className="text-base sm:text-lg font-black text-white">
                            {product.price}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. PREMIUM SECTION */}
              <div className="space-y-2.5 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-black text-white tracking-tight">Premium</span>
                  </div>
                  <span className="text-[11px] text-cyan-300 font-semibold">Standart Paket</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Dilbilgisi ve kelime bilgisi çalışmalarıyla seviyeni yükselt, sadece senin için hazırlandı.
                </p>

                <div className="space-y-2.5">
                  {premiumProducts.map((product) => {
                    const isSelected = selectedProduct.id === product.id;
                    return (
                      <div
                        key={product.id}
                        onClick={() => {
                          if (billingState === 'PURCHASING' || billingState === 'VERIFYING') return;
                          setSelectedProduct(product);
                          setErrorMessage(null);
                        }}
                        className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-slate-900/90 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
                            : 'bg-slate-950/60 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {/* Radio circle */}
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected 
                              ? 'border-cyan-400 bg-cyan-400 text-slate-950' 
                              : 'border-slate-600 bg-slate-900'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>

                          <div>
                            <div className="text-sm font-bold text-white flex items-center gap-2">
                              <span>{product.durationMonths === 12 ? '12 ay' : '1 ay'}</span>
                              {product.savingsPercent && (
                                <span className="text-xs text-cyan-400 font-extrabold">
                                  - %{product.savingsPercent} tasarruf edin
                                </span>
                              )}
                            </div>
                            {product.monthlyEquivalent && (
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                {product.monthlyEquivalent}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Price Column */}
                        <div className="text-right">
                          {product.originalPriceFormatted && (
                            <div className="text-xs text-slate-500 line-through">
                              {product.originalPriceFormatted}
                            </div>
                          )}
                          <div className="text-base sm:text-lg font-black text-white">
                            {product.price}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Feature comparison trigger button */}
              <button
                type="button"
                onClick={() => setActiveView('comparison')}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-900 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Paketlerin Tüm Özelliklerini Karşılaştır</span>
              </button>

            </div>
          )}

          {/* Feature Comparison Matrix View (Screenshot 2 Style) */}
          {billingState !== 'SUCCESS' && activeView === 'comparison' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-300 leading-relaxed">
                Tüm paketlerin ayrıntılı özellik ve erişim yetkilerini aşağıdan inceleyebilirsiniz:
              </div>

              {/* Matrix Table */}
              <div className="rounded-2xl border border-white/10 overflow-hidden bg-slate-950/70">
                <div className="grid grid-cols-12 bg-slate-900/90 p-3 text-[11px] font-black border-b border-white/10 text-slate-300">
                  <div className="col-span-6">Özellik</div>
                  <div className="col-span-2 text-center text-slate-400">Ücretsiz</div>
                  <div className="col-span-2 text-center text-cyan-300">Premium</div>
                  <div className="col-span-2 text-center text-amber-300">Plus</div>
                </div>

                <div className="divide-y divide-white/5">
                  {TIER_FEATURE_COMPARISON.map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`grid grid-cols-12 p-2.5 sm:p-3 text-xs items-center transition-colors ${
                        item.highlightPlus ? 'bg-amber-400/5' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="col-span-6 pr-2">
                        <div className="font-bold text-slate-200 text-[11px] sm:text-xs">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">
                          {item.description}
                        </div>
                      </div>

                      {/* Free Column */}
                      <div className="col-span-2 text-center">
                        {typeof item.free === 'string' ? (
                          <span className="text-[10px] text-slate-400 font-medium">{item.free}</span>
                        ) : item.free ? (
                          <span className="text-emerald-400 font-black">✓</span>
                        ) : (
                          <span className="text-slate-600 font-bold">—</span>
                        )}
                      </div>

                      {/* Premium Column */}
                      <div className="col-span-2 text-center">
                        {typeof item.premium === 'string' ? (
                          <span className="text-[10px] text-cyan-300 font-medium">{item.premium}</span>
                        ) : item.premium ? (
                          <span className="text-cyan-400 font-black">✓</span>
                        ) : (
                          <span className="text-slate-600 font-bold">—</span>
                        )}
                      </div>

                      {/* Plus Column */}
                      <div className="col-span-2 text-center">
                        {typeof item.plus === 'string' ? (
                          <span className="text-[10px] text-amber-300 font-bold">{item.plus}</span>
                        ) : item.plus ? (
                          <span className="text-amber-400 font-black">✓</span>
                        ) : (
                          <span className="text-slate-600 font-bold">—</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveView('plans')}
                className="w-full py-2.5 text-xs text-amber-300 hover:text-amber-200 bg-amber-400/10 hover:bg-amber-400/20 rounded-xl border border-amber-400/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-bold"
              >
                <span>Plan Seçimine Geri Dön</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <div className="font-bold">Ödeme Bildirimi:</div>
                <div className="text-[11px] text-rose-200 mt-0.5">{errorMessage}</div>
              </div>
            </div>
          )}

          {/* Status Message */}
          {statusMessage && billingState !== 'IDLE' && billingState !== 'SUCCESS' && (
            <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Restore Notice */}
          {restoreNotice && (
            <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              restoreNotice.isSuccess 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/80 border-white/10 text-slate-300'
            }`}>
              {restoreNotice.isSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span>{restoreNotice.text}</span>
            </div>
          )}

        </div>

        {/* Sticky Bottom Footer (Screenshots 1 & 2 Style) */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-white/10 space-y-3 shrink-0 z-10">
          
          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handlePurchase}
            disabled={billingState === 'PURCHASING' || billingState === 'VERIFYING'}
            className={`w-full py-4 font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer active:scale-98 ${
              isPlusSelected
                ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 shadow-[0_0_25px_rgba(251,191,36,0.35)]'
                : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white shadow-[0_0_25px_rgba(6,182,212,0.35)]'
            }`}
          >
            {billingState === 'PURCHASING' || billingState === 'VERIFYING' ? (
              <>
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>İşleniyor & Doğrulanıyor...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                <span>
                  {isPlusSelected ? 'Premium + üyeliğe geç' : 'Premium üyeliğe geç'} ({selectedProduct.price})
                </span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>

          {/* Sub actions */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <button
              type="button"
              onClick={handleRestorePurchases}
              disabled={isRestoring}
              className="text-cyan-400 hover:text-cyan-300 underline font-medium flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isRestoring ? 'animate-spin' : ''}`} />
              <span>{isRestoring ? 'Sorgulanıyor...' : 'Satın Almaları Geri Yükle'}</span>
            </button>

            {onOpenPrivacy && (
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-slate-400 hover:text-slate-200 underline cursor-pointer"
              >
                Gizlilik Sözleşmesi
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
