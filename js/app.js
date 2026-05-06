// LinguaVillage — app.js
// Point d'entrée principal : welcome flow + startMenu
// CHARGÉ EN DERNIER — dépend de tous les autres fichiers
// ================================================================

const API = 'https://linguavillage-api--marckensbou2.replit.app';

// ================================================================
// WELCOME FLOW
// ================================================================
window.addEventListener('DOMContentLoaded', function() {

  // ── Restaurer session si sauvegarde valide ──────────────────
  if (window._LINGUA_HAS_SAVE && window.S && S.playerName && S.nativeLang && S.targetLang) {
    try {
      if (typeof applyUI === 'function') applyUI(S.nativeLang);
      startMenu();
      try { if (typeof checkDailyStreak === 'function') checkDailyStreak(); } catch(e) {}
      return;
    } catch(e) { console.warn('Restore session failed:', e); }
  }

  // ── 1. Sélection langue maternelle ─────────────────────────
  document.querySelectorAll('.lang-tile[data-native]').forEach(function(t) {
    t.onclick = function() {
      document.querySelectorAll('.lang-tile[data-native]').forEach(function(x) {
        x.classList.remove('active', 'sel');
      });
      this.classList.add('active', 'sel');

      // S est garanti d'exister (défini dans data.js avant app.js)
      window.S.nativeLang = this.dataset.native;

      try { if (typeof applyUI === 'function') applyUI(window.S.nativeLang); } catch(e) {}

      // Affiche step2 (champ prénom)
      var s2 = document.getElementById('step2');
      if (s2) {
        s2.style.display = 'block';
        s2.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Cache step3, step4, playBtn
      var s3 = document.getElementById('step3');
      var s4 = document.getElementById('step4');
      var pb = document.getElementById('playBtn');
      if (s3) s3.style.display = 'none';
      if (s4) s4.style.display = 'none';
      if (pb) { pb.style.display = 'none'; pb.disabled = true; }

      // Désactive la même langue dans la liste cible
      document.querySelectorAll('.lang-tile[data-lang]').forEach(function(o) {
        var same = o.dataset.lang === window.S.nativeLang;
        o.classList.toggle('disabled', same);
        if (same) o.classList.remove('active', 'sel');
      });

      // Focus automatique sur le champ prénom
      var inp = document.getElementById('inputName');
      if (inp) setTimeout(function() { inp.focus(); }, 300);
    };
  });

  // ── 2. Saisie prénom → affiche step3 (langues cibles) ──────
  var inputName = document.getElementById('inputName');
  if (inputName) {
    inputName.addEventListener('input', function() {
      var hasValue = this.value.trim().length > 0;
      var s3 = document.getElementById('step3');
      var s4 = document.getElementById('step4');
      var pb = document.getElementById('playBtn');
      if (s3) s3.style.display = hasValue ? 'block' : 'none';
      if (s4) s4.style.display = 'none';
      if (pb) pb.style.display = 'none';
    });
  }

  // ── 3. Sélection langue cible ───────────────────────────────
  document.querySelectorAll('.lang-tile[data-lang]').forEach(function(t) {
    t.onclick = function() {
      if (this.classList.contains('disabled')) return;
      document.querySelectorAll('.lang-tile[data-lang]').forEach(function(x) {
        x.classList.remove('active', 'sel');
      });
      this.classList.add('active', 'sel');

      window.S.targetLang = this.dataset.lang;
      var cjk = ['zh', 'ja', 'ru'].includes(window.S.targetLang);

      var s4 = document.getElementById('step4');
      var pb = document.getElementById('playBtn');

      if (cjk) {
        if (s4) s4.style.display = 'block';
        var lb = {
          zh: { n: '你好',      r: 'Nǐ hǎo' },
          ja: { n: 'こんにちは', r: 'Konnichiwa' },
          ru: { n: 'Привет',    r: 'Privyet' }
        };
        var sn = document.getElementById('sc-n');
        var sr = document.getElementById('sc-r');
        if (sn) sn.textContent = lb[window.S.targetLang].n;
        if (sr) sr.textContent = lb[window.S.targetLang].r;
        if (pb) { pb.style.display = 'none'; pb.disabled = true; }
      } else {
        window.S.scriptPref = 'both';
        if (s4) s4.style.display = 'none';
        if (pb) { pb.style.display = 'block'; pb.disabled = false; }
      }
    };
  });

  // ── 3b. Choix script CJK ────────────────────────────────────
  window.selScript = function(pref, btn) {
    document.querySelectorAll('.sc-btn').forEach(function(b) {
      b.classList.remove('sel', 'active');
    });
    if (btn) btn.classList.add('sel', 'active');
    window.S.scriptPref = pref;
    var pb = document.getElementById('playBtn');
    if (pb) { pb.style.display = 'block'; pb.disabled = false; }
  };

  // ── 4. Bouton Commencer ─────────────────────────────────────
  var playBtn = document.getElementById('playBtn');
  if (playBtn) {
    playBtn.addEventListener('click', function() {
      var nm = document.getElementById('inputName');
      window.S.playerName = nm ? nm.value.trim() : '';
      if (!window.S.playerName || !window.S.nativeLang || !window.S.targetLang) {
        try {
          showNotif('⚠️ Complétez tous les champs !');
        } catch(e) {
          alert('Complétez tous les champs !');
        }
        return;
      }
      try { if (typeof saveGame === 'function') saveGame(); } catch(e) {}
      startMenu();
    });
  }

}); // fin DOMContentLoaded

// ================================================================
// startMenu — appelée après welcome flow ou restauration session
// ================================================================
function startMenu() {
  if (!window.S) return;

  // Mettre à jour les labels de l'interface menu
  var menuPlayer = document.getElementById('menuPlayer');
  var menuLang   = document.getElementById('menuLang');
  var menuXP     = document.getElementById('menuXP');
  var gemDisplay = document.getElementById('gemDisplay');
  var xpFill     = document.getElementById('xpFill');

  if (menuPlayer) menuPlayer.textContent = '👤 ' + (window.S.playerName || '');
  if (menuLang) {
    var flag   = (window.FLAGS && FLAGS[window.S.targetLang]) || '';
    var lname  = (window.LANG_NAMES && LANG_NAMES[window.S.targetLang]) || window.S.targetLang || '';
    menuLang.textContent = flag + ' ' + lname;
  }
  if (menuXP)     menuXP.textContent     = (window.S.xp || 0) + ' XP';
  if (gemDisplay) gemDisplay.textContent = '💎 ' + ((window.S_missions && window.S_missions.gems) || 0);
  if (xpFill)     xpFill.style.width     = ((window.S.xp || 0) % 100) + '%';

  // Sauvegarde + streak
  try { if (typeof saveGame     === 'function') saveGame();     } catch(e) {}
  try { if (typeof updateStreak === 'function') updateStreak(); } catch(e) {}
  try { if (typeof applyMenuUI  === 'function') applyMenuUI();  } catch(e) {}

  // Onboarding (1ère fois) → citation → menu
  _launchMenu();
}

// ================================================================
// _launchMenu — onboarding → citation → showScreen('screen-menu')
// ================================================================
function _launchMenu() {
  var isFirstTime = !localStorage.getItem('lv_onboarding_done');

  function showQuoteThenMenu() {
    if (typeof showDailyQuote === 'function') {
      showDailyQuote(function() {
        try { if (typeof applyMenuUI === 'function') applyMenuUI(); } catch(e) {}
        showScreen('screen-menu');
      });
    } else {
      try { if (typeof applyMenuUI === 'function') applyMenuUI(); } catch(e) {}
      showScreen('screen-menu');
    }
  }

  if (isFirstTime && window.LV_ONBOARDING) {
    localStorage.setItem('lv_onboarding_done', '1');
    window.LV_ONBOARDING.show(showQuoteThenMenu);
  } else {
    showQuoteThenMenu();
  }
}

// ================================================================
// Helpers accessibles globalement
// ================================================================

// Ouvrir le jeu de mots depuis le menu
function openWordGame() {
  if (window.LV_WORDGAME) {
    window.LV_WORDGAME.open();
  } else if (typeof showNotif === 'function') {
    showNotif('⚠️ Jeu de mots non chargé.');
  }
}

// Réinitialiser l'onboarding (debug)
function resetOnboarding() {
  localStorage.removeItem('lv_onboarding_done');
  localStorage.removeItem('lv_last_quote_idx');
  if (typeof showNotif === 'function') showNotif('🔄 Onboarding réinitialisé');
}
