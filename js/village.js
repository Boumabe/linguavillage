// village.js — VERSION MOBILE GARANTIE VISIBLE
// LinguaVillage — Village circulaire adapté aux petits écrans
// ================================================================

window.canvas = null;
window.ctx = null;
window.tick = 0;
window.currentWeather = window.currentWeather || 'sun';
window.hoveredLoc = null;

// Configuration simplifiée pour mobile
window.VILLAGE_CONFIG = {
  bobAmplitude: 0,  // Pas d'animation pour éviter les bugs
  bobSpeed: 0,
  hoverScale: 1.05,
  hoverGlow: 'rgba(255,215,0,0.3)',
};

// Positions des lieux - SIMPLES et CENTRÉES
window.LOCATIONS_MOBILE = [
  { id:'cinema',   x:0.50, y:0.50, emoji:'🎬', color:'#c060c0', npcs:[] },
  { id:'market',   x:0.50, y:0.72, emoji:'🏪', color:'#c0a060', npcs:[{id:'merchant', name:'M. Diallo', role:'Marchand', emoji:'🧑‍🌾'}] },
  { id:'park',     x:0.50, y:0.28, emoji:'🌳', color:'#5a8a40', npcs:[] },
  { id:'friends',  x:0.72, y:0.72, emoji:'🤝', color:'#c09090', npcs:[{id:'friend', name:'Léa', role:'Amie', emoji:'👧'}] },
  { id:'police',   x:0.28, y:0.72, emoji:'🚔', color:'#6070a0', npcs:[{id:'officer2', name:'Cap. Koné', role:'Policier', emoji:'👮‍♂️'}] },
  { id:'station',  x:0.28, y:0.28, emoji:'🚉', color:'#b0a090', npcs:[{id:'officer', name:'Agent Kofi', role:'Agent', emoji:'👮'}] },
  { id:'bank',     x:0.72, y:0.28, emoji:'🏦', color:'#c0c080', npcs:[{id:'banker', name:'M. Dupuis', role:'Banquier', emoji:'👨‍💼'}] },
  { id:'hospital', x:0.85, y:0.50, emoji:'🏥', color:'#d0e0f0', npcs:[{id:'doctor', name:'Dr. Martin', role:'Médecin', emoji:'👨‍⚕️'}] },
  { id:'church',   x:0.62, y:0.82, emoji:'⛪', color:'#8a7a60', npcs:[{id:'pastor', name:'Père Antoine', role:'Pasteur', emoji:'⛪'}] },
  { id:'tavern',   x:0.22, y:0.75, emoji:'🍺', color:'#8a6040', npcs:[{id:'bartender', name:'Sam', role:'Barman', emoji:'🍸'}] },
  { id:'factory',  x:0.22, y:0.25, emoji:'🏭', color:'#808080', npcs:[{id:'farmer', name:'Papa Joseph', role:'Agriculteur', emoji:'👨‍🌾'}] },
  { id:'school',   x:0.62, y:0.18, emoji:'🏫', color:'#6a8ab0', npcs:[{id:'teacher', name:'Mme Dupont', role:'Professeure', emoji:'👩‍🏫'}] },
];

// Taille des lieux (constante)
var LOC_SIZE = 0.14;

// Mettre à jour LOCATIONS global
if (typeof window.LOCATIONS !== 'undefined') {
  for (var i = 0; i < window.LOCATIONS_MOBILE.length; i++) {
    var m = window.LOCATIONS_MOBILE[i];
    var existing = window.LOCATIONS.find(function(l) { return l.id === m.id; });
    if (existing) {
      existing.x = m.x;
      existing.y = m.y;
      existing.w = LOC_SIZE;
      existing.h = LOC_SIZE;
      existing.emoji = m.emoji;
      existing.color = m.color;
      existing.npcs = m.npcs;
    } else {
      window.LOCATIONS.push({
        id: m.id, x: m.x, y: m.y, w: LOC_SIZE, h: LOC_SIZE,
        emoji: m.emoji, color: m.color, npcs: m.npcs
      });
    }
  }
}

// ================================================================
// NAVIGATION VERS LE VILLAGE
// ================================================================
function goVillage() {
  if (!window.S) return;

  // Mettre à jour le HUD
  var hudPlayer = document.getElementById('hudPlayer');
  var hudLang = document.getElementById('hudLang');
  var hudXP = document.getElementById('hudXP');
  
  if (hudPlayer) hudPlayer.textContent = '👤 ' + (S.playerName || '').substring(0, 10);
  if (hudLang) hudLang.textContent = (FLAGS[S.targetLang] || '') + ' ' + (LANG_NAMES[S.targetLang] || '');
  if (hudXP) hudXP.textContent = (S.xp || 0) + ' XP';

  // Afficher l'écran village
  if (typeof window.showScreen === 'function') {
    window.showScreen('screen-village');
  } else {
    document.querySelectorAll('.screen').forEach(function(s) {
      s.classList.remove('active');
      s.style.display = '';
    });
    var vs = document.getElementById('screen-village');
    if (vs) vs.classList.add('active');
  }

  // Réinitialiser
  canvas = null;
  ctx = null;
  tick = 0;

  // Attendre que le DOM soit prêt
  setTimeout(function() {
    initCanvas();
    setWeather(getWeatherForTime());
    updateTime();
    
    // Réinitialiser la position du joueur
    if (typeof player !== 'undefined') {
      player.x = 0.5;
      player.y = 0.5;
      player.dest = null;
      player.walking = false;
    }
  }, 200);
}

function getWeatherForTime() {
  var h = new Date().getHours();
  if (h >= 21 || h < 6) return 'night';
  return 'sun';
}

function setWeather(w) {
  currentWeather = w;
  var hudWeather = document.getElementById('hudWeather');
  if (hudWeather) hudWeather.textContent = WEATHER_ICONS[w] || '☀️';
}

function updateTime() {
  var n = new Date();
  var hudTime = document.getElementById('hudTime');
  if (hudTime) {
    hudTime.textContent = n.getHours().toString().padStart(2, '0') + ':' + 
                          n.getMinutes().toString().padStart(2, '0');
  }
}

function initCanvas() {
  canvas = document.getElementById('villageCanvas');
  if (!canvas) {
    console.error('Canvas non trouvé');
    return;
  }

  // Calculer la taille optimale pour mobile
  var container = canvas.parentElement;
  var maxWidth = Math.min(window.innerWidth - 20, 450);
  var maxHeight = window.innerHeight - 100;
  
  // Taille carrée pour un meilleur rendu
  var size = Math.min(maxWidth, maxHeight);
  
  canvas.width = size;
  canvas.height = size;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  canvas.style.display = 'block';
  canvas.style.margin = '0 auto';
  canvas.style.borderRadius = '16px';
  canvas.style.backgroundColor = '#0a0a14';

  ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Dessiner immédiatement
  drawVillage();

  // Redessiner périodiquement
  if (window._villageInterval) clearInterval(window._villageInterval);
  window._villageInterval = setInterval(function() {
    tick++;
    drawVillage();
  }, 50);
}

function drawVillage() {
  if (!canvas || !ctx) return;

  var W = canvas.width;
  var H = canvas.height;
  var cx = W / 2;
  var cy = H / 2;
  var minDim = Math.min(W, H);
  var night = currentWeather === 'night';

  // Effacer
  ctx.clearRect(0, 0, W, H);

  // Dessiner le ciel
  var gradient = ctx.createLinearGradient(0, 0, 0, H);
  if (night) {
    gradient.addColorStop(0, '#0a0a2a');
    gradient.addColorStop(1, '#050510');
  } else {
    gradient.addColorStop(0, '#1a3a2a');
    gradient.addColorStop(1, '#0a1a0a');
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  // Dessiner les étoiles la nuit
  if (night) {
    for (var i = 0; i < 50; i++) {
      var sx = (Math.sin(i * 437) * 0.5 + 0.5) * W;
      var sy = (Math.sin(i * 293) * 0.5 + 0.5) * H * 0.5;
      var twinkle = 0.3 + 0.7 * Math.sin(tick * 0.02 + i);
      ctx.beginPath();
      ctx.arc(sx, sy, 1 + Math.sin(i) * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,200,' + twinkle + ')';
      ctx.fill();
    }
  }

  // Dessiner le sol (cercle au centre)
  var groundGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * 0.55);
  if (night) {
    groundGradient.addColorStop(0, '#1a3a1a');
    groundGradient.addColorStop(1, '#0a1a0a');
  } else {
    groundGradient.addColorStop(0, '#3a7a3a');
    groundGradient.addColorStop(1, '#1a3a1a');
  }
  ctx.fillStyle = groundGradient;
  ctx.beginPath();
  ctx.arc(cx, cy, minDim * 0.48, 0, Math.PI * 2);
  ctx.fill();

  // Anneaux du village
  var rings = [0.18, 0.32, 0.48];
  rings.forEach(function(radius) {
    var r = minDim * radius;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(200,170,100,0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // Chemins
  ctx.strokeStyle = 'rgba(200,170,100,0.15)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 5]);
  window.LOCATIONS_MOBILE.forEach(function(loc) {
    if (loc.id === 'cinema') return;
    var lx = cx + (loc.x - 0.5) * minDim;
    var ly = cy + (loc.y - 0.5) * minDim;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(lx, ly);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  // Dessiner la maison du joueur (centre)
  var homeR = minDim * 0.05;
  ctx.beginPath();
  ctx.arc(cx, cy, homeR, 0, Math.PI * 2);
  ctx.fillStyle = '#3a2a1a';
  ctx.fill();
  ctx.strokeStyle = '#c0a060';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.font = (homeR * 1.3) + 'px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffd700';
  ctx.fillText('🏠', cx, cy);
  
  // Nom du joueur sous la maison
  ctx.font = 'bold ' + Math.max(8, homeR * 0.6) + 'px Nunito';
  ctx.fillStyle = 'rgba(255,215,0,0.7)';
  ctx.fillText(S.playerName || '', cx, cy + homeR + 8);

  // Dessiner tous les lieux
  window.LOCATIONS_MOBILE.forEach(function(loc) {
    drawLocation(loc, cx, cy, minDim);
  });

  // Dessiner le personnage
  if (typeof player !== 'undefined' && player) {
    var px = cx + (player.x - 0.5) * minDim;
    var py = cy + (player.y - 0.5) * minDim;
    var charR = minDim * 0.035;
    
    ctx.beginPath();
    ctx.arc(px, py, charR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,215,0,0.15)';
    ctx.fill();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    ctx.font = (charR * 1.5) + 'px serif';
    ctx.fillStyle = '#ffd700';
    ctx.fillText('🧑', px, py);
    
    // Afficher la destination si en marche
    if (player.dest && player.destName) {
      ctx.font = 'bold ' + Math.max(7, charR * 0.8) + 'px Nunito';
      ctx.fillStyle = 'rgba(255,215,0,0.6)';
      ctx.fillText('→ ' + player.destName.substring(0, 10), px + 12, py - 8);
    }
  }
}

function drawLocation(loc, cx, cy, minDim) {
  if (!ctx) return;
  
  var isHovered = (hoveredLoc === loc.id);
  var r = minDim * (LOC_SIZE / 2);
  var scale = isHovered ? 1.08 : 1;
  var drawR = r * scale;
  
  var x = cx + (loc.x - 0.5) * minDim;
  var y = cy + (loc.y - 0.5) * minDim;
  
  // Ombre
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = isHovered ? 8 : 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  
  // Cercle
  var gradient = ctx.createRadialGradient(x - 3, y - 3, 0, x, y, drawR);
  gradient.addColorStop(0, lightenColor(loc.color, 20));
  gradient.addColorStop(1, loc.color);
  
  ctx.beginPath();
  ctx.arc(x, y, drawR, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Bordure
  ctx.beginPath();
  ctx.arc(x, y, drawR, 0, Math.PI * 2);
  ctx.strokeStyle = isHovered ? '#FFD700' : 'rgba(255,215,0,0.4)';
  ctx.lineWidth = isHovered ? 2.5 : 1.5;
  ctx.stroke();
  
  ctx.shadowColor = 'transparent';
  
  // Emoji
  ctx.font = Math.max(16, Math.min(drawR * 0.9, 24)) + 'px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.fillText(loc.emoji, x, y);
  
  // Nom (raccourci pour mobile)
  var name = getLocationName(loc.id);
  ctx.font = 'bold ' + Math.max(8, drawR * 0.28) + 'px Nunito';
  ctx.fillStyle = isHovered ? '#FFD700' : 'rgba(255,245,220,0.9)';
  ctx.fillText(name.substring(0, 8), x, y + drawR + 5);
}

function getLocationName(locId) {
  var nativeLang = (window.S && window.S.nativeLang) ? window.S.nativeLang : 'fr';
  var names = {
    cinema: { fr: 'Cinéma', en: 'Cinema', es: 'Cine', ht: 'Sinema' },
    market: { fr: 'Marché', en: 'Market', es: 'Mercado', ht: 'Mache' },
    park: { fr: 'Parc', en: 'Park', es: 'Parque', ht: 'Pak' },
    friends: { fr: 'Amis', en: 'Friends', es: 'Amigos', ht: 'Zanmi' },
    police: { fr: 'Police', en: 'Police', es: 'Policía', ht: 'Polis' },
    station: { fr: 'Gare', en: 'Station', es: 'Estación', ht: 'Estasyon' },
    bank: { fr: 'Banque', en: 'Bank', es: 'Banco', ht: 'Bank' },
    hospital: { fr: 'Hôpital', en: 'Hospital', es: 'Hospital', ht: 'Lopital' },
    church: { fr: 'Église', en: 'Church', es: 'Iglesia', ht: 'Legliz' },
    tavern: { fr: 'Taverne', en: 'Tavern', es: 'Taberna', ht: 'Tavèn' },
    factory: { fr: 'Ferme', en: 'Farm', es: 'Granja', ht: 'Fèm' },
    school: { fr: 'École', en: 'School', es: 'Escuela', ht: 'Lekòl' }
  };
  return (names[locId] && names[locId][nativeLang]) || names[locId]?.en || locId;
}

function lightenColor(color, amount) {
  if (!color || color.length < 7) return '#888888';
  var r = parseInt(color.slice(1, 3), 16);
  var g = parseInt(color.slice(3, 5), 16);
  var b = parseInt(color.slice(5, 7), 16);
  r = Math.min(255, r + amount);
  g = Math.min(255, g + amount);
  b = Math.min(255, b + amount);
  return '#' + r.toString(16).padStart(2, '0') + 
              g.toString(16).padStart(2, '0') + 
              b.toString(16).padStart(2, '0');
}

function getLocAt(mx, my) {
  if (!canvas) return null;
  
  var rect = canvas.getBoundingClientRect();
  var scaleX = canvas.width / rect.width;
  var scaleY = canvas.height / rect.height;
  var canvasX = (mx - rect.left) * scaleX;
  var canvasY = (my - rect.top) * scaleY;
  
  var W = canvas.width;
  var H = canvas.height;
  var cx = W / 2;
  var cy = H / 2;
  var minDim = Math.min(W, H);
  var r = minDim * (LOC_SIZE / 2);
  
  // Vérifier chaque lieu
  for (var i = 0; i < window.LOCATIONS_MOBILE.length; i++) {
    var loc = window.LOCATIONS_MOBILE[i];
    var x = cx + (loc.x - 0.5) * minDim;
    var y = cy + (loc.y - 0.5) * minDim;
    var dx = canvasX - x;
    var dy = canvasY - y;
    if (dx * dx + dy * dy <= r * r * 1.2) {
      return loc;
    }
  }
  return null;
}

function onVillageClick(e) {
  var loc = getLocAt(e.clientX, e.clientY);
  if (!loc) return;
  
  var xpReq = getXpRequirement(loc.id);
  if ((S.xp || 0) < xpReq) {
    if (typeof showNotif === 'function') {
      showNotif('🔒 ' + getLocationName(loc.id) + ' — ' + xpReq + ' XP requis');
    }
    return;
  }
  
  // Naviguer vers le lieu
  if (typeof startPlayerWalk === 'function') {
    startPlayerWalk(loc.x, loc.y, getLocationName(loc.id), function() {
      if (typeof showScreen === 'function') showScreen('screen-location');
      if (typeof loadLocation === 'function') loadLocation(loc.id);
    });
  } else {
    if (typeof showScreen === 'function') showScreen('screen-location');
    if (typeof loadLocation === 'function') loadLocation(loc.id);
  }
}

function onVillageTouch(e) {
  e.preventDefault();
  var touch = e.touches[0];
  var loc = getLocAt(touch.clientX, touch.clientY);
  if (!loc) return;
  
  var xpReq = getXpRequirement(loc.id);
  if ((S.xp || 0) < xpReq) {
    if (typeof showNotif === 'function') {
      showNotif('🔒 ' + getLocationName(loc.id) + ' — ' + xpReq + ' XP requis');
    }
    return;
  }
  
  if (typeof startPlayerWalk === 'function') {
    startPlayerWalk(loc.x, loc.y, getLocationName(loc.id), function() {
      if (typeof showScreen === 'function') showScreen('screen-location');
      if (typeof loadLocation === 'function') loadLocation(loc.id);
    });
  } else {
    if (typeof showScreen === 'function') showScreen('screen-location');
    if (typeof loadLocation === 'function') loadLocation(loc.id);
  }
}

function onVillageHover(e) {
  var loc = getLocAt(e.clientX, e.clientY);
  hoveredLoc = loc ? loc.id : null;
  if (canvas) canvas.style.cursor = loc ? 'pointer' : 'default';
  
  var tip = document.getElementById('locTooltip');
  if (loc && tip) {
    tip.innerHTML = '<strong style="color:var(--gold)">' + getLocationName(loc.id) + '</strong>';
    tip.style.left = (e.clientX + 15) + 'px';
    tip.style.top = (e.clientY - 30) + 'px';
    tip.classList.add('show');
  } else if (tip) {
    tip.classList.remove('show');
  }
}

function getXpRequirement(locId) {
  var req = {
    cinema: 0, market: 50, park: 0, friends: 0, police: 300,
    station: 150, bank: 150, hospital: 150, church: 0, tavern: 50,
    factory: 300, school: 0
  };
  return req[locId] || 0;
}

function loadLocation(locId) {
  var loc = window.LOCATIONS_MOBILE.find(function(l) { return l.id === locId; });
  if (!loc) return;
  
  var titleEl = document.getElementById('locTitle');
  if (titleEl) titleEl.textContent = getLocationName(locId);
  
  var weatherEl = document.getElementById('locWeather');
  if (weatherEl) weatherEl.textContent = WEATHER_ICONS[currentWeather] || '';
  
  var npcList = document.getElementById('npcList');
  if (!npcList) return;
  
  if (!loc.npcs || loc.npcs.length === 0) {
    npcList.innerHTML = '<div class="npc-card"><div class="npc-avatar">🏠</div><div class="npc-info"><div class="npc-name">Personne ici</div><div class="npc-role">Reviens plus tard...</div></div></div>';
    return;
  }
  
  npcList.innerHTML = loc.npcs.map(function(npc) {
    return '<div class="npc-card" onclick="openDialogue(\'' + loc.id + '\', \'' + npc.id + '\')">' +
      '<div class="npc-avatar">' + (npc.emoji || '🧑') + '</div>' +
      '<div class="npc-info">' +
      '<div class="npc-name">' + npc.name + '</div>' +
      '<div class="npc-role">' + (typeof npc.role === 'string' ? npc.role : (npc.role?.fr || '')) + '</div>' +
      '</div>' +
      '<div class="npc-go">💬</div>' +
      '</div>';
  }).join('');
  
  if (typeof openMissionsPanel === 'function') openMissionsPanel(loc.id);
}

// Attacher les événements
document.addEventListener('DOMContentLoaded', function() {
  var canvasEl = document.getElementById('villageCanvas');
  if (canvasEl) {
    canvasEl.addEventListener('click', onVillageClick);
    canvasEl.addEventListener('mousemove', onVillageHover);
    canvasEl.addEventListener('touchstart', onVillageTouch, { passive: false });
  }
});

// Nettoyer l'intervalle si nécessaire
window.addEventListener('beforeunload', function() {
  if (window._villageInterval) clearInterval(window._villageInterval);
});

console.log('✅ Village mobile chargé');
