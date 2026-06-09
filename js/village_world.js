// village_world.js — KROVA LIVING MAP
// Village scrollable + pinch-to-zoom + PNJ animés + météo vivante
// ================================================================
window.canvas = null; window.ctx = null; window.tick = 0;
window.currentWeather = window.currentWeather || 'sun';

// ================================================================
// CONFIGURATION DU MONDE
// ================================================================
var WORLD_W = 1800;  // largeur totale du monde (px logiques)
var WORLD_H = 900;   // hauteur totale du monde
var MIN_ZOOM = 0.35;
var MAX_ZOOM = 1.80;

var CAM = {
  x: 400, y: 100,      // position caméra (coin haut-gauche du monde visible)
  zoom: 0.75,          // zoom actuel
  targetX: 400, targetY: 100, targetZoom: 0.75,
  isDragging: false,
  dragStartX: 0, dragStartY: 0,
  camStartX: 0,  camStartY: 0,
  pinchStartDist: 0, pinchStartZoom: 0,
  pinchMidX: 0,  pinchMidY: 0,
  touchMoved: false, tapTime: 0,
};

// ================================================================
// BÂTIMENTS — positions absolues dans le monde
// ================================================================
var BUILDINGS = [
  // Maison du joueur — centre
  { id:'home',     wx:900, wy:520, emoji:'🏠', name:{fr:'Ta Maison',en:'Your Home',ht:'Kay Ou'}, size:80, color:'#ffd700', npcId:null, glow:'#ffd70066' },
  // Anneau intérieur
  { id:'well',     wx:900, wy:380, emoji:'⛲', name:{fr:'Puits Central',en:'Central Well',ht:'Pi Santral'}, size:70, color:'#4a9eff', npcId:'elder', glow:'#4a9eff55' },
  { id:'school',   wx:720, wy:440, emoji:'🏫', name:{fr:'École Amara',en:'School',ht:'Lekòl Amara'}, size:75, color:'#4ecf70', npcId:'teacher', glow:'#4ecf7055' },
  { id:'tavern',   wx:1080,wy:440, emoji:'🍺', name:{fr:'Taverne Marco',en:'Tavern',ht:'Tavèn Marco'}, size:70, color:'#ff9f43', npcId:'bartender', glow:'#ff9f4355' },
  // Anneau intermédiaire
  { id:'market',   wx:650, wy:340, emoji:'🏪', name:{fr:'Marché Diallo',en:'Market',ht:'Mache Diallo'}, size:72, color:'#ffd700', npcId:'merchant', glow:'#ffd70044' },
  { id:'farm',     wx:600, wy:520, emoji:'🌾', name:{fr:'Ferme de Léa',en:'Farm',ht:'Fèm Léa'}, size:68, color:'#4ecf70', npcId:'farmer', glow:'#4ecf7044' },
  { id:'forge',    wx:1150,wy:520, emoji:'⚒️', name:{fr:'Forge Eitan',en:'Forge',ht:'Fòj Eitan'}, size:68, color:'#ff6b6b', npcId:'blacksmith', glow:'#ff6b6b44' },
  { id:'hospital', wx:1150,wy:340, emoji:'🏥', name:{fr:'Dr. Martin',en:'Hospital',ht:'Kay Doktè'}, size:72, color:'#4a9eff', npcId:'doctor', glow:'#4a9eff44' },
  // Anneau extérieur
  { id:'library',  wx:750, wy:240, emoji:'📚', name:{fr:'Bibliothèque',en:'Library',ht:'Bibliyotèk'}, size:70, color:'#c084fc', npcId:'librarian', glow:'#c084fc44', locked:true, lockXP:400 },
  { id:'bridge',   wx:1250,wy:620, emoji:'🌉', name:{fr:'Pont Cassé',en:'Broken Bridge',ht:'Pon Kase'}, size:65, color:'#8899aa', npcId:null, glow:'#8899aa33', locked:true, lockXP:800 },
  // Lieux spéciaux
  { id:'cinema',   wx:1350,wy:280, emoji:'🎬', name:{fr:'Théâtre',en:'Theater',ht:'Teyat'}, size:72, color:'#c084fc', npcId:'director', glow:'#c084fc44' },
  { id:'lighthouse',wx:200, wy:300, emoji:'🗼', name:{fr:'Phare',en:'Lighthouse',ht:'Fa'}, size:60, color:'#66aacc', npcId:null, glow:'#66aacc33' },
  { id:'windmill', wx:1550,wy:350, emoji:'🌬️', name:{fr:'Moulin',en:'Windmill',ht:'Moulen'}, size:60, color:'#4ecf70', npcId:null, glow:'#4ecf7033' },
];

var NPC_DATA = {
  elder:      { name:'Grand-père Koffi', emoji:'👴', color:'#4a9eff' },
  teacher:    { name:'Mme Amara',        emoji:'👩‍🏫', color:'#4ecf70' },
  bartender:  { name:'Marco',            emoji:'🧔',  color:'#ff9f43' },
  merchant:   { name:'M. Diallo',        emoji:'🧑‍🌾', color:'#ffd700' },
  farmer:     { name:'Léa',              emoji:'👩‍🌾', color:'#4ecf70' },
  blacksmith: { name:'Eitan',            emoji:'👨‍🔧', color:'#ff6b6b' },
  doctor:     { name:'Dr. Martin',       emoji:'👨‍⚕️', color:'#4a9eff' },
  librarian:  { name:'Sorana',           emoji:'👩‍💼', color:'#c084fc' },
  director:   { name:'Réalisateur Félix',emoji:'🎬',  color:'#c084fc' },
};

// ================================================================
// ÉTAT
// ================================================================
var MAP = {
  particles: [],
  birds: [],
  clouds: [],
  villagers: [],   // PNJ qui se promènent
  lights: [],      // lumières animées
  tooltip: null,   // { id, x, y, timer }
};

function goVillage() {
  if (!window.S) return;
  _updateHUD();
  if (typeof window.showScreen === 'function') window.showScreen('screen-village');
  else {
    document.querySelectorAll('.screen').forEach(function(s){ s.classList.remove('active'); });
    var vs = document.getElementById('screen-village');
    if (vs) vs.classList.add('active');
  }
  window._villageLoopRunning = false;
  window._villageLoopActive  = false;
  MAP.particles = []; MAP.birds = []; MAP.clouds = [];
  MAP.villagers = []; MAP.lights = [];

  requestAnimationFrame(function(){ requestAnimationFrame(function(){
    _buildNavBar();
    _ensureLayout();
    _initCanvas();
    // Centrer la caméra sur la maison au démarrage
    CAM.x = 900 - window.innerWidth / (2 * CAM.zoom);
    CAM.y = 520 - window.innerHeight / (2 * CAM.zoom) * 0.55;
    CAM.targetX = CAM.x; CAM.targetY = CAM.y;
    _initWorld();
  }); });

  if (window._timeUpdateInterval) clearInterval(window._timeUpdateInterval);
  window._timeUpdateInterval = setInterval(updateTime, 30000);
  if (typeof updateTime === 'function') updateTime();
}

function _updateHUD() {
  var xp = (window.S && S.xp) || 0;
  var e;
  e = document.getElementById('hudPlayer');  if (e) e.textContent = '👤 ' + (S.playerName || '');
  e = document.getElementById('hudLang');    if (e) e.textContent = ((window.FLAGS && FLAGS[S.targetLang]) || '') + ' ' + ((window.LANG_NAMES && LANG_NAMES[S.targetLang]) || '');
  e = document.getElementById('hudXP');      if (e) e.textContent = xp + ' XP';
}

function _ensureLayout() {
  var vs = document.getElementById('screen-village');
  if (!vs) return;
  var c    = document.getElementById('villageCanvas');
  var wrap = document.querySelector('.village-canvas-wrap');
  if (c && c.parentElement === vs && !wrap) {
    var div = document.createElement('div');
    div.className = 'village-canvas-wrap';
    vs.insertBefore(div, c); div.appendChild(c);
    var tip = document.getElementById('locTooltip');
    if (tip && tip.parentElement === vs) div.appendChild(tip);
  }
}

// ================================================================
// INIT CANVAS
// ================================================================
function _initCanvas() {
  var c = document.getElementById('villageCanvas');
  if (!c) return;
  var dpr  = window.devicePixelRatio || 1;
  var wrap = document.querySelector('.village-canvas-wrap') || document.getElementById('screen-village');
  var r    = wrap ? wrap.getBoundingClientRect() : null;
  var W = r && r.width  > 0 ? Math.floor(r.width)  : window.innerWidth;
  var H = r && r.height > 0 ? Math.floor(r.height) : window.innerHeight - 100;
  c.width  = W * dpr; c.height = H * dpr;
  c.style.cssText = 'display:block;width:'+W+'px;height:'+H+'px;touch-action:none;cursor:grab;';

  // Re-bind events
  var nc = c.cloneNode(false);
  c.parentNode.replaceChild(nc, c); c = nc;
  c.addEventListener('touchstart',  _tStart,  { passive: false });
  c.addEventListener('touchmove',   _tMove,   { passive: false });
  c.addEventListener('touchend',    _tEnd,    { passive: true  });
  c.addEventListener('mousedown',   _mDown);
  c.addEventListener('mousemove',   _mMove);
  c.addEventListener('mouseup',     _mUp);
  c.addEventListener('click',       _onClick);
  c.addEventListener('wheel',       _onWheel, { passive: false });

  if (window._onCanvasResize) window.removeEventListener('resize', window._onCanvasResize);
  window._onCanvasResize = function() {
    if (document.getElementById('screen-village').classList.contains('active')) _initCanvas();
  };
  window.addEventListener('resize', window._onCanvasResize);

  if (!window._villageLoopRunning) {
    window._villageLoopRunning = true;
    window._villageLoopActive  = true;
    requestAnimationFrame(_loop);
  }
}

// ================================================================
// INIT MONDE — peuple les entités animées
// ================================================================
function _initWorld() {
  // Nuages
  for (var i = 0; i < 7; i++) {
    MAP.clouds.push({
      x: Math.random() * WORLD_W,
      y: 40 + Math.random() * 120,
      r: 50 + Math.random() * 80,
      spd: 0.12 + Math.random() * 0.18,
      alpha: 0.55 + Math.random() * 0.30,
    });
  }
  // Oiseaux
  for (var j = 0; j < 5; j++) {
    MAP.birds.push({
      x: Math.random() * WORLD_W,
      y: 60 + Math.random() * 100,
      vx: 0.6 + Math.random() * 0.8,
      vy: 0,
      phase: Math.random() * Math.PI * 2,
    });
  }
  // Villageois qui se promènent (entre les bâtiments)
  var paths = [
    { x: 850, y: 480 }, { x: 920, y: 480 },
    { x: 800, y: 460 }, { x: 950, y: 445 },
    { x: 700, y: 490 }, { x: 1100, y: 470 },
  ];
  var walkEmojis = ['🚶','🚶‍♀️','🧒','👦','🧓','👧'];
  paths.forEach(function(p, i) {
    MAP.villagers.push({
      x: p.x, y: p.y,
      baseX: p.x, baseY: p.y,
      dx: (Math.random() - 0.5) * 80,
      dy: (Math.random() - 0.5) * 30,
      speed: 0.008 + Math.random() * 0.006,
      phase: Math.random() * Math.PI * 2,
      emoji: walkEmojis[i % walkEmojis.length],
      scale: 0.55 + Math.random() * 0.15,
    });
  });
  // Lumières de fenêtres
  BUILDINGS.forEach(function(b) {
    if (b.locked) return;
    for (var k = 0; k < 2; k++) {
      MAP.lights.push({
        bx: b.wx + (Math.random() - 0.5) * b.size * 0.6,
        by: b.wy - b.size * 0.3 + (Math.random() - 0.5) * 10,
        phase: Math.random() * Math.PI * 2,
        color: b.color,
        size: 3 + Math.random() * 3,
      });
    }
  });
}

// ================================================================
// BOUCLE
// ================================================================
function _loop() {
  if (!window._villageLoopActive) return;
  tick++;
  // Interpolation caméra fluide
  CAM.x    += (CAM.targetX    - CAM.x)    * 0.10;
  CAM.y    += (CAM.targetY    - CAM.y)    * 0.10;
  CAM.zoom += (CAM.targetZoom - CAM.zoom) * 0.12;
  _draw();
  requestAnimationFrame(_loop);
}

// ================================================================
// DESSIN PRINCIPAL
// ================================================================
function _draw() {
  var c = document.getElementById('villageCanvas');
  if (!c) { canvas = null; ctx = null; return; }
  if (c !== canvas) { canvas = c; ctx = c.getContext('2d'); }
  var dpr  = window.devicePixelRatio || 1;
  var SW   = c.width / dpr;  // screen width
  var SH   = c.height / dpr; // screen height
  if (SW < 10 || SH < 10) return;

  ctx.save();
  ctx.scale(dpr, dpr);

  var night = currentWeather === 'night';
  var rain  = currentWeather === 'rain';

  // ── FOND CIEL ──
  var sky = ctx.createLinearGradient(0, 0, 0, SH * 0.62);
  if (night) { sky.addColorStop(0, '#04070e'); sky.addColorStop(1, '#09122a'); }
  else if (rain) { sky.addColorStop(0, '#2a3545'); sky.addColorStop(1, '#3a4a5a'); }
  else { sky.addColorStop(0, '#5bb8f5'); sky.addColorStop(0.55, '#a8d8f0'); sky.addColorStop(1, '#cce8f5'); }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, SW, SH);

  if (night) _drawStars(SW, SH);
  _drawCelestial(SW, SH, night, rain);
  if (!night && !rain) _drawClouds(SW, SH);
  _drawBirds(SW, SH);

  // ── TRANSFORMATION CAMÉRA ──
  ctx.save();
  ctx.translate(-CAM.x * CAM.zoom, -CAM.y * CAM.zoom);
  ctx.scale(CAM.zoom, CAM.zoom);

  // ── MONDE ──
  _drawTerrain(SW, SH);
  _drawPaths();
  _drawRiver();
  _drawTrees();
  _drawLights(night);
  _drawBuildings();
  _drawVillagers();
  _drawParticles();
  _drawTooltip();

  ctx.restore(); // fin transformation caméra

  // ── MINIMAP ──
  _drawMinimap(SW, SH);

  // ── ZOOM HUD ──
  _drawZoomHint(SW, SH);

  ctx.restore(); // fin scale(dpr)
}

// ================================================================
// TERRAIN
// ================================================================
function _drawTerrain(SW, SH) {
  // Sol herbe principale
  var g = ctx.createLinearGradient(0, 380, 0, WORLD_H);
  g.addColorStop(0, '#55a858'); g.addColorStop(0.3, '#479a4a'); g.addColorStop(1, '#35783a');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, 380);
  // Ligne de sol ondulée
  for (var x = 0; x <= WORLD_W; x += 80) {
    var y = 380 + Math.sin(x * 0.008 + 1.2) * 18;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(WORLD_W, WORLD_H); ctx.lineTo(0, WORLD_H); ctx.closePath();
  ctx.fill();

  // Lisière
  ctx.fillStyle = 'rgba(120,220,100,0.18)';
  ctx.beginPath(); ctx.moveTo(0, 380);
  for (var xi = 0; xi <= WORLD_W; xi += 80) {
    ctx.lineTo(xi, 380 + Math.sin(xi * 0.008 + 1.2) * 18);
  }
  for (var xj = WORLD_W; xj >= 0; xj -= 80) {
    ctx.lineTo(xj, 395 + Math.sin(xj * 0.008 + 1.2) * 18);
  }
  ctx.closePath(); ctx.fill();

  // Montagnes fond
  var mtnCols = ['#6aaf88','#52906e','#3d7853'];
  var mtns = [[150,280,220],[380,240,180],[620,270,200],[850,220,200],[1100,260,190],[1350,240,200],[1600,260,180]];
  mtns.forEach(function(m, i) {
    ctx.beginPath();
    ctx.moveTo(m[0] - m[2]*0.5, 380); ctx.lineTo(m[0], m[1]); ctx.lineTo(m[0] + m[2]*0.5, 380);
    ctx.closePath(); ctx.fillStyle = mtnCols[i % mtnCols.length]; ctx.fill();
    // Neige
    if (currentWeather !== 'night') {
      ctx.beginPath();
      ctx.moveTo(m[0]-m[2]*0.07, m[1]+m[2]*0.10); ctx.lineTo(m[0], m[1]); ctx.lineTo(m[0]+m[2]*0.07, m[1]+m[2]*0.10);
      ctx.closePath(); ctx.fillStyle = 'rgba(255,255,255,0.82)'; ctx.fill();
    }
  });
}

// ================================================================
// CHEMINS ET ROUTES
// ================================================================
function _drawPaths() {
  // Routes entre bâtiments
  var routes = [
    ['home','well'], ['home','school'], ['home','tavern'],
    ['well','market'], ['well','hospital'],
    ['school','market'], ['school','farm'],
    ['tavern','forge'], ['tavern','hospital'],
    ['market','library'], ['forge','cinema'],
  ];
  routes.forEach(function(route) {
    var a = BUILDINGS.find(function(b){ return b.id === route[0]; });
    var b = BUILDINGS.find(function(b){ return b.id === route[1]; });
    if (!a || !b) return;
    // Ombre chemin
    ctx.save();
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth   = 14;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(a.wx, a.wy+4); ctx.lineTo(b.wx, b.wy+4); ctx.stroke();
    // Chemin
    ctx.strokeStyle = '#c4a050';
    ctx.lineWidth   = 10;
    ctx.beginPath(); ctx.moveTo(a.wx, a.wy); ctx.lineTo(b.wx, b.wy); ctx.stroke();
    // Texture
    ctx.strokeStyle = 'rgba(170,130,60,0.22)';
    ctx.lineWidth   = 11;
    ctx.setLineDash([12, 8]);
    ctx.beginPath(); ctx.moveTo(a.wx, a.wy); ctx.lineTo(b.wx, b.wy); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  });
}

// ================================================================
// RIVIÈRE
// ================================================================
function _drawRiver() {
  ctx.save();
  var rg = ctx.createLinearGradient(1250, 0, 1330, 0);
  rg.addColorStop(0, '#3a80a8'); rg.addColorStop(0.5, '#52aad0'); rg.addColorStop(1, '#3a80a8');
  ctx.fillStyle = rg;
  ctx.beginPath();
  ctx.moveTo(1260, 300); ctx.bezierCurveTo(1270, 400, 1290, 500, 1280, 700);
  ctx.bezierCurveTo(1300, 700, 1340, 500, 1330, 400); ctx.bezierCurveTo(1320, 300, 1280, 300, 1260, 300);
  ctx.closePath(); ctx.fill();
  // Reflets
  ctx.globalAlpha = 0.25; ctx.fillStyle = '#90d0ee';
  for (var i = 0; i < 5; i++) {
    var ry = 350 + i * 60 + Math.sin(tick * 0.02 + i) * 5;
    ctx.fillRect(1270, ry, 18 - i*2, 3);
  }
  ctx.globalAlpha = 1;
  // Pont
  ctx.fillStyle = '#7a5c10'; ctx.fillRect(1254, 545, 78, 12);
  ctx.strokeStyle = '#5a3e08'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(1293, 560, 28, Math.PI, 0); ctx.stroke();
  ctx.fillStyle = '#9a7a28';
  for (var p = -3; p <= 3; p++) { ctx.fillRect(1293 + p*10 - 2, 537, 4, 10); }
  ctx.restore();
}

// ================================================================
// ARBRES
// ================================================================
function _drawTrees() {
  var treePts = [
    [300,410,0.90],[420,440,0.75],[500,430,0.80],[480,480,0.60],
    [750,430,0.70],[820,450,0.60],[970,430,0.70],[1050,440,0.65],
    [1200,415,0.85],[1380,425,0.80],[1450,435,0.70],[1500,415,0.85],
    [200,440,0.70],[150,460,0.60],[1650,430,0.80],[1700,415,0.90],
  ];
  treePts.forEach(function(t) { _tree(t[0], t[1], t[2]); });
}
function _tree(x, y, sc) {
  var s = sc * 55;
  ctx.fillStyle = '#5a3218'; ctx.fillRect(x - s*0.09, y - s*0.28, s*0.18, s*0.30);
  [{dy:-s*0.20,r:s*0.38,c:'#267530'},{dy:-s*0.45,r:s*0.32,c:'#32954a'},{dy:-s*0.66,r:s*0.22,c:'#3fbb5e'}]
  .forEach(function(l) { ctx.beginPath(); ctx.arc(x, y+l.dy, l.r, 0, Math.PI*2); ctx.fillStyle=l.c; ctx.fill(); });
}

// ================================================================
// LUMIÈRES DE FENÊTRES (nuit/soirée)
// ================================================================
function _drawLights(night) {
  if (!night && currentWeather !== 'rain') return;
  MAP.lights.forEach(function(l) {
    var flicker = 0.7 + 0.3 * Math.sin(tick * 0.08 + l.phase);
    var g = ctx.createRadialGradient(l.bx, l.by, 0, l.bx, l.by, l.size * 4);
    g.addColorStop(0, l.color + 'cc');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save();
    ctx.globalAlpha = flicker * 0.7;
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(l.bx, l.by, l.size * 4, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  });
}

// ================================================================
// BÂTIMENTS
// ================================================================
function _drawBuildings() {
  var xp  = (window.S && S.xp) || 0;
  var nl  = (window.S && S.nativeLang) || 'fr';
  // Tri par Y pour order correct (isométrique)
  var sorted = BUILDINGS.slice().sort(function(a,b){ return a.wy - b.wy; });

  sorted.forEach(function(b) {
    var locked   = b.locked && xp < (b.lockXP || 0);
    var hovered  = MAP.tooltip && MAP.tooltip.id === b.id;
    var bob      = Math.sin(tick * 0.018 + b.wx * 0.005) * 3;
    var s        = b.size;
    var cx       = b.wx;
    var cy       = b.wy + bob;

    ctx.save();
    if (hovered) { ctx.scale(1, 1); }

    if (locked) {
      ctx.globalAlpha = 0.38;
      _buildShape(cx, cy, s, '#555', '#444', '#666');
      ctx.globalAlpha = 1;
      ctx.font = Math.round(s * 0.50) + 'px serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('🔒', cx, cy - s * 0.15);
      // Barre de progression
      if (b.lockXP) {
        var pct = Math.min(xp / b.lockXP, 1);
        var bw = s * 1.1, bh = 5;
        ctx.fillStyle = 'rgba(255,255,255,0.10)';
        _rrect(cx - bw/2, cy + s*0.52, bw, bh, 3); ctx.fill();
        ctx.fillStyle = b.color;
        _rrect(cx - bw/2, cy + s*0.52, bw*pct, bh, 3); ctx.fill();
      }
    } else {
      // Halo survol
      if (hovered) {
        ctx.save();
        var hg = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * 1.1);
        hg.addColorStop(0, b.glow || 'rgba(255,215,0,0.25)');
        hg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = hg;
        ctx.beginPath(); ctx.arc(cx, cy, s * 1.1, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      }
      // Corps
      _buildShape(cx, cy, s, _shade(b.color, -0.20), _shade(b.color, -0.42), _shade(b.color, 0.15));
      // Emoji
      ctx.font = Math.round(s * 0.56) + 'px serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.40)'; ctx.shadowBlur = 4;
      ctx.fillText(b.emoji, cx, cy + s * 0.04);
      ctx.shadowBlur = 0;
      // Nom
      var nm = b.name[nl] || b.name.fr;
      ctx.font = 'bold ' + Math.round(s * 0.22) + 'px Sora,Nunito,system-ui';
      ctx.fillStyle = '#fff';
      ctx.shadowColor = 'rgba(0,0,0,0.70)'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 1;
      ctx.fillText(nm, cx, cy + s * 0.72);
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
      // Badge quête
      if (b.npcId && NPC_DATA[b.npcId]) {
        var questBob = Math.sin(tick * 0.06) * 3;
        ctx.font = Math.round(s * 0.28) + 'px serif';
        ctx.fillText('❕', cx + s * 0.55, cy - s * 0.75 + questBob);
      }
    }
    ctx.restore();
  });
}

// ================================================================
// VILLAGEOIS ANIMÉS
// ================================================================
function _drawVillagers() {
  MAP.villagers.forEach(function(v) {
    v.phase += v.speed;
    v.x = v.baseX + Math.sin(v.phase)      * v.dx;
    v.y = v.baseY + Math.sin(v.phase * 0.7) * v.dy;
    ctx.save();
    ctx.font = Math.round(32 * v.scale) + 'px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.30)'; ctx.shadowBlur = 3;
    ctx.fillText(v.emoji, v.x, v.y);
    ctx.restore();
  });
}

// ================================================================
// PARTICULES AMBIANTES
// ================================================================
function _drawParticles() {
  if (tick % 18 === 0 && MAP.particles.length < 24) {
    var b = BUILDINGS[Math.floor(Math.random() * BUILDINGS.length)];
    MAP.particles.push({
      x: b.wx + (Math.random()-0.5)*30, y: b.wy - 20,
      vx: (Math.random()-0.5)*0.5, vy: -0.4-Math.random()*0.5,
      life:1, decay:0.010, r:1.5+Math.random()*3,
      col: ['#4ecf70','#ffd700','#ff9f43','#4a9eff'][Math.floor(Math.random()*4)],
    });
  }
  MAP.particles = MAP.particles.filter(function(p) {
    p.x+=p.vx; p.y+=p.vy; p.life-=p.decay; if(p.life<=0) return false;
    ctx.save(); ctx.globalAlpha=p.life*0.5;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=p.col; ctx.fill(); ctx.restore();
    return true;
  });
}

// ================================================================
// TOOLTIP BÂTIMENT
// ================================================================
function _drawTooltip() {
  if (!MAP.tooltip) return;
  var b = BUILDINGS.find(function(b){ return b.id === MAP.tooltip.id; });
  if (!b) return;
  var nl  = (window.S && S.nativeLang) || 'fr';
  var nm  = b.name[nl] || b.name.fr;
  var npc = b.npcId ? NPC_DATA[b.npcId] : null;
  var label = npc ? npc.emoji + ' ' + npc.name : nm;
  var W = 160, H = 32, r = 10;
  var tx = b.wx - W/2;
  var ty = b.wy - b.size - 60;
  // Fond
  ctx.save();
  ctx.fillStyle = 'rgba(6,10,20,0.92)';
  ctx.strokeStyle = b.color || '#ffd700';
  ctx.lineWidth = 1.5;
  _rrect(tx, ty, W, H, r); ctx.fill(); ctx.stroke();
  // Texte
  ctx.fillStyle = '#f0e8d0';
  ctx.font = 'bold 12px Sora,system-ui';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(label, b.wx, ty + H/2);
  // Flèche
  ctx.fillStyle = 'rgba(6,10,20,0.92)';
  ctx.beginPath();
  ctx.moveTo(b.wx - 7, ty + H); ctx.lineTo(b.wx + 7, ty + H); ctx.lineTo(b.wx, ty + H + 8);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

// ================================================================
// MINIMAP — coin bas-droite
// ================================================================
function _drawMinimap(SW, SH) {
  var mw = 110, mh = 60, mx = SW - mw - 10, my = SH - mh - 10, r = 8;
  ctx.save();
  // Fond minimap
  ctx.fillStyle = 'rgba(4,8,18,0.80)';
  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.lineWidth = 1;
  _rrect(mx, my, mw, mh, r); ctx.fill(); ctx.stroke();
  // Clip
  ctx.beginPath(); _rrect(mx+1, my+1, mw-2, mh-2, r-1); ctx.clip();
  // Fond monde minimap
  ctx.fillStyle = '#1a3a1a'; ctx.fillRect(mx, my, mw, mh);
  // Bâtiments minimap
  var sx = mw / WORLD_W, sy = mh / WORLD_H;
  BUILDINGS.forEach(function(b) {
    var xp = (window.S && S.xp) || 0;
    var locked = b.locked && xp < (b.lockXP || 0);
    ctx.beginPath();
    ctx.arc(mx + b.wx * sx, my + b.wy * sy, locked ? 1.5 : 2.5, 0, Math.PI*2);
    ctx.fillStyle = locked ? '#555' : (b.color || '#4ecf70');
    ctx.fill();
  });
  // Viewport
  var vx = CAM.x * sx, vy = CAM.y * sy;
  var c  = document.getElementById('villageCanvas');
  var dpr = window.devicePixelRatio || 1;
  var vw = (c ? c.width/dpr : SW) / CAM.zoom * sx;
  var vh = (c ? c.height/dpr : SH) / CAM.zoom * sy;
  ctx.strokeStyle = 'rgba(255,215,0,0.60)';
  ctx.lineWidth   = 1;
  ctx.strokeRect(mx + vx, my + vy, Math.min(vw, mw), Math.min(vh, mh));
  ctx.restore();
}

// ================================================================
// ZOOM HINT
// ================================================================
function _drawZoomHint(SW, SH) {
  ctx.save();
  ctx.font = '10px system-ui'; ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.textAlign = 'right'; ctx.textBaseline = 'top';
  ctx.fillText('🔍 ' + Math.round(CAM.zoom * 100) + '%', SW - 10, 10);
  ctx.restore();
}

// ================================================================
// SKY ELEMENTS
// ================================================================
function _drawStars(SW, SH) {
  ctx.save();
  for (var i = 0; i < 80; i++) {
    var sx = (Math.sin(i*437.1)*0.5+0.5)*SW;
    var sy = (Math.sin(i*293.3)*0.5+0.5)*SH*0.45;
    var tw = 0.2+0.8*Math.sin(tick*0.015+i*0.7);
    ctx.beginPath(); ctx.arc(sx,sy,0.4+Math.sin(i*127)*0.5,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,220,'+tw.toFixed(2)+')'; ctx.fill();
  }
  ctx.restore();
}
function _drawCelestial(SW, SH, night, rain) {
  var x = SW*0.88, y = SH*0.10;
  if (night) {
    var mg = ctx.createRadialGradient(x,y,0,x,y,42);
    mg.addColorStop(0,'rgba(200,190,130,0.22)'); mg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=mg; ctx.fillRect(x-42,y-42,84,84);
    ctx.beginPath(); ctx.arc(x,y,14,0,Math.PI*2); ctx.fillStyle='#eee8a0'; ctx.fill();
  } else if (!rain) {
    var sg=ctx.createRadialGradient(x,y,0,x,y,55);
    sg.addColorStop(0,'rgba(255,230,80,0.26)'); sg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=sg; ctx.fillRect(x-55,y-55,110,110);
    ctx.beginPath(); ctx.arc(x,y,20,0,Math.PI*2); ctx.fillStyle='#ffe055'; ctx.fill();
    for (var ri=0;ri<8;ri++) {
      var a=(ri/8)*Math.PI*2+tick*0.005;
      ctx.beginPath(); ctx.moveTo(x+Math.cos(a)*25,y+Math.sin(a)*25); ctx.lineTo(x+Math.cos(a)*35,y+Math.sin(a)*35);
      ctx.strokeStyle='rgba(255,220,60,0.40)'; ctx.lineWidth=2; ctx.stroke();
    }
  }
}
function _drawClouds(SW, SH) {
  MAP.clouds.forEach(function(cl) {
    cl.x += cl.spd; if (cl.x > WORLD_W + cl.r*2) cl.x = -cl.r*2;
    // Convertir position monde → écran
    var sx = (cl.x - CAM.x) * CAM.zoom;
    var sy = cl.y;  // nuages en coordonnées écran
    if (sx < -cl.r*4 || sx > SW + cl.r*4) return;
    ctx.save(); ctx.globalAlpha = cl.alpha * 0.70; ctx.fillStyle = '#fff';
    [[sx,sy,cl.r],[sx+cl.r*0.6,sy+cl.r*0.12,cl.r*0.72],
     [sx-cl.r*0.55,sy+cl.r*0.15,cl.r*0.62],[sx+cl.r*0.05,sy+cl.r*0.36,cl.r*0.88]]
    .forEach(function(b){ ctx.beginPath(); ctx.arc(b[0],b[1],b[2],0,Math.PI*2); ctx.fill(); });
    ctx.restore();
  });
}
function _drawBirds(SW, SH) {
  MAP.birds.forEach(function(b) {
    b.x += b.vx; b.phase += 0.08;
    b.y = b.y + Math.sin(b.phase) * 0.3;
    if (b.x > WORLD_W + 20) b.x = -20;
    var sx = (b.x - CAM.x) * CAM.zoom;
    var sy = b.y;
    if (sx < -30 || sx > SW + 30) return;
    ctx.save(); ctx.translate(sx, sy);
    ctx.fillStyle = 'rgba(40,40,50,0.70)';
    var wing = Math.sin(b.phase * 4) * 5;
    ctx.beginPath(); ctx.ellipse(-5, wing, 6, 2, -0.3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(5, -wing, 6, 2, 0.3, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  });
}

// ================================================================
// INTERACTION — TOUCH
// ================================================================
function _tStart(e) {
  e.preventDefault();
  CAM.tapTime   = Date.now();
  CAM.touchMoved = false;
  if (e.touches.length === 2) {
    // Pinch-to-zoom
    var dx = e.touches[1].clientX - e.touches[0].clientX;
    var dy = e.touches[1].clientY - e.touches[0].clientY;
    CAM.pinchStartDist = Math.sqrt(dx*dx + dy*dy);
    CAM.pinchStartZoom = CAM.zoom;
    CAM.pinchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
    CAM.pinchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    CAM.isDragging = false;
  } else {
    CAM.isDragging  = true;
    CAM.dragStartX  = e.touches[0].clientX;
    CAM.dragStartY  = e.touches[0].clientY;
    CAM.camStartX   = CAM.targetX;
    CAM.camStartY   = CAM.targetY;
  }
}
function _tMove(e) {
  e.preventDefault();
  if (e.touches.length === 2) {
    // Pinch zoom
    var dx = e.touches[1].clientX - e.touches[0].clientX;
    var dy = e.touches[1].clientY - e.touches[0].clientY;
    var dist = Math.sqrt(dx*dx + dy*dy);
    var newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, CAM.pinchStartZoom * (dist / CAM.pinchStartDist)));
    // Zoom centré sur le milieu du pinch
    var c   = document.getElementById('villageCanvas');
    var dpr = window.devicePixelRatio || 1;
    var SW  = c ? c.width/dpr : window.innerWidth;
    var SH  = c ? c.height/dpr : window.innerHeight;
    var rect = c ? c.getBoundingClientRect() : {left:0, top:0};
    var midX = (CAM.pinchMidX - rect.left);
    var midY = (CAM.pinchMidY - rect.top);
    CAM.targetX = (CAM.targetX + midX/CAM.zoom) - midX/newZoom;
    CAM.targetY = (CAM.targetY + midY/CAM.zoom) - midY/newZoom;
    CAM.targetZoom = newZoom;
    CAM.touchMoved = true;
    CAM.pinchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
    CAM.pinchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
  } else if (CAM.isDragging) {
    var dx2 = e.touches[0].clientX - CAM.dragStartX;
    var dy2 = e.touches[0].clientY - CAM.dragStartY;
    if (Math.abs(dx2) > 5 || Math.abs(dy2) > 5) CAM.touchMoved = true;
    CAM.targetX = _clampCamX(CAM.camStartX - dx2 / CAM.zoom);
    CAM.targetY = _clampCamY(CAM.camStartY - dy2 / CAM.zoom);
    // Tooltip hover
    var c2 = document.getElementById('villageCanvas');
    var rect2 = c2 ? c2.getBoundingClientRect() : {left:0,top:0};
    var mx = (e.touches[0].clientX - rect2.left);
    var my = (e.touches[0].clientY - rect2.top);
    MAP.tooltip = _hitTest(mx, my);
    if (c2) c2.style.cursor = MAP.tooltip ? 'pointer' : 'grabbing';
  }
}
function _tEnd(e) {
  CAM.isDragging = false;
  if (!CAM.touchMoved && Date.now() - CAM.tapTime < 300 && e.changedTouches.length === 1) {
    var c = document.getElementById('villageCanvas');
    var r = c ? c.getBoundingClientRect() : {left:0,top:0};
    var mx = e.changedTouches[0].clientX - r.left;
    var my = e.changedTouches[0].clientY - r.top;
    var hit = _hitTest(mx, my);
    if (hit) _onTapBuilding(hit.id);
  }
  CAM.touchMoved = false;
}

// ================================================================
// INTERACTION — SOURIS
// ================================================================
function _mDown(e) {
  CAM.isDragging = true; CAM.touchMoved = false;
  CAM.dragStartX = e.clientX; CAM.dragStartY = e.clientY;
  CAM.camStartX  = CAM.targetX; CAM.camStartY = CAM.targetY;
  var c = document.getElementById('villageCanvas');
  if (c) c.style.cursor = 'grabbing';
}
function _mMove(e) {
  var c = document.getElementById('villageCanvas'); if (!c) return;
  var r = c.getBoundingClientRect();
  var mx = e.clientX - r.left, my = e.clientY - r.top;
  if (CAM.isDragging) {
    var dx = e.clientX - CAM.dragStartX, dy = e.clientY - CAM.dragStartY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) CAM.touchMoved = true;
    CAM.targetX = _clampCamX(CAM.camStartX - dx / CAM.zoom);
    CAM.targetY = _clampCamY(CAM.camStartY - dy / CAM.zoom);
  }
  MAP.tooltip = _hitTest(mx, my);
  c.style.cursor = CAM.isDragging ? 'grabbing' : (MAP.tooltip ? 'pointer' : 'grab');
}
function _mUp(e) {
  CAM.isDragging = false;
  var c = document.getElementById('villageCanvas');
  if (c) c.style.cursor = MAP.tooltip ? 'pointer' : 'grab';
}
function _onClick(e) {
  if (CAM.touchMoved) return;
  var c = document.getElementById('villageCanvas'); if (!c) return;
  var r = c.getBoundingClientRect();
  var hit = _hitTest(e.clientX - r.left, e.clientY - r.top);
  if (hit) _onTapBuilding(hit.id);
}
function _onWheel(e) {
  e.preventDefault();
  var c = document.getElementById('villageCanvas'); if (!c) return;
  var r   = c.getBoundingClientRect();
  var mx  = e.clientX - r.left, my = e.clientY - r.top;
  var dz  = e.deltaY > 0 ? 0.88 : 1.14;
  var nz  = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, CAM.targetZoom * dz));
  CAM.targetX = _clampCamX(CAM.targetX + mx/CAM.zoom - mx/nz);
  CAM.targetY = _clampCamY(CAM.targetY + my/CAM.zoom - my/nz);
  CAM.targetZoom = nz;
}

// ================================================================
// HIT TEST
// ================================================================
function _hitTest(mx, my) {
  var c   = document.getElementById('villageCanvas');
  var dpr = window.devicePixelRatio || 1;
  var SW  = c ? c.width/dpr : window.innerWidth;
  var SH  = c ? c.height/dpr : window.innerHeight;
  // Convertir coordonnées écran → monde
  var wx = mx / CAM.zoom + CAM.x;
  var wy = my / CAM.zoom + CAM.y;
  for (var i = 0; i < BUILDINGS.length; i++) {
    var b  = BUILDINGS[i];
    var dx = wx - b.wx, dy = wy - b.wy;
    if (Math.abs(dx) < b.size*0.60 && Math.abs(dy) < b.size*0.75) return b;
  }
  return null;
}

// ================================================================
// CLIC SUR BÂTIMENT
// ================================================================
function _onTapBuilding(id) {
  var b   = BUILDINGS.find(function(b){ return b.id === id; });
  if (!b) return;
  var xp  = (window.S && S.xp) || 0;
  var nl  = (window.S && S.nativeLang) || 'fr';
  if (window.LV_SOUND) window.LV_SOUND.play('tap');

  if (b.locked && xp < (b.lockXP || 0)) {
    var msgs = {fr:'🔒 '+(b.lockXP-xp)+' XP pour débloquer '+b.name.fr, en:'🔒 '+(b.lockXP-xp)+' XP to unlock '+b.name.en, ht:'🔒 '+(b.lockXP-xp)+' XP pou debloke '+b.name.ht};
    if (typeof showNotif === 'function') showNotif(msgs[nl]||msgs.fr, 3000);
    return;
  }

  // Centrer caméra sur le bâtiment cliqué
  var c   = document.getElementById('villageCanvas');
  var dpr = window.devicePixelRatio || 1;
  var SW  = c ? c.width/dpr : window.innerWidth;
  var SH  = c ? c.height/dpr : window.innerHeight;
  CAM.targetX = _clampCamX(b.wx - SW/(2*CAM.zoom));
  CAM.targetY = _clampCamY(b.wy - SH/(2*CAM.zoom)*0.6);

  // Ouvrir le panneau du lieu
  var name = b.name[nl] || b.name.fr;
  var npc  = b.npcId ? NPC_DATA[b.npcId] : null;
  var locTitle = document.getElementById('locTitle');
  var npcList  = document.getElementById('npcList');
  if (locTitle) locTitle.textContent = b.emoji + ' ' + name;
  if (npcList) {
    if (!npc) {
      npcList.innerHTML = '<div style="padding:40px 20px;text-align:center;color:rgba(255,255,255,0.25);font-size:0.88rem;">Aucun habitant ici.</div>';
    } else {
      npcList.innerHTML = '<button onclick="openDialogue(\''+b.id+'\',\''+b.npcId+'\')" style="'
        +'display:flex;align-items:center;gap:16px;width:100%;padding:18px 20px;'
        +'background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.08);'
        +'border-radius:18px;cursor:pointer;text-align:left;color:inherit;'
        +'transition:all 0.2s;" onmouseover="this.style.background=\'rgba(255,255,255,0.08)\'" onmouseout="this.style.background=\'rgba(255,255,255,0.04)\'">'
        +'<div style="font-size:2.6rem;flex-shrink:0">'+npc.emoji+'</div>'
        +'<div><div style="font-weight:800;font-size:1rem;color:#f0e8d0">'+npc.name+'</div>'
        +'<div style="font-size:0.68rem;color:rgba(255,255,255,0.35);margin-top:3px">❕ Discuter — passer à la langue cible</div></div>'
        +'<div style="margin-left:auto;color:rgba(255,215,0,0.45);font-size:1.5rem">›</div>'
        +'</button>';
    }
  }

  window._villageLoopActive = false;
  if (typeof showScreen === 'function') showScreen('screen-location');

  // Relancer loop au retour
  var back = document.querySelector('#screen-location .back-btn');
  if (back && !back._rpgP) {
    back._rpgP = true;
    var orig = back.onclick;
    back.onclick = function() {
      if (typeof orig === 'function') orig.call(this);
      else if (typeof showScreen === 'function') showScreen('screen-village');
      window._villageLoopActive  = true;
      window._villageLoopRunning = true;
      requestAnimationFrame(_loop);
    };
  }
}

// ================================================================
// CLAMP CAMÉRA
// ================================================================
function _clampCamX(x) {
  var c   = document.getElementById('villageCanvas');
  var dpr = window.devicePixelRatio || 1;
  var SW  = c ? c.width/dpr : window.innerWidth;
  return Math.max(-100, Math.min(x, WORLD_W - SW/CAM.zoom + 100));
}
function _clampCamY(y) {
  var c   = document.getElementById('villageCanvas');
  var dpr = window.devicePixelRatio || 1;
  var SH  = c ? c.height/dpr : window.innerHeight;
  return Math.max(-80, Math.min(y, WORLD_H - SH/CAM.zoom + 80));
}

// ================================================================
// UTILITAIRES
// ================================================================
function _buildShape(x, y, s, L, R, T) {
  var hw=s*0.44, hh=s*0.46, th=s*0.17;
  ctx.beginPath(); ctx.moveTo(x-hw,y); ctx.lineTo(x,y-hh); ctx.lineTo(x,y-hh-th*0.5); ctx.lineTo(x-hw,y-th*0.5); ctx.closePath(); ctx.fillStyle=L; ctx.fill();
  ctx.beginPath(); ctx.moveTo(x,y-hh); ctx.lineTo(x+hw,y); ctx.lineTo(x+hw,y-th*0.5); ctx.lineTo(x,y-hh-th*0.5); ctx.closePath(); ctx.fillStyle=R; ctx.fill();
  ctx.beginPath(); ctx.moveTo(x-hw,y-th*0.5); ctx.lineTo(x,y-hh-th); ctx.lineTo(x+hw,y-th*0.5); ctx.lineTo(x,y-th*0.18); ctx.closePath(); ctx.fillStyle=T; ctx.fill();
  ctx.strokeStyle='rgba(0,0,0,0.10)'; ctx.lineWidth=0.8; ctx.stroke();
}
function _rrect(x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r); ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath(); }
function _shade(hex,p){ var c=hex.replace('#',''); if(c.length===3)c=c[0]+c[0]+c[1]+c[1]+c[2]+c[2]; if(c.length<6)return '#4ecf70'; var r=parseInt(c.slice(0,2),16),g=parseInt(c.slice(2,4),16),b=parseInt(c.slice(4,6),16); return 'rgb('+Math.max(0,Math.min(255,Math.round(r+r*p)))+','+Math.max(0,Math.min(255,Math.round(g+g*p)))+','+Math.max(0,Math.min(255,Math.round(b+b*p)))+')'; }

// ================================================================
// NAV BAR + MÉTÉO + COMPATIBILITÉ
// ================================================================
var _NL = { village:{fr:'Krova',en:'Krova',ht:'Krova'}, lessons:{fr:'Leçons',en:'Lessons',ht:'Leson'}, practice:{fr:'Pratique',en:'Practice',ht:'Pratik'}, alphabet:{fr:'Langues',en:'Languages',ht:'Lang'}, profile:{fr:'Profil',en:'Profile',ht:'Pwofil'} };
function _buildNavBar(){
  var old=document.querySelector('.village-nav-bar'); if(old)old.remove();
  var vs=document.getElementById('screen-village'); if(!vs)return;
  var tl=(window.S&&S.targetLang)||'fr';
  var tabs=[{id:'village',icon:'🏘️'},{id:'lessons',icon:'📖'},{id:'practice',icon:'💬'},{id:'alphabet',icon:'🔤'},{id:'profile',icon:'👤'}];
  var nav=document.createElement('nav'); nav.className='village-nav-bar';
  nav.innerHTML=tabs.map(function(t){ var lb=(_NL[t.id]&&(_NL[t.id][tl]||_NL[t.id].fr))||t.id; return '<button class="vnb-btn'+(t.id==='village'?' active':'')+'" id="vnb-'+t.id+'" onclick="window._navTo(\''+t.id+'\')"><span class="vnb-icon">'+t.icon+'</span><span class="vnb-label">'+lb+'</span></button>'; }).join('');
  vs.appendChild(nav);
  if(!document.getElementById('vnb-css')){
    var st=document.createElement('style'); st.id='vnb-css';
    st.textContent='.village-nav-bar{flex-shrink:0;display:flex;align-items:stretch;justify-content:space-around;background:rgba(6,8,16,0.98);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,0.06);padding:6px 0 max(6px,env(safe-area-inset-bottom));z-index:30;}.vnb-btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;background:none;border:none;color:rgba(255,255,255,0.32);font-size:0.58rem;font-weight:800;letter-spacing:0.03em;padding:6px 0;cursor:pointer;transition:color 0.18s;-webkit-tap-highlight-color:transparent;}.vnb-btn.active{color:#4ecf70;}.vnb-btn:active{opacity:0.7;}.vnb-icon{font-size:1.25rem;line-height:1;transition:transform 0.18s;}.vnb-btn.active .vnb-icon{transform:scale(1.18);}.vnb-label{font-size:0.56rem;font-family:Sora,Nunito,system-ui;}';
    document.head.appendChild(st);
  }
}
window._navTo=function(s){
  document.querySelectorAll('.vnb-btn').forEach(function(b){b.classList.remove('active');});
  var btn=document.getElementById('vnb-'+s); if(btn)btn.classList.add('active');
  switch(s){
    case 'village': window._villageLoopActive=true;window._villageLoopRunning=true;requestAnimationFrame(_loop);break;
    case 'lessons': window._villageLoopActive=false;if(typeof ensureLearningBindings==='function')ensureLearningBindings();var fk=window.VOCAB?Object.keys(window.VOCAB)[0]:null;if(fk&&typeof loadVocab==='function')loadVocab(fk);if(typeof showScreen==='function')showScreen('screen-vocab');break;
    case 'practice': window._villageLoopActive=false;var fp=window.PHRASES_DATA?Object.keys(window.PHRASES_DATA)[0]:null;if(fp&&typeof loadPhrases==='function')loadPhrases(fp);if(typeof showScreen==='function')showScreen('screen-phrases');break;
    case 'alphabet': window._villageLoopActive=false;if(typeof openAlphabet==='function')openAlphabet((window.S&&S.targetLang)||'en',(window.S&&S.nativeLang)||'fr');break;
    case 'profile': window._villageLoopActive=false;if(typeof showScreen==='function')showScreen('screen-profile');break;
  }
};
function setWeather(w){window.currentWeather=w||'sun';}
function getWeatherForTime(){var h=new Date().getHours();if(h>=21||h<6)return 'night';return Math.random()<0.10?'rain':'sun';}
function updateTime(){var e=document.getElementById('hudTime');if(e){var n=new Date();e.textContent=('0'+n.getHours()).slice(-2)+':'+('0'+n.getMinutes()).slice(-2);}var we=document.getElementById('hudWeather');if(we&&window.WEATHER_ICONS)we.textContent=WEATHER_ICONS[currentWeather]||'☀️';}
function alignLocationsToRings(){}
function initCanvas(){_initCanvas();}
function drawVillage(){_draw();}
window.goVillage=goVillage;window.setWeather=setWeather;window.updateTime=updateTime;window.initCanvas=initCanvas;window.drawVillage=drawVillage;window.alignLocationsToRings=alignLocationsToRings;
console.log('✅ village_world.js — KROVA MAP scrollable+zoom+vie');
