// LinguaVillage — app.js
// Version sans activation immédiate – menu après proverbe uniquement
// ================================================================

var API = 'https://linguavillage-api--marckensbou2.replit.app';

window.addEventListener('DOMContentLoaded', function() {
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

  // Restaurer session existante
  if (window._LINGUA_HAS_SAVE && window.S && S.playerName && S.nativeLang && S.targetLang) {
    try {
      if (typeof applyUI === 'function') applyUI(S.nativeLang);
      startMenu();
      try { if (typeof checkDailyStreak === 'function') checkDailyStreak(); } catch(e) {}
      return;
    } catch(e) { console.warn('Restore failed:', e); }
  }

  // Configuration des sélections (inchangée)
  const nativeTiles = document.querySelectorAll('.lang-tile[data-native]');
  const targetTiles = document.querySelectorAll('.lang-tile[data-lang]');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');
  const step4 = document.getElementById('step4');
  const playBtn = document.getElementById('playBtn');
  const nameInput = document.getElementById('inputName');

  function resetWelcomeUI() {
    if (step2) step2.style.display = 'none';
    if (step3) step3.style.display = 'none';
    if (step4) step4.style.display = 'none';
    if (playBtn) { playBtn.style.display = 'none'; playBtn.disabled = true; }
    if (nameInput) nameInput.value = '';
    nativeTiles.forEach(t => t.classList.remove('active', 'sel'));
    targetTiles.forEach(t => t.classList.remove('active', 'sel'));
    window.S.nativeLang = null;
    window.S.targetLang = null;
    window.S.playerName = '';
    window.S.scriptPref = 'both';
  }

  nativeTiles.forEach(tile => {
    tile.onclick = function() {
      nativeTiles.forEach(t => t.classList.remove('active', 'sel'));
      this.classList.add('active', 'sel');
      window.S.nativeLang = this.dataset.native;
      if (typeof applyUI === 'function') applyUI(window.S.nativeLang);
      if (step2) step2.style.display = 'block';
      if (step3) step3.style.display = 'none';
      if (step4) step4.style.display = 'none';
      if (playBtn) { playBtn.style.display = 'none'; playBtn.disabled = true; }
      if (nameInput) nameInput.value = '';
      targetTiles.forEach(t => {
        const same = t.dataset.lang === window.S.nativeLang;
        t.classList.toggle('disabled', same);
        if (same) t.classList.remove('active', 'sel');
      });
      if (nameInput) setTimeout(() => nameInput.focus(), 100);
    };
  });

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

  targetTiles.forEach(tile => {
    tile.onclick = function() {
      if (this.classList.contains('disabled')) return;
      targetTiles.forEach(t => t.classList.remove('active', 'sel'));
      this.classList.add('active', 'sel');
      window.S.targetLang = this.dataset.lang;
      const isCJK = ['zh', 'ja', 'ru'].includes(window.S.targetLang);
      if (isCJK) {
        if (step4) step4.style.display = 'block';
        const examples = { zh: { n:'你好', r:'Ni hǎo' }, ja: { n:'こんにちは', r:'Konnichiwa' }, ru: { n:'Привет', r:'Privyet' } };
        const scN = document.getElementById('sc-n');
        const scR = document.getElementById('sc-r');
        if (scN) scN.textContent = examples[window.S.targetLang]?.n || '';
        if (scR) scR.textContent = examples[window.S.targetLang]?.r || '';
        window.S.scriptPref = null;
        document.querySelectorAll('.sc-btn').forEach(b => b.classList.remove('sel', 'active'));
        if (playBtn) { playBtn.style.display = 'none'; playBtn.disabled = true; }
      } else {
        window.S.scriptPref = 'both';
        if (step4) step4.style.display = 'none';
        const nativeLang = window.S.nativeLang || 'fr';
        const uiText = (UI_TEXT && UI_TEXT[nativeLang]) ? UI_TEXT[nativeLang] : UI_TEXT?.fr || { play: '✨ Commencer' };
        if (playBtn) {
          playBtn.textContent = uiText.play;
          playBtn.style.display = 'block';
          playBtn.disabled = false;
        }
      }
    };
  });

  window.selScript = function(pref, btn) {
    document.querySelectorAll('.sc-btn').forEach(b => b.classList.remove('sel', 'active'));
    if (btn) btn.classList.add('sel', 'active');
    window.S.scriptPref = pref;
    const nativeLang = window.S.nativeLang || 'fr';
    const uiText = (UI_TEXT && UI_TEXT[nativeLang]) ? UI_TEXT[nativeLang] : UI_TEXT?.fr || { play: '✨ Commencer' };
    if (playBtn) {
      playBtn.textContent = uiText.play;
      playBtn.style.display = 'block';
      playBtn.disabled = false;
    }
  };

  if (playBtn) {
    playBtn.addEventListener('click', function() {
      const name = nameInput ? nameInput.value.trim() : '';
      if (!name || !window.S.nativeLang || !window.S.targetLang) {
        showNotif('Complétez tous les champs !');
        return;
      }
      if (['zh','ja','ru'].includes(window.S.targetLang) && !window.S.scriptPref) {
        showNotif('Choisissez un mode d\'écriture !');
        return;
      }
      window.S.playerName = name;
      try { if (typeof saveGame === 'function') saveGame(); } catch(e) {}
      startMenu();
    });
  }
});

// -----------------------------------------------------------------
function startMenu() {
  if (!window.S) return;

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

  const menuPlayer = document.getElementById('menuPlayer');
  const menuLang = document.getElementById('menuLang');
  const menuXP = document.getElementById('menuXP');
  const gemDisplay = document.getElementById('gemDisplay');
  const xpFill = document.getElementById('xpFill');

  if (menuPlayer) menuPlayer.textContent = '👤 ' + (window.S.playerName || 'Joueur');
  if (menuLang) {
    const flag = (FLAGS && FLAGS[window.S.targetLang]) || '';
    const lname = (LANG_NAMES && LANG_NAMES[window.S.targetLang]) || window.S.targetLang || '';
    menuLang.textContent = flag + ' ' + lname;
  }
  if (menuXP) menuXP.textContent = (window.S.xp || 0) + ' XP';
  if (gemDisplay) gemDisplay.textContent = '💎 ' + ((window.S_missions && window.S_missions.gems) || 0);
  if (xpFill) xpFill.style.width = ((window.S.xp || 0) % 100) + '%';

  try { if (typeof saveGame === 'function') saveGame(); } catch(e) {}
  try { if (typeof updateStreak === 'function') updateStreak(); } catch(e) {}

  _launchMenu();
}

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

  // PLUS AUCUNE ACTIVATION AUTOMATIQUE (dialogue ou flashcards)
  // L'utilisateur arrive directement sur le menu après le proverbe.
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
