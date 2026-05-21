// LinguaVillage — app.js
// Version corrigée – flux d’accueil, traduction, activation
// ================================================================

var API = 'https://linguavillage-api--marckensbou2.replit.app';

// -----------------------------------------------------------------
// Initialisation au chargement du DOM
// -----------------------------------------------------------------
window.addEventListener('DOMContentLoaded', function() {
  // État par défaut
  if (!window.S) {
    window.S = {
      nativeLang: null,
      targetLang: null,
      playerName: '',
      scriptPref: 'both',
      xp: 0,
      userLevel: 'zero'
    };
  }

  // Tenter de restaurer une session existante
  if (window._LINGUA_HAS_SAVE && window.S && S.playerName && S.nativeLang && S.targetLang) {
    try {
      if (typeof applyUI === 'function') applyUI(S.nativeLang);
      startMenu();
      try { if (typeof checkDailyStreak === 'function') checkDailyStreak(); } catch(e) {}
      return; // Session restaurée, on sort
    } catch(e) { console.warn('Restore session failed:', e); }
  }

  // ---------------------------------------------
  // 1. Affichage et gestion des langues maternelles
  // ---------------------------------------------
  const nativeTiles = document.querySelectorAll('.lang-tile[data-native]');
  const targetTiles = document.querySelectorAll('.lang-tile[data-lang]');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');
  const step4 = document.getElementById('step4');
  const playBtn = document.getElementById('playBtn');
  const nameInput = document.getElementById('inputName');

  // Réinitialisation de l'interface
  function resetWelcomeUI() {
    if (step2) step2.style.display = 'none';
    if (step3) step3.style.display = 'none';
    if (step4) step4.style.display = 'none';
    if (playBtn) { playBtn.style.display = 'none'; playBtn.disabled = true; }
    if (nameInput) nameInput.value = '';
    // Désactiver toutes les sélections
    nativeTiles.forEach(t => t.classList.remove('active', 'sel'));
    targetTiles.forEach(t => t.classList.remove('active', 'sel'));
    window.S.nativeLang = null;
    window.S.targetLang = null;
    window.S.playerName = '';
    window.S.scriptPref = 'both';
  }

  // Clic sur une langue maternelle
  nativeTiles.forEach(tile => {
    tile.onclick = function(e) {
      e.stopPropagation();
      // Retirer les sélections existantes
      nativeTiles.forEach(t => t.classList.remove('active', 'sel'));
      this.classList.add('active', 'sel');
      window.S.nativeLang = this.dataset.native;

      // Traduire l'interface selon la langue maternelle choisie
      if (typeof applyUI === 'function') applyUI(window.S.nativeLang);

      // Afficher l'étape 2 (saisie du prénom)
      if (step2) step2.style.display = 'block';
      // Cacher les étapes suivantes
      if (step3) step3.style.display = 'none';
      if (step4) step4.style.display = 'none';
      if (playBtn) { playBtn.style.display = 'none'; playBtn.disabled = true; }
      // Vider le champ prénom
      if (nameInput) nameInput.value = '';

      // Désactiver dans les langues cibles la langue maternelle
      targetTiles.forEach(t => {
        const isSame = t.dataset.lang === window.S.nativeLang;
        t.classList.toggle('disabled', isSame);
        if (isSame) t.classList.remove('active', 'sel');
      });

      // Focus sur le champ prénom
      if (nameInput) setTimeout(() => nameInput.focus(), 100);
    };
  });

  // Saisie du prénom → affiche les langues cibles
  if (nameInput) {
    nameInput.addEventListener('input', function() {
      const hasName = this.value.trim().length > 0;
      const hasNative = window.S && window.S.nativeLang;
      if (hasName && hasNative) {
        if (step3) step3.style.display = 'block';
        if (step4) step4.style.display = 'none';
        if (playBtn) { playBtn.style.display = 'none'; playBtn.disabled = true; }
      } else {
        if (step3) step3.style.display = 'none';
        if (step4) step4.style.display = 'none';
        if (playBtn) { playBtn.style.display = 'none'; playBtn.disabled = true; }
      }
    });
  }

  // Clic sur une langue cible
  targetTiles.forEach(tile => {
    tile.onclick = function(e) {
      if (this.classList.contains('disabled')) return;
      targetTiles.forEach(t => t.classList.remove('active', 'sel'));
      this.classList.add('active', 'sel');
      window.S.targetLang = this.dataset.lang;

      const isCJK = ['zh', 'ja', 'ru'].includes(window.S.targetLang);

      if (isCJK) {
        // Afficher le choix d'écriture (step4)
        if (step4) {
          step4.style.display = 'block';
          step4.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // Mettre à jour les exemples d'écriture
        const examples = {
          zh: { n: '你好', r: 'Ni hǎo' },
          ja: { n: 'こんにちは', r: 'Konnichiwa' },
          ru: { n: 'Привет', r: 'Privyet' }
        };
        const scN = document.getElementById('sc-n');
        const scR = document.getElementById('sc-r');
        if (scN) scN.textContent = examples[window.S.targetLang]?.n || '';
        if (scR) scR.textContent = examples[window.S.targetLang]?.r || '';
        window.S.scriptPref = null;
        document.querySelectorAll('.sc-btn').forEach(btn => btn.classList.remove('sel', 'active'));
        if (playBtn) { playBtn.style.display = 'none'; playBtn.disabled = true; }
      } else {
        // Pas d'écriture particulière
        window.S.scriptPref = 'both';
        if (step4) step4.style.display = 'none';
        // Traduire le bouton "Commencer" selon la langue maternelle
        const nativeLang = window.S.nativeLang || 'fr';
        const uiText = (typeof UI_TEXT !== 'undefined' && UI_TEXT[nativeLang]) ? UI_TEXT[nativeLang] : UI_TEXT?.fr || { play: '✨ Commencer' };
        if (playBtn) {
          playBtn.textContent = uiText.play || '✨ Commencer';
          playBtn.style.display = 'block';
          playBtn.disabled = false;
          playBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };
  });

  // Choix du script pour CJK
  window.selScript = function(pref, btn) {
    document.querySelectorAll('.sc-btn').forEach(b => b.classList.remove('sel', 'active'));
    if (btn) btn.classList.add('sel', 'active');
    window.S.scriptPref = pref;

    const nativeLang = window.S.nativeLang || 'fr';
    const uiText = (typeof UI_TEXT !== 'undefined' && UI_TEXT[nativeLang]) ? UI_TEXT[nativeLang] : UI_TEXT?.fr || { play: '✨ Commencer' };
    if (playBtn) {
      playBtn.textContent = uiText.play || '✨ Commencer';
      playBtn.style.display = 'block';
      playBtn.disabled = false;
      playBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Bouton "Commencer"
  if (playBtn) {
    playBtn.addEventListener('click', function() {
      const name = nameInput ? nameInput.value.trim() : '';
      if (!name || !window.S.nativeLang || !window.S.targetLang) {
        showNotif('Complétez tous les champs !');
        return;
      }
      if (['zh', 'ja', 'ru'].includes(window.S.targetLang) && !window.S.scriptPref) {
        showNotif('Choisissez un mode d\'écriture !');
        return;
      }
      window.S.playerName = name;
      try { if (typeof saveGame === 'function') saveGame(); } catch(e) {}
      startMenu();
    });
  }

  // Petite animation d'étoiles (optionnelle)
  const starsContainer = document.getElementById('wStars');
  if (starsContainer) {
    for (let i = 0; i < 60; i++) {
      const star = document.createElement('div');
      star.className = 'w-star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.width = star.style.height = (1 + Math.random() * 3) + 'px';
      star.style.animationDelay = Math.random() * 5 + 's';
      starsContainer.appendChild(star);
    }
  }
});

// -----------------------------------------------------------------
// startMenu – point d'entrée après inscription ou chargement
// -----------------------------------------------------------------
function startMenu() {
  if (!window.S) return;

  // Nettoyage éventuel d'une sauvegarde corrompue
  try {
    const test = localStorage.getItem('linguavillage_save');
    if (test) {
      const parsed = JSON.parse(test);
      if (!parsed.S || !parsed.S.nativeLang || !parsed.S.targetLang || !parsed.S.playerName) {
        localStorage.removeItem('linguavillage_save');
        localStorage.removeItem('lv_onboarding_done');
        localStorage.removeItem('lv_last_quote_idx');
      }
    }
  } catch(e) {}

  // Mise à jour des éléments du menu
  const menuPlayer = document.getElementById('menuPlayer');
  const menuLang = document.getElementById('menuLang');
  const menuXP = document.getElementById('menuXP');
  const gemDisplay = document.getElementById('gemDisplay');
  const xpFill = document.getElementById('xpFill');

  if (menuPlayer) menuPlayer.textContent = '👤 ' + (window.S.playerName || 'Joueur');
  if (menuLang) {
    const flag = (window.FLAGS && FLAGS[window.S.targetLang]) || '';
    const lname = (window.LANG_NAMES && LANG_NAMES[window.S.targetLang]) || window.S.targetLang || '';
    menuLang.textContent = flag + ' ' + lname;
  }
  if (menuXP) menuXP.textContent = (window.S.xp || 0) + ' XP';
  if (gemDisplay) gemDisplay.textContent = '💎 ' + ((window.S_missions && window.S_missions.gems) || 0);
  if (xpFill) xpFill.style.width = ((window.S.xp || 0) % 100) + '%';

  try { if (typeof saveGame === 'function') saveGame(); } catch(e) {}
  try { if (typeof updateStreak === 'function') updateStreak(); } catch(e) {}

  _launchMenu();
}

// -----------------------------------------------------------------
// Lancement du menu avec citation et onboarding
// -----------------------------------------------------------------
window.showScreen = function(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = '';
  });
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
};

function _launchMenu() {
  function showQuoteThenMenu() {
    if (typeof showDailyQuote === 'function') {
      showDailyQuote(() => showScreen('screen-menu'));
    } else {
      showScreen('screen-menu');
    }
  }

  let isFirstTime = true;
  try {
    isFirstTime = !localStorage.getItem('lv_onboarding_done');
  } catch(e) { isFirstTime = false; }

  if (isFirstTime && window.LV_ONBOARDING && typeof window.LV_ONBOARDING.show === 'function') {
    try { localStorage.setItem('lv_onboarding_done', '1'); } catch(e) {}
    window.LV_ONBOARDING.show(showQuoteThenMenu);
  } else {
    showQuoteThenMenu();
  }

  // Activation immédiate (premier dialogue) après un délai
  setTimeout(() => {
    if (localStorage.getItem('lv_activated')) return;
    if (typeof LOCATIONS !== 'undefined') {
      const friendsLoc = LOCATIONS.find(l => l.id === 'friends');
      if (friendsLoc && friendsLoc.npcs && friendsLoc.npcs[0]) {
        openDialogue('friends', friendsLoc.npcs[0].id);
        localStorage.setItem('lv_activated', '1');
        showNotif('🎉 Bienvenue ! Commence par parler à ' + friendsLoc.npcs[0].name + '.');
      } else {
        if (typeof openFlashcards === 'function') openFlashcards('salutations');
        localStorage.setItem('lv_activated', '1');
      }
    }
  }, 2500);
}

// -----------------------------------------------------------------
// Utilitaires
// -----------------------------------------------------------------
function openWordGame() {
  if (window.LV_WORDGAME) window.LV_WORDGAME.open();
  else showNotif('Jeu de mots non chargé.');
}

function resetOnboarding() {
  try { localStorage.removeItem('lv_onboarding_done'); } catch(e) {}
  try { localStorage.removeItem('lv_last_quote_idx'); } catch(e) {}
  showNotif('Onboarding réinitialisé');
}
