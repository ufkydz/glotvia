import React, { useState, useEffect } from 'react';
import { 
  GERMAN_ALPHABET, 
  TURKISH_GERMAN_CONVERSIONS, 
  ESSENTIAL_VOCABULARY, 
  NUMBERS_0_12,
  NUMBERS_13_19,
  NUMBERS_20_1000,
  COMPOUND_NUMBER_EXAMPLES,
  convertNumberToGerman,
  DIALOGUE_CONFIGS,
  UserSpellingProfile,
  DEFAULT_USER_PROFILE,
  loadStoredUserProfile,
  saveStoredUserProfile,
  getGermanSpelling,
  CURRICULUM_TOPICS,
  CurriculumTopic,
  PRONUNCIATION_RULES,
  H_RULE_INFO,
  PRONUNCIATION_PRACTICE_WORDS,
  EXTRA_QUESTIONS,
  SICH_VORSTELLEN_DATA,
  SICH_VORSTELLEN_INTRO,
  HOBBY_VOCABULARY_DATA,
  ALLTAGSDEUTSCH_ITEMS,
  FEELING_DIALOGUES,
  W_FRAGEN_ITEMS,
  ESSENTIAL_VERBS_A1,
  ESSENTIAL_PREPOSITIONS_A1,
  ESSENTIAL_ADJECTIVES_A1,
  QUIZ_QUESTIONS,
  TOKEN_REWARDS_SHOP,
  UserTokenState,
  loadUserTokenState,
  saveUserTokenState
} from '../data/germanCurriculumData';
import { speakText, speakSequence, SpeechSequencePart } from '../utils/speechUtils';
import { playCoinSound, playSuccessChime } from '../utils/audioEffects';
import { AiWritingCorrector } from './AiWritingCorrector';
import { AiPronunciationCoach } from './AiPronunciationCoach';
import { CurriculumProgressChart } from './CurriculumProgressChart';
import { GoetheSprechenModule } from './GoetheSprechenModule';
import { GermanPronunciationModal } from './GermanPronunciationModal';
import { GermanConversationPractice } from './GermanConversationPractice';
import { GoetheQuizSimulation } from './GoetheQuizSimulation';
import { CurriculumAlltagsdeutschView } from './curriculum/CurriculumAlltagsdeutschView';
import { CurriculumWFragenView } from './curriculum/CurriculumWFragenView';
import { CurriculumVerbsView } from './curriculum/CurriculumVerbsView';
import { CurriculumPrepositionsAdjectivesView } from './curriculum/CurriculumPrepositionsAdjectivesView';
import { CurriculumVocabularyView } from './curriculum/CurriculumVocabularyView';
import { 
  GlassCard, GlassButton, GlassCapsule, GlassProgress, GlassNavigation, AiVoiceOrb 
} from './glass';
import { 
  Volume2, Play, CheckCircle2, Sparkles, BookOpen, 
  MessageSquare, ArrowRight, ArrowLeft, Search, 
  User, LogOut, Edit3, Save, RotateCcw, Check, Phone,
  Calendar, Briefcase, Heart, MapPin, Users, Info, Trash2,
  Hash, Calculator, ArrowDown, HelpCircle, Award, Coins,
  ShieldCheck, ShieldAlert, LogIn, Zap, Lock, Unlock, Trophy, CheckCircle,
  Share2, Download, RefreshCw, Layers, Compass, Navigation,
  Mail, Car, CreditCard, Home, VolumeX, Eye, EyeOff, Crown,
  Mic, MicOff, Smile, Filter, PlayCircle, PauseCircle, Bookmark,
  CheckCheck, Menu, X, ChevronRight, ChevronLeft, SlidersHorizontal,
  TrendingUp, BarChart3, Settings, Shuffle, RotateCw, Palette, Sun, Moon, Globe2, ArrowLeftRight
} from 'lucide-react';
import { UserProfile } from '../types';
import { 
  loadDisplaySettings, 
  saveDisplaySettings, 
  APP_THEMES, 
  AppDisplaySettings 
} from '../utils/themeManager';
import { ThemeCustomizerModal } from './ThemeCustomizerModal';
import { ThemeSettingsView } from './ThemeSettingsView';
import { AppSettingsView } from './AppSettingsView';
import { PremiumGateModal } from './PremiumGateModal';
import { LanguageSelectionModal } from './LanguageSelectionModal';
import { LANGUAGES_LIST, getLanguageInfo } from '../data/languagesData';
import { 
  checkAudioListeningAccess, 
  recordAudioListen, 
  checkSpeakingAccess, 
  checkAiWritingCorrectorAccess, 
  checkGoetheExamSimulationAccess, 
  checkGoetheSprechenAccess, 
  getUserTier, 
  getTierBadgeConfig, 
  getTierDisplayName
} from '../utils/tierPermissions';

interface GermanCurriculumViewProps {
  currentUser: UserProfile | null;
  onLogout?: () => void;
  onOpenAuth?: () => void;
  onOpenPricing?: (tab?: 'plans' | 'credits', packageId?: string) => void;
  onOpenPrivacy?: () => void;
  onOpenAccountSettings?: () => void;
  onOpenThemeModal?: () => void;
  onUserUpdate?: (updated: UserProfile) => void;
}

export const GermanCurriculumView: React.FC<GermanCurriculumViewProps> = ({
  currentUser,
  onLogout,
  onOpenAuth,
  onOpenPricing,
  onOpenPrivacy,
  onOpenAccountSettings,
  onOpenThemeModal,
  onUserUpdate
}) => {
  // Active Topic ID
  const [activeTopicId, setActiveTopicId] = useState<string>('alphabet');
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Theme state
  const [isInternalThemeModalOpen, setIsInternalThemeModalOpen] = useState(false);
  const [currentDisplaySettings, setCurrentDisplaySettings] = useState<AppDisplaySettings>(() => loadDisplaySettings());

  const handleOpenThemeCustomizer = () => {
    if (onOpenThemeModal) {
      onOpenThemeModal();
    } else {
      setIsInternalThemeModalOpen(true);
    }
  };

  useEffect(() => {
    const handleThemeChange = (e: any) => {
      if (e.detail) {
        setCurrentDisplaySettings(e.detail);
      } else {
        setCurrentDisplaySettings(loadDisplaySettings());
      }
    };
    window.addEventListener('glotvia_theme_changed', handleThemeChange);
    return () => window.removeEventListener('glotvia_theme_changed', handleThemeChange);
  }, []);

  // Token / Coin Economy State
  const [tokenState, setTokenState] = useState<UserTokenState>(() => loadUserTokenState());
  const [coinPopup, setCoinPopup] = useState<{ amount: number; message: string; id: number } | null>(null);

  // Listen for custom credit purchase events to immediately synchronize balance
  useEffect(() => {
    const handleTokenUpdated = () => {
      const fresh = loadUserTokenState();
      setTokenState(fresh);
    };

    window.addEventListener('glotvia_tokens_updated', handleTokenUpdated);
    window.addEventListener('storage', handleTokenUpdated);
    return () => {
      window.removeEventListener('glotvia_tokens_updated', handleTokenUpdated);
      window.removeEventListener('storage', handleTokenUpdated);
    };
  }, []);

  // User's custom profile values
  const [userProfile, setUserProfile] = useState<UserSpellingProfile>(() => {
    const stored = loadStoredUserProfile();
    if (stored.vorname === 'UFUK' && stored.nachname === 'YILDIZ' && stored.geburtsort === 'SAMSUN') {
      return DEFAULT_USER_PROFILE;
    }
    return stored;
  });

  // Inline editing state for dialogues
  const [editingField, setEditingField] = useState<keyof UserSpellingProfile | null>(null);
  const [saveToast, setSaveToast] = useState(false);
  const [spellingActiveSection, setSpellingActiveSection] = useState<'all' | 'sich_vorstellen' | 'form_coding' | 'hobbys' | 'wortschatz'>('all');

  // Alphabet search / filter & Audio Mode
  const [searchLetter, setSearchLetter] = useState('');
  const [alphabetSpeechSpeed, setAlphabetSpeechSpeed] = useState<number>(0.70);
  const [alphabetAudioMode, setAlphabetAudioMode] = useState<'full_german' | 'letter_only' | 'turkish_phonetic'>('full_german');

  // Pronunciation rules filter
  const [searchRule, setSearchRule] = useState('');

  // Interactive Number Generator State
  const [customNumberInput, setCustomNumberInput] = useState<string>('25');

  // Extra Questions custom answers state
  const [customQuestionAnswers, setCustomQuestionAnswers] = useState<Record<string, string>>({
    phone: '',
    id_number: '',
    house_number: '',
    area_code: '',
    distance: '',
    postal_code: '',
    car_plate: ''
  });

  // Alltagsdeutsch state
  const [alltagsCategoryFilter, setAlltagsCategoryFilter] = useState<'all' | 'begruessung' | 'abschied' | 'andere_saetze'>('all');
  const [alltagsSearchTerm, setAlltagsSearchTerm] = useState('');
  const [alltagsAudioMode, setAlltagsAudioMode] = useState<'german_only' | 'with_turkish'>('german_only');
  const [alltagsViewMode, setAlltagsViewMode] = useState<'cards' | 'flashcards'>('cards');
  const [alltagsCardIndex, setAlltagsCardIndex] = useState<number>(0);
  const [alltagsFlipped, setAlltagsFlipped] = useState<boolean>(false);
  const [selectedFeelingMood, setSelectedFeelingMood] = useState<Record<string, number>>({});

  // W-Fragen state & themed cards
  const [wFragenSearchTerm, setWFragenSearchTerm] = useState('');
  const [wFragenCategoryFilter, setWFragenCategoryFilter] = useState<string>('all');
  const [wFragenViewMode, setWFragenViewMode] = useState<'cards' | 'flashcards'>('cards');
  const [wFragenCardIndex, setWFragenCardIndex] = useState<number>(0);
  const [wFragenFlipped, setWFragenFlipped] = useState<boolean>(false);
  const [selectedWFrageId, setSelectedWFrageId] = useState<string>('wf_1');
  const [customWFrageNoun, setCustomWFrageNoun] = useState('');

  // Verbs state & themed cards
  const [verbSearchTerm, setVerbSearchTerm] = useState('');
  const [verbCategoryFilter, setVerbCategoryFilter] = useState<string>('all');
  const [verbViewMode, setVerbViewMode] = useState<'cards' | 'flashcards'>('cards');
  const [verbCardIndex, setVerbCardIndex] = useState<number>(0);
  const [verbFlipped, setVerbFlipped] = useState<boolean>(false);

  // Prepositions & Adjectives state & themed cards
  const [prepAdjTab, setPrepAdjTab] = useState<'all' | 'prepositions' | 'adjectives' | 'housing'>('all');
  const [prepAdjSearch, setPrepAdjSearch] = useState('');
  const [prepAdjViewMode, setPrepAdjViewMode] = useState<'cards' | 'flashcards'>('cards');
  const [prepAdjCardIndex, setPrepAdjCardIndex] = useState<number>(0);
  const [prepAdjFlipped, setPrepAdjFlipped] = useState<boolean>(false);
  const [vocabViewMode, setVocabViewMode] = useState<'cards' | 'flashcards' | 'list'>('cards');
  const [vocabCategoryFilter, setVocabCategoryFilter] = useState<string>('all');
  const [vocabCardIndex, setVocabCardIndex] = useState<number>(0);
  const [vocabFlipped, setVocabFlipped] = useState<boolean>(false);

  // Daily Bonus Modal State (+25 Points)
  const [isDailyBonusModalOpen, setIsDailyBonusModalOpen] = useState(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  // Shop / Rewards Modal & Lesson Unlock Modal
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [unlockModalTopic, setUnlockModalTopic] = useState<CurriculumTopic | null>(null);
  
  // Language Selection Modal State (Global Multi-Language Switcher)
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Premium Gate Modal State
  const [gateModal, setGateModal] = useState<{
    isOpen: boolean;
    featureTitle: string;
    featureDescription?: string;
    requiredTier?: 'premium' | 'plus';
    iconType?: 'audio' | 'speaking' | 'ai' | 'exam' | 'recovery' | 'generic';
  }>({
    isOpen: false,
    featureTitle: '',
    featureDescription: '',
    requiredTier: 'plus',
    iconType: 'generic'
  });

  // Pronunciation Modal State & Target
  const [isPronunciationModalOpen, setIsPronunciationModalOpen] = useState(false);
  const [pronunciationModalTarget, setPronunciationModalTarget] = useState<{
    germanText: string;
    turkishMeaning?: string;
    phoneticHint?: string;
  }>({
    germanText: 'Guten Tag, wie geht es Ihnen?',
    turkishMeaning: 'İyi günler, nasılsınız?',
    phoneticHint: 'Guutın Taak, vii geet es Iinın?'
  });
  const [pronunciationInitialPhrase, setPronunciationInitialPhrase] = useState<string | undefined>(undefined);

  const handleOpenPronunciationWithPhrase = (phrase: string, turkishMeaning?: string, phoneticHint?: string) => {
    const speakCheck = checkSpeakingAccess(currentUser);
    if (!speakCheck.allowed) {
      setGateModal({
        isOpen: true,
        featureTitle: 'Canlı Telaffuz & Konuşma Koçu',
        featureDescription: speakCheck.reason || 'Mikrofon ile konuşma değerlendirmesi ve sesli telaffuz koçluğu sadece Premium Plus üyelerine özeldir.',
        requiredTier: 'plus',
        iconType: 'speaking'
      });
      return;
    }
    setPronunciationInitialPhrase(phrase);
    setPronunciationModalTarget({
      germanText: phrase,
      turkishMeaning,
      phoneticHint
    });
    setIsPronunciationModalOpen(true);
  };

  // Slide-out Navigation Drawer State
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [drawerSearchQuery, setDrawerSearchQuery] = useState('');
  const tabsContainerRef = React.useRef<HTMLDivElement>(null);

  // Check if topic is unlocked (Strictly lock all lessons if not logged in!)
  const isTopicUnlocked = (topicId: string): boolean => {
    if (
      topicId === 'settings' ||
      topicId === 'theme_settings' || 
      topicId === 'progress_chart' || 
      topicId === 'ai_pronunciation' || 
      topicId === 'ai_writing' || 
      topicId === 'goethe_sprechen' ||
      topicId === 'goethe_exam_simulation'
    ) return true;
    if (!currentUser) return false;
    if (currentUser.isPremium) return true;
    const topic = CURRICULUM_TOPICS.find(t => t.id === topicId);
    if (topic && topic.creditCost === 0) return true;
    return (tokenState.unlockedLessons || []).includes(topicId);
  };

  // iOS 26-style Swipeable Lesson Transition State
  const currentTopicIndex = CURRICULUM_TOPICS.findIndex(t => t.id === activeTopicId);
  const prevTopic = currentTopicIndex > 0 ? CURRICULUM_TOPICS[currentTopicIndex - 1] : null;
  const nextTopic = currentTopicIndex < CURRICULUM_TOPICS.length - 1 ? CURRICULUM_TOPICS[currentTopicIndex + 1] : null;

  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState(false);

  // Safe navigation to a topic with credit gate and smooth transition
  const handleSelectTopic = (topicOrId: CurriculumTopic | string, forceDirection?: 'left' | 'right') => {
    if (typeof topicOrId === 'string') {
      if (topicOrId === 'ai_pronunciation') {
        const access = checkSpeakingAccess(currentUser);
        if (!access.allowed) {
          setIsNavDrawerOpen(false);
          setGateModal({
            isOpen: true,
            featureTitle: 'Canlı AI Telaffuz Koçu',
            featureDescription: access.reason || 'Mikrofon ile konuşma değerlendirmesi ve canlı ses analizi sadece Premium Plus üyelerine özeldir.',
            requiredTier: 'plus',
            iconType: 'speaking'
          });
          return;
        }
      } else if (topicOrId === 'ai_writing') {
        const access = checkAiWritingCorrectorAccess(currentUser);
        if (!access.allowed) {
          setIsNavDrawerOpen(false);
          setGateModal({
            isOpen: true,
            featureTitle: 'YZ ile Akıllı Dilbilgisi & Yazı Düzeltme',
            featureDescription: access.reason || 'Metinlerinizi yapay zeka ile inceleyip ayrıntılı geri bildirim almak sadece Premium Plus üyelerine özeldir.',
            requiredTier: 'plus',
            iconType: 'ai'
          });
          return;
        }
      } else if (topicOrId === 'goethe_sprechen') {
        const access = checkGoetheSprechenAccess(currentUser);
        if (!access.allowed) {
          setIsNavDrawerOpen(false);
          setGateModal({
            isOpen: true,
            featureTitle: 'Goethe Sprechen Sınav Kartları',
            featureDescription: access.reason || '130 resimli konuşma kartı ve Goethe Sprechen sesli sınav modülü sadece Premium Plus üyelerine özeldir.',
            requiredTier: 'plus',
            iconType: 'speaking'
          });
          return;
        }
      } else if (topicOrId === 'goethe_exam_simulation') {
        const access = checkGoetheExamSimulationAccess(currentUser);
        if (!access.allowed) {
          setIsNavDrawerOpen(false);
          setGateModal({
            isOpen: true,
            featureTitle: 'Goethe A1-B1 Sınav Simülatörü',
            featureDescription: access.reason || 'Goethe Enstitüsü formatındaki soru bankası ve sınav simülatörü sadece Premium Plus üyelerine özeldir.',
            requiredTier: 'plus',
            iconType: 'exam'
          });
          return;
        }
      }

      if (
        topicOrId === 'settings' ||
        topicOrId === 'theme_settings' || 
        topicOrId === 'ai_pronunciation' || 
        topicOrId === 'ai_writing' || 
        topicOrId === 'progress_chart' || 
        topicOrId === 'goethe_sprechen' ||
        topicOrId === 'goethe_exam_simulation'
      ) {
        setActiveTopicId(topicOrId);
        setIsNavDrawerOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    const topic = typeof topicOrId === 'string' 
      ? CURRICULUM_TOPICS.find(t => t.id === topicOrId)
      : topicOrId;
    
    if (!topic) return;
    if (topic.id === activeTopicId) {
      setIsNavDrawerOpen(false);
      return;
    }

    const targetIndex = CURRICULUM_TOPICS.findIndex(t => t.id === topic.id);
    const direction = forceDirection || (targetIndex > currentTopicIndex ? 'left' : 'right');

    if (isTopicUnlocked(topic.id)) {
      setSlideDirection(direction);
      setIsTransitioning(true);
      setIsNavDrawerOpen(false);
      
      setTimeout(() => {
        setActiveTopicId(topic.id);
        setTouchDeltaX(0);
        setIsSwiping(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        setTimeout(() => {
          setIsTransitioning(false);
          setSlideDirection(null);
        }, 180);
      }, 120);
    } else {
      setIsNavDrawerOpen(false);
      setUnlockModalTopic(topic);
    }
  };

  const goToPrevTopic = () => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (prevTopic) {
      handleSelectTopic(prevTopic, 'right');
    }
  };

  const goToNextTopic = () => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (nextTopic) {
      handleSelectTopic(nextTopic, 'left');
    }
  };

  // Touch Swipe Handlers for mobile & touchscreens (iOS 26 Style Fluid Swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('input, select, textarea, button, audio, video, .no-swipe')) {
      return;
    }
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    setIsSwiping(true);
    setTouchDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartX;
    const deltaY = currentY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 8) {
      let adjustedDelta = deltaX;
      if ((!prevTopic && deltaX > 0) || (!nextTopic && deltaX < 0)) {
        adjustedDelta = deltaX * 0.22;
      } else {
        adjustedDelta = deltaX * 0.70;
      }
      setTouchDeltaX(adjustedDelta);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;

    const swipeThreshold = 50;
    if (touchDeltaX < -swipeThreshold && nextTopic) {
      goToNextTopic();
    } else if (touchDeltaX > swipeThreshold && prevTopic) {
      goToPrevTopic();
    }

    setTouchStartX(null);
    setTouchStartY(null);
    setTouchDeltaX(0);
    setIsSwiping(false);
  };

  // Desktop Keyboard Arrow Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = document.activeElement;
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT' ||
        isShopModalOpen ||
        isCertificateOpen ||
        unlockModalTopic !== null ||
        isNavDrawerOpen
      ) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        goToPrevTopic();
      } else if (e.key === 'ArrowRight') {
        goToNextTopic();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTopicIndex, isShopModalOpen, isCertificateOpen, unlockModalTopic, isNavDrawerOpen]);

  // Unlock a lesson with credits
  const handleUnlockLessonWithCredits = (topic: CurriculumTopic) => {
    if (tokenState.coins < topic.creditCost) {
      return;
    }

    const updated: UserTokenState = {
      ...tokenState,
      coins: tokenState.coins - topic.creditCost,
      unlockedLessons: Array.from(new Set([...(tokenState.unlockedLessons || []), topic.id]))
    };
    setTokenState(updated);
    saveUserTokenState(updated);
    playSuccessChime();
    setCoinPopup({
      amount: -topic.creditCost,
      message: `🔓 ${topic.titleDe} Dersi Krediyle Açıldı!`,
      id: Date.now()
    });
    setTimeout(() => setCoinPopup(null), 3000);
    setActiveTopicId(topic.id);
    setUnlockModalTopic(null);
    setIsNavDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Daily bonus claim
  const todayStr = new Date().toISOString().slice(0, 10);
  const canClaimDailyBonus = tokenState.lastDailyBonusClaim !== todayStr;

  const handleClaimDailyBonus = () => {
    if (!canClaimDailyBonus) return;
    const bonus = 25;
    const updated: UserTokenState = {
      ...tokenState,
      coins: tokenState.coins + bonus,
      streakDays: (tokenState.streakDays || 1) + 1,
      lastDailyBonusClaim: todayStr
    };
    setTokenState(updated);
    saveUserTokenState(updated);
    playCoinSound();
    setCoinPopup({ amount: bonus, message: '🎁 Günlük Giriş Bonusu Alındı (+25 Kredi)!', id: Date.now() });
    setTimeout(() => setCoinPopup(null), 3000);
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      tabsContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Award Coins Helper
  const awardCoins = (amount: number, message: string) => {
    setTokenState(prev => {
      const updated = { ...prev, coins: prev.coins + amount };
      saveUserTokenState(updated);
      return updated;
    });
    playCoinSound();
    setCoinPopup({ amount, message, id: Date.now() });
    setTimeout(() => setCoinPopup(null), 2500);
  };

  // Complete a lesson/topic
  const handleCompleteTopic = (topicId: string, tokenReward: number) => {
    if (!tokenState.completedLessons.includes(topicId)) {
      setTokenState(prev => {
        const updated = {
          ...prev,
          coins: prev.coins + tokenReward,
          completedLessons: [...prev.completedLessons, topicId]
        };
        saveUserTokenState(updated);
        return updated;
      });
      playSuccessChime();
      setCoinPopup({ amount: tokenReward, message: '🎉 Dersi Başarıyla Tamamladın!', id: Date.now() });
      setTimeout(() => setCoinPopup(null), 3000);
    }
  };

  // Purchase reward item in Shop
  const handlePurchaseReward = (rewardId: string, cost: number) => {
    if (tokenState.coins < cost) {
      alert('Yetersiz Jeton! Dersleri tamamlayarak ve test çözerek daha fazla jeton kazanabilirsiniz.');
      return;
    }
    if (tokenState.unlockedRewards.includes(rewardId)) {
      return;
    }

    setTokenState(prev => {
      const updated = {
        ...prev,
        coins: prev.coins - cost,
        unlockedRewards: [...prev.unlockedRewards, rewardId]
      };
      saveUserTokenState(updated);
      return updated;
    });

    playSuccessChime();
    if (rewardId === 'certificate_a1_complete') {
      setIsCertificateOpen(true);
    }
  };

  // Save profile to localStorage whenever it changes
  const handleProfileFieldChange = (field: keyof UserSpellingProfile, value: string) => {
    setUserProfile(prev => {
      const updated = { ...prev, [field]: value.toUpperCase() };
      saveStoredUserProfile(updated);
      return updated;
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 1500);
  };

  const handleClearAllFields = () => {
    setUserProfile(DEFAULT_USER_PROFILE);
    saveStoredUserProfile(DEFAULT_USER_PROFILE);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 1500);
  };

  // Audio Access Gate Guard (Free user daily limit vs Unlimited Premium/Plus)
  const ensureAudioAllowed = (): boolean => {
    const access = checkAudioListeningAccess(currentUser);
    if (!access.allowed) {
      setGateModal({
        isOpen: true,
        featureTitle: 'Günlük Dinleme Sınırı',
        featureDescription: access.reason || 'Ücretsiz planda günlük 3 sesli dinleme hakkı bulunmaktadır. Sınırsız dinlemek için Premium veya Premium Plus üyeliğe geçin.',
        requiredTier: 'premium',
        iconType: 'audio'
      });
      return false;
    }
    if (getUserTier(currentUser) === 'free') {
      recordAudioListen();
    }
    return true;
  };

  const handlePlayAudio = async (text: string, id: string, tokenBonus: boolean = true) => {
    if (!ensureAudioAllowed()) return;
    try {
      setPlayingId(id);
      await speakText(text, 'de', alphabetSpeechSpeed);
      if (tokenBonus && Math.random() < 0.3) {
        awardCoins(2, 'Dinleme Bonusu');
      }
    } finally {
      setPlayingId(null);
    }
  };

  // Helper to format letter speech sequence based on active mode
  const getAlphabetLetterSpeechParts = (item: typeof GERMAN_ALPHABET[0]): SpeechSequencePart[] => {
    if (alphabetAudioMode === 'full_german') {
      // 100% Tam Almanca: "Großes A, kleines a" + Almanca Örnek Kelime
      const letterText = item.upper === 'ß' ? 'Eszett, scharfes S' : `Großes ${item.upper}, kleines ${item.lower}`;
      return [
        { text: letterText, languageId: 'de', rate: alphabetSpeechSpeed, pauseAfterMs: 450 },
        { text: item.exampleWord, languageId: 'de', rate: alphabetSpeechSpeed, pauseAfterMs: 0 }
      ];
    } else if (alphabetAudioMode === 'letter_only') {
      // Sade Almanca: Sadece "A, a" + Almanca Örnek Kelime
      const letterText = item.upper === 'ß' ? 'Eszett' : `${item.upper}, ${item.lower}`;
      return [
        { text: letterText, languageId: 'de', rate: alphabetSpeechSpeed, pauseAfterMs: 450 },
        { text: item.exampleWord, languageId: 'de', rate: alphabetSpeechSpeed, pauseAfterMs: 0 }
      ];
    } else {
      // Türkçe Anlatımlı: "Büyük se, küçük se" + Almanca Örnek Kelime
      const phon = item.pronunciation || item.lower;
      const letterText = item.upper === 'ß' ? 'Küçük eszett' : `Büyük ${phon}, küçük ${phon}`;
      return [
        { text: letterText, languageId: 'tr', rate: alphabetSpeechSpeed, pauseAfterMs: 400 },
        { text: item.exampleWord, languageId: 'de', rate: alphabetSpeechSpeed, pauseAfterMs: 0 }
      ];
    }
  };

  // Play alphabet letter followed by example word according to selected mode
  const handlePlayAlphabetLetter = async (item: typeof GERMAN_ALPHABET[0]) => {
    if (!ensureAudioAllowed()) return;
    const id = `alpha_${item.upper}`;
    if (playingId === id) {
      window.speechSynthesis?.cancel();
      setPlayingId(null);
      return;
    }

    setPlayingId(id);
    try {
      const parts = getAlphabetLetterSpeechParts(item);
      await speakSequence(parts);
      awardCoins(2, 'Alfabe & Örnek Dinleme Bonusu');
    } finally {
      setPlayingId(null);
    }
  };

  // Play single uppercase or lowercase letter according to selected mode
  const handlePlaySingleLetter = async (item: typeof GERMAN_ALPHABET[0], isUpper: boolean, id: string) => {
    if (!ensureAudioAllowed()) return;
    if (playingId === id) {
      window.speechSynthesis?.cancel();
      setPlayingId(null);
      return;
    }
    setPlayingId(id);
    try {
      if (alphabetAudioMode === 'full_german') {
        const phrase = item.upper === 'ß' ? 'Eszett' : (isUpper ? `Großes ${item.upper}` : `Kleines ${item.lower}`);
        await speakText(phrase, 'de', alphabetSpeechSpeed);
      } else if (alphabetAudioMode === 'letter_only') {
        const phrase = isUpper ? item.upper : item.lower;
        await speakText(phrase, 'de', alphabetSpeechSpeed);
      } else {
        const phon = item.pronunciation || item.lower;
        const phrase = item.upper === 'ß' ? 'Küçük eszett' : (isUpper ? `Büyük ${phon}` : `Küçük ${phon}`);
        await speakText(phrase, 'tr', alphabetSpeechSpeed);
      }
    } finally {
      setPlayingId(null);
    }
  };

  // Play all alphabet letters in sequence
  const handlePlayAllAlphabet = async () => {
    if (!ensureAudioAllowed()) return;
    const id = 'alpha_all_sequence';
    if (playingId === id) {
      window.speechSynthesis?.cancel();
      setPlayingId(null);
      return;
    }

    setPlayingId(id);
    try {
      for (const item of GERMAN_ALPHABET) {
        const parts = getAlphabetLetterSpeechParts(item);
        // Add inter-letter pause
        if (parts.length > 0) {
          parts[parts.length - 1].pauseAfterMs = 600;
        }
        await speakSequence(parts);
      }
      awardCoins(10, 'Tüm Alfabeyi Dinleme Bonusu');
    } finally {
      setPlayingId(null);
    }
  };


  // Play Alltagsdeutsch item with audio mode support
  const handlePlayAlltagsItem = async (item: typeof ALLTAGSDEUTSCH_ITEMS[0], forceId?: string) => {
    if (!ensureAudioAllowed()) return;
    const id = forceId || `ad_${item.id}`;
    if (playingId === id) {
      window.speechSynthesis?.cancel();
      setPlayingId(null);
      return;
    }

    setPlayingId(id);
    try {
      if (alltagsAudioMode === 'with_turkish') {
        const parts: SpeechSequencePart[] = [
          { text: item.german, languageId: 'de', rate: alphabetSpeechSpeed, pauseAfterMs: 400 },
          { text: item.turkish, languageId: 'tr', rate: alphabetSpeechSpeed, pauseAfterMs: 0 }
        ];
        await speakSequence(parts);
      } else {
        await speakText(item.german, 'de', alphabetSpeechSpeed);
      }
      awardCoins(2, 'Günlük İfade Dinlendi');
    } finally {
      setPlayingId(null);
    }
  };

  // Play all Alltagsdeutsch items in playlist sequence
  const handlePlayAllAlltags = async (items: typeof ALLTAGSDEUTSCH_ITEMS) => {
    if (!ensureAudioAllowed()) return;
    const id = 'ad_all_playlist';
    if (playingId === id) {
      window.speechSynthesis?.cancel();
      setPlayingId(null);
      return;
    }

    setPlayingId(id);
    try {
      for (const item of items) {
        if (alltagsAudioMode === 'with_turkish') {
          await speakSequence([
            { text: item.german, languageId: 'de', rate: alphabetSpeechSpeed, pauseAfterMs: 350 },
            { text: item.turkish, languageId: 'tr', rate: alphabetSpeechSpeed, pauseAfterMs: 500 }
          ]);
        } else {
          await speakText(item.german, 'de', alphabetSpeechSpeed);
          await new Promise(r => setTimeout(r, 600));
        }
      }
      awardCoins(15, 'Tüm Günlük İfadeler Dinlendi');
    } finally {
      setPlayingId(null);
    }
  };

  // Play Verb with its sample sentence
  const handlePlayVerbDetails = async (verb: typeof ESSENTIAL_VERBS_A1[0]) => {
    const id = `verb_${verb.id}`;
    if (playingId === id) {
      window.speechSynthesis?.cancel();
      setPlayingId(null);
      return;
    }

    setPlayingId(id);
    try {
      const parts: SpeechSequencePart[] = [
        { text: verb.german, languageId: 'de', rate: alphabetSpeechSpeed, pauseAfterMs: 400 },
        { text: verb.sampleSentenceDe, languageId: 'de', rate: alphabetSpeechSpeed, pauseAfterMs: 0 }
      ];
      await speakSequence(parts);
      awardCoins(2, 'Fiil & Örnek Cümle Dinlendi');
    } finally {
      setPlayingId(null);
    }
  };

  // Play all verbs sequentially
  const handlePlayAllVerbs = async (verbs: typeof ESSENTIAL_VERBS_A1) => {
    const id = 'verb_all_playlist';
    if (playingId === id) {
      window.speechSynthesis?.cancel();
      setPlayingId(null);
      return;
    }

    setPlayingId(id);
    try {
      for (const v of verbs) {
        await speakSequence([
          { text: v.german, languageId: 'de', rate: alphabetSpeechSpeed, pauseAfterMs: 300 },
          { text: v.sampleSentenceDe, languageId: 'de', rate: alphabetSpeechSpeed, pauseAfterMs: 600 }
        ]);
      }
      awardCoins(20, '40+ Fiil Çalma Listesi Dinlendi');
    } finally {
      setPlayingId(null);
    }
  };

  // Play W-Frage item with sample sentence
  const handlePlayWFrage = async (wf: typeof W_FRAGEN_ITEMS[0]) => {
    const id = `wf_${wf.id}`;
    if (playingId === id) {
      window.speechSynthesis?.cancel();
      setPlayingId(null);
      return;
    }

    setPlayingId(id);
    try {
      await speakSequence([
        { text: wf.german, languageId: 'de', rate: alphabetSpeechSpeed, pauseAfterMs: 350 },
        { text: wf.exampleDe, languageId: 'de', rate: alphabetSpeechSpeed, pauseAfterMs: 0 }
      ]);
      awardCoins(2, 'Soru Kalıbı Dinlendi');
    } finally {
      setPlayingId(null);
    }
  };

  // Play Preposition with sample sentence
  const handlePlayPreposition = async (prep: typeof ESSENTIAL_PREPOSITIONS_A1[0]) => {
    const id = `prep_${prep.id}`;
    if (playingId === id) {
      window.speechSynthesis?.cancel();
      setPlayingId(null);
      return;
    }

    setPlayingId(id);
    try {
      await speakSequence([
        { text: prep.german, languageId: 'de', rate: alphabetSpeechSpeed, pauseAfterMs: 350 },
        { text: prep.exampleSentenceDe, languageId: 'de', rate: alphabetSpeechSpeed, pauseAfterMs: 0 }
      ]);
      awardCoins(2, 'Edat & Cümle Dinlendi');
    } finally {
      setPlayingId(null);
    }
  };

  // Play Adjective with sample sentence
  const handlePlayAdjective = async (adj: typeof ESSENTIAL_ADJECTIVES_A1[0]) => {
    const id = `adj_${adj.id}`;
    if (playingId === id) {
      window.speechSynthesis?.cancel();
      setPlayingId(null);
      return;
    }

    setPlayingId(id);
    try {
      await speakSequence([
        { text: adj.german, languageId: 'de', rate: alphabetSpeechSpeed, pauseAfterMs: 350 },
        { text: adj.exampleSentenceDe, languageId: 'de', rate: alphabetSpeechSpeed, pauseAfterMs: 0 }
      ]);
      awardCoins(2, 'Sıfat & Cümle Dinlendi');
    } finally {
      setPlayingId(null);
    }
  };

  // Play letter-by-letter spelling dynamically based on the user's specific value
  const handlePlaySpellingSequence = async (rawWord: string, id: string) => {
    const spelling = getGermanSpelling(rawWord);
    if (!spelling.normalized) return;

    setPlayingId(id);
    try {
      await speakText('Ja gerne', 'de', 0.9);
      for (const item of spelling.chips) {
        if (item.char !== '␣' && item.char.trim()) {
          await speakText(item.char, 'de', 0.8);
          await new Promise(r => setTimeout(r, 180));
        }
      }
      awardCoins(5, 'Kodlama Tamamlandı');
    } finally {
      setPlayingId(null);
    }
  };

  // Handle quiz question answer
  const handleAnswerQuiz = (questionId: string, selectedIdx: number, correctIdx: number, reward: number) => {
    if (quizSubmitted[questionId]) return;

    setQuizAnswers(prev => ({ ...prev, [questionId]: selectedIdx }));
    setQuizSubmitted(prev => ({ ...prev, [questionId]: true }));

    if (selectedIdx === correctIdx) {
      awardCoins(reward, 'Doğru Cevap');
    }
  };

  // Filtered alphabet letters
  const filteredAlphabet = GERMAN_ALPHABET.filter(letter => {
    if (!searchLetter) return true;
    const query = searchLetter.toLowerCase();
    return (
      letter.upper.toLowerCase().includes(query) ||
      letter.pronunciation.toLowerCase().includes(query) ||
      (letter.exampleWord && letter.exampleWord.toLowerCase().includes(query)) ||
      (letter.exampleWordMeaning && letter.exampleWordMeaning.toLowerCase().includes(query))
    );
  });

  // Filtered pronunciation rules
  const filteredRules = PRONUNCIATION_RULES.filter(rule => {
    if (!searchRule) return true;
    const query = searchRule.toLowerCase();
    return (
      rule.letter.toLowerCase().includes(query) ||
      rule.pronunciation.toLowerCase().includes(query) ||
      rule.example.toLowerCase().includes(query) ||
      rule.meaning.toLowerCase().includes(query)
    );
  });

  // Custom number calculation
  const parsedCustomNum = parseInt(customNumberInput, 10);
  const customNumberResult = !isNaN(parsedCustomNum) ? convertNumberToGerman(parsedCustomNum) : null;

  // Active topic object
  const currentTopic = CURRICULUM_TOPICS.find(t => t.id === activeTopicId) || CURRICULUM_TOPICS[0];

  const completedCount = tokenState.completedLessons.length;
  const progressPercent = Math.round((completedCount / CURRICULUM_TOPICS.length) * 100);

  return (
    <div translate="no" className="notranslate min-h-screen w-full max-w-full overflow-x-hidden bg-slate-950 text-slate-100 pb-28">
      
      {/* ========================================================
          1. HEADER & TOP NAVIGATION BAR (CLEAN & MODERN)
      ======================================================== */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 shadow-md">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 py-2 flex items-center justify-between gap-1.5 sm:gap-2">
          
          {/* Logo & Brand & Drawer Toggle */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsNavDrawerOpen(true)}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-400 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
              title="Tüm Dersler Menüsü"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <button
                type="button"
                onClick={() => setIsLanguageModalOpen(true)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-amber-500 p-[1.5px] shadow-md shadow-indigo-500/20 shrink-0 hover:scale-105 transition-all cursor-pointer"
                title="Dili Değiştir (19+ Dünya Dili)"
              >
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-xs sm:text-sm font-black">
                  {getLanguageInfo(currentUser?.targetLanguage || 'de').flag}
                </div>
              </button>
              <div className="flex items-center space-x-1 sm:space-x-1.5">
                <h1 className="text-sm sm:text-base font-black text-white tracking-tight">
                  glotvia
                </h1>
                <button
                  type="button"
                  onClick={() => setIsLanguageModalOpen(true)}
                  className="text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 border border-indigo-500/30 whitespace-nowrap cursor-pointer transition-all flex items-center gap-1"
                  title="Dili Değiştir"
                >
                  <span>{getLanguageInfo(currentUser?.targetLanguage || 'de').name}</span>
                  <span className="text-[8px] opacity-70">▼</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats & Actions Cluster */}
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            
            {/* Primary Multi-Language Switcher Button */}
            <button
              type="button"
              onClick={() => setIsLanguageModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-400/50 hover:border-amber-300 rounded-full text-amber-200 font-black text-xs shadow-md shadow-amber-500/15 transition-all active:scale-95 cursor-pointer"
              title="Dili Değiştir (19+ Dil • Türkçe, Almanca, İngilizce, Fransızca, İspanyolca...)"
            >
              <span className="text-xs">{getLanguageInfo(currentUser?.targetLanguage || 'de').flag}</span>
              <span className="text-[11px] sm:text-xs">🌐 Dili Değiştir</span>
            </button>

            {/* Daily Gift (+25 Kredi) Button */}
            {canClaimDailyBonus ? (
              <button
                type="button"
                onClick={() => setIsDailyBonusModalOpen(true)}
                className="inline-flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-full shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer animate-pulse shrink-0"
                title="Günün 25 Kredi Hediyesini Al"
              >
                <span className="text-xs">🎁</span>
                <span className="text-[11px] font-black">+25 Hediye</span>
              </button>
            ) : null}

            {/* Streak */}
            <div className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-xs font-bold text-rose-400 shadow-sm">
              <span className="text-xs">🔥</span>
              <span className="font-mono text-xs">{tokenState.streakDays || 1}</span>
            </div>

            {/* Coins Wallet & Top-up */}
            <button
              type="button"
              onClick={() => {
                if (!currentUser) {
                  if (onOpenAuth) onOpenAuth();
                  return;
                }
                if (onOpenPricing) onOpenPricing('credits');
                else setIsShopModalOpen(true);
              }}
              className="inline-flex items-center space-x-1 px-2 sm:px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-400/60 rounded-full text-amber-300 font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer group"
              title={currentUser ? "Kredi Cüzdanı & Kredi Satın Al" : "Giriş Yaparak Kredi Alın"}
            >
              <span>🪙</span>
              <span className="font-mono text-xs">{currentUser ? tokenState.coins : 0}</span>
              <span className="text-[9px] sm:text-[10px] bg-amber-400/25 text-amber-300 px-1.5 py-0.2 rounded-full font-black group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">{currentUser ? '+Al' : 'Giriş'}</span>
            </button>

            {/* Settings & Theme Customizer Button */}
            <button
              type="button"
              onClick={() => {
                setActiveTopicId('settings');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 border border-cyan-400/50 hover:border-cyan-300 rounded-full text-cyan-200 font-black text-xs shadow-md shadow-cyan-500/15 transition-all active:scale-95 cursor-pointer"
              title="Ayarlar & Tema Değiştirme (Ferah Açık/Koyu Mod, Renkler, Font Büyüklüğü)"
            >
              <Settings className="w-3.5 h-3.5 text-cyan-300" />
              <span className="text-[11px] sm:text-xs">⚙️ Ayarlar</span>
            </button>

            {/* Premium Button */}
            {onOpenPricing && (
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    if (onOpenAuth) onOpenAuth();
                    return;
                  }
                  onOpenPricing('plans');
                }}
                className={`inline-flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-black transition-all shadow-sm active:scale-95 cursor-pointer ${
                  getUserTier(currentUser) === 'plus'
                    ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 text-white shadow-purple-500/20'
                    : getUserTier(currentUser) === 'premium'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-amber-500/20'
                    : 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 border border-amber-500/40'
                }`}
                title="Üyelik & Premium Planlar"
              >
                <Crown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {getUserTier(currentUser) === 'plus' 
                    ? 'PLUS 👑' 
                    : getUserTier(currentUser) === 'premium' 
                    ? 'PREMIUM ⭐' 
                    : 'PRO YÜKSELT'}
                </span>
                <span className="sm:hidden">
                  {getUserTier(currentUser) === 'plus' 
                    ? 'PLUS' 
                    : getUserTier(currentUser) === 'premium' 
                    ? 'VIP' 
                    : 'PRO'}
                </span>
              </button>
            )}

            {/* Auth / Account Profile */}
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  if (onOpenAccountSettings) onOpenAccountSettings();
                  else if (onOpenAuth) onOpenAuth();
                }}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center text-xs font-black hover:scale-105 transition-all cursor-pointer shrink-0"
                title="Hesap Ayarları"
              >
                {currentUser.name.charAt(0).toUpperCase()}
              </button>
            ) : onOpenAuth ? (
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-2.5 sm:px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer shrink-0"
              >
                Giriş
              </button>
            ) : null}

          </div>

        </div>

        {/* Global Progress Line */}
        <div className="w-full bg-slate-900/60 h-[2px]">
          <div 
            className="bg-gradient-to-r from-indigo-500 via-amber-400 to-emerald-400 h-[2px] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* ========================================================
          2. TOPIC NAVIGATION TABS (STREAMLINED SCROLLBAR)
      ======================================================== */}
      <div className="sticky top-[49px] z-30 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 py-2 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-1.5">
          
          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={() => scrollTabs('left')}
            className="shrink-0 p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer"
            title="Sola Kaydır"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Horizontal Scrollable Tabs */}
          <div 
            ref={tabsContainerRef}
            className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5 px-0.5"
          >
            {/* Dedicated Featured LANGUAGE SELECTOR Tab */}
            <button
              type="button"
              onClick={() => setIsLanguageModalOpen(true)}
              className="relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all border shrink-0 cursor-pointer bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-yellow-500/20 text-amber-200 border-amber-400/50 hover:border-amber-300 shadow-sm active:scale-95"
              title="Dili Değiştir (19+ Dil • Türkçe, Almanca, İngilizce, Fransızca, İspanyolca...)"
            >
              <span>{getLanguageInfo(currentUser?.targetLanguage || 'de').flag}</span>
              <span className="whitespace-nowrap">🌐 Dili Değiştir</span>
            </button>

            {/* Dedicated Featured SETTINGS & THEME Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveTopicId('settings');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all border shrink-0 cursor-pointer ${
                activeTopicId === 'settings' || activeTopicId === 'theme_settings'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 border-cyan-300 shadow-md shadow-cyan-500/25 scale-105'
                  : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40 hover:bg-cyan-900/70 hover:text-white hover:border-cyan-300'
              }`}
              title="Uygulama Ayarları, Tema, Ferah Arka Plan ve Yazı Boyutu"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">⚙️ Ayarlar &amp; Tema</span>
            </button>

            {/* Dedicated Progress Chart Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveTopicId('progress_chart');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all border shrink-0 cursor-pointer ${
                activeTopicId === 'progress_chart'
                  ? 'bg-indigo-500 text-white border-indigo-300 shadow-md shadow-indigo-500/25 scale-105'
                  : 'bg-indigo-950/50 text-indigo-300 border-indigo-500/30 hover:bg-indigo-900/60 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">📊 Gelişim</span>
            </button>

            {CURRICULUM_TOPICS.map((topic) => {
              const isActive = topic.id === activeTopicId;
              const isCompleted = tokenState.completedLessons.includes(topic.id);
              const isUnlocked = isTopicUnlocked(topic.id);

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => handleSelectTopic(topic)}
                  className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-black'
                      : isCompleted
                      ? 'bg-emerald-950/30 text-emerald-300 border-emerald-800/50 hover:bg-emerald-900/40'
                      : isUnlocked
                      ? 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                      : 'bg-slate-950/90 text-slate-400 border-slate-800/80 hover:border-amber-500/40 hover:text-amber-300'
                  }`}
                >
                  <span className={`text-[10px] font-mono font-black ${isActive ? 'text-slate-950' : 'text-slate-500'}`}>
                    #{topic.number}
                  </span>
                  <span className="whitespace-nowrap">
                    {topic.titleDe}
                  </span>
                  {isCompleted && (
                    <CheckCircle className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-emerald-400'}`} />
                  )}
                  {!isUnlocked && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      🔒 {topic.creditCost}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={() => scrollTabs('right')}
            className="shrink-0 p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer"
            title="Sağa Kaydır"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>

      {/* ========================================================
          SLIDE-OUT NAVIGATION DRAWER (KAYDIRMALI YAN MENÜ)
      ======================================================== */}
      {isNavDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsNavDrawerOpen(false)}
          />

          {/* Drawer Sidebar Content */}
          <div className="relative w-full max-w-sm sm:max-w-md bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col h-full z-10 transform transition-transform duration-300 ease-out">
            
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/90">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-black text-sm">
                  📚
                </div>
                <div>
                  <h3 className="text-base font-black text-white">glotvia Müfredat Menüsü</h3>
                  <p className="text-xs text-slate-400">Toplam 13 Ders & AI Araçları</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsNavDrawerOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                title="Menüyü Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress & Coin summary */}
            <div className="px-4 py-3 bg-gradient-to-r from-indigo-950/40 to-slate-950 border-b border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">Genel İlerleme</span>
                <span className="text-sm font-black text-amber-400">%{progressPercent} Tamamlandı ({completedCount}/{CURRICULUM_TOPICS.length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 font-bold text-xs flex items-center space-x-1">
                  <span>🪙</span>
                  <span>{tokenState.coins}</span>
                </div>
                <div className="px-2.5 py-1 bg-rose-500/20 border border-rose-500/30 rounded-full text-rose-300 font-bold text-xs flex items-center space-x-1">
                  <span>🔥</span>
                  <span>{tokenState.streakDays}g</span>
                </div>
              </div>
            </div>

            {/* Quick Feature: Language Switcher in Drawer */}
            <div className="p-3 bg-gradient-to-r from-amber-950/80 via-orange-950/70 to-slate-900 border-b border-amber-500/30">
              <button
                type="button"
                onClick={() => {
                  setIsNavDrawerOpen(false);
                  setIsLanguageModalOpen(true);
                }}
                className="w-full py-2.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 rounded-xl text-amber-200 hover:text-white font-extrabold text-xs flex items-center justify-between transition-all cursor-pointer shadow-sm select-none"
              >
                <div className="flex items-center space-x-2 pointer-events-none select-none">
                  <span className="text-base">{getLanguageInfo(currentUser?.targetLanguage || 'de').flag}</span>
                  <div className="text-left">
                    <div className="text-white text-xs font-black">🌐 Dili Değiştir (19+ Dil)</div>
                    <div className="text-[10px] text-amber-300">
                      {getLanguageInfo(currentUser?.nativeLanguage || 'tr').name} → {getLanguageInfo(currentUser?.targetLanguage || 'de').name}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-300 pointer-events-none" />
              </button>
            </div>

            {/* Quick Feature: Settings & Theme in Drawer */}
            <div className="p-3 bg-gradient-to-r from-cyan-950/80 via-blue-950/70 to-slate-900 border-b border-cyan-500/30">
              <button
                type="button"
                onClick={() => {
                  setIsNavDrawerOpen(false);
                  setActiveTopicId('settings');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2.5 px-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 rounded-xl text-cyan-200 hover:text-white font-extrabold text-xs flex items-center justify-between transition-all cursor-pointer shadow-sm select-none"
              >
                <div className="flex items-center space-x-2 pointer-events-none select-none">
                  <Settings className="w-4 h-4 text-cyan-300" />
                  <div className="text-left">
                    <div className="text-white text-xs font-black">⚙️ Ayarlar &amp; Tema</div>
                    <div className="text-[10px] text-cyan-300">Ferah Açık Mod, Renkler &amp; Profil</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-cyan-300 pointer-events-none" />
              </button>
            </div>

            {/* Daily Bonus Claim in Drawer */}
            {canClaimDailyBonus && (
              <div className="p-3 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/40 border-b border-emerald-500/30 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-base shrink-0 animate-bounce">
                    🎁
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-emerald-300 truncate">Günlük Giriş Hediyesi</div>
                    <div className="text-[10px] text-slate-400 truncate">+25 Kredi Hesabına Ekle</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClaimDailyBonus}
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center space-x-1 active:scale-95 shrink-0 cursor-pointer"
                >
                  <span>Al</span>
                  <span>✨</span>
                </button>
              </div>
            )}

            {/* Search filter in drawer */}
            <div className="p-3 border-b border-slate-800/80">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={drawerSearchQuery}
                  onChange={(e) => setDrawerSearchQuery(e.target.value)}
                  placeholder="Ders ara (Alfabe, Sayılar, Alltagsdeutsch...)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Drawer Topics List (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
              {CURRICULUM_TOPICS
                .filter(topic => {
                  if (!drawerSearchQuery) return true;
                  const q = drawerSearchQuery.toLowerCase();
                  return (
                    topic.titleDe.toLowerCase().includes(q) ||
                    topic.titleTr.toLowerCase().includes(q) ||
                    topic.description.toLowerCase().includes(q) ||
                    topic.badge.toLowerCase().includes(q)
                  );
                })
                .map((topic) => {
                  const isActive = topic.id === activeTopicId;
                  const isCompleted = tokenState.completedLessons.includes(topic.id);
                  const isUnlocked = isTopicUnlocked(topic.id);

                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => handleSelectTopic(topic)}
                      className={`w-full p-3.5 rounded-2xl border transition-all flex items-start justify-between text-left group select-none cursor-pointer active:scale-[0.98] ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                          : isCompleted
                          ? 'bg-emerald-950/30 border-emerald-800/50 hover:bg-emerald-900/40 text-slate-200'
                          : isUnlocked
                          ? 'bg-slate-950/80 border-slate-800 hover:border-indigo-500/40 hover:bg-slate-800/60 text-slate-200'
                          : 'bg-slate-950/50 border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3 min-w-0 pointer-events-none select-none">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                          isActive
                            ? 'bg-slate-950 text-amber-400'
                            : !isUnlocked
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : isCompleted
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {!isUnlocked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : `#${topic.number}`}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className={`text-sm font-black truncate ${isActive ? 'text-slate-950' : 'text-white group-hover:text-amber-300'}`}>
                              {topic.titleDe}
                            </h4>
                            {isCompleted && (
                              <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-slate-950' : 'text-emerald-400'}`} />
                            )}
                          </div>
                          <p className={`text-xs font-medium truncate mt-0.5 ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                            {topic.titleTr}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-[10px] font-bold ${isActive ? 'text-slate-800' : 'text-indigo-400'}`}>
                              {topic.badge} • ⏱️ {topic.estimatedMinutes} dk
                            </span>
                            {!isUnlocked && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                Giriş: {topic.creditCost} Kredi
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-right ml-2 pointer-events-none select-none">
                        {!isUnlocked ? (
                          <span className="text-xs font-black px-2 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                            <Lock className="w-3 h-3 text-amber-400" />
                            <span>{topic.creditCost} 🪙</span>
                          </span>
                        ) : (
                          <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-slate-950 text-amber-400'
                              : 'bg-slate-800 text-amber-400'
                          }`}>
                            +{topic.tokenReward} 🪙
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/90 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTopicId('ai_pronunciation');
                    setIsNavDrawerOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5"
                >
                  <Mic className="w-3.5 h-3.5 text-rose-400" />
                  <span>AI Telaffuz Koçu</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTopicId('ai_writing');
                    setIsNavDrawerOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Yazı Düzeltici</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTopicId('goethe_exam_simulation');
                  setIsNavDrawerOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-indigo-500/20 hover:from-amber-500/30 hover:to-indigo-500/30 border border-amber-400/40 text-amber-300 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>🏆 Goethe A1-B1 Sınav Simülatörü & Rapor</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsNavDrawerOpen(false);
                  handleOpenThemeCustomizer();
                }}
                className="w-full py-2.5 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-200 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
              >
                <Palette className="w-4 h-4 text-cyan-400" />
                <span>🎨 Tema & Arka Plan Ayarları (İç Açıcı / Ferah)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTopicId('progress_chart');
                  setIsNavDrawerOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2.5 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-200 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all"
              >
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                <span>📊 A1-B1 İlerleme Grafiği & Analiz</span>
              </button>

              {onOpenPricing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsNavDrawerOpen(false);
                    onOpenPricing();
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
                >
                  <Crown className="w-4 h-4" />
                  <span>{currentUser?.isPremium ? '👑 VIP Üyesiniz' : 'PRO VIP Paketi İncele'}</span>
                </button>
              )}

              {/* Account Settings & In-App Deletion */}
              {currentUser && onOpenAccountSettings && (
                <button
                  type="button"
                  onClick={() => {
                    setIsNavDrawerOpen(false);
                    onOpenAccountSettings();
                  }}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hesap Ayarları & Satın Alımları Geri Yükle</span>
                </button>
              )}

              {/* Quick Logout Button */}
              {currentUser && onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    setIsNavDrawerOpen(false);
                    if (window.confirm('Glotvia hesabınızdan çıkış yapmak istediğinize emin misiniz?')) {
                      onLogout();
                    }
                  }}
                  className="w-full py-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 hover:text-rose-100 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Hesaptan Çıkış Yap</span>
                </button>
              )}

              {/* Privacy Policy & Data Safety Modal */}
              {onOpenPrivacy && (
                <button
                  type="button"
                  onClick={() => {
                    setIsNavDrawerOpen(false);
                    onOpenPrivacy();
                  }}
                  className="w-full py-1.5 text-slate-400 hover:text-indigo-300 font-medium text-[11px] flex items-center justify-center space-x-1 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Gizlilik Politikası & Play Store Data Safety</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          3. MAIN ACTIVE TOPIC CONTENT
      ======================================================== */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-3 sm:pt-5 space-y-4 sm:space-y-6">

        {/* GLOTVIA LIQUID GLASS: HOME HERO GREETING & PROGRESS CARD */}
        <GlassCard variant="glow" glowColor="cyan" className="p-5 sm:p-7 relative overflow-hidden">
          {/* Liquid Light Aura in Background */}
          <div className="liquid-light-aura w-72 h-72 -top-20 -right-20 pointer-events-none opacity-40" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Left: User Greeting & Goal */}
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Glotvia A1 Almanca Müfredatı</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {currentUser ? `Merhaba, ${currentUser.name} 👋` : 'Hoş Geldiniz 👋'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                {currentUser 
                  ? 'Bugünkü hedefin: Günlük 1 ders tamamlayarak streak serini koru ve telaffuz puanlarını yükselt.'
                  : 'Glotvia Almanca müfredatına ve Goethe A1 sınav hazırlık derslerine erişebilmek için lütfen giriş yapınız.'}
              </p>

              {/* Glass Progress Bar */}
              <div className="pt-2">
                <GlassProgress
                  value={currentUser ? completedCount : 0}
                  max={CURRICULUM_TOPICS.length}
                  label="Ders Tamamlandı"
                  color="cyan"
                  showLabel
                />
              </div>
            </div>

            {/* Right: Glass Capsules & Main CTA Button */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              
              {/* Mini Glass Capsules */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
                <GlassCapsule
                  icon={<span className="text-base">🔥</span>}
                  title="Streak"
                  value={currentUser ? `${tokenState.streakDays || 1} Gün` : '0 Gün'}
                  accent="amber"
                />
                <GlassCapsule
                  icon={<span className="text-base">⭐</span>}
                  title="XP / Puan"
                  value={currentUser ? `${(tokenState.coins || 0) * 10} XP` : '0 XP'}
                  accent="indigo"
                />
                <GlassCapsule
                  icon={<span className="text-base">🎯</span>}
                  title="Hedef"
                  value={currentUser ? `%${progressPercent}` : '%0'}
                  accent="emerald"
                />
                <GlassCapsule
                  icon={<span className="text-base">📚</span>}
                  title="Kelimeler"
                  value={currentUser ? `${completedCount * 12 + 45}` : '0'}
                  accent="cyan"
                />
              </div>

              {/* Primary CTA Action: Derse Devam Et / Giriş Yap */}
              <GlassButton
                variant="primary"
                size="lg"
                onClick={() => {
                  if (!currentUser) {
                    if (onOpenAuth) onOpenAuth();
                    return;
                  }
                  const nextLesson = CURRICULUM_TOPICS.find(t => !tokenState.completedLessons.includes(t.id) && isTopicUnlocked(t.id)) || currentTopic;
                  handleSelectTopic(nextLesson);
                }}
                className="w-full justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)] text-slate-950 font-black text-sm"
              >
                {!currentUser && <Lock className="w-4 h-4 mr-1 text-slate-950" />}
                <span>{currentUser ? 'Derse Devam Et' : 'Derslerin Kilidini Aç (Giriş Yap)'}</span>
                <ArrowRight className="w-4 h-4" />
              </GlassButton>

            </div>
          </div>
        </GlassCard>

        {/* ========================================================
            GİRİŞ YAPILMAMIŞ DURUM: TÜM DERSLER KİLİTLİ ERİŞİM ENGELİ (GLOTVIA LIQUID GLASS AUTH GATE)
        ======================================================== */}
        {!currentUser ? (
          <GlassCard variant="glow" glowColor="amber" className="p-6 sm:p-10 text-center space-y-6 relative overflow-hidden my-4">
            <div className="liquid-light-aura w-80 h-80 -top-20 -left-20 pointer-events-none opacity-30" />
            
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-2 border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)]">
              <Lock className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Erişim Korumalı • Giriş Gerekli</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Tüm Dersler ve Modüller Kilitli
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Glotvia Almanca A1 Goethe sınav müfredatına, 130 resimli konuşma kartına, telaffuz koçuna, satın alma ve alıştırmalara erişmek için lütfen ücretsiz hesabınıza giriş yapın veya hemen kayıt olun.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 backdrop-blur-md space-y-1">
                <div className="text-cyan-400 font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kişisel İlerleme</span>
                </div>
                <p className="text-[11px] text-slate-400">Çözdüğünüz dersler, puanlar ve streak günleri hesabınıza kaydedilir.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 backdrop-blur-md space-y-1">
                <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>130 Resimli Sprechen</span>
                </div>
                <p className="text-[11px] text-slate-400">Goethe A1 sınavında çıkan resimli rica ve soru kartları.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 backdrop-blur-md space-y-1">
                <div className="text-purple-400 font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>AI Telaffuz Koçu</span>
                </div>
                <p className="text-[11px] text-slate-400">Sesli mikrofondan konuşmanızı dinleyip telaffuzunuzu puanlar.</p>
              </div>
            </div>

            {/* Login / Register CTA */}
            <div className="pt-2 max-w-md mx-auto">
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-sm sm:text-base shadow-[0_0_35px_rgba(251,191,36,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <LogIn className="w-5 h-5 text-slate-950" />
                <span>Ücretsiz Giriş Yap veya Kayıt Ol</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        ) : (
          <>
            {/* Active Topic Banner & Reward Action */}
            <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/40 border border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center space-x-2 px-2.5 py-0.8 bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 rounded-full text-xs font-bold">
                    <span>Ders #{currentTopic.number}</span>
                    <span>•</span>
                    <span>{currentTopic.badge}</span>
                    <span>•</span>
                    <span>⏱️ ~{currentTopic.estimatedMinutes} dk</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {currentTopic.titleDe}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    {currentTopic.titleTr} — {currentTopic.description}
                  </p>
                </div>

                {/* Lesson Completion Button */}
                <div className="flex items-center space-x-2 shrink-0">
                  {tokenState.completedLessons.includes(currentTopic.id) ? (
                    <div className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs sm:text-sm font-bold shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Tamamlandı (+{currentTopic.tokenReward} 🪙)</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleCompleteTopic(currentTopic.id, currentTopic.tokenReward)}
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Trophy className="w-4 h-4 text-slate-950" />
                      <span>Dersi Tamamla (+{currentTopic.tokenReward} 🪙)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ========================================================
                MÜFREDAT HARİTASI & HIZLI GEÇİŞ KARTLARI (YATAY KAYDIRMALI MODERN ŞERİT)
            ======================================================== */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <span>📚</span>
                  <span>A1 Müfredat Ders Sıralaması ({CURRICULUM_TOPICS.length} Ders)</span>
                </span>
                <span className="text-[11px] font-bold text-amber-400">
                  {tokenState.completedLessons.length}/{CURRICULUM_TOPICS.length} Tamamlandı
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 sm:gap-2">
                {CURRICULUM_TOPICS.map((topic) => {
                  const isSelected = topic.id === activeTopicId;
                  const isDone = tokenState.completedLessons.includes(topic.id);
                  const isUnlocked = isTopicUnlocked(topic.id);

                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => handleSelectTopic(topic)}
                      className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-400 shadow-md font-bold'
                          : isDone
                          ? 'bg-emerald-950/20 text-emerald-300 border-emerald-800/40 hover:bg-emerald-900/30'
                          : isUnlocked
                          ? 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                          : 'bg-slate-950/50 text-slate-500 border-slate-800/60 hover:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-black font-mono px-1 py-0.2 rounded ${
                          isSelected ? 'bg-slate-950 text-amber-400' : 'bg-slate-900 text-slate-400'
                        }`}>
                          #{topic.number}
                        </span>
                        {isDone ? (
                          <CheckCircle className={`w-3 h-3 ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`} />
                        ) : !isUnlocked ? (
                          <Lock className="w-2.5 h-2.5 text-amber-400/80" />
                        ) : null}
                      </div>
                      <div className="mt-1 text-xs font-black truncate">
                        {topic.titleDe}
                      </div>
                      <div className={`text-[10px] truncate ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                        {topic.titleTr}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Featured Spotlight Card: 130 Resimli Goethe Sprechen Modülü */}
            {activeTopicId !== 'goethe_sprechen' && (
              <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border-2 border-emerald-500/40 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-lg shadow-emerald-500/20 animate-pulse">
                    🖼️
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-500/40">
                        Öne Çıkan Modül • 130 Resimli Kart
                      </span>
                      <span className="text-[10px] font-bold text-amber-400">
                        🪙 +150 Kredi
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      Goethe A1 Sprechen (130 Resimli Kart &amp; Rica Kalıpları)
                    </h3>
                    <p className="text-xs text-slate-300">
                      Gerçek sınav kartları, &ldquo;Können Sie mir bitte...?&rdquo;, aufmachen/zumachen, anmachen, yasaklar ve soru-cevap şablonları.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTopicId('goethe_sprechen');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Resimli Kartları Aç</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ========================================================
                iOS 26 FROSTED DYNAMIC CAPSULE BAR (TRANSLUCENT LESSON SWITCHER)
            ======================================================== */}
            <div className="backdrop-blur-2xl bg-slate-900/60 border border-white/10 p-3 sm:p-4 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 relative overflow-hidden">
              {/* Subtle iOS specular glow accent */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
              
              {/* Left: Previous Lesson Pill */}
              <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start space-x-2">
                <button
                  type="button"
                  disabled={!prevTopic}
                  onClick={goToPrevTopic}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 border cursor-pointer ${
                    prevTopic
                      ? 'bg-slate-950/70 hover:bg-slate-800 text-slate-200 border-white/10 hover:border-amber-400/40 shadow-sm active:scale-95'
                      : 'bg-slate-950/30 text-slate-600 border-white/5 cursor-not-allowed opacity-50'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{prevTopic ? `Önceki: #${prevTopic.number}` : 'İlk Ders'}</span>
                </button>

                <span className="sm:hidden text-[11px] font-black text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-full">
                  Ders #{currentTopic.number} / {CURRICULUM_TOPICS.length}
                </span>
              </div>

              {/* Center: iOS Dynamic Island Indicator with Micro-Dots */}
              <div className="flex flex-col items-center justify-center space-y-1.5 w-full sm:w-auto">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-950/80 border border-white/10 rounded-full shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-[11px] font-bold text-slate-300">
                    Ders <strong className="text-white font-black">{currentTopicIndex + 1}</strong> / {CURRICULUM_TOPICS.length}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[10px] text-amber-400 font-semibold hidden md:inline">
                    👈 Sağa / Sola Kaydırarak Geçin 👉
                  </span>
                  <span className="text-[10px] text-amber-400 font-semibold md:hidden">
                    ↔️ Kaydırarak Geçin
                  </span>
                </div>

                {/* Micro-dot Lesson Progress Bar */}
                <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto max-w-full py-0.5 no-scrollbar">
                  {CURRICULUM_TOPICS.map((topic, idx) => {
                    const isCurrent = topic.id === activeTopicId;
                    const isCompleted = tokenState.completedLessons.includes(topic.id);
                    const isUnlocked = isTopicUnlocked(topic.id);

                    return (
                      <button
                        key={topic.id}
                        type="button"
                        title={`Ders #${topic.number}: ${topic.titleDe}`}
                        onClick={() => handleSelectTopic(topic)}
                        className={`transition-all rounded-full cursor-pointer ${
                          isCurrent
                            ? 'w-6 sm:w-7 h-2.5 bg-gradient-to-r from-amber-400 to-amber-500 shadow-md shadow-amber-500/30 ring-1 ring-amber-300'
                            : isCompleted
                            ? 'w-2.5 sm:w-3 h-2.5 bg-emerald-500/70 hover:bg-emerald-400'
                            : isUnlocked
                            ? 'w-2.5 sm:w-3 h-2.5 bg-slate-700 hover:bg-slate-500'
                            : 'w-2.5 sm:w-3 h-2.5 bg-slate-850 border border-slate-800 opacity-60'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Right: Next Lesson Pill */}
              <div className="w-full sm:w-auto flex justify-end">
                <button
                  type="button"
                  disabled={!nextTopic}
                  onClick={goToNextTopic}
                  className={`w-full sm:w-auto px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center justify-center space-x-2 border cursor-pointer ${
                    nextTopic
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/20 active:scale-95'
                      : 'bg-slate-950/30 text-slate-600 border-white/5 cursor-not-allowed opacity-50'
                  }`}
                >
                  <span>{nextTopic ? `Sonraki: #${nextTopic.number} (${nextTopic.titleDe})` : 'Son Ders'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ========================================================
                iOS 26 ULTRA-FROSTED TRANSLUCENT SWIPEABLE VIEWPORT
            ======================================================== */}
            <div 
              className="relative w-full rounded-3xl transition-all duration-300 ease-out"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                transform: `translateX(${touchDeltaX}px) scale(${isSwiping && Math.abs(touchDeltaX) > 15 ? 0.988 : 1})`,
                opacity: isTransitioning ? 0.45 : Math.max(0.70, 1 - Math.abs(touchDeltaX) / 500),
                transition: isSwiping ? 'none' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease'
              }}
            >
              {/* Translucent Swipe Active Overlay Floating Pill */}
              {isSwiping && Math.abs(touchDeltaX) > 20 && (
                <div className={`absolute top-2 z-30 pointer-events-none px-4 py-1.5 rounded-full backdrop-blur-2xl text-xs font-black shadow-2xl flex items-center space-x-2 border animate-pulse ${
                  touchDeltaX < 0 
                    ? 'right-4 bg-amber-500/90 text-slate-950 border-amber-300' 
                    : 'left-4 bg-indigo-500/90 text-white border-indigo-300'
                }`}>
                  {touchDeltaX < 0 ? (
                    <>
                      <span>Sonraki Ders</span>
                      <span>👉</span>
                    </>
                  ) : (
                    <>
                      <span>👈</span>
                      <span>Önceki Ders</span>
                    </>
                  )}
                </div>
              )}
        {/* ========================================================
            DERS 1: DAS ALPHABET (ALMAN ALFABESİ)
        ======================================================== */}
        {activeTopicId === 'alphabet' && (
          <div className="space-y-6">
            
            {/* Search & Filter Bar & Auto Player & Mode Switcher */}
            <div className="flex flex-col gap-3 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
                <div className="relative w-full lg:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchLetter}
                    onChange={(e) => setSearchLetter(e.target.value)}
                    placeholder="Harf veya okunuş ara..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Audio Mode Tabs */}
                <div className="flex items-center space-x-1 bg-slate-950 border border-slate-800 p-1 rounded-xl w-full lg:w-auto overflow-x-auto">
                  <span className="text-[11px] text-slate-400 px-2 font-medium shrink-0">Ses Modu:</span>
                  {[
                    { id: 'full_german', label: 'Tam Almanca (Großes A, kleines a)' },
                    { id: 'letter_only', label: 'Sade (A, a)' },
                    { id: 'turkish_phonetic', label: 'Türkçe Anlatımlı (Büyük se...)' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setAlphabetAudioMode(m.id as any)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                        alphabetAudioMode === m.id
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                {/* Speech Speed Selector */}
                <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 p-1 rounded-xl">
                  <span className="text-[11px] text-slate-400 px-2 font-medium">Hız:</span>
                  {[
                    { label: '0.6x (Yavaş)', rate: 0.60 },
                    { label: '0.7x (İdeal)', rate: 0.70 },
                    { label: '0.85x', rate: 0.85 },
                    { label: '1.0x', rate: 1.0 }
                  ].map((s) => (
                    <button
                      key={s.rate}
                      type="button"
                      onClick={() => setAlphabetSpeechSpeed(s.rate)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        alphabetSpeechSpeed === s.rate
                          ? 'bg-amber-500 text-slate-950'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePlayAllAlphabet}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      playingId === 'alpha_all_sequence'
                        ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/50 animate-pulse'
                        : 'bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{playingId === 'alpha_all_sequence' ? 'Durdur' : 'Tüm Alfabeyi Dinle (A-Z)'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Audio Mode Info Banner */}
            <div className="bg-gradient-to-r from-amber-500/10 via-slate-900/60 to-blue-500/10 border border-amber-500/20 rounded-2xl p-3 sm:p-4 text-xs text-slate-300 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  {alphabetAudioMode === 'full_german' && (
                    <span><strong className="text-white">Tam Almanca Telaffuz Aktif:</strong> Harfe bastığınızda doğal Almanca olarak <span className="text-amber-400 font-bold">"Großes A, kleines a"</span>, ardından 0.45s sonra Almanca <span className="text-emerald-400 font-bold">Örnek Kelime</span> (örn. <em>Apfel, Café, Käse</em>) seslendirilir. Büyük/küçük harflere tek tek basarak da dinleyebilirsiniz.</span>
                  )}
                  {alphabetAudioMode === 'letter_only' && (
                    <span><strong className="text-white">Sade Almanca Harf Modu:</strong> Sadece Almanca harf adı (örn. <span className="text-amber-400 font-bold">"A, a"</span>), ardından <span className="text-emerald-400 font-bold">Örnek Kelime</span> seslendirilir.</span>
                  )}
                  {alphabetAudioMode === 'turkish_phonetic' && (
                    <span><strong className="text-white">Türkçe Anlatımlı Mod:</strong> <span className="text-amber-400 font-bold">"Büyük se, küçük se"</span>, ardından Almanca <span className="text-emerald-400 font-bold">Örnek Kelime</span> seslendirilir.</span>
                  )}
                </div>
              </div>
            </div>

            {/* 30 Letter Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredAlphabet.map((item) => {
                const isPlaying = playingId === `alpha_${item.upper}`;
                const isUpperPlaying = playingId === `single_up_${item.upper}`;
                const isLowerPlaying = playingId === `single_low_${item.upper}`;

                return (
                  <div
                    key={item.upper}
                    className={`relative p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isPlaying
                        ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/30'
                        : item.isSpecial
                        ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-2xl font-black text-white flex items-baseline">
                        <button
                          type="button"
                          onClick={() => handlePlaySingleLetter(item, true, `single_up_${item.upper}`)}
                          className={`hover:text-amber-400 transition-colors ${isUpperPlaying ? 'text-amber-400 underline underline-offset-4' : ''}`}
                          title={`Dinle: Großes ${item.upper}`}
                        >
                          {item.upper}
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePlaySingleLetter(item, false, `single_low_${item.upper}`)}
                          className={`text-base font-normal ml-1.5 hover:text-amber-300 transition-colors ${
                            isLowerPlaying ? 'text-amber-300 underline underline-offset-4' : 'text-slate-400'
                          }`}
                          title={`Dinle: Kleines ${item.lower}`}
                        >
                          {item.lower}
                        </button>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => handlePlayAlphabetLetter(item)}
                          className={`p-2 rounded-xl transition-all ${
                            isPlaying ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:text-white'
                          }`}
                          title={`Sesli Dinle (Großes ${item.upper}, kleines ${item.lower} + ${item.exampleWord})`}
                        >
                          <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-pulse' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenPronunciationWithPhrase(item.exampleWord || item.upper)}
                          className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white transition-all"
                          title="Mikrofon ile Telaffuz Et & Puanla"
                        >
                          <Mic className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1.5">
                      <div className="text-xs font-mono font-bold text-amber-400 flex items-center justify-between">
                        <span>[{item.pronunciation}]</span>
                        {item.isSpecial && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-sans font-bold">Özel</span>
                        )}
                      </div>
                      {item.exampleWord && (
                        <div className="text-[11px] text-slate-300 bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/80">
                          <span className="text-amber-300 font-bold">{item.exampleWord}</span> <span className="text-slate-400">({item.exampleWordMeaning})</span>
                        </div>
                      )}
                      {item.exampleSentenceDe && (
                        <div className="pt-1.5 border-t border-slate-800/60 flex items-start justify-between gap-1.5 text-[10px]">
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <p className="text-emerald-300 font-bold leading-tight truncate">🇩🇪 {item.exampleSentenceDe}</p>
                            <p className="text-slate-400 italic leading-tight truncate">🇹🇷 {item.exampleSentenceTr}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(item.exampleSentenceDe!, `alph_sent_${item.upper}`)}
                            className="p-1 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-all shrink-0"
                            title="Almanca Cümleyi Dinle"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Turkish to German Conversion Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-black text-white flex items-center space-x-2">
                <span>🔄</span>
                <span>Türkçe Harflerin Almancada Kodlanması (Dönüşüm Kuralları)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {TURKISH_GERMAN_CONVERSIONS.map((conv, idx) => (
                  <div key={idx} className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2.5 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-rose-400 font-black text-base">{conv.turkish}</span>
                        <span className="text-slate-500 font-bold">➔</span>
                        <span className="text-emerald-400 font-black text-base">{conv.german}</span>
                        <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">[{conv.germanPronunciation}]</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">{conv.note}</p>
                    </div>

                    {conv.exampleWordDe && (
                      <div className="text-[11px] bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-amber-300 font-bold">{conv.exampleWordDe}</span>
                          <span className="text-slate-400 text-[10px]">({conv.exampleWordTr})</span>
                        </div>
                        {conv.exampleSentenceDe && (
                          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                            <div className="flex-1 min-w-0">
                              <p className="text-emerald-300 text-[10px] font-semibold truncate">🇩🇪 {conv.exampleSentenceDe}</p>
                              <p className="text-slate-400 text-[9px] italic truncate">🇹🇷 {conv.exampleSentenceTr}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handlePlayAudio(conv.exampleSentenceDe!, `conv_sent_${idx}`)}
                              className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded shrink-0"
                              title="Almanca Cümleyi Dinle"
                            >
                              <Volume2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            DERS 2: DIE ZAHLEN (ALMANCA SAYILAR 0-1000 - DÖKÜMAN 4)
        ======================================================== */}
        {activeTopicId === 'numbers' && (
          <div className="space-y-6">

            {/* 2.1: 0 - 12 TEMEL SAYILAR */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white">2.1: 0 - 12 (Temel Sayılar / Grundzahlen)</h3>
                  <p className="text-xs text-slate-400">Tüm Almanca sayıların temelini oluşturan ana sayılar.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {NUMBERS_0_12.map((num) => (
                  <div
                    key={num.number}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                      num.isSpecial ? 'bg-amber-950/20 border-amber-500/40' : 'bg-slate-950/80 border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-white font-mono">{num.number}</span>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(num.german, `num_${num.number}`)}
                          className="p-1.5 bg-slate-900 text-slate-400 hover:text-white rounded-lg"
                          title="Sayıyı Dinle"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="mt-1">
                        <div className="text-sm font-black text-amber-300">{num.german}</div>
                        <div className="text-[11px] font-mono text-slate-400">[{num.pronunciation}]</div>
                      </div>
                      {num.note && <div className="text-[9px] text-amber-400/90 mt-1">{num.note}</div>}
                    </div>

                    {num.exampleSentenceDe && (
                      <div className="pt-2 border-t border-slate-800/80 flex items-start justify-between gap-1.5 text-[10px]">
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <p className="text-emerald-300 font-semibold leading-tight truncate">🇩🇪 {num.exampleSentenceDe}</p>
                          <p className="text-slate-400 italic leading-tight truncate">🇹🇷 {num.exampleSentenceTr}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(num.exampleSentenceDe!, `num_sent_${num.number}`)}
                          className="p-1 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-all shrink-0"
                          title="Örnek Cümleyi Dinle"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2.2: 13 - 19 SAYILAR */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div>
                <h3 className="text-lg font-black text-white">2.2: 13 - 19 (-zehn ile Biten Sayılar)</h3>
                <p className="text-xs text-slate-400">16 (sechzehn) ve 17 (siebzehn) sayılarındaki harf düşme kurallarına dikkat ediniz.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {NUMBERS_13_19.map((num) => (
                  <div
                    key={num.number}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                      num.isSpecial ? 'bg-rose-950/30 border-rose-500/40' : 'bg-slate-950/80 border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-white font-mono">{num.number}</span>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(num.german, `num_${num.number}`)}
                          className="p-1.5 bg-slate-900 text-slate-400 hover:text-white rounded-lg"
                          title="Sayıyı Dinle"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="mt-1">
                        <div className="text-sm font-black text-rose-300">{num.german}</div>
                        <div className="text-[11px] font-mono text-slate-400">[{num.pronunciation}]</div>
                      </div>
                      {num.note && <div className="text-[9px] text-rose-400 font-bold mt-1">{num.note}</div>}
                    </div>

                    {num.exampleSentenceDe && (
                      <div className="pt-2 border-t border-slate-800/80 flex items-start justify-between gap-1.5 text-[10px]">
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <p className="text-emerald-300 font-semibold leading-tight truncate">🇩🇪 {num.exampleSentenceDe}</p>
                          <p className="text-slate-400 italic leading-tight truncate">🇹🇷 {num.exampleSentenceTr}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(num.exampleSentenceDe!, `num_sent_${num.number}`)}
                          className="p-1 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-all shrink-0"
                          title="Örnek Cümleyi Dinle"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2.3: 20 - 1000 ONLUKLAR & YÜZLÜKLER */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div>
                <h3 className="text-lg font-black text-white">2.3: 20 - 1000 (Onluklar, Yüzlükler ve Binlikler)</h3>
                <p className="text-xs text-slate-400">30 (dreißig), 60 (sechzig), 70 (siebzig) özel kurallarını içerir.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {NUMBERS_20_1000.map((num) => (
                  <div key={num.number} className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-black text-white font-mono">{num.number}</span>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(num.german, `num_${num.number}`)}
                          className="p-1.5 bg-slate-900 text-slate-400 hover:text-white rounded-lg"
                          title="Sayıyı Dinle"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-sm font-black text-amber-300 mt-1">{num.german}</div>
                      <div className="text-[11px] font-mono text-slate-400">[{num.pronunciation}]</div>
                      {num.note && <div className="text-[9px] text-amber-400 mt-1">{num.note}</div>}
                    </div>

                    {num.exampleSentenceDe && (
                      <div className="pt-2 border-t border-slate-800/80 flex items-start justify-between gap-1.5 text-[10px]">
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <p className="text-emerald-300 font-semibold leading-tight truncate">🇩🇪 {num.exampleSentenceDe}</p>
                          <p className="text-slate-400 italic leading-tight truncate">🇹🇷 {num.exampleSentenceTr}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(num.exampleSentenceDe!, `num_sent_${num.number}`)}
                          className="p-1 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-all shrink-0"
                          title="Örnek Cümleyi Dinle"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2.4: BİRLEŞİK SAYI OLUŞTURMA ŞEMALARI & LABORATUVAR */}
            <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📐</span>
                <div>
                  <h3 className="text-lg font-black text-white">2.4: Birleşik Sayı Örnekleri & Formülleri</h3>
                  <p className="text-xs text-slate-400">Önce birler basamağı + und + onlar basamağı kuralı.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {COMPOUND_NUMBER_EXAMPLES.map((ex) => (
                  <div key={ex.number} className="p-4 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-amber-400 font-mono">{ex.number}</span>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(ex.writtenStandard, `comp_${ex.number}`)}
                        className="p-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {ex.breakdown.map((part, i) => (
                        <span key={i} className="text-xs bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md font-mono text-slate-300">
                          {part}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm font-black text-white">{ex.writtenStandard}</div>
                    <div className="text-xs font-mono text-amber-400">[{ex.pronunciation}]</div>
                    <p className="text-[11px] text-slate-400">{ex.ruleExplanation}</p>
                  </div>
                ))}
              </div>

              {/* Dinamik Sayı Okuma Laboratuvarı */}
              <div className="mt-4 p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="text-sm font-black text-white flex items-center space-x-2">
                  <span>🧮</span>
                  <span>İnteraktif Sayı Okuma & Dinleme Laboratuvarı</span>
                </h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="number"
                    value={customNumberInput}
                    onChange={(e) => setCustomNumberInput(e.target.value)}
                    placeholder="Sayı yazın (örn: 74, 1998, 2026)..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-base focus:outline-none focus:border-amber-500"
                  />
                  {customNumberResult && (
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(customNumberResult.wordsJoined, 'custom_num_play')}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Sesli Dinle</span>
                    </button>
                  )}
                </div>
                {customNumberResult && (
                  <div className="p-3 bg-slate-900/60 rounded-xl text-xs space-y-1">
                    <div className="text-amber-300 font-bold text-sm">Almanca: {customNumberResult.wordsJoined}</div>
                    <div className="text-slate-400">Ayrık Yazılışı: {customNumberResult.wordsSpaced}</div>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ========================================================
            DERS 3: BUCHSTABIEREN & KİŞİSEL KODLAMA (DÖKÜMAN 2)
        ======================================================== */}
        {activeTopicId === 'spelling' && (
          <div className="space-y-6">

            {/* Sub-Navigation Tabs */}
            <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-2xl flex flex-wrap items-center gap-1.5 shadow-lg">
              <button
                type="button"
                onClick={() => setSpellingActiveSection('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  spellingActiveSection === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Tümü (Hepsi)
              </button>
              <button
                type="button"
                onClick={() => setSpellingActiveSection('sich_vorstellen')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                  spellingActiveSection === 'sich_vorstellen'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/60'
                }`}
              >
                <span>⭐</span>
                <span>Kendini Tanıtma Rehberi (Sich vorstellen)</span>
              </button>
              <button
                type="button"
                onClick={() => setSpellingActiveSection('hobbys')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                  spellingActiveSection === 'hobbys'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-indigo-400 hover:text-indigo-300 hover:bg-slate-800/60'
                }`}
              >
                <span>🎨</span>
                <span>Hobiler & Aktiviteler (12 Kelime)</span>
              </button>
              <button
                type="button"
                onClick={() => setSpellingActiveSection('form_coding')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                  spellingActiveSection === 'form_coding'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/60'
                }`}
              >
                <span>📋</span>
                <span>12 Aşamalı Kodlama Formu</span>
              </button>
              <button
                type="button"
                onClick={() => setSpellingActiveSection('wortschatz')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                  spellingActiveSection === 'wortschatz'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-sky-400 hover:text-sky-300 hover:bg-slate-800/60'
                }`}
              >
                <span>📖</span>
                <span>Form Kelimeleri (Wortschatz)</span>
              </button>
            </div>

            {/* ========================================================
                3.1: KENDİNİ TANITMA REHBERİ (SICH VORSTELLEN TABLOSU)
            ======================================================== */}
            {(spellingActiveSection === 'all' || spellingActiveSection === 'sich_vorstellen') && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                
                {/* Header Banner & Intro Phrases */}
                <div className="bg-gradient-to-r from-amber-500/15 via-slate-950 to-indigo-950/30 border border-amber-500/30 rounded-3xl p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-black">
                        <span>⭐ Goethe A1 Sınavı 1. Bölüm (Sprechen Teil 1)</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white notranslate flex items-center space-x-2">
                        <span>sich vorstellen</span>
                        <span className="text-base text-amber-400 font-normal">(kendini tanıtma)</span>
                      </h3>
                      <div className="text-xs font-mono text-slate-400">
                        Fonetik Okunuş: <strong className="text-amber-300">[{SICH_VORSTELLEN_INTRO.titlePronunciation}]</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePlayAudio('sich vorstellen', 'sv_intro_main')}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all shrink-0"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Başlığı Dinle</span>
                    </button>
                  </div>

                  {/* Sınav Görev Cümleleri (Nezaket Kalıpları) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                    
                    {/* Cümle 1 */}
                    <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-2xl flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <div className="text-xs font-bold text-amber-400">🇩🇪 Sınav Görevi 1 (Emir Kipi):</div>
                        <div className="text-sm font-black text-white notranslate">{SICH_VORSTELLEN_INTRO.politeRequest1De}</div>
                        <div className="text-[11px] font-mono text-amber-300">[{SICH_VORSTELLEN_INTRO.politeRequest1Pronunciation}]</div>
                        <div className="text-xs text-slate-400">🇹🇷 {SICH_VORSTELLEN_INTRO.politeRequest1Tr}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(SICH_VORSTELLEN_INTRO.politeRequest1De, 'sv_req1')}
                        className="p-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded-xl transition-all shrink-0"
                        title="Sesli Dinle"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Cümle 2 */}
                    <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-2xl flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <div className="text-xs font-bold text-indigo-400">🇩🇪 Sınav Görevi 2 (Rica Sorusu):</div>
                        <div className="text-sm font-black text-white notranslate">{SICH_VORSTELLEN_INTRO.politeRequest2De}</div>
                        <div className="text-[11px] font-mono text-indigo-300">[{SICH_VORSTELLEN_INTRO.politeRequest2Pronunciation}]</div>
                        <div className="text-xs text-slate-400">🇹🇷 {SICH_VORSTELLEN_INTRO.politeRequest2Tr}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(SICH_VORSTELLEN_INTRO.politeRequest2De, 'sv_req2')}
                        className="p-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded-xl transition-all shrink-0"
                        title="Sesli Dinle"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>

                {/* 8 Core Categories Cards Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-black text-white">
                        Kendini Tanıtma: 7 Ana Başlık, Soru-Cevap Kalıpları ve Okunuşları
                      </h4>
                      <p className="text-xs text-slate-400">
                        Sınavda sorulan soru, boşluklu cevap şablonu, fonetik okunuşu ve canlı Türkçe açıklaması.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {SICH_VORSTELLEN_DATA.map((item) => {
                      const isQuestionPlaying = playingId === `sv_q_${item.id}`;
                      const isSamplePlaying = playingId === `sv_s_${item.id}`;

                      return (
                        <div
                          key={item.id}
                          className="bg-slate-950/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 space-y-4 shadow-lg transition-all"
                        >
                          {/* Card Top Title */}
                          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                            <div className="flex items-center space-x-3">
                              <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-xs font-black">
                                #{item.categoryNumber}
                              </span>
                              <div>
                                <div className="text-sm font-black text-white tracking-wide">
                                  {item.categoryNameDe}
                                </div>
                                <div className="text-[11px] text-slate-400 font-semibold">
                                  {item.categoryNameTr} {item.subType && `(${item.subType.toUpperCase()})`}
                                </div>
                              </div>
                            </div>

                            {item.note && (
                              <span className="hidden sm:inline-block text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-300/90">
                                💡 {item.note}
                              </span>
                            )}
                          </div>

                          {/* 2-Column Table Grid (Frage vs Antwort) */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* Left: FRAGE (SORU) */}
                            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                    Frage (Soru)
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handlePlayAudio(item.questionDe, `sv_q_${item.id}`)}
                                    className={`p-1.5 rounded-lg transition-all flex items-center space-x-1 text-xs font-bold ${
                                      isQuestionPlaying
                                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                                        : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300'
                                    }`}
                                    title="Soruyu Sesli Dinle"
                                  >
                                    <Volume2 className="w-3.5 h-3.5" />
                                    <span>Soruyu Dinle</span>
                                  </button>
                                </div>

                                <div className="space-y-1">
                                  <div className="text-base font-black text-white notranslate">
                                    {item.questionDe}
                                  </div>
                                  <div className="text-xs font-mono text-indigo-300 font-semibold">
                                    Aussprache (Okunuşu): [{item.questionPronunciation}]
                                  </div>
                                  <div className="text-xs text-slate-300 font-medium pt-1">
                                    Türkisch (Türkçe): <strong className="text-slate-100">{item.questionTr}</strong>
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleOpenPronunciationWithPhrase(item.questionDe)}
                                className="w-full mt-2 py-1.5 px-3 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/40 rounded-xl text-[11px] font-bold text-indigo-300 hover:text-white transition-all flex items-center justify-center space-x-1.5"
                              >
                                <Mic className="w-3 h-3 text-rose-400" />
                                <span>AI Telaffuz Koçunda Söylemeyi Dene</span>
                              </button>
                            </div>

                            {/* Right: ANTWORT (CEVAP) */}
                            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    Antwort (Cevap Şablonu)
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handlePlayAudio(item.sampleAnswerDe, `sv_s_${item.id}`)}
                                    className={`p-1.5 rounded-lg transition-all flex items-center space-x-1 text-xs font-bold ${
                                      isSamplePlaying
                                        ? 'bg-emerald-500 text-slate-950 animate-pulse'
                                        : 'bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300'
                                    }`}
                                    title="Örnek Cevabı Sesli Dinle"
                                  >
                                    <Volume2 className="w-3.5 h-3.5" />
                                    <span>Örnek Cevabı Dinle</span>
                                  </button>
                                </div>

                                <div className="space-y-1">
                                  <div className="text-base font-black text-amber-300 font-mono notranslate">
                                    {item.answerTemplateDe}
                                  </div>
                                  <div className="text-xs font-mono text-slate-400">
                                    Aussprache: [{item.answerPronunciation}]
                                  </div>
                                  <div className="text-xs text-slate-300 font-medium">
                                    Türkisch: <span className="text-white">{item.answerTemplateTr}</span>
                                  </div>

                                  {/* Tam Örnek Cevap */}
                                  <div className="mt-2.5 p-2.5 bg-slate-950 border border-emerald-500/30 rounded-xl space-y-0.5 text-xs">
                                    <div className="text-emerald-300 font-bold notranslate">
                                      🇩🇪 Örnek: {item.sampleAnswerDe}
                                    </div>
                                    <div className="text-[10px] font-mono text-emerald-400/80">
                                      [{item.sampleAnswerPronunciation}]
                                    </div>
                                    <div className="text-slate-400 italic">
                                      🇹🇷 {item.sampleAnswerTr}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleOpenPronunciationWithPhrase(item.sampleAnswerDe)}
                                className="w-full mt-2 py-1.5 px-3 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/40 rounded-xl text-[11px] font-bold text-emerald-300 hover:text-white transition-all flex items-center justify-center space-x-1.5"
                              >
                                <Mic className="w-3 h-3 text-emerald-400" />
                                <span>Cevabı Kendi Sesinle Söyle & Puan Al</span>
                              </button>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================
                3.2: 12 HOBİ KELİMESİ VE AKTİVİTELERİ (HOBBY VOCABULARY)
            ======================================================== */}
            {(spellingActiveSection === 'all' || spellingActiveSection === 'hobbys') && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full text-xs font-black mb-1">
                      <span>🎨 Döküman 2</span>
                      <span>•</span>
                      <span>Hobi & Aktivite Fiilleri</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      12 Temel Hobi Kelimesi, Anlamları ve Cümleleri
                    </h3>
                    <p className="text-xs text-slate-400">
                      "Mein Hobby ist..." veya "Meine Hobbys sind..." cümlelerinde kullanabileceğiniz popüler hobiler.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      for (const h of HOBBY_VOCABULARY_DATA) {
                        await speakSequence([
                          { text: h.german, languageId: 'de', rate: 0.75, pauseAfterMs: 350 },
                          { text: h.exampleDe || '', languageId: 'de', rate: 0.75, pauseAfterMs: 600 }
                        ]);
                      }
                      awardCoins(20, 'Tüm Hobiler Dinlendi');
                    }}
                    className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-black rounded-2xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md shrink-0"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Tüm Hobileri Dinle ▶️</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {HOBBY_VOCABULARY_DATA.map((hobby) => {
                    const isPlaying = playingId === `hobby_${hobby.id}`;

                    return (
                      <div
                        key={hobby.id}
                        className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-black text-white notranslate">
                              {hobby.german}
                            </h5>
                            <button
                              type="button"
                              onClick={() => handlePlayAudio(hobby.german, `hobby_${hobby.id}`)}
                              className={`p-1.5 rounded-lg transition-all ${
                                isPlaying
                                  ? 'bg-amber-500 text-slate-950 animate-pulse'
                                  : 'bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-400'
                              }`}
                              title="Dinle"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-[11px] font-mono text-amber-300">
                            [{hobby.pronunciation}]
                          </div>
                          <div className="text-xs text-slate-300 font-semibold">
                            🇹🇷 {hobby.turkish}
                          </div>
                        </div>

                        {hobby.exampleDe && (
                          <div className="pt-2 border-t border-slate-800/80 space-y-0.5 text-[11px]">
                            <p className="text-indigo-300 font-medium notranslate">🇩🇪 {hobby.exampleDe}</p>
                            <p className="text-slate-400 italic">🇹🇷 {hobby.exampleTr}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* ========================================================
                3.3: 12 AŞAMALI KİŞİSEL BİLGİ KODLAMA FORMU (DÖKÜMAN 2)
            ======================================================== */}
            {(spellingActiveSection === 'all' || spellingActiveSection === 'form_coding') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white">
                      12 Aşamalı Kişisel Bilgi Kodlama Formu (Canlı Fonetik)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Kendi bilgilerinizi kutulara yazın; sistem anında Alman fonetik kodlamasını üretip harf harf seslendirir.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearAllFields}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Formu Temizle</span>
                  </button>
                </div>

            {/* 12 Dialogue Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DIALOGUE_CONFIGS.map((cfg) => {
                const rawVal = userProfile[cfg.id] || '';
                const spelling = getGermanSpelling(rawVal);
                const isPlaying = playingId === `spelling_${cfg.id}`;
                const isEditing = editingField === cfg.id;

                return (
                  <div
                    key={cfg.id}
                    className="p-5 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl space-y-4 shadow-lg flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                          Soru #{cfg.number} • {cfg.targetConcept}
                        </span>
                        <span className="text-xs text-slate-400">{cfg.labelTr}</span>
                      </div>

                      {/* Official Question */}
                      <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 space-y-1">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-black text-white">
                            {cfg.questionDe}
                          </p>
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(cfg.questionDe, `q_${cfg.id}`)}
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded-lg ml-2"
                            title="Soruyu Dinle"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-400">{cfg.questionTr}</p>
                      </div>

                      {/* User Value Input */}
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          {cfg.labelTr} Değeriniz:
                        </label>
                        <input
                          type={cfg.type === 'number' ? 'text' : 'text'}
                          value={rawVal}
                          onChange={(e) => handleProfileFieldChange(cfg.id, e.target.value)}
                          placeholder={`Örn: ${cfg.labelTr.toLowerCase()} yazınız...`}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold tracking-wide focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Live Generated Spelling Chips */}
                      {rawVal.trim() && (
                        <div className="space-y-2 pt-1">
                          <div className="text-[11px] font-bold text-slate-400">Canlı Almanca Kodlama:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {spelling.chips.map((chip, i) => (
                              <div
                                key={i}
                                className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-center min-w-[28px]"
                              >
                                <div className="text-xs font-black text-amber-400">{chip.char}</div>
                                <div className="text-[9px] font-mono text-slate-400">[{chip.phonetic}]</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Play Letter-by-Letter Speech Action */}
                    {rawVal.trim() && (
                      <button
                        type="button"
                        onClick={() => handlePlaySpellingSequence(rawVal, `spelling_${cfg.id}`)}
                        disabled={isPlaying}
                        className={`w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center space-x-2 transition-all ${
                          isPlaying
                            ? 'bg-amber-500 text-slate-950 animate-pulse'
                            : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200'
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>{isPlaying ? 'Kodlanıyor...' : 'Harf Harf Sesli Kodla'}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            3.4: WORTSCHATZ (14 TEMEL FORM KELİMESİ)
        ======================================================== */}
        {(spellingActiveSection === 'all' || spellingActiveSection === 'wortschatz') && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-black mb-1.5">
                    <span>📖 Wortschatz</span>
                    <span>•</span>
                    <span>Temel Kelimeler & Cümle Kalıpları</span>
                  </div>
                  <h3 className="text-lg font-black text-white">
                    Ders 3: 14 Temel Form Kelimesi ve Almanca Kullanım Cümleleri
                  </h3>
                  <p className="text-xs text-slate-400">
                    Resmi formlarda ve Goethe A1 sınavında geçen kelimelerin artikelleri, okunuşları ve örnek cümleleri.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    for (const v of ESSENTIAL_VOCABULARY) {
                      await speakSequence([
                        { text: `${v.article ? v.article + ' ' : ''}${v.german}`, languageId: 'de', rate: alphabetSpeechSpeed, pauseAfterMs: 300 },
                        { text: v.exampleSentence, languageId: 'de', rate: alphabetSpeechSpeed, pauseAfterMs: 600 }
                      ]);
                    }
                    awardCoins(15, 'Temel Kelimeler Dinlendi');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-2xl text-xs font-black flex items-center justify-center space-x-2 transition-all shadow-md shrink-0"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Tümünü Sırayla Dinle ▶️</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 pt-2">
                {ESSENTIAL_VOCABULARY.map((voc) => {
                  const isPlaying = playingId === `voc_${voc.id}`;
                  const fullWord = `${voc.article ? voc.article + ' ' : ''}${voc.german}`;
                  return (
                    <div
                      key={voc.id}
                      className="p-4 bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl space-y-3 transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                              {voc.category}
                            </span>
                            <h4 className="text-base font-black text-white mt-1 group-hover:text-amber-300 transition-colors">
                              {voc.article && <span className="text-indigo-400 font-bold mr-1">{voc.article}</span>}
                              {voc.german}
                            </h4>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => handlePlayAudio(fullWord, `voc_${voc.id}`)}
                              className={`p-2 rounded-xl transition-all ${
                                isPlaying ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:text-white'
                              }`}
                              title="Kelimeyi Dinle"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenPronunciationWithPhrase(fullWord)}
                              className="p-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-slate-400 hover:text-white transition-all"
                              title="AI ile Telaffuz Et"
                            >
                              <Mic className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="text-xs font-mono font-bold text-amber-400">
                          [{voc.pronunciation}]
                        </div>

                        <div className="text-xs font-bold text-slate-200">
                          {voc.turkish}
                        </div>
                      </div>

                      {/* Example sentence */}
                      <div className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-300">🇩🇪 {voc.exampleSentence}</span>
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(voc.exampleSentence, `voc_sent_${voc.id}`)}
                            className="text-slate-400 hover:text-white p-0.5 shrink-0 ml-1"
                            title="Cümleyi Dinle"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-400 italic">🇹🇷 {voc.exampleSentenceTr}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            )}

          </div>
        )}

        {/* ========================================================
            DERS 4: DIE AUSSPRACHEREGELN (TELAFFUZ KURALLARI - DÖKÜMAN 3)
        ======================================================== */}
        {activeTopicId === 'pronunciation' && (
          <div className="space-y-6">

            {/* Search Filter for Rules */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchRule}
                  onChange={(e) => setSearchRule(e.target.value)}
                  placeholder="Kural, harf veya kelime ara..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="text-xs text-slate-400">
                20 Temel Telaffuz Kuralı + "H" Kuralı + 10 Alıştırma Kelimesi
              </div>
            </div>

            {/* 4.1: Pronunciation Rules Grid (Döküman 3 Tablosu) */}
            <div className="space-y-3">
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <span>🗣️</span>
                <span>4.1: 20 Temel Okuma ve Telaffuz Kuralı</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {filteredRules.map((rule, idx) => {
                  const isPlaying = playingId === `rule_${rule.example}`;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                        rule.isHighlight
                          ? 'bg-gradient-to-br from-rose-950/40 to-slate-900 border-rose-500/40 shadow-lg shadow-rose-500/10'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between">
                          <div className="inline-flex items-center space-x-2">
                            <span className="text-lg font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                              {rule.letter}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-300">
                              ➔ [{rule.pronunciation}]
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(rule.example, `rule_${rule.example}`)}
                            className={`p-2 rounded-xl transition-all ${
                              isPlaying ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                            title="Örnek Kelimeyi Sesli Dinle"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 space-y-1">
                          <div className="text-xs font-bold text-white flex items-center justify-between">
                            <span className="text-amber-300 font-bold">{rule.example}</span>
                            <span className="text-[10px] font-mono text-amber-400">[{rule.examplePronunciation}]</span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {rule.meaning}
                          </div>
                        </div>

                        {rule.note && (
                          <div className="text-[10px] text-slate-400 italic">
                            💡 {rule.note}
                          </div>
                        )}
                      </div>

                      {/* Example sentence */}
                      {rule.exampleSentenceDe && (
                        <div className="pt-2 border-t border-slate-800/80 flex items-start justify-between gap-1.5 text-[10px]">
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <p className="text-emerald-300 font-semibold leading-tight truncate">🇩🇪 {rule.exampleSentenceDe}</p>
                            <p className="text-slate-400 italic leading-tight truncate">🇹🇷 {rule.exampleSentenceTr}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(rule.exampleSentenceDe!, `rule_sent_${idx}`)}
                            className="p-1 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-all shrink-0"
                            title="Örnek Cümleyi Dinle"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4.2: SPECIAL "H" HARFİ KURALI PANOSU */}
            <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/60 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📌</span>
                <div>
                  <h3 className="text-lg font-black text-white">
                    4.2: Özel "H" Harfi Kuralı (Die H-Regel)
                  </h3>
                  <p className="text-xs text-indigo-300">
                    {H_RULE_INFO.ruleText}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
                {H_RULE_INFO.examples.map((item, i) => (
                  <div key={i} className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-2 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-white">{item.word}</span>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(item.word, `h_${item.word}`)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-xs font-mono font-bold text-amber-400">[{item.pronunciation}]</div>
                      <div className="text-[11px] text-slate-300">{item.meaning}</div>
                      <div className="text-[10px] text-indigo-400 font-semibold">{item.position}</div>
                    </div>

                    {item.exampleSentenceDe && (
                      <div className="pt-1.5 border-t border-slate-800/80 flex items-start justify-between gap-1 text-[10px]">
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <p className="text-emerald-300 font-semibold leading-tight truncate">🇩🇪 {item.exampleSentenceDe}</p>
                          <p className="text-slate-400 text-[9px] italic truncate">🇹🇷 {item.exampleSentenceTr}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(item.exampleSentenceDe!, `h_sent_${i}`)}
                          className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded shrink-0"
                          title="Cümleyi Dinle"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 4.3: 10 ALIŞTIRMA KELİMESİ (DÖKÜMAN 3 ALTI) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center space-x-2">
                    <span>📝</span>
                    <span>4.3: Dökümandaki 10 Pratik Alıştırma Kelimesi (Wörter & Aussprache)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Kuralların uygulandığı kelimeleri inceleyin ve sesli telaffuzlarını dinleyin.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {PRONUNCIATION_PRACTICE_WORDS.map((pw, i) => (
                  <div key={i} className="p-4 bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl space-y-2 transition-all flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs text-amber-400 font-mono font-bold">#{i + 1}</span>
                          <h4 className="text-sm font-black text-white mt-0.5">{pw.word}</h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(pw.word, `pw_${pw.word}`)}
                          className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-all"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-xs font-mono font-bold text-amber-400">[{pw.pronunciation}]</div>
                      <div className="text-xs text-slate-300 font-semibold">{pw.meaning}</div>
                      <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                        💡 {pw.rulesApplied}
                      </div>
                    </div>

                    {pw.exampleSentenceDe && (
                      <div className="pt-2 border-t border-slate-800/80 flex items-start justify-between gap-1 text-[10px]">
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <p className="text-emerald-300 font-semibold leading-tight truncate">🇩🇪 {pw.exampleSentenceDe}</p>
                          <p className="text-slate-400 text-[9px] italic truncate">🇹🇷 {pw.exampleSentenceTr}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(pw.exampleSentenceDe!, `pw_sent_${i}`)}
                          className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded shrink-0"
                          title="Cümleyi Dinle"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            DERS 5: EKSTRA SORULAR & DİYALOGLAR (DÖKÜMAN 5)
        ======================================================== */}
        {activeTopicId === 'extra_questions' && (
          <div className="space-y-6">

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">
                  Resmi & Günlük Hayat Soru-Cevap Şablonları
                </h3>
                <p className="text-xs text-slate-400">
                  Telefon, Kimlik/TC, Kapı No, Alan Kodu, Kilometre (Circa), Posta Kodu (PLZ) ve Araç Plakası kalıpları.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full">
                7 Soru & Cevap Kalıbı
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EXTRA_QUESTIONS.map((q) => {
                const userVal = customQuestionAnswers[q.id] || '';
                const isPlayingQ = playingId === `eq_q_${q.id}`;
                const isPlayingA = playingId === `eq_a_${q.id}`;

                return (
                  <div
                    key={q.id}
                    className="p-5 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl space-y-4 shadow-lg flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                          Soru #{q.number} • {q.category}
                        </span>
                        {q.specialNote && (
                          <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md font-semibold">
                            💡 {q.specialNote}
                          </span>
                        )}
                      </div>

                      {/* Question Box */}
                      <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">FRAGE (SORU)</span>
                            <h4 className="text-sm font-black text-white mt-0.5">{q.questionDe}</h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(q.questionDe, `eq_q_${q.id}`)}
                            className="p-2 bg-slate-900 text-slate-300 hover:text-white rounded-xl"
                            title="Soruyu Dinle"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-xs text-slate-300 font-semibold">{q.questionTr}</div>
                        <div className="text-[10px] text-slate-500 italic">Harfi harfine meali: {q.questionTrLiteral}</div>
                      </div>

                      {/* Answer Template Box */}
                      <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">ANTWORT (CEVAP ŞABLONU)</span>
                            <h4 className="text-sm font-black text-emerald-300 mt-0.5">{q.answerTemplateDe}</h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(q.sampleAnswer, `eq_a_${q.id}`)}
                            className="p-2 bg-slate-900 text-slate-300 hover:text-white rounded-xl"
                            title="Örnek Cevabı Dinle"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-xs text-slate-300">{q.answerTemplateTr}</div>
                        {q.pronunciationNote && (
                          <div className="text-[10px] font-mono text-amber-400 mt-1">
                            📢 {q.pronunciationNote}
                          </div>
                        )}
                      </div>

                      {/* User Custom Answer Simulation */}
                      <div className="space-y-1.5 pt-1">
                        <label className="text-[11px] font-bold text-slate-400 block">
                          Kendi Cevabınızı Yazıp Deneyin:
                        </label>
                        <input
                          type="text"
                          value={userVal}
                          onChange={(e) => setCustomQuestionAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                          placeholder={`Örn: ${q.sampleAnswer}`}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Listen Button */}
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(userVal.trim() || q.sampleAnswer, `eq_user_${q.id}`)}
                      className="w-full py-2.5 bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-200 rounded-xl font-black text-xs flex items-center justify-center space-x-2 transition-all"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{userVal.trim() ? 'Kendi Cevabını Dinle' : 'Örnek Cevabı Sesli Dinle'}</span>
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================================
            DERS 6: ALLTAGSDEUTSCH (SELAMLAŞMA, VEDA, HAL-HATIR & NEZAKET)
        ======================================================== */}
        {activeTopicId === 'alltagsdeutsch' && (
          <CurriculumAlltagsdeutschView
            playingId={playingId}
            alltagsAudioMode={alltagsAudioMode}
            setAlltagsAudioMode={setAlltagsAudioMode}
            handlePlayAudio={handlePlayAudio}
            handlePlayAlltagsItem={handlePlayAlltagsItem}
            handlePlayAllAlltags={handlePlayAllAlltags}
            handleOpenPronunciationWithPhrase={handleOpenPronunciationWithPhrase}
            awardCoins={awardCoins}
          />
        )}

        {/* ========================================================
            DERS 7: W-FRAGEN (3. NOT & TEMALI KARTLAR)
        ======================================================== */}
        {activeTopicId === 'w_fragen' && (
          <CurriculumWFragenView
            playingId={playingId}
            alphabetSpeechSpeed={alphabetSpeechSpeed}
            handlePlayAudio={handlePlayAudio}
            handlePlayWFrage={handlePlayWFrage}
            handleOpenPronunciationWithPhrase={handleOpenPronunciationWithPhrase}
            awardCoins={awardCoins}
          />
        )}

        {/* ========================================================
            DERS 8: WICHTIGE VERBEN (40+ ÖNEMLİ FİİL)
        ======================================================== */}
        {activeTopicId === 'important_verbs' && (
          <CurriculumVerbsView
            playingId={playingId}
            handlePlayAudio={handlePlayAudio}
            handlePlayVerbDetails={handlePlayVerbDetails}
            handlePlayAllVerbs={handlePlayAllVerbs}
            handleOpenPronunciationWithPhrase={handleOpenPronunciationWithPhrase}
            awardCoins={awardCoins}
          />
        )}

        {/* ========================================================
            DERS 9: PRÄPOSITIONEN & ADJEKTIVE (4. NOT & SIFATLAR)
        ======================================================== */}
        {activeTopicId === 'prepositions_adjectives' && (
          <CurriculumPrepositionsAdjectivesView
            playingId={playingId}
            handlePlayAudio={handlePlayAudio}
            handlePlayPreposition={handlePlayPreposition}
            handlePlayAdjective={handlePlayAdjective}
            handleOpenPronunciationWithPhrase={handleOpenPronunciationWithPhrase}
            awardCoins={awardCoins}
          />
        )}

        {/* ========================================================
            DERS 10: WORTSCHATZ (TEMEL KELİMELER & GÖRSEL KARTLAR)
        ======================================================== */}
        {activeTopicId === 'vocabulary' && (
          <CurriculumVocabularyView
            playingId={playingId}
            handlePlayAudio={handlePlayAudio}
            handleOpenPronunciationWithPhrase={handleOpenPronunciationWithPhrase}
            handleSelectTopic={handleSelectTopic}
          />
        )}

        {/* ========================================================
            DERS 7: JETON ARENASI & SINAV (PRÜFUNG & MAĞAZA)
        ======================================================== */}
        {activeTopicId === 'quiz_arena' && (
          <div className="space-y-6">

            {/* Quiz Header & Score Card */}
            <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  🏆 İnteraktif A1 Sınavı
                </span>
                <h3 className="text-2xl font-black text-white mt-2">
                  Tüm Konulardan Jeton Kazanma Arenası
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Her doğru cevapta anında <strong>+10 Jeton 🪙</strong> kazanın ve Jeton Mağazasından özel rozetlerin kilidini açın!
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsShopModalOpen(true)}
                className="px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
              >
                <Coins className="w-4 h-4 text-slate-950" />
                <span>Jeton Mağazası & Rozetler ({tokenState.coins} 🪙)</span>
              </button>
            </div>

            {/* Quiz Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {QUIZ_QUESTIONS.map((q, idx) => {
                const isAnswered = quizSubmitted[q.id];
                const selectedIdx = quizAnswers[q.id];
                const isCorrect = selectedIdx === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-3xl border transition-all space-y-4 ${
                      isAnswered
                        ? isCorrect
                          ? 'bg-emerald-950/20 border-emerald-500/40'
                          : 'bg-rose-950/20 border-rose-500/40'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                        Soru #{idx + 1}
                      </span>
                      <span className="text-xs font-bold text-amber-400 flex items-center space-x-1">
                        <span>+{q.tokenReward} 🪙</span>
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-white">
                      {q.questionText}
                    </h4>

                    {/* Options */}
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const optLetter = ['A', 'B', 'C', 'D'][optIdx] || `${optIdx + 1}`;
                        let btnClass = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-amber-500/50 hover:text-white';
                        let letterBadgeClass = 'bg-slate-800 text-slate-400 border-slate-700';
                        
                        if (isAnswered) {
                          if (optIdx === q.correctIndex) {
                            btnClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                            letterBadgeClass = 'bg-emerald-500 text-slate-950 font-black';
                          } else if (optIdx === selectedIdx) {
                            btnClass = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                            letterBadgeClass = 'bg-rose-500 text-white font-black';
                          } else {
                            btnClass = 'bg-slate-950/50 border-slate-900 text-slate-500 opacity-60';
                            letterBadgeClass = 'bg-slate-900 text-slate-600';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isAnswered}
                            onClick={() => handleAnswerQuiz(q.id, optIdx, q.correctIndex, q.tokenReward)}
                            className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between gap-3 ${btnClass}`}
                          >
                            <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                              <span className={`w-6 h-6 rounded-lg text-[11px] flex items-center justify-center font-bold shrink-0 border ${letterBadgeClass}`}>
                                {optLetter}
                              </span>
                              <span className="leading-snug">{opt}</span>
                            </div>
                            {isAnswered && optIdx === q.correctIndex && (
                              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {isAnswered && (
                      <div className={`p-3 rounded-xl text-xs space-y-1 ${
                        isCorrect ? 'bg-emerald-900/30 text-emerald-300' : 'bg-rose-900/30 text-rose-300'
                      }`}>
                        <div className="font-bold flex items-center space-x-1.5">
                          <span>{isCorrect ? '✅ Harika! Doğru Cevap (+10 🪙)' : '❌ Yanlış Cevap'}</span>
                        </div>
                        <p className="text-[11px] text-slate-300">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================================
            DERS 8 / MODÜL: AI DÜZELTME & YAZI ANALİZİ (WRITING CORRECTOR)
        ======================================================== */}
        {activeTopicId === 'ai_writing' && (
          <div className="space-y-6">
            <AiWritingCorrector
              onAwardCoins={(amount, msg) => {
                awardCoins(amount, msg);
                handleCompleteTopic('ai_writing', 80);
              }}
            />
          </div>
        )}

        {/* ========================================================
            DERS 9 / MODÜL: AI TELAFFUZ & KONUŞMA KOÇU (PRONUNCIATION COACH)
        ======================================================== */}
        {activeTopicId === 'ai_pronunciation' && (
          <div className="space-y-6">
            <AiPronunciationCoach
              initialPhrase={pronunciationInitialPhrase}
              onAwardCoins={(amount, msg) => {
                awardCoins(amount, msg);
                handleCompleteTopic('ai_pronunciation', 90);
              }}
            />
          </div>
        )}

        {/* ========================================================
            DERS 14: 130 GOETHE A1 SPRECHEN & BITTEN / VERBOTE
        ======================================================== */}
        {activeTopicId === 'goethe_sprechen' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <GoetheSprechenModule
              onEarnTokens={(amount, msg) => {
                awardCoins(amount, msg);
                handleCompleteTopic('goethe_sprechen', 150);
              }}
              onOpenPronunciation={(phrase) => {
                handleOpenPronunciationWithPhrase(phrase);
              }}
            />
          </div>
        )}

        {/* ========================================================
            DERS 15: SESLİ KONUŞMA PRATİĞİ & AI DİYALOG (CONVERSATION PRACTICE)
        ======================================================== */}
        {activeTopicId === 'conversation_practice' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <GermanConversationPractice
              onAwardCoins={(amount, reason) => {
                awardCoins(amount, reason);
                handleCompleteTopic('conversation_practice', 100);
              }}
              onOpenPronunciation={(phrase, turkish, phonetic) => {
                handleOpenPronunciationWithPhrase(phrase, turkish, phonetic);
              }}
            />
          </div>
        )}

        {/* ========================================================
            DERS 16 / MODÜL: GOETHE A1-B1 SINAV SİMÜLATÖRÜ (GOETHE QUIZ SIMULATION)
        ======================================================== */}
        {activeTopicId === 'goethe_exam_simulation' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <GoetheQuizSimulation
              onEarnReward={(tokenAmount, xpAmount, msg) => {
                awardCoins(tokenAmount, msg);
                handleCompleteTopic('goethe_exam_simulation', 150);
              }}
              onBackToCurriculum={() => {
                setActiveTopicId('alphabet');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* ========================================================
            MODÜL: UYGULAMA AYARLARI, TEMA & GÖRÜNÜM KONTROL MERKEZİ
        ======================================================== */}
        {(activeTopicId === 'settings' || activeTopicId === 'theme_settings') && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <AppSettingsView
              currentUser={currentUser}
              onUserUpdate={(updated) => {
                if (onUserUpdate) {
                  onUserUpdate(updated);
                } else {
                  localStorage.setItem('polyglot_active_user_v1', JSON.stringify(updated));
                  window.dispatchEvent(new CustomEvent('glotvia_user_updated', { detail: updated }));
                }
              }}
              onLogout={onLogout}
              onAccountDeleted={() => {
                if (onLogout) onLogout();
              }}
              onOpenPrivacyPolicy={onOpenPrivacy}
              onOpenAuth={onOpenAuth}
            />
          </div>
        )}

        {/* ========================================================
            MODÜL: A1-B1 RECHARTS MÜFREDAT & İLERLEME ANALİZİ
        ======================================================== */}
        {activeTopicId === 'progress_chart' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <CurriculumProgressChart
              currentUser={
                currentUser || {
                  id: 'guest_user',
                  name: userProfile.vorname ? `${userProfile.vorname} ${userProfile.nachname}`.trim() : 'Almanca Öğrencisi',
                  email: 'ogrenci@glotvia.de',
                  avatar: '🎓',
                  targetLanguage: 'de',
                  nativeLanguage: 'tr',
                  createdAt: new Date().toISOString(),
                  stats: {
                    xp: tokenState.coins * 10 || 450,
                    streak: 5,
                    level: 2,
                    learnedCardIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'],
                    favoriteCardIds: [],
                    completedQuizzesCount: tokenState.completedLessons.length,
                    highestQuizScore: 100,
                    lastActiveDate: new Date().toISOString()
                  }
                }
              }
            />
          </div>
        )}

            </div>
            {/* END OF iOS 26 TRANSLUCENT SWIPEABLE VIEWPORT */}
          </>
        )}

        {/* ========================================================
            iOS 26 TRANSLUCENT BOTTOM LESSON NAVIGATION CARD
        ======================================================== */}
        {currentUser && (
        <div className="backdrop-blur-2xl bg-slate-900/50 border border-white/10 p-4 sm:p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Previous Lesson Card */}
            {prevTopic ? (
              <button
                type="button"
                onClick={goToPrevTopic}
                className="w-full sm:w-auto inline-flex items-center space-x-3 px-5 py-3.5 bg-slate-950/70 hover:bg-slate-800 border border-white/10 hover:border-amber-400/40 rounded-2xl text-xs sm:text-sm font-bold text-slate-200 hover:text-white transition-all shadow-md active:scale-95 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-amber-400 group-hover:border-amber-400/40 transition-colors shrink-0">
                  <ChevronLeft className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-mono text-slate-400">← Önceki Ders #{prevTopic.number}</div>
                  <div className="text-xs sm:text-sm font-black text-white truncate max-w-[200px]">{prevTopic.titleDe}</div>
                </div>
              </button>
            ) : (
              <div className="hidden sm:block" />
            )}

            {/* Middle Swipe Guidance Pill */}
            <div className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-slate-950/60 border border-white/5 rounded-full text-xs text-slate-400">
              <span className="text-amber-400">📱</span>
              <span>Dokunmatik ekranda <strong>sağa/sola kaydırarak</strong> dersler arasında akıcı geçiş yapabilirsiniz.</span>
            </div>

            {/* Next Lesson Card */}
            {nextTopic && (
              <button
                type="button"
                onClick={goToNextTopic}
                className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-end space-x-3 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95 group cursor-pointer"
              >
                <div className="text-left sm:text-right">
                  <div className="text-[10px] uppercase font-mono text-slate-900 font-bold">Sonraki Ders #{nextTopic.number} →</div>
                  <div className="text-xs sm:text-sm font-black text-slate-950 truncate max-w-[200px]">{nextTopic.titleDe}</div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </button>
            )}
          </div>
        </div>
        )}

      </main>

      {/* ========================================================
          FLOATING iOS 26 DYNAMIC GLASS DOCK (STICKY FAST SWITCHER)
      ======================================================== */}
      {currentUser && (
        <aside 
          aria-label="Ders Hızlı Geçiş Menüsü"
          className="fixed bottom-[4.75rem] md:bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="backdrop-blur-3xl bg-slate-950/80 border border-white/15 shadow-[0_12px_45px_rgba(0,0,0,0.7)] rounded-full px-3 py-1.5 sm:px-4 sm:py-2 flex items-center space-x-2 sm:space-x-3 text-white ring-1 ring-white/10">
            
            {/* Quick Prev Button */}
            <button
              type="button"
              disabled={!prevTopic}
              onClick={goToPrevTopic}
              title={prevTopic ? `Önceki: #${prevTopic.number} (${prevTopic.titleDe})` : 'İlk Ders'}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                prevTopic
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 active:scale-90'
                  : 'bg-slate-950/30 text-slate-600 opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Quick Topic Badge & Selector Launcher */}
            <button
              type="button"
              onClick={() => setIsNavDrawerOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-slate-850 border border-white/10 text-xs font-bold transition-all hover:border-amber-400/40 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-mono text-[11px] text-amber-300">Ders #{currentTopic.number}</span>
              <span className="text-[10px] text-slate-400 hidden sm:inline truncate max-w-[110px]">({currentTopic.titleDe})</span>
              <span className="text-[9px] text-slate-500 font-mono">▼</span>
            </button>

            {/* Quick Micro Progress Strip */}
            <div className="hidden sm:flex items-center space-x-1">
              {CURRICULUM_TOPICS.map((topic) => {
                const isCurrent = topic.id === activeTopicId;
                const isDone = tokenState.completedLessons.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    type="button"
                    title={`Ders #${topic.number}: ${topic.titleDe}`}
                    onClick={() => handleSelectTopic(topic)}
                    className={`transition-all rounded-full cursor-pointer ${
                      isCurrent
                        ? 'w-4 h-2 bg-amber-400 ring-1 ring-amber-300'
                        : isDone
                        ? 'w-1.5 h-1.5 bg-emerald-400/80 hover:bg-emerald-300'
                        : 'w-1.5 h-1.5 bg-slate-700 hover:bg-slate-500'
                    }`}
                  />
                );
              })}
            </div>

            {/* Quick Next Button */}
            <button
              type="button"
              disabled={!nextTopic}
              onClick={goToNextTopic}
              title={nextTopic ? `Sonraki: #${nextTopic.number} (${nextTopic.titleDe})` : 'Son Ders'}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                nextTopic
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black border border-amber-300 shadow-md active:scale-90'
                  : 'bg-slate-900/40 text-slate-600 opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>
        </aside>
      )}

      {/* ========================================================
          4. COIN REWARD TOAST POPUP (UÇAN JETON BİLDİRİMİ)
      ======================================================== */}
      {coinPopup && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black rounded-2xl shadow-2xl shadow-amber-500/40 flex items-center space-x-3 border-2 border-yellow-200">
            <span className="text-2xl">🪙</span>
            <div>
              <div className="text-sm font-extrabold">{coinPopup.amount > 0 ? `+${coinPopup.amount}` : coinPopup.amount} Kredi</div>
              <div className="text-[11px] text-slate-900 font-semibold">{coinPopup.message}</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. KREDİ İLE DERS AÇMA MODALI (LESSON UNLOCK MODAL)
      ======================================================== */}
      {unlockModalTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shrink-0 shadow-lg shadow-amber-500/10">
                  🔒
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Ders #{unlockModalTopic.number}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      ⏱️ {unlockModalTopic.estimatedMinutes} dk
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                    {unlockModalTopic.titleDe}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {unlockModalTopic.titleTr}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUnlockModalTopic(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Lesson Summary Card */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Ders Kapsamı:</span>
                <span className="text-indigo-400 font-bold">{unlockModalTopic.badge}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {unlockModalTopic.description}
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Tamamlama Ödülü:</span>
                <span className="text-emerald-400 font-black flex items-center space-x-1">
                  <span>+{unlockModalTopic.tokenReward} 🪙 Kredi</span>
                </span>
              </div>
            </div>

            {/* Cost & Balance Breakdown Card */}
            <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-indigo-950/20 border border-amber-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300 font-bold flex items-center space-x-1.5">
                  <span>🪙 Giriş Ücreti:</span>
                </span>
                <span className="text-base font-black text-amber-300">
                  {unlockModalTopic.creditCost} Kredi
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800">
                <span>Mevcut Bakiyeniz:</span>
                <span className="font-bold text-white flex items-center space-x-1">
                  <span>🪙 {tokenState.coins} Kredi</span>
                </span>
              </div>

              {tokenState.coins >= unlockModalTopic.creditCost ? (
                <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold pt-1 border-t border-slate-800/60">
                  <span>Kalan Bakiye:</span>
                  <span>🪙 {tokenState.coins - unlockModalTopic.creditCost} Kredi</span>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                  <span className="text-base">⚠️</span>
                  <span>Yetersiz bakiye! Bu ders için <strong>{unlockModalTopic.creditCost - tokenState.coins} kredi</strong> daha gerekiyor.</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {tokenState.coins >= unlockModalTopic.creditCost ? (
              <button
                type="button"
                onClick={() => handleUnlockLessonWithCredits(unlockModalTopic)}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-2xl text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2"
              >
                <span>🔓</span>
                <span>{unlockModalTopic.creditCost} Kredi İle Dersi Aç ve Başla</span>
              </button>
            ) : (
              <div className="space-y-2">
                {/* Option A: Buy Credits Instantly */}
                {onOpenPricing && (
                  <button
                    type="button"
                    onClick={() => {
                      setUnlockModalTopic(null);
                      onOpenPricing('credits', 'pkg_starter');
                    }}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-black rounded-2xl text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>🪙 Kredi Satın Al (+100 Kredi ₺49)</span>
                  </button>
                )}

                {/* Option B: Upgrade to PRO VIP */}
                {onOpenPricing && (
                  <button
                    type="button"
                    onClick={() => {
                      setUnlockModalTopic(null);
                      onOpenPricing('plans');
                    }}
                    className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-bold rounded-2xl text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>👑 Sınırsız VIP Ol (Tüm Kilitleri Kaldır)</span>
                  </button>
                )}

                {/* Option C: Quiz Arena (Earn free credits) */}
                <button
                  type="button"
                  onClick={() => {
                    setUnlockModalTopic(null);
                    setActiveTopicId('quiz_arena');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 px-4 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-white font-bold rounded-2xl text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>🎯 Sınav Arenasında Test Çöz (Her Doğruda +10 Kredi)</span>
                </button>

                {/* Option D: Claim Daily Bonus if available */}
                {canClaimDailyBonus && (
                  <button
                    type="button"
                    onClick={() => {
                      handleClaimDailyBonus();
                    }}
                    className="w-full py-2.5 px-4 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold rounded-2xl text-xs transition-all flex items-center justify-center space-x-2 animate-pulse cursor-pointer"
                  >
                    <span>🎁 Bugünkü Giriş Bonusunu Al (+25 Kredi)</span>
                  </button>
                )}
              </div>
            )}

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setUnlockModalTopic(null)}
                className="text-xs text-slate-400 hover:text-slate-200 underline font-semibold cursor-pointer"
              >
                Vazgeç / Kapat
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          GÜNLÜK GİRİŞ HEDİYESİ MODALI (DAILY BONUS MODAL)
      ======================================================== */}
      {isDailyBonusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/80 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center">
            
            <button
              onClick={() => setIsDailyBonusModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-all"
            >
              ✕
            </button>

            {/* Gift Visual */}
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/30 transform hover:rotate-6 transition-transform">
                🎁
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-black">
                <span>✨ Günlük Giriş Hediyesi</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Tebrikler! 25 Krediniz Hazır
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
                Her gün uygulamaya giriş yaparak ücretsiz 25 kredi kazanabilir ve Goethe A1 sınav müfredatındaki tüm kilitli dersleri açabilirsiniz.
              </p>
            </div>

            {/* Streak info */}
            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between text-xs font-bold">
              <div className="flex items-center space-x-2 text-rose-400">
                <span className="text-base">🔥</span>
                <span>Seri Durumu:</span>
              </div>
              <span className="text-white font-mono bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                {tokenState.streakDays || 1} Günlük Seri
              </span>
            </div>

            {/* Action */}
            {canClaimDailyBonus ? (
              <button
                type="button"
                onClick={() => {
                  handleClaimDailyBonus();
                  setIsDailyBonusModalOpen(false);
                }}
                className="w-full py-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:brightness-110 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>🎁 25 Krediyi Al (+25 🪙)</span>
                <span>✨</span>
              </button>
            ) : (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-bold">
                ✅ Bugünkü 25 Kredi hediyenizi aldınız! Yarın yeni hediyenizle tekrar bekleriz.
              </div>
            )}

            <p className="text-[11px] text-slate-500 font-medium">
              Kredilerinizi yeni derslerin kilidini açmak veya AI Telaffuz & Yazma koçlarında kullanabilirsiniz.
            </p>

          </div>
        </div>
      )}

      {/* ========================================================
          6. JETON MAĞAZASI & ROZETLER MODALI (SHOP MODAL)
      ======================================================== */}
      {isShopModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl">
                  🪙
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">Kredi Mağazası & Başarı Rozetleri</h3>
                  <p className="text-xs text-slate-400">Mevcut Bakiyeniz: <strong className="text-amber-400">{tokenState.coins} 🪙 Kredi</strong></p>
                </div>
              </div>
              <button
                onClick={() => setIsShopModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* TOP BUY CREDITS PROMO BANNER */}
            {onOpenPricing && (
              <div className="p-4 bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-yellow-500/15 border border-amber-500/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start space-x-1.5 text-xs font-black text-amber-400">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Hemen Kredi Satın Al</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    İstediğiniz dersleri anında açın, sınav ve telaffuz koçunda sınırsız pratik yapın.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsShopModalOpen(false);
                    onOpenPricing('credits');
                  }}
                  className="shrink-0 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  🪙 Kredi Paketleri (₺49'den başlayan) →
                </button>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Açılabilir Rozetler & Ödüller</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {TOKEN_REWARDS_SHOP.map((reward) => {
                  const isUnlocked = tokenState.unlockedRewards.includes(reward.id);
                  const canAfford = tokenState.coins >= reward.cost;

                  return (
                    <div
                      key={reward.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isUnlocked
                          ? 'bg-emerald-950/30 border-emerald-500/40'
                          : 'bg-slate-950/80 border-slate-800'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-white">{reward.name}</span>
                          {isUnlocked ? (
                            <span className="text-xs text-emerald-400 font-black flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Açık</span>
                            </span>
                          ) : (
                            <span className="text-xs font-black text-amber-400">
                              {reward.cost} 🪙
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">{reward.description}</p>
                      </div>

                      <div className="mt-4">
                        {isUnlocked ? (
                          reward.id === 'certificate_a1_complete' ? (
                            <button
                              type="button"
                              onClick={() => {
                                setIsShopModalOpen(false);
                                setIsCertificateOpen(true);
                              }}
                              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                            >
                              Sertifikayı Görüntüle 👑
                            </button>
                          ) : (
                            <div className="w-full py-2 text-center text-xs text-emerald-400 font-bold bg-emerald-500/10 rounded-xl">
                              ✅ Rozet Kazanıldı
                            </div>
                          )
                        ) : (
                          <button
                            type="button"
                            onClick={() => handlePurchaseReward(reward.id, reward.cost)}
                            disabled={!canAfford}
                            className={`w-full py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                              canAfford
                                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            {canAfford ? `Kilidi Aç (${reward.cost} 🪙)` : `Yetersiz Kredi (${reward.cost} 🪙)`}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          6. DİJİTAL SERTİFİKA MODALI (CERTIFICATE MODAL)
      ======================================================== */}
      {isCertificateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-amber-500/50 rounded-3xl p-8 space-y-6 shadow-2xl text-center my-8">
            
            <button
              onClick={() => setIsCertificateOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
            >
              ✕
            </button>

            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 mx-auto flex items-center justify-center text-3xl">
              👑
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-mono tracking-widest text-amber-400">ZERTIFIKAT DER DEUTSCHEN SPRACHE</span>
              <h2 className="text-2xl font-black text-white">Almanca A1 Başarı Sertifikası</h2>
              <p className="text-xs text-slate-300">
                Alman Alfabesi, Telaffuz Kuralları, Sayılar, Kodlama ve Ekstra Diyalogları Başarıyla Tamamlayan:
              </p>
            </div>

            <div className="py-4 border-y border-amber-500/30">
              <div className="text-2xl font-black text-amber-300 uppercase tracking-wide">
                {currentUser?.name || userProfile.vorname ? `${userProfile.vorname} ${userProfile.nachname}`.trim() : 'ÖĞRENCİ (DEUTSCH SCHÜLER)'}
              </div>
              <div className="text-xs text-slate-400 mt-1">A1 Seviye Başlangıç Başarı Belgesi</div>
            </div>

            <p className="text-xs text-slate-400">
              Tarih: {new Date().toLocaleDateString('tr-TR')} • Toplam Jeton: {tokenState.coins} 🪙
            </p>

            <button
              onClick={() => setIsCertificateOpen(false)}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs"
            >
              Harika! Kapat
            </button>

          </div>
        </div>
      )}

      {/* ========================================================
          INTERAKTİF ALMANCA TELAFFUZ VE FONETİK DEĞERLENDİRME MODALI
      ======================================================== */}
      {isPronunciationModalOpen && (
        <GermanPronunciationModal
          isOpen={isPronunciationModalOpen}
          targetGermanText={pronunciationModalTarget.germanText}
          turkishMeaning={pronunciationModalTarget.turkishMeaning}
          phoneticHint={pronunciationModalTarget.phoneticHint}
          onClose={() => setIsPronunciationModalOpen(false)}
          onAwardCoins={(amount, msg) => awardCoins(amount, msg)}
        />
      )}

      {/* ========================================================
          PREMIUM / PLUS KISITLAMA & YÜKSELTME MODALI
      ======================================================== */}
      <PremiumGateModal
        isOpen={gateModal.isOpen}
        featureTitle={gateModal.featureTitle}
        featureDescription={gateModal.featureDescription}
        requiredTier={gateModal.requiredTier || 'plus'}
        userTier={getUserTier(currentUser)}
        iconType={gateModal.iconType}
        onClose={() => setGateModal(prev => ({ ...prev, isOpen: false }))}
        onUpgrade={() => {
          setGateModal(prev => ({ ...prev, isOpen: false }));
          if (onOpenPricing) {
            onOpenPricing('plans');
          }
        }}
      />

      {/* Language Selection Modal (Global Multi-Language Switcher) */}
      <LanguageSelectionModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentUser={currentUser}
        onUserUpdate={onUserUpdate}
        onOpenAuth={onOpenAuth}
      />

      {/* Theme Customizer Modal (Internal Fallback) */}
      {isInternalThemeModalOpen && (
        <ThemeCustomizerModal
          isOpen={isInternalThemeModalOpen}
          onClose={() => setIsInternalThemeModalOpen(false)}
        />
      )}

      {/* ========================================================
          7. GLOTVIA FLOATING LIQUID GLASS NAVIGATION BAR
      ======================================================== */}
      <GlassNavigation
        activeTab={
          activeTopicId === 'settings' || activeTopicId === 'theme_settings'
            ? 'settings'
            : activeTopicId === 'progress_chart'
            ? 'progress'
            : activeTopicId === 'ai_pronunciation' || activeTopicId === 'ai_writing' || activeTopicId === 'goethe_sprechen'
            ? 'practice'
            : isNavDrawerOpen
            ? 'learn'
            : 'home'
        }
        onTabChange={(tabId) => {
          if (tabId === 'home') {
            setIsNavDrawerOpen(false);
            if (activeTopicId === 'ai_pronunciation' || activeTopicId === 'ai_writing' || activeTopicId === 'progress_chart' || activeTopicId === 'theme_settings' || activeTopicId === 'settings') {
              setActiveTopicId(CURRICULUM_TOPICS[0].id);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (tabId === 'learn') {
            setIsNavDrawerOpen(true);
          } else if (tabId === 'practice') {
            setIsNavDrawerOpen(false);
            setPronunciationInitialPhrase(undefined);
            handleSelectTopic('ai_pronunciation');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (tabId === 'progress') {
            setIsNavDrawerOpen(false);
            handleSelectTopic('progress_chart');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (tabId === 'settings') {
            setIsNavDrawerOpen(false);
            handleSelectTopic('settings');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (tabId === 'profile') {
            if (currentUser && onOpenAccountSettings) {
              onOpenAccountSettings();
            } else if (onOpenAuth) {
              onOpenAuth();
            } else {
              setIsShopModalOpen(true);
            }
          }
        }}
      />

    </div>
  );
};
