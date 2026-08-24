import json

# Header definition
ts_header = '''export interface LanguageInfo {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  speechLang: string;
  learnerCount: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor' | 'Easy' | 'Medium' | 'Hard';
  description: string;
}

export interface UniversalPhrase {
  id: string;
  category: 'Greetings' | 'Numbers' | 'Dining' | 'Travel' | 'Shopping' | 'Daily' | 'Business' | 'Emergency';
  categoryTitles: Record<string, string>;
  phrases: Record<string, string>;
  phonetics?: Record<string, string>;
  explanations: Record<string, string>;
  distractors: Record<string, string[]>;
}

export interface StandardQuestion {
  id: string;
  category: string;
  categoryName: string;
  nativePromptText: string;
  targetTranslation: string;
  phonetic?: string;
  options: string[];
  explanation: string;
  targetSpeechLang: string;
}

export const supportedLanguages: LanguageInfo[] = [
  {
    id: 'turkish',
    name: 'Türkçe',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    speechLang: 'tr-TR',
    learnerCount: '85M+ Konuşan',
    difficulty: 'Kolay',
    description: 'Anadolu ve Avrasya coğrafyasının köklü ve eklemeli dili.'
  },
  {
    id: 'german',
    name: 'Almanca',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    speechLang: 'de-DE',
    learnerCount: '135M+ Konuşan',
    difficulty: 'Orta',
    description: 'Avrupa Birliği\'nin en çok konuşulan anadili. Goethe standartlarında dil yapısı.'
  },
  {
    id: 'english',
    name: 'İngilizce',
    nativeName: 'English',
    flag: '🇬🇧',
    speechLang: 'en-US',
    learnerCount: '1.5Milyar+ Konuşan',
    difficulty: 'Kolay',
    description: 'Küresel iletişim, iş dünyası ve akademik çalışmaların ortak dili.'
  },
  {
    id: 'spanish',
    name: 'İspanyolca',
    nativeName: 'Español',
    flag: '🇪🇸',
    speechLang: 'es-ES',
    learnerCount: '500M+ Konuşan',
    difficulty: 'Kolay',
    description: 'Dünyanın en popüler 2. anadili. Akıcı ve melodik Akdeniz dili.'
  },
  {
    id: 'french',
    name: 'Fransızca',
    nativeName: 'Français',
    flag: '🇫🇷',
    speechLang: 'fr-FR',
    learnerCount: '300M+ Konuşan',
    difficulty: 'Orta',
    description: 'Diplomasi, sanat, moda ve gastronominin prestijli dünya dili.'
  },
  {
    id: 'italian',
    name: 'İtalyanca',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    speechLang: 'it-IT',
    learnerCount: '85M+ Konuşan',
    difficulty: 'Kolay',
    description: 'Kültür, mimari ve müziğin akıcı Akdeniz dili.'
  },
  {
    id: 'russian',
    name: 'Rusça',
    nativeName: 'Русский',
    flag: '🇷🇺',
    speechLang: 'ru-RU',
    learnerCount: '260M+ Konuşan',
    difficulty: 'Zor',
    description: 'Kiril alfabesi kullanan Avrasya\'nın en büyük coğrafi dili.'
  },
  {
    id: 'japanese',
    name: 'Japonca',
    nativeName: '日本語',
    flag: '🇯🇵',
    speechLang: 'ja-JP',
    learnerCount: '125M+ Konuşan',
    difficulty: 'Zor',
    description: 'Hiragana, Katakana ve zengin kültürüyle Doğu Asya\'nın teknoloji dili.'
  },
  {
    id: 'chinese',
    name: 'Çince (Mandarin)',
    nativeName: '中文',
    flag: '🇨🇳',
    speechLang: 'zh-CN',
    learnerCount: '1.1Milyar+ Konuşan',
    difficulty: 'Zor',
    description: 'Dünyanın en çok anadile sahip dili. Tonlamalı yapısıyla küresel ticaret dili.'
  },
  {
    id: 'arabic',
    name: 'Arapça',
    nativeName: 'العربية',
    flag: '🇸🇦',
    speechLang: 'ar-SA',
    learnerCount: '400M+ Konuşan',
    difficulty: 'Zor',
    description: 'Sağdan sola yazılan, zengin kelime köklerine sahip kadim dünya dili.'
  },
  {
    id: 'korean',
    name: 'Korece',
    nativeName: '한국어',
    flag: '🇰🇷',
    speechLang: 'ko-KR',
    learnerCount: '80M+ Konuşan',
    difficulty: 'Orta',
    description: 'Mükemmel Hangul alfabesiyle K-Pop ve teknoloji dünyasının parlayan dili.'
  }
];

export const uiTranslations: Record<string, Record<string, string>> = {
  turkish: {
    appTitle: "Çok Dilli Çapraz Öğrenme Motoru",
    appSub: "Anadilinizi seçin ve dilediğiniz dili 200 soru ile öğrenin!",
    nativeLangLabel: "1. Bildiğiniz / Konuştuğunuz Dil (Anadiliniz)",
    targetLangLabel: "2. Öğrenmek İstediğiniz Hedef Dil",
    swapBtn: "Dilleri Değiştir",
    practiceTab: "Çapraz Dil Pratiği (200 Soru)",
    matrixTab: "11 Dil Matris Kıyaslama",
    selectCategory: "Soru Kategorisi Seçin",
    questionProgress: "Soru",
    scoreText: "Puan",
    promptInstruction: "Bu cümlenin hedef dildeki karşılığı nedir?",
    listenNative: "Anadilde Dinle",
    listenTarget: "Hedef Dilde Dinle",
    checkAnswer: "Cevabı Kontrol Et",
    nextQuestion: "Sonraki Soruya Geç",
    correctFeedback: "Tebrikler! Doğru Yanıt.",
    wrongFeedback: "Yanlış Yanıt.",
    explanationLabel: "Açıklama",
    phoneticLabel: "Fonetik Okunuş",
    matrixTitle: "11 Dilde Aynı İfade Karşılaştırma Matrisi",
    matrixSub: "İfadenin dünyadaki tüm desteklenen 11 dildeki karşılığını aynı anda görün ve her birinin anadil seslendirmesini dinleyin.",
    selectedSentence: "İncelediğiniz Cümle",
    allCategories: "Tüm Kategoriler (200 Soru)",
    catGreetings: "👋 Selamlaşma & Tanışma",
    catNumbers: "🔢 Sayılar & Zaman",
    catDining: "☕ Restoran & Sipariş",
    catTravel: "✈️ Seyahat & Yol Sorma",
    catShopping: "🛍️ Alışveriş & Günlük Yaşam",
    catDaily: "🏡 Günlük Yaşam & Ev",
    catBusiness: "💼 İş & Kariyer",
    catEmergency: "🚨 Acil Durum & Sağlık"
  },
  english: {
    appTitle: "Universal Cross-Language Learning Engine",
    appSub: "Select your native language and learn any target language with 200 questions!",
    nativeLangLabel: "1. Your Native / Spoken Language",
    targetLangLabel: "2. Target Language You Want to Learn",
    swapBtn: "Swap Languages",
    practiceTab: "Cross-Language Practice (200 Questions)",
    matrixTab: "11 Language Matrix Comparison",
    selectCategory: "Select Question Category",
    questionProgress: "Question",
    scoreText: "Score",
    promptInstruction: "What is the equivalent of this phrase in the target language?",
    listenNative: "Listen in Native",
    listenTarget: "Listen in Target",
    checkAnswer: "Check Answer",
    nextQuestion: "Next Question",
    correctFeedback: "Congratulations! Correct Answer.",
    wrongFeedback: "Incorrect Answer.",
    explanationLabel: "Explanation",
    phoneticLabel: "Phonetic Pronunciation",
    matrixTitle: "11 Language Phrase Comparison Matrix",
    matrixSub: "See how this phrase is expressed in all 11 supported languages simultaneously and listen to native audio.",
    selectedSentence: "Selected Phrase",
    allCategories: "All Categories (200 Questions)",
    catGreetings: "👋 Greetings & Introductions",
    catNumbers: "🔢 Numbers & Time",
    catDining: "☕ Dining & Ordering",
    catTravel: "✈️ Travel & Directions",
    catShopping: "🛍️ Shopping & Daily Life",
    catDaily: "🏡 Daily Life & Home",
    catBusiness: "💼 Business & Work",
    catEmergency: "🚨 Emergency & Health"
  },
  german: {
    appTitle: "Universelle Mehrsprachige Lernplattform",
    appSub: "Wählen Sie Ihre Muttersprache und lernen Sie jede Zielsprache mit 200 Fragen!",
    nativeLangLabel: "1. Ihre Muttersprache / Gesprochene Sprache",
    targetLangLabel: "2. Zielsprache, die Sie lernen möchten",
    swapBtn: "Sprachen tauschen",
    practiceTab: "Sprachpraxis (200 Fragen)",
    matrixTab: "11-Sprachen-Matrix",
    selectCategory: "Kategorie auswählen",
    questionProgress: "Frage",
    scoreText: "Punkte",
    promptInstruction: "Was ist das Äquivalent dieses Satzes in der Zielsprache?",
    listenNative: "In Muttersprache anhören",
    listenTarget: "In Zielsprache anhören",
    checkAnswer: "Antwort überprüfen",
    nextQuestion: "Nächste Frage",
    correctFeedback: "Glückwunsch! Richtige Antwort.",
    wrongFeedback: "Falsche Antwort.",
    explanationLabel: "Erklärung",
    phoneticLabel: "Lautschrift / Aussprache",
    matrixTitle: "Phrasenvergleich in 11 Sprachen",
    matrixSub: "Sehen Sie diesen Satz gleichzeitig in allen 11 unterstützen Sprachen.",
    selectedSentence: "Ausgewählter Satz",
    allCategories: "Alle Kategorien (200 Fragen)",
    catGreetings: "👋 Begrüßung & Kennenlernen",
    catNumbers: "🔢 Zahlen & Zeit",
    catDining: "☕ Restaurant & Bestellung",
    catTravel: "✈️ Reise & Wegbeschreibung",
    catShopping: "🛍️ Alltag & Einkaufen",
    catDaily: "🏡 Alltag & Zuhause",
    catBusiness: "💼 Business & Arbeit",
    catEmergency: "🚨 Notfall & Gesundheit"
  },
  chinese: {
    appTitle: "通用跨语言学习引擎",
    appSub: "选择您的母语，通过 200 道精选练习题掌握任何目标语言！",
    nativeLangLabel: "1. 您的母语/熟练语言",
    targetLangLabel: "2. 您想学习的目标语言",
    swapBtn: "切换语言",
    practiceTab: "跨语言练习 (200 题)",
    matrixTab: "11种语言对比矩阵",
    selectCategory: "选择题目分类",
    questionProgress: "题目",
    scoreText: "得分",
    promptInstruction: "这句话在目标语言中怎么说？",
    listenNative: "母语朗读",
    listenTarget: "目标语言朗读",
    checkAnswer: "检查答案",
    nextQuestion: "下一题",
    correctFeedback: "恭喜！回答正确。",
    wrongFeedback: "回答错误。",
    explanationLabel: "解析",
    phoneticLabel: "拼音/发音",
    matrixTitle: "11种语言表达对比矩阵",
    matrixSub: "同时查看该短语在11种语言中的表达并听真人发音。",
    selectedSentence: "已选句子",
    allCategories: "全部分类 (200 题)",
    catGreetings: "👋 问候与自我介绍",
    catNumbers: "🔢 数字与时间",
    catDining: "☕ 餐厅与点餐",
    catTravel: "✈️ 旅游与指路",
    catShopping: "🛍️ 日常生活与购物",
    catDaily: "🏡 日常生活与居家",
    catBusiness: "💼 商务与工作",
    catEmergency: "🚨 紧急与健康"
  },
  spanish: {
    appTitle: "Motor Universal de Aprendizaje Multilingüe",
    appSub: "¡Elige tu idioma materno y domina cualquier idioma con 200 preguntas!",
    nativeLangLabel: "1. Tu idioma materno / nativo",
    targetLangLabel: "2. Idioma de destino que deseas aprender",
    swapBtn: "Cambiar idiomas",
    practiceTab: "Práctica de idiomas (200 Preguntas)",
    matrixTab: "Matriz de 11 idiomas",
    selectCategory: "Seleccionar categoría",
    questionProgress: "Pregunta",
    scoreText: "Puntuación",
    promptInstruction: "¿Cuál es el equivalente de esta frase en el idioma de destino?",
    listenNative: "Escuchar en nativo",
    listenTarget: "Escuchar en destino",
    checkAnswer: "Comprobar respuesta",
    nextQuestion: "Siguiente pregunta",
    correctFeedback: "¡Felicitaciones! Respuesta correcta.",
    wrongFeedback: "Respuesta incorrecta.",
    explanationLabel: "Explicación",
    phoneticLabel: "Pronunciación fonética",
    matrixTitle: "Matriz de comparación en 11 idiomas",
    matrixSub: "Consulta cómo se dice esta frase en los 11 idiomas simultáneamente.",
    selectedSentence: "Frase seleccionada",
    allCategories: "Todas las categorías (200 Preguntas)",
    catGreetings: "👋 Saludos y Presentaciones",
    catNumbers: "🔢 Números y Tiempo",
    catDining: "☕ Restaurante y Pedidos",
    catTravel: "✈️ Viajes y Direcciones",
    catShopping: "🛍️ Vida Diaria y Compras",
    catDaily: "🏡 Vida Diaria y Hogar",
    catBusiness: "💼 Negocios y Trabajo",
    catEmergency: "🚨 Emergencia y Salud"
  },
  french: {
    appTitle: "Moteur d'apprentissage multilingue universel",
    appSub: "Choisissez votre langue maternelle et maîtrisez la langue cible avec 200 questions !",
    nativeLangLabel: "1. Votre langue maternelle",
    targetLangLabel: "2. Langue cible que vous souhaitez apprendre",
    swapBtn: "Échanger les langues",
    practiceTab: "Pratique des langues (200 Questions)",
    matrixTab: "Matrice de 11 langues",
    selectCategory: "Sélectionner une catégorie",
    questionProgress: "Question",
    scoreText: "Score",
    promptInstruction: "Quel est l'équivalent de cette phrase dans la langue cible ?",
    listenNative: "Écouter en langue maternelle",
    listenTarget: "Écouter en langue cible",
    checkAnswer: "Vérifier la réponse",
    nextQuestion: "Question suivante",
    correctFeedback: "Félicitations ! Bonne réponse.",
    wrongFeedback: "Mauvaise réponse.",
    explanationLabel: "Explication",
    phoneticLabel: "Prononciation phonétique",
    matrixTitle: "Matrice de comparaison en 11 langues",
    matrixSub: "Découvrez cette phrase simultanément dans les 11 langues disponibles.",
    selectedSentence: "Phrase sélectionnée",
    allCategories: "Toutes les catégories (200 Questions)",
    catGreetings: "👋 Salutations et Présentations",
    catNumbers: "🔢 Nombres et Temps",
    catDining: "☕ Restaurant et Commande",
    catTravel: "✈️ Voyage et Directions",
    catShopping: "🛍️ Vie Quotidienne et Achats",
    catDaily: "🏡 Vie Quotidienne et Maison",
    catBusiness: "💼 Affaires et Travail",
    catEmergency: "🚨 Urgence et Santé"
  },
  italian: {
    appTitle: "Motore di Apprendimento Multilingue Universale",
    appSub: "Scegli la tua lingua madre e impara qualsiasi lingua con 200 domande!",
    nativeLangLabel: "1. La tua lingua madre",
    targetLangLabel: "2. Lingua di destinazione che vuoi imparare",
    swapBtn: "Inverti lingue",
    practiceTab: "Pratica multilingue (200 Domande)",
    matrixTab: "Matrice a 11 lingue",
    selectCategory: "Seleziona categoria",
    questionProgress: "Domanda",
    scoreText: "Punteggio",
    promptInstruction: "Qual è l'equivalente di questa frase nella lingua di destinazione?",
    listenNative: "Ascolta in madrelingua",
    listenTarget: "Ascolta in destinazione",
    checkAnswer: "Verifica risposta",
    nextQuestion: "Prossima domanda",
    correctFeedback: "Congratulazioni! Risposta corretta.",
    wrongFeedback: "Risposta errata.",
    explanationLabel: "Spiegazione",
    phoneticLabel: "Pronuncia fonetica",
    matrixTitle: "Matrice di confronto in 11 lingue",
    matrixSub: "Vedi come si dice questa frase in tutte e 11 le lingue contemporaneamente.",
    selectedSentence: "Frase selezionata",
    allCategories: "Tutte le categorie (200 Domande)",
    catGreetings: "👋 Saluti e Presentazioni",
    catNumbers: "🔢 Numeri e Tempo",
    catDining: "☕ Ristorante e Ordinazioni",
    catTravel: "✈️ Viaggi e Indicazioni",
    catShopping: "🛍️ Vita Quotidiana e Acquisti",
    catDaily: "🏡 Vita Quotidiana e Casa",
    catBusiness: "💼 Affari e Lavoro",
    catEmergency: "🚨 Emergenza e Salute"
  },
  russian: {
    appTitle: "Универсальный мультиязычный обучающий движок",
    appSub: "Выберите свой родной язык и освойте любой язык с помощью 200 вопросов!",
    nativeLangLabel: "1. Ваш родной язык",
    targetLangLabel: "2. Изучаемый язык",
    swapBtn: "Поменять языки",
    practiceTab: "Практика (200 вопросов)",
    matrixTab: "Матрица 11 языков",
    selectCategory: "Выберите категорию",
    questionProgress: "Вопрос",
    scoreText: "Очки",
    promptInstruction: "Как эта фраза переводится на изучаемый язык?",
    listenNative: "Слушать на родном",
    listenTarget: "Слушать на изучаемом",
    checkAnswer: "Проверить ответ",
    nextQuestion: "Следующий вопрос",
    correctFeedback: "Поздравляем! Правильный ответ.",
    wrongFeedback: "Неправильный ответ.",
    explanationLabel: "Пояснение",
    phoneticLabel: "Фонетика / Произношение",
    matrixTitle: "Сравнительная матрица на 11 языках",
    matrixSub: "Сравните перевод этой фразы сразу на 11 языках с озвучкой.",
    selectedSentence: "Выбранная фраза",
    allCategories: "Все категории (200 вопросов)",
    catGreetings: "👋 Приветствие и Знакомство",
    catNumbers: "🔢 Числа и Время",
    catDining: "☕ Ресторан и Заказ",
    catTravel: "✈️ Путешествия и Направление",
    catShopping: "🛍️ Повседневность и Покупки",
    catDaily: "🏡 Повседневная жизнь и Дом",
    catBusiness: "💼 Бизнес и Работа",
    catEmergency: "🚨 Чрезвычайные ситуации и Здоровье"
  },
  japanese: {
    appTitle: "多言語相互学習エンジン",
    appSub: "母国語を選択し、全200問の豊富な問題で外国語をマスターしましょう！",
    nativeLangLabel: "1. あなたの母国語・使用言語",
    targetLangLabel: "2. 学びたい目標言語",
    swapBtn: "言語を入れ替える",
    practiceTab: "クロス言語練習 (200問)",
    matrixTab: "11言語比較マトリックス",
    selectCategory: "カテゴリを選択",
    questionProgress: "問題",
    scoreText: "スコア",
    promptInstruction: "目標言語でこのフレーズはどう表現しますか？",
    listenNative: "母国語で聴く",
    listenTarget: "目標言語で聴く",
    checkAnswer: "回答を確認",
    nextQuestion: "次の問題へ",
    correctFeedback: "おめでとうございます！正解です。",
    wrongFeedback: "不正解です。",
    explanationLabel: "解説",
    phoneticLabel: "発音・読み方",
    matrixTitle: "11言語表現比較マトリックス",
    matrixSub: "このフレーズが世界の11言語でどう表現されるか同時に確認できます。",
    selectedSentence: "選択中のフレーズ",
    allCategories: "すべてのカテゴリ (200問)",
    catGreetings: "👋 挨拶と自己紹介",
    catNumbers: "🔢 数字と時間",
    catDining: "☕ レストランと注文",
    catTravel: "✈️ 旅行と道案内",
    catShopping: "🛍️ 日常生活と買い物",
    catDaily: "🏡 日常生活と家庭",
    catBusiness: "💼 ビジネスと仕事",
    catEmergency: "🚨 緊急事態と健康"
  },
  arabic: {
    appTitle: "محرك التعلم العالمي متعدد اللغات",
    appSub: "اختر لغتك الأم وأتقن أي لغة أجنبية من خلال 200 سؤال!",
    nativeLangLabel: "1. لغتك الأم / التي تتحدث بها",
    targetLangLabel: "2. اللغة الهدف التي تريد تعلمها",
    swapBtn: "تبديل اللغات",
    practiceTab: "ممارسة اللغات (200 سؤال)",
    matrixTab: "مصفوفة الـ 11 لغة",
    selectCategory: "اختر التصنيف",
    questionProgress: "السؤال",
    scoreText: "النقاط",
    promptInstruction: "ما هو المقابل لهذه العبارة باللغة الهدف؟",
    listenNative: "استمع باللغة الأم",
    listenTarget: "استمع باللغة الهدف",
    checkAnswer: "تحقق من الإجابة",
    nextQuestion: "السؤال التالي",
    correctFeedback: "تهانينا! إجابة صحيحة.",
    wrongFeedback: "إجابة خاطئة.",
    explanationLabel: "الشرح",
    phoneticLabel: "النطق الفونيتي",
    matrixTitle: "مصفوفة مقارنة العبارات بـ 11 لغة",
    matrixSub: "شاهد كيف تقال هذه العبارة بجميع اللغات الـ 11 في وقت واحد مع الاستماع.",
    selectedSentence: "العبارة المحددة",
    allCategories: "جميع التصنيفات (200 سؤال)",
    catGreetings: "👋 التحيات والتعارف",
    catNumbers: "🔢 الأرقام والوقت",
    catDining: "☕ المطعم والطلبات",
    catTravel: "✈️ السفر والاتجاهات",
    catShopping: "🛍️ الحياة اليومية والتسوق",
    catDaily: "🏡 الحياة اليومية والمنزل",
    catBusiness: "💼 الأعمال والعمل",
    catEmergency: "🚨 الطوارئ والصحة"
  },
  korean: {
    appTitle: "다국어 상호 학습 엔진",
    appSub: "모국어를 선택하고 200개의 풍부한 문제로 외국어를 정복하세요!",
    nativeLangLabel: "1. 나의 모국어 / 사용 언어",
    targetLangLabel: "2. 배우고 싶은 학습 목표 언어",
    swapBtn: "언어 맞바꾸기",
    practiceTab: "크로스 언어 연습 (200문항)",
    matrixTab: "11개 언어 비교 매트릭스",
    selectCategory: "카테고리 선택",
    questionProgress: "문제",
    scoreText: "점수",
    promptInstruction: "목표 언어로 이 문장은 어떻게 표현하나요?",
    listenNative: "모국어로 듣기",
    listenTarget: "목표 언어로 듣기",
    checkAnswer: "정답 확인",
    nextQuestion: "다음 문제로",
    correctFeedback: "축하합니다! 정답입니다.",
    wrongFeedback: "오답입니다.",
    explanationLabel: "설명",
    phoneticLabel: "발음 / 음성",
    matrixTitle: "11개 언어 표현 비교 매트릭스",
    matrixSub: "이 문장이 11개 언어로 어떻게 표현되는지 동시에 확인하고 들어보세요.",
    selectedSentence: "선택된 문장",
    allCategories: "전체 카테고리 (200문항)",
    catGreetings: "👋 인사와 소개",
    catNumbers: "🔢 숫자와 시간",
    catDining: "☕ 식당과 주문",
    catTravel: "✈️ 여행과 길 묻기",
    catShopping: "🛍️ 일상생활과 쇼핑",
    catDaily: "🏡 일상생활과 가정",
    catBusiness: "💼 비즈니스와 업무",
    catEmergency: "🚨 긴급상황과 건강"
  }
};
'''

# Category Titles Map
cat_titles = {
    "Greetings": {
        "turkish": "Selamlaşma & Tanışma", "german": "Begrüßung & Kennenlernen", "english": "Greetings & Introductions",
        "spanish": "Saludos y Presentaciones", "french": "Salutations et Présentations", "italian": "Saluti e Presentazioni",
        "russian": "Приветствие и Знакомство", "japanese": "挨拶と自己紹介", "chinese": "问候与自我介绍",
        "arabic": "التحيات والتعارف", "korean": "인사와 소개"
    },
    "Numbers": {
        "turkish": "Sayılar & Zaman", "german": "Zahlen & Zeit", "english": "Numbers & Time",
        "spanish": "Números y Tiempo", "french": "Nombres et Temps", "italian": "Numeri e Tempo",
        "russian": "Числа и Время", "japanese": "数字と時間", "chinese": "数字与时间",
        "arabic": "الأرقام والوقت", "korean": "숫자와 시간"
    },
    "Dining": {
        "turkish": "Restoran & Sipariş", "german": "Restaurant & Bestellung", "english": "Dining & Ordering",
        "spanish": "Restaurante y Pedidos", "french": "Restaurant et Commande", "italian": "Ristorante e Ordinazioni",
        "russian": "Ресторан и Заказ", "japanese": "レストランと注文", "chinese": "餐厅与点餐",
        "arabic": "المطعم والطلبات", "korean": "식당과 주문"
    },
    "Travel": {
        "turkish": "Seyahat & Yol Sorma", "german": "Reise & Wegbeschreibung", "english": "Travel & Directions",
        "spanish": "Viajes y Direcciones", "french": "Voyage et Directions", "italian": "Viaggi e Indicazioni",
        "russian": "Путешествия и Направление", "japanese": "旅行と道案内", "chinese": "旅游与指路",
        "arabic": "السفر والاتجاهات", "korean": "여행과 길 묻기"
    },
    "Shopping": {
        "turkish": "Alışveriş & Günlük Yaşam", "german": "Alltag & Einkaufen", "english": "Shopping & Daily Life",
        "spanish": "Vida Diaria y Compras", "french": "Vie Quotidienne et Achats", "italian": "Vita Quotidiana e Acquisti",
        "russian": "Повседневность и Покупки", "japanese": "日常生活と買い物", "chinese": "日常生活与购物",
        "arabic": "الحياة اليومية والتسوق", "korean": "일상생활과 쇼핑"
    },
    "Daily": {
        "turkish": "Günlük Yaşam & Ev", "german": "Alltag & Zuhause", "english": "Daily Life & Home",
        "spanish": "Vida Diaria y Hogar", "french": "Vie Quotidienne et Maison", "italian": "Vita Quotidiana e Casa",
        "russian": "Повседневная жизнь и Дом", "japanese": "日常生活と家庭", "chinese": "日常生活与居家",
        "arabic": "الحياة اليومية والمنزل", "korean": "일상생활과 가정"
    },
    "Business": {
        "turkish": "İş & Kariyer", "german": "Business & Arbeit", "english": "Business & Work",
        "spanish": "Negocios y Trabajo", "french": "Affaires et Travail", "italian": "Affari e Lavoro",
        "russian": "Бизнес и Работа", "japanese": "ビジネスと仕事", "chinese": "商务与工作",
        "arabic": "الأعمال والعمل", "korean": "비즈니스와 업무"
    },
    "Emergency": {
        "turkish": "Acil Durum & Sağlık", "german": "Notfall & Gesundheit", "english": "Emergency & Health",
        "spanish": "Emergencia y Salud", "french": "Urgence et Santé", "italian": "Emergenza e Salute",
        "russian": "Чрезвычайные ситуации и Здоровье", "japanese": "緊急事態と健康", "chinese": "紧急与健康",
        "arabic": "الطوارئ والصحة", "korean": "긴급상황과 건강"
    }
}

# Distractors per language template
distractor_templates = {
    "german": [
        ["Entschuldigung!", "Gute Nacht!", "Bis später!"],
        ["Ich bin müde", "Ich wohne hier", "Ich habe Hunger"],
        ["Tschüss!", "Danke!", "Bitte!"],
        ["Wo ist der Bahnhof?", "Wie viel kostet das?", "Wie geht es Ihnen?"],
        ["Die Rechnung, bitte", "Ich habe Hunger", "Ein Wasser, bitte"],
        ["Guten Appetit!", "Es schmeckt sehr gut!", "Wo ist die Küche?"]
    ],
    "english": [
        ["Excuse me!", "Good night!", "See you later!"],
        ["I am tired", "I live here", "I am hungry"],
        ["Goodbye!", "Thank you!", "You are welcome!"],
        ["Where is the station?", "How much is this?", "How are you?"],
        ["The bill, please", "I am hungry", "Water, please"],
        ["Enjoy your meal!", "It tastes delicious!", "Where is the kitchen?"]
    ],
    "turkish": [
        ["Özür dilerim!", "İyi geceler!", "Sonra görüşürüz!"],
        ["Yorgunum", "Burada yaşıyorum", "Yemek yemek istiyorum"],
        ["Görüşmek üzere!", "Teşekkürler!", "Lütfen!"],
        ["İstasyon nerede?", "Bu ne kadar?", "Nasılsınız?"],
        ["Hesap lütfen", "Açım", "Su lütfen"],
        ["Afiyet olsun!", "Çok lezzetli!", "Mutfak nerede?"]
    ],
    "spanish": [
        ["¡Perdón!", "¡Buenas noches!", "¡Hasta luego!"],
        ["Tengo cansancio", "Vivo aquí", "Tengo hambre"],
        ["¡Adiós!", "¡Gracias!", "¡De nada!"],
        ["¿Dónde está la estación?", "¿Cuánto cuesta?", "¿Cómo estás?"],
        ["La cuenta, por favor", "Tengo hambre", "Un agua, por favor"],
        ["¡Buen provecho!", "¡Está delicioso!", "¿Dónde está la cocina?"]
    ],
    "french": [
        ["Pardon !", "Bonne nuit !", "À plus tard !"],
        ["Je suis fatigué", "J'habite ici", "J'ai faim"],
        ["Au revoir !", "Merci !", "De rien !"],
        ["Où est la gare ?", "Combien ça coûte ?", "Comment allez-vous ?"],
        ["L'addition, s'il vous plaît", "J'ai faim", "De l'eau, s'il vous plaît"],
        ["Bon appétit !", "C'est délicieux !", "Où est la cuisine ?"]
    ],
    "italian": [
        ["Scusa!", "Buona notte!", "A dopo!"],
        ["Sono stanco", "Abito qui", "Ho fame"],
        ["Arrivederci!", "Grazie!", "Prego!"],
        ["Dov'è la stazione?", "Quanto costa?", "Come stai?"],
        ["Il conto, per favore", "Ho fame", "Un'acqua, per favore"],
        ["Buon appetito!", "È delizioso!", "Dov'è la cucina?"]
    ],
    "russian": [
        ["Извините!", "Спокойной ночи!", "До скорого!"],
        ["Я устал", "Я живу здесь", "Я хочу есть"],
        ["До свидания!", "Спасибо!", "Пожалуйста!"],
        ["Где вокзал?", "Сколько это стоит?", "Как дела?"],
        ["Счет, пожалуйста", "Я хочу есть", "Воду, пожалуйста"],
        ["Приятного аппетита!", "Это очень вкусно!", "Где кухня?"]
    ],
    "japanese": [
        ["すみません！", "おやすみなさい", "またね"],
        ["お腹が空きました", "ここに住んでいます", "疲れています"],
        ["さようなら！", "ありがとう！", "どういたしまして"],
        ["駅はどこですか？", "いくらですか？", "お元気ですか？"],
        ["お会計をお願いします", "お腹が空いた", "お水をください"],
        ["いただきます！", "美味しいです！", "厨房はどこですか？"]
    ],
    "chinese": [
        ["对不起！", "晚安！", "等会儿见！"],
        ["我累了", "我住在这里", "我饿了"],
        ["再见！", "谢谢！", "不客气"],
        ["车站在哪里？", "这个多少钱？", "你好吗？"],
        ["请结账", "我饿了", "请给我水"],
        ["祝你好胃口！", "很好吃！", "厨房在哪里？"]
    ],
    "arabic": [
        ["عفواً!", "تصبح على خير!", "إلى اللقاء!"],
        ["أنا تعبان", "أسكن هنا", "أنا جائع"],
        ["مع السلامة", "شكراً", "عفواً"],
        ["أين المحطة؟", "بكم هذا؟", "كيف حالك؟"],
        ["الحساب من فضلك", "أنا جائع", "ماء من فضلك"],
        ["شهية طيبة!", "هذا لديد جداً!", "أين المطبخ؟"]
    ],
    "korean": [
        ["죄송합니다!", "안녕히 주무세요", "나중에 봐요"],
        ["피곤해요", "여기 살아요", "배가 고파요"],
        ["안녕히 계세요!", "감사합니다!", "천만에요"],
        ["역이 어디예요?", "이거 얼마예요?", "잘 지내셨어요?"],
        ["계산서 주세요", "배고파요", "물 주세요"],
        ["맛있게 드세요!", "맛있어요!", "주방이 어디예요?"]
    ]
}

# Helper to build a phrase object
def make_phrase(p_id, cat, tr, de, en, es, fr, it, ru, ja, zh, ar, ko,
                ph_de="", ph_en="", ph_ja="", ph_zh="", ph_ar="", ph_ko="",
                expl_tr="", expl_en=""):
    
    if not expl_tr:
        expl_tr = f"'{tr}' cümlesi günlük yaşamda sık kullanılan temel bir ifadedir."
    if not expl_en:
        expl_en = f"The phrase '{en}' is a standard everyday expression."

    explanations = {
        "turkish": expl_tr, "german": f"Der Ausdruck '{de}' ist eine wichtige Redewendung.",
        "english": expl_en, "spanish": f"La frase '{es}' es una expresión cotidiana.",
        "french": f"L'expression '{fr}' est très courante au quotidien.",
        "italian": f"La frase '{it}' è una frase comune nella vita quotidiana.",
        "russian": f"Фраза '{ru}' — стандартное повседневное выражение.",
        "japanese": f"「{ja}」は日常会話でよく使われる表現です。",
        "chinese": f"“{zh}”是日常生活中常用的表达方式。",
        "arabic": f"عبارة '{ar}' هي عبارة يومية شائعة.",
        "korean": f"'{ko}'(은)는 일상에서 자주 쓰이는 표현입니다."
    }

    phrases = {
        "turkish": tr, "german": de, "english": en, "spanish": es,
        "french": fr, "italian": it, "russian": ru, "japanese": ja,
        "chinese": zh, "arabic": ar, "korean": ko
    }

    phonetics = {}
    if ph_de: phonetics["german"] = ph_de
    if ph_en: phonetics["english"] = ph_en
    if ph_ja: phonetics["japanese"] = ph_ja
    if ph_zh: phonetics["chinese"] = ph_zh
    if ph_ar: phonetics["arabic"] = ph_ar
    if ph_ko: phonetics["korean"] = ph_ko

    # Choose distractors deterministically based on hash of ID
    distractor_idx = hash(p_id) % len(distractor_templates["english"])
    distractors = {}
    for lang in distractor_templates:
        distractors[lang] = distractor_templates[lang][distractor_idx]

    return {
        "id": p_id,
        "category": cat,
        "categoryTitles": cat_titles[cat],
        "phrases": phrases,
        "phonetics": phonetics,
        "explanations": explanations,
        "distractors": distractors
    }

print('Make phrase helper ready')
