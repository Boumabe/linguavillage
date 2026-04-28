// LinguaVillage — gamification.js
// Gamification : streak, missions, boutique, mode surprise, quiz, progression
// Modifier ici pour ajouter des missions ou items dans la boutique

  let currentLevel = "A1", nextLevel = "A2", progressPercent = 0, levelColor = "#4ecf70", levelIcon = "🌱";
  
  if (totalXP < 300) {
    currentLevel = "A1"; nextLevel = "A2";
    progressPercent = Math.min(100, Math.floor((totalXP / 300) * 100));
    levelColor = "#4ecf70"; levelIcon = "🌱";
  } else if (totalXP < 800) {
    currentLevel = "A2"; nextLevel = "B1";
    progressPercent = Math.min(100, Math.floor(((totalXP - 300) / 500) * 100));
    levelColor = "#4a9eff"; levelIcon = "🌟";
  } else if (totalXP < 1500) {
    currentLevel = "B1"; nextLevel = "B2";
    progressPercent = Math.min(100, Math.floor(((totalXP - 800) / 700) * 100));
    levelColor = "#ff9f43"; levelIcon = "🏆";
  } else if (totalXP < 2500) {
    currentLevel = "B2"; nextLevel = "C1";
    progressPercent = Math.min(100, Math.floor(((totalXP - 1500) / 1000) * 100));
    levelColor = "#e040fb"; levelIcon = "👑";
  } else {
    currentLevel = "C1"; nextLevel = null;
    progressPercent = 100; levelColor = "#ff6b6b"; levelIcon = "🏅";
  }
  
  const indicator = document.createElement('div');
  indicator.id = 'cefrIndicator';
  indicator.style.cssText = `display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.5); padding: 2px 8px; border-radius: 20px; margin-left: auto; margin-right: 8px; font-size: 0.7rem; cursor: pointer;`;
  indicator.onclick = () => showNotif('🗺️ Niveau ' + currentLevel + ' → ' + (nextLevel || '🏆 Maître !') + ' (' + progressPercent + '%)');
  indicator.innerHTML = `
    <span style="font-size:0.85rem;">${levelIcon}</span>
    <span style="font-weight:800;color:${levelColor}">${currentLevel}</span>
    <div style="width:40px;height:4px;background:rgba(255,255,255,0.2);border-radius:2px;overflow:hidden;">
      <div style="width:${progressPercent}%;height:100%;background:${levelColor};border-radius:2px;"></div>
    </div>
    ${nextLevel ? `<span style="font-size:0.6rem;color:var(--dim);">→ ${nextLevel}</span>` : '🏆'}
  `;
  hud.appendChild(indicator);
}

// =================================================================
// ÉTAT MISSIONS & BOUTIQUE
// =================================================================
// =================================================================
// ZONES DU MONDE
// =================================================================
var ZONES = {
  zone_debutant:     { id:'zone_debutant',     icon:'🌱', order:1, xpRequired:0,    fr:'Village de l\'Aube',    en:'Dawn Village',      color:'#4ecf70', locs:['church','school','friends'],  boss:{fr:'Le Vieil Érudit',    en:'The Old Scholar',  icon:'📚', hp:5, reward:{xp:100,gems:3,chest:'rare'},     challenge:'Mène une conversation complète de 5 échanges sur ta famille sans fautes.', check:5}},
  zone_elementaire:  { id:'zone_elementaire',  icon:'⭐', order:2, xpRequired:300,  fr:'Bourg du Marché',       en:'Market Town',       color:'#4a9eff', locs:['market','tavern','park'],     boss:{fr:'Le Marchand Pressé', en:'The Busy Merchant', icon:'💼', hp:6, reward:{xp:200,gems:5,chest:'epic'},     challenge:'Négocie un prix, commande 3 choses ET demande des directions.'}},
  zone_intermediaire:{ id:'zone_intermediaire', icon:'🏅', order:3, xpRequired:800,  fr:'Cité des Voyageurs',    en:'Traveler\'s City',  color:'#e040fb', locs:['station','bank','hospital'],  boss:{fr:'Le Diplomate',       en:'The Diplomat',     icon:'🎩', hp:8, reward:{xp:350,gems:8,chest:'legendary'}, challenge:'Explique un problème complexe et négocie une solution formelle.'}},
  zone_avance:       { id:'zone_avance',        icon:'🏆', order:4, xpRequired:1500, fr:'Tour de la Maîtrise',   en:'Mastery Tower',     color:'#FFD700', locs:['police','factory','cinema'],  boss:{fr:'Le Maître des Langues',en:'Language Master', icon:'👑', hp:10,reward:{xp:500,gems:15,chest:'legendary'},challenge:'Conversation libre de 10 échanges sur un sujet complexe. Niveau C1.'}},
};

function isZoneUnlocked(zoneId) {
  var zone = ZONES[zoneId];
  return zone ? (S.xp||0) >= zone.xpRequired : false;
}

function hexToRgb(hex) {
  return parseInt(hex.slice(1,3),16)+','+parseInt(hex.slice(3,5),16)+','+parseInt(hex.slice(5,7),16);
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
    else showNotif('🔥 Streak ' + G.streak + ' jours!');
  } else if (G.lastPlayDate && G.lastPlayDate !== today) {
    if (G.streak > 0 && G.streakFreezes > 0 && !G.streakFreezeUsed) {
      G.streakFreezes--; G.streakFreezeUsed = true;
      showNotif('🛡️ Bouclier utilisé! Streak sauvé: ' + G.streak + ' jours');
    } else if (G.streak > 0) { showStreakLost(G.streak); G.streak = 1; }
    else G.streak = 1;
  } else G.streak = 1;
  G.lastPlayDate = today; G.streakFreezeUsed = false;
  G.stats.sessionsPlayed = (G.stats.sessionsPlayed||0)+1;
  updateStreakDisplay(); checkDailyChallenge(); saveGame();
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
  document.body.appendChild(ov); launchConfetti();
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
// CARTE DU MONDE
// =================================================================
function showWorldMap() {
  var nl = S.nativeLang||'fr', xp = S.xp||0;
  var zonesHTML = Object.values(ZONES).map(function(zone) {
    var unlocked   = isZoneUnlocked(zone.id);
    var bossData   = G.zoneBosses[zone.id]||{defeated:false};
    var bossOk     = bossData.defeated;
    var current    = unlocked && !bossOk;
    var locsDone   = (zone.locs||[]).filter(function(lid){ return Object.keys(S_missions.completed).some(function(mid){ return mid.startsWith('m_'+lid); }); }).length;
    var locsTotal  = (zone.locs||[]).length;
    var pct        = locsTotal ? Math.round((locsDone/locsTotal)*100) : 0;
    return '<div style="border:2px solid '+(current?zone.color:(unlocked?'rgba(255,255,255,0.12)':'rgba(255,255,255,0.04)'))+';border-radius:15px;padding:13px;margin-bottom:9px;opacity:'+(unlocked?1:0.38)+';position:relative">'
      +(current?'<div style="position:absolute;top:-8px;right:10px;background:'+zone.color+';color:#000;font-size:0.58rem;font-weight:900;padding:2px 8px;border-radius:8px">EN COURS</div>':'')
      +'<div style="display:flex;align-items:center;gap:10px;margin-bottom:7px">'
      +'<span style="font-size:1.5rem">'+zone.icon+'</span>'
      +'<div><div style="font-weight:900;color:'+(unlocked?zone.color:'rgba(255,255,255,0.25)')+';font-size:0.88rem">'+(zone[nl]||zone.fr)+'</div>'
      +'<div style="font-size:0.6rem;color:rgba(255,255,255,0.32)">'+zone.xpRequired+' XP requis</div></div>'
      +(unlocked?'<div style="margin-left:auto;font-size:0.68rem;color:rgba(255,255,255,0.45)">'+locsDone+'/'+locsTotal+'</div>':'<span style="margin-left:auto">🔒</span>')
      +'</div>'
      +(unlocked?'<div style="height:4px;background:rgba(255,255,255,0.07);border-radius:2px;margin-bottom:7px;overflow:hidden"><div style="height:100%;width:'+pct+'%;background:'+zone.color+';border-radius:2px"></div></div>':'')
      +(unlocked?'<div style="display:flex;align-items:center;justify-content:space-between">'
        +'<div style="font-size:0.68rem;color:rgba(255,255,255,0.45)">'+zone.boss.icon+' '+(zone.boss[nl]||zone.boss.fr)+(bossOk?' ✅':'')+'</div>'
        +(bossOk?'':'<button onclick="startBossChallenge(\''+zone.id+'\')" style="background:rgba(255,215,0,0.12);border:1px solid #FFD700;border-radius:8px;padding:3px 10px;color:#FFD700;font-size:0.63rem;font-weight:800;cursor:pointer">⚔️ Défier</button>')
        +'</div>':'')
      +'</div>';
  }).join('');
  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:9500;overflow-y:auto;display:flex;align-items:flex-start;justify-content:center;padding:20px;';
  ov.innerHTML = '<div style="max-width:385px;width:100%;margin:auto">'
    +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">'
    +'<div style="font-family:Cinzel,serif;font-size:1.05rem;color:#FFD700">🗺️ Carte du Monde</div>'
    +'<button onclick="this.closest(\'div\').parentElement.remove()" style="background:transparent;border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.4);padding:3px 9px;border-radius:10px;cursor:pointer;font-size:0.7rem">✕</button>'
    +'</div>'
    +'<div style="background:rgba(255,215,0,0.05);border:1px solid rgba(255,215,0,0.18);border-radius:11px;padding:9px 13px;margin-bottom:13px;display:flex;gap:16px;justify-content:center">'
    +'<div style="text-align:center"><div style="font-size:1.1rem;font-weight:900;color:#FFD700">'+xp+'</div><div style="font-size:0.57rem;color:rgba(255,255,255,0.35)">XP</div></div>'
    +'<div style="text-align:center"><div style="font-size:1.1rem;font-weight:900;color:#4a9eff">'+(S_missions.gems||0)+'</div><div style="font-size:0.57rem;color:rgba(255,255,255,0.35)">💎</div></div>'
    +'<div style="text-align:center"><div style="font-size:1.1rem;font-weight:900;color:#ff9f43">'+(G.streak||0)+'</div><div style="font-size:0.57rem;color:rgba(255,255,255,0.35)">🔥</div></div>'
    +'<div style="text-align:center"><div style="font-size:1.1rem;font-weight:900;color:#e040fb">'+Object.keys(S_missions.completed).length+'</div><div style="font-size:0.57rem;color:rgba(255,255,255,0.35)">Missions</div></div>'
    +'</div>'
    + zonesHTML +'</div>';
  document.body.appendChild(ov);
}

// =================================================================
// BOSS
// =================================================================
function startBossChallenge(zoneId) {
  var zone = ZONES[zoneId]; if (!zone) return;
  var nl = S.nativeLang||'fr';
  document.querySelectorAll('[style*="z-index: 9500"],[style*="z-index:9500"]').forEach(function(el){ el.remove(); });
  var bossData = G.zoneBosses[zoneId]||{defeated:false,attempts:0,hp:zone.boss.hp};
  if (!G.zoneBosses[zoneId]) G.zoneBosses[zoneId] = bossData;
  bossData.hp = bossData.hp||zone.boss.hp;
  G.activeBoss = {zoneId:zoneId, hp:bossData.hp, maxHp:zone.boss.hp, exchangeCount:0};
  var hpPct = Math.round((bossData.hp/zone.boss.hp)*100);
  var ov = document.createElement('div');
  ov.id = 'bossOverlay';
  ov.style.cssText = 'position:fixed;inset:0;background:linear-gradient(180deg,#0a0014,#14000a);z-index:9800;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:20px;overflow-y:auto;';
  ov.innerHTML = '<div style="max-width:375px;width:100%;margin:auto">'
    +'<div style="text-align:center;margin-bottom:16px">'
    +'<div style="font-size:0.63rem;color:rgba(255,0,80,0.7);letter-spacing:3px;margin-bottom:3px">⚔️ COMBAT LINGUISTIQUE</div>'
    +'<div style="font-size:2.8rem;margin-bottom:3px">'+zone.boss.icon+'</div>'
    +'<div style="font-family:Cinzel,serif;color:#e05555;font-size:1.05rem">'+(zone.boss[nl]||zone.boss.fr)+'</div>'
    +'<div style="font-size:0.67rem;color:rgba(255,255,255,0.35);margin-top:3px">Tentative '+(bossData.attempts+1)+'</div>'
    +'</div>'
    +'<div style="margin-bottom:14px">'
    +'<div style="display:flex;justify-content:space-between;font-size:0.63rem;color:rgba(255,0,80,0.65);margin-bottom:3px"><span>HP Boss</span><span>'+bossData.hp+'/'+zone.boss.hp+'</span></div>'
    +'<div style="height:9px;background:rgba(255,0,80,0.12);border-radius:5px;overflow:hidden;border:1px solid rgba(255,0,80,0.25)"><div id="bossHpBar" style="height:100%;width:'+hpPct+'%;background:linear-gradient(90deg,#e05555,#ff0050);border-radius:5px;transition:width .5s"></div></div>'
    +'</div>'
    +'<div style="background:rgba(255,0,80,0.05);border:1px solid rgba(255,0,80,0.18);border-radius:11px;padding:11px;margin-bottom:12px">'
    +'<div style="font-size:0.62rem;color:rgba(255,0,80,0.65);margin-bottom:5px;letter-spacing:1px">📜 TON DÉFI</div>'
    +'<div style="font-size:0.8rem;color:#f0e8d0;line-height:1.5">'+zone.boss.challenge+'</div>'
    +'</div>'
    +'<div style="background:rgba(255,215,0,0.04);border:1px solid rgba(255,215,0,0.12);border-radius:11px;padding:9px;margin-bottom:14px;text-align:center">'
    +'<span style="font-size:0.68rem;color:#FFD700">🏆 +'+zone.boss.reward.xp+' XP · 💎 '+zone.boss.reward.gems+' · 📦 Coffre '+zone.boss.reward.chest+'</span>'
    +'</div>'
    +'<div style="display:flex;gap:8px">'
    +'<button onclick="goVillage();var b=document.getElementById(\'bossOverlay\');if(b)b.remove();" style="flex:1;background:linear-gradient(135deg,#7a0030,#e05555);border:none;border-radius:13px;padding:11px;font-family:Cinzel,serif;font-weight:700;cursor:pointer;font-size:0.8rem;color:#fff">⚔️ Entrer au Village</button>'
    +'<button onclick="document.getElementById(\'bossOverlay\').remove()" style="background:transparent;border:1px solid rgba(255,255,255,0.12);border-radius:13px;padding:11px 14px;color:rgba(255,255,255,0.35);cursor:pointer;font-size:0.75rem">Fuir</button>'
    +'</div></div>';
  document.body.appendChild(ov);
}

function damageBoss(dmg) {
  if (!G.activeBoss) return;
  var bossData = G.zoneBosses[G.activeBoss.zoneId]; if (!bossData) return;
  bossData.hp = Math.max(0,(bossData.hp||0)-dmg);
  G.activeBoss.hp = bossData.hp;
  var hpBar = document.getElementById('bossHpBar');
  if (hpBar) hpBar.style.width = Math.round((bossData.hp/ZONES[G.activeBoss.zoneId].boss.hp)*100)+'%';
  if (bossData.hp <= 0) defeatBoss(G.activeBoss.zoneId);
  else showNotif('⚔️ Coup porté! HP Boss: '+bossData.hp+'/'+ZONES[G.activeBoss.zoneId].boss.hp);
}

function defeatBoss(zoneId) {
  var zone = ZONES[zoneId]; if (!zone) return;
  var bossData = G.zoneBosses[zoneId]; if (bossData) bossData.defeated = true;
  G.activeBoss = null;
  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9900;display:flex;align-items:center;justify-content:center;';
  ov.innerHTML = '<div style="text-align:center;padding:28px;max-width:295px">'
    +'<div style="font-size:2.8rem;margin-bottom:7px">🏆</div>'
    +'<div style="font-family:Cinzel,serif;color:#FFD700;font-size:1.1rem;margin-bottom:4px">BOSS VAINCU!</div>'
    +'<div style="color:#f0e8d0;font-size:0.85rem;margin-bottom:11px">'+zone.boss.icon+' '+zone.boss.fr+'</div>'
    +'<div style="display:flex;justify-content:center;gap:10px;margin-bottom:14px">'
    +'<span style="background:rgba(255,215,0,0.12);border:1px solid #FFD700;border-radius:9px;padding:5px 11px;color:#FFD700;font-weight:900">+'+zone.boss.reward.xp+' XP</span>'
    +'<span style="background:rgba(74,158,255,0.12);border:1px solid #4a9eff;border-radius:9px;padding:5px 11px;color:#4a9eff;font-weight:900">💎 '+zone.boss.reward.gems+'</span>'
    +'</div>'
    +'<button onclick="this.parentElement.parentElement.remove();grantChest(\''+zone.boss.reward.chest+'\')" style="background:linear-gradient(135deg,#a86800,#ffd700);border:none;border-radius:13px;padding:11px 26px;font-family:Cinzel,serif;font-weight:700;cursor:pointer;font-size:0.85rem">🎁 Ouvrir le coffre!</button>'
    +'</div>';
  document.body.appendChild(ov);
  gainXP(zone.boss.reward.xp);
  S_missions.gems = (S_missions.gems||0)+zone.boss.reward.gems;
  var gd=document.getElementById('gemDisplay'); if(gd) gd.textContent='💎 '+S_missions.gems;
  launchConfetti(); saveGame();
}

// =================================================================
// COFFRES
// =================================================================
var CHEST_TYPES = {
  common:    {id:'common',    icon:'📦', fr:'Coffre Commun',    color:'#888888', rewards:[{type:'xp',value:20,w:50},{type:'xp',value:30,w:30},{type:'gems',value:1,w:15},{type:'boost',value:30,w:5}]},
  rare:      {id:'rare',      icon:'💠', fr:'Coffre Rare',      color:'#4a9eff', rewards:[{type:'xp',value:60,w:40},{type:'gems',value:2,w:35},{type:'gems',value:3,w:15},{type:'boost',value:60,w:10}]},
  epic:      {id:'epic',      icon:'💜', fr:'Coffre Épique',    color:'#e040fb', rewards:[{type:'xp',value:100,w:30},{type:'gems',value:4,w:35},{type:'gems',value:6,w:20},{type:'boost',value:120,w:15}]},
  legendary: {id:'legendary', icon:'🌟', fr:'Coffre Légendaire',color:'#FFD700', rewards:[{type:'xp',value:200,w:20},{type:'gems',value:8,w:30},{type:'gems',value:12,w:30},{type:'boost',value:180,w:20}]},
};

function grantChest(type) { showChestOpenAnimation(CHEST_TYPES[type]||CHEST_TYPES.common); }

function rollChestReward(chest) {
  var total=chest.rewards.reduce(function(s,r){return s+r.w;},0), roll=Math.random()*total, acc=0;
  for(var i=0;i<chest.rewards.length;i++){acc+=chest.rewards[i].w;if(roll<=acc)return chest.rewards[i];}
  return chest.rewards[0];
}

function showChestOpenAnimation(chest) {
  var ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.94);z-index:9950;display:flex;align-items:center;justify-content:center;';
  ov.innerHTML='<div style="text-align:center;padding:28px">'
    +'<div style="font-size:5rem;margin-bottom:11px;cursor:pointer;transition:transform .3s" id="chestIcon" onclick="openChestReveal()">'+chest.icon+'</div>'
    +'<div style="font-family:Cinzel,serif;color:'+chest.color+';font-size:1.05rem;margin-bottom:7px">'+chest.fr+'</div>'
    +'<div style="color:rgba(255,255,255,0.45);font-size:0.75rem;margin-bottom:18px">Appuie pour ouvrir!</div>'
    +'<div style="width:70px;height:3px;background:'+chest.color+';margin:0 auto;border-radius:2px"></div>'
    +'</div>';
  document.body.appendChild(ov);
  window._currentChest=chest; window._currentChestOv=ov;
}

window.openChestReveal = function() {
  var chest=window._currentChest, ov=window._currentChestOv; if(!chest||!ov)return;
  var reward=rollChestReward(chest);
  var icon=document.getElementById('chestIcon');
  if(icon){icon.style.transform='scale(1.3) rotate(10deg)';icon.textContent='✨';}
  setTimeout(function(){
    var label='',color='';
    if(reward.type==='xp'){gainXP(reward.value);label='+'+reward.value+' XP ⭐';color='#FFD700';}
    else if(reward.type==='gems'){S_missions.gems=(S_missions.gems||0)+reward.value;label='💎 +'+reward.value+' gemmes';color='#4a9eff';var gd=document.getElementById('gemDisplay');if(gd)gd.textContent='💎 '+S_missions.gems;}
    else if(reward.type==='boost'){S.xpBoostEnd=Date.now()+(reward.value*60000);label='⚡ Double XP '+reward.value+'min';color='#e040fb';}
    G.chestsOpened=(G.chestsOpened||0)+1; saveGame(); launchConfetti();
    ov.innerHTML='<div style="text-align:center;padding:28px">'
      +'<div style="font-size:3.8rem;margin-bottom:9px">✨</div>'
      +'<div style="font-family:Cinzel,serif;color:'+chest.color+';font-size:0.95rem;margin-bottom:5px">'+chest.fr+'</div>'
      +'<div style="font-size:1.7rem;font-weight:900;color:'+color+';margin:13px 0">'+label+'</div>'
      +'<div style="color:rgba(255,255,255,0.35);font-size:0.7rem;margin-bottom:18px">Coffres ouverts: '+G.chestsOpened+'</div>'
      +'<button onclick="this.parentElement.parentElement.remove()" style="background:linear-gradient(135deg,#a86800,#ffd700);border:none;border-radius:13px;padding:11px 26px;font-family:Cinzel,serif;font-weight:700;cursor:pointer;font-size:0.85rem">Excellent! 🎉</button>'
      +'</div>';
  },600);
};

function checkDailyChest() {
  var today=new Date().toISOString().split('T')[0]; return G.lastChestDate!==today;
}

function claimDailyChest() {
  var today=new Date().toISOString().split('T')[0];
  if(G.lastChestDate===today){showNotif('📦 Coffre quotidien déjà réclamé! Reviens demain.');return;}
  G.lastChestDate=today;
  var type=G.streak>=30?'legendary':G.streak>=14?'epic':G.streak>=7?'rare':'common';
  saveGame(); grantChest(type);
}

// =================================================================
// DÉFIS QUOTIDIENS
// =================================================================
var DAILY_CHALLENGES = [
  {id:'dc1',icon:'💬',type:'dialogue',fr:'5 messages envoyés',   en:'Send 5 messages',        target:5,  reward:{xp:40,gems:1}},
  {id:'dc2',icon:'📖',type:'vocab',   fr:'Voir 10 mots',          en:'See 10 words',            target:10, reward:{xp:30,gems:1}},
  {id:'dc3',icon:'🎯',type:'mission', fr:'Compléter 1 mission',   en:'Complete 1 mission',      target:1,  reward:{xp:50,gems:2}},
  {id:'dc4',icon:'🎬',type:'cinema',  fr:'1 vidéo regardée',      en:'Watch 1 video',           target:1,  reward:{xp:35,gems:1}},
  {id:'dc5',icon:'⭐',type:'xp',      fr:'Gagner 100 XP',         en:'Earn 100 XP',             target:100,reward:{xp:50,gems:2}},
  {id:'dc6',icon:'🔥',type:'streak',  fr:'Maintenir le streak',   en:'Keep streak alive',       target:1,  reward:{xp:20,gems:1}},
  {id:'dc7',icon:'💎',type:'boss',    fr:'2 dégâts au boss',      en:'Deal 2 boss damage',      target:2,  reward:{xp:80,gems:3}},
];

function checkDailyChallenge() {
  var today=new Date().toISOString().split('T')[0];
  if(!G.dailyChallenge||G.dailyChallenge.date!==today){
    var pick=DAILY_CHALLENGES[Math.floor((Date.now()/86400000)%DAILY_CHALLENGES.length)];
    G.dailyChallenge={id:pick.id,type:pick.type,done:false,date:today,progress:0,target:pick.target};
    saveGame();
  }
}

function updateDailyProgress(type,amount) {
  if(!G.dailyChallenge||G.dailyChallenge.done) return;
  if(G.dailyChallenge.type!==type) return;
  G.dailyChallenge.progress=(G.dailyChallenge.progress||0)+(amount||1);
  if(G.dailyChallenge.progress>=G.dailyChallenge.target) completeDailyChallenge();
  saveGame();
}

function completeDailyChallenge() {
  if(!G.dailyChallenge||G.dailyChallenge.done) return;
  G.dailyChallenge.done=true;
  G.dailyStreak=(G.dailyStreak||0)+1;
  var dc=DAILY_CHALLENGES.find(function(d){return d.id===G.dailyChallenge.id;}); if(!dc) return;
  gainXP(dc.reward.xp); S_missions.gems=(S_missions.gems||0)+dc.reward.gems;
  var gd=document.getElementById('gemDisplay'); if(gd) gd.textContent='💎 '+S_missions.gems;
  showNotif('🎯 Défi terminé! +'+dc.reward.xp+' XP · 💎 +'+dc.reward.gems);
  grantChest('rare'); saveGame();
}

  // =================================================================
// SECRETS
// =================================================================
var SECRETS = [
  {id:'s1',trigger:50,  type:'xp',      icon:'🌟',fr_desc:'Tu as trouvé un passage secret!',    reward:{gems:2}},
  {id:'s2',trigger:5,   type:'missions', icon:'🗝️',fr_desc:'5 missions — un coffre t\'attendait!', reward:{chest:'epic'}},
  {id:'s3',trigger:200, type:'xp',       icon:'🔮',fr_desc:'Quelque chose de puissant brille...', reward:{gems:3}},
  {id:'s4',trigger:10,  type:'streak',   icon:'🌙',fr_desc:'10 jours — les esprits t\'honorent!', reward:{chest:'rare'}},
  {id:'s5',trigger:3,   type:'boss',     icon:'👻',fr_desc:'3 boss vaincus — force ancienne...', reward:{gems:5}},
];

function checkSecrets() {
  var xp=S.xp||0, missions=Object.keys(S_missions.completed).length;
  var streak=G.streak||0, bosses=Object.values(G.zoneBosses).filter(function(b){return b.defeated;}).length;
  SECRETS.forEach(function(secret){
    if(G.secrets.includes(secret.id)) return;
    var ok=false;
    if(secret.type==='xp'&&xp>=secret.trigger)ok=true;
    if(secret.type==='missions'&&missions>=secret.trigger)ok=true;
    if(secret.type==='streak'&&streak>=secret.trigger)ok=true;
    if(secret.type==='boss'&&bosses>=secret.trigger)ok=true;
    if(ok) revealSecret(secret);
  });
}

function revealSecret(secret) {
  G.secrets.push(secret.id);
  setTimeout(function(){
    var ov=document.createElement('div');
    ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9800;display:flex;align-items:center;justify-content:center;';
    ov.innerHTML='<div style="text-align:center;padding:28px;max-width:275px">'
      +'<div style="font-size:3.2rem;margin-bottom:7px">'+secret.icon+'</div>'
      +'<div style="font-size:0.58rem;letter-spacing:3px;color:rgba(255,215,0,0.5);margin-bottom:5px">SECRET DÉCOUVERT</div>'
      +'<div style="font-family:Cinzel,serif;color:#FFD700;font-size:0.95rem;margin-bottom:7px">'+secret.fr_desc+'</div>'
      +'<div style="font-size:0.72rem;color:rgba(255,255,255,0.45);margin-bottom:15px">'+(secret.reward.gems?'💎 +'+secret.reward.gems+' gemmes':'📦 Coffre '+secret.reward.chest+'!')+'</div>'
      +'<button onclick="this.parentElement.parentElement.remove()" style="background:linear-gradient(135deg,#a86800,#ffd700);border:none;border-radius:13px;padding:9px 22px;font-family:Cinzel,serif;font-weight:700;cursor:pointer">Incroyable! ✨</button>'
      +'</div>';
    document.body.appendChild(ov);
    if(secret.reward.gems){S_missions.gems=(S_missions.gems||0)+secret.reward.gems;var gd=document.getElementById('gemDisplay');if(gd)gd.textContent='💎 '+S_missions.gems;}
    if(secret.reward.chest) grantChest(secret.reward.chest);
    saveGame();
  },2000);
}

// =================================================================
// PROGRESSION
// =================================================================
function showProgression() {
  var nl=S.nativeLang||'fr', xp=S.xp||0, gems=S_missions.gems||0;
  var done=Object.keys(S_missions.completed).length;
  var total=Object.values(MISSIONS).reduce(function(a,m){return a+m.length;},0);
  var pct=total?Math.round((done/total)*100):0;
  var streak=G.streak||0, bosses=Object.values(G.zoneBosses).filter(function(b){return b.defeated;}).length;
  var nextBadge=BADGES.find(function(b){return xp<b.xp;});
  var hasDaily=G.dailyChallenge&&!G.dailyChallenge.done;
  var hasDailyChest=checkDailyChest();
  var badgesHTML=BADGES.map(function(b){
    var ok=S_missions.badges.includes(b.id);
    return '<div style="text-align:center;opacity:'+(ok?1:0.3)+';background:'+(ok?'rgba(255,215,0,0.08)':'rgba(255,255,255,0.02)')+';border:1px solid '+(ok?'#FFD700':'rgba(255,255,255,0.07)')+';border-radius:9px;padding:6px 8px">'
      +'<div style="font-size:1.05rem">'+b.icon+'</div>'
      +'<div style="font-size:0.56rem;color:'+(ok?'#FFD700':'rgba(255,255,255,0.28)')+';">'+(b[nl]||b.fr||b.en)+'</div>'
      +'</div>';
  }).join('');
  var zonesHTML=Object.values(ZONES).map(function(zone){
    var ok=(G.zoneBosses[zone.id]||{}).defeated, ul=isZoneUnlocked(zone.id);
    return '<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.04)">'
      +'<span>'+zone.icon+'</span>'
      +'<span style="font-size:0.75rem;color:'+(ul?'#f0e8d0':'rgba(255,255,255,0.22)')+';flex:1">'+(zone[nl]||zone.fr)+'</span>'
      +'<span style="font-size:0.63rem">'+(ok?'✅ Boss':'')+(ul?'':'🔒')+'</span></div>';
  }).join('');
  function sc(v,l,c){return '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:9px;padding:8px;text-align:center"><div style="font-size:1.05rem;font-weight:900;color:'+c+'">'+v+'</div><div style="font-size:0.57rem;color:rgba(255,255,255,0.32)">'+l+'</div></div>';}
  var ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.94);z-index:9500;overflow-y:auto;display:flex;align-items:flex-start;justify-content:center;padding:20px;';
  ov.innerHTML='<div style="background:linear-gradient(135deg,#0f1a30,#0a0a14);border:1px solid rgba(255,215,0,0.22);border-radius:22px;padding:21px;max-width:385px;width:100%;margin:auto">'
    +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">'
    +'<div style="font-family:Cinzel,serif;font-size:1rem;color:#FFD700">📊 Progression</div>'
    +'<button onclick="this.closest(\'div\').parentElement.remove()" style="background:transparent;border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.38);padding:3px 9px;border-radius:10px;cursor:pointer;font-size:0.68rem">✕</button>'
    +'</div>'
    +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:13px">'
    +sc(xp,'XP','#FFD700')+sc(gems,'💎','#4a9eff')+sc(streak+'j','🔥','#ff9f43')
    +sc(done+'/'+total,'Missions','#4ecf70')+sc(bosses,'Boss','#e05555')+sc(G.stats.msgSent||0,'Messages','#e040fb')
    +'</div>'
    +'<div style="margin-bottom:13px">'
    +'<div style="display:flex;justify-content:space-between;font-size:0.63rem;color:rgba(255,255,255,0.32);margin-bottom:4px"><span>Missions</span><span>'+pct+'%</span></div>'
    +'<div style="height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden"><div style="height:100%;width:'+pct+'%;background:linear-gradient(90deg,#4ecf70,#4a9eff);border-radius:3px"></div></div>'
    +'</div>'
    +(nextBadge?'<div style="background:rgba(255,215,0,0.04);border:1px solid rgba(255,215,0,0.12);border-radius:10px;padding:9px;margin-bottom:13px">'
      +'<div style="font-size:0.63rem;color:#FFD700;margin-bottom:3px">⚡ Prochain: '+nextBadge.icon+' '+(nextBadge[nl]||nextBadge.fr||nextBadge.en)+'</div>'
      +'<div style="height:4px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden"><div style="height:100%;width:'+Math.round((xp/nextBadge.xp)*100)+'%;background:linear-gradient(90deg,#a86800,#ffd700);border-radius:2px"></div></div>'
      +'<div style="font-size:0.58rem;color:rgba(255,255,255,0.28);margin-top:3px">'+(nextBadge.xp-xp)+' XP restants</div>'
      +'</div>':'')
    +'<div style="font-size:0.6rem;color:rgba(255,255,255,0.28);letter-spacing:2px;margin-bottom:7px">BADGES</div>'
    +'<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:13px">'+badgesHTML+'</div>'
    +'<div style="font-size:0.6rem;color:rgba(255,255,255,0.28);letter-spacing:2px;margin-bottom:7px">ZONES</div>'
    +'<div style="margin-bottom:13px">'+zonesHTML+'</div>'
    +(hasDailyChest?'<button onclick="this.parentElement.parentElement.remove();claimDailyChest()" style="width:100%;margin-bottom:7px;background:linear-gradient(135deg,#2a4a00,#4ecf70);border:none;border-radius:12px;padding:10px;font-weight:800;cursor:pointer;font-size:0.8rem;color:#fff">📦 Coffre quotidien gratuit!</button>':'')
    +(hasDaily?'<div style="background:rgba(78,207,112,0.05);border:1px solid rgba(78,207,112,0.18);border-radius:10px;padding:9px;margin-bottom:7px">'
      +'<div style="font-size:0.6rem;color:#4ecf70;margin-bottom:3px">🎯 Défi du jour</div>'
      +'<div style="font-size:0.76rem;color:#f0e8d0">'+(function(){var dc=DAILY_CHALLENGES.find(function(d){return d.id===G.dailyChallenge.id;});return dc?(dc[nl]||dc.fr||dc.en):'';})()+'</div>'
      +'<div style="height:4px;background:rgba(255,255,255,0.06);border-radius:2px;margin-top:5px;overflow:hidden"><div style="height:100%;width:'+Math.min(100,Math.round(((G.dailyChallenge.progress||0)/G.dailyChallenge.target)*100))+'%;background:#4ecf70;border-radius:2px"></div></div>'
      +'</div>':'')
    +'<div style="display:flex;gap:7px">'
    +'<button onclick="this.closest(\'div\').parentElement.remove();openShop()" style="flex:1;background:rgba(255,215,0,0.07);border:1px solid #FFD700;color:#FFD700;padding:9px;border-radius:11px;cursor:pointer;font-weight:800;font-size:0.77rem">🏪 Boutique</button>'
    +'<button onclick="this.closest(\'div\').parentElement.remove();showWorldMap()" style="flex:1;background:rgba(74,158,255,0.07);border:1px solid #4a9eff;color:#4a9eff;padding:9px;border-radius:11px;cursor:pointer;font-weight:800;font-size:0.77rem">🗺️ Carte</button>'
    +'</div></div>';
  document.body.appendChild(ov);
}

// =================================================================
// BOUTIQUE
// =================================================================
function openShop() {
  var nl=S.nativeLang||'fr', gems=S_missions.gems||0;
  var hasDailyChest=checkDailyChest();
  var items=[
    {id:'hint5',   icon:'💡',price:2, fr:'5 indices',        fr_d:'5 indices sans pénalité XP',         effect:function(){S_missions.freeHints=(S_missions.freeHints||0)+5;}},
    {id:'shield',  icon:'🛡️',price:3, fr:'Bouclier streak',  fr_d:'Protège 1 jour manqué',               effect:function(){G.streakFreezes=(G.streakFreezes||0)+1;}},
    {id:'xpboost', icon:'⚡',price:4, fr:'Double XP 1h',     fr_d:'XP ×2 pendant 60 minutes',            effect:function(){S.xpBoostEnd=Date.now()+3600000;}},
    {id:'trans5',  icon:'🔤',price:1, fr:'5 traductions',    fr_d:'5 traductions instantanées',          effect:function(){S_missions.freeHints=(S_missions.freeHints||0)+5;}},
    {id:'chest_c', icon:'📦',price:5, fr:'Coffre Commun',    fr_d:'Ouvrir un coffre commun',              effect:function(){grantChest('common');}},
    {id:'chest_r', icon:'💠',price:10,fr:'Coffre Rare',      fr_d:'Ouvrir un coffre rare',                effect:function(){grantChest('rare');}},
    {id:'chest_e', icon:'💜',price:18,fr:'Coffre Épique',    fr_d:'Ouvrir un coffre épique',              effect:function(){grantChest('epic');}},
    {id:'revive',  icon:'❤️',price:8, fr:'Résurrection Boss', fr_d:'Restaure 3 HP au boss actif',        effect:function(){if(G.activeBoss){var bd=G.zoneBosses[G.activeBoss.zoneId];if(bd){bd.hp=Math.min(ZONES[G.activeBoss.zoneId].boss.hp,(bd.hp||0)+3);G.activeBoss.hp=bd.hp;showNotif('❤️ Boss restauré +3 HP!');}}else{showNotif('Aucun boss en cours.');}}},
  ];
  var ov=document.createElement('div');
  ov.id='shopOverlay';
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9500;overflow-y:auto;display:flex;align-items:flex-start;justify-content:center;padding:20px;';
  var itemsHTML=items.map(function(item){
    var canBuy=gems>=item.price;
    return '<div style="display:flex;align-items:center;gap:10px;padding:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,215,0,0.1);border-radius:11px;margin-bottom:6px">'
      +'<span style="font-size:1.35rem;flex-shrink:0">'+item.icon+'</span>'
      +'<div style="flex:1"><div style="font-weight:800;font-size:0.78rem;color:#f0e8d0">'+(item[nl]||item.fr)+'</div><div style="font-size:0.63rem;color:rgba(255,255,255,0.32)">'+(item[(nl+'_d')]||item.fr_d)+'</div></div>'
      +'<button data-shop-id="'+item.id+'" style="background:'+(canBuy?'rgba(255,215,0,0.13)':'rgba(255,255,255,0.03)')+';border:1px solid '+(canBuy?'#FFD700':'rgba(255,255,255,0.08)')+';border-radius:9px;color:'+(canBuy?'#FFD700':'rgba(255,255,255,0.2)')+';padding:5px 10px;cursor:'+(canBuy?'pointer':'not-allowed')+';font-weight:800;font-size:0.73rem;flex-shrink:0">💎 '+item.price+'</button>'
      +'</div>';
  }).join('');
  ov.innerHTML='<div style="max-width:380px;width:100%;margin:auto">'
    +'<div style="background:linear-gradient(135deg,#0f0a20,#0a0a14);border:1px solid #FFD700;border-radius:22px;padding:20px">'
    +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">'
    +'<span style="font-family:Cinzel,serif;color:#FFD700;font-size:1rem">🏪 Boutique</span>'
    +'<span style="color:#4a9eff;font-weight:900;font-size:0.88rem">💎 '+gems+'</span>'
    +'</div>'
    +'<div style="font-size:0.6rem;color:rgba(255,215,0,0.38);margin-bottom:13px">Les diamants sont rares — dépense-les avec sagesse</div>'
    +(hasDailyChest?'<button onclick="document.getElementById(\'shopOverlay\').remove();claimDailyChest()" style="width:100%;margin-bottom:10px;background:linear-gradient(135deg,#2a4a00,#4ecf70);border:none;border-radius:12px;padding:10px;font-weight:800;cursor:pointer;font-size:0.8rem;color:#fff">📦 Coffre quotidien gratuit!</button>':'')
    +itemsHTML
    +'<button onclick="document.getElementById(\'shopOverlay\').remove()" style="width:100%;margin-top:8px;background:transparent;border:1px solid rgba(255,255,255,0.09);color:rgba(255,255,255,0.3);padding:8px;border-radius:11px;cursor:pointer;font-family:Nunito,sans-serif;font-size:0.77rem">Fermer</button>'
    +'</div></div>';
  document.body.appendChild(ov);
  window._shopItems=items;
  ov.querySelectorAll('[data-shop-id]').forEach(function(btn){
    btn.onclick=function(){
      var item=window._shopItems.find(function(i){return i.id===this.dataset.shopId;},this); if(!item)return;
      if((S_missions.gems||0)<item.price){showNotif('💎 Gemmes insuffisantes!');return;}
      S_missions.gems-=item.price; item.effect();
      var gd=document.getElementById('gemDisplay'); if(gd)gd.textContent='💎 '+S_missions.gems;
      showNotif('✅ '+(item[nl]||item.fr)+' acheté!');
      var o=document.getElementById('shopOverlay'); if(o){o.remove();openShop();}
      saveGame();
    };
  });
}

// =================================================================
// MODE SURPRISE
// =================================================================
function launchSurpriseMode() {
  var lang=S.targetLang||'fr', level=S.level||1;
  var videos=(SURPRISE_VIDEOS[lang]||SURPRISE_VIDEOS['fr']||[]).slice();
  if(!videos.length){showNotif('Aucune vidéo disponible.');return;}
  var filtered=videos.filter(function(v){if(level<=3)return v.diff==='🟢';if(level<=7)return v.diff==='🟢'||v.diff==='🟡';return true;});
  if(!filtered.length)filtered=videos;
  var pick=filtered[Math.floor(Math.random()*filtered.length)];
  var safeT=pick.t.replace(/'/g,'&apos;');
  var ov=document.createElement('div');
  ov.id='surpriseOverlay';
  ov.style.cssText='position:fixed;inset:0;background:#000;z-index:9800;display:flex;flex-direction:column;';
  ov.innerHTML='<button onclick="closeSurpriseMode()" style="position:absolute;top:12px;right:12px;background:rgba(0,0,0,0.6);border:none;color:#fff;width:34px;height:34px;border-radius:50%;font-size:1rem;cursor:pointer;z-index:10;display:flex;align-items:center;justify-content:center;">✕</button>'
    +'<div style="position:absolute;bottom:78px;left:0;right:0;padding:0 14px;z-index:10">'
    +'<div style="font-weight:900;font-size:0.85rem;color:#fff;margin-bottom:3px;text-shadow:0 1px 8px rgba(0,0,0,0.8)">'+pick.t+'</div>'
    +'<div style="font-size:0.68rem;color:rgba(255,255,255,0.55)">'+pick.diff+' · 📚 Internet Archive</div>'
    +'</div>'
    +'<iframe src="https://archive.org/embed/'+pick.id+'?autoplay=1" style="flex:1;width:100%;border:none" allowfullscreen allow="autoplay;fullscreen"></iframe>'
    +'<div style="position:absolute;right:12px;bottom:138px;display:flex;flex-direction:column;gap:10px">'
    +'<button onclick="nextSurpriseVideo()" style="background:rgba(224,64,251,0.82);border:none;color:#fff;width:42px;height:42px;border-radius:50%;font-size:1.1rem;cursor:pointer">⏭</button>'
    +'<button onclick="launchSurpriseQuiz(\''+pick.id+'\',\''+safeT+'\')" style="background:rgba(255,215,0,0.18);border:1px solid #FFD700;color:#FFD700;width:42px;height:42px;border-radius:50%;font-size:0.93rem;cursor:pointer">❓</button>'
    +'</div>';
  document.body.appendChild(ov);
  gainXP(5); updateDailyProgress('cinema',1);
}

// =================================================================
// HOOK sendMsg — DOMMAGES BOSS + MISSIONS + STATS
// =================================================================
function onMessageSent(text) {
  G.stats.msgSent=(G.stats.msgSent||0)+1;
  G.stats.wordsTyped=(G.stats.wordsTyped||0)+text.split(' ').length;
  updateDailyProgress('dialogue',1);
  if(G.activeBoss&&text.trim().length>10){damageBoss(text.trim().length>50?2:1);}
  checkSecrets(); saveGame();
}

// =================================================================
// INITIALISATION
// =================================================================
(function initGame(){
  checkDailyStreak();
  checkSecrets();
  setTimeout(function(){
    var hudBtns=document.querySelector('.hud-btns');
    if(hudBtns&&!document.getElementById('mapBtn')){
      var btn=document.createElement('button');
      btn.id='mapBtn'; btn.className='hud-btn'; btn.textContent='🗺️'; btn.onclick=showWorldMap;
      hudBtns.insertBefore(btn,hudBtns.firstChild);
    }
    if(checkDailyChest()){
      setTimeout(function(){showNotif('📦 Coffre quotidien disponible! 📊 Progression');},2500);
    }
    updateStreakDisplay();
  },600);
})();

function nextSurpriseVideo() {
  var ov = document.getElementById('surpriseOverlay');
  if (ov) { ov.remove(); setTimeout(launchSurpriseMode, 80); }
}

function closeSurpriseMode() {
  var ov = document.getElementById('surpriseOverlay');
  if (ov) ov.remove();
}

async function launchSurpriseQuiz(videoId, videoTitle) {
  var nl = S.nativeLang || 'fr';
  var nln = {fr:'français',en:'anglais',es:'espagnol',ht:'créole haïtien',de:'allemand',ru:'russe',zh:'mandarin',ja:'japonais'};

  var prompt = 'Génère exactement 3 questions QCM en ' + (nln[nl]||'français')
    + ' sur le contenu d\'une vidéo intitulée "' + videoTitle + '" en ' + (nln[S.targetLang]||'anglais') + '.'
    + ' Réponds UNIQUEMENT en JSON valide sans texte avant ni après: [{"q":"question","opts":["A","B","C","D"],"ans":0}]'
    + ' "ans" est l\'index 0-3 de la bonne réponse.';

  showNotif('⏳ Génération du quiz...');
  try {
    var r = await fetch(API + '/api/dialogue', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({npcName:'',npcRole:'',location:'',language:nln[nl]||'français',
        playerName:S.playerName||'Joueur',playerMessage:prompt,history:[]})
    });
    var d = await r.json();
    var raw = (d.reply||'[]').replace(/```json|```/g,'').trim();
    var quiz = JSON.parse(raw);
    if (!Array.isArray(quiz)||!quiz.length) throw new Error('vide');
    showQuizUI(quiz.slice(0,3), videoTitle);
  } catch(e) {
    showNotif('Quiz indisponible pour cette vidéo.');
  }
}

function showQuizUI(questions, videoTitle) {
  var current = 0, score = 0;
  var ov = document.createElement('div');
  ov.id = 'quizOverlay';
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9900;display:flex;align-items:center;justify-content:center;padding:18px;';

  function renderQ() {
    var q = questions[current];
    ov.innerHTML = '<div style="background:linear-gradient(135deg,#0f0a20,#0a0a14);border:1px solid #e040fb;border-radius:18px;padding:22px;max-width:350px;width:100%">'
      + '<div style="display:flex;justify-content:space-between;margin-bottom:10px">'
      + '<span style="font-size:0.65rem;color:rgba(255,255,255,0.4)">🎬 Quiz vidéo</span>'
      + '<span style="font-size:0.65rem;color:#e040fb;font-weight:800">' + (current+1) + ' / ' + questions.length + '</span>'
      + '</div>'
      + '<div style="font-size:0.9rem;font-weight:800;color:#f0e8d0;margin-bottom:16px;line-height:1.4">' + q.q + '</div>'
      + q.opts.map(function(opt,i){
          return '<button onclick="window._quizAns(' + i + ')" style="width:100%;text-align:left;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:9px;padding:9px 13px;color:#f0e8d0;cursor:pointer;margin-bottom:7px;font-family:Nunito,sans-serif;font-size:0.82rem">' + opt + '</button>';
        }).join('')
      + '</div>';
    document.body.appendChild(ov);
  }

  window._quizAns = function(i) {
    var q = questions[current];
    var btns = ov.querySelectorAll('button');
    btns[i].style.background = i===q.ans ? 'rgba(78,207,112,0.2)' : 'rgba(224,64,251,0.15)';
    btns[i].style.borderColor = i===q.ans ? '#4ecf70' : '#e05555';
    btns[q.ans].style.background = 'rgba(78,207,112,0.2)';
    btns[q.ans].style.borderColor = '#4ecf70';
    if (i===q.ans) score++;
    Array.from(btns).forEach(function(b){ b.disabled=true; });
    setTimeout(function(){
      current++;
      ov.remove();
      if (current < questions.length) renderQ();
      else showQuizResult(score, questions.length);
    }, 850);
  };
  renderQ();
}

function showQuizResult(score, total) {
  var xp = score * 20;
  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9900;display:flex;align-items:center;justify-content:center;';
  ov.innerHTML = '<div style="background:linear-gradient(135deg,#0f0a20,#0a0a14);border:2px solid #FFD700;border-radius:20px;padding:26px 30px;text-align:center;max-width:270px">'
    + '<div style="font-size:2.4rem;margin-bottom:7px">' + (score===total?'🏆':score>=total/2?'⭐':'📚') + '</div>'
    + '<div style="font-family:Cinzel,serif;color:#FFD700;font-size:0.95rem;margin-bottom:5px">Quiz terminé!</div>'
    + '<div style="font-size:1.2rem;font-weight:900;color:#f0e8d0;margin-bottom:3px">' + score + ' / ' + total + '</div>'
    + '<div style="font-size:0.78rem;color:#4ecf70;margin-bottom:14px;font-weight:800">+' + xp + ' XP</div>'
    + '<button onclick="this.closest(\'div\').parentElement.remove()" style="background:linear-gradient(135deg,#a86800,#ffd700);border:none;border-radius:11px;padding:9px 26px;font-family:Cinzel,serif;font-weight:700;cursor:pointer;font-size:0.82rem">Continuer</button>'
    + '</div>';
  document.body.appendChild(ov);
  gainXP(xp);
  if (score===total) launchConfetti();
  setTimeout(function(){ if(ov.parentElement) ov.remove(); }, 5000);
}
function launchConfetti() { 
  showNotif('🎉 Félicitations !');
  for (let i = 0; i < 50; i++) {
    const conf = document.createElement('div');
    conf.textContent = ['🎉', '✨', '⭐', '🏆'][Math.floor(Math.random() * 4)];
    conf.style.cssText = `position:fixed;left:${Math.random() * 100}%;top:-20px;font-size:${15 + Math.random() * 20}px;animation:confettiFall ${2 + Math.random() * 2}s linear forwards;z-index:10000;pointer-events:none;`;
    document.body.appendChild(conf);
    setTimeout(() => conf.remove(), 3000);
  }
}
// openMissionsPanel défini dans le nouveau bloc ci-dessous

// INITIALISATION
const searchInputElem = document.getElementById('vocabSearch');
if (searchInputElem) {
  searchInputElem.oninput = () => {
    const active = document.querySelector('.vcat.active');
    if (active) {
      const idx = Array.from(document.querySelectorAll('.vcat')).indexOf(active);
      loadVocab(Object.keys(VOCAB)[idx]);
    }
  };
}

const dictInputElem = document.getElementById('dictInput');
if (dictInputElem) {
  dictInputElem.addEventListener('keydown', e => { if (e.key === 'Enter') searchDict(); });
}

const dialInputElem = document.getElementById('dialInput');
if (dialInputElem) {
  dialInputElem.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });
}

document.addEventListener('click', e => {
  const pop = document.getElementById('wordPopup');
  if (pop && pop.classList.contains('show') && !pop.contains(e.target) && !e.target.classList.contains('clickable-word')) {
    closeWordPopup();
  }
});

// Ajouter la style pour l'animation confetti
const styleElem = document.createElement('style');
styleElem.textContent = `@keyframes confettiFall{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}`;
document.head.appendChild(styleElem);

// =================================================================
// SAUVEGARDE UNIFIÉE
// =================================================================
function saveGame() {
  try {
    var sv = localStorage.getItem('linguavillage_save');
    var d  = sv ? JSON.parse(sv) : {};
    d.S       = window.S;
    d.missions= window.S_missions;
    if (window.S_game) d.game = window.S_game;
    localStorage.setItem('linguavillage_save', JSON.stringify(d));
  } catch(e) {}
}

function saveMissions() { saveGame(); }

// =================================================================
// MISSIONS — PANEL
// =================================================================
// =================================================================
// DONNÉES MISSIONS PAR LIEU
// =================================================================
var _MISSIONS_DATA = {
  market:[
    {id:'m_market_1',icon:'☕',xp:30,gem:1,
     title:{fr:'Commande un café',en:'Order a coffee',es:'Pide un café',ht:'Kòmande yon kafe',de:'Kaffee bestellen',ru:'Закажи кофе',zh:'点咖啡',ja:'コーヒー注文'},
     desc:{fr:'Dis "Je voudrais un café"',en:'Say "I\'d like a coffee"',es:'Di "Quisiera un café"',ht:'Di "Mwen ta renmen yon kafe"',de:'Sag "Ich möchte einen Kaffee"',ru:'Скажи «Кофе, пожалуйста»',zh:'说"我要一杯咖啡"',ja:'「コーヒーをください」と言う'},
     hint:{fr:'"Je voudrais..."',en:'"I\'d like..."',es:'"Quisiera..."',ht:'"Mwen ta renmen..."',de:'"Ich möchte..."',ru:'"Мне, пожалуйста..."',zh:'"我要..."',ja:'「...をください」'},
     check:['café','coffee','kafe','kaffee','кофе','咖啡','コーヒー','voudrais','like','quisiera','renmen','möchte']},
    {id:'m_market_2',icon:'💰',xp:40,gem:1,
     title:{fr:'Demande le prix',en:'Ask the price',es:'Pregunta el precio',ht:'Mande pri a',de:'Preis fragen',ru:'Спроси цену',zh:'问价格',ja:'値段を聞く'},
     desc:{fr:'Demande combien coûte quelque chose',en:'Ask how much something costs',es:'Pregunta cuánto cuesta algo',ht:'Mande konbyen yon bagay koute',de:'Frage wie viel etwas kostet',ru:'Спроси сколько стоит',zh:'询问某物的价格',ja:'何かの値段を聞く'},
     hint:{fr:'"Combien coûte...?"',en:'"How much is...?"',es:'"¿Cuánto cuesta...?"',ht:'"Konbyen...koute?"',de:'"Wie viel kostet...?"',ru:'"Сколько стоит...?"',zh:'"...多少钱?"',ja:'「...はいくらですか?」'},
     check:['combien','how much','cuánto','konbyen','wie viel','сколько','多少','いくら']},
  ],
  school:[
    {id:'m_school_1',icon:'📚',xp:35,gem:1,
     title:{fr:'Pose une question',en:'Ask a question',es:'Haz una pregunta',ht:'Poze yon kesyon',de:'Frage stellen',ru:'Задай вопрос',zh:'提问',ja:'質問する'},
     desc:{fr:'Demande au prof d\'expliquer quelque chose',en:'Ask the teacher to explain',es:'Pide al profesor que explique',ht:'Mande pwofesè eksplike',de:'Bitte den Lehrer zu erklären',ru:'Попроси учителя объяснить',zh:'请老师解释',ja:'先生に説明してもらう'},
     hint:{fr:'"Pouvez-vous expliquer...?"',en:'"Can you explain...?"',es:'"¿Puede explicar...?"',ht:'"Ou ka eksplike...?"',de:'"Können Sie erklären?"',ru:'"Объясните, пожалуйста"',zh:'"能解释一下...吗?"',ja:'「...を説明してください」'},
     check:['expliquer','explain','explicar','eksplike','erklären','объясните','解释','説明']},
    {id:'m_school_2',icon:'✏️',xp:30,gem:1,
     title:{fr:'Épelle un mot',en:'Spell a word',es:'Deletrea una palabra',ht:'Epele yon mo',de:'Buchstabiere ein Wort',ru:'Произнеси по буквам',zh:'拼写单词',ja:'単語を綴る'},
     desc:{fr:'Épelle un mot lettre par lettre',en:'Spell a word letter by letter',es:'Deletrea una palabra letra por letra',ht:'Epele yon mo lèt pa lèt',de:'Buchstabiere ein Wort Buchstabe für Buchstabe',ru:'Произнеси слово по буквам',zh:'逐字母拼写一个单词',ja:'単語を一文字ずつ綴る'},
     hint:{fr:'"Comment ça s\'écrit?"',en:'"How do you spell it?"',es:'"¿Cómo se escribe?"',ht:'"Kijan ou ekri sa?"',de:'"Wie schreibt man das?"',ru:'"Как это пишется?"',zh:'"怎么拼写?"',ja:'「どう綴りますか?」'},
     check:['écrit','spell','escribe','ekri','schreibt','пишется','拼写','綴り']},
  ],
  hospital:[
    {id:'m_hospital_1',icon:'🩺',xp:40,gem:1,
     title:{fr:'Décris tes symptômes',en:'Describe your symptoms',es:'Describe tus síntomas',ht:'Dekri sentòm ou',de:'Symptome beschreiben',ru:'Опиши симптомы',zh:'描述症状',ja:'症状を説明'},
     desc:{fr:'Dis au médecin où tu as mal',en:'Tell the doctor where it hurts',es:'Dile al médico dónde te duele',ht:'Di doktè kote w fè mal',de:'Sag dem Arzt wo es wehtut',ru:'Скажи врачу что болит',zh:'告诉医生哪里痛',ja:'医者に痛い場所を伝える'},
     hint:{fr:'"J\'ai mal à..."',en:'"My...hurts"',es:'"Me duele..."',ht:'"...mwen fè mal"',de:'"Mein...tut weh"',ru:'"У меня болит..."',zh:'"我...痛"',ja:'「...が痛いです」'},
     check:['mal','hurts','duele','fè mal','weh','болит','痛','痛い']},
  ],
  station:[
    {id:'m_station_1',icon:'🎫',xp:45,gem:2,
     title:{fr:'Achète un billet',en:'Buy a ticket',es:'Compra un billete',ht:'Achte yon tikè',de:'Ticket kaufen',ru:'Купи билет',zh:'买票',ja:'切符を買う'},
     desc:{fr:'Demande un billet pour une destination',en:'Ask for a ticket to a destination',es:'Pide un billete a una ciudad',ht:'Mande yon tikè pou yon destinasyon',de:'Bitte um eine Fahrkarte',ru:'Попроси билет до',zh:'要一张去某地的票',ja:'目的地への切符を頼む'},
     hint:{fr:'"Un billet pour... s\'il vous plaît"',en:'"One ticket to... please"',es:'"Un billete para... por favor"',ht:'"Yon tikè pou... tanpri"',de:'"Eine Fahrkarte nach... bitte"',ru:'"Один билет до... пожалуйста"',zh:'"一张去...的票"',ja:'「...まで一枚ください」'},
     check:['billet','ticket','billete','tikè','fahrkarte','билет','票','切符']},
  ],
  tavern:[
    {id:'m_tavern_1',icon:'🍺',xp:25,gem:1,
     title:{fr:'Commande une boisson',en:'Order a drink',es:'Pide una bebida',ht:'Kòmande yon bwason',de:'Getränk bestellen',ru:'Закажи напиток',zh:'点饮料',ja:'飲み物を注文'},
     desc:{fr:'Commande ta boisson préférée',en:'Order your favourite drink',es:'Pide tu bebida favorita',ht:'Kòmande bwason ou pi renmen',de:'Bestell dein Lieblingsgetränk',ru:'Закажи любимый напиток',zh:'点你最喜欢的饮料',ja:'好きな飲み物を注文する'},
     hint:{fr:'"Je prends..."',en:'"I\'ll have..."',es:'"Tomaré..."',ht:'"Mwen pran..."',de:'"Ich nehme..."',ru:'"Мне..."',zh:'"我要..."',ja:'「...をください」'},
     check:['prends','have','tomaré','pran','nehme','мне','我要','ください']},
  ],
  friends:[
    {id:'m_friends_1',icon:'👋',xp:20,gem:1,
     title:{fr:'Présente-toi',en:'Introduce yourself',es:'Preséntate',ht:'Prezante tèt ou',de:'Stell dich vor',ru:'Представься',zh:'自我介绍',ja:'自己紹介'},
     desc:{fr:'Dis ton prénom et d\'où tu viens',en:'Say your name and where you\'re from',es:'Di tu nombre y de dónde eres',ht:'Di non ou ak kote ou soti',de:'Sag deinen Namen und wo du herkommst',ru:'Скажи своё имя и откуда ты',zh:'说你的名字和来自哪里',ja:'名前と出身地を言う'},
     hint:{fr:'"Je m\'appelle... je viens de..."',en:'"My name is... I\'m from..."',es:'"Me llamo... soy de..."',ht:'"Mwen rele... mwen soti..."',de:'"Ich heiße... ich komme aus..."',ru:'"Меня зовут... я из..."',zh:'"我叫... 我来自..."',ja:'「私の名前は... 出身は...」'},
     check:['appelle','name is','llamo','rele','heiße','зовут','我叫','名前は']},
  ],
  bank:[
    {id:'m_bank_1',icon:'💳',xp:50,gem:2,
     title:{fr:'Ouvre un compte',en:'Open an account',es:'Abre una cuenta',ht:'Ouvri yon kont',de:'Konto eröffnen',ru:'Открой счёт',zh:'开户',ja:'口座を開く'},
     desc:{fr:'Demande à ouvrir un compte bancaire',en:'Ask to open a bank account',es:'Pide abrir una cuenta bancaria',ht:'Mande ouvri yon kont labank',de:'Bitte um Kontoeröffnung',ru:'Попроси открыть счёт',zh:'申请开银行账户',ja:'銀行口座の開設を申し込む'},
     hint:{fr:'"Je voudrais ouvrir un compte"',en:'"I\'d like to open an account"',es:'"Quisiera abrir una cuenta"',ht:'"Mwen ta renmen ouvri yon kont"',de:'"Ich möchte ein Konto eröffnen"',ru:'"Хочу открыть счёт"',zh:'"我想开一个账户"',ja:'「口座を開きたいのですが」'},
     check:['ouvrir','open','abrir','ouvri','eröffnen','открыть','开','開設']},
  ],
  park:[
    {id:'m_park_1',icon:'💝',xp:30,gem:1,
     title:{fr:'Fais un compliment',en:'Give a compliment',es:'Haz un cumplido',ht:'Fè yon konpliman',de:'Kompliment machen',ru:'Сделай комплимент',zh:'称赞别人',ja:'褒め言葉を言う'},
     desc:{fr:'Dis quelque chose de gentil',en:'Say something kind',es:'Di algo amable',ht:'Di yon bèl bagay',de:'Sag etwas Nettes',ru:'Скажи что-то доброе',zh:'说些好听的话',ja:'親切な言葉を言う'},
     hint:{fr:'"Tu es très..."',en:'"You are very..."',es:'"Eres muy..."',ht:'"Ou trè..."',de:'"Du bist sehr..."',ru:'"Ты очень..."',zh:'"你很..."',ja:'「あなたはとても...」'},
     check:['magnifique','beautiful','hermoso','bèl','wunderschön','красивый','漂亮','美しい','gentil','kind']},
  ],
  police:[
    {id:'m_police_1',icon:'🗺️',xp:30,gem:1,
     title:{fr:'Demande ton chemin',en:'Ask for directions',es:'Pide indicaciones',ht:'Mande chemen',de:'Nach dem Weg fragen',ru:'Спроси дорогу',zh:'问路',ja:'道を聞く'},
     desc:{fr:'Demande comment aller quelque part',en:'Ask how to get somewhere',es:'Pregunta cómo llegar a un lugar',ht:'Mande kijan pou rive yon kote',de:'Frage wie man irgendwohin kommt',ru:'Спроси как добраться',zh:'问如何到达某地',ja:'どこかへの行き方を聞く'},
     hint:{fr:'"Comment aller à...?"',en:'"How do I get to...?"',es:'"¿Cómo llego a...?"',ht:'"Kijan pou rive...?"',de:'"Wie komme ich zu...?"',ru:'"Как добраться до...?"',zh:'"怎么去...?"',ja:'「...へはどう行けばいいですか」'},
     check:['comment','how','cómo','kijan','wie','как','怎么','どう']},
  ],
  church:[
    {id:'m_church_1',icon:'🙏',xp:25,gem:1,
     title:{fr:'Salue poliment',en:'Greet politely',es:'Saluda con educación',ht:'Salye avèk respè',de:'Höflich grüßen',ru:'Вежливо поздоровайся',zh:'礼貌问候',ja:'丁寧に挨拶する'},
     desc:{fr:'Utilise une formule de politesse formelle',en:'Use a formal greeting',es:'Usa una fórmula de cortesía formal',ht:'Itilize yon fòmil poli fòmèl',de:'Benutze eine formelle Begrüßung',ru:'Используй официальное приветствие',zh:'使用正式问候语',ja:'正式な挨拶の表現を使う'},
     hint:{fr:'"Bonjour Monsieur/Madame..."',en:'"Good day Sir/Madam..."',es:'"Buenos días Señor/Señora..."',ht:'"Bonjou Msye/Madanm..."',de:'"Guten Tag Herr/Frau..."',ru:'"Добрый день господин/госпожа..."',zh:'"您好，先生/女士..."',ja:'「こんにちは、先生/〇〇様...」'},
     check:['bonjour','good day','buenos días','bonjou','guten tag','добрый день','您好','こんにちは']},
  ],
  factory:[
    {id:'m_factory_1',icon:'🔧',xp:35,gem:1,
     title:{fr:'Décris ton métier',en:'Describe your job',es:'Describe tu trabajo',ht:'Dekri travay ou',de:'Beschreibe deinen Beruf',ru:'Опиши свою работу',zh:'描述你的工作',ja:'仕事を説明する'},
     desc:{fr:'Explique ce que tu fais comme travail',en:'Explain what you do for work',es:'Explica qué haces como trabajo',ht:'Eksplike kisa ou fè kòm travay',de:'Erkläre was du beruflich machst',ru:'Объясни чем ты занимаешься',zh:'解释你从事什么工作',ja:'仕事について説明する'},
     hint:{fr:'"Je travaille comme..."',en:'"I work as..."',es:'"Trabajo como..."',ht:'"Mwen travay kòm..."',de:'"Ich arbeite als..."',ru:'"Я работаю..."',zh:'"我是一名..."',ja:'「私は...として働いています」'},
     check:['travaille','work','trabajo','travay','arbeite','работаю','工作','働いています']},
  ],
};

function getMissionsForLoc(locId) {
  return _MISSIONS_DATA[locId] || [];
}

var MISSIONS = window.MISSIONS || (function(){
  var m = {};
  if (typeof getMissionsForLoc === 'function') {
    ['market','school','hospital','station','tavern','friends','bank','park','police','church','factory','cinema'].forEach(function(id){
      var ms = getMissionsForLoc(id);
      if (ms && ms.length) m[id] = ms;
    });
  }
  return m;
})();

function openMissionsPanel(locId) {
  var missions = (typeof getMissionsForLoc==='function') ? getMissionsForLoc(locId) : [];
  var panel = document.getElementById('missionsPanel');
  if (!panel) return;
  if (!missions.length) { panel.style.display='none'; return; }
  var nl = S.nativeLang||'fr';
  var gems = window.S_missions ? window.S_missions.gems||0 : 0;
  var doneCount = window.S_missions ? Object.keys(window.S_missions.completed||{}).length : 0;
  var html = '<div style="padding:9px 13px 6px;background:rgba(255,215,0,0.05);border-bottom:1px solid rgba(255,215,0,0.12);">'
    +'<div style="font-family:Cinzel,serif;font-size:0.83rem;color:#FFD700;margin-bottom:2px">🎯 Missions</div>'
    +'<div style="font-size:0.62rem;color:rgba(255,255,255,0.38)">💎 '+gems+' gemmes · '+doneCount+' complétées</div>'
    +'</div><div style="overflow-y:auto;max-height:195px;padding:8px;">';
  missions.forEach(function(m){
    var done  = window.S_missions && !!window.S_missions.completed[m.id];
    var title = (m.title[nl]||m.title.fr||'').replace(/'/g,'&apos;');
    var desc  = (m.desc[nl] ||m.desc.fr ||'').replace(/'/g,'&apos;');
    var hint  = (m.hint[nl] ||m.hint.fr ||'').replace(/'/g,'&apos;');
    var badge = done ? '✅' : ('+'+m.xp+' XP · '+'💎'.repeat(m.gem));
    html += '<div style="background:'+(done?'rgba(78,207,112,0.07)':'rgba(255,255,255,0.03)')+';border:1px solid '+(done?'rgba(78,207,112,0.25)':'rgba(255,255,255,0.09)')+';border-radius:10px;padding:9px 10px;margin-bottom:5px;cursor:'+(done?'default':'pointer')+'"'
      +(done?'':' onclick="startMission('+JSON.stringify(m.id)+','+JSON.stringify(locId)+')"')+'>'  
      +'<div style="display:flex;align-items:center;gap:7px;margin-bottom:3px">'
      +'<span style="font-size:1.05rem">'+m.icon+'</span>'
      +'<span style="font-weight:800;font-size:0.8rem;color:'+(done?'#4ecf70':'#f0e8d0')+'">'+title+'</span>'
      +'<span style="margin-left:auto;font-size:0.62rem;color:'+(done?'#4ecf70':'#FFD700')+'">'+badge+'</span>'
      +'</div>'
      +'<div style="font-size:0.68rem;color:rgba(255,255,255,0.42)">'+desc+'</div>'
      +(done?'':'<div style="font-size:0.63rem;color:rgba(255,215,0,0.45);margin-top:4px;font-style:italic">💡 '+hint+'</div>')
      +'</div>';
  });
  html += '</div>';
  panel.innerHTML = html;
  panel.style.display = 'block';
}

function completeMission(m) {
  if (!window.S_missions) return;
  if (window.S_missions.completed[m.id]) return;
  window.S_missions.completed[m.id] = true;
  window.S_missions.gems = (window.S_missions.gems||0)+m.gem;
  gainXP(m.xp);
  var gd=document.getElementById('gemDisplay'); if(gd)gd.textContent='💎 '+window.S_missions.gems;
  if(typeof checkBadges==='function') checkBadges();
  if(typeof showMissionReward==='function') showMissionReward(m);
  if(typeof updateDailyProgress==='function') updateDailyProgress('mission',1);
  saveGame();
}

// checkMissionInMessage et startMission
var _activeMission = null;

function startMission(missionId, locId) {
  var missions = (typeof getMissionsForLoc==='function') ? getMissionsForLoc(locId) : [];
  _activeMission = missions.find(function(m){ return m.id===missionId; });
  if (!_activeMission) return;
  var nl = S.nativeLang||'fr';
  var inp = document.getElementById('dialInput');
  if (inp) { inp.placeholder='💡 '+(_activeMission.hint[nl]||_activeMission.hint.fr||''); inp.style.borderColor='#FFD700'; }
  showNotif('🎯 '+(_activeMission.title[nl]||_activeMission.title.fr||''));
}

function checkMissionInMessage(text) {
  if (!_activeMission) return;
  var lower = text.toLowerCase();
  var hit = _activeMission.check.some(function(kw){ return lower.includes(kw.toLowerCase()); });
  if (hit) {
    completeMission(_activeMission); _activeMission=null;
    var inp=document.getElementById('dialInput');
    if(inp){inp.placeholder='Votre réponse...';inp.style.borderColor='';}
  }
}

console.log("app.js: ✅ Version complète chargée et synchronisée avec state.js");


// =================================================================
// CINÉMA — Vidéos Internet Archive par langue
// Embed: https://archive.org/embed/{identifier}
// Toutes les ressources sont en domaine public (FSI, BBC, etc.)
// =================================================================
