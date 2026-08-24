import { LanguageId } from '../types';

export type SpeechSpeedMode = 'normal' | 'slow';

export interface TtsOptions {
  speedMode?: SpeechSpeedMode;
  rate?: number;
  pitch?: number;
  volume?: number;
  languageId?: LanguageId;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

// Map of voice codes for different languages
export const GERMAN_LOCALE = 'de-DE';

// Normal speed: 0.82x (natural, clear for language learners)
// Slow speed: 0.58x (deliberate, highly articulated for phonetics practice)
export const SPEED_RATES: Record<SpeechSpeedMode, number> = {
  normal: 0.82,
  slow: 0.58
};

// In-memory voice cache
let cachedVoices: SpeechSynthesisVoice[] = [];
let isVoiceListLoaded = false;

/**
 * Load and cache available synthesis voices
 */
export const loadAvailableVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  try {
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      cachedVoices = voices;
      isVoiceListLoaded = true;
    }
  } catch (e) {
    console.warn('Voices could not be read from window.speechSynthesis:', e);
  }
  return cachedVoices;
};

// Initialize voice listener
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadAvailableVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      loadAvailableVoices();
    };
  }
}

/**
 * Get the best high-quality native German (de-DE) voice
 */
export const getBestGermanVoice = (): SpeechSynthesisVoice | null => {
  const voices = cachedVoices.length > 0 ? cachedVoices : loadAvailableVoices();
  if (!voices || voices.length === 0) return null;

  // Filter all German voices (de-DE, de-AT, de-CH, de)
  const germanVoices = voices.filter(v => {
    const lang = (v.lang || '').toLowerCase().replace('_', '-');
    return lang.startsWith('de');
  });

  if (germanVoices.length === 0) {
    // If no German voice found, fallback to any available voice
    return null;
  }

  // Priority ranking for natural sounding German voices
  const preferredNames = [
    'google deutsch',
    'google german',
    'marlene',
    'vicki',
    'hans',
    'katja',
    'anna',
    'martin',
    'helena',
    'natural',
    'enhanced',
    'premium',
    'siri'
  ];

  for (const pref of preferredNames) {
    const match = germanVoices.find(v => v.name.toLowerCase().includes(pref));
    if (match) return match;
  }

  // Exact de-DE match
  const deDeVoice = germanVoices.find(v => (v.lang || '').toLowerCase().replace('_', '-') === 'de-de');
  if (deDeVoice) return deDeVoice;

  return germanVoices[0];
};

/**
 * Clean and prepare German text for natural pronunciation
 * Adds natural punctuation pauses and phonetic expansions for single letters or symbols
 */
export const sanitizeGermanSpeechText = (text: string): string => {
  if (!text) return '';

  let cleaned = text
    .replace(/\[.*?\]/g, '') // Remove phonetic guides in brackets e.g. [ih möh-tı]
    .replace(/\(.*?\)/g, '') // Remove parenthetical notes
    .replace(/[\/\\#*~_`]/g, ' ') // Strip markdown symbols
    .replace(/\s+/g, ' ')
    .trim();

  // Special handling for single German letters to articulate their proper German name
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

  // Ensure punctuation has natural pause spacing
  cleaned = cleaned
    .replace(/([.!?])([A-Za-zÄÖÜäöüß])/g, '$1 $2')
    .replace(/([,;:])([A-Za-zÄÖÜäöüß])/g, '$1 $2');

  return cleaned;
};

/**
 * Check if the browser / environment supports SpeechSynthesis
 */
export const isTtsSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

import { audioManager } from './audioManager';

/**
 * Stop any active TTS speech playback
 */
export const stopGermanSpeech = (): void => {
  audioManager.stop();
};

/**
 * Speak German text naturally with on-device TTS engine via centralized AudioManager
 */
export const playGermanText = (
  text: string,
  options: TtsOptions = {}
): Promise<void> => {
  const speedMode = options.speedMode || 'normal';
  const rate = options.rate !== undefined ? options.rate : SPEED_RATES[speedMode];

  return audioManager.play(text, {
    languageId: options.languageId || 'de',
    rate,
    pitch: options.pitch,
    volume: options.volume,
    onStart: options.onStart,
    onEnd: options.onEnd,
    onError: options.onError
  });
};

