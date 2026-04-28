// LinguaVillage — app.js
// Point d'entrée principal : API, initialisation, welcome flow, startMenu
// CHARGÉ EN DERNIER — dépend de tous les autres fichiers




const API = 'https://linguavillage-api--marckensbou2.replit.app';

// =================================================================
// UI TRANSLATIONS
// =================================================================

function startMenu() {
  if (!window.S) return;
  const menuPlayer = document.getElementById('menuPlayer');
  const menuLang = document.getElementById('menuLang');
  const menuXP = document.getElementById('menuXP');
  const gemDisplay = document.getElementById('gemDisplay');
  const xpFill = document.getElementById('xpFill');
  
  if (menuPlayer) menuPlayer.textContent = '👤 ' + S.playerName;
  if (menuLang) menuLang.textContent = (FLAGS[S.targetLang] || '') + (LANG_NAMES[S.targetLang] || S.targetLang);
  if (menuXP) menuXP.textContent = (S.xp || 0) + ' XP';
  if (gemDisplay) gemDisplay.textContent = '💎 ' + ((window.S_missions && S_missions.gems) || 0);
  if (xpFill) xpFill.style.width = ((S.xp || 0) % 100) + '%';
  
  if (typeof saveGame === 'function') saveGame();
  if (typeof updateStreak === 'function') updateStreak();

  // Afficher citation/proverbe avant l'interface principale
  if (typeof showDailyQuote === 'function') {
    showDailyQuote(function() {
      applyMenuUI();
      showScreen('screen-menu');
    });
  } else {
    applyMenuUI();
    showScreen('screen-menu');
  }
}

// WELCOME FLOW — dans DOMContentLoaded pour que le DOM existe
// =================================================================
