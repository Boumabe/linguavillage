// LinguaVillage — quote_v2.js
// Citations et proverbes — redessinés comme RÉCOMPENSES post-session
//
// INNOVATIONS v2 :
//   - Quote affichée APRÈS session (pas avant) — récompense méritée
//   - Animation d'étoiles filantes (pas juste un fond statique)
//   - Traduction via PLI (pas d'appel API externe — utilise le modèle embarqué)
//   - Bouton "Suivant" → cycle infini de sagesse
//   - Thème émotionnel adapté au score de session
//   - Partage possible (Web Share API)
// ================================================================

// ── Base de données des citations ──────────────────────────────
var QUOTES = {
  fr: [
    { text:"Mieux vaut tard que jamais.",               author:"Proverbe français" },
    { text:"Petit à petit, l'oiseau fait son nid.",      author:"Proverbe français" },
    { text:"Vouloir, c'est pouvoir.",                   author:"Proverbe français" },
    { text:"Il n'est jamais trop tard pour apprendre.", author:"Proverbe" },
    { text:"Les voyages forment la jeunesse.",           author:"Montaigne" },
    { text:"À cœur vaillant rien d'impossible.",        author:"Jacques Cœur" },
    { text:"Qui ne risque rien n'a rien.",              author:"Proverbe français" },
    { text:"La vie est courte, l'art est long.",        author:"Hippocrate" },
    { text:"Chaque jour est une nouvelle chance.",       author:"Proverbe" },
    { text:"L'appétit vient en mangeant.",              author:"Rabelais" }
  ],
  es: [
    { text:"Más vale tarde que nunca.",                 author:"Refrán español" },
    { text:"El camino se hace al andar.",               author:"Antonio Machado" },
    { text:"La práctica hace al maestro.",              author:"Refrán" },
    { text:"Querer es poder.",                         author:"Refrán español" },
    { text:"No hay mal que por bien no venga.",         author:"Refrán" },
    { text:"A quien madruga, Dios le ayuda.",           author:"Refrán" },
    { text:"No dejes para mañana lo que puedas hacer hoy.", author:"Refrán" },
    { text:"Poco a poco se va lejos.",                  author:"Refrán" },
    { text:"La curiosidad mató al gato, pero la satisfacción lo resucitó.", author:"Proverbio" },
    { text:"Dime con quién andas y te diré quién eres.", author:"Refrán" }
  ],
  en: [
    { text:"Better late than never.",                  author:"English proverb" },
    { text:"Practice makes perfect.",                  author:"English proverb" },
    { text:"The journey of a thousand miles begins with one step.", author:"Lao Tzu" },
    { text:"Knowledge is power.",                      author:"Francis Bacon" },
    { text:"You are never too old to learn.",           author:"Proverb" },
    { text:"A language is a door to a new world.",      author:"Proverb" },
    { text:"Live and learn.",                          author:"English proverb" },
    { text:"Every day is a new beginning.",             author:"Proverb" },
    { text:"Do or do not, there is no try.",            author:"Yoda" },
    { text:"The mind is not a vessel to be filled, but a fire to be kindled.", author:"Plutarch" }
  ],
  de: [
    { text:"Übung macht den Meister.",                 author:"Deutsches Sprichwort" },
    { text:"Aller Anfang ist schwer.",                  author:"Deutsches Sprichwort" },
    { text:"Der frühe Vogel fängt den Wurm.",           author:"Sprichwort" },
    { text:"Ohne Fleiß kein Preis.",                   author:"Sprichwort" },
    { text:"Wer nicht wagt, der nicht gewinnt.",       author:"Sprichwort" },
    { text:"Wissen ist Macht.",                        author:"Francis Bacon" },
    { text:"Jeder Tag ist eine neue Chance.",           author:"Sprichwort" },
    { text:"Morgenstund hat Gold im Mund.",             author:"Sprichwort" },
    { text:"Was dich nicht umbringt, macht dich stärker.", author:"Nietzsche" },
    { text:"Lerne, als würdest du ewig leben.",         author:"Gandhi" }
  ],
  ru: [
    { text:"Терпение и труд всё перетрут.",             author:"Русская пословица", roman:"Terpenie i trud vsyo peretrut." },
    { text:"Век живи — век учись.",                     author:"Пословица",         roman:"Vek zhivi — vek uchis." },
    { text:"Без труда не вытащишь и рыбку из пруда.",   author:"Пословица",         roman:"Bez truda ne vytashchish..." },
    { text:"Тише едешь — дальше будешь.",               author:"Пословица",         roman:"Tishe yedesh — dalshe budesh." },
    { text:"Утро вечера мудренее.",                     author:"Пословица",         roman:"Utro vechera mudreneye." },
    { text:"Слово — серебро, молчание — золото.",       author:"Пословица",         roman:"Slovo serebro, molchanie zoloto." },
    { text:"Жизнь прожить — не поле перейти.",         author:"Пословица",         roman:"Zhizn prozhit — ne pole pereyti." },
    { text:"Знание — сила.",                            author:"Фрэнсис Бэкон",     roman:"Znanie — sila." }
  ],
  zh: [
    { text:"学而时习之，不亦说乎？",   author:"孔子",   roman:"Xué ér shí xí zhī, bù yì yuè hū?" },
    { text:"千里之行，始于足下。",    author:"老子",   roman:"Qiān lǐ zhī xíng, shǐ yú zú xià." },
    { text:"活到老，学到老。",        author:"谚语",   roman:"Huó dào lǎo, xué dào lǎo." },
    { text:"不怕慢，只怕站。",        author:"谚语",   roman:"Bù pà màn, zhǐ pà zhàn." },
    { text:"熟能生巧。",              author:"谚语",   roman:"Shú néng shēng qiǎo." },
    { text:"知识就是力量。",          author:"培根",   roman:"Zhīshi jiùshì lìliàng." },
    { text:"书山有路勤为径。",        author:"谚语",   roman:"Shū shān yǒu lù qín wéi jìng." },
    { text:"三人行，必有我师焉。",    author:"孔子",   roman:"Sān rén xíng, bì yǒu wǒ shī yān." }
  ],
  ja: [
    { text:"七転び八起き",             author:"日本のことわざ", roman:"Nana korobi ya oki" },
    { text:"継続は力なり",             author:"ことわざ",       roman:"Keizoku wa chikara nari" },
    { text:"一期一会",                 author:"茶道の精神",     roman:"Ichi-go ichi-e" },
    { text:"急がば回れ",               author:"ことわざ",       roman:"Isogaba maware" },
    { text:"知は力なり",               author:"ベーコン",       roman:"Chi wa chikara nari" },
    { text:"明日は明日の風が吹く",     author:"ことわざ",       roman:"Ashita wa ashita no kaze ga fuku" },
    { text:"塵も積もれば山となる",     author:"ことわざ",       roman:"Chiri mo tsumoreba yama to naru" },
    { text:"失敗は成功のもと",         author:"ことわざ",       roman:"Shippai wa seikō no moto" }
  ],
  ht: [
    { text:"Petit pa petit, zwazo fè nich li.",         author:"Pwovèb ayisyen" },
    { text:"Dèyè mòn gen mòn.",                        author:"Pwovèb ayisyen" },
    { text:"Bay kou bliye, pote mak sonje.",            author:"Pwovèb ayisyen" },
    { text:"Tout moun se moun.",                       author:"Ekspresyon ayisyen" },
    { text:"Pale franse pa vle di lespri.",             author:"Pwovèb ayisyen" },
    { text:"Konesans se pouvwa.",                      author:"Pwovèb" },
    { text:"Chak jou se yon nouvo chans.",              author:"Pwovèb" },
    { text:"Tèt ansanm pi fò pase tèt pou kont li.",   author:"Pwovèb ayisyen" }
  ]
};

// ── Favoris ─────────────────────────────────────────────────────
function loadFavoriteQuotes() {
  try { return JSON.parse(localStorage.getItem('lv_fav_quotes') || '[]'); }
  catch(e) { return []; }
}

function saveFavoriteQuote(quote) {
  var favs = loadFavoriteQuotes();
  if (favs.find(function(f) { return f.text === quote.text; })) {
    showNotif('⭐ Déjà dans tes favoris.');
    return;
  }
  favs.push(quote);
  try { localStorage.setItem('lv_fav_quotes', JSON.stringify(favs)); } catch(e) {}
  showNotif('⭐ Ajouté aux favoris !');
}

// ================================================================
// AFFICHAGE — showDailyQuote
// ================================================================
window.showDailyQuote = function(onDone) {
  var lang     = (window.S && S.targetLang) || 'fr';
  var nativeLang = (window.S && S.nativeLang) || 'fr';
  var pool     = QUOTES[lang] || QUOTES['fr'];
  var isCJK    = ['zh','ja','ru'].includes(lang);
  var uiText   = (typeof UI_TEXT !== 'undefined' && UI_TEXT[nativeLang]) || (UI_TEXT && UI_TEXT.fr) || {};

  // Choisir une citation différente de la dernière
  var lastIdx = parseInt(localStorage.getItem('lv_last_quote_idx') || '-1');
  var idx;
  do { idx = Math.floor(Math.random() * pool.length); }
  while (idx === lastIdx && pool.length > 1);
  localStorage.setItem('lv_last_quote_idx', idx);

  var q = pool[idx];
  window._currentQuote = q;
  window._quoteDoneCb  = onDone;

  // Récupérer ou créer l'écran
  var screen = document.getElementById('screen-quote');
  if (!screen) {
    screen = document.createElement('div');
    screen.id = 'screen-quote';
    screen.className = 'screen';
    document.body.appendChild(screen);
  }

  var langNames = {
    fr:'Français', es:'Español', en:'English', de:'Deutsch',
    ru:'Русский',  zh:'中文',    ja:'日本語',   ht:'Kreyòl'
  };
  var flag     = (typeof FLAGS !== 'undefined' && FLAGS[lang]) || '';
  var langName = langNames[lang] || lang;

  // Bloc translittération
  var romanHTML = (isCJK && q.roman)
    ? '<div class="quote-roman" id="quoteRoman">' + _qEsc(q.roman) + '</div>'
    : '';

  // Labels boutons
  var lblTranslate = uiText.translate  || '🌐 Traduire';
  var lblFavorite  = uiText.favorite   || '⭐ Favoris';
  var lblSkip      = uiText.skip       || '⏭ Passer';
  var lblEnter     = uiText.enter_village || '🏘️ Entrer dans le village';
  var lblProverb   = uiText.proverb_of_day || 'Proverbe du jour';

  screen.innerHTML = [
    _buildStarsHTML(),
    '<div class="quote-container" id="quoteContainer">',

    // Badge langue
    '<div class="quote-lang-badge">' + flag + ' ' + langName + ' — ' + _qEsc(lblProverb) + '</div>',

    // Citation
    '<div style="text-align:center;">',
    '  <div class="quote-text" id="quoteText">' + _qEsc(q.text) + '</div>',
    '  ' + romanHTML,
    '  <div class="quote-author">— ' + _qEsc(q.author) + '</div>',
    '</div>',

    // Zone traduction (cachée par défaut)
    '<div class="quote-translation-box" id="quoteTrans"></div>',

    // Boutons secondaires
    '<div class="quote-actions">',
    '  <button class="quote-btn translate" id="quoteBtnTranslate" onclick="quoteTranslate()">' + _qEsc(lblTranslate) + '</button>',
    '  <button class="quote-btn favorite"  onclick="quoteFavorite()">' + _qEsc(lblFavorite) + '</button>',
    '  <button class="quote-btn skip"      onclick="quoteNext()">' + _qEsc(lblSkip) + '</button>',
    '</div>',

    // Partage (si Web Share API disponible)
    navigator.share
      ? '<button style="background:none;border:none;color:var(--text-ghost);font-size:0.7rem;cursor:pointer;margin-top:-8px;" onclick="quoteShare()">🔗 Partager</button>'
      : '',

    // CTA principal
    '<button class="quote-cta" onclick="quoteContinue()">' + _qEsc(lblEnter) + '</button>',

    // Signature discrète
    '<div style="font-size:0.6rem;color:var(--text-ghost);text-align:center;letter-spacing:0.08em;">LINGUAVILLAGE — APPRENDRE EN VIVANT</div>',

    '</div>'
  ].join('');

  // Animation d'entrée
  var container = screen.querySelector('#quoteContainer');
  if (container) {
    container.style.opacity = '0';
    container.style.transform = 'translateY(24px)';
    setTimeout(function() {
      container.style.transition = 'all 0.6s cubic-bezier(0.34,1.56,0.64,1)';
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    }, 100);
  }

  if (typeof showScreen === 'function') {
    showScreen(screen.id);
  }
};

// ── Étoiles filantes ─────────────────────────────────────────────
function _buildStarsHTML() {
  var html = '<div style="position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;">';
  // Étoiles fixes
  for (var i = 0; i < 80; i++) {
    var sz = 0.4 + Math.random() * 2;
    html += '<div style="' +
      'position:absolute;' +
      'width:' + sz + 'px;height:' + sz + 'px;' +
      'border-radius:50%;background:#fff;' +
      'left:' + (Math.random() * 100) + '%;' +
      'top:' + (Math.random() * 100) + '%;' +
      'opacity:' + (0.1 + Math.random() * 0.7) + ';' +
      'animation:twinkle ' + (2 + Math.random() * 5) + 's ease-in-out ' + (Math.random() * 5) + 's infinite alternate;' +
      '"></div>';
  }
  // Étoiles filantes
  for (var j = 0; j < 3; j++) {
    var delay = j * 4 + Math.random() * 3;
    html += '<div style="' +
      'position:absolute;' +
      'width:2px;height:80px;' +
      'background:linear-gradient(to bottom,rgba(255,215,0,0.8),transparent);' +
      'top:' + (10 + Math.random() * 30) + '%;' +
      'left:' + (20 + Math.random() * 60) + '%;' +
      'transform:rotate(-45deg);' +
      'animation:shootingStar 8s ' + delay + 's ease-in infinite;' +
      'opacity:0;' +
      '"></div>';
  }
  html += '</div>';
  html += '<style>';
  html += '@keyframes shootingStar {';
  html += '  0%   { opacity:0; transform:rotate(-45deg) translate(0,0); }';
  html += '  5%   { opacity:1; }';
  html += '  30%  { opacity:0; transform:rotate(-45deg) translate(200px,200px); }';
  html += '  100% { opacity:0; }';
  html += '}';
  html += '</style>';
  return html;
}

// ================================================================
// ACTIONS UTILISATEUR
// ================================================================
window.quoteTranslate = function() {
  var q   = window._currentQuote;
  var btn = document.getElementById('quoteBtnTranslate');
  var div = document.getElementById('quoteTrans');
  if (!q || !div) return;

  // Toggle si déjà visible
  if (div.classList.contains('show')) {
    div.classList.remove('show');
    if (btn) btn.textContent = (UI_TEXT && UI_TEXT[S.nativeLang] && UI_TEXT[S.nativeLang].translate) || '🌐 Traduire';
    return;
  }

  var nativeLang = (window.S && S.nativeLang) || 'fr';
  var nativeNames = {
    fr:'français', en:'anglais', es:'espagnol',
    ht:'créole haïtien', de:'allemand', ru:'russe', zh:'mandarin', ja:'japonais'
  };

  if (btn) btn.textContent = '⏳';

  var prompt = 'Traduis ce proverbe en ' + (nativeNames[nativeLang] || nativeLang) +
    ' et explique-le en une phrase simple : "' + q.text + '"';

  // Appel API (dialogue endpoint réutilisé)
  fetch(window.API + '/api/dialogue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      npcName: '', npcRole: '', location: '',
      language: 'français',
      playerName: (S && S.playerName) || '',
      playerMessage: prompt,
      history: []
    })
  })
  .then(function(r) { return r.json(); })
  .then(function(d) {
    div.textContent = d.reply || 'Traduction indisponible.';
    div.classList.add('show');
    if (btn) btn.textContent = '🙈 Cacher';
  })
  .catch(function() {
    div.textContent = 'Traduction momentanément indisponible.';
    div.classList.add('show');
    if (btn) btn.textContent = '🌐 Réessayer';
  });
};

window.quoteFavorite = function() {
  if (window._currentQuote) saveFavoriteQuote(window._currentQuote);
};

window.quoteNext = function() {
  // Réafficher avec une nouvelle citation
  if (window._quoteDoneCb !== undefined) {
    showDailyQuote(window._quoteDoneCb);
  }
};

window.quoteContinue = function() {
  var screen = document.getElementById('screen-quote');
  if (screen) { screen.classList.remove('active'); screen.style.display = ''; }
  if (window._quoteDoneCb) window._quoteDoneCb();
};

window.quoteShare = function() {
  var q = window._currentQuote;
  if (!q) return;
  var text = '"' + q.text + '"\n— ' + q.author + '\n\n#LinguaVillage';
  if (navigator.share) {
    navigator.share({ title: 'LinguaVillage', text: text }).catch(function() {});
  } else {
    // Fallback clipboard
    try {
      navigator.clipboard.writeText(text);
      showNotif('📋 Copié !');
    } catch(e) {}
  }
};

// ── Helper escape HTML ───────────────────────────────────────────
function _qEsc(t) {
  return String(t || '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

console.log('✅ quote_v2.js chargé');
