export interface GermanAlphabetLetter {
  upper: string;
  lower: string;
  pronunciation: string;
  letterSpoken?: string;
  isSpecial?: boolean;
  phoneticAudioSample?: string;
  exampleWord: string;
  exampleWordMeaning: string;
  exampleSentenceDe?: string;
  exampleSentenceTr?: string;
}

export interface TurkishGermanLetterMap {
  turkish: string;
  german: string;
  germanPronunciation: string;
  note: string;
  exampleWordDe?: string;
  exampleWordTr?: string;
  exampleSentenceDe?: string;
  exampleSentenceTr?: string;
}

export interface EssentialVocabulary {
  id: string;
  german: string;
  turkish: string;
  pronunciation?: string;
  category: string;
  article?: string;
  exampleSentence: string;
  exampleSentenceTr: string;
}

export interface GermanNumberItem {
  number: number | string;
  german: string;
  pronunciation: string;
  isSpecial?: boolean;
  note?: string;
  category: '0-12' | '13-19' | '20-1000';
  exampleSentenceDe?: string;
  exampleSentenceTr?: string;
}

export interface PronunciationRule {
  letter: string;
  pronunciation: string;
  example: string;
  examplePronunciation: string;
  meaning: string;
  note?: string;
  isHighlight?: boolean;
  exampleSentenceDe?: string;
  exampleSentenceTr?: string;
}

export interface PronunciationPracticeWord {
  word: string;
  pronunciation: string;
  meaning: string;
  rulesApplied: string;
  exampleSentenceDe?: string;
  exampleSentenceTr?: string;
}

export interface ExtraQuestionItem {
  id: string;
  number: number;
  questionDe: string;
  questionTrLiteral: string;
  questionTr: string;
  answerTemplateDe: string;
  answerTemplateTrLiteral: string;
  answerTemplateTr: string;
  sampleAnswer: string;
  pronunciationNote?: string;
  specialNote?: string;
  category: string;
  iconName: string;
}

// 2. Not: Alltagsdeutsch
export interface AlltagsdeutschItem {
  id: string;
  german: string;
  pronunciation: string;
  turkish: string;
  category: 'begruessung' | 'abschied' | 'andere_saetze';
  regionOrNote?: string;
  isEzber?: boolean;
  exampleSentence?: string;
  exampleSentenceTr?: string;
}

// Hal hatır sorma diyalogları (Formell & Informell)
export interface FeelingDialogueItem {
  id: string;
  type: 'formell' | 'informell';
  questionDe: string;
  questionPronunciation?: string;
  questionTr: string;
  note?: string;
  responses: {
    emoji: string;
    de: string;
    pronunciation?: string;
    tr: string;
    mood: 'positive' | 'neutral' | 'negative';
  }[];
}

// 3. Not: Temalı Kartlar İçin İpuçları (W-Fragen)
export interface WFrageItem {
  id: string;
  german: string;
  turkish: string;
  pronunciation?: string;
  exampleDe: string;
  exampleTr: string;
  answerDe?: string;
  answerTr?: string;
  tipTr: string;
  cardCategory: string;
}

// Önemli Fiiller (40+ Temel A1 Fiili)
export interface EssentialVerbItem {
  id: string;
  german: string;
  pronunciation: string;
  turkish: string;
  isSeparable?: boolean;
  isIrregular?: boolean;
  sampleSentenceDe: string;
  sampleSentenceTr: string;
  conjugationSummary?: string;
  category?: string;
}
export type EssentialVerbA1 = EssentialVerbItem;

// 4. Not: Önemli Edatlar
export interface PrepositionItem {
  id: string;
  german: string;
  turkish: string;
  pronunciation?: string;
  usageType: string;
  exampleSentenceDe: string;
  exampleSentenceTr: string;
  tip?: string;
}
export type EssentialPrepositionA1 = PrepositionItem;

// Sıfatlar & Goethe A1 Konuşma Kartı Kelimeleri (Post-it Notları)
export interface AdjectiveItem {
  id: string;
  german: string;
  turkish: string;
  pronunciation?: string;
  opposite?: string;
  category: 'adjective' | 'housing_card' | 'pronoun';
  exampleSentenceDe: string;
  exampleSentenceTr: string;
}
export type EssentialAdjectiveA1 = AdjectiveItem;
export type EssentialVocabItem = EssentialVocabulary;

// Kendini Tanıtma Rehberi (Sich vorstellen) - A1 Soru ve Cevap Kalıpları
export interface SichVorstellenItem {
  id: string;
  categoryNumber: number;
  categoryNameDe: string;
  categoryNameTr: string;
  subType?: 'tekil' | 'cogul';
  questionDe: string;
  questionPronunciation: string;
  questionTr: string;
  answerTemplateDe: string;
  answerPronunciation: string;
  answerTemplateTr: string;
  sampleAnswerDe: string;
  sampleAnswerTr: string;
  sampleAnswerPronunciation: string;
  note?: string;
}

export interface HobbyVocabularyItem {
  id: string;
  german: string;
  pronunciation: string;
  turkish: string;
  category?: string;
  exampleDe?: string;
  exampleTr?: string;
}

export interface QuizQuestion {
  id: string;
  lessonId: string;
  questionText: string;
  questionSub?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tokenReward: number;
}

export interface CurriculumTopic {
  id: string;
  number: number;
  titleDe: string;
  titleTr: string;
  description: string;
  icon: string;
  creditCost: number; // Derse giriş için gereken kredi/jeton miktarı (0 ise ücretsiz)
  tokenReward: number;
  badge: string;
  estimatedMinutes: number;
}

export interface UserSpellingProfile {
  vorname: string;
  nachname: string;
  geburtsort: string;
  wohnort: string;
  mutter: string;
  vater: string;
  ehepartner: string;
  verlobte: string;
  hobby: string;
  beruf: string;
  telefon: string;
  alter: string;
  // Ekstra sorular profil bilgileri
  hausnummer?: string;
  ausweisnummer?: string;
  vorwahl?: string;
  postleitzahl?: string;
  kennzeichen?: string;
}

export const DEFAULT_USER_PROFILE: UserSpellingProfile = {
  vorname: '',
  nachname: '',
  geburtsort: '',
  wohnort: '',
  mutter: '',
  vater: '',
  ehepartner: '',
  verlobte: '',
  hobby: '',
  beruf: '',
  telefon: '',
  alter: '',
  hausnummer: '',
  ausweisnummer: '',
  vorwahl: '',
  postleitzahl: '',
  kennzeichen: ''
};

export const GERMAN_ALPHABET: GermanAlphabetLetter[] = [
  { upper: 'A', lower: 'a', pronunciation: 'a', letterSpoken: 'A', exampleWord: 'der Apfel', exampleWordMeaning: 'Elma', exampleSentenceDe: 'Der Apfel ist rot und lecker.', exampleSentenceTr: 'Elma kırmızı ve lezzetlidir.' },
  { upper: 'B', lower: 'b', pronunciation: 'be', letterSpoken: 'Be', exampleWord: 'das Buch', exampleWordMeaning: 'Kitap', exampleSentenceDe: 'Das Buch ist sehr interessant.', exampleSentenceTr: 'Kitap çok ilginçtir.' },
  { upper: 'C', lower: 'c', pronunciation: 'tse', letterSpoken: 'Ce', isSpecial: true, exampleWord: 'das Café', exampleWordMeaning: 'Kafe', exampleSentenceDe: 'Wir treffen uns im Café.', exampleSentenceTr: 'Kafede buluşuyoruz.' },
  { upper: 'D', lower: 'd', pronunciation: 'de', letterSpoken: 'De', exampleWord: 'das Danke', exampleWordMeaning: 'Teşekkür', exampleSentenceDe: 'Vielen Dank für Ihre Hilfe!', exampleSentenceTr: 'Yardımınız için çok teşekkürler!' },
  { upper: 'E', lower: 'e', pronunciation: 'e', letterSpoken: 'E', exampleWord: 'das Essen', exampleWordMeaning: 'Yemek', exampleSentenceDe: 'Das Essen schmeckt wunderbar.', exampleSentenceTr: 'Yemek harika tadıyor.' },
  { upper: 'F', lower: 'f', pronunciation: 'ef', letterSpoken: 'Ef', isSpecial: true, exampleWord: 'der Freund', exampleWordMeaning: 'Erkek arkadaş / Dost', exampleSentenceDe: 'Mein Freund wohnt in Berlin.', exampleSentenceTr: 'Arkadaşım Berlin\'de oturuyor.' },
  { upper: 'G', lower: 'g', pronunciation: 'ge', letterSpoken: 'Ge', exampleWord: 'das Geld', exampleWordMeaning: 'Para', exampleSentenceDe: 'Das Geld liegt auf dem Tisch.', exampleSentenceTr: 'Para masanın üstünde duruyor.' },
  { upper: 'H', lower: 'h', pronunciation: 'ha', letterSpoken: 'Ha', isSpecial: true, exampleWord: 'das Haus', exampleWordMeaning: 'Ev', exampleSentenceDe: 'Das Haus hat einen schönen Garten.', exampleSentenceTr: 'Evin güzel bir bahçesi var.' },
  { upper: 'I', lower: 'i', pronunciation: 'i', letterSpoken: 'I', exampleWord: 'der Igel', exampleWordMeaning: 'Kirpi', exampleSentenceDe: 'Der kleine Igel schläft im Garten.', exampleSentenceTr: 'Küçük kirpi bahçede uyuyor.' },
  { upper: 'J', lower: 'j', pronunciation: 'yot', letterSpoken: 'Jott', isSpecial: true, exampleWord: 'die Jacke', exampleWordMeaning: 'Ceket / Mont', exampleSentenceDe: 'Meine Jacke ist warm und neu.', exampleSentenceTr: 'Ceketim sıcak ve yenidir.' },
  { upper: 'K', lower: 'k', pronunciation: 'ka', letterSpoken: 'Ka', isSpecial: true, exampleWord: 'die Katze', exampleWordMeaning: 'Kedi', exampleSentenceDe: 'Die Katze trinkt Milch.', exampleSentenceTr: 'Kedi süt içiyor.' },
  { upper: 'L', lower: 'l', pronunciation: 'el', letterSpoken: 'El', isSpecial: true, exampleWord: 'die Lampe', exampleWordMeaning: 'Lamba', exampleSentenceDe: 'Die Lampe ist hell.', exampleSentenceTr: 'Lamba aydınlıktır.' },
  { upper: 'M', lower: 'm', pronunciation: 'em', letterSpoken: 'Em', isSpecial: true, exampleWord: 'die Mutter', exampleWordMeaning: 'Anne', exampleSentenceDe: 'Meine Mutter kocht das Abendessen.', exampleSentenceTr: 'Annem akşam yemeğini pişiriyor.' },
  { upper: 'N', lower: 'n', pronunciation: 'en', letterSpoken: 'En', isSpecial: true, exampleWord: 'der Name', exampleWordMeaning: 'İsim / Ad', exampleSentenceDe: 'Mein Name ist Ufuk.', exampleSentenceTr: 'Benim adım Ufuk.' },
  { upper: 'O', lower: 'o', pronunciation: 'o', letterSpoken: 'O', exampleWord: 'das Obst', exampleWordMeaning: 'Meyve', exampleSentenceDe: 'Frisches Obst ist gesund.', exampleSentenceTr: 'Taze meyve sağlıklıdır.' },
  { upper: 'P', lower: 'p', pronunciation: 'pe', letterSpoken: 'Pe', exampleWord: 'der Pass', exampleWordMeaning: 'Pasaport', exampleSentenceDe: 'Hier ist mein Reisepass.', exampleSentenceTr: 'İşte benim pasaportum.' },
  { upper: 'Q', lower: 'q', pronunciation: 'ku', letterSpoken: 'Ku', isSpecial: true, exampleWord: 'die Quelle', exampleWordMeaning: 'Kaynak / Pınar', exampleSentenceDe: 'Das Wasser aus der Quelle ist sauber.', exampleSentenceTr: 'Kaynaktan gelen su temizdir.' },
  { upper: 'R', lower: 'r', pronunciation: 'er', letterSpoken: 'Er', isSpecial: true, exampleWord: 'die Reise', exampleWordMeaning: 'Seyahat / Gezi', exampleSentenceDe: 'Die Reise nach Deutschland beginnt morgen.', exampleSentenceTr: 'Almanya seyahati yarın başlıyor.' },
  { upper: 'S', lower: 's', pronunciation: 'es', letterSpoken: 'Es', isSpecial: true, exampleWord: 'die Sonne', exampleWordMeaning: 'Güneş', exampleSentenceDe: 'Die Sonne scheint am Himmel.', exampleSentenceTr: 'Güneş gökyüzünde parlıyor.' },
  { upper: 'T', lower: 't', pronunciation: 'te', letterSpoken: 'Te', exampleWord: 'der Tisch', exampleWordMeaning: 'Masa', exampleSentenceDe: 'Das Buch liegt auf dem Tisch.', exampleSentenceTr: 'Kitap masanın üstünde duruyor.' },
  { upper: 'U', lower: 'u', pronunciation: 'u', letterSpoken: 'U', exampleWord: 'die Uhr', exampleWordMeaning: 'Saat', exampleSentenceDe: 'Wie viel Uhr ist es bitte?', exampleSentenceTr: 'Saat kaç lütfen?' },
  { upper: 'V', lower: 'v', pronunciation: 'fau', letterSpoken: 'Vau', isSpecial: true, exampleWord: 'der Vater', exampleWordMeaning: 'Baba', exampleSentenceDe: 'Mein Vater arbeitet heute.', exampleSentenceTr: 'Babam bugün çalışıyor.' },
  { upper: 'W', lower: 'w', pronunciation: 've', letterSpoken: 'We', isSpecial: true, exampleWord: 'das Wasser', exampleWordMeaning: 'Su', exampleSentenceDe: 'Ich trinke jeden Tag Wasser.', exampleSentenceTr: 'Her gün su içiyorum.' },
  { upper: 'X', lower: 'x', pronunciation: 'iks', letterSpoken: 'Iks', isSpecial: true, exampleWord: 'das Xylofon', exampleWordMeaning: 'Ksilofon', exampleSentenceDe: 'Das Kind spielt Xylofon.', exampleSentenceTr: 'Çocuk ksilofon çalıyor.' },
  { upper: 'Y', lower: 'y', pronunciation: 'üpsilon', letterSpoken: 'Ypsilon', isSpecial: true, exampleWord: 'die Yacht', exampleWordMeaning: 'Yat', exampleSentenceDe: 'Die weiße Yacht fährt auf dem Meer.', exampleSentenceTr: 'Beyaz yat denizde ilerliyor.' },
  { upper: 'Z', lower: 'z', pronunciation: 'tset', letterSpoken: 'Zett', isSpecial: true, exampleWord: 'der Zug', exampleWordMeaning: 'Tren', exampleSentenceDe: 'Der Zug nach Frankfurt fährt ab.', exampleSentenceTr: 'Frankfurt treni hareket ediyor.' },
  // Almanca Özel Harfler (Umlaute & Eszett)
  { upper: 'Ä', lower: 'ä', pronunciation: 'e (uzun e)', letterSpoken: 'Ä', isSpecial: true, exampleWord: 'der Käse', exampleWordMeaning: 'Peynir', exampleSentenceDe: 'Der Käse schmeckt sehr lecker.', exampleSentenceTr: 'Peynir çok lezzetlidir.' },
  { upper: 'Ö', lower: 'ö', pronunciation: 'ö', letterSpoken: 'Ö', exampleWord: 'das Öl', exampleWordMeaning: 'Yağ / Sıvı yağ', exampleSentenceDe: 'Das Olivenöl ist sehr gesund.', exampleSentenceTr: 'Zeytinyağı çok sağlıklıdır.' },
  { upper: 'Ü', lower: 'ü', pronunciation: 'ü', letterSpoken: 'Ü', exampleWord: 'die Übung', exampleWordMeaning: 'Alıştırma / Egzersiz', exampleSentenceDe: 'Diese Übung ist sehr einfach.', exampleSentenceTr: 'Bu alıştırma çok kolaydır.' },
  { upper: 'ß', lower: 'ß', pronunciation: 'eszett (sert s)', letterSpoken: 'Eszett', isSpecial: true, exampleWord: 'die Straße', exampleWordMeaning: 'Cadde / Sokak', exampleSentenceDe: 'Die Straße ist breit und sauber.', exampleSentenceTr: 'Cadde geniş ve temizdir.' },
];

export const TURKISH_GERMAN_CONVERSIONS: TurkishGermanLetterMap[] = [
  { 
    turkish: 'Ş ş', 
    german: 'S s', 
    germanPronunciation: 'es', 
    note: 'Almancada Türkçedeki Ş harfi yerine kodlama ve resmi formlarda S kullanılır ("es" olarak kodlanır).',
    exampleWordDe: 'die Sonne',
    exampleWordTr: 'Güneş',
    exampleSentenceDe: 'Die Sonne scheint heute sehr schön.',
    exampleSentenceTr: 'Bugün güneş çok güzel parlıyor.'
  },
  { 
    turkish: 'Ç ç', 
    german: 'C c', 
    germanPronunciation: 'tse', 
    note: 'Almancada Türkçedeki Ç harfi yerine C kullanılır ("tse" olarak kodlanır).',
    exampleWordDe: 'das Café',
    exampleWordTr: 'Kafe',
    exampleSentenceDe: 'Wir trinken Kaffee im Café.',
    exampleSentenceTr: 'Kafede kahve içiyoruz.'
  },
  { 
    turkish: 'İ ı (I)', 
    german: 'I i', 
    germanPronunciation: 'i', 
    note: 'Almancada noktasız I harfi bulunmaz; I ve İ harfleri standart I/i olarak kodlanır ("i" olarak kodlanır).',
    exampleWordDe: 'der Igel',
    exampleWordTr: 'Kirpi',
    exampleSentenceDe: 'Der Igel läuft im Garten.',
    exampleSentenceTr: 'Kirpi bahçede yürüyor.'
  },
  { 
    turkish: 'Ğ ğ', 
    german: 'G g', 
    germanPronunciation: 'ge', 
    note: 'Almancada yumuşak Ğ harfi yerine G kullanılır ("ge" olarak kodlanır).',
    exampleWordDe: 'der Garten',
    exampleWordTr: 'Bahçe',
    exampleSentenceDe: 'Unser Garten ist sehr groß und grün.',
    exampleSentenceTr: 'Bahçemiz çok büyük ve yeşildir.'
  },
];

export const ESSENTIAL_VOCABULARY: EssentialVocabulary[] = [
  { id: 'voc_buchstabieren', german: 'buchstabieren', pronunciation: 'buh-şta-bii-rın', turkish: 'harf harf kodlamak / hecelemek', category: 'Fiil', exampleSentence: 'Können Sie bitte Ihren Namen buchstabieren?', exampleSentenceTr: 'Lütfen isminizi harf harf kodlayabilir misiniz?' },
  { id: 'voc_vorname', german: 'der Vorname', pronunciation: 'dea foa-naa-mı', turkish: 'ön isim / ad', category: 'Kişisel Bilgi', article: 'der', exampleSentence: 'Mein Vorname ist Ufuk.', exampleSentenceTr: 'Benim adım Ufuk.' },
  { id: 'voc_nachname', german: 'der Nachname / Familienname', pronunciation: 'dea nah-naa-mı / fa-mii-li-ın-naa-mı', turkish: 'soyadı / aile adı', category: 'Kişisel Bilgi', article: 'der', exampleSentence: 'Mein Nachname ist Yıldız.', exampleSentenceTr: 'Benim soyadım Yıldız.' },
  { id: 'voc_geburtsort', german: 'der Geburtsort', pronunciation: 'dea gı-buats-oat', turkish: 'doğum yeri', category: 'Kişisel Bilgi', article: 'der', exampleSentence: 'Mein Geburtsort ist Samsun.', exampleSentenceTr: 'Doğum yerim Samsun.' },
  { id: 'voc_wohnort', german: 'der Wohnort', pronunciation: 'dea voon-oat', turkish: 'ikamet yeri / oturulan şehir', category: 'Kişisel Bilgi', article: 'der', exampleSentence: 'Mein Wohnort ist Berlin.', exampleSentenceTr: 'İkamet ettiğim şehir Berlin.' },
  { id: 'voc_mutter', german: 'die Mutter', pronunciation: 'dii mut-ta', turkish: 'anne', category: 'Aile', article: 'die', exampleSentence: 'Meine Mutter heißt Seyhan.', exampleSentenceTr: 'Annemin adı Seyhan.' },
  { id: 'voc_vater', german: 'der Vater', pronunciation: 'dea faa-ta', turkish: 'baba', category: 'Aile', article: 'der', exampleSentence: 'Mein Vater heißt Yaşar.', exampleSentenceTr: 'Babamın adı Yaşar.' },
  { id: 'voc_ehefrau', german: 'die (Ehe)Frau', pronunciation: 'dii ee-fıraw', turkish: 'kadın eş / hanım', category: 'Aile', article: 'die', exampleSentence: 'Meine Ehefrau heißt Samanur.', exampleSentenceTr: 'Eşimin adı Samanur.' },
  { id: 'voc_ehemann', german: 'der (Ehe)Mann', pronunciation: 'dea ee-man', turkish: 'erkek eş / koca', category: 'Aile', article: 'der', exampleSentence: 'Mein Ehemann ist sehr freundlich.', exampleSentenceTr: 'Eşim çok cana yakındır.' },
  { id: 'voc_verlobte', german: 'die/der Verlobte', pronunciation: 'dii / dea fea-loop-tı', turkish: 'kadın / erkek nişanlı', category: 'Aile', article: 'die/der', exampleSentence: 'Das ist meine Verlobte.', exampleSentenceTr: 'Bu benim nişanlım.' },
  { id: 'voc_beruf', german: 'der Beruf', pronunciation: 'dea bı-ruuf', turkish: 'meslek', category: 'İş & Kariyer', article: 'der', exampleSentence: 'Mein Beruf ist Elektriker.', exampleSentenceTr: 'Mesleğim elektrikçilik.' },
  { id: 'voc_hobby', german: 'das Hobby', pronunciation: 'das ho-bi', turkish: 'hobi / ilgi alanı', category: 'Günlük Yaşam', article: 'das', exampleSentence: 'Mein Hobby ist Fußball spielen.', exampleSentenceTr: 'Hobim futbol oynamaktır.' },
  { id: 'voc_telefon', german: 'die Telefonnummer', pronunciation: 'dii te-le-foon-num-ma', turkish: 'telefon numarası', category: 'İletişim', article: 'die', exampleSentence: 'Meine Telefonnummer ist 0534 610 29 33.', exampleSentenceTr: 'Telefon numaram 0534 610 29 33.' },
  { id: 'voc_alter', german: 'das Alter', pronunciation: 'das al-ta', turkish: 'yaş', category: 'Kişisel Bilgi', article: 'das', exampleSentence: 'Ich bin 25 Jahre alt.', exampleSentenceTr: 'Ben 25 yaşındayım.' }
];

// ==========================================
// 4. SAYFA: DIE ZAHLEN (ALMANCA SAYILAR)
// ==========================================
export const NUMBERS_0_12: GermanNumberItem[] = [
  { number: 0, german: 'null', pronunciation: 'nul', category: '0-12', exampleSentenceDe: 'Die Temperatur ist null Grad.', exampleSentenceTr: 'Sıcaklık sıfır derece.' },
  { number: 1, german: 'eins', pronunciation: 'ayns', category: '0-12', exampleSentenceDe: 'Ich habe einen Apfel.', exampleSentenceTr: 'Bir elmam var.' },
  { number: 2, german: 'zwei', pronunciation: 'tsvay', isSpecial: true, note: 'Özel telaffuz: "tsvay"', category: '0-12', exampleSentenceDe: 'Wir sind zwei Personen.', exampleSentenceTr: 'Biz iki kişiyiz.' },
  { number: 3, german: 'drei', pronunciation: 'dıray', category: '0-12', exampleSentenceDe: 'Ich trinke drei Tassen Tee am Tag.', exampleSentenceTr: 'Günde üç fincan çay içiyorum.' },
  { number: 4, german: 'vier', pronunciation: 'fiir', category: '0-12', exampleSentenceDe: 'Das Auto hat vier Räder.', exampleSentenceTr: 'Arabanın dört tekerleği var.' },
  { number: 5, german: 'fünf', pronunciation: 'fünf', category: '0-12', exampleSentenceDe: 'Ich habe fünf Euro in der Tasche.', exampleSentenceTr: 'Cebimde beş Euro var.' },
  { number: 6, german: 'sechs', pronunciation: 'zeks', isSpecial: true, note: 'chs harf grubu "ks" olarak okunur: "zeks"', category: '0-12', exampleSentenceDe: 'Wir frühstücken um sechs Uhr morgens.', exampleSentenceTr: 'Sabah saat altıda kahvaltı yapıyoruz.' },
  { number: 7, german: 'sieben', pronunciation: 'zii-bın', isSpecial: true, note: 'ie uzatılarak söylenir: "zii-bın"', category: '0-12', exampleSentenceDe: 'Die Woche hat sieben Tage.', exampleSentenceTr: 'Haftada yedi gün vardır.' },
  { number: 8, german: 'acht', pronunciation: 'aht', category: '0-12', exampleSentenceDe: 'Der Unterricht beginnt um acht Uhr.', exampleSentenceTr: 'Ders saat sekizde başlıyor.' },
  { number: 9, german: 'neun', pronunciation: 'noyn', category: '0-12', exampleSentenceDe: 'Das Zimmer Nummer neun ist frei.', exampleSentenceTr: 'Dokuz numaralı oda boştur.' },
  { number: 10, german: 'zehn', pronunciation: 'tseen', isSpecial: true, note: 'z harfi "ts" ve ortadaki h "e"yi uzatır: "tseen"', category: '0-12', exampleSentenceDe: 'Ich bleibe zehn Minuten hier.', exampleSentenceTr: 'Burada on dakika kalacağım.' },
  { number: 11, german: 'elf', pronunciation: 'elf', category: '0-12', exampleSentenceDe: 'Es ist elf Uhr vormittags.', exampleSentenceTr: 'Öğleden önce saat on bir.' },
  { number: 12, german: 'zwölf', pronunciation: 'tsvölf', isSpecial: true, note: 'Özel telaffuz: "tsvölf"', category: '0-12', exampleSentenceDe: 'Ein Jahr hat zwölf Monate.', exampleSentenceTr: 'Bir yılda on iki ay vardır.' },
];

export const NUMBERS_13_19: GermanNumberItem[] = [
  { number: 13, german: 'dreizehn', pronunciation: 'dıray-tseen', category: '13-19', exampleSentenceDe: 'Er ist dreizehn Jahre alt.', exampleSentenceTr: 'O on üç yaşında.' },
  { number: 14, german: 'vierzehn', pronunciation: 'fiir-tseen', category: '13-19', exampleSentenceDe: 'Ich habe vierzehn Bücher gelesen.', exampleSentenceTr: 'On dört kitap okudum.' },
  { number: 15, german: 'fünfzehn', pronunciation: 'fünf-tseen', category: '13-19', exampleSentenceDe: 'Der Bus kommt in fünfzehn Minuten.', exampleSentenceTr: 'Otobüs on beş dakika içinde geliyor.' },
  { number: 16, german: 'sechzehn', pronunciation: 'zeh-tseen', isSpecial: true, note: 'Kural: "sechs"teki -s harfi düşer ve "zeh-tseen" okunur!', category: '13-19', exampleSentenceDe: 'Sie ist sechzehn Jahre alt.', exampleSentenceTr: 'O on altı yaşında.' },
  { number: 17, german: 'siebzehn', pronunciation: 'ziip-tseen', isSpecial: true, note: 'Kural: "sieben"deki -en hecesi düşer ve "ziip-tseen" okunur!', category: '13-19', exampleSentenceDe: 'Das Ticket kostet siebzehn Euro.', exampleSentenceTr: 'Bilet on yedi Euro tutuyor.' },
  { number: 18, german: 'achtzehn', pronunciation: 'aht-tseen', category: '13-19', exampleSentenceDe: 'Mit achtzehn darf man wählen.', exampleSentenceTr: 'On sekiz yaşında oy kullanılabilir.' },
  { number: 19, german: 'neunzehn', pronunciation: 'noyn-tseen', category: '13-19', exampleSentenceDe: 'Ich kaufe neunzehn Briefmarken.', exampleSentenceTr: 'On dokuz posta pulu alıyorum.' },
];

export const NUMBERS_20_1000: GermanNumberItem[] = [
  { number: 20, german: 'zwanzig', pronunciation: 'tsvan-tsih', isSpecial: true, note: 'Telaffuz: "tsvan-tsih" (-ig kuralı)', category: '20-1000', exampleSentenceDe: 'Ich bin zwanzig Jahre alt.', exampleSentenceTr: 'Yirmi yaşındayım.' },
  { number: 30, german: 'dreißig', pronunciation: 'dıray-sih', isSpecial: true, note: 'İstisna: -zig yerine -ßig kullanılır!', category: '20-1000', exampleSentenceDe: 'Der Monat hat dreißig Tage.', exampleSentenceTr: 'Ay otuz gündür.' },
  { number: 40, german: 'vierzig', pronunciation: 'fiir-tsih', category: '20-1000', exampleSentenceDe: 'Die Fahrt dauert vierzig Minuten.', exampleSentenceTr: 'Yolculuk kırk dakika sürüyor.' },
  { number: 50, german: 'fünfzig', pronunciation: 'fünf-tsih', category: '20-1000', exampleSentenceDe: 'Hier gilt Tempo fünfzig.', exampleSentenceTr: 'Burada hız sınırı ellidir.' },
  { number: 60, german: 'sechzig', pronunciation: 'zeh-tsih', isSpecial: true, note: 'Kural: "sechs"teki -s harfi düşer!', category: '20-1000', exampleSentenceDe: 'Eine Stunde hat sechzig Minuten.', exampleSentenceTr: 'Bir saat altmış dakikadır.' },
  { number: 70, german: 'siebzig', pronunciation: 'ziip-tsih', isSpecial: true, note: 'Kural: "sieben"deki -en hecesi düşer!', category: '20-1000', exampleSentenceDe: 'Mein Opa ist siebzig Jahre alt.', exampleSentenceTr: 'Dedem yetmiş yaşında.' },
  { number: 80, german: 'achtzig', pronunciation: 'aht-tsih', category: '20-1000', exampleSentenceDe: 'Das Buch hat achtzig Seiten.', exampleSentenceTr: 'Kitap seksen sayfadır.' },
  { number: 90, german: 'neunzig', pronunciation: 'noyn-tsih', category: '20-1000', exampleSentenceDe: 'Das neue Kleid kostet neunzig Euro.', exampleSentenceTr: 'Yeni elbise doksan Euro tutuyor.' },
  { number: 100, german: '(ein)hundert', pronunciation: '(ayn)hun-dat', category: '20-1000', exampleSentenceDe: 'Das Hotel hat einhundert Zimmer.', exampleSentenceTr: 'Otelin yüz odası var.' },
  { number: 1000, german: '(ein)tausend', pronunciation: '(ayn)tau-zınt', category: '20-1000', exampleSentenceDe: 'Eintausend Menschen besuchen das Fest.', exampleSentenceTr: 'Bin kişi festivali ziyaret ediyor.' },
];

export interface CompoundNumberExample {
  number: number;
  breakdown: string[];
  writtenSpaced: string;
  writtenStandard: string;
  pronunciation: string;
  ruleExplanation: string;
}

export const COMPOUND_NUMBER_EXAMPLES: CompoundNumberExample[] = [
  {
    number: 25,
    breakdown: ['5 (fünf)', 'und', '20 (zwanzig)'],
    writtenSpaced: 'fünf und zwanzig',
    writtenStandard: 'fünfundzwanzig',
    pronunciation: 'fünf-unt-tsvan-tsih',
    ruleExplanation: 'Almancada 21-99 arası sayılarda önce birler basamağı, sonra "und" (ve), en son onlar basamağı söylenir: 5 + und + 20'
  },
  {
    number: 287,
    breakdown: ['200 (zweihundert)', '7 (sieben)', 'und', '80 (achtzig)'],
    writtenSpaced: 'zweihundert sieben und achtzig',
    writtenStandard: 'zweihundertsiebenundachtzig',
    pronunciation: 'tsvay-hun-dat zii-bın-unt-aht-tsih',
    ruleExplanation: 'Yüzler basamağı başa gelir: 200 + 7 + und + 80'
  },
  {
    number: 3461,
    breakdown: ['3000 (dreitausend)', '400 (vierhundert)', '1 (ein)', 'und', '60 (sechzig)'],
    writtenSpaced: 'dreitausend vierhundert ein und sechzig',
    writtenStandard: 'dreitausendvierhunderteinundsechzig',
    pronunciation: 'dıray-tau-zınt fiir-hun-dat ayn-unt-zeh-tsih',
    ruleExplanation: 'Binler + Yüzler + (Birler + und + Onlar): 3000 + 400 + 1 + und + 60'
  }
];

// Helper to convert any number 0-999999 to German words
export const convertNumberToGerman = (num: number): { wordsSpaced: string; wordsJoined: string; breakdown: string } => {
  if (isNaN(num) || num < 0 || num > 999999) {
    return { wordsSpaced: '', wordsJoined: '', breakdown: '' };
  }

  const ones = ['', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'];
  const teens = ['zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
  const tens = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];

  if (num === 0) return { wordsSpaced: 'null', wordsJoined: 'null', breakdown: '0 = null' };

  const getUnderHundred = (n: number, isEndOfWord: boolean = true): { spaced: string; joined: string } => {
    if (n === 0) return { spaced: '', joined: '' };
    if (n < 10) {
      if (n === 1 && !isEndOfWord) return { spaced: 'ein', joined: 'ein' };
      return { spaced: ones[n], joined: ones[n] };
    }
    if (n >= 10 && n < 20) {
      return { spaced: teens[n - 10], joined: teens[n - 10] };
    }
    const unit = n % 10;
    const ten = Math.floor(n / 10);
    if (unit === 0) {
      return { spaced: tens[ten], joined: tens[ten] };
    }
    const unitWord = unit === 1 ? 'ein' : ones[unit];
    return {
      spaced: `${unitWord} und ${tens[ten]}`,
      joined: `${unitWord}und${tens[ten]}`
    };
  };

  const getUnderThousand = (n: number): { spaced: string; joined: string } => {
    const h = Math.floor(n / 100);
    const rem = n % 100;
    let hSpaced = '';
    let hJoined = '';
    if (h > 0) {
      const hWord = h === 1 ? 'ein' : ones[h];
      hSpaced = `${hWord}hundert`;
      hJoined = `${hWord}hundert`;
    }
    const remResult = getUnderHundred(rem, true);
    const spacedParts = [hSpaced, remResult.spaced].filter(Boolean);
    const joined = `${hJoined}${remResult.joined}`;
    return { spaced: spacedParts.join(' '), joined };
  };

  const thousands = Math.floor(num / 1000);
  const remainder = num % 1000;

  let thousandSpaced = '';
  let thousandJoined = '';

  if (thousands > 0) {
    const tResult = getUnderThousand(thousands);
    const tWord = thousands === 1 ? 'ein' : tResult.joined;
    thousandSpaced = `${tResult.spaced}tausend`;
    thousandJoined = `${tWord}tausend`;
  }

  const remResult = getUnderThousand(remainder);
  const spacedFinal = [thousandSpaced, remResult.spaced].filter(Boolean).join(' ');
  const joinedFinal = `${thousandJoined}${remResult.joined}`;

  return {
    wordsSpaced: spacedFinal,
    wordsJoined: joinedFinal,
    breakdown: `Sayı: ${num}`
  };
};

export interface DialogueConfig {
  id: keyof UserSpellingProfile;
  number: number;
  questionDe: string;
  questionTr: string;
  targetConcept: string;
  labelTr: string;
  type?: 'text' | 'number';
}

export const DIALOGUE_CONFIGS: DialogueConfig[] = [
  {
    id: 'vorname',
    number: 1,
    questionDe: 'Buchstabieren Sie bitte Ihren Vornamen!',
    questionTr: 'Lütfen isminizi kodlayınız!',
    targetConcept: 'İsim (Vorname)',
    labelTr: 'Adınız'
  },
  {
    id: 'nachname',
    number: 2,
    questionDe: 'Buchstabieren Sie bitte Ihren Nachnamen / Familiennamen!',
    questionTr: 'Lütfen soyadınızı kodlayınız!',
    targetConcept: 'Soyisim (Nachname)',
    labelTr: 'Soyadınız'
  },
  {
    id: 'geburtsort',
    number: 3,
    questionDe: 'Buchstabieren Sie bitte Ihren Geburtsort!',
    questionTr: 'Lütfen doğum yerinizi kodlayınız!',
    targetConcept: 'Doğum Yeri (Geburtsort)',
    labelTr: 'Doğum Yeriniz'
  },
  {
    id: 'wohnort',
    number: 4,
    questionDe: 'Buchstabieren Sie bitte Ihren Wohnort!',
    questionTr: 'Lütfen ikamet yerinizi kodlayınız!',
    targetConcept: 'İkamet Yeri (Wohnort)',
    labelTr: 'İkamet Ettiğiniz Şehir'
  },
  {
    id: 'mutter',
    number: 5,
    questionDe: 'Buchstabieren Sie bitte den Namen von Ihrer Mutter!',
    questionTr: 'Lütfen annenizin ismini kodlayınız!',
    targetConcept: 'Anne İsmi (Mutter)',
    labelTr: 'Annenizin Adı'
  },
  {
    id: 'vater',
    number: 6,
    questionDe: 'Buchstabieren Sie bitte den Namen von Ihrem Vater!',
    questionTr: 'Lütfen babanızın ismini kodlayınız!',
    targetConcept: 'Baba İsmi (Vater)',
    labelTr: 'Babanızın Adı'
  },
  {
    id: 'ehepartner',
    number: 7,
    questionDe: 'Buchstabieren Sie bitte den Namen von Ihrer (Ehe)Frau / von Ihrem (Ehe)Mann!',
    questionTr: 'Lütfen eşinizin ismini kodlayınız!',
    targetConcept: 'Eş İsmi ((Ehe)Frau / (Ehe)Mann)',
    labelTr: 'Eşinizin Adı'
  },
  {
    id: 'verlobte',
    number: 8,
    questionDe: 'Buchstabieren Sie bitte den Namen von Ihrer/ Ihrem Verlobten!',
    questionTr: 'Lütfen nişanlınızın ismini kodlayınız!',
    targetConcept: 'Nişanlı İsmi (Verlobte/r)',
    labelTr: 'Nişanlınızın Adı'
  },
  {
    id: 'hobby',
    number: 9,
    questionDe: 'Buchstabieren Sie bitte Ihr Hobby!',
    questionTr: 'Lütfen hobinizi kodlayınız!',
    targetConcept: 'Hobi (Hobby)',
    labelTr: 'Hobiniz'
  },
  {
    id: 'beruf',
    number: 10,
    questionDe: 'Buchstabieren Sie bitte Ihren Beruf!',
    questionTr: 'Lütfen mesleğinizi kodlayınız!',
    targetConcept: 'Meslek (Beruf)',
    labelTr: 'Mesleğiniz'
  },
  {
    id: 'telefon',
    number: 11,
    questionDe: 'Buchstabieren Sie bitte Ihre Telefonnummer!',
    questionTr: 'Lütfen telefon numaranızı kodlayınız!',
    targetConcept: 'Telefon Numarası (Telefonnummer)',
    labelTr: 'Telefon Numaranız',
    type: 'number'
  },
  {
    id: 'alter',
    number: 12,
    questionDe: 'Buchstabieren Sie bitte Ihr Alter!',
    questionTr: 'Lütfen yaşınızı kodlayınız!',
    targetConcept: 'Yaş (Alter)',
    labelTr: 'Yaşınız',
    type: 'number'
  }
];

// ==========================================
// KENDİNİ TANITMA REHBERİ (SICH VORSTELLEN - DOKÜMAN 1 & 2)
// ==========================================
export const SICH_VORSTELLEN_INTRO = {
  titleDe: 'sich vorstellen',
  titleTr: 'kendini tanıtma',
  titlePronunciation: 'zih for-ştel-lın',
  politeRequest1De: 'Stellen Sie sich bitte vor!',
  politeRequest1Tr: 'Lütfen kendinizi tanıtınız!',
  politeRequest1Pronunciation: 'Ştel-lın Zii zih bi-tı for!',
  politeRequest2De: 'Können Sie sich bitte vorstellen?',
  politeRequest2Tr: 'Kendinizi tanıtabilir misiniz?',
  politeRequest2Pronunciation: 'Kön-nın Zii zih bi-tı for-ştel-lın?'
};

export const SICH_VORSTELLEN_DATA: SichVorstellenItem[] = [
  {
    id: 'sv_name',
    categoryNumber: 1,
    categoryNameDe: 'NAME',
    categoryNameTr: 'İSİM',
    questionDe: 'Wie heißen Sie?',
    questionPronunciation: 'Vii haysın Zii?',
    questionTr: 'İsminiz nedir?',
    answerTemplateDe: 'Ich heiße ........',
    answerPronunciation: 'İh haysı ........',
    answerTemplateTr: 'Benim adım ........',
    sampleAnswerDe: 'Ich heiße Ufuk.',
    sampleAnswerTr: 'Benim adım Ufuk.',
    sampleAnswerPronunciation: 'İh haysı Ufuk.',
    note: 'Resmi kendini tanıtma soru ve cevap kalıbı.'
  },
  {
    id: 'sv_alter',
    categoryNumber: 2,
    categoryNameDe: 'ALTER',
    categoryNameTr: 'YAŞ',
    questionDe: 'Wie alt sind Sie?',
    questionPronunciation: 'Vii alt zind Zii?',
    questionTr: 'Kaç yaşındasınız?',
    answerTemplateDe: 'Ich bin ........ Jahre alt.',
    answerPronunciation: 'İh bin ........ Yaare alt.',
    answerTemplateTr: 'Ben ........ yaşındayım.',
    sampleAnswerDe: 'Ich bin 30 Jahre alt.',
    sampleAnswerTr: 'Ben 30 yaşındayım.',
    sampleAnswerPronunciation: 'İh bin dray-siç Yaare alt.',
    note: '30 sayısı: dreißig [dray-siç].'
  },
  {
    id: 'sv_land',
    categoryNumber: 3,
    categoryNameDe: 'LAND',
    categoryNameTr: 'ÜLKE',
    questionDe: 'Woher kommen Sie?',
    questionPronunciation: 'Voher komın Zii?',
    questionTr: 'Nereden geliyorsunuz?',
    answerTemplateDe: 'Ich komme aus der Türkei.',
    answerPronunciation: 'İh komı aus der Türkay.',
    answerTemplateTr: 'Ben Türkiye\'den geliyorum.',
    sampleAnswerDe: 'Ich komme aus der Türkei.',
    sampleAnswerTr: 'Ben Türkiye\'den geliyorum.',
    sampleAnswerPronunciation: 'İh komı aus der Türkay.',
    note: 'Türkiye "die Türkei" olduğu için "aus der Türkei" şeklinde kullanılır.'
  },
  {
    id: 'sv_wohnort',
    categoryNumber: 4,
    categoryNameDe: 'WOHNORT',
    categoryNameTr: 'İKAMET YERİ',
    questionDe: 'Wo wohnen Sie?',
    questionPronunciation: 'Vo vonın Zii?',
    questionTr: 'Nerede ikamet ediyorsunuz? (Nerede oturuyorsunuz?)',
    answerTemplateDe: 'Ich wohne in ......',
    answerPronunciation: 'İh voni in ......',
    answerTemplateTr: 'Ben ..............\'da ikamet ediyorum.',
    sampleAnswerDe: 'Ich wohne in Istanbul / Berlin.',
    sampleAnswerTr: 'İstanbul\'da / Berlin\'de oturuyorum.',
    sampleAnswerPronunciation: 'İh voni in Istanbul / Berlin.',
    note: 'Şehir isimlerinin önüne edat olarak "in" gelir.'
  },
  {
    id: 'sv_sprachen',
    categoryNumber: 5,
    categoryNameDe: 'SPRACHEN',
    categoryNameTr: 'DİLLER',
    questionDe: 'Welche Sprachen sprechen Sie?',
    questionPronunciation: 'Velhe Şprahın şprehın Zii?',
    questionTr: 'Hangi dilleri konuşuyorsunuz?',
    answerTemplateDe: 'Ich spreche Türkisch und etwas Deutsch.',
    answerPronunciation: 'İh şprehı Türkiş und etvas Doyç.',
    answerTemplateTr: 'Ben Türkçe ve biraz Almanca konuşuyorum.',
    sampleAnswerDe: 'Ich spreche Türkisch, Englisch und etwas Deutsch.',
    sampleAnswerTr: 'Türkçe, İngilizce ve biraz Almanca konuşuyorum.',
    sampleAnswerPronunciation: 'İh şprehı Türkiş, Engliş und etvas Doyç.',
    note: '"etwas" kelimesi "biraz" anlamına gelir.'
  },
  {
    id: 'sv_beruf',
    categoryNumber: 6,
    categoryNameDe: 'BERUF',
    categoryNameTr: 'MESLEK',
    questionDe: 'Was ist Ihr Beruf?',
    questionPronunciation: 'Vas ist ia Beruf?',
    questionTr: 'Mesleğiniz nedir?',
    answerTemplateDe: 'Ich bin ...... (von Beruf.)',
    answerPronunciation: 'İh bin ...... fon Beruf.',
    answerTemplateTr: 'Mesleğim ..............\'dır.',
    sampleAnswerDe: 'Ich bin Lehrerin / Lehrer von Beruf.',
    sampleAnswerTr: 'Mesleğim öğretmenliktir / Öğretmenim.',
    sampleAnswerPronunciation: 'İh bin Lehrerin fon Beruf.',
    note: 'Kadın mesleklerinde sonuna "-in" eklenir (Lehrerin, Ärztin, Verkäuferin).'
  },
  {
    id: 'sv_hobby_singular',
    categoryNumber: 7,
    categoryNameDe: 'HOBBY (1- TEKİL)',
    categoryNameTr: 'HOBİ (TEKİL)',
    subType: 'tekil',
    questionDe: 'Was ist Ihr Hobby?',
    questionPronunciation: 'Vas ist ia Hobi?',
    questionTr: 'Hobiniz nedir?',
    answerTemplateDe: 'Mein Hobby ist ........',
    answerPronunciation: 'Mayn Hobi ist ........',
    answerTemplateTr: 'Benim hobim ............\'dır.',
    sampleAnswerDe: 'Mein Hobby ist Buch lesen.',
    sampleAnswerTr: 'Benim hobim kitap okumaktır.',
    sampleAnswerPronunciation: 'Mayn Hobi ist Buh lezın.',
    note: 'Tek bir hobi için "ist" yardımcı fiili kullanılır.'
  },
  {
    id: 'sv_hobby_plural',
    categoryNumber: 8,
    categoryNameDe: 'HOBBYS (2- ÇOĞUL)',
    categoryNameTr: 'HOBİLER (ÇOĞUL)',
    subType: 'cogul',
    questionDe: 'Was sind Ihre Hobbys?',
    questionPronunciation: 'Vas zind iire Hobiis?',
    questionTr: 'Hobileriniz nelerdir?',
    answerTemplateDe: 'Meine Hobbys sind ........ und ........',
    answerPronunciation: 'Mayne Hobiis zind ........ und ........',
    answerTemplateTr: 'Benim hobilerim ........ ve ........\'dır.',
    sampleAnswerDe: 'Meine Hobbys sind Musik hören und Fußball spielen.',
    sampleAnswerTr: 'Benim hobilerim müzik dinlemek ve futbol oynamaktır.',
    sampleAnswerPronunciation: 'Mayne Hobiis zind Muzik hörın und Fusbal şpiilın.',
    note: 'Birden fazla hobi için "Meine Hobbys sind..." kalıbı kullanılır.'
  }
];

export const HOBBY_VOCABULARY_DATA: HobbyVocabularyItem[] = [
  { id: 'hb_1', german: 'Buch lesen', pronunciation: 'Buh lezın', turkish: 'Kitap okumak', exampleDe: 'Mein Hobby ist Buch lesen.', exampleTr: 'Hobim kitap okumaktır.' },
  { id: 'hb_2', german: 'Musik hören', pronunciation: 'Muzik hörın', turkish: 'Müzik dinlemek', exampleDe: 'Ich höre gern Musik.', exampleTr: 'Severek müzik dinlerim.' },
  { id: 'hb_3', german: 'angeln', pronunciation: 'angıln', turkish: 'Balık tutmak', exampleDe: 'Am Wochenende gehe ich angeln.', exampleTr: 'Hafta sonu balık tutmaya gidiyorum.' },
  { id: 'hb_4', german: 'Gitarre spielen', pronunciation: 'Gitarı şpiilın', turkish: 'Gitar çalmak', exampleDe: 'Er spielt sehr gut Gitarre.', exampleTr: 'O çok iyi gitar çalıyor.' },
  { id: 'hb_5', german: 'Fußball spielen', pronunciation: 'Fusbal şpiilın', turkish: 'Futbol oynamak', exampleDe: 'Wir spielen am Sonntag Fußball.', exampleTr: 'Pazar günü futbol oynuyoruz.' },
  { id: 'hb_6', german: 'tanzen', pronunciation: 'tantsın', turkish: 'Dans etmek', exampleDe: 'Sie tanzt wunderbar.', exampleTr: 'O harika dans ediyor.' },
  { id: 'hb_7', german: 'malen', pronunciation: 'maalın', turkish: 'Resim yapmak', exampleDe: 'Meine Tochter liebt malen.', exampleTr: 'Kızım resim yapmayı çok seviyor.' },
  { id: 'hb_8', german: 'kochen', pronunciation: 'kohın', turkish: 'Yemek pişirmek', exampleDe: 'Kochen ist mein Lieblingshobby.', exampleTr: 'Yemek pişirmek en sevdiğim hobimdir.' },
  { id: 'hb_9', german: 'reisen', pronunciation: 'rayzın', turkish: 'Seyahat etmek', exampleDe: 'Ich reise gern nach Deutschland.', exampleTr: 'Severek Almanya\'ya seyahat ederim.' },
  { id: 'hb_10', german: 'schwimmen', pronunciation: 'şvimın', turkish: 'Yüzmek', exampleDe: 'Im Sommer gehe ich schwimmen.', exampleTr: 'Yazın yüzmeye giderim.' },
  { id: 'hb_11', german: 'Sport machen', pronunciation: 'Şport mahın', turkish: 'Spor yapmak', exampleDe: 'Jeden Morgen mache ich Sport.', exampleTr: 'Her sabah spor yaparım.' },
  { id: 'hb_12', german: 'fotografieren', pronunciation: 'fotografiirın', turkish: 'Fotoğraf çekmek', exampleDe: 'Ich fotografiere gern die Natur.', exampleTr: 'Doğayı fotoğraflamayı severim.' }
];

export const GERMAN_NUMBER_MAP: Record<string, string> = {
  '0': 'null',
  '1': 'eins',
  '2': 'zwei',
  '3': 'drei',
  '4': 'vier',
  '5': 'fünf',
  '6': 'sechs',
  '7': 'sieben',
  '8': 'acht',
  '9': 'neun'
};

// Helper to convert any word into German spelled letters
export const getGermanSpelling = (inputWord: string): { 
  original: string; 
  normalized: string; 
  phonetics: string[]; 
  phoneticString: string;
  chips: { char: string; phonetic: string }[];
} => {
  const clean = (inputWord || '').trim();
  if (!clean) {
    return { original: '', normalized: '', phonetics: [], phoneticString: '', chips: [] };
  }

  // Turkish char replacements according to Image 1
  const map: Record<string, string> = {
    'ş': 's', 'Ş': 'S',
    'ç': 'c', 'Ç': 'C',
    'ı': 'i', 'I': 'I',
    'ğ': 'g', 'Ğ': 'G',
    'ö': 'ö', 'Ö': 'Ö',
    'ü': 'ü', 'Ü': 'Ü',
    'İ': 'I'
  };

  const letterPhoneticMap: Record<string, string> = {
    'a': 'a',
    'b': 'be',
    'c': 'tse',
    'd': 'de',
    'e': 'e',
    'f': 'ef',
    'g': 'ge',
    'h': 'ha',
    'i': 'i',
    'j': 'yot',
    'k': 'ka',
    'l': 'el',
    'm': 'em',
    'n': 'en',
    'o': 'o',
    'p': 'pe',
    'q': 'ku',
    'r': 'er',
    's': 'es',
    't': 'te',
    'u': 'u',
    'v': 'fau',
    'w': 've',
    'x': 'iks',
    'y': 'üpsilon',
    'z': 'tset',
    'ä': 'e',
    'ö': 'ö',
    'ü': 'ü',
    'ß': 'eszett'
  };

  let normalized = '';
  for (const char of clean) {
    if (map[char]) {
      normalized += map[char];
    } else {
      normalized += char;
    }
  }

  const phonetics: string[] = [];
  const chips: { char: string; phonetic: string }[] = [];

  for (let i = 0; i < normalized.length; i++) {
    const rawChar = normalized[i];
    const lowerChar = rawChar.toLowerCase();

    if (letterPhoneticMap[lowerChar]) {
      const ph = letterPhoneticMap[lowerChar];
      phonetics.push(ph);
      chips.push({ char: rawChar.toUpperCase(), phonetic: ph });
    } else if (GERMAN_NUMBER_MAP[rawChar]) {
      const ph = GERMAN_NUMBER_MAP[rawChar];
      phonetics.push(ph);
      chips.push({ char: rawChar, phonetic: ph });
    } else if (rawChar === ' ') {
      phonetics.push(' ');
      chips.push({ char: '␣', phonetic: 'boşluk' });
    } else {
      phonetics.push(rawChar);
      chips.push({ char: rawChar, phonetic: rawChar });
    }
  }

  return {
    original: clean,
    normalized: normalized.toUpperCase(),
    phonetics,
    phoneticString: phonetics.filter(p => p !== ' ').join(' - '),
    chips
  };
};

export const loadStoredUserProfile = (): UserSpellingProfile => {
  try {
    const data = localStorage.getItem('user_spelling_profile');
    if (data) {
      return { ...DEFAULT_USER_PROFILE, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Error loading stored user profile:', e);
  }
  return DEFAULT_USER_PROFILE;
};

export const saveStoredUserProfile = (profile: UserSpellingProfile): void => {
  try {
    localStorage.setItem('user_spelling_profile', JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving user profile:', e);
  }
};

// ==========================================
// 1. DERS KONULARI / MODÜLLER (TOPICS)
// ==========================================
export const CURRICULUM_TOPICS: CurriculumTopic[] = [
  {
    id: 'alphabet',
    number: 1,
    titleDe: 'Das Alphabet',
    titleTr: 'Alman Alfabesi & Kodlama Harfleri',
    description: '30 Harf, özel karakterler (ä, ö, ü, ß), fonetik okunuşlar ve Türkçe harf dönüşüm kuralları.',
    icon: 'Type',
    creditCost: 0, // Ücretsiz Başlangıç Dersi
    tokenReward: 50,
    badge: 'Ders 1 (Ücretsiz)',
    estimatedMinutes: 5
  },
  {
    id: 'numbers',
    number: 2,
    titleDe: 'Die Zahlen',
    titleTr: 'Almanca Sayılar (0 - 1000)',
    description: '0-12, 13-19 (-s ve -en düşmesi), onluklar, yüzlükler, birleşik sayı mantığı ve Sayı Okuma Laboratuvarı.',
    icon: 'Hash',
    creditCost: 10,
    tokenReward: 60,
    badge: 'Ders 2',
    estimatedMinutes: 7
  },
  {
    id: 'spelling',
    number: 3,
    titleDe: 'Sich vorstellen & Buchstabieren',
    titleTr: 'Kendini Tanıtma Rehberi & Kodlama',
    description: 'Sich vorstellen (7 Ana Tanıtım Kalıbı), 12 Popüler Hobi, 12 Aşamalı Fonetik Kodlama ve 14 Form Kelimesi.',
    icon: 'UserCheck',
    creditCost: 15,
    tokenReward: 70,
    badge: 'Ders 3',
    estimatedMinutes: 10
  },
  {
    id: 'pronunciation',
    number: 4,
    titleDe: 'Die Ausspracheregeln',
    titleTr: 'Okuma ve Telaffuz Kuralları',
    description: '20 Harf grubu (ch, ck, sp, st, pf, sch, tsch, tion, chen...), "H" harfi kuralı ve 10 pratik kelime.',
    icon: 'Volume2',
    creditCost: 15,
    tokenReward: 60,
    badge: 'Ders 4',
    estimatedMinutes: 8
  },
  {
    id: 'extra_questions',
    number: 5,
    titleDe: 'Ekstra Sorular & Şablonlar',
    titleTr: 'Resmi & Günlük Soru-Cevap Kalıpları',
    description: 'Telefon, Kimlik/TC, Kapı No, Alan Kodu, Kilometre (Circa), Posta Kodu (PLZ) ve Araç Plakası.',
    icon: 'MessageSquare',
    creditCost: 20,
    tokenReward: 70,
    badge: 'Ders 5',
    estimatedMinutes: 8
  },
  {
    id: 'alltagsdeutsch',
    number: 6,
    titleDe: 'Alltagsdeutsch',
    titleTr: 'Selamlaşma, Veda, Hal-Hatır & Nezaket',
    description: 'Hallo, Moin, Servus, Grüß Gott, Tschüss, Auf Wiedersehen, Formell/Informell hal-hatır ve günlük ezber kalıpları.',
    icon: 'Smile',
    creditCost: 20,
    tokenReward: 75,
    badge: 'Ders 6 (2. Not)',
    estimatedMinutes: 8
  },
  {
    id: 'w_fragen',
    number: 7,
    titleDe: 'W-Fragen & Temalı Kartlar',
    titleTr: '11 Soru Kelimesi & Goethe Sınav İpuçları',
    description: 'Wo, Wie, Wann, Wohin, Welche, Wie oft, Wie viel, Woher, Warum, Wer, Was ve sınav kartı soru üretimi.',
    icon: 'HelpCircle',
    creditCost: 25,
    tokenReward: 70,
    badge: 'Ders 7 (3. Not)',
    estimatedMinutes: 7
  },
  {
    id: 'important_verbs',
    number: 8,
    titleDe: 'Wichtige Verben (Önemli Fiiller)',
    titleTr: '40+ Temel A1 Fiili, Çekimler & Cümleler',
    description: 'Reisen, fahren, gehen, einkaufen, fernsehen, suchen, bezahlen, überweisen, gibt es ve tüm günlük fiiller.',
    icon: 'Zap',
    creditCost: 25,
    tokenReward: 80,
    badge: 'Ders 8 (Fiiller)',
    estimatedMinutes: 10
  },
  {
    id: 'prepositions_adjectives',
    number: 9,
    titleDe: 'Präpositionen & Adjektive',
    titleTr: 'Önemli Edatlar, Yön Belirteçleri & Sıfatlar',
    description: 'In/im, dort, hier, auf, neben, ins, ans, für, mit, nach, gern, ohne + neu, groß, klein, Wohnung, Bad, Miete, Kosten.',
    icon: 'Compass',
    creditCost: 30,
    tokenReward: 70,
    badge: 'Ders 9 (Edat/Sıfat)',
    estimatedMinutes: 8
  },
  {
    id: 'vocabulary',
    number: 10,
    titleDe: 'Wortschatz',
    titleTr: 'Deutsch - Türkisch Temel Kelimeler',
    description: 'Kendinizi tanıtırken, form doldururken ve günlük hayatta en çok kullanılan temel A1 kelimeler.',
    icon: 'BookOpen',
    creditCost: 30,
    tokenReward: 50,
    badge: 'Ders 10',
    estimatedMinutes: 6
  },
  {
    id: 'quiz_arena',
    number: 11,
    titleDe: 'Jeton Arenası & Sınav',
    titleTr: 'İnteraktif Sınav & Jeton Ödülleri',
    description: 'Tüm 10 dersten test çöz, her doğru cevapta jeton kazan, seviye atla ve özel rozetlerin kilidini aç!',
    icon: 'Award',
    creditCost: 0, // Ücretsiz Sınav Arenası
    tokenReward: 120,
    badge: 'Ödüllü Sınav',
    estimatedMinutes: 12
  },
  {
    id: 'ai_writing',
    number: 12,
    titleDe: 'AI Düzeltme & Yazı Analizi',
    titleTr: 'Yapay Zeka Almanca Cümle Denetleyici',
    description: 'Kendi yazdığınız Almanca cümleleri veya Türkçe metinleri analiz edin; yapay zeka artikelleri, fiil sıralarını ve dilbilgisini anında düzeltsin.',
    icon: 'Sparkles',
    creditCost: 20,
    tokenReward: 80,
    badge: 'Yeni AI Modülü',
    estimatedMinutes: 5
  },
  {
    id: 'ai_pronunciation',
    number: 13,
    titleDe: 'AI Telaffuz & Konuşma Koçu',
    titleTr: 'Mikrofon ile Almanca Konuşma & AI Geri Bildirim',
    description: 'Mikrofona konuşarak Almanca sesleri ve cümleleri pratik yapın; yapay zeka tonlama ve fonetik kurallarınızı anlık puanlasın.',
    icon: 'Mic',
    creditCost: 20,
    tokenReward: 90,
    badge: 'Mikrofon + AI 🎙️',
    estimatedMinutes: 6
  },
  {
    id: 'goethe_sprechen',
    number: 14,
    titleDe: 'Goethe A1 Sprechen (130 Kalıp)',
    titleTr: 'Rica Cümleleri, Kartlar, Açma/Kapama & Yasaklar',
    description: '130 Kalıp: Können Sie mir bitte geben/kaufen/bringen/zeigen?, auf/zumachen, anschalten, termin & Man darf hier nicht.',
    icon: 'MessageSquare',
    creditCost: 0,
    tokenReward: 150,
    badge: '130 Yeni Kalıp 🇩🇪',
    estimatedMinutes: 15
  },
  {
    id: 'conversation_practice',
    number: 15,
    titleDe: 'Gesprächspraxis (Sesli Sohbet)',
    titleTr: 'Almanca Sesli Konuşma & AI Diyalog Pratiği',
    description: 'Selamlaşma, kafede sipariş, alışveriş, hobiler ve yol tarifi senaryolarında mikrofonla interaktif Almanca diyalog kurun.',
    icon: 'Bot',
    creditCost: 0,
    tokenReward: 100,
    badge: 'Sesli AI Sohbet 🎙️',
    estimatedMinutes: 10
  },
  {
    id: 'goethe_exam_simulation',
    number: 16,
    titleDe: 'Goethe A1-B1 Sınav Simülatörü',
    titleTr: 'Dinamik Soru Havuzu & Performans Değerlendirmesi',
    description: 'Mock Goethe A1-B1 soru bankasından dinamik sınav oluşturun, süreyle yarışın ve detaylı yetkinlik raporu ile CEFR skorunuzu öğrenin.',
    icon: 'Award',
    creditCost: 0,
    tokenReward: 150,
    badge: 'Sınav Simülatörü 🏆',
    estimatedMinutes: 15
  }
];

// ==========================================
// 2. DÖKÜMAN 3: DIE AUSSPRACHEREGELN (TELAFFUZ KURALLARI)
// ==========================================
export const PRONUNCIATION_RULES: PronunciationRule[] = [
  { letter: 'ä', pronunciation: 'e (uzun e)', example: 'der Käse', examplePronunciation: 'key-zı', meaning: 'Peynir', note: 'Türkçedeki "e" gibi açık ve uzatılarak okunur.', exampleSentenceDe: 'Der Käse schmeckt sehr lecker.', exampleSentenceTr: 'Peynir çok lezzetlidir.' },
  { letter: 'ß (ss)', pronunciation: 'sert s', example: 'der Fußball', examplePronunciation: 'fuus-bal', meaning: 'Futbol', note: 'Sert çift "s" sesidir, kendinden önceki ünlüyü uzatır (ß) veya kısaltır (ss).', exampleSentenceDe: 'Wir spielen am Samstag Fußball.', exampleSentenceTr: 'Cumartesi günü futbol oynuyoruz.' },
  { letter: 'v', pronunciation: 'f', example: 'der Vormittag', examplePronunciation: 'foa-mi-taak', meaning: 'Öğleden önce', note: 'Almanca kökenli kelimelerde "f" olarak okunur (örn: Vater, vier, vor).', exampleSentenceDe: 'Am Vormittag lerne ich Deutsch.', exampleSentenceTr: 'Öğleden önce Almanca öğreniyorum.' },
  { letter: 'j', pronunciation: 'y', example: 'die Jacke', examplePronunciation: 'ya-kı', meaning: 'Ceket / Mont', note: 'Türkçedeki "y" harfi gibi okunur (örn: Ja -> ya, Jacke -> yakı).', exampleSentenceDe: 'Meine Jacke ist warm und neu.', exampleSentenceTr: 'Ceketim sıcak ve yenidir.' },
  { letter: 's', pronunciation: 'z (ünlüden önce) / s (sonda)', example: 'Sie / das Haus', examplePronunciation: 'zii / haus', meaning: 'Siz / Ev', note: 'Ünlü harften önce gelirse yumuşak "z", kelime sonunda sert "s" olarak okunur.', exampleSentenceDe: 'Kommen Sie bitte hierher.', exampleSentenceTr: 'Lütfen buraya geliniz.' },
  { letter: 'z', pronunciation: 'ts', example: 'zwei', examplePronunciation: 'tsvay', meaning: 'İki', note: 'Dudak ve diş arasından çıkan sert "ts" sesiyle başlar.', exampleSentenceDe: 'Ich habe zwei Brüder.', exampleSentenceTr: 'İki erkek kardeşim var.' },
  { letter: 'ei', pronunciation: 'ay', example: 'einkaufen', examplePronunciation: 'ayn-kaufın', meaning: 'Alışveriş yapmak', note: 'ei yan yana gelince her zaman "ay" sesi verir.', exampleSentenceDe: 'Ich kaufe im Supermarkt ein.', exampleSentenceTr: 'Süpermarkette alışveriş yapıyorum.' },
  { letter: 'eu / äu', pronunciation: 'oy', example: 'der Euro / die Häuser', examplePronunciation: 'oy-ro / hoy-za', meaning: 'Euro / Evler', note: 'eu ve äu yan yana gelince her zaman "oy" sesi verir.', exampleSentenceDe: 'Der Kaffee kostet drei Euro.', exampleSentenceTr: 'Kahve üç Euro tutuyor.' },
  { letter: 'ie', pronunciation: 'ii (uzun i)', example: 'nie / die Liebe', examplePronunciation: 'nii / lii-bı', meaning: 'Hiç, asla / Sevgi', note: 'ie yan yana gelince uzatılarak uzun "ii" okunur.', exampleSentenceDe: 'Ich komme nie zu spät.', exampleSentenceTr: 'Asla geç kalmam.' },
  { letter: 'ch', pronunciation: 'h / hy (ich-Laut & ach-Laut)', example: 'machen / ich', examplePronunciation: 'ma-hın / ih(y)', meaning: 'Yapmak / Ben', note: 'a, o, u harflerinden sonra sert boğazdan "h" (ach-Laut); e, i, ä, ö, ü sonrasında ince "hy/ş" (ich-Laut) sesi verir.', exampleSentenceDe: 'Was machen Sie heute Abend?', exampleSentenceTr: 'Bu akşam ne yapıyorsunuz?' },
  { letter: 'chs', pronunciation: 'ks', example: 'sechs', examplePronunciation: 'zeks', meaning: 'Altı', note: 'chs harf grubu "ks" olarak okunur (örn: sechs -> zeks, Fuchs -> fuks).', isHighlight: true, exampleSentenceDe: 'Ich stehe um sechs Uhr auf.', exampleSentenceTr: 'Saat altıda kalkıyorum.' },
  { letter: 'ck', pronunciation: 'k (sert k)', example: 'der Zucker', examplePronunciation: 'tsu-ka', meaning: 'Şeker', note: 'Kısa ve sert "k" sesi verir, önceki ünlüyü kısa okutur.', exampleSentenceDe: 'Ich trinke Tee ohne Zucker.', exampleSentenceTr: 'Çayı şekersiz içiyorum.' },
  { letter: 'pf', pronunciation: 'pf (patlamalı)', example: 'das Pferd', examplePronunciation: 'pfeart', meaning: 'At', note: 'Dudaklar kapalıdan açılarak hızlıca "pf" söylenir.', exampleSentenceDe: 'Das weiße Pferd läuft schnell.', exampleSentenceTr: 'Beyaz at hızlı koşuyor.' },
  { letter: 'ph', pronunciation: 'f', example: 'die Phase', examplePronunciation: 'faa-zı', meaning: 'Aşama / Evre', note: 'Yabancı kökenli kelimelerde "f" okunur.', exampleSentenceDe: 'Das ist eine wichtige Phase.', exampleSentenceTr: 'Bu önemli bir aşamadır.' },
  { letter: 'sch', pronunciation: 'ş', example: 'der Tisch', examplePronunciation: 'tiş', meaning: 'Masa', note: 'sch grubu her zaman Türkçedeki "ş" sesidir.', exampleSentenceDe: 'Das Buch liegt auf dem Tisch.', exampleSentenceTr: 'Kitap masanın üzerinde duruyor.' },
  { letter: 'tsch', pronunciation: 'ç', example: 'Deutsch', examplePronunciation: 'doyç', meaning: 'Almanca', note: 'tsch grubu her zaman Türkçedeki "ç" sesidir.', exampleSentenceDe: 'Wir lernen jeden Tag Deutsch.', exampleSentenceTr: 'Her gün Almanca öğreniyoruz.' },
  { letter: 'st', pronunciation: 'şt', example: 'die Stadt', examplePronunciation: 'ştat', meaning: 'Şehir', note: 'Kelime veya hece başında "şt" olarak okunur.', exampleSentenceDe: 'Berlin ist eine schöne Stadt.', exampleSentenceTr: 'Berlin güzel bir şehirdir.' },
  { letter: 'sp', pronunciation: 'şp', example: 'der Sport', examplePronunciation: 'şpoat', meaning: 'Spor', note: 'Kelime veya hece başında "şp" olarak okunur.', exampleSentenceDe: 'Ich mache regelmäßig Sport.', exampleSentenceTr: 'Düzenli olarak spor yapıyorum.' },
  { letter: 'tion', pronunciation: 'tsi-oon', example: 'die Portion', examplePronunciation: 'poar-tsi-oon', meaning: 'Porsiyon', note: 'Kelime sonunda "tsi-oon" olarak okunur.', exampleSentenceDe: 'Eine Portion Pommes bitte.', exampleSentenceTr: 'Bir porsiyon patates kızartması lütfen.' },
  { letter: 'chen', pronunciation: 'hyın / şın', example: 'das Brötchen', examplePronunciation: 'brööt-hyın', meaning: 'Küçük ekmek / Sandviç ekmeği', note: 'Küçültme eki olarak ince "hyın / şın" okunur.', exampleSentenceDe: 'Ich esse ein Brötchen zum Frühstück.', exampleSentenceTr: 'Kahvaltıda bir sandviç ekmeği yiyorum.' },
];

export const H_RULE_INFO = {
  ruleText: 'Eğer "h" harfi kelime başındaysa belirgin olarak okunur ("h"), ancak kelimenin içinde veya sonunda yer alıyorsa kendinden bir önceki ünlü harf uzatılarak söylenir, yani "h" harfi okunmaz sessiz kalır.',
  examples: [
    { word: 'heute', pronunciation: 'hoy-tı', meaning: 'Bugün', position: 'Başta (Okunur: "h")', isStart: true, exampleSentenceDe: 'Heute ist das Wetter sehr schön.', exampleSentenceTr: 'Bugün hava çok güzel.' },
    { word: 'das Jahr', pronunciation: 'yaar', meaning: 'Yıl / Sene', position: 'İçte (Okunmaz: "a"yı uzatır)', isStart: false, exampleSentenceDe: 'Ein Jahr vergeht sehr schnell.', exampleSentenceTr: 'Bir yıl çok çabuk geçiyor.' },
    { word: 'fahren', pronunciation: 'faa-rın', meaning: 'Araçla gitmek / Sürmek', position: 'İçte (Okunmaz: "a"yı uzatır)', isStart: false, exampleSentenceDe: 'Wir fahren mit dem Zug nach München.', exampleSentenceTr: 'Münih\'e trenle gidiyoruz.' },
    { word: 'sehen', pronunciation: 'zee-ın', meaning: 'Görmek', position: 'İçte (Okunmaz: "e"yi uzatır)', isStart: false, exampleSentenceDe: 'Ich sehe meine Familie am Wochenende.', exampleSentenceTr: 'Hafta sonu ailemi görüyorum.' },
    { word: 'wohnen', pronunciation: 'voo-nın', meaning: 'İkamet etmek / Yaşamak', position: 'İçte (Okunmaz: "o"yu uzatır)', isStart: false, exampleSentenceDe: 'Ich wohne in einer gemütlichen Wohnung.', exampleSentenceTr: 'Rahat bir dairede oturuyorum.' },
  ]
};

export const PRONUNCIATION_PRACTICE_WORDS: PronunciationPracticeWord[] = [
  { word: 'das Streichholz', pronunciation: 'ştrayh-holts', meaning: 'Kibrit', rulesApplied: 'st = şt, ei = ay, ch = h, z = ts', exampleSentenceDe: 'Das Streichholz brennt hell.', exampleSentenceTr: 'Kibrit parlak yanıyor.' },
  { word: 'das Getränk', pronunciation: 'ge-trenk', meaning: 'İçecek', rulesApplied: 'ä = e', exampleSentenceDe: 'Das kalte Getränk erfrischt mich.', exampleSentenceTr: 'Soğuk içecek beni ferahlatıyor.' },
  { word: 'der Vorteil', pronunciation: 'foar-tayl', meaning: 'Avantaj', rulesApplied: 'v = f, ei = ay', exampleSentenceDe: 'Das ist ein großer Vorteil für uns.', exampleSentenceTr: 'Bu bizim için büyük bir avantajdır.' },
  { word: 'das Hähnchen', pronunciation: 'hehn-hyın', meaning: 'Piliç / Tavuk', rulesApplied: 'h = başta okunur, ä = e, h = uzatır, chen = hyın', exampleSentenceDe: 'Das gebratene Hähnchen schmeckt gut.', exampleSentenceTr: 'Kızarmış tavuğun tadı çok lezzetlidir.' },
  { word: 'Frankreich', pronunciation: 'frank-rayh', meaning: 'Fransa', rulesApplied: 'ei = ay, ch = h', exampleSentenceDe: 'Frankreich liegt im Westen von Europa.', exampleSentenceTr: 'Fransa Avrupa\'nın batısındadır.' },
  { word: 'der Frühling', pronunciation: 'früu-link', meaning: 'İlkbahar', rulesApplied: 'ü = ü, h = uzatır', exampleSentenceDe: 'Im Frühling blühen viele Blumen.', exampleSentenceTr: 'İlkbaharda birçok çiçek açar.' },
  { word: 'der Schlüssel', pronunciation: 'şlüs-sıl', meaning: 'Anahtar', rulesApplied: 'sch = ş, ss = sert s', exampleSentenceDe: 'Ich habe meinen Schlüssel gefunden.', exampleSentenceTr: 'Anahtarımı buldum.' },
  { word: 'der Bleistift', pronunciation: 'blay-ştift', meaning: 'Kurşun kalem', rulesApplied: 'ei = ay, st = şt', exampleSentenceDe: 'Ich schreibe meine Notizen mit dem Bleistift.', exampleSentenceTr: 'Notlarımı kurşun kalemle yazıyorum.' },
  { word: 'der Ausdruck', pronunciation: 'aus-druk', meaning: 'İfade / Deyim / Çıktı', rulesApplied: 'au = au, ck = k', exampleSentenceDe: 'Dieser deutsche Ausdruck ist sehr nützlich.', exampleSentenceTr: 'Bu Almanca ifade çok yararlıdır.' },
  { word: 'sprechen', pronunciation: 'şpre-hyın', meaning: 'Konuşmak', rulesApplied: 'sp = şp, ch = hy', exampleSentenceDe: 'Wir sprechen Deutsch im Unterricht.', exampleSentenceTr: 'Derste Almanca konuşuyoruz.' },
];

// ==========================================
// 3. DÖKÜMAN 5: EKSTRA SORULAR (FRAGEN & ANTWORTEN)
// ==========================================
export const EXTRA_QUESTIONS: ExtraQuestionItem[] = [
  {
    id: 'phone',
    number: 1,
    questionDe: 'Wie ist Ihre Handynummer/ Telefonnummer?',
    questionTrLiteral: 'Nasıl olmak sizin telefon numaranız?',
    questionTr: 'Telefon numaranız nedir?',
    answerTemplateDe: 'Meine Handynummer/ Telefonnummer ist 0 5...',
    answerTemplateTrLiteral: 'Benim telefon numaram olmak 0 5...',
    answerTemplateTr: 'Telefon numaram 0 5...',
    sampleAnswer: 'Meine Telefonnummer ist 0534 610 29 33.',
    category: 'İletişim',
    iconName: 'Phone'
  },
  {
    id: 'id_number',
    number: 2,
    questionDe: 'Wie ist Ihre Ausweisnummer/ TC-Nummer?',
    questionTrLiteral: 'Nasıl olmak sizin kimlik numaranız?',
    questionTr: 'Kimlik / TC numaranız nedir?',
    answerTemplateDe: 'Meine Ausweisnummer/ TC-Nummer ist ...',
    answerTemplateTrLiteral: 'Benim kimlik numaram olmak ...',
    answerTemplateTr: 'Kimlik numaram ...',
    sampleAnswer: 'Meine Ausweisnummer ist 12345678901.',
    category: 'Resmi Bilgi',
    iconName: 'CreditCard'
  },
  {
    id: 'house_number',
    number: 3,
    questionDe: 'Wie ist Ihre Hausnummer?',
    questionTrLiteral: 'Nasıl olmak sizin daire numaranız?',
    questionTr: 'Kapı / Ev / Daire numaranız nedir?',
    answerTemplateDe: 'Meine Hausnummer ist ...',
    answerTemplateTrLiteral: 'Benim daire numaram olmak ...',
    answerTemplateTr: 'Kapı numaram ...',
    sampleAnswer: 'Meine Hausnummer ist 7.',
    category: 'Adres',
    iconName: 'Home'
  },
  {
    id: 'area_code',
    number: 4,
    questionDe: 'Wie ist Vorwahl von ...?',
    questionTrLiteral: 'Nasıl olmak alan kodu ...\'nın?',
    questionTr: '...\'nın alan kodu nedir?',
    answerTemplateDe: 'Es ist ...',
    answerTemplateTrLiteral: 'O olmak ...',
    answerTemplateTr: 'Alan kodu ...\'dir.',
    sampleAnswer: 'Es ist 0312.',
    category: 'Konum & İletişim',
    iconName: 'Compass'
  },
  {
    id: 'distance',
    number: 5,
    questionDe: 'Wie viel Kilometer ist ... von Ankara?',
    questionTrLiteral: 'Kaç kilometre olmak ... Ankara\'dan?',
    questionTr: '... Ankara\'dan kaç kilometredir?',
    answerTemplateDe: 'Es ist circa ... Kilometer.',
    answerTemplateTrLiteral: 'Yaklaşık olarak ... kilometre.',
    answerTemplateTr: 'Yaklaşık ... kilometredir.',
    sampleAnswer: 'Es ist circa 450 Kilometer.',
    specialNote: 'Circa (Okunuşu: Sirka) = "Yaklaşık olarak" anlamına gelir.',
    category: 'Mesafe & Seyahat',
    iconName: 'Navigation'
  },
  {
    id: 'postal_code',
    number: 6,
    questionDe: 'Wie ist Ihre Postleitzahl?',
    questionTrLiteral: 'Nasıl olmak sizin posta kodunuz?',
    questionTr: 'Posta kodunuz nedir?',
    pronunciationNote: 'Postleitzahl okunuşu: "Post-layt-saal" (Kısaltma: PLZ)',
    answerTemplateDe: 'Meine Postleitzahl ist ...',
    answerTemplateTrLiteral: 'Benim posta kodum olmak ...',
    answerTemplateTr: 'Posta kodum ...',
    sampleAnswer: 'Meine Postleitzahl ist 06100.',
    category: 'Adres',
    iconName: 'Mail'
  },
  {
    id: 'car_plate',
    number: 7,
    questionDe: 'Wie ist das Kennzeichen von Ihrem Auto?',
    questionTrLiteral: 'Nasıl olmak plakası sizin arabanızın?',
    questionTr: 'Arabanızın araç plakası nedir?',
    answerTemplateDe: 'Es ist 06 KA 0606.',
    answerTemplateTrLiteral: 'O olmak 06 KA 0606.',
    answerTemplateTr: 'Plakası 06 KA 0606\'dır.',
    sampleAnswer: 'Es ist 06 KA 0606.',
    category: 'Araç & Ulaşım',
    iconName: 'Car'
  }
];

// ==========================================
// 6. DÖKÜMAN 2. NOT: ALLTAGSDEUTSCH (SELAMLAŞMA, VEDA, NEZAKET)
// ==========================================
export const ALLTAGSDEUTSCH_ITEMS: AlltagsdeutschItem[] = [
  // Begrüßung (Selamlaşma)
  { id: 'ad_1', german: 'Hallo!', pronunciation: 'halo', turkish: 'Merhaba!', category: 'begruessung', regionOrNote: 'En yaygın genel selamlaşma', exampleSentence: 'Hallo! Wie geht es dir?', exampleSentenceTr: 'Merhaba! Nasılsın?' },
  { id: 'ad_2', german: 'Moin!', pronunciation: 'moyn', turkish: 'Merhaba!', category: 'begruessung', regionOrNote: 'Kuzey Almanya (Norddeutschland)', exampleSentence: 'Moin! Schön dich zu sehen.', exampleSentenceTr: 'Merhaba! Seni görmek güzel.' },
  { id: 'ad_3', german: 'Servus!', pronunciation: 'zeeğvus', turkish: 'Selam!', category: 'begruessung', regionOrNote: 'Güney Almanya & Avusturya (Süddeutschland - Österreich)', exampleSentence: 'Servus, mein Freund!', exampleSentenceTr: 'Selam, dostum!' },
  { id: 'ad_4', german: 'Grüß dich!', pronunciation: 'gürüs dih', turkish: 'Merhaba! / Selamlar!', category: 'begruessung', regionOrNote: 'Samimi selamlaşma', exampleSentence: 'Grüß dich, Anna!', exampleSentenceTr: 'Selam Anna!' },
  { id: 'ad_5', german: 'Grüß Gott!', pronunciation: 'gürüs got', turkish: 'Merhaba! (Geleneksel)', category: 'begruessung', regionOrNote: 'Dini / Geleneksel (Bavyera & Avusturya)', exampleSentence: 'Grüß Gott, Herr Müller!', exampleSentenceTr: 'Merhaba Bay Müller!' },
  { id: 'ad_6', german: 'Guten Morgen!', pronunciation: 'gutın morgın', turkish: 'Günaydın!', category: 'begruessung', regionOrNote: 'Sabah saatleri (yaklaşık 11:00\'e kadar)', exampleSentence: 'Guten Morgen allerseits!', exampleSentenceTr: 'Herkese günaydın!' },
  { id: 'ad_7', german: 'Guten Tag!', pronunciation: 'gutın tak', turkish: 'İyi günler!', category: 'begruessung', regionOrNote: 'Gün boyu genel & resmi', exampleSentence: 'Guten Tag! Kann ich Ihnen helfen?', exampleSentenceTr: 'İyi günler! Size yardım edebilir miyim?' },
  { id: 'ad_8', german: 'Guten Abend!', pronunciation: 'gutın abınt', turkish: 'İyi akşamlar!', category: 'begruessung', regionOrNote: 'Akşam saatlerinde (18:00 sonrası)', exampleSentence: 'Guten Abend, meine Damen und Herren.', exampleSentenceTr: 'İyi akşamlar, bayanlar ve baylar.' },

  // Abschied (Veda)
  { id: 'ad_9', german: 'Tschüss!', pronunciation: 'çüüs', turkish: 'Bay bay! / Hoşça kal!', category: 'abschied', regionOrNote: 'En popüler günlük veda', exampleSentence: 'Tschüss! Bis morgen.', exampleSentenceTr: 'Bay bay! Yarına kadar.' },
  { id: 'ad_10', german: 'Tschau!', pronunciation: 'çav', turkish: 'Bay bay!', category: 'abschied', regionOrNote: 'Samimi / Gençler arası veda', exampleSentence: 'Tschau! Mach\'s gut.', exampleSentenceTr: 'Bay bay! Kendine iyi bak.' },
  { id: 'ad_11', german: 'Auf Wiedersehen!', pronunciation: 'auf vidazeeyn', turkish: 'Görüşmek üzere! (Yüz yüze)', category: 'abschied', regionOrNote: 'Resmi & standart yüz yüze veda', exampleSentence: 'Auf Wiedersehen und schönen Tag!', exampleSentenceTr: 'Görüşmek üzere ve iyi günler!' },
  { id: 'ad_12', german: 'Auf Wiederhören!', pronunciation: 'auf vidahörın', turkish: 'Görüşmek üzere! (Telefonda)', category: 'abschied', regionOrNote: 'Sadece telefon görüşmelerinde kullanılır', exampleSentence: 'Danke für das Gespräch, auf Wiederhören!', exampleSentenceTr: 'Görüşme için teşekkürler, hoşça kalın!' },
  { id: 'ad_13', german: 'Bis bald!', pronunciation: 'bis balt', turkish: 'Yakında görüşürüz!', category: 'abschied', regionOrNote: 'Kısa süre sonra görüşülecekse', exampleSentence: 'Bis bald, wir telefonieren.', exampleSentenceTr: 'Yakında görüşürüz, telefonlaşırız.' },
  { id: 'ad_14', german: 'Bis später!', pronunciation: 'bis şıpeyta', turkish: 'Sonra görüşürüz!', category: 'abschied', regionOrNote: 'Aynı gün içinde daha sonra', exampleSentence: 'Ich gehe kurz einkaufen, bis später!', exampleSentenceTr: 'Kısaca alışverişe gidiyorum, sonra görüşürüz!' },
  { id: 'ad_15', german: 'Bis Montag!', pronunciation: 'bis montak', turkish: 'Pazartesi görüşürüz!', category: 'abschied', regionOrNote: 'Hafta sonu vedası / gün belirtme', exampleSentence: 'Schönes Wochenende, bis Montag!', exampleSentenceTr: 'İyi hafta sonları, Pazartesi görüşürüz!' },
  { id: 'ad_16', german: 'Gute Nacht!', pronunciation: 'gute naht', turkish: 'İyi geceler!', category: 'abschied', regionOrNote: 'Uyumaya giderken / gece vedası', exampleSentence: 'Schlaf gut und gute Nacht!', exampleSentenceTr: 'İyi uykular ve iyi geceler!' },

  // Andere Sätze und Wörter (Günlük İfadeler, Nezaket & Ezber)
  { id: 'ad_17', german: 'Ja', pronunciation: 'ya', turkish: 'Evet', category: 'andere_saetze', exampleSentence: 'Ja, gerne.', exampleSentenceTr: 'Evet, memnuniyetle.' },
  { id: 'ad_18', german: 'Nein', pronunciation: 'nayn', turkish: 'Hayır', category: 'andere_saetze', exampleSentence: 'Nein, danke.', exampleSentenceTr: 'Hayır, teşekkürler.' },
  { id: 'ad_19', german: 'Okay', pronunciation: 'okey', turkish: 'Tamam', category: 'andere_saetze', exampleSentence: 'Okay, alles klar.', exampleSentenceTr: 'Tamam, her şey anlaşıldı.' },
  { id: 'ad_20', german: 'Dankeschön. / Danke.', pronunciation: 'danke şön', turkish: 'Teşekkürler.', category: 'andere_saetze', exampleSentence: 'Vielen Dank für Ihre Hilfe.', exampleSentenceTr: 'Yardımınız için çok teşekkürler.' },
  { id: 'ad_21', german: 'Danke sehr.', pronunciation: 'danke zeğa', turkish: 'Çok teşekkürler.', category: 'andere_saetze', exampleSentence: 'Danke sehr, das ist sehr nett.', exampleSentenceTr: 'Çok teşekkürler, çok naziksiniz.' },
  { id: 'ad_22', german: 'Vielen Dank.', pronunciation: 'fii-lın dank', turkish: 'Çok teşekkürler.', category: 'andere_saetze', exampleSentence: 'Vielen Dank für die Einladung.', exampleSentenceTr: 'Davet için çok teşekkürler.' },
  { id: 'ad_23', german: 'Bitteschön. / Bitte.', pronunciation: 'bite şön', turkish: 'Rica ederim. / Buyrun.', category: 'andere_saetze', exampleSentence: 'Bitteschön, gern geschehen.', exampleSentenceTr: 'Rica ederim, memnuniyetle.' },
  { id: 'ad_24', german: 'Gern geschehen.', pronunciation: 'gern geşeyın', turkish: 'Rica ederim (Memnuniyetle).', category: 'andere_saetze', exampleSentence: 'Kein Problem, gern geschehen!', exampleSentenceTr: 'Sorun değil, memnuniyetle!' },
  { id: 'ad_25', german: 'Entschuldigung!', pronunciation: 'enşuldigunk', turkish: 'Özür dilerim!', category: 'andere_saetze', isEzber: true, regionOrNote: '⭐ Ezber kelimesi', exampleSentence: 'Entschuldigung, wo ist der Bahnhof?', exampleSentenceTr: 'Afedersiniz / Özür dilerim, tren istasyonu nerede?' },
  { id: 'ad_26', german: 'Verzeihung!', pronunciation: 'fert saayunk', turkish: 'Afedersiniz!', category: 'andere_saetze', regionOrNote: 'Nezaket ve dikkat çekme', exampleSentence: 'Verzeihung, ist dieser Platz frei?', exampleSentenceTr: 'Afedersiniz, bu yer boş mu?' },
  { id: 'ad_27', german: 'Es tut mir leid.', pronunciation: 'es tut miya layt', turkish: 'Özür dilerim / Kusura bakmayın.', category: 'andere_saetze', isEzber: true, regionOrNote: '⭐ Ezber kalıbı', exampleSentence: 'Es tut mir leid, ich bin zu spät.', exampleSentenceTr: 'Kusura bakmayın, geç kaldım.' },
  { id: 'ad_28', german: 'Wie bitte?', pronunciation: 'vii bite', turkish: 'Efendim? / Anlamadım?', category: 'andere_saetze', isEzber: true, regionOrNote: '⭐ Ezber kalıbı (Sınavda çok kurtarır)', exampleSentence: 'Wie bitte? Können Sie das wiederholen?', exampleSentenceTr: 'Efendim? Tekrarlayabilir misiniz?' },
  { id: 'ad_29', german: 'Nochmal bitte?', pronunciation: 'nohmal bite', turkish: 'Bir daha lütfen?', category: 'andere_saetze', isEzber: true, regionOrNote: '⭐ Ezber kalıbı', exampleSentence: 'Nochmal bitte, ich habe es nicht verstanden.', exampleSentenceTr: 'Bir daha lütfen, anlayamadım.' },
  { id: 'ad_30', german: 'Wiederholen Sie bitte.', pronunciation: 'viida holın zii bite', turkish: 'Tekrarlayın lütfen.', category: 'andere_saetze', regionOrNote: 'Resmi ve sınav talimatı', exampleSentence: 'Wiederholen Sie bitte den Satz.', exampleSentenceTr: 'Lütfen cümleyi tekrarlayın.' },
  { id: 'ad_31', german: 'Langsam bitte.', pronunciation: 'langzam bite', turkish: 'Yavaşça lütfen.', category: 'andere_saetze', exampleSentence: 'Sprechen Sie bitte langsam.', exampleSentenceTr: 'Lütfen yavaş konuşun.' },
  { id: 'ad_32', german: 'Einen Moment bitte.', pronunciation: 'aynın moment bite', turkish: 'Bir dakika lütfen.', category: 'andere_saetze', exampleSentence: 'Einen Moment bitte, ich suche das Dokument.', exampleSentenceTr: 'Bir dakika lütfen, belgeyi arıyorum.' },
  { id: 'ad_33', german: 'Weiter bitte.', pronunciation: 'vayta bite', turkish: 'Devam lütfen.', category: 'andere_saetze', exampleSentence: 'Weiter bitte, der Nächste!', exampleSentenceTr: 'Devam lütfen, sıradaki!' },
  { id: 'ad_34', german: 'Wie heißt das auf Türkisch?', pronunciation: 'vii hayst das auf türkiş', turkish: 'Bu Türkçede ne demek?', category: 'andere_saetze', exampleSentence: 'Wie heißt das Wort auf Türkisch?', exampleSentenceTr: 'Bu kelime Türkçede ne demek?' }
];

// Hal Hatır Sorma Diyalogları (Formell & Informell)
export const FEELING_DIALOGUES: FeelingDialogueItem[] = [
  {
    id: 'feel_formell',
    type: 'formell',
    questionDe: 'Wie geht es Ihnen?',
    questionPronunciation: 'vii geet es iinın?',
    questionTr: 'Nasılsınız? (Resmi - Tanımadığınız veya siz diye hitap edilen kişilerle)',
    note: 'Resmi ortamda "Ihnen" (Size) kullanılır.',
    responses: [
      {
        emoji: '😊',
        de: 'Es geht mir gut. Danke. Und Ihnen?',
        pronunciation: 'es geet miya gut. danke. und iinın?',
        tr: 'İyiyim. Teşekkürler. Ya siz?',
        mood: 'positive'
      },
      {
        emoji: '😐',
        de: 'Es geht. Danke. Und Ihnen?',
        pronunciation: 'es geet. danke. und iinın?',
        tr: 'Şöyle böyle / Fena değil. Teşekkürler. Ya siz?',
        mood: 'neutral'
      },
      {
        emoji: '🙁',
        de: 'Es geht mir nicht so gut. Und Ihnen?',
        pronunciation: 'es geet miya niht zo gut. und iinın?',
        tr: 'Pek iyi değilim. Ya siz?',
        mood: 'negative'
      }
    ]
  },
  {
    id: 'feel_informell',
    type: 'informell',
    questionDe: 'Wie geht es dir? / Was geht ab?',
    questionPronunciation: 'vii geet es diir? / vas geet ap?',
    questionTr: 'Nasılsın? / N\'aber? (Samimi - Arkadaşlar ve aile arasında)',
    note: 'Samimi ortamlarda 4 farklı soru sorulabilir: Was geht ab?, Wie läuft es bei dir?, Wie geht es dir?, Was ist los mit dir?',
    responses: [
      {
        emoji: '😊',
        de: 'Sehr gut. Und dir?',
        pronunciation: 'zeeğa gut. und diir?',
        tr: 'Çok iyi. Ya sen?',
        mood: 'positive'
      },
      {
        emoji: '😐',
        de: 'Wie immer. Und dir?',
        pronunciation: 'vii ima. und diir?',
        tr: 'Her zamanki gibi. Ya sen?',
        mood: 'neutral'
      },
      {
        emoji: '🙁',
        de: 'Schlecht. Und dir?',
        pronunciation: 'şleht. und diir?',
        tr: 'Kötü. Ya sen?',
        mood: 'negative'
      }
    ]
  }
];

// ==========================================
// 7. DÖKÜMAN 3. NOT: W-FRAGEN & TEMALI KART İPUÇLARI
// ==========================================
export const W_FRAGEN_ITEMS: WFrageItem[] = [
  { id: 'wf_1', german: 'Wo?', turkish: 'Nerede?', pronunciation: 'vo', exampleDe: 'Wo wohnen Sie?', exampleTr: 'Nerede oturuyorsunuz?', answerDe: 'Ich wohne in Berlin in der Hauptstraße.', answerTr: 'Berlin\'de Hauptstraße\'de oturuyorum.', tipTr: 'Bulunulan yeri ve konumu sorar (Dativ / in, im, bei vb.).', cardCategory: 'Wohnort & Konum' },
  { id: 'wf_2', german: 'Wie?', turkish: 'Nasıl?', pronunciation: 'vii', exampleDe: 'Wie heißen Sie?', exampleTr: 'Adınız nedir / nasıl adlandırılırsınız?', answerDe: 'Ich heiße Ahmet Demir.', answerTr: 'Adım Ahmet Demir.', tipTr: 'Durumu, şekli, ismi ve tanımlamaları sorar.', cardCategory: 'Kimlik & Durum' },
  { id: 'wf_3', german: 'Wann?', turkish: 'Ne zaman?', pronunciation: 'van', exampleDe: 'Wann beginnt der Kurs?', exampleTr: 'Kurs ne zaman başlıyor?', answerDe: 'Der Kurs beginnt um 9 Uhr.', answerTr: 'Kurs saat 9\'da başlıyor.', tipTr: 'Zaman, gün, saat veya tarihi sorar (um, am, im ile cevaplanır).', cardCategory: 'Zaman & Randevu' },
  { id: 'wf_4', german: 'Wohin?', turkish: 'Nereye?', pronunciation: 'vohin', exampleDe: 'Wohin fahren Sie im Urlaub?', exampleTr: 'Tatilde nereye gidiyorsunuz?', answerDe: 'Ich fahre nach Deutschland.', answerTr: 'Almanya\'ya gidiyorum.', tipTr: 'Bir hedefe yönelmeyi sorar (Akkusativ / nach, in die, ins vb.).', cardCategory: 'Seyahat & Yön' },
  { id: 'wf_5', german: 'Welche? / In welche?', turkish: 'Hangi? / Hangi ... içinde?', pronunciation: 'velhı', exampleDe: 'In welcher Straße wohnen Sie?', exampleTr: 'Hangi caddede oturuyorsunuz?', answerDe: 'Ich wohne in der Goethestraße.', answerTr: 'Goethestraße\'de oturuyorum.', tipTr: 'Seçenekler arasından seçim yapmayı sorar.', cardCategory: 'Adres & Seçim' },
  { id: 'wf_6', german: 'Wie oft?', turkish: 'Ne sıklıkla?', pronunciation: 'vii oft', exampleDe: 'Wie oft lernen Sie Deutsch?', exampleTr: 'Ne sıklıkla Almanca çalışıyorsunuz?', answerDe: 'Ich lerne jeden Tag zwei Stunden Deutsch.', answerTr: 'Her gün iki saat Almanca çalışıyorum.', tipTr: 'Tekrar sıklığını sorar (jeden Tag, oft, manchmal vb.).', cardCategory: 'Alışkanlıklar & Hobiler' },
  { id: 'wf_7', german: 'Wie viel?', turkish: 'Kaç tane? / Ne kadar?', pronunciation: 'vii fiil', exampleDe: 'Wie viel kostet das?', exampleTr: 'Bu ne kadar / fiyatı nedir?', answerDe: 'Das kostet fünfzehn Euro.', answerTr: 'Bu 15 Euro tutuyor.', tipTr: 'Fiyat, miktar veya sayı sorarken kullanılır.', cardCategory: 'Alışveriş & Fiyat' },
  { id: 'wf_8', german: 'Woher?', turkish: 'Nereden?', pronunciation: 'vo-hea', exampleDe: 'Woher kommen Sie?', exampleTr: 'Nereden geliyorsunuz / Memleketiniz neresi?', answerDe: 'Ich komme aus der Türkei.', answerTr: 'Türkiye\'den geliyorum.', tipTr: 'Çıkış noktasını ve memleketi sorar (aus ... ile cevaplanır).', cardCategory: 'Menşe & Köken' },
  { id: 'wf_9', german: 'Warum?', turkish: 'Neden? / Niçin?', pronunciation: 'va-rum', exampleDe: 'Warum lernen Sie Deutsch?', exampleTr: 'Neden Almanca öğreniyorsunuz?', answerDe: 'Weil ich in Deutschland arbeiten möchte.', answerTr: 'Çünkü Almanya\'da çalışmak istiyorum.', tipTr: 'Sebep ve amaç sorar.', cardCategory: 'Gerekçe & Amaç' },
  { id: 'wf_10', german: 'Wer?', turkish: 'Kim?', pronunciation: 'vea', exampleDe: 'Wer ist das?', exampleTr: 'Bu kim?', answerDe: 'Das ist mein Deutschlehrer.', answerTr: 'Bu benim Almanca öğretmenim.', tipTr: 'Kişi veya özneyi sorar.', cardCategory: 'Kişiler & Aile' },
  { id: 'wf_11', german: 'Was?', turkish: 'Ne?', pronunciation: 'vas', exampleDe: 'Was machen Sie beruflich?', exampleTr: 'Mesleğiniz nedir / ne işle uğraşıyorsunuz?', answerDe: 'Ich bin Ingenieur von Beruf.', answerTr: 'Mesleğim mühendisliktir.', tipTr: 'Nesne, eylem veya meslek sorar.', cardCategory: 'Meslek & Eylemler' }
];

// ==========================================
// 8. DÖKÜMAN: ÖNEMLİ FİİLLER (WICHTIGE VERBEN - 40+ FİİL)
// ==========================================
export const ESSENTIAL_VERBS_A1: EssentialVerbItem[] = [
  { id: 'vb_1', german: 'reisen', pronunciation: 'rayzın', turkish: 'Seyahat etmek', sampleSentenceDe: 'Ich reise gern nach Deutschland.', sampleSentenceTr: 'Almanya\'ya severek seyahat ederim.', conjugationSummary: 'ich reise, du reist, er/sie reist, wir reisen', category: 'Seyahat' },
  { id: 'vb_2', german: 'fahren', pronunciation: 'faarın', turkish: 'Araçla gitmek / Sürmek', isIrregular: true, sampleSentenceDe: 'Wir fahren mit dem Auto.', sampleSentenceTr: 'Arabayla gidiyoruz.', conjugationSummary: 'ich fahre, du fährst, er fährt, wir fahren', category: 'Ulaşım' },
  { id: 'vb_3', german: 'gehen', pronunciation: 'geeın', turkish: 'Yürüyerek gitmek', sampleSentenceDe: 'Ich gehe zu Fuß zur Schule.', sampleSentenceTr: 'Okula yürüyerek gidiyorum.', conjugationSummary: 'ich gehe, du gehst, er geht, wir gehen', category: 'Hareket' },
  { id: 'vb_4', german: 'fliegen', pronunciation: 'filiigın', turkish: 'Uçmak', sampleSentenceDe: 'Das Flugzeug fliegt nach Berlin.', sampleSentenceTr: 'Uçak Berlin\'e uçuyor.', conjugationSummary: 'ich fliege, du fliegst, er fliegt, wir fliegen', category: 'Seyahat' },
  { id: 'vb_5', german: 'haben', pronunciation: 'habın', turkish: 'Sahip olmak', isIrregular: true, sampleSentenceDe: 'Ich habe einen Pass.', sampleSentenceTr: 'Bir pasaportum var.', conjugationSummary: 'ich habe, du hast, er hat, wir haben', category: 'Temel Fiil' },
  { id: 'vb_6', german: 'brauchen', pronunciation: 'bırauhın', turkish: 'İhtiyaç duymak', sampleSentenceDe: 'Ich brauche ein Wörterbuch.', sampleSentenceTr: 'Bir sözlüğe ihtiyacım var.', conjugationSummary: 'ich brauche, du brauchst, er braucht, wir brauchen', category: 'İhtiyaç' },
  { id: 'vb_7', german: 'machen', pronunciation: 'mahın', turkish: 'Yapmak', sampleSentenceDe: 'Was machen Sie heute Abend?', sampleSentenceTr: 'Bu akşam ne yapıyorsunuz?', conjugationSummary: 'ich mache, du machst, er macht, wir machen', category: 'Temel Fiil' },
  { id: 'vb_8', german: 'finden', pronunciation: 'findın', turkish: 'Bulmak / Fikir belirtmek', sampleSentenceDe: 'Ich finde Deutsch sehr interessant.', sampleSentenceTr: 'Almancayı çok ilginç buluyorum.', conjugationSummary: 'ich finde, du findest, er findet, wir finden', category: 'Düşünce' },
  { id: 'vb_9', german: 'übernachten', pronunciation: 'übanahtın', turkish: 'Gecelemek / Konaklamak', sampleSentenceDe: 'Wir übernachten im Hotel.', sampleSentenceTr: 'Otelde konaklıyoruz.', conjugationSummary: 'ich übernachte, du übernachtest, er übernachtet', category: 'Konaklama' },
  { id: 'vb_10', german: 'bleiben', pronunciation: 'bılaybın', turkish: 'Kalmak', sampleSentenceDe: 'Ich bleibe drei Tage in München.', sampleSentenceTr: 'Münih\'te üç gün kalıyorum.', conjugationSummary: 'ich bleibe, du bleibst, er bleibt, wir bleiben', category: 'Konaklama' },
  { id: 'vb_11', german: 'wandern', pronunciation: 'vandərn', turkish: 'Doğa yürüyüşü yapmak', sampleSentenceDe: 'Am Wochenende wandern wir in den Bergen.', sampleSentenceTr: 'Hafta sonu dağlarda yürüyüş yapıyoruz.', conjugationSummary: 'ich wandere, du wanderst, er wandert', category: 'Hobi' },
  { id: 'vb_12', german: 'sein (ist / sind / war)', pronunciation: 'zayn (ist / zind / vaar)', turkish: 'Olmak (-dır / -dırlar / idi)', isIrregular: true, sampleSentenceDe: 'Das Wetter ist heute sehr schön.', sampleSentenceTr: 'Bugün hava çok güzel.', conjugationSummary: 'ich bin, du bist, er ist, wir sind (geçmiş: war)', category: 'Temel Fiil' },
  { id: 'vb_13', german: 'planen', pronunciation: 'pılanın', turkish: 'Planlamak', sampleSentenceDe: 'Wir planen eine Reise nach Wien.', sampleSentenceTr: 'Viyana\'ya bir gezi planlıyoruz.', conjugationSummary: 'ich plane, du planst, er plant, wir planen', category: 'Plan' },
  { id: 'vb_14', german: 'besuchen', pronunciation: 'bezuhın', turkish: 'Ziyaret etmek', sampleSentenceDe: 'Ich besuche meine Großeltern.', sampleSentenceTr: 'Büyükanne ve büyükbabamı ziyaret ediyorum.', conjugationSummary: 'ich besuche, du besuchst, er besucht', category: 'Sosyal' },
  { id: 'vb_15', german: 'sprechen', pronunciation: 'şiprehın', turkish: 'Konuşmak', isIrregular: true, sampleSentenceDe: 'Ich spreche Türkisch und ein bisschen Deutsch.', sampleSentenceTr: 'Türkçe ve biraz Almanca konuşuyorum.', conjugationSummary: 'ich spreche, du sprichst, er spricht, wir sprechen', category: 'İletişim' },
  { id: 'vb_16', german: 'einkaufen (ein/kaufen)', pronunciation: 'aynkaufın', turkish: 'Alışveriş yapmak', isSeparable: true, sampleSentenceDe: 'Ich kaufe jeden Samstag im Supermarkt ein.', sampleSentenceTr: 'Her Cumartesi süpermarkette alışveriş yaparım.', conjugationSummary: 'ich kaufe ein, du kaufst ein, er kauft ein', category: 'Alışveriş' },
  { id: 'vb_17', german: 'schließen', pronunciation: 'şiliisın', turkish: 'Kapatmak / Kapanmak', sampleSentenceDe: 'Das Geschäft schließt um 20:00 Uhr.', sampleSentenceTr: 'Mağaza saat 20:00\'de kapanıyor.', conjugationSummary: 'ich schließe, du schließt, er schließt', category: 'Günlük' },
  { id: 'vb_18', german: 'schreiben', pronunciation: 'şıraybın', turkish: 'Yazmak', sampleSentenceDe: 'Ich schreibe einen Brief an meine Freundin.', sampleSentenceTr: 'Kız arkadaşıma bir mektup yazıyorum.', conjugationSummary: 'ich schreibe, du schreibst, er schreibt', category: 'İletişim' },
  { id: 'vb_19', german: 'lesen', pronunciation: 'leyzın', turkish: 'Okumak', isIrregular: true, sampleSentenceDe: 'Er liest jeden Tag die Zeitung.', sampleSentenceTr: 'O her gün gazete okur.', conjugationSummary: 'ich lese, du liest, er liest, wir lesen', category: 'Hobi' },
  { id: 'vb_20', german: 'lernen', pronunciation: 'lernın', turkish: 'Öğrenmek / Çalışmak', sampleSentenceDe: 'Wir lernen fleißig Deutsch für die Prüfung.', sampleSentenceTr: 'Sınav için gayretle Almanca öğreniyoruz.', conjugationSummary: 'ich lerne, du lernst, er lernt, wir lernen', category: 'Eğitim' },
  { id: 'vb_21', german: 'hören', pronunciation: 'hörın', turkish: 'Dinlemek / Duymak', sampleSentenceDe: 'Ich höre gern deutsche Musik.', sampleSentenceTr: 'Severek Almanca müzik dinlerim.', conjugationSummary: 'ich höre, du hörst, er hört, wir hören', category: 'Hobi' },
  { id: 'vb_22', german: 'heißen', pronunciation: 'haysın', turkish: 'Adlandırılmak / Adı olmak', sampleSentenceDe: 'Ich heiße Ufuk und wie heißen Sie?', sampleSentenceTr: 'Benim adım Ufuk, peki sizin adınız ne?', conjugationSummary: 'ich heiße, du heißt, er heißt, wir heißen', category: 'Tanışma' },
  { id: 'vb_23', german: 'trinken', pronunciation: 'tirinkın', turkish: 'İçmek', sampleSentenceDe: 'Ich trinke morgens immer einen Kaffee.', sampleSentenceTr: 'Sabahları hep bir kahve içerim.', conjugationSummary: 'ich trinke, du trinkst, er trinkt, wir trinken', category: 'Beslenme' },
  { id: 'vb_24', german: 'essen', pronunciation: 'esın', turkish: 'Yemek yemek', isIrregular: true, sampleSentenceDe: 'Wir essen gern Gemüse und Fisch.', sampleSentenceTr: 'Severek sebze ve balık yeriz.', conjugationSummary: 'ich esse, du isst, er isst, wir essen', category: 'Beslenme' },
  { id: 'vb_25', german: 'kochen', pronunciation: 'kohın', turkish: 'Pişirmek / Yemek yapmak', sampleSentenceDe: 'Mein Vater kocht am Sonntag für die Familie.', sampleSentenceTr: 'Babam Pazar günü aile için yemek pişirir.', conjugationSummary: 'ich koche, du kochst, er kocht', category: 'Mutfak' },
  { id: 'vb_26', german: 'schmecken', pronunciation: 'şimekın', turkish: 'Tadı güzel olmak / Tatmak', sampleSentenceDe: 'Der Kuchen schmeckt wirklich lecker!', sampleSentenceTr: 'Kek gerçekten çok lezzetli tadıyor!', conjugationSummary: 'es schmeckt, sie schmecken', category: 'Mutfak' },
  { id: 'vb_27', german: 'tanzen', pronunciation: 'tansın', turkish: 'Dans etmek', sampleSentenceDe: 'Sie tanzen sehr gut Salsa.', sampleSentenceTr: 'Onlar çok iyi salsa dansı yapıyor.', conjugationSummary: 'ich tanze, du tanzt, er tanzt', category: 'Hobi' },
  { id: 'vb_28', german: 'fernsehen (fern/sehen)', pronunciation: 'fernzeın', turkish: 'Televizyon izlemek', isSeparable: true, isIrregular: true, sampleSentenceDe: 'Abends sehe ich zwei Stunden fern.', sampleSentenceTr: 'Akşamları iki saat televizyon izlerim.', conjugationSummary: 'ich sehe fern, du siehst fern, er sieht fern', category: 'Hobi' },
  { id: 'vb_29', german: 'schwimmen', pronunciation: 'şivimmın', turkish: 'Yüzmek', sampleSentenceDe: 'Im Sommer schwimme ich oft im See.', sampleSentenceTr: 'Yazın gölde sık sık yüzerim.', conjugationSummary: 'ich schwimme, du schwimmst, er schwimmt', category: 'Spor' },
  { id: 'vb_30', german: 'spielen', pronunciation: 'şipiilın', turkish: 'Oynamak / Enstrüman çalmak', sampleSentenceDe: 'Die Kinder spielen draußen Fußball.', sampleSentenceTr: 'Çocuklar dışarıda futbol oynuyor.', conjugationSummary: 'ich spiele, du spielst, er spielt', category: 'Oyun & Hobi' },
  { id: 'vb_31', german: 'treffen', pronunciation: 'tirefın', turkish: 'Buluşmak / Karşılaşmak', isIrregular: true, sampleSentenceDe: 'Ich treffe mich heute mit Freunden im Café.', sampleSentenceTr: 'Bugün kafede arkadaşlarımla buluşuyorum.', conjugationSummary: 'ich treffe, du triffst, er trifft, wir treffen', category: 'Sosyal' },
  { id: 'vb_32', german: 'wohnen', pronunciation: 'voonın', turkish: 'İkamet etmek / Oturmak', sampleSentenceDe: 'Ich wohne in einer gemütlichen Wohnung.', sampleSentenceTr: 'Rahat bir dairede oturuyorum.', conjugationSummary: 'ich wohne, du wohnst, er wohnt, wir wohnen', category: 'Ev & Yaşam' },
  { id: 'vb_33', german: 'feiern', pronunciation: 'fayern', turkish: 'Kutlamak', sampleSentenceDe: 'Wir feiern heute meinen Geburtstag.', sampleSentenceTr: 'Bugün benim doğum günümü kutluyoruz.', conjugationSummary: 'ich feiere, du feierst, er feiert, wir feiern', category: 'Sosyal' },
  { id: 'vb_34', german: 'arbeiten', pronunciation: 'arbaytın', turkish: 'Çalışmak', sampleSentenceDe: 'Er arbeitet als Ingenieur in Stuttgart.', sampleSentenceTr: 'O Stuttgart\'ta mühendis olarak çalışıyor.', conjugationSummary: 'ich arbeite, du arbeitest, er arbeitet', category: 'İş & Meslek' },
  { id: 'vb_35', german: 'suchen', pronunciation: 'zuhın', turkish: 'Aramak', sampleSentenceDe: 'Ich suche eine 2-Zimmer-Wohnung mit Balkon.', sampleSentenceTr: 'Balkonlu 2 odalı bir daire arıyorum.', conjugationSummary: 'ich suche, du suchst, er sucht, wir suchen', category: 'Konut & Arama' },
  { id: 'vb_36', german: 'bezahlen', pronunciation: 'besaalın', turkish: 'Ödemek', sampleSentenceDe: 'Kann ich mit Kreditkarte bezahlen?', sampleSentenceTr: 'Kredi kartıyla ödeyebilir miyim?', conjugationSummary: 'ich bezahle, du bezahlst, er bezahlt', category: 'Ödeme' },
  { id: 'vb_37', german: 'verdienen', pronunciation: 'ferdinın', turkish: 'Para kazanmak / Hak etmek', sampleSentenceDe: 'Er verdient 2500 Euro im Monat.', sampleSentenceTr: 'O ayda 2500 Euro kazanıyor.', conjugationSummary: 'ich verdiene, du verdienst, er verdient', category: 'İş & Finans' },
  { id: 'vb_38', german: 'überweisen', pronunciation: 'übavayzın', turkish: 'Banka havalesi yapmak', sampleSentenceDe: 'Ich überweise die Miete pünktlich.', sampleSentenceTr: 'Kirayı zamanında havale ediyorum.', conjugationSummary: 'ich überweise, du überweist, er überweist', category: 'Banka & Finans' },
  { id: 'vb_39', german: 'rauchen', pronunciation: 'rauhın', turkish: 'Sigara içmek', sampleSentenceDe: 'Hier im Zimmer darf man nicht rauchen.', sampleSentenceTr: 'Burada odada sigara içilmez.', conjugationSummary: 'ich rauche, du rauchst, er raucht', category: 'Günlük' },
  { id: 'vb_40', german: 'Gibt es? / Es gibt', pronunciation: 'gibtes / es gibt', turkish: 'Var mı? / Var', sampleSentenceDe: 'Gibt es hier ein gutes Restaurant? - Ja, es gibt eins.', sampleSentenceTr: 'Burada iyi bir restoran var mı? - Evet, bir tane var.', conjugationSummary: 'Gibt es ...? (Soru) / Es gibt ... (Düz)', category: 'Varlık Kalıbı' }
];

// ==========================================
// 9. DÖKÜMAN 4. NOT: ÖNEMLİ EDATLAR (PRÄPOSITIONEN)
// ==========================================
export const ESSENTIAL_PREPOSITIONS_A1: PrepositionItem[] = [
  { id: 'prep_1', german: 'in / im', turkish: '-de / -da (İçinde)', pronunciation: 'in / im', usageType: 'Konum (Dativ: in dem = im)', exampleSentenceDe: 'Ich bin im Büro / in der Schule.', exampleSentenceTr: 'Ofisteyim / Okuldayım.', tip: 'Mekanın içinde bulunmayı ifade eder.' },
  { id: 'prep_2', german: 'dort', turkish: 'Orada / Oraya', pronunciation: 'dort', usageType: 'Uzak Konum Belirteci', exampleSentenceDe: 'Das Hotel ist dort drüben.', exampleSentenceTr: 'Otel hemen şuradadır / oradadır.' },
  { id: 'prep_3', german: 'hier', turkish: 'Burada / Buraya', pronunciation: 'hiya', usageType: 'Yakın Konum Belirteci', exampleSentenceDe: 'Wir sind jetzt hier.', exampleSentenceTr: 'Biz şimdi buradayız.' },
  { id: 'prep_4', german: 'auf', turkish: 'Üzerinde (Temaslı)', pronunciation: 'auf', usageType: 'Konum (Üstünde)', exampleSentenceDe: 'Das Buch liegt auf dem Tisch.', exampleSentenceTr: 'Kitap masanın üzerindedir.' },
  { id: 'prep_5', german: 'neben', turkish: 'Yanında (Konum)', pronunciation: 'nebın', usageType: 'Konum Belirteci', exampleSentenceDe: 'Die Apotheke ist neben dem Supermarkt.', exampleSentenceTr: 'Eczane süpermarketin yanındadır.' },
  { id: 'prep_6', german: 'dabei', turkish: 'Yanında / Üzerinde (Eşya)', pronunciation: 'dabay', usageType: 'Eşya & Varlık Durumu', exampleSentenceDe: 'Ich habe meinen Ausweis dabei.', exampleSentenceTr: 'Kimliğim yanımda / üzerimde.' },
  { id: 'prep_7', german: 'ins (in das)', turkish: 'Bir mekanın içine yönelme (-e/-a)', pronunciation: 'ins', usageType: 'Yönelme (Akkusativ)', exampleSentenceDe: 'Wir gehen ins Kino / ins Restaurant.', exampleSentenceTr: 'Sinemaya / Restorana gidiyoruz.' },
  { id: 'prep_8', german: 'ans (an das)', turkish: 'Su kenarına yönelme', pronunciation: 'ans', usageType: 'Yönelme (Kıyı & Kenar)', exampleSentenceDe: 'Im Urlaub fahren wir ans Meer.', exampleSentenceTr: 'Tatilde denize / deniz kenarına gidiyoruz.' },
  { id: 'prep_9', german: 'für', turkish: 'İçin', pronunciation: 'für', usageType: 'Akkusativ Edatı', exampleSentenceDe: 'Dieses Geschenk ist für meine Mutter.', exampleSentenceTr: 'Bu hediye annem içindir.' },
  { id: 'prep_10', german: 'viel', turkish: 'Çok (Fiil ile kullanılır)', pronunciation: 'fiil', usageType: 'Miktar Belirteci', exampleSentenceDe: 'Er arbeitet sehr viel.', exampleSentenceTr: 'O çok çalışıyor.' },
  { id: 'prep_11', german: 'oft', turkish: 'Sıklıkla / Sık sık', pronunciation: 'oft', usageType: 'Zaman Sıklık Zarfı', exampleSentenceDe: 'Ich trinke oft Tee mit Zitrone.', exampleSentenceTr: 'Sık sık limonlu çay içerim.' },
  { id: 'prep_12', german: 'mit', turkish: 'İle / Beraber', pronunciation: 'mit', usageType: 'Dativ Edatı', exampleSentenceDe: 'Ich fahre mit dem Bus zur Arbeit.', exampleSentenceTr: 'İşe otobüs ile gidiyorum.' },
  { id: 'prep_13', german: 'nach', turkish: 'Bir şehire ya da ülkeye yönelme (-e/-a)', pronunciation: 'nah', usageType: 'Yönelme Edatı', exampleSentenceDe: 'Morgen fliege ich nach Deutschland.', exampleSentenceTr: 'Yarın Almanya\'ya uçuyorum.' },
  { id: 'prep_14', german: 'gern', turkish: 'Severek / Zevkle / İsteyerek', pronunciation: 'gern', usageType: 'Tercih ve İstek Belirteci', exampleSentenceDe: 'Ich lerne sehr gern Deutsch.', exampleSentenceTr: 'Çok severek Almanca öğreniyorum.' },
  { id: 'prep_15', german: 'ohne', turkish: '-sız / -siz (Olmadan)', pronunciation: 'oonı', usageType: 'Akkusativ Edatı', exampleSentenceDe: 'Ich trinke meinen Kaffee ohne Zucker.', exampleSentenceTr: 'Kahvemi şekersiz içiyorum.' }
];

// ==========================================
// 10. DÖKÜMAN: SIFATLAR & GOETHE A1 KONUŞMA KARTI KELİMELERİ (POST-IT NOTLARI)
// ==========================================
export const ESSENTIAL_ADJECTIVES_A1: AdjectiveItem[] = [
  { id: 'adj_1', german: 'neu', turkish: 'Yeni', pronunciation: 'noy', opposite: 'alt (eski)', category: 'adjective', exampleSentenceDe: 'Mein Handy ist ganz neu.', exampleSentenceTr: 'Cep telefonum yepyeni.' },
  { id: 'adj_2', german: 'groß', turkish: 'Büyük', pronunciation: 'groos', opposite: 'klein (küçük)', category: 'adjective', exampleSentenceDe: 'Das Zimmer ist sehr groß und schön.', exampleSentenceTr: 'Oda çok büyük ve güzel.' },
  { id: 'adj_3', german: 'klein', turkish: 'Küçük', pronunciation: 'klayn', opposite: 'groß (büyük)', category: 'adjective', exampleSentenceDe: 'Die Küche ist ein bisschen klein.', exampleSentenceTr: 'Mutfak biraz küçük.' },
  { id: 'adj_4', german: 'hell', turkish: 'Aydınlık / Açık renk', pronunciation: 'hel', opposite: 'dunkel (karanlık)', category: 'adjective', exampleSentenceDe: 'Die Wohnung hat große Fenster und ist sehr hell.', exampleSentenceTr: 'Dairenin büyük pencereleri var ve çok aydınlık.' },
  { id: 'adj_5', german: 'dunkel', turkish: 'Karanlık / Koyu renk', pronunciation: 'dunkıl', opposite: 'hell (aydınlık)', category: 'adjective', exampleSentenceDe: 'Im Winter wird es früh dunkel.', exampleSentenceTr: 'Kışın hava erken kararır.' },
  { id: 'adj_6', german: 'mein / meine', turkish: 'Benim', pronunciation: 'mayn / maynı', category: 'pronoun', exampleSentenceDe: 'Meine Wohnung liegt im Zentrum.', exampleSentenceTr: 'Benim dairem merkezdedir.' },
  { id: 'adj_7', german: 'die Wohnung', turkish: 'Daire / Ev', pronunciation: 'voonunk', category: 'housing_card', exampleSentenceDe: 'Ich suche eine 3-Zimmer-Wohnung in Berlin.', exampleSentenceTr: 'Berlin\'de 3 odalı bir daire arıyorum.' },
  { id: 'adj_8', german: 'das Bad', turkish: 'Banyo', pronunciation: 'baat', category: 'housing_card', exampleSentenceDe: 'Das Bad hat eine Dusche und eine Badewanne.', exampleSentenceTr: 'Banyoda bir duş ve bir küvet var.' },
  { id: 'adj_9', german: 'die Miete', turkish: 'Kira', pronunciation: 'miitı', category: 'housing_card', exampleSentenceDe: 'Die Miete kostet 750 Euro warm.', exampleSentenceTr: 'Kira her şey dahil (warm) 750 Euro tutuyor.' },
  { id: 'adj_10', german: 'kosten / es kostet', turkish: 'Fiyatı tutmak / Maliyeti olmak', pronunciation: 'kostın / es kostıt', category: 'housing_card', exampleSentenceDe: 'Wie viel kostet das Zimmer pro Monat?', exampleSentenceTr: 'Odanın aylık fiyatı ne kadar tutuyor?' },
  { id: 'adj_11', german: 'in welche', turkish: 'Hangi ... içinde / Hangi ...\'de', pronunciation: 'in velhı', category: 'housing_card', exampleSentenceDe: 'In welche Straße ist das Gebäude?', exampleSentenceTr: 'Bina hangi caddededir?' }
];

// ==========================================
// 4. JETON VE SINAV SORULARI (QUIZ ARENA)
// ==========================================
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    lessonId: 'alphabet',
    questionText: 'Almancadaki "ß" (Eszett) harfi nasıl okunur?',
    options: ['es (çift sert s)', 'b (be)', 'f (ef)', 'se (c)'],
    correctIndex: 0,
    explanation: 'ß (Eszett) harfi "es" olarak telaffuz edilir ve Türkçedeki sert çift "s" sesini karşılar.',
    tokenReward: 10
  },
  {
    id: 'q2',
    lessonId: 'alphabet',
    questionText: 'Türkçedeki "Ş" harfi Almancada kodlanırken hangi harfle eşleştirilir?',
    options: ['C (se)', 'G (ge)', 'S (es)', 'Z (set)'],
    correctIndex: 2,
    explanation: 'Almancada Ş harfi olmadığı için kodlama yaparken "S" harfi kullanılır ve "es" diye okunur.',
    tokenReward: 10
  },
  {
    id: 'q3',
    lessonId: 'pronunciation',
    questionText: '"ei" harfleri Almancada yan yana geldiğinde nasıl okunur?',
    options: ['ey', 'ii', 'oy', 'ay'],
    correctIndex: 3,
    explanation: '"ei" birleşimi her zaman "ay" olarak okunur (örn: einkaufen -> aynkaufın, zwei -> sıvay).',
    tokenReward: 10
  },
  {
    id: 'q4',
    lessonId: 'pronunciation',
    questionText: '"sechs" (6) kelimesindeki "chs" harf grubu nasıl telaffuz edilir?',
    options: ['ş (zeş)', 'ks (zeks)', 'h (zeh)', 'ç (zeç)'],
    correctIndex: 1,
    explanation: 'Almancada "chs" grubu "ks" olarak okunur, bu yüzden sechs kelimesi "zeks" şeklinde telaffuz edilir.',
    tokenReward: 10
  },
  {
    id: 'q5',
    lessonId: 'pronunciation',
    questionText: '"Jahr" (Yıl) kelimesinde "h" harfi nasıl bir kurala tabidir?',
    options: ['Kelime içinde olduğu için okunmaz, "a"yı uzatır', 'Kelime başında olduğu için okunur', '"ş" sesine dönüşür', 'Hiçbir etkisi yoktur'],
    correctIndex: 0,
    explanation: 'Kelime içinde/sonunda yer alan "h" okunmaz, kendinden önceki sesli harfi uzatarak "Yaar" okutur.',
    tokenReward: 10
  },
  {
    id: 'q6',
    lessonId: 'numbers',
    questionText: 'Almancada "16" (sechzehn) ve "17" (siebzehn) sayılarındaki özel kural nedir?',
    options: ['Başına "und" eklenir', '10 başa gelir', '16\'da -s harfi, 17\'de -en hecesi düşer', 'Okunuşları değişmez'],
    correctIndex: 2,
    explanation: 'sechs -> sechzehn (-s düşer) ve sieben -> siebzehn (-en düşer).',
    tokenReward: 10
  },
  {
    id: 'q7',
    lessonId: 'numbers',
    questionText: '25 sayısının Almanca doğru birleşik kuralı ve yazılışı hangisidir?',
    options: ['zwanzigfünf (20 + 5)', 'fünfzehn (5 + 10)', 'zweihundertfünf (200 + 5)', 'fünfundzwanzig (5 + und + 20)'],
    correctIndex: 3,
    explanation: 'Almancada 21-99 arasındaki sayılarda önce birler basamağı, sonra "und", sonra onlar basamağı söylenir: 5 + und + 20 = fünfundzwanzig.',
    tokenReward: 10
  },
  {
    id: 'q8',
    lessonId: 'numbers',
    questionText: '30 sayısının Almanca yazılışındaki istisna nedir?',
    options: ['dreizig yazılır', 'dreizehn yazılır', 'dreißig (-ßig) yazılır', 'dreiundzwanzig yazılır'],
    correctIndex: 2,
    explanation: 'Onluklarda 20, 40, 50 vb. "-zig" ile biterken, 30 sayısı istisnai olarak "dreißig" (-ßig) ile biter.',
    tokenReward: 10
  },
  {
    id: 'q9',
    lessonId: 'extra_questions',
    questionText: '"Wie ist Ihre Postleitzahl?" sorusu ne anlama gelir?',
    options: ['Posta kodunuz nedir?', 'Telefon numaranız nedir?', 'Kapı numaranız nedir?', 'Araç plakanız nedir?'],
    correctIndex: 0,
    explanation: 'Postleitzahl (PLZ) "posta kodu" demektir. Okunuşu "Post-layt-saal" şeklindedir.',
    tokenReward: 10
  },
  {
    id: 'q10',
    lessonId: 'extra_questions',
    questionText: 'Almancada "Circa" kelimesi ne anlama gelir ve nasıl okunur?',
    options: ['Tam olarak (okunuşu: kirka)', 'Asla (okunuşu: çirka)', 'Yaklaşık olarak (okunuşu: sirka)', 'Uzakta (okunuşu: sirka)'],
    correctIndex: 2,
    explanation: 'Circa "sirka" olarak okunur ve "yaklaşık olarak / takriben" anlamına gelir (örn: Es ist circa 450 km).',
    tokenReward: 10
  },
  {
    id: 'q11',
    lessonId: 'spelling',
    questionText: '"Können Sie bitte Ihren Namen buchstabieren?" cümlesindeki "buchstabieren" ne demektir?',
    options: ['Yazmak', 'Okumak', 'Tanıtmak', 'Hecelemek / Harf harf kodlamak'],
    correctIndex: 3,
    explanation: '"buchstabieren" fiili ismin veya bir kelimenin harf harf kodlanması anlamına gelir.',
    tokenReward: 10
  },
  {
    id: 'q12',
    lessonId: 'extra_questions',
    questionText: '"Wie ist das Kennzeichen von Ihrem Auto?" sorusuna verilecek doğru cevap şablonu hangisidir?',
    options: ['Meine Hausnummer ist 7.', 'Es ist 06 KA 0606.', 'Ich bin 25 Jahre alt.', 'Mein Vorname ist Ali.'],
    correctIndex: 1,
    explanation: 'Kennzeichen araç plakası demektir. Cevap "Es ist [Plaka Numarası]" şeklinde verilir.',
    tokenReward: 10
  },
  {
    id: 'q13',
    lessonId: 'alltagsdeutsch',
    questionText: 'Kuzey Almanya\'da (Norddeutschland) en yaygın kullanılan yerel selamlaşma kelimesi hangisidir?',
    options: ['Moin!', 'Servus!', 'Grüß Gott!', 'Auf Wiedersehen!'],
    correctIndex: 0,
    explanation: '"Moin!" Kuzey Almanya\'da günün her saati kullanılan karakteristik bir selamlaşmadır.',
    tokenReward: 10
  },
  {
    id: 'q14',
    lessonId: 'alltagsdeutsch',
    questionText: 'Telefonda görüşmeyi sonlandırırken kullanılan özel veda ifadesi hangisidir?',
    options: ['Auf Wiedersehen!', 'Tschüss!', 'Bis bald!', 'Auf Wiederhören!'],
    correctIndex: 3,
    explanation: 'Telefonda "duymak" fiilinden türetilen "Auf Wiederhören!" kalıbı kullanılır.',
    tokenReward: 10
  },
  {
    id: 'q15',
    lessonId: 'alltagsdeutsch',
    questionText: '"Wie bitte?" kalıbı hangi durumda söylenir?',
    options: ['Teşekkür ederken', 'Karşı tarafı anlamadığınızda (Efendim? / Anlamadım?)', 'Özür dilerken', 'Tanışırken'],
    correctIndex: 1,
    explanation: '"Wie bitte?" karşı tarafın söylediğini duymadığınızda veya anlamadığınızda "Efendim? / Anlayamadım?" anlamında kullanılır.',
    tokenReward: 10
  },
  {
    id: 'q16',
    lessonId: 'w_fragen',
    questionText: 'Almanca Goethe A1 sınavında memleketi ve gelinen yeri sormak için hangi W-Frage kullanılır?',
    options: ['Wohin?', 'Warum?', 'Woher?', 'Wann?'],
    correctIndex: 2,
    explanation: '"Woher kommen Sie?" (Nereden geliyorsunuz?) sorusunda köken ve çıkış noktası için "Woher" kullanılır.',
    tokenReward: 10
  },
  {
    id: 'q17',
    lessonId: 'important_verbs',
    questionText: '"einkaufen" (alışveriş yapmak) fiili cümle içinde nasıl çekimlenir?',
    options: ['Ich kaufe im Supermarkt ein.', 'Ich einkaufe im Supermarkt.', 'Ich einkaufte im Markt.', 'Ich bin einkaufen.'],
    correctIndex: 0,
    explanation: '"einkaufen" ayrılabilen bir fiildir (trennbare Verben). "ein" öneki cümlenin en sonuna gider: "Ich kaufe ... ein."',
    tokenReward: 10
  },
  {
    id: 'q18',
    lessonId: 'important_verbs',
    questionText: '"überweisen" fiilinin Türkçe anlamı nedir?',
    options: ['Sigara içmek', 'Seyahat etmek', 'Hesap ödemek', 'Banka havalesi yapmak'],
    correctIndex: 3,
    explanation: '"überweisen" fiili banka havalesi / para transferi yapmak anlamına gelir (örn: Ich überweise die Miete).',
    tokenReward: 10
  },
  {
    id: 'q19',
    lessonId: 'prepositions_adjectives',
    questionText: '"Deniz kenarına / Denize gidiyoruz" cümlesinin doğru Almancası hangisidir?',
    options: ['Wir fahren ans Meer.', 'Wir fahren ins Meer.', 'Wir fahren auf dem Meer.', 'Wir fahren neben das Meer.'],
    correctIndex: 0,
    explanation: 'Su ve sahil kenarına yönelirken "ans" (an das) edatı kullanılır: "Wir fahren ans Meer."',
    tokenReward: 10
  },
  {
    id: 'q20',
    lessonId: 'prepositions_adjectives',
    questionText: '"hell" (aydınlık) sıfatının zıt anlamlısı hangisidir?',
    options: ['neu', 'groß', 'klein', 'dunkel'],
    correctIndex: 3,
    explanation: '"hell" (aydınlık/açık) sıfatının zıt anlamlısı "dunkel" (karanlık/koyu) kelimesidir.',
    tokenReward: 10
  },
  {
    id: 'q21',
    lessonId: 'spelling',
    questionText: '"Türkiye\'den geliyorum" ifadesinin doğru Almancası hangisidir?',
    options: ['Ich komme aus Türkei.', 'Ich komme aus der Türkei.', 'Ich wohne in der Türkei.', 'Ich spreche Türkisch.'],
    correctIndex: 1,
    explanation: 'Türkiye ülke olarak artikelli ("die Türkei") olduğu için "aus der Türkei" şeklinde kullanılır.',
    tokenReward: 10
  },
  {
    id: 'q22',
    lessonId: 'spelling',
    questionText: 'Birden fazla hobiyi belirtirken (Çoğul) hangi cümle kalıbı kullanılır?',
    options: ['Mein Hobby ist Musik hören.', 'Ich bin Hobbys Musik.', 'Meine Hobbys sind Musik hören und tanzen.', 'Meine Hobby ist Fußball.'],
    correctIndex: 2,
    explanation: 'Birden fazla hobi anlatılırken çoğul yapı "Meine Hobbys sind ... und ..." şeklinde kurulur.',
    tokenReward: 10
  }
];

// ==========================================
// 5. JETON MAĞAZASI & BAŞARI ROZETLERİ (REWARDS)
// ==========================================
export interface TokenRewardItem {
  id: string;
  name: string;
  category: 'badge' | 'perk' | 'certificate';
  cost: number;
  icon: string;
  description: string;
  perkValue?: string;
}

export const TOKEN_REWARDS_SHOP: TokenRewardItem[] = [
  {
    id: 'badge_starter',
    name: '🥉 Başlangıç Çırağı',
    category: 'badge',
    cost: 50,
    icon: 'Sparkles',
    description: 'Almanca A1 yolculuğuna ilk adımı atan öğrencilere özel temel başarı rozeti.'
  },
  {
    id: 'badge_phonetics_master',
    name: '🥈 Telaffuz & Alfabe Ustası',
    category: 'badge',
    cost: 150,
    icon: 'Headphones',
    description: '30 Harfi ve 20 telaffuz kuralını kusursuz öğrenenler için uzman rozeti.'
  },
  {
    id: 'badge_numbers_guru',
    name: '🥇 Sayılar Şampiyonu',
    category: 'badge',
    cost: 250,
    icon: 'Hash',
    description: '0\'dan 1000\'e kadar tüm sayı ve birleşik formüllere hakimiyet rozeti.'
  },
  {
    id: 'perk_speed_audio',
    name: '⚡ Hızlı Telaffuz Modu',
    category: 'perk',
    cost: 200,
    icon: 'Zap',
    description: 'Tüm kelimelerde ve sayılarda hem yavaş hem de doğal hızda çift ses seçeneğini açar.'
  },
  {
    id: 'badge_a1_speaker',
    name: '💎 A1 Konuşma Lideri',
    category: 'badge',
    cost: 400,
    icon: 'Crown',
    description: 'Tüm 12 kişisel kodlama ve 7 resmi soruyu eksiksiz tamamlayanlara özel rozet.'
  },
  {
    id: 'certificate_a1_complete',
    name: '👑 Almanca A1 Başarı Sertifikası',
    category: 'certificate',
    cost: 500,
    icon: 'ShieldCheck',
    description: 'İsminize özel düzenlenen dijital A1 Başlangıç Seviyesi Başarı Sertifikası.'
  }
];

// Token persistence helpers
export interface UserTokenState {
  coins: number;
  completedLessons: string[];
  unlockedLessons: string[]; // Kredi ile kilidi açılmış derslerin ID listesi
  unlockedRewards: string[];
  streakDays: number;
  quizScore: number;
  lastDailyBonusClaim?: string;
}

export const DEFAULT_TOKEN_STATE: UserTokenState = {
  coins: 50, // 50 Hoşgeldin Kredisi
  completedLessons: [],
  unlockedLessons: ['alphabet', 'quiz_arena', 'goethe_sprechen', 'conversation_practice'], // 1. Ders, Sınav, 130 Resimli Sprechen ve Konuşma Pratiği varsayılan olarak açık
  unlockedRewards: ['badge_starter'],
  streakDays: 1,
  quizScore: 0,
  lastDailyBonusClaim: ''
};

export const loadUserTokenState = (): UserTokenState => {
  try {
    const raw = localStorage.getItem('user_german_tokens_state');
    if (raw) {
      const parsed = JSON.parse(raw);
      return { 
        ...DEFAULT_TOKEN_STATE, 
        ...parsed,
        unlockedLessons: Array.isArray(parsed.unlockedLessons) && parsed.unlockedLessons.length > 0 
          ? Array.from(new Set([...DEFAULT_TOKEN_STATE.unlockedLessons, ...parsed.unlockedLessons]))
          : DEFAULT_TOKEN_STATE.unlockedLessons
      };
    }
  } catch (e) {
    console.error('Error loading token state:', e);
  }
  return DEFAULT_TOKEN_STATE;
};

export const saveUserTokenState = (state: UserTokenState): void => {
  try {
    localStorage.setItem('user_german_tokens_state', JSON.stringify(state));
  } catch (e) {
    console.error('Error saving token state:', e);
  }
};

