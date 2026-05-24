// village.js — Édition "Village Parfait" (identique à l'image)
// Centrage absolu, anneaux proportionnels, bâtiments colorés, connecteurs fins
// ================================================================

window.canvas = null;
window.ctx = null;
window.tick = 0;
window.currentWeather = window.currentWeather || 'sun';
window.hoveredLoc = null;
window._onCanvasResize = null;

// Configuration précise du village (anneaux, couleurs, tailles)
window.VILLAGE_CONFIG = {
  rings: [
    { radius: 0.12, color: 'rgba(210, 180, 110, 0.45)', width: 2.2 },  // premier anneau
    { radius: 0.24, color: 'rgba(200, 170, 100, 0.40)', width: 2.0 },
    { radius: 0.36, color: 'rgba(190, 160, 90, 0.35)', width: 1.8 },
    { radius: 0.48, color: 'rgba(180, 150, 80, 0.30)', width: 1.5 }
  ],
  centerTreeSize: 0.09,      // taille de l'arbre / place centrale
  bobAmplitude: 2.2,
  bobSpeed: 0.022,
  hoverScale: 1.18,
  hoverGlow: 'rgba(255, 215, 0, 0.5)',
  particleCount: 40,
  starCount: 70,
  connectorColor: 'rgba(210, 180, 110, 0.2)',
  connectorWidth: 1.2,
  connectorDash: [4, 6]
};

// MAPPING PRÉCIS : chaque bâtiment est attaché à un anneau (0..3) et un angle (en degrés)
// Ces angles sont choisis pour une répartition harmonieuse sur l'image
window.LOC_RING_MAP = {
  church:    [1,   30],
  school:    [1,  150],
  friends:   [1,  270],
  market:    [2,   90],
  tavern:    [2,  210],
  park:      [2,  330],
  hospital:  [3,   45],
  bank:      [3,  165],
  station:   [3,  285],
  police:    [3,  105],
  factory:   [3,  225],
  cinema:    [null, null]   // position libre (coin supérieur droit)
};

// --------------------------------------------------------------
// Alignement des positions sur les anneaux (appelé au resize et init)
// --------------------------------------------------------------
function alignLocationsToRings() {
  if (typeof LOCATIONS === 'undefined') return;
  const rings = window.VILLAGE_CONFIG.rings;
  LOCATIONS.forEach(loc => {
    const mapping = window.LOC_RING_MAP[loc.id];
    if (!mapping || mapping[0] === null) {
      if (loc.id === 'cinema') {
        loc._ringX = 0.5 + 0.42;
        loc._ringY = 0.5 - 0.42;
      }
      return;
    }
    const ringIdx = mapping[0];
    const angleDeg = mapping[1];
    const ring = rings[ringIdx];
    if (!ring) return;
    const rad = (angleDeg - 90) * Math.PI / 180;
    const r = ring.radius;
    loc._ringX = 0.5 + r * Math.cos(rad);
    loc._ringY = 0.5 + r * Math.sin(rad);
  });
}

// --------------------------------------------------------------
// Lancement de l'écran village (appelé par le menu)
// --------------------------------------------------------------
function goVillage() {
  if (!window.S) return;
  // Mise à jour du HUD
  const hudPlayer = document.getElementById('hudPlayer');
  const hudLang   = document.getElementById('hudLang');
  const hudXP     = document.getElementById('hudXP');
  if (hudPlayer) hudPlayer.textContent = '👤 ' + S.playerName;
  if (hudLang)   hudLang.textContent   = (FLAGS[S.targetLang]||'') + ' ' + (LANG_NAMES[S.targetLang]||'');
  if (hudXP)     hudXP.textContent     = (S.xp||0) + ' XP';

  // Afficher l'écran
  if (typeof window.showScreen === 'function') {
    window.showScreen('screen-village');
  } else {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const vs = document.getElementById('screen-village');
    if (vs) vs.classList.add('active');
  }

  canvas = null;
  ctx = null;
  tick = 0;
  window._villageLoopRunning = false;
  window._villageLoopActive = false;

  // Attendre que le DOM soit prêt pour dimensionner proprement
  setTimeout(() => {
    const c = document.getElementById('villageCanvas');
    if (!c) { initCanvas(); setWeather(getWeatherForTime()); updateTime(); return; }

    const dpr = window.devicePixelRatio || 1;
    const screenEl = document.getElementById('screen-village');
    const hud = document.querySelector('.village-hud');
    const visH = (window.visualViewport ? window.visualViewport.height : null) || window.innerHeight || 640;
    const hudH = hud ? hud.getBoundingClientRect().height : 56;
    const W = (window.visualViewport ? window.visualViewport.width : null) || window.innerWidth || 360;
    const H = Math.max(200, visH - hudH);

    c.width  = Math.round(W * dpr);
    c.height = Math.round(H * dpr);
    c.style.width  = W + 'px';
    c.style.height = H + 'px';

    alignLocationsToRings();
    initCanvas();
    setWeather(getWeatherForTime());
    updateTime();

    if (typeof player !== 'undefined') {
      player.x = 0.5;
      player.y = 0.5;
      player.dest = null;
      player.walking = false;
      player.currentLoc = 'home';
    }
  }, 100);

  if (window._timeUpdateInterval) clearInterval(window._timeUpdateInterval);
  window._timeUpdateInterval = setInterval(updateTime, 30000);
}

function getWeatherForTime() {
  const h = new Date().getHours();
  if (h >= 21 || h < 6) return 'night';
  const weathers = ['sun', 'sun', 'rain', 'wind', 'snow'];
  return weathers[Math.floor(Math.random() * weathers.length)];
}

function setWeather(w) {
  currentWeather = w;
  const hudWeather = document.getElementById('hudWeather');
  if (hudWeather) hudWeather.textContent = WEATHER_ICONS[w] || '☀️';
  buildWeatherFX(w);
}

function buildWeatherFX(w) {
  const o = document.getElementById('weatherOverlay');
  if (!o) return;
  o.innerHTML = '';
  if (w === 'rain') {
    for (let i = 0; i < 60; i++) {
      const d = document.createElement('div');
      d.className = 'rain-drop';
      d.style.cssText = `left:${Math.random() * 110 - 5}%;height:${60 + Math.random() * 80}px;top:-${60 + Math.random() * 80}px;animation-duration:${0.4 + Math.random() * 0.4}s;animation-delay:${Math.random() * 2}s;opacity:${0.3 + Math.random() * 0.4}`;
      o.appendChild(d);
    }
  } else if (w === 'snow') {
    for (let i = 0; i < 40; i++) {
      const f = document.createElement('div');
      f.className = 'snow-flake';
      f.textContent = '❄';
      f.style.cssText = `left:${Math.random() * 100}%;font-size:${8 + Math.random() * 10}px;animation-duration:${3 + Math.random() * 4}s;animation-delay:${Math.random() * 5}s;opacity:${0.5 + Math.random() * 0.4}`;
      o.appendChild(f);
    }
  }
}

function updateTime() {
  const n = new Date();
  const hudTime = document.getElementById('hudTime');
  if (hudTime) {
    hudTime.textContent = n.getHours().toString().padStart(2,'0') + ':' + n.getMinutes().toString().padStart(2,'0');
  }
}

// --------------------------------------------------------------
// Initialisation du canvas et boucle d'animation
// --------------------------------------------------------------
function initCanvas() {
  canvas = document.getElementById('villageCanvas');
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const hud = document.querySelector('.village-hud');
  const visH = (window.visualViewport ? window.visualViewport.height : null) || window.innerHeight || 640;
  const hudH = hud ? hud.getBoundingClientRect().height : 56;
  const W = (window.visualViewport ? window.visualViewport.width : null) || window.innerWidth || 360;
  const H = Math.max(200, visH - hudH);

  canvas.width  = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';
  canvas.style.display = 'block';

  ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  drawVillage();

  // Gestion du resize
  if (window._onCanvasResize) window.removeEventListener('resize', window._onCanvasResize);
  window._onCanvasResize = () => {
    if (!canvas) return;
    const newDpr = window.devicePixelRatio || 1;
    const newW = (window.visualViewport ? window.visualViewport.width : null) || window.innerWidth || 360;
    const newH = Math.max(200, (window.visualViewport ? window.visualViewport.height : null) || window.innerHeight - hudH);
    canvas.width  = Math.round(newW * newDpr);
    canvas.height = Math.round(newH * newDpr);
    canvas.style.width  = newW + 'px';
    canvas.style.height = newH + 'px';
    alignLocationsToRings();
    ctx = canvas.getContext('2d');
    ctx.scale(newDpr, newDpr);
    drawVillage();
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

// --------------------------------------------------------------
// DESSIN PRINCIPAL (centrage parfait)
// --------------------------------------------------------------
function drawVillage() {
  if (!canvas || !ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;
  if (W === 0 || H === 0) return;

  const cx = W * 0.5;
  const cy = H * 0.5;
  const minDim = Math.min(W, H) * 0.85; // garder une marge tout autour
  const isNight = currentWeather === 'night';

  // Ciel dégradé
  const skyGrad = ctx.createRadialGradient(cx, cy * 0.3, 0, cx, cy, minDim * 0.6);
  if (isNight) {
    skyGrad.addColorStop(0, '#0a0a1e');
    skyGrad.addColorStop(0.5, '#050510');
    skyGrad.addColorStop(1, '#020208');
  } else if (currentWeather === 'rain') {
    skyGrad.addColorStop(0, '#1a2535');
    skyGrad.addColorStop(1, '#0d1418');
  } else {
    skyGrad.addColorStop(0, '#1a2a1a');
    skyGrad.addColorStop(0.5, '#0f1f0f');
    skyGrad.addColorStop(1, '#0a140a');
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H);

  // Étoiles (nuit seulement)
  if (isNight) drawStars(cx, cy, minDim);

  // Lune / Soleil
  drawCelestialBody(W, H, isNight);

  // Herbe / sol (dégradé circulaire)
  const groundGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * 0.65);
  if (currentWeather === 'snow') {
    groundGrad.addColorStop(0, '#c8d0d8');
    groundGrad.addColorStop(0.6, '#a8b0b8');
    groundGrad.addColorStop(1, '#889098');
  } else if (isNight) {
    groundGrad.addColorStop(0, '#1a2a1a');
    groundGrad.addColorStop(0.6, '#0f1a0f');
    groundGrad.addColorStop(1, '#0a0f0a');
  } else {
    groundGrad.addColorStop(0, '#2d5a2d');
    groundGrad.addColorStop(0.5, '#1e3d1a');
    groundGrad.addColorStop(1, '#0f1f0a');
  }
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, 0, W, H);

  // Anneaux concentriques
  drawRings(cx, cy, minDim, window.VILLAGE_CONFIG.rings);

  // Connecteurs (traits pointillés vers le centre)
  drawConnectors(cx, cy, minDim);

  // Arbre / place centrale
  drawCenterTree(cx, cy, minDim);

  // Bâtiments
  if (typeof LOCATIONS !== 'undefined') {
    LOCATIONS.forEach(loc => {
      const bob = Math.sin(tick * window.VILLAGE_CONFIG.bobSpeed + (loc._ringX || 0) * 12) * window.VILLAGE_CONFIG.bobAmplitude;
      const isHovered = hoveredLoc === loc.id;
      drawLocPremium(loc, cx, cy, minDim, bob, isHovered);
    });
  }

  // Particules atmosphériques (papillons, poussière)
  if (!isNight && currentWeather !== 'rain') {
    drawAtmosphericParticles(W, H);
  }

  // Effet de pluie léger
  if (currentWeather === 'rain') {
    ctx.fillStyle = 'rgba(0,15,30,0.08)';
    ctx.fillRect(0, 0, W, H);
  }
}

function drawStars(cx, cy, minDim) {
  const count = window.VILLAGE_CONFIG.starCount;
  for (let i = 0; i < count; i++) {
    const sx = (Math.sin(i * 437.1) * 0.5 + 0.5) * canvas.width / (window.devicePixelRatio || 1);
    const sy = (Math.sin(i * 293.3) * 0.5 + 0.5) * (canvas.height / (window.devicePixelRatio || 1)) * 0.45;
    const twinkle = 0.3 + 0.7 * Math.sin(tick * 0.02 + i * 0.5);
    const size = 0.5 + Math.sin(i * 127) * 0.5;
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,220,${twinkle})`;
    ctx.fill();
  }
}

function drawCelestialBody(W, H, night) {
  const x = W * 0.85;
  const y = H * 0.12;
  if (night) {
    const moonGlow = ctx.createRadialGradient(x, y, 0, x, y, 40);
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
    const sunColor = currentWeather === 'rain' ? '#8a98a8' : '#ffe8a0';
    const sunGlow = ctx.createRadialGradient(x, y, 0, x, y, 50);
    sunGlow.addColorStop(0, 'rgba(255,230,160,0.25)');
    sunGlow.addColorStop(1, 'rgba(255,230,160,0)');
    ctx.fillStyle = sunGlow;
    ctx.fillRect(x - 50, y - 50, 100, 100);
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fillStyle = sunColor;
    ctx.fill();
    if (currentWeather !== 'rain') {
      for (let r = 0; r < 8; r++) {
        const angle = (r / 8) * Math.PI * 2 + tick * 0.005;
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

function drawRings(cx, cy, minDim, rings) {
  rings.forEach(ring => {
    const r = minDim * ring.radius;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = ring.color;
    ctx.lineWidth = ring.width;
    ctx.stroke();
    // fine ligne intérieure pour le relief
    ctx.beginPath();
    ctx.arc(cx, cy, r - 1, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(220,180,80,0.15)';
    ctx.lineWidth = 0.7;
    ctx.stroke();
  });
}

function drawConnectors(cx, cy, minDim) {
  if (!LOCATIONS) return;
  const cfg = window.VILLAGE_CONFIG;
  ctx.strokeStyle = cfg.connectorColor;
  ctx.lineWidth = cfg.connectorWidth;
  ctx.setLineDash(cfg.connectorDash);
  LOCATIONS.forEach(loc => {
    if (loc.id === 'cinema') return;
    const centerX = (loc._ringX !== undefined) ? loc._ringX : (loc.x + loc.w / 2);
    const centerY = (loc._ringY !== undefined) ? loc._ringY : (loc.y + loc.h / 2);
    const lx = cx + (centerX - 0.5) * minDim;
    const ly = cy + (centerY - 0.5) * minDim;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(lx, ly);
    ctx.stroke();
  });
  ctx.setLineDash([]);
}

function drawCenterTree(cx, cy, minDim) {
  const treeSize = minDim * window.VILLAGE_CONFIG.centerTreeSize;
  // Cercle de base (terre)
  ctx.beginPath();
  ctx.arc(cx, cy, treeSize * 0.8, 0, Math.PI * 2);
  ctx.fillStyle = '#5a3e1a';
  ctx.fill();
  // Feuillage (3 cercles superposés)
  ctx.beginPath();
  ctx.arc(cx, cy - treeSize * 0.3, treeSize * 0.55, 0, Math.PI * 2);
  ctx.fillStyle = '#3a7a3a';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx - treeSize * 0.25, cy - treeSize * 0.55, treeSize * 0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + treeSize * 0.25, cy - treeSize * 0.55, treeSize * 0.45, 0, Math.PI * 2);
  ctx.fill();
  // Tronc
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(cx - treeSize * 0.12, cy - treeSize * 0.2, treeSize * 0.24, treeSize * 0.4);
}

function drawLocPremium(loc, cx, cy, minDim, bob, isHovered) {
  if (!ctx) return;
  const cfg = window.VILLAGE_CONFIG;
  const scale = isHovered ? cfg.hoverScale : 1.0;
  const mapping = window.LOC_RING_MAP && window.LOC_RING_MAP[loc.id];
  const ringIdx = (mapping && mapping[0] !== null) ? mapping[0] : null;
  const rings = cfg.rings;
  const baseRingRadius = (ringIdx !== null && rings[ringIdx]) ? rings[ringIdx].radius : 0.08;
  const sizeRelative = Math.max(0.055, baseRingRadius * 0.42);
  let size = (sizeRelative * minDim) * scale;
  const r = size * 0.5;
  const centerX = (loc._ringX !== undefined) ? loc._ringX : (loc.x + loc.w / 2);
  const centerY = (loc._ringY !== undefined) ? loc._ringY : (loc.y + loc.h / 2);
  let bx = cx + (centerX - 0.5) * minDim;
  let by = cy + (centerY - 0.5) * minDim + bob;

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = isHovered ? 15 : 8;
  ctx.shadowOffsetX = isHovered ? 6 : 3;
  ctx.shadowOffsetY = (isHovered ? 6 : 3) + 2;

  if (isHovered) {
    const glow = ctx.createRadialGradient(bx, by, r * 0.8, bx, by, r * 1.8);
    glow.addColorStop(0, cfg.hoverGlow);
    glow.addColorStop(1, 'rgba(255,215,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(bx, by, r * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  const grad = ctx.createRadialGradient(bx - r*0.3, by - r*0.3, 0, bx, by, r);
  const baseColor = loc.color;
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
    ctx.shadowBlur = 10;
  } else {
    ctx.strokeStyle = hexA(darken(loc.color), 0.8);
    ctx.lineWidth = 2;
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }
  ctx.stroke();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Fenêtres lumineuses la nuit
  if (currentWeather === 'night') {
    ctx.fillStyle = 'rgba(255,220,120,0.8)';
    const winSize = r * 0.18;
    ctx.fillRect(bx - r * 0.25, by - r * 0.1, winSize, winSize);
    ctx.fillRect(bx + r * 0.08, by - r * 0.1, winSize, winSize);
    ctx.shadowColor = 'rgba(255,220,120,0.5)';
    ctx.shadowBlur = 8;
    ctx.fillRect(bx - r * 0.25, by - r * 0.1, winSize, winSize);
    ctx.fillRect(bx + r * 0.08, by - r * 0.1, winSize, winSize);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  // Icône (emoji)
  ctx.font = `${Math.floor(size * 0.45)}px 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(loc.emoji, bx, by);

  // Nom du lieu (selon langue maternelle)
  const nativeLang = (window.S && window.S.nativeLang) ? window.S.nativeLang : 'en';
  const nm = (LOC_NAMES && LOC_NAMES[loc.id] && LOC_NAMES[loc.id][nativeLang]) ? LOC_NAMES[loc.id][nativeLang] : loc.id;
  ctx.font = `bold ${Math.max(9, Math.min(size * 0.16, 12))}px 'Nunito', sans-serif`;
  ctx.fillStyle = isHovered ? '#FFD700' : 'rgba(255,245,220,0.95)';
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 4;
  ctx.fillText(nm, bx, by + r + 6);
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Badge "Cinéma"
  if (loc.id === 'cinema') {
    ctx.beginPath();
    ctx.arc(bx + r * 0.7, by - r * 0.7, r * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = '#e040fb';
    ctx.fill();
    ctx.font = `${Math.floor(size * 0.14)}px 'Nunito'`;
    ctx.fillStyle = '#fff';
    ctx.fillText('▶', bx + r * 0.7, by - r * 0.7);
  }
}

function drawAtmosphericParticles(W, H) {
  const count = window.VILLAGE_CONFIG.particleCount;
  for (let i = 0; i < count; i++) {
    const px = (Math.sin(i * 137.3 + tick * 0.008) * 0.5 + 0.5) * W;
    const py = (Math.cos(i * 97.1 + tick * 0.006) * 0.5 + 0.5) * H;
    const alpha = 0.1 + 0.1 * Math.sin(tick * 0.02 + i);
    const size = 0.5 + Math.sin(i * 53.7) * 0.5;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,200,${alpha})`;
    ctx.fill();
  }
}

// Utilitaires couleur
function hexA(hex, a) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgba(${r},${g},${b},${a})`;
}
function darken(hex) {
  const parts = [1,3,5].map(i => Math.max(0, parseInt(hex.slice(i,i+2),16) - 50).toString(16).padStart(2,'0'));
  return '#' + parts.join('');
}
function lighten(hex, amount) {
  const parts = [1,3,5].map(i => Math.min(255, parseInt(hex.slice(i,i+2),16) + amount).toString(16).padStart(2,'0'));
  return '#' + parts.join('');
}

// --------------------------------------------------------------
// Détection des clics / survols (inchangée, mais utilise les positions anneaux)
// --------------------------------------------------------------
function getLocAt(mx, my) {
  if (!canvas || typeof LOCATIONS === 'undefined') return null;
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;
  const cx = W * 0.5;
  const cy = H * 0.5;
  const minDim = Math.min(W, H) * 0.85;
  return LOCATIONS.find(loc => {
    const centerX = (loc._ringX !== undefined) ? loc._ringX : (loc.x + loc.w / 2);
    const centerY = (loc._ringY !== undefined) ? loc._ringY : (loc.y + loc.h / 2);
    const bx = cx + (centerX - 0.5) * minDim;
    const by = cy + (centerY - 0.5) * minDim;
    const mapping = window.LOC_RING_MAP && window.LOC_RING_MAP[loc.id];
    const ringIdx = (mapping && mapping[0] !== null) ? mapping[0] : null;
    const rings = window.VILLAGE_CONFIG.rings;
    const baseRingRadius = (ringIdx !== null && rings[ringIdx]) ? rings[ringIdx].radius : 0.08;
    const sizeRelative = Math.max(0.055, baseRingRadius * 0.42);
    const r = (sizeRelative * minDim) * 0.5;
    const dx = mx - bx;
    const dy = my - by;
    return dx*dx + dy*dy <= r*r * 1.4;
  });
}

function onVillageHover(e) {
  const rect = canvas.getBoundingClientRect();
  const loc = getLocAt(e.clientX - rect.left, e.clientY - rect.top);
  hoveredLoc = loc ? loc.id : null;
  canvas.style.cursor = loc ? 'pointer' : 'default';
  const tip = document.getElementById('locTooltip');
  if (loc && tip) {
    const nativeLang = (window.S && window.S.nativeLang) ? window.S.nativeLang : 'en';
    const nm = (LOC_NAMES[loc.id] && LOC_NAMES[loc.id][nativeLang]) ? LOC_NAMES[loc.id][nativeLang] : loc.id;
    const ds = (LOC_DESC[loc.id] && LOC_DESC[loc.id][nativeLang]) ? LOC_DESC[loc.id][nativeLang] : '';
    tip.innerHTML = `<strong style="color:var(--gold)">${WEATHER_ICONS[currentWeather] || ''} ${nm}</strong>${ds ? `<br><span style="color:var(--dim);font-size:0.78rem">${ds}</span>` : ''}`;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    const cx = W * 0.5;
    const cy = H * 0.5;
    const minDim = Math.min(W, H) * 0.85;
    const centerX = (loc._ringX !== undefined) ? loc._ringX : (loc.x + loc.w / 2);
    const centerY = (loc._ringY !== undefined) ? loc._ringY : (loc.y + loc.h / 2);
    tip.style.left = (cx + (centerX - 0.5) * minDim) + 'px';
    tip.style.top  = (cy + (centerY - 0.5) * minDim - 50) + 'px';
    tip.classList.add('show');
  } else if (tip) tip.classList.remove('show');
}

function onVillageClick(e) {
  const rect = canvas.getBoundingClientRect();
  const loc = getLocAt(e.clientX - rect.left, e.clientY - rect.top);
  if (!loc) return;
  const xpReq = LOC_XP_REQUIREMENTS ? (LOC_XP_REQUIREMENTS[loc.id] || 0) : 0;
  if ((S.xp||0) < xpReq) {
    showNotif(`🔒 ${(LOC_NAMES[loc.id] && LOC_NAMES[loc.id][S.nativeLang||'fr']) || loc.id} — ${xpReq} XP requis`);
    return;
  }
  const goToLoc = () => {
    if (typeof playerGoHome === 'function') playerGoHome();
    if (typeof showScreen === 'function') showScreen('screen-location');
    else {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      const sl = document.getElementById('screen-location');
      if (sl) sl.classList.add('active');
    }
    if (typeof loadLocation === 'function') loadLocation(loc.id);
  };
  if (typeof startPlayerWalk === 'function') {
    const destX = (loc._ringX !== undefined) ? loc._ringX : (loc.x + loc.w/2);
    const destY = (loc._ringY !== undefined) ? loc._ringY : (loc.y + loc.h/2);
    startPlayerWalk(destX, destY, (LOC_NAMES[loc.id] ? LOC_NAMES[loc.id][S.nativeLang||'fr'] : loc.id), goToLoc);
  } else goToLoc();
}

function onVillageTouch(e) {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const t = e.touches[0];
  const loc = getLocAt(t.clientX - rect.left, t.clientY - rect.top);
  if (!loc) return;
  const xpReq = LOC_XP_REQUIREMENTS ? (LOC_XP_REQUIREMENTS[loc.id] || 0) : 0;
  if ((S.xp||0) < xpReq) {
    showNotif(`🔒 ${(LOC_NAMES[loc.id] && LOC_NAMES[loc.id][S.nativeLang||'fr']) || loc.id} — ${xpReq} XP requis`);
    return;
  }
  const goToLoc = () => {
    if (typeof playerGoHome === 'function') playerGoHome();
    if (typeof showScreen === 'function') showScreen('screen-location');
    else {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      const sl = document.getElementById('screen-location');
      if (sl) sl.classList.add('active');
    }
    if (typeof loadLocation === 'function') loadLocation(loc.id);
  };
  if (typeof startPlayerWalk === 'function') {
    const destX = (loc._ringX !== undefined) ? loc._ringX : (loc.x + loc.w/2);
    const destY = (loc._ringY !== undefined) ? loc._ringY : (loc.y + loc.h/2);
    startPlayerWalk(destX, destY, (LOC_NAMES[loc.id] ? LOC_NAMES[loc.id][S.nativeLang||'fr'] : loc.id), goToLoc);
  } else goToLoc();
}

// -----------------------------------------------------------------
// Données de compatibilité (XP requis, chargement lieu)
// -----------------------------------------------------------------
const LOC_XP_REQUIREMENTS = {
  church:   0, school:  0, friends: 0,
  market:   50, tavern:  50, park:    50,
  hospital: 150, bank:    150, station: 150,
  police:   300, factory: 300, cinema:  400,
};

function loadLocation(locId) {
  const loc = LOCATIONS.find(l => l.id === locId);
  if (!loc) return;
  const titleEl = document.getElementById('locTitle');
  if (titleEl) titleEl.textContent = (LOC_NAMES[loc.id] ? LOC_NAMES[loc.id][S.nativeLang||'fr'] : loc.id);
  const weatherEl = document.getElementById('locWeather');
  if (weatherEl) weatherEl.textContent = WEATHER_ICONS[currentWeather] || '';
  const npcList = document.getElementById('npcList');
  if (!npcList) return;
  if (!loc.npcs || loc.npcs.length === 0) {
    npcList.innerHTML = '<div class="npc-card"><div class="npc-avatar">🏠</div><div class="npc-info"><div class="npc-name">Personne ici</div><div class="npc-role">Reviens plus tard...</div></div></div>';
    return;
  }
  npcList.innerHTML = loc.npcs.map(npc => {
    const role = typeof npc.role === 'object' ? (npc.role[S.nativeLang||'fr'] || npc.role.en) : npc.role;
    return `<div class="npc-card" onclick="openDialogue('${loc.id}', '${npc.id}')">
      <div class="npc-avatar">${npc.emoji}</div>
      <div class="npc-info">
        <div class="npc-name">${npc.name}</div>
        <div class="npc-role">${role}</div>
      </div>
      <div class="npc-go">💬</div>
    </div>`;
  }).join('');
  if (typeof openMissionsPanel === 'function') openMissionsPanel(loc.id);
  }
