// village_3d.js — KROVA EN 3D (Phase 1 — Proof of Concept)
// Style : low-poly arrondi (Townscaper / Animal Crossing simplifié)
// Moteur : Three.js (CDN) + OrbitControls (pan + pinch-zoom)
// 4 bâtiments représentatifs : home, school, market, library
// ================================================================

(function () {
'use strict';

// ================================================================
// DONNÉES — 4 bâtiments de démonstration
// Couleurs dérivées de la palette existante de village_world.js
// ================================================================
var BUILDINGS_3D = [
  {
    id: 'home', name: { fr:'Ta Maison', en:'Your Home', ht:'Kay Ou' },
    x: 0, z: 0,
    wallColor: 0xf5e3b8, roofColor: 0xffd700,
    radius: 16, height: 22, roofHeight: 16,
    platformColor: 0xc9a25a,
    npc: null,
  },
  {
    id: 'school', name: { fr:'École Amara', en:'School', ht:'Lekòl Amara' },
    x: -62, z: -34,
    wallColor: 0xdcefe0, roofColor: 0x4ecf70,
    radius: 17, height: 24, roofHeight: 17,
    platformColor: 0x8fcf9a,
    npc: '👩‍🏫',
  },
  {
    id: 'market', name: { fr:'Marché Diallo', en:'Market', ht:'Mache Diallo' },
    x: 60, z: -22,
    wallColor: 0xfff3cf, roofColor: 0xffb84d,
    radius: 17, height: 20, roofHeight: 15,
    platformColor: 0xe0c87a,
    npc: '🧑‍🌾',
  },
  {
    id: 'library', name: { fr:'Bibliothèque', en:'Library', ht:'Bibliyotèk' },
    x: 14, z: 84,
    wallColor: 0xe9dcf7, roofColor: 0xc084fc,
    radius: 18, height: 26, roofHeight: 18,
    platformColor: 0xb9a0d6,
    npc: '🔒',
    locked: true,
  },
];

// Arbres décoratifs (positions autour des bâtiments)
var TREE_POS = [
  [-110, 30],[-95, -90],[-30, 110],[40, 120],[100, 60],
  [110, -70],[-130, -40],[70, -110],[-60, 90],[130, 10],
  [-150, 70],[150, -30],
];

// ================================================================
// ÉTAT MODULE
// ================================================================
var renderer, scene, camera, controls;
var clock;
var sprites = [];     // billboards emoji (NPC / cadenas)
var trees = [];        // pour animation de balancement
var raycaster, pointer;
var canvasEl;
var running = false;

// ================================================================
// POINT D'ENTRÉE — appelé depuis le menu (remplace goVillage 2D)
// ================================================================
window.goVillage = function () {
  if (!window.S) return;
  _updateHUD();

  if (typeof window.showScreen === 'function') window.showScreen('screen-village');
  else {
    document.querySelectorAll('.screen').forEach(function (s) { s.classList.remove('active'); });
    var vs = document.getElementById('screen-village');
    if (vs) vs.classList.add('active');
  }

  _ensureLayout();
  _buildNavBar();

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      if (!renderer) _init3D();
      else _onResize();
      if (!running) { running = true; _loop(); }
    });
  });

  if (window._timeUpdateInterval) clearInterval(window._timeUpdateInterval);
  window._timeUpdateInterval = setInterval(updateTime, 30000);
  if (typeof updateTime === 'function') updateTime();
};

function _updateHUD() {
  var xp = (window.S && S.xp) || 0;
  var e;
  e = document.getElementById('hudPlayer'); if (e) e.textContent = '👤 ' + (S.playerName || '');
  e = document.getElementById('hudLang');   if (e) e.textContent = ((window.FLAGS && FLAGS[S.targetLang]) || '') + ' ' + ((window.LANG_NAMES && LANG_NAMES[S.targetLang]) || '');
  e = document.getElementById('hudXP');     if (e) e.textContent = xp + ' XP';
}

function _ensureLayout() {
  var vs = document.getElementById('screen-village');
  if (!vs) return;
  var c    = document.getElementById('villageCanvas');
  var wrap = document.querySelector('.village-canvas-wrap');
  if (c && c.parentElement === vs && !wrap) {
    var div = document.createElement('div');
    div.className = 'village-canvas-wrap';
    vs.insertBefore(div, c);
    div.appendChild(c);
    var tip = document.getElementById('locTooltip');
    if (tip && tip.parentElement === vs) div.appendChild(tip);
  }
}

// ================================================================
// INITIALISATION THREE.JS
// ================================================================
function _init3D() {
  canvasEl = document.getElementById('villageCanvas');
  if (!canvasEl || !window.THREE) return;

  var wrap = document.querySelector('.village-canvas-wrap') || document.getElementById('screen-village');
  var r    = wrap.getBoundingClientRect();
  var W = r.width  || window.innerWidth;
  var H = r.height || (window.innerHeight - 100);

  // ── Renderer ──
  renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace  = THREE.SRGBColorSpace || renderer.outputColorSpace;

  // ── Scène + ciel en dégradé ──
  scene = new THREE.Scene();
  scene.background = _skyTexture();
  scene.fog = new THREE.Fog(0xbfe3ff, 260, 620);

  // ── Caméra isométrique douce ──
  camera = new THREE.PerspectiveCamera(32, W / H, 1, 1500);
  camera.position.set(220, 200, 220);
  camera.lookAt(0, 0, 20);

  // ── Lumières ──
  var hemi = new THREE.HemisphereLight(0xcfe9ff, 0x5fb86a, 0.95);
  scene.add(hemi);

  var sun = new THREE.DirectionalLight(0xfff3da, 1.15);
  sun.position.set(140, 220, 120);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left   = -260;
  sun.shadow.camera.right  =  260;
  sun.shadow.camera.top    =  260;
  sun.shadow.camera.bottom = -260;
  sun.shadow.camera.near   = 1;
  sun.shadow.camera.far    = 700;
  sun.shadow.bias = -0.0015;
  scene.add(sun);

  var fill = new THREE.AmbientLight(0xffffff, 0.25);
  scene.add(fill);

  // ── Sol principal (île arrondie) ──
  _buildGround();

  // ── Chemins entre bâtiments ──
  _buildPaths();

  // ── Bâtiments ──
  BUILDINGS_3D.forEach(_buildBuilding);

  // ── Arbres ──
  TREE_POS.forEach(function (p) { _buildTree(p[0], p[1]); });

  // ── Contrôles : pan 1 doigt, pincement = zoom, pas de rotation ──
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping   = true;
  controls.dampingFactor   = 0.10;
  controls.enableRotate    = false;
  controls.screenSpacePanning = false;
  controls.minDistance     = 140;
  controls.maxDistance     = 520;
  controls.target.set(0, 0, 20);
  controls.touches.ONE = THREE.TOUCH.PAN;
  controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
  controls.mouseButtons.LEFT  = THREE.MOUSE.PAN;
  controls.mouseButtons.RIGHT = THREE.MOUSE.PAN;
  controls.panSpeed  = 0.9;
  controls.zoomSpeed = 0.9;
  controls.update();

  // ── Raycaster pour le tap sur bâtiment ──
  raycaster = new THREE.Raycaster();
  pointer   = new THREE.Vector2();
  canvasEl.addEventListener('click', _onCanvasClick);
  canvasEl.addEventListener('touchend', _onCanvasTouchEnd, { passive: true });

  clock = new THREE.Clock();

  if (window._onCanvasResize) window.removeEventListener('resize', window._onCanvasResize);
  window._onCanvasResize = _onResize;
  window.addEventListener('resize', _onCanvasResize);
}

// ================================================================
// CIEL EN DÉGRADÉ (texture canvas légère, calculée une fois)
// ================================================================
function _skyTexture() {
  var c = document.createElement('canvas');
  c.width = 2; c.height = 256;
  var ctx2 = c.getContext('2d');
  var g = ctx2.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0,   '#7fc4ff');
  g.addColorStop(0.55,'#bfe3ff');
  g.addColorStop(1,   '#eaf6ff');
  ctx2.fillStyle = g;
  ctx2.fillRect(0, 0, 2, 256);
  var tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace || tex.colorSpace;
  return tex;
}

// ================================================================
// SOL — grande île arrondie
// ================================================================
function _buildGround() {
  var geo = new THREE.CylinderGeometry(230, 245, 14, 48);
  var mat = new THREE.MeshStandardMaterial({ color: 0x5fb86a, roughness: 0.95, metalness: 0 });
  var ground = new THREE.Mesh(geo, mat);
  ground.position.y = -7;
  ground.receiveShadow = true;
  scene.add(ground);

  // Anneau de "plage"/bordure plus claire pour la profondeur
  var rimGeo = new THREE.TorusGeometry(238, 6, 12, 48);
  var rimMat = new THREE.MeshStandardMaterial({ color: 0x76cf80, roughness: 0.9 });
  var rim = new THREE.Mesh(rimGeo, rimMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = -0.5;
  scene.add(rim);
}

// ================================================================
// CHEMINS — rubans plats reliant les bâtiments
// ================================================================
function _buildPaths() {
  var routes = [
    ['home', 'school'], ['home', 'market'], ['home', 'library'],
  ];
  var mat = new THREE.MeshStandardMaterial({ color: 0xd9bf8a, roughness: 0.95 });

  routes.forEach(function (pair) {
    var a = BUILDINGS_3D.find(function (b) { return b.id === pair[0]; });
    var b = BUILDINGS_3D.find(function (b) { return b.id === pair[1]; });
    if (!a || !b) return;
    var dx = b.x - a.x, dz = b.z - a.z;
    var len = Math.sqrt(dx * dx + dz * dz);
    var geo = new THREE.BoxGeometry(len + 6, 0.6, 7, 1, 1, 1);
    var path = new THREE.Mesh(geo, mat);
    path.position.set((a.x + b.x) / 2, 0.05, (a.z + b.z) / 2);
    path.rotation.y = -Math.atan2(dz, dx);
    path.receiveShadow = true;
    scene.add(path);
  });
}

// ================================================================
// BÂTIMENT — plateforme + corps + toit + sprite NPC/cadenas
// ================================================================
function _buildBuilding(b) {
  var group = new THREE.Group();
  group.position.set(b.x, 0, b.z);

  // ── Plateforme arrondie (effet diorama) ──
  var platGeo = new THREE.CylinderGeometry(b.radius + 7, b.radius + 9, 3, 24);
  var platMat = new THREE.MeshStandardMaterial({ color: b.platformColor, roughness: 0.9 });
  var plat = new THREE.Mesh(platGeo, platMat);
  plat.position.y = 1.5;
  plat.receiveShadow = true;
  plat.castShadow = true;
  group.add(plat);

  var alpha = b.locked ? 0.55 : 1;

  // ── Corps du bâtiment — cylindre octogonal (silhouette douce) ──
  var bodyGeo = new THREE.CylinderGeometry(b.radius * 0.92, b.radius, b.height, 8);
  var bodyMat = new THREE.MeshStandardMaterial({
    color: b.wallColor, roughness: 0.85,
    transparent: alpha < 1, opacity: alpha,
  });
  var body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 3 + b.height / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // ── Toit — cône arrondi (8 faces, léger débord) ──
  var roofGeo = new THREE.ConeGeometry(b.radius * 1.18, b.roofHeight, 8);
  var roofMat = new THREE.MeshStandardMaterial({
    color: b.roofColor, roughness: 0.7,
    transparent: alpha < 1, opacity: alpha,
  });
  var roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = 3 + b.height + b.roofHeight / 2 - 1;
  roof.castShadow = true;
  group.add(roof);

  // ── Petite boule au sommet (signature mignonne) ──
  var capGeo = new THREE.SphereGeometry(b.radius * 0.10, 12, 12);
  var capMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
  var cap = new THREE.Mesh(capGeo, capMat);
  cap.position.y = 3 + b.height + b.roofHeight - 1;
  cap.castShadow = true;
  group.add(cap);

  // ── Porte (détail) ──
  if (!b.locked) {
    var doorGeo = new THREE.BoxGeometry(b.radius * 0.5, b.height * 0.55, 1);
    var doorMat = new THREE.MeshStandardMaterial({ color: 0x6b4a2b, roughness: 0.8 });
    var door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 3 + (b.height * 0.55) / 2, b.radius * 0.94);
    group.add(door);
  }

  scene.add(group);

  // ── Sprite emoji (NPC ou cadenas) — billboard toujours face caméra ──
  if (b.npc) {
    var sprite = _makeEmojiSprite(b.npc, 22);
    sprite.position.set(b.x, 3 + b.height + b.roofHeight + 10, b.z);
    sprite.userData.baseY = sprite.position.y;
    sprite.userData.phase = Math.random() * Math.PI * 2;
    scene.add(sprite);
    sprites.push(sprite);
  }

  // ── Label nom (sprite texte) ──
  var label = _makeTextSprite((b.name && (b.name.fr)) || b.id);
  label.position.set(b.x, 3 + b.height + (b.locked ? 4 : b.roofHeight + 2), b.z);
  scene.add(label);

  // userData pour le raycaster (clic = group entier)
  group.userData.buildingId = b.id;
  group.traverse(function (o) { o.userData.buildingId = b.id; });
}

// ================================================================
// SPRITE EMOJI — texture canvas, toujours face caméra
// ================================================================
function _makeEmojiSprite(emoji, size) {
  var c = document.createElement('canvas');
  c.width = c.height = 64;
  var ctx2 = c.getContext('2d');
  ctx2.font = '48px serif';
  ctx2.textAlign = 'center';
  ctx2.textBaseline = 'middle';
  ctx2.fillText(emoji, 32, 36);
  var tex = new THREE.CanvasTexture(c);
  var mat = new THREE.SpriteMaterial({ map: tex, depthWrite: false });
  var sprite = new THREE.Sprite(mat);
  sprite.scale.set(size, size, 1);
  return sprite;
}

// ================================================================
// SPRITE TEXTE — nom du bâtiment
// ================================================================
function _makeTextSprite(text) {
  var c = document.createElement('canvas');
  var pad = 14;
  var ctx2 = c.getContext('2d');
  ctx2.font = 'bold 28px Sora, system-ui, sans-serif';
  var w = ctx2.measureText(text).width + pad * 2;
  c.width  = Math.ceil(w);
  c.height = 40;
  ctx2 = c.getContext('2d');
  ctx2.font = 'bold 28px Sora, system-ui, sans-serif';
  ctx2.fillStyle = 'rgba(8,12,22,0.55)';
  _roundRect(ctx2, 0, 0, c.width, c.height, 14);
  ctx2.fill();
  ctx2.fillStyle = '#ffffff';
  ctx2.textAlign = 'center';
  ctx2.textBaseline = 'middle';
  ctx2.fillText(text, c.width / 2, c.height / 2 + 2);

  var tex = new THREE.CanvasTexture(c);
  var mat = new THREE.SpriteMaterial({ map: tex, depthWrite: false });
  var sprite = new THREE.Sprite(mat);
  var scale = 0.34;
  sprite.scale.set(c.width * scale, c.height * scale, 1);
  return sprite;
}
function _roundRect(ctx2, x, y, w, h, r) {
  ctx2.beginPath();
  ctx2.moveTo(x + r, y);
  ctx2.arcTo(x + w, y, x + w, y + h, r);
  ctx2.arcTo(x + w, y + h, x, y + h, r);
  ctx2.arcTo(x, y + h, x, y, r);
  ctx2.arcTo(x, y, x + w, y, r);
  ctx2.closePath();
}

// ================================================================
// ARBRES — blobs arrondis (3 sphères empilées) + tronc
// ================================================================
function _buildTree(x, z) {
  var group = new THREE.Group();
  var scale = 0.85 + Math.random() * 0.5;

  var trunkGeo = new THREE.CylinderGeometry(1.2, 1.6, 8, 6);
  var trunkMat = new THREE.MeshStandardMaterial({ color: 0x8a5a32, roughness: 0.9 });
  var trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 4;
  trunk.castShadow = true;
  group.add(trunk);

  var blobCols = [0x3f9a4f, 0x4cb05e, 0x5ec06f];
  [{ y: 9,  r: 7.5 }, { y: 14, r: 6.0 }, { y: 18.5, r: 4.2 }].forEach(function (cfg, i) {
    var geo = new THREE.IcosahedronGeometry(cfg.r, 1);
    var mat = new THREE.MeshStandardMaterial({ color: blobCols[i], roughness: 0.85 });
    var blob = new THREE.Mesh(geo, mat);
    blob.position.set((Math.random() - 0.5) * 1.5, cfg.y, (Math.random() - 0.5) * 1.5);
    blob.castShadow = true;
    group.add(blob);
  });

  group.position.set(x, 0, z);
  group.scale.setScalar(scale);
  group.userData.swayPhase = Math.random() * Math.PI * 2;
  scene.add(group);
  trees.push(group);
}

// ================================================================
// BOUCLE D'ANIMATION
// ================================================================
function _loop() {
  if (!running) return;
  requestAnimationFrame(_loop);
  var dt = clock.getDelta();
  var t  = clock.elapsedTime;

  // Sprites NPC : léger flottement vertical
  sprites.forEach(function (s) {
    s.position.y = s.userData.baseY + Math.sin(t * 1.6 + s.userData.phase) * 1.6;
  });

  // Arbres : léger balancement
  trees.forEach(function (g) {
    g.rotation.z = Math.sin(t * 0.6 + g.userData.swayPhase) * 0.015;
  });

  controls.update();
  renderer.render(scene, camera);
}

// ================================================================
// RESIZE
// ================================================================
function _onResize() {
  if (!renderer || !camera) return;
  var wrap = document.querySelector('.village-canvas-wrap') || document.getElementById('screen-village');
  var r = wrap.getBoundingClientRect();
  var W = r.width  || window.innerWidth;
  var H = r.height || (window.innerHeight - 100);
  renderer.setSize(W, H, false);
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
}

// ================================================================
// CLIC / TAP SUR BÂTIMENT
// ================================================================
function _onCanvasClick(e) {
  var rect = canvasEl.getBoundingClientRect();
  _raycastAt(e.clientX - rect.left, e.clientY - rect.top, rect);
}
function _onCanvasTouchEnd(e) {
  if (!e.changedTouches || !e.changedTouches[0]) return;
  var rect = canvasEl.getBoundingClientRect();
  var t = e.changedTouches[0];
  _raycastAt(t.clientX - rect.left, t.clientY - rect.top, rect);
}
function _raycastAt(x, y, rect) {
  pointer.x =  (x / rect.width)  * 2 - 1;
  pointer.y = -(y / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  var hits = raycaster.intersectObjects(scene.children, true);
  for (var i = 0; i < hits.length; i++) {
    var id = hits[i].object.userData.buildingId;
    if (id) { _onTapBuilding(id); return; }
  }
}

// ================================================================
// OUVERTURE DU PANNEAU DE LIEU
// ================================================================
function _onTapBuilding(id) {
  var b = BUILDINGS_3D.find(function (b) { return b.id === id; });
  if (!b) return;
  var nl = (window.S && S.nativeLang) || 'fr';
  var xp = (window.S && S.xp) || 0;
  if (window.LV_SOUND) window.LV_SOUND.play('tap');

  if (b.locked) {
    var msg = nl === 'en' ? '🔒 Locked — keep learning to unlock ' + (b.name.en || b.name.fr)
            : nl === 'ht' ? '🔒 Fèmen — kontinye aprann pou debloke ' + (b.name.ht || b.name.fr)
            : '🔒 Verrouillé — continue d\'apprendre pour débloquer ' + b.name.fr;
    if (typeof showNotif === 'function') showNotif(msg, 3000);
    return;
  }

  var name = b.name[nl] || b.name.fr;
  var locTitle = document.getElementById('locTitle');
  var npcList  = document.getElementById('npcList');
  if (locTitle) locTitle.textContent = name;
  if (npcList) {
    if (!b.npc) {
      npcList.innerHTML = '<div style="padding:40px 20px;text-align:center;color:rgba(255,255,255,0.25);font-size:0.88rem;">Aucun habitant ici.</div>';
    } else {
      npcList.innerHTML = '<button onclick="if(typeof openDialogue===\'function\')openDialogue(\'' + b.id + '\',\'' + b.id + '\')" style="'
        + 'display:flex;align-items:center;gap:16px;width:100%;padding:18px 20px;'
        + 'background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.08);'
        + 'border-radius:18px;cursor:pointer;text-align:left;color:inherit;">'
        + '<div style="font-size:2.6rem;flex-shrink:0">' + b.npc + '</div>'
        + '<div><div style="font-weight:800;font-size:1rem;color:#f0e8d0">' + name + '</div>'
        + '<div style="font-size:0.68rem;color:rgba(255,255,255,0.35);margin-top:3px">Discuter</div></div>'
        + '<div style="margin-left:auto;color:rgba(255,215,0,0.45);font-size:1.5rem">›</div>'
        + '</button>';
    }
  }

  running = false;
  if (typeof showScreen === 'function') showScreen('screen-location');

  var back = document.querySelector('#screen-location .back-btn');
  if (back && !back._v3dPatched) {
    back._v3dPatched = true;
    var orig = back.onclick;
    back.onclick = function () {
      if (typeof orig === 'function') orig.call(this);
      else if (typeof showScreen === 'function') showScreen('screen-village');
      running = true; _loop();
    };
  }
}

// ================================================================
// NAV BAR (identique à village_world.js, autonome)
// ================================================================
var _NL = {
  village:  { fr:'Krova', en:'Krova', ht:'Krova' },
  lessons:  { fr:'Leçons', en:'Lessons', ht:'Leson' },
  practice: { fr:'Pratique', en:'Practice', ht:'Pratik' },
  alphabet: { fr:'Langues', en:'Languages', ht:'Lang' },
  profile:  { fr:'Profil', en:'Profile', ht:'Pwofil' },
};
function _buildNavBar() {
  var old = document.querySelector('.village-nav-bar'); if (old) old.remove();
  var vs = document.getElementById('screen-village'); if (!vs) return;
  var tl = (window.S && S.targetLang) || 'fr';
  var tabs = [
    { id: 'village',  icon: '🏘️' },
    { id: 'lessons',  icon: '📖' },
    { id: 'practice', icon: '💬' },
    { id: 'alphabet', icon: '🔤' },
    { id: 'profile',  icon: '👤' },
  ];
  var nav = document.createElement('nav');
  nav.className = 'village-nav-bar';
  nav.innerHTML = tabs.map(function (t) {
    var lb = (_NL[t.id] && (_NL[t.id][tl] || _NL[t.id].fr)) || t.id;
    return '<button class="vnb-btn' + (t.id === 'village' ? ' active' : '') + '" id="vnb-' + t.id + '" '
      + 'onclick="window._navTo(\'' + t.id + '\')"><span class="vnb-icon">' + t.icon + '</span>'
      + '<span class="vnb-label">' + lb + '</span></button>';
  }).join('');
  vs.appendChild(nav);

  if (!document.getElementById('vnb-css')) {
    var st = document.createElement('style');
    st.id = 'vnb-css';
    st.textContent = '.village-nav-bar{flex-shrink:0;display:flex;align-items:stretch;justify-content:space-around;'
      + 'background:rgba(6,8,16,0.98);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);'
      + 'border-top:1px solid rgba(255,255,255,0.06);padding:6px 0 max(6px,env(safe-area-inset-bottom));z-index:30;}'
      + '.vnb-btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;'
      + 'background:none;border:none;color:rgba(255,255,255,0.32);font-size:0.58rem;font-weight:800;'
      + 'letter-spacing:0.03em;padding:6px 0;cursor:pointer;transition:color 0.18s;-webkit-tap-highlight-color:transparent;}'
      + '.vnb-btn.active{color:#4ecf70;}.vnb-btn:active{opacity:0.7;}'
      + '.vnb-icon{font-size:1.25rem;line-height:1;transition:transform 0.18s;}'
      + '.vnb-btn.active .vnb-icon{transform:scale(1.18);}'
      + '.vnb-label{font-size:0.56rem;font-family:Sora,Nunito,system-ui;}';
    document.head.appendChild(st);
  }
}

window._navTo = function (s) {
  document.querySelectorAll('.vnb-btn').forEach(function (b) { b.classList.remove('active'); });
  var btn = document.getElementById('vnb-' + s); if (btn) btn.classList.add('active');
  switch (s) {
    case 'village':
      running = true;
      if (renderer) _loop();
      break;
    case 'lessons':
      running = false;
      if (typeof ensureLearningBindings === 'function') ensureLearningBindings();
      var fk = window.VOCAB ? Object.keys(window.VOCAB)[0] : null;
      if (fk && typeof loadVocab === 'function') loadVocab(fk);
      if (typeof showScreen === 'function') showScreen('screen-vocab');
      break;
    case 'practice':
      running = false;
      var fp = window.PHRASES_DATA ? Object.keys(window.PHRASES_DATA)[0] : null;
      if (fp && typeof loadPhrases === 'function') loadPhrases(fp);
      if (typeof showScreen === 'function') showScreen('screen-phrases');
      break;
    case 'alphabet':
      running = false;
      if (typeof openAlphabet === 'function') openAlphabet((window.S && S.targetLang) || 'en', (window.S && S.nativeLang) || 'fr');
      break;
    case 'profile':
      running = false;
      if (typeof showScreen === 'function') showScreen('screen-profile');
      break;
  }
};

// ================================================================
// MÉTÉO / TEMPS — compatibilité avec le reste de l'app
// ================================================================
function setWeather(w) { window.currentWeather = w || 'sun'; }
function updateTime() {
  var e = document.getElementById('hudTime');
  if (e) { var n = new Date(); e.textContent = ('0' + n.getHours()).slice(-2) + ':' + ('0' + n.getMinutes()).slice(-2); }
  var we = document.getElementById('hudWeather');
  if (we && window.WEATHER_ICONS) we.textContent = WEATHER_ICONS[window.currentWeather] || '☀️';
}
window.setWeather = setWeather;
window.updateTime = updateTime;
window.alignLocationsToRings = function () {};
window.initCanvas = function () {};
window.drawVillage = function () {};

console.log('✅ village_3d.js — KROVA 3D (Phase 1 POC) chargé');

})();
