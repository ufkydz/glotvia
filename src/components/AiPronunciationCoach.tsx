import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, Sparkles, Award, CheckCircle2, AlertCircle, 
  RotateCcw, History, Play, Pause, ChevronRight, Layers, Lightbulb, 
  HelpCircle, ArrowRight, Check, RefreshCw, X, VolumeX, ShieldCheck, 
  Smile, Flame, Sliders, Edit3
} from 'lucide-react';
import { PronunciationAssessmentResult, WordPronunciationFeedback } from '../types';
import { assessGermanPronunciation } from '../services/geminiService';
import { speakText } from '../utils/speechUtils';
import { playCoinSound, playSuccessChime } from '../utils/audioEffects';

interface AiPronunciationCoachProps {
  initialPhrase?: string;
  onAwardCoins?: (amount: number, message: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export interface PracticePhraseItem {
  id: string;
  category: 'alphabet' | 'numbers' | 'dialogue' | 'w_fragen' | 'verbs' | 'exam' | 'custom';
  german: string;
  phoneticTr: string;
  turkish: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  tip: string;
}

const PRESET_PHRASES: PracticePhraseItem[] = [
  // 1. Goethe A1 Sözlü Sınavı & Sprechen Kalıpları
  {
    id: 'exam_buchstabieren',
    category: 'exam',
    german: 'Können Sie das bitte buchstabieren?',
    phoneticTr: '[kön-nın zi das bit-tı buh-şta-bi-rın?]',
    turkish: 'Bunu lütfen harf harf kodlayabilir misiniz?',
    difficulty: 'Zor',
    tip: "A1 sözlü sınavının en kritik sorusudur. 'buchstabieren' kelimesinde 'ch' sert h, 'st' ise 'şt' okunur."
  },
  {
    id: 'exam_wiederholen',
    category: 'exam',
    german: 'Könnten Sie das bitte wiederholen?',
    phoneticTr: '[kön-tın zi das bit-tı vi-dır-ho-lın?]',
    turkish: 'Bunu lütfen tekrar edebilir misiniz?',
    difficulty: 'Zor',
    tip: "'wiederholen' kelimesinde 'ie' uzun 'i:', '-er' ise hafifçe '-a' sesine dönüşür."
  },
  {
    id: 'exam_bitte_geben',
    category: 'exam',
    german: 'Können Sie mir bitte das Buch geben?',
    phoneticTr: '[kön-nın zi mir bit-tı das buuh gey-bın?]',
    turkish: 'Lütfen bana kitabı verebilir misiniz?',
    difficulty: 'Orta',
    tip: "Sprechen Teil 3 rica kalıbı. Cümle sonundaki 'geben' fiili yalın kalır."
  },
  {
    id: 'exam_nicht_rauchen',
    category: 'exam',
    german: 'Hier darf man nicht rauchen.',
    phoneticTr: '[hiir darf man niht rau-hın]',
    turkish: 'Burada sigara içmek yasaktır.',
    difficulty: 'Orta',
    tip: "Sprechen Teil 3 kural ve yasak kartı kalıbı. 'nicht' kelimesinde 'ch' ince 'hy' sesidir."
  },
  {
    id: 'exam_fenster_aufmachen',
    category: 'exam',
    german: 'Machen Sie bitte das Fenster auf!',
    phoneticTr: '[mah-hın zi bit-tı das fens-tır auf!]',
    turkish: 'Lütfen pencereyi açınız!',
    difficulty: 'Orta',
    tip: "Ayrılabilir fiil emir cümlesi: 'aufmachen' fiilinde 'auf' en sona gider."
  },

  // 2. W-Fragen & Soru Cümleleri
  {
    id: 'wf_wo_wohnen',
    category: 'w_fragen',
    german: 'Wo wohnen Sie?',
    phoneticTr: '[vo voo-nın zi?]',
    turkish: 'Nerede ikamet ediyorsunuz?',
    difficulty: 'Kolay',
    tip: "'w' Türkçe 'v' gibi okunur; 'wohnen' kelimesindeki 'h' sesi okunmaz, 'o'yu uzatır."
  },
  {
    id: 'wf_woher_kommen',
    category: 'w_fragen',
    german: 'Woher kommen Sie?',
    phoneticTr: '[vo-hea kom-mın zi?]',
    turkish: 'Nereden geliyorsunuz / Memleketiniz neresi?',
    difficulty: 'Kolay',
    tip: "'Woher' gelinen kökeni sorar. 'er' hecesi açık 'ea' olarak biter."
  },
  {
    id: 'wf_wie_viel_kostet',
    category: 'w_fragen',
    german: 'Wie viel kostet das?',
    phoneticTr: '[vi fiil kos-tıt das?]',
    turkish: 'Bu ne kadar / fiyatı nedir?',
    difficulty: 'Kolay',
    tip: "'Wie' uzun 'vi:' okunur; 'viel' kelimesindeki 'v' ise 'f' sesiyle çıkar."
  },
  {
    id: 'wf_wann_beginnt',
    category: 'w_fragen',
    german: 'Wann beginnt der Deutschkurs?',
    phoneticTr: '[van bı-gint der doyç-kurs?]',
    turkish: 'Almanca kursu ne zaman başlıyor?',
    difficulty: 'Orta',
    tip: "'Deutsch' kelimesindeki 'eu' harfleri Türkçe 'oy', 'tsch' ise 'ç' olarak okunur."
  },
  {
    id: 'wf_was_machen',
    category: 'w_fragen',
    german: 'Was machen Sie beruflich?',
    phoneticTr: '[vas mah-hın zi be-ruuf-lih?]',
    turkish: 'Mesleğiniz nedir / ne işle uğraşıyorsunuz?',
    difficulty: 'Orta',
    tip: "'beruflich' kelimesinin sonundaki '-ich' ince nefesle 'ih' şeklinde çıkarılır."
  },

  // 3. Önemli Fiiller & Cümleler
  {
    id: 'vb_einkaufen',
    category: 'verbs',
    german: 'Ich kaufe jeden Samstag im Supermarkt ein.',
    phoneticTr: '[ih kau-fı yey-dın zams-tak im zuu-pır-markt ayn]',
    turkish: 'Her Cumartesi süpermarkette alışveriş yaparım.',
    difficulty: 'Zor',
    tip: "'einkaufen' ayrılabilir fiildir; 'ein' cümlenin en sonuna gider."
  },
  {
    id: 'vb_fahren_zug',
    category: 'verbs',
    german: 'Wir fahren mit dem Zug nach Berlin.',
    phoneticTr: '[viir faa-rın mit deym tsuuk nah ber-liin]',
    turkish: 'Biz trenle Berlin\'e gidiyoruz.',
    difficulty: 'Orta',
    tip: "'fahren' kelimesindeki 'h' okunmaz; 'Zug' kelimesi 'tsuuk' olarak patlatılır."
  },
  {
    id: 'vb_sprechen_deutsch',
    category: 'verbs',
    german: 'Ich spreche Türkisch und ein bisschen Deutsch.',
    phoneticTr: '[ih şpre-hı tür-kiş unt ayn bis-hyın doyç]',
    turkish: 'Türkçe ve biraz Almanca konuşuyorum.',
    difficulty: 'Orta',
    tip: "'sprechen' 'şpre-hın' olarak başlar; 'bisschen' 'bis-hyın' olarak okunur."
  },
  {
    id: 'vb_arbeiten_als',
    category: 'verbs',
    german: 'Er arbeitet als Ingenieur in Frankfurt.',
    phoneticTr: '[er ar-bay-tıt als in-je-nyör in frank-furt]',
    turkish: 'O Frankfurt\'ta mühendis olarak çalışıyor.',
    difficulty: 'Orta',
    tip: "Mesleklerde 'als' edatı kullanılır; 'arbeiten' fiilinde '-tet' hecesi net duyulmalıdır."
  },

  // 4. Günlük Yaşam & Selamlaşma / Nezaket
  {
    id: 'dia_guten_tag',
    category: 'dialogue',
    german: 'Guten Tag! Wie geht es Ihnen?',
    phoneticTr: '[gu-tın tag! vi geht es i-nın?]',
    turkish: 'İyi günler! Nasılsınız?',
    difficulty: 'Kolay',
    tip: "'w' harfi Türkçe 'v', 'ie' harfleri ise uzun 'i:' olarak okunur."
  },
  {
    id: 'dia_heisse',
    category: 'dialogue',
    german: 'Ich heiße Ufuk und komme aus der Türkei.',
    phoneticTr: '[ih hay-sı ufuk unt kom-mı aus der tür-kay]',
    turkish: 'Benim adım Ufuk ve Türkiye\'den geliyorum.',
    difficulty: 'Orta',
    tip: "Türkiye için artikel kullanımı zorunludur: 'aus der Türkei'."
  },
  {
    id: 'dia_entschuldigung',
    category: 'dialogue',
    german: 'Entschuldigung, wo ist der Bahnhof?',
    phoneticTr: '[ent-şul-di-gung, vo ist der ban-hof?]',
    turkish: 'Affedersiniz, tren istasyonu nerede?',
    difficulty: 'Zor',
    tip: "'tsch' Türkçe 'ç' gibi, 'h' harfi ise ünlüden sonra uzatma görevi görür (Bahnhof -> Baanhof)."
  },
  {
    id: 'dia_vielen_dank',
    category: 'dialogue',
    german: 'Vielen Dank für Ihre Hilfe!',
    phoneticTr: '[fii-lın dank für iirı hil-fı!]',
    turkish: 'Yardımınız için çok teşekkürler!',
    difficulty: 'Kolay',
    tip: "'Vielen' kelimesinde 'V' harfi 'F' olarak okunur (fiilın dank)."
  },

  // 5. Alfabe & Fonetik Ses Kuralları
  {
    id: 'alpha_ch',
    category: 'alphabet',
    german: 'ich möchte',
    phoneticTr: '[ih möh-tı]',
    turkish: 'İstiyorum / rica ediyorum',
    difficulty: 'Orta',
    tip: "'ch' sesi i/e harflerinden sonra yumuşak damağa doğru 'h/hy' gibi hışırtılı çıkar."
  },
  {
    id: 'alpha_st_sp',
    category: 'alphabet',
    german: 'Sport und Spiel',
    phoneticTr: '[şport unt şpil]',
    turkish: 'Spor ve oyun',
    difficulty: 'Kolay',
    tip: "Kelime başındaki 'sp' ve 'st' her zaman 'şp' ve 'şt' olarak okunur."
  },
  {
    id: 'alpha_umlaut',
    category: 'alphabet',
    german: 'Brötchen und Äpfel',
    phoneticTr: '[bröt-hın unt ep-fıl]',
    turkish: 'Küçük ekmek ve elmalar',
    difficulty: 'Orta',
    tip: "'ö' sesinde dudaklar büzülür; 'ä' sesi Türkçe açık 'e' sesine yakındır."
  },
  {
    id: 'alpha_z',
    category: 'alphabet',
    german: 'Zimmer und Zeitung',
    phoneticTr: '[tsim-mır unt tsay-tung]',
    turkish: 'Oda ve gazete',
    difficulty: 'Kolay',
    tip: "'Z' harfi Almanca'da 'ts' (t+s birleşik) olarak patlatılarak çıkarılır."
  },

  // 6. Sayılar & Rakamlar
  {
    id: 'num_zwanzig',
    category: 'numbers',
    german: 'einundzwanzig Euro',
    phoneticTr: '[ayn-unt-tsvan-tsih oy-ro]',
    turkish: 'Yirmi bir Euro (21 €)',
    difficulty: 'Orta',
    tip: "Sayılar tersten okunur ('bir ve yirmi') ve sonundaki '-ig' yumuşak '-ih' olarak biter."
  },
  {
    id: 'num_dreissig',
    category: 'numbers',
    german: 'dreiunddreißig Jahre',
    phoneticTr: '[dray-unt-dray-sih yaa-rı]',
    turkish: 'Otuz üç yıl / yaş',
    difficulty: 'Orta',
    tip: "'ei' harfleri Türkçe 'ay' gibi, 'ß' ise keskin 's' olarak okunur."
  },
  {
    id: 'num_fuenfzehn',
    category: 'numbers',
    german: 'fünfzehn Uhr dreißig',
    phoneticTr: '[fünf-tseyn uur dray-sih]',
    turkish: 'Saat on beş otuz (15:30)',
    difficulty: 'Kolay',
    tip: "Saatlerde 'Uhr' kelimesindeki 'h' okunmaz; 'u' uzatılarak 'uur' söylenir."
  }
];

export const AiPronunciationCoach: React.FC<AiPronunciationCoachProps> = ({
  initialPhrase,
  onAwardCoins,
  onClose,
  isModal = false
}) => {
  // Current Target Phrase
  const [selectedPhrase, setSelectedPhrase] = useState<string>(
    initialPhrase || PRESET_PHRASES[0].german
  );
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [customInput, setCustomInput] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Audio Speech Recognition State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [assessment, setAssessment] = useState<PronunciationAssessmentResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [isPlayingTarget, setIsPlayingTarget] = useState<boolean>(false);
  const [micPermissionGranted, setMicPermissionGranted] = useState<boolean | null>(null);
  const [selectedWordTip, setSelectedWordTip] = useState<WordPronunciationFeedback | null>(null);

  // History of completed recordings
  const [history, setHistory] = useState<PronunciationAssessmentResult[]>(() => {
    try {
      const saved = localStorage.getItem('glotvia_pronunciation_history_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Check if Web Speech API is supported
  const isSpeechRecognitionSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Initialize Speech Recognition
  useEffect(() => {
    if (isSpeechRecognitionSupported) {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'de-DE'; // German target recognition

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg(null);
        setMicPermissionGranted(true);
        setRecordingSeconds(0);
        timerRef.current = setInterval(() => {
          setRecordingSeconds(prev => prev + 1);
        }, 1000);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        const current = final || interim;
        setSpokenTranscript(current);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMsg('Mikrofon erişim izni verilmedi. Lütfen tarayıcınızın adres çubuğundaki kilit simgesine basıp mikrofona izin verin.');
          setMicPermissionGranted(false);
        } else if (event.error === 'no-speech') {
          setErrorMsg('Ses algılanamadı. Lütfen mikrofona biraz daha yakın konuşarak tekrar deneyin.');
        } else {
          setErrorMsg(`Ses tanıma uyarısı: ${event.error}. Tekrar deneyebilirsiniz.`);
        }
        stopListening();
      };

      recognition.onend = () => {
        stopListening();
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const startListening = () => {
    setErrorMsg(null);
    setSpokenTranscript('');
    setAssessment(null);
    setSelectedWordTip(null);

    if (!isSpeechRecognitionSupported) {
      setErrorMsg('Tarayıcınız doğrudan mikrofon ses tanımayı desteklemiyor. Lütfen Chrome, Edge veya Safari kullanın ya da konuşmanızı metin kutusuna yazarak test edin.');
      return;
    }

    try {
      recognitionRef.current?.start();
    } catch (e) {
      // If already started, stop and restart
      try {
        recognitionRef.current?.stop();
        setTimeout(() => recognitionRef.current?.start(), 200);
      } catch (err) {
        setErrorMsg('Mikrofon başlatılamadı, lütfen sayfayı yenileyip tekrar deneyin.');
      }
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    try {
      recognitionRef.current?.stop();
    } catch {}
  };

  // Perform AI Pronunciation Assessment
  const handleEvaluateSpeech = async (spokenToEvaluate?: string) => {
    const textToAssess = spokenToEvaluate || spokenTranscript;
    if (!textToAssess.trim()) {
      setErrorMsg('Lütfen önce mikrofona konuşun veya ne söylediğinizi yazın.');
      return;
    }

    setIsEvaluating(true);
    setErrorMsg(null);

    try {
      const result = await assessGermanPronunciation(selectedPhrase, textToAssess, 'A1');
      setAssessment(result);

      // Award coins for good performance
      if (result.overallScore >= 70) {
        playSuccessChime();
        const coins = result.overallScore >= 85 ? 20 : 10;
        if (onAwardCoins) {
          onAwardCoins(coins, `🎤 Telaffuz Skoru: %${result.overallScore}`);
        } else {
          playCoinSound();
        }
      }

      // Save to local history
      const updatedHistory = [result, ...history.slice(0, 15)];
      setHistory(updatedHistory);
      try {
        localStorage.setItem('glotvia_pronunciation_history_v1', JSON.stringify(updatedHistory));
      } catch {}

    } catch (err: any) {
      setErrorMsg('Telaffuz analizi sırasında bir bağlantı hatası oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Play target German audio
  const handlePlayTargetAudio = (phraseToPlay: string, rate: number = 1.0) => {
    setIsPlayingTarget(true);
    speakText(phraseToPlay, 'de', rate);
    setTimeout(() => {
      setIsPlayingTarget(false);
    }, 2000);
  };

  // Select phrase from presets
  const handleSelectPreset = (item: PracticePhraseItem) => {
    setSelectedPhrase(item.german);
    setSpokenTranscript('');
    setAssessment(null);
    setSelectedWordTip(null);
    setErrorMsg(null);
    handlePlayTargetAudio(item.german, audioSpeed);
  };

  // Filtered preset phrases
  const filteredPhrases = activeCategory === 'all' 
    ? PRESET_PHRASES 
    : PRESET_PHRASES.filter(p => p.category === activeCategory);

  const matchedPreset = PRESET_PHRASES.find(p => p.german.toLowerCase() === selectedPhrase.toLowerCase());

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-indigo-950/50 to-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-full text-xs font-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Yapay Zeka Destekli Fonetik & Telaffuz Koçu</span>
              <span>•</span>
              <span>Mikrofon Aktif 🎙️</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Almanca Telaffuz & Konuşma Pratiği</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Mikrofona Almanca konuşun; yapay zeka harf vurgularınızı, akıcılığınızı ve Goethe A1 telaffuz kurallarınızı anlık puanlasın.
            </p>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="self-start sm:self-center p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left side Target & Mic, Right side Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ========================================================
            LEFT COLUMN (7 cols): TARGET PHRASE & RECORDING CARD
        ======================================================== */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Target Phrase Hero Card */}
          <div className="bg-slate-900/90 border-2 border-slate-800 hover:border-amber-500/40 rounded-3xl p-5 sm:p-7 space-y-4 shadow-xl backdrop-blur-md transition-all">
            
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Hedef Almanca İfade</span>
              </span>

              {/* Speed toggle */}
              <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 px-1 font-bold">Hız:</span>
                <button
                  type="button"
                  onClick={() => setAudioSpeed(0.75)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                    audioSpeed === 0.75 
                      ? 'bg-amber-500 text-slate-950 font-black' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  0.75x (Yavaş)
                </button>
                <button
                  type="button"
                  onClick={() => setAudioSpeed(1.0)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                    audioSpeed === 1.0 
                      ? 'bg-amber-500 text-slate-950 font-black' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1.0x (Normal)
                </button>
              </div>
            </div>

            {/* Target Display */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight leading-snug">
                  {selectedPhrase}
                </div>
                <button
                  type="button"
                  onClick={() => handlePlayTargetAudio(selectedPhrase, audioSpeed)}
                  className={`p-3.5 rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center shrink-0 ${
                    isPlayingTarget
                      ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30 animate-pulse'
                      : 'bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40'
                  }`}
                  title="Doğal Telaffuzu Dinle"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {matchedPreset && (
                <div className="space-y-1">
                  <div className="text-xs font-mono text-slate-400">
                    Okunuş: <span className="text-amber-400 font-bold">{matchedPreset.phoneticTr}</span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    Anlamı: {matchedPreset.turkish}
                  </div>
                  <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-[11px] text-amber-300/90 flex items-start gap-2 mt-2">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Telaffuz İpucu:</strong> {matchedPreset.tip}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Microphone Interaction Box */}
            <div className="pt-4 border-t border-slate-800/90 space-y-4">
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-2">
                
                {/* Big Record Button */}
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`relative group px-6 py-4 rounded-3xl font-black text-sm sm:text-base flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-95 cursor-pointer w-full sm:w-auto ${
                    isListening
                      ? 'bg-rose-500 text-white ring-8 ring-rose-500/30 animate-pulse shadow-rose-500/40'
                      : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/25 hover:scale-105'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-6 h-6 animate-bounce" />
                      <span>Kaydı Durdur ({recordingSeconds}s)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-6 h-6" />
                      <span>Mikrofona Konuş ve Puanla</span>
                    </>
                  )}
                </button>

                {/* Listen to Sample Audio Button */}
                <button
                  type="button"
                  onClick={() => handlePlayTargetAudio(selectedPhrase, audioSpeed)}
                  className="w-full sm:w-auto px-4 py-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/40 text-slate-300 hover:text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>Örnek Sesi Dinle</span>
                </button>

              </div>

              {/* Live Speech Feedback Area */}
              {(isListening || spokenTranscript) && (
                <div className="p-4 bg-slate-950 border border-amber-500/30 rounded-2xl space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5">
                      {isListening && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
                      <span>{isListening ? 'Mikrofon Dinliyor...' : 'Algılanan Sesiniz:'}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Almanca (de-DE)</span>
                  </div>

                  <div className="text-base sm:text-lg font-bold text-white font-mono min-h-[32px] flex items-center">
                    {spokenTranscript || <span className="text-slate-600 italic font-sans text-sm">Almanca kelimeyi söyleyin...</span>}
                  </div>

                  {!isListening && spokenTranscript && (
                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEvaluateSpeech()}
                        disabled={isEvaluating}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                      >
                        {isEvaluating ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Yapay Zeka Puanlıyor...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Telaffuzu Puanla & Analiz Et</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 bg-rose-500/15 border border-rose-500/40 text-rose-300 rounded-2xl text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Bilgi</div>
                    <div>{errorMsg}</div>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Preset Practice Phrases Library */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4">
            
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Hazır Pratik Cümleleri & Sınav Kalıpları</span>
              </h3>

              {/* Category Filter Chips */}
              <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-1">
                {[
                  { id: 'all', label: 'Tümü' },
                  { id: 'exam', label: 'Goethe A1 Sınavı 🏆' },
                  { id: 'w_fragen', label: 'W-Fragen (Sorular) ❓' },
                  { id: 'verbs', label: 'Fiil Cümleleri 🇩🇪' },
                  { id: 'dialogue', label: 'Günlük Diyalog 💬' },
                  { id: 'alphabet', label: 'Fonetik & Sesler 🔤' },
                  { id: 'numbers', label: 'Sayılar & Saat 🔢' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      activeCategory === cat.id
                        ? 'bg-amber-500 text-slate-950 font-black shadow'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Phrases Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {filteredPhrases.map((item) => {
                const isSelected = selectedPhrase.toLowerCase() === item.german.toLowerCase();
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectPreset(item)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 group ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-500/10'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div className="space-y-0.5 overflow-hidden">
                      <div className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors truncate">
                        {item.german}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {item.turkish}
                      </div>
                      <div className="text-[10px] text-amber-400 font-mono truncate">
                        {item.phoneticTr}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayTargetAudio(item.german, audioSpeed);
                        }}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-amber-500 text-slate-400 hover:text-slate-950 transition-colors"
                        title="Dinle"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom German Phrase Input Toggle */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Kendi Almanca cümleni yaz (Örn: Ich lerne Deutsch)..."
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500 px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customInput.trim()) {
                      setSelectedPhrase(customInput.trim());
                      setCustomInput('');
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customInput.trim()) {
                      setSelectedPhrase(customInput.trim());
                      setCustomInput('');
                    }
                  }}
                  disabled={!customInput.trim()}
                  className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shrink-0"
                >
                  Uygula
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================
            RIGHT COLUMN (5 cols): AI ASSESSMENT & SCORE CARD
        ======================================================== */}
        <div className="lg:col-span-5 space-y-5">
          
          {assessment ? (
            /* AI Results Card */
            <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/40 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
              
              {/* Score Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                    Goethe A1 Telaffuz Skoru
                  </span>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <span>{assessment.verdict}</span>
                  </h3>
                </div>

                {/* Circular Score Badge */}
                <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black shadow-xl ${
                  assessment.overallScore >= 85 
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30' 
                    : assessment.overallScore >= 65
                    ? 'bg-amber-500 text-slate-950 shadow-amber-500/30'
                    : 'bg-rose-500 text-white shadow-rose-500/30'
                }`}>
                  <span className="text-2xl leading-none">%{assessment.overallScore}</span>
                  <span className="text-[9px] uppercase tracking-wider font-bold">Puan</span>
                </div>
              </div>

              {/* Sub Scores Grid */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <div className="text-[10px] text-slate-400 font-bold">Doğruluk</div>
                  <div className="text-sm font-black text-emerald-400">%{assessment.accuracyScore}</div>
                </div>
                <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <div className="text-[10px] text-slate-400 font-bold">Akıcılık</div>
                  <div className="text-sm font-black text-amber-400">%{assessment.fluencyScore}</div>
                </div>
                <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <div className="text-[10px] text-slate-400 font-bold">Berraklık</div>
                  <div className="text-sm font-black text-indigo-400">%{assessment.clarityScore}</div>
                </div>
              </div>

              {/* Word by Word Interactive Pill Tags */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Kelime Bazlı Telaffuz Değerlendirmesi:</span>
                  <span className="text-[10px] text-slate-500">(Detay için kelimeye tıkla)</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {assessment.wordsFeedback.map((w, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedWordTip(w)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 border ${
                        w.status === 'perfect'
                          ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/60'
                          : w.status === 'good'
                          ? 'bg-amber-950/60 border-amber-500/60 text-amber-300 hover:bg-amber-900/60'
                          : 'bg-rose-950/60 border-rose-500/60 text-rose-300 hover:bg-rose-900/60'
                      }`}
                    >
                      <span>{w.word}</span>
                      <span className="text-[10px] opacity-75">%{w.accuracy}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Word Tip Inspector */}
              {selectedWordTip && (
                <div className="p-3 bg-slate-950 border border-amber-500/40 rounded-2xl space-y-1.5 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300">
                      Kelime: {selectedWordTip.word} ({selectedWordTip.phoneticTarget})
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePlayTargetAudio(selectedWordTip.word, 0.8)}
                      className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Tekrar Dinle</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">
                    {selectedWordTip.tipTr || 'Bu kelimenin telaffuzu kurallara uygundur.'}
                  </p>
                </div>
              )}

              {/* AI Overall Feedback & Coach Advice */}
              <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Eğitmen Görüşü & Fonetik Analiz:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {assessment.overallFeedbackTr}
                </p>

                {assessment.mouthPositionTipTr && (
                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    <strong className="text-amber-300">Ağız ve Nefes Konumu:</strong> {assessment.mouthPositionTipTr}
                  </div>
                )}
              </div>

              {/* Re-try CTA */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={startListening}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-2xl text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Tekrar Konuş & Puanını Yükselt</span>
                </button>
              </div>

            </div>
          ) : (
            /* Standby Guide Card */
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-5 text-center shadow-xl">
              
              <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-3xl shadow-inner">
                🎙️
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">Nasıl Çalışır?</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                  Sol taraftaki hedef Almanca ifadeyi inceleyin, mikrofon butonuna basıp konuşun. Yapay zeka anında sesinizi dinler ve Goethe A1 kriterlerine göre değerlendirir.
                </p>
              </div>

              <div className="space-y-2 text-left text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Harf Harf Analiz:</strong> Ch, Sch, St, Sp, Z sesleri otomatik denetlenir.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Jeton Ödülleri:</strong> %80 üzeri skorda ekstra jeton kazanırsınız.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Doğal Ses Karşılaştırma:</strong> Doğru telaffuzu 0.75x veya 1.0x hızda dinleyebilirsiniz.</span>
                </div>
              </div>

            </div>
          )}

          {/* Previous Practice History */}
          {history.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-amber-400" />
                  <span>Son Konuşma Kayıtlarınız ({history.length})</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setHistory([]);
                    localStorage.removeItem('glotvia_pronunciation_history_v1');
                  }}
                  className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors"
                >
                  Temizle
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {history.slice(0, 6).map((h) => (
                  <div
                    key={h.id}
                    onClick={() => {
                      setSelectedPhrase(h.targetPhrase);
                      setAssessment(h);
                    }}
                    className="p-2.5 bg-slate-950 border border-slate-800/80 hover:border-amber-500/40 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-all group"
                  >
                    <div className="truncate mr-2">
                      <div className="font-bold text-white group-hover:text-amber-300 truncate">{h.targetPhrase}</div>
                      <div className="text-[10px] text-slate-400 truncate">Söylenen: {h.spokenText}</div>
                    </div>
                    <div className={`px-2 py-0.5 rounded-lg text-xs font-black shrink-0 ${
                      h.overallScore >= 80 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      %{h.overallScore}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
