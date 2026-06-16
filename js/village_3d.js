// village_3d.js — KROVA VIVANT v4
// Améliorations : couleurs vives et harmonieuses, gazon verdoyant riche,
// oiseaux en vol, animations fluides, intégration complète NPC/dialogue
// ================================================================
(function () {
'use strict';

// ================================================================
// PALETTE HARMONISÉE — vif mais équilibré
// Principe : saturation haute, luminosité modérée, teintes cohérentes
// ================================================================
var PAL = {
  // Sol et nature
  GRASS_BASE:   0x3db85a,  // vert prairie riche
  GRASS_LIGHT:  0x52d46e,  // gazon clair (zones ensoleillées)
  GRASS_DARK:   0x2a9040,  // gazon ombre
  GRASS_RIM:    0x45c760,  // bordure île
  GROUND_EARTH: 0x8a6240,  // terre visible
  PATH:         0xe8cc88,  // chemin sable chaud

  // Eau
  WATER:        0x3ab0e0,  // bleu eau claire
  WATER_SHINE:  0x70d0f0,  // reflets

  // Pierres et bois
  STONE:        0xb0a090,  // pierre naturelle
  STONE_DARK:   0x8a7a6a,  // pierre ombre
  WOOD:         0x9a6535,  // bois chaud
  WOOD_DARK:    0x7a4e28,  // bois sombre

  // Statuts
  DONE:         0x4ecf70,
  AVAIL:        0xffd700,
  LOCKED:       0x8899aa,

  // Ciel
  SKY_TOP:      '#4a9eff',
  SKY_MID:      '#86cbff',
  SKY_BOT:      '#d6f0ff',

  // Montagnes
  MTN_A:        0x7aad8a,
  MTN_B:        0x6a9ab8,
  MTN_SNOW:     0xf0f4f8,

  // Brume
  FOG:          0xbde8ff,
};

// ================================================================
// BÂTIMENTS
// ================================================================
var BUILDINGS_3D = [
  {
    id:'home', badgeNum:1,
    name:{ fr:'Ta Maison', en:'Your Home', ht:'Kay Ou' },
    stage:{ fr:'Débutant', en:'Beginner', ht:'Debitan' },
    desc:{ fr:"C'est ici que tu te reposes et prépares tes journées à Krova.", en:'This is where you rest and prepare your days in Krova.', ht:'Se isit ou repoze ak prepare jou ou yo nan Krova.' },
    x:-220, z:30,
    wallColor:0xffe090, roofColor:0xe87818,
    emissiveWall:0x7a5000, emissiveRoof:0x5a2800,
    radius:16, height:20, roofHeight:15,
    platformColor:0xc87c10,
    npc:null, npcId:null, lockXP:0, action:null,
  },
  {
    id:'school', badgeNum:2,
    name:{ fr:"École de Mme Amara", en:"Ms. Amara's School", ht:'Lekòl Madan Amara' },
    stage:{ fr:'Élémentaire', en:'Elementary', ht:'Elemantè' },
    desc:{ fr:"Mme Amara enseigne ici depuis 15 ans. Elle t'apprend les bases de la langue.", en:'Ms. Amara has taught here for 15 years. She teaches you the language basics.', ht:'Madan Amara ap anseye isit depi 15 an. Li anseye ou baz lang lan.' },
    x:-110, z:-40,
    wallColor:0x78f098, roofColor:0x12b840,
    emissiveWall:0x006828, emissiveRoof:0x005020,
    radius:18, height:24, roofHeight:17,
    platformColor:0x20b845,
    npc:'👩‍🏫', npcId:'teacher', lockXP:0, action:'lessons',
  },
  {
    id:'market', badgeNum:3,
    name:{ fr:'Marché de Diallo', en:"Diallo's Market", ht:'Mache Diallo' },
    stage:{ fr:'Intermédiaire', en:'Intermediate', ht:'Entèmedyè' },
    desc:{ fr:"Diallo vend de tout. Ici, tu apprends à négocier, compter et te débrouiller.", en:'Diallo sells everything. Here you learn to negotiate, count and get by.', ht:'Diallo vann tout bagay. Isit ou aprann negosye, konte epi degaje ou.' },
    x:10, z:30,
    wallColor:0xffea60, roofColor:0x2288ff,
    emissiveWall:0x806000, emissiveRoof:0x003a90,
    radius:19, height:25, roofHeight:18,
    platformColor:0xd4a800,
    npc:'🧑‍🌾', npcId:'merchant', lockXP:0, action:'practice',
  },
  {
    id:'library', badgeNum:4,
    name:{ fr:'Bibliothèque de Sorana', en:"Sorana's Library", ht:'Bibliyotèk Sorana' },
    stage:{ fr:'Avancé', en:'Advanced', ht:'Avanse' },
    desc:{ fr:"Sorana garde des centaines de livres. Elle cherche quelqu'un pour déchiffrer les manuscrits anciens.", en:'Sorana keeps hundreds of books. She seeks someone to decipher ancient manuscripts.', ht:'Sorana kenbe dè santèn liv. Li chache yon moun pou dechifre maniskri ansyen.' },
    x:130, z:-30,
    wallColor:0xe090ff, roofColor:0xaa00ff,
    emissiveWall:0x58008a, emissiveRoof:0x3a0068,
    radius:20, height:27, roofHeight:19,
    platformColor:0x9900dd,
    npc:'👩‍💼', npcId:'librarian', lockXP:400, action:'practice',
  },
  {
    id:'castle', badgeNum:5,
    name:{ fr:'Château de Lingoria', en:'Lingoria Castle', ht:'Chato Lingoria' },
    stage:{ fr:'Maîtrise', en:'Mastery', ht:'Mèt' },
    desc:{ fr:"Le Gouverneur Isabeau attend les meilleurs linguistes. Lingoria a besoin de toi.", en:'Governor Isabeau awaits the best linguists. Lingoria needs you.', ht:'Gouvènè Isabeau ap tann pi bon lengwis yo. Lingoria bezwen ou.' },
    x:270, z:40,
    wallColor:0xe0d8c0, roofColor:0xbb55ff,
    emissiveWall:0x302808, emissiveRoof:0x4800aa,
    radius:26, height:36, roofHeight:24,
    platformColor:0xa09080,
    npc:null, npcId:'governor', lockXP:1200, isCastle:true, action:null,
  },
];

var TREE_POS = [
  [-300,80],[-280,-20],[-250,110],[-180,-90],[-150,80],
  [-90,90],[-60,-100],[-20,-70],[40,-90],[80,90],
  [120,100],[170,90],[200,-90],[230,-100],[300,90],
  [320,-10],[-330,10],[-10,140],[60,150],[260,150],
  [-340,-60],[380,30],[-200,140],[100,-120],[200,130],
];

var MOUNTAIN_DATA = [
  { x:-360, z:-320, r:220, h:120, c:PAL.MTN_A },
  { x:-160, z:-360, r:260, h:150, c:PAL.MTN_B },
  { x:60,   z:-340, r:230, h:130, c:PAL.MTN_A },
  { x:240,  z:-380, r:270, h:160, c:PAL.MTN_B },
  { x:400,  z:-300, r:210, h:115, c:PAL.MTN_A },
];

// ================================================================
// ÉTAT
// ================================================================
var renderer, scene, camera, controls, clock;
var sprites=[], trees=[], windmillBlades=null;
var birds=[];
var raycaster, pointer, canvasEl;
var running=false;
var _flowParticles=[];

// ================================================================
// POINT D'ENTRÉE
// ================================================================
window.goVillage = function() {
  if (!window.S) return;
  _updateHUD();
  if (typeof window.showScreen==='function') window.showScreen('screen-village');
  else {
    document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active');});
    var vs=document.getElementById('screen-village');
    if(vs) vs.classList.add('active');
  }
  _ensureLayout();
  _buildNavBar();
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      if(!renderer) _init3D(); else _onResize();
      if(!running){running=true;_loop();}
    });
  });
  if(window._timeUpdateInterval) clearInterval(window._timeUpdateInterval);
  window._timeUpdateInterval=setInterval(updateTime,30000);
  if(typeof updateTime==='function') updateTime();
};

function _updateHUD(){
  var xp=(window.S&&S.xp)||0, e;
  e=document.getElementById('hudPlayer'); if(e) e.textContent='👤 '+(S.playerName||'');
  e=document.getElementById('hudLang');   if(e) e.textContent=((window.FLAGS&&FLAGS[S.targetLang])||'')+' '+((window.LANG_NAMES&&LANG_NAMES[S.targetLang])||'');
  e=document.getElementById('hudXP');     if(e) e.textContent=xp+' XP';
}

function _ensureLayout(){
  var vs=document.getElementById('screen-village'); if(!vs) return;
  var c=document.getElementById('villageCanvas');
  var wrap=document.querySelector('.village-canvas-wrap');
  if(c&&c.parentElement===vs&&!wrap){
    var div=document.createElement('div'); div.className='village-canvas-wrap';
    vs.insertBefore(div,c); div.appendChild(c);
    var tip=document.getElementById('locTooltip');
    if(tip&&tip.parentElement===vs) div.appendChild(tip);
  }
}

// ================================================================
// INIT THREE.JS
// ================================================================
function _init3D(){
  canvasEl=document.getElementById('villageCanvas'); if(!canvasEl) return;
  if(!window.THREE){ console.error('❌ Three.js non chargé'); return; }

  var wrap=document.querySelector('.village-canvas-wrap')||document.getElementById('screen-village');
  var r=wrap.getBoundingClientRect();
  var W=r.width>0?r.width:window.innerWidth;
  var H=r.height>0?r.height:(window.innerHeight-120);

  try{
    // ── Renderer ──
    renderer=new THREE.WebGLRenderer({canvas:canvasEl, antialias:true, alpha:false});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    renderer.setSize(W,H,false);
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.1;

    // ── Scène ──
    scene=new THREE.Scene();
    scene.background=_skyTexture();
    scene.fog=new THREE.Fog(PAL.FOG, 450, 1000);

    // ── Caméra ──
    camera=new THREE.PerspectiveCamera(36,W/H,1,2000);
    camera.position.set(160,230,560);
    camera.lookAt(20,0,0);

    // ── Lumières naturelles harmonisées ──
    var hemi=new THREE.HemisphereLight(0xd4eeff, 0x4a9050, 1.1);
    scene.add(hemi);

    var sun=new THREE.DirectionalLight(0xfff8e8, 1.3);
    sun.position.set(200,280,160);
    sun.castShadow=true;
    sun.shadow.mapSize.set(2048,2048);
    sun.shadow.camera.left=-440; sun.shadow.camera.right=440;
    sun.shadow.camera.top=440;   sun.shadow.camera.bottom=-440;
    sun.shadow.camera.near=1;    sun.shadow.camera.far=900;
    sun.shadow.bias=-0.0012;
    scene.add(sun);

    // Lumière de remplissage douce (côté opposé au soleil)
    var fill=new THREE.DirectionalLight(0x8bbfff, 0.35);
    fill.position.set(-150,80,-100);
    scene.add(fill);

    var ambient=new THREE.AmbientLight(0xffffff, 0.22);
    scene.add(ambient);

    // ── Construction du monde ──
    _buildGround();
    _buildMountains();
    _buildRiverAndBridge();
    _buildWindingPath();
    _buildSignpost(-260,60);
    _buildFlowers();

    BUILDINGS_3D.forEach(function(b){
      if(b.isCastle) _buildCastle(b); else _buildBuilding(b);
    });

    _buildWindmill(360,-50);

    TREE_POS.forEach(function(p){ _buildTree(p[0],p[1]); });

    // ── Oiseaux ──
    _buildBirds();

  } catch(err){
    console.error('❌ Erreur init 3D:',err);
    if(typeof showNotif==='function') showNotif('⚠️ Erreur 3D',4000);
    return;
  }

  // ── Contrôles ──
  try{
    if(typeof THREE.OrbitControls!=='function') throw new Error('OrbitControls indisponible');
    controls=new THREE.OrbitControls(camera,renderer.domElement);
    controls.enableDamping=true; controls.dampingFactor=0.10;
    controls.enableRotate=false; controls.screenSpacePanning=false;
    controls.minDistance=240; controls.maxDistance=900;
    controls.target.set(20,0,0);
    controls.touches.ONE=THREE.TOUCH.PAN;
    controls.touches.TWO=THREE.TOUCH.DOLLY_PAN;
    controls.mouseButtons.LEFT=THREE.MOUSE.PAN;
    controls.mouseButtons.RIGHT=THREE.MOUSE.PAN;
    controls.panSpeed=0.9; controls.zoomSpeed=0.9;
    controls.update();
  } catch(err){ console.warn('OrbitControls indisponible:',err.message); controls=null; }

  raycaster=new THREE.Raycaster(); pointer=new THREE.Vector2();
  canvasEl.addEventListener('click',_onCanvasClick);
  canvasEl.addEventListener('touchend',_onCanvasTouchEnd,{passive:true});

  clock=new THREE.Clock();
  if(window._onCanvasResize) window.removeEventListener('resize',window._onCanvasResize);
  window._onCanvasResize=_onResize;
  window.addEventListener('resize',_onCanvasResize);

  renderer.render(scene,camera);
  setTimeout(_onResize,300);
}

// ================================================================
// CIEL — dégradé riche
// ================================================================
function _skyTexture(){
  var c=document.createElement('canvas'); c.width=2; c.height=512;
  var ctx=c.getContext('2d');
  var g=ctx.createLinearGradient(0,0,0,512);
  g.addColorStop(0,   '#2a7fff');
  g.addColorStop(0.3, '#5aaeff');
  g.addColorStop(0.6, '#90d0ff');
  g.addColorStop(0.85,'#c8ecff');
  g.addColorStop(1,   '#e8f8ff');
  ctx.fillStyle=g; ctx.fillRect(0,0,2,512);
  return new THREE.CanvasTexture(c);
}

// ================================================================
// SOL — île verdoyante multicouche
// ================================================================
function _buildGround(){
  // Couche principale — herbe riche
  var geo=new THREE.CylinderGeometry(420,445,14,64);
  var mat=new THREE.MeshStandardMaterial({color:PAL.GRASS_BASE, roughness:0.9, metalness:0});
  var ground=new THREE.Mesh(geo,mat);
  ground.position.set(20,-7,0);
  ground.receiveShadow=true;
  scene.add(ground);

  // Couche de surface — herbe plus claire (effet pelouse)
  var topGeo=new THREE.CylinderGeometry(419,420,1,64);
  var topMat=new THREE.MeshStandardMaterial({color:PAL.GRASS_LIGHT, roughness:0.85});
  var top=new THREE.Mesh(topGeo,topMat);
  top.position.set(20,0.5,0);
  top.receiveShadow=true;
  scene.add(top);

  // Rebord — transition terre/mer
  var rimGeo=new THREE.TorusGeometry(430,9,12,64);
  var rimMat=new THREE.MeshStandardMaterial({color:PAL.GRASS_RIM, roughness:0.88});
  var rim=new THREE.Mesh(rimGeo,rimMat);
  rim.rotation.x=Math.PI/2; rim.position.set(20,-0.3,0);
  scene.add(rim);

  // Bandes d'herbe ombre sous les arbres (variation de teinte)
  var patchMat=new THREE.MeshStandardMaterial({color:PAL.GRASS_DARK, roughness:0.95});
  [[-200,-60],[-80,60],[60,-80],[200,60],[-300,20]].forEach(function(p){
    var pGeo=new THREE.CircleGeometry(28+Math.random()*20,12);
    var patch=new THREE.Mesh(pGeo,patchMat);
    patch.rotation.x=-Math.PI/2;
    patch.position.set(p[0],0.55,p[1]);
    patch.receiveShadow=true;
    scene.add(patch);
  });
}

// ================================================================
// FLEURS — petites touches de couleur dans le gazon
// ================================================================
function _buildFlowers(){
  var flowerCols=[0xff5566,0xffcc00,0xff88cc,0xffffff,0xff7733];
  var positions=[
    [-240,50],[-200,70],[-170,-30],[-100,60],[0,80],
    [50,-60],[100,60],[170,-50],[240,70],[320,20],
    [-280,-40],[-150,100],[20,-100],[130,90],[280,-60],
  ];
  positions.forEach(function(p){
    var col=flowerCols[Math.floor(Math.random()*flowerCols.length)];
    // Tige
    var stemGeo=new THREE.CylinderGeometry(0.4,0.4,5,4);
    var stemMat=new THREE.MeshStandardMaterial({color:0x38a840,roughness:0.9});
    var stem=new THREE.Mesh(stemGeo,stemMat);
    stem.position.set(p[0],2.5,p[1]);
    scene.add(stem);
    // Fleur
    var flGeo=new THREE.SphereGeometry(2.2,8,6);
    var flMat=new THREE.MeshStandardMaterial({color:col,roughness:0.7,emissive:col,emissiveIntensity:0.18});
    var fl=new THREE.Mesh(flGeo,flMat);
    fl.position.set(p[0],5.5,p[1]);
    fl.userData.swayPhase=Math.random()*Math.PI*2;
    scene.add(fl);
    sprites.push(fl); // réutilise la boucle de flottement
    fl.userData.baseY=5.5;
  });
}

// ================================================================
// MONTAGNES
// ================================================================
function _buildMountains(){
  MOUNTAIN_DATA.forEach(function(m){
    var geo=new THREE.ConeGeometry(m.r,m.h,8);
    var mat=new THREE.MeshStandardMaterial({color:m.c,roughness:1,fog:true});
    var mesh=new THREE.Mesh(geo,mat);
    mesh.position.set(m.x,m.h/2-14,m.z);
    scene.add(mesh);
    // Calotte
    var capGeo=new THREE.ConeGeometry(m.r*0.3,m.h*0.28,8);
    var cap=new THREE.Mesh(capGeo,new THREE.MeshStandardMaterial({color:PAL.MTN_SNOW,roughness:0.7}));
    cap.position.set(m.x,m.h*0.86-14,m.z);
    scene.add(cap);
  });
}

// ================================================================
// RIVIÈRE + PONT + BARQUE
// ================================================================
function _buildRiverAndBridge(){
  // Lit de rivière
  var riverGeo=new THREE.BoxGeometry(56,1,430);
  var riverMat=new THREE.MeshStandardMaterial({color:PAL.WATER,roughness:0.18,metalness:0.22});
  var river=new THREE.Mesh(riverGeo,riverMat);
  river.position.set(330,0.3,80); river.rotation.y=-0.35;
  river.receiveShadow=true; scene.add(river);

  // Reflets animés
  for(var i=0;i<5;i++){
    var sGeo=new THREE.BoxGeometry(7,1.2,55);
    var sMat=new THREE.MeshStandardMaterial({color:PAL.WATER_SHINE,roughness:0.12,transparent:true,opacity:0.7});
    var shine=new THREE.Mesh(sGeo,sMat);
    shine.position.set(330+(i-2)*9,0.55,80-140+i*70);
    shine.rotation.y=-0.35;
    shine.userData.swayPhase=i*1.2;
    shine.userData.baseY=0.55;
    scene.add(shine);
    _flowParticles.push(shine);
  }

  // Pont
  var deckGeo=new THREE.BoxGeometry(60,6,24);
  var deckMat=new THREE.MeshStandardMaterial({color:PAL.STONE,roughness:0.9});
  var deck=new THREE.Mesh(deckGeo,deckMat);
  deck.position.set(280,5,-10); deck.rotation.y=-0.35;
  deck.castShadow=true; deck.receiveShadow=true; scene.add(deck);

  var archGeo=new THREE.TorusGeometry(21,3.5,10,16,Math.PI);
  var arch=new THREE.Mesh(archGeo,new THREE.MeshStandardMaterial({color:PAL.STONE_DARK,roughness:0.9}));
  arch.position.set(280,2,-10); arch.rotation.x=Math.PI; arch.rotation.y=-0.35; arch.rotation.z=Math.PI;
  scene.add(arch);

  // Garde-corps pont
  [[-22,0],[22,0]].forEach(function(off){
    var railGeo=new THREE.BoxGeometry(3,7,60);
    var rail=new THREE.Mesh(railGeo,new THREE.MeshStandardMaterial({color:PAL.STONE,roughness:0.85}));
    rail.position.set(280+off[0],9,-10); rail.rotation.y=-0.35;
    rail.castShadow=true; scene.add(rail);
  });

  // Barque
  var hullGeo=new THREE.CylinderGeometry(5,8,22,8);
  var hull=new THREE.Mesh(hullGeo,new THREE.MeshStandardMaterial({color:PAL.WOOD,roughness:0.85}));
  hull.rotation.z=Math.PI/2; hull.scale.set(1,1,0.55);
  hull.position.set(350,1.5,160); hull.castShadow=true; scene.add(hull);

  var mast=new THREE.Mesh(
    new THREE.CylinderGeometry(0.8,0.8,17,6),
    new THREE.MeshStandardMaterial({color:PAL.WOOD_DARK,roughness:0.8})
  );
  mast.position.set(350,10,160); scene.add(mast);

  // Voile
  var sailGeo=new THREE.PlaneGeometry(9,12);
  var sail=new THREE.Mesh(sailGeo,new THREE.MeshStandardMaterial({color:0xfffbe8,side:THREE.DoubleSide,roughness:0.8}));
  sail.position.set(354,16,160); sail.rotation.y=0.4; scene.add(sail);
}

// ================================================================
// CHEMIN SINUEUX
// ================================================================
function _buildWindingPath(){
  var pts=BUILDINGS_3D.map(function(b){return new THREE.Vector3(b.x,0.4,b.z);});
  var curve=new THREE.CatmullRomCurve3(pts,false,'catmullrom',0.4);
  var samples=curve.getPoints(70);
  var mat=new THREE.MeshStandardMaterial({color:PAL.PATH,roughness:0.95});
  for(var i=0;i<samples.length-1;i++){
    var a=samples[i],b=samples[i+1];
    var dx=b.x-a.x,dz=b.z-a.z;
    var len=Math.sqrt(dx*dx+dz*dz)+0.6;
    var seg=new THREE.Mesh(new THREE.BoxGeometry(len,0.6,12),mat);
    seg.position.set((a.x+b.x)/2,0.05,(a.z+b.z)/2);
    seg.rotation.y=-Math.atan2(dz,dx);
    seg.receiveShadow=true; scene.add(seg);
  }
  // Bordures du chemin (herbe taillée)
  var edgeMat=new THREE.MeshStandardMaterial({color:PAL.GRASS_DARK,roughness:0.95});
  for(var j=0;j<samples.length-1;j+=2){
    var aj=samples[j],bj=samples[j+1];
    var djx=bj.x-aj.x,djz=bj.z-aj.z;
    var lenj=Math.sqrt(djx*djx+djz*djz)+0.6;
    var angle=-Math.atan2(djz,djx);
    [7,-7].forEach(function(off){
      var edge=new THREE.Mesh(new THREE.BoxGeometry(lenj,0.4,2),edgeMat);
      edge.position.set((aj.x+bj.x)/2,0.2,(aj.z+bj.z)/2);
      edge.rotation.y=angle;
      var nx=Math.sin(angle)*off, nz=Math.cos(angle)*off;
      edge.position.x+=nx; edge.position.z+=nz;
      scene.add(edge);
    });
  }
}

// ================================================================
// PANNEAU DIRECTIONNEL
// ================================================================
function _buildSignpost(x,z){
  var post=new THREE.Mesh(
    new THREE.CylinderGeometry(1,1.2,22,6),
    new THREE.MeshStandardMaterial({color:PAL.WOOD,roughness:0.9})
  );
  post.position.set(x,11,z); post.castShadow=true; scene.add(post);
  [{y:17,rz:0.12,c:0xe0c870},{y:12,rz:-0.18,c:0xd8b860}].forEach(function(cfg){
    var plank=new THREE.Mesh(
      new THREE.BoxGeometry(17,3.5,1.5),
      new THREE.MeshStandardMaterial({color:cfg.c,roughness:0.85})
    );
    plank.position.set(x+7,cfg.y,z); plank.rotation.z=cfg.rz;
    plank.castShadow=true; scene.add(plank);
  });
}

// ================================================================
// BÂTIMENT STANDARD
// ================================================================
function _buildBuilding(b){
  var group=new THREE.Group(); group.position.set(b.x,0,b.z);
  var xp=(window.S&&S.xp)||0;
  var locked=b.lockXP>0&&xp<b.lockXP;
  var alpha=locked?0.52:1;

  // Plateforme
  var platGeo=new THREE.CylinderGeometry(b.radius+8,b.radius+10,4,28);
  var platMat=new THREE.MeshStandardMaterial({color:b.platformColor,roughness:0.88});
  var plat=new THREE.Mesh(platGeo,platMat);
  plat.position.y=2; plat.receiveShadow=true; plat.castShadow=true; group.add(plat);

  // Mini-jardin autour de la plateforme
  if(!locked){
    var gardenMat=new THREE.MeshStandardMaterial({color:PAL.GRASS_LIGHT,roughness:0.9});
    var gardenGeo=new THREE.CylinderGeometry(b.radius+6,b.radius+8,1,28);
    var garden=new THREE.Mesh(gardenGeo,gardenMat);
    garden.position.y=4.5; group.add(garden);
  }

  // Corps principal
  var bodyGeo=new THREE.CylinderGeometry(b.radius*0.90,b.radius,b.height,8);
  var bodyMat=new THREE.MeshStandardMaterial({
    color:b.wallColor, emissive:b.emissiveWall||0x000000, emissiveIntensity:0.50,
    roughness:0.70, transparent:alpha<1, opacity:alpha,
  });
  var body=new THREE.Mesh(bodyGeo,bodyMat);
  body.position.y=4+b.height/2; body.castShadow=true; body.receiveShadow=true; group.add(body);

  // Fenêtres (2 faces)
  if(!locked){
    [[0,1],[Math.PI*0.75,-1]].forEach(function(cfg,wi){
      var wGeo=new THREE.BoxGeometry(b.radius*0.22,b.height*0.18,1);
      var wMat=new THREE.MeshStandardMaterial({color:0xfff8c0,emissive:0xffd060,emissiveIntensity:0.8,roughness:0.3});
      var win=new THREE.Mesh(wGeo,wMat);
      var ang=cfg[0]; var ofs=cfg[1];
      win.position.set(
        Math.sin(ang)*b.radius*0.95,
        4+b.height*0.58,
        Math.cos(ang)*b.radius*0.95
      );
      win.rotation.y=-ang;
      group.add(win);
    });
  }

  // Toit
  var roofGeo=new THREE.ConeGeometry(b.radius*1.20,b.roofHeight,8);
  var roofMat=new THREE.MeshStandardMaterial({
    color:b.roofColor, emissive:b.emissiveRoof||0x000000, emissiveIntensity:0.45,
    roughness:0.58, transparent:alpha<1, opacity:alpha,
  });
  var roof=new THREE.Mesh(roofGeo,roofMat);
  roof.position.y=4+b.height+b.roofHeight/2-1; roof.castShadow=true; group.add(roof);

  // Boule sommitale
  var cap=new THREE.Mesh(
    new THREE.SphereGeometry(b.radius*0.09,12,12),
    new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.35,metalness:0.2})
  );
  cap.position.y=4+b.height+b.roofHeight-1; group.add(cap);

  // Porte
  if(!locked){
    var doorGeo=new THREE.BoxGeometry(b.radius*0.45,b.height*0.52,1.2);
    var door=new THREE.Mesh(doorGeo,new THREE.MeshStandardMaterial({color:PAL.WOOD_DARK,roughness:0.75}));
    door.position.set(0,4+(b.height*0.52)/2,b.radius*0.93); group.add(door);
    // Arc de porte
    var archGeo=new THREE.TorusGeometry(b.radius*0.125,b.radius*0.03,8,16,Math.PI);
    var archMat=new THREE.MeshStandardMaterial({color:PAL.WOOD,roughness:0.8});
    var darch=new THREE.Mesh(archGeo,archMat);
    darch.position.set(0,4+b.height*0.52,b.radius*0.93);
    darch.rotation.x=Math.PI; darch.rotation.z=Math.PI;
    group.add(darch);
  }

  scene.add(group);
  var topY=4+b.height+b.roofHeight;

  // Sprite NPC
  if(b.npc&&!locked){
    var npcSprite=_makeEmojiSprite(b.npc,24);
    npcSprite.position.set(b.x,topY+15,b.z);
    npcSprite.userData.baseY=npcSprite.position.y;
    npcSprite.userData.phase=Math.random()*Math.PI*2;
    scene.add(npcSprite); sprites.push(npcSprite);
  }

  // Label
  var nl=(window.S&&S.nativeLang)||'fr';
  var badgeColor=locked?PAL.LOCKED:(b.badgeNum===1?PAL.DONE:PAL.AVAIL);
  var label=_makeLabelSprite(b.badgeNum,badgeColor,b.name[nl]||b.name.fr,b.stage[nl]||b.stage.fr);
  label.position.set(b.x,topY+(b.npc&&!locked?28:16),b.z); scene.add(label);

  // Icône statut
  var statusIcon=locked?'🔒':(b.badgeNum===1?'✅':'⭐');
  var statusSprite=_makeEmojiSprite(statusIcon,17);
  statusSprite.position.set(b.x+b.radius*1.35,6,b.z+b.radius*0.65); scene.add(statusSprite);

  // Lampadaire décoratif devant le bâtiment
  if(!locked) _buildLantern(b.x+b.radius*0.7,4,b.z+b.radius*0.9);

  group.userData.buildingId=b.id;
  group.traverse(function(o){o.userData.buildingId=b.id;});
}

// ================================================================
// LAMPADAIRE
// ================================================================
function _buildLantern(x,y,z){
  var pole=new THREE.Mesh(
    new THREE.CylinderGeometry(0.35,0.45,12,5),
    new THREE.MeshStandardMaterial({color:0x606060,roughness:0.7,metalness:0.5})
  );
  pole.position.set(x,y+6,z); pole.castShadow=true; scene.add(pole);
  var head=new THREE.Mesh(
    new THREE.BoxGeometry(2.5,2.5,2.5),
    new THREE.MeshStandardMaterial({color:0xfffcd0,emissive:0xffd060,emissiveIntensity:1.2,roughness:0.3})
  );
  head.position.set(x,y+13,z); scene.add(head);
}

// ================================================================
// CHÂTEAU
// ================================================================
function _buildCastle(b){
  var group=new THREE.Group(); group.position.set(b.x,0,b.z);
  var xp=(window.S&&S.xp)||0;
  var locked=b.lockXP>0&&xp<b.lockXP;
  var alpha=locked?0.52:1;

  // Plateforme falaise
  var cliff=new THREE.Mesh(
    new THREE.CylinderGeometry(b.radius+12,b.radius+22,14,28),
    new THREE.MeshStandardMaterial({color:b.platformColor,roughness:0.94})
  );
  cliff.position.y=6; cliff.receiveShadow=true; cliff.castShadow=true; group.add(cliff);

  // Donjon
  var bodyMat=new THREE.MeshStandardMaterial({
    color:b.wallColor,emissive:b.emissiveWall||0,emissiveIntensity:0.42,
    roughness:0.84,transparent:alpha<1,opacity:alpha,
  });
  var body=new THREE.Mesh(new THREE.CylinderGeometry(b.radius*0.88,b.radius,b.height,8),bodyMat);
  body.position.y=13+b.height/2; body.castShadow=true; body.receiveShadow=true; group.add(body);

  var roofMat=new THREE.MeshStandardMaterial({
    color:b.roofColor,emissive:b.emissiveRoof||0,emissiveIntensity:0.52,
    roughness:0.62,transparent:alpha<1,opacity:alpha,
  });
  var roof=new THREE.Mesh(new THREE.ConeGeometry(b.radius*1.14,b.roofHeight,8),roofMat);
  roof.position.y=13+b.height+b.roofHeight/2-1; roof.castShadow=true; group.add(roof);

  var cap=new THREE.Mesh(
    new THREE.SphereGeometry(b.radius*0.08,12,12),
    new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.35})
  );
  cap.position.y=13+b.height+b.roofHeight-1; group.add(cap);

  // Créneaux
  if(!locked){
    for(var ci=0;ci<8;ci++){
      var ca=ci/8*Math.PI*2;
      var cren=new THREE.Mesh(
        new THREE.BoxGeometry(3.5,5,3.5),
        new THREE.MeshStandardMaterial({color:b.wallColor,roughness:0.9,transparent:true,opacity:alpha})
      );
      cren.position.set(Math.sin(ca)*b.radius,13+b.height+2.5,Math.cos(ca)*b.radius);
      group.add(cren);
    }
  }

  // Tours secondaires
  [[-1,-1],[1,-1]].forEach(function(dir){
    var tr=b.radius*0.42,th=b.height*0.68,trh=b.roofHeight*0.72;
    var tx=dir[0]*b.radius*0.95,tz=dir[1]*b.radius*0.55;
    var tower=new THREE.Mesh(
      new THREE.CylinderGeometry(tr*0.88,tr,th,8),
      new THREE.MeshStandardMaterial({color:b.wallColor,roughness:0.84,transparent:alpha<1,opacity:alpha})
    );
    tower.position.set(tx,13+th/2,tz); tower.castShadow=true; group.add(tower);
    var trRoof=new THREE.Mesh(
      new THREE.ConeGeometry(tr*1.18,trh,8),
      new THREE.MeshStandardMaterial({color:b.roofColor,roughness:0.62,transparent:alpha<1,opacity:alpha})
    );
    trRoof.position.set(tx,13+th+trh/2-1,tz); trRoof.castShadow=true; group.add(trRoof);
    group.add(Object.assign(
      new THREE.Mesh(new THREE.SphereGeometry(tr*0.11,10,10),new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.35})),
      {position:new THREE.Vector3(tx,13+th+trh-1,tz)}
    ));
  });

  // Drapeaux animés
  if(!locked){
    [[0,13+b.height+b.roofHeight+2],[-b.radius*0.95,13+b.height*0.68+b.roofHeight*0.72+2]].forEach(function(fp){
      var pole=new THREE.Mesh(
        new THREE.CylinderGeometry(0.4,0.4,7,4),
        new THREE.MeshStandardMaterial({color:PAL.WOOD_DARK})
      );
      pole.position.set(fp[0],fp[1]+3.5,0); group.add(pole);
      var flag=new THREE.Mesh(
        new THREE.PlaneGeometry(7,4.5),
        new THREE.MeshStandardMaterial({color:0xcc66ff,side:THREE.DoubleSide,roughness:0.5})
      );
      flag.position.set(fp[0]+3.5,fp[1]+5.5,0);
      flag.userData.flagPole=true; flag.userData.phase=Math.random()*Math.PI*2;
      group.add(flag);
    });
  }

  // Escalier
  for(var s=0;s<5;s++){
    var step=new THREE.Mesh(
      new THREE.BoxGeometry(11,1.5,4.5),
      new THREE.MeshStandardMaterial({color:PAL.STONE,roughness:0.95})
    );
    step.position.set(-b.radius-13+s*2.4,1.2+s*1.4,b.radius+13-s*2.8);
    step.receiveShadow=true; group.add(step);
  }

  scene.add(group);
  var topY=13+b.height+b.roofHeight;
  var nl=(window.S&&S.nativeLang)||'fr';
  var label=_makeLabelSprite(b.badgeNum,locked?PAL.LOCKED:PAL.DONE,b.name[nl]||b.name.fr,b.stage[nl]||b.stage.fr);
  label.position.set(b.x,topY+18,b.z); scene.add(label);
  var st=_makeEmojiSprite(locked?'🔒':'✅',18);
  st.position.set(b.x+b.radius*1.4,10,b.z+b.radius*0.7); scene.add(st);

  group.userData.buildingId=b.id;
  group.traverse(function(o){o.userData.buildingId=b.id;});
}

// ================================================================
// MOULIN
// ================================================================
function _buildWindmill(x,z){
  var tower=new THREE.Mesh(
    new THREE.CylinderGeometry(4.5,8,40,8),
    new THREE.MeshStandardMaterial({color:0xf0e8d8,roughness:0.88})
  );
  tower.position.set(x,20,z); tower.castShadow=true; tower.receiveShadow=true;
  tower.userData.buildingId='windmill'; scene.add(tower);

  var roof=new THREE.Mesh(
    new THREE.ConeGeometry(7,13,8),
    new THREE.MeshStandardMaterial({color:0xaa55ff,roughness:0.62})
  );
  roof.position.set(x,46,z); roof.castShadow=true; scene.add(roof);

  var hubGroup=new THREE.Group(); hubGroup.position.set(x,40,z+9);
  var bladeMat=new THREE.MeshStandardMaterial({color:0xf8f0e0,roughness:0.78,side:THREE.DoubleSide});
  for(var i=0;i<4;i++){
    var blade=new THREE.Mesh(new THREE.BoxGeometry(3.2,24,0.9),bladeMat);
    blade.position.y=12; blade.castShadow=true;
    var pivot=new THREE.Group(); pivot.rotation.z=(Math.PI/2)*i; pivot.add(blade);
    hubGroup.add(pivot);
  }
  hubGroup.add(new THREE.Mesh(
    new THREE.SphereGeometry(2.2,10,10),
    new THREE.MeshStandardMaterial({color:PAL.WOOD_DARK})
  ));
  scene.add(hubGroup); windmillBlades=hubGroup;

  scene.add(Object.assign(_makeSimplePillSprite('🌬️ Moulin'),{position:new THREE.Vector3(x,60,z)}));
}

// ================================================================
// OISEAUX — groupe de 6 oiseaux qui volent en formation
// ================================================================
function _buildBirds(){
  var birdMat=new THREE.MeshStandardMaterial({color:0x2a3a50,roughness:0.6,side:THREE.DoubleSide});

  for(var bi=0;bi<6;bi++){
    var bGroup=new THREE.Group();

    // Corps
    var bodyGeo=new THREE.CylinderGeometry(0.6,0.3,4,6);
    var bBody=new THREE.Mesh(bodyGeo,birdMat);
    bBody.rotation.z=Math.PI/2; bGroup.add(bBody);

    // Aile gauche
    var wingLGeo=new THREE.BoxGeometry(7,0.3,3);
    var wingL=new THREE.Mesh(wingLGeo,birdMat);
    wingL.position.set(-4.5,0,0); bGroup.add(wingL);
    wingL.userData.isWing=true; wingL.userData.side=1;

    // Aile droite
    var wingRGeo=new THREE.BoxGeometry(7,0.3,3);
    var wingR=new THREE.Mesh(wingRGeo,birdMat);
    wingR.position.set(4.5,0,0); bGroup.add(wingR);
    wingR.userData.isWing=true; wingR.userData.side=-1;

    // Position en formation V
    var spread=bi%3, row=Math.floor(bi/3);
    bGroup.userData={
      orbitRadius: 180+bi*22,
      orbitSpeed:  0.08+bi*0.007,
      orbitPhase:  (bi/6)*Math.PI*2,
      baseHeight:  120+bi*8+row*15,
      flapPhase:   Math.random()*Math.PI*2,
      flapSpeed:   2.8+Math.random()*0.8,
    };

    scene.add(bGroup);
    birds.push(bGroup);
  }
}

// ================================================================
// ARBRES — verdoyants avec variation de teinte
// ================================================================
function _buildTree(x,z){
  var group=new THREE.Group();
  var scale=0.82+Math.random()*0.55;

  var trunk=new THREE.Mesh(
    new THREE.CylinderGeometry(1.2,1.8,9,7),
    new THREE.MeshStandardMaterial({color:PAL.WOOD,roughness:0.9})
  );
  trunk.position.y=4.5; trunk.castShadow=true; group.add(trunk);

  // Palette feuillage plus riche
  var blobCols=[0x2a9040,0x35a84e,0x42bc5e,0x58d070,0x28803a];
  var randCol=function(){ return blobCols[Math.floor(Math.random()*blobCols.length)]; };

  [{y:10,r:8.2},{y:15.5,r:6.8},{y:20.5,r:5.0},{y:24.5,r:3.2}].forEach(function(cfg,i){
    var geo=new THREE.IcosahedronGeometry(cfg.r,1);
    var mat=new THREE.MeshStandardMaterial({color:randCol(),roughness:0.82});
    var blob=new THREE.Mesh(geo,mat);
    blob.position.set((Math.random()-0.5)*2,cfg.y,(Math.random()-0.5)*2);
    blob.castShadow=true; group.add(blob);
  });

  // Quelques fruits/fleurs sur certains arbres
  if(Math.random()>0.6){
    var fruitMat=new THREE.MeshStandardMaterial({color:0xff5533,roughness:0.7,emissive:0x881100,emissiveIntensity:0.2});
    for(var fi=0;fi<4;fi++){
      var fr=new THREE.Mesh(new THREE.SphereGeometry(0.9,6,6),fruitMat);
      var ang=fi/4*Math.PI*2;
      fr.position.set(Math.cos(ang)*6,12+Math.random()*4,Math.sin(ang)*5);
      group.add(fr);
    }
  }

  group.position.set(x,0,z);
  group.scale.setScalar(scale);
  group.userData.swayPhase=Math.random()*Math.PI*2;
  scene.add(group); trees.push(group);
}

// ================================================================
// SPRITE EMOJI
// ================================================================
function _makeEmojiSprite(emoji,size){
  var c=document.createElement('canvas'); c.width=c.height=80;
  var ctx=c.getContext('2d');
  ctx.font='60px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(emoji,40,44);
  var mat=new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthWrite:false});
  var sprite=new THREE.Sprite(mat);
  sprite.scale.set(size,size,1);
  return sprite;
}

// ================================================================
// SPRITE LABEL — pilule propre
// ================================================================
function _makeLabelSprite(num,badgeColorHex,title,subtitle){
  var dpr=2, padX=18, gap=12, circleR=17;
  var c=document.createElement('canvas'), ctx=c.getContext('2d');
  ctx.font='bold 17px Sora,system-ui,sans-serif';
  var titleW=ctx.measureText(title).width;
  ctx.font='13px Sora,system-ui,sans-serif';
  var subW=subtitle?ctx.measureText(subtitle).width:0;
  var textW=Math.max(titleW,subW);
  var pillH=subtitle?58:42;
  var pillW=circleR*2+gap+textW+padX*2;
  c.width=Math.ceil((pillW+8)*dpr); c.height=Math.ceil(pillH*dpr);
  ctx=c.getContext('2d'); ctx.scale(dpr,dpr);

  // Ombre
  ctx.shadowColor='rgba(0,0,0,0.30)'; ctx.shadowBlur=8; ctx.shadowOffsetY=3;
  ctx.fillStyle='rgba(255,255,255,0.97)';
  _roundRect(ctx,circleR+4,0,pillW-circleR,pillH,pillH/2); ctx.fill();
  ctx.shadowBlur=0; ctx.shadowOffsetY=0;

  // Badge cercle
  var colorStr='#'+badgeColorHex.toString(16).padStart(6,'0');
  ctx.fillStyle=colorStr;
  ctx.beginPath(); ctx.arc(circleR+4,pillH/2,circleR,0,Math.PI*2); ctx.fill();
  ctx.fillStyle=(badgeColorHex===PAL.AVAIL)?'#2a2000':'#ffffff';
  ctx.font='bold 15px Sora,system-ui,sans-serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(String(num),circleR+4,pillH/2+1);

  // Texte
  var textX=circleR*2+gap+4;
  ctx.textAlign='left'; ctx.fillStyle='#182235';
  if(subtitle){
    ctx.font='bold 15px Sora,system-ui,sans-serif'; ctx.fillText(title,textX,pillH/2-10);
    ctx.font='11px Sora,system-ui,sans-serif'; ctx.fillStyle='#606880'; ctx.fillText(subtitle,textX,pillH/2+11);
  } else {
    ctx.font='bold 16px Sora,system-ui,sans-serif'; ctx.fillText(title,textX,pillH/2+1);
  }

  var mat=new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthWrite:false});
  var sprite=new THREE.Sprite(mat);
  sprite.scale.set((pillW+8)*0.44,pillH*0.44,1);
  return sprite;
}

function _makeSimplePillSprite(text){
  var dpr=2, c=document.createElement('canvas'), ctx=c.getContext('2d');
  ctx.font='bold 15px Sora,system-ui,sans-serif';
  var w=ctx.measureText(text).width+30, h=34;
  c.width=Math.ceil(w*dpr); c.height=Math.ceil(h*dpr);
  ctx=c.getContext('2d'); ctx.scale(dpr,dpr);
  ctx.fillStyle='rgba(255,255,255,0.94)'; _roundRect(ctx,0,0,w,h,h/2); ctx.fill();
  ctx.fillStyle='#182235'; ctx.font='bold 15px Sora,system-ui,sans-serif';
  ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(text,w/2,h/2+1);
  var mat=new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthWrite:false});
  var sprite=new THREE.Sprite(mat); sprite.scale.set(w*0.44,h*0.44,1);
  return sprite;
}

function _roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}

// ================================================================
// BOUCLE D'ANIMATION
// ================================================================
function _loop(){
  if(!running) return;
  requestAnimationFrame(_loop);
  var dt=clock.getDelta();
  var t=clock.elapsedTime;

  // NPC flottants + fleurs légères
  sprites.forEach(function(s){
    var speed=s.userData.flapSpeed||1.5;
    s.position.y=s.userData.baseY+Math.sin(t*speed+s.userData.phase)*1.8;
  });

  // Arbres — balancement doux
  trees.forEach(function(g){
    g.rotation.z=Math.sin(t*0.55+g.userData.swayPhase)*0.018;
    g.rotation.x=Math.sin(t*0.38+g.userData.swayPhase)*0.006;
  });

  // Moulin
  if(windmillBlades) windmillBlades.rotation.z+=0.010;

  // Oiseaux — vol en orbite avec battement d'ailes
  birds.forEach(function(bGroup){
    var d=bGroup.userData;
    var angle=d.orbitPhase+t*d.orbitSpeed;
    bGroup.position.set(
      20+Math.cos(angle)*d.orbitRadius,
      d.baseHeight+Math.sin(t*0.4+d.orbitPhase)*12,
      Math.sin(angle)*d.orbitRadius
    );
    bGroup.rotation.y=-angle-Math.PI/2;
    // Battement d'ailes — rotation Z des ailes
    var flapAng=Math.sin(t*d.flapSpeed+d.flapPhase)*0.55;
    bGroup.traverse(function(child){
      if(child.userData&&child.userData.isWing){
        child.rotation.z=flapAng*child.userData.side;
      }
    });
  });

  // Reflets eau — scintillement
  _flowParticles.forEach(function(p,i){
    p.material.opacity=0.5+Math.sin(t*1.8+p.userData.swayPhase)*0.3;
    p.position.z+=0.03; // léger mouvement
    if(p.position.z>250) p.position.z=-200;
  });

  controls&&controls.update();
  renderer.render(scene,camera);
}

// ================================================================
// RESIZE
// ================================================================
function _onResize(){
  if(!renderer||!camera) return;
  var wrap=document.querySelector('.village-canvas-wrap')||document.getElementById('screen-village');
  var r=wrap.getBoundingClientRect();
  var W=r.width>0?r.width:window.innerWidth;
  var H=r.height>0?r.height:(window.innerHeight-120);
  renderer.setSize(W,H,false);
  camera.aspect=W/H; camera.updateProjectionMatrix();
  renderer.render(scene,camera);
}

// ================================================================
// CLIC / TAP
// ================================================================
function _onCanvasClick(e){
  var rect=canvasEl.getBoundingClientRect();
  _raycastAt(e.clientX-rect.left,e.clientY-rect.top,rect);
}
function _onCanvasTouchEnd(e){
  if(!e.changedTouches||!e.changedTouches[0]) return;
  var rect=canvasEl.getBoundingClientRect();
  var t=e.changedTouches[0];
  _raycastAt(t.clientX-rect.left,t.clientY-rect.top,rect);
}
function _raycastAt(x,y,rect){
  pointer.x=(x/rect.width)*2-1;
  pointer.y=-(y/rect.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  var hits=raycaster.intersectObjects(scene.children,true);
  for(var i=0;i<hits.length;i++){
    var id=hits[i].object.userData.buildingId;
    if(id&&id!=='windmill'){_onTapBuilding(id);return;}
  }
}

// ================================================================
// PANNEAU DE LIEU — même logique que village_world.js
// ================================================================
function _onTapBuilding(id){
  var b=BUILDINGS_3D.find(function(b){return b.id===id;}); if(!b) return;
  var nl=(window.S&&S.nativeLang)||'fr';
  var xp=(window.S&&S.xp)||0;
  if(window.LV_SOUND) window.LV_SOUND.play('tap');

  var locked=b.lockXP>0&&xp<b.lockXP;
  if(locked){
    var remaining=b.lockXP-xp;
    var msg={fr:'🔒 '+remaining+' XP pour débloquer '+b.name.fr,en:'🔒 '+remaining+' XP to unlock '+b.name.en,ht:'🔒 '+remaining+' XP pou debloke '+b.name.ht}[nl]||'🔒 '+remaining+' XP';
    if(typeof showNotif==='function') showNotif(msg,3000); return;
  }

  var name=b.name[nl]||b.name.fr;
  var desc=b.desc?(b.desc[nl]||b.desc.fr):'';

  var npcData=null;
  if(b.npcId){
    npcData=(window.WORLD_NPCS&&window.WORLD_NPCS[b.npcId])
           ||(window.KROVA_NPCS&&window.KROVA_NPCS[b.npcId])||null;
  }

  var actionLabels={
    lessons:{fr:'📖 Ouvrir les leçons',en:'📖 Open lessons',ht:'📖 Ouvri leson'},
    practice:{fr:'💬 Pratiquer la langue',en:'💬 Practice language',ht:'💬 Pratike lang'},
    dialogue:{fr:'🗣️ Parler avec ce PNJ',en:'🗣️ Talk to this NPC',ht:'🗣️ Pale ak PNJ sa'},
  };

  var locTitle=document.getElementById('locTitle');
  var npcList=document.getElementById('npcList');
  if(locTitle) locTitle.textContent=b.npc?(b.npc+' ')+name:name;
  if(!npcList){running=false;if(typeof showScreen==='function')showScreen('screen-location');return;}

  var html='';

  if(desc){
    html+='<div style="margin:0 16px 12px;padding:12px 14px;background:rgba(255,255,255,0.04);border-left:3px solid rgba(255,215,0,0.30);border-radius:0 12px 12px 0;font-size:0.78rem;color:rgba(255,255,255,0.52);font-style:italic;line-height:1.55;">'+desc+'</div>';
  }

  if(npcData){
    var npcName=npcData.name||'';
    var npcEmoji=npcData.emoji||(b.npc||'👤');
    var npcRole=npcData.role?(npcData.role[nl]||npcData.role.fr||''):'';
    var npcBio=npcData.bio?(npcData.bio[nl]||npcData.bio.fr||''):'';
    var npcFirst=npcData.firstMeet?(npcData.firstMeet[nl]||npcData.firstMeet.fr||''):'';
    var accentMap={market:'#ffd700',library:'#c084fc',school:'#4ecf70',castle:'#bb55ff'};
    var accentColor=accentMap[b.id]||'#4ecf70';

    html+='<div style="margin:0 16px 12px;display:flex;align-items:flex-start;gap:14px;padding:16px;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.08);border-radius:18px;position:relative;overflow:hidden;">'
      +'<div style="position:absolute;left:0;top:0;bottom:0;width:3px;background:'+accentColor+';border-radius:3px 0 0 3px;"></div>'
      +'<div style="width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,0.06);border:2px solid '+accentColor+';display:flex;align-items:center;justify-content:center;font-size:1.7rem;flex-shrink:0;">'+npcEmoji+'</div>'
      +'<div style="flex:1;min-width:0;">'
      +'<div style="font-weight:800;font-size:0.95rem;color:#f0e8d0;">'+npcName+'</div>'
      +'<div style="font-size:0.68rem;color:rgba(255,255,255,0.38);margin-top:2px;">'+npcRole+'</div>'
      +(npcBio?'<div style="font-size:0.74rem;color:rgba(255,255,255,0.50);margin-top:6px;line-height:1.45;">'+npcBio+'</div>':'')
      +(npcFirst?'<div style="font-size:0.72rem;color:'+accentColor+';margin-top:8px;font-style:italic;line-height:1.4;">"'+npcFirst+'"</div>':'')
      +'</div></div>';

    html+='<button onclick="_v3dDialogue(\''+b.id+'\',\''+b.npcId+'\')" style="display:flex;align-items:center;gap:14px;width:calc(100% - 32px);margin:0 16px 10px;padding:14px 18px;background:linear-gradient(135deg,'+accentColor+'18,'+accentColor+'08);border:1.5px solid '+accentColor+'55;border-radius:16px;cursor:pointer;color:#f0e8d0;text-align:left;transition:all 0.18s;"'
      +' onmouseover="this.style.background=\''+accentColor+'28\'"'
      +' onmouseout="this.style.background=\'linear-gradient(135deg,'+accentColor+'18,'+accentColor+'08)\'">'
      +'<span style="font-size:1.6rem;">🗣️</span>'
      +'<div><div style="font-weight:800;font-size:0.88rem;">'+(actionLabels.dialogue[nl]||actionLabels.dialogue.fr)+'</div>'
      +'<div style="font-size:0.68rem;color:rgba(255,255,255,0.38);margin-top:2px;">'
      +{fr:'Pratique la langue cible',en:'Practice the target language',ht:'Pratike lang sib la'}[nl]
      +'</div></div><span style="margin-left:auto;color:'+accentColor+';font-size:1.3rem;">›</span></button>';
  } else if(b.npc){
    html+='<div style="padding:20px 16px;text-align:center;font-size:3rem;">'+b.npc+'</div>';
  }

  if(b.action&&b.action!=='dialogue'){
    var actLabel=actionLabels[b.action]?(actionLabels[b.action][nl]||actionLabels[b.action].fr):b.action;
    html+='<button onclick="_v3dAction(\''+b.action+'\')" style="display:flex;align-items:center;gap:14px;width:calc(100% - 32px);margin:0 16px 10px;padding:14px 18px;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.08);border-radius:16px;cursor:pointer;color:#f0e8d0;text-align:left;">'
      +'<span style="font-size:1.4rem;">'+(b.action==='lessons'?'📖':'💬')+'</span>'
      +'<div><div style="font-weight:800;font-size:0.88rem;">'+actLabel+'</div>'
      +'<div style="font-size:0.68rem;color:rgba(255,255,255,0.38);margin-top:2px;">'
      +{fr:'Apprends avec ce lieu',en:'Learn with this location',ht:'Aprann ak kote sa a'}[nl]
      +'</div></div>'
      +'<span style="margin-left:auto;color:rgba(255,255,255,0.25);font-size:1.3rem;">›</span></button>';
  }

  if(!npcData&&!b.npc&&!b.action){
    html+='<div style="padding:32px 20px;text-align:center;color:rgba(255,255,255,0.28);font-size:0.88rem;">'
      +{fr:"C'est chez toi. Ici tu te reposes.",en:'This is your home. Rest here.',ht:'Se lakay ou. Repoze isit.'}[nl]
      +'</div>';
  }

  npcList.innerHTML=html;
  running=false;
  if(typeof showScreen==='function') showScreen('screen-location');

  var back=document.querySelector('#screen-location .back-btn');
  if(back&&!back._v3dPatched){
    back._v3dPatched=true;
    var orig=back.onclick;
    back.onclick=function(){
      if(typeof orig==='function') orig.call(this);
      else if(typeof showScreen==='function') showScreen('screen-village');
      running=true; _loop();
    };
  }
}

window._v3dDialogue=function(locId,npcId){
  running=false;
  if(typeof openDialogue==='function') openDialogue(locId,npcId);
  else if(typeof showScreen==='function') showScreen('screen-dialogue');
};

window._v3dAction=function(action){
  running=false;
  switch(action){
    case 'lessons':
      if(typeof ensureLearningBindings==='function') ensureLearningBindings();
      var fk=window.VOCAB?Object.keys(window.VOCAB)[0]:null;
      if(fk&&typeof loadVocab==='function') loadVocab(fk);
      if(typeof showScreen==='function') showScreen('screen-vocab');
      break;
    case 'practice':
      var fp=window.PHRASES_DATA?Object.keys(window.PHRASES_DATA)[0]:null;
      if(fp&&typeof loadPhrases==='function') loadPhrases(fp);
      if(typeof showScreen==='function') showScreen('screen-phrases');
      break;
    default:
      if(typeof showScreen==='function') showScreen('screen-'+action);
  }
};

// ================================================================
// NAV BAR
// ================================================================
var _NL={
  village:{fr:'Krova',en:'Krova',ht:'Krova'},
  lessons:{fr:'Leçons',en:'Lessons',ht:'Leson'},
  practice:{fr:'Pratique',en:'Practice',ht:'Pratik'},
  alphabet:{fr:'Langues',en:'Languages',ht:'Lang'},
  profile:{fr:'Profil',en:'Profile',ht:'Pwofil'},
};
function _buildNavBar(){
  var old=document.querySelector('.village-nav-bar'); if(old) old.remove();
  var vs=document.getElementById('screen-village'); if(!vs) return;
  var nl=(window.S&&S.nativeLang)||'fr';
  var tabs=[
    {id:'village',icon:'🏘️'},
    {id:'lessons',icon:'📖'},
    {id:'practice',icon:'💬'},
    {id:'alphabet',icon:'🔤'},
    {id:'profile',icon:'👤'},
  ];
  var nav=document.createElement('nav'); nav.className='village-nav-bar';
  nav.innerHTML=tabs.map(function(t){
    var lb=(_NL[t.id]&&(_NL[t.id][nl]||_NL[t.id].fr))||t.id;
    return '<button class="vnb-btn'+(t.id==='village'?' active':'')+'" id="vnb-'+t.id+'" onclick="window._navTo(\''+t.id+'\')">'
      +'<span class="vnb-icon">'+t.icon+'</span><span class="vnb-label">'+lb+'</span></button>';
  }).join('');
  vs.appendChild(nav);

  if(!document.getElementById('vnb-css')){
    var st=document.createElement('style'); st.id='vnb-css';
    st.textContent='.village-nav-bar{flex-shrink:0;display:flex;align-items:stretch;justify-content:space-around;background:rgba(6,8,16,0.98);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,0.06);padding:6px 0 max(6px,env(safe-area-inset-bottom));z-index:30;}'
      +'.vnb-btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;background:none;border:none;color:rgba(255,255,255,0.32);font-size:0.58rem;font-weight:800;letter-spacing:0.03em;padding:6px 0;cursor:pointer;transition:color 0.18s;-webkit-tap-highlight-color:transparent;}'
      +'.vnb-btn.active{color:#4ecf70;}.vnb-btn:active{opacity:0.7;}'
      +'.vnb-icon{font-size:1.25rem;line-height:1;transition:transform 0.18s;}'
      +'.vnb-btn.active .vnb-icon{transform:scale(1.20);}'
      +'.vnb-label{font-size:0.56rem;font-family:Sora,Nunito,system-ui;}';
    document.head.appendChild(st);
  }
}

window._navTo=function(s){
  document.querySelectorAll('.vnb-btn').forEach(function(b){b.classList.remove('active');});
  var btn=document.getElementById('vnb-'+s); if(btn) btn.classList.add('active');
  switch(s){
    case 'village': running=true; if(renderer) _loop(); break;
    case 'lessons':
      running=false;
      if(typeof ensureLearningBindings==='function') ensureLearningBindings();
      var fk=window.VOCAB?Object.keys(window.VOCAB)[0]:null;
      if(fk&&typeof loadVocab==='function') loadVocab(fk);
      if(typeof showScreen==='function') showScreen('screen-vocab');
      break;
    case 'practice':
      running=false;
      var fp=window.PHRASES_DATA?Object.keys(window.PHRASES_DATA)[0]:null;
      if(fp&&typeof loadPhrases==='function') loadPhrases(fp);
      if(typeof showScreen==='function') showScreen('screen-phrases');
      break;
    case 'alphabet':
      running=false;
      if(typeof openAlphabet==='function') openAlphabet((window.S&&S.targetLang)||'en',(window.S&&S.nativeLang)||'fr');
      break;
    case 'profile':
      running=false;
      if(typeof showScreen==='function') showScreen('screen-profile');
      break;
  }
};

// ================================================================
// MÉTÉO / TEMPS
// ================================================================
function setWeather(w){ window.currentWeather=w||'sun'; }
function updateTime(){
  var e=document.getElementById('hudTime');
  if(e){var n=new Date();e.textContent=('0'+n.getHours()).slice(-2)+':'+('0'+n.getMinutes()).slice(-2);}
  var we=document.getElementById('hudWeather');
  if(we&&window.WEATHER_ICONS) we.textContent=WEATHER_ICONS[window.currentWeather]||'☀️';
}
window.setWeather=setWeather; window.updateTime=updateTime;
window.alignLocationsToRings=function(){};
window.initCanvas=function(){};
window.drawVillage=function(){};

console.log('✅ village_3d.js v4 — KROVA VIVANT chargé');
})();
