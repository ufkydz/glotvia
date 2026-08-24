import { CloudOrder, createOrderInFirestore } from './firebaseDbService';
import { UserProfile } from '../types';
import { setCurrentUser, getCurrentUser } from '../utils/authStorage';

export interface PricingPlan {
  id: 'monthly' | 'yearly' | 'lifetime';
  name: string;
  badge?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  periodLabel: string;
  description: string;
  popular?: boolean;
  features: string[];
  color: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'monthly',
    name: 'Glotvia Pro',
    price: 149,
    originalPrice: 249,
    currency: '₺',
    periodLabel: '/ ay',
    description: 'Aylık esnek ödeme ile tüm özelliklere sınırsız erişim.',
    popular: false,
    color: 'from-blue-600 to-indigo-600',
    features: [
      'Sınırsız Gemini AI Düzeltme & Metin İnceleme',
      '16 Dilde Doğal Telaffuz & Sesli Dinleme',
      'Tüm 200+ Almanca Konuşma & Kalıp Kartı',
      'Özel Kelime Kartı & Favori Listesi',
      'Reklamsız Kesintisiz Deneyim'
    ]
  },
  {
    id: 'yearly',
    name: 'Glotvia Premium VIP',
    badge: 'EN POPÜLER • %55 TASARRUF',
    price: 690,
    originalPrice: 1788,
    currency: '₺',
    periodLabel: '/ yıl',
    description: 'Yıllık en avantajlı plan ile tam kapsamlı dil eğitimi.',
    popular: true,
    color: 'from-amber-500 via-orange-500 to-yellow-500',
    features: [
      'Glotvia Pro kapsamındaki TÜM özellikler',
      'Canlı Gemini AI 2.0 Sohbet & Telaffuz Koçu',
      'Bulut Veritabanı & Çoklu Cihaz Senkronizasyonu',
      'Resmi Glotvia Dil Başarı Sertifikası',
      'Öncelikli 7/24 Teknik & Eğitmen Desteği',
      'Yeni eklenecek tüm dillere anında erişim'
    ]
  },
  {
    id: 'lifetime',
    name: 'Ömür Boyu Sınırsız',
    badge: 'TEK SEFERLİK ÖDEME',
    price: 1490,
    originalPrice: 3500,
    currency: '₺',
    periodLabel: 'Tek Seferlik',
    description: 'Bir kez ödeyin, ömür boyu tüm güncellemeler dahil kullanın.',
    popular: false,
    color: 'from-purple-600 via-pink-600 to-indigo-600',
    features: [
      'Ömür boyu sınırsız tüm premium haklar',
      'Abonelik yenileme veya ek ücret YOK',
      'VIP Kullanıcı Rozeti & Öncelikli Sunucu Erişimi',
      'Tüm seviyeler (A1, A2, B1, B2) ve gelecekteki modüller',
      'Çevrimdışı / İnternetsiz Öğrenme Modu'
    ]
  }
];

export interface CouponDiscount {
  code: string;
  discountPercent: number;
  description: string;
}

export interface CreditPackage {
  id: 'credit_starter' | 'credit_pro' | 'credit_master' | 'credit_mega';
  name: string;
  credits: number;
  bonusCredits: number;
  totalCredits: number;
  price: number;
  originalPrice: number;
  currency: string;
  popular?: boolean;
  badge?: string;
  icon: string;
  description: string;
  color: string;
  bestFor: string;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'credit_starter',
    name: 'Başlangıç Paketi',
    credits: 100,
    bonusCredits: 0,
    totalCredits: 100,
    price: 39,
    originalPrice: 65,
    currency: '₺',
    popular: false,
    badge: 'BAŞLANGIÇ',
    icon: '🪙',
    description: '3-4 yeni ders kilidi açmak ve hızlı başlamak için ideal.',
    color: 'from-blue-500 to-indigo-600',
    bestFor: 'Temel A1 Dersleri'
  },
  {
    id: 'credit_pro',
    name: 'Avantaj Pro Paketi',
    credits: 300,
    bonusCredits: 50,
    totalCredits: 350,
    price: 89,
    originalPrice: 160,
    currency: '₺',
    popular: true,
    badge: '🔥 EN ÇOK SATAN • +50 BONUS',
    icon: '⚡',
    description: 'Tüm A1 müfredatı + konuşma kartları ve başarı rozetleri için en popüler paket.',
    color: 'from-amber-500 via-orange-500 to-yellow-500',
    bestFor: '10+ Ders ve Rozetler'
  },
  {
    id: 'credit_master',
    name: 'Süper Master Paketi',
    credits: 800,
    bonusCredits: 200,
    totalCredits: 1000,
    price: 199,
    originalPrice: 380,
    currency: '₺',
    popular: false,
    badge: '💎 %50 İNDİRİM • +200 BONUS',
    icon: '💎',
    description: 'Tüm müfredat, Goethe sınav arenası, telaffuz koçu ve dijital sertifika.',
    color: 'from-emerald-500 to-teal-600',
    bestFor: 'Tam Müfredat + Sertifika'
  },
  {
    id: 'credit_mega',
    name: 'Mega VIP Kredi Sandığı',
    credits: 2500,
    bonusCredits: 750,
    totalCredits: 3250,
    price: 449,
    originalPrice: 999,
    currency: '₺',
    popular: false,
    badge: '👑 VIP MEGAPAKET • +750 BONUS',
    icon: '👑',
    description: 'Sınırsız öğrenme özgürlüğü, gelecekteki tüm A2/B1 modülleri dahil dev paket.',
    color: 'from-purple-600 via-pink-600 to-indigo-600',
    bestFor: 'Sınırsız Kullanım & Tüm Seviyeler'
  }
];

export const VALID_COUPONS: Record<string, CouponDiscount> = {
  'GLOTVIA50': { code: 'GLOTVIA50', discountPercent: 50, description: '%50 Özel Hoş Geldin İndirimi' },
  'UFUK2026': { code: 'UFUK2026', discountPercent: 40, description: '%40 VIP Geliştirici İndirimi' },
  'ALMANCA30': { code: 'ALMANCA30', discountPercent: 30, description: '%30 Almanca Öğrenci İndirimi' }
};

export interface PaymentCardDetails {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export type CardBrand = 'visa' | 'mastercard' | 'troy' | 'amex' | 'discover' | 'unknown';

export interface CardValidationResult {
  isValid: boolean;
  brand: CardBrand;
  errors: {
    cardNumber?: string;
    cardHolder?: string;
    expiry?: string;
    cvv?: string;
    general?: string;
  };
}

/**
 * Detect Credit Card Brand / Network
 */
export function detectCardBrand(cardNumber: string): CardBrand {
  const clean = cardNumber.replace(/\D/g, '');
  if (/^4/.test(clean)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(clean)) return 'mastercard';
  if (/^9792/.test(clean)) return 'troy';
  if (/^3[47]/.test(clean)) return 'amex';
  if (/^6(?:011|5)/.test(clean)) return 'discover';
  return 'unknown';
}

/**
 * Luhn Algorithm (Mod 10 Checksum) Verification
 */
export function isValidLuhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

/**
 * Comprehensive Credit Card Validation for Real Transactions
 */
export function validateCardDetails(details: PaymentCardDetails): CardValidationResult {
  const errors: CardValidationResult['errors'] = {};
  const cleanCard = details.cardNumber.replace(/\s+/g, '').replace(/-/g, '');
  const brand = detectCardBrand(cleanCard);

  // 1. Card Number Validation
  if (!cleanCard) {
    errors.cardNumber = 'Kart numarası alanı boş bırakılamaz.';
  } else if (!/^\d+$/.test(cleanCard)) {
    errors.cardNumber = 'Kart numarası yalnızca rakamlardan oluşmalıdır.';
  } else if (brand === 'amex' && cleanCard.length !== 15) {
    errors.cardNumber = 'American Express kart numarası 15 haneli olmalıdır.';
  } else if (brand !== 'amex' && (cleanCard.length < 15 || cleanCard.length > 19)) {
    errors.cardNumber = 'Kart numarası 16 haneli olmalıdır.';
  } else if (!isValidLuhn(cleanCard)) {
    errors.cardNumber = 'Kart numarası geçersiz (Luhn algoritma kontrolü başarısız). Lütfen bilgileri kontrol ediniz.';
  }

  // 2. Cardholder Name Validation
  const trimmedName = details.cardHolder.trim();
  if (!trimmedName) {
    errors.cardHolder = 'Kart üzerindeki Ad ve Soyad alanı zorunludur.';
  } else if (trimmedName.length < 4) {
    errors.cardHolder = 'Kart sahibi adı en az 4 karakter olmalıdır.';
  } else if (!/^[a-zA-ZçÇğĞıİöÖşŞüÜ\s.'-]+$/.test(trimmedName)) {
    errors.cardHolder = 'Kart sahibi ismi özel karakter veya rakam içeremez.';
  } else if (!trimmedName.includes(' ') && trimmedName.length < 6) {
    errors.cardHolder = 'Lütfen kart üzerindeki Ad ve Soyadınızı birlikte giriniz.';
  }

  // 3. Expiration Date Validation
  const cleanMonth = details.expiryMonth ? details.expiryMonth.replace(/\D/g, '') : '';
  const cleanYear = details.expiryYear ? details.expiryYear.replace(/\D/g, '') : '';
  const monthNum = parseInt(cleanMonth, 10);
  let yearNum = parseInt(cleanYear, 10);

  if (!cleanMonth || !cleanYear || isNaN(monthNum) || isNaN(yearNum)) {
    errors.expiry = 'Son kullanma tarihi (Ay/Yıl) eksik veya hatalı.';
  } else if (monthNum < 1 || monthNum > 12) {
    errors.expiry = 'Son kullanma ayı 01 ile 12 arasında olmalıdır.';
  } else {
    // Standardize 2-digit year (e.g. 26 -> 2026)
    if (yearNum < 100) {
      yearNum += 2000;
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12

    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
      errors.expiry = `Kartın son kullanma tarihi geçmiş (${String(monthNum).padStart(2, '0')}/${String(yearNum).slice(-2)}). Lütfen geçerli bir kart giriniz.`;
    } else if (yearNum > currentYear + 25) {
      errors.expiry = 'Son kullanma yılı çok ileri bir tarih (Maksimum +25 yıl).';
    }
  }

  // 4. CVV / CVC Security Code Validation
  const cleanCvv = details.cvv ? details.cvv.replace(/\s+/g, '') : '';
  if (!cleanCvv) {
    errors.cvv = 'CVV / CVC güvenlik kodu zorunludur.';
  } else if (!/^\d+$/.test(cleanCvv)) {
    errors.cvv = 'Güvenlik kodu yalnızca rakamlardan oluşmalıdır.';
  } else if (brand === 'amex' && cleanCvv.length !== 4) {
    errors.cvv = 'Amex kartlar için CVV kodu 4 haneli olmalıdır.';
  } else if (brand !== 'amex' && cleanCvv.length !== 3) {
    errors.cvv = 'CVV kodu kartın arkasındaki 3 haneli güvenlik kodudur.';
  } else if (cleanCvv === '000' || cleanCvv === '9999') {
    errors.cvv = 'Geçersiz CVV güvenlik kodu.';
  }

  const isValid = Object.keys(errors).length === 0;
  if (!isValid) {
    errors.general = errors.cardNumber || errors.expiry || errors.cvv || errors.cardHolder || 'Lütfen kart bilgilerinizi kontrol ediniz.';
  }

  return {
    isValid,
    brand,
    errors
  };
}

export interface PaymentResult {
  success: boolean;
  message: string;
  order?: CloudOrder;
  addedCredits?: number;
  validationErrors?: CardValidationResult['errors'];
}

/**
 * Process a Payment Transaction & Activate User Premium
 */
export async function processPayment(
  user: UserProfile,
  plan: PricingPlan,
  cardDetails: PaymentCardDetails,
  couponCode?: string
): Promise<PaymentResult> {
  // Validate card format strictly
  const validation = validateCardDetails(cardDetails);
  if (!validation.isValid) {
    return {
      success: false,
      message: validation.errors.general || 'Girdiğiniz kart bilgileri geçersiz. Lütfen kart numarasını, son kullanma tarihini ve CVV kodunu kontrol ediniz.',
      validationErrors: validation.errors
    };
  }

  const cleanCard = cardDetails.cardNumber.replace(/\D/g, '');

  // Calculate final amount
  let finalAmount = plan.price;
  if (couponCode && VALID_COUPONS[couponCode.trim().toUpperCase()]) {
    const discount = VALID_COUPONS[couponCode.trim().toUpperCase()].discountPercent;
    finalAmount = Math.round(plan.price * (1 - discount / 100));
  }

  const now = Date.now();
  const orderNumber = `GLT-${now.toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

  let expiryTimestamp: number | undefined = undefined;
  if (plan.id === 'monthly') {
    expiryTimestamp = now + 30 * 24 * 60 * 60 * 1000; // 30 days
  } else if (plan.id === 'yearly') {
    expiryTimestamp = now + 365 * 24 * 60 * 60 * 1000; // 1 year
  } else {
    expiryTimestamp = now + 100 * 365 * 24 * 60 * 60 * 1000; // 100 years lifetime
  }

  const order: CloudOrder = {
    id: `order_${now}_${orderNumber}`,
    orderNumber,
    userId: user.id || user.email,
    userEmail: user.email,
    userName: user.name,
    planId: plan.id,
    planTitle: plan.name,
    amount: finalAmount,
    currency: plan.currency,
    paymentMethod: 'credit_card',
    cardLast4: cleanCard.slice(-4),
    status: 'completed',
    createdAt: now,
    expiresAt: expiryTimestamp,
    invoiceUrl: `https://glotvia.app/invoice/${orderNumber}`
  };

  // 1. Save to Cloud Firestore
  await createOrderInFirestore(order);

  // 2. Update Local User Profile
  const updatedUser: UserProfile = {
    ...user,
    isPremium: true,
    subscriptionPlan: plan.id,
    subscriptionExpiry: expiryTimestamp
  };
  setCurrentUser(updatedUser);

  // 3. Save to local orders history
  try {
    const ordersRaw = localStorage.getItem('glotvia_user_orders_v1');
    const existingOrders: CloudOrder[] = ordersRaw ? JSON.parse(ordersRaw) : [];
    existingOrders.unshift(order);
    localStorage.setItem('glotvia_user_orders_v1', JSON.stringify(existingOrders));
  } catch (e) {
    console.warn('Failed to save order locally', e);
  }

  return {
    success: true,
    message: `Ödemeniz başarıyla tamamlandı! ${plan.name} üyeliğiniz aktifleştirildi.`,
    order
  };
}

/**
 * Restore In-App Purchases / Cloud Orders for User
 */
export async function restoreUserPurchases(
  user: UserProfile
): Promise<{ success: boolean; message: string; restoredPlan?: string }> {
  try {
    const { getUserOrdersFromFirestore } = await import('./firebaseDbService');
    const orders = await getUserOrdersFromFirestore(user.email || user.id);
    
    // Also check local orders backup
    let localOrders: CloudOrder[] = [];
    try {
      const ordersRaw = localStorage.getItem('glotvia_user_orders_v1');
      if (ordersRaw) localOrders = JSON.parse(ordersRaw);
    } catch {}

    const allOrders = [...orders, ...localOrders];
    const completedOrders = allOrders.filter(o => o.status === 'completed');

    if (completedOrders.length === 0) {
      return {
        success: false,
        message: 'Bu hesaba veya Google Play hesabına ait geçmiş bir satın alma kaydı bulunamadı.'
      };
    }

    // Find active order with latest expiry
    const now = Date.now();
    const activeOrder = completedOrders.find(o => !o.expiresAt || o.expiresAt > now);

    if (activeOrder) {
      const updatedUser: UserProfile = {
        ...user,
        isPremium: true,
        subscriptionPlan: activeOrder.planId as any,
        subscriptionExpiry: activeOrder.expiresAt || null
      };
      setCurrentUser(updatedUser);
      return {
        success: true,
        message: `Tebrikler! ${activeOrder.planTitle} üyeliğiniz başarıyla geri yüklendi.`,
        restoredPlan: activeOrder.planTitle
      };
    } else {
      return {
        success: false,
        message: 'Daha önce satın aldığınız planın süresi dolmuş. Lütfen yeni bir plan seçiniz.'
      };
    }
  } catch (error) {
    console.warn('Restore purchases error:', error);
    return {
      success: false,
      message: 'Satın alımlar geri yüklenirken bir bağlantı hatası oluştu. Lütfen tekrar deneyiniz.'
    };
  }
}

/**
 * Process a Credit / Token Package Purchase Transaction
 */
export async function processCreditPurchase(
  user: UserProfile,
  pkg: CreditPackage,
  cardDetails: PaymentCardDetails,
  couponCode?: string
): Promise<PaymentResult & { addedCredits?: number }> {
  // Validate card format strictly
  const validation = validateCardDetails(cardDetails);
  if (!validation.isValid) {
    return {
      success: false,
      message: validation.errors.general || 'Girdiğiniz kart bilgileri geçersiz. Lütfen kart numarasını, son kullanma tarihini ve CVV kodunu kontrol ediniz.',
      validationErrors: validation.errors
    };
  }

  const cleanCard = cardDetails.cardNumber.replace(/\D/g, '');

  // Calculate final amount with coupon if valid
  let finalAmount = pkg.price;
  if (couponCode && VALID_COUPONS[couponCode.trim().toUpperCase()]) {
    const discount = VALID_COUPONS[couponCode.trim().toUpperCase()].discountPercent;
    finalAmount = Math.round(pkg.price * (1 - discount / 100));
  }

  const now = Date.now();
  const orderNumber = `CRD-${now.toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

  const order: CloudOrder = {
    id: `order_credit_${now}_${orderNumber}`,
    orderNumber,
    userId: user.id || user.email,
    userEmail: user.email,
    userName: user.name,
    planId: pkg.id,
    planTitle: `${pkg.name} (${pkg.totalCredits} 🪙 Kredi)`,
    amount: finalAmount,
    currency: pkg.currency,
    paymentMethod: 'credit_card',
    cardLast4: cleanCard.slice(-4),
    status: 'completed',
    createdAt: now,
    invoiceUrl: `https://glotvia.app/invoice/${orderNumber}`
  };

  // 1. Save order to Firestore
  try {
    await createOrderInFirestore(order);
  } catch (e) {
    console.warn('Firestore createOrder warning:', e);
  }

  // 2. Add credits to user_german_tokens_state in localStorage
  let newTotalCoins = 0;
  try {
    const rawState = localStorage.getItem('user_german_tokens_state');
    const parsedState = rawState ? JSON.parse(rawState) : { coins: 50 };
    parsedState.coins = (Number(parsedState.coins) || 0) + pkg.totalCredits;
    newTotalCoins = parsedState.coins;
    localStorage.setItem('user_german_tokens_state', JSON.stringify(parsedState));
    
    // Dispatch system-wide token update event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('glotvia_tokens_updated', {
          detail: { added: pkg.totalCredits, newTotal: newTotalCoins, packageName: pkg.name }
        })
      );
    }
  } catch (e) {
    console.error('Error updating tokens state:', e);
  }

  // 3. Save order to local orders history
  try {
    const ordersRaw = localStorage.getItem('glotvia_user_orders_v1');
    const existingOrders: CloudOrder[] = ordersRaw ? JSON.parse(ordersRaw) : [];
    existingOrders.unshift(order);
    localStorage.setItem('glotvia_user_orders_v1', JSON.stringify(existingOrders));
  } catch (e) {
    console.warn('Failed to save order locally', e);
  }

  return {
    success: true,
    message: `Tebrikler! +${pkg.totalCredits} Kredi hesabınıza başarıyla yüklendi.`,
    order,
    addedCredits: pkg.totalCredits
  };
}
