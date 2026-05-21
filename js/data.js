// data.js — PREMIUM EDITION (CORRIGÉ AVEC DONNÉES COMPLÈTES)
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
// LIEUX DU VILLAGE — POSITIONS CIRCULAIRES PARFAITES
// ================================================================
var LOCATIONS = [
  // === CENTRE ===
  { 
    id:'cinema',   
    x:0.4200, y:0.4200, w:0.160, h:0.160, 
    emoji:'🎬', color:'#c060c0', 
    npcs:[] 
  },
  // === ANNEAU 1 (Rayon 20%) ===
  { 
    id:'market',   
    x:0.4400, y:0.6400, w:0.120, h:0.120, 
    emoji:'🏪', color:'#c0a060', 
    npcs:[{id:'merchant',  name:'M. Diallo',    role:{fr:'Marchand',     en:'Merchant',       es:'Comerciante',  ht:'Machann',    de:'Händler',            ru:'Торговец',     zh:'商人',  ja:'商人'},  emoji:'🧑‍🌾'}] 
  },
  { 
    id:'park',     
    x:0.4400, y:0.2400, w:0.120, h:0.120, 
    emoji:'🌳', color:'#5a8a40', 
    npcs:[] 
  },
  // === ANNEAU 2 (Rayon 32%) ===
  { 
    id:'friends',  
    x:0.6663, y:0.6663, w:0.120, h:0.120, 
    emoji:'🤝', color:'#c09090', 
    npcs:[{id:'friend',    name:'Léa',          role:{fr:'Amie',         en:'Friend',         es:'Amiga',        ht:'Zanmi',      de:'Freundin',           ru:'Подруга',      zh:'朋友',  ja:'友達'},  emoji:'👧'}] 
  },
  { 
    id:'police',   
    x:0.2137, y:0.6663, w:0.120, h:0.120, 
    emoji:'🚔', color:'#6070a0', 
    npcs:[{id:'officer2',  name:'Cap. Koné',    role:{fr:'Policier',     en:'Police Officer', es:'Policía',      ht:'Polisye',    de:'Polizist',           ru:'Полицейский',  zh:'警察',  ja:'警察官'}, emoji:'👮‍♂️'}] 
  },
  { 
    id:'station',  
    x:0.2137, y:0.2137, w:0.120, h:0.120, 
    emoji:'🚉', color:'#b0a090', 
    npcs:[{id:'officer',   name:'Agent Kofi',   role:{fr:'Agent',        en:'Officer',        es:'Oficial',      ht:'Ofisye',     de:'Beamter',            ru:'Офицер',       zh:'警官',  ja:'警官'},  emoji:'👮'}] 
  },
  { 
    id:'bank',     
    x:0.6663, y:0.2137, w:0.120, h:0.120, 
    emoji:'🏦', color:'#c0c080', 
    npcs:[{id:'banker',    name:'M. Dupuis',    role:{fr:'Banquier',     en:'Banker',         es:'Banquero',     ht:'Bankye',     de:'Bankier',            ru:'Банкир',       zh:'银行家', ja:'銀行員'}, emoji:'👨‍💼'}] 
  },
  // === ANNEAU 3 (Rayon 46%) ===
  { 
    id:'hospital', 
    x:0.9000, y:0.4400, w:0.120, h:0.120, 
    emoji:'🏥', color:'#d0e0f0', 
    npcs:[
      {id:'doctor',    name:'Dr. Martin',   role:{fr:'Médecin',      en:'Doctor',         es:'Médico',       ht:'Doktè',      de:'Arzt',               ru:'Врач',         zh:'医生',  ja:'医者'},  emoji:'👨‍⚕️'},
      {id:'nurse',     name:'Sophie',       role:{fr:'Infirmière',   en:'Nurse',          es:'Enfermera',    ht:'Enfimyè',    de:'Krankenschwester',   ru:'Медсестра',    zh:'护士',  ja:'看護師'}, emoji:'👩‍⚕️'}
    ] 
  },
  { 
    id:'church',   
    x:0.5821, y:0.8775, w:0.120, h:0.120, 
    emoji:'⛪', color:'#8a7a60', 
    npcs:[{id:'pastor',    name:'Père Antoine', role:{fr:'Pasteur',      en:'Pastor',         es:'Pastor',       ht:'Pastè',      de:'Pfarrer',            ru:'Пастор',       zh:'牧师',  ja:'牧師'},  emoji:'⛪'}] 
  },
  { 
    id:'tavern',   
    x:0.0679, y:0.7104, w:0.120, h:0.120, 
    emoji:'🍺', color:'#8a6040', 
    npcs:[{id:'bartender', name:'Sam',          role:{fr:'Barman',       en:'Bartender',      es:'Camarero',     ht:'Baman',      de:'Barkeeper',          ru:'Бармен',       zh:'酒保',  ja:'バーテンダー'}, emoji:'🍸'}] 
  },
  { 
    id:'factory',  
    x:0.0679, y:0.1696, w:0.120, h:0.120, 
    emoji:'🏭', color:'#808080', 
    npcs:[{id:'farmer',    name:'Papa Joseph',  role:{fr:'Agriculteur',  en:'Farmer',         es:'Agricultor',   ht:'Agrikiltè',  de:'Bauer',              ru:'Фермер',       zh:'农民',  ja:'農家'},  emoji:'👨‍🌾'}] 
  },
  { 
    id:'school',   
    x:0.5821, y:0.0025, w:0.120, h:0.120, 
    emoji:'🏫', color:'#6a8ab0', 
    npcs:[{id:'teacher',   name:'Mme Dupont',   role:{fr:'Professeure',  en:'Teacher',        es:'Profesora',    ht:'Pwofesè',    de:'Lehrerin',           ru:'Учитель',      zh:'老师',  ja:'先生'},  emoji:'👩‍🏫'}] 
  },
];

// =================================================================
// NOMS ET DESCRIPTIONS DES LIEUX (multilingue)
// =================================================================
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
      { n:'voyager', t:{fr:'voyager',en:'to travel',es:'viajar',ht:'vwayaje',de:'reisen',ru:'путешествовать',zh:'旅行',ja:'旅行する'} },
    ]
  },
  salutations: {
    icon: '👋', fr: 'Salutations', en: 'Greetings', es: 'Saludos', ht: 'Bonjou', de: 'Begrüßungen', ru: 'Приветствия', zh: '问候', ja: '挨拶',
    words: [
      { n:'bonjour', t:{fr:'bonjour',en:'hello',es:'hola',ht:'bonjou',de:'hallo',ru:'здравствуйте',zh:'你好',ja:'こんにちは'} },
      { n:'au revoir', t:{fr:'au revoir',en:'goodbye',es:'adiós',ht:'oke',de:'auf wiedersehen',ru:'до свидания',zh:'再见',ja:'さようなら'} },
      { n:'merci', t:{fr:'merci',en:'thank you',es:'gracias',ht:'mèsi',de:'danke',ru:'спасибо',zh:'谢谢',ja:'ありがとう'} },
      { n:'s\'il vous plaît', t:{fr:'s\'il vous plaît',en:'please',es:'por favor',ht:'tanpri',de:'bitte',ru:'пожалуйста',zh:'请',ja:'お願いします'} },
      { n:'bonsoir', t:{fr:'bonsoir',en:'good evening',es:'buenas noches',ht:'bonswa',de:'guten abend',ru:'добрый вечер',zh:'晚上好',ja:'こんばんは'} },
    ]
  },
  voyage: {
    icon: '✈️', fr: 'Voyage', en: 'Travel', es: 'Viaje', ht: 'Vwayaj', de: 'Reise', ru: 'Путешествие', zh: '旅行', ja: '旅行',
    words: [
      { n:'aéroport', t:{fr:'aéroport',en:'airport',es:'aeropuerto',ht:'ayewopò',de:'Flughafen',ru:'аэропорт',zh:'机场',ja:'空港'} },
      { n:'billet', t:{fr:'billet',en:'ticket',es:'billete',ht:'tikè',de:'Fahrkarte',ru:'билет',zh:'票',ja:'切符'} },
      { n:'valise', t:{fr:'valise',en:'suitcase',es:'maleta',ht:'valiz',de:'Koffer',ru:'чемодан',zh:'行李箱',ja:'スーツケース'} },
      { n:'passeport', t:{fr:'passeport',en:'passport',es:'pasaporte',ht:'paspò',de:'Reisepass',ru:'паспорт',zh:'护照',ja:'パスポート'} },
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
      { n:'Je t\'aime.', t:{fr:'Je t\'aime.',en:'I love you.',es:'Te quiero.',ht:'Mwen renmen ou.',de:'Ich liebe dich.',ru:'Я тебя люблю.',zh:'我爱你。',ja:'愛しています。'} },
    ]
  },
  restaurant: {
    icon: '🍽️', fr: 'Restaurant', en: 'Restaurant', es: 'Restaurante', ht: 'Restoran', de: 'Restaurant', ru: 'Ресторан', zh: '餐厅', ja: 'レストラン',
    items: [
      { n:'Je voudrais commander.', t:{fr:'Je voudrais commander.',en:'I would like to order.',es:'Me gustaría pedir.',ht:'Mwen ta renmen kòmande.',de:'Ich möchte bestellen.',ru:'Я хотел бы заказать.',zh:'我想点餐。',ja:'注文したいです。'} },
      { n:'L\'addition, s\'il vous plaît.', t:{fr:'L\'addition, s\'il vous plaît.',en:'The bill, please.',es:'La cuenta, por favor.',ht:'Ladityon, tanpri.',de:'Die Rechnung, bitte.',ru:'Счет, пожалуйста.',zh:'买单，谢谢。',ja:'お会計をお願いします。'} },
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
      ht: 'Prezan an eksprime yon aksyon k ap pase kounye a oswa yon verite jeneral.',
    },
    formula: {
      fr: 'Sujet + verbe conjugué + complément',
      en: 'Subject + conjugated verb + complement',
    },
    examples: [
      { n:'Je mange une pomme.', t:{fr:'Je mange une pomme.',en:'I eat an apple.',es:'Yo como una manzana.',ht:'Mwen manje yon pòm.',de:'Ich esse einen Apfel.',ru:'Я ем яблоко.',zh:'我吃一个苹果。',ja:'私はリンゴを食べます。'} },
      { n:'Il parle français.', t:{fr:'Il parle français.',en:'He speaks French.',es:'Él habla francés.',ht:'Li pale franse.',de:'Er spricht Französisch.',ru:'Он говорит по-французски.',zh:'他说法语。',ja:'彼はフランス語を話します。'} },
    ]
  },
  passe_compose: {
    icon: '📅', fr: 'Passé composé', en: 'Past tense', es: 'Pasado compuesto', ht: 'Pase konpoze', de: 'Perfekt', ru: 'Прошедшее время', zh: '过去时', ja: '過去形',
    explanation: {
      fr: 'Le passé composé exprime une action terminée dans le passé.',
      en: 'The past tense expresses a completed action in the past.',
    },
    formula: {
      fr: 'Sujet + auxiliaire (avoir/être) + participe passé',
      en: 'Subject + auxiliary (have/be) + past participle',
    },
    examples: [
      { n:'J\'ai mangé une pomme.', t:{fr:'J\'ai mangé une pomme.',en:'I ate an apple.',es:'Yo comí una manzana.',ht:'Mwen te manje yon pòm.',de:'Ich habe einen Apfel gegessen.',ru:'Я съел яблоко.',zh:'我吃了一个苹果。',ja:'私はリンゴを食べました。'} },
    ]
  }
};

console.log('✅ data.js PREMIUM chargé — Village circulaire aligné');
