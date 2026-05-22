// LinguaVillage — onboarding.js
// Écran d'accueil pour les nouveaux utilisateurs :
// - Choix du niveau (zéro, débutant, élémentaire, intermédiaire)
// - Exercices de phonétique (sons clés selon langue cible)
// - 10 mots fondamentaux avec transcription
// - Structure de base de la phrase
// Ensuite, passage au proverbe puis au menu principal
// ================================================================

window.LV_ONBOARDING = (function() {

  // -----------------------------------------------------------------
  // TEXTES INTERFACE (selon langue maternelle)
  // -----------------------------------------------------------------
  var UI_TEXTS = {
    fr: {
      levelTitle: lang => `Ton niveau en ${lang}`,
      levelSub: 'Sois honnête — l\'app adaptera tout pour toi',
      soundsTitle: lang => `🔊 Sons clés en ${lang}`,
      soundsSub: 'Ces sons n\'existent pas dans ta langue — apprends-les en premier',
      wordsTitle: '📖 10 mots fondamentaux',
      wordsSub: 'Majuscules = syllabe accentuée • Prononce à voix haute',
      structTitle: '🧱 Structure des phrases',
      structLabel: 'Schéma de base',
      structTip: '💡 Tu n\'as pas besoin de tout comprendre maintenant.<br>Le village t\'apprendra le reste naturellement.',
      contSounds: 'Continuer →',
      contWords: 'Continuer →',
      enter: '🏘️ Entrer dans le village !',
      skip: 'Passer cette étape'
    },
    en: {
      levelTitle: lang => `Your level in ${lang}`,
      levelSub: 'Be honest — the app will adapt for you',
      soundsTitle: lang => `🔊 Key sounds in ${lang}`,
      soundsSub: 'These sounds don\'t exist in your language — learn them first',
      wordsTitle: '📖 10 essential words',
      wordsSub: 'CAPITALS = stressed syllable • Pronounce out loud',
      structTitle: '🧱 Sentence structure',
      structLabel: 'Basic pattern',
      structTip: '💡 You don\'t need to understand everything now.<br>The village will teach you naturally.',
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
      wordsSub: 'MAYÚSCULAS = sílaba acentuada • Pronuncia en voz alta',
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
      levelSub: 'Swa onèt — app la ap adapte pou ou',
      soundsTitle: lang => `🔊 Son kle nan ${lang}`,
      soundsSub: 'Son sa yo pa egziste nan lang ou — aprann yo an premye',
      wordsTitle: '📖 10 mo fondamantal',
      wordsSub: 'MAJISKIL = silab akantye • Pwononse fò',
      structTitle: '🧱 Estrikti fraz',
      structLabel: 'Modèl debaz',
      structTip: '💡 Ou pa bezwen konprann tout kounye a.<br>Vilaj la ap aprann ou rès la natirèlman.',
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
      wordsSub: 'GROSSBUCHSTABEN = betonte Silbe • Laut aussprechen',
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
      wordsSub: 'ЗАГЛАВНЫЕ = ударный слог • Произноси вслух',
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
      wordsSub: '大写字母 = 重读音节 • 大声朗读',
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
      wordsSub: '大文字 = アクセントのある音節 • 声に出して発音',
      structTitle: '🧱 文の構造',
      structLabel: '基本パターン',
      structTip: '💡 今すべてを理解する必要はありません。<br>村が自然に残りを教えてくれます。',
      contSounds: '続ける →',
      contWords: '続ける →',
      enter: '🏘️ 村に入る！',
      skip: 'このステップをスキップ'
    }
  };

  // -----------------------------------------------------------------
  // DONNÉES FONDATIONS PAR LANGUE (sons, mots, structure)
  // -----------------------------------------------------------------
  const FOUNDATIONS = {
    fr: {
      sounds: [
        { char:'ou', example:'bonjour', tip:'Lèvres arrondies — "bonjour"' },
        { char:'eu', example:'bleu',    tip:'Lèvres arrondies, son entre "é" et "o"' },
        { char:'on', example:'bon',     tip:'Nasale — air passe par le nez' },
        { char:'in', example:'vin',     tip:'Nasale — comme "en" mais plus fermé' },
        { char:'r',  example:'rue',     tip:'Vibration au fond de la gorge' }
      ],
      words: [
        { w:'bonjour', tr:'BON-jur',   meaning:'bonjour' },
        { w:'merci',   tr:'mer-SI',    meaning:'merci' },
        { w:'oui',     tr:'wi',        meaning:'oui' },
        { w:'non',     tr:'non',       meaning:'non' },
        { w:"s'il vous plaît", tr:'sil-vu-PLE', meaning:'s\'il vous plaît' },
        { w:'je',      tr:'jeu',       meaning:'je' },
        { w:'tu',      tr:'tu',        meaning:'tu' },
        { w:"c'est",   tr:'sey',       meaning:'c\'est' },
        { w:'avoir',   tr:'a-VWAR',    meaning:'avoir' },
        { w:'être',    tr:'EY-tr',     meaning:'être' }
      ],
      structure: {
        pattern: 'Sujet + Verbe + Complément',
        example: 'Je mange une pomme',
        breakdown: ['Je (je)','mange (mange)','une pomme (une pomme)']
      }
    },
    es: {
      sounds: [
        { char:'rr', example:'perro', tip:'Roulement fort de la langue' },
        { char:'ñ',  example:'niño',  tip:'Comme "gn" en français (agneau)' },
        { char:'j',  example:'jugo',  tip:'Comme "h" fort de la gorge' },
        { char:'ll', example:'llama', tip:'Comme "y" en créole haïtien' }
      ],
      words: [
        { w:'hola',    tr:'O-la',     meaning:'hola' },
        { w:'gracias', tr:'GRA-syas', meaning:'gracias' },
        { w:'sí',      tr:'si',       meaning:'sí' },
        { w:'no',      tr:'no',       meaning:'no' },
        { w:'por favor', tr:'por fa-VOR', meaning:'por favor' },
        { w:'yo',      tr:'yo',       meaning:'yo' },
        { w:'tú',      tr:'tu',       meaning:'tú' },
        { w:'es',      tr:'es',       meaning:'es' },
        { w:'tener',   tr:'te-NYER',  meaning:'tener' },
        { w:'ser',     tr:'ser',      meaning:'ser' }
      ],
      structure: {
        pattern: 'Sujeto + Verbo + Complemento',
        example: 'Yo como una manzana',
        breakdown: ['Yo (yo)','como (como)','una manzana (manzana)']
      }
    },
    en: {
      sounds: [
        { char:'th', example:'the',   tip:'Langue entre les dents — pas "d" ni "z"' },
        { char:'w',  example:'water', tip:'Lèvres arrondies, pas "v"' },
        { char:'r',  example:'red',   tip:'Langue vers le haut, ne touche rien' },
        { char:'æ',  example:'cat',   tip:'Entre "a" et "e" ouvert' }
      ],
      words: [
        { w:'hello',     tr:'he-LO',   meaning:'hello' },
        { w:'thank you', tr:'THANK yu', meaning:'thank you' },
        { w:'yes',       tr:'yes',     meaning:'yes' },
        { w:'no',        tr:'no',      meaning:'no' },
        { w:'please',    tr:'pliz',    meaning:'please' },
        { w:'I',         tr:'ay',      meaning:'I' },
        { w:'you',       tr:'yu',      meaning:'you' },
        { w:'it is',     tr:'it iz',   meaning:'it is' },
        { w:'have',      tr:'hav',     meaning:'have' },
        { w:'be',        tr:'bi',      meaning:'be' }
      ],
      structure: {
        pattern: 'Subject + Verb + Object',
        example: 'I eat an apple',
        breakdown: ['I (I)','eat (eat)','an apple (an apple)']
      }
    },
    de: {
      sounds: [
        { char:'ch', example:'machen', tip:'Comme "h" aspiré du fond de la gorge' },
        { char:'ü',  example:'über',  tip:'Lèvres arrondies comme "ou", son "i"' },
        { char:'ö',  example:'schön', tip:'Lèvres arrondies comme "ou", son "e"' },
        { char:'ß',  example:'Straße', tip:'Comme "ss" double' }
      ],
      words: [
        { w:'hallo',  tr:'HA-lo',   meaning:'hallo' },
        { w:'danke',  tr:'DAN-ke',  meaning:'danke' },
        { w:'ja',     tr:'ya',      meaning:'ja' },
        { w:'nein',   tr:'nayn',    meaning:'nein' },
        { w:'bitte',  tr:'BI-te',   meaning:'bitte' },
        { w:'ich',    tr:'ikh',     meaning:'ich' },
        { w:'du',     tr:'du',      meaning:'du' },
        { w:'es ist', tr:'es ist',  meaning:'es ist' },
        { w:'haben',  tr:'HA-ben',  meaning:'haben' },
        { w:'sein',   tr:'zayn',    meaning:'sein' }
      ],
      structure: {
        pattern: 'Subjekt + Verb + Objekt',
        example: 'Ich esse einen Apfel',
        breakdown: ['Ich (ich)','esse (esse)','einen Apfel (Apfel)']
      }
    },
    ru: {
      sounds: [
        { char:'р', example:'рот', tip:'R roulé — vibre sur la langue' },
        { char:'ы', example:'ты', tip:'Entre "i" et "ou" — son difficile' },
        { char:'х', example:'хлеб', tip:'Comme "j" espagnol — gorge' },
        { char:'ж', example:'жить', tip:'Comme "j" français mais plus fort' }
      ],
      words: [
        { w:'привет',    tr:'pri-VYET',  meaning:'привет' },
        { w:'спасибо',   tr:'spa-SI-ba', meaning:'спасибо' },
        { w:'да',        tr:'da',        meaning:'да' },
        { w:'нет',       tr:'nyet',      meaning:'нет' },
        { w:'пожалуйста', tr:'pa-ZHA-lusta', meaning:'пожалуйста' },
        { w:'я',         tr:'ya',        meaning:'я' },
        { w:'ты',        tr:'ty',        meaning:'ты' },
        { w:'это',       tr:'EH-ta',     meaning:'это' },
        { w:'иметь',     tr:'i-MYET',    meaning:'иметь' },
        { w:'быть',      tr:'byt',       meaning:'быть' }
      ],
      structure: {
        pattern: 'Подлежащее + Сказуемое + Дополнение',
        example: 'Я ем яблоко',
        breakdown: ['Я (я)','ем (ем)','яблоко (яблоко)']
      }
    },
    zh: {
      sounds: [
        { char:'zh', example:'中', tip:'Comme "dj" mais langue vers le haut' },
        { char:'x',  example:'小', tip:'Comme "sh" avec les lèvres' },
        { char:'q',  example:'七', tip:'Comme "tch" léger' },
        { char:'ü',  example:'鱼', tip:'Lèvres rondes, son "i"' }
      ],
      words: [
        { w:'你好',  tr:'ni-HAO', meaning:'你好' },
        { w:'谢谢',  tr:'XIE-xie', meaning:'谢谢' },
        { w:'是',    tr:'shì',    meaning:'是' },
        { w:'不',    tr:'bù',     meaning:'不' },
        { w:'请',    tr:'qǐng',   meaning:'请' },
        { w:'我',    tr:'wǒ',     meaning:'我' },
        { w:'你',    tr:'nǐ',     meaning:'你' },
        { w:'有',    tr:'yǒu',    meaning:'有' },
        { w:'很好',  tr:'hěn-HAO', meaning:'很好' }
      ],
      structure: {
        pattern: '主语 + 动词 + 宾语',
        example: '我吃苹果',
        breakdown: ['我 (我)','吃 (吃)','苹果 (苹果)']
      }
    },
    ja: {
      sounds: [
        { char:'つ', example:'tsunami', tip:'Difficile — "ts" combiné rapide' },
        { char:'ふ', example:'futon',   tip:'Entre "f" et "h" — soufflé' },
        { char:'r',  example:'ら行',    tip:'Entre "r" et "l" — frappe rapide' }
      ],
      words: [
        { w:'こんにちは', tr:'kon-ni-CHI-wa', meaning:'こんにちは' },
        { w:'ありがとう', tr:'a-ri-ga-TO',    meaning:'ありがとう' },
        { w:'はい',      tr:'hai',           meaning:'はい' },
        { w:'いいえ',    tr:'i-i-ye',        meaning:'いいえ' },
        { w:'ください',  tr:'ku-da-SAI',     meaning:'ください' },
        { w:'私',       tr:'wa-ta-SHI',     meaning:'私' },
        { w:'あなた',    tr:'a-na-TA',       meaning:'あなた' },
        { w:'です',     tr:'des',           meaning:'です' },
        { w:'ある',     tr:'a-ru',          meaning:'ある' },
        { w:'わかった', tr:'wa-KA-ta',      meaning:'わかった' }
      ],
      structure: {
        pattern: '主語 + 目的語 + 動詞',
        example: '私はリンゴを食べます',
        breakdown: ['私は (私)','リンゴを (リンゴ)','食べます (食べる)']
      }
    },
    ht: {
      sounds: [
        { char:'ou', example:'ou',    tip:'Comme "ou" en français' },
        { char:'an', example:'manje', tip:'Nasale — comme en français' },
        { char:'ch', example:'chèlbè', tip:'Comme "sh" anglais' }
      ],
      words: [
        { w:'bonjou', tr:'bon-JU', meaning:'bonjou' },
        { w:'mèsi',   tr:'mè-SI', meaning:'mèsi' },
        { w:'wi',     tr:'wi',    meaning:'wi' },
        { w:'non',    tr:'non',   meaning:'non' },
        { w:'tanpri', tr:'tan-PRI', meaning:'tanpri' },
        { w:'mwen',   tr:'mwen',  meaning:'mwen' },
        { w:'ou',     tr:'u',     meaning:'ou' },
        { w:'se',     tr:'se',    meaning:'se' },
        { w:'genyen', tr:'gen-YEN', meaning:'genyen' },
        { w:'ye',     tr:'ye',    meaning:'ye' }
      ],
      structure: {
        pattern: 'Sijè + Vèb + Objè',
        example: 'Mwen manje yon pòm',
        breakdown: ['Mwen (mwen)','manje (manje)','yon pòm (pòm)']
      }
    }
  };

  // -----------------------------------------------------------------
  // NIVEAUX D'APPRENTISSAGE
  // -----------------------------------------------------------------
  const LEVELS = [
    { id:'zero', icon:'🌱', label:{ fr:'Zéro absolu', en:'Absolute zero', es:'Cero absoluto', ht:'Zewo absoli', de:'Absoluter Anfänger', ru:'Абсолютный ноль', zh:'零基础', ja:'完全な初心者' } },
    { id:'beginner', icon:'⭐', label:{ fr:'Quelques mots', en:'A few words', es:'Algunas palabras', ht:'Kèk mo', de:'Einige Wörter', ru:'Несколько слов', zh:'几个词', ja:'少しの単語' } },
    { id:'elementary', icon:'📚', label:{ fr:'Niveau élémentaire', en:'Elementary level', es:'Nivel elemental', ht:'Nivo elemantè', de:'Grundkenntnisse', ru:'Начальный уровень', zh:'初级水平', ja:'初級レベル' } },
    { id:'intermediate', icon:'🎓', label:{ fr:'Intermédiaire', en:'Intermediate', es:'Intermedio', ht:'Entèmedyè', de:'Mittelstufe', ru:'Средний уровень', zh:'中级', ja:'中級' } }
  ];

  // -----------------------------------------------------------------
  // ÉTAT
  // -----------------------------------------------------------------
  var currentStep = 0;       // 0=niveau, 1=sons, 2=mots, 3=structure
  var onDoneCallback = null;
  var selectedLevel = 'zero';
  var targetLang = '';
  var nativeLang = 'fr';

  // -----------------------------------------------------------------
  // UTILITAIRES
  // -----------------------------------------------------------------
  function getUI() {
    nativeLang = (window.S && window.S.nativeLang) || 'fr';
    return UI_TEXTS[nativeLang] || UI_TEXTS.fr;
  }

  function getFoundations() {
    targetLang = (window.S && window.S.targetLang) || 'fr';
    return FOUNDATIONS[targetLang] || FOUNDATIONS.fr;
  }

  function t(key) {
    var ui = getUI();
    if (key === 'levelTitle') return ui.levelTitle(LANG_NAMES?.[targetLang] || targetLang);
    return ui[key] || '';
  }

  // -----------------------------------------------------------------
  // RENDU DES ÉTAPES
  // -----------------------------------------------------------------
  function buildScreen(step) {
    var container = document.getElementById('screen-onboarding');
    if (!container) {
      container = document.createElement('div');
      container.id = 'screen-onboarding';
      container.className = 'screen';
      document.body.appendChild(container);
    }
    container.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:20px;background:radial-gradient(ellipse at 50% 20%,#0d1a2e 0%,#07090f 70%);overflow-y:auto;';

    if (step === 0) renderLevel(container);
    else if (step === 1) renderSounds(container);
    else if (step === 2) renderWords(container);
    else if (step === 3) renderStructure(container);
  }

  function renderLevel(container) {
    var ui = getUI();
    var flag = (FLAGS && FLAGS[targetLang]) || '';
    var langName = (LANG_NAMES && LANG_NAMES[targetLang]) || targetLang;
    container.innerHTML = `
      <div style="width:100%;max-width:420px;text-align:center;">
        <div style="font-size:2.5rem;margin-bottom:8px;">${flag}</div>
        <div style="font-family:'Cinzel',serif;font-size:1.4rem;color:#ffd700;">${ui.levelTitle(langName)}</div>
        <div style="font-size:0.78rem;color:rgba(255,255,255,0.45);margin-bottom:20px;">${ui.levelSub}</div>
        <div id="ob-levels" style="display:flex;flex-direction:column;gap:10px;">
          ${LEVELS.map(lv => `
            <button data-level="${lv.id}" class="ob-level-btn" style="display:flex;align-items:center;gap:14px;padding:14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,215,0,0.15);border-radius:14px;cursor:pointer;width:100%;text-align:left;">
              <span style="font-size:1.6rem;">${lv.icon}</span>
              <div><div style="font-weight:800;">${lv.label[nativeLang] || lv.label.fr}</div></div>
            </button>
          `).join('')}
        </div>
        <div style="margin-top:16px;">
          <button id="ob-skip" style="background:none;border:none;color:rgba(255,255,255,0.3);font-size:0.72rem;text-decoration:underline;cursor:pointer;">${ui.skip}</button>
        </div>
      </div>
    `;
    document.querySelectorAll('.ob-level-btn').forEach(btn => {
      btn.onclick = () => {
        selectedLevel = btn.dataset.level;
        if (window.S) S.userLevel = selectedLevel;
        if (window.LV_MEMORY) window.LV_MEMORY.set('level', selectedLevel);
        currentStep = 1;
        buildScreen(currentStep);
      };
    });
    document.getElementById('ob-skip').onclick = () => finish();
  }

  function renderSounds(container) {
    var ui = getUI();
    var data = getFoundations();
    var langName = (LANG_NAMES && LANG_NAMES[targetLang]) || targetLang;
    container.innerHTML = `
      <div style="width:100%;max-width:420px;">
        <div style="font-size:1.1rem;color:#ffd700;margin-bottom:4px;">${ui.soundsTitle(langName)}</div>
        <div style="font-size:0.75rem;color:rgba(255,255,255,0.45);margin-bottom:18px;">${ui.soundsSub}</div>
        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px;">
          ${data.sounds.map(s => `
            <div style="background:rgba(74,158,255,0.06);border:1px solid rgba(74,158,255,0.2);border-radius:12px;padding:12px;display:flex;align-items:center;gap:12px;">
              <span style="font-family:'Cinzel',serif;font-size:1.4rem;color:#4a9eff;font-weight:900;min-width:36px;">${s.char}</span>
              <div style="flex:1;"><div><strong>ex: ${s.example}</strong></div><div style="font-size:0.7rem;">${s.tip}</div></div>
              <button class="ob-speak" data-word="${s.example}" style="background:rgba(74,158,255,0.1);border:1px solid rgba(74,158,255,0.2);color:#4a9eff;padding:5px 10px;border-radius:8px;cursor:pointer;">🔊</button>
            </div>
          `).join('')}
        </div>
        <button id="ob-next" style="width:100%;background:linear-gradient(135deg,#a86800,#ffd700);border:none;border-radius:14px;padding:14px;font-family:'Cinzel',serif;font-weight:700;color:#0a0a0a;cursor:pointer;">${ui.contSounds}</button>
      </div>
    `;
    document.querySelectorAll('.ob-speak').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        var word = btn.dataset.word;
        speakWord(word, targetLang);
      };
    });
    document.getElementById('ob-next').onclick = () => { currentStep = 2; buildScreen(currentStep); };
  }

  function renderWords(container) {
    var ui = getUI();
    var data = getFoundations();
    container.innerHTML = `
      <div style="width:100%;max-width:420px;">
        <div style="font-size:1.1rem;color:#ffd700;margin-bottom:4px;">${ui.wordsTitle}</div>
        <div style="font-size:0.75rem;color:rgba(255,255,255,0.45);margin-bottom:14px;">${ui.wordsSub}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px;">
          ${data.words.map(w => `
            <div class="ob-word" data-word="${w.w}" style="background:rgba(78,207,112,0.06);border:1px solid rgba(78,207,112,0.2);border-radius:12px;padding:10px;text-align:center;cursor:pointer;">
              <div style="font-size:1rem;font-weight:800;color:#4ecf70;">${w.w}</div>
              <div style="font-size:0.72rem;color:#4a9eff;">${w.tr}</div>
              <div style="font-size:0.68rem;color:rgba(255,255,255,0.4);">${w.meaning}</div>
            </div>
          `).join('')}
        </div>
        <button id="ob-next" style="width:100%;background:linear-gradient(135deg,#a86800,#ffd700);border:none;border-radius:14px;padding:14px;font-family:'Cinzel',serif;font-weight:700;color:#0a0a0a;cursor:pointer;">${ui.contWords}</button>
      </div>
    `;
    document.querySelectorAll('.ob-word').forEach(el => {
      el.onclick = () => speakWord(el.dataset.word, targetLang);
    });
    document.getElementById('ob-next').onclick = () => { currentStep = 3; buildScreen(currentStep); };
  }

  function renderStructure(container) {
    var ui = getUI();
    var data = getFoundations();
    container.innerHTML = `
      <div style="width:100%;max-width:420px;">
        <div style="font-size:1.1rem;color:#ffd700;margin-bottom:4px;">${ui.structTitle}</div>
        <div style="background:rgba(192,132,252,0.08);border:1px solid rgba(192,132,252,0.25);border-radius:14px;padding:16px;margin:14px 0;text-align:center;">
          <div style="font-size:0.7rem;font-weight:800;color:#c084fc;">${ui.structLabel}</div>
          <div style="font-size:1rem;font-weight:700;margin:10px 0;">${data.structure.pattern}</div>
          <div style="font-family:'Cinzel',serif;font-size:1.1rem;color:#ffd700;margin-bottom:12px;">${data.structure.example}</div>
          <div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;">
            ${data.structure.breakdown.map(b => `<span style="background:rgba(192,132,252,0.1);border:1px solid rgba(192,132,252,0.2);border-radius:8px;padding:4px 10px;font-size:0.72rem;">${b}</span>`).join('')}
          </div>
        </div>
        <div style="background:rgba(255,215,0,0.06);border:1px solid rgba(255,215,0,0.15);border-radius:12px;padding:12px;font-size:0.78rem;text-align:center;">${ui.structTip}</div>
        <button id="ob-finish" style="width:100%;background:linear-gradient(135deg,#a86800,#ffd700);border:none;border-radius:14px;padding:15px;margin-top:20px;font-family:'Cinzel',serif;font-weight:700;color:#0a0a0a;cursor:pointer;box-shadow:0 4px 20px rgba(255,215,0,0.3);">${ui.enter}</button>
      </div>
    `;
    document.getElementById('ob-finish').onclick = () => finish();
  }

  function speakWord(word, lang) {
    if ('speechSynthesis' in window) {
      var utterance = new SpeechSynthesisUtterance(word);
      var langMap = { fr:'fr-FR', en:'en-US', es:'es-ES', ht:'fr-HT', de:'de-DE', ru:'ru-RU', zh:'zh-CN', ja:'ja-JP' };
      utterance.lang = langMap[lang] || 'fr-FR';
      utterance.rate = 0.8;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  }

  function finish() {
    var container = document.getElementById('screen-onboarding');
    if (container) container.classList.remove('active');
    if (onDoneCallback) onDoneCallback();
  }

  // -----------------------------------------------------------------
  // API PUBLIQUE
  // -----------------------------------------------------------------
  function show(onDone) {
    onDoneCallback = onDone;
    currentStep = 0;
    targetLang = (window.S && S.targetLang) || 'fr';
    nativeLang = (window.S && S.nativeLang) || 'fr';
    buildScreen(0);
    if (typeof window.showScreen === 'function') window.showScreen('screen-onboarding');
    else {
      var sc = document.getElementById('screen-onboarding');
      if (sc) sc.classList.add('active');
    }
  }

  return { show };
})();
