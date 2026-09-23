// LinguaVillage — save.js
// Sauvegarde et restauration de la progression du joueur
// CHARGÉ TÔT — définit window.S, S_missions, S_game et window._LINGUA_HAS_SAVE
// Améliorations : sauvegarde groupée (moins d'écritures), vidage à la fermeture de
// l'onglet, copie de secours si les données sont corrompues, numéro de version.

var SAVE_KEY = 'linguavillage_save';
var SAVE_VERSION = 2;

if (!window.S) {
  window.S = {
    playerName: '', nativeLang: null, targetLang: null, scriptPref: 'both',
    xp: 0, level: 1, currentLoc: null, currentNPC: null, chatHistory: [],
    currentUI: {}, xpBoostEnd: null
  };
}
var S = window.S;

window._LINGUA_HAS_SAVE = false;
if (!window.S_missions) window.S_missions = { completed:{}, gems:0, badges:[], shield:0, freeHints:0 };
var S_missions = window.S_missions;
if (!window.S_game) {
  window.S_game = {
    streak:0, bestStreak:0, lastPlayDate:null,
    streakFreezes:1, streakFreezeUsed:false,
    chestsOpened:0, lastChestDate:null,
    zoneBosses:{}, dailyChallenge:null,
    dailyStreak:0, activeBoss:null, secrets:[],
    stats:{ msgSent:0, wordsTyped:0, sessionsPlayed:0 },
  };
}
var G = window.S_game;

// Une seule lecture du stockage (avant : deux lectures + deux JSON.parse)
(function () {
  var raw = null;
  try { raw = localStorage.getItem(SAVE_KEY); } catch (e) {}
  if (!raw) return;
  try {
    var d = JSON.parse(raw);
    if (d.S) {
      Object.assign(window.S, d.S);
      window._LINGUA_HAS_SAVE = !!(window.S.playerName && window.S.nativeLang && window.S.targetLang);
    }
    if (d.missions) Object.assign(window.S_missions, d.missions);
    if (d.game) {
      Object.assign(window.S_game, d.game);
      window.S_game.stats = Object.assign({ msgSent:0, wordsTyped:0, sessionsPlayed:0 }, window.S_game.stats || {});
    }
  } catch (e) {
    // Données illisibles : on garde une copie pour ne rien perdre, puis on repart proprement.
    try { localStorage.setItem(SAVE_KEY + '_corrupt', raw); } catch (e2) {}
    console.warn('Sauvegarde corrompue — copie conservée dans ' + SAVE_KEY + '_corrupt');
    window._LINGUA_HAS_SAVE = false;
  }
})();

var _saveTimer = null;
function saveGameNow() {
  clearTimeout(_saveTimer); _saveTimer = null;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      v: SAVE_VERSION, S: window.S, missions: window.S_missions, game: window.S_game, timestamp: Date.now()
    }));
  } catch (e) { /* stockage plein ou bloqué : le jeu continue en mémoire */ }
}
// Groupe les sauvegardes rapprochées (chaque gain d'XP en déclenchait une).
function saveGame() {
  if (_saveTimer) return;
  _saveTimer = setTimeout(saveGameNow, 400);
}
window.saveGame = saveGame;
window.saveGameNow = saveGameNow;
window.addEventListener('pagehide', saveGameNow);
document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') saveGameNow(); });

function resetSave() {
  try {
    ['linguavillage_save', SAVE_KEY + '_corrupt', 'lv_onboarding_done', 'lv_last_quote_idx', 'lv_intro_seen', 'lv_memory_v1'].forEach(function (k) { localStorage.removeItem(k); });
  } catch (e) {}
}
window.resetSave = resetSave;
