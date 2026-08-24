import { PlayBillingProduct, PlayBillingState, PremiumTier } from '../types';
import { 
  verifyGooglePlayPurchaseOnBackend, 
  restoreUserPurchasesFromCloud 
} from './backendVerificationService';

/**
 * 1. CENTRALIZED GOOGLE PLAY PRODUCT CONFIGURATION
 * Must match exact Product IDs defined in Google Play Console (Monetize -> Products)
 */
export const PLAY_BILLING_PRODUCTS: PlayBillingProduct[] = [
  {
    id: 'plus_yearly',
    tier: 'plus',
    tierCategory: 'plus',
    name: 'Premium Plus (12 Ay)',
    headline: '24/7 konuşma pratiği araçlarına ve özgüveninizi dönüştürecek özel içeriklere erişin.',
    description: 'Yıllık en popüler plan. Canlı YZ sohbetleri, ses analizi ve Goethe simülasyonu dahil.',
    type: 'subs',
    basePlanId: 'plus-yearly-standard',
    price: '₺759,99',
    rawPrice: 759.99,
    originalPrice: 3108.00,
    originalPriceFormatted: '₺3.108',
    savingsPercent: 76,
    monthlyEquivalent: '₺63,33 /ay',
    currency: '₺',
    periodLabel: '/ yıl',
    durationMonths: 12,
    popular: true,
    badge: 'EN İYİ FİYAT • %76 TASARRUF',
    color: 'from-amber-400 via-orange-500 to-yellow-500',
    features: [
      'Telafi Alanı & Akıllı Tekrar',
      'YZ ile Canlı Sohbetler (Gemini 2.0)',
      'Telaffuz Geri Bildirimi & Ses Analizi',
      'Özel Goethe Sınav Simülatörü & Sprechen',
      'Serini Koru (Streak Freeze Koruması)',
      'Sınırsız Doğal Sesli Dinleme & Çevrimdışı Mod',
      'Resmi Glotvia Dil Sertifikası'
    ],
    isActive: true
  },
  {
    id: 'plus_monthly',
    tier: 'plus',
    tierCategory: 'plus',
    name: 'Premium Plus (1 Ay)',
    headline: '24/7 konuşma pratiği ve tüm yapay zeka araçları.',
    description: 'Aylık esnek ödeme ile tüm yapay zeka ve konuşma özelliklerine tam erişim.',
    type: 'subs',
    basePlanId: 'plus-monthly-standard',
    price: '₺259,00',
    rawPrice: 259.00,
    currency: '₺',
    periodLabel: '/ ay',
    durationMonths: 1,
    popular: false,
    color: 'from-amber-500 to-amber-700',
    features: [
      'YZ ile Canlı Sohbetler (Gemini 2.0)',
      'Canlı Telaffuz & Konuşma Koçu',
      'Goethe A1-B1 Sınav Simülatörü',
      'Sınırsız Sesli Dinleme & Reklamsız'
    ],
    isActive: true
  },
  {
    id: 'premium_yearly',
    tier: 'premium',
    tierCategory: 'premium',
    name: 'Premium (12 Ay)',
    headline: 'Dilbilgisi ve kelime bilgisi çalışmalarıyla seviyeni yükselt, sadece senin için hazırlandı.',
    description: 'Yıllık avantajlı standart premium. Kelime tekrarı, dilbilgisi ve sınırsız dinleme.',
    type: 'subs',
    basePlanId: 'premium-yearly-standard',
    price: '₺549,00',
    rawPrice: 549.00,
    originalPrice: 2279.88,
    originalPriceFormatted: '₺2.279,88',
    savingsPercent: 76,
    monthlyEquivalent: '₺45,75 /ay',
    currency: '₺',
    periodLabel: '/ yıl',
    durationMonths: 12,
    popular: false,
    badge: '%76 TASARRUF',
    color: 'from-cyan-500 via-blue-600 to-indigo-600',
    features: [
      'Sınırsız Doğal Sesli Dinleme (TTS)',
      'Kelime Tekrarı (Flashcard Hafıza)',
      'Dil Bilgisi Gözden Geçirme Modülü',
      'Reklamsız Kesintisiz Öğrenme',
      'Dersleri Atlama & Seviye Testi',
      'Çevrimdışı / İnternetsiz Öğrenme Modu',
      'Resmi Glotvia Dil Sertifikası'
    ],
    isActive: true
  },
  {
    id: 'premium_monthly',
    tier: 'premium',
    tierCategory: 'premium',
    name: 'Premium (1 Ay)',
    headline: 'Aylık standart dilbilgisi ve kelime pratiği.',
    description: 'Aylık standart premium ile sınırsız dinleme ve kelime tekrarları.',
    type: 'subs',
    basePlanId: 'premium-monthly-standard',
    price: '₺189,99',
    rawPrice: 189.99,
    currency: '₺',
    periodLabel: '/ ay',
    durationMonths: 1,
    popular: false,
    color: 'from-blue-600 to-indigo-700',
    features: [
      'Sınırsız Doğal Sesli Dinleme (TTS)',
      'Kelime Tekrarı ve Flashcards',
      'Dil Bilgisi Gözden Geçirme',
      'Reklamsız Deneyim'
    ],
    isActive: true
  },
  {
    id: 'premium_bronze',
    tier: 'premium',
    tierCategory: 'premium',
    name: 'Glotvia Standard',
    description: 'Aylık esnek abonelik ile standart premium dil eğitimi.',
    type: 'subs',
    basePlanId: 'monthly-standard',
    price: '₺149,00',
    rawPrice: 149.00,
    currency: '₺',
    periodLabel: '/ ay',
    durationMonths: 1,
    popular: false,
    badge: 'STANDART',
    color: 'from-cyan-600 to-blue-700',
    features: [
      'Tüm Almanca Konuşma & Kalıp Kartları',
      '16 Dilde Doğal Sesli Dinleme',
      'Kelime Kartı & Favori Listesi',
      'Reklamsız Öğrenim Deneyimi'
    ],
    isActive: false
  },
  {
    id: 'premium_gold',
    tier: 'premium',
    tierCategory: 'premium',
    name: 'Glotvia Pro',
    description: 'Yıllık avantajlı abonelik ile kapsamlı dil eğitimi.',
    type: 'subs',
    basePlanId: 'yearly-standard',
    price: '₺690,00',
    rawPrice: 690.00,
    currency: '₺',
    periodLabel: '/ yıl',
    durationMonths: 12,
    popular: false,
    badge: 'PRO',
    color: 'from-blue-500 to-indigo-600',
    features: [
      'Standart paketindeki TÜM özellikler',
      'Akıllı Yazım & Dilbilgisi Hata Düzeltme',
      'Bulut Senkronizasyonu',
      'Resmi Glotvia Dil Sertifikası'
    ],
    isActive: false
  },
  {
    id: 'premium_platinum',
    tier: 'plus',
    tierCategory: 'plus',
    name: 'Glotvia Lifetime VIP',
    description: 'Tek seferlik ödeme ile ömür boyu sınırsız VIP Plus erişim.',
    type: 'inapp',
    price: '₺1.490,00',
    rawPrice: 1490.00,
    currency: '₺',
    periodLabel: 'Ömür Boyu',
    durationMonths: 999,
    popular: false,
    badge: 'TEK SEFERLİK VIP',
    color: 'from-amber-400 via-yellow-500 to-amber-600',
    features: [
      'Tüm Premium Plus hakları sınırsız',
      '24/7 Gemini 2.0 AI Sohbetleri',
      'Canlı Telaffuz & Goethe Simülasyonu',
      'Ömür boyu yenileme veya ek ücret YOK'
    ],
    isActive: false
  }
];

export interface BillingErrorResponse {
  code: string;
  userMessage: string;
  developerMessage: string;
}

/**
 * Standard Google Play Billing Response Codes to User-Friendly Turkish Messages
 */
export function mapBillingResultCodeToMessage(responseCode: string | number): BillingErrorResponse {
  switch (responseCode) {
    case 'USER_CANCELED':
    case 1:
      return {
        code: 'USER_CANCELED',
        userMessage: 'Satın alma işlemi sizin tarafınızdan iptal edildi.',
        developerMessage: 'User pressed back or cancelled the Google Play payment sheet.'
      };
    case 'SERVICE_UNAVAILABLE':
    case 2:
      return {
        code: 'SERVICE_UNAVAILABLE',
        userMessage: 'Google Play hizmetlerine şu anda ulaşılamıyor. Lütfen internet bağlantınızı kontrol ediniz.',
        developerMessage: 'Network error or Google Play services unavailable.'
      };
    case 'BILLING_UNAVAILABLE':
    case 3:
      return {
        code: 'BILLING_UNAVAILABLE',
        userMessage: 'Cihazınızda Google Play Billing kullanılamıyor veya Google hesabınız güncel değil.',
        developerMessage: 'Billing API version not supported for the type requested or Play Store missing.'
      };
    case 'ITEM_UNAVAILABLE':
    case 4:
      return {
        code: 'ITEM_UNAVAILABLE',
        userMessage: 'Bu paket şu anda satın alıma kapalı veya bölgenizde desteklenmiyor.',
        developerMessage: 'Product ID is not active or available in user country.'
      };
    case 'DEVELOPER_ERROR':
    case 5:
      return {
        code: 'DEVELOPER_ERROR',
        userMessage: 'Ödeme parametrelerinde bir hata oluştu. Lütfen uygulamayı güncelleyiniz.',
        developerMessage: 'Invalid arguments provided to Google Play Billing API.'
      };
    case 'ERROR':
    case 6:
      return {
        code: 'ERROR',
        userMessage: 'Google Play ödeme işlemi sırasında bir hata oluştu.',
        developerMessage: 'Fatal error during the API action.'
      };
    case 'ITEM_ALREADY_OWNED':
    case 7:
      return {
        code: 'ITEM_ALREADY_OWNED',
        userMessage: 'Bu ürün zaten Google Play hesabınızda mevcut. "Satın Almaları Geri Yükle" seçeneğini kullanabilirsiniz.',
        developerMessage: 'Failure to purchase since item is already owned.'
      };
    case 'ITEM_NOT_OWNED':
    case 8:
      return {
        code: 'ITEM_NOT_OWNED',
        userMessage: 'Geri yüklenecek veya tüketilecek aktif bir ürün bulunamadı.',
        developerMessage: 'Failure to consume/acknowledge since item is not owned.'
      };
    case 'NETWORK_ERROR':
    case 12:
      return {
        code: 'NETWORK_ERROR',
        userMessage: 'Google Play sunucularıyla bağlantı kurulamadı. İnternetinizi kontrol ediniz.',
        developerMessage: 'Transaction failed due to network timeout or loss.'
      };
    default:
      return {
        code: 'UNKNOWN',
        userMessage: 'Ödeme gerçekleştirilemedi. Lütfen tekrar deneyiniz.',
        developerMessage: `Unknown billing response: ${responseCode}`
      };
  }
}

/**
 * Check whether Digital Goods API / Google Play Billing is natively supported in current window
 */
export async function getDigitalGoodsServiceInstance(): Promise<any | null> {
  if (typeof window !== 'undefined' && 'getDigitalGoodsService' in window) {
    try {
      const service = await (window as any).getDigitalGoodsService('https://play.google.com/billing');
      return service;
    } catch (e) {
      console.warn('Digital Goods API service creation error:', e);
      return null;
    }
  }
  return null;
}

/**
 * Helper to calculate and format regional pricing based on user's country / currency
 */
export function getRegionalPlayProducts(userCountry?: string, userCurrency?: string): PlayBillingProduct[] {
  const currencyCode = (userCurrency || (userCountry === 'TR' ? 'TRY' : userCountry === 'US' ? 'USD' : userCountry === 'GB' ? 'GBP' : userCountry === 'JP' ? 'JPY' : userCountry === 'PL' ? 'PLN' : userCountry === 'RO' ? 'RON' : 'EUR')).toUpperCase();
  
  // Base rates relative to TRY base
  const rateConfig: Record<string, { symbol: string; rate: number; format: (val: number) => string }> = {
    TRY: { symbol: '₺', rate: 1, format: (v) => `₺${v.toFixed(2).replace('.', ',')}` },
    USD: { symbol: '$', rate: 0.028, format: (v) => `$${v.toFixed(2)}` },
    EUR: { symbol: '€', rate: 0.026, format: (v) => `€${v.toFixed(2)}` },
    GBP: { symbol: '£', rate: 0.022, format: (v) => `£${v.toFixed(2)}` },
    PLN: { symbol: 'zł', rate: 0.11, format: (v) => `${v.toFixed(2)} zł` },
    RON: { symbol: 'lei', rate: 0.13, format: (v) => `${v.toFixed(2)} lei` },
    JPY: { symbol: '¥', rate: 4.2, format: (v) => `¥${Math.round(v)}` },
    CAD: { symbol: 'C$', rate: 0.038, format: (v) => `C$${v.toFixed(2)}` },
    AUD: { symbol: 'A$', rate: 0.043, format: (v) => `A$${v.toFixed(2)}` },
    BRL: { symbol: 'R$', rate: 0.15, format: (v) => `R$${v.toFixed(2)}` }
  };

  const cfg = rateConfig[currencyCode] || rateConfig['EUR'];

  return PLAY_BILLING_PRODUCTS.map(prod => {
    const rawInCur = Math.round(prod.rawPrice * cfg.rate * 100) / 100;
    const origInCur = prod.originalPrice ? Math.round(prod.originalPrice * cfg.rate * 100) / 100 : undefined;
    const monthlyRaw = Math.round((rawInCur / (prod.durationMonths || 1)) * 100) / 100;

    return {
      ...prod,
      price: cfg.format(rawInCur),
      rawPrice: rawInCur,
      originalPrice: origInCur,
      originalPriceFormatted: origInCur ? cfg.format(origInCur) : undefined,
      monthlyEquivalent: `${cfg.format(monthlyRaw)} /ay`,
      currency: cfg.symbol
    };
  });
}

/**
 * Query dynamic Product Details and Localized Prices directly from Google Play
 */
export async function queryPlayStoreProducts(userCountry?: string, userCurrency?: string): Promise<PlayBillingProduct[]> {
  const digitalGoods = await getDigitalGoodsServiceInstance();
  if (!digitalGoods) {
    // Return catalog with regional localized prices based on user country
    return getRegionalPlayProducts(userCountry, userCurrency);
  }

  try {
    const itemIds = PLAY_BILLING_PRODUCTS.map(p => p.id);
    const details = await digitalGoods.getDetails(itemIds);

    if (details && Array.isArray(details) && details.length > 0) {
      return PLAY_BILLING_PRODUCTS.map(prod => {
        const remote = details.find((d: any) => d.itemId === prod.id);
        if (remote && remote.value && remote.currency) {
          return {
            ...prod,
            name: remote.title || prod.name,
            description: remote.description || prod.description,
            price: `${remote.currency} ${remote.value}`,
            rawPrice: parseFloat(remote.value) || prod.rawPrice,
            currency: remote.currency
          };
        }
        return prod;
      });
    }
  } catch (err) {
    console.warn('Failed to query localized details from Google Play:', err);
  }

  return getRegionalPlayProducts(userCountry, userCurrency);
}

/**
 * Launch Native Google Play Billing Sheet and Complete Purchase
 */
export async function executePlayBillingPurchase(
  product: PlayBillingProduct,
  userId: string,
  userEmail?: string
): Promise<{
  success: boolean;
  tier?: PremiumTier;
  orderId?: string;
  error?: BillingErrorResponse;
}> {
  const digitalGoods = await getDigitalGoodsServiceInstance();

  // If in pure browser preview or testing, simulate high-fidelity Google Play Billing response
  if (!digitalGoods) {
    // Simulated realistic delay of Google Play Sheet
    await new Promise(res => setTimeout(res, 900));

    const simulatedToken = `gp_token_${product.id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const simulatedOrderId = `GPA.${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10000 + Math.random() * 90000)}`;

    const verifyRes = await verifyGooglePlayPurchaseOnBackend({
      userId,
      userEmail,
      productId: product.id,
      purchaseToken: simulatedToken,
      orderId: simulatedOrderId
    });

    if (verifyRes.success) {
      return {
        success: true,
        tier: verifyRes.tier,
        orderId: verifyRes.orderId
      };
    } else {
      return {
        success: false,
        error: {
          code: verifyRes.errorCode || 'VERIFY_FAIL',
          userMessage: verifyRes.message,
          developerMessage: verifyRes.message
        }
      };
    }
  }

  // 1. Digital Goods API Real Device Execution (Android TWA / Play Store)
  try {
    const paymentMethods = [
      {
        supportedMethods: 'https://play.google.com/billing',
        data: {
          sku: product.id
        }
      }
    ];

    const paymentDetails = {
      total: {
        label: product.name,
        amount: {
          currency: product.currency === '₺' ? 'TRY' : product.currency,
          value: product.rawPrice.toString()
        }
      }
    };

    const request = new (window as any).PaymentRequest(paymentMethods, paymentDetails);
    const response = await request.show();

    const { purchaseToken, orderId } = response.details;

    if (!purchaseToken) {
      await response.complete('fail');
      return {
        success: false,
        error: mapBillingResultCodeToMessage('ERROR')
      };
    }

    // 2. Server-Side Verification with Google Play API
    const verifyRes = await verifyGooglePlayPurchaseOnBackend({
      userId,
      userEmail,
      productId: product.id,
      purchaseToken,
      orderId
    });

    if (verifyRes.success) {
      await response.complete('success');
      // 3. Acknowledge the purchase via Digital Goods API
      if (digitalGoods.acknowledge) {
        await digitalGoods.acknowledge(purchaseToken, 'repeatable').catch(() => {});
      }
      return {
        success: true,
        tier: verifyRes.tier,
        orderId: verifyRes.orderId || orderId
      };
    } else {
      await response.complete('fail');
      return {
        success: false,
        error: {
          code: verifyRes.errorCode || 'BACKEND_REJECT',
          userMessage: verifyRes.message,
          developerMessage: verifyRes.message
        }
      };
    }
  } catch (err: any) {
    console.error('Google Play purchase flow caught error:', err);
    if (err?.name === 'AbortError') {
      return {
        success: false,
        error: mapBillingResultCodeToMessage('USER_CANCELED')
      };
    }
    return {
      success: false,
      error: mapBillingResultCodeToMessage('ERROR')
    };
  }
}

/**
 * Open Google Play Subscription Management Deep Link
 */
export function openGooglePlaySubscriptionsManagement(productId: string = 'premium_gold') {
  const pkg = 'com.glotvia.app';
  const url = `https://play.google.com/store/account/subscriptions?sku=${encodeURIComponent(productId)}&package=${encodeURIComponent(pkg)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
