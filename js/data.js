// data.js — PREMIUM EDITION (AVEC TRADUCTIONS UI COMPLÈTES)
// LinguaVillage — Données avec village circulaire aligné
// ================================================================

// =================================================================
// API
// =================================================================
window.API = window.API || 'https://linguavillage-api--marckensbou2.replit.app';

var _apiCache = {};
var lastAPICall = 0;
var MIN_API_INTERVAL = 300;

async function callAPIWithFallback(endpoint, data, options) {
  options = options || {};
  var skipCache = options.skipCache || false;
  var timeout   = options.timeout || 10000;
  var cacheKey  = endpoint + JSON.stringify(data);

  if (!skipCache && _apiCache[cacheKey]) return _apiCache[cacheKey];

  var now  = Date.now();
  var wait = MIN_API_INTERVAL - (now - lastAPICall);
  if (wait > 0) await new Promise(function(r){ setTimeout(r, wait); });
  lastAPICall = Date.now();

  var controller = new AbortController();
  var timer = setTimeout(function(){ controller.abort(); }, timeout);
  try {
    var r = await fetch(window.API + endpoint, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
      signal:  controller.signal
    });
    clearTimeout(timer);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    var result = await r.json();
    _apiCache[cacheKey] = result;
    return result;
  } catch(e) {
    clearTimeout(timer);
    throw e;
  }
}

// =================================================================
// CONSTANTES
// =================================================================
var FLAGS = {
  fr: '🇫🇷', en: '🇬🇧', es: '🇪🇸', ht: '🇭🇹', de: '🇩🇪',
  ru: '🇷🇺', zh: '🇨🇳', ja: '🇯🇵'
};

var LANG_NAMES = {
  fr: 'Français', en: 'English', es: 'Español', ht: 'Kreyòl',
  de: 'Deutsch', ru: 'Русский', zh: '中文', ja: '日本語'
};

var WEATHER_ICONS = {
  sun: '☀️', rain: '🌧️', snow: '❄️', wind: '💨', night: '🌙'
};

// =================================================================
// UI_TEXT - TRADUCTIONS COMPLÈTES DE L'INTERFACE
// =================================================================
var UI_TEXT = {
  fr: {
    sub:'Apprendre en vivant', 
    lbl_native:'🌍 Votre langue maternelle', 
    lbl_name:'✏️ Votre prénom',
    lbl_target:'🎯 Langue à apprendre', 
    lbl_script:'✍️ Mode d\'écriture', 
    play:'✨ Commencer',
    menu_title:'Que voulez-vous faire ?', 
    menu_sub:'Choisissez votre mode d\'apprentissage',
    mb_village:'Village', 
    mb_village_d:'Conversations IA + correcteur temps réel',
    mb_vocab:'Vocabulaire', 
    mb_vocab_d:'1500 mots essentiels par catégories',
    mb_phrases:'Phrases & Structures', 
    mb_phrases_d:'1000 phrases du quotidien',
    mb_grammar:'Grammaire', 
    mb_grammar_d:'6 temps + 500 exemples expliqués',
    mb_dict:'Dictionnaire', 
    mb_dict_d:'Traduction mot ou phrase complète',
    enter_village:'🏘️ Entrer dans le village', 
    translate:'🌐 Traduire', 
    favorite:'⭐ Favoris',
    skip:'⏭ Passer', 
    proverb_of_day:'Proverbe du jour'
  },
  ht: {
    sub:'Aprann pandan w ap viv', 
    lbl_native:'🌍 Lang manman ou', 
    lbl_name:'✏️ Prenon ou',
    lbl_target:'🎯 Lang ou vle aprann', 
    lbl_script:'✍️ Fason pou ekri', 
    play:'✨ Kòmanse',
    menu_title:'Kisa ou vle fè ?', 
    menu_sub:'Chwazi fason ou vle aprann',
    mb_village:'Vilaj', 
    mb_village_d:'Konvèsasyon IA + korektè',
    mb_vocab:'Vokabilè', 
    mb_vocab_d:'1500 mo esansyèl',
    mb_phrases:'Fraz & Estrikti', 
    mb_phrases_d:'1000 fraz chak jou',
    mb_grammar:'Gramè', 
    mb_grammar_d:'6 tan + 500 egzanp',
    mb_dict:'Diksyonè', 
    mb_dict_d:'Tradui mo oswa fraz',
    enter_village:'🏘️ Antre nan vilaj la', 
    translate:'🌐 Tradwi', 
    favorite:'⭐ Favori',
    skip:'⏭ Pase', 
    proverb_of_day:'Pwovèb jounen an'
  },
  en: {
    sub:'Learn by living', 
    lbl_native:'🌍 Your native language', 
    lbl_name:'✏️ Your first name',
    lbl_target:'🎯 Language to learn', 
    lbl_script:'✍️ Writing mode', 
    play:'✨ Start',
    menu_title:'What do you want to do?', 
    menu_sub:'Choose your learning mode',
    mb_village:'Village', 
    mb_village_d:'AI conversations + real-time corrector',
    mb_vocab:'Vocabulary', 
    mb_vocab_d:'1500 essential words by category',
    mb_phrases:'Phrases & Structures', 
    mb_phrases_d:'1000 everyday phrases',
    mb_grammar:'Grammar', 
    mb_grammar_d:'6 tenses + 500 explained examples',
    mb_dict:'Dictionary', 
    mb_dict_d:'Translate word or full phrase',
    enter_village:'🏘️ Enter the village!', 
    translate:'🌐 Translate', 
    favorite:'⭐ Favorite',
    skip:'⏭ Skip', 
    proverb_of_day:'Proverb of the day'
  },
  es: {
    sub:'Aprender viviendo', 
    lbl_native:'🌍 Tu idioma nativo', 
    lbl_name:'✏️ Tu nombre',
    lbl_target:'🎯 Idioma a aprender', 
    lbl_script:'✍️ Modo escritura', 
    play:'✨ Empezar',
    menu_title:'¿Qué quieres hacer?', 
    menu_sub:'Elige tu modo de aprendizaje',
    mb_village:'Pueblo', 
    mb_village_d:'Conversaciones IA + corrector',
    mb_vocab:'Vocabulario', 
    mb_vocab_d:'1500 palabras esenciales',
    mb_phrases:'Frases & Estructuras', 
    mb_phrases_d:'1000 frases cotidianas',
    mb_grammar:'Gramática', 
    mb_grammar_d:'6 tiempos + 500 ejemplos',
    mb_dict:'Diccionario', 
    mb_dict_d:'Traducir palabra o frase',
    enter_village:'🏘️ ¡Entrar al pueblo!', 
    translate:'🌐 Traducir', 
    favorite:'⭐ Favorito',
    skip:'⏭ Saltar', 
    proverb_of_day:'Proverbio del día'
  },
  de: {
    sub:'Durch Leben lernen', 
    lbl_native:'🌍 Deine Muttersprache', 
    lbl_name:'✏️ Dein Vorname',
    lbl_target:'🎯 Zu lernende Sprache', 
    lbl_script:'✍️ Schreibmodus', 
    play:'✨ Starten',
    menu_title:'Was möchtest du tun?', 
    menu_sub:'Wähle deinen Lernmodus',
    mb_village:'Dorf', 
    mb_village_d:'KI-Gespräche + Korrektur',
    mb_vocab:'Wortschatz', 
    mb_vocab_d:'1500 wesentliche Wörter',
    mb_phrases:'Sätze & Strukturen', 
    mb_phrases_d:'1000 Alltagssätze',
    mb_grammar:'Grammatik', 
    mb_grammar_d:'6 Zeiten + 500 Beispiele',
    mb_dict:'Wörterbuch', 
    mb_dict_d:'Wort oder Satz übersetzen',
    enter_village:'🏘️ Das Dorf betreten!', 
    translate:'🌐 Übersetzen', 
    favorite:'⭐ Favorit',
    skip:'⏭ Überspringen', 
    proverb_of_day:'Sprichwort des Tages'
  },
  ru: {
    sub:'Учиться живя', 
    lbl_native:'🌍 Ваш родной язык', 
    lbl_name:'✏️ Ваше имя',
    lbl_target:'🎯 Язык для изучения', 
    lbl_script:'✍️ Режим письма', 
    play:'✨ Начать',
    menu_title:'Что вы хотите сделать?', 
    menu_sub:'Выберите режим обучения',
    mb_village:'Деревня', 
    mb_village_d:'ИИ разговоры + корректор',
    mb_vocab:'Словарь', 
    mb_vocab_d:'1500 основных слов',
    mb_phrases:'Фразы и структуры', 
    mb_phrases_d:'1000 повседневных фраз',
    mb_grammar:'Грамматика', 
    mb_grammar_d:'6 времён + 500 примеров',
    mb_dict:'Словарь', 
    mb_dict_d:'Перевод слова или фразы',
    enter_village:'🏘️ Войти в деревню!', 
    translate:'🌐 Перевести', 
    favorite:'⭐ Избранное',
    skip:'⏭ Пропустить', 
    proverb_of_day:'Пословица дня'
  },
  zh: {
    sub:'在生活中学习', 
    lbl_native:'🌍 您的母语', 
    lbl_name:'✏️ 您的名字',
    lbl_target:'🎯 要学习的语言', 
    lbl_script:'✍️ 书写模式', 
    play:'✨ 开始',
    menu_title:'您想做什么？', 
    menu_sub:'选择学习模式',
    mb_village:'村庄', 
    mb_village_d:'AI对话 + 实时纠错',
    mb_vocab:'词汇', 
    mb_vocab_d:'1500个基本词汇',
    mb_phrases:'句子与结构', 
    mb_phrases_d:'1000个日常句子',
    mb_grammar:'语法', 
    mb_grammar_d:'6个时态 + 500个例句',
    mb_dict:'词典', 
    mb_dict_d:'翻译单词或整句',
    enter_village:'🏘️ 进入村庄！', 
    translate:'🌐 翻译', 
    favorite:'⭐ 收藏',
    skip:'⏭ 跳过', 
    proverb_of_day:'今日谚语'
  },
  ja: {
    sub:'生きながら学ぶ', 
    lbl_native:'🌍 あなたの母国語', 
    lbl_name:'✏️ あなたの名前',
    lbl_target:'🎯 学ぶ言語', 
    lbl_script:'✍️ 書き方', 
    play:'✨ 始める',
    menu_title:'何をしたいですか？', 
    menu_sub:'学習モードを選択',
    mb_village:'村', 
    mb_village_d:'AI会話 + リアルタイム修正',
    mb_vocab:'語彙', 
    mb_vocab_d:'1500の基本語彙',
    mb_phrases:'フレーズと構造', 
    mb_phrases_d:'1000の日常フレーズ',
    mb_grammar:'文法', 
    mb_grammar_d:'6つの時制 + 500例文',
    mb_dict:'辞書', 
    mb_dict_d:'単語または文を翻訳',
    enter_village:'🏘️ 村に入る！', 
    translate:'🌐 翻訳', 
    favorite:'⭐ お気に入り',
    skip:'⏭ スキップ', 
    proverb_of_day:'今日のことわざ'
  }
};

// =================================================================
// LIEUX DU VILLAGE
// ================================================================
var LOCATIONS = [
  { id:'cinema',   x:0.42, y:0.42, w:0.16, h:0.16, emoji:'🎬', color:'#c060c0', npcs:[] },
  { id:'market',   x:0.44, y:0.64, w:0.12, h:0.12, emoji:'🏪', color:'#c0a060', npcs:[{id:'merchant', name:'M. Diallo', role:{fr:'Marchand', en:'Merchant', es:'Comerciante', ht:'Machann', de:'Händler', ru:'Торговец', zh:'商人', ja:'商人'}, emoji:'🧑‍🌾'}] },
  { id:'park',     x:0.44, y:0.24, w:0.12, h:0.12, emoji:'🌳', color:'#5a8a40', npcs:[] },
  { id:'friends',  x:0.67, y:0.67, w:0.12, h:0.12, emoji:'🤝', color:'#c09090', npcs:[{id:'friend', name:'Léa', role:{fr:'Amie', en:'Friend', es:'Amiga', ht:'Zanmi', de:'Freundin', ru:'Подруга', zh:'朋友', ja:'友達'}, emoji:'👧'}] },
  { id:'police',   x:0.21, y:0.67, w:0.12, h:0.12, emoji:'🚔', color:'#6070a0', npcs:[{id:'officer2', name:'Cap. Koné', role:{fr:'Policier', en:'Police Officer', es:'Policía', ht:'Polisye', de:'Polizist', ru:'Полицейский', zh:'警察', ja:'警察官'}, emoji:'👮‍♂️'}] },
  { id:'station',  x:0.21, y:0.21, w:0.12, h:0.12, emoji:'🚉', color:'#b0a090', npcs:[{id:'officer', name:'Agent Kofi', role:{fr:'Agent', en:'Officer', es:'Oficial', ht:'Ofisye', de:'Beamter', ru:'Офицер', zh:'警官', ja:'警官'}, emoji:'👮'}] },
  { id:'bank',     x:0.67, y:0.21, w:0.12, h:0.12, emoji:'🏦', color:'#c0c080', npcs:[{id:'banker', name:'M. Dupuis', role:{fr:'Banquier', en:'Banker', es:'Banquero', ht:'Bankye', de:'Bankier', ru:'Банкир', zh:'银行家', ja:'銀行員'}, emoji:'👨‍💼'}] },
  { id:'hospital', x:0.90, y:0.44, w:0.12, h:0.12, emoji:'🏥', color:'#d0e0f0', npcs:[{id:'doctor', name:'Dr. Martin', role:{fr:'Médecin', en:'Doctor', es:'Médico', ht:'Doktè', de:'Arzt', ru:'Врач', zh:'医生', ja:'医者'}, emoji:'👨‍⚕️'},{id:'nurse', name:'Sophie', role:{fr:'Infirmière', en:'Nurse', es:'Enfermera', ht:'Enfimyè', de:'Krankenschwester', ru:'Медсестра', zh:'护士', ja:'看護師'}, emoji:'👩‍⚕️'}] },
  { id:'church',   x:0.58, y:0.88, w:0.12, h:0.12, emoji:'⛪', color:'#8a7a60', npcs:[{id:'pastor', name:'Père Antoine', role:{fr:'Pasteur', en:'Pastor', es:'Pastor', ht:'Pastè', de:'Pfarrer', ru:'Пастор', zh:'牧师', ja:'牧師'}, emoji:'⛪'}] },
  { id:'tavern',   x:0.07, y:0.71, w:0.12, h:0.12, emoji:'🍺', color:'#8a6040', npcs:[{id:'bartender', name:'Sam', role:{fr:'Barman', en:'Bartender', es:'Camarero', ht:'Baman', de:'Barkeeper', ru:'Бармен', zh:'酒保', ja:'バーテンダー'}, emoji:'🍸'}] },
  { id:'factory',  x:0.07, y:0.17, w:0.12, h:0.12, emoji:'🏭', color:'#808080', npcs:[{id:'farmer', name:'Papa Joseph', role:{fr:'Agriculteur', en:'Farmer', es:'Agricultor', ht:'Agrikiltè', de:'Bauer', ru:'Фермер', zh:'农民', ja:'農家'}, emoji:'👨‍🌾'}] },
  { id:'school',   x:0.58, y:0.00, w:0.12, h:0.12, emoji:'🏫', color:'#6a8ab0', npcs:[{id:'teacher', name:'Mme Dupont', role:{fr:'Professeure', en:'Teacher', es:'Profesora', ht:'Pwofesè', de:'Lehrerin', ru:'Учитель', zh:'老师', ja:'先生'}, emoji:'👩‍🏫'}] }
];

// =================================================================
// NOMS DES LIEUX
// ================================================================
var LOC_NAMES = {};
var LOC_DESC = {};

LOCATIONS.forEach(function(loc) {
  LOC_NAMES[loc.id] = {
    fr: loc.id==='church'?'Église':loc.id==='school'?'École':loc.id==='friends'?'Amis':loc.id==='market'?'Marché':loc.id==='tavern'?'Taverne':loc.id==='park'?'Parc':loc.id==='hospital'?'Hôpital':loc.id==='station'?'Gare':loc.id==='bank'?'Banque':loc.id==='police'?'Police':loc.id==='factory'?'Ferme':loc.id==='cinema'?'Cinéma':loc.id,
    en: loc.id==='church'?'Church':loc.id==='school'?'School':loc.id==='friends'?'Friends':loc.id==='market'?'Market':loc.id==='tavern'?'Tavern':loc.id==='park'?'Park':loc.id==='hospital'?'Hospital':loc.id==='station'?'Station':loc.id==='bank'?'Bank':loc.id==='police'?'Police':loc.id==='factory'?'Farm':loc.id==='cinema'?'Cinema':loc.id,
    es: loc.id==='church'?'Iglesia':loc.id==='school'?'Escuela':loc.id==='friends'?'Amigos':loc.id==='market'?'Mercado':loc.id==='tavern'?'Taberna':loc.id==='park'?'Parque':loc.id==='hospital'?'Hospital':loc.id==='station'?'Estación':loc.id==='bank'?'Banco':loc.id==='police'?'Policía':loc.id==='factory'?'Granja':loc.id==='cinema'?'Cine':loc.id,
    ht: loc.id==='church'?'Legliz':loc.id==='school'?'Lekòl':loc.id==='friends'?'Zanmi':loc.id==='market'?'Mache':loc.id==='tavern'?'Tavèn':loc.id==='park'?'Pak':loc.id==='hospital'?'Lopital':loc.id==='station'?'Estasyon':loc.id==='bank'?'Bank':loc.id==='police'?'Polis':loc.id==='factory'?'Fèm':loc.id==='cinema'?'Sinema':loc.id,
    de: loc.id==='church'?'Kirche':loc.id==='school'?'Schule':loc.id==='friends'?'Freunde':loc.id==='market'?'Markt':loc.id==='tavern'?'Kneipe':loc.id==='park'?'Park':loc.id==='hospital'?'Krankenhaus':loc.id==='station'?'Bahnhof':loc.id==='bank'?'Bank':loc.id==='police'?'Polizei':loc.id==='factory'?'Bauernhof':loc.id==='cinema'?'Kino':loc.id,
    ru: loc.id==='church'?'Церковь':loc.id==='school'?'Школа':loc.id==='friends'?'Друзья':loc.id==='market'?'Рынок':loc.id==='tavern'?'Таверна':loc.id==='park'?'Парк':loc.id==='hospital'?'Больница':loc.id==='station'?'Вокзал':loc.id==='bank'?'Банк':loc.id==='police'?'Полиция':loc.id==='factory'?'Ферма':loc.id==='cinema'?'Кино':loc.id,
    zh: loc.id==='church'?'教堂':loc.id==='school'?'学校':loc.id==='friends'?'朋友':loc.id==='market'?'市场':loc.id==='tavern'?'酒馆':loc.id==='park'?'公园':loc.id==='hospital'?'医院':loc.id==='station'?'车站':loc.id==='bank'?'银行':loc.id==='police'?'警察局':loc.id==='factory'?'农场':loc.id==='cinema'?'电影院':loc.id,
    ja: loc.id==='church'?'教会':loc.id==='school'?'学校':loc.id==='friends'?'友達':loc.id==='market'?'市場':loc.id==='tavern'?'居酒屋':loc.id==='park'?'公園':loc.id==='hospital'?'病院':loc.id==='station'?'駅':loc.id==='bank'?'銀行':loc.id==='police'?'警察署':loc.id==='factory'?'農場':loc.id==='cinema'?'映画館':loc.id
  };
  LOC_DESC[loc.id] = {
    fr: loc.id==='church'?'Prière et méditation':loc.id==='school'?'Apprendre et étudier':loc.id==='friends'?'Rencontres amicales':loc.id==='market'?'Acheter et vendre':loc.id==='tavern'?'Boire et discuter':loc.id==='park'?'Se détendre':loc.id==='hospital'?'Se soigner':loc.id==='station'?'Voyager':loc.id==='bank'?'Gérer son argent':loc.id==='police'?'Sécurité':loc.id==='factory'?'Travailler la terre':loc.id==='cinema'?'Regarder des vidéos':'',
    en: loc.id==='church'?'Prayer & meditation':loc.id==='school'?'Learn & study':loc.id==='friends'?'Friendly meetings':loc.id==='market'?'Buy & sell':loc.id==='tavern'?'Drink & chat':loc.id==='park'?'Relax':loc.id==='hospital'?'Get treatment':loc.id==='station'?'Travel':loc.id==='bank'?'Manage money':loc.id==='police'?'Safety':loc.id==='factory'?'Farm work':loc.id==='cinema'?'Watch videos':''
  };
});

// =================================================================
// VOCABULAIRE COMPLET
// ================================================================
var VOCAB = {
  verbes: {
    icon: '🏃', fr: 'Verbes', en: 'Verbs', es: 'Verbos', ht: 'Vèb', de: 'Verben', ru: 'Глаголы', zh: '动词', ja: '動詞',
    words: [
      { n:'manger', t:{fr:'manger',en:'to eat',es:'comer',ht:'manje',de:'essen',ru:'есть',zh:'吃',ja:'食べる'} },
      { n:'boire', t:{fr:'boire',en:'to drink',es:'beber',ht:'bwè',de:'trinken',ru:'пить',zh:'喝',ja:'飲む'} },
      { n:'dormir', t:{fr:'dormir',en:'to sleep',es:'dormir',ht:'dòmi',de:'schlafen',ru:'спать',zh:'睡觉',ja:'寝る'} },
      { n:'parler', t:{fr:'parler',en:'to speak',es:'hablar',ht:'pale',de:'sprechen',ru:'говорить',zh:'说',ja:'話す'} },
      { n:'comprendre', t:{fr:'comprendre',en:'to understand',es:'comprender',ht:'konprann',de:'verstehen',ru:'понимать',zh:'理解',ja:'理解する'} },
      { n:'apprendre', t:{fr:'apprendre',en:'to learn',es:'aprender',ht:'aprann',de:'lernen',ru:'учить',zh:'学习',ja:'学ぶ'} },
      { n:'travailler', t:{fr:'travailler',en:'to work',es:'trabajar',ht:'travay',de:'arbeiten',ru:'работать',zh:'工作',ja:'働く'} },
      { n:'voyager', t:{fr:'voyager',en:'to travel',es:'viajar',ht:'vwayaje',de:'reisen',ru:'путешествовать',zh:'旅行',ja:'旅行する'} }
    ]
  },
  salutations: {
    icon: '👋', fr: 'Salutations', en: 'Greetings', es: 'Saludos', ht: 'Bonjou', de: 'Begrüßungen', ru: 'Приветствия', zh: '问候', ja: '挨拶',
    words: [
      { n:'bonjour', t:{fr:'bonjour',en:'hello',es:'hola',ht:'bonjou',de:'hallo',ru:'здравствуйте',zh:'你好',ja:'こんにちは'} },
      { n:'au revoir', t:{fr:'au revoir',en:'goodbye',es:'adiós',ht:'oke',de:'auf wiedersehen',ru:'до свидания',zh:'再见',ja:'さようなら'} },
      { n:'merci', t:{fr:'merci',en:'thank you',es:'gracias',ht:'mèsi',de:'danke',ru:'спасибо',zh:'谢谢',ja:'ありがとう'} },
      { n:'s\'il vous plaît', t:{fr:'s\'il vous plaît',en:'please',es:'por favor',ht:'tanpri',de:'bitte',ru:'пожалуйста',zh:'请',ja:'お願いします'} },
      { n:'bonsoir', t:{fr:'bonsoir',en:'good evening',es:'buenas noches',ht:'bonswa',de:'guten abend',ru:'добрый вечер',zh:'晚上好',ja:'こんばんは'} }
    ]
  },
  voyage: {
    icon: '✈️', fr: 'Voyage', en: 'Travel', es: 'Viaje', ht: 'Vwayaj', de: 'Reise', ru: 'Путешествие', zh: '旅行', ja: '旅行',
    words: [
      { n:'aéroport', t:{fr:'aéroport',en:'airport',es:'aeropuerto',ht:'ayewopò',de:'Flughafen',ru:'аэропорт',zh:'机场',ja:'空港'} },
      { n:'billet', t:{fr:'billet',en:'ticket',es:'billete',ht:'tikè',de:'Fahrkarte',ru:'билет',zh:'票',ja:'切符'} },
      { n:'valise', t:{fr:'valise',en:'suitcase',es:'maleta',ht:'valiz',de:'Koffer',ru:'чемодан',zh:'行李箱',ja:'スーツケース'} },
      { n:'passeport', t:{fr:'passeport',en:'passport',es:'pasaporte',ht:'paspò',de:'Reisepass',ru:'паспорт',zh:'护照',ja:'パスポート'} }
    ]
  }
};

// =================================================================
// PHRASES COMPLÈTES
// ================================================================
var PHRASES_DATA = {
  quotidien: {
    icon: '💬', fr: 'Quotidien', en: 'Daily Life', es: 'Vida diaria', ht: 'Lavi chak jou', de: 'Alltag', ru: 'Повседневная жизнь', zh: '日常生活', ja: '日常生活',
    items: [
      { n:'Comment ça va ?', t:{fr:'Comment ça va ?',en:'How are you?',es:'¿Cómo estás?',ht:'Kijan ou ye?',de:'Wie geht es dir?',ru:'Как дела?',zh:'你好吗？',ja:'お元気ですか？'} },
      { n:'Je vais bien, merci.', t:{fr:'Je vais bien, merci.',en:'I am fine, thank you.',es:'Estoy bien, gracias.',ht:'Mwen byen, mèsi.',de:'Mir geht es gut, danke.',ru:'У меня всё хорошо, спасибо.',zh:'我很好，谢谢。',ja:'元気です、ありがとう。'} },
      { n:'Quel temps fait-il ?', t:{fr:'Quel temps fait-il ?',en:'What\'s the weather like?',es:'¿Qué tiempo hace?',ht:'Ki tan li fè?',de:'Wie ist das Wetter?',ru:'Какая погода?',zh:'天气怎么样？',ja:'天気はどうですか？'} },
      { n:'Je t\'aime.', t:{fr:'Je t\'aime.',en:'I love you.',es:'Te quiero.',ht:'Mwen renmen ou.',de:'Ich liebe dich.',ru:'Я тебя люблю.',zh:'我爱你。',ja:'愛しています。'} }
    ]
  },
  restaurant: {
    icon: '🍽️', fr: 'Restaurant', en: 'Restaurant', es: 'Restaurante', ht: 'Restoran', de: 'Restaurant', ru: 'Ресторан', zh: '餐厅', ja: 'レストラン',
    items: [
      { n:'Je voudrais commander.', t:{fr:'Je voudrais commander.',en:'I would like to order.',es:'Me gustaría pedir.',ht:'Mwen ta renmen kòmande.',de:'Ich möchte bestellen.',ru:'Я хотел бы заказать.',zh:'我想点餐。',ja:'注文したいです。'} },
      { n:'L\'addition, s\'il vous plaît.', t:{fr:'L\'addition, s\'il vous plaît.',en:'The bill, please.',es:'La cuenta, por favor.',ht:'Ladityon, tanpri.',de:'Die Rechnung, bitte.',ru:'Счет, пожалуйста.',zh:'买单，谢谢。',ja:'お会計をお願いします。'} }
    ]
  }
};

// =================================================================
// GRAMMAIRE COMPLÈTE
// ================================================================
var GRAMMAR_DATA = {
  present: {
    icon: '⏰', fr: 'Présent', en: 'Present tense', es: 'Presente', ht: 'Prezan', de: 'Präsens', ru: 'Настоящее время', zh: '现在时', ja: '現在形',
    explanation: {
      fr: 'Le présent exprime une action qui se déroule maintenant ou une vérité générale.',
      en: 'The present tense expresses an action happening now or a general truth.',
      es: 'El presente expresa una acción que ocurre ahora o una verdad general.',
      ht: 'Prezan an eksprime yon aksyon k ap pase kounye a oswa yon verite jeneral.'
    },
    formula: {
      fr: 'Sujet + verbe conjugué + complément',
      en: 'Subject + conjugated verb + complement'
    },
    examples: [
      { n:'Je mange une pomme.', t:{fr:'Je mange une pomme.',en:'I eat an apple.',es:'Yo como una manzana.',ht:'Mwen manje yon pòm.',de:'Ich esse einen Apfel.',ru:'Я ем яблоко.',zh:'我吃一个苹果。',ja:'私はリンゴを食べます。'} },
      { n:'Il parle français.', t:{fr:'Il parle français.',en:'He speaks French.',es:'Él habla francés.',ht:'Li pale franse.',de:'Er spricht Französisch.',ru:'Он говорит по-французски.',zh:'他说法语。',ja:'彼はフランス語を話します。'} }
    ]
  },
  passe_compose: {
    icon: '📅', fr: 'Passé composé', en: 'Past tense', es: 'Pasado compuesto', ht: 'Pase konpoze', de: 'Perfekt', ru: 'Прошедшее время', zh: '过去时', ja: '過去形',
    explanation: {
      fr: 'Le passé composé exprime une action terminée dans le passé.',
      en: 'The past tense expresses a completed action in the past.'
    },
    formula: {
      fr: 'Sujet + auxiliaire (avoir/être) + participe passé',
      en: 'Subject + auxiliary (have/be) + past participle'
    },
    examples: [
      { n:'J\'ai mangé une pomme.', t:{fr:'J\'ai mangé une pomme.',en:'I ate an apple.',es:'Yo comí una manzana.',ht:'Mwen te manje yon pòm.',de:'Ich habe einen Apfel gegessen.',ru:'Я съел яблоко.',zh:'我吃了一个苹果。',ja:'私はリンゴを食べました。'} }
    ]
  }
};

console.log('✅ data.js PREMIUM chargé — Traductions UI complètes');
