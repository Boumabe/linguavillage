/* =================================================================
   app.js — LinguaVillage
   Logique principale : UI, Village, Dialogue, Vocabulaire,
   Phrases, Grammaire, Dictionnaire, XP
   Dépendances : save.js, cinema.js, missions.js (chargés avant)
   ================================================================= */

// Reprise sauvegarde — exécuté après le bloc principal (IIFE ligne 1359)

const API = 'https://linguavillage-api--marckensbou2.replit.app';

// =================================================================
// UI TRANSLATIONS
// =================================================================
const UI_TEXT = {
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
// VOCABULARY DATA — 1500 words organized by category
// =================================================================
const VOCAB = {
  verbes:{
    fr:'Verbes essentiels',en:'Essential verbs',es:'Verbos esenciales',ht:'Vèb esansyèl',de:'Wesentliche Verben',ru:'Основные глаголы',zh:'基本动词',ja:'基本動詞',
    icon:'⚡',
    words:[
      {n:'être',t:{en:'to be',es:'ser/estar',de:'sein',ru:'быть',zh:'是',ja:'です',ht:'ye/se'}},
      {n:'avoir',t:{en:'to have',es:'tener',de:'haben',ru:'иметь',zh:'有',ja:'ある',ht:'genyen'}},
      {n:'aller',t:{en:'to go',es:'ir',de:'gehen',ru:'идти',zh:'去',ja:'行く',ht:'ale'}},
      {n:'manger',t:{en:'to eat',es:'comer',de:'essen',ru:'есть',zh:'吃',ja:'食べる',ht:'manje'}},
      {n:'parler',t:{en:'to speak',es:'hablar',de:'sprechen',ru:'говорить',zh:'说',ja:'話す',ht:'pale'}}
    ]
  },
  salutations:{
    fr:'Salutations',en:'Greetings',es:'Saludos',ht:'Salitasyon',de:'Grüße',ru:'Приветствия',zh:'问候',ja:'挨拶',
    icon:'👋',
    words:[
      {n:'bonjour',t:{en:'hello',es:'hola',de:'hallo',ru:'привет',zh:'你好',ja:'こんにちは',ht:'bonjou'}},
      {n:'merci',t:{en:'thank you',es:'gracias',de:'danke',ru:'спасибо',zh:'谢谢',ja:'ありがとう',ht:'mèsi'}},
      {n:'oui',t:{en:'yes',es:'sí',de:'ja',ru:'да',zh:'是',ja:'はい',ht:'wi'}},
      {n:'non',t:{en:'no',es:'no',de:'nein',ru:'нет',zh:'不',ja:'いいえ',ht:'non'}},
      {n:"s'il vous plaît",t:{en:'please',es:'por favor',de:'bitte',ru:'пожалуйста',zh:'请',ja:'ください',ht:'tanpri'}}
    ]
  }
};
  
// =================================================================
// PHRASES DATA — 1000 everyday phrases
// =================================================================
const PHRASES_DATA = {
  quotidien:{
    fr:'Vie quotidienne',en:'Daily life',es:'Vida cotidiana',ht:'Lavi chak jou',de:'Alltag',ru:'Повседневная жизнь',zh:'日常生活',ja:'日常生活',
    icon:'☀️',
    items:[
      {n:'Bonjour, comment allez-vous ?',t:{en:'Hello, how are you?',es:'Hola, ¿cómo está?',de:'Hallo, wie geht es Ihnen?',ru:'Привет, как дела?',zh:'你好吗？',ja:'お元気ですか？',ht:'Bonjou, kijan ou ye?'}},
      {n:"Je m'appelle Paul.",t:{en:'My name is Paul.',es:'Me llamo Paul.',de:'Ich heiße Paul.',ru:'Меня зовут Поль.',zh:'我叫保罗。',ja:'私はポールです。',ht:'Mwen rele Paul.'}},
      {n:"Je voudrais un café, s'il vous plaît.",t:{en:'I would like a coffee, please.',es:'Quisiera un café, por favor.',de:'Ich möchte einen Kaffee, bitte.',ru:'Кофе, пожалуйста.',zh:'请给我一杯咖啡。',ja:'コーヒーをください。',ht:'Mwen ta renmen yon kafe, tanpri.'}},
      {n:'Où est la gare ?',t:{en:'Where is the station?',es:'¿Dónde está la estación?',de:'Wo ist der Bahnhof?',ru:'Где вокзал?',zh:'火车站在哪里？',ja:'駅はどこですか？',ht:'Ki kote estasyon an ye?'}},
      {n:'Combien ça coûte ?',t:{en:'How much does it cost?',es:'¿Cuánto cuesta?',de:'Wie viel kostet das?',ru:'Сколько стоит?',zh:'多少钱？',ja:'いくらですか？',ht:'Konbyen sa koute?'}}
    ]
  }
};
  // =================================================================
// GRAMMAR DATA
// =================================================================
const GRAMMAR_DATA = {
  present:{
    fr:'Présent',en:'Present tense',es:'Presente',ht:'Prezan',de:'Präsens',ru:'Настоящее',zh:'现在时',ja:'現在形',
    icon:'🕐',
    explanation:{
      fr:'Le présent décrit ce qui se passe maintenant ou ce qui est habituel.',
      en:'The present tense describes what is happening now or what is habitual.',
      es:'El presente describe lo que sucede ahora o lo que es habitual.',
      ht:'Prezan an dekri sa k ap pase kounye a oswa sa ki abitye pase.',
      de:'Das Präsens beschreibt was jetzt passiert oder was gewöhnlich passiert.',
      ru:'Настоящее время описывает то, что происходит сейчас.',
      zh:'现在时描述现在发生的事情。',
      ja:'現在形は今起きていることを表します。'
    },
    formula:{fr:'Sujet + Verbe',en:'Subject + Verb',es:'Sujeto + Verbo',ht:'Sijè + Vèb',de:'Subjekt + Verb',ru:'Подлежащее + Глагол',zh:'主语+动词',ja:'主語+動詞'},
    examples:[
      {n:'Je mange une pomme.',t:{en:'I eat an apple.',es:'Como una manzana.',de:'Ich esse einen Apfel.',ru:'Я ем яблоко.',zh:'我吃苹果。',ja:'私はリンゴを食べます。',ht:'Mwen manje yon pòm.'}},
      {n:'Il travaille chaque jour.',t:{en:'He works every day.',es:'Él trabaja cada día.',de:'Er arbeitet jeden Tag.',ru:'Он работает каждый день.',zh:'他每天工作。',ja:'彼は毎日働きます。',ht:'Li travay chak jou.'}},
      {n:'Nous parlons français.',t:{en:'We speak French.',es:'Hablamos francés.',de:'Wir sprechen Französisch.',ru:'Мы говорим по-французски.',zh:'我们说法语。',ja:'フランス語を話します。',ht:'Nou pale fransè.'}},
      {n:'Elle ne mange pas de viande.',t:{en:'She does not eat meat.',es:'Ella no come carne.',de:'Sie isst kein Fleisch.',ru:'Она не ест мясо.',zh:'她不吃肉。',ja:'彼女は肉を食べません。',ht:'Li pa manje vyann.'}},
      {n:'Tu aimes le café ?',t:{en:'Do you like coffee?',es:'¿Te gusta el café?',de:'Magst du Kaffee?',ru:'Ты любишь кофе?',zh:'你喜欢咖啡吗？',ja:'コーヒーは好きですか？',ht:'Ou renmen kafe?'}}
    ]
  },
  passe_compose:{
    fr:'Passé composé',en:'Past tense',es:'Pretérito perfecto',ht:'Tan pase',de:'Perfekt',ru:'Прошедшее',zh:'复合过去时',ja:'複合過去',
    icon:'⏮️',
    explanation:{
      fr:'Le passé composé décrit des actions terminées dans le passé.',
      en:'The past tense describes actions completed in the past.',
      es:'Describe acciones completadas en el pasado.',
      ht:'Tan pase a dekri aksyon ki te fini nan tan pase.',
      de:'Das Perfekt beschreibt abgeschlossene Handlungen.',
      ru:'Обозначает завершённые действия в прошлом.',
      zh:'描述过去完成的动作。',
      ja:'過去に完了した行為を表します。'
    },
    formula:{fr:'avoir/être + Participe passé',en:'avoir/être + Past participle',es:'avoir/être + Participio',ht:'avoir/être + Patisip',de:'haben/sein + Partizip',ru:'avoir/être + Причастие',zh:'avoir/être + 过去分词',ja:'avoir/être + 過去分詞'},
    examples:[
      {n:"J'ai mangé au restaurant.",t:{en:'I ate at the restaurant.',es:'Comí en el restaurante.',de:'Ich habe im Restaurant gegessen.',ru:'Я ел в ресторане.',zh:'我在餐厅吃了饭。',ja:'レストランで食べました。',ht:'Mwen manje nan restoran an.'}},
      {n:'Elle est partie ce matin.',t:{en:'She left this morning.',es:'Ella salió esta mañana.',de:'Sie ist heute Morgen gegangen.',ru:'Она ушла утром.',zh:'她今早离开了。',ja:'今朝出発しました。',ht:'Li pati maten an.'}},
      {n:'Nous avons fini le travail.',t:{en:'We finished the work.',es:'Terminamos el trabajo.',de:'Wir haben die Arbeit beendet.',ru:'Мы закончили работу.',zh:'我们完成了工作。',ja:'仕事を終えました。',ht:'Nou fini travay la.'}},
      {n:'As-tu vu ce film ?',t:{en:'Did you see that film?',es:'¿Viste esa película?',de:'Hast du den Film gesehen?',ru:'Ты видел этот фильм?',zh:'你看过那部电影吗？',ja:'その映画を見ましたか？',ht:'Ou te wè fim sa a?'}},
      {n:"Il n'a pas répondu.",t:{en:'He did not answer.',es:'Él no respondió.',de:'Er hat nicht geantwortet.',ru:'Он не ответил.',zh:'他没有回答。',ja:'彼は答えませんでした。',ht:'Li pa reponn.'}}
    ]
  }
};
  // =================================================================
// LOCATIONS DATA
// =================================================================
const LOC_NAMES = {
  church:{fr:'Église',ht:'Legliz',en:'Church',es:'Iglesia',de:'Kirche',ru:'Церковь',zh:'教堂',ja:'教会'},
  school:{fr:'École',ht:'Lekòl',en:'School',es:'Escuela',de:'Schule',ru:'Школа',zh:'学校',ja:'学校'},
  factory:{fr:'Atelier',ht:'Atelye',en:'Workshop',es:'Taller',de:'Werkstatt',ru:'Мастерская',zh:'工坊',ja:'工房'},
  market:{fr:'Marché',ht:'Mache',en:'Market',es:'Mercado',de:'Markt',ru:'Рынок',zh:'市场',ja:'市場'},
  hospital:{fr:'Hôpital',ht:'Lopital',en:'Hospital',es:'Hospital',de:'Krankenhaus',ru:'Больница',zh:'医院',ja:'病院'},
  tavern:{fr:'Taverne',ht:'Tàvèn',en:'Tavern',es:'Taberna',de:'Taverne',ru:'Таверна',zh:'酒馆',ja:'酒場'},
  friends:{fr:'Maison des amis',ht:'Kay zanmi',en:'Friends\' House',es:'Casa amigos',de:'Freundeshaus',ru:'Дом друзей',zh:'友谊之家',ja:'友達の家'},
  park:{fr:'Parc',ht:'Pak',en:'Park',es:'Parque',de:'Park',ru:'Парк',zh:'公园',ja:'公園'},
  police:{fr:'Police',ht:'Lapolis',en:'Police',es:'Policía',de:'Polizei',ru:'Полиция',zh:'警察',ja:'警察'},
  bank:{fr:'Banque',ht:'Bank',en:'Bank',es:'Banco',de:'Bank',ru:'Банк',zh:'银行',ja:'銀行'},
  station:{fr:'Gare',ht:'Estasyon',en:'Station',es:'Estación',de:'Bahnhof',ru:'Вокзал',zh:'车站',ja:'駅'},
  farm:{fr:'Ferme',ht:'Fèm',en:'Farm',es:'Granja',de:'Bauernhof',ru:'Ферма',zh:'农场',ja:'農場'},
};
const LOC_DESC = {
  church:{fr:'Politesse formelle',en:'Formal politeness',ht:'Politès fòmèl',es:'Educación formal',de:'Formelle Höflichkeit',ru:'Вежливость',zh:'正式礼节',ja:'礼儀'},
  school:{fr:'Grammaire et conjugaison',en:'Grammar & conjugation',ht:'Gramè',es:'Gramática',de:'Grammatik',ru:'Грамматика',zh:'语法',ja:'文法'},
  factory:{fr:'Vocabulaire du travail',en:'Work vocabulary',ht:'Vokabilè travay',es:'Vocabulario trabajo',de:'Arbeit',ru:'Работа',zh:'工作',ja:'仕事'},
  market:{fr:'Chiffres et achats',en:'Numbers & shopping',ht:'Chif ak acha',es:'Compras',de:'Einkaufen',ru:'Покупки',zh:'购物',ja:'買い物'},
  hospital:{fr:'Corps et santé',en:'Body & health',ht:'Kò ak sante',es:'Salud',de:'Gesundheit',ru:'Здоровье',zh:'健康',ja:'健康'},
  tavern:{fr:'Expressions familières',en:'Casual talk',ht:'Ekspresyon familyè',es:'Informal',de:'Umgangssprache',ru:'Разговорный',zh:'日常用语',ja:'くだけた表現'},
  friends:{fr:'Émotions et amitié',en:'Emotions & friendship',ht:'Emosyon',es:'Emociones',de:'Emotionen',ru:'Эмоции',zh:'情感',ja:'感情'},
  park:{fr:'Vocabulaire affectif',en:'Affectionate vocab',ht:'Vokabilè afektif',es:'Afectivo',de:'Liebevoll',ru:'Ласковые слова',zh:'感情词汇',ja:'愛情表現'},
  police:{fr:'Directions et urgences',en:'Directions & emergencies',ht:'Direksyon',es:'Emergencias',de:'Notfälle',ru:'Направления',zh:'方向与紧急',ja:'方向と緊急'},
  bank:{fr:'Argent et transactions',en:'Money & transactions',ht:'Lajan',es:'Dinero',de:'Geld',ru:'Деньги',zh:'金钱',ja:'お金'},
  station:{fr:'Voyages et horaires',en:'Travel & schedules',ht:'Vwayaj',es:'Viajes',de:'Reisen',ru:'Путешествия',zh:'旅行',ja:'旅行'},
  farm:{fr:'Nature et animaux',en:'Nature & animals',ht:'Nati ak bèt',es:'Naturaleza',de:'Natur',ru:'Природа',zh:'自然',ja:'自然'},
};
const LOCATIONS = [
  {id:'church',emoji:'⛪',color:'#6a50a8',x:0.42,y:0.38,w:0.10,h:0.12,npcs:[
    {id:'pastor',emoji:'🧑‍⚖️',name:'Morgan',role:{fr:'Pasteur·e',en:'Pastor',ht:'Pastè',es:'Pastor/a',de:'Pastor/in',ru:'Пастор',zh:'牧师',ja:'牧師'},ctx:'Tu es Morgan, pasteur bienveillant. Tu parles avec respect et solennité. Tu enseignes la politesse formelle.'},
    {id:'choir',emoji:'🎵',name:'River',role:{fr:'Choriste',en:'Choir',ht:'Chantè',es:'Corista',de:'Chor',ru:'Хорист',zh:'合唱',ja:'聖歌隊'},ctx:'Tu es River, choriste. Tu enseignes la prononciation par la musique.'}]},
  {id:'school',emoji:'🏫',color:'#3a7aaa',x:0.53,y:0.44,w:0.10,h:0.12,npcs:[
    {id:'teacher',emoji:'🧑‍🏫',name:'Robin',role:{fr:'Professeur·e',en:'Teacher',ht:'Pwofesè',es:'Profesor/a',de:'Lehrer/in',ru:'Учитель',zh:'老师',ja:'先生'},ctx:'Tu es Robin, professeur patient. Tu corriges doucement et expliques simplement.'},
    {id:'student',emoji:'🧒',name:'Charlie',role:{fr:'Élève',en:'Student',ht:'Elèv',es:'Estudiante',de:'Schüler/in',ru:'Ученик',zh:'学生',ja:'生徒'},ctx:'Tu es Charlie, élève curieux. Tu apprends avec le joueur.'}]},
  {id:'market',emoji:'🛒',color:'#2a8a50',x:0.31,y:0.44,w:0.10,h:0.12,npcs:[
    {id:'vendor',emoji:'🧑‍🍳',name:'Sage',role:{fr:'Vendeur·se',en:'Vendor',ht:'Machann',es:'Vendedor/a',de:'Verkäufer/in',ru:'Продавец',zh:'商贩',ja:'売り手'},ctx:'Tu es Sage, vendeur souriant. Tu parles de prix et quantités.'},
    {id:'cashier',emoji:'💰',name:'Quinn',role:{fr:'Caissier·ère',en:'Cashier',ht:'Kesye',es:'Cajero/a',de:'Kassierer/in',ru:'Кассир',zh:'收银员',ja:'レジ係'},ctx:'Tu es Quinn, caissier méthodique. Tu comptes à voix haute.'}]},
  {id:'hospital',emoji:'🏥',color:'#aa3a3a',x:0.64,y:0.34,w:0.10,h:0.12,npcs:[
    {id:'doctor',emoji:'🧑‍⚕️',name:'Drew',role:{fr:'Médecin',en:'Doctor',ht:'Doktè',es:'Médico/a',de:'Arzt/in',ru:'Врач',zh:'医生',ja:'医師'},ctx:'Tu es Drew, médecin calme. Tu parles du corps humain.'},
    {id:'nurse',emoji:'💊',name:'Avery',role:{fr:'Infirmier·ère',en:'Nurse',ht:'Enfimyè',es:'Enfermero/a',de:'Pfleger/in',ru:'Медсестра',zh:'护士',ja:'看護師'},ctx:'Tu es Avery, infirmier attentionné.'}]},
  {id:'tavern',emoji:'🍺',color:'#8a4a10',x:0.20,y:0.34,w:0.10,h:0.12,npcs:[
    {id:'bartender',emoji:'🧑‍🍽️',name:'Lane',role:{fr:'Barman·aid',en:'Bartender',ht:'Bòkay',es:'Bartender',de:'Barkeeper/in',ru:'Бармен',zh:'酒保',ja:'バーテンダー'},ctx:'Tu es Lane, barman jovial. Tu utilises des expressions populaires.'},
    {id:'regular',emoji:'🎲',name:'Sky',role:{fr:'Client·e',en:'Regular',ht:'Kliyan',es:'Cliente',de:'Stammgast',ru:'Завсегдатай',zh:'常客',ja:'常連'},ctx:'Tu es Sky, habitué décontracté. Tu parles de ta journée.'}]},
  {id:'friends',emoji:'🏠',color:'#3a6aaa',x:0.20,y:0.54,w:0.10,h:0.12,npcs:[
    {id:'friend',emoji:'🤝',name:'Alex',role:{fr:'Ami·e',en:'Friend',ht:'Zanmi',es:'Amigo/a',de:'Freund/in',ru:'Друг',zh:'朋友',ja:'友達'},ctx:'Tu es Alex, le meilleur ami. Tu parles avec affection.'},
    {id:'neighbor',emoji:'😊',name:'Jamie',role:{fr:'Voisin·e',en:'Neighbor',ht:'Vwazen',es:'Vecino/a',de:'Nachbar/in',ru:'Сосед',zh:'邻居',ja:'隣人'},ctx:'Tu es Jamie, voisin agréable.'}]},
  {id:'park',emoji:'🌳',color:'#6a9a30',x:0.64,y:0.54,w:0.10,h:0.12,npcs:[
    {id:'partner',emoji:'💝',name:'Sam',role:{fr:'Partenaire',en:'Partner',ht:'Patnè',es:'Pareja',de:'Partner/in',ru:'Партнёр',zh:'伴侣',ja:'パートナー'},ctx:'Tu es Sam, partenaire romantique. Tu parles avec douceur et respect.'}]},
  {id:'police',emoji:'👮',color:'#2a4a8a',x:0.15,y:0.20,w:0.10,h:0.12,npcs:[
    {id:'officer',emoji:'🧑‍✈️',name:'Remy',role:{fr:'Agent·e',en:'Officer',ht:'Ofisye',es:'Agente',de:'Beamter/in',ru:'Офицер',zh:'警察',ja:'警察官'},ctx:'Tu es Remy, agent professionnel. Tu donnes des directions.'}]},
  {id:'bank',emoji:'🏦',color:'#5a7a30',x:0.42,y:0.18,w:0.10,h:0.12,npcs:[
    {id:'banker',emoji:'💼',name:'Reese',role:{fr:'Banquier·ère',en:'Banker',ht:'Bankye',es:'Banquero/a',de:'Banker/in',ru:'Банкир',zh:'银行家',ja:'銀行員'},ctx:'Tu es Reese, banquier formel.'}]},
  {id:'station',emoji:'🚉',color:'#4a4a8a',x:0.69,y:0.20,w:0.10,h:0.12,npcs:[
    {id:'stationmaster',emoji:'🚂',name:'Pax',role:{fr:'Chef de gare',en:'Stationmaster',ht:'Chèf estasyon',es:'Jefe de estación',de:'Bahnhofsvorsteher/in',ru:'Начальник вокзала',zh:'站长',ja:'駅長'},ctx:'Tu es Pax, chef de gare précis.'},
    {id:'traveler',emoji:'🧳',name:'Wren',role:{fr:'Voyageur·se',en:'Traveler',ht:'Vwayajè',es:'Viajero/a',de:'Reisende/r',ru:'Путешественник',zh:'旅行者',ja:'旅行者'},ctx:'Tu es Wren, voyageur curieux.'}]},
  {id:'farm',emoji:'🌾',color:'#7a6a20',x:0.10,y:0.44,w:0.10,h:0.12,npcs:[
    {id:'farmer',emoji:'🧑‍🌾',name:'Dale',role:{fr:'Fermier·ère',en:'Farmer',ht:'Kiltivatè',es:'Granjero/a',de:'Bauer/in',ru:'Фермер',zh:'农民',ja:'農家'},ctx:'Tu es Dale, fermier proche de la nature.'}]},
  {id:'factory',emoji:'🏭',color:'#8a6a30',x:0.74,y:0.44,w:0.10,h:0.12,npcs:[
    {id:'foreman',emoji:'👷',name:'Casey',role:{fr:'Contremaître·sse',en:'Foreman',ht:'Chèf travay',es:'Capataz',de:'Vorarbeiter/in',ru:'Прораб',zh:'工头',ja:'現場監督'},ctx:'Tu es Casey, contremaître direct.'},
    {id:'craftsperson',emoji:'🔨',name:'Blake',role:{fr:'Artisan·e',en:'Craftsperson',ht:'Atizan',es:'Artesano/a',de:'Handwerker/in',ru:'Мастер',zh:'工匠',ja:'職人'},ctx:'Tu es Blake, artisan fier.'}]},
  {id:'cinema',emoji:'🎬',color:'#8a2080',x:0.42,y:0.60,w:0.10,h:0.12,npcs:[
  {id:'projectionist',emoji:'🎥',name:'Milly',
   role:{fr:'Projectionniste',en:'Projectionist',ht:'Pwojeksyonis',es:'Proyeccionista',de:'Vorführerin',ru:'Киномеханик',zh:'放映员',ja:'映写技師'},
   ctx:'Tu es Milly, projectionniste passionnée. Tu présentes des vidéos authentiques pour aider à apprendre la langue.'}
]},
];

// =================================================================
// STATE
// =================================================================
let S={playerName:'',nativeLang:'',targetLang:'',scriptPref:'both',xp:0,level:1,
  currentLoc:null,currentNPC:null,chatHistory:[]};
let ui={};
let currentWeather='sun';
let canvas,ctx,tick=0,hoveredLoc=null;
let popupWord='';
let dictMode='word';
let dictHistory=[];
let dictFromScreen='screen-menu';
let isRecording=false;
let recognition=null;
const WEATHER_ICONS={sun:'☀️',rain:'🌧️',wind:'💨',night:'🌙',snow:'❄️'};
const LANG_NAMES={en:'anglais',fr:'français',es:'espagnol',ht:'créole haïtien',de:'allemand',ru:'russe',zh:'mandarin',ja:'japonais'};
const FLAGS={en:'🇬🇧',fr:'🇫🇷',es:'🇪🇸',ht:'🇭🇹',de:'🇩🇪',ru:'🇷🇺',zh:'🇨🇳',ja:'🇯🇵'};






// 4. Sélection du script (pour les langues CJK)
function selScript(p, btn) {
  document.querySelectorAll('.sc-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  S.scriptPref = p;
  
  const playBtn = document.getElementById('playBtn');
  playBtn.style.display = 'block';
  playBtn.disabled = false;
}

  // =================================================================
// APPLY UI
// =================================================================
// On passe 'lang' en paramètre pour être sûr de ce qu'on traduit
function applyUI(lang) {
  // On définit 'ui' localement avec 'const' pour éviter les conflits globaux
  const ui = UI_TEXT[lang] || UI_TEXT['fr'];
  
  // Mise à jour de l'accueil
  document.getElementById('ws-sub').textContent = ui.sub;
  document.getElementById('lbl-native').textContent = ui.lbl_native;
  document.getElementById('lbl-name').textContent = ui.lbl_name;
  document.getElementById('lbl-target').textContent = ui.lbl_target;
  document.getElementById('lbl-script').textContent = ui.lbl_script;
  document.getElementById('playBtn').textContent = ui.play;
  
  // Optionnel : on peut stocker la langue choisie dans S pour la suite
  S.currentUI = ui; 
}

function applyMenuUI() {
  // On récupère les textes de façon autonome pour éviter les erreurs 'undefined'
  const menuUi = S.currentUI || UI_TEXT[S.nativeLang] || UI_TEXT['fr'];
  
  const mapping = {
    'menu-title-text': menuUi.menu_title || 'Que voulez-vous faire ?',
    'menu-sub-text': menuUi.menu_sub || '',
    'mb-village': menuUi.mb_village || 'Village',
    'mb-village-d': menuUi.mb_village_d || '',
    'mb-vocab': menuUi.mb_vocab || 'Vocabulaire',
    'mb-vocab-d': menuUi.mb_vocab_d || '',
    'mb-phrases': menuUi.mb_phrases || 'Phrases',
    'mb-phrases-d': menuUi.mb_phrases_d || '',
    'mb-grammar': menuUi.mb_grammar || 'Grammaire',
    'mb-grammar-d': menuUi.mb_grammar_d || '',
    'mb-dict': menuUi.mb_dict || 'Dictionnaire',
    'mb-dict-d': menuUi.mb_dict_d || ''
  };

  // On boucle sur le mapping pour mettre à jour le DOM proprement
  Object.keys(mapping).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = mapping[id];
  });
}

// =================================================================
// MENU
// =================================================================
function startMenu(){
  document.getElementById('menuPlayer').textContent='👤 '+S.playerName;
  document.getElementById('menuLang').textContent=(FLAGS[S.targetLang]||'')+(LANG_NAMES[S.targetLang]||S.targetLang);
  document.getElementById('menuXP').textContent=S.xp+' XP';
  const gd=document.getElementById('gemDisplay');
  if(gd) gd.textContent='💎 '+(typeof S_missions!=='undefined'?S_missions.gems:0);
  applyMenuUI();
  showScreen('screen-menu');
  if(typeof saveGame==='function') saveGame();
  if(typeof updateStreak==='function') updateStreak();
}

function goVillage(){
  document.getElementById('hudPlayer').textContent='👤 '+S.playerName;
  document.getElementById('hudLang').textContent=(FLAGS[S.targetLang]||'')+' '+(LANG_NAMES[S.targetLang]||'');
  document.getElementById('hudXP').textContent=S.xp+' XP';
  showScreen('screen-village');
  initCanvas();
  setWeather(getWeatherForTime());
  setInterval(updateTime,30000);updateTime();
}

// =================================================================
// WEATHER
// =================================================================
function getWeatherForTime(){const h=new Date().getHours();if(h>=21||h<6)return'night';return['sun','sun','rain','wind','snow'][Math.floor(Math.random()*5)];}
function setWeather(w){currentWeather=w;document.getElementById('hudWeather').textContent=WEATHER_ICONS[w]||'☀️';buildWeatherFX(w);}
function buildWeatherFX(w){
  const o=document.getElementById('weatherOverlay');o.innerHTML='';
  if(w==='rain'){for(let i=0;i<60;i++){const d=document.createElement('div');d.className='rain-drop';const h=60+Math.random()*80;d.style.cssText=`left:${Math.random()*110-5}%;height:${h}px;top:-${h}px;animation-duration:${0.4+Math.random()*0.4}s;animation-delay:${Math.random()*2}s;opacity:${0.3+Math.random()*0.4}`;o.appendChild(d);}}
  else if(w==='snow'){for(let i=0;i<40;i++){const d=document.createElement('div');d.className='snow-flake';d.textContent='❄';d.style.cssText=`left:${Math.random()*100}%;font-size:${8+Math.random()*10}px;animation-duration:${3+Math.random()*4}s;animation-delay:${Math.random()*5}s;opacity:${0.5+Math.random()*0.4}`;o.appendChild(d);}}
}
function updateTime(){const n=new Date();document.getElementById('hudTime').textContent=`${n.getHours().toString().padStart(2,'0')}:${n.getMinutes().toString().padStart(2,'0')}`;}

//// VILLAGE C =================================================================ANVAS
// =================================================================
function initCanvas(){
  if(canvas)return;
  canvas=document.getElementById('villageCanvas');
  canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;
  ctx=canvas.getContext('2d');
  window.addEventListener('resize',()=>{canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;});
  canvas.addEventListener('click',onVillageClick);
  canvas.addEventListener('mousemove',onVillageHover);
  canvas.addEventListener('touchstart',onVillageTouch,{passive:true});
  requestAnimationFrame(villageLoop);
}
function villageLoop(){tick++;drawVillage();requestAnimationFrame(villageLoop);}
function drawVillage(){
  if(!canvas||!ctx)return;
  const W=canvas.width, H=canvas.height;
  const cx=W*0.5, cy=H*0.5;
  const night=currentWeather==='night';

  // ── Fond ciel ──────────────────────────────────────────────
  const sky=ctx.createLinearGradient(0,0,0,H);
  if(night){sky.addColorStop(0,'#01020a');sky.addColorStop(1,'#0a0a1e');}
  else if(currentWeather==='rain'){sky.addColorStop(0,'#1a2535');sky.addColorStop(1,'#2a3848');}
  else{sky.addColorStop(0,'#1a3a1a');sky.addColorStop(1,'#2d5a2d');}
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);

  // ── Soleil / Lune ───────────────────────────────────────────
  if(night){
    ctx.beginPath();ctx.arc(W*0.85,H*0.08,14,0,Math.PI*2);
    ctx.fillStyle='#f0e0a0';ctx.fill();
    for(let i=0;i<50;i++){
      const sx=(Math.sin(i*437)*0.5+0.5)*W, sy=(Math.sin(i*293)*0.5+0.5)*H*0.4;
      ctx.beginPath();ctx.arc(sx,sy,1,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,200,'+(0.4+0.5*Math.sin(tick*0.02+i))+')';ctx.fill();
    }
  } else {
    ctx.beginPath();ctx.arc(W*0.85,H*0.08,18,0,Math.PI*2);
    ctx.fillStyle=currentWeather==='rain'?'#7a8898':'#ffe0a0';ctx.fill();
    for(let i=0;i<3;i++){
      const cloudX=((tick*0.15*(i+1)*0.3+i*180)%(W+160))-80, cloudY=H*(0.06+i*0.04);
      drawCloud(cloudX,cloudY,30+i*10,currentWeather==='rain'?'rgba(70,80,100,0.6)':'rgba(255,255,255,0.5)');
    }
  }

  // ── Herbe de base ───────────────────────────────────────────
  const grass=ctx.createRadialGradient(cx,cy,0,cx,cy,W*0.55);
  grass.addColorStop(0, currentWeather==='snow'?'#d0d8e0':'#3a6b30');
  grass.addColorStop(1, currentWeather==='snow'?'#b0b8c0':'#1e3d1a');
  ctx.fillStyle=grass; ctx.fillRect(0,0,W,H);

  // ── Anneaux concentriques (sol des anneaux) ─────────────────
  const rings=[
    {r:W*0.46, color:'rgba(160,130,80,0.25)'},   // anneau 3 — Avancé
    {r:W*0.32, color:'rgba(160,130,80,0.30)'},   // anneau 2 — Intermédiaire
    {r:W*0.20, color:'rgba(160,130,80,0.38)'},   // anneau 1 — Élémentaire
    {r:W*0.10, color:'rgba(160,130,80,0.50)'},   // centre   — Débutant
  ];
  rings.forEach(function(ring){
    ctx.beginPath();ctx.arc(cx,cy,ring.r,0,Math.PI*2);
    ctx.fillStyle=ring.color;ctx.fill();
  });

  // ── Murs circulaires des anneaux ────────────────────────────
  const wallRadii=[W*0.46, W*0.32, W*0.20, W*0.10];
  const wallColors=['#8a7040','#9a8050','#aa9060','#c0a870'];
  wallRadii.forEach(function(r,i){
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.strokeStyle=wallColors[i];
    ctx.lineWidth=Math.max(3, W*0.012);
    ctx.stroke();
    // Double mur (effet épaisseur)
    ctx.beginPath();ctx.arc(cx,cy,r-W*0.008,0,Math.PI*2);
    ctx.strokeStyle='rgba(0,0,0,0.25)';
    ctx.lineWidth=1;ctx.stroke();
  });

  // ── Chemins cardinaux (N/S/E/O) ────────────────────────────
  const pathColor='rgba(180,150,90,0.6)';
  const pathW=Math.max(6, W*0.022);
  [0, Math.PI/2, Math.PI, Math.PI*1.5].forEach(function(angle){
    const x1=cx+Math.cos(angle)*W*0.10;
    const y1=cy+Math.sin(angle)*W*0.10;
    const x2=cx+Math.cos(angle)*W*0.52;
    const y2=cy+Math.sin(angle)*W*0.52;
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);
    ctx.strokeStyle=pathColor;ctx.lineWidth=pathW;
    ctx.lineCap='round';ctx.stroke();
    // Rive verte sur le chemin
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);
    ctx.strokeStyle='rgba(60,120,50,0.4)';ctx.lineWidth=pathW*0.35;ctx.stroke();
  });

  // ── Labels d'anneaux ────────────────────────────────────────
  const ringLabels=[
    {r:W*0.47, label:'Avancé',        xpMin:1500},
    {r:W*0.33, label:'Intermédiaire', xpMin:800},
    {r:W*0.21, label:'Élémentaire',   xpMin:300},
    {r:W*0.11, label:'Débutant',      xpMin:0},
  ];
  ringLabels.forEach(function(rl){
    const unlocked = S.xp >= rl.xpMin;
    ctx.font = 'bold '+Math.max(9,W*0.022)+'px Nunito,sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillStyle = unlocked ? 'rgba(255,220,120,0.7)' : 'rgba(200,180,120,0.35)';
    ctx.fillText(rl.label, cx, cy - rl.r + W*0.018);
  });

  // ── Lieux ───────────────────────────────────────────────────
  LOCATIONS.forEach(function(loc){
    const bob=Math.sin(tick*0.025+loc.x*10)*1.5;
    drawLoc(loc, loc.x*W, loc.y*H+bob, loc.w*W, loc.h*H, hoveredLoc===loc.id);
  });

  // ── Overlay pluie ───────────────────────────────────────────
  if(currentWeather==='rain'){
    ctx.fillStyle='rgba(0,10,30,0.12)';ctx.fillRect(0,0,W,H);
  }
}
function drawCloud(x,y,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(x+r*0.7,y+r*0.15,r*0.7,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(x-r*0.6,y+r*0.2,r*0.6,0,Math.PI*2);ctx.fill();}
function drawLoc(loc,x,y,w,h,hov){
  const a=hov?1:0.85, night=currentWeather==='night';
  const r=Math.min(w,h)*0.5;   // rayon du cercle
  const bx=x+w*0.5, by=y+h*0.5; // centre

  // Ombre
  ctx.beginPath();ctx.arc(bx+3,by+4,r,0,Math.PI*2);
  ctx.fillStyle='rgba(0,0,0,0.30)';ctx.fill();

  // Fond circulaire
  ctx.beginPath();ctx.arc(bx,by,r,0,Math.PI*2);
  ctx.fillStyle=hexA(loc.color, a*(night?0.6:1));ctx.fill();

  // Bordure
  if(hov){
    ctx.beginPath();ctx.arc(bx,by,r,0,Math.PI*2);
    ctx.strokeStyle='#FFD700';ctx.lineWidth=2.5;ctx.stroke();
  } else {
    ctx.beginPath();ctx.arc(bx,by,r,0,Math.PI*2);
    ctx.strokeStyle=hexA(darken(loc.color),0.8);ctx.lineWidth=1.5;ctx.stroke();
  }

  // Fenêtres lumineuses la nuit
  if(night){
    ctx.fillStyle='rgba(255,215,100,0.6)';
    ctx.fillRect(bx-r*0.3, by-r*0.15, r*0.22, r*0.22);
    ctx.fillRect(bx+r*0.08,by-r*0.15, r*0.22, r*0.22);
  }

  // Emoji
  ctx.font=Math.min(w,h)*0.38+'px serif';
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(loc.emoji, bx, by);

  // Nom sous le cercle
  const nm=LOC_NAMES[loc.id]?.[S.nativeLang]||loc.id;
  ctx.font='bold '+Math.max(8,Math.min(w*0.14,11))+'px Nunito,sans-serif';
  ctx.fillStyle=hov?'#FFD700':'rgba(255,240,200,0.9)';
  ctx.textAlign='center';ctx.textBaseline='top';
  ctx.fillText(nm, bx, by+r+4);
}
function hexA(h,a){const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return`rgba(${r},${g},${b},${a})`;}
function darken(h){return`#${[1,3,5].map(i=>Math.max(0,parseInt(h.slice(i,i+2),16)-40).toString(16).padStart(2,'0')).join('')}`;}
function getLocAt(mx,my){
  const W=canvas.width,H=canvas.height;
  return LOCATIONS.find(function(l){
    const bx=l.x*W+l.w*W*0.5, by=l.y*H+l.h*H*0.5;
    const r=Math.min(l.w*W,l.h*H)*0.5;
    const dx=mx-bx, dy=my-by;
    return dx*dx+dy*dy <= r*r;
  });
}
function onVillageHover(e){const r=canvas.getBoundingClientRect(),l=getLocAt(e.clientX-r.left,e.clientY-r.top);hoveredLoc=l?l.id:null;const tip=document.getElementById('locTooltip');if(l){const nm=LOC_NAMES[l.id]?.[S.nativeLang]||l.id;const ds=LOC_DESC[l.id]?.[S.nativeLang]||'';tip.textContent=WEATHER_ICONS[currentWeather]+' '+nm+' — '+ds;tip.style.left=(l.x*canvas.width+l.w*canvas.width/2)+'px';tip.style.top=(l.y*canvas.height)+'px';tip.classList.add('show');}else tip.classList.remove('show');}
function onVillageClick(e){const r=canvas.getBoundingClientRect(),l=getLocAt(e.clientX-r.left,e.clientY-r.top);if(l)openLoc(l);}
function onVillageTouch(e){const r=canvas.getBoundingClientRect(),t=e.touches[0],l=getLocAt(t.clientX-r.left,t.clientY-r.top);if(l)openLoc(l);}

// =================================================================
// LOCATION
// =================================================================
function openLoc(loc) {
  S.currentLoc = loc;
  
  // Mise à jour du titre et de la météo
  const locTitle = LOC_NAMES[loc.id]?.[S.nativeLang] || loc.id;
  document.getElementById('locTitle').textContent = `${loc.emoji} ${locTitle}`;
  document.getElementById('locWeather').textContent = WEATHER_ICONS[currentWeather] || '☀️';

  // Cas particulier du cinéma
  if (loc.id === 'cinema') {
    if (typeof openCinema === 'function') openCinema();
    return;
  }

  const listEl = document.getElementById('npcList');
  if (!listEl) return;

  // Génération de la liste des NPCs avec des Backticks (`)
  listEl.innerHTML = loc.npcs.map(npc => {
    const role = typeof npc.role === 'object' 
      ? (npc.role[S.nativeLang] || npc.role.en) 
      : npc.role;
      
    const hint = LOC_DESC[loc.id]?.[S.nativeLang] || '';

    // Utilisation impérative des backticks pour que le HTML soit une chaîne de caractères
              return `
      <div class="npc-card" onclick="openDialogue('${loc.id}','${npc.id}')">
        <div class="npc-av">${npc.emoji}</div>
        <div class="npc-info">
          <div class="npc-name">${npc.name}</div>
          <div class="npc-role">${role}</div>
          <div class="npc-hint">💬 ${hint}</div>
        </div>
        <span style="color:var(--dim);font-size:1.2rem">›</span>
      </div>`;
  }).join('');

  showScreen('screen-location');

  // Lancement des missions après un court délai
  setTimeout(() => {
    if (typeof openMissionsPanel === 'function') {
      openMissionsPanel(loc.id);
    }
  }, 400);
}


  // =================================================================
// DIALOGUE — with spell checker
// =================================================================
function openDialogue(locId,npcId){
  const loc=LOCATIONS.find(l=>l.id===locId);
  const npc=loc.npcs.find(n=>n.id===npcId);
  S.currentNPC=npc;S.currentLoc=loc;S.chatHistory=[];
  const role=typeof npc.role==='object'?(npc.role[S.nativeLang]||npc.role.en):npc.role;
  document.getElementById('dialAv').textContent=npc.emoji;
  document.getElementById('dialName').textContent=npc.name;
  document.getElementById('dialRole').textContent=role+' — '+(LOC_NAMES[loc.id]?.[S.nativeLang]||loc.id);
  document.getElementById('chatMsgs').innerHTML='';
  document.getElementById('corrPanel').className='correction-panel';
  document.getElementById('dialInput').value='';
  showScreen('screen-dialogue');
  addSysMsg('💡 Touchez un mot pour le traduire');
  setTimeout(()=>npcOpen(),400);
}

function getScriptInstr(){
  if(!['zh','ja','ru'].includes(S.targetLang))return'';
  if(S.scriptPref==='roman'){if(S.targetLang==='zh')return'\nÉcris UNIQUEMENT en pinyin, PAS de caractères chinois.';if(S.targetLang==='ja')return'\nÉcris UNIQUEMENT en romaji, PAS de japonais.';if(S.targetLang==='ru')return'\nÉcris UNIQUEMENT en translittération latine, PAS de cyrillique.';}
  if(S.scriptPref==='both'){if(S.targetLang==='zh')return'\nÉcris en chinois ET pinyin entre parenthèses. Ex: 你好 (Nǐ hǎo)';if(S.targetLang==='ja')return'\nÉcris en japonais ET romaji entre parenthèses. Ex: こんにちは (Konnichiwa)';if(S.targetLang==='ru')return'\nÉcris en cyrillique ET translittération entre parenthèses. Ex: Привет (Privyet)';}
  return'';
}

async function npcOpen(){
  const npc=S.currentNPC,loc=S.currentLoc;
  const si=getScriptInstr();
  const wctx={sun:'Il fait beau.',rain:'Il pleut.',snow:'Il neige.',wind:'Il fait du vent.',night:'C\'est le soir.'};
  const prompt=`${npc.ctx}\nLe joueur s'appelle ${S.playerName}. Réponds UNIQUEMENT en ${LANG_NAMES[S.targetLang]}.${si}\nContexte: ${wctx[currentWeather]||''}\nMax 2 phrases. Accueille ${S.playerName} et pose une question liée à ton rôle.`;
  showTyping();document.getElementById('dialSend').disabled=true;
  try{
    const r=await fetch(`${API}/api/dialogue`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({npcName:npc.name,npcRole:typeof npc.role==='object'?npc.role.fr:npc.role,location:LOC_NAMES[loc.id]?.fr||loc.id,language:LANG_NAMES[S.targetLang],playerName:S.playerName,playerMessage:'__OPEN__',history:[],systemContext:prompt})});
    const d=await r.json();removeTyping();
    const reply=d.reply||`Hello ${S.playerName}!`;
    addClickableMsg('npc',npc.emoji,reply);S.chatHistory.push({role:'assistant',content:reply});
  }catch(e){removeTyping();addClickableMsg('npc',npc.emoji,`Hello ${S.playerName}!`);}
  document.getElementById('dialSend').disabled=false;
}

async function sendMsg(){
  const inp=document.getElementById('dialInput');
  const text=inp.value.trim();if(!text)return;
  inp.value='';
  document.getElementById('corrPanel').className='correction-panel';
  addClickableMsg('player','😊',text);
  S.chatHistory.push({role:'user',content:text});
  gainXP(10);
  // Check active mission
  if (typeof checkMissionInMessage === 'function') checkMissionInMessage(text);
  // Auto spell check after send
  checkSpelling(text);
  const npc=S.currentNPC,loc=S.currentLoc;
  const si=getScriptInstr();
  const prompt=`${npc.ctx}\nLe joueur s'appelle ${S.playerName}. Réponds UNIQUEMENT en ${LANG_NAMES[S.targetLang]}.${si}\nMax 2 phrases. Si faute: reformule naturellement.`;
  showTyping();document.getElementById('dialSend').disabled=true;
  try{
    const r=await fetch(`${API}/api/dialogue`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({npcName:npc.name,npcRole:typeof npc.role==='object'?npc.role.fr:npc.role,location:LOC_NAMES[loc.id]?.fr||loc.id,language:LANG_NAMES[S.targetLang],playerName:S.playerName,playerMessage:text,history:S.chatHistory.slice(-8),systemContext:prompt})});
    const d=await r.json();removeTyping();
    const reply=d.reply||'...';addClickableMsg('npc',npc.emoji,reply);S.chatHistory.push({role:'assistant',content:reply});
  }catch(e){removeTyping();addClickableMsg('npc',npc.emoji,'...');}
  document.getElementById('dialSend').disabled=false;
}

// =================================================================
// SPELL CHECKER
// =================================================================
async function checkSpelling(text){
  const nativeLangName={fr:'français',en:'anglais',es:'espagnol',ht:'créole haïtien',de:'allemand',ru:'russe',zh:'mandarin',ja:'japonais'};
  try{
    const r=await fetch(`${API}/api/correct`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,language:LANG_NAMES[S.targetLang]||'anglais',nativeLanguage:nativeLangName[S.nativeLang]||'français'})});
    const d=await r.json();
    const panel=document.getElementById('corrPanel');
    if(d.correct){
      panel.className='correction-panel ok show';
      document.getElementById('corrTitle').textContent='✅ CORRECT';
      document.getElementById('corrOrig').textContent='';
      document.getElementById('corrFixed').textContent=d.corrected||text;
      document.getElementById('corrExplain').textContent='Parfait !';
    }else{
      panel.className='correction-panel show';
      document.getElementById('corrTitle').textContent='✏️ CORRECTION';
      document.getElementById('corrOrig').textContent=text;
      document.getElementById('corrFixed').textContent=d.corrected||'';
      document.getElementById('corrExplain').textContent=d.explanation||'';
      // Also underline error in the message bubble
      underlineLastPlayerMsg(text,d.corrected);
    }
  }catch(e){}
}

function underlineLastPlayerMsg(original,corrected){
  const msgs=document.querySelectorAll('.msg.player .msg-bubble');
  if(!msgs.length)return;
  const last=msgs[msgs.length-1];
  // Simple approach: if different, add wavy underline class to the bubble
  if(original!==corrected){
    last.style.borderBottom='2px wavy var(--red)';
    last.title='Cliquez ✏️ Correction pour voir la correction';
  }
}


async function reqHint(){
  const last=S.chatHistory.filter(m=>m.role==='assistant').slice(-1)[0]?.content;
  if(!last)return;
  const nln={fr:'français',en:'anglais',es:'espagnol',ht:'créole haïtien',de:'allemand',ru:'russe',zh:'mandarin',ja:'japonais'};
  try{const r=await fetch(`${API}/api/dialogue`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({npcName:'',npcRole:'',location:'',language:nln[S.nativeLang]||'français',playerName:S.playerName,playerMessage:`Donne un indice court en ${nln[S.nativeLang]||'français'} pour répondre à: "${last}". Max 1 phrase.`,history:[]})});const d=await r.json();showNotif('💡 '+d.reply);}catch(e){}
}

async function reqTranslate(){
  const last=S.chatHistory.filter(m=>m.role==='assistant').slice(-1)[0]?.content;
  if(!last)return;
  const nln={fr:'français',en:'anglais',es:'espagnol',ht:'créole haïtien',de:'allemand',ru:'russe',zh:'mandarin',ja:'japonais'};
  try{const r=await fetch(`${API}/api/translate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:last,targetLanguage:nln[S.nativeLang]||'français'})});const d=await r.json();showNotif('🔤 '+(d.translation||last));}catch(e){}
}

// Voice
function toggleVoice(){
  if(!('webkitSpeechRecognition'in window||'SpeechRecognition'in window)){showNotif('🎤 Non supporté sur ce navigateur');return;}
  if(isRecording){recognition?.stop();isRecording=false;document.getElementById('voiceBtn').classList.remove('rec');document.getElementById('voiceBtn').textContent='🎤 Parler';return;}
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  recognition=new SR();
  const lm={en:'en-US',fr:'fr-FR',es:'es-ES',ht:'fr-HT',de:'de-DE',ru:'ru-RU',zh:'zh-CN',ja:'ja-JP'};
  recognition.lang=lm[S.targetLang]||'en-US';recognition.interimResults=false;
  recognition.onstart=()=>{isRecording=true;document.getElementById('voiceBtn').classList.add('rec');document.getElementById('voiceBtn').textContent='⏹️ Stop';showNotif('🎤 Parlez...');};
  recognition.onresult=e=>{const t=e.results[0][0].transcript;document.getElementById('dialInput').value=t;showNotif('✅ "'+t+'"');};
  recognition.onerror=()=>{showNotif('❌ Erreur micro');};
  recognition.onend=()=>{isRecording=false;document.getElementById('voiceBtn').classList.remove('rec');document.getElementById('voiceBtn').textContent='🎤 Parler';};
  recognition.start();
}

// Clickable words
function addClickableMsg(type,avatar,text){
  const c=document.getElementById('chatMsgs');
  const d=document.createElement('div');d.className=`msg ${type}`;
  const content=type==='npc'?makeClickable(text):escHtml(text);
  d.innerHTML=`<div class="msg-av">${avatar}</div><div class="msg-bubble">${content}</div>`;
  c.appendChild(d);c.scrollTop=c.scrollHeight;
}
function addSysMsg(t){const c=document.getElementById('chatMsgs');const d=document.createElement('div');d.className='msg system';d.innerHTML=`<div class="msg-bubble">${t}</div>`;c.appendChild(d);c.scrollTop=c.scrollHeight;}
function makeClickable(text){return text.split(/(\s+|[,\.!?;:'"()\[\]{}])/g).map(tok=>{if(tok.trim()&&tok.trim().length>1&&!/^[,\.!?;:'"()\[\]{}]+$/.test(tok.trim())){const s=escHtml(tok);return`<span class="clickable-word" onclick="lookupWord('${s.replace(/'/g,"\\'")}',event)">${s}</span>`;}return escHtml(tok);}).join('');}
function escHtml(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

async function lookupWord(word,event){
  popupWord=word;
  const pop=document.getElementById('wordPopup');
  document.getElementById('wpWord').textContent=word;
  document.getElementById('wpRoman').textContent='';
  document.getElementById('wpTranslation').textContent='...';
  document.getElementById('wpGrammar').textContent='';
  const x=Math.min(event.clientX,window.innerWidth-290);
  const y=Math.max(event.clientY-170,10);
  pop.style.left=x+'px';pop.style.top=y+'px';
  pop.classList.add('show');
  const nln={fr:'français',en:'anglais',es:'espagnol',ht:'créole haïtien',de:'allemand',ru:'russe',zh:'mandarin',ja:'japonais'};
  try{
    const r=await fetch(`${API}/api/dialogue`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({npcName:'',npcRole:'',location:'',language:nln[S.nativeLang]||'français',playerName:S.playerName,playerMessage:`Pour le mot "${word}" en ${LANG_NAMES[S.targetLang]}, donne en ${nln[S.nativeLang]||'français'}: 1.Traduction 2.Romanisation si applicable 3.Catégorie grammaticale. JSON: {"translation":"...","roman":"...","grammar":"..."}`,history:[]})});
    const d=await r.json();
    try{const p=JSON.parse((d.reply||'{}').replace(/```json|```/g,'').trim());document.getElementById('wpTranslation').textContent=p.translation||word;document.getElementById('wpRoman').textContent=p.roman||'';document.getElementById('wpGrammar').textContent=p.grammar||'';}
    catch{document.getElementById('wpTranslation').textContent=d.reply||word;}
  }catch(e){document.getElementById('wpTranslation').textContent='Indisponible';}
}
function closeWordPopup(){document.getElementById('wordPopup').classList.remove('show');}
function speakPopupWord(){if(popupWord&&'speechSynthesis'in window){const u=new SpeechSynthesisUtterance(popupWord);const lm={en:'en-US',fr:'fr-FR',es:'es-ES',ht:'fr-HT',de:'de-DE',ru:'ru-RU',zh:'zh-CN',ja:'ja-JP'};u.lang=lm[S.targetLang]||'en-US';speechSynthesis.speak(u);showNotif('🔊 '+popupWord);}}


function showTyping(){const c=document.getElementById('chatMsgs');const d=document.createElement('div');d.className='msg npc';d.id='typInd';d.innerHTML=`<div class="msg-av">${S.currentNPC?.emoji||'🧑'}</div><div class="msg-bubble"><div class="typing-ind"><div class="td"></div><div class="td"></div><div class="td"></div></div></div>`;c.appendChild(d);c.scrollTop=c.scrollHeight;}
function removeTyping(){document.getElementById('typInd')?.remove();}

// =================================================================
// VOCABULARY
// =================================================================
function loadVocab(catKey) {
  const cats = Object.keys(VOCAB);
  const catsBar = document.getElementById('vocabCats');
  
  // 1. Génération des boutons de catégories
  catsBar.innerHTML = cats.map(function(k) {
    const a = k === catKey ? ' active' : '';
    const icon = VOCAB[k].icon || '📖';
    const label = VOCAB[k][S.nativeLang] || VOCAB[k].fr;
    return `<button class="vcat${a}" onclick="loadVocab('${k}')">${icon} ${label}</button>`;
  }).join('');

  const cat = VOCAB[catKey];
  if (!cat) return;

  const isCJK = ['zh', 'ja', 'ru'].includes(S.targetLang);
  const showRoman = isCJK && S.scriptPref !== 'native';
  const showNative = !isCJK || S.scriptPref !== 'roman';

  // 2. Filtrage par recherche
  const searchInput = document.getElementById('vocabSearch');
  const search = searchInput.value.toLowerCase();
  const words = cat.words.filter(w => 
    !search || 
    (w.t[S.nativeLang] || w.n || "").toLowerCase().includes(search) || 
    (w.t[S.targetLang] || "").toLowerCase().includes(search)
  );

  document.getElementById('vocabCount').textContent = `${words.length} mots`;

  // 3. Génération des lignes de vocabulaire
  const vocabRowsHTML = words.map(function(w) {
    const target = w.t[S.targetLang] || w.t.en || '';
    const match = target.match(/^(.*)\s*\(([^)]+)\)\s*$/);
    const chars = match ? match[1] : target;
    const roman = match ? match[2] : '';
    
    const romanSpan = (showRoman && roman) ? `<span class="vi-roman">${roman}</span>` : '';
    const altWord = (!showNative && !roman) ? `<span class="vi-word">${target}</span>` : '';
    const nativeText = w.t[S.nativeLang] || w.t.en || w.n || '';
    const escapedChars = chars.replace(/'/g, "\\'");

    return `
      <div class="vocab-item">
        <span class="vi-native">${nativeText}</span>
        <span class="vi-target">
          <span class="vi-word">${showNative ? chars : ''}</span>
          ${romanSpan} ${altWord}
        </span>
        <button class="vi-listen" onclick="speakW('${escapedChars}')">🔊</button>
      </div>`;
  }).join('');

  // 4. Affichage final
  const catLabel = cat[S.nativeLang] || cat.fr || "";
  document.getElementById('vocabList').innerHTML = `
    <div class="cat-header">${catLabel} — ${words.length} mots</div>
    ${vocabRowsHTML}
  `;
}

// 5. Gestionnaire de recherche (sécurisé pour éviter les erreurs si le champ n'existe pas encore)
const vSearch = document.getElementById('vocabSearch');
if (vSearch) { // Cette ligne vérifie si l'élément existe avant d'agir
  vSearch.oninput = () => {
    const activeBtn = document.querySelector('.vcat.active');
    if (activeBtn) {
      const activeIdx = Array.from(document.querySelectorAll('.vcat')).indexOf(activeBtn);
      loadVocab(Object.keys(VOCAB)[activeIdx]);
    }
  };
}


// 6. Fonction de synthèse vocale
function speakW(w) {
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(w);
    const lm = { 
      en: 'en-US', fr: 'fr-FR', es: 'es-ES', 
      ht: 'fr-HT', de: 'de-DE', ru: 'ru-RU', 
      zh: 'zh-CN', ja: 'ja-JP' 
    };
    u.lang = lm[S.targetLang] || 'en-US';
    speechSynthesis.speak(u);
  }
  showNotif(`🔊 ${w}`);
}

// =================================================================
// PHRASES
// =================================================================
function loadPhrases(catKey) {
  const cats = Object.keys(PHRASES_DATA);
  
  // Génération des boutons de catégories
  document.getElementById('phraseCats').innerHTML = cats.map(function(k) {
    const a = k === catKey ? ' active' : '';
    const icon = PHRASES_DATA[k].icon || '';
    const label = PHRASES_DATA[k][S.nativeLang] || PHRASES_DATA[k].fr;
    return `<button class="pcat${a}" onclick="loadPhrases('${k}')">${icon} ${label}</button>`;
  }).join('');

  const cat = PHRASES_DATA[catKey];
  if (!cat) return;

  const isCJK = ['zh', 'ja', 'ru'].includes(S.targetLang);
  const showRoman = isCJK && S.scriptPref !== 'native';
  const showNative = !isCJK || S.scriptPref !== 'roman';

  document.getElementById('phrasesCount').textContent = `${cat.items.length} phrases`;

  // Génération de la liste des phrases
  document.getElementById('phraseList').innerHTML = cat.items.map(function(p) {
    const target = p.t[S.targetLang] || p.t.en || '';
    const match = target.match(/^(.*)\s*\(([^)]+)\)\s*$/);
    const chars = match ? match[1] : target;
    const roman = match ? match[2] : '';
    
    const struct = p.struct ? (p.struct.t ? (p.struct.t[S.targetLang] || p.struct.t.en || p.struct.n || '') : (p.struct.n || '')) : '';
    
    // Préparation des blocs HTML optionnels
    const romanHtml = (showRoman && roman) ? `<div class="pi-roman">${roman}</div>` : '';
    const structHtml = struct ? `<div style="font-size:0.65rem;color:var(--purple);margin-top:4px">&#128208; ${struct}</div>` : '';
    const nativeText = p.t[S.nativeLang] || p.t.en || p.n || '';
    const escapedChars = chars.replace(/'/g, "\\'");

    return `
      <div class="phrase-item">
        <div class="pi-native">${nativeText}</div>
        <div class="pi-target">${showNative ? chars : target}</div>
        ${romanHtml}
        ${structHtml}
        <div class="pi-actions">
          <button class="pi-btn" onclick="speakW('${escapedChars}')">🔊</button>
          <button class="pi-btn" onclick="copyPhrase('${escapedChars}')">📋</button>
        </div>
      </div>`;
  }).join('');
}

function copyPhrase(t) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(t)
      .then(() => showNotif('📋 Copié !'))
      .catch(() => showNotif('❌ Erreur de copie'));
  } else {
    // Solution de secours si navigator.clipboard n'est pas dispo
    const textArea = document.createElement("textarea");
    textArea.value = t;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showNotif('📋 Copié !');
  }
}


// =================================================================
// GRAMMAR
// =================================================================
function loadGrammar(catKey) {
  const cats = Object.keys(GRAMMAR_DATA);
  
  // 1. Génération des boutons de catégories
  document.getElementById('grammarCats').innerHTML = cats.map(function(k) {
    const a = k === catKey ? ' active' : '';
    const icon = GRAMMAR_DATA[k].icon || '';
    const label = GRAMMAR_DATA[k][S.nativeLang] || GRAMMAR_DATA[k].fr;
    return `<button class="gcat${a}" onclick="loadGrammar('${k}')">${icon} ${label}</button>`;
  }).join('');

  const cat = GRAMMAR_DATA[catKey];
  if (!cat) return;

  const nl = S.nativeLang;
  const tl = S.targetLang;
  const isCJK = ['zh', 'ja', 'ru'].includes(tl);
  const showRoman = isCJK && S.scriptPref !== 'native';
  const showNative = !isCJK || S.scriptPref !== 'roman';

  const expl = cat.explanation?.[nl] || cat.explanation?.fr || '';
  const formula = cat.formula?.[tl] || cat.formula?.en || cat.formula?.fr || '';

  // 2. Génération des lignes d'exemples
  const gramRowsHTML = (cat.examples || []).map(function(ex) {
    const target = ex.t[tl] || ex.t.en || '';
    const match = target.match(/^(.*)\s*\(([^)]+)\)\s*$/);
    const chars = match ? match[1] : target;
    const roman = match ? match[2] : '';
    
    const romanSpan = (showRoman && roman) ? `<span class="roman">${roman}</span>` : '';
    const nativeText = ex.t[nl] || ex.t.en || ex.n || '';
    const escapedChars = chars.replace(/'/g, "\\'");

    return `
      <div class="gram-ex">
        <span class="gram-ex-native">${nativeText}</span>
        <span class="gram-ex-target">
          ${showNative ? chars : target} ${romanSpan}
          <button style="background:none;border:none;cursor:pointer;color:var(--dim);margin-left:4px" 
                  onclick="speakW('${escapedChars}')">🔊</button>
        </span>
      </div>`;
  }).join('');

  // 3. Injection finale dans le corps de la grammaire
  const count = cat.items?.length || cat.examples?.length || 0;
  const title = cat[nl] || cat.fr || '';

  document.getElementById('grammarBody').innerHTML = `
    <div class="gram-section">
      <div class="gram-title">
        ${cat.icon || ''} ${title} 
        <span class="gram-tag">${count} exemples</span>
      </div>
      <div class="gram-explanation">${expl}</div>
      ${formula ? `<div class="gram-formula">${formula}</div>` : ''}
      <div class="gram-examples">${gramRowsHTML}</div>
    </div>`;
}

// DICTIONARY
// =================================================================
function openDict() {
  dictFromScreen = document.querySelector('.screen.active')?.id || 'screen-menu';

  if (document.getElementById('screen-dict')) {
    showScreen('screen-dict');
  } else {
    const overlay = document.getElementById('dictOverlay');
    if (overlay) overlay.classList.add('show');
  }

  const input = document.getElementById('dictInput');
  const res = document.getElementById('dictResult')
    || document.getElementById('dictResults')
    || document.getElementById('dictRes')
    || document.getElementById('dictBody');

  if (input && !input.dataset.dictBound) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') searchDict();
    });
    input.dataset.dictBound = '1';
  }

  const searchBtn = document.getElementById('dictSearchBtn')
    || document.getElementById('dictBtn')
    || document.getElementById('dictSend');
  if (searchBtn && !searchBtn.dataset.dictBound) {
    searchBtn.addEventListener('click', searchDict);
    searchBtn.dataset.dictBound = '1';
  }

  if (input) {
    if (popupWord && !input.value.trim()) input.value = popupWord;
    setTimeout(function() { input.focus(); }, 30);
  }

  if (res && !res.innerHTML.trim()) {
    res.innerHTML = '<div class="dict-empty"><div class="dict-empty-icon">📚</div>Entrez un mot ou une expression</div>';
  }

  if (input && input.value.trim()) searchDict();
}

async function searchDict() {
  const input = document.getElementById('dictInput');
  const res = document.getElementById('dictResult')
    || document.getElementById('dictResults')
    || document.getElementById('dictRes')
    || document.getElementById('dictBody');

  if (!input || !res) return;

  const q = (input.value || '').replace(/\s+/g, ' ').trim();
  if (!q) {
    res.innerHTML = '<div class="dict-empty"><div class="dict-empty-icon">📚</div>Entrez un mot ou une expression</div>';
    input.focus();
    return;
  }

  if (dictHistory[0] !== q) {
    dictHistory = [q].concat(dictHistory.filter(function(item) {
      return item !== q;
    })).slice(0, 10);
  }

  res.innerHTML = '<div class="dict-empty"><div class="dict-empty-icon">⏳</div>Recherche en cours...</div>';

  const nl = LANG_NAMES[S.nativeLang] || 'français';
  const tl = LANG_NAMES[S.targetLang] || 'anglais';
  const isCJK = ['zh', 'ja', 'ru'].includes(S.targetLang);
  const showRoman = isCJK && S.scriptPref !== 'native';
  const escapeHTML = function(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  try {
    const prompt = `Pour l'expression "${q}" et la paire de langues ${nl} ↔ ${tl}, agis comme un dictionnaire pédagogique. Réponds UNIQUEMENT avec un JSON valide au format {"translation":"...","roman":"...","grammar":"...","example":"..."}. "translation" = meilleure traduction dans la langue opposée selon le sens le plus courant. "roman" = romanisation si utile, sinon chaîne vide. "grammar" = catégorie grammaticale ou note d'usage très brève. "example" = un exemple court et naturel. Pas de markdown, pas d'explication supplémentaire.`;
    const r = await fetch(`${API}/api/dialogue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        npcName: '',
        npcRole: 'Dictionary',
        location: 'Dictionary',
        language: tl,
        playerName: S.playerName,
        playerMessage: prompt,
        history: []
      })
    });

    if (!r.ok) throw new Error(`HTTP ${r.status}`);

    const d = await r.json();
    let p;
    try {
      p = JSON.parse((d.reply || '{}').replace(/```json|```/g, '').trim());
    } catch {
      p = { translation: d.reply || q, roman: '', grammar: '', example: '' };
    }

    const hist = dictHistory.slice(1, 9);
    const translation = escapeHTML(p.translation || q);
    const roman = escapeHTML(p.roman || '');
    const grammar = escapeHTML(p.grammar || '');
    const example = escapeHTML(p.example || '');
    const escapedTranslation = translation.replace(/&#39;/g, "'");

    let histHTML = '';
    if (hist.length) {
      histHTML = '<div style="font-size:0.65rem;color:var(--dim);letter-spacing:2px;text-transform:uppercase;margin:15px 0 8px 0">Historique</div>'
        + '<div class="dict-chips">'
        + hist.map(function(h) {
            const safeLabel = escapeHTML(h);
            const safeValue = String(h).replace(/'/g, "\\'");
            return '<span class="dict-chip" onclick="searchDictWord(\'' + safeValue + '\')">' + safeLabel + '</span>';
          }).join('')
        + '</div>';
    }

    res.innerHTML = '<div class="dict-card">'
      + '<div style="font-size:0.68rem;color:var(--dim);margin-bottom:5px">"' + escapeHTML(q) + '"</div>'
      + '<div class="dict-word">' + translation + '</div>'
      + (roman && showRoman ? '<div class="dict-roman">' + roman + '</div>' : '')
      + (grammar ? '<div style="font-size:0.7rem;color:var(--purple);font-weight:800;margin:5px 0">' + grammar + '</div>' : '')
      + (example ? '<div class="dict-example">&#128161; ' + example + '</div>' : '')
      + '<button class="dict-listen-btn" onclick="speakW(\'' + escapedTranslation + '\')">&#128266; Écouter</button>'
      + '</div>'
      + histHTML;

  } catch (e) {
    console.warn('Dictionary search failed:', e);
    res.innerHTML = '<div class="dict-empty"><div class="dict-empty-icon">❌</div>Indisponible pour le moment</div>';
  }
}

function searchDictWord(w) {
  document.getElementById('dictInput').value = w;
  searchDict();
}

// =================================================================
// XP & UTILS
// =================================================================
function gainXP(n){
  const boost = (S.xpBoostEnd && Date.now() < S.xpBoostEnd);
  const actual = boost ? n * 2 : n;
  S.xp += actual;
  const pct = S.xp % 100;
  document.getElementById('hudXP').textContent = S.xp+' XP';
  document.getElementById('menuXP').textContent = S.xp+' XP';
  document.getElementById('xpFill').style.width = pct+'%';
  const lv = Math.floor(S.xp/100)+1;
  if(lv>S.level){S.level=lv;showNotif('🎉 Niveau '+S.level+' !');}
  else showNotif('+'+ actual +' XP ⭐'+(boost?' ⚡×2':''));
  if(typeof saveGame==='function') saveGame();
}
function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById(id).classList.add('active');closeWordPopup();}
function showNotif(msg){const n=document.getElementById('notif');n.textContent=msg;n.classList.add('show');clearTimeout(n._t);n._t=setTimeout(()=>n.classList.remove('show'),2200);}

// =================================================================
// INDICATEUR CEFR DANS LE VILLAGE (Suggestion #3)
// =================================================================

function addCEFRIndicator() {
  const hud = document.querySelector('.village-hud');
  if (!hud) return;
  
  if (document.getElementById('cefrIndicator')) return;
  
  // Calculer la progression selon XP
  const totalXP = S.xp || 0;
  let currentLevel = "A1";
  let nextLevel = "A2";
  let progressPercent = 0;
  let levelColor = "#4ecf70";
  let levelIcon = "🌱";
  
  if (totalXP < 300) {
    currentLevel = "A1";
    nextLevel = "A2";
    progressPercent = Math.min(100, Math.floor((totalXP / 300) * 100));
    levelColor = "#4ecf70";
    levelIcon = "🌱";
  } else if (totalXP < 800) {
    currentLevel = "A2";
    nextLevel = "B1";
    progressPercent = Math.min(100, Math.floor(((totalXP - 300) / 500) * 100));
    levelColor = "#4a9eff";
    levelIcon = "🌟";
  } else if (totalXP < 1500) {
    currentLevel = "B1";
    nextLevel = "B2";
    progressPercent = Math.min(100, Math.floor(((totalXP - 800) / 700) * 100));
    levelColor = "#ff9f43";
    levelIcon = "🏆";
  } else if (totalXP < 2500) {
    currentLevel = "B2";
    nextLevel = "C1";
    progressPercent = Math.min(100, Math.floor(((totalXP - 1500) / 1000) * 100));
    levelColor = "#e040fb";
    levelIcon = "👑";
  } else {
    currentLevel = "C1";
    nextLevel = null;
    progressPercent = 100;
    levelColor = "#ff6b6b";
    levelIcon = "🏅";
  }
  
  const indicator = document.createElement('div');
  indicator.id = 'cefrIndicator';
  indicator.style.cssText = `
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(0,0,0,0.5);
    padding: 2px 8px;
    border-radius: 20px;
    margin-left: auto;
    margin-right: 8px;
    font-size: 0.7rem;
    cursor: pointer;
  `;
  indicator.onclick = function() {
    showNotif('🗺️ Niveau ' + currentLevel + ' → ' + (nextLevel || '🏆 Maître !') + ' (' + progressPercent + '%)');
  };
  
  indicator.innerHTML = `
    <span style="font-size:0.85rem;">${levelIcon}</span>
    <span style="font-weight:800;color:${levelColor}">${currentLevel}</span>
    <div style="width:40px;height:4px;background:rgba(255,255,255,0.2);border-radius:2px;overflow:hidden;">
      <div style="width:${progressPercent}%;height:100%;background:${levelColor};border-radius:2px;"></div>
    </div>
    ${nextLevel ? `<span style="font-size:0.6rem;color:var(--dim);">→ ${nextLevel}</span>` : '🏆'}
  `;
  
  hud.appendChild(indicator);
}

// Sauvegarder la fonction goVillage originale
const originalGoVillage = window.goVillage;

// Remplacer goVillage par une version qui ajoute l'indicateur
window.goVillage = function() {
  originalGoVillage();
  setTimeout(function() {
    addCEFRIndicator();
  }, 100);
};
// =================================================================
// API FALLBACK & MODE HORS-LIGNE (Suggestion #2)
// =================================================================

// Cache des réponses API
const apiCache = new Map();

// Limitation du nombre d'appels (anti-spam)
let lastAPICall = 0;
const MIN_API_INTERVAL = 1000; // 1 seconde entre chaque appel

// Fonction principale avec fallback
async function callAPIWithFallback(endpoint, data, options = {}) {
  const { skipCache = false, timeout = 10000 } = options;
  
  // Anti-spam : attendre si on a appelé trop récemment
  const now = Date.now();
  const wait = MIN_API_INTERVAL - (now - lastAPICall);
  if (wait > 0 && !skipCache) {
    await new Promise(r => setTimeout(r, wait));
  }
  lastAPICall = Date.now();
  
  // Vérifier le cache
  const cacheKey = `${endpoint}:${JSON.stringify(data)}`;
  if (!skipCache && apiCache.has(cacheKey)) {
    const cached = apiCache.get(cacheKey);
    // Cache valable 1 heure
    if (Date.now() - cached.timestamp < 3600000) {
      console.log('📦 API cache utilisé');
      return cached.response;
    }
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(`${API}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const result = await response.json();
    
    // Sauvegarder dans le cache
    apiCache.set(cacheKey, {
      response: result,
      timestamp: Date.now()
    });
    
    return result;
    
  } catch (error) {
    console.warn(`⚠️ API hors-ligne pour ${endpoint}:`, error.message);
    
    // Réponse de secours selon le type d'appel
    if (endpoint === '/api/dialogue') {
      const langNames = { fr: 'français', en: 'anglais', es: 'espagnol', ht: 'créole', de: 'allemand', ru: 'russe', zh: 'chinois', ja: 'japonais' };
      const targetLangName = langNames[S.targetLang] || 'anglais';
      
      return {
        reply: `📡 Connexion perdue. Continuez à pratiquer en ${targetLangName} ! Essayez de dire: "Bonjour" ou "Comment allez-vous ?"`,
        offline: true
      };
    }
    
    if (endpoint === '/api/correct') {
      return {
        correct: false,
        corrected: data.text,
        explanation: "📡 Mode hors-ligne. Vérification automatique désactivée. Continuez à pratiquer !"
      };
    }
    
    if (endpoint === '/api/translate') {
      return {
        translation: `[Traduction hors-ligne] "${data.text.substring(0, 50)}..."`
      };
    }
    
    return { reply: "Service temporairement indisponible. Réessayez plus tard." };
  }
}

// Indicateur de connexion dans le village
function addConnectionIndicator() {
  const hud = document.querySelector('.village-hud');
  if (!hud) return;
  if (document.getElementById('connIndicator')) return;
  
  const indicator = document.createElement('span');
  indicator.id = 'connIndicator';
  indicator.style.cssText = 'font-size:0.6rem;background:rgba(0,0,0,0.5);padding:2px 6px;border-radius:10px;margin-left:8px;cursor:default;';
  indicator.textContent = navigator.onLine ? '🟢' : '🔴';
  indicator.title = navigator.onLine ? 'Connecté' : 'Mode hors-ligne';
  hud.appendChild(indicator);
  
  window.addEventListener('online', () => {
    indicator.textContent = '🟢';
    indicator.title = 'Connecté';
    indicator.style.background = 'rgba(78,207,112,0.2)';
    setTimeout(() => indicator.style.background = '', 2000);
    showNotif('📡 Connexion rétablie !');
  });
  
  window.addEventListener('offline', () => {
    indicator.textContent = '🔴';
    indicator.title = 'Mode hors-ligne';
    indicator.style.background = 'rgba(224,85,85,0.2)';
    showNotif('📡 Connexion perdue - Mode hors-ligne activé');
  });
}

// Remplacer la fonction npcOpen originale
window.npcOpen = async function() {
    const npc = S.currentNPC;
    const loc = S.currentLoc;
    const si = getScriptInstr ? getScriptInstr() : '';
    const wctx = { sun: 'Il fait beau.', rain: 'Il pleut.', snow: 'Il neige.', wind: 'Il fait du vent.', night: 'C\'est le soir.' };
    const prompt = `${npc.ctx}\nLe joueur s'appelle ${S.playerName}. Réponds UNIQUEMENT en ${LANG_NAMES[S.targetLang]}.${si}\nContexte: ${wctx[currentWeather] || ''}\nMax 2 phrases. Accueille ${S.playerName} et pose une question liée à ton rôle.`;
    
    showTyping();
    document.getElementById('dialSend').disabled = true;
    
    try {
      const r = await callAPIWithFallback('/api/dialogue', {
        npcName: npc.name,
        npcRole: typeof npc.role === 'object' ? npc.role.fr : npc.role,
        location: LOC_NAMES[loc.id]?.fr || loc.id,
        language: LANG_NAMES[S.targetLang],
        playerName: S.playerName,
        playerMessage: '__OPEN__',
        history: [],
        systemContext: prompt
      });
      
      removeTyping();
      const reply = r.reply || `Bonjour ${S.playerName} !`;
      addClickableMsg('npc', npc.emoji, reply);
      S.chatHistory.push({ role: 'assistant', content: reply });
      
      if (r.offline) {
        addSysMsg('📡 Mode hors-ligne - L\'IA utilise des réponses simples');
      }
      
    } catch (e) {
      removeTyping();
      addClickableMsg('npc', npc.emoji, `Bonjour ${S.playerName} ! Comment puis-je vous aider aujourd'hui ?`);
    }
    
    document.getElementById('dialSend').disabled = false;
  };

// =================================================================
// INIT DOM — listeners welcome flow
// =================================================================
(function() {
  // Etoiles
  try{var c=document.getElementById('wStars');if(c){for(var i=0;i<100;i++){var s=document.createElement('div');s.className='w-star';var z=Math.random()*2+0.5;s.style.cssText='width:'+z+'px;height:'+z+'px;left:'+Math.random()*100+'%;top:'+Math.random()*100+'%;animation-delay:'+Math.random()*5+'s;animation-duration:'+(2+Math.random()*4)+'s';c.appendChild(s);}}}catch(e){}

  // 1. Langue maternelle
  document.querySelectorAll('[data-native]').forEach(function(t){
    t.addEventListener('click',function(){
      document.querySelectorAll('[data-native]').forEach(function(x){x.classList.remove('sel');});
      t.classList.add('sel');
      S.nativeLang=t.dataset.native;
      try{applyUI(S.nativeLang);}catch(e){}
      var s2=document.getElementById('step2');
      if(s2){s2.style.display='block';s2.scrollIntoView({behavior:'smooth',block:'center'});}
      ['step3','step4'].forEach(function(id){var el=document.getElementById(id);if(el)el.style.display='none';});
      var pb=document.getElementById('playBtn');if(pb){pb.style.display='none';pb.disabled=true;}
      document.querySelectorAll('[data-lang]').forEach(function(o){
        var same=o.dataset.lang===S.nativeLang;
        o.classList.toggle('disabled',same);if(same)o.classList.remove('sel');
      });
    });
  });

  // 2. Prenom
  var inputName=document.getElementById('inputName');
  if(inputName)inputName.addEventListener('input',function(){
    var has=this.value.trim().length>0;
    var s3=document.getElementById('step3');if(s3)s3.style.display=has?'block':'none';
    var s4=document.getElementById('step4');if(s4)s4.style.display='none';
    var pb=document.getElementById('playBtn');if(pb)pb.style.display='none';
  });

  // 3. Langue cible
  document.querySelectorAll('[data-lang]').forEach(function(o){
    o.addEventListener('click',function(){
      if(o.classList.contains('disabled'))return;
      document.querySelectorAll('[data-lang]').forEach(function(x){x.classList.remove('sel');});
      o.classList.add('sel');S.targetLang=o.dataset.lang;
      var cjk=['zh','ja','ru'].includes(S.targetLang);
      var pb=document.getElementById('playBtn');
      if(cjk){
        var s4=document.getElementById('step4');if(s4)s4.style.display='block';
        var lb={zh:{n:'你好',r:'Ni hao'},ja:{n:'こんにちは',r:'Konnichiwa'},ru:{n:'Привет',r:'Privyet'}};
        var sn=document.getElementById('sc-n');if(sn)sn.textContent=lb[S.targetLang].n;
        var sr=document.getElementById('sc-r');if(sr)sr.textContent=lb[S.targetLang].r;
        if(pb){pb.style.display='none';pb.disabled=true;}
      }else{
        S.scriptPref='both';
        var s4=document.getElementById('step4');if(s4)s4.style.display='none';
        if(pb){pb.style.display='block';pb.disabled=false;}
      }
    });
  });

  // 4. Commencer
  var playBtn=document.getElementById('playBtn');
  if(playBtn)playBtn.addEventListener('click',function(){
    var nm=document.getElementById('inputName');
    S.playerName=nm?nm.value.trim():'';
    if(!S.playerName||!S.nativeLang||!S.targetLang){
      try{showNotif('Complétez tous les champs !');}catch(e){alert('Complétez tous les champs !');}
      return;
    }
    try{startMenu();}catch(e){console.error('startMenu error:',e);}
  });

  // 5. Dialogue Enter
  var di=document.getElementById('dialInput');
  if(di)di.addEventListener('keydown',function(e){if(e.key==='Enter')try{sendMsg();}catch(ex){}});

  // 6. Popup mot
  document.addEventListener('click',function(e){
    var p=document.getElementById('wordPopup');
    if(p&&p.classList.contains('show')&&!p.contains(e.target)&&!e.target.classList.contains('clickable-word'))
      try{closeWordPopup();}catch(ex){}
  });

  // 7. Vocab search
  var vs=document.getElementById('vocabSearch');
  if(vs)vs.oninput=function(){
    var ab=document.querySelector('.vcat.active');
    if(ab){var idx=Array.from(document.querySelectorAll('.vcat')).indexOf(ab);try{loadVocab(Object.keys(VOCAB)[idx]);}catch(ex){}}
  };

  // 8. Dict Enter
  var dc=document.getElementById('dictInput');
  if(dc)dc.addEventListener('keydown',function(e){if(e.key==='Enter')try{searchDict();}catch(ex){}});

  // 9. Connexion
  try{setTimeout(addConnectionIndicator,500);}catch(e){}

})(); // exécution immédiate


// Fin du fichier app.js
