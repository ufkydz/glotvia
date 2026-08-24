export type LanguageId = 
  | 'de' // Almanca / Deutsch
  | 'en' // İngilizce / English
  | 'es' // İspanyolca / Español
  | 'fr' // Fransızca / Français
  | 'it' // İtalyanca / Italiano
  | 'pt' // Portekizce / Português
  | 'nl' // Flemenkçe / Nederlands
  | 'pl' // Lehçe / Polski
  | 'ro' // Romence / Română
  | 'uk' // Ukraynaca / Українська
  | 'ru' // Rusça / Русский
  | 'ar' // Arapça / العربية
  | 'zh' // Çince / 中文
  | 'ja' // Japonca / 日本語
  | 'ko' // Korece / 한국어
  | 'hi' // Hintçe / हिन्दी
  | 'sv' // İsveççe / Svenska
  | 'el' // Yunanca / Ελληνικά
  | 'tr'; // Türkçe

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export type AgeGroup = 'under_18' | '18_24' | '25_34' | '35_50' | '50_plus';

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  defaultNativeLang: LanguageId;
}

export interface LanguageVocabularyItem {
  id: string;
  word: string;
  translation: string;
  level?: LanguageLevel | string;
  notes?: string;
  addedAt?: string;
  mastered?: boolean;
}

export interface LearningLanguageSlot {
  targetLanguage: LanguageId;
  level: LanguageLevel;
  progressPercentage: number;
  dailyGoalWords: number;
  learnedCardIds: string[];
  favoriteCardIds: string[];
  completedLessons: string[];
  totalXp: number;
  lastStudiedDate?: string;
  vocabularyList?: LanguageVocabularyItem[];
}

export interface LanguageInfo {
  id: LanguageId;
  name: string; // Turkish name e.g. "Almanca"
  nativeName: string; // "Deutsch"
  flag: string; // Emoji flag e.g. "🇩🇪"
  voiceCode: string; // BCP-47 voice code e.g. "de-DE"
  greeting: string; // "Hallo!"
  greetingPhonetic: string; // "[hal-lo]"
  greetingTr: string; // "Merhaba!"
  speakers: string; // "130+ Milyon"
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  color: string;
  description: string;
}

export interface CardTranslation {
  word: string;
  phonetic: string; // How it sounds in phonetics
  article?: string; // der / die / das / le / la / el / la / il / la etc.
  gender?: 'masculine' | 'feminine' | 'neuter';
  plural?: string;
  partOfSpeech?: 'noun' | 'verb' | 'adjective' | 'phrase' | 'preposition' | 'adverb';
  exampleSentence: string;
  exampleSentencePhonetic?: string;
  exampleSentenceTr: string;
  exampleTranslation?: string;
}

export interface UniversalVocabItem {
  id: string;
  category: string;
  sourceLanguage: LanguageId;
  targetLanguage: LanguageId;
  sourceText: string;
  targetText: string;
  pronunciation?: string;
  partOfSpeech?: string;
  article?: string;
  plural?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  difficultyLevel: LanguageLevel;
  imageUrl?: string;
  audioUrl?: string;
  verified?: boolean;
}

export interface Flashcard {
  id: string;
  category: string;
  categoryNameTr: string;
  turkishMeaning: string;
  word?: string;
  translation?: string;
  imageUrl: string;
  imageSearchQuery: string;
  imageDescription: string;
  verified: boolean;
  verificationNote?: string;
  disambiguation?: string;
  level?: 'A1' | 'A2' | 'B1' | 'B2';
  translations: Record<LanguageId, CardTranslation>;
}

export interface FlashcardCategory {
  id: string;
  nameTr: string;
  iconName: string;
  description: string;
  color: string;
}

export interface UserStats {
  xp: number;
  streak: number;
  level: number;
  learnedCardIds: string[];
  learnedCardIdsByLanguage?: Record<string, string[]>;
  favoriteCardIds: string[];
  completedQuizzesCount: number;
  highestQuizScore: number;
  lastActiveDate: string;
}

export type PremiumTier = 'free' | 'premium' | 'plus' | 'premium_plus' | 'bronze' | 'gold' | 'platinum';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  targetLanguage: LanguageId;
  nativeLanguage: LanguageId;
  currentLearningLanguage?: LanguageId;
  learningLanguages?: LearningLanguageSlot[];
  country?: string; // e.g. 'TR', 'DE', 'FR', 'US', 'GB', etc.
  level?: LanguageLevel; // 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  ageGroup?: AgeGroup; // 'under_18' | '18_24' | '25_34' | '35_50' | '50_plus'
  dailyGoal?: number; // 5, 10, 15, 20, 30 words/minutes
  currency?: string; // 'TRY', 'EUR', 'USD', 'GBP', 'PLN', etc.
  preferredVoice?: string;
  subscriptionStatus?: 'active' | 'inactive' | 'expired' | 'canceled';
  createdAt: string;
  password?: string;
  stats: UserStats;
  isEmailVerified?: boolean;
  emailVerifiedAt?: number | null;
  isPremium?: boolean;
  premiumPlan?: PremiumTier | 'monthly' | 'yearly' | 'lifetime' | 'plus_yearly' | 'plus_monthly' | 'premium_yearly' | 'premium_monthly';
  subscriptionPlan?: 'monthly' | 'yearly' | 'lifetime' | 'plus_yearly' | 'plus_monthly' | 'premium_yearly' | 'premium_monthly' | PremiumTier;
  subscriptionExpiry?: number | null;
  premiumExpiresAt?: number | null;
  activePurchaseToken?: string;
  googlePlayOrderId?: string;
}

export type PlayBillingState = 
  | 'IDLE' 
  | 'LOADING' 
  | 'PURCHASING' 
  | 'VERIFYING' 
  | 'SUCCESS' 
  | 'PENDING' 
  | 'ALREADY_OWNED' 
  | 'CANCELED' 
  | 'ERROR';

export type ProductType = 'subs' | 'inapp';

export interface PlayBillingProduct {
  id: string; // e.g. 'plus_yearly', 'plus_monthly', 'premium_yearly', 'premium_monthly', 'premium_gold'
  tier: PremiumTier;
  tierCategory?: 'plus' | 'premium';
  name: string;
  headline?: string;
  description: string;
  type: ProductType;
  basePlanId?: string;
  price: string; // Dynamic localized formatted price (e.g. "₺759,99")
  rawPrice: number;
  originalPrice?: number;
  originalPriceFormatted?: string;
  savingsPercent?: number;
  monthlyEquivalent?: string;
  currency: string;
  periodLabel: string;
  durationMonths: number;
  popular?: boolean;
  badge?: string;
  color: string;
  features: string[];
  isActive: boolean;
}

export interface GooglePlayPurchaseRecord {
  id: string;
  userId: string;
  userEmail: string;
  productId: string;
  tier: PremiumTier;
  purchaseToken: string;
  orderId: string;
  purchaseState: number; // 1 = PURCHASED, 2 = PENDING
  purchaseTime: number;
  expiryTime?: number | null;
  acknowledged: boolean;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'FAILED';
  createdAt: number;
  updatedAt: number;
}

export type ActiveTab = 'flashcards' | 'quiz' | 'languages' | 'aitutor' | 'profile' | 'pricing';

export interface QuizQuestion {
  id: string;
  type: 'image-to-word' | 'word-to-image' | 'audio-to-word' | 'sentence-fill';
  targetLanguage: LanguageId;
  flashcard: Flashcard;
  prompt: string;
  options: {
    id: string;
    text: string;
    imageUrl?: string;
    phonetic?: string;
    isCorrect: boolean;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  translation?: string;
  grammarTip?: string;
  phonetic?: string;
  timestamp: string;
}

export type CorrectionCategory = 
  | 'grammar' 
  | 'spelling' 
  | 'article' 
  | 'capitalization' 
  | 'word_order' 
  | 'vocabulary';

export interface CorrectionItem {
  originalPart: string;
  correctedPart: string;
  type: CorrectionCategory;
  explanationTr: string;
}

export interface VocabularyInsight {
  word: string;
  article?: string;
  meaningTr: string;
  example: string;
}

export interface WordPronunciationFeedback {
  word: string;
  accuracy: number; // 0 - 100
  status: 'perfect' | 'good' | 'needs_work';
  phoneticTarget: string; // e.g. [tsvantsih]
  phoneticSpoken?: string;
  tipTr?: string;
}

export interface PronunciationAssessmentResult {
  id: string;
  timestamp: number;
  targetPhrase: string;
  spokenText: string;
  overallScore: number; // 0 - 100
  fluencyScore: number;
  clarityScore: number;
  accuracyScore: number;
  level: 'A1' | 'A2' | 'B1';
  verdict: 'Mükemmel 🌟' | 'Çok İyi 👍' | 'Geliştirilebilir 🔄' | 'Tekrar Dene 🎙️';
  overallFeedbackTr: string;
  phoneticTranscriptionTr: string;
  germanPhoneticIpa?: string;
  wordsFeedback: WordPronunciationFeedback[];
  keyPhoneticRuleTr?: string;
  mouthPositionTipTr?: string;
  recommendedPracticeWords?: string[];
  awardedCoins?: number;
}

export interface TextCorrectionAnalysis {
  id: string;
  timestamp: number;
  originalText: string;
  correctedText: string;
  isCorrect: boolean;
  score: number; // 0 - 100
  overallFeedback: string;
  corrections: CorrectionItem[];
  translationTr: string;
  phonetic?: string;
  suggestedAlternatives: string[];
  vocabularyInsights: VocabularyInsight[];
  grammarRuleSummary?: string;
}

