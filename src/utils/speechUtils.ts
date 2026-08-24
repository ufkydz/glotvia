import { LanguageId } from '../types';
import { audioManager } from '../services/audioManager';

// Voice code map for accurate native speech synthesis
export const VOICE_CODE_MAP: Record<LanguageId, string> = {
  de: 'de-DE',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  it: 'it-IT',
  pl: 'pl-PL',
  ro: 'ro-RO',
  uk: 'uk-UA',
  ru: 'ru-RU',
  ja: 'ja-JP',
  ko: 'ko-KR',
  zh: 'zh-CN',
  ar: 'ar-SA',
  pt: 'pt-PT',
  nl: 'nl-NL',
  el: 'el-GR',
  hi: 'hi-IN',
  sv: 'sv-SE',
  tr: 'tr-TR'
};

export interface SpeechSequencePart {
  text: string;
  languageId: LanguageId;
  rate?: number;
  pauseAfterMs?: number;
}

// Global speech speed control (Default 0.70x: Calm, clear & beginner friendly)
let globalSpeechRate = 0.70;

export const setGlobalSpeechRate = (rate: number): void => {
  globalSpeechRate = Math.max(0.4, Math.min(1.2, rate));
};

export const getGlobalSpeechRate = (): number => {
  return globalSpeechRate;
};

// Cached voices list
let cachedVoices: SpeechSynthesisVoice[] = [];

export const loadVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  try {
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      cachedVoices = voices;
    }
  } catch (e) {
    console.warn('Error reading voices:', e);
  }
  return cachedVoices;
};

// Initialize voices listener for Chrome / Android / Safari
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    };
  }
}

/**
 * Find the most high-quality, native natural voice for the target language
 */
export const getBestVoiceForLanguage = (languageId: LanguageId): SpeechSynthesisVoice | null => {
  const voices = cachedVoices.length > 0 ? cachedVoices : loadVoices();
  if (!voices || voices.length === 0) return null;

  const voiceCode = VOICE_CODE_MAP[languageId] || 'de-DE';
  const targetLang = voiceCode.toLowerCase().replace('_', '-');
  const baseLang = targetLang.split('-')[0];

  // 1. Prioritize natural / Google / premium / Siri high-quality voices
  const matchingVoices = voices.filter(v => {
    const vLang = v.lang.toLowerCase().replace('_', '-');
    return vLang === targetLang || vLang.startsWith(baseLang);
  });

  if (matchingVoices.length === 0) return null;

  // Premium / Natural voice preference list
  const preferredVoice = matchingVoices.find(v => {
    const name = v.name.toLowerCase();
    return (
      name.includes('natural') ||
      name.includes('google') ||
      name.includes('siri') ||
      name.includes('premium') ||
      name.includes('enhanced') ||
      name.includes('marlene') ||
      name.includes('vicki') ||
      name.includes('hans') ||
      name.includes('katja') ||
      name.includes('helena') ||
      name.includes('anna') ||
      name.includes('martin')
    );
  });

  if (preferredVoice) return preferredVoice;

  // 2. Exact match on full locale (e.g. de-DE)
  const exactMatch = matchingVoices.find(v => v.lang.toLowerCase().replace('_', '-') === targetLang);
  if (exactMatch) return exactMatch;

  // 3. Fallback to any matching base language voice
  return matchingVoices[0];
};

/**
 * Clean & Format text for pristine German pronunciation
 */
export const prepareTextForSpeech = (text: string, languageId: LanguageId): string => {
  if (!text) return '';

  let cleaned = text
    .replace(/\[.*?\]/g, '') // Remove phonetic guide in brackets e.g. [der ap-fel]
    .replace(/\(.*?\)/g, '') // Remove parentheses comments
    .replace(/[\/\\#*~_`]/g, ' ') // Remove markdown / syntax characters
    .trim();

  // For German single letters, improve phonetics so Android TTS doesn't stumble
  if (languageId === 'de') {
    // If text is a single uppercase or lowercase letter, format cleanly
    if (/^[A-Za-zÄÖÜäöüß]$/.test(cleaned)) {
      const letterMap: Record<string, string> = {
        A: 'A.', a: 'a.',
        B: 'Be.', b: 'be.',
        C: 'Tse.', c: 'tse.',
        D: 'De.', d: 'de.',
        E: 'E.', e: 'e.',
        F: 'Ef.', f: 'ef.',
        G: 'Ge.', g: 'ge.',
        H: 'Ha.', h: 'ha.',
        I: 'I.', i: 'i.',
        J: 'Jott.', j: 'jott.',
        K: 'Ka.', k: 'ka.',
        L: 'El.', l: 'el.',
        M: 'Em.', m: 'em.',
        N: 'En.', n: 'en.',
        O: 'O.', o: 'o.',
        P: 'Pe.', p: 'pe.',
        Q: 'Ku.', q: 'ku.',
        R: 'Er.', r: 'er.',
        S: 'Es.', s: 'es.',
        T: 'Te.', t: 'te.',
        U: 'U.', u: 'u.',
        V: 'Vau.', v: 'vau.',
        W: 'We.', w: 'we.',
        X: 'Iks.', x: 'iks.',
        Y: 'Üpsilon.', y: 'üpsilon.',
        Z: 'Zett.', z: 'zett.',
        Ä: 'Ä.', ä: 'ä.',
        Ö: 'Ö.', ö: 'ö.',
        Ü: 'Ü.', ü: 'ü.',
        ß: 'Eszett.'
      };
      return letterMap[cleaned] || cleaned;
    }
  }

  return cleaned;
};

/**
 * Main Speak Function: Delegates immediately through global AudioManager
 * to guarantee no audio overlap across words, cards, or dialogues.
 */
export const speakText = (text: string, languageId: LanguageId = 'de', rate?: number): Promise<void> => {
  const effectiveRate = rate !== undefined ? rate : globalSpeechRate;
  return audioManager.play(text, {
    languageId,
    rate: effectiveRate
  });
};

/**
 * Cancel any ongoing speech synthesis immediately
 */
export const cancelSpeech = (): void => {
  audioManager.stop();
};

/**
 * Sequence speaker for Question & Answer, Alphabet + Example word with natural pauses
 */
export const speakSequence = async (parts: SpeechSequencePart[]): Promise<void> => {
  return audioManager.playSequence(
    parts.map(p => ({
      text: p.text,
      languageId: p.languageId,
      rate: p.rate ?? globalSpeechRate,
      pauseAfterMs: p.pauseAfterMs ?? 400
    }))
  );
};

