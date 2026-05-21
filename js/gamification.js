// gamification.js - CORRIGÉ (fonctions manquantes ajoutées)
// LinguaVillage — gamification.js
// Streak, missions, boutique, quiz, progression

// =================================================================
// INITIALISATION
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

// =================================================================
// BADGES
// =================================================================
if (typeof BADGES === 'undefined') {
  var BADGES = [
    {id:'b1', xp:100,  icon:'🌱', fr:'Apprenti',          en:'Apprentice'},
    {id:'b2', xp:300,  icon:'⭐', fr:'Explorateur',       en:'Explorer'},
    {id:'b3', xp:600,  icon:'🏅', fr:'Voyageur',          en:'Traveler'},
    {id:'b4', xp:1000, icon:'🏆', fr:'Champion',          en:'Champion'},
    {id:'b5', xp:2000, icon:'👑', fr:'Maître des langues', en:'Language Master'},
  ];
}

// =================================================================
// SURPRISE VIDEOS
// =================================================================
if (typeof SURPRISE_VIDEOS === 'undefined') {
  var SURPRISE_VIDEOS = {
    fr:[
      {id:'French1.3', t:'FSI Français — Unité 1', diff:'🟢'},
      {id:'LearnToSpeakFrenchVideo1-11', t:'Learn French — Video 1-11', diff:'🟢'},
    ],
    en:[
      {id:'FSIEnglishBasic_Vol1', t:'FSI English Basic Vol.1', diff:'🟢'},
    ],
    es:[
      {id:'FsiSpanishBasicCourseVolume1Unit01a', t:'FSI Español Básico Vol.1', diff:'🟢'},
    ],
    ht:[
      {id:'HaitianCreoleBasic_Archive', t:'Kreyòl Ayisyen — Baz', diff:'🟢'},
    ],
    de:[
      {id:'GermanFSI_Basic_Vol1', t:'FSI Deutsch Basiskurs Vol.1', diff:'🟢'},
    ],
    ru:[
      {id:'RussianFSI_Basic', t:'FSI Русский — Базовый', diff:'🟢'},
    ],
    zh:[
      {id:'MandarinFSI_Basic', t:'FSI 普通话 基础', diff:'🟢'},
    ],
    ja:[
      {id:'JapaneseFSI_Basic', t:'FSI 日本語 基礎', diff:'🟢'},
    ],
  };
}

// =================================================================
// STREAK
// =================================================================
function checkDailyStreak() {
  var today     = new Date().toISOString().split('T')[0];
  var yesterday = new Date(Date.now()-86400000).toISOString().split('T')[0];
  if (G.lastPlayDate === today) return;
  if (G.lastPlayDate === yesterday) {
    G.streak++;
    if (G.streak > G.bestStreak) G.bestStreak = G.streak;
    if (G.streak % 30 === 0)     { showStreakMilestone(G.streak); grantChest('legendary'); }
    else if (G.streak % 7 === 0) { showStreakMilestone(G.streak); grantChest('rare'); }
    else if (typeof showNotif === 'function') showNotif('🔥 Streak ' + G.streak + ' jours!');
  } else if (G.lastPlayDate && G.lastPlayDate !== today) {
    if (G.streak > 0 && G.streakFreezes > 0 && !G.streakFreezeUsed) {
      G.streakFreezes--; G.streakFreezeUsed = true;
      if (typeof showNotif === 'function') showNotif('🛡️ Bouclier utilisé! Streak sauvé: ' + G.streak + ' jours');
    } else if (G.streak > 0) { showStreakLost(G.streak); G.streak = 1; }
    else G.streak = 1;
  } else G.streak = 1;
  G.lastPlayDate = today; G.streakFreezeUsed = false;
  G.stats.sessionsPlayed = (G.stats.sessionsPlayed||0)+1;
  updateStreakDisplay(); checkDailyChallenge(); 
  if (typeof saveGame === 'function') saveGame();
}

function showStreakMilestone(n) {
  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9999;display:flex;align-items:center;justify-content:center;';
  var msg = n>=30?'👑 LÉGENDAIRE!':n>=14?'🏆 IMPRESSIONNANT!':'🔥 EN FEU!';
  var reward = n>=30?'Coffre Légendaire':'Coffre Rare';
  ov.innerHTML = '<div style="text-align:center;padding:28px">'
    +'<div style="font-size:4rem;margin-bottom:10px">🔥</div>'
    +'<div style="font-family:Cinzel,serif;color:#ff9f43;font-size:1.4rem;margin-bottom:6px">'+msg+'</div>'
    +'<div style="color:#f0e8d0;font-size:1rem;margin-bottom:4px">'+n+' jours consécutifs!</div>'
    +'<div style="color:#4ecf70;font-size:0.82rem;margin-bottom:20px">🎁 Récompense: '+reward+'</div>'
    +'<button onclick="this.parentElement.parentElement.remove()" style="background:linear-gradient(135deg,#ff6b00,#ff9f43);border:none;border-radius:14px;padding:11px 28px;font-family:Cinzel,serif;font-weight:700;cursor:pointer;font-size:0.88rem;color:#fff">🔥 Continuer!</button>'
    +'</div>';
  document.body.appendChild(ov); 
  if (typeof launchConfetti === 'function') launchConfetti();
}

function showStreakLost(n) {
  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9999;display:flex;align-items:center;justify-content:center;';
  ov.innerHTML = '<div style="text-align:center;padding:28px;max-width:280px">'
    +'<div style="font-size:3rem;margin-bottom:10px">💔</div>'
    +'<div style="font-family:Cinzel,serif;color:#e05555;font-size:1.1rem;margin-bottom:8px">Streak perdu!</div>'
    +'<div style="color:rgba(255,255,255,0.55);font-size:0.82rem;margin-bottom:6px">Tu avais '+n+' jours consécutifs...</div>'
    +'<div style="color:#FFD700;font-size:0.75rem;margin-bottom:18px">💡 Achète un bouclier en boutique pour te protéger</div>'
    +'<button onclick="this.parentElement.parentElement.remove()" style="background:rgba(224,85,85,0.18);border:1px solid #e05555;border-radius:13px;padding:9px 24px;font-family:Cinzel,serif;color:#e05555;cursor:pointer;font-size:0.82rem">Recommencer</button>'
    +'</div>';
  document.body.appendChild(ov);
}

function updateStreakDisplay() {
  var el = document.getElementById('streakDisplay');
  if (el) { el.textContent = '🔥 '+(G.streak||0); el.style.color = G.streak>=7?'#ff9f43':'#ffcc55'; }
}

// =================================================================
// MISSIONS DATA
// =================================================================
var _MISSIONS_DATA = {
  market:[
    {id:'m_market_1',icon:'☕',xp:30,gem:1,
     title:{fr:'Commande un café',en:'Order a coffee',es:'Pide un café',ht:'Kòmande yon kafe',de:'Kaffee bestellen',ru:'Закажи кофе',zh:'点咖啡',ja:'コーヒー注文'},
     desc:{fr:'Dis "Je voudrais un café"',en:'Say "I\'d like a coffee"',es:'Di "Quisiera un café"',ht:'Di "Mwen ta renmen yon kafe"',de:'Sag "Ich möchte einen Kaffee"',ru:'Скажи "Кофе, пожалуйста"',zh:'说"我要一杯咖啡"',ja:'「コーヒーをください」と言う'},
     check:['café','coffee','kafe','kaffee','кофе','咖啡','コーヒー']},
  ],
  school:[
    {id:'m_school_1',icon:'📚',xp:35,gem:1,
     title:{fr:'Pose une question',en:'Ask a question',es:'Haz una pregunta',ht:'Poze yon kesyon',de:'Frage stellen',ru:'Задай вопрос',zh:'提问',ja:'質問する'},
     check:['expliquer','explain','explicar']},
  ],
};

function getMissionsForLoc(locId) {
  return _MISSIONS_DATA[locId] || [];
}

function openMissionsPanel(locId) {
  var missions = getMissionsForLoc(locId);
  var panel = document.getElementById('missionsPanel');
  if (!panel) return;
  if (!missions.length) { panel.style.display = 'none'; return; }
  var nl = S.nativeLang || 'fr';
  var gems = S_missions ? (S_missions.gems || 0) : 0;
  var doneCount = S_missions ? Object.keys(S_missions.completed || {}).length : 0;
  var html = '<div style="padding:9px 13px 6px;background:rgba(255,215,0,0.05);border-bottom:1px solid rgba(255,215,0,0.12);">'
    +'<div style="font-family:Cinzel,serif;font-size:0.83rem;color:#FFD700;margin-bottom:2px">🎯 Missions</div>'
    +'<div style="font-size:0.62rem;color:rgba(255,255,255,0.38)">💎 '+gems+' gemmes · '+doneCount+' complétées</div>'
    +'</div><div style="overflow-y:auto;max-height:195px;padding:8px;">';
  missions.forEach(function(m){
    var done = S_missions && !!S_missions.completed[m.id];
    var title = (m.title[nl] || m.title.fr || '').replace(/'/g, '&apos;');
    var desc = (m.desc[nl] || m.desc.fr || '').replace(/'/g, '&apos;');
    var badge = done ? '✅' : ('+'+m.xp+' XP · '+'💎'.repeat(m.gem));
    html += '<div style="background:'+(done?'rgba(78,207,112,0.07)':'rgba(255,255,255,0.03)')+';border:1px solid '+(done?'rgba(78,207,112,0.25)':'rgba(255,255,255,0.09)')+';border-radius:10px;padding:9px 10px;margin-bottom:5px;cursor:'+(done?'default':'pointer')+'"'
      +(done?'':' onclick="startMission(\''+m.id+'\',\''+locId+'\')"')+'>'
      +'<div style="display:flex;align-items:center;gap:7px;margin-bottom:3px">'
      +'<span style="font-size:1.05rem">'+m.icon+'</span>'
      +'<span style="font-weight:800;font-size:0.8rem;color:'+(done?'#4ecf70':'#f0e8d0')+'">'+title+'</span>'
      +'<span style="margin-left:auto;font-size:0.62rem;color:'+(done?'#4ecf70':'#FFD700')+'">'+badge+'</span>'
      +'</div>'
      +'<div style="font-size:0.68rem;color:rgba(255,255,255,0.42)">'+desc+'</div>'
      +'</div>';
  });
  html += '</div>';
  panel.innerHTML = html;
  panel.style.display = 'block';
}

// =================================================================
// MISSIONS
// =================================================================
var _activeMission = null;

function startMission(missionId, locId) {
  var missions = getMissionsForLoc(locId);
  _activeMission = missions.find(function(m){ return m.id === missionId; });
  if (!_activeMission) return;
  var nl = S.nativeLang || 'fr';
  var inp = document.getElementById('dialInput');
  if (inp) { inp.placeholder = '💡 ' + (_activeMission.hint[nl] || _activeMission.hint.fr || ''); inp.style.borderColor = '#FFD700'; }
  if (typeof showNotif === 'function') showNotif('🎯 ' + (_activeMission.title[nl] || _activeMission.title.fr || ''));
}

function completeMission(m) {
  if (!S_missions) return;
  if (S_missions.completed[m.id]) return;
  S_missions.completed[m.id] = true;
  S_missions.gems = (S_missions.gems || 0) + m.gem;
  if (typeof gainXP === 'function') gainXP(m.xp);
  var gd = document.getElementById('gemDisplay'); if (gd) gd.textContent = '💎 ' + S_missions.gems;
  if (typeof checkBadges === 'function') checkBadges();
  if (typeof updateDailyProgress === 'function') updateDailyProgress('mission', 1);
  if (typeof saveGame === 'function') saveGame();
}

function checkMissionInMessage(text) {
  if (!_activeMission) return;
  var lower = text.toLowerCase();
  var hit = _activeMission.check.some(function(kw){ return lower.includes(kw.toLowerCase()); });
  if (hit) {
    completeMission(_activeMission); _activeMission = null;
    var inp = document.getElementById('dialInput');
    if (inp) { inp.placeholder = 'Votre réponse...'; inp.style.borderColor = ''; }
  }
}

// =================================================================
// BOSS
// =================================================================
function showWorldMap() {
  if (typeof showNotif === 'function') showNotif('🗺️ Carte du monde — Progression');
}

function startBossChallenge(zoneId) {
  if (typeof showNotif === 'function') showNotif('⚔️ Boss challenge!');
}

function damageBoss(dmg) {}
function defeatBoss(zoneId) {}

// =================================================================
// COFFRES
// =================================================================
var CHEST_TYPES = {
  common:    {id:'common',    icon:'📦', fr:'Coffre Commun',    color:'#888888', rewards:[{type:'xp',value:20,w:50},{type:'xp',value:30,w:30},{type:'gems',value:1,w:15},{type:'boost',value:30,w:5}]},
  rare:      {id:'rare',      icon:'💎', fr:'Coffre Rare',      color:'#4a9eff', rewards:[{type:'xp',value:60,w:40},{type:'gems',value:2,w:35},{type:'gems',value:3,w:15},{type:'boost',value:60,w:10}]},
  epic:      {id:'epic',      icon:'💜', fr:'Coffre Épique',    color:'#e040fb', rewards:[{type:'xp',value:100,w:30},{type:'gems',value:4,w:35},{type:'gems',value:6,w:20},{type:'boost',value:120,w:15}]},
  legendary: {id:'legendary', icon:'🌟', fr:'Coffre Légendaire',color:'#FFD700', rewards:[{type:'xp',value:200,w:20},{type:'gems',value:8,w:30},{type:'gems',value:12,w:30},{type:'boost',value:180,w:20}]},
};

function grantChest(type) {
  var chest = CHEST_TYPES[type] || CHEST_TYPES.common;
  if (typeof showNotif === 'function') showNotif(chest.icon + ' ' + chest.fr + ' reçu!');
}

// =================================================================
// DÉFIS QUOTIDIENS
// =================================================================
function checkDailyChallenge() {
  var today = new Date().toISOString().split('T')[0];
  if (!G.dailyChallenge || G.dailyChallenge.date !== today) {
    G.dailyChallenge = {id:'dc1', type:'dialogue', done:false, date:today, progress:0, target:5};
    if (typeof saveGame === 'function') saveGame();
  }
}

function updateDailyProgress(type, amount) {
  if (!G.dailyChallenge || G.dailyChallenge.done) return;
  if (G.dailyChallenge.type !== type) return;
  G.dailyChallenge.progress = (G.dailyChallenge.progress || 0) + (amount || 1);
  if (G.dailyChallenge.progress >= G.dailyChallenge.target) {
    G.dailyChallenge.done = true;
    if (typeof gainXP === 'function') gainXP(50);
    if (typeof showNotif === 'function') showNotif('🎯 Défi quotidien terminé! +50 XP');
  }
  if (typeof saveGame === 'function') saveGame();
}

// =================================================================
// PROGRESSION
// =================================================================
function showProgression() {
  if (typeof showNotif === 'function') showNotif('📊 Progression — ' + (S.xp || 0) + ' XP');
}

// =================================================================
// BOUTIQUE
// =================================================================
function openShop() {
  if (typeof showNotif === 'function') showNotif('🏪 Boutique');
}

// =================================================================
// MODE SURPRISE
// =================================================================
var _surpriseActive = false;

function launchSurpriseMode() {
  if (_surpriseActive) return;
  _surpriseActive = true;
  
  var lang = S.targetLang || 'fr';
  var videos = SURPRISE_VIDEOS[lang] || SURPRISE_VIDEOS.fr;
  var video = videos[Math.floor(Math.random() * videos.length)];
  
  var ov = document.createElement('div');
  ov.id = 'surpriseOverlay';
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;';
  ov.innerHTML = `
    <div style="background:linear-gradient(135deg,#0f1830,#0a0a14);border:2px solid #ffd700;border-radius:24px;padding:24px;max-width:400px;width:100%;text-align:center;">
      <div style="font-size:3rem;margin-bottom:12px;">⚡🎬</div>
      <div style="font-family:'Cinzel',serif;font-size:1.1rem;color:#ffd700;margin-bottom:8px;">Mode Surprise!</div>
      <div style="font-size:0.85rem;color:var(--text);margin-bottom:16px;">Découvre cette vidéo éducative pour progresser en ${LANG_NAMES[lang] || lang}</div>
      <div style="background:rgba(224,64,251,0.08);border-radius:16px;margin-bottom:16px;overflow:hidden;">
        <iframe src="https://archive.org/embed/${video.id}" style="width:100%;height:180px;border:none;" allowfullscreen></iframe>
      </div>
      <div style="font-weight:800;color:#e040fb;margin-bottom:12px;">${video.t} — ${video.diff}</div>
      <button onclick="closeSurpriseMode()" style="background:rgba(255,107,107,0.1);border:1px solid rgba(255,107,107,0.3);border-radius:14px;padding:10px 20px;color:#ff6b6b;font-weight:800;cursor:pointer;">Fermer</button>
    </div>
  `;
  document.body.appendChild(ov);
  
  if (typeof gainXP === 'function') gainXP(15);
  if (typeof showNotif === 'function') showNotif('⚡ +15 XP pour le mode surprise!');
}

function closeSurpriseMode() {
  var ov = document.getElementById('surpriseOverlay');
  if (ov) ov.remove();
  _surpriseActive = false;
}

function nextSurpriseVideo() {}
function getRandomSurpriseVideo() {}

// =================================================================
// HOOK sendMsg
// =================================================================
function onMessageSent(text) {
  G.stats.msgSent = (G.stats.msgSent || 0) + 1;
  G.stats.wordsTyped = (G.stats.wordsTyped || 0) + text.split(' ').length;
  updateDailyProgress('dialogue', 1);
  if (typeof saveGame === 'function') saveGame();
}

// =================================================================
// CHECK BADGES
// =================================================================
function checkBadges() {
  if (!S || !S_missions) return;
  var xp = S.xp || 0;
  var currentBadges = S_missions.badges || [];
  
  BADGES.forEach(function(badge) {
    if (xp >= badge.xp && !currentBadges.includes(badge.id)) {
      currentBadges.push(badge.id);
      if (typeof showNotif === 'function') showNotif(badge.icon + ' Badge débloqué: ' + (badge.fr || badge.en));
      if (typeof gainXP === 'function') gainXP(50);
      if (typeof saveGame === 'function') saveGame();
    }
  });
  S_missions.badges = currentBadges;
}

// =================================================================
// INITIALISATION
// =================================================================
function initGame(){
  checkDailyStreak();
  setTimeout(function(){ updateStreakDisplay(); }, 600);
  checkBadges();
}

initGame();
