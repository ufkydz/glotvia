import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage, LanguageId } from '../types';
import { LANGUAGES_LIST } from '../data/languagesData';
import { askGeminiLanguageTutor } from '../services/geminiService';
import { speakText } from '../utils/speechUtils';
import { 
  Bot, Send, Sparkles, Volume2, Mic, MicOff, RotateCcw, 
  Lightbulb, CheckCircle2, Globe2, Loader2, MessageSquare
} from 'lucide-react';

interface AILanguageTutorProps {
  currentUser: UserProfile;
}

const QUICK_PROMPTS = [
  'Bana bu dilde kendimi nasıl tanıtacağımı öğret.',
  'Restoranda sipariş verme diyaloğu yapalım.',
  'Bugün öğrendiğim kelimelerle 2 örnek cümle kur.',
  'En sık yapılan telaffuz hataları nelerdir?'
];

export const AILanguageTutor: React.FC<AILanguageTutorProps> = ({
  currentUser
}) => {
  const targetLang = LANGUAGES_LIST.find(l => l.id === currentUser.targetLanguage) || LANGUAGES_LIST[0];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_msg',
      sender: 'ai',
      text: `${targetLang.greeting} Ben senin yapay zeka destekli ${targetLang.name} öğretmeninim!`,
      translation: `Merhaba! Ben senin yapay zeka destekli ${targetLang.name} öğretmeninim. Bana dilediğin soruyu sorabilir veya karşılıklı sohbet edebilirsin.`,
      phonetic: targetLang.greetingPhonetic,
      grammarTip: `${targetLang.name} dilinde her gün 5 dakika pratik yapmak öğrenme hızını 3 kat artırır.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const aiResponse = await askGeminiLanguageTutor(text, currentUser.targetLanguage, currentUser.stats.level);
      
      const aiMsg: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: aiResponse.reply,
        translation: aiResponse.translationTr,
        phonetic: aiResponse.phonetic,
        grammarTip: aiResponse.grammarTip,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error('Chat error', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeechInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Tarayıcınız ses tanımayı desteklemiyor. Lütfen klavye ile yazınız.');
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRec();
    recognition.lang = 'tr-TR';
    recognition.interimResults = false;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const handlePlayAudio = (text: string) => {
    speakText(text, currentUser.targetLanguage);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-2xl text-amber-400">
            <Bot className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>{targetLang.flag} Gemini {targetLang.name} AI Öğretmeni</span>
            </h2>
            <p className="text-xs text-slate-400">
              Soru sorun, cümlelerinizi düzelttirin veya serbest konuşma pratiği yapın.
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([])}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          title="Sohbeti Temizle"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Temizle</span>
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 min-h-[450px] max-h-[550px] overflow-y-auto space-y-4 shadow-2xl">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-3xl p-4 sm:p-5 space-y-2 shadow-lg ${
                  isUser
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-white rounded-tl-none'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between gap-4 text-[10px] opacity-70">
                  <span className="font-black uppercase tracking-wider">
                    {isUser ? 'Sen' : `Gemini AI (${targetLang.name})`}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Main Text */}
                <div className="text-sm sm:text-base font-semibold leading-relaxed">
                  {msg.text}
                </div>

                {/* AI Extras: Phonetic, Audio, Translation & Grammar Tip */}
                {!isUser && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    {msg.phonetic && (
                      <div className="text-xs font-bold text-amber-400 font-mono flex items-center justify-between">
                        <span>{msg.phonetic}</span>
                        <button
                          onClick={() => handlePlayAudio(msg.text)}
                          className="p-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-lg transition-transform active:scale-95"
                          title="Sesli Telaffuz Dinle"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {msg.translation && (
                      <div className="text-xs text-slate-400 italic bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
                        {msg.translation}
                      </div>
                    )}

                    {msg.grammarTip && (
                      <div className="text-xs text-emerald-300 font-medium bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/30 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{msg.grammarTip}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs p-4 bg-slate-950 border border-slate-800 rounded-2xl w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <span>Gemini AI yanıtı ve gramer analizi hazırlıyor...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
        className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-xl"
      >
        <button
          type="button"
          onClick={handleSpeechInput}
          className={`p-3 rounded-xl transition-all ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
          }`}
          title="Sesle Yazdır"
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          placeholder={`${targetLang.name} veya Türkçe mesajınızı yazın...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none font-medium"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 disabled:opacity-50 text-slate-950 font-black rounded-xl transition-all shadow-md"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

    </div>
  );
};
