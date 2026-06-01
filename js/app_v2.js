// LinguaVillage — app_v2.js (FIXED — sans conflits state.js)
// ================================================================
// RÈGLE D'OR : app_v2.js ne redéfinit JAMAIS :
//   ✗ window.gainXP      → state.js (+ LV_SOUND + LV_ANIM + combo)
//   ✗ window.showNotif   → state.js (+ LV_SOUND + type param)
//   ✗ window.launchConfetti → state.js
//   ✗ window.showScreen  → state.js
//
// app_v2.js AJOUTE uniquement :
//   ✓ window.PLI          — Progressive Linguistic Immersion
//   ✓ window.FLAGS / LANG_NAMES
//   ✓ window.rewardWithQuote / showQuoteThenMenu
//   ✓ window.updateStreak (étend state.js, met à jour le banner menu)
//   ✓ window.showStarterSuggestions / hideStarterSuggestions
//   ✓ window.escapeHtml
//   ✓ Flux welcome → onboarding → menu
//   ✓ API warmup
//   ✓ Patch gainXP : ajoute PLI.updateBar() sans écraser LV_SOUND/LV_ANIM
// ================================================================

// ── Constantes globales ─────────────────────────────────────────
var API = 'https://linguavillage-api--marckensbou2.replit.app';

window.FLAGS = {
  fr:'🇫🇷', es:'🇪🇸', en:'🇬🇧', de:'🇩🇪',
  ru:'🇷🇺', zh:'🇨🇳', ja:'🇯🇵', ht:'🇭🇹'
};
window.LANG_NAMES = {
  fr:'Français', es:'Español', en:'English', de:'Deutsch',
  ru:'Русский', zh:'中文', ja:'日本語', ht:'Kreyòl'
};

// ================================================================
// PLI — Progressive Linguistic Immersion
// ================================================================
window.PLI = {
  ratio: function() {
    var xp = (window.S && S.xp) || 0;
    if (xp >= 3000) return 0.97;
    if (xp >= 1500) return 0.88;
    if (xp >= 500)  return 0.70;
    if (xp >= 200)  return 0.58;
    return 0.45;
  },

  buildPrompt: function(npcName, npcRole, location, npcLang, playerName, playerNative) {
    var r   = this.ratio();
    var pct = Math.round(r * 100);
    var nl  = playerNative || 'fr';
    var nativeNames = {
      fr:'français', en:'anglais', es:'espagnol',
      ht:'créole haïtien', de:'allemand', ru:'russe',
      zh:'mandarin', ja:'japonais'
    };
    return [
      'Tu es ' + npcName + ', ' + npcRole + ' à ' + location + '.',
      'Tu parles à ' + playerName + ' qui apprend le ' + (nativeNames[npcLang]||npcLang) + '.',
      '',
      '📊 RÈGLE PLI :',
      '- Utilise ' + pct + '% EN ' + (nativeNames[npcLang]||npcLang).toUpperCase(),
      '- Utilise ' + (100-pct) + '% EN ' + (nativeNames[nl]||nl) + ' pour les mots difficiles',
      '- Mot inconnu : écris-le en cible puis (traduction) entre parenthèses',
      '',
      'CORRECTION BIENVEILLANTE :',
      '- Corrige UNE FOIS, avec tact : ✨ "version correcte" — explication courte',
      '- Ne pas interrompre la conversation pour corriger',
      '',
      'PERSONNALITÉ : chaleureux, humain, espiègle. Pose des questions courtes. Max 3 phrases.'
    ].join('\n');
  },

  updateBar: function() {
    var pct   = Math.round(this.ratio() * 100);
    var fill  = document.getElementById('pliBarFill');
    var label = document.getElementById('pliPct');
    if (fill)  fill.style.width = pct + '%';
    if (label) {
      var tl = (window.S && S.targetLang) || 'fr';
      label.textContent = pct + '% ' + (window.LANG_NAMES[tl] || tl);
    }
  }
};

// ================================================================
// PATCH gainXP — ajoute PLI.updateBar() sans écraser state.js
// Appelé après DOMContentLoaded pour s'assurer que state.js est chargé
// ================================================================
(function _patchGainXP() {
  var orig = window.gainXP;
  if (!orig) return; // state.js pas encore chargé — on réessaie après
  if (orig._pli_patched) return;

  window.gainXP = function(amount, sourceEl) {
    if (orig) orig.call(this, amount, sourceEl);
    // Ajouter PLI.updateBar() en plus de tout ce que fait state.js
    if (typeof PLI !== 'undefined') PLI.updateBar();
  };
  window.gainXP._pli_patched = true;
})();

// ================================================================
// DÉMARRAGE
// ================================================================
window.addEventListener('DOMContentLoaded', function() {

  // Patch tardif si state.js était chargé mais pas encore au moment du patch ci-dessus
  if (window.gainXP && !window.gainXP._pli_patched) {
    var orig = window.gainXP;
    window.gainXP = function(amount, sourceEl) {
      orig.call(this, amount, sourceEl);
      if (typeof PLI !== 'undefined') PLI.updateBar();
    };
    window.gainXP._pli_patched = true;
  }

  function _doInit() {
    _warmupAPI();

    if (!window.S) {
      window.S = {
        nativeLang: null, targetLang: null,
        playerName: '', scriptPref: 'both',
        xp: 0, level: 1, userLevel: 'zero',
        chatHistory: [], currentNPC: null, currentLoc: null,
        xpBoostEnd: null
      };
    }

    if (window._LINGUA_HAS_SAVE && S.playerName && S.nativeLang && S.targetLang) {
      try {
        if (typeof applyUI === 'function') applyUI(S.nativeLang);
        _initSession();
        return;
      } catch(e) { console.warn('Restore failed:', e); }
    }

    _initWelcomeScreen();
  }

  // Si animation.js a chargé un splash → attendre sa fin
  if (window.LV_ANIM && typeof window.LV_ANIM.showSplash === 'function') {
    window.LV_ANIM.showSplash(function() { _doInit(); });
  } else {
    _doInit();
  }
});

// ── Warmup API ──────────────────────────────────────────────────
function _warmupAPI() {
  fetch(API + '/ping', {
    method: 'GET',
    signal: AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined
  }).catch(function() { console.log('API warmup attempted'); });
}

// ================================================================
// WELCOME SCREEN
// ================================================================
function _initWelcomeScreen() {
  var nativeTiles = document.querySelectorAll('.lang-tile[data-native]');
  var targetTiles = document.querySelectorAll('.lang-tile[data-lang]');
  var step2     = document.getElementById('step2');
  var step3     = document.getElementById('step3');
  var step4     = document.getElementById('step4');
  var playBtn   = document.getElementById('playBtn');
  var nameInput = document.getElementById('inputName');

  nativeTiles.forEach(function(tile) {
    tile.onclick = function() {
      nativeTiles.forEach(function(t) { t.classList.remove('active','sel'); });
      this.classList.add('active','sel');
      S.nativeLang = this.dataset.native;
      if (typeof applyUI === 'function') applyUI(S.nativeLang);
      _showStep(step2);
      targetTiles.forEach(function(t) {
        var same = t.dataset.lang === S.nativeLang;
        t.classList.toggle('disabled', same);
        if (same) t.classList.remove('active','sel');
      });
      if (nameInput) setTimeout(function() { nameInput.focus(); }, 120);
    };
  });

  if (nameInput) {
    nameInput.addEventListener('input', function() {
      if (this.value.trim() && S.nativeLang) { _showStep(step3); }
      else { _hideStep(step3); _hideStep(step4); _hidePlayBtn(playBtn); }
    });
  }

  targetTiles.forEach(function(tile) {
    tile.onclick = function() {
      if (this.classList.contains('disabled')) return;
      targetTiles.forEach(function(t) { t.classList.remove('active','sel'); });
      this.classList.add('active','sel');
      S.targetLang = this.dataset.lang;

      var isCJK = ['zh','ja','ru'].includes(S.targetLang);
      if (isCJK) {
        _showStep(step4);
        var ex = ({ zh:{n:'你好',r:'Nǐ hǎo'}, ja:{n:'こんにちは',r:'Konnichiwa'}, ru:{n:'Привет',r:'Privyet'} })[S.targetLang] || {n:'',r:''};
        var scN = document.getElementById('sc-n');
        var scR = document.getElementById('sc-r');
        if (scN) scN.textContent = ex.n;
        if (scR) scR.textContent = ex.r;
        S.scriptPref = null;
        document.querySelectorAll('.sc-btn').forEach(function(b) { b.classList.remove('sel','active'); });
        _hidePlayBtn(playBtn);
      } else {
        S.scriptPref = 'both';
        _hideStep(step4);
        _showPlayBtn(playBtn);
      }
    };
  });

  window.selScript = function(pref, btn) {
    document.querySelectorAll('.sc-btn').forEach(function(b) { b.classList.remove('sel','active'); });
    if (btn) btn.classList.add('sel','active');
    S.scriptPref = pref;
    _showPlayBtn(playBtn);
  };

  if (playBtn) {
    playBtn.addEventListener('click', function() {
      var name = nameInput ? nameInput.value.trim() : '';
      if (!name)         { if(typeof showNotif==='function') showNotif('✏️ Entrez votre prénom !'); return; }
      if (!S.nativeLang) { if(typeof showNotif==='function') showNotif('🌍 Choisissez votre langue !'); return; }
      if (!S.targetLang) { if(typeof showNotif==='function') showNotif('🎯 Choisissez une langue cible !'); return; }
      if (['zh','ja','ru'].includes(S.targetLang) && !S.scriptPref) {
        if(typeof showNotif==='function') showNotif('✍️ Choisissez un mode d\'écriture !');
        return;
      }
      S.playerName = name;
      if (typeof saveGame === 'function') saveGame();
      _startOnboarding();
    });
  }
}

function _showStep(el)    { if (!el) return; el.style.display = 'block'; el.classList.add('form-step'); }
function _hideStep(el)    { if (!el) return; el.style.display = 'none'; }
function _showPlayBtn(btn) {
  if (!btn) return;
  var t = (window.UI_TEXT && UI_TEXT[S.nativeLang]) || (window.UI_TEXT && UI_TEXT.fr) || {};
  btn.textContent = t.play || '✨ Commencer';
  btn.style.display = 'block';
  btn.disabled = false;
}
function _hidePlayBtn(btn) { if (!btn) return; btn.style.display = 'none'; btn.disabled = true; }

// ================================================================
// FLUX ONBOARDING → MENU
// ================================================================
function _startOnboarding() {
  if (window.LV_ONBOARDING && typeof window.LV_ONBOARDING.show === 'function') {
    window.LV_ONBOARDING.show(function() { _goToMenu(); });
  } else {
    _goToMenu();
  }
}

function _initSession() {
  _goToMenu();
  try { if (typeof checkDailyStreak === 'function') checkDailyStreak(); } catch(e) {}
}

// ================================================================
// MENU PRINCIPAL
// ================================================================
function _goToMenu() {
  try { localStorage.setItem('lv_onboarding_done', '1'); } catch(e) {}

  var menuPlayer = document.getElementById('menuPlayer');
  var menuLang   = document.getElementById('menuLang');
  var menuXP     = document.getElementById('menuXP');
  var gemDisplay = document.getElementById('gemDisplay');
  var xpFill     = document.getElementById('xpFill');
  var menuGreet  = document.getElementById('menuGreeting');

  if (menuPlayer) menuPlayer.textContent = '👤 ' + (S.playerName || 'Joueur');
  if (menuLang) {
    menuLang.textContent = (window.FLAGS[S.targetLang]||'') + ' ' + (window.LANG_NAMES[S.targetLang]||S.targetLang||'');
  }
  if (menuXP)     menuXP.textContent     = (S.xp || 0) + ' XP';
  if (gemDisplay) gemDisplay.textContent = '💎 ' + ((window.S_missions && S_missions.gems) || 0);
  if (xpFill)     xpFill.style.width     = ((S.xp || 0) % 100) + '%';

  if (menuGreet) {
    var hour = new Date().getHours();
    var g = ({
      fr:[ hour<12?'Bonjour':hour<18?'Bonsoir':'Bonne nuit', (S.playerName||'')+' !' ],
      en:[ hour<12?'Good morning':hour<18?'Good evening':'Good night', (S.playerName||'')+'!' ],
      es:[ hour<12?'Buenos días':hour<18?'Buenas tardes':'Buenas noches', (S.playerName||'')+'!' ],
      ht:[ hour<12?'Bonjou':hour<18?'Bonswa':'Bònn nwit', (S.playerName||'')+'!' ],
      de:[ hour<12?'Guten Morgen':hour<18?'Guten Tag':'Gute Nacht', (S.playerName||'')+'!' ]
    })[S.nativeLang||'fr'] || [hour<12?'Bonjour':'Bonsoir',(S.playerName||'')+' !'];
    menuGreet.textContent = g[0] + ', ' + g[1];
  }

  try { if (typeof saveGame    === 'function') saveGame();    } catch(e) {}
  try { if (typeof updateStreak === 'function') updateStreak(); } catch(e) {}

  if (typeof showScreen === 'function') showScreen('screen-menu');

  PLI.updateBar();

  try {
    if (window.LV_ALPHABET && typeof window.LV_ALPHABET.maybeShowOnboarding === 'function') {
      window.LV_ALPHABET.maybeShowOnboarding();
    }
  } catch(e) {}
}

// ================================================================
// STREAK — ÉTEND state.js (ajoute la mise à jour du banner menu)
// ================================================================
window.updateStreak = function() {
  try { if (typeof checkDailyStreak    === 'function') checkDailyStreak();    } catch(e) {}
  try { if (typeof updateStreakDisplay === 'function') updateStreakDisplay(); } catch(e) {}

  var G = window.S_game;
  if (!G) return;
  var banner = document.getElementById('streakBanner');
  if (!banner) return;

  if (G.streak > 0) {
    banner.style.cssText = banner.style.cssText
      .replace('display:none', '')
      .replace('display: none', '');
    banner.style.display       = 'flex';
    banner.style.flexDirection = 'row';
    banner.style.alignItems    = 'center';
    banner.style.gap           = '12px';
    var valEl   = document.getElementById('streakVal');
    var labelEl = document.getElementById('streakLabel');
    if (valEl)   valEl.textContent   = G.streak + ' 🔥';
    if (labelEl) labelEl.textContent = ({fr:'jours consécutifs',en:'days in a row',es:'días seguidos',ht:'jou konsekitif',de:'Tage in Folge'})[S.nativeLang||'fr'] || 'jours consécutifs';
  } else {
    banner.style.display = 'none'; banner.style.flexDirection = '';
  }
};

// ================================================================
// QUOTE — récompense post-session (pas au démarrage)
// ================================================================
window.rewardWithQuote = function(callback) {
  if ((S.chatHistory||[]).length < 2) { if (callback) callback(); return; }
  if (typeof showDailyQuote === 'function') {
    showDailyQuote(function() { if (callback) callback(); });
  } else {
    if (callback) callback();
  }
};

window.showQuoteThenMenu = function() {
  if (typeof showDailyQuote === 'function') {
    showDailyQuote(function() { _goToMenu(); });
  } else {
    _goToMenu();
  }
};

// ================================================================
// STARTER SUGGESTIONS — rampe de sécurité post-guided
// ================================================================
var STARTERS = {
  fr:["Bonjour ! Comment ça va ?","Pouvez-vous m'aider ?","Je voudrais apprendre...","C'est quoi ce mot ?","Comment dit-on... ?","Parlez plus lentement, s'il vous plaît."],
  en:["Hello! How are you?","Can you help me?","I would like to learn...","What does this word mean?","How do you say...?","Please speak more slowly."],
  es:["¡Hola! ¿Cómo estás?","¿Me puedes ayudar?","Me gustaría aprender...","¿Qué significa esta palabra?","¿Cómo se dice...?","Habla más despacio, por favor."],
  de:["Hallo! Wie geht es Ihnen?","Können Sie mir helfen?","Ich möchte lernen...","Was bedeutet dieses Wort?","Wie sagt man...?","Bitte sprechen Sie langsamer."],
  ru:["Здравствуйте! Как дела?","Можете мне помочь?","Я хочу научиться...","Что значит это слово?","Как сказать...?","Говорите медленнее, пожалуйста."],
  zh:["你好！你好吗？","你能帮我吗？","我想学...","这个词是什么意思？","怎么说...？","请说慢一点。"],
  ja:["こんにちは！お元気ですか？","手伝ってもらえますか？","〜を学びたいです。","この言葉はどういう意味ですか？","もっとゆっくり話してください。"],
  ht:["Bonjou! Kijan ou ye?","Eske ou ka ede mwen?","Mwen vle aprann...","Kisa mo sa vle di?","Pale dousman, tanpri."]
};

window.showStarterSuggestions = function() {
  var tl        = (window.S && S.targetLang) || 'fr';
  var container = document.getElementById('starterRow');
  if (!container) return;
  var picked = (STARTERS[tl]||STARTERS.fr).slice().sort(function(){return Math.random()-0.5;}).slice(0,3);
  container.innerHTML = '';
  picked.forEach(function(text) {
    var chip = document.createElement('button');
    chip.className   = 'starter-chip';
    chip.textContent = text;
    chip.onclick = function() {
      var inp = document.getElementById('dialInput') || document.getElementById('dlg-input');
      if (inp) { inp.value = text; inp.focus(); }
      chip.style.opacity = '0'; chip.style.transform = 'scale(0.9)';
      setTimeout(function() { chip.remove(); }, 200);
    };
    container.appendChild(chip);
  });
  container.style.display = 'flex';
};

window.hideStarterSuggestions = function() {
  var c = document.getElementById('starterRow');
  if (c) c.style.display = 'none';
};

// Masquer les starters quand l'utilisateur tape
document.addEventListener('DOMContentLoaded', function() {
  ['dialInput','dlg-input'].forEach(function(id) {
    var inp = document.getElementById(id);
    if (inp) {
      inp.addEventListener('input', function() {
        if (this.value.length > 0) { window.hideStarterSuggestions(); }
        else { window.showStarterSuggestions(); }
      });
    }
  });
});

// ================================================================
// UTILITAIRES
// ================================================================
window.escapeHtml = function(t) {
  return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
};

function openWordGame() {
  if (window.LV_WORDGAME) window.LV_WORDGAME.open();
  else if (typeof showNotif === 'function') showNotif('Jeu de mots non chargé.');
}

function resetOnboarding() {
  try { localStorage.removeItem('lv_onboarding_done'); } catch(e) {}
  try { localStorage.removeItem('lv_last_quote_idx');  } catch(e) {}
  if (typeof showNotif === 'function') showNotif('Onboarding réinitialisé');
}

// Compatibilité ancienne version
window.startMenu       = _goToMenu;
window.startOnboarding = _startOnboarding;

console.log('✅ app_v2.js chargé — PLI: ' + Math.round(window.PLI.ratio()*100) + '% | LV_SOUND: ' + (window.LV_SOUND?'✓':'✗') + ' | LV_ANIM: ' + (window.LV_ANIM?'✓':'✗'));
