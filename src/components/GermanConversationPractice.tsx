import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Mic, MicOff, Volume2, Sparkles, Send, RotateCcw,
  CheckCircle2, AlertCircle, HelpCircle, ArrowRight, ShieldCheck, Zap,
  Snail, Play, Award, RefreshCw, User, Bot, CornerDownRight
} from 'lucide-react';
import { playGermanText, stopGermanSpeech, SpeechSpeedMode } from '../services/germanTtsService';
import {
  germanSpeechRecognizer,
  SpeechRecognitionErrorCode
} from '../services/germanSpeechRecognitionService';
import { evaluateGermanPronunciation } from '../services/germanPronunciationEvaluator';
import { askGeminiLanguageTutor } from '../services/geminiService';
import { playCoinSound, playSuccessChime } from '../utils/audioEffects';
import { GlassCard } from './glass/GlassCard';
import { GlassButton } from './glass/GlassButton';
import { GlassIconButton } from './glass/GlassIconButton';
import { AiVoiceOrb } from './glass/AiVoiceOrb';

export interface ConversationTurn {
  id: string;
  sender: 'ai' | 'user';
  germanText: string;
  translationTr?: string;
  phoneticTr?: string;
  grammarTip?: string;
  feedback?: {
    grammarEvaluationTr: string;
    vocabularyTipTr?: string;
    pronunciationScore: number;
    naturalAlternativeDe?: string;
    naturalAlternativeTr?: string;
  };
  timestamp: string;
}

interface ScenarioTemplate {
  id: string;
  title: string;
  level: string;
  description: string;
  initialAiPrompt: string;
  initialTranslationTr: string;
  initialPhoneticTr: string;
  suggestedUserReplies: string[];
}

const CONVERSATION_SCENARIOS: ScenarioTemplate[] = [
  {
    id: 'kennenlernen',
    title: '1. Tanışma & Selamlaşma',
    level: 'A1.1',
    description: 'İlk karşılaşmada selamlaşma, isim ve nereden geldiğini söyleme.',
    initialAiPrompt: 'Hallo! Wie geht es dir? Wie heißt du?',
    initialTranslationTr: 'Merhaba! Nasılsın? Adın ne?',
    initialPhoneticTr: '[hal-lo! vi get es dir? vi hayst du?]',
    suggestedUserReplies: [
      'Hallo! Mir geht es gut, danke. Ich heiße Ahmet.',
      'Guten Tag! Es geht mir super. Ich komme aus der Türkei.',
      'Mir geht es gut. Und wie geht es Ihnen?'
    ]
  },
  {
    id: 'im_cafe',
    title: '2. Kafe & Restoranda Sipariş',
    level: 'A1.2',
    description: 'Garsonla konuşma, içecek veya yiyecek siparişi verme ve hesap isteme.',
    initialAiPrompt: 'Guten Tag! Was möchten Sie bitte bestellen?',
    initialTranslationTr: 'İyi günler! Ne sipariş etmek istersiniz lütfen?',
    initialPhoneticTr: '[gu-tın tag! vas möh-tın zi bit-tı be-ştel-lın?]',
    suggestedUserReplies: [
      'Ich möchte bitte einen Kaffee und ein Wasser.',
      'Ich hätte gerne ein Stück Apfelkuchen.',
      'Was kostet ein Cappuccino bitte?'
    ]
  },
  {
    id: 'einkaufen',
    title: '3. Süpermarket & Alışveriş',
    level: 'A1.2',
    description: 'Ürünlerin yerini sorma, fiyat öğrenme ve miktar belirtme.',
    initialAiPrompt: 'Kann ich Ihnen helfen? Suchen Sie etwas Bestimmtes?',
    initialTranslationTr: 'Size yardımcı olabilir miyim? Belirli bir şey mi arıyorsunuz?',
    initialPhoneticTr: '[kan ih i-nın hel-fın? zu-hın zi et-vas be-ştim-tıs?]',
    suggestedUserReplies: [
      'Ja bitte, wo finde ich Milch und Brot?',
      'Wie viel kostet ein Kilo Äpfel?',
      'Nein danke, ich schaue mich nur um.'
    ]
  },
  {
    id: 'freizeit_hobbys',
    title: '4. Boş Zaman & Hobiler',
    level: 'A1.3',
    description: 'Hafta sonu planları, spor ve sevilen aktiviteler hakkında sohbet.',
    initialAiPrompt: 'Was machst du gerne in deiner Freizeit?',
    initialTranslationTr: 'Boş zamanlarında ne yapmaktan hoşlanırsın?',
    initialPhoneticTr: '[vas mahst du ger-nı in day-nır fray-tsayt?]',
    suggestedUserReplies: [
      'In meiner Freizeit spiele ich gerne Fußball und lese Bücher.',
      'Ich treffe mich am Wochenende gerne mit Freunden.',
      'Ich lerne jeden Tag Deutsch und höre Musik.'
    ]
  },
  {
    id: 'weg_fragen',
    title: '5. Şehirde Yol Tarifi',
    level: 'A1.3',
    description: 'İstasyon veya otobüs durağına nasıl gidileceğini sorma.',
    initialAiPrompt: 'Entschuldigung, kann ich Ihnen den Weg zeigen?',
    initialTranslationTr: 'Affedersiniz, size yolu gösterebilir miyim?',
    initialPhoneticTr: '[ent-şul-di-gung, kan ih i-nın den veg tsay-gın?]',
    suggestedUserReplies: [
      'Ja bitte! Wo ist der Hauptbahnhof?',
      'Wie komme ich zur nächsten Apotheke?',
      'Ist die Bushaltestelle weit von hier?'
    ]
  }
];

interface GermanConversationPracticeProps {
  onAwardCoins?: (amount: number, reason: string) => void;
}

export const GermanConversationPractice: React.FC<GermanConversationPracticeProps> = ({
  onAwardCoins
}) => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioTemplate>(CONVERSATION_SCENARIOS[0]);
  const [messages, setMessages] = useState<ConversationTurn[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [playingTurnId, setPlayingTurnId] = useState<string | null>(null);
  const [speedMode, setSpeedMode] = useState<SpeechSpeedMode>('normal');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize scenario dialogue
  useEffect(() => {
    setMessages([
      {
        id: 'turn_0',
        sender: 'ai',
        germanText: selectedScenario.initialAiPrompt,
        translationTr: selectedScenario.initialTranslationTr,
        phoneticTr: selectedScenario.initialPhoneticTr,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    stopGermanSpeech();
    germanSpeechRecognizer.stop();
  }, [selectedScenario]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiResponding]);

  const handlePlayAudio = async (text: string, turnId: string) => {
    try {
      setPlayingTurnId(turnId);
      await playGermanText(text, { speedMode });
    } finally {
      setPlayingTurnId(null);
    }
  };

  const handleStartMicInput = async () => {
    setErrorMessage(null);
    setInterimText('');

    const started = await germanSpeechRecognizer.start({
      onStart: () => {
        setIsListening(true);
      },
      onInterimResult: (transcript) => {
        setInterimText(transcript);
      },
      onFinalResult: (res) => {
        setIsListening(false);
        setInterimText('');
        if (res.transcript.trim()) {
          handleSendUserMessage(res.transcript.trim());
        }
      },
      onError: (code: SpeechRecognitionErrorCode, msg: string) => {
        setIsListening(false);
        setErrorMessage(msg);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });

    if (!started && !errorMessage) {
      setIsListening(false);
    }
  };

  const handleStopMicInput = () => {
    germanSpeechRecognizer.stop();
    setIsListening(false);
  };

  const handleSendUserMessage = async (textToSend: string) => {
    const cleanUserText = textToSend.trim();
    if (!cleanUserText || isAiResponding) return;

    // Evaluate user speech
    const evalRes = evaluateGermanPronunciation(cleanUserText, cleanUserText);

    // Rule-based or AI grammar feedback
    const grammarFeedback = generateGrammarFeedback(cleanUserText);

    const userTurn: ConversationTurn = {
      id: `turn_user_${Date.now()}`,
      sender: 'user',
      germanText: cleanUserText,
      feedback: {
        grammarEvaluationTr: grammarFeedback.explanationTr,
        vocabularyTipTr: grammarFeedback.vocabTip,
        pronunciationScore: evalRes.score || 85,
        naturalAlternativeDe: grammarFeedback.naturalDe,
        naturalAlternativeTr: grammarFeedback.naturalTr
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userTurn]);
    setInputText('');
    setIsAiResponding(true);

    // Award bonus
    if (onAwardCoins) {
      onAwardCoins(5, 'Konuşma Pratiği Katılımı');
    }

    try {
      // Fetch AI response (Gemini API or offline dialogue fallback)
      const aiReply = await askGeminiLanguageTutor(cleanUserText, 'de', 1);

      const aiTurn: ConversationTurn = {
        id: `turn_ai_${Date.now()}`,
        sender: 'ai',
        germanText: aiReply.reply,
        translationTr: aiReply.translationTr,
        phoneticTr: aiReply.phonetic,
        grammarTip: aiReply.grammarTip,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiTurn]);

      // Automatically speak AI reply
      playGermanText(aiReply.reply, { speedMode });
    } catch (e) {
      console.warn('AI conversation turn fallback', e);
    } finally {
      setIsAiResponding(false);
    }
  };

  // Helper function to provide rich grammar & naturalness feedback
  const generateGrammarFeedback = (text: string) => {
    const lower = text.toLowerCase();

    if (lower.includes('ich bin') || lower.includes('ich heiße')) {
      return {
        explanationTr: "Cümlenizde özne-yüklem uyumu ('Ich bin...' / 'Ich heiße...') gayet başarılı.",
        vocabTip: "Almanca'da isim cümlelerinde fiil her zaman 2. pozisyondadır.",
        naturalDe: text.charAt(0).toUpperCase() + text.slice(1),
        naturalTr: "Gayet doğal bir kendini tanıtma cümlesi."
      };
    }

    if (lower.includes('möchte') || lower.includes('hätte gern')) {
      return {
        explanationTr: "'Möchte' ve 'hätte gern' kibar sipariş ve istek bildiren en doğal A1 kalıplarıdır.",
        vocabTip: "İsimlerin artikellerine dikkat edin (der Kaffee -> einen Kaffee [Akkusativ]).",
        naturalDe: text.charAt(0).toUpperCase() + text.slice(1),
        naturalTr: "Nezaket kurallarına uygun mükemmel bir ifade."
      };
    }

    return {
      explanationTr: "Cümleniz anlaşılır ve bağlama uygun bir yanıt oluşturuyor.",
      vocabTip: "Cümle başında büyük harf ve fiil çekimlerine dikkat ediniz.",
      naturalDe: text.charAt(0).toUpperCase() + text.slice(1),
      naturalTr: "Doğal Almanca iletişim ifadesi."
    };
  };

  return (
    <div className="w-full flex flex-col gap-5 text-slate-100 animate-fadeIn">
      
      {/* Top Scenario Selector Glass Card */}
      <GlassCard variant="elevated" className="p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Almanca Sesli Konuşma Pratiği
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  AI & Cihaz Üzeri
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Mikrofon ile Almanca cevap verin; dilbilgisi, kelime ve telaffuz koçluğundan anında yararlanın.
              </p>
            </div>
          </div>

          {/* Speed Selector Toggle */}
          <div className="flex items-center gap-1 bg-slate-950/80 border border-white/10 rounded-2xl p-1 backdrop-blur-md">
            <button
              onClick={() => setSpeedMode('normal')}
              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${
                speedMode === 'normal'
                  ? 'glass-btn-primary text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Normal Ses
            </button>
            <button
              onClick={() => setSpeedMode('slow')}
              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${
                speedMode === 'slow'
                  ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Snail className="w-3.5 h-3.5" />
              Yavaş Ses
            </button>
          </div>
        </div>

        {/* Scenario Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CONVERSATION_SCENARIOS.map((sc) => {
            const isSelected = sc.id === selectedScenario.id;
            return (
              <button
                key={sc.id}
                onClick={() => setSelectedScenario(sc)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border transition-all active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'glass-btn-primary text-white'
                    : 'bg-slate-900/60 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>{sc.title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-cyan-200">
                  {sc.level}
                </span>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Main Conversation Stream with Glass Surface */}
      <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 sm:p-6 flex flex-col gap-4 min-h-[420px] max-h-[560px] overflow-y-auto shadow-2xl relative">
        {messages.map((turn) => {
          const isAi = turn.sender === 'ai';
          const isPlaying = playingTurnId === turn.id;

          return (
            <div
              key={turn.id}
              className={`flex flex-col gap-2 max-w-[90%] sm:max-w-[80%] ${
                isAi ? 'self-start items-start' : 'self-end items-end'
              }`}
            >
              {/* Sender Header */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                {isAi ? (
                  <>
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center font-bold text-[10px]">
                      AI
                    </div>
                    <span className="font-semibold text-slate-300">Almanca Koçu</span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-slate-300">Sen</span>
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center font-bold text-[10px]">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  </>
                )}
                <span className="text-[10px] opacity-60">{turn.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`relative rounded-3xl p-4 sm:p-5 flex flex-col gap-2 shadow-lg backdrop-blur-xl border ${
                  isAi
                    ? 'bg-slate-900/80 border-cyan-500/25 text-slate-100 rounded-tl-sm'
                    : 'bg-gradient-to-br from-cyan-600/90 via-blue-600/90 to-indigo-600/90 border-white/20 text-white rounded-tr-sm shadow-cyan-950/40'
                }`}
              >
                <div className="text-base sm:text-lg font-bold tracking-tight">
                  {turn.germanText}
                </div>

                {turn.phoneticTr && (
                  <div className="text-xs font-mono text-cyan-200">
                    {turn.phoneticTr}
                  </div>
                )}

                {turn.translationTr && (
                  <div className="text-xs text-slate-200/90 border-t border-white/10 pt-2 mt-1">
                    🇹🇷 {turn.translationTr}
                  </div>
                )}

                {/* Audio Button */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => handlePlayAudio(turn.germanText, turn.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isPlaying
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/40 animate-pulse'
                        : isAi
                        ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30'
                        : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isPlaying ? 'Dinleniyor...' : '🔊 Dinle'}</span>
                  </button>

                  {turn.feedback?.pronunciationScore !== undefined && (
                    <div className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-400/30 text-emerald-300">
                      <span>🎯 Telaffuz:</span>
                      <span>{turn.feedback.pronunciationScore}/100</span>
                    </div>
                  )}
                </div>
              </div>

              {/* User Grammar & Naturalness Feedback Drawer */}
              {turn.feedback && (
                <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-3.5 text-xs flex flex-col gap-2 w-full backdrop-blur-xl animate-fadeIn">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Dilbilgisi & Telaffuz Değerlendirmesi:
                  </div>
                  <p className="text-slate-300">
                    {turn.feedback.grammarEvaluationTr}
                  </p>
                  {turn.feedback.vocabularyTipTr && (
                    <div className="text-slate-400 text-[11px]">
                      💡 {turn.feedback.vocabularyTipTr}
                    </div>
                  )}
                  {turn.feedback.naturalAlternativeDe && (
                    <div className="bg-slate-950/70 border border-white/10 rounded-xl p-2.5 text-[11px] text-cyan-300 flex items-start gap-1.5">
                      <CornerDownRight className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-200">Önerilen Doğal İfade: </span>
                        <span>"{turn.feedback.naturalAlternativeDe}"</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {isAiResponding && (
          <div className="self-start flex items-center gap-2 bg-slate-900/80 border border-cyan-500/30 px-4 py-3 rounded-2xl text-xs text-cyan-300 animate-pulse backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Almanca Koçu yanıt hazırlıyor...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggested Answers */}
      {selectedScenario.suggestedUserReplies.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-slate-400 font-semibold">Örnek Yanıt Kalıpları (Dokunarak Söyleyebilirsiniz):</span>
          <div className="flex flex-wrap gap-2">
            {selectedScenario.suggestedUserReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => handleSendUserMessage(reply)}
                className="text-xs px-3.5 py-2 rounded-xl bg-slate-900/70 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all backdrop-blur-md cursor-pointer active:scale-95"
              >
                💬 "{reply}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interactive AI Voice Orb & Input Action Area */}
      <GlassCard variant="elevated" className="p-4 sm:p-5 flex flex-col gap-4">
        {/* Centered Voice Orb */}
        <div className="flex items-center justify-center py-2">
          <AiVoiceOrb
            size="md"
            state={isListening ? 'listening' : isAiResponding ? 'processing' : 'idle'}
            onClick={isListening ? handleStopMicInput : handleStartMicInput}
            label={isListening ? 'Dinleniyor... Konuşun (Durdurmak için dokunun)' : isAiResponding ? 'AI Yanıtı Üretiliyor...' : 'Mikrofona Dokunup Konuşun'}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Microphone Action Button */}
          {isListening ? (
            <button
              onClick={handleStopMicInput}
              className="px-4 py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-950/60 animate-pulse cursor-pointer shrink-0"
            >
              <MicOff className="w-4 h-4" />
              <span>Durdur</span>
            </button>
          ) : (
            <button
              onClick={handleStartMicInput}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <Mic className="w-4 h-4" />
              <span>🎤 Konuş</span>
            </button>
          )}

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendUserMessage(inputText);
              }
            }}
            placeholder={isListening ? '🎙️ Konuşmanız dinleniyor...' : 'Almanca yanıtınızı yazın veya mikrofonla söyleyin...'}
            className="flex-1 glass-input-field rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSendUserMessage(inputText)}
            disabled={!inputText.trim() || isAiResponding}
            className="p-3 rounded-2xl glass-btn-primary disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-lg shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer shrink-0"
            aria-label="Gönder"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Interim Speech Stream */}
        {interimText && (
          <div className="text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-3.5 py-2 rounded-xl backdrop-blur-md">
            🎙️ "{interimText}"
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="text-xs text-rose-300 bg-rose-950/40 border border-rose-500/30 p-2.5 rounded-xl flex items-center gap-2 backdrop-blur-md">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </GlassCard>

    </div>
  );
};
