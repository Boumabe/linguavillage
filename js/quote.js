// LinguaVillage — quote.js
// Citations et proverbes dans la langue cible
// Affiché à chaque démarrage avant l'interface principale
// Pour ajouter des citations : ajouter dans QUOTES[langue]

const QUOTES = {
  fr: [
    { text: "Mieux vaut tard que jamais.", author: "Proverbe français" },
    { text: "Petit à petit, l'oiseau fait son nid.", author: "Proverbe français" },
    { text: "La vie est belle.", author: "Expression populaire" },
    { text: "Qui vivra verra.", author: "Proverbe français" },
    { text: "L'appétit vient en mangeant.", author: "Rabelais" },
    { text: "Chaque jour est une nouvelle chance.", author: "Proverbe" },
    { text: "Vouloir c'est pouvoir.", author: "Proverbe français" },
    { text: "Il n'est jamais trop tard pour apprendre.", author: "Proverbe" },
    { text: "Les voyages forment la jeunesse.", author: "Montaigne" },
    { text: "À cœur vaillant rien d'impossible.", author: "Jacques Cœur" },
  ],
  es: [
    { text: "Más vale tarde que nunca.", author: "Refrán español" },
    { text: "No hay mal que por bien no venga.", author: "Refrán" },
    { text: "El que madruga, Dios le ayuda.", author: "Refrán español" },
    { text: "Poco a poco se va lejos.", author: "Refrán" },
    { text: "La práctica hace al maestro.", author: "Refrán" },
    { text: "Querer es poder.", author: "Refrán español" },
    { text: "Hoy es el primer día del resto de tu vida.", author: "Proverbio" },
    { text: "El camino se hace al andar.", author: "Antonio Machado" },
    { text: "Dime con quién andas y te diré quién eres.", author: "Refrán" },
    { text: "No dejes para mañana lo que puedas hacer hoy.", author: "Refrán" },
  ],
  en: [
    { text: "Better late than never.", author: "English proverb" },
    { text: "Practice makes perfect.", author: "English proverb" },
    { text: "Where there's a will, there's a way.", author: "Proverb" },
    { text: "Every day is a new beginning.", author: "Proverb" },
    { text: "Knowledge is power.", author: "Francis Bacon" },
    { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
    { text: "Live and learn.", author: "English proverb" },
    { text: "You are never too old to learn.", author: "Proverb" },
    { text: "Actions speak louder than words.", author: "English proverb" },
    { text: "A language is a door to a new world.", author: "Proverb" },
  ],
  de: [
    { text: "Übung macht den Meister.", author: "Deutsches Sprichwort" },
    { text: "Besser spät als nie.", author: "Sprichwort" },
    { text: "Aller Anfang ist schwer.", author: "Deutsches Sprichwort" },
    { text: "Wer nicht wagt, der nicht gewinnt.", author: "Sprichwort" },
    { text: "Morgenstund hat Gold im Mund.", author: "Deutsches Sprichwort" },
    { text: "Ohne Fleiß kein Preis.", author: "Sprichwort" },
    { text: "Jeder Tag ist eine neue Chance.", author: "Sprichwort" },
    { text: "Lebe jeden Tag als wäre es dein letzter.", author: "Sprichwort" },
    { text: "Wissen ist Macht.", author: "Francis Bacon" },
    { text: "Der frühe Vogel fängt den Wurm.", author: "Sprichwort" },
  ],
  ru: [
    { text: "Терпение и труд всё перетрут.", author: "Русская пословица", roman: "Terpenie i trud vsyo peretrut." },
    { text: "Тише едешь — дальше будешь.", author: "Пословица", roman: "Tishe yedesh — dalshe budesh." },
    { text: "Не откладывай на завтра то, что можно сделать сегодня.", author: "Пословица", roman: "Ne otkladyvay na zavtra..." },
    { text: "Жизнь прожить — не поле перейти.", author: "Пословица", roman: "Zhizn prozhit — ne pole pereyti." },
    { text: "Век живи — век учись.", author: "Пословица", roman: "Vek zhivi — vek uchis." },
    { text: "Без труда не вытащишь и рыбку из пруда.", author: "Пословица", roman: "Bez truda ne vytashchish..." },
    { text: "Утро вечера мудренее.", author: "Пословица", roman: "Utro vechera mudreneye." },
    { text: "Слово — серебро, молчание — золото.", author: "Пословица", roman: "Slovo — serebro..." },
  ],
  zh: [
    { text: "学而时习之，不亦说乎？", author: "孔子 Confucius", roman: "Xué ér shí xí zhī, bù yì yuè hū?" },
    { text: "千里之行，始于足下。", author: "老子 Lao Tseu", roman: "Qiān lǐ zhī xíng, shǐ yú zú xià." },
    { text: "活到老，学到老。", author: "中国谚语", roman: "Huó dào lǎo, xué dào lǎo." },
    { text: "不怕慢，只怕站。", author: "谚语", roman: "Bù pà màn, zhǐ pà zhàn." },
    { text: "熟能生巧。", author: "谚语", roman: "Shú néng shēng qiǎo." },
    { text: "知识就是力量。", author: "培根", roman: "Zhīshi jiùshì lìliàng." },
    { text: "今日事，今日毕。", author: "谚语", roman: "Jīn rì shì, jīn rì bì." },
    { text: "书山有路勤为径。", author: "谚语", roman: "Shū shān yǒu lù qín wéi jìng." },
  ],
  ja: [
    { text: "七転び八起き", author: "日本のことわざ", roman: "Nana korobi ya oki — Tombe sept fois, relève-toi huit." },
    { text: "継続は力なり", author: "ことわざ", roman: "Keizoku wa chikara nari — La persévérance est la force." },
    { text: "一期一会", author: "茶道の精神", roman: "Ichi-go ichi-e — Une rencontre unique dans une vie." },
    { text: "急がば回れ", author: "ことわざ", roman: "Isogaba maware — Si tu es pressé, fais le tour." },
    { text: "知は力なり", author: "ベーコン", roman: "Chi wa chikara nari — Le savoir est le pouvoir." },
    { text: "明日は明日の風が吹く", author: "ことわざ", roman: "Ashita wa ashita no kaze ga fuku." },
    { text: "習うより慣れよ", author: "ことわざ", roman: "Narau yori nareyo — S'habituer plutôt qu'apprendre." },
    { text: "百聞は一見に如かず", author: "ことわざ", roman: "Hyakubun wa ikken ni shikazu — Voir une fois vaut mieux qu'entendre cent fois." },
  ],
  ht: [
    { text: "Petit pa petit, zwazo fè nich li.", author: "Pwovèb ayisyen" },
    { text: "Dèyè mòn gen mòn.", author: "Pwovèb ayisyen" },
    { text: "Bay kou bliye, pote mak sonje.", author: "Pwovèb ayisyen" },
    { text: "Tout moun se moun.", author: "Ekspresyon ayisyen" },
    { text: "Chak jou se yon nouvo chans.", author: "Pwovèb" },
    { text: "Konesans se pouvwa.", author: "Pwovèb" },
    { text: "Pale franse pa vle di lespri.", author: "Pwovèb ayisyen" },
    { text: "Men anpil chay pa lou.", author: "Pwovèb ayisyen" },
  ]
};

// ── Favoris ────────────────────────────────────────────────────
function loadFavoriteQuotes() {
  try { return JSON.parse(localStorage.getItem('lv_fav_quotes')||'[]'); }
  catch(e) { return []; }
}
function saveFavoriteQuote(quote) {
  const favs = loadFavoriteQuotes();
  const key = quote.text;
  if (!favs.find(q => q.text===key)) {
    favs.push(quote);
    localStorage.setItem('lv_fav_quotes', JSON.stringify(favs));
    showNotif('⭐ Ajouté aux favoris !');
  } else {
    showNotif('⭐ Déjà dans tes favoris.');
  }
}

// ── Affichage de la citation ────────────────────────────────────
function showDailyQuote(onDone) {
  const lang = (window.S && S.targetLang) || 'fr';
  const pool = QUOTES[lang] || QUOTES['fr'];
  const isCJK = ['zh','ja','ru'].includes(lang);

  // Choisir une citation aléatoire (différente du jour précédent)
  const lastIdx = parseInt(localStorage.getItem('lv_last_quote_idx')||'-1');
  let idx;
  do { idx = Math.floor(Math.random()*pool.length); }
  while (idx===lastIdx && pool.length>1);
  localStorage.setItem('lv_last_quote_idx', idx);

  const q = pool[idx];

  // Injecter le screen citation dans le DOM
  let screen = document.getElementById('screen-quote');
  if (!screen) {
    screen = document.createElement('div');
    screen.id = 'screen-quote';
    screen.className = 'screen';
    screen.style.cssText = 'display:none;flex-direction:column;align-items:center;justify-content:center;padding:24px;background:radial-gradient(ellipse at 50% 40%,#0d1a2e 0%,#07090f 70%);';
    document.body.appendChild(screen);
  }

  const langName = { fr:'Français',es:'Español',en:'English',de:'Deutsch',ru:'Русский',zh:'中文',ja:'日本語',ht:'Kreyòl' }[lang] || lang;
  const flag = (window.FLAGS && FLAGS[lang]) || '';

  screen.innerHTML = `
    <div style="position:fixed;inset:0;pointer-events:none;z-index:0;" id="quote-stars"></div>

    <div style="position:relative;z-index:1;width:100%;max-width:420px;display:flex;flex-direction:column;align-items:center;gap:20px;">

      <!-- Badge langue -->
      <div style="font-size:0.72rem;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;
                  color:rgba(255,215,0,0.6);border:1px solid rgba(255,215,0,0.2);
                  padding:4px 14px;border-radius:20px;">
        ${flag} ${langName} — Proverbe du jour
      </div>

      <!-- Citation principale -->
      <div style="text-align:center;">
        <div id="quote-text" style="font-family:'Cinzel',serif;font-size:clamp(1.1rem,4vw,1.5rem);
                                     font-weight:700;color:#fff;line-height:1.5;margin-bottom:14px;
                                     text-shadow:0 0 30px rgba(255,215,0,0.2);">
          ${escapeHtml ? escapeHtml(q.text) : q.text}
        </div>
        ${isCJK && q.roman ? `
        <div id="quote-roman" style="font-size:0.9rem;color:rgba(74,158,255,0.9);
                                      font-style:italic;margin-bottom:10px;">
          ${q.roman}
        </div>` : ''}
        <div style="font-size:0.72rem;color:rgba(255,215,0,0.55);font-weight:600;">
          — ${q.author}
        </div>
      </div>

      <!-- Traduction (cachée par défaut) -->
      <div id="quote-translation" style="display:none;background:rgba(74,158,255,0.08);
            border:1px solid rgba(74,158,255,0.2);border-radius:12px;
            padding:12px 16px;font-size:0.85rem;color:var(--blue,#4a9eff);
            text-align:center;width:100%;line-height:1.5;">
      </div>

      <!-- Boutons actions -->
      <div style="display:flex;gap:10px;width:100%;">
        <button onclick="quoteTranslate()" id="quote-btn-translate"
          style="flex:1;background:rgba(74,158,255,0.1);border:1px solid rgba(74,158,255,0.3);
                 color:#4a9eff;padding:11px 8px;border-radius:12px;font-weight:800;font-size:0.8rem;cursor:pointer;">
          🌐 Traduire
        </button>
        <button onclick="quoteFavorite()"
          style="flex:1;background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.2);
                 color:#ffd700;padding:11px 8px;border-radius:12px;font-weight:800;font-size:0.8rem;cursor:pointer;">
          ⭐ Favoris
        </button>
        <button onclick="quoteNext()"
          style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);
                 color:rgba(232,224,208,0.7);padding:11px 8px;border-radius:12px;font-weight:800;font-size:0.8rem;cursor:pointer;">
          ⏭ Passer
        </button>
      </div>

      <!-- Bouton Continuer (principal) -->
      <button onclick="quoteContinue()"
        style="width:100%;background:linear-gradient(135deg,#a86800,#ffd700);border:none;
               border-radius:14px;padding:15px;font-family:'Cinzel',serif;
               font-size:1rem;font-weight:700;color:#0a0a0a;letter-spacing:0.05em;
               box-shadow:0 4px 20px rgba(255,215,0,0.3);cursor:pointer;
               transition:all 0.2s;">
        ▶ Entrer dans le village
      </button>

      <div style="font-size:0.65rem;color:rgba(255,255,255,0.2);text-align:center;">
        LinguaVillage — Apprendre en vivant
      </div>
    </div>
  `;

  // Étoiles de fond
  const starsEl = screen.querySelector('#quote-stars');
  if (starsEl) {
    let starsHTML = '';
    for (let i=0;i<80;i++) {
      const z = Math.random()*2+0.4;
      starsHTML += `<div style="position:absolute;width:${z}px;height:${z}px;border-radius:50%;
        background:#fff;left:${Math.random()*100}%;top:${Math.random()*100}%;
        opacity:${0.2+Math.random()*0.6};
        animation:twinkle ${2+Math.random()*4}s ease-in-out infinite alternate;
        animation-delay:${Math.random()*5}s;"></div>`;
    }
    starsEl.innerHTML = starsHTML;
  }

  // Stocker le callback
  window._quoteDoneCb = onDone;
  window._currentQuote = q;

  // Afficher
  document.querySelectorAll('.screen').forEach(s => s.style.display='none');
  screen.style.display = 'flex';
}

function quoteTranslate() {
  const q = window._currentQuote;
  if (!q) return;
  const btn = document.getElementById('quote-btn-translate');
  const div = document.getElementById('quote-translation');
  if (!div) return;
  if (div.style.display !== 'none') { div.style.display='none'; return; }

  const nativeLang = (window.S && S.nativeLang) || 'fr';
  const targetLang = (window.S && S.targetLang) || 'fr';
  const nativeNames = { fr:'français',en:'anglais',es:'espagnol',ht:'créole haïtien',de:'allemand',ru:'russe',zh:'mandarin',ja:'japonais' };

  if (btn) btn.textContent = '⏳ Traduction...';

  const prompt = `Traduis ce proverbe en ${nativeNames[nativeLang]||nativeLang} et explique-le brièvement (1 phrase): "${q.text}"`;

  fetch(window.API+'/api/dialogue', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ npcName:'', npcRole:'', location:'', language:'français',
      playerName:'', playerMessage: prompt, history:[] })
  })
  .then(r=>r.json())
  .then(d=>{
    div.textContent = d.reply || 'Traduction indisponible.';
    div.style.display = 'block';
    if (btn) btn.textContent = '🌐 Cacher';
  })
  .catch(()=>{
    div.textContent = 'Traduction indisponible pour le moment.';
    div.style.display = 'block';
    if (btn) btn.textContent = '🌐 Traduire';
  });
}

function quoteFavorite() {
  const q = window._currentQuote;
  if (q) saveFavoriteQuote(q);
}

function quoteNext() {
  // Passer à un autre proverbe
  if (window._quoteDoneCb !== undefined) {
    // Re-afficher avec un nouveau proverbe
    showDailyQuote(window._quoteDoneCb);
  }
}

function quoteContinue() {
  const screen = document.getElementById('screen-quote');
  if (screen) screen.style.display = 'none';
  if (window._quoteDoneCb) window._quoteDoneCb();
}
