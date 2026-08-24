export type SpeechRecognitionState =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'success'
  | 'error';

export type SpeechRecognitionErrorCode =
  | 'not-allowed'
  | 'no-speech'
  | 'audio-capture'
  | 'network'
  | 'not-supported'
  | 'aborted'
  | 'unknown';

export interface SpeechRecognitionResultData {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface GermanSpeechRecognitionCallbacks {
  onStart?: () => void;
  onInterimResult?: (transcript: string) => void;
  onFinalResult?: (result: SpeechRecognitionResultData) => void;
  onError?: (errorCode: SpeechRecognitionErrorCode, message: string) => void;
  onEnd?: () => void;
}

/**
 * Check whether Web Speech API / SpeechRecognition is supported
 */
export const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition ||
    (window as any).mozSpeechRecognition ||
    (window as any).msSpeechRecognition
  );
};

export class GermanSpeechRecognitionManager {
  private recognition: any = null;
  private isListening: boolean = false;
  private callbacks: GermanSpeechRecognitionCallbacks = {};
  private noSpeechTimer: any = null;

  constructor() {
    this.initRecognition();
  }

  private initRecognition(): void {
    if (!isSpeechRecognitionSupported()) {
      return;
    }

    try {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition ||
        (window as any).mozSpeechRecognition ||
        (window as any).msSpeechRecognition;

      this.recognition = new SpeechRecognitionClass();
      this.recognition.lang = 'de-DE'; // German standard locale
      this.recognition.continuous = false; // Single utterance for precise testing
      this.recognition.interimResults = true; // Real-time feedback
      this.recognition.maxAlternatives = 3;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.callbacks.onStart?.();

        // 10-second no-speech timeout watchdog
        this.clearNoSpeechTimer();
        this.noSpeechTimer = setTimeout(() => {
          if (this.isListening) {
            this.stop();
            this.callbacks.onError?.(
              'no-speech',
              'Ses algılanamadı. Lütfen mikrofonunuza daha yakın ve net şekilde konuşunuz.'
            );
          }
        }, 10000);
      };

      this.recognition.onresult = (event: any) => {
        this.clearNoSpeechTimer();
        let interimTranscript = '';
        let finalTranscript = '';
        let highestConfidence = 0.85;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          const transcriptPiece = res[0].transcript;
          if (res[0].confidence && res[0].confidence > 0) {
            highestConfidence = res[0].confidence;
          }

          if (res.isFinal) {
            finalTranscript += transcriptPiece;
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        if (interimTranscript) {
          this.callbacks.onInterimResult?.(interimTranscript.trim());
        }

        if (finalTranscript) {
          this.callbacks.onFinalResult?.({
            transcript: finalTranscript.trim(),
            confidence: highestConfidence,
            isFinal: true
          });
        }
      };

      this.recognition.onerror = (event: any) => {
        this.clearNoSpeechTimer();
        this.isListening = false;
        const errType: string = event.error || 'unknown';

        let code: SpeechRecognitionErrorCode = 'unknown';
        let friendlyMessage = 'Ses algılama sırasında bir sorun oluştu.';

        switch (errType) {
          case 'not-allowed':
          case 'service-not-allowed':
            code = 'not-allowed';
            friendlyMessage =
              'Mikrofon izni verilmedi. Lütfen tarayıcı / cihaz ayarlarından mikrofon erişimine izin verin.';
            break;
          case 'no-speech':
            code = 'no-speech';
            friendlyMessage =
              'Ses algılanamadı. Lütfen mikrofonunuza yaklaşarak cümleyi tekrar söyleyin.';
            break;
          case 'audio-capture':
            code = 'audio-capture';
            friendlyMessage = 'Kullanılabilir mikrofon donanımı bulunamadı.';
            break;
          case 'network':
            code = 'network';
            friendlyMessage =
              'Konuşma tanıma servisi için internet bağlantısı gerekiyor.';
            break;
          case 'aborted':
            code = 'aborted';
            friendlyMessage = 'Kayıt iptal edildi.';
            break;
          default:
            code = 'unknown';
            friendlyMessage = `Konuşma tanıma hatası: ${errType}`;
            break;
        }

        if (code !== 'aborted') {
          this.callbacks.onError?.(code, friendlyMessage);
        }
      };

      this.recognition.onend = () => {
        this.clearNoSpeechTimer();
        this.isListening = false;
        this.callbacks.onEnd?.();
      };
    } catch (e) {
      console.warn('Could not initialize SpeechRecognition:', e);
    }
  }

  private clearNoSpeechTimer(): void {
    if (this.noSpeechTimer) {
      clearTimeout(this.noSpeechTimer);
      this.noSpeechTimer = null;
    }
  }

  /**
   * Request microphone permission explicitly
   */
  public async requestMicrophonePermission(): Promise<boolean> {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Close the stream tracks immediately after permission check
        stream.getTracks().forEach(track => track.stop());
        return true;
      } catch (err: any) {
        console.warn('Microphone permission request failed:', err);
        return false;
      }
    }
    return true;
  }

  /**
   * Start listening in German (de-DE)
   */
  public async start(callbacks: GermanSpeechRecognitionCallbacks): Promise<boolean> {
    this.callbacks = callbacks;

    if (!isSpeechRecognitionSupported()) {
      callbacks.onError?.(
        'not-supported',
        'Cihazınız veya tarayıcınız konuşma tanımayı (SpeechRecognition) desteklemiyor.'
      );
      return false;
    }

    if (!this.recognition) {
      this.initRecognition();
    }

    // Try acquiring mic permission
    const hasPerm = await this.requestMicrophonePermission();
    if (!hasPerm) {
      callbacks.onError?.(
        'not-allowed',
        'Mikrofon izni reddedildi. Lütfen tarayıcı adres çubuğundaki kilit simgesinden mikrofona izin verin.'
      );
      return false;
    }

    try {
      this.recognition.abort(); // Cancel any existing instance
    } catch {
      // Ignore
    }

    try {
      this.recognition.start();
      return true;
    } catch (e: any) {
      console.warn('SpeechRecognition start error:', e);
      if (e.name === 'InvalidStateError') {
        // Already started
        return true;
      }
      callbacks.onError?.('unknown', 'Mikrofon başlatılamadı. Lütfen tekrar deneyiniz.');
      return false;
    }
  }

  /**
   * Stop listening
   */
  public stop(): void {
    this.clearNoSpeechTimer();
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore
      }
    }
    this.isListening = false;
  }

  /**
   * Abort listening
   */
  public abort(): void {
    this.clearNoSpeechTimer();
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {
        // Ignore
      }
    }
    this.isListening = false;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

// Export singleton instance for app-wide use
export const germanSpeechRecognizer = new GermanSpeechRecognitionManager();
