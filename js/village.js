// village.js — PREMIUM EDITION (REDIMENSIONNÉ POUR MOBILE)
// LinguaVillage — Village circulaire parfaitement aligné
// ================================================================

window.canvas = null;
window.ctx = null;
window.tick = 0;
window.currentWeather = window.currentWeather || 'sun';
window.hoveredLoc = null;
window._onCanvasResize = window._onCanvasResize || null;

// ================================================================
// CONFIGURATION PREMIUM DU VILLAGE (ADAPTÉE MOBILE)
// ================================================================
window.VILLAGE_CONFIG = {
  rings: [
    { radius: 0.18, color: 'rgba(160,130,80,0.35)', width: 2.0 },   // Rayon réduit
    { radius: 0.32, color: 'rgba(160,130,80,0.30)', width: 1.8 },
    { radius: 0.48, color: 'rgba(160,130,80,0.28)', width: 1.5 },
    { radius: 0.65, color: 'rgba(160,130,80,0.25)', width: 1.2 },
  ],
  bobAmplitude: 1.5,        // Réduit pour mobile
  bobSpeed: 0.025,
  hoverScale: 1.08,
  hoverGlow: 'rgba(255,215,0,0.4)',
  particleCount: 20,
  starCount: 40,
};

// Positions des lieux recalculées pour tenir dans l'écran mobile
window.LOCATIONS_MOBILE = [
  // Centre
  { id:'cinema',   x:0.50, y:0.50, w:0.14, h:0.14, emoji:'🎬', color:'#c060c0', npcs:[] },
  // Anneau 1 (rayon ~0.25)
  { id:'market',   x:0.50, y:0.68, w:0.12, h:0.12, emoji:'🏪', color:'#c0a060', npcs:[{id:'merchant', name:'M. Diallo', role:{fr:'Marchand', en:'Merchant'}, emoji:'🧑‍🌾'}] },
  { id:'park',     x:0.50, y:0.32, w:0.12, h:0.12, emoji:'🌳', color:'#5a8a40', npcs:[] },
  // Anneau 2 (rayon ~0.38)
  { id:'friends',  x:0.68, y:0.68, w:0.12, h:0.12, emoji:'🤝', color:'#c09090', npcs:[{id:'friend', name:'Léa', role:{fr:'Amie', en:'Friend'}, emoji:'👧'}] },
  { id:'police',   x:0.32, y:0.68, w:0.12, h:0.12, emoji:'🚔', color:'#6070a0', npcs:[{id:'officer2', name:'Cap. Koné', role:{fr:'Policier', en:'Police'}, emoji:'👮‍♂️'}] },
  { id:'station',  x:0.32, y:0.32, w:0.12, h:0.12, emoji:'🚉', color:'#b0a090', npcs:[{id:'officer', name:'Agent Kofi', role:{fr:'Agent', en:'Officer'}, emoji:'👮'}] },
  { id:'bank',     x:0.68, y:0.32, w:0.12, h:0.12, emoji:'🏦', color:'#c0c080', npcs:[{id:'banker', name:'M. Dupuis', role:{fr:'Banquier', en:'Banker'}, emoji:'👨‍💼'}] },
  // Anneau 3 (rayon ~0.52)
  { id:'hospital', x:0.85, y:0.50, w:0.12, h:0.12, emoji:'🏥', color:'#d0e0f0', npcs:[{id:'doctor', name:'Dr. Martin', role:{fr:'Médecin', en:'Doctor'}, emoji:'👨‍⚕️'},{id:'nurse', name:'Sophie', role:{fr:'Infirmière', en:'Nurse'}, emoji:'👩‍⚕️'}] },
  { id:'church',   x:0.60, y:0.82, w:0.12, h:0.12, emoji:'⛪', color:'#8a7a60', npcs:[{id:'pastor', name:'Père Antoine', role:{fr:'Pasteur', en:'Pastor'}, emoji:'⛪'}] },
  { id:'tavern',   x:0.25, y:0.75, w:0.12, h:0.12, emoji:'🍺', color:'#8a6040', npcs:[{id:'bartender', name:'Sam', role:{fr:'Barman', en:'Bartender'}, emoji:'🍸'}] },
  { id:'factory',  x:0.25, y:0.25, w:0.12, h:0.12, emoji:'🏭', color:'#808080', npcs:[{id:'farmer', name:'Papa Joseph', role:{fr:'Agriculteur', en:'Farmer'}, emoji:'👨‍🌾'}] },
  { id:'school',   x:0.60, y:0.18, w:0.12, h:0.12, emoji:'🏫', color:'#6a8ab0', npcs:[{id:'teacher', name:'Mme Dupont', role:{fr:'Professeure', en:'Teacher'}, emoji:'👩‍🏫'}] },
];

// Fusionner avec LOCATIONS existant
if (typeof LOCATIONS !== 'undefined') {
  // Remplacer par les positions mobiles
  for (var i = 0; i < window.LOCATIONS_MOBILE.length; i++) {
    var existing = LOCATIONS.find(function(l) { return l.id === window.LOCATIONS_MOBILE[i].id; });
    if (existing) {
      existing.x = window.LOCATIONS_MOBILE[i].x;
      existing.y = window.LOCATIONS_MOBILE[i].y;
      existing.w = window.LOCATIONS_MOBILE[i].w;
      existing.h = window.LOCATIONS_MOBILE[i].h;
    } else {
      LOCATIONS.push(window.LOCATIONS_MOBILE[i]);
    }
  }
}

// ================================================================
// NAVIGATION VERS LE VILLAGE
// ================================================================
function goVillage() {
  if (!window.S) return;

  var hudPlayer = document.getElementById('hudPlayer');
  var hudLang   = document.getElementById('hudLang');
  var hudXP     = document.getElementById('hudXP');

  if (hudPlayer) hudPlayer.textContent = '👤 ' + (S.playerName || '').substring(0, 12);
  if (hudLang)   hudLang.textContent   = (FLAGS[S.targetLang]||'') + ' ' + (LANG_NAMES[S.targetLang]||'');
  if (hudXP)     hudXP.textContent     = (S.xp||0) + ' XP';

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

  canvas = null;
  ctx = null;
  tick = 0;
  window._villageLoopRunning = false;
  window._villageLoopActive = false;

  setTimeout(function() {
    var c = document.getElementById('villageCanvas');
    if (c) {
      // Adapter la taille au conteneur parent
      var parent = c.parentElement;
      var maxW = Math.min(window.innerWidth - 20, 450);
      var maxH = window.innerHeight - 120;
      
      c.width = maxW;
      c.height = maxH;
      c.style.width = maxW + 'px';
      c.style.height = maxH + 'px';
      c.style.display = 'block';
      c.style.margin = '0 auto';
    }

    initCanvas();
    setWeather(getWeatherForTime());
    updateTime();

    if (typeof player !== 'undefined') {
      if (typeof HOME !== 'undefined') {
        player.x = HOME.x;
        player.y = HOME.y;
      } else {
        player.x = 0.5;
        player.y = 0.5;
      }
      player.dest = null;
      player.walking = false;
      player.currentLoc = 'home';
    }

    setTimeout(function() {
      if (typeof addCEFRIndicator === 'function') addCEFRIndicator();
    }, 100);
  }, 300);

  if (window._timeUpdateInterval) clearInterval(window._timeUpdateInterval);
  window._timeUpdateInterval = setInterval(updateTime, 30000);
}

function getWeatherForTime() {
  var h = new Date().getHours();
  if (h >= 21 || h < 6) return 'night';
  var weathers = ['sun', 'sun', 'rain', 'wind', 'snow'];
  return weathers[Math.floor(Math.random() * weathers.length)];
}

function setWeather(w) {
  currentWeather = w;
  var hudWeather = document.getElementById('hudWeather');
  if (hudWeather) hudWeather.textContent = WEATHER_ICONS[w] || '☀️';
  buildWeatherFX(w);
}

function buildWeatherFX(w) {
  var o = document.getElementById('weatherOverlay');
  if (!o) return;
  o.innerHTML = '';

  if (w === 'rain') {
    for (var i = 0; i < 40; i++) {
      var d = document.createElement('div');
      d.className = 'rain-drop';
      d.style.cssText = 'left:' + (Math.random() * 100) + '%;' +
        'height:' + (40 + Math.random() * 60) + 'px;' +
        'top:-' + (40 + Math.random() * 60) + 'px;' +
        'animation-duration:' + (0.5 + Math.random() * 0.5) + 's;' +
        'animation-delay:' + (Math.random() * 2) + 's;' +
        'opacity:' + (0.3 + Math.random() * 0.4);
      o.appendChild(d);
    }
  } else if (w === 'snow') {
    for (var j = 0; j < 30; j++) {
      var f = document.createElement('div');
      f.className = 'snow-flake';
      f.textContent = '❄';
      f.style.cssText = 'left:' + (Math.random() * 100) + '%;' +
        'font-size:' + (6 + Math.random() * 8) + 'px;' +
        'animation-duration:' + (3 + Math.random() * 4) + 's;' +
        'animation-delay:' + (Math.random() * 5) + 's;' +
        'opacity:' + (0.5 + Math.random() * 0.4);
      o.appendChild(f);
    }
  }
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
  if (!canvas) return;

  var dpr = window.devicePixelRatio || 1;
  var parent = canvas.parentElement;
  var maxW = Math.min(window.innerWidth - 20, 450);
  var maxH = window.innerHeight - 120;
  
  canvas.width = maxW * dpr;
  canvas.height = maxH * dpr;
  canvas.style.width = maxW + 'px';
  canvas.style.height = maxH + 'px';

  ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(dpr, dpr);

  tick = 0;
  drawVillage();

  if (window._onCanvasResize) {
    window.removeEventListener('resize', window._onCanvasResize);
  }

  window._onCanvasResize = function() {
    if (canvas && canvas.parentElement) {
      var newMaxW = Math.min(window.innerWidth - 20, 450);
      var newMaxH = window.innerHeight - 120;
      var newDpr = window.devicePixelRatio || 1;
      canvas.width = newMaxW * newDpr;
      canvas.height = newMaxH * newDpr;
      canvas.style.width = newMaxW + 'px';
      canvas.style.height = newMaxH + 'px';
      var newCtx = canvas.getContext('2d');
      newCtx.scale(newDpr, newDpr);
      drawVillage();
    }
  };
  window.addEventListener('resize', window._onCanvasResize);

  canvas.removeEventListener('click', onVillageClick);
  canvas.removeEventListener('mousemove', onVillageHover);
  canvas.removeEventListener('touchstart', onVillageTouch);

  canvas.addEventListener('click', onVillageClick);
  canvas.addEventListener('mousemove', onVillageHover);
  canvas.addEventListener('touchstart', onVillageTouch, { passive: true });

  if (!window._villageLoopRunning) {
    window._villageLoopRunning = true;
    window._villageLoopActive = true;
    requestAnimationFrame(villageLoop);
  }
}

function villageLoop() {
  if (!window._villageLoopActive) return;
  tick++;
  if (typeof updatePlayer === 'function') updatePlayer();
  drawVillage();
  requestAnimationFrame(villageLoop);
}

function drawVillage() {
  if (!canvas || !ctx) return;

  var dpr = window.devicePixelRatio || 1;
  var W = canvas.width / dpr;
  var H = canvas.height / dpr;

  if (W === 0 || H === 0) return;

  var cx = W * 0.5;
  var cy = H * 0.5;
  var minDim = Math.min(W, H);
  var night = currentWeather === 'night';
  var cfg = window.VILLAGE_CONFIG;

  // Ciel adaptatif
  var sky = ctx.createLinearGradient(0, 0, 0, H * 0.6);
  if (night) {
    sky.addColorStop(0, '#0a0a1e');
    sky.addColorStop(1, '#020208');
  } else if (currentWeather === 'rain') {
    sky.addColorStop(0, '#1a2535');
    sky.addColorStop(1, '#0d1418');
  } else {
    sky.addColorStop(0, '#1a2a1a');
    sky.addColorStop(1, '#0a140a');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Étoiles la nuit
  if (night) {
    for (var i = 0; i < cfg.starCount; i++) {
      var sx = (Math.sin(i * 437.1) * 0.5 + 0.5) * W;
      var sy = (Math.sin(i * 293.3) * 0.5 + 0.5) * H * 0.5;
      var twinkle = 0.3 + 0.7 * Math.sin(tick * 0.02 + i * 0.5);
      var size = 1 + Math.sin(i * 127) * 0.5;
      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,220,' + twinkle + ')';
      ctx.fill();
    }
  }

  // Sol avec gradient
  var ground = ctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * 0.55);
  if (currentWeather === 'snow') {
    ground.addColorStop(0, '#c8d0d8');
    ground.addColorStop(1, '#889098');
  } else if (night) {
    ground.addColorStop(0, '#1a2a1a');
    ground.addColorStop(1, '#0a0f0a');
  } else {
    ground.addColorStop(0, '#2d5a2d');
    ground.addColorStop(1, '#0f1f0a');
  }
  ctx.fillStyle = ground;
  ctx.fillRect(0, 0, W, H);

  // Anneaux du village (plus fins)
  cfg.rings.forEach(function(ring) {
    var r = minDim * ring.radius;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = ring.color;
    ctx.lineWidth = ring.width;
    ctx.stroke();
  });

  // Chemins (plus discrets)
  if (typeof LOCATIONS !== 'undefined') {
    ctx.strokeStyle = 'rgba(160,130,80,0.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    LOCATIONS.forEach(function(loc) {
      if (loc.id === 'cinema') return;
      var lx = cx + (loc.x - 0.5) * minDim;
      var ly = cy + (loc.y - 0.5) * minDim;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(lx, ly);
      ctx.stroke();
    });
    ctx.setLineDash([]);
  }

  // Maison du joueur (centre)
  if (typeof drawPlayerHome === 'function') {
    drawPlayerHome(cx, cy, minDim * 0.06);
  } else {
    // Fallback maison
    ctx.beginPath();
    ctx.arc(cx, cy, minDim * 0.05, 0, Math.PI * 2);
    ctx.fillStyle = '#2a1a0a';
    ctx.fill();
    ctx.strokeStyle = '#c0a060';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = (minDim * 0.045) + 'px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffd700';
    ctx.fillText('🏠', cx, cy);
  }

  // Lieux
  if (typeof LOCATIONS !== 'undefined') {
    LOCATIONS.forEach(function(loc) {
      var bob = Math.sin(tick * cfg.bobSpeed + (loc.x * 10)) * cfg.bobAmplitude;
      var isHovered = hoveredLoc === loc.id;
      drawLocPremium(loc, cx, cy, minDim, bob, isHovered);
    });
  }

  // Ligne de marche
  if (typeof player !== 'undefined' && player.dest) {
    var px = cx + (player.x - 0.5) * minDim;
    var py = cy + (player.y - 0.5) * minDim;
    var dx = cx + (player.dest.x - 0.5) * minDim;
    var dy = cy + (player.dest.y - 0.5) * minDim;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(dx, dy);
    ctx.strokeStyle = 'rgba(255,215,0,0.25)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Personnage
  if (typeof drawPlayerCharacter === 'function') {
    drawPlayerCharacter(W, H);
  } else {
    // Fallback personnage
    var px = (typeof player !== 'undefined' && player.x) ? player.x : 0.5;
    var py = (typeof player !== 'undefined' && player.y) ? player.y : 0.5;
    var charX = cx + (px - 0.5) * minDim;
    var charY = cy + (py - 0.5) * minDim;
    ctx.beginPath();
    ctx.arc(charX, charY, minDim * 0.025, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,215,0,0.2)';
    ctx.fill();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.font = (minDim * 0.035) + 'px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffd700';
    ctx.fillText('🧑', charX, charY);
  }

  // Brume légère si pluie
  if (currentWeather === 'rain') {
    ctx.fillStyle = 'rgba(0,15,30,0.06)';
    ctx.fillRect(0, 0, W, H);
  }
}

function drawLocPremium(loc, cx, cy, minDim, bob, isHovered) {
  if (!ctx) return;

  var scale = isHovered ? window.VILLAGE_CONFIG.hoverScale : 1.0;
  var baseSize = Math.min(loc.w * minDim, loc.h * minDim);
  var size = baseSize * scale;
  var r = size * 0.5;

  var bx = cx + (loc.x - 0.5) * minDim;
  var by = cy + (loc.y - 0.5) * minDim + bob;

  var night = currentWeather === 'night';

  // Ombre
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = isHovered ? 10 : 5;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Halo si survol
  if (isHovered) {
    var glow = ctx.createRadialGradient(bx, by, r * 0.6, bx, by, r * 1.5);
    glow.addColorStop(0, window.VILLAGE_CONFIG.hoverGlow);
    glow.addColorStop(1, 'rgba(255,215,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(bx, by, r * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Cercle principal
  var grad = ctx.createRadialGradient(bx - r*0.3, by - r*0.3, 0, bx, by, r);
  var baseColor = loc.color;
  grad.addColorStop(0, lighten(baseColor, isHovered ? 25 : 12));
  grad.addColorStop(1, baseColor);

  ctx.beginPath();
  ctx.arc(bx, by, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();

  // Bordure
  ctx.beginPath();
  ctx.arc(bx, by, r, 0, Math.PI * 2);
  if (isHovered) {
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
  } else {
    ctx.strokeStyle = hexA(darken(loc.color), 0.7);
    ctx.lineWidth = 1.5;
  }
  ctx.stroke();

  // Fenêtres la nuit
  if (night) {
    ctx.fillStyle = 'rgba(255,220,120,0.6)';
    var winSize = r * 0.2;
    ctx.fillRect(bx - r * 0.3, by - r * 0.15, winSize, winSize);
    ctx.fillRect(bx + r * 0.1, by - r * 0.15, winSize, winSize);
  }

  // Emoji
  ctx.font = Math.max(14, Math.min(r * 0.9, 22)) + 'px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = night ? 'rgba(255,255,200,0.9)' : '#fff';
  ctx.fillText(loc.emoji, bx, by);

  // Nom du lieu (raccourci pour mobile)
  var nativeLang = (window.S && window.S.nativeLang) ? window.S.nativeLang : 'fr';
  var nm = (LOC_NAMES && LOC_NAMES[loc.id] && LOC_NAMES[loc.id][nativeLang]) 
    ? LOC_NAMES[loc.id][nativeLang].substring(0, 8) 
    : loc.id.substring(0, 6);

  ctx.font = 'bold ' + Math.max(8, Math.min(r * 0.22, 11)) + 'px Nunito,sans-serif';
  ctx.fillStyle = isHovered ? '#FFD700' : 'rgba(245,235,200,0.9)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(nm, bx, by + r + 3);
}

function hexA(h, a) {
  if (!h || h.length < 7) return 'rgba(100,100,100,' + a + ')';
  var r = parseInt(h.slice(1, 3), 16);
  var g = parseInt(h.slice(3, 5), 16);
  var b = parseInt(h.slice(5, 7), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

function darken(h) {
  if (!h || h.length < 7) return '#555555';
  var parts = [1, 3, 5].map(function(i) {
    return Math.max(0, parseInt(h.slice(i, i + 2), 16) - 40)
      .toString(16)
      .padStart(2, '0');
  });
  return '#' + parts.join('');
}

function lighten(h, amount) {
  if (!h || h.length < 7) return '#888888';
  var parts = [1, 3, 5].map(function(i) {
    return Math.min(255, parseInt(h.slice(i, i + 2), 16) + amount)
      .toString(16)
      .padStart(2, '0');
  });
  return '#' + parts.join('');
}

function getLocAt(mx, my) {
  if (!canvas || typeof LOCATIONS === 'undefined') return null;
  var dpr = window.devicePixelRatio || 1;
  var W = canvas.width / dpr;
  var H = canvas.height / dpr;
  var cx = W * 0.5;
  var cy = H * 0.5;
  var minDim = Math.min(W, H);

  return LOCATIONS.find(function(loc) {
    var bx = cx + (loc.x - 0.5) * minDim;
    var by = cy + (loc.y - 0.5) * minDim;
    var r = Math.min(loc.w * minDim, loc.h * minDim) * 0.55;
    var dx = mx - bx;
    var dy = my - by;
    return dx * dx + dy * dy <= r * r;
  });
}

function onVillageHover(e) {
  var rect = canvas.getBoundingClientRect();
  var scaleX = canvas.width / rect.width;
  var scaleY = canvas.height / rect.height;
  var loc = getLocAt((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);

  hoveredLoc = loc ? loc.id : null;
  canvas.style.cursor = loc ? 'pointer' : 'default';

  var tip = document.getElementById('locTooltip');
  if (loc && tip) {
    var nativeLang = (window.S && window.S.nativeLang) ? window.S.nativeLang : 'fr';
    var nm = (LOC_NAMES[loc.id] && LOC_NAMES[loc.id][nativeLang]) ? LOC_NAMES[loc.id][nativeLang] : loc.id;
    tip.innerHTML = '<strong style="color:var(--gold)">' + nm + '</strong>';
    tip.style.left = (e.clientX + 15) + 'px';
    tip.style.top = (e.clientY - 30) + 'px';
    tip.classList.add('show');
  } else if (tip) {
    tip.classList.remove('show');
  }
}

function onVillageClick(e) {
  var rect = canvas.getBoundingClientRect();
  var scaleX = canvas.width / rect.width;
  var scaleY = canvas.height / rect.height;
  var loc = getLocAt((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
  if (!loc) return;

  var xpReq = (typeof LOC_XP_REQUIREMENTS !== 'undefined' && LOC_XP_REQUIREMENTS[loc.id]) ? LOC_XP_REQUIREMENTS[loc.id] : 0;
  if ((S.xp||0) < xpReq) {
    if (typeof showNotif === 'function') showNotif('🔒 ' + ((LOC_NAMES[loc.id]&&LOC_NAMES[loc.id][S.nativeLang||'fr'])||loc.id) + ' — ' + xpReq + ' XP requis');
    return;
  }

  var goToLoc = function() {
    if (typeof playerGoHome === 'function') playerGoHome();
    if (typeof showScreen === 'function') {
      showScreen('screen-location');
    } else {
      document.querySelectorAll('.screen').forEach(function(s) {
        s.classList.remove('active');
        s.style.display = '';
      });
      var sl = document.getElementById('screen-location');
      if (sl) sl.classList.add('active');
    }
    if (typeof loadLocation === 'function') loadLocation(loc.id);
  };

  if (typeof startPlayerWalk === 'function') {
    startPlayerWalk(loc.x, loc.y, (LOC_NAMES[loc.id]?LOC_NAMES[loc.id][S.nativeLang||'fr']:loc.id), goToLoc);
  } else {
    goToLoc();
  }
}

function onVillageTouch(e) {
  e.preventDefault();
  var rect = canvas.getBoundingClientRect();
  var t = e.touches[0];
  var scaleX = canvas.width / rect.width;
  var scaleY = canvas.height / rect.height;
  var loc = getLocAt((t.clientX - rect.left) * scaleX, (t.clientY - rect.top) * scaleY);
  if (!loc) return;

  var xpReq = (typeof LOC_XP_REQUIREMENTS !== 'undefined' && LOC_XP_REQUIREMENTS[loc.id]) ? LOC_XP_REQUIREMENTS[loc.id] : 0;
  if ((S.xp||0) < xpReq) {
    if (typeof showNotif === 'function') showNotif('🔒 ' + ((LOC_NAMES[loc.id]&&LOC_NAMES[loc.id][S.nativeLang||'fr'])||loc.id) + ' — ' + xpReq + ' XP requis');
    return;
  }

  var goToLoc = function() {
    if (typeof playerGoHome === 'function') playerGoHome();
    if (typeof showScreen === 'function') {
      showScreen('screen-location');
    } else {
      document.querySelectorAll('.screen').forEach(function(s) {
        s.classList.remove('active');
        s.style.display = '';
      });
      var sl = document.getElementById('screen-location');
      if (sl) sl.classList.add('active');
    }
    if (typeof loadLocation === 'function') loadLocation(loc.id);
  };

  if (typeof startPlayerWalk === 'function') {
    startPlayerWalk(loc.x, loc.y, (LOC_NAMES[loc.id]?LOC_NAMES[loc.id][S.nativeLang||'fr']:loc.id), goToLoc);
  } else {
    goToLoc();
  }
}

var LOC_XP_REQUIREMENTS = {
  church:   0, school:  0, friends: 0,
  market:   50, tavern:  50, park:    50,
  hospital: 150, bank:    150, station: 150,
  police:   300, factory: 300, cinema:  400,
};

function loadLocation(locId) {
  var loc = LOCATIONS.find(function(l) { return l.id === locId; });
  if (!loc) return;

  var titleEl = document.getElementById('locTitle');
  if (titleEl) titleEl.textContent = (LOC_NAMES[loc.id] ? LOC_NAMES[loc.id][S.nativeLang||'fr'] : loc.id);

  var weatherEl = document.getElementById('locWeather');
  if (weatherEl) weatherEl.textContent = WEATHER_ICONS[currentWeather] || '';

  var npcList = document.getElementById('npcList');
  if (!npcList) return;

  if (!loc.npcs || loc.npcs.length === 0) {
    npcList.innerHTML = '<div class="npc-card"><div class="npc-avatar">🏠</div><div class="npc-info"><div class="npc-name">Personne ici</div><div class="npc-role">Reviens plus tard...</div></div></div>';
    return;
  }

  npcList.innerHTML = loc.npcs.map(function(npc) {
    var role = typeof npc.role === 'object' ? (npc.role[S.nativeLang||'fr'] || npc.role.en) : npc.role;
    return '<div class="npc-card" onclick="openDialogue(\'' + loc.id + '\', \'' + npc.id + '\')">' +
      '<div class="npc-avatar">' + npc.emoji + '</div>' +
      '<div class="npc-info">' +
      '<div class="npc-name">' + npc.name + '</div>' +
      '<div class="npc-role">' + (role || '') + '</div>' +
      '</div>' +
      '<div class="npc-go">💬</div>' +
      '</div>';
  }).join('');

  if (typeof openMissionsPanel === 'function') openMissionsPanel(loc.id);
}

// Exporter les variables globales
window.LOCATIONS = LOCATIONS;
window.LOC_XP_REQUIREMENTS = LOC_XP_REQUIREMENTS;
window.loadLocation = loadLocation;
window.onVillageClick = onVillageClick;
window.onVillageTouch = onVillageTouch;
window.onVillageHover = onVillageHover;
