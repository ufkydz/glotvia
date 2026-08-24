import { saveVerificationToFirestore } from './firebaseDbService';
import { sendPhysicalEmail } from './realEmailService';

// Email Verification Service for Glotvia
// Handles generating 6-digit verification codes, sending simulated & physical emails, storing in local inbox, and verifying codes.

export interface VerificationSession {
  id: string;
  email: string;
  code: string;
  purpose: 'register' | 'login' | 'password_reset';
  extraData?: {
    name?: string;
    targetLanguage?: string;
    nativeLanguage?: string;
    avatar?: string;
    password?: string;
  };
  createdAt: number;
  expiresAt: number;
  attempts: number;
  isVerified: boolean;
}

export interface SimulatedEmail {
  id: string;
  to: string;
  from: string;
  subject: string;
  sentAt: number;
  code: string;
  purpose: 'register' | 'login' | 'password_reset';
  userName?: string;
}

const STORAGE_KEY_VERIFICATIONS = 'glotvia_email_verifications_v1';
const STORAGE_KEY_INBOX = 'glotvia_simulated_inbox_v1';

// Get active verifications from localStorage
function getStoredSessions(): Record<string, VerificationSession> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VERIFICATIONS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredSessions(sessions: Record<string, VerificationSession>) {
  try {
    localStorage.setItem(STORAGE_KEY_VERIFICATIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save email verifications', e);
  }
}

// Simulated Inbox for user inspection
export function getSimulatedInbox(): SimulatedEmail[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INBOX);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSimulatedInbox(inbox: SimulatedEmail[]) {
  try {
    localStorage.setItem(STORAGE_KEY_INBOX, JSON.stringify(inbox.slice(0, 20))); // Keep last 20 emails
  } catch (e) {
    console.error('Failed to save simulated inbox', e);
  }
}

/**
 * Generate a cryptographically random-looking 6-digit numeric OTP
 */
function generate6DigitCode(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return num.toString();
}

/**
 * Sends a 6-digit verification code to the given email address.
 * Generates an in-app email item and saves verification session.
 */
export function sendEmailVerificationCode(
  email: string,
  purpose: 'register' | 'login' | 'password_reset' = 'register',
  extraData?: VerificationSession['extraData']
): { success: boolean; message: string; code: string; sessionId: string; expiresAt: number } {
  const cleanEmail = email.trim().toLowerCase();
  
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return {
      success: false,
      message: 'Geçersiz e-posta adresi.',
      code: '',
      sessionId: '',
      expiresAt: 0
    };
  }

  const code = generate6DigitCode();
  const now = Date.now();
  const expiresAt = now + 10 * 60 * 1000; // 10 minutes expiry
  const sessionId = `ver_${now}_${Math.random().toString(36).substring(2, 7)}`;

  const session: VerificationSession = {
    id: sessionId,
    email: cleanEmail,
    code,
    purpose,
    extraData,
    createdAt: now,
    expiresAt,
    attempts: 0,
    isVerified: false
  };

  // Save session
  const sessions = getStoredSessions();
  sessions[cleanEmail] = session;
  saveStoredSessions(sessions);

  // Add to simulated inbox
  const inbox = getSimulatedInbox();
  const subject = purpose === 'register' 
    ? `Glotvia - Hesap Kayıt Onay Kodunuz: ${code}`
    : purpose === 'login'
    ? `Glotvia - Giriş Doğrulama Kodunuz: ${code}`
    : `Glotvia - Güvenlik Kodunuz: ${code}`;

  const emailItem: SimulatedEmail = {
    id: `mail_${now}`,
    to: cleanEmail,
    from: 'Glotvia Güvenlik <noreply@glotvia.com>',
    subject,
    sentAt: now,
    code,
    purpose,
    userName: extraData?.name || cleanEmail.split('@')[0]
  };

  inbox.unshift(emailItem);
  saveSimulatedInbox(inbox);

  // Sync to Cloud Firestore Database asynchronously
  saveVerificationToFirestore({
    id: sessionId,
    email: cleanEmail,
    code,
    purpose,
    createdAt: now,
    expiresAt,
    isVerified: false,
    attempts: 0
  }).catch((err) => console.warn('Firestore code sync warning:', err));

  // Trigger Physical Email Delivery (EmailJS / Webhook / SMTP Gateway)
  sendPhysicalEmail(
    cleanEmail, 
    code, 
    extraData?.name || cleanEmail.split('@')[0], 
    purpose === 'register' ? 'Glotvia Hesap Kaydı ve E-posta Doğrulama' : 'Glotvia Giriş Doğrulama'
  ).then((res) => {
    console.log('Physical Email Dispatch Result:', res);
  }).catch((err) => console.warn('Physical email dispatch warning:', err));

  // Dispatch custom browser event so any open UI / notification toast can react
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('glotvia_email_received', {
      detail: { email: cleanEmail, code, purpose, subject }
    }));
  }

  return {
    success: true,
    message: `${cleanEmail} adresine 6 haneli güvenlik doğrulama kodu gönderildi.`,
    code,
    sessionId,
    expiresAt
  };
}

/**
 * Verify a 6-digit code for a given email address
 */
export function verifyEmailCode(
  email: string,
  enteredCode: string,
  expectedPurpose?: 'register' | 'login' | 'password_reset'
): { 
  success: boolean; 
  message: string; 
  session?: VerificationSession; 
  verifiedData?: VerificationSession['extraData'] 
} {
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = enteredCode.trim().replace(/\s+/g, '');

  if (!cleanCode || cleanCode.length !== 6) {
    return {
      success: false,
      message: 'Lütfen 6 haneli doğrulama kodunu eksiksiz giriniz.'
    };
  }

  const sessions = getStoredSessions();
  const session = sessions[cleanEmail];

  if (!session) {
    return {
      success: false,
      message: 'Bu e-posta için aktif bir doğrulama talebi bulunamadı. Lütfen yeni bir kod isteyin.'
    };
  }

  // Check expiration
  if (Date.now() > session.expiresAt) {
    return {
      success: false,
      message: 'Doğrulama kodunun süresi dolmuş (10 dakika). Lütfen yeni bir kod isteyin.'
    };
  }

  // Check attempts
  if (session.attempts >= 5) {
    return {
      success: false,
      message: 'Çok fazla hatalı deneme yapıldı. Lütfen yeni bir doğrulama kodu isteyin.'
    };
  }

  // Check code match
  if (session.code !== cleanCode) {
    session.attempts += 1;
    sessions[cleanEmail] = session;
    saveStoredSessions(sessions);
    const remaining = 5 - session.attempts;
    return {
      success: false,
      message: `Hatalı doğrulama kodu. Kalan deneme hakkı: ${remaining}`
    };
  }

  // Check purpose if specified
  if (expectedPurpose && session.purpose !== expectedPurpose) {
    return {
      success: false,
      message: 'Geçersiz işlem türü.'
    };
  }

  // Mark as verified and clean up
  session.isVerified = true;
  delete sessions[cleanEmail];
  saveStoredSessions(sessions);

  return {
    success: true,
    message: 'E-posta adresiniz başarıyla doğrulandı!',
    session,
    verifiedData: session.extraData
  };
}

/**
 * Check if there is an active pending code for an email
 */
export function getActiveSession(email: string): VerificationSession | null {
  const cleanEmail = email.trim().toLowerCase();
  const sessions = getStoredSessions();
  const session = sessions[cleanEmail];
  if (session && Date.now() < session.expiresAt && session.attempts < 5) {
    return session;
  }
  return null;
}
