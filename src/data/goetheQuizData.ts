export type GoetheLevel = 'A1' | 'A2' | 'B1';
export type GoetheSection = 'lesen' | 'grammatik' | 'hoeren' | 'sprechen_schreiben' | 'wortschatz';

export interface GoetheQuizOption {
  text: string;
  subText?: string;
  isCorrect: boolean;
}

export interface GoetheQuizQuestion {
  id: string;
  level: GoetheLevel;
  section: GoetheSection;
  sectionLabelTr: string;
  topic: string;
  promptDe: string;
  promptTr: string;
  contextSnippet?: string;
  audioText?: string;
  options: GoetheQuizOption[];
  explanationDe: string;
  explanationTr: string;
  examTip: string;
  points: number;
}

export interface GoetheSimulationConfig {
  level: 'ALL' | GoetheLevel;
  section: 'ALL' | GoetheSection;
  questionCount: number;
  mode: 'practice' | 'exam';
  timeLimitMinutes?: number;
}

export interface QuestionUserResult {
  question: GoetheQuizQuestion;
  selectedOptionIndex: number | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
  isFlagged?: boolean;
}

export interface GoetheAssessmentSummary {
  totalQuestions: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  emptyAnswersCount: number;
  totalScorePercentage: number;
  totalPointsEarned: number;
  maxPointsPossible: number;
  totalDurationSeconds: number;
  averageTimePerQuestion: number;
  grade: 'SEHR_GUT' | 'GUT' | 'BEFRIEDIGEND' | 'NICHT_BESTANDEN';
  gradeLabelDe: string;
  gradeLabelTr: string;
  badge: string;
  passed: boolean;
  byLevelBreakdown: Record<GoetheLevel, { total: number; correct: number; percentage: number }>;
  bySectionBreakdown: Record<GoetheSection, { total: number; correct: number; percentage: number; labelTr: string }>;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  tokenReward: number;
  xpReward: number;
}

export const GOETHE_QUESTION_BANK: GoetheQuizQuestion[] = [
  // ==========================================
  // GOETHE A1 - START DEUTSCH 1
  // ==========================================
  {
    id: 'a1_g_001',
    level: 'A1',
    section: 'grammatik',
    sectionLabelTr: 'A1 Dilbilgisi (Fiil Çekimi)',
    topic: 'Regelmäßige Verben (Düzenli Fiiller)',
    promptDe: 'Ergänzen Sie das richtige Verb: "Frau Müller, woher _______ Sie?"',
    promptTr: 'Cümleyi uygun fiil çekimi ile tamamlayınız: "Bayan Müller, nerelisiniz?"',
    options: [
      { text: 'kommst', isCorrect: false },
      { text: 'kommen', isCorrect: true },
      { text: 'kommt', isCorrect: false },
      { text: 'komme', isCorrect: false }
    ],
    explanationDe: 'Das Subjekt ist das formelle "Sie" (Frau Müller). Die Endung für "Sie" ist immer "-en".',
    explanationTr: 'Hitap "Frau Müller" ve nezaket zamiri "Sie" (Siz) olduğu için fiil "-en" takısı alır: "kommen Sie".',
    examTip: 'Goethe A1 sınavında nezaket formu "Sie" ile üçüncü tekil şahıs "sie" (o) ve çoğul "sie" (onlar) ayrımlarına dikkat ediniz.',
    points: 5
  },
  {
    id: 'a1_g_002',
    level: 'A1',
    section: 'grammatik',
    sectionLabelTr: 'A1 Dilbilgisi (Artikel ve Akkusativ)',
    topic: 'Bestimmter/Unbestimmter Artikel & Akkusativ',
    promptDe: 'Wählen Sie den richtigen Artikel: "Ich habe _______ neuen Computer gekauft."',
    promptTr: 'Doğru artikeli seçiniz: "Yeni bir bilgisayar satın aldım."',
    options: [
      { text: 'einen', isCorrect: true },
      { text: 'ein', isCorrect: false },
      { text: 'eine', isCorrect: false },
      { text: 'einem', isCorrect: false }
    ],
    explanationDe: '"Computer" ist maskulin (der Computer). Nach dem Verb "haben" steht der Akkusativ: der -> den / einen.',
    explanationTr: '"Computer" kelimesi eril (der) artikeldir. "Haben" (sahip olmak) fiili nesneyi -i halinde (Akkusativ) ister: der -> den / einen.',
    examTip: 'Eril (der) isimler sadece Akkusativ halinde "den / einen / keinen" dönüşümüne uğrar.',
    points: 5
  },
  {
    id: 'a1_g_003',
    level: 'A1',
    section: 'grammatik',
    sectionLabelTr: 'A1 Dilbilgisi (Ayrılabilen Fiiller)',
    topic: 'Trennbare Verben (Ayrılabilen Fiiller)',
    promptDe: 'Ergänzen Sie den Satz: "Der Zug nach München _______ um 08:30 Uhr _______."',
    promptTr: 'Cümleyi tamamlayınız: "Münih treni saat 08:30\'da hareket ediyor."',
    options: [
      { text: 'fährt ... ab', isCorrect: true },
      { text: 'abfährt ... -', isCorrect: false },
      { text: 'fährt ... an', isCorrect: false },
      { text: 'steigt ... ein', isCorrect: false }
    ],
    explanationDe: 'Das Verb ist "abfahren" (hareket etmek). Es ist trennbar: "Der Zug fährt ... ab".',
    explanationTr: '"Abfahren" (kalkmak/hareket etmek) ayrılabilen fiildir. Çekimli kök 2. sırada, "ab" ön eki ise cümlenin en sonuna gider.',
    examTip: 'Ayrılabilen fiillerin ön ekleri (ab, an, auf, aus, ein, mit, vor, zu) düz cümlede cümlenin en sonuna yerleşir.',
    points: 5
  },
  {
    id: 'a1_g_004',
    level: 'A1',
    section: 'grammatik',
    sectionLabelTr: 'A1 Dilbilgisi (Edatlar - Dativ)',
    topic: 'Präpositionen mit Dativ (mit, nach, aus, zu)',
    promptDe: 'Welche Präposition passt: "Ich fahre jeden Morgen _______ der U-Bahn zur Arbeit."',
    promptTr: 'Hangi edat uygundur: "Her sabah metro ile işe giderim."',
    options: [
      { text: 'mit', isCorrect: true },
      { text: 'in', isCorrect: false },
      { text: 'auf', isCorrect: false },
      { text: 'nach', isCorrect: false }
    ],
    explanationDe: 'Ulaşım araçlarında her zaman "mit + Dativ" kullanılır: die U-Bahn -> mit der U-Bahn.',
    explanationTr: 'Taşıt ve vasıtalarda "ile" anlamında daima "mit + Dativ" kullanılır (die U-Bahn -> mit der U-Bahn).',
    examTip: 'Mit, nach, aus, zu, von, bei edatları her zaman DATIV (-e/-de hali) çeker.',
    points: 5
  },
  {
    id: 'a1_l_001',
    level: 'A1',
    section: 'lesen',
    sectionLabelTr: 'A1 Okuma & Anlama (İlan & Tabela)',
    topic: 'Lesen Teil 1 (Kısa Duyurular & Tabelalar)',
    promptDe: 'Lesen Sie das Schild: Wo finden Sie diese Information?',
    promptTr: 'Tabelayı okuyunuz: Bu bilgiyi nerede görürsünüz?',
    contextSnippet: '🚨 ACHTUNG!\nBibliothek geöffnet:\nMontag - Freitag: 09:00 - 18:00 Uhr\nSamstag: 10:00 - 14:00 Uhr\nSonntag geschlossen!',
    options: [
      { text: 'In einer Bibliothek (Kütüphanede)', isCorrect: true },
      { text: 'Im Schwimmbad (Havuzda)', isCorrect: false },
      { text: 'Im Restaurant (Restoranda)', isCorrect: false },
      { text: 'Am Bahnhof (Trende/İstasyonda)', isCorrect: false }
    ],
    explanationDe: 'Der Text nennt ausdrücklich "Bibliothek geöffnet" und zeigt Öffnungszeiten.',
    explanationTr: 'Metnin başında "Bibliothek geöffnet" (Kütüphane açık saatleri) açıkça yazmaktadır.',
    examTip: 'Goethe A1 Lesen bölümünde kelime anahtarlarına (Schlagwörter) ve açılış-kapanış saatlerine odaklanın.',
    points: 5
  },
  {
    id: 'a1_l_002',
    level: 'A1',
    section: 'lesen',
    sectionLabelTr: 'A1 Okuma & Anlama (Kısa E-posta)',
    topic: 'Lesen Teil 2 (E-posta & Davet)',
    promptDe: 'Lesen Sie die E-Mail: Wann beginnt die Party?',
    promptTr: 'E-postayı okuyunuz: Parti ne zaman başlıyor?',
    contextSnippet: 'Hallo Mehmet,\nich feiere am Samstag meinen Geburtstag! Wir treffen uns ab 19:30 Uhr bei mir im Garten. Bitte bring etwas zu trinken mit.\nViele Grüße,\nLucas',
    options: [
      { text: 'Um 19:30 Uhr (Saat 19:30\'da)', isCorrect: true },
      { text: 'Am Sonntag (Pazar günü)', isCorrect: false },
      { text: 'Um 18:00 Uhr (Saat 18:00\'de)', isCorrect: false },
      { text: 'In einem Restaurant (Bir restoranda)', isCorrect: false }
    ],
    explanationDe: 'Lucas schreibt: "am Samstag... ab 19:30 Uhr bei mir im Garten".',
    explanationTr: 'Lucas e-postada Cumartesi günü saat 19:30\'da bahçede buluşulacağını belirtmiştir.',
    examTip: 'Saat ve gün sorularında metindeki sayıları ve zaman zarflarını (ab, um, am) işaretleyin.',
    points: 5
  },
  {
    id: 'a1_h_001',
    level: 'A1',
    section: 'hoeren',
    sectionLabelTr: 'A1 Dinleme Simülasyonu (Telefon/Anons)',
    topic: 'Hören Teil 1 (Fiyat & Sayı Anlama)',
    promptDe: 'Hören Sie den Text: Wie viel kostet das Menü heute?',
    promptTr: 'Ses kaydını dinleyiniz: Günün menüsü bugün kaç Euro?',
    audioText: 'Guten Tag, verehrte Gäste! Unser Tagesmenü mit Suppe und Salat kostet heute nur zwölf Euro fünfzig. Guten Appetit!',
    options: [
      { text: '12,50 € (Zwölf Euro fünfzig)', isCorrect: true },
      { text: '20,15 € (Zwanzig Euro fünfzehn)', isCorrect: false },
      { text: '15,00 € (Fünfzehn Euro)', isCorrect: false },
      { text: '2,50 € (Zwei Euro fünfzig)', isCorrect: false }
    ],
    explanationDe: 'Die Ansage sagt: "kostet heute nur zwölf Euro fünfzig" (12,50 €).',
    explanationTr: 'Sesli anonsta "zwölf Euro fünfzig" (12 Euro 50 Sent = 12,50 €) denmektedir.',
    examTip: 'Almanca sayılarda 12 (zwölf) ile 20 (zwanzig) ses benzerliğine dikkat ediniz.',
    points: 5
  },
  {
    id: 'a1_h_002',
    level: 'A1',
    section: 'hoeren',
    sectionLabelTr: 'A1 Dinleme Simülasyonu (Tren Anonsu)',
    topic: 'Hören Teil 2 (İstasyon Anonsları)',
    promptDe: 'Hören Sie die Bahnhofsansage: Auf welchem Gleis fährt der ICE nach Berlin?',
    promptTr: 'İstasyon anonsunu dinleyiniz: Berlin treni kaç numaralı perondan kalkıyor?',
    audioText: 'Achtung an Gleis vier! Der ICE zweihundertacht nach Berlin Hauptbahnhof fährt jetzt ein. Bitte Vorsicht an der Bahnsteigkante.',
    options: [
      { text: 'Gleis 4 (4. Peron)', isCorrect: true },
      { text: 'Gleis 2 (2. Peron)', isCorrect: false },
      { text: 'Gleis 8 (8. Peron)', isCorrect: false },
      { text: 'Gleis 14 (14. Peron)', isCorrect: false }
    ],
    explanationDe: 'Die Ansage beginnt mit: "Achtung an Gleis vier!" (4. Peron).',
    explanationTr: 'Anons "Achtung an Gleis vier" (4. peronda dikkat) cümlesi ile başlar.',
    examTip: '"Gleis" (peron) ve "Bahnsteig" (tren platformu) Goethe A1 sınavının en sık çıkan anahtar kelimeleridir.',
    points: 5
  },
  {
    id: 'a1_s_001',
    level: 'A1',
    section: 'sprechen_schreiben',
    sectionLabelTr: 'A1 Konuşma & İletişim (Nezaketle Rica)',
    topic: 'Goethe Sprechen Teil 3 (Bitten & Reagieren)',
    promptDe: 'Sie möchten im Café ein Glas Wasser bestellen. Wie formulieren Sie die höfliche Bitte?',
    promptTr: 'Kafede bir bardak su sipariş etmek istiyorsunuz. En kibar rica cümlesi hangisidir?',
    options: [
      { text: 'Könnten Sie mir bitte ein Glas Wasser bringen?', isCorrect: true },
      { text: 'Bring Wasser sofort!', isCorrect: false },
      { text: 'Ich Wasser trinken will.', isCorrect: false },
      { text: 'Geben Wasser hier!', isCorrect: false }
    ],
    explanationDe: 'Höfliche Bitten werden mit "Könnten Sie bitte... + Infinitiv" oder "Ich hätte gern..." formuliert.',
    explanationTr: 'Goethe sınavında rica kalıbı "Könnten Sie bitte ... bringen?" (Lütfen getirebilir misiniz?) veya "Ich möchte bitte..." kalıbıdır.',
    examTip: 'Goethe A1 Sprechen 3. bölümde resim kartlarına rica cümleleri üretirken daima "Können Sie bitte..." kalıbını kullanın.',
    points: 5
  },
  {
    id: 'a1_w_001',
    level: 'A1',
    section: 'wortschatz',
    sectionLabelTr: 'A1 Temel Kelime Bilgisi',
    topic: 'Familie & Beziehungen (Aile & Akrabalık)',
    promptDe: 'Was ist das Gegenteil von "verheiratet"?',
    promptTr: '"Verheiratet" (evli) kelimesinin zıt anlamlısı nedir?',
    options: [
      { text: 'ledig (bekâr)', isCorrect: true },
      { text: 'geschieden (boşanmış)', isCorrect: false },
      { text: 'müde (yorgun)', isCorrect: false },
      { text: 'alt (yaşlı)', isCorrect: false }
    ],
    explanationDe: '"Ledig" bedeutet unverheiratet / Single. Im Formular steht oft "Familienstand: ledig / verheiratet".',
    explanationTr: 'Formlarda medeni durum için "ledig" (bekâr) kelimesi "verheiratet" (evli) kelimesinin temel zıttıdır.',
    examTip: 'Goethe A1 form doldurma (Formular ausfüllen) bölümünde "Familienstand" için ledig/verheiratet/geschieden kelimeleri sorulur.',
    points: 5
  },

  // ==========================================
  // GOETHE A2 - FIT IN DEUTSCH / START DEUTSCH 2
  // ==========================================
  {
    id: 'a2_g_001',
    level: 'A2',
    section: 'grammatik',
    sectionLabelTr: 'A2 Dilbilgisi (Perfekt Zaman)',
    topic: 'Perfekt mit sein oder haben',
    promptDe: 'Welcher Hilfsverb passt: "Gestern _______ wir nach Berlin gefahren."',
    promptTr: 'Cümleyi doğru yardımcı fiil ile tamamlayınız: "Dün Berlin\'e gittik/sürdük."',
    options: [
      { text: 'sind', isCorrect: true },
      { text: 'haben', isCorrect: false },
      { text: 'waren', isCorrect: false },
      { text: 'hatten', isCorrect: false }
    ],
    explanationDe: '"Fahren" ist ein Verb der Ortsveränderung (hareket/yer değiştirme) und bildet das Perfekt mit "sein": wir sind gefahren.',
    explanationTr: '"Fahren" fiili yer değiştirme ve hareket bildirdiği için geçmiş zamanı (Perfekt) "sein" (wir sind) ile yapar.',
    examTip: 'Gitmek (gehen, fahren, fliegen, reisen, kommen) ve durum değişikliği (aufstehen, sterben) bildiren fiiller Perfekt\'te SEIN alır.',
    points: 6
  },
  {
    id: 'a2_g_002',
    level: 'A2',
    section: 'grammatik',
    sectionLabelTr: 'A2 Dilbilgisi (Bağlaçlar & Cümle Düzeni)',
    topic: 'Nebensätze mit "weil" und "dass"',
    promptDe: 'Wählen Sie den grammatisch richtigen Satz mit "weil":',
    promptTr: '"Weil" (çünkü / -dığı için) bağlacının doğru cümle dizilimini seçiniz:',
    options: [
      { text: 'Ich bleibe zu Hause, weil ich krank bin.', isCorrect: true },
      { text: 'Ich bleibe zu Hause, weil bin ich krank.', isCorrect: false },
      { text: 'Ich bleibe zu Hause, weil ich bin krank.', isCorrect: false },
      { text: 'Weil ich bin krank, bleibe ich zu Hause.', isCorrect: false }
    ],
    explanationDe: '"Weil" leitet einen Nebensatz ein: Das konjugierte Verb ("bin") wandert ans Satzende!',
    explanationTr: '"Weil" yan cümle bağlacıdır ve çekimli fiili ("bin") cümlenin en sonuna atar: "weil ich krank bin".',
    examTip: 'Nebensatz bağlaçları (weil, dass, wenn, ob, obwohl) fiili her zaman cümlenin en sonuna gönderir.',
    points: 6
  },
  {
    id: 'a2_g_003',
    level: 'A2',
    section: 'grammatik',
    sectionLabelTr: 'A2 Dilbilgisi (Dönüşlü Fiiller)',
    topic: 'Reflexive Verben (sich freuen, sich interessieren)',
    promptDe: 'Ergänzen Sie: "Ich interessiere _______ sehr für die deutsche Sprache."',
    promptTr: 'Boşluğu uygun dönüşlü zamir ile doldurunuz: "Alman diline çok ilgi duyuyorum."',
    options: [
      { text: 'mich', isCorrect: true },
      { text: 'mir', isCorrect: false },
      { text: 'sich', isCorrect: false },
      { text: 'dich', isCorrect: false }
    ],
    explanationDe: '"Sich interessieren für" verlangt das Reflexivpronomen im Akkusativ: ich interessiere mich.',
    explanationTr: '"Sich interessieren für" kalıbında 1. tekil şahıs Akkusativ zamiri "mich" kullanılır (Ich interessiere mich).',
    examTip: 'Reflexive fiillerde "ich" için %90 "mich" (Akkusativ), nadiren "mir" (Dativ - örn: Ich wasche mir die Hände) kullanılır.',
    points: 6
  },
  {
    id: 'a2_l_001',
    level: 'A2',
    section: 'lesen',
    sectionLabelTr: 'A2 Okuma & Anlama (İş & Günlük Hayat)',
    topic: 'Lesen Teil 1 (Kısa Makale / Blog)',
    promptDe: 'Lesen Sie den Textauszug: Was macht Anna am Wochenende am liebsten?',
    promptTr: 'Metin parçasını okuyunuz: Anna hafta sonu en çok ne yapmayı seviyor?',
    contextSnippet: 'Anna (28) arbeitet als Krankenschwester in Köln. Unter der Woche hat sie wenig Freizeit. Aber am Wochenende wandert sie am liebsten in den Bergen oder liest historische Romane in ihrem Garten.',
    options: [
      { text: 'In den Bergen wandern und Romane lesen', isCorrect: true },
      { text: 'Im Krankenhaus Überstunden machen', isCorrect: false },
      { text: 'Nur fernsehen und schlafen', isCorrect: false },
      { text: 'In ein anderes Land umziehen', isCorrect: false }
    ],
    explanationDe: 'Der Text sagt: "...am Wochenende wandert sie am liebsten in den Bergen oder liest historische Romane".',
    explanationTr: 'Metinde hafta sonları dağlarda yürüyüş yapmayı (wandern) ve bahçesinde roman okumayı en çok sevdiği belirtilmiştir.',
    examTip: '"Am liebsten" (en çok sevilerek yapılan) gibi derecelendirme zarfları sınav sorularında hedef cevabı verir.',
    points: 6
  },
  {
    id: 'a2_h_001',
    level: 'A2',
    section: 'hoeren',
    sectionLabelTr: 'A2 Dinleme Simülasyonu (Doktor Randevusu)',
    topic: 'Hören Teil 1 (Telesekreter Mesajı)',
    promptDe: 'Hören Sie die Mailbox-Nachricht: Wann ist der neue Termin für Herrn Schmidt?',
    promptTr: 'Telesekreter mesajını dinleyiniz: Bay Schmidt\'in yeni randevu tarihi ne zamandır?',
    audioText: 'Guten Tag, Herr Schmidt. Hier ist die Arztpraxis Dr. Weber. Ihr Termin am Dienstag muss leider verschoben werden. Bitte kommen Sie am Donnerstag um zehn Uhr dreißig. Vielen Dank.',
    options: [
      { text: 'Am Donnerstag um 10:30 Uhr', isCorrect: true },
      { text: 'Am Dienstag um 10:00 Uhr', isCorrect: false },
      { text: 'Am Freitag um 09:30 Uhr', isCorrect: false },
      { text: 'Am Mittwoch um 11:00 Uhr', isCorrect: false }
    ],
    explanationDe: 'Die Nachricht sagt deutlich: "Bitte kommen Sie am Donnerstag um zehn Uhr dreißig" (Perşembe 10:30).',
    explanationTr: 'Mesajda Salı günkü randevunun ertelendiği, yeni randevunun "Donnerstag um zehn Uhr dreißig" (Perşembe 10:30) olduğu iletilmiştir.',
    examTip: 'Almanca dinleme testlerinde ilk söylenen gün (Dienstag) genellikle iptal edilen veya yanıltıcı gündür; "verschoben" sonrasına dikkat edin!',
    points: 6
  },
  {
    id: 'a2_s_001',
    level: 'A2',
    section: 'sprechen_schreiben',
    sectionLabelTr: 'A2 Yazma & E-posta (Mazeret Bildirme)',
    topic: 'Schreiben Teil 1 (Kurze Mitteilung / Entschuldigung)',
    promptDe: 'Sie können morgen nicht zum Deutschkurs kommen. Welcher Satz passt am besten in die Entschuldigungs-E-Mail?',
    promptTr: 'Yarın Almanca kursuna gidemiyorsunuz. Özür e-postasına en uygun cümle hangisidir?',
    options: [
      { text: 'Leider kann ich morgen nicht kommen, weil ich einen wichtigen Arzttermin habe.', isCorrect: true },
      { text: 'Ich komme nicht, weil kein Lust habe.', isCorrect: false },
      { text: 'Morgen kein Kurs für mich, Tschüss.', isCorrect: false },
      { text: 'Warum soll ich morgen überhaupt kommen?', isCorrect: false }
    ],
    explanationDe: 'Eine formelle/halbformelle Entschuldigung beginnt höflich mit "Leider kann ich... weil..." und nennt einen Grund.',
    explanationTr: 'Resmi/yarı-resmi özür e-postasında "Leider kann ich..." (Maalesef gelemiyorum çünkü doktor randevum var) kibar ve gerekçeli kalıptır.',
    examTip: 'Goethe A2 mektup/e-posta yazma bölümünde hitap, mazeret gerekçesi ve nazik kapanış selamı puan kazandırır.',
    points: 6
  },

  // ==========================================
  // GOETHE B1 - ZERTIFIKAT DEUTSCH B1
  // ==========================================
  {
    id: 'b1_g_001',
    level: 'B1',
    section: 'grammatik',
    sectionLabelTr: 'B1 Dilbilgisi (Konjunktiv II - İstek & Tavsiye)',
    topic: 'Konjunktiv II (Höfliche Bitte & Ratschläge)',
    promptDe: 'Ergänzen Sie den Konjunktiv II: "Wenn ich mehr Zeit _______, _______ ich eine Weltreise machen."',
    promptTr: 'Konjunktiv II kuralına göre tamamlayınız: "Daha fazla vaktim olsaydı, bir dünya turuna çıkardım."',
    options: [
      { text: 'hätte ... würde', isCorrect: true },
      { text: 'habe ... werde', isCorrect: false },
      { text: 'hatte ... wollte', isCorrect: false },
      { text: 'hätte ... bin', isCorrect: false }
    ],
    explanationDe: 'Bedingungssätze in der Gegenwart nutzen Konjunktiv II: "Wenn ich hätte... würde ich machen".',
    explanationTr: 'Gerçekleşmesi varsayımsal olan şimdiki zaman dilek cümlelerinde "hätte" (olsaydı) ve "würde + mastar" kullanılır.',
    examTip: 'Goethe B1 Sprachbausteine sınavında "hätte, wäre, würde + Infinitiv" kalıpları düzenli olarak test edilir.',
    points: 7
  },
  {
    id: 'b1_g_002',
    level: 'B1',
    section: 'grammatik',
    sectionLabelTr: 'B1 Dilbilgisi (Edilgen Çatı - Passiv Präsens)',
    topic: 'Passiv mit "werden + Partizip II"',
    promptDe: 'Verwandeln Sie ins Passiv: "Der Mechaniker repariert das Auto."',
    promptTr: 'Cümleyi edilgen (Passiv) çatıya çeviriniz: "Das Auto _______ vom Mechaniker _______."',
    options: [
      { text: 'wird ... repariert', isCorrect: true },
      { text: 'ist ... repariert', isCorrect: false },
      { text: 'wurde ... reparieren', isCorrect: false },
      { text: 'hat ... repariert', isCorrect: false }
    ],
    explanationDe: 'Passiv Präsens wird mit "werden (konjugiert) + Partizip II" gebildet: Das Auto wird repariert.',
    explanationTr: 'Şimdiki zaman edilgen çatı formülü "werden + Partizip II" (3. tekil şahıs: wird ... repariert) şeklindedir.',
    examTip: 'Fail belirtilirken "von + Dativ" (şahıslar/canlılar için) veya "durch + Akkusativ" (araçlar/sebepler için) kullanılır.',
    points: 7
  },
  {
    id: 'b1_g_003',
    level: 'B1',
    section: 'grammatik',
    sectionLabelTr: 'B1 Dilbilgisi (Bağlaçlar: obwohl, trotzdem)',
    topic: 'Konzessive Konnektoren (obwohl vs. trotzdem)',
    promptDe: 'Wählen Sie das richtige Bindewort: "Es regnete in Strömen, _______ machten wir einen langen Spaziergang."',
    promptTr: 'Doğru bağlacı seçiniz: "Bardaktan boşalırcasına yağmur yağıyordu, yine de uzun bir yürüyüş yaptık."',
    options: [
      { text: 'trotzdem', isCorrect: true },
      { text: 'obwohl', isCorrect: false },
      { text: 'weil', isCorrect: false },
      { text: 'deshalb', isCorrect: false }
    ],
    explanationDe: '"Trotzdem" verbindet zwei Hauptsätze und steht auf Position 1 (Verb folgt direkt auf Pos. 2: trotzdem machten wir).',
    explanationTr: '"Trotzdem" (buna rağmen / yine de) ana cümle zarfıdır ve ardından hemen çekimli fiil gelir ("trotzdem machten wir"). "Obwohl" ise fiili sona atardı.',
    examTip: 'Obwohl = yan cümle (fiil sonda), Trotzdem = ana cümle bağlacı (fiil hemen bağlaçtan sonra gelir).',
    points: 7
  },
  {
    id: 'b1_l_001',
    level: 'B1',
    section: 'lesen',
    sectionLabelTr: 'B1 Okuma & Anlama (Görüş & Yorum Analizi)',
    topic: 'Lesen Teil 2 (Meinungen & Argumente)',
    promptDe: 'Lesen Sie den Forumsbeitrag: Welche Haltung hat der Autor zum Thema "Homeoffice"?',
    promptTr: 'Forum yazısını okuyunuz: Yazarın "Homeoffice" (Evden çalışma) konusundaki ana tutumu nedir?',
    contextSnippet: 'Meiner Ansicht nach bietet das Arbeiten von zu Hause aus enorme Flexibilität und spart täglich zwei Stunden Pendelzeit. Allerdings darf man die soziale Isolation und die fehlende Trennung zwischen Beruf und Privatleben nicht unterschätzen. Eine Hybrid-Lösung ist der beste Weg.',
    options: [
      { text: 'Er empfiehlt eine Kombination aus Büro und Homeoffice (Hybrid-Lösung)', isCorrect: true },
      { text: 'Er lehnt Homeoffice vollkommen ab', isCorrect: false },
      { text: 'Er möchte, dass alle Büros für immer schließen', isCorrect: false },
      { text: 'Er findet Pendeln im Berufsverkehr sehr entspannend', isCorrect: false }
    ],
    explanationDe: 'Der Autor nennt Vor- und Nachteile und schließt mit dem Fazit: "Eine Hybrid-Lösung ist der beste Weg."',
    explanationTr: 'Yazar hem avantajları hem dezavantajları sıralamış ve en iyi yolun hibrit çözüm (Hybrid-Lösung) olduğunu vurgulamıştır.',
    examTip: 'B1 okuma metinlerinde sonuç cümlesindeki "Fazit", "daher", "beste Weg" gibi özet ifadelere dikkat ediniz.',
    points: 7
  },
  {
    id: 'b1_h_001',
    level: 'B1',
    section: 'hoeren',
    sectionLabelTr: 'B1 Dinleme Simülasyonu (Radyo Röportajı)',
    topic: 'Hören Teil 3 (Görüş & Detay Analizi)',
    promptDe: 'Hören Sie das Radio-Interview: Warum hat Herr Bergmann seinen Job gekündigt?',
    promptTr: 'Radyo röportajını dinleyiniz: Bay Bergmann işinden neden istifa etti?',
    audioText: 'Moderator: Herr Bergmann, Sie hatten eine gut bezahlte Stelle als Bankkaufmann. Warum haben Sie gekündigt? Bergmann: Das Gehalt war zwar hervorragend, aber die ständige Arbeitsüberlastung hat meiner Gesundheit geschadet. Ich wollte mehr Zeit für meine Familie haben und meiner Leidenschaft als Schreiner nachgehen.',
    options: [
      { text: 'Wegen gesundheitlicher Belastung und Wunsch nach mehr Zeit für die Familie', isCorrect: true },
      { text: 'Weil das Gehalt zu niedrig war', isCorrect: false },
      { text: 'Weil die Bank pleitegegangen ist', isCorrect: false },
      { text: 'Weil er keinen Urlaub bekommen hat', isCorrect: false }
    ],
    explanationDe: 'Herr Bergmann sagt: "Arbeitsüberlastung hat meiner Gesundheit geschadet. Ich wollte mehr Zeit für meine Familie".',
    explanationTr: 'Bergmann maaşın iyi olduğunu fakat aşırı iş yükünün sağlığını bozduğunu ve ailesine vakit ayırmak istediğini belirtmiştir.',
    examTip: 'B1 dinleme testlerinde "zwar ... aber" kalıbında "aber" sonrasındaki kısım asıl sebebi ifade eder.',
    points: 7
  },
  {
    id: 'b1_s_001',
    level: 'B1',
    section: 'sprechen_schreiben',
    sectionLabelTr: 'B1 Konuşma & Sunum (Sunum Yapısı)',
    topic: 'Goethe B1 Sprechen Teil 2 (Präsentation strukturieren)',
    promptDe: 'Welcher Satz eignet sich am besten, um die Gliederung einer B1-Präsentation einzuleiten?',
    promptTr: 'B1 sözlü sınav sunumunun planını (Gliederung) sunarken en uygun açılış cümlesi hangisidir?',
    options: [
      { text: 'Meine Präsentation besteht aus folgenden Teilen: Zuerst spreche ich über...', isCorrect: true },
      { text: 'Ich rede jetzt einfach drauflos ohne Plan.', isCorrect: false },
      { text: 'Ende der Präsentation, vielen Dank fürs Zuhören.', isCorrect: false },
      { text: 'Ihr müsst mir jetzt zuhören!', isCorrect: false }
    ],
    explanationDe: 'Eine strukturierte Präsentation wird mit "Meine Präsentation besteht aus folgenden Teilen: Zuerst..., danach..., zum Schluss..." eingeleitet.',
    explanationTr: 'Goethe B1 sunum kriterlerinde "Zuerst spreche ich über..., danach..., schließlich..." yapısal şablonu tam puan sağlar.',
    examTip: 'Goethe B1 Sprechen Teil 2\'de 5 standart aşama vardır: Konu tanıtımı, kişisel deneyim, kendi ülkesindeki durum, avantaj/dezavantaj, sonuç.',
    points: 7
  }
];

export function getRandomizedSimulationQuestions(config: GoetheSimulationConfig): GoetheQuizQuestion[] {
  let pool = [...GOETHE_QUESTION_BANK];

  if (config.level !== 'ALL') {
    pool = pool.filter(q => q.level === config.level);
  }

  if (config.section !== 'ALL') {
    pool = pool.filter(q => q.section === config.section);
  }

  // Shuffle pool using Fisher-Yates
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Pick required count
  const targetCount = Math.min(config.questionCount, shuffled.length);
  const selected = shuffled.slice(0, targetCount);

  // Also shuffle options for each question to keep test fresh
  return selected.map(q => {
    const shuffledOptions = [...q.options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }
    return {
      ...q,
      options: shuffledOptions
    };
  });
}

export function calculateAssessmentSummary(
  results: QuestionUserResult[],
  totalDurationSeconds: number
): GoetheAssessmentSummary {
  const totalQuestions = results.length;
  const correctAnswersCount = results.filter(r => r.isCorrect).length;
  const emptyAnswersCount = results.filter(r => r.selectedOptionIndex === null).length;
  const wrongAnswersCount = totalQuestions - correctAnswersCount - emptyAnswersCount;

  const totalPointsEarned = results.reduce((acc, r) => acc + (r.isCorrect ? r.question.points : 0), 0);
  const maxPointsPossible = results.reduce((acc, r) => acc + r.question.points, 0);

  const totalScorePercentage = totalQuestions > 0 
    ? Math.round((correctAnswersCount / totalQuestions) * 100) 
    : 0;

  const averageTimePerQuestion = totalQuestions > 0 
    ? Math.round(totalDurationSeconds / totalQuestions) 
    : 0;

  // Grade classification according to Goethe-Institut standards (60% pass threshold)
  let grade: GoetheAssessmentSummary['grade'] = 'NICHT_BESTANDEN';
  let gradeLabelDe = 'Nicht bestanden';
  let gradeLabelTr = 'Geliştirilmeli (Baraj Geçilemedi)';
  let badge = '🔴 Başarısız';
  let passed = false;

  if (totalScorePercentage >= 90) {
    grade = 'SEHR_GUT';
    gradeLabelDe = 'Sehr gut (Mit Auszeichnung)';
    gradeLabelTr = 'Pekiyi / Üstün Başarı (Goethe Sertifika Uyumu: Çok Yüksek)';
    badge = '🌟 Sehr Gut';
    passed = true;
  } else if (totalScorePercentage >= 80) {
    grade = 'GUT';
    gradeLabelDe = 'Gut';
    gradeLabelTr = 'İyi / Başarılı (Goethe Sınavını Rahatlıkla Geçer)';
    badge = '🟢 Gut';
    passed = true;
  } else if (totalScorePercentage >= 60) {
    grade = 'BEFRIEDIGEND';
    gradeLabelDe = 'Befriedigend / Bestanden';
    gradeLabelTr = 'Geçer Not / Yeterli (Goethe %60 Barajı Aşıldı)';
    badge = '🟡 Bestanden';
    passed = true;
  }

  // Level Breakdown
  const levels: GoetheLevel[] = ['A1', 'A2', 'B1'];
  const byLevelBreakdown: GoetheAssessmentSummary['byLevelBreakdown'] = {
    A1: { total: 0, correct: 0, percentage: 0 },
    A2: { total: 0, correct: 0, percentage: 0 },
    B1: { total: 0, correct: 0, percentage: 0 }
  };

  levels.forEach(lvl => {
    const lvlResults = results.filter(r => r.question.level === lvl);
    const lvlTotal = lvlResults.length;
    const lvlCorrect = lvlResults.filter(r => r.isCorrect).length;
    byLevelBreakdown[lvl] = {
      total: lvlTotal,
      correct: lvlCorrect,
      percentage: lvlTotal > 0 ? Math.round((lvlCorrect / lvlTotal) * 100) : 0
    };
  });

  // Section Breakdown
  const sections: GoetheSection[] = ['lesen', 'grammatik', 'hoeren', 'sprechen_schreiben', 'wortschatz'];
  const sectionLabels: Record<GoetheSection, string> = {
    lesen: 'Okuma & Anlama (Lesen)',
    grammatik: 'Dilbilgisi & Yapı (Grammatik)',
    hoeren: 'Dinleme & Ses (Hören)',
    sprechen_schreiben: 'Konuşma & Yazma (Sprechen/Schreiben)',
    wortschatz: 'Kelime Bilgisi (Wortschatz)'
  };

  const bySectionBreakdown: GoetheAssessmentSummary['bySectionBreakdown'] = {
    lesen: { total: 0, correct: 0, percentage: 0, labelTr: sectionLabels.lesen },
    grammatik: { total: 0, correct: 0, percentage: 0, labelTr: sectionLabels.grammatik },
    hoeren: { total: 0, correct: 0, percentage: 0, labelTr: sectionLabels.hoeren },
    sprechen_schreiben: { total: 0, correct: 0, percentage: 0, labelTr: sectionLabels.sprechen_schreiben },
    wortschatz: { total: 0, correct: 0, percentage: 0, labelTr: sectionLabels.wortschatz }
  };

  sections.forEach(sec => {
    const secResults = results.filter(r => r.question.section === sec);
    const secTotal = secResults.length;
    const secCorrect = secResults.filter(r => r.isCorrect).length;
    bySectionBreakdown[sec] = {
      total: secTotal,
      correct: secCorrect,
      percentage: secTotal > 0 ? Math.round((secCorrect / secTotal) * 100) : 0,
      labelTr: sectionLabels[sec]
    };
  });

  // Strengths, Weaknesses and Recommendations
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  if (bySectionBreakdown.grammatik.total > 0 && bySectionBreakdown.grammatik.percentage >= 75) {
    strengths.push('Fiil çekimleri, ayrılabilen fiiller ve artikel/Akkusativ kurallarında yüksek hakimiyet.');
  } else if (bySectionBreakdown.grammatik.total > 0 && bySectionBreakdown.grammatik.percentage < 60) {
    weaknesses.push('Dilbilgisi ve yan cümle (Nebensatz: weil, dass, wenn) sıralamalarında hatalar tespit edildi.');
    recommendations.push('Ders 8 (Wichtige Verben) ve Ders 9 (Edatlar/Sıfatlar) modüllerindeki çekim tablolarını tekrar ediniz.');
  }

  if (bySectionBreakdown.hoeren.total > 0 && bySectionBreakdown.hoeren.percentage >= 75) {
    strengths.push('Sesli anons, fiyat, saat ve telefon dinleme simülasyonlarında doğru algılama oranı.');
  } else if (bySectionBreakdown.hoeren.total > 0 && bySectionBreakdown.hoeren.percentage < 60) {
    weaknesses.push('İstasyon anonsları ve hızlı telaffuz edilen Almanca sayılarda zorlanma.');
    recommendations.push('AI Telaffuz Koçu ve Ders 2 (Sayılar Laboratuvarı) modüllerinde sesli dinleme pratiklerini artırınız.');
  }

  if (bySectionBreakdown.sprechen_schreiben.total > 0 && bySectionBreakdown.sprechen_schreiben.percentage >= 75) {
    strengths.push('Goethe rica ve soru üretme kalıplarını (Können Sie bitte...) doğru uygulama becerisi.');
  } else if (bySectionBreakdown.sprechen_schreiben.total > 0 && bySectionBreakdown.sprechen_schreiben.percentage < 60) {
    weaknesses.push('Goethe Sprechen kartlarında rica ve resmi e-posta şablonlarında eksikler.');
    recommendations.push('Ders 14 (Goethe A1 Sprechen 130 Kalıp) modülünü inceleyerek rica ve yasaklama şablonlarını çalışınız.');
  }

  if (strengths.length === 0) {
    strengths.push('Sınavı baştan sona tamamlayarak Goethe formatı ile güçlü bir deneme tecrübesi edindiniz.');
  }
  if (recommendations.length === 0) {
    recommendations.push('Mükemmel performans! Bir üst seviye (A2/B1) denemeleriyle hızınızı ve kelime dağarcığınızı pekiştirebilirsiniz.');
  }

  const tokenReward = Math.max(20, Math.round((correctAnswersCount * 8) + (passed ? 50 : 10)));
  const xpReward = Math.round(totalScorePercentage * 5 + correctAnswersCount * 15);

  return {
    totalQuestions,
    correctAnswersCount,
    wrongAnswersCount,
    emptyAnswersCount,
    totalScorePercentage,
    totalPointsEarned,
    maxPointsPossible,
    totalDurationSeconds,
    averageTimePerQuestion,
    grade,
    gradeLabelDe,
    gradeLabelTr,
    badge,
    passed,
    byLevelBreakdown,
    bySectionBreakdown,
    strengths,
    weaknesses,
    recommendations,
    tokenReward,
    xpReward
  };
}
