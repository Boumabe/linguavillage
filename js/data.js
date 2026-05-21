// data.js — PREMIUM EDITION
// LinguaVillage — Données avec village circulaire aligné
// ================================================================
// 
// ⚠️  INSTRUCTIONS DE FUSION :
//    1. Copier les sections VOCAB, PHRASES_DATA et GRAMMAR_DATA
//       depuis votre fichier data.js original dans ce fichier
//    2. Remplacer la section LOCATIONS par celle ci-dessous
//    3. Le reste du fichier reste identique
//
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
// LIEUX DU VILLAGE — POSITIONS CIRCULAIRES PARFAITES (PREMIUM)
// ================================================================
// Architecture: 4 anneaux concentriques + centre
//   Cercle 0 (Centre, rayon 0%):    Cinéma
//   Cercle 1 (Rayon 20%):           Marché (S), Parc (N)
//   Cercle 2 (Rayon 32%):           Amis (SE), Police (SW), Gare (NW), Banque (NE)
//   Cercle 3 (Rayon 46%):           Hôpital (E), Église (SSE), Taverne (WSW), 
//                                    Ferme (WNW), École (NNE)
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
  // Marché au Sud (90°), Parc au Nord (270°)
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
  // Amis SE (45°), Police SW (135°), Gare NW (225°), Banque NE (315°)
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
  // Hôpital E (0°), Église SSE (72°), Taverne WSW (144°), 
  // Ferme WNW (216°), École NNE (288°)
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
// STATE
// =================================================================
var S = window.S;

// =================================================================
// UI_TEXT
// =================================================================
var UI_TEXT = {
  fr:{sub:'Apprendre en vivant',lbl_native:'🌍 Votre langue maternelle',lbl_name:'✏️ Votre prénom',lbl_target:'🎯 Langue à apprendre',lbl_script:'✍️ Mode d\'écriture',play:'✨ Commencer',menu_title:'Que voulez-vous faire ?',menu_sub:'Choisissez votre mode d\'apprentissage',mb_village:'Village',mb_village_d:'Conversations IA + correcteur temps réel',mb_vocab:'Vocabulaire',mb_vocab_d:'1500 mots essentiels par catégories',mb_phrases:'Phrases & Structures',mb_phrases_d:'1000 phrases du quotidien',mb_grammar:'Grammaire',mb_grammar_d:'6 temps + 500 exemples expliqués',mb_dict:'Dictionnaire',mb_dict_d:'Traduction mot ou phrase complète'},
  ht:{sub:'Aprann pandan w ap viv',lbl_native:'🌍 Lang manman ou',lbl_name:'✏️ Prenon ou',lbl_target:'🎯 Lang ou vle aprann',lbl_script:'✍️ Fason pou ekri',play:'✨ Kòmanse',menu_title:'Kisa ou vle fè?',menu_sub:'Chwazi fason ou vle aprann',mb_village:'Vilaj',mb_village_d:'Konvèsasyon IA + korektè',mb_vocab:'Vokabilè',mb_vocab_d:'1500 mo esansyèl',mb_phrases:'Fraz & Estrikti',mb_phrases_d:'1000 fraz chak jou',mb_grammar:'Gramè',mb_grammar_d:'6 tan + 500 egzanp',mb_dict:'Diksyonè',mb_dict_d:'Tradui mo oswa fraz'},
  en:{sub:'Learn by living',lbl_native:'🌍 Your native language',lbl_name:'✏️ Your first name',lbl_target:'🎯 Language to learn',lbl_script:'✍️ Writing mode',play:'✨ Start',menu_title:'What do you want to do?',menu_sub:'Choose your learning mode',mb_village:'Village',mb_village_d:'AI conversations + real-time corrector',mb_vocab:'Vocabulary',mb_vocab_d:'1500 essential words by category',mb_phrases:'Phrases & Structures',mb_phrases_d:'1000 everyday phrases',mb_grammar:'Grammar',mb_grammar_d:'6 tenses + 500 explained examples',mb_dict:'Dictionary',mb_dict_d:'Translate word or full phrase'},
  es:{sub:'Aprender viviendo',lbl_native:'🌍 Tu idioma nativo',lbl_name:'✏️ Tu nombre',lbl_target:'🎯 Idioma a aprender',lbl_script:'✍️ Modo escritura',play:'✨ Empezar',menu_title:'¿Qué quieres hacer?',menu_sub:'Elige tu modo de aprendizaje',mb_village:'Pueblo',mb_village_d:'Conversaciones IA + corrector',mb_vocab:'Vocabulario',mb_vocab_d:'1500 palabras esenciales',mb_phrases:'Frases & Estructuras',mb_phrases_d:'1000 frases cotidianas',mb_grammar:'Gramática',mb_grammar_d:'6 tiempos + 500 ejemplos',mb_dict:'Diccionario',mb_dict_d:'Traducir palabra o frase'},
  de:{sub:'Durch Leben lernen',lbl_native:'🌍 Deine Muttersprache',lbl_name:'✏️ Dein Vorname',lbl_target:'🎯 Zu lernende Sprache',lbl_script:'✍️ Schreibmodus',play:'✨ Starten',menu_title:'Was möchtest du tun?',menu_sub:'Wähle deinen Lernmodus',mb_village:'Dorf',mb_village_d:'KI-Gespräche + Korrektur',mb_vocab:'Wortschatz',mb_vocab_d:'1500 wesentliche Wörter',mb_phrases:'Sätze & Strukturen',mb_phrases_d:'1000 Alltagssätze',mb_grammar:'Grammatik',mb_grammar_d:'6 Zeiten + 500 Beispiele',mb_dict:'Wörterbuch',mb_dict_d:'Wort oder Satz übersetzen'},
  ru:{sub:'Учиться живя',lbl_native:'🌍 Ваш родной язык',lbl_name:'✏️ Ваше имя',lbl_target:'🎯 Язык для изучения',lbl_script:'✍️ Режим письма',play:'✨ Начать',menu_title:'Что вы хотите делать?',menu_sub:'Выберите режим обучения',mb_village:'Деревня',mb_village_d:'ИИ разговоры + корректор',mb_vocab:'Словарь',mb_vocab_d:'1500 основных слов',mb_phrases:'Фразы и структуры',mb_phrases_d:'1000 повседневных фраз',mb_grammar:'Грамматика',mb_grammar_d:'6 времён + 500 примеров',mb_dict:'Словарь',mb_dict_d:'Перевод слова или фразы'},
  zh:{sub:'在生活中学习',lbl_native:'🌍 您的母语',lbl_name:'✏️ 您的名字',lbl_target:'🎯 要学习的语言',lbl_script:'✍️ 书写模式',play:'✨ 开始',menu_title:'您想做什么？',menu_sub:'选择学习模式',mb_village:'村庄',mb_village_d:'AI对话 + 实时纠错',mb_vocab:'词汇',mb_vocab_d:'1500个基本词汇',mb_phrases:'句子与结构',mb_phrases_d:'1000个日常句子',mb_grammar:'语法',mb_grammar_d:'6个时态 + 500个例句',mb_dict:'词典',mb_dict_d:'翻译单词或整句'},
  ja:{sub:'生きながら学ぶ',lbl_native:'🌍 あなたの母国語',lbl_name:'✏️ あなたの名前',lbl_target:'🎯 学ぶ言語',lbl_script:'✍️ 書き方',play:'✨ 始める',menu_title:'何をしたいですか？',menu_sub:'学習モードを選択',mb_village:'村',mb_village_d:'AI会話 + リアルタイム修正',mb_vocab:'語彙',mb_vocab_d:'1500の基本語彙',mb_phrases:'フレーズと構造',mb_phrases_d:'1000の日常フレーズ',mb_grammar:'文法',mb_grammar_d:'6つの時制 + 500例文',mb_dict:'辞書',mb_dict_d:'単語または文を翻訳'},
};

// =================================================================
// ==== COPIER VOS DONNÉES VOCAB, PHRASES, GRAMMAR ICI ====
// =================================================================
// 
// Remplacez cette section par vos données originales :
// - var VOCAB = [...]
// - var PHRASES_DATA = [...]  
// - var GRAMMAR_DATA = [...]
//
// Les données ci-dessous sont des placeholders minimaux.
// =================================================================

var VOCAB = [];
var PHRASES_DATA = [];
var GRAMMAR_DATA = [];

console.log('✅ data.js PREMIUM chargé — Village circulaire aligné');
console.log('⚠️  N\'oubliez pas de copier VOCAB, PHRASES_DATA et GRAMMAR_DATA depuis votre fichier original');
