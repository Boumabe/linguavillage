// LinguaVillage — onboarding.js
// Porte d'entrée zéro : niveau de l'utilisateur + parcours débutant absolu
// Indépendant — s'insère AVANT startMenu() via window.LV_ONBOARDING
// ================================================================

window.LV_ONBOARDING = (function() {

  // ── Données fondations par langue ──────────────────────────
  const FOUNDATIONS = {
    fr: {
      sounds: [
        { char:'ou', example:'bonjour', tip:'Comme "ou" en créole "ou" (toi)' },
        { char:'eu', example:'bleu',    tip:'Lèvres arrondies, son entre "é" et "o"' },
        { char:'on', example:'bon',     tip:'Nasale — air passe par le nez' },
        { char:'in', example:'vin',     tip:'Nasale — comme "en" mais plus fermé' },
        { char:'r',  example:'rue',     tip:'Gorge — vibration au fond de la gorge' },
      ],
      words: [
        { w:'bonjour', tr:'BON-jur',   meaning:'hello' },
        { w:'merci',   tr:'mer-SI',    meaning:'thank you' },
        { w:'oui',     tr:'wi',        meaning:'yes' },
        { w:'non',     tr:'non',       meaning:'no' },
        { w:'s\'il vous plaît', tr:'sil-vu-PLE', meaning:'please' },
        { w:'je',      tr:'jeu',       meaning:'I' },
        { w:'tu',      tr:'tu',        meaning:'you (informal)' },
        { w:'c\'est',  tr:'sey',       meaning:'it is' },
        { w:'avoir',   tr:'a-VWAR',    meaning:'to have' },
        { w:'être',    tr:'EY-tr',     meaning:'to be' },
      ],
      structure: {
        pattern: 'Sujet + Verbe + Complément',
        example: 'Je mange une pomme',
        breakdown: ['Je (I)', 'mange (eat)', 'une pomme (an apple)'],
      }
    },
    es: {
      sounds: [
        { char:'rr', example:'perro',   tip:'Roulement fort de la langue' },
        { char:'ñ',  example:'niño',    tip:'Comme "gn" en espagnol' },
        { char:'j',  example:'jugo',    tip:'Comme "h" fort de la gorge' },
        { char:'ll', example:'llama',   tip:'Comme "y" en créole' },
      ],
      words: [
        { w:'hola',     tr:'O-la',      meaning:'hello' },
        { w:'gracias',  tr:'GRA-syas',  meaning:'thank you' },
        { w:'sí',       tr:'si',        meaning:'yes' },
        { w:'no',       tr:'no',        meaning:'no' },
        { w:'por favor', tr:'por fa-VOR', meaning:'please' },
        { w:'yo',       tr:'yo',        meaning:'I' },
        { w:'tú',       tr:'tu',        meaning:'you' },
        { w:'es',       tr:'es',        meaning:'it is' },
        { w:'tener',    tr:'te-NYER',   meaning:'to have' },
        { w:'ser',      tr:'ser',       meaning:'to be' },
      ],
      structure: {
        pattern: 'Sujeto + Verbo + Complemento',
        example: 'Yo como una manzana',
        breakdown: ['Yo (I)', 'como (eat)', 'una manzana (an apple)'],
      }
    },
    en: {
      sounds: [
        { char:'th', example:'the',     tip:'Langue entre les dents — pas "d" ni "z"' },
        { char:'w',  example:'water',   tip:'Lèvres arrondies, pas "v"' },
        { char:'r',  example:'red',     tip:'Langue vers le haut, ne touche rien' },
        { char:'æ',  example:'cat',     tip:'Entre "a" et "e" ouvert' },
      ],
      words: [
        { w:'hello',    tr:'he-LO',     meaning:'bonjour' },
        { w:'thank you', tr:'THANK yu', meaning:'merci' },
        { w:'yes',      tr:'yes',       meaning:'oui' },
        { w:'no',       tr:'no',        meaning:'non' },
        { w:'please',   tr:'pliz',      meaning:'s\'il vous plaît' },
        { w:'I',        tr:'ay',        meaning:'je' },
        { w:'you',      tr:'yu',        meaning:'tu/vous' },
        { w:'it is',    tr:'it iz',     meaning:'c\'est' },
        { w:'have',     tr:'hav',       meaning:'avoir' },
        { w:'be',       tr:'bi',        meaning:'être' },
      ],
      structure: {
        pattern: 'Subject + Verb + Object',
        example: 'I eat an apple',
        breakdown: ['I (je)', 'eat (mange)', 'an apple (une pomme)'],
      }
    },
    de: {
      sounds: [
        { char:'ch', example:'machen',  tip:'Comme "h" aspiré du fond de la gorge' },
        { char:'ü',  example:'über',    tip:'Lèvres arrondies comme "ou", son "i"' },
        { char:'ö',  example:'schön',   tip:'Lèvres arrondies comme "ou", son "e"' },
        { char:'ß',  example:'Straße',  tip:'Comme "ss" double' },
      ],
      words: [
        { w:'hallo',      tr:'HA-lo',    meaning:'bonjour' },
        { w:'danke',      tr:'DAN-ke',   meaning:'merci' },
        { w:'ja',         tr:'ya',       meaning:'oui' },
        { w:'nein',       tr:'nayn',     meaning:'non' },
        { w:'bitte',      tr:'BI-te',    meaning:'s\'il vous plaît' },
        { w:'ich',        tr:'ikh',      meaning:'je' },
        { w:'du',         tr:'du',       meaning:'tu' },
        { w:'es ist',     tr:'es ist',   meaning:'c\'est' },
        { w:'haben',      tr:'HA-ben',   meaning:'avoir' },
        { w:'sein',       tr:'zayn',     meaning:'être' },
      ],
      structure: {
        pattern: 'Subjekt + Verb + Objekt',
        example: 'Ich esse einen Apfel',
        breakdown: ['Ich (je)', 'esse (mange)', 'einen Apfel (une pomme)'],
      }
    },
    ru: {
      sounds: [
        { char:'р',  example:'рот',     tip:'R roulé — vibre sur la langue' },
        { char:'ы',  example:'ты',      tip:'Entre "i" et "ou" — son difficile' },
        { char:'х',  example:'хлеб',   tip:'Comme "j" espagnol — gorge' },
        { char:'ж',  example:'жить',   tip:'Comme "j" français mais plus fort' },
      ],
      words: [
        { w:'привет',    tr:'pri-VYET',  meaning:'bonjour (informel)' },
        { w:'спасибо',   tr:'spa-SI-ba', meaning:'merci' },
        { w:'да',        tr:'da',        meaning:'oui' },
        { w:'нет',       tr:'nyet',      meaning:'non' },
        { w:'пожалуйста', tr:'pa-ZHA-lusta', meaning:'s\'il vous plaît' },
        { w:'я',         tr:'ya',        meaning:'je' },
        { w:'ты',        tr:'ty',        meaning:'tu' },
        { w:'это',       tr:'EH-ta',     meaning:'c\'est' },
        { w:'иметь',     tr:'i-MYET',    meaning:'avoir' },
        { w:'быть',      tr:'byt',       meaning:'être' },
      ],
      structure: {
        pattern: 'Подлежащее + Сказуемое + Дополнение',
        example: 'Я ем яблоко',
        breakdown: ['Я (je)', 'ем (mange)', 'яблоко (une pomme)'],
      }
    },
    zh: {
      sounds: [
        { char:'zh', example:'中',      tip:'Comme "dj" mais langue vers le haut' },
        { char:'x',  example:'小',      tip:'Comme "sh" mais avec les lèvres' },
        { char:'q',  example:'七',      tip:'Comme "tch" léger' },
        { char:'ü',  example:'鱼',      tip:'Lèvres rondes, son "i"' },
      ],
      words: [
        { w:'你好',    tr:'ni-HAO',     meaning:'bonjour' },
        { w:'谢谢',    tr:'XIE-xie',    meaning:'merci' },
        { w:'是',      tr:'shì',        meaning:'oui / c\'est' },
        { w:'不',      tr:'bù',         meaning:'non' },
        { w:'请',      tr:'qǐng',       meaning:'s\'il vous plaît' },
        { w:'我',      tr:'wǒ',         meaning:'je' },
        { w:'你',      tr:'nǐ',         meaning:'tu' },
        { w:'是',      tr:'shì',        meaning:'être/c\'est' },
        { w:'有',      tr:'yǒu',        meaning:'avoir' },
        { w:'很好',    tr:'hěn-HAO',    meaning:'très bien' },
      ],
      structure: {
        pattern: '主语 + 动词 + 宾语',
        example: '我吃苹果 (Wǒ chī píngguǒ)',
        breakdown: ['我 wǒ (je)', '吃 chī (mange)', '苹果 píngguǒ (pomme)'],
      }
    },
    ja: {
      sounds: [
        { char:'つ',  example:'tsunami', tip:'Difficile — "ts" combiné rapide' },
        { char:'ふ',  example:'futon',   tip:'Entre "f" et "h" — soufflé' },
        { char:'r',   example:'ら行',    tip:'Entre "r" et "l" — frappe rapide' },
      ],
      words: [
        { w:'こんにちは', tr:'kon-ni-CHI-wa', meaning:'bonjour' },
        { w:'ありがとう', tr:'a-ri-ga-TO',    meaning:'merci' },
        { w:'はい',      tr:'hai',            meaning:'oui' },
        { w:'いいえ',    tr:'i-i-ye',         meaning:'non' },
        { w:'ください',  tr:'ku-da-SAI',      meaning:'s\'il vous plaît' },
        { w:'私',        tr:'wa-ta-SHI',      meaning:'je' },
        { w:'あなた',    tr:'a-na-TA',        meaning:'tu/vous' },
        { w:'です',      tr:'des',            meaning:'être (formel)' },
        { w:'ある',      tr:'a-ru',           meaning:'avoir / exister' },
        { w:'わかった',  tr:'wa-KA-ta',       meaning:'j\'ai compris' },
      ],
      structure: {
        pattern: '主語 + 目的語 + 動詞',
        example: '私はリンゴを食べます',
        breakdown: ['私は (je)', 'リンゴを (pomme)', '食べます (mange)'],
      }
    },
    ht: {
      sounds: [
        { char:'ou', example:'ou',      tip:'Comme "ou" en français' },
        { char:'an', example:'manje',   tip:'Nasale — comme en français' },
        { char:'ch', example:'chèlbè',  tip:'Comme "sh" anglais' },
      ],
      words: [
        { w:'bonjou',    tr:'bon-JU',   meaning:'bonjour' },
        { w:'mèsi',      tr:'mè-SI',    meaning:'merci' },
        { w:'wi',        tr:'wi',       meaning:'oui' },
        { w:'non',       tr:'non',      meaning:'non' },
        { w:'tanpri',    tr:'tan-PRI',  meaning:'s\'il vous plaît' },
        { w:'mwen',      tr:'mwen',     meaning:'je/moi' },
        { w:'ou',        tr:'u',        meaning:'tu/toi' },
        { w:'se',        tr:'se',       meaning:'c\'est' },
        { w:'genyen',    tr:'gen-YEN',  meaning:'avoir' },
        { w:'ye',        tr:'ye',       meaning:'être' },
      ],
      structure: {
        pattern: 'Sijè + Vèb + Objè',
        example: 'Mwen manje yon pòm',
        breakdown: ['Mwen (je)', 'manje (mange)', 'yon pòm (une pomme)'],
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
      wordsSub:    'Les majuscules = syllabe accentuée • Prononce à voix haute',
      structTitle: '🧱 Structure des phrases',
      structSub:   'Mémorise ce schéma — tout part de là',
      structLabel: 'Schéma de base',
      structTip:   '💡 Tu n\'as pas besoin de tout comprendre maintenant.<br>Le village t\'apprendra le reste naturellement.',
      contSounds:  'Continuer → Les 10 mots essentiels',
      contWords:   'Continuer → Structure des phrases',
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
  const LEVELS = [
    { id:'zero',      label:'Zéro absolu',       desc:'Je ne connais aucun mot.',          icon:'🌱', xpBonus:0  },
    { id:'beginner',  label:'Quelques mots',      desc:'Je connais les salutations de base.', icon:'⭐', xpBonus:50 },
    { id:'elementary',label:'Niveau élémentaire', desc:'Je peux me présenter.',             icon:'📚', xpBonus:100},
    { id:'intermediate',label:'Intermédiaire',    desc:'Je peux tenir une conversation simple.', icon:'🎓', xpBonus:200},
  ];

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
          ${LEVELS.map(lv => `
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
                <div style="font-size:0.7rem;color:rgba(255,255,255,0.45);margin-top:2px;">${s.tip}</div>
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
              <div style="font-size:0.68rem;color:rgba(255,255,255,0.4);">${w.meaning}</div>
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
    const data = FOUNDATIONS[lang] || FOUNDATIONS.fr;
    const st = data.structure;
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
            ${st.breakdown.map(b => `
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
