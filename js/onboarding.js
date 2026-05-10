// LinguaVillage — onboarding.js
// Porte d'entrée zéro : niveau de l'utilisateur + parcours débutant absolu
// Indépendant — s'insère AVANT startMenu() via window.LV_ONBOARDING
// ================================================================

window.LV_ONBOARDING = (function() {

  var OB_LABELS = {
    level_title:    {fr:'Ton niveau en',en:'Your level in',es:'Tu nivel en',ht:'Nivo ou nan',de:'Dein Niveau in',ru:'Твой уровень в',zh:'你在以下语言的水平',ja:'あなたのレベル'},
    level_subtitle: {fr:'Sois honnête — l\'app adaptera tout pour toi',en:'Be honest — the app will adapt for you',es:'Sé honesto — la app se adaptará para ti',ht:'Soyez honnête — app la ap adapte pou ou',de:'Sei ehrlich — die App passt sich für dich an',ru:'Будь честен — приложение адаптируется',zh:'诚实作答，应用将为你调整',ja:'正直に答えてください'},
    sounds_title:   {fr:'Sons clés en',en:'Key sounds in',es:'Sonidos clave en',ht:'Son kle nan',de:'Schlüssellaute in',ru:'Ключевые звуки в',zh:'关键发音',ja:'重要な音'},
    sounds_sub:     {fr:'Ces sons n\'existent pas dans ta langue',en:'These sounds don\'t exist in your language',es:'Estos sonidos no existen en tu idioma',ht:'Son sa yo pa egziste nan lang ou',de:'Diese Laute gibt es nicht in deiner Sprache',ru:'Этих звуков нет в твоём языке',zh:'这些发音在你的语言中不存在',ja:'これらの音はあなたの言語にありません'},
    words_title:    {fr:'10 mots fondamentaux',en:'10 fundamental words',es:'10 palabras fundamentales',ht:'10 mo fondamantal',de:'10 grundlegende Wörter',ru:'10 основных слов',zh:'10个基础词汇',ja:'10個の基礎単語'},
    words_sub:      {fr:'Les majuscules = syllabe accentuée',en:'Uppercase = stressed syllable',es:'Mayúsculas = sílaba acentuada',ht:'Majiskil = silab aksan',de:'Großbuchstaben = betonte Silbe',ru:'Заглавные = ударный слог',zh:'大写=重音音节',ja:'大文字=強勢音節'},
    struct_title:   {fr:'Structure des phrases',en:'Sentence structure',es:'Estructura de oraciones',ht:'Estrikti fraz yo',de:'Satzstruktur',ru:'Структура предложений',zh:'句子结构',ja:'文の構造'},
    struct_tip:     {fr:'Tu n\'as pas besoin de tout comprendre maintenant. Le village t\'apprendra le reste naturellement.',en:'You don\'t need to understand everything now. The village will teach you naturally.',es:'No necesitas entender todo ahora. El pueblo te enseñará el resto.',ht:'Ou pa bezwen konprann tout kounye a. Vilaj la ap ensèye ou rès la.',de:'Du musst nicht alles sofort verstehen. Das Dorf wird dich den Rest lehren.',ru:'Не нужно всё понять сейчас. Деревня научит тебя остальному.',zh:'你现在不需要理解所有内容。村庄将自然教会你其余部分。',ja:'今すべてを理解する必要はありません。村が残りを教えてくれます。'},
    enter_btn:      {fr:'Entrer dans le village !',en:'Enter the village!',es:'¡Entrar al pueblo!',ht:'Antre nan vilaj la!',de:'Das Dorf betreten!',ru:'Войти в деревню!',zh:'进入村庄！',ja:'村に入る！'},
    skip:           {fr:'Passer cette étape',en:'Skip this step',es:'Omitir este paso',ht:'Pase etap sa a',de:'Schritt überspringen',ru:'Пропустить шаг',zh:'跳过此步骤',ja:'スキップ'},
    schema:         {fr:'Schéma de base',en:'Basic pattern',es:'Patrón básico',ht:'Modèl debaz',de:'Grundmuster',ru:'Базovaya schéma',zh:'基本句型',ja:'基本パターン'},
  };
  function _obT(key) {
    var nl = (window.S && S.nativeLang) || 'fr';
    return (OB_LABELS[key] && (OB_LABELS[key][nl] || OB_LABELS[key]['fr'])) || key;
  }


  // ── Données fondations par langue ──────────────────────────
  const FOUNDATIONS = {
    fr: {
      sounds: [
        { char:'ou', example:'bonjour', tip:{fr:'Lèvres arrondies — "bonjour"',en:'Rounded lips — like "boo"',es:'Labios redondeados — como "boo"',ht:'Bouch won — tankou "ou" an kreyòl',de:'Gerundete Lippen — wie "u" im Deutschen',ru:'Округлённые губы — как "у"',zh:'圆唇音，类似"乌"',ja:'口を丸めて"ウ"'} },
        { char:'eu', example:'bleu',    tip:{fr:'Lèvres arrondies, son entre "é" et "o"',en:'Rounded lips, sound between "e" and "o"',es:'Labios redondeados, entre "e" y "o"',ht:'Bouch won, son ant "é" ak "o"',de:'Gerundete Lippen, Laut zwischen "e" und "o"',ru:'Округлённые губы, звук между "е" и "о"',zh:'圆唇，介于"e"和"o"之间的音',ja:'唇を丸めて"e"と"o"の中間の音'} },
        { char:'on', example:'bon',     tip:{fr:'Nasale — air passe par le nez',en:'Nasal — air goes through the nose',es:'Nasal — el aire pasa por la nariz',ht:'Nazal — lè a pase nan nen',de:'Nasal — Luft durch die Nase',ru:'Носовой — воздух через нос',zh:'鼻音，气流通过鼻腔',ja:'鼻音、鼻から空気を出す'} },
        { char:'in', example:'vin',     tip:{fr:'Nasale — comme "en" mais plus fermé',en:'Nasal — like "en" but more closed',es:'Nasal — como "en" pero más cerrado',ht:'Nazal — tankou "en" men pi fèmen',de:'Nasal — wie "en" aber geschlossener',ru:'Носовой — как "ен" но более закрытый',zh:'鼻音，比"on"更紧闭',ja:'鼻音、"an"より口を閉じる'} },
        { char:'r',  example:'rue',     tip:{fr:'Vibration au fond de la gorge',en:'Vibration at the back of the throat',es:'Vibración en el fondo de la garganta',ht:'Vibrasyon nan fon gòj la',de:'Vibration im Rachen',ru:'Вибрация в глубине горла',zh:'喉音，喉咙深处的振动',ja:'喉の奥で振動させる'} },
      ],
      words: [
        { w:'bonjour', tr:'BON-jur',   meaning:{fr:'bonjour',en:'hello',es:'hola',ht:'bonjou',de:'hallo',ru:'привет',zh:'你好',ja:'こんにちは'} },
        { w:'merci',   tr:'mer-SI',    meaning:{fr:'merci',en:'thank you',es:'gracias',ht:'mèsi',de:'danke',ru:'спасибо',zh:'谢谢',ja:'ありがとう'} },
        { w:'oui',     tr:'wi',        meaning:{fr:'oui',en:'yes',es:'sí',ht:'wi',de:'ja',ru:'да',zh:'是',ja:'はい'} },
        { w:'non',     tr:'non',       meaning:{fr:'non',en:'no',es:'no',ht:'non',de:'nein',ru:'нет',zh:'不',ja:'いいえ'} },
        { w:"s'il vous plaît", tr:'sil-vu-PLE', meaning:{fr:"s'il vous plaît",en:'please',es:'por favor',ht:'tanpri',de:'bitte',ru:'пожалуйста',zh:'请',ja:'ください'} },
        { w:'je',      tr:'jeu',       meaning:{fr:'je',en:'I',es:'yo',ht:'mwen',de:'ich',ru:'я',zh:'我',ja:'私'} },
        { w:'tu',      tr:'tu',        meaning:{fr:'tu',en:'you',es:'tú',ht:'ou',de:'du',ru:'ты',zh:'你',ja:'あなた'} },
        { w:"c'est",  tr:'sey',        meaning:{fr:"c'est",en:'it is',es:'es',ht:'se',de:'es ist',ru:'это',zh:'是',ja:'です'} },
        { w:'avoir',   tr:'a-VWAR',    meaning:{fr:'avoir',en:'to have',es:'tener',ht:'genyen',de:'haben',ru:'иметь',zh:'有',ja:'持つ'} },
        { w:'être',    tr:'EY-tr',     meaning:{fr:'être',en:'to be',es:'ser',ht:'ye',de:'sein',ru:'быть',zh:'是',ja:'ある'} },
      ],
      structure: {
        pattern: 'Sujet + Verbe + Complément',
        example: 'Je mange une pomme',
        breakdown: {
          fr:['Je (je)','mange (mange)','une pomme (une pomme)'],
          en:['Je (I)','mange (eat)','une pomme (an apple)'],
          es:['Je (yo)','mange (como)','une pomme (una manzana)'],
          ht:['Je (mwen)','mange (manje)','une pomme (yon pòm)'],
          de:['Je (ich)','mange (esse)','une pomme (ein Apfel)'],
          ru:['Je (я)','mange (ем)','une pomme (яблоко)'],
          zh:['Je (我)','mange (吃)','une pomme (苹果)'],
          ja:['Je (私)','mange (食べる)','une pomme (リンゴ)'],
        },
      }
    },
    es: {
      sounds: [
        { char:'rr', example:'perro',   tip:{fr:'Roulement fort de la langue',en:'Strong tongue roll',es:'Vibración fuerte de la lengua',ht:'Woulo lang fò',de:'Starkes Zungenrollen',ru:'Сильная вибрация языка',zh:'强烈的舌颤音',ja:'舌を強く振動させる'} },
        { char:'ñ',  example:'niño',    tip:{fr:'Comme "gn" en français (agneau)',en:'Like "ny" in canyon',es:'Como "ñ" — sonido nasal palatino',ht:'Tankou "ny" anglè',de:'Wie "nj" auf Deutsch',ru:'Как "нь" в русском',zh:'类似"尼"的鼻腭音',ja:'"ニャ"に近い音'} },
        { char:'j',  example:'jugo',    tip:{fr:'Comme "h" fort de la gorge',en:'Like a strong "h" from the throat',es:'Fricativa velar sorda',ht:'Tankou "h" fò nan gòj',de:'Wie ein starkes "ch" im Rachen',ru:'Как сильный "х"',zh:'类似"赫"的喉音',ja:'喉の奥からの強い"ハ"'} },
        { char:'ll', example:'llama',   tip:{fr:'Comme "y" en créole haïtien',en:'Like "y" in yes',es:'Como "y" — varía por región',ht:'Tankou "y" an kreyòl',de:'Wie "j" im Deutschen',ru:'Как "й"',zh:'类似"也"的音',ja:'"ヤ"に近い音'} },
      ],
      words: [
        { w:'hola',     tr:'O-la',      meaning:{fr:'bonjour',en:'hello',es:'hola',ht:'bonjou',de:'hallo',ru:'привет',zh:'你好',ja:'こんにちは'} },
        { w:'gracias',  tr:'GRA-syas',  meaning:{fr:'merci',en:'thank you',es:'gracias',ht:'mèsi',de:'danke',ru:'спасибо',zh:'谢谢',ja:'ありがとう'} },
        { w:'sí',       tr:'si',        meaning:{fr:'oui',en:'yes',es:'sí',ht:'wi',de:'ja',ru:'да',zh:'是',ja:'はい'} },
        { w:'no',       tr:'no',        meaning:{fr:'non',en:'no',es:'no',ht:'non',de:'nein',ru:'нет',zh:'不',ja:'いいえ'} },
        { w:'por favor', tr:'por fa-VOR', meaning:{fr:"s'il vous plaît",en:'please',es:'por favor',ht:'tanpri',de:'bitte',ru:'пожалуйста',zh:'请',ja:'ください'} },
        { w:'yo',       tr:'yo',        meaning:{fr:'je',en:'I',es:'yo',ht:'mwen',de:'ich',ru:'я',zh:'我',ja:'私'} },
        { w:'tú',       tr:'tu',        meaning:{fr:'tu',en:'you',es:'tú',ht:'ou',de:'du',ru:'ты',zh:'你',ja:'あなた'} },
        { w:'es',       tr:'es',        meaning:{fr:"c'est",en:'it is',es:'es',ht:'se',de:'ist',ru:'это',zh:'是',ja:'です'} },
        { w:'tener',    tr:'te-NYER',   meaning:{fr:'avoir',en:'to have',es:'tener',ht:'genyen',de:'haben',ru:'иметь',zh:'有',ja:'持つ'} },
        { w:'ser',      tr:'ser',       meaning:{fr:'être',en:'to be',es:'ser',ht:'ye',de:'sein',ru:'быть',zh:'是',ja:'ある'} },
      ],
      structure: {
        pattern: 'Sujeto + Verbo + Complemento',
        example: 'Yo como una manzana',
        breakdown: {
          fr:['Yo (je)','como (mange)','una manzana (une pomme)'],
          en:['Yo (I)','como (eat)','una manzana (an apple)'],
          es:['Yo (yo)','como (como)','una manzana (manzana)'],
          ht:['Yo (mwen)','como (manje)','una manzana (yon pòm)'],
          de:['Yo (ich)','como (esse)','una manzana (ein Apfel)'],
          ru:['Yo (я)','como (ем)','una manzana (яблоко)'],
          zh:['Yo (我)','como (吃)','una manzana (苹果)'],
          ja:['Yo (私)','como (食べる)','una manzana (リンゴ)'],
        },
      }
    },
    en: {
      sounds: [
        { char:'th', example:'the',     tip:{fr:'Langue entre les dents — pas "d" ni "z"',en:'Tongue between teeth — not "d" or "z"',es:'Lengua entre los dientes — no "d" ni "z"',ht:'Lang ant dan yo — pa "d" ni "z"',de:'Zunge zwischen die Zähne — nicht "d" oder "s"',ru:'Язык между зубами — не "д" и не "з"',zh:'舌头放在牙齿间，不是"d"或"z"',ja:'舌を歯の間に、"d"や"z"ではない'} },
        { char:'w',  example:'water',   tip:{fr:'Lèvres arrondies, pas "v"',en:'Round lips, not "v"',es:'Labios redondeados, no "v"',ht:'Bouch won, pa "v"',de:'Gerundete Lippen, nicht "v"',ru:'Округлённые губы, не "в"',zh:'圆唇，不是"v"音',ja:'唇を丸めて、"v"ではない'} },
        { char:'r',  example:'red',     tip:{fr:'Langue vers le haut, ne touche rien',en:'Tongue curls back, touches nothing',es:'Lengua curvada hacia atrás, sin tocar nada',ht:'Lang monte, pa touche anyen',de:'Zunge nach hinten, berührt nichts',ru:'Язык загнут назад, ничего не касается',zh:'舌头向后卷，不接触任何地方',ja:'舌を後ろに巻き、何にも触れない'} },
        { char:'æ',  example:'cat',     tip:{fr:'Entre "a" et "e" ouvert',en:'Between "a" and open "e"',es:'Entre "a" y "e" abierta',ht:'Ant "a" ak "e" ouvè',de:'Zwischen "a" und offenem "e"',ru:'Между "а" и открытым "э"',zh:'介于"a"和开口"e"之间',ja:'"a"と開いた"e"の中間'} },
      ],
      words: [
        { w:'hello',    tr:'he-LO',     meaning:{fr:'bonjour',en:'hello',es:'hola',ht:'bonjou',de:'hallo',ru:'привет',zh:'你好',ja:'こんにちは'} },
        { w:'thank you', tr:'THANK yu', meaning:{fr:'merci',en:'thank you',es:'gracias',ht:'mèsi',de:'danke',ru:'спасибо',zh:'谢谢',ja:'ありがとう'} },
        { w:'yes',      tr:'yes',       meaning:{fr:'oui',en:'yes',es:'sí',ht:'wi',de:'ja',ru:'да',zh:'是',ja:'はい'} },
        { w:'no',       tr:'no',        meaning:{fr:'non',en:'no',es:'no',ht:'non',de:'nein',ru:'нет',zh:'不',ja:'いいえ'} },
        { w:'please',   tr:'pliz',      meaning:{fr:"s'il vous plaît",en:'please',es:'por favor',ht:'tanpri',de:'bitte',ru:'пожалуйста',zh:'请',ja:'ください'} },
        { w:'I',        tr:'ay',        meaning:{fr:'je',en:'I',es:'yo',ht:'mwen',de:'ich',ru:'я',zh:'我',ja:'私'} },
        { w:'you',      tr:'yu',        meaning:{fr:'tu/vous',en:'you',es:'tú/usted',ht:'ou/nou',de:'du/Sie',ru:'ты/вы',zh:'你/您',ja:'あなた'} },
        { w:'it is',    tr:'it iz',     meaning:{fr:"c'est",en:'it is',es:'es',ht:'se',de:'es ist',ru:'это',zh:'是',ja:'それは〜です'} },
        { w:'have',     tr:'hav',       meaning:{fr:'avoir',en:'to have',es:'tener',ht:'genyen',de:'haben',ru:'иметь',zh:'有',ja:'持つ'} },
        { w:'be',       tr:'bi',        meaning:{fr:'être',en:'to be',es:'ser/estar',ht:'ye',de:'sein',ru:'быть',zh:'是',ja:'ある/いる'} },
      ],
      structure: {
        pattern: 'Subject + Verb + Object',
        example: 'I eat an apple',
        breakdown: {
          fr:['I (je)','eat (mange)','an apple (une pomme)'],
          en:['I (I)','eat (eat)','an apple (an apple)'],
          es:['I (yo)','eat (como)','an apple (una manzana)'],
          ht:['I (mwen)','eat (manje)','an apple (yon pòm)'],
          de:['I (ich)','eat (esse)','an apple (ein Apfel)'],
          ru:['I (я)','eat (ем)','an apple (яблоко)'],
          zh:['I (我)','eat (吃)','an apple (苹果)'],
          ja:['I (私)','eat (食べる)','an apple (リンゴ)'],
        },
      }
    },
    de: {
      sounds: [
        { char:'ch', example:'machen',  tip:{fr:'Comme "h" aspiré du fond de la gorge',en:'Like a raspy "h" from the throat',es:'Como "j" suave desde la garganta',ht:'Tankou "h" griyen nan gòj',de:'Reibelaut im Rachen — nicht "k"',ru:'Как фрикативный звук в горле',zh:'喉音，类似于摩擦音',ja:'喉の奥からの摩擦音'} },
        { char:'ü',  example:'über',    tip:{fr:'Lèvres arrondies comme "ou", son "i"',en:'Round lips like "oo", say "ee"',es:'Labios redondeados como "u", sonido "i"',ht:'Bouch won tankou "ou", son "i"',de:'Runde Lippen wie bei "u", aber "i" sagen',ru:'Округлённые губы как для "у", звук "и"',zh:'口型像"ü"，发"i"的音',ja:'唇を丸めて"ü"、音は"i"'} },
        { char:'ö',  example:'schön',   tip:{fr:'Lèvres arrondies comme "ou", son "e"',en:'Round lips like "oo", say "e"',es:'Labios redondeados como "u", sonido "e"',ht:'Bouch won tankou "ou", son "e"',de:'Runde Lippen wie bei "u", aber "e" sagen',ru:'Округлённые губы как для "у", звук "э"',zh:'口型圆，发"e"的音',ja:'唇を丸めて"o"、音は"e"'} },
        { char:'ß',  example:'Straße',  tip:{fr:'Comme "ss" double',en:'Like a double "ss"',es:'Como "ss" doble',ht:'Tankou "ss" doub',de:'Wie doppeltes "ss"',ru:'Как двойное "сс"',zh:'相当于双"ss"',ja:'二重の"ss"のように'} },
      ],
      words: [
        { w:'hallo',      tr:'HA-lo',    meaning:{fr:'bonjour',en:'hello',es:'hola',ht:'bonjou',de:'hallo',ru:'привет',zh:'你好',ja:'こんにちは'} },
        { w:'danke',      tr:'DAN-ke',   meaning:{fr:'merci',en:'thank you',es:'gracias',ht:'mèsi',de:'danke',ru:'спасибо',zh:'谢谢',ja:'ありがとう'} },
        { w:'ja',         tr:'ya',       meaning:{fr:'oui',en:'yes',es:'sí',ht:'wi',de:'ja',ru:'да',zh:'是',ja:'はい'} },
        { w:'nein',       tr:'nayn',     meaning:{fr:'non',en:'no',es:'no',ht:'non',de:'nein',ru:'нет',zh:'不',ja:'いいえ'} },
        { w:'bitte',      tr:'BI-te',    meaning:{fr:"s'il vous plaît",en:'please',es:'por favor',ht:'tanpri',de:'bitte',ru:'пожалуйста',zh:'请',ja:'ください'} },
        { w:'ich',        tr:'ikh',      meaning:{fr:'je',en:'I',es:'yo',ht:'mwen',de:'ich',ru:'я',zh:'我',ja:'私'} },
        { w:'du',         tr:'du',       meaning:{fr:'tu',en:'you',es:'tú',ht:'ou',de:'du',ru:'ты',zh:'你',ja:'あなた'} },
        { w:'es ist',     tr:'es ist',   meaning:{fr:"c'est",en:'it is',es:'es',ht:'se',de:'es ist',ru:'это',zh:'是',ja:'それは〜です'} },
        { w:'haben',      tr:'HA-ben',   meaning:{fr:'avoir',en:'to have',es:'tener',ht:'genyen',de:'haben',ru:'иметь',zh:'有',ja:'持つ'} },
        { w:'sein',       tr:'zayn',     meaning:{fr:'être',en:'to be',es:'ser',ht:'ye',de:'sein',ru:'быть',zh:'是',ja:'ある'} },
      ],
      structure: {
        pattern: 'Subjekt + Verb + Objekt',
        example: 'Ich esse einen Apfel',
        breakdown: {
          fr:['Ich (je)','esse (mange)','einen Apfel (une pomme)'],
          en:['Ich (I)','esse (eat)','einen Apfel (an apple)'],
          es:['Ich (yo)','esse (como)','einen Apfel (una manzana)'],
          ht:['Ich (mwen)','esse (manje)','einen Apfel (yon pòm)'],
          de:['Ich (ich)','esse (esse)','einen Apfel (ein Apfel)'],
          ru:['Ich (я)','esse (ем)','einen Apfel (яблоко)'],
          zh:['Ich (我)','esse (吃)','einen Apfel (苹果)'],
          ja:['Ich (私)','esse (食べる)','einen Apfel (リンゴ)'],
        },
      }
    },
    ru: {
      sounds: [
        { char:'р',  example:'рот',     tip:{fr:'R roulé — vibre sur la langue',en:'Rolled R — tongue vibrates',es:'R vibrante — vibra la lengua',ht:'R woule — lang vibré',de:'Gerolltes R — Zunge vibriert',ru:'Вибрирующее р — язык вибрирует',zh:'颤音R，舌头振动',ja:'巻き舌のR'} },
        { char:'ы',  example:'ты',      tip:{fr:'Entre "i" et "ou" — son difficile',en:'Between "i" and "u" — tricky sound',es:'Entre "i" y "u" — sonido difícil',ht:'Ant "i" ak "ou" — son difisil',de:'Zwischen "i" und "u" — schwieriger Laut',ru:'Между "и" и "у" — редкий звук',zh:'介于"i"和"u"之间，难以发音',ja:'"i"と"u"の中間の難しい音'} },
        { char:'х',  example:'хлеб',   tip:{fr:'Comme "j" espagnol — gorge',en:'Like Spanish "j" — from the throat',es:'Como "j" española — de la garganta',ht:'Tankou "j" espanyòl — nan gòj',de:'Wie "ch" in "Bach"',ru:'Фрикативный гортанный звук',zh:'类似西班牙语"j"的喉音',ja:'スペイン語の"j"に似た喉音'} },
        { char:'ж',  example:'жить',   tip:{fr:'Comme "j" français mais plus fort',en:'Like French "j" but harder',es:'Como "y" argentina fuerte',ht:'Tankou "j" fransè men pi fò',de:'Wie "sch" aber weicher',ru:'Звонкий шипящий звук',zh:'类似法语"j"但更重',ja:'フランス語の"j"に似た音'} },
      ],
      words: [
        { w:'привет',    tr:'pri-VYET',  meaning:{fr:'bonjour (informel)',en:'hello (informal)',es:'hola (informal)',ht:'bonjou (enfòmèl)',de:'hallo (informell)',ru:'привет',zh:'你好（非正式）',ja:'こんにちは（カジュアル）'} },
        { w:'спасибо',   tr:'spa-SI-ba', meaning:{fr:'merci',en:'thank you',es:'gracias',ht:'mèsi',de:'danke',ru:'спасибо',zh:'谢谢',ja:'ありがとう'} },
        { w:'да',        tr:'da',        meaning:{fr:'oui',en:'yes',es:'sí',ht:'wi',de:'ja',ru:'да',zh:'是',ja:'はい'} },
        { w:'нет',       tr:'nyet',      meaning:{fr:'non',en:'no',es:'no',ht:'non',de:'nein',ru:'нет',zh:'不',ja:'いいえ'} },
        { w:'пожалуйста', tr:'pa-ZHA-lusta', meaning:{fr:"s'il vous plaît",en:'please',es:'por favor',ht:'tanpri',de:'bitte',ru:'пожалуйста',zh:'请',ja:'ください'} },
        { w:'я',         tr:'ya',        meaning:{fr:'je',en:'I',es:'yo',ht:'mwen',de:'ich',ru:'я',zh:'我',ja:'私'} },
        { w:'ты',        tr:'ty',        meaning:{fr:'tu',en:'you',es:'tú',ht:'ou',de:'du',ru:'ты',zh:'你',ja:'あなた'} },
        { w:'это',       tr:'EH-ta',     meaning:{fr:"c'est",en:'it is / this is',es:'es / esto es',ht:'se / sa a se',de:'das ist',ru:'это',zh:'这是',ja:'これは〜です'} },
        { w:'иметь',     tr:'i-MYET',    meaning:{fr:'avoir',en:'to have',es:'tener',ht:'genyen',de:'haben',ru:'иметь',zh:'有',ja:'持つ'} },
        { w:'быть',      tr:'byt',       meaning:{fr:'être',en:'to be',es:'ser/estar',ht:'ye',de:'sein',ru:'быть',zh:'是',ja:'ある/いる'} },
      ],
      structure: {
        pattern: 'Подлежащее + Сказуемое + Дополнение',
        example: 'Я ем яблоко',
        breakdown: {
          fr:['Я (je)','ем (mange)','яблоко (pomme)'],
          en:['Я (I)','ем (eat)','яблоко (apple)'],
          es:['Я (yo)','ем (como)','яблоко (manzana)'],
          ht:['Я (mwen)','ем (manje)','яблоко (pòm)'],
          de:['Я (ich)','ем (esse)','яблоко (Apfel)'],
          ru:['Я (я)','ем (ем)','яблоко (яблоко)'],
          zh:['Я (我)','ем (吃)','яблоко (苹果)'],
          ja:['Я (私)','ем (食べる)','яблоко (リンゴ)'],
        },
      }
    },
    zh: {
      sounds: [
        { char:'zh', example:'中',      tip:{fr:'Comme "dj" mais langue vers le haut',en:'Like "dj" but tongue curled up',es:'Como "dj" con la lengua hacia arriba',ht:'Tankou "dj" men lang monte',de:'Wie "dj" aber Zunge oben',ru:'Как "дж" но с загнутым языком',zh:'翘舌音，类似"j"',ja:'舌を上に巻いた"j"'} },
        { char:'x',  example:'小',      tip:{fr:'Comme "sh" avec les lèvres',en:'Like "sh" with lips spread',es:'Como "sh" con los labios extendidos',ht:'Tankou "sh" ak bouch ouvè',de:'Wie "sh" aber mit gespreizten Lippen',ru:'Как "ш" но с растянутыми губами',zh:'前腭擦音，舌面音',ja:'唇を広げた"sh"'} },
        { char:'q',  example:'七',      tip:{fr:'Comme "tch" léger',en:'Like a soft "ch"',es:'Como "ch" suave',ht:'Tankou "tch" dous',de:'Wie ein weiches "tsch"',ru:'Как мягкое "ч"',zh:'腭音，类似轻"ch"',ja:'軽い"ch"のような音'} },
        { char:'ü',  example:'鱼',      tip:{fr:'Lèvres rondes, son "i"',en:'Round lips, say "ee"',es:'Labios redondeados, sonido "i"',ht:'Bouch won, son "i"',de:'Runde Lippen, "i"-Laut',ru:'Округлённые губы, звук "и"',zh:'圆唇，发"i"音',ja:'唇を丸めて"i"を発音'} },
      ],
      words: [
        { w:'你好',    tr:'ni-HAO',     meaning:{fr:'bonjour',en:'hello',es:'hola',ht:'bonjou',de:'hallo',ru:'привет',zh:'你好',ja:'こんにちは'} },
        { w:'谢谢',    tr:'XIE-xie',    meaning:{fr:'merci',en:'thank you',es:'gracias',ht:'mèsi',de:'danke',ru:'спасибо',zh:'谢谢',ja:'ありがとう'} },
        { w:'是',      tr:'shì',        meaning:{fr:'oui / c\'est',en:'yes / it is',es:'sí / es',ht:'wi / se',de:'ja / es ist',ru:'да / это',zh:'是',ja:'はい / です'} },
        { w:'不',      tr:'bù',         meaning:{fr:'non',en:'no',es:'no',ht:'non',de:'nein',ru:'нет',zh:'不',ja:'いいえ'} },
        { w:'请',      tr:'qǐng',       meaning:{fr:"s'il vous plaît",en:'please',es:'por favor',ht:'tanpri',de:'bitte',ru:'пожалуйста',zh:'请',ja:'ください'} },
        { w:'我',      tr:'wǒ',         meaning:{fr:'je',en:'I',es:'yo',ht:'mwen',de:'ich',ru:'я',zh:'我',ja:'私'} },
        { w:'你',      tr:'nǐ',         meaning:{fr:'tu',en:'you',es:'tú',ht:'ou',de:'du',ru:'ты',zh:'你',ja:'あなた'} },
        { w:'是',      tr:'shì',        meaning:{fr:'être / c\'est',en:'to be / it is',es:'ser / es',ht:'ye / se',de:'sein / ist',ru:'быть / это',zh:'是',ja:'ある / です'} },
        { w:'有',      tr:'yǒu',        meaning:{fr:'avoir',en:'to have',es:'tener',ht:'genyen',de:'haben',ru:'иметь',zh:'有',ja:'持つ'} },
        { w:'很好',    tr:'hěn-HAO',    meaning:{fr:'très bien',en:'very good',es:'muy bien',ht:'trè bon',de:'sehr gut',ru:'очень хорошо',zh:'很好',ja:'とても良い'} },
      ],
      structure: {
        pattern: '主语 + 动词 + 宾语',
        example: '我吃苹果 (Wǒ chī píngguǒ)',
        breakdown: {
          fr:['我 wǒ (je)','吃 chī (mange)','苹果 píngguǒ (pomme)'],
          en:['我 wǒ (I)','吃 chī (eat)','苹果 píngguǒ (apple)'],
          es:['我 wǒ (yo)','吃 chī (como)','苹果 píngguǒ (manzana)'],
          ht:['我 wǒ (mwen)','吃 chī (manje)','苹果 píngguǒ (pòm)'],
          de:['我 wǒ (ich)','吃 chī (esse)','苹果 píngguǒ (Apfel)'],
          ru:['我 wǒ (я)','吃 chī (ем)','苹果 píngguǒ (яблоко)'],
          zh:['我 wǒ (我)','吃 chī (吃)','苹果 píngguǒ (苹果)'],
          ja:['我 wǒ (私)','吃 chī (食べる)','苹果 píngguǒ (リンゴ)'],
        },
      }
    },
    ja: {
      sounds: [
        { char:'つ',  example:'tsunami', tip:{fr:'Difficile — "ts" combiné rapide',en:'Tricky — fast "ts" combination',es:'Difícil — combinación "ts" rápida',ht:'Difisil — konbinezon "ts" rapid',de:'Schwierig — schnelles "ts"',ru:'Сложно — быстрое сочетание "тс"',zh:'难，快速的"ts"组合',ja:'難しい — 素早い"ts"の組み合わせ'} },
        { char:'ふ',  example:'futon',   tip:{fr:'Entre "f" et "h" — soufflé',en:'Between "f" and "h" — breathy',es:'Entre "f" y "h" — soplado',ht:'Ant "f" ak "h" — souf',de:'Zwischen "f" und "h" — hauchig',ru:'Между "ф" и "х" — придыхательный',zh:'介于"f"和"h"之间，气息音',ja:'"f"と"h"の中間の音'} },
        { char:'r',   example:'ら行',    tip:{fr:'Entre "r" et "l" — frappe rapide',en:'Between "r" and "l" — quick tap',es:'Entre "r" y "l" — golpe rápido',ht:'Ant "r" ak "l" — frap rapid',de:'Zwischen "r" und "l" — schneller Schlag',ru:'Между "р" и "л" — быстрый удар',zh:'介于"r"和"l"之间的弹音',ja:'"r"と"l"の中間の弾き音'} },
      ],
      words: [
        { w:'こんにちは', tr:'kon-ni-CHI-wa', meaning:{fr:'bonjour',en:'hello',es:'hola',ht:'bonjou',de:'hallo',ru:'привет',zh:'你好',ja:'こんにちは'} },
        { w:'ありがとう', tr:'a-ri-ga-TO',    meaning:{fr:'merci',en:'thank you',es:'gracias',ht:'mèsi',de:'danke',ru:'спасибо',zh:'谢谢',ja:'ありがとう'} },
        { w:'はい',      tr:'hai',            meaning:{fr:'oui',en:'yes',es:'sí',ht:'wi',de:'ja',ru:'да',zh:'是',ja:'はい'} },
        { w:'いいえ',    tr:'i-i-ye',         meaning:{fr:'non',en:'no',es:'no',ht:'non',de:'nein',ru:'нет',zh:'不',ja:'いいえ'} },
        { w:'ください',  tr:'ku-da-SAI',      meaning:{fr:"s'il vous plaît",en:'please',es:'por favor',ht:'tanpri',de:'bitte',ru:'пожалуйста',zh:'请',ja:'ください'} },
        { w:'私',        tr:'wa-ta-SHI',      meaning:{fr:'je',en:'I',es:'yo',ht:'mwen',de:'ich',ru:'я',zh:'我',ja:'私'} },
        { w:'あなた',    tr:'a-na-TA',        meaning:{fr:'tu/vous',en:'you',es:'tú/usted',ht:'ou/nou',de:'du/Sie',ru:'ты/вы',zh:'你/您',ja:'あなた'} },
        { w:'です',      tr:'des',            meaning:{fr:'être (formel)',en:'to be (formal)',es:'ser (formal)',ht:'ye (fòmèl)',de:'sein (förmlich)',ru:'быть (формально)',zh:'是（正式）',ja:'〜です（丁寧）'} },
        { w:'ある',      tr:'a-ru',           meaning:{fr:'avoir / exister',en:'to have / to exist',es:'tener / existir',ht:'genyen / egziste',de:'haben / existieren',ru:'иметь / существовать',zh:'有/存在',ja:'ある/存在する'} },
        { w:'わかった',  tr:'wa-KA-ta',       meaning:{fr:"j'ai compris",en:'I understood',es:'entendí',ht:'mwen konprann',de:'ich habe verstanden',ru:'я понял',zh:'明白了',ja:'わかった'} },
      ],
      structure: {
        pattern: '主語 + 目的語 + 動詞',
        example: '私はリンゴを食べます',
        breakdown: {
          fr:['私は (je)','リンゴを (pomme)','食べます (mange)'],
          en:['私は (I)','リンゴを (apple)','食べます (eat)'],
          es:['私は (yo)','リンゴを (manzana)','食べます (como)'],
          ht:['私は (mwen)','リンゴを (pòm)','食べます (manje)'],
          de:['私は (ich)','リンゴを (Apfel)','食べます (esse)'],
          ru:['私は (я)','リンゴを (яблоко)','食べます (ем)'],
          zh:['私は (我)','リンゴを (苹果)','食べます (吃)'],
          ja:['私は (私)','リンゴを (リンゴ)','食べます (食べる)'],
        },
      }
    },
    ht: {
      sounds: [
        { char:'ou', example:'ou',      tip:{fr:'Comme "ou" en français',en:'Like "oo" in food',es:'Como "u" en español',ht:'Tankou "ou" an fransè',de:'Wie "u" auf Deutsch',ru:'Как "у"',zh:'类似"乌"',ja:'"ウ"のような音'} },
        { char:'an', example:'manje',   tip:{fr:'Nasale — comme en français',en:'Nasal — like French "en"',es:'Nasal — como en francés',ht:'Nazal — tankou "an" fransè',de:'Nasal — wie im Französischen',ru:'Носовой — как во французском',zh:'鼻音，类似法语鼻元音',ja:'鼻音、フランス語の鼻母音に似た音'} },
        { char:'ch', example:'chèlbè',  tip:{fr:'Comme "sh" anglais',en:'Like "sh" in English',es:'Como "sh" inglés',ht:'Tankou "sh" anglè',de:'Wie "sch" auf Deutsch',ru:'Как английское "sh"',zh:'类似英语"sh"',ja:'英語の"sh"のような音'} },
      ],
      words: [
        { w:'bonjou',    tr:'bon-JU',   meaning:{fr:'bonjour',en:'hello',es:'hola',ht:'bonjou',de:'hallo',ru:'привет',zh:'你好',ja:'こんにちは'} },
        { w:'mèsi',      tr:'mè-SI',    meaning:{fr:'merci',en:'thank you',es:'gracias',ht:'mèsi',de:'danke',ru:'спасибо',zh:'谢谢',ja:'ありがとう'} },
        { w:'wi',        tr:'wi',       meaning:{fr:'oui',en:'yes',es:'sí',ht:'wi',de:'ja',ru:'да',zh:'是',ja:'はい'} },
        { w:'non',       tr:'non',      meaning:{fr:'non',en:'no',es:'no',ht:'non',de:'nein',ru:'нет',zh:'不',ja:'いいえ'} },
        { w:'tanpri',    tr:'tan-PRI',  meaning:{fr:"s'il vous plaît",en:'please',es:'por favor',ht:'tanpri',de:'bitte',ru:'пожалуйста',zh:'请',ja:'ください'} },
        { w:'mwen',      tr:'mwen',     meaning:{fr:'je/moi',en:'I / me',es:'yo / mí',ht:'mwen',de:'ich / mich',ru:'я / меня',zh:'我',ja:'私'} },
        { w:'ou',        tr:'u',        meaning:{fr:'tu/toi',en:'you',es:'tú',ht:'ou',de:'du',ru:'ты',zh:'你',ja:'あなた'} },
        { w:'se',        tr:'se',       meaning:{fr:"c'est",en:'it is',es:'es',ht:'se',de:'es ist',ru:'это',zh:'是',ja:'それは〜'} },
        { w:'genyen',    tr:'gen-YEN',  meaning:{fr:'avoir',en:'to have',es:'tener',ht:'genyen',de:'haben',ru:'иметь',zh:'有',ja:'持つ'} },
        { w:'ye',        tr:'ye',       meaning:{fr:'être',en:'to be',es:'ser',ht:'ye',de:'sein',ru:'быть',zh:'是',ja:'ある'} },
      ],
      structure: {
        pattern: 'Sijè + Vèb + Objè',
        example: 'Mwen manje yon pòm',
        breakdown: {
          fr:['Mwen (je)','manje (mange)','yon pòm (une pomme)'],
          en:['Mwen (I)','manje (eat)','yon pòm (an apple)'],
          es:['Mwen (yo)','manje (como)','yon pòm (una manzana)'],
          ht:['Mwen (mwen)','manje (manje)','yon pòm (yon pòm)'],
          de:['Mwen (ich)','manje (esse)','yon pòm (ein Apfel)'],
          ru:['Mwen (я)','manje (ем)','yon pòm (яблоко)'],
          zh:['Mwen (我)','manje (吃)','yon pòm (苹果)'],
          ja:['Mwen (私)','manje (食べる)','yon pòm (リンゴ)'],
        },
      }
    },
  };

  // ── Textes UI traduits selon la langue maternelle ──────────
  const UI_TEXT = {
    fr: {
      levelTitle:  lang => `Ton niveau en ${lang}`,
      levelSub:    'Sois honnête — l\'app adaptera tout pour toi',
      soundsTitle: lang => `🔊 Sons clés en ${lang}`,
      soundsSub:   'Ces sons n\'existent pas dans ta langue — apprends-les en premier',
      wordsTitle:  '📖 10 mots fondamentaux',
      wordsSub:    'Majuscules = syllabe accentuée • Prononce à voix haute',
      structTitle: '🧱 Structure des phrases',
      structSub:   '',
      structLabel: 'Schéma de base',
      structTip:   '💡 Tu n\'as pas besoin de tout comprendre maintenant.<br>Le village t\'apprendra le reste naturellement.',
      contSounds:  'Continuer →',
      contWords:   'Continuer →',
      enter:       '🏘️ Entrer dans le village !',
      skip:        'Passer cette étape',
    },
    en: {
      levelTitle:  lang => `Your level in ${lang}`,
      levelSub:    'Be honest — the app will adapt everything for you',
      soundsTitle: lang => `🔊 Key sounds in ${lang}`,
      soundsSub:   'These sounds don\'t exist in your language — learn them first',
      wordsTitle:  '📖 10 essential words',
      wordsSub:    'CAPITALS = stressed syllable • Pronounce out loud',
      structTitle: '🧱 Sentence structure',
      structSub:   'Memorize this pattern — everything starts here',
      structLabel: 'Basic pattern',
      structTip:   '💡 You don\'t need to understand everything now.<br>The village will teach you the rest naturally.',
      contSounds:  'Continue → The 10 essential words',
      contWords:   'Continue → Sentence structure',
      enter:       '🏘️ Enter the village!',
      skip:        'Skip this step',
    },
    es: {
      levelTitle:  lang => `Tu nivel en ${lang}`,
      levelSub:    'Sé honesto — la app adaptará todo para ti',
      soundsTitle: lang => `🔊 Sonidos clave en ${lang}`,
      soundsSub:   'Estos sonidos no existen en tu idioma — apréndelos primero',
      wordsTitle:  '📖 10 palabras esenciales',
      wordsSub:    'MAYÚSCULAS = sílaba acentuada • Pronuncia en voz alta',
      structTitle: '🧱 Estructura de las frases',
      structSub:   'Memoriza este esquema — todo empieza aquí',
      structLabel: 'Esquema básico',
      structTip:   '💡 No necesitas entender todo ahora.<br>El pueblo te enseñará el resto naturalmente.',
      contSounds:  'Continuar → Las 10 palabras esenciales',
      contWords:   'Continuar → Estructura de frases',
      enter:       '🏘️ ¡Entrar al pueblo!',
      skip:        'Saltar este paso',
    },
    ht: {
      levelTitle:  lang => `Nivo ou nan ${lang}`,
      levelSub:    'Swa onèt — app la ap adapte tout pou ou',
      soundsTitle: lang => `🔊 Son kle nan ${lang}`,
      soundsSub:   'Son sa yo pa egziste nan lang ou — aprann yo an premye',
      wordsTitle:  '📖 10 mo fondamantal',
      wordsSub:    'MAJISKIL = silab akantye • Pwononse fò',
      structTitle: '🧱 Estrikti fraz',
      structSub:   'Memorize modèl sa a — tout kòmanse isit la',
      structLabel: 'Modèl debaz',
      structTip:   '💡 Ou pa bezwen konprann tout kounye a.<br>Vilaj la ap aprann ou rès la natirèlman.',
      contSounds:  'Kontinye → 10 mo esansyèl',
      contWords:   'Kontinye → Estrikti fraz',
      enter:       '🏘️ Antre nan vilaj la!',
      skip:        'Sote etap sa a',
    },
    de: {
      levelTitle:  lang => `Dein Niveau in ${lang}`,
      levelSub:    'Sei ehrlich — die App passt sich dir an',
      soundsTitle: lang => `🔊 Wichtige Laute auf ${lang}`,
      soundsSub:   'Diese Laute gibt es in deiner Sprache nicht — lern sie zuerst',
      wordsTitle:  '📖 10 grundlegende Wörter',
      wordsSub:    'GROSSBUCHSTABEN = betonte Silbe • Laut aussprechen',
      structTitle: '🧱 Satzstruktur',
      structSub:   'Merke dir dieses Muster — alles beginnt hier',
      structLabel: 'Grundmuster',
      structTip:   '💡 Du musst nicht alles sofort verstehen.<br>Das Dorf wird dir den Rest auf natürliche Weise beibringen.',
      contSounds:  'Weiter → Die 10 wichtigsten Wörter',
      contWords:   'Weiter → Satzstruktur',
      enter:       '🏘️ Das Dorf betreten!',
      skip:        'Diesen Schritt überspringen',
    },
    ru: {
      levelTitle:  lang => `Твой уровень в ${lang}`,
      levelSub:    'Будь честен — приложение адаптируется под тебя',
      soundsTitle: lang => `🔊 Ключевые звуки в ${lang}`,
      soundsSub:   'Этих звуков нет в твоём языке — выучи их сначала',
      wordsTitle:  '📖 10 основных слов',
      wordsSub:    'ЗАГЛАВНЫЕ = ударный слог • Произноси вслух',
      structTitle: '🧱 Структура предложений',
      structSub:   'Запомни эту схему — всё начинается здесь',
      structLabel: 'Базовая схема',
      structTip:   '💡 Тебе не нужно понимать всё сейчас.<br>Деревня научит тебя остальному естественным образом.',
      contSounds:  'Продолжить → 10 основных слов',
      contWords:   'Продолжить → Структура предложений',
      enter:       '🏘️ Войти в деревню!',
      skip:        'Пропустить этот шаг',
    },
    zh: {
      levelTitle:  lang => `你的${lang}水平`,
      levelSub:    '诚实回答 — 应用将为你量身定制',
      soundsTitle: lang => `🔊 ${lang}的关键发音`,
      soundsSub:   '这些发音在你的语言中不存在 — 先学它们',
      wordsTitle:  '📖 10个基础词汇',
      wordsSub:    '大写字母 = 重读音节 • 大声朗读',
      structTitle: '🧱 句子结构',
      structSub:   '记住这个模式 — 一切从这里开始',
      structLabel: '基本模式',
      structTip:   '💡 你现在不需要理解所有内容。<br>村庄会自然地教会你其余的内容。',
      contSounds:  '继续 → 10个必备词汇',
      contWords:   '继续 → 句子结构',
      enter:       '🏘️ 进入村庄！',
      skip:        '跳过此步骤',
    },
    ja: {
      levelTitle:  lang => `${lang}のレベル`,
      levelSub:    '正直に答えてください — アプリがあなたに合わせます',
      soundsTitle: lang => `🔊 ${lang}の重要な発音`,
      soundsSub:   'これらの音はあなたの言語には存在しません — まず学んでください',
      wordsTitle:  '📖 10の基本単語',
      wordsSub:    '大文字 = アクセントのある音節 • 声に出して発音してください',
      structTitle: '🧱 文の構造',
      structSub:   'このパターンを覚えてください — すべてはここから始まります',
      structLabel: '基本パターン',
      structTip:   '💡 今すべてを理解する必要はありません。<br>村が自然に残りを教えてくれます。',
      contSounds:  '続ける → 10の必須単語',
      contWords:   '続ける → 文の構造',
      enter:       '🏘️ 村に入る！',
      skip:        'このステップをスキップ',
    },
  };

  function _t() {
    const nl = (window.S && window.S.nativeLang) || 'fr';
    return UI_TEXT[nl] || UI_TEXT.fr;
  }

  // ── Niveaux ────────────────────────────────────────────────
  const LEVELS_DATA = [
    {
      id:'zero', icon:'🌱', xpBonus:0,
      label:{ fr:'Zéro absolu',      en:'Absolute zero',       es:'Cero absoluto',       ht:'Zewo absoli',          de:'Absoluter Anfänger',     ru:'Абсолютный ноль',        zh:'零基础',           ja:'完全な初心者' },
      desc: { fr:'Je ne connais aucun mot.',  en:'I don\'t know any words.', es:'No conozco ninguna palabra.', ht:'Mwen pa konnen okenn mo.', de:'Ich kenne kein einziges Wort.', ru:'Я не знаю ни одного слова.', zh:'我一个词都不认识。', ja:'一つも単語を知りません。' },
    },
    {
      id:'beginner', icon:'⭐', xpBonus:50,
      label:{ fr:'Quelques mots',    en:'A few words',         es:'Algunas palabras',    ht:'Kèk mo',               de:'Einige Wörter',          ru:'Несколько слов',         zh:'几个词',           ja:'少しの単語' },
      desc: { fr:'Je connais les salutations de base.', en:'I know basic greetings.', es:'Conozco los saludos básicos.', ht:'Mwen konnen salitasyon debaz.', de:'Ich kenne grundlegende Begrüßungen.', ru:'Я знаю базовые приветствия.', zh:'我知道基本问候语。', ja:'基本的な挨拶を知っています。' },
    },
    {
      id:'elementary', icon:'📚', xpBonus:100,
      label:{ fr:'Niveau élémentaire', en:'Elementary level',  es:'Nivel elemental',     ht:'Nivo elemantè',        de:'Grundkenntnisse',        ru:'Начальный уровень',      zh:'初级水平',         ja:'初級レベル' },
      desc: { fr:'Je peux me présenter.', en:'I can introduce myself.', es:'Puedo presentarme.', ht:'Mwen ka prezante tèt mwen.', de:'Ich kann mich vorstellen.', ru:'Я могу представиться.', zh:'我会自我介绍。', ja:'自己紹介ができます。' },
    },
    {
      id:'intermediate', icon:'🎓', xpBonus:200,
      label:{ fr:'Intermédiaire',    en:'Intermediate',        es:'Intermedio',           ht:'Entèmedyè',            de:'Mittelstufe',            ru:'Средний уровень',        zh:'中级',             ja:'中級' },
      desc: { fr:'Je peux tenir une conversation simple.', en:'I can hold a simple conversation.', es:'Puedo mantener una conversación simple.', ht:'Mwen ka kenbe yon konvèsasyon senp.', de:'Ich kann ein einfaches Gespräch führen.', ru:'Я могу поддержать простой разговор.', zh:'我能进行简单对话。', ja:'簡単な会話ができます。' },
    },
  ];
  function _getLevels() {
    const nl = (window.S && window.S.nativeLang) || 'fr';
    return LEVELS_DATA.map(lv => ({
      ...lv,
      label: lv.label[nl] || lv.label.fr,
      desc:  lv.desc[nl]  || lv.desc.fr,
    }));
  }

  // ── État interne ────────────────────────────────────────────
  let _currentStep = 0;  // 0=niveau, 1=fondations sons, 2=mots, 3=structure, 4=done
  let _onDone = null;

  // ── API publique ────────────────────────────────────────────
  function show(onDone) {
    _onDone = onDone;
    _currentStep = 0;
    _buildScreen();
    _showStep(0);
  }

  function _buildScreen() {
    let sc = document.getElementById('screen-onboarding');
    if (!sc) {
      sc = document.createElement('div');
      sc.id = 'screen-onboarding';
      sc.className = 'screen';
      sc.style.cssText = [
        'display:none','flex-direction:column','align-items:center',
        'justify-content:flex-start','padding:20px 16px',
        'background:radial-gradient(ellipse at 50% 20%,#0d1a2e 0%,#07090f 70%)',
        'overflow-y:auto'
      ].join(';');
      document.body.appendChild(sc);
    }
  }

  function _showStep(step) {
    const sc = document.getElementById('screen-onboarding');
    if (!sc) return;
    if (typeof window.showScreen === 'function') {
      window.showScreen('screen-onboarding');
    } else {
      document.querySelectorAll('.screen').forEach(s => { s.classList.remove('active'); s.style.display = ''; });
      sc.classList.add('active');
    }

    if (step === 0) _renderLevelSelect(sc);
    else if (step === 1) _renderSounds(sc);
    else if (step === 2) _renderWords(sc);
    else if (step === 3) _renderStructure(sc);
    else _finish();
  }

  function _renderLevelSelect(sc) {
    const lang = (window.S && S.targetLang) || 'fr';
    const flag = (window.FLAGS && FLAGS[lang]) || '';
    const langName = (window.LANG_NAMES && LANG_NAMES[lang]) || lang;
    const t = _t();

    sc.innerHTML = `
      <div style="width:100%;max-width:420px;padding-top:16px;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="font-size:2.5rem;margin-bottom:8px;">${flag}</div>
          <div style="font-family:'Cinzel',serif;font-size:1.4rem;font-weight:700;
                      color:#ffd700;margin-bottom:6px;">${t.levelTitle(langName)}</div>
          <div style="font-size:0.78rem;color:rgba(255,255,255,0.45);">
            ${t.levelSub}
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:10px;" id="ob-levels">
          ${_getLevels().map(lv => `
            <button onclick="window.LV_ONBOARDING._pickLevel('${lv.id}')"
              style="display:flex;align-items:center;gap:14px;padding:14px 16px;
                     background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,215,0,0.15);
                     border-radius:14px;cursor:pointer;text-align:left;width:100%;
                     transition:all 0.2s;" class="ob-level-btn">
              <span style="font-size:1.6rem;flex-shrink:0;">${lv.icon}</span>
              <span style="flex:1;">
                <div style="font-weight:800;font-size:0.9rem;color:#e8e0d0;">${lv.label}</div>
                <div style="font-size:0.72rem;color:rgba(255,255,255,0.45);margin-top:2px;">${lv.desc}</div>
              </span>
            </button>
          `).join('')}
        </div>

        <div style="margin-top:16px;text-align:center;">
          <button onclick="window.LV_ONBOARDING._skip()"
            style="background:none;border:none;color:rgba(255,255,255,0.3);
                   font-size:0.72rem;cursor:pointer;text-decoration:underline;">
            ${t.skip}
          </button>
        </div>
      </div>`;
  }

  function _renderSounds(sc) {
    const lang = (window.S && S.targetLang) || 'fr';
    const nl   = (window.S && window.S.nativeLang) || 'fr';
    const data = FOUNDATIONS[lang] || FOUNDATIONS.fr;
    const langName = (window.LANG_NAMES && LANG_NAMES[lang]) || lang;
    const t = _t();

    sc.innerHTML = `
      <div style="width:100%;max-width:420px;padding-top:12px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
          <div style="flex:1;height:3px;background:rgba(255,215,0,0.4);border-radius:2px;"></div>
          <div style="height:3px;flex:3;background:rgba(255,215,0,0.12);border-radius:2px;"></div>
          <div style="height:3px;flex:3;background:rgba(255,215,0,0.12);border-radius:2px;"></div>
        </div>

        <div style="font-family:'Cinzel',serif;font-size:1.1rem;font-weight:700;
                    color:#ffd700;margin-bottom:4px;">${t.soundsTitle(langName)}</div>
        <div style="font-size:0.75rem;color:rgba(255,255,255,0.45);margin-bottom:18px;">
          ${t.soundsSub}
        </div>

        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px;">
          ${data.sounds.map(s => `
            <div style="background:rgba(74,158,255,0.06);border:1px solid rgba(74,158,255,0.2);
                        border-radius:12px;padding:12px 14px;display:flex;align-items:center;gap:12px;">
              <span style="font-family:'Cinzel',serif;font-size:1.4rem;color:#4a9eff;
                           font-weight:900;min-width:36px;text-align:center;">${s.char}</span>
              <span style="flex:1;">
                <div style="font-size:0.82rem;font-weight:700;color:#e8e0d0;">ex: <em>${s.example}</em></div>
                <div style="font-size:0.7rem;color:rgba(255,255,255,0.45);margin-top:2px;">${typeof s.tip === 'object' ? (s.tip[nl] || s.tip.fr) : s.tip}</div>
              </span>
              <button onclick="window.LV_ONBOARDING._speak('${s.example}', '${(window.S&&S.targetLang)||'fr'}')"
                style="background:rgba(74,158,255,0.1);border:1px solid rgba(74,158,255,0.2);
                       color:#4a9eff;padding:5px 10px;border-radius:8px;font-size:0.75rem;cursor:pointer;">
                🔊
              </button>
            </div>
          `).join('')}
        </div>

        <button onclick="window.LV_ONBOARDING._next()"
          style="width:100%;background:linear-gradient(135deg,#a86800,#ffd700);border:none;
                 border-radius:14px;padding:14px;font-family:'Cinzel',serif;
                 font-size:0.95rem;font-weight:700;color:#0a0a0a;cursor:pointer;">
          ${t.contSounds}
        </button>
      </div>`;
  }

  function _renderWords(sc) {
    const lang = (window.S && S.targetLang) || 'fr';
    const nl   = (window.S && window.S.nativeLang) || 'fr';
    const data = FOUNDATIONS[lang] || FOUNDATIONS.fr;
    const t = _t();

    sc.innerHTML = `
      <div style="width:100%;max-width:420px;padding-top:12px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
          <div style="height:3px;flex:1;background:rgba(255,215,0,0.4);border-radius:2px;"></div>
          <div style="height:3px;flex:1;background:rgba(255,215,0,0.4);border-radius:2px;"></div>
          <div style="height:3px;flex:3;background:rgba(255,215,0,0.12);border-radius:2px;"></div>
        </div>

        <div style="font-family:'Cinzel',serif;font-size:1.1rem;font-weight:700;
                    color:#ffd700;margin-bottom:4px;">${t.wordsTitle}</div>
        <div style="font-size:0.75rem;color:rgba(255,255,255,0.45);margin-bottom:14px;">
          ${t.wordsSub}
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px;">
          ${data.words.map((w,i) => `
            <div onclick="window.LV_ONBOARDING._speak('${w.w}','${lang}')"
              style="background:rgba(78,207,112,0.06);border:1px solid rgba(78,207,112,0.2);
                     border-radius:12px;padding:10px 12px;cursor:pointer;text-align:center;
                     transition:all 0.15s;" class="ob-word">
              <div style="font-size:1rem;font-weight:800;color:#4ecf70;">${w.w}</div>
              <div style="font-size:0.72rem;color:#4a9eff;margin:2px 0;">${w.tr}</div>
              <div style="font-size:0.68rem;color:rgba(255,255,255,0.4);">${typeof w.meaning === 'object' ? (w.meaning[nl] || w.meaning.fr) : w.meaning}</div>
            </div>
          `).join('')}
        </div>

        <button onclick="window.LV_ONBOARDING._next()"
          style="width:100%;background:linear-gradient(135deg,#a86800,#ffd700);border:none;
                 border-radius:14px;padding:14px;font-family:'Cinzel',serif;
                 font-size:0.95rem;font-weight:700;color:#0a0a0a;cursor:pointer;">
          ${t.contWords}
        </button>
      </div>`;
  }

  function _renderStructure(sc) {
    const lang = (window.S && S.targetLang) || 'fr';
    const nl   = (window.S && window.S.nativeLang) || 'fr';
    const data = FOUNDATIONS[lang] || FOUNDATIONS.fr;
    const st = data.structure;
    const breakdown = typeof st.breakdown === 'object' && !Array.isArray(st.breakdown)
      ? (st.breakdown[nl] || st.breakdown.fr)
      : st.breakdown;
    const t = _t();

    sc.innerHTML = `
      <div style="width:100%;max-width:420px;padding-top:12px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
          ${[1,2,3].map(i => `<div style="height:3px;flex:1;background:rgba(255,215,0,0.4);border-radius:2px;"></div>`).join('')}
        </div>

        <div style="font-family:'Cinzel',serif;font-size:1.1rem;font-weight:700;
                    color:#ffd700;margin-bottom:4px;">${t.structTitle}</div>
        <div style="font-size:0.75rem;color:rgba(255,255,255,0.45);margin-bottom:18px;">
          ${t.structSub}
        </div>

        <div style="background:rgba(192,132,252,0.08);border:1px solid rgba(192,132,252,0.25);
                    border-radius:14px;padding:16px;margin-bottom:14px;text-align:center;">
          <div style="font-size:0.7rem;font-weight:800;letter-spacing:0.12em;
                      text-transform:uppercase;color:#c084fc;margin-bottom:10px;">${t.structLabel}</div>
          <div style="font-size:1rem;font-weight:700;color:#e8e0d0;margin-bottom:14px;">${st.pattern}</div>
          <div style="font-family:'Cinzel',serif;font-size:1.1rem;color:#ffd700;
                      margin-bottom:12px;">${st.example}</div>
          <div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;">
            ${breakdown.map(b => `
              <span style="background:rgba(192,132,252,0.1);border:1px solid rgba(192,132,252,0.2);
                           border-radius:8px;padding:4px 10px;font-size:0.72rem;color:#c084fc;">
                ${b}
              </span>`).join('')}
          </div>
        </div>

        <div style="background:rgba(255,215,0,0.06);border:1px solid rgba(255,215,0,0.15);
                    border-radius:12px;padding:12px;margin-bottom:20px;font-size:0.78rem;
                    color:rgba(255,255,255,0.6);line-height:1.6;text-align:center;">
          ${t.structTip}
        </div>

        <button onclick="window.LV_ONBOARDING._finish()"
          style="width:100%;background:linear-gradient(135deg,#a86800,#ffd700);border:none;
                 border-radius:14px;padding:15px;font-family:'Cinzel',serif;
                 font-size:1rem;font-weight:700;color:#0a0a0a;cursor:pointer;
                 box-shadow:0 4px 20px rgba(255,215,0,0.3);">
          ${t.enter}
        </button>
      </div>`;
  }

  function _pickLevel(levelId) {
    if (window.S) {
      S.userLevel = levelId;
      window.LV_MEMORY && window.LV_MEMORY.set('level', levelId);
    }
    // Si zéro absolu → parcours fondations complet
    if (levelId === 'zero') {
      _currentStep = 1;
      _showStep(1);
    } else {
      // Niveaux plus avancés → skip fondations
      _finish();
    }
  }

  function _next() {
    _currentStep++;
    _showStep(_currentStep);
  }

  function _skip() {
    _finish();
  }

  function _finish() {
    const sc = document.getElementById('screen-onboarding');
    if (sc) { sc.classList.remove('active'); sc.style.display = ''; }
    if (_onDone) _onDone();
  }

  function _speak(word, lang) {
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(word);
      const langMap = { fr:'fr-FR',es:'es-ES',en:'en-US',de:'de-DE',
                        ru:'ru-RU',zh:'zh-CN',ja:'ja-JP',ht:'fr-HT' };
      utter.lang = langMap[lang] || 'fr-FR';
      utter.rate = 0.8;
      speechSynthesis.speak(utter);
    }
  }

  // Exposer les méthodes internes pour les onclick inline
  return { show, _pickLevel, _next, _skip, _finish, _speak, FOUNDATIONS };
})();
