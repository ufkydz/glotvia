import { LanguageId, LanguageInfo, CountryInfo } from '../types';

export const COUNTRIES_LIST: CountryInfo[] = [
  { code: 'TR', name: 'Türkiye', flag: '🇹🇷', currency: 'TRY', currencySymbol: '₺', defaultNativeLang: 'tr' },
  { code: 'DE', name: 'Deutschland', flag: '🇩🇪', currency: 'EUR', currencySymbol: '€', defaultNativeLang: 'de' },
  { code: 'FR', name: 'France', flag: '🇫🇷', currency: 'EUR', currencySymbol: '€', defaultNativeLang: 'fr' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', currencySymbol: '£', defaultNativeLang: 'en' },
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', currencySymbol: '$', defaultNativeLang: 'en' },
  { code: 'ES', name: 'España', flag: '🇪🇸', currency: 'EUR', currencySymbol: '€', defaultNativeLang: 'es' },
  { code: 'IT', name: 'Italia', flag: '🇮🇹', currency: 'EUR', currencySymbol: '€', defaultNativeLang: 'it' },
  { code: 'PL', name: 'Polska', flag: '🇵🇱', currency: 'PLN', currencySymbol: 'zł', defaultNativeLang: 'pl' },
  { code: 'RO', name: 'România', flag: '🇷🇴', currency: 'RON', currencySymbol: 'lei', defaultNativeLang: 'ro' },
  { code: 'UA', name: 'Україна', flag: '🇺🇦', currency: 'UAH', currencySymbol: '₴', defaultNativeLang: 'uk' },
  { code: 'NL', name: 'Nederland', flag: '🇳🇱', currency: 'EUR', currencySymbol: '€', defaultNativeLang: 'nl' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', currency: 'EUR', currencySymbol: '€', defaultNativeLang: 'pt' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷', currency: 'BRL', currencySymbol: 'R$', defaultNativeLang: 'pt' },
  { code: 'RU', name: 'Россия', flag: '🇷🇺', currency: 'RUB', currencySymbol: '₽', defaultNativeLang: 'ru' },
  { code: 'SA', name: 'السعودية', flag: '🇸🇦', currency: 'SAR', currencySymbol: '﷼', defaultNativeLang: 'ar' },
  { code: 'AE', name: 'الإمارات', flag: '🇦🇪', currency: 'AED', currencySymbol: 'د.إ', defaultNativeLang: 'ar' },
  { code: 'CN', name: '中国 (China)', flag: '🇨🇳', currency: 'CNY', currencySymbol: '¥', defaultNativeLang: 'zh' },
  { code: 'JP', name: '日本 (Japan)', flag: '🇯🇵', currency: 'JPY', currencySymbol: '¥', defaultNativeLang: 'ja' },
  { code: 'KR', name: '대한민국 (Korea)', flag: '🇰🇷', currency: 'KRW', currencySymbol: '₩', defaultNativeLang: 'ko' },
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', currencySymbol: '₹', defaultNativeLang: 'hi' },
  { code: 'SE', name: 'Sverige', flag: '🇸🇪', currency: 'SEK', currencySymbol: 'kr', defaultNativeLang: 'sv' },
  { code: 'GR', name: 'Ελλάδα', flag: '🇬🇷', currency: 'EUR', currencySymbol: '€', defaultNativeLang: 'el' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', currencySymbol: 'C$', defaultNativeLang: 'en' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD', currencySymbol: 'A$', defaultNativeLang: 'en' },
  { code: 'CH', name: 'Schweiz / Suisse', flag: '🇨🇭', currency: 'CHF', currencySymbol: 'CHF', defaultNativeLang: 'de' },
  { code: 'AT', name: 'Österreich', flag: '🇦🇹', currency: 'EUR', currencySymbol: '€', defaultNativeLang: 'de' },
  { code: 'BE', name: 'Belgique / België', flag: '🇧🇪', currency: 'EUR', currencySymbol: '€', defaultNativeLang: 'fr' }
];

export const LANGUAGES_LIST: LanguageInfo[] = [
  {
    id: 'de',
    name: 'Almanca',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    voiceCode: 'de-DE',
    greeting: 'Guten Tag!',
    greetingPhonetic: '[gu-tın tag]',
    greetingTr: 'İyi günler!',
    speakers: '135 Milyon',
    difficulty: 'Orta',
    color: 'from-amber-500 to-yellow-600',
    description: 'Avrupa Birliği’nin en çok konuşulan ana dili. Mühendislik, felsefe ve iş dünyasının lider dili.'
  },
  {
    id: 'en',
    name: 'İngilizce',
    nativeName: 'English',
    flag: '🇬🇧',
    voiceCode: 'en-US',
    greeting: 'Hello, welcome!',
    greetingPhonetic: '[he-lo, vel-kım]',
    greetingTr: 'Merhaba, hoş geldiniz!',
    speakers: '1.5 Milyar',
    difficulty: 'Kolay',
    color: 'from-blue-500 to-indigo-600',
    description: 'Dünya çapında küresel iletişim, bilim, teknoloji ve seyahatin evrensel ortak dili.'
  },
  {
    id: 'fr',
    name: 'Fransızca',
    nativeName: 'Français',
    flag: '🇫🇷',
    voiceCode: 'fr-FR',
    greeting: 'Bonjour! Comment allez-vous?',
    greetingPhonetic: '[bon-jur, ko-man ta-le vu]',
    greetingTr: 'Günaydın / Merhaba! Nasılsınız?',
    speakers: '300 Milyon',
    difficulty: 'Orta',
    color: 'from-sky-500 to-blue-700',
    description: 'Diplomasi, sanat, moda ve gastronominin asil dili. 29 ülkenin resmi dili.'
  },
  {
    id: 'es',
    name: 'İspanyolca',
    nativeName: 'Español',
    flag: '🇪🇸',
    voiceCode: 'es-ES',
    greeting: '¡Hola! ¿Cómo estás?',
    greetingPhonetic: '[o-la, ko-mo es-tas]',
    greetingTr: 'Merhaba! Nasılsın?',
    speakers: '550 Milyon',
    difficulty: 'Kolay',
    color: 'from-orange-500 to-red-600',
    description: 'Dünyada en çok konuşulan 2. ana dil. Akıcı telaffuzu ve zengin kültürel mirasıyla öğrenmesi çok keyifli.'
  },
  {
    id: 'it',
    name: 'İtalyanca',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    voiceCode: 'it-IT',
    greeting: 'Ciao! Benvenuto!',
    greetingPhonetic: '[ça-o, ben-ve-nu-to]',
    greetingTr: 'Selam! Hoş geldin!',
    speakers: '85 Milyon',
    difficulty: 'Kolay',
    color: 'from-emerald-500 to-teal-700',
    description: 'Melodik fonetiği, opera, mimari ve Akdeniz yaşam tarzıyla kalpleri fetheden dil.'
  },
  {
    id: 'pl',
    name: 'Lehçe',
    nativeName: 'Polski',
    flag: '🇵🇱',
    voiceCode: 'pl-PL',
    greeting: 'Dzień dobry!',
    greetingPhonetic: '[cyn do-brı]',
    greetingTr: 'İyi günler / Merhaba!',
    speakers: '45 Milyon',
    difficulty: 'Orta',
    color: 'from-rose-500 to-red-700',
    description: 'Orta Avrupa’nın en dinamik ekonomisi Polonya’nın ve zengin Slav edebiyatının köklü dili.'
  },
  {
    id: 'ro',
    name: 'Romence',
    nativeName: 'Română',
    flag: '🇷🇴',
    voiceCode: 'ro-RO',
    greeting: 'Bună ziua!',
    greetingPhonetic: '[bu-nı zi-wa]',
    greetingTr: 'İyi günler / Merhaba!',
    speakers: '28 Milyon',
    difficulty: 'Kolay',
    color: 'from-amber-500 to-blue-600',
    description: 'Doğu Avrupa’nın tek Latin kökenli dili; İtalyanca ve İspanyolca ile büyük akrabalık taşır.'
  },
  {
    id: 'uk',
    name: 'Ukraynaca',
    nativeName: 'Українська',
    flag: '🇺🇦',
    voiceCode: 'uk-UA',
    greeting: 'Доброго дня!',
    greetingPhonetic: '[do-bro-ho dni-ya]',
    greetingTr: 'İyi günler / Merhaba!',
    speakers: '40 Milyon',
    difficulty: 'Orta',
    color: 'from-blue-400 to-yellow-500',
    description: 'Melodik fonetiği, zengin halk kültürü ve Doğu Avrupa’nın köklü Doğu Slav dili.'
  },
  {
    id: 'pt',
    name: 'Portekizce',
    nativeName: 'Português',
    flag: '🇵🇹',
    voiceCode: 'pt-PT',
    greeting: 'Olá! Como vai?',
    greetingPhonetic: '[o-la, ko-mu vay]',
    greetingTr: 'Merhaba! Nasıl gidiyor?',
    speakers: '270 Milyon',
    difficulty: 'Kolay',
    color: 'from-green-600 to-emerald-600',
    description: 'Brezilya ve Portekiz başta olmak üzere 9 ülkede konuşulan enerjik dünya dili.'
  },
  {
    id: 'nl',
    name: 'Flemenkçe',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    voiceCode: 'nl-NL',
    greeting: 'Hallo! Goedendag!',
    greetingPhonetic: '[hal-lo, gu-yın-dah]',
    greetingTr: 'Merhaba! İyi günler!',
    speakers: '28 Milyon',
    difficulty: 'Orta',
    color: 'from-orange-500 to-amber-700',
    description: 'İngilizce ve Almanca ile aynı Cermen kökenli, Hollanda ve Belçika’nın dili.'
  },
  {
    id: 'ru',
    name: 'Rusça',
    nativeName: 'Русский',
    flag: '🇷🇺',
    voiceCode: 'ru-RU',
    greeting: 'Здравствуйте!',
    greetingPhonetic: '[zdrast-vuy-te]',
    greetingTr: 'Merhaba / Esenlikler!',
    speakers: '260 Milyon',
    difficulty: 'Zor',
    color: 'from-red-500 to-rose-700',
    description: 'Kiril alfabesi, zengin edebiyatı ve Avrasya coğrafyasının en önemli köprü dili.'
  },
  {
    id: 'ja',
    name: 'Japonca',
    nativeName: '日本語',
    flag: '🇯🇵',
    voiceCode: 'ja-JP',
    greeting: 'こんにちは！ (Konnichiwa!)',
    greetingPhonetic: '[kon-ni-çi-va]',
    greetingTr: 'İyi günler / Merhaba!',
    speakers: '125 Milyon',
    difficulty: 'Zor',
    color: 'from-pink-500 to-rose-600',
    description: 'Hiragana, Katakana ve Kanji yazı sistemleri, anime, teknoloji ve saygı kültürü.'
  },
  {
    id: 'ko',
    name: 'Korece',
    nativeName: '한국어',
    flag: '🇰🇷',
    voiceCode: 'ko-KR',
    greeting: '안녕하세요! (Annyeonghaseyo!)',
    greetingPhonetic: '[an-yong-ha-se-yo]',
    greetingTr: 'Merhaba!',
    speakers: '80 Milyon',
    difficulty: 'Zor',
    color: 'from-violet-500 to-purple-700',
    description: 'Hangul alfabesiyle dünyanın en mantıklı tasarlanmış fonetik yazı sistemi ve K-Pop kültürü.'
  },
  {
    id: 'zh',
    name: 'Çince (Mandarin)',
    nativeName: '中文 (Zhōngwén)',
    flag: '🇨🇳',
    voiceCode: 'zh-CN',
    greeting: '你好！(Nǐ hǎo!)',
    greetingPhonetic: '[ni hao]',
    greetingTr: 'Merhaba!',
    speakers: '1.1 Milyar',
    difficulty: 'Zor',
    color: 'from-amber-600 to-red-600',
    description: 'Tonlamalı yapısı, 5000 yıllık kültürü ve geleceğin küresel ekonomi dili.'
  },
  {
    id: 'ar',
    name: 'Arapça',
    nativeName: 'العربية',
    flag: '🇸🇦',
    voiceCode: 'ar-SA',
    greeting: 'أهلاً وسهلاً (Ahlan wa Sahlan)',
    greetingPhonetic: '[eh-len ve seh-len]',
    greetingTr: 'Hoş geldiniz / Merhaba!',
    speakers: '420 Milyon',
    difficulty: 'Zor',
    color: 'from-teal-600 to-emerald-800',
    description: 'Geniş kelime hazinesi, kök-vezin sistemi ve Ortadoğu ile Kuzey Afrika’nın ortak dili.'
  },
  {
    id: 'el',
    name: 'Yunanca',
    nativeName: 'Ελληνικά',
    flag: '🇬🇷',
    voiceCode: 'el-GR',
    greeting: 'Γειά σας! (Geia sas!)',
    greetingPhonetic: '[ya sas]',
    greetingTr: 'Merhaba!',
    speakers: '14 Milyon',
    difficulty: 'Orta',
    color: 'from-cyan-500 to-blue-600',
    description: 'Antik felsefe, matematik ve tıbbın temel terminolojisini oluşturan köklü alfabe ve dil.'
  },
  {
    id: 'hi',
    name: 'Hintçe',
    nativeName: 'हिन्दी (Hindi)',
    flag: '🇮🇳',
    voiceCode: 'hi-IN',
    greeting: 'नमस्ते (Namaste)',
    greetingPhonetic: '[na-mas-te]',
    greetingTr: 'Saygıyla selamlarım!',
    speakers: '600 Milyon',
    difficulty: 'Orta',
    color: 'from-amber-500 to-orange-600',
    description: 'Devanagari yazısı, Hindistan’ın resmi dili ve Bollywood sinemasının sesi.'
  },
  {
    id: 'sv',
    name: 'İsveççe',
    nativeName: 'Svenska',
    flag: '🇸🇪',
    voiceCode: 'sv-SE',
    greeting: 'Hej! Välkommen!',
    greetingPhonetic: '[hey, vel-kom-men]',
    greetingTr: 'Selam! Hoş geldin!',
    speakers: '11 Milyon',
    difficulty: 'Kolay',
    color: 'from-blue-400 to-yellow-500',
    description: 'Kuzey Avrupa refahının ve İskandinav kültürünün şarkı gibi akan dili.'
  },
  {
    id: 'tr',
    name: 'Türkçe',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    voiceCode: 'tr-TR',
    greeting: 'Merhaba, hoş geldiniz!',
    greetingPhonetic: '[mer-ha-ba]',
    greetingTr: 'Merhaba, hoş geldiniz!',
    speakers: '90 Milyon',
    difficulty: 'Kolay',
    color: 'from-red-600 to-rose-700',
    description: 'Sondan eklemeli zengin yapısı, ses uyumu ve Avrasya coğrafyasının köklü dili.'
  }
];

export function getLanguageInfo(id: LanguageId): LanguageInfo {
  return LANGUAGES_LIST.find(l => l.id === id) || LANGUAGES_LIST[0];
}

export function getCountryInfo(code?: string): CountryInfo {
  if (!code) return COUNTRIES_LIST[0];
  const upper = code.toUpperCase();
  return COUNTRIES_LIST.find(c => c.code === upper) || COUNTRIES_LIST[0];
}

export function getLanguageNameIn(targetLang: LanguageId, inLang: LanguageId = 'tr'): string {
  const lang = getLanguageInfo(targetLang);
  if (inLang === targetLang) return lang.nativeName;
  return lang.name;
}
export interface PhraseItem {
  id: string;
  category: string;
  turkish: string;
  translations: Record<LanguageId, { phrase: string; phonetic: string }>;
}

export const COMMON_PHRASES: PhraseItem[] = [
  {
    id: 'phrase_1',
    category: 'Selamlaşma',
    turkish: 'Merhaba / İyi günler',
    translations: {
      de: { phrase: 'Guten Tag!', phonetic: '[gu-tın tag]' },
      en: { phrase: 'Hello / Good day!', phonetic: '[he-lo / gud dey]' },
      es: { phrase: '¡Hola! / ¡Buenos días!', phonetic: '[o-la / bwe-nos di-as]' },
      fr: { phrase: 'Bonjour!', phonetic: '[bon-jur]' },
      it: { phrase: 'Buongiorno / Ciao!', phonetic: '[bwon-cor-no / ça-o]' },
      pl: { phrase: 'Dzień dobry!', phonetic: '[cyn do-brı]' },
      ro: { phrase: 'Bună ziua!', phonetic: '[bu-nı zi-wa]' },
      uk: { phrase: 'Доброго дня!', phonetic: '[do-bro-ho dni-ya]' },
      ru: { phrase: 'Здравствуйте!', phonetic: '[zdrast-vuy-te]' },
      ja: { phrase: 'こんにちは！', phonetic: '[kon-ni-çi-va]' },
      ko: { phrase: '안녕하세요!', phonetic: '[an-nyeong-ha-se-yo]' },
      zh: { phrase: '你好！', phonetic: '[nǐ hǎo]' },
      ar: { phrase: 'مرحباً', phonetic: '[mar-ha-ban]' },
      pt: { phrase: 'Olá! / Bom dia!', phonetic: '[o-la / bom di-a]' },
      nl: { phrase: 'Goedendag!', phonetic: '[gu-yın-dah]' },
      el: { phrase: 'Γειά σας!', phonetic: '[ya sas]' },
      hi: { phrase: 'नमस्ते!', phonetic: '[na-mas-te]' },
      sv: { phrase: 'God dag / Hej!', phonetic: '[gu-dag / hey]' },
      tr: { phrase: 'Merhaba / İyi günler!', phonetic: '[mer-ha-ba]' }
    }
  },
  {
    id: 'phrase_2',
    category: 'Nezaket',
    turkish: 'Teşekkür ederim, çok naziksiniz',
    translations: {
      de: { phrase: 'Vielen Dank, sehr nett!', phonetic: '[fi-lın dank, zer net]' },
      en: { phrase: 'Thank you very much!', phonetic: '[tenk yu ve-ri maç]' },
      es: { phrase: '¡Muchas gracias!', phonetic: '[mu-ças gra-si-as]' },
      fr: { phrase: 'Merci beaucoup!', phonetic: '[mer-si bo-ku]' },
      it: { phrase: 'Grazie mille!', phonetic: '[grat-sye mil-le]' },
      pl: { phrase: 'Dziękuję bardzo!', phonetic: '[dzyen-ku-ye bar-dzo]' },
      ro: { phrase: 'Mulțumesc foarte mult!', phonetic: '[mul-tsu-mesk foar-te mult]' },
      uk: { phrase: 'Дуже дякую!', phonetic: '[du-je dya-ku-yu]' },
      ru: { phrase: 'Большое спасибо!', phonetic: '[bal-şo-ye spa-si-ba]' },
      ja: { phrase: 'ありがとうございます！', phonetic: '[a-ri-ga-to go-za-i-mas]' },
      ko: { phrase: '정말 감사합니다!', phonetic: '[cong-mal kam-sa-ham-ni-da]' },
      zh: { phrase: '非常感谢！', phonetic: '[fēi-cháng gǎn-xiè]' },
      ar: { phrase: 'شكراً جزيلاً', phonetic: '[şuk-ran ce-zi-len]' },
      pt: { phrase: 'Muito obrigado!', phonetic: '[muy-tu o-bri-ga-du]' },
      nl: { phrase: 'Hartelijk bedankt!', phonetic: '[har-tıl-ık bı-dankt]' },
      el: { phrase: 'Ευχαριστώ πολύ!', phonetic: '[ef-ha-ris-to po-li]' },
      hi: { phrase: 'बहुत बहुत धन्यवाद!', phonetic: '[ba-hut ba-hut dhan-ya-vad]' },
      sv: { phrase: 'Tack så mycket!', phonetic: '[tak so mik-ket]' },
      tr: { phrase: 'Çok teşekkür ederim!', phonetic: '[çok te-şek-kür e-de-rim]' }
    }
  },
  {
    id: 'phrase_3',
    category: 'Tanışma',
    turkish: 'Benim adım... Tanıştığıma memnun oldum',
    translations: {
      de: { phrase: 'Ich heiße... Freut mich!', phonetic: '[ih hay-se... froyt miy]' },
      en: { phrase: 'My name is... Nice to meet you!', phonetic: '[may neym iz... nays tu mit yu]' },
      es: { phrase: 'Me llamo... ¡Mucho gusto!', phonetic: '[me ya-mo... mu-ço gus-to]' },
      fr: { phrase: 'Je m’appelle... Enchanté!', phonetic: '[jö ma-pel... an-şan-te]' },
      it: { phrase: 'Mi chiamo... Piacere!', phonetic: '[mi kya-mo... pya-çe-re]' },
      pl: { phrase: 'Nazywam się... Miło mi!', phonetic: '[na-zı-vam sye... mi-wo mi]' },
      ro: { phrase: 'Mă numesc... Încântat!', phonetic: '[mı nu-mesk... in-kın-tat]' },
      uk: { phrase: 'Мене звати... Приємно познайомитися!', phonetic: '[me-ne zva-ti...]' },
      ru: { phrase: 'Меня зовут... Очень приятно!', phonetic: '[min-ya za-vut... o-çin pri-yat-na]' },
      ja: { phrase: '私の名前は... よろしくお願いします！', phonetic: '[va-ta-şi no na-ma-e va... yo-ro-şi-ku]' },
      ko: { phrase: '제 이름은... 만나서 반갑습니다!', phonetic: '[ce i-rı-mın... man-na-so pan-gap-sım-ni-da]' },
      zh: { phrase: '我叫... 很高兴认识你！', phonetic: '[wǒ jiào... hěn gāo-xìng rèn-shi nǐ]' },
      ar: { phrase: 'اسمي... تشرفت بمعرفتك', phonetic: '[is-mi... te-şer-ref-tü bi-ma-ri-fe-tik]' },
      pt: { phrase: 'O meu nome é... Prazer!', phonetic: '[u mew no-mi e... pra-zer]' },
      nl: { phrase: 'Mijn naam is... Aangenaam!', phonetic: '[meyn nam is... an-hı-nam]' },
      el: { phrase: 'Με λένε... Χάρηκα πολύ!', phonetic: '[me le-ne... ha-ri-ka po-li]' },
      hi: { phrase: 'मेरा नाम... आपसे मिलकर खुशी हुई!', phonetic: '[me-ra nam... aap-se mil-kar khu-şi hu-i]' },
      sv: { phrase: 'Jag heter... Trevligt att träffas!', phonetic: '[yag he-tör... trev-ligt at tref-fas]' },
      tr: { phrase: 'Benim adım... Tanıştığıma memnun oldum!', phonetic: '[be-nim a-dım...]' }
    }
  },
  {
    id: 'phrase_4',
    category: 'Seyahat',
    turkish: 'Hesap lütfen / Ne kadar?',
    translations: {
      de: { phrase: 'Die Rechnung, bitte! / Wie viel kostet das?', phonetic: '[di reh-nung bi-te / vi fil kos-tet das]' },
      en: { phrase: 'The bill, please! / How much is this?', phonetic: '[dı bil pliz / haw maç iz dis]' },
      es: { phrase: '¡La cuenta, por favor! / ¿Cuánto cuesta?', phonetic: '[la kwen-ta por fa-vor / kwan-to kwes-ta]' },
      fr: { phrase: 'L’addition, s’il vous plaît! / C’est combien?', phonetic: '[la-di-siyon sil vu ple / se kom-biyen]' },
      it: { phrase: 'Il conto, per favore! / Quanto costa?', phonetic: '[il kon-to per fa-vo-re / kwan-to kos-ta]' },
      pl: { phrase: 'Rachunek poproszę! / Ile to kosztuje?', phonetic: '[ra-hu-nek po-pro-şe / i-le to koş-tu-ye]' },
      ro: { phrase: 'Nota, vă rog! / Cât costă?', phonetic: '[no-ta vı rog / kıt kos-tı]' },
      uk: { phrase: 'Рахунок, будь ласка! / Скільки це коштує?', phonetic: '[ra-hu-nok bud las-ka]' },
      ru: { phrase: 'Счёт, пожалуйста! / Сколько это стоит?', phonetic: '[şot pa-jal-sta / skol-ka e-ta sto-it]' },
      ja: { phrase: 'お会計をお願いします / いくらですか？', phonetic: '[o-kay-key o o-ne-gay-şi-mas / i-ku-ra des-ka]' },
      ko: { phrase: '계산서 부탁드립니다 / 얼마예요?', phonetic: '[kye-san-so bu-tak-drim-ni-da / ol-ma-ye-yo]' },
      zh: { phrase: '请买单！/ 这个多少钱？', phonetic: '[qǐng mǎi-dān / zhè-ge duō-shao qián]' },
      ar: { phrase: 'الحساب من فضلك / بكم هذا؟', phonetic: '[el-hi-sab min fad-lik / bi-kem ha-za]' },
      pt: { phrase: 'A conta, por favor! / Quanto custa?', phonetic: '[a kon-ta por fa-vor / kwan-tu kus-ta]' },
      nl: { phrase: 'De rekening alstublieft! / Hoeveel kost dit?', phonetic: '[de rey-kı-ning als-tü-blift / hu-veyl kost dit]' },
      el: { phrase: 'Το λογαριασμό παρακαλώ! / Πόσο κάνει;', phonetic: '[to lo-gar-yaz-mo pa-ra-ka-lo / po-so ka-ni]' },
      hi: { phrase: 'बिल दीजिए! / यह कितने का है?', phonetic: '[bil di-ji-ye / yeh kit-ne ka hai]' },
      sv: { phrase: 'Notan tack! / Hur mycket kostar det?', phonetic: '[no-tan tak / hur mik-ket kos-tar det]' },
      tr: { phrase: 'Hesap lütfen! / Bunun fiyatı ne kadar?', phonetic: '[he-sap lüt-fen]' }
    }
  }
];
