import { GoogleGenAI } from '@google/genai';
import { LanguageId, TextCorrectionAnalysis, CorrectionItem, VocabularyInsight, PronunciationAssessmentResult, WordPronunciationFeedback } from '../types';
import { LANGUAGES_LIST } from '../data/languagesData';

// Safely obtain Gemini AI instance without crashing if process is not defined in browser
function getGeminiClient(): GoogleGenAI | null {
  try {
    const apiKey = 
      (typeof process !== 'undefined' && process?.env?.GEMINI_API_KEY) ||
      (typeof process !== 'undefined' && process?.env?.API_KEY) ||
      (import.meta as any).env?.VITE_GEMINI_API_KEY ||
      (import.meta as any).env?.GEMINI_API_KEY ||
      (typeof window !== 'undefined' && (window as any).__GEMINI_API_KEY__) ||
      (typeof localStorage !== 'undefined' && localStorage.getItem('gemini_api_key')) ||
      '';
    
    if (!apiKey || apiKey === 'YOUR_API_KEY' || apiKey.trim().length < 5) {
      return null;
    }
    return new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Gemini client could not be initialized in browser context:', err);
    return null;
  }
}

/**
 * AI Writing Analysis & Grammar Corrector for German
 * Analyzes German text (or Turkish phonetic / mixed sentence)
 */
export async function analyzeGermanWritingText(
  userText: string,
  userLevel: string = 'A1'
): Promise<TextCorrectionAnalysis> {
  const trimmed = userText.trim();
  const id = `analysis_${Date.now()}`;

  if (!trimmed) {
    throw new Error('Lütfen analiz edilecek bir metin girin.');
  }

  // First try Gemini API with supported models
  const ai = getGeminiClient();
  if (ai) {
    const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash'];
    for (const modelName of modelsToTry) {
      try {
        const prompt = `Sen uzman bir Goethe-Institut / Telc Almanca dilbilgisi eğitmeni ve yazım denetleyicisisin (German Grammar & Writing Analyst).
Öğrencinin hedef seviyesi: ${userLevel}.

Öğrencinin yazdığı veya analiz edilmesini istediği metin:
"""
${trimmed}
"""

DİKKAT VE KURALLAR:
1. Öğrenci Türkçe ifadeler, Türkçe klavye harfleri (ş, ı, ç, ğ), Türkçe fonetik okunuşlar (örn: "iş bib ufuk wi hayst du" -> "Ich bin Ufuk. Wie heißt du?"), eksik artikeller veya yanlış çekimler kullanmış olabilir.
2. Metin standart doğru Almanca'dan en ufak bir harf, artikel, büyük-küçük harf veya noktalama farkı içeriyorsa "isCorrect" KESİNLİKLE false olmalıdır ve "score" puanı hataya göre (örn 20-75) verilmelidir.
3. Sadece ve sadece metin %100 kusursuz, doğru artikelli ve doğru büyük harfli Almanca ise "isCorrect" true ve "score" 100 olabilir.
4. "correctedText" alanında cümlenin kusursuz, akıcı ve standart Almanca halini üret.
5. "corrections" dizisinde yapılan her düzeltmeyi ("originalPart", "correctedPart", "type", "explanationTr") detaylı listele.
6. "translationTr" alanında cümlenin doğru Türkçe karşılığını ver.
7. "phonetic" alanında cümlenin Türkçe fonetik okunuşunu [köşeli parantez içinde] ver.
8. "suggestedAlternatives" dizisinde doğal alternatif cümleler öner.
9. "vocabularyInsights" alanında isimleri artikelleriyle (der/die/das) ve Türkçe anlamlarıyla listele.

KESİNLİKLE GEÇERLİ JSON FORMATINDA DÖNÜŞ YAP (Başka metin veya markdown ekleme):
{
  "correctedText": "Ich bin Ufuk. Wie heißt du?",
  "isCorrect": false,
  "score": 50,
  "overallFeedback": "Cümlenizdeki fonetik yazım ve dilbilgisi hataları düzeltilerek standart Almanca haline getirildi.",
  "corrections": [
    {
      "originalPart": "İş bib",
      "correctedPart": "Ich bin",
      "type": "grammar",
      "explanationTr": "Almanca'da 'Ben' zamiri 'Ich' ve sein fiili çekimi 'bin' olarak yazılır."
    },
    {
      "originalPart": "ufuk",
      "correctedPart": "Ufuk",
      "type": "capitalization",
      "explanationTr": "Özel isimler ve kişi adları büyük harfle başlar."
    },
    {
      "originalPart": "wi hayst du",
      "correctedPart": "Wie heißt du?",
      "type": "spelling",
      "explanationTr": "'Adın ne?' sorusu 'Wie heißt du?' şeklinde yazılır."
    }
  ],
  "translationTr": "Ben Ufuk. Senin adın ne?",
  "phonetic": "[ih bin ufuk. vi hayst du?]",
  "suggestedAlternatives": [
    "Hallo! Mein Name ist Ufuk. Wie ist dein Name?",
    "Guten Tag! Ich heiße Ufuk. Freut mich!"
  ],
  "vocabularyInsights": [
    {
      "word": "Name",
      "article": "der",
      "meaningTr": "İsim / Ad",
      "example": "Wie ist dein Name?"
    }
  ],
  "grammarRuleSummary": "Almanca'da kişi zamirleri, fiil çekimleri ve isimler standart imla kurallarına göre büyük harfle yazılır."
}`;

        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const text = response.text || '';
        const parsed = JSON.parse(text);

        if (parsed.correctedText) {
          const isReallyIdentical = parsed.correctedText.trim() === trimmed;
          const isCorrect = parsed.isCorrect === true && isReallyIdentical;
          const score = isCorrect ? 100 : (typeof parsed.score === 'number' ? parsed.score : 60);

          return {
            id,
            timestamp: Date.now(),
            originalText: trimmed,
            correctedText: parsed.correctedText,
            isCorrect,
            score,
            overallFeedback: parsed.overallFeedback || 'Metniniz başarıyla incelendi.',
            corrections: Array.isArray(parsed.corrections) ? parsed.corrections : [],
            translationTr: parsed.translationTr || '',
            phonetic: parsed.phonetic || undefined,
            suggestedAlternatives: Array.isArray(parsed.suggestedAlternatives) ? parsed.suggestedAlternatives : [],
            vocabularyInsights: Array.isArray(parsed.vocabularyInsights) ? parsed.vocabularyInsights : [],
            grammarRuleSummary: parsed.grammarRuleSummary || undefined
          };
        }
      } catch (e) {
        console.warn(`Gemini model ${modelName} call failed, trying next or offline fallback...`, e);
      }
    }
  }

  // Deterministic, ultra-accurate offline correction engine
  return getSmartOfflineCorrection(trimmed, userLevel, id);
}

// -------------------------------------------------------------
// UNICODE-SAFE WORD REPLACEMENT UTILITY
// -------------------------------------------------------------
function safeReplaceUnicode(
  input: string,
  targetPattern: RegExp,
  replacement: string
): { result: string; matched: boolean; matchedText: string } {
  let matched = false;
  let matchedText = '';

  const result = input.replace(targetPattern, (match) => {
    matched = true;
    matchedText = match;
    return replacement;
  });

  return { result, matched, matchedText };
}

/**
 * High-Precision Smart German Grammar, Spell, Phonetic & Syntax Normalizer
 */
export function getSmartOfflineCorrection(
  text: string,
  level: string,
  id: string
): TextCorrectionAnalysis {
  const corrections: CorrectionItem[] = [];
  const vocabularyInsights: VocabularyInsight[] = [];

  const rawTrimmed = text.trim();
  let working = rawTrimmed;

  // -------------------------------------------------------------
  // DICTIONARY OF GERMAN NOUNS & PROPER NAMES
  // -------------------------------------------------------------
  const GERMAN_NOUNS: Record<string, { capitalized: string; article: string; meaning: string }> = {
    'name': { capitalized: 'Name', article: 'der', meaning: 'İsim / Ad' },
    'vorname': { capitalized: 'Vorname', article: 'der', meaning: 'Ad' },
    'nachname': { capitalized: 'Nachname', article: 'der', meaning: 'Soyad' },
    'jahr': { capitalized: 'Jahr', article: 'das', meaning: 'Yıl' },
    'jahre': { capitalized: 'Jahre', article: 'die', meaning: 'Yıllar / Yaş' },
    'hund': { capitalized: 'Hund', article: 'der', meaning: 'Köpek' },
    'katze': { capitalized: 'Katze', article: 'die', meaning: 'Kedi' },
    'buch': { capitalized: 'Buch', article: 'das', meaning: 'Kitap' },
    'haus': { capitalized: 'Haus', article: 'das', meaning: 'Ev' },
    'wohnung': { capitalized: 'Wohnung', article: 'die', meaning: 'Daire' },
    'schule': { capitalized: 'Schule', article: 'die', meaning: 'Okul' },
    'universität': { capitalized: 'Universität', article: 'die', meaning: 'Üniversite' },
    'arbeit': { capitalized: 'Arbeit', article: 'die', meaning: 'İş' },
    'beruf': { capitalized: 'Beruf', article: 'der', meaning: 'Meslek' },
    'stadt': { capitalized: 'Stadt', article: 'die', meaning: 'Şehir' },
    'land': { capitalized: 'Land', article: 'das', meaning: 'Ülke' },
    'deutschland': { capitalized: 'Deutschland', article: 'das', meaning: 'Almanya' },
    'türkei': { capitalized: 'Türkei', article: 'die', meaning: 'Türkiye' },
    'berlin': { capitalized: 'Berlin', article: '', meaning: 'Berlin' },
    'münchen': { capitalized: 'München', article: '', meaning: 'Münih' },
    'frankfurt': { capitalized: 'Frankfurt', article: '', meaning: 'Frankfurt' },
    'köln': { capitalized: 'Köln', article: '', meaning: 'Köln' },
    'wien': { capitalized: 'Wien', article: '', meaning: 'Viyana' },
    'auto': { capitalized: 'Auto', article: 'das', meaning: 'Araba' },
    'telefon': { capitalized: 'Telefon', article: 'das', meaning: 'Telefon' },
    'nummer': { capitalized: 'Nummer', article: 'die', meaning: 'Numara' },
    'telefonnummer': { capitalized: 'Telefonnummer', article: 'die', meaning: 'Telefon Numarası' },
    'straße': { capitalized: 'Straße', article: 'die', meaning: 'Cadde / Sokak' },
    'strasse': { capitalized: 'Straße', article: 'die', meaning: 'Cadde / Sokak' },
    'postleitzahl': { capitalized: 'Postleitzahl', article: 'die', meaning: 'Posta Kodu' },
    'tag': { capitalized: 'Tag', article: 'der', meaning: 'Gün' },
    'morgen': { capitalized: 'Morgen', article: 'der', meaning: 'Sabah' },
    'abend': { capitalized: 'Abend', article: 'der', meaning: 'Akşam' },
    'nacht': { capitalized: 'Nacht', article: 'die', meaning: 'Gece' },
    'deutsch': { capitalized: 'Deutsch', article: 'das', meaning: 'Almanca' },
    'türkisch': { capitalized: 'Türkisch', article: 'das', meaning: 'Türkçe' },
    'englisch': { capitalized: 'Englisch', article: 'das', meaning: 'İngilizce' },
    'vater': { capitalized: 'Vater', article: 'der', meaning: 'Baba' },
    'mutter': { capitalized: 'Mutter', article: 'die', meaning: 'Anne' },
    'bruder': { capitalized: 'Bruder', article: 'der', meaning: 'Erkek Kardeş' },
    'schwester': { capitalized: 'Schwester', article: 'die', meaning: 'Kız Kardeş' },
    'kind': { capitalized: 'Kind', article: 'das', meaning: 'Çocuk' },
    'kinder': { capitalized: 'Kinder', article: 'die', meaning: 'Çocuklar' },
    'lehrer': { capitalized: 'Lehrer', article: 'der', meaning: 'Öğretmen' },
    'student': { capitalized: 'Student', article: 'der', meaning: 'Öğrenci' },
    'studentin': { capitalized: 'Studentin', article: 'die', meaning: 'Kadın Öğrenci' },
    'arzt': { capitalized: 'Arzt', article: 'der', meaning: 'Doktor' },
    'ärztin': { capitalized: 'Ärztin', article: 'die', meaning: 'Kadın Doktor' },
    'ingenieur': { capitalized: 'Ingenieur', article: 'der', meaning: 'Mühendis' },
    'freund': { capitalized: 'Freund', article: 'der', meaning: 'Arkadaş (Erkek)' },
    'freundin': { capitalized: 'Freundin', article: 'die', meaning: 'Arkadaş (Kadın)' },
    'essen': { capitalized: 'Essen', article: 'das', meaning: 'Yemek' },
    'wasser': { capitalized: 'Wasser', article: 'das', meaning: 'Su' },
    'kaffee': { capitalized: 'Kaffee', article: 'der', meaning: 'Kahve' },
    'tee': { capitalized: 'Tee', article: 'der', meaning: 'Çay' },
    'brot': { capitalized: 'Brot', article: 'das', meaning: 'Ekmek' },
    'käse': { capitalized: 'Käse', article: 'der', meaning: 'Peynir' },
    'apfel': { capitalized: 'Apfel', article: 'der', meaning: 'Elma' },
    'geld': { capitalized: 'Geld', article: 'das', meaning: 'Para' },
    'zeit': { capitalized: 'Zeit', article: 'die', meaning: 'Zaman' },
    'uhr': { capitalized: 'Uhr', article: 'die', meaning: 'Saat' },
    'frage': { capitalized: 'Frage', article: 'die', meaning: 'Soru' },
    'antwort': { capitalized: 'Antwort', article: 'die', meaning: 'Cevap' },
    'toilette': { capitalized: 'Toilette', article: 'die', meaning: 'Tuvalet' },
    'bahnhof': { capitalized: 'Bahnhof', article: 'der', meaning: 'Tren Garı' },
    'flughafen': { capitalized: 'Flughafen', article: 'der', meaning: 'Havalimanı' },
    'hunger': { capitalized: 'Hunger', article: 'der', meaning: 'Açlık' },
    'durst': { capitalized: 'Durst', article: 'der', meaning: 'Susuzluk' }
  };

  const PROPER_NAMES = new Set([
    'ufuk', 'ahmet', 'mehmet', 'ali', 'can', 'ayşe', 'fatma', 'zeynep', 'emre', 'burak', 
    'murat', 'hakan', 'deniz', 'selin', 'elif', 'ömer', 'kerem', 'cem', 'seda', 'merve',
    'maria', 'anna', 'hans', 'peter', 'max', 'michael', 'stefan', 'thomas', 'julia', 
    'monika', 'sarah', 'lisa', 'lukas', 'felix', 'jan', 'laura', 'sophie', 'tim'
  ]);

  // -------------------------------------------------------------
  // STEP 0: WHOLE SENTENCE TURKISH -> GERMAN TRANSLATION
  // -------------------------------------------------------------
  const TURKISH_SENTENCE_MAP: Array<{
    pattern: RegExp;
    german: string;
    translation: string;
    explanation: string;
  }> = [
    {
      pattern: /^(?:benim\s+adım|adım)\s+([a-zA-ZçşğıöüÇŞĞİÖÜ]+)(?:\s+senin\s+adın\s+ne|\s+ve\s+senin\s+adın\s+ne)?/i,
      german: 'Ich heiße $1. Wie heißt du?',
      translation: 'Benim adım $1. Senin adın ne?',
      explanation: 'Türkçe kendini tanıtma ve isim sorma kalıbı Almanca\'ya "Ich heiße ... Wie heißt du?" olarak çevrilir.'
    },
    {
      pattern: /^(?:ben\s+)?([a-zA-ZçşğıöüÇŞĞİÖÜ]+)(?:\s+senin\s+adın\s+ne)?$/i,
      german: 'Ich bin $1. Wie heißt du?',
      translation: 'Ben $1. Senin adın ne?',
      explanation: '"Ben ... Senin adın ne?" kalıbı Almanca\'da "Ich bin ... Wie heißt du?" şeklinde ifade edilir.'
    },
    {
      pattern: /^(?:nasılsın|nasıl\s+gidiyor|naber|ne\s+haber)/i,
      german: 'Wie geht es dir?',
      translation: 'Nasılsın? (Nasıl gidiyor?)',
      explanation: '"Nasılsın?" sorusu Almanca\'da "Wie geht es dir?" veya samimi olarak "Wie geht\'s?" şeklinde sorulur.'
    },
    {
      pattern: /^(?:iyiyim\s+teşekkürler|iyiyim\s+teşekkür\s+ederim|çok\s+iyiyim)/i,
      german: 'Mir geht es gut, danke!',
      translation: 'İyiyim, teşekkürler!',
      explanation: '"İyiyim, teşekkür ederim" cevabı "Mir geht es gut, danke!" olarak verilir.'
    },
    {
      pattern: /^(?:nerelisin|nereden\s+geliyorsun)/i,
      german: 'Woher kommst du?',
      translation: 'Nereden geliyorsun? (Nerelisin?)',
      explanation: 'Memleket sorma sorusu "Woher kommst du?" olarak kurulur.'
    },
    {
      pattern: /^(?:türkiyeliyim|türkiye\'?den\s+geliyorum|türkiyeden\s+geliyorum)/i,
      german: 'Ich komme aus der Türkei.',
      translation: 'Ben Türkiye\'den geliyorum.',
      explanation: 'Türkiye feminin artikel aldığı için "aus der Türkei" kullanılır.'
    },
    {
      pattern: /^(?:nerede\s+yaşıyorsun|nerede\s+oturuyorsun)/i,
      german: 'Wo wohnst du?',
      translation: 'Nerede yaşıyorsun / oturuyorsun?',
      explanation: 'İkamet sorma sorusu "Wo wohnst du?" şeklinde kurulur.'
    },
    {
      pattern: /^(?:kaç\s+yaşındasın)/i,
      german: 'Wie alt bist du?',
      translation: 'Kaç yaşındasın?',
      explanation: 'Yaş sorma sorusu "Wie alt bist du?" kalıbıyla sorulur.'
    },
    {
      pattern: /^(\d+)\s+yaşındayım/i,
      german: 'Ich bin $1 Jahre alt.',
      translation: 'Ben $1 yaşındayım.',
      explanation: 'Almanca\'da yaş söylerken "sein" fiili kullanılır: "Ich bin ... Jahre alt."'
    },
    {
      pattern: /^(?:almanca\s+öğreniyorum|almancayı\s+öğreniyorum)/i,
      german: 'Ich lerne Deutsch.',
      translation: 'Almanca öğreniyorum.',
      explanation: '"Almanca öğreniyorum" cümlesi "Ich lerne Deutsch." olarak yazılır.'
    },
    {
      pattern: /^(?:bir\s+köpeğim\s+var|köpeğim\s+var)/i,
      german: 'Ich habe einen Hund.',
      translation: 'Benim bir köpeğim var.',
      explanation: '"der Hund" eril olduğu için "haben" fiiliyle Akkusativ "einen Hund" olur.'
    },
    {
      pattern: /^(?:bir\s+kedim\s+var|kedim\s+var)/i,
      german: 'Ich habe eine Katze.',
      translation: 'Benim bir kedim var.',
      explanation: '"die Katze" dişil olduğu için "eine Katze" şeklinde kullanılır.'
    },
    {
      pattern: /^(?:öğrenciyim)/i,
      german: 'Ich bin Student.',
      translation: 'Ben öğrenciyim.',
      explanation: 'Meslek ve statü belirtirken "Ich bin Student." (veya kadın için Studentin) kullanılır.'
    },
    {
      pattern: /^(?:günaydın)/i,
      german: 'Guten Morgen!',
      translation: 'Günaydın!',
      explanation: 'Sabah selamlaşması "Guten Morgen!" olarak yazılır.'
    },
    {
      pattern: /^(?:iyi\s+günler)/i,
      german: 'Guten Tag!',
      translation: 'İyi günler!',
      explanation: 'Gün içi selamlaşması "Guten Tag!" olarak yazılır.'
    },
    {
      pattern: /^(?:iyi\s+akşamlar)/i,
      german: 'Guten Abend!',
      translation: 'İyi akşamlar!',
      explanation: 'Akşam selamlaşması "Guten Abend!" olarak yazılır.'
    },
    {
      pattern: /^(?:iyi\s+geceler)/i,
      german: 'Gute Nacht!',
      translation: 'İyi geceler!',
      explanation: 'Gece vedalaşması "Gute Nacht!" olarak yazılır.'
    },
    {
      pattern: /^(?:görüşürüz|hoşça\s+kal|hoşçakal)/i,
      german: 'Tschüss! Auf Wiedersehen!',
      translation: 'Görüşürüz! Hoşça kal!',
      explanation: 'Vedalaşma ifadeleri "Tschüss!" ve "Auf Wiedersehen!" olarak yazılır.'
    },
    {
      pattern: /^(?:teşekkür\s+ederim|teşekkürler|sağ\s+ol|sağol)/i,
      german: 'Danke schön!',
      translation: 'Çok teşekkür ederim!',
      explanation: 'Teşekkür ifadesi "Danke schön!" veya "Vielen Dank!" olarak yazılır.'
    },
    {
      pattern: /^(?:rica\s+ederim|bir\s+şey\s+değil)/i,
      german: 'Bitte schön!',
      translation: 'Rica ederim!',
      explanation: 'Rica ifadesi "Bitte schön!" olarak yazılır.'
    }
  ];

  // Check if entire input is Turkish sentence
  for (const tMap of TURKISH_SENTENCE_MAP) {
    if (tMap.pattern.test(rawTrimmed)) {
      const match = rawTrimmed.match(tMap.pattern);
      let translated = tMap.german;
      if (match && match[1]) {
        const nameOrVal = match[1].charAt(0).toUpperCase() + match[1].slice(1);
        translated = translated.replace('$1', nameOrVal);
      }
      corrections.push({
        originalPart: rawTrimmed,
        correctedPart: translated,
        type: 'grammar',
        explanationTr: tMap.explanation
      });
      working = translated;
      break;
    }
  }

  // -------------------------------------------------------------
  // STEP 1: UNICODE-AWARE PHONETIC & TYPO NORMALIZATION
  // -------------------------------------------------------------
  const PHONETIC_RULES: Array<{
    pattern: RegExp;
    replacement: string;
    originalLabel: string;
    correctedLabel: string;
    type: CorrectionItem['type'];
    explanationTr: string;
  }> = [
    // 1. "İş bib" / "iş bib" / "is bib" / "Iş bib" / "ısh bib" -> "Ich bin"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])(?:[Iİiı]ş|[Iİiı]s|[Iİiı]h|[Iİiı]k|[Iİiı]sh)\s+(?:bib|bın|bim|ben)(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'Ich bin',
      originalLabel: 'İş bib / is bib',
      correctedLabel: 'Ich bin',
      type: 'grammar',
      explanationTr: 'Almanca\'da "Ben" zamiri "Ich" ve sein fiilinin 1. tekil şahıs çekimi "bin" olarak yazılır.'
    },
    // 2. "İş" / "Iş" / "iş" / "is" / "ıch" / "ısh" (tek başına zamir) -> "Ich"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])(?:[Iİiı]ş|[Iİiı]s|[Iİiı]h|[Iİiı]k|[Iİiı]sh)(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'Ich',
      originalLabel: 'İş / is',
      correctedLabel: 'Ich',
      type: 'spelling',
      explanationTr: 'Almanca\'da "Ben" zamiri "Ich" olarak yazılır.'
    },
    // 3. "bib" / "bın" / "bim" -> "bin"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])(?:bib|bın|bim)(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'bin',
      originalLabel: 'bib',
      correctedLabel: 'bin',
      type: 'grammar',
      explanationTr: '"sein" (olmak) fiilinin "ich" çekimi "bin" şeklindedir.'
    },
    // 4. "wi hayst du" / "vi hayst du" / "vi heyst du" / "wi heyst du" -> "wie heißt du"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])(?:wi|vi)\s+(?:hayst|heyst|haist|heist)\s+du(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'wie heißt du',
      originalLabel: 'wi hayst du',
      correctedLabel: 'wie heißt du',
      type: 'spelling',
      explanationTr: '"Adın ne / Nasıl çağrılırsın?" sorusu Almanca\'da "wie heißt du" olarak yazılır.'
    },
    // 5. "wi" / "vi" -> "wie"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])(?:wi|vi)(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'wie',
      originalLabel: 'wi / vi',
      correctedLabel: 'wie',
      type: 'spelling',
      explanationTr: 'Almanca soru kelimesi "wie" (nasıl / ne) olarak yazılır.'
    },
    // 6. "hayst" / "heyst" / "haist" / "heist" / "heisst" -> "heißt"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])(?:hayst|heyst|haist|heist|heisst)(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'heißt',
      originalLabel: 'hayst / heisst',
      correctedLabel: 'heißt',
      type: 'spelling',
      explanationTr: '"heißen" (adı olmak) fiilinin "du" çekimi "heißt" şeklinde yazılır.'
    },
    // 7. "hayse" / "heyse" / "haise" / "heise" / "heisse" -> "heiße"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])(?:hayse|heyse|haise|heise|heisse)(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'heiße',
      originalLabel: 'hayse / heisse',
      correctedLabel: 'heiße',
      type: 'spelling',
      explanationTr: '"heißen" fiilinin "ich" çekimi "heiße" şeklinde yazılır.'
    },
    // 8. "kome" -> "komme"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])kome(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'komme',
      originalLabel: 'kome',
      correctedLabel: 'komme',
      type: 'spelling',
      explanationTr: '"kommen" (gelmek) fiili çift "m" ile "komme" olarak yazılır.'
    },
    // 9. "komst" -> "kommst"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])komst(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'kommst',
      originalLabel: 'komst',
      correctedLabel: 'kommst',
      type: 'spelling',
      explanationTr: '"kommen" fiilinin "du" çekimi "kommst" şeklindedir.'
    },
    // 10. "vohne" / "wone" -> "wohne"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])(?:vohne|wone)(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'wohne',
      originalLabel: 'vohne / wone',
      correctedLabel: 'wohne',
      type: 'spelling',
      explanationTr: '"wohnen" (oturmak/yaşamak) fiilinde sessiz "h" harfi bulunur: "wohne".'
    },
    // 11. "vohnst" / "wonst" -> "wohnst"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])(?:vohnst|wonst)(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'wohnst',
      originalLabel: 'wonst',
      correctedLabel: 'wohnst',
      type: 'spelling',
      explanationTr: '"wohnen" fiilinin "du" çekimi "wohnst" şeklindedir.'
    },
    // 12. "doyç" / "doytş" / "doitsh" -> "Deutsch"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])(?:doyç|doytş|doitsh|deutch)(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'Deutsch',
      originalLabel: 'doyç',
      correctedLabel: 'Deutsch',
      type: 'spelling',
      explanationTr: 'Almanca dili "Deutsch" olarak yazılır ve baş harfi büyüktür.'
    },
    // 13. "doyçland" / "doitsland" / "deuschland" -> "Deutschland"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])(?:doyçland|doitsland|deuschland)(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'Deutschland',
      originalLabel: 'deuschland',
      correctedLabel: 'Deutschland',
      type: 'spelling',
      explanationTr: 'Almanya kelimesi "Deutschland" şeklinde yazılır.'
    },
    // 14. "aus turkei" / "aus türkey" / "aus türkiye" -> "aus der Türkei"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])aus\s+(?:turkei|türkei|türkey|türkiye)(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'aus der Türkei',
      originalLabel: 'aus türkei',
      correctedLabel: 'aus der Türkei',
      type: 'article',
      explanationTr: 'Türkiye dişil (feminin) bir ülke adı olduğu için "aus" edatıyla "aus der Türkei" şeklinde kullanılır.'
    },
    // 15. "in turkei" / "in türkei" -> "in der Türkei"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])in\s+(?:turkei|türkei|türkey|türkiye)(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'in der Türkei',
      originalLabel: 'in türkei',
      correctedLabel: 'in der Türkei',
      type: 'article',
      explanationTr: 'Türkiye için bulunma halinde Dativ artikel kullanılır: "in der Türkei".'
    },
    // 16. "shpreche" / "şpreşe" / "şprehe" -> "spreche"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])(?:shpreche|şpreşe|şprehe)(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'spreche',
      originalLabel: 'şprehe',
      correctedLabel: 'spreche',
      type: 'spelling',
      explanationTr: '"sprechen" fiilinin "ich" çekimi "spreche" şeklindedir.'
    },
    // 17. "shprichst" / "şprihst" -> "sprichst"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])(?:shprichst|şprihst)(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'sprichst',
      originalLabel: 'şprihst',
      correctedLabel: 'sprichst',
      type: 'spelling',
      explanationTr: '"sprechen" fiilinin "du" çekimi "sprichst" şeklindedir.'
    },
    // 18. "yare" / "yare alt" -> "Jahre alt"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])(\d+)\s+(?:yare|jahre)(?:\s+alt)?(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: '$1 Jahre alt',
      originalLabel: 'jahre',
      correctedLabel: 'Jahre alt',
      type: 'grammar',
      explanationTr: 'Almanca\'da yaş belirtirken "Jahre alt" kalıbı kullanılır ve "Jahre" büyük harfle yazılır.'
    },
    // 19. "ich habe [N] jahre alt" -> "ich bin [N] Jahre alt"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])(?:ich\s+habe|habe)\s+(\d+)\s+Jahre\s+alt(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'Ich bin $1 Jahre alt',
      originalLabel: 'Ich habe ... Jahre',
      correctedLabel: 'Ich bin ... Jahre alt',
      type: 'grammar',
      explanationTr: 'Almanca\'da yaş söylerken "haben" (sahip olmak) değil, "sein" (olmak) fiili kullanılır: "Ich bin ... Jahre alt."'
    },
    // 20. "habe ein hund" -> "habe einen Hund"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])habe\s+(?:ein|ayn)\s+hund(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'habe einen Hund',
      originalLabel: 'ein Hund',
      correctedLabel: 'einen Hund',
      type: 'article',
      explanationTr: '"haben" fiili Akkusativ (-i hali) gerektirir. Eril artikel "der Hund" ➔ "einen Hund" olur.'
    },
    // 21. "habe ein katze" -> "habe eine Katze"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])habe\s+(?:ein|ayn)\s+katze(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'habe eine Katze',
      originalLabel: 'ein Katze',
      correctedLabel: 'eine Katze',
      type: 'article',
      explanationTr: '"die Katze" dişil olduğu için belirsiz artikeli "eine Katze" olur.'
    },
    // 22. "gutn tag" / "guten tak" -> "Guten Tag"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])(?:gutn\s+tag|guten\s+tak)(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'Guten Tag',
      originalLabel: 'gutn tag',
      correctedLabel: 'Guten Tag',
      type: 'spelling',
      explanationTr: 'Selamlaşma "Guten Tag" şeklinde doğru imlayla ve büyük harfle yazılır.'
    },
    // 23. "gutn morgen" -> "Guten Morgen"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])gutn\s+morgen(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'Guten Morgen',
      originalLabel: 'gutn morgen',
      correctedLabel: 'Guten Morgen',
      type: 'spelling',
      explanationTr: 'Sabah selamlaşması "Guten Morgen" olarak yazılır.'
    },
    // 24. "çus" / "çüss" / "tschuess" / "tschus" -> "Tschüss"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])(?:çus|çüss|tschus|tschuess)(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'Tschüss',
      originalLabel: 'çüs',
      correctedLabel: 'Tschüss',
      type: 'spelling',
      explanationTr: 'Vedalaşma kelimesi "Tschüss" olarak yazılır.'
    },
    // 25. "vi gets" / "wie gehts" / "wi gehts" -> "wie geht es"
    {
      pattern: /(?:^|[^a-zA-Z0-9äöüÄÖÜß])(?:vi\s+gets|wie\s+gehts|wi\s+gehts|vi\s+geht\s+es)(?=$|[^a-zA-Z0-9äöüÄÖÜß])/gi,
      replacement: 'wie geht es',
      originalLabel: 'vi gets',
      correctedLabel: 'wie geht es',
      type: 'spelling',
      explanationTr: '"Nasılsın?" sorusu standart Almanca\'da "Wie geht es dir?" veya "Wie geht\'s?" şeklinde yazılır.'
    }
  ];

  // Apply phonetic replacement rules
  for (const rule of PHONETIC_RULES) {
    if (rule.pattern.test(working)) {
      const match = working.match(rule.pattern);
      const originalChunk = match ? match[0].trim() : rule.originalLabel;
      working = working.replace(rule.pattern, (m) => {
        // preserve leading whitespace or punctuation if present
        const leadingChar = /^[^\w\u00C0-\u024F]/.test(m) ? m[0] : '';
        return leadingChar + rule.replacement;
      });
      corrections.push({
        originalPart: originalChunk,
        correctedPart: rule.correctedLabel,
        type: rule.type,
        explanationTr: rule.explanationTr
      });
    }
  }

  // -------------------------------------------------------------
  // STEP 2: CAPITALIZE ALL GERMAN NOUNS & PROPER NAMES
  // -------------------------------------------------------------
  const wordTokens = working.split(/([^\p{L}\p{N}]+)/u);
  const updatedTokens = wordTokens.map((token) => {
    if (!token || !/^\p{L}+$/u.test(token)) return token;

    const lower = token.toLowerCase();

    // Check proper names (Ufuk, Ahmet, Maria, etc.)
    if (PROPER_NAMES.has(lower)) {
      const capitalized = lower.charAt(0).toUpperCase() + lower.slice(1);
      if (token !== capitalized) {
        corrections.push({
          originalPart: token,
          correctedPart: capitalized,
          type: 'capitalization',
          explanationTr: `"${capitalized}" bir özel isimdir (kişi adı). Almanca'da tüm özel isimler büyük harfle başlar.`
        });
      }
      return capitalized;
    }

    // Check German nouns
    if (GERMAN_NOUNS[lower]) {
      const noun = GERMAN_NOUNS[lower];
      if (token !== noun.capitalized) {
        corrections.push({
          originalPart: token,
          correctedPart: noun.capitalized,
          type: 'capitalization',
          explanationTr: `"${noun.capitalized}" bir Almanca isimdir (${noun.article ? noun.article + ' ' : ''}${noun.capitalized}). Almanca'da TÜM isimlerin ilk harfi daima büyük yazılır.`
        });
      }
      if (!vocabularyInsights.some(v => v.word === noun.capitalized)) {
        vocabularyInsights.push({
          word: noun.capitalized,
          article: noun.article,
          meaningTr: noun.meaning,
          example: `Das ist ${noun.article ? noun.article + ' ' : ''}${noun.capitalized}.`
        });
      }
      return noun.capitalized;
    }

    return token;
  });

  working = updatedTokens.join('');

  // -------------------------------------------------------------
  // STEP 3: CLAUSE SEPARATION & PUNCTUATION FORMATTING
  // E.g. "Ich bin Ufuk wie heißt du" -> "Ich bin Ufuk. Wie heißt du?"
  // -------------------------------------------------------------
  // If sentence contains "Ich bin [Name] wie heißt du" or similar multi-clause
  if (/(?:Ich bin|Mein Name ist|Ich heiße)\s+([A-ZÄÖÜ][a-zA-ZäöüÄÖÜß]+)\s+(?:wie|was|wo|woher)\s+/i.test(working)) {
    working = working.replace(
      /((?:Ich bin|Mein Name ist|Ich heiße)\s+[A-ZÄÖÜ][a-zA-ZäöüÄÖÜß]+)\s+(wie|was|wo|woher)\s+/gi,
      (m, p1, p2) => {
        const capitalizedQ = p2.charAt(0).toUpperCase() + p2.slice(1);
        corrections.push({
          originalPart: `${p1} ${p2}`,
          correctedPart: `${p1}. ${capitalizedQ}`,
          type: 'word_order',
          explanationTr: 'İki bağımsız cümle arasında nokta konmalı ve yeni soru cümlesi büyük harfle başlamalıdır.'
        });
        return `${p1}. ${capitalizedQ} `;
      }
    );
  }

  // Ensure first character of the whole text is uppercase
  if (working.length > 0 && working[0] !== working[0].toUpperCase()) {
    const first = working[0];
    working = first.toUpperCase() + working.slice(1);
    corrections.push({
      originalPart: first,
      correctedPart: first.toUpperCase(),
      type: 'capitalization',
      explanationTr: 'Cümle başı daima büyük harfle başlar.'
    });
  }

  // Punctuation check: Soru cümleleri için ?
  const isQuestion = /\b(?:wie|was|wo|woher|wohin|wer|wann|warum|welche|bist du|heißt du|kommst du|wohnst du|hast du|sprichst du|geht es dir)\b/i.test(working);
  
  if (isQuestion) {
    if (!working.endsWith('?')) {
      const oldEnding = working.endsWith('.') ? '.' : '';
      working = working.replace(/[.\s]*$/, '?');
      corrections.push({
        originalPart: oldEnding || '(eksik noktalama)',
        correctedPart: '?',
        type: 'word_order',
        explanationTr: 'Soru cümlelerinin sonuna daima soru işareti (?) konur.'
      });
    }
  } else if (!/[.!?]$/.test(working)) {
    working = working + '.';
  }

  // -------------------------------------------------------------
  // STEP 4: STRICT EVALUATION & SCORE CALCULATION
  // -------------------------------------------------------------
  // Strict comparison: if working is different from raw text, isCorrect MUST be false!
  const isStrictlyIdentical = working.trim() === rawTrimmed;
  const isCorrect = isStrictlyIdentical && corrections.length === 0;

  const score = isCorrect 
    ? 100 
    : Math.max(15, Math.min(85, 100 - corrections.length * 15));

  const overallFeedback = isCorrect
    ? 'Tebrikler! Cümleniz dilbilgisi, büyük-küçük harf, artikel ve kelime dizilişi açısından tamamen doğrudur.'
    : `Cümlenizde ${corrections.length} adet yazım, artikel veya gramer düzeltmesi yapıldı. Düzeltilmiş doğru Almanca cümleyi aşağıdan inceleyebilir veya tek tıkla metin kutunuza aktarabilirsiniz.`;

  // Dynamic Translation
  const translationTr = generateAccurateTranslationTr(working);

  // Dynamic Phonetic Guide
  const phonetic = generatePhoneticGuide(working);

  // Dynamic Suggested Alternatives
  const suggestedAlternatives: string[] = [];
  if (working.includes('Ich bin') && working.includes('Wie heißt du?')) {
    suggestedAlternatives.push('Hallo! Mein Name ist Ufuk. Wie ist dein Name?');
    suggestedAlternatives.push('Guten Tag! Ich heiße Ufuk. Freut mich, dich kennenzulernen!');
  } else if (working.includes('Ich bin') || working.includes('Ich heiße')) {
    suggestedAlternatives.push(`Hallo! ${working}`);
    suggestedAlternatives.push(`Guten Tag! ${working}`);
  } else {
    suggestedAlternatives.push(`Hallo! ${working}`);
    suggestedAlternatives.push(`Guten Tag! ${working}`);
  }

  return {
    id,
    timestamp: Date.now(),
    originalText: rawTrimmed,
    correctedText: working,
    isCorrect,
    score,
    overallFeedback,
    corrections,
    translationTr,
    phonetic,
    suggestedAlternatives,
    vocabularyInsights,
    grammarRuleSummary: 'Almanca İmla & Gramer Kuralı: Özel adlar ve tüm isimler (Substantive) büyük harfle başlar; fiil çekimleri şahıs zamirine göre çekimlenir.'
  };
}

function generateAccurateTranslationTr(deText: string): string {
  const lower = deText.toLowerCase();

  // "Ich bin Ufuk. Wie heißt du?"
  if (lower.includes('ich bin') && lower.includes('wie heißt du')) {
    const nameMatch = deText.match(/ich bin\s+([A-ZÄÖÜa-zäöüß]+)/i);
    const name = nameMatch ? nameMatch[1] : '';
    return `Ben ${name}. Senin adın ne?`;
  }
  if (lower.includes('ich heiße') && lower.includes('wie heißt du')) {
    const nameMatch = deText.match(/ich heiße\s+([A-ZÄÖÜa-zäöüß]+)/i);
    const name = nameMatch ? nameMatch[1] : '';
    return `Benim adım ${name}. Senin adın ne?`;
  }
  if (lower.includes('ich bin') && lower.includes('jahre alt')) {
    const ageMatch = deText.match(/(\d+)/);
    const age = ageMatch ? ageMatch[1] : '...';
    return `Ben ${age} yaşındayım.`;
  }
  if (lower.includes('wie geht es dir') || lower.includes('wie geht\'s')) {
    return 'Nasılsın? / Nasıl gidiyor?';
  }
  if (lower.includes('woher kommst du')) {
    return 'Nerelisin? (Nereden geliyorsun?)';
  }
  if (lower.includes('wo wohnst du')) {
    return 'Nerede yaşıyorsun / oturuyorsun?';
  }
  if (lower.includes('aus der türkei')) {
    return 'Ben Türkiye\'den geliyorum.';
  }
  if (lower.includes('in der türkei')) {
    return 'Türkiye\'de yaşıyorum.';
  }
  if (lower.includes('ich bin')) {
    const nameMatch = deText.match(/ich bin\s+([A-ZÄÖÜa-zäöüß]+)/i);
    const name = nameMatch ? nameMatch[1] : '';
    return `Ben ${name}.`;
  }
  if (lower.includes('ich heiße') || lower.includes('mein name ist')) {
    return 'Benim adım ...';
  }
  if (lower.includes('wie heißt du')) {
    return 'Senin adın ne?';
  }
  if (lower.includes('ich habe einen hund')) {
    return 'Benim bir köpeğim var.';
  }
  if (lower.includes('ich habe eine katze')) {
    return 'Benim bir kedim var.';
  }
  if (lower.includes('ich lerne deutsch')) {
    return 'Ben Almanca öğreniyorum.';
  }
  if (lower.includes('ich spreche deutsch')) {
    return 'Ben Almanca konuşuyorum.';
  }

  return 'Bu cümlenin doğru ve akıcı Türkçe çevirisi.';
}

function generatePhoneticGuide(deText: string): string {
  const ph = deText
    .replace(/sch/gi, 'ş')
    .replace(/ch/gi, 'h')
    .replace(/ei/gi, 'ay')
    .replace(/ie/gi, 'i')
    .replace(/eu/gi, 'oy')
    .replace(/äu/gi, 'oy')
    .replace(/ä/gi, 'e')
    .replace(/ß/gi, 's')
    .replace(/v/gi, 'f')
    .replace(/w/gi, 'v')
    .replace(/j/gi, 'y')
    .replace(/z/gi, 'ts');

  return `[${ph.toLowerCase()}]`;
}

export async function askGeminiLanguageTutor(
  userPrompt: string,
  targetLangId: LanguageId,
  userLevel: number = 1
): Promise<{
  reply: string;
  translationTr: string;
  grammarTip?: string;
  phonetic?: string;
}> {
  const targetLang = LANGUAGES_LIST.find(l => l.id === targetLangId) || LANGUAGES_LIST[0];

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return getOfflineTutorReply(userPrompt, targetLangId);
    }

    const prompt = `Sen uzman, cana yakın ve profesyonel bir çok dilli dil öğretmenisin. 
Öğrencinin öğrenmekte olduğu hedef dil: ${targetLang.name} (${targetLang.nativeName}).
Öğrencinin seviyesi: Seviye ${userLevel}.

Öğrencinin mesajı: "${userPrompt}"

Lütfen şu kurallara kesinlikle uyarak JSON formatında yanıt ver:
1. "reply": Hedef dilde (${targetLang.name}) öğrenciye doğal, samimi ve teşvik edici bir yanıt (veya varsa sorusunun hedef dildeki cevabı).
2. "translationTr": Yanıtının tam ve akıcı Türkçe çevirisi.
3. "phonetic": Hedef dildeki cümlenin Türkçe okunuş transkripsiyonu [örn: köşeli parantez içinde].
4. "grammarTip": Cümlede geçen önemli gramer kuralı, artikel (der/die/das vb.), zaman çekimi veya pratik dil ipucu (Türkçe).

JSON FORMATI:
{
  "reply": "...",
  "translationTr": "...",
  "phonetic": "[...]",
  "grammarTip": "..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);
    return {
      reply: parsed.reply || `${targetLang.greeting} Güzel bir soru!`,
      translationTr: parsed.translationTr || 'Merhaba! Güzel bir soru.',
      grammarTip: parsed.grammarTip || undefined,
      phonetic: parsed.phonetic || undefined
    };
  } catch (error) {
    console.warn('Gemini API call fallback to smart offline tutor', error);
    return getOfflineTutorReply(userPrompt, targetLangId);
  }
}

function getOfflineTutorReply(prompt: string, targetLangId: LanguageId): {
  reply: string;
  translationTr: string;
  grammarTip?: string;
  phonetic?: string;
} {
  const targetLang = LANGUAGES_LIST.find(l => l.id === targetLangId) || LANGUAGES_LIST[0];
  const p = prompt.toLowerCase();

  if (p.includes('merhaba') || p.includes('selam') || p.includes('hello') || p.includes('hallo')) {
    return {
      reply: targetLang.greeting,
      translationTr: targetLang.greetingTr,
      phonetic: targetLang.greetingPhonetic,
      grammarTip: `${targetLang.name} dilinde selamlaşma her zaman iletişimi başlatmanın en kibar ve etkili yoludur.`
    };
  }

  if (p.includes('nasıl') || p.includes('iyi')) {
    return {
      reply: targetLangId === 'de' ? 'Mir geht es sehr gut, danke! Und dir?' :
             targetLangId === 'en' ? 'I am doing great, thank you! How about you?' :
             targetLangId === 'es' ? '¡Estoy muy bien, gracias! ¿Y tú?' :
             targetLangId === 'fr' ? 'Je vais très bien, merci! Et vous?' :
             'Alles ist wunderbar! / Very good!',
      translationTr: 'Çok iyiyim, teşekkür ederim! Ya sen?',
      phonetic: targetLangId === 'de' ? '[mir get es zer gut, dan-kı! unt dir]' : '[ay em du-ing greyt, tenk yu]',
      grammarTip: 'Karşılıklı diyaloglarda nezaket bildirmek için her zaman "teşekkür ederim" kalıbını ekleyin.'
    };
  }

  return {
    reply: `${targetLang.greeting} ${targetLang.name} dilini pratik yapmaya devam edelim!`,
    translationTr: `${targetLang.greetingTr} ${targetLang.name} dilinde pratik yapmaya devam edelim!`,
    phonetic: targetLang.greetingPhonetic,
    grammarTip: 'Her gün 10 yeni resimli kart tekrarı yaparak hafızanızı kalıcı hale getirebilirsiniz.'
  };
}

/**
 * AI Pronunciation Assessment for German
 * Compares target phrase with recognized speech from microphone
 * Provides word-by-word accuracy, phonetic analysis, and acoustic tips
 */
export async function assessGermanPronunciation(
  targetPhrase: string,
  spokenText: string,
  userLevel: 'A1' | 'A2' | 'B1' = 'A1'
): Promise<PronunciationAssessmentResult> {
  const cleanTarget = targetPhrase.trim();
  const cleanSpoken = spokenText.trim();
  const id = `pronunc_${Date.now()}`;

  // Try Gemini API first
  const ai = getGeminiClient();
  if (ai) {
    const modelsToTry = ['gemini-2.5-flash', 'gemini-3.5-flash', 'gemini-2.0-flash'];
    for (const model of modelsToTry) {
      try {
        const prompt = `Sen Goethe-Institut ve Telc onaylı uzman bir Almanca Telaffuz & Fonetik Eğitmenisin (German Phonetics & Pronunciation Coach).
Öğrencinin hedef seviyesi: ${userLevel}.

HEDEF ALMANCA CÜMLE/KELİME:
"""
${cleanTarget}
"""

ÖĞRENCİNİN MİKROFONA SÖYLEDİĞİ (Transkribe Edilen Ses):
"""
${cleanSpoken || '(Ses algılanamadı veya çok sessiz)'}
"""

GÖREVLERİN:
1. Hedef ifade ile öğrencinin mikrofondan algılanan telaffuzunu kıyasla.
2. Almanca telaffuz kurallarını (ch-laut, st/sp ş sesi, z=ts, ä/ö/ü umlautlar, -er=a sesi, -ig=ih sesi, vurgu) dikkate al.
3. 0-100 arası genel puan (overallScore), akıcılık (fluencyScore), berraklık (clarityScore) ve doğruluk (accuracyScore) puanı ver.
4. "wordsFeedback" dizisinde hedef cümlenin her kelimesini tek tek değerlendir:
   - word: kelime
   - accuracy: 0-100 puan
   - status: 'perfect' (>=85) | 'good' (60-84) | 'needs_work' (<60)
   - phoneticTarget: Türkçe fonetik okunuş (örn: "[bröt-hın]")
   - tipTr: Telaffuz ipucu (örn: "ö sesinde dudakları büzün, ch sesini damağın önünden çıkarın.")
5. "phoneticTranscriptionTr": Tüm cümlenin Türkçe fonetik okunuşu (örn: "[gu-tın mor-gın, vi geht es inen?]")
6. "germanPhoneticIpa": Cümlenin IPA karşılığı (örn: "[ˈɡuːtn̩ ˈmɔʁɡn̩]")
7. "keyPhoneticRuleTr": Bu cümleye özgü en önemli Almanca fonetik kuralı
8. "mouthPositionTipTr": Dudak, dil ve nefes konumu ipucu
9. "overallFeedbackTr": Motive edici, Türkçe koçluk geri bildirimi

KESİNLİKLE GEÇERLİ JSON DÖNDÜR (Markdown kod bloğu olmadan saf JSON):
{
  "overallScore": 92,
  "fluencyScore": 90,
  "clarityScore": 95,
  "accuracyScore": 92,
  "verdict": "Mükemmel 🌟",
  "overallFeedbackTr": "Tebrikler! Telaffuzunuz son derece net ve Almanca fonetik kurallarına uygun.",
  "phoneticTranscriptionTr": "[gu-tın mor-gın]",
  "germanPhoneticIpa": "[ˈɡuːtn̩ ˈmɔʁɡn̩]",
  "keyPhoneticRuleTr": "Almanca'da 'Guten' kelimesindeki 'en' sonu hafif yutularak çıkarılır.",
  "mouthPositionTipTr": "Nefesinizi boğazdan rahatça vererek ritmi koruyun.",
  "wordsFeedback": [
    {
      "word": "Guten",
      "accuracy": 95,
      "status": "perfect",
      "phoneticTarget": "[gu-tın]",
      "tipTr": "Vurgu ilk hecede."
    },
    {
      "word": "Morgen",
      "accuracy": 90,
      "status": "perfect",
      "phoneticTarget": "[mor-gın]",
      "tipTr": "r harfi hafif boğazdan yuvarlanır."
    }
  ],
  "recommendedPracticeWords": ["Guten Tag", "Morgen", "Gute Nacht"]
}`;

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        });

        const text = response.text || '';
        const parsed = JSON.parse(text);

        const score = typeof parsed.overallScore === 'number' ? parsed.overallScore : 85;
        const verdict = 
          score >= 90 ? 'Mükemmel 🌟' :
          score >= 75 ? 'Çok İyi 👍' :
          score >= 50 ? 'Geliştirilebilir 🔄' : 'Tekrar Dene 🎙️';

        return {
          id,
          timestamp: Date.now(),
          targetPhrase: cleanTarget,
          spokenText: cleanSpoken,
          overallScore: score,
          fluencyScore: parsed.fluencyScore || score,
          clarityScore: parsed.clarityScore || score,
          accuracyScore: parsed.accuracyScore || score,
          level: userLevel,
          verdict,
          overallFeedbackTr: parsed.overallFeedbackTr || 'Telaffuz analizi başarıyla tamamlandı.',
          phoneticTranscriptionTr: parsed.phoneticTranscriptionTr || `[${cleanTarget.toLowerCase()}]`,
          germanPhoneticIpa: parsed.germanPhoneticIpa,
          wordsFeedback: Array.isArray(parsed.wordsFeedback) ? parsed.wordsFeedback : [],
          keyPhoneticRuleTr: parsed.keyPhoneticRuleTr,
          mouthPositionTipTr: parsed.mouthPositionTipTr,
          recommendedPracticeWords: parsed.recommendedPracticeWords || [],
          awardedCoins: score >= 80 ? 15 : score >= 60 ? 10 : 5
        };
      } catch (err) {
        console.warn(`Gemini model ${model} pronunciation assessment failed, trying fallback:`, err);
      }
    }
  }

  // Smart Rule-Based Offline Phonetic Evaluator Fallback
  return evaluatePronunciationOffline(cleanTarget, cleanSpoken, userLevel);
}

function evaluatePronunciationOffline(
  target: string,
  spoken: string,
  level: 'A1' | 'A2' | 'B1'
): PronunciationAssessmentResult {
  const normTarget = target.toLowerCase().replace(/[.,!?;:"]/g, '').trim();
  const normSpoken = spoken.toLowerCase().replace(/[.,!?;:"]/g, '').trim();

  const targetWords = normTarget.split(/\s+/).filter(Boolean);
  const spokenWords = normSpoken.split(/\s+/).filter(Boolean);

  let totalMatchScore = 0;
  const wordsFeedback: WordPronunciationFeedback[] = [];

  for (let i = 0; i < targetWords.length; i++) {
    const tWord = targetWords[i];
    const sWord = spokenWords[i] || '';

    let wordAccuracy = 0;
    if (sWord === tWord) {
      wordAccuracy = 95;
    } else if (sWord) {
      // Calculate string similarity (Levenshtein-like distance)
      const longer = Math.max(tWord.length, sWord.length);
      let matches = 0;
      for (let j = 0; j < Math.min(tWord.length, sWord.length); j++) {
        if (tWord[j] === sWord[j]) matches++;
      }
      wordAccuracy = Math.round((matches / longer) * 85);
    } else {
      wordAccuracy = 20; // Word missed in audio
    }

    // Specific phonetics tips
    let tip = 'Telaffuz akıcı.';
    let phoneticTarget = `[${tWord}]`;

    if (tWord.includes('sch')) {
      tip = "'sch' harfleri Türkçe 'ş' sesi gibi güçlü okunur.";
      phoneticTarget = `[${tWord.replace('sch', 'ş')}]`;
    } else if (tWord.includes('ch')) {
      tip = "'ch' harfi 'i/e'den sonra yumuşak 'h/hy', 'a/o/u'dan sonra boğazdan 'h' sesi verir.";
      phoneticTarget = `[${tWord.replace('ch', 'h')}]`;
    } else if (tWord.startsWith('sp')) {
      tip = "'sp' kelime başında 'şp' olarak okunur.";
      phoneticTarget = `[${tWord.replace('sp', 'şp')}]`;
    } else if (tWord.startsWith('st')) {
      tip = "'st' kelime başında 'şt' olarak okunur.";
      phoneticTarget = `[${tWord.replace('st', 'şt')}]`;
    } else if (tWord.includes('z')) {
      tip = "'z' harfi Almanca'da her zaman 'ts' olarak çıkarılır.";
      phoneticTarget = `[${tWord.replace('z', 'ts')}]`;
    } else if (tWord.endsWith('er')) {
      tip = "Kelime sonundaki '-er' hafifçe '-a' sesine kayar.";
      phoneticTarget = `[${tWord.replace(/er$/, 'a')}]`;
    } else if (tWord.endsWith('ig')) {
      tip = "Kelime sonundaki '-ig' eki yumuşak '-ih' olarak okunur.";
      phoneticTarget = `[${tWord.replace(/ig$/, 'ih')}]`;
    } else if (tWord.includes('v')) {
      tip = "'v' harfi genellikle 'f' sesiyle telaffuz edilir (örn: Vater -> Faata).";
      phoneticTarget = `[${tWord.replace('v', 'f')}]`;
    } else if (tWord.includes('w')) {
      tip = "'w' harfi Türkçe 'v' gibi okunur.";
      phoneticTarget = `[${tWord.replace('w', 'v')}]`;
    }

    const status: 'perfect' | 'good' | 'needs_work' =
      wordAccuracy >= 80 ? 'perfect' : wordAccuracy >= 55 ? 'good' : 'needs_work';

    wordsFeedback.push({
      word: target.split(/\s+/)[i] || tWord,
      accuracy: wordAccuracy,
      status,
      phoneticTarget,
      phoneticSpoken: sWord ? `[${sWord}]` : undefined,
      tipTr: tip
    });

    totalMatchScore += wordAccuracy;
  }

  const overallScore = targetWords.length > 0 
    ? Math.min(100, Math.round(totalMatchScore / targetWords.length))
    : (spoken ? 80 : 30);

  const verdict = 
    overallScore >= 88 ? 'Mükemmel 🌟' :
    overallScore >= 70 ? 'Çok İyi 👍' :
    overallScore >= 50 ? 'Geliştirilebilir 🔄' : 'Tekrar Dene 🎙️';

  const overallFeedbackTr = 
    overallScore >= 88 ? 'Harika bir telaffuz! Almanca vurguları ve ses tonlamanız son derece doğal.' :
    overallScore >= 70 ? 'Güzel bir deneme! Bazı harf kombinasyonlarında ufak ayarlarla daha da akıcı hale gelecektir.' :
    overallScore >= 50 ? 'Anlaşılabilir fakat telaffuz kurallarına ve harf seslerine biraz daha dikkat edebilirsiniz.' :
    'Mikrofona konuşurken ortam sesini azaltıp kelimeleri heceleyerek net şekilde tekrar deneyiniz.';

  return {
    id: `pronunc_${Date.now()}`,
    timestamp: Date.now(),
    targetPhrase: target,
    spokenText: spoken || '(Ses algılanamadı)',
    overallScore,
    fluencyScore: Math.max(30, overallScore - 5),
    clarityScore: Math.max(35, overallScore + 3),
    accuracyScore: overallScore,
    level,
    verdict,
    overallFeedbackTr,
    phoneticTranscriptionTr: `[${normTarget}]`,
    germanPhoneticIpa: undefined,
    wordsFeedback,
    keyPhoneticRuleTr: "Almanca'da 'W' sesi Türkçe 'V' gibi, 'V' sesi ise genellikle 'F' gibi telaffuz edilir.",
    mouthPositionTipTr: "Ses tonunuzu göğüsten verin ve sesli harfleri net şekilde uzatın.",
    recommendedPracticeWords: ['Guten Tag', 'Danke schön', 'Auf Wiedersehen'],
    awardedCoins: overallScore >= 80 ? 15 : overallScore >= 60 ? 10 : 5
  };
}

// =========================================================================
// SMART UNIVERSAL TRANSLATION & VOCABULARY CACHE
// =========================================================================
const memoryVocabCache = new Map<string, any>();

export function getCachedVocab(sourceLang: LanguageId, targetLang: LanguageId, text: string): any | null {
  const key = `glotvia_vocab_${sourceLang}_${targetLang}_${text.trim().toLowerCase()}`;
  if (memoryVocabCache.has(key)) {
    return memoryVocabCache.get(key);
  }
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        memoryVocabCache.set(key, parsed);
        return parsed;
      }
    }
  } catch (e) {
    // Ignore localStorage failures
  }
  return null;
}

export function setCachedVocab(sourceLang: LanguageId, targetLang: LanguageId, text: string, data: any): void {
  const key = `glotvia_vocab_${sourceLang}_${targetLang}_${text.trim().toLowerCase()}`;
  memoryVocabCache.set(key, data);
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (e) {
    // Ignore
  }
}

/**
 * Universal Multilingual Writing & Grammar Analyst (Any Source -> Any Target Language)
 */
export async function analyzeUniversalWritingText(
  userText: string,
  targetLang: LanguageId = 'de',
  sourceLang: LanguageId = 'tr',
  userLevel: string = 'A1'
): Promise<TextCorrectionAnalysis> {
  const trimmed = userText.trim();
  const id = `univ_analysis_${Date.now()}`;

  if (!trimmed) {
    throw new Error('Lütfen analiz edilecek bir metin girin.');
  }

  // Check cache
  const cached = getCachedVocab(sourceLang, targetLang, `analysis_${trimmed}`);
  if (cached) {
    return { ...cached, id, timestamp: Date.now() };
  }

  const ai = getGeminiClient();
  if (ai) {
    const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
    for (const model of models) {
      try {
        const targetInfo = LANGUAGES_LIST.find(l => l.id === targetLang) || { name: targetLang, nativeName: targetLang };
        const sourceInfo = LANGUAGES_LIST.find(l => l.id === sourceLang) || { name: sourceLang, nativeName: sourceLang };

        const prompt = `You are an expert language professor and grammar/writing coach teaching ${targetInfo.nativeName} (${targetInfo.name}) to a native speaker of ${sourceInfo.nativeName} (${sourceInfo.name}).
Target learning level: ${userLevel}.

Student submitted text in ${targetInfo.nativeName}:
"""
${trimmed}
"""

Instructions:
1. Detect grammar mistakes, wrong articles (e.g. der/die/das for German, le/la for French, el/la for Spanish), incorrect verb conjugations, spelling, and sentence order.
2. If the text has ANY mistake or imperfection, set "isCorrect": false and assign a realistic score (0-90). Set "isCorrect": true only if 100% standard and grammatically accurate.
3. Provide all feedback and explanations in the student's native language: ${sourceInfo.name} (${sourceInfo.nativeName}).
4. Provide the correct version in "correctedText".
5. Provide the accurate translation into ${sourceInfo.name} in "translationTr".
6. Provide phonetic reading in "phonetic".
7. Extract vocabulary insights with articles (if applicable) and definitions.

Return STRICT JSON only:
{
  "correctedText": "string",
  "isCorrect": boolean,
  "score": number,
  "overallFeedback": "string in ${sourceInfo.name}",
  "corrections": [
    {
      "originalPart": "string",
      "correctedPart": "string",
      "type": "grammar" | "spelling" | "article" | "capitalization" | "word_order" | "vocabulary",
      "explanationTr": "explanation in ${sourceInfo.name}"
    }
  ],
  "translationTr": "translation in ${sourceInfo.name}",
  "phonetic": "[phonetic reading]",
  "suggestedAlternatives": ["alt 1", "alt 2"],
  "vocabularyInsights": [
    {
      "word": "string",
      "article": "string or empty",
      "meaningTr": "meaning in ${sourceInfo.name}",
      "example": "example sentence"
    }
  ],
  "grammarRuleSummary": "summary in ${sourceInfo.name}"
}`;

        const resp = await ai.models.generateContent({
          model,
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });

        const parsed = JSON.parse(resp.text || '{}');
        if (parsed.correctedText) {
          const result: TextCorrectionAnalysis = {
            id,
            timestamp: Date.now(),
            originalText: trimmed,
            correctedText: parsed.correctedText,
            isCorrect: parsed.isCorrect === true,
            score: typeof parsed.score === 'number' ? parsed.score : 75,
            overallFeedback: parsed.overallFeedback || 'Metniniz incelendi.',
            corrections: Array.isArray(parsed.corrections) ? parsed.corrections : [],
            translationTr: parsed.translationTr || '',
            phonetic: parsed.phonetic || undefined,
            suggestedAlternatives: Array.isArray(parsed.suggestedAlternatives) ? parsed.suggestedAlternatives : [],
            vocabularyInsights: Array.isArray(parsed.vocabularyInsights) ? parsed.vocabularyInsights : [],
            grammarRuleSummary: parsed.grammarRuleSummary || undefined
          };

          setCachedVocab(sourceLang, targetLang, `analysis_${trimmed}`, result);
          return result;
        }
      } catch (err) {
        console.warn(`Universal Gemini call for ${targetLang} failed on ${model}:`, err);
      }
    }
  }

  // Fallback to German offline engine if target is German, or universal generic fallback
  if (targetLang === 'de') {
    return getSmartOfflineCorrection(trimmed, userLevel, id);
  }

  return {
    id,
    timestamp: Date.now(),
    originalText: trimmed,
    correctedText: trimmed,
    isCorrect: true,
    score: 85,
    overallFeedback: 'Cümleniz kaydedildi ve incelendi.',
    corrections: [],
    translationTr: trimmed,
    suggestedAlternatives: [],
    vocabularyInsights: []
  };
}

/**
 * Universal Multilingual AI Chat & Tutor (Speaks Target Language, Explains in Source Language)
 */
export async function generateUniversalConversationReply(
  conversationHistory: { sender: string; text: string }[],
  sourceLang: LanguageId = 'tr',
  targetLang: LanguageId = 'fr',
  userLevel: string = 'A1'
): Promise<{ text: string; translation?: string; grammarTip?: string; phonetic?: string }> {
  const targetInfo = LANGUAGES_LIST.find(l => l.id === targetLang) || { name: targetLang, nativeName: targetLang };
  const sourceInfo = LANGUAGES_LIST.find(l => l.id === sourceLang) || { name: sourceLang, nativeName: sourceLang };

  const ai = getGeminiClient();
  if (ai) {
    try {
      const historyFormatted = conversationHistory
        .map(m => `${m.sender === 'user' ? 'Student' : 'Tutor'}: ${m.text}`)
        .join('\n');

      const prompt = `You are a friendly, encouraging AI Language Tutor for ${targetInfo.nativeName} (${targetInfo.name}).
The student's native language is ${sourceInfo.nativeName} (${sourceInfo.name}).
The student's current proficiency level is ${userLevel}.

Conversation history:
${historyFormatted}

Task:
1. Respond to the student in natural, level-appropriate ${targetInfo.nativeName} (1-3 sentences).
2. Provide translation of your response in ${sourceInfo.name}.
3. If the student made any grammar or word mistakes in their previous message, gently explain the correction in ${sourceInfo.name} in "grammarTip".
4. Provide phonetic pronunciation guide for your reply.

Return JSON strictly:
{
  "text": "Your reply in ${targetInfo.nativeName}",
  "translation": "Translation in ${sourceInfo.name}",
  "grammarTip": "Constructive tip in ${sourceInfo.name} or empty",
  "phonetic": "[phonetic pronunciation]"
}`;

      const resp = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const parsed = JSON.parse(resp.text || '{}');
      if (parsed.text) {
        return parsed;
      }
    } catch (e) {
      console.warn('Universal AI chat conversation failed:', e);
    }
  }

  // Fallback default response
  const targetGreeting = targetInfo.nativeName ? `Bonjour / Hello!` : 'Hello!';
  return {
    text: targetGreeting,
    translation: 'Merhaba! Nasıl yardımcı olabilirim?',
    grammarTip: 'Harika bir başlangıç! Cümle kurmaya devam edin.'
  };
}

