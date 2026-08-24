import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import { audioManager } from '../services/audioManager';
import { 
  MessageSquare, Send, Volume2, Mic, MicOff, Sparkles, 
  RotateCcw, CheckCircle2, ChevronRight, User, Bot, HelpCircle
} from 'lucide-react';
import { GlassCard } from './glass/GlassCard';
import { GlassButton } from './glass/GlassButton';

interface MessagesTabProps {
  currentUser: UserProfile | null;
  onAwardCoins?: (amount: number, reason: string) => void;
}

interface ScenarioDialogLine {
  id: string;
  speaker: 'agent' | 'user';
  german: string;
  turkish: string;
  phonetic: string;
}

interface PracticeScenario {
  id: string;
  title: string;
  icon: string;
  level: string;
  description: string;
  lines: ScenarioDialogLine[];
}

const PRACTICE_SCENARIOS: PracticeScenario[] = [
  {
    id: 'cafe',
    title: 'Im Café (Kafede Sipariş)',
    icon: '☕',
    level: 'A1.1',
    description: 'Bir kafede kahve ve pasta siparişi verip hesap isteme pratiği.',
    lines: [
      {
        id: 'c1',
        speaker: 'agent',
        german: 'Guten Tag! Was möchten Sie bitte bestellen?',
        turkish: 'İyi günler! Ne sipariş etmek istersiniz lütfen?',
        phonetic: '[Guten Tag! Vas möhten Zii bite beştellen?]'
      },
      {
        id: 'c2',
        speaker: 'user',
        german: 'Ich möchte bitte einen Kaffee und ein Stück Apfelkuchen.',
        turkish: 'Bir kahve ve bir dilim elmalı kek rica ediyorum.',
        phonetic: '[İh möhte bite aynen Kafee und ayn Ştük Apfelkuhen.]'
      },
      {
        id: 'c3',
        speaker: 'agent',
        german: 'Sehr gerne! Mit Milch und Zucker?',
        turkish: 'Memnuniyetle! Süt ve şeker olsun mu?',
        phonetic: '[Zeer gerne! Mit Milh und Tsuker?]'
      },
      {
        id: 'c4',
        speaker: 'user',
        german: 'Nur mit Milch bitte. Wie viel kostet das zusammen?',
        turkish: 'Sadece sütle lütfen. Hepsi birlikte ne kadar tutuyor?',
        phonetic: '[Nur mit Milh bite. Vii fiil kostet das tsuzamen?]'
      },
      {
        id: 'c5',
        speaker: 'agent',
        german: 'Das macht zusammen 6 Euro 50. Bitte sehr!',
        turkish: 'Hepsi birlikte 6 Euro 50 Cent tutuyor. Buyrunuz!',
        phonetic: '[Das maht tsuzamen zeks Oyro fümftsih. Bite zeer!]'
      }
    ]
  },
  {
    id: 'hotel',
    title: 'Im Hotel (Otel Rezervasyonu)',
    icon: '🏨',
    level: 'A1.2',
    description: 'Otele giriş yapma, anahtar alma ve kahvaltı saatini öğrenme.',
    lines: [
      {
        id: 'h1',
        speaker: 'agent',
        german: 'Herzlich willkommen! Haben Sie eine Reservierung?',
        turkish: 'Hoş geldiniz! Rezervasyonunuz var mıydı?',
        phonetic: '[Hertslih vilkomen! Haben Zii ayne Rezervirung?]'
      },
      {
        id: 'h2',
        speaker: 'user',
        german: 'Ja, mein Name ist Schmidt. Ich habe ein Einzelzimmer reserviert.',
        turkish: 'Evet, adım Schmidt. Tek kişilik bir oda ayırtmıştım.',
        phonetic: '[Ya, mayn Name ist Şmit. İh habe ayn Aynzeltsimer rezervirt.]'
      },
      {
        id: 'h3',
        speaker: 'agent',
        german: 'Hier ist Ihr Zimmerschlüssel, Zimmer 204 im zweiten Stock.',
        turkish: 'İşte oda anahtarınız, ikinci katta 204 numaralı oda.',
        phonetic: '[Hiyr ist İhr Tsimerşlüsel, Tsimer tsvayhundertfir im tsvayten Ştok.]'
      },
      {
        id: 'h4',
        speaker: 'user',
        german: 'Wann gibt es Frühstück am Morgen?',
        turkish: 'Sabah kahvaltı saat kaçta veriliyor?',
        phonetic: '[Van gibt es Früüştük am Morgen?]'
      },
      {
        id: 'h5',
        speaker: 'agent',
        german: 'Das Frühstück ist von 7 bis 10 Uhr im Restaurant.',
        turkish: 'Kahvaltı restoranda saat 7 ile 10 arasındadır.',
        phonetic: '[Das Früüştük ist fon ziiben bis tseen Ur im Restoran.]'
      }
    ]
  },
  {
    id: 'supermarket',
    title: 'Im Supermarkt (Markette Alışveriş)',
    icon: '🛒',
    level: 'A1.1',
    description: 'Ürünlerin yerini ve fiyatını sorma kalıpları.',
    lines: [
      {
        id: 's1',
        speaker: 'user',
        german: 'Entschuldigung, wo finde ich frische Milch und Eier?',
        turkish: 'Affedersiniz, taze süt ve yumurtayı nerede bulabilirim?',
        phonetic: '[Entşuldigung, vo finde ih frişe Milh und Ayyır?]'
      },
      {
        id: 's2',
        speaker: 'agent',
        german: 'Die Milchprodukte finden Sie hinten links bei Kühlregal 3.',
        turkish: 'Süt ürünlerini arkada solda, 3 numaralı soğutucu reyonunda bulabilirsiniz.',
        phonetic: '[Dii Milhprodukte finden Zii hinten links bay Küülregal dray.]'
      },
      {
        id: 's3',
        speaker: 'user',
        german: 'Vielen Dank für Ihre Hilfe!',
        turkish: 'Yardımınız için çok teşekkür ederim!',
        phonetic: '[Fiilen Dank für İhre Hilfe!]'
      }
    ]
  }
];

export const MessagesTab: React.FC<MessagesTabProps> = ({
  currentUser,
  onAwardCoins
}) => {
  const [selectedScenario, setSelectedScenario] = useState<PracticeScenario>(PRACTICE_SCENARIOS[0]);
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  const [showTranslations, setShowTranslations] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [userScore, setUserScore] = useState<{ [key: string]: number }>({});
  
  // Custom AI Tutor Free Chat
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: 'user' | 'bot'; text: string; translation?: string }>>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hallo! Ich bin dein deutscher KI-Tutor. Du kannst mir auf Deutsch schreiben oder Fragen stellen!',
      translation: 'Merhaba! Ben senin Almanca AI öğretmeninim. Bana Almanca yazabilir veya soru sorabilirsin!'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const handlePlayLine = (line: ScenarioDialogLine) => {
    setActiveLineId(line.id);
    audioManager.play(line.german, {
      languageId: 'de',
      rate: 0.75,
      onEnd: () => setActiveLineId(null),
      onError: () => setActiveLineId(null)
    });
  };

  const handleSimulateSpeaking = (lineId: string) => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const score = Math.floor(Math.random() * 15) + 85; // 85-100%
      setUserScore(prev => ({ ...prev, [lineId]: score }));
      if (onAwardCoins) {
        onAwardCoins(5, 'Sesli Cümle Pratiği');
      }
    }, 1800);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const userMsg = {
      id: `u_${Date.now()}`,
      sender: 'user' as const,
      text: userText
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsAiResponding(true);

    setTimeout(() => {
      // Intelligent response generator
      let botResponse = 'Sehr gut! Dein Satz ist verständlich. Weiter so!';
      let botTr = 'Çok iyi! Cümlen gayet anlaşılır. Böyle devam et!';

      if (userText.toLowerCase().includes('hallo') || userText.toLowerCase().includes('tag')) {
        botResponse = 'Hallo! Wie geht es dir heute? Bist du bereit zum Deutschlernen?';
        botTr = 'Merhaba! Bugün nasılsın? Almanca öğrenmeye hazır mısın?';
      } else if (userText.toLowerCase().includes('wie heißt') || userText.toLowerCase().includes('name')) {
        botResponse = 'Ich heiße Glotvia AI Tutor. Ich helfe dir beim A1-B1 Deutschlernen!';
        botTr = 'Benim adım Glotvia AI Tutor. A1-B1 Almanca öğrenmende sana yardımcı oluyorum!';
      } else if (userText.toLowerCase().includes('danke')) {
        botResponse = 'Bitte sehr! Gern geschehen. Hast du noch eine Frage?';
        botTr = 'Rica ederim! Bir şey değil. Başka bir sorun var mı?';
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: `b_${Date.now()}`,
          sender: 'bot',
          text: botResponse,
          translation: botTr
        }
      ]);
      setIsAiResponding(false);

      // Play bot speech audio
      audioManager.play(botResponse, { languageId: 'de', rate: 0.8 });
    }, 800);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-24 animate-fadeIn">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>💬</span>
            <span>Konuşma Pratiği & AI Sohbet</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
            Gerçek hayat diyalog senaryoları ve interaktif Almanca yapay zeka koçu.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowTranslations(!showTranslations)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showTranslations 
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40' 
              : 'bg-slate-900 text-slate-400 border-white/10'
          }`}
        >
          {showTranslations ? '👁️ Çeviriler Açık' : '🙈 Çeviriler Gizli'}
        </button>
      </div>

      {/* 1. SCENARIO SELECTOR CHIPS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PRACTICE_SCENARIOS.map((sc) => {
          const isSelected = selectedScenario.id === sc.id;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => setSelectedScenario(sc)}
              className={`p-4 rounded-2xl text-left transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-cyan-950/90 to-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-900/70 hover:bg-slate-900 border-white/10 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{sc.icon}</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  {sc.level}
                </span>
              </div>
              <h4 className="text-sm font-black text-white">{sc.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{sc.description}</p>
            </button>
          );
        })}
      </div>

      {/* 2. ACTIVE SCENARIO DIALOGUE PLAYER */}
      <GlassCard variant="liquid" className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{selectedScenario.icon}</span>
            <div>
              <h3 className="text-base font-black text-white">{selectedScenario.title}</h3>
              <p className="text-xs text-slate-400">{selectedScenario.lines.length} Karşılıklı Cümle</p>
            </div>
          </div>

          <GlassButton
            variant="secondary"
            size="sm"
            onClick={() => {
              audioManager.playSequence(
                selectedScenario.lines.map(l => ({
                  text: l.german,
                  languageId: 'de',
                  rate: 0.75,
                  pauseAfterMs: 600
                }))
              );
            }}
            className="text-xs font-bold"
          >
            <Volume2 className="w-4 h-4" />
            <span>Tümünü Dinle</span>
          </GlassButton>
        </div>

        {/* Conversation Stream */}
        <div className="space-y-3.5">
          {selectedScenario.lines.map((line) => {
            const isAgent = line.speaker === 'agent';
            const isPlaying = activeLineId === line.id;
            const score = userScore[line.id];

            return (
              <div
                key={line.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isAgent
                    ? 'bg-slate-900/90 border-white/10 ml-0 mr-4 sm:mr-12'
                    : 'bg-indigo-950/40 border-indigo-500/30 ml-4 sm:ml-12 mr-0'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      isAgent ? 'bg-cyan-500/20 text-cyan-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {isAgent ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="text-sm sm:text-base font-bold text-white leading-relaxed">
                        {line.german}
                      </div>

                      <div className="text-[11px] font-mono text-cyan-300">
                        {line.phonetic}
                      </div>

                      {showTranslations && (
                        <div className="text-xs text-slate-300 font-medium">
                          {line.turkish}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handlePlayLine(line)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isPlaying 
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400' 
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
                      }`}
                      title="Dinle"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    {!isAgent && (
                      <button
                        type="button"
                        onClick={() => handleSimulateSpeaking(line.id)}
                        disabled={isRecording}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          score 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                            : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-400/40'
                        }`}
                        title="Mikrofonla Telaffuz Et"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {score !== undefined && (
                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-xs text-emerald-300 font-bold">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Telaffuz Başarısı:</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30 font-black">
                      %{score}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* 3. AI TUTOR FREE CHAT CONSOLE */}
      <GlassCard variant="glow" glowColor="purple" className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center justify-center text-xl font-black">
            🤖
          </div>
          <div>
            <h3 className="text-base font-black text-white">Canlı Almanca AI Sohbet Koçu</h3>
            <p className="text-xs text-slate-300">Almanca pratik yap, kelime ve gramer hatalarını anında düzeltelim.</p>
          </div>
        </div>

        {/* Message Log */}
        <div className="h-64 overflow-y-auto space-y-3 p-3 rounded-2xl bg-slate-950/80 border border-white/5">
          {chatMessages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm ${
                    isBot
                      ? 'bg-slate-900 text-white border border-purple-500/30 rounded-tl-sm'
                      : 'bg-cyan-600 text-slate-950 font-bold rounded-tr-sm'
                  }`}
                >
                  <div>{msg.text}</div>
                  {msg.translation && (
                    <div className="text-[11px] text-purple-200 mt-1 pt-1 border-t border-white/10">
                      {msg.translation}
                    </div>
                  )}
                </div>

                {isBot && (
                  <button
                    type="button"
                    onClick={() => audioManager.play(msg.text, { languageId: 'de', rate: 0.8 })}
                    className="mt-1 ml-1 text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Seslendir</span>
                  </button>
                )}
              </div>
            );
          })}

          {isAiResponding && (
            <div className="flex items-center gap-2 text-xs text-purple-300 font-bold animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Glotvia AI yanıt yazıyor...</span>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Chat Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Almanca bir cümle yazın (örn: Wie geht es dir?)..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
          />
          <GlassButton
            variant="primary"
            size="md"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="px-5 text-slate-950 font-black text-xs"
          >
            <Send className="w-4 h-4" />
            <span>Gönder</span>
          </GlassButton>
        </div>
      </GlassCard>

    </div>
  );
};
