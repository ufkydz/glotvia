// Global Audio Manager for Glotvia
// Enforces single-source-of-truth audio playback: when sound B starts, sound A is INSTANTLY halted.

import { LanguageId } from '../types';
import { getBestVoiceForLanguage, prepareTextForSpeech, VOICE_CODE_MAP } from '../utils/speechUtils';

export interface PlayAudioOptions {
  id?: string;
  languageId?: LanguageId;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export interface AudioSequenceItem {
  text: string;
  languageId: LanguageId;
  rate?: number;
  pauseAfterMs?: number;
}

type AudioListener = (activeId: string | null) => void;

class GlobalAudioManager {
  private static instance: GlobalAudioManager;
  private currentSessionId: number = 0;
  private activeId: string | null = null;
  private listeners: Set<AudioListener> = new Set();
  private activeAudioElements: Set<HTMLAudioElement> = new Set();

  private constructor() {
    // Window voices initialization
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          // Voice cache updated
        };
      }
    }
  }

  public static getInstance(): GlobalAudioManager {
    if (!GlobalAudioManager.instance) {
      GlobalAudioManager.instance = new GlobalAudioManager();
    }
    return GlobalAudioManager.instance;
  }

  /**
   * Subscribe to active playing ID changes
   */
  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener(this.activeId);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private setActiveId(id: string | null) {
    this.activeId = id;
    this.listeners.forEach((listener) => {
      try {
        listener(id);
      } catch (err) {
        console.warn('Error in audio manager listener:', err);
      }
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('glotvia_audio_state_change', { detail: { activeId: id } })
      );
    }
  }

  public getActiveId(): string | null {
    return this.activeId;
  }

  /**
   * STOP ALL active audio, TTS speech, and in-flight sequences immediately
   */
  public stop(): void {
    // Increment session ID to cancel any pending async steps or timeouts
    this.currentSessionId++;

    // Cancel all browser TTS
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (err) {
        console.warn('Speech synthesis cancel error:', err);
      }
    }

    // Stop any playing HTMLAudioElements
    this.activeAudioElements.forEach((audio) => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {
        // ignore
      }
    });
    this.activeAudioElements.clear();

    this.setActiveId(null);
  }

  /**
   * Play text via Web Speech API, immediately stopping any previous audio
   */
  public async play(text: string, options: PlayAudioOptions = {}): Promise<void> {
    // 1. Immediately kill whatever was playing before
    this.stop();

    if (!text || !text.trim()) {
      return;
    }

    const sessionId = this.currentSessionId;
    const playId = options.id || `tts_${Date.now()}_${Math.random()}`;
    const languageId: LanguageId = options.languageId || 'de';

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech Synthesis is not supported in this environment.');
      options.onError?.(new Error('TTS_NOT_SUPPORTED'));
      return;
    }

    const cleanText = prepareTextForSpeech(text, languageId);
    if (!cleanText) return;

    this.setActiveId(playId);
    options.onStart?.();

    return new Promise<void>((resolve) => {
      const voiceCode = VOICE_CODE_MAP[languageId] || 'de-DE';
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = voiceCode;

      const rate = options.rate !== undefined ? options.rate : 0.80;
      utterance.rate = Math.max(0.45, Math.min(1.2, rate));
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 1.0;

      const bestVoice = getBestVoiceForLanguage(languageId);
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      let isFinished = false;
      const finish = () => {
        if (!isFinished) {
          isFinished = true;
          // Only clear if this session is still the active one
          if (this.currentSessionId === sessionId) {
            this.setActiveId(null);
            options.onEnd?.();
          }
          resolve();
        }
      };

      utterance.onend = finish;
      utterance.onerror = (e) => {
        console.warn('Utterance error or interrupt:', e);
        if (this.currentSessionId === sessionId) {
          options.onError?.(e);
        }
        finish();
      };

      // Watchdog timer in case browser fails to trigger onend
      const estDurationMs = Math.max(1400, (cleanText.length * 120) / utterance.rate);
      const watchdog = setTimeout(() => {
        if (this.currentSessionId === sessionId) {
          finish();
        }
      }, estDurationMs + 2500);

      utterance.onend = () => {
        clearTimeout(watchdog);
        finish();
      };

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      try {
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Error starting speech utterance:', err);
        clearTimeout(watchdog);
        finish();
      }
    });
  }

  /**
   * Play an ordered sequence of phrases (e.g. German word -> pause -> English/Turkish meaning)
   * If any other audio starts during the sequence, the sequence instantly aborts.
   */
  public async playSequence(items: AudioSequenceItem[], sequenceId?: string): Promise<void> {
    this.stop();

    const sessionId = this.currentSessionId;
    const playId = sequenceId || `seq_${Date.now()}`;
    this.setActiveId(playId);

    for (let i = 0; i < items.length; i++) {
      // If user started another sound or clicked stop, abort sequence immediately
      if (this.currentSessionId !== sessionId) {
        return;
      }

      const item = items[i];
      if (!item.text || !item.text.trim()) continue;

      await new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(prepareTextForSpeech(item.text, item.languageId));
        utterance.lang = VOICE_CODE_MAP[item.languageId] || 'de-DE';
        utterance.rate = item.rate || 0.80;

        const bestVoice = getBestVoiceForLanguage(item.languageId);
        if (bestVoice) {
          utterance.voice = bestVoice;
        }

        let done = false;
        const endStep = () => {
          if (!done) {
            done = true;
            resolve();
          }
        };

        utterance.onend = endStep;
        utterance.onerror = endStep;

        const stepWatchdog = setTimeout(endStep, Math.max(1200, (item.text.length * 120) / utterance.rate + 2000));
        utterance.onend = () => {
          clearTimeout(stepWatchdog);
          endStep();
        };

        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        try {
          window.speechSynthesis.speak(utterance);
        } catch {
          clearTimeout(stepWatchdog);
          endStep();
        }
      });

      if (this.currentSessionId !== sessionId) {
        return;
      }

      const pauseMs = item.pauseAfterMs ?? 350;
      if (pauseMs > 0 && i < items.length - 1) {
        await new Promise((r) => setTimeout(r, pauseMs));
      }
    }

    if (this.currentSessionId === sessionId) {
      this.setActiveId(null);
    }
  }
}

export const audioManager = GlobalAudioManager.getInstance();
