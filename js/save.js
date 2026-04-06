// Tout en haut de save.js
var S = {
  playerName: '',
  nativeLang: '',
  targetLang: '',
  scriptPref: 'standard',
  xp: 0,
  level: 1,
  // ... autres valeurs par défaut
};

var S_missions = { completed: {}, current: null };
var S_streak = { count: 0, lastDate: null };

/* =================================================================
   save.js — LinguaVillage
   Sauvegarde locale (localStorage) + cache quiz
   Chargé EN PREMIER dans index.html
   ================================================================= */

const SAVE_KEY  = 'linguavillage_save';
const QUOTA_KEY = 'linguavillage_quota_warn';

// -----------------------------------------------------------------
// SAUVEGARDE
// -----------------------------------------------------------------
function saveGame() {
  const data = {
    playerName:  S.playerName,
    nativeLang:  S.nativeLang,
    targetLang:  S.targetLang,
    scriptPref:  S.scriptPref,
    xp:          S.xp,
    level:       S.level,
    missions:    S_missions,
    streak:      S_streak,
    quizCache:   S_quizCache,
    lastSave:    Date.now()
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    localStorage.removeItem(QUOTA_KEY);
  } catch(e) {
    // Quota dépassé (fréquent en PWA sur espace disque plein)
    if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      if (!localStorage.getItem(QUOTA_KEY)) {
        localStorage.setItem(QUOTA_KEY, '1');
        showQuotaWarning();
      }
    }
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);

    // Restaurer l'état principal
    S.playerName = data.playerName || '';
    S.nativeLang = data.nativeLang || '';
    S.targetLang = data.targetLang || '';
    S.scriptPref = data.scriptPref || 'both';
    S.xp         = data.xp    || 0;
    S.level      = data.level || 1;

    // Restaurer missions
    if (data.missions) {
      S_missions.completed = data.missions.completed || {};
      S_missions.gems      = data.missions.gems      || 0;
      S_missions.badges    = data.missions.badges    || [];
    }

    // Restaurer streak
    if (data.streak) {
      S_streak.current = data.streak.current || 0;
      S_streak.best    = data.streak.best    || 0;
      S_streak.lastDay = data.streak.lastDay || null;
      S_streak.shield  = data.streak.shield  !== undefined ? data.streak.shield : 1;
    }

    // Restaurer cache quiz
    if (data.quizCache) {
      Object.assign(S_quizCache, data.quizCache);
    }

    return true;
  } catch(e) {
    console.warn('loadGame: données corrompues, reset.', e);
    return false;
  }
}

function resetGame() {
  if (!confirm('Effacer toute la progression ? Cette action est irréversible.')) return;
  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem(QUOTA_KEY);
  location.reload();
}

// -----------------------------------------------------------------
// CACHE QUIZ (évite les appels API répétés pour la même vidéo)
// -----------------------------------------------------------------
var S_quizCache = {};   // { videoId: [questions] }

function getQuizFromCache(videoId) {
  return S_quizCache[videoId] || null;
}

function setQuizInCache(videoId, questions) {
  // Garder max 50 vidéos en cache pour ne pas saturer localStorage
  const keys = Object.keys(S_quizCache);
  if (keys.length >= 50) {
    delete S_quizCache[keys[0]];
  }
  S_quizCache[videoId] = questions;
  saveGame();
}

// -----------------------------------------------------------------
// STREAK
// -----------------------------------------------------------------
var S_streak = {
  current: 0,
  best:    0,
  lastDay: null,   // 'YYYY-MM-DD'
  shield:  1       // 1 bouclier de grâce par semaine
};

function updateStreak() {
  const today     = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (S_streak.lastDay === today) return; // Déjà joué aujourd'hui

  if (S_streak.lastDay === yesterday) {
    // Continuité parfaite
    S_streak.current++;
  } else if (S_streak.lastDay && S_streak.shield > 0) {
    // Un jour manqué → bouclier activé automatiquement
    S_streak.shield--;
    S_streak.current++;
    showNotif('🛡️ Bouclier de grâce utilisé ! Streak sauvé.');
  } else {
    // Streak perdu
    if (S_streak.current > 0) showNotif('💔 Streak perdu. On recommence !');
    S_streak.current = 1;
  }

  S_streak.best    = Math.max(S_streak.best, S_streak.current);
  S_streak.lastDay = today;

  // Recharger le bouclier chaque lundi
  const day = new Date().getDay();
  if (day === 1 && S_streak.shield === 0) S_streak.shield = 1;

  updateStreakDisplay();
  saveGame();
}

function updateStreakDisplay() {
  const el = document.getElementById('streakDisplay');
  if (el) {
    el.textContent = '🔥 ' + S_streak.current;
    el.title       = 'Record : ' + S_streak.best + ' jours';
  }
}

// -----------------------------------------------------------------
// AVERTISSEMENT QUOTA PWA
// -----------------------------------------------------------------
function showQuotaWarning() {
  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;bottom:70px;left:50%;transform:translateX(-50%);'
    + 'background:#1a0a2e;border:1px solid #e05555;border-radius:14px;'
    + 'padding:12px 18px;font-size:0.78rem;color:#f0e8d0;z-index:9999;'
    + 'max-width:320px;text-align:center;line-height:1.5;';
  div.innerHTML = '⚠️ Espace de stockage presque plein.<br>'
    + 'Libère de l\'espace sur ton appareil pour ne pas perdre ta progression.'
    + '<br><button onclick="this.parentElement.remove()" style="margin-top:8px;'
    + 'background:rgba(255,255,255,0.1);border:none;color:#f0e8d0;padding:4px 14px;'
    + 'border-radius:8px;cursor:pointer;font-family:Nunito,sans-serif;">OK</button>';
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 8000);
}

// -----------------------------------------------------------------
// CHARGEMENT AUTOMATIQUE SÉCURISÉ
// -----------------------------------------------------------------
window.addEventListener('load', function() {
  // On utilise 'load' au lieu de 'DOMContentLoaded' pour être sûr 
  // que app.js a eu le temps d'être interprété par le navigateur.
  
  const hasSave = loadGame();

  // On vérifie si S est bien rempli et si on peut passer l'écran d'accueil
  if (hasSave && S.playerName && S.nativeLang && S.targetLang) {
    console.log("Sauvegarde détectée, tentative de démarrage direct...");
    
    // On attend un tout petit peu que app.js attache ses fonctions
    setTimeout(() => {
      if (typeof startMenu === 'function') {
        startMenu();
      } else {
        console.warn("startMenu n'est pas encore prêt, l'utilisateur devra cliquer.");
      }
    }, 100);
  }
});
