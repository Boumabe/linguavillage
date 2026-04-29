// LinguaVillage — state.js
// CHARGÉ EN TOUT PREMIER dans index.html (avant data.js)
// Définit : window.S, showScreen, applyUI, showNotif, gainXP, saveGame,
//           updateStreak, launchConfetti, callAPIWithFallback

// =================================================================
// 1. ÉTAT GLOBAL DU JOUEUR
// =================================================================
window.S = window.S || {
  playerName   : '',
  nativeLang   : '',
  targetLang   : '',
  scriptPref   : 'both',
  xp           : 0,
  chatHistory  : [],
  currentNPC   : null,
  currentLoc   : null,
};
var S = window.S;

// =================================================================
// 2. NAVIGATION — showScreen
// =================================================================
window.showScreen = function(id) {
  document.querySelectorAll('.screen').forEach(function(s) {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  var el = document.getElementById(id);
  if (el) {
    el.classList.add('active');
    el.style.display = 'flex';
  }
};

// =================================================================
// 3. TRADUCTION UI — applyUI
// =================================================================
window.applyUI = function(lang) {
  if (typeof UI_TEXT === 'undefined') return;
  var t = UI_TEXT[lang] || UI_TEXT['fr'];
  if (!t) return;

  // Welcome screen
  var sub = document.getElementById('ws-sub');
  if (sub) sub.textContent = t.sub || '';

  var lblNative = document.getElementById('lbl-native');
  if (lblNative) lblNative.textContent = t.lbl_native || '';

  var lblName = document.getElementById('lbl-name');
  if (lblName) lblName.textContent = t.lbl_name || '';

  var lblTarget = document.getElementById('lbl-target');
  if (lblTarget) lblTarget.textContent = t.lbl_target || '';

  var lblScript = document.getElementById('lbl-script');
  if (lblScript) lblScript.textContent = t.lbl_script || '';

  var playBtn = document.getElementById('playBtn');
  if (playBtn) playBtn.textContent = t.play || '✨ Commencer';

  // Menu principal
  var menuTitle = document.getElementById('menu-title-text');
  if (menuTitle) menuTitle.textContent = t.menu_title || '';

  var menuSub = document.getElementById('menu-sub-text');
  if (menuSub) menuSub.textContent = t.menu_sub || '';

  var mbVillage = document.getElementById('mb-village');
  if (mbVillage) mbVillage.textContent = t.mb_village || '';

  var mbVillageD = document.getElementById('mb-village-d');
  if (mbVillageD) mbVillageD.textContent = t.mb_village_d || '';

  var mbVocab = document.getElementById('mb-vocab');
  if (mbVocab) mbVocab.textContent = t.mb_vocab || '';

  var mbVocabD = document.getElementById('mb-vocab-d');
  if (mbVocabD) mbVocabD.textContent = t.mb_vocab_d || '';

  var mbPhrases = document.getElementById('mb-phrases');
  if (mbPhrases) mbPhrases.textContent = t.mb_phrases || '';

  var mbPhrasesD = document.getElementById('mb-phrases-d');
  if (mbPhrasesD) mbPhrasesD.textContent = t.mb_phrases_d || '';

  var mbGrammar = document.getElementById('mb-grammar');
  if (mbGrammar) mbGrammar.textContent = t.mb_grammar || '';

  var mbGrammarD = document.getElementById('mb-grammar-d');
  if (mbGrammarD) mbGrammarD.textContent = t.mb_grammar_d || '';

  var mbDict = document.getElementById('mb-dict');
  if (mbDict) mbDict.textContent = t.mb_dict || '';

  var mbDictD = document.getElementById('mb-dict-d');
  if (mbDictD) mbDictD.textContent = t.mb_dict_d || '';
};

// =================================================================
// 4. NOTIFICATIONS — showNotif
// =================================================================
window.showNotif = function(msg, duration) {
  var el = document.getElementById('notif');
  if (!el) return;
  el.textContent = msg;
  el.className = 'notif show';
  clearTimeout(window._notifTimer);
  window._notifTimer = setTimeout(function() {
    el.className = 'notif';
  }, duration || 2800);
};

// =================================================================
// 5. XP — gainXP
// =================================================================
window.gainXP = function(amount) {
  if (!window.S) return;
  S.xp = (S.xp || 0) + (amount || 0);

  // Mise à jour HUD
  var hudXP = document.getElementById('hudXP');
  if (hudXP) hudXP.textContent = S.xp + ' XP';

  var menuXP = document.getElementById('menuXP');
  if (menuXP) menuXP.textContent = S.xp + ' XP';

  var xpFill = document.getElementById('xpFill');
  if (xpFill) xpFill.style.width = (S.xp % 100) + '%';

  // Badge CEFR
  if (typeof checkBadges === 'function') checkBadges();

  saveGame();
};

// =================================================================
// 6. SAUVEGARDE — saveGame
// =================================================================
window.saveGame = function() {
  try {
    var data = {
      S       : window.S,
      missions: window.S_missions,
      game    : window.S_game,
    };
    localStorage.setItem('linguavillage_save', JSON.stringify(data));
  } catch(e) {
    console.warn('saveGame failed:', e);
  }
};

// =================================================================
// 7. STREAK — updateStreak
// =================================================================
window.updateStreak = function() {
  if (typeof checkDailyStreak === 'function') {
    try { checkDailyStreak(); } catch(e) {}
  }
  if (typeof updateStreakDisplay === 'function') {
    try { updateStreakDisplay(); } catch(e) {}
  }
};

// =================================================================
// 8. CONFETTI — launchConfetti
// =================================================================
window.launchConfetti = function() {
  var colors = ['#FFD700','#4ecf70','#4a9eff','#e040fb','#ff9f43','#ff6b6b'];
  for (var i = 0; i < 60; i++) {
    (function(i) {
      setTimeout(function() {
        var c = document.createElement('div');
        c.style.cssText = [
          'position:fixed',
          'top:-10px',
          'left:' + (Math.random() * 100) + '%',
          'width:' + (6 + Math.random() * 8) + 'px',
          'height:' + (6 + Math.random() * 8) + 'px',
          'background:' + colors[Math.floor(Math.random() * colors.length)],
          'border-radius:' + (Math.random() > 0.5 ? '50%' : '2px'),
          'z-index:99999',
          'pointer-events:none',
          'opacity:1',
          'transition:transform ' + (1 + Math.random()) + 's ease-out, opacity 0.5s ease ' + (0.8 + Math.random() * 0.5) + 's',
        ].join(';');
        document.body.appendChild(c);
        setTimeout(function() {
          c.style.transform = 'translateY(' + (window.innerHeight + 20) + 'px) rotate(' + (Math.random() * 720) + 'deg)';
          c.style.opacity = '0';
        }, 20);
        setTimeout(function() { c.remove(); }, 2000);
      }, i * 30);
    })(i);
  }
};

// =================================================================
// 9. API AVEC FALLBACK — callAPIWithFallback
// =================================================================
window.callAPIWithFallback = async function(endpoint, payload) {
  var base = window.API || '';
  var url  = base + endpoint;

  // Throttle
  var now = Date.now();
  if (window._lastAPICall && (now - window._lastAPICall) < (window.MIN_API_INTERVAL || 1000)) {
    await new Promise(function(r) { setTimeout(r, window.MIN_API_INTERVAL || 1000); });
  }
  window._lastAPICall = Date.now();

  // Cache
  var cacheKey = endpoint + JSON.stringify(payload);
  if (window.apiCache && window.apiCache.has(cacheKey)) {
    return window.apiCache.get(cacheKey);
  }

  var resp = await fetch(url, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify(payload),
  });

  if (!resp.ok) throw new Error('API ' + resp.status);
  var data = await resp.json();

  if (window.apiCache) window.apiCache.set(cacheKey, data);
  return data;
};

// =================================================================
// 10. BADGE DE CHARGEMENT
// =================================================================
(function() {
  var dbg = document.getElementById('debug');
  if (dbg) dbg.textContent = '✅ state.js chargé';
})();

console.log('✅ LinguaVillage — state.js chargé');
