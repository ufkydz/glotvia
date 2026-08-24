import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  updateProfile,
  updatePassword as updateFirebasePassword,
  deleteUser as deleteFirebaseUser
} from 'firebase/auth';
import { auth } from './firebase';
import { UserProfile, LanguageId } from '../types';
import { syncUserToFirestore, getUserFromFirestore, recordRegisteredEmail } from './firebaseDbService';
import { 
  saveUsers, 
  getAllUsers, 
  setCurrentUser as saveLocalCurrentUser, 
  setLoggedInState,
  sanitizeUser,
  updateUserPassword
} from '../utils/authStorage';
import { sendPhysicalEmail, sendPhysicalPasswordResetEmail, notifyAdminNewUserRegistration } from './realEmailService';
import { sendEmailVerificationCode } from './emailVerificationService';

/**
 * Maps Firebase Auth error codes to friendly Turkish error messages
 */
export function formatAuthErrorMessage(error: any): string {
  if (!error) return 'Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.';
  const code = error.code || (typeof error === 'string' ? error : error.message || '');

  switch (code) {
    case 'auth/email-already-in-use':
    case 'EMAIL_EXISTS':
      return 'Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapın veya şifrenizi sıfırlayın.';
    case 'auth/invalid-email':
    case 'INVALID_EMAIL':
      return 'Lütfen geçerli bir e-posta adresi giriniz (Örn: adiniz@ornek.com).';
    case 'auth/weak-password':
    case 'WEAK_PASSWORD':
      return 'Şifreniz çok zayıf. Lütfen en az 6 karakterden oluşan güvenli bir şifre belirleyin.';
    case 'auth/user-not-found':
    case 'EMAIL_NOT_FOUND':
      return 'Bu e-posta adresiyle kayıtlı bir hesap bulunamadı. Lütfen önce kayıt olun.';
    case 'auth/wrong-password':
    case 'INVALID_PASSWORD':
    case 'INVALID_LOGIN_CREDENTIALS':
      return 'Girdiğiniz şifre veya e-posta adresi hatalı. Lütfen kontrol ediniz.';
    case 'auth/too-many-requests':
      return 'Çok fazla başarısız deneme yapıldı. Güvenliğiniz için lütfen birkaç dakika sonra tekrar deneyiniz.';
    case 'auth/network-request-failed':
      return 'İnternet bağlantısı kurulamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin.';
    case 'auth/user-disabled':
      return 'Bu kullanıcı hesabı yönetici tarafından devre dışı bırakılmış.';
    case 'auth/requires-recent-login':
      return 'Bu kritik işlem için lütfen oturumunuzu kapatıp tekrar giriş yapınız.';
    default:
      return error.message || 'İşlem tamamlanamadı. Lütfen bilgilerinizi kontrol edip tekrar deneyin.';
  }
}

export interface RegisterResult {
  success: boolean;
  message: string;
  user?: UserProfile;
  firebaseUser?: FirebaseUser;
  needsEmailVerification?: boolean;
}

export interface LoginResult {
  success: boolean;
  message: string;
  user?: UserProfile;
  firebaseUser?: FirebaseUser;
  isEmailVerified?: boolean;
}

/**
 * Register a new user with Firebase Auth + Firestore + Local Storage
 */
export async function registerWithFirebase(
  name: string,
  email: string,
  password?: string,
  targetLanguage: LanguageId = 'de',
  nativeLanguage: LanguageId = 'tr',
  avatar: string = '🚀',
  country: string = 'TR',
  level: any = 'A1',
  ageGroup: any = '18-29',
  dailyGoal: number = 15,
  currency: string = 'TRY'
): Promise<RegisterResult> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim() || cleanEmail.split('@')[0];

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, message: 'Lütfen geçerli bir e-posta adresi giriniz.' };
  }

  const userPassword = password && password.length >= 6 ? password : `Glotvia_${Math.random().toString(36).slice(2, 10)}!`;

  let fbUser: FirebaseUser | undefined = undefined;

  // 1. Try Firebase Authentication
  if (auth) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, userPassword);
      fbUser = userCredential.user;

      // Update display name
      await updateProfile(fbUser, {
        displayName: cleanName
      }).catch(() => {});

      // Send Firebase official email verification link
      await sendEmailVerification(fbUser).catch((err) => {
        console.warn('Firebase sendEmailVerification notice:', err);
      });
    } catch (fbErr: any) {
      // If email already in use in Firebase, notify clearly
      if (fbErr.code === 'auth/email-already-in-use') {
        return {
          success: false,
          message: 'Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapınız.'
        };
      }
      console.warn('Firebase register notice (continuing with local/hybrid):', fbErr);
    }
  }

  // 2. Dispatch OTP / Multi-gateway verification code
  const codeRes = sendEmailVerificationCode(cleanEmail, 'register', {
    name: cleanName,
    targetLanguage,
    nativeLanguage,
    avatar,
    password: userPassword,
    country,
    level,
    ageGroup,
    dailyGoal
  });

  // 3. Construct unified UserProfile
  const userId = fbUser?.uid || 'user_' + Date.now();
  const newUser: UserProfile = {
    id: userId,
    name: cleanName,
    email: cleanEmail,
    avatar: avatar || '🌟',
    targetLanguage,
    nativeLanguage,
    currentLearningLanguage: targetLanguage,
    learningLanguages: [
      {
        languageId: targetLanguage,
        level: level || 'A1',
        xp: 50,
        streak: 1,
        learnedCardIds: [],
        favoriteCardIds: [],
        completedQuizzesCount: 0,
        lastActiveDate: new Date().toISOString().split('T')[0]
      }
    ],
    country: country || 'TR',
    level: level || 'A1',
    ageGroup: ageGroup || '18-29',
    dailyGoal: dailyGoal || 15,
    currency: currency || 'TRY',
    createdAt: new Date().toISOString(),
    isEmailVerified: false,
    emailVerifiedAt: null,
    stats: {
      xp: 50,
      streak: 1,
      level: 1,
      learnedCardIds: [],
      learnedCardIdsByLanguage: {
        [targetLanguage]: []
      },
      favoriteCardIds: [],
      completedQuizzesCount: 0,
      highestQuizScore: 0,
      lastActiveDate: new Date().toISOString().split('T')[0]
    }
  };

  // 4. Save to Local Storage & Firestore
  const allUsers = getAllUsers();
  const existingIdx = allUsers.findIndex(u => u.email.toLowerCase() === cleanEmail);
  if (existingIdx >= 0) {
    allUsers[existingIdx] = newUser;
  } else {
    allUsers.push(newUser);
  }
  saveUsers(allUsers);
  saveLocalCurrentUser(newUser);
  setLoggedInState(true);

  // Sync to Firestore and record permanent registered email
  syncUserToFirestore(newUser).catch(() => {});
  recordRegisteredEmail(cleanEmail, cleanName, userId).catch(() => {});

  return {
    success: true,
    message: 'E-posta adresinize doğrulama bağlantısı ve 6 haneli onay kodu gönderildi. Gelen kutunuzu ve spam klasörünüzü kontrol edin.',
    user: newUser,
    firebaseUser: fbUser,
    needsEmailVerification: true
  };
}

/**
 * Login with Firebase Auth or fallback to local/cloud user data
 */
export async function loginWithFirebase(
  email: string,
  password?: string
): Promise<LoginResult> {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, message: 'Lütfen geçerli bir e-posta adresi giriniz.' };
  }

  if (!password || !password.trim()) {
    return { success: false, message: 'Lütfen şifrenizi giriniz.' };
  }

  let fbUser: FirebaseUser | undefined = undefined;
  let isVerified = false;
  let firebaseAuthAttempted = false;
  let firebaseAuthSuccess = false;

  // 1. If password provided and Firebase Auth active, attempt Firebase Sign In
  if (auth) {
    firebaseAuthAttempted = true;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      fbUser = userCredential.user;
      isVerified = fbUser.emailVerified;
      firebaseAuthSuccess = true;
    } catch (fbErr: any) {
      if (fbErr.code === 'auth/wrong-password' || fbErr.code === 'auth/invalid-credential' || fbErr.code === 'auth/invalid-login-credentials') {
        return {
          success: false,
          message: 'Girdiğiniz şifre veya e-posta adresi hatalı. Lütfen bilgilerinizi kontrol edip tekrar deneyiniz.'
        };
      }
      if (fbErr.code === 'auth/user-not-found') {
        return {
          success: false,
          message: 'Bu e-posta adresiyle kayıtlı bir hesap bulunamadı. Lütfen önce kayıt olunuz.'
        };
      }
      if (fbErr.code === 'auth/too-many-requests') {
        return {
          success: false,
          message: 'Çok fazla başarısız deneme yapıldı. Güvenliğiniz için lütfen birkaç dakika sonra tekrar deneyiniz.'
        };
      }
      console.warn('Firebase signIn notice (checking local profile):', fbErr);
    }
  }

  // 2. Fetch User Profile from Firestore or Local Storage
  let userProfile: UserProfile | null = await getUserFromFirestore(cleanEmail);
  if (!userProfile) {
    const localUsers = getAllUsers();
    userProfile = localUsers.find(u => u.email.toLowerCase() === cleanEmail) || null;
  }

  if (!userProfile) {
    return {
      success: false,
      message: 'Bu e-posta adresiyle kayıtlı bir hesap bulunamadı. Lütfen bilgilerinizi kontrol ediniz veya yeni kayıt oluşturunuz.'
    };
  }

  // If Firebase was not authenticated successfully and local user has a password, check it
  if (!firebaseAuthSuccess && userProfile.password) {
    if (userProfile.password !== password) {
      return {
        success: false,
        message: 'Girdiğiniz şifre hatalı. Lütfen kontrol edip tekrar deneyiniz.'
      };
    }
  }

  // Update verified status if confirmed by Firebase
  if (isVerified && !userProfile.isEmailVerified) {
    userProfile.isEmailVerified = true;
    userProfile.emailVerifiedAt = Date.now();
  }

  saveLocalCurrentUser(userProfile);
  setLoggedInState(true);
  syncUserToFirestore(userProfile).catch(() => {});

  return {
    success: true,
    message: `Hoş geldiniz, ${userProfile.name}!`,
    user: userProfile,
    firebaseUser: fbUser,
    isEmailVerified: userProfile.isEmailVerified || isVerified
  };
}

/**
 * Resend verification email (both Firebase official link + OTP code) with rate limit check
 */
export async function resendVerificationEmail(
  email: string,
  userName?: string
): Promise<{ success: boolean; message: string }> {
  const cleanEmail = email.trim().toLowerCase();

  // Rate Limiting Check (max 1 email every 30 seconds per client)
  const lastSentKey = `last_verification_sent_${cleanEmail}`;
  const lastSent = Number(localStorage.getItem(lastSentKey) || '0');
  const now = Date.now();
  const cooldownSeconds = 30;

  if (now - lastSent < cooldownSeconds * 1000) {
    const remaining = Math.ceil((cooldownSeconds * 1000 - (now - lastSent)) / 1000);
    return {
      success: false,
      message: `Lütfen tekrar e-posta istemeden önce ${remaining} saniye bekleyiniz.`
    };
  }

  // 1. Firebase Auth sendEmailVerification if current user matches
  if (auth && auth.currentUser && auth.currentUser.email?.toLowerCase() === cleanEmail) {
    try {
      await sendEmailVerification(auth.currentUser);
    } catch (err: any) {
      console.warn('Firebase resendEmailVerification warning:', err);
    }
  }

  // 2. Dispatch OTP / Multi-gateway verification code
  const sendRes = sendEmailVerificationCode(cleanEmail, 'register', {
    name: userName || cleanEmail.split('@')[0]
  });

  localStorage.setItem(lastSentKey, now.toString());

  if (sendRes.success) {
    return {
      success: true,
      message: 'Yeni doğrulama e-postası ve 6 haneli kod gönderildi. Gelen kutunuzu ve spam klasörünüzü kontrol edin.'
    };
  } else {
    return {
      success: false,
      message: sendRes.message || 'E-posta gönderilemedi. Lütfen tekrar deneyin.'
    };
  }
}

/**
 * Reloads the current Firebase user and checks if email is verified
 */
export async function checkEmailVerifiedStatus(
  currentUser: UserProfile
): Promise<{ isVerified: boolean; message: string }> {
  if (!currentUser?.email) {
    return { isVerified: false, message: 'Kullanıcı oturumu bulunamadı.' };
  }

  // 1. Check Firebase Auth if available
  if (auth && auth.currentUser) {
    try {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        // Update local & Firestore profile
        const updated = {
          ...currentUser,
          isEmailVerified: true,
          emailVerifiedAt: Date.now()
        };
        saveLocalCurrentUser(updated);
        syncUserToFirestore(updated).catch(() => {});
        return {
          isVerified: true,
          message: 'Harika! E-posta adresiniz başarıyla doğrulandı.'
        };
      }
    } catch (err) {
      console.warn('Firebase user reload check warning:', err);
    }
  }

  // 2. Check local user state
  if (currentUser.isEmailVerified) {
    return {
      isVerified: true,
      message: 'E-posta adresiniz zaten doğrulanmış durumda.'
    };
  }

  return {
    isVerified: false,
    message: 'E-posta adresinizi henüz doğrulamadınız. Gelen kutunuzdaki bağlantıya tıklayın veya 6 haneli onay kodunu girin.'
  };
}

/**
 * Send Password Reset Email
 */
export async function sendUserPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, message: 'Lütfen geçerli bir e-posta adresi giriniz.' };
  }

  // 1. Verify existence in Firestore or Local Storage
  let userProfile: UserProfile | null = await getUserFromFirestore(cleanEmail);
  if (!userProfile) {
    const localUsers = getAllUsers();
    userProfile = localUsers.find(u => u.email.toLowerCase() === cleanEmail) || null;
  }

  // 2. Generate secure Reset Link
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-irhjlnmv2m4dln24wmmlso-309112519398.europe-west3.run.app';
  const resetToken = btoa(`${cleanEmail}:${Date.now()}`);
  const resetLink = `${currentOrigin}/?action=reset_password&email=${encodeURIComponent(cleanEmail)}&token=${encodeURIComponent(resetToken)}`;

  let firebaseSent = false;
  let firebaseError = '';

  // 3. Try Firebase Auth sendPasswordResetEmail
  if (auth) {
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      firebaseSent = true;
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' && !userProfile) {
        return {
          success: false,
          message: 'Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı. Lütfen e-posta adresinizi kontrol ediniz veya kayıt olunuz.'
        };
      }
      firebaseError = formatAuthErrorMessage(err);
      console.warn('Firebase sendPasswordResetEmail note:', err);
    }
  }

  // If user doesn't exist locally or in Firebase
  if (!userProfile && !firebaseSent && firebaseError.includes('hesap bulunamadı')) {
    return {
      success: false,
      message: 'Bu e-posta adresiyle kayıtlı bir hesap bulunamadı. Lütfen e-posta adresinizi kontrol ediniz.'
    };
  }

  // 4. Dispatch Physical Email Relay with Reset Link to user's real email
  await sendPhysicalPasswordResetEmail(cleanEmail, resetLink, userProfile?.name || cleanEmail.split('@')[0]);

  return {
    success: true,
    message: `Şifre yenileme bağlantısı ${cleanEmail} e-posta adresinize gönderildi. Lütfen gelen kutunuzu ve spam klasörünüzü kontrol ediniz.`
  };
}

/**
 * Apply new password from password reset link
 */
export async function resetPasswordWithToken(
  email: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: 'Şifreniz en az 6 karakterden oluşmalıdır.' };
  }

  // 1. Update local storage
  const updateRes = updateUserPassword(cleanEmail, newPassword);

  // 2. Update in Firestore
  const userProfile = await getUserFromFirestore(cleanEmail);
  if (userProfile) {
    const updated = {
      ...userProfile,
      password: newPassword
    };
    await syncUserToFirestore(updated).catch(() => {});
  }

  return updateRes;
}

/**
 * Change password directly for logged in user
 */
export async function changeCurrentUserPassword(
  email: string,
  newPassword: string
): Promise<{ success: boolean; message: string; requiresReauth?: boolean }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: 'Yeni şifreniz en az 6 karakter olmalıdır.' };
  }

  try {
    if (auth && auth.currentUser) {
      try {
        await updateFirebasePassword(auth.currentUser, newPassword);
      } catch (authErr: any) {
        if (authErr.code === 'auth/requires-recent-login') {
          return {
            success: false,
            requiresReauth: true,
            message: 'Güvenlik nedeniyle şifre değiştirmek için lütfen tekrar giriş yapınız.'
          };
        }
        throw authErr;
      }
    }

    // Update local storage
    updateUserPassword(cleanEmail, newPassword);

    // Update in Firestore
    const userProfile = await getUserFromFirestore(cleanEmail);
    if (userProfile) {
      await syncUserToFirestore({
        ...userProfile,
        password: newPassword
      }).catch(() => {});
    }

    return {
      success: true,
      message: 'Şifreniz başarıyla güncellendi!'
    };
  } catch (error: any) {
    return {
      success: false,
      message: formatAuthErrorMessage(error)
    };
  }
}

/**
 * Sign out completely
 */
export async function signOutUser(): Promise<void> {
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut notice:', e);
    }
  }
  setLoggedInState(false);
}

/**
 * Subscribe to Firebase Auth state changes
 */
export function subscribeToAuthChanges(callback: (fbUser: FirebaseUser | null) => void): () => void {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
}
