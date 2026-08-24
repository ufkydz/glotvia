import { UserProfile, LanguageId, LanguageLevel, LearningLanguageSlot, LanguageVocabularyItem } from '../types';
import { syncUserToFirestore } from '../services/firebaseDbService';

const STORAGE_KEY_USERS = 'polyglot_users_v1';
const STORAGE_KEY_CURRENT_USER = 'polyglot_active_user_v1';
const STORAGE_KEY_AUTH_STATE = 'polyglot_auth_logged_in_v1';

export const isUserLoggedIn = (): boolean => {
  try {
    const rawUser = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    const authState = localStorage.getItem(STORAGE_KEY_AUTH_STATE);
    return authState === 'true' && !!rawUser;
  } catch {
    return false;
  }
};

export const setLoggedInState = (isLoggedIn: boolean) => {
  try {
    localStorage.setItem(STORAGE_KEY_AUTH_STATE, isLoggedIn ? 'true' : 'false');
    if (!isLoggedIn) {
      localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    }
  } catch (e) {
    console.error('Failed to set login state', e);
  }
};

const DEFAULT_DEMO_USER: UserProfile = {
  id: 'demo_polyglot_user',
  name: 'Ufuk Dilbilimci',
  email: 'ufukyildiz999@gmail.com',
  avatar: '🚀',
  targetLanguage: 'de', // Default German, switchable to any of 19 languages
  nativeLanguage: 'tr',
  createdAt: new Date().toISOString(),
  learningLanguages: [
    {
      targetLanguage: 'de',
      level: 'A1',
      progressPercentage: 45,
      dailyGoalWords: 15,
      learnedCardIds: ['food_apple', 'food_bread', 'animal_cat', 'animal_dog', 'travel_airplane', 'home_table', 'nature_sun'],
      favoriteCardIds: ['food_apple', 'travel_airplane'],
      completedLessons: ['alphabet', 'greetings', 'numbers', 'colors'],
      totalXp: 380,
      lastStudiedDate: new Date().toISOString().split('T')[0],
      vocabularyList: [
        { id: 'v_de_1', word: 'der Apfel', translation: 'elma', level: 'A1', notes: 'Eril (der)', addedAt: new Date().toISOString(), mastered: true },
        { id: 'v_de_2', word: 'das Brot', translation: 'ekmek', level: 'A1', notes: 'Nötr (das)', addedAt: new Date().toISOString(), mastered: true },
        { id: 'v_de_3', word: 'die Katze', translation: 'kedi', level: 'A1', notes: 'Dişil (die)', addedAt: new Date().toISOString(), mastered: true },
        { id: 'v_de_4', word: 'Guten Tag', translation: 'İyi günler', level: 'A1', notes: 'Resmi selamlama', addedAt: new Date().toISOString(), mastered: false },
        { id: 'v_de_5', word: 'Auf Wiedersehen', translation: 'Görüşmek üzere', level: 'A1', notes: 'Vedalaşma', addedAt: new Date().toISOString(), mastered: false }
      ]
    },
    {
      targetLanguage: 'en',
      level: 'B1',
      progressPercentage: 70,
      dailyGoalWords: 20,
      learnedCardIds: ['food_apple', 'food_bread', 'food_coffee', 'animal_cat', 'animal_dog', 'travel_airplane'],
      favoriteCardIds: ['food_coffee'],
      completedLessons: ['daily_phrases', 'business_intro'],
      totalXp: 520,
      lastStudiedDate: new Date().toISOString().split('T')[0],
      vocabularyList: [
        { id: 'v_en_1', word: 'serendipity', translation: 'tatlı tesadüf', level: 'B1', notes: 'İleri düzey kelime', addedAt: new Date().toISOString(), mastered: true },
        { id: 'v_en_2', word: 'accomplish', translation: 'başarmak', level: 'B1', notes: 'Fiil', addedAt: new Date().toISOString(), mastered: false }
      ]
    },
    {
      targetLanguage: 'es',
      level: 'A1',
      progressPercentage: 20,
      dailyGoalWords: 10,
      learnedCardIds: ['food_apple', 'food_bread'],
      favoriteCardIds: [],
      completedLessons: ['hola_amigos'],
      totalXp: 120,
      lastStudiedDate: new Date().toISOString().split('T')[0],
      vocabularyList: [
        { id: 'v_es_1', word: 'Hola', translation: 'Merhaba', level: 'A1', notes: 'Temel selamlama', addedAt: new Date().toISOString(), mastered: true },
        { id: 'v_es_2', word: 'Gracias', translation: 'Teşekkürler', level: 'A1', notes: 'Nezaket', addedAt: new Date().toISOString(), mastered: true }
      ]
    }
  ],
  stats: {
    xp: 680,
    streak: 5,
    level: 7,
    learnedCardIds: ['food_apple', 'food_bread', 'animal_cat', 'animal_dog', 'travel_airplane', 'home_table', 'nature_sun'],
    learnedCardIdsByLanguage: {
      de: ['food_apple', 'food_bread', 'animal_cat', 'animal_dog', 'travel_airplane', 'home_table', 'nature_sun'],
      en: ['food_apple', 'food_bread', 'food_coffee', 'animal_cat', 'animal_dog', 'travel_airplane', 'clothing_shoes', 'home_table', 'nature_sun', 'professions_doctor'],
      es: ['food_apple', 'food_bread', 'animal_cat', 'travel_airplane', 'home_table', 'nature_sun'],
      fr: ['food_apple', 'food_coffee', 'animal_cat', 'travel_airplane', 'nature_sun'],
      it: ['food_apple', 'food_coffee', 'animal_cat', 'travel_airplane'],
      ja: ['food_apple', 'animal_cat', 'nature_sun'],
      ko: ['food_apple', 'animal_cat'],
      zh: ['food_apple', 'travel_airplane'],
      ru: ['food_apple', 'animal_cat', 'nature_sun'],
      ar: ['food_apple'],
      pt: ['food_apple', 'animal_cat', 'food_coffee'],
      nl: ['food_apple', 'animal_cat', 'home_table'],
      el: ['food_apple', 'nature_sun'],
      hi: ['food_apple'],
      sv: ['food_apple', 'nature_sun', 'animal_cat'],
      tr: ['food_apple', 'food_bread', 'food_coffee', 'animal_cat', 'animal_dog', 'travel_airplane', 'home_table', 'nature_sun', 'professions_doctor', 'clothing_shoes']
    },
    favoriteCardIds: ['food_coffee', 'travel_airplane', 'nature_sun'],
    completedQuizzesCount: 8,
    highestQuizScore: 100,
    lastActiveDate: new Date().toISOString().split('T')[0]
  }
};

export const sanitizeUser = (user: any): UserProfile => {
  if (!user || typeof user !== 'object') return { ...DEFAULT_DEMO_USER };

  const validLangIds: LanguageId[] = ['tr', 'en', 'de', 'es', 'fr', 'it', 'ru', 'ja', 'ko', 'zh', 'ar', 'pt', 'nl', 'pl', 'ro', 'uk', 'el', 'hi', 'sv'];
  const targetLang = validLangIds.includes(user.targetLanguage) ? user.targetLanguage : 'de';
  const nativeLang = validLangIds.includes(user.nativeLanguage) ? user.nativeLanguage : 'tr';

  const defaultStats = DEFAULT_DEMO_USER.stats;
  const stats = user.stats && typeof user.stats === 'object' ? user.stats : {};

  const learnedCardIds = Array.isArray(stats.learnedCardIds) ? stats.learnedCardIds : [...defaultStats.learnedCardIds];
  const favoriteCardIds = Array.isArray(stats.favoriteCardIds) ? stats.favoriteCardIds : [...defaultStats.favoriteCardIds];
  const learnedMap = stats.learnedCardIdsByLanguage && typeof stats.learnedCardIdsByLanguage === 'object'
    ? stats.learnedCardIdsByLanguage
    : { ...defaultStats.learnedCardIdsByLanguage };

  // Sanitize or bootstrap learningLanguages array
  let learningLanguages: LearningLanguageSlot[] = [];
  if (Array.isArray(user.learningLanguages) && user.learningLanguages.length > 0) {
    learningLanguages = user.learningLanguages.map((slot: any): LearningLanguageSlot => ({
      targetLanguage: validLangIds.includes(slot.targetLanguage) ? slot.targetLanguage : targetLang,
      level: ['A1', 'A2', 'B1', 'B2', 'C1'].includes(slot.level) ? slot.level : 'A1',
      progressPercentage: typeof slot.progressPercentage === 'number' ? Math.min(100, Math.max(0, slot.progressPercentage)) : 20,
      dailyGoalWords: typeof slot.dailyGoalWords === 'number' ? slot.dailyGoalWords : 10,
      learnedCardIds: Array.isArray(slot.learnedCardIds) ? slot.learnedCardIds : [],
      favoriteCardIds: Array.isArray(slot.favoriteCardIds) ? slot.favoriteCardIds : [],
      completedLessons: Array.isArray(slot.completedLessons) ? slot.completedLessons : [],
      totalXp: typeof slot.totalXp === 'number' ? slot.totalXp : 50,
      lastStudiedDate: slot.lastStudiedDate || new Date().toISOString().split('T')[0],
      vocabularyList: Array.isArray(slot.vocabularyList) ? slot.vocabularyList : []
    }));
  } else {
    // Default bootstrap slot with active target language
    learningLanguages = [
      {
        targetLanguage: targetLang,
        level: user.level || 'A1',
        progressPercentage: 35,
        dailyGoalWords: user.dailyGoal || 15,
        learnedCardIds: [...learnedCardIds],
        favoriteCardIds: [...favoriteCardIds],
        completedLessons: ['alphabet', 'greetings'],
        totalXp: typeof stats.xp === 'number' ? stats.xp : 100,
        lastStudiedDate: new Date().toISOString().split('T')[0],
        vocabularyList: [
          { id: `v_${targetLang}_1`, word: 'Hallo / Hello', translation: 'Merhaba', level: 'A1', notes: 'Temel selamlama', addedAt: new Date().toISOString(), mastered: true }
        ]
      }
    ];
  }

  return {
    id: typeof user.id === 'string' && user.id ? user.id : 'user_' + Date.now(),
    name: typeof user.name === 'string' && user.name ? user.name : 'Dilbilimci',
    email: typeof user.email === 'string' && user.email ? user.email : 'user@polyglot.app',
    avatar: typeof user.avatar === 'string' && user.avatar ? user.avatar : '🚀',
    targetLanguage: targetLang,
    nativeLanguage: nativeLang,
    learningLanguages: learningLanguages,
    level: user.level || 'A1',
    createdAt: user.createdAt || new Date().toISOString(),
    password: typeof user.password === 'string' ? user.password : undefined,
    isEmailVerified: !!user.isEmailVerified,
    emailVerifiedAt: user.emailVerifiedAt || null,
    isPremium: !!user.isPremium,
    premiumPlan: user.premiumPlan,
    subscriptionPlan: user.subscriptionPlan,
    stats: {
      xp: typeof stats.xp === 'number' ? stats.xp : 50,
      streak: typeof stats.streak === 'number' ? stats.streak : 1,
      level: typeof stats.level === 'number' ? stats.level : 1,
      learnedCardIds: learnedCardIds,
      learnedCardIdsByLanguage: learnedMap,
      favoriteCardIds: favoriteCardIds,
      completedQuizzesCount: typeof stats.completedQuizzesCount === 'number' ? stats.completedQuizzesCount : 0,
      highestQuizScore: typeof stats.highestQuizScore === 'number' ? stats.highestQuizScore : 0,
      lastActiveDate: stats.lastActiveDate || new Date().toISOString().split('T')[0]
    }
  };
};

export const getAllUsers = (): UserProfile[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map(sanitizeUser);
    }
    return [];
  } catch (e) {
    console.error('Failed to parse users from localStorage', e);
    return [];
  }
};

export const saveUsers = (users: UserProfile[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
};

export const deleteAllUsers = () => {
  try {
    localStorage.removeItem(STORAGE_KEY_USERS);
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    localStorage.removeItem(STORAGE_KEY_AUTH_STATE);
    localStorage.removeItem('glotvia_email_verification_sessions_v1');
    localStorage.removeItem('glotvia_email_dispatch_logs_v1');
    localStorage.removeItem('glotvia_orders_v1');
    import('../services/firebaseDbService').then(m => {
      m.deleteAllFirestoreUsers().catch(() => {});
    });
  } catch (e) {
    console.error('Failed to delete all users', e);
  }
};

export const getCurrentUser = (): UserProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (!raw) {
      return DEFAULT_DEMO_USER;
    }
    const parsed = JSON.parse(raw);
    const sanitized = sanitizeUser(parsed);
    return sanitized;
  } catch (e) {
    return DEFAULT_DEMO_USER;
  }
};

export const setCurrentUser = (user: UserProfile) => {
  try {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
    // Also sync in all users list
    const users = getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    saveUsers(users);
  } catch (e) {
    console.error('Failed to set current user', e);
  }
};

export const registerUser = (
  name: string, 
  email: string, 
  targetLanguage: LanguageId = 'de', 
  nativeLanguage: LanguageId = 'tr',
  avatar: string = '🌟',
  password?: string
): { success: boolean; message: string; user?: UserProfile } => {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, message: 'Lütfen geçerli bir e-posta adresi giriniz.' };
  }

  const users = getAllUsers();
  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return { success: false, message: 'Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapınız.' };
  }

  const newUser: UserProfile = {
    id: 'user_' + Date.now(),
    name: name.trim() || cleanEmail.split('@')[0],
    email: cleanEmail,
    avatar: avatar || '🌟',
    targetLanguage,
    nativeLanguage,
    createdAt: new Date().toISOString(),
    password: password || undefined,
    isEmailVerified: false,
    stats: {
      xp: 50, // Welcome bonus
      streak: 1,
      level: 1,
      learnedCardIds: [],
      favoriteCardIds: [],
      completedQuizzesCount: 0,
      highestQuizScore: 0,
      lastActiveDate: new Date().toISOString().split('T')[0]
    }
  };

  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);
  setLoggedInState(true);

  return { success: true, message: 'Tebrikler! Hesabınız başarıyla oluşturuldu.', user: newUser };
};

export const loginUser = (
  email: string,
  password?: string
): { success: boolean; message: string; user?: UserProfile } => {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, message: 'Lütfen geçerli bir e-posta adresi giriniz.' };
  }

  const users = getAllUsers();
  const found = users.find(u => u.email.toLowerCase() === cleanEmail);
  
  if (!found) {
    return { 
      success: false, 
      message: 'Bu e-posta adresiyle kayıtlı bir hesap bulunamadı. Lütfen e-posta adresinizi kontrol ediniz veya yeni kayıt oluşturunuz.' 
    };
  }

  // If password was provided or required
  if (password) {
    if (found.password && found.password !== password) {
      return {
        success: false,
        message: 'Girdiğiniz şifre veya e-posta adresi hatalı. Lütfen kontrol edip tekrar deneyiniz.'
      };
    }
  }

  setCurrentUser(found);
  setLoggedInState(true);
  return { success: true, message: `Hoş geldiniz, ${found.name}!`, user: found };
};

/**
 * Updates a user's password locally and synchronizes storage
 */
export const updateUserPassword = (
  email: string,
  newPassword: string
): { success: boolean; message: string } => {
  const cleanEmail = email.trim().toLowerCase();
  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: 'Yeni şifreniz en az 6 karakterden oluşmalıdır.' };
  }

  const users = getAllUsers();
  const userIdx = users.findIndex(u => u.email.toLowerCase() === cleanEmail);

  if (userIdx < 0) {
    return { success: false, message: 'Bu e-posta adresine ait kullanıcı kaydı bulunamadı.' };
  }

  users[userIdx].password = newPassword;
  saveUsers(users);

  const current = getCurrentUser();
  if (current.email.toLowerCase() === cleanEmail) {
    setCurrentUser({ ...current, password: newPassword });
  }

  return { success: true, message: 'Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz.' };
};

export const logoutUser = () => {
  setLoggedInState(false);
};

export const updateUserNativeLanguage = (nativeLanguage: LanguageId): UserProfile => {
  const user = getCurrentUser();
  const updatedUser: UserProfile = {
    ...user,
    nativeLanguage
  };
  setCurrentUser(updatedUser);
  return updatedUser;
};

export const toggleLearnedCard = (cardId: string, langId?: LanguageId): UserProfile => {
  const user = getCurrentUser();
  const currentLang = langId || user.targetLanguage;
  
  // Ensure learnedCardIdsByLanguage is initialized
  const langMap: Record<string, string[]> = { ...(user.stats.learnedCardIdsByLanguage || {}) };
  if (!langMap[currentLang]) {
    langMap[currentLang] = [...(user.stats.learnedCardIds || [])];
  }
  
  const currentLangLearned = langMap[currentLang] || [];
  const isLearnedInLang = currentLangLearned.includes(cardId);
  
  let updatedLangLearned: string[];
  let xpDelta = 0;

  if (isLearnedInLang) {
    updatedLangLearned = currentLangLearned.filter(id => id !== cardId);
    xpDelta = -15;
  } else {
    updatedLangLearned = [...currentLangLearned, cardId];
    xpDelta = 25; // Reward 25 XP for mastering a card
  }

  langMap[currentLang] = updatedLangLearned;
  const activeLearned = (currentLang === user.targetLanguage) ? updatedLangLearned : (langMap[user.targetLanguage] || user.stats.learnedCardIds);

  const updatedXp = Math.max(0, user.stats.xp + xpDelta);
  const updatedLevel = Math.floor(updatedXp / 100) + 1;

  const updatedUser: UserProfile = {
    ...user,
    stats: {
      ...user.stats,
      learnedCardIds: activeLearned,
      learnedCardIdsByLanguage: langMap,
      xp: updatedXp,
      level: updatedLevel
    }
  };

  setCurrentUser(updatedUser);
  return updatedUser;
};

export const toggleFavoriteCard = (cardId: string): UserProfile => {
  const user = getCurrentUser();
  const isFav = user.stats.favoriteCardIds.includes(cardId);
  
  const newFavs = isFav
    ? user.stats.favoriteCardIds.filter(id => id !== cardId)
    : [...user.stats.favoriteCardIds, cardId];

  const updatedUser: UserProfile = {
    ...user,
    stats: {
      ...user.stats,
      favoriteCardIds: newFavs
    }
  };

  setCurrentUser(updatedUser);
  return updatedUser;
};

export const recordQuizResult = (scorePercentage: number, xpGained: number): UserProfile => {
  const user = getCurrentUser();
  const today = new Date().toISOString().split('T')[0];
  const lastActive = user.stats.lastActiveDate;

  let newStreak = user.stats.streak;
  if (lastActive !== today) {
    newStreak += 1;
  }

  const updatedXp = user.stats.xp + xpGained;
  const updatedLevel = Math.floor(updatedXp / 100) + 1;
  const highest = Math.max(user.stats.highestQuizScore, scorePercentage);

  const updatedUser: UserProfile = {
    ...user,
    stats: {
      ...user.stats,
      xp: updatedXp,
      level: updatedLevel,
      streak: newStreak,
      completedQuizzesCount: user.stats.completedQuizzesCount + 1,
      highestQuizScore: highest,
      lastActiveDate: today
    }
  };

  setCurrentUser(updatedUser);
  return updatedUser;
};

export const updateUserTargetLanguage = (targetLanguage: LanguageId): UserProfile => {
  const user = getCurrentUser();
  const langMap = user.stats.learnedCardIdsByLanguage || {};
  const activeLearned = langMap[targetLanguage] || (targetLanguage === user.targetLanguage ? user.stats.learnedCardIds : []);

  const updatedUser: UserProfile = {
    ...user,
    targetLanguage,
    stats: {
      ...user.stats,
      learnedCardIds: activeLearned
    }
  };
  setCurrentUser(updatedUser);
  return updatedUser;
};

export const getLanguageMasteredCardIds = (user: UserProfile, langId: LanguageId): string[] => {
  if (user.stats.learnedCardIdsByLanguage && user.stats.learnedCardIdsByLanguage[langId]) {
    return user.stats.learnedCardIdsByLanguage[langId];
  }
  if (langId === user.targetLanguage) {
    return user.stats.learnedCardIds || [];
  }
  return [];
};

export const getTotalMasteredWordsCount = (user: UserProfile): number => {
  if (user.stats.learnedCardIdsByLanguage) {
    let sum = 0;
    Object.values(user.stats.learnedCardIdsByLanguage).forEach(list => {
      sum += (list || []).length;
    });
    if (sum > 0) return sum;
  }
  return user.stats.learnedCardIds.length;
};

export const deleteUserAccount = (userIdOrEmail: string): boolean => {
  try {
    const clean = userIdOrEmail.trim().toLowerCase();
    const users = getAllUsers();
    const filtered = users.filter(u => u.id !== clean && u.email.toLowerCase() !== clean);
    saveUsers(filtered);
    
    // Clear active user session
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    setLoggedInState(false);
    return true;
  } catch (e) {
    console.error('Failed to delete user account:', e);
    return false;
  }
};

export const updateUserProfileData = (name: string, avatar: string): UserProfile => {
  const user = getCurrentUser();
  const updatedUser: UserProfile = {
    ...user,
    name: name.trim() || user.name,
    avatar: avatar || user.avatar
  };
  setCurrentUser(updatedUser);
  syncUserToFirestore(updatedUser).catch(() => {});
  return updatedUser;
};

/**
 * Add or update a learning language slot in the user profile (with progress, levels, vocabulary)
 */
export const addOrUpdateLearningLanguageSlot = (
  targetLanguage: LanguageId,
  level: LanguageLevel = 'A1',
  progressPercentage: number = 20,
  dailyGoalWords: number = 10,
  vocabularyList?: LanguageVocabularyItem[]
): UserProfile => {
  const user = getCurrentUser();
  const currentSlots: LearningLanguageSlot[] = [...(user.learningLanguages || [])];
  const existingIdx = currentSlots.findIndex(s => s.targetLanguage === targetLanguage);

  if (existingIdx >= 0) {
    const prev = currentSlots[existingIdx];
    currentSlots[existingIdx] = {
      ...prev,
      level,
      progressPercentage: typeof progressPercentage === 'number' ? progressPercentage : prev.progressPercentage,
      dailyGoalWords: typeof dailyGoalWords === 'number' ? dailyGoalWords : prev.dailyGoalWords,
      vocabularyList: vocabularyList || prev.vocabularyList || [],
      lastStudiedDate: new Date().toISOString().split('T')[0]
    };
  } else {
    currentSlots.push({
      targetLanguage,
      level,
      progressPercentage,
      dailyGoalWords,
      learnedCardIds: [],
      favoriteCardIds: [],
      completedLessons: [],
      totalXp: 50,
      lastStudiedDate: new Date().toISOString().split('T')[0],
      vocabularyList: vocabularyList || [
        {
          id: `v_${targetLanguage}_${Date.now()}`,
          word: 'Hello',
          translation: 'Merhaba',
          level: level,
          notes: 'Yeni eklenen dil',
          addedAt: new Date().toISOString(),
          mastered: false
        }
      ]
    });
  }

  const updatedUser: UserProfile = {
    ...user,
    learningLanguages: currentSlots
  };

  setCurrentUser(updatedUser);
  syncUserToFirestore(updatedUser).catch(() => {});
  return updatedUser;
};

/**
 * Update level, progress and daily goal for a specific learning language slot
 */
export const updateLanguageSlotProgress = (
  targetLanguage: LanguageId,
  updates: Partial<LearningLanguageSlot>
): UserProfile => {
  const user = getCurrentUser();
  const currentSlots: LearningLanguageSlot[] = [...(user.learningLanguages || [])];
  const existingIdx = currentSlots.findIndex(s => s.targetLanguage === targetLanguage);

  if (existingIdx >= 0) {
    currentSlots[existingIdx] = {
      ...currentSlots[existingIdx],
      ...updates,
      lastStudiedDate: new Date().toISOString().split('T')[0]
    };
  } else {
    currentSlots.push({
      targetLanguage,
      level: updates.level || 'A1',
      progressPercentage: updates.progressPercentage || 25,
      dailyGoalWords: updates.dailyGoalWords || 10,
      learnedCardIds: updates.learnedCardIds || [],
      favoriteCardIds: updates.favoriteCardIds || [],
      completedLessons: updates.completedLessons || [],
      totalXp: updates.totalXp || 50,
      lastStudiedDate: new Date().toISOString().split('T')[0],
      vocabularyList: updates.vocabularyList || []
    });
  }

  // Also update root level if target language matches
  const rootLevel = user.targetLanguage === targetLanguage && updates.level ? updates.level : user.level;

  const updatedUser: UserProfile = {
    ...user,
    level: rootLevel,
    learningLanguages: currentSlots
  };

  setCurrentUser(updatedUser);
  syncUserToFirestore(updatedUser).catch(() => {});
  return updatedUser;
};

/**
 * Remove a language from learningLanguages
 */
export const removeLearningLanguageSlot = (targetLanguage: LanguageId): UserProfile => {
  const user = getCurrentUser();
  const currentSlots = (user.learningLanguages || []).filter(s => s.targetLanguage !== targetLanguage);
  
  // Ensure at least one slot remains
  if (currentSlots.length === 0) {
    currentSlots.push({
      targetLanguage: user.targetLanguage || 'de',
      level: 'A1',
      progressPercentage: 20,
      dailyGoalWords: 10,
      learnedCardIds: [],
      favoriteCardIds: [],
      completedLessons: [],
      totalXp: 50,
      lastStudiedDate: new Date().toISOString().split('T')[0],
      vocabularyList: []
    });
  }

  const nextTarget = currentSlots.some(s => s.targetLanguage === user.targetLanguage)
    ? user.targetLanguage
    : currentSlots[0].targetLanguage;

  const updatedUser: UserProfile = {
    ...user,
    targetLanguage: nextTarget,
    learningLanguages: currentSlots
  };

  setCurrentUser(updatedUser);
  syncUserToFirestore(updatedUser).catch(() => {});
  return updatedUser;
};

/**
 * Add a custom vocabulary word to a specific learning language slot
 */
export const addWordToLanguageSlot = (
  targetLanguage: LanguageId,
  word: string,
  translation: string,
  level: LanguageLevel = 'A1',
  notes: string = ''
): UserProfile => {
  const user = getCurrentUser();
  const currentSlots = [...(user.learningLanguages || [])];
  let slotIdx = currentSlots.findIndex(s => s.targetLanguage === targetLanguage);

  const newVocab: LanguageVocabularyItem = {
    id: `v_${targetLanguage}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    word: word.trim(),
    translation: translation.trim(),
    level,
    notes: notes.trim(),
    addedAt: new Date().toISOString(),
    mastered: false
  };

  if (slotIdx >= 0) {
    const slot = currentSlots[slotIdx];
    const existingList = slot.vocabularyList || [];
    currentSlots[slotIdx] = {
      ...slot,
      vocabularyList: [newVocab, ...existingList]
    };
  } else {
    currentSlots.push({
      targetLanguage,
      level,
      progressPercentage: 10,
      dailyGoalWords: 10,
      learnedCardIds: [],
      favoriteCardIds: [],
      completedLessons: [],
      totalXp: 50,
      lastStudiedDate: new Date().toISOString().split('T')[0],
      vocabularyList: [newVocab]
    });
  }

  const updatedUser: UserProfile = {
    ...user,
    learningLanguages: currentSlots
  };

  setCurrentUser(updatedUser);
  syncUserToFirestore(updatedUser).catch(() => {});
  return updatedUser;
};

/**
 * Remove a word from a specific learning language slot
 */
export const removeWordFromLanguageSlot = (
  targetLanguage: LanguageId,
  vocabId: string
): UserProfile => {
  const user = getCurrentUser();
  const currentSlots = [...(user.learningLanguages || [])];
  const slotIdx = currentSlots.findIndex(s => s.targetLanguage === targetLanguage);

  if (slotIdx >= 0) {
    const slot = currentSlots[slotIdx];
    currentSlots[slotIdx] = {
      ...slot,
      vocabularyList: (slot.vocabularyList || []).filter(v => v.id !== vocabId)
    };
  }

  const updatedUser: UserProfile = {
    ...user,
    learningLanguages: currentSlots
  };

  setCurrentUser(updatedUser);
  syncUserToFirestore(updatedUser).catch(() => {});
  return updatedUser;
};

/**
 * Toggle mastered status for a word in a specific learning language slot
 */
export const toggleWordMasteredInLanguageSlot = (
  targetLanguage: LanguageId,
  vocabId: string
): UserProfile => {
  const user = getCurrentUser();
  const currentSlots = [...(user.learningLanguages || [])];
  const slotIdx = currentSlots.findIndex(s => s.targetLanguage === targetLanguage);

  if (slotIdx >= 0) {
    const slot = currentSlots[slotIdx];
    currentSlots[slotIdx] = {
      ...slot,
      vocabularyList: (slot.vocabularyList || []).map(v => 
        v.id === vocabId ? { ...v, mastered: !v.mastered } : v
      )
    };
  }

  const updatedUser: UserProfile = {
    ...user,
    learningLanguages: currentSlots
  };

  setCurrentUser(updatedUser);
  syncUserToFirestore(updatedUser).catch(() => {});
  return updatedUser;
};
