import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';
import firebaseConfigData from '../../firebase-applet-config.json';

export const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey || "AIzaSyDRZNPY7lrTn-jn6IX80jovJ1yGPfRl1lo",
  authDomain: firebaseConfigData.authDomain || "glotvia.firebaseapp.com",
  projectId: firebaseConfigData.projectId || "glotvia",
  storageBucket: firebaseConfigData.storageBucket || "glotvia.firebasestorage.app",
  messagingSenderId: firebaseConfigData.messagingSenderId || "715830950272",
  appId: firebaseConfigData.appId || "1:715830950272:web:d92397cd01a4884f55a965",
  measurementId: firebaseConfigData.measurementId || "G-0CTED0GJTW"
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
let authInstance: Auth | null = null;
try {
  authInstance = getAuth(app);
} catch (e) {
  console.warn('Firebase Auth initialization warning:', e);
}
export const auth = authInstance;

// Initialize Analytics safely
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

// Initialize Firestore with specific databaseId if provided
const firestoreDbId = firebaseConfigData.firestoreDatabaseId || '(default)';

let dbInstance;
try {
  if (firestoreDbId && firestoreDbId !== '(default)') {
    dbInstance = getFirestore(app, firestoreDbId);
  } else {
    dbInstance = getFirestore(app);
  }
} catch (e) {
  console.warn('Firestore initialization fallback:', e);
  dbInstance = getFirestore(app);
}

export const db = dbInstance;

