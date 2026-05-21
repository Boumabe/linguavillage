// LinguaVillage — app.js (version premium avec activation immédiate)
// ================================================================

var API = 'https://linguavillage-api--marckensbou2.replit.app';

window.addEventListener('DOMContentLoaded', function() {
  if (!window.S) {
    window.S = { nativeLang: null, targetLang: null, playerName: '', scriptPref: 'both', xp: 0 };
  }
  // Restaurer session
  if (window._LINGUA_HAS_SAVE && window.S && S.playerName && S.nativeLang && S.targetLang) {
    try {
      if (typeof applyUI === 'function') applyUI(S.nativeLang);
      startMenu();
      try { if (typeof checkDailyStreak === 'function') checkDailyStreak(); } catch(e) {}
      return;
    } catch(e) { console.warn('Restore session failed:', e); }
  }

  // Sélection langue maternelle
  document.querySelectorAll('.lang-tile[data-native]').forEach(function(t) {
    t.onclick = function() {
      if (!window.S) window.S = { nativeLang: null, targetLang: null, playerName: '', scriptPref: 'both', xp: 0 };
      document.querySelectorAll('.lang-tile[data-native]').forEach(x => x.classList.remove('active','sel'));
      this.classList.add('active','sel');
      window.S.nativeLang = this.dataset.native;
      try { if (typeof applyUI === 'function') applyUI(window.S.nativeLang); } catch(e) {}
      var s2 = document.getElementById('step2');
      if (s2) { s2.style.display = 'block'; s2.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      var s3 = document.getElementById('step3');
      var s4 = document.getElementById('step4');
      var pb = document.getElementById('playBtn');
      if (s3) s3.style.display = 'none';
      if (s4) s4.style.display = 'none';
      if (pb) { pb.style.display = 'none'; pb.disabled = true; }
      var inp = document.getElementById('inputName');
      if (inp) inp.value = '';
      document.querySelectorAll('.lang-tile[data-lang]').forEach(function(o) {
        var same = o.dataset.lang === window.S.nativeLang;
        o.classList.toggle('disabled', same);
        if (same) o.classList.remove('active','sel');
      });
      setTimeout(function() { document.getElementById('inputName').focus(); }, 300);
    };
  });

  // Saisie prénom
  var inputName = document.getElementById('inputName');
  if (inputName) {
    inputName.addEventListener('input', function() {
      var hasValue = this.value.trim().length > 0;
      var hasNative = window.S && window.S.nativeLang;
      var s3 = document.getElementById('step3');
      var s4 = document.getElementById('step4');
      var pb = document.getElementById('playBtn');
      if (s3) s3.style.display = (hasValue && hasNative) ? 'block' : 'none';
      if (s4) s4.style.display = 'none';
      if (pb) { pb.style.display = 'none'; pb.disabled = true; }
      document.querySelectorAll('.lang-tile[data-lang]').forEach(x => x.classList.remove('active','sel'));
      window.S.targetLang = null;
    });
  }

  // Sélection langue cible
  document.querySelectorAll('.lang-tile[data-lang]').forEach(function(t) {
    t.onclick = function() {
      if (this.classList.contains('disabled')) return;
      document.querySelectorAll('.lang-tile[data-lang]').forEach(x => x.classList.remove('active','sel'));
      this.classList.add('active','sel');
      window.S.targetLang = this.dataset.lang;
      var cjk = ['zh','ja','ru'].indexOf(window.S.targetLang) !== -1;
      var s4 = document.getElementById('step4');
      var pb = document.getElementById('playBtn');
      if (cjk) {
        if (s4) { s4.style.display = 'block'; s4.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        var lb = { zh:{ n:'你好', r:'Ni hao' }, ja:{ n:'こんにちは', r:'Konnichiwa' }, ru:{ n:'Привет', r:'Privyet' } };
        var sn = document.getElementById('sc-n');
        var sr = document.getElementById('sc-r');
        if (sn) sn.textContent = lb[window.S.targetLang].n;
        if (sr) sr.textContent = lb[window.S.targetLang].r;
        window.S.scriptPref = null;
        document.querySelectorAll('.sc-btn').forEach(b => b.classList.remove('sel','active'));
        if (pb) { pb.style.display = 'none'; pb.disabled = true; }
      } else {
        window.S.scriptPref = 'both';
        if (s4) s4.style.display = 'none';
        var nativeLang = window.S.nativeLang || 'fr';
        var uiText = (typeof UI_TEXT !== 'undefined' && UI_TEXT[nativeLang]) ? UI_TEXT[nativeLang] : UI_TEXT.fr;
        if (pb) {
          pb.textContent = uiText.play || '✨ Commencer';
          pb.style.display = 'block';
          pb.disabled = false;
          pb.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };
  });

  window.selScript = function(pref, btn) {
    document.querySelectorAll('.sc-btn').forEach(b => b.classList.remove('sel','active'));
    if (btn) btn.classList.add('sel','active');
    window.S.scriptPref = pref;
    var pb = document.getElementById('playBtn');
    if (pb) {
      var nativeLang = window.S.nativeLang || 'fr';
      var uiText = (typeof UI_TEXT !== 'undefined' && UI_TEXT[nativeLang]) ? UI_TEXT[nativeLang] : UI_TEXT.fr;
      pb.textContent = uiText.play || '✨ Commencer';
      pb.style.display = 'block';
      pb.disabled = false;
      pb.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  var playBtn = document.getElementById('playBtn');
  if (playBtn) {
    playBtn.addEventListener('click', function() {
      var nm = document.getElementById('inputName');
      window.S.playerName = nm ? nm.value.trim() : '';
      if (!window.S.playerName || !window.S.nativeLang || !window.S.targetLang) {
        showNotif('Complétez tous les champs !');
        return;
      }
      if (['zh','ja','ru'].indexOf(window.S.targetLang) !== -1 && !window.S.scriptPref) {
        showNotif('Choisissez un mode d\'écriture !');
        return;
      }
      try { if (typeof saveGame === 'function') saveGame(); } catch(e) {}
      startMenu();
    });
  }
});

function startMenu() {
  if (!window.S) return;
  try {
    var testLS = localStorage.getItem('linguavillage_save');
    if (testLS) {
      var parsed = JSON.parse(testLS);
      if (!parsed.S || !parsed.S.nativeLang || !parsed.S.targetLang || !parsed.S.playerName) {
        localStorage.removeItem('linguavillage_save');
        localStorage.removeItem('lv_onboarding_done');
        localStorage.removeItem('lv_last_quote_idx');
      }
    }
  } catch(e) {}
  var menuPlayer = document.getElementById('menuPlayer');
  var menuLang   = document.getElementById('menuLang');
  var menuXP     = document.getElementById('menuXP');
  var gemDisplay = document.getElementById('gemDisplay');
  var xpFill     = document.getElementById('xpFill');
  if (menuPlayer) menuPlayer.textContent = '👤 ' + (window.S.playerName || 'Joueur');
  if (menuLang) {
    var flag  = (window.FLAGS && FLAGS[window.S.targetLang]) || '';
    var lname = (window.LANG_NAMES && LANG_NAMES[window.S.targetLang]) || window.S.targetLang || '';
    menuLang.textContent = flag + ' ' + lname;
  }
  if (menuXP)     menuXP.textContent     = (window.S.xp || 0) + ' XP';
  if (gemDisplay) gemDisplay.textContent = '💎 ' + ((window.S_missions && window.S_missions.gems) || 0);
  if (xpFill)     xpFill.style.width     = ((window.S.xp || 0) % 100) + '%';
  try { if (typeof saveGame     === 'function') saveGame(); } catch(e) {}
  try { if (typeof updateStreak === 'function') updateStreak(); } catch(e) {}
  try { if (typeof applyMenuUI  === 'function') applyMenuUI();  } catch(e) {}
  _launchMenu();

  // ACTIVATION IMMÉDIATE : premier dialogue avec Léa
  setTimeout(function() {
    if (localStorage.getItem('lv_activated')) return;
    if (typeof LOCATIONS !== 'undefined') {
      var friendsLoc = LOCATIONS.find(l => l.id === 'friends');
      if (friendsLoc && friendsLoc.npcs && friendsLoc.npcs[0]) {
        openDialogue('friends', friendsLoc.npcs[0].id);
        localStorage.setItem('lv_activated', '1');
        showNotif('🎉 Bienvenue ! Commence par parler à ' + friendsLoc.npcs[0].name + '.');
      } else {
        openFlashcards('salutations');
        localStorage.setItem('lv_activated', '1');
      }
    }
  }, 2000);
}

window.showScreen = function(id) {
  document.querySelectorAll('.screen').forEach(s => { s.classList.remove('active'); s.style.display = ''; });
  var target = document.getElementById(id);
  if (target) target.classList.add('active');
};

function _launchMenu() {
  function showQuoteThenMenu() {
    if (typeof showDailyQuote === 'function') {
      showDailyQuote(function() { showScreen('screen-menu'); });
    } else {
      showScreen('screen-menu');
    }
  }
  var isFirstTime = true;
  try { isFirstTime = !localStorage.getItem('lv_onboarding_done'); } catch(e) { isFirstTime = false; }
  if (isFirstTime && window.LV_ONBOARDING && typeof window.LV_ONBOARDING.show === 'function') {
    try { localStorage.setItem('lv_onboarding_done', '1'); } catch(e) {}
    window.LV_ONBOARDING.show(showQuoteThenMenu);
  } else {
    showQuoteThenMenu();
  }
}

function openWordGame() {
  if (window.LV_WORDGAME) window.LV_WORDGAME.open();
  else showNotif('Jeu de mots non chargé.');
}
function resetOnboarding() {
  try { localStorage.removeItem('lv_onboarding_done'); } catch(e) {}
  try { localStorage.removeItem('lv_last_quote_idx'); } catch(e) {}
  showNotif('Onboarding réinitialisé');
        }
