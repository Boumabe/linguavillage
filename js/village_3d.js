// village_3d.js — KROVA EN 3D v3
// Vue panoramique large, chemin sinueux, 5 bâtiments de progression,
// montagnes en fond, rivière + pont, moulin, château, badges de statut
// Style : low-poly arrondi (Townscaper / Animal Crossing simplifié)
// ================================================================

(function () {
'use strict';

// ================================================================
// COULEURS DE STATUT — alignées sur la palette de l'app
// vert=#4ecf70 (succès/complété), or=#ffd700 (disponible/star), gris=#8899aa (verrouillé)
// ================================================================
var COL_DONE   = 0x4ecf70;
var COL_AVAIL  = 0xffd700;
var COL_LOCKED = 0x8899aa;

// ================================================================
// BÂTIMENTS — 5 étapes de progression le long d'un chemin sinueux
// Positions étalées en X (≈480 unités de large), légère variation en Z
// ================================================================
var BUILDINGS_3D = [
  {
    id: 'home', badgeNum: 1,
    name: { fr:'Ta Maison', en:'Your Home', ht:'Kay Ou' },
    stage: { fr:'Débutant', en:'Beginner', ht:'Debitan' },
    x: -220, z: 30,
    wallColor: 0xf5e3b8, roofColor: 0xe8b84b,
    radius: 16, height: 20, roofHeight: 15,
    platformColor: 0xc9a25a,
    npc: null, lockXP: 0,
  },
  {
    id: 'school', badgeNum: 2,
    name: { fr:'École Amara', en:'School', ht:'Lekòl Amara' },
    stage: { fr:'Élémentaire', en:'Elementary', ht:'Elemantè' },
    x: -110, z: -40,
    wallColor: 0xdcefe0, roofColor: 0x4ecf70,
    radius: 18, height: 24, roofHeight: 17,
    platformColor: 0x8fcf9a,
    npc: '👩‍🏫', lockXP: 0,
  },
  {
    id: 'market', badgeNum: 3,
    name: { fr:'Marché Diallo', en:'Market', ht:'Mache Diallo' },
    stage: { fr:'Intermédiaire', en:'Intermediate', ht:'Entèmedyè' },
    x: 10, z: 30,
    wallColor: 0xfff3cf, roofColor: 0x4a9eff,
    radius: 19, height: 25, roofHeight: 18,
    platformColor: 0xe0c87a,
    npc: '🧑‍🌾', lockXP: 0,
  },
  {
    id: 'library', badgeNum: 4,
    name: { fr:'Bibliothèque', en:'Library', ht:'Bibliyotèk' },
    stage: { fr:'Avancé', en:'Advanced', ht:'Avanse' },
    x: 130, z: -30,
    wallColor: 0xe9dcf7, roofColor: 0xc084fc,
    radius: 20, height: 27, roofHeight: 19,
    platformColor: 0xb9a0d6,
    npc: '👩‍💼', lockXP: 400,
  },
  {
    id: 'castle', badgeNum: 5,
    name: { fr:'Château de Lingoria', en:'Lingoria Castle', ht:'Chato Lingoria' },
    stage: { fr:'Maîtrise', en:'Mastery', ht:'Mèt' },
    x: 270, z: 40,
    wallColor: 0xe8e0cf, roofColor: 0x9b6fd6,
    radius: 26, height: 36, roofHeight: 24,
    platformColor: 0xb8aea0,
    npc: null, lockXP: 1200, isCastle: true,
  },
];

// Arbres — répartis sur tout le monde élargi
var TREE_POS = [
  [-300, 80],[-280,-20],[-250,110],[-180,-90],[-150,80],
  [-90,90],[-60,-100],[-20,-70],[40,-90],[80,90],
  [120,100],[170,90],[200,-90],[230,-100],[300,90],
  [320,-10],[-330,10],[-10,140],[60,150],[260,150],
];

// Montagnes en fond — formes basses, couleurs atténuées, pas d'ombre
var MOUNTAIN_DATA = [
  { x:-360, z:-320, r:220, h:120, c:0x86b89a },
  { x:-160, z:-360, r:260, h:150, c:0x7aa8c2 },
  { x:60,   z:-340, r:230, h:130, c:0x8bc09c },
  { x:240,  z:-380, r:270, h:160, c:0x76a0bc },
  { x:400,  z:-300, r:210, h:115, c:0x8bc09c },
];

// ================================================================
// ÉTAT MODULE
// ================================================================
var renderer, scene, camera, controls;
var clock;
var sprites = [];
var trees = [];
var windmillBlades = null;
var raycaster, pointer;
var canvasEl;
var running = false;

// ================================================================
// POINT D'ENTRÉE
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
  if (!canvasEl) return;
  if (!window.THREE) {
    console.error('❌ Three.js non chargé — vérifie le CDN dans index.html');
    if (typeof showNotif === 'function') showNotif('⚠️ Erreur 3D : bibliothèque non chargée', 4000);
    return;
  }

  var wrap = document.querySelector('.village-canvas-wrap') || document.getElementById('screen-village');
  var r    = wrap.getBoundingClientRect();
  var W = r.width  > 0 ? r.width  : window.innerWidth;
  var H = r.height > 0 ? r.height : (window.innerHeight - 120);

  try {
    // ── Renderer ──
    renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H, false);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap;

    // ── Scène + ciel + brume (monde élargi) ──
    scene = new THREE.Scene();
    scene.background = _skyTexture();
    scene.fog = new THREE.Fog(0xbfe3ff, 420, 980);

    // ── Caméra panoramique large (vue d'ensemble dès le départ) ──
    camera = new THREE.PerspectiveCamera(36, W / H, 1, 2000);
    camera.position.set(160, 230, 560);
    camera.lookAt(20, 0, 0);

    // ── Lumières ──
    var hemi = new THREE.HemisphereLight(0xcfe9ff, 0x5fb86a, 1.0);
    scene.add(hemi);

    var sun = new THREE.DirectionalLight(0xfff3da, 1.15);
    sun.position.set(180, 260, 160);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left   = -420;
    sun.shadow.camera.right  =  420;
    sun.shadow.camera.top    =  420;
    sun.shadow.camera.bottom = -420;
    sun.shadow.camera.near   = 1;
    sun.shadow.camera.far    = 900;
    sun.shadow.bias = -0.0015;
    scene.add(sun);

    var fillLight = new THREE.AmbientLight(0xffffff, 0.28);
    scene.add(fillLight);

    // ── Sol principal (île arrondie élargie) ──
    _buildGround();

    // ── Montagnes en fond ──
    _buildMountains();

    // ── Rivière + pont + barque ──
    _buildRiverAndBridge();

    // ── Chemin sinueux reliant les 5 bâtiments ──
    _buildWindingPath();

    // ── Panneau directionnel près de la maison ──
    _buildSignpost(-260, 60);

    // ── Bâtiments (4 standards + château) ──
    BUILDINGS_3D.forEach(function (b) {
      if (b.isCastle) _buildCastle(b);
      else _buildBuilding(b);
    });

    // ── Moulin décoratif ──
    _buildWindmill(360, -50);

    // ── Arbres ──
    TREE_POS.forEach(function (p) { _buildTree(p[0], p[1]); });

  } catch (err) {
    console.error('❌ Erreur init scène 3D:', err);
    if (typeof showNotif === 'function') showNotif('⚠️ Erreur 3D — voir la console', 4000);
    return;
  }

  // ── Contrôles : pan 1 doigt, pincement = zoom, pas de rotation ──
  try {
    if (typeof THREE.OrbitControls !== 'function') {
      throw new Error('THREE.OrbitControls indisponible');
    }
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping   = true;
    controls.dampingFactor   = 0.10;
    controls.enableRotate    = false;
    controls.screenSpacePanning = false;
    controls.minDistance     = 260;
    controls.maxDistance     = 900;
    controls.target.set(20, 0, 0);
    controls.touches.ONE = THREE.TOUCH.PAN;
    controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
    controls.mouseButtons.LEFT  = THREE.MOUSE.PAN;
    controls.mouseButtons.RIGHT = THREE.MOUSE.PAN;
    controls.panSpeed  = 0.9;
    controls.zoomSpeed = 0.9;
    controls.update();
  } catch (err) {
    console.warn('⚠️ OrbitControls indisponible, scène statique :', err.message);
    controls = null;
  }

  // ── Raycaster pour le tap sur bâtiment ──
  raycaster = new THREE.Raycaster();
  pointer   = new THREE.Vector2();
  canvasEl.addEventListener('click', _onCanvasClick);
  canvasEl.addEventListener('touchend', _onCanvasTouchEnd, { passive: true });

  clock = new THREE.Clock();

  if (window._onCanvasResize) window.removeEventListener('resize', window._onCanvasResize);
  window._onCanvasResize = _onResize;
  window.addEventListener('resize', _onCanvasResize);

  renderer.render(scene, camera);
  setTimeout(_onResize, 300);
}

// ================================================================
// CIEL EN DÉGRADÉ
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
  return new THREE.CanvasTexture(c);
}

// ================================================================
// SOL — grande île arrondie élargie
// ================================================================
function _buildGround() {
  var geo = new THREE.CylinderGeometry(420, 440, 14, 56);
  var mat = new THREE.MeshStandardMaterial({ color: 0x5fb86a, roughness: 0.95, metalness: 0 });
  var ground = new THREE.Mesh(geo, mat);
  ground.position.set(20, -7, 0);
  ground.receiveShadow = true;
  scene.add(ground);

  var rimGeo = new THREE.TorusGeometry(428, 8, 12, 56);
  var rimMat = new THREE.MeshStandardMaterial({ color: 0x76cf80, roughness: 0.9 });
  var rim = new THREE.Mesh(rimGeo, rimMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.set(20, -0.5, 0);
  scene.add(rim);
}

// ================================================================
// MONTAGNES EN FOND — décor lointain, pas d'ombre, pas de clic
// ================================================================
function _buildMountains() {
  MOUNTAIN_DATA.forEach(function (m) {
    var geo = new THREE.ConeGeometry(m.r, m.h, 7);
    var mat = new THREE.MeshStandardMaterial({ color: m.c, roughness: 1, fog: true });
    var mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(m.x, m.h / 2 - 14, m.z);
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    scene.add(mesh);

    // Calotte neigeuse
    var capGeo = new THREE.ConeGeometry(m.r * 0.32, m.h * 0.32, 7);
    var capMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
    var cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(m.x, m.h * 0.84 - 14, m.z);
    cap.castShadow = false;
    scene.add(cap);
  });
}

// ================================================================
// RIVIÈRE + PONT + BARQUE — coin droit, comme la référence
// ================================================================
function _buildRiverAndBridge() {
  // Rivière — long ruban bleu en diagonale
  var riverGeo = new THREE.BoxGeometry(54, 1, 420);
  var riverMat = new THREE.MeshStandardMaterial({ color: 0x52aad0, roughness: 0.25, metalness: 0.15 });
  var river = new THREE.Mesh(riverGeo, riverMat);
  river.position.set(330, 0.3, 80);
  river.rotation.y = -0.35;
  river.receiveShadow = true;
  scene.add(river);

  // Reflets — fines bandes plus claires animées (légère variation statique)
  for (var i = 0; i < 4; i++) {
    var sGeo = new THREE.BoxGeometry(8, 1.2, 60);
    var sMat = new THREE.MeshStandardMaterial({ color: 0x9fe0f5, roughness: 0.2 });
    var shine = new THREE.Mesh(sGeo, sMat);
    shine.position.set(330 + (i - 1.5) * 10, 0.5, 80 - 120 + i * 80);
    shine.rotation.y = -0.35;
    scene.add(shine);
  }

  // Pont en pierre — tablier
  var deckGeo = new THREE.BoxGeometry(58, 6, 22);
  var deckMat = new THREE.MeshStandardMaterial({ color: 0x9a8268, roughness: 0.9 });
  var deck = new THREE.Mesh(deckGeo, deckMat);
  deck.position.set(280, 5, -10);
  deck.rotation.y = -0.35;
  deck.castShadow = true;
  deck.receiveShadow = true;
  scene.add(deck);

  // Arche du pont
  var archGeo = new THREE.TorusGeometry(20, 3.5, 10, 16, Math.PI);
  var archMat = new THREE.MeshStandardMaterial({ color: 0x7a6650, roughness: 0.9 });
  var arch = new THREE.Mesh(archGeo, archMat);
  arch.position.set(280, 2, -10);
  arch.rotation.x = Math.PI;
  arch.rotation.y = -0.35;
  arch.rotation.z = Math.PI;
  scene.add(arch);

  // Barque — coque + mât
  var hullGeo = new THREE.CylinderGeometry(5, 8, 22, 8);
  var hullMat = new THREE.MeshStandardMaterial({ color: 0x8a5a32, roughness: 0.85 });
  var hull = new THREE.Mesh(hullGeo, hullMat);
  hull.rotation.z = Math.PI / 2;
  hull.scale.set(1, 1, 0.55);
  hull.position.set(350, 1.5, 160);
  hull.castShadow = true;
  scene.add(hull);

  var mastGeo = new THREE.CylinderGeometry(0.8, 0.8, 16, 6);
  var mastMat = new THREE.MeshStandardMaterial({ color: 0x6b4a2b, roughness: 0.8 });
  var mast = new THREE.Mesh(mastGeo, mastMat);
  mast.position.set(350, 9, 160);
  scene.add(mast);
}

// ================================================================
// CHEMIN SINUEUX — ruban courbe reliant les 5 bâtiments
// ================================================================
function _buildWindingPath() {
  var pts = BUILDINGS_3D.map(function (b) { return new THREE.Vector3(b.x, 0.4, b.z); });
  var curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.4);
  var SEGMENTS = 60;
  var samples = curve.getPoints(SEGMENTS);
  var mat = new THREE.MeshStandardMaterial({ color: 0xd9bf8a, roughness: 0.95 });

  for (var i = 0; i < samples.length - 1; i++) {
    var a = samples[i], b = samples[i + 1];
    var dx = b.x - a.x, dz = b.z - a.z;
    var len = Math.sqrt(dx * dx + dz * dz) + 0.6;
    var seg = new THREE.Mesh(new THREE.BoxGeometry(len, 0.6, 11), mat);
    seg.position.set((a.x + b.x) / 2, 0.05, (a.z + b.z) / 2);
    seg.rotation.y = -Math.atan2(dz, dx);
    seg.receiveShadow = true;
    scene.add(seg);
  }
}

// ================================================================
// PANNEAU DIRECTIONNEL
// ================================================================
function _buildSignpost(x, z) {
  var postGeo = new THREE.CylinderGeometry(1, 1.2, 22, 6);
  var postMat = new THREE.MeshStandardMaterial({ color: 0x8a5a32, roughness: 0.9 });
  var post = new THREE.Mesh(postGeo, postMat);
  post.position.set(x, 11, z);
  post.castShadow = true;
  scene.add(post);

  [{ y: 17, rz: 0.12, c: 0xe0c87a }, { y: 12, rz: -0.18, c: 0xd9bf8a }].forEach(function (cfg) {
    var plankGeo = new THREE.BoxGeometry(16, 3, 1);
    var plankMat = new THREE.MeshStandardMaterial({ color: cfg.c, roughness: 0.85 });
    var plank = new THREE.Mesh(plankGeo, plankMat);
    plank.position.set(x + 6, cfg.y, z);
    plank.rotation.z = cfg.rz;
    plank.castShadow = true;
    scene.add(plank);
  });
}

// ================================================================
// BÂTIMENT STANDARD — plateforme + corps + toit + badge + statut
// ================================================================
function _buildBuilding(b) {
  var group = new THREE.Group();
  group.position.set(b.x, 0, b.z);

  var xp = (window.S && S.xp) || 0;
  var locked = b.lockXP > 0 && xp < b.lockXP;
  var alpha = locked ? 0.55 : 1;

  // ── Plateforme arrondie (effet diorama) ──
  var platGeo = new THREE.CylinderGeometry(b.radius + 7, b.radius + 9, 3, 24);
  var platMat = new THREE.MeshStandardMaterial({ color: b.platformColor, roughness: 0.9 });
  var plat = new THREE.Mesh(platGeo, platMat);
  plat.position.y = 1.5;
  plat.receiveShadow = true;
  plat.castShadow = true;
  group.add(plat);

  // ── Corps — cylindre octogonal ──
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

  // ── Toit conique ──
  var roofGeo = new THREE.ConeGeometry(b.radius * 1.18, b.roofHeight, 8);
  var roofMat = new THREE.MeshStandardMaterial({
    color: b.roofColor, roughness: 0.7,
    transparent: alpha < 1, opacity: alpha,
  });
  var roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = 3 + b.height + b.roofHeight / 2 - 1;
  roof.castShadow = true;
  group.add(roof);

  // ── Boule décorative au sommet ──
  var capGeo = new THREE.SphereGeometry(b.radius * 0.10, 12, 12);
  var capMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
  var cap = new THREE.Mesh(capGeo, capMat);
  cap.position.y = 3 + b.height + b.roofHeight - 1;
  cap.castShadow = true;
  group.add(cap);

  // ── Porte ──
  if (!locked) {
    var doorGeo = new THREE.BoxGeometry(b.radius * 0.5, b.height * 0.55, 1);
    var doorMat = new THREE.MeshStandardMaterial({ color: 0x6b4a2b, roughness: 0.8 });
    var door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 3 + (b.height * 0.55) / 2, b.radius * 0.94);
    group.add(door);
  }

  scene.add(group);

  var topY = 3 + b.height + b.roofHeight;

  // ── Sprite NPC (flotte au-dessus) ──
  if (b.npc && !locked) {
    var npcSprite = _makeEmojiSprite(b.npc, 22);
    npcSprite.position.set(b.x, topY + 14, b.z);
    npcSprite.userData.baseY = npcSprite.position.y;
    npcSprite.userData.phase = Math.random() * Math.PI * 2;
    scene.add(npcSprite);
    sprites.push(npcSprite);
  }

  // ── Label (badge numéroté + nom) ──
  var statusIcon  = locked ? '🔒' : (b.badgeNum === 1 ? '✅' : '⭐');
  var badgeColor  = locked ? COL_LOCKED : (b.badgeNum === 1 ? COL_DONE : COL_AVAIL);
  var nl = (window.S && S.nativeLang) || 'fr';
  var label = _makeLabelSprite(b.badgeNum, badgeColor, b.name[nl] || b.name.fr, b.stage[nl] || b.stage.fr);
  label.position.set(b.x, topY + (b.npc && !locked ? 26 : 14), b.z);
  scene.add(label);

  // ── Icône de statut sous le bâtiment ──
  var statusSprite = _makeEmojiSprite(statusIcon, 16);
  statusSprite.position.set(b.x + b.radius * 1.3, 5, b.z + b.radius * 0.6);
  scene.add(statusSprite);

  group.userData.buildingId = b.id;
  group.traverse(function (o) { o.userData.buildingId = b.id; });
}

// ================================================================
// CHÂTEAU — bâtiment 5, plus grand avec tours secondaires
// ================================================================
function _buildCastle(b) {
  var group = new THREE.Group();
  group.position.set(b.x, 0, b.z);

  var xp = (window.S && S.xp) || 0;
  var locked = b.lockXP > 0 && xp < b.lockXP;
  var alpha = locked ? 0.55 : 1;

  // ── Plateforme "falaise" — plus haute et plus large ──
  var cliffGeo = new THREE.CylinderGeometry(b.radius + 12, b.radius + 22, 14, 24);
  var cliffMat = new THREE.MeshStandardMaterial({ color: b.platformColor, roughness: 0.95 });
  var cliff = new THREE.Mesh(cliffGeo, cliffMat);
  cliff.position.y = 6;
  cliff.receiveShadow = true;
  cliff.castShadow = true;
  group.add(cliff);

  // ── Donjon central ──
  var bodyGeo = new THREE.CylinderGeometry(b.radius * 0.9, b.radius, b.height, 8);
  var bodyMat = new THREE.MeshStandardMaterial({ color: b.wallColor, roughness: 0.85, transparent: alpha < 1, opacity: alpha });
  var body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 13 + b.height / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  var roofGeo = new THREE.ConeGeometry(b.radius * 1.15, b.roofHeight, 8);
  var roofMat = new THREE.MeshStandardMaterial({ color: b.roofColor, roughness: 0.65, transparent: alpha < 1, opacity: alpha });
  var roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = 13 + b.height + b.roofHeight / 2 - 1;
  roof.castShadow = true;
  group.add(roof);

  var capGeo = new THREE.SphereGeometry(b.radius * 0.09, 12, 12);
  var capMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
  var cap = new THREE.Mesh(capGeo, capMat);
  cap.position.y = 13 + b.height + b.roofHeight - 1;
  group.add(cap);

  // ── Tours secondaires (2) ──
  [[-1, -1], [1, -1]].forEach(function (dir) {
    var tr = b.radius * 0.42;
    var th = b.height * 0.68;
    var trh = b.roofHeight * 0.72;
    var tx = dir[0] * b.radius * 0.95;
    var tz = dir[1] * b.radius * 0.55;

    var tGeo = new THREE.CylinderGeometry(tr * 0.9, tr, th, 8);
    var tMat = new THREE.MeshStandardMaterial({ color: b.wallColor, roughness: 0.85, transparent: alpha < 1, opacity: alpha });
    var tower = new THREE.Mesh(tGeo, tMat);
    tower.position.set(tx, 13 + th / 2, tz);
    tower.castShadow = true;
    group.add(tower);

    var trGeo = new THREE.ConeGeometry(tr * 1.2, trh, 8);
    var trMat = new THREE.MeshStandardMaterial({ color: b.roofColor, roughness: 0.65, transparent: alpha < 1, opacity: alpha });
    var trMesh = new THREE.Mesh(trGeo, trMat);
    trMesh.position.set(tx, 13 + th + trh / 2 - 1, tz);
    trMesh.castShadow = true;
    group.add(trMesh);

    var tCapGeo = new THREE.SphereGeometry(tr * 0.12, 10, 10);
    var tCap = new THREE.Mesh(tCapGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }));
    tCap.position.set(tx, 13 + th + trh - 1, tz);
    group.add(tCap);
  });

  // ── Drapeaux (petits triangles colorés) ──
  if (!locked) {
    [[0, 13 + b.height + b.roofHeight + 2], [-b.radius * 0.95, 13 + b.height * 0.68 + b.roofHeight * 0.72 + 2]].forEach(function (fp) {
      var poleGeo = new THREE.CylinderGeometry(0.4, 0.4, 6, 4);
      var pole = new THREE.Mesh(poleGeo, new THREE.MeshStandardMaterial({ color: 0x6b4a2b }));
      pole.position.set(fp[0], fp[1] + 3, 0);
      group.add(pole);
      var flagGeo = new THREE.PlaneGeometry(6, 4);
      var flag = new THREE.Mesh(flagGeo, new THREE.MeshStandardMaterial({ color: 0xc084fc, side: THREE.DoubleSide }));
      flag.position.set(fp[0] + 3, fp[1] + 4.5, 0);
      group.add(flag);
    });
  }

  // ── Escalier vers la falaise ──
  for (var s = 0; s < 5; s++) {
    var stepGeo = new THREE.BoxGeometry(10, 1.4, 4);
    var step = new THREE.Mesh(stepGeo, new THREE.MeshStandardMaterial({ color: 0xb8aea0, roughness: 0.95 }));
    step.position.set(-b.radius - 14 + s * 2.2, 1 + s * 1.3, b.radius + 14 - s * 2.6);
    step.receiveShadow = true;
    group.add(step);
  }

  scene.add(group);

  var topY = 13 + b.height + b.roofHeight;
  var nl = (window.S && S.nativeLang) || 'fr';
  var statusIcon = locked ? '🔒' : '✅';
  var badgeColor = locked ? COL_LOCKED : COL_DONE;
  var label = _makeLabelSprite(b.badgeNum, badgeColor, b.name[nl] || b.name.fr, b.stage[nl] || b.stage.fr);
  label.position.set(b.x, topY + 16, b.z);
  scene.add(label);

  var statusSprite = _makeEmojiSprite(statusIcon, 18);
  statusSprite.position.set(b.x + b.radius * 1.4, 9, b.z + b.radius * 0.7);
  scene.add(statusSprite);

  group.userData.buildingId = b.id;
  group.traverse(function (o) { o.userData.buildingId = b.id; });
}

// ================================================================
// MOULIN — tour + ailes animées
// ================================================================
function _buildWindmill(x, z) {
  var towerGeo = new THREE.CylinderGeometry(5, 8, 38, 8);
  var towerMat = new THREE.MeshStandardMaterial({ color: 0xe8e0cf, roughness: 0.9 });
  var tower = new THREE.Mesh(towerGeo, towerMat);
  tower.position.set(x, 19, z);
  tower.castShadow = true;
  tower.receiveShadow = true;
  tower.userData.buildingId = 'windmill';
  scene.add(tower);

  var roofGeo = new THREE.ConeGeometry(7, 12, 8);
  var roofMat = new THREE.MeshStandardMaterial({ color: 0x9b6fd6, roughness: 0.65 });
  var roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.set(x, 44, z);
  roof.castShadow = true;
  scene.add(roof);

  // ── Ailes (groupe animé) ──
  var hubGroup = new THREE.Group();
  hubGroup.position.set(x, 38, z + 9);

  var bladeMat = new THREE.MeshStandardMaterial({ color: 0xf5f0e0, roughness: 0.8, side: THREE.DoubleSide });
  for (var i = 0; i < 4; i++) {
    var bladeGeo = new THREE.BoxGeometry(3, 22, 0.8);
    var blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.y = 11;
    blade.castShadow = true;
    var pivot = new THREE.Group();
    pivot.rotation.z = (Math.PI / 2) * i;
    pivot.add(blade);
    hubGroup.add(pivot);
  }
  var hubCap = new THREE.Mesh(new THREE.SphereGeometry(2, 10, 10), new THREE.MeshStandardMaterial({ color: 0x6b4a2b }));
  hubGroup.add(hubCap);

  scene.add(hubGroup);
  windmillBlades = hubGroup;

  // Label
  var label = _makeSimplePillSprite('🌬️ Moulin');
  label.position.set(x, 56, z);
  scene.add(label);
}

// ================================================================
// SPRITE EMOJI — billboard, toujours face caméra
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
// SPRITE LABEL — pastille numérotée + pilule blanche (style référence)
// ================================================================
function _makeLabelSprite(num, badgeColorHex, title, subtitle) {
  var dpr = 2; // netteté
  var padX = 16, gap = 10, circleR = 16;
  var c = document.createElement('canvas');
  var ctx2 = c.getContext('2d');

  ctx2.font = 'bold 17px Sora, system-ui, sans-serif';
  var titleW = ctx2.measureText(title).width;
  ctx2.font = '13px Sora, system-ui, sans-serif';
  var subW = subtitle ? ctx2.measureText(subtitle).width : 0;
  var textW = Math.max(titleW, subW);

  var pillH = subtitle ? 56 : 40;
  var pillW = circleR * 2 + gap + textW + padX * 2;
  var totalW = pillW + 6;

  c.width  = Math.ceil(totalW * dpr);
  c.height = Math.ceil(pillH * dpr);
  ctx2 = c.getContext('2d');
  ctx2.scale(dpr, dpr);

  // Pilule blanche/crème
  ctx2.fillStyle = 'rgba(255,255,255,0.96)';
  _roundRect(ctx2, circleR + 4, 0, pillW - circleR, pillH, pillH / 2);
  ctx2.fill();
  ctx2.shadowColor = 'rgba(0,0,0,0.25)';
  ctx2.shadowBlur = 6;
  ctx2.shadowOffsetY = 2;

  // Cercle de badge numéroté
  var colorStr = '#' + badgeColorHex.toString(16).padStart(6, '0');
  ctx2.shadowBlur = 0;
  ctx2.fillStyle = colorStr;
  ctx2.beginPath();
  ctx2.arc(circleR + 4, pillH / 2, circleR, 0, Math.PI * 2);
  ctx2.fill();
  ctx2.fillStyle = (badgeColorHex === COL_AVAIL) ? '#3a2e00' : '#ffffff';
  ctx2.font = 'bold 16px Sora, system-ui, sans-serif';
  ctx2.textAlign = 'center';
  ctx2.textBaseline = 'middle';
  ctx2.fillText(String(num), circleR + 4, pillH / 2 + 1);

  // Texte
  var textX = circleR * 2 + gap + 2;
  ctx2.textAlign = 'left';
  ctx2.fillStyle = '#1a2233';
  if (subtitle) {
    ctx2.font = 'bold 16px Sora, system-ui, sans-serif';
    ctx2.fillText(title, textX, pillH / 2 - 10);
    ctx2.font = '12px Sora, system-ui, sans-serif';
    ctx2.fillStyle = '#6b7688';
    ctx2.fillText(subtitle, textX, pillH / 2 + 10);
  } else {
    ctx2.font = 'bold 16px Sora, system-ui, sans-serif';
    ctx2.fillText(title, textX, pillH / 2 + 1);
  }

  var tex = new THREE.CanvasTexture(c);
  var mat = new THREE.SpriteMaterial({ map: tex, depthWrite: false });
  var sprite = new THREE.Sprite(mat);
  var scale = 0.42;
  sprite.scale.set((totalW) * scale, pillH * scale, 1);
  return sprite;
}

// ================================================================
// SPRITE PILULE SIMPLE — pour labels décoratifs (moulin etc.)
// ================================================================
function _makeSimplePillSprite(text) {
  var dpr = 2;
  var c = document.createElement('canvas');
  var ctx2 = c.getContext('2d');
  ctx2.font = 'bold 16px Sora, system-ui, sans-serif';
  var w = ctx2.measureText(text).width + 28;
  var h = 32;
  c.width = Math.ceil(w * dpr); c.height = Math.ceil(h * dpr);
  ctx2 = c.getContext('2d');
  ctx2.scale(dpr, dpr);
  ctx2.fillStyle = 'rgba(255,255,255,0.92)';
  _roundRect(ctx2, 0, 0, w, h, h / 2);
  ctx2.fill();
  ctx2.fillStyle = '#1a2233';
  ctx2.font = 'bold 16px Sora, system-ui, sans-serif';
  ctx2.textAlign = 'center';
  ctx2.textBaseline = 'middle';
  ctx2.fillText(text, w / 2, h / 2 + 1);

  var tex = new THREE.CanvasTexture(c);
  var mat = new THREE.SpriteMaterial({ map: tex, depthWrite: false });
  var sprite = new THREE.Sprite(mat);
  sprite.scale.set(w * 0.42, h * 0.42, 1);
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
// ARBRES — blobs arrondis + tronc
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
  [{ y: 9, r: 7.5 }, { y: 14, r: 6.0 }, { y: 18.5, r: 4.2 }].forEach(function (cfg, i) {
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
  var t = clock.elapsedTime;
  clock.getDelta();

  sprites.forEach(function (s) {
    s.position.y = s.userData.baseY + Math.sin(t * 1.6 + s.userData.phase) * 1.6;
  });

  trees.forEach(function (g) {
    g.rotation.z = Math.sin(t * 0.6 + g.userData.swayPhase) * 0.015;
  });

  if (windmillBlades) windmillBlades.rotation.z += 0.012;

  controls && controls.update();
  renderer.render(scene, camera);
}

// ================================================================
// RESIZE
// ================================================================
function _onResize() {
  if (!renderer || !camera) return;
  var wrap = document.querySelector('.village-canvas-wrap') || document.getElementById('screen-village');
  var r = wrap.getBoundingClientRect();
  var W = r.width  > 0 ? r.width  : window.innerWidth;
  var H = r.height > 0 ? r.height : (window.innerHeight - 120);
  renderer.setSize(W, H, false);
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
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
    if (id && id !== 'windmill') { _onTapBuilding(id); return; }
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

  var locked = b.lockXP > 0 && xp < b.lockXP;
  if (locked) {
    var msg = nl === 'en' ? '🔒 Locked — ' + (b.lockXP - xp) + ' XP to unlock ' + (b.name.en || b.name.fr)
            : nl === 'ht' ? '🔒 Fèmen — ' + (b.lockXP - xp) + ' XP pou debloke ' + (b.name.ht || b.name.fr)
            : '🔒 Verrouillé — ' + (b.lockXP - xp) + ' XP pour débloquer ' + b.name.fr;
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
// NAV BAR
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
// MÉTÉO / TEMPS — compatibilité
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

console.log('✅ village_3d.js v3 — KROVA panoramique chargé');

})();
