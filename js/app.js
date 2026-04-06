/* =================================================================
   app.js — LinguaVillage
   Logique principale : UI, Village, Dialogue, Vocabulaire,
   Phrases, Grammaire, Dictionnaire, XP
   Dépendances : state.js, save.js, cinema.js, missions.js (chargés avant)
   ================================================================= */

// =================================================================
// CONFIGURATION
// =================================================================
var API = 'https://linguavillage-api--marckensbou2.replit.app';

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
// VOCABULARY DATA
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
      {n:'parler',t:{en:'to speak',es:'hablar',de:'sprechen',ru:'говорить',zh:'说',ja:'話す',ht:'pale'}},
      {n:'voir',t:{en:'to see',es:'ver',de:'sehen',ru:'видеть',zh:'看',ja:'見る',ht:'wè'}},
      {n:'venir',t:{en:'to come',es:'venir',de:'kommen',ru:'приходить',zh:'来',ja:'来る',ht:'vini'}},
      {n:'prendre',t:{en:'to take',es:'tomar',de:'nehmen',ru:'брать',zh:'拿',ja:'取る',ht:'pran'}},
      {n:'faire',t:{en:'to do/make',es:'hacer',de:'machen',ru:'делать',zh:'做',ja:'する',ht:'fè'}},
      {n:'aimer',t:{en:'to like/love',es:'amar/gustar',de:'lieben/mögen',ru:'любить',zh:'爱/喜欢',ja:'好き',ht:'renmen'}}
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
      {n:"s'il vous plaît",t:{en:'please',es:'por favor',de:'bitte',ru:'пожалуйста',zh:'请',ja:'ください',ht:'tanpri'}},
      {n:'au revoir',t:{en:'goodbye',es:'adiós',de:'auf wiedersehen',ru:'до свидания',zh:'再见',ja:'さようなら',ht:'orevwa'}},
      {n:'excusez-moi',t:{en:'excuse me',es:'disculpe',de:'entschuldigung',ru:'извините',zh:'打扰一下',ja:'すみません',ht:'eskize m'}},
      {n:'bonsoir',t:{en:'good evening',es:'buenas noches',de:'guten abend',ru:'добрый вечер',zh:'晚上好',ja:'こんばんは',ht:'bonswa'}},
      {n:'bienvenue',t:{en:'welcome',es:'bienvenido',de:'willkommen',ru:'добро пожаловать',zh:'欢迎',ja:'ようこそ',ht:'byenvini'}},
      {n:'félicitations',t:{en:'congratulations',es:'felicidades',de:'glückwunsch',ru:'поздравляю',zh:'恭喜',ja:'おめでとう',ht:'felisitasyon'}}
    ]
  },
  nombres:{
    fr:'Nombres',en:'Numbers',es:'Números',ht:'Nimewo',de:'Zahlen',ru:'Числа',zh:'数字',ja:'数字',
    icon:'🔢',
    words:[
      {n:'un',t:{en:'one',es:'uno',de:'eins',ru:'один',zh:'一',ja:'一',ht:'youn'}},
      {n:'deux',t:{en:'two',es:'dos',de:'zwei',ru:'два',zh:'二',ja:'二',ht:'de'}},
      {n:'trois',t:{en:'three',es:'tres',de:'drei',ru:'три',zh:'三',ja:'三',ht:'twa'}},
      {n:'quatre',t:{en:'four',es:'cuatro',de:'vier',ru:'четыре',zh:'四',ja:'四',ht:'kat'}},
      {n:'cinq',t:{en:'five',es:'cinco',de:'fünf',ru:'пять',zh:'五',ja:'五',ht:'senk'}},
      {n:'six',t:{en:'six',es:'seis',de:'sechs',ru:'шесть',zh:'六',ja:'六',ht:'sis'}},
      {n:'sept',t:{en:'seven',es:'siete',de:'sieben',ru:'семь',zh:'七',ja:'七',ht:'sèt'}},
      {n:'huit',t:{en:'eight',es:'ocho',de:'acht',ru:'восемь',zh:'八',ja:'八',ht:'uit'}},
      {n:'neuf',t:{en:'nine',es:'nueve',de:'neun',ru:'девять',zh:'九',ja:'九',ht:'nèf'}},
      {n:'dix',t:{en:'ten',es:'diez',de:'zehn',ru:'десять',zh:'十',ja:'十',ht:'dis'}}
    ]
  }
};

// =================================================================
// PHRASES DATA
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
      {n:'Combien ça coûte ?',t:{en:'How much does it cost?',es:'¿Cuánto cuesta?',de:'Wie viel kostet das?',ru:'Сколько стоит?',zh:'多少钱？',ja:'いくらですか？',ht:'Konbyen sa koute?'}},
      {n:"Je suis désolé.",t:{en:'I am sorry.',es:'Lo siento.',de:'Es tut mir leid.',ru:'Извините.',zh:'对不起。',ja:'ごめんなさい。',ht:'Mwen regrèt.'}},
      {n:"Pouvez-vous m'aider ?",t:{en:'Can you help me?',es:'¿Puede ayudarme?',de:'Können Sie mir helfen?',ru:'Вы можете мне помочь?',zh:'你能帮我吗？',ja:'手伝っていただけますか？',ht:'Èske ou ka ede m?'}},
      {n:"Quel temps fait-il ?",t:{en:'What is the weather like?',es:'¿Qué tiempo hace?',de:'Wie ist das Wetter?',ru:'Какая погода?',zh:'天气怎么样？',ja:'天気はどうですか？',ht:'Ki tan li fè?'}},
      {n:"À quelle heure ?",t:{en:'At what time?',es:'¿A qué hora?',de:'Um wie viel Uhr?',ru:'В котором часу?',zh:'几点？',ja:'何時に？',ht:'Nan ki lè?'}},
      {n:"Je ne comprends pas.",t:{en:'I do not understand.',es:'No entiendo.',de:'Ich verstehe nicht.',ru:'Я не понимаю.',zh:'我不明白。',ja:'わかりません。',ht:'Mwen pa konprann.'}}
    ]
  },
  restaurant:{
    fr:'Au restaurant',en:'At the restaurant',es:'En el restaurante',ht:'Nan restoran',de:'Im Restaurant',ru:'В ресторане',zh:'在餐厅',ja:'レストランで',
    icon:'🍽️',
    items:[
      {n:'Une table pour deux, s\'il vous plaît.',t:{en:'A table for two, please.',es:'Una mesa para dos, por favor.',de:'Einen Tisch für zwei, bitte.',ru:'Столик на двоих, пожалуйста.',zh:'请给我一张两人桌。',ja:'二人用のテーブルをお願いします。',ht:'Yon tab pou de moun, tanpri.'}},
      {n:'Je voudrais voir le menu.',t:{en:'I would like to see the menu.',es:'Me gustaría ver el menú.',de:'Ich möchte die Speisekarte sehen.',ru:'Можно посмотреть меню?',zh:'我想看一下菜单。',ja:'メニューを見せてください。',ht:'Mwen ta renmen wè meni an.'}},
      {n:'Je suis végétarien.',t:{en:'I am vegetarian.',es:'Soy vegetariano.',de:'Ich bin Vegetarier.',ru:'Я вегетарианец.',zh:'我是素食者。',ja:'ベジタリアンです。',ht:'Mwen vejetaryen.'}},
      {n:'L\'addition, s\'il vous plaît.',t:{en:'The check, please.',es:'La cuenta, por favor.',de:'Die Rechnung, bitte.',ru:'Счёт, пожалуйста.',zh:'请结账。',ja:'お会計をお願いします。',ht:'Ladisyon an, tanpri.'}},
      {n:'C\'est délicieux !',t:{en:'It is delicious!',es:'¡Está delicioso!',de:'Es ist köstlich!',ru:'Это вкусно!',zh:'真好吃！',ja:'美味しいです！',ht:'Li bon anpil!'}}
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
      {n:'Nous parlons français.',t:{en:'We speak French.',es:'Hablamos francés.',de:'Wir sprechen Französisch.',ru:'Мы говорим по-французски.',zh:'我们说法语。',ja:'フランス語を話します。',ht:'Nou pale fransè.'}}
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
      {n:'Elle est partie ce matin.',t:{en:'She left this morning.',es:'Ella salió esta mañana.',de:'Sie ist heute Morgen gegangen.',ru:'Она ушла утром.',zh:'她今早离开了。',ja:'今朝出発しました。',ht:'Li pati maten an.'}}
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
  cinema:{fr:'Cinéma',ht:'Sinema',en:'Cinema',es:'Cine',de:'Kino',ru:'Кино',zh:'电影院',ja:'映画館'}
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
  cinema:{fr:'Films et culture',en:'Movies & culture',ht:'Sinema ak kilti',es:'Películas y cultura',de:'Filme und Kultur',ru:'Кино и культура',zh:'电影与文化',ja:'映画と文化'}
};

const LOCATIONS = [
  {id:'church',emoji:'⛪',color:'#6a50a8',x:0.42,y:0.38,w:0.10,h:0.12,npcs:[
    {id:'pastor',emoji:'🧑‍⚖️',name:'Morgan',role:{fr:'Pasteur·e',en:'Pastor',ht:'Pastè',es:'Pastor/a',de:'Pastor/in',ru:'Пастор',zh:'牧师',ja:'牧師'},ctx:'Tu es Morgan, pasteur bienveillant.'}]},
  {id:'school',emoji:'🏫',color:'#3a7aaa',x:0.53,y:0.44,w:0.10,h:0.12,npcs:[
    {id:'teacher',emoji:'🧑‍🏫',name:'Robin',role:{fr:'Professeur·e',en:'Teacher',ht:'Pwofesè',es:'Profesor/a',de:'Lehrer/in',ru:'Учитель',zh:'老师',ja:'先生'},ctx:'Tu es Robin, professeur patient.'}]},
  {id:'market',emoji:'🛒',color:'#2a8a50',x:0.31,y:0.44,w:0.10,h:0.12,npcs:[
    {id:'vendor',emoji:'🧑‍🍳',name:'Sage',role:{fr:'Vendeur·se',en:'Vendor',ht:'Machann',es:'Vendedor/a',de:'Verkäufer/in',ru:'Продавец',zh:'商贩',ja:'売り手'},ctx:'Tu es Sage, vendeur souriant.'}]},
  {id:'hospital',emoji:'🏥',color:'#aa3a3a',x:0.64,y:0.34,w:0.10,h:0.12,npcs:[
    {id:'doctor',emoji:'🧑‍⚕️',name:'Drew',role:{fr:'Médecin',en:'Doctor',ht:'Doktè',es:'Médico/a',de:'Arzt/in',ru:'Врач',zh:'医生',ja:'医師'},ctx:'Tu es Drew, médecin calme.'}]},
  {id:'tavern',emoji:'🍺',color:'#8a4a10',x:0.20,y:0.34,w:0.10,h:0.12,npcs:[
    {id:'bartender',emoji:'🧑‍🍽️',name:'Lane',role:{fr:'Barman·aid',en:'Bartender',ht:'Bòkay',es:'Bartender',de:'Barkeeper/in',ru:'Бармен',zh:'酒保',ja:'バーテンダー'},ctx:'Tu es Lane, barman jovial.'}]},
  {id:'friends',emoji:'🏠',color:'#3a6aaa',x:0.20,y:0.54,w:0.10,h:0.12,npcs:[
    {id:'friend',emoji:'🤝',name:'Alex',role:{fr:'Ami·e',en:'Friend',ht:'Zanmi',es:'Amigo/a',de:'Freund/in',ru:'Друг',zh:'朋友',ja:'友達'},ctx:'Tu es Alex, le meilleur ami.'}]},
  {id:'park',emoji:'🌳',color:'#6a9a30',x:0.64,y:0.54,w:0.10,h:0.12,npcs:[
    {id:'partner',emoji:'💝',name:'Sam',role:{fr:'Partenaire',en:'Partner',ht:'Patnè',es:'Pareja',de:'Partner/in',ru:'Партнёр',zh:'伴侣',ja:'パートナー'},ctx:'Tu es Sam, partenaire romantique.'}]},
  {id:'police',emoji:'👮',color:'#2a4a8a',x:0.15,y:0.20,w:0.10,h:0.12,npcs:[
    {id:'officer',emoji:'🧑‍✈️',name:'Remy',role:{fr:'Agent·e',en:'Officer',ht:'Ofisye',es:'Agente',de:'Beamter/in',ru:'Офицер',zh:'警察',ja:'警察官'},ctx:'Tu es Remy, agent professionnel.'}]},
  {id:'bank',emoji:'🏦',color:'#5a7a30',x:0.42,y:0.18,w:0.10,h:0.12,npcs:[
    {id:'banker',emoji:'💼',name:'Reese',role:{fr:'Banquier·ère',en:'Banker',ht:'Bankye',es:'Banquero/a',de:'Banker/in',ru:'Банкир',zh:'银行家',ja:'銀行員'},ctx:'Tu es Reese, banquier formel.'}]},
  {id:'station',emoji:'🚉',color:'#4a4a8a',x:0.69,y:0.20,w:0.10,h:0.12,npcs:[
    {id:'stationmaster',emoji:'🚂',name:'Pax',role:{fr:'Chef de gare',en:'Stationmaster',ht:'Chèf estasyon',es:'Jefe de estación',de:'Bahnhofsvorsteher/in',ru:'Начальник вокзала',zh:'站长',ja:'駅長'},ctx:'Tu es Pax, chef de gare précis.'}]},
  {id:'farm',emoji:'🌾',color:'#7a6a20',x:0.10,y:0.44,w:0.10,h:0.12,npcs:[
    {id:'farmer',emoji:'🧑‍🌾',name:'Dale',role:{fr:'Fermier·ère',en:'Farmer',ht:'Kiltivatè',es:'Granjero/a',de:'Bauer/in',ru:'Фермер',zh:'农民',ja:'農家'},ctx:'Tu es Dale, fermier.'}]},
  {id:'factory',emoji:'🏭',color:'#8a6a30',x:0.74,y:0.44,w:0.10,h:0.12,npcs:[
    {id:'foreman',emoji:'👷',name:'Casey',role:{fr:'Contremaître·sse',en:'Foreman',ht:'Chèf travay',es:'Capataz',de:'Vorarbeiter/in',ru:'Прораб',zh:'工头',ja:'現場監督'},ctx:'Tu es Casey, contremaître.'}]},
  {id:'cinema',emoji:'🎬',color:'#8a2080',x:0.42,y:0.60,w:0.10,h:0.12,npcs:[
    {id:'projectionist',emoji:'🎥',name:'Milly',role:{fr:'Projectionniste',en:'Projectionist',ht:'Pwojeksyonis',es:'Proyeccionista',de:'Vorführerin',ru:'Киномеханик',zh:'放映员',ja:'映写技師'},ctx:'Tu es Milly, passionnée de cinéma.'}]}
];

// =================================================================
// CONSTANTES GLOBALES
// =================================================================
const WEATHER_ICONS = {sun:'☀️',rain:'🌧️',wind:'💨',night:'🌙',snow:'❄️'};
const LANG_NAMES = {en:'anglais',fr:'français',es:'espagnol',ht:'créole haïtien',de:'allemand',ru:'russe',zh:'mandarin',ja:'japonais'};
const FLAGS = {en:'🇬🇧',fr:'🇫🇷',es:'🇪🇸',ht:'🇭🇹',de:'🇩🇪',ru:'🇷🇺',zh:'🇨🇳',ja:'🇯🇵'};

// =================================================================
// ÉTAT GLOBAL (utilise window.S déjà créé par state.js)
// =================================================================
let canvas, ctx, tick = 0, hoveredLoc = null;
let currentWeather = 'sun';
let popupWord = '';
let dictMode = 'word';
let dictHistory = [];
let isRecording = false;
let recognition = null;

// =================================================================
// FONCTIONS UI DE BASE
// =================================================================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  closeWordPopup();
}

function showNotif(msg) {
  const n = document.getElementById('notif');
  if (!n) return;
  n.textContent = msg;
  n.classList.add('show');
  clearTimeout(n._t);
  n._t = setTimeout(() => n.classList.remove('show'), 2200);
}

function gainXP(n) {
  if (!window.S) return;
  const boost = (S.xpBoostEnd && Date.now() < S.xpBoostEnd);
  const actual = boost ? n * 2 : n;
  S.xp = (S.xp || 0) + actual;
  
  const pct = S.xp % 100;
  const hudXP = document.getElementById('hudXP');
  const menuXP = document.getElementById('menuXP');
  const xpFill = document.getElementById('xpFill');
  if (hudXP) hudXP.textContent = S.xp + ' XP';
  if (menuXP) menuXP.textContent = S.xp + ' XP';
  if (xpFill) xpFill.style.width = pct + '%';
  
  const lv = Math.floor(S.xp / 100) + 1;
  if (lv > (S.level || 1)) {
    S.level = lv;
    showNotif('🎉 Niveau ' + lv + ' !');
  } else {
    showNotif('+' + actual + ' XP ⭐' + (boost ? ' ⚡×2' : ''));
  }
  if (typeof saveGame === 'function') saveGame();
}

function applyUI(lang) {
  const ui = UI_TEXT[lang] || UI_TEXT['fr'];
  const wsSub = document.getElementById('ws-sub');
  const lblNative = document.getElementById('lbl-native');
  const lblName = document.getElementById('lbl-name');
  const lblTarget = document.getElementById('lbl-target');
  const lblScript = document.getElementById('lbl-script');
  const playBtn = document.getElementById('playBtn');
  if (wsSub) wsSub.textContent = ui.sub;
  if (lblNative) lblNative.textContent = ui.lbl_native;
  if (lblName) lblName.textContent = ui.lbl_name;
  if (lblTarget) lblTarget.textContent = ui.lbl_target;
  if (lblScript) lblScript.textContent = ui.lbl_script;
  if (playBtn) playBtn.textContent = ui.play;
  if (window.S) S.currentUI = ui;
}

function applyMenuUI() {
  const menuUi = (window.S && S.currentUI) || UI_TEXT[(window.S && S.nativeLang) || 'fr'] || UI_TEXT['fr'];
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
  Object.keys(mapping).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = mapping[id];
  });
}

// =================================================================
// SÉLECTION LANGUE MATERNELLE (CORRIGÉ)
// =================================================================
document.querySelectorAll('.lang-tile[data-native]').forEach(t => {
  t.onclick = function() {
    document.querySelectorAll('.lang-tile[data-native]').forEach(x => x.classList.remove('active'));
    this.classList.add('active');
    if (window.S) S.nativeLang = this.dataset.native;
    applyUI(S.nativeLang);
    
    document.getElementById('step2').style.display = 'block';
    document.getElementById('inputName').focus();
  };
});

// =================================================================
// SÉLECTION LANGUE CIBLE
// =================================================================
document.querySelectorAll('.lang-tile[data-target]').forEach(t => {
  t.onclick = function() {
    document.querySelectorAll('.lang-tile[data-target]').forEach(x => x.classList.remove('active'));
    this.classList.add('active');
    if (window.S) S.targetLang = this.dataset.target;
    
    document.getElementById('step4').style.display = 'block';
  };
});

// =================================================================
// SÉLECTION SCRIPT
// =================================================================
function selScript(p, btn) {
  document.querySelectorAll('.sc-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  if (window.S) S.scriptPref = p;
  const playBtn = document.getElementById('playBtn');
  if (playBtn) {
    playBtn.style.display = 'block';
    playBtn.disabled = false;
  }
}

// =================================================================
// BOUTON COMMENCER
// =================================================================
const playBtn = document.getElementById('playBtn');
if (playBtn) {
  playBtn.addEventListener('click', function() {
    const nm = document.getElementById('inputName');
    if (window.S) {
      S.playerName = nm ? nm.value.trim() : '';
      if (!S.playerName || !S.nativeLang || !S.targetLang) {
        showNotif('Veuillez entrer votre prénom et choisir les deux langues.');
        return;
      }
      if (typeof saveGame === 'function') saveGame();
      startMenu();
    }
  });
}

// =================================================================
// MENU PRINCIPAL
// =================================================================
function startMenu() {
  if (!window.S) return;
  const menuPlayer = document.getElementById('menuPlayer');
  const menuLang = document.getElementById('menuLang');
  const menuXP = document.getElementById('menuXP');
  const gemDisplay = document.getElementById('gemDisplay');
  const xpFill = document.getElementById('xpFill');
  
  if (menuPlayer) menuPlayer.textContent = '👤 ' + S.playerName;
  if (menuLang) menuLang.textContent = (FLAGS[S.targetLang] || '') + (LANG_NAMES[S.targetLang] || S.targetLang);
  if (menuXP) menuXP.textContent = (S.xp || 0) + ' XP';
  if (gemDisplay) gemDisplay.textContent = '💎 ' + ((window.S_missions && S_missions.gems) || 0);
  if (xpFill) xpFill.style.width = ((S.xp || 0) % 100) + '%';
  
  applyMenuUI();
  showScreen('screen-menu');
  if (typeof saveGame === 'function') saveGame();
  if (typeof updateStreak === 'function') updateStreak();
}

function goVillage() {
  if (!window.S) return;
  const hudPlayer = document.getElementById('hudPlayer');
  const hudLang = document.getElementById('hudLang');
  const hudXP = document.getElementById('hudXP');
  if (hudPlayer) hudPlayer.textContent = '👤 ' + S.playerName;
  if (hudLang) hudLang.textContent = (FLAGS[S.targetLang] || '') + ' ' + (LANG_NAMES[S.targetLang] || '');
  if (hudXP) hudXP.textContent = (S.xp || 0) + ' XP';
  
  showScreen('screen-village');
  initCanvas();
  setWeather(getWeatherForTime());
  setInterval(updateTime, 30000);
  updateTime();
}

// =================================================================
// MÉTÉO
// =================================================================
function getWeatherForTime() {
  const h = new Date().getHours();
  if (h >= 21 || h < 6) return 'night';
  return ['sun', 'sun', 'rain', 'wind', 'snow'][Math.floor(Math.random() * 5)];
}

function setWeather(w) {
  currentWeather = w;
  const hudWeather = document.getElementById('hudWeather');
  if (hudWeather) hudWeather.textContent = WEATHER_ICONS[w] || '☀️';
  buildWeatherFX(w);
}

function buildWeatherFX(w) {
  const o = document.getElementById('weatherOverlay');
  if (!o) return;
  o.innerHTML = '';
  if (w === 'rain') {
    for (let i = 0; i < 60; i++) {
      const d = document.createElement('div');
      d.className = 'rain-drop';
      d.style.cssText = `left:${Math.random() * 110 - 5}%;height:${60 + Math.random() * 80}px;top:-${60 + Math.random() * 80}px;animation-duration:${0.4 + Math.random() * 0.4}s;animation-delay:${Math.random() * 2}s;opacity:${0.3 + Math.random() * 0.4}`;
      o.appendChild(d);
    }
  } else if (w === 'snow') {
    for (let i = 0; i < 40; i++) {
      const d = document.createElement('div');
      d.className = 'snow-flake';
      d.textContent = '❄';
      d.style.cssText = `left:${Math.random() * 100}%;font-size:${8 + Math.random() * 10}px;animation-duration:${3 + Math.random() * 4}s;animation-delay:${Math.random() * 5}s;opacity:${0.5 + Math.random() * 0.4}`;
      o.appendChild(d);
    }
  }
}

function updateTime() {
  const n = new Date();
  const hudTime = document.getElementById('hudTime');
  if (hudTime) hudTime.textContent = `${n.getHours().toString().padStart(2, '0')}:${n.getMinutes().toString().padStart(2, '0')}`;
}

// =================================================================
// VILLAGE CANVAS
// =================================================================
function initCanvas() {
  if (canvas) return;
  canvas = document.getElementById('villageCanvas');
  if (!canvas) return;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  ctx = canvas.getContext('2d');
  
  window.addEventListener('resize', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  });
  canvas.addEventListener('click', onVillageClick);
  canvas.addEventListener('mousemove', onVillageHover);
  canvas.addEventListener('touchstart', onVillageTouch, { passive: true });
  requestAnimationFrame(villageLoop);
}

function villageLoop() {
  tick++;
  drawVillage();
  requestAnimationFrame(villageLoop);
}

function drawVillage() {
  if (!canvas || !ctx) return;
  const W = canvas.width, H = canvas.height;
  const cx = W * 0.5, cy = H * 0.5;
  const night = currentWeather === 'night';
  
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  if (night) { sky.addColorStop(0, '#01020a'); sky.addColorStop(1, '#0a0a1e'); }
  else if (currentWeather === 'rain') { sky.addColorStop(0, '#1a2535'); sky.addColorStop(1, '#2a3848'); }
  else { sky.addColorStop(0, '#1a3a1a'); sky.addColorStop(1, '#2d5a2d'); }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);
  
  if (night) {
    ctx.beginPath();
    ctx.arc(W * 0.85, H * 0.08, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#f0e0a0';
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(W * 0.85, H * 0.08, 18, 0, Math.PI * 2);
    ctx.fillStyle = currentWeather === 'rain' ? '#7a8898' : '#ffe0a0';
    ctx.fill();
  }
  
  const grass = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.55);
  grass.addColorStop(0, currentWeather === 'snow' ? '#d0d8e0' : '#3a6b30');
  grass.addColorStop(1, currentWeather === 'snow' ? '#b0b8c0' : '#1e3d1a');
  ctx.fillStyle = grass;
  ctx.fillRect(0, 0, W, H);
  
  const rings = [
    { r: W * 0.46, color: 'rgba(160,130,80,0.25)' },
    { r: W * 0.32, color: 'rgba(160,130,80,0.30)' },
    { r: W * 0.20, color: 'rgba(160,130,80,0.38)' },
    { r: W * 0.10, color: 'rgba(160,130,80,0.50)' }
  ];
  rings.forEach(ring => {
    ctx.beginPath();
    ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
    ctx.fillStyle = ring.color;
    ctx.fill();
  });
  
  LOCATIONS.forEach(loc => {
    const bob = Math.sin(tick * 0.025 + loc.x * 10) * 1.5;
    drawLoc(loc, loc.x * W, loc.y * H + bob, loc.w * W, loc.h * H, hoveredLoc === loc.id);
  });
}

function drawLoc(loc, x, y, w, h, hov) {
  if (!ctx) return;
  const a = hov ? 1 : 0.85;
  const r = Math.min(w, h) * 0.5;
  const bx = x + w * 0.5, by = y + h * 0.5;
  
  ctx.beginPath();
  ctx.arc(bx + 3, by + 4, r, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.30)';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(bx, by, r, 0, Math.PI * 2);
  ctx.fillStyle = hexA(loc.color, a);
  ctx.fill();
  
  if (hov) {
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }
  
  ctx.font = Math.min(w, h) * 0.38 + 'px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(loc.emoji, bx, by);
}

function hexA(h, a) {
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function getLocAt(mx, my) {
  const W = canvas.width, H = canvas.height;
  return LOCATIONS.find(loc => {
    const bx = loc.x * W + loc.w * W * 0.5;
    const by = loc.y * H + loc.h * H * 0.5;
    const r = Math.min(loc.w * W, loc.h * H) * 0.5;
    const dx = mx - bx, dy = my - by;
    return dx * dx + dy * dy <= r * r;
  });
}

function onVillageHover(e) {
  const rect = canvas.getBoundingClientRect();
  const loc = getLocAt(e.clientX - rect.left, e.clientY - rect.top);
  hoveredLoc = loc ? loc.id : null;
  const tip = document.getElementById('locTooltip');
  if (loc && tip) {
    const nm = LOC_NAMES[loc.id] ? LOC_NAMES[loc.id][S.nativeLang] || loc.id : loc.id;
    const ds = LOC_DESC[loc.id] ? LOC_DESC[loc.id][S.nativeLang] || '' : '';
    tip.textContent = WEATHER_ICONS[currentWeather] + ' ' + nm + ' — ' + ds;
    tip.style.left = (loc.x * canvas.width + loc.w * canvas.width / 2) + 'px';
    tip.style.top = (loc.y * canvas.height) + 'px';
    tip.classList.add('show');
  } else if (tip) {
    tip.classList.remove('show');
  }
}

function onVillageClick(e) {
  const rect = canvas.getBoundingClientRect();
  const loc = getLocAt(e.clientX - rect.left, e.clientY - rect.top);
  if (loc) openLoc(loc);
}

function onVillageTouch(e) {
  const rect = canvas.getBoundingClientRect();
  const t = e.touches[0];
  const loc = getLocAt(t.clientX - rect.left, t.clientY - rect.top);
  if (loc) openLoc(loc);
}

// =================================================================
// LOCATION
// =================================================================
function openLoc(loc) {
  if (!window.S) return;
  S.currentLoc = loc;
  
  const locTitle = document.getElementById('locTitle');
  const locWeather = document.getElementById('locWeather');
  if (locTitle) locTitle.textContent = `${loc.emoji} ${LOC_NAMES[loc.id][S.nativeLang] || loc.id}`;
  if (locWeather) locWeather.textContent = WEATHER_ICONS[currentWeather] || '☀️';
  
  if (loc.id === 'cinema') {
    if (typeof openCinema === 'function') openCinema();
    return;
  }
  
  const listEl = document.getElementById('npcList');
  if (!listEl) return;
  
  listEl.innerHTML = loc.npcs.map(npc => {
    const role = typeof npc.role === 'object' ? (npc.role[S.nativeLang] || npc.role.en) : npc.role;
    const hint = LOC_DESC[loc.id] ? LOC_DESC[loc.id][S.nativeLang] || '' : '';
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
}

// =================================================================
// DIALOGUE (FONCTIONS DE BASE)
// =================================================================
function openDialogue(locId, npcId) {
  const loc = LOCATIONS.find(l => l.id === locId);
  const npc = loc.npcs.find(n => n.id === npcId);
  if (!window.S) return;
  S.currentNPC = npc;
  S.currentLoc = loc;
  S.chatHistory = [];
  
  const role = typeof npc.role === 'object' ? (npc.role[S.nativeLang] || npc.role.en) : npc.role;
  const dialAv = document.getElementById('dialAv');
  const dialName = document.getElementById('dialName');
  const dialRole = document.getElementById('dialRole');
  const chatMsgs = document.getElementById('chatMsgs');
  const corrPanel = document.getElementById('corrPanel');
  const dialInput = document.getElementById('dialInput');
  
  if (dialAv) dialAv.textContent = npc.emoji;
  if (dialName) dialName.textContent = npc.name;
  if (dialRole) dialRole.textContent = role + ' — ' + (LOC_NAMES[loc.id] ? LOC_NAMES[loc.id][S.nativeLang] || loc.id : loc.id);
  if (chatMsgs) chatMsgs.innerHTML = '';
  if (corrPanel) corrPanel.className = 'correction-panel';
  if (dialInput) dialInput.value = '';
  
  showScreen('screen-dialogue');
  addSysMsg('💡 Touchez un mot pour le traduire');
}

function addSysMsg(t) {
  const c = document.getElementById('chatMsgs');
  if (!c) return;
  const d = document.createElement('div');
  d.className = 'msg system';
  d.innerHTML = `<div class="msg-bubble">${t}</div>`;
  c.appendChild(d);
  c.scrollTop = c.scrollHeight;
}

function addClickableMsg(type, avatar, text) {
  const c = document.getElementById('chatMsgs');
  if (!c) return;
  const d = document.createElement('div');
  d.className = `msg ${type}`;
  const content = type === 'npc' ? makeClickable(text) : escapeHtml(text);
  d.innerHTML = `<div class="msg-av">${avatar}</div><div class="msg-bubble">${content}</div>`;
  c.appendChild(d);
  c.scrollTop = c.scrollHeight;
}

function makeClickable(text) {
  return text.split(/(\s+|[,\.!?;:'"()\[\]{}])/g).map(tok => {
    if (tok.trim() && tok.trim().length > 1 && !/^[,\.!?;:'"()\[\]{}]+$/.test(tok.trim())) {
      const s = escapeHtml(tok);
      return `<span class="clickable-word" onclick="lookupWord('${s.replace(/'/g, "\\'")}', event)">${s}</span>`;
    }
    return escapeHtml(tok);
  }).join('');
}

function escapeHtml(t) {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function sendMsg() {
  const input = document.getElementById('dialInput');
  const msg = input ? input.value.trim() : '';
  if (!msg) return;
  
  addClickableMsg('player', '👤', msg);
  if (input) input.value = '';
  
  // Simuler une réponse NPC pour le moment (en attendant l'API)
  setTimeout(() => {
    addClickableMsg('npc', S.currentNPC?.emoji || '🧑', 'Merci pour votre message ! Je vous répondrai bientôt.');
  }, 500);
}

function closeWordPopup() {
  const pop = document.getElementById('wordPopup');
  if (pop) pop.classList.remove('show');
}

function speakPopupWord() {
  if (popupWord && 'speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(popupWord);
    const lm = { en: 'en-US', fr: 'fr-FR', es: 'es-ES', ht: 'fr-HT', de: 'de-DE', ru: 'ru-RU', zh: 'zh-CN', ja: 'ja-JP' };
    u.lang = lm[S.targetLang] || 'en-US';
    speechSynthesis.speak(u);
    showNotif('🔊 ' + popupWord);
  }
}

async function lookupWord(word, event) {
  popupWord = word;
  const pop = document.getElementById('wordPopup');
  const wpWord = document.getElementById('wpWord');
  const wpRoman = document.getElementById('wpRoman');
  const wpTranslation = document.getElementById('wpTranslation');
  const wpGrammar = document.getElementById('wpGrammar');
  
  if (!pop || !wpWord || !wpTranslation) return;
  
  wpWord.textContent = word;
  if (wpRoman) wpRoman.textContent = '';
  wpTranslation.textContent = '...';
  if (wpGrammar) wpGrammar.textContent = '';
  
  const x = Math.min(event.clientX, window.innerWidth - 290);
  const y = Math.max(event.clientY - 170, 10);
  pop.style.left = x + 'px';
  pop.style.top = y + 'px';
  pop.classList.add('show');
  
  // Traduction locale simplifiée (en attendant l'API)
  wpTranslation.textContent = word;
}

function reqHint() { showNotif('💡 Indice: Essayez de formuler une phrase simple'); }
function reqTranslate() { showNotif('🔤 Traduction non disponible pour le moment'); }
function toggleVoice() { showNotif('🎤 Fonction vocale à venir'); }

// =================================================================
// VOCABULAIRE
// =================================================================
function loadVocab(catKey) {
  const cats = Object.keys(VOCAB);
  const catsBar = document.getElementById('vocabCats');
  if (catsBar) {
    catsBar.innerHTML = cats.map(k => {
      const a = k === catKey ? ' active' : '';
      const icon = VOCAB[k].icon || '📖';
      const label = VOCAB[k][S.nativeLang] || VOCAB[k].fr;
      return `<button class="vcat${a}" onclick="loadVocab('${k}')">${icon} ${label}</button>`;
    }).join('');
  }
  
  const cat = VOCAB[catKey];
  if (!cat) return;
  
  const words = cat.words || [];
  const vocabCount = document.getElementById('vocabCount');
  if (vocabCount) vocabCount.textContent = words.length + ' mots';
  
  const vocabList = document.getElementById('vocabList');
  if (vocabList) {
    vocabList.innerHTML = words.map(w => {
      const nativeText = w.t[S.nativeLang] || w.t.en || w.n || '';
      const targetText = w.t[S.targetLang] || w.t.en || '';
      return `
        <div class="vocab-item">
          <span class="vi-native">${escapeHtml(nativeText)}</span>
          <span class="vi-target">
            <span class="vi-word">${escapeHtml(targetText)}</span>
          </span>
          <button class="vi-listen" onclick="speakW('${escapeHtml(targetText).replace(/'/g, "\\'")}')">🔊</button>
        </div>`;
    }).join('');
  }
}

function speakW(w) {
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(w);
    const lm = { en: 'en-US', fr: 'fr-FR', es: 'es-ES', ht: 'fr-HT', de: 'de-DE', ru: 'ru-RU', zh: 'zh-CN', ja: 'ja-JP' };
    u.lang = lm[S.targetLang] || 'en-US';
    speechSynthesis.speak(u);
  }
  showNotif('🔊 ' + w);
}

// =================================================================
// PHRASES
// =================================================================
function loadPhrases(catKey) {
  const cats = Object.keys(PHRASES_DATA);
  const phraseCats = document.getElementById('phraseCats');
  if (phraseCats) {
    phraseCats.innerHTML = cats.map(k => {
      const a = k === catKey ? ' active' : '';
      const icon = PHRASES_DATA[k].icon || '';
      const label = PHRASES_DATA[k][S.nativeLang] || PHRASES_DATA[k].fr;
      return `<button class="pcat${a}" onclick="loadPhrases('${k}')">${icon} ${label}</button>`;
    }).join('');
  }
  
  const cat = PHRASES_DATA[catKey];
  if (!cat) return;
  
  const phraseList = document.getElementById('phraseList');
  const phrasesCount = document.getElementById('phrasesCount');
  if (phrasesCount) phrasesCount.textContent = cat.items.length + ' phrases';
  
  if (phraseList) {
    phraseList.innerHTML = cat.items.map(p => {
      const nativeText = p.t[S.nativeLang] || p.t.en || p.n || '';
      const targetText = p.t[S.targetLang] || p.t.en || '';
      return `
        <div class="phrase-item">
          <div class="pi-native">${escapeHtml(nativeText)}</div>
          <div class="pi-target">${escapeHtml(targetText)}</div>
          <div class="pi-actions">
            <button class="pi-btn" onclick="speakW('${escapeHtml(targetText).replace(/'/g, "\\'")}')">🔊</button>
            <button class="pi-btn" onclick="copyPhrase('${escapeHtml(targetText).replace(/'/g, "\\'")}')">📋</button>
          </div>
        </div>`;
    }).join('');
  }
}

function copyPhrase(t) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(t).then(() => showNotif('📋 Copié !')).catch(() => showNotif('❌ Erreur'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = t;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showNotif('📋 Copié !');
  }
}

// =================================================================
// GRAMMAIRE
// =================================================================
function loadGrammar(catKey) {
  const cats = Object.keys(GRAMMAR_DATA);
  const grammarCats = document.getElementById('grammarCats');
  if (grammarCats) {
    grammarCats.innerHTML = cats.map(k => {
      const a = k === catKey ? ' active' : '';
      const icon = GRAMMAR_DATA[k].icon || '';
      const label = GRAMMAR_DATA[k][S.nativeLang] || GRAMMAR_DATA[k].fr;
      return `<button class="gcat${a}" onclick="loadGrammar('${k}')">${icon} ${label}</button>`;
    }).join('');
  }
  
  const cat = GRAMMAR_DATA[catKey];
  if (!cat) return;
  
  const grammarBody = document.getElementById('grammarBody');
  if (!grammarBody) return;
  
  const expl = cat.explanation ? (cat.explanation[S.nativeLang] || cat.explanation.fr || '') : '';
  const formula = cat.formula ? (cat.formula[S.targetLang] || cat.formula.en || cat.formula.fr || '') : '';
  const examples = cat.examples || [];
  
  grammarBody.innerHTML = `
    <div class="gram-section">
      <div class="gram-title">${cat.icon || ''} ${cat[S.nativeLang] || cat.fr || ''}</div>
      <div class="gram-explanation">${expl}</div>
      ${formula ? `<div class="gram-formula">${formula}</div>` : ''}
      <div class="gram-examples">
        ${examples.map(ex => {
          const nativeText = ex.t[S.nativeLang] || ex.t.en || ex.n || '';
          const targetText = ex.t[S.targetLang] || ex.t.en || '';
          return `
            <div class="gram-ex">
              <span class="gram-ex-native">${escapeHtml(nativeText)}</span>
              <span class="gram-ex-target">${escapeHtml(targetText)} <button onclick="speakW('${escapeHtml(targetText).replace(/'/g, "\\'")}')">🔊</button></span>
            </div>`;
        }).join('')}
      </div>
    </div>`;
}

// =================================================================
// DICTIONNAIRE
// =================================================================
function openDict() {
  showScreen('screen-dict');
  const input = document.getElementById('dictInput');
  if (input) {
    input.focus();
    if (popupWord && !input.value.trim()) input.value = popupWord;
  }
  const result = document.getElementById('dictResult');
  if (result && !result.innerHTML.trim()) {
    result.innerHTML = '<div class="dict-empty"><div class="dict-empty-icon">📚</div>Entrez un mot ou une expression</div>';
  }
}

function searchDict() {
  const input = document.getElementById('dictInput');
  const result = document.getElementById('dictResult');
  if (!input || !result) return;
  
  const q = input.value.trim();
  if (!q) {
    result.innerHTML = '<div class="dict-empty"><div class="dict-empty-icon">📚</div>Entrez un mot ou une expression</div>';
    return;
  }
  
  result.innerHTML = '<div class="dict-empty"><div class="dict-empty-icon">⏳</div>Recherche en cours...</div>';
  
  // Traduction locale simplifiée
  setTimeout(() => {
    result.innerHTML = `
      <div class="dict-card">
        <div class="dict-word">${escapeHtml(q)}</div>
        <div class="dict-meaning">Traduction: ${escapeHtml(q)} (${LANG_NAMES[S.targetLang] || 'cible'})</div>
        <button class="dict-listen-btn" onclick="speakW('${escapeHtml(q).replace(/'/g, "\\'")}')">🔊 Écouter</button>
      </div>`;
  }, 300);
}

function setDictMode(mode, btn) {
  dictMode = mode;
  document.querySelectorAll('.dict-mode').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function closeDictBack() {
  showScreen('screen-menu');
}

// =================================================================
// FONCTIONS TEMPORAIRES (EN ATTENTE)
// =================================================================
function showProgression() { showNotif('📊 Progression: ' + (S.xp || 0) + ' XP'); }
function openShop() { showNotif('🏪 Boutique bientôt disponible'); }
function launchSurpriseMode() { showNotif('⚡ Mode surprise bientôt disponible'); }
function launchConfetti() { showNotif('🎉 Félicitations !'); }

// =================================================================
// INITIALISATION
// =================================================================
const searchInput = document.getElementById('vocabSearch');
if (searchInput) {
  searchInput.oninput = () => {
    const active = document.querySelector('.vcat.active');
    if (active) {
      const idx = Array.from(document.querySelectorAll('.vcat')).indexOf(active);
      loadVocab(Object.keys(VOCAB)[idx]);
    }
  };
}

const dictInput = document.getElementById('dictInput');
if (dictInput) {
  dictInput.addEventListener('keydown', e => { if (e.key === 'Enter') searchDict(); });
}

const dialInputGlobal = document.getElementById('dialInput');
if (dialInputGlobal) {
  dialInputGlobal.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });
}

document.addEventListener('click', e => {
  const pop = document.getElementById('wordPopup');
  if (pop && pop.classList.contains('show') && !pop.contains(e.target) && !e.target.classList.contains('clickable-word')) {
    closeWordPopup();
  }
});

console.log("app.js: ✅ Chargé et synchronisé avec state.js");
