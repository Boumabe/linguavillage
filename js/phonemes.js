// LinguaVillage — phonemes.js
// Transcription phonétique adaptée à la langue maternelle de l'utilisateur
// Pas d'IPA abstrait — syllabes naturelles que la bouche connaît déjà
// Majuscules = syllabe accentuée
// Exposé via window.LV_PHONEMES
// ================================================================

window.LV_PHONEMES = (function() {

  // ── Tables de transcription [source][cible][mot] ─────────────
  // Format : { mot_cible: { native_lang: transcription } }
  // Les transcriptions sont adaptées selon la langue maternelle

  // Règles de substitution phonétique par paire de langues
  // [nativeLang][targetLang] → règles de remplacement son par son
  const RULES = {

    // ── Créolophone apprenant d'autres langues ────────────────
    ht: {
      fr: {
        // Sons français difficiles pour créolophone
        'eu': 'eu', 'eux': 'eu', 'ue': 'eu',
        'r':  'r',  // gorge
        'u':  'u',  // bouche ronde
        'on': 'on', 'om': 'on',
        'in': 'en', 'ain': 'en', 'ein': 'en',
        'gn': 'ny',
        'oi': 'wa',
      },
      en: {
        'th': 'd/z',  // approximation
        'w':  'w',
        'r':  'r',
        'ae': 'a',    // cat
        'er': 'eur',
        'ou': 'ou/u',
        'ph': 'f',
        'ch': 'tch',
      },
      es: {
        'rr': 'r(roule)',
        'ñ':  'ny',
        'j':  'h(gorge)',
        'll': 'y',
        'v':  'b/v',
        'z':  's(ES)',  // espagnol d'Amérique
      },
      de: {
        'ch': 'kh',    // nach
        'ö':  'eu',
        'ü':  'u(round)',
        'ei': 'ay',
        'ie': 'i-long',
        'eu': 'oy',
        'au': 'ao',
        'w':  'v',
        'v':  'f',
        'z':  'ts',
      },
      ru: {
        'р': 'r(roule)',
        'ы': 'i-u',   // son mixte
        'х': 'kh',
        'ж': 'j',
        'ш': 'sh',
        'щ': 'shch',
        'ю': 'you',
        'я': 'ya',
        'ё': 'yo',
        'э': 'e',
        'ъ': '',       // signe dur
        'ь': '(mou)',  // signe mou
      },
      zh: {
        'zh': 'dj',
        'ch': 'tch',
        'sh': 'sh',
        'x':  'si',
        'q':  'tchi',
        'j':  'dji',
        'z':  'dz',
        'c':  'ts',
        'r':  'r(zh)',
        'ü':  'u(round)',
        'ng': 'ng',
        'an': 'ane',
        'en': 'eun',
      },
      ja: {
        'つ': 'tsu',
        'ふ': 'fu',
        'ん': 'n',
        'し': 'shi',
        'ち': 'chi',
        'じ': 'ji',
        'は': 'ha',
        'を': 'wo/o',
        'へ': 'e',
        'でも': 'demo',
      },
    },

    // ── Francophone apprenant d'autres langues ───────────────
    fr: {
      en: {
        'th': 'th(langue dents)',
        'w':  'w',
        'r':  'r(rétro)',
        'ae': 'a-é',
        'er': 'eur',
        'ou': 'ou',
        'ing': 'ing',
        'tion': 'cheun',
        'h':  '(aspiré)',
      },
      es: {
        'rr': 'rr(roulé)',
        'ñ':  'gn',
        'j':  'kh',
        'll': 'y/ll',
      },
      de: {
        'ch': 'kh/sh',
        'ö':  'eu',
        'ü':  'u',
        'ei': 'aï',
        'ie': 'i',
        'w':  'v',
        'v':  'f',
        'z':  'ts',
        'ß':  'ss',
      },
      ru: {
        'ы': 'i(bref)',
        'р': 'r(roulé)',
        'х': 'kh',
        'ж': 'j',
        'ш': 'ch',
        'щ': 'chtch',
        'ц': 'ts',
      },
    },

    // ── Anglophone apprenant d'autres langues ───────────────
    en: {
      fr: {
        'r':  'r(throat)',
        'eu': 'uh(lips round)',
        'on': 'ohn(nasal)',
        'in': 'an(nasal)',
        'u':  'oo(lips round)',
        'ou': 'oo',
        'oi': 'wah',
        'gn': 'ny',
      },
      es: {
        'rr': 'rr(trilled)',
        'ñ':  'ny',
        'j':  'h(harsh)',
        'v':  'b/v',
      },
    },

    // ── Hispanophone ─────────────────────────────────────────
    es: {
      fr: {
        'eu': 'eu(labial)',
        'r':  'r(garganta)',
        'in': 'en(nasal)',
        'on': 'on(nasal)',
        'u':  'u(redondo)',
        'gn': 'ny',
      },
      en: {
        'th': 'z/d(approx)',
        'w':  'w',
        'h':  '(mudo)',
        'j':  'y',
        'r':  'r(simple)',
      },
    },
  };

  // ── Dictionnaire de transcriptions pré-calculées ────────────
  // Format: DICT[targetLang][word] = { ht:'...', fr:'...', en:'...' }
  const DICT = {
    fr: {
      'bonjour':       { ht:'bon-JUR',       fr:'bon-JOOR',    en:'bohn-ZHOOR',  es:'bon-KHUR',   de:'bon-ZHUR',   ru:'bon-ZHUR' },
      'merci':         { ht:'mer-SI',         fr:'mer-SEE',     en:'mehr-SEE',    es:'mer-SI',     de:'mer-SEE',    ru:'mer-SEE'  },
      'je suis':       { ht:'jeu-SWI',        fr:'zhuh-SWEE',   en:'zhuh-SWEE',   es:'je-SWI',     de:'juh-SWEE',   ru:'juh-SWEE' },
      'vous':          { ht:'vu',             fr:'voo',         en:'voo',         es:'vu',         de:'vu',         ru:'vu'   },
      'bien':          { ht:'byan',           fr:'BYAN',        en:'byan',        es:'BYAN',       de:'byan',       ru:'byan' },
      'comment':       { ht:'ko-MAN',         fr:'koh-MAHN',    en:'koh-MAHN',    es:'ko-MAN',     de:'ko-MAHN',    ru:'ko-MAHN'  },
      'non':           { ht:'nõ',             fr:'nohn',        en:'nohn',        es:'nõ',         de:'nohn',       ru:'nohn' },
      'oui':           { ht:'wi',             fr:'wee',         en:'wee',         es:'wi',         de:'wee',        ru:'wee'  },
      'parler':        { ht:'par-LE',         fr:'par-LAY',     en:'par-LAY',     es:'par-LE',     de:'par-LAY',    ru:'par-LAY'  },
      'manger':        { ht:'man-JE',         fr:'mahn-ZHAY',   en:'mahn-ZHAY',   es:'man-JE',     de:'man-ZHAY',   ru:'man-ZHAY' },
      'comprendre':    { ht:'kon-PRAN-dr',    fr:'kohm-PRAHN-druh', en:'cohm-PROHN-druh', es:'kom-PRAN-dr', de:'kom-PRAHN-dr', ru:'kom-PRAHN-dr' },
    },
    es: {
      'hola':          { ht:'O-la',           fr:'O-la',        en:'OH-la',       de:'OH-la',      ru:'O-la',       zh:'ou-LA' },
      'gracias':       { ht:'GRA-syas',       fr:'GRA-syas',    en:'GRA-see-as',  de:'GRA-tsias',  ru:'GRA-syas',   zh:'GLA-syas' },
      'por favor':     { ht:'por-fa-VOR',     fr:'por-fa-VOR',  en:'por-fah-VOR', de:'por-fa-VOR', ru:'por-fa-VOR', zh:'pol-fa-VOR' },
      'buenos días':   { ht:'BWE-nos-DI-as',  fr:'BWEN-os DI-as', en:'BWEN-ohs DEE-as', de:'BWEN-os DI-as', ru:'BWEN-os DI-as', zh:'BWEN-os DI-as' },
      'gracias':       { ht:'GRA-sias',       fr:'GRA-sias',    en:'GRAH-see-as', de:'GRA-tsias',  ru:'GRA-sias' },
    },
    en: {
      'hello':         { ht:'he-LO',          fr:'heh-LOW',     es:'je-LO',       de:'heh-LO',     ru:'he-LO',      zh:'he-LOU' },
      'thank you':     { ht:'TANK-yu',        fr:'TANK-you',    es:'TANK-yu',     de:'TANK-you',   ru:'TANK-yu',    zh:'TANK-iou' },
      'please':        { ht:'PLIZ',           fr:'plEEz',       es:'PLIZ',        de:'pliiz',      ru:'PLIZ',       zh:'PLI-si' },
      'good morning':  { ht:'GUD-MOR-ning',   fr:'good MOR-ning', es:'gud-MOR-ning', de:'gut-MOR-ning', ru:'gud-MOR-ning' },
      'yes':           { ht:'yes',            fr:'yess',        es:'yes',         de:'yes',        ru:'yes',        zh:'yes' },
      'no':            { ht:'no',             fr:'no',          es:'no',          de:'no',         ru:'no',         zh:'no'  },
      'water':         { ht:'WO-ter',         fr:'WO-teur',     es:'WO-ter',      de:'WO-ter',     ru:'WO-ter' },
    },
    de: {
      'guten morgen':  { ht:'GU-ten-MOR-gen', fr:'GOO-ten MOR-guen', en:'GOO-ten MOR-gen', es:'GU-ten-MOR-gen', ru:'GU-ten-MOR-gen' },
      'danke':         { ht:'DAN-ke',         fr:'DANK-uh',     en:'DAHN-kuh',    es:'DAN-ke',     ru:'DAN-ke' },
      'bitte':         { ht:'BI-te',          fr:'BIT-uh',      en:'BIT-uh',      es:'BI-te',      ru:'BI-te' },
      'ja':            { ht:'ya',             fr:'ya',          en:'ya',          es:'ya',         ru:'ya'   },
      'nein':          { ht:'nayn',           fr:'nayne',       en:'NINE',        es:'nayn',       ru:'nayn' },
      'ich':           { ht:'ikh',            fr:'ikh',         en:'ikh',         es:'ikh',        ru:'ikh'  },
      'hallo':         { ht:'HA-lo',          fr:'HA-lo',       en:'HA-lo',       es:'HA-lo',      ru:'HA-lo' },
    },
    ru: {
      'привет':        { ht:'pri-VYET',       fr:'pri-VIET',    en:'pree-VYET',   es:'pri-VYET',   de:'pri-VIET',   zh:'pli-VIET' },
      'спасибо':       { ht:'Spa-SI-ba',      fr:'spa-SEE-ba',  en:'spa-SEE-buh', es:'spa-SI-ba',  de:'spa-SEE-ba', zh:'spa-SI-bo' },
      'пожалуйста':    { ht:'pa-ZHA-lusta',   fr:'pa-JA-louïsta', en:'puh-ZHAHL-stuh', es:'pa-JA-lusta', de:'pa-ZHA-lusta' },
      'да':            { ht:'da',             fr:'da',          en:'da',          es:'da',         de:'da',         zh:'da'   },
      'нет':           { ht:'nyet',           fr:'niet',        en:'nyet',        es:'nyet',       de:'niet',       zh:'niet' },
      'здравствуйте':  { ht:'ZDRA-stvuy-tye', fr:'ZDRAS-tvouï-tié', en:'ZDRAS-tvoo-ee-tyeh', es:'ZDRAS-tvuy-tye' },
    },
    zh: {
      '你好':          { ht:'ni-HAO',         fr:'ni-HAO',      en:'nee-HOW',     es:'ni-JAO',     de:'ni-HAO',     ru:'ni-HAO' },
      '谢谢':          { ht:'XIE-xie',        fr:'SIÉ-sié',     en:'shyeh-SHYEH', es:'SIE-sie',    de:'SIE-sie',    ru:'SIE-sie' },
      '你好吗':        { ht:'ni-HAO-ma',      fr:'ni-HAO-ma',   en:'nee-HOW-mah', es:'ni-JAO-ma',  de:'ni-HAO-ma' },
      '再见':          { ht:'dzay-JYEN',      fr:'dzay-DJIÈNE', en:'dzy-JYEN',    es:'dzay-JYEN' },
      '谢谢你':        { ht:'XIE-xie-ni',     fr:'SIÉ-sié-ni',  en:'SHYEH-shyeh-nee' },
    },
    ja: {
      'こんにちは':    { ht:'kon-ni-CHI-wa',  fr:'kon-ni-tchi-WA', en:'kohn-nee-chee-WAH', es:'kon-ni-tchi-wa', de:'kon-ni-tschi-wa', ru:'kon-ni-chi-WA' },
      'ありがとう':    { ht:'a-ri-ga-TO',     fr:'a-ri-ga-TÔ',  en:'ah-ree-GAH-toh', es:'a-ri-ga-TO', de:'a-ri-ga-TO', ru:'a-ri-ga-TO' },
      'さようなら':    { ht:'sa-yo-NA-ra',    fr:'sa-yo-NA-ra', en:'sah-yoh-NAH-rah', es:'sa-yo-NA-ra' },
      'おはようございます': { ht:'o-ha-YO-go-zai-mas', fr:'o-ha-YO-go-zaï-mass', en:'oh-hah-YOH-goh-ZY-mahs' },
      'はい':          { ht:'hai',            fr:'haï',         en:'hy',          es:'hai',        de:'haï',        ru:'khay' },
    },
    ht: {
      'bonjou':        { fr:'bon-JU',         en:'bon-JOO',     es:'bon-JU',      de:'bon-JU',     ru:'bon-JU' },
      'mèsi':          { fr:'mè-SI',          en:'meh-SEE',     es:'mè-SI',       de:'meh-SEE',    ru:'meh-SEE' },
      'wi':            { fr:'wi',             en:'wee',         es:'wi',          de:'wi',         ru:'wi'   },
      'tanpri':        { fr:'tan-PRI',        en:'tahn-PREE',   es:'tan-PRI',     de:'tan-PRI' },
      'mwen':          { fr:'mwen',           en:'mwen',        es:'mwen',        de:'mwen' },
    },
  };

  // ── API publique ────────────────────────────────────────────

  /**
   * Obtenir la transcription phonétique d'un mot
   * @param {string} word      - mot dans la langue cible
   * @param {string} targetLang - langue du mot
   * @param {string} nativeLang - langue maternelle du lecteur
   * @returns {string} transcription ou mot original si non trouvé
   */
  function getPhonetic(word, targetLang, nativeLang) {
    const tl = targetLang || (window.S && S.targetLang) || 'fr';
    const nl = nativeLang  || (window.S && S.nativeLang) || 'fr';
    if (tl === nl) return '';  // même langue = pas de transcription

    const wordLower = word.toLowerCase().trim();
    const dict = DICT[tl];
    if (dict && dict[wordLower] && dict[wordLower][nl]) {
      return dict[wordLower][nl];
    }
    // Tentative de génération par règles
    return _applyRules(wordLower, tl, nl);
  }

  /**
   * Afficher un mot avec sa transcription en HTML
   */
  function renderWordWithPhonetic(word, targetLang, nativeLang) {
    const phonetic = getPhonetic(word, targetLang, nativeLang);
    if (!phonetic) return `<span class="lv-word">${word}</span>`;
    return `<span class="lv-word" title="${phonetic}">
      ${word}
      <span class="lv-phonetic">[${phonetic}]</span>
    </span>`;
  }

  /**
   * Enrichir le HTML d'une bulle de dialogue avec les phonétiques
   */
  function enrichBubble(html, targetLang, nativeLang) {
    // Pour l'instant retourne tel quel — à enrichir progressivement
    return html;
  }

  // ── Génération par règles (fallback) ────────────────────────
  function _applyRules(word, targetLang, nativeLang) {
    const rules = RULES[nativeLang] && RULES[nativeLang][targetLang];
    if (!rules) return '';
    let result = word;
    for (const [from, to] of Object.entries(rules)) {
      result = result.split(from).join(to);
    }
    return result !== word ? result : '';
  }

  /**
   * CSS à injecter pour afficher les phonétiques
   */
  function injectStyles() {
    if (document.getElementById('lv-phoneme-styles')) return;
    const style = document.createElement('style');
    style.id = 'lv-phoneme-styles';
    style.textContent = `
      .lv-word { position:relative; display:inline-block; cursor:help; }
      .lv-phonetic {
        display:block;
        font-size:0.65em;
        color:#4a9eff;
        font-style:italic;
        letter-spacing:0.03em;
        margin-top:1px;
        font-weight:600;
      }
      .vi-item-phonetic {
        font-size:0.68rem;
        color:#4a9eff;
        font-style:italic;
        margin-left:6px;
      }
    `;
    document.head.appendChild(style);
  }

  // Injecter les styles au chargement
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectStyles);
  } else {
    injectStyles();
  }

  return { getPhonetic, renderWordWithPhonetic, enrichBubble, DICT, RULES };

})();
