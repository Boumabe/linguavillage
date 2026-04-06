/* =================================================================
   missions.js — LinguaVillage
   Système de missions, récompenses, streak et boutique de gemmes
   Aligné avec save.js
   ================================================================= */

// 1. LES DONNÉES DES MISSIONS (On garde CONST ici car c'est unique à ce fichier)
const MISSIONS = {
  market:[
    {id:'m1', icon:'☕', xp:30, gem:1,
     title:{fr:'Commande un café',en:'Order a coffee',es:'Pide un café',ht:'Kòmande yon kafe'},
     desc:{fr:'Dis "Je voudrais un café, s\'il vous plaît"',en:'Say "I\'d like a coffee, please"'},
     hint:{fr:'"Je voudrais un ___"',en:'"I\'d like a ___"'},
     check:['café','coffee','cafe','kafe','koffie','koffee']
    }
    // ... Tu peux ajouter tes autres missions ici
  ],
  school:[],
  park:[],
  home:[]
};

// 2. RÉCUPÉRATION DES VARIABLES DE SAVE.JS (Pas de 'const' ou 'let' ici !)
// On s'assure juste qu'elles existent, sinon on les initialise discrètement
if (typeof S_missions === 'undefined') { var S_missions = { completed: {}, current: null }; }
if (typeof S_streak === 'undefined') { var S_streak = { count: 0, lastDate: null }; }

// 3. LOGIQUE DES MISSIONS
function completeMission(mission) {
  if (!mission || !mission.id) return;
  
  // Marquer comme complétée
  S_missions.completed[mission.id] = true;
  
  // Gain de récompenses (Vérifie si les fonctions de app.js existent)
  if (typeof gainXP === 'function') {
    gainXP(mission.xp || 10);
  }
  
  if (typeof S !== 'undefined') {
    S.gems = (S.gems || 0) + (mission.gem || 0);
  }

  if (typeof showNotif === 'function') {
    showNotif(`✅ Mission réussie : +${mission.xp} XP`);
  }

  // Sauvegarder la progression
  if (typeof saveGame === 'function') {
    saveGame();
  }
}

// 4. SYSTÈME DE STREAK (Série de jours)
function updateStreak() {
  const now = new Date();
  const today = now.toDateString();
  
  if (S_streak.lastDate === today) return; // Déjà fait aujourd'hui

  const last = S_streak.lastDate ? new Date(S_streak.lastDate) : null;
  const diff = last ? (now - last) / (1000 * 60 * 60 * 24) : null;

  if (diff === null || diff > 1.5) {
    S_streak.count = 1; // Nouvelle série ou brisée
  } else {
    S_streak.count++; // Série continue
  }

  S_streak.lastDate = today;
  if (typeof saveGame === 'function') saveGame();
}

// 5. EXTENSION CEFR (Si roadmap.js est présent)
const originalCompleteMission = completeMission;

window.completeMission = function(mission) {
  if (S_missions.completed[mission.id]) return;
  
  // Appeler la logique de base
  originalCompleteMission(mission);
  
  // Intégration Roadmap CEFR
  if (typeof CEFR_ROADMAP !== 'undefined') {
    console.log("Vérification de la progression CEFR...");
    // Ici tu peux ajouter la logique pour débloquer les niveaux A1, A2...
  }
};

console.log("missions.js: ✅ Chargé et aligné avec save.js");
