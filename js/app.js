/* =================================================================
   app.js — LinguaVillage
   Logique principale : UI, Village, Dialogue, Vocabulaire,
   Phrases, Grammaire, Dictionnaire, XP
   Dépendances : save.js, cinema.js, missions.js (chargés avant)
   ================================================================= */

// Reprendre la sauvegarde automatiquement si elle existe
window.addEventListener('DOMContentLoaded', function(){
  if(window._LINGUA_HAS_SAVE){
    applyUI(S.nativeLang);
    startMenu();
  }
});

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
  connecteurs:{
    fr:'Connecteurs logiques',en:'Logical connectors',es:'Conectores lógicos',ht:'Konektè lojik',de:'Logische Konnektoren',ru:'Логические связки',zh:'逻辑连接词',ja:'論理接続詞',
    icon:'🔗',
    words:[
      {n:'mais',t:{en:'but',es:'pero',de:'aber',ru:'но (no)',zh:'但是 (dànshì)',ja:'でも (demo)',ht:'men'}},
      {n:'et',t:{en:'and',es:'y',de:'und',ru:'и (i)',zh:'和 (hé)',ja:'そして (soshite)',ht:'ak/epi'}},
      {n:'ou',t:{en:'or',es:'o',de:'oder',ru:'или (ili)',zh:'或者 (huòzhě)',ja:'または (matawa)',ht:'oswa'}},
      {n:'parce que',t:{en:'because',es:'porque',de:'weil',ru:'потому что (potomu chto)',zh:'因为 (yīnwèi)',ja:'なぜなら (nazenara)',ht:'paske'}},
      {n:'donc',t:{en:'so / therefore',es:'entonces',de:'also',ru:'поэтому (poetomu)',zh:'所以 (suǒyǐ)',ja:'だから (dakara)',ht:'donk'}},
      {n:'alors',t:{en:'then / so',es:'entonces',de:'dann',ru:'тогда (togda)',zh:'那么 (nàme)',ja:'それから (sorekara)',ht:'alò'}},
      {n:'cependant',t:{en:'however',es:'sin embargo',de:'jedoch',ru:'однако (odnako)',zh:'然而 (rán\'ér)',ja:'しかし (shikashi)',ht:'sepandan'}},
      {n:'si',t:{en:'if',es:'si',de:'wenn/falls',ru:'если (yesli)',zh:'如果 (rúguǒ)',ja:'もし (moshi)',ht:'si'}},
      {n:'quand',t:{en:'when',es:'cuando',de:'wenn/als',ru:'когда (kogda)',zh:'当...的时候 (dāng...shí)',ja:'ときに (toki ni)',ht:'lè/kan'}},
      {n:'avant de',t:{en:'before',es:'antes de',de:'bevor',ru:'до того как (do togo kak)',zh:'在...之前 (zài...zhīqián)',ja:'...する前に (...suru mae ni)',ht:'anvan'}},
      {n:'après',t:{en:'after',es:'después de',de:'nach',ru:'после (posle)',zh:'在...之后 (zài...zhīhòu)',ja:'...の後 (...no ato)',ht:'apre'}},
      {n:'pendant',t:{en:'during / while',es:'durante',de:'während',ru:'пока (poka)',zh:'在...期间 (zài...qījiān)',ja:'...の間 (...no aida)',ht:'pandan'}},
      {n:'aussi',t:{en:'also / too',es:'también',de:'auch',ru:'тоже (tozhe)',zh:'也 (yě)',ja:'も (mo)',ht:'tou'}},
      {n:'surtout',t:{en:'especially / above all',es:'sobre todo',de:'vor allem',ru:'прежде всего (prezhde vsego)',zh:'尤其 (yóuqí)',ja:'特に (toku ni)',ht:'sitou'}},
      {n:'seulement',t:{en:'only / just',es:'solo',de:'nur',ru:'только (tolko)',zh:'只 (zhǐ)',ja:'だけ (dake)',ht:'sèlman'}},
      {n:'même',t:{en:'even / same',es:'incluso / mismo',de:'sogar / gleich',ru:'даже (dazhe)',zh:'甚至 (shènzhì)',ja:'でさえ (de sae)',ht:'menm'}},
      {n:'pourtant',t:{en:'yet / nevertheless',es:'sin embargo',de:'trotzdem',ru:'тем не менее (tem ne meneye)',zh:'尽管如此 (jǐnguǎn rúcǐ)',ja:'それでも (soredemo)',ht:'poutan'}},
      {n:'d\'abord',t:{en:'first / firstly',es:'primero',de:'zuerst',ru:'сначала (snachala)',zh:'首先 (shǒuxiān)',ja:'まず (mazu)',ht:'premye'}},
      {n:'ensuite',t:{en:'then / next',es:'luego',de:'dann',ru:'затем (zatem)',zh:'然后 (ránhòu)',ja:'次に (tsugi ni)',ht:'apre sa'}},
      {n:'enfin',t:{en:'finally / at last',es:'finalmente',de:'schließlich',ru:'наконец (nakonets)',zh:'最后 (zuìhòu)',ja:'最後に (saigo ni)',ht:'finalman'}},
      {n:'c\'est pourquoi',t:{en:'that\'s why',es:'por eso',de:'deshalb',ru:'вот почему (vot pochemu)',zh:'这就是为什么 (zhè jiùshì wèishénme)',ja:'だからこそ (dakara koso)',ht:'se pou sa'}},
      {n:'bien que',t:{en:'although',es:'aunque',de:'obwohl',ru:'хотя (khotya)',zh:'虽然 (suīrán)',ja:'だけど (dakedo)',ht:'menm si'}},
      {n:'sans',t:{en:'without',es:'sin',de:'ohne',ru:'без (bez)',zh:'没有 (méiyǒu)',ja:'なしで (nashi de)',ht:'san'}},
      {n:'avec',t:{en:'with',es:'con',de:'mit',ru:'с (s)',zh:'和/与 (hé/yǔ)',ja:'と一緒に (to issho ni)',ht:'avèk'}},
      {n:'grâce à',t:{en:'thanks to',es:'gracias a',de:'dank',ru:'благодаря (blagodarya)',zh:'多亏 (duōkuī)',ja:'おかげで (okage de)',ht:'gras a'}},
    ]
  },
  conversation:{
    fr:'Phrases de conversation',en:'Conversation phrases',es:'Frases de conversación',ht:'Fraz konvèsasyon',de:'Gesprächsphrasen',ru:'Разговорные фразы',zh:'会话短语',ja:'会話フレーズ',
    icon:'💬',
    words:[
      {n:'Bonjour / Salut',t:{en:'Hello / Hi',es:'Hola / Buenos días',de:'Hallo / Guten Tag',ru:'Привет / Здравствуйте (Privet / Zdravstvuyte)',zh:'你好 (Nǐ hǎo)',ja:'こんにちは (Konnichiwa)',ht:'Bonjou / Salut'}},
      {n:'Au revoir',t:{en:'Goodbye / Bye',es:'Adiós',de:'Auf Wiedersehen',ru:'До свидания (Do svidaniya)',zh:'再见 (Zàijiàn)',ja:'さようなら (Sayōnara)',ht:'Orevwa'}},
      {n:'Merci',t:{en:'Thank you',es:'Gracias',de:'Danke',ru:'Спасибо (Spasibo)',zh:'谢谢 (Xièxiè)',ja:'ありがとう (Arigatō)',ht:'Mèsi'}},
      {n:'S\'il vous plaît',t:{en:'Please',es:'Por favor',de:'Bitte',ru:'Пожалуйста (Pozhaluysta)',zh:'请 (Qǐng)',ja:'お願いします (Onegaishimasu)',ht:'Tanpri'}},
      {n:'Excusez-moi',t:{en:'Excuse me / Sorry',es:'Perdón / Disculpe',de:'Entschuldigung',ru:'Извините (Izvinite)',zh:'对不起 (Duìbuqǐ)',ja:'すみません (Sumimasen)',ht:'Eskize m'}},
      {n:'Comment allez-vous ?',t:{en:'How are you?',es:'¿Cómo estás?',de:'Wie geht es Ihnen?',ru:'Как дела? (Kak dela?)',zh:'你好吗？(Nǐ hǎo ma?)',ja:'お元気ですか？(O-genki desu ka?)',ht:'Kijan ou ye?'}},
      {n:'Très bien, merci',t:{en:'Very well, thank you',es:'Muy bien, gracias',de:'Sehr gut, danke',ru:'Очень хорошо, спасибо',zh:'很好，谢谢 (Hěn hǎo, xièxiè)',ja:'元気です、ありがとう',ht:'Trè bien, mèsi'}},
      {n:'Je ne comprends pas',t:{en:'I don\'t understand',es:'No entiendo',de:'Ich verstehe nicht',ru:'Я не понимаю (Ya ne ponimayu)',zh:'我不明白 (Wǒ bù míngbái)',ja:'わかりません (Wakarimasen)',ht:'Mwen pa konprann'}},
      {n:'Pouvez-vous répéter ?',t:{en:'Can you repeat?',es:'¿Puede repetir?',de:'Können Sie wiederholen?',ru:'Повторите, пожалуйста',zh:'请再说一遍 (Qǐng zài shuō yī biàn)',ja:'もう一度言ってください',ht:'Repete tanpri'}},
      {n:'Parlez plus lentement',t:{en:'Speak more slowly',es:'Hable más despacio',de:'Sprechen Sie langsamer',ru:'Говорите медленнее',zh:'请说慢点 (Qǐng shuō màn diǎn)',ja:'ゆっくり話してください',ht:'Pale pi dousman'}},
      {n:'Je m\'appelle...',t:{en:'My name is...',es:'Me llamo...',de:'Ich heiße...',ru:'Меня зовут... (Menya zovut...)',zh:'我叫... (Wǒ jiào...)',ja:'私の名前は... (Watashi no namae wa...)',ht:'Mwen rele...'}},
      {n:'D\'où venez-vous ?',t:{en:'Where are you from?',es:'¿De dónde eres?',de:'Woher kommen Sie?',ru:'Откуда вы? (Otkuda vy?)',zh:'你从哪里来？(Nǐ cóng nǎlǐ lái?)',ja:'どこから来ましたか？',ht:'Ki kote ou soti?'}},
      {n:'Combien ça coûte ?',t:{en:'How much does it cost?',es:'¿Cuánto cuesta?',de:'Wie viel kostet das?',ru:'Сколько это стоит? (Skolko eto stoit?)',zh:'多少钱？(Duōshǎo qián?)',ja:'いくらですか？(Ikura desu ka?)',ht:'Konbyen sa koute?'}},
      {n:'Où est... ?',t:{en:'Where is...?',es:'¿Dónde está...?',de:'Wo ist...?',ru:'Где находится...? (Gde nakhoditsya...?)',zh:'...在哪里？(...zài nǎlǐ?)',ja:'...はどこですか？',ht:'Ki kote... ye?'}},
      {n:'Au secours !',t:{en:'Help!',es:'¡Ayuda!',de:'Hilfe!',ru:'Помогите! (Pomogite!)',zh:'救命！(Jiùmìng!)',ja:'助けて！(Tasukete!)',ht:'Ede m!'}},
    ]
  },
    nature_climat: {
    fr:'Nature et Climat',en:'Nature and Climate',es:'Naturaleza y Clima',ht:'Lanati ak Klima',de:'Natur und Klima',ru:'Priroda i Klimat',zh:'Ziran yu Qihou',ja:'Shizen to Kiko',
    icon:'🌿',
    words:[
      {n:'soleil',t:{en:'sun',es:'sol',de:'Sonne',ru:'solntse',zh:'taiyang',ja:'taiyo',ht:'solèy'}},
      {n:'lune',t:{en:'moon',es:'luna',de:'Mond',ru:'luna',zh:'yueliang',ja:'tsuki',ht:'lalin'}},
      {n:'ciel',t:{en:'sky',es:'cielo',de:'Himmel',ru:'nebo',zh:'tiankong',ja:'sora',ht:'syèl'}},
      {n:'étoile',t:{en:'star',es:'estrella',de:'Stern',ru:'zvezda',zh:'xingxing',ja:'hoshi',ht:'zetwal'}},
      {n:'pluie',t:{en:'rain',es:'lluvia',de:'Regen',ru:'dozhd',zh:'xiayu',ja:'ame',ht:'lapli'}},
      {n:'vent',t:{en:'wind',es:'viento',de:'Wind',ru:'veter',zh:'feng',ja:'kaze',ht:'van'}},
      {n:'mer',t:{en:'sea',es:'mar',de:'Meer',ru:'more',zh:'hai',ja:'umi',ht:'lanmè'}},
      {n:'montagne',t:{en:'mountain',es:'montaña',de:'Berg',ru:'gora',zh:'shan',ja:'yama',ht:'mòn'}},
      {n:'arbre',t:{en:'tree',es:'árbol',de:'Baum',ru:'derevo',zh:'shu',ja:'ki',ht:'pyebwa'}},
      {n:'fleur',t:{en:'flower',es:'flor',de:'Blume',ru:'tsvetok',zh:'hua',ja:'hana',ht:'flè'}},
      {n:'terre',t:{en:'earth',es:'tierra',de:'Erde',ru:'zemlya',zh:'diqiu',ja:'chikyu',ht:'tè'}},
      {n:'feu',t:{en:'fire',es:'fuego',de:'Feuer',ru:'ogon',zh:'huo',ja:'hi',ht:'dife'}},
      {n:'rivière',t:{en:'river',es:'río',de:'Fluss',ru:'reka',zh:'he',ja:'kawa',ht:'rivyè'}},
      {n:'forêt',t:{en:'forest',es:'bosque',de:'Wald',ru:'les',zh:'senlin',ja:'mori',ht:'fokè'}},
      {n:'herbe',t:{en:'grass',es:'hierba',de:'Gras',ru:'trava',zh:'cao',ja:'kusa',ht:'gerbe'}},
    ]
  },
  transports: {
    fr:'Transports',en:'Transport',es:'Transporte',ht:'Transpò',de:'Verkehr',ru:'Transport',zh:'Jiaotong',ja:'Kotsu',
    icon:'🚲',
    words:[
      {n:'avion',t:{en:'plane',es:'avión',de:'Flugzeug',ru:'samolet',zh:'feiji',ja:'hikoki',ht:'avion'}},
      {n:'bateau',t:{en:'boat',es:'barco',de:'Boot',ru:'lodka',zh:'chuan',ja:'fune',ht:'batiman'}},
      {n:'vélo',t:{en:'bike',es:'bicicleta',de:'Fahrrad',ru:'velosiped',zh:'zixingche',ja:'jitensha',ht:'bisiklèt'}},
      {n:'bus',t:{en:'bus',es:'autobús',de:'Bus',ru:'avtobus',zh:'gonggong qiche',ja:'basu',ht:'bis'}},
      {n:'train',t:{en:'train',es:'tren',de:'Zug',ru:'poezd',zh:'huoche',ja:'densha',ht:'tren'}},
      {n:'moto',t:{en:'motorcycle',es:'moto',de:'Motorrad',ru:'mototsikl',zh:'motuoche',ja:'otobai',ht:'moto'}},
      {n:'taxi',t:{en:'taxi',es:'taxi',de:'Taxi',ru:'taksi',zh:'chuzu che',ja:'takushi',ht:'taksi'}},
      {n:'aéroport',t:{en:'airport',es:'aeropuerto',de:'Flughafen',ru:'aeroport',zh:'jichang',ja:'kuko',ht:'ayopò'}},
      {n:'gare',t:{en:'station',es:'estación',de:'Bahnhof',ru:'vokzal',zh:'chezhan',ja:'eki',ht:'estasyon'}},
      {n:'billet',t:{en:'ticket',es:'billete',de:'Ticket',ru:'bilet',zh:'piao',ja:'kippu',ht:'tikè'}},
      {n:'route',t:{en:'road',es:'carretera',de:'Straße',ru:'doroga',zh:'lu',ja:'michi',ht:'wout'}},
      {n:'voyage',t:{en:'trip',es:'viaje',de:'Reise',ru:'puteshestvie',zh:'lvxing',ja:'ryoko',ht:'vwayaj'}},
      {n:'valise',t:{en:'suitcase',es:'maleta',de:'Koffer',ru:'chemodan',zh:'xingli xiang',ja:'sutukesu',ht:'valiz'}},
      {n:'conduire',t:{en:'to drive',es:'conducir',de:'fahren',ru:'vodit',zh:'jiashi',ja:'unten suru',ht:'kondwi'}},
      {n:'marcher',t:{en:'to walk',es:'caminar',de:'laufen',ru:'khodit',zh:'sanbu',ja:'aruku',ht:'mache'}},
    ]
  },
  couleurs_formes: {
    fr:'Couleurs et Formes',en:'Colors and Shapes',es:'Colores y Formas',ht:'Koulè ak Fòm',de:'Farben und Formen',ru:'Tsveta i Formy',zh:'Yanse yu Xingzhuang',ja:'Iro to Katachi',
    icon:'🌈',
    words:[
      {n:'rouge',t:{en:'red',es:'rojo',de:'rot',ru:'krasnyy',zh:'hongse',ja:'aka',ht:'wouj'}},
      {n:'bleu',t:{en:'blue',es:'azul',de:'blau',ru:'siniy',zh:'lanse',ja:'ao',ht:'ble'}},
      {n:'vert',t:{en:'green',es:'verde',de:'grün',ru:'zelenyy',zh:'lvse',ja:'midori',ht:'vè'}},
      {n:'jaune',t:{en:'yellow',es:'amarillo',de:'gelb',ru:'zheltyy',zh:'huangse',ja:'kiiro',ht:'jòn'}},
      {n:'noir',t:{en:'black',es:'negro',de:'schwarz',ru:'chernyy',zh:'heise',ja:'kuro',ht:'nwa'}},
      {n:'blanc',t:{en:'white',es:'blanco',de:'weiß',ru:'belyy',zh:'baise',ja:'shiro',ht:'blan'}},
      {n:'rose',t:{en:'pink',es:'rosa',de:'rosa',ru:'rozovyy',zh:'fense',ja:'pinku',ht:'woz'}},
      {n:'orange',t:{en:'orange',es:'naranja',de:'orange',ru:'oranzhevyy',zh:'chengse',ja:'orenji',ht:'oran'}},
      {n:'gris',t:{en:'grey',es:'gris',de:'grau',ru:'seryy',zh:'huise',ja:'haiiro',ht:'gri'}},
      {n:'marron',t:{en:'brown',es:'marrón',de:'braun',ru:'korichnevyy',zh:'zongse',ja:'chairo',ht:'mawon'}},
      {n:'cercle',t:{en:'circle',es:'círculo',de:'Kreis',ru:'krug',zh:'yuanquan',ja:'en',ht:'sèk'}},
      {n:'carré',t:{en:'square',es:'cuadrado',de:'Quadrat',ru:'kvadrat',zh:'zhengfangxing',ja:'shikaku',ht:'kare'}},
      {n:'ligne',t:{en:'line',es:'línea',de:'Linie',ru:'liniya',zh:'xian',ja:'sen',ht:'liy'}},
      {n:'point',t:{en:'point',es:'punto',de:'Punkt',ru:'tochka',zh:'dian',ja:'ten',ht:'pwen'}},
      {n:'triangle',t:{en:'triangle',es:'triángulo',de:'Dreieck',ru:'treugolnik',zh:'sanjiaoxing',ja:'sankaku',ht:'triyang'}},
    ]
  },
  animaux: {
    fr:'Animaux',en:'Animals',es:'Animales',ht:'Zannimo',de:'Tiere',ru:'Zhivotnye',zh:'Dongwu',ja:'Dobutsu',
    icon:'🦁',
    words:[
      {n:'chien',t:{en:'dog',es:'perro',de:'Hund',ru:'sobaka',zh:'gou',ja:'inu',ht:'chen'}},
      {n:'chat',t:{en:'cat',es:'gato',de:'Katze',ru:'koshka',zh:'mao',ja:'neko',ht:'chat'}},
      {n:'oiseau',t:{en:'bird',es:'pájaro',de:'Vogel',ru:'ptitsa',zh:'niao',ja:'tori',ht:'zwazo'}},
      {n:'cheval',t:{en:'horse',es:'caballo',de:'Pferd',ru:'loshad',zh:'ma',ja:'uma',ht:'chwal'}},
      {n:'vache',t:{en:'cow',es:'vaca',de:'Kuh',ru:'korova',zh:'niū',ja:'ushi',ht:'vach'}},
      {n:'cochon',t:{en:'pig',es:'cerdo',de:'Schwein',ru:'svinya',zh:'zhu',ja:'buta',ht:'kochon'}},
      {n:'lion',t:{en:'lion',es:'león',de:'Löwe',ru:'lev',zh:'shizi',ja:'raion',ht:'lyon'}},
      {n:'éléphant',t:{en:'elephant',es:'elefante',de:'Elefant',ru:'slon',zh:'daxiang',ja:'zo',ht:'elefan'}},
      {n:'poisson',t:{en:'fish',es:'pez',de:'Fisch',ru:'ryba',zh:'yu',ja:'sakana',ht:'pwason'}},
      {n:'serpent',t:{en:'snake',es:'serpiente',de:'Schlange',ru:'zmeya',zh:'she',ja:'hebi',ht:'koulèv'}},
      {n:'singe',t:{en:'monkey',es:'mono',de:'Affe',ru:'obezyana',zh:'houzi',ja:'saru',ht:'makak'}},
      {n:'souris',t:{en:'mouse',es:'ratón',de:'Maus',ru:'mysh',zh:'laoshu',ja:'nezumi',ht:'sourit'}},
      {n:'lapin',t:{en:'rabbit',es:'conejo',de:'Hase',ru:'krolik',zh:'tuzi',ja:'usagi',ht:'lapen'}},
      {n:'ours',t:{en:'bear',es:'oso',de:'Bär',ru:'medved',zh:'xiong',ja:'kuma',ht:'ous'}},
      {n:'tigre',t:{en:'tiger',es:'tigre',de:'Tiger',ru:'tigr',zh:'laohu',ja:'tora',ht:'tig'}},
    ]
  },
  vetements: {
    fr:'Vêtements',en:'Clothing',es:'Ropa',ht:'Rad',de:'Kleidung',ru:'Odezhda',zh:'Yifu',ja:'Fuku',
    icon:'👕',
    words:[
      {n:'chemise',t:{en:'shirt',es:'camisa',de:'Hemd',ru:'rubashka',zh:'chenshan',ja:'shatsu',ht:'chemiz'}},
      {n:'pantalon',t:{en:'pants',es:'pantalón',de:'Hose',ru:'bryuki',zh:'kuzi',ja:'zubon',ht:'pantalon'}},
      {n:'robe',t:{en:'dress',es:'vestido',de:'Kleid',ru:'platye',zh:'lian yiqun',ja:'doresu',ht:'wòb'}},
      {n:'chaussures',t:{en:'shoes',es:'zapatos',de:'Schuhe',ru:'obuv',zh:'xiezi',ja:'kutsu',ht:'soulye'}},
      {n:'chapeau',t:{en:'hat',es:'sombrero',de:'Hut',ru:'shlyapa',zh:'maozi',ja:'boshi',ht:'chapō'}},
      {n:'manteau',t:{en:'coat',es:'abrigo',de:'Mantel',ru:'palto',zh:'waitao',ja:'koto',ht:'manto'}},
      {n:'jupe',t:{en:'skirt',es:'falda',de:'Rock',ru:'yubka',zh:'qunzi',ja:'sukāto',ht:'jip'}},
      {n:'chaussettes',t:{en:'socks',es:'calcetines',de:'Socken',ru:'noski',zh:'wazi',ja:'kutsushita',ht:'chosèt'}},
      {n:'sac à main',t:{en:'handbag',es:'bolso',de:'Handtasche',ru:'sumka',zh:'shoutiba',ja:'baggu',ht:'sak'}},
      {n:'ceinture',t:{en:'belt',es:'cinturón',de:'Gürtel',ru:'remen',zh:'pindai',ja:'beruto',ht:'sentiwon'}},
      {n:'lunettes',t:{en:'glasses',es:'gafas',de:'Brille',ru:'ochki',zh:'yanjing',ja:'megane',ht:'linèt'}},
      {n:'montre',t:{en:'watch',es:'reloj',de:'Uhr',ru:'chasy',zh:'shoubiao',ja:'tokei',ht:'mont'}},
      {n:'gants',t:{en:'gloves',es:'guantes',de:'Handschuhe',ru:'perchatki',zh:'shoutao',ja:'tebukuro',ht:'gan'}},
      {n:'pyjama',t:{en:'pajamas',es:'pijama',de:'Schlafanzug',ru:'pizhama',zh:'shuiyi',ja:'pajama',ht:'pijama'}},
      {n:'maillot',t:{en:'swimsuit',es:'traje de baño',de:'Badeanzug',ru:'kupalnik',zh:'yongyi',ja:'mizugi',ht:'mayo'}},
    ]
  },
  technologie: {
    fr:'Technologie & Bureau',en:'Tech & Office',es:'Tecnología',ht:'Teknoloji',de:'Technologie',ru:'Tekhnologiya',zh:'Keji',ja:'Gijutsu',
    icon:'💻',
    words:[
      {n:'clavier',t:{en:'keyboard',es:'teclado',de:'Tastatur',ru:'klaviatura',zh:'jianpan',ja:'kibodo',ht:'klavye'}},
      {n:'souris',t:{en:'mouse',es:'ratón',de:'Maus',ru:'myshka',zh:'shubiao',ja:'mausu',ht:'sourit'}},
      {n:'écran',t:{en:'screen',es:'screen',de:'Bildschirm',ru:'ekran',zh:'pingmu',ja:'gamen',ht:'ekran'}},
      {n:'batterie',t:{en:'battery',es:'batería',de:'Batterie',ru:'batareya',zh:'dianchi',ja:'batteri',ht:'batri'}},
      {n:'internet',t:{en:'internet',es:'internet',de:'Internet',ru:'internet',zh:'hulianwang',ja:'intanetto',ht:'entènèt'}},
      {n:'mot de passe',t:{en:'password',es:'contraseña',de:'Passwort',ru:'parol',zh:'mima',ja:'pasuwado',ht:'motdepas'}},
      {n:'email',t:{en:'email',es:'correo',de:'E-Mail',ru:'pochta',zh:'youjian',ja:'meru',ht:'imèl'}},
      {n:'télécharger',t:{en:'download',es:'descargar',de:'herunterladen',ru:'skachat',zh:'xiazai',ja:'daunrodo',ht:'telechaje'}},
      {n:'site web',t:{en:'website',es:'sitio web',de:'Webseite',ru:'sayt',zh:'wangzhan',ja:'wesaito',ht:'sitwèb'}},
      {n:'logiciel',t:{en:'software',es:'software',de:'Software',ru:'programma',zh:'ruanjian',ja:'sofutowea',ht:'lojisyèl'}},
      {n:'imprimante',t:{en:'printer',es:'impresora',de:'Drucker',ru:'printer',zh:'dayinji',ja:'purinta',ht:'enprimant'}},
      {n:'fichier',t:{en:'file',es:'archivo',de:'Datei',ru:'fayl',zh:'wenjian',ja:'fairu',ht:'fichye'}},
      {n:'message',t:{en:'message',es:'mensaje',de:'Nachricht',ru:'soobshchenie',zh:'xiaoxi',ja:'messeeji',ht:'mesaj'}},
      {n:'caméra',t:{en:'camera',es:'cámara',de:'Kamera',ru:'kamera',zh:'xiangji',ja:'kamera',ht:'kamera'}},
      {n:'réseau',t:{en:'network',es:'red',de:'Netzwerk',ru:'set',zh:'wangluo',ja:'nettowaku',ht:'rezo'}},
    ]
  },
  metiers: {
    fr:'Métiers',en:'Professions',es:'Profesiones',ht:'Metye',de:'Berufe',ru:'Professii',zh:'Zhiye',ja:'Shigoto',
    icon:'👨‍🔧',
    words:[
      {n:'docteur',t:{en:'doctor',es:'médico',de:'Arzt',ru:'vrach',zh:'yisheng',ja:'isha',ht:'doktè'}},
      {n:'professeur',t:{en:'teacher',es:'profesor',de:'Lehrer',ru:'uchitel',zh:'laoshi',ja:'sensei',ht:'pwofesè'}},
      {n:'ingénieur',t:{en:'engineer',es:'ingeniero',de:'Ingenieur',ru:'inzhener',zh:'gongchengshi',ja:'enjinia',ht:'enjenyè'}},
      {n:'policier',t:{en:'police officer',es:'policía',de:'Polizist',ru:'politseyskiy',zh:'jingcha',ja:'keisatsukan',ht:'polis'}},
      {n:'cuisinier',t:{en:'cook',es:'cocinero',de:'Koch',ru:'povar',zh:'chushi',ja:'ryorinon',ht:'kizinye'}},
      {n:'infirmier',t:{en:'nurse',es:'enfermero',de:'Krankenpfleger',ru:'medsestra',zh:'hushi',ja:'kangoshi',ht:'enfimye'}},
      {n:'artiste',t:{en:'artist',es:'artista',de:'Künstler',ru:'khudozhnik',zh:'yishujia',ja:'geijutsuka',ht:'atis'}},
      {n:'écrivain',t:{en:'writer',es:'escritor',de:'Schriftsteller',ru:'pisatel',zh:'zuojia',ja:'sakka',ht:'ekriven'}},
      {n:'vendeur',t:{en:'salesperson',es:'vendedor',de:'Verkäufer',ru:'prodavets',zh:'xiaoshouyuan',ja:'tenin',ht:'vandè'}},
      {n:'avocat',t:{en:'lawyer',es:'abogado',de:'Anwalt',ru:'advokat',zh:'lvshi',ja:'bengoshi',ht:'avoka'}},
      {n:'pilote',t:{en:'pilot',es:'piloto',de:'Pilot',ru:'pilot',zh:'feixingyuan',ja:'pairotto',ht:'pilot'}},
      {n:'agriculteur',t:{en:'farmer',es:'agricultor',de:'Bauer',ru:'fermer',zh:'nongmin',ja:'noka',ht:'agrikiltè'}},
      {n:'musicien',t:{en:'musician',es:'músico',de:'Musiker',ru:'muzykant',zh:'yinyuejia',ja:'ongakuka',ht:'mizisyen'}},
      {n:'étudiant',t:{en:'student',es:'estudiante',de:'Student',ru:'student',zh:'xuesheng',ja:'gakusei',ht:'etidyan'}},
      {n:'secrétaire',t:{en:'secretary',es:'secretario',de:'Sekretär',ru:'sekretar',zh:'mishu',ja:'hisho',ht:'sekretè'}},
    ]
  },
  sante: {
    fr:'Santé',en:'Health',es:'Salud',ht:'Sante',de:'Gesundheit',ru:'Zdorovye',zh:'Jiankang',ja:'Kenko',
    icon:'🏥',
    words:[
      {n:'médicament',t:{en:'medicine',es:'medicamento',de:'Medikament',ru:'lekarstvo',zh:'yaowu',ja:'kusuri',ht:'medikaman'}},
      {n:'douleur',t:{en:'pain',es:'dolor',de:'Schmerz',ru:'bol',zh:'tongku',ja:'itami',ht:'doule'}},
      {n:'malade',t:{en:'sick',es:'enfermo',de:'krank',ru:'bolnoy',zh:'shengbing',ja:'byoki',ht:'malad'}},
      {n:'fièvre',t:{en:'fever',es:'fiebre',de:'Fieber',ru:'lixoradka',zh:'fashao',ja:'netsu',ht:'lafiev'}},
      {n:'toux',t:{en:'cough',es:'tos',de:'Husten',ru:'kashel',zh:'kesou',ja:'seki',ht:'tous'}},
      {n:'sang',t:{en:'blood',es:'sangre',de:'Blut',ru:'krov',zh:'xue',ja:'chi',ht:'san'}},
      {n:'corps',t:{en:'body',es:'cuerpo',de:'Körper',ru:'telo',zh:'shenti',ja:'karada',ht:'kò'}},
      {n:'sommeil',t:{en:'sleep',es:'sleep',de:'Schlaf',ru:'son',zh:'shuimian',ja:'suimin',ht:'dòmi'}},
      {n:'hôpital',t:{en:'hospital',es:'hospital',de:'Krankenhaus',ru:'bolnitsa',zh:'yiyuan',ja:'byoin',ht:'lopital'}},
      {n:'urgence',t:{en:'emergency',es:'emergencia',de:'Notfall',ru:'skoraya',zh:'jinji',ja:'kinkyu',ht:'ijans'}},
      {n:'dentiste',t:{en:'dentist',es:'dentista',de:'Zahnarzt',ru:'stomatolog',zh:'yayi',ja:'haisha',ht:'dentis'}},
      {n:'pharmacie',t:{en:'pharmacy',es:'farmacia',de:'Apotheke',ru:'apteka',zh:'yaodian',ja:'yakkyoku',ht:'famasit'}},
      {n:'vue',t:{en:'vision',es:'visión',de:'Sicht',ru:'zrenie',zh:'shili',ja:'shikaku',ht:'vi'}},
      {n:'ouïe',t:{en:'hearing',es:'oído',de:'Gehör',ru:'slukh',zh:'tingli',ja:'chokaku',ht:'ouyi'}},
      {n:'repos',t:{en:'rest',es:'descanso',de:'Ruhe',ru:'otdykh',zh:'xiuxi',ja:'kyusei',ht:'repo'}},
    ]
  },
  cuisine_outils: {
    fr:'Cuisine (Ustensiles)',en:'Kitchen (Tools)',es:'Cocina',ht:'Kizin',de:'Küche',ru:'Kukhnya',zh:'Chufang',ja:'Daidiokoro',
    icon:'🍴',
    words:[
      {n:'assiette',t:{en:'plate',es:'plato',de:'Teller',ru:'tarelka',zh:'panzi',ja:'osara',ht:'asit'}},
      {n:'verre',t:{en:'glass',es:'vaso',de:'Glas',ru:'stakan',zh:'beizi',ja:'koppu',ht:'vè'}},
      {n:'fourchette',t:{en:'fork',es:'tenedor',de:'Gabel',ru:'vilka',zh:'chazi',ja:'foku',ht:'fouchèt'}},
      {n:'couteau',t:{en:'knife',es:'cuchillo',de:'Messer',ru:'nozh',zh:'daoping',ja:'naifu',ht:'kouto'}},
      {n:'cuillère',t:{en:'spoon',es:'cuchara',de:'Löffel',ru:'lozhka',zh:'shaozi',ja:'supun',ht:'kuiyè'}},
      {n:'bol',t:{en:'bowl',es:'bol',de:'Schüssel',ru:'miska',zh:'wan',ja:'wan',ht:'bòl'}},
      {n:'poêle',t:{en:'frying pan',es:'sartén',de:'Pfanne',ru:'skovoroda',zh:'pingdigao',ja:'furaipan',ht:'poèl'}},
      {n:'four',t:{en:'oven',es:'horno',de:'Ofen',ru:'dukhovka',zh:'kaoxiang',ja:'obun',ht:'fou'}},
      {n:'réfrigérateur',t:{en:'fridge',es:'nevera',de:'Kühlschrank',ru:'kholodilnik',zh:'bingxiang',ja:'reizoko',ht:'frijidè'}},
      {n:'serviette',t:{en:'napkin',es:'servilleta',de:'Serviette',ru:'salfetka',zh:'canjin',ja:'napukin',ht:'sèvyèt'}},
      {n:'bouteille',t:{en:'bottle',es:'botella',de:'Flasche',ru:'butylka',zh:'pingzi',ja:'bin',ht:'boutèy'}},
      {n:'tasse',t:{en:'cup',es:'taza',de:'Tasse',ru:'chashka',zh:'beizi',ja:'kappu',ht:'tas'}},
      {n:'marmite',t:{en:'pot',es:'olla',de:'Topf',ru:'kastrulya',zh:'guo',ja:'nabe',ht:'mamit'}},
      {n:'évier',t:{en:'sink',es:'fregadero',de:'Spülbecken',ru:'rakovina',zh:'shuicao',ja:'shinku',ht:'evye'}},
      {n:'selle',t:{en:'salt shaker',es:'salero',de:'Salzstreuer',ru:'solonka',zh:'yanguan',ja:'shio-ire',ht:'salye'}},
    ]
  },
  emotions: {
    fr:'Émotions',en:'Emotions',es:'Emociones',ht:'Emosyon',de:'Emotionen',ru:'Emotsii',zh:'qinggan',ja:'kanjo',
    icon:'🎭',
    words:[
      {n:'peur',t:{en:'fear',es:'miedo',de:'Angst',ru:'strakh',zh:'kongju',ja:'kyofu',ht:'pè'}},
      {n:'colère',t:{en:'anger',es:'ira',de:'Wut',ru:'gnev',zh:'fennu',ja:'ikari',ht:'kòlè'}},
      {n:'surprise',t:{en:'surprise',es:'sorpresa',de:'Überraschung',ru:'syurpriz',zh:'jingxi',ja:'odoroki',ht:'sipriz'}},
      {n:'joie',t:{en:'joy',es:'alegría',de:'Freude',ru:'radost',zh:'kuailè',ja:'yorokobi',ht:'kè kontan'}},
      {n:'ennui',t:{en:'boredom',es:'aburrimiento',de:'Langeweile',ru:'skuka',zh:'wuliao',ja:'taikutsu',ht:'annwi'}},
      {n:'espoir',t:{en:'hope',es:'esperanza',de:'Hoffnung',ru:'nadezhda',zh:'xiwang',ja:'kibo',ht:'espwa'}},
      {n:'confiance',t:{en:'trust',es:'confianza',de:'Vertrauen',ru:'doverie',zh:'xinren',ja:'shinrai',ht:'konfyans'}},
      {n:'honte',t:{en:'shame',es:'vergüenza',de:'Scham',ru:'styd',zh:'xiuchi',ja:'haji',ht:'wont'}},
      {n:'fierté',t:{en:'pride',es:'orgullo',de:'Stolz',ru:'gordost',zh:'zihao',ja:'hokori',ht:'fyète'}},
      {n:'amour',t:{en:'love',es:'amor',de:'Liebe',ru:'lyubov',zh:'ai',ja:'ai',ht:'lanmou'}},
      {n:'jalousie',t:{en:'jealousy',es:'celos',de:'Eifersucht',ru:'revnost',zh:'jidu',ja:'shitto',ht:'jalouzi'}},
      {n:'courage',t:{en:'courage',es:'coraje',de:'Mut',ru:'muzhestvo',zh:'yongqi',ja:'yuki',ht:'kouraj'}},
      {n:'calme',t:{en:'calm',es:'calma',de:'Ruhe',ru:'spokoystvie',zh:'pingjing',ja:'reisei',ht:'kalm'}},
      {n:'stress',t:{en:'stress',es:'estrés',de:'Stress',ru:'stress',zh:'yali',ja:'sutoresu',ht:'estrès'}},
      {n:'curiosité',t:{en:'curiosity',es:'curiosidad',de:'Neugier',ru:'lyubopytstvo',zh:'haoqixin',ja:'koukishin',ht:'kuryozite'}},
    ]
  },
  loisirs: {
    fr:'Loisirs',en:'Leisure',es:'Ocio',ht:'Lwazi',de:'Freizeit',ru:'Dosug',zh:'xiuxian',ja:'rejaa',
    icon:'🎸',
    words:[
      {n:'musique',t:{en:'music',es:'música',de:'Musik',ru:'muzyka',zh:'yinyue',ja:'ongaku',ht:'mizik'}},
      {n:'danse',t:{en:'dance',es:'danza',de:'Tanz',ru:'tanets',zh:'wu',ja:'dansu',ht:'danse'}},
      {n:'voyage',t:{en:'travel',es:'viaje',de:'Reise',ru:'puteshestvie',zh:'lvxing',ja:'ryoko',ht:'vwayaj'}},
      {n:'photo',t:{en:'photography',es:'fotografía',de:'Fotografie',ru:'fotografiya',zh:'sheying',ja:'shashin',ht:'foto'}},
      {n:'dessin',t:{en:'drawing',es:'dibujo',de:'Zeichnung',ru:'risunok',zh:'huihua',ja:'o-kaki',ht:'desen'}},
      {n:'film',t:{en:'movie',es:'película',de:'Film',ru:'kino',zh:'dianying',ja:'eiga',ht:'fim'}},
      {n:'jeu',t:{en:'game',es:'juego',de:'Spiel',ru:'igra',zh:'youxi',ja:'gemu',ht:'jwèt'}},
      {n:'lecture',t:{en:'reading',es:'lectura',de:'Lesen',ru:'chtenie',zh:'yuedu',ja:'dokusho',ht:'lektir'}},
      {n:'théâtre',t:{en:'theater',es:'teatro',de:'Theater',ru:'teatr',zh:'juyuan',ja:'gekijo',ht:'teat'}},
      {n:'peinture',t:{en:'painting',es:'pintura',de:'Malerei',ru:'zhivopis',zh:'huihua',ja:'kaiga',ht:'pentire'}},
      {n:'jardinage',t:{en:'gardening',es:'jardinería',de:'Gärtnern',ru:'sadovodstvo',zh:'yuanyi',ja:'engei',ht:'jadinaj'}},
      {n:'cuisine',t:{en:'cooking',es:'cocinar',de:'Kochen',ru:'kulinariya',zh:'pengren',ja:'ryori',ht:'kizin'}},
      {n:'chant',t:{en:'singing',es:'canto',de:'Gesang',ru:'penie',zh:'gechang',ja:'uta',ht:'chante'}},
      {n:'fête',t:{en:'party',es:'fiesta',de:'Party',ru:'vecherinka',zh:'paidui',ja:'pati',ht:'fèt'}},
      {n:'sport',t:{en:'sport',es:'deporte',de:'Sport',ru:'sport',zh:'tiyu',ja:'supotsu',ht:'espò'}},
    ]
  },
  sports: {
    fr:'Sports',en:'Sports',es:'Deportes',ht:'Espò',de:'Sportarten',ru:'Sport',zh:'tiyu',ja:'supotsu',
    icon:'⚽',
    words:[
      {n:'football',t:{en:'soccer',es:'fútbol',de:'Fußball',ru:'futbol',zh:'zuqiu',ja:'sakka',ht:'balonpye'}},
      {n:'basket',t:{en:'basketball',es:'baloncesto',de:'Basketball',ru:'basketbol',zh:'lanqiu',ja:'basukeboru',ht:'basket'}},
      {n:'tennis',t:{en:'tennis',es:'tenis',de:'Tennis',ru:'tennis',zh:'wangqiu',ja:'tenisu',ht:'tenis'}},
      {n:'natation',t:{en:'swimming',es:'natación',de:'Schwimmen',ru:'plavanie',zh:'youyong',ja:'suiei',ht:'najé'}},
      {n:'course',t:{en:'running',es:'correr',de:'Laufen',ru:'beg',zh:'paobu',ja:'ran-ningu',ht:'kous'}},
      {n:'vélo',t:{en:'cycling',es:'ciclismo',de:'Radfahren',ru:'velosport',zh:'qixing',ja:'saikuringu',ht:'bisiklèt'}},
      {n:'boxe',t:{en:'boxing',es:'boxeo',de:'Boxen',ru:'boks',zh:'quanji',ja:'bokushingu',ht:'bòks'}},
      {n:'yoga',t:{en:'yoga',es:'yoga',de:'Yoga',ru:'yoga',zh:'yuja',ja:'yoga',ht:'yoga'}},
      {n:'karaté',t:{en:'karate',es:'karate',de:'Karate',ru:'karate',zh:'kongshoudao',ja:'karate',ht:'karate'}},
      {n:'surf',t:{en:'surfing',es:'surf',de:'Surfen',ru:'serfing',zh:'chonglang',ja:'safin',ht:'sèf'}},
      {n:'ski',t:{en:'skiing',es:'esquí',de:'Skifahren',ru:'lyzhi',zh:'huaxue',ja:'suki',ht:'ski'}},
      {n:'gym',t:{en:'gymnastics',es:'gimnasia',de:'Gymnastik',ru:'gimnastika',zh:'ticao',ja:'taiso',ht:'jim'}},
      {n:'volley',t:{en:'volleyball',es:'voleibol',de:'Volleyball',ru:'voleybol',zh:'paiqiu',ja:'bareboru',ht:'volebòl'}},
      {n:'danse',t:{en:'dance',es:'danza',de:'Tanz',ru:'tantsy',zh:'wu',ja:'dansu',ht:'danse'}},
      {n:'marche',t:{en:'walking',es:'caminar',de:'Wandern',ru:'khodba',zh:'tubu',ja:'uokingue',ht:'mache'}},
    ]
  },
  mobilier: {
    fr:'Mobilier',en:'Furniture',es:'Muebles',ht:'Mèb',de:'Möbel',ru:'Mebel',zh:'Jiaju',ja:'Kagu',
    icon:'🛋️',
    words:[
      {n:'canapé',t:{en:'sofa',es:'sofá',de:'Sofa',ru:'divan',zh:'shafa',ja:'sofa',ht:'kanape'}},
      {n:'armoire',t:{en:'wardrobe',es:'armario',de:'Schrank',ru:'shkaf',zh:'yigui',ja:'tansu',ht:'plaka'}},
      {n:'étagère',t:{en:'shelf',es:'estante',de:'Regal',ru:'polka',zh:'jiazi',ja:'tana',ht:'etajè'}},
      {n:'bureau',t:{en:'desk',es:'escritorio',de:'Schreibtisch',ru:'pismennyy stol',zh:'shuzhuo',ja:'tsukue',ht:'biwo'}},
      {n:'tapis',t:{en:'rug',es:'alfombra',de:'Teppich',ru:'kover',zh:'ditan',ja:'kagami',ht:'tapi'}},
      {n:'miroir',t:{en:'mirror',es:'espejo',de:'Spiegel',ru:'zerkalo',zh:'jingzi',ja:'kagami',ht:'miwa'}},
      {n:'rideau',t:{en:'curtain',es:'cortina',de:'Vorhang',ru:'shtora',zh:'chuanglian',ja:'katen',ht:'rido'}},
      {n:'lampe',t:{en:'lamp',es:'lámpara',de:'Lampe',ru:'lampa',zh:'deng',ja:'ranpu',ht:'lanp'}},
      {n:'coussin',t:{en:'cushion',es:'cojín',de:'Kissen',ru:'podushka',zh:'dianzi',ja:'kusshon',ht:'kousen'}},
      {n:'horloge',t:{en:'clock',es:'reloj',de:'Uhr',ru:'chasy',zh:'zhong',ja:'tokei',ht:'òlòj'}},
      {n:'tiroir',t:{en:'drawer',es:'cajón',de:'Schublade',ru:'yashchik',zh:'chouti',ja:'hikidashi',ht:'tiwa'}},
      {n:'évier',t:{en:'sink',es:'fregadero',de:'Waschbecken',ru:'rakovina',zh:'shuicao',ja:'shinku',ht:'evye'}},
      {n:'douche',t:{en:'shower',es:'ducha',de:'Dusche',ru:'dush',zh:'linyu',ja:'shawa',ht:'douch'}},
      {n:'toilettes',t:{en:'toilet',es:'baño',de:'Toilette',ru:'tualet',zh:'cesuo',ja:'toire',ht:'twalèt'}},
      {n:'balcon',t:{en:'balcony',es:'balcón',de:'Balkon',ru:'balkon',zh:'yangtai',ja:'barukoni',ht:'balkon'}},
    ]
  },
  fournitures_bureau: {
    fr:'Fournitures',en:'Supplies',es:'Suministros',ht:'Ekipman',de:'Bedarf',ru:'Materialy',zh:'Yongpin',ja:'Buhin',
    icon:'📎',
    words:[
      {n:'papier',t:{en:'paper',es:'papel',de:'Papier',ru:'bumaga',zh:'zhi',ja:'kami',ht:'papye'}},
      {n:'ciseaux',t:{en:'scissors',es:'tijeras',de:'Schere',ru:'nozhnitsy',zh:'jian-dao',ja:'hasami',ht:'sizo'}},
      {n:'colle',t:{en:'glue',es:'pegamento',de:'Kleber',ru:'kley',zh:'jiaoshui',ja:'nori',ht:'kòl'}},
      {n:'gomme',t:{en:'eraser',es:'goma',de:'Radiergummi',ru:'lastik',zh:'xiangpi',ja:'keshigomu',ht:'gonm'}},
      {n:'règle',t:{en:'ruler',es:'regla',de:'Lineal',ru:'lineyka',zh:'chi',ja:'jōgi',ht:'règ'}},
      {n:'cahier',t:{en:'notebook',es:'cuaderno',de:'Notizbuch',ru:'tetrad',zh:'benzi',ja:'noto',ht:'kayer'}},
      {n:'classeur',t:{en:'folder',es:'carpeta',de:'Ordner',ru:'papka',zh:'wenjianjia',ja:'fairu',ht:'klasè'}},
      {n:'agrafeuse',t:{en:'stapler',es:'engrapadora',de:'Tacker',ru:'stepler',zh:'dingshuji',ja:'hotchikisu',ht:'agrafèz'}},
      {n:'enveloppe',t:{en:'envelope',es:'sobre',de:'Umschlag',ru:'konvert',zh:'xin-feng',ja:'futo',ht:'anvlòp'}},
      {n:'agenda',t:{en:'planner',es:'agenda',de:'Planer',ru:'ezhednevnik',zh:'richengben',ja:'techo',ht:'ajenda'}},
      {n:'calculatrice',t:{en:'calculator',es:'calculadora',de:'Rechner',ru:'kalkulyator',zh:'jisuanqi',ja:'dentō',ht:'kalkilatris'}},
      {n:'étiquette',t:{en:'label',es:'etiqueta',de:'Etikett',ru:'etiketka',zh:'biaoqian',ja:'raberu',ht:'etikèt'}},
      {n:'tampon',t:{en:'stamp',es:'sello',de:'Stempel',ru:'shtamp',zh:'yinzhang',ja:'hanko',ht:'tenm'}},
      {n:'poubelle',t:{en:'trash can',es:'basura',de:'Mülleimer',ru:'musorka',zh:'lajitong',ja:'gomibako',ht:'poubèl'}},
      {n:'crayon',t:{en:'pencil',es:'lápiz',de:'Bleistift',ru:'karandash',zh:'qianbi',ja:'enpitsu',ht:'kreyon'}},
    ]
  },
  outils_travail: {
    fr:'Outils',en:'Tools',es:'Herramientas',ht:'Zouti',de:'Werkzeuge',ru:'Instrumenty',zh:'Gongju',ja:'Dogu',
    icon:'🛠️',
    words:[
      {n:'marteau',t:{en:'hammer',es:'martillo',de:'Hammer',ru:'molotok',zh:'chuizi',ja:'hanma',ht:'mato'}},
      {n:'tournevis',t:{en:'screwdriver',es:'destornillador',de:'Schraubendreher',ru:'otvertka',zh:'luosidao',ja:'doraiba',ht:'tounvis'}},
      {n:'pince',t:{en:'pliers',es:'alicates',de:'Zange',ru:'ploskogubtsy',zh:'qianzi',ja:'penchi',ht:'pince'}},
      {n:'clou',t:{en:'nail',es:'clavo',de:'Nagel',ru:'gvozd',zh:'dingzi',ja:'kugi',ht:'klou'}},
      {n:'vis',t:{en:'screw',es:'tornillo',de:'Schraube',ru:'vint',zh:'luosi',ja:'neji',ht:'vis'}},
      {n:'scie',t:{en:'saw',es:'sierra',de:'Säge',ru:'pila',zh:'juzi',ja:'nokogiri',ht:'si'}},
      {n:'échelle',t:{en:'ladder',es:'escalera',de:'Leiter',ru:'lestnitsa',zh:'tizi',ja:'hashigo',ht:'echèl'}},
      {n:'peinture',t:{en:'paint',es:'pintura',de:'Farbe',ru:'kraska',zh:'youqi',ja:'penki',ht:'pentire'}},
      {n:'pinceau',t:{en:'brush',es:'brush',de:'Pinsel',ru:'kist',zh:'huabi',ja:'fude',ht:'penso'}},
      {n:'perceuse',t:{en:'drill',es:'taladro',de:'Bohrer',ru:'drel',zh:'zuanji',ja:'doriru',ht:'dril'}},
      {n:'mesure',t:{en:'tape measure',es:'cinta métrica',de:'Maßband',ru:'ruletka',zh:'juan-chi',ja:'meki',ht:'mizir'}},
      {n:'casque',t:{en:'helmet',es:'casco',de:'Helm',ru:'shlem',zh:'toukui',ja:'herumetto',ht:'kas'}},
      {n:'corde',t:{en:'rope',es:'cuerda',de:'Seil',ru:'verevka',zh:'shengzi',ja:'ropu',ht:'kòd'}},
      {n:'pelle',t:{en:'shovel',es:'pala',de:'Schaufel',ru:'lopata',zh:'chanzi',ja:'shaberu',ht:'pèl'}},
      {n:'hache',t:{en:'axe',es:'hacha',de:'Axt',ru:'topor',zh:'fuzi',ja:'ono',ht:'hach'}},
    ]
  },
  directions_positions: {
    fr:'Directions & Positions',en:'Directions & Positions',es:'Direcciones',ht:'Direksyon',de:'Richtungen',ru:'Napravleniya',zh:'Fangxiang',ja:'Hoko',
    icon:'🧭',
    words:[
      {n:'gauche',t:{en:'left',es:'izquierda',de:'links',ru:'levo',zh:'zuobian',ja:'hidari',ht:'gòch'}},
      {n:'droite',t:{en:'right',es:'derecha',de:'rechts',ru:'pravo',zh:'youbian',ja:'migi',ht:'dwa'}},
      {n:'haut',t:{en:'up',es:'arriba',de:'oben',ru:'vverkh',zh:'shang',ja:'ue',ht:'anlè'}},
      {n:'bas',t:{en:'down',es:'abajo',de:'unten',ru:'vniz',zh:'xia',ja:'shita',ht:'anba'}},
      {n:'devant',t:{en:'in front',es:'delante',de:'vor',ru:'speredi',zh:'qianmian',ja:'mae',ht:'devan'}},
      {n:'derrière',t:{en:'behind',es:'detrás',de:'hinten',ru:'szadi',zh:'houmian',ja:'ushiro',ht:'dèyè'}},
      {n:'nord',t:{en:'north',es:'norte',de:'Nord',ru:'sever',zh:'bei',ja:'kita',ht:'nò'}},
      {n:'sud',t:{en:'south',es:'sur',de:'Süd',ru:'yug',zh:'nan',ja:'minami',ht:'sid'}},
      {n:'est',t:{en:'east',es:'este',de:'Ost',ru:'vostok',zh:'dong',ja:'higashi',ht:'lès'}},
      {n:'ouest',t:{en:'west',es:'oeste',de:'West',ru:'zapad',zh:'xi',ja:'nishi',ht:'lwès'}},
      {n:'milieu',t:{en:'middle',es:'medio',de:'Mitte',ru:'seredina',zh:'zhongjian',ja:'mannaka',ht:'mitan'}},
      {n:'loin',t:{en:'far',es:'lejos',de:'weit',ru:'daleko',zh:'yuan',ja:'tooi',ht:'lwen'}},
      {n:'près',t:{en:'near',es:'cerca',de:'nah',ru:'ryadom',zh:'jin',ja:'chikai',ht:'toupre'}},
      {n:'dedans',t:{en:'inside',es:'dentro',de:'innen',ru:'vnutri',zh:'limian',ja:'naka',ht:'andan'}},
      {n:'dehors',t:{en:'outside',es:'fuera',de:'außen',ru:'snaruzhi',zh:'waimian',ja:'soto',ht:'deyò'}},
    ]
  },
  matieres_scolaires: {
    fr:'Matières scolaires',en:'School subjects',es:'Materias',ht:'Matiyè lekòl',de:'Schulfächer',ru:'Shkolnye predmety',zh:'Xueke',ja:'Kamoku',
    icon:'📚',
    words:[
      {n:'mathématiques',t:{en:'math',es:'matemáticas',de:'Mathe',ru:'matematika',zh:'shuxue',ja:'sugaku',ht:'matematik'}},
      {n:'histoire',t:{en:'history',es:'historia',de:'Geschichte',ru:'istoriya',zh:'lishi',ja:'rekishi',ht:'istwa'}},
      {n:'géographie',t:{en:'geography',es:'geografía',de:'Erdkunde',ru:'geografiya',zh:'dili',ja:'chiri',ht:'jewografi'}},
      {n:'sciences',t:{en:'science',es:'ciencias',de:'Wissenschaft',ru:'nauka',zh:'kexue',ja:'kagaku',ht:'syans'}},
      {n:'langues',t:{en:'languages',es:'idiomas',de:'Sprachen',ru:'yazyki',zh:'yuyan',ja:'gengo',ht:'lang'}},
      {n:'musique',t:{en:'music',es:'música',de:'Musik',ru:'muzyka',zh:'yinyue',ja:'ongaku',ht:'mizik'}},
      {n:'art',t:{en:'art',es:'arte',de:'Kunst',ru:'iskusstvo',zh:'yishu',ja:'geijutsu',ht:'la'}},
      {n:'physique',t:{en:'physics',es:'física',de:'Physik',ru:'fizika',zh:'wuli',ja:'butsuri',ht:'fizik'}},
      {n:'chimie',t:{en:'chemistry',es:'química',de:'Chemie',ru:'khimiya',zh:'huaxue',ja:'kagaku',ht:'chimis'}},
      {n:'biologie',t:{en:'biology',es:'biología',de:'Biologie',ru:'biologiya',zh:'shengwuxue',ja:'seibutsugaku',ht:'bioloji'}},
      {n:'littérature',t:{en:'literature',es:'literatura',de:'Literatur',ru:'literatura',zh:'wenxue',ja:'bungaku',ht:'literati'}},
      {n:'informatique',t:{en:'computer science',es:'informática',de:'Informatik',ru:'informatika',zh:'jisuanji',ja:'johokagaku',ht:'enfòmatik'}},
      {n:'philosophie',t:{en:'philosophy',es:'filosofía',de:'Philosophie',ru:'filosofiya',zh:'zhexue',ja:'tetsugaku',ht:'filozofi'}},
      {n:'examen',t:{en:'exam',es:'examen',de:'Prüfung',ru:'ekzamen',zh:'kaoshi',ja:'shiken',ht:'egzamen'}},
      {n:'leçon',t:{en:'lesson',es:'lección',de:'Lektion',ru:'urok',zh:'ke',ja:'jugyo',ht:'leson'}},
    ]
  },
  taille_quantite: {
    fr:'Taille & Quantité',en:'Size & Quantity',es:'Tamaño & Cantidad',ht:'Gwosè & Kantite',de:'Größe & Menge',ru:'Razmer i Kolichestvo',zh:'Daxiao yu Shuliang',ja:'Saizu to Ryō',
    icon:'⚖️',
    words:[
      {n:'beaucoup',t:{en:'a lot',es:'mucho',de:'viel',ru:'mnogo',zh:'henduo',ja:'takusan',ht:'anpil'}},
      {n:'peu',t:{en:'little',es:'poco',de:'wenig',ru:'malo',zh:'yidian',ja:'sukoshi',ht:'yon ti kras'}},
      {n:'plus',t:{en:'more',es:'más',de:'mehr',ru:'bolshe',zh:'geng duo',ja:'motto',ht:'plis'}},
      {n:'moins',t:{en:'less',es:'menos',de:'weniger',ru:'menshe',zh:'shao',ja:'sukunai',ht:'mwens'}},
      {n:'tout',t:{en:'all',es:'todo',de:'alles',ru:'vse',zh:'suoyou',ja:'zenbu',ht:'tout'}},
      {n:'rien',t:{en:'nothing',es:'nada',de:'nichts',ru:'nichego',zh:'meiyou',ja:'nanimo',ht:'anyen'}},
      {n:'moitié',t:{en:'half',es:'mitad',de:'Hälfte',ru:'polovina',zh:'yiban',ja:'hanbun',ht:'mwatye'}},
      {n:'entier',t:{en:'whole',es:'entero',de:'ganz',ru:'tselyy',zh:'wanzheng',ja:'marugoto',ht:'antye'}},
      {n:'léger',t:{en:'light',es:'light',de:'leicht',ru:'legkiy',zh:'qing',ja:'karui',ht:'lejè'}},
      {n:'lourd',t:{en:'heavy',es:'pesado',de:'schwer',ru:'tyazhelyy',zh:'zhong',ja:'omoi',ht:'lou'}},
      {n:'court',t:{en:'short',es:'corto',de:'kurz',ru:'korotkiy',zh:'duan',ja:'mijikai',ht:'kout'}},
      {n:'long',t:{en:'long',es:'largo',de:'lang',ru:'dlinnyy',zh:'chang',ja:'nagai',ht:'long'}},
      {n:'large',t:{en:'wide',es:'ancho',de:'breit',ru:'shirokiy',zh:'kuan',ja:'hiroi',ht:'laj'}},
      {n:'étroit',t:{en:'narrow',es:'estrecho',de:'eng',ru:'uzkiy',zh:'zhai',ja:'semai',ht:'etwat'}},
      {n:'vide',t:{en:'empty',es:'vacío',de:'leer',ru:'pustoy',zh:'kong',ja:'kara',ht:'vide'}},
    ]
  },
  apprentissage_autodidacte: {
    fr:'Apprentissage',en:'Learning',es:'Aprendizaje',ht:'Aprann',de:'Lernen',ru:'Obuchenie',zh:'Xuexi',ja:'Gakushu',
    icon:'🧠',
    words:[
      {n:'objectif',t:{en:'goal',es:'objetivo',de:'Ziel',ru:'tsel',zh:'mubiao',ja:'mokuhyo',ht:'objektif'}},
      {n:'pratique',t:{en:'practice',es:'práctica',de:'Praxis',ru:'praktika',zh:'shijian',ja:'renshu',ht:'pratik'}},
      {n:'mémoire',t:{en:'memory',es:'memoria',de:'Gedächtnis',ru:'pamyat',zh:'jiyi',ja:'kioku',ht:'memwa'}},
      {n:'habitude',t:{en:'habit',es:'hábito',de:'Gewohnheit',ru:'privychka',zh:'xiguan',ja:'shukan',ht:'abitid'}},
      {n:'progrès',t:{en:'progress',es:'progreso',de:'Fortschritt',ru:'progress',zh:'jinbu',ja:'shinpo',ht:'pwogrè'}},
      {n:'erreur',t:{en:'mistake',es:'error',de:'Fehler',ru:'oshibka',zh:'cuowu',ja:'machigai',ht:'erè'}},
      {n:'réussite',t:{en:'success',es:'éxito',de:'Erfolg',ru:'uspekh',zh:'chenggong',ja:'seiko',ht:'siksè'}},
      {n:'discipline',t:{en:'discipline',es:'disciplina',de:'Disziplin',ru:'distsiplina',zh:'jilv',ja:'kiritsu',ht:'disiplin'}},
      {n:'curiosité',t:{en:'curiosity',es:'curiosidad',de:'Neugier',ru:'lyubopytstvo',zh:'haoqixin',ja:'koukishin',ht:'kuryozite'}},
      {n:'source',t:{en:'source',es:'fuente',de:'Quelle',ru:'istochnik',zh:'laiyuan',ja:'shingen',ht:'sous'}},
      {n:'comprendre',t:{en:'understand',es:'comprender',de:'verstehen',ru:'ponimat',zh:'lijie',ja:'rikai suru',ht:'konprann'}},
      {n:'recherche',t:{en:'research',es:'investigación',de:'Forschung',ru:'issledovanie',zh:'yanjiu',ja:'kenkyu',ht:'rechèch'}},
      {n:'lecture',t:{en:'reading',es:'lectura',de:'Lesen',ru:'chtenie',zh:'yuedu',ja:'dokusho',ht:'lektir'}},
      {n:'écouter',t:{en:'listen',es:'escuchar',de:'hören',ru:'slushat',zh:'ting',ja:'kiku',ht:'koute'}},
      {n:'répéter',t:{en:'repeat',es:'repetir',de:'wiederholen',ru:'povtoryat',zh:'zhongfu',ja:'kurikaesu',ht:'repete'}},
    ]
  },
  ville_batiments: {
    fr:'Ville & Bâtiments',en:'City & Buildings',es:'Ciudad',ht:'Vil',de:'Stadt',ru:'Gorod',zh:'Chengshi',ja:'Toshi',
    icon:'🏙️',
    words:[
      {n:'maison',t:{en:'house',es:'casa',de:'Haus',ru:'dom',zh:'fangzi',ja:'ie',ht:'kay'}},
      {n:'école',t:{en:'school',es:'escuela',de:'Schule',ru:'shkola',zh:'xuexiao',ja:'gakko',ht:'lekòl'}},
      {n:'banque',t:{en:'bank',es:'banco',de:'Bank',ru:'bank',zh:'yinhang',ja:'ginko',ht:'bank'}},
      {n:'rue',t:{en:'street',es:'calle',de:'Straße',ru:'ulitsa',zh:'jiedao',ja:'michi',ht:'lari'}},
      {n:'pont',t:{en:'bridge',es:'puente',de:'Brücke',ru:'most',zh:'qiao',ja:'hashi',ht:'pon'}},
      {n:'magasin',t:{en:'shop',es:'tienda',de:'Laden',ru:'magazin',zh:'shangdian',ja:'mise',ht:'magazen'}},
      {n:'église',t:{en:'church',es:'iglesia',de:'Kirche',ru:'tserkov',zh:'jiaotang',ja:'kyokai',ht:'legliz'}},
      {n:'parc',t:{en:'park',es:'parque',de:'Park',ru:'park',zh:'gongyuan',ja:'koen',ht:'pak'}},
      {n:'bibliothèque',t:{en:'library',es:'biblioteca',de:'Bibliothek',ru:'biblioteka',zh:'tushuguan',ja:'toshokan',ht:'bibliyotèk'}},
      {n:'marché',t:{en:'market',es:'mercado',de:'Markt',ru:'rynok',zh:'shichang',ja:'ichiba',ht:'mache'}},
      {n:'hôtel',t:{en:'hotel',es:'hotel',de:'Hotel',ru:'otel',zh:'jiudian',ja:'hoteru',ht:'otèl'}},
      {n:'cinéma',t:{en:'cinema',es:'cine',de:'Kino',ru:'kinoteatr',zh:'dianyingyuan',ja:'eigakan',ht:'sinema'}},
      {n:'musée',t:{en:'museum',es:'museo',de:'Museum',ru:'muzey',zh:'bowuguan',ja:'hakubutsukan',ht:'mize'}},
      {n:'usine',t:{en:'factory',es:'fábrica',de:'Fabrik',ru:'zavod',zh:'gongchang',ja:'kojo',ht:'izin'}},
      {n:'bureau',t:{en:'office',es:'oficina',de:'Büro',ru:'ofis',zh:'bangongshi',ja:'jimusho',ht:'biwo'}},
    ]
  },
  meteo: {
    fr:'Météo',en:'Weather',es:'Clima',ht:'Meteo',de:'Wetter',ru:'Pogoda',zh:'Tianqi',ja:'Tenki',
    icon:'☁️',
    words:[
      {n:'nuage',t:{en:'cloud',es:'nube',de:'Wolke',ru:'oblako',zh:'yun',ja:'kumo',ht:'nyaj'}},
      {n:'neige',t:{en:'snow',es:'nieve',de:'Schnee',ru:'sneg',zh:'xue',ja:'yuki',ht:'nej'}},
      {n:'orage',t:{en:'storm',es:'tormenta',de:'Sturm',ru:'groza',zh:'baofengyu',ja:'arashi',ht:'oraj'}},
      {n:'foudre',t:{en:'lightning',es:'rayo',de:'Blitz',ru:'molniya',zh:'shandian',ja:'kaminari',ht:'kout zèklè'}},
      {n:'brouillard',t:{en:'fog',es:'niebla',de:'Nebel',ru:'tuman',zh:'wu',ja:'kiri',ht:'bwouya'}},
      {n:'chaleur',t:{en:'heat',es:'calor',de:'Hitze',ru:'zhara',zh:'renqi',ja:'atsusa',ht:'chalè'}},
      {n:'froid',t:{en:'cold',es:'frío',de:'Kälte',ru:'kholod',zh:'hanleng',ja:'samusa',ht:'frèt'}},
      {n:'humidité',t:{en:'humidity',es:'humedad',de:'Feuchtigkeit',ru:'vlazhnost',zh:'shidu',ja:'shitsu',ht:'imidite'}},
      {n:'glace',t:{en:'ice',es:'hielo',de:'Eis',ru:'led',zh:'bing',ja:'kori',ht:'glas'}},
      {n:'tempête',t:{en:'tempest',es:'tempestad',de:'Sturm',ru:'shtorm',zh:'baofeng',ja:'arashi',ht:'tanpèt'}},
      {n:'arc-en-ciel',t:{en:'rainbow',es:'arco iris',de:'Regenbogen',ru:'raduga',zh:'caihong',ja:'niji',ht:'lakansyèl'}},
      {n:'degré',t:{en:'degree',es:'grado',de:'Grad',ru:'gradus',zh:'du',ja:'do',ht:'degre'}},
      {n:'prévision',t:{en:'forecast',es:'pronóstico',de:'Vorhersage',ru:'prognoz',zh:'yubao',ja:'yoho',ht:'previzyon'}},
      {n:'vent',t:{en:'wind',es:'viento',de:'Wind',ru:'veter',zh:'feng',ja:'kaze',ht:'van'}},
      {n:'ombre',t:{en:'shadow',es:'sombra',de:'Schatten',ru:'ten',zh:'yinying',ja:'kage',ht:'lonbraj'}},
    ]
  },
  urgences_securite: {
    fr:'Urgences & Sécurité',en:'Emergency & Safety',es:'Emergencias',ht:'Ijans ak Sekirite',de:'Notfall',ru:'Chrezvychaynaya situatsiya',zh:'Jinji',ja:'Kinkyu',
    icon:'🚨',
    words:[
      {n:'aide',t:{en:'help',es:'ayuda',de:'Hilfe',ru:'pomoshch',zh:'bangzhu',ja:'tasuke',ht:'èd'}},
      {n:'danger',t:{en:'danger',es:'peligro',de:'Gefahr',ru:'opasnost',zh:'weixian',ja:'kiken',ht:'danje'}},
      {n:'police',t:{en:'police',es:'policía',de:'Polizei',ru:'politsiya',zh:'jingcha',ja:'keisatsu',ht:'polis'}},
      {n:'accident',t:{en:'accident',es:'accidente',de:'Unfall',ru:'avariya',zh:'shigu',ja:'jiko',ht:'aksidan'}},
      {n:'feu',t:{en:'fire',es:'fuego',de:'Feuer',ru:'ogon',zh:'huo',ja:'hi',ht:'dife'}},
      {n:'attention',t:{en:'warning',es:'cuidado',de:'Achtung',ru:'vnimanie',zh:'zhuyi',ja:'chui',ht:'atansyon'}},
      {n:'vol',t:{en:'theft',es:'robo',de:'Diebstahl',ru:'krazha',zh:'touqie',ja:'tonan',ht:'vòl'}},
      {n:'blessure',t:{en:'injury',es:'herida',de:'Verletzung',ru:'travma',zh:'shoushang',ja:'kega',ht:'blesi'}},
      {n:'sortie',t:{en:'exit',es:'salida',de:'Ausgang',ru:'vykhod',zh:'chukou',ja:'deguchi',ht:'soti'}},
      {n:'perdu',t:{en:'lost',es:'perdido',de:'verloren',ru:'poteryannyy',zh:'mishu',ja:'maigo',ht:'pèdi'}},
      {n:'médecin',t:{en:'doctor',es:'médico',de:'Arzt',ru:'vrach',zh:'yisheng',ja:'isha',ht:'doktè'}},
      {n:'poison',t:{en:'poison',es:'veneno',de:'Gift',ru:'yad',zh:'duwu',ja:'doku',ht:'pwazon'}},
      {n:'sang',t:{en:'blood',es:'sangre',de:'Blut',ru:'krov',zh:'xue',ja:'chi',ht:'san'}},
      {n:'appel',t:{en:'call',es:'call',de:'Anruf',ru:'zvonok',zh:'dianhua',ja:'denwa',ht:'rele'}},
      {n:'vrai',t:{en:'true',es:'verdadero',de:'wahr',ru:'pravda',zh:'zhenshi',ja:'shinjitsu',ht:'vre'}},
    ]
  },
  relations_sociales: {
    fr:'Relations sociales',en:'Social Relations',es:'Relaciones',ht:'Relasyon sosyal',de:'Beziehungen',ru:'Otnosheniya',zh:'Guanxi',ja:'Kankei',
    icon:'🤝',
    words:[
      {n:'nom',t:{en:'name',es:'nombre',de:'Name',ru:'imya',zh:'mingzi',ja:'namae',ht:'non'}},
      {n:'ami',t:{en:'friend',es:'amigo',de:'Freund',ru:'drug',zh:'pengyou',ja:'tomodachi',ht:'zanmi'}},
      {n:'voisin',t:{en:'neighbor',es:'vecino',de:'Nachbar',ru:'sosed',zh:'linju',ja:'tonari',ht:'vwazen'}},
      {n:'collègue',t:{en:'colleague',es:'colega',de:'Kollege',ru:'kollega',zh:'tongshi',ja:'doryo',ht:'koleg'}},
      {n:'rencontre',t:{en:'meeting',es:'encuentro',de:'Treffen',ru:'vstrecha',zh:'huimian',ja:'deai',ht:'rankont'}},
      {n:'cadeau',t:{en:'gift',es:'regalo',de:'Geschenk',ru:'podarok',zh:'liwu',ja:'purezento',ht:'kado'}},
      {n:'promesse',t:{en:'promise',es:'promesa',de:'Versprechen',ru:'obeshchanie',zh:'nuoyan',ja:'yakusoku',ht:'pwomès'}},
      {n:'mariage',t:{en:'marriage',es:'matrimonio',de:'Hochzeit',ru:'svadba',zh:'hunyin',ja:'kekkon',ht:'maryaj'}},
      {n:'enfant',t:{en:'child',es:'niño',de:'Kind',ru:'rebenok',zh:'haizi',ja:'kodomo',ht:'timoun'}},
      {n:'groupe',t:{en:'group',es:'grupo',de:'Gruppe',ru:'gruppa',zh:'qunti',ja:'gurupu',ht:'gwoup'}},
      {n:'invitation',t:{en:'invitation',es:'invitación',de:'Einladung',ru:'priglashenie',zh:'yaoqing',ja:'shotai',ht:'envitasyon'}},
      {n:'pardon',t:{en:'sorry',es:'perdón',de:'Entschuldigung',ru:'izvinenie',zh:'duibuqi',ja:'gomen',ht:'padon'}},
      {n:'merci',t:{en:'thanks',es:'gracias',de:'danke',ru:'spasibo',zh:'xiexie',ja:'arigato',ht:'mesi'}},
      {n:'bienvenue',t:{en:'welcome',es:'bienvenido',de:'Willkommen',ru:'dobro pozhalovat',zh:'huanying',ja:'kangei',ht:'byenvini'}},
      {n:'amour',t:{en:'love',es:'amor',de:'Liebe',ru:'lyubov',zh:'ai',ja:'ai',ht:'lanmou'}},
    ]
  },
  temps_calendrier: {
    fr:'Calendrier & Durée',en:'Calendar & Duration',es:'Calendario',ht:'Kalandriye',de:'Kalender',ru:'Kalendar',zh:'Rili',ja:'Karendaa',
    icon:'📅',
    words:[
      {n:'lundi',t:{en:'monday',es:'lunes',de:'Montag',ru:'ponedelnik',zh:'xingqiyi',ja:'getsu-yobi',ht:'lendi'}},
      {n:'mardi',t:{en:'tuesday',es:'martes',de:'Dienstag',ru:'vtornik',zh:'xingqier',ja:'ka-yobi',ht:'madi'}},
      {n:'mercredi',t:{en:'wednesday',es:'miércoles',de:'Mittwoch',ru:'sreda',zh:'xingqisan',ja:'sui-yobi',ht:'mèkredi'}},
      {n:'jeudi',t:{en:'thursday',es:'jueves',de:'Donnerstag',ru:'chetverg',zh:'xingqisi',ja:'moku-yobi',ht:'jedi'}},
      {n:'vendredi',t:{en:'friday',es:'viernes',de:'Freitag',ru:'pyatnitsa',zh:'xingqiwu',ja:'kin-yobi',ht:'vandredi'}},
      {n:'samedi',t:{en:'saturday',es:'sábado',de:'Samstag',ru:'subbota',zh:'xingqili',ja:'do-yobi',ht:'samdi'}},
      {n:'dimanche',t:{en:'sunday',es:'domingo',de:'Sonntag',ru:'voskresenye',zh:'xingqiri',ja:'nichi-yobi',ht:'dimanch'}},
      {n:'semaine',t:{en:'week',es:'semana',de:'Woche',ru:'nedelya',zh:'xingqi',ja:'shu',ht:'semèn'}},
      {n:'mois',t:{en:'month',es:'mes',de:'Monat',ru:'mesyats',zh:'yue',ja:'tsuki',ht:'mwa'}},
      {n:'année',t:{en:'year',es:'año',de:'Jahr',ru:'god',zh:'nian',ja:'toshi',ht:'ane'}},
      {n:'saison',t:{en:'season',es:'estación',de:'Jahreszeit',ru:'sezon',zh:'jijie',ja:'kiseitsu',ht:'sezon'}},
      {n:'printemps',t:{en:'spring',es:'primavera',de:'Frühling',ru:'vesna',zh:'chuntian',ja:'haru',ht:'prentan'}},
      {n:'été',t:{en:'summer',es:'verano',de:'Sommer',ru:'leto',zh:'xiatian',ja:'natsu',ht:'ete'}},
      {n:'automne',t:{en:'autumn',es:'otoño',de:'Herbst',ru:'osen',zh:'qiutian',ja:'aki',ht:'otòn'}},
      {n:'hiver',t:{en:'winter',es:'invierno',de:'Winter',ru:'zima',zh:'dongtian',ja:'fuyu',ht:'ivè'}},
    ]
  },
  actions_quotidiennes: {
    fr:'Vie Quotidienne',en:'Daily Life',es:'Vida cotidiana',ht:'Lavi chak jou',de:'Alltag',ru:'Povsednevnaya zhizn',zh:'Meiri shenghuo',ja:'Nichijo seikatsu',
    icon:'🌅',
    words:[
      {n:'petit-déjeuner',t:{en:'breakfast',es:'desayuno',de:'Frühstück',ru:'zavtrak',zh:'zaocan',ja:'choshoku',ht:'dejene'}},
      {n:'déjeuner',t:{en:'lunch',es:'almuerzo',de:'Mittagessen',ru:'obed',zh:'wucan',ja:'chushoku',ht:'dine'}},
      {n:'dîner',t:{en:'dinner',es:'cena',de:'Abendessen',ru:'uzhin',zh:'wancan',ja:'yushoku',ht:'soupe'}},
      {n:'douche',t:{en:'shower',es:'ducha',de:'Dusche',ru:'dush',zh:'linyu',ja:'shawa',ht:'douch'}},
      {n:'sieste',t:{en:'nap',es:'siesta',de:'Nickerchen',ru:'son',zh:'wushui',ja:'hirune',ht:'syès'}},
      {n:'repos',t:{en:'rest',es:'descanso',de:'Ruhe',ru:'otdykh',zh:'xiuxi',ja:'kyusei',ht:'repo'}},
      {n:'travail',t:{en:'work',es:'trabajo',de:'Arbeit',ru:'rabota',zh:'gongzuo',ja:'shigoto',ht:'travay'}},
      {n:'ménage',t:{en:'housework',es:'limpieza',de:'Haushalt',ru:'uborka',zh:'jiwu',ja:'kaji',ht:'menaj'}},
      {n:'courses',t:{en:'shopping',es:'compras',de:'Einkaufen',ru:'pokupki',zh:'gouwu',ja:'kaimono',ht:'makèt'}},
      {n:'rendez-vous',t:{en:'appointment',es:'cita',de:'Termin',ru:'vstrecha',zh:'yuehui',ja:'yoyaku',ht:'randevou'}},
      {n:'sport',t:{en:'exercise',es:'ejercicio',de:'Sport',ru:'uprazhnenie',zh:'yundong',ja:'undo',ht:'espò'}},
      {n:'lecture',t:{en:'reading',es:'lectura',de:'Lesen',ru:'chtenie',zh:'yuedu',ja:'dokusho',ht:'lektir'}},
      {n:'cuisine',t:{en:'cooking',es:'cocina',de:'Kochen',ru:'gotovka',zh:'pengren',ja:'ryori',ht:'kizin'}},
      {n:'promenade',t:{en:'walk',es:'paseo',de:'Spaziergang',ru:'progulka',zh:'sanbu',ja:'sanpo',ht:'pwonmennen'}},
      {n:'sommeil',t:{en:'sleep',es:'sueño',de:'Schlaf',ru:'son',zh:'shuimian',ja:'suimin',ht:'dòmi'}},
    ]
  },
  salle_de_bain: {
    fr:'Salle de bain',en:'Bathroom',es:'Baño',ht:'Saly de ben',de:'Badezimmer',ru:'Vannaya',zh:'Yu shi',ja:'Basurumu',
    icon:'🧼',
    words:[
      {n:'savon',t:{en:'soap',es:'jabón',de:'Seife',ru:'mylo',zh:'xiangzao',ja:'sekken',ht:'savon'}},
      {n:'serviette',t:{en:'towel',es:'toalla',de:'Handtuch',ru:'polotentse',zh:'maojin',ja:'taoru',ht:'sèvyèt'}},
      {n:'brosse à dents',t:{en:'toothbrush',es:'cepillo de dientes',de:'Zahnbürste',ru:'zubnaya shchetka',zh:'yashua',ja:'haburashi',ht:'bwòs dan'}},
      {n:'dentifrice',t:{en:'toothpaste',es:'pasta de dientes',de:'Zahnpasta',ru:'zubnaya pasta',zh:'yagao',ja:'nerihamigaki',ht:'patdan'}},
      {n:'peigne',t:{en:'comb',es:'peine',de:'Kamm',ru:'rascheska',zh:'shuzi',ja:'kushi',ht:'pent'}},
      {n:'miroir',t:{en:'mirror',es:'espejo',de:'Spiegel',ru:'zerkalo',zh:'jingzi',ja:'kagami',ht:'miwa'}},
      {n:'shampoing',t:{en:'shampoo',es:'champú',de:'Shampoo',ru:'shampun',zh:'xifalu',ja:'shanpu',ht:'chanpou'}},
      {n:'rasoir',t:{en:'razor',es:'maquinilla',de:'Rasierer',ru:'britva',zh:'tizhidao',ja:'kamisori',ht:'razywa'}},
      {n:'parfum',t:{en:'perfume',es:'perfume',de:'Parfüm',ru:'duki',zh:'xiangshui',ja:'kosui',ht:'pafen'}},
      {n:'papier toilette',t:{en:'toilet paper',es:'papel higiénico',de:'Toilettenpapier',ru:'tualetnaya bumaga',zh:'weishengzhi',ja:'toirettopepa',ht:'papye ijenik'}},
      {n:'baignoire',t:{en:'bathtub',es:'bañera',de:'Badewanne',ru:'vanna',zh:'yugang',ja:'yubune',ht:'benwa'}},
      {n:'robinet',t:{en:'tap',es:'grifo',de:'Wasserhahn',ru:'kran',zh:'shuilongtou',ja:'jaguchi',ht:'robinè'}},
      {n:'maquillage',t:{en:'makeup',es:'maquillaje',de:'Make-up',ru:'makiyazh',zh:'huazhuang',ja:'kesho',ht:'makiyaj'}},
      {n:'crème',t:{en:'cream',es:'crema',de:'Creme',ru:'krem',zh:'mianshuang',ja:'kurimu',ht:'krèm'}},
      {n:'douche',t:{en:'shower',es:'ducha',de:'Dusche',ru:'dush',zh:'linyu',ja:'shawa',ht:'douch'}},
    ]
  },
  communication: {
    fr:'Communication',en:'Communication',es:'Comunicación',ht:'Kominikasyon',de:'Kommunikation',ru:'Svyaz',zh:'Goutong',ja:'Komyunikeshon',
    icon:'📱',
    words:[
      {n:'téléphone',t:{en:'phone',es:'teléfono',de:'Telefon',ru:'telefon',zh:'dianhua',ja:'denwa',ht:'telefòn'}},
      {n:'lettre',t:{en:'letter',es:'carta',de:'Brief',ru:'pismo',zh:'xin',ja:'tegami',ht:'lèt'}},
      {n:'email',t:{en:'email',es:'correo',de:'E-Mail',ru:'elektronnaya pochta',zh:'youjian',ja:'meru',ht:'imèl'}},
      {n:'réseau',t:{en:'network',es:'red',de:'Netzwerk',ru:'set',zh:'wangluo',ja:'nettowaku',ht:'rezo'}},
      {n:'nouvelles',t:{en:'news',es:'noticias',de:'Nachrichten',ru:'novosti',zh:'xinwen',ja:'nyusu',ht:'nouvèl'}},
      {n:'langue',t:{en:'language',es:'idioma',de:'Sprache',ru:'yazyk',zh:'yuyan',ja:'gengo',ht:'lang'}},
      {n:'voix',t:{en:'voice',es:'voz',de:'Stimme',ru:'golos',zh:'shengyin',ja:'koē',ht:'vwa'}},
      {n:'mot',t:{en:'word',es:'palabra',de:'Wort',ru:'slovo',zh:'zi',ja:'kotoba',ht:'mo'}},
      {n:'phrase',t:{en:'sentence',es:'frase',de:'Satz',ru:'predlozhenie',zh:'juzi',ja:'bun',ht:'fraz'}},
      {n:'radio',t:{en:'radio',es:'radio',de:'Radio',ru:'radio',zh:'shouyinji',ja:'rajio',ht:'radyo'}},
      {n:'télévision',t:{en:'television',es:'televisión',de:'Fernsehen',ru:'televidenie',zh:'dianshi',ja:'terebi',ht:'televizyon'}},
      {n:'journal',t:{en:'newspaper',es:'periódico',de:'Zeitung',ru:'gazeta',zh:'baozhi',ja:'shinbun',ht:'jounal'}},
      {n:'internet',t:{en:'internet',es:'internet',de:'Internet',ru:'internet',zh:'hulianwang',ja:'intanetto',ht:'entènèt'}},
      {n:'opinion',t:{en:'opinion',es:'opinión',de:'Meinung',ru:'mnenie',zh:'yijian',ja:'iken',ht:'opinyon'}},
      {n:'vérité',t:{en:'truth',es:'verdad',de:'Wahrheit',ru:'pravda',zh:'zhenxiang',ja:'shinjitsu',ht:'verite'}},
    ]
  },
  outils_mesure: {
    fr:'Mesures',en:'Measurements',es:'Medidas',ht:'Mezi',de:'Maße',ru:'Izmereniya',zh:'Ce lian',ja:'Sokutei',
    icon:'📏',
    words:[
      {n:'poids',t:{en:'weight',es:'peso',de:'Gewicht',ru:'ves',zh:'zhongliang',ja:'jūmyō',ht:'pwa'}},
      {n:'taille',t:{en:'size',es:'tamaño',de:'Größe',ru:'razmer',zh:'chicun',ja:'saizu',ht:'gwosè'}},
      {n:'distance',t:{en:'distance',es:'distancia',de:'Entfernung',ru:'rasstoyanie',zh:'juli',ja:'kyori',ht:'distans'}},
      {n:'hauteur',t:{en:'height',es:'altura',de:'Höhe',ru:'vysota',zh:'gaodu',ja:'takasa',ht:'wotè'}},
      {n:'vitesse',t:{en:'speed',es:'velocidad',de:'Geschwindigkeit',ru:'skorost',zh:'sudu',ja:'sokudo',ht:'vitès'}},
      {n:'température',t:{en:'temperature',es:'temperatura',de:'Temperatur',ru:'temperatura',zh:'wendu',ja:'on-do',ht:'tanperati'}},
      {n:'profondeur',t:{en:'depth',es:'profundidad',de:'Tiefe',ru:'glubina',zh:'shendu',ja:'fukasa',ht:'pwofondè'}},
      {n:'largeur',t:{en:'width',es:'ancho',de:'Breite',ru:'shirina',zh:'kuandu',ja:'haba',ht:'lajè'}},
      {n:'volume',t:{en:'volume',es:'volumen',de:'Volumen',ru:'obyom',zh:'tiji',ja:'yoseki',ht:'volim'}},
      {n:'temps',t:{en:'time',es:'tiempo',de:'Zeit',ru:'vremya',zh:'shijian',ja:'jikan',ht:'tan'}},
      {n:'angle',t:{en:'angle',es:'ángulo',de:'Winkel',ru:'ugol',zh:'jiaodu',ja:'kaku',ht:'ang'}},
      {n:'surface',t:{en:'area',es:'superficie',de:'Fläche',ru:'ploshchad',zh:'mianji',ja:'menseki',ht:'sirfas'}},
      {n:'balance',t:{en:'scale',es:'balanza',de:'Waage',ru:'vesy',zh:'cheng',ja:'hakari',ht:'balans'}},
      {n:'règle',t:{en:'ruler',es:'regla',de:'Lineal',ru:'lineyka',zh:'chi',ja:'jōgi',ht:'règ'}},
      {n:'thermomètre',t:{en:'thermometer',es:'termómetro',de:'Thermometer',ru:'termometr',zh:'wenduji',ja:'ongokey',ht:'tèmomèt'}},
    ]
  },
  besoins_sensations: {
    fr:'Besoins & Sensations',en:'Needs & Feelings',es:'Necesidades',ht:'Bezwen',de:'Bedürfnisse',ru:'Potrebnosti',zh:'Xu yao',ja:'Nizu',
    icon:'🧘',
    words:[
      {n:'faim',t:{en:'hunger',es:'hambre',de:'Hunger',ru:'golod',zh:'jie',ja:'kufuku',ht:'grangou'}},
      {n:'soif',t:{en:'thirst',es:'sed',de:'Durst',ru:'zhazhda',zh:'kouke',ja:'nodo no kawaki',ht:'swaf'}},
      {n:'fatigue',t:{en:'fatigue',es:'fatiga',de:'Müdigkeit',ru:'ustalost',zh:'pilao',ja:'tsukare',ht:'fatig'}},
      {n:'énergie',t:{en:'energy',es:'energía',de:'Energie',ru:'energiya',zh:'nengyuan',ja:'enerugi',ht:'enèji'}},
      {n:'santé',t:{en:'health',es:'salud',de:'Gesundheit',ru:'zdorovye',zh:'jiankang',ja:'kenko',ht:'sante'}},
      {n:'sécurité',t:{en:'safety',es:'seguridad',de:'Sicherheit',ru:'bezopasnost',zh:'anquan',ja:'anzen',ht:'sekirite'}},
      {n:'confort',t:{en:'comfort',es:'comodidad',de:'Komfort',ru:'komfort',zh:'shushi',ja:'kaiteki',ht:'konfò'}},
      {n:'liberté',t:{en:'freedom',es:'libertad',de:'Freiheit',ru:'svoboda',zh:'ziyou',ja:'jiyu',ht:'libète'}},
      {n:'paix',t:{en:'peace',es:'paz',de:'Frieden',ru:'mir',zh:'heping',ja:'heiwa',ht:'lapè'}},
      {n:'force',t:{en:'strength',es:'fuerza',de:'Kraft',ru:'sila',zh:'liliang',ja:'chikara',ht:'fòs'}},
      {n:'faiblesse',t:{en:'weakness',es:'debilidad',de:'Schwäche',ru:'slabost',zh:'ruodian',ja:'yowami',ht:'feblès'}},
      {n:'plaisir',t:{en:'pleasure',es:'placer',de:'Vergnügen',ru:'udovolstvie',zh:'kuaile',ja:'yorokobi',ht:'plezi'}},
      {n:'patience',t:{en:'patience',es:'paciencia',de:'Geduld',ru:'terpenie',zh:'naixin',ja:'ninkai',ht:'pasyans'}},
      {n:'sommeil',t:{en:'sleep',es:'sueño',de:'Schlaf',ru:'son',zh:'shuimian',ja:'suimin',ht:'dòmi'}},
      {n:'air',t:{en:'air',es:'aire',de:'Luft',ru:'vozdukh',zh:'kongqi',ja:'kuki',ht:'lè'}},
    ]
  },
  electronique_tech: {
    fr:'Électronique',en:'Electronics',es:'Electrónica',ht:'Elektwonik',de:'Elektronik',ru:'Elektronika',zh:'Dianzi',ja:'Denshi',
    icon:'🔌',
    words:[
      {n:'courant',t:{en:'current',es:'corriente',de:'Strom',ru:'tok',zh:'dianliu',ja:'denryu',ht:'kouran'}},
      {n:'fil',t:{en:'wire',es:'cable',de:'Draht',ru:'provod',zh:'dianxian',ja:'densen',ht:'fil'}},
      {n:'puce',t:{en:'chip',es:'chip',de:'Chip',ru:'chip',zh:'xinpian',ja:'chippu',ht:'chip'}},
      {n:'capteur',t:{en:'sensor',es:'sensor',de:'Sensor',ru:'datchik',zh:'chuanganqi',ja:'sensa',ht:'kaptè'}},
      {n:'écran',t:{en:'screen',es:'screen',de:'Bildschirm',ru:'ekran',zh:'pingmu',ja:'gamen',ht:'ekran'}},
      {n:'bouton',t:{en:'button',es:'botón',de:'Knopf',ru:'knopka',zh:'anniu',ja:'botan',ht:'bouton'}},
      {n:'lampe',t:{en:'lamp',es:'lámpara',de:'Lampe',ru:'lampa',zh:'deng',ja:'ranpu',ht:'lanp'}},
      {n:'chargeur',t:{en:'charger',es:'cargador',de:'Ladegerät',ru:'zaryadka',zh:'chongdianqi',ja:'jūdenki',ht:'chajè'}},
      {n:'données',t:{en:'data',es:'datos',de:'Daten',ru:'dannye',zh:'shuju',ja:'dēta',ht:'done'}},
      {n:'mémoire',t:{en:'memory',es:'memoria',de:'Speicher',ru:'pamyat',zh:'neicun',ja:'memori',ht:'memwa'}},
      {n:'signal',t:{en:'signal',es:'señal',de:'Signal',ru:'signal',zh:'xinhao',ja:'shingo',ht:'sinyal'}},
      {n:'pile',t:{en:'battery',es:'pila',de:'Batterie',ru:'batareyka',zh:'dianchi',ja:'denchi',ht:'pil'}},
      {n:'prise',t:{en:'socket',es:'enchufe',de:'Steckdose',ru:'rozetka',zh:'chazuo',ja:'konseto',ht:'priz'}},
      {n:'onde',t:{en:'wave',es:'onda',de:'Welle',ru:'volna',zh:'bo',ja:'nami',ht:'onn'}},
      {n:'code',t:{en:'code',es:'código',de:'Code',ru:'kod',zh:'daima',ja:'kodo',ht:'kòd'}},
    ]
  },
  concepts_abstraits: {
    fr:'Concepts Abstraits',en:'Abstract Concepts',es:'Conceptos abstr.',ht:'Konsèp abstrè',de:'Abstrakte Konzepte',ru:'Ponyatiya',zh:'Gainian',ja:'Gainen',
    icon:'🧩',
    words:[
      {n:'idée',t:{en:'idea',es:'idea',de:'Idee',ru:'ideya',zh:'yidie',ja:'aidea',ht:'ide'}},
      {n:'temps',t:{en:'time',es:'tiempo',de:'Zeit',ru:'vremya',zh:'shijian',ja:'jikan',ht:'tan'}},
      {n:'raison',t:{en:'reason',es:'razón',de:'Grund',ru:'prichina',zh:'yuanyin',ja:'riyu',ht:'rezon'}},
      {n:'liberté',t:{en:'freedom',es:'libertad',de:'Freiheit',ru:'svoboda',zh:'ziyou',ja:'jiyu',ht:'libète'}},
      {n:'justice',t:{en:'justice',es:'justicia',de:'Gerechtigkeit',ru:'spravedlivost',zh:'zhengyi',ja:'seigi',ht:'jistis'}},
      {n:'vérité',t:{en:'truth',es:'verdad',de:'Wahrheit',ru:'pravda',zh:'zhenxiang',ja:'shinjitsu',ht:'verite'}},
      {n:'paix',t:{en:'peace',es:'paz',de:'Frieden',ru:'mir',zh:'heping',ja:'heiwa',ht:'lapè'}},
      {n:'destin',t:{en:'fate',es:'destino',de:'Schicksal',ru:'sudba',zh:'mingyun',ja:'unmei',ht:'desten'}},
      {n:'âme',t:{en:'soul',es:'alma',de:'Seele',ru:'dusha',zh:'linghun',ja:'tamashii',ht:'nanm'}},
      {n:'esprit',t:{en:'mind',es:'mente',de:'Geist',ru:'razum',zh:'jingshen',ja:'seishin',ht:'lespri'}},
      {n:'force',t:{en:'force',es:'fuerza',de:'Kraft',ru:'sila',zh:'liliang',ja:'chikara',ht:'fòs'}},
      {n:'beauté',t:{en:'beauty',es:'belleza',de:'Schönheit',ru:'krasota',zh:'meili',ja:'utsukushisa',ht:'bote'}},
      {n:'mort',t:{en:'death',es:'muerte',de:'Tod',ru:'smert',zh:'siwang',ja:'shi',ht:'lanmò'}},
      {n:'vie',t:{en:'life',es:'vida',de:'Leben',ru:'zhizn',zh:'shenghuo',ja:'seimei',ht:'lavi'}},
      {n:'choix',t:{en:'choice',es:'opción',de:'Wahl',ru:'vybor',zh:'xuanze',ja:'sentaku',ht:'chwa'}},
    ]
  },
  justice_droit: {
    fr:'Justice & Droit',en:'Law & Justice',es:'Derecho',ht:'Lwa ak Jistis',de:'Recht',ru:'Pravo',zh:'Falv',ja:'Horitsu',
    icon:'⚖️',
    words:[
      {n:'loi',t:{en:'law',es:'ley',de:'Gesetz',ru:'zakon',zh:'falv',ja:'horitsu',ht:'lwa'}},
      {n:'juge',t:{en:'judge',es:'juez',de:'Richter',ru:'sudya',zh:'faguan',ja:'saibankan',ht:'jij'}},
      {n:'prison',t:{en:'prison',es:'prisión',de:'Gefängnis',ru:'tyurma',zh:'jianyuan',ja:'keimusho',ht:'prizon'}},
      {n:'crime',t:{en:'crime',es:'crimen',de:'Verbrechen',ru:'prestuplenie',zh:'zuixing',ja:'hanzai',ht:'krim'}},
      {n:'droit',t:{en:'right',es:'derecho',de:'Recht',ru:'pravo',zh:'quanli',ja:'kenri',ht:'dwa'}},
      {n:'preuve',t:{en:'proof',es:'prueba',de:'Beweis',ru:'dokazatelstvo',zh:'zhengju',ja:'shoko',ht:'prèv'}},
      {n:'contrat',t:{en:'contract',es:'contrato',de:'Vertrag',ru:'kontrakt',zh:'hetong',ja:'keiyaku',ht:'kontra'}},
      {n:'témoin',t:{en:'witness',es:'testigo',de:'Zeuge',ru:'svidetel',zh:'zhengren',ja:'shōnin',ht:'temwen'}},
      {n:'amende',t:{en:'fine',es:'multa',de:'Bußgeld',ru:'shtraf',zh:'fakuan',ja:'bakkin',ht:'amann'}},
      {n:'règle',t:{en:'rule',es:'regla',de:'Regel',ru:'pravilo',zh:'guize',ja:'kisoku',ht:'règ'}},
      {n:'ordre',t:{en:'order',es:'orden',de:'Ordnung',ru:'poryadok',zh:'zhixu',ja:'chitsujo',ht:'lòd'}},
      {n:'coupable',t:{en:'guilty',es:'culpable',de:'schuldig',ru:'vinovnyy',zh:'youzui',ja:'yuzai',ht:'moun ki koupab'}},
      {n:'innocent',t:{en:'innocent',es:'inocente',de:'unschuldig',ru:'nevinovnyy',zh:'wuzui',ja:'muzai',ht:'inosan'}},
      {n:'police',t:{en:'police',es:'policía',de:'Polizei',ru:'politsiya',zh:'jingcha',ja:'keisatsu',ht:'polis'}},
      {n:'avocat',t:{en:'lawyer',es:'abogado',de:'Anwalt',ru:'advokat',zh:'lvshi',ja:'bengoshi',ht:'avoka'}},
    ]
  },
  matieres_textures: {
    fr:'Matières & Textures',en:'Materials',es:'Materiales',ht:'Matyè',de:'Materialien',ru:'Materialy',zh:'Cailiao',ja:'Zairyo',
    icon:'🧱',
    words:[
      {n:'pierre',t:{en:'stone',es:'piedra',de:'Stein',ru:'kamen',zh:'shitou',ja:'ishi',ht:'wòch'}},
      {n:'bois',t:{en:'wood',es:'madera',de:'Holz',ru:'derevo',zh:'mu tou',ja:'ki',ht:'bwa'}},
      {n:'métal',t:{en:'metal',es:'metal',de:'Metall',ru:'metall',zh:'jinshu',ja:'kinzoku',ht:'metal'}},
      {n:'plastique',t:{en:'plastic',es:'plástico',de:'Plastik',ru:'plastik',zh:'suliao',ja:'purasuchikku',ht:'plastik'}},
      {n:'verre',t:{en:'glass',es:'vidrio',de:'Glas',ru:'steklo',zh:'boli',ja:'garasu',ht:'vè'}},
      {n:'tissu',t:{en:'fabric',es:'tela',de:'Stoff',ru:'tkan',zh:'bu',ja:'nuno',ht:'tisi'}},
      {n:'cuir',t:{en:'leather',es:'cuero',de:'Leder',ru:'kozha',zh:'pige',ja:'kawa',ht:'kwi'}},
      {n:'papier',t:{en:'paper',es:'papel',de:'Papier',ru:'bumaga',zh:'zhi',ja:'kami',ht:'papye'}},
      {n:'souple',t:{en:'flexible',es:'flexible',de:'flexibel',ru:'gibkiy',zh:'rouruan',ja:'yuunantsu',ht:'mou'}},
      {n:'dur',t:{en:'hard',es:'duro',de:'hart',ru:'tverdyy',zh:'ying',ja:'katai',ht:'di'}},
      {n:'lisse',t:{en:'smooth',es:'liso',de:'glatt',ru:'gladkiy',zh:'guanghua',ja:'nameraka',ht:'lis'}},
      {n:'rugueux',t:{en:'rough',es:'rugoso',de:'rau',ru:'sherokhovatyy',zh:'caocao',ja:'zara-zara',ht:'rèch'}},
      {n:'mouillé',t:{en:'wet',es:'mojado',de:'nass',ru:'mokryy',zh:'shi',ja:'nureta',ht:'mouye'}},
      {n:'sec',t:{en:'dry',es:'seco',de:'trocken',ru:'sukhoy',zh:'gan',ja:'kawaita',ht:'sèk'}},
      {n:'poussière',t:{en:'dust',es:'polvo',de:'Staub',ru:'pyl',zh:'huichen',ja:'hokori',ht:'pousyè'}},
    ]
  },
  geographie_monde: {
    fr:'Monde et Espace',en:'World & Space',es:'Mundo y Espacio',ht:'Mond ak Espas',de:'Welt und Weltraum',ru:'Mir i Kosmos',zh:'Shijie yu Yuzhou',ja:'Sekai to Uchu',
    icon:'🌍',
    words:[
      {n:'pays',t:{en:'country',es:'país',de:'Land',ru:'strana',zh:'guojia',ja:'kuni',ht:'peyi'}},
      {n:'continent',t:{en:'continent',es:'continente',de:'Kontinent',ru:'kontinent',zh:'dalu',ja:'tairiku',ht:'kontinan'}},
      {n:'île',t:{en:'island',es:'isla',de:'Insel',ru:'ostrov',zh:'dao',ja:'shima',ht:'ile'}},
      {n:'océan',t:{en:'ocean',es:'océano',de:'Ozean',ru:'okean',zh:'haiyang',ja:'yo',ht:'oseyan'}},
      {n:'désert',t:{en:'desert',es:'desierto',de:'Wüste',ru:'pustynya',zh:'shamo',ja:'sabaku',ht:'dezè'}},
      {n:'planète',t:{en:'planet',es:'planeta',de:'Planet',ru:'planeta',zh:'xingxing',ja:'wakusei',ht:'planèt'}},
      {n:'univers',t:{en:'universe',es:'universo',de:'Universum',ru:'vselennaya',zh:'yuzhou',ja:'uchu',ht:'univè'}},
      {n:'frontière',t:{en:'border',es:'frontera',de:'Grenze',ru:'granitsa',zh:'bianjie',ja:'kokkyo',ht:'fontyè'}},
      {n:'capitale',t:{en:'capital',es:'capital',de:'Hauptstadt',ru:'stolitsa',zh:'shoudu',ja:'shuto',ht:'kapital'}},
      {n:'volcan',t:{en:'volcano',es:'volcán',de:'Vulkan',ru:'vulkan',zh:'huoshan',ja:'kazan',ht:'vòlkan'}},
      {n:'glacier',t:{en:'glacier',es:'glaciar',de:'Gletscher',ru:'lednik',zh:'bingchuan',ja:'hyoga',ht:'glasye'}},
      {n:'forêt',t:{en:'jungle',es:'selva',de:'Dschungel',ru:'dzhungli',zh:'conglin',ja:'janguru',ht:'jonp'}},
      {n:'vallée',t:{en:'valley',es:'valle',de:'Tal',ru:'dolina',zh:'shangu',ja:'tani',ht:'valè'}},
      {n:'espace',t:{en:'space',es:'espacio',de:'Weltraum',ru:'kosmos',zh:'taikong',ja:'uchu',ht:'espas'}},
      {n:'atmosphère',t:{en:'atmosphere',es:'atmósfera',de:'Atmosphäre',ru:'atmosfera',zh:'daqiceng',ja:'taiki',ht:'atmosfè'}},
    ]
  },
  pensee_analyse: {
    fr:'Pensée et Analyse',en:'Thought & Analysis',es:'Pensamiento',ht:'Panse ak Analiz',de:'Denken',ru:'Myshlenie',zh:'Siwei',ja:'Shiko',
    icon:'🧐',
    words:[
      {n:'logique',t:{en:'logic',es:'lógica',de:'Logik',ru:'logika',zh:'luoji',ja:'ronri',ht:'lojik'}},
      {n:'méthode',t:{en:'method',es:'método',de:'Methode',ru:'metod',zh:'fangfa',ja:'hoho',ht:'metòd'}},
      {n:'preuve',t:{en:'evidence',es:'evidencia',de:'Beweis',ru:'dokazatelstvo',zh:'zhengju',ja:'shoko',ht:'prèv'}},
      {n:'doute',t:{en:'doubt',es:'duda',de:'Zweifel',ru:'somnenie',zh:'huaiyi',ja:'gimen',ht:'dout'}},
      {n:'opinion',t:{en:'opinion',es:'opinión',de:'Meinung',ru:'mnenie',zh:'yijian',ja:'iken',ht:'opinyon'}},
      {n:'système',t:{en:'system',es:'sistema',de:'System',ru:'sistema',zh:'xitong',ja:'shisutemu',ht:'sistèm'}},
      {n:'structure',t:{en:'structure',es:'estructura',de:'Struktur',ru:'struktura',zh:'jiegou',ja:'kozo',ht:'strikti'}},
      {n:'théorie',t:{en:'theory',es:'teoría',de:'Theorie',ru:'teoriya',zh:'lilun',ja:'riron',ht:'teori'}},
      {n:'réalité',t:{en:'reality',es:'reality',de:'Realität',ru:'realnost',zh:'xianshi',ja:'genjitsu',ht:'reyalite'}},
      {n:'problème',t:{en:'problem',es:'problema',de:'Problem',ru:'problema',zh:'wenti',ja:'mondai',ht:'pwoblèm'}},
      {n:'solution',t:{en:'solution',es:'solución',de:'Lösung',ru:'reshenie',zh:'juefang',ja:'kaiketsu',ht:'solisyon'}},
      {n:'contexte',t:{en:'context',es:'contexto',de:'Kontext',ru:'kontekst',zh:'yu-jing',ja:'bunryaku',ht:'konteks'}},
      {n:'détail',t:{en:'detail',es:'detalle',de:'Detail',ru:'detal',zh:'xijie',ja:'shosai',ht:'detay'}},
      {n:'exemple',t:{en:'example',es:'ejemplo',de:'Beispiel',ru:'primer',zh:'lizi',ja:'rei',ht:'egzanp'}},
      {n:'idée',t:{en:'idea',es:'idea',de:'Idee',ru:'ideya',zh:'zhuyi',ja:'aidea',ht:'ide'}},
    ]
  },
  commerce_finance: {
    fr:'Commerce et Finance',en:'Trade & Finance',es:'Finanzas',ht:'Komès ak Finans',de:'Finanzen',ru:'Finansy',zh:'Jinrong',ja:'Kinyu',
    icon:'💰',
    words:[
      {n:'argent',t:{en:'money',es:'dinero',de:'Geld',ru:'dengi',zh:'qian',ja:'okane',ht:'lajan'}},
      {n:'prix',t:{en:'price',es:'precio',de:'Preis',ru:'tsena',zh:'jiage',ja:'kakaku',ht:'pri'}},
      {n:'achat',t:{en:'purchase',es:'compra',de:'Kauf',ru:'pokupka',zh:'goumai',ja:'konyu',ht:'acha'}},
      {n:'vente',t:{en:'sale',es:'venta',de:'Verkauf',ru:'prodazha',zh:'xiaoshou',ja:'hanbai',ht:'lavant'}},
      {n:'marché',t:{en:'market',es:'mercado',de:'Markt',ru:'rynok',zh:'shichang',ja:'ichiba',ht:'mache'}},
      {n:'banque',t:{en:'bank',es:'banco',de:'Bank',ru:'bank',zh:'yinhang',ja:'ginko',ht:'bank'}},
      {n:'carte',t:{en:'card',es:'tarjeta',de:'Karte',ru:'karta',zh:'ka',ja:'kado',ht:'kat'}},
      {n:'dette',t:{en:'debt',es:'deuda',de:'Schulden',ru:'dolg',zh:'zhaiwu',ja:'shakkin',ht:'dèt'}},
      {n:'investissement',t:{en:'investment',es:'inversión',de:'Investition',ru:'investitsiya',zh:'touzi',ja:'toshi',ht:'envestisman'}},
      {n:'profit',t:{en:'profit',es:'ganancia',de:'Gewinn',ru:'pribyl',zh:'lirun',ja:'rieku',ht:'pwofi'}},
      {n:'économie',t:{en:'economy',es:'economía',de:'Wirtschaft',ru:'ekonomika',zh:'jingji',ja:'keizai',ht:'ekonomi'}},
      {n:'impôt',t:{en:'tax',es:'impuesto',de:'Steuer',ru:'nalog',zh:'shui',ja:'zei',ht:'tak'}},
      {n:'salaire',t:{en:'salary',es:'salario',de:'Gehalt',ru:'zarplata',zh:'xinshui',ja:'kyuryo',ht:'salè'}},
      {n:'client',t:{en:'customer',es:'cliente',de:'Kunde',ru:'klient',zh:'kehu',ja:'kyaku',ht:'kliyan'}},
      {n:'contrat',t:{en:'contract',es:'contrato',de:'Vertrag',ru:'kontrakt',zh:'hetong',ja:'keiyaku',ht:'kontra'}},
    ]
  },
  corps_humain_interne: {
    fr:'Corps (Interne)',en:'Body (Internal)',es:'Cuerpo interno',ht:'Kò (Andan)',de:'Körper (Intern)',ru:'Vnutrennie organy',zh:'Shenti neibu',ja:'Karada no naibu',
    icon:'🫀',
    words:[
      {n:'cœur',t:{en:'heart',es:'corazón',de:'Herz',ru:'serdtse',zh:'xinzang',ja:'shinzo',ht:'kè'}},
      {n:'cerveau',t:{en:'brain',es:'cerebro',de:'Gehirn',ru:'mozg',zh:'danǎo',ja:'no',ht:'sèvo'}},
      {n:'poumon',t:{en:'lung',es:'pulmón',de:'Lunge',ru:'legkoe',zh:'fei',ja:'hai',ht:'poumon'}},
      {n:'estomac',t:{en:'stomach',es:'estómago',de:'Magen',ru:'zheludok',zh:'wei',ja:'i',ht:'lestomak'}},
      {n:'os',t:{en:'bone',es:'hueso',de:'Knochen',ru:'kost',zh:'gu tou',ja:'hone',ht:'zo'}},
      {n:'muscle',t:{en:'muscle',es:'músculo',de:'Muskel',ru:'myshtsa',zh:'jigou',ja:'kin-niku',ht:'misk'}},
      {n:'sang',t:{en:'blood',es:'sangre',de:'Blut',ru:'krov',zh:'xie',ja:'chi',ht:'san'}},
      {n:'nerf',t:{en:'nerve',es:'nervio',de:'Nerv',ru:'nerv',zh:'shenjing',ja:'shinkei',ht:'nèf'}},
      {n:'peau',t:{en:'skin',es:'piel',de:'Haut',ru:'kozha',zh:'pifu',ja:'hifu',ht:'po'}},
      {n:'gorge',t:{en:'throat',es:'garganta',de:'Hals',ru:'gorlo',zh:'houlong',ja:'nodo',ht:'gòj'}},
      {n:'dent',t:{en:'tooth',es:'diente',de:'Zahn',ru:'zub',zh:'ya',ja:'ha',ht:'dan'}},
      {n:'langue',t:{en:'tongue',es:'lengua',de:'Zunge',ru:'yazyk',zh:'she',ja:'shita',ht:'lang'}},
      {n:'épaule',t:{en:'shoulder',es:'hombro',de:'Schulter',ru:'plecho',zh:'jiabang',ja:'kata',ht:'zepòl'}},
      {n:'genou',t:{en:'knee',es:'rodilla',de:'Knie',ru:'koleno',zh:'xigai',ja:'hiza',ht:'jenou'}},
      {n:'dos',t:{en:'back',es:'espalda',de:'Rücken',ru:'spina',zh:'bei',ja:'senaka',ht:'do'}},
    ]
  },
  maison_details: {
    fr:'Détails Maison',en:'House Details',es:'Detalles casa',ht:'Detay Kay',de:'Hausdetails',ru:'Detali doma',zh:'Fangzi xijie',ja:'Ie no shosai',
    icon:'🏠',
    words:[
      {n:'toit',t:{en:'roof',es:'techo',de:'Dach',ru:'krysha',zh:'wuding',ja:'yane',ht:'twati'}},
      {n:'mur',t:{en:'wall',es:'pared',de:'Wand',ru:'stena',zh:'qiang',ja:'kabe',ht:'mir'}},
      {n:'sol',t:{en:'floor',es:'suelo',de:'Boden',ru:'pol',zh:'diban',ja:'yuka',ht:'atè'}},
      {n:'fenêtre',t:{en:'window',es:'ventana',de:'Fenster',ru:'okno',zh:'chuanghu',ja:'mado',ht:'fenèt'}},
      {n:'porte',t:{en:'door',es:'puerta',de:'Tür',ru:'dver',zh:'men',ja:'doa',ht:'pòt'}},
      {n:'escalier',t:{en:'stairs',es:'stairs',de:'Treppe',ru:'lestnitsa',zh:'lou-ti',ja:'kaidan',ht:'eskalyè'}},
      {n:'couloir',t:{en:'hallway',es:'pasillo',de:'Flur',ru:'koridor',zh:'zoulang',ja:'roka',ht:'koulwa'}},
      {n:'cuisine',t:{en:'kitchen',es:'cocina',de:'Küche',ru:'kukhnya',zh:'chufang',ja:'daidokoro',ht:'kizin'}},
      {n:'chambre',t:{en:'bedroom',es:'dormitorio',de:'Schlafzimmer',ru:'spalnya',zh:'woshi',ja:'shinshitsu',ht:'chanm'}},
      {n:'jardin',t:{en:'garden',es:'jardín',de:'Garten',ru:'sad',zh:'huayuan',ja:'niwa',ht:'jadin'}},
      {n:'garage',t:{en:'garage',es:'garaje',de:'Garage',ru:'garazh',zh:'cheku',ja:'gareji',ht:'garaj'}},
      {n:'cave',t:{en:'basement',es:'sótano',de:'Keller',ru:'podval',zh:'dixia shi',ja:'chikashitsu',ht:'kav'}},
      {n:'cheminée',t:{en:'chimney',es:'chimenea',de:'Schornstein',ru:'dymokhod',zh:'yan-cong',ja:'entotsu',ht:'chemine'}},
      {n:'serrure',t:{en:'lock',es:'cerradura',de:'Schloss',ru:'zamok',zh:'suo',ja:'kagi',ht:'seri'}},
      {n:'clé',t:{en:'key',es:'key',de:'Schlüssel',ru:'klyuch',zh:'yaoshi',ja:'kagi',ht:'kle'}},
    ]
  },
  societe_politique: {
    fr:'Société',en:'Society',es:'Sociedad',ht:'Sosyete',de:'Gesellschaft',ru:'Obshchestvo',zh:'Shehui',ja:'Shakai',
    icon:'🏛️',
    words:[
      {n:'peuple',t:{en:'people',es:'pueblo',de:'Volk',ru:'narod',zh:'renmin',ja:'jinmin',ht:'pèp'}},
      {n:'gouvernement',t:{en:'government',es:'gobierno',de:'Regierung',ru:'pravitelstvo',zh:'zhengfu',ja:'seifu',ht:'gouvènman'}},
      {n:'paix',t:{en:'peace',es:'paz',de:'Frieden',ru:'mir',zh:'heping',ja:'heiwa',ht:'lapè'}},
      {n:'guerre',t:{en:'war',es:'guerra',de:'Krieg',ru:'voyna',zh:'zhanzheng',ja:'senso',ht:'lagè'}},
      {n:'liberté',t:{en:'freedom',es:'libertad',de:'Freiheit',ru:'svoboda',zh:'ziyou',ja:'jiyu',ht:'libète'}},
      {n:'loi',t:{en:'law',es:'ley',de:'Gesetz',ru:'zakon',zh:'falv',ja:'horitsu',ht:'lwa'}},
      {n:'vote',t:{en:'vote',es:'voto',de:'Wahl',ru:'golos',zh:'tou-piao',ja:'tohyo',ht:'vòt'}},
      {n:'droit',t:{en:'right',es:'derecho',de:'Recht',ru:'pravo',zh:'quanli',ja:'kenri',ht:'dwa'}},
      {n:'histoire',t:{en:'history',es:'historia',de:'Geschichte',ru:'istoriya',zh:'lishi',ja:'rekishi',ht:'istwa'}},
      {n:'culture',t:{en:'culture',es:'cultura',de:'Kultur',ru:'kultura',zh:'wenhua',ja:'bunka',ht:'kilti'}},
      {n:'religion',t:{en:'religion',es:'religión',de:'Religion',ru:'religiya',zh:'zongjiao',ja:'shukyo',ht:'relijyon'}},
      {n:'citoyen',t:{en:'citizen',es:'ciudadano',de:'Bürger',ru:'grazhdanin',zh:'gongmin',ja:'shimin',ht:'sitwayen'}},
      {n:'pouvoir',t:{en:'power',es:'power',de:'Macht',ru:'vlast',zh:'quanli',ja:'kenryoku',ht:'pouvwa'}},
      {n:'frontière',t:{en:'border',es:'frontera',de:'Grenze',ru:'granitsa',zh:'bianjie',ja:'kokkyo',ht:'fontyè'}},
      {n:'nation',t:{en:'nation',es:'nación',de:'Nation',ru:'natsiya',zh:'minzu',ja:'kokka',ht:'nasyon'}},
    ]
  },
  tech_informatique: {
    fr:'Tech & Data',en:'Tech & Data',es:'Tecnología',ht:'Teknoloji',de:'Technologie',ru:'Tekhnologii',zh:'Jishu',ja:'Gijutsu',
    icon:'💻',
    words:[
      {n:'ordinateur',t:{en:'computer',es:'computadora',de:'Computer',ru:'kompyuter',zh:'jisuanji',ja:'konpyuta',ht:'òdinatè'}},
      {n:'logiciel',t:{en:'software',es:'software',de:'Software',ru:'programmnoe obespechenie',zh:'ruanjian',ja:'sofutowea',ht:'lojisyèl'}},
      {n:'réseau',t:{en:'network',es:'red',de:'Netzwerk',ru:'set',zh:'wangluo',ja:'nettowaku',ht:'rezo'}},
      {n:'données',t:{en:'data',es:'datos',de:'Daten',ru:'dannye',zh:'shuju',ja:'deta',ht:'done'}},
      {n:'écran',t:{en:'screen',es:'pantalla',de:'Bildschirm',ru:'ekran',zh:'pingmu',ja:'gamen',ht:'ekran'}},
      {n:'clavier',t:{en:'keyboard',es:'teclado',de:'Tastatur',ru:'klaviatura',zh:'jianpan',ja:'kibodo',ht:'klavye'}},
      {n:'souris',t:{en:'mouse',es:'ratón',de:'Maus',ru:'mysh',zh:'shubiao',ja:'mausu',ht:'souris'}},
      {n:'fichier',t:{en:'file',es:'archivo',de:'Datei',ru:'fayl',zh:'wenjian',ja:'fairu',ht:'fichye'}},
      {n:'serveur',t:{en:'server',es:'servidor',de:'Server',ru:'server',zh:'fuwuqi',ja:'saba',ht:'sèvè'}},
      {n:'code',t:{en:'code',es:'código',de:'Code',ru:'kod',zh:'daima',ja:'kodo',ht:'kòd'}},
      {n:'sécurité',t:{en:'security',es:'seguridad',de:'Sicherheit',ru:'bezopasnost',zh:'anquan',ja:'anzen',ht:'sekirite'}},
      {n:'vitesse',t:{en:'speed',es:'velocidad',de:'Geschwindigkeit',ru:'skorost',zh:'sudu',ja:'sokudo',ht:'vitès'}},
      {n:'image',t:{en:'image',es:'imagen',de:'Bild',ru:'izobrazhenie',zh:'tupian',ja:'gazo',ht:'imaj'}},
      {n:'mémoire',t:{en:'memory',es:'memoria',de:'Speicher',ru:'pamyat',zh:'neicun',ja:'memori',ht:'memwa'}},
      {n:'système',t:{en:'system',es:'sistema',de:'System',ru:'sistema',zh:'xitong',ja:'shisutemu',ht:'sistèm'}},
    ]
  },
  personnalite_qualites: {
    fr:'Personnalité',en:'Personality',es:'Personalidad',ht:'Pèsonalite',de:'Persönlichkeit',ru:'Lichnost',zh:'Xingge',ja:'Seikaku',
    icon:'👤',
    words:[
      {n:'intelligent',t:{en:'intelligent',es:'inteligente',de:'intelligent',ru:'umnyy',zh:'congming',ja:'kashikoi',ht:'entelijan'}},
      {n:'gentil',t:{en:'kind',es:'amable',de:'nett',ru:'dobryy',zh:'qinqie',ja:'shinsetsu',ht:'janti'}},
      {n:'fort',t:{en:'strong',es:'fuerte',de:'stark',ru:'silnyy',zh:'qiang',ja:'tsuyoi',ht:'fò'}},
      {n:'patient',t:{en:'patient',es:'paciente',de:'geduldig',ru:'terpelivyy',zh:'naixin',ja:'nintai-zuyoi',ht:'pasyan'}},
      {n:'honnête',t:{en:'honest',es:'honesto',de:'ehrlich',ru:'chestnyy',zh:'chengshi',ja:'shojiki',ht:'onèt'}},
      {n:'calme',t:{en:'calm',es:'calma',de:'ruhig',ru:'spokoynyy',zh:'pingjing',ja:'odayaka',ht:'kalm'}},
      {n:'curieux',t:{en:'curious',es:'curioso',de:'neugierig',ru:'lyubopytnyy',zh:'haoqi',ja:'kokishin',ht:'kuryo'}},
      {n:'drôle',t:{en:'funny',es:'divertido',de:'lustig',ru:'smeshnoy',zh:'youmo',ja:'omoshiroi',ht:'komik'}},
      {n:'sérieux',t:{en:'serious',es:'serio',de:'ernst',ru:'seryoznyy',zh:'yansu',ja:'majime',ht:'serye'}},
      {n:'créatif',t:{en:'creative',es:'creativo',de:'kreativ',ru:'tvorcheskiy',zh:'chuangyi',ja:'sozoteki',ht:'kreyatif'}},
      {n:'sage',t:{en:'wise',es:'sabio',de:'weise',ru:'mudryy',zh:'mingzhi',ja:'kenman',ht:'saj'}},
      {n:'brave',t:{en:'brave',es:'valiente',de:'mutig',ru:'smelyy',zh:'yonggan',ja:'yukan',ht:'vanyan'}},
      {n:'timide',t:{en:'shy',es:'tímido',de:'schüchtern',ru:'zastenchivyy',zh:'haixiu',ja:'uchiki',ht:'timid'}},
      {n:'fiable',t:{en:'reliable',es:'fiable',de:'zuverlässig',ru:'nadyozhnyy',zh:'keke',ja:'shinrai',ht:'fyab'}},
      {n:'ambitieux',t:{en:'ambitious',es:'ambicioso',de:'ambitioniert',ru:'ambitsioznyy',zh:'ye-xin',ja:'yashinteki',ht:'anbisye'}},
    ]
  },
  nature_sauvage: {
    fr:'Nature & Plantes',en:'Nature & Plants',es:'Naturaleza',ht:'Lanati ak Plant',de:'Natur',ru:'Priroda',zh:'Ziran',ja:'Shizen',
    icon:'🌿',
    words:[
      {n:'arbre',t:{en:'tree',es:'árbol',de:'Baum',ru:'derevo',zh:'shu',ja:'ki',ht:'pye bwa'}},
      {n:'fleur',t:{en:'flower',es:'flor',de:'Blume',ru:'tsvetok',zh:'hua',ja:'hana',ht:'flè'}},
      {n:'herbe',t:{en:'grass',es:'hierba',de:'Gras',ru:'trava',zh:'cao',ja:'kusa',ht:'zeb'}},
      {n:'forêt',t:{en:'forest',es:'bosque',de:'Wald',ru:'les',zh:'senlin',ja:'mori',ht:'fokè'}},
      {n:'rivière',t:{en:'river',es:'río',de:'Fluss',ru:'reka',zh:'he',ja:'kawa',ht:'rivyè'}},
      {n:'montagne',t:{en:'mountain',es:'montaña',de:'Berg',ru:'gora',zh:'shan',ja:'yama',ht:'mòn'}},
      {n:'lac',t:{en:'lake',es:'lago',de:'See',ru:'ozero',zh:'hu',ja:'mizuumi',ht:'lak'}},
      {n:'pierre',t:{en:'stone',es:'piedra',de:'Stein',ru:'kamen',zh:'shitou',ja:'ishi',ht:'wòch'}},
      {n:'ciel',t:{en:'sky',es:'cielo',de:'Himmel',ru:'nebo',zh:'tiankong',ja:'sora',ht:'syèl'}},
      {n:'soleil',t:{en:'sun',es:'sol',de:'Sonne',ru:'solntse',zh:'taiyang',ja:'taiyo',ht:'solèy'}},
      {n:'lune',t:{en:'moon',es:'luna',de:'Mond',ru:'luna',zh:'yue',ja:'tsuki',ht:'lendi'}},
      {n:'étoile',t:{en:'star',es:'estrella',de:'Stern',ru:'zvezda',zh:'xing',ja:'hoshi',ht:'zetwal'}},
      {n:'terre',t:{en:'earth',es:'tierra',de:'Erde',ru:'zemlya',zh:'diqiu',ja:'chikyu',ht:'tè'}},
      {n:'feuille',t:{en:'leaf',es:'hoja',de:'Blatt',ru:'list',zh:'yezi',ja:'ha',ht:'fèy'}},
      {n:'racine',t:{en:'root',es:'raíz',de:'Wurzel',ru:'koren',zh:'gen',ja:'ne',ht:'rasin'}},
    ]
  },
  evenements_vie: {
    fr:'Événements',en:'Life Events',es:'Eventos',ht:'Evènman lavi',de:'Lebensereignisse',ru:'Sobytiya',zh:'Shijian',ja:'Dekigoto',
    icon:'🎉',
    words:[
      {n:'naissance',t:{en:'birth',es:'nacimiento',de:'Geburt',ru:'rozhdenie',zh:'chusheng',ja:'tanjo',ht:'nesans'}},
      {n:'anniversaire',t:{en:'birthday',es:'cumpleaños',de:'Geburtstag',ru:'den rozhdeniya',zh:'shengri',ja:'tanjobi',ht:'fèt'}},
      {n:'mariage',t:{en:'wedding',es:'boda',de:'Hochzeit',ru:'svadba',zh:'hunli',ja:'kekkonshiki',ht:'maryaj'}},
      {n:'mort',t:{en:'death',es:'muerte',de:'Tod',ru:'smert',zh:'siwang',ja:'shi',ht:'lanmò'}},
      {n:'fête',t:{en:'party',es:'fiesta',de:'Feier',ru:'vecherinka',zh:'paidui',ja:'pati',ht:'fèt'}},
      {n:'diplôme',t:{en:'degree',es:'título',de:'Abschluss',ru:'diplom',zh:'xuewei',ja:'gakui',ht:'diplòm'}},
      {n:'voyage',t:{en:'trip',es:'viaje',de:'Reise',ru:'puteshestvie',zh:'lvxing',ja:'ryoko',ht:'vwayaj'}},
      {n:'vacances',t:{en:'vacation',es:'vacaciones',de:'Urlaub',ru:'otpusk',zh:'jiaqi',ja:'kyuka',ht:'vakans'}},
      {n:'rencontre',t:{en:'meeting',es:'encuentro',de:'Treffen',ru:'vstrecha',zh:'huimian',ja:'deai',ht:'rankont'}},
      {n:'changement',t:{en:'change',es:'cambio',de:'Veränderung',ru:'peremena',zh:'bianhua',ja:'henka',ht:'chanjman'}},
      {n:'succès',t:{en:'success',es:'éxito',de:'Erfolg',ru:'uspekh',zh:'chenggong',ja:'seiko',ht:'siksè'}},
      {n:'échec',t:{en:'failure',es:'fracaso',de:'Fehlschlag',ru:'neudacha',zh:'shibai',ja:'shippai',ht:'echèk'}},
      {n:'début',t:{en:'beginning',es:'inicio',de:'Anfang',ru:'nachalo',zh:'kaishi',ja:'hajimari',ht:'kòmansman'}},
      {n:'fin',t:{en:'end',es:'fin',de:'Ende',ru:'konets',zh:'jieshu',ja:'owari',ht:'lafen'}},
      {n:'souvenir',t:{en:'memory',es:'recuerdo',de:'Erinnerung',ru:'vospominanie',zh:'huiyi',ja:'omoide',ht:'souvni'}},
    ]
  },
  materiaux_objets: {
    fr:'Matériaux',en:'Materials',es:'Materiales',ht:'Materyo',de:'Materialien',ru:'Materialy',zh:'Cailiao',ja:'Zairyo',
    icon:'🏗️',
    words:[
      {n:'acier',t:{en:'steel',es:'acero',de:'Stahl',ru:'stal',zh:'gang',ja:'hagane',ht:'asye'}},
      {n:'or',t:{en:'gold',es:'oro',de:'Gold',ru:'zoloto',zh:'jin',ja:'kin',ht:'lò'}},
      {n:'argent',t:{en:'silver',es:'plata',de:'Silber',ru:'serebro',zh:'yin',ja:'gin',ht:'ajan'}},
      {n:'fer',t:{en:'iron',es:'hierro',de:'Eisen',ru:'zhelezo',zh:'tie',ja:'tetsu',ht:'fè'}},
      {n:'coton',t:{en:'cotton',es:'algodón',de:'Baumwolle',ru:'khlopok',zh:'mian',ja:'men',ht:'koton'}},
      {n:'laine',t:{en:'wool',es:'lana',de:'Wolle',ru:'sherst',zh:'yangmao',ja:'yumo',ht:'lenn'}},
      {n:'soie',t:{en:'silk',es:'seda',de:'Seide',ru:'sholk',zh:'si',ja:'kinu',ht:'swa'}},
      {n:'béton',t:{en:'concrete',es:'hormigón',de:'Beton',ru:'beton',zh:'shuiní',ja:'konkurito',ht:'beton'}},
      {n:'brique',t:{en:'brick',es:'ladrillo',de:'Ziegel',ru:'kirpich',zh:'zhuan',ja:'renga',ht:'brik'}},
      {n:'caoutchouc',t:{en:'rubber',es:'caucho',de:'Gummi',ru:'rezina',zh:'xiangjiao',ja:'gomu',ht:'kawotchou'}},
      {n:'poussière',t:{en:'dust',es:'polvo',de:'Staub',ru:'pyl',zh:'huichen',ja:'hokori',ht:'pousyè'}},
      {n:'boue',t:{en:'mud',es:'lodo',de:'Schlamm',ru:'gryaz',zh:'niba',ja:'doro',ht:'labou'}},
      {n:'vapeur',t:{en:'steam',es:'vapor',de:'Dampf',ru:'par',zh:'zhengqi',ja:'joki',ht:'vapè'}},
      {n:'gaz',t:{en:'gas',es:'gas',de:'Gas',ru:'gaz',zh:'qiti',ja:'gasu',ht:'gaz'}},
      {n:'liquide',t:{en:'liquid',es:'líquido',de:'Flüssigkeit',ru:'zhidkost',zh:'yeti',ja:'ekitai',ht:'likid'}},
    ]
  },
  voyage_transport: {
    fr:'Voyage',en:'Travel',es:'Viaje',ht:'Vwayaj',de:'Reise',ru:'Puteshestvie',zh:'Lvxing',ja:'Ryoko',
    icon:'✈️',
    words:[
      {n:'billet',t:{en:'ticket',es:'boleto',de:'Ticket',ru:'bilet',zh:'piao',ja:'kippu',ht:'tikè'}},
      {n:'bagage',t:{en:'luggage',es:'equipaje',de:'Gepäck',ru:'bagazh',zh:'xingli',ja:'nimotsu',ht:'bagaj'}},
      {n:'passeport',t:{en:'passport',es:'pasaporte',de:'Pass',ru:'pasport',zh:'huzhao',ja:'pasupoto',ht:'pas pò'}},
      {n:'vol',t:{en:'flight',es:'vuelo',de:'Flug',ru:'polet',zh:'hangban',ja:'fubun',ht:'vòl'}},
      {n:'train',t:{en:'train',es:'tren',de:'Zug',ru:'poezd',zh:'huoche',ja:'densha',ht:'tren'}},
      {n:'avion',t:{en:'airplane',es:'avión',de:'Flugzeug',ru:'samolet',zh:'feiji',ja:'hikoki',ht:'avion'}},
      {n:'bus',t:{en:'bus',es:'autobús',de:'Bus',ru:'avtobus',zh:'gonggong qiche',ja:'basu',ht:'bis'}},
      {n:'bateau',t:{en:'boat',es:'barco',de:'Boot',ru:'lodka',zh:'chuan',ja:'fune',ht:'batiman'}},
      {n:'gare',t:{en:'station',es:'estación',de:'Bahnhof',ru:'vokzal',zh:'zhan',ja:'eki',ht:'ga'}},
      {n:'aéroport',t:{en:'airport',es:'aeropuerto',de:'Flughafen',ru:'aeroport',zh:'jichang',ja:'kuko',ht:'ayewopò'}},
      {n:'hôtel',t:{en:'hotel',es:'hotel',de:'Hotel',ru:'otel',zh:'jiudian',ja:'hoteru',ht:'otèl'}},
      {n:'carte',t:{en:'map',es:'mapa',de:'Karte',ru:'karta',zh:'ditu',ja:'chizu',ht:'kat'}},
      {n:'aventure',t:{en:'adventure',es:'aventura',de:'Abenteuer',ru:'priklyuchenie',zh:'maoxian',ja:'boken',ht:'avantir'}},
      {n:'guide',t:{en:'guide',es:'guía',de:'Führer',ru:'gid',zh:'zhinan',ja:'gaido',ht:'gid'}},
      {n:'touriste',t:{en:'tourist',es:'turista',de:'Tourist',ru:'turist',zh:'youke',ja:'kanko-kyaku',ht:'touris'}},
    ]
  },
  mots_liaison: {
    fr:'Liaisons',en:'Connectors',es:'Conectores',ht:'Mo lyon',de:'Verbindungen',ru:'Soyuzy',zh:'Lianjie ci',ja:'Setsuzokushi',
    icon:'🔗',
    words:[
      {n:'et',t:{en:'and',es:'y',de:'und',ru:'i',zh:'he',ja:'to',ht:'ak'}},
      {n:'mais',t:{en:'but',es:'pero',de:'aber',ru:'no',zh:'danshi',ja:'demo',ht:'men'}},
      {n:'ou',t:{en:'or',es:'o',de:'oder',ru:'ili',zh:'huozhe',ja:'aruiwa',ht:'oswa'}},
      {n:'donc',t:{en:'so',es:'entonces',de:'also',ru:'poetomu',zh:'suoyi',ja:'dakara',ht:'donk'}},
      {n:'parce que',t:{en:'because',es:'porque',de:'weil',ru:'potomu chto',zh:'yinwei',ja:'nazenara',ht:'paske'}},
      {n:'avec',t:{en:'with',es:'con',de:'mit',ru:'s',zh:'he',ja:'to issho ni',ht:'avèk'}},
      {n:'sans',t:{en:'without',es:'sin',de:'ohne',ru:'bez',zh:'meiyou',ja:'nashi de',ht:'san'}},
      {n:'pour',t:{en:'for',es:'para',de:'für',ru:'dlya',zh:'wei',ja:'tame ni',ht:'pou'}},
      {n:'si',t:{en:'if',es:'si',de:'wenn',ru:'esli',zh:'ruguo',ja:'moshi',ht:'si'}},
      {n:'alors',t:{en:'then',es:'entonces',de:'dann',ru:'togda',zh:'ranhou',ja:'sorekara',ht:'alò'}},
      {n:'encore',t:{en:'again',es:'otra vez',de:'wieder',ru:'snova',zh:'zai',ja:'mata',ht:'ankò'}},
      {n:'aussi',t:{en:'also',es:'también',de:'auch',ru:'takzhe',zh:'ye',ja:'mo',ht:'tou'}},
      {n:'très',t:{en:'very',es:'muy',de:'sehr',ru:'ochen',zh:'hen',ja:'totemo',ht:'trè'}},
      {n:'toujours',t:{en:'always',es:'siempre',de:'immer',ru:'vsegda',zh:'zongshi',ja:'itsumo',ht:'toujou'}},
      {n:'jamais',t:{en:'never',es:'nunca',de:'nie',ru:'nikogda',zh:'cong bu',ja:'kesshite',ht:'janm'}},
    ]
  },
  mathematiques_formes: {
    fr:'Maths & Formes',en:'Math & Shapes',es:'Matemáticas',ht:'Matematik',de:'Mathematik',ru:'Matematika',zh:'Shuxue',ja:'Sugaku',
    icon:'📐',
    words:[
      {n:'cercle',t:{en:'circle',es:'círculo',de:'Kreis',ru:'krug',zh:'yuan',ja:'en',ht:'sèk'}},
      {n:'carré',t:{en:'square',es:'cuadrado',de:'Quadrat',ru:'kvadrat',zh:'zhengfangxing',ja:'shikaku',ht:'kare'}},
      {n:'triangle',t:{en:'triangle',es:'triángulo',de:'Dreieck',ru:'treugolnik',zh:'sanjiaoxing',ja:'sankaku',ht:'triyang'}},
      {n:'ligne',t:{en:'line',es:'línea',de:'Linie',ru:'liniya',zh:'xian',ja:'sen',ht:'liy'}},
      {n:'point',t:{en:'point',es:'punto',de:'Punkt',ru:'tochka',zh:'dian',ja:'ten',ht:'pwen'}},
      {n:'nombre',t:{en:'number',es:'número',de:'Zahl',ru:'chislo',zh:'shuzi',ja:'kazu',ht:'nonb'}},
      {n:'somme',t:{en:'sum',es:'suma',de:'Summe',ru:'summa',zh:'zonghe',ja:'gokei',ht:'som'}},
      {n:'moins',t:{en:'minus',es:'menos',de:'minus',ru:'minus',zh:'jian',ja:'mainasu',ht:'mwen'}},
      {n:'plus',t:{en:'plus',es:'más',de:'plus',ru:'plyus',zh:'jia',ja:'purasu',ht:'plis'}},
      {n:'égal',t:{en:'equal',es:'igual',de:'gleich',ru:'ravno',zh:'dengyu',ja:'hitoshī',ht:'egal'}},
      {n:'angle',t:{en:'angle',es:'ángulo',de:'Winkel',ru:'ugol',zh:'jiaodu',ja:'kaku',ht:'ang'}},
      {n:'centre',t:{en:'center',es:'centro',de:'Mitte',ru:'tsentr',zh:'zhongxin',ja:'chushin',ht:'sant'}},
      {n:'pourcentage',t:{en:'percent',es:'porcentaje',de:'Prozent',ru:'protsent',zh:'baifenbi',ja:'pasento',ht:'pousantaj'}},
      {n:'zéro',t:{en:'zero',es:'cero',de:'Null',ru:'nol',zh:'ling',ja:'zero',ht:'zewo'}},
      {n:'infini',t:{en:'infinite',es:'infinito',de:'unendlich',ru:'beskonechno',zh:'wuqiong',ja:'mugen',ht:'enfini'}},
    ]
  },
  faune_sauvage: {
    fr:'Faune Sauvage',en:'Wildlife',es:'Vida silvestre',ht:'Zannimo sovaj',de:'Wildtiere',ru:'Dikiye zhivotnye',zh:'Yousheng dongwu',ja:'Yasei dobutsu',
    icon:'🦁',
    words:[
      {n:'lion',t:{en:'lion',es:'león',de:'Löwe',ru:'lev',zh:'shizi',ja:'raion',ht:'lyon'}},
      {n:'tigre',t:{en:'tiger',es:'tigre',de:'Tiger',ru:'tigr',zh:'laohu',ja:'tora',ht:'tig'}},
      {n:'éléphant',t:{en:'elephant',es:'elefante',de:'Elefant',ru:'slon',zh:'daxiang',ja:'zo',ht:'elefan'}},
      {n:'ours',t:{en:'bear',es:'oso',de:'Bär',ru:'medved',zh:'xiong',ja:'kuma',ht:'ous'}},
      {n:'singe',t:{en:'monkey',es:'mono',de:'Affe',ru:'obezyana',zh:'houzi',ja:'saru',ht:'makak'}},
      {n:'serpent',t:{en:'snake',es:'serpiente',de:'Schlange',ru:'zmeya',zh:'she',ja:'hebi',ht:'koulèv'}},
      {n:'oiseau',t:{en:'bird',es:'pájaro',de:'Vogel',ru:'ptitsa',zh:'niao',ja:'tori',ht:'zwazo'}},
      {n:'poisson',t:{en:'fish',es:'pez',de:'Fisch',ru:'ryba',zh:'yu',ja:'sakana',ht:'pwason'}},
      {n:'requin',t:{en:'shark',es:'tiburón',de:'Hai',ru:'akula',zh:'shayu',ja:'same',ht:'requin'}},
      {n:'fourmi',t:{en:'ant',es:'hormiga',de:'Ameise',ru:'muravey',zh:'mayi',ja:'ari',ht:'foumi'}},
      {n:'abeille',t:{en:'bee',es:'abeja',de:'Biene',ru:'pchela',zh:'mifeng',ja:'hachi',ht:'mouch a myel'}},
      {n:'loup',t:{en:'wolf',es:'lobo',de:'Wolf',ru:'volk',zh:'lang',ja:'okami',ht:'lou'}},
      {n:'renard',t:{en:'fox',es:'zorro',de:'Fuchs',ru:'lisa',zh:'huli',ja:'kitsune',ht:'renar'}},
      {n:'souris',t:{en:'mouse',es:'ratón',de:'Maus',ru:'mysh',zh:'laoshu',ja:'nezumi',ht:'souris'}},
      {n:'insecte',t:{en:'insect',es:'insecto',de:'Insekt',ru:'nasekomoe',zh:'kunchong',ja:'konchu',ht:'ensèk'}},
    ]
  },
  vetements_accessoires: {
    fr:'Vêtements',en:'Clothes',es:'Ropa',ht:'Rad',de:'Kleidung',ru:'Odezhda',zh:'Yifu',ja:'Fuku',
    icon:'👕',
    words:[
      {n:'chemise',t:{en:'shirt',es:'camisa',de:'Hemd',ru:'rubashka',zh:'chenshan',ja:'shatsu',ht:'chemiz'}},
      {n:'pantalon',t:{en:'pants',es:'pantalones',de:'Hose',ru:'bruki',zh:'kuzi',ja:'zubon',ht:'pantalon'}},
      {n:'robe',t:{en:'dress',es:'vestido',de:'Kleid',ru:'plate',zh:'lianyiqun',ja:'wanpisu',ht:'wòb'}},
      {n:'chaussures',t:{en:'shoes',es:'zapatos',de:'Schuhe',ru:'obuv',zh:'xie',ja:'kutsu',ht:'soulye'}},
      {n:'chapeau',t:{en:'hat',es:'sombrero',de:'Hut',ru:'shlyapa',zh:'maozi',ja:'boshi',ht:'chapyo'}},
      {n:'manteau',t:{en:'coat',es:'abrigo',de:'Mantel',ru:'palto',zh:'waitao',ja:'koto',ht:'manto'}},
      {n:'sac',t:{en:'bag',es:'bolsa',de:'Tasche',ru:'sumka',zh:'bao',ja:'kaban',ht:'sak'}},
      {n:'montre',t:{en:'watch',es:'reloj',de:'Uhr',ru:'chasy',zh:'shoubiao',ja:'tokei',ht:'mont'}},
      {n:'lunettes',t:{en:'glasses',es:'gafas',de:'Brille',ru:'ochki',zh:'yanjing',ja:'megane',ht:'lunèt'}},
      {n:'ceinture',t:{en:'belt',es:'cinturón',de:'Gürtel',ru:'remen',zh:'yandai',ja:'beruto',ht:'sentiron'}},
      {n:'gants',t:{en:'gloves',es:'guantes',de:'Handschuhe',ru:'perchatki',zh:'shoutao',ja:'tebukuro',ht:'gan'}},
      {n:'chaussettes',t:{en:'socks',es:'calcetines',de:'Socken',ru:'noski',zh:'wa-zi',ja:'kutsushita',ht:'chosèt'}},
      {n:'bijou',t:{en:'jewelry',es:'joya',de:'Schmuck',ru:'ukrashenie',zh:'zhubao',ja:'hoseki',ht:'bijou'}},
      {n:'parapluie',t:{en:'umbrella',es:'paraguas',de:'Regenschirm',ru:'zont',zh:'yusan',ja:'kasa',ht:'parapli'}},
      {n:'portefeuille',t:{en:'wallet',es:'billetera',de:'Brieftasche',ru:'koshelyok',zh:'qianbao',ja:'saifu',ht:'pòt fey'}},
    ]
  },
  etat_esprit_sante: {
    fr:'État d\'esprit',en:'Mindset',es:'Estado mental',ht:'Eta lespri',de:'Mentalität',ru:'Nastroenie',zh:'Xintai',ja:'Mensetsu',
    icon:'🧠',
    words:[
      {n:'espoir',t:{en:'hope',es:'esperanza',de:'Hoffnung',ru:'nadezhda',zh:'xiwang',ja:'kibo',ht:'espwa'}},
      {n:'peur',t:{en:'fear',es:'miedo',de:'Angst',ru:'strakh',zh:'kongju',ja:'fuan',ht:'pè'}},
      {n:'joie',t:{en:'joy',es:'alegría',de:'Freude',ru:'radost',zh:'kuaile',ja:'yorokobi',ht:'kè kontan'}},
      {n:'tristesse',t:{en:'sadness',es:'tristeza',de:'Traurigkeit',ru:'grust',zh:'beishang',ja:'kanashimi',ht:'tristès'}},
      {n:'colère',t:{en:'anger',es:'ira',de:'Wut',ru:'gnev',zh:'fennu',ja:'ikari',ht:'kòlè'}},
      {n:'stress',t:{en:'stress',es:'estrés',de:'Stress',ru:'stress',zh:'yali',ja:'sutoresu',ht:'estrès'}},
      {n:'confiance',t:{en:'confidence',es:'confianza',de:'Vertrauen',ru:'doverie',zh:'xinren',ja:'shinrai',ht:'konfyans'}},
      {n:'rêve',t:{en:'dream',es:'sueño',de:'Traum',ru:'mechta',zh:'meng',ja:'yume',ht:'rèv'}},
      {n:'souffrance',t:{en:'suffering',es:'sufrimiento',de:'Leiden',ru:'stradanie',zh:'tongku',ja:'kurushimi',ht:'soufrans'}},
      {n:'paix',t:{en:'peace',es:'paz',de:'Frieden',ru:'mir',zh:'heping',ja:'heiwa',ht:'lapè'}},
      {n:'énergie',t:{en:'energy',es:'energía',de:'Energie',ru:'energiya',zh:'jingli',ja:'enerugi',ht:'enèji'}},
      {n:'fatigue',t:{en:'fatigue',es:'fatiga',de:'Müdigkeit',ru:'ustalost',zh:'pilao',ja:'tsukare',ht:'fatig'}},
      {n:'attention',t:{en:'focus',es:'enfoque',de:'Fokus',ru:'fokus',zh:'zhuanzhu',ja:'shuchu',ht:'atansyon'}},
      {n:'mémoire',t:{en:'memory',es:'memoria',de:'Gedächtnis',ru:'pamyat',zh:'jiyi',ja:'kioku',ht:'memwa'}},
      {n:'esprit',t:{en:'spirit',es:'espíritu',de:'Geist',ru:'dukh',zh:'jingshen',ja:'seishin',ht:'lespri'}},
    ]
  },
  infrastructure_ville: {
    fr:'Infrastructures',en:'Infrastructure',es:'Infraestructura',ht:'Enfrastrikti',de:'Infrastruktur',ru:'Infrastruktura',zh:'Jichu sheshi',ja:'Kiban',
    icon:'🏗️',
    words:[
      {n:'route',t:{en:'road',es:'carretera',de:'Straße',ru:'doroga',zh:'lu',ja:'doro',ht:'wout'}},
      {n:'pont',t:{en:'bridge',es:'puente',de:'Brücke',ru:'most',zh:'qiao',ja:'hashi',ht:'pon'}},
      {n:'tunnel',t:{en:'tunnel',es:'túnel',de:'Tunnel',ru:'tonnel',zh:'suidao',ja:'tanneru',ht:'tinèl'}},
      {n:'port',t:{en:'port',es:'puerto',de:'Hafen',ru:'port',zh:'gangkou',ja:'minato',ht:'pò'}},
      {n:'stade',t:{en:'stadium',es:'estadio',de:'Stadion',ru:'stadion',zh:'tiyuchang',ja:'kyugijo',ht:'stad'}},
      {n:'hôpital',t:{en:'hospital',es:'hospital',de:'Krankenhaus',ru:'bolnitsa',zh:'yiyuan',ja:'byoin',ht:'lopital'}},
      {n:'mairie',t:{en:'city hall',es:'ayuntamiento',de:'Rathaus',ru:'meriya',zh:'shizhengfu',ja:'shiyakusho',ht:'lakomin'}},
      {n:'musée',t:{en:'museum',es:'museo',de:'Museum',ru:'muzey',zh:'bowuguan',ja:'hakubutsukan',ht:'mize'}},
      {n:'théâtre',t:{en:'theater',es:'teatro',de:'Theater',ru:'teatr',zh:'juyuan',ja:'gekijō',ht:'teat'}},
      {n:'bibliothèque',t:{en:'library',es:'biblioteca',de:'Bibliothek',ru:'biblioteka',zh:'tushuguan',ja:'toshokan',ht:'bibliyotèk'}},
      {n:'cimetière',t:{en:'cemetery',es:'cementerio',de:'Friedhof',ru:'kladbishche',zh:'mudi',ja:'bochi',ht:'simityè'}},
      {n:'prison',t:{en:'prison',es:'prisión',de:'Gefängnis',ru:'tyurma',zh:'jianyuan',ja:'keimusho',ht:'prizon'}},
      {n:'usine',t:{en:'factory',es:'fábrica',de:'Fabrik',ru:'zavod',zh:'gongchang',ja:'kojo',ht:'izin'}},
      {n:'chantier',t:{en:'construction site',es:'obra',de:'Baustelle',ru:'stroyka',zh:'gongdi',ja:'kensetsu genba',ht:'chantye'}},
      {n:'barrage',t:{en:'dam',es:'presa',de:'Damm',ru:'damba',zh:'shuiba',ja:'damu',ht:'baraj'}},
    ]
  },
  sciences_laboratoire: {
    fr:'Sciences',en:'Science',es:'Ciencia',ht:'Syans',de:'Wissenschaft',ru:'Nauka',zh:'Kexue',ja:'Kagaku',
    icon:'🧪',
    words:[
      {n:'expérience',t:{en:'experiment',es:'experimento',de:'Experiment',ru:'opyt',zh:'shiyan',ja:'jikken',ht:'eksperyans'}},
      {n:'chercheur',t:{en:'researcher',es:'investigador',de:'Forscher',ru:'issledovatel',zh:'yanjiuyuan',ja:'kenkyusha',ht:'chèchè'}},
      {n:'preuve',t:{en:'proof',es:'prueba',de:'Beweis',ru:'dokazatelstvo',zh:'zhengju',ja:'shoko',ht:'prèv'}},
      {n:'microscope',t:{en:'microscope',es:'microscopio',de:'Mikroskop',ru:'mikroskop',zh:'xianweijing',ja:'kenbikyo',ht:'mikwoskòp'}},
      {n:'molécule',t:{en:'molecule',es:'molécula',de:'Molekül',ru:'molekula',zh:'fenzi',ja:'bunshi',ht:'molekid'}},
      {n:'atome',t:{en:'atom',es:'átomo',de:'Atom',ru:'atom',zh:'yuanzi',ja:'genshi',ht:'atòm'}},
      {n:'énergie',t:{en:'energy',es:'energía',de:'Energie',ru:'energiya',zh:'nengyuan',ja:'enerugi',ht:'enèji'}},
      {n:'chaleur',t:{en:'heat',es:'calor',de:'Hitze',ru:'teplo',zh:'reneng',ja:'netsu',ht:'chalè'}},
      {n:'matière',t:{en:'matter',es:'materia',de:'Materie',ru:'materiya',zh:'wuzhi',ja:'busshitsu',ht:'matyè'}},
      {n:'espace',t:{en:'space',es:'espacio',de:'Weltraum',ru:'kosmos',zh:'taikong',ja:'uchu',ht:'espas'}},
      {n:'vitesse',t:{en:'velocity',es:'velocidad',de:'Geschwindigkeit',ru:'skorost',zh:'sudu',ja:'sokudo',ht:'vitès'}},
      {n:'gravité',t:{en:'gravity',es:'gravedad',de:'Gravitation',ru:'gravitatsiya',zh:'zhongli',ja:'juryoku',ht:'gravite'}},
      {n:'calcul',t:{en:'calculation',es:'cálculo',de:'Berechnung',ru:'raschet',zh:'jisuan',ja:'keisan',ht:'kalkil'}},
      {n:'théorie',t:{en:'theory',es:'teoría',de:'Theorie',ru:'teoriya',zh:'lilun',ja:'riron',ht:'teori'}},
      {n:'données',t:{en:'data',es:'datos',de:'Daten',ru:'dannye',zh:'shuju',ja:'deta',ht:'done'}},
    ]
  },
  cuisine_ustensiles: {
    fr:'Ustensiles',en:'Utensils',es:'Utensilios',ht:'Zouti kizin',de:'Utensilien',ru:'Posuda',zh:'Chuju',ja:'Dogu',
    icon:'🍳',
    words:[
      {n:'assiette',t:{en:'plate',es:'plato',de:'Teller',ru:'tarelka',zh:'panzi',ja:'osara',ht:'asiet'}},
      {n:'verre',t:{en:'glass',es:'vaso',de:'Glas',ru:'stakan',zh:'beizi',ja:'koppu',ht:'vè'}},
      {n:'fourchette',t:{en:'fork',es:'tenedor',de:'Gabel',ru:'vilka',zh:'chazi',ja:'foku',ht:'fouchèt'}},
      {n:'couteau',t:{en:'knife',es:'cuchillo',de:'Messer',ru:'nozh',zh:'dao',ja:'naifu',ht:'kouto'}},
      {n:'cuillère',t:{en:'spoon',es:'cuchara',de:'Löffel',ru:'lozhka',zh:'shaozi',ja:'sajun',ht:'kiyè'}},
      {n:'poêle',t:{en:'pan',es:'sartén',de:'Pfanne',ru:'skovoroda',zh:'pingdigao',ja:'furaipan',ht:'poelon'}},
      {n:'marmite',t:{en:'pot',es:'olla',de:'Topf',ru:'kastryulya',zh:'guo',ja:'nabe',ht:'mamit'}},
      {n:'four',t:{en:'oven',es:'horno',de:'Ofen',ru:'dukhovka',zh:'kaoxiang',ja:'obun',ht:'fou'}},
      {n:'frigo',t:{en:'fridge',es:'nevera',de:'Kühlschrank',ru:'kholodilnik',zh:'bingxiang',ja:'reizoko',ht:'frijidè'}},
      {n:'bouteille',t:{en:'bottle',es:'botella',de:'Flasche',ru:'butylka',zh:'pingzi',ja:'bin',ht:'boutèy'}},
      {n:'serviette',t:{en:'napkin',es:'servilleta',de:'Serviette',ru:'salfetka',zh:'canjin',ja:'napukin',ht:'sèvyèt'}},
      {n:'bol',t:{en:'bowl',es:'tazón',de:'Schüssel',ru:'miska',zh:'wan',ja:'bo-ru',ht:'bòl'}},
      {n:'balance',t:{en:'scale',es:'balanza',de:'Waage',ru:'vesy',zh:'cheng',ja:'hakari',ht:'balans'}},
      {n:'feu',t:{en:'fire',es:'fuego',de:'Feuer',ru:'ogon',zh:'huo',ja:'hi',ht:'dife'}},
      {n:'recette',t:{en:'recipe',es:'receta',de:'Rezept',ru:'retsept',zh:'shipu',ja:'reshipi',ht:'resèt'}},
    ]
  },
  espace_astronomie: {
    fr:'Astronomie',en:'Space',es:'Astronomía',ht:'Astronomi',de:'Astronomie',ru:'Astronomiya',zh:'Tianwen',ja:'Tenmon',
    icon:'🚀',
    words:[
      {n:'étoile',t:{en:'star',es:'estrella',de:'Stern',ru:'zvezda',zh:'xingxing',ja:'hoshi',ht:'zetwal'}},
      {n:'planète',t:{en:'planet',es:'planeta',de:'Planet',ru:'planeta',zh:'xingxing',ja:'wakusei',ht:'planèt'}},
      {n:'soleil',t:{en:'sun',es:'sol',de:'Sonne',ru:'solntse',zh:'taiyang',ja:'taiyo',ht:'solèy'}},
      {n:'lune',t:{en:'moon',es:'luna',de:'Mond',ru:'luna',zh:'yueliang',ja:'tsuki',ht:'lendi'}},
      {n:'galaxie',t:{en:'galaxy',es:'galaxia',de:'Galaxie',ru:'galaktika',zh:'xingxi',ja:'ginga',ht:'galaksi'}},
      {n:'comète',t:{en:'comet',es:'cometa',de:'Komet',ru:'kometa',zh:'huixing',ja:'houkiboshi',ht:'komèt'}},
      {n:'fusée',t:{en:'rocket',es:'cohete',de:'Rakete',ru:'raketa',zh:'huojian',ja:'roketto',ht:'fizé'}},
      {n:'astronaute',t:{en:'astronaut',es:'astronauta',de:'Astronaut',ru:'kosmonavt',zh:'hangtianyuan',ja:'uchu-hikoushi',ht:'astwonòt'}},
      {n:'télescope',t:{en:'telescope',es:'telescopio',de:'Teleskop',ru:'teleskop',zh:'wangyuanjing',ja:'bouenkyo',ht:'teleskòp'}},
      {n:'orbite',t:{en:'orbit',es:'órbita',de:'Umlaufbahn',ru:'orbita',zh:'guidao',ja:'kido',ht:'òbit'}},
      {n:'vide',t:{en:'vacuum',es:'vacío',de:'Vakuum',ru:'vakuum',zh:'zhenkong',ja:'shinku',ht:'vide'}},
      {n:'lumière',t:{en:'light',es:'luz',de:'Licht',ru:'svet',zh:'guang',ja:'hikari',ht:'limyè'}},
      {n:'poussière',t:{en:'dust',es:'polvo',de:'Staub',ru:'pyl',zh:'huichen',ja:'hokori',ht:'pousyè'}},
      {n:'système',t:{en:'system',es:'sistema',de:'System',ru:'sistema',zh:'xitong',ja:'shisutemu',ht:'sistèm'}},
      {n:'univers',t:{en:'universe',es:'universo',de:'Universum',ru:'vselennaya',zh:'yuzhou',ja:'uchu',ht:'univè'}},
    ]
  },
  arts_spectacles: {
    fr:'Arts',en:'Arts',es:'Artes',ht:'La',de:'Künste',ru:'Iskusstvo',zh:'Yishu',ja:'Geijutsu',
    icon:'🎨',
    words:[
      {n:'peinture',t:{en:'painting',es:'pintura',de:'Malerei',ru:'zhivopis',zh:'huihua',ja:'kaiga',ht:'pentu'}},
      {n:'musique',t:{en:'music',es:'música',de:'Musik',ru:'muzyka',zh:'yinyue',ja:'ongaku',ht:'mizik'}},
      {n:'danse',t:{en:'dance',es:'danza',de:'Tanz',ru:'tanets',zh:'wu',ja:'dansu',ht:'dans'}},
      {n:'théâtre',t:{en:'theater',es:'teatro',de:'Theater',ru:'teatr',zh:'juyuan',ja:'gekijou',ht:'teat'}},
      {n:'cinéma',t:{en:'cinema',es:'cine',de:'Kino',ru:'kino',zh:'dianying',ja:'eiga',ht:'sinema'}},
      {n:'dessin',t:{en:'drawing',es:'dibujo',de:'Zeichnung',ru:'risunok',zh:'tu',ja:'e',ht:'desen'}},
      {n:'couleur',t:{en:'color',es:'color',de:'Farbe',ru:'tsvet',zh:'yanse',ja:'iro',ht:'koulè'}},
      {n:'sculpture',t:{en:'sculpture',es:'escultura',de:'Skulptur',ru:'skulptura',zh:'diaoshu',ja:'chokoku',ht:'eskilti'}},
      {n:'scène',t:{en:'stage',es:'escena',de:'Bühne',ru:'stsena',zh:'wutai',ja:'butai',ht:'sèn'}},
      {n:'artiste',t:{en:'artist',es:'artista',de:'Künstler',ru:'khudozhnik',zh:'yishujia',ja:'geijutsuka',ht:'atis'}},
      {n:'chanson',t:{en:'song',es:'canción',de:'Lied',ru:'pesnya',zh:'gequ',ja:'uta',ht:'chanzon'}},
      {n:'instrument',t:{en:'instrument',es:'instrumento',de:'Instrument',ru:'instrument',zh:'yuqi',ja:'gakki',ht:'enstriman'}},
      {n:'photo',t:{en:'photo',es:'foto',de:'Foto',ru:'foto',zh:'zhaopian',ja:'shashin',ht:'foto'}},
      {n:'poème',t:{en:'poem',es:'poema',de:'Gedicht',ru:'stikhotvorenie',zh:'shi',ja:'shi',ht:'powèm'}},
      {n:'beauté',t:{en:'beauty',es:'belleza',de:'Schönheit',ru:'krasota',zh:'meili',ja:'utsukushisa',ht:'bote'}},
    ]
  },
  adverbes_temps: {
    fr:'Temps (Adverbes)',en:'Time (Adverbs)',es:'Tiempo adv.',ht:'Adveb Tan',de:'Zeitadverbien',ru:'Narechiya vremeni',zh:'Shijian fùcí',ja:'Toki no fukushi',
    icon:'⏳',
    words:[
      {n:'maintenant',t:{en:'now',es:'ahora',de:'jetzt',ru:'seychas',zh:'xianzai',ja:'ima',ht:'kounye a'}},
      {n:'hier',t:{en:'yesterday',es:'ayer',de:'gestern',ru:'vchera',zh:'zuotian',ja:'kino',ht:'yè'}},
      {n:'aujourd\'hui',t:{en:'today',es:'hoy',de:'heute',ru:'segodnya',zh:'jintian',ja:'kyou',ht:'jodi a'}},
      {n:'demain',t:{en:'tomorrow',es:'mañana',de:'morgen',ru:'zavtra',zh:'mingtian',ja:'ashita',ht:'demen'}},
      {n:'bientôt',t:{en:'soon',es:'pronto',de:'bald',ru:'skoro',zh:'shao-hou',ja:'sugu',ht:'talè'}},
      {n:'tard',t:{en:'late',es:'tarde',de:'spät',ru:'pozdno',zh:'wan',ja:'osoku',ht:'ta'}},
      {n:'tôt',t:{en:'early',es:'temprano',de:'früh',ru:'rano',zh:'zao',ja:'hayaku',ht:'bonè'}},
      {n:'souvent',t:{en:'often',es:'souvent',de:'oft',ru:'chasto',zh:'changchang',ja:'yoku',ht:'souvan'}},
      {n:'parfois',t:{en:'sometimes',es:'a veces',de:'manchmal',ru:'inogda',zh:'youshi',ja:'tokidoki',ht:'pafwa'}},
      {n:'déjà',t:{en:'already',es:'ya',de:'schon',ru:'uzhe',zh:'yijing',ja:'sude ni',ht:'deja'}},
      {n:'encore',t:{en:'still/again',es:'todavía',de:'noch',ru:'eshche',zh:'hai',ja:'mada',ht:'ankò'}},
      {n:'ensuite',t:{en:'next',es:'luego',de:'danach',ru:'potom',zh:'jie-zhe',ja:'tsugi ni',ht:'apre sa'}},
      {n:'pendant',t:{en:'during',es:'durante',de:'während',ru:'vo vremya',zh:'zai...qijian',ja:'aida ni',ht:'pandan'}},
      {n:'après',t:{en:'after',es:'después',de:'nach',ru:'posle',zh:'yihou',ja:'ato de',ht:'apre'}},
      {n:'avant',t:{en:'before',es:'antes',de:'vor',ru:'do',zh:'yiqian',ja:'mae ni',ht:'anvan'}},
    ]
  },
  environnement_ecologie: {
    fr:'Environnement',en:'Environment',es:'Medio ambiente',ht:'Anviwonman',de:'Umwelt',ru:'Okruzhayushchaya sreda',zh:'Huanjing',ja:'Kankyo',
    icon:'🌳',
    words:[
      {n:'nature',t:{en:'nature',es:'naturaleza',de:'Natur',ru:'priroda',zh:'ziran',ja:'shizen',ht:'lanati'}},
      {n:'climat',t:{en:'climat',es:'clima',de:'Klima',ru:'klimat',zh:'qihou',ja:'kiko',ht:'klima'}},
      {n:'pollution',t:{en:'pollution',es:'contaminación',de:'Verschmutzung',ru:'zagryaznenie',zh:'wuran',ja:'osen',ht:'polisyon'}},
      {n:'recyclage',t:{en:'recycling',es:'reciclaje',de:'Recycling',ru:'pererabotka',zh:'huishou',ja:'risaikuru',ht:'resiklaj'}},
      {n:'énergie',t:{en:'energy',es:'energía',de:'Energie',ru:'energiya',zh:'nengyuan',ja:'enerugi',ht:'enèji'}},
      {n:'déchet',t:{en:'waste',es:'desecho',de:'Abfall',ru:'otkhody',zh:'feiwu',ja:'gomi',ht:'fatra'}},
      {n:'protection',t:{en:'protection',es:'protección',de:'Schutz',ru:'zashchita',zh:'baohu',ja:'hogo',ht:'pwoteksyon'}},
      {n:'océan',t:{en:'ocean',es:'océano',de:'Ozean',ru:'okean',zh:'haiyang',ja:'yo',ht:'oseyan'}},
      {n:'animal',t:{en:'animal',es:'animal',de:'Tier',ru:'zhivotnoe',zh:'dongwu',ja:'dobutsu',ht:'zannimo'}},
      {n:'soleil',t:{en:'sun',es:'sol',de:'Sonne',ru:'solntse',zh:'taiyang',ja:'taiyo',ht:'solèy'}},
      {n:'eau',t:{en:'water',es:'agua',de:'Wasser',ru:'voda',zh:'shui',ja:'mizu',ht:'dlo'}},
      {n:'terre',t:{en:'earth',es:'tierra',de:'Erde',ru:'zemlya',zh:'diqiu',ja:'chikyu',ht:'tè'}},
      {n:'air',t:{en:'air',es:'aire',de:'Luft',ru:'vozdukh',zh:'kongqi',ja:'kuki',ht:'lè'}},
      {n:'plante',t:{en:'plant',es:'planta',de:'Pflanze',ru:'rastenie',zh:'zhiwu',ja:'shokubutsu',ht:'plant'}},
      {n:'avenir',t:{en:'future',es:'futuro',de:'Zukunft',ru:'budushchee',zh:'weilai',ja:'mirai',ht:'lavni'}},
    ]
  },
  professions_sante: {
    fr:'Santé (Métiers)',en:'Health Jobs',es:'Profesiones salud',ht:'Metye Lasante',de:'Gesundheitsberufe',ru:'Meditsinskie professii',zh:'Yiliao zhiye',ja:'Iryo no shokugyo',
    icon:'👩‍⚕️',
    words:[
      {n:'médecin',t:{en:'doctor',es:'médico',de:'Arzt',ru:'vrach',zh:'yisheng',ja:'isha',ht:'doktè'}},
      {n:'infirmier',t:{en:'nurse',es:'enfermero',de:'Krankenpfleger',ru:'medsestra',zh:'hushi',ja:'kango-shi',ht:'enfimye'}},
      {n:'dentiste',t:{en:'dentist',es:'dentista',de:'Zahnarzt',ru:'stomatolog',zh:'yayi',ja:'ha-isha',ht:'dentis'}},
      {n:'pharmacien',t:{en:'pharmacist',es:'farmacéutico',de:'Apotheker',ru:'farmatsevt',zh:'yaoji-shi',ja:'yakuzaishi',ht:'famasisyen'}},
      {n:'chirurgien',t:{en:'surgeon',es:'cirujano',de:'Chirurg',ru:'khirurg',zh:'waike yisheng',ja:'geka-i',ht:'chirijyen'}},
      {n:'patient',t:{en:'patient',es:'paciente',de:'Patient',ru:'patsient',zh:'bingren',ja:'kanja',ht:'pasyan'}},
      {n:'urgence',t:{en:'emergency',es:'emergencia',de:'Notfall',ru:'skoraya pomoshch',zh:'jizhen',ja:'kyukyu',ht:'ijans'}},
      {n:'remède',t:{en:'cure',es:'remedio',de:'Heilmittel',ru:'lekarstvo',zh:'zhiliao',ja:'chiryo',ht:'remed'}},
      {n:'vaccin',t:{en:'vaccine',es:'vacuna',de:'Impfstoff',ru:'vaktsina',zh:'yimiao',ja:'wakuchin',ht:'vaksen'}},
      {n:'examen',t:{en:'checkup',es:'examen',de:'Untersuchung',ru:'osmotr',zh:'jiancha',ja:'kensa',ht:'egzamen'}},
      {n:'sang',t:{en:'blood',es:'sangre',de:'Blut',ru:'krov',zh:'xue',ja:'chi',ht:'san'}},
      {n:'clinique',t:{en:'clinic',es:'clínica',de:'Klinik',ru:'klinika',zh:'zhensuo',ja:'kurinikku',ht:'klinik'}},
      {n:'ordonnance',t:{en:'prescription',es:'receta',de:'Rezept',ru:'retsept',zh:'chufang',ja:'shohousen',ht:'òdonans'}},
      {n:'douleur',t:{en:'pain',es:'dolor',de:'Schmerz',ru:'bol',zh:'tong',ja:'itami',ht:'doule'}},
      {n:'santé',t:{en:'health',es:'salud',de:'Gesundheit',ru:'zdorove',zh:'jiankang',ja:'kenko',ht:'lasante'}},
    ]
  },
  sports_loisirs: {
    fr:'Sports & Loisirs',en:'Sports & Leisure',es:'Deportes',ht:'Espò ak Lwazi',de:'Sport und Freizeit',ru:'Sport i otdykh',zh:'Tiyu',ja:'Supotsu',
    icon:'⚽',
    words:[
      {n:'ballon',t:{en:'ball',es:'pelota',de:'Ball',ru:'myach',zh:'qiu',ja:'boru',ht:'balon'}},
      {n:'équipe',t:{en:'team',es:'equipo',de:'Team',ru:'komanda',zh:'duiwu',ja:'chimu',ht:'ekip'}},
      {n:'jeu',t:{en:'game',es:'juego',de:'Spiel',ru:'igra',zh:'youxi',ja:'gemu',ht:'jwèt'}},
      {n:'victoire',t:{en:'victory',es:'victoria',de:'Sieg',ru:'pobeda',zh:'shengli',ja:'shori',ht:'viktwa'}},
      {n:'course',t:{en:'race',es:'carrera',de:'Rennen',ru:'gonka',zh:'bisai',ja:'resu',ht:'kous'}},
      {n:'stade',t:{en:'stadium',es:'estadio',de:'Stadion',ru:'stadion',zh:'tiyuchang',ja:'kyugijo',ht:'stad'}},
      {n:'champion',t:{en:'champion',es:'campeón',de:'Champion',ru:'chempion',zh:'guanjun',ja:'onsha',ht:'chanpyon'}},
      {n:'entraînement',t:{en:'training',es:'entrenamiento',de:'Training',ru:'trenirovka',zh:'xunlian',ja:'toreningu',ht:'antrennman'}},
      {n:'règle',t:{en:'rule',es:'regla',de:'Regel',ru:'pravilo',zh:'guize',ja:'ruru',ht:'règ'}},
      {n:'score',t:{en:'score',es:'puntuación',de:'Punktestand',ru:'schet',zh:'defen',ja:'tokuten',ht:'skò'}},
      {n:'natation',t:{en:'swimming',es:'natación',de:'Schwimmen',ru:'plavanie',zh:'youyong',ja:'suiei',ht:'natasyon'}},
      {n:'vélo',t:{en:'cycling',es:'ciclismo',de:'Radfahren',ru:'velosport',zh:'qiche',ja:'saikuringu',ht:'bisiklèt'}},
      {n:'voyage',t:{en:'travel',es:'viaje',de:'Reisen',ru:'puteshestvie',zh:'lvxing',ja:'ryoko',ht:'vwayaj'}},
      {n:'repos',t:{en:'rest',es:'descanso',de:'Ruhe',ru:'otdykh',zh:'xiuxi',ja:'kyukei',ht:'repo'}},
      {n:'plaisir',t:{en:'pleasure',es:'placer',de:'Vergnügen',ru:'udovolstvie',zh:'kuaile',ja:'tanoshimi',ht:'plezi'}},
    ]
  },
  infrastructures_transport: {
    fr:'Transport (Détails)',en:'Transport Infra',es:'Infraestructura',ht:'Enfrastrikti Transpò',de:'Verkehrsinfrastruktur',ru:'Transportnaya sistema',zh:'Jiaotong sheshi',ja:'Kotsu kiban',
    icon:'🚇',
    words:[
      {n:'métro',t:{en:'subway',es:'metro',de:'U-Bahn',ru:'metro',zh:'ditie',ja:'chikatetsu',ht:'metro'}},
      {n:'autoroute',t:{en:'highway',es:'autopista',de:'Autobahn',ru:'shosse',zh:'gaosu gonglu',ja:'kosoku-doro',ht:'otowout'}},
      {n:'parking',t:{en:'parking',es:'estacionamiento',de:'Parkplatz',ru:'parkovka',zh:'tingche-chang',ja:'chushajo',ht:'pakin'}},
      {n:'trottoir',t:{en:'sidewalk',es:'acera',de:'Gehweg',ru:'trotuar',zh:'renxingdao',ja:'hodo',ht:'twotwa'}},
      {n:'feu rouge',t:{en:'traffic light',es:'semáforo',de:'Ampel',ru:'svetofor',zh:'honglvdeng',ja:'shingo',ht:'fe wouj'}},
      {n:'quai',t:{en:'platform',es:'andén',de:'Bahnsteig',ru:'perron',zh:'zhantai',ja:'purattohomu',ht:'kay'}},
      {n:'piste',t:{en:'runway/track',es:'pista',de:'Landebahn',ru:'polosa',zh:'pundao',ja:'kassouro',ht:'pis'}},
      {n:'wagon',t:{en:'wagon/car',es:'vagón',de:'Waggon',ru:'vagon',zh:'chexiang',ja:'sharyo',ht:'vagon'}},
      {n:'cabine',t:{en:'cabin',es:'cabina',de:'Kabine',ru:'kabina',zh:'cang',ja:'kyabinn',ht:'kabin'}},
      {n:'moteur',t:{en:'engine',es:'motor',de:'Motor',ru:'dvigatel',zh:'fajidongji',ja:'enjin',ht:'motè'}},
      {n:'essence',t:{en:'fuel/gas',es:'gasolina',de:'Benzin',ru:'benzin',zh:'qiyou',ja:'gasorin',ht:'gaz'}},
      {n:'frein',t:{en:'brake',es:'freno',de:'Bremse',ru:'tormoz',zh:'shache',ja:'bureki',ht:'fren'}},
      {n:'volant',t:{en:'steering wheel',es:'volante',de:'Lenkrad',ru:'rul',zh:'fangxiangpan',ja:'handoru',ht:'volan'}},
      {n:'pneu',t:{en:'tire',es:'neumático',de:'Reifen',ru:'shina',zh:'luntai',ja:'taiya',ht:'pneu'}},
      {n:'panneau',t:{en:'sign',es:'señal',de:'Schild',ru:'znak',zh:'baoshi',ja:'hyoshiki',ht:'panno'}},
    ]
  },
  geopolitique: {
    fr:'Géopolitique',en:'Geopolitics',es:'Geopolítica',ht:'Jewopolitik',de:'Geopolitik',ru:'Geopolitika',zh:'Diyuan zhengzhi',ja:'Chiseigaku',
    icon:'🌐',
    words:[
      {n:'ambassade',t:{en:'embassy',es:'embajada',de:'Botschaft',ru:'posolstvo',zh:'dashiguan',ja:'taishikan',ht:'anbasad'}},
      {n:'alliance',t:{en:'alliance',es:'alianza',de:'Bündnis',ru:'soyuz',zh:'tongmeng',ja:'domei',ht:'alyans'}},
      {n:'crise',t:{en:'crisis',es:'crisis',de:'Krise',ru:'krizis',zh:'weiji',ja:'kiki',ht:'kriz'}},
      {n:'conflit',t:{en:'conflict',es:'conflicto',de:'Konflikt',ru:'konflikt',zh:'chongtu',ja:'funso',ht:'konfli'}},
      {n:'traité',t:{en:'treaty',es:'tratado',de:'Vertrag',ru:'dogovor',zh:'tiaoyue',ja:'joyaku',ht:'trete'}},
      {n:'sommet',t:{en:'summit',es:'cumbre',de:'Gipfel',ru:'sammit',zh:'fenghui',ja:'samitto',ht:'somè'}},
      {n:'république',t:{en:'republic',es:'república',de:'Republik',ru:'respublika',zh:'gongheguo',ja:'kyowakoku',ht:'republic'}},
      {n:'monarchie',t:{en:'monarchy',es:'monarquía',de:'Monarchie',ru:'monarkhiya',zh:'junzhuzhi',ja:'kunshusei',ht:'monachi'}},
      {n:'élection',t:{en:'election',es:'elección',de:'Wahl',ru:'vybory',zh:'xuanju',ja:'senkyo',ht:'eleksyon'}},
      {n:'frontière',t:{en:'border',es:'frontera',de:'Grenze',ru:'granitsa',zh:'bianjie',ja:'kokkyo',ht:'fontyè'}},
      {n:'drapeau',t:{en:'flag',es:'bandera',de:'Flagge',ru:'flag',zh:'qizhi',ja:'hata',ht:'drapo'}},
      {n:'nation',t:{en:'nation',es:'nación',de:'Nation',ru:'natsiya',zh:'minzu',ja:'kokka',ht:'nasyon'}},
      {n:'asile',t:{en:'asylum',es:'asilo',de:'Asyl',ru:'ubezhishche',zh:'bihuo',ja:'higinan',ht:'azil'}},
      {n:'indépendance',t:{en:'independence',es:'independencia',de:'Unabhängigkeit',ru:'nezavisimost',zh:'duli',ja:'dokuritsu',ht:'endepandans'}},
      {n:'droits',t:{en:'rights',es:'derechos',de:'Rechte',ru:'prava',zh:'quanli',ja:'kenri',ht:'dwa'}},
    ]
  },
  sentiments_complexes: {
    fr:'Sentiments (Complexes)',en:'Sentiments',es:'Sentimientos',ht:'Santiman konplèks',de:'Gefühle',ru:'Chuvstva',zh:'Qinggan',ja:'Kanjo',
    icon:'🎭',
    words:[
      {n:'jalousie',t:{en:'jealousy',es:'celos',de:'Eifersucht',ru:'revnost',zh:'jidu',ja:'shitto',ht:'jalouzi'}},
      {n:'fierté',t:{en:'pride',es:'orgullo',de:'Stolz',ru:'gordost',zh:'zihao',ja:'hokori',ht:'fyète'}},
      {n:'honte',t:{en:'shame',es:'vergüenza',de:'Scham',ru:'styd',zh:'xiuchi',ja:'haji',ht:'wont'}},
      {n:'ennui',t:{en:'boredom',es:'aburrimiento',de:'Langeweile',ru:'skuka',zh:'wuliao',ja:'taikutsu',ht:'annwi'}},
      {n:'surprise',t:{en:'surprise',es:'sorpresa',de:'Überraschung',ru:'syurpriz',zh:'jingxi',ja:'odoroki',ht:'sipriz'}},
      {n:'confiance',t:{en:'trust',es:'confianza',de:'Vertrauen',ru:'doverie',zh:'xinren',ja:'shinrai',ht:'konfyans'}},
      {n:'méfiance',t:{en:'distrust',es:'desconfianza',de:'Misstrauen',ru:'nedoverie',zh:'buxinren',ja:'fushin',ht:'mefyans'}},
      {n:'compassion',t:{en:'compassion',es:'compasión',de:'Mitgefühl',ru:'sostradanie',zh:'tongqing',ja:'jihi',ht:'konpasyon'}},
      {n:'regret',t:{en:'regret',es:'arrepentimiento',de:'Reue',ru:'sozhalenie',zh:'houhui',ja:'koukai',ht:'regrè'}},
      {n:'courage',t:{en:'courage',es:'coraje',de:'Mut',ru:'smelost',zh:'yongqi',ja:'yuki',ht:'kouraj'}},
      {n:'patience',t:{en:'patience',es:'paciencia',de:'Geduld',ru:'terpenie',zh:'naixin',ja:'nintai',ht:'pasyans'}},
      {n:'gratitude',t:{en:'gratitude',es:'gratitud',de:'Dankbarkeit',ru:'blagodarnost',zh:'ganxie',ja:'kansha',ht:'rekonèsans'}},
      {n:'angoisse',t:{en:'anxiety',es:'ansiedad',de:'Angst',ru:'trevoga',zh:'jiaolv',ja:'fuan',ht:'angwas'}},
      {n:'enthousiasme',t:{en:'enthusiasm',es:'entusiasmo',de:'Enthusiasmus',ru:'entuziazm',zh:'reqing',ja:'netsuretsu',ht:'antouzyas'}},
      {n:'nostalgie',t:{en:'nostalgia',es:'nostalgia',de:'Nostalgie',ru:'nostalgiya',zh:'huaijiu',ja:'nosutarujia',ht:'nostalji'}},
    ]
  },
  verbes_action_1: {
    fr:'Verbes d\'action',en:'Action Verbs',es:'Verbos de acción',ht:'Vèb aksyon',de:'Aktionsverben',ru:'Glagoly deystviya',zh:'Dongci',ja:'Doushi',
    icon:'🏃',
    words:[
      {n:'manger',t:{en:'eat',es:'comer',de:'essen',ru:'est',zh:'chi',ja:'taberu',ht:'manje'}},
      {n:'boire',t:{en:'drink',es:'beber',de:'trinken',ru:'pit',zh:'he',ja:'nomu',ht:'bwè'}},
      {n:'dormir',t:{en:'sleep',es:'dormir',de:'schlafen',ru:'spat',zh:'shui',ja:'neru',ht:'dòmi'}},
      {n:'courir',t:{en:'run',es:'correr',de:'laufen',ru:'begat',zh:'pao',ja:'hashiru',ht:'kouri'}},
      {n:'parler',t:{en:'speak',es:'hablar',de:'sprechen',ru:'govorit',zh:'shuo',ja:'hanasu',ht:'pale'}},
      {n:'écouter',t:{en:'listen',es:'escuchar',de:'hören',ru:'slushat',zh:'ting',ja:'kiku',ht:'tande'}},
      {n:'regarder',t:{en:'watch',es:'mirar',de:'sehen',ru:'smotret',zh:'kan',ja:'miru',ht:'gadè'}},
      {n:'écrire',t:{en:'write',es:'escribir',de:'schreiben',ru:'pisat',zh:'xie',ja:'kaku',ht:'ekri'}},
      {n:'lire',t:{en:'read',es:'leer',de:'lesen',ru:'chitat',zh:'du',ja:'yomu',ht:'li'}},
      {n:'marcher',t:{en:'walk',es:'caminar',de:'gehen',ru:'khodit',zh:'zou',ja:'aruku',ht:'mache'}},
      {n:'travailler',t:{en:'work',es:'trabajar',de:'arbeiten',ru:'rabotat',zh:'gongzuo',ja:'hataraku',ht:'travay'}},
      {n:'apprendre',t:{en:'learn',es:'aprender',de:'lernen',ru:'uchitsya',zh:'xuexi',ja:'manabu',ht:'aprann'}},
      {n:'comprendre',t:{en:'understand',es:'entender',de:'verstehen',ru:'ponimat',zh:'mingbai',ja:'wakaru',ht:'konprann'}},
      {n:'acheter',t:{en:'buy',es:'comprar',de:'kaufen',ru:'kupit',zh:'mai',ja:'kau',ht:'achte'}},
      {n:'vendre',t:{en:'sell',es:'vender',de:'verkaufen',ru:'prodat',zh:'mai',ja:'uru',ht:'vann'}},
    ]
  },
  nourriture_ingredients: {
    fr:'Ingrédients',en:'Ingredients',es:'Ingredientes',ht:'Engredyan',de:'Zutaten',ru:'Ingredienty',zh:'Peiliao',ja:'Zairyo',
    icon:'🧂',
    words:[
      {n:'sel',t:{en:'salt',es:'sal',de:'Salz',ru:'sol',zh:'yan',ja:'shio',ht:'sèl'}},
      {n:'sucre',t:{en:'sugar',es:'azúcar',de:'Zucker',ru:'sakhar',zh:'tang',ja:'sato',ht:'sik'}},
      {n:'farine',t:{en:'flour',es:'harina',de:'Mehl',ru:'muka',zh:'mianfen',ja:'komugiko',ht:'farin'}},
      {n:'huile',t:{en:'oil',es:'aceite',de:'Öl',ru:'maslo',zh:'you',ja:'abura',ht:'lwil'}},
      {n:'œuf',t:{en:'egg',es:'huevo',de:'Ei',ru:'yaytso',zh:'dan',ja:'tamago',ht:'ze'}},
      {n:'lait',t:{en:'milk',es:'leche',de:'Milch',ru:'moloko',zh:'niunai',ja:'gyunyu',ht:'lèt'}},
      {n:'beurre',t:{en:'butter',es:'mantequilla',de:'Butter',ru:'maslo',zh:'huangyou',ja:'bata',ht:'mantèg'}},
      {n:'riz',t:{en:'rice',es:'arroz',de:'Reis',ru:'ris',zh:'mi',ja:'kome',ht:'diri'}},
      {n:'pâtes',t:{en:'pasta',es:'pasta',de:'Nudeln',ru:'pasta',zh:'miantiao',ja:'pasuta',ht:'pat'}},
      {n:'viande',t:{en:'meat',es:'carne',de:'Fleisch',ru:'myaso',zh:'rou',ja:'niku',ht:'vyann'}},
      {n:'poisson',t:{en:'fish',es:'pescado',de:'Fisch',ru:'ryba',zh:'yu',ja:'sakana',ht:'pwason'}},
      {n:'épice',t:{en:'spice',es:'especia',de:'Gewürz',ru:'spetsiya',zh:'xiangliao',ja:'supaisu',ht:'epis'}},
      {n:'ail',t:{en:'garlic',es:'ajo',de:'Knoblauch',ru:'chesnok',zh:'dasuan',ja:'ninniku',ht:'lay'}},
      {n:'oignon',t:{en:'onion',es:'cebolla',de:'Zwiebel',ru:'luk',zh:'yangcong',ja:'tamaneghi',ht:'onyon'}},
      {n:'eau',t:{en:'water',es:'agua',de:'Wasser',ru:'voda',zh:'shui',ja:'mizu',ht:'dlo'}},
    ]
  },
  meteo_phenomenes: {
    fr:'Météo & Nature',en:'Weather',es:'Clima',ht:'Meteo',de:'Wetter',ru:'Pogoda',zh:'Tianqi',ja:'Tenki',
    icon:'⚡',
    words:[
      {n:'orage',t:{en:'storm',es:'tormenta',de:'Gewitter',ru:'groza',zh:'baofengyu',ja:'arashi',ht:'orage'}},
      {n:'éclair',t:{en:'lightning',es:'rayo',de:'Blitz',ru:'molniya',zh:'shandian',ja:'inazuma',ht:'eklè'}},
      {n:'tonnerre',t:{en:'thunder',es:'trueno',de:'Donner',ru:'grom',zh:'leisheng',ja:'kaminari',ht:'loray'}},
      {n:'inondation',t:{en:'flood',es:'inundación',de:'Flut',ru:'navodnenie',zh:'hongshui',ja:'kozui',ht:'inondasyon'}},
      {n:'séisme',t:{en:'earthquake',es:'terremoto',de:'Erdbeben',ru:'zemletryasenie',zh:'dizhen',ja:'jishin',ht:'tranbleman tè'}},
      {n:'vent',t:{en:'wind',es:'viento',de:'Wind',ru:'veter',zh:'feng',ja:'kaze',ht:'van'}},
      {n:'neige',t:{en:'snow',es:'nieve',de:'Schnee',ru:'sneg',zh:'xue',ja:'yuki',ht:'nej'}},
      {n:'pluie',t:{en:'rain',es:'lluvia',de:'Regen',ru:'dozhd',zh:'yu',ja:'ame',ht:'lapli'}},
      {n:'brouillard',t:{en:'fog',es:'niebla',de:'Nebel',ru:'tuman',zh:'wu',ja:'kiri',ht:'bwouya'}},
      {n:'nuage',t:{en:'cloud',es:'nube',de:'Wolke',ru:'oblako',zh:'yun',ja:'kumo',ht:'nyaj'}},
      {n:'arc-en-ciel',t:{en:'rainbow',es:'arcoíris',de:'Regenbogen',ru:'raduga',zh:'caihong',ja:'niji',ht:'lakansyèl'}},
      {n:'température',t:{en:'temperature',es:'temperatura',de:'Temperatur',ru:'temperatura',zh:'wendu',ja:'on-do',ht:'tanperati'}},
      {n:'vague',t:{en:'wave',es:'ola',de:'Welle',ru:'volna',zh:'lang',ja:'nami',ht:'vague'}},
      {n:'incendie',t:{en:'fire',es:'incendio',de:'Feuer',ru:'pozhar',zh:'huozai',ja:'kajji',ht:'dife'}},
      {n:'ouragan',t:{en:'hurricane',es:'huracán',de:'Hurrikan',ru:'uragan',zh:'jufeng',ja:'hariken',ht:'ouragan'}},
    ]
  },
  mobilier_maison_bureau: {
    fr:'Mobilier',en:'Furniture',es:'Muebles',ht:'Mèb',de:'Möbel',ru:'Mebel',zh:'Jiaju',ja:'Kagu',
    icon:'🪑',
    words:[
      {n:'table',t:{en:'table',es:'mesa',de:'Tisch',ru:'stol',zh:'zhuozi',ja:'teburu',ht:'tab'}},
      {n:'chaise',t:{en:'chair',es:'silla',de:'Stuhl',ru:'stul',zh:'yizi',ja:'isu',ht:'chèz'}},
      {n:'lit',t:{en:'bed',es:'cama',de:'Bett',ru:'krovat',zh:'chuang',ja:'beddo',ht:'kabann'}},
      {n:'armoire',t:{en:'closet',es:'armario',de:'Schrank',ru:'shkaf',zh:'yigui',ja:'tansu',ht:'plaka'}},
      {n:'bureau',t:{en:'desk',es:'escritorio',de:'Schreibtisch',ru:'pismennyy stol',zh:'shuzhuo',ja:'tsukue',ht:'biro'}},
      {n:'étagère',t:{en:'shelf',es:'estante',de:'Regal',ru:'polka',zh:'jiazi',ja:'tana',ht:'etagè'}},
      {n:'canapé',t:{en:'sofa',es:'sofá',de:'Sofa',ru:'divan',zh:'shafa',ja:'sofa',ht:'kanape'}},
      {n:'lampe',t:{en:'lamp',es:'lámpara',de:'Lampe',ru:'lampa',zh:'deng',ja:'ranpu',ht:'lanp'}},
      {n:'miroir',t:{en:'mirror',es:'espejo',de:'Spiegel',ru:'zerkalo',zh:'jingzi',ja:'kagami',ht:'miwa'}},
      {n:'rideau',t:{en:'curtain',es:'cortina',de:'Vorhang',ru:'shtora',zh:'chuanglian',ja:'katen',ht:'rido'}},
      {n:'tapis',t:{en:'rug',es:'alfombra',de:'Teppich',ru:'kover',zh:'ditan',ja:'kagami',ht:'tapi'}},
      {n:'tiroir',t:{en:'drawer',es:'cajón',de:'Schublade',ru:'yashchik',zh:'chouti',ja:'hikidashi',ht:'tirwa'}},
      {n:'fauteuil',t:{en:'armchair',es:'sillón',de:'Sessel',ru:'kreslo',zh:'fushou-yi',ja:'hizakake',ht:'fotèy'}},
      {n:'évier',t:{en:'sink',es:'fregadero',de:'Spüle',ru:'rakovina',zh:'shuicao',ja:'shinku',ht:'lavabo'}},
      {n:'douche',t:{en:'shower',es:'ducha',de:'Dusche',ru:'dush',zh:'linyu',ja:'shawa',ht:'douch'}},
    ]
  },
  energie_electricite: {
    fr:'Énergie',en:'Energy',es:'Energía',ht:'Enèji',de:'Energie',ru:'Energiya',zh:'Nengyuan',ja:'Enerugi',
    icon:'🔌',
    words:[
      {n:'courant',t:{en:'current',es:'corriente',de:'Strom',ru:'tok',zh:'dianliu',ja:'denryu',ht:'kouran'}},
      {n:'batterie',t:{en:'battery',es:'batería',de:'Batterie',ru:'batareya',zh:'dianchi',ja:'batteri',ht:'batri'}},
      {n:'fil',t:{en:'wire',es:'cable',de:'Draht',ru:'provod',zh:'dianxian',ja:'densen',ht:'fil'}},
      {n:'ampoule',t:{en:'bulb',es:'bombilla',de:'Glühbirne',ru:'lampochka',zh:'dengpao',ja:'denkyu',ht:'anpoul'}},
      {n:'interrupteur',t:{en:'switch',es:'interruptor',de:'Schalter',ru:'vyklyuchatel',zh:'kaiguan',ja:'suitchi',ht:'bouton'}},
      {n:'prise',t:{en:'outlet',es:'enchufe',de:'Steckdose',ru:'rozetka',zh:'chuzuo',ja:'konsento',ht:'priz'}},
      {n:'tension',t:{en:'voltage',es:'voltaje',de:'Spannung',ru:'napryazhenie',zh:'dian-ya',ja:'den-atsu',ht:'vòltaj'}},
      {n:'puissance',t:{en:'power',es:'potencia',de:'Leistung',ru:'moshchnost',zh:'gonglv',ja:'denryoku',ht:'pouvwa'}},
      {n:'solaire',t:{en:'solar',es:'solar',de:'solar',ru:'solnechnyy',zh:'taiyangneng',ja:'sora',ht:'solè'}},
      {n:'nucléaire',t:{en:'nuclear',es:'nuclear',de:'nuklear',ru:'yadernyy',zh:'he-neng',ja:'genshiryoku',ht:'nikleyè'}},
      {n:'éolien',t:{en:'wind power',es:'eólico',de:'Windkraft',ru:'vetryanaya energiya',zh:'fengneng',ja:'furyoku',ht:'eyolyen'}},
      {n:'charbon',t:{en:'coal',es:'carbón',de:'Kohle',ru:'ugol',zh:'meitan',ja:'sekitan',ht:'chabon'}},
      {n:'gaz',t:{en:'gas',es:'gas',de:'Gas',ru:'gaz',zh:'tianranqi',ja:'gasu',ht:'gaz'}},
      {n:'pétrole',t:{en:'oil/petroleum',es:'petróleo',de:'Erdöl',ru:'neft',zh:'shiyou',ja:'sekiyu',ht:'petwòl'}},
      {n:'générateur',t:{en:'generator',es:'generador',de:'Generator',ru:'generator',zh:'fadianji',ja:'hatudenki',ht:'jeneratè'}},
    ]
  },
  criminalite_justice: {
    fr:'Crime & Loi',en:'Crime & Law',es:'Crimen y Ley',ht:'Krim ak Lwa',de:'Verbrechen',ru:'Prestupnost',zh:'Zui-e',ja:'Hanzai',
    icon:'🚔',
    words:[
      {n:'vol',t:{en:'theft',es:'robo',de:'Diebstahl',ru:'krazha',zh:'tou-qie',ja:'setto',ht:'vòl'}},
      {n:'meurtre',t:{en:'murder',es:'asesinato',de:'Mord',ru:'ubistvo',zh:'mousha',ja:'satsujin',ht:'moud'}},
      {n:'prisonnier',t:{en:'prisoner',es:'prisionero',de:'Gefangener',ru:'zaklyuchennyy',zh:'qiufan',ja:'shujin',ht:'prizonye'}},
      {n:'enquête',t:{en:'investigation',es:'investigación',de:'Ermittlung',ru:'rassledovanie',zh:'diaocha',ja:'sousa',ht:'ankèt'}},
      {n:'coupable',t:{en:'guilty',es:'culpable',de:'schuldig',ru:'vinovnyy',zh:'youzui',ja:'yuzai',ht:'koupab'}},
      {n:'innocent',t:{en:'innocent',es:'inocente',de:'unschuldig',ru:'nevinovnyy',zh:'wuzui',ja:'muzai',ht:'inosan'}},
      {n:'amende',t:{en:'fine',es:'multa',de:'Bußgeld',ru:'shtraf',zh:'fakuan',ja:'bakkin',ht:'amann'}},
      {n:'victime',t:{en:'victim',es:'víctima',de:'Opfer',ru:'zhertva',zh:'shouhaizhe',ja:'ghiseisha',ht:'viktom'}},
      {n:'menottes',t:{en:'handcuffs',es:'esposas',de:'Handschellen',ru:'naruchniki',zh:'shoushuo',ja:'tejyo',ht:'menòt'}},
      {n:'tribunal',t:{en:'court',es:'tribunal',de:'Gericht',ru:'sud',zh:'fayuan',ja:'saibansho',ht:'tribinal'}},
      {n:'verdict',t:{en:'verdict',es:'veredicto',de:'Urteil',ru:'prigovor',zh:'panjue',ja:'hanketsu',ht:'vèdik'}},
      {n:'témoignage',t:{en:'testimony',es:'testimonio',de:'Zeugenaussage',ru:'pokazanie',zh:'zheng-ci',ja:'shogen',ht:'temwayaj'}},
      {n:'corruption',t:{en:'corruption',es:'corrupción',de:'Korruption',ru:'korruptsiya',zh:'fubai',ja:'oshoku',ht:'koripsyon'}},
      {n:'justice',t:{en:'justice',es:'justicia',de:'Gerechtigkeit',ru:'spravedlivost',zh:'zhengyi',ja:'seigi',ht:'jistis'}},
      {n:'libération',t:{en:'release',es:'liberación',de:'Freilassung',ru:'osvobozhdenie',zh:'shifang',ja:'shakuho',ht:'liberasyon'}},
    ]
  },
  verbes_etat_existence: {
    fr:'Être & État',en:'State Verbs',es:'Verbos de estado',ht:'Vèb leta',de:'Zustandsverben',ru:'Glagoly sostoyaniya',zh:'Zhuangtai dongci',ja:'Joutai doushi',
    icon:'✨',
    words:[
      {n:'être',t:{en:'be',es:'ser/estar',de:'sein',ru:'byt',zh:'shi',ja:'desu',ht:'se'}},
      {n:'avoir',t:{en:'have',es:'tener',de:'haben',ru:'imet',zh:'you',ja:'motsu',ht:'gen'}},
      {n:'sembler',t:{en:'seem',es:'parecer',de:'scheinen',ru:'kazatsya',zh:'xiande',ja:'mieru',ht:'sanmble'}},
      {n:'devenir',t:{en:'become',es:'convertirse',de:'werden',ru:'stanovitsya',zh:'biancheng',ja:'naru',ht:'vin'}},
      {n:'rester',t:{en:'stay',es:'quedarse',de:'bleiben',ru:'ostavatsya',zh:'baochi',ja:'tomaru',ht:'rete'}},
      {n:'exister',t:{en:'exist',es:'existir',de:'existieren',ru:'sushchestvovat',zh:'cun-zai',ja:'sonzai suru',ht:'egziste'}},
      {n:'vivre',t:{en:'live',es:'vivir',de:'leben',ru:'zhit',zh:'huo',ja:'ikiru',ht:'viv'}},
      {n:'mourir',t:{en:'die',es:'morir',de:'sterben',ru:'umeret',zh:'si',ja:'shinu',ht:'mouri'}},
      {n:'penser',t:{en:'think',es:'pensar',de:'denken',ru:'dumat',zh:'xiang',ja:'omou',ht:'panse'}},
      {n:'croire',t:{en:'believe',es:'creer',de:'glauben',ru:'verit',zh:'xiangxin',ja:'shinjiru',ht:'kwè'}},
      {n:'savoir',t:{en:'know',es:'saber',de:'wissen',ru:'znat',zh:'zhidao',ja:'shiru',ht:'konnen'}},
      {n:'vouloir',t:{en:'want',es:'querer',de:'wollen',ru:'khotet',zh:'xiang',ja:'hoshii',ht:'vle'}},
      {n:'pouvoir',t:{en:'can',es:'poder',de:'können',ru:'moch',zh:'neng',ja:'dekiru',ht:'kapab'}},
      {n:'devoir',t:{en:'must',es:'deber',de:'müssen',ru:'dolzhen',zh:'yinggai',ja:'shinakereba',ht:'dwe'}},
      {n:'sentir',t:{en:'feel',es:'sentir',de:'fühlen',ru:'chuvstvovat',zh:'ganjue',ja:'kanjiru',ht:'santi'}},
    ]
  },
  high_tech_futur: {
    fr:'High-Tech',en:'High-Tech',es:'Tecnología punta',ht:'Teknoloji avanse',de:'Spitzentechnologie',ru:'Vysokie tekhnologii',zh:'Gao keji',ja:'Sentan gijutsu',
    icon:'🤖',
    words:[
      {n:'intelligence',t:{en:'intelligence',es:'inteligencia',de:'Intelligenz',ru:'intellekt',zh:'zhineng',ja:'chino',ht:'entelijans'}},
      {n:'robot',t:{en:'robot',es:'robot',de:'Roboter',ru:'robot',zh:'jiqiren',ja:'robotto',ht:'wobo'}},
      {n:'puce',t:{en:'chip',es:'chip',de:'Chip',ru:'chip',zh:'xin-pian',ja:'chippu',ht:'chip'}},
      {n:'virtuel',t:{en:'virtual',es:'virtual',de:'virtuell',ru:'virtualnyy',zh:'xu-ni',ja:'kaso',ht:'vityèl'}},
      {n:'réalité',t:{en:'reality',es:'realidad',de:'Realität',ru:'realnost',zh:'xianshi',ja:'genjitsu',ht:'reyalite'}},
      {n:'données',t:{en:'data',es:'datos',de:'Daten',ru:'dannye',zh:'shuju',ja:'deta',ht:'done'}},
      {n:'chaîne',t:{en:'chain',es:'cadena',de:'Kette',ru:'tsep',zh:'lian',ja:'kusari',ht:'chenn'}},
      {n:'bloc',t:{en:'block',es:'bloque',de:'Block',ru:'blok',zh:'kuai',ja:'burokku',ht:'blòk'}},
      {n:'algorithme',t:{en:'algorithm',es:'algoritmo',de:'Algorithmus',ru:'algoritm',zh:'suanfa',ja:'arugorizumu',ht:'algorit'}},
      {n:'réseau',t:{en:'network',es:'red',de:'Netzwerk',ru:'set',zh:'wangluo',ja:'nettowaku',ht:'rezo'}},
      {n:'nuage',t:{en:'cloud',es:'cloud',de:'Cloud',ru:'oblak',zh:'yun',ja:'kuraudo',ht:'nyaj'}},
      {n:'vitesse',t:{en:'speed',es:'velocidad',de:'Tempo',ru:'skorost',zh:'sudu',ja:'sokudo',ht:'vitès'}},
      {n:'futur',t:{en:'future',es:'futuro',de:'Zukunft',ru:'budushchee',zh:'weilai',ja:'mirai',ht:'lavni'}},
      {n:'innovation',t:{en:'innovation',es:'innovación',de:'Innovation',ru:'innovatsiya',zh:'chuangxin',ja:'kakushin',ht:'inovasyon'}},
      {n:'espace',t:{en:'space',es:'espacio',de:'Weltraum',ru:'kosmos',zh:'kongjian',ja:'uchu',ht:'espas'}},
    ]
  },
  anatomie_organes: {
    fr:'Anatomie',en:'Anatomy',es:'Anatomía',ht:'Anatomi',de:'Anatomie',ru:'Anatomiya',zh:'Jiepouxue',ja:'Kaibogaku',
    icon:'🫁',
    words:[
      {n:'cerveau',t:{en:'brain',es:'cerebro',de:'Gehirn',ru:'mozg',zh:'danǎo',ja:'nou',ht:'sèvo'}},
      {n:'cœur',t:{en:'heart',es:'corazón',de:'Herz',ru:'serdtse',zh:'xin-zang',ja:'shinzo',ht:'kè'}},
      {n:'poumon',t:{en:'lung',es:'pulmón',de:'Lunge',ru:'legkoe',zh:'fei',ja:'hai',ht:'poumon'}},
      {n:'estomac',t:{en:'stomach',es:'estómago',de:'Magen',ru:'zheludok',zh:'wei',ja:'i',ht:'lestomak'}},
      {n:'foie',t:{en:'liver',es:'hígado',de:'Leber',ru:'pechen',zh:'ganzang',ja:'kanzo',ht:'fwa'}},
      {n:'rein',t:{en:'kidney',es:'riñón',de:'Niere',ru:'pochka',zh:'shenzang',ja:'jinzo',ht:'ren'}},
      {n:'os',t:{en:'bone',es:'hueso',de:'Knochen',ru:'kost',zh:'gu-tou',ja:'hone',ht:'zo'}},
      {n:'muscle',t:{en:'muscle',es:'músculo',de:'Muskel',ru:'myshtsa',zh:'jìrou',ja:'kinniku',ht:'misk'}},
      {n:'sang',t:{en:'blood',es:'sangre',de:'Blut',ru:'krov',zh:'xue',ja:'chi',ht:'san'}},
      {n:'nerf',t:{en:'nerve',es:'nervio',de:'Nerv',ru:'nerv',zh:'shenjing',ja:'shinkei',ht:'nèf'}},
      {n:'peau',t:{en:'skin',es:'piel',de:'Haut',ru:'kozha',zh:'pi-fu',ja:'hada',ht:'po'}},
      {n:'gorge',t:{en:'throat',es:'garganta',de:'Hals',ru:'gorlo',zh:'houlong',ja:'nodo',ht:'gòj'}},
      {n:'dent',t:{en:'tooth',es:'diente',de:'Zahn',ru:'zub',zh:'ya-chi',ja:'ha',ht:'dan'}},
      {n:'langue',t:{en:'tongue',es:'lengua',de:'Zunge',ru:'yazyk',zh:'she',ja:'shita',ht:'lang'}},
      {n:'dos',t:{en:'back',es:'espalda',de:'Rücken',ru:'spina',zh:'bei',ja:'senaka',ht:'do'}},
    ]
  },
  objets_quotidien: {
    fr:'Petits Objets',en:'Small Items',es:'Objetos comunes',ht:'Ti bagay chak jou',de:'Alltagsgegenstände',ru:'Melkie veshchi',zh:'Riyongpin',ja:'Komono',
    icon:'🗝️',
    words:[
      {n:'clé',t:{en:'key',es:'llave',de:'Schlüssel',ru:'klyuch',zh:'yaoshi',ja:'kagi',ht:'kle'}},
      {n:'argent',t:{en:'money',es:'dinero',de:'Geld',ru:'dengi',zh:'qian',ja:'okane',ht:'lajan'}},
      {n:'stylo',t:{en:'pen',es:'pluma',de:'Stift',ru:'ruchka',zh:'bi',ja:'pen',ht:'plim'}},
      {n:'papier',t:{en:'paper',es:'papel',de:'Papier',ru:'bumaga',zh:'zhi',ja:'kami',ht:'papye'}},
      {n:'ciseaux',t:{en:'scissors',es:'tijeras',de:'Schere',ru:'nozhnitsy',zh:'jiandao',ja:'hasami',ht:'sizo'}},
      {n:'boîte',t:{en:'box',es:'caja',de:'Kiste',ru:'korobka',zh:'hezi',ja:'hako',ht:'bwit'}},
      {n:'sac',t:{en:'bag',es:'bolsa',de:'Tasche',ru:'sumka',zh:'bao',ja:'fukuro',ht:'sak'}},
      {n:'parapluie',t:{en:'umbrella',es:'paraguas',de:'Schirm',ru:'zont',zh:'yusan',ja:'kasa',ht:'parapli'}},
      {n:'montre',t:{en:'watch',es:'reloj',de:'Uhr',ru:'chasy',zh:'tokei',ja:'tokei',ht:'mont'}},
      {n:'lampe',t:{en:'lamp',es:'lámpara',de:'Lampe',ru:'lampa',zh:'deng',ja:'ranpu',ht:'lanp'}},
      {n:'lunettes',t:{en:'glasses',es:'gafas',de:'Brille',ru:'ochki',zh:'yanjing',ja:'megane',ht:'lunèt'}},
      {n:'miroir',t:{en:'mirror',es:'espejo',de:'Spiegel',ru:'zerkalo',zh:'jingzi',ja:'kagami',ht:'miwa'}},
      {n:'savon',t:{en:'soap',es:'jabón',de:'Seife',ru:'mylo',zh:'feizao',ja:'sekken',ht:'savon'}},
      {n:'peigne',t:{en:'comb',es:'peine',de:'Kamm',ru:'rascheska',zh:'shuzi',ja:'kushi',ht:'peyi'}},
      {n:'serviette',t:{en:'towel',es:'toalla',de:'Handtuch',ru:'polotentse',zh:'maojin',ja:'taoru',ht:'sèvyèt'}},
    ]
  },
  vie_marine: {
    fr:'Vie Marine',en:'Marine Life',es:'Vida marina',ht:'Lavi anba dlo',de:'Meerestiere',ru:'Morskaya zhizn',zh:'Haiyang shengwu',ja:'Kaiyo seibutsu',
    icon:'🌊',
    words:[
      {n:'poisson',t:{en:'fish',es:'pez',de:'Fisch',ru:'ryba',zh:'yu',ja:'sakana',ht:'pwason'}},
      {n:'requin',t:{en:'shark',es:'tiburón',de:'Hai',ru:'akula',zh:'shayu',ja:'same',ht:'requin'}},
      {n:'baleine',t:{en:'whale',es:'ballena',de:'Wal',ru:'kit',zh:'jing-yu',ja:'kujira',ht:'balèn'}},
      {n:'dauphin',t:{en:'dolphin',es:'delfín',de:'Delfin',ru:'delfin',zh:'haitun',ja:'iruka',ht:'dofen'}},
      {n:'pieuvre',t:{en:'octopus',es:'pulpo',de:'Krake',ru:'osminog',zh:'zhangyu',ja:'tako',ht:'chatrou'}},
      {n:'tortue',t:{en:'turtle',es:'tortuga',de:'Schildkröte',ru:'cherepakha',zh:'haigui',ja:'kame',ht:'toti'}},
      {n:'crabe',t:{en:'crab',es:'cangrejo',de:'Krabbe',ru:'krab',zh:'pangxie',ja:'kani',ht:'krab'}},
      {n:'crevette',t:{en:'shrimp',es:'camarón',de:'Garnele',ru:'krevetka',zh:'xia',ja:'ebi',ht:'krevèt'}},
      {n:'étoile de mer',t:{en:'starfish',es:'estrella de mar',de:'Seestern',ru:'morskaya zvezda',zh:'haixing',ja:'hitode',ht:'zetwal lanmè'}},
      {n:'corail',t:{en:'coral',es:'coral',de:'Koralle',ru:'korall',zh:'shanhū',ja:'sango',ht:'koray'}},
      {n:'coquillage',t:{en:'shell',es:'concha',de:'Muschel',ru:'rakushka',zh:'beike',ja:'kai',ht:'koki'}},
      {n:'algue',t:{en:'seaweed',es:'alga',de:'Alge',ru:'vodorosli',zh:'haizao',ja:'kaiso',ht:'alg'}},
      {n:'vague',t:{en:'wave',es:'ola',de:'Welle',ru:'volna',zh:'lang',ja:'nami',ht:'vague'}},
      {n:'sel',t:{en:'salt',es:'sal',de:'Salz',ru:'sol',zh:'yan',ja:'shio',ht:'sèl'}},
      {n:'abysse',t:{en:'abyss',es:'abismo',de:'Abgrund',ru:'bezdna',zh:'shen-yuan',ja:'shinen',ht:'abis'}},
    ]
  },
  reussite_ambition: {
    fr:'Réussite',en:'Success',es:'Éxito',ht:'Siksè',de:'Erfolg',ru:'Uspekh',zh:'Chenggong',ja:'Seiko',
    icon:'🏆',
    words:[
      {n:'victoire',t:{en:'victory',es:'victoria',de:'Sieg',ru:'pobeda',zh:'shengli',ja:'shori',ht:'viktwa'}},
      {n:'objectif',t:{en:'goal',es:'objetivo',de:'Ziel',ru:'tsel',zh:'mubiao',ja:'mokuhyo',ht:'objektif'}},
      {n:'progrès',t:{en:'progress',es:'progreso',de:'Fortschritt',ru:'progress',zh:'jinbu',ja:'shinpo',ht:'pwogrè'}},
      {n:'effort',t:{en:'effort',es:'esfuerzo',de:'Anstrengung',ru:'usilie',zh:'nuli',ja:'doryoku',ht:'efò'}},
      {n:'talent',t:{en:'talent',es:'talento',de:'Talent',ru:'talant',zh:'cai-hua',ja:'sainou',ht:'talan'}},
      {n:'rêve',t:{en:'dream',es:'sueño',de:'Traum',ru:'mechta',zh:'mengxiang',ja:'yume',ht:'rèv'}},
      {n:'travail',t:{en:'work',es:'trabajo',de:'Arbeit',ru:'rabota',zh:'gongzuo',ja:'shigoto',ht:'travay'}},
      {n:'fierté',t:{en:'pride',es:'orgullo',de:'Stolz',ru:'gordost',zh:'zihao',ja:'hokori',ht:'fyète'}},
      {n:'pouvoir',t:{en:'power',es:'poder',de:'Macht',ru:'vlast',zh:'quanli',ja:'chikara',ht:'pouvwa'}},
      {n:'sommet',t:{en:'summit',es:'cumbre',de:'Gipfel',ru:'vershina',zh:'dingfeng',ja:'chojo',ht:'somè'}},
      {n:'patience',t:{en:'patience',es:'paciencia',de:'Geduld',ru:'terpenie',zh:'naixin',ja:'nintai',ht:'pasyans'}},
      {n:'destin',t:{en:'destiny',es:'destino',de:'Schicksal',ru:'sudba',zh:'mingyun',ja:'unmei',ht:'desten'}},
      {n:'mission',t:{en:'mission',es:'misión',de:'Mission',ru:'missiya',zh:'renwu',ja:'shimei',ht:'misyon'}},
      {n:'génie',t:{en:'genius',es:'genio',de:'Genie',ru:'geniy',zh:'tian-cai',ja:'tensai',ht:'jeni'}},
      {n:'avenir',t:{en:'future',es:'futuro',de:'Zukunft',ru:'budushchee',zh:'weilai',ja:'mirai',ht:'lavni'}},
    ]
  },
  batiment_pieces_maison: {
    fr:'Bâtiment & Pièces',en:'Building & Rooms',es:'Edificio',ht:'Kay ak Chanm',de:'Gebäude',ru:'Zdanic',zh:'Jianzhu',ja:'Tatemono',
    icon:'🏠',
    words:[
      {n:'salon',t:{en:'living room',es:'sala',de:'Wohnzimmer',ru:'gostinaya',zh:'keting',ja:'ribingu',ht:'salon'}},
      {n:'cuisine',t:{en:'kitchen',es:'cocina',de:'Küche',ru:'kukhnya',zh:'chufang',ja:'daidokoro',ht:'kizin'}},
      {n:'chambre',t:{en:'bedroom',es:'dormitorio',de:'Schlafzimmer',ru:'spalnya',zh:'woshi',ja:'shinsitsu',ht:'chanm'}},
      {n:'toit',t:{en:'roof',es:'roof',de:'Dach',ru:'krysha',zh:'wuding',ja:'yane',ht:'twat'}},
      {n:'mur',t:{en:'wall',es:'pared',de:'Wand',ru:'stena',zh:'qiang',ja:'kabe',ht:'mir'}},
      {n:'sol',t:{en:'floor',es:'suelo',de:'Boden',ru:'pol',zh:'diban',ja:'yuka',ht:'atè'}},
      {n:'plafond',t:{en:'ceiling',es:'techo',de:'Decke',ru:'potolok',zh:'tiandehua',ja:'tenjo',ht:'plafon'}},
      {n:'fenêtre',t:{en:'window',es:'ventana',de:'Fenster',ru:'okno',zh:'chuanghu',ja:'mado',ht:'fenèt'}},
      {n:'porte',t:{en:'door',es:'puerta',de:'Tür',ru:'dver',zh:'men',ja:'doa',ht:'pòt'}},
      {n:'escalier',t:{en:'stairs',es:'escaleras',de:'Treppe',ru:'lestnitsa',zh:'lou-ti',ja:'kaidan',ht:'eskalyè'}},
      {n:'balcon',t:{en:'balcony',es:'balcón',de:'Balkon',ru:'balkon',zh:'yangtai',ja:'barukoni',ht:'balkon'}},
      {n:'couloir',t:{en:'hallway',es:'pasillo',de:'Flur',ru:'koridor',zh:'zoulang',ja:'roka',ht:'koulwa'}},
      {n:'cave',t:{en:'basement',es:'sótano',de:'Keller',ru:'podval',zh:'dixiashi',ja:'chika',ht:'kav'}},
      {n:'grenier',t:{en:'attic',es:'ático',de:'Dachboden',ru:'cherdak',zh:'gelou',ja:'yaneura',ht:'grenye'}},
      {n:'jardin',t:{en:'garden',es:'jardín',de:'Garten',ru:'sad',zh:'huayuan',ja:'niwa',ht:'jaden'}},
    ]
  },
  outils_bricolage: {
    fr:'Outils',en:'Tools',es:'Herramientas',ht:'Zouti',de:'Werkzeuge',ru:'Instrumenty',zh:'Gongju',ja:'Dogu',
    icon:'🛠️',
    words:[
      {n:'marteau',t:{en:'hammer',es:'martillo',de:'Hammer',ru:'molotok',zh:'chuizi',ja:'hanma',ht:'mato'}},
      {n:'tournevis',t:{en:'screwdriver',es:'destornillador',de:'Schraubenzieher',ru:'otvertka',zh:'luosidao',ja:'doraiba',ht:'tounvis'}},
      {n:'clou',t:{en:'nail',es:'clavo',de:'Nagel',ru:'gvozd',zh:'dingzi',ja:'kugi',ht:'klou'}},
      {n:'vis',t:{en:'screw',es:'tornillo',de:'Schraube',ru:'vint',zh:'luosi',ja:'neji',ht:'vis'}},
      {n:'scie',t:{en:'saw',es:'sierra',de:'Säge',ru:'pila',zh:'juzi',ja:'nokogiri',ht:'goinn'}},
      {n:'pince',t:{en:'pliers',es:'alicates',de:'Zange',ru:'ploskogubtsy',zh:'qianzi',ja:'penchi',ht:'pince'}},
      {n:'échelle',t:{en:'ladder',es:'escalera',de:'Leiter',ru:'lestnitsa',zh:'ti-zi',ja:'hashigo',ht:'echèl'}},
      {n:'colle',t:{en:'glue',es:'pegamento',de:'Kleber',ru:'kley',zh:'jiaoshui',ja:'setchaku-zai',ht:'kòl'}},
      {n:'peinture',t:{en:'paint',es:'pintura',de:'Farbe',ru:'kraska',zh:'youqi',ja:'penki',ht:'pentu'}},
      {n:'pinceau',t:{en:'brush',es:'pincel',de:'Pinsel',ru:'kist',zh:'huabi',ja:'fude',ht:'pienso'}},
      {n:'mesure',t:{en:'tape measure',es:'cinta métrica',de:'Maßband',ru:'ruletka',zh:'juan-chi',ja:'mekari',ht:'mizir'}},
      {n:'perceuse',t:{en:'drill',es:'taladro',de:'Bohrer',ru:'drel',zh:'zuan-ji',ja:'doriru',ht:'pès'}},
      {n:'pelle',t:{en:'shovel',es:'pala',de:'Schaufel',ru:'lopata',zh:'chan-zi',ja:'shaberu',ht:'pèl'}},
      {n:'hache',t:{en:'axe',es:'hacha',de:'Axt',ru:'topor',zh:'fu-zi',ja:'ono',ht:'hach'}},
      {n:'râteau',t:{en:'rake',es:'rastrillo',de:'Rechen',ru:'grabli',zh:'pazi',ja:'kumade',ht:'rato'}},
    ]
  },
  textures_matieres: {
    fr:'Textures',en:'Textures',es:'Texturas',ht:'Teksti ak Matyè',de:'Texturen',ru:'Tekstury',zh:'Zhi-di',ja:'Shokkan',
    icon:'🧶',
    words:[
      {n:'doux',t:{en:'soft',es:'suave',de:'weich',ru:'myagkiy',zh:'ruan',ja:'yawarakai',ht:'mou'}},
      {n:'dur',t:{en:'hard',es:'duro',de:'hart',ru:'tverdyy',zh:'ying',ja:'katai',ht:'di'}},
      {n:'lisse',t:{en:'smooth',es:'liso',de:'glatt',ru:'gladkiy',zh:'guanghua',ja:'nameraka',ht:'lis'}},
      {n:'rugueux',t:{en:'rough',es:'rugoso',de:'rau',ru:'sherokhovatyy',zh:'caocao',ja:'zarazara',ht:'rèch'}},
      {n:'sec',t:{en:'dry',es:'seco',de:'trocken',ru:'sukhoy',zh:'gan',ja:'kawaita',ht:'sèk'}},
      {n:'mouillé',t:{en:'wet',es:'mojado',de:'nass',ru:'mokryy',zh:'shi',ja:'nureta',ht:'mouye'}},
      {n:'chaud',t:{en:'hot',es:'caliente',de:'heiß',ru:'goryachiy',zh:'re',ja:'atsui',ht:'cho'}},
      {n:'froid',t:{en:'cold',es:'frío',de:'kalt',ru:'kholodnyy',zh:'leng',ja:'tsumetai',ht:'frèt'}},
      {n:'collant',t:{en:'sticky',es:'pegajoso',de:'klebrig',ru:'lipkiy',zh:'zhan',ja:'nebancba',ht:'kole'}},
      {n:'épais',t:{en:'thick',es:'grueso',de:'dick',ru:'tolstyy',zh:'hou',ja:'atsui',ht:'pwès'}},
      {n:'mince',t:{en:'thin',es:'delgado',de:'dünn',ru:'tonkiy',zh:'bao',ja:'usui',ht:'mens'}},
      {n:'solide',t:{en:'solid',es:'sólido',de:'fest',ru:'tverdyy',zh:'gutai',ja:'kotai',ht:'solid'}},
      {n:'liquide',t:{en:'liquid',es:'líquido',de:'flüssig',ru:'zhidkiy',zh:'yeti',ja:'ekitai',ht:'likid'}},
      {n:'gaz',t:{en:'gas',es:'gas',de:'gasförmig',ru:'gazoobraznyy',zh:'qi-ti',ja:'kitai',ht:'gaz'}},
      {n:'poussière',t:{en:'dusty',es:'polvoriento',de:'staubig',ru:'pylnyy',zh:'youhuichen',ja:'hokori-ppoi',ht:'pousyè'}},
    ]
  },
  verbes_communication: {
    fr:'Communiquer',en:'Communicate',es:'Comunicar',ht:'Kominike',de:'Kommunizieren',ru:'Obshchatsya',zh:'Goutong',ja:'Tsutaeru',
    icon:'🗣️',
    words:[
      {n:'dire',t:{en:'say',es:'decir',de:'sagen',ru:'skazat',zh:'shuo',ja:'iu',ht:'di'}},
      {n:'demander',t:{en:'ask',es:'preguntar',de:'fragen',ru:'sprosit',zh:'wen',ja:'tazuneru',ht:'mande'}},
      {n:'répondre',t:{en:'answer',es:'responder',de:'antworten',ru:'otvetit',zh:'huidá',ja:'kotaeru',ht:'reponn'}},
      {n:'expliquer',t:{en:'explain',es:'explicar',de:'erklären',ru:'obyasnit',zh:'jieshi',ja:'setsumei suru',ht:'esplike'}},
      {n:'appeler',t:{en:'call',es:'llamar',de:'rufen',ru:'zvat',zh:'dadianhua',ja:'yobu',ht:'rele'}},
      {n:'discuter',t:{en:'discuss',es:'discutir',de:'diskutieren',ru:'obsuzhdat',zh:'taolun',ja:'giron suru',ht:'diskite'}},
      {n:'chanter',t:{en:'sing',es:'cantar',de:'singen',ru:'pet',zh:'chang',ja:'utau',ht:'chante'}},
      {n:'crier',t:{en:'shout',es:'gritar',de:'schreien',ru:'krichat',zh:'han',ja:'sakebu',ht:'rele fò'}},
      {n:'chuchoter',t:{en:'whisper',es:'susurrar',de:'flüstern',ru:'sheptat',zh:'ershuo',ja:'sasayaku',ht:'pale dous'}},
      {n:'promettre',t:{en:'promise',es:'prometer',de:'versprechen',ru:'obeshchat',zh:'chengnuo',ja:'yakusoku suru',ht:'pwomèt'}},
      {n:'mentir',t:{en:'lie',es:'mentir',de:'lügen',ru:'lgat',zh:'shuo-huang',ja:'uso o tsuku',ht:'bay manti'}},
      {n:'conseiller',t:{en:'advise',es:'aconsejar',de:'beraten',ru:'sovetovat',zh:'jianyi',ja:'adobaisu suru',ht:'konseye'}},
      {n:'remercier',t:{en:'thank',es:'agradecer',de:'danken',ru:'blagodarit',zh:'ganxie',ja:'kansha suru',ht:'di mèsi'}},
      {n:'saluer',t:{en:'greet',es:'saludar',de:'grüßen',ru:'privetstvovat',zh:'wenhou',ja:'aisatsu suru',ht:'salye'}},
      {n:'écouter',t:{en:'listen',es:'escuchar',de:'zuhören',ru:'slushat',zh:'ting',ja:'kiku',ht:'tande'}},
    ]
  },
  divertissement_lieux: {
    fr:'Lieux de Loisirs',en:'Entertainment',es:'Ocio',ht:'Lye lwazi',de:'Unterhaltung',ru:'Razvlecheniya',zh:'Yule',ja:'Goraku',
    icon:'🍿',
    words:[
      {n:'cinéma',t:{en:'cinema',es:'cine',de:'Kino',ru:'kino',zh:'dianyingyuan',ja:'eigakan',ht:'sinema'}},
      {n:'théâtre',t:{en:'theater',es:'teatro',de:'Theater',ru:'teatr',zh:'juyuan',ja:'gekijō',ht:'teat'}},
      {n:'musée',t:{en:'museum',es:'museo',de:'Museum',ru:'muzey',zh:'bowuguan',ja:'hakubutsukan',ht:'mize'}},
      {n:'parc',t:{en:'park',es:'parque',de:'Park',ru:'park',zh:'gongyuan',ja:'koen',ht:'pak'}},
      {n:'plage',t:{en:'beach',es:'playa',de:'Strand',ru:'plyazh',zh:'haitan',ja:'hama',ht:'plaj'}},
      {n:'piscine',t:{en:'pool',es:'piscina',de:'Schwimmbad',ru:'basseyn',zh:'youyongchi',ja:'puru',ht:'pisinn'}},
      {n:'zoo',t:{en:'zoo',es:'zoo',de:'Zoo',ru:'zoopark',zh:'dongwuyuan',ja:'dobutsukan',ht:'zo'}},
      {n:'bibliothèque',t:{en:'library',es:'biblioteca',de:'Bibliothek',ru:'biblioteka',zh:'tushuguan',ja:'toshokan',ht:'bibliyotèk'}},
      {n:'restaurant',t:{en:'restaurant',es:'restaurante',de:'Restaurant',ru:'restoran',zh:'fanguan',ja:'resutoran',ht:'restoran'}},
      {n:'café',t:{en:'cafe',es:'café',de:'Café',ru:'kafe',zh:'kafeiguan',ja:'kafe',ht:'kafe'}},
      {n:'boîte de nuit',t:{en:'club',es:'club',de:'Nachtclub',ru:'nochnoy klub',zh:'yidubao',ja:'kurabu',ht:'klèb'}},
      {n:'stade',t:{en:'stadium',es:'estadio',de:'Stadion',ru:'stadion',zh:'tiyuchang',ja:'kyugijo',ht:'stad'}},
      {n:'foire',t:{en:'fair',es:'feria',de:'Jahrmarkt',ru:'yarmarka',zh:'miao-hui',ja:'omatsuri',ht:'fwa'}},
      {n:'cirque',t:{en:'circus',es:'circo',de:'Zirkus',ru:'tsirk',zh:'maxituan',ja:'sakasu',ht:'sirk'}},
      {n:'concert',t:{en:'concert',es:'concierto',de:'Konzert',ru:'kontsert',zh:'yinyuehui',ja:'konsato',ht:'konsè'}},
    ]
  },
  doute_reflexion: {
    fr:'Doute & Pensée',en:'Doubt & Thought',es:'Duda',ht:'Dout ak Refleksyon',de:'Zweifel',ru:'Somnenie',zh:'Huaiyi',ja:'Utagai',
    icon:'🤔',
    words:[
      {n:'doute',t:{en:'doubt',es:'duda',de:'Zweifel',ru:'somnenie',zh:'huaiyi',ja:'utagai',ht:'dout'}},
      {n:'vérité',t:{en:'truth',es:'verdad',de:'Wahrheit',ru:'pravda',zh:'zhenxiang',ja:'shinjitsu',ht:'verite'}},
      {n:'mensonge',t:{en:'lie',es:'mentira',de:'Lüge',ru:'lozh',zh:'huangyan',ja:'uso',ht:'manti'}},
      {n:'idée',t:{en:'idea',es:'idea',de:'Idee',ru:'ideya',zh:'zhuyi',ja:'aidea',ht:'ide'}},
      {n:'secret',t:{en:'secret',es:'secreto',de:'Geheimnis',ru:'sekret',zh:'mimi',ja:'himitsu',ht:'sekre'}},
      {n:'logique',t:{en:'logic',es:'lógica',de:'Logik',ru:'logika',zh:'luoji',ja:'ronri',ht:'lojik'}},
      {n:'raison',t:{en:'reason',es:'razón',de:'Grund',ru:'prichina',zh:'yuanyin',ja:'riyu',ht:'rezon'}},
      {n:'mystère',t:{en:'mystery',es:'misterio',de:'Rätsel',ru:'tayna',zh:'mí',ja:'nazotoki',ht:'mister'}},
      {n:'preuve',t:{en:'proof',es:'prueba',de:'Beweis',ru:'dokazatelstvo',zh:'zhengju',ja:'shoko',ht:'prèv'}},
      {n:'avis',t:{en:'opinion',es:'opinión',de:'Meinung',ru:'mnenie',zh:'yijian',ja:'iken',ht:'opinyon'}},
      {n:'choix',t:{en:'choice',es:'opción',de:'Wahl',ru:'vybor',zh:'xuanze',ja:'sentaku',ht:'chwa'}},
      {n:'décision',t:{en:'decision',es:'decisión',de:'Entscheidung',ru:'reshenie',zh:'jueding',ja:'ketsudan',ht:'desizyon'}},
      {n:'mémoire',t:{en:'memory',es:'memoria',de:'Erinnerung',ru:'pamyat',zh:'jiyi',ja:'kioku',ht:'memwa'}},
      {n:'oubli',t:{en:'forgetfulness',es:'olvido',de:'Vergessen',ru:'zabvenie',zh:'yiwang',ja:'wasure',ht:'bliye'}},
      {n:'sagesse',t:{en:'wisdom',es:'sabiduría',de:'Weisheit',ru:'mudrost',zh:'zhihui',ja:'chie',ht:'sajès'}},
    ]
  },
  logiciel_code: {
    fr:'Logiciel & Code',en:'Software & Code',es:'Software',ht:'Lojisyèl ak Kòd',de:'Software',ru:'Programmnoe obespechenie',zh:'Ruanjian',ja:'Sofutowea',
    icon:'💻',
    words:[
      {n:'variable',t:{en:'variable',es:'variable',de:'Variable',ru:'peremennaya',zh:'bianliang',ja:'hensu',ht:'varyab'}},
      {n:'boucle',t:{en:'loop',es:'bucle',de:'Schleife',ru:'tsikl',zh:'xunhuan',ja:'rupu',ht:'bouk'}},
      {n:'fonction',t:{en:'function',es:'función',de:'Funktion',ru:'funktsiya',zh:'hanshu',ja:'kanshu',ht:'fonksyon'}},
      {n:'erreur',t:{en:'error',es:'error',de:'Fehler',ru:'oshibka',zh:'cuowu',ja:'era',ht:'erè'}},
      {n:'serveur',t:{en:'server',es:'servidor',de:'Server',ru:'server',zh:'fuwuqi',ja:'saba',ht:'sèvè'}},
      {n:'base de données',t:{en:'database',es:'base de datos',de:'Datenbank',ru:'baza dannykh',zh:'shujuku',ja:'detabesu',ht:'bazdone'}},
      {n:'requête',t:{en:'request',es:'petición',de:'Anfrage',ru:'zapros',zh:'qingqiu',ja:'rikuesto',ht:'reket'}},
      {n:'affichage',t:{en:'display',es:'pantalla',de:'Anzeige',ru:'displey',zh:'xianshi',ja:'hyoji',ht:'afichaj'}},
      {n:'stockage',t:{en:'storage',es:'almacenamiento',de:'Speicher',ru:'khranilishche',zh:'chuncun',ja:'sutoreji',ht:'stokaj'}},
      {n:'sécurité',t:{en:'security',es:'seguridad',de:'Sicherheit',ru:'bezopasnost',zh:'anquan',ja:'sekyuriti',ht:'sekirite'}},
      {n:'interface',t:{en:'interface',es:'interfaz',de:'Schnittstelle',ru:'interfeys',zh:'jicmian',ja:'intafesu',ht:'entèfas'}},
      {n:'utilisateur',t:{en:'user',es:'usuario',de:'Benutzer',ru:'polzovatel',zh:'yonghu',ja:'yūza',ht:'itilizatè'}},
      {n:'mot de passe',t:{en:'password',es:'contraseña',de:'Passwort',ru:'parol',zh:'mima',ja:'pasuwado',ht:'motdepas'}},
      {n:'téléchargement',t:{en:'download',es:'descarga',de:'Download',ru:'zagruzka',zh:'xiazai',ja:'daunrodo',ht:'telechajman'}},
      {n:'connexion',t:{en:'connection',es:'conexión',de:'Verbindung',ru:'soedinenie',zh:'lianjie',ja:'setsuzoku',ht:'koneksyon'}},
    ]
  },
  sante_symptomes: {
    fr:'Symptômes',en:'Symptoms',es:'Síntomas',ht:'Sentòm',de:'Symptome',ru:'Simptomy',zh:'Zhengzhuang',ja:'Shojo',
    icon:'🤒',
    words:[
      {n:'fièvre',t:{en:'fever',es:'fiebre',de:'Fieber',ru:'likhoradka',zh:'fashao',ja:'netsu',ht:'fyèv'}},
      {n:'toux',t:{en:'cough',es:'tos',de:'Husten',ru:'kashel',zh:'kesou',ja:'seki',ht:'touse'}},
      {n:'rhume',t:{en:'cold',es:'resfriado',de:'Erkältung',ru:'prostuda',zh:'ganmao',ja:'kaze',ht:'grip'}},
      {n:'fatigue',t:{en:'fatigue',es:'fatiga',de:'Müdigkeit',ru:'ustalost',zh:'pilao',ja:'tsukare',ht:'fatig'}},
      {n:'vertige',t:{en:'dizziness',es:'mareo',de:'Schwindel',ru:'golovokruzhenie',zh:'xuan-yun',ja:'mema-i',ht:'toudi'}},
      {n:'nausée',t:{en:'nausea',es:'náusea',de:'Übelkeit',ru:'toshnota',zh:'e-xin',ja:'hakike',ht:'kè plen'}},
      {n:'allergie',t:{en:'allergy',es:'alergia',de:'Allergie',ru:'allergiya',zh:'guomin',ja:'arerugi',ht:'alèji'}},
      {n:'blessure',t:{en:'injury',es:'herida',de:'Verletzung',ru:'travma',zh:'shoushang',ja:'kega',ht:'blesi'}},
      {n:'cicatrice',t:{en:'scar',es:'cicatriz',de:'Narbe',ru:'shram',zh:'bahen',ja:'kizuato',ht:'sikatri'}},
      {n:'enflure',t:{en:'swelling',es:'hinchazón',de:'Schwellung',ru:'otek',zh:'zhongzhang',ja:'hare',ht:'anfle'}},
      {n:'infection',t:{en:'infection',es:'infección',de:'Infektion',ru:'infektsiya',zh:'ganran',ja:'kansen',ht:'enfeksyon'}},
      {n:'sommeil',t:{en:'sleep',es:'sueño',de:'Schlaf',ru:'son',zh:'shuimian',ja:'suimin',ht:'dòmi'}},
      {n:'appétit',t:{en:'appetite',es:'apetito',de:'Appetit',ru:'appetit',zh:'wei-kou',ja:'shokuyoku',ht:'apetit'}},
      {n:'pouls',t:{en:'pulse',es:'pulso',de:'Puls',ru:'puls',zh:'maibo',ja:'myakuhaku',ht:'pou'}},
      {n:'guérison',t:{en:'healing',es:'curación',de:'Heilung',ru:'istselenie',zh:'yuhe',ja:'chiyu',ht:'gerizon'}},
    ]
  },
  personnalite_traits: {
    fr:'Personnalité',en:'Personality',es:'Personalidad',ht:'Pèsonalite',de:'Persönlichkeit',ru:'Lichnost',zh:'Ge-xing',ja:'Seikaku',
    icon:'🧠',
    words:[
      {n:'gentil',t:{en:'kind',es:'amable',de:'nett',ru:'dobryy',zh:'qin-qie',ja:'yasashii',ht:'jan-ti'}},
      {n:'intelligent',t:{en:'smart',es:'inteligente',de:'klug',ru:'umnyy',zh:'congming',ja:'kashikoi',ht:'entelijan'}},
      {n:'drôle',t:{en:'funny',es:'divertido',de:'lustig',ru:'smeshnoy',zh:'youmo',ja:'okashii',ht:'komik'}},
      {n:'honnête',t:{en:'honest',es:'honesto',de:'ehrlich',ru:'chestnyy',zh:'chengshi',ja:'shojiki',ht:'onèt'}},
      {n:'calme',t:{en:'calm',es:'tranquilo',de:'ruhig',ru:'spokoynyy',zh:'zhenjing',ja:'odayaka',ht:'kalm'}},
      {n:'curieux',t:{en:'curious',es:'curioso',de:'neugierig',ru:'lyuboznatelnyy',zh:'haoqi',ja:'koukishin',ht:'kerye'}},
      {n:'sérieux',t:{en:'serious',es:'serio',de:'ernst',ru:'seryoznyy',zh:'yansu',ja:'majime',ht:'serye'}},
        {n:'généreux',t:{en:'generous',es:'generoso',de:'großzügig',ru:'shchedryy',zh:'kangkai',ja:'kandai',ht:'jenere'}},
      {n:'timide',t:{en:'shy',es:'tímido',de:'schüchtern',ru:'zastenchivyy',zh:'haixiu',ja:'hazukashigariya',ht:'timid'}},
      {n:'ambitieux',t:{en:'ambitious',es:'ambicioso',de:'ehrgeizig',ru:'ambitsioznyy',zh:'xionxin',ja:'yashinteki',ht:'anbisye'}},
      {n:'créatif',t:{en:'creative',es:'creativo',de:'kreativ',ru:'tvorcheskiy',zh:'chuangzuo',ja:'sozoteki',ht:'kreyatif'}},
      {n:'patient',t:{en:'patient',es:'paciente',de:'geduldig',ru:'terpelivyy',zh:'naixin',ja:'nintaizuyoi',ht:'pasyan'}},
      {n:'fier',t:{en:'proud',es:'orgulloso',de:'stolz',ru:'gordyy',zh:'zihao',ja:'hokori',ht:'fye'}},
      {n:'bavard',t:{en:'talkative',es:'hablador',de:'gesprächig',ru:'razgovorchivyy',zh:'duozui',ja:'oshaberi',ht:'bavad'}},
      {n:'sage',t:{en:'wise',es:'sabio',de:'weise',ru:'mudryy',zh:'mingzhi',ja:'kenmei',ht:'saj'}},
    ]
  },
  vegetation_nature: {
    fr:'Végétation',en:'Vegetation',es:'Vegetación',ht:'Vesejetasyon',de:'Vegetation',ru:'Rastitelnost',zh:'Zhi-bei',ja:'Shokusei',
    icon:'🌿',
    words:[
      {n:'arbre',t:{en:'tree',es:'árbol',de:'Baum',ru:'derevo',zh:'shu',ja:'ki',ht:'pyebwa'}},
      {n:'fleur',t:{en:'flower',es:'flor',de:'Blume',ru:'tsvetok',zh:'hua',ja:'hana',ht:'flè'}},
      {n:'feuille',t:{en:'leaf',es:'hoja',de:'Blatt',ru:'list',zh:'yezi',ja:'happa',ht:'fèy'}},
      {n:'racine',t:{en:'root',es:'raíz',de:'Wurzel',ru:'koren',zh:'gen',ja:'ne',ht:'rasinn'}},
      {n:'herbe',t:{en:'grass',es:'hierba',de:'Gras',ru:'trava',zh:'cao',ja:'kusa',ht:'gerbe'}},
      {n:'forêt',t:{en:'forest',es:'bosque',de:'Wald',ru:'les',zh:'senlin',ja:'mori',ht:'fore'}},
      {n:'branche',t:{en:'branch',es:'rama',de:'Ast',ru:'vetka',zh:'shuzhi',ja:'eda',ht:'branch'}},
      {n:'graine',t:{en:'seed',es:'semilla',de:'Samen',ru:'semya',zh:'zhongzi',ja:'tane',ht:'grenn'}},
      {n:'fruit',t:{en:'fruit',es:'fruta',de:'Frucht',ru:'frukt',zh:'shuiguo',ja:'kudamono',ht:'fwi'}},
      {n:'buisson',t:{en:'bush',es:'arbusto',de:'Busch',ru:'kust',zh:'guanmu',ja:'yabu',ht:'bouson'}},
      {n:'tronc',t:{en:'trunk',es:'tronco',de:'Stamm',ru:'stvol',zh:'shugan',ja:'mikki',ht:'tronk'}},
      {n:'jungle',t:{en:'jungle',es:'selva',de:'Dschungel',ru:'dzhungli',zh:'conglin',ja:'janguru',ht:'jeng'}},
      {n:'champignon',t:{en:'mushroom',es:'hongo',de:'Pilz',ru:'grib',zh:'mogu',ja:'kinoko',ht:'chanpiyon'}},
      {n:'mousse',t:{en:'moss',es:'musgo',de:'Moos',ru:'mokh',zh:'taixian',ja:'koke',ht:'mous'}},
      {n:'épine',t:{en:'thorn',es:'espina',de:'Dorn',ru:'ship',zh:'ci',ja:'toge',ht:'pikan'}},
    ]
  },
  mouvement_physique: {
    fr:'Mouvement',en:'Movement',es:'Movimiento',ht:'Mouvman',de:'Bewegung',ru:'Dvizhenie',zh:'Yidong',ja:'Ugoki',
    icon:'🧗',
    words:[
      {n:'monter',t:{en:'climb/go up',es:'subir',de:'steigen',ru:'podnimatsya',zh:'shang',ja:'noboru',ht:'moute'}},
      {n:'descendre',t:{en:'descend',es:'bajar',de:'absteigen',ru:'spuskatsya',zh:'xia',ja:'oriru',ht:'desann'}},
      {n:'sauter',t:{en:'jump',es:'saltar',de:'springen',ru:'prygat',zh:'tiao',ja:'tobu',ht:'sote'}},
      {n:'tomber',t:{en:'fall',es:'caer',de:'fallen',ru:'padat',zh:'daoxia',ja:'ochiru',ht:'tonbe'}},
      {n:'pousser',t:{en:'push',es:'empujar',de:'drücken',ru:'tolkat',zh:'tui',ja:'osu',ht:'pouse'}},
      {n:'tirer',t:{en:'pull',es:'tirar',de:'ziehen',ru:'tyanut',zh:'la',ja:'hiku',ht:'tire'}},
      {n:'tourner',t:{en:'turn',es:'girar',de:'drehen',ru:'povernut',zh:'zhuan',ja:'mawaru',ht:'vire'}},
      {n:'soulever',t:{en:'lift',es:'levantar',de:'heben',ru:'podnyat',zh:'juqi',ja:'mochiageru',ht:'leve'}},
      {n:'porter',t:{en:'carry',es:'llevar',de:'tragen',ru:'nosti',zh:'na',ja:'hakobu',ht:'pote'}},
      {n:'lancer',t:{en:'throw',es:'lanzar',de:'werfen',ru:'brosat',zh:'tou',ja:'nageru',ht:'voye'}},
      {n:'attraper',t:{en:'catch',es:'atrapar',de:'fangen',ru:'lovit',zh:'zhua',ja:'tsukamaeru',ht:'kenbe'}},
      {n:'glisser',t:{en:'slide',es:'deslizar',de:'rutschen',ru:'skolzit',zh:'huadong',ja:'suberu',ht:'glise'}},
      {n:'danser',t:{en:'dance',es:'bailar',de:'tanzen',ru:'tantsovat',zh:'tiao-wu',ja:'odoru',ht:'danse'}},
      {n:'nager',t:{en:'swim',es:'nadar',de:'schwimmen',ru:'plavat',zh:'youyong',ja:'oyogu',ht:'naje'}},
      {n:'frapper',t:{en:'hit',es:'golpear',de:'schlagen',ru:'bit',zh:'da',ja:'utsu',ht:'frape'}},
    ]
  },
  objets_voyage: {
    fr:'Voyage (Objets)',en:'Travel Items',es:'Objetos de viaje',ht:'Bagay Vwayaj',de:'Reiseartikel',ru:'Veshchi dlya puteshestviy',zh:'Lv-xing yong-pin',ja:'Ryoko you-hin',
    icon:'🛂',
    words:[
      {n:'passeport',t:{en:'passport',es:'pasaporte',de:'Reisepass',ru:'pasport',zh:'huzhao',ja:'pasupoto',ht:'paspo'}},
      {n:'valise',t:{en:'suitcase',es:'maleta',de:'Koffer',ru:'chemodan',zh:'xingli-xiang',ja:'sutukesu',ht:'valiz'}},
      {n:'billet',t:{en:'ticket',es:'boleto',de:'Ticket',ru:'bilet',zh:'piao',ja:'kippu',ht:'tikè'}},
      {n:'carte',t:{en:'map',es:'mapa',de:'Karte',ru:'karta',zh:'ditu',ja:'chizu',ht:'kat'}},
      {n:'sac à dos',t:{en:'backpack',es:'mochila',de:'Rucksack',ru:'ryukzak',zh:'beibao',ja:'ryukkusakku',ht:'sakado'}},
      {n:'appareil photo',t:{en:'camera',es:'cámara',de:'Kamera',ru:'fotoapparat',zh:'zhaoxiangji',ja:'kamera',ht:'aparèy foto'}},
      {n:'guide',t:{en:'guide',es:'guía',de:'Führer',ru:'putevoditel',zh:'zhinan',ja:'gaidobon',ht:'gid'}},
      {n:'souvenir',t:{en:'souvenir',es:'recuerdo',de:'Souvenir',ru:'suvenir',zh:'jinianpin',ja:'omiyage',ht:'souvni'}},
      {n:'hôtel',t:{en:'hotel',es:'hotel',de:'Hotel',ru:'otel',zh:'jiudian',ja:'hoteru',ht:'otèl'}},
      {n:'aéroport',t:{en:'airport',es:'aeropuerto',de:'Flughafen',ru:'aeroport',zh:'jichang',ja:'kuko',ht:'ayewopò'}},
      {n:'gare',t:{en:'train station',es:'estación de tren',de:'Bahnhof',ru:'vokzal',zh:'huozhezhan',ja:'eki',ht:'estasyon'}},
      {n:'avion',t:{en:'airplane',es:'avión',de:'Flugzeug',ru:'samolet',zh:'feiji',ja:'hikoki',ht:'avion'}},
      {n:'bateau',t:{en:'boat',es:'barco',de:'Boot',ru:'lodka',zh:'chuan',ja:'fune',ht:'batiman'}},
      {n:'valise à roulettes',t:{en:'trolley',es:'trolley',de:'Rollkoffer',ru:'telezhka',zh:'shoutuiche',ja:'kyari-baggu',ht:'valiz a wou'}},
      {n:'destination',t:{en:'destination',es:'destino',de:'Ziel',ru:'punkt naznacheniya',zh:'mudi-di',ja:'mokutekichi',ht:'destinasyon'}},
    ]
  },
  electronique_bureau: {
    fr:'Électronique',en:'Electronics',es:'Electrónica',ht:'Elektwonik',de:'Elektronik',ru:'Elektronika',zh:'Dianzi',ja:'Denshi kiki',
    icon:'🖥️',
    words:[
      {n:'écran',t:{en:'screen',es:'pantalla',de:'Bildschirm',ru:'ekran',zh:'pumu',ja:'gamen',ht:'ekran'}},
      {n:'clavier',t:{en:'keyboard',es:'teclado',de:'Tastatur',ru:'klaviatura',zh:'jianpan',ja:'kibodo',ht:'klavye'}},
      {n:'souris',t:{en:'mouse',es:'ratón',de:'Maus',ru:'mysh',zh:'shubiao',ja:'mausu',ht:'souris'}},
      {n:'imprimante',t:{en:'printer',es:'impresora',de:'Drucker',ru:'printer',zh:'dayinji',ja:'purinta',ht:'enprimant'}},
      {n:'ordinateur',t:{en:'computer',es:'ordenador',de:'Computer',ru:'kompyuter',zh:'diannao',ja:'konpyuta',ht:'òdinatè'}},
      {n:'portable',t:{en:'laptop/phone',es:'portátil',de:'Handy/Laptop',ru:'noutbuk',zh:'shouji',ja:'keitai',ht:'pòtab'}},
      {n:'casque',t:{en:'headphones',es:'auriculares',de:'Kopfhörer',ru:'naushniki',zh:'erji',ja:'heddo-hon',ht:'kas'}},
      {n:'haut-parleur',t:{en:'speaker',es:'altavoz',de:'Lautsprecher',ru:'dinamik',zh:'yangshengqi',ja:'supika',ht:'fofalè'}},
      {n:'micro',t:{en:'microphone',es:'micrófono',de:'Mikrofon',ru:'mikrofon',zh:'maikefeng',ja:'maiku',ht:'mikro'}},
      {n:'chargeur',t:{en:'charger',es:'cargador',de:'Ladegerät',ru:'zaryadnoe',zh:'chongdianqi',ja:'judenki',ht:'chajè'}},
      {n:'câble',t:{en:'cable',es:'cable',de:'Kabel',ru:'kabel',zh:'dianlan',ja:'keburu',ht:'kab'}},
      {n:'clé USB',t:{en:'USB drive',es:'memoria USB',de:'USB-Stick',ru:'fleshka',zh:'u-pan',ja:'yuesubi',ht:'kle usb'}},
      {n:'appareil',t:{en:'device',es:'dispositivo',de:'Gerät',ru:'ustroystvo',zh:'shebei',ja:'sochi',ht:'aparèy'}},
      {n:'caméra',t:{en:'webcam',es:'cámara',de:'Kamera',ru:'kamera',zh:'shexiangtou',ja:'kamera',ht:'kamera'}},
      {n:'routeur',t:{en:'router',es:'router',de:'Router',ru:'router',zh:'luyouqi',ja:'ruta',ht:'routeur'}},
    ]
  },
  perception_sens: {
    fr:'Sens & Perception',en:'Perception',es:'Percepción',ht:'Pèsepsyon',de:'Wahrnehmung',ru:'Vospriyatie',zh:'Ganzhi',ja:'Chinkaku',
    icon:'👀',
    words:[
      {n:'voir',t:{en:'see',es:'ver',de:'sehen',ru:'videt',zh:'kan',ja:'miru',ht:'wè'}},
      {n:'entendre',t:{en:'hear',es:'oír',de:'hören',ru:'slyshat',zh:'tingdao',ja:'kiku',ht:'tande'}},
      {n:'sentir',t:{en:'smell/feel',es:'oler/sentir',de:'riechen/fühlen',ru:'nyukhat',zh:'wen',ja:'kagu',ht:'santi'}},
      {n:'goûter',t:{en:'taste',es:'probar',de:'schmecken',ru:'probovat',zh:'chang',ja:'ajiwau',ht:'goite'}},
      {n:'toucher',t:{en:'touch',es:'tocar',de:'berühren',ru:'trogat',zh:'mo',ja:'sawaru',ht:'touche'}},
      {n:'regarder',t:{en:'look',es:'mirar',de:'schauen',ru:'smotret',zh:'kan',ja:'nagameru',ht:'gadé'}},
      {n:'écouter',t:{en:'listen',es:'escuchar',de:'zuhören',ru:'slushat',zh:'ting',ja:'kiku',ht:'tande'}},
      {n:'observer',t:{en:'observe',es:'observar',de:'beobachten',ru:'nablyudat',zh:'guancha',ja:'kansatsu',ht:'obsève'}},
      {n:'remarquer',t:{en:'notice',es:'notar',de:'bemerken',ru:'zametit',zh:'zhuyi',ja:'kizuku',ht:'remake'}},
      {n:'imaginer',t:{en:'imagine',es:'imaginar',de:'vorstellen',ru:'voobrazit',zh:'xiangxiang',ja:'sozo suru',ht:'imajine'}},
      {n:'paraître',t:{en:'appear',es:'aparecer',de:'erscheinen',ru:'kazatsya',zh:'xiande',ja:'arawareru',ht:'parèt'}},
      {n:'reconnaître',t:{en:'recognize',es:'reconocer',de:'erkennen',ru:'uznat',zh:'ren-chu',ja:'mitomeru',ht:'rekonèt'}},
      {n:'deviner',t:{en:'guess',es:'adivinar',de:'raten',ru:'ugadat',zh:'cai',ja:'ateru',ht:'devine'}},
      {n:'sembler',t:{en:'seem',es:'parecer',de:'scheinen',ru:'kazatsya',zh:'xiande',ja:'mieru',ht:'sanmble'}},
      {n:'distinguer',t:{en:'distinguish',es:'distinguir',de:'unterscheiden',ru:'razlichat',zh:'bianbie',ja:'kubetsu suru',ht:'distenge'}},
    ]
  },
  mode_accessoires: {
    fr:'Accessoires',en:'Accessories',es:'Accesorios',ht:'Akseswa',de:'Accessoires',ru:'Aksessuary',zh:'Peishi',ja:'Akusesari',
    icon:'🕶️',
    words:[
      {n:'lunettes',t:{en:'glasses',es:'gafas',de:'Brille',ru:'ochki',zh:'yanjing',ja:'megane',ht:'lunèt'}},
      {n:'montre',t:{en:'watch',es:'reloj',de:'Uhr',ru:'chasy',zh:'shoubiao',ja:'tokei',ht:'mont'}},
      {n:'sac à main',t:{en:'handbag',es:'bolso',de:'Handtasche',ru:'sumka',zh:'shoutibaobao',ja:'handobaggu',ht:'sakamenn'}},
      {n:'ceinture',t:{en:'belt',es:'cinturón',de:'Gürtel',ru:'remen',zh:'yaodai',ja:'beruto',ht:'sentiron'}},
      {n:'chapeau',t:{en:'hat',es:'sombrero',de:'Hut',ru:'shlyapa',zh:'maozi',ja:'boshi',ht:'chapo'}},
      {n:'écharpe',t:{en:'scarf',es:'bufanda',de:'Schal',ru:'sharf',zh:'weijin',ja:'sharu',ht:'echap'}},
      {n:'gants',t:{en:'gloves',es:'guantes',de:'Handschuhe',ru:'perchatki',zh:'shoutao',ja:'tebukuro',ht:'gan'}},
      {n:'bijou',t:{en:'jewelry',es:'joya',de:'Schmuck',ru:'ukrashenie',zh:'zhubao',ja:'hoseki',ht:'bijou'}},
      {n:'collier',t:{en:'necklace',es:'collar',de:'Halskette',ru:'ozherelye',zh:'xianglian',ja:'nekkuresu',ht:'kolye'}},
      {n:'bague',t:{en:'ring',es:'anillo',de:'Ring',ru:'koltso',zh:'jiezhi',ja:'yubiwa',ht:'bag'}},
      {n:'boucle d\'oreille',t:{en:'earring',es:'pendiente',de:'Ohrring',ru:'serga',zh:'erhuan',ja:'piasu',ht:'zanno'}},
      {n:'parapluie',t:{en:'umbrella',es:'paraguas',de:'Schirm',ru:'zont',zh:'yusan',ja:'kasa',ht:'parapli'}},
      {n:'portefeuille',t:{en:'wallet',es:'cartera',de:'Brieftasche',ru:'koshelek',zh:'qianbao',ja:'saifu',ht:'pòtfèy'}},
      {n:'cravate',t:{en:'tie',es:'corbata',de:'Krawatte',ru:'galstuk',zh:'lingdai',ja:'nekutai',ht:'kravat'}},
      {n:'casquette',t:{en:'cap',es:'gorra',de:'Mütze',ru:'kepka',zh:'mao-zi',ja:'kyappu',ht:'kaskèt'}},
    ]
  },
  temps_frequence: {
    fr:'Fréquence',en:'Frequency',es:'Frecuencia',ht:'Frekans',de:'Häufigkeit',ru:'Chastota',zh:'Pinlv',ja:'Hindo',
    icon:'⏳',
    words:[
      {n:'toujours',t:{en:'always',es:'siempre',de:'immer',ru:'vsegda',zh:'zongshi',ja:'itsumo',ht:'toujou'}},
      {n:'souvent',t:{en:'often',es:'a menudo',de:'oft',ru:'chasto',zh:'changchang',ja:'yoku',ht:'souvan'}},
      {n:'parfois',t:{en:'sometimes',es:'a veces',de:'manchmal',ru:'inogda',zh:'youshihou',ja:'tokidoki',ht:'pafwa'}},
      {n:'rarement',t:{en:'rarely',es:'raramente',de:'selten',ru:'redko',zh:'hanjian',ja:'metta ni nai',ht:'rarmaman'}},
      {n:'jamais',t:{en:'never',es:'nunca',de:'nie',ru:'nikogda',zh:'congbu',ja:'kesshite nai',ht:'jamè'}},
      {n:'tous les jours',t:{en:'every day',es:'cada día',de:'jeden Tag',ru:'kazhdyy den',zh:'meitian',ja:'mainichi',ht:'chak jou'}},
      {n:'maintenant',t:{en:'now',es:'ahora',de:'jetzt',ru:'seychas',zh:'xianzai',ja:'ima',ht:'kounye a'}},
      {n:'bientôt',t:{en:'soon',es:'pronto',de:'bald',ru:'skoro',zh:'bu-jiu',ja:'sugu ni',ht:'talè'}},
      {n:'déjà',t:{en:'already',es:'ya',de:'schon',ru:'uzhe',zh:'yijing',ja:'sude ni',ht:'deja'}},
      {n:'encore',t:{en:'still/again',es:'todavía/otra vez',de:'noch/wieder',ru:'eshche',zh:'hai/zai',ja:'mada/mouichido',ht:'ankò'}},
      {n:'tard',t:{en:'late',es:'tarde',de:'spät',ru:'pozdno',zh:'wan',ja:'osoku',ht:'ta'}},
      {n:'tôt',t:{en:'early',es:'temprano',de:'früh',ru:'rano',zh:'zao',ja:'hayaku',ht:'bonè'}},
      {n:'immédiatement',t:{en:'immediately',es:'inmediatamente',de:'sofort',ru:'nemedlenno',zh:'liji',ja:'sokuza ni',ht:'touswit'}},
      {n:'récemment',t:{en:'recently',es:'recientemente',de:'kürzlich',ru:'nedavno',zh:'zuijin',ja:'saikin',ht:'depi kèk tan'}},
      {n:'finalement',t:{en:'finally',es:'finalmente',de:'schließlich',ru:'v kontse kontsov',zh:'zuihou',ja:'saigo ni',ht:'finalman'}},
    ]
  },
  peur_colere: {
    fr:'Peur & Colère',en:'Fear & Anger',es:'Miedo y Ira',ht:'Laperè ak Kòlè',de:'Angst & Wut',ru:'Strakh i gnev',zh:'Kongju yu fennu',ja:'Kyofu to ikari',
    icon:'😡',
    words:[
      {n:'peur',t:{en:'fear',es:'miedo',de:'Angst',ru:'strakh',zh:'haipa',ja:'kyofu',ht:'pè'}},
      {n:'colère',t:{en:'anger',es:'ira',de:'Wut',ru:'gnev',zh:'fennu',ja:'ikari',ht:'kòlè'}},
      {n:'stress',t:{en:'stress',es:'estrés',de:'Stress',ru:'stress',zh:'yali',ja:'sutoresu',ht:'stres'}},
      {n:'panique',t:{en:'panic',es:'pánico',de:'Panik',ru:'panika',zh:'konghuang',ja:'panikku',ht:'panik'}},
      {n:'horreur',t:{en:'horror',es:'horror',de:'Horror',ru:'uzhas',zh:'kongbu',ja:'kyofu',ht:'orè'}},
      {n:'menace',t:{en:'threat',es:'amenaza',de:'Drohung',ru:'ugroza',zh:'weixie',ja:'kyohaku',ht:'menas'}},
      {n:'danger',t:{en:'danger',es:'peligro',de:'Gefahr',ru:'opasnost',zh:'weixian',ja:'kiken',ht:'danje'}},
      {n:'frustration',t:{en:'frustration',es:'frustración',de:'Frustration',ru:'frustratsiya',zh:'cuozhe',ja:'zasetsu',ht:'fristrasyon'}},
      {n:'agression',t:{en:'aggression',es:'agresión',de:'Aggression',ru:'agressiya',zh:'qinlve',ja:'kogeki',ht:'agresyon'}},
      {n:'vengeance',t:{en:'revenge',es:'venganza',de:'Rache',ru:'mest',zh:'fuchou',ja:'fukushu',ht:'vanjans'}},
      {n:'haine',t:{en:'hate',es:'odio',de:'Hass',ru:'nenavist',zh:'hen',ja:'zouo',ht:'rayis'}},
      {n:'trembler',t:{en:'tremble',es:'temblar',de:'zittern',ru:'drozhat',zh:'fadou',ja:'fueru',ht:'tranble'}},
      {n:'fuir',t:{en:'flee',es:'huir',de:'fliehen',ru:'bezhat',zh:'taopao',ja:'nigeru',ht:'sove'}},
      {n:'affronter',t:{en:'confront',es:'enfrentar',de:'konfrontieren',ru:'protivostoyat',zh:'mian-dui',ja:'tachimukau',ht:'afwonte'}},
      {n:'calmer',t:{en:'calm down',es:'calmar',de:'beruhigen',ru:'uspokoit',zh:'zhenjing',ja:'shizumeru',ht:'kalme'}},
    ]
  },
  batiments_publics: {
    fr:'Bâtiments Publics',en:'Public Buildings',es:'Edificios públicos',ht:'Batiman piblik',de:'Öffentliche Gebäude',ru:'Obshchestvennye zdaniya',zh:'Gonggong jianzhu',ja:'Kokyo shisetsu',
    icon:'🏛️',
    words:[
      {n:'mairie',t:{en:'city hall',es:'ayuntamiento',de:'Rathaus',ru:'meriya',zh:'shizhengfu',ja:'shiyakusho',ht:'lakomin'}},
      {n:'banque',t:{en:'bank',es:'banco',de:'Bank',ru:'bank',zh:'yinhang',ja:'ginko',ht:'bank'}},
      {n:'poste',t:{en:'post office',es:'correos',de:'Postamt',ru:'pochta',zh:'youju',ja:'yubinkyoku',ht:'lapòs'}},
      {n:'église',t:{en:'church',es:'iglesia',de:'Kirche',ru:'tserkov',zh:'jiaotang',ja:'kyokai',ht:'legliz'}},
      {n:'mosquée',t:{en:'mosque',es:'mezquita',de:'Moschee',ru:'mechet',zh:'qingzhensi',ja:'mosuku',ht:'moske'}},
      {n:'temple',t:{en:'temple',es:'templo',de:'Tempel',ru:'khram',zh:'miao',ja:'tera',ht:'tanp'}},
      {n:'tribunal',t:{en:'court',es:'tribunal',de:'Gericht',ru:'sud',zh:'fayuan',ja:'saibansho',ht:'tribinal'}},
      {n:'prison',t:{en:'prison',es:'prisión',de:'Gefängnis',ru:'tyurma',zh:'jianyu',ja:'keimusho',ht:'prizon'}},
      {n:'marché',t:{en:'market',es:'mercado',de:'Markt',ru:'rynok',zh:'shichang',ja:'ichiba',ht:'mache'}},
      {n:'ambassade',t:{en:'embassy',es:'embajada',de:'Botschaft',ru:'posolstvo',zh:'dashiguan',ja:'taishikan',ht:'anbasad'}},
    ]
  },
  musique_instruments: {
    fr:'Instruments',en:'Instruments',es:'Instrumentos',ht:'Enstriman mizik',de:'Instrumente',ru:'Instrumenty',zh:'Yueqi',ja:'Gakki',
    icon:'🎸',
    words:[
      {n:'piano',t:{en:'piano',es:'piano',de:'Klavier',ru:'pianino',zh:'gangqin',ja:'piano',ht:'pyano'}},
      {n:'guitare',t:{en:'guitar',es:'guitarra',de:'Gitarre',ru:'gitara',zh:'jita',ja:'gita',ht:'gita'}},
      {n:'batterie',t:{en:'drums',es:'batería',de:'Schlagzeug',ru:'barabany',zh:'gu',ja:'doramu',ht:'batri'}},
      {n:'violon',t:{en:'violin',es:'violín',de:'Violine',ru:'skripka',zh:'xiaotiqin',ja:'baiorin',ht:'vyolon'}},
      {n:'trompette',t:{en:'trumpet',es:'trompeta',de:'Trompete',ru:'truba',zh:'xiaolaba',ja:'toranpetto',ht:'twonpèt'}},
      {n:'flûte',t:{en:'flute',es:'flauta',de:'Flöte',ru:'fleyta',zh:'dizi',ja:'furuto',ht:'flit'}},
      {n:'basse',t:{en:'bass',es:'bajo',de:'Bass',ru:'bas',zh:'beisi',ja:'besu',ht:'bas'}},
      {n:'micro',t:{en:'microphone',es:'micrófono',de:'Mikrofon',ru:'mikrofon',zh:'maikefeng',ja:'maiku',ht:'mikwo'}},
      {n:'synthétiseur',t:{en:'synth',es:'sintetizador',de:'Synthesizer',ru:'sintezator',zh:'hechengqi',ja:'shinse',ht:'sentetizè'}},
      {n:'haut-parleur',t:{en:'speaker',es:'altavoz',de:'Lautsprecher',ru:'dinamik',zh:'laba',ja:'supika',ht:'bo-m'}},
    ]
  },
  pensee_profonde: {
    fr:'Philosophie',en:'Philosophy',es:'Filosofía',ht:'Filozofi',de:'Philosophie',ru:'Filosofiya',zh:'Zhexue',ja:'Tetsugaku',
    icon:'🕯️',
    words:[
      {n:'conscience',t:{en:'consciousness',es:'conciencia',de:'Bewusstsein',ru:'soznanie',zh:'yishi',ja:'ishiki',ht:'konsyans'}},
      {n:'existence',t:{en:'existence',es:'existencia',de:'Existenz',ru:'sushchestvovanie',zh:'cunzai',ja:'sonzai',ht:'egzistans'}},
      {n:'morale',t:{en:'moral',es:'moral',de:'Moral',ru:'moral',zh:'daode',ja:'dotoku',ht:'moral'}},
      {n:'réalité',t:{en:'reality',es:'realidad',de:'Realität',ru:'realnost',zh:'xianshi',ja:'genjitsu',ht:'reyalite'}},
      {n:'âme',t:{en:'soul',es:'alma',de:'Seele',ru:'dusha',zh:'linghun',ja:'tamashii',ht:'nanm'}},
      {n:'esprit',t:{en:'mind',es:'mente',de:'Geist',ru:'razum',zh:'jingshen',ja:'seishin',ht:'lespri'}},
      {n:'univers',t:{en:'universe',es:'universo',de:'Universum',ru:'vselennaya',zh:'yuzhou',ja:'uchu',ht:'linivè'}},
      {n:'destin',t:{en:'fate',es:'destino',de:'Schicksal',ru:'sudba',zh:'mingyun',ja:'unmei',ht:'desten'}},
      {n:'liberté',t:{en:'freedom',es:'libertad',de:'Freiheit',ru:'svoboda',zh:'ziyou',ja:'jiyu',ht:'libète'}},
      {n:'justice',t:{en:'justice',es:'justicia',de:'Gerechtigkeit',ru:'spravedlivost',zh:'zhengyi',ja:'seigi',ht:'jistis'}},
    ]
  },
  valeurs_jugement: {
    fr:'Valeurs',en:'Values',es:'Valores',ht:'Valè yo',de:'Werte',ru:'Tsennosti',zh:'Jiazhiguan',ja:'Kachikan',
    icon:'⚖️',
    words:[
      {n:'important',t:{en:'important',es:'importante',de:'wichtig',ru:'vazhnyy',zh:'zhongyao',ja:'juyo',ht:'enpòtan'}},
      {n:'utile',t:{en:'useful',es:'útil',de:'nützlich',ru:'poleznyy',zh:'youyong',ja:'benri',ht:'itil'}},
      {n:'magnifique',t:{en:'magnificent',es:'magnífico',de:'prachtvoll',ru:'velikolepnyy',zh:'zhuangguan',ja:'subarashii',ht:'mayifik'}},
      {n:'terrible',t:{en:'terrible',es:'terrible',de:'schrecklich',ru:'uzhasnyy',zh:'ke-pa',ja:'hidoi',ht:'terib'}},
      {n:'étrange',t:{en:'strange',es:'extraño',de:'seltsam',ru:'strannyy',zh:'qi-guai',ja:'hen',ht:'estranj'}},
      {n:'vrai',t:{en:'true',es:'verdadero',de:'wahr',ru:'istina',zh:'zhen',ja:'honto',ht:'vre'}},
      {n:'faux',t:{en:'false',es:'falso',de:'falsch',ru:'lozh',zh:'jia',ja:'uso',ht:'fo'}},
      {n:'parfait',t:{en:'perfect',es:'perfecto',de:'perfekt',ru:'sovershennyy',zh:'wanmei',ja:'kanpeki',ht:'pafè'}},
      {n:'normal',t:{en:'normal',es:'normal',de:'normal',ru:'normalnyy',zh:'putong',ja:'futsu',ht:'nòmal'}},
      {n:'rare',t:{en:'rare',es:'raro',de:'selten',ru:'redkiy',zh:'xishao',ja:'mare',ht:'rar'}},
    ]
  },
  astronomie_finale: {
    fr:'Espace (Profond)',en:'Deep Space',es:'Espacio profundo',ht:'Epas fon',de:'Weltraum',ru:'Kosmos',zh:'Shenkong',ja:'Shinkyu',
    icon:'🌌',
    words:[
      {n:'galaxie',t:{en:'galaxy',es:'galaxia',de:'Galaxie',ru:'galaktika',zh:'xingxi',ja:'ginga',ht:'galaksi'}},
      {n:'trou noir',t:{en:'black hole',es:'agujero negro',de:'schwarzes Loch',ru:'chernaya dyra',zh:'heidong',ja:'burakku horu',ht:'twou nwa'}},
      {n:'comète',t:{en:'comet',es:'cometa',de:'Komet',ru:'kometa',zh:'huixing',ja:'suisei',ht:'komèt'}},
      {n:'astéroïde',t:{en:'asteroid',es:'asteroide',de:'Asteroid',ru:'asteroid',zh:'xiaoxingxing',ja:'shopei',ht:'astewoyid'}},
      {n:'orbite',t:{en:'orbit',es:'órbita',de:'Umlaufbahn',ru:'orbita',zh:'guidao',ja:'kido',ht:'orbit'}},
      {n:'gravité',t:{en:'gravity',es:'gravedad',de:'Gravitation',ru:'gravitatsiya',zh:'yinli',ja:'juryoku',ht:'gravite'}},
      {n:'télescope',t:{en:'telescope',es:'telescopio',de:'Teleskop',ru:'teleskop',zh:'wangyuanjing',ja:'boenkyo',ht:'teleskòp'}},
      {n:'astronaute',t:{en:'astronaut',es:'astronauta',de:'Astronaut',ru:'kosmonavt',zh:'yuhangyuan',ja:'uchu-hiko-shi',ht:'astwonòt'}},
      {n:'satellite',t:{en:'satellite',es:'satélite',de:'Satellit',ru:'sputnik',zh:'weixing',ja:'jin-ko-eisei',ht:'satelit'}},
      {n:'vide',t:{en:'vacuum/void',es:'vacío',de:'Vakuum',ru:'vakuum',zh:'zhen-kong',ja:'shinku',ht:'vide'}},
    ]
  },
  connecteurs_logiques: {
    fr:'Liaison',en:'Connectors',es:'Conectores',ht:'Mo lyon',de:'Verknüpfungen',ru:'Soyuzy',zh:'Lianjieci',ja:'Setsuzokushi',
    icon:'🔗',
    words:[
      {n:'car',t:{en:'because',es:'porque',de:'denn',ru:'potomu chto',zh:'yinwei',ja:'naze-nara',ht:'paske'}},
      {n:'donc',t:{en:'so/therefore',es:'entonces',de:'also',ru:'poetomu',zh:'suoyi',ja:'dakara',ht:'donk'}},
      {n:'mais',t:{en:'but',es:'pero',de:'aber',ru:'no',zh:'danshi',ja:'shikashi',ht:'men'}},
      {n:'cependant',t:{en:'however',es:'sin embargo',de:'jedoch',ru:'odnako',zh:'raner',ja:'keredomo',ht:'sepandan'}},
      {n:'sinon',t:{en:'otherwise',es:'si no',de:'sonst',ru:'inache',zh:'fouze',ja:'samo-nakereba',ht:'sinon'}},
      {n:'pourtant',t:{en:'yet',es:'todavía',de:'dennoch',ru:'vse zhe',zh:'ran-er',ja:'sore-nani',ht:'poutan'}},
      {n:'ainsi',t:{en:'thus',es:'así',de:'so',ru:'takim obrazom',zh:'yushi',ja:'ko-shite',ht:'konsa'}},
      {n:'enfin',t:{en:'at last',es:'al fin',de:'endlich',ru:'nakonets',zh:'zuihou',ja:'tsui-ni',ht:'anfen'}},
      {n:'surtout',t:{en:'especially',es:'sobre todo',de:'vor allem',ru:'osobenno',zh:'youqi',ja:'toku-ni',ht:'sitou'}},
      {n:'malgré',t:{en:'despite',es:'a pesar de',de:'trotz',ru:'nesmotrya na',zh:'jinguǎn',ja:'nimo-kakawarazu',ht:'malgre'}},
    ]
  },
  sports_activites: {
    fr:'Sports',en:'Sports',es:'Deportes',ht:'Espò',de:'Sport',ru:'Sport',zh:'Tiyu',ja:'Supotsu',
    icon:'⚽',
    words:[
      {n:'football',t:{en:'soccer',es:'fútbol',de:'Fußball',ru:'futbol',zh:'zuqiu',ja:'sakka',ht:'balon'}},
      {n:'basket',t:{en:'basketball',es:'baloncesto',de:'Basketball',ru:'basketbol',zh:'lanqiu',ja:'basuke',ht:'baskètbòl'}},
      {n:'tennis',t:{en:'tennis',es:'tenis',de:'Tennis',ru:'tennis',zh:'wangqiu',ja:'tenisu',ht:'tenis'}},
      {n:'course',t:{en:'running',es:'carrera',de:'Laufen',ru:'beg',zh:'paobu',ja:'rasshingu',ht:'kous'}},
      {n:'natation',t:{en:'swimming',es:'natación',de:'Schwimmen',ru:'plavanie',zh:'youyong',ja:'suiei',ht:'naje'}},
      {n:'boxe',t:{en:'boxing',es:'boxeo',de:'Boxen',ru:'boks',zh:'quanji',ja:'bokushingu',ht:'bòks'}},
      {n:'vélo',t:{en:'cycling',es:'ciclismo',de:'Radfahren',ru:'velosport',zh:'qiche',ja:'saikuringu',ht:'bisiklèt'}},
      {n:'combat',t:{en:'fight',es:'combate',de:'Kampf',ru:'boy',zh:'zhandou',ja:'tatakai',ht:'konba'}},
      {n:'entraînement',t:{en:'training',es:'entrenamiento',de:'Training',ru:'trenirovka',zh:'xunlian',ja:'toreningu',ht:'antrennman'}},
      {n:'équipe',t:{en:'team',es:'equipo',de:'Team',ru:'komanda',zh:'duiwu',ja:'chimu',ht:'ekip'}},
    ]
  },
  temps_meteo_extra: {
    fr:'Temps (Extra)',en:'Time (Extra)',es:'Tiempo extra',ht:'Tan siplemantè',de:'Zeit (Extra)',ru:'Vremya',zh:'Shi-jian',ja:'Jikan',
    icon:'🕰️',
    words:[
      {n:'siècle',t:{en:'century',es:'siglo',de:'Jahrhundert',ru:'vek',zh:'shiji',ja:'seiki',ht:'syèk'}},
      {n:'millénaire',t:{en:'millennium',es:'milenio',de:'Jahrtausend',ru:'tysyacheletie',zh:'qian-nian',ja:'sennen',ht:'milenè'}},
      {n:'passé',t:{en:'past',es:'pasado',de:'Vergangenheit',ru:'proshloe',zh:'guoqu',ja:'kako',ht:'pase'}},
      {n:'présent',t:{en:'present',es:'presente',de:'Gegenwart',ru:'nastoyashchee',zh:'xianzai',ja:'genzai',ht:'prezan'}},
      {n:'éternité',t:{en:'eternity',es:'eternidad',de:'Ewigkeit',ru:'vechnost',zh:'yong-heng',ja:'eien',ht:'etènite'}},
      {n:'période',t:{en:'period',es:'período',de:'Zeitraum',ru:'period',zh:'shiqi',ja:'kikan',ht:'peryòd'}},
      {n:'saison',t:{en:'season',es:'estación',de:'Jahreszeit',ru:'sezon',zh:'jijie',ja:'kisetsu',ht:'sezon'}},
      {n:'horloge',t:{en:'clock',es:'reloj',de:'Uhr',ru:'chasy',zh:'zhong',ja:'tokei',ht:'clòk'}},
      {n:'calendrier',t:{en:'calendar',es:'calendario',de:'Kalender',ru:'kalendar',zh:'rili',ja:'karenda',ht:'kalandriye'}},
      {n:'moment',t:{en:'moment',es:'momento',de:'Moment',ru:'moment',zh:'shike',ja:'shunkan',ht:'moman'}},
    ]
  },
  fin_dictionnaire: {
    fr:'Final',en:'Final',es:'Final',ht:'Finalman',de:'Abschluss',ru:'Final',zh:'Zuihou',ja:'Saigo',
    icon:'🏁',
    words:[
      {n:'commencer',t:{en:'begin',es:'empezar',de:'anfangen',ru:'nachat',zh:'kaishi',ja:'hajimeru',ht:'kòmanse'}},
      {n:'finir',t:{en:'finish',es:'terminar',de:'beenden',ru:'zakonchit',zh:'jieshu',ja:'owaru',ht:'fini'}},
      {n:'réussir',t:{en:'succeed',es:'lograr',de:'erfolgreich sein',ru:'preuspet',zh:'chenggong',ja:'seiko suru',ht:'reyisi'}},
      {n:'échouer',t:{en:'fail',es:'fallar',de:'scheitern',ru:'poterpet neudachu',zh:'shibai',ja:'shippai suru',ht:'echwe'}},
      {n:'essayer',t:{en:'try',es:'intentar',de:'versuchen',ru:'pytatsya',zh:'shishi',ja:'tamesu',ht:'seye'}},
      {n:'gagner',t:{en:'win',es:'ganar',de:'gewinnen',ru:'vyigrat',zh:'ying',ja:'katsu',ht:'genyen'}},
      {n:'perdre',t:{en:'lose',es:'perder',de:'verlieren',ru:'proigrat',zh:'shu',ja:'makeru',ht:'pèdi'}},
      {n:'aider',t:{en:'help',es:'ayudar',de:'helfen',ru:'pomoch',zh:'bangzhu',ja:'tasukeru',ht:'ede'}},
      {n:'partager',t:{en:'share',es:'compartir',de:'teilen',ru:'delitsya',zh:'fenxiang',ja:'kyoyu suru',ht:'pataje'}},
      {n:'aimer',t:{en:'love/like',es:'amar',de:'lieben',ru:'lyubit',zh:'ai',ja:'aisuru',ht:'renmen'}},
    ]
  },
  temps_lieu:{
    fr:'Temps & lieu',en:'Time & place',es:'Tiempo y lugar',ht:'Tan ak kote',de:'Zeit & Ort',ru:'Время и место',zh:'时间与地点',ja:'時間と場所',
    icon:'🕐',
    words:[
      {n:'maintenant',t:{en:'now',es:'ahora',de:'jetzt',ru:'сейчас (seychas)',zh:'现在 (xiànzài)',ja:'今 (ima)',ht:'kounye a'}},
      {n:'aujourd\'hui',t:{en:'today',es:'hoy',de:'heute',ru:'сегодня (segodnya)',zh:'今天 (jīntiān)',ja:'今日 (kyō)',ht:'jodi a'}},
      {n:'demain',t:{en:'tomorrow',es:'mañana',de:'morgen',ru:'завтра (zavtra)',zh:'明天 (míngtiān)',ja:'明日 (ashita)',ht:'demen'}},
      {n:'hier',t:{en:'yesterday',es:'ayer',de:'gestern',ru:'вчера (vchera)',zh:'昨天 (zuótiān)',ja:'昨日 (kinō)',ht:'yè'}},
      {n:'bientôt',t:{en:'soon',es:'pronto',de:'bald',ru:'скоро (skoro)',zh:'很快 (hěn kuài)',ja:'もうすぐ (mō sugu)',ht:'talè'}},
      {n:'toujours',t:{en:'always',es:'siempre',de:'immer',ru:'всегда (vsegda)',zh:'总是 (zǒngshì)',ja:'いつも (itsumo)',ht:'toujou'}},
      {n:'jamais',t:{en:'never',es:'nunca',de:'nie',ru:'никогда (nikogda)',zh:'从不 (cóng bù)',ja:'決して (kesshite)',ht:'janm'}},
      {n:'souvent',t:{en:'often',es:'a menudo',de:'oft',ru:'часто (chasto)',zh:'经常 (jīngcháng)',ja:'よく (yoku)',ht:'souvan'}},
      {n:'ici',t:{en:'here',es:'aquí',de:'hier',ru:'здесь (zdes)',zh:'这里 (zhèlǐ)',ja:'ここ (koko)',ht:'isit la'}},
      {n:'là-bas',t:{en:'there / over there',es:'allí',de:'dort',ru:'там (tam)',zh:'那里 (nàlǐ)',ja:'そこ (soko)',ht:'laba'}},
      {n:'partout',t:{en:'everywhere',es:'en todas partes',de:'überall',ru:'везде (vezde)',zh:'到处 (dàochù)',ja:'どこでも (dokodemo)',ht:'toupatou'}},
      {n:'quelque part',t:{en:'somewhere',es:'en algún lugar',de:'irgendwo',ru:'где-то (gde-to)',zh:'某处 (mǒuchù)',ja:'どこかに (dokoka ni)',ht:'yon kote'}},
      {n:'nulle part',t:{en:'nowhere',es:'en ningún lugar',de:'nirgendwo',ru:'нигде (nigde)',zh:'哪里都不 (nǎlǐ dōu bù)',ja:'どこにも (doko ni mo)',ht:'okenn kote'}},
    ]
  },
  nombres:{
    fr:'Nombres & quantités',en:'Numbers & quantities',es:'Números y cantidades',ht:'Nimewo ak kantite',de:'Zahlen & Mengen',ru:'Числа и количества',zh:'数字与数量',ja:'数字と量',
    icon:'🔢',
    words:[
      {n:'un / une',t:{en:'one',es:'uno/una',de:'ein/eine',ru:'один (odin)',zh:'一 (yī)',ja:'一 (ichi)',ht:'youn'}},
      {n:'deux',t:{en:'two',es:'dos',de:'zwei',ru:'два (dva)',zh:'二 (èr)',ja:'二 (ni)',ht:'de'}},
      {n:'trois',t:{en:'three',es:'tres',de:'drei',ru:'три (tri)',zh:'三 (sān)',ja:'三 (san)',ht:'twa'}},
      {n:'cinq',t:{en:'five',es:'cinco',de:'fünf',ru:'пять (pyat)',zh:'五 (wǔ)',ja:'五 (go)',ht:'senk'}},
      {n:'dix',t:{en:'ten',es:'diez',de:'zehn',ru:'десять (desyat)',zh:'十 (shí)',ja:'十 (jū)',ht:'dis'}},
      {n:'cent',t:{en:'one hundred',es:'cien',de:'hundert',ru:'сто (sto)',zh:'一百 (yī bǎi)',ja:'百 (hyaku)',ht:'san'}},
      {n:'beaucoup',t:{en:'a lot / many',es:'mucho',de:'viel',ru:'много (mnogo)',zh:'很多 (hěn duō)',ja:'たくさん (takusan)',ht:'anpil'}},
      {n:'peu',t:{en:'a little / few',es:'poco',de:'wenig',ru:'мало (malo)',zh:'少 (shǎo)',ja:'少し (sukoshi)',ht:'kèk'}},
      {n:'assez',t:{en:'enough',es:'suficiente',de:'genug',ru:'достаточно (dostatochno)',zh:'足够 (zúgòu)',ja:'十分 (jūbun)',ht:'ase'}},
      {n:'trop',t:{en:'too much / too many',es:'demasiado',de:'zu viel',ru:'слишком (slishkom)',zh:'太多 (tài duō)',ja:'多すぎる (ōsugiru)',ht:'twòp'}},
    ]
  },
};
  
// =================================================================
// PHRASES DATA — 1000 everyday phrases
// =================================================================
const PHRASES_DATA = {
  quotidien:{
    fr:'Vie quotidienne',en:'Daily life',es:'Vida cotidiana',ht:'Lavi chak jou',de:'Alltag',ru:'Повседневная жизнь',zh:'日常生活',ja:'日常生活',icon:'🌅',
    items:[
      {n:'Je veux manger maintenant.',t:{en:'I want to eat now.',es:'Quiero comer ahora.',de:'Ich möchte jetzt essen.',ru:'Я хочу есть сейчас. (Ya khochu yest seychas.)',zh:'我现在想吃东西。(Wǒ xiànzài xiǎng chī dōngxi.)',ja:'今、食べたいです。(Ima, tabetai desu.)',ht:'Mwen vle manje kounye a.'},struct:{n:'Sujet + vouloir + verbe inf + adverbe',t:{en:'Subject + want + verb inf + adverb'}}},
      {n:'Je dois partir maintenant.',t:{en:'I have to leave now.',es:'Tengo que irme ahora.',de:'Ich muss jetzt gehen.',ru:'Мне нужно уйти сейчас.',zh:'我现在必须走了。(Wǒ xiànzài bìxū zǒu le.)',ja:'今、行かなければなりません。',ht:'Mwen dwe pati kounye a.'},struct:{n:'devoir + infinitif',t:{en:'must/have to + infinitive'}}},
      {n:'Qu\'est-ce que tu fais ce soir ?',t:{en:'What are you doing tonight?',es:'¿Qué haces esta noche?',de:'Was machst du heute Abend?',ru:'Что ты делаешь сегодня вечером?',zh:'你今晚做什么？(Nǐ jīn wǎn zuò shénme?)',ja:'今夜何をしますか？',ht:'Kisa ou fè aswe a?'},struct:{n:'Qu\'est-ce que + sujet + verbe ?',t:{en:'What + subject + verb?'}}},
      {n:'J\'ai besoin d\'aide.',t:{en:'I need help.',es:'Necesito ayuda.',de:'Ich brauche Hilfe.',ru:'Мне нужна помощь. (Mne nuzhna pomoshch.)',zh:'我需要帮助。(Wǒ xūyào bāngzhù.)',ja:'助けが必要です。(Tasuke ga hitsuyō desu.)',ht:'Mwen bezwen èd.'},struct:{n:'avoir besoin de + nom',t:{en:'need + noun'}}},
      {n:'C\'est une bonne idée.',t:{en:'That\'s a good idea.',es:'Es una buena idea.',de:'Das ist eine gute Idee.',ru:'Это хорошая идея. (Eto khoroshaya ideya.)',zh:'这是个好主意。(Zhè shì gè hǎo zhǔyì.)',ja:'それはいい考えですね。',ht:'Se yon bon lide.'},struct:{n:'c\'est + article + adj + nom',t:{en:'it\'s + article + adj + noun'}}},
      {n:'Je ne suis pas d\'accord.',t:{en:'I don\'t agree.',es:'No estoy de acuerdo.',de:'Ich bin nicht einverstanden.',ru:'Я не согласен. (Ya ne soglasyen.)',zh:'我不同意。(Wǒ bù tóngyì.)',ja:'同意できません。(Dōi dekimasen.)',ht:'Mwen pa dakò.'},struct:{n:'ne + être + pas + d\'accord',t:{en:'not + agree'}}},
      {n:'Qu\'est-ce que ça veut dire ?',t:{en:'What does that mean?',es:'¿Qué quiere decir eso?',de:'Was bedeutet das?',ru:'Что это значит? (Chto eto znachit?)',zh:'这是什么意思？(Zhè shì shénme yìsi?)',ja:'それはどういう意味ですか？',ht:'Kisa sa vle di?'},struct:{n:'Question + vouloir dire',t:{en:'What + mean?'}}},
      {n:'Il fait beau aujourd\'hui.',t:{en:'The weather is nice today.',es:'Hace buen tiempo hoy.',de:'Das Wetter ist heute schön.',ru:'Сегодня хорошая погода.',zh:'今天天气很好。(Jīntiān tiānqì hěn hǎo.)',ja:'今日はいい天気ですね。',ht:'Tan an bèl jodi a.'},struct:{n:'Il fait + adjectif météo',t:{en:'The weather is + adjective'}}},
    ]
  },
  restaurant:{
    fr:'Restaurant & café',en:'Restaurant & café',es:'Restaurante y café',ht:'Restoran ak kafè',de:'Restaurant & Café',ru:'Ресторан и кафе',zh:'餐厅与咖啡馆',ja:'レストランとカフェ',icon:'🍽️',
    items:[
      {n:'On peut aller au restaurant.',t:{en:'We can go to the restaurant.',es:'Podemos ir al restaurante.',de:'Wir können ins Restaurant gehen.',ru:'Мы можем пойти в ресторан.',zh:'我们可以去餐厅。(Wǒmen kěyǐ qù cāntīng.)',ja:'レストランに行けます。',ht:'Nou ka ale nan restoran.'},struct:{n:'On peut + infinitif',t:{en:'We can + infinitive'}}},
      {n:'Je voudrais une table pour deux.',t:{en:'I\'d like a table for two.',es:'Quisiera una mesa para dos.',de:'Ich hätte gerne einen Tisch für zwei.',ru:'Я хотел бы столик на двоих.',zh:'我想要一张两人桌。(Wǒ xiǎng yào yī zhāng liǎng rén zhuō.)',ja:'2人用のテーブルをお願いします。',ht:'Mwen ta renmen yon tab pou de moun.'},struct:{n:'je voudrais + article + nom',t:{en:'I\'d like + article + noun'}}},
      {n:'Qu\'est-ce que vous recommandez ?',t:{en:'What do you recommend?',es:'¿Qué recomienda usted?',de:'Was empfehlen Sie?',ru:'Что вы рекомендуете?',zh:'你推荐什么？(Nǐ tuījiàn shénme?)',ja:'何がお勧めですか？',ht:'Kisa ou rekòmande?'},struct:{n:'Qu\'est-ce que + sujet + verbe ?',t:{en:'What + do/does + subject + recommend?'}}},
      {n:'L\'addition, s\'il vous plaît.',t:{en:'The bill, please.',es:'La cuenta, por favor.',de:'Die Rechnung, bitte.',ru:'Счёт, пожалуйста. (Schyot, pozhaluysta.)',zh:'买单，请。(Mǎidān, qǐng.)',ja:'お会計をお願いします。',ht:'Adisyon an, tanpri.'},struct:{n:'Article + nom + s\'il vous plaît',t:{en:'The + noun + please'}}},
      {n:'C\'est délicieux !',t:{en:'It\'s delicious!',es:'¡Está delicioso!',de:'Das ist lecker!',ru:'Это вкусно! (Eto vkusno!)',zh:'太好吃了！(Tài hǎochī le!)',ja:'美味しいです！(Oishii desu!)',ht:'Sa bon anpil!'},struct:{n:'c\'est + adjectif',t:{en:'it\'s + adjective'}}},
    ]
  },
  travail:{
    fr:'Travail & études',en:'Work & studies',es:'Trabajo y estudios',ht:'Travay ak etid',de:'Arbeit & Studium',ru:'Работа и учёба',zh:'工作与学习',ja:'仕事と勉強',icon:'💼',
    items:[
      {n:'Je travaille dans une entreprise.',t:{en:'I work in a company.',es:'Trabajo en una empresa.',de:'Ich arbeite in einem Unternehmen.',ru:'Я работаю в компании.',zh:'我在一家公司工作。(Wǒ zài yījiā gōngsī gōngzuò.)',ja:'会社で働いています。',ht:'Mwen travay nan yon konpayi.'},struct:{n:'sujet + travailler + dans + lieu',t:{en:'subject + work + in + place'}}},
      {n:'Je dois finir ce projet.',t:{en:'I need to finish this project.',es:'Necesito terminar este proyecto.',de:'Ich muss dieses Projekt beenden.',ru:'Мне нужно закончить этот проект.',zh:'我需要完成这个项目。(Wǒ xūyào wánchéng zhège xiàngmù.)',ja:'このプロジェクトを終わらせる必要があります。',ht:'Mwen dwe fini pwojè sa a.'},struct:{n:'devoir + infinitif + COD',t:{en:'need to + verb + object'}}},
      {n:'Est-ce que tu peux m\'aider ?',t:{en:'Can you help me?',es:'¿Puedes ayudarme?',de:'Kannst du mir helfen?',ru:'Ты можешь мне помочь?',zh:'你能帮我吗？(Nǐ néng bāng wǒ ma?)',ja:'手伝ってもらえますか？',ht:'Èske ou ka ede m?'},struct:{n:'Est-ce que + sujet + pouvoir + verbe ?',t:{en:'Can + subject + verb?'}}},
      {n:'J\'ai une réunion à 14h.',t:{en:'I have a meeting at 2pm.',es:'Tengo una reunión a las 14h.',de:'Ich habe ein Meeting um 14 Uhr.',ru:'У меня встреча в 14:00.',zh:'我下午2点有会议。(Wǒ xiàwǔ 2 diǎn yǒu huìyì.)',ja:'14時に会議があります。',ht:'Mwen gen yon reyinyon a 2è.'},struct:{n:'avoir + article + événement + à + heure',t:{en:'have + article + event + at + time'}}},
    ]
  },
    salutations_courtoisie: {
    fr:'Salutations',en:'Greetings',es:'Saludos',ht:'Salitasyon',de:'Grüße',ru:'Privetstviya',zh:'Wenhou',ja:'Aisatsu',
    icon:'👋',
    items:[
      {n:'Comment allez-vous ?',t:{en:'How are you?',es:'¿Cómo está?',de:'Wie geht es Ihnen?',ru:'Kak dela?',zh:'Nǐ hǎo ma?',ja:'O-genki desu ka?',ht:'Kijan ou ye?'},struct:{n:'Comment + aller + sujet',t:{en:'How + go + subject'}}},
      {n:'Je vais bien, merci.',t:{en:'I am fine, thank you.',es:'Estoy bien, gracias.',de:'Mir geht es gut, danke.',ru:'Ya v poryadke, spasibo.',zh:'Wǒ hěn hǎo, xièxiè.',ja:'Genki desu, arigato.',ht:'Mwen byen, mèsi.'},struct:{n:'Sujet + aller + adverbe',t:{en:'Subject + go + adverb'}}},
      {n:'Enchanté de vous rencontrer.',t:{en:'Nice to meet you.',es:'Encantado de conocerle.',de:'Freut mich, Sie kennenzulernen.',ru:'Rad vstreche.',zh:'Hěn gāoxìng rènshí nǐ.',ja:'Hajimemashite.',ht:'Mwen kontan rekonèt ou.'},struct:{n:'Adj + de + infinitif',t:{en:'Adj + to + infinitive'}}},
      {n:'Excusez-moi du dérangement.',t:{en:'Excuse me for bothering you.',es:'Disculpe la molestia.',de:'Entschuldigen Sie die Störung.',ru:'Izvinitie za bespokoystvo.',zh:'Bù hǎoyìsi dǎrǎo le.',ja:'O-jama shimasu.',ht:'Eskize m si m deranje ou.'},struct:{n:'Impératif + de + nom',t:{en:'Imperative + of + noun'}}},
      {n:'Bonne journée !',t:{en:'Have a nice day!',es:'¡Buen día!',de:'Schönen Tag noch!',ru:'Horoshego dnya!',zh:'Zhù nǐ yǒu měihǎo de yītiān!',ja:'Yoi ichinichi o!',ht:'Pase yon bon jounen!'}},
      {n:'À plus tard.',t:{en:'See you later.',es:'Hasta luego.',de:'Bis später.',ru:'Do vstrechi.',zh:'Huítóu jiàn.',ja:'Mata ato de.',ht:'N a wè pita.'}},
      {n:'Je vous en prie.',t:{en:'You are welcome.',es:'De nada / Por favor.',de:'Bitte sehr.',ru:'Pozhaluysta.',zh:'Bù kèqì.',ja:'Douitashimashite.',ht:'Pa gen pwoblèm.'}},
      {n:'Comment t\'appelles-tu ?',t:{en:'What is your name?',es:'¿Cómo te llamas?',de:'Wie heißt du?',ru:'Kak tebya zovut?',zh:'Nǐ jiào shénme míngzì?',ja:'Onamae wa nan desu ka?',ht:'Kijan ou rele?'}},
      {n:'Je m\'appelle...',t:{en:'My name is...',es:'Me llamo...',de:'Ich heiße...',ru:'Menya zovut...',zh:'Wǒ jiào...',ja:'Watashi wa... desu.',ht:'Mwen rele...'}},
      {n:'D\'où venez-vous ?',t:{en:'Where are you from?',es:'¿De dónde es usted?',de:'Woher kommen Sie?',ru:'Otkuda vy?',zh:'Nǐ lái zì nǎlǐ?',ja:'Doko no shusshen desu ka?',ht:'Moun ki kote ou ye?'}},
    ]
  },
  besoins_urgences: {
    fr:'Besoins & Urgence',en:'Needs & Urgent',es:'Necesidades',ht:'Bezwen ak Ijansk',de:'Notfälle',ru:'Srochno',zh:'Jinji',ja:'Kinkyu',
    icon:'🆘',
    items:[
      {n:'Où sont les toilettes ?',t:{en:'Where is the bathroom?',es:'¿Dónde está el baño?',de:'Wo ist die Toilette?',ru:'Gde tualet?',zh:'Cèsuǒ zài nǎlǐ?',ja:'Toire wa doko desu ka?',ht:'Kote twalèt yo ye?'}},
      {n:'Aidez-moi, s\'il vous plaît.',t:{en:'Help me, please.',es:'Ayúdeme, por favor.',de:'Helfen Sie mir bitte.',ru:'Pomogite mne, pozhaluysta.',zh:'Qǐng bāngzhù wǒ.',ja:'Tasukete kudasai.',ht:'Ede m, tanpri.'}},
      {n:'J\'ai perdu mon sac.',t:{en:'I lost my bag.',es:'He perdido mi bolsa.',de:'Ich habe meine Tasche verloren.',ru:'Ya poteryal sumku.',zh:'Wǒ de bāo diū le.',ja:'Kaban o nakushimashita.',ht:'Mwen pèdi sak mwen.'}},
      {n:'C\'est urgent.',t:{en:'It is urgent.',es:'Es urgente.',de:'Es ist dringend.',ru:'Eto srochno.',zh:'Zhè hěn jǐnjí.',ja:'Kinkyu desu.',ht:'Se yon ijans.'}},
      {n:'Appelez une ambulance.',t:{en:'Call an ambulance.',es:'Llame a una ambulancia.',de:'Rufen Sie einen Krankenwagen.',ru:'Vyzovite skoruyu.',zh:'Jiào jiùhùchē.',ja:'Kyūkyūsha o yonde.',ht:'Rele yon anbilans.'}},
      {n:'Je ne me sens pas bien.',t:{en:'I don\'t feel well.',es:'No me siento bien.',de:'Ich fühle mich nicht gut.',ru:'Ya plokho sebya chuvstvuyu.',zh:'Wǒ bù shūfú.',ja:'Kibun ga warui desu.',ht:'Mwen pa santi m byen.'}},
      {n:'Où est l\'hôpital ?',t:{en:'Where is the hospital?',es:'¿Dónde está el hospital?',de:'Wo ist das Krankenhaus?',ru:'Gde bolnitsa?',zh:'Yīyuàn zài nǎlǐ?',ja:'Byōin wa doko desu ka?',ht:'Kote lopital la ye?'}},
      {n:'Y a-t-il une pharmacie ici ?',t:{en:'Is there a pharmacy here?',es:'¿Hay una farmacia aquí?',de:'Gibt es hier eine Apotheke?',ru:'Zdes yest apteka?',zh:'Zhèlǐ yǒu yàodiàn ma?',ja:'Yakkyoku wa arimasu ka?',ht:'Èske gen yon famasi bò isit la?'}},
    ]
  },
  shopping_argent: {
    fr:'Achats & Argent',en:'Shopping & Money',es:'Compras',ht:'Acha ak Lajan',de:'Einkaufen',ru:'Pokupki',zh:'Gòuwù',ja:'Kaimono',
    icon:'💰',
    items:[
      {n:'Combien ça coûte ?',t:{en:'How much is it?',es:'¿Cuánto cuesta?',de:'Wie viel kostet das?',ru:'Skolko eto stoit?',zh:'Zhège duōshǎo qián?',ja:'Ikura desu ka?',ht:'Konbyen sa koute?'}},
      {n:'C\'est trop cher.',t:{en:'It is too expensive.',es:'Es demasiado caro.',de:'Das ist zu teuer.',ru:'Eto slishkom dorogo.',zh:'Tài guì le.',ja:'Takasugi masu.',ht:'Li twò chè.'}},
      {n:'Acceptez-vous la carte ?',t:{en:'Do you accept cards?',es:'¿Acepta tarjeta?',de:'Akzeptieren Sie Karten?',ru:'Vy prinimaete karty?',zh:'Nǐ jiēshòu kǎ ma?',ja:'Kādo wa tsukaemasu ka?',ht:'Èske nou pran kat?'}},
      {n:'Où est le distributeur ?',t:{en:'Where is the ATM?',es:'¿Dónde está el cajero?',de:'Wo ist der Geldautomat?',ru:'Gde bankomat?',zh:'Quǎkuǎnjī zài nǎlǐ?',ja:'ATM wa doko desu ka?',ht:'Kote bwat kach la ye?'}},
      {n:'Je voudrais acheter ceci.',t:{en:'I would like to buy this.',es:'Quisiera comprar esto.',de:'Ich möchte das kaufen.',ru:'Ya khochu eto kupit.',zh:'Wǒ xiǎng mǎi zhège.',ja:'Kore o kaitai desu.',ht:'Mwen ta renmen achte sa a.'}},
      {n:'Avez-vous une taille plus grande ?',t:{en:'Do you have a larger size?',es:'¿Tiene una talla más grande?',de:'Haben Sie eine größere Nummer?',ru:'Yest razmer pobolshe?',zh:'Yǒu gèng dà de chǐmǎ ma?',ja:'Motto ookii saizu wa arimasu ka?',ht:'Èske nou gen yon gwosè ki pi gwo?'}},
    ]
  },
  chemin_directions: {
    fr:'Chemin',en:'Directions',es:'Direcciones',ht:'Chemen',de:'Wegbeschreibung',ru:'Napravleniya',zh:'Fāngxiàng',ja:'Hōkō',
    icon:'📍',
    items:[
      {n:'Je suis perdu.',t:{en:'I am lost.',es:'Estoy perdido.',de:'Ich habe mich verlaufen.',ru:'Ya zabludilsya.',zh:'Wǒ mílù le.',ja:'Michi ni mayoi mashita.',ht:'Mwen pèdi.'}},
      {n:'Pouvez-vous me montrer sur la carte ?',t:{en:'Can you show me on the map?',es:'¿Puede mostrármelo en el mapa?',de:'Können Sie mir das auf der Karte zeigen?',ru:'Pokazhite na karte?',zh:'Nǐ néng zài dìtú shàng zhǐ gěi wǒ kàn ma?',ja:'Chizu de oshiete kuremasu ka?',ht:'Èske ou ka montre m sou kat la?'}},
      {n:'C\'est à quelle distance ?',t:{en:'How far is it?',es:'¿A qué distancia está?',de:'Wie weit ist es?',ru:'Kak daleko eto?',zh:'Duō yuǎn?',ja:'Dono kurai tōi desu ka?',ht:'Ki distans li genyen?'}},
      {n:'Allez tout droit.',t:{en:'Go straight.',es:'Vaya recto.',de:'Gehen Sie geradeaus.',ru:'Idite pryamo.',zh:'Yizhí zǒu.',ja:'Massugu itte.',ht:'Ale tou dwat.'}},
      {n:'C\'est à gauche ou à droite ?',t:{en:'Is it on the left or right?',es:'¿Está a la izquierda o a la derecha?',de:'Ist es links oder rechts?',ru:'Eto sleva ili sprava?',zh:'Zài zuǒbiān háishì yòubiān?',ja:'Hidari desu ka, migi desu ka?',ht:'Èske l agòch oswa adwat?'}},
    ]
  },
  hotel_hebergement: {
    fr:'Hôtel',en:'Hotel',es:'Hotel',ht:'Otèl',de:'Hotel',ru:'Otel',zh:'Jiudian',ja:'Hoteru',
    icon:'🏨',
    items:[
      {n:'J\'ai une réservation.',t:{en:'I have a reservation.',es:'Tengo una reserva.',de:'Ich habe eine Reservierung.',ru:'U menya bron.',zh:'Wǒ yǒu yùdìng.',ja:'Yoyaku ga arimasu.',ht:'Mwen gen yon rezèvasyon.'}},
      {n:'À quelle heure est le petit-déjeuner ?',t:{en:'What time is breakfast?',es:'¿A qué hora es el desayuno?',de:'Wann gibt es Frühstück?',ru:'Vo skolko zavtrak?',zh:'Zǎocān jǐ diǎn?',ja:'Chōshoku wa nan-ji desu ka?',ht:'Ki lè dejene a ye?'}},
      {n:'Est-ce que le Wi-Fi est gratuit ?',t:{en:'Is the Wi-Fi free?',es:'¿El Wi-Fi es gratis?',de:'Ist das WLAN kostenlos?',ru:'Wi-Fi besplatnyy?',zh:'Wúxiàn wǎng miǎn fèi ma?',ja:'Wi-Fi wa muryō desu ka?',ht:'Èske Wi-Fi a gratis?'}},
      {n:'Je voudrais une chambre calme.',t:{en:'I would like a quiet room.',es:'Quisiera una habitación tranquila.',de:'Ich hätte gerne ein ruhiges Zimmer.',ru:'Ya hochu tikhuyu komnatu.',zh:'Wǒ xiǎng yào yījiān ānjìng de fángjiān.',ja:'Shizuka na heya o onegaishimasu.',ht:'Mwen ta renmen yon chanm ki pa gen bri.'}},
      {n:'Où sont les serviettes ?',t:{en:'Where are the towels?',es:'¿Dónde están las toallas?',de:'Wo sind die Handtücher?',ru:'Gde polotentsa?',zh:'Mǎojīn zài nǎlǐ?',ja:'Taoru wa doko desu ka?',ht:'Kote sèvyèt yo ye?'}},
      {n:'Pouvez-vous me réveiller à 7h ?',t:{en:'Can you wake me up at 7?',es:'¿Puede despertarme a las 7?',de:'Können Sie mich um 7 Uhr wecken?',ru:'Razbudite menya v sem?',zh:'Nǐ néng zài qī diǎn jiào xǐng wǒ ma?',ja:'Shichi-ji ni okoshite kuremasu ka?',ht:'Èske ou ka reveye m a 7è?'}},
    ]
  },
  conversation_social: {
    fr:'Social',en:'Social',es:'Social',ht:'Sosyal',de:'Sozial',ru:'Obshenie',zh:'Shejiao',ja:'Shakaiteki',
    icon:'📱',
    items:[
      {n:'Quel est ton compte Instagram ?',t:{en:'What is your Instagram?',es:'¿Cuál es tu Instagram?',de:'Wie ist dein Instagram?',ru:'Kakoy tvoy Instagram?',zh:'Nǐ de Instagram shì shénme?',ja:'Anata no Insutaguramu wa?',ht:'Kisa ki kont Instagram ou?'}},
      {n:'Envoie-moi un message.',t:{en:'Send me a message.',es:'Envíame un mensaje.',de:'Schick mir eine Nachricht.',ru:'Napishi mne.',zh:'Gěi wǒ fā xiāoxī.',ja:'Messēji o okutte.',ht:'Voye yon mesaj pou mwen.'}},
      {n:'Je vais te suivre.',t:{en:'I will follow you.',es:'Te voy a seguir.',de:'Ich werde dir folgen.',ru:'Ya podpishus na tebya.',zh:'Wǒ huì guānzhù nǐ.',ja:'Forō shimasu.',ht:'M pral swiv ou.'}},
      {n:'Est-ce que tu as WhatsApp ?',t:{en:'Do you have WhatsApp?',es:'¿Tienes WhatsApp?',de:'Hast du WhatsApp?',ru:'U tebya yest WhatsApp?',zh:'Nǐ yǒu WhatsApp ma?',ja:'Watsuappu o motte imasu ka?',ht:'Èske ou gen WhatsApp?'}},
      {n:'Prendre une photo ensemble.',t:{en:'Take a photo together.',es:'Tomar una foto juntos.',de:'Ein Foto zusammen machen.',ru:'Sdelat foto vmeste.',zh:'Yīqǐ pāizhào.',ja:'Issho ni shashin o torou.',ht:'Ann pran yon foto ansanm.'}},
      {n:'Je rigole !',t:{en:'I am joking!',es:'¡Estoy bromeando!',de:'Ich mache nur Spaß!',ru:'Ya shuchu!',zh:'Wǒ zài kāi wánxiào!',ja:'Jōdan desu!',ht:'M ap bay blag!'}},
    ]
  },
  meteo_expression: {
    fr:'Météo',en:'Weather',es:'Clima',ht:'Tan an',de:'Wetter',ru:'Pogoda',zh:'Tianqi',ja:'Tenki',
    icon:'☁️',
    items:[
      {n:'Il va pleuvoir aujourd\'hui.',t:{en:'It is going to rain today.',es:'Va a llover hoy.',de:'Es wird heute regnen.',ru:'Segodnya budet dozhd.',zh:'Jīntiān huì xià yǔ.',ja:'Kyō wa ame ga furu deshō.',ht:'Li pral fè lapli jodi a.'}},
      {n:'Il fait très chaud dehors.',t:{en:'It is very hot outside.',es:'Hace mucho calor fuera.',de:'Es ist sehr heiß draußen.',ru:'Na ulitse ochen zharko.',zh:'Wàimiàn hěn rè.',ja:'Soto wa totemo atsui desu.',ht:'Li fè cho anpil deyò a.'}},
      {n:'Le ciel est dégagé.',t:{en:'The sky is clear.',es:'El cielo está despejado.',de:'Der Himmel ist klar.',ru:'Nebo chistoe.',zh:'Qiántīan qínglǎng.',ja:'Sora wa harete imasu.',ht:'Syèl la klè.'}},
      {n:'J\'adore la neige.',t:{en:'I love snow.',es:'Me encanta la nieve.',de:'Ich liebe Schnee.',ru:'Ya lyublyu sneg.',zh:'Wǒ xǐhuān xuě.',ja:'Yuki ga daisuki desu.',ht:'Mwen renmen lanèj.'}},
      {n:'Il y a beaucoup de vent.',t:{en:'It is very windy.',es:'Hace mucho viento.',de:'Es ist sehr windig.',ru:'Ochen vetreno.',zh:'Fēng hěn dà.',ja:'Kaze ga tsuyoi desu.',ht:'Gen anpil van.'}},
      {n:'Demain sera ensoleillé.',t:{en:'Tomorrow will be sunny.',es:'Mañana estará soleado.',de:'Morgen wird es sonnig sein.',ru:'Zavtra budet solnechno.',zh:'Míngtiān huì shì qíngtiān.',ja:'Ashita wa hare deshō.',ht:'Demen pral gen solèy.'}},
    ]
  },
  sentiments_opinions: {
    fr:'Sentiments',en:'Feelings',es:'Sentimientos',ht:'Santiman',de:'Gefühle',ru:'Chuvstva',zh:'Ganjiue',ja:'Kanjō',
    icon:'❤️',
    items:[
      {n:'Je suis très content.',t:{en:'I am very happy.',es:'Estoy muy feliz.',de:'Ich bin sehr glücklich.',ru:'Ya ochen schastliv.',zh:'Wǒ hěn gāoxìng.',ja:'Totemo ureshii desu.',ht:'Mwen kontan anpil.'}},
      {n:'Je suis fatigué.',t:{en:'I am tired.',es:'Estoy cansado.',de:'Ich bin müde.',ru:'Ya ustal.',zh:'Wǒ lèi le.',ja:'Tsukaremashita.',ht:'Mwen fatige.'}},
      {n:'C\'est incroyable !',t:{en:'It is incredible!',es:'¡Es increíble!',de:'Das ist unglaublich!',ru:'Eto neveroyatno!',zh:'Zhè tài bùkěsīyì le!',ja:'Shinjirarenai!',ht:'Se etonan!'}},
      {n:'Je m\'ennuie un peu.',t:{en:'I am a bit bored.',es:'Estoy un poco aburrido.',de:'Ich langweile mich ein bisschen.',ru:'Mne skuchno.',zh:'Wǒ yǒu diǎn wúliáo.',ja:'Sukoshi taikutsu desu.',ht:'Mwen annuye m yon ti jan.'}},
      {n:'Ne t\'inquiète pas.',t:{en:'Don\'t worry.',es:'No te preocupes.',de:'Mach dir keine Sorgen.',ru:'Ne perezhivay.',zh:'Bié dānxīn.',ja:'Shinpai shinaide.',ht:'Pa bay kò ou pwoblèm.'}},
      {n:'C\'est dommage.',t:{en:'It is a pity.',es:'Es una lástima.',de:'Das ist schade.',ru:'Zhal.',zh:'Tài yíhàn le.',ja:'Zannen desu ne.',ht:'Sa rèd.'}},
    ]
  },
  travail_etudes_phrases: {
    fr:'Travail/Études',en:'Work/Studies',es:'Trabajo',ht:'Travay/Etid',de:'Arbeit',ru:'Rabota',zh:'Gongzuo',ja:'Shigoto',
    icon:'📝',
    items:[
      {n:'Je vais être en retard.',t:{en:'I am going to be late.',es:'Voy a llegar tarde.',de:'Ich werde zu spät kommen.',ru:'Ya opozdayu.',zh:'Wǒ yào chídào le.',ja:'Okore sō desu.',ht:'M pral anreta.'}},
      {n:'On se voit en réunion.',t:{en:'See you in the meeting.',es:'Nos vemos en la reunión.',de:'Wir sehen uns im Meeting.',ru:'Uvidimsya na sobranii.',zh:'Huìyì shàng jiàn.',ja:'Kaigi de aimashō.',ht:'N a wè nan reyinyon an.'}},
      {n:'Où est mon ordinateur ?',t:{en:'Where is my computer?',es:'¿Dónde está mi ordenador?',de:'Wo ist mein Computer?',ru:'Gde moy kompyuter?',zh:'Wǒ de diànnǎo zài nǎlǐ?',ja:'Konpyūta wa doko desu ka?',ht:'Kote òdinatè m nan ye?'}},
      {n:'J\'ai fini mon travail.',t:{en:'I finished my work.',es:'He terminado mi trabajo.',de:'Ich habe meine Arbeit beendet.',ru:'Ya zakonchil rabotu.',zh:'Wǒ zuò wán le.',ja:'Shigoto ga owarimashita.',ht:'Mwen fini travay mwen.'}},
      {n:'Tu peux répéter ?',t:{en:'Can you repeat?',es:'¿Puedes repetir?',de:'Kannst du das wiederholen?',ru:'Mozhesh povtorit?',zh:'Nǐ néng zàishuō yībiàn ma?',ja:'Mou ichido itte kuremasu ka?',ht:'Èske ou ka repete?'}},
      {n:'C\'est difficile à comprendre.',t:{en:'It is hard to understand.',es:'Es difícil de entender.',de:'Das ist schwer zu verstehen.',ru:'Eto trudno ponyat.',zh:'Zhè hěn nán lǐjiě.',ja:'Rikaiするのがmuzukashii desu.',ht:'Li difisil pou m konprann.'}},
    ]
  },
  corps_humain: {
    fr:'Corps Humain',en:'Human Body',es:'Cuerpo Humano',ht:'Kò moun',de:'Menschlicher Körper',ru:'Telo',zh:'Shenti',ja:'Karada',
    icon:'👤',
    items:[
      {n:'tête',t:{en:'head',es:'cabeza',de:'Kopf',ru:'golova',zh:'tou',ja:'atama',ht:'tèt'}},
      {n:'visage',t:{en:'face',es:'cara',de:'Gesicht',ru:'litso',zh:'lian',ja:'kao',ht:'figi'}},
      {n:'œil',t:{en:'eye',es:'ojo',de:'Auge',ru:'glaz',zh:'yanjing',ja:'me',ht:'je'}},
      {n:'bouche',t:{en:'mouth',es:'boca',de:'Mund',ru:'rot',zh:'zui',ja:'kuchi',ht:'bouch'}},
      {n:'nez',t:{en:'nose',es:'nariz',de:'Nase',ru:'nos',zh:'bizi',ja:'hana',ht:'nen'}},
      {n:'oreille',t:{en:'ear',es:'oreja',de:'Ohr',ru:'ukho',zh:'erduo',ja:'mimi',ht:'zòrèy'}},
      {n:'cheveux',t:{en:'hair',es:'pelo',de:'Haar',ru:'volosy',zh:'toufa',ja:'kami',ht:'cheve'}},
      {n:'bras',t:{en:'arm',es:'brazo',de:'Arm',ru:'ruka',zh:'gebi',ja:'ude',ht:'bra'}},
      {n:'main',t:{en:'hand',es:'mano',de:'Hand',ru:'ruka',zh:'shou',ja:'te',ht:'men'}},
      {n:'doigt',t:{en:'finger',es:'dedo',de:'Finger',ru:'palets',zh:'shouzhi',ja:'yubi',ht:'dwèt'}},
      {n:'jambe',t:{en:'leg',es:'pierna',de:'Bein',ru:'noga',zh:'tui',ja:'ashi',ht:'janm'}},
      {n:'pied',t:{en:'foot',es:'pie',de:'Fuß',ru:'stupa',zh:'jiao',ja:'ashi',ht:'pye'}},
      {n:'cœur',t:{en:'heart',es:'corazón',de:'Herz',ru:'serdtse',zh:'xin',ja:'shinko',ht:'kè'}},
      {n:'sang',t:{en:'blood',es:'sangre',de:'Blut',ru:'krov',zh:'xue',ja:'chi',ht:'san'}},
      {n:'dos',t:{en:'back',es:'espalda',de:'Rücken',ru:'spina',zh:'bei',ja:'senaka',ht:'do'}},
      {n:'épaule',t:{en:'shoulder',es:'hombro',de:'Schulter',ru:'plecho',zh:'jiabang',ja:'kata',ht:'zepòl'}},
      {n:'genou',t:{en:'knee',es:'rodilla',de:'Knie',ru:'koleno',zh:'xigai',ja:'hiza',ht:'jenou'}},
      {n:'ventre',t:{en:'stomach',es:'estómago',de:'Bauch',ru:'zhivot',zh:'duzi',ja:'onaka',ht:'vant'}},
      {n:'dent',t:{en:'tooth',es:'diente',de:'Zahn',ru:'zub',zh:'yachi',ja:'ha',ht:'dan'}},
      {n:'langue',t:{en:'tongue',es:'lengua',de:'Zunge',ru:'yazyk',zh:'she',ja:'shita',ht:'lang'}},
    ]
  },
  animaux_monde: {
    fr:'Animaux',en:'Animals',es:'Animales',ht:'Zannimo',de:'Tiere',ru:'Zhivotnye',zh:'Dongwu',ja:'Dobutsu',
    icon:'🦁',
    items:[
      {n:'chien',t:{en:'dog',es:'perro',de:'Hund',ru:'sobaka',zh:'gou',ja:'inu',ht:'chyen'}},
      {n:'chat',t:{en:'cat',es:'gato',de:'Katze',ru:'koshka',zh:'mao',ja:'neko',ht:'chat'}},
      {n:'cheval',t:{en:'horse',es:'caballo',de:'Pferd',ru:'loshad',zh:'ma',ja:'uma',ht:'chwal'}},
      {n:'oiseau',t:{en:'bird',es:'pájaro',de:'Vogel',ru:'ptitsa',zh:'niao',ja:'tori',ht:'zwazo'}},
      {n:'lion',t:{en:'lion',es:'león',de:'Löwe',ru:'lev',zh:'shizi',ja:'raion',ht:'lyon'}},
      {n:'éléphant',t:{en:'elephant',es:'elefante',de:'Elefant',ru:'slon',zh:'xiang',ja:'zo',ht:'elefan'}},
      {n:'singe',t:{en:'monkey',es:'mono',de:'Affe',ru:'obezyana',zh:'houzi',ja:'saru',ht:'makak'}},
      {n:'vache',t:{en:'cow',es:'vaca',de:'Kuh',ru:'korova',zh:'niū',ja:'ushi',ht:'vach'}},
      {n:'cochon',t:{en:'pig',es:'cerdo',de:'Schwein',ru:'svinya',zh:'zhu',ja:'buta',ht:'kochon'}},
      {n:'mouton',t:{en:'sheep',es:'oveja',de:'Schaf',ru:'ovtsa',zh:'yang',ja:'hitsuji',ht:'mouton'}},
      {n:'lapin',t:{en:'rabbit',es:'conejo',de:'Hase',ru:'krolik',zh:'tuzi',ja:'usagi',ht:'lapen'}},
      {n:'serpent',t:{en:'snake',es:'serpiente',de:'Schlange',ru:'zmeya',zh:'she',ja:'hebi',ht:'koulèv'}},
      {n:'poisson',t:{en:'fish',es:'pez',de:'Fisch',ru:'ryba',zh:'yu',ja:'sakana',ht:'pwason'}},
      {n:'tortue',t:{en:'turtle',es:'tortuga',de:'Schildkröte',ru:'cherepakha',zh:'gui',ja:'kame',ht:'tòti'}},
      {n:'souris',t:{en:'mouse',es:'ratón',de:'Maus',ru:'mysh',zh:'laoshu',ja:'nezumi',ht:'sourit'}},
      {n:'ours',t:{en:'bear',es:'oso',de:'Bär',ru:'medved',zh:'xiong',ja:'kuma',ht:'ous'}},
      {n:'tigre',t:{en:'tiger',es:'tigre',de:'Tiger',ru:'tigr',zh:'laohu',ja:'tora',ht:'tig'}},
      {n:'canard',t:{en:'duck',es:'pato',de:'Ente',ru:'utka',zh:'yazi',ja:'ahiru',ht:'kanna'}},
      {n:'abeille',t:{en:'bee',es:'abeja',de:'Biene',ru:'pchela',zh:'mifeng',ja:'hachi',ht:'mouch a myel'}},
      {n:'papillon',t:{en:'butterfly',es:'mariposa',de:'Schmetterling',ru:'babochka',zh:'hudie',ja:'chocho',ht:'parpapiyon'}},
    ]
  },
  technologie_internet: {
    fr:'Technologie',en:'Technology',es:'Tecnología',ht:'Teknoloji',de:'Technologie',ru:'Tekhnologiya',zh:'Keji',ja:'Gijutsu',
    icon:'💻',
    items:[
      {n:'Quel est le mot de passe du Wi-Fi ?',t:{en:'What is the Wi-Fi password?',es:'¿Cuál es la contraseña del Wi-Fi?',de:'Wie lautet das WLAN-Passwort?',ru:'Kakoy parol ot Wi-Fi?',zh:'Wi-Fi mìmǎ shì shénme?',ja:'Wi-Fi no pasuwādo wa?',ht:'Kisa modpas Wi-Fi a ye?'}},
      {n:'Ma batterie est faible.',t:{en:'My battery is low.',es:'Mi batería está baja.',de:'Mein Akku ist leer.',ru:'Moy akkumulyator razryazhen.',zh:'Wǒ de diànchí mèiyǒu diàn le.',ja:'Batterī ga sukunai desu.',ht:'Batri m ap fini.'}},
      {n:'Où puis-je charger mon téléphone ?',t:{en:'Where can I charge my phone?',es:'¿Dónde puedo cargar mi teléfono?',de:'Wo kann ich mein Handy aufladen?',ru:'Gde ya mogu zaryadit telefon?',zh:'Wǒ kěyǐ zài nǎlǐ chōngdiàn?',ja:'Doko de jūden dekimasu ka?',ht:'Kote m ka chaje telefòn mwen?'}},
      {n:'Le lien ne fonctionne pas.',t:{en:'The link does not work.',es:'El enlace no funciona.',de:'Der Link funktioniert nicht.',ru:'Ssilka ne rabotaet.',zh:'Liánjiē bù xíng.',ja:'Rinku ga kinō shimasen.',ht:'Link lan pa mache.'}},
      {n:'Je t\'envoie un e-mail.',t:{en:'I am sending you an email.',es:'Te envío un correo.',de:'Ich schicke dir eine E-Mail.',ru:'Ya otpravlyayu tebe e-mail.',zh:'Wǒ gěi nǐ fā yóujiàn.',ja:'Mēru o okurimasu.',ht:'M ap voye yon imèl ba ou.'}},
      {n:'L\'écran est cassé.',t:{en:'The screen is broken.',es:'La pantalla está rota.',de:'Der Bildschirm ist kaputt.',ru:'Ekran sloman.',zh:'Píngmù huài le.',ja:'Gamen ga warete imasu.',ht:'Ekran an kase.'}},
    ]
  },
  maison_taches: {
    fr:'À la Maison',en:'At Home',es:'En Casa',ht:'Nan Kay la',de:'Zu Hause',ru:'Doma',zh:'Zai jia',ja:'Ie de',
    icon:'🏠',
    items:[
      {n:'Peux-tu fermer la porte ?',t:{en:'Can you close the door?',es:'¿Puedes cerrar la puerta?',de:'Kannst du die Tür schließen?',ru:'Mozhesh zakryt dver?',zh:'Nǐ néng guān mén ma?',ja:'Doa o shimete kuremasu ka?',ht:'Èske ou ka fèmen pòt la?'}},
      {n:'Je vais faire la cuisine.',t:{en:'I am going to cook.',es:'Voy a cocinar.',de:'Ich werde kochen.',ru:'Ya budu gotovit.',zh:'Wǒ yào zuò fàn.',ja:'Ryōri o shimasu.',ht:'M pral fè manje.'}},
      {n:'Où sont mes clés ?',t:{en:'Where are my keys?',es:'¿Dónde están mis llaves?',de:'Wo sind meine Schlüssel?',ru:'Gde moi klyuchi?',zh:'Wǒ de yàoshi zài nǎlǐ?',ja:'Kagi wa doko desu ka?',ht:'Kote kle m yo ye?'}},
      {n:'Il faut nettoyer la chambre.',t:{en:'We must clean the room.',es:'Hay que limpiar el cuarto.',de:'Wir müssen das Zimmer putzen.',ru:'Nuzhno ubrat komnatu.',zh:'Wǒmen děi dǎsǎo fángjiān.',ja:'Heya o sōji shinakereba narimasen.',ht:'Fòk nou netwaye chanm nan.'}},
      {n:'La lumière est allumée.',t:{en:'The light is on.',es:'La luz está encendida.',de:'Das Licht ist an.',ru:'Svet gorit.',zh:'Dēng liàng zhuo.',ja:'Denki ga tsuite imasu.',ht:'Limyè a limen.'}},
      {n:'Je vais me coucher.',t:{en:'I am going to bed.',es:'Me voy a la cama.',de:'Ich gehe ins Bett.',ru:'Ya idu spat.',zh:'Wǒ yào qù shuìjiào le.',ja:'Neru jikan desu.',ht:'M pral dòmi.'}},
    ]
  },
  sorties_rendezvous: {
    fr:'Sorties',en:'Going Out',es:'Salidas',ht:'Soti',de:'Ausgehen',ru:'Progulki',zh:'Wanchu',ja:'Goshutsu',
    icon:'📅',
    items:[
      {n:'On se voit à quelle heure ?',t:{en:'What time shall we meet?',es:'¿A qué hora nos vemos?',de:'Wann treffen wir uns?',ru:'Vo skolko vstretimsya?',zh:'Wǒmen jǐ diǎn jiànmiàn?',ja:'Nan-ji ni aimashō ka?',ht:'Ki lè n ap wè?'}},
      {n:'Je t\'attends devant le cinéma.',t:{en:'I am waiting for you in front of the cinema.',es:'Te espero delante del cine.',de:'Ich warte vor dem Kino auf dich.',ru:'Ya zhdu tebya pered kinoteatrom.',zh:'Wǒ zài diànyǐngyuàn qiánmiàn děng nǐ.',ja:'Eigakan no mae de matte imasu.',ht:'M ap tann ou devan sinema a.'}},
      {n:'C\'est l\'heure d\'y aller.',t:{en:'It is time to go.',es:'Es hora de irse.',de:'Es ist Zeit zu gehen.',ru:'Pora idti.',zh:'Gāi zǒu le.',ja:'Iku jikan desu.',ht:'Lè a rive pou n ale.'}},
      {n:'Tu es prêt(e) ?',t:{en:'Are you ready?',es:'¿Estás listo/a?',de:'Bist du bereit?',ru:'Ty gotov(a)?',zh:'Nǐ zhǔnbèi hǎole ma?',ja:'Junbi wa ii desu ka?',ht:'Èske ou pare?'}},
      {n:'Je suis en chemin.',t:{en:'I am on my way.',es:'Estoy en camino.',de:'Ich bin auf dem Weg.',ru:'Ya v puti.',zh:'Wǒ zài lùshàng.',ja:'Mukatte imasu.',ht:'Mwen sou wout.'}},
      {n:'Voulez-vous sortir ce soir ?',t:{en:'Do you want to go out tonight?',es:'¿Quiere salir esta noche?',de:'Wollen Sie heute Abend ausgehen?',ru:'Hochesh poyti kuda-nibud vecherom?',zh:'Nǐ jīnwǎn xiǎng chūqù ma?',ja:'Konban dekakemasen ka?',ht:'Èske ou vle soti aswè a?'}},
    ]
  },
  temps_duree: {
    fr:'Durée',en:'Duration',es:'Duración',ht:'Dire',de:'Dauer',ru:'Dlitelnost',zh:'Shijian',ja:'Kikan',
    icon:'⏳',
    items:[
      {n:'Combien de temps ça prend ?',t:{en:'How long does it take?',es:'¿Cuánto tiempo se tarda?',de:'Wie lange dauert das?',ru:'Skolko vremeni eto zaymet?',zh:'Zhège yào duō jiǔ?',ja:'Dono kurai kakarimasu ka?',ht:'Konbyen tan sa ap pran?'}},
      {n:'Attends une minute.',t:{en:'Wait a minute.',es:'Espera un minuto.',de:'Warte eine Minute.',ru:'Podozhdi minutu.',zh:'Děng yīxià.',ja:'Chotto matte.',ht:'Tann yon minit.'}},
      {n:'Il est trop tard.',t:{en:'It is too late.',es:'Es demasiado tarde.',de:'Es ist zu spät.',ru:'Slishkom pozdno.',zh:'Tài wǎn le.',ja:'Ososugi masu.',ht:'Li twò ta.'}},
      {n:'C\'est pour bientôt.',t:{en:'It is coming soon.',es:'Es para pronto.',de:'Es ist bald soweit.',ru:'Eto skoro budet.',zh:'Kuài le.',ja:'Mōsugu desu.',ht:'Se pou talè.'}},
      {n:'Je n\'ai pas le temps.',t:{en:'I don\'t have time.',es:'No tengo tiempo.',de:'Ich habe keine Zeit.',ru:'U menya net vremeni.',zh:'Wǒ méiyǒu shíjiān.',ja:'Jikan ga arimasen.',ht:'M pa gen tan.'}},
      {n:'Depuis quand es-tu ici ?',t:{en:'Since when have you been here?',es:'¿Desde cuándo estás aquí?',de:'Seit wann bist du hier?',ru:'Kak dolgo ty zdes?',zh:'Nǐ lái zhèlǐ duōjiǔ le?',ja:'Itsu kara koko ni imasu ka?',ht:'Depi ki lè ou la?'}},
    ]
  },
  sport_sante_vie: {
    fr:'Sport & Santé',en:'Sport & Health',es:'Deporte',ht:'Spò ak Sante',de:'Sport',ru:'Sport',zh:'Yundong',ja:'Supōtsu',
    icon:'🏃',
    items:[
      {n:'Je vais à la salle de sport.',t:{en:'I am going to the gym.',es:'Voy al gimnasio.',de:'Ich gehe ins Fitnessstudio.',ru:'Ya idu v sportzal.',zh:'Wǒ qù jiànshēnfáng.',ja:'Jimu ni ikimasu.',ht:'M pral nan jim.'}},
      {n:'Je dois boire plus d\'eau.',t:{en:'I need to drink more water.',es:'Tengo que beber más agua.',de:'Ich muss mehr Wasser trinken.',ru:'Mne nuzhno pit bolshe vody.',zh:'Wǒ děi duō hē shuǐ.',ja:'Motto mizu o nomanaito.',ht:'Mwen dwe bwè plis dlo.'}},
      {n:'Est-ce que tu fais du sport ?',t:{en:'Do you play sports?',es:'¿Haces deporte?',de:'Treibst du Sport?',ru:'Ty zanimaeshsya sportom?',zh:'Nǐ yùndòng ma?',ja:'Supōtsu o shimasu ka?',ht:'Èske ou fè spò?'}},
      {n:'Je suis en pleine forme.',t:{en:'I am in great shape.',es:'Estoy en plena forma.',de:'Ich bin topfit.',ru:'Ya v horoshey forme.',zh:'Wǒ jīngshén hěn hǎo.',ja:'Totemo genki desu.',ht:'Mwen anfòm anpil.'}},
      {n:'J\'ai besoin de dormir.',t:{en:'I need to sleep.',es:'Necesito dormir.',de:'Ich muss schlafen.',ru:'Mne nuzhno pospat.',zh:'Wǒ xūyào shuìjiào.',ja:'Neru hitsuyō ga arimasu.',ht:'Mwen bezwen dòmi.'}},
      {n:'Quel est ton sport préféré ?',t:{en:'What is your favorite sport?',es:'¿Cuál es tu deporte favorito?',de:'Was ist dein Lieblingssport?',ru:'Kakoy tvoy lyubimiy sport?',zh:'Nǐ zuì xǐhuān shénme yùndòng?',ja:'Suki na supōtsu wa nani?',ht:'Ki spò ou pi renmen?'}},
    ]
  },
  expressions_familieres: {
    fr:'Argot & Familier',en:'Slang & Casual',es:'Jerga',ht:'Palanperen',de:'Umgangssprache',ru:'Sleng',zh:'Kouyu',ja:'Zokugo',
    icon:'😎',
    items:[
      {n:'Ça roule ?',t:{en:'How’s it going?',es:'¿Todo bien?',de:'Läuft’s?',ru:'Kak ono?',zh:'Hái hǎo ma?',ja:'Chōshi dō?',ht:'Sa k ap fèt?'},struct:{n:'Expression pour demander si ça va',t:{en:'Casual way to ask how it is going'}}},
      {n:'Laisse tomber.',t:{en:'Drop it / Forget it.',es:'Déjalo.',de:'Vergiss es.',ru:'Zabey.',zh:'Suàn le.',ja:'Mou ii yo.',ht:'Kite sa.'},struct:{n:'Laissez + tomber (impératif)',t:{en:'Let + fall'}}},
      {n:'Je suis mort de rire.',t:{en:'I am dying of laughter.',es:'Me muero de risa.',de:'Ich lach mich tot.',ru:'Ya umirayu ot smeha.',zh:'Xiào sǐ wǒ le.',ja:'Ukeru!',ht:'M mouri ak ri.'}},
      {n:'C\'est ouf !',t:{en:'That\'s crazy!',es:'¡Es una locura!',de:'Krass!',ru:'Eto kruto!',zh:'Tài fēngkuáng le!',ja:'Yabai!',ht:'Se bagay de fou!'},struct:{n:'Verlan de "fou"',t:{en:'Slang for crazy'}}},
      {n:'T\'inquiète !',t:{en:'Don\'t worry!',es:'¡No te rayes!',de:'Keine Sorge!',ru:'Ne par’sya!',zh:'Bié dānxīn!',ja:'Donmai!',ht:'Pa okipe w!'},struct:{n:'Abréviation de "ne t\'inquiète pas"',t:{en:'Short for don\'t worry'}}},
      {n:'Ça te dit ?',t:{en:'Are you up for it?',es:'¿Te apetece?',de:'Hast du Lust?',ru:'Kak tebe ideya?',zh:'Nǐ xiǎng qù ma?',ja:'Dō kana?',ht:'Sa di ou?'}},
      {n:'C\'est nickel.',t:{en:'It\'s perfect / spotless.',es:'Está niquelado.',de:'Alles bestens.',ru:'Vse chotko.',zh:'Tài bàng le.',ja:'Batchiri.',ht:'Li nikèl.'}},
      {n:'Je me casse.',t:{en:'I’m out / I’m leaving.',es:'Me piro.',de:'Ich verpiss mich.',ru:'Ya svalivayu.',zh:'Wǒ zǒu le.',ja:'Kaeru wa.',ht:'M ale.'}},
    ]
  },
   reactions_spontanees: {
    fr:'Réactions',en:'Reactions',es:'Reacciones',ht:'Reyaksyon',de:'Reaktionen',ru:'Reaktsii',zh:'Fǎnyìng',ja:'Hannō',
    icon:'😲',
    items:[
      {n:'Pas de soucis.',t:{en:'No worries.',es:'Sin problema.',de:'Kein Ding.',ru:'Bez problem.',zh:'Méi wèntí.',ja:'Mondai nai.',ht:'Pa gen pwoblèm.'}},
      {n:'Tu rigoles ou quoi ?',t:{en:'Are you kidding me?',es:'¿Estás de broma?',de:'Machst du Witze?',ru:'Ty shutish?',zh:'Nǐ zài kāi wánxiào ma?',ja:'Jōdan desho?',ht:'W ap bay blag oswa kisa?'}},
      {n:'J\'en ai marre.',t:{en:'I\'m fed up.',es:'Estoy harto/a.',de:'Ich habe die Nase voll.',ru:'S menya hvatit.',zh:'Wǒ shòu bùliǎo le.',ja:'Mou iya da.',ht:'M bouke.'}},
      {n:'On fait quoi ?',t:{en:'What are we doing?',es:'¿Qué hacemos?',de:'Was machen wir?',ru:'Chto delaem?',zh:'Wǒmen zuò shénme?',ja:'Nani suru?',ht:'Sa n ap fè?'}},
      {n:'C\'est pas grave.',t:{en:'It\'s no big deal.',es:'No pasa nada.',de:'Nicht so schlimm.',ru:'Nichego strashnogo.',zh:'Méiguānxì.',ja:'Daijōbu.',ht:'Sa pa anyen.'}},
      {n:'Carrément !',t:{en:'Totally!',es:'¡Totalmente!',de:'Auf jeden Fall!',ru:'Tochno!',zh:'Dāngrán!',ja:'Sono tōri!',ht:'Kareman!'}},
      {n:'N\'importe quoi !',t:{en:'Nonsense!',es:'¡Cualquier cosa!',de:'Quatsch!',ru:'Chto za bred!',zh:'Húshuō bàdào!',ja:'Detarame!',ht:'Nenpòt kisa!'}},
    ]
  },
  sortir_amis: {
    fr:'Entre Amis',en:'With Friends',es:'Con Amigos',ht:'Ak Zanmi',de:'Mit Freunden',ru:'S druzyami',zh:'Pengyou',ja:'Tomodachi',
    icon:'🍻',
    items:[
      {n:'On se capte plus tard ?',t:{en:'Shall we catch up later?',es:'¿Hablamos luego?',de:'Wollen wir uns später treffen?',ru:'Perekishemsya pozzhe?',zh:'Wǒmen děng xià jiàn?',ja:'Ato de aō ka?',ht:'N a wè pita?'}},
      {n:'Je suis chaud !',t:{en:'I\'m down / I\'m up for it!',es:'¡Me apunto!',de:'Ich bin dabei!',ru:'Ya v dele!',zh:'Wǒ hěn xiǎng qù!',ja:'Yaruki manman!',ht:'Mwen cho!'},struct:{n:'Être chaud = être motivé',t:{en:'To be hot = to be motivated'}}},
      {n:'Viens, on bouge.',t:{en:'Come on, let\'s move.',es:'Venga, vámonos.',de:'Komm, wir gehen.',ru:'Davay, poyhali.',zh:'Zǒu ba.',ja:'Ikō ze.',ht:'Vini, ann bouje.'}},
      {n:'Il y a trop de monde ici.',t:{en:'There are too many people here.',es:'Hay demasiada gente.',de:'Hier ist zu viel los.',ru:'Zdes slishkom mnogo naroda.',zh:'Zhèlǐ rén tài duō le.',ja:'Hito ga oosugiru.',ht:'Gen twòp moun isit la.'}},
      {n:'C\'est ma tournée !',t:{en:'This round is on me!',es:'¡Esta ronda la pago yo!',de:'Ich geb eine Runde aus!',ru:'Ya prostavlyayus!',zh:'Zhè dùn wǒ qǐng kè!',ja:'Ogoi da yo!',ht:'Se tou pa m!'}},
      {n:'Tu fais quoi de beau ?',t:{en:'What are you up to?',es:'¿Qué cuentas?',de:'Was treibst du so?',ru:'Chto horoshego?',zh:'Nǐ zài máng shénme?',ja:'Nani shiteru no?',ht:'Sa w ap fè ki bon?'}},
    ]
  },
  boulot_familier: {
    fr:'Le Boulot',en:'The Job',es:'El Curro',ht:'Boulot',de:'Der Job',ru:'Rabota',zh:'Gongzuo',ja:'Shigoto',
    icon:'👨‍💻',
    items:[
      {n:'J\'ai trop de boulot.',t:{en:'I have too much work.',es:'Tengo mucho curro.',de:'Ich habe zu viel zu tun.',ru:'U menya zaval na rabote.',zh:'Wǒ gōngzuò tài duō le.',ja:'Shigoto ga oosugiru.',ht:'M gen twòp travay.'}},
      {n:'On fait une pause ?',t:{en:'Shall we take a break?',es:'¿Hacemos un descanso?',de:'Machen wir eine Pause?',ru:'Sdelaem pereryv?',zh:'Wǒmen xiūxi yīxià ba?',ja:'Kyūkei shiyō ka?',ht:'Ann fè yon pòz?'}},
      {n:'Je suis en réunion, je te rappelle.',t:{en:'I\'m in a meeting, I\'ll call you back.',es:'Estoy en una reunión, te llamo luego.',de:'Ich bin im Meeting, ich ruf dich zurück.',ru:'Ya na soveshanii, perezvonyu.',zh:'Wǒ zài kāihuì, hòulái dǎ gěi nǐ.',ja:'Kaigichū dakara, ato de kakeru ne.',ht:'M nan reyinyon, m ap rele w ankò.'}},
      {n:'C\'est pas mon truc.',t:{en:'It\'s not my thing.',es:'No es lo mío.',de:'Das ist nicht mein Ding.',ru:'Eto ne moe.',zh:'Wǒ bù xǐhuān zhège.',ja:'Nigate da na.',ht:'Se pa bagay mwen.'}},
      {n:'Bon courage !',t:{en:'Good luck / Hang in there!',es:'¡Ánimo!',de:'Viel Erfolg!',ru:'Udachi!',zh:'Jiāyóu!',ja:'Ganbatte!',ht:'Bon kouraj!'}},
    ]
  },
  voyage_aeroport: {
    fr:'Voyage',en:'Travel',es:'Viaje',ht:'Vwayaj',de:'Reisen',ru:'Puteshestvie',zh:'Lvxing',ja:'Ryoko',
    icon:'✈️',
    items:[
      {n:'À quelle heure est l\'embarquement ?',t:{en:'What time is boarding?',es:'¿A qué hora es el embarque?',de:'Wann ist das Boarding?',ru:'Vo skolko posadka?',zh:'Ji diǎn dēngjī?',ja:'Tojo wa nan-ji desu ka?',ht:'Ki lè anbakman an ye?'}},
      {n:'Voici mon passeport.',t:{en:'Here is my passport.',es:'Aquí está mi pasaporte.',de:'Hier ist mein Reisepass.',ru:'Vot moy pasport.',zh:'Zhè shì wǒ de hùzhào.',ja:'Pasupōto desu.',ht:'Men paspò mwen.'}},
      {n:'Où sont les bagages ?',t:{en:'Where is the luggage?',es:'¿Dónde estã el equipaje?',de:'Wo ist das Gepäck?',ru:'Gde bagazh?',zh:'Xínglǐ zài nǎlǐ?',ja:'Nimotsu wa doko desu ka?',ht:'Kote valiz yo ye?'}},
      {n:'Le vol est annulé.',t:{en:'The flight is cancelled.',es:'El vuelo está cancelado.',de:'Der Flug ist gestrichen.',ru:'Reys otmenen.',zh:'Hángbān qǔxiāo le.',ja:'Fuiraito wa kyanseru desu.',ht:'Vòl la anile.'}},
      {n:'Avez-vous quelque chose à déclarer ?',t:{en:'Do you have anything to declare?',es:'¿Tiene algo que declarar?',de:'Haben Sie etwas zu verzollen?',ru:'Yest chto deklarirovat?',zh:'Nǐ yǒu shénme yào shēnbiào ma?',ja:'Shinkoku suru mono wa?',ht:'Èske ou gen kichòy pou deklare?'}},
    ]
  },
  shopping_details: {
    fr:'En magasin',en:'In store',es:'En la tienda',ht:'Nan magazen',de:'Im Geschäft',ru:'V magazine',zh:'Zai shangdian',ja:'Mise de',
    icon:'🛍️',
    items:[
      {n:'Je regarde seulement, merci.',t:{en:'I am just looking, thank you.',es:'Solo estoy mirando, gracias.',de:'Ich schaue nur, danke.',ru:'Ya prosto smotryu.',zh:'Wǒ zhǐshì kàn kàn.',ja:'Miteru dake desu.',ht:'M ap gade sèlman, mèsi.'}},
      {n:'Puis-je l\'essayer ?',t:{en:'Can I try it on?',es:'¿Puedo probármelo?',de:'Kann ich das anprobieren?',ru:'Mogu ya eto primerit?',zh:'Wǒ kěyǐ shì chuān ma?',ja:'Shichaku dekimasu ka?',ht:'Èske m ka eseye l?'}},
      {n:'Où sont les cabines d\'essayage ?',t:{en:'Where are the fitting rooms?',es:'¿Dónde están los probadores?',de:'Wo sind die Umkleidekabinen?',ru:'Gde primerochnye?',zh:'Shìyījiàn zài nǎlǐ?',ja:'Shichakushitsu wa doko?',ht:'Kote chanm eseye yo ye?'}},
      {n:'Je vais prendre celui-ci.',t:{en:'I will take this one.',es:'Me llevo este.',de:'Ich nehme dieses ici.',ru:'Ya vozmu eto.',zh:'Wǒ yào zhège.',ja:'Kore o kaimasu.',ht:'M ap pran sa a.'}},
      {n:'Avez-vous un sac ?',t:{en:'Do you have a bag?',es:'¿Tiene una bolsa?',de:'Haben Sie eine Tüte?',ru:'U vas yest paket?',zh:'Nǐ yǒu dǎbāo dài ma?',ja:'Fukuro wa arimasu ka?',ht:'Èske ou gen yon sak?'}},
    ]
  },
  sante_pharmacie: {
    fr:'Pharmacie',en:'Pharmacy',es:'Farmacia',ht:'Famasi',de:'Apotheke',ru:'Apteka',zh:'Yaodian',ja:'Yakkyoku',
    icon:'💊',
    items:[
      {n:'J\'ai besoin d\'un médicament pour la fièvre.',t:{en:'I need medicine for fever.',es:'Necesito algo para la fiebre.',de:'Ich brauche Fiebermittel.',ru:'Mne nuzhno lekarstvo ot zhara.',zh:'Wǒ xūyào tuìshāo yào.',ja:'Ketsu-yaku ga hitsuyo desu.',ht:'M bezwen yon medikaman pou lafyèv.'}},
      {n:'Je suis allergique aux noix.',t:{en:'I am allergic to nuts.',es:'Soy alérgico a las nueces.',de:'Ich bin allergisch gegen Nüsse.',ru:'U menya allergiya na orekhi.',zh:'Wǒ duì jiānguǒ guòmǐn.',ja:'Nattsu arerugī desu.',ht:'Mwen gen alèji ak nwa.'}},
      {n:'C\'est avec ou sans ordonnance ?',t:{en:'Is it with or without prescription?',es:'¿Es con o sin receta?',de:'Ist es mit oder ohne Rezept?',ru:'Eto po retseptu?',zh:'Yào chǔfāng ma?',ja:'Shohosen wa hitsuyo?',ht:'Èske se avèk oswa san òdonans?'}},
      {n:'J\'ai un rhume.',t:{en:'I have a cold.',es:'Tengo un resfriado.',de:'Ich habe eine Erkältung.',ru:'Ya prostudilsya.',zh:'Wǒ gǎnmào le.',ja:'Kaze o hikimashita.',ht:'Mwen gripé.'}},
      {n:'Où se trouve la pharmacie de garde ?',t:{en:'Where is the 24-hour pharmacy?',es:'¿Dónde estã la farmacia de guardia?',de:'Wo ist die Notapotheke?',ru:'Gde dezhurnaya apteka?',zh:'Nǎlǐ yǒu zhíbān yàodiàn?',ja:'Kyukan yakkyoku wa?',ht:'Kote famasi de gad la ye?'}},
    ]
  },
  opinions_accord: {
    fr:'Accord',en:'Agreement',es:'Acuerdo',ht:'Dakò',de:'Zustimmung',ru:'Soglasie',zh:'Tongyi',ja:'Doi',
    icon:'👍',
    items:[
      {n:'Tu as raison.',t:{en:'You are right.',es:'Tienes razón.',de:'Du hast recht.',ru:'Ty prav(a).',zh:'Nǐ shuō de duì.',ja:'Sono tōri desu.',ht:'Ou gen rezon.'}},
      {n:'Je ne pense pas.',t:{en:'I don\'t think so.',es:'No lo creo.',de:'Das glaube ich nicht.',ru:'Ya tak ne dumayu.',zh:'Wǒ bù zhème rènwéi.',ja:'Sō wa omoimasen.',ht:'M pa panse sa.'}},
      {n:'Bien sûr !',t:{en:'Of course!',es:'¡Claro que sí!',de:'Natürlich!',ru:'Konechno!',zh:'Dāngrán!',ja:'Mochiron!',ht:'Byen sir!'}},
      {n:'Peut-être.',t:{en:'Maybe.',es:'Tal vez.',de:'Vielleicht.',ru:'Mozhet byt.',zh:'Yěxǔ.',ja:'Tabun.',ht:'Petèt.'}},
      {n:'C\'est vrai.',t:{en:'It is true.',es:'Es verdad.',de:'Das ist wahr.',ru:'Eto pravda.',zh:'Zhè shì zhēn de.',ja:'Honto desu.',ht:'Se vre.'}},
    ]
  },
salutations_courantes: {
  fr:'Salutations',
  en:'Greetings',
  es:'Saludos',
  ht:'Bonjou / Salitasyon',
  de:'Begrüßungen',
  ru:'Privetstviya',
  zh:'Wenhou',
  ja:'Aisatsu',
  icon:'👋',
  items:[
    {n:'Salut !',t:{en:'Hi!',es:'¡Hola!',de:'Hallo!',ru:'Privet!',zh:'Nǐ hǎo!',ja:'Yā!',ht:'Bonjou!'}},
    {n:'Ça va ?',t:{en:'How are you?',es:'¿Cómo estás?',de:'Wie geht’s?',ru:'Kak dela?',zh:'Nǐ hǎo ma?',ja:'Genki?',ht:'Kijan ou ye?'}},
    {n:'Quoi de neuf ?',t:{en:'What’s new?',es:'¿Qué hay de nuevo?',de:'Was gibt’s Neues?',ru:'Chto novogo?',zh:'Yǒu shénme xīn de?',ja:'Nani ga atarashii?',ht:'Ki nouvèl?'}},
    {n:'Ça fait longtemps !',t:{en:'Long time no see!',es:'¡Cuánto tiempo!',de:'Lange nicht gesehen!',ru:'Davnenko ne videlis!',zh:'Hǎojiǔ bù jiàn!',ja:'Hisashiburi!',ht:'Sa fè lontan!'}},
    {n:'Content de te voir.',t:{en:'Nice to see you.',es:'Me alegra verte.',de:'Freut mich dich zu sehen.',ru:'Rad tebya videt.',zh:'Hěn gāoxìng jiàn dào nǐ.',ja:'Aete ureshii.',ht:'M kontan wè ou.'}},
  ]
},
  conversation_simple: {
  fr:'Conversation simple',
  en:'Basic conversation',
  es:'Conversación básica',
  ht:'Konvèsasyon senp',
  de:'Einfache Gespräche',
  ru:'Prostoy razgovor',
  zh:'Jiandan duihua',
  ja:'Kantan na kaiwa',
  icon:'💬',
  items:[
    {n:'Attends une seconde.',t:{en:'Wait a second.',es:'Espera un segundo.',de:'Warte eine Sekunde.',ru:'Podozhdi sekundu.',zh:'Děng yíxià.',ja:'Chotto matte.',ht:'Tann yon segond.'}},
    {n:'Je reviens.',t:{en:'I’ll be back.',es:'Ya vuelvo.',de:'Ich komme zurück.',ru:'Ya vernus.',zh:'Wǒ huí lái.',ja:'Sugu modoru.',ht:'M ap tounen.'}},
    {n:'Pas de problème.',t:{en:'No problem.',es:'No hay problema.',de:'Kein Problem.',ru:'Bez problem.',zh:'Méi wèntí.',ja:'Mondai nai.',ht:'Pa gen pwoblèm.'}},
    {n:'Je comprends.',t:{en:'I understand.',es:'Entiendo.',de:'Ich verstehe.',ru:'Ya ponimayu.',zh:'Wǒ míngbai.',ja:'Wakarimasu.',ht:'M konprann.'}},
    {n:'Je ne comprends pas.',t:{en:'I don’t understand.',es:'No entiendo.',de:'Ich verstehe nicht.',ru:'Ya ne ponimayu.',zh:'Wǒ bù míngbai.',ja:'Wakarimasen.',ht:'M pa konprann.'}},
  ]
},
    reactions: {
  fr:'Réactions',
  en:'Reactions',
  es:'Reacciones',
  ht:'Reyaksyon',
  de:'Reaktionen',
  ru:'Reaktsii',
  zh:'Fanying',
  ja:'Hannō',
  icon:'😮',
  items:[
    {n:'Sérieux ?',t:{en:'Seriously?',es:'¿En serio?',de:'Ernsthaft?',ru:'Pravda?',zh:'Zhēn de?',ja:'Hontō?',ht:'Vrèman?'}},
    {n:'Incroyable !',t:{en:'Unbelievable!',es:'¡Increíble!',de:'Unglaublich!',ru:'Neveroyatno!',zh:'Bùkěsīyì!',ja:'Shinjirarenai!',ht:'Enkwayab!'}},
    {n:'C’est génial !',t:{en:'That’s awesome!',es:'¡Genial!',de:'Das ist super!',ru:'Eto zdorovo!',zh:'Tài bàng le!',ja:'Sugoi!',ht:'Sa bon anpil!'}},
    {n:'Quel dommage.',t:{en:'What a pity.',es:'Qué lástima.',de:'Schade.',ru:'Zhal.',zh:'Zhēn kěxī.',ja:'Zannen.',ht:'Ala domaj.'}},
    {n:'Pas possible.',t:{en:'No way.',es:'No puede ser.',de:'Unmöglich.',ru:'Ne mozhet byt.',zh:'Bù kěnéng.',ja:'Arienai.',ht:'Sa pa posib.'}},
  ]
},
 questions_quotidiennes:{
  fr:'Questions quotidiennes',
  en:'Daily questions',
  es:'Preguntas diarias',
  ht:'Kesyon chak jou',
  de:'Alltägliche Fragen',
  ru:'Povsednevnye voprosy',
  zh:'Rìcháng wèntí',
  ja:'Nichijō no shitsumon',
  icon:'❓',
  items:[
    {n:'Comment ça va ?',t:{en:'How are you?',es:'¿Cómo estás?',de:'Wie geht es dir?',ru:'Kak dela?',zh:'Nǐ hǎo ma?',ja:'Genki desu ka?',ht:'Kijan ou ye?'}},
    {n:'Que fais-tu ?',t:{en:'What are you doing?',es:'¿Qué haces?',de:'Was machst du?',ru:'Chto ty delayesh?',zh:'Nǐ zài zuò shénme?',ja:'Nani shiteru?',ht:'Kisa w ap fè?'}},
    {n:'Où es-tu ?',t:{en:'Where are you?',es:'¿Dónde estás?',de:'Wo bist du?',ru:'Gde ty?',zh:'Nǐ zài nǎlǐ?',ja:'Doko ni iru?',ht:'Ki kote ou ye?'}},
    {n:'Tu viens ?',t:{en:'Are you coming?',es:'¿Vienes?',de:'Kommst du?',ru:'Ty pridyosh?',zh:'Nǐ lái ma?',ja:'Kuru no?',ht:'Ou ap vini?'}},
    {n:'Tu es occupé ?',t:{en:'Are you busy?',es:'¿Estás ocupado?',de:'Bist du beschäftigt?',ru:'Ty zanyat?',zh:'Nǐ máng ma?',ja:'Isogashii?',ht:'Ou okipe?'}},
    {n:'Tu peux m’aider ?',t:{en:'Can you help me?',es:'¿Puedes ayudarme?',de:'Kannst du mir helfen?',ru:'Ty mozhesh pomoch?',zh:'Nǐ néng bāng wǒ ma?',ja:'Tetsudatte?',ht:'Ou ka ede m?'}},
    {n:'C’est combien ?',t:{en:'How much is it?',es:'¿Cuánto cuesta?',de:'Wie viel kostet es?',ru:'Skolko eto stoit?',zh:'Duōshao qián?',ja:'Ikura?',ht:'Konbyen sa koute?'}},
    {n:'Tu habites où ?',t:{en:'Where do you live?',es:'¿Dónde vives?',de:'Wo wohnst du?',ru:'Gde ty zhivyosh?',zh:'Nǐ zhù zài nǎlǐ?',ja:'Doko ni sunderu?',ht:'Ki kote w ap viv?'}},
    {n:'Tu travailles ?',t:{en:'Do you work?',es:'¿Trabajas?',de:'Arbeitest du?',ru:'Ty rabotayesh?',zh:'Nǐ gōngzuò ma?',ja:'Hataraiteru?',ht:'Ou travay?'}},
    {n:'Tu as faim ?',t:{en:'Are you hungry?',es:'¿Tienes hambre?',de:'Hast du Hunger?',ru:'Ty goloden?',zh:'Nǐ è ma?',ja:'Onaka suita?',ht:'Ou grangou?'}},

    {n:'Tu as soif ?',t:{en:'Are you thirsty?',es:'¿Tienes sed?',de:'Hast du Durst?',ru:'Ty khochesh pit?',zh:'Nǐ kě ma?',ja:'Nodo kawa ita?',ht:'Ou swaf?'}},
    {n:'Tu viens d’où ?',t:{en:'Where are you from?',es:'¿De dónde eres?',de:'Woher kommst du?',ru:'Otkuda ty?',zh:'Nǐ cóng nǎlǐ lái?',ja:'Doko kara kita?',ht:'Ki kote ou soti?'}},
    {n:'Quel âge as-tu ?',t:{en:'How old are you?',es:'¿Cuántos años tienes?',de:'Wie alt bist du?',ru:'Skolko tebe let?',zh:'Nǐ duō dà?',ja:'Nansai?',ht:'Ki laj ou?'}},
    {n:'Tu comprends ?',t:{en:'Do you understand?',es:'¿Entiendes?',de:'Verstehst du?',ru:'Ty ponimayesh?',zh:'Nǐ dǒng ma?',ja:'Wakarimasu ka?',ht:'Ou konprann?'}},
    {n:'Tu peux répéter ?',t:{en:'Can you repeat?',es:'¿Puedes repetir?',de:'Kannst du wiederholen?',ru:'Povtori.',zh:'Nǐ néng zài shuō yí cì ma?',ja:'Mō ichido?',ht:'Ou ka repete?'}},
    {n:'Pourquoi ?',t:{en:'Why?',es:'¿Por qué?',de:'Warum?',ru:'Pochemu?',zh:'Wèishéme?',ja:'Naze?',ht:'Poukisa?'}},
    {n:'Quand ?',t:{en:'When?',es:'¿Cuándo?',de:'Wann?',ru:'Kogda?',zh:'Shénme shíhou?',ja:'Itsu?',ht:'Kilè?'}},
    {n:'Avec qui ?',t:{en:'With who?',es:'¿Con quién?',de:'Mit wem?',ru:'S kem?',zh:'Gēn shéi?',ja:'Dare to?',ht:'Ak kiyès?'}},
    {n:'Tu es prêt ?',t:{en:'Are you ready?',es:'¿Estás listo?',de:'Bist du bereit?',ru:'Ty gotov?',zh:'Nǐ zhǔnbèi hǎo le ma?',ja:'Junbi ii?',ht:'Ou pare?'}},
    {n:'On y va ?',t:{en:'Shall we go?',es:'¿Vamos?',de:'Gehen wir?',ru:'Poydyom?',zh:'Wǒmen zǒu ma?',ja:'Ikō?',ht:'Ann ale?'}},

    {n:'Tu es sûr ?',t:{en:'Are you sure?',es:'¿Estás seguro?',de:'Bist du sicher?',ru:'Ty uveren?',zh:'Nǐ quèdìng ma?',ja:'Hontō?',ht:'Ou sèten?'}},
    {n:'Ça marche ?',t:{en:'Does it work?',es:'¿Funciona?',de:'Funktioniert es?',ru:'Rabotaet?',zh:'Kěyǐ ma?',ja:'Daijōbu?',ht:'Sa mache?'}},
    {n:'Tu veux venir ?',t:{en:'Do you want to come?',es:'¿Quieres venir?',de:'Willst du kommen?',ru:'Khochesh priyti?',zh:'Nǐ xiǎng lái ma?',ja:'Kuru?',ht:'Ou vle vini?'}},
    {n:'Tu as du temps ?',t:{en:'Do you have time?',es:'¿Tienes tiempo?',de:'Hast du Zeit?',ru:'U tebya est vremya?',zh:'Nǐ yǒu shíjiān ma?',ja:'Jikan aru?',ht:'Ou gen tan?'}},
    {n:'On se voit quand ?',t:{en:'When do we meet?',es:'¿Cuándo nos vemos?',de:'Wann sehen wir uns?',ru:'Kogda vstretimsya?',zh:'Wǒmen shénme shíhou jiàn?',ja:'Itsu au?',ht:'Kilè n ap wè?'}},
  ]
  },
  reponses_rapides:{
  fr:'Réponses rapides',
  en:'Quick answers',
  es:'Respuestas rápidas',
  ht:'Repons rapid',
  de:'Schnelle Antworten',
  ru:'Bystrye otvety',
  zh:'Kuai su huida',
  ja:'Sugu no kotae',
  icon:'⚡',
  items:[
    {n:'Oui.',t:{en:'Yes.',es:'Sí.',de:'Ja.',ru:'Da.',zh:'Shì.',ja:'Hai.',ht:'Wi.'}},
    {n:'Non.',t:{en:'No.',es:'No.',de:'Nein.',ru:'Net.',zh:'Bù.',ja:'Iie.',ht:'Non.'}},
    {n:'Peut-être.',t:{en:'Maybe.',es:'Tal vez.',de:'Vielleicht.',ru:'Mozhet byt.',zh:'Yexu.',ja:'Tabun.',ht:'Petèt.'}},
    {n:'Bien sûr.',t:{en:'Of course.',es:'Claro.',de:'Natürlich.',ru:'Konechno.',zh:'Dangran.',ja:'Mochiron.',ht:'Byen sir.'}},
    {n:'Pourquoi pas ?',t:{en:'Why not?',es:'¿Por qué no?',de:'Warum nicht?',ru:'Pochemu net?',zh:'Weishenme bu?',ja:'Naze dame?',ht:'Poukisa pa?'}},
    {n:'Exact.',t:{en:'Exactly.',es:'Exacto.',de:'Genau.',ru:'Tochno.',zh:'Zhengque.',ja:'Seikaku.',ht:'Egzak.'}},
    {n:'Pas vraiment.',t:{en:'Not really.',es:'No realmente.',de:'Nicht wirklich.',ru:'Ne sovsem.',zh:'Bu tai.',ja:'Amari.',ht:'Pa twòp.'}},
    {n:'Je crois.',t:{en:'I think so.',es:'Creo que sí.',de:'Ich denke schon.',ru:'Dumayu da.',zh:'Wo xiang shi.',ja:'Sō omou.',ht:'M panse wi.'}},
    {n:'Je ne crois pas.',t:{en:'I don’t think so.',es:'No lo creo.',de:'Ich glaube nicht.',ru:'Ne dumayu.',zh:'Wo bu renwei.',ja:'Sō wa omowanai.',ht:'M pa panse sa.'}},
    {n:'D’accord.',t:{en:'Okay.',es:'De acuerdo.',de:'Okay.',ru:'Ladno.',zh:'Hao ba.',ja:'Ōkē.',ht:'Dakò.'}},
    {n:'Pas de souci.',t:{en:'No worries.',es:'No hay problema.',de:'Kein Problem.',ru:'Bez problem.',zh:'Mei wenti.',ja:'Mondai nai.',ht:'Pa gen pwoblèm.'}},
    {n:'Aucun problème.',t:{en:'No problem.',es:'Sin problema.',de:'Kein Problem.',ru:'Bez problem.',zh:'Mei wenti.',ja:'Daijobu.',ht:'Pa gen pwoblèm.'}},
    {n:'Ça dépend.',t:{en:'It depends.',es:'Depende.',de:'Kommt darauf an.',ru:'Zavisit.',zh:'Kan qingkuang.',ja:'Baai ni yoru.',ht:'Sa depan.'}},
    {n:'Bonne idée.',t:{en:'Good idea.',es:'Buena idea.',de:'Gute Idee.',ru:'Khoroshaya ideya.',zh:'Hao zhuyi.',ja:'Ii kangae.',ht:'Bon lide.'}},
    {n:'Mauvaise idée.',t:{en:'Bad idea.',es:'Mala idea.',de:'Schlechte Idee.',ru:'Plokhaya ideya.',zh:'Huai zhuyi.',ja:'Yoku nai.',ht:'Move lide.'}},
  ]
  },
conversation_amis:{
  fr:'Entre amis',
  en:'Friends conversation',
  es:'Conversación entre amigos',
  ht:'Pale ant zanmi',
  de:'Freundesgespräch',
  ru:'Razgovor druzey',
  zh:'Pengyou duihua',
  ja:'Tomodachi kaiwa',
  icon:'🧑‍🤝‍🧑',
  items:[
    {n:'Quoi de neuf ?',t:{en:'What’s new?',es:'¿Qué hay de nuevo?',de:'Was gibt’s Neues?',ru:'Chto novogo?',zh:'You shenme xin de?',ja:'Nani ga atarashii?',ht:'Ki nouvèl?'}},
    {n:'Tu fais quoi ?',t:{en:'What are you doing?',es:'¿Qué haces?',de:'Was machst du?',ru:'Chto delayesh?',zh:'Ni zai zuo shenme?',ja:'Nani shiteru?',ht:'Kisa w ap fè?'}},
    {n:'Je m’ennuie.',t:{en:'I’m bored.',es:'Estoy aburrido.',de:'Mir ist langweilig.',ru:'Mne skuchno.',zh:'Wo hen wuliao.',ja:'Taikutsu.',ht:'M anwiye.'}},
    {n:'On sort ?',t:{en:'Shall we go out?',es:'¿Salimos?',de:'Gehen wir raus?',ru:'Poydyom?',zh:'Chuqu ma?',ja:'Deru?',ht:'Ann soti?'}},
    {n:'Allons manger.',t:{en:'Let’s eat.',es:'Vamos a comer.',de:'Lass uns essen.',ru:'Poydyom kushat.',zh:'Women chi fan ba.',ja:'Tabeyou.',ht:'Ann manje.'}},
    {n:'Je suis fatigué.',t:{en:'I’m tired.',es:'Estoy cansado.',de:'Ich bin müde.',ru:'Ya ustal.',zh:'Wo lei le.',ja:'Tsukareta.',ht:'M bouke.'}},
    {n:'Je suis prêt.',t:{en:'I’m ready.',es:'Estoy listo.',de:'Ich bin bereit.',ru:'Ya gotov.',zh:'Wo zhunbei hao le.',ja:'Junbi ok.',ht:'M pare.'}},
    {n:'Attends-moi.',t:{en:'Wait for me.',es:'Espérame.',de:'Warte auf mich.',ru:'Podozhdi menya.',zh:'Deng wo.',ja:'Matte.',ht:'Tann mwen.'}},
    {n:'Je viens.',t:{en:'I’m coming.',es:'Ya voy.',de:'Ich komme.',ru:'Ya idu.',zh:'Wo lai le.',ja:'Ima iku.',ht:'M ap vini.'}},
    {n:'On se voit plus tard.',t:{en:'See you later.',es:'Nos vemos.',de:'Bis später.',ru:'Uvidimsya.',zh:'Dai hui jian.',ja:'Mata ato de.',ht:'N ap wè pita.'}},
    {n:'Ça me va.',t:{en:'Works for me.',es:'Me parece bien.',de:'Passt mir.',ru:'Mne podkhodit.',zh:'Keyi.',ja:'Ii yo.',ht:'Sa bon pou mwen.'}},
    {n:'Je passe te voir.',t:{en:'I’ll come see you.',es:'Paso a verte.',de:'Ich komme vorbei.',ru:'Ya zaydu.',zh:'Wo qu kan ni.',ja:'Yoru yo.',ht:'M ap pase wè ou.'}},
    {n:'Bonne chance.',t:{en:'Good luck.',es:'Buena suerte.',de:'Viel Glück.',ru:'Udachi.',zh:'Zhuyun.',ja:'Ganbatte.',ht:'Bon chans.'}},
    {n:'Prends soin de toi.',t:{en:'Take care.',es:'Cuídate.',de:'Pass auf dich auf.',ru:'Beregi sebya.',zh:'Zhaogu hao ziji.',ja:'Ki o tsukete.',ht:'Pran swen tèt ou.'}},
    {n:'À demain.',t:{en:'See you tomorrow.',es:'Hasta mañana.',de:'Bis morgen.',ru:'Do zavtra.',zh:'Mingtian jian.',ja:'Mata ashita.',ht:'N a wè demen.'}},
  ]
      },
  reactions_opinions:{
  fr:'Réactions et opinions',
  en:'Reactions and opinions',
  es:'Reacciones y opiniones',
  ht:'Reyaksyon ak opinyon',
  de:'Reaktionen und Meinungen',
  ru:'Reaktsii i mneniya',
  zh:'Fanying he yijian',
  ja:'Hannō to iken',
  icon:'💭',
  items:[

    {n:'Je pense que oui.',t:{en:'I think so.',es:'Creo que sí.',de:'Ich denke schon.',ru:'Ya dumayu da.',zh:'Wo juede shi.',ja:'Sō omou.',ht:'M panse wi.'}},
    {n:'Je ne pense pas.',t:{en:'I don’t think so.',es:'No lo creo.',de:'Ich glaube nicht.',ru:'Ya tak ne dumayu.',zh:'Wo bu renwei.',ja:'Sō wa omoimasen.',ht:'M pa panse sa.'}},
    {n:'Je suis d’accord.',t:{en:'I agree.',es:'Estoy de acuerdo.',de:'Ich stimme zu.',ru:'Ya soglasen.',zh:'Wo tongyi.',ja:'Sansei.',ht:'M dakò.'}},
    {n:'Je ne suis pas d’accord.',t:{en:'I disagree.',es:'No estoy de acuerdo.',de:'Ich stimme nicht zu.',ru:'Ya ne soglasen.',zh:'Wo bu tongyi.',ja:'Han tai.',ht:'M pa dakò.'}},
    {n:'C’est possible.',t:{en:'It’s possible.',es:'Es posible.',de:'Es ist möglich.',ru:'Eto vozmozhno.',zh:'You keneng.',ja:'Areru.',ht:'Sa posib.'}},
    {n:'C’est impossible.',t:{en:'It’s impossible.',es:'Es imposible.',de:'Es ist unmöglich.',ru:'Eto nevozmozhno.',zh:'Bu keneng.',ja:'Fukanō.',ht:'Sa pa posib.'}},
    {n:'C’est vrai.',t:{en:'It’s true.',es:'Es verdad.',de:'Das ist wahr.',ru:'Eto pravda.',zh:'Zhe shi zhen de.',ja:'Hontō.',ht:'Se vre.'}},
    {n:'C’est faux.',t:{en:'It’s false.',es:'Es falso.',de:'Das ist falsch.',ru:'Eto lozh.',zh:'Zhe shi jia de.',ja:'Uso.',ht:'Sa fo.'}},
    {n:'Je suis sûr.',t:{en:'I’m sure.',es:'Estoy seguro.',de:'Ich bin sicher.',ru:'Ya uveren.',zh:'Wo queding.',ja:'Kakushin shiteru.',ht:'M sèten.'}},
    {n:'Je ne suis pas sûr.',t:{en:'I’m not sure.',es:'No estoy seguro.',de:'Ich bin nicht sicher.',ru:'Ya ne uveren.',zh:'Wo bu queding.',ja:'Wakaranai.',ht:'M pa sèten.'}},

    {n:'Bonne idée.',t:{en:'Good idea.',es:'Buena idea.',de:'Gute Idee.',ru:'Khoroshaya ideya.',zh:'Hao zhuyi.',ja:'Ii kangae.',ht:'Bon lide.'}},
    {n:'Mauvaise idée.',t:{en:'Bad idea.',es:'Mala idea.',de:'Schlechte Idee.',ru:'Plokhaya ideya.',zh:'Huai zhuyi.',ja:'Yoku nai.',ht:'Move lide.'}},
    {n:'Ça marche.',t:{en:'That works.',es:'Funciona.',de:'Das funktioniert.',ru:'Eto rabotaet.',zh:'Keyi.',ja:'Daijobu.',ht:'Sa mache.'}},
    {n:'Ça ne marche pas.',t:{en:'That doesn’t work.',es:'No funciona.',de:'Das funktioniert nicht.',ru:'Eto ne rabotaet.',zh:'Bu xing.',ja:'Dame.',ht:'Sa pa mache.'}},
    {n:'Exactement.',t:{en:'Exactly.',es:'Exactamente.',de:'Genau.',ru:'Tochno.',zh:'Zhengque.',ja:'Sono tōri.',ht:'Egzakteman.'}},
    {n:'Pas vraiment.',t:{en:'Not really.',es:'No realmente.',de:'Nicht wirklich.',ru:'Ne sovsem.',zh:'Bu tai.',ja:'Amari.',ht:'Pa vrèman.'}},
    {n:'Peut-être.',t:{en:'Maybe.',es:'Tal vez.',de:'Vielleicht.',ru:'Mozhet byt.',zh:'Yexu.',ja:'Tabun.',ht:'Petèt.'}},
    {n:'Bien sûr.',t:{en:'Of course.',es:'Claro.',de:'Natürlich.',ru:'Konechno.',zh:'Dangran.',ja:'Mochiron.',ht:'Byen sir.'}},
    {n:'Pourquoi pas ?',t:{en:'Why not?',es:'¿Por qué no?',de:'Warum nicht?',ru:'Pochemu net?',zh:'Weishenme bu?',ja:'Naze dame?',ht:'Poukisa pa?'}},
    {n:'Je suppose.',t:{en:'I suppose.',es:'Supongo.',de:'Ich nehme an.',ru:'Ya polagayu.',zh:'Wo cai.',ja:'Tabun ne.',ht:'M sipoze.'}},

    {n:'C’est logique.',t:{en:'It’s logical.',es:'Es lógico.',de:'Das ist logisch.',ru:'Eto logichno.',zh:'He li.',ja:'Gōriteki.',ht:'Sa lojik.'}},
    {n:'Ça n’a pas de sens.',t:{en:'It makes no sense.',es:'No tiene sentido.',de:'Das ergibt keinen Sinn.',ru:'Net smysla.',zh:'Mei daoli.',ja:'Imi ga nai.',ht:'Sa pa gen sans.'}},
    {n:'Je comprends.',t:{en:'I understand.',es:'Entiendo.',de:'Ich verstehe.',ru:'Ya ponimayu.',zh:'Wo mingbai.',ja:'Wakarimasu.',ht:'M konprann.'}},
    {n:'Je ne comprends pas.',t:{en:'I don’t understand.',es:'No entiendo.',de:'Ich verstehe nicht.',ru:'Ya ne ponimayu.',zh:'Wo bu mingbai.',ja:'Wakarimasen.',ht:'M pa konprann.'}},
    {n:'C’est intéressant.',t:{en:'It’s interesting.',es:'Es interesante.',de:'Das ist interessant.',ru:'Eto interesno.',zh:'You yisi.',ja:'Omoshiroi.',ht:'Sa enteresan.'}},
    {n:'C’est bizarre.',t:{en:'That’s strange.',es:'Es extraño.',de:'Das ist seltsam.',ru:'Stranno.',zh:'Hen qiguai.',ja:'Hen da ne.',ht:'Sa dwòl.'}},
    {n:'C’est incroyable.',t:{en:'That’s incredible.',es:'Increíble.',de:'Unglaublich.',ru:'Neveroyatno.',zh:'Buke siyi.',ja:'Shinjirarenai.',ht:'Sa enkwayab.'}},
    {n:'C’est évident.',t:{en:'It’s obvious.',es:'Es obvio.',de:'Das ist offensichtlich.',ru:'Ochevidno.',zh:'Hen mingxian.',ja:'Akiraka.',ht:'Sa klè.'}},
    {n:'Je suis surpris.',t:{en:'I’m surprised.',es:'Estoy sorprendido.',de:'Ich bin überrascht.',ru:'Ya udivlen.',zh:'Wo hen jingya.',ja:'Odorokita.',ht:'M sezi.'}},
    {n:'Je suis impressionné.',t:{en:'I’m impressed.',es:'Estoy impresionado.',de:'Ich bin beeindruckt.',ru:'Ya vpechatlen.',zh:'Wo yinxiang shenke.',ja:'Kandō shita.',ht:'M enpresyone.'}},

    {n:'Ça me plaît.',t:{en:'I like it.',es:'Me gusta.',de:'Es gefällt mir.',ru:'Mne nravitsya.',zh:'Wo xihuan.',ja:'Suki.',ht:'M renmen sa.'}},
    {n:'Je déteste ça.',t:{en:'I hate it.',es:'Lo odio.',de:'Ich hasse es.',ru:'Ya nenavizhu eto.',zh:'Wo taoyan.',ja:'Kirai.',ht:'M rayi sa.'}},
    {n:'C’est génial.',t:{en:'That’s awesome.',es:'Genial.',de:'Das ist super.',ru:'Eto zdorovo.',zh:'Tai bang le.',ja:'Sugoi.',ht:'Sa bon anpil.'}},
    {n:'C’est nul.',t:{en:'That sucks.',es:'Es malo.',de:'Das ist schlecht.',ru:'Plokho.',zh:'Hen cha.',ja:'Yoku nai.',ht:'Sa pa bon.'}},
    {n:'Je préfère ça.',t:{en:'I prefer this.',es:'Prefiero esto.',de:'Ich bevorzuge das.',ru:'Ya predpochitayu eto.',zh:'Wo geng xihuan zhe.',ja:'Kore ga ii.',ht:'M prefere sa.'}},
    {n:'Ça va.',t:{en:'It’s okay.',es:'Está bien.',de:'Es geht.',ru:'Normalno.',zh:'Hai keyi.',ja:'Maa maa.',ht:'Sa pase.'}},
    {n:'Pas mal.',t:{en:'Not bad.',es:'No está mal.',de:'Nicht schlecht.',ru:'Neplokho.',zh:'Bu cuo.',ja:'Warukunai.',ht:'Pa mal.'}},
    {n:'Très bien.',t:{en:'Very good.',es:'Muy bien.',de:'Sehr gut.',ru:'Ochen khorosho.',zh:'Hen hao.',ja:'Totemo ii.',ht:'Trè byen.'}},
    {n:'Ça suffit.',t:{en:'That’s enough.',es:'Es suficiente.',de:'Genug.',ru:'Khvatit.',zh:'Gou le.',ja:'Mō ii.',ht:'Sa sifi.'}},
    {n:'C’est trop.',t:{en:'That’s too much.',es:'Es demasiado.',de:'Das ist zu viel.',ru:'Slishkom mnogo.',zh:'Tai duo.',ja:'Ōsugiru.',ht:'Sa tròp.'}}

  ]
  },
questions_conversation:{
  fr:'Questions de conversation',
  en:'Conversation questions',
  es:'Preguntas de conversación',
  ht:'Kesyon konvèsasyon',
  de:'Gesprächsfragen',
  ru:'Voprosy dlya razgovora',
  zh:'Duìhuà wèntí',
  ja:'Kaiwa no shitsumon',
  icon:'❓',
  items:[

    {n:'Comment tu t’appelles ?',t:{en:'What is your name?',es:'¿Cómo te llamas?',de:'Wie heißt du?',ru:'Kak tebya zovut?',zh:'Nǐ jiào shénme?',ja:'Namae wa?',ht:'Kijan ou rele?'}},
    {n:'Tu viens d’où ?',t:{en:'Where are you from?',es:'¿De dónde eres?',de:'Woher kommst du?',ru:'Otkuda ty?',zh:'Nǐ cóng nǎlǐ lái?',ja:'Doko kara kita?',ht:'Ki kote ou soti?'}},
    {n:'Quel âge as-tu ?',t:{en:'How old are you?',es:'¿Cuántos años tienes?',de:'Wie alt bist du?',ru:'Skolko tebe let?',zh:'Nǐ duō dà?',ja:'Nansai?',ht:'Ki laj ou?'}},
    {n:'Où habites-tu ?',t:{en:'Where do you live?',es:'¿Dónde vives?',de:'Wo wohnst du?',ru:'Gde ty zhivyosh?',zh:'Nǐ zhù zài nǎlǐ?',ja:'Doko ni sunderu?',ht:'Ki kote w ap viv?'}},
    {n:'Que fais-tu ?',t:{en:'What do you do?',es:'¿Qué haces?',de:'Was machst du?',ru:'Chto ty delayesh?',zh:'Nǐ zuò shénme?',ja:'Nani shiteru?',ht:'Kisa w ap fè?'}},

    {n:'Tu travailles ?',t:{en:'Do you work?',es:'¿Trabajas?',de:'Arbeitest du?',ru:'Ty rabotayesh?',zh:'Nǐ gōngzuò ma?',ja:'Hataraiteru?',ht:'Ou travay?'}},
    {n:'Tu étudies ?',t:{en:'Do you study?',es:'¿Estudias?',de:'Studierst du?',ru:'Ty uchishsya?',zh:'Nǐ xuéxí ma?',ja:'Benkyō shiteru?',ht:'Ou etidye?'}},
    {n:'Tu es occupé ?',t:{en:'Are you busy?',es:'¿Estás ocupado?',de:'Bist du beschäftigt?',ru:'Ty zanyat?',zh:'Nǐ máng ma?',ja:'Isogashii?',ht:'Ou okipe?'}},
    {n:'Tu as du temps ?',t:{en:'Do you have time?',es:'¿Tienes tiempo?',de:'Hast du Zeit?',ru:'U tebya est vremya?',zh:'Nǐ yǒu shíjiān ma?',ja:'Jikan aru?',ht:'Ou gen tan?'}},
    {n:'Tu peux parler ?',t:{en:'Can you talk?',es:'¿Puedes hablar?',de:'Kannst du sprechen?',ru:'Mozhesh govorit?',zh:'Nǐ néng shuōhuà ma?',ja:'Hanseru?',ht:'Ou ka pale?'}},

    {n:'Tu es libre ?',t:{en:'Are you free?',es:'¿Estás libre?',de:'Bist du frei?',ru:'Ty svoboden?',zh:'Nǐ yǒu kōng ma?',ja:'Hima?',ht:'Ou lib?'}},
    {n:'Tu viens ?',t:{en:'Are you coming?',es:'¿Vienes?',de:'Kommst du?',ru:'Ty pridyosh?',zh:'Nǐ lái ma?',ja:'Kuru?',ht:'Ou ap vini?'}},
    {n:'On se voit ?',t:{en:'Shall we meet?',es:'¿Nos vemos?',de:'Sehen wir uns?',ru:'Vstretimsya?',zh:'Jiàn miàn ma?',ja:'Au?',ht:'N ap wè?'}},
    {n:'Quand ?',t:{en:'When?',es:'¿Cuándo?',de:'Wann?',ru:'Kogda?',zh:'Shénme shíhou?',ja:'Itsu?',ht:'Kilè?'}},
    {n:'Où ?',t:{en:'Where?',es:'¿Dónde?',de:'Wo?',ru:'Gde?',zh:'Nǎlǐ?',ja:'Doko?',ht:'Ki kote?'}},

    {n:'Pourquoi ?',t:{en:'Why?',es:'¿Por qué?',de:'Warum?',ru:'Pochemu?',zh:'Wèishéme?',ja:'Naze?',ht:'Poukisa?'}},
    {n:'Avec qui ?',t:{en:'With who?',es:'¿Con quién?',de:'Mit wem?',ru:'S kem?',zh:'Gēn shéi?',ja:'Dare to?',ht:'Ak kiyès?'}},
    {n:'Combien ?',t:{en:'How many?',es:'¿Cuántos?',de:'Wie viele?',ru:'Skolko?',zh:'Duōshao?',ja:'Ikutsu?',ht:'Konbyen?'}},
    {n:'Combien ça coûte ?',t:{en:'How much is it?',es:'¿Cuánto cuesta?',de:'Wie viel kostet das?',ru:'Skolko eto stoit?',zh:'Duōshao qián?',ja:'Ikura?',ht:'Konbyen sa koute?'}},
    {n:'C’est loin ?',t:{en:'Is it far?',es:'¿Está lejos?',de:'Ist es weit?',ru:'Eto daleko?',zh:'Yuǎn ma?',ja:'Tōi?',ht:'Li lwen?'}},

    {n:'C’est près ?',t:{en:'Is it near?',es:'¿Está cerca?',de:'Ist es nah?',ru:'Blizko?',zh:'Jìn ma?',ja:'Chikai?',ht:'Li pre?'}},
    {n:'Tu comprends ?',t:{en:'Do you understand?',es:'¿Entiendes?',de:'Verstehst du?',ru:'Ty ponimayesh?',zh:'Nǐ dǒng ma?',ja:'Wakarimasu ka?',ht:'Ou konprann?'}},
    {n:'Tu peux répéter ?',t:{en:'Can you repeat?',es:'¿Puedes repetir?',de:'Kannst du wiederholen?',ru:'Povtori.',zh:'Nǐ néng zài shuō yí cì ma?',ja:'Mō ichido?',ht:'Ou ka repete?'}},
    {n:'Tu peux expliquer ?',t:{en:'Can you explain?',es:'¿Puedes explicar?',de:'Kannst du erklären?',ru:'Mozhesh obyasnit?',zh:'Nǐ néng jiěshì ma?',ja:'Setsumei dekiru?',ht:'Ou ka eksplike?'}},
    {n:'Tu sais ?',t:{en:'Do you know?',es:'¿Sabes?',de:'Weißt du?',ru:'Ty znayesh?',zh:'Nǐ zhīdào ma?',ja:'Shitteru?',ht:'Ou konnen?'}},

    {n:'Tu te souviens ?',t:{en:'Do you remember?',es:'¿Recuerdas?',de:'Erinnerst du dich?',ru:'Ty pomnish?',zh:'Nǐ jìde ma?',ja:'Oboeteru?',ht:'Ou sonje?'}},
    {n:'Tu es prêt ?',t:{en:'Are you ready?',es:'¿Estás listo?',de:'Bist du bereit?',ru:'Ty gotov?',zh:'Nǐ zhǔnbèi hǎo le ma?',ja:'Junbi ii?',ht:'Ou pare?'}},
    {n:'On commence ?',t:{en:'Shall we start?',es:'¿Empezamos?',de:'Fangen wir an?',ru:'Nachnyom?',zh:'Kāishǐ ma?',ja:'Hajimeru?',ht:'Ann kòmanse?'}},
    {n:'On y va ?',t:{en:'Shall we go?',es:'¿Vamos?',de:'Gehen wir?',ru:'Poydyom?',zh:'Zǒu ma?',ja:'Ikō?',ht:'Ann ale?'}},
    {n:'Tu veux venir ?',t:{en:'Do you want to come?',es:'¿Quieres venir?',de:'Willst du kommen?',ru:'Khochesh priyti?',zh:'Nǐ xiǎng lái ma?',ja:'Kuru?',ht:'Ou vle vini?'}},

    {n:'Tu veux manger ?',t:{en:'Do you want to eat?',es:'¿Quieres comer?',de:'Willst du essen?',ru:'Khochesh est?',zh:'Nǐ xiǎng chī ma?',ja:'Taberu?',ht:'Ou vle manje?'}},
    {n:'Tu veux boire ?',t:{en:'Do you want to drink?',es:'¿Quieres beber?',de:'Willst du trinken?',ru:'Khochesh pit?',zh:'Nǐ xiǎng hē ma?',ja:'Nomu?',ht:'Ou vle bwè?'}},
    {n:'Tu as faim ?',t:{en:'Are you hungry?',es:'¿Tienes hambre?',de:'Hast du Hunger?',ru:'Ty goloden?',zh:'Nǐ è ma?',ja:'Onaka suita?',ht:'Ou grangou?'}},
    {n:'Tu as soif ?',t:{en:'Are you thirsty?',es:'¿Tienes sed?',de:'Hast du Durst?',ru:'Ty khochesh pit?',zh:'Nǐ kě ma?',ja:'Nodo kawa ita?',ht:'Ou swaf?'}},
    {n:'Tu es fatigué ?',t:{en:'Are you tired?',es:'¿Estás cansado?',de:'Bist du müde?',ru:'Ty ustal?',zh:'Nǐ lèi ma?',ja:'Tsukareta?',ht:'Ou bouke?'}},

    {n:'Tu es malade ?',t:{en:'Are you sick?',es:'¿Estás enfermo?',de:'Bist du krank?',ru:'Ty bolen?',zh:'Nǐ shēngbìng ma?',ja:'Byōki?',ht:'Ou malad?'}},
    {n:'Tu veux partir ?',t:{en:'Do you want to leave?',es:'¿Quieres irte?',de:'Willst du gehen?',ru:'Khochesh uyti?',zh:'Nǐ xiǎng zǒu ma?',ja:'Kaeru?',ht:'Ou vle ale?'}},
    {n:'Tu restes ?',t:{en:'Are you staying?',es:'¿Te quedas?',de:'Bleibst du?',ru:'Ty ostaneshsya?',zh:'Nǐ liú xià ma?',ja:'Iru?',ht:'Ou rete?'}},
    {n:'On attend ?',t:{en:'Shall we wait?',es:'¿Esperamos?',de:'Warten wir?',ru:'Podozhdyom?',zh:'Děng ma?',ja:'Matsu?',ht:'Ann tann?'}},
    {n:'On part ?',t:{en:'Shall we leave?',es:'¿Nos vamos?',de:'Gehen wir?',ru:'Poydyom?',zh:'Zǒu ba?',ja:'Iku?',ht:'Ann pati?'}},

    {n:'Tu es sûr ?',t:{en:'Are you sure?',es:'¿Estás seguro?',de:'Bist du sicher?',ru:'Ty uveren?',zh:'Nǐ quèdìng ma?',ja:'Hontō?',ht:'Ou sèten?'}},
    {n:'Tu es sérieux ?',t:{en:'Are you serious?',es:'¿En serio?',de:'Ernsthaft?',ru:'Ty seryozno?',zh:'Zhēn de ma?',ja:'Majide?',ht:'Ou serye?'}},
    {n:'Tu plaisantes ?',t:{en:'Are you joking?',es:'¿Estás bromeando?',de:'Machst du Witze?',ru:'Ty shutish?',zh:'Nǐ kāiwánxiào ma?',ja:'Jōdan?',ht:'Ou ap jwe?'}},
    {n:'Tu es content ?',t:{en:'Are you happy?',es:'¿Estás feliz?',de:'Bist du glücklich?',ru:'Ty schastliv?',zh:'Nǐ kāixīn ma?',ja:'Ureshii?',ht:'Ou kontan?'}},
    {n:'Tu es triste ?',t:{en:'Are you sad?',es:'¿Estás triste?',de:'Bist du traurig?',ru:'Ty grusten?',zh:'Nǐ shāngxīn ma?',ja:'Kanashii?',ht:'Ou tris?'}},

    {n:'Tu as peur ?',t:{en:'Are you scared?',es:'¿Tienes miedo?',de:'Hast du Angst?',ru:'Ty boishsya?',zh:'Nǐ pà ma?',ja:'Kowai?',ht:'Ou pè?'}},
    {n:'Tu as compris ?',t:{en:'Did you understand?',es:'¿Entendiste?',de:'Hast du verstanden?',ru:'Ty ponyal?',zh:'Nǐ míngbai le ma?',ja:'Wakatta?',ht:'Ou konprann?'}},
    {n:'Tu as fini ?',t:{en:'Did you finish?',es:'¿Terminaste?',de:'Bist du fertig?',ru:'Ty zakonchil?',zh:'Nǐ wánchéng le ma?',ja:'Owari?',ht:'Ou fini?'}},
    {n:'Tu es là ?',t:{en:'Are you there?',es:'¿Estás ahí?',de:'Bist du da?',ru:'Ty tam?',zh:'Nǐ zài ma?',ja:'Iru?',ht:'Ou la?'}},
    {n:'Tu m’entends ?',t:{en:'Can you hear me?',es:'¿Me oyes?',de:'Hörst du mich?',ru:'Ty menya slyshish?',zh:'Nǐ tīng dào ma?',ja:'Kikoeru?',ht:'Ou tande mwen?'}}

  ]
  },
  voyage_deplacement:{
  fr:'Voyage et déplacement',
  en:'Travel and transport',
  es:'Viaje y transporte',
  ht:'Vwayaj ak deplasman',
  de:'Reise und Transport',
  ru:'Puteshestvie i transport',
  zh:'Lǚxíng hé jiāotōng',
  ja:'Ryokō to kōtsū',
  icon:'✈️',
  items:[

    {n:'Je voyage.',t:{en:'I travel.',es:'Viajo.',de:'Ich reise.',ru:'Ya puteshestvuyu.',zh:'Wǒ lǚxíng.',ja:'Ryokō suru.',ht:'M ap vwayaje.'}},
    {n:'Je pars.',t:{en:'I leave.',es:'Me voy.',de:'Ich gehe.',ru:'Ya ukhodyu.',zh:'Wǒ zǒu.',ja:'Deru.',ht:'M pati.'}},
    {n:'Je reviens.',t:{en:'I return.',es:'Regreso.',de:'Ich komme zurück.',ru:'Ya vozvrashchayus.',zh:'Wǒ huílái.',ja:'Modoru.',ht:'M tounen.'}},
    {n:'Où est la gare ?',t:{en:'Where is the station?',es:'¿Dónde está la estación?',de:'Wo ist der Bahnhof?',ru:'Gde vokzal?',zh:'Chēzhàn zài nǎlǐ?',ja:'Eki wa doko?',ht:'Ki kote estasyon an?'}},
    {n:'Où est l’aéroport ?',t:{en:'Where is the airport?',es:'¿Dónde está el aeropuerto?',de:'Wo ist der Flughafen?',ru:'Gde aeroport?',zh:'Jīchǎng zài nǎlǐ?',ja:'Kūkō wa doko?',ht:'Ki kote ayewopò a?'}},

    {n:'Je cherche un taxi.',t:{en:'I need a taxi.',es:'Busco taxi.',de:'Ich brauche ein Taxi.',ru:'Mne nuzhen taksi.',zh:'Wǒ yào chūzūchē.',ja:'Takushī hitsuyō.',ht:'M bezwen taksi.'}},
    {n:'Prenons le bus.',t:{en:'Let’s take the bus.',es:'Tomemos el bus.',de:'Nehmen wir den Bus.',ru:'Poydyom na avtobus.',zh:'Zuò gōngjiāo.',ja:'Bas ni noru.',ht:'Ann pran bis.'}},
    {n:'Prenons le train.',t:{en:'Let’s take the train.',es:'Tomemos el tren.',de:'Nehmen wir den Zug.',ru:'Poydyom na poyezd.',zh:'Zuò huǒchē.',ja:'Densha.',ht:'Ann pran tren.'}},
    {n:'Je marche.',t:{en:'I walk.',es:'Camino.',de:'Ich gehe zu Fuß.',ru:'Ya idu.',zh:'Wǒ zǒu lù.',ja:'Aruku.',ht:'M ap mache.'}},
    {n:'C’est loin.',t:{en:'It’s far.',es:'Está lejos.',de:'Es ist weit.',ru:'Daleko.',zh:'Hěn yuǎn.',ja:'Tōi.',ht:'Li lwen.'}},

    {n:'C’est près.',t:{en:'It’s near.',es:'Está cerca.',de:'Es ist nah.',ru:'Blizko.',zh:'Hěn jìn.',ja:'Chikai.',ht:'Li pre.'}},
    {n:'Tourne à gauche.',t:{en:'Turn left.',es:'Gira a la izquierda.',de:'Links abbiegen.',ru:'Povernite nalevo.',zh:'Zuǒ zhuǎn.',ja:'Hidari.',ht:'Vire agoch.'}},
    {n:'Tourne à droite.',t:{en:'Turn right.',es:'Gira a la derecha.',de:'Rechts abbiegen.',ru:'Povernite napravo.',zh:'Yòu zhuǎn.',ja:'Migi.',ht:'Vire adwat.'}},
    {n:'Continue tout droit.',t:{en:'Go straight.',es:'Sigue recto.',de:'Geradeaus.',ru:'Idite pryamo.',zh:'Yīzhí zǒu.',ja:'Massugu.',ht:'Ale dwat.'}},
    {n:'Je suis perdu.',t:{en:'I’m lost.',es:'Estoy perdido.',de:'Ich bin verloren.',ru:'Ya poteryalsya.',zh:'Wǒ mílù le.',ja:'Mayotta.',ht:'M pèdi.'}},
{n:'Aide-moi.',t:{en:'Help me.',es:'Ayúdame.',de:'Hilf mir.',ru:'Pomogi mne.',zh:'Bāng wǒ.',ja:'Tetsudatte.',ht:'Ede m.'}},
    {n:'Merci.',t:{en:'Thank you.',es:'Gracias.',de:'Danke.',ru:'Spasibo.',zh:'Xièxiè.',ja:'Arigatō.',ht:'Mèsi.'}},
    {n:'Merci beaucoup.',t:{en:'Thank you very much.',es:'Muchas gracias.',de:'Vielen Dank.',ru:'Bolshoe spasibo.',zh:'Fēicháng gǎnxiè.',ja:'Dōmo arigatō.',ht:'Mèsi anpil.'}},
    {n:'De rien.',t:{en:'You’re welcome.',es:'De nada.',de:'Bitte.',ru:'Pozhaluysta.',zh:'Bù kèqì.',ja:'Dōitashimashite.',ht:'Pa gen pwoblèm.'}},
    {n:'Bonne route.',t:{en:'Have a good trip.',es:'Buen viaje.',de:'Gute Reise.',ru:'Schastlivogo puti.',zh:'Lǚtú yúkuài.',ja:'Yoi tabi.',ht:'Bon vwayaj.'}}
  ]
  },
  conversation_sociale:{
  fr:'Conversation sociale',
  en:'Social conversation',
  es:'Conversación social',
  ht:'Konvèsasyon sosyal',
  de:'Soziale Unterhaltung',
  ru:'Sotsialny razgovor',
  zh:'Shèjiāo duìhuà',
  ja:'Shakai kaiwa',
  icon:'💬',
  items:[

    {n:'Ça fait longtemps.',t:{en:'Long time no see.',es:'Cuánto tiempo.',de:'Lange nicht gesehen.',ru:'Davno ne videlis.',zh:'Hǎojiǔ bú jiàn.',ja:'Hisashiburi.',ht:'Sa fè lontan.'}},
    {n:'Quoi de neuf ?',t:{en:'What’s new?',es:'¿Qué hay de nuevo?',de:'Was gibt’s Neues?',ru:'Chto novogo?',zh:'Yǒu shénme xīnxiān shì?',ja:'Nani ga atarashii?',ht:'Kisa ki nouvo?'}},
    {n:'Comment se passe ta journée ?',t:{en:'How is your day going?',es:'¿Cómo va tu día?',de:'Wie läuft dein Tag?',ru:'Kak prokhodit den?',zh:'Nǐ de yītiān zěnme yàng?',ja:'Kyō wa dō?',ht:'Kijan jounen w ye?'}},
    {n:'Je suis content de te voir.',t:{en:'I am happy to see you.',es:'Me alegra verte.',de:'Ich freue mich dich zu sehen.',ru:'Rad tebya videt.',zh:'Hěn gāoxìng jiàn dào nǐ.',ja:'Aete ureshii.',ht:'M kontan wè w.'}},
    {n:'Moi aussi.',t:{en:'Me too.',es:'Yo también.',de:'Ich auch.',ru:'Ya tozhe.',zh:'Wǒ yě shì.',ja:'Watashi mo.',ht:'Mwen tou.'}},

    {n:'Je vois.',t:{en:'I see.',es:'Ya veo.',de:'Ich verstehe.',ru:'Ponimayu.',zh:'Wǒ míngbai.',ja:'Sō ka.',ht:'M wè sa.'}},
    {n:'C’est intéressant.',t:{en:'That’s interesting.',es:'Eso es interesante.',de:'Das ist interessant.',ru:'Eto interesno.',zh:'Hěn yǒu yìsi.',ja:'Omoshiroi.',ht:'Sa enteresan.'}},
    {n:'Tu plaisantes ?',t:{en:'Are you joking?',es:'¿Estás bromeando?',de:'Machst du Witze?',ru:'Ty shutish?',zh:'Nǐ kāiwánxiào ma?',ja:'Jōdan?',ht:'Ou ap blag?'}},
    {n:'Je comprends.',t:{en:'I understand.',es:'Entiendo.',de:'Ich verstehe.',ru:'Ya ponimayu.',zh:'Wǒ dǒng.',ja:'Wakarimasu.',ht:'M konprann.'}},
    {n:'Je ne comprends pas.',t:{en:'I don’t understand.',es:'No entiendo.',de:'Ich verstehe nicht.',ru:'Ya ne ponimayu.',zh:'Wǒ bù dǒng.',ja:'Wakaranai.',ht:'M pa konprann.'}},

    {n:'Explique-moi.',t:{en:'Explain to me.',es:'Explícame.',de:'Erklär mir.',ru:'Obyasni.',zh:'Gěi wǒ jiěshì.',ja:'Setsumei shite.',ht:'Eksplike m.'}},
    {n:'C’est logique.',t:{en:'That makes sense.',es:'Tiene sentido.',de:'Das ergibt Sinn.',ru:'Eto logichno.',zh:'Hěn hé lǐ.',ja:'Narubodo.',ht:'Sa fè sans.'}},
    {n:'Je suis d’accord.',t:{en:'I agree.',es:'Estoy de acuerdo.',de:'Ich stimme zu.',ru:'Ya soglasen.',zh:'Wǒ tóngyì.',ja:'Dōi shimasu.',ht:'M dakò.'}},
    {n:'Pas vraiment.',t:{en:'Not really.',es:'No realmente.',de:'Nicht wirklich.',ru:'Ne sovsem.',zh:'Bù tài shì.',ja:'Amari.',ht:'Pa vrèman.'}},
    {n:'Ça dépend.',t:{en:'It depends.',es:'Depende.',de:'Es kommt darauf an.',ru:'Zavisit.',zh:'Kàn qíngkuàng.',ja:'Baai ni yoru.',ht:'Sa depan.'}},

    {n:'Je pense pareil.',t:{en:'I think the same.',es:'Pienso igual.',de:'Ich denke genauso.',ru:'Ya dumayu tak zhe.',zh:'Wǒ yě zhème xiǎng.',ja:'Onaji kangae.',ht:'M panse menm jan.'}},
    {n:'Bonne idée.',t:{en:'Good idea.',es:'Buena idea.',de:'Gute Idee.',ru:'Khoroshaya ideya.',zh:'Hǎo zhǔyi.',ja:'Ii kangae.',ht:'Bon lide.'}},
    {n:'Mauvaise idée.',t:{en:'Bad idea.',es:'Mala idea.',de:'Schlechte Idee.',ru:'Plokhaya ideya.',zh:'Bù hǎo de zhǔyi.',ja:'Yoku nai.',ht:'Move lide.'}},
    {n:'On verra.',t:{en:'We will see.',es:'Ya veremos.',de:'Wir werden sehen.',ru:'Posmotrim.',zh:'Wǒmen zài kàn.',ja:'Mite miyō.',ht:'N ap wè.'}},
    {n:'Pourquoi pas ?',t:{en:'Why not?',es:'¿Por qué no?',de:'Warum nicht?',ru:'Pochemu net?',zh:'Wèishéme bù?',ja:'Ii yo.',ht:'Poukisa pa?'}},

    {n:'Bonne question.',t:{en:'Good question.',es:'Buena pregunta.',de:'Gute Frage.',ru:'Khoroshiy vopros.',zh:'Hǎo wèntí.',ja:'Ii shitsumon.',ht:'Bon kesyon.'}},
    {n:'Je n’en ai aucune idée.',t:{en:'I have no idea.',es:'No tengo idea.',de:'Keine Ahnung.',ru:'Ne znayu.',zh:'Wǒ bù zhīdào.',ja:'Wakaranai.',ht:'M pa gen ide.'}},
    {n:'C’est possible.',t:{en:'It’s possible.',es:'Es posible.',de:'Es ist möglich.',ru:'Vozmozhno.',zh:'Kěnéng.',ja:'Kanō.',ht:'Sa posib.'}},
    {n:'C’est impossible.',t:{en:'It’s impossible.',es:'Es imposible.',de:'Unmöglich.',ru:'Nevozmozhno.',zh:'Bù kěnéng.',ja:'Fukanō.',ht:'Sa enposib.'}},
    {n:'Je suis surpris.',t:{en:'I am surprised.',es:'Estoy sorprendido.',de:'Ich bin überrascht.',ru:'Ya udivlyon.',zh:'Wǒ hěn jīngyà.',ja:'Odoroki.',ht:'M sezi.'}},

    {n:'Ça me choque.',t:{en:'That shocks me.',es:'Eso me sorprende.',de:'Das schockiert mich.',ru:'Eto menya shokiruet.',zh:'Zhè ràng wǒ jīngyà.',ja:'Odoroki da.',ht:'Sa choke m.'}},
    {n:'C’est drôle.',t:{en:'That’s funny.',es:'Es gracioso.',de:'Das ist lustig.',ru:'Eto smeshno.',zh:'Hěn hǎoxiào.',ja:'Omoshiroi.',ht:'Sa komik.'}},
    {n:'C’est sérieux.',t:{en:'It’s serious.',es:'Es serio.',de:'Es ist ernst.',ru:'Eto seryozno.',zh:'Hěn yánzhòng.',ja:'Shinken.',ht:'Sa serye.'}},
    {n:'Je suis d’accord avec toi.',t:{en:'I agree with you.',es:'Estoy de acuerdo contigo.',de:'Ich stimme dir zu.',ru:'Ya soglasen s toboy.',zh:'Wǒ tóngyì nǐ.',ja:'Anata ni dōi.',ht:'M dakò avè w.'}},
    {n:'Pas du tout.',t:{en:'Not at all.',es:'Para nada.',de:'Überhaupt nicht.',ru:'Vovse net.',zh:'Yīdiǎn yě bù.',ja:'Mattaku.',ht:'Ditou pa.'}},

    {n:'Je suis curieux.',t:{en:'I am curious.',es:'Tengo curiosidad.',de:'Ich bin neugierig.',ru:'Mne interesno.',zh:'Wǒ hěn hàoqí.',ja:'Kōkishin.',ht:'M kirye.'}},
    {n:'Je suis fatigué.',t:{en:'I am tired.',es:'Estoy cansado.',de:'Ich bin müde.',ru:'Ya ustal.',zh:'Wǒ lèi le.',ja:'Tsukareta.',ht:'M fatige.'}},
    {n:'Je suis occupé.',t:{en:'I am busy.',es:'Estoy ocupado.',de:'Ich bin beschäftigt.',ru:'Ya zanyat.',zh:'Wǒ máng.',ja:'Isogashii.',ht:'M okipe.'}},
    {n:'Je suis libre.',t:{en:'I am free.',es:'Estoy libre.',de:'Ich bin frei.',ru:'Ya svoboden.',zh:'Wǒ yǒu kòng.',ja:'Hima.',ht:'M lib.'}},
    {n:'Ça me plaît.',t:{en:'I like it.',es:'Me gusta.',de:'Es gefällt mir.',ru:'Mne nravitsya.',zh:'Wǒ xǐhuān.',ja:'Suki.',ht:'M renmen sa.'}},

    {n:'Je n’aime pas.',t:{en:'I don’t like.',es:'No me gusta.',de:'Ich mag nicht.',ru:'Mne ne nravitsya.',zh:'Wǒ bù xǐhuān.',ja:'Suki janai.',ht:'M pa renmen.'}},
    {n:'Ça m’intéresse.',t:{en:'That interests me.',es:'Me interesa.',de:'Das interessiert mich.',ru:'Mne eto interesno.',zh:'Wǒ gǎn xìngqù.',ja:'Kanshin ga aru.',ht:'Sa enterese m.'}},
    {n:'Ça ne m’intéresse pas.',t:{en:'That does not interest me.',es:'No me interesa.',de:'Das interessiert mich nicht.',ru:'Mne eto ne interesno.',zh:'Wǒ bù gǎn xìngqù.',ja:'Kanshin nai.',ht:'Sa pa enterese m.'}},
    {n:'Je suis d’accord avec ça.',t:{en:'I agree with that.',es:'Estoy de acuerdo con eso.',de:'Ich stimme dem zu.',ru:'Ya s etim soglasen.',zh:'Wǒ tóngyì zhè gè.',ja:'Sore ni dōi.',ht:'M dakò ak sa.'}},
    {n:'Je ne suis pas sûr.',t:{en:'I am not sure.',es:'No estoy seguro.',de:'Ich bin nicht sicher.',ru:'Ya ne uveren.',zh:'Wǒ bù quèdìng.',ja:'Jishin nai.',ht:'M pa sèten.'}},

    {n:'Ça peut arriver.',t:{en:'It can happen.',es:'Puede pasar.',de:'Das kann passieren.',ru:'Takoe byvaet.',zh:'Kěnéng huì fāshēng.',ja:'Ari eru.',ht:'Sa ka rive.'}},
    {n:'Tu crois ?',t:{en:'Do you think so?',es:'¿Tú crees?',de:'Glaubst du?',ru:'Ty dumayesh?',zh:'Nǐ juéde ma?',ja:'Sō omou?',ht:'Ou kwè sa?'}},
    {n:'Je pense que oui.',t:{en:'I think yes.',es:'Creo que sí.',de:'Ich denke ja.',ru:'Dumayu da.',zh:'Wǒ juéde shì.',ja:'Hai da to omou.',ht:'M panse wi.'}},
    {n:'Je pense que non.',t:{en:'I think no.',es:'Creo que no.',de:'Ich denke nein.',ru:'Dumayu net.',zh:'Wǒ juéde bú shì.',ja:'Iya da to omou.',ht:'M panse non.'}},
    {n:'C’est évident.',t:{en:'It is obvious.',es:'Es obvio.',de:'Es ist offensichtlich.',ru:'Eto ochevidno.',zh:'Hěn míngxiǎn.',ja:'Akiraka.',ht:'Sa evidan.'}}

  ]
},
  vie_quotidienne:{
  fr:'Vie quotidienne',
  en:'Daily life',
  es:'Vida diaria',
  ht:'Lavi chak jou',
  de:'Alltag',
  ru:'Povsednevnaya zhizn',
  zh:'Rìcháng shēnghuó',
  ja:'Nichijō seikatsu',
  icon:'🏠',
  items:[

    {n:'Je me réveille.',t:{en:'I wake up.',es:'Me despierto.',de:'Ich wache auf.',ru:'Ya prosypayus.',zh:'Wǒ qǐchuáng.',ja:'Okiru.',ht:'M leve.'}},
    {n:'Je me lève.',t:{en:'I get up.',es:'Me levanto.',de:'Ich stehe auf.',ru:'Ya vstayu.',zh:'Wǒ qǐlái.',ja:'Okinaru.',ht:'M leve kanpe.'}},
    {n:'Je me douche.',t:{en:'I take a shower.',es:'Me ducho.',de:'Ich dusche.',ru:'Ya prinimayu dush.',zh:'Wǒ xǐ zǎo.',ja:'Shawā o abiru.',ht:'M benyen.'}},
    {n:'Je me brosse les dents.',t:{en:'I brush my teeth.',es:'Me cepillo los dientes.',de:'Ich putze mir die Zähne.',ru:'Ya chishchu zuby.',zh:'Wǒ shuā yá.',ja:'Ha o migaku.',ht:'M bwose dan m.'}},
    {n:'Je m’habille.',t:{en:'I get dressed.',es:'Me visto.',de:'Ich ziehe mich an.',ru:'Ya odevayus.',zh:'Wǒ chuān yīfu.',ja:'Fuku o kiru.',ht:'M abiye.'}},

    {n:'Je prépare le petit déjeuner.',t:{en:'I prepare breakfast.',es:'Preparo el desayuno.',de:'Ich bereite Frühstück vor.',ru:'Ya gotovlyu zavtrak.',zh:'Wǒ zhǔnbèi zǎocān.',ja:'Chōshoku o junbi.',ht:'M prepare dejene.'}},
    {n:'Je mange.',t:{en:'I eat.',es:'Como.',de:'Ich esse.',ru:'Ya yem.',zh:'Wǒ chī.',ja:'Taberu.',ht:'M manje.'}},
    {n:'Je bois de l’eau.',t:{en:'I drink water.',es:'Bebo agua.',de:'Ich trinke Wasser.',ru:'Ya pyu vodu.',zh:'Wǒ hē shuǐ.',ja:'Mizu o nomu.',ht:'M bwè dlo.'}},
    {n:'Je bois du café.',t:{en:'I drink coffee.',es:'Bebo café.',de:'Ich trinke Kaffee.',ru:'Ya pyu kofe.',zh:'Wǒ hē kāfēi.',ja:'Kōhī o nomu.',ht:'M bwè kafe.'}},
    {n:'Je pars travailler.',t:{en:'I go to work.',es:'Voy al trabajo.',de:'Ich gehe zur Arbeit.',ru:'Ya idu na rabotu.',zh:'Wǒ qù gōngzuò.',ja:'Shigoto ni iku.',ht:'M ale travay.'}},

    {n:'Je prends le bus.',t:{en:'I take the bus.',es:'Tomo el autobús.',de:'Ich nehme den Bus.',ru:'Ya edu na avtobuse.',zh:'Wǒ zuò gōngjiāo.',ja:'Basu ni noru.',ht:'M pran bis.'}},
    {n:'Je prends un taxi.',t:{en:'I take a taxi.',es:'Tomo un taxi.',de:'Ich nehme ein Taxi.',ru:'Ya beru taksi.',zh:'Wǒ dǎ chē.',ja:'Takushī o tsukau.',ht:'M pran taksi.'}},
    {n:'Je conduis.',t:{en:'I drive.',es:'Conduzco.',de:'Ich fahre.',ru:'Ya vozhú.',zh:'Wǒ kāichē.',ja:'Untensuru.',ht:'M kondwi.'}},
    {n:'Je marche.',t:{en:'I walk.',es:'Camino.',de:'Ich gehe zu Fuß.',ru:'Ya idu peshkom.',zh:'Wǒ zǒu lù.',ja:'Aruiku.',ht:'M mache.'}},
    {n:'Je travaille.',t:{en:'I work.',es:'Trabajo.',de:'Ich arbeite.',ru:'Ya rabotayu.',zh:'Wǒ gōngzuò.',ja:'Hataraku.',ht:'M travay.'}},

    {n:'Je fais une pause.',t:{en:'I take a break.',es:'Tomo un descanso.',de:'Ich mache eine Pause.',ru:'Ya delayu pereryv.',zh:'Wǒ xiūxi.',ja:'Yasumu.',ht:'M pran poz.'}},
    {n:'Je mange à midi.',t:{en:'I eat at noon.',es:'Como al mediodía.',de:'Ich esse mittags.',ru:'Ya yem v polden.',zh:'Wǒ zhōngwǔ chīfàn.',ja:'Hiru ni taberu.',ht:'M manje midi.'}},
    {n:'Je parle avec mes collègues.',t:{en:'I talk with my colleagues.',es:'Hablo con mis colegas.',de:'Ich spreche mit Kollegen.',ru:'Ya razgovarivayu s kollegami.',zh:'Wǒ gēn tóngshì liáotiān.',ja:'Dōryō to hanasu.',ht:'M pale ak kolèg mwen.'}},
    {n:'Je termine le travail.',t:{en:'I finish work.',es:'Termino el trabajo.',de:'Ich beende die Arbeit.',ru:'Ya zakanchivayu rabotu.',zh:'Wǒ jiéshù gōngzuò.',ja:'Shigoto o oeru.',ht:'M fini travay.'}},
    {n:'Je rentre chez moi.',t:{en:'I go home.',es:'Regreso a casa.',de:'Ich gehe nach Hause.',ru:'Ya idu domoy.',zh:'Wǒ huí jiā.',ja:'Ie ni kaeru.',ht:'M tounen lakay.'}},

    {n:'Je cuisine.',t:{en:'I cook.',es:'Cocino.',de:'Ich koche.',ru:'Ya gotovlyu.',zh:'Wǒ zuòfàn.',ja:'Ryōri suru.',ht:'M kwit manje.'}},
    {n:'Je dîne.',t:{en:'I have dinner.',es:'Ceno.',de:'Ich esse zu Abend.',ru:'Ya uzhinayu.',zh:'Wǒ chī wǎnfàn.',ja:'Yūshoku o taberu.',ht:'M dine.'}},
    {n:'Je regarde la télévision.',t:{en:'I watch TV.',es:'Veo televisión.',de:'Ich sehe fern.',ru:'Ya smotryu televizor.',zh:'Wǒ kàn diànshì.',ja:'Terebi o miru.',ht:'M gade televizyon.'}},
    {n:'J’écoute de la musique.',t:{en:'I listen to music.',es:'Escucho música.',de:'Ich höre Musik.',ru:'Ya slushayu muzyku.',zh:'Wǒ tīng yīnyuè.',ja:'Ongaku o kiku.',ht:'M koute mizik.'}},
    {n:'Je lis un livre.',t:{en:'I read a book.',es:'Leo un libro.',de:'Ich lese ein Buch.',ru:'Ya chitayu knigu.',zh:'Wǒ dú shū.',ja:'Hon o yomu.',ht:'M li yon liv.'}},

    {n:'Je parle avec ma famille.',t:{en:'I talk with my family.',es:'Hablo con mi familia.',de:'Ich spreche mit meiner Familie.',ru:'Ya razgovarivayu s semyoy.',zh:'Wǒ gēn jiārén liáotiān.',ja:'Kazoku to hanasu.',ht:'M pale ak fanmi mwen.'}},
    {n:'Je sors.',t:{en:'I go out.',es:'Salgo.',de:'Ich gehe aus.',ru:'Ya vykhozhu.',zh:'Wǒ chūqù.',ja:'Dekakeru.',ht:'M soti.'}},
    {n:'Je rencontre des amis.',t:{en:'I meet friends.',es:'Veo a mis amigos.',de:'Ich treffe Freunde.',ru:'Ya vstrechayu druzey.',zh:'Wǒ jiàn péngyǒu.',ja:'Tomodachi ni au.',ht:'M rankontre zanmi.'}},
    {n:'Je fais du sport.',t:{en:'I exercise.',es:'Hago deporte.',de:'Ich mache Sport.',ru:'Ya zanimayus sportom.',zh:'Wǒ yùndòng.',ja:'Undō suru.',ht:'M fè espò.'}},
    {n:'Je me repose.',t:{en:'I rest.',es:'Descanso.',de:'Ich ruhe mich aus.',ru:'Ya otdykhayu.',zh:'Wǒ xiūxi.',ja:'Yasumu.',ht:'M repoze.'}},

    {n:'Je prends une douche.',t:{en:'I take a shower.',es:'Tomo una ducha.',de:'Ich dusche.',ru:'Ya prinimayu dush.',zh:'Wǒ xǐzǎo.',ja:'Shawā o abiru.',ht:'M pran douch.'}},
    {n:'Je prépare mes affaires.',t:{en:'I prepare my things.',es:'Preparo mis cosas.',de:'Ich bereite meine Sachen vor.',ru:'Ya gotovlyu veshchi.',zh:'Wǒ zhǔnbèi dōngxī.',ja:'Mochimono o junbi.',ht:'M prepare bagay mwen.'}},
    {n:'Je mets mon réveil.',t:{en:'I set my alarm.',es:'Pongo la alarma.',de:'Ich stelle den Wecker.',ru:'Ya stavyu budilnik.',zh:'Wǒ shè zhōng.',ja:'Mezamashi o set.',ht:'M mete alam.'}},
    {n:'Je vais dormir.',t:{en:'I go to sleep.',es:'Voy a dormir.',de:'Ich gehe schlafen.',ru:'Ya idu spat.',zh:'Wǒ qù shuìjiào.',ja:'Neru.',ht:'M pral dòmi.'}},
    {n:'Je dors.',t:{en:'I sleep.',es:'Duermo.',de:'Ich schlafe.',ru:'Ya splyu.',zh:'Wǒ shuìjiào.',ja:'Nemuru.',ht:'M dòmi.'}},

    {n:'Je rêve.',t:{en:'I dream.',es:'Sueño.',de:'Ich träume.',ru:'Ya vizhu son.',zh:'Wǒ zuò mèng.',ja:'Yume o miru.',ht:'M reve.'}},
    {n:'Je me réveille tard.',t:{en:'I wake up late.',es:'Me despierto tarde.',de:'Ich wache spät auf.',ru:'Ya prosypayus pozdno.',zh:'Wǒ wǎn qǐ.',ja:'Okiru osoku.',ht:'M leve ta.'}},
    {n:'Je suis pressé.',t:{en:'I am in a hurry.',es:'Tengo prisa.',de:'Ich habe es eilig.',ru:'Ya toroplyus.',zh:'Wǒ hěn gǎn.',ja:'Isogu.',ht:'M prese.'}},
    {n:'Je suis en retard.',t:{en:'I am late.',es:'Estoy tarde.',de:'Ich bin spät.',ru:'Ya opozdal.',zh:'Wǒ chídào.',ja:'Okureta.',ht:'M an reta.'}},
    {n:'Je suis à l’heure.',t:{en:'I am on time.',es:'Estoy a tiempo.',de:'Ich bin pünktlich.',ru:'Ya vovremya.',zh:'Wǒ zhǔnshí.',ja:'Jikan dōri.',ht:'M alè.'}},

    {n:'Je planifie ma journée.',t:{en:'I plan my day.',es:'Planifico mi día.',de:'Ich plane meinen Tag.',ru:'Ya planiruyu den.',zh:'Wǒ jìhuà wǒ de yītiān.',ja:'Ichinichi o keikaku.',ht:'M planifye jounen m.'}},
    {n:'Je fais des courses.',t:{en:'I go shopping.',es:'Hago compras.',de:'Ich gehe einkaufen.',ru:'Ya pokupayu produkty.',zh:'Wǒ qù mǎi dōngxī.',ja:'Kaimono suru.',ht:'M al achte.'}},
    {n:'Je nettoie.',t:{en:'I clean.',es:'Limpio.',de:'Ich putze.',ru:'Ya ubirayus.',zh:'Wǒ qīngjié.',ja:'Sōji suru.',ht:'M netwaye.'}},
    {n:'Je range la maison.',t:{en:'I tidy the house.',es:'Ordeno la casa.',de:'Ich räume das Haus auf.',ru:'Ya ubirayus doma.',zh:'Wǒ shōushi fángzi.',ja:'Ie o katazukeru.',ht:'M ranje kay la.'}},
    {n:'Je me détends.',t:{en:'I relax.',es:'Me relajo.',de:'Ich entspanne mich.',ru:'Ya rasslablyayus.',zh:'Wǒ fàngsōng.',ja:'Rirakkusu.',ht:'M detann.'}}

  ]
  },
  story_histoire_simple:{
  fr:'Histoire simple',
  en:'Simple story',
  es:'Historia simple',
  ht:'Ti istwa',
  de:'Einfache Geschichte',
  ru:'Prostaya istoriya',
  zh:'Jiǎndān gùshì',
  ja:'Kantan na hanashi',
  icon:'📖',
  items:[

    {n:'Un jour, je me réveille tôt.',t:{en:'One day, I wake up early.',es:'Un día me despierto temprano.',de:'Eines Tages wache ich früh auf.',ru:'Odnazhdy ya rano prosypayus.',zh:'Yǒu yì tiān wǒ zǎo qǐ.',ja:'Aru hi hayaku okiru.',ht:'Yon jou m leve bonè.'}},
    {n:'Le soleil brille.',t:{en:'The sun is shining.',es:'El sol brilla.',de:'Die Sonne scheint.',ru:'Solntse svetit.',zh:'Tàiyáng zhào yào.',ja:'Taiyō ga kagayaku.',ht:'Soley la klere.'}},
    {n:'Je regarde par la fenêtre.',t:{en:'I look through the window.',es:'Miro por la ventana.',de:'Ich schaue aus dem Fenster.',ru:'Ya smotryu v okno.',zh:'Wǒ kàn chuāngwài.',ja:'Mado kara miru.',ht:'M gade nan fenèt la.'}},
    {n:'La ville est calme.',t:{en:'The city is calm.',es:'La ciudad está tranquila.',de:'Die Stadt ist ruhig.',ru:'Gorod spokoen.',zh:'Chéngshì hěn ānjìng.',ja:'Machi wa shizuka.',ht:'Vil la kalm.'}},
    {n:'Je décide de sortir.',t:{en:'I decide to go out.',es:'Decido salir.',de:'Ich entscheide mich rauszugehen.',ru:'Ya reshayu vyiti.',zh:'Wǒ juédìng chūqù.',ja:'Soto ni iku koto ni suru.',ht:'M deside soti.'}},

    {n:'Je marche dans la rue.',t:{en:'I walk in the street.',es:'Camino por la calle.',de:'Ich gehe auf der Straße.',ru:'Ya idu po ulitse.',zh:'Wǒ zǒu zài jiē shàng.',ja:'Michi o aruku.',ht:'M mache nan lari a.'}},
    {n:'Je vois un café.',t:{en:'I see a café.',es:'Veo un café.',de:'Ich sehe ein Café.',ru:'Ya vizhu kafe.',zh:'Wǒ kàn dào kāfēi diàn.',ja:'Kafe o miru.',ht:'M wè yon kafe.'}},
    {n:'J’entre dans le café.',t:{en:'I enter the café.',es:'Entro en el café.',de:'Ich betrete das Café.',ru:'Ya zakhoju v kafe.',zh:'Wǒ jìn kāfēi diàn.',ja:'Kafe ni hairu.',ht:'M antre nan kafe a.'}},
    {n:'Je commande un café.',t:{en:'I order a coffee.',es:'Pido un café.',de:'Ich bestelle einen Kaffee.',ru:'Ya zakazyvayu kofe.',zh:'Wǒ diǎn kāfēi.',ja:'Kōhī o chūmon.',ht:'M kòmande kafe.'}},
    {n:'Le café est chaud.',t:{en:'The coffee is hot.',es:'El café está caliente.',de:'Der Kaffee ist heiß.',ru:'Kofe goryachiy.',zh:'Kāfēi hěn rè.',ja:'Kōhī wa atsui.',ht:'Kafe a cho.'}},
{n:'Je m’assois.',t:{en:'I sit down.',es:'Me siento.',de:'Ich setze mich.',ru:'Ya sazhuys.',zh:'Wǒ zuò xià.',ja:'Suwaru.',ht:'M chita.'}},
    {n:'Je regarde les gens.',t:{en:'I watch the people.',es:'Observo a la gente.',de:'Ich beobachte die Leute.',ru:'Ya smotryu na lyudey.',zh:'Wǒ kàn rénmen.',ja:'Hito o miru.',ht:'M gade moun yo.'}},
    {n:'Un homme entre.',t:{en:'A man enters.',es:'Un hombre entra.',de:'Ein Mann kommt rein.',ru:'Muzhchina vkhodit.',zh:'Yí gè nánrén jìn lái.',ja:'Otoko ga hairu.',ht:'Yon mesye antre.'}},
    {n:'Il semble pressé.',t:{en:'He seems in a hurry.',es:'Parece apurado.',de:'Er scheint in Eile zu sein.',ru:'On toropitsya.',zh:'Tā hěn gǎn.',ja:'Isogashisō.',ht:'Li sanble prese.'}},
    {n:'Il parle au serveur.',t:{en:'He talks to the waiter.',es:'Habla con el camarero.',de:'Er spricht mit dem Kellner.',ru:'On razgovarivaet s ofitsiantom.',zh:'Tā gēn fúwùyuán shuōhuà.',ja:'Uētā to hanasu.',ht:'Li pale ak sèvè a.'}},

    {n:'Je bois mon café.',t:{en:'I drink my coffee.',es:'Bebo mi café.',de:'Ich trinke meinen Kaffee.',ru:'Ya pyu kofe.',zh:'Wǒ hē kāfēi.',ja:'Kōhī o nomu.',ht:'M bwè kafe mwen.'}},
    {n:'Je lis un journal.',t:{en:'I read a newspaper.',es:'Leo un periódico.',de:'Ich lese eine Zeitung.',ru:'Ya chitayu gazetu.',zh:'Wǒ dú bàozhǐ.',ja:'Shinbun o yomu.',ht:'M li jounal.'}},
    {n:'La musique joue.',t:{en:'Music is playing.',es:'La música suena.',de:'Musik spielt.',ru:'Igrayet muzyka.',zh:'Yīnyuè zài bōfàng.',ja:'Ongaku ga nagareru.',ht:'Mizik ap jwe.'}},
    {n:'L’ambiance est agréable.',t:{en:'The atmosphere is pleasant.',es:'El ambiente es agradable.',de:'Die Atmosphäre ist angenehm.',ru:'Atmosfera priyatnaya.',zh:'Qìfēn hěn hǎo.',ja:'Funiki ga ii.',ht:'Anbyans lan agreyab.'}},
    {n:'Je me sens bien.',t:{en:'I feel good.',es:'Me siento bien.',de:'Ich fühle mich gut.',ru:'Ya chuvstvuyu sebya khorosho.',zh:'Wǒ gǎnjué hěn hǎo.',ja:'Kimochi ga ii.',ht:'M santi m byen.'}},

    {n:'Je termine mon café.',t:{en:'I finish my coffee.',es:'Termino mi café.',de:'Ich beende meinen Kaffee.',ru:'Ya zakanchivayu kofe.',zh:'Wǒ hē wán kāfēi.',ja:'Kōhī o nomi owaru.',ht:'M fini kafe mwen.'}},
    {n:'Je paie.',t:{en:'I pay.',es:'Pago.',de:'Ich bezahle.',ru:'Ya plachu.',zh:'Wǒ fù qián.',ja:'Harau.',ht:'M peye.'}},
    {n:'Je remercie le serveur.',t:{en:'I thank the waiter.',es:'Agradezco al camarero.',de:'Ich danke dem Kellner.',ru:'Ya blagodaryu ofitsianta.',zh:'Wǒ gǎnxiè fúwùyuán.',ja:'Uētā ni kansha.',ht:'M remèsye sèvè a.'}},
    {n:'Je sors du café.',t:{en:'I leave the café.',es:'Salgo del café.',de:'Ich verlasse das Café.',ru:'Ya vykhozhu iz kafe.',zh:'Wǒ líkāi kāfēi diàn.',ja:'Kafe o deru.',ht:'M soti nan kafe a.'}},
    {n:'La rue est animée.',t:{en:'The street is lively.',es:'La calle está animada.',de:'Die Straße ist lebhaft.',ru:'Ulitsa zhivaya.',zh:'Jiē shàng hěn rènao.',ja:'Michi wa nigiyaka.',ht:'Lari a vivan.'}},

    {n:'Les gens marchent vite.',t:{en:'People walk fast.',es:'La gente camina rápido.',de:'Die Leute gehen schnell.',ru:'Lyudi idut bystro.',zh:'Rénmen zǒu de hěn kuài.',ja:'Hito ga hayaku aruku.',ht:'Moun yo mache vit.'}},
    {n:'Les voitures passent.',t:{en:'Cars pass by.',es:'Los coches pasan.',de:'Autos fahren vorbei.',ru:'Mashiny proezzhayut.',zh:'Qìchē jīngguò.',ja:'Kuruma ga tōru.',ht:'Machin ap pase.'}},
    {n:'Je continue ma marche.',t:{en:'I continue walking.',es:'Sigo caminando.',de:'Ich gehe weiter.',ru:'Ya prodolzhayu idti.',zh:'Wǒ jìxù zǒu.',ja:'Aruki tsuzukeru.',ht:'M kontinye mache.'}},
    {n:'Je vois un parc.',t:{en:'I see a park.',es:'Veo un parque.',de:'Ich sehe einen Park.',ru:'Ya vizhu park.',zh:'Wǒ kàn dào gōngyuán.',ja:'Kōen o miru.',ht:'M wè yon pak.'}},
    {n:'Je décide d’entrer.',t:{en:'I decide to enter.',es:'Decido entrar.',de:'Ich entscheide hineinzugehen.',ru:'Ya reshayu zayti.',zh:'Wǒ juédìng jìn qù.',ja:'Hairu koto ni suru.',ht:'M deside antre.'}},

    {n:'Les enfants jouent.',t:{en:'Children are playing.',es:'Los niños juegan.',de:'Kinder spielen.',ru:'Deti igrayut.',zh:'Háizi men zài wán.',ja:'Kodomo ga asobu.',ht:'Timoun yo ap jwe.'}},
    {n:'Un chien court.',t:{en:'A dog runs.',es:'Un perro corre.',de:'Ein Hund rennt.',ru:'Sobaka bezhit.',zh:'Yì zhī gǒu zài pǎo.',ja:'Inu ga hashiru.',ht:'Yon chen ap kouri.'}},
    {n:'Les oiseaux chantent.',t:{en:'Birds sing.',es:'Los pájaros cantan.',de:'Vögel singen.',ru:'Ptitsy poyut.',zh:'Niǎo zài chàng.',ja:'Tori ga naku.',ht:'Zwazo ap chante.'}},
    {n:'Je m’assois sur un banc.',t:{en:'I sit on a bench.',es:'Me siento en un banco.',de:'Ich setze mich auf eine Bank.',ru:'Ya sazhuys na skameyku.',zh:'Wǒ zuò zài cháng yǐ.',ja:'Benchi ni suwaru.',ht:'M chita sou yon ban.'}},
    {n:'Je regarde le ciel.',t:{en:'I look at the sky.',es:'Miro el cielo.',de:'Ich schaue den Himmel an.',ru:'Ya smotryu na nebo.',zh:'Wǒ kàn tiān.',ja:'Sora o miru.',ht:'M gade syèl la.'}},

    {n:'Le ciel est bleu.',t:{en:'The sky is blue.',es:'El cielo es azul.',de:'Der Himmel ist blau.',ru:'Nebo sineye.',zh:'Tiān shì lán sè.',ja:'Sora wa aoi.',ht:'Syèl la ble.'}},
    {n:'Je souris.',t:{en:'I smile.',es:'Sonrío.',de:'Ich lächle.',ru:'Ya ulybayus.',zh:'Wǒ wēixiào.',ja:'Hohoemu.',ht:'M souri.'}},
    {n:'Je pense à ma journée.',t:{en:'I think about my day.',es:'Pienso en mi día.',de:'Ich denke an meinen Tag.',ru:'Ya dumayu o dne.',zh:'Wǒ xiǎng wǒ de yītiān.',ja:'Ichinichi o kangaeru.',ht:'M panse ak jounen m.'}},
    {n:'La journée commence bien.',t:{en:'The day starts well.',es:'El día empieza bien.',de:'Der Tag beginnt gut.',ru:'Den nachinaetsya khorosho.',zh:'Yītiān kāishǐ de hěn hǎo.',ja:'Ii ichinichi no hajimari.',ht:'Jounen an kòmanse byen.'}},
    {n:'Je me sens heureux.',t:{en:'I feel happy.',es:'Me siento feliz.',de:'Ich fühle mich glücklich.',ru:'Ya schastliv.',zh:'Wǒ hěn kāixīn.',ja:'Ureshii.',ht:'M santi m kontan.'}}

  ]
  },
  flirt_relations:{
  fr:'Flirt et relations',
  en:'Flirting and relationships',
  es:'Coqueteo y relaciones',
  ht:'Flirt ak relasyon',
  de:'Flirten und Beziehungen',
  ru:'Flirt i otnosheniya',
  zh:'Liáotiān hé liàn\'ài',
  ja:'Koi to kankei',
  icon:'❤️',
  items:[

{n:'Tu es très belle.',t:{en:'You are very beautiful.',es:'Eres muy hermosa.',de:'Du bist sehr schön.',ru:'Ty ochen krasivaya.',zh:'Nǐ hěn piàoliang.',ja:'Totemo kirei.',ht:'Ou bèl anpil.'}},
{n:'Tu es très beau.',t:{en:'You are very handsome.',es:'Eres muy guapo.',de:'Du bist sehr gutaussehend.',ru:'Ty ochen krasivyy.',zh:'Nǐ hěn shuài.',ja:'Kakkoii.',ht:'Ou bèl gason anpil.'}},
{n:'J’aime ton sourire.',t:{en:'I like your smile.',es:'Me gusta tu sonrisa.',de:'Ich mag dein Lächeln.',ru:'Mne nravitsya tvoya ulybka.',zh:'Wǒ xǐhuān nǐ de xiàoróng.',ja:'Anata no egao ga suki.',ht:'M renmen souri ou.'}},
{n:'Tes yeux sont magnifiques.',t:{en:'Your eyes are beautiful.',es:'Tus ojos son hermosos.',de:'Deine Augen sind wunderschön.',ru:'U tebya krasivye glaza.',zh:'Nǐ de yǎnjing hěn měi.',ja:'Me ga kirei.',ht:'Je ou bèl anpil.'}},
{n:'Tu es vraiment charmant.',t:{en:'You are really charming.',es:'Eres muy encantador.',de:'Du bist sehr charmant.',ru:'Ty ochen ocharovatelen.',zh:'Nǐ hěn yǒu mèilì.',ja:'Totemo miryokuteki.',ht:'Ou gen anpil cham.'}},

{n:'On peut parler un peu ?',t:{en:'Can we talk a little?',es:'¿Podemos hablar un poco?',de:'Können wir kurz reden?',ru:'Mozhem pogovorit?',zh:'Wǒmen liáo liáo ma?',ja:'Chotto hanasanai?',ht:'Nou ka pale yon ti jan?'}},
{n:'Je peux m’asseoir avec toi ?',t:{en:'Can I sit with you?',es:'¿Puedo sentarme contigo?',de:'Darf ich mich zu dir setzen?',ru:'Mozhno prisest?',zh:'Wǒ kěyǐ zuò zhèlǐ ma?',ja:'Suwatte mo ii?',ht:'M ka chita bò kote w?'}},
{n:'Tu viens souvent ici ?',t:{en:'Do you come here often?',es:'¿Vienes aquí a menudo?',de:'Kommst du oft hierher?',ru:'Ty chasto syuda khodish?',zh:'Nǐ cháng lái zhèlǐ ma?',ja:'Yoku kuru?',ht:'Ou vini isit souvan?'}},
{n:'Tu as un style incroyable.',t:{en:'You have an amazing style.',es:'Tienes un estilo increíble.',de:'Du hast einen tollen Stil.',ru:'U tebya klassny stil.',zh:'Nǐ de fēnggé hěn bàng.',ja:'Sutairu ga ii.',ht:'Ou gen anpil stil.'}},
{n:'Tu es différente des autres.',t:{en:'You are different from others.',es:'Eres diferente.',de:'Du bist anders.',ru:'Ty drugaya.',zh:'Nǐ hěn tèbié.',ja:'Chotto chigau.',ht:'Ou diferan.'}},

{n:'J’aimerais te connaître.',t:{en:'I would like to know you.',es:'Me gustaría conocerte.',de:'Ich möchte dich kennenlernen.',ru:'Ya khochu tebya uznat.',zh:'Wǒ xiǎng liǎojiě nǐ.',ja:'Anata o shiritai.',ht:'M ta renmen konnen w.'}},
{n:'Tu es célibataire ?',t:{en:'Are you single?',es:'¿Estás soltero?',de:'Bist du single?',ru:'Ty svoboden?',zh:'Nǐ dānshēn ma?',ja:'Dokushin?',ht:'Ou selibatè?'}},
{n:'On peut se revoir ?',t:{en:'Can we meet again?',es:'¿Podemos vernos otra vez?',de:'Können wir uns wiedersehen?',ru:'Uvidimsya snova?',zh:'Wǒmen kěyǐ zài jiàn ma?',ja:'Mata au?',ht:'Nou ka wè ankò?'}},
{n:'Tu veux prendre un café ?',t:{en:'Do you want to get coffee?',es:'¿Quieres tomar un café?',de:'Willst du einen Kaffee trinken?',ru:'Khochesh kofe?',zh:'Yào hē kāfēi ma?',ja:'Kōhī nomu?',ht:'Ou vle bwè kafe?'}},
{n:'Tu veux sortir avec moi ?',t:{en:'Do you want to go out with me?',es:'¿Quieres salir conmigo?',de:'Willst du mit mir ausgehen?',ru:'Poydyosh so mnoy?',zh:'Nǐ yuànyì hé wǒ chūqù ma?',ja:'Issho ni iku?',ht:'Ou vle soti avè m?'}},

{n:'Tu me plais.',t:{en:'I like you.',es:'Me gustas.',de:'Du gefällst mir.',ru:'Ty mne nravishsya.',zh:'Wǒ xǐhuān nǐ.',ja:'Suki.',ht:'M renmen w.'}},
{n:'Je pense à toi.',t:{en:'I think about you.',es:'Pienso en ti.',de:'Ich denke an dich.',ru:'Ya dumayu o tebe.',zh:'Wǒ xiǎng nǐ.',ja:'Kimi o omou.',ht:'M ap panse ak ou.'}},
{n:'Tu me manques.',t:{en:'I miss you.',es:'Te extraño.',de:'Du fehlst mir.',ru:'Ya skuchayu.',zh:'Wǒ xiǎng nǐ.',ja:'Aitai.',ht:'Ou manke m.'}},
{n:'J’aime passer du temps avec toi.',t:{en:'I like spending time with you.',es:'Me gusta pasar tiempo contigo.',de:'Ich verbringe gern Zeit mit dir.',ru:'Mne nravitsya byt s toboy.',zh:'Wǒ xǐhuān gēn nǐ zài yìqǐ.',ja:'Issho ni iru no ga suki.',ht:'M renmen pase tan avè w.'}},
{n:'Tu me rends heureux.',t:{en:'You make me happy.',es:'Me haces feliz.',de:'Du machst mich glücklich.',ru:'Ty delaesh menya schastlivym.',zh:'Nǐ ràng wǒ kāixīn.',ja:'Shiawase.',ht:'Ou fè m kontan.'}}

  ]
},
  messages_flirt:{
  fr:'Messages de flirt',
  en:'Flirting messages',
  es:'Mensajes de coqueteo',
  ht:'Mesaj flirt',
  de:'Flirt Nachrichten',
  ru:'Flirt soobshcheniya',
  zh:'Liáotiān duǎnxìn',
  ja:'Flirt messeji',
  icon:'💬',
  items:[

{n:'Salut, comment va ta journée ?',t:{en:'Hi, how is your day going?',es:'Hola, ¿cómo va tu día?',de:'Hallo, wie läuft dein Tag?',ru:'Privet, kak den?',zh:'Nǐ de yītiān zěnmeyàng?',ja:'Kyō wa dō?',ht:'Bonjou, kijan jounen w?'}},
{n:'Je pensais à toi.',t:{en:'I was thinking about you.',es:'Estaba pensando en ti.',de:'Ich habe an dich gedacht.',ru:'Ya dumal o tebe.',zh:'Wǒ gāng xiǎng dào nǐ.',ja:'Kimi no koto omotteta.',ht:'M t ap panse ak ou.'}},
{n:'Tu fais quoi ?',t:{en:'What are you doing?',es:'¿Qué haces?',de:'Was machst du?',ru:'Chto delaesh?',zh:'Nǐ zài zuò shénme?',ja:'Nani shiteru?',ht:'Kisa w ap fè?'}},
{n:'Tu me manques déjà.',t:{en:'I already miss you.',es:'Ya te extraño.',de:'Du fehlst mir schon.',ru:'Ya uzhe skuchayu.',zh:'Wǒ yǐjīng xiǎng nǐ le.',ja:'Mō aitai.',ht:'Ou deja manke m.'}},
{n:'J’aime parler avec toi.',t:{en:'I like talking with you.',es:'Me gusta hablar contigo.',de:'Ich rede gern mit dir.',ru:'Mne nravitsya govorit s toboy.',zh:'Wǒ xǐhuān gēn nǐ liáotiān.',ja:'Hanashite tanoshii.',ht:'M renmen pale avè w.'}},

{n:'Tu me fais sourire.',t:{en:'You make me smile.',es:'Me haces sonreír.',de:'Du bringst mich zum Lächeln.',ru:'Ty zastavlyaesh menya ulybatsya.',zh:'Nǐ ràng wǒ xiàoróng.',ja:'Egao ni naru.',ht:'Ou fè m souri.'}},
{n:'Je veux te revoir.',t:{en:'I want to see you again.',es:'Quiero verte otra vez.',de:'Ich will dich wiedersehen.',ru:'Khochu uvidet tebya.',zh:'Wǒ xiǎng zài jiàn nǐ.',ja:'Mata aitai.',ht:'M vle wè w ankò.'}},
{n:'Tu es spéciale.',t:{en:'You are special.',es:'Eres especial.',de:'Du bist besonders.',ru:'Ty osobennaya.',zh:'Nǐ hěn tèbié.',ja:'Tokubetsu.',ht:'Ou espesyal.'}},
{n:'Bonne nuit.',t:{en:'Good night.',es:'Buenas noches.',de:'Gute Nacht.',ru:'Spokoynoy nochi.',zh:'Wǎn ān.',ja:'Oyasumi.',ht:'Bòn nwit.'}},
{n:'Fais de beaux rêves.',t:{en:'Sweet dreams.',es:'Dulces sueños.',de:'Süße Träume.',ru:'Sladkikh snov.',zh:'Zuò gè hǎo mèng.',ja:'Yoi yume.',ht:'Fè bèl rèv.'}},

{n:'Tu dors ?',t:{en:'Are you sleeping?',es:'¿Estás durmiendo?',de:'Schläfst du?',ru:'Ty spish?',zh:'Nǐ shuì le ma?',ja:'Neteru?',ht:'Ou dòmi?'}},
{n:'Tu me rends curieux.',t:{en:'You make me curious.',es:'Me das curiosidad.',de:'Du machst mich neugierig.',ru:'Ty menya interesuesh.',zh:'Nǐ ràng wǒ hǎoqí.',ja:'Ki ni naru.',ht:'Ou fè m kirye.'}},
{n:'Je veux apprendre à te connaître.',t:{en:'I want to know you better.',es:'Quiero conocerte mejor.',de:'Ich will dich besser kennenlernen.',ru:'Khochu uznat tebya.',zh:'Wǒ xiǎng gèng liǎojiě nǐ.',ja:'Yoku shiritai.',ht:'M vle konnen w pi byen.'}},
{n:'Tu es libre ce soir ?',t:{en:'Are you free tonight?',es:'¿Estás libre esta noche?',de:'Hast du heute Abend Zeit?',ru:'Ty svobodna segodnya?',zh:'Jīnwǎn yǒu kòng ma?',ja:'Konya aiteru?',ht:'Ou lib aswè a?'}},
{n:'On sort ce week-end ?',t:{en:'Shall we go out this weekend?',es:'¿Salimos este fin de semana?',de:'Gehen wir am Wochenende aus?',ru:'Poydyom vykhodnye?',zh:'Zhōumò chūqù ma?',ja:'Shūmatsu iku?',ht:'Nou soti wikenn sa?'}},

{n:'Tu es adorable.',t:{en:'You are adorable.',es:'Eres adorable.',de:'Du bist süß.',ru:'Ty ochen milaya.',zh:'Nǐ hěn kě\'ài.',ja:'Kawaii.',ht:'Ou dous anpil.'}},
{n:'Tu es drôle.',t:{en:'You are funny.',es:'Eres gracioso.',de:'Du bist lustig.',ru:'Ty smeshnaya.',zh:'Nǐ hěn yǒuqù.',ja:'Omoshiroi.',ht:'Ou komik.'}},
{n:'Tu es intelligente.',t:{en:'You are smart.',es:'Eres inteligente.',de:'Du bist klug.',ru:'Ty umnaya.',zh:'Nǐ hěn cōngmíng.',ja:'Atama ii.',ht:'Ou entèlijan.'}},
{n:'Tu es incroyable.',t:{en:'You are amazing.',es:'Eres increíble.',de:'Du bist unglaublich.',ru:'Ty neveroyatnaya.',zh:'Nǐ tài bàng le.',ja:'Sugoi.',ht:'Ou enkwayab.'}},
{n:'Je suis content de t’avoir rencontré.',t:{en:'I am happy to have met you.',es:'Estoy feliz de conocerte.',de:'Ich bin froh dich getroffen zu haben.',ru:'Rad znakomstvu.',zh:'Hěn gāoxìng rènshi nǐ.',ja:'Aete yokatta.',ht:'M kontan rankontre w.'}}

  ]
},
  taquinerie_flirt:{
  fr:'Humour et taquinerie flirt',
  en:'Playful teasing',
  es:'Bromas coquetas',
  ht:'Blag flirt',
  de:'Flirt Neckereien',
  ru:'Flirt podkolki',
  zh:'Tiáoqíng wánxiào',
  ja:'Koi no karakai',
  icon:'😏',
  items:[

{n:'Tu es toujours comme ça ?',t:{en:'Are you always like this?',es:'¿Siempre eres así?',de:'Bist du immer so?',ru:'Ty vsegda takaya?',zh:'Nǐ yīzhí zhèyàng ma?',ja:'Itsumo konna?',ht:'Ou toujou konsa?'}},
{n:'Tu essaies de m’impressionner ?',t:{en:'Are you trying to impress me?',es:'¿Intentas impresionarme?',de:'Versuchst du mich zu beeindrucken?',ru:'Ty menya vpechatlit khochesh?',zh:'Nǐ xiǎng ràng wǒ yìnxiàng shēnkè ma?',ja:'Impress shiyō?',ht:'Ou ap eseye enpresyone m?'}},
{n:'Je crois que tu es dangereuse.',t:{en:'I think you are dangerous.',es:'Creo que eres peligrosa.',de:'Ich glaube du bist gefährlich.',ru:'Dumayu ty opasnaya.',zh:'Wǒ juéde nǐ hěn wéixiǎn.',ja:'Chotto abunai.',ht:'M panse ou danjere.'}},
{n:'Tu fais ça avec tout le monde ?',t:{en:'Do you do that with everyone?',es:'¿Haces eso con todos?',de:'Machst du das mit jedem?',ru:'Ty tak so vsemi?',zh:'Nǐ duì měi gè rén dōu zhèyàng ma?',ja:'Minna ni?',ht:'Ou fè sa ak tout moun?'}},
{n:'Tu es un peu folle.',t:{en:'You are a little crazy.',es:'Estás un poco loca.',de:'Du bist ein bisschen verrückt.',ru:'Ty nemnogo sumasshedshaya.',zh:'Nǐ yǒudiǎn fēngkuáng.',ja:'Chotto okashii.',ht:'Ou fou yon ti kras.'}},

{n:'Tu es trop confiante.',t:{en:'You are too confident.',es:'Eres demasiado segura.',de:'Du bist zu selbstsicher.',ru:'Ty slishkom uverennaya.',zh:'Nǐ tài zìxìn.',ja:'Jishin ari sugiru.',ht:'Ou twò konfyans.'}},
{n:'Je ne te crois pas.',t:{en:'I don’t believe you.',es:'No te creo.',de:'Ich glaube dir nicht.',ru:'Ya tebe ne veryu.',zh:'Wǒ bù xìn.',ja:'Shinjirarenai.',ht:'M pa kwè w.'}},
{n:'Tu es suspecte.',t:{en:'You are suspicious.',es:'Eres sospechosa.',de:'Du bist verdächtig.',ru:'Ty podozritelnaya.',zh:'Nǐ hěn kěyí.',ja:'Ayashii.',ht:'Ou sispèk.'}},
{n:'Je pense que tu caches quelque chose.',t:{en:'I think you hide something.',es:'Creo que escondes algo.',de:'Ich glaube du versteckst etwas.',ru:'Ty chto to skryvaesh.',zh:'Wǒ juéde nǐ yǒu mìmì.',ja:'Nanika kakushiteru.',ht:'M panse ou kache yon bagay.'}},
{n:'Tu es trop gentille.',t:{en:'You are too nice.',es:'Eres demasiado amable.',de:'Du bist zu nett.',ru:'Ty slishkom dobraya.',zh:'Nǐ tài hǎo.',ja:'Yasashisugiru.',ht:'Ou twò janti.'}},

{n:'Tu veux des problèmes ?',t:{en:'Do you want trouble?',es:'¿Quieres problemas?',de:'Willst du Ärger?',ru:'Ty khochesh problem?',zh:'Nǐ xiǎng zhǎo máfan ma?',ja:'Mondai?',ht:'Ou vle pwoblèm?'}},
{n:'Tu es imprévisible.',t:{en:'You are unpredictable.',es:'Eres impredecible.',de:'Du bist unberechenbar.',ru:'Ty nepredskazuemaya.',zh:'Nǐ bù kě yùcè.',ja:'Yomenai.',ht:'Ou pa previzib.'}},
{n:'Je dois me méfier de toi.',t:{en:'I must be careful with you.',es:'Debo tener cuidado contigo.',de:'Ich muss vorsichtig mit dir sein.',ru:'Mne nado byt ostorozhnym.',zh:'Wǒ yào xiǎoxīn nǐ.',ja:'Ki o tsukeru.',ht:'M dwe fè atansyon ak ou.'}},
{n:'Tu es pleine de surprises.',t:{en:'You are full of surprises.',es:'Estás llena de sorpresas.',de:'Du bist voller Überraschungen.',ru:'Ty polna syurprizov.',zh:'Nǐ chōngmǎn jīngxǐ.',ja:'Odoroki ga ōi.',ht:'Ou plen sipriz.'}},
{n:'Tu essaies de me provoquer.',t:{en:'You try to provoke me.',es:'Intentas provocarme.',de:'Du versuchst mich zu provozieren.',ru:'Ty menya provotsiruesh.',zh:'Nǐ zài tiǎodòu wǒ.',ja:'Chotto chōhatsu.',ht:'Ou ap pwovoke m.'}},

{n:'Tu es trop curieuse.',t:{en:'You are too curious.',es:'Eres muy curiosa.',de:'Du bist zu neugierig.',ru:'Ty slishkom lyubopytnaya.',zh:'Nǐ tài hàoqí.',ja:'Kōkishin tsuyoi.',ht:'Ou twò kirye.'}},
{n:'Je pense que tu aimes me taquiner.',t:{en:'I think you like teasing me.',es:'Creo que te gusta molestarme.',de:'Ich glaube du neckst mich gern.',ru:'Ty lyubish menya podkolot.',zh:'Nǐ xǐhuān dòu wǒ.',ja:'Karakau no suki.',ht:'M panse ou renmen takine m.'}},
{n:'Tu joues avec moi.',t:{en:'You are playing with me.',es:'Estás jugando conmigo.',de:'Du spielst mit mir.',ru:'Ty igrayesh so mnoy.',zh:'Nǐ zài gēn wǒ wán.',ja:'Asobun?',ht:'Ou ap jwe avè m.'}},
{n:'Tu es une énigme.',t:{en:'You are a mystery.',es:'Eres un misterio.',de:'Du bist ein Rätsel.',ru:'Ty zagadka.',zh:'Nǐ shì mí.',ja:'Nazo.',ht:'Ou se yon mistè.'}},
{n:'Tu me rends fou.',t:{en:'You drive me crazy.',es:'Me vuelves loco.',de:'Du machst mich verrückt.',ru:'Ty svodish menya s uma.',zh:'Nǐ ràng wǒ fēng.',ja:'Kuruwaseru.',ht:'Ou fè m fou.'}}

  ]
},
  compliments_naturels:{
  fr:'Compliments naturels',
  en:'Natural compliments',
  es:'Cumplidos naturales',
  ht:'Konpliman natirèl',
  de:'Natürliche Komplimente',
  ru:'Estestvennye komplimenty',
  zh:'Zìrán zànyáng',
  ja:'Shizen na homeru',
  icon:'✨',
  items:[

{n:'Tu es magnifique.',t:{en:'You are gorgeous.',es:'Eres hermosa.',de:'Du bist wunderschön.',ru:'Ty prekrasna.',zh:'Nǐ hěn měi.',ja:'Totemo kirei.',ht:'Ou bèl anpil.'}},
{n:'Tu es très élégant.',t:{en:'You are very elegant.',es:'Eres muy elegante.',de:'Du bist sehr elegant.',ru:'Ty ochen elegantnyy.',zh:'Nǐ hěn yōuyǎ.',ja:'Ereganto.',ht:'Ou trè elegant.'}},
{n:'J’aime ton style.',t:{en:'I like your style.',es:'Me gusta tu estilo.',de:'Ich mag deinen Stil.',ru:'Mne nravitsya tvoy stil.',zh:'Wǒ xǐhuān nǐ de fēnggé.',ja:'Sutairu ga suki.',ht:'M renmen stil ou.'}},
{n:'Tu as une belle énergie.',t:{en:'You have great energy.',es:'Tienes buena energía.',de:'Du hast tolle Energie.',ru:'U tebya khoroshaya energiya.',zh:'Nǐ de néngliàng hěn hǎo.',ja:'Ii enerugī.',ht:'Ou gen bon enèji.'}},
{n:'Ton sourire est incroyable.',t:{en:'Your smile is amazing.',es:'Tu sonrisa es increíble.',de:'Dein Lächeln ist unglaublich.',ru:'Tvoya ulybka neveroyatnaya.',zh:'Nǐ de xiàoróng hěn bàng.',ja:'Egao ga suteki.',ht:'Souri ou bèl anpil.'}},

{n:'Tes yeux sont magnifiques.',t:{en:'Your eyes are beautiful.',es:'Tus ojos son hermosos.',de:'Deine Augen sind wunderschön.',ru:'U tebya krasivye glaza.',zh:'Nǐ de yǎnjing hěn měi.',ja:'Me ga kirei.',ht:'Je ou bèl anpil.'}},
{n:'Tu es très charismatique.',t:{en:'You are very charismatic.',es:'Eres muy carismático.',de:'Du bist sehr charismatisch.',ru:'Ty ochen kharizmatichen.',zh:'Nǐ hěn yǒu mèilì.',ja:'Karizuma aru.',ht:'Ou gen anpil karis.'}},
{n:'Tu es drôle.',t:{en:'You are funny.',es:'Eres gracioso.',de:'Du bist lustig.',ru:'Ty smeshnoy.',zh:'Nǐ hěn yǒuqù.',ja:'Omoshiroi.',ht:'Ou komik.'}},
{n:'Tu es très intelligent.',t:{en:'You are very smart.',es:'Eres muy inteligente.',de:'Du bist sehr klug.',ru:'Ty ochen umnyy.',zh:'Nǐ hěn cōngmíng.',ja:'Atama ii.',ht:'Ou entèlijan anpil.'}},
{n:'Tu es inspirant.',t:{en:'You are inspiring.',es:'Eres inspirador.',de:'Du bist inspirierend.',ru:'Ty vdokhnovlyaesh.',zh:'Nǐ hěn gǔwǔ rén.',ja:'Inspire suru.',ht:'Ou enspire.'}},

{n:'Tu as bon goût.',t:{en:'You have good taste.',es:'Tienes buen gusto.',de:'Du hast guten Geschmack.',ru:'U tebya khoroshiy vkus.',zh:'Nǐ yǒu hǎo pǐnwèi.',ja:'Sense ga ii.',ht:'Ou gen bon gou.'}},
{n:'Tu es très sympathique.',t:{en:'You are very nice.',es:'Eres muy simpático.',de:'Du bist sehr nett.',ru:'Ty ochen milyy.',zh:'Nǐ hěn qīqiè.',ja:'Shinsetsu.',ht:'Ou trè janti.'}},
{n:'Tu es impressionnant.',t:{en:'You are impressive.',es:'Eres impresionante.',de:'Du bist beeindruckend.',ru:'Ty vpechatlyaesh.',zh:'Nǐ hěn lìhài.',ja:'Sugoi.',ht:'Ou enpresyonan.'}},
{n:'Tu es unique.',t:{en:'You are unique.',es:'Eres único.',de:'Du bist einzigartig.',ru:'Ty unikalnyy.',zh:'Nǐ hěn tèbié.',ja:'Yuniiku.',ht:'Ou inik.'}},
{n:'Tu es adorable.',t:{en:'You are adorable.',es:'Eres adorable.',de:'Du bist süß.',ru:'Ty ochen mil.',zh:'Nǐ hěn kě\'ài.',ja:'Kawaii.',ht:'Ou dous anpil.'}},

{n:'Tu es incroyable.',t:{en:'You are amazing.',es:'Eres increíble.',de:'Du bist unglaublich.',ru:'Ty neveroyatnyy.',zh:'Nǐ tài bàng.',ja:'Sugoi.',ht:'Ou enkwayab.'}},
{n:'Tu es très intéressant.',t:{en:'You are very interesting.',es:'Eres muy interesante.',de:'Du bist sehr interessant.',ru:'Ty ochen interesnyy.',zh:'Nǐ hěn yǒu yìsi.',ja:'Omoshiroi hito.',ht:'Ou enteresan anpil.'}},
{n:'Tu as beaucoup de charme.',t:{en:'You have a lot of charm.',es:'Tienes mucho encanto.',de:'Du hast viel Charme.',ru:'U tebya mnogo sharma.',zh:'Nǐ hěn yǒu mèilì.',ja:'Charm ga aru.',ht:'Ou gen anpil cham.'}},
{n:'Tu es vraiment cool.',t:{en:'You are really cool.',es:'Eres muy genial.',de:'Du bist echt cool.',ru:'Ty ochen krutoy.',zh:'Nǐ hěn kù.',ja:'Kakkoii.',ht:'Ou vrèman cool.'}},
{n:'Tu es très talentueux.',t:{en:'You are very talented.',es:'Eres muy talentoso.',de:'Du bist sehr talentiert.',ru:'Ty ochen talantliv.',zh:'Nǐ hěn yǒu cáinéng.',ja:'Sainō aru.',ht:'Ou gen anpil talan.'}}

]
  },
  storytelling_vie:{
  fr:'Storytelling vie',
  en:'Life storytelling',
  es:'Historia de vida',
  ht:'Istwa lavi',
  de:'Lebensgeschichten',
  ru:'Istorii zhizni',
  zh:'Shēnghuó gùshì',
  ja:'Jinsei sutōrī',
  icon:'📖',
  items:[

{n:'Je suis né ici.',t:{en:'I was born here.',es:'Nací aquí.',de:'Ich wurde hier geboren.',ru:'Ya rodilsya zdes.',zh:'Wǒ shēng zài zhèlǐ.',ja:'Koko de umareta.',ht:'M fèt isit.'}},
{n:'J’ai grandi dans cette ville.',t:{en:'I grew up in this city.',es:'Crecí en esta ciudad.',de:'Ich bin in dieser Stadt aufgewachsen.',ru:'Ya vyros v etom gorode.',zh:'Wǒ zài zhège chéngshì zhǎng dà.',ja:'Kono machi de sodatta.',ht:'M grandi nan vil sa.'}},
{n:'Mon enfance était simple.',t:{en:'My childhood was simple.',es:'Mi infancia fue simple.',de:'Meine Kindheit war einfach.',ru:'Moye detstvo bylo prostym.',zh:'Wǒ de tóngnián hěn jiǎndān.',ja:'Kodomo jidai wa kantan.',ht:'Timounaj mwen te senp.'}},
{n:'J’ai beaucoup appris.',t:{en:'I learned a lot.',es:'Aprendí mucho.',de:'Ich habe viel gelernt.',ru:'Ya mnogo nauchilsya.',zh:'Wǒ xué dào hěn duō.',ja:'Takusan mananda.',ht:'M aprann anpil.'}},
{n:'Ma famille est importante pour moi.',t:{en:'My family is important to me.',es:'Mi familia es importante.',de:'Meine Familie ist wichtig.',ru:'Semya vazhna.',zh:'Jiārén hěn zhòngyào.',ja:'Kazoku wa taisetsu.',ht:'Fanmi mwen enpòtan pou mwen.'}},

{n:'J’ai toujours été curieux.',t:{en:'I have always been curious.',es:'Siempre fui curioso.',de:'Ich war immer neugierig.',ru:'Ya vsegda byl lyubopytnym.',zh:'Wǒ yīzhí hěn hàoqí.',ja:'Itsumo kōkishin ga tsuyoi.',ht:'M toujou kirye.'}},
{n:'J’aime apprendre.',t:{en:'I like learning.',es:'Me gusta aprender.',de:'Ich lerne gern.',ru:'Mne nravitsya uchitsya.',zh:'Wǒ xǐhuān xuéxí.',ja:'Manabu no ga suki.',ht:'M renmen aprann.'}},
{n:'J’ai vécu des moments difficiles.',t:{en:'I lived difficult moments.',es:'Viví momentos difíciles.',de:'Ich habe schwierige Zeiten erlebt.',ru:'Byli trudnye vremena.',zh:'Wǒ jīnglì guò kùnnán.',ja:'Taihen na toki ga atta.',ht:'M pase moman difisil.'}},
{n:'Mais j’ai continué.',t:{en:'But I continued.',es:'Pero continué.',de:'Aber ich habe weitergemacht.',ru:'No ya prodolzhal.',zh:'Dàn wǒ jìxù.',ja:'Demo tsuzuketa.',ht:'Men m kontinye.'}},
{n:'Chaque expérience m’a changé.',t:{en:'Each experience changed me.',es:'Cada experiencia me cambió.',de:'Jede Erfahrung hat mich verändert.',ru:'Kazhdyy opyt menya izmenil.',zh:'Měi cì jīnglì dōu gǎibiàn wǒ.',ja:'Keiken ga watashi o kaeta.',ht:'Chak eksperyans chanje m.'}},

{n:'Je travaille dur.',t:{en:'I work hard.',es:'Trabajo duro.',de:'Ich arbeite hart.',ru:'Ya mnogo rabotayu.',zh:'Wǒ hěn nǔlì gōngzuò.',ja:'Isshōkenmei hataraku.',ht:'M travay di.'}},
{n:'Je crois en mes rêves.',t:{en:'I believe in my dreams.',es:'Creo en mis sueños.',de:'Ich glaube an meine Träume.',ru:'Ya veryu v mechty.',zh:'Wǒ xiāngxìn mèngxiǎng.',ja:'Yume o shinjiru.',ht:'M kwè nan rèv mwen.'}},
{n:'Je veux évoluer.',t:{en:'I want to grow.',es:'Quiero crecer.',de:'Ich will wachsen.',ru:'Khochu razvivat’sya.',zh:'Wǒ xiǎng chéngzhǎng.',ja:'Seichō shitai.',ht:'M vle evolye.'}},
{n:'Je veux une meilleure vie.',t:{en:'I want a better life.',es:'Quiero una mejor vida.',de:'Ich will ein besseres Leben.',ru:'Khochu luchshuyu zhizn.',zh:'Wǒ xiǎng yǒu gèng hǎo shēnghuó.',ja:'Yoi jinsei ga hoshii.',ht:'M vle yon lavi miyò.'}},
{n:'Je ne regrette rien.',t:{en:'I regret nothing.',es:'No me arrepiento.',de:'Ich bereue nichts.',ru:'Ya ni o chyom ne zhaleyu.',zh:'Wǒ bù hòuhuǐ.',ja:'Kōkai shinai.',ht:'M pa regrèt anyen.'}},

{n:'Chaque jour est une leçon.',t:{en:'Every day is a lesson.',es:'Cada día es una lección.',de:'Jeder Tag ist eine Lektion.',ru:'Kazhdyy den uro k.',zh:'Měi tiān shì yí kè.',ja:'Mainichi ga kyōkun.',ht:'Chak jou se yon leson.'}},
{n:'J’essaie de rester positif.',t:{en:'I try to stay positive.',es:'Intento ser positivo.',de:'Ich versuche positiv zu bleiben.',ru:'Starayus byt pozitivnym.',zh:'Wǒ shìtú bǎochí jījí.',ja:'Poshitibu ni iru.',ht:'M eseye rete pozitif.'}},
{n:'Je fais de mon mieux.',t:{en:'I do my best.',es:'Hago lo mejor que puedo.',de:'Ich gebe mein Bestes.',ru:'Delayu vse vozmozhnoye.',zh:'Wǒ jìn lì.',ja:'Ganbaru.',ht:'M fè tout sa m kapab.'}},
{n:'Je continue d’avancer.',t:{en:'I keep moving forward.',es:'Sigo adelante.',de:'Ich gehe weiter.',ru:'Ya dvigayus vperyod.',zh:'Wǒ jìxù qiánjìn.',ja:'Mae ni susumu.',ht:'M kontinye avanse.'}},
{n:'Mon histoire continue.',t:{en:'My story continues.',es:'Mi historia continúa.',de:'Meine Geschichte geht weiter.',ru:'Moya istoriya prodolzhayetsya.',zh:'Wǒ de gùshì jìxù.',ja:'Watashi no monogatari wa tsuzuku.',ht:'Istwa mwen kontinye.'}}

]
  },
  transport:{
    fr:'Transport & directions',en:'Transport & directions',es:'Transporte y direcciones',ht:'Transpò ak direksyon',de:'Transport & Wegbeschreibung',ru:'Транспорт и направления',zh:'交通与方向',ja:'交通と方向',icon:'🚗',
    items:[
      {n:'Comment aller à... ?',t:{en:'How do I get to...?',es:'¿Cómo llegar a...?',de:'Wie komme ich zu...?',ru:'Как добраться до...?',zh:'怎么去...？(Zěnme qù...?)',ja:'...への行き方は？',ht:'Kijan pou rive nan...?'},struct:{n:'Comment + aller + à + destination ?',t:{en:'How + to get + to + destination?'}}},
      {n:'Tournez à gauche / à droite.',t:{en:'Turn left / right.',es:'Gire a la izquierda / derecha.',de:'Biegen Sie links / rechts ab.',ru:'Поверните налево / направо.',zh:'左转 / 右转。(Zuǒ zhuǎn / yòu zhuǎn.)',ja:'左 / 右に曲がってください。',ht:'Vire agòch / adwat.'},struct:{n:'Impératif + direction',t:{en:'Imperative + direction'}}},
      {n:'C\'est loin d\'ici ?',t:{en:'Is it far from here?',es:'¿Está lejos de aquí?',de:'Ist es weit von hier?',ru:'Это далеко отсюда?',zh:'离这里远吗？(Lí zhèlǐ yuǎn ma?)',ja:'ここから遠いですか？',ht:'Èske li lwen isit la?'},struct:{n:'c\'est + adjectif + de + lieu ?',t:{en:'is it + adjective + from + place?'}}},
      {n:'Je prends le bus / le métro.',t:{en:'I take the bus / the metro.',es:'Tomo el autobús / el metro.',de:'Ich nehme den Bus / die U-Bahn.',ru:'Я еду на автобусе / метро.',zh:'我坐公交车 / 地铁。(Wǒ zuò gōngjiāo chē / dìtiě.)',ja:'バス / 地下鉄に乗ります。',ht:'Mwen pran otobis / métro.'},struct:{n:'prendre + transport',t:{en:'take + transport'}}},
    ]
  },
  famille:{
    fr:'Famille & relations',en:'Family & relationships',es:'Familia y relaciones',ht:'Fanmi ak relasyon',de:'Familie & Beziehungen',ru:'Семья и отношения',zh:'家庭与关系',ja:'家族と関係',icon:'👨‍👩‍👧',
    items:[
      {n:'J\'ai deux frères et une sœur.',t:{en:'I have two brothers and one sister.',es:'Tengo dos hermanos y una hermana.',de:'Ich habe zwei Brüder und eine Schwester.',ru:'У меня два брата и сестра.',zh:'我有两个哥哥和一个妹妹。',ja:'兄が2人と妹が1人います。',ht:'Mwen gen de frè ak yon sè.'},struct:{n:'avoir + nombre + famille',t:{en:'have + number + family member'}}},
      {n:'Mes parents habitent en ville.',t:{en:'My parents live in the city.',es:'Mis padres viven en la ciudad.',de:'Meine Eltern wohnen in der Stadt.',ru:'Мои родители живут в городе.',zh:'我父母住在城里。',ja:'両親は町に住んでいます。',ht:'Paran m yo rete nan vil la.'},struct:{n:'possessif + sujet + habiter + lieu',t:{en:'possessive + subject + live + place'}}},
      {n:'Nous nous entendons bien.',t:{en:'We get along well.',es:'Nos llevamos bien.',de:'Wir verstehen uns gut.',ru:'Мы хорошо ладим.',zh:'我们相处很好。(Wǒmen xiāngchǔ hěn hǎo.)',ja:'私たちは仲がいいです。',ht:'Nou antann nou byen.'},struct:{n:'pronom réfléchi + verbe pronominal + adverbe',t:{en:'we + get along + well'}}},
    ]
  },
  sante:{
    fr:'Santé & corps',en:'Health & body',es:'Salud y cuerpo',ht:'Sante ak kò',de:'Gesundheit & Körper',ru:'Здоровье и тело',zh:'健康与身体',ja:'健康と体',icon:'🏥',
    items:[
      {n:'J\'ai mal à la tête.',t:{en:'I have a headache.',es:'Me duele la cabeza.',de:'Ich habe Kopfschmerzen.',ru:'У меня болит голова.',zh:'我头痛。(Wǒ tóutòng.)',ja:'頭が痛いです。(Atama ga itai desu.)',ht:'Tèt mwen fè mal.'},struct:{n:'avoir mal + à + partie du corps',t:{en:'have + body part + ache'}}},
      {n:'Il faut appeler le médecin.',t:{en:'We need to call the doctor.',es:'Hay que llamar al médico.',de:'Wir müssen den Arzt anrufen.',ru:'Нужно вызвать врача.',zh:'需要打电话给医生。',ja:'医者に電話しなければなりません。',ht:'Fò rele doktè a.'},struct:{n:'il faut + infinitif',t:{en:'we need to + infinitive'}}},
      {n:'Prenez ce médicament deux fois par jour.',t:{en:'Take this medicine twice a day.',es:'Tome este medicamento dos veces al día.',de:'Nehmen Sie dieses Medikament zweimal täglich.',ru:'Принимайте это лекарство дважды в день.',zh:'每天服用这种药两次。',ja:'この薬を1日2回服用してください。',ht:'Pran medikaman sa de fwa pa jou.'},struct:{n:'Impératif + fréquence',t:{en:'Take + noun + frequency'}}},
    ]
  },
};
  // =================================================================
// GRAMMAR DATA
// =================================================================
const GRAMMAR_DATA = {
  present:{
    fr:'Présent',en:'Present tense',es:'Presente',ht:'Prezan',de:'Präsens',ru:'Настоящее время',zh:'现在时',ja:'現在形',icon:'⏱️',
    explanation:{
      fr:'Le présent décrit ce qui se passe <strong>maintenant</strong> ou ce qui est <em>habituel/régulier</em>. Il s\'utilise aussi pour les vérités générales.',
      en:'The present tense describes what is happening <strong>now</strong> or what is <em>habitual/regular</em>. Also used for general truths.',
      es:'El presente describe lo que sucede <strong>ahora</strong> o lo que es <em>habitual/regular</em>.',
      ht:'Prezan an dekri sa k ap pase <strong>kounye a</strong> oswa sa ki <em>abitye pase</em>.',
      de:'Das Präsens beschreibt was <strong>jetzt</strong> passiert oder was <em>gewöhnlich/regelmäßig</em> passiert.',
      ru:'Настоящее время описывает то, что происходит <strong>сейчас</strong> или является <em>привычным</em>.',
      zh:'现在时描述<strong>现在</strong>发生的事情或<em>习惯性/经常性</em>的行为。',
      ja:'現在形は<strong>今</strong>起きていることや<em>習慣的/定期的な</em>ことを表します。',
    },
    formula:{fr:'Sujet + Verbe (conjugué)',en:'Subject + Verb (conjugated)',es:'Sujeto + Verbo (conjugado)',ht:'Sijè + Vèb (konjige)',de:'Subjekt + Verb (konjugiert)',ru:'Подлежащее + Глагол',zh:'主语 + 动词',ja:'主語 + 動詞'},
    examples:[
      {n:'Je mange une pomme chaque matin.',t:{en:'I eat an apple every morning.',es:'Como una manzana cada mañana.',de:'Ich esse jeden Morgen einen Apfel.',ru:'Я ем яблоко каждое утро.',zh:'我每天早上吃一个苹果。',ja:'毎朝りんごを食べます。',ht:'Mwen manje yon pòm chak maten.'}},
      {n:'Il travaille dans un bureau.',t:{en:'He works in an office.',es:'Él trabaja en una oficina.',de:'Er arbeitet in einem Büro.',ru:'Он работает в офисе.',zh:'他在办公室工作。',ja:'彼はオフィスで働いています。',ht:'Li travay nan yon biwo.'}},
      {n:'Nous parlons français.',t:{en:'We speak French.',es:'Hablamos francés.',de:'Wir sprechen Französisch.',ru:'Мы говорим по-французски.',zh:'我们说法语。',ja:'私たちはフランス語を話します。',ht:'Nou pale fransè.'}},
      {n:'Est-ce que tu aimes le café ?',t:{en:'Do you like coffee?',es:'¿Te gusta el café?',de:'Magst du Kaffee?',ru:'Ты любишь кофе?',zh:'你喜欢咖啡吗？',ja:'コーヒーが好きですか？',ht:'Èske ou renmen kafe?'}},
      {n:'Elle ne mange pas de viande.',t:{en:'She doesn\'t eat meat.',es:'Ella no come carne.',de:'Sie isst kein Fleisch.',ru:'Она не ест мясо.',zh:'她不吃肉。',ja:'彼女は肉を食べません。',ht:'Li pa manje vyann.'}},
      {n:'Vous avez des enfants ?',t:{en:'Do you have children?',es:'¿Tienen hijos?',de:'Haben Sie Kinder?',ru:'У вас есть дети?',zh:'你有孩子吗？',ja:'お子さんはいますか？',ht:'Èske ou gen pitit?'}},
    ]
  },
  passe_compose:{
    fr:'Passé composé',en:'Past tense (Passé composé)',es:'Pretérito perfecto',ht:'Tan pase konpoze',de:'Perfekt (Passé composé)',ru:'Сложное прошедшее',zh:'复合过去时',ja:'複合過去',icon:'⏮️',
    explanation:{
      fr:'Le passé composé décrit des actions <strong>terminées dans le passé</strong>. Il se forme avec <em>avoir</em> ou <em>être</em> + participe passé.',
      en:'The passé composé describes actions <strong>completed in the past</strong>. It is formed with <em>avoir/être</em> + past participle.',
      es:'El pretérito perfecto describe acciones <strong>completadas en el pasado</strong>. Se forma con <em>avoir/être</em> + participio.',
      ht:'Tan pase konpoze a dekri aksyon <strong>ki te fini nan tan pase</strong>. Li fòme ak <em>avoir/être</em> + patisip pase.',
      de:'Das Perfekt beschreibt <strong>abgeschlossene Handlungen in der Vergangenheit</strong>. Gebildet mit <em>avoir/être</em> + Partizip.',
      ru:'Обозначает <strong>завершённые действия в прошлом</strong>. Образуется: <em>avoir/être</em> + причастие прошедшего времени.',
      zh:'描述<strong>过去完成的动作</strong>。由<em>avoir/être</em> + 过去分词构成。',
      ja:'<strong>過去に完了した行為</strong>を表します。<em>avoir/être</em> + 過去分詞で作ります。',
    },
    formula:{fr:'avoir/être + Participe passé',en:'avoir/être + Past participle',es:'avoir/être + Participio pasado',ht:'avoir/être + Patisip pase',de:'haben/sein + Partizip II',ru:'avoir/être + причастие',zh:'avoir/être + 过去分词',ja:'avoir/être + 過去分詞'},
    examples:[
      {n:'J\'ai mangé au restaurant hier.',t:{en:'I ate at the restaurant yesterday.',es:'Comí en el restaurante ayer.',de:'Ich habe gestern im Restaurant gegessen.',ru:'Вчера я поел в ресторане.',zh:'昨天我在餐厅吃饭了。',ja:'昨日レストランで食べました。',ht:'Yè mwen manje nan restoran.'}},
      {n:'Elle est partie à 8 heures.',t:{en:'She left at 8 o\'clock.',es:'Ella salió a las 8.',de:'Sie ist um 8 Uhr abgefahren.',ru:'Она ушла в 8 часов.',zh:'她8点离开了。',ja:'彼女は8時に出発しました。',ht:'Li pati a 8è.'}},
      {n:'Nous avons fini le projet.',t:{en:'We finished the project.',es:'Terminamos el proyecto.',de:'Wir haben das Projekt beendet.',ru:'Мы закончили проект.',zh:'我们完成了项目。',ja:'プロジェクトを終わらせました。',ht:'Nou fini pwojè a.'}},
      {n:'As-tu vu ce film ?',t:{en:'Did you see that film?',es:'¿Viste esa película?',de:'Hast du diesen Film gesehen?',ru:'Ты видел этот фильм?',zh:'你看过那部电影吗？',ja:'その映画を見ましたか？',ht:'Èske ou te wè fim sa a?'}},
      {n:'Il n\'a pas répondu.',t:{en:'He didn\'t answer.',es:'Él no respondió.',de:'Er hat nicht geantwortet.',ru:'Он не ответил.',zh:'他没有回答。',ja:'彼は答えませんでした。',ht:'Li pa reponn.'}},
    ]
  },
  futur:{
    fr:'Futur',en:'Future tense',es:'Futuro',ht:'Tan kap vini',de:'Futur',ru:'Будущее время',zh:'将来时',ja:'未来形',icon:'⏭️',
    explanation:{
      fr:'Le futur décrit des actions <strong>qui vont se passer</strong>. Le futur proche se forme avec <em>aller + infinitif</em>.',
      en:'The future describes actions <strong>that will happen</strong>. The near future is formed with <em>aller + infinitive</em>.',
      es:'El futuro describe acciones <strong>que van a suceder</strong>. El futuro cercano se forma con <em>ir + infinitivo</em>.',
      ht:'Tan kap vini an dekri aksyon <strong>ki pral pase</strong>. Futur pwòch fòme ak <em>aller + infinitif</em>.',
      de:'Das Futur beschreibt Handlungen, <strong>die stattfinden werden</strong>. Nahe Zukunft: <em>aller + Infinitiv</em>.',
      ru:'Обозначает действия, <strong>которые произойдут</strong>. Ближайшее будущее: <em>aller + инфинитив</em>.',
      zh:'描述<strong>将要发生</strong>的行为。近将来时：<em>aller + 不定式</em>。',
      ja:'<strong>これから起こる</strong>行為を表します。近い将来：<em>aller + 不定詞</em>。',
    },
    formula:{fr:'aller + Infinitif / Verbe + -rai/-ras/-ra',en:'going to + Infinitive / Verb + will',es:'ir a + Infinitivo / Verbo + futuro',ht:'pral + Infinitif',de:'werden + Infinitiv',ru:'буду + инфинитив',zh:'将 / 要 + 动词',ja:'〜するつもり / 〜でしょう'},
    examples:[
      {n:'Je vais manger dans une heure.',t:{en:'I\'m going to eat in an hour.',es:'Voy a comer en una hora.',de:'Ich werde in einer Stunde essen.',ru:'Я собираюсь поесть через час.',zh:'我一个小时后要吃东西。',ja:'1時間後に食べるつもりです。',ht:'Mwen pral manje nan yon èdtan.'}},
      {n:'Il fera beau demain.',t:{en:'It will be nice tomorrow.',es:'Mañana hará buen tiempo.',de:'Morgen wird das Wetter schön sein.',ru:'Завтра будет хорошая погода.',zh:'明天天气会很好。',ja:'明日は良い天気でしょう。',ht:'Tan an ap bèl demen.'}},
      {n:'Nous allons partir en vacances.',t:{en:'We\'re going to go on vacation.',es:'Vamos a irnos de vacaciones.',de:'Wir werden in den Urlaub fahren.',ru:'Мы собираемся поехать в отпуск.',zh:'我们要去度假。',ja:'休暇に行くつもりです。',ht:'Nou pral pati nan vakans.'}},
      {n:'Est-ce que tu vas venir ?',t:{en:'Are you going to come?',es:'¿Vas a venir?',de:'Wirst du kommen?',ru:'Ты придёшь?',zh:'你要来吗？',ja:'来るつもりですか？',ht:'Èske ou pral vini?'}},
      {n:'Elle ne va pas sortir ce soir.',t:{en:'She\'s not going to go out tonight.',es:'Ella no va a salir esta noche.',de:'Sie wird heute Abend nicht ausgehen.',ru:'Она не выйдет сегодня вечером.',zh:'她今晚不会出去。',ja:'彼女は今夜外出しないつもりです。',ht:'Li pa pral soti aswe a.'}},
    ]
  },
  questions:{
    fr:'Questions',en:'Questions',es:'Preguntas',ht:'Kesyon',de:'Fragen',ru:'Вопросы',zh:'疑问句',ja:'疑問文',icon:'❓',
    explanation:{
      fr:'Il y a 3 façons de former une question : <strong>intonation montante</strong>, <em>Est-ce que</em> + phrase, ou <em>inversion</em> sujet-verbe.',
      en:'There are 3 ways to form a question: <strong>rising intonation</strong>, <em>Est-ce que</em> + sentence, or subject-verb <em>inversion</em>.',
      es:'Hay 3 formas de hacer preguntas: <strong>entonación ascendente</strong>, <em>Est-ce que</em> + frase, o <em>inversión</em> sujeto-verbo.',
      ht:'Gen 3 fason pou fòme kesyon: <strong>entonasyon monte</strong>, <em>Est-ce que</em> + fraz, oswa <em>envèsyon</em>.',
      de:'Es gibt 3 Arten, Fragen zu bilden: <strong>steigende Intonation</strong>, <em>Est-ce que</em> + Satz, oder <em>Inversion</em>.',
      ru:'3 способа задать вопрос: <strong>восходящая интонация</strong>, <em>Est-ce que</em> + предложение, или <em>инверсия</em>.',
      zh:'有3种提问方式：<strong>升调</strong>、<em>Est-ce que</em> + 句子，或<em>倒装</em>主谓。',
      ja:'疑問文の3つの作り方：<strong>上昇イントネーション</strong>、<em>Est-ce que</em> + 文、または主語動詞の<em>倒置</em>。',
    },
    formula:{fr:'Est-ce que + sujet + verbe ? / Mot interrogatif + verbe ?',en:'Do/Does + subject + verb? / Wh- word + verb?',es:'¿ ... ? / Palabra interrogativa + verbo?',ht:'Èske + sijè + vèb ? / Mo kesyon + vèb ?',de:'Verb + Subjekt? / W-Wort + Verb?',ru:'Вопросительное слово + глагол? / Verb + подлежащее?',zh:'疑问词 + 主语 + 动词？/ 主语 + 动词 + 吗？',ja:'疑問詞 + 主語 + 動詞 + か？'},
    examples:[
      {n:'Est-ce que tu parles anglais ?',t:{en:'Do you speak English?',es:'¿Hablas inglés?',de:'Sprichst du Englisch?',ru:'Ты говоришь по-английски?',zh:'你说英语吗？',ja:'英語を話しますか？',ht:'Èske ou pale anglè?'}},
      {n:'Où habites-tu ?',t:{en:'Where do you live?',es:'¿Dónde vives?',de:'Wo wohnst du?',ru:'Где ты живёшь?',zh:'你住在哪里？',ja:'どこに住んでいますか？',ht:'Ki kote ou rete?'}},
      {n:'Pourquoi est-ce que tu pleures ?',t:{en:'Why are you crying?',es:'¿Por qué lloras?',de:'Warum weinst du?',ru:'Почему ты плачешь?',zh:'你为什么哭？',ja:'なぜ泣いているのですか？',ht:'Poukisa ou ap kriye?'}},
      {n:'Quand arrive-t-il ?',t:{en:'When does he arrive?',es:'¿Cuándo llega?',de:'Wann kommt er an?',ru:'Когда он приезжает?',zh:'他什么时候到达？',ja:'彼はいつ到着しますか？',ht:'Kilè li ap rive?'}},
      {n:'Comment est-ce que tu t\'appelles ?',t:{en:'What is your name?',es:'¿Cómo te llamas?',de:'Wie heißt du?',ru:'Как тебя зовут?',zh:'你叫什么名字？',ja:'お名前は何ですか？',ht:'Kijan ou rele?'}},
      {n:'Combien de langues parles-tu ?',t:{en:'How many languages do you speak?',es:'¿Cuántos idiomas hablas?',de:'Wie viele Sprachen sprichst du?',ru:'На скольких языках ты говоришь?',zh:'你会说几种语言？',ja:'何ヵ国語話せますか？',ht:'Konbyen lang ou pale?'}},
    ]
  },
  negation:{
    fr:'Négation',en:'Negation',es:'Negación',ht:'Negasyon',de:'Verneinung',ru:'Отрицание',zh:'否定句',ja:'否定文',icon:'🚫',
    explanation:{
      fr:'La négation en français se forme avec <strong>ne... pas</strong> autour du verbe. À l\'oral, le <em>ne</em> est souvent omis.',
      en:'In French, negation is formed with <strong>ne... pas</strong> around the verb. In spoken French, <em>ne</em> is often dropped.',
      es:'La negación en francés se forma con <strong>ne... pas</strong> alrededor del verbo.',
      ht:'Negasyon nan fransè fòme ak <strong>ne... pas</strong> ozalantou vèb la.',
      de:'Die Verneinung im Französischen wird mit <strong>ne... pas</strong> um das Verb gebildet.',
      ru:'Отрицание во французском языке образуется с помощью <strong>ne... pas</strong> вокруг глагола.',
      zh:'法语否定句用<strong>ne... pas</strong>围绕动词构成。',
      ja:'フランス語の否定は動詞の周りに<strong>ne... pas</strong>を置いて作ります。',
    },
    formula:{fr:'ne + Verbe + pas',en:'ne + Verb + pas (French) / do not + Verb (English)',es:'no + Verbo',ht:'pa + Vèb',de:'nicht / kein',ru:'не + Глагол',zh:'不 / 没有 + 动词',ja:'〜ません / 〜ないです'},
    examples:[
      {n:'Je ne parle pas japonais.',t:{en:'I don\'t speak Japanese.',es:'No hablo japonés.',de:'Ich spreche kein Japanisch.',ru:'Я не говорю по-японски.',zh:'我不说日语。',ja:'日本語を話しません。',ht:'Mwen pa pale japonè.'}},
      {n:'Il n\'est pas là.',t:{en:'He is not here.',es:'Él no está aquí.',de:'Er ist nicht da.',ru:'Его здесь нет.',zh:'他不在这里。',ja:'彼はここにいません。',ht:'Li pa la.'}},
      {n:'Nous n\'avons pas faim.',t:{en:'We are not hungry.',es:'No tenemos hambre.',de:'Wir haben keinen Hunger.',ru:'Мы не голодны.',zh:'我们不饿。',ja:'お腹が空いていません。',ht:'Nou pa grangou.'}},
      {n:'Elle ne veut rien manger.',t:{en:'She doesn\'t want to eat anything.',es:'Ella no quiere comer nada.',de:'Sie will nichts essen.',ru:'Она не хочет ничего есть.',zh:'她什么都不想吃。',ja:'彼女は何も食べたくありません。',ht:'Li pa vle manje anyen.'}},
      {n:'Je n\'ai jamais vu ça.',t:{en:'I have never seen that.',es:'Nunca he visto eso.',de:'Das habe ich noch nie gesehen.',ru:'Я никогда этого не видел.',zh:'我从来没见过那个。',ja:'そんなの見たことありません。',ht:'Mwen pa janm wè sa.'}},
      {n:'Ce n\'est pas grave.',t:{en:'It\'s not a big deal.',es:'No es grave.',de:'Das ist nicht schlimm.',ru:'Это не страшно.',zh:'没关系。',ja:'大したことではありません。',ht:'Sa pa grave.'}},
    ]
  },
  imparfait:{
    fr:'Imparfait / Passé simple',en:'Imperfect / Simple past',es:'Imperfecto / Pretérito',ht:'Imparfè / Tan pase senp',de:'Imperfekt',ru:'Прошедшее несовершенное',zh:'未完成过去时',ja:'半過去',icon:'📖',
    explanation:{
      fr:'L\'imparfait décrit des <strong>habitudes passées</strong> ou des situations <em>continues/descriptives</em> dans le passé. Il s\'oppose au passé composé qui décrit une action ponctuelle.',
      en:'The imperfect describes <strong>past habits</strong> or <em>continuous/descriptive</em> situations in the past. It contrasts with the passé composé which describes a one-time action.',
      es:'El imperfecto describe <strong>hábitos pasados</strong> o situaciones <em>continuas/descriptivas</em> en el pasado.',
      ht:'Imparfè a dekri <strong>abitid nan tan pase</strong> oswa sitiyasyon <em>kontinyèl/deskriptif</em>.',
      de:'Das Imperfekt beschreibt <strong>vergangene Gewohnheiten</strong> oder <em>kontinuierliche/beschreibende</em> Situationen.',
      ru:'Несовершенное прошедшее описывает <strong>прошлые привычки</strong> или <em>длительные/описательные</em> ситуации.',
      zh:'未完成过去时描述<strong>过去的习惯</strong>或<em>持续/描述性</em>的过去情况。',
      ja:'半過去は<strong>過去の習慣</strong>や<em>継続的/描写的</em>な過去の状況を表します。',
    },
    formula:{fr:'Radical de nous au présent + -ais/-ais/-ait/-ions/-iez/-aient',en:'Was/were + -ing / Used to + verb',es:'Terminaciones -aba/-ía',ht:'Vèb + te',de:'Verb + -te/-ten',ru:'Глагол + -л/-ла/-ли',zh:'(过去) + 动词',ja:'〜ていました / 〜でした'},
    examples:[
      {n:'Quand j\'étais enfant, je jouais au foot.',t:{en:'When I was a child, I used to play football.',es:'Cuando era niño, jugaba al fútbol.',de:'Als ich Kind war, spielte ich Fußball.',ru:'Когда я был ребёнком, я играл в футбол.',zh:'当我是孩子时，我打足球。',ja:'子供の頃、サッカーをしていました。',ht:'Lè mwen te timoun, mwen te jwe foutbòl.'}},
      {n:'Il pleuvait quand nous sommes sortis.',t:{en:'It was raining when we went out.',es:'Llovía cuando salimos.',de:'Es regnete, als wir weggingen.',ru:'Когда мы вышли, шёл дождь.',zh:'当我们出去时，正在下雨。',ja:'私たちが出かけた時、雨が降っていました。',ht:'Lapli t ap tonbe lè nou soti.'}},
      {n:'Elle travaillait tous les jours.',t:{en:'She worked every day.',es:'Ella trabajaba todos los días.',de:'Sie arbeitete jeden Tag.',ru:'Она работала каждый день.',zh:'她每天都工作。',ja:'彼女は毎日働いていました。',ht:'Li t ap travay chak jou.'}},
    ]
  },
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
  {id:'church',emoji:'⛪',color:'#6a50a8',x:0.05,y:0.25,w:0.14,h:0.18,npcs:[
    {id:'pastor',emoji:'🧑‍⚖️',name:'Morgan',role:{fr:'Pasteur·e',en:'Pastor',ht:'Pastè',es:'Pastor/a',de:'Pastor/in',ru:'Пастор',zh:'牧师',ja:'牧師'},ctx:'Tu es Morgan, pasteur bienveillant. Tu parles avec respect et solennité. Tu enseignes la politesse formelle.'},
    {id:'choir',emoji:'🎵',name:'River',role:{fr:'Choriste',en:'Choir',ht:'Chantè',es:'Corista',de:'Chor',ru:'Хорист',zh:'合唱',ja:'聖歌隊'},ctx:'Tu es River, choriste. Tu enseignes la prononciation par la musique.'}]},
  {id:'school',emoji:'🏫',color:'#3a7aaa',x:0.30,y:0.15,w:0.14,h:0.18,npcs:[
    {id:'teacher',emoji:'🧑‍🏫',name:'Robin',role:{fr:'Professeur·e',en:'Teacher',ht:'Pwofesè',es:'Profesor/a',de:'Lehrer/in',ru:'Учитель',zh:'老师',ja:'先生'},ctx:'Tu es Robin, professeur patient. Tu corriges doucement et expliques simplement.'},
    {id:'student',emoji:'🧒',name:'Charlie',role:{fr:'Élève',en:'Student',ht:'Elèv',es:'Estudiante',de:'Schüler/in',ru:'Ученик',zh:'学生',ja:'生徒'},ctx:'Tu es Charlie, élève curieux. Tu apprends avec le joueur.'}]},
  {id:'market',emoji:'🛒',color:'#2a8a50',x:0.52,y:0.52,w:0.14,h:0.16,npcs:[
    {id:'vendor',emoji:'🧑‍🍳',name:'Sage',role:{fr:'Vendeur·se',en:'Vendor',ht:'Machann',es:'Vendedor/a',de:'Verkäufer/in',ru:'Продавец',zh:'商贩',ja:'売り手'},ctx:'Tu es Sage, vendeur souriant. Tu parles de prix et quantités.'},
    {id:'cashier',emoji:'💰',name:'Quinn',role:{fr:'Caissier·ère',en:'Cashier',ht:'Kesye',es:'Cajero/a',de:'Kassierer/in',ru:'Кассир',zh:'收银员',ja:'レジ係'},ctx:'Tu es Quinn, caissier méthodique. Tu comptes à voix haute.'}]},
  {id:'hospital',emoji:'🏥',color:'#aa3a3a',x:0.82,y:0.50,w:0.12,h:0.16,npcs:[
    {id:'doctor',emoji:'🧑‍⚕️',name:'Drew',role:{fr:'Médecin',en:'Doctor',ht:'Doktè',es:'Médico/a',de:'Arzt/in',ru:'Врач',zh:'医生',ja:'医師'},ctx:'Tu es Drew, médecin calme. Tu parles du corps humain.'},
    {id:'nurse',emoji:'💊',name:'Avery',role:{fr:'Infirmier·ère',en:'Nurse',ht:'Enfimyè',es:'Enfermero/a',de:'Pfleger/in',ru:'Медсестра',zh:'护士',ja:'看護師'},ctx:'Tu es Avery, infirmier attentionné.'}]},
  {id:'tavern',emoji:'🍺',color:'#8a4a10',x:0.06,y:0.56,w:0.13,h:0.16,npcs:[
    {id:'bartender',emoji:'🧑‍🍽️',name:'Lane',role:{fr:'Barman·aid',en:'Bartender',ht:'Bòkay',es:'Bartender',de:'Barkeeper/in',ru:'Бармен',zh:'酒保',ja:'バーテンダー'},ctx:'Tu es Lane, barman jovial. Tu utilises des expressions populaires.'},
    {id:'regular',emoji:'🎲',name:'Sky',role:{fr:'Client·e',en:'Regular',ht:'Kliyan',es:'Cliente',de:'Stammgast',ru:'Завсегдатай',zh:'常客',ja:'常連'},ctx:'Tu es Sky, habitué décontracté. Tu parles de ta journée.'}]},
  {id:'friends',emoji:'🏠',color:'#3a6aaa',x:0.26,y:0.58,w:0.13,h:0.15,npcs:[
    {id:'friend',emoji:'🤝',name:'Alex',role:{fr:'Ami·e',en:'Friend',ht:'Zanmi',es:'Amigo/a',de:'Freund/in',ru:'Друг',zh:'朋友',ja:'友達'},ctx:'Tu es Alex, le meilleur ami. Tu parles avec affection.'},
    {id:'neighbor',emoji:'😊',name:'Jamie',role:{fr:'Voisin·e',en:'Neighbor',ht:'Vwazen',es:'Vecino/a',de:'Nachbar/in',ru:'Сосед',zh:'邻居',ja:'隣人'},ctx:'Tu es Jamie, voisin agréable.'}]},
  {id:'park',emoji:'🌳',color:'#6a9a30',x:0.60,y:0.18,w:0.12,h:0.14,npcs:[
    {id:'partner',emoji:'💝',name:'Sam',role:{fr:'Partenaire',en:'Partner',ht:'Patnè',es:'Pareja',de:'Partner/in',ru:'Партнёр',zh:'伴侣',ja:'パートナー'},ctx:'Tu es Sam, partenaire romantique. Tu parles avec douceur et respect.'}]},
  {id:'police',emoji:'👮',color:'#2a4a8a',x:0.18,y:0.42,w:0.12,h:0.14,npcs:[
    {id:'officer',emoji:'🧑‍✈️',name:'Remy',role:{fr:'Agent·e',en:'Officer',ht:'Ofisye',es:'Agente',de:'Beamter/in',ru:'Офицер',zh:'警察',ja:'警察官'},ctx:'Tu es Remy, agent professionnel. Tu donnes des directions.'}]},
  {id:'bank',emoji:'🏦',color:'#5a7a30',x:0.67,y:0.36,w:0.12,h:0.14,npcs:[
    {id:'banker',emoji:'💼',name:'Reese',role:{fr:'Banquier·ère',en:'Banker',ht:'Bankye',es:'Banquero/a',de:'Banker/in',ru:'Банкир',zh:'银行家',ja:'銀行員'},ctx:'Tu es Reese, banquier formel.'}]},
  {id:'station',emoji:'🚉',color:'#4a4a8a',x:0.40,y:0.68,w:0.15,h:0.13,npcs:[
    {id:'stationmaster',emoji:'🚂',name:'Pax',role:{fr:'Chef de gare',en:'Stationmaster',ht:'Chèf estasyon',es:'Jefe de estación',de:'Bahnhofsvorsteher/in',ru:'Начальник вокзала',zh:'站长',ja:'駅長'},ctx:'Tu es Pax, chef de gare précis.'},
    {id:'traveler',emoji:'🧳',name:'Wren',role:{fr:'Voyageur·se',en:'Traveler',ht:'Vwayajè',es:'Viajero/a',de:'Reisende/r',ru:'Путешественник',zh:'旅行者',ja:'旅行者'},ctx:'Tu es Wren, voyageur curieux.'}]},
  {id:'farm',emoji:'🌾',color:'#7a6a20',x:0.84,y:0.30,w:0.12,h:0.15,npcs:[
    {id:'farmer',emoji:'🧑‍🌾',name:'Dale',role:{fr:'Fermier·ère',en:'Farmer',ht:'Kiltivatè',es:'Granjero/a',de:'Bauer/in',ru:'Фермер',zh:'农民',ja:'農家'},ctx:'Tu es Dale, fermier proche de la nature.'}]},
  {id:'factory',emoji:'🏭',color:'#8a6a30',x:0.72,y:0.18,w:0.14,h:0.18,npcs:[
    {id:'foreman',emoji:'👷',name:'Casey',role:{fr:'Contremaître·sse',en:'Foreman',ht:'Chèf travay',es:'Capataz',de:'Vorarbeiter/in',ru:'Прораб',zh:'工头',ja:'現場監督'},ctx:'Tu es Casey, contremaître direct.'},
    {id:'craftsperson',emoji:'🔨',name:'Blake',role:{fr:'Artisan·e',en:'Craftsperson',ht:'Atizan',es:'Artesano/a',de:'Handwerker/in',ru:'Мастер',zh:'工匠',ja:'職人'},ctx:'Tu es Blake, artisan fier.'}]},
  {id:'cinema',emoji:'🎬',color:'#8a2080',x:0.42,y:0.28,w:0.13,h:0.15,npcs:[
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

// =================================================================
// INIT STARS
// =================================================================
(()=>{const c=document.getElementById('wStars');for(let i=0;i<100;i++){const s=document.createElement('div');s.className='w-star';const z=Math.random()*2+0.5;s.style.cssText=`width:${z}px;height:${z}px;left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*5}s;animation-duration:${2+Math.random()*4}s`;c.appendChild(s);}})();

// =================================================================
// WELCOME FLOW
// =================================================================
// 1. Sélection de la langue maternelle
document.querySelectorAll('[data-native]').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('[data-native]').forEach(x => x.classList.remove('sel'));
    t.classList.add('sel');
    
    S.nativeLang = t.dataset.native;
    applyUI(S.nativeLang);

    // Gestion des étapes
    document.getElementById('step2').style.display = 'block';
    // On cache les étapes suivantes pour forcer le nouvel ordre
    ['step3', 'step4', 'playBtn'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = 'none';
        if (el.tagName === 'BUTTON') el.disabled = true;
      }
    });

    // Désactive la langue cible si elle est identique à la langue maternelle
    document.querySelectorAll('[data-lang]').forEach(o => {
      o.classList.toggle('disabled', o.dataset.lang === S.nativeLang);
      if (o.dataset.lang === S.nativeLang) o.classList.remove('sel');
    });
  });
});

// 2. Saisie du nom
document.getElementById('inputName').addEventListener('input', function() {
  const hasValue = this.value.trim().length > 0;
  document.getElementById('step3').style.display = hasValue ? 'block' : 'none';
  
  // Si on change le nom, on réinitialise la suite pour valider la sélection de langue
  document.getElementById('step4').style.display = 'none';
  document.getElementById('playBtn').style.display = 'none';
});

// 3. Sélection de la langue cible
document.querySelectorAll('[data-lang]').forEach(o => {
  o.addEventListener('click', () => {
    if (o.classList.contains('disabled')) return;
    
    document.querySelectorAll('[data-lang]').forEach(x => x.classList.remove('sel'));
    o.classList.add('sel');
    S.targetLang = o.dataset.lang;

    const cjk = ['zh', 'ja', 'ru'].includes(S.targetLang);
    const playBtn = document.getElementById('playBtn');

    if (cjk) {
      document.getElementById('step4').style.display = 'block';
      const lb = {
        zh: { n: '你好', r: 'Nǐ hǎo' },
        ja: { n: 'こんにちは', r: 'Konnichiwa' },
        ru: { n: 'Привет', r: 'Privyet' }
      };
      document.getElementById('sc-n').textContent = lb[S.targetLang].n;
      document.getElementById('sc-r').textContent = lb[S.targetLang].r;
      
      playBtn.style.display = 'none';
      playBtn.disabled = true;
    } else {
      S.scriptPref = 'both';
      document.getElementById('step4').style.display = 'none';
      playBtn.style.display = 'block';
      playBtn.disabled = false;
    }
  });
});

// 4. Sélection du script (pour les langues CJK)
function selScript(p, btn) {
  document.querySelectorAll('.sc-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  S.scriptPref = p;
  
  const playBtn = document.getElementById('playBtn');
  playBtn.style.display = 'block';
  playBtn.disabled = false;
}

// 5. Lancement du jeu
document.getElementById('playBtn').addEventListener('click', () => {
  const name = document.getElementById('inputName').value.trim();
  S.playerName = name;
  
  if (!S.playerName || !S.nativeLang || !S.targetLang) {
    showNotif("⚠️ Complétez tous les champs !");
    return;
  }
  
  startMenu();
});


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
  const W=canvas.width,H=canvas.height,night=currentWeather==='night';
  const sky=ctx.createLinearGradient(0,0,0,H*0.6);
  if(night){sky.addColorStop(0,'#01020a');sky.addColorStop(1,'#080e1e');}
  else if(currentWeather==='rain'){sky.addColorStop(0,'#1a2535');sky.addColorStop(1,'#2a3848');}
  else{sky.addColorStop(0,'#0a1830');sky.addColorStop(1,'#1a4880');}
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  if(night){
    ctx.beginPath();ctx.arc(W*0.85,H*0.1,16,0,Math.PI*2);ctx.fillStyle='#f0e0a0';ctx.fill();
    for(let i=0;i<50;i++){const sx=(Math.sin(i*437)*0.5+0.5)*W,sy=(Math.sin(i*293)*0.5+0.5)*H*0.45;ctx.beginPath();ctx.arc(sx,sy,1,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,200,${0.4+0.6*Math.sin(tick*0.02+i)})`;ctx.fill();}
  }else{
    ctx.beginPath();ctx.arc(W*0.85,H*0.1,20,0,Math.PI*2);ctx.fillStyle=currentWeather==='rain'?'#7a8898':'#ffe0a0';ctx.fill();
    for(let i=0;i<3;i++){const cx=((tick*0.12*(i+1)*0.4+i*200)%(W+200))-100,cy=H*(0.07+i*0.04);drawCloud(cx,cy,35+i*12,currentWeather==='rain'?'rgba(70,80,100,0.65)':'rgba(255,255,255,0.55)');}
  }
  const g=ctx.createLinearGradient(0,H*0.5,0,H);
  if(currentWeather==='snow'){g.addColorStop(0,'#c8d0e0');g.addColorStop(1,'#a8b0c0');}else{g.addColorStop(0,'#1a4a18');g.addColorStop(1,'#0d2a0c');}
  ctx.fillStyle=g;ctx.fillRect(0,H*0.5,W,H);
  ctx.fillStyle='rgba(180,140,80,0.18)';ctx.beginPath();ctx.moveTo(W*0.45,H*0.5);ctx.lineTo(W*0.38,H);ctx.lineTo(W*0.62,H);ctx.lineTo(W*0.55,H*0.5);ctx.fill();
  LOCATIONS.forEach(loc=>{const bob=Math.sin(tick*0.025+loc.x*10)*1.5;drawLoc(loc,loc.x*W,(loc.y*H)+bob,loc.w*W,loc.h*H,hoveredLoc===loc.id);});
  if(currentWeather==='rain'){ctx.fillStyle='rgba(0,10,30,0.12)';ctx.fillRect(0,0,W,H);}
}
function drawCloud(x,y,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(x+r*0.7,y+r*0.15,r*0.7,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(x-r*0.6,y+r*0.2,r*0.6,0,Math.PI*2);ctx.fill();}
function drawLoc(loc,x,y,w,h,hov){
  const a=hov?1:0.88,night=currentWeather==='night';
  ctx.fillStyle='rgba(0,0,0,0.22)';ctx.fillRect(x+3,y+3,w,h);
  ctx.fillStyle=hexA(loc.color,a*(night?0.65:1));ctx.fillRect(x,y,w,h);
  ctx.beginPath();ctx.moveTo(x-4,y);ctx.lineTo(x+w/2,y-h*0.35);ctx.lineTo(x+w+4,y);
  ctx.fillStyle=hexA(darken(loc.color),a*(night?0.65:1));ctx.fill();
  ctx.fillStyle='rgba(20,10,3,0.8)';ctx.fillRect(x+w/2-w*0.12,y+h-h*0.3,w*0.24,h*0.3);
  if(night){ctx.fillStyle='rgba(255,215,100,0.55)';ctx.fillRect(x+w*0.14,y+h*0.14,w*0.28,h*0.22);ctx.fillRect(x+w*0.55,y+h*0.14,w*0.28,h*0.22);}
  if(hov){ctx.strokeStyle='rgba(255,215,0,0.75)';ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);}
  ctx.font=`${Math.min(w,h)*0.43}px serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(loc.emoji,x+w/2,y+h*0.35);
  const nm=LOC_NAMES[loc.id]?.[S.nativeLang]||loc.id;
  ctx.font=`bold ${Math.max(8,Math.min(w*0.12,11))}px Nunito,sans-serif`;
  ctx.fillStyle=hov?'#FFD700':'rgba(255,240,200,0.9)';
  ctx.fillText(nm,x+w/2,y+h+12);
}
function hexA(h,a){const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return`rgba(${r},${g},${b},${a})`;}
function darken(h){return`#${[1,3,5].map(i=>Math.max(0,parseInt(h.slice(i,i+2),16)-40).toString(16).padStart(2,'0')).join('')}`;}
function getLocAt(mx,my){const W=canvas.width,H=canvas.height;return LOCATIONS.find(l=>{const lx=l.x*W,ly=l.y*H,lw=l.w*W,lh=l.h*H;return mx>=lx&&mx<=lx+lw&&my>=ly-lh*0.35&&my<=ly+lh+18;});}
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
  checkMissionInMessage(text);
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

document.getElementById('dialInput').addEventListener('keydown',e=>{if(e.key==='Enter')sendMsg();});

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
document.addEventListener('click',e=>{const p=document.getElementById('wordPopup');if(p.classList.contains('show')&&!p.contains(e.target)&&!e.target.classList.contains('clickable-word'))closeWordPopup();});

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

// 5. Gestionnaire de recherche (à mettre EN DEHORS de loadVocab pour éviter les doublons)
const vSearch = document.getElementById('vocabSearch');
if (vSearch) {
  vSearch.oninput = () => {
    const activeBtn = document.querySelector('.vcat.active');
    if (activeBtn) {
      // On récupère la clé de la catégorie active via son texte ou un attribut
      const activeIdx = Array.from(document.querySelectorAll('.vcat')).indexOf(activeBtn);
      const catKey = Object.keys(VOCAB)[activeIdx];
      loadVocab(catKey);
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
  document.getElementById('dictInput').value = '';
  document.getElementById('dictResult').innerHTML = `
    <div class="dict-empty">
      <div class="dict-empty-icon">🔤</div>
      <div>Tapez un mot ou une phrase</div>
    </div>`;
  showScreen('screen-dict');
  setTimeout(() => document.getElementById('dictInput').focus(), 300);
}

function closeDictBack() {
  showScreen(dictFromScreen);
}

function setDictMode(m, btn) {
  dictMode = m;
  document.querySelectorAll('.dict-mode').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('dictInput').placeholder = m === 'word' ? 'Mot à traduire...' : 'Phrase entière à traduire...';
}

async function searchDict() {
  const q = document.getElementById('dictInput').value.trim();
  if (!q) return;

  // Gestion de l'historique
  if (!dictHistory.includes(q)) dictHistory.unshift(q);
  if (dictHistory.length > 20) dictHistory.pop();

  const res = document.getElementById('dictResult');
  res.innerHTML = `<div class="dict-empty">⟳ Traduction...</div>`;

  const nln = { fr: 'français', en: 'anglais', es: 'espagnol', ht: 'créole haïtien', de: 'allemand', ru: 'russe', zh: 'mandarin', ja: 'japonais' };
  const isCJK = ['zh', 'ja', 'ru'].includes(S.targetLang);
  const showRoman = isCJK && S.scriptPref !== 'native';

  const prompt = dictMode === 'phrase' ?
    `Traduis cette phrase du ${nln[S.nativeLang] || 'français'} vers le ${nln[S.targetLang] || 'anglais'}: "${q}". JSON: {"translation":"...","roman":"romanisation si applicable","grammar":"structure","example":"exemple simple"}` :
    `Traduis le mot "${q}" du ${nln[S.nativeLang] || 'français'} vers le ${nln[S.targetLang] || 'anglais'}. JSON: {"translation":"...","roman":"romanisation","grammar":"nom/verbe/adj...","example":"phrase exemple"}`;

  try {
    const r = await fetch(`${API}/api/dialogue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        npcName: '',
        npcRole: '',
        location: '',
        language: nln[S.nativeLang] || 'français',
        playerName: S.playerName || '',
        playerMessage: prompt,
        history: []
      })
    });

    const d = await r.json();
    let p;
    try {
      p = JSON.parse((d.reply || '{}').replace(/```json|```/g, '').trim());
    } catch {
      p = { translation: d.reply || q, roman: '', grammar: '', example: '' };
    }

    const hist = dictHistory.slice(1, 9);
    const escapedTranslation = (p.translation || '').replace(/'/g, "\\'");

    // Correction de l'affichage avec Template Literals
    res.innerHTML = `
      <div class="dict-card">
        <div style="font-size:0.68rem;color:var(--dim);margin-bottom:5px">"${q}"</div>
        <div class="dict-word">${p.translation || ''}</div>
        ${p.roman && showRoman ? `<div class="dict-roman">${p.roman}</div>` : ''}
        ${p.grammar ? `<div style="font-size:0.7rem;color:var(--purple);font-weight:800;margin:5px 0">${p.grammar}</div>` : ''}
        ${p.example ? `<div class="dict-example">💡 ${p.example}</div>` : ''}
        <button class="dict-listen-btn" onclick="speakW('${escapedTranslation}')">🔊 Écouter</button>
      </div>

      ${hist.length ? `
        <div style="font-size:0.65rem;color:var(--dim);letter-spacing:2px;text-transform:uppercase;margin:15px 0 8px 0">Historique</div>
        <div class="dict-chips">
          ${hist.map(h => `<span class="dict-chip" onclick="searchDictWord('${h.replace(/'/g, "\\'")}')">${h}</span>`).join('')}
        </div>
      ` : ''}`;

  } catch (e) {
    res.innerHTML = `<div class="dict-empty"><div class="dict-empty-icon">❌</div>Indisponible</div>`;
  }
}

function searchDictWord(w) {
  document.getElementById('dictInput').value = w;
  searchDict();
}

document.getElementById('dictInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') searchDict();
});

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
