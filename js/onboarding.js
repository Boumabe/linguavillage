// LinguaVillage — onboarding.js (PATCHED)
// Corrections :
// 1. Mots fondamentaux : traduction dans la langue maternelle
// 2. Boutons de niveau : couleurs visibles et esthétiques
// 3. Sons clés : tip traduit selon la langue maternelle
// ================================================================

window.LV_ONBOARDING = (function() {

  var UI_TEXTS = {
    fr: {
      levelTitle: lang => `Ton niveau en ${lang}`,
      levelSub: "Sois honnête — l'app adaptera tout pour toi",
      soundsTitle: lang => `🔊 Sons clés en ${lang}`,
      soundsSub: "Ces sons n'existent pas dans ta langue — apprends-les en premier",
      wordsTitle: '📖 10 mots fondamentaux',
      wordsSub: 'Majuscules = syllabe accentuée • Clique pour écouter',
      wordNative: 'Traduction',
      structTitle: '🧱 Structure des phrases',
      structLabel: 'Schéma de base',
      structTip: "💡 Tu n'as pas besoin de tout comprendre maintenant.<br>Le village t'apprendra le reste naturellement.",
      contSounds: 'Continuer →',
      contWords: 'Continuer →',
      enter: '🏘️ Entrer dans le village !',
      skip: 'Passer cette étape'
    },
    en: {
      levelTitle: lang => `Your level in ${lang}`,
      levelSub: 'Be honest — the app will adapt for you',
      soundsTitle: lang => `🔊 Key sounds in ${lang}`,
      soundsSub: "These sounds don't exist in your language — learn them first",
      wordsTitle: '📖 10 essential words',
      wordsSub: 'CAPITALS = stressed syllable • Click to listen',
      wordNative: 'Translation',
      structTitle: '🧱 Sentence structure',
      structLabel: 'Basic pattern',
      structTip: "💡 You don't need to understand everything now.<br>The village will teach you naturally.",
      contSounds: 'Continue →',
      contWords: 'Continue →',
      enter: '🏘️ Enter the village!',
      skip: 'Skip this step'
    },
    es: {
      levelTitle: lang => `Tu nivel en ${lang}`,
      levelSub: 'Sé honesto — la app se adaptará para ti',
      soundsTitle: lang => `🔊 Sonidos clave en ${lang}`,
      soundsSub: 'Estos sonidos no existen en tu idioma — apréndelos primero',
      wordsTitle: '📖 10 palabras fundamentales',
      wordsSub: 'MAYÚSCULAS = sílaba acentuada • Clic para escuchar',
      wordNative: 'Traducción',
      structTitle: '🧱 Estructura de las frases',
      structLabel: 'Esquema básico',
      structTip: '💡 No necesitas entender todo ahora.<br>El pueblo te enseñará el resto naturalmente.',
      contSounds: 'Continuar →',
      contWords: 'Continuar →',
      enter: '🏘️ ¡Entrar al pueblo!',
      skip: 'Saltar este paso'
    },
    ht: {
      levelTitle: lang => `Nivo ou nan ${lang}`,
      levelSub: "Swa onèt — app la ap adapte pou ou",
      soundsTitle: lang => `🔊 Son kle nan ${lang}`,
      soundsSub: "Son sa yo pa egziste nan lang ou — aprann yo an premye",
      wordsTitle: '📖 10 mo fondamantal',
      wordsSub: 'MAJISKIL = silab akantye • Klike pou koute',
      wordNative: 'Tradiksyon',
      structTitle: '🧱 Estrikti fraz',
      structLabel: 'Modèl debaz',
      structTip: "💡 Ou pa bezwen konprann tout kounye a.<br>Vilaj la ap aprann ou rès la natirèlman.",
      contSounds: 'Kontinye →',
      contWords: 'Kontinye →',
      enter: '🏘️ Antre nan vilaj la!',
      skip: 'Sote etap sa a'
    },
    de: {
      levelTitle: lang => `Dein Niveau in ${lang}`,
      levelSub: 'Sei ehrlich — die App passt sich an',
      soundsTitle: lang => `🔊 Wichtige Laute in ${lang}`,
      soundsSub: 'Diese Laute gibt es in deiner Sprache nicht — lerne sie zuerst',
      wordsTitle: '📖 10 grundlegende Wörter',
      wordsSub: 'GROSSBUCHSTABEN = betonte Silbe • Klicken zum Anhören',
      wordNative: 'Übersetzung',
      structTitle: '🧱 Satzstruktur',
      structLabel: 'Grundmuster',
      structTip: '💡 Du musst nicht alles sofort verstehen.<br>Das Dorf wird dir den Rest auf natürliche Weise beibringen.',
      contSounds: 'Weiter →',
      contWords: 'Weiter →',
      enter: '🏘️ Das Dorf betreten!',
      skip: 'Diesen Schritt überspringen'
    },
    ru: {
      levelTitle: lang => `Твой уровень в ${lang}`,
      levelSub: 'Будь честен — приложение адаптируется',
      soundsTitle: lang => `🔊 Ключевые звуки в ${lang}`,
      soundsSub: 'Этих звуков нет в твоём языке — выучи их сначала',
      wordsTitle: '📖 10 основных слов',
      wordsSub: 'ЗАГЛАВНЫЕ = ударный слог • Нажмите для прослушивания',
      wordNative: 'Перевод',
      structTitle: '🧱 Структура предложений',
      structLabel: 'Базовая схема',
      structTip: '💡 Тебе не нужно понимать всё сейчас.<br>Деревня научит тебя остальному естественным образом.',
      contSounds: 'Продолжить →',
      contWords: 'Продолжить →',
      enter: '🏘️ Войти в деревню!',
      skip: 'Пропустить этот шаг'
    },
    zh: {
      levelTitle: lang => `你在${lang}的水平`,
      levelSub: '诚实回答 — 应用将为你调整',
      soundsTitle: lang => `🔊 ${lang}的关键发音`,
      soundsSub: '这些发音在你的语言中不存在 — 先学习它们',
      wordsTitle: '📖 10个基础词汇',
      wordsSub: '大写字母 = 重读音节 • 点击收听',
      wordNative: '翻译',
      structTitle: '🧱 句子结构',
      structLabel: '基本句型',
      structTip: '💡 你现在不需要理解所有内容。<br>村庄会自然地教会你其余的部分。',
      contSounds: '继续 →',
      contWords: '继续 →',
      enter: '🏘️ 进入村庄！',
      skip: '跳过此步骤'
    },
    ja: {
      levelTitle: lang => `${lang}のレベル`,
      levelSub: '正直に答えてください — アプリが調整します',
      soundsTitle: lang => `🔊 ${lang}の重要な音`,
      soundsSub: 'これらの音はあなたの言語には存在しません — まず学びましょう',
      wordsTitle: '📖 10の基本単語',
      wordsSub: '大文字 = アクセントのある音節 • クリックして聴く',
      wordNative: '翻訳',
      structTitle: '🧱 文の構造',
      structLabel: '基本パターン',
      structTip: '💡 今すべてを理解する必要はありません。<br>村が自然に残りを教えてくれます。',
      contSounds: '続ける →',
      contWords: '続ける →',
      enter: '🏘️ 村に入る！',
      skip: 'このステップをスキップ'
    }
  };

  // ================================================================
  // NIVEAUX — couleurs distinctes par niveau
  // ================================================================
  const LEVELS = [
    {
      id:'zero', icon:'🌱',
      color:'#4ecf70', bg:'rgba(78,207,112,0.10)', border:'rgba(78,207,112,0.30)',
      label:{ fr:'Zéro absolu', en:'Absolute zero', es:'Cero absoluto', ht:'Zewo absoli', de:'Absoluter Anfänger', ru:'Абсолютный ноль', zh:'零基础', ja:'完全な初心者' },
      desc:{ fr:"Je ne connais aucun mot", en:"I don't know any words", es:"No conozco ninguna palabra", ht:"Mwen pa konnen okenn mo", de:"Ich kenne keine Wörter", ru:"Я не знаю ни одного слова", zh:"我不认识任何单词", ja:"単語を一つも知りません" }
    },
    {
      id:'beginner', icon:'⭐',
      color:'#4a9eff', bg:'rgba(74,158,255,0.10)', border:'rgba(74,158,255,0.30)',
      label:{ fr:'Quelques mots', en:'A few words', es:'Algunas palabras', ht:'Kèk mo', de:'Einige Wörter', ru:'Несколько слов', zh:'几个词', ja:'少しの単語' },
      desc:{ fr:"Je connais bonjour, merci...", en:"I know hello, thanks...", es:"Conozco hola, gracias...", ht:"Mwen konnen bonjou, mèsi...", de:"Ich kenne Hallo, Danke...", ru:"Я знаю привет, спасибо...", zh:"我知道你好，谢谢...", ja:"こんにちは、ありがとうは知っています..." }
    },
    {
      id:'elementary', icon:'📚',
      color:'#c084fc', bg:'rgba(192,132,252,0.10)', border:'rgba(192,132,252,0.30)',
      label:{ fr:'Niveau élémentaire', en:'Elementary level', es:'Nivel elemental', ht:'Nivo elemantè', de:'Grundkenntnisse', ru:'Начальный уровень', zh:'初级水平', ja:'初級レベル' },
      desc:{ fr:"Je peux faire des phrases simples", en:"I can make simple sentences", es:"Puedo hacer frases simples", ht:"Mwen ka fè fraz senp", de:"Ich kann einfache Sätze bilden", ru:"Я могу строить простые предложения", zh:"我能造简单的句子", ja:"簡単な文が作れます" }
    },
    {
      id:'intermediate', icon:'🎓',
      color:'#ffd700', bg:'rgba(255,215,0,0.10)', border:'rgba(255,215,0,0.30)',
      label:{ fr:'Intermédiaire', en:'Intermediate', es:'Intermedio', ht:'Entèmedyè', de:'Mittelstufe', ru:'Средний уровень', zh:'中级', ja:'中級' },
      desc:{ fr:"Je peux avoir une conversation", en:"I can hold a conversation", es:"Puedo tener una conversación", ht:"Mwen ka fè yon konvèsasyon", de:"Ich kann mich unterhalten", ru:"Я могу поддержать разговор", zh:"我能进行对话", ja:"会話ができます" }
    }
  ];

  // ================================================================
  // DONNÉES FONDATIONS — tips traduits par langue maternelle
  // ================================================================
  const FOUNDATIONS = {
    fr: {
      sounds: [
        {
          char:'ou', example:'bonjour',
          tip:{
            fr:'Lèvres arrondies — comme "ou" dans "loup"',
            en:'Round lips — like "oo" in "moon"',
            es:'Labios redondeados — como "u" en "luz"',
            ht:'Bouch won — tankou "ou" nan "dou"',
            de:'Gerundete Lippen — wie "u" in "Buch"',
            ru:'Округлённые губы — как "у" в "ул"',
            zh:'嘴唇圆形 — 像"乌"音',
            ja:'唇を丸める — 「ウ」の音'
          }
        },
        {
          char:'eu', example:'bleu',
          tip:{
            fr:'Lèvres arrondies, son entre "é" et "o"',
            en:'Round lips, sound between "e" and "o"',
            es:'Labios redondeados, sonido entre "e" y "o"',
            ht:'Bouch won, son ant "é" ak "o"',
            de:'Gerundete Lippen, Laut zwischen "e" und "o"',
            ru:'Округлённые губы, звук между "э" и "о"',
            zh:'唇圆，介于"e"和"o"之间的音',
            ja:'唇を丸め、「エ」と「オ」の中間音'
          }
        },
        {
          char:'on', example:'bon',
          tip:{
            fr:'Nasale — air passe par le nez, bouche ouverte',
            en:'Nasal — air passes through the nose, mouth open',
            es:'Nasal — el aire pasa por la nariz, boca abierta',
            ht:'Nazal — lè pase nan nen, bouch ouvè',
            de:'Nasal — Luft durch die Nase, Mund geöffnet',
            ru:'Носовой — воздух через нос, рот открыт',
            zh:'鼻音 — 气流经过鼻腔，嘴巴张开',
            ja:'鼻音 — 空気が鼻を通る、口は開ける'
          }
        },
        {
          char:'in', example:'vin',
          tip:{
            fr:'Nasale — comme "on" mais plus fermé, lèvres étirées',
            en:'Nasal — like "on" but more closed, lips stretched',
            es:'Nasal — como "on" pero más cerrado, labios estirados',
            ht:'Nazal — tankou "on" men pi fèmen, lèv yo tire',
            de:'Nasal — wie "on" aber geschlossener, Lippen gedehnt',
            ru:'Носовой — как "он" но более закрытый, губы растянуты',
            zh:'鼻音 — 像"on"但更闭，嘴唇拉伸',
            ja:'鼻音 — 「オン」に似るが、唇を横に引く'
          }
        },
        {
          char:'r', example:'rue',
          tip:{
            fr:'Vibration au fond de la gorge — pas le "r" roulé',
            en:'Vibration at the back of the throat — not a rolled "r"',
            es:'Vibración en el fondo de la garganta — no la "r" rodada',
            ht:'Vibrasyon nan fon gòj la — pa "r" woule',
            de:'Vibration im hinteren Rachen — kein gerolltes "r"',
            ru:'Вибрация в горле — не раскатистое "р"',
            zh:'喉部振动 — 不是弹舌音',
            ja:'喉の奥で振動させる — 巻き舌ではない'
          }
        }
      ],
      words: [
        { w:'bonjour',       tr:'BON-jur',      meaning:{ fr:'bonjour',        en:'hello',          es:'hola',          ht:'bonjou',        de:'Hallo',          ru:'привет',       zh:'你好',   ja:'こんにちは' } },
        { w:'merci',         tr:'mer-SI',        meaning:{ fr:'merci',          en:'thank you',      es:'gracias',       ht:'mèsi',          de:'danke',          ru:'спасибо',      zh:'谢谢',   ja:'ありがとう' } },
        { w:'oui',           tr:'wi',            meaning:{ fr:'oui',            en:'yes',            es:'sí',            ht:'wi',            de:'ja',             ru:'да',           zh:'是',     ja:'はい' } },
        { w:'non',           tr:'non',           meaning:{ fr:'non',            en:'no',             es:'no',            ht:'non',           de:'nein',           ru:'нет',          zh:'不',     ja:'いいえ' } },
        { w:"s'il vous plaît", tr:'sil-vu-PLE', meaning:{ fr:"s'il vous plaît", en:'please',         es:'por favor',     ht:'tanpri',        de:'bitte',          ru:'пожалуйста',   zh:'请',     ja:'お願いします' } },
        { w:'je',            tr:'jeu',           meaning:{ fr:'je',             en:'I',              es:'yo',            ht:'mwen',          de:'ich',            ru:'я',            zh:'我',     ja:'私' } },
        { w:'tu',            tr:'tu',            meaning:{ fr:'tu',             en:'you',            es:'tú',            ht:'ou',            de:'du',             ru:'ты',           zh:'你',     ja:'あなた' } },
        { w:"c'est",         tr:'sey',           meaning:{ fr:"c'est",          en:'it is / this is', es:'es / esto es', ht:"se",            de:'das ist',        ru:'это',          zh:'这是',   ja:'これは〜です' } },
        { w:'avoir',         tr:'a-VWAR',        meaning:{ fr:'avoir',          en:'to have',        es:'tener',         ht:'genyen',        de:'haben',          ru:'иметь',        zh:'有',     ja:'持つ' } },
        { w:'être',          tr:'EY-tr',         meaning:{ fr:'être',           en:'to be',          es:'ser/estar',     ht:'ye/être',       de:'sein',           ru:'быть',         zh:'是',     ja:'である' } }
      ],
      structure: {
        pattern:{ fr:'Sujet + Verbe + Complément', en:'Subject + Verb + Object', es:'Sujeto + Verbo + Objeto', ht:'Sijè + Vèb + Konpleman', de:'Subjekt + Verb + Objekt', ru:'Подлежащее + Сказуемое + Дополнение', zh:'主语+动词+宾语', ja:'主語＋動詞＋補語' },
        example:'Je mange une pomme',
        breakdown:[
          { tl:'Je',        nl:{ fr:'je', en:'I', es:'yo', ht:'mwen', de:'ich', ru:'я', zh:'我', ja:'私' } },
          { tl:'mange',     nl:{ fr:'mange', en:'eat', es:'como', ht:'manje', de:'esse', ru:'ем', zh:'吃', ja:'食べる' } },
          { tl:'une pomme', nl:{ fr:'une pomme', en:'an apple', es:'una manzana', ht:'yon pòm', de:'einen Apfel', ru:'яблоко', zh:'一个苹果', ja:'りんごを' } }
        ]
      }
    },

    en: {
      sounds: [
        {
          char:'th', example:'the',
          tip:{
            fr:'Langue entre les dents — ni "d" ni "z"',
            en:'Tongue between teeth — not "d" or "z"',
            es:'Lengua entre los dientes — ni "d" ni "s"',
            ht:'Lang ant dan yo — pa "d" ni "z"',
            de:'Zunge zwischen den Zähnen — nicht "d" oder "s"',
            ru:'Язык между зубами — не "д" и не "з"',
            zh:'舌头放在牙齿之间 — 不是"d"也不是"z"',
            ja:'舌を歯の間に — 「d」でも「z」でもない'
          }
        },
        {
          char:'w', example:'water',
          tip:{
            fr:'Lèvres très arrondies — pas un "v"',
            en:'Very round lips — not a "v"',
            es:'Labios muy redondeados — no es "v"',
            ht:'Bouch tre won — pa "v"',
            de:'Sehr gerundete Lippen — kein "v"',
            ru:'Очень округлённые губы — не "в"',
            zh:'嘴唇非常圆 — 不是"v"音',
            ja:'唇を強く丸める — 「v」ではない'
          }
        },
        {
          char:'r', example:'red',
          tip:{
            fr:'Langue vers le haut sans toucher le palais',
            en:'Tongue up without touching the palate',
            es:'Lengua hacia arriba sin tocar el paladar',
            ht:'Lang anlè san touche palè a',
            de:'Zunge oben ohne den Gaumen zu berühren',
            ru:'Язык вверх, не касаясь нёба',
            zh:'舌头上抬但不碰腭部',
            ja:'舌を上げるが口蓋に触れない'
          }
        },
        {
          char:'æ', example:'cat',
          tip:{
            fr:'Entre "a" et "e" ouvert — bouche bien ouverte',
            en:'Between "a" and open "e" — mouth wide open',
            es:'Entre "a" y "e" abierta — boca bien abierta',
            ht:'Ant "a" ak "e" ouvè — bouch bien ouvè',
            de:'Zwischen "a" und offenem "e" — Mund weit offen',
            ru:'Между "а" и открытым "э" — рот широко открыт',
            zh:'介于"a"和开口"e"之间 — 嘴巴张大',
            ja:'「ア」と開口「エ」の中間 — 口を大きく開ける'
          }
        }
      ],
      words: [
        { w:'hello',     tr:'he-LO',    meaning:{ fr:'bonjour', en:'hello', es:'hola', ht:'bonjou', de:'Hallo', ru:'привет', zh:'你好', ja:'こんにちは' } },
        { w:'thank you', tr:'THANK-yu', meaning:{ fr:'merci', en:'thank you', es:'gracias', ht:'mèsi', de:'danke', ru:'спасибо', zh:'谢谢', ja:'ありがとう' } },
        { w:'yes',       tr:'yes',      meaning:{ fr:'oui', en:'yes', es:'sí', ht:'wi', de:'ja', ru:'да', zh:'是', ja:'はい' } },
        { w:'no',        tr:'no',       meaning:{ fr:'non', en:'no', es:'no', ht:'non', de:'nein', ru:'нет', zh:'不', ja:'いいえ' } },
        { w:'please',    tr:'PLIZ',     meaning:{ fr:"s'il vous plaît", en:'please', es:'por favor', ht:'tanpri', de:'bitte', ru:'пожалуйста', zh:'请', ja:'お願いします' } },
        { w:'I',         tr:'ay',       meaning:{ fr:'je', en:'I', es:'yo', ht:'mwen', de:'ich', ru:'я', zh:'我', ja:'私' } },
        { w:'you',       tr:'yu',       meaning:{ fr:'tu/vous', en:'you', es:'tú/usted', ht:'ou/nou', de:'du/Sie', ru:'ты/вы', zh:'你', ja:'あなた' } },
        { w:'it is',     tr:'it IZ',    meaning:{ fr:"c'est", en:'it is', es:'es/está', ht:'se', de:'das ist', ru:'это', zh:'这是', ja:'それは〜です' } },
        { w:'have',      tr:'hav',      meaning:{ fr:'avoir', en:'have', es:'tener', ht:'genyen', de:'haben', ru:'иметь', zh:'有', ja:'持つ' } },
        { w:'be',        tr:'bi',       meaning:{ fr:'être', en:'be', es:'ser/estar', ht:'ye/être', de:'sein', ru:'быть', zh:'是', ja:'である' } }
      ],
      structure: {
        pattern:{ fr:'Sujet + Verbe + Complément', en:'Subject + Verb + Object', es:'Sujeto + Verbo + Objeto', ht:'Sijè + Vèb + Konpleman', de:'Subjekt + Verb + Objekt', ru:'Подлежащее + Сказуемое + Дополнение', zh:'主语+动词+宾语', ja:'主語＋動詞＋目的語' },
        example:'I eat an apple',
        breakdown:[
          { tl:'I',        nl:{ fr:'je', en:'I', es:'yo', ht:'mwen', de:'ich', ru:'я', zh:'我', ja:'私' } },
          { tl:'eat',      nl:{ fr:'mange', en:'eat', es:'como', ht:'manje', de:'esse', ru:'ем', zh:'吃', ja:'食べる' } },
          { tl:'an apple', nl:{ fr:'une pomme', en:'an apple', es:'una manzana', ht:'yon pòm', de:'einen Apfel', ru:'яблоко', zh:'一个苹果', ja:'りんごを' } }
        ]
      }
    },

    es: {
      sounds: [
        {
          char:'rr', example:'perro',
          tip:{
            fr:'Roulement fort de la langue contre le palais',
            en:'Strong rolling of the tongue against the palate',
            es:'Vibración fuerte de la lengua contra el paladar',
            ht:'Woule lang fò kont palè a',
            de:'Starkes Rollen der Zunge gegen den Gaumen',
            ru:'Сильное раскатывание языка о нёбо',
            zh:'舌头用力抵住上颚颤动',
            ja:'舌を口蓋に強く押し当てて振動'
          }
        },
        {
          char:'ñ', example:'niño',
          tip:{
            fr:'Comme "gn" en français (agneau)',
            en:'Like "ny" in "canyon"',
            es:'Como "ñ" — suena como "ny"',
            ht:'Tankou "ny" — menm jan ak "gnon" an fransè',
            de:'Wie "nj" ausgesprochen',
            ru:'Как "нь" в русском',
            zh:'像"ny"的发音',
            ja:'「ニャ」行の音'
          }
        },
        {
          char:'j', example:'jugo',
          tip:{
            fr:'Comme "h" fort venant du fond de la gorge',
            en:'Like a strong "h" from the back of the throat',
            es:'Como "j" — viene del fondo de la garganta',
            ht:'Tankou "h" fò ki soti nan fon gòj la',
            de:'Wie ein starkes "ch" aus dem Rachen',
            ru:'Как сильное "х" из горла',
            zh:'类似喉音"h"，来自喉咙深处',
            ja:'喉の奥から出す強い「ハ」行の音'
          }
        },
        {
          char:'ll', example:'llama',
          tip:{
            fr:'Comme "y" en créole ou "ll" selon le pays',
            en:'Like "y" in "yes" (Latin America)',
            es:'Como "y" en la mayoría de países',
            ht:'Tankou "y" nan kreyòl',
            de:'Wie "j" in "ja"',
            ru:'Как "й" в русском',
            zh:'类似英语的"y"音',
            ja:'「ヤ」行の音（中南米）'
          }
        }
      ],
      words: [
        { w:'hola',      tr:'O-la',       meaning:{ fr:'bonjour', en:'hello', es:'hola', ht:'bonjou', de:'Hallo', ru:'привет', zh:'你好', ja:'こんにちは' } },
        { w:'gracias',   tr:'GRA-syas',   meaning:{ fr:'merci', en:'thank you', es:'gracias', ht:'mèsi', de:'danke', ru:'спасибо', zh:'谢谢', ja:'ありがとう' } },
        { w:'sí',        tr:'si',         meaning:{ fr:'oui', en:'yes', es:'sí', ht:'wi', de:'ja', ru:'да', zh:'是', ja:'はい' } },
        { w:'no',        tr:'no',         meaning:{ fr:'non', en:'no', es:'no', ht:'non', de:'nein', ru:'нет', zh:'不', ja:'いいえ' } },
        { w:'por favor', tr:'por-fa-VOR', meaning:{ fr:"s'il vous plaît", en:'please', es:'por favor', ht:'tanpri', de:'bitte', ru:'пожалуйста', zh:'请', ja:'お願いします' } },
        { w:'yo',        tr:'yo',         meaning:{ fr:'je', en:'I', es:'yo', ht:'mwen', de:'ich', ru:'я', zh:'我', ja:'私' } },
        { w:'tú',        tr:'tu',         meaning:{ fr:'tu', en:'you', es:'tú', ht:'ou', de:'du', ru:'ты', zh:'你', ja:'あなた' } },
        { w:'es',        tr:'es',         meaning:{ fr:"c'est / il est", en:'is / it is', es:'es', ht:'se/li ye', de:'ist / das ist', ru:'есть / это', zh:'是', ja:'〜です' } },
        { w:'tener',     tr:'te-NER',     meaning:{ fr:'avoir', en:'to have', es:'tener', ht:'genyen', de:'haben', ru:'иметь', zh:'有', ja:'持つ' } },
        { w:'ser',       tr:'ser',        meaning:{ fr:'être', en:'to be', es:'ser', ht:'ye', de:'sein', ru:'быть', zh:'是', ja:'である' } }
      ],
      structure: {
        pattern:{ fr:'Sujet + Verbe + Complément', en:'Subject + Verb + Object', es:'Sujeto + Verbo + Objeto', ht:'Sijè + Vèb + Konpleman', de:'Subjekt + Verb + Objekt', ru:'Подлежащее + Сказуемое + Дополнение', zh:'主语+动词+宾语', ja:'主語＋動詞＋目的語' },
        example:'Yo como una manzana',
        breakdown:[
          { tl:'Yo',          nl:{ fr:'je', en:'I', es:'yo', ht:'mwen', de:'ich', ru:'я', zh:'我', ja:'私' } },
          { tl:'como',        nl:{ fr:'mange', en:'eat', es:'como', ht:'manje', de:'esse', ru:'ем', zh:'吃', ja:'食べる' } },
          { tl:'una manzana', nl:{ fr:'une pomme', en:'an apple', es:'una manzana', ht:'yon pòm', de:'einen Apfel', ru:'яблоко', zh:'一个苹果', ja:'りんごを' } }
        ]
      }
    },

    de: {
      sounds: [
        {
          char:'ch', example:'machen',
          tip:{
            fr:'Comme "h" aspiré du fond de la gorge',
            en:'Like a raspy "h" from the back of the throat',
            es:'Como una "j" suave de la garganta',
            ht:'Tankou "h" ki soti nan gòj la',
            de:'Reibelaut am hinteren Gaumen',
            ru:'Как "х" но мягче, из горла',
            zh:'类似喉擦音，来自喉咙后部',
            ja:'喉の奥から出す摩擦音'
          }
        },
        {
          char:'ü', example:'über',
          tip:{
            fr:'Lèvres rondes comme "ou" mais prononce "i"',
            en:'Round lips like "oo" but say "ee"',
            es:'Labios como "u" pero pronuncia "i"',
            ht:'Bouch won tankou "ou" men di "i"',
            de:'Lippen runden wie "u", aber "i" sprechen',
            ru:'Губы как для "у", но произносим "и"',
            zh:'嘴唇圆如"u"，但发"i"的音',
            ja:'唇を「ウ」の形にして「イ」と言う'
          }
        },
        {
          char:'ö', example:'schön',
          tip:{
            fr:'Lèvres rondes comme "ou" mais prononce "e"',
            en:'Round lips like "oo" but say "e"',
            es:'Labios como "u" pero pronuncia "e"',
            ht:'Bouch won tankou "ou" men di "e"',
            de:'Lippen runden wie "u", aber "e" sprechen',
            ru:'Губы как для "у", но произносим "э"',
            zh:'嘴唇圆如"u"，但发"e"的音',
            ja:'唇を「ウ」の形にして「エ」と言う'
          }
        },
        {
          char:'ß', example:'Straße',
          tip:{
            fr:'Comme "ss" double — lettre spéciale allemande',
            en:'Like a double "ss" — special German letter',
            es:'Como "ss" doble — letra especial alemana',
            ht:'Tankou "ss" double — lèt espesyal alman',
            de:'Langes scharfes S — wie Doppel-s',
            ru:'Как двойное "сс" — особая немецкая буква',
            zh:'类似双"ss" — 德语特殊字母',
            ja:'「ss」の長音 — ドイツ語特有の文字'
          }
        }
      ],
      words: [
        { w:'hallo',  tr:'HA-lo',  meaning:{ fr:'bonjour', en:'hello', es:'hola', ht:'bonjou', de:'Hallo', ru:'привет', zh:'你好', ja:'こんにちは' } },
        { w:'danke',  tr:'DAN-ke', meaning:{ fr:'merci', en:'thank you', es:'gracias', ht:'mèsi', de:'danke', ru:'спасибо', zh:'谢谢', ja:'ありがとう' } },
        { w:'ja',     tr:'ya',     meaning:{ fr:'oui', en:'yes', es:'sí', ht:'wi', de:'ja', ru:'да', zh:'是', ja:'はい' } },
        { w:'nein',   tr:'nayn',   meaning:{ fr:'non', en:'no', es:'no', ht:'non', de:'nein', ru:'нет', zh:'不', ja:'いいえ' } },
        { w:'bitte',  tr:'BI-te',  meaning:{ fr:"s'il vous plaît / de rien", en:'please / you\'re welcome', es:'por favor / de nada', ht:'tanpri / padkwa', de:'bitte', ru:'пожалуйста', zh:'请 / 不客气', ja:'どうぞ / どういたしまして' } },
        { w:'ich',    tr:'ikh',    meaning:{ fr:'je', en:'I', es:'yo', ht:'mwen', de:'ich', ru:'я', zh:'我', ja:'私' } },
        { w:'du',     tr:'du',     meaning:{ fr:'tu', en:'you', es:'tú', ht:'ou', de:'du', ru:'ты', zh:'你', ja:'あなた' } },
        { w:'es ist', tr:'es IST', meaning:{ fr:"c'est", en:'it is', es:'es / está', ht:'se', de:'es ist', ru:'это', zh:'这是', ja:'それは〜です' } },
        { w:'haben',  tr:'HA-ben', meaning:{ fr:'avoir', en:'to have', es:'tener', ht:'genyen', de:'haben', ru:'иметь', zh:'有', ja:'持つ' } },
        { w:'sein',   tr:'zayn',   meaning:{ fr:'être', en:'to be', es:'ser/estar', ht:'ye', de:'sein', ru:'быть', zh:'是', ja:'である' } }
      ],
      structure: {
        pattern:{ fr:'Sujet + Verbe + Complément', en:'Subject + Verb + Object', es:'Sujeto + Verbo + Objeto', ht:'Sijè + Vèb + Konpleman', de:'Subjekt + Verb + Objekt', ru:'Подлежащее + Сказуемое + Дополнение', zh:'主语+动词+宾语', ja:'主語＋動詞＋目的語' },
        example:'Ich esse einen Apfel',
        breakdown:[
          { tl:'Ich',         nl:{ fr:'je', en:'I', es:'yo', ht:'mwen', de:'ich', ru:'я', zh:'我', ja:'私' } },
          { tl:'esse',        nl:{ fr:'mange', en:'eat', es:'como', ht:'manje', de:'esse', ru:'ем', zh:'吃', ja:'食べる' } },
          { tl:'einen Apfel', nl:{ fr:'une pomme', en:'an apple', es:'una manzana', ht:'yon pòm', de:'einen Apfel', ru:'яблоко', zh:'一个苹果', ja:'りんごを' } }
        ]
      }
    },

    ru: {
      sounds: [
        {
          char:'р', example:'рот',
          tip:{
            fr:'R roulé — langue vibre contre le palais',
            en:'Rolled R — tongue vibrates against the palate',
            es:'R vibrante — la lengua vibra contra el paladar',
            ht:'R woule — lang vibre kont palè a',
            de:'Gerolltes R — Zunge vibriert gegen den Gaumen',
            ru:'Раскатистый Р — язык вибрирует у нёба',
            zh:'弹舌音 — 舌头在口腔上颚颤动',
            ja:'巻き舌 — 舌が口蓋で振動する'
          }
        },
        {
          char:'ы', example:'ты',
          tip:{
            fr:'Son mixte entre "i" et "ou" — très difficile',
            en:'Mixed sound between "i" and "u" — very difficult',
            es:'Sonido mixto entre "i" y "u" — muy difícil',
            ht:'Son melanje ant "i" ak "ou" — trè difisil',
            de:'Gemischter Laut zwischen "i" und "u" — sehr schwierig',
            ru:'Звук "ы" — произноси "и" отодвинув язык назад',
            zh:'类似"i"和"u"的混合音 — 非常难',
            ja:'「イ」と「ウ」の中間音 — 非常に難しい'
          }
        },
        {
          char:'х', example:'хлеб',
          tip:{
            fr:'Comme "j" espagnol — frottement dans la gorge',
            en:'Like Spanish "j" — friction in the throat',
            es:'Como la "j" española — fricción en la garganta',
            ht:'Tankou "j" panyòl — friktyon nan gòj la',
            de:'Wie deutsches "ch" — Reibelaut im Rachen',
            ru:'Задненёбный Х — как немецкое "ch"',
            zh:'类似西班牙语的"j" — 喉部摩擦音',
            ja:'スペイン語の「j」に似た喉の摩擦音'
          }
        },
        {
          char:'ж', example:'жить',
          tip:{
            fr:'Comme "j" français mais plus fort et dur',
            en:'Like French "j" but harder and stronger',
            es:'Como la "y" argentina pero más fuerte',
            ht:'Tankou "j" fransè men pi fò',
            de:'Wie französisches "j" aber härter',
            ru:'Твёрдый Ж — как "ш" но звонкий',
            zh:'类似法语的"j"但更硬',
            ja:'フランス語の「ジュ」に似るが硬い音'
          }
        }
      ],
      words: [
        { w:'привет',     tr:'pri-VYET',     meaning:{ fr:'bonjour / salut', en:'hello / hi', es:'hola', ht:'bonjou', de:'Hallo', ru:'привет', zh:'你好', ja:'こんにちは' } },
        { w:'спасибо',    tr:'spa-SI-ba',    meaning:{ fr:'merci', en:'thank you', es:'gracias', ht:'mèsi', de:'danke', ru:'спасибо', zh:'谢谢', ja:'ありがとう' } },
        { w:'да',         tr:'da',           meaning:{ fr:'oui', en:'yes', es:'sí', ht:'wi', de:'ja', ru:'да', zh:'是', ja:'はい' } },
        { w:'нет',        tr:'nyet',         meaning:{ fr:'non', en:'no', es:'no', ht:'non', de:'nein', ru:'нет', zh:'不', ja:'いいえ' } },
        { w:'пожалуйста', tr:'pa-ZHA-lusta', meaning:{ fr:"s'il vous plaît / de rien", en:'please / you\'re welcome', es:'por favor / de nada', ht:'tanpri / padkwa', de:'bitte / gern geschehen', ru:'пожалуйста', zh:'请 / 不客气', ja:'どうぞ / どういたしまして' } },
        { w:'я',          tr:'ya',           meaning:{ fr:'je', en:'I', es:'yo', ht:'mwen', de:'ich', ru:'я', zh:'我', ja:'私' } },
        { w:'ты',         tr:'ty',           meaning:{ fr:'tu', en:'you', es:'tú', ht:'ou', de:'du', ru:'ты', zh:'你', ja:'あなた' } },
        { w:'это',        tr:'EH-ta',        meaning:{ fr:"c'est / ceci", en:'this is / it is', es:'esto es / es', ht:'sa a se', de:'das ist / dies', ru:'это', zh:'这是', ja:'これは〜です' } },
        { w:'иметь',      tr:'i-MYET',       meaning:{ fr:'avoir', en:'to have', es:'tener', ht:'genyen', de:'haben', ru:'иметь', zh:'有', ja:'持つ' } },
        { w:'быть',       tr:'byt',          meaning:{ fr:'être', en:'to be', es:'ser/estar', ht:'ye', de:'sein', ru:'быть', zh:'是', ja:'である' } }
      ],
      structure: {
        pattern:{ fr:'Sujet + Verbe + Complément', en:'Subject + Verb + Object', es:'Sujeto + Verbo + Objeto', ht:'Sijè + Vèb + Konpleman', de:'Subjekt + Verb + Objekt', ru:'Подлежащее + Сказуемое + Дополнение', zh:'主语+动词+宾语', ja:'主語＋動詞＋目的語' },
        example:'Я ем яблоко',
        breakdown:[
          { tl:'Я',      nl:{ fr:'je', en:'I', es:'yo', ht:'mwen', de:'ich', ru:'я', zh:'我', ja:'私' } },
          { tl:'ем',     nl:{ fr:'mange', en:'eat', es:'como', ht:'manje', de:'esse', ru:'ем', zh:'吃', ja:'食べる' } },
          { tl:'яблоко', nl:{ fr:'une pomme', en:'an apple', es:'una manzana', ht:'yon pòm', de:'einen Apfel', ru:'яблоко', zh:'一个苹果', ja:'りんごを' } }
        ]
      }
    },

    zh: {
      sounds: [
        {
          char:'zh', example:'中',
          tip:{
            fr:'Comme "dj" avec la langue recourbée vers le haut',
            en:'Like "j" but tongue curled upward',
            es:'Como "ch" pero con la lengua curvada arriba',
            ht:'Tankou "dj" ak lang koube anlè',
            de:'Wie "dsch" mit nach oben gebogener Zunge',
            ru:'Как "дж" с языком загнутым вверх',
            zh:'卷舌音，舌尖上翘发"zh"',
            ja:'舌を上に丸めて「ジ」に近い音'
          }
        },
        {
          char:'x', example:'小',
          tip:{
            fr:'Comme "sh" mais lèvres étirées, pas arrondies',
            en:'Like "sh" but lips stretched, not rounded',
            es:'Como "sh" pero labios estirados',
            ht:'Tankou "sh" men lèv yo tire',
            de:'Wie "sch" aber mit gedehnten Lippen',
            ru:'Как "сь" — мягкое шипение',
            zh:'舌面前部发音，类似"西"',
            ja:'「シ」に近い音だが唇を横に引く'
          }
        },
        {
          char:'q', example:'七',
          tip:{
            fr:'Comme "tch" léger avec la langue vers le bas',
            en:'Like a light "ch" with tongue low',
            es:'Como "ch" suave con lengua baja',
            ht:'Tankou "tch" lejè ak lang anba',
            de:'Wie weiches "tsch" mit tiefer Zunge',
            ru:'Как мягкое "чь"',
            zh:'舌面音，类似轻声"七"',
            ja:'「チ」に近い音、舌を下げる'
          }
        },
        {
          char:'ü', example:'鱼',
          tip:{
            fr:'Lèvres rondes comme "ou" mais prononce "i"',
            en:'Round lips like "oo" but say "ee"',
            es:'Labios como "u" pero pronuncia "i"',
            ht:'Bouch won tankou "ou" men di "i"',
            de:'Lippen wie "u", aber "i" sagen',
            ru:'Губы как "у", произносим "и"',
            zh:'嘴唇圆，像"鱼"的发音',
            ja:'唇を「ウ」の形で「イ」と発音'
          }
        }
      ],
      words: [
        { w:'你好',  tr:'ni-HAO',   meaning:{ fr:'bonjour', en:'hello', es:'hola', ht:'bonjou', de:'Hallo', ru:'привет', zh:'你好', ja:'こんにちは' } },
        { w:'谢谢',  tr:'XIE-xie',  meaning:{ fr:'merci', en:'thank you', es:'gracias', ht:'mèsi', de:'danke', ru:'спасибо', zh:'谢谢', ja:'ありがとう' } },
        { w:'是',    tr:'shì',      meaning:{ fr:"c'est / oui (formellement)", en:'yes (formal) / is', es:'es / sí (formal)', ht:'wi/se', de:'ist / ja (formal)', ru:'да (формально) / есть', zh:'是', ja:'〜です / はい（フォーマル）' } },
        { w:'不',    tr:'bù',       meaning:{ fr:'non / pas', en:'no / not', es:'no / no es', ht:'non / pa', de:'nein / nicht', ru:'нет / не', zh:'不', ja:'いいえ / 〜ではない' } },
        { w:'请',    tr:'qǐng',     meaning:{ fr:"s'il vous plaît / veuillez", en:'please / kindly', es:'por favor', ht:'tanpri', de:'bitte', ru:'пожалуйста', zh:'请', ja:'どうぞ / お願いします' } },
        { w:'我',    tr:'wǒ',       meaning:{ fr:'je / moi', en:'I / me', es:'yo', ht:'mwen', de:'ich / mir', ru:'я / меня', zh:'我', ja:'私' } },
        { w:'你',    tr:'nǐ',       meaning:{ fr:'tu / toi', en:'you', es:'tú', ht:'ou', de:'du', ru:'ты', zh:'你', ja:'あなた' } },
        { w:'有',    tr:'yǒu',      meaning:{ fr:'avoir / il y a', en:'have / there is', es:'tener / hay', ht:'genyen / gen', de:'haben / es gibt', ru:'иметь / есть', zh:'有', ja:'持つ / 〜がある' } },
        { w:'好',    tr:'hǎo',      meaning:{ fr:'bien / bon', en:'good / well', es:'bien / bueno', ht:'bien / bon', de:'gut', ru:'хорошо / хороший', zh:'好', ja:'良い / 元気' } },
        { w:'吃',    tr:'chī',      meaning:{ fr:'manger', en:'eat', es:'comer', ht:'manje', de:'essen', ru:'есть (пищу)', zh:'吃', ja:'食べる' } }
      ],
      structure: {
        pattern:{ fr:'Sujet + Verbe + Complément', en:'Subject + Verb + Object', es:'Sujeto + Verbo + Objeto', ht:'Sijè + Vèb + Konpleman', de:'Subjekt + Verb + Objekt', ru:'Подлежащее + Сказуемое + Дополнение', zh:'主语+动词+宾语', ja:'主語＋動詞＋目的語' },
        example:'我吃苹果',
        breakdown:[
          { tl:'我',  nl:{ fr:'je', en:'I', es:'yo', ht:'mwen', de:'ich', ru:'я', zh:'我', ja:'私' } },
          { tl:'吃',  nl:{ fr:'mange', en:'eat', es:'como', ht:'manje', de:'esse', ru:'ем', zh:'吃', ja:'食べる' } },
          { tl:'苹果',nl:{ fr:'une pomme', en:'an apple', es:'una manzana', ht:'yon pòm', de:'einen Apfel', ru:'яблоко', zh:'一个苹果', ja:'りんごを' } }
        ]
      }
    },

    ja: {
      sounds: [
        {
          char:'つ', example:'tsunami',
          tip:{
            fr:'"ts" combiné très rapide — comme "tsar" en russe',
            en:'"ts" combined quickly — like "ts" in "cats"',
            es:'"ts" combinado rápido — como "tz" en alemán',
            ht:'"ts" konbine rapid — tankou "ts" nan "tsar"',
            de:'"ts" schnell kombiniert — wie "z" in "Zeit"',
            ru:'"цу" — быстрое сочетание "тс"',
            zh:'"ts"快速组合音 — 类似"初"',
            ja:'「ツ」— 「ts」の素早い組み合わせ'
          }
        },
        {
          char:'ふ', example:'futon',
          tip:{
            fr:'Entre "f" et "h" soufflé — lèvres pas serrées',
            en:'Between "f" and "h" — lips not pressed together',
            es:'Entre "f" y "h" — labios no apretados',
            ht:'Ant "f" ak "h" soufle — lèv pa sere',
            de:'Zwischen "f" und "h" — Lippen locker',
            ru:'Между "ф" и "х" — губы не плотно сжаты',
            zh:'介于"f"和"h"之间的送气音',
            ja:'「フ」— 唇を合わせず息を出す音'
          }
        },
        {
          char:'r', example:'ら行',
          tip:{
            fr:'Entre "r" et "l" — frappe rapide contre le palais',
            en:'Between "r" and "l" — quick tap on the palate',
            es:'Entre "r" y "l" — golpe rápido en el paladar',
            ht:'Ant "r" ak "l" — kou rapid kont palè a',
            de:'Zwischen "r" und "l" — schneller Zungenspitzenschlag',
            ru:'Между "р" и "л" — быстрый удар языка',
            zh:'介于"r"和"l"之间，舌尖轻弹上腭',
            ja:'「ラ行」— 「r」と「l」の中間、舌先を素早く弾く'
          }
        }
      ],
      words: [
        { w:'こんにちは', tr:'kon-ni-CHI-wa', meaning:{ fr:'bonjour', en:'hello', es:'hola', ht:'bonjou', de:'Hallo', ru:'привет', zh:'你好', ja:'こんにちは' } },
        { w:'ありがとう', tr:'a-ri-ga-TO',    meaning:{ fr:'merci', en:'thank you', es:'gracias', ht:'mèsi', de:'danke', ru:'спасибо', zh:'谢谢', ja:'ありがとう' } },
        { w:'はい',      tr:'hai',           meaning:{ fr:'oui', en:'yes', es:'sí', ht:'wi', de:'ja', ru:'да', zh:'是', ja:'はい' } },
        { w:'いいえ',    tr:'i-i-e',         meaning:{ fr:'non', en:'no', es:'no', ht:'non', de:'nein', ru:'нет', zh:'不', ja:'いいえ' } },
        { w:'ください',  tr:'ku-da-SAI',     meaning:{ fr:"s'il vous plaît", en:'please (give me)', es:'por favor (dame)', ht:'tanpri (ban mwen)', de:'bitte (geben Sie)', ru:'пожалуйста (дайте)', zh:'请给我', ja:'〜をください' } },
        { w:'私',        tr:'wa-ta-SHI',     meaning:{ fr:'je / moi', en:'I / me', es:'yo', ht:'mwen', de:'ich', ru:'я', zh:'我', ja:'私' } },
        { w:'あなた',    tr:'a-na-TA',       meaning:{ fr:'tu / vous', en:'you', es:'tú / usted', ht:'ou', de:'du / Sie', ru:'ты / вы', zh:'你', ja:'あなた' } },
        { w:'です',      tr:'des',           meaning:{ fr:"c'est / je suis", en:'is / am / are', es:'es / soy', ht:'se / mwen ye', de:'ist / bin / sind', ru:'есть / являюсь', zh:'是', ja:'〜です' } },
        { w:'ある',      tr:'a-ru',          meaning:{ fr:'exister / avoir (chose)', en:'to exist / have (thing)', es:'existir / haber (cosa)', ht:'genyen (bagay)', de:'geben / haben (Sache)', ru:'быть / иметь (вещь)', zh:'有（事物）/ 存在', ja:'ある（物の存在）' } },
        { w:'わかった',  tr:'wa-KA-ta',      meaning:{ fr:"j'ai compris / d'accord", en:'I understood / okay', es:'entendí / de acuerdo', ht:'mwen konprann / dakò', de:'ich habe verstanden / okay', ru:'понял / хорошо', zh:'明白了 / 好的', ja:'わかった / 了解' } }
      ],
      structure: {
        pattern:{ fr:'Sujet + Complément + Verbe (en fin)', en:'Subject + Object + Verb (at end)', es:'Sujeto + Objeto + Verbo (al final)', ht:'Sijè + Konpleman + Vèb (nan fen)', de:'Subjekt + Objekt + Verb (am Ende)', ru:'Подлежащее + Дополнение + Сказуемое (в конце)', zh:'主语+宾语+动词（在最后）', ja:'主語＋目的語＋動詞（文末）' },
        example:'私はりんごを食べます',
        breakdown:[
          { tl:'私は',    nl:{ fr:'je', en:'I', es:'yo', ht:'mwen', de:'ich', ru:'я', zh:'我', ja:'私は' } },
          { tl:'りんごを', nl:{ fr:'une pomme', en:'an apple', es:'una manzana', ht:'yon pòm', de:'einen Apfel', ru:'яблоко', zh:'一个苹果', ja:'りんごを' } },
          { tl:'食べます', nl:{ fr:'mange', en:'eat', es:'como', ht:'manje', de:'esse', ru:'ем', zh:'吃', ja:'食べます' } }
        ]
      }
    },

    ht: {
      sounds: [
        {
          char:'ou', example:'ou',
          tip:{
            fr:'Comme "ou" en français — facile',
            en:'Like "oo" in "moon" — easy',
            es:'Como "u" en español — fácil',
            ht:'Tankou "ou" an fransè — fasil',
            de:'Wie "u" in "gut" — einfach',
            ru:'Как "у" в "луна" — просто',
            zh:'像"u"音 — 简单',
            ja:'「ウ」の音 — 簡単'
          }
        },
        {
          char:'an', example:'manje',
          tip:{
            fr:'Nasale — comme "an" dans "manger"',
            en:'Nasal — like "an" in French "manger"',
            es:'Nasal — como "an" en francés',
            ht:'Nazal — tankou "an" nan fransè',
            de:'Nasal — wie "an" im Französischen',
            ru:'Носовой — как "ан" во французском',
            zh:'鼻音 — 类似法语的"an"',
            ja:'鼻音 — フランス語の「アン」に似る'
          }
        },
        {
          char:'ch', example:'chèlbè',
          tip:{
            fr:'Comme "sh" anglais — pas "tch"',
            en:'Like "sh" in "shop" — not "tch"',
            es:'Como "sh" inglés — no "tch"',
            ht:'Tankou "sh" anglè — pa "tch"',
            de:'Wie englisches "sh" — nicht "tsch"',
            ru:'Как "ш" в английском — не "чт"',
            zh:'像英语的"sh" — 不是"tch"',
            ja:'英語の「sh」のような音 — 「チ」ではない'
          }
        }
      ],
      words: [
        { w:'bonjou',  tr:'bon-JU',   meaning:{ fr:'bonjour', en:'hello', es:'hola', ht:'bonjou', de:'Hallo', ru:'привет', zh:'你好', ja:'こんにちは' } },
        { w:'mèsi',    tr:'mè-SI',    meaning:{ fr:'merci', en:'thank you', es:'gracias', ht:'mèsi', de:'danke', ru:'спасибо', zh:'谢谢', ja:'ありがとう' } },
        { w:'wi',      tr:'wi',       meaning:{ fr:'oui', en:'yes', es:'sí', ht:'wi', de:'ja', ru:'да', zh:'是', ja:'はい' } },
        { w:'non',     tr:'non',      meaning:{ fr:'non', en:'no', es:'no', ht:'non', de:'nein', ru:'нет', zh:'不', ja:'いいえ' } },
        { w:'tanpri',  tr:'tan-PRI',  meaning:{ fr:"s'il vous plaît", en:'please', es:'por favor', ht:'tanpri', de:'bitte', ru:'пожалуйста', zh:'请', ja:'お願いします' } },
        { w:'mwen',    tr:'mwen',     meaning:{ fr:'je / moi', en:'I / me', es:'yo', ht:'mwen', de:'ich', ru:'я', zh:'我', ja:'私' } },
        { w:'ou',      tr:'u',        meaning:{ fr:'tu / toi', en:'you', es:'tú', ht:'ou', de:'du', ru:'ты', zh:'你', ja:'あなた' } },
        { w:'se',      tr:'se',       meaning:{ fr:"c'est / il/elle est", en:'it is / that is', es:'es / eso es', ht:'se', de:'das ist / er/sie ist', ru:'это / он/она', zh:'这是 / 他/她是', ja:'〜です / それは〜' } },
        { w:'genyen',  tr:'gen-YEN',  meaning:{ fr:'avoir / il y a', en:'have / there is', es:'tener / hay', ht:'genyen', de:'haben / es gibt', ru:'иметь / есть', zh:'有 / 存在', ja:'持つ / 〜がある' } },
        { w:'ale',     tr:'a-LE',     meaning:{ fr:'aller', en:'to go', es:'ir', ht:'ale', de:'gehen', ru:'идти', zh:'去', ja:'行く' } }
      ],
      structure: {
        pattern:{ fr:'Sujet + Verbe + Complément', en:'Subject + Verb + Object', es:'Sujeto + Verbo + Objeto', ht:'Sijè + Vèb + Konpleman', de:'Subjekt + Verb + Objekt', ru:'Подлежащее + Сказуемое + Дополнение', zh:'主语+动词+宾语', ja:'主語＋動詞＋目的語' },
        example:'Mwen manje yon pòm',
        breakdown:[
          { tl:'Mwen',    nl:{ fr:'je', en:'I', es:'yo', ht:'mwen', de:'ich', ru:'я', zh:'我', ja:'私' } },
          { tl:'manje',   nl:{ fr:'mange', en:'eat', es:'como', ht:'manje', de:'esse', ru:'ем', zh:'吃', ja:'食べる' } },
          { tl:'yon pòm', nl:{ fr:'une pomme', en:'an apple', es:'una manzana', ht:'yon pòm', de:'einen Apfel', ru:'яблоко', zh:'一个苹果', ja:'りんごを' } }
        ]
      }
    }
  };

  // ================================================================
  // ÉTAT
  // ================================================================
  var currentStep = 0;
  var onDoneCallback = null;
  var selectedLevel = 'zero';
  var targetLang = 'fr';
  var nativeLang = 'fr';

  function getUI()          { return UI_TEXTS[nativeLang] || UI_TEXTS.fr; }
  function getFoundations() { return FOUNDATIONS[targetLang] || FOUNDATIONS.fr; }

  // ================================================================
  // ÉTAPE 0 — NIVEAU (boutons colorés + description)
  // ================================================================
  function renderLevel(container) {
    var ui       = getUI();
    var flag     = (window.FLAGS && window.FLAGS[targetLang]) || '';
    var langName = (window.LANG_NAMES && window.LANG_NAMES[targetLang]) || targetLang;

    container.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.style.cssText = 'width:100%;max-width:420px;text-align:center;';

    wrap.innerHTML =
      '<div style="font-size:2.8rem;margin-bottom:8px;">' + flag + '</div>'
    + '<div style="font-family:Cinzel,serif;font-size:1.35rem;color:#ffd700;margin-bottom:6px;">' + ui.levelTitle(langName) + '</div>'
    + '<div style="font-size:0.78rem;color:rgba(255,255,255,0.45);margin-bottom:24px;">' + ui.levelSub + '</div>'
    + '<div id="ob-levels" style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px;"></div>'
    + '<button id="ob-skip" style="background:none;border:none;color:rgba(255,255,255,0.28);font-size:0.72rem;text-decoration:underline;cursor:pointer;padding:8px;">' + ui.skip + '</button>';

    container.appendChild(wrap);

    var levelsDiv = document.getElementById('ob-levels');
    LEVELS.forEach(function(lv) {
      var btn = document.createElement('button');
      btn.dataset.level = lv.id;
      btn.style.cssText =
        'display:flex;align-items:center;gap:16px;padding:16px 18px;'
      + 'background:' + lv.bg + ';'
      + 'border:2px solid ' + lv.border + ';'
      + 'border-radius:16px;cursor:pointer;width:100%;text-align:left;'
      + 'transition:all 0.18s ease;-webkit-tap-highlight-color:transparent;';

      var labelText = lv.label[nativeLang] || lv.label.fr;
      var descText  = lv.desc[nativeLang]  || lv.desc.fr;

      btn.innerHTML =
        '<span style="font-size:1.8rem;flex-shrink:0;">' + lv.icon + '</span>'
      + '<div style="flex:1;">'
      + '<div style="font-weight:800;font-size:0.95rem;color:' + lv.color + ';margin-bottom:3px;">' + labelText + '</div>'
      + '<div style="font-size:0.72rem;color:rgba(255,255,255,0.55);">' + descText + '</div>'
      + '</div>'
      + '<span style="font-size:1.2rem;color:' + lv.color + ';opacity:0.6;">›</span>';

      btn.onmouseenter = function() { this.style.transform = 'translateX(4px)'; this.style.boxShadow = '0 4px 20px ' + lv.bg; };
      btn.onmouseleave = function() { this.style.transform = ''; this.style.boxShadow = ''; };
      btn.onclick = function() {
        selectedLevel = lv.id;
        if (window.S) window.S.userLevel = selectedLevel;
        if (window.LV_MEMORY) window.LV_MEMORY.set('level', selectedLevel);
        currentStep = 1;
        buildScreen(1);
      };

      levelsDiv.appendChild(btn);
    });

    document.getElementById('ob-skip').onclick = function() { finish(); };
  }

  // ================================================================
  // ÉTAPE 1 — SONS CLÉS (tip traduit)
  // ================================================================
  function renderSounds(container) {
    var ui       = getUI();
    var data     = getFoundations();
    var langName = (window.LANG_NAMES && window.LANG_NAMES[targetLang]) || targetLang;

    container.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.style.cssText = 'width:100%;max-width:420px;';

    var rows = data.sounds.map(function(s) {
      var tipText = (s.tip && (s.tip[nativeLang] || s.tip.fr)) || '';
      return '<div style="background:rgba(74,158,255,0.06);border:1px solid rgba(74,158,255,0.2);border-radius:14px;padding:14px;display:flex;align-items:center;gap:14px;">'
        + '<span style="font-family:Cinzel,serif;font-size:1.6rem;color:#4a9eff;font-weight:900;min-width:44px;text-align:center;">' + s.char + '</span>'
        + '<div style="flex:1;">'
        + '<div style="font-size:0.8rem;font-weight:700;color:#e8e0d0;margin-bottom:3px;">ex : <em>' + s.example + '</em></div>'
        + '<div style="font-size:0.72rem;color:rgba(255,255,255,0.55);line-height:1.4;">' + tipText + '</div>'
        + '</div>'
        + '<button class="ob-speak" data-word="' + s.example + '" style="background:rgba(74,158,255,0.1);border:1px solid rgba(74,158,255,0.2);color:#4a9eff;padding:6px 12px;border-radius:10px;cursor:pointer;font-size:0.8rem;flex-shrink:0;">🔊</button>'
        + '</div>';
    }).join('');

    wrap.innerHTML =
      '<div style="font-size:1.1rem;font-weight:700;color:#4a9eff;margin-bottom:4px;">' + ui.soundsTitle(langName) + '</div>'
    + '<div style="font-size:0.75rem;color:rgba(255,255,255,0.4);margin-bottom:16px;">' + ui.soundsSub + '</div>'
    + '<div style="display:flex;flex-direction:column;gap:10px;margin-bottom:22px;">' + rows + '</div>'
    + '<button id="ob-next" style="width:100%;background:linear-gradient(135deg,#a86800,#ffd700);border:none;border-radius:14px;padding:14px;font-family:Cinzel,serif;font-weight:700;font-size:0.9rem;color:#0a0a0a;cursor:pointer;">' + ui.contSounds + '</button>';

    container.appendChild(wrap);

    container.querySelectorAll('.ob-speak').forEach(function(btn) {
      btn.onclick = function(e) { e.stopPropagation(); speakWord(btn.dataset.word, targetLang); };
    });
    document.getElementById('ob-next').onclick = function() { currentStep = 2; buildScreen(2); };
  }

  // ================================================================
  // ÉTAPE 2 — 10 MOTS (traduction en langue maternelle)
  // ================================================================
  function renderWords(container) {
    var ui   = getUI();
    var data = getFoundations();

    container.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.style.cssText = 'width:100%;max-width:420px;';

    var cards = data.words.map(function(w) {
      var translation = (w.meaning && (w.meaning[nativeLang] || w.meaning.fr)) || '';
      return '<div class="ob-word" data-word="' + w.w + '" style="background:rgba(78,207,112,0.07);border:1.5px solid rgba(78,207,112,0.22);border-radius:14px;padding:12px 10px;text-align:center;cursor:pointer;transition:all 0.15s;-webkit-tap-highlight-color:transparent;">'
        + '<div style="font-size:1rem;font-weight:800;color:#4ecf70;margin-bottom:3px;">' + w.w + '</div>'
        + '<div style="font-size:0.7rem;color:#4a9eff;font-style:italic;margin-bottom:4px;">' + w.tr + '</div>'
        + '<div style="font-size:0.68rem;color:rgba(255,255,255,0.6);font-weight:600;background:rgba(255,255,255,0.06);border-radius:6px;padding:2px 6px;">' + translation + '</div>'
        + '</div>';
    }).join('');

    wrap.innerHTML =
      '<div style="font-size:1.1rem;font-weight:700;color:#4ecf70;margin-bottom:3px;">' + ui.wordsTitle + '</div>'
    + '<div style="font-size:0.75rem;color:rgba(255,255,255,0.4);margin-bottom:14px;">' + ui.wordsSub + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:22px;">' + cards + '</div>'
    + '<button id="ob-next" style="width:100%;background:linear-gradient(135deg,#a86800,#ffd700);border:none;border-radius:14px;padding:14px;font-family:Cinzel,serif;font-weight:700;font-size:0.9rem;color:#0a0a0a;cursor:pointer;">' + ui.contWords + '</button>';

    container.appendChild(wrap);

    container.querySelectorAll('.ob-word').forEach(function(el) {
      el.onmouseenter = function() { el.style.transform = 'scale(1.03)'; };
      el.onmouseleave = function() { el.style.transform = ''; };
      el.onclick      = function() { speakWord(el.dataset.word, targetLang); };
    });
    document.getElementById('ob-next').onclick = function() { currentStep = 3; buildScreen(3); };
  }

  // ================================================================
  // ÉTAPE 3 — STRUCTURE (breakdown traduit)
  // ================================================================
  function renderStructure(container) {
    var ui   = getUI();
    var data = getFoundations();

    container.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.style.cssText = 'width:100%;max-width:420px;';

    var patternText   = (data.structure.pattern && (data.structure.pattern[nativeLang] || data.structure.pattern.fr)) || '';
    var breakdownHTML = (data.structure.breakdown || []).map(function(b) {
      var nlText = (b.nl && (b.nl[nativeLang] || b.nl.fr)) || '';
      return '<span style="background:rgba(192,132,252,0.1);border:1px solid rgba(192,132,252,0.2);border-radius:8px;padding:5px 12px;font-size:0.75rem;text-align:center;">'
        + '<span style="color:#f0e8d0;font-weight:700;">' + b.tl + '</span>'
        + '<br><span style="color:rgba(255,255,255,0.45);font-size:0.65rem;">= ' + nlText + '</span>'
        + '</span>';
    }).join('');

    wrap.innerHTML =
      '<div style="font-size:1.1rem;font-weight:700;color:#c084fc;margin-bottom:14px;">' + ui.structTitle + '</div>'
    + '<div style="background:rgba(192,132,252,0.08);border:1.5px solid rgba(192,132,252,0.22);border-radius:16px;padding:18px;margin-bottom:14px;text-align:center;">'
    + '<div style="font-size:0.62rem;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#c084fc;margin-bottom:8px;">' + ui.structLabel + '</div>'
    + '<div style="font-size:0.95rem;font-weight:700;color:#e8e0d0;margin-bottom:10px;">' + patternText + '</div>'
    + '<div style="font-family:Cinzel,serif;font-size:1.1rem;color:#ffd700;margin-bottom:14px;">' + data.structure.example + '</div>'
    + '<div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;">' + breakdownHTML + '</div>'
    + '</div>'
    + '<div style="background:rgba(255,215,0,0.06);border:1px solid rgba(255,215,0,0.15);border-radius:12px;padding:12px;font-size:0.78rem;text-align:center;color:rgba(255,255,255,0.6);line-height:1.6;margin-bottom:20px;">' + ui.structTip + '</div>'
    + '<button id="ob-finish" style="width:100%;background:linear-gradient(135deg,#a86800,#ffd700);border:none;border-radius:16px;padding:16px;font-family:Cinzel,serif;font-weight:800;font-size:1rem;color:#0a0a0a;cursor:pointer;box-shadow:0 4px 24px rgba(255,215,0,0.25);">' + ui.enter + '</button>';

    container.appendChild(wrap);
    document.getElementById('ob-finish').onclick = function() { finish(); };
  }

  // ================================================================
  // ROUTER
  // ================================================================
  function buildScreen(step) {
    var container = document.getElementById('screen-onboarding');
    if (!container) {
      container = document.createElement('div');
      container.id = 'screen-onboarding';
      container.className = 'screen';
      document.body.appendChild(container);
    }
    container.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:24px 16px;background:radial-gradient(ellipse at 50% 20%,#0d1a2e 0%,#07090f 70%);overflow-y:auto;';
    container.innerHTML = '';

    if (step === 0) renderLevel(container);
    else if (step === 1) renderSounds(container);
    else if (step === 2) renderWords(container);
    else if (step === 3) renderStructure(container);
  }

  function speakWord(word, lang) {
    if ('speechSynthesis' in window) {
      var u = new SpeechSynthesisUtterance(word);
      var m = { fr:'fr-FR', en:'en-US', es:'es-ES', ht:'fr-HT', de:'de-DE', ru:'ru-RU', zh:'zh-CN', ja:'ja-JP' };
      u.lang = m[lang] || 'fr-FR';
      u.rate = 0.8;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    }
  }

  function finish() {
    var container = document.getElementById('screen-onboarding');
    if (container) container.classList.remove('active');
    if (onDoneCallback) onDoneCallback();
  }

  // ================================================================
  // API PUBLIQUE
  // ================================================================
  function show(onDone) {
    onDoneCallback = onDone;
    currentStep    = 0;
    targetLang     = (window.S && window.S.targetLang) || 'fr';
    nativeLang     = (window.S && window.S.nativeLang) || 'fr';
    buildScreen(0);
    if (typeof window.showScreen === 'function') {
      window.showScreen('screen-onboarding');
    } else {
      var sc = document.getElementById('screen-onboarding');
      if (sc) sc.classList.add('active');
    }
  }

  return { show: show };

})();

console.log('✅ onboarding.js (patched) chargé');
