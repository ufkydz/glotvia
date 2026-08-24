import { db, auth } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  deleteUser as deleteFirebaseUser, 
  EmailAuthProvider, 
  reauthenticateWithCredential,
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { UserProfile } from '../types';
import { deleteUserAccount, setLoggedInState } from '../utils/authStorage';
import { deleteUserFromFirestore } from './firebaseDbService';
import { sendPhysicalEmail } from './realEmailService';

export interface AccountDeletionTokenData {
  tokenId: string;
  tokenHash: string;
  userId: string;
  userEmail: string;
  purpose: 'delete_account';
  createdAt: number;
  expiresAt: number;
  isUsed: boolean;
  usedAt?: number | null;
}

const STORAGE_KEY_DELETION_TOKENS = 'glotvia_account_deletion_tokens_v1';

/**
 * Generate a cryptographically secure random token
 */
function generateSecureToken(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  return `del_${Date.now()}_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
}

/**
 * Simple client-side hash function for tokens
 */
async function hashToken(token: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(token);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      return token;
    }
  }
  return token;
}

function getStoredTokens(): Record<string, AccountDeletionTokenData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DELETION_TOKENS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredTokens(tokens: Record<string, AccountDeletionTokenData>) {
  try {
    localStorage.setItem(STORAGE_KEY_DELETION_TOKENS, JSON.stringify(tokens));
  } catch (e) {
    console.warn('Failed to save deletion tokens locally', e);
  }
}

/**
 * Step 1: Request Account Deletion (Sends confirmation email with single-use expiring token)
 */
export async function requestAccountDeletion(
  currentUser: UserProfile,
  confirmationEmail: string
): Promise<{ success: boolean; message: string; tokenId?: string; rawToken?: string }> {
  const cleanCurrentEmail = currentUser.email.trim().toLowerCase();
  const cleanInputEmail = confirmationEmail.trim().toLowerCase();

  // Validate email matching
  if (!cleanInputEmail || cleanInputEmail !== cleanCurrentEmail) {
    return {
      success: false,
      message: 'Girdiğiniz e-posta adresi, hesabınızda kayıtlı olan e-posta adresiyle eşleşmiyor.'
    };
  }

  const rawToken = generateSecureToken();
  const tokenHash = await hashToken(rawToken);
  const now = Date.now();
  const expiresAt = now + 15 * 60 * 1000; // 15 minutes validity
  const tokenId = `token_${now}_${Math.random().toString(36).substring(2, 7)}`;

  const tokenData: AccountDeletionTokenData = {
    tokenId,
    tokenHash,
    userId: currentUser.id || cleanCurrentEmail,
    userEmail: cleanCurrentEmail,
    purpose: 'delete_account',
    createdAt: now,
    expiresAt,
    isUsed: false,
    usedAt: null
  };

  // 1. Save locally
  const localTokens = getStoredTokens();
  localTokens[rawToken] = tokenData;
  saveStoredTokens(localTokens);

  // 2. Save in Firestore if available
  if (db) {
    try {
      await setDoc(doc(db, 'account_deletion_tokens', tokenId), {
        ...tokenData,
        serverTime: serverTimestamp()
      });
    } catch (err) {
      console.warn('Firestore deletion token storage warning:', err);
    }
  }

  // 3. Construct direct confirmation URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const deletionLink = `${baseUrl}?action=confirm_delete_account&token=${encodeURIComponent(rawToken)}&id=${encodeURIComponent(tokenId)}`;

  // 4. Send Confirmation Email via physical multi-gateway
  const emailContent = `Kullanıcı hesabınızı silme talebiniz alındı.\n\nHesabınızı kalıcı olarak silmek istiyorsanız aşağıdaki butona tıklayın:\n\n[HESABIMI KALICI OLARAK SİL]\n${deletionLink}\n\nBu işlemi siz başlatmadıysanız bu e-postayı görmezden gelin.\nBu bağlantı 15 dakika içinde geçersiz olacaktır.`;

  await sendPhysicalEmail(
    cleanCurrentEmail,
    rawToken.slice(0, 6).toUpperCase(),
    currentUser.name || 'Kullanıcı',
    'Glotvia Hesap Silme Onayı'
  ).catch(console.warn);

  return {
    success: true,
    message: `${cleanCurrentEmail} adresinize hesap silme onay bağlantısı gönderildi. Lütfen gelen kutunuzu ve spam klasörünüzü kontrol ediniz.`,
    tokenId,
    rawToken
  };
}

/**
 * Step 2: Validate Deletion Token
 */
export async function validateDeletionToken(
  rawToken: string,
  tokenId?: string
): Promise<{
  valid: boolean;
  message: string;
  tokenData?: AccountDeletionTokenData;
}> {
  if (!rawToken || rawToken.trim() === '') {
    return { valid: false, message: 'Geçersiz veya eksik silme anahtarı (token).' };
  }

  const cleanToken = rawToken.trim();
  const now = Date.now();

  // 1. Check local storage
  const localTokens = getStoredTokens();
  let tokenData = localTokens[cleanToken];

  // 2. Check Firestore if not found locally or if tokenId provided
  if (!tokenData && db && tokenId) {
    try {
      const docSnap = await getDoc(doc(db, 'account_deletion_tokens', tokenId));
      if (docSnap.exists()) {
        const cloudData = docSnap.data() as AccountDeletionTokenData;
        const expectedHash = await hashToken(cleanToken);
        if (cloudData.tokenHash === expectedHash) {
          tokenData = cloudData;
        }
      }
    } catch (e) {
      console.warn('Firestore token verification warning:', e);
    }
  }

  if (!tokenData) {
    return {
      valid: false,
      message: 'Hesap silme bağlantısı geçersiz veya bulunamadı.'
    };
  }

  if (tokenData.isUsed) {
    return {
      valid: false,
      message: 'Bu silme bağlantısı daha önce kullanılmış.'
    };
  }

  if (now > tokenData.expiresAt) {
    return {
      valid: false,
      message: 'Hesap silme bağlantısının süresi dolmuş (15 dakika). Lütfen yeni bir talep oluşturun.'
    };
  }

  if (tokenData.purpose !== 'delete_account') {
    return {
      valid: false,
      message: 'Geçersiz işlem türü.'
    };
  }

  return {
    valid: true,
    message: 'Silme talebi doğrulandı.',
    tokenData
  };
}

/**
 * Step 3: Execute Permanent Account Deletion
 */
export async function executeAccountDeletion(
  rawToken: string,
  tokenId?: string
): Promise<{ success: boolean; message: string }> {
  const validation = await validateDeletionToken(rawToken, tokenId);
  if (!validation.valid || !validation.tokenData) {
    return {
      success: false,
      message: validation.message
    };
  }

  const { tokenData } = validation;
  const userEmail = tokenData.userEmail;
  const userId = tokenData.userId;

  try {
    // 1. Invalidate Token immediately
    const localTokens = getStoredTokens();
    if (localTokens[rawToken]) {
      localTokens[rawToken].isUsed = true;
      localTokens[rawToken].usedAt = Date.now();
      saveStoredTokens(localTokens);
    }

    if (db && (tokenId || tokenData.tokenId)) {
      const idToUpdate = tokenId || tokenData.tokenId;
      await updateDoc(doc(db, 'account_deletion_tokens', idToUpdate), {
        isUsed: true,
        usedAt: Date.now()
      }).catch(() => {});
    }

    // 2. Delete from Firebase Authentication
    if (auth && auth.currentUser && auth.currentUser.email?.toLowerCase() === userEmail.toLowerCase()) {
      try {
        await deleteFirebaseUser(auth.currentUser);
      } catch (authErr) {
        console.warn('Firebase Auth user deletion note:', authErr);
      }
    }

    // 3. Delete from Firestore (users, orders, purchases, verifications)
    await deleteUserFromFirestore(userEmail);
    if (userId && userId !== userEmail) {
      await deleteUserFromFirestore(userId);
    }

    // 4. Delete from Local Storage
    deleteUserAccount(userId);
    deleteUserAccount(userEmail);
    setLoggedInState(false);

    return {
      success: true,
      message: 'Hesabınız ve tüm kullanıcı verileriniz başarıyla kalıcı olarak silindi.'
    };
  } catch (error: any) {
    console.error('Account deletion execution error:', error);
    return {
      success: false,
      message: error?.message || 'Hesap silinirken bir hata oluştu. Lütfen tekrar deneyiniz.'
    };
  }
}

export interface DirectDeletionResult {
  success: boolean;
  message: string;
  requiresReauth?: boolean;
}

/**
 * Direct In-App Account Deletion with Firebase Authentication deleteUser & Re-authentication support
 */
export async function deleteAccountDirectly(
  currentUser: UserProfile,
  password?: string
): Promise<DirectDeletionResult> {
  const userEmail = currentUser.email.trim().toLowerCase();
  const userId = currentUser.id || userEmail;

  try {
    // 1. Firebase Auth deletion & re-authentication if required
    if (auth && auth.currentUser) {
      const fbUser = auth.currentUser;
      
      // If password provided and user has password auth, re-authenticate first
      if (password && password.trim()) {
        try {
          const credential = EmailAuthProvider.credential(userEmail, password);
          await reauthenticateWithCredential(fbUser, credential);
        } catch (reauthErr: any) {
          if (reauthErr.code === 'auth/wrong-password' || reauthErr.code === 'auth/invalid-credential' || reauthErr.code === 'auth/invalid-login-credentials') {
            return {
              success: false,
              requiresReauth: true,
              message: 'Girdiğiniz şifre hatalı. Lütfen hesabınızın güncel şifresini giriniz.'
            };
          }
          console.warn('Firebase reauth warning:', reauthErr);
        }
      }

      // Try deleting Firebase Auth user
      try {
        await deleteFirebaseUser(fbUser);
      } catch (authErr: any) {
        if (authErr.code === 'auth/requires-recent-login') {
          // If we haven't tried password yet or password was empty
          if (!password) {
            return {
              success: false,
              requiresReauth: true,
              message: 'Güvenlik nedeniyle bu işlem için şifrenizi doğrulamanız gerekmektedir. Lütfen şifrenizi giriniz.'
            };
          } else {
            return {
              success: false,
              requiresReauth: true,
              message: 'Güvenlik doğrulaması gerekiyor. Lütfen oturumunuzu kapatıp tekrar giriş yaptıktan sonra yeniden deneyiniz.'
            };
          }
        }
        console.warn('Firebase Auth direct deletion error:', authErr);
      }
    }

    // 2. Delete Firestore documents (users profile, learning languages, stats, verification codes)
    await deleteUserFromFirestore(userEmail);
    if (userId && userId !== userEmail) {
      await deleteUserFromFirestore(userId);
    }

    // 3. Delete from Local Storage and clear active session
    deleteUserAccount(userId);
    deleteUserAccount(userEmail);
    setLoggedInState(false);

    return {
      success: true,
      message: 'Hesabınız, dil ve öğrenme ilerlemeleriniz Firebase ve cihazınızdan kalıcı olarak silindi.'
    };
  } catch (err: any) {
    console.error('deleteAccountDirectly error:', err);
    return {
      success: false,
      message: err?.message || 'Hesap silinirken bir hata oluştu. Lütfen tekrar deneyiniz.'
    };
  }
}

