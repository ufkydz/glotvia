import sys

# We will generate 200 high-quality phrases across 8 categories:
# Greetings (25), Numbers (25), Dining (30), Travel (35), Shopping (25), Daily (25), Business (20), Emergency (15)

categories = [
    ("Greetings", "👋 Selamlaşma & Tanışma"),
    ("Numbers", "🔢 Sayılar & Zaman"),
    ("Dining", "☕ Restoran & Sipariş"),
    ("Travel", "✈️ Seyahat & Yol Sorma"),
    ("Shopping", "🛍️ Alışveriş & Günlük Yaşam"),
    ("Daily", "🏡 Günlük Yaşam & Ev"),
    ("Business", "💼 İş & Kariyer"),
    ("Emergency", "🚨 Acil Durum & Sağlık")
]

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

print('Base structures ready')
