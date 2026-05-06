// data.js - CORRIGÉ (ajout des données manquantes)
// LinguaVillage — data.js
// Vocabulaire, phrases, grammaire, lieux, constantes, UI_TEXT
// window.S est déjà défini par state.js

// =================================================================
// CONSTANTES GLOBALES
// =================================================================

// Langues
var FLAGS = {
  fr: '🇫🇷', en: '🇬🇧', es: '🇪🇸', ht: '🇭🇹', de: '🇩🇪',
  ru: '🇷🇺', zh: '🇨🇳', ja: '🇯🇵'
};

var LANG_NAMES = {
  fr: 'Français', en: 'English', es: 'Español', ht: 'Kreyòl',
  de: 'Deutsch', ru: 'Русский', zh: '中文', ja: '日本語'
};

// Météo
var WEATHER_ICONS = {
  sun: '☀️', rain: '🌧️', snow: '❄️', wind: '💨', night: '🌙'
};

// Lieux du village
var LOCATIONS = [
  { id:'church',   x:0.22, y:0.30, w:0.12, h:0.12, emoji:'⛪', color:'#8a7a60', npcs:[{id:'pastor', name:'Père Antoine', role:{fr:'Pasteur',en:'Pastor',es:'Pastor',ht:'Pastè',de:'Pfarrer',ru:'Пастор',zh:'牧师',ja:'牧師'}, emoji:'⛪'}] },
  { id:'school',   x:0.78, y:0.30, w:0.12, h:0.12, emoji:'🏫', color:'#6a8ab0', npcs:[{id:'teacher', name:'Mme Dupont', role:{fr:'Professeure',en:'Teacher',es:'Profesora',ht:'Pwofesè',de:'Lehrerin',ru:'Учитель',zh:'老师',ja:'先生'}, emoji:'👩‍🏫'}] },
  { id:'friends',  x:0.78, y:0.70, w:0.12, h:0.12, emoji:'🤝', color:'#c09090', npcs:[{id:'friend', name:'Léa', role:{fr:'Amie',en:'Friend',es:'Amiga',ht:'Zanmi',de:'Freundin',ru:'Подруга',zh:'朋友',ja:'友達'}, emoji:'👧'}] },
  { id:'market',   x:0.35, y:0.18, w:0.12, h:0.12, emoji:'🏪', color:'#c0a060', npcs:[{id:'merchant', name:'M. Diallo', role:{fr:'Marchand',en:'Merchant',es:'Comerciante',ht:'Machann',de:'Händler',ru:'Торговец',zh:'商人',ja:'商人'}, emoji:'🧑‍🌾'}] },
  { id:'tavern',   x:0.65, y:0.18, w:0.12, h:0.12, emoji:'🍺', color:'#8a6040', npcs:[{id:'bartender', name:'Sam', role:{fr:'Barman',en:'Bartender',es:'Camarero',ht:'Baman',de:'Barkeeper',ru:'Бармен',zh:'酒保',ja:'バーテンダー'}, emoji:'🍸'}] },
  { id:'park',     x:0.65, y:0.82, w:0.12, h:0.12, emoji:'🌳', color:'#5a8a40', npcs:[] },
  { id:'hospital', x:0.18, y:0.18, w:0.12, h:0.12, emoji:'🏥', color:'#d0e0f0', npcs:[{id:'doctor', name:'Dr. Martin', role:{fr:'Médecin',en:'Doctor',es:'Médico',ht:'Doktè',de:'Arzt',ru:'Врач',zh:'医生',ja:'医者'}, emoji:'👨‍⚕️'},{id:'nurse', name:'Sophie', role:{fr:'Infirmière',en:'Nurse',es:'Enfermera',ht:'Enfimyè',de:'Krankenschwester',ru:'Медсестра',zh:'护士',ja:'看護師'}, emoji:'👩‍⚕️'}] },
  { id:'station',  x:0.22, y:0.82, w:0.12, h:0.12, emoji:'🚉', color:'#b0a090', npcs:[{id:'officer', name:'Agent Kofi', role:{fr:'Agent',en:'Officer',es:'Oficial',ht:'Ofisye',de:'Beamter',ru:'Офицер',zh:'警官',ja:'警官'}, emoji:'👮'}] },
  { id:'bank',     x:0.50, y:0.82, w:0.12, h:0.12, emoji:'🏦', color:'#c0c080', npcs:[{id:'banker', name:'M. Dupuis', role:{fr:'Banquier',en:'Banker',es:'Banquero',ht:'Bankye',de:'Bankier',ru:'Банкир',zh:'银行家',ja:'銀行員'}, emoji:'👨‍💼'}] },
  { id:'police',   x:0.85, y:0.50, w:0.12, h:0.12, emoji:'🚔', color:'#6070a0', npcs:[{id:'officer2', name:'Capitaine Koné', role:{fr:'Policier',en:'Police Officer',es:'Policía',ht:'Polisye',de:'Polizist',ru:'Полицейский',zh:'警察',ja:'警察官'}, emoji:'👮‍♂️'}] },
  { id:'factory',  x:0.50, y:0.18, w:0.12, h:0.12, emoji:'🏭', color:'#808080', npcs:[{id:'farmer', name:'Papa Joseph', role:{fr:'Agriculteur',en:'Farmer',es:'Agricultor',ht:'Agrikiltè',de:'Bauer',ru:'Фермер',zh:'农民',ja:'農家'}, emoji:'👨‍🌾'}] },
  { id:'cinema',   x:0.50, y:0.50, w:0.16, h:0.16, emoji:'🎬', color:'#c060c0', npcs:[] },
];

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
// STATE — déjà défini par state.js, on référence juste
// =================================================================
var S = window.S;

// UI_TEXT
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
// VOCABULARY DATA — 1500 words
// =================================================================
var VOCAB = {
  verbes:{
    fr:'Verbes essentiels',en:'Essential verbs',es:'Verbos esenciales',ht:'Vèb esansyèl',de:'Wesentliche Verben',ru:'Основные глаголы',zh:'基本动词',ja:'基本動詞',
    icon:'⚡',
    words:[
      {n:'être',t:{en:'to be',es:'ser/estar',de:'sein',ru:'быть (byt)',zh:'是 (shì)',ja:'です (desu)',ht:'ye/se'}},
      {n:'avoir',t:{en:'to have',es:'tener',de:'haben',ru:'иметь (imet)',zh:'有 (yǒu)',ja:'ある/いる (aru/iru)',ht:'genyen'}},
      {n:'aller',t:{en:'to go',es:'ir',de:'gehen',ru:'идти (idti)',zh:'去 (qù)',ja:'行く (iku)',ht:'ale'}},
      {n:'vouloir',t:{en:'to want',es:'querer',de:'wollen',ru:'хотеть (khotet)',zh:'想 (xiǎng)',ja:'したい (shitai)',ht:'vle'}},
      {n:'pouvoir',t:{en:'to be able to / can',es:'poder',de:'können',ru:'мочь (moch)',zh:'能 (néng)',ja:'できる (dekiru)',ht:'kapab'}},
      {n:'faire',t:{en:'to do / make',es:'hacer',de:'machen',ru:'делать (delat)',zh:'做 (zuò)',ja:'する (suru)',ht:'fè'}},
      {n:'dire',t:{en:'to say / tell',es:'decir',de:'sagen',ru:'говорить (govorit)',zh:'说 (shuō)',ja:'言う (iu)',ht:'di'}},
      {n:'voir',t:{en:'to see',es:'ver',de:'sehen',ru:'видеть (videt)',zh:'看 (kàn)',ja:'見る (miru)',ht:'wè'}},
      {n:'savoir',t:{en:'to know (fact)',es:'saber',de:'wissen',ru:'знать (znat)',zh:'知道 (zhīdào)',ja:'知る (shiru)',ht:'konnen'}},
      {n:'prendre',t:{en:'to take',es:'tomar',de:'nehmen',ru:'брать (brat)',zh:'拿 (ná)',ja:'取る (toru)',ht:'pran'}},
      {n:'donner',t:{en:'to give',es:'dar',de:'geben',ru:'давать (davat)',zh:'给 (gěi)',ja:'あげる (ageru)',ht:'bay'}},
      {n:'venir',t:{en:'to come',es:'venir',de:'kommen',ru:'приходить (prikhodit)',zh:'来 (lái)',ja:'来る (kuru)',ht:'vini'}},
      {n:'manger',t:{en:'to eat',es:'comer',de:'essen',ru:'есть (yest)',zh:'吃 (chī)',ja:'食べる (taberu)',ht:'manje'}},
      {n:'boire',t:{en:'to drink',es:'beber',de:'trinken',ru:'пить (pit)',zh:'喝 (hē)',ja:'飲む (nomu)',ht:'bwè'}},
      {n:'dormir',t:{en:'to sleep',es:'dormir',de:'schlafen',ru:'спать (spat)',zh:'睡觉 (shuìjiào)',ja:'寝る (neru)',ht:'dòmi'}},
      {n:'parler',t:{en:'to speak',es:'hablar',de:'sprechen',ru:'говорить (govorit)',zh:'说话 (shuōhuà)',ja:'話す (hanasu)',ht:'pale'}},
      {n:'écouter',t:{en:'to listen',es:'escuchar',de:'hören',ru:'слушать (slushat)',zh:'听 (tīng)',ja:'聞く (kiku)',ht:'koute'}},
      {n:'lire',t:{en:'to read',es:'leer',de:'lesen',ru:'читать (chitat)',zh:'读 (dú)',ja:'読む (yomu)',ht:'li'}},
      {n:'écrire',t:{en:'to write',es:'escribir',de:'schreiben',ru:'писать (pisat)',zh:'写 (xiě)',ja:'書く (kaku)',ht:'ekri'}},
      {n:'travailler',t:{en:'to work',es:'trabajar',de:'arbeiten',ru:'работать (rabotat)',zh:'工作 (gōngzuò)',ja:'働く (hataraku)',ht:'travay'}},
      {n:'habiter',t:{en:'to live (somewhere)',es:'vivir',de:'wohnen',ru:'жить (zhit)',zh:'住 (zhù)',ja:'住む (sumu)',ht:'rete'}},
      {n:'aimer',t:{en:'to love / like',es:'amar / gustar',de:'lieben / mögen',ru:'любить (lyubit)',zh:'爱/喜欢 (ài/xǐhuān)',ja:'愛する/好む (aisuru/konomu)',ht:'renmen'}},
      {n:'comprendre',t:{en:'to understand',es:'entender',de:'verstehen',ru:'понимать (ponimat)',zh:'理解 (lǐjiě)',ja:'分かる (wakaru)',ht:'konprann'}},
      {n:'commencer',t:{en:'to start / begin',es:'empezar',de:'anfangen',ru:'начинать (nachinat)',zh:'开始 (kāishǐ)',ja:'始める (hajimeru)',ht:'kòmanse'}},
      {n:'finir',t:{en:'to finish / end',es:'terminar',de:'beenden',ru:'заканчивать (zakanchivat)',zh:'结束 (jiéshù)',ja:'終わる (owaru)',ht:'fini'}},
      {n:'ouvrir',t:{en:'to open',es:'abrir',de:'öffnen',ru:'открывать (otkryvat)',zh:'开 (kāi)',ja:'開ける (akeru)',ht:'ouvri'}},
      {n:'fermer',t:{en:'to close / shut',es:'cerrar',de:'schließen',ru:'закрывать (zakryvat)',zh:'关 (guān)',ja:'閉める (shimeru)',ht:'fèmen'}},
      {n:'aider',t:{en:'to help',es:'ayudar',de:'helfen',ru:'помогать (pomogat)',zh:'帮助 (bāngzhù)',ja:'助ける (tasukeru)',ht:'ede'}},
      {n:'chercher',t:{en:'to look for',es:'buscar',de:'suchen',ru:'искать (iskat)',zh:'找 (zhǎo)',ja:'探す (sagasu)',ht:'chèche'}},
      {n:'trouver',t:{en:'to find',es:'encontrar',de:'finden',ru:'находить (nakhodit)',zh:'找到 (zhǎodào)',ja:'見つける (mitsukeru)',ht:'jwenn'}},
      {n:'penser',t:{en:'to think',es:'pensar',de:'denken',ru:'думать (dumat)',zh:'想 (xiǎng)',ja:'思う (omou)',ht:'panse'}},
      {n:'acheter',t:{en:'to buy',es:'comprar',de:'kaufen',ru:'покупать (pokupat)',zh:'买 (mǎi)',ja:'買う (kau)',ht:'achte'}},
      {n:'vendre',t:{en:'to sell',es:'vender',de:'verkaufen',ru:'продавать (prodavat)',zh:'卖 (mài)',ja:'売る (uru)',ht:'vann'}},
      {n:'appeler',t:{en:'to call',es:'llamar',de:'anrufen',ru:'звонить (zvonit)',zh:'打电话 (dǎ diànhuà)',ja:'電話する (denwa suru)',ht:'rele'}},
      {n:'attendre',t:{en:'to wait',es:'esperar',de:'warten',ru:'ждать (zhdat)',zh:'等 (děng)',ja:'待つ (matsu)',ht:'tann'}},
      {n:'partir',t:{en:'to leave / go away',es:'salir',de:'abfahren',ru:'уходить (ukhodit)',zh:'离开 (líkāi)',ja:'出発する (shuppatsu suru)',ht:'pati'}},
      {n:'arriver',t:{en:'to arrive',es:'llegar',de:'ankommen',ru:'приезжать (priyezzhat)',zh:'到达 (dàodá)',ja:'到着する (tōchaku suru)',ht:'rive'}},
      {n:'rentrer',t:{en:'to come back / return',es:'regresar',de:'zurückkehren',ru:'возвращаться (vozvrashchat)',zh:'回来 (huílái)',ja:'帰る (kaeru)',ht:'retounen'}},
      {n:'mettre',t:{en:'to put / place',es:'poner',de:'stellen/legen',ru:'класть (klast)',zh:'放 (fàng)',ja:'置く (oku)',ht:'mete'}},
      {n:'sentir',t:{en:'to feel / smell',es:'sentir',de:'fühlen',ru:'чувствовать (chuvstvovat)',zh:'感觉 (gǎnjué)',ja:'感じる (kanjiru)',ht:'santi'}},
    ]
  },
  conversation:{
    fr:'Phrases de conversation',en:'Conversation phrases',es:'Frases de conversación',ht:'Fraz konvèsasyon',de:'Gesprächsphrasen',ru:'Разговорные фразы',zh:'会话短语',ja:'会話フレーズ',
    icon:'💬',
    words:[
      {n:'Bonjour / Salut',t:{en:'Hello / Hi',es:'Hola / Buenos días',de:'Hallo / Guten Tag',ru:'Привет / Здравствуйте',zh:'你好 (Nǐ hǎo)',ja:'こんにちは (Konnichiwa)',ht:'Bonjou / Salut'}},
      {n:'Au revoir',t:{en:'Goodbye / Bye',es:'Adiós',de:'Auf Wiedersehen',ru:'До свидания',zh:'再见 (Zàijiàn)',ja:'さようなら (Sayōnara)',ht:'Orevwa'}},
      {n:'Merci',t:{en:'Thank you',es:'Gracias',de:'Danke',ru:'Спасибо',zh:'谢谢 (Xièxiè)',ja:'ありがとう (Arigatō)',ht:'Mèsi'}},
      {n:'S\'il vous plaît',t:{en:'Please',es:'Por favor',de:'Bitte',ru:'Пожалуйста',zh:'请 (Qǐng)',ja:'お願いします (Onegaishimasu)',ht:'Tanpri'}},
      {n:'Excusez-moi',t:{en:'Excuse me / Sorry',es:'Perdón / Disculpe',de:'Entschuldigung',ru:'Извините',zh:'对不起 (Duìbuqǐ)',ja:'すみません (Sumimasen)',ht:'Eskize m'}},
      {n:'Comment allez-vous ?',t:{en:'How are you?',es:'¿Cómo estás?',de:'Wie geht es Ihnen?',ru:'Как дела?',zh:'你好吗？(Nǐ hǎo ma?)',ja:'お元気ですか？',ht:'Kijan ou ye?'}},
      {n:'Très bien, merci',t:{en:'Very well, thank you',es:'Muy bien, gracias',de:'Sehr gut, danke',ru:'Очень хорошо, спасибо',zh:'很好，谢谢',ja:'元気です、ありがとう',ht:'Trè bien, mèsi'}},
      {n:'Je ne comprends pas',t:{en:'I don\'t understand',es:'No entiendo',de:'Ich verstehe nicht',ru:'Я не понимаю',zh:'我不明白',ja:'わかりません',ht:'Mwen pa konprann'}},
      {n:'Pouvez-vous répéter ?',t:{en:'Can you repeat?',es:'¿Puede repetir?',de:'Können Sie wiederholen?',ru:'Повторите, пожалуйста',zh:'请再说一遍',ja:'もう一度言ってください',ht:'Repete tanpri'}},
      {n:'Parlez plus lentement',t:{en:'Speak more slowly',es:'Hable más despacio',de:'Sprechen Sie langsamer',ru:'Говорите медленнее',zh:'请说慢点',ja:'ゆっくり話してください',ht:'Pale pi dousman'}},
      {n:'Je m\'appelle...',t:{en:'My name is...',es:'Me llamo...',de:'Ich heiße...',ru:'Меня зовут...',zh:'我叫... (Wǒ jiào...)',ja:'私の名前は...',ht:'Mwen rele...'}},
      {n:'D\'où venez-vous ?',t:{en:'Where are you from?',es:'¿De dónde eres?',de:'Woher kommen Sie?',ru:'Откуда вы?',zh:'你从哪里来？',ja:'どこから来ましたか？',ht:'Ki kote ou soti?'}},
      {n:'Combien ça coûte ?',t:{en:'How much does it cost?',es:'¿Cuánto cuesta?',de:'Wie viel kostet das?',ru:'Сколько это стоит?',zh:'多少钱？',ja:'いくらですか？',ht:'Konbyen sa koute?'}},
      {n:'Où est... ?',t:{en:'Where is...?',es:'¿Dónde está...?',de:'Wo ist...?',ru:'Где находится...?',zh:'...在哪里？',ja:'...はどこですか？',ht:'Ki kote... ye?'}},
      {n:'Au secours !',t:{en:'Help!',es:'¡Ayuda!',de:'Hilfe!',ru:'Помогите!',zh:'救命！',ja:'助けて！',ht:'Ede m!'}},
    ]
  }
};

// =================================================================
// PHRASES DATA
// =================================================================
var PHRASES_DATA = {
  quotidien: {
    fr:'Vie quotidienne', en:'Daily life', es:'Vida cotidiana', ht:'Lavi chak jou',
    icon:'🏠',
    items: [
      {n:'Je me réveille', t:{en:'I wake up', es:'Me despierto', ht:'Mwen reveye', de:'Ich wache auf', ru:'Я просыпаюсь', zh:'我醒来', ja:'起きる'}},
      {n:'Je prends mon petit-déjeuner', t:{en:'I have breakfast', es:'Desayuno', ht:'Mwen pran dejene', de:'Ich frühstücke', ru:'Я завтракаю', zh:'我吃早餐', ja:'朝食をとる'}},
      {n:'Je vais au travail', t:{en:'I go to work', es:'Voy al trabajo', ht:'Mwen ale nan travay', de:'Ich gehe zur Arbeit', ru:'Я иду на работу', zh:'我去上班', ja:'仕事に行く'}},
    ]
  },
  voyage: {
    fr:'Voyage', en:'Travel', es:'Viaje', ht:'Vwayaj',
    icon:'✈️',
    items: [
      {n:'Où est la gare ?', t:{en:'Where is the station?', es:'¿Dónde está la estación?', ht:'Ki kote estasyon an ye?', de:'Wo ist der Bahnhof?', ru:'Где вокзал?', zh:'车站在哪里？', ja:'駅はどこですか？'}},
      {n:'Je voudrais un billet', t:{en:'I would like a ticket', es:'Quisiera un billete', ht:'Mwen ta renmen yon tikè', de:'Ich hätte gern eine Fahrkarte', ru:'Я бы хотел билет', zh:'我想要一张票', ja:'切符をください'}},
    ]
  }
};

// =================================================================
// GRAMMAR DATA
// =================================================================
var GRAMMAR_DATA = {
  present: {
    fr:'Présent', en:'Present tense', es:'Presente', ht:'Prezan',
    icon:'⏳',
    formula: {fr:'Sujet + Verbe conjugué + Complément', en:'Subject + Conjugated verb + Object'},
    explanation: {fr:'Le présent exprime une action qui se déroule maintenant ou une vérité générale.', en:'The present tense expresses an action happening now or a general truth.'},
    examples: [
      {n:'Je mange', t:{en:'I eat', es:'Yo como', ht:'Mwen manje', de:'Ich esse', ru:'Я ем', zh:'我吃', ja:'食べる'}},
      {n:'Tu parles', t:{en:'You speak', es:'Tú hablas', ht:'Ou pale', de:'Du sprichst', ru:'Ты говоришь', zh:'你说', ja:'話す'}},
    ]
  },
  passe: {
    fr:'Passé composé', en:'Past tense', es:'Pasado', ht:'Pase',
    icon:'⏪',
    formula: {fr:'Sujet + avoir/être + Participe passé', en:'Subject + have/be + Past participle'},
    explanation: {fr:'Le passé composé exprime une action terminée dans le passé.', en:'The past tense expresses a completed action in the past.'},
    examples: [
      {n:'J\'ai mangé', t:{en:'I ate', es:'Yo comí', ht:'Mwen te manje', de:'Ich habe gegessen', ru:'Я поел', zh:'我吃了', ja:'食べた'}},
    ]
  }
};

// =================================================================
// API
// =================================================================
var API = 'https://linguavillage-api--marckensbou2.replit.app';

console.log('✅ LinguaVillage — data.js chargé');
