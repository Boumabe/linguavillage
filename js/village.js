// LinguaVillage — village.js PROFESSIONAL EDITION
// Avec: Ripple effects, meilleure détection de hit, animations, feedback

window.canvas  = null;
window.ctx     = null;
window.tick    = 0;
window.currentWeather = 'sun';
window.hoveredLoc = null;

window.VILLAGE_ZONES = [
  { id:'zero', num:1, label:{ fr:'Débutant', en:'Beginner' }, xpRequired:0, color:'#4ecf70', type:'cottage', state:'done' },
  { id:'beginner', num:2, label:{ fr:'Élémentaire', en:'Elementary' }, xpRequired:100, color:'#f9c74f', type:'shop', state:'star' },
  { id:'elementary', num:3, label:{ fr:'Intermédiaire', en:'Intermediate' }, xpRequired:300, color:'#4a9eff', type:'inn', state:'star' },
  { id:'intermediate', num:4, label:{ fr:'Avancé', en:'Advanced' }, xpRequired:600, color:'#ff9f43', type:'mansion', state:'locked' },
  { id:'advanced', num:5, label:{ fr:'Maîtrise', en:'Mastery' }, xpRequired:1000, color:'#e040fb', type:'castle', state:'locked' }
];

var _isoState = {
  scrollX: 0, targetScrollX: 0,
  isDragging: false, dragStartX: 0, dragScrollX: 0,
  hoveredBuilding: null,
  particles: [], clouds: [],
  initialized: false,
  lastClickX: 0, lastClickY: 0
};

function goVillage() {
  if (!window.S) return;

  var hudPlayer = document.getElementById('hudPlayer');
  var hudLang = document.getElementById('hudLang');
  var hudXP = document.getElementById('hudXP');
  
  if (hudPlayer) hudPlayer.textContent = '👤 ' + (S.playerName || '');
  if (hudLang) hudLang.textContent = ((FLAGS && FLAGS[S.targetLang]) || '') + ' ' + ((LANG_NAMES && LANG_NAMES[S.targetLang]) || '');
  if (hudXP) hudXP.textContent = (S.xp || 0) + ' XP';

  if (typeof window.showScreen === 'function') window.showScreen('screen-village');

  canvas = null;
  ctx = null;
  tick = 0;
  window._villageLoopRunning = false;
  _isoState.initialized = false;

  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      _initIsoCanvas();
      _buildNavBar();
      setTimeout(function() { _scrollToZone(0, true); }, 150);
    });
  });

  if (window._timeUpdateInterval) clearInterval(window._timeUpdateInterval);
  window._timeUpdateInterval = setInterval(updateTime, 30000);
  if (typeof updateTime === 'function') updateTime();
}

function _initIsoCanvas() {
  var c = document.getElementById('villageCanvas');
  if (!c) return;

  var dpr = window.devicePixelRatio || 1;
  var nav = document.querySelector('.village-nav-bar');
  var hud = document.querySelector('.village-hud');
  var hudH = (hud ? hud.getBoundingClientRect().height : 52)
           + (nav ? nav.getBoundingClientRect().height : 56);
  var W = (window.visualViewport ? window.visualViewport.width : null) || window.innerWidth || 360;
  var H = Math.max(200, ((window.visualViewport ? window.visualViewport.height : null) || window.innerHeight || 640) - hudH);

  c.width = W * dpr;
  c.height = H * dpr;
  c.style.width = W + 'px';
  c.style.height = H + 'px';
  c.style.display = 'block';
  c.style.cursor = 'grab';

  _isoState.clouds = _genClouds(W, H);
  _isoState.particles = [];
  _isoState.initialized = true;

  c.removeEventListener('click', _onIsoClick);
  c.removeEventListener('mousemove', _onIsoHover);
  c.removeEventListener('touchstart', _onIsoTouchStart);
  c.removeEventListener('touchmove', _onIsoTouchMove);
  c.removeEventListener('touchend', _onIsoTouchEnd);
  c.removeEventListener('mousedown', _onIsoMouseDown);
  c.removeEventListener('mousemove', _onIsoMouseDrag);
  c.removeEventListener('mouseup', _onIsoMouseUp);

  c.addEventListener('click', _onIsoClick);
  c.addEventListener('mousemove', _onIsoHover);
  c.addEventListener('touchstart', _onIsoTouchStart, { passive: false });
  c.addEventListener('touchmove', _onIsoTouchMove, { passive: false });
  c.addEventListener('touchend', _onIsoTouchEnd, { passive: true });
  c.addEventListener('mousedown', _onIsoMouseDown);
  c.addEventListener('mousemove', _onIsoMouseDrag);
  c.addEventListener('mouseup', _onIsoMouseUp);

  if (window._onCanvasResize) window.removeEventListener('resize', window._onCanvasResize);
  window._onCanvasResize = function() { _initIsoCanvas(); };
  window.addEventListener('resize', window._onCanvasResize);

  if (!window._villageLoopRunning) {
    window._villageLoopRunning = true;
    window._villageLoopActive = true;
    requestAnimationFrame(_isoLoop);
  }
}

function _isoLoop() {
  if (!window._villageLoopActive) return;
  tick++;
  _isoState.scrollX += (_isoState.targetScrollX - _isoState.scrollX) * 0.10;
  _drawVillage();
  requestAnimationFrame(_isoLoop);
}

// ── LAYOUT ──────────────────────────────────────────────────
function _zoneCount() { return window.VILLAGE_ZONES.length; }
function _zoneSpacing(W) { return W * 0.36; }
function _totalWidth(W) { return _zoneSpacing(W) * (_zoneCount() - 1) + W * 0.5; }
function _zoneX(i, W) { return W * 0.22 + i * _zoneSpacing(W) - _isoState.scrollX; }
function _groundY(H) { return H * 0.60; }

function _scrollToZone(i, instant) {
  var c = document.getElementById('villageCanvas');
  if (!c) return;
  var dpr = window.devicePixelRatio || 1;
  var W = c.width / dpr;
  var tx = _zoneX(i, W) + _isoState.scrollX - W * 0.35;
  tx = Math.max(0, Math.min(tx, Math.max(0, _totalWidth(W) - W)));
  if (instant) _isoState.scrollX = tx;
  _isoState.targetScrollX = tx;
}

function _clampScroll(W) {
  var max = Math.max(0, _totalWidth(W) - W);
  _isoState.targetScrollX = Math.max(0, Math.min(_isoState.targetScrollX, max));
}

// ── RIPPLE EFFECT ───────────────────────────────────────────
function _showRipple(x, y) {
  var c = document.getElementById('villageCanvas');
  if (!c) return;
  var ripple = document.createElement('div');
  ripple.className = 'ripple';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.style.width = '50px';
  ripple.style.height = '50px';
  ripple.style.marginLeft = '-25px';
  ripple.style.marginTop = '-25px';
  c.parentNode.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

// ── DESSIN ───────────────────────────────────────────────
function _drawVillage() {
  if (!canvas || !ctx) {
    canvas = document.getElementById('villageCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
  }
  var dpr = window.devicePixelRatio || 1;
  var W = canvas.width / dpr;
  var H = canvas.height / dpr;
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

function _drawSky(W, H) {
  var g = ctx.createLinearGradient(0, 0, 0, H * 0.62);
  g.addColorStop(0, '#8ec9f0');
  g.addColorStop(0.5, '#b8dff5');
  g.addColorStop(1, '#d6eefc');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function _drawSun(W, H) {
  var x = W * 0.82, y = H * 0.10;
  var halo = ctx.createRadialGradient(x, y, 0, x, y, 55);
  halo.addColorStop(0, 'rgba(255,235,80,0.28)');
  halo.addColorStop(1, 'rgba(255,235,80,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(x-55, y-55, 110, 110);
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI*2);
  ctx.fillStyle = '#ffe87a';
  ctx.fill();
}

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
    ctx.save();
    ctx.globalAlpha = 0.90;
    ctx.fillStyle = '#ffffff';
    var puffs = [
      [cl.x, cl.y, cl.r],
      [cl.x+cl.r*0.7, cl.y+cl.r*0.1, cl.r*0.72],
      [cl.x-cl.r*0.7, cl.y+cl.r*0.15, cl.r*0.60]
    ];
    puffs.forEach(function(p) { ctx.beginPath(); ctx.arc(p[0], p[1], p[2], 0, Math.PI*2); ctx.fill(); });
    ctx.restore();
  });
}

function _drawMountains(W, H) {
  var peaks = [
    { x: W*0.02, y: H*0.40, w: W*0.20, c: '#7bbf80' },
    { x: W*0.16, y: H*0.32, w: W*0.16, c: '#5ea86a' },
    { x: W*0.38, y: H*0.36, w: W*0.18, c: '#72b87a' }
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
  });
}

function _drawGround(W, H) {
  var gY = _groundY(H);
  var g = ctx.createLinearGradient(0, gY-10, 0, H);
  g.addColorStop(0, '#68c05a');
  g.addColorStop(0.25, '#52a846');
  g.addColorStop(1, '#3e9038');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, gY+4);
  ctx.bezierCurveTo(W*0.3, gY-16, W*0.7, gY+12, W, gY+2);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
}

function _drawRiver(W, H) {
  var gY = _groundY(H);
  var rx = _zoneX(3, W) + _zoneSpacing(W) * 0.18;
  if (rx < -W*0.15 || rx > W*1.15) return;

  ctx.save();
  var rg = ctx.createLinearGradient(rx-22, 0, rx+22, 0);
  rg.addColorStop(0, '#3a8abf');
  rg.addColorStop(0.4, '#5ab4da');
  rg.addColorStop(1, '#3a8abf');
  ctx.fillStyle = rg;
  ctx.beginPath();
  ctx.moveTo(rx-20, gY-H*0.06);
  ctx.bezierCurveTo(rx-26, gY+H*0.02, rx+26, gY+H*0.04, rx+20, H*1.0);
  ctx.bezierCurveTo(rx+30, gY+H*0.04, rx-14, gY+H*0.02, rx-10, gY-H*0.06);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function _drawTrees(W, H) {
  var gY = _groundY(H);
  var positions = [];
  for (var i = 0; i < _zoneCount() + 1; i++) {
    var zx = _zoneX(i, W);
    positions.push({ x: zx-W*0.15, y: gY, s: 0.58 });
    positions.push({ x: zx+W*0.15, y: gY, s: 0.50 });
  }
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
    { dy: -s*0.22, r: s*0.45, c: '#2d8a3a' },
    { dy: -s*0.52, r: s*0.38, c: '#38a848' },
    { dy: -s*0.78, r: s*0.28, c: '#4ecf5a' }
  ].forEach(function(l) {
    ctx.beginPath();
    ctx.arc(x, y+l.dy, l.r, 0, Math.PI*2);
    ctx.fillStyle = l.c;
    ctx.fill();
  });
}

function _drawPath(W, H) {
  var gY = _groundY(H);
  var n = _zoneCount();
  ctx.save();
  ctx.strokeStyle = '#d4aa6a';
  ctx.lineWidth = W * 0.056;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  for (var i = 0; i <= n; i++) {
    var px = _zoneX(i < n ? i : n-1, W) + (i === n ? _zoneSpacing(W) * 0.3 : 0);
    var py = gY + 5 + Math.sin(i * 1.9) * H * 0.018;
    if (i === 0) ctx.moveTo(px - W*0.22, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();
}

function _drawAllBuildings(W, H) {
  var gY = _groundY(H);
  var xp = (window.S && S.xp) || 0;
  var nl = (window.S && S.nativeLang) || 'fr';

  window.VILLAGE_ZONES.forEach(function(zone, zi) {
    var zx = _zoneX(zi, W);
    var unlocked = xp >= zone.xpRequired;
    if (zx < -W*0.45 || zx > W*1.45) return;

    var bob = Math.sin(tick*0.020 + zi*0.8) * 2;
    var hov = _isoState.hoveredBuilding === zone.id;
    var sc = hov ? 1.08 : 1.0;
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
        ctx.shadowColor = zone.color;
        ctx.shadowBlur = 25;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(0, 0, bSize*0.65, 0, Math.PI*2);
        ctx.fillStyle = zone.color;
        ctx.fill();
        ctx.restore();
      }
      _drawBuilding(zone.type, 0, 0, bSize, zone.color, _shadeColor(zone.color, -0.25));
    }
    ctx.restore();

    if (unlocked && zone.state === 'done') {
      ctx.save();
      ctx.beginPath();
      ctx.arc(zx, gY+H*0.038, H*0.028, 0, Math.PI*2);
      ctx.fillStyle = '#4ecf70';
      ctx.fill();
      ctx.font = 'bold '+Math.round(H*0.025)+'px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      ctx.fillText('✓', zx, gY+H*0.038+H*0.01);
      ctx.restore();
    }
  });
}

function _drawBuilding(type, x, y, s, mainCol, darkCol) {
  var w = s*0.70, h = s*0.55;
  ctx.fillStyle = '#f5deb3';
  _rrect(ctx, x-w/2, y-h, w, h, 4);
  ctx.fill();
  ctx.strokeStyle = '#c8a87a';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = mainCol;
  ctx.beginPath();
  ctx.moveTo(x-w/2-s*0.05, y-h+2);
  ctx.lineTo(x, y-h-s*0.44);
  ctx.lineTo(x+w/2+s*0.05, y-h+2);
  ctx.closePath();
  ctx.fill();
}

function _drawBadges(W, H) {
  var xp = (window.S && S.xp) || 0;
  var nl = (window.S && S.nativeLang) || 'fr';

  window.VILLAGE_ZONES.forEach(function(zone, zi) {
    var zx = _zoneX(zi, W);
    var unlocked = xp >= zone.xpRequired;
    if (zx < -W*0.45 || zx > W*1.45) return;

    var by = H * 0.065;
    var bw = Math.min(W * 0.24, 100);
    var bh = 44;
    var bgCol = unlocked ? zone.color : '#666';

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.22)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = bgCol;
    _rrect(ctx, zx-bw/2, by, bw, bh, 10);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath();
    ctx.arc(zx-bw/2+16, by+bh/2, 12, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold '+Math.round(H*0.018)+'px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(zone.num, zx-bw/2+16, by+bh/2+H*0.007);

    ctx.fillStyle = unlocked ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.55)';
    ctx.font = 'bold '+Math.round(H*0.017)+'px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(zone.label[nl] || zone.label.fr, zx-bw/2+34, by+bh*0.42);

    ctx.restore();
  });
}

function _drawParticles(W, H) {
  if (tick % 14 === 0 && _isoState.particles.length < 18) {
    _isoState.particles.push({
      x: Math.random()*W,
      y: _groundY(H)-Math.random()*H*0.22,
      vx: (Math.random()-0.5)*0.6,
      vy: -0.4-Math.random()*0.5,
      life: 1,
      decay: 0.014,
      r: 2+Math.random()*3,
      color: ['#4ecf70','#f9c74f','#ff9f43','#4a9eff'][Math.floor(Math.random()*4)]
    });
  }
  _isoState.particles = _isoState.particles.filter(function(p) {
    p.x += p.vx;
    p.y += p.vy;
    p.life -= p.decay;
    if (p.life <= 0) return false;
    ctx.save();
    ctx.globalAlpha = p.life*0.50;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.restore();
    return true;
  });
}

// ── HIT TEST ────────────────────────────────────────────────
function _hitTest(mx, my, W, H) {
  var gY = _groundY(H);
  var bS = H * 0.19;
  var result = null;
  window.VILLAGE_ZONES.forEach(function(zone, zi) {
    var zx = _zoneX(zi, W);
    var bY = gY - bS*0.55;
    var dx = mx - zx;
    var dy = my - bY;
    if (Math.abs(dx) < bS*0.52 && Math.abs(dy) < bS*0.72) result = zone.id;
  });
  return result;
}

function _onBuildingClick(id) {
  var zone = window.VILLAGE_ZONES.find(function(z) { return z.id === id; });
  if (!zone) return;
  var xp = (window.S && S.xp) || 0;
  if (xp < zone.xpRequired) {
    if (typeof showNotif === 'function') showNotif('🔒 Il te faut '+(zone.xpRequired-xp)+' XP de plus !');
    return;
  }
  // CORRECTION: Vérify & call properly
  if (typeof openLocation === 'function') {
    openLocation(zone.id);
  } else {
    console.warn('openLocation not defined');
  }
}

// ── EVENTS ──────────────────────────────────────────────
var _touchStartX = 0, _touchScrollX = 0;

function _onIsoTouchStart(e) {
  e.preventDefault();
  _touchStartX = e.touches[0].clientX;
  _touchScrollX = _isoState.targetScrollX;
  if (canvas) canvas.style.cursor = 'grabbing';
}

function _onIsoTouchMove(e) {
  e.preventDefault();
  var dx = _touchStartX - e.touches[0].clientX;
  var dpr = window.devicePixelRatio || 1;
  var W = canvas ? canvas.width/dpr : 360;
  _isoState.targetScrollX = _touchScrollX + dx;
  _clampScroll(W);
}

function _onIsoTouchEnd(e) {
  if (canvas) canvas.style.cursor = 'grab';
  var dpr = window.devicePixelRatio || 1;
  var W = canvas ? canvas.width/dpr : 360;
  _snapNearest(W);
}

function _onIsoMouseDown(e) {
  _isoState.isDragging = true;
  _isoState.dragStartX = e.clientX;
  _isoState.dragScrollX = _isoState.targetScrollX;
  if (canvas) canvas.style.cursor = 'grabbing';
}

function _onIsoMouseDrag(e) {
  if (!_isoState.isDragging) return;
  var dx = _isoState.dragStartX - e.clientX;
  var dpr = window.devicePixelRatio || 1;
  var W = canvas ? canvas.width/dpr : 360;
  _isoState.targetScrollX = _isoState.dragScrollX + dx;
  _clampScroll(W);
}

function _onIsoMouseUp(e) {
  if (_isoState.isDragging) {
    _isoState.isDragging = false;
    if (canvas) canvas.style.cursor = 'grab';
    var dpr = window.devicePixelRatio || 1;
    var W = canvas ? canvas.width/dpr : 360;
    _snapNearest(W);
  }
}

function _onIsoHover(e) {
  if (_isoState.isDragging) return;
  var rect = canvas.getBoundingClientRect();
  var dpr = window.devicePixelRatio || 1;
  var W = canvas.width / dpr;
  var H = canvas.height / dpr;
  var hit = _hitTest(e.clientX - rect.left, e.clientY - rect.top, W, H);
  _isoState.hoveredBuilding = hit;
  canvas.style.cursor = hit ? 'pointer' : 'grab';
}

function _onIsoClick(e) {
  if (_isoState.isDragging) return;
  var rect = canvas.getBoundingClientRect();
  var dpr = window.devicePixelRatio || 1;
  var W = canvas.width / dpr;
  var H = canvas.height / dpr;
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  var hit = _hitTest(x, y, W, H);
  
  // RIPPLE EFFECT
  _showRipple(x, y);
  
  if (hit) _onBuildingClick(hit);
}

function _snapNearest(W) {
  var best = 0, dist = Infinity;
  window.VILLAGE_ZONES.forEach(function(z, i) {
    var d = Math.abs(_zoneX(i, W) - W*0.38);
    if (d < dist) { dist = d; best = i; }
  });
  _scrollToZone(best, false);
}

// ── NAV BAR ─────────────────────────────────────────────
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
    <button class="vnb-btn" onclick="_navTo(\'profile\')" id="vnb-profile"><span class="vnb-icon">👤</span><span class="vnb-label">Profil</span></button>\
  ';
  vs.appendChild(nav);
}

window._navTo = function(section) {
  document.querySelectorAll('.vnb-btn').forEach(function(b) { b.classList.remove('active'); });
  var btn = document.getElementById('vnb-'+section);
  if (btn) btn.classList.add('active');
  
  switch(section) {
    case 'village': break;
    case 'lessons': 
      if (typeof showScreen === 'function') showScreen('screen-vocab');
      break;
    case 'practice': 
      if (typeof showScreen === 'function') showScreen('screen-phrases');
      break;
    case 'profile': 
      if (typeof showScreen === 'function') showScreen('screen-menu');
      break;
  }
};

// ── UTILS ────────────────────────────────────────────────
function _rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y);
  ctx.quadraticCurveTo(x+w, y, x+w, y+r);
  ctx.lineTo(x+w, y+h-r);
  ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  ctx.lineTo(x+r, y+h);
  ctx.quadraticCurveTo(x, y+h, x, y+h-r);
  ctx.lineTo(x, y+r);
  ctx.quadraticCurveTo(x, y, x+r, y);
  ctx.closePath();
}

function _shadeColor(hex, pct) {
  var col = hex.replace('#','');
  if (col.length === 3) col = col[0]+col[0]+col[1]+col[1]+col[2]+col[2];
  var r = parseInt(col.slice(0,2), 16);
  var g = parseInt(col.slice(2,4), 16);
  var b = parseInt(col.slice(4,6), 16);
  r = Math.max(0, Math.min(255, Math.round(r+r*pct)));
  g = Math.max(0, Math.min(255, Math.round(g+g*pct)));
  b = Math.max(0, Math.min(255, Math.round(b+b*pct)));
  return 'rgb('+r+','+g+','+b+')';
}

function setWeather(w) { window.currentWeather = w || 'sun'; }
function getWeatherForTime() { return 'sun'; }
function updateTime() {
  var el = document.getElementById('hudTime');
  if (el) {
    var n = new Date();
    el.textContent = n.getHours().toString().padStart(2,'0')+':'+n.getMinutes().toString().padStart(2,'0');
  }
}

window.goVillage = goVillage;
window.setWeather = setWeather;
window.updateTime = updateTime;

console.log('✅ village.js PROFESSIONAL EDITION chargé');
