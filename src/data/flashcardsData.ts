import { Flashcard, FlashcardCategory } from '../types';
import { A1_FLASHCARDS_DATA } from './a1FlashcardsData';

export const FLASHCARD_CATEGORIES: FlashcardCategory[] = [
  {
    id: 'all',
    nameTr: 'Tüm Kartlar',
    iconName: 'Sparkles',
    description: 'Bütün kategorilerdeki %100 doğrulanmış resimli kelime kartları',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'emotions',
    nameTr: 'A1 Temel & İletişim',
    iconName: 'MessageCircle',
    description: 'A1 selamlaşma, lütfen, teşekkürler ve renkler',
    color: 'from-amber-500 to-yellow-500'
  },
  {
    id: 'family',
    nameTr: 'A1 Aile & İnsanlar',
    iconName: 'Users',
    description: 'Anne, baba, arkadaş ve aile üyeleri',
    color: 'from-rose-500 to-pink-500'
  },
  {
    id: 'food',
    nameTr: 'Yiyecek & İçecek',
    iconName: 'Utensils',
    description: 'Meyveler, sebzeler, temel gıdalar ve çay/kahve/su',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'animals',
    nameTr: 'Hayvanlar Dünyası',
    iconName: 'Dog',
    description: 'Evcil hayvanlar, kaz, kedi, köpek ve dostlar',
    color: 'from-amber-500 to-yellow-500'
  },
  {
    id: 'travel',
    nameTr: 'Şehir & Seyahat',
    iconName: 'Plane',
    description: 'Ulaşım araçları, araba, uçak, havalimanı ve seyahat',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'home',
    nameTr: 'Ev & Eşyalar',
    iconName: 'Home',
    description: 'Ev, masa, kitap, bilgisayar ve günlük yaşam nesneleri',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'nature',
    nameTr: 'Doğa & Çiçekler',
    iconName: 'Trees',
    description: 'Gül, güneş, dağlar, denizler ve mevsimler',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'professions',
    nameTr: 'Meslekler & İnsan',
    iconName: 'Briefcase',
    description: 'Doktor, yüz, meslekler ve insan özellikleri',
    color: 'from-rose-500 to-pink-500'
  },
  {
    id: 'clothing',
    nameTr: 'Giyim & Aksesuar',
    iconName: 'Shirt',
    description: 'Kıyafetler, gömlek, ayakkabılar ve aksesuarlar',
    color: 'from-fuchsia-500 to-purple-600'
  }
];

export const FLASHCARDS_DATA: Flashcard[] = [
  // --- A1 BAŞLANGIÇ KELİMELERİ (Gül, Çay, Kaz, Yüz, Ev, Kedi, Köpek, Araba, Elma dahil) ---
  ...A1_FLASHCARDS_DATA,

  // --- 1. YİYECEK & İÇECEK ---
  {
    id: 'food_coffee',
    category: 'food',
    categoryNameTr: 'Yiyecek & İçecek',
    turkishMeaning: 'Kahve',
    word: 'Der Kaffee',
    translation: 'Kahve',
    level: 'A1',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    imageSearchQuery: 'hot ceramic cup of coffee with steam coffee beans latte art',
    imageDescription: 'A ceramic cup filled with hot freshly brewed coffee and roasted beans',
    verified: true,
    verificationNote: 'Görsel doğrudan sıcak kahve içeceğini %100 temsil etmektedir.',
    disambiguation: 'Sıcak kahve içeceği',
    translations: {
      de: { word: 'Der Kaffee', phonetic: '[der kaf-fe]', article: 'der', exampleSentence: 'Ich trinke morgens gerne heißen Kaffee.', exampleSentenceTr: 'Sabahları sıcak kahve içmeyi severim.' },
      en: { word: 'The Coffee', phonetic: '[dı ko-fi]', article: 'the', exampleSentence: 'I drink a cup of coffee every morning.', exampleSentenceTr: 'Her sabah bir fincan kahve içerim.' },
      es: { word: 'El café', phonetic: '[el ka-fe]', article: 'el', exampleSentence: 'Quiero un café con leche, por favor.', exampleSentenceTr: 'Sütlü bir kahve istiyorum lütfen.' },
      fr: { word: 'Le café', phonetic: '[lö ka-fe]', article: 'le', exampleSentence: 'Un café noir sans sucre, s’il vous plaît.', exampleSentenceTr: 'Şekersiz sade bir kahve lütfen.' },
      it: { word: 'Il caffè', phonetic: '[il kaf-fe]', article: 'il', exampleSentence: 'Prendo un caffè espresso al bar.', exampleSentenceTr: 'Barda bir espresso kahve alıyorum.' },
      ru: { word: 'Кофе (Kofe)', phonetic: '[ko-fye]', exampleSentence: 'Я пью горячий кофе с утра.', exampleSentenceTr: 'Sabahları sıcak kahve içerim.' },
      ja: { word: 'コーヒー (Kōhī)', phonetic: '[koo-hii]', exampleSentence: '毎朝温かいコーヒーを飲みます。', exampleSentenceTr: 'Her sabah sıcak kahve içerim.' },
      ko: { word: '커피 (Keopi)', phonetic: '[ko-pi]', exampleSentence: '따뜻한 아메리카노 커피 한 잔 주세요.', exampleSentenceTr: 'Sıcak bir americano kahve lütfen.' },
      zh: { word: '咖啡 (Kāfēi)', phonetic: '[ka-fey]', exampleSentence: '我喜欢早上喝一杯浓咖啡。', exampleSentenceTr: 'Sabahları bir fincan koyu kahve içmeyi severim.' },
      ar: { word: 'قهوة (Qahwa)', phonetic: '[qah-va]', exampleSentence: 'أفضل شرب القهوة العربية مع الهيل.', exampleSentenceTr: 'Kakuleli Arap kahvesi içmeyi tercih ederim.' },
      pt: { word: 'O café', phonetic: '[u ka-fe]', article: 'o', exampleSentence: 'Tomo um café expresso pela manhã.', exampleSentenceTr: 'Sabahleyin bir espresso kahve içerim.' },
      nl: { word: 'De koffie', phonetic: '[de kof-fi]', article: 'de', exampleSentence: 'Wil je een kopje zwarte koffie?', exampleSentenceTr: 'Bir fincan sade kahve ister misin?' },
      el: { word: 'Ο καφές (O kafes)', phonetic: '[o ka-fes]', article: 'ο', exampleSentence: 'Πίνω έναν ζεστό ελληνικό καφέ.', exampleSentenceTr: 'Sıcak bir Yunan kahvesi içiyorum.' },
      hi: { word: 'कॉफ़ी (Coffee)', phonetic: '[ko-fi]', exampleSentence: 'मुझे गर्म कॉफ़ी पीना पसंद है।', exampleSentenceTr: 'Sıcak kahve içmeyi severim.' },
      sv: { word: 'Kaffet', phonetic: '[kaf-fet]', article: 'ett', exampleSentence: 'Vill du ha en kopp varmt kaffe?', exampleSentenceTr: 'Bir fincan sıcak kahve ister misin?' },
      tr: { word: 'Kahve', phonetic: '[kah-ve]', exampleSentence: 'Bir fincan sıcak Türk kahvesi güne başlamak için harikadır.', exampleSentenceTr: 'Bir fincan sıcak Türk kahvesi güne başlamak için harikadır.' }
    }
  },

  // --- 2. HAYVANLAR DÜNYASI ---
  {
    id: 'animal_cat',
    category: 'animals',
    categoryNameTr: 'Hayvanlar Dünyası',
    turkishMeaning: 'Kedi',
    word: 'Die Katze',
    translation: 'Kedi (Hayvan)',
    level: 'A1',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    imageSearchQuery: 'cute domestic cat pet looking directly at camera sharp focus',
    imageDescription: 'A lovely domestic cat pet with expressive green eyes looking directly forward',
    verified: true,
    verificationNote: 'Görsel doğrudan evcil kediyi %100 temsil etmektedir.',
    disambiguation: 'Evcil kedi hayvanı',
    translations: {
      de: { word: 'Die Katze', phonetic: '[di kat-tsı]', article: 'die', exampleSentence: 'Die kleine Katze schläft friedlich auf dem Sofa.', exampleSentenceTr: 'Küçük kedi kanepede huzurla uyuyor.' },
      en: { word: 'The Cat', phonetic: '[dı ket]', article: 'the', exampleSentence: 'The curious cat explores the sunny garden.', exampleSentenceTr: 'Meraklı kedi güneşli bahçeyi keşfediyor.' },
      es: { word: 'El gato / La gata', phonetic: '[el ga-to]', article: 'el', exampleSentence: 'El gato juega con una pelota de lana.', exampleSentenceTr: 'Kedi bir yün yumağıyla oynuyor.' },
      fr: { word: 'Le chat', phonetic: '[lö şa]', article: 'le', exampleSentence: 'Le chat miaule doucement près de la porte.', exampleSentenceTr: 'Kedi kapının yanında sessizce miyavlıyor.' },
      it: { word: 'Il gatto', phonetic: '[il gat-to]', article: 'il', exampleSentence: 'Il gatto fa le fusa quando lo accarezzi.', exampleSentenceTr: 'Kedi okşandığında mırlar.' },
      ru: { word: 'Кошка / Кот (Koshka)', phonetic: '[koş-ka]', exampleSentence: 'Пушистая кошка греется на солнышке.', exampleSentenceTr: 'Tüylü kedi güneşte ısınıyor.' },
      ja: { word: '猫 (Neko)', phonetic: '[ne-ko]', exampleSentence: '可愛い猫が日向ぼっこをしています。', exampleSentenceTr: 'Sevimli kedi güneşleniyor.' },
      ko: { word: '고양이 (Goyangi)', phonetic: '[go-yan-gi]', exampleSentence: '귀여운 고양이가 낮잠을 자고 있어요.', exampleSentenceTr: 'Sevimli kedi kestiriyor.' },
      zh: { word: '猫 (Māo)', phonetic: '[mao]', exampleSentence: '那只小黑猫正在专注地抓蝴蝶。', exampleSentenceTr: 'O küçük kara kedi pürdikkat kelebek yakalıyor.' },
      ar: { word: 'قطة / هر (Qittah)', phonetic: '[qit-ta]', exampleSentence: 'القطة اللطيفة تنام بهدوء في ركن الغرفة.', exampleSentenceTr: 'Sevimli kedi odanın köşesinde sakince uyuyor.' },
      pt: { word: 'O gato', phonetic: '[u ga-tu]', article: 'o', exampleSentence: 'O gato adora subir nas árvores do quintal.', exampleSentenceTr: 'Kedi bahçedeki ağaçlara tırmanmayı sever.' },
      nl: { word: 'De kat', phonetic: '[de kat]', article: 'de', exampleSentence: 'De speelse kat rent achter een muis aan.', exampleSentenceTr: 'Oyuncu kedi bir farenin peşinden koşuyor.' },
      el: { word: 'Η γάτα (I gata)', phonetic: '[i ga-ta]', article: 'η', exampleSentence: 'Η γάτα κοιμάται κάτω από τον ζεστό ήλιο.', exampleSentenceTr: 'Kedi sıcak güneşin altında uyuyor.' },
      hi: { word: 'बिल्ली (Billi)', phonetic: '[bil-li]', exampleSentence: 'सफेद बिल्ली बहुत प्यारी और चुलबुली है।', exampleSentenceTr: 'Beyaz kedi çok sevimli ve hareketlidir.' },
      sv: { word: 'Katten', phonetic: '[kat-ten]', article: 'en', exampleSentence: 'Katten sitter uppe på staketet.', exampleSentenceTr: 'Kedi çitin üzerinde oturuyor.' },
      tr: { word: 'Kedi', phonetic: '[ke-di]', exampleSentence: 'Sokak kedisi sıcak güneşin altında keyifle mırıldanıyordu.', exampleSentenceTr: 'Sokak kedisi sıcak güneşin altında keyifle mırıldanıyordu.' }
    }
  },
  {
    id: 'animal_dog',
    category: 'animals',
    categoryNameTr: 'Hayvanlar Dünyası',
    turkishMeaning: 'Köpek',
    word: 'Der Hund',
    translation: 'Köpek (Hayvan)',
    level: 'A1',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    imageSearchQuery: 'friendly domestic dog pet smiling golden retriever alert sitting grass',
    imageDescription: 'A friendly loyal domestic pet dog sitting alertly on green grass',
    verified: true,
    verificationNote: 'Görsel doğrudan sadık evcil köpeği %100 temsil etmektedir.',
    disambiguation: 'Evcil köpek hayvanı',
    translations: {
      de: { word: 'Der Hund', phonetic: '[der hunt]', article: 'der', exampleSentence: 'Der treue Hund wedelt freudig mit dem Schwanz.', exampleSentenceTr: 'Sadık köpek neşeyle kuyruğunu sallıyor.' },
      en: { word: 'The Dog', phonetic: '[dı dog]', article: 'the', exampleSentence: 'Dogs are known as human’s best and most loyal friends.', exampleSentenceTr: 'Köpekler insanın en iyi ve sadık dostu olarak bilinir.' },
      es: { word: 'El perro', phonetic: '[el per-ro]', article: 'el', exampleSentence: 'El perro corre feliz por el parque verde.', exampleSentenceTr: 'Köpek yeşil parkta mutlulukla koşuyor.' },
      fr: { word: 'Le chien', phonetic: '[lö şyen]', article: 'le', exampleSentence: 'Le chien garde la maison avec beaucoup de fidélité.', exampleSentenceTr: 'Köpek evi büyük bir sadakatle koruyor.' },
      it: { word: 'Il cane', phonetic: '[il ka-ne]', article: 'il', exampleSentence: 'Porto il cane a fare una lunga passeggiata.', exampleSentenceTr: 'Köpeği uzun bir yürüyüşe çıkarıyorum.' },
      ru: { word: 'Собака (Sobaka)', phonetic: '[sa-ba-ka]', exampleSentence: 'Верная собака всегда радостно встречает хозяина.', exampleSentenceTr: 'Sadık köpek her zaman sahibini neşeyle karşılar.' },
      ja: { word: '犬 (Inu)', phonetic: '[i-nu]', exampleSentence: '公園で元気な犬と楽しく散歩します。', exampleSentenceTr: 'Parkta enerjik köpeğimle keyifle yürüyüş yapıyorum.' },
      ko: { word: '개 / 강아지 (Gae / Gang-aji)', phonetic: '[ge / gang-a-ji]', exampleSentence: '강아지가 꼬리를 흔들며 반갑게 맞이해요.', exampleSentenceTr: 'Yavru köpek kuyruğunu sallayarak sevinçle karşılıyor.' },
      zh: { word: '狗 (Gǒu)', phonetic: '[gou]', exampleSentence: '忠诚的狗是人类最好的忠实伙伴。', exampleSentenceTr: 'Sadık köpek insanın en iyi dostudur.' },
      ar: { word: 'كلب (Kalb)', phonetic: '[kelb]', exampleSentence: 'الكلب الوفي يحرس البيت بإخلاص شديد.', exampleSentenceTr: 'Sadık köpek evi büyük bir bağlılıkla korur.' },
      pt: { word: 'O cão / O cachorro', phonetic: '[u ka-şor-ru]', article: 'o', exampleSentence: 'O cachorro adora correr atrás da bola.', exampleSentenceTr: 'Köpek topun peşinden koşmayı sever.' },
      nl: { word: 'De hond', phonetic: '[de hont]', article: 'de', exampleSentence: 'De lieve hond blaft vrolijk naar de buren.', exampleSentenceTr: 'Sevimli köpek komşulara neşeyle havlıyor.' },
      el: { word: 'Ο σκύλος (O skylos)', phonetic: '[o ski-los]', article: 'ο', exampleSentence: 'Ο πιστός σκύλος περιμένει στην πόρτα.', exampleSentenceTr: 'Sadık köpek kapıda bekliyor.' },
      hi: { word: 'कुत्ता (Kutta)', phonetic: '[kut-ta]', exampleSentence: 'वफादार कुत्ता हमेशा हमारे साथ रहता है।', exampleSentenceTr: 'Sadık köpek her zaman bizimle kalır.' },
      sv: { word: 'Hunden', phonetic: '[hün-den]', article: 'en', exampleSentence: 'Hunden springer snabbt över gräsmattan.', exampleSentenceTr: 'Köpek çimlerin üzerinde hızlıca koşuyor.' },
      tr: { word: 'Köpek', phonetic: '[kö-pek]', exampleSentence: 'Sadık dostumuz köpek sabah yürüyüşünde neşeyle yanımızda koşuyordu.', exampleSentenceTr: 'Sadık dostumuz köpek sabah yürüyüşünde neşeyle yanımızda koşuyordu.' }
    }
  },

  // --- 3. ŞEHİR & SEYAHAT ---
  {
    id: 'travel_airplane',
    category: 'travel',
    categoryNameTr: 'Şehir & Seyahat',
    turkishMeaning: 'Uçak',
    word: 'Das Flugzeug',
    translation: 'Uçak (Hava Aracı)',
    level: 'A1',
    imageUrl: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80',
    imageSearchQuery: 'commercial passenger airplane flying in blue sky wings contrails',
    imageDescription: 'A commercial passenger airplane cruising in the clear blue sky',
    verified: true,
    verificationNote: 'Görsel doğrudan ticari yolcu uçağını %100 temsil etmektedir.',
    disambiguation: 'Yolcu uçağı hava taşıtı',
    translations: {
      de: { word: 'Das Flugzeug', phonetic: '[das fluk-tsoyk]', article: 'das', exampleSentence: 'Das moderne Flugzeug landet pünktlich in Frankfurt.', exampleSentenceTr: 'Modern uçak Frankfurt’a tam vaktinde iniş yapıyor.' },
      en: { word: 'The Airplane', phonetic: '[dı eyr-pleyn]', article: 'the', exampleSentence: 'The airplane flew high above the white clouds.', exampleSentenceTr: 'Uçak beyaz bulutların çok üzerinde uçtu.' },
      es: { word: 'El avión', phonetic: '[el a-vyon]', article: 'el', exampleSentence: 'Tomamos el avión para viajar a Madrid.', exampleSentenceTr: 'Madrid’e seyahat etmek için uçağa biniyoruz.' },
      fr: { word: 'L’avion', phonetic: '[la-vyon]', article: 'l’', exampleSentence: 'L’avion décolle de la piste avec rapidité.', exampleSentenceTr: 'Uçak pistten hızla havalanıyor.' },
      it: { word: 'L’aereo', phonetic: '[la-e-reo]', article: 'l’', exampleSentence: 'Saliamo sull’aereo diretti a Roma.', exampleSentenceTr: 'Roma’ya giden uçağa biniyoruz.' },
      ru: { word: 'Самолет (Samolet)', phonetic: '[sa-ma-lyot]', exampleSentence: 'Самолет быстро набирает высоту в небе.', exampleSentenceTr: 'Uçak gökyüzünde hızla irtifa kazanıyor.' },
      ja: { word: '飛行機 (Hikōki)', phonetic: '[hi-koo-ki]', exampleSentence: '飛行機でベルリンへ旅行に行きます。', exampleSentenceTr: 'Uçakla Berlin’e seyahate gidiyorum.' },
      ko: { word: '비행기 (Bihaenggi)', phonetic: '[bi-heng-gi]', exampleSentence: '비행기를 타고 유럽으로 여행을 떠나요.', exampleSentenceTr: 'Uçağa binip Avrupa’ya seyahate çıkıyorum.' },
      zh: { word: '飞机 (Fēijī)', phonetic: '[fey-ci]', exampleSentence: '客机在蓝天白云之间平稳地飞行。', exampleSentenceTr: 'Yolcu uçağı mavi gökyüzü ve bulutlar arasında süzülüyor.' },
      ar: { word: 'طائرة (Ta’irah)', phonetic: '[ta-i-ra]', exampleSentence: 'أقلعت الطائرة في موعدها المحدد تماماً.', exampleSentenceTr: 'Uçak tam belirlenen saatinde havalandı.' },
      pt: { word: 'O avião', phonetic: '[u a-vi-aon]', article: 'o', exampleSentence: 'O avião aterrissa suavemente na pista.', exampleSentenceTr: 'Uçak piste yumuşakça iniş yapıyor.' },
      nl: { word: 'Het vliegtuig', phonetic: '[het fliih-töyh]', article: 'het', exampleSentence: 'Het vliegtuig vertrekt vanaf Schiphol.', exampleSentenceTr: 'Uçak Schiphol havalimanından kalkıyor.' },
      el: { word: 'Το αεροπλάνο (To aeroplano)', phonetic: '[to a-e-ro-pla-no]', article: 'το', exampleSentence: 'Το αεροπλάνο πετάει πάνω από τα νησιά.', exampleSentenceTr: 'Uçak adaların üzerinde uçuyor.' },
      hi: { word: 'हवाई जहाज़ (Hawaai Jahaaz)', phonetic: '[ha-va-ee ja-haaz]', exampleSentence: 'हवाई जहाज़ आसमान में बहुत ऊँचा उड़ रहा है।', exampleSentenceTr: 'Uçak gökyüzünde çok yüksekten uçuyor.' },
      sv: { word: 'Flygplanet', phonetic: '[flüg-pla-net]', article: 'ett', exampleSentence: 'Flygplanet lyfter i soluppgången.', exampleSentenceTr: 'Uçak gün doğumunda kalkış yapıyor.' },
      tr: { word: 'Uçak', phonetic: '[u-çak]', exampleSentence: 'Yurt dışı seyahatlerinde hızlı ve konforlu ulaşım için uçağı tercih ederiz.', exampleSentenceTr: 'Yurt dışı seyahatlerinde hızlı ve konforlu ulaşım için uçağı tercih ederiz.' }
    }
  },
  {
    id: 'travel_car',
    category: 'travel',
    categoryNameTr: 'Şehir & Seyahat',
    turkishMeaning: 'Araba',
    word: 'Das Auto',
    translation: 'Araba (Otomobil)',
    level: 'A1',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    imageSearchQuery: 'modern passenger automobile car sleek vehicle road side view',
    imageDescription: 'A sleek modern passenger car automobile parked on clean pavement',
    verified: true,
    verificationNote: 'Görsel doğrudan modern binek otomobili %100 temsil etmektedir.',
    disambiguation: 'Binek otomobil / araba aracı',
    translations: {
      de: { word: 'Das Auto', phonetic: '[das aw-to]', article: 'das', exampleSentence: 'Er fährt jeden Tag mit dem Auto zur Arbeit.', exampleSentenceTr: 'Her gün arabayla işe gider.' },
      en: { word: 'The Car', phonetic: '[dı kar]', article: 'the', exampleSentence: 'We drive a clean and comfortable car.', exampleSentenceTr: 'Temiz ve konforlu bir araba sürüyoruz.' },
      es: { word: 'El coche / auto', phonetic: '[el ko-çe]', article: 'el', exampleSentence: 'El coche rojo está aparcado frente a la casa.', exampleSentenceTr: 'Kırmızı araba evin önüne park edilmiş.' },
      fr: { word: 'La voiture', phonetic: '[la vwa-tür]', article: 'la', exampleSentence: 'Elle conduit une voiture électrique moderne.', exampleSentenceTr: 'O, modern bir elektrikli araba sürüyor.' },
      it: { word: 'L’auto / La macchina', phonetic: '[mak-ki-na]', article: 'la', exampleSentence: 'Mio fratello ha comprato una nuova auto.', exampleSentenceTr: 'Kardeşim yeni bir araba satın aldı.' },
      ru: { word: 'Машина / Автомобиль (Mashina)', phonetic: '[ma-şı-na]', exampleSentence: 'Новый автомобиль плавно едет по трассе.', exampleSentenceTr: 'Yeni araba otoyolda akıcı bir şekilde gidiyor.' },
      ja: { word: '車 / 自動車 (Kuruma)', phonetic: '[ku-ru-ma]', exampleSentence: '週末に家族と車でドライブに出かけます。', exampleSentenceTr: 'Hafta sonu ailemle arabayla gezmeye çıkarım.' },
      ko: { word: '자동차 / 차 (Jadongcha)', phonetic: '[ca-dong-ça]', exampleSentence: '새 자동차를 타고 드라이브를 가요.', exampleSentenceTr: 'Yeni arabaya binip sürüşe çıkıyorum.' },
      zh: { word: '汽车 (Qìchē)', phonetic: '[çi-çı]', exampleSentence: '这辆黑色的汽车非常省油环保。', exampleSentenceTr: 'Bu siyah araba çok tasarruflu ve çevre dostu.' },
      ar: { word: 'سيارة (Sayyarah)', phonetic: '[sey-ya-ra]', exampleSentence: 'السيارة وسيلة نقل سريعة ومريحة في المدينة.', exampleSentenceTr: 'Araba şehirde hızlı ve konforlu bir ulaşım aracıdır.' },
      pt: { word: 'O carro', phonetic: '[u kar-ru]', article: 'o', exampleSentence: 'Gosto de dirigir o meu carro na estrada.', exampleSentenceTr: 'Yolda arabamı sürmeyi severim.' },
      nl: { word: 'De auto', phonetic: '[de ow-to]', article: 'de', exampleSentence: 'De elektrische auto is heel stil.', exampleSentenceTr: 'Elektrikli araba oldukça sessizdir.' },
      el: { word: 'Το αυτοκίνητο (To aftokinito)', phonetic: '[to af-to-ki-ni-to]', article: 'το', exampleSentence: 'Το καινούργιο αυτοκίνητο είναι πολύ ασφαλές.', exampleSentenceTr: 'Yeni araba oldukça güvenlidir.' },
      hi: { word: 'गाड़ी / कार (Gaadi)', phonetic: '[gaa-di]', exampleSentence: 'हम कार से लंबी यात्रा पर जा रहे हैं।', exampleSentenceTr: 'Arabayla uzun bir seyahate çıkıyoruz.' },
      sv: { word: 'Bilen', phonetic: '[bii-len]', article: 'en', exampleSentence: 'Bilen står parkerad utanför garaget.', exampleSentenceTr: 'Araba garajın önünde park halinde.' },
      tr: { word: 'Araba', phonetic: '[a-ra-ba]', exampleSentence: 'Modern şehir yaşamında güvenli sürüş kurallarına uymak hayati önem taşır.', exampleSentenceTr: 'Modern şehir yaşamında güvenli sürüş kurallarına uymak hayati önem taşır.' }
    }
  },

  // --- 4. EV & EŞYALAR ---
  {
    id: 'home_computer',
    category: 'home',
    categoryNameTr: 'Ev & Eşyalar',
    turkishMeaning: 'Bilgisayar',
    word: 'Der Computer',
    translation: 'Bilgisayar',
    level: 'A1',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    imageSearchQuery: 'modern open laptop computer on clean minimalist office desk keyboard screen',
    imageDescription: 'A modern slim laptop computer open on a wooden office workspace table',
    verified: true,
    verificationNote: 'Görsel doğrudan dizüstü bilgisayarı %100 temsil etmektedir.',
    disambiguation: 'Dizüstü bilgisayar cihazı',
    translations: {
      de: { word: 'Der Computer', phonetic: '[der kom-pyu-tır]', article: 'der', exampleSentence: 'Ich arbeite jeden Tag konzentriert am Computer.', exampleSentenceTr: 'Her gün bilgisayarda odaklanarak çalışırım.' },
      en: { word: 'The Computer', phonetic: '[dı kom-pyu-tır]', article: 'the', exampleSentence: 'Computers are essential for work and study.', exampleSentenceTr: 'Bilgisayarlar iş ve çalışma için gereklidir.' },
      es: { word: 'El ordenador / La computadora', phonetic: '[el or-de-na-dor]', article: 'el', exampleSentence: 'Uso la computadora para escribir informes.', exampleSentenceTr: 'Rapor yazmak için bilgisayarı kullanıyorum.' },
      fr: { word: 'L’ordinateur', phonetic: '[lor-di-na-tör]', article: 'l’', exampleSentence: 'Mon ordinateur portable est très rapide et léger.', exampleSentenceTr: 'Dizüstü bilgisayarım çok hızlı ve hafif.' },
      it: { word: 'Il computer', phonetic: '[il kom-pyu-ter]', article: 'il', exampleSentence: 'Accendo il computer per iniziare la riunione.', exampleSentenceTr: 'Toplantıya başlamak için bilgisayarı açıyorum.' },
      ru: { word: 'Компьютер (Kompyuter)', phonetic: '[kam-pyu-ter]', exampleSentence: 'Мощный компьютер помогает в сложной работе.', exampleSentenceTr: 'Güçlü bilgisayar zorlu işlerde yardımcı olur.' },
      ja: { word: 'パソコン / コンピューター (Pasokon)', phonetic: '[pa-so-kon]', exampleSentence: '新しいパソコンでプログラミングを学びます。', exampleSentenceTr: 'Yeni bilgisayarımla programlama öğreniyorum.' },
      ko: { word: '컴퓨터 (Keompyuteo)', phonetic: '[kôm-pyu-to]', exampleSentence: '컴퓨터로 온라인 강의를 들어요.', exampleSentenceTr: 'Bilgisayarla çevrim içi ders dinliyorum.' },
      zh: { word: '电脑 (Diànnǎo)', phonetic: '[dyen-nao]', exampleSentence: '他在电脑前认真地处理文件。', exampleSentenceTr: 'Bilgisayar başında dikkatle belgeleri düzenliyor.' },
      ar: { word: 'حاسوب / كمبيوتر (Hasoob)', phonetic: '[ha-sub]', exampleSentence: 'الحاسوب أداة لا غنى عنها في العصر الحديث.', exampleSentenceTr: 'Bilgisayar modern çağda vazgeçilmez bir araçtır.' },
      pt: { word: 'O computador', phonetic: '[u kom-pu-ta-dor]', article: 'o', exampleSentence: 'Trabalho no computador o dia todo.', exampleSentenceTr: 'Tüm gün bilgisayarda çalışırım.' },
      nl: { word: 'De computer', phonetic: '[de kom-pju-tör]', article: 'de', exampleSentence: 'Mijn computer start binnen enkele seconden op.', exampleSentenceTr: 'Bilgisayarım birkaç saniye içinde açılıyor.' },
      el: { word: 'Ο υπολογιστής (O ypologistis)', phonetic: '[o i-po-lo-yi-stis]', article: 'ο', exampleSentence: 'Χρησιμοποιώ τον υπολογιστή για μαθήματα.', exampleSentenceTr: 'Dersler için bilgisayarı kullanıyorum.' },
      hi: { word: 'कंप्यूटर (Computer)', phonetic: '[kam-pyu-tar]', exampleSentence: 'मैं कंप्यूटर पर नया सॉफ्टवेयर सीख रहा हूँ।', exampleSentenceTr: 'Bilgisayarda yeni bir yazılım öğreniyorum.' },
      sv: { word: 'Datorn', phonetic: '[da-turn]', article: 'en', exampleSentence: 'Datorn är ett viktigt verktyg för studier.', exampleSentenceTr: 'Bilgisayar eğitim için önemli bir araçtır.' },
      tr: { word: 'Bilgisayar', phonetic: '[bil-gi-sa-yar]', exampleSentence: 'Günümüz dünyasında bilgisayar becerileri öğrenme ve çalışma verimini katlar.', exampleSentenceTr: 'Günümüz dünyasında bilgisayar becerileri öğrenme ve çalışma verimini katlar.' }
    }
  },

  // --- 5. DOĞA & HAVA DURUMU ---
  {
    id: 'nature_sun',
    category: 'nature',
    categoryNameTr: 'Doğa & Çiçekler',
    turkishMeaning: 'Güneş',
    word: 'Die Sonne',
    translation: 'Güneş',
    level: 'A1',
    imageUrl: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&w=800&q=80',
    imageSearchQuery: 'bright golden sun shining in clear blue sky lens flare sunlight',
    imageDescription: 'The brilliant glowing golden sun shining warmly in a clear blue sky',
    verified: true,
    verificationNote: 'Görsel doğrudan gökyüzündeki parlak güneşi %100 temsil etmektedir.',
    disambiguation: 'Gökyüzündeki güneş yıldızı',
    translations: {
      de: { word: 'Die Sonne', phonetic: '[di zon-nı]', article: 'die', exampleSentence: 'Die goldene Sonne scheint heute wunderbar warm.', exampleSentenceTr: 'Altın güneş bugün harika bir şekilde ısıtıyor.' },
      en: { word: 'The Sun', phonetic: '[dı san]', article: 'the', exampleSentence: 'The sun rises in the east and brightens our day.', exampleSentenceTr: 'Güneş doğudan doğar ve günümüzü aydınlatır.' },
      es: { word: 'El sol', phonetic: '[el sol]', article: 'el', exampleSentence: 'El sol brilla intensamente en la playa.', exampleSentenceTr: 'Güneş plajda pırıl pırıl parlıyor.' },
      fr: { word: 'Le soleil', phonetic: '[lö so-ley]', article: 'le', exampleSentence: 'Le soleil réchauffe la terre au printemps.', exampleSentenceTr: 'Güneş ilkbaharda yeryüzünü ısıtır.' },
      it: { word: 'Il sole', phonetic: '[il so-le]', article: 'il', exampleSentence: 'Prendiamo il sole sulla terrazza fiorita.', exampleSentenceTr: 'Çiçekli terasta güneşleniyoruz.' },
      ru: { word: 'Солнце (Solntse)', phonetic: '[son-tse]', exampleSentence: 'Яркое солнце дарит тепло и хорошее настроение.', exampleSentenceTr: 'Parlak güneş sıcaklık ve iyi ruh hali verir.' },
      ja: { word: '太陽 / 日 (Taiyō)', phonetic: '[ta-i-yoo]', exampleSentence: '朝の太陽の光が部屋を明るく照らします。', exampleSentenceTr: 'Sabah güneşinin ışığı odayı aydınlatır.' },
      ko: { word: '태양 / 해 (Taeyang / Hae)', phonetic: '[te-yang]', exampleSentence: '따스한 햇살이 온 세상을 비춰요.', exampleSentenceTr: 'Sıcak güneş ışığı tüm dünyayı aydınlatıyor.' },
      zh: { word: '太阳 (Tàiyáng)', phonetic: '[tay-yang]', exampleSentence: '灿烂的阳光洒在金色的麦田上。', exampleSentenceTr: 'Işıl ışıl güneş ışığı altın buğday tarlalarına vuruyor.' },
      ar: { word: 'شمس (Shams)', phonetic: '[şems]', exampleSentence: 'الشمس المشرقة تملأ الدنيا بالدفء والأمل.', exampleSentenceTr: 'Parlayan güneş dünyayı sıcaklık ve umutla doldurur.' },
      pt: { word: 'O sol', phonetic: '[u sol]', article: 'o', exampleSentence: 'O sol poente pinta o céu de laranja.', exampleSentenceTr: 'Batan güneş gökyüzünü turuncuya boyar.' },
      nl: { word: 'De zon', phonetic: '[de zon]', article: 'de', exampleSentence: 'De zon schijnt heerlijk de hele middag.', exampleSentenceTr: 'Güneş bütün öğleden sonra harika parlıyor.' },
      el: { word: 'Ο ήλιος (O ilios)', phonetic: '[o i-li-os]', article: 'ο', exampleSentence: 'Ο ζεστός ήλιος του καλοκαιριού λάμπει.', exampleSentenceTr: 'Yazın sıcak güneşi parlıyor.' },
      hi: { word: 'सूरज (Sooraj)', phonetic: '[suu-raj]', exampleSentence: 'सुबह का सूरज बहुत सुहावना लगता है।', exampleSentenceTr: 'Sabah güneşi çok keyifli hissettirir.' },
      sv: { word: 'Solen', phonetic: '[suu-len]', article: 'en', exampleSentence: 'Solen värmer skönt efter den kalla vintern.', exampleSentenceTr: 'Güneş soğuk kışın ardından güzelce ısıtıyor.' },
      tr: { word: 'Güneş', phonetic: '[gü-neş]', exampleSentence: 'Pırıl pırıl parlayan sabah güneşi doğaya can ve enerji katar.', exampleSentenceTr: 'Pırıl pırıl parlayan sabah güneşi doğaya can ve enerji katar.' }
    }
  },

  // --- 6. MESLEKLER & İNSAN ---
  {
    id: 'prof_doctor',
    category: 'professions',
    categoryNameTr: 'Meslekler & İnsan',
    turkishMeaning: 'Doktor / Hekim',
    word: 'Der Arzt / Die Ärztin',
    translation: 'Doktor / Hekim',
    level: 'A1',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
    imageSearchQuery: 'friendly medical doctor professional white coat stethoscope clinic healthcare',
    imageDescription: 'A professional medical doctor wearing a clean white coat with a stethoscope',
    verified: true,
    verificationNote: 'Görsel doğrudan tıp doktoru hekimi %100 temsil etmektedir.',
    disambiguation: 'Tıp hekimi / tabip mesleği',
    translations: {
      de: { word: 'Der Arzt / Die Ärztin', phonetic: '[der artst]', article: 'der', exampleSentence: 'Der erfahrene Arzt untersucht den Patienten gründlich.', exampleSentenceTr: 'Deneyimli doktor hastayı detaylıca muayene ediyor.' },
      en: { word: 'The Doctor', phonetic: '[dı dok-tır]', article: 'the', exampleSentence: 'The dedicated doctor helps patients recover quickly.', exampleSentenceTr: 'Özverili doktor hastaların çabuk iyileşmesine yardımcı olur.' },
      es: { word: 'El médico / La doctora', phonetic: '[el me-di-ko]', article: 'el', exampleSentence: 'El médico me dio consejos muy útiles para la salud.', exampleSentenceTr: 'Doktor bana sağlık için çok faydalı tavsiyeler verdi.' },
      fr: { word: 'Le médecin / Le docteur', phonetic: '[lö med-sen]', article: 'le', exampleSentence: 'Je consulte un médecin pour un contrôle de routine.', exampleSentenceTr: 'Rutin bir kontrol için doktora danışıyorum.' },
      it: { word: 'Il medico / Il dottore', phonetic: '[il me-di-ko]', article: 'il', exampleSentence: 'Il dottore ascolta con attenzione il battito del cuore.', exampleSentenceTr: 'Doktor dikkatle kalp atışını dinliyor.' },
      ru: { word: 'Врач / Доктор (Vrach)', phonetic: '[vratş]', exampleSentence: 'Опытный врач заботится о здоровье каждого.', exampleSentenceTr: 'Deneyimli hekim herkesin sağlığıyla ilgilenir.' },
      ja: { word: '医者 / 医師 (Isha)', phonetic: '[i-şa]', exampleSentence: '優しいお医者さんが丁寧に診察してくれました。', exampleSentenceTr: 'Nazik doktor beni özenle muayene etti.' },
      ko: { word: '의사 (Uisa)', phonetic: '[ı-sa]', exampleSentence: '친절한 의사 선생님이 진료를 봐주세요.', exampleSentenceTr: 'Kibar doktor muayene ediyor.' },
      zh: { word: '医生 (Yīshēng)', phonetic: '[yi-şıng]', exampleSentence: '敬业的医生日夜守护着大家的健康。', exampleSentenceTr: 'Özverili doktorlar gece gündüz sağlığımızı koruyor.' },
      ar: { word: 'طبيب / دكتور (Tabeeb)', phonetic: '[ta-biib]', exampleSentence: 'يقدم الطبيب الماهر الرعاية الصحية الممتازة.', exampleSentenceTr: 'Usta doktor mükemmel sağlık hizmeti sunar.' },
      pt: { word: 'O médico / A médica', phonetic: '[u me-di-ku]', article: 'o', exampleSentence: 'O médico prescreveu o tratamento adequado.', exampleSentenceTr: 'Doktor uygun tedaviyi reçete etti.' },
      nl: { word: 'De dokter / arts', phonetic: '[de dok-tör]', article: 'de', exampleSentence: 'De arts luistert aandachtig naar de klachten.', exampleSentenceTr: 'Doktor şikayetleri dikkatle dinliyor.' },
      el: { word: 'Ο γιατρός (O giatros)', phonetic: '[o ya-tros]', article: 'ο', exampleSentence: 'Ο καλός γιατρός φροντίζει τους ασθενείς.', exampleSentenceTr: 'İyi doktor hastalarıyla özenle ilgilenir.' },
      hi: { word: 'डॉक्टर (Doctor)', phonetic: '[dok-tar]', exampleSentence: 'डॉक्टर साहब मरीज़ों की बहुत अच्छी देखभाल करते हैं।', exampleSentenceTr: 'Doktor hastalarla çok iyi ilgilenir.' },
      sv: { word: 'Läkaren', phonetic: '[le-ka-ren]', article: 'en', exampleSentence: 'Läkaren ger bra råd om hälsosam livsstil.', exampleSentenceTr: 'Doktor sağlıklı yaşam tarzı hakkında iyi tavsiyeler verir.' },
      tr: { word: 'Doktor / Hekim', phonetic: '[dok-tor]', exampleSentence: 'Uzman hekimimiz sağlık kontrollerini titizlikle ve özenle tamamladı.', exampleSentenceTr: 'Uzman hekimimiz sağlık kontrollerini titizlikle ve özenle tamamladı.' }
    }
  },

  // --- 7. GİYİM & AKSESUAR ---
  {
    id: 'cloth_shirt',
    category: 'clothing',
    categoryNameTr: 'Giyim & Aksesuar',
    turkishMeaning: 'Gömlek',
    word: 'Das Hemd',
    translation: 'Gömlek (Kıyafet)',
    level: 'A1',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    imageSearchQuery: 'clean button down cotton shirt collar hanger formal clothing fashion',
    imageDescription: 'A neatly pressed clean button-down shirt on a wooden clothes hanger',
    verified: true,
    verificationNote: 'Görsel doğrudan yakalı gömlek giysisini %100 temsil etmektedir.',
    disambiguation: 'Yakalı düğmeli gömlek kıyafeti',
    translations: {
      de: { word: 'Das Hemd', phonetic: '[das hemt]', article: 'das', exampleSentence: 'Er zieht zur Hochzeit ein elegantes weißes Hemd an.', exampleSentenceTr: 'Düğün için zarif beyaz bir gömlek giyiyor.' },
      en: { word: 'The Shirt', phonetic: '[dı şört]', article: 'the', exampleSentence: 'A clean cotton shirt is ideal for business meetings.', exampleSentenceTr: 'Temiz bir pamuklu gömlek iş toplantıları için idealdir.' },
      es: { word: 'La camisa', phonetic: '[la ka-mi-sa]', article: 'la', exampleSentence: 'Plancha su camisa azul antes de ir a trabajar.', exampleSentenceTr: 'İşe gitmeden önce mavi gömleğini ütüler.' },
      fr: { word: 'La chemise', phonetic: '[la şö-miz]', article: 'la', exampleSentence: 'Une belle chemise en lin pour les beaux jours.', exampleSentenceTr: 'Güzel günler için keten şık bir gömlek.' },
      it: { word: 'La camicia', phonetic: '[la ka-mi-ça]', article: 'la', exampleSentence: 'Indossa una camicia bianca di sartoria.', exampleSentenceTr: 'Özel dikim beyaz bir gömlek giyiyor.' },
      ru: { word: 'Рубашка (Rubashka)', phonetic: '[ru-baş-ka]', exampleSentence: 'Строгая светлая рубашка подходит к костюму.', exampleSentenceTr: 'Düz açık renkli gömlek takımla uyumludur.' },
      ja: { word: 'シャツ / ワイシャツ (Shatsu)', phonetic: '[şat-su]', exampleSentence: '仕事の面接のために清潔なシャツを着ます。', exampleSentenceTr: 'İş mülakatı için temiz bir gömlek giyiyorum.' },
      ko: { word: '셔츠 (Syeocheu)', phonetic: '[şyo-çı]', exampleSentence: '다림질한 깔끔한 셔츠를 입어요.', exampleSentenceTr: 'Ütülenmiş düzgün bir gömlek giyiyorum.' },
      zh: { word: '衬衫 (Chènshān)', phonetic: '[çın-şan]', exampleSentence: '这件白衬衫搭配西装显得十分精神。', exampleSentenceTr: 'Bu beyaz gömlek takımla çok şık duruyor.' },
      ar: { word: 'قميص (Qamees)', phonetic: '[qa-mis]', exampleSentence: 'يرتدي قميصاً أبيض أنيقاً في المناسبات الرسمية.', exampleSentenceTr: 'Resmi etkinliklerde şık beyaz bir gömlek giyer.' },
      pt: { word: 'A camisa', phonetic: '[a ka-mi-za]', article: 'a', exampleSentence: 'Visto uma camisa de algodão fresca e leve.', exampleSentenceTr: 'Taze ve hafif pamuklu bir gömlek giyiyorum.' },
      nl: { word: 'Het overhemd', phonetic: '[het o-vör-hemt]', article: 'het', exampleSentence: 'Hij draagt een net gestreept overhemd.', exampleSentenceTr: 'Düzgün çizgili bir gömlek giyiyor.' },
      el: { word: 'Το πουκάμισο (To poukamiso)', phonetic: '[to pu-ka-mi-so]', article: 'το', exampleSentence: 'Ένα κομψό πουκάμισο για τη δεξίωση.', exampleSentenceTr: 'Davet için şık bir gömlek.' },
      hi: { word: 'कमीज़ / शर्ट (Qameez)', phonetic: '[qa-miiz]', exampleSentence: 'साफ-सुथरी कमीज़ पहनना अच्छा लगता है।', exampleSentenceTr: 'Temiz ve düzenli bir gömlek giymek güzel hissettirir.' },
      sv: { word: 'Skjortan', phonetic: '[şur-tan]', article: 'en', exampleSentence: 'En nystruken vit skjorta till festen.', exampleSentenceTr: 'Kutlama için yeni ütülenmiş beyaz bir gömlek.' },
      tr: { word: 'Gömlek', phonetic: '[göm-lek]', exampleSentence: 'Özel davetlerde ve iş görüşmelerinde ütülü şık bir gömlek tercih ederiz.', exampleSentenceTr: 'Özel davetlerde ve iş görüşmelerinde ütülü şık bir gömlek tercih ederiz.' }
    }
  },

  // --- 8. DUYGULAR & SIFATLAR ---
  {
    id: 'emot_happy',
    category: 'emotions',
    categoryNameTr: 'Duygular & Renkler',
    turkishMeaning: 'Mutlu / Neşeli',
    word: 'Glücklich / Froh',
    translation: 'Mutlu / Neşeli',
    level: 'A1',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    imageSearchQuery: 'joyful happy cheerful smiling person face radiance positivity',
    imageDescription: 'A genuinely happy and joyful smiling person radiating warmth and positivity',
    verified: true,
    verificationNote: 'Görsel doğrudan içten mutluluk ve tebessümü %100 temsil etmektedir.',
    disambiguation: 'Mutluluk ve sevinç duygusu',
    translations: {
      de: { word: 'Glücklich / Froh', phonetic: '[glük-lih / froo]', exampleSentence: 'Ich bin so glücklich und dankbar für diesen schönen Tag.', exampleSentenceTr: 'Bu güzel gün için çok mutlu ve minnettarım.' },
      en: { word: 'Happy / Joyful', phonetic: '[hep-pi]', exampleSentence: 'A happy heart makes a cheerful face.', exampleSentenceTr: 'Mutlu bir kalp neşeli bir yüz yaratır.' },
      es: { word: 'Feliz / Contento', phonetic: '[fe-lis]', exampleSentence: 'Estoy muy feliz de estar con mi familia hoy.', exampleSentenceTr: 'Bugün ailemle birlikte olduğum için çok mutluyum.' },
      fr: { word: 'Heureux / Joyeux', phonetic: '[ö-rö]', exampleSentence: 'Ils sont tellement heureux d’avoir réussi.', exampleSentenceTr: 'Başardıkları için o kadar mutlular ki.' },
      it: { word: 'Felice / Contento', phonetic: '[fe-li-çe]', exampleSentence: 'Un sorriso sincero rende tutti più felici.', exampleSentenceTr: 'Samimi bir gülümseme herkesi daha mutlu eder.' },
      ru: { word: 'Счастливый / Радостный (Schastlivyy)', phonetic: '[şas-tli-vıy]', exampleSentence: 'Мы счастливы разделить эту победу с вами.', exampleSentenceTr: 'Bu zaferi sizinle paylaşmaktan mutluyuz.' },
      ja: { word: '幸せ / 嬉しい (Shiawase / Ureshii)', phonetic: '[şi-a-va-se]', exampleSentence: '大好きな友達と過ごせてとても幸せです。', exampleSentenceTr: 'En sevdiğim arkadaşlarımla vakit geçirdiğim için çok mutluyum.' },
      ko: { word: '행복한 / 기쁜 (Haengbokan)', phonetic: '[heng-bok-han]', exampleSentence: '모두가 함께 웃을 수 있어서 정말 행복해요.', exampleSentenceTr: 'Hep birlikte gülebildiğimiz için gerçekten çok mutluyum.' },
      zh: { word: '快乐 / 幸福 (Kuàilè / Xìngfú)', phonetic: '[kuay-lı / şing-fu]', exampleSentence: '收到美好的祝福让我感到非常幸福。', exampleSentenceTr: 'Güzel dilekler almak beni çok mutlu etti.' },
      ar: { word: 'سعيد / فرحان (Saeed)', phonetic: '[sa-iid]', exampleSentence: 'أنا سعيد جداً بتحقيق هذا النجاح الكبير.', exampleSentenceTr: 'Bu büyük başarıyı elde ettiğim için çok mutluyum.' },
      pt: { word: 'Feliz / Contente', phonetic: '[fe-lis]', exampleSentence: 'Estou muito feliz por ter aprendido coisas novas.', exampleSentenceTr: 'Yeni şeyler öğrendiğim için çok mutluyum.' },
      nl: { word: 'Gelukkig / Blij', phonetic: '[he-lük-kıh]', exampleSentence: 'We voelen ons ontzettend gelukkig vandaag.', exampleSentenceTr: 'Bugün kendimizi son derece mutlu hissediyoruz.' },
      el: { word: 'Χαρούμενος / Ευτυχισμένος (Charoumenos)', phonetic: '[ha-ru-me-nos]', exampleSentence: 'Είμαι πολύ χαρούμενος για τα καλά νέα.', exampleSentenceTr: 'İyi haberler için çok mutluyum.' },
      hi: { word: 'खुश / प्रसन्न (Khush)', phonetic: '[huş]', exampleSentence: 'आज हम सब मिलकर बहुत खुश हैं।', exampleSentenceTr: 'Bugün hepimiz birlikte çok mutluyuz.' },
      sv: { word: 'Lycklig / Glad', phonetic: '[lük-lig / glaad]', exampleSentence: 'En varm kram gör vem som helst glad.', exampleSentenceTr: 'Sıcak bir sarılma herkesi mutlu eder.' },
      tr: { word: 'Mutlu / Neşeli', phonetic: '[mut-lu]', exampleSentence: 'Sevdiklerimizle birlikte huzur dolu anlar paylaşmak insanı derinden mutlu kılar.', exampleSentenceTr: 'Sevdiklerimizle birlikte huzur dolu anlar paylaşmak insanı derinden mutlu kılar.' }
    }
  }
];
