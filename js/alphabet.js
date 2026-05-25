// alphabet.js — Option B : Alphabet interactif
// Affiché avant le village pour ja/ru/zh
// Accessible aussi depuis le menu via openAlphabet()
// ================================================================

window.LV_ALPHABET = (function() {

// ================================================================
// DONNÉES ALPHABET PAR LANGUE
// ================================================================
var ALPHABETS = {

  // ── JAPONAIS — Hiragana de base ──────────────────────────────
  ja: {
    name: 'Hiragana',
    intro: {
      fr: 'Le japonais utilise 3 systèmes d\'écriture. On commence par les Hiragana — 46 syllabes fondamentales.',
      en: 'Japanese uses 3 writing systems. We start with Hiragana — 46 fundamental syllables.',
      es: 'El japonés usa 3 sistemas de escritura. Empezamos con Hiragana — 46 sílabas fundamentales.',
      ht: 'Japonè itilize 3 sistèm ekriti. Nou kòmanse ak Hiragana — 46 silab fondamantal.',
    },
    groups: [
      { label:'Voyelles', chars:[
        {c:'あ',r:'a',  m:{fr:'comme "a" dans "chat"',   en:'like "a" in "father"',  es:'como "a" en "casa"',   ht:'tankou "a" nan "chat"'}},
        {c:'い',r:'i',  m:{fr:'comme "i" dans "île"',    en:'like "ee" in "feet"',   es:'como "i" en "isla"',   ht:'tankou "i" nan "île"'}},
        {c:'う',r:'u',  m:{fr:'lèvres non arrondies: "u"',en:'lips not rounded: "u"', es:'labios no redondeados',ht:'"u" san wonn bouch'}},
        {c:'え',r:'e',  m:{fr:'comme "é" en français',   en:'like "e" in "bed"',     es:'como "e" en "mesa"',   ht:'tankou "é" an fransè'}},
        {c:'お',r:'o',  m:{fr:'comme "o" dans "eau"',    en:'like "o" in "go"',      es:'como "o" en "no"',     ht:'tankou "o" nan "eau"'}},
      ]},
      { label:'K·', chars:[
        {c:'か',r:'ka', m:{fr:'ka — comme "car"',     en:'ka — like "car"',   es:'ka',ht:'ka'}},
        {c:'き',r:'ki', m:{fr:'ki — comme "kiwi"',    en:'ki — like "key"',   es:'ki',ht:'ki'}},
        {c:'く',r:'ku', m:{fr:'ku — comme "cou"',     en:'ku — like "cool"',  es:'ku',ht:'ku'}},
        {c:'け',r:'ke', m:{fr:'ké — comme "café"',    en:'ke — like "keg"',   es:'ke',ht:'ke'}},
        {c:'こ',r:'ko', m:{fr:'ko — comme "cou"',     en:'ko — like "coat"',  es:'ko',ht:'ko'}},
      ]},
      { label:'S·', chars:[
        {c:'さ',r:'sa', m:{fr:'sa — comme "sa"',      en:'sa — like "saw"',   es:'sa',ht:'sa'}},
        {c:'し',r:'shi',m:{fr:'shi — comme "chi"',    en:'shi — like "she"',  es:'shi',ht:'shi'}},
        {c:'す',r:'su', m:{fr:'su — comme "su"',      en:'su — like "sue"',   es:'su',ht:'su'}},
        {c:'せ',r:'se', m:{fr:'sé — comme "café"',   en:'se — like "set"',   es:'se',ht:'se'}},
        {c:'そ',r:'so', m:{fr:'so — comme "seau"',    en:'so — like "so"',    es:'so',ht:'so'}},
      ]},
      { label:'T·', chars:[
        {c:'た',r:'ta', m:{fr:'ta — comme "ta"',      en:'ta — like "top"',   es:'ta',ht:'ta'}},
        {c:'ち',r:'chi',m:{fr:'tchi — comme "tchad"', en:'chi — like "cheer"',es:'chi',ht:'chi'}},
        {c:'つ',r:'tsu',m:{fr:'tsou — rapide',        en:'tsu — quick "ts"',  es:'tsu',ht:'tsu'}},
        {c:'て',r:'te', m:{fr:'té — comme "thé"',     en:'te — like "ten"',   es:'te',ht:'te'}},
        {c:'と',r:'to', m:{fr:'to — comme "tôt"',     en:'to — like "toe"',   es:'to',ht:'to'}},
      ]},
      { label:'N·', chars:[
        {c:'な',r:'na', m:{fr:'na',en:'na',es:'na',ht:'na'}},
        {c:'に',r:'ni', m:{fr:'ni',en:'ni',es:'ni',ht:'ni'}},
        {c:'ぬ',r:'nu', m:{fr:'nu',en:'nu',es:'nu',ht:'nu'}},
        {c:'ね',r:'ne', m:{fr:'né',en:'ne',es:'ne',ht:'ne'}},
        {c:'の',r:'no', m:{fr:'no',en:'no',es:'no',ht:'no'}},
      ]},
    ]
  },

  // ── RUSSE — Cyrillique ───────────────────────────────────────
  ru: {
    name: 'Кириллица',
    intro: {
      fr: 'Le russe utilise l\'alphabet cyrillique — 33 lettres. Beaucoup ressemblent au latin !',
      en: 'Russian uses the Cyrillic alphabet — 33 letters. Many look like Latin!',
      es: 'El ruso usa el alfabeto cirílico — 33 letras. ¡Muchas parecen latinas!',
      ht: 'Ris itilize alfabè siriliq — 33 lèt. Anpil sanble latin!',
    },
    groups: [
      { label:'Faciles — identiques', chars:[
        {c:'А а',r:'A a', m:{fr:'"A" — identique !',      en:'"A" — identical!',     es:'"A" — ¡idéntico!',  ht:'"A" — idantik!'}},
        {c:'Е е',r:'YE ye',m:{fr:'"YÉ" — comme "hier"',  en:'"YE" like "yet"',      es:'"YE" como "ayer"',  ht:'"YE"'}},
        {c:'М м',r:'M m', m:{fr:'"M" — identique !',      en:'"M" — identical!',     es:'"M" — ¡idéntico!',  ht:'"M" — idantik!'}},
        {c:'О о',r:'O o', m:{fr:'"O" — identique !',      en:'"O" — identical!',     es:'"O" — ¡idéntico!',  ht:'"O" — idantik!'}},
        {c:'Т т',r:'T t', m:{fr:'"T" — attention minuscule',en:'"T" — watch lowercase',es:'"T" — cuidado minúscula',ht:'"T"'}},
      ]},
      { label:'Pièges — faux amis', chars:[
        {c:'В в',r:'V v', m:{fr:'ressemble à "B" mais se lit "V" !', en:'looks like "B" but reads "V"!',es:'parece "B" pero suena "V"!',ht:'sanble "B" men li "V"!'}},
        {c:'Н н',r:'N n', m:{fr:'ressemble à "H" mais se lit "N" !', en:'looks like "H" but reads "N"!',es:'parece "H" pero suena "N"!',ht:'sanble "H" men li "N"!'}},
        {c:'Р р',r:'R r', m:{fr:'ressemble à "P" mais se lit "R" !', en:'looks like "P" but reads "R"!',es:'parece "P" pero suena "R"!',ht:'sanble "P" men li "R"!'}},
        {c:'С с',r:'S s', m:{fr:'ressemble à "C" mais se lit "S" !', en:'looks like "C" but reads "S"!',es:'parece "C" pero suena "S"!',ht:'sanble "C" men li "S"!'}},
        {c:'У у',r:'U u', m:{fr:'ressemble à "Y" mais se lit "OU"!', en:'looks like "Y" but reads "OO"!',es:'parece "Y" pero suena "U"!',ht:'sanble "Y" men li "OU"!'}},
        {c:'Х х',r:'KH kh',m:{fr:'ressemble à "X" mais se lit "KH"',en:'looks like "X" reads "KH"',es:'parece "X" suena "J"',ht:'sanble "X" men li "KH"'}},
      ]},
      { label:'Nouvelles lettres', chars:[
        {c:'Б б',r:'B b', m:{fr:'"B" — comme "bonjour"',  en:'"B" like "book"',       es:'"B"',ht:'"B"'}},
        {c:'Г г',r:'G g', m:{fr:'"G" — comme "garçon"',   en:'"G" like "go"',         es:'"G"',ht:'"G"'}},
        {c:'Д д',r:'D d', m:{fr:'"D" — comme "dans"',     en:'"D" like "dog"',        es:'"D"',ht:'"D"'}},
        {c:'З з',r:'Z z', m:{fr:'"Z" — comme "zéro"',     en:'"Z" like "zero"',       es:'"Z"',ht:'"Z"'}},
        {c:'И и',r:'I i', m:{fr:'"I" — comme "île"',      en:'"EE" like "feet"',      es:'"I"',ht:'"I"'}},
        {c:'К к',r:'K k', m:{fr:'"K" — comme "kilo"',     en:'"K" like "key"',        es:'"K"',ht:'"K"'}},
        {c:'Л л',r:'L l', m:{fr:'"L" — comme "lion"',     en:'"L" like "love"',       es:'"L"',ht:'"L"'}},
        {c:'П п',r:'P p', m:{fr:'"P" — comme "père"',     en:'"P" like "pet"',        es:'"P"',ht:'"P"'}},
        {c:'Ф ф',r:'F f', m:{fr:'"F" — comme "feu"',      en:'"F" like "fun"',        es:'"F"',ht:'"F"'}},
        {c:'Ш ш',r:'SH sh',m:{fr:'"CH" — comme "chat"',  en:'"SH" like "shop"',      es:'"SH"',ht:'"CH"'}},
      ]},
    ]
  },

  // ── MANDARIN — Pinyin + Tons ──────────────────────────────────
  zh: {
    name: '拼音 Pīnyīn',
    intro: {
      fr: 'Le mandarin a 4 tons — la même syllabe avec un ton différent change complètement de sens !',
      en: 'Mandarin has 4 tones — the same syllable with a different tone completely changes the meaning!',
      es: '¡El mandarín tiene 4 tonos — la misma sílaba con tono diferente cambia completamente el significado!',
      ht: 'Mandaren gen 4 ton — menm silab ak ton diferan chanje tout sans li!',
    },
    groups: [
      { label:'Les 4 tons', chars:[
        {c:'mā', r:'1er ton', m:{fr:'↗ Ton montant-plat : "mā" = maman 妈',        en:'↗ High level: "mā" = mother 妈',    es:'↗ Tono alto: "mā" = mamá 妈',    ht:'↗ Ton monte-plat: "mā" = manman 妈'}},
        {c:'má', r:'2e ton',  m:{fr:'↑ Ton montant : "má" = chanvre 麻',            en:'↑ Rising: "má" = hemp 麻',          es:'↑ Tono subiendo: "má" = cáñamo',  ht:'↑ Ton ap monte: "má" = chanm 麻'}},
        {c:'mǎ', r:'3e ton',  m:{fr:'↓↑ Descendant-montant : "mǎ" = cheval 马',    en:'↓↑ Falling-rising: "mǎ" = horse 马',es:'↓↑ Tono valle: "mǎ" = caballo 马',ht:'↓↑ Ton desann-monte: "mǎ" = cheval 马'}},
        {c:'mà', r:'4e ton',  m:{fr:'↓ Ton descendant : "mà" = gronder 骂',         en:'↓ Falling: "mà" = to scold 骂',     es:'↓ Tono cayendo: "mà" = regañar 骂',ht:'↓ Ton desann: "mà" = gronde 骂'}},
        {c:'ma', r:'Ton neutre',m:{fr:'Ton neutre : particule interrogative 吗',    en:'Neutral tone: question particle 吗', es:'Tono neutro: partícula 吗',        ht:'Ton nèt: patikil 吗'}},
      ]},
      { label:'Initiates (consonnes)', chars:[
        {c:'b p',  r:'b p',  m:{fr:'"b" doux, "p" aspiré',         en:'"b" soft, "p" aspirated',       es:'"b" suave, "p" aspirada',   ht:'"b" dou, "p" aspiré'}},
        {c:'d t',  r:'d t',  m:{fr:'"d" doux, "t" aspiré',         en:'"d" soft, "t" aspirated',       es:'"d" suave, "t" aspirada',   ht:'"d" dou, "t" aspiré'}},
        {c:'g k',  r:'g k',  m:{fr:'"g" doux, "k" aspiré',         en:'"g" soft, "k" aspirated',       es:'"g" suave, "k" aspirada',   ht:'"g" dou, "k" aspiré'}},
        {c:'zh ch',r:'zh ch',m:{fr:'"j" roulé, "ch" roulé aspiré', en:'retroflexed "j" and "ch"',      es:'"j" retroflexa y "ch"',     ht:'"j" woule, "ch" woule'}},
        {c:'sh r',  r:'sh r',m:{fr:'"sh" roulé, "r" entre r et j', en:'retroflexed "sh" and "r"',      es:'"sh" retroflexa y "r"',     ht:'"sh" woule, "r" ant r ak j'}},
        {c:'x q j',r:'x q j',m:{fr:'"ss", "tch" palatal, "dj"',   en:'"ss", palatal "ch", "j"',       es:'"ss", "ch" palatal, "j"',   ht:'"ss", "tch" palatal, "dj"'}},
      ]},
    ]
  },
};

// ================================================================
// MNÉMOTECHNIQUES PAR LANGUE (Option C)
// ================================================================
var MNEMONICS = {
  ja: [
    {word:'食べる',roman:'taberu',meaning:{fr:'manger',en:'to eat',es:'comer',ht:'manje'},
     tip:{fr:'🍽️ Une TABLE pour manger — ta-be-ru → TABLE',en:'🍽️ A TABLE to eat — ta-be-ru → TABLE',es:'🍽️ Una TABLA para comer',ht:'🍽️ Yon TAB pou manje'}},
    {word:'寝る',roman:'neru',meaning:{fr:'dormir',en:'to sleep',es:'dormir',ht:'dòmi'},
     tip:{fr:'😴 La NUIT on dort — ne-ru → NUIT',en:'😴 At NIGHT we sleep — ne-ru → NIGHT',es:'😴 Por la NOCHE dormimos',ht:'😴 NWI a nou dòmi — ne-ru → NWIT'}},
    {word:'見る',roman:'miru',meaning:{fr:'voir',en:'to see',es:'ver',ht:'wè'},
     tip:{fr:'🪞 MIROir pour voir — mi-ru → MIROIR',en:'🪞 MIRror to see — mi-ru → MIRROR',es:'🪞 MIRar — mi-ru → MIRAR',ht:'🪞 MIWA pou wè — mi-ru → MIWA'}},
    {word:'聞く',roman:'kiku',meaning:{fr:'entendre',en:'to hear',es:'escuchar',ht:'tande'},
     tip:{fr:'👂 KIKu → ÉCOUTER comme un COCU qui écoute',en:'👂 KIKu → LISTEN, ears like big "K"s',es:'👂 KIKu → ESCUCHAR',ht:'👂 KIKu → TANDE'}},
    {word:'行く',roman:'iku',meaning:{fr:'aller',en:'to go',es:'ir',ht:'ale'},
     tip:{fr:'🚶 IKu → ICI puis là-BAS, on y va !',en:'🚶 IKu → I GO — "I go" in English!',es:'🚶 IKu → IR',ht:'🚶 IKu → IKI ale la'}},
    {word:'来る',roman:'kuru',meaning:{fr:'venir',en:'to come',es:'venir',ht:'vini'},
     tip:{fr:'🏃 KURu → COURIR pour venir',en:'🏃 KURu → COURIER who comes to you',es:'🏃 KURu → CORRER para venir',ht:'🏃 KURu → KOURI vini'}},
    {word:'水',roman:'mizu',meaning:{fr:'eau',en:'water',es:'agua',ht:'dlo'},
     tip:{fr:'💧 MIZu → MISE à l\'eau !',en:'💧 MIZu → MEADow with water',es:'💧 MIZu → agua en el MUSEO',ht:'💧 MIZu → MIZE dlo a'}},
  ],

  ru: [
    {word:'есть',roman:'yest',meaning:{fr:'manger',en:'to eat',es:'comer',ht:'manje'},
     tip:{fr:'🍽️ YEST → on mange l\'EST européen !',en:'🍽️ YEST → FEAST without the F!',es:'🍽️ YEST → FEST(ín) comida',ht:'🍽️ YEST → FEST manje!'}},
    {word:'пить',roman:'pit',meaning:{fr:'boire',en:'to drink',es:'beber',ht:'bwè'},
     tip:{fr:'🍺 PIT → on PIT (trinque) !',en:'🍺 PIT → PIT-cher of water!',es:'🍺 PIT → PITarra para beber',ht:'🍺 PIT → PITchen dlo'}},
    {word:'говорить',roman:'govorit',meaning:{fr:'parler',en:'to speak',es:'hablar',ht:'pale'},
     tip:{fr:'💬 GOVORit → GOUVERNEUR qui parle',en:'💬 GOVORit → GOVERNOR speaks',es:'💬 GOVORit → GOBERNador habla',ht:'💬 GOVORit → GOUVÈNÈ pale'}},
    {word:'Привет',roman:'privet',meaning:{fr:'salut',en:'hello',es:'hola',ht:'salye'},
     tip:{fr:'👋 PRIVEt → PRIVÉ — salut en privé !',en:'👋 PRIVEt → PRIVATE greeting!',es:'👋 PRIVEt → PRIVADO — saludo',ht:'👋 PRIVEt → PRIVE — salye an prive!'}},
    {word:'да',roman:'da',meaning:{fr:'oui',en:'yes',es:'sí',ht:'wi'},
     tip:{fr:'✅ DA → comme "DÀ" en Haïtien, oui !',en:'✅ DA → "DA" as in YES in many languages!',es:'✅ DA → "DA" suena afirmativo',ht:'✅ DA → tankou "DA" wi!'}},
    {word:'нет',roman:'nyet',meaning:{fr:'non',en:'no',es:'no',ht:'non'},
     tip:{fr:'❌ NYET → NYEt pas du tout, NON !',en:'❌ NYET → Not Yet? No!',es:'❌ NYET → No Yet — NO',ht:'❌ NYET → NON encore!'}},
  ],

  zh: [
    {word:'你好',roman:'nǐ hǎo',meaning:{fr:'bonjour',en:'hello',es:'hola',ht:'bonjou'},
     tip:{fr:'👋 Nǐ hǎo → "ni HAO" — tu vas HAUt (bien) !',en:'👋 Nǐ hǎo → "knee HOW" — bow your knee!',es:'👋 Nǐ hǎo → "ni JAO"',ht:'👋 Nǐ hǎo → "ni HAO" — ou ale WO!'}},
    {word:'谢谢',roman:'xiè xie',meaning:{fr:'merci',en:'thank you',es:'gracias',ht:'mèsi'},
     tip:{fr:'🙏 Xiè xiè → "CHIÉ CHIÉ" — je chie de gratitude (mémo bizarre mais efficace !)',en:'🙏 Xiè xiè → "SHYEH SHYEH" — she-she thanks!',es:'🙏 Xiè xiè → "SHIÉ SHIÉ"',ht:'🙏 Xiè xiè → mèsi mèsi de fwa!'}},
    {word:'水',roman:'shuǐ',meaning:{fr:'eau',en:'water',es:'agua',ht:'dlo'},
     tip:{fr:'💧 Shuǐ → "CHOUI" — l\'eau qui CHOUINE !',en:'💧 Shuǐ → "SHWAY" — SWAY like water waves!',es:'💧 Shuǐ → agua que SHUISHUEA',ht:'💧 Shuǐ → dlo ki CHOUI!'}},
    {word:'吃',roman:'chī',meaning:{fr:'manger',en:'to eat',es:'comer',ht:'manje'},
     tip:{fr:'🍽️ Chī → "TCHI" — on TCHIps pour manger !',en:'🍽️ Chī → "CHEE" — CHEEse to eat!',es:'🍽️ Chī → "CHI" — CHIpa para comer',ht:'🍽️ Chī → "TCHI" — manje chip!'}},
    {word:'我',roman:'wǒ',meaning:{fr:'je/moi',en:'I/me',es:'yo/mí',ht:'mwen'},
     tip:{fr:'🙋 Wǒ → "WO" — WOi c\'est moi !',en:'🙋 Wǒ → "WO" — WOW, that\'s ME!',es:'🙋 Wǒ → "WO" — ¡WO, soy yo!',ht:'🙋 Wǒ → "WO" — WO se mwen!'}},
  ],

  // Mnémotechniques pour langues latin-based (moins nécessaires mais utiles)
  de: [
    {word:'Essen',roman:'essen',meaning:{fr:'manger',en:'to eat',es:'comer',ht:'manje'},
     tip:{fr:'🍽️ ESSEN → ESSENtiel de manger !',en:'🍽️ ESSEN → ESSENtial to eat!',es:'🍽️ ESSEN → ESENcial comer',ht:'🍽️ ESSEN → ESSENsyèl manje!'}},
    {word:'Danke',roman:'danke',meaning:{fr:'merci',en:'thank you',es:'gracias',ht:'mèsi'},
     tip:{fr:'🙏 DANKE → DAN-KÉ — comme si Dan te remercie !',en:'🙏 DANKE → DONKEY says thank you!',es:'🙏 DANKE → DAN-KE gracias',ht:'🙏 DANKE → DAN-KE mèsi!'}},
    {word:'Hallo',roman:'hallo',meaning:{fr:'bonjour',en:'hello',es:'hola',ht:'bonjou'},
     tip:{fr:'👋 HALLO → HALO lumineux pour dire bonjour !',en:'👋 HALLO → HALO to greet!',es:'👋 HALLO → HALO para saludar',ht:'👋 HALLO → HALO salye!'}},
  ],
  en: [], es: [], fr: [], ht: [],
};

// ================================================================
// RENDU UI
// ================================================================
function openAlphabet(lang, nativeLang) {
  lang       = lang       || (window.S && S.targetLang) || 'en';
  nativeLang = nativeLang || (window.S && S.nativeLang)  || 'fr';
  var data   = ALPHABETS[lang];
  if (!data) { _openMnemonics(lang, nativeLang); return; } // Pas d'alphabet → diriger vers mnémo

  var overlay = document.getElementById('lv-alphabet-overlay');
  if (overlay) overlay.remove();

  overlay = document.createElement('div');
  overlay.id = 'lv-alphabet-overlay';
  overlay.style.cssText = [
    'position:fixed;inset:0;z-index:2000;display:flex;flex-direction:column;',
    'background:rgba(4,6,14,0.98);backdrop-filter:blur(16px);',
    'overflow-y:auto;animation:alphaIn 0.25s ease;'
  ].join('');

  var intro = data.intro[nativeLang] || data.intro.fr;
  var btnLabel = {fr:'Continuer vers le village →', en:'Continue to village →', es:'Continuar al pueblo →', ht:'Kontinye nan vilaj →'}[nativeLang] || 'Continue →';
  var mnemoLabel = {fr:'💡 Voir les mnémotechniques', en:'💡 See mnemonics', es:'💡 Ver reglas mnemónicas', ht:'💡 Wè teknik memwa'}[nativeLang] || '💡 Mnemonics';

  overlay.innerHTML = '<style>@keyframes alphaIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}'
    + '.alpha-char-card{display:flex;flex-direction:column;align-items:center;justify-content:center;'
    + 'background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,215,0,0.14);border-radius:14px;'
    + 'padding:14px 8px;cursor:pointer;transition:all 0.18s;-webkit-tap-highlight-color:transparent;}'
    + '.alpha-char-card:active,.alpha-char-card:hover{background:rgba(255,215,0,0.10);border-color:#ffd700;transform:scale(1.05);}'
    + '.alpha-char{font-size:2.2rem;line-height:1;margin-bottom:4px;}'
    + '.alpha-roman{font-size:0.72rem;font-weight:800;color:#ffd700;margin-bottom:3px;}'
    + '.alpha-mnem{font-size:0.60rem;color:rgba(255,255,255,0.35);text-align:center;line-height:1.3;}'
    + '</style>'
    + '<div style="padding:18px 16px;background:rgba(255,255,255,0.03);border-bottom:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;gap:12px;">'
    + '<button onclick="document.getElementById(\'lv-alphabet-overlay\').remove()" style="background:rgba(255,255,255,0.08);border:none;border-radius:50%;width:36px;height:36px;color:#e8e0d0;font-size:1rem;cursor:pointer;flex-shrink:0;">✕</button>'
    + '<div><div style="font-family:Cinzel,serif;font-size:1rem;color:#ffd700;font-weight:700;">' + data.name + '</div>'
    + '<div style="font-size:0.72rem;color:rgba(255,255,255,0.38);margin-top:2px;">' + intro + '</div></div>'
    + '</div>'
    + '<div id="alpha-body" style="flex:1;padding:16px;"></div>'
    + '<div style="padding:14px 16px;display:flex;gap:10px;border-top:1px solid rgba(255,255,255,0.07);">'
    + '<button onclick="_openMnemonics()" style="flex:1;background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.25);border-radius:14px;padding:13px;color:#ffd700;font-weight:800;font-size:0.85rem;cursor:pointer;">' + mnemoLabel + '</button>'
    + '<button onclick="document.getElementById(\'lv-alphabet-overlay\').remove()" style="flex:1;background:linear-gradient(135deg,#a86800,#ffd700);border:none;border-radius:14px;padding:13px;color:#0a0a0a;font-weight:800;font-size:0.85rem;cursor:pointer;">' + btnLabel + '</button>'
    + '</div>';

  document.body.appendChild(overlay);

  // Remplir les groupes
  var body = document.getElementById('alpha-body');
  data.groups.forEach(function(group) {
    var sec = document.createElement('div');
    sec.style.marginBottom = '20px';
    sec.innerHTML = '<div style="font-size:0.68rem;font-weight:800;color:rgba(255,215,0,0.55);letter-spacing:0.08em;margin-bottom:10px;text-transform:uppercase;">' + group.label + '</div>';
    var grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(68px,1fr));gap:8px;';
    group.chars.forEach(function(ch) {
      var card = document.createElement('div');
      card.className = 'alpha-char-card';
      var mnem = (ch.m && (ch.m[nativeLang] || ch.m.fr)) || '';
      card.innerHTML = '<div class="alpha-char">' + ch.c + '</div>'
        + '<div class="alpha-roman">' + ch.r + '</div>'
        + '<div class="alpha-mnem">' + mnem + '</div>';
      // Tap → prononcer
      card.addEventListener('click', function() {
        _speakChar(ch.c, lang);
        card.style.borderColor = '#4ecf70';
        setTimeout(function() { card.style.borderColor = 'rgba(255,215,0,0.14)'; }, 600);
      });
      grid.appendChild(card);
    });
    sec.appendChild(grid);
    body.appendChild(sec);
  });
}

// ================================================================
// MNÉMOTECHNIQUES (Option C)
// ================================================================
function _openMnemonics(lang, nativeLang) {
  lang       = lang       || (window.S && S.targetLang) || 'en';
  nativeLang = nativeLang || (window.S && S.nativeLang)  || 'fr';
  var list   = MNEMONICS[lang] || [];

  var overlay = document.getElementById('lv-mnemonic-overlay');
  if (overlay) overlay.remove();
  overlay = document.createElement('div');
  overlay.id = 'lv-mnemonic-overlay';
  overlay.style.cssText = [
    'position:fixed;inset:0;z-index:2001;display:flex;flex-direction:column;',
    'background:rgba(4,6,14,0.98);backdrop-filter:blur(16px);',
    'overflow-y:auto;animation:alphaIn 0.22s ease;'
  ].join('');

  var titles = {fr:'💡 Mnémotechniques',en:'💡 Mnemonics',es:'💡 Reglas mnemónicas',ht:'💡 Teknik memwa'};
  var subs   = {
    fr:'Des trucs mémoire adaptés à ta langue maternelle',
    en:'Memory tricks adapted to your native language',
    es:'Trucos de memoria adaptados a tu idioma',
    ht:'Teknik memwa adapte ak lang natif ou'
  };

  overlay.innerHTML = '<style>.mnem-card{background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,215,0,0.12);border-radius:16px;padding:16px;margin-bottom:12px;cursor:pointer;transition:all 0.18s;}'
    + '.mnem-card:active{background:rgba(255,215,0,0.08);}.mnem-word{font-size:1.6rem;font-weight:900;color:#ffd700;}'
    + '.mnem-roman{font-size:0.78rem;color:rgba(255,255,255,0.45);margin-bottom:4px;}'
    + '.mnem-meaning{font-size:0.85rem;font-weight:700;color:#e8e0d0;margin-bottom:8px;}'
    + '.mnem-tip{font-size:0.80rem;color:#4ecf70;background:rgba(78,207,112,0.08);border-radius:10px;padding:8px 12px;line-height:1.45;}'
    + '</style>'
    + '<div style="padding:18px 16px;background:rgba(255,255,255,0.03);border-bottom:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;gap:12px;">'
    + '<button onclick="document.getElementById(\'lv-mnemonic-overlay\').remove()" style="background:rgba(255,255,255,0.08);border:none;border-radius:50%;width:36px;height:36px;color:#e8e0d0;font-size:1rem;cursor:pointer;flex-shrink:0;">✕</button>'
    + '<div><div style="font-family:Cinzel,serif;font-size:1rem;color:#ffd700;font-weight:700;">' + (titles[nativeLang]||titles.fr) + '</div>'
    + '<div style="font-size:0.70rem;color:rgba(255,255,255,0.38);margin-top:2px;">' + (subs[nativeLang]||subs.fr) + '</div></div>'
    + '</div>'
    + '<div id="mnem-body" style="padding:16px;"></div>';

  document.body.appendChild(overlay);

  var body = document.getElementById('mnem-body');
  if (!list.length) {
    body.innerHTML = '<div style="text-align:center;padding:40px 20px;color:rgba(255,255,255,0.28);font-size:0.88rem;">'
      + '✨ Les mnémotechniques pour cette langue arrivent bientôt !</div>';
    return;
  }

  list.forEach(function(item) {
    var card = document.createElement('div');
    card.className = 'mnem-card';
    var meaning = item.meaning[nativeLang] || item.meaning.fr;
    var tip     = item.tip[nativeLang]     || item.tip.fr;
    card.innerHTML = '<div class="mnem-word">' + item.word + '</div>'
      + '<div class="mnem-roman">' + item.roman + '</div>'
      + '<div class="mnem-meaning">→ ' + meaning + '</div>'
      + '<div class="mnem-tip">' + tip + '</div>';
    card.addEventListener('click', function() { _speakChar(item.word, lang); });
    body.appendChild(card);
  });
}

// ================================================================
// SYNTHÈSE VOCALE
// ================================================================
function _speakChar(text, lang) {
  if (!('speechSynthesis' in window)) return;
  var langMap = {fr:'fr-FR',en:'en-US',es:'es-ES',ht:'fr-HT',de:'de-DE',ru:'ru-RU',zh:'zh-CN',ja:'ja-JP'};
  var u = new SpeechSynthesisUtterance(text);
  u.lang = langMap[lang] || 'en-US';
  u.rate = 0.8;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

// ================================================================
// AUTO-AFFICHAGE après onboarding pour langues complexes
// ================================================================
function maybeShowOnboarding() {
  var tl = window.S && S.targetLang;
  if (['ja','ru','zh'].includes(tl)) {
    var seen = localStorage.getItem('lv_alphabet_seen_' + tl);
    if (!seen) {
      setTimeout(function() {
        openAlphabet(tl, window.S && S.nativeLang);
        localStorage.setItem('lv_alphabet_seen_' + tl, '1');
      }, 800);
    }
  }
}

// Exposer
return { openAlphabet: openAlphabet, openMnemonics: _openMnemonics, maybeShowOnboarding: maybeShowOnboarding };

})();

// Raccourcis globaux
window.openAlphabet  = function(l,nl) { window.LV_ALPHABET.openAlphabet(l,nl); };
window.openMnemonics = function(l,nl) { window.LV_ALPHABET.openMnemonics(l,nl); };
window._openMnemonics= function(l,nl) { window.LV_ALPHABET.openMnemonics(l,nl); };

console.log('✅ alphabet.js chargé (Options B+C)');
