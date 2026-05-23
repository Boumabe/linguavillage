// village.js — PREMIUM EDITION (CORRIGÉ - FICHIER COMPLET)
// LinguaVillage — Village circulaire parfaitement aligné
// ================================================================

window.canvas = null;
window.ctx = null;
window.tick = 0;
window.currentWeather = window.currentWeather || 'sun';
window.hoveredLoc = null;
window._onCanvasResize = window._onCanvasResize || null;

// ================================================================
// CONFIGURATION PREMIUM DU VILLAGE
// Rayons réduits pour tenir dans l'écran mobile (portrait 360px)
// Anneau max 0.35 × minDim = 0.35 × 340 = 119px → bâtiment bord = ~140px
// Demi-canvas = 170px → tout tient avec 30px de marge
// ================================================================
window.VILLAGE_CONFIG = {
  rings: [
    { radius: 0.07,  color: 'rgba(160,130,80,0.35)', width: 2.5 },
    { radius: 0.145, color: 'rgba(160,130,80,0.30)', width: 2.0 },
    { radius: 0.235, color: 'rgba(160,130,80,0.28)', width: 1.8 },
    { radius: 0.335, color: 'rgba(160,130,80,0.25)', width: 1.5 },
  ],
  bobAmplitude: 2.5,
  bobSpeed: 0.025,
  hoverScale: 1.15,
  hoverGlow: 'rgba(255,215,0,0.4)',
  particleCount: 30,
  starCount: 60,
};

// ================================================================
// ALIGNEMENT PRÉCIS DES BÂTIMENTS SUR LES ANNEAUX
// ================================================================
window.LOC_RING_MAP = {
  church:    [1,   90],
  school:    [1,  210],
  friends:   [1,  330],
  market:    [2,   30],
  tavern:    [2,  150],
  park:      [2,  270],
  hospital:  [3,   60],
  bank:      [3,  180],
  station:   [3,  300],
  police:    [3,    0],
  factory:   [3,  240],
  cinema:    [null, null],
};

function alignLocationsToRings() {
  if (typeof LOCATIONS === 'undefined') return;
  var rings = window.VILLAGE_CONFIG.rings;

  LOCATIONS.forEach(function(loc) {
    var mapping = window.LOC_RING_MAP[loc.id];
    if (!mapping || mapping[0] === null) {
      if (loc.id === 'cinema') {
        loc._ringX = 0.5 + 0.28;
        loc._ringY = 0.5 - 0.28;
      }
      return;
    }
    var ringIdx  = mapping[0];
    var angleDeg = mapping[1];
    var ring = rings[ringIdx];
    if (!ring) return;
    var rad = (angleDeg - 90) * Math.PI / 180;
    loc._ringX = 0.5 + ring.radius * Math.cos(rad);
    loc._ringY = 0.5 + ring.radius * Math.sin(rad);
  });
}

// ================================================================
// CALCUL UNIQUE DE LA TAILLE DU CANVAS — appliqué partout
// Canvas carré, côté = min(largeur, hauteur_dispo) − 24px
// setAttribute écrase les !important du CSS
// ================================================================
function _sizeCanvas(c) {
  if (!c) return 0;
  var dpr  = window.devicePixelRatio || 1;
  var hud  = document.querySelector('.village-hud');
  var hudH = hud ? hud.getBoundingClientRect().height : 100;
  var vp   = window.visualViewport;
  var vW   = (vp ? vp.width  : null) || window.innerWidth  || 360;
  var vH   = (vp ? vp.height : null) || window.innerHeight || 640;
  var avH  = Math.max(180, vH - hudH);
  var side = Math.max(160, Math.min(vW, avH) - 24);
  c.width  = Math.round(side * dpr);
  c.height = Math.round(side * dpr);
  c.setAttribute('style',
    'display:block;width:' + side + 'px;height:' + side + 'px;' +
    'margin:auto;flex:none;');
  return side;
}

// ================================================================
// goVillage
// ================================================================
function goVillage() {
  if (!window.S) return;

  var hudPlayer = document.getElementById('hudPlayer');
  var hudLang   = document.getElementById('hudLang');
  var hudXP     = document.getElementById('hudXP');
  if (hudPlayer) hudPlayer.textContent = '👤 ' + S.playerName;
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
  ctx    = null;
  tick   = 0;
  window._villageLoopRunning = false;
  window._villageLoopActive  = false;

  setTimeout(function() {
    var c = document.getElementById('villageCanvas');
    if (!c) { initCanvas(); setWeather(getWeatherForTime()); updateTime(); return; }
    _sizeCanvas(c);
    alignLocationsToRings();
    initCanvas();
    setWeather(getWeatherForTime());
    updateTime();

    if (typeof player !== 'undefined') {
      player.x = HOME.x;
      player.y = HOME.y;
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
    for (var i = 0; i < 60; i++) {
      var d = document.createElement('div');
      d.className = 'rain-drop';
      d.style.cssText = 'left:' + (Math.random() * 110 - 5) + '%;' +
        'height:' + (60 + Math.random() * 80) + 'px;' +
        'top:-' + (60 + Math.random() * 80) + 'px;' +
        'animation-duration:' + (0.4 + Math.random() * 0.4) + 's;' +
        'animation-delay:' + (Math.random() * 2) + 's;' +
        'opacity:' + (0.3 + Math.random() * 0.4);
      o.appendChild(d);
    }
  } else if (w === 'snow') {
    for (var j = 0; j < 40; j++) {
      var f = document.createElement('div');
      f.className = 'snow-flake';
      f.textContent = '❄';
      f.style.cssText = 'left:' + (Math.random() * 100) + '%;' +
        'font-size:' + (8 + Math.random() * 10) + 'px;' +
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
    hudTime.textContent = n.getHours().toString().padStart(2,'0') + ':' +
                          n.getMinutes().toString().padStart(2,'0');
  }
}

// ================================================================
// initCanvas
// ================================================================
function initCanvas() {
  canvas = document.getElementById('villageCanvas');
  if (!canvas) return;
  var dpr = window.devicePixelRatio || 1;

  if (canvas.width === 0 || canvas.height === 0) {
    _sizeCanvas(canvas);
  }

  canvas.style.display = 'block';
  ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  var W = canvas.width / dpr;
  var H = canvas.height / dpr;
  ctx.fillStyle = '#0a0a14';
  ctx.fillRect(0, 0, W, H);
  tick = 0;
  drawVillage();

  if (window._onCanvasResize) {
    window.removeEventListener('resize', window._onCanvasResize);
  }
  window._onCanvasResize = function() {
    if (!canvas) return;
    var newDpr = window.devicePixelRatio || 1;
    _sizeCanvas(canvas);
    alignLocationsToRings();
    ctx = canvas.getContext('2d');
    ctx.scale(newDpr, newDpr);
    drawVillage();
  };
  window.addEventListener('resize', window._onCanvasResize);

  canvas.removeEventListener('click',      onVillageClick);
  canvas.removeEventListener('mousemove',  onVillageHover);
  canvas.removeEventListener('touchstart', onVillageTouch);
  canvas.addEventListener('click',      onVillageClick);
  canvas.addEventListener('mousemove',  onVillageHover);
  canvas.addEventListener('touchstart', onVillageTouch, { passive: true });

  if (!window._villageLoopRunning) {
    window._villageLoopRunning = true;
    window._villageLoopActive  = true;
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

// ================================================================
// drawVillage
// minDim = 90% du côté du canvas carré
// Anneau max 0.335 × minDim = 0.335 × (side×0.90) < side×0.5 ✓
// ================================================================
function drawVillage() {
  if (!canvas || !ctx) return;
  var dpr = window.devicePixelRatio || 1;
  var W = canvas.width / dpr;
  var H = canvas.height / dpr;
  if (W === 0 || H === 0) return;

  var cx = W * 0.5;
  var cy = H * 0.5;

  // Canvas carré → min(W,H)=W=H. 90% pour une marge visible.
  var minDim = Math.min(W, H) * 0.90;

  var night = currentWeather === 'night';
  var cfg   = window.VILLAGE_CONFIG;

  var sky = ctx.createRadialGradient(cx, cy * 0.3, 0, cx, cy, minDim * 0.6);
  if (night) {
    sky.addColorStop(0, '#0a0a1e');
    sky.addColorStop(0.5, '#050510');
    sky.addColorStop(1, '#020208');
  } else if (currentWeather === 'rain') {
    sky.addColorStop(0, '#1a2535');
    sky.addColorStop(1, '#0d1418');
  } else {
    sky.addColorStop(0, '#1a2a1a');
    sky.addColorStop(0.5, '#0f1f0f');
    sky.addColorStop(1, '#0a140a');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  if (night) drawStars(cx, cy, minDim);
  drawCelestialBody(W, H, night);
  drawGround(cx, cy, minDim, night);
  drawRings(cx, cy, minDim, cfg.rings);
  drawConnectors(cx, cy, minDim);

  if (typeof drawPlayerHome === 'function') {
    drawPlayerHome(cx, cy, minDim * 0.06);
  }

  if (typeof LOCATIONS !== 'undefined') {
    LOCATIONS.forEach(function(loc) {
      var bob = Math.sin(tick * cfg.bobSpeed + loc.x * 10) * cfg.bobAmplitude;
      var isHovered = hoveredLoc === loc.id;
      drawLocPremium(loc, cx, cy, minDim, bob, isHovered);
    });
  }

  if (typeof player !== 'undefined' && player.dest) {
    drawPlayerPath(cx, cy, minDim);
  }
  if (typeof drawPlayerCharacter === 'function') {
    drawPlayerCharacter(W, H);
  }

  if (currentWeather === 'rain') {
    ctx.fillStyle = 'rgba(0,15,30,0.08)';
    ctx.fillRect(0, 0, W, H);
  }
  if (!night && currentWeather === 'sun') {
    drawAtmosphericParticles(W, H);
  }
}

function drawStars(cx, cy, minDim) {
  var count = window.VILLAGE_CONFIG.starCount;
  for (var i = 0; i < count; i++) {
    var sx = (Math.sin(i * 437.1) * 0.5 + 0.5) * canvas.width / (window.devicePixelRatio || 1);
    var sy = (Math.sin(i * 293.3) * 0.5 + 0.5) * (canvas.height / (window.devicePixelRatio || 1)) * 0.45;
    var twinkle = 0.3 + 0.7 * Math.sin(tick * 0.02 + i * 0.5);
    var size = 0.5 + Math.sin(i * 127) * 0.5;
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,220,' + twinkle + ')';
    ctx.fill();
  }
}

function drawCelestialBody(W, H, night) {
  var x = W * 0.85;
  var y = H * 0.12;
  if (night) {
    var moonGlow = ctx.createRadialGradient(x, y, 0, x, y, 40);
    moonGlow.addColorStop(0, 'rgba(240,230,160,0.3)');
    moonGlow.addColorStop(1, 'rgba(240,230,160,0)');
    ctx.fillStyle = moonGlow;
    ctx.fillRect(x - 40, y - 40, 80, 80);
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#f0e6a0';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - 4, y - 2, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200,190,140,0.3)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 5, y + 3, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200,190,140,0.2)';
    ctx.fill();
  } else {
    var sunColor = currentWeather === 'rain' ? '#8a98a8' : '#ffe8a0';
    var sunGlow = ctx.createRadialGradient(x, y, 0, x, y, 50);
    sunGlow.addColorStop(0, 'rgba(255,230,160,0.25)');
    sunGlow.addColorStop(1, 'rgba(255,230,160,0)');
    ctx.fillStyle = sunGlow;
    ctx.fillRect(x - 50, y - 50, 100, 100);
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fillStyle = sunColor;
    ctx.fill();
    if (currentWeather !== 'rain') {
      for (var r = 0; r < 8; r++) {
        var angle = (r / 8) * Math.PI * 2 + tick * 0.005;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(angle) * 24, y + Math.sin(angle) * 24);
        ctx.lineTo(x + Math.cos(angle) * 32, y + Math.sin(angle) * 32);
        ctx.strokeStyle = 'rgba(255,230,160,0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }
}

function drawGround(cx, cy, minDim, night) {
  var ground = ctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * 0.55);
  if (currentWeather === 'snow') {
    ground.addColorStop(0, '#c8d0d8');
    ground.addColorStop(0.6, '#a8b0b8');
    ground.addColorStop(1, '#889098');
  } else if (night) {
    ground.addColorStop(0, '#1a2a1a');
    ground.addColorStop(0.6, '#0f1a0f');
    ground.addColorStop(1, '#0a0f0a');
  } else {
    ground.addColorStop(0, '#2d5a2d');
    ground.addColorStop(0.5, '#1e3d1a');
    ground.addColorStop(1, '#0f1f0a');
  }
  ctx.fillStyle = ground;
  var W = canvas.width / (window.devicePixelRatio || 1);
  var H = canvas.height / (window.devicePixelRatio || 1);
  ctx.fillRect(0, 0, W, H);
}

function drawRings(cx, cy, minDim, rings) {
  rings.forEach(function(ring) {
    var r = minDim * ring.radius;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = ring.color;
    ctx.lineWidth = ring.width;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r - 1, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(200,170,100,0.15)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  });
}

function drawConnectors(cx, cy, minDim) {
  if (!LOCATIONS) return;
  ctx.strokeStyle = 'rgba(160,130,80,0.12)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 6]);
  LOCATIONS.forEach(function(loc) {
    if (loc.id === 'cinema') return;
    var centerX = (loc._ringX !== undefined) ? loc._ringX : (loc.x + loc.w / 2);
    var centerY = (loc._ringY !== undefined) ? loc._ringY : (loc.y + loc.h / 2);
    var lx = cx + (centerX - 0.5) * minDim;
    var ly = cy + (centerY - 0.5) * minDim;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(lx, ly);
    ctx.stroke();
  });
  ctx.setLineDash([]);
}

function drawLocPremium(loc, cx, cy, minDim, bob, isHovered) {
  if (!ctx) return;
  var scale = isHovered ? window.VILLAGE_CONFIG.hoverScale : 1.0;
  var mapping = window.LOC_RING_MAP && window.LOC_RING_MAP[loc.id];
  var ringIdx  = (mapping && mapping[0] !== null) ? mapping[0] : null;
  var rings    = window.VILLAGE_CONFIG.rings;
  var baseRingRadius = (ringIdx !== null && rings[ringIdx]) ? rings[ringIdx].radius : 0.06;
  var sizeRelative   = Math.max(0.04, baseRingRadius * 0.38);
  var baseSize = sizeRelative * minDim;
  var size = baseSize * scale;
  var r = size * 0.5;

  var centerX = (loc._ringX !== undefined) ? loc._ringX : (loc.x + loc.w / 2);
  var centerY = (loc._ringY !== undefined) ? loc._ringY : (loc.y + loc.h / 2);
  var bx = cx + (centerX - 0.5) * minDim;
  var by = cy + (centerY - 0.5) * minDim + bob;

  var night = currentWeather === 'night';

  ctx.save();
  ctx.shadowColor   = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur    = isHovered ? 15 : 8;
  ctx.shadowOffsetX = isHovered ? 6 : 3;
  ctx.shadowOffsetY = (isHovered ? 6 : 3) + 2;

  if (isHovered) {
    var glow = ctx.createRadialGradient(bx, by, r * 0.8, bx, by, r * 1.8);
    glow.addColorStop(0, window.VILLAGE_CONFIG.hoverGlow);
    glow.addColorStop(1, 'rgba(255,215,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(bx, by, r * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  var grad = ctx.createRadialGradient(bx - r*0.3, by - r*0.3, 0, bx, by, r);
  var baseColor = loc.color;
  if (isHovered) {
    grad.addColorStop(0, lighten(baseColor, 30));
    grad.addColorStop(1, baseColor);
  } else {
    grad.addColorStop(0, lighten(baseColor, 15));
    grad.addColorStop(1, baseColor);
  }
  ctx.beginPath();
  ctx.arc(bx, by, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.arc(bx, by, r, 0, Math.PI * 2);
  if (isHovered) {
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur  = 10;
  } else {
    ctx.strokeStyle = hexA(darken(loc.color), 0.8);
    ctx.lineWidth = 2;
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur  = 0;
  }
  ctx.stroke();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur  = 0;

  if (night) {
    ctx.fillStyle = 'rgba(255,220,120,0.7)';
    var winSize = r * 0.18;
    ctx.fillRect(bx - r * 0.25, by - r * 0.1, winSize, winSize);
    ctx.fillRect(bx + r * 0.08, by - r * 0.1, winSize, winSize);
    ctx.shadowColor = 'rgba(255,220,120,0.5)';
    ctx.shadowBlur  = 8;
    ctx.fillRect(bx - r * 0.25, by - r * 0.1, winSize, winSize);
    ctx.fillRect(bx + r * 0.08, by - r * 0.1, winSize, winSize);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur  = 0;
  }

  ctx.font = (size * 0.42) + 'px serif';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(loc.emoji, bx, by);

  var nativeLang = (window.S && window.S.nativeLang) ? window.S.nativeLang : 'en';
  var nm = (LOC_NAMES && LOC_NAMES[loc.id] && LOC_NAMES[loc.id][nativeLang])
           ? LOC_NAMES[loc.id][nativeLang] : loc.id;

  ctx.font = 'bold ' + Math.max(8, Math.min(size * 0.16, 11)) + 'px Nunito,sans-serif';
  ctx.fillStyle    = isHovered ? '#FFD700' : 'rgba(255,245,220,0.95)';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'top';
  ctx.shadowColor  = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur   = 4;
  ctx.fillText(nm, bx, by + r + 4);
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur  = 0;

  if (loc.id === 'cinema') {
    ctx.beginPath();
    ctx.arc(bx + r * 0.7, by - r * 0.7, r * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = '#e040fb';
    ctx.fill();
    ctx.font = (size * 0.14) + 'px Nunito';
    ctx.fillStyle    = '#fff';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('▶', bx + r * 0.7, by - r * 0.7);
  }
}

function drawPlayerPath(cx, cy, minDim) {
  if (!player || !player.dest) return;
  var px = cx + (player.x     - 0.5) * minDim;
  var py = cy + (player.y     - 0.5) * minDim;
  var dx = cx + (player.dest.x - 0.5) * minDim;
  var dy = cy + (player.dest.y - 0.5) * minDim;
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.lineTo(dx, dy);
  ctx.strokeStyle = 'rgba(255,215,0,0.25)';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 8]);
  ctx.stroke();
  ctx.setLineDash([]);
  var pulse = 0.5 + 0.5 * Math.sin(tick * 0.1);
  ctx.beginPath();
  ctx.arc(dx, dy, 4 + pulse * 3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,215,0,' + (0.3 + pulse * 0.3) + ')';
  ctx.fill();
}

function drawAtmosphericParticles(W, H) {
  var count = window.VILLAGE_CONFIG.particleCount;
  for (var i = 0; i < count; i++) {
    var px    = (Math.sin(i * 137.3 + tick * 0.008) * 0.5 + 0.5) * W;
    var py    = (Math.cos(i * 97.1  + tick * 0.006) * 0.5 + 0.5) * H;
    var alpha = 0.1 + 0.1 * Math.sin(tick * 0.02 + i);
    var sz    = 0.5 + Math.sin(i * 53.7) * 0.5;
    ctx.beginPath();
    ctx.arc(px, py, sz, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,200,' + alpha + ')';
    ctx.fill();
  }
}

function hexA(h, a) {
  var r = parseInt(h.slice(1,3), 16);
  var g = parseInt(h.slice(3,5), 16);
  var b = parseInt(h.slice(5,7), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}
function darken(h) {
  return '#' + [1,3,5].map(function(i) {
    return Math.max(0, parseInt(h.slice(i,i+2),16) - 50).toString(16).padStart(2,'0');
  }).join('');
}
function lighten(h, amount) {
  return '#' + [1,3,5].map(function(i) {
    return Math.min(255, parseInt(h.slice(i,i+2),16) + amount).toString(16).padStart(2,'0');
  }).join('');
}

// ================================================================
// getLocAt — détection du clic/tap sur un bâtiment
// ================================================================
function getLocAt(mx, my) {
  if (!canvas || typeof LOCATIONS === 'undefined') return null;
  var dpr = window.devicePixelRatio || 1;
  var W   = canvas.width  / dpr;
  var H   = canvas.height / dpr;
  var cx  = W * 0.5;
  var cy  = H * 0.5;
  var minDim = Math.min(W, H) * 0.90;

  return LOCATIONS.find(function(loc) {
    var centerX = (loc._ringX !== undefined) ? loc._ringX : (loc.x + loc.w / 2);
    var centerY = (loc._ringY !== undefined) ? loc._ringY : (loc.y + loc.h / 2);
    var bx = cx + (centerX - 0.5) * minDim;
    var by = cy + (centerY - 0.5) * minDim;
    var mapping = window.LOC_RING_MAP && window.LOC_RING_MAP[loc.id];
    var ringIdx = (mapping && mapping[0] !== null) ? mapping[0] : null;
    var rings   = window.VILLAGE_CONFIG.rings;
    var baseRingRadius = (ringIdx !== null && rings[ringIdx]) ? rings[ringIdx].radius : 0.06;
    var sizeRelative   = Math.max(0.04, baseRingRadius * 0.38);
    var r  = (sizeRelative * minDim) * 0.5;
    var dx = mx - bx;
    var dy = my - by;
    return dx*dx + dy*dy <= r*r * 1.4;
  });
}

// ================================================================
// onVillageHover
// ================================================================
function onVillageHover(e) {
  var rect = canvas.getBoundingClientRect();
  var loc  = getLocAt(e.clientX - rect.left, e.clientY - rect.top);
  hoveredLoc = loc ? loc.id : null;
  canvas.style.cursor = loc ? 'pointer' : 'default';

  var tip = document.getElementById('locTooltip');
  if (loc && tip) {
    var nativeLang = (window.S && window.S.nativeLang) ? window.S.nativeLang : 'en';
    var nm = (LOC_NAMES[loc.id] && LOC_NAMES[loc.id][nativeLang]) ? LOC_NAMES[loc.id][nativeLang] : loc.id;
    var ds = (LOC_DESC[loc.id]  && LOC_DESC[loc.id][nativeLang])  ? LOC_DESC[loc.id][nativeLang]  : '';
    var weather = WEATHER_ICONS[currentWeather] || '';
    tip.innerHTML = '<strong style="color:var(--gold)">' + weather + ' ' + nm + '</strong>' +
                    (ds ? '<br><span style="color:var(--dim);font-size:0.78rem">' + ds + '</span>' : '');
    var dpr    = window.devicePixelRatio || 1;
    var cW     = canvas.width  / dpr;
    var cH     = canvas.height / dpr;
    var cx2    = cW * 0.5;
    var cy2    = cH * 0.5;
    var minDim = Math.min(cW, cH) * 0.90;
    var centerX = (loc._ringX !== undefined) ? loc._ringX : (loc.x + loc.w / 2);
    var centerY = (loc._ringY !== undefined) ? loc._ringY : (loc.y + loc.h / 2);
    tip.style.left = (cx2 + (centerX - 0.5) * minDim) + 'px';
    tip.style.top  = (cy2 + (centerY - 0.5) * minDim - 60) + 'px';
    tip.classList.add('show');
  } else if (tip) {
    tip.classList.remove('show');
  }
}

// ================================================================
// onVillageClick
// ================================================================
function onVillageClick(e) {
  var rect = canvas.getBoundingClientRect();
  var loc  = getLocAt(e.clientX - rect.left, e.clientY - rect.top);
  if (!loc) return;

  var xpReq = LOC_XP_REQUIREMENTS ? (LOC_XP_REQUIREMENTS[loc.id] || 0) : 0;
  if ((S.xp||0) < xpReq) {
    showNotif('🔒 ' + ((LOC_NAMES[loc.id]&&LOC_NAMES[loc.id][S.nativeLang||'fr'])||loc.id) + ' — ' + xpReq + ' XP requis');
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
    var destX = (loc._ringX !== undefined) ? loc._ringX : (loc.x + loc.w/2);
    var destY = (loc._ringY !== undefined) ? loc._ringY : (loc.y + loc.h/2);
    startPlayerWalk(destX, destY, (LOC_NAMES[loc.id]?LOC_NAMES[loc.id][S.nativeLang||'fr']:loc.id), goToLoc);
  } else {
    goToLoc();
  }
}

// ================================================================
// onVillageTouch
// ================================================================
function onVillageTouch(e) {
  e.preventDefault();
  var rect = canvas.getBoundingClientRect();
  var t    = e.touches[0];
  var loc  = getLocAt(t.clientX - rect.left, t.clientY - rect.top);
  if (!loc) return;

  var xpReq = LOC_XP_REQUIREMENTS ? (LOC_XP_REQUIREMENTS[loc.id] || 0) : 0;
  if ((S.xp||0) < xpReq) {
    showNotif('🔒 ' + ((LOC_NAMES[loc.id]&&LOC_NAMES[loc.id][S.nativeLang||'fr'])||loc.id) + ' — ' + xpReq + ' XP requis');
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
    var destX = (loc._ringX !== undefined) ? loc._ringX : (loc.x + loc.w/2);
    var destY = (loc._ringY !== undefined) ? loc._ringY : (loc.y + loc.h/2);
    startPlayerWalk(destX, destY, (LOC_NAMES[loc.id]?LOC_NAMES[loc.id][S.nativeLang||'fr']:loc.id), goToLoc);
  } else {
    goToLoc();
  }
}

// ================================================================
// XP requis par lieu
// ================================================================
var LOC_XP_REQUIREMENTS = {
  church:   0,   school:  0,   friends: 0,
  market:   50,  tavern:  50,  park:    50,
  hospital: 150, bank:    150, station: 150,
  police:   300, factory: 300, cinema:  400,
};

// ================================================================
// loadLocation
// ================================================================
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
      '<div class="npc-role">' + role + '</div>' +
      '</div>' +
      '<div class="npc-go">💬</div>' +
      '</div>';
  }).join('');

  if (typeof openMissionsPanel === 'function') openMissionsPanel(loc.id);
}
