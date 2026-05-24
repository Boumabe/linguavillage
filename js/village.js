// ================================================================
// village.js — ISOMETRIC EDITION v3 FINAL
// LinguaVillage — Design professionnel + NPC + Nav fonctionnelle
// ================================================================

window.canvas  = null;
window.ctx     = null;
window.tick    = 0;
window.currentWeather = window.currentWeather || 'sun';

// ================================================================
// ZONES DE PROGRESSION
// ================================================================
window.VILLAGE_ZONES = [
  {
    id:'zero', icon:'🌱',
    label:   {fr:'Zéro absolu', en:'Absolute zero', es:'Cero absoluto', ht:'Zewo absoli'},
    sublabel:{fr:'Les bases',   en:'The basics',    es:'Las bases',     ht:'Baz yo'},
    xpRequired:0, color:'#4ecf70',
    buildings:[
      {id:'park',   emoji:'🌳', label:{fr:'Parc',  en:'Park',   es:'Parque', ht:'Pak'},   xp:0}
    ]
  },
  {
    id:'beginner', icon:'⭐',
    label:   {fr:'Débutant',     en:'Beginner',    es:'Principiante', ht:'Debitant'},
    sublabel:{fr:'Se présenter', en:'Introduce yourself', es:'Presentarse', ht:'Prezante ou'},
    xpRequired:40, color:'#4a9eff',
    buildings:[
      {id:'school', emoji:'🏫', label:{fr:'École',  en:'School', es:'Escuela', ht:'Lekòl'},  xp:40},
      {id:'church', emoji:'⛪', label:{fr:'Église', en:'Church', es:'Iglesia', ht:'Legliz'}, xp:80}
    ]
  },
  {
    id:'elementary', icon:'📚',
    label:   {fr:'Élémentaire',       en:'Elementary', es:'Elemental',    ht:'Elemantè'},
    sublabel:{fr:'Parler au quotidien',en:'Daily talk', es:'Conversaciones',ht:'Pale chak jou'},
    xpRequired:300, color:'#ffd700',
    buildings:[
      {id:'market',  emoji:'🏪', label:{fr:'Marché', en:'Market',  es:'Mercado', ht:'Mache'},  xp:300},
      {id:'friends', emoji:'🤝', label:{fr:'Amis',   en:'Friends', es:'Amigos',  ht:'Zanmi'},  xp:400}
    ]
  },
  {
    id:'intermediate', icon:'🎓',
    label:   {fr:'Intermédiaire',          en:'Intermediate',  es:'Intermedio',     ht:'Entèmedyè'},
    sublabel:{fr:"S'exprimer avec aisance", en:'Speak with ease',es:'Hablar con fluidez',ht:'Pale fasil'},
    xpRequired:600, color:'#ff9f43',
    buildings:[
      {id:'tavern',  emoji:'🍺', label:{fr:'Taverne', en:'Tavern',  es:'Taberna',  ht:'Tavèn'},    xp:600},
      {id:'bank',    emoji:'🏦', label:{fr:'Banque',  en:'Bank',    es:'Banco',    ht:'Bank'},     xp:750},
      {id:'station', emoji:'🚉', label:{fr:'Gare',    en:'Station', es:'Estación', ht:'Estasyon'}, xp:900}
    ]
  },
  {
    id:'advanced', icon:'👑',
    label:   {fr:'Maîtrise',          en:'Mastery',    es:'Maestría',    ht:'Mètrize'},
    sublabel:{fr:'Comme un·e natif·ve',en:'Like a native',es:'Como nativo',ht:'Tankou natif'},
    xpRequired:1000, color:'#e040fb',
    buildings:[
      {id:'hospital', emoji:'🏥', label:{fr:'Hôpital', en:'Hospital', es:'Hospital', ht:'Lopital'}, xp:1000},
      {id:'cinema',   emoji:'🎬', label:{fr:'Cinéma',  en:'Cinema',   es:'Cine',     ht:'Sinema'},  xp:1500}
    ]
  }
];

// ================================================================
// ÉTAT
// ================================================================
var ISO = {
  scrollX:0, targetScrollX:0,
  isDragging:false, dragStartX:0, dragScrollX:0,
  touchStartX:0, touchScrollX:0, touchMoved:false,
  hoveredBuilding:null,
  particles:[],
  clouds:[],
  tapTime:0
};

// ================================================================
// POINT D'ENTRÉE
// ================================================================
function goVillage() {
  if (!window.S) return;

  var el;
  el = document.getElementById('hudPlayer');  if(el) el.textContent = '👤 '+(S.playerName||'');
  el = document.getElementById('hudLang');    if(el) el.textContent = ((window.FLAGS&&FLAGS[S.targetLang])||'')+' '+((window.LANG_NAMES&&LANG_NAMES[S.targetLang])||'');
  el = document.getElementById('hudXP');      if(el) el.textContent = (S.xp||0)+' XP';

  // Afficher l'écran
  if (typeof window.showScreen==='function') window.showScreen('screen-village');
  else {
    document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active');});
    var vs=document.getElementById('screen-village');
    if(vs) vs.classList.add('active');
  }

  // Reset
  canvas=null; ctx=null; tick=0;
  window._villageLoopRunning=false;
  window._villageLoopActive=false;
  ISO.particles=[]; ISO.scrollX=0; ISO.targetScrollX=0;

  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      _buildNavBar();
      _fixVillageLayout();
      _initCanvas();
      var xp=((window.S&&S.xp)||0), zi=0;
      window.VILLAGE_ZONES.forEach(function(z,i){if(xp>=z.xpRequired)zi=i;});
      setTimeout(function(){_scrollToZone(zi,true);},80);
    });
  });

  if(window._timeUpdateInterval) clearInterval(window._timeUpdateInterval);
  window._timeUpdateInterval=setInterval(updateTime,30000);
  if(typeof updateTime==='function') updateTime();
}

// Assure que le canvas-wrap est en place dans le DOM
function _fixVillageLayout() {
  var vs=document.getElementById('screen-village');
  if(!vs) return;
  var c=document.getElementById('villageCanvas');
  var wrap=document.querySelector('.village-canvas-wrap');
  // Si le canvas est directement dans screen-village sans wrap, on insère le wrap
  if(c && c.parentElement===vs && !wrap) {
    var div=document.createElement('div');
    div.className='village-canvas-wrap';
    vs.insertBefore(div,c);
    div.appendChild(c);
    // Déplacer aussi le tooltip dans le wrap
    var tip=document.getElementById('locTooltip');
    if(tip&&tip.parentElement===vs) div.appendChild(tip);
  }
  // Corriger les styles inline bloquants
  vs.style.cssText='overflow:hidden!important;display:none;flex-direction:column;height:100dvh;max-height:100dvh;';
  vs.style.display='flex'; // .active => flex
}

// ================================================================
// INIT CANVAS
// ================================================================
function _initCanvas() {
  var c=document.getElementById('villageCanvas');
  if(!c) return;
  var dpr=window.devicePixelRatio||1;
  var wrap=document.querySelector('.village-canvas-wrap')||document.getElementById('screen-village');
  var r=wrap?wrap.getBoundingClientRect():null;
  var W,H;
  if(r&&r.width>0&&r.height>0){W=Math.floor(r.width);H=Math.floor(r.height);}
  else {
    var hud=document.querySelector('.village-hud');
    var nav=document.querySelector('.village-nav-bar');
    var hudH=(hud?hud.getBoundingClientRect().height:52)+(nav?nav.getBoundingClientRect().height:56);
    var visH=(window.visualViewport?window.visualViewport.height:null)||window.innerHeight||640;
    W=Math.floor((window.visualViewport?window.visualViewport.width:null)||window.innerWidth||360);
    H=Math.max(200,Math.floor(visH-hudH));
  }
  c.width=W*dpr; c.height=H*dpr;
  c.style.cssText='display:block;width:'+W+'px;height:'+H+'px;touch-action:none;cursor:grab;';
  ISO.clouds=_genClouds(W,H);

  // Nettoyer les anciens écouteurs
  var nc=c.cloneNode(false);
  c.parentNode.replaceChild(nc,c); c=nc;

  c.addEventListener('touchstart', _onTouchStart, {passive:false});
  c.addEventListener('touchmove',  _onTouchMove,  {passive:false});
  c.addEventListener('touchend',   _onTouchEnd,   {passive:true});
  c.addEventListener('mousedown',  _onMouseDown);
  c.addEventListener('mousemove',  _onMouseMove);
  c.addEventListener('mouseup',    _onMouseUp);
  c.addEventListener('click',      _onClick);

  if(window._onCanvasResize) window.removeEventListener('resize',window._onCanvasResize);
  window._onCanvasResize=function(){if(document.getElementById('screen-village').classList.contains('active'))_initCanvas();};
  window.addEventListener('resize',window._onCanvasResize);

  if(!window._villageLoopRunning){
    window._villageLoopRunning=true;
    window._villageLoopActive=true;
    requestAnimationFrame(_loop);
  }
}

// ================================================================
// BOUCLE ANIMATION
// ================================================================
function _loop() {
  if(!window._villageLoopActive) return;
  tick++;
  ISO.scrollX+=(ISO.targetScrollX-ISO.scrollX)*0.12;
  _draw();
  requestAnimationFrame(_loop);
}

// ================================================================
// DESSIN PRINCIPAL
// ================================================================
function _draw() {
  var c=document.getElementById('villageCanvas');
  if(!c){canvas=null;ctx=null;return;}
  if(c!==canvas){canvas=c;ctx=c.getContext('2d');}
  var dpr=window.devicePixelRatio||1;
  var W=c.width/dpr, H=c.height/dpr;
  if(W<10||H<10) return;
  ctx.save();
  ctx.scale(dpr,dpr);

  var night=(currentWeather==='night');
  var rain=(currentWeather==='rain');

  // ── CIEL ──
  var sg=ctx.createLinearGradient(0,0,0,H*0.60);
  if(night){sg.addColorStop(0,'#05080f');sg.addColorStop(1,'#0b1220');}
  else if(rain){sg.addColorStop(0,'#2a3545');sg.addColorStop(1,'#3a4a5a');}
  else{sg.addColorStop(0,'#5bb8f5');sg.addColorStop(0.6,'#a8d8f0');sg.addColorStop(1,'#cce8f5');}
  ctx.fillStyle=sg;
  ctx.fillRect(0,0,W,H);

  // ── ÉTOILES ──
  if(night) _drawStars(W,H);

  // ── SOLEIL / LUNE ──
  _drawCelestial(W,H,night,rain);

  // ── NUAGES ──
  if(!night&&!rain) _drawClouds(W,H);

  // ── MONTAGNES ──
  _drawMountains(W,H,night);

  // ── SOL ──
  _drawGround(W,H);

  // ── CHEMIN ──
  _drawPath(W,H);

  // ── RIVIÈRE ──
  _drawRiver(W,H);

  // ── ARBRES ──
  _drawTrees(W,H);

  // ── BÂTIMENTS + ZONES ──
  _drawZones(W,H);

  // ── PARTICULES ──
  _drawParticles(W,H);

  ctx.restore();
}

// ================================================================
// HELPERS GÉOMÉTRIE
// ================================================================
function _groundY(H){return H*0.60;}

function _zoneX(zi,W){
  return W*0.18 + zi*(W*0.38) - ISO.scrollX;
}
function _totalW(W){return W*0.38*window.VILLAGE_ZONES.length+W*0.18;}

function _buildPos(zi,bi,bc,W,H){
  var zx=_zoneX(zi,W), gy=_groundY(H);
  var sp=W*0.12;
  var off=bc===1?0:bc===2?(bi===0?-sp*0.5:sp*0.5):(bi-1)*sp*0.6;
  return {x:zx+off, y:gy};
}

// ================================================================
// DESSIN : ÉTOILES
// ================================================================
function _drawStars(W,H){
  ctx.save();
  for(var i=0;i<70;i++){
    var sx=(Math.sin(i*437.1)*0.5+0.5)*W;
    var sy=(Math.sin(i*293.3)*0.5+0.5)*H*0.45;
    var tw=0.3+0.7*Math.sin(tick*0.015+i*0.7);
    ctx.beginPath();
    ctx.arc(sx,sy,0.4+Math.sin(i*127)*0.5,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,220,'+tw.toFixed(2)+')';
    ctx.fill();
  }
  ctx.restore();
}

// ================================================================
// DESSIN : SOLEIL / LUNE
// ================================================================
function _drawCelestial(W,H,night,rain){
  var x=W*0.82, y=H*0.12;
  if(night){
    ctx.save();
    var mg=ctx.createRadialGradient(x,y,0,x,y,40);
    mg.addColorStop(0,'rgba(200,190,130,0.22)');
    mg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=mg; ctx.fillRect(x-40,y-40,80,80);
    ctx.beginPath(); ctx.arc(x,y,13,0,Math.PI*2);
    ctx.fillStyle='#eee8a0'; ctx.fill();
    ctx.restore();
  } else if(!rain){
    ctx.save();
    var glow=ctx.createRadialGradient(x,y,0,x,y,52);
    glow.addColorStop(0,'rgba(255,230,80,0.28)');
    glow.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=glow; ctx.fillRect(x-52,y-52,104,104);
    ctx.beginPath(); ctx.arc(x,y,19,0,Math.PI*2);
    ctx.fillStyle='#ffe055'; ctx.fill();
    for(var r=0;r<8;r++){
      var a=(r/8)*Math.PI*2+tick*0.005;
      ctx.beginPath();
      ctx.moveTo(x+Math.cos(a)*24,y+Math.sin(a)*24);
      ctx.lineTo(x+Math.cos(a)*33,y+Math.sin(a)*33);
      ctx.strokeStyle='rgba(255,220,60,0.45)'; ctx.lineWidth=2; ctx.stroke();
    }
    ctx.restore();
  }
}

// ================================================================
// DESSIN : NUAGES
// ================================================================
function _genClouds(W,H){
  var cl=[];
  for(var i=0;i<6;i++) cl.push({x:W*(0.05+i*0.18),y:H*(0.07+((i%3)*0.05)),r:16+i*6,spd:0.10+i*0.04});
  return cl;
}
function _drawClouds(W,H){
  ISO.clouds.forEach(function(cl){
    cl.x+=cl.spd;
    if(cl.x>W+cl.r*2) cl.x=-cl.r*2;
    ctx.save(); ctx.globalAlpha=0.68; ctx.fillStyle='#fff';
    [[cl.x,cl.y,cl.r],[cl.x+cl.r*0.6,cl.y+cl.r*0.12,cl.r*0.72],
     [cl.x-cl.r*0.55,cl.y+cl.r*0.15,cl.r*0.62],[cl.x+cl.r*0.05,cl.y+cl.r*0.36,cl.r*0.88]]
    .forEach(function(b){ctx.beginPath();ctx.arc(b[0],b[1],b[2],0,Math.PI*2);ctx.fill();});
    ctx.restore();
  });
}

// ================================================================
// DESSIN : MONTAGNES (discrètes, derrière le sol)
// ================================================================
function _drawMountains(W,H,night){
  var gy=_groundY(H);
  var cols=night?['#14182a','#0f1322','#0a0e1a']:['#6aaf88','#52906e','#3d7853'];
  var peaks=[[W*0.04,gy-H*0.20,W*0.17],[W*0.18,gy-H*0.27,W*0.14],
             [W*0.40,gy-H*0.22,W*0.16],[W*0.60,gy-H*0.30,W*0.17],
             [W*0.78,gy-H*0.23,W*0.14],[W*0.95,gy-H*0.26,W*0.15]];
  peaks.forEach(function(p,i){
    ctx.beginPath();
    ctx.moveTo(p[0]-p[2]*0.5,gy);
    ctx.lineTo(p[0],p[1]);
    ctx.lineTo(p[0]+p[2]*0.5,gy);
    ctx.closePath();
    ctx.fillStyle=cols[i%cols.length];
    ctx.fill();
    if(!night){
      ctx.beginPath();
      ctx.moveTo(p[0]-p[2]*0.06,p[1]+p[2]*0.10);
      ctx.lineTo(p[0],p[1]);
      ctx.lineTo(p[0]+p[2]*0.06,p[1]+p[2]*0.10);
      ctx.closePath();
      ctx.fillStyle='rgba(255,255,255,0.80)';
      ctx.fill();
    }
  });
}

// ================================================================
// DESSIN : SOL
// ================================================================
function _drawGround(W,H){
  var gy=_groundY(H);
  // Sol principal
  var gg=ctx.createLinearGradient(0,gy-H*0.02,0,H);
  gg.addColorStop(0,'#55a858');
  gg.addColorStop(0.25,'#479a4a');
  gg.addColorStop(1,'#35783a');
  ctx.fillStyle=gg;
  ctx.beginPath();
  ctx.moveTo(0,gy-H*0.02);
  ctx.bezierCurveTo(W*0.3,gy-H*0.06,W*0.7,gy+H*0.02,W,gy-H*0.01);
  ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath();
  ctx.fill();
  // Lisière lumineuse
  ctx.fillStyle='rgba(130,220,110,0.18)';
  ctx.beginPath();
  ctx.moveTo(0,gy-H*0.02);
  ctx.bezierCurveTo(W*0.3,gy-H*0.06,W*0.7,gy+H*0.02,W,gy-H*0.01);
  ctx.lineTo(W,gy+H*0.018);
  ctx.bezierCurveTo(W*0.7,gy+H*0.038,W*0.3,gy-H*0.042,0,gy+H*0.016);
  ctx.closePath();
  ctx.fill();
}

// ================================================================
// DESSIN : CHEMIN
// ================================================================
function _drawPath(W,H){
  var gy=_groundY(H);
  var nz=window.VILLAGE_ZONES.length;
  var py=gy+H*0.018;

  // Ombre du chemin
  ctx.save();
  ctx.strokeStyle='rgba(0,0,0,0.15)';
  ctx.lineWidth=W*0.060;
  ctx.lineCap='round'; ctx.lineJoin='round';
  ctx.beginPath();
  ctx.moveTo(_zoneX(0,W)-W*0.22,py+3);
  for(var i=0;i<=nz;i++) ctx.lineTo(_zoneX(i,W),py+Math.sin(i*1.6)*H*0.012+3);
  ctx.stroke();

  // Chemin principal
  ctx.strokeStyle='#c4a050';
  ctx.lineWidth=W*0.052;
  ctx.beginPath();
  ctx.moveTo(_zoneX(0,W)-W*0.22,py);
  for(var i=0;i<=nz;i++) ctx.lineTo(_zoneX(i,W),py+Math.sin(i*1.6)*H*0.012);
  ctx.stroke();

  // Bordure
  ctx.strokeStyle='#8a6020';
  ctx.lineWidth=W*0.055;
  ctx.globalAlpha=0.22;
  ctx.stroke();
  ctx.globalAlpha=1;

  // Pavés
  ctx.fillStyle='rgba(170,130,60,0.30)';
  var total=_totalW(W);
  for(var j=0;j<80;j++){
    var px=(j/80)*(total+W)-ISO.scrollX;
    if(px<-15||px>W+15) continue;
    var ppY=py+Math.sin(j*1.1)*H*0.012;
    var pw=8+Math.sin(j*7)*3, ph=4;
    ctx.fillRect(px-pw/2,ppY-ph/2,pw,ph);
  }
  ctx.restore();
}

// ================================================================
// DESSIN : RIVIÈRE + PONT
// ================================================================
function _drawRiver(W,H){
  var gy=_groundY(H);
  var rx=_zoneX(3,W)+W*0.10;
  if(rx<-W*0.15||rx>W*1.15) return;
  ctx.save();
  var rg=ctx.createLinearGradient(rx-16,0,rx+16,0);
  rg.addColorStop(0,'#3a80a8'); rg.addColorStop(0.5,'#52aad0'); rg.addColorStop(1,'#3a80a8');
  ctx.fillStyle=rg;
  ctx.beginPath();
  ctx.moveTo(rx-16,gy-H*0.04);
  ctx.bezierCurveTo(rx-20,gy,rx+20,gy+H*0.015,rx+16,H*0.95);
  ctx.bezierCurveTo(rx+26,gy+H*0.015,rx-10,gy,rx-6,gy-H*0.04);
  ctx.closePath(); ctx.fill();
  // Reflets eau
  ctx.globalAlpha=0.28; ctx.fillStyle='#90d0ee';
  for(var r=0;r<5;r++){var ry=gy+r*H*0.05;ctx.fillRect(rx-5+r,ry,10-r*1.5,2.5);}
  ctx.globalAlpha=1;
  // Pont
  var by=gy+H*0.016;
  ctx.fillStyle='#7a5c10'; ctx.fillRect(rx-28,by-5,56,9);
  ctx.strokeStyle='#5a3e08'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(rx,by+20,24,Math.PI,0); ctx.stroke();
  ctx.fillStyle='#9a7a28';
  for(var p=-3;p<=3;p++){ctx.fillRect(rx+p*7-1.5,by-13,3,9);}
  ctx.restore();
}

// ================================================================
// DESSIN : ARBRES
// ================================================================
function _drawTrees(W,H){
  var gy=_groundY(H);
  var nz=window.VILLAGE_ZONES.length;
  var pts=[];
  for(var i=0;i<nz+1;i++){
    var zx=_zoneX(i,W);
    pts.push({x:zx-W*0.15,y:gy,s:0.50});
    pts.push({x:zx+W*0.15,y:gy,s:0.45});
    pts.push({x:zx-W*0.08,y:gy+H*0.015,s:0.32});
  }
  pts.forEach(function(t){
    if(t.x<-50||t.x>W+50) return;
    _tree(t.x,t.y,t.s,H);
  });
}
function _tree(x,y,sc,H){
  var s=sc*H*0.072;
  ctx.fillStyle='#5a3218'; ctx.fillRect(x-s*0.10,y-s*0.28,s*0.20,s*0.32);
  [{dy:-s*0.22,r:s*0.40,c:'#267530'},{dy:-s*0.48,r:s*0.34,c:'#32954a'},{dy:-s*0.70,r:s*0.24,c:'#3fbb5e'}]
  .forEach(function(l){ctx.beginPath();ctx.arc(x,y+l.dy,l.r,0,Math.PI*2);ctx.fillStyle=l.c;ctx.fill();});
}

// ================================================================
// DESSIN : ZONES + BÂTIMENTS
// ================================================================
function _drawZones(W,H){
  var gy=_groundY(H);
  var xp=(window.S&&S.xp)||0;
  var nl=(window.S&&S.nativeLang)||'fr';

  window.VILLAGE_ZONES.forEach(function(zone,zi){
    var zx=_zoneX(zi,W);
    if(zx<-W*0.5||zx>W*1.5) return;
    var unlocked=xp>=zone.xpRequired;

    // ── Badge de zone (en haut, fixe dans la zone) ──
    var labelY=H*0.08;
    var bw=Math.min(W*0.30,115), bh=42;
    ctx.save();
    // Fond du badge
    ctx.shadowColor='rgba(0,0,0,0.35)'; ctx.shadowBlur=10; ctx.shadowOffsetY=3;
    _rrect(zx-bw/2,labelY-bh*0.5,bw,bh,12);
    ctx.fillStyle=unlocked?zone.color:'rgba(60,60,70,0.85)';
    ctx.fill();
    ctx.shadowBlur=0;
    // Texte badge
    var lbl=(zone.label[nl]||zone.label.fr);
    var sub=(zone.sublabel[nl]||zone.sublabel.fr);
    ctx.textAlign='center';
    ctx.fillStyle=unlocked?'rgba(0,0,0,0.80)':'rgba(255,255,255,0.35)';
    ctx.font='bold '+Math.round(H*0.020)+'px Nunito,system-ui';
    ctx.fillText(zone.icon+' '+lbl, zx, labelY-4);
    ctx.fillStyle=unlocked?'rgba(0,0,0,0.52)':'rgba(255,255,255,0.20)';
    ctx.font=Math.round(H*0.014)+'px Nunito,system-ui';
    ctx.fillText(sub, zx, labelY+12);
    ctx.restore();

    // ── Ligne pointillée badge→bâtiment ──
    ctx.save();
    ctx.strokeStyle=unlocked?zone.color:'rgba(180,180,180,0.20)';
    ctx.lineWidth=1.5; ctx.setLineDash([4,5]); ctx.globalAlpha=0.55;
    ctx.beginPath(); ctx.moveTo(zx,labelY+bh*0.5); ctx.lineTo(zx,gy-H*0.28); ctx.stroke();
    ctx.restore();

    // ── Bâtiments ──
    zone.buildings.forEach(function(bld,bi){
      var pos=_buildPos(zi,bi,zone.buildings.length,W,H);
      var bUnlocked=xp>=bld.xp;
      var hovered=ISO.hoveredBuilding===(zone.id+'_'+bld.id);
      _drawBuilding(pos.x,pos.y,bld,zone,bUnlocked,hovered,W,H,nl);
    });

    // ── Indicateur XP ──
    var indY=gy-H*0.04;
    ctx.save();
    if(!unlocked){
      var need=zone.xpRequired-xp;
      _rrect(zx-52,indY-14,104,26,10);
      ctx.fillStyle='rgba(0,0,0,0.60)'; ctx.fill();
      ctx.fillStyle='#ff9f43'; ctx.textAlign='center';
      ctx.font='bold '+Math.round(H*0.017)+'px Nunito,system-ui';
      ctx.fillText('🔒 +'+need+' XP', zx, indY+4);
    } else {
      _rrect(zx-42,indY-12,84,22,10);
      ctx.fillStyle='rgba(78,207,112,0.20)'; ctx.fill();
      ctx.fillStyle='#4ecf70'; ctx.textAlign='center';
      ctx.font='bold '+Math.round(H*0.015)+'px Nunito,system-ui';
      ctx.fillText('✅ Débloqué', zx, indY+3);
    }
    ctx.restore();
  });
}

// ================================================================
// DESSIN : UN BÂTIMENT
// ================================================================
function _drawBuilding(x,y,bld,zone,unlocked,hovered,W,H,nl){
  var s=H*0.155;
  var bob=Math.sin(tick*0.020+x*0.008)*2.8;
  var sc=hovered?1.10:1;
  var by=y-s*0.80+bob; // base du bâtiment sur le sol

  ctx.save();
  ctx.translate(x,by);
  ctx.scale(sc,sc);

  if(!unlocked){
    // Bâtiment grisé
    ctx.globalAlpha=0.40;
    _buildShape(0,0,s,'#707080','#505060','#909098');
    ctx.globalAlpha=1;
    // Cadenas centré
    ctx.font=Math.round(s*0.55)+'px serif';
    ctx.textAlign='center';
    ctx.fillText('🔒',0,s*0.08);
  } else {
    // Halo de survol
    if(hovered){
      ctx.save();
      ctx.shadowColor=zone.color; ctx.shadowBlur=28;
      ctx.beginPath(); ctx.arc(0,-s*0.25,s*0.65,0,Math.PI*2);
      ctx.fillStyle=zone.color+'33'; ctx.fill();
      ctx.restore();
    }
    // Corps isométrique
    _buildShape(0,0,s,_shade(zone.color,-0.18),_shade(zone.color,-0.38),_shade(zone.color,0.18));

    // Emoji
    ctx.font=Math.round(s*0.58)+'px serif';
    ctx.textAlign='center';
    ctx.shadowColor='rgba(0,0,0,0.40)'; ctx.shadowBlur=4;
    ctx.fillText(bld.emoji,0,s*0.06);
    ctx.shadowBlur=0;

    // Label
    var lb=bld.label[nl]||bld.label.fr;
    ctx.font='bold '+Math.round(H*0.019)+'px Nunito,system-ui';
    ctx.fillStyle='#ffffff';
    ctx.shadowColor='rgba(0,0,0,0.60)'; ctx.shadowBlur=5; ctx.shadowOffsetY=1;
    ctx.fillText(lb,0,s*0.82);
    ctx.shadowBlur=0;

    // Prompt "Appuyer" si survolé
    if(hovered){
      ctx.font=Math.round(H*0.013)+'px Nunito,system-ui';
      ctx.fillStyle='rgba(255,255,255,0.70)';
      ctx.fillText('Appuyer pour entrer',0,s*1.02);
    }
  }
  ctx.restore();
}

// ── Forme 3D boîte isométrique ──
function _buildShape(x,y,s,L,R,T){
  var hw=s*0.46,hh=s*0.50,th=s*0.20;
  // Face gauche
  ctx.beginPath();
  ctx.moveTo(x-hw,y);ctx.lineTo(x,y-hh);ctx.lineTo(x,y-hh-th*0.5);ctx.lineTo(x-hw,y-th*0.5);
  ctx.closePath(); ctx.fillStyle=L; ctx.fill();
  // Face droite
  ctx.beginPath();
  ctx.moveTo(x,y-hh);ctx.lineTo(x+hw,y);ctx.lineTo(x+hw,y-th*0.5);ctx.lineTo(x,y-hh-th*0.5);
  ctx.closePath(); ctx.fillStyle=R; ctx.fill();
  // Toit
  ctx.beginPath();
  ctx.moveTo(x-hw,y-th*0.5);ctx.lineTo(x,y-hh-th);ctx.lineTo(x+hw,y-th*0.5);ctx.lineTo(x,y-th*0.20);
  ctx.closePath(); ctx.fillStyle=T; ctx.fill();
  // Contour fin
  ctx.strokeStyle='rgba(0,0,0,0.14)'; ctx.lineWidth=0.8; ctx.stroke();
}

// ================================================================
// PARTICULES
// ================================================================
function _drawParticles(W,H){
  if(tick%14===0&&ISO.particles.length<18){
    var gy=_groundY(H);
    ISO.particles.push({
      x:Math.random()*W, y:gy-Math.random()*H*0.18,
      vx:(Math.random()-0.5)*0.7, vy:-0.5-Math.random()*0.5,
      life:1, decay:0.010,
      r:1.5+Math.random()*3,
      col:['#4ecf70','#ffd700','#ff9f43','#4a9eff'][Math.floor(Math.random()*4)]
    });
  }
  ISO.particles=ISO.particles.filter(function(p){
    p.x+=p.vx; p.y+=p.vy; p.life-=p.decay;
    if(p.life<=0) return false;
    ctx.save(); ctx.globalAlpha=p.life*0.50;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=p.col; ctx.fill(); ctx.restore();
    return true;
  });
}

// ================================================================
// UTILITAIRES
// ================================================================
function _rrect(x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}
function _shade(hex,p){
  var c=hex.replace('#','');
  if(c.length===3) c=c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
  var r=parseInt(c.slice(0,2),16),g=parseInt(c.slice(2,4),16),b=parseInt(c.slice(4,6),16);
  return 'rgb('+Math.max(0,Math.min(255,Math.round(r+r*p)))+','+Math.max(0,Math.min(255,Math.round(g+g*p)))+','+Math.max(0,Math.min(255,Math.round(b+b*p)))+')';
}

// ================================================================
// SCROLL + SNAP
// ================================================================
function _scrollToZone(zi,instant){
  var c=document.getElementById('villageCanvas');
  if(!c) return;
  var dpr=window.devicePixelRatio||1, W=c.width/dpr;
  var t=W*0.18+zi*(W*0.38)-W*0.38;
  var max=Math.max(0,_totalW(W)-W);
  t=Math.max(0,Math.min(t,max));
  if(instant) ISO.scrollX=t;
  ISO.targetScrollX=t;
}
function _clamp(W){
  var max=Math.max(0,_totalW(W)-W);
  ISO.targetScrollX=Math.max(0,Math.min(ISO.targetScrollX,max));
}
function _snap(W){
  var minD=Infinity,best=0;
  window.VILLAGE_ZONES.forEach(function(z,i){
    var dist=Math.abs(_zoneX(i,W)-W*0.45);
    if(dist<minD){minD=dist;best=i;}
  });
  _scrollToZone(best,false);
}

// ================================================================
// HIT TEST
// ================================================================
function _hit(mx,my,W,H){
  var s=H*0.155;
  var result=null;
  window.VILLAGE_ZONES.forEach(function(zone,zi){
    zone.buildings.forEach(function(bld,bi){
      var pos=_buildPos(zi,bi,zone.buildings.length,W,H);
      var bob=Math.sin(tick*0.020+pos.x*0.008)*2.8;
      var by=pos.y-s*0.80+bob;
      var cx=pos.x, cy=by-s*0.30; // centre du bâtiment
      var dx=mx-cx, dy=my-cy;
      if(Math.abs(dx)<s*0.60&&Math.abs(dy)<s*0.72) result=zone.id+'_'+bld.id;
    });
  });
  return result;
}

// ================================================================
// ÉVÉNEMENTS TOUCH
// ================================================================
function _onTouchStart(e){
  e.preventDefault();
  ISO.touchStartX=e.touches[0].clientX;
  ISO.touchScrollX=ISO.targetScrollX;
  ISO.touchMoved=false;
  ISO.tapTime=Date.now();
}
function _onTouchMove(e){
  e.preventDefault();
  var dx=ISO.touchStartX-e.touches[0].clientX;
  if(Math.abs(dx)>6) ISO.touchMoved=true;
  var c=document.getElementById('villageCanvas');
  var dpr=window.devicePixelRatio||1, W=c?c.width/dpr:360;
  ISO.targetScrollX=ISO.touchScrollX+dx;
  _clamp(W);
}
function _onTouchEnd(e){
  var c=document.getElementById('villageCanvas');
  var dpr=window.devicePixelRatio||1;
  var W=c?c.width/dpr:360, H=c?c.height/dpr:640;
  if(!ISO.touchMoved&&Date.now()-ISO.tapTime<300){
    // C'est un tap → traiter comme clic
    var t=e.changedTouches[0];
    var rect=c.getBoundingClientRect();
    var mx=t.clientX-rect.left, my=t.clientY-rect.top;
    var hit=_hit(mx,my,W,H);
    if(hit) _clickBuilding(hit);
    else _snap(W);
  } else {
    _snap(W);
  }
}

// ================================================================
// ÉVÉNEMENTS SOURIS
// ================================================================
function _onMouseDown(e){
  ISO.isDragging=true;
  ISO.dragStartX=e.clientX;
  ISO.dragScrollX=ISO.targetScrollX;
  ISO.touchMoved=false;
  var c=document.getElementById('villageCanvas');
  if(c) c.style.cursor='grabbing';
}
function _onMouseMove(e){
  var c=document.getElementById('villageCanvas');
  if(!c) return;
  var dpr=window.devicePixelRatio||1, W=c.width/dpr, H=c.height/dpr;
  var rect=c.getBoundingClientRect();
  var mx=e.clientX-rect.left, my=e.clientY-rect.top;
  if(ISO.isDragging){
    var dx=ISO.dragStartX-e.clientX;
    if(Math.abs(dx)>5) ISO.touchMoved=true;
    ISO.targetScrollX=ISO.dragScrollX+dx;
    _clamp(W);
  } else {
    var h=_hit(mx,my,W,H);
    ISO.hoveredBuilding=h;
    c.style.cursor=h?'pointer':'grab';
  }
}
function _onMouseUp(e){
  var c=document.getElementById('villageCanvas');
  var dpr=window.devicePixelRatio||1, W=c?c.width/dpr:360;
  if(ISO.isDragging){
    ISO.isDragging=false;
    if(c) c.style.cursor=ISO.hoveredBuilding?'pointer':'grab';
    if(!ISO.touchMoved) _snap(W);
    else _snap(W);
  }
}
function _onClick(e){
  if(ISO.touchMoved||ISO.isDragging) return;
  var c=document.getElementById('villageCanvas');
  if(!c) return;
  var dpr=window.devicePixelRatio||1, W=c.width/dpr, H=c.height/dpr;
  var rect=c.getBoundingClientRect();
  var mx=e.clientX-rect.left, my=e.clientY-rect.top;
  var hit=_hit(mx,my,W,H);
  if(hit) _clickBuilding(hit);
}

// ================================================================
// CLIC SUR UN BÂTIMENT → ENTRÉE DANS LE LIEU + NPC
// ================================================================
function _clickBuilding(key){
  var parts=key.split('_');
  var zoneId=parts[0], buildId=parts.slice(1).join('_');
  var zone=window.VILLAGE_ZONES.find(function(z){return z.id===zoneId;});
  var bld=zone&&zone.buildings.find(function(b){return b.id===buildId;});
  if(!zone||!bld) return;

  var xp=(window.S&&S.xp)||0;
  if(xp<bld.xp){
    if(typeof showNotif==='function') showNotif('🔒 Il te faut '+(bld.xp-xp)+' XP de plus !');
    return;
  }

  // Particules festives
  if(canvas){
    var dpr=window.devicePixelRatio||1,W=canvas.width/dpr,H=canvas.height/dpr;
    var pos=_buildPos(window.VILLAGE_ZONES.indexOf(zone),zone.buildings.indexOf(bld),zone.buildings.length,W,H);
    for(var i=0;i<16;i++){
      ISO.particles.push({x:pos.x,y:pos.y-H*0.12,
        vx:(Math.random()-0.5)*5,vy:-2.5-Math.random()*3,
        life:1,decay:0.022,r:3+Math.random()*5,col:zone.color});
    }
  }

  // Remplir l'écran lieu
  var nl=(window.S&&S.nativeLang)||'fr';
  var locTitle=document.getElementById('locTitle');
  if(locTitle) locTitle.textContent=bld.emoji+' '+(bld.label[nl]||bld.label.fr);

  // NPCs depuis LOCATIONS (data.js)
  var npcList=document.getElementById('npcList');
  if(npcList){
    var locData=null;
    if(typeof LOCATIONS!=='undefined') locData=LOCATIONS.find(function(l){return l.id===buildId;});
    var npcs=(locData&&locData.npcs)||[];

    if(npcs.length===0){
      npcList.innerHTML='<div style="padding:40px 20px;text-align:center">'
        +'<div style="font-size:3rem;margin-bottom:12px">🏚️</div>'
        +'<div style="color:rgba(255,255,255,0.35);font-size:0.9rem">Aucun personnage ici pour l\'instant.</div>'
        +'</div>';
    } else {
      npcList.innerHTML=npcs.map(function(npc){
        var role=(npc.role&&(npc.role[nl]||npc.role.fr))||'';
        return '<button onclick="openDialogue(\''+buildId+'\',\''+npc.id+'\')" style="'
          +'display:flex;align-items:center;gap:16px;width:100%;padding:16px 20px;'
          +'background:rgba(255,255,255,0.04);border:1px solid rgba(255,215,0,0.10);'
          +'border-radius:18px;margin:10px 0;cursor:pointer;transition:all 0.2s;'
          +'color:inherit;text-align:left;"'
          +' onmouseover="this.style.background=\'rgba(255,215,0,0.08)\'"'
          +' onmouseout="this.style.background=\'rgba(255,255,255,0.04)\'">'
          +'<div style="font-size:2.4rem;line-height:1;flex-shrink:0">'+npc.emoji+'</div>'
          +'<div style="flex:1;min-width:0">'
          +'<div style="font-weight:800;font-size:1rem;color:#f0e8d0">'+npc.name+'</div>'
          +(role?'<div style="font-size:0.75rem;color:rgba(255,255,255,0.38);margin-top:3px">'+role+'</div>':'')
          +'</div>'
          +'<div style="color:rgba(255,215,0,0.45);font-size:1.4rem;flex-shrink:0">›</div>'
          +'</button>';
      }).join('');
    }
  }

  // Stopper la boucle village pendant qu'on est dans un lieu
  window._villageLoopActive=false;

  // Naviguer vers l'écran lieu
  if(typeof showScreen==='function') showScreen('screen-location');

  // Relancer la boucle quand on revient
  var backBtn=document.querySelector('#screen-location .back-btn');
  if(backBtn&&!backBtn._patched){
    backBtn._patched=true;
    var orig=backBtn.onclick;
    backBtn.onclick=function(){
      if(typeof orig==='function') orig.call(this);
      else if(typeof showScreen==='function') showScreen('screen-village');
      window._villageLoopActive=true;
      window._villageLoopRunning=true;
      requestAnimationFrame(_loop);
    };
  }
}

// ================================================================
// BARRE DE NAVIGATION
// ================================================================
// TRADUCTIONS NAV BAR (dans la langue cible d'apprentissage)
// ================================================================
var NAV_LABELS = {
  village:    {fr:'Village',  en:'Village',  es:'Pueblo',   ht:'Vilaj',   de:'Dorf',     ru:'Деревня',  zh:'村庄',   ja:'村'},
  lessons:    {fr:'Leçons',   en:'Lessons',  es:'Lecciones',ht:'Leson',   de:'Lektionen',ru:'Уроки',    zh:'课程',   ja:'レッスン'},
  practice:   {fr:'Pratique', en:'Practice', es:'Práctica', ht:'Pratik',  de:'Übung',    ru:'Практика', zh:'练习',   ja:'練習'},
  challenges: {fr:'Défis',    en:'Challenges',es:'Desafíos',ht:'Defi',   de:'Aufgaben', ru:'Задания',  zh:'挑战',   ja:'チャレンジ'},
  profile:    {fr:'Profil',   en:'Profile',  es:'Perfil',   ht:'Pwofil',  de:'Profil',   ru:'Профиль',  zh:'我的',   ja:'プロフィール'}
};

function _buildNavBar(){
  var old=document.querySelector('.village-nav-bar');
  if(old) old.remove();
  var vs=document.getElementById('screen-village');
  if(!vs) return;

  // Utiliser la LANGUE CIBLE pour les labels de la nav
  var tl=(window.S&&S.targetLang)||'fr';

  var tabs=[
    {id:'village',   icon:'🏘️'},
    {id:'lessons',   icon:'📖'},
    {id:'practice',  icon:'💬'},
    {id:'challenges',icon:'🏆'},
    {id:'profile',   icon:'👤'}
  ];

  var nav=document.createElement('nav');
  nav.className='village-nav-bar';
  nav.innerHTML=tabs.map(function(t){
    var lbl=(NAV_LABELS[t.id]&&(NAV_LABELS[t.id][tl]||NAV_LABELS[t.id].fr))||t.id;
    return '<button class="vnb-btn'+(t.id==='village'?' active':'')+'" '
      +'id="vnb-'+t.id+'" onclick="window._navTo(\''+t.id+'\')">'
      +'<span class="vnb-icon">'+t.icon+'</span>'
      +'<span class="vnb-label">'+lbl+'</span>'
      +'</button>';
  }).join('');
  vs.appendChild(nav);

  // CSS nav bar
  if(!document.getElementById('vnb-css')){
    var st=document.createElement('style');
    st.id='vnb-css';
    st.textContent=[
      '.village-nav-bar{flex-shrink:0;display:flex;align-items:stretch;justify-content:space-around;',
      'background:rgba(6,8,16,0.98);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);',
      'border-top:1px solid rgba(255,255,255,0.06);',
      'padding:6px 0 max(6px,env(safe-area-inset-bottom));z-index:30;}',
      '.vnb-btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;',
      'gap:3px;background:none;border:none;color:rgba(255,255,255,0.32);',
      'font-size:0.58rem;font-weight:800;letter-spacing:0.03em;padding:6px 0;',
      'cursor:pointer;transition:color 0.18s;-webkit-tap-highlight-color:transparent;}',
      '.vnb-btn.active{color:#4ecf70;}',
      '.vnb-btn:active{opacity:0.7;}',
      '.vnb-icon{font-size:1.25rem;line-height:1;transition:transform 0.18s;}',
      '.vnb-btn.active .vnb-icon{transform:scale(1.18);}',
      '.vnb-label{font-size:0.56rem;font-family:Nunito,system-ui;}'
    ].join('');
    document.head.appendChild(st);
  }
}

window._navTo=function(section){
  document.querySelectorAll('.vnb-btn').forEach(function(b){b.classList.remove('active');});
  var btn=document.getElementById('vnb-'+section);
  if(btn) btn.classList.add('active');
  switch(section){
    case 'village':
      var xp2=(window.S&&S.xp)||0,zi2=0;
      window.VILLAGE_ZONES.forEach(function(z,i){if(xp2>=z.xpRequired)zi2=i;});
      _scrollToZone(zi2,false);
      break;
    case 'lessons':
      window._villageLoopActive=false;
      if(typeof loadVocab==='function') loadVocab('verbes');
      if(typeof showScreen==='function') showScreen('screen-vocab');
      break;
    case 'practice':
      window._villageLoopActive=false;
      if(typeof loadPhrases==='function') loadPhrases('quotidien');
      if(typeof showScreen==='function') showScreen('screen-phrases');
      break;
    case 'challenges':
      window._villageLoopActive=false;
      if(typeof showLeaderboard==='function') showLeaderboard();
      else if(typeof showScreen==='function') showScreen('screen-leaderboard');
      break;
    case 'profile':
      window._villageLoopActive=false;
      if(typeof showScreen==='function') showScreen('screen-profile');
      break;
  }
};

// ================================================================
// MÉTÉO + TEMPS
// ================================================================
function setWeather(w){window.currentWeather=w||'sun';}
function getWeatherForTime(){
  var h=new Date().getHours();
  if(h>=21||h<6) return 'night';
  return Math.random()<0.10?'rain':'sun';
}
function updateTime(){
  var el=document.getElementById('hudTime');
  if(el){var n=new Date();el.textContent=('0'+n.getHours()).slice(-2)+':'+('0'+n.getMinutes()).slice(-2);}
  var we=document.getElementById('hudWeather');
  if(we&&window.WEATHER_ICONS) we.textContent=WEATHER_ICONS[currentWeather]||'☀️';
}

// ================================================================
// COMPATIBILITÉ
// ================================================================
function alignLocationsToRings(){}
function initCanvas(){_initCanvas();}
function drawVillage(){_draw();}

window.goVillage=goVillage;
window.setWeather=setWeather;
window.updateTime=updateTime;
window.initCanvas=initCanvas;
window.drawVillage=drawVillage;
window.alignLocationsToRings=alignLocationsToRings;

console.log('✅ village.js FINAL v3 chargé');
