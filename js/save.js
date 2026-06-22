// LinguaVillage — save.js
// Sauvegarde et restauration de la progression du joueur
// CHARGÉ EN PREMIER — définit window.S et window._LINGUA_HAS_SAVE

// =================================================================
// INITIALISATION DE window.S (OBLIGATOIRE — doit être fait en premier)
// =================================================================
if (!window.S) {
  window.S = {
    playerName: '',
    nativeLang: null,
    targetLang: null,
    scriptPref: 'both',
    xp: 0,
    level: 1,
    currentLoc: null,
    currentNPC: null,
    chatHistory: [],
    currentUI: {},
    xpBoostEnd: null
  };
}
var S = window.S;

// =================================================================
// CHARGER LA SAUVEGARDE SI DISPONIBLE
// =================================================================
window._LINGUA_HAS_SAVE = false;
(function(){
  try {
    var saved = localStorage.getItem('linguavillage_save');
    if (saved) {
      var d = JSON.parse(saved);
      if (d.S) {
        Object.assign(window.S, d.S);
        window._LINGUA_HAS_SAVE = !!(window.S.playerName && window.S.nativeLang && window.S.targetLang);
      }
    }
  } catch(e) {
    window._LINGUA_HAS_SAVE = false;
  }
})();

// =================================================================
// INIT GLOBAL — S_missions, S_game
// =================================================================
if (!window.S_missions) {
  window.S_missions = { completed:{}, gems:0, badges:[], shield:0, freeHints:0 };
}
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

// Charger S_missions et S_game depuis la sauvegarde
(function(){
  try {
    var sv = localStorage.getItem('linguavillage_save');
    if (sv) {
      var d = JSON.parse(sv);
      if (d.missions) Object.assign(window.S_missions, d.missions);
      if (d.game)     Object.assign(window.S_game, d.game);
      S_missions = window.S_missions;
      G          = window.S_game;
    }
  } catch(e) {}
})();

// =================================================================
// CONSTANTES
// =================================================================
// [CORRECTION] BADGES et SURPRISE_VIDEOS étaient déclarées ici ET dans
// gamification.js (chargé après). Comme aucune des deux variables n'est
// jamais lue dans save.js lui-même (seulement déclarée), et que
// gamification.js est le seul vrai consommateur (checkBadges,
// launchSurpriseMode), la version de gamification.js écrasait
// silencieusement celle-ci à chaque chargement de page. Pour ne perdre
// aucun contenu, le meilleur des deux jeux de données (badges étendus de
// gamification.js + vidéos enrichies de save.js) a été fusionné dans
// gamification.js — voir js/gamification.js. Cette déclaration est
// retirée d'ici pour qu'il n'y ait plus qu'une seule source de vérité.

// =================================================================
// FONCTIONS DE SAUVEGARDE
// =================================================================
function saveGame() {
  try {
    var data = {
      S: window.S,
      missions: window.S_missions,
      game: window.S_game,
      timestamp: Date.now()
    };
    localStorage.setItem('linguavillage_save', JSON.stringify(data));
  } catch(e) {}
}

function resetSave() {
  try {
    localStorage.removeItem('linguavillage_save');
    localStorage.removeItem('lv_onboarding_done');
    localStorage.removeItem('lv_last_quote_idx');
  } catch(e) {}
    }
