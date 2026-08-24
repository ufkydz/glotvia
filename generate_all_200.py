import json

from build_full_dataset_file import ts_header, make_phrase, cat_titles

phrases_list = []

# Helper to easily register a phrase
def add_p(p_id, cat, tr, de, en, es, fr, it, ru, ja, zh, ar, ko,
          ph_de="", ph_en="", ph_ja="", ph_zh="", ph_ar="", ph_ko="",
          expl_tr="", expl_en=""):
    p = make_phrase(p_id, cat, tr, de, en, es, fr, it, ru, ja, zh, ar, ko,
                    ph_de, ph_en, ph_ja, ph_zh, ph_ar, ph_ko, expl_tr, expl_en)
    phrases_list.append(p)

# 1. GREETINGS (25 items)
add_p("greetings-1", "Greetings", "Merhaba!", "Hallo!", "Hello!", "¡Hola!", "Bonjour !", "Ciao!", "Здравствуйте!", "こんにちは (Konnichiwa)", "你好 (Nǐ hǎo)", "مرحبا (Marhaban)", "안녕하세요 (Annyeonghaseyo)", "Halo", "Helou", "Konniciwa", "Ni hao", "Marhaban", "Annyonghaseyo")
add_p("greetings-2", "Greetings", "Günaydın!", "Guten Morgen!", "Good morning!", "¡Buenos días!", "Bonjour !", "Buongiorno!", "Доброе утро!", "おはようございます (Ohayō gozaimasu)", "早上好 (Zǎoshang hǎo)", "صباح الخير (Sabah al-khayr)", "좋은 아침입니다 (Joheun achimimnida)", "Guten morgen", "Gud morning", "Ohayo gozaymasu", "Zaosang hao", "Sabah al hayr", "Johun acimimnida")
add_p("greetings-3", "Greetings", "İyi akşamlar!", "Guten Abend!", "Good evening!", "¡Buenas noches!", "Bonsoir !", "Buonasera!", "Добрый вечер!", "こんばんは (Konbanwa)", "晚上好 (Wǎnshang hǎo)", "مساء الخير (Masa' al-khayr)", "좋은 저녁입니다 (Joheun jeonyeogimnida)", "Guten abend", "Gud ivning", "Konbanva", "Vansang hao", "Masa al hayr", "Johun jonyogimnida")
add_p("greetings-4", "Greetings", "İyi geceler!", "Gute Nacht!", "Good night!", "¡Buenas noches!", "Bonne nuit !", "Buona notte!", "Спокойной ночи!", "おやすみなさい (Oyasuminasai)", "晚安 (Wǎn'ān)", "تصبح على خير (Tusbih 'ala khayr)", "안녕히 주무세요 (Annyeonghi jumuseyo)", "Gute naht", "Gud nayt", "Oyasuminasai", "Vanan", "Tusbih ala hayr", "Annyonghi jumuseyo")
add_p("greetings-5", "Greetings", "Hoşça kal!", "Auf Wiedersehen!", "Goodbye!", "¡Hasta luego!", "Au revoir !", "Arrivederci!", "До свидания!", "さようなら (Sayōnara)", "再见 (Zàijiàn)", "مع السلامة (Ma'a as-salama)", "안녕히 계세요 (Annyeonghi gyeseyo)", "Auf viderzeyen", "Gud bay", "Sayonara", "Caijiyen", "Maas selame", "Annyonghi gyeseyo")
add_p("greetings-6", "Greetings", "Nasılsınız?", "Wie geht es Ihnen?", "How are you?", "¿Cómo está usted?", "Comment allez-vous ?", "Come sta?", "Как ваши дела?", "お元気ですか？ (Ogenki desu ka?)", "你好吗？ (Nǐ hǎo ma?)", "كيف حالك؟ (Kayfa haluk?)", "어떻게 지내세요? (Eotteohke jinaeseyo?)", "Vi get es inen", "Hav ar yu", "Ogenki des ka", "Ni hao ma", "Keyfe haluk", "Ottohke jineseyo")
add_p("greetings-7", "Greetings", "İyiyim, teşekkür ederim.", "Mir geht es gut, danke.", "I am fine, thank you.", "Estoy bien, gracias.", "Je vais bien, merci.", "Sto bene, grazie.", "Я в порядке, спасибо.", "元気です、ありがとう (Genki desu, arigatō)", "我很好，谢谢 (Wǒ hěn hǎo, xièxie)", "أنا بخير، شكراً (Ana bikhayr, shukran)", "잘 지내요, 감사합니다 (Jal jinaeyo, gamsahamnida)", "Mir get es gut danke", "Ay em fayn tenk yu", "Genki des arigato", "Vo hen hao xie xie", "Ana bihayr sukran", "Cal jineyo kamsahamnida")
add_p("greetings-8", "Greetings", "Adınız nedir?", "Wie heißen Sie?", "What is your name?", "¿Cómo se llama?", "Comment vous appelez-vous ?", "Come si chiama?", "Как вас зовут?", "お名前は何ですか？ (Onamae wa nan desu ka?)", "您叫什么名字？ (Nín jiào shénme míngzi?)", "ما اسمك؟ (Ma ismuk?)", "이름이 무엇인가요? (Ireumi mueosingayo?)", "Vi haysen zi", "Vat iz yor neym", "Onamae va nan des ka", "Nin ciao semme minzi", "Ma ismuk", "Ireumi mueosingayo")
add_p("greetings-9", "Greetings", "Benim adım...", "Ich heiße...", "My name is...", "Me llamo...", "Je m'appelle...", "Mi chiamo...", "Меня зовут...", "私の名前は...です (Watashi no namae wa... desu)", "我的名字是... (Wǒ de míngzi shì...)", "اسمي... (Ismi...)", "제 이름은 ...입니다 (Je ireumeun... imnida)", "İh hayse", "May neym iz", "Vatasi no namae va", "Vo de minzi si", "İsmi", "Ce iremun imnida")
add_p("greetings-10", "Greetings", "Tanıştığımıza memnun oldum.", "Schön, Sie kennenzulernen.", "Nice to meet you.", "Encantado de conocerle.", "Ravi de vous rencontrer.", "Piacere di conoscerla.", "Приятно познакомиться.", "はじめまして (Hajimemashite)", "很高兴认识你 (Hěn gāoxìng rènshi nǐ)", "تشرفت بمعرفتك (Tasharraftu bima'rifatik)", "만나서 반갑습니다 (Mannaseo bangapseumnida)", "Şön zi kenenculernen", "Nays tu mit yu", "Hacimemasite", "Hen gaosin rensi ni", "Tasarraftu bimarifetik", "Mannaso pangapseumnida")
add_p("greetings-11", "Greetings", "Nerelisiniz?", "Woher kommen Sie?", "Where are you from?", "¿De dónde es usted?", "D'où venez-vous ?", "Di dov'è?", "Откуда вы?", "どちらから来ましたか？ (Dochira kara kimashita ka?)", "您来自哪里？ (Nín láizì nǎlǐ?)", "من أين أنت؟ (Min ayna ant?)", "어디에서 오셨나요? (Eodieseo osyeonnahyo?)")
add_p("greetings-12", "Greetings", "Ben ...'dan geliyorum.", "Ich komme aus...", "I come from...", "Vengo de...", "Je viens de...", "Vengo da...", "Я из...", "私は...から来ました (Watashi wa... kara kimashita)", "我来自... (Wǒ láizì...)", "أنا من... (Ana min...)", "저는 ...에서 왔습니다 (Jeoneun... eseo wasseumnida)")
add_p("greetings-13", "Greetings", "Kaç yaşındasınız?", "Wie alt sind Sie?", "How old are you?", "¿Cuántos años tiene?", "Quel âge avez-vous ?", "Quanti anni ha?", "Сколько вам лет?", "おいくつですか？ (Oikutsu desu ka?)", "您多大岁数？ (Nín duō dà suìshu?)", "كم عمرك؟ (Kam 'umruk?)", "나이가 어떻게 되시나요? (Naiga eotteohke dwesinayo?)")
add_p("greetings-14", "Greetings", "Lütfen", "Bitte", "Please", "Por favor", "S'il vous plaît", "Per favore", "Пожалуйста", "お願いします (Onegai shimasu)", "请 (Qǐng)", "من فضلك (Min fadlik)", "부탁합니다 (Butakhamnida)")
add_p("greetings-15", "Greetings", "Teşekkür ederim", "Danke schön", "Thank you", "Muchas gracias", "Merci beaucoup", "Grazie mille", "Большое спасибо", "ありがとうございます (Arigatō gozaimasu)", "谢谢 (Xièxie)", "شكراً جزيلاً (Shukran jazilan)", "감사합니다 (Gamsahamnida)")
add_p("greetings-16", "Greetings", "Rica ederim", "Bitte schön", "You are welcome", "De nada", "De rien", "Prego", "Пожалуйста", "どういたしまして (Dōitashimashite)", "不客气 (Bù kèqi)", "عفواً (Affwan)", "천만에요 (Cheonmaneyo)")
add_p("greetings-17", "Greetings", "Evet", "Ja", "Yes", "Sí", "Oui", "Sì", "Да", "はい (Hai)", "是 (Shì)", "نعم (Na'am)", "네 (Ne)")
add_p("greetings-18", "Greetings", "Hayır", "Nein", "No", "No", "Non", "No", "Нет", "いいえ (Iie)", "不 (Bù)", "لا (La)", "아니요 (Aniyo)")
add_p("greetings-19", "Greetings", "Affedersiniz", "Entschuldigung", "Excuse me", "Disculpe", "Pardon", "Scusi", "Извините", "すみません (Sumimasen)", "抱歉 (Bàoqiàn)", "معذرة (Ma'dhiratan)", "죄송합니다 (Joesonghamnida)")
add_p("greetings-20", "Greetings", "Anlamıyorum", "Ich verstehe nicht", "I do not understand", "No entiendo", "Je ne comprends pas", "Non capisco", "Я не понимаю", "わかりません (Wakarimasen)", "我不明白 (Wǒ bù míngbai)", "لا أفهم (La afham)", "이해가 안 돼요 (Ihaega an dwaeyo)")
add_p("greetings-21", "Greetings", "İngilizce biliyor musunuz?", "Sprechen Sie Englisch?", "Do you speak English?", "¿Habla inglés?", "Parlez-vous anglais ?", "Parla inglese?", "Вы говорите по-английски?", "英語を話せますか？ (Eigo wo hanasemasu ka?)", "你会说英语吗？ (Nǐ huì shuō Yīngyǔ ma?)", "هل تتكلم الإنجليزية؟ (Hal tatakallam al-ingliziyya?)", "영어 할 수 있어요? (Yeong-eo hal su isseoyo?)")
add_p("greetings-22", "Greetings", "Biraz biliyorum", "Ich spreche ein wenig", "I speak a little", "Hablo un poco", "Je parle un peu", "Parlo un po'", "Я немного говорю", "少し話せます (Sukoshi hanasemasu)", "我会说一点 (Wǒ huì shuō yìdiǎn)", "أتكلم القليل (Atakallam al-qalil)", "조금 할 수 있어요 (Jogeum hal su isseoyo)")
add_p("greetings-23", "Greetings", "Sonra görüşürüz!", "Bis später!", "See you later!", "¡Hasta luego!", "À plus tard !", "A dopo!", "До встречи!", "また後で (Mata ato de)", "回头见 (Huítóu jiàn)", "أراك لاحقاً (Araka lahiqan)", "나중에 봐요 (Najunge bwayo)")
add_p("greetings-24", "Greetings", "İyi şanslar!", "Viel Glück!", "Good luck!", "¡Buena suerte!", "Bonne chance !", "Buona fortuna!", "Удачи!", "幸運を祈ります (Kōun wo inorimasu)", "祝你好运 (Zhù nǐ hǎo yùn)", "حظاً سعيداً (Hazzan sa'idan)", "행운을 빌어요 (Haenguneul bireoyo)")
add_p("greetings-25", "Greetings", "Tebrikler!", "Herzlichen Glückwunsch!", "Congratulations!", "¡Felicidades!", "Félicitations !", "Congratulazioni!", "Поздравляю!", "おめでとうございます (Omedetō gozaimasu)", "恭喜！ (Gōngxǐ!)", "مبروك! (Mabruk!)", "축하합니다! (Chukhahamnida!)")

# 2. NUMBERS & TIME (25 items)
numbers_base = [
    ("Bir", "Eins", "One", "Uno", "Un", "Uno", "Один", "一 (Ichi)", "一 (Yī)", "واحد (Wahid)", "하나 (Hana / Il)"),
    ("İki", "Zwei", "Two", "Dos", "Deux", "Due", "Два", "二 (Ni)", "二 (Èr)", "اثنان (Ithnan)", "둘 (Dul / I)"),
    ("Üç", "Drei", "Three", "Tres", "Trois", "Tre", "Три", "三 (San)", "三 (Sān)", "ثلاثة (Thalatha)", "셋 (Set / Sam)"),
    ("Dört", "Vier", "Four", "Cuatro", "Quatre", "Quattro", "Четыре", "四 (Yon / Shi)", "四 (Sì)", "أربعة (Arba'a)", "넷 (Net / Sa)"),
    ("Beş", "Fünf", "Five", "Cinco", "Cinq", "Cinque", "Пять", "五 (Go)", "五 (Wǔ)", "خمسة (Khamsa)", "다섯 (Daseot / O)"),
    ("Altı", "Sechs", "Six", "Seis", "Six", "Sei", "Шесть", "六 (Roku)", "六 (Liù)", "ستة (Sitta)", "여섯 (Yeoseot / Yuk)"),
    ("Yedi", "Sieben", "Seven", "Siete", "Sept", "Sette", "Семь", "七 (Nana / Shichi)", "七 (Qī)", "سبعة (Sab'a)", "일곱 (Ilgop / Chil)"),
    ("Sekiz", "Acht", "Eight", "Ocho", "Huit", "Otto", "Восемь", "八 (Hachi)", "八 (Bā)", "ثمانية (Thamaniyya)", "여덟 (Yeodeol / Pal)"),
    ("Dokuz", "Neun", "Nine", "Nueve", "Neuf", "Nove", "Девять", "九 (Kyū)", "九 (Jiǔ)", "تسعة (Tis'a)", "아홉 (Ahop / Gu)"),
    ("On", "Zehn", "Ten", "Diez", "Dix", "Dieci", "Десять", "十 (Jū)", "十 (Shí)", "عشرة ('Ashara)", "열 (Yeol / Sip)"),
    ("Yirmi", "Zwanzig", "Twenty", "Veinte", "Vingt", "Venti", "Двадцать", "二十 (Ni-jū)", "二十 (Èrshí)", "عشرون ('Ishrun)", "스물 (Seumul / I-sip)"),
    ("Otuz", "Dreißig", "Thirty", "Treinta", "Trente", "Trenta", "Тридцать", "三十 (San-jū)", "三十 (Sānshí)", "ثلاثون (Thalathun)", "서른 (Seoreun / Sam-sip)"),
    ("Yüz", "Hundert", "One hundred", "Cien", "Cent", "Cento", "Сто", "百 (Hyaku)", "百 (Bǎi)", "مائة (Mi'a)", "백 (Baek)"),
    ("Bin", "Tausend", "One thousand", "Mil", "Mille", "Mille", "Тысяча", "千 (Sen)", "千 (Qiān)", "ألف (Alf)", "천 (Cheon)"),
    ("Saat kaç?", "Wie spät ist es?", "What time is it?", "¿Qué hora es?", "Quelle heure est-il ?", "Che ora è?", "Который час?", "今何時ですか？ (Ima nan-ji desu ka?)", "现在几点了？ (Xiànzài jǐ diǎn le?)", "كم الساعة؟ (Kam as-sa'a?)", "지금 몇 시예요? (Jigeum myeot siyeyo?)"),
    ("Saat beş.", "Es ist fünf Uhr.", "It is five o'clock.", "Son las cinco.", "Il est cinq heures.", "Sono le cinque.", "Сейчас пять часов.", "五時です (Go-ji desu)", "现在五点 (Xiànzài wǔ diǎn)", "الساعة الخامسة (As-sa'a al-khamisa)", "다섯 시입니다 (Daseot siimnida)"),
    ("Bugün", "Heute", "Today", "Hoy", "Aujourd'hui", "Oggi", "Сегодня", "今日 (Kyō)", "今天 (Jīntiān)", "اليوم (Al-yawm)", "오늘 (Oneul)"),
    ("Yarın", "Morgen", "Tomorrow", "Mañana", "Demain", "Domani", "Завтра", "明日 (Ashita)", "明天 (Míngtiān)", "غداً (Gadan)", "내일 (Nae-il)"),
    ("Dün", "Gestern", "Yesterday", "Ayer", "Hier", "Ieri", "Вчера", "昨日 (Kinō)", "昨天 (Zuótiān)", "أمس (Ams)", "어제 (Eoje)"),
    ("Sabah", "Der Morgen", "Morning", "La mañana", "Le matin", "La mattina", "Утро", "朝 (Asa)", "早上 (Zǎoshang)", "الصباح (As-sabah)", "아침 (Achim)"),
    ("Öğle", "Der Mittag", "Noon / Afternoon", "El mediodía", "L'après-midi", "Il pomeriggio", "Полдень", "昼 (Hiru)", "下午 (Xiàwǔ)", "الظهر (Az-zuhr)", "점심 / 낮 (Jeomsim)"),
    ("Akşam", "Der Abend", "Evening", "La tarde / noche", "Le soir", "La sera", "Вечер", "夜 / 晩 (Yoru / Ban)", "晚上 (Wǎnshang)", "المساء (Al-misa')", "저녁 (Jeonyeok)"),
    ("Pazartesi", "Montag", "Monday", "Lunes", "Lundi", "Lunedì", "Понедельник", "月曜日 (Getsuyōbi)", "星期一 (Xīngqīyī)", "الإثنين (Al-ithnayn)", "월요일 (Woreoyil)"),
    ("Cuma", "Freitag", "Friday", "Viernes", "Vendredi", "Venerdì", "Пятница", "金曜日 (Kin'yōbi)", "星期五 (Xīngqīwǔ)", "الجمعة (Al-jumu'a)", "금요일 (Geumyoil)"),
    ("Hafta sonu", "Das Wochenende", "Weekend", "El fin de semana", "Le week-end", "Il fine settimana", "Выходные", "週末 (Shūmatsu)", "周末 (Zhōumò)", "عطلة نهاية الأسبوع (Utlat nihayat al-usbu')", "주말 (Jumal)")
]

for idx, item in enumerate(numbers_base):
    add_p(f"numbers-{idx+1}", "Numbers", item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8], item[9], item[10])

# 3. DINING (30 items)
dining_base = [
    ("Bir kahve lütfen.", "Einen Kaffee, bitte.", "A coffee, please.", "Un café, por favor.", "Un café, s'il vous plaît.", "Un caffè, per favore.", "Кофе, пожалуйста.", "コーヒーをください (Kōhī wo kudasai)", "请给我一杯咖啡 (Qǐng gěi wǒ yì bēi kāfēi)", "قهوة من فضلك (Qahwa min fadlik)", "커피 한 잔 주세요 (Keopi han jan juseyo)"),
    ("Bir çay lütfen.", "Einen Tee, bitte.", "A tea, please.", "Un té, por favor.", "Un thé, s'il vous plaît.", "Un tè, per favore.", "Чай, пожалуйста.", "お茶をください (Ocha wo kudasai)", "请给我一杯茶 (Qǐng gěi wǒ yì bēi chá)", "شاي من فضلك (Shay min fadlik)", "차 한 잔 주세요 (Cha han jan juseyo)"),
    ("Su lütfen.", "Wasser, bitte.", "Water, please.", "Agua, por favor.", "De l'eau, s'il vous plaît.", "Acqua, per favore.", "Воду, пожалуйста.", "お水をください (Omizu wo kudasai)", "请给我水 (Qǐng gěi wǒ shuǐ)", "ماء من فضلك (Ma' min fadlik)", "물 좀 주세요 (Mul jom juseyo)"),
    ("Hesap lütfen.", "Die Rechnung, bitte.", "The bill, please.", "La cuenta, por favor.", "L'addition, s'il vous plaît.", "Il conto, per favore.", "Счет, пожалуйста.", "お会計をお願いします (Okaikei wo onegai shimasu)", "请结账 (Qǐng jiézhàng)", "الحساب من فضلك (Al-hisab min fadlik)", "계산서 주세요 (Gyesanseo juseyo)"),
    ("Acıktım.", "Ich habe Hunger.", "I am hungry.", "Tengo hambre.", "J'ai faim.", "Ho fame.", "Я голоден.", "お腹が空きました (Onaka ga akimashita)", "我饿了 (Wǒ è le)", "أنا جائع (Ana ja'i')", "배가 고파요 (Baega gopayo)"),
    ("Susadım.", "Ich habe Durst.", "I am thirsty.", "Tengo sed.", "J'ai soif.", "Ho sete.", "Я хочу пить.", "喉が渇きました (Node ga kawakimashita)", "我渴了 (Wǒ kě le)", "أنا عطشان (Ana 'atshan)", "목이 말라요 (Mogi mallayo)"),
    ("Menü lütfen.", "Die Speisekarte, bitte.", "The menu, please.", "La carta, por favor.", "Le menu, s'il vous plaît.", "Il menu, per favore.", "Меню, пожалуйста.", "メニューをお願いします (Menyū wo onegai shimasu)", "请给我菜单 (Qǐng gěi wǒ càidān)", "قائمة الطعام من فضلك (Qa'imat at-ta'am min fadlik)", "메뉴판 주세요 (Menyupan juseyo)"),
    ("İki kişilik masa lütfen.", "Einen Tisch für zwei, bitte.", "A table for two, please.", "Una mesa para dos, por favor.", "Une table pour deux, s'il vous plaît.", "Un tavolo per due, per favore.", "Столик на двоих, пожалуйста.", "2人用の席をお願いします (Futari-yō no seki wo onegai shimasu)", "请给我们一张两人桌 (Qǐng gěi wǒmen yì zhāng liǎng rén zhuō)", "طاولة لشخصين من فضلك (Tawila li-shakhsayn min fadlik)", "두 명 자리 주세요 (Du myeong jari juseyo)"),
    ("Çok lezzetli!", "Es schmeckt sehr gut!", "It is delicious!", "¡Está delicioso!", "C'est délicieux !", "È delizioso!", "Это очень вкусно!", "とても美味しいです！ (Totemo oishii desu!)", "非常好吃！ (Fēicháng hǎochī!)", "هذا لديد جداً! (Hadha ladhidh jiddan!)", "정말 맛있어요! (Jeongmal masisseoyo!)"),
    ("Afiyet olsun!", "Guten Appetit!", "Enjoy your meal!", "¡Buen provecho!", "Bon appétit !", "Buon appetito!", "Приятного аппетита!", "いただきます (Itadakimasu)", "祝你好胃口 (Zhù nǐ hǎo wèi kǒu)", "شهية طيبة (Shahiyya tayyiba)", "맛있게 드세요 (Masitge deuseyo)"),
    ("Sipariş vermek istiyorum.", "Ich möchte bestellen.", "I would like to order.", "Me gustaría pedir.", "Je voudrais commander.", "Vorrei ordinare.", "Я хочу сделать заказ.", "注文をお願いします (Chūmon wo onegai shimasu)", "我想点餐 (Wǒ xiǎng diǎncān)", "أريد أن أطلب (Arid an atlub)", "주문할게요 (Jumunhalgeyo)"),
    ("Kahvaltı", "Das Frühstück", "Breakfast", "El desayuno", "Le petit-déjeuner", "La colazione", "Завтрак", "朝食 (Chōshoku)", "早餐 (Zǎocān)", "الإفطار (Al-iftar)", "아침 식사 (Achim siksa)"),
    ("Öğle yemeği", "Das Mittagessen", "Lunch", "El almuerzo", "Le déjeuner", "Il pranzo", "Обед", "昼食 (Chūshoku)", "午餐 (Wǔcān)", "الغداء (Al-ghada')", "점심 식사 (Jeomsim siksa)"),
    ("Akşam yemeği", "Das Abendessen", "Dinner", "La cena", "Le dîner", "La cena", "Ужин", "夕食 (Yūshoku)", "晚餐 (Wǎncān)", "العشاء (Al-'asha')", "저녁 식사 (Jeonyeok siksa)"),
    ("Ekmek", "Das Brot", "Bread", "El pan", "Le pain", "Il pane", "Хлеб", "パン (Pan)", "面包 (Miànbāo)", "خبز (Khubz)", "빵 (Ppang)"),
    ("Tuz ve karabiber", "Salz und Pfeffer", "Salt and pepper", "Sal y pimienta", "Sel et poivre", "Sale e pepe", "Соль и перец", "塩とコショウ (Shio to koshō)", "盐和胡椒 (Yán hé hújiāo)", "ملح وفلفل (Milh wa filfil)", "소금과 후추 (Sogeum gwa huchu)"),
    ("Meyve", "Das Obst", "Fruit", "La fruta", "Les fruits", "La frutta", "Фрукты", "果物 (Kudamono)", "水果 (Shuǐguǒ)", "فاكهة (Fakiha)", "과일 (Gwail)"),
    ("Sebze", "Das Gemüse", "Vegetable", "La verdura", "Les légumes", "La verdura", "Овощи", "野菜 (Yasai)", "蔬菜 (Shūcài)", "خضروات (Khadrawat)", "채소 (Chaeso)"),
    ("Et", "Das Fleisch", "Meat", "La carne", "La viande", "La carne", "Мясо", "肉 (Niku)", "肉 (Ròu)", "لحم (Lahm)", "고기 (Gogi)"),
    ("Balık", "Der Fisch", "Fish", "El pescado", "Le poisson", "Il pesce", "Рыба", "魚 (Sakana)", "鱼 (Yú)", "سمك (Samak)", "생선 (Saengseon)"),
    ("Tatlı", "Der Nachtisch", "Dessert", "El postre", "Le dessert", "Il dolce", "Десерт", "デザート (Dezāto)", "甜点 (Tiándiǎn)", "حلويات (Halawiyyat)", "디저트 (Dijeoteu)"),
    ("Sıcak", "Heiß", "Hot (temperature)", "Caliente", "Chaud", "Caldo", "Горячий", "温かい / 熱い (Atsui)", "热的 (Rè de)", "ساخن (Sakhin)", "뜨거운 (Tteugeoun)"),
    ("Soğuk", "Kalt", "Cold", "Frío", "Froid", "Freddo", "Холодный", "冷たい (Tsumetai)", "冷的 (Lěng de)", "بارد (Barid)", "차가운 (Chagaun)"),
    ("Vejetaryenim.", "Ich bin Vegetarier.", "I am vegetarian.", "Soy vegetariano.", "Je suis végétarien.", "Sono vegetariano.", "Я вегетарианка / вегетарианец.", "ベジタリアンです (Bejitarian desu)", "我是素食主义者 (Wǒ shì sùshí zhǔyì zhě)", "أنا نباتي (Ana nabati)", "저는 채식주의자입니다 (Jeoneun chaesikjuyijaimnida)"),
    ("Şekersiz olsun.", "Ohne Zucker, bitte.", "Without sugar, please.", "Sin azúcar, por favor.", "Sans sucre, s me p.", "Senza zucchero, p f.", "Без сахара, пожалуйста.", "砂糖抜きでお願いします (Satō nuki de onegai shimasu)", "请不要加糖 (Qǐng bú yào jiā táng)", "بدون سكر من فضلك (Bidun sukkar min fadlik)", "설탕은 빼주세요 (Seoltangeun ppaejuseyo)"),
    ("Biraz daha su alabilir miyim?", "Kann ich noch etwas Wasser haben?", "Can I have more water?", "¿Puedo tener más agua?", "Puis-je avoir plus d'eau ?", "Posso avere altra acqua?", "Можно еще воды?", "お代わりの水をいただけますか？ (Okawari no mizu wo itadakemasu ka?)", "能再给我一些水吗？ (Néng zài gěi wǒ yìxiē shuǐ ma?)", "هل يمكنني الحصول على المزيد من الماء؟ (Hal yumkinuni al-husul 'ala al-mazid min al-ma'?)", "물 좀 더 주시겠어요? (Mul jom deo jusigesseoyo?)"),
    ("Şerefe!", "Prost!", "Cheers!", "¡Salud!", "Santé !", "Salute!", "За здоровье!", "乾杯！ (Kanpai!)", "干杯！ (Gānbēi!)", "في صحتك! (Fi sahhatik!)", "건배! (Geonbae!)"),
    ("Bu masa boş mu?", "Ist dieser Tisch frei?", "Is this table free?", "¿Está libre esta mesa?", "Cette table est-elle libre ?", "Questo tavolo è libero?", "Этот столик свободен?", "この席は空いていますか？ (Kono seki wa aite imasu ka?)", "这个桌子空着吗？ (Zhège zhuōzi kōng zhe ma?)", "هل هذه الطاولة فارغة؟ (Hal hadhihi at-tawila farigha?)", "이 자리가 비어 있나요? (I jariga bieo innayo?)"),
    ("Bahşiş", "Das Trinkgeld", "Tip / Gratuity", "La propina", "Le pourboire", "La mancia", "Чаевые", "チップ (Chippu)", "小费 (Xiǎofèi)", "إكرامية (Ikramiyya)", "팁 (Tip)"),
    ("Siparişim henüz gelmedi.", "Mein Essen ist noch nicht da.", "My order hasn't arrived yet.", "Mi pedido no ha llegado aún.", "Mon plat n'est pas encore arrivé.", "Il mio ordine non è ancora arrivato.", "Мой заказ еще не принесли.", "注文がまだ来ていません (Chūmon ga mada kite imasen)", "我的菜还没上 (Wǒ de cài hái méi shàng)", "طلبي لم يصل بعد (Talabi lam yasil ba'd)", "주문한 음식이 아직 안 나왔어요 (Jumunhan eomsigi ajik an nawasseoyo)")
]

for idx, item in enumerate(dining_base):
    add_p(f"dining-{idx+1}", "Dining", item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8], item[9], item[10])

# 4. TRAVEL & DIRECTIONS (35 items)
travel_base = [
    ("Nerede?", "Wo ist...?", "Where is...?", "¿Dónde está...?", "Où est... ?", "Dov'è...?", "Где находится...?", "〜はどこですか？ (...wa doko desu ka?)", "...在哪里？ (...zài nǎlǐ?)", "أين...؟ (Ayna...?)", "...이/가 어디에 있나요? (...i/ga eodie innayo?)"),
    ("Tuvalet nerede?", "Wo ist die Toilette?", "Where is the bathroom?", "¿Dónde está el baño?", "Où sont les toilettes ?", "Dov'è il bagno?", "Где туалет?", "お手洗いはどこですか？ (Otearai wa doko desu ka?)", "洗手间在哪里？ (Xǐshǒujiān zài nǎlǐ?)", "أين دورة المياه؟ (Ayna dawrat al-miyah?)", "화장실이 어디예요? (Hwajangsiri eodiyeyo?)"),
    ("Otobüs durağı nerede?", "Wo ist die Bushaltestelle?", "Where is the bus stop?", "¿Dónde está la parada de autobús?", "Où est l'arrêt de bus ?", "Dov'è la fermata dell'autobus?", "Где автобусная остановка?", "バス停はどこですか？ (Basutei wa doko desu ka?)", "公交车站在哪里？ (Gōngjiāochē zhàn zài nǎlǐ?)", "أين موقف الحافلات؟ (Ayna mawqif al-hafilat?)", "버스 정류장이 어디예요? (Beoseu jeongryujangi eodiyeyo?)"),
    ("Tren istasyonu", "Der Bahnhof", "Train station", "La estación de trenes", "La gare", "La stazione ferroviaria", "Железнодорожный вокзал", "駅 (Eki)", "火车站 (Huǒchēzhàn)", "محطة القطار (Mahattat al-qitar)", "기차역 (Gichayeok)"),
    ("Havalimanı", "Der Flughafen", "Airport", "El aeropuerto", "L'aéroport", "L'aeroporto", "Аэропорт", "空港 (Kūkō)", "机场 (Jīchǎng)", "المطار (Al-matar)", "공항 (Gonghang)"),
    ("Taksi lütfen.", "Ein Taxi, bitte.", "A taxi, please.", "Un taxi, por favor.", "Un taxi, s'il vous plaît.", "Un taxi, per favore.", "Такси, пожалуйста.", "タクシーを呼んでください (Takushī wo yonde kudasai)", "请叫出租车 (Qǐng jiào chūzūchē)", "تاكسي من فضلك (Taksi min fadlik)", "택시 좀 불러주세요 (Taeksi jom bulleojuseyo)"),
    ("Bilet", "Die Fahrkarte", "Ticket", "El billete / boleto", "Le billet", "Il biglietto", "Билет", "切符 (Kippu)", "票 (Piào)", "تذكرة (Tadhkira)", "표 / 티켓 (Pyo / Tiket)"),
    ("Gidiş-dönüş bileti", "Hin- und Rückfahrkarte", "Round trip ticket", "Billete de ida y vuelta", "Billet aller-retour", "Biglietto di andata e ritorno", "Билет туда и обратно", "往復切符 (Ōfuku kippu)", "往返票 (Wǎngfǎn piào)", "تذكرة ذهاب وإياب (Tadhkirat dhahab wa iyab)", "왕복 표 (Wangbok pyo)"),
    ("Ne kadar uzaklıkta?", "Wie weit ist es?", "How far is it?", "¿A qué distancia está?", "C'est à quelle distance ?", "Quanto dista?", "Как это далеко?", "どのくらい遠いですか？ (Dono kurai tōi desu ka?)", "有多远？ (Yǒu duō yuǎn?)", "كم يبعد هذا؟ (Kam yab'ud hadha?)", "얼마나 먼가요? (Eolmana meongayo?)"),
    ("Sağa dönün.", "Biegen Sie nach rechts ab.", "Turn right.", "Gire a la derecha.", "Tournez à droite.", "Giri a destra.", "Поверните направо.", "右に曲がってください (Migi ni magatte kudasai)", "向右转 (Xiàng yòu zhuǎn)", "نعطف يميناً (In'atif yaminan)", "오른쪽으로 돌으세요 (Oreunjjoogeuro doreuseyo)"),
    ("Sola dönün.", "Biegen Sie nach links ab.", "Turn left.", "Gire a la izquierda.", "Tournez à gauche.", "Giri a sinistra.", "Поверните налево.", "左に曲がってください (Hidari ni magatte kudasai)", "向左转 (Xiàng zuǒ zhuǎn)", "نعطف يساراً (In'atif yasaran)", "왼쪽으로 돌으세요 (Oenjjoogeuro doreuseyo)"),
    ("Düz gidin.", "Gehen Sie geradeaus.", "Go straight ahead.", "Siga recto.", "Allez tout droit.", "Vada dritto.", "Идите прямо.", "まっすぐ行ってください (Massugu itte kudasai)", "直走 (Zhí zǒu)", "امشِ مباشرة (Imshi mubasharatan)", "직진하세요 (Jikjinhaseyo)"),
    ("Harita", "Die Karte / Der Stadtplan", "Map", "El mapa", "La carte", "La mappa", "Карта", "地図 (Chizu)", "地图 (Dìtú)", "خريطة (Kharita)", "지도 (Jido)"),
    ("Pasaport", "Der Reisepass", "Passport", "El pasaporte", "Le passeport", "Il passaporto", "Паспорт", "パスポート (Pasupōto)", "护照 (Hùzhào)", "جواز سفر (Jawaz safar)", "여권 (Yeogwon)"),
    ("Bagaj", "Das Gepäck", "Luggage / Baggage", "El equipaje", "Les bagages", "I bagagli", "Багаж", "荷物 (Nimotsu)", "行李 (Xíngli)", "أمتعة (Amtia)", "짐 / 수하물 (Jim / Suhamul)"),
    ("Otel", "Das Hotel", "Hotel", "El hotel", "L'hôtel", "L'hotel", "Отель / Гостиница", "ホテル (Hoteru)", "酒店 (Jiǔdiàn)", "فندق (Funduq)", "호텔 (Hotel)"),
    ("Otel anahtarı", "Der Zimmerschlüssel", "Hotel room key", "La llave de la habitación", "La clé de chambre", "La chiave della camera", "Ключ от номера", "ホテルの鍵 (Hoteru no kagi)", "房间钥匙 (Fángjiān yàoshi)", "مفتاح الغرفة (Miftah al-ghurfa)", "방 열쇠 (Bang yeolsoe)"),
    ("Rezervasyonum var.", "Ich habe eine Reservierung.", "I have a reservation.", "Tengo una reserva.", "J'ai une réservation.", "Ho una prenotazione.", "У меня забронировано.", "予約があります (Yoyaku ga arimasu)", "我有预订 (Wǒ yǒu yùdìng)", "لدي حجز (Ladayya hajz)", "예약했습니다 (Yeyakhaesseumnida)"),
    ("Kayboldum.", "Ich habe mich verlaufen.", "I am lost.", "Estoy perdido.", "Je suis perdu.", "Mi sono perso.", "Я заблудился.", "道に迷いました (Michi ni mayoimashita)", "我迷路了 (Wǒ mílù le)", "أنا ضائع (Ana da'i')", "길을 잃었어요 (Gireul ireosseoyo)"),
    ("Bana yardım edebilir misiniz?", "Können Sie mir helfen?", "Can you help me?", "¿Puede ayudarme?", "Pouvez-vous m'aider ?", "Può aiutarmi?", "Вы можете мне помочь?", "手伝っていただけますか？ (Tetsudatte itadakemasu ka?)", "你能帮助我吗？ (Nǐ néng bāngzhù wǒ ma?)", "هل يمكنك مساعدتي؟ (Hal yumkinuka musa'adati?)", "도와주실 수 있나요? (Dowajusil su innayo?)"),
    ("Bilgi bürosu", "Die Information", "Information desk", "La oficina de información", "Le bureau d'information", "L'ufficio informazioni", "Справочное бюро", "案内所 (Annaijo)", "问讯处 (Wèn xùn chù)", "مكتب الاستعلامات (Maktab al-isti'lamat)", "안내소 (Annaeso)"),
    ("Şehir merkezi", "Das Stadtzentrum", "City center", "El centro de la ciudad", "Le centre-ville", "Il centro città", "Центр города", "市内中心部 (Shinai chūshinbu)", "市中心 (Shì zhōngxīn)", "وسط المدينة (Wasat al-madina)", "시내 (Sinae)"),
    ("Plaj", "Der Strand", "Beach", "La playa", "La plage", "La spiaggia", "Пляж", "海辺 / ビーチ (Bīchi)", "海滩 (Hǎitān)", "الشاطئ (Ash-shati')", "해변 (Haebyeon)"),
    ("Müze", "Das Museum", "Museum", "El museo", "Le musée", "Il museo", "Музей", "美術館 / 博物館 (Hakubutsukan)", "博物馆 (Bówùguǎn)", "متحف (Mathaf)", "박물관 (Bangmulgwan)"),
    ("Taksi durağı", "Der Taxistand", "Taxi rank / stand", "La parada de taxis", "Station de taxis", "La stazione dei taxi", "Стоянка такси", "タクシー乗り場 (Takushī noriba)", "出租车停靠站 (Chūzūchē tíngkào zhàn)", "موقف التاكسي (Mawqif at-taksi)", "택시 승강장 (Taeksi seunggangjang)"),
    ("Ne zaman kalkıyor?", "Wann fährt es ab?", "When does it leave?", "¿A qué hora sale?", "Quand part-il ?", "Quando parte?", "Когда отправляется?", "出発は何時ですか？ (Shuppatsu wa nan-ji desu ka?)", "什么时候出发？ (Shénme shíhou chūfā?)", "متى يغادر؟ (Mata yughadir?)", "언제 출발하나요? (Eonje chulbalhanayo?)"),
    ("Varış süresi", "Die Ankunftszeit", "Arrival time", "La hora de llegada", "Heure d'arrivée", "L'ora di arrivo", "Время прибытия", "到着時間 (Tōchaku jikan)", "到达时间 (Dàodá shíjiān)", "وقت الوصول (Waqt al-wusul)", "도착 시간 (Dochak sigan)"),
    ("Giriş yapmak (Check-in)", "Einchecken", "To check in", "Hacer el check-in", "Faire le check-in", "Fare il check-in", "Зарегистрироваться", "チェックインする (Chekkuin suru)", "办理入住 (Bànlǐ rùzhù)", "تسجيل الوصول (Tasjil al-wusul)", "체크인하다 (Chekeuinhada)"),
    ("Çıkış yapmak (Check-out)", "Auschecken", "To check out", "Hacer el check-out", "Faire le check-out", "Fare il check-out", "Выселиться", "チェックアウトする (Chekkuatu suru)", "退房 (Tuì fáng)", "تسجيل المغادرة (Tasjil al-mughadara)", "체크아웃하다 (Chekeuauthada)"),
    ("Bagajımı nerede saklayabilirim?", "Wo kann ich mein Gepäck lassen?", "Where can I leave my luggage?", "¿Dónde puedo dejar mi equipaje?", "Où puis-je laisser mes bagages ?", "Dove posso lasciare i bagagli?", "Где я могу оставить багаж?", "荷物を預けられますか？ (Nimotsu wo azukeraremasu ka?)", "在哪里可以寄存行李？ (Zài nǎlǐ kěyǐ jìcún xíngli?)", "أين يمكنني ترك أمتعتي؟ (Ayna yumkinuni tark amtia'ti?)", "짐을 어디에 맡길 수 있나요? (Jimeul eodie matgil su innayo?)"),
    ("En yakın metro istasyonu nerede?", "Wo ist die nächste U-Bahn-Station?", "Where is the nearest metro station?", "¿Dónde está la estación de metro más cercana?", "Où est la station de métro la plus proche ?", "Dov'è la stazione della metropolitana più vicina?", "Где ближайшая станция метро?", "一番近い地下鉄の駅はどこですか？ (Ichiban chikai chikatetsu no eki wa doko desu ka?)", "最近的地铁站在哪里？ (Zuì jìn de dìtiě zhàn zài nǎlǐ?)", "أين أكتب محطة مترو؟ (Ayna aqrab mahattat metro?)", "가장 가까운 지하철역이 어디예요? (Gajang gakkaun jihacheolyeogi eodiyeyo?)"),
    ("Araba kiralama", "Die Autovermietung", "Car rental", "Alquiler de coches", "Location de voitures", "Noleggio auto", "Аренда автомобилей", "レンタカー (Rentakā)", "租车 (Zū chē)", "تأجير سيارات (Ta'jir siyarat)", "렌터카 (Renteokea)"),
    ("Şehir haritası var mı?", "Haben Sie einen Stadtplan?", "Do you have a city map?", "¿Tiene un mapa de la ciudad?", "Avez-vous un plan de la ville ?", "Ha una mappa della città?", "У вас есть карта города?", "街の地図はありますか？ (Machi no chizu wa arimasu ka?)", "有城市地图吗？ (Yǒu chéngshì dìtú ma?)", "هل لديك خريطة للمدينة؟ (Hal ladayka kharita lil-madina?)", "도시 지도가 있나요? (Dosi jidoga innayo?)"),
    ("Deniz manzaralı oda", "Zimmer mit Meerblick", "Room with sea view", "Habitación con vista al mar", "Chambre avec vue sur la mer", "Camera con vista mare", "Номер с видом на море", "海が見える部屋 (Umi ga mieru heya)", "海景房 (Hǎijǐng fáng)", "غرفة مطلة على البحر (Ghurfa mutallila 'ala al-bahr)", "바다 전망 방 (Bada jeonmang bang)"),
    ("Yolculuğunuz nasıl geçti?", "Wie war Ihre Reise?", "How was your journey?", "¿Qué tal el viaje?", "Comment s'est passé votre voyage ?", "Com'è stato il viaggio?", "Как прошла поездка?", "旅はいかがでしたか？ (Tabi wa ikaga deshita ka?)", "旅途怎么样？ (Lǚtú zěnmeyàng?)", "كيف كانت رحلتك؟ (Kayfa kanat rihlatuk?)", "여행은 어떠셨나요? (Yeohaengeun eotteosyeonnayo?)")
]

for idx, item in enumerate(travel_base):
    add_p(f"travel-{idx+1}", "Travel", item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8], item[9], item[10])

# 5. SHOPPING & MONEY (25 items)
shopping_base = [
    ("Bu ne kadar?", "Wie viel kostet das?", "How much is this?", "¿Cuánto cuesta esto?", "Combien ça coûte ?", "Quanto costa questo?", "Сколько это стоит?", "これはいくらですか？ (Kore wa ikura desu ka?)", "这个多少钱？ (Zhège duōshao qián?)", "بكم هذا؟ (Bikam hadha?)", "이거 얼마예요? (Igeo eolmayeyo?)"),
    ("Çok pahalı.", "Das ist zu teuer.", "It is too expensive.", "Es demasiado caro.", "C'est trop cher.", "È troppo caro.", "Это слишком дорого.", "高すぎます (Takasugimasu)", "太贵了 (Tài guì le)", "هذا غالي جداً (Hadha ghali jiddan)", "너무 비싸요 (Neomu bissayo)"),
    ("İndirim yapabilir misiniz?", "Können Sie einen Rabatt geben?", "Can you give a discount?", "¿Puede hacer un descuento?", "Pouvez-vous faire une réduction ?", "Può fare uno sconto?", "Сделайте скидку, пожалуйста?", "安くしてもらえますか？ (Yasuku shite moraemasu ka?)", "能便宜一点吗？ (Néng piányi yìdiǎn ma?)", "هل يمكنك إعطائي خصماً؟ (Hal yumkinuka i'ta'i khasman?)", "깍아주실 수 있나요? (Kkakkajusil su innayo?)"),
    ("Bunu satın alıyorum.", "Ich nehme das.", "I will buy this.", "Me llevo esto.", "Je prends ceci.", "Prendo questo.", "Я возьму это.", "これを買います (Kore wo kaimasu)", "我要买这个 (Wǒ yào mǎi zhège)", "سأشتري هذا (Sa-ashtari hadha)", "이거 살게요 (Igeo salgeyo)"),
    ("Kredi kartı kabul ediyor musunuz?", "Nehmen Sie Kreditkarten?", "Do you accept credit cards?", "¿Aceptan tarjeta de crédito?", "Acceptez-vous les cartes de crédit ?", "Accettate carte di credito?", "Вы принимаете кредитные карты?", "クレジットカードは使えますか？ (Kreditto kādo wa tsukaemasu ka?)", "可以刷卡吗？ (Kěyǐ shuā kǎ ma?)", "هل تقبلون بطاقات الائتمان؟ (Hal taqbalun bitaqat al-i'timan?)", "신용카드 되나요? (Sinyongkadeu doenayo?)"),
    ("Nakit ödeyeceğim.", "Ich bezahle bar.", "I will pay with cash.", "Pagaré en efectivo.", "Je vais payer en espèces.", "Pagherò in contanti.", "Я заплачу наличными.", "現金で払います (Genkin de haraimasu)", "我用现金支付 (Wǒ yòng xiànjīn zhīfù)", "سأدفع نقداً (Sa-adfa' naqdan)", "현금으로 계산할게요 (Hyeongeumeuro gyesanhalgeyo)"),
    ("Açık", "Geöffnet", "Open", "Abierto", "Ouvert", "Aperto", "Открыто", "営業中 (Eigyō-chū)", "营业中 (Yíngyè zhōng)", "مفتوح (Maftuh)", "영업 중 (Yeong-eop jung)"),
    ("Kapalı", "Geschlossen", "Closed", "Cerrado", "Fermé", "Chiuso", "Закрыто", "準備中 / 閉店 (Heiten)", "打烊 / 关闭 (Dǎyàng)", "مغلق (Mughlaq)", "마감 / 닫힘 (Magam / Dathim)"),
    ("Süpermarket", "Der Supermarkt", "Supermarket", "El supermercado", "Le supermarché", "Il supermercato", "Супермаркет", "スーパー (Sūpā)", "超市 (Chāoshì)", "سوبرماركت (Subarmarkit)", "슈퍼마켓 (Syupeomaket)"),
    ("Eczane", "Die Apotheke", "Pharmacy", "La farmacia", "La pharmacie", "La farmacia", "Аптека", "薬局 (Yakkyoku)", "药店 (Yàodiàn)", "صيدلية (Saydaliyya)", "약국 (Yakguk)"),
    ("Kıyafet / Elbise", "Die Kleidung", "Clothes / Dress", "La ropa", "Les vêtements", "I vestiti", "Одежда", "服 (Fuku)", "衣服 (Yīfu)", "ملابس (Malabis)", "옷 (Ot)"),
    ("Beden S / M / L", "Größe S / M / L", "Size S / M / L", "Talla S / M / L", "Taille S / M / L", "Taglia S / M / L", "Размер S / M / L", "サイズ S / M / L (Saizu)", "尺码 S / M / L (Chǐmǎ)", "مقاس صغير / متوسط / كبير", "사이즈 S / M / L"),
    ("Ayakkabı numarası", "Die Schuhgröße", "Shoe size", "El número de calzado", "Pointure", "La taglia di scarpe", "Размер обуви", "靴のサイズ (Kutsu no saizu)", "鞋码 (Xié mǎ)", "مقاس الحذاء (Maqas al-hidha')", "신발 사이즈 (Sinbal saeiju)"),
    ("Fiş / Fatura", "Der Kassenbon", "Receipt", "El recibo / ticket", "Le reçu", "Lo scontrino", "Чек", "レシート (Reshīto)", "小票 / 发票 (Xiǎopiào)", "إيصال (Isal)", "영수증 (Yeongsujeung)"),
    ("Soyunma kabini nerede?", "Wo ist die Umkleidekabine?", "Where is the fitting room?", "¿Dónde está el probador?", "Où est la cabine d'essayage ?", "Dov'è il camerino?", "Где примерка?", "试衣间在哪里？ (Shìyījiān zài nǎlǐ?)", "試着室はどこですか？ (Shichakushitsu wa doko desu ka?)", "أين غرفة القياس؟ (Ayna ghurfat al-qiyas?)", "피팅룸이 어디예요? (Pitingrumi eodiyeyo?)"),
    ("Hediyelik eşya", "Das Souvenir", "Souvenir / Gift", "El recuerdo / souvenir", "Le souvenir", "Il souvenir", "Сувенир", "お土産 (Om土産)", "纪念品 (Jìniànpǐn)", "هدية تذكارية (Hadiyya tadhkariyya)", "기념품 (Ginyeompum)"),
    ("Döviz bürosu", "Die Wechselstube", "Currency exchange", "La casa de cambio", "Le bureau de change", "L'ufficio cambi", "Обмен валюты", "両替所 (Ryōgaejo)", "货币兑换处 (Huòbì duìhuàn chù)", "مكتب صرافة (Maktab sarrafa)", "환전소 (Hwanjeonso)"),
    ("Ucuz", "Billig / Günstig", "Cheap", "Barato", "Bon marché", "Economico", "Дешевый", "安い (Yasui)", "便宜 (Piányi)", "رخيص (Rakhis)", "싸다 / 저렴하다 (Ssada)"),
    ("Kaliteli", "Gute Qualität", "High quality", "De buena calidad", "De bonne qualité", "Di qualità", "Качественный", "高品質な (Kōhinshitsu na)", "质量好的 (Zhìliàng hǎo de)", "جودة عالية (Jawda 'aliya)", "품질이 좋은 (Pumjiri joheun)"),
    ("Çanta", "Die Tasche", "Bag / Handbag", "La bolsa / bolso", "Le sac", "La borsa", "Сумка", "バッグ (Baggu)", "包 (Bāo)", "حقيبة (Haqiba)", "가방 (Gabang)"),
    ("Mağaza", "Das Geschäft", "Store / Shop", "La tienda", "Le magasin", "Il negozio", "Магазин", "店 (Mise)", "商店 (Shāngdiàn)", "متجر (Matjar)", "매장 / 가게 (Maejang)"),
    ("Vitrinde bakıyorum", "Ich schaue nur.", "I am just looking.", "Sólo estoy mirando.", "Je regarde seulement.", "Sto solo guardando.", "Я просто смотрю.", "看着呢 (Kanzhe ne)", "ただ見ているだけです (Tada mite iru dake desu)", "أنا أنظر فقط (Ana anzhur faqat)", "구경만 하고 있어요 (Gugyeongman hago isseoyo)"),
    ("İndirimde", "Im Angebot / Rabatt", "On sale / Discounted", "En oferta", "En promotion", "In offerta", "Со скидкой", "セール中 (Sēru chū)", "打折中 (Dǎzhé zhōng)", "تخفيضات (Takhfidat)", "할인 중 (Harin jung)"),
    ("Toplam tutar nedir?", "Wie viel macht das insgesamt?", "What is the total amount?", "¿Cuánto es el total?", "Quel est le montant total ?", "Qual è il totale?", "Какова общая сумма?", "合計でいくらですか？ (Gōkei de ikura desu ka?)", "一共多少钱？ (Yígòng duōshao qián?)", "ما هو المبلغ الإجمالي؟ (Ma huwa al-mablagh al-ijmali?)", "총 얼마인가요? (Chong eolmaingayo?)"),
    ("Poşet alabilir miyim?", "Kann ich eine Tüte haben?", "Can I have a plastic bag?", "¿Me dá una bolsa?", "Puis-je avoir un sac ?", "Posso avere una busta?", "Можно пакет?", "袋をいただけますか？ (Fukuro wo itadakemasu ka?)", "能给我一个塑料袋吗？ (Néng gěi wǒ yí gè sùliàodài ma?)", "هل يمكنني الحصول على كيس؟ (Hal yumkinuni al-husul 'ala kis?)", "봉투에 담아주시겠어요? (Bongtue damajusigesseoyo?)")
]

for idx, item in enumerate(shopping_base):
    add_p(f"shopping-{idx+1}", "Shopping", item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8], item[9], item[10])

# 6. DAILY LIFE & HOME (25 items)
daily_base = [
    ("Uyanıyorum.", "Ich wache auf.", "I wake up.", "Me despierto.", "Je me réveille.", "Mi sveglio.", "Я просыпаюсь.", "目を覚まします (Me wo samashimasu)", "我醒来 (Wǒ xǐng lái)", "أستيقظ (Astayqidh)", "일어납니다 (Ireonamnida)"),
    ("Kitap okuyorum.", "Ich lese ein Buch.", "I am reading a book.", "Estoy leyendo un libro.", "Je lis un livre.", "Sto leggendo un libro.", "Я читаю книгу.", "本を読んでいます (Hon wo read-ing)", "我在看书 (Wǒ zài kànshū)", "أقرأ كتاباً (Aqra' kitaban)", "책을 읽고 있어요 (Chaegeul ilgko isseoyo)"),
    ("Müzik dinliyorum.", "Ich höre Musik.", "I listen to music.", "Escucho música.", "J'écoute de la musique.", "Ascolto la musica.", "Я слушаю музыку.", "音楽を聴いています (Ongaku wo kiite imasu)", "我在听音乐 (Wǒ zài tīng yīnyuè)", "أستمع إلى الموسيقى (Astami' ila al-musiqa)", "음악을 듣고 있어요 (Eumageul deutgo isseoyo)"),
    ("Televizyon izliyorum.", "Ich schaue Fernsehen.", "I am watching TV.", "Veo la televisión.", "Je regarde la télévision.", "Guardo la TV.", "Я смотрю телевизор.", "テレビを見ています (Terebi wo mite imasu)", "我在看电视 (Wǒ zài kàn diànshì)", "أشاهد التلفاز (Ushahid at-tilfaz)", "TV를 보고 있어요 (Televijeoneul bogo isseoyo)"),
    ("Ev", "Das Haus", "House / Home", "La casa", "La maison", "La casa", "Дом", "家 (Ie / Uchi)", "家 (Jiā)", "منزل (Manzil)", "집 (Jib)"),
    ("Bahçe", "Der Garten", "Garden", "El jardín", "Le jardin", "Il giardino", "Сад", "庭 (Nawa)", "花园 (Huāyuán)", "حديقة (Hadiqa)", "정원 (Jeongwon)"),
    ("Mutfak", "Die Küche", "Kitchen", "La cocina", "La cuisine", "La cucina", "Кухня", "台所 / キッチン (Kitchin)", "厨房 (Chúfáng)", "مطبخ (Matbakh)", "주방 (Jubang)"),
    ("Oturma odası", "Das Wohnzimmer", "Living room", "El salón", "Le salon", "Il soggiorno", "Гостиная", "居間 / リビング (Ribingu)", "客厅 (Kètīng)", "غرفة المعيشة (Ghurfat al-ma'isha)", "거실 (Geosil)"),
    ("Banyo", "Das Badezimmer", "Bathroom", "El cuarto de baño", "La salle de bain", "Il bagno", "Ванная комната", "浴室 / バスルーム (Basurūmu)", "浴室 (Yùshì)", "الحمام (Al-hammam)", "욕실 (Yoksil)"),
    ("Yatak", "Das Bett", "Bed", "La cama", "Le lit", "Il letto", "Кровать", "ベッド (Beddo)", "床 (Chuáng)", "سرير (Sarir)", "침대 (Chimdae)"),
    ("Telefon", "Das Telefon / Handy", "Phone / Smartphone", "El teléfono / móvil", "Le téléphone", "Il telefono", "Телефон", "電話 (Denwa)", "电话 (Diànhuà)", "هاتف (Hatif)", "전화기 / 스마트폰 (Jeonhwagi)"),
    ("Bilgisayar", "Der Computer", "Computer", "El ordenador / computadora", "L'ordinateur", "Il computer", "Компьютер", "パソコン (Pasokon)", "电脑 (Diànnǎo)", "حاسوب (Hasub)", "컴퓨터 (Keompyuteo)"),
    ("İnternet", "Das Internet", "Internet", "Internet", "Internet", "Internet", "Интернет", "インターネット (Intānetto)", "互联网 (Hùliánwǎng)", "إنترنت (Internet)", "인터넷 (Inteonet)"),
    ("Arkadaş", "Der Freund / Die Freundin", "Friend", "Amigo / Amiga", "Ami / Amie", "Amico / Amica", "Друг / Подруга", "友達 (Tomodachi)", "朋友 (Péngyou)", "صديق (Sadiq)", "친구 (Chingu)"),
    ("Aile", "Die Familie", "Family", "La familia", "La famille", "La famiglia", "Семья", "家族 (Kazoku)", "家庭 (Jiātíng)", "عائلة (A'ila)", "가족 (Gajok)"),
    ("Anne", "Die Mutter", "Mother / Mom", "La madre / mamá", "La mère / maman", "La madre / mamma", "Мать / Мама", "母 / お母さん (Okāsan)", "母亲 / 妈妈 (Māma)", "أم (Umm)", "어머니 / 엄마 (Eomeoni)"),
    ("Baba", "Der Vater", "Father / Dad", "El padre / papá", "Le père / papa", "Il padre / papà", "Отец / Папа", "父 / お父さん (Otōsan)", "父亲 / 爸爸 (Bàba)", "أب (Ab)", "아버지 / 아빠 (Abeoji)"),
    ("Kardeş", "Geschwister", "Brother / Sister", "Hermano / Hermana", "Frère / Sœur", "Fratello / Sorella", "Брат / Сестра", "兄弟 / 姉妹 (Kyōdai)", "兄弟姐妹 (Xiōngdì jiěmèi)", "أخ / أخت (Akh / Ukht)", "형제 / 자매 (Hyeongje)"),
    ("Kedi", "Die Katze", "Cat", "El gato", "Le chat", "Il gatto", "Кошка / Кот", "猫 (Neko)", "猫 (Māo)", "قطة (Qitta)", "고양이 (Goyangi)"),
    ("Köpek", "Der Hund", "Dog", "El perro", "Le chien", "Il cane", "Собака", "犬 (Inu)", "狗 (Gǒu)", "كلب (Kalb)", "강아지 / 개 (Gangaji)"),
    ("Hava güzel.", "Das Wetter ist schön.", "The weather is nice.", "Hace buen tiempo.", "Il fait beau.", "Fa bel tempo.", "Погода хорошая.", "天気が良いです (Tenki ga ii desu)", "天气很好 (Tiānqì hěn hǎo)", "الطقس جميل (At-taqs jamil)", "날씨가 좋아요 (Nalssiga joayo)"),
    ("Yağmur yağıyor.", "Es regnet.", "It is raining.", "Está lloviendo.", "Il pleut.", "Piove.", "Идет дождь.", "雨が降っています (Ame ga furitte imasu)", "在下雨 (Zài xià yǔ)", "إنها تمطر (Innaha tumtir)", "비가 와요 (Biga wayo)"),
    ("Kar yağıyor.", "Es schneit.", "It is snowing.", "Está nevando.", "Il neige.", "Nevica.", "Идет снег.", "雪が降っています (Yuki ga furitte imasu)", "在下雪 (Zài xià xuě)", "إنها تثلج (Innaha tuthlij)", "눈이 와요 (Nuni wayo)"),
    ("Güneşli", "Sonnig", "Sunny", "Soleado", "Ensoleillé", "Soleggiato", "Солнечно", "晴れている (Harete iru)", "晴天 (Qíngtiān)", "مشمس (Mushmis)", "화창하다 / 맑음 (Hwachanghada)"),
    ("Sıcaklık 20 derece.", "Es sind 20 Grad.", "It is 20 degrees.", "Hace 20 grados.", "Il fait 20 degrés.", "Ci sono 20 gradi.", "Сейчас 20 градусов.", "気温は20度です (Kion wa 20-do desu)", "气温20度 (Qìwēn 20 dù)", "الدرجة 20 مئوية (Ad-daraja 20 mi'awiyya)", "기온은 20도입니다 (Gioneun 20-doimnida)")
]

for idx, item in enumerate(daily_base):
    add_p(f"daily-{idx+1}", "Daily", item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8], item[9], item[10])

# 7. BUSINESS & WORK (20 items)
business_base = [
    ("Ofis", "Das Büro", "Office", "La oficina", "Le bureau", "L'ufficio", "Офис", "オフィス / 事務所 (Ofisu)", "办公室 (Bàngōngshì)", "مكتب (Maktab)", "사무실 (Samusil)"),
    ("Toplantı var.", "Wir haben ein Meeting.", "There is a meeting.", "Hay una reunión.", "Il y a une réunion.", "C'è una riunione.", "У нас совещание.", "会議があります (Kaigi ga arimasu)", "开会 (Kāihuì)", "هناك اجتماع (Hunaka ijtima')", "회의가 있습니다 (Hoeoiga isseumnida)"),
    ("E-posta gönderdim.", "Ich habe eine E-Mail geschickt.", "I sent an email.", "Envié un correo electrónico.", "J'ai envoyé un e-mail.", "Ho inviato un'e-mail.", "Я отправил письмо.", "メールを送りました (Mēru wo okurimashita)", "我发了电子邮件 (Wǒ fā le diànzǐ yóujiàn)", "أرسلت بريداً إلكترونياً (Arsaltu baridan)", "이메일을 보냈습니다 (Imeireul bonaesseumnida)"),
    ("Proje yöneticisi", "Der Projektleiter", "Project manager", "El director de proyecto", "Chef de projet", "Responsabile del progetto", "Менеджер проекта", "プロジェクトマネージャー (Purojekuto manējā)", "项目经理 (Xiàngmù jīnglǐ)", "مدير المشروع (Mudir al-mashru')", "프로젝트 매니저 (Peurojekteu maenijeo)"),
    ("Sözleşme", "Der Vertrag", "Contract / Agreement", "El contrato", "Le contrat", "Il contratto", "Договор / Контракт", "契約書 (Keiyakusho)", "合同 (Hétong)", "عقد (Aqd)", "계약서 (Gyeyakseo)"),
    ("Maaş", "Das Gehalt", "Salary", "El salario", "Le salaire", "Lo stipendio", "Зарплата", "給料 (Kyūryō)", "工资 (Gōngzī)", "راتب (Ratib)", "월급 / 연봉 (Wolgeup)"),
    ("Çalışma takvimi", "Der Arbeitsplan", "Work schedule", "Horario de trabajo", "L'emploi du temps", "Orario di lavoro", "График работы", "勤務スケジュール (Kinmu sukejūru)", "工作日程 (Gōngzuò rìchéng)", "جدول العمل (Jadwal al-'amal)", "근무 일정 (Geunmu iljeong)"),
    ("Telefon görüşmesi", "Das Telefonat", "Phone call", "Llamada telefónica", "Coup de téléphone", "Telefonata", "Телефонный звонок", "通話 / 電話 (Denwa)", "电话通话 (Diànhuà tōnghuà)", "مكالمة هاتفية (Mukalama hatifiyya)", "전화 통화 (Jeonhwa tonghwa)"),
    ("Sunum yapıyorum.", "Ich halte eine Präsentation.", "I am giving a presentation.", "Hago una presentación.", "Je fais une présentation.", "Faccio una presentazione.", "Я делаю презентацию.", "プレゼンテーションをします (Purezentēshon wo shimasu)", "我在做演示 (Wǒ zài zuò yǎnshì)", "أقدم عرضاً تقديمياً (Uqaddim 'ardan)", "발표를 하고 있습니다 (Balpyoreul hago isseoyo)"),
    ("Takım çalışması", "Die Teamarbeit", "Teamwork", "Trabajo en equipo", "Travail d'équipe", "Lavoro di squadra", "Командная работа", "チームワーク (Chīmuwāku)", "团队合作 (Tuánduì hézuò)", "عمل جماعي (Amal jama'i)", "팀워크 (Timveokeu)"),
    ("Rapor hazırlamak", "Einen Bericht schreiben", "Prepare a report", "Preparar un informe", "Préparer un rapport", "Preparare un rapporto", "Подготовить отчет", "レポートを作成する (Repōto wo sakusei suru)", "准备报告 (Zhǔnbèi bàogào)", "إعداد تقرير (I'dad taqrir)", "보고서를 작성하다 (Bogoseoreul jakseonghada)"),
    ("Son teslim तारीख (Deadline)", "Die Frist / Deadline", "Deadline", "Fecha límite", "Date limite", "Scadenza", "Срок выполнения", "締切 (Shimekiri)", "截止日期 (Jiézhǐ rìqī)", "الموعد النهائي (Al-maw'id an-nihai)", "마감 기한 (Magam gihan)"),
    ("Şirket", "Die Firma / Das Unternehmen", "Company / Corporation", "La empresa", "L'entreprise", "L'azienda", "Компания / Фирма", "会社 (Kaisha)", "公司 (Gōngsī)", "شركة (Sharika)", "회사 / 기업 (Hoesa)"),
    ("Kartvizit", "Die Visitenkarte", "Business card", "La tarjeta de visita", "Carte de visite", "Biglietto da visita", "Визитка", "名刺 (Meishi)", "名片 (Míngpiàn)", "بطاقة عمل (Bitaqat 'amal)", "명함 (Myeongham)"),
    ("Başarılar dilerim!", "Viel Erfolg!", "Wish you success!", "¡Mucho éxito!", "Plein de succès !", "Buon successo!", "Желаю успеха!", "成功を祈ります (Seikō wo inorimasu)", "祝你成功 (Zhù nǐ chénggōng)", "أتمنى لك النجاح (Atamanna laka an-najah)", "성공을 빕니다 (Seonggongeul bimnida)"),
    ("İş görüşmesi", "Das Vorstellungsgespräch", "Job interview", "Entrevista de trabajo", "Entretien d'embauche", "Colloquio di lavoro", "Собеседование", "面接 (Mensetsu)", "求职面试 (Qiúzhí miànshì)", "مقابلة عمل (Muqabalat 'amal)", "면접 (Myeonjeop)"),
    ("Terfi aldım.", "Ich wurde befördert.", "I got a promotion.", "Me han ascendido.", "J'ai été promu.", "Sono stato promosso.", "Меня повысили.", "昇進しました (Shōshin shimashita)", "我升职了 (Wǒ shēngzhí le)", "حصلت على ترقية (Hasaltu 'ala tarqiya)", "승진했습니다 (Seungjinhaesseumnida)"),
    ("Strateji", "Die Strategie", "Strategy", "La estrategia", "La stratégie", "La strategia", "Стратегия", "戦略 (Senryaku)", "战略 (Zhànlüè)", "استراتيجية (Istratijiyya)", "전략 (Jeonryak)"),
    ("Müşteri memnuniyeti", "Die Kundenzufriedenheit", "Customer satisfaction", "Satisfacción del cliente", "Satisfaction du client", "Soddisfazione del cliente", "Удовлетворенность клиентов", "顧客満足度 (Kokyaku manzokudo)", "客户满意度 (Kèhù mǎnyìdù)", "رضا العملاء (Rida al-'umala')", "고객 만족도 (Gogaek manjokdo)"),
    ("Mesai saatleri", "Die Arbeitszeiten", "Working hours", "Horario laboral", "Heures de travail", "Orario lavorativo", "Рабочие часы", "営業時間 / 勤務時間 (Kinmu jikan)", "工作时间 (Gōngzuò shíjiān)", "ساعات العمل (Sa'at al-'amal)", "근무 시간 (Geunmu sigan)")
]

for idx, item in enumerate(business_base):
    add_p(f"business-{idx+1}", "Business", item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8], item[9], item[10])

# 8. EMERGENCY & HEALTH (15 items)
emergency_base = [
    ("İmdat! Yardım edin!", "Hilfe!", "Help!", "¡Ayuda!", "Au secours !", "Aiuto!", "Помогите!", "助けて！ (Tasukete!)", "救命！ (Jiùmìng!)", "النجدة! (An-najda!)", "도와주세요! (Dowajusil su innayo!)"),
    ("Polis çağırın!", "Rufen Sie die Polizei!", "Call the police!", "¡Llame a la policía!", "Appelez la police !", "Chiami la polizia!", "Вызовите полицию!", "警察を呼んでください！ (Keisatsu wo yonde kudasai!)", "叫警察！ (Jiào jǐngchá!)", "اتصل بالشرطة! (Ittasil bish-shurta!)", "경찰을 불러주세요! (Gyeongchareul bulleojuseyo!)"),
    ("Ambulans çağırın!", "Rufen Sie einen Krankenwagen!", "Call an ambulance!", "¡Llame a una ambulancia!", "Appelez une ambulance !", "Chiami un'ambulanza!", "Вызовите скорую!", "救急車を呼んでください！ (Kyūkyūsha wo yonde kudasai!)", "叫救护车！ (Jiào jiùhùchē!)", "اتصل بالإسعاف! (Ittasil bil-is'af!)", "구급차를 불러주세요! (Gugeupchareul bulleojuseyo!)"),
    ("Doktora ihtiyacım var.", "Ich brauche einen Arzt.", "I need a doctor.", "Necesito un médico.", "J'ai besoin d'un médecin.", "Ho bisogno di un medico.", "Мне нужен врач.", "医者が必要です (Isha ga hitsuyō desu)", "我需要看医生 (Wǒ xūyào kàn yīshēng)", "أحتاج إلى طبيب (Ahtaju ila tabib)", "의사가 필요해요 (Uisaga pillyohaeyo)"),
    ("Hastane nerede?", "Wo ist das Krankenhaus?", "Where is the hospital?", "¿Dónde está el hospital?", "Où est l'hôpital ?", "Dov'è l'ospedale?", "Где больница?", "病院はどこですか？ (Byōin wa doko desu ka?)", "医院在哪里？ (Yīyuàn zài nǎlǐ?)", "أين المستشفى؟ (Ayna al-mustashfa?)", "병원이 어디예요? (Byeongwoni eodiyeyo?)"),
    ("Hastayım.", "Ich bin krank.", "I am sick / ill.", "Estoy enfermo.", "Je suis malade.", "Sono malato.", "Я болен.", "病気です (Byōki desu)", "我生病了 (Wǒ shēngbìng le)", "أنا مريض (Ana maridh)", "아파요 (Apayo)"),
    ("Ateşim var.", "Ich habe Fieber.", "I have a fever.", "Tengo fiebre.", "J'ai de la fièvre.", "Ho la febbre.", "У меня температура.", "熱があります (Netsu ga arimasu)", "我发烧了 (Wǒ fāshāo le)", "عندي حمى (Indi humma)", "열이 나요 (Yeori nayo)"),
    ("Başım ağrıyor.", "Ich habe Kopfschmerzen.", "I have a headache.", "Me duele la cabeza.", "J'ai mal à la tête.", "Ho mal di testa.", "У меня болит голова.", "頭が痛いです (Atama ga itai desu)", "我头痛 (Wǒ tóutòng)", "رأسي يؤلمني (Ra'si yu'limuni)", "머리가 아파요 (Meoriga apayo)"),
    ("İlaç", "Die Medizin / Das Medikament", "Medicine / Drug", "La medicina", "Le médicament", "La medicina", "Лекарство", "薬 (Kusuri)", "药 (Yào)", "دواء (Dawa')", "약 (Yak)"),
    ("Tehlike", "Die Gefahr", "Danger", "El peligro", "Le danger", "Il pericolo", "Опасность", "危険 (Kiken)", "危险 (Wēixiǎn)", "خطر (Khatar)", "위험 (Wiheom)"),
    ("Yangın var!", "Es brennt! / Feuer!", "Fire!", "¡Fuego!", "Au feu !", "Fuoco!", "Пожар!", "火事だ！ (Kaji da!)", "着火了！ (Zháo huǒ le!)", "حريق! (Hariq!)", "불이야! (Buriya!)"),
    ("Dikkatli olun!", "Passen Sie auf!", "Be careful!", "¡Tenga cuidado!", "Faites attention !", "Faccia attenzione!", "Будьте осторожны!", "気をつけてください (Ki wo tsukete kudasai)", "小心中 (Xiǎoxīn)", "احترس! (Ihtaris!)", "조심하세요! (Josimhaseyo!)"),
    ("Pasaportumu kaybettim.", "Ich habe meinen Pass verloren.", "I lost my passport.", "He perdido mi pasaporte.", "J'ai perdu mon passeport.", "Ho perso il mio passaporto.", "Я потерял паспорт.", "パスポートをなくしました (Pasupōto wo nakushimashita)", "我丢了护照 (Wǒ diū le hùzhào)", "فقدت جواز سفري (Faqadtu jawaz safari)", "여권을 잃어버렸어요 (Yeogwoneul ireoboreosseoyo)"),
    ("Acil çıkış", "Der Notausgang", "Emergency exit", "La salida de emergencia", "La sortie de secours", "La uscita di emergenza", "Запасный выход", "非常口 (Hijōguchi)", "紧急出口 (Jǐnjí chūkǒu)", "مخرج الطوارئ (Makhraj at-tawari')", "비상구 (Bisanggu)"),
    ("Alerjim var.", "Ich habe eine Allergie.", "I have an allergy.", "Tengo alergia.", "J'ai une allergie.", "Ho un'allergia.", "У меня аллергия.", "アレルギーがあります (Arergī ga arimasu)", "我过敏 (Wǒ guòmǐn)", "لدي حساسية (Ladayya hasasiyya)", "알레르기가 있어요 (Allereugiga isseoyo)")
]

for idx, item in enumerate(emergency_base):
    add_p(f"emergency-{idx+1}", "Emergency", item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8], item[9], item[10])

print(f"Total phrases generated: {len(phrases_list)}")

# Now generate code string for universalPhrases array
phrases_js = json.dumps(phrases_list, ensure_ascii=False, indent=2)

generator_function = '''
export const universalPhrases: UniversalPhrase[] = ''' + phrases_js + ''';

/**
 * Universal Generator: Builds dynamic questions from ANY Source Native Language
 * to ANY Target Language being learned!
 */
export function generatePairQuestions(
  nativeLangId: string,
  targetLangId: string,
  categoryFilter = 'ALL'
): StandardQuestion[] {
  const targetInfo = supportedLanguages.find(l => l.id === targetLangId) || supportedLanguages[1];
  const nativeInfo = supportedLanguages.find(l => l.id === nativeLangId) || supportedLanguages[0];

  let phrases = universalPhrases;
  if (categoryFilter !== 'ALL') {
    phrases = phrases.filter(p => p.category === categoryFilter);
  }

  return phrases.map((phrase, idx) => {
    const nativePromptText = phrase.phrases[nativeLangId] || phrase.phrases['english'] || phrase.phrases['turkish'];
    const targetTranslation = phrase.phrases[targetLangId] || phrase.phrases['german'];
    const categoryName = phrase.categoryTitles[nativeLangId] || phrase.categoryTitles['english'] || phrase.categoryTitles['turkish'];
    const explanation = phrase.explanations[nativeLangId] || phrase.explanations['english'] || phrase.explanations['turkish'];
    const phonetic = phrase.phonetics?.[targetLangId];
    const targetDistractors = phrase.distractors[targetLangId] || phrase.distractors['german'] || ['Option A', 'Option B', 'Option C'];

    // Shuffle options: correct answer + 3 distractors
    const allOptions = [targetTranslation, ...targetDistractors.slice(0, 3)];
    // Deterministic pseudo-shuffle based on index
    const shuffledOptions = [...allOptions].sort((a, b) => {
      const charA = a.charCodeAt(0) || 0;
      const charB = b.charCodeAt(0) || 0;
      return (charA + idx) % 2 === 0 ? 1 : -1;
    });

    return {
      id: `${nativeLangId}-${targetLangId}-${phrase.id}`,
      category: phrase.category,
      categoryName,
      nativePromptText,
      targetTranslation,
      phonetic,
      options: shuffledOptions,
      explanation,
      targetSpeechLang: targetInfo.speechLang
    };
  });
}
'''

full_file_content = ts_header + "\n" + generator_function

with open("src/data/tenLanguagesData.ts", "w", encoding="utf-8") as f:
    f.write(full_file_content)

print("tenLanguagesData.ts written successfully with 200 items!")
