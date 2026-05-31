// LinguaVillage — app_v2.js
// Refonte complète du flux principal
// Innovations :
//   1. API warmup silencieux au démarrage
//   2. Progressive Linguistic Immersion (PLI) — ratio bilingue dynamique
//   3. Quote déplacée en récompense post-session
//   4. Starter suggestions dans le dialogue libre
//   5. XP toast visuel + perte potentielle (loss aversion)
//   6. Détection session vs onboarding
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

// ── Progressive Linguistic Immersion (PLI) ──────────────────────
// Ajuste dynamiquement le ratio langue-cible / langue-native
// selon le niveau XP de l'utilisateur
window.PLI = {
  // Retourne le ratio (0-1) de langue cible à utiliser
  ratio: function() {
    var xp = (window.S && S.xp) || 0;
    // 0 XP → 45% cible | 500 XP → 70% | 1500 XP → 88% | 3000+ → 97%
    if (xp >= 3000) return 0.97;
    if (xp >= 1500) return 0.88;
    if (xp >= 500)  return 0.70;
    if (xp >= 200)  return 0.58;
    return 0.45;
  },

  // Construit le prompt système pour le NPC
  buildPrompt: function(npcName, npcRole, location, npcLang, playerName, playerNative) {
    var r = this.ratio();
    var pct = Math.round(r * 100);
    var nativePct = 100 - pct;
    var nl = playerNative || 'fr';
    var nativeNames = {
      fr:'français', en:'anglais', es:'espagnol',
      ht:'créole haïtien', de:'allemand', ru:'russe',
      zh:'mandarin', ja:'japonais'
    };
    var nativeName = nativeNames[nl] || nl;
    var targetName = nativeNames[npcLang] || npcLang;

    return [
      'Tu es ' + npcName + ', ' + npcRole + ' à ' + location + '.',
      'Tu parles à ' + playerName + ' qui apprend le ' + targetName + '.',
      '',
      '📊 RÈGLE PLI (Progressive Linguistic Immersion) :',
      '- Utilise ' + pct + '% de tes réponses EN ' + targetName.toUpperCase(),
      '- Utilise ' + nativePct + '% EN ' + nativeName + ' pour clarifier les mots difficiles',
      '- Pour un mot inconnu, écris-le en cible puis (traduction) en parenthèses',
      '- Adapte la complexité au niveau détecté — reste naturel',
      '',
      'CORRECTION BIENVEILLANTE :',
      '- Si ' + playerName + ' fait une erreur, corrige-la UNE FOIS avec tact',
      '- Format : ✨ "version correcte" — brève explication (1 ligne max)',
      '- Ne jamais interrompre la conversation pour corriger',
      '',
      'PERSONNALITÉ :',
      '- Sois chaleureux, humain, un peu espiègle',
      '- Pose des questions courtes pour relancer',
      '- Évite les réponses > 3 phrases',
      '- Utilise occasionnellement des expressions idiomatiques'
    ].join('\n');
  },

  // Met à jour l'indicateur visuel PLI dans le header dialogue
  updateBar: function() {
    var r = this.ratio();
    var pct = Math.round(r * 100);
    var fill = document.getElementById('pliBarFill');
    var label = document.getElementById('pliPct');
    if (fill) fill.style.width = pct + '%';
    if (label) {
      var tl = (window.S && S.targetLang) || 'fr';
      label.textContent = pct + '% ' + (window.LANG_NAMES[tl] || tl);
    }
  }
};

// ================================================================
// DÉMARRAGE
// ================================================================
window.addEventListener('DOMContentLoaded', function() {
  // ── Splash screen LinguaVillage (non-invasif) ──
  // Si LV_ANIM est disponible, on lance le splash puis l'init normale.
  // Sinon, on lance directement l'init — le flux original est préservé.
  function _doInit() {
    // 1. Warmup API silencieux — évite le timeout au premier vrai appel
    _warmupAPI();

    // 2. S'assurer que window.S existe
    if (!window.S) {
      window.S = {
        nativeLang: null, targetLang: null,
        playerName: '', scriptPref: 'both',
        xp: 0, level: 1, userLevel: 'zero',
        chatHistory: [], currentNPC: null, currentLoc: null,
        xpBoostEnd: null
      };
    }

    // 3. Restaurer une session existante
    if (window._LINGUA_HAS_SAVE && S.playerName && S.nativeLang && S.targetLang) {
      try {
        if (typeof applyUI === 'function') applyUI(S.nativeLang);
        _initSession();
        return;
      } catch(e) { console.warn('Restore failed:', e); }
    }

    // 4. Nouveau joueur — afficher l'écran d'accueil
    _initWelcomeScreen();
  }

  if (window.LV_ANIM && typeof window.LV_ANIM.showSplash === 'function') {
    window.LV_ANIM.showSplash(function() { _doInit(); });
  } else {
    _doInit();
  }
});

// ── Warmup API ──────────────────────────────────────────────────
function _warmupAPI() {
  // Requête légère, silencieuse — réveille Replit si endormi
  fetch(API + '/ping', {
    method: 'GET',
    signal: AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined
  }).catch(function() {
    // Silencieux — l'utilisateur ne voit rien
    console.log('API warmup attempted');
  });
}

// ================================================================
// WELCOME SCREEN — initialisation des interactions
// ================================================================
function _initWelcomeScreen() {
  var nativeTiles = document.querySelectorAll('.lang-tile[data-native]');
  var targetTiles = document.querySelectorAll('.lang-tile[data-lang]');
  var step2   = document.getElementById('step2');
  var step3   = document.getElementById('step3');
  var step4   = document.getElementById('step4');
  var playBtn = document.getElementById('playBtn');
  var nameInput = document.getElementById('inputName');

  // ── Sélection langue native ──────────────────────────────────
  nativeTiles.forEach(function(tile) {
    tile.onclick = function() {
      nativeTiles.forEach(function(t) { t.classList.remove('active','sel'); });
      this.classList.add('active','sel');
      S.nativeLang = this.dataset.native;
      if (typeof applyUI === 'function') applyUI(S.nativeLang);
      _showStep(step2);
      // Désactiver la même langue en cible
      targetTiles.forEach(function(t) {
        var isSame = t.dataset.lang === S.nativeLang;
        t.classList.toggle('disabled', isSame);
        if (isSame) t.classList.remove('active','sel');
      });
      if (nameInput) setTimeout(function() { nameInput.focus(); }, 120);
    };
  });

  // ── Saisie du prénom ─────────────────────────────────────────
  if (nameInput) {
    nameInput.addEventListener('input', function() {
      if (this.value.trim() && S.nativeLang) {
        _showStep(step3);
      } else {
        _hideStep(step3);
        _hideStep(step4);
        _hidePlayBtn(playBtn);
      }
    });
  }

  // ── Sélection langue cible ───────────────────────────────────
  targetTiles.forEach(function(tile) {
    tile.onclick = function() {
      if (this.classList.contains('disabled')) return;
      targetTiles.forEach(function(t) { t.classList.remove('active','sel'); });
      this.classList.add('active','sel');
      S.targetLang = this.dataset.lang;

      var isCJK = ['zh','ja','ru'].includes(S.targetLang);
      if (isCJK) {
        _showStep(step4);
        var examples = {
          zh: { n:'你好', r:'Nǐ hǎo' },
          ja: { n:'こんにちは', r:'Konnichiwa' },
          ru: { n:'Привет', r:'Privyet' }
        };
        var ex = examples[S.targetLang] || { n:'', r:'' };
        var scN = document.getElementById('sc-n');
        var scR = document.getElementById('sc-r');
        if (scN) scN.textContent = ex.n;
        if (scR) scR.textContent = ex.r;
        S.scriptPref = null;
        document.querySelectorAll('.sc-btn').forEach(function(b) {
          b.classList.remove('sel','active');
        });
        _hidePlayBtn(playBtn);
      } else {
        S.scriptPref = 'both';
        _hideStep(step4);
        _showPlayBtn(playBtn);
      }
    };
  });

  // ── Sélection script (CJK) ───────────────────────────────────
  window.selScript = function(pref, btn) {
    document.querySelectorAll('.sc-btn').forEach(function(b) {
      b.classList.remove('sel','active');
    });
    if (btn) btn.classList.add('sel','active');
    S.scriptPref = pref;
    _showPlayBtn(playBtn);
  };

  // ── CTA principal ────────────────────────────────────────────
  if (playBtn) {
    playBtn.addEventListener('click', function() {
      var name = nameInput ? nameInput.value.trim() : '';
      if (!name)           { showNotif('✏️ Entrez votre prénom !');       return; }
      if (!S.nativeLang)   { showNotif('🌍 Choisissez votre langue !');   return; }
      if (!S.targetLang)   { showNotif('🎯 Choisissez une langue cible !');return; }
      if (['zh','ja','ru'].includes(S.targetLang) && !S.scriptPref) {
        showNotif('✍️ Choisissez un mode d\'écriture !');
        return;
      }
      S.playerName = name;
      if (typeof saveGame === 'function') saveGame();
      _startOnboarding();
    });
  }
}

// ── Helpers visibility ──────────────────────────────────────────
function _showStep(el) {
  if (!el) return;
  el.style.display = 'block';
  el.classList.add('form-step');
}
function _hideStep(el) {
  if (!el) return;
  el.style.display = 'none';
}
function _showPlayBtn(btn) {
  if (!btn) return;
  var t = (UI_TEXT && UI_TEXT[S.nativeLang]) || (UI_TEXT && UI_TEXT.fr) || {};
  btn.textContent = t.play || '✨ Commencer';
  btn.style.display = 'block';
  btn.disabled = false;
}
function _hidePlayBtn(btn) {
  if (!btn) return;
  btn.style.display = 'none';
  btn.disabled = true;
}

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

// Session existante : aller directement au menu (sans quote au départ)
function _initSession() {
  _goToMenu();
  try { if (typeof checkDailyStreak === 'function') checkDailyStreak(); } catch(e) {}
}

// ================================================================
// MENU PRINCIPAL
// ================================================================
function _goToMenu() {
  try { localStorage.setItem('lv_onboarding_done', '1'); } catch(e) {}

  // Mise à jour des affichages
  var menuPlayer  = document.getElementById('menuPlayer');
  var menuLang    = document.getElementById('menuLang');
  var menuXP      = document.getElementById('menuXP');
  var gemDisplay  = document.getElementById('gemDisplay');
  var xpFill      = document.getElementById('xpFill');
  var menuGreet   = document.getElementById('menuGreeting');

  if (menuPlayer) menuPlayer.textContent = '👤 ' + (S.playerName || 'Joueur');
  if (menuLang) {
    var flag  = (FLAGS[S.targetLang]) || '';
    var lname = (LANG_NAMES[S.targetLang]) || S.targetLang || '';
    menuLang.textContent = flag + ' ' + lname;
  }
  if (menuXP) menuXP.textContent = (S.xp || 0) + ' XP';
  if (gemDisplay) gemDisplay.textContent = '💎 ' + ((S_missions && S_missions.gems) || 0);
  if (xpFill) xpFill.style.width = ((S.xp || 0) % 100) + '%';

  // Message de bienvenue personnalisé selon l'heure
  if (menuGreet) {
    var hour = new Date().getHours();
    var greetings = {
      fr: [
        hour < 12 ? 'Bonjour' : hour < 18 ? 'Bonsoir' : 'Bonne nuit',
        (S.playerName || '') + ' !'
      ],
      en: [
        hour < 12 ? 'Good morning' : hour < 18 ? 'Good evening' : 'Good night',
        (S.playerName || '') + '!'
      ],
      es: [
        hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches',
        (S.playerName || '') + '!'
      ]
    };
    var nl = S.nativeLang || 'fr';
    var g = greetings[nl] || greetings.fr;
    menuGreet.textContent = g[0] + ', ' + g[1];
  }

  try { if (typeof saveGame === 'function') saveGame(); } catch(e) {}
  try { if (typeof updateStreak === 'function') updateStreak(); } catch(e) {}

  showScreen('screen-menu');

  // Alphabet pour langues complexes — une seule fois
  try {
    if (window.LV_ALPHABET && typeof window.LV_ALPHABET.maybeShowOnboarding === 'function') {
      window.LV_ALPHABET.maybeShowOnboarding();
    }
  } catch(e) {}
}

// ================================================================
// RÉCOMPENSE POST-SESSION — Quote comme récompense, pas comme taxe
// Appelée uniquement APRÈS une session active (dialogue, vocab, etc.)
// ================================================================
window.rewardWithQuote = function(callback) {
  // Ne pas afficher si la session était très courte (< 3 messages)
  var msgs = (S.chatHistory || []).length;
  if (msgs < 2) {
    if (callback) callback();
    return;
  }

  if (typeof showDailyQuote === 'function') {
    showDailyQuote(function() {
      if (callback) callback();
    });
  } else {
    if (callback) callback();
  }
};

// ── Rétrocompatibilité — showQuoteThenMenu ──────────────────────
window.showQuoteThenMenu = function() {
  // Comportement de l'ancienne version : quote → menu (onboarding initial)
  if (typeof showDailyQuote === 'function') {
    showDailyQuote(function() { _goToMenu(); });
  } else {
    _goToMenu();
  }
};

// ================================================================
// SYSTÈME XP PREMIUM — Visuels + Loss Aversion
// ================================================================

// Remplace gainXP avec animation toast
window.gainXP = function(amount, sourceEl) {
  if (!S || !amount) return;
  S.xp = (S.xp || 0) + amount;

  // Mise à jour HUD
  var hudXP   = document.getElementById('hudXP');
  var menuXP  = document.getElementById('menuXP');
  var xpFill  = document.getElementById('xpFill');
  if (hudXP)  hudXP.textContent  = S.xp + ' XP';
  if (menuXP) menuXP.textContent = S.xp + ' XP';
  if (xpFill) xpFill.style.width = (S.xp % 100) + '%';

  // Toast visuel XP flottant
  _showXPToast('+' + amount + ' XP', sourceEl);

  // PLI bar update si en dialogue
  if (typeof PLI !== 'undefined') PLI.updateBar();

  if (typeof checkBadges === 'function') checkBadges();
  if (typeof saveGame   === 'function') saveGame();
};

// Toast XP qui monte depuis le bouton source
function _showXPToast(text, sourceEl) {
  var toast = document.createElement('div');
  toast.className = 'xp-toast';
  toast.textContent = text;

  var x = window.innerWidth / 2;
  var y = window.innerHeight / 2;
  if (sourceEl) {
    var r = sourceEl.getBoundingClientRect();
    x = r.left + r.width / 2;
    y = r.top;
  }

  toast.style.cssText = [
    'left:' + x + 'px;',
    'top:' + y + 'px;',
    'transform:translate(-50%,0);'
  ].join('');

  document.body.appendChild(toast);
  setTimeout(function() { toast.remove(); }, 1300);
}

// ================================================================
// NAVIGATION
// ================================================================
window.showScreen = function(id) {
  document.querySelectorAll('.screen').forEach(function(s) {
    s.classList.remove('active');
    s.style.display = '';
  });
  var target = document.getElementById(id);
  if (target) target.classList.add('active');
};

// ================================================================
// STARTER SUGGESTIONS — rampe de sécurité du dialogue libre
// Affiche 3 suggestions dans la langue cible pour briser le silence
// ================================================================
var STARTERS = {
  fr: [
    "Bonjour ! Comment ça va ?",
    "Pouvez-vous m'aider ?",
    "Je voudrais apprendre...",
    "C'est quoi ce mot ?",
    "Comment dit-on... ?",
    "Parlez plus lentement, s'il vous plaît."
  ],
  en: [
    "Hello! How are you?",
    "Can you help me?",
    "I would like to learn...",
    "What does this word mean?",
    "How do you say...?",
    "Please speak more slowly."
  ],
  es: [
    "¡Hola! ¿Cómo estás?",
    "¿Me puedes ayudar?",
    "Me gustaría aprender...",
    "¿Qué significa esta palabra?",
    "¿Cómo se dice...?",
    "Habla más despacio, por favor."
  ],
  de: [
    "Hallo! Wie geht es Ihnen?",
    "Können Sie mir helfen?",
    "Ich möchte lernen...",
    "Was bedeutet dieses Wort?",
    "Wie sagt man...?",
    "Bitte sprechen Sie langsamer."
  ],
  ru: [
    "Здравствуйте! Как дела?",
    "Можете мне помочь?",
    "Я хочу научиться...",
    "Что значит это слово?",
    "Как сказать...?",
    "Говорите медленнее, пожалуйста."
  ],
  zh: [
    "你好！你好吗？",
    "你能帮我吗？",
    "我想学...",
    "这个词是什么意思？",
    "怎么说...？",
    "请说慢一点。"
  ],
  ja: [
    "こんにちは！お元気ですか？",
    "手伝ってもらえますか？",
    "〜を学びたいです。",
    "この言葉はどういう意味ですか？",
    "〜は日本語でどう言いますか？",
    "もっとゆっくり話してください。"
  ],
  ht: [
    "Bonjou! Kijan ou ye?",
    "Eske ou ka ede mwen?",
    "Mwen vle aprann...",
    "Kisa mo sa vle di?",
    "Kijan ou di...?",
    "Pale dousman, tanpri."
  ]
};

window.showStarterSuggestions = function() {
  var tl = S.targetLang || 'fr';
  var pool = STARTERS[tl] || STARTERS.fr;
  var container = document.getElementById('starterRow');
  if (!container) return;

  // Sélectionner 3 starters aléatoires
  var shuffled = pool.slice().sort(function() { return Math.random() - 0.5; });
  var picked = shuffled.slice(0, 3);

  container.innerHTML = '';
  picked.forEach(function(text) {
    var chip = document.createElement('button');
    chip.className = 'starter-chip';
    chip.textContent = text;
    chip.onclick = function() {
      var inp = document.getElementById('dialInput');
      if (inp) {
        inp.value = text;
        inp.focus();
        // Effet visuel : le chip disparaît
        chip.style.opacity = '0';
        chip.style.transform = 'scale(0.9)';
        setTimeout(function() { chip.remove(); }, 200);
      }
    };
    container.appendChild(chip);
  });

  container.style.display = 'flex';
};

window.hideStarterSuggestions = function() {
  var container = document.getElementById('starterRow');
  if (container) container.style.display = 'none';
};

// Masquer les starters dès que l'utilisateur tape
document.addEventListener('DOMContentLoaded', function() {
  var dialInput = document.getElementById('dialInput');
  if (dialInput) {
    dialInput.addEventListener('input', function() {
      if (this.value.length > 0) {
        hideStarterSuggestions();
      } else {
        showStarterSuggestions();
      }
    });
  }
});

// ================================================================
// STREAK — Mise à jour visuelle premium
// ================================================================
window.updateStreak = function() {
  try { if (typeof checkDailyStreak   === 'function') checkDailyStreak();   } catch(e) {}
  try { if (typeof updateStreakDisplay === 'function') updateStreakDisplay(); } catch(e) {}

  // Mise à jour du banner menu
  var G = window.S_game;
  if (!G) return;
  var streakBanner = document.getElementById('streakBanner');
  if (!streakBanner) return;

  if (G.streak > 0) {
    streakBanner.style.display = 'flex';
    var streakVal = document.getElementById('streakVal');
    var streakLabel = document.getElementById('streakLabel');
    if (streakVal) streakVal.textContent = G.streak + ' 🔥';
    if (streakLabel) {
      var nl = S.nativeLang || 'fr';
      var labels = {
        fr: 'jours consécutifs',
        en: 'days in a row',
        es: 'días seguidos',
        ht: 'jou konsekitif',
        de: 'Tage in Folge'
      };
      streakLabel.textContent = labels[nl] || labels.fr;
    }
  } else {
    streakBanner.style.display = 'none';
  }
};

// ================================================================
// CONFETTI PREMIUM
// ================================================================
window.launchConfetti = function() {
  var colors = ['#FFD700','#E8B84B','#4ecf70','#4a9eff','#c084fc','#ff9f43'];
  for (var i = 0; i < 70; i++) {
    (function(delay) {
      setTimeout(function() {
        var c = document.createElement('div');
        var size = 5 + Math.random() * 9;
        var isCircle = Math.random() > 0.5;
        c.style.cssText = [
          'position:fixed;',
          'top:-10px;',
          'left:' + (Math.random() * 100) + '%;',
          'width:' + size + 'px;height:' + size + 'px;',
          'background:' + colors[Math.floor(Math.random() * colors.length)] + ';',
          'border-radius:' + (isCircle ? '50%' : '2px') + ';',
          'z-index:99999;pointer-events:none;opacity:1;',
          'transition:transform 1.1s cubic-bezier(0.25,0.46,0.45,0.94),opacity 0.4s ease 0.9s'
        ].join('');
        document.body.appendChild(c);
        requestAnimationFrame(function() {
          setTimeout(function() {
            var drift = (Math.random() - 0.5) * 80;
            c.style.transform = 'translateY(' + (window.innerHeight + 20) + 'px) translateX(' + drift + 'px) rotate(' + (Math.random() * 720) + 'deg)';
            c.style.opacity = '0';
          }, 20);
        });
        setTimeout(function() { c.remove(); }, 2200);
      }, delay);
    })(i * 25);
  }
};

// ================================================================
// NOTIFICATION PREMIUM
// ================================================================
window.showNotif = function(msg, duration) {
  var el = document.getElementById('notif');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(window._notifTimer);
  window._notifTimer = setTimeout(function() {
    el.classList.remove('show');
  }, duration || 2800);
};

// ================================================================
// UTILITAIRES
// ================================================================
window.escapeHtml = function(t) {
  return String(t)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
};

function openWordGame() {
  if (window.LV_WORDGAME) window.LV_WORDGAME.open();
  else showNotif('Jeu de mots non chargé.');
}

function resetOnboarding() {
  try { localStorage.removeItem('lv_onboarding_done'); } catch(e) {}
  try { localStorage.removeItem('lv_last_quote_idx');  } catch(e) {}
  showNotif('Onboarding réinitialisé');
}

// ================================================================
// EXPORT FONCTIONS PUBLIQUES (compatibilité ancienne version)
// ================================================================
window.startMenu       = _goToMenu;
window.startOnboarding = _startOnboarding;

console.log('✅ app_v2.js chargé — PLI ratio: ' + Math.round(window.PLI.ratio() * 100) + '%');
