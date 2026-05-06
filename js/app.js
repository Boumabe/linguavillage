// LinguaVillage — app.js
// Version debug ultra-simplifiée

var API = 'https://linguavillage-api--marckensbou2.replit.app';

window.addEventListener('DOMContentLoaded', function() {
  alert('🚀 DOMContentLoaded - début');

  if (!window.S) {
    window.S = {
      nativeLang: null,
      targetLang: null,
      playerName: '',
      scriptPref: 'both',
      xp: 0
    };
    alert('✅ window.S initialisé');
  }

  // Vérifier si on restaure une session
  if (window._LINGUA_HAS_SAVE && window.S && S.playerName && S.nativeLang && S.targetLang) {
    alert('🔄 Session restaurée');
    try {
      if (typeof applyUI === 'function') applyUI(S.nativeLang);
    } catch(e) {}
    startMenu();
    return;
  }

  alert('📝 Aucune session, affichage welcome screen');

  // S'assurer que le welcome est visible
  var welcomeScreen = document.getElementById('screen-welcome');
  if (welcomeScreen) {
    welcomeScreen.classList.add('active');
    alert('✅ screen-welcome affiché');
  } else {
    alert('❌ screen-welcome INTROUVABLE');
  }

  // --- Sélection langue maternelle ---
  document.querySelectorAll('.lang-tile[data-native]').forEach(function(t) {
    t.onclick = function() {
      window.S.nativeLang = this.dataset.native;
      alert('🌍 Langue maternelle : ' + window.S.nativeLang);

      document.querySelectorAll('.lang-tile[data-native]').forEach(function(x) {
        x.classList.remove('active', 'sel');
      });
      this.classList.add('active', 'sel');

      try { if (typeof applyUI === 'function') applyUI(window.S.nativeLang); } catch(e) {}

      var s2 = document.getElementById('step2');
      if (s2) { s2.style.display = 'block'; }

      var s3 = document.getElementById('step3');
      var s4 = document.getElementById('step4');
      var pb = document.getElementById('playBtn');
      if (s3) s3.style.display = 'none';
      if (s4) s4.style.display = 'none';
      if (pb) { pb.style.display = 'none'; pb.disabled = true; }

      document.querySelectorAll('.lang-tile[data-lang]').forEach(function(o) {
        var same = o.dataset.lang === window.S.nativeLang;
        o.classList.toggle('disabled', same);
        if (same) o.classList.remove('active', 'sel');
      });

      var inp = document.getElementById('inputName');
      if (inp) { inp.value = ''; setTimeout(function() { inp.focus(); }, 300); }
    };
  });

  // --- Saisie prénom ---
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

      document.querySelectorAll('.lang-tile[data-lang]').forEach(function(x) {
        x.classList.remove('active', 'sel');
      });
      window.S.targetLang = null;
    });
  }

  // --- Sélection langue cible ---
  document.querySelectorAll('.lang-tile[data-lang]').forEach(function(t) {
    t.onclick = function() {
      if (this.classList.contains('disabled')) return;

      document.querySelectorAll('.lang-tile[data-lang]').forEach(function(x) {
        x.classList.remove('active', 'sel');
      });
      this.classList.add('active', 'sel');
      window.S.targetLang = this.dataset.lang;
      alert('🎯 Langue cible : ' + window.S.targetLang);

      var cjk = ['zh', 'ja', 'ru'].indexOf(window.S.targetLang) !== -1;
      var s4 = document.getElementById('step4');
      var pb = document.getElementById('playBtn');

      if (cjk) {
        if (s4) s4.style.display = 'block';
        window.S.scriptPref = null;
        document.querySelectorAll('.sc-btn').forEach(function(b) { b.classList.remove('sel', 'active'); });
        if (pb) { pb.style.display = 'none'; pb.disabled = true; }
      } else {
        window.S.scriptPref = 'both';
        if (s4) s4.style.display = 'none';
        if (pb) { pb.style.display = 'block'; pb.disabled = false; }
      }
    };
  });

  // --- Choix script CJK ---
  window.selScript = function(pref, btn) {
    document.querySelectorAll('.sc-btn').forEach(function(b) { b.classList.remove('sel', 'active'); });
    if (btn) btn.classList.add('sel', 'active');
    window.S.scriptPref = pref;
    var pb = document.getElementById('playBtn');
    if (pb) { pb.style.display = 'block'; pb.disabled = false; }
  };

  // --- Bouton Commencer ---
  var playBtn = document.getElementById('playBtn');
  if (playBtn) {
    playBtn.addEventListener('click', function() {
      var nm = document.getElementById('inputName');
      window.S.playerName = nm ? nm.value.trim() : '';

      if (!window.S.playerName || !window.S.nativeLang || !window.S.targetLang) {
        alert('⚠️ Champs incomplets');
        return;
      }

      alert('✅ Tous les champs OK -> startMenu()');
      try { if (typeof saveGame === 'function') saveGame(); } catch(e) {}
      startMenu();
    });
  }

  alert('✅ Welcome flow initialisé');
});

// ================================================================
// startMenu
// ================================================================
function startMenu() {
  alert('📋 startMenu() appelé');

  if (!window.S) {
    alert('❌ window.S undefined');
    return;
  }

  // Mise à jour interface menu
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

  alert('✅ Interface menu MAJ - affichage direct');

  // AFFICHER LE MENU DIRECTEMENT
  var menuScreen = document.getElementById('screen-menu');
  if (!menuScreen) {
    alert('❌ screen-menu INTROUVABLE');
    return;
  }

  alert('✅ screen-menu trouvé');

  // Masquer TOUS les écrans
  var allScreens = document.querySelectorAll('.screen');
  alert('📺 Nombre d\'écrans trouvés : ' + allScreens.length);
  
  for (var i = 0; i < allScreens.length; i++) {
    allScreens[i].classList.remove('active');
    allScreens[i].style.display = 'none';
  }

  // Afficher le menu
  menuScreen.classList.add('active');
  menuScreen.style.display = 'flex';
  
  alert('✅ MENU AFFICHÉ !');
                                                                   }
