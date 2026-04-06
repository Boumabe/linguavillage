/* =================================================================
   save.js — LinguaVillage
   Sauvegarde et chargement des données
   Version corrigée - sans redéclaration de S
   Dépendances : state.js (chargé avant)
   ================================================================= */

// =================================================================
// CONSTANTES
// =================================================================
const SAVE_KEY  = 'linguavillage_save';
const QUOTA_KEY = 'linguavillage_quota_warn';

// =================================================================
// LOGIQUE DE SAUVEGARDE
// =================================================================
function saveGame() {
  // Vérifier que window.S existe
  if (typeof window.S === 'undefined') {
    console.warn("saveGame: S non défini");
    return;
  }
  
  // Vérifier que S_missions existe
  if (typeof window.S_missions === 'undefined') {
    window.S_missions = { completed: {}, current: null, gems: 0 };
  }
  
  // Vérifier que S_streak existe
  if (typeof window.S_streak === 'undefined') {
    window.S_streak = { count: 0, lastDate: null };
  }
  
  const data = {
    playerName:  S.playerName || '',
    nativeLang:  S.nativeLang || '',
    targetLang:  S.targetLang || '',
    scriptPref:  S.scriptPref || 'both',
    xp:          S.xp || 0,
    level:       S.level || 1,
    gems:        S_missions.gems || 0,
    missions:    S_missions,
    streak:      S_streak,
    lastSave:    Date.now()
  };
  
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    console.log("✅ Partie sauvegardée");
  } catch(e) {
    if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      if (!localStorage.getItem(QUOTA_KEY)) {
        localStorage.setItem(QUOTA_KEY, '1');
        showQuotaWarning();
      }
      console.error("Quota dépassé:", e);
    } else {
      console.error("Erreur de sauvegarde:", e);
    }
  }
}

// =================================================================
// LOGIQUE DE CHARGEMENT
// =================================================================
function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      console.log("Aucune sauvegarde trouvée");
      return false;
    }
    
    const d = JSON.parse(raw);
    if (!d) return false;
    
    // S'assurer que window.S existe
    if (typeof window.S === 'undefined') {
      window.S = {};
    }
    
    // Mise à jour des variables globales
    S.playerName = d.playerName || '';
    S.nativeLang = d.nativeLang || '';
    S.targetLang = d.targetLang || '';
    S.scriptPref = d.scriptPref || 'both';
    S.xp = d.xp || 0;
    S.level = d.level || 1;
    
    // Mise à jour des missions
    if (d.missions) {
      window.S_missions = d.missions;
    } else if (typeof window.S_missions === 'undefined') {
      window.S_missions = { completed: {}, current: null, gems: 0 };
    }
    
    // Mise à jour du streak
    if (d.streak) {
      window.S_streak = d.streak;
    } else if (typeof window.S_streak === 'undefined') {
      window.S_streak = { count: 0, lastDate: null };
    }
    
    // S'assurer que gems est présent
    if (typeof S_missions.gems === 'undefined') {
      S_missions.gems = d.gems || 0;
    }
    
    console.log("✅ Sauvegarde chargée: XP=" + S.xp + ", niveau=" + S.level);
    return true;
    
  } catch(e) {
    console.error("Erreur de chargement:", e);
    return false;
  }
}

// =================================================================
// ALERTE ESPACE DISQUE
// =================================================================
function showQuotaWarning() {
  // Vérifier si l'alerte existe déjà
  if (document.getElementById('quotaWarning')) return;
  
  const div = document.createElement('div');
  div.id = 'quotaWarning';
  div.style.cssText = 'position:fixed;bottom:70px;left:50%;transform:translateX(-50%);'
    + 'background:#1a0a2e;border:2px solid #e05555;border-radius:14px;'
    + 'padding:12px 18px;font-size:0.78rem;color:#f0e8d0;z-index:9999;'
    + 'backdrop-filter:blur(8px);max-width:280px;text-align:center;';
  div.innerHTML = '⚠️ Stockage plein.<br>Libère de l\'espace pour ne pas perdre ta progression.<br>'
    + '<button onclick="this.parentElement.remove()" style="margin-top:10px;background:var(--gold);color:#1a0800;border:none;padding:6px 16px;border-radius:8px;cursor:pointer;font-weight:800;">OK</button>';
  document.body.appendChild(div);
  
  // Auto-suppression après 10 secondes
  setTimeout(() => {
    const el = document.getElementById('quotaWarning');
    if (el) el.remove();
  }, 10000);
}

// =================================================================
// RÉINITIALISATION COMPLÈTE (optionnelle)
// =================================================================
function resetSave() {
  if (confirm('⚠️ Supprimer toute progression ? Cette action est irréversible.')) {
    localStorage.removeItem(SAVE_KEY);
    
    // Réinitialiser les variables globales
    if (typeof window.S !== 'undefined') {
      S.playerName = '';
      S.nativeLang = '';
      S.targetLang = '';
      S.scriptPref = 'both';
      S.xp = 0;
      S.level = 1;
    }
    
    if (typeof window.S_missions !== 'undefined') {
      S_missions.completed = {};
      S_missions.current = null;
      S_missions.gems = 0;
    }
    
    if (typeof window.S_streak !== 'undefined') {
      S_streak.count = 0;
      S_streak.lastDate = null;
    }
    
    showNotif('🗑️ Progression réinitialisée');
    console.log("Sauvegarde réinitialisée");
    
    // Recharger la page après un court délai
    setTimeout(() => {
      location.reload();
    }, 1500);
  }
}

// =================================================================
// EXPOSER UNE FONCTION DE DEBUG
// =================================================================
function showSaveDebug() {
  const data = localStorage.getItem(SAVE_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      console.log("=== DEBUG SAUVEGARDE ===");
      console.log("XP:", parsed.xp);
      console.log("Niveau:", parsed.level);
      console.log("Langue maternelle:", parsed.nativeLang);
      console.log("Langue cible:", parsed.targetLang);
      console.log("Missions complétées:", Object.keys(parsed.missions?.completed || {}).length);
      console.log("Gemmes:", parsed.gems);
      console.log("Dernière sauvegarde:", new Date(parsed.lastSave).toLocaleString());
      console.log("========================");
      showNotif(`📊 XP: ${parsed.xp} | Niv: ${parsed.level} | Missions: ${Object.keys(parsed.missions?.completed || {}).length}`);
    } catch(e) {
      console.error("Erreur debug:", e);
    }
  } else {
    console.log("Aucune sauvegarde trouvée");
    showNotif("📊 Aucune sauvegarde");
  }
}

// =================================================================
// SAUVEGARDE AUTOMATIQUE (toutes les 30 secondes)
// =================================================================
let autoSaveInterval = null;

function startAutoSave() {
  if (autoSaveInterval) clearInterval(autoSaveInterval);
  autoSaveInterval = setInterval(() => {
    if (typeof window.S !== 'undefined' && S.playerName) {
      saveGame();
    }
  }, 30000);
  console.log("⏲️ Auto-save activé (30s)");
}

function stopAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
    console.log("⏲️ Auto-save désactivé");
  }
}

// =================================================================
// INITIALISATION AU CHARGEMENT
// =================================================================
// NE PAS redéclarer S ici ! On utilise window.S déjà créé par state.js
// On s'assure juste que S_missions et S_streak existent

if (typeof window.S_missions === 'undefined') {
  window.S_missions = { completed: {}, current: null, gems: 0 };
}

if (typeof window.S_streak === 'undefined') {
  window.S_streak = { count: 0, lastDate: null };
}

// Charger la sauvegarde si elle existe
const hasSave = loadGame();

// Démarrer l'auto-save si on a un joueur
if (hasSave && typeof window.S !== 'undefined' && S.playerName) {
  startAutoSave();
}

// Exposer les fonctions utiles globalement
window.saveGame = saveGame;
window.loadGame = loadGame;
window.resetSave = resetSave;
window.showSaveDebug = showSaveDebug;
window.startAutoSave = startAutoSave;
window.stopAutoSave = stopAutoSave;

console.log("save.js: ✅ Chargé - S existe:", typeof window.S !== 'undefined');
