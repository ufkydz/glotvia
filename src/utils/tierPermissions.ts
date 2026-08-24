import { UserProfile, PremiumTier } from '../types';

export type NormalizedTier = 'free' | 'premium' | 'plus';

export interface TierFeatureComparisonItem {
  name: string;
  description: string;
  category: 'core' | 'ai' | 'practice' | 'pro';
  free: boolean | string;
  premium: boolean | string;
  plus: boolean | string;
  highlightPlus?: boolean;
}

export const TIER_FEATURE_COMPARISON: TierFeatureComparisonItem[] = [
  {
    name: 'Telafi Alanı & Akıllı Tekrar',
    description: 'Zayıf olduğunuz kelimeleri ve dilbilgisi hatalarını yapay zeka ile otomatik tespit edip özel pratik yaptırır.',
    category: 'practice',
    free: false,
    premium: false,
    plus: true,
    highlightPlus: true
  },
  {
    name: 'YZ ile Sohbetler (Gemini 2.0 Canlı AI)',
    description: '24/7 canlı yapay zeka dil eğitmeni ile gerçek hayat senaryolarında Almanca sohbet pratiği.',
    category: 'ai',
    free: false,
    premium: false,
    plus: true,
    highlightPlus: true
  },
  {
    name: 'Telaffuz Geri Bildirimi & Ses Analizi',
    description: 'Mikrofon ile konuşmanızı dinleyip kelime kelime fonetik doğruluk puanlaması ve düzeltme.',
    category: 'ai',
    free: false,
    premium: false,
    plus: true,
    highlightPlus: true
  },
  {
    name: 'Özel Kurslar & Goethe Sprechen',
    description: 'Goethe A1-B1 Sınav Simülasyonu, Sprechen Sesli Sınav Modülleri ve Alltagsdeutsch özel kartları.',
    category: 'pro',
    free: false,
    premium: false,
    plus: true,
    highlightPlus: true
  },
  {
    name: 'Serini Koru (Streak Freeze)',
    description: 'Giremediğiniz günlerde öğrenme serinizin sıfırlanmasını engelleyen otomatik dondurma koruması.',
    category: 'pro',
    free: false,
    premium: false,
    plus: true,
    highlightPlus: true
  },
  {
    name: 'Sınırsız Doğal Sesli Dinleme (TTS)',
    description: 'Tüm kelimeleri, diyalogları ve örnek cümleleri 16 dilde stüdyo kalitesinde sınırsız dinleme.',
    category: 'core',
    free: 'Günlük 3 Ses',
    premium: true,
    plus: true
  },
  {
    name: 'Kelime Tekrarı (Aralıklı Tekrar)',
    description: 'Kişiselleştirilmiş flashcard hafıza kartları ile kelimeleri uzun süreli hafızaya kaydetme.',
    category: 'practice',
    free: false,
    premium: true,
    plus: true
  },
  {
    name: 'Dil Bilgisi Gözden Geçirme',
    description: 'A1-B1 tüm dilbilgisi kuralları, fiil çekimleri, edatlar ve kalıp listeleri.',
    category: 'core',
    free: false,
    premium: true,
    plus: true
  },
  {
    name: 'Reklam Yok (Kesintisiz Deneyim)',
    description: 'Sıfır reklam ve kesintisiz odaklanma.',
    category: 'core',
    free: false,
    premium: true,
    plus: true
  },
  {
    name: 'Dersleri Atlama & Seviye Testi',
    description: 'Bildiğiniz konuları jet hızında atlayıp istediğiniz seviyeden devam edebilme.',
    category: 'core',
    free: false,
    premium: true,
    plus: true
  },
  {
    name: 'Çevrimdışı Mod & İnternetsiz Erişim',
    description: 'Dersleri ve kelime kartlarını indirip internet bağlantınız yokken çalışabilme.',
    category: 'pro',
    free: false,
    premium: true,
    plus: true
  },
  {
    name: 'Resmi Glotvia Dil Sertifikaları',
    description: 'Goethe ve CEFR uyumlu A1, A2 ve B1 seviye tamamlama dijital sertifikaları.',
    category: 'pro',
    free: false,
    premium: true,
    plus: true
  },
  {
    name: 'Glotvia Topluluğu & Temel Dersler',
    description: 'Topluluk paylaşımları, alfabe ve temel tanışma modülleri.',
    category: 'core',
    free: true,
    premium: true,
    plus: true
  },
  {
    name: 'Tüm Kursları Tamamla',
    description: 'Müfredattaki standart dersleri sırayla takip edebilme.',
    category: 'core',
    free: true,
    premium: true,
    plus: true
  }
];

/**
 * Normalize and determine the active tier of a user profile
 */
export function getUserTier(user: UserProfile | null): NormalizedTier {
  if (!user) return 'free';
  if (!user.isPremium) return 'free';

  // Check expiration if present
  const expiry = user.premiumExpiresAt || user.subscriptionExpiry;
  if (expiry && expiry < Date.now()) {
    return 'free';
  }

  const plan = String(user.subscriptionPlan || user.premiumPlan || '').toLowerCase().trim();

  // Plus Tiers (Highest level)
  if (
    plan === 'plus' ||
    plan === 'premium_plus' ||
    plan === 'platinum' ||
    plan === 'plus_yearly' ||
    plan === 'plus_monthly' ||
    plan === 'lifetime'
  ) {
    return 'plus';
  }

  // Standard Premium Tiers
  if (
    plan === 'premium' ||
    plan === 'gold' ||
    plan === 'bronze' ||
    plan === 'premium_yearly' ||
    plan === 'premium_monthly' ||
    plan === 'monthly' ||
    plan === 'yearly'
  ) {
    return 'premium';
  }

  // Default fallback if isPremium is true
  return 'premium';
}

/**
 * Turkish display name for tier
 */
export function getTierDisplayName(tier: NormalizedTier): string {
  switch (tier) {
    case 'plus':
      return 'Premium Plus';
    case 'premium':
      return 'Premium';
    case 'free':
    default:
      return 'Ücretsiz';
  }
}

/**
 * Styling badge configuration for tier
 */
export function getTierBadgeConfig(tier: NormalizedTier): {
  label: string;
  badgeClass: string;
  iconBg: string;
  textColor: string;
  glowColor: string;
} {
  switch (tier) {
    case 'plus':
      return {
        label: 'PREMIUM PLUS',
        badgeClass: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black border border-amber-300/60 shadow-[0_0_15px_rgba(251,191,36,0.4)]',
        iconBg: 'from-amber-400 via-orange-500 to-yellow-500',
        textColor: 'text-amber-300',
        glowColor: 'rgba(251, 191, 36, 0.35)'
      };
    case 'premium':
      return {
        label: 'PREMIUM',
        badgeClass: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]',
        iconBg: 'from-cyan-500 to-blue-600',
        textColor: 'text-cyan-300',
        glowColor: 'rgba(6, 182, 212, 0.3)'
      };
    case 'free':
    default:
      return {
        label: 'ÜCRETSİZ',
        badgeClass: 'bg-slate-800 text-slate-400 font-medium border border-slate-700',
        iconBg: 'from-slate-700 to-slate-800',
        textColor: 'text-slate-400',
        glowColor: 'transparent'
      };
  }
}

const DAILY_FREE_AUDIO_LIMIT = 3;

/**
 * Get daily audio listening stats for free users
 */
export function getDailyAudioListeningStats(): { used: number; remaining: number; limit: number } {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const key = `glotvia_audio_listens_${today}`;
    const raw = localStorage.getItem(key);
    const used = raw ? parseInt(raw, 10) || 0 : 0;
    const remaining = Math.max(0, DAILY_FREE_AUDIO_LIMIT - used);
    return { used, remaining, limit: DAILY_FREE_AUDIO_LIMIT };
  } catch {
    return { used: 0, remaining: DAILY_FREE_AUDIO_LIMIT, limit: DAILY_FREE_AUDIO_LIMIT };
  }
}

/**
 * Increment audio listen counter for free user
 */
export function recordAudioListen(): void {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const key = `glotvia_audio_listens_${today}`;
    const { used } = getDailyAudioListeningStats();
    localStorage.setItem(key, String(used + 1));
  } catch (e) {
    console.warn('Could not record audio listen', e);
  }
}

export interface FeatureAccessResult {
  allowed: boolean;
  userTier: NormalizedTier;
  requiredTier?: 'premium' | 'plus';
  featureName: string;
  reason?: string;
  remainingDailyFree?: number;
}

/**
 * 1. Audio Listening Access Check (Dinleme)
 * Free users get 3 free audio listens per day. Premium & Plus get unlimited.
 */
export function checkAudioListeningAccess(user: UserProfile | null): FeatureAccessResult {
  const tier = getUserTier(user);
  if (tier === 'plus' || tier === 'premium') {
    return {
      allowed: true,
      userTier: tier,
      featureName: 'Sınırsız Sesli Dinleme'
    };
  }

  const { remaining, limit } = getDailyAudioListeningStats();
  if (remaining > 0) {
    return {
      allowed: true,
      userTier: 'free',
      featureName: 'Sesli Dinleme',
      remainingDailyFree: remaining
    };
  }

  return {
    allowed: false,
    userTier: 'free',
    requiredTier: 'premium',
    featureName: 'Sesli Dinleme (TTS)',
    remainingDailyFree: 0,
    reason: `Ücretsiz planda günlük ${limit} ses dinleme limitine ulaştınız. Sınırsız dinlemek için Premium veya Premium Plus'a geçin.`
  };
}

/**
 * 2. Speaking / Pronunciation Access Check (Konuşma & Telaffuz Koçu)
 * Strictly restricted for Free and Standard Premium; Exclusive to Plus.
 */
export function checkSpeakingAccess(user: UserProfile | null): FeatureAccessResult {
  const tier = getUserTier(user);
  if (tier === 'plus') {
    return {
      allowed: true,
      userTier: 'plus',
      featureName: 'Canlı Telaffuz & Konuşma Koçu'
    };
  }

  return {
    allowed: false,
    userTier: tier,
    requiredTier: 'plus',
    featureName: 'Canlı Telaffuz & Ses Analizi',
    reason: 'Canlı telaffuz geri bildirimi ve mikrofon ile konuşma değerlendirmesi sadece Premium Plus üyelerine özeldir.'
  };
}

/**
 * 3. AI Chat Access Check (Gemini AI Dil Koçu & Sohbet)
 * Strictly restricted for Free and Standard Premium; Exclusive to Plus.
 */
export function checkAiChatAccess(user: UserProfile | null): FeatureAccessResult {
  const tier = getUserTier(user);
  if (tier === 'plus') {
    return {
      allowed: true,
      userTier: 'plus',
      featureName: 'YZ ile Canlı Sohbetler (Gemini 2.0)'
    };
  }

  return {
    allowed: false,
    userTier: tier,
    requiredTier: 'plus',
    featureName: 'YZ ile Sohbetler (Gemini AI 2.0)',
    reason: '24/7 yapay zeka ile interaktif sohbet ve konuşma koçluğu sadece Premium Plus üyelerine özeldir.'
  };
}

/**
 * 4. AI Writing Corrector Access Check (Yapay Zeka Hata Düzeltici)
 */
export function checkAiWritingCorrectorAccess(user: UserProfile | null): FeatureAccessResult {
  const tier = getUserTier(user);
  if (tier === 'plus') {
    return {
      allowed: true,
      userTier: 'plus',
      featureName: 'YZ Akıllı Dilbilgisi & Yazım Düzeltme'
    };
  }

  return {
    allowed: false,
    userTier: tier,
    requiredTier: 'plus',
    featureName: 'YZ Akıllı Düzeltme',
    reason: 'Metinlerinizi yapay zeka ile inceleyip ayrıntılı geri bildirim almak Premium Plus üyelerine özeldir.'
  };
}

/**
 * 5. Goethe Exam Simulation Access Check (Goethe Sınav Simülatörü)
 */
export function checkGoetheExamSimulationAccess(user: UserProfile | null): FeatureAccessResult {
  const tier = getUserTier(user);
  if (tier === 'plus') {
    return {
      allowed: true,
      userTier: 'plus',
      featureName: 'Goethe A1-B1 Sınav Simülasyonu'
    };
  }

  return {
    allowed: false,
    userTier: tier,
    requiredTier: 'plus',
    featureName: 'Özel Goethe Sınav Simülatörü',
    reason: 'Goethe Enstitüsü A1-B1 formatındaki dinamik sınav simülasyonu ve puanlama Premium Plus üyelerine özeldir.'
  };
}

/**
 * 6. Goethe Sprechen Module Access Check (Goethe Sprechen Modülü)
 */
export function checkGoetheSprechenAccess(user: UserProfile | null): FeatureAccessResult {
  const tier = getUserTier(user);
  if (tier === 'plus') {
    return {
      allowed: true,
      userTier: 'plus',
      featureName: 'Goethe Sprechen Sınav Kartları'
    };
  }

  return {
    allowed: false,
    userTier: tier,
    requiredTier: 'plus',
    featureName: 'Goethe Sprechen Sesli Modül',
    reason: 'Goethe Sprechen sesli sınav kartları ve konuşma hazırlığı Premium Plus üyelerine özeldir.'
  };
}

/**
 * 7. Telafi Alanı & Akıllı Hata Tekrarı (Mistake Recovery)
 */
export function checkMistakeRecoveryAccess(user: UserProfile | null): FeatureAccessResult {
  const tier = getUserTier(user);
  if (tier === 'plus') {
    return {
      allowed: true,
      userTier: 'plus',
      featureName: 'Telafi Alanı & Akıllı Tekrar'
    };
  }

  return {
    allowed: false,
    userTier: tier,
    requiredTier: 'plus',
    featureName: 'Telafi Alanı',
    reason: 'Önceki hatalarınızı yapay zeka ile toplayıp telafi etme alanı Premium Plus üyelerine özeldir.'
  };
}

/**
 * 8. Lesson Skip & Offline Mode Access Check
 */
export function checkSkipLessonsAccess(user: UserProfile | null): FeatureAccessResult {
  const tier = getUserTier(user);
  if (tier === 'plus' || tier === 'premium') {
    return {
      allowed: true,
      userTier: tier,
      featureName: 'Dersleri Atlama'
    };
  }

  return {
    allowed: false,
    userTier: 'free',
    requiredTier: 'premium',
    featureName: 'Dersleri Atlama & Hızlı İlerleme',
    reason: 'Dersleri sırayı beklemeden atlayabilmek için Premium veya Premium Plus üyeliği gereklidir.'
  };
}

/**
 * 9. Certificate Access Check
 */
export function checkCertificateAccess(user: UserProfile | null): FeatureAccessResult {
  const tier = getUserTier(user);
  if (tier === 'plus' || tier === 'premium') {
    return {
      allowed: true,
      userTier: tier,
      featureName: 'Glotvia Dil Sertifikası'
    };
  }

  return {
    allowed: false,
    userTier: 'free',
    requiredTier: 'premium',
    featureName: 'Resmi Başarı Sertifikası',
    reason: 'Müfredat bitirme ve CEFR uyumlu dijital başarı sertifikası Premium veya Premium Plus üyelerine sunulmaktadır.'
  };
}
