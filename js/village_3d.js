// village_3d.js — KROVA EN 3D v6 VISUAL OVERHAUL
// Style: Semi-réaliste inspiré Animal Crossing / Dreamlight Valley / Genshin Impact
// Objectif: Village vivant et crédible, 60 FPS mobile, toutes fonctionnalités conservées
// ================================================================

(function () {
'use strict';

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION & PALETTE — Tons naturels, moins saturés
// ═══════════════════════════════════════════════════════════════

var COL_DONE   = 0x4ade80;   // vert naturel doux
var COL_AVAIL  = 0xfbbf24;   // ambre chaud
var COL_LOCKED = 0x94a3b8;   // gris ardoise

// Palette environnementale naturelle
var PALETTE = {
    grassLight: 0x7cb342,
    grassMid:   0x689f38,
    grassDark:  0x558b2f,
    dirt:       0x8d6e63,
    dirtLight:  0xa1887f,
    path:       0xd7ccc8,
    pathEdge:   0xbcaaa4,
    stone:      0x9e9e9e,
    stoneLight: 0xbdbdbd,
    woodDark:   0x5d4037,
    woodMid:    0x795548,
    woodLight:  0x8d6e63,
    waterDeep:  0x1565c0,
    waterMid:   0x1976d2,
    waterLight: 0x42a5f5,
    skyDay:     0x87CEEB,
    skySunset:  0xffb74d,
    skyNight:   0x1a237e,
    cloud:      0xffffff,
    fogDay:     0xc8e6c9,
    fogSunset:  0xffe0b2,
    fogNight:   0x1a237e,
};

// ═══════════════════════════════════════════════════════════════
// DONNÉES BÂTIMENTS — conservées, visuels enrichis
// ═══════════════════════════════════════════════════════════════
var BUILDINGS_3D = [
    { id:'school',   locId:'school',   npcId:'teacher',  badgeNum:2,
      name:{fr:'École Dupont',         en:"Dupont's School",        ht:'Lekòl Dupont'},
      stage:{fr:'Alphabet & Chiffres', en:'Alphabet & Numbers',     ht:'Alfabè ak Chif'},
      desc:{fr:'Mme Dupont enseigne alphabet et chiffres.',
            en:'Ms. Dupont teaches alphabet and numbers.', ht:'Madan Dupont anseye alfabè ak chif.'},
      x:0, z:-190,
      wallColor:0xffecb3, roofColor:0x1565c0, emissiveWall:0x4e342e, emissiveRoof:0x0d47a1,
      radius:18, height:24, roofHeight:16, platformColor:0x0d47a1,
      emoji:'🏫', npc:'👩‍🏫', lockXP:0, action:'dialogue',
      style:'school', chimney:true, balcony:true, sign:true, lanterns:3 },

    { id:'cinema',   locId:'cinema',   npcId:'director', badgeNum:10,
      name:{fr:'Théâtre Félix',        en:'Félix Theater',           ht:'Teyat Félix'},
      stage:{fr:'Culture & Cinéma',    en:'Culture & Cinema',        ht:'Kilti ak Sinema'},
      desc:{fr:'Réalisateur Félix: culture et expressions artistiques.',
            en:'Director Félix: culture and artistic expressions.', ht:'Reyalizatè Félix: kilti ak atistik.'},
      x:71, z:-176,
      wallColor:0xf3e5f5, roofColor:0x6a1b9a, emissiveWall:0x4a148c, emissiveRoof:0x4a148c,
      radius:20, height:26, roofHeight:18, platformColor:0x7b1fa2,
      emoji:'🎬', npc:'🎥', lockXP:350, action:'dialogue',
      style:'theater', chimney:false, balcony:true, sign:true, lanterns:4 },

    { id:'church',   locId:'church',   npcId:'pastor',   badgeNum:7,
      name:{fr:'Église Saint-Antoine', en:'Saint-Antoine Church',    ht:'Legliz Sen-Antoine'},
      stage:{fr:'Valeurs & Formel',    en:'Values & Formal',         ht:'Valè ak Fòmèl'},
      desc:{fr:'Père Antoine: expressions formelles et respectueuses.',
            en:'Father Antoine: formal and respectful expressions.', ht:'Pè Antoine: ekspresyon fòmèl.'},
      x:134, z:-134,
      wallColor:0xf5f5f5, roofColor:0x303f9f, emissiveWall:0x424242, emissiveRoof:0x1a237e,
      radius:18, height:26, roofHeight:18, platformColor:0x283593,
      emoji:'⛪', npc:'⛪', lockXP:150, action:'dialogue',
      style:'church', chimney:false, balcony:false, sign:true, lanterns:6 },

    { id:'hospital', locId:'hospital', npcId:'doctor',   badgeNum:8,
      name:{fr:'Hôpital Martin',       en:'Martin Hospital',         ht:'Lopital Martin'},
      stage:{fr:'Santé & Corps',       en:'Health & Body',           ht:'Sante ak Kò'},
      desc:{fr:'Dr. Martin: vocabulaire médical de base.',
            en:'Dr. Martin: basic medical vocabulary.', ht:'Doktè Martin: vokabilè medikal debaz.'},
      x:190, z:0,
      wallColor:0xe3f2fd, roofColor:0x0277bd, emissiveWall:0x37474f, emissiveRoof:0x01579b,
      radius:20, height:25, roofHeight:16, platformColor:0x0288d1,
      emoji:'🏥', npc:'👨‍⚕️', lockXP:200, action:'dialogue',
      style:'official', chimney:false, balcony:false, sign:true, lanterns:3 },

    { id:'bank',     locId:'bank',     npcId:'banker',   badgeNum:5,
      name:{fr:'Banque Dupuis',        en:'Dupuis Bank',             ht:'Bank Dupuis'},
      stage:{fr:'Argent & Finances',   en:'Money & Finance',         ht:'Lajan ak Finans'},
      desc:{fr:'M. Dupuis parle vocabulaire financier et formel.',
            en:'Mr. Dupuis speaks financial and formal vocabulary.', ht:'Msye Dupuis pale vokabilè finansye.'},
      x:134, z:134,
      wallColor:0xe0e0e0, roofColor:0x37474f, emissiveWall:0x424242, emissiveRoof:0x263238,
      radius:17, height:22, roofHeight:14, platformColor:0x455a64,
      emoji:'🏦', npc:'👨‍💼', lockXP:80, action:'dialogue',
      style:'official', chimney:false, balcony:false, sign:true, lanterns:2 },

    { id:'police',   locId:'police',   npcId:'officer2', badgeNum:11,
      name:{fr:'Commissariat Koné',    en:'Koné Police Station',     ht:'Komisarya Koné'},
      stage:{fr:'Sécurité & Règles',   en:'Safety & Rules',          ht:'Sekirite ak Règ'},
      desc:{fr:'Capitaine Koné: vocabulaire civique et urgences.',
            en:'Captain Koné: civic and emergency vocabulary.', ht:'Kaptèn Koné: vokabilè sivik ak ijans.'},
      x:0, z:190,
      wallColor:0xe8eaf6, roofColor:0x283593, emissiveWall:0x1a237e, emissiveRoof:0x1a237e,
      radius:17, height:22, roofHeight:14, platformColor:0x303f9f,
      emoji:'🚔', npc:'👮‍♂️', lockXP:400, action:'dialogue',
      style:'official', chimney:false, balcony:false, sign:true, lanterns:3 },

    { id:'friends',  locId:'friends',  npcId:'friend',   badgeNum:3,
      name:{fr:'Maison de Léa',        en:"Léa's House",            ht:'Kay Léa'},
      stage:{fr:'Amis & Famille',      en:'Friends & Family',       ht:'Zanmi ak Fanmi'},
      desc:{fr:"Léa est toujours prête à papoter! Conversations informelles.",
            en:'Léa is always ready to chat! Informal conversations.', ht:'Léa toujou prèt pou pale!'},
      x:-134, z:134,
      wallColor:0xffccbc, roofColor:0xc62828, emissiveWall:0x3e2723, emissiveRoof:0xb71c1c,
      radius:15, height:19, roofHeight:13, platformColor:0xc62828,
      emoji:'🏠', npc:'👧', lockXP:0, action:'dialogue',
      style:'cottage', chimney:true, balcony:true, sign:false, lanterns:2 },

    { id:'tavern',   locId:'tavern',   npcId:'bartender',badgeNum:6,
      name:{fr:'Taverne Marco',        en:"Marco's Tavern",          ht:'Tavèn Marco'},
      stage:{fr:'Boissons & Détente',  en:'Drinks & Leisure',        ht:'Bwason ak Detant'},
      desc:{fr:'Marco sert les meilleures boissons. Conversations décontractées.',
            en:'Marco serves the best drinks. Relaxed conversations.', ht:'Marco sèvi pi bon bwason yo.'},
      x:-175, z:74,
      wallColor:0xffe0b2, roofColor:0xbf360c, emissiveWall:0x4e342e, emissiveRoof:0x870000,
      radius:17, height:21, roofHeight:15, platformColor:0xd84315,
      emoji:'🍺', npc:'🍺', lockXP:120, action:'dialogue',
      style:'tavern', chimney:true, balcony:true, sign:true, lanterns:5 },

    { id:'market',   locId:'market',   npcId:'merchant', badgeNum:4,
      name:{fr:'Marché Diallo',        en:"Diallo's Market",        ht:'Mache Diallo'},
      stage:{fr:'Commerce & Nombres',  en:'Shopping & Numbers',     ht:'Komès ak Nimewo'},
      desc:{fr:'Diallo vend de tout. Apprenez à négocier et compter.',
            en:'Diallo sells everything. Learn to negotiate and count.', ht:'Diallo vann tout bagay.'},
      x:-190, z:0,
      wallColor:0xfff8e1, roofColor:0xe65100, emissiveWall:0x4e342e, emissiveRoof:0xbf360c,
      radius:19, height:23, roofHeight:16, platformColor:0xe65100,
      emoji:'🏪', npc:'🧑‍🌾', lockXP:0, action:'dialogue',
      style:'market', chimney:false, balcony:true, sign:true, lanterns:4 },

    { id:'park',     locId:'park',     npcId:'elder',    badgeNum:1,
      name:{fr:'Parc du Sage',         en:"Elder's Park",           ht:'Pak Granmoun'},
      stage:{fr:'Salutations',         en:'Greetings',              ht:'Bonjou'},
      desc:{fr:'Grand-père Koffi enseigne les salutations de base.',
            en:'Grandpa Koffi teaches basic greetings.', ht:'Gran-pè Koffi anseye salitasyon debaz.'},
      x:-176, z:-71,
      wallColor:0xf5f5dc, roofColor:0x2e7d32, emissiveWall:0x3e2723, emissiveRoof:0x1b5e20,
      radius:16, height:20, roofHeight:14, platformColor:0x33691e,
      emoji:'🌳', npc:'👴', lockXP:0, action:'dialogue',
      style:'cottage', chimney:true, balcony:false, sign:true, lanterns:2 },

    { id:'station',  locId:'station',  npcId:'officer',  badgeNum:9,
      name:{fr:'Gare de Krova',        en:'Krova Station',           ht:'Estasyon Krova'},
      stage:{fr:'Voyages & Directions',en:'Travel & Directions',     ht:'Vwayaj ak Direksyon'},
      desc:{fr:'Agent Kofi: directions, transports et voyages.',
            en:'Agent Kofi: directions, transport and travel.', ht:'Ajan Kofi: direksyon ak transpò.'},
      x:-134, z:-134,
      wallColor:0xeceff1, roofColor:0x546e7a, emissiveWall:0x455a64, emissiveRoof:0x37474f,
      radius:17, height:22, roofHeight:14, platformColor:0x607d8b,
      emoji:'🚉', npc:'👮', lockXP:250, action:'dialogue',
      style:'official', chimney:false, balcony:false, sign:true, lanterns:2 },
];

// ═══════════════════════════════════════════════════════════════
// ÉTAT MODULE
// ═══════════════════════════════════════════════════════════════
var renderer, scene, camera, controls;
var clock, deltaTime;
var sprites = [];
var trees = [];
var windmillBlades = null;
var raycaster, pointer;
var canvasEl;
var running = false;

// Systèmes d'ambiance
var _birds3D = [];
var _clouds3D = [];
var _butterflies = [];
var _leaves = [];
var _smokeParticles = [];
var _lanternLights = [];
var _npcWalkers = [];
var _waterMesh = null;
// [AJOUTÉ] Liste de toutes les surfaces d'eau animées par shader (rivière
// + future fontaine). _waterMesh continue de désigner spécifiquement la
// rivière (pour compatibilité), mais la mise à jour de uTime dans _loop()
// parcourt maintenant cette liste pour inclure aussi la fontaine.
var _animatedWaterMeshes = [];
var _sunLight = null;
var _moonLight = null;
var _hemiLight = null;
var _ambientLight = null;
var _stars = null;
var _timeOfDay = 0.3;
var _dayNightCycle = true;

// Optimisation
var _instancedMeshes = {};
var _geometryCache = {};
var _materialCache = {};
var _lodGroups = [];
var _frustum = new THREE.Frustum();
var _projScreenMatrix = new THREE.Matrix4();

// ═══════════════════════════════════════════════════════════════
// UTILITAIRES MATH & PROCÉDURAUX
// ═══════════════════════════════════════════════════════════════
function _noise(x, z) {
    var n = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 2.5
          + Math.sin(x * 0.13 + 1.7) * Math.cos(z * 0.11 + 2.3) * 1.5
          + Math.sin(x * 0.07 + 4.1) * Math.sin(z * 0.09 + 1.2) * 1.0;
    return n;
}

function _smoothNoise(x, z) {
    return _noise(x, z) * 0.6 + _noise(x + 100, z + 100) * 0.4;
}

function _hash(x, z) {
    var s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
    return s - Math.floor(s);
}

function _randRange(min, max) {
    return min + Math.random() * (max - min);
}

// [AJOUTÉ] Génère un point (x,z) aléatoire dans un anneau circulaire
// centré sur l'origine, entre minR et maxR. Remplace l'ancienne
// répartition rectangulaire (_randRange sur x ET z indépendamment), qui
// était adaptée à l'ancien village aligné en couloir mais laisserait des
// zones vides au nord/sud avec la nouvelle disposition circulaire des
// bâtiments autour de la place centrale.
function _randInRing(minR, maxR) {
    var angle = Math.random() * Math.PI * 2;
    var r = Math.sqrt(_randRange(minR * minR, maxR * maxR)); // racine pour densité uniforme par aire
    return { x: Math.cos(angle) * r, z: Math.sin(angle) * r };
}

function _getMaterial(key, creator) {
    if (!_materialCache[key]) {
        _materialCache[key] = creator();
    }
    return _materialCache[key];
}

function _getGeometry(key, creator) {
    if (!_geometryCache[key]) {
        _geometryCache[key] = creator();
    }
    return _geometryCache[key];
}

// ═══════════════════════════════════════════════════════════════
// POINT D'ENTRÉE — API inchangée
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
// INITIALISATION THREE.JS — MOTEUR VISUEL OVERHAULÉ
// ═══════════════════════════════════════════════════════════════
function _init3D() {
    canvasEl = document.getElementById('villageCanvas');
    if (!canvasEl) return;
    if (!window.THREE) {
        console.error('❌ Three.js non chargé');
        if (typeof showNotif === 'function') showNotif('⚠️ Erreur 3D : bibliothèque non chargée', 4000);
        return;
    }

    var wrap = document.querySelector('.village-canvas-wrap') || document.getElementById('screen-village');
    var r    = wrap.getBoundingClientRect();
    var W = r.width  > 0 ? r.width  : window.innerWidth;
    var H = r.height > 0 ? r.height : (window.innerHeight - 120);

    // Détection capacité appareil
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    var pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 2 : 2);
    var isLowEnd = isMobile && (navigator.hardwareConcurrency || 4) <= 4;

    try {
        // ── Renderer optimisé ──
        renderer = new THREE.WebGLRenderer({ 
            canvas: canvasEl, 
            antialias: !isMobile,
            alpha: false,
            powerPreference: 'high-performance'
        });
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(W, H, false);
        renderer.shadowMap.enabled = !isLowEnd;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;

        // ── Scène ──
        scene = new THREE.Scene();
        scene.background = new THREE.Color(PALETTE.skyDay);
        scene.fog = new THREE.FogExp2(PALETTE.fogDay, 0.0012);

        // ── Caméra panoramique ──
        camera = new THREE.PerspectiveCamera(40, W / H, 1, 2000);
        camera.position.set(0, 220, 380);
        camera.lookAt(0, 0, 0);

        // ── ÉCLAIRAGE CINÉMATOGRAPHIQUE ──
        _setupLighting(isLowEnd);

        // ── TERRAIN PROCÉDURAL ORGANIQUE ──
        _buildTerrain(isLowEnd);

        // ── MONTAGNES EN FOND ──
        _buildMountains();

        // ── RIVIÈRE AVEC SHADER D'EAU ──
        _buildRiverAndBridge(isLowEnd);

        // ── CHEMINS NATURELS ──
        _buildNaturalPaths();

        // ── VÉGÉTATION PROCÉDURALE DENSE ──
        _buildVegetation(isLowEnd);

        // ── BÂTIMENTS DÉTAILLÉS ──
        BUILDINGS_3D.forEach(function (b) {
            _buildDetailedBuilding(b, isLowEnd);
        });

        // ── PLACE CENTRALE : FONTAINE, BANCS, LAMPADAIRES ──
        // [AJOUTÉ] Demandé explicitement par l'utilisateur : centre du
        // village réorganisé en place circulaire avec fontaine animée,
        // bancs et lampadaires.
        _buildFountain(isLowEnd);
        _buildBenches();
        _buildLampposts(isLowEnd);

        // ── MOULIN ──
        _buildWindmill(360, -50);

        // ── OISEAUX 3D ──
        _build3DBirds();

        // ── NUAGES 3D ──
        _build3DClouds();

        // ── PAPILLONS ──
        _buildButterflies();

        // ── PARTICULES LUMINEUSES ──
        _buildFireflies(isLowEnd);

        // ── PNJ AMBULANTS ──
        _buildNPCWalkers();

        // ── CYCLE JOUR/NUIT ──
        _buildCelestialBodies();

    } catch (err) {
        console.error('❌ Erreur init scène 3D:', err);
        if (typeof showNotif === 'function') showNotif('⚠️ Erreur 3D — voir la console', 4000);
        return;
    }

    // ── Contrôles ──
    try {
        if (typeof THREE.OrbitControls !== 'function') {
            throw new Error('THREE.OrbitControls indisponible');
        }
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        // [MODIFIÉ] Rotation limitée autour de la nouvelle place centrale
        // circulaire, demandée explicitement par l'utilisateur. Les bornes
        // azimutales/polaires empêchent de passer sous le terrain ou de
        // voir l'envers du décor (les éléments de fond — montagnes, forêt —
        // ne sont construits que sur un arc partiel autour de la scène).
        controls.enableRotate = true;
        controls.minAzimuthAngle = -Math.PI / 3;   // -60°
        controls.maxAzimuthAngle =  Math.PI / 3;   // +60°
        controls.minPolarAngle = Math.PI / 6;       // 30° depuis le zénith (pas trop plongeant)
        controls.maxPolarAngle = Math.PI / 2.4;     // ~75° (pas trop à l'horizontale)
        controls.rotateSpeed = 0.6;
        controls.screenSpacePanning = false;
        controls.minDistance = 200;
        controls.maxDistance = 800;
        controls.target.set(0, 0, 0);
        // [MODIFIÉ] Un doigt / clic gauche = rotation ; deux doigts / clic
        // droit = pan+zoom. Avant cette modification, tout était en pan
        // (enableRotate=false), ce qui n'est plus suffisant pour explorer
        // visuellement le pourtour de la place circulaire.
        controls.touches.ONE = THREE.TOUCH.ROTATE;
        controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
        controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
        controls.mouseButtons.RIGHT = THREE.MOUSE.PAN;
        controls.panSpeed = 0.7;
        controls.zoomSpeed = 0.8;
        controls.update();
    } catch (err) {
        console.warn('⚠️ OrbitControls indisponible:', err.message);
        controls = null;
    }

    // ── Raycaster ──
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();
    canvasEl.addEventListener('click', _onCanvasClick);
    // [AJOUTÉ] Mémorise la position de départ du toucher pour distinguer
    // un vrai tap (clic sur bâtiment) d'un drag de rotation/pan en fin de
    // geste. Nécessaire depuis l'activation de la rotation tactile
    // (touches.ONE = ROTATE) : sans cette protection, terminer une
    // rotation au-dessus d'un bâtiment déclencherait un clic involontaire.
    canvasEl.addEventListener('touchstart', _onCanvasTouchStart, { passive: true });
    canvasEl.addEventListener('touchend', _onCanvasTouchEnd, { passive: true });

    clock = new THREE.Clock();

    if (window._onCanvasResize) window.removeEventListener('resize', window._onCanvasResize);
    window._onCanvasResize = _onResize;
    window.addEventListener('resize', window._onCanvasResize);

    renderer.render(scene, camera);
    setTimeout(_onResize, 300);
}

// ═══════════════════════════════════════════════════════════════
// ÉCLAIRAGE CINÉMATOGRAPHIQUE
// ═══════════════════════════════════════════════════════════════
function _setupLighting(isLowEnd) {
    // Hemisphere light — simulation ciel/sol naturel
    _hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x5d4037, 0.6);
    scene.add(_hemiLight);

    // Ambient fill doux
    _ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(_ambientLight);

    // Soleil principal
    _sunLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
    _sunLight.position.set(200, 300, 150);
    _sunLight.castShadow = !isLowEnd;
    if (_sunLight.castShadow) {
        _sunLight.shadow.mapSize.set(2048, 2048);
        _sunLight.shadow.camera.left = -500;
        _sunLight.shadow.camera.right = 500;
        _sunLight.shadow.camera.top = 500;
        _sunLight.shadow.camera.bottom = -500;
        _sunLight.shadow.camera.near = 1;
        _sunLight.shadow.camera.far = 1000;
        _sunLight.shadow.bias = -0.0005;
        _sunLight.shadow.normalBias = 0.02;
    }
    scene.add(_sunLight);

    // Lumière de remplissage douce (côté opposé)
    var fillLight = new THREE.DirectionalLight(0xb3e5fc, 0.3);
    fillLight.position.set(-200, 100, -100);
    scene.add(fillLight);

    // Lumière lune (cachée initialement)
    _moonLight = new THREE.DirectionalLight(0xaabbff, 0.0);
    _moonLight.position.set(-200, 300, -150);
    scene.add(_moonLight);
}

// ═══════════════════════════════════════════════════════════════
// TERRAIN PROCÉDURAL ORGANIQUE
// ═══════════════════════════════════════════════════════════════
function _buildTerrain(isLowEnd) {
    var size = 900;
    var segments = isLowEnd ? 80 : 120;
    
    var geo = new THREE.PlaneGeometry(size, size, segments, segments);
    geo.rotateX(-Math.PI / 2);

    var pos = geo.attributes.position;
    var colors = [];
    var color = new THREE.Color();

    for (var i = 0; i < pos.count; i++) {
        var x = pos.getX(i);
        var z = pos.getZ(i);
        
        var h = _smoothNoise(x, z);
        
        // Aplatir près des bâtiments
        BUILDINGS_3D.forEach(function(b) {
            var dx = x - b.x;
            var dz = z - b.z;
            var dist = Math.sqrt(dx*dx + dz*dz);
            if (dist < b.radius + 10) {
                h *= (dist / (b.radius + 10));
            }
        });
        
        pos.setY(i, h);

        // Couleurs d'herbe variées selon hauteur
        var t = (h + 3) / 6;
        if (t < 0.3) {
            color.setHex(PALETTE.grassDark);
        } else if (t < 0.6) {
            color.setHex(PALETTE.grassMid);
        } else {
            color.setHex(PALETTE.grassLight);
        }
        
        var variation = (_hash(x * 10, z * 10) - 0.5) * 0.08;
        color.r += variation;
        color.g += variation;
        color.b += variation;
        
        colors.push(color.r, color.g, color.b);
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    var mat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.9,
        metalness: 0.0,
    });

    var terrain = new THREE.Mesh(geo, mat);
    terrain.receiveShadow = !isLowEnd;
    scene.add(terrain);

    // Rochers décoratifs procéduraux (InstancedMesh)
    _buildRocks(isLowEnd);
}

function _buildRocks(isLowEnd) {
    var count = isLowEnd ? 30 : 60;
    var rockGeo = new THREE.DodecahedronGeometry(1, 0);
    var rockMat = new THREE.MeshStandardMaterial({ 
        color: PALETTE.stone, 
        roughness: 0.9,
        flatShading: true
    });

    var rocks = new THREE.InstancedMesh(rockGeo, rockMat, count);
    var dummy = new THREE.Object3D();

    for (var i = 0; i < count; i++) {
        var x = _randRange(-400, 600);
        var z = _randRange(-150, 150);
        var scale = _randRange(0.5, 2.5);
        
        var nearBuilding = false;
        BUILDINGS_3D.forEach(function(b) {
            var dx = x - b.x, dz = z - b.z;
            if (Math.sqrt(dx*dx + dz*dz) < b.radius + 8) nearBuilding = true;
        });
        if (nearBuilding) { i--; continue; }

        dummy.position.set(x, _smoothNoise(x, z) + scale * 0.3, z);
        dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        dummy.scale.set(scale, scale * 0.7, scale);
        dummy.updateMatrix();
        rocks.setMatrixAt(i, dummy.matrix);
    }

    rocks.castShadow = !isLowEnd;
    rocks.receiveShadow = !isLowEnd;
    scene.add(rocks);
    _instancedMeshes['rocks'] = rocks;
}

// ═══════════════════════════════════════════════════════════════
// MONTAGNES EN FOND
// ═══════════════════════════════════════════════════════════════
var MOUNTAIN_DATA = [
    { x:-400, z:-320, r:220, h:130, c:0x7a8b7a },
    { x:-180, z:-380, r:260, h:160, c:0x6b8e9b },
    { x: 40,  z:-360, r:240, h:140, c:0x7a9b7a },
    { x: 260, z:-400, r:270, h:170, c:0x6b8e9b },
    { x: 480, z:-340, r:230, h:130, c:0x6b9b8a },
    { x: 640, z:-300, r:200, h:120, c:0x7a9b7a },
];

function _buildMountains() {
    MOUNTAIN_DATA.forEach(function (m) {
        var geo = new THREE.ConeGeometry(m.r, m.h, 7);
        var mat = new THREE.MeshStandardMaterial({ 
            color: m.c, 
            roughness: 0.95, 
            fog: true,
            flatShading: true 
        });
        var mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(m.x, m.h / 2 - 20, m.z);
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        scene.add(mesh);

        var capGeo = new THREE.ConeGeometry(m.r * 0.28, m.h * 0.28, 7);
        var capMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.9 });
        var cap = new THREE.Mesh(capGeo, capMat);
        cap.position.set(m.x, m.h * 0.86 - 20, m.z);
        scene.add(cap);
    });
}

// [AJOUTÉ] Shader d'eau extrait en fonction réutilisable (auparavant
// codé en ligne uniquement dans _buildRiverAndBridge). Comportement
// visuel strictement identique à l'original ; permet maintenant de
// l'utiliser aussi pour la fontaine de la place centrale sans dupliquer
// le code GLSL. Chaque appel crée un matériau et des uniforms séparés
// (un par surface d'eau), car chaque plan d'eau a sa propre géométrie.
function _createWaterMaterial() {
    var waterUniforms = {
        uTime: { value: 0 },
        uColorDeep: { value: new THREE.Color(PALETTE.waterDeep) },
        uColorMid: { value: new THREE.Color(PALETTE.waterMid) },
        uColorLight: { value: new THREE.Color(PALETTE.waterLight) },
    };
    var mat = new THREE.ShaderMaterial({
        uniforms: waterUniforms,
        vertexShader: `
            uniform float uTime;
            varying vec2 vUv;
            varying float vElevation;
            void main() {
                vUv = uv;
                vec3 pos = position;
                float wave1 = sin(pos.x * 0.1 + uTime * 1.5) * 0.15;
                float wave2 = sin(pos.z * 0.08 + uTime * 1.2) * 0.12;
                float wave3 = sin((pos.x + pos.z) * 0.05 + uTime * 0.8) * 0.08;
                pos.y += wave1 + wave2 + wave3;
                vElevation = pos.y;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 uColorDeep;
            uniform vec3 uColorMid;
            uniform vec3 uColorLight;
            uniform float uTime;
            varying vec2 vUv;
            varying float vElevation;
            void main() {
                float mixFactor = smoothstep(-0.3, 0.3, vElevation);
                vec3 color = mix(uColorDeep, uColorMid, mixFactor);
                color = mix(color, uColorLight, smoothstep(0.1, 0.4, mixFactor));
                float sparkle = sin(vUv.x * 30.0 + uTime * 2.0) * sin(vUv.y * 20.0 + uTime * 1.5);
                sparkle = smoothstep(0.8, 1.0, sparkle) * 0.3;
                color += vec3(sparkle);
                float alpha = 0.85 + vElevation * 0.3;
                gl_FragColor = vec4(color, clamp(alpha, 0.7, 0.95));
            }
        `,
        transparent: true,
        side: THREE.DoubleSide,
    });
    return mat;
}

// ═══════════════════════════════════════════════════════════════
// RIVIÈRE + PONT + BARQUE — AVEC SHADER D'EAU
// ═══════════════════════════════════════════════════════════════
function _buildRiverAndBridge(isLowEnd) {
    var riverWidth = 55;
    var riverLength = 210;

    var riverGeo = new THREE.PlaneGeometry(riverWidth, riverLength, 20, 40);
    riverGeo.rotateX(-Math.PI / 2);

    // [MODIFIÉ] Réutilise _createWaterMaterial() au lieu de dupliquer le
    // shader en ligne. Résultat visuel strictement identique.
    var waterMat = _createWaterMaterial();

    _waterMesh = new THREE.Mesh(riverGeo, waterMat);
    _waterMesh.position.set(293, 0.5, 122);
    _waterMesh.rotation.y = 1.178;
    scene.add(_waterMesh);
    _animatedWaterMeshes.push(_waterMesh);

    // Bords de rivière
    var bankGeo = new THREE.BoxGeometry(riverWidth + 12, 2, riverLength);
    var bankMat = new THREE.MeshStandardMaterial({ color: PALETTE.dirt, roughness: 0.95 });
    var bank = new THREE.Mesh(bankGeo, bankMat);
    bank.position.set(293, -0.5, 122);
    bank.rotation.y = 1.178;
    scene.add(bank);

    // Pont en pierre amélioré
    _buildImprovedBridge();

    // Barque
    _buildBoat();
}

function _buildImprovedBridge() {
    var group = new THREE.Group();

    var deckGeo = new THREE.BoxGeometry(62, 5, 24);
    var deckMat = new THREE.MeshStandardMaterial({ 
        color: 0x9e9e9e, 
        roughness: 0.95,
        flatShading: true 
    });
    var deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.set(0, 5, 0);
    deck.castShadow = true;
    deck.receiveShadow = true;
    group.add(deck);

    var archGeo = new THREE.TorusGeometry(22, 4, 8, 20, Math.PI);
    var archMat = new THREE.MeshStandardMaterial({ color: 0x757575, roughness: 0.95 });
    var arch = new THREE.Mesh(archGeo, archMat);
    arch.position.set(0, 2, 0);
    arch.rotation.x = Math.PI;
    arch.rotation.z = Math.PI;
    group.add(arch);

    // Rampes
    [-1, 1].forEach(function(side) {
        var railGeo = new THREE.BoxGeometry(62, 1.5, 1);
        var rail = new THREE.Mesh(railGeo, deckMat);
        rail.position.set(0, 8, side * 11);
        group.add(rail);
        
        for (var i = -2; i <= 2; i++) {
            var postGeo = new THREE.CylinderGeometry(0.4, 0.4, 4, 6);
            var post = new THREE.Mesh(postGeo, archMat);
            post.position.set(i * 12, 6.5, side * 11);
            group.add(post);
        }
    });

    group.position.set(231, 0, 96);
    group.rotation.y = 0.393;
    scene.add(group);
}

function _buildBoat() {
    var group = new THREE.Group();

    var hullGeo = new THREE.CylinderGeometry(4, 7, 24, 8);
    var hullMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.85 });
    var hull = new THREE.Mesh(hullGeo, hullMat);
    hull.rotation.z = Math.PI / 2;
    hull.scale.set(1, 1, 0.5);
    hull.castShadow = true;
    group.add(hull);

    var benchGeo = new THREE.BoxGeometry(8, 0.8, 3);
    var benchMat = new THREE.MeshStandardMaterial({ color: 0x6d4c41 });
    [-6, 6].forEach(function(x) {
        var bench = new THREE.Mesh(benchGeo, benchMat);
        bench.position.set(x, 1, 0);
        group.add(bench);
    });

    var mastGeo = new THREE.CylinderGeometry(0.6, 0.6, 18, 6);
    var mastMat = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
    var mast = new THREE.Mesh(mastGeo, mastMat);
    mast.position.set(0, 9, 0);
    group.add(mast);

    var sailGeo = new THREE.PlaneGeometry(10, 12);
    var sailMat = new THREE.MeshStandardMaterial({ 
        color: 0xfff8e1, 
        side: THREE.DoubleSide,
        roughness: 0.8 
    });
    var sail = new THREE.Mesh(sailGeo, sailMat);
    sail.position.set(3, 10, 0);
    sail.rotation.y = Math.PI / 2;
    group.add(sail);

    group.position.set(333, 1.2, 138);
    scene.add(group);
}

// ═══════════════════════════════════════════════════════════════
// CHEMINS NATURELS
// ═══════════════════════════════════════════════════════════════
function _buildNaturalPaths() {
    var pts = BUILDINGS_3D.map(function (b) { return new THREE.Vector3(b.x, 0.3, b.z); });
    // [MODIFIÉ] closed=true : la disposition circulaire des bâtiments
    // autour de la place centrale demande un chemin qui boucle, sinon il
    // resterait un trou de ~145 unités entre le dernier bâtiment du
    // tableau (station) et le premier (school).
    var curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.4);
    var SEGMENTS = 80;
    var samples = curve.getPoints(SEGMENTS);

    var pathMat = new THREE.MeshStandardMaterial({ 
        color: PALETTE.path, 
        roughness: 0.95,
    });
    var pathEdgeMat = new THREE.MeshStandardMaterial({ 
        color: PALETTE.pathEdge, 
        roughness: 0.95 
    });

    for (var i = 0; i < samples.length - 1; i++) {
        var a = samples[i], b = samples[i + 1];
        var dx = b.x - a.x, dz = b.z - a.z;
        var len = Math.sqrt(dx * dx + dz * dz) + 0.6;
        var angle = Math.atan2(dz, dx);

        var width = 10 + Math.sin(i * 0.5) * 2;

        var seg = new THREE.Mesh(new THREE.BoxGeometry(len, 0.4, width), pathMat);
        seg.position.set((a.x + b.x) / 2, 0.15, (a.z + b.z) / 2);
        seg.rotation.y = -angle;
        seg.receiveShadow = true;
        scene.add(seg);

        [-1, 1].forEach(function(side) {
            var edgeWidth = 2 + Math.random() * 2;
            var edge = new THREE.Mesh(
                new THREE.BoxGeometry(len, 0.3, edgeWidth), 
                pathEdgeMat
            );
            edge.position.set(
                (a.x + b.x) / 2 + Math.cos(angle + Math.PI/2) * side * (width/2 + edgeWidth/2),
                0.1,
                (a.z + b.z) / 2 + Math.sin(angle + Math.PI/2) * side * (width/2 + edgeWidth/2)
            );
            edge.rotation.y = -angle;
            edge.receiveShadow = true;
            scene.add(edge);
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// VÉGÉTATION PROCÉDURALE DENSE — InstancedMesh
// ═══════════════════════════════════════════════════════════════
function _buildVegetation(isLowEnd) {
    var density = isLowEnd ? 0.3 : 1.0;

    _buildVariedTrees(Math.floor(25 * density), isLowEnd);
    _buildBushes(Math.floor(40 * density));
    _buildFlowers(Math.floor(60 * density));
    _buildTallGrass(Math.floor(80 * density));
    _buildFerns(Math.floor(30 * density));
    _buildMushrooms(Math.floor(20 * density));
    _buildStumps(Math.floor(8 * density));
}

function _buildVariedTrees(count, isLowEnd) {
    var treeTypes = [
        { trunkH: 10, trunkR: 1.2, foliageR: 6, foliageColor: 0x2e7d32 },
        { trunkH: 14, trunkR: 1.5, foliageR: 8, foliageColor: 0x388e3c },
        { trunkH: 8, trunkR: 0.8, foliageR: 5, foliageColor: 0x1b5e20 },
    ];

    treeTypes.forEach(function(type, typeIdx) {
        var typeCount = Math.floor(count / 3);
        
        var trunkGeo = new THREE.CylinderGeometry(type.trunkR * 0.7, type.trunkR, type.trunkH, 6);
        var trunkMat = new THREE.MeshStandardMaterial({ 
            color: PALETTE.woodDark, 
            roughness: 0.95 
        });
        
        var foliageMat = new THREE.MeshStandardMaterial({ 
            color: type.foliageColor, 
            roughness: 0.85,
            flatShading: true 
        });

        var trunkMesh = new THREE.InstancedMesh(trunkGeo, trunkMat, typeCount);
        var foliageMesh = new THREE.InstancedMesh(
            new THREE.IcosahedronGeometry(type.foliageR, 0), 
            foliageMat, 
            typeCount * 2
        );

        var dummy = new THREE.Object3D();
        var placed = 0;
        var foliageIdx = 0;

        for (var i = 0; i < typeCount * 3 && placed < typeCount; i++) {
            var _pos = _randInRing(205, 440); var x = _pos.x, z = _pos.z;
            
            var nearBuilding = false;
            BUILDINGS_3D.forEach(function(b) {
                var dx = x - b.x, dz = z - b.z;
                if (Math.sqrt(dx*dx + dz*dz) < b.radius + 12) nearBuilding = true;
            });
            if (nearBuilding) continue;
            if (Math.hypot(x - 293, z - 122) < 70) continue;

            var scale = _randRange(0.7, 1.4);
            var y = _smoothNoise(x, z);

            dummy.position.set(x, y + type.trunkH * scale / 2, z);
            dummy.rotation.set(0, Math.random() * Math.PI * 2, (_hash(x, z) - 0.5) * 0.1);
            dummy.scale.set(scale, scale * _randRange(0.9, 1.2), scale);
            dummy.updateMatrix();
            trunkMesh.setMatrixAt(placed, dummy.matrix);
            
            dummy.position.set(x, y + type.trunkH * scale + type.foliageR * scale * 0.3, z);
            dummy.scale.set(scale, scale, scale);
            dummy.updateMatrix();
            foliageMesh.setMatrixAt(foliageIdx++, dummy.matrix);
            
            dummy.position.set(
                x + type.foliageR * scale * 0.4, 
                y + type.trunkH * scale + type.foliageR * scale * 0.9, 
                z
            );
            dummy.scale.set(scale * 0.7, scale * 0.7, scale * 0.7);
            dummy.updateMatrix();
            foliageMesh.setMatrixAt(foliageIdx++, dummy.matrix);

            placed++;
        }

        trunkMesh.castShadow = !isLowEnd;
        trunkMesh.receiveShadow = !isLowEnd;
        foliageMesh.castShadow = !isLowEnd;
        
        scene.add(trunkMesh);
        scene.add(foliageMesh);
        _instancedMeshes['trees_trunk_' + typeIdx] = trunkMesh;
        _instancedMeshes['trees_foliage_' + typeIdx] = foliageMesh;
    });
}

function _buildBushes(count) {
    var bushGeo = new THREE.IcosahedronGeometry(1.5, 1);
    var bushMat = new THREE.MeshStandardMaterial({ 
        color: 0x4caf50, 
        roughness: 0.9,
        flatShading: true 
    });
    var bushes = new THREE.InstancedMesh(bushGeo, bushMat, count);
    var dummy = new THREE.Object3D();

    for (var i = 0; i < count; i++) {
        var _pos = _randInRing(205, 440); var x = _pos.x, z = _pos.z;
        var scale = _randRange(0.6, 1.8);
        var y = _smoothNoise(x, z);
        
        dummy.position.set(x, y + scale * 0.5, z);
        dummy.rotation.set(Math.random()*0.3, Math.random()*Math.PI*2, Math.random()*0.3);
        dummy.scale.set(scale, scale * 0.7, scale);
        dummy.updateMatrix();
        bushes.setMatrixAt(i, dummy.matrix);
    }
    
    scene.add(bushes);
    _instancedMeshes['bushes'] = bushes;
}

function _buildFlowers(count) {
    var flowerColors = [0xff6b6b, 0xffd93d, 0x6bcb77, 0x4d96ff, 0xff9f43, 0xc44569];
    var petalGeo = new THREE.SphereGeometry(0.25, 4, 4);

    flowerColors.forEach(function(color, idx) {
        var typeCount = Math.floor(count / flowerColors.length);
        var petalMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.7 });
        var flowers = new THREE.InstancedMesh(petalGeo, petalMat, typeCount);
        var dummy = new THREE.Object3D();

        for (var i = 0; i < typeCount; i++) {
            var _pos = _randInRing(205, 440); var x = _pos.x, z = _pos.z;
            var y = _smoothNoise(x, z);
            
            dummy.position.set(x, y + 0.6, z);
            dummy.scale.set(1, 1, 1);
            dummy.updateMatrix();
            flowers.setMatrixAt(i, dummy.matrix);
        }
        
        scene.add(flowers);
        _instancedMeshes['flowers_' + idx] = flowers;
    });
}

function _buildTallGrass(count) {
    var grassBladeGeo = new THREE.PlaneGeometry(0.15, 1.2);
    var grassMat = new THREE.MeshStandardMaterial({ 
        color: 0x7cb342, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
    });
    var grass = new THREE.InstancedMesh(grassBladeGeo, grassMat, count);
    var dummy = new THREE.Object3D();

    for (var i = 0; i < count; i++) {
        var _pos = _randInRing(205, 440); var x = _pos.x, z = _pos.z;
        var y = _smoothNoise(x, z);
        
        dummy.position.set(x, y + 0.6, z);
        dummy.rotation.set(0, Math.random() * Math.PI, (_hash(x, z) - 0.5) * 0.3);
        dummy.scale.set(1, _randRange(0.7, 1.5), 1);
        dummy.updateMatrix();
        grass.setMatrixAt(i, dummy.matrix);
    }
    
    grass.userData.swayPhase = Math.random() * Math.PI * 2;
    scene.add(grass);
    _instancedMeshes['tallGrass'] = grass;
}

function _buildFerns(count) {
    var fernGeo = new THREE.PlaneGeometry(0.8, 1.5);
    var fernMat = new THREE.MeshStandardMaterial({ 
        color: 0x2e7d32, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
    });
    var ferns = new THREE.InstancedMesh(fernGeo, fernMat, count);
    var dummy = new THREE.Object3D();

    for (var i = 0; i < count; i++) {
        var _pos = _randInRing(205, 440); var x = _pos.x, z = _pos.z;
        var y = _smoothNoise(x, z);
        
        dummy.position.set(x, y + 0.75, z);
        dummy.rotation.set(-0.3, Math.random() * Math.PI, 0);
        dummy.scale.set(_randRange(0.6, 1.2), _randRange(0.8, 1.5), 1);
        dummy.updateMatrix();
        ferns.setMatrixAt(i, dummy.matrix);
    }
    
    scene.add(ferns);
    _instancedMeshes['ferns'] = ferns;
}

function _buildMushrooms(count) {
    var stemGeo = new THREE.CylinderGeometry(0.15, 0.2, 0.5, 5);
    var stemMat = new THREE.MeshStandardMaterial({ color: 0xfff8e1 });
    var capGeo = new THREE.SphereGeometry(0.35, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2);
    var capColors = [0xd32f2f, 0xff8f00, 0x7b1fa2, 0xffffff];

    capColors.forEach(function(color, idx) {
        var typeCount = Math.floor(count / capColors.length);
        var capMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.6 });
        
        var stems = new THREE.InstancedMesh(stemGeo, stemMat, typeCount);
        var caps = new THREE.InstancedMesh(capGeo, capMat, typeCount);
        var dummy = new THREE.Object3D();

        for (var i = 0; i < typeCount; i++) {
            var _pos = _randInRing(205, 440); var x = _pos.x, z = _pos.z;
            var y = _smoothNoise(x, z);
            
            dummy.position.set(x, y + 0.25, z);
            dummy.scale.set(1, _randRange(0.8, 1.3), 1);
            dummy.updateMatrix();
            stems.setMatrixAt(i, dummy.matrix);
            
            dummy.position.set(x, y + 0.55, z);
            dummy.scale.set(_randRange(0.8, 1.4), 0.6, _randRange(0.8, 1.4));
            dummy.updateMatrix();
            caps.setMatrixAt(i, dummy.matrix);
        }
        
        scene.add(stems);
        scene.add(caps);
        _instancedMeshes['mushroom_stems_' + idx] = stems;
        _instancedMeshes['mushroom_caps_' + idx] = caps;
    });
}

function _buildStumps(count) {
    var stumpGeo = new THREE.CylinderGeometry(1.2, 1.5, 2, 7);
    var stumpMat = new THREE.MeshStandardMaterial({ 
        color: PALETTE.woodDark, 
        roughness: 0.95,
        flatShading: true 
    });
    var stumps = new THREE.InstancedMesh(stumpGeo, stumpMat, count);
    var dummy = new THREE.Object3D();

    for (var i = 0; i < count; i++) {
        var _pos = _randInRing(205, 440); var x = _pos.x, z = _pos.z;
        var y = _smoothNoise(x, z);
        
        dummy.position.set(x, y + 1, z);
        dummy.rotation.set(0, Math.random() * Math.PI, 0);
        dummy.scale.set(_randRange(0.8, 1.5), _randRange(0.6, 1.2), _randRange(0.8, 1.5));
        dummy.updateMatrix();
        stumps.setMatrixAt(i, dummy.matrix);
    }
    
    scene.add(stumps);
    _instancedMeshes['stumps'] = stumps;
}

// ═══════════════════════════════════════════════════════════════
// BÂTIMENTS DÉTAILLÉS — Identité visuelle unique par bâtiment
// ═══════════════════════════════════════════════════════════════
function _buildDetailedBuilding(b, isLowEnd) {
    var group = new THREE.Group();
    var baseY = _smoothNoise(b.x, b.z);
    group.position.set(b.x, baseY, b.z);

    var xp = (window.S && S.xp) || 0;
    var locked = b.lockXP > 0 && xp < b.lockXP;
    var alpha = locked ? 0.5 : 1;

    // Plateforme naturelle
    var platGeo = new THREE.CylinderGeometry(b.radius + 8, b.radius + 10, 2, 24);
    var platMat = new THREE.MeshStandardMaterial({ 
        color: b.platformColor, 
        roughness: 0.95,
        transparent: alpha < 1, 
        opacity: alpha 
    });
    var plat = new THREE.Mesh(platGeo, platMat);
    plat.position.y = 1;
    plat.receiveShadow = !isLowEnd;
    plat.castShadow = !isLowEnd;
    group.add(plat);

    // Corps principal avec détails selon style
    _buildBuildingBody(group, b, locked, alpha, isLowEnd);

    // Toit détaillé
    _buildBuildingRoof(group, b, locked, alpha, isLowEnd);

    // Détails architecturaux
    if (!locked) {
        _buildBuildingDetails(group, b, isLowEnd);
    }

    scene.add(group);

    // Sprites et labels
    var topY = 3 + b.height + b.roofHeight + baseY;

    if (b.npc && !locked) {
        var npcSprite = _makeEmojiSprite(b.npc, 22);
        npcSprite.position.set(b.x, topY + 14, b.z);
        npcSprite.userData.baseY = npcSprite.position.y;
        npcSprite.userData.phase = Math.random() * Math.PI * 2;
        scene.add(npcSprite);
        sprites.push(npcSprite);
    }

    var nl = (window.S && S.nativeLang) || 'fr';
    var statusIcon = locked ? '🔒' : (b.badgeNum === 1 ? '✅' : '⭐');
    var badgeColor = locked ? COL_LOCKED : (b.badgeNum === 1 ? COL_DONE : COL_AVAIL);
    var label = _makeLabelSprite(b.badgeNum, badgeColor, b.name[nl] || b.name.fr, b.stage[nl] || b.stage.fr);
    label.position.set(b.x, topY + (b.npc && !locked ? 26 : 14), b.z);
    scene.add(label);

    var statusSprite = _makeEmojiSprite(statusIcon, 16);
    statusSprite.position.set(b.x + b.radius * 1.3, 5 + baseY, b.z + b.radius * 0.6);
    scene.add(statusSprite);

    group.userData.buildingId = b.id;
    group.traverse(function (o) { o.userData.buildingId = b.id; });
}

function _buildBuildingBody(group, b, locked, alpha, isLowEnd) {
    var bodyH = b.height;
    var bodyR = b.radius;

    var wallMat = new THREE.MeshStandardMaterial({
        color: b.wallColor,
        emissive: b.emissiveWall || 0x000000,
        emissiveIntensity: 0.35,
        roughness: 0.8,
        metalness: 0.05,
        transparent: alpha < 1, 
        opacity: alpha,
    });

    switch (b.style) {
        case 'cottage':
            var bodyGeo = new THREE.CylinderGeometry(bodyR * 0.88, bodyR, bodyH, 8);
            var body = new THREE.Mesh(bodyGeo, wallMat);
            body.position.y = 2 + bodyH / 2;
            body.castShadow = !isLowEnd;
            group.add(body);
            break;

        case 'school':
            var mainGeo = new THREE.BoxGeometry(bodyR * 2, bodyH, bodyR * 1.6);
            var main = new THREE.Mesh(mainGeo, wallMat);
            main.position.y = 2 + bodyH / 2;
            main.castShadow = !isLowEnd;
            group.add(main);
            
            var extGeo = new THREE.BoxGeometry(bodyR * 0.8, bodyH * 0.7, bodyR * 0.8);
            var ext = new THREE.Mesh(extGeo, wallMat);
            ext.position.set(bodyR * 0.8, 2 + bodyH * 0.35, bodyR * 0.6);
            ext.castShadow = !isLowEnd;
            group.add(ext);
            break;

        case 'market':
            var marketGeo = new THREE.BoxGeometry(bodyR * 2.2, bodyH * 0.8, bodyR * 2);
            var market = new THREE.Mesh(marketGeo, wallMat);
            market.position.y = 2 + bodyH * 0.4;
            market.castShadow = !isLowEnd;
            group.add(market);
            
            for (var i = 0; i < 4; i++) {
                var colGeo = new THREE.CylinderGeometry(0.6, 0.8, bodyH * 0.9, 6);
                var colMat = new THREE.MeshStandardMaterial({ color: PALETTE.woodMid });
                var col = new THREE.Mesh(colGeo, colMat);
                var angle = (i / 4) * Math.PI * 2;
                col.position.set(
                    Math.cos(angle) * bodyR * 0.9,
                    2 + bodyH * 0.45,
                    Math.sin(angle) * bodyR * 0.9
                );
                col.castShadow = !isLowEnd;
                group.add(col);
            }
            break;

        case 'tavern':
            var tavernGeo = new THREE.CylinderGeometry(bodyR * 1.05, bodyR * 0.9, bodyH, 6);
            var tavern = new THREE.Mesh(tavernGeo, wallMat);
            tavern.position.y = 2 + bodyH / 2;
            tavern.castShadow = !isLowEnd;
            group.add(tavern);
            break;

        case 'church':
            var churchGeo = new THREE.CylinderGeometry(bodyR * 0.85, bodyR, bodyH, 8);
            var church = new THREE.Mesh(churchGeo, wallMat);
            church.position.y = 2 + bodyH / 2;
            church.castShadow = !isLowEnd;
            group.add(church);
            
            var crossV = new THREE.Mesh(
                new THREE.BoxGeometry(0.8, 4, 0.8),
                new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.6, roughness: 0.3 })
            );
            crossV.position.y = 2 + bodyH + b.roofHeight + 2;
            group.add(crossV);
            var crossH = new THREE.Mesh(
                new THREE.BoxGeometry(3, 0.8, 0.8),
                new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.6, roughness: 0.3 })
            );
            crossH.position.y = 2 + bodyH + b.roofHeight + 3;
            group.add(crossH);
            break;

        case 'theater':
            var theaterGeo = new THREE.CylinderGeometry(bodyR * 0.9, bodyR * 1.05, bodyH, 8);
            var theater = new THREE.Mesh(theaterGeo, wallMat);
            theater.position.y = 2 + bodyH / 2;
            theater.castShadow = !isLowEnd;
            group.add(theater);
            
            for (var s = 0; s < 3; s++) {
                var stepGeo = new THREE.BoxGeometry(bodyR * 2.2, 0.6, 2);
                var step = new THREE.Mesh(stepGeo, new THREE.MeshStandardMaterial({ color: PALETTE.stoneLight }));
                step.position.set(0, 0.5 + s * 0.5, bodyR + 2 + s * 1.5);
                step.receiveShadow = !isLowEnd;
                group.add(step);
            }
            break;

        default: // official
            var officialGeo = new THREE.CylinderGeometry(bodyR * 0.9, bodyR, bodyH, 8);
            var official = new THREE.Mesh(officialGeo, wallMat);
            official.position.y = 2 + bodyH / 2;
            official.castShadow = !isLowEnd;
            group.add(official);
    }

    // Fenêtres
    if (!locked) {
        var windowMat = new THREE.MeshStandardMaterial({ 
            color: 0x87ceeb, 
            emissive: 0x223344, 
            emissiveIntensity: 0.3,
            roughness: 0.2,
            metalness: 0.1
        });
        var windowCount = b.style === 'church' ? 4 : 3;
        for (var w = 0; w < windowCount; w++) {
            var winGeo = new THREE.BoxGeometry(2, 3, 0.5);
            var win = new THREE.Mesh(winGeo, windowMat);
            var angle = (w / windowCount) * Math.PI * 2;
            var wx = Math.cos(angle) * bodyR * 0.92;
            var wz = Math.sin(angle) * bodyR * 0.92;
            win.position.set(wx, 2 + bodyH * 0.6, wz);
            win.lookAt(0, 2 + bodyH * 0.6, 0);
            group.add(win);
            
            // Encadrement
            var frameGeo = new THREE.BoxGeometry(2.4, 3.4, 0.3);
            var frameMat = new THREE.MeshStandardMaterial({ color: PALETTE.woodDark });
            var frame = new THREE.Mesh(frameGeo, frameMat);
            frame.position.set(wx, 2 + bodyH * 0.6, wz);
            frame.lookAt(0, 2 + bodyH * 0.6, 0);
            group.add(frame);
        }
    }
}

function _buildBuildingRoof(group, b, locked, alpha, isLowEnd) {
    var roofMat = new THREE.MeshStandardMaterial({
        color: b.roofColor,
        emissive: b.emissiveRoof || 0x000000,
        emissiveIntensity: 0.4,
        roughness: 0.7,
        metalness: 0.05,
        transparent: alpha < 1, 
        opacity: alpha,
    });

    switch (b.style) {
        case 'market':
            var roofGeo = new THREE.ConeGeometry(b.radius * 1.3, b.roofHeight, 4);
            var roof = new THREE.Mesh(roofGeo, roofMat);
            roof.position.y = 2 + b.height + b.roofHeight / 2 - 1;
            roof.rotation.y = Math.PI / 4;
            roof.castShadow = !isLowEnd;
            group.add(roof);
            break;

        case 'church':
            var roofGeo = new THREE.ConeGeometry(b.radius * 1.1, b.roofHeight, 8);
            var roof = new THREE.Mesh(roofGeo, roofMat);
            roof.position.y = 2 + b.height + b.roofHeight / 2 - 1;
            roof.castShadow = !isLowEnd;
            group.add(roof);
            
            var spireGeo = new THREE.ConeGeometry(1, 8, 6);
            var spire = new THREE.Mesh(spireGeo, roofMat);
            spire.position.y = 2 + b.height + b.roofHeight + 4;
            group.add(spire);
            break;

        default:
            var roofGeo = new THREE.ConeGeometry(b.radius * 1.15, b.roofHeight, 8);
            var roof = new THREE.Mesh(roofGeo, roofMat);
            roof.position.y = 2 + b.height + b.roofHeight / 2 - 1;
            roof.castShadow = !isLowEnd;
            group.add(roof);
    }

    // Boule décorative au sommet
    var capGeo = new THREE.SphereGeometry(b.radius * 0.08, 8, 8);
    var capMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    var cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 2 + b.height + b.roofHeight - 1;
    group.add(cap);
}

function _buildBuildingDetails(group, b, isLowEnd) {
    // Porte
    var doorGeo = new THREE.BoxGeometry(b.radius * 0.45, b.height * 0.5, 1);
    var doorMat = new THREE.MeshStandardMaterial({ color: PALETTE.woodDark, roughness: 0.8 });
    var door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 2 + (b.height * 0.5) / 2, b.radius * 0.92);
    group.add(door);

    // Cheminée
    if (b.chimney) {
        var chimGeo = new THREE.BoxGeometry(2, 6, 2);
        var chimMat = new THREE.MeshStandardMaterial({ color: PALETTE.stone });
        var chim = new THREE.Mesh(chimGeo, chimMat);
        chim.position.set(b.radius * 0.5, 2 + b.height + 2, 0);
        chim.castShadow = !isLowEnd;
        group.add(chim);
        
        // Fumée
        if (!isLowEnd) {
            _buildChimneySmoke(group, b.radius * 0.5, 2 + b.height + 5, 0);
        }
    }

    // Balcon
    if (b.balcony) {
        var balcGeo = new THREE.BoxGeometry(b.radius * 1.6, 0.8, 3);
        var balcMat = new THREE.MeshStandardMaterial({ color: PALETTE.woodMid });
        var balc = new THREE.Mesh(balcGeo, balcMat);
        balc.position.set(0, 2 + b.height * 0.5, b.radius * 0.9);
        group.add(balc);
        
        for (var r = -1; r <= 1; r += 2) {
            var railGeo = new THREE.CylinderGeometry(0.15, 0.15, 3, 4);
            var rail = new THREE.Mesh(railGeo, balcMat);
            rail.position.set(r * b.radius * 0.7, 2 + b.height * 0.5 + 1.5, b.radius * 0.9);
            group.add(rail);
        }
    }

    // Lanternes
    if (b.lanterns > 0) {
        for (var l = 0; l < b.lanterns; l++) {
            var angle = (l / b.lanterns) * Math.PI * 2 + Math.PI / 4;
            var lx = Math.cos(angle) * (b.radius + 2);
            var lz = Math.sin(angle) * (b.radius + 2);
            
            var poleGeo = new THREE.CylinderGeometry(0.15, 0.2, 4, 4);
            var poleMat = new THREE.MeshStandardMaterial({ color: PALETTE.woodDark });
            var pole = new THREE.Mesh(poleGeo, poleMat);
            pole.position.set(lx, 4, lz);
            group.add(pole);
            
            var lanternGeo = new THREE.BoxGeometry(1, 1.5, 1);
            var lanternMat = new THREE.MeshStandardMaterial({ 
                color: 0xffeb3b, 
                emissive: 0xffa000, 
                emissiveIntensity: 0.5 
            });
            var lantern = new THREE.Mesh(lanternGeo, lanternMat);
            lantern.position.set(lx, 6.5, lz);
            group.add(lantern);
            
            if (!isLowEnd && l < 2) {
                var pl = new THREE.PointLight(0xffaa00, 0.5, 15, 2);
                pl.position.set(lx, 6.5, lz);
                group.add(pl);
                _lanternLights.push(pl);
            }
        }
    }

    // Enseigne
    if (b.sign) {
        var signGeo = new THREE.BoxGeometry(4, 1.2, 0.3);
        var signMat = new THREE.MeshStandardMaterial({ color: PALETTE.woodLight });
        var sign = new THREE.Mesh(signGeo, signMat);
        sign.position.set(b.radius * 0.8, 2 + b.height * 0.3, b.radius * 0.95);
        group.add(sign);
    }
}

function _buildChimneySmoke(group, x, y, z) {
    var smokeGeo = new THREE.SphereGeometry(0.5, 6, 6);
    var smokeMat = new THREE.MeshStandardMaterial({ 
        color: 0xdddddd, 
        transparent: true, 
        opacity: 0.4 
    });
    
    for (var i = 0; i < 5; i++) {
        var smoke = new THREE.Mesh(smokeGeo, smokeMat);
        smoke.position.set(x, y + i * 1.5, z);
        smoke.scale.setScalar(0.5 + i * 0.3);
        smoke.userData = {
            basePos: smoke.position.clone(),
                        phase: i * 0.5,
            speed: 0.3 + Math.random() * 0.2
        };
        group.add(smoke);
        _smokeParticles.push(smoke);
    }
}

// ═══════════════════════════════════════════════════════════════
// FONTAINE CENTRALE — vasque animée + jet de particules
// [AJOUTÉ] Demandé explicitement par l'utilisateur. Réutilise
// _createWaterMaterial() (même shader que la rivière) et le pattern de
// particules déjà utilisé par _buildFireflies, pour rester cohérent avec
// le reste du rendu et ne pas alourdir le budget de shaders.
// ═══════════════════════════════════════════════════════════════
function _buildFountain(isLowEnd) {
    var group = new THREE.Group();
    group.position.set(0, 0, 0);

    // Socle en pierre (anneau bas)
    var baseGeo = _getGeometry('fountainBase', function () {
        return new THREE.CylinderGeometry(22, 24, 3, 24);
    });
    var baseMat = _getMaterial('fountainStone', function () {
        return new THREE.MeshStandardMaterial({ color: 0xb0a89a, roughness: 0.9 });
    });
    var base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 1.5;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    // Vasque d'eau (disque animé par le shader d'eau partagé)
    var waterGeo = new THREE.CircleGeometry(19, 32);
    var waterMat = _createWaterMaterial();
    var waterDisc = new THREE.Mesh(waterGeo, waterMat);
    waterDisc.rotation.x = -Math.PI / 2;
    waterDisc.position.y = 3.2;
    group.add(waterDisc);
    _animatedWaterMeshes.push(waterDisc);

    // Colonne centrale + vasque supérieure (étage)
    var pillarGeo = _getGeometry('fountainPillar', function () {
        return new THREE.CylinderGeometry(2.2, 3, 11, 12);
    });
    var pillar = new THREE.Mesh(pillarGeo, baseMat);
    pillar.position.y = 8.5;
    pillar.castShadow = true;
    group.add(pillar);

    var topBowlGeo = _getGeometry('fountainTopBowl', function () {
        return new THREE.CylinderGeometry(7, 6, 2, 20);
    });
    var topBowl = new THREE.Mesh(topBowlGeo, baseMat);
    topBowl.position.y = 13.5;
    topBowl.castShadow = true;
    group.add(topBowl);

    // Petite vasque d'eau supérieure (étage du haut, même shader)
    var topWaterGeo = new THREE.CircleGeometry(6, 24);
    var topWaterMat = _createWaterMaterial();
    var topWaterDisc = new THREE.Mesh(topWaterGeo, topWaterMat);
    topWaterDisc.rotation.x = -Math.PI / 2;
    topWaterDisc.position.y = 14.3;
    group.add(topWaterDisc);
    _animatedWaterMeshes.push(topWaterDisc);

    scene.add(group);

    // Jet de particules (désactivé sur les appareils faibles, comme les
    // autres effets de particules du fichier — cohérent avec _buildFireflies).
    if (!isLowEnd) {
        var count = 60;
        var geo = new THREE.BufferGeometry();
        var positions = new Float32Array(count * 3);
        var phases = new Float32Array(count);
        var speeds = new Float32Array(count);
        for (var i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 2;
            positions[i * 3 + 1] = 14 + Math.random() * 4;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
            phases[i] = Math.random() * Math.PI * 2;
            speeds[i] = 4 + Math.random() * 3;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        var mat = new THREE.PointsMaterial({
            color: 0xbfe9ff,
            size: 0.6,
            transparent: true,
            opacity: 0.75,
            blending: THREE.AdditiveBlending
        });
        var jet = new THREE.Points(geo, mat);
        jet.userData.phases = phases;
        jet.userData.speeds = speeds;
        jet.userData.baseY = positions.slice(); // copie des positions de départ
        jet.position.copy(group.position);
        scene.add(jet);
        _instancedMeshes['fountainJet'] = jet;
    }
}

// ═══════════════════════════════════════════════════════════════
// BANCS — autour de la place centrale
// [AJOUTÉ] Demandé explicitement par l'utilisateur.
// ═══════════════════════════════════════════════════════════════
function _buildBenches() {
    var benchGeo = _getGeometry('benchSeat', function () {
        return new THREE.BoxGeometry(8, 0.8, 2.6);
    });
    var legGeo = _getGeometry('benchLeg', function () {
        return new THREE.BoxGeometry(0.6, 2.2, 2.6);
    });
    var woodMat = _getMaterial('benchWood', function () {
        return new THREE.MeshStandardMaterial({ color: 0x8d5a3b, roughness: 0.85 });
    });

    var count = 8;
    var ringRadius = 38; // à l'intérieur de la place, hors de la vasque (rayon 24)
    for (var i = 0; i < count; i++) {
        var angle = (i / count) * Math.PI * 2;
        var x = Math.sin(angle) * ringRadius;
        var z = -Math.cos(angle) * ringRadius;

        var group = new THREE.Group();
        var seat = new THREE.Mesh(benchGeo, woodMat);
        seat.position.y = 2.4;
        seat.castShadow = true;
        group.add(seat);

        [-3.2, 3.2].forEach(function (lx) {
            var leg = new THREE.Mesh(legGeo, woodMat);
            leg.position.set(lx, 1.1, 0);
            group.add(leg);
        });

        group.position.set(x, _smoothNoise(x, z), z);
        group.rotation.y = angle + Math.PI; // dossier vers l'extérieur, assise vers la fontaine
        scene.add(group);
    }
}

// ═══════════════════════════════════════════════════════════════
// LAMPADAIRES — autour de la place centrale
// [AJOUTÉ] Demandé explicitement par l'utilisateur.
// ═══════════════════════════════════════════════════════════════
function _buildLampposts(isLowEnd) {
    var poleGeo = _getGeometry('lamppostPole', function () {
        return new THREE.CylinderGeometry(0.4, 0.5, 12, 8);
    });
    var capGeo = _getGeometry('lamppostCap', function () {
        return new THREE.SphereGeometry(1.1, 10, 10);
    });
    var poleMat = _getMaterial('lamppostMetal', function () {
        return new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 0.6, metalness: 0.4 });
    });
    var glowMat = _getMaterial('lamppostGlow', function () {
        return new THREE.MeshStandardMaterial({
            color: 0xffe9a8, emissive: 0xffd76b, emissiveIntensity: 0.9, roughness: 0.4
        });
    });

    var count = 6;
    var ringRadius = 52; // un peu plus loin que les bancs, vers la limite de la place
    for (var i = 0; i < count; i++) {
        var angle = (i / count) * Math.PI * 2 + 0.5; // décalé des bancs pour ne pas se superposer
        var x = Math.sin(angle) * ringRadius;
        var z = -Math.cos(angle) * ringRadius;

        var group = new THREE.Group();
        var pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.y = 6;
        pole.castShadow = true;
        group.add(pole);

        var cap = new THREE.Mesh(capGeo, glowMat);
        cap.position.y = 12.3;
        group.add(cap);

        if (!isLowEnd) {
            var light = new THREE.PointLight(0xffd76b, 0.6, 26, 2);
            light.position.y = 12.3;
            group.add(light);
        }

        group.position.set(x, _smoothNoise(x, z), z);
        scene.add(group);
    }
}

// ═══════════════════════════════════════════════════════════════
// MOULIN — tour + ailes animées
// ═══════════════════════════════════════════════════════════════
function _buildWindmill(x, z) {
    var group = new THREE.Group();
    group.position.set(x, _smoothNoise(x, z), z);

    var towerGeo = new THREE.CylinderGeometry(5, 8, 38, 8);
    var towerMat = new THREE.MeshStandardMaterial({ color: 0xe8e0cf, roughness: 0.9 });
    var tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.y = 19;
    tower.castShadow = true;
    tower.receiveShadow = true;
    tower.userData.buildingId = 'windmill';
    group.add(tower);

    var roofGeo = new THREE.ConeGeometry(7, 12, 8);
    var roofMat = new THREE.MeshStandardMaterial({ color: 0x9b6fd6, roughness: 0.65 });
    var roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 44;
    roof.castShadow = true;
    group.add(roof);

    // Ailes animées
    var hubGroup = new THREE.Group();
    hubGroup.position.set(0, 38, 9);

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

    group.add(hubGroup);
    windmillBlades = hubGroup;

    // Label
    var label = _makeSimplePillSprite('🌬️ Moulin');
    label.position.set(0, 56, 0);
    group.add(label);

    scene.add(group);
}

// ═══════════════════════════════════════════════════════════════
// OISEAUX 3D — petits meshes qui volent au-dessus du village
// ═══════════════════════════════════════════════════════════════
function _build3DBirds() {
    var bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    var wingMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.65, side: THREE.DoubleSide });

    for (var i = 0; i < 9; i++) {
        var group = new THREE.Group();
        // Corps
        var bodyGeo = new THREE.SphereGeometry(1.2, 6, 5);
        var body = new THREE.Mesh(bodyGeo, bodyMat);
        body.scale.z = 2.2;
        group.add(body);
        // Aile gauche
        var wgGeo = new THREE.PlaneGeometry(5, 1.8);
        var wgL = new THREE.Mesh(wgGeo, wingMat);
        wgL.position.x = -3.5; wgL.rotation.z = 0.22;
        group.add(wgL);
        // Aile droite
        var wgR = new THREE.Mesh(wgGeo, wingMat);
        wgR.position.x = 3.5; wgR.rotation.z = -0.22;
        group.add(wgR);

        var startX = -320 + i * 80 + (Math.random()-0.5)*40;
        var altitude = 140 + Math.random() * 80;
        group.position.set(startX, altitude, -60 + (Math.random()-0.5)*180);
        group.userData = {
            speed:  0.5 + Math.random() * 0.7,
            phase:  Math.random() * Math.PI * 2,
            offset: Math.random() * Math.PI * 2,
            startX: startX,
            wgL: wgL, wgR: wgR,
        };
        scene.add(group);
        _birds3D.push(group);
    }
}

// ═══════════════════════════════════════════════════════════════
// NUAGES 3D — sphères groupées qui dérivent lentement
// ═══════════════════════════════════════════════════════════════
function _build3DClouds() {
    var cMat = new THREE.MeshStandardMaterial({
        color: 0xffffff, roughness: 1,
        transparent: true, opacity: 0.88,
    });
    for (var i = 0; i < 8; i++) {
        var group = new THREE.Group();
        var cfg = [
            { r: 28, x:  0,  y: 0,  z: 0  },
            { r: 22, x: 28,  y: 6,  z: 4  },
            { r: 18, x:-26,  y: 4,  z: 2  },
            { r: 16, x: 14,  y: 14, z:-4  },
            { r: 14, x:-12,  y: 12, z: 4  },
        ];
        cfg.forEach(function(c) {
            var geo = new THREE.IcosahedronGeometry(c.r + Math.random()*4, 0);
            var mesh = new THREE.Mesh(geo, cMat);
            mesh.position.set(c.x, c.y, c.z);
            group.add(mesh);
        });
        var startX = -400 + i * 110 + (Math.random()-0.5)*60;
        group.position.set(startX, 200 + Math.random()*60, -80 + (Math.random()-0.5)*200);
        group.userData.speed = 0.08 + Math.random() * 0.12;
        group.userData.startX = startX;
        scene.add(group);
        _clouds3D.push(group);
    }
}

// ═══════════════════════════════════════════════════════════════
// PAPILLONS
// ═══════════════════════════════════════════════════════════════
function _buildButterflies() {
    var wingGeo = new THREE.PlaneGeometry(0.4, 0.3);
    var wingMat = new THREE.MeshStandardMaterial({ 
        color: 0xffd700, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
    });

    for (var i = 0; i < 15; i++) {
        var group = new THREE.Group();
        
        var wingL = new THREE.Mesh(wingGeo, wingMat);
        wingL.position.x = -0.2;
        group.add(wingL);
        
        var wingR = new THREE.Mesh(wingGeo, wingMat);
        wingR.position.x = 0.2;
        group.add(wingR);

        var _bpos = _randInRing(0, 260);
        var startX = _bpos.x;
        var startZ = _bpos.z;
        group.position.set(startX, _smoothNoise(startX, startZ) + 3, startZ);
        
        group.userData = {
            wingL: wingL,
            wingR: wingR,
            basePos: group.position.clone(),
            phase: Math.random() * Math.PI * 2,
            speed: 0.3 + Math.random() * 0.4,
            radius: 2 + Math.random() * 5
        };
        
        scene.add(group);
        _butterflies.push(group);
    }
}

// ═══════════════════════════════════════════════════════════════
// PARTICULES LUMINEUSES (lucioles)
// ═══════════════════════════════════════════════════════════════
function _buildFireflies(isLowEnd) {
    if (isLowEnd) return;
    
    var count = 30;
    var geo = new THREE.BufferGeometry();
    var positions = new Float32Array(count * 3);
    var phases = new Float32Array(count);
    
    for (var i = 0; i < count; i++) {
        var _fpos = _randInRing(0, 260);
        positions[i * 3] = _fpos.x;
        positions[i * 3 + 1] = _randRange(2, 15);
        positions[i * 3 + 2] = _fpos.z;
        phases[i] = Math.random() * Math.PI * 2;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    
    var mat = new THREE.PointsMaterial({
        color: 0xffff00,
        size: 0.5,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    var fireflies = new THREE.Points(geo, mat);
    fireflies.userData.phases = phases;
    scene.add(fireflies);
    _instancedMeshes['fireflies'] = fireflies;
}

// ═══════════════════════════════════════════════════════════════
// PNJ AMBULANTS
// ═══════════════════════════════════════════════════════════════
function _buildNPCWalkers() {
    var npcConfigs = [
        { emoji: '🚶', color: 0x4fc3f7 },
        { emoji: '🏃', color: 0xffb74d },
        { emoji: '🧍', color: 0xce93d8 },
        { emoji: '👫', color: 0xa5d6a7 },
    ];

    npcConfigs.forEach(function(cfg, idx) {
        var sprite = _makeEmojiSprite(cfg.emoji, 12);
        var startBuilding = BUILDINGS_3D[idx % BUILDINGS_3D.length];
        var endBuilding = BUILDINGS_3D[(idx + 2) % BUILDINGS_3D.length];
        
        sprite.position.set(startBuilding.x, _smoothNoise(startBuilding.x, startBuilding.z) + 3, startBuilding.z);
        
        sprite.userData = {
            start: new THREE.Vector3(startBuilding.x, _smoothNoise(startBuilding.x, startBuilding.z) + 3, startBuilding.z),
            end: new THREE.Vector3(endBuilding.x, _smoothNoise(endBuilding.x, endBuilding.z) + 3, endBuilding.z),
            progress: Math.random(),
            speed: 0.05 + Math.random() * 0.08,
            waitTime: 0,
            isWaiting: false,
            baseY: _smoothNoise(startBuilding.x, startBuilding.z) + 3
        };
        
        scene.add(sprite);
        _npcWalkers.push(sprite);
    });
}

// ═══════════════════════════════════════════════════════════════
// CYCLE JOUR/NUIT — Soleil, Lune, Étoiles
// ═══════════════════════════════════════════════════════════════
function _buildCelestialBodies() {
    // Soleil
    var sunGeo = new THREE.SphereGeometry(15, 16, 16);
    var sunMat = new THREE.MeshBasicMaterial({ color: 0xfff5e6 });
    var sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(200, 300, 150);
    scene.add(sun);
    _instancedMeshes['sun'] = sun;

    // Lune
    var moonGeo = new THREE.SphereGeometry(10, 16, 16);
    var moonMat = new THREE.MeshBasicMaterial({ color: 0xe8eaf6 });
    var moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(-200, 300, -150);
    moon.visible = false;
    scene.add(moon);
    _instancedMeshes['moon'] = moon;

    // Étoiles
    var starCount = 200;
    var starGeo = new THREE.BufferGeometry();
    var starPos = new Float32Array(starCount * 3);
    var starSizes = new Float32Array(starCount);
    
    for (var i = 0; i < starCount; i++) {
        var theta = Math.random() * Math.PI * 2;
        var phi = Math.acos(2 * Math.random() - 1);
        var r = 800;
        starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        starPos[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 100;
        starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        starSizes[i] = Math.random() * 2 + 0.5;
    }
    
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    
    var starMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.5,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    });
    
    _stars = new THREE.Points(starGeo, starMat);
    scene.add(_stars);
}

function _updateDayNightCycle(t) {
    if (!_dayNightCycle) return;
    
    // Cycle complet en 5 minutes
    var cycleDuration = 300;
    _timeOfDay = (t % cycleDuration) / cycleDuration;
    
    var sunAngle = _timeOfDay * Math.PI * 2 - Math.PI / 2;
    var sunX = Math.cos(sunAngle) * 400;
    var sunY = Math.sin(sunAngle) * 300 + 100;
    
    if (_instancedMeshes['sun']) {
        _instancedMeshes['sun'].position.set(sunX, sunY, 150);
    }
    if (_sunLight) {
        _sunLight.position.set(sunX, sunY, 150);
        _sunLight.intensity = Math.max(0, Math.sin(sunAngle)) * 1.2;
    }
    
    // Lune opposée
    var moonAngle = sunAngle + Math.PI;
    if (_instancedMeshes['moon']) {
        _instancedMeshes['moon'].position.set(
            Math.cos(moonAngle) * 400,
            Math.sin(moonAngle) * 300 + 100,
            -150
        );
        _instancedMeshes['moon'].visible = Math.sin(moonAngle) > 0;
    }
    if (_moonLight) {
        _moonLight.position.set(Math.cos(moonAngle) * 400, Math.sin(moonAngle) * 300 + 100, -150);
        _moonLight.intensity = Math.max(0, Math.sin(moonAngle)) * 0.4;
    }
    
    // Couleurs atmosphériques
    var dayColor = new THREE.Color(PALETTE.skyDay);
    var sunsetColor = new THREE.Color(PALETTE.skySunset);
    var nightColor = new THREE.Color(PALETTE.skyNight);
    var currentColor = new THREE.Color();
    
    var sunHeight = Math.sin(sunAngle);
    if (sunHeight > 0.3) {
        currentColor.copy(dayColor);
    } else if (sunHeight > 0) {
        currentColor.lerpColors(sunsetColor, dayColor, sunHeight / 0.3);
    } else if (sunHeight > -0.2) {
        currentColor.lerpColors(nightColor, sunsetColor, (sunHeight + 0.2) / 0.2);
    } else {
        currentColor.copy(nightColor);
    }
    
    scene.background = currentColor;
    
    // Fog
    var fogDay = new THREE.Color(PALETTE.fogDay);
    var fogNight = new THREE.Color(PALETTE.fogNight);
    var currentFog = new THREE.Color();
    currentFog.lerpColors(fogNight, fogDay, Math.max(0, sunHeight));
    scene.fog.color = currentFog;
    
    // Étoiles
    if (_stars) {
        _stars.material.opacity = Math.max(0, -sunHeight) * 0.8;
    }
    
    // Lanternes
    var lanternIntensity = Math.max(0, -sunHeight * 2);
    _lanternLights.forEach(function(pl) {
        pl.intensity = lanternIntensity;
    });
}

// ═══════════════════════════════════════════════════════════════
// SPRITES
// ═══════════════════════════════════════════════════════════════
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

function _makeLabelSprite(num, badgeColorHex, title, subtitle) {
    var dpr = 2;
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

    ctx2.fillStyle = 'rgba(255,255,255,0.96)';
    _roundRect(ctx2, circleR + 4, 0, pillW - circleR, pillH, pillH / 2);
    ctx2.fill();
    ctx2.shadowColor = 'rgba(0,0,0,0.25)';
    ctx2.shadowBlur = 6;
    ctx2.shadowOffsetY = 2;

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

// ═══════════════════════════════════════════════════════════════
// BOUCLE D'ANIMATION — Tous les systèmes vivants
// ═══════════════════════════════════════════════════════════════
function _loop() {
    if (!running) return;
    requestAnimationFrame(_loop);
    var t = clock.elapsedTime;
    deltaTime = clock.getDelta();

    // Cycle jour/nuit
    _updateDayNightCycle(t);

    // Shader eau (rivière + fontaine)
    _animatedWaterMeshes.forEach(function (m) {
        if (m && m.material && m.material.uniforms) {
            m.material.uniforms.uTime.value = t;
        }
    });

    // Sprites NPC : flottement
    sprites.forEach(function (s) {
        s.position.y = s.userData.baseY + Math.sin(t * 1.6 + s.userData.phase) * 1.6;
    });

    // Moulin
    if (windmillBlades) windmillBlades.rotation.z += 0.012;

    // Oiseaux 3D — vol en S + battement d'ailes
    _birds3D.forEach(function (b) {
        b.userData.phase += 0.04;
        b.position.x += b.userData.speed;
        b.position.y += Math.sin(b.userData.phase + b.userData.offset) * 0.3;
        if (b.position.x > 520) b.position.x = -520;
        var wing = Math.sin(t * 5 + b.userData.offset) * 0.45;
        b.userData.wgL.rotation.z =  0.22 + wing;
        b.userData.wgR.rotation.z = -0.22 - wing;
        b.rotation.y = -0.15;
    });

    // Nuages 3D — dérive lente
    _clouds3D.forEach(function (c) {
        c.position.x += c.userData.speed;
        if (c.position.x > 520) c.position.x = -520;
    });

    // Papillons
    _butterflies.forEach(function (b) {
        b.userData.phase += b.userData.speed;
        b.position.x = b.userData.basePos.x + Math.cos(b.userData.phase) * b.userData.radius;
        b.position.z = b.userData.basePos.z + Math.sin(b.userData.phase) * b.userData.radius;
        b.position.y = b.userData.basePos.y + Math.sin(b.userData.phase * 2) * 0.5;
        var wing = Math.sin(t * 8 + b.userData.phase) * 0.6;
        b.userData.wingL.rotation.z = wing;
        b.userData.wingR.rotation.z = -wing;
    });

    // Fumée cheminées
    _smokeParticles.forEach(function (s) {
        s.position.y = s.userData.basePos.y + Math.sin(t * s.userData.speed + s.userData.phase) * 0.5;
        s.position.x = s.userData.basePos.x + Math.sin(t * 0.5 + s.userData.phase) * 0.3;
        s.material.opacity = 0.4 - (s.position.y - s.userData.basePos.y) * 0.05;
    });

    // PNJ ambulants
    _npcWalkers.forEach(function (npc) {
        if (npc.userData.isWaiting) {
            npc.userData.waitTime -= deltaTime;
            if (npc.userData.waitTime <= 0) {
                npc.userData.isWaiting = false;
            }
            // Animation d'attente : regarder autour
            npc.scale.x = 1 + Math.sin(t * 2 + npc.userData.progress * 10) * 0.05;
            return;
        }

        npc.userData.progress += npc.userData.speed * deltaTime;
        
        if (npc.userData.progress >= 1) {
            npc.userData.progress = 0;
            npc.userData.isWaiting = true;
            npc.userData.waitTime = 2 + Math.random() * 3;
            // Swap start/end
            var temp = npc.userData.start;
            npc.userData.start = npc.userData.end;
            npc.userData.end = temp;
        }

        var p = npc.userData.progress;
        npc.position.lerpVectors(npc.userData.start, npc.userData.end, p);
        npc.position.y = _smoothNoise(npc.position.x, npc.position.z) + 3;
    });

    // Lucioles
    if (_instancedMeshes['fireflies']) {
        var ff = _instancedMeshes['fireflies'];
        var positions = ff.geometry.attributes.position.array;
        var phases = ff.userData.phases;
        for (var i = 0; i < phases.length; i++) {
            positions[i * 3 + 1] += Math.sin(t * 2 + phases[i]) * 0.02;
        }
        ff.geometry.attributes.position.needsUpdate = true;
    }

    // [AJOUTÉ] Jet de particules de la fontaine centrale : chaque
    // particule retombe en cycle (style jet d'eau continu) plutôt que de
    // simplement osciller comme les lucioles.
    if (_instancedMeshes['fountainJet']) {
        var jet = _instancedMeshes['fountainJet'];
        var jpos = jet.geometry.attributes.position.array;
        var jphases = jet.userData.phases;
        var jspeeds = jet.userData.speeds;
        var jbase = jet.userData.baseY;
        for (var j = 0; j < jphases.length; j++) {
            var cycle = (t * jspeeds[j] + jphases[j]) % 6.0;
            jpos[j * 3 + 1] = jbase[j * 3 + 1] + cycle * 1.4 - cycle * cycle * 0.22;
        }
        jet.geometry.attributes.position.needsUpdate = true;
    }

    controls && controls.update();
    renderer.render(scene, camera);
}

// ═══════════════════════════════════════════════════════════════
// RESIZE
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
// CLIC / TAP SUR BÂTIMENT — API inchangée
// ═══════════════════════════════════════════════════════════════
function _onCanvasClick(e) {
    var rect = canvasEl.getBoundingClientRect();
    _raycastAt(e.clientX - rect.left, e.clientY - rect.top, rect);
}
// [AJOUTÉ] Mémorise la position de départ du toucher.
var _touchStartX = 0, _touchStartY = 0;
function _onCanvasTouchStart(e) {
    if (!e.touches || !e.touches[0]) return;
    _touchStartX = e.touches[0].clientX;
    _touchStartY = e.touches[0].clientY;
}
function _onCanvasTouchEnd(e) {
    if (!e.changedTouches || !e.changedTouches[0]) return;
    var t = e.changedTouches[0];
    // [AJOUTÉ] Si le doigt a parcouru plus de 12px entre touchstart et
    // touchend, on considère que c'était un geste de rotation/pan, pas un
    // tap sur un bâtiment : on ignore le raycast pour éviter un clic
    // accidentel en fin de rotation de caméra.
    var movedDist = Math.hypot(t.clientX - _touchStartX, t.clientY - _touchStartY);
    if (movedDist > 12) return;
    var rect = canvasEl.getBoundingClientRect();
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

// ═══════════════════════════════════════════════════════════════
// OUVERTURE DU PANNEAU DE LIEU — PNJ + bio + action
// ═══════════════════════════════════════════════════════════════
function _onTapBuilding(id) {
    var b = BUILDINGS_3D.find(function (b) { return b.id === id; });
    if (!b) return;
    var nl  = (window.S && S.nativeLang) || 'fr';
    var tl  = (window.S && S.targetLang) || 'fr';
    var xp  = (window.S && S.xp) || 0;
    if (window.LV_SOUND) window.LV_SOUND.play('tap');

    // Bâtiment verrouillé
    var locked = b.lockXP > 0 && xp < b.lockXP;
    if (locked) {
        var remaining = b.lockXP - xp;
        var msg = {
            fr: '🔒 ' + remaining + ' XP pour débloquer ' + b.name.fr,
            en: '🔒 ' + remaining + ' XP to unlock ' + b.name.en,
            ht: '🔒 ' + remaining + ' XP pou debloke ' + b.name.ht,
        }[nl] || '🔒 ' + remaining + ' XP';
        if (typeof showNotif === 'function') showNotif(msg, 3000);
        return;
    }

    var name = b.name[nl] || b.name.fr;
    var desc = b.desc ? (b.desc[nl] || b.desc.fr) : '';

    // Récupérer le NPC depuis world.js ou KROVA_NPCS
    var npcData = null;
    if (b.npcId) {
        npcData = (window.WORLD_NPCS && window.WORLD_NPCS[b.npcId])
               || (window.KROVA_NPCS && window.KROVA_NPCS[b.npcId])
               || null;
    }

    // Libellés d'action selon la langue
    var actionLabels = {
        lessons:  { fr:'📖 Ouvrir les leçons',    en:'📖 Open lessons',      ht:'📖 Ouvri leson' },
        practice: { fr:'💬 Pratiquer la langue',   en:'💬 Practice language', ht:'💬 Pratike lang' },
        dialogue: { fr:'🗣️ Parler avec ce PNJ',   en:'🗣️ Talk to this NPC', ht:'🗣️ Pale ak PNJ sa' },
    };

    // Construire le contenu du panneau
    var locTitle = document.getElementById('locTitle');
    var npcList  = document.getElementById('npcList');
    if (locTitle) locTitle.textContent = b.npc ? (b.npc + ' ') + name : name;

    if (!npcList) { running = false; if (typeof showScreen==='function') showScreen('screen-location'); return; }

    var html = '';

    // ── Lore du lieu ──
    if (desc) {
        html += '<div style="margin:0 16px 12px;padding:12px 14px;'
          + 'background:rgba(255,255,255,0.04);border-left:3px solid rgba(255,215,0,0.28);'
          + 'border-radius:0 12px 12px 0;font-size:0.78rem;color:rgba(255,255,255,0.50);'
          + 'font-style:italic;line-height:1.55;">' + desc + '</div>';
    }

    // ── Carte PNJ ──
    if (npcData) {
        var npcName  = npcData.name || '';
        var npcEmoji = npcData.emoji || (b.npc || '👤');
        var npcRole  = npcData.role  ? (npcData.role[nl] || npcData.role.fr || '') : '';
        var npcBio   = npcData.bio   ? (npcData.bio[nl]  || npcData.bio.fr  || '') : '';
        var npcFirst = npcData.firstMeet ? (npcData.firstMeet[nl] || npcData.firstMeet.fr || '') : '';
        var accentColor = '#4ecf70';
        if (b.id === 'market')  accentColor = '#ffd700';
        if (b.id === 'library') accentColor = '#c084fc';
        if (b.id === 'school')  accentColor = '#4ecf70';
        if (b.id === 'castle')  accentColor = '#aa44ff';

        html += '<div style="margin:0 16px 12px;display:flex;align-items:flex-start;gap:14px;'
          + 'padding:16px 16px;background:rgba(255,255,255,0.04);'
          + 'border:1.5px solid rgba(255,255,255,0.08);border-radius:18px;position:relative;overflow:hidden;">'
          + '<div style="position:absolute;left:0;top:0;bottom:0;width:3px;background:' + accentColor + ';border-radius:3px 0 0 3px;"></div>'
          + '<div style="width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,0.06);'
          + 'border:2px solid ' + accentColor + ';display:flex;align-items:center;justify-content:center;'
          + 'font-size:1.7rem;flex-shrink:0;">' + npcEmoji + '</div>'
          + '<div style="flex:1;min-width:0;">'
          + '<div style="font-weight:800;font-size:0.95rem;color:#f0e8d0;">' + npcName + '</div>'
          + '<div style="font-size:0.68rem;color:rgba(255,255,255,0.38);margin-top:2px;">' + npcRole + '</div>'
          + (npcBio ? '<div style="font-size:0.74rem;color:rgba(255,255,255,0.50);margin-top:6px;line-height:1.45;">' + npcBio + '</div>' : '')
          + (npcFirst ? '<div style="font-size:0.72rem;color:' + accentColor + ';margin-top:8px;font-style:italic;line-height:1.4;">'
            + '"' + npcFirst + '"</div>' : '')
          + '</div>'
          + '</div>';

        // ── Bouton Dialogue ──
        html += '<button onclick="_v3dDialogue(\'' + b.id + '\',\'' + b.npcId + '\')" style="'
          + 'display:flex;align-items:center;gap:14px;width:calc(100% - 32px);margin:0 16px 10px;'
          + 'padding:14px 18px;background:linear-gradient(135deg,' + accentColor + '18,' + accentColor + '08);'
          + 'border:1.5px solid ' + accentColor + '55;border-radius:16px;cursor:pointer;'
          + 'color:#f0e8d0;text-align:left;transition:all 0.18s;"'
          + ' onmouseover="this.style.background=\'' + accentColor + '28\'"'
          + ' onmouseout="this.style.background=\'linear-gradient(135deg,' + accentColor + '18,' + accentColor + '08)\'">'
          + '<span style="font-size:1.6rem;">🗣️</span>'
          + '<div><div style="font-weight:800;font-size:0.88rem;">'
          + (actionLabels.dialogue[nl] || actionLabels.dialogue.fr)
          + '</div><div style="font-size:0.68rem;color:rgba(255,255,255,0.38);margin-top:2px;">'
          + {fr:'Pratique la langue cible',en:'Practice the target language',ht:'Pratike lang sib la'}[nl]
          + '</div></div>'
          + '<span style="margin-left:auto;color:' + accentColor + ';font-size:1.3rem;">›</span>'
          + '</button>';
    } else if (b.npc) {
        html += '<div style="padding:20px 16px;text-align:center;font-size:3rem;">' + b.npc + '</div>';
    }

    // ── Bouton action secondaire ──
    if (b.action && b.action !== 'dialogue') {
        var actLabel = actionLabels[b.action] ? (actionLabels[b.action][nl] || actionLabels[b.action].fr) : b.action;
        html += '<button onclick="_v3dAction(\'' + b.action + '\')" style="'
          + 'display:flex;align-items:center;gap:14px;width:calc(100% - 32px);margin:0 16px 10px;'
          + 'padding:14px 18px;background:rgba(255,255,255,0.04);'
          + 'border:1.5px solid rgba(255,255,255,0.08);border-radius:16px;cursor:pointer;'
          + 'color:#f0e8d0;text-align:left;">'
          + '<span style="font-size:1.4rem;">' + (b.action === 'lessons' ? '📖' : '💬') + '</span>'
          + '<div><div style="font-weight:800;font-size:0.88rem;">' + actLabel + '</div>'
          + '<div style="font-size:0.68rem;color:rgba(255,255,255,0.38);margin-top:2px;">'
          + {fr:'Apprends avec ce lieu',en:'Learn with this location',ht:'Aprann ak kote sa a'}[nl]
          + '</div></div>'
          + '<span style="margin-left:auto;color:rgba(255,255,255,0.25);font-size:1.3rem;">›</span>'
          + '</button>';
    }

    if (!npcData && !b.npc && !b.action) {
        html += '<div style="padding:32px 20px;text-align:center;color:rgba(255,255,255,0.28);font-size:0.88rem;">'
          + {fr:'C\'est chez toi. Ici tu te reposes.',en:'This is your home. Rest here.',ht:'Se lakay ou. Repoze isit.'}[nl]
          + '</div>';
    }

    // ── Carte curriculum ──
    if (window.CURRICULUM && typeof window.CURRICULUM.getUnitsForLang === 'function') {
        var currUnits = window.CURRICULUM.getUnitsForLang(tl);
        var matchedUnit = currUnits.find(function (u) { return u.unlocksBuilding === b.id; });
        if (matchedUnit) {
            var uTitle = matchedUnit.title[nl] || matchedUnit.title.fr || matchedUnit.title.en;
            var uRule  = matchedUnit.rule ? (matchedUnit.rule[nl] || matchedUnit.rule.fr) : '';
            var currHtml = '<div style="margin:0 16px 12px;padding:12px 14px;'
              + 'background:rgba(255,215,0,0.05);border:1px solid rgba(255,215,0,0.15);'
              + 'border-radius:14px;">'
              + '<div style="font-size:0.66rem;font-weight:800;letter-spacing:0.05em;color:#ffd700;text-transform:uppercase;margin-bottom:4px;">📚 ' + uTitle + '</div>'
              + (uRule ? '<div style="font-size:0.74rem;color:rgba(255,255,255,0.55);line-height:1.4;">' + uRule + '</div>' : '')
              + '</div>';
            html = currHtml + html;
        }
    }

    npcList.innerHTML = html;

    running = false;
    if (typeof showScreen === 'function') showScreen('screen-location');

    // Patch bouton retour
    var back = document.querySelector('#screen-location .back-btn');
    if (back) {
        back._v3dPatched = false;
    }
    if (back && !back._v3dPatched) {
        back._v3dPatched = true;
        var orig = back.onclick;
        back.onclick = function () {
            if (typeof orig === 'function') orig.call(this);
            else if (typeof showScreen === 'function') showScreen('screen-village');
            running = true;
            requestAnimationFrame(function(){ _loop(); });
        };
    }
}

// ═══════════════════════════════════════════════════════════════
// DIALOGUE & ACTION — API inchangées
// ═══════════════════════════════════════════════════════════════
window._v3dDialogue = function(locId, npcId) {
    running = false;

    if (typeof LOCATIONS === 'undefined' || typeof openDialogue !== 'function') {
        console.warn('LOCATIONS ou openDialogue non disponible');
        if (typeof showScreen === 'function') showScreen('screen-dialogue');
        return;
    }

    var loc = LOCATIONS.find(function(l){ return l.id === locId; });
    if (!loc) {
        console.warn('Location introuvable:', locId);
        if (typeof showNotif === 'function') showNotif('⚠️ Lieu introuvable: ' + locId, 2500);
        return;
    }

    var npc = (loc.npcs||[]).find(function(n){ return n.id === npcId; });
    if (!npc) {
        npc = (loc.npcs||[])[0];
        if (!npc) {
            console.warn('NPC introuvable:', npcId, 'dans', locId);
            if (typeof showNotif === 'function') showNotif('⚠️ Personnage introuvable', 2500);
            return;
        }
        npcId = npc.id;
    }

    window._villageDialogueMode = true;
    openDialogue(locId, npcId);

    if (typeof updateDailyProgress === 'function') updateDailyProgress('dialogue', 1);
    if (typeof updateWeeklyProgress === 'function') updateWeeklyProgress('talk_npc', 1);

    setTimeout(function() {
        var backBtns = document.querySelectorAll('#screen-dialogue .back-btn, #screen-dialogue [onclick*="screen-location"], #screen-dialogue [onclick*="goVillage"]');
        backBtns.forEach(function(btn) {
            if (!btn._v3dDialPatch) {
                btn._v3dDialPatch = true;
                var origClick = btn.onclick;
                btn.onclick = function(e) {
                    running = true;
                    if (typeof origClick === 'function') origClick.call(this, e);
                    else if (typeof showScreen === 'function') showScreen('screen-village');
                    requestAnimationFrame(function(){ if(renderer) _loop(); });
                };
            }
        });
    }, 200);
};

window._v3dAction = function(action) {
    running = false;
    switch (action) {
        case 'lessons':
            if (typeof ensureLearningBindings === 'function') ensureLearningBindings();
            var fk = window.VOCAB ? Object.keys(window.VOCAB)[0] : null;
            if (fk && typeof loadVocab === 'function') loadVocab(fk);
            if (typeof showScreen === 'function') showScreen('screen-vocab');
            break;
        case 'practice':
            var fp = window.PHRASES_DATA ? Object.keys(window.PHRASES_DATA)[0] : null;
            if (fp && typeof loadPhrases === 'function') loadPhrases(fp);
            if (typeof showScreen === 'function') showScreen('screen-phrases');
            break;
        default:
            if (typeof showScreen === 'function') showScreen('screen-' + action);
    }
};

// ═══════════════════════════════════════════════════════════════
// NAV BAR — API inchangée
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
// MÉTÉO / TEMPS — Compatibilité inchangée
// ═══════════════════════════════════════════════════════════════
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

console.log('✅ village_3d.js v6 — KROVA Overhaul Visuel chargé');

})();
