// state.js — état global du joueur + textes d'interface
// (showScreen est dans core.js ; gainXP est dans app_v2.js ; saveGame est dans save.js)
window.S = window.S || {
  playerName: '', nativeLang: '', targetLang: '', scriptPref: 'both',
  xp: 0, level: 1, chatHistory: [], currentNPC: null, currentLoc: null,
  userLevel: 'zero', xpBoostEnd: null
};
var S = window.S;

window.applyUI = function(lang) {
  if (!window.UI_TEXT) return;
  const t = UI_TEXT[lang] || UI_TEXT.fr;
  if (!t) return;
  const setText = (id, val) => { const el = document.getElementById(id); if (el && val != null) el.textContent = val; };
  setText('ws-sub', t.sub);
  setText('lbl-native', t.lbl_native);
  setText('lbl-name', t.lbl_name);
  setText('lbl-target', t.lbl_target);
  setText('lbl-script', t.lbl_script);
  const playBtn = document.getElementById('playBtn');
  if (playBtn) playBtn.textContent = t.play;
  setText('menu-title-text', t.menu_title);
  setText('menu-sub-text', t.menu_sub);
  setText('mb-village', t.mb_village);
  setText('mb-village-d', t.mb_village_d);
  setText('mb-vocab', t.mb_vocab);
  setText('mb-vocab-d', t.mb_vocab_d);
  setText('mb-phrases', t.mb_phrases);
  setText('mb-phrases-d', t.mb_phrases_d);
  setText('mb-grammar', t.mb_grammar);
  setText('mb-grammar-d', t.mb_grammar_d);
  setText('mb-dict', t.mb_dict);
  setText('mb-dict-d', t.mb_dict_d);
  // Libellés absents de UI_TEXT : traduits ici (l'interface reste dans la langue maternelle du joueur)
  const X = MENU_EXTRA[lang] || MENU_EXTRA.fr;
  Object.keys(X).forEach(function (id) { setText(id, X[id]); });
  document.documentElement.lang = lang;
};

var MENU_EXTRA = {
  fr: { 'mb-alpha':'Alphabet','mb-alpha-d':'Hiragana · Cyrillique · Pinyin','mb-cinema':'Cinéma','mb-cinema-d':'Cours vidéo FSI & BBC','mb-wordgame':'Jeu de mots','mb-wordgame-d':'Forme des mots · Favoris','mb-mnem':'Mnémotechniques','mb-mnem-d':'Trucs mémoire adaptés à votre langue cible' },
  en: { 'mb-alpha':'Alphabet','mb-alpha-d':'Hiragana · Cyrillic · Pinyin','mb-cinema':'Cinema','mb-cinema-d':'FSI & BBC video courses','mb-wordgame':'Word game','mb-wordgame-d':'Build words · Favorites','mb-mnem':'Memory tricks','mb-mnem-d':'Mnemonics for your target language' },
  es: { 'mb-alpha':'Alfabeto','mb-alpha-d':'Hiragana · Cirílico · Pinyin','mb-cinema':'Cine','mb-cinema-d':'Cursos en vídeo FSI y BBC','mb-wordgame':'Juego de palabras','mb-wordgame-d':'Forma palabras · Favoritos','mb-mnem':'Trucos de memoria','mb-mnem-d':'Mnemotecnia para tu idioma' },
  ht: { 'mb-alpha':'Alfabè','mb-alpha-d':'Hiragana · Sirilik · Pinyin','mb-cinema':'Sinema','mb-cinema-d':'Kou videyo FSI ak BBC','mb-wordgame':'Jwèt mo','mb-wordgame-d':'Fòme mo · Favori','mb-mnem':'Trik memwa','mb-mnem-d':'Trik pou memorize nan lang ou aprann nan' },
  de: { 'mb-alpha':'Alphabet','mb-alpha-d':'Hiragana · Kyrillisch · Pinyin','mb-cinema':'Kino','mb-cinema-d':'FSI- & BBC-Videokurse','mb-wordgame':'Wortspiel','mb-wordgame-d':'Wörter bilden · Favoriten','mb-mnem':'Merkhilfen','mb-mnem-d':'Eselsbrücken für deine Zielsprache' },
  ru: { 'mb-alpha':'Алфавит','mb-alpha-d':'Хирагана · Кириллица · Пиньинь','mb-cinema':'Кино','mb-cinema-d':'Видеокурсы FSI и BBC','mb-wordgame':'Игра слов','mb-wordgame-d':'Составляй слова · Избранное','mb-mnem':'Мнемоника','mb-mnem-d':'Приёмы запоминания для изучаемого языка' },
  zh: { 'mb-alpha':'字母表','mb-alpha-d':'平假名 · 西里尔字母 · 拼音','mb-cinema':'影院','mb-cinema-d':'FSI 与 BBC 视频课程','mb-wordgame':'文字游戏','mb-wordgame-d':'组词 · 收藏','mb-mnem':'记忆技巧','mb-mnem-d':'适合目标语言的助记法' },
  ja: { 'mb-alpha':'文字','mb-alpha-d':'ひらがな · キリル文字 · ピンイン','mb-cinema':'シネマ','mb-cinema-d':'FSI と BBC のビデオ講座','mb-wordgame':'ワードゲーム','mb-wordgame-d':'単語づくり · お気に入り','mb-mnem':'記憶術','mb-mnem-d':'学習言語のための覚え方' }
};

console.log("✅ state.js chargé");
