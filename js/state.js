/* =================================================================
   state.js — LinguaVillage
   SOURCE UNIQUE DE VÉRITÉ pour toutes les variables globales
   Ce fichier DOIT être chargé EN PREMIER dans index.html
   ================================================================= */

// =================================================================
// ÉTAT PRINCIPAL DU JOUEUR
// =================================================================
window.S = window.S || {
  // Informations personnelles
  playerName: '',
  nativeLang: '',
  targetLang: '',
  scriptPref: 'both',        // 'native', 'roman', 'both'
  
  // Progression
  xp: 0,
  level: 1,
  gems: 0,
  
  // Bonus temporaires
  xpBoostEnd: null,          // Date timestamp pour boost XP
  
  // État du village et dialogue
  currentLoc: null,
  currentNPC: null,
  chatHistory: [],
  
  // UI
  currentUI: null,
  
  // Date de dernière connexion
  lastConnection: null
};

// =================================================================
// ÉTAT DES MISSIONS
// =================================================================
window.S_missions = window.S_missions || {
  completed: {},      // { missionId: true }
  current: null,      // missionId en cours
  gems: 0
};

// =================================================================
// ÉTAT DU STREAK (série de jours consécutifs)
// =================================================================
window.S_streak = window.S_streak || {
  count: 0,           // nombre de jours consécutifs
  lastDate: null      // dernière date de connexion (toDateString)
};

// =================================================================
// CACHE DES QUIZ (pour le cinéma)
// =================================================================
window.S_quizCache = window.S_quizCache || {};

// =================================================================
// FONCTIONS UTILITAIRES POUR MANIPULER L'ÉTAT
// =================================================================

// Ajouter des XP avec gestion de niveau
function addXP(amount) {
  if (!window.S) return 0;
  const oldLevel = S.level || 1;
  S.xp = (S.xp || 0) + amount;
  
  // Calcul du nouveau niveau (100 XP par niveau)
  const newLevel = Math.floor(S.xp / 100) + 1;
  S.level = newLevel;
  
  // Notification de changement de niveau
  if (newLevel > oldLevel) {
    if (typeof showNotif === 'function') {
      showNotif(`🎉 Niveau ${newLevel} atteint !`);
    }
    if (typeof launchConfetti === 'function') {
      launchConfetti();
    }
  }
  
  return S.xp;
}

// Ajouter des gemmes
function addGems(amount) {
  if (!window.S) return 0;
  if (typeof window.S_missions !== 'undefined') {
    S_missions.gems = (S_missions.gems || 0) + amount;
  } else {
    S.gems = (S.gems || 0) + amount;
  }
  return getGems();
}

// Récupérer le nombre de gemmes
function getGems() {
  if (typeof window.S_missions !== 'undefined' && S_missions.gems !== undefined) {
    return S_missions.gems;
  }
  return S.gems || 0;
}

// Vérifier si une mission est complétée
function isMissionCompleted(missionId) {
  return window.S_missions && S_missions.completed && S_missions.completed[missionId] === true;
}

// Marquer une mission comme complétée
function completeMissionState(missionId) {
  if (!window.S_missions) return false;
  if (!S_missions.completed) S_missions.completed = {};
  S_missions.completed[missionId] = true;
  if (typeof saveGame === 'function') saveGame();
  return true;
}

// Mettre à jour le streak (série de jours)
function updateStreakState() {
  if (!window.S_streak) return 0;
  
  const now = new Date();
  const today = now.toDateString();
  
  if (S_streak.lastDate === today) return S_streak.count;
  
  const last = S_streak.lastDate ? new Date(S_streak.lastDate) : null;
  const diff = last ? (now - last) / (1000 * 60 * 60 * 24) : null;
  
  if (diff === null || diff > 1.5) {
    S_streak.count = 1;
  } else {
    S_streak.count++;
  }
  
  S_streak.lastDate = today;
  
  // Bonus pour série de 7 jours
  if (S_streak.count === 7 && typeof addGems === 'function') {
    addGems(10);
    if (typeof showNotif === 'function') {
      showNotif('🔥 7 jours consécutifs ! +10 gemmes');
    }
  }
  
  if (typeof saveGame === 'function') saveGame();
  return S_streak.count;
}

// Obtenir le niveau CEFR basé sur XP
function getCEFRLevel() {
  const xp = S.xp || 0;
  if (xp < 300) return { level: 'A1', name: 'Découvreur', icon: '🌱', next: 'A2', needed: 300 - xp };
  if (xp < 800) return { level: 'A2', name: 'Explorateur', icon: '🌟', next: 'B1', needed: 800 - xp };
  if (xp < 1500) return { level: 'B1', name: 'Voyageur', icon: '🏆', next: 'B2', needed: 1500 - xp };
  if (xp < 2500) return { level: 'B2', name: 'Conquérant', icon: '👑', next: 'C1', needed: 2500 - xp };
  return { level: 'C1', name: 'Maître', icon: '🏅', next: null, needed: 0 };
}

// Réinitialiser tout l'état (déconnexion)
function resetAllState() {
  S.playerName = '';
  S.nativeLang = '';
  S.targetLang = '';
  S.scriptPref = 'both';
  S.xp = 0;
  S.level = 1;
  S.gems = 0;
  S.xpBoostEnd = null;
  S.currentLoc = null;
  S.currentNPC = null;
  S.chatHistory = [];
  
  if (window.S_missions) {
    S_missions.completed = {};
    S_missions.current = null;
    S_missions.gems = 0;
  }
  
  if (window.S_streak) {
    S_streak.count = 0;
    S_streak.lastDate = null;
  }
  
  if (window.S_quizCache) {
    for (let key in S_quizCache) {
      delete S_quizCache[key];
    }
  }
  
  if (typeof saveGame === 'function') saveGame();
  console.log("🔄 État global réinitialisé");
}

// Exposer les fonctions globalement
window.addXP = addXP;
window.addGems = addGems;
window.getGems = getGems;
window.isMissionCompleted = isMissionCompleted;
window.completeMissionState = completeMissionState;
window.updateStreakState = updateStreakState;
window.getCEFRLevel = getCEFRLevel;
window.resetAllState = resetAllState;

// =================================================================
// CONNEXION À LA SAUVEGARDE (sera appelée après chargement des autres scripts)
// =================================================================
function initStateFromSave() {
  if (typeof loadGame === 'function') {
    const loaded = loadGame();
    if (loaded) {
      console.log("📀 État chargé depuis sauvegarde");
      // Mettre à jour l'affichage des gemmes si nécessaire
      const gemDisplay = document.getElementById('gemDisplay');
      if (gemDisplay) {
        gemDisplay.textContent = '💎 ' + getGems();
      }
    }
  }
}

// Attendre que la page soit chargée pour initialiser
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStateFromSave);
} else {
  initStateFromSave();
}

console.log("state.js: ✅ État global initialisé");
