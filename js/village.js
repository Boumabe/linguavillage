// village.js — ISOMETRIC EDITION
// LinguaVillage — Vue isométrique avec zones de progression
// Inspiré de l'Image 2 : chemin sinueux, bâtiments par niveau, badges XP
// ================================================================

window.canvas  = null;
window.ctx     = null;
window.tick    = 0;
window.currentWeather = window.currentWeather || 'sun';
window.hoveredLoc     = null;

// ================================================================
// ZONES DE PROGRESSION (alignées sur tes niveaux réels)
// Chaque zone = un niveau CECRL + bâtiments + seuil XP pour débloquer
// ================================================================
window.VILLAGE_ZONES = [
  {
    id: 'zero',
    label:   { fr:'Zéro absolu',  en:'Absolute zero',  es:'Cero absoluto', ht:'Zewo absoli' },
    sublabel:{ fr:'Les bases',    en:'The basics',      es:'Las bases',      ht:'Baz yo' },
    icon: '🌱',
    xpRequired: 0,
    color: '#4ecf70',
    buildings: [
      { id:'park',    emoji:'🌳', label:{ fr:'Parc',    en:'Park',    es:'Parque',  ht:'Pak'    }, xp:0   },
    ]
  },
  {
    id: 'beginner',
    label:   { fr:'Débutant',       en:'Beginner',      es:'Principiante',   ht:'Debitant'     },
    sublabel:{ fr:'Se présenter',   en:'Introduce yourself', es:'Presentarse', ht:'Prezante ou' },
    icon: '⭐',
    xpRequired: 100,
    color: '#4a9eff',
    buildings: [
      { id:'school',  emoji:'🏫', label:{ fr:'École',   en:'School',  es:'Escuela', ht:'Lekòl'  }, xp:100 },
      { id:'church',  emoji:'⛪', label:{ fr:'Église',  en:'Church',  es:'Iglesia', ht:'Legliz' }, xp:150 },
    ]
  },
  {
    id: 'elementary',
    label:   { fr:'Élémentaire',    en:'Elementary',    es:'Elemental',      ht:'Elemantè'     },
    sublabel:{ fr:'Parler au quotidien', en:'Daily conversations', es:'Conversaciones', ht:'Pale chak jou' },
    icon: '📚',
    xpRequired: 300,
    color: '#ffd700',
    buildings: [
      { id:'market',  emoji:'🏪', label:{ fr:'Marché',  en:'Market',  es:'Mercado', ht:'Mache'  }, xp:300 },
      { id:'friends', emoji:'🤝', label:{ fr:'Amis',    en:'Friends', es:'Amigos',  ht:'Zanmi'  }, xp:400 },
    ]
  },
  {
    id: 'intermediate',
    label:   { fr:'Intermédiaire',  en:'Intermediate',  es:'Intermedio',     ht:'Entèmedyè'    },
    sublabel:{ fr:'S\'exprimer avec aisance', en:'Speak with ease', es:'Hablar con fluidez', ht:'Pale avèk fasili' },
    icon: '🎓',
    xpRequired: 600,
    color: '#ff9f43',
    buildings: [
      { id:'tavern',   emoji:'🍺', label:{ fr:'Taverne',en:'Tavern',  es:'Taberna', ht:'Tavèn'  }, xp:600 },
      { id:'bank',     emoji:'🏦', label:{ fr:'Banque', en:'Bank',    es:'Banco',   ht:'Bank'   }, xp:750 },
      { id:'station',  emoji:'🚉', label:{ fr:'Gare',   en:'Station', es:'Estación',ht:'Estasyon'}, xp:900 },
    ]
  },
  {
    id: 'advanced',
    label:   { fr:'Maîtrise',       en:'Mastery',       es:'Maestría',       ht:'Mètrize'      },
    sublabel:{ fr:'Comme un·e natif·ve', en:'Like a native', es:'Como nativo', ht:'Tankou natif' },
    icon: '👑',
    xpRequired: 1000,
    color: '#e040fb',
    buildings: [
      { id:'hospital', emoji:'🏥', label:{ fr:'Hôpital',en:'Hospital',es:'Hospital', ht:'Lopital' }, xp:1000 },
      { id:'cinema',   emoji:'🎬', label:{ fr:'Cinéma', en:'Cinema',  es:'Cine',    ht:'Sinema'  }, xp:1500 },
    ]
  }
];

// ================================================================
// ÉTAT ISOMÉTRIQUE
// ================================================================
var _isoState = {
  scrollX:     0,       // décalage horizontal actuel (px logiques)
  targetScrollX: 0,     // cible pour l'animation fluide
  isDragging:  false,
  dragStartX:  0,
  dragScrollX: 0,
  hoveredBuilding: null,
  hoveredZone:     null,
  particles:       [],
  clouds:          [],
  initialized:     false,
};

// ================================================================
// POINT D'ENTRÉE PRINCIPAL
// ================================================================
function goVillage() {
  if (!window.S) return;

  // Mettre à jour le HUD
  var hudPlayer  = document.getElementById('hudPlayer');
  var hudLang    = document.getElementById('hudLang');
  var hudXP      = document.getElementById('hudXP');
  if (hudPlayer) hudPlayer.textContent = '👤 ' + (S.playerName || '');
  if (hudLang)   hudLang.textContent   = ((FLAGS && FLAGS[S.targetLang]) || '') + ' ' + ((LANG_NAMES && LANG_NAMES[S.targetLang]) || '');
  if (hudXP)     hudXP.textContent     = (S.xp || 0) + ' XP';

  if (typeof window.showScreen === 'function') {
    window.showScreen('screen-village');
  } else {
    document.querySelectorAll('.screen').forEach(function(s) {
      s.classList.remove('active'); s.style.display = '';
    });
    var vs = document.getElementById('screen-village');
    if (vs) vs.classList.add('active');
  }

  canvas = null; ctx = null; tick = 0;
  window._villageLoopRunning = false;
  window._villageLoopActive  = false;
  _isoState.initialized = false;

  // Scroll initial : positionner sur la zone correspondant au niveau XP actuel
  var xp = (window.S && S.xp) || 0;
  var zoneIdx = 0;
  window.VILLAGE_ZONES.forEach(function(z, i) {
    if (xp >= z.xpRequired) zoneIdx = i;
  });
  _isoState.scrollX       = 0;
  _isoState.targetScrollX = 0;

  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      _initIsoCanvas();
      _buildNavBar();
      setTimeout(function() { _scrollToZone(zoneIdx, true); }, 200);
    });
  });

  if (window._timeUpdateInterval) clearInterval(window._timeUpdateInterval);
  window._timeUpdateInterval = setInterval(updateTime, 30000);
  if (typeof updateTime === 'function') updateTime();
}

// ================================================================
// INIT CANVAS
// ================================================================
function _initIsoCanvas() {
  var c = document.getElementById('villageCanvas');
  if (!c) return;

  var dpr     = window.devicePixelRatio || 1;
  var wrapper = document.querySelector('.village-canvas-wrap') || document.getElementById('screen-village');
  var rect    = wrapper ? wrapper.getBoundingClientRect() : null;
  var W, H;

  if (rect && rect.width > 0 && rect.height > 0) {
    W = Math.floor(rect.width);
    H = Math.floor(rect.height);
  } else {
    var hud  = document.querySelector('.village-hud');
    var nav  = document.querySelector('.village-nav-bar');
    var hudH = (hud ? hud.getBoundingClientRect().height : 52)
             + (nav ? nav.getBoundingClientRect().height : 56);
    var visH = (window.visualViewport ? window.visualViewport.height : null) || window.innerHeight || 640;
    W = (window.visualViewport ? window.visualViewport.width : null) || window.innerWidth || 360;
    H = Math.max(200, Math.floor(visH - hudH));
  }

  c.width        = W * dpr;
  c.height       = H * dpr;
  c.style.width  = W + 'px';
  c.style.height = H + 'px';
  c.style.display= 'block';
  c.style.cursor = 'grab';

  // Générer les nuages et particules
  _isoState.clouds = _genClouds(W, H);
  _isoState.particles = [];
  _isoState.initialized = true;

  // Événements
  c.removeEventListener('click',      _onIsoClick);
  c.removeEventListener('mousemove',  _onIsoHover);
  c.removeEventListener('touchstart', _onIsoTouchStart);
  c.removeEventListener('touchmove',  _onIsoTouchMove);
  c.removeEventListener('touchend',   _onIsoTouchEnd);
  c.removeEventListener('mousedown',  _onIsoMouseDown);
  c.removeEventListener('mousemove',  _onIsoMouseDrag);
  c.removeEventListener('mouseup',    _onIsoMouseUp);

  c.addEventListener('click',      _onIsoClick);
  c.addEventListener('mousemove',  _onIsoHover);
  c.addEventListener('touchstart', _onIsoTouchStart, { passive: false });
  c.addEventListener('touchmove',  _onIsoTouchMove,  { passive: false });
  c.addEventListener('touchend',   _onIsoTouchEnd,   { passive: true  });
  c.addEventListener('mousedown',  _onIsoMouseDown);
  c.addEventListener('mousemove',  _onIsoMouseDrag);
  c.addEventListener('mouseup',    _onIsoMouseUp);

  // Resize
  if (window._onCanvasResize) window.removeEventListener('resize', window._onCanvasResize);
  window._onCanvasResize = function() { _initIsoCanvas(); };
  window.addEventListener('resize', window._onCanvasResize);

  if (!window._villageLoopRunning) {
    window._villageLoopRunning = true;
    window._villageLoopActive  = true;
    requestAnimationFrame(_isoLoop);
  }
}

// ================================================================
// BOUCLE PRINCIPALE
// ================================================================
function _isoLoop() {
  if (!window._villageLoopActive) return;
  tick++;
  // Interpolation fluide du scroll
  _isoState.scrollX += (_isoState.targetScrollX - _isoState.scrollX) * 0.10;
  _drawIsoVillage();
  requestAnimationFrame(_isoLoop);
}

// ================================================================
// RENDU PRINCIPAL
// ================================================================
function _drawIsoVillage() {
  if (!canvas || !ctx) {
    canvas = document.getElementById('villageCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
  }
  var dpr = window.devicePixelRatio || 1;
  var W   = canvas.width  / dpr;
  var H   = canvas.height / dpr;
  if (W === 0 || H === 0) return;

  ctx.save();
  ctx.scale(dpr, dpr);

  // ── SKY ──────────────────────────────────────────────────────────
  var skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.65);
  var night   = currentWeather === 'night';
  if (night) {
    skyGrad.addColorStop(0, '#060818');
    skyGrad.addColorStop(1, '#0e1630');
  } else if (currentWeather === 'rain') {
    skyGrad.addColorStop(0, '#2a3545');
    skyGrad.addColorStop(1, '#3a4a5a');
  } else {
    skyGrad.addColorStop(0, '#a8d8f0');
    skyGrad.addColorStop(1, '#d4eef8');
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H);

  // ── MONTAGNE (fond) ───────────────────────────────────────────────
  _drawMountains(W, H, night);

  // ── NUAGES ───────────────────────────────────────────────────────
  if (!night) _drawClouds(W, H);

  // ── TERRAIN ISOMÉTRIQUE ───────────────────────────────────────────
  _drawIsoTerrain(W, H);

  // ── CHEMIN ───────────────────────────────────────────────────────
  _drawPath(W, H);

  // ── ZONES ET BÂTIMENTS ───────────────────────────────────────────
  _drawZonesAndBuildings(W, H);

  // ── RIVIÈRE ───────────────────────────────────────────────────────
  _drawRiver(W, H);

  // ── ARBRE DÉCORATIF ───────────────────────────────────────────────
  _drawTrees(W, H);

  // ── PARTICULES ───────────────────────────────────────────────────
  _updateAndDrawParticles(W, H);

  // ── ÉTOILES (nuit) ────────────────────────────────────────────────
  if (night) _drawStarsIso(W, H);

  // ── SOLEIL / LUNE ─────────────────────────────────────────────────
  _drawCelestial(W, H, night);

  ctx.restore();
}

// ================================================================
// CALCUL DES POSITIONS
// ================================================================
function _getTotalWidth(W) {
  // Largeur totale du village (toutes zones)
  return W * 0.38 * window.VILLAGE_ZONES.length + W * 0.18;
}

function _getZoneX(zoneIdx, W) {
  // X du centre de chaque zone, en tenant compte du scroll
  var zoneW  = W * 0.38;
  var startX = W * 0.18;
  return startX + zoneIdx * zoneW - _isoState.scrollX;
}

function _getGroundY(W, H) {
  // Ligne du sol isométrique
  return H * 0.72;
}

function _getBuildingPos(zoneIdx, buildIdx, buildCount, W, H) {
  var zX     = _getZoneX(zoneIdx, W);
  var gY     = _getGroundY(W, H);
  var spread = W * 0.09;
  // Disposition : 1 bâtiment centré, 2+ répartis
  var offset = buildCount === 1 ? 0 :
               buildCount === 2 ? (buildIdx === 0 ? -spread * 0.6 : spread * 0.6) :
               (buildIdx - 1) * spread * 0.7;
  return { x: zX + offset, y: gY - H * 0.01 };
}

// ================================================================
// SCROLL PAR ZONE
// ================================================================
function _scrollToZone(zoneIdx, instant) {
  var c   = document.getElementById('villageCanvas');
  if (!c) return;
  var dpr = window.devicePixelRatio || 1;
  var W   = c.width / dpr;
  var zoneW   = W * 0.38;
  var startX  = W * 0.18;
  var targetX = startX + zoneIdx * zoneW - W * 0.35;
  var maxScroll = _getTotalWidth(W) - W;
  targetX = Math.max(0, Math.min(targetX, maxScroll));
  if (instant) { _isoState.scrollX = targetX; }
  _isoState.targetScrollX = targetX;
}

function _clampScroll(W) {
  var max = Math.max(0, _getTotalWidth(W) - W);
  _isoState.targetScrollX = Math.max(0, Math.min(_isoState.targetScrollX, max));
}

// ================================================================
// DESSIN : MONTAGNES
// ================================================================
function _drawMountains(W, H, night) {
  var cols = night
    ? ['#1a1f35','#141828','#0e121f']
    : ['#7bbf9a','#5ea078','#4a8a62'];
  var peaks = [
    [W*0.05, H*0.38, W*0.22],
    [W*0.18, H*0.28, W*0.18],
    [W*0.55, H*0.33, W*0.20],
    [W*0.70, H*0.25, W*0.22],
    [W*0.88, H*0.31, W*0.19],
    [W*1.05, H*0.29, W*0.17],
  ];
  peaks.forEach(function(p, i) {
    ctx.beginPath();
    ctx.moveTo(p[0] - p[2]*0.5, H*0.58);
    ctx.lineTo(p[0], p[1]);
    ctx.lineTo(p[0] + p[2]*0.5, H*0.58);
    ctx.closePath();
    ctx.fillStyle = cols[i % cols.length];
    ctx.fill();
    // Neige au sommet
    if (!night) {
      ctx.beginPath();
      ctx.moveTo(p[0] - p[2]*0.08, p[1] + p[2]*0.12);
      ctx.lineTo(p[0], p[1]);
      ctx.lineTo(p[0] + p[2]*0.08, p[1] + p[2]*0.12);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,255,255,0.82)';
      ctx.fill();
    }
  });
}

// ================================================================
// DESSIN : NUAGES
// ================================================================
function _genClouds(W, H) {
  var clouds = [];
  for (var i = 0; i < 5; i++) {
    clouds.push({
      x: W * (0.05 + i * 0.22),
      y: H * (0.08 + (i % 3) * 0.06),
      r: 18 + i * 7,
      speed: 0.12 + i * 0.05,
    });
  }
  return clouds;
}

function _drawClouds(W, H) {
  _isoState.clouds.forEach(function(cl) {
    cl.x += cl.speed;
    if (cl.x > W + cl.r * 2) cl.x = -cl.r * 2;
    ctx.save();
    ctx.globalAlpha = 0.72;
    ctx.fillStyle   = '#ffffff';
    [
      [cl.x, cl.y, cl.r],
      [cl.x + cl.r * 0.6, cl.y + cl.r * 0.1, cl.r * 0.75],
      [cl.x - cl.r * 0.6, cl.y + cl.r * 0.15, cl.r * 0.65],
      [cl.x + cl.r * 0.05, cl.y + cl.r * 0.35, cl.r * 0.9],
    ].forEach(function(b) {
      ctx.beginPath();
      ctx.arc(b[0], b[1], b[2], 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  });
}

// ================================================================
// DESSIN : TERRAIN ISOMÉTRIQUE (sol herbeux)
// ================================================================
function _drawIsoTerrain(W, H) {
  var gY = _getGroundY(W, H);
  // Sol principal
  var groundGrad = ctx.createLinearGradient(0, gY - H*0.05, 0, H);
  groundGrad.addColorStop(0,   '#5daf60');
  groundGrad.addColorStop(0.3, '#4a9a52');
  groundGrad.addColorStop(1,   '#3a8040');
  ctx.fillStyle = groundGrad;
  ctx.beginPath();
  ctx.moveTo(0, gY - H * 0.04);
  ctx.bezierCurveTo(W*0.25, gY - H*0.08, W*0.75, gY + H*0.02, W, gY - H*0.03);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();

  // Lisière herbe claire
  ctx.fillStyle = 'rgba(120,210,100,0.25)';
  ctx.beginPath();
  ctx.moveTo(0, gY - H * 0.04);
  ctx.bezierCurveTo(W*0.25, gY - H*0.08, W*0.75, gY + H*0.02, W, gY - H*0.03);
  ctx.lineTo(W, gY + H * 0.015);
  ctx.bezierCurveTo(W*0.75, gY + H*0.035, W*0.25, gY - H*0.065, 0, gY + H*0.01);
  ctx.closePath();
  ctx.fill();
}

// ================================================================
// DESSIN : CHEMIN SINUEUX
// ================================================================
function _drawPath(W, H) {
  var gY    = _getGroundY(W, H);
  var sx    = _isoState.scrollX;
  var total = _getTotalWidth(W);

  // Chemin principal
  ctx.save();
  ctx.strokeStyle = '#c8a870';
  ctx.lineWidth   = W * 0.055;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.moveTo(-sx, gY + H * 0.06);
  var numZones = window.VILLAGE_ZONES.length;
  for (var i = 0; i <= numZones; i++) {
    var px = _getZoneX(i, W);
    var py = gY + H * 0.04 + Math.sin(i * 1.8) * H * 0.025;
    if (i === 0) ctx.moveTo(px - W * 0.25, py);
    else ctx.lineTo(px, py);
  }
  ctx.lineTo(_getZoneX(numZones - 1, W) + W * 0.3, gY + H * 0.04);
  ctx.stroke();

  // Bordures du chemin
  ctx.strokeStyle = '#a07840';
  ctx.lineWidth   = W * 0.057;
  ctx.globalAlpha = 0.3;
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Texture pavés (petits rectangles)
  ctx.fillStyle = 'rgba(180,145,90,0.35)';
  for (var j = 0; j < 60; j++) {
    var px2 = (j / 60) * (total + W) - sx;
    if (px2 < -20 || px2 > W + 20) continue;
    var py2 = gY + H * 0.04 + Math.sin(j * 1.1) * H * 0.025;
    ctx.fillRect(px2 - 5, py2 - 3, 10, 6);
  }
  ctx.restore();
}

// ================================================================
// DESSIN : RIVIÈRE
// ================================================================
function _drawRiver(W, H) {
  var gY = _getGroundY(W, H);
  // Rivière qui coupe le chemin à droite
  var rx = _getZoneX(3, W) + W * 0.12;
  if (rx < -W * 0.1 || rx > W * 1.1) return;

  ctx.save();
  // Corps de la rivière
  var riverGrad = ctx.createLinearGradient(rx - 18, 0, rx + 18, 0);
  riverGrad.addColorStop(0,   '#4a8fb0');
  riverGrad.addColorStop(0.5, '#5db0d5');
  riverGrad.addColorStop(1,   '#4a8fb0');
  ctx.fillStyle = riverGrad;
  ctx.beginPath();
  ctx.moveTo(rx - 18, gY - H * 0.05);
  ctx.bezierCurveTo(rx - 22, gY, rx + 22, gY + H * 0.02, rx + 18, H * 0.92);
  ctx.bezierCurveTo(rx + 28, gY + H * 0.02, rx - 12, gY, rx - 8, gY - H * 0.05);
  ctx.closePath();
  ctx.fill();

  // Reflets
  ctx.globalAlpha = 0.35;
  ctx.fillStyle   = '#a0d8f0';
  for (var r = 0; r < 4; r++) {
    var ry = gY + r * H * 0.06;
    ctx.fillRect(rx - 6 + r * 2, ry, 12 - r * 2, 3);
  }

  // Pont
  ctx.globalAlpha = 1;
  var bridgeY = gY + H * 0.042;
  ctx.fillStyle = '#8b6914';
  ctx.fillRect(rx - 26, bridgeY - 5, 52, 10);
  // Arche du pont
  ctx.strokeStyle = '#6b4a0a';
  ctx.lineWidth   = 2.5;
  ctx.beginPath();
  ctx.arc(rx, bridgeY + 18, 22, Math.PI, 0);
  ctx.stroke();
  // Garde-corps
  ctx.fillStyle = '#a07830';
  for (var p = -3; p <= 3; p++) {
    ctx.fillRect(rx + p * 7 - 2, bridgeY - 14, 4, 10);
  }
  ctx.restore();
}

// ================================================================
// DESSIN : ARBRES DÉCORATIFS
// ================================================================
function _drawTrees(W, H) {
  var gY = _getGroundY(W, H);
  var treePositions = [];
  // Arbres entre les zones
  var numZones = window.VILLAGE_ZONES.length;
  for (var i = 0; i < numZones + 1; i++) {
    var zx = _getZoneX(i, W);
    treePositions.push({ x: zx - W*0.13, y: gY - H*0.005, s: 0.85 });
    treePositions.push({ x: zx + W*0.13, y: gY - H*0.01,  s: 0.75 });
  }
  treePositions.forEach(function(t) {
    if (t.x < -40 || t.x > W + 40) return;
    _drawOneTree(t.x, t.y, t.s, H);
  });
}

function _drawOneTree(x, y, scale, H) {
  var s = scale * H * 0.075;
  // Tronc
  ctx.fillStyle = '#6b4226';
  ctx.fillRect(x - s*0.12, y - s*0.3, s*0.24, s*0.35);
  // Feuillage (3 cercles superposés pour effet 3D)
  [
    { dy:-s*0.25, r:s*0.42, c:'#2d8a3a' },
    { dy:-s*0.52, r:s*0.36, c:'#38a845' },
    { dy:-s*0.76, r:s*0.26, c:'#45c055' },
  ].forEach(function(layer) {
    ctx.beginPath();
    ctx.arc(x, y + layer.dy, layer.r, 0, Math.PI * 2);
    ctx.fillStyle = layer.c;
    ctx.fill();
  });
}

// ================================================================
// DESSIN : ÉTOILES (nuit)
// ================================================================
function _drawStarsIso(W, H) {
  for (var i = 0; i < 55; i++) {
    var sx = (Math.sin(i * 437.1) * 0.5 + 0.5) * W;
    var sy = (Math.sin(i * 293.3) * 0.5 + 0.5) * H * 0.42;
    var tw = 0.3 + 0.7 * Math.sin(tick * 0.018 + i * 0.5);
    ctx.beginPath();
    ctx.arc(sx, sy, 0.5 + Math.sin(i * 127) * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,220,' + tw + ')';
    ctx.fill();
  }
}

// ================================================================
// DESSIN : SOLEIL / LUNE
// ================================================================
function _drawCelestial(W, H, night) {
  var x = W * 0.84, y = H * 0.13;
  if (night) {
    var mg = ctx.createRadialGradient(x, y, 0, x, y, 38);
    mg.addColorStop(0, 'rgba(200,190,140,0.28)');
    mg.addColorStop(1, 'rgba(200,190,140,0)');
    ctx.fillStyle = mg; ctx.fillRect(x-38,y-38,76,76);
    ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI*2);
    ctx.fillStyle = '#f0e6a0'; ctx.fill();
  } else if (currentWeather !== 'rain') {
    var sg = ctx.createRadialGradient(x, y, 0, x, y, 46);
    sg.addColorStop(0, 'rgba(255,230,80,0.32)');
    sg.addColorStop(1, 'rgba(255,230,80,0)');
    ctx.fillStyle = sg; ctx.fillRect(x-46,y-46,92,92);
    ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI*2);
    ctx.fillStyle = '#ffe066'; ctx.fill();
    for (var r = 0; r < 8; r++) {
      var a = (r / 8) * Math.PI * 2 + tick * 0.004;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a)*22, y + Math.sin(a)*22);
      ctx.lineTo(x + Math.cos(a)*30, y + Math.sin(a)*30);
      ctx.strokeStyle = 'rgba(255,220,60,0.4)'; ctx.lineWidth = 2; ctx.stroke();
    }
  }
}

// ================================================================
// DESSIN : ZONES ET BÂTIMENTS (cœur isométrique)
// ================================================================
function _drawZonesAndBuildings(W, H) {
  var gY  = _getGroundY(W, H);
  var xp  = (window.S && S.xp) || 0;
  var nl  = (window.S && S.nativeLang) || 'fr';

  window.VILLAGE_ZONES.forEach(function(zone, zi) {
    var zX       = _getZoneX(zi, W);
    var unlocked = xp >= zone.xpRequired;

    if (zX < -W * 0.4 || zX > W * 1.4) return; // culling

    // ── Ombre de zone ──
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle   = zone.color;
    ctx.beginPath();
    ctx.ellipse(zX, gY + H * 0.04, W * 0.16, H * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // ── Label de zone (en haut) ──
    var zLabel = zone.label[nl] || zone.label.fr;
    var zSub   = zone.sublabel[nl] || zone.sublabel.fr;
    var labelY = gY - H * 0.48;

    // Badge de zone
    ctx.save();
    var badgeBg = unlocked ? zone.color : 'rgba(80,80,80,0.7)';
    var badgeX  = zX;
    var badgeW  = Math.min(W * 0.28, 110);
    var badgeH  = 38;

    // Ombre du badge
    ctx.shadowColor   = 'rgba(0,0,0,0.25)';
    ctx.shadowBlur    = 8;
    ctx.shadowOffsetY = 3;

    // Fond badge
    ctx.fillStyle = badgeBg;
    _roundRect(ctx, badgeX - badgeW/2, labelY - 22, badgeW, badgeH, 10);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Numéro de zone
    ctx.fillStyle  = unlocked ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.4)';
    ctx.font       = 'bold ' + Math.round(H * 0.018) + 'px Cinzel, serif';
    ctx.textAlign  = 'center';
    ctx.fillText(zone.icon + ' ' + zLabel, badgeX, labelY - 5);

    ctx.fillStyle  = unlocked ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.25)';
    ctx.font       = Math.round(H * 0.013) + 'px system-ui, sans-serif';
    ctx.fillText(zSub, badgeX, labelY + 10);
    ctx.restore();

    // Ligne de connexion badge → bâtiment
    ctx.save();
    ctx.strokeStyle = unlocked ? zone.color : 'rgba(150,150,150,0.3)';
    ctx.lineWidth   = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(zX, labelY + 18);
    ctx.lineTo(zX, gY - H * 0.19);
    ctx.stroke();
    ctx.restore();

    // ── Bâtiments de la zone ──
    zone.buildings.forEach(function(bld, bi) {
      var pos      = _getBuildingPos(zi, bi, zone.buildings.length, W, H);
      var bUnlocked= xp >= bld.xp;
      var isHovered= _isoState.hoveredBuilding === (zone.id + '_' + bld.id);

      _drawIsoBuild(ctx, pos.x, pos.y, bld, zone, bUnlocked, isHovered, W, H, nl);
    });

    // ── Indicateur de progression XP ──
    if (!unlocked) {
      var needed = zone.xpRequired - xp;
      ctx.save();
      ctx.fillStyle  = 'rgba(0,0,0,0.55)';
      _roundRect(ctx, zX - 44, gY - H*0.08, 88, 22, 8);
      ctx.fill();
      ctx.fillStyle  = '#ff9f43';
      ctx.font       = 'bold ' + Math.round(H * 0.014) + 'px system-ui';
      ctx.textAlign  = 'center';
      ctx.fillText('🔒 +' + needed + ' XP', zX, gY - H*0.063);
      ctx.restore();
    } else {
      // Badge "débloqué"
      ctx.save();
      ctx.fillStyle  = 'rgba(78,207,112,0.18)';
      _roundRect(ctx, zX - 32, gY - H*0.08, 64, 20, 8);
      ctx.fill();
      ctx.fillStyle  = '#4ecf70';
      ctx.font       = 'bold ' + Math.round(H * 0.014) + 'px system-ui';
      ctx.textAlign  = 'center';
      ctx.fillText('✅ Débloqué', zX, gY - H*0.064);
      ctx.restore();
    }
  });
}

// ================================================================
// DESSIN : UN BÂTIMENT ISOMÉTRIQUE
// ================================================================
function _drawIsoBuild(ctx, x, y, bld, zone, unlocked, isHovered, W, H, nl) {
  var s     = H * 0.095; // taille de base
  var bob   = Math.sin(tick * 0.022 + x * 0.01) * 2.5;
  var scale = isHovered ? 1.12 : 1;
  var bY    = y + bob - s * 0.5;
  var bX    = x;

  ctx.save();
  ctx.translate(bX, bY);
  ctx.scale(scale, scale);

  if (!unlocked) {
    // ── Bâtiment verrouillé (grisé) ──
    ctx.globalAlpha = 0.48;
    _drawBuildingShape(ctx, 0, 0, s, '#888', '#666', '#aaa');
    ctx.globalAlpha = 1;
    // Cadenas
    ctx.font      = Math.round(s * 0.58) + 'px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🔒', 0, s * 0.1);
  } else {
    // ── Bâtiment débloqué ──
    // Halo de survol
    if (isHovered) {
      ctx.save();
      ctx.shadowColor = zone.color;
      ctx.shadowBlur  = 22;
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.arc(0, -s * 0.1, s * 0.72, 0, Math.PI * 2);
      ctx.fillStyle = zone.color;
      ctx.fill();
      ctx.restore();
    }

    // Corps du bâtiment (style cartoon isométrique)
    _drawBuildingShape(ctx, 0, 0, s,
      _shadeColor(zone.color, -0.2),
      _shadeColor(zone.color, -0.4),
      _shadeColor(zone.color, 0.15)
    );

    // Emoji principal
    ctx.font      = Math.round(s * 0.62) + 'px serif';
    ctx.textAlign = 'center';
    ctx.fillText(bld.emoji, 0, s * 0.05);

    // Ombre du texte
    ctx.shadowColor   = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur    = 4;
    ctx.shadowOffsetY = 1;

    // Label du bâtiment
    var bLabel = bld.label[nl] || bld.label.fr;
    ctx.font      = 'bold ' + Math.round(H * 0.016) + 'px system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(bLabel, 0, s * 0.78);
    ctx.shadowBlur = 0;
  }

  ctx.restore();
}

// Forme 3D isométrique simplifiée (boîte avec toit)
function _drawBuildingShape(ctx, x, y, s, sideL, sideR, top) {
  var hw = s * 0.48, hh = s * 0.52, th = s * 0.22;

  // Face gauche
  ctx.beginPath();
  ctx.moveTo(x - hw, y);
  ctx.lineTo(x,      y - hh);
  ctx.lineTo(x,      y - hh - th * 0.5);
  ctx.lineTo(x - hw, y - th * 0.5);
  ctx.closePath();
  ctx.fillStyle = sideL;
  ctx.fill();

  // Face droite
  ctx.beginPath();
  ctx.moveTo(x,      y - hh);
  ctx.lineTo(x + hw, y);
  ctx.lineTo(x + hw, y - th * 0.5);
  ctx.lineTo(x,      y - hh - th * 0.5);
  ctx.closePath();
  ctx.fillStyle = sideR;
  ctx.fill();

  // Toit (losange)
  ctx.beginPath();
  ctx.moveTo(x - hw, y - th * 0.5);
  ctx.lineTo(x,      y - hh - th);
  ctx.lineTo(x + hw, y - th * 0.5);
  ctx.lineTo(x,      y - th * 0.22);
  ctx.closePath();
  ctx.fillStyle = top;
  ctx.fill();

  // Contour
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.lineWidth   = 0.8;
  ctx.stroke();
}

// ================================================================
// PARTICULES
// ================================================================
function _updateAndDrawParticles(W, H) {
  // Ajouter de nouvelles particules
  if (tick % 12 === 0 && _isoState.particles.length < 20) {
    _isoState.particles.push({
      x: Math.random() * W,
      y: _getGroundY(W, H) - Math.random() * H * 0.2,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -0.4 - Math.random() * 0.5,
      life: 1, decay: 0.012,
      r: 2 + Math.random() * 3,
      color: ['#4ecf70','#ffd700','#ff9f43','#4a9eff'][Math.floor(Math.random() * 4)]
    });
  }
  _isoState.particles = _isoState.particles.filter(function(p) {
    p.x += p.vx; p.y += p.vy; p.life -= p.decay;
    if (p.life <= 0) return false;
    ctx.save();
    ctx.globalAlpha = p.life * 0.55;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.restore();
    return true;
  });
}

// ================================================================
// UTILITAIRES DESSIN
// ================================================================
function _roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function _shadeColor(hex, pct) {
  // Assombrit ou éclaircit une couleur hex
  var col = hex.replace('#','');
  if (col.length === 3) col = col[0]+col[0]+col[1]+col[1]+col[2]+col[2];
  var r = parseInt(col.slice(0,2),16);
  var g = parseInt(col.slice(2,4),16);
  var b = parseInt(col.slice(4,6),16);
  r = Math.max(0, Math.min(255, Math.round(r + r * pct)));
  g = Math.max(0, Math.min(255, Math.round(g + g * pct)));
  b = Math.max(0, Math.min(255, Math.round(b + b * pct)));
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

// ================================================================
// ÉVÉNEMENTS TACTILES / SOURIS
// ================================================================
var _touchStartX = 0, _touchScrollX = 0;

function _onIsoTouchStart(e) {
  e.preventDefault();
  _touchStartX  = e.touches[0].clientX;
  _touchScrollX = _isoState.targetScrollX;
  canvas && (canvas.style.cursor = 'grabbing');
}
function _onIsoTouchMove(e) {
  e.preventDefault();
  var dx = _touchStartX - e.touches[0].clientX;
  var dpr = window.devicePixelRatio || 1;
  var W   = canvas ? canvas.width / dpr : 360;
  _isoState.targetScrollX = _touchScrollX + dx;
  _clampScroll(W);
}
function _onIsoTouchEnd(e) {
  canvas && (canvas.style.cursor = 'grab');
  // Snap à la zone la plus proche
  var dpr = window.devicePixelRatio || 1;
  var W   = canvas ? canvas.width / dpr : 360;
  _snapToNearestZone(W);
}

function _onIsoMouseDown(e) {
  _isoState.isDragging  = true;
  _isoState.dragStartX  = e.clientX;
  _isoState.dragScrollX = _isoState.targetScrollX;
  canvas && (canvas.style.cursor = 'grabbing');
}
function _onIsoMouseDrag(e) {
  if (!_isoState.isDragging) return;
  var dx  = _isoState.dragStartX - e.clientX;
  var dpr = window.devicePixelRatio || 1;
  var W   = canvas ? canvas.width / dpr : 360;
  _isoState.targetScrollX = _isoState.dragScrollX + dx;
  _clampScroll(W);
}
function _onIsoMouseUp(e) {
  if (_isoState.isDragging) {
    _isoState.isDragging = false;
    canvas && (canvas.style.cursor = 'grab');
    var dpr = window.devicePixelRatio || 1;
    var W   = canvas ? canvas.width / dpr : 360;
    _snapToNearestZone(W);
  }
}

function _snapToNearestZone(W) {
  // Trouver la zone dont le centre est le plus proche du centre écran
  var cx      = _isoState.scrollX + W * 0.5;
  var minDist = Infinity, bestZone = 0;
  window.VILLAGE_ZONES.forEach(function(z, i) {
    var zX   = _getZoneX(i, W) + _isoState.scrollX;
    var dist = Math.abs(zX - W * 0.5);
    if (dist < minDist) { minDist = dist; bestZone = i; }
  });
  _scrollToZone(bestZone, false);
}

function _onIsoHover(e) {
  if (_isoState.isDragging) return;
  var rect = canvas.getBoundingClientRect();
  var dpr  = window.devicePixelRatio || 1;
  var mx   = (e.clientX - rect.left);
  var my   = (e.clientY - rect.top);
  var W    = canvas.width  / dpr;
  var H    = canvas.height / dpr;
  _isoState.hoveredBuilding = _hitTestBuilding(mx, my, W, H);
  canvas.style.cursor = _isoState.hoveredBuilding ? 'pointer' : (_isoState.isDragging ? 'grabbing' : 'grab');
}

function _onIsoClick(e) {
  if (_isoState.isDragging) return;
  var rect = canvas.getBoundingClientRect();
  var dpr  = window.devicePixelRatio || 1;
  var mx   = (e.clientX - rect.left);
  var my   = (e.clientY - rect.top);
  var W    = canvas.width  / dpr;
  var H    = canvas.height / dpr;
  var hit  = _hitTestBuilding(mx, my, W, H);
  if (hit) _onBuildingClick(hit);
}

function _hitTestBuilding(mx, my, W, H) {
  var xp = (window.S && S.xp) || 0;
  var s  = H * 0.095;
  var result = null;
  window.VILLAGE_ZONES.forEach(function(zone, zi) {
    zone.buildings.forEach(function(bld, bi) {
      var pos = _getBuildingPos(zi, bi, zone.buildings.length, W, H);
      var bob = Math.sin(tick * 0.022 + pos.x * 0.01) * 2.5;
      var bY  = pos.y + bob - s * 0.5;
      var dx  = mx - pos.x, dy = my - bY;
      if (Math.abs(dx) < s * 0.55 && Math.abs(dy) < s * 0.7) {
        result = zone.id + '_' + bld.id;
      }
    });
  });
  return result;
}

function _onBuildingClick(key) {
  var parts   = key.split('_');
  var zoneId  = parts[0];
  var buildId = parts.slice(1).join('_');
  var zone    = window.VILLAGE_ZONES.find(function(z) { return z.id === zoneId; });
  var bld     = zone && zone.buildings.find(function(b) { return b.id === buildId; });
  if (!zone || !bld) return;

  var xp = (window.S && S.xp) || 0;
  if (xp < bld.xp) {
    if (typeof showNotif === 'function')
      showNotif('🔒 Il te faut ' + (bld.xp - xp) + ' XP de plus pour débloquer ce lieu!');
    return;
  }

  // Particules de clic
  if (canvas) {
    var dpr = window.devicePixelRatio || 1;
    var W   = canvas.width  / dpr;
    var H   = canvas.height / dpr;
    var pos = _getBuildingPos(
      window.VILLAGE_ZONES.indexOf(zone),
      zone.buildings.indexOf(bld),
      zone.buildings.length, W, H
    );
    for (var i = 0; i < 10; i++) {
      _isoState.particles.push({
        x: pos.x, y: pos.y,
        vx: (Math.random()-0.5)*3, vy:-1.5-Math.random()*2,
        life:1, decay:0.03, r:3+Math.random()*4, color: zone.color
      });
    }
  }

  // Ouvrir le lieu
  if (typeof openLocation === 'function') {
    openLocation(buildId);
  } else if (typeof showScreen === 'function') {
    showScreen('screen-location');
    var locTitle = document.getElementById('locTitle');
    var nl = (window.S && S.nativeLang) || 'fr';
    if (locTitle) locTitle.textContent = bld.emoji + ' ' + (bld.label[nl] || bld.label.fr);
  }
}

// ================================================================
// BARRE DE NAVIGATION BOTTOM
// ================================================================
function _buildNavBar() {
  var existing = document.querySelector('.village-nav-bar');
  if (existing) existing.remove();

  var vs = document.getElementById('screen-village');
  if (!vs) return;

  var nl   = (window.S && S.nativeLang) || 'fr';
  var xp   = (window.S && S.xp) || 0;

  var nav  = document.createElement('div');
  nav.className = 'village-nav-bar';
  nav.innerHTML = '\
    <button class="vnb-btn active" onclick="_navTo(\'village\')" id="vnb-village">\
      <span class="vnb-icon">🏘️</span>\
      <span class="vnb-label">Village</span>\
    </button>\
    <button class="vnb-btn" onclick="_navTo(\'lessons\')" id="vnb-lessons">\
      <span class="vnb-icon">📖</span>\
      <span class="vnb-label">Leçons</span>\
    </button>\
    <button class="vnb-btn" onclick="_navTo(\'practice\')" id="vnb-practice">\
      <span class="vnb-icon">🎤</span>\
      <span class="vnb-label">Pratique</span>\
    </button>\
    <button class="vnb-btn" onclick="_navTo(\'challenges\')" id="vnb-challenges">\
      <span class="vnb-icon">🏆</span>\
      <span class="vnb-label">Défis</span>\
    </button>\
    <button class="vnb-btn" onclick="_navTo(\'profile\')" id="vnb-profile">\
      <span class="vnb-icon">👤</span>\
      <span class="vnb-label">Profil</span>\
    </button>\
  ';
  vs.appendChild(nav);

  // Injecter le CSS de la nav bar si pas encore présent
  if (!document.getElementById('village-nav-css')) {
    var style = document.createElement('style');
    style.id  = 'village-nav-css';
    style.textContent = '\
      .village-nav-bar {\
        flex-shrink: 0;\
        display: flex;\
        align-items: center;\
        justify-content: space-around;\
        background: rgba(8,10,18,0.97);\
        backdrop-filter: blur(14px);\
        -webkit-backdrop-filter: blur(14px);\
        border-top: 1px solid rgba(255,255,255,0.07);\
        padding: 8px 0 max(8px, env(safe-area-inset-bottom));\
        z-index: 30;\
        box-shadow: 0 -4px 24px rgba(0,0,0,0.4);\
      }\
      .vnb-btn {\
        flex: 1;\
        display: flex;\
        flex-direction: column;\
        align-items: center;\
        gap: 2px;\
        background: none;\
        border: none;\
        color: rgba(255,255,255,0.38);\
        font-size: 0.6rem;\
        font-weight: 700;\
        letter-spacing: 0.02em;\
        padding: 4px 0;\
        cursor: pointer;\
        transition: color 0.18s, transform 0.14s;\
      }\
      .vnb-btn.active { color: #4ecf70; }\
      .vnb-btn:active { transform: scale(0.9); }\
      .vnb-icon {\
        font-size: 1.3rem;\
        line-height: 1;\
        transition: transform 0.18s;\
      }\
      .vnb-btn.active .vnb-icon { transform: scale(1.2); }\
      .vnb-label { font-size: 0.58rem; }\
    ';
    document.head.appendChild(style);
  }
}

window._navTo = function(section) {
  document.querySelectorAll('.vnb-btn').forEach(function(b) { b.classList.remove('active'); });
  var btn = document.getElementById('vnb-' + section);
  if (btn) btn.classList.add('active');

  switch(section) {
    case 'village':
      // Déjà sur le village
      break;
    case 'lessons':
      if (typeof showScreen === 'function') showScreen('screen-lesson');
      else if (typeof showNotif === 'function') showNotif('📖 Leçons');
      break;
    case 'practice':
      if (typeof openFlashcards === 'function') openFlashcards();
      else if (typeof showNotif === 'function') showNotif('🎤 Pratique');
      break;
    case 'challenges':
      if (typeof showDetailedStats === 'function') showDetailedStats();
      else if (typeof showNotif === 'function') showNotif('🏆 Défis');
      break;
    case 'profile':
      if (typeof showScreen === 'function') showScreen('screen-menu');
      else if (typeof showNotif === 'function') showNotif('👤 Profil');
      break;
  }
};

// ================================================================
// METEO / TEMPS (conservé depuis l'ancienne version)
// ================================================================
function setWeather(w) { window.currentWeather = w || 'sun'; }
function getWeatherForTime() {
  var h = new Date().getHours();
  if (h >= 21 || h < 6) return 'night';
  var r = Math.random();
  if (r < 0.1) return 'rain';
  if (r < 0.15) return 'snow';
  return 'sun';
}
function updateTime() {
  var el = document.getElementById('hudTime');
  if (el) {
    var now = new Date();
    el.textContent = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
  }
  var we = document.getElementById('hudWeather');
  if (we && window.WEATHER_ICONS) we.textContent = WEATHER_ICONS[currentWeather] || '☀️';
}

// ================================================================
// COMPATIBILITÉ avec les fonctions appelées depuis index.html
// ================================================================
// Stub pour les fonctions de l'ancienne version attendues globalement
function alignLocationsToRings() {}   // plus utilisé, gardé pour compatibilité
function initCanvas() { _initIsoCanvas(); }
function drawVillage() { _drawIsoVillage(); }

// Exporter goVillage globalement
window.goVillage    = goVillage;
window.setWeather   = setWeather;
window.updateTime   = updateTime;
window.initCanvas   = initCanvas;
window.drawVillage  = drawVillage;
window.alignLocationsToRings = alignLocationsToRings;

console.log('✅ village.js ISOMETRIC EDITION chargé');
