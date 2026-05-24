// LinguaVillage — village.js  ILLUSTRATED MAP EDITION (CORRIGÉ COMPLET)
// Corrections intégrées :
// - Clic sur bâtiment → ouvre dialogue direct avec PNJ associé
// - Barre de navigation : bouton "Leçons" redirige vers screen-vocab
// - Tooltip au survol pour plus d'immersion
// ================================================================

window.canvas  = null;
window.ctx     = null;
window.tick    = 0;
window.currentWeather = window.currentWeather || 'sun';
window.hoveredLoc     = null;

// ================================================================
// ZONES DE PROGRESSION
// ================================================================
window.VILLAGE_ZONES = [
  {
    id: 'zero', num: 1,
    label:    { fr:'Débutant',      en:'Beginner',     es:'Principiante',  ht:'Debitant'  },
    sublabel: { fr:'Les bases',     en:'The basics',   es:'Las bases',     ht:'Baz yo'    },
    xpRequired: 0,   color: '#4ecf70',
    type: 'cottage',   // chaumière toit de chaume
    state: 'done'
  },
  {
    id: 'beginner', num: 2,
    label:    { fr:'Élémentaire',   en:'Elementary',   es:'Elemental',     ht:'Elemantè'  },
    sublabel: { fr:'Se présenter',  en:'Introduce',    es:'Presentarse',   ht:'Prezante'  },
    xpRequired: 100,  color: '#f9c74f',
    type: 'shop',      // boutique à auvent
    state: 'star'
  },
  {
    id: 'elementary', num: 3,
    label:    { fr:'Intermédiaire', en:'Intermediate', es:'Intermedio',    ht:'Entèmedyè' },
    sublabel: { fr:'Parler au quotidien', en:'Daily talk', es:'Diálogo',  ht:'Pale chak jou' },
    xpRequired: 300,  color: '#4a9eff',
    type: 'inn',       // auberge bleue
    state: 'star'
  },
  {
    id: 'intermediate', num: 4,
    label:    { fr:'Avancé',        en:'Advanced',     es:'Avanzado',      ht:'Avanse'    },
    sublabel: { fr:"S'exprimer avec aisance", en:'Speak with ease', es:'Fluidez', ht:'Pale libman' },
    xpRequired: 600,  color: '#ff9f43',
    type: 'mansion',   // maison de ville
    state: 'locked'
  },
  {
    id: 'advanced', num: 5,
    label:    { fr:'Maîtrise',      en:'Mastery',      es:'Maestría',      ht:'Mètrize'   },
    sublabel: { fr:'Comme un·e natif·ve', en:'Like a native', es:'Como nativo', ht:'Tankou natif' },
    xpRequired: 1000, color: '#e040fb',
    type: 'castle',    // château
    state: 'locked'
  }
];

// ================================================================
// MAPPING ZONE -> PNJ (pour ouvrir le dialogue)
// ================================================================
const ZONE_TO_NPC = {
  zero:      { locId: 'school',   npcId: 'teacher'   },  // cottage → professeur
  beginner:  { locId: 'market',   npcId: 'merchant'  },  // boutique → marchand
  elementary:{ locId: 'tavern',   npcId: 'bartender' },  // auberge → barman
  intermediate:{ locId: 'hospital', npcId: 'doctor'   },  // mansion → médecin
  advanced:  { locId: 'church',   npcId: 'pastor'    }   // château → pasteur
};

// ================================================================
// ÉTAT
// ================================================================
var _isoState = {
  scrollX: 0, targetScrollX: 0,
  isDragging: false, dragStartX: 0, dragScrollX: 0,
  hoveredBuilding: null,
  particles: [], clouds: [],
  initialized: false
};

// ================================================================
// POINT D'ENTRÉE
// ================================================================
function goVillage() {
  if (!window.S) return;

  var hudPlayer = document.getElementById('hudPlayer');
  var hudLang   = document.getElementById('hudLang');
  var hudXP     = document.getElementById('hudXP');
  if (hudPlayer) hudPlayer.textContent = '👤 ' + (S.playerName || '');
  if (hudLang)   hudLang.textContent   = ((FLAGS && FLAGS[S.targetLang]) || '') + ' ' + ((LANG_NAMES && LANG_NAMES[S.targetLang]) || '');
  if (hudXP)     hudXP.textContent     = (S.xp || 0) + ' XP';

  if (typeof window.showScreen === 'function') window.showScreen('screen-village');
  else {
    document.querySelectorAll('.screen').forEach(function(s){ s.classList.remove('active'); s.style.display=''; });
    var vs = document.getElementById('screen-village');
    if (vs) vs.classList.add('active');
  }

  canvas = null; ctx = null; tick = 0;
  window._villageLoopRunning = false;
  window._villageLoopActive  = false;
  _isoState.initialized = false;

  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      _initIsoCanvas();
      _buildNavBar();
      setTimeout(function(){ _scrollToZone(0, true); }, 150);
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

  var dpr  = window.devicePixelRatio || 1;
  var nav  = document.querySelector('.village-nav-bar');
  var hud  = document.querySelector('.village-hud');
  var hudH = (hud ? hud.getBoundingClientRect().height : 52)
           + (nav ? nav.getBoundingClientRect().height : 56);
  var W = (window.visualViewport ? window.visualViewport.width  : null) || window.innerWidth  || 360;
  var H = Math.max(200, ((window.visualViewport ? window.visualViewport.height : null) || window.innerHeight || 640) - hudH);

  c.width  = W * dpr; c.height = H * dpr;
  c.style.width  = W + 'px'; c.style.height = H + 'px';
  c.style.display = 'block'; c.style.cursor = 'grab';

  _isoState.clouds = _genClouds(W, H);
  _isoState.particles = [];
  _isoState.initialized = true;

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

  if (window._onCanvasResize) window.removeEventListener('resize', window._onCanvasResize);
  window._onCanvasResize = function(){ _initIsoCanvas(); };
  window.addEventListener('resize', window._onCanvasResize);

  if (!window._villageLoopRunning) {
    window._villageLoopRunning = true;
    window._villageLoopActive  = true;
    requestAnimationFrame(_isoLoop);
  }
}

// ================================================================
// BOUCLE
// ================================================================
function _isoLoop() {
  if (!window._villageLoopActive) return;
  tick++;
  _isoState.scrollX += (_isoState.targetScrollX - _isoState.scrollX) * 0.10;
  _drawVillage();
  requestAnimationFrame(_isoLoop);
}

// ================================================================
// LAYOUT
// ================================================================
function _zoneCount()  { return window.VILLAGE_ZONES.length; }
function _zoneSpacing(W) { return W * 0.36; }
function _totalWidth(W)  { return _zoneSpacing(W) * (_zoneCount() - 1) + W * 0.5; }
function _zoneX(i, W)    { return W * 0.22 + i * _zoneSpacing(W) - _isoState.scrollX; }
function _groundY(H)     { return H * 0.60; }

function _scrollToZone(i, instant) {
  var c = document.getElementById('villageCanvas');
  if (!c) return;
  var dpr = window.devicePixelRatio || 1;
  var W   = c.width / dpr;
  var tx  = _zoneX(i, W) + _isoState.scrollX - W * 0.35;
  tx = Math.max(0, Math.min(tx, Math.max(0, _totalWidth(W) - W)));
  if (instant) _isoState.scrollX = tx;
  _isoState.targetScrollX = tx;
}
function _clampScroll(W) {
  var max = Math.max(0, _totalWidth(W) - W);
  _isoState.targetScrollX = Math.max(0, Math.min(_isoState.targetScrollX, max));
}

// ================================================================
// DESSIN PRINCIPAL
// ================================================================
function _drawVillage() {
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

  _drawSky(W, H);
  _drawMountains(W, H);
  _drawClouds(W, H);
  _drawGround(W, H);
  _drawRiver(W, H);
  _drawTrees(W, H);
  _drawPath(W, H);
  _drawAllBuildings(W, H);
  _drawBadges(W, H);
  _drawParticles(W, H);
  _drawSun(W, H);

  ctx.restore();
}

// ── SKY ──────────────────────────────────────────────────────────
function _drawSky(W, H) {
  var g = ctx.createLinearGradient(0, 0, 0, H * 0.62);
  g.addColorStop(0,   '#8ec9f0');
  g.addColorStop(0.5, '#b8dff5');
  g.addColorStop(1,   '#d6eefc');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

// ── SOLEIL ────────────────────────────────────────────────────────
function _drawSun(W, H) {
  var x = W * 0.82, y = H * 0.10;
  var halo = ctx.createRadialGradient(x, y, 0, x, y, 55);
  halo.addColorStop(0,   'rgba(255,235,80,0.28)');
  halo.addColorStop(1,   'rgba(255,235,80,0)');
  ctx.fillStyle = halo; ctx.fillRect(x-55,y-55,110,110);
  ctx.beginPath(); ctx.arc(x, y, 20, 0, Math.PI*2);
  ctx.fillStyle = '#ffe87a'; ctx.fill();
  for (var r = 0; r < 8; r++) {
    var a = (r/8)*Math.PI*2 + tick*0.003;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a)*24, y + Math.sin(a)*24);
    ctx.lineTo(x + Math.cos(a)*34, y + Math.sin(a)*34);
    ctx.strokeStyle = 'rgba(255,220,50,0.5)'; ctx.lineWidth = 2.5; ctx.stroke();
  }
}

// ── NUAGES ────────────────────────────────────────────────────────
function _genClouds(W, H) {
  var out = [];
  for (var i = 0; i < 6; i++) {
    out.push({ x: W*(0.04+i*0.18), y: H*(0.06+(i%3)*0.05), r: 20+i*6, speed: 0.10+i*0.04 });
  }
  return out;
}
function _drawClouds(W, H) {
  _isoState.clouds.forEach(function(cl) {
    cl.x += cl.speed;
    if (cl.x > W + cl.r*3) cl.x = -cl.r*3;
    ctx.save(); ctx.globalAlpha = 0.90; ctx.fillStyle = '#ffffff';
    var puffs = [
      [cl.x,          cl.y,         cl.r       ],
      [cl.x+cl.r*0.7, cl.y+cl.r*0.1, cl.r*0.72],
      [cl.x-cl.r*0.7, cl.y+cl.r*0.15,cl.r*0.60],
      [cl.x+cl.r*0.1, cl.y+cl.r*0.38,cl.r*0.85],
      [cl.x-cl.r*0.3, cl.y+cl.r*0.28,cl.r*0.55],
    ];
    puffs.forEach(function(p){ ctx.beginPath(); ctx.arc(p[0],p[1],p[2],0,Math.PI*2); ctx.fill(); });
    ctx.restore();
  });
}

// ── MONTAGNES ─────────────────────────────────────────────────────
function _drawMountains(W, H) {
  var peaks = [
    { x:W*0.02, y:H*0.40, w:W*0.20, c:'#7bbf80' },
    { x:W*0.16, y:H*0.32, w:W*0.16, c:'#5ea86a' },
    { x:W*0.38, y:H*0.36, w:W*0.18, c:'#72b87a' },
    { x:W*0.56, y:H*0.30, w:W*0.18, c:'#5ea86a' },
    { x:W*0.74, y:H*0.34, w:W*0.16, c:'#72b87a' },
    { x:W*0.90, y:H*0.28, w:W*0.18, c:'#5ea86a' },
    { x:W*1.05, y:H*0.33, w:W*0.16, c:'#7bbf80' },
  ];
  peaks.forEach(function(p) {
    var bY = H*0.555;
    ctx.beginPath();
    ctx.moveTo(p.x - p.w*0.5, bY);
    ctx.lineTo(p.x, p.y);
    ctx.lineTo(p.x + p.w*0.5, bY);
    ctx.closePath();
    ctx.fillStyle = _shadeColor(p.c, -0.18);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(p.x - p.w*0.08, p.y+p.w*0.10);
    ctx.lineTo(p.x, p.y);
    ctx.lineTo(p.x + p.w*0.5, bY);
    ctx.lineTo(p.x - p.w*0.08, bY);
    ctx.closePath();
    ctx.fillStyle = p.c;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(p.x-p.w*0.07, p.y+p.w*0.09);
    ctx.lineTo(p.x, p.y);
    ctx.lineTo(p.x+p.w*0.07, p.y+p.w*0.09);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.fill();
  });
}

// ── SOL HERBEUX ───────────────────────────────────────────────────
function _drawGround(W, H) {
  var gY = _groundY(H);
  var g = ctx.createLinearGradient(0, gY-10, 0, H);
  g.addColorStop(0,   '#68c05a');
  g.addColorStop(0.25,'#52a846');
  g.addColorStop(1,   '#3e9038');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, gY+4);
  ctx.bezierCurveTo(W*0.3, gY-16, W*0.7, gY+12, W, gY+2);
  ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(130,220,100,0.22)';
  ctx.beginPath();
  ctx.moveTo(0, gY+4);
  ctx.bezierCurveTo(W*0.3, gY-16, W*0.7, gY+12, W, gY+2);
  ctx.lineTo(W, gY+18);
  ctx.bezierCurveTo(W*0.7, gY+28, W*0.3, gY+0, 0, gY+20);
  ctx.closePath();
  ctx.fill();
  _drawFlowers(W, H, gY);
}

function _drawFlowers(W, H, gY) {
  var spots = [0.08, 0.15, 0.26, 0.45, 0.72, 0.85, 0.94];
  spots.forEach(function(fx, i) {
    var px = fx * W, py = gY + 6 + (i%3)*8;
    if (i%2===0) {
      ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI*2);
      ctx.fillStyle = '#9b59b6'; ctx.fill();
    } else {
      ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI*2);
      ctx.fillStyle = '#f1c40f'; ctx.fill();
    }
  });
}

// ── CHEMIN DE PIERRES ─────────────────────────────────────────────
function _drawPath(W, H) {
  var gY    = _groundY(H);
  var total = _totalWidth(W);
  var sx    = _isoState.scrollX;
  var n     = _zoneCount();

  ctx.save();
  ctx.strokeStyle = '#a07840';
  ctx.lineWidth   = W * 0.062;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  for (var i = 0; i <= n; i++) {
    var px = _zoneX(i < n ? i : n-1, W) + (i === n ? _zoneSpacing(W) * 0.3 : 0);
    var py = gY + 5 + Math.sin(i * 1.9) * H * 0.018;
    if (i === 0) ctx.moveTo(px - W*0.22, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  ctx.strokeStyle = '#d4aa6a';
  ctx.lineWidth   = W * 0.056;
  ctx.beginPath();
  for (var i = 0; i <= n; i++) {
    var px = _zoneX(i < n ? i : n-1, W) + (i === n ? _zoneSpacing(W) * 0.3 : 0);
    var py = gY + 5 + Math.sin(i * 1.9) * H * 0.018;
    if (i === 0) ctx.moveTo(px - W*0.22, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  ctx.fillStyle = 'rgba(160,120,65,0.40)';
  for (var j = 0; j < 70; j++) {
    var t    = j / 70;
    var px2  = (t * (total + W * 0.3)) - sx;
    if (px2 < -20 || px2 > W + 20) continue;
    var py2  = gY + 5 + Math.sin(j * 1.2) * H * 0.018;
    ctx.beginPath();
    ctx.ellipse(px2, py2, 8+j%3, 4, j*0.3, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
}

// ── RIVIÈRE ───────────────────────────────────────────────────────
function _drawRiver(W, H) {
  var gY = _groundY(H);
  var rx = _zoneX(3, W) + _zoneSpacing(W) * 0.18;
  if (rx < -W*0.15 || rx > W*1.15) return;

  ctx.save();
  var rg = ctx.createLinearGradient(rx-22, 0, rx+22, 0);
  rg.addColorStop(0,   '#3a8abf');
  rg.addColorStop(0.4, '#5ab4da');
  rg.addColorStop(1,   '#3a8abf');
  ctx.fillStyle = rg;
  ctx.beginPath();
  ctx.moveTo(rx-20, gY-H*0.06);
  ctx.bezierCurveTo(rx-26, gY+H*0.02, rx+26, gY+H*0.04, rx+20, H*1.0);
  ctx.bezierCurveTo(rx+30, gY+H*0.04, rx-14, gY+H*0.02, rx-10, gY-H*0.06);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 0.30;
  ctx.fillStyle   = '#aaddee';
  for (var k = 0; k < 5; k++) {
    var ry = gY + k*H*0.05 - H*0.01;
    ctx.fillRect(rx-7+k*1.5, ry, 14-k*2, 3);
  }
  ctx.globalAlpha = 1;

  var by = gY + H*0.038;
  ctx.fillStyle   = '#a07830';
  ctx.strokeStyle = '#7a5a18';
  ctx.lineWidth   = 1.5;
  _rrect(ctx, rx-30, by-7, 60, 12, 3);
  ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#6b4a10';
  ctx.lineWidth   = 3;
  ctx.beginPath();
  ctx.arc(rx, by+24, 26, Math.PI, 0);
  ctx.stroke();
  ctx.fillStyle = '#b88820';
  for (var p = -4; p <= 4; p++) {
    _rrect(ctx, rx+p*7-2, by-17, 4, 11, 1);
    ctx.fill();
  }
  var bx = rx + 36 + Math.sin(tick*0.015)*4;
  var boatY = gY + H*0.06;
  ctx.fillStyle   = '#8b5c18';
  ctx.strokeStyle = '#5a3a08';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(bx-12, boatY);
  ctx.lineTo(bx+12, boatY);
  ctx.lineTo(bx+9,  boatY+7);
  ctx.lineTo(bx-9,  boatY+7);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.restore();
}

// ── ARBRES ────────────────────────────────────────────────────────
function _drawTrees(W, H) {
  var gY = _groundY(H);
  var positions = [];
  for (var i = 0; i < _zoneCount() + 1; i++) {
    var zx = _zoneX(i, W);
    positions.push({ x:zx-W*0.15, y:gY,        s:0.58 });
    positions.push({ x:zx+W*0.15, y:gY,        s:0.50 });
    positions.push({ x:zx-W*0.08, y:gY+H*0.02, s:0.36 });
    positions.push({ x:zx+W*0.09, y:gY+H*0.01, s:0.42 });
  }
  var mx = _zoneX(4, W) + W*0.09;
  if (mx > -40 && mx < W+40) _drawWindmill(mx, gY - H*0.05, H);

  positions.forEach(function(t) {
    if (t.x < -50 || t.x > W+50) return;
    _drawTree(t.x, t.y, t.s, H);
  });
}

function _drawTree(x, y, scale, H) {
  var s = scale * H * 0.085;
  ctx.fillStyle = '#6b4226';
  _rrect(ctx, x-s*0.11, y-s*0.28, s*0.22, s*0.32, 2);
  ctx.fill();
  [
    { dy:-s*0.22, r:s*0.45, c:'#2d8a3a' },
    { dy:-s*0.52, r:s*0.38, c:'#38a848' },
    { dy:-s*0.78, r:s*0.28, c:'#4ecf5a' },
  ].forEach(function(l) {
    ctx.beginPath(); ctx.arc(x, y+l.dy, l.r, 0, Math.PI*2);
    ctx.fillStyle = l.c; ctx.fill();
  });
}

function _drawWindmill(x, y, H) {
  var h = H * 0.14;
  ctx.fillStyle = '#c9a86c';
  ctx.beginPath();
  ctx.moveTo(x-h*0.18, y+h);
  ctx.lineTo(x+h*0.18, y+h);
  ctx.lineTo(x+h*0.10, y);
  ctx.lineTo(x-h*0.10, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#9b59b6';
  ctx.beginPath();
  ctx.moveTo(x-h*0.14, y);
  ctx.lineTo(x, y-h*0.26);
  ctx.lineTo(x+h*0.14, y);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#8b6914'; ctx.lineWidth = 2.5;
  for (var a = 0; a < 4; a++) {
    var ang = (a/4)*Math.PI*2 + tick*0.008;
    ctx.beginPath();
    ctx.moveTo(x, y-h*0.04);
    ctx.lineTo(x+Math.cos(ang)*h*0.25, y-h*0.04+Math.sin(ang)*h*0.25);
    ctx.stroke();
  }
}

// ── BÂTIMENTS ─────────────────────────────────────────────────────
function _drawAllBuildings(W, H) {
  var gY  = _groundY(H);
  var xp  = (window.S && S.xp) || 0;
  var nl  = (window.S && S.nativeLang) || 'fr';

  window.VILLAGE_ZONES.forEach(function(zone, zi) {
    var zx       = _zoneX(zi, W);
    var unlocked = xp >= zone.xpRequired;
    if (zx < -W*0.45 || zx > W*1.45) return;

    var bob  = Math.sin(tick*0.020 + zi*0.8) * 2;
    var hov  = _isoState.hoveredBuilding === zone.id;
    var sc   = hov ? 1.08 : 1.0;
    var bSize = H * 0.19;

    ctx.save();
    ctx.translate(zx, gY - bSize*0.55 + bob);
    ctx.scale(sc, sc);

    if (!unlocked) {
      ctx.globalAlpha = 0.45;
      _drawBuilding(zone.type, 0, 0, bSize, '#888', '#666');
      ctx.globalAlpha = 1;
      ctx.font = Math.round(bSize*0.44)+'px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🔒', 0, bSize*0.15);
    } else {
      if (hov) {
        ctx.save();
        ctx.shadowColor = zone.color; ctx.shadowBlur = 20; ctx.globalAlpha = 0.3;
        ctx.beginPath(); ctx.arc(0, 0, bSize*0.65, 0, Math.PI*2);
        ctx.fillStyle = zone.color; ctx.fill();
        ctx.restore();
      }
      _drawBuilding(zone.type, 0, 0, bSize, zone.color, _shadeColor(zone.color, -0.25));
    }
    ctx.restore();

    if (unlocked) {
      var st = zone.state;
      if (st === 'done') {
        ctx.save();
        ctx.beginPath(); ctx.arc(zx, gY+H*0.038, H*0.028, 0, Math.PI*2);
        ctx.fillStyle = '#4ecf70'; ctx.fill();
        ctx.font = 'bold '+Math.round(H*0.025)+'px sans-serif';
        ctx.textAlign = 'center'; ctx.fillStyle = '#fff';
        ctx.fillText('✓', zx, gY+H*0.038+H*0.01);
        ctx.restore();
      } else if (st === 'star') {
        ctx.save();
        ctx.beginPath(); ctx.arc(zx, gY+H*0.038, H*0.028, 0, Math.PI*2);
        ctx.fillStyle = '#f9c74f'; ctx.fill();
        ctx.font = Math.round(H*0.028)+'px serif';
        ctx.textAlign = 'center';
        ctx.fillText('⭐', zx, gY+H*0.038+H*0.011);
        ctx.restore();
      }
    } else {
      ctx.save();
      ctx.beginPath(); ctx.arc(zx, gY+H*0.038, H*0.026, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(80,80,80,0.55)'; ctx.fill();
      ctx.font = Math.round(H*0.026)+'px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🔒', zx, gY+H*0.038+H*0.010);
      ctx.restore();
    }
  });
}

function _drawBuilding(type, x, y, s, mainCol, darkCol) {
  if (type === 'cottage')  _drawCottage(x, y, s, mainCol, darkCol);
  else if (type === 'shop')   _drawShop(x, y, s, mainCol, darkCol);
  else if (type === 'inn')    _drawInn(x, y, s, mainCol, darkCol);
  else if (type === 'mansion')_drawMansion(x, y, s, mainCol, darkCol);
  else if (type === 'castle') _drawCastle(x, y, s, mainCol, darkCol);
}

function _drawCottage(x, y, s, col, dark) {
  var w = s*0.70, h = s*0.55, rh = s*0.44;
  ctx.fillStyle = '#f5deb3';
  _rrect(ctx, x-w/2, y-h, w, h, 4); ctx.fill();
  ctx.strokeStyle = '#c8a87a'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(x-w/2-s*0.05, y-h+2);
  ctx.lineTo(x, y-h-rh);
  ctx.lineTo(x+w/2+s*0.05, y-h+2);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = dark; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = '#87ceeb';
  _rrect(ctx, x-w*0.26, y-h*0.68, w*0.24, h*0.30, 2); ctx.fill();
  _rrect(ctx, x+w*0.04, y-h*0.68, w*0.24, h*0.30, 2); ctx.fill();
  ctx.fillStyle = '#8b5e3c';
  _rrect(ctx, x-w*0.12, y-h*0.44, w*0.24, h*0.44, 3); ctx.fill();
  ctx.fillStyle = '#c0a06a';
  ctx.fillRect(x+w*0.15, y-h-rh+rh*0.22, s*0.10, s*0.22);
  for (var fi=0;fi<3;fi++){
    ctx.save(); ctx.globalAlpha=0.35;
    ctx.beginPath(); ctx.arc(x+w*0.20, y-h-rh+rh*0.10-fi*8-Math.sin(tick*0.04+fi)*3, 4+fi*1.5, 0, Math.PI*2);
    ctx.fillStyle='#ccc'; ctx.fill(); ctx.restore();
  }
  _drawSmallTree(x+w/2+s*0.15, y, s*0.55);
}

function _drawShop(x, y, s, col, dark) {
  var w = s*0.74, h = s*0.58;
  ctx.fillStyle = '#f0e0c0';
  _rrect(ctx, x-w/2, y-h, w, h, 4); ctx.fill();
  ctx.strokeStyle = '#c0a060'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = col;
  _rrect(ctx, x-w/2-4, y-h-s*0.06, w+8, s*0.12, 3); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.globalAlpha = 0.35;
  for (var ai=0; ai<5; ai++) {
    ctx.fillRect(x-w/2-4+ai*(w+8)/5, y-h-s*0.06, (w+8)/10, s*0.12);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#f9c74f'; _rrect(ctx, x-w*0.30, y-h*0.90, w*0.60, h*0.22, 3); ctx.fill();
  ctx.fillStyle = '#87ceeb';
  _rrect(ctx, x-w*0.28, y-h*0.62, w*0.22, h*0.28, 2); ctx.fill();
  _rrect(ctx, x+w*0.06, y-h*0.62, w*0.22, h*0.28, 2); ctx.fill();
  ctx.fillStyle = '#8b5e3c'; _rrect(ctx, x-w*0.10, y-h*0.40, w*0.20, h*0.40, 3); ctx.fill();
}

function _drawInn(x, y, s, col, dark) {
  var w = s*0.80, h = s*0.65, rh = s*0.38;
  ctx.fillStyle = '#d9c9a8';
  _rrect(ctx, x-w/2, y-h, w, h, 4); ctx.fill();
  ctx.strokeStyle = '#b0a080'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(x-w/2-6, y-h+3);
  ctx.lineTo(x, y-h-rh);
  ctx.lineTo(x+w/2+6, y-h+3);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = dark; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(x, y-h-rh*0.42, s*0.09, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle='#333'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(x,y-h-rh*0.42); ctx.lineTo(x,y-h-rh*0.42-s*0.06); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x,y-h-rh*0.42); ctx.lineTo(x+s*0.04,y-h-rh*0.42+s*0.02); ctx.stroke();
  ctx.fillStyle = '#87ceeb';
  [-w*0.28, 0, w*0.28].forEach(function(ox) {
    _rrect(ctx, x+ox-w*0.10, y-h*0.60, w*0.20, h*0.28, 2); ctx.fill();
  });
  ctx.fillStyle = '#5a3a18'; _rrect(ctx, x-w*0.13, y-h*0.38, w*0.26, h*0.38, 4); ctx.fill();
  ctx.fillStyle='#a07830'; ctx.fillRect(x-w*0.38, y-h*0.05, w*0.22, s*0.04);
  ctx.fillRect(x+w*0.16, y-h*0.05, w*0.22, s*0.04);
}

function _drawMansion(x, y, s, col, dark) {
  var w = s*0.88, h = s*0.75, rh = s*0.45;
  ctx.fillStyle = '#e8d8b8';
  _rrect(ctx, x-w/2, y-h, w, h, 4); ctx.fill();
  ctx.strokeStyle = '#b8a880'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = '#c05020';
  ctx.beginPath();
  ctx.moveTo(x-w/2-6, y-h+3); ctx.lineTo(x, y-h-rh); ctx.lineTo(x+w/2+6, y-h+3);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = dark; ctx.lineWidth=1.5; ctx.stroke();
  ctx.fillStyle = '#b84020';
  ctx.fillRect(x-w/2-2, y-h-rh*0.15, s*0.18, rh*0.82);
  ctx.fillStyle = '#d04025';
  ctx.beginPath();
  ctx.moveTo(x-w/2-2, y-h-rh*0.15);
  ctx.lineTo(x-w/2+s*0.09, y-h-rh*0.15-rh*0.40);
  ctx.lineTo(x-w/2+s*0.18, y-h-rh*0.15);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#87ceeb';
  [-w*0.28, 0, w*0.28].forEach(function(ox) {
    _rrect(ctx, x+ox-w*0.10, y-h*0.55, w*0.20, h*0.28, 2); ctx.fill();
  });
  ctx.fillStyle='#4a2810'; _rrect(ctx, x-w*0.13, y-h*0.38, w*0.26, h*0.38, 4); ctx.fill();
}

function _drawCastle(x, y, s, col, dark) {
  var w = s*0.96, h = s*0.82;
  ctx.fillStyle = '#d8c8a8';
  _rrect(ctx, x-w/2, y-h, w, h, 4); ctx.fill();
  ctx.strokeStyle = '#b0a080'; ctx.lineWidth=1.5; ctx.stroke();
  var tw = s*0.22, th = h*0.60;
  ctx.fillStyle = '#c8b890';
  ctx.strokeStyle = '#a09070'; ctx.lineWidth=1.5;
  [x-w/2+tw*0.05, x+w/2-tw*1.05].forEach(function(tx) {
    _rrect(ctx, tx, y-th, tw, th, 3); ctx.fill(); ctx.stroke();
    for(var cr=0;cr<3;cr++) ctx.fillRect(tx+cr*tw/3+1, y-th-s*0.07, tw/4, s*0.07);
    ctx.fillStyle='#87ceeb'; _rrect(ctx, tx+tw*0.22, y-th+th*0.22, tw*0.55, th*0.22, 2); ctx.fill();
    ctx.fillStyle='#c8b890';
  });
  ctx.fillStyle = '#9b59b6';
  [x-w/2+tw*0.05, x+w/2-tw*1.05].forEach(function(tx) {
    ctx.beginPath();
    ctx.moveTo(tx, y-th);
    ctx.lineTo(tx+tw/2, y-th-s*0.32);
    ctx.lineTo(tx+tw, y-th);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle='#7a3090'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(tx+tw/2, y-th-s*0.32); ctx.lineTo(tx+tw/2, y-th-s*0.32-s*0.14); ctx.stroke();
    ctx.fillStyle='#e040fb';
    ctx.beginPath(); ctx.moveTo(tx+tw/2, y-th-s*0.46); ctx.lineTo(tx+tw/2+s*0.07, y-th-s*0.40); ctx.lineTo(tx+tw/2, y-th-s*0.34); ctx.closePath(); ctx.fill();
  });
  ctx.fillStyle='#d8c8a8';
  for (var cr=0;cr<6;cr++) ctx.fillRect(x-w*0.35+cr*w/8, y-h-s*0.07, w/10, s*0.07);
  ctx.fillStyle='#3a2208'; 
  ctx.beginPath(); ctx.moveTo(x-w*0.13, y-h*0.38); ctx.lineTo(x+w*0.13, y-h*0.38); ctx.arc(x, y-h*0.38, w*0.13, 0, Math.PI, true); ctx.closePath(); ctx.fill();
  ctx.strokeStyle='#6a4010'; ctx.lineWidth=1.5;
  for(var hb=0;hb<3;hb++) { ctx.beginPath(); ctx.moveTo(x-w*0.08+hb*w*0.08, y-h*0.38); ctx.lineTo(x-w*0.08+hb*w*0.08, y-h*0.38-h*0.20); ctx.stroke(); }
  ctx.font=Math.round(s*0.18)+'px serif'; ctx.textAlign='center';
  ctx.fillText('⭐', x+w/2-s*0.06, y-h-s*0.06);
}

function _drawSmallTree(x, y, s) {
  ctx.fillStyle='#6b4226'; ctx.fillRect(x-2, y-s*0.18, 4, s*0.20);
  ctx.fillStyle='#2d8a3a'; ctx.beginPath(); ctx.arc(x,y-s*0.28,s*0.22,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#38a848'; ctx.beginPath(); ctx.arc(x,y-s*0.44,s*0.17,0,Math.PI*2); ctx.fill();
}

// ── BADGES DE NIVEAU ─────────────────────────────────────────────
function _drawBadges(W, H) {
  var xp = (window.S && S.xp) || 0;
  var nl = (window.S && S.nativeLang) || 'fr';

  window.VILLAGE_ZONES.forEach(function(zone, zi) {
    var zx       = _zoneX(zi, W);
    var unlocked = xp >= zone.xpRequired;
    if (zx < -W*0.45 || zx > W*1.45) return;

    var by     = H * 0.065;
    var bw     = Math.min(W * 0.24, 100);
    var bh     = 44;
    var bgCol  = unlocked ? zone.color : '#666';
    var txCol  = unlocked ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.55)';

    ctx.save();
    ctx.shadowColor='rgba(0,0,0,0.22)'; ctx.shadowBlur=6; ctx.shadowOffsetY=2;
    ctx.fillStyle = bgCol;
    _rrect(ctx, zx-bw/2, by, bw, bh, 10); ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath(); ctx.arc(zx-bw/2+16, by+bh/2, 12, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold '+Math.round(H*0.018)+'px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(zone.num, zx-bw/2+16, by+bh/2+H*0.007);

    ctx.fillStyle = txCol;
    ctx.font = 'bold '+Math.round(H*0.017)+'px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(zone.label[nl]||zone.label.fr, zx-bw/2+34, by+bh*0.42);
    ctx.fillStyle = unlocked ? 'rgba(0,0,0,0.50)' : 'rgba(255,255,255,0.35)';
    ctx.font = Math.round(H*0.013)+'px system-ui, sans-serif';
    ctx.fillText(zone.sublabel[nl]||zone.sublabel.fr, zx-bw/2+34, by+bh*0.72);

    ctx.strokeStyle = unlocked ? zone.color : 'rgba(150,150,150,0.3)';
    ctx.lineWidth   = 1.5;
    ctx.setLineDash([4,4]);
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(zx, by+bh);
    ctx.lineTo(zx, _groundY(H)-H*0.27);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  });
}

// ── PARTICULES ────────────────────────────────────────────────────
function _drawParticles(W, H) {
  if (tick % 14 === 0 && _isoState.particles.length < 18) {
    _isoState.particles.push({
      x: Math.random()*W, y: _groundY(H)-Math.random()*H*0.22,
      vx:(Math.random()-0.5)*0.6, vy:-0.4-Math.random()*0.5,
      life:1, decay:0.014, r:2+Math.random()*3,
      color:['#4ecf70','#f9c74f','#ff9f43','#4a9eff'][Math.floor(Math.random()*4)]
    });
  }
  _isoState.particles = _isoState.particles.filter(function(p) {
    p.x+=p.vx; p.y+=p.vy; p.life-=p.decay;
    if (p.life<=0) return false;
    ctx.save(); ctx.globalAlpha=p.life*0.50;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=p.color; ctx.fill(); ctx.restore();
    return true;
  });
}

// ================================================================
// HIT TEST
// ================================================================
function _hitTest(mx, my, W, H) {
  var gY = _groundY(H);
  var bS = H * 0.19;
  var result = null;
  window.VILLAGE_ZONES.forEach(function(zone, zi) {
    var zx = _zoneX(zi, W);
    var bY = gY - bS*0.55;
    var dx = mx - zx, dy = my - bY;
    if (Math.abs(dx) < bS*0.52 && Math.abs(dy) < bS*0.72) result = zone.id;
  });
  return result;
}

// ================================================================
// CLIC SUR BÂTIMENT (CORRIGÉ)
// ================================================================
function _onBuildingClick(id) {
  var zone = window.VILLAGE_ZONES.find(function(z){ return z.id === id; });
  if (!zone) return;
  var xp = (window.S && S.xp) || 0;
  if (xp < zone.xpRequired) {
    if (typeof showNotif === 'function') showNotif('🔒 Il te faut '+(zone.xpRequired-xp)+' XP de plus !');
    return;
  }
  var mapping = ZONE_TO_NPC[zone.id];
  if (mapping && typeof window.openDialogue === 'function') {
    openDialogue(mapping.locId, mapping.npcId);
  } else {
    if (typeof showScreen === 'function') {
      showScreen('screen-location');
      var t = document.getElementById('locTitle');
      var nl = (window.S&&S.nativeLang)||'fr';
      if (t) t.textContent = (zone.label[nl]||zone.label.fr);
    }
  }
}

// ================================================================
// ÉVÉNEMENTS (avec tooltip)
// ================================================================
var _touchStartX=0, _touchScrollX=0;
function _onIsoTouchStart(e){ e.preventDefault(); _touchStartX=e.touches[0].clientX; _touchScrollX=_isoState.targetScrollX; if(canvas)canvas.style.cursor='grabbing'; }
function _onIsoTouchMove(e){ e.preventDefault(); var dx=_touchStartX-e.touches[0].clientX; var dpr=window.devicePixelRatio||1; var W=canvas?canvas.width/dpr:360; _isoState.targetScrollX=_touchScrollX+dx; _clampScroll(W); }
function _onIsoTouchEnd(e){ if(canvas)canvas.style.cursor='grab'; var dpr=window.devicePixelRatio||1; var W=canvas?canvas.width/dpr:360; _snapNearest(W); }
function _onIsoMouseDown(e){ _isoState.isDragging=true; _isoState.dragStartX=e.clientX; _isoState.dragScrollX=_isoState.targetScrollX; if(canvas)canvas.style.cursor='grabbing'; }
function _onIsoMouseDrag(e){ if(!_isoState.isDragging)return; var dx=_isoState.dragStartX-e.clientX; var dpr=window.devicePixelRatio||1; var W=canvas?canvas.width/dpr:360; _isoState.targetScrollX=_isoState.dragScrollX+dx; _clampScroll(W); }
function _onIsoMouseUp(e){ if(_isoState.isDragging){ _isoState.isDragging=false; if(canvas)canvas.style.cursor='grab'; var dpr=window.devicePixelRatio||1; var W=canvas?canvas.width/dpr:360; _snapNearest(W); } }

function _onIsoHover(e){
  if(_isoState.isDragging) return;
  var rect = canvas.getBoundingClientRect();
  var dpr = window.devicePixelRatio || 1;
  var W = canvas.width/dpr;
  var H = canvas.height/dpr;
  var hit = _hitTest(e.clientX - rect.left, e.clientY - rect.top, W, H);
  _isoState.hoveredBuilding = hit;
  canvas.style.cursor = hit ? 'pointer' : (_isoState.isDragging ? 'grabbing' : 'grab');
  var tooltip = document.getElementById('locTooltip');
  if (tooltip && hit) {
    var zone = window.VILLAGE_ZONES.find(z => z.id === hit);
    if (zone) {
      var nl = (window.S && S.nativeLang) || 'fr';
      tooltip.textContent = zone.label[nl] || zone.label.fr;
      tooltip.style.left = (e.clientX - rect.left + 15) + 'px';
      tooltip.style.top = (e.clientY - rect.top - 30) + 'px';
      tooltip.classList.add('show');
    }
  } else if (tooltip) {
    tooltip.classList.remove('show');
  }
}

function _onIsoClick(e){
  if(_isoState.isDragging) return;
  var rect = canvas.getBoundingClientRect();
  var dpr = window.devicePixelRatio||1;
  var W = canvas.width/dpr;
  var H = canvas.height/dpr;
  var hit = _hitTest(e.clientX - rect.left, e.clientY - rect.top, W, H);
  if(hit) _onBuildingClick(hit);
}

function _snapNearest(W){ var best=0, dist=Infinity; window.VILLAGE_ZONES.forEach(function(z,i){ var d=Math.abs(_zoneX(i,W)-W*0.38); if(d<dist){dist=d;best=i;} }); _scrollToZone(best,false); }

// ================================================================
// BARRE NAV (CORRIGÉE)
// ================================================================
function _buildNavBar() {
  var existing = document.querySelector('.village-nav-bar');
  if (existing) existing.remove();
  var vs = document.getElementById('screen-village');
  if (!vs) return;
  var nav = document.createElement('div');
  nav.className = 'village-nav-bar';
  nav.innerHTML = '\
    <button class="vnb-btn active" onclick="_navTo(\'village\')" id="vnb-village"><span class="vnb-icon">🏘️</span><span class="vnb-label">Village</span></button>\
    <button class="vnb-btn" onclick="_navTo(\'lessons\')" id="vnb-lessons"><span class="vnb-icon">📖</span><span class="vnb-label">Leçons</span></button>\
    <button class="vnb-btn" onclick="_navTo(\'practice\')" id="vnb-practice"><span class="vnb-icon">🎤</span><span class="vnb-label">Pratique</span></button>\
    <button class="vnb-btn" onclick="_navTo(\'challenges\')" id="vnb-challenges"><span class="vnb-icon">🏆</span><span class="vnb-label">Défis</span></button>\
    <button class="vnb-btn" onclick="_navTo(\'profile\')" id="vnb-profile"><span class="vnb-icon">👤</span><span class="vnb-label">Profil</span></button>\
  ';
  vs.appendChild(nav);
  if (!document.getElementById('village-nav-css')) {
    var style = document.createElement('style');
    style.id = 'village-nav-css';
    style.textContent = '\
      .village-nav-bar{flex-shrink:0;display:flex;align-items:center;justify-content:space-around;background:rgba(255,255,255,0.97);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-top:1px solid rgba(0,0,0,0.08);padding:8px 0 max(8px,env(safe-area-inset-bottom));z-index:30;box-shadow:0 -2px 16px rgba(0,0,0,0.10);}\
      .vnb-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;background:none;border:none;color:rgba(0,0,0,0.32);font-size:0.6rem;font-weight:700;letter-spacing:0.02em;padding:4px 0;cursor:pointer;transition:color 0.18s,transform 0.14s;}\
      .vnb-btn.active{color:#2eaa55;}\
      .vnb-btn:active{transform:scale(0.9);}\
      .vnb-icon{font-size:1.3rem;line-height:1;transition:transform 0.18s;}\
      .vnb-btn.active .vnb-icon{transform:scale(1.2);}\
      .vnb-label{font-size:0.58rem;}\
    ';
    document.head.appendChild(style);
  }
}

window._navTo = function(section) {
  document.querySelectorAll('.vnb-btn').forEach(function(b){ b.classList.remove('active'); });
  var btn = document.getElementById('vnb-'+section);
  if (btn) btn.classList.add('active');
  switch(section){
    case 'village': break;
    case 'lessons': 
      if (typeof showScreen === 'function') showScreen('screen-vocab');
      break;
    case 'practice': if(typeof openFlashcards === 'function') openFlashcards(); break;
    case 'challenges': if(typeof showDetailedStats === 'function') showDetailedStats(); break;
    case 'profile': if(typeof showScreen === 'function') showScreen('screen-menu'); break;
  }
};

// ================================================================
// UTILITAIRES
// ================================================================
function _rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y); ctx.quadraticCurveTo(x+w, y, x+w, y+r);
  ctx.lineTo(x+w, y+h-r); ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  ctx.lineTo(x+r, y+h); ctx.quadraticCurveTo(x, y+h, x, y+h-r);
  ctx.lineTo(x, y+r); ctx.quadraticCurveTo(x, y, x+r, y);
  ctx.closePath();
}

function _shadeColor(hex, pct) {
  var col = hex.replace('#','');
  if (col.length===3) col=col[0]+col[0]+col[1]+col[1]+col[2]+col[2];
  var r=parseInt(col.slice(0,2),16), g=parseInt(col.slice(2,4),16), b=parseInt(col.slice(4,6),16);
  r=Math.max(0,Math.min(255,Math.round(r+r*pct)));
  g=Math.max(0,Math.min(255,Math.round(g+g*pct)));
  b=Math.max(0,Math.min(255,Math.round(b+b*pct)));
  return 'rgb('+r+','+g+','+b+')';
}

// ================================================================
// MÉTÉO / HEURE (compat.)
// ================================================================
function setWeather(w){ window.currentWeather = w||'sun'; }
function getWeatherForTime(){ return 'sun'; }
function updateTime(){
  var el=document.getElementById('hudTime');
  if(el){ var n=new Date(); el.textContent=n.getHours().toString().padStart(2,'0')+':'+n.getMinutes().toString().padStart(2,'0'); }
}

// ================================================================
// COMPAT. GLOBALE
// ================================================================
function initCanvas()  { _initIsoCanvas(); }
function drawVillage() { _drawVillage(); }
function alignLocationsToRings() {}

window.goVillage    = goVillage;
window.setWeather   = setWeather;
window.updateTime   = updateTime;
window.initCanvas   = initCanvas;
window.drawVillage  = drawVillage;
window.alignLocationsToRings = alignLocationsToRings;

console.log('✅ village.js ILLUSTRATED MAP EDITION (CORRIGÉ COMPLET) chargé');
