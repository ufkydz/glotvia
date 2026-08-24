import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { UserProfile } from '../types';
import { notifyAdminNewUserRegistration } from './realEmailService';

export interface CloudOrder {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  planId: 'monthly' | 'yearly' | 'lifetime' | string;
  planTitle: string;
  amount: number;
  currency: string;
  paymentMethod: 'credit_card' | 'apple_pay' | 'google_pay';
  cardLast4?: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: number;
  expiresAt?: number;
  invoiceUrl?: string;
}

export interface CloudVerification {
  id: string;
  email: string;
  code: string;
  purpose: string;
  createdAt: number;
  expiresAt: number;
  isVerified: boolean;
  attempts: number;
}

export interface RegisteredEmailEntry {
  email: string;
  name: string;
  userId: string;
  registeredAt: string;
  timestamp: number;
  isEmailVerified: boolean;
  targetLanguage?: string;
}

/**
 * Save / Sync User Profile to Firestore & Record in Registered Emails
 */
export async function syncUserToFirestore(user: UserProfile): Promise<boolean> {
  try {
    if (!db) return false;
    const cleanEmail = (user.email || '').trim().toLowerCase();
    const userRef = doc(db, 'users', user.id || cleanEmail);
    await setDoc(userRef, {
      ...user,
      email: cleanEmail,
      updatedAt: serverTimestamp(),
      lastSeen: Date.now()
    }, { merge: true });

    // Also record into permanent registered_emails collection
    if (cleanEmail) {
      const emailDocRef = doc(db, 'registered_emails', cleanEmail);
      await setDoc(emailDocRef, {
        email: cleanEmail,
        name: user.name || 'Kullanıcı',
        userId: user.id || '',
        isEmailVerified: !!user.isEmailVerified,
        targetLanguage: user.targetLanguage || 'de',
        registeredAt: user.createdAt || new Date().toISOString(),
        timestamp: Date.now(),
        updatedAt: serverTimestamp()
      }, { merge: true }).catch(() => {});
    }

    return true;
  } catch (error) {
    console.warn('Firestore syncUser warning:', error);
    return false;
  }
}

/**
 * Specifically update user learning languages array and progress in Firestore
 */
export async function updateUserLearningLanguagesInFirestore(
  userIdOrEmail: string, 
  learningLanguages: any[]
): Promise<boolean> {
  try {
    if (!db) return false;
    const cleanKey = userIdOrEmail.trim().toLowerCase();
    const userRef = doc(db, 'users', cleanKey);
    await updateDoc(userRef, {
      learningLanguages,
      updatedAt: serverTimestamp(),
      lastSeen: Date.now()
    }).catch(async () => {
      await setDoc(userRef, {
        learningLanguages,
        updatedAt: serverTimestamp(),
        lastSeen: Date.now()
      }, { merge: true });
    });
    return true;
  } catch (error) {
    console.warn('updateUserLearningLanguagesInFirestore error:', error);
    return false;
  }
}

/**
 * Permanently save a registered email to Firestore and notify glotvia.de@gmail.com
 */
export async function recordRegisteredEmail(email: string, name: string = '', userId: string = ''): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) return;

  try {
    if (db) {
      const emailDocRef = doc(db, 'registered_emails', cleanEmail);
      await setDoc(emailDocRef, {
        email: cleanEmail,
        name: name || 'Yeni Kayıt',
        userId: userId || `usr_${Date.now()}`,
        registeredAt: new Date().toISOString(),
        timestamp: Date.now(),
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
  } catch (e) {
    console.warn('Firestore recordRegisteredEmail warning:', e);
  }

  // Send real-time registration email notification to glotvia.de@gmail.com
  notifyAdminNewUserRegistration({
    email: cleanEmail,
    name: name,
    id: userId,
    createdAt: new Date().toISOString()
  }).catch((err) => console.warn('Admin notification warning:', err));
}

/**
 * Fetch all registered emails from Firestore
 */
export async function getAllRegisteredEmailsFromFirestore(): Promise<RegisteredEmailEntry[]> {
  try {
    if (!db) return [];
    const snap = await getDocs(collection(db, 'registered_emails'));
    const list: RegisteredEmailEntry[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as RegisteredEmailEntry);
    });
    return list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  } catch (error) {
    console.warn('getAllRegisteredEmailsFromFirestore error:', error);
    return [];
  }
}

/**
 * Fetch User Profile from Firestore
 */
export async function getUserFromFirestore(emailOrId: string): Promise<UserProfile | null> {
  try {
    if (!db) return null;
    const cleanKey = emailOrId.trim().toLowerCase();
    
    // Check by doc id first
    const directDoc = await getDoc(doc(db, 'users', cleanKey));
    if (directDoc.exists()) {
      return directDoc.data() as UserProfile;
    }

    // Query by email
    const q = query(collection(db, 'users'), where('email', '==', cleanKey), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as UserProfile;
    }

    return null;
  } catch (error) {
    console.warn('Firestore getUser warning:', error);
    return null;
  }
}

/**
 * Save Verification Code to Firestore
 */
export async function saveVerificationToFirestore(verification: CloudVerification): Promise<boolean> {
  try {
    if (!db) return false;
    const cleanEmail = verification.email.trim().toLowerCase();
    const verifRef = doc(db, 'verification_codes', `${cleanEmail}_${verification.purpose}`);
    await setDoc(verifRef, {
      ...verification,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('Firestore saveVerification warning:', error);
    return false;
  }
}

/**
 * Record New Payment Order in Firestore
 */
export async function createOrderInFirestore(order: CloudOrder): Promise<boolean> {
  try {
    if (!db) return false;
    const orderRef = doc(db, 'orders', order.id);
    await setDoc(orderRef, {
      ...order,
      serverTime: serverTimestamp()
    });

    // Also update user's plan in Firestore
    const userRef = doc(db, 'users', order.userId || order.userEmail);
    await updateDoc(userRef, {
      isPremium: true,
      subscriptionPlan: order.planId,
      subscriptionExpiry: order.expiresAt || null,
      lastPaymentAt: order.createdAt
    }).catch(async () => {
      // If doc didn't exist, create with merge
      await setDoc(userRef, {
        id: order.userId,
        email: order.userEmail,
        name: order.userName,
        isPremium: true,
        subscriptionPlan: order.planId,
        subscriptionExpiry: order.expiresAt || null,
        lastPaymentAt: order.createdAt
      }, { merge: true });
    });

    return true;
  } catch (error) {
    console.warn('Firestore createOrder warning:', error);
    return false;
  }
}

/**
 * Delete a single user and their verification records from Firestore (In-App Account Deletion)
 */
export async function deleteUserFromFirestore(emailOrId: string): Promise<boolean> {
  try {
    if (!db) return false;
    const { deleteDoc } = await import('firebase/firestore');
    const cleanKey = emailOrId.trim().toLowerCase();

    // 1. Delete user document
    await deleteDoc(doc(db, 'users', cleanKey)).catch(() => {});

    // Query by email if id was different
    const q = query(collection(db, 'users'), where('email', '==', cleanKey), limit(1));
    const snap = await getDocs(q);
    for (const docSnap of snap.docs) {
      await deleteDoc(docSnap.ref).catch(() => {});
    }

    // 2. Delete verification codes associated with email
    const verifSnap = await getDocs(query(collection(db, 'verification_codes'), where('email', '==', cleanKey)));
    for (const docSnap of verifSnap.docs) {
      await deleteDoc(docSnap.ref).catch(() => {});
    }

    return true;
  } catch (error) {
    console.warn('Firestore deleteUserFromFirestore warning:', error);
    return false;
  }
}

/**
 * Fetch User Orders from Firestore (Restore Purchases)
 */
export async function getUserOrdersFromFirestore(emailOrId: string): Promise<CloudOrder[]> {
  try {
    if (!db) return [];
    const cleanKey = emailOrId.trim().toLowerCase();
    
    // Query by userId or email
    const q1 = query(collection(db, 'orders'), where('userEmail', '==', cleanKey));
    const snap = await getDocs(q1);
    const orders: CloudOrder[] = [];
    snap.forEach((doc) => {
      orders.push(doc.data() as CloudOrder);
    });

    return orders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (error) {
    console.warn('Firestore getUserOrders warning:', error);
    return [];
  }
}

/**
 * Delete all users and verification codes from Firestore
 */
export async function deleteAllFirestoreUsers(): Promise<boolean> {
  try {
    if (!db) return false;
    const { deleteDoc } = await import('firebase/firestore');
    
    // 1. Delete users
    const usersSnap = await getDocs(collection(db, 'users'));
    for (const docSnap of usersSnap.docs) {
      await deleteDoc(docSnap.ref).catch(() => {});
    }

    // 2. Delete verification codes
    const verifSnap = await getDocs(collection(db, 'verification_codes'));
    for (const docSnap of verifSnap.docs) {
      await deleteDoc(docSnap.ref).catch(() => {});
    }

    return true;
  } catch (error) {
    console.warn('Firestore deleteAllFirestoreUsers warning:', error);
    return false;
  }
}

