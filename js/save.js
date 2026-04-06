/* =================================================================
   save.js — LinguaVillage
   Source de vérité pour les données globales
   ================================================================= */

// 1. DÉCLARATION DES VARIABLES GLOBALES (Source unique)
// On utilise 'var' pour permettre la ré-assignation sans erreur 'already declared'
var S = window.S || {
  playerName: '',
  nativeLang: '',
  targetLang: '',
  scriptPref: 'standard',
  xp: 0,
  level: 1
};

var S_missions = window.S_missions || { completed: {}, current: null };
var S_streak = window.S_streak || { count: 0, lastDate: null };
var S_quizCache = window.S_quizCache || {};

const SAVE_KEY  = 'linguavillage_save';
const QUOTA_KEY = 'linguavillage_quota_warn';

// 2. LOGIQUE DE SAUVEGARDE
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
  } catch(e) {
    if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      if (!localStorage.getItem(QUOTA_KEY)) {
        localStorage.setItem(QUOTA_KEY, '1');
        showQuotaWarning();
      }
    }
  }
}

// 3. LOGIQUE DE CHARGEMENT
function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const d = JSON.parse(raw);
    if (!d) return false;

    // Mise à jour des variables globales avec les données chargées
    S.playerName = d.playerName || '';
    S.nativeLang = d.nativeLang || '';
    S.targetLang = d.targetLang || '';
    S.scriptPref = d.scriptPref || 'standard';
    S.xp         = d.xp || 0;
    S.level      = d.level || 1;

    if (d.missions) S_missions = d.missions;
    if (d.streak)   S_streak   = d.streak;
    if (d.quizCache) S_quizCache = d.quizCache;

    return true;
  } catch(e) {
    console.error("Erreur de chargement:", e);
    return false;
  }
}

// 4. ALERTE ESPACE DISQUE
function showQuotaWarning() {
  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;bottom:70px;left:50%;transform:translateX(-50%);'
    + 'background:#1a0a2e;border:1px solid #e05555;border-radius:14px;'
    + 'padding:12px 18px;font-size:0.78rem;color:#f0e8d0;z-index:9999;';
  div.innerHTML = '⚠️ Stockage plein. Libère de l\'espace pour ne pas perdre ta progression.<br>'
    + '<button onclick="this.parentElement.remove()" style="margin-top:8px;background:gold;color:black;border:none;padding:4px 10px;border-radius:5px;">OK</button>';
  document.body.appendChild(div);
}

// 5. INITIALISATION AUTOMATIQUE SÉCURISÉE
window.addEventListener('load', function() {
  const hasSave = loadGame();

  // Si une sauvegarde complète existe, on tente de lancer l'interface
  if (hasSave && S.playerName && S.nativeLang && S.targetLang) {
    console.log("Sauvegarde trouvée, démarrage...");
    setTimeout(() => {
      if (typeof startMenu === 'function') {
        startMenu();
      }
    }, 200);
  } else {
    console.log("Pas de sauvegarde ou incomplète. Attente de l'utilisateur.");
  }
});
