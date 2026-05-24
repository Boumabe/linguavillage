// ================================================================
// LinguaVillage — village.js  v3  (FINAL FIX)
// CORRECTIONS :
//  1. openLocation() reconstruit npcList ET injecte dans LOCATIONS
//     pour que openDialogue() de dialogue.js fonctionne
//  2. _navTo('lessons') → showScreen('screen-vocab') + loadVocab()
//  3. Design immersif premium : bâtiments dessinés, sol texturé,
//     toucher / clic avec feedback particules, NPC animés devant
// ================================================================

'use strict';

// ── état global ──────────────────────────────────────────────────
window.canvas  = null;
window.ctx     = null;
window.tick    = 0;
window.currentWeather = window.currentWeather || 'sun';

var _st = {
  sx:0, tx:0,                          // scroll courant / cible
  drag:false, dx0:0, sx0:0,            // drag souris
  touch:false, tx0:0, stx0:0, tmoved:false, ttime:0,
  hov:null,                            // index zone survolée
  ptcl:[], clouds:[],
  ready:false
};

// ================================================================
// ZONES DE PROGRESSION
// ================================================================
window.VILLAGE_ZONES = [
  {
    id:'park',   num:1,
    label:   {fr:'Débutant',      en:'Beginner',     es:'Principiante', ht:'Debitant'},
    sub:     {fr:'Les bases',     en:'The basics',   es:'Las bases',    ht:'Baz yo'},
    xpReq:0,  color:'#4ecf70', type:'cottage',
    npc:{id:'marie',    name:'Marie',      emoji:'👩',    role:{fr:'Villageoise',       en:'Villager',    es:'Aldeana',        ht:'Moun vilaj'}}
  },
  {
    id:'school', num:2,
    label:   {fr:'Élémentaire',   en:'Elementary',   es:'Elemental',    ht:'Elemantè'},
    sub:     {fr:'Se présenter',  en:'Introduce',    es:'Presentarse',  ht:'Prezante'},
    xpReq:100, color:'#f9c74f', type:'shop',
    npc:{id:'jean',     name:'Jean',       emoji:'🧑‍💼',  role:{fr:'Commerçant',        en:'Shopkeeper',  es:'Comerciante',    ht:'Komèsan'}}
  },
  {
    id:'market', num:3,
    label:   {fr:'Intermédiaire', en:'Intermediate', es:'Intermedio',   ht:'Entèmedyè'},
    sub:     {fr:'Parler au quotidien', en:'Daily talk', es:'Diálogo', ht:'Pale chak jou'},
    xpReq:300, color:'#4a9eff', type:'inn',
    npc:{id:'lea',      name:'Léa',        emoji:'👩‍🍳',  role:{fr:'Aubergiste',        en:'Innkeeper',   es:'Hostelera',      ht:'Otèlye'}}
  },
  {
    id:'bank',   num:4,
    label:   {fr:'Avancé',        en:'Advanced',     es:'Avanzado',     ht:'Avanse'},
    sub:     {fr:"S'exprimer avec aisance", en:'Speak with ease', es:'Fluidez', ht:'Pale libman'},
    xpReq:600, color:'#ff9f43', type:'mansion',
    npc:{id:'dubois',   name:'M. Dubois',  emoji:'🧑‍💼',  role:{fr:'Banquier',          en:'Banker',      es:'Banquero',       ht:'Bankye'}}
  },
  {
    id:'castle', num:5,
    label:   {fr:'Maîtrise',      en:'Mastery',      es:'Maestría',     ht:'Mètrize'},
    sub:     {fr:'Comme un·e natif·ve', en:'Like a native', es:'Como nativo', ht:'Tankou natif'},
    xpReq:1000,color:'#e040fb', type:'castle',
    npc:{id:'lord',     name:'Le Seigneur',emoji:'🧙',    role:{fr:'Seigneur du château',en:'Castle Lord', es:'Señor del castillo',ht:'Seyè château a'}}
  }
];

// ================================================================
// ENTRÉE PRINCIPALE
// ================================================================
function goVillage() {
  if (!window.S) return;

  // Mettre à jour le HUD existant
  var hP=document.getElementById('hudPlayer'),
      hL=document.getElementById('hudLang'),
      hX=document.getElementById('hudXP');
  if (hP) hP.textContent = '👤 '+(S.playerName||'');
  if (hL) hL.textContent = ((typeof FLAGS!=='undefined'?FLAGS[S.targetLang]:'')||'')+' '+((typeof LANG_NAMES!=='undefined'?LANG_NAMES[S.targetLang]:'')||'');
  if (hX) hX.textContent = (S.xp||0)+' XP';

  // Afficher l'écran
  if (typeof showScreen==='function') showScreen('screen-village');
  else {
    document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active');});
    var vs=document.getElementById('screen-village');
    if (vs) vs.classList.add('active');
  }

  // Reset boucle
  canvas=null; ctx=null; tick=0;
  window._lvLoopActive=false;
  _st.ready=false; _st.hov=null;

  requestAnimationFrame(function(){requestAnimationFrame(function(){
    _initCanvas();
    _buildNav();
    setTimeout(function(){_scrollTo(0,true);},80);
  });});

  clearInterval(window._lvTimer);
  window._lvTimer=setInterval(updateTime,30000);
  if (typeof updateTime==='function') updateTime();
}

// ================================================================
// CANVAS
// ================================================================
function _initCanvas() {
  // S'assurer que LOCATIONS existe pour que openDialogue marche
  _syncLocations();

  var c=document.getElementById('villageCanvas');
  if (!c) return;
  var dpr=window.devicePixelRatio||1;
  var nav=document.querySelector('.village-nav-bar');
  var hud=document.querySelector('.village-hud');
  var hudH=(hud?hud.getBoundingClientRect().height:48)
          +(nav?nav.getBoundingClientRect().height:60);
  var W=Math.round((window.visualViewport?window.visualViewport.width:window.innerWidth)||390);
  var H=Math.max(240,Math.round(((window.visualViewport?window.visualViewport.height:window.innerHeight)||844)-hudH));

  c.width=W*dpr; c.height=H*dpr;
  c.style.width=W+'px'; c.style.height=H+'px';
  c.style.display='block'; c.style.cursor='grab';
  c.style.touchAction='none';

  _st.clouds=_mkClouds(W,H);
  _st.ptcl=[];
  _st.ready=true;

  // Remplacer le nœud pour nettoyer les listeners
  var nc=c.cloneNode(false);
  c.parentNode.replaceChild(nc,c);
  c=document.getElementById('villageCanvas');

  c.addEventListener('touchstart', _tstart,{passive:false});
  c.addEventListener('touchmove',  _tmove, {passive:false});
  c.addEventListener('touchend',   _tend,  {passive:true});
  c.addEventListener('mousedown',  _mdown);
  c.addEventListener('mousemove',  _mmove);
  c.addEventListener('mouseup',    _mup);
  // click géré manuellement via touchend/mouseup pour distinguer drag

  clearInterval(window._onResize);
  window.removeEventListener('resize',window._lvResize||function(){});
  window._lvResize=function(){_initCanvas();};
  window.addEventListener('resize',window._lvResize);

  if (!window._lvLoopActive) {
    window._lvLoopActive=true;
    requestAnimationFrame(_loop);
  }
}

// ================================================================
// SYNCHRONISER LOCATIONS avec VILLAGE_ZONES
// Critique : openDialogue(locId, npcId) cherche dans window.LOCATIONS
// ================================================================
function _syncLocations() {
  if (typeof LOCATIONS==='undefined') window.LOCATIONS=[];

  VILLAGE_ZONES.forEach(function(zone) {
    var existing=LOCATIONS.find(function(l){return l.id===zone.id;});
    var npcEntry=Object.assign({},zone.npc); // copie propre
    if (!existing) {
      LOCATIONS.push({
        id:zone.id, x:.5,y:.5,w:.12,h:.12,
        emoji:'🏘️', color:zone.color,
        npcs:[npcEntry]
      });
    } else {
      // S'assurer que le NPC de la zone est dans la liste
      existing.npcs=existing.npcs||[];
      var hasIt=existing.npcs.find(function(n){return n.id===zone.npc.id;});
      if (!hasIt) existing.npcs.push(npcEntry);
    }
  });
}

// ================================================================
// LAYOUT helpers
// ================================================================
function _cW(){var c=document.getElementById('villageCanvas');return c?c.width/(window.devicePixelRatio||1):390;}
function _cH(){var c=document.getElementById('villageCanvas');return c?c.height/(window.devicePixelRatio||1):600;}
function _sp(W){return W*0.36;}
function _totW(W){return _sp(W)*(VILLAGE_ZONES.length-1)+W*0.50;}
function _zx(i,W){return W*0.23+i*_sp(W)-_st.sx;}
function _gY(H){return H*0.60;}

function _scrollTo(i,instant) {
  var W=_cW();
  var want=_zx(i,W)+_st.sx-W*0.36;
  want=Math.max(0,Math.min(want,Math.max(0,_totW(W)-W)));
  if (instant) _st.sx=want;
  _st.tx=want;
}
function _clamp(W){
  var mx=Math.max(0,_totW(W)-W);
  _st.tx=Math.max(0,Math.min(_st.tx,mx));
}
function _snap(W){
  var best=0,dist=Infinity;
  VILLAGE_ZONES.forEach(function(z,i){
    var d=Math.abs(_zx(i,W)-W*0.36);
    if(d<dist){dist=d;best=i;}
  });
  _scrollTo(best,false);
}

// ================================================================
// BOUCLE
// ================================================================
function _loop(){
  if(!window._lvLoopActive)return;
  tick++;
  _st.sx+=(_st.tx-_st.sx)*0.13;
  _render();
  requestAnimationFrame(_loop);
}

// ================================================================
// RENDU COMPLET
// ================================================================
function _render(){
  var c=document.getElementById('villageCanvas');
  if(!c){canvas=null;return;}
  canvas=c; if(!ctx)ctx=c.getContext('2d');
  var dpr=window.devicePixelRatio||1;
  var W=c.width/dpr,H=c.height/dpr;
  if(!W||!H)return;
  ctx.save(); ctx.scale(dpr,dpr);
  _rSky(W,H);
  _rSun(W,H);
  _rMountains(W,H);
  _rClouds(W,H);
  _rGround(W,H);
  _rRiver(W,H);
  _rTrees(W,H);
  _rPath(W,H);
  _rBuildings(W,H);
  _rBadges(W,H);
  _rParticles(W,H);
  ctx.restore();
}

// ── CIEL ─────────────────────────────────────────────────────────
function _rSky(W,H){
  var g=ctx.createLinearGradient(0,0,0,H*.62);
  g.addColorStop(0,'#4da8d8'); g.addColorStop(.5,'#7cc8f0'); g.addColorStop(1,'#b8e4f8');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
}

// ── SOLEIL ────────────────────────────────────────────────────────
function _rSun(W,H){
  var x=W*.80,y=H*.10;
  var hg=ctx.createRadialGradient(x,y,0,x,y,58);
  hg.addColorStop(0,'rgba(255,245,120,.30)'); hg.addColorStop(1,'rgba(255,245,120,0)');
  ctx.fillStyle=hg; ctx.fillRect(x-58,y-58,116,116);
  ctx.beginPath(); ctx.arc(x,y,20,0,Math.PI*2);
  ctx.fillStyle='#ffe84a'; ctx.fill();
  ctx.strokeStyle='rgba(255,200,0,.3)'; ctx.lineWidth=2.5; ctx.stroke();
  for(var r=0;r<8;r++){
    var a=(r/8)*Math.PI*2+tick*.0022;
    ctx.save(); ctx.globalAlpha=.5; ctx.strokeStyle='#ffd700'; ctx.lineWidth=2.2;
    ctx.beginPath(); ctx.moveTo(x+Math.cos(a)*24,y+Math.sin(a)*24); ctx.lineTo(x+Math.cos(a)*35,y+Math.sin(a)*35); ctx.stroke(); ctx.restore();
  }
}

// ── MONTAGNES ─────────────────────────────────────────────────────
function _rMountains(W,H){
  var bY=H*.548;
  [{x:W*-.02,y:H*.41,w:W*.22,c:'#72b87a',s:'#5ea068'},
   {x:W*.14, y:H*.33,w:W*.17,c:'#5ea068',s:'#4a8858'},
   {x:W*.34, y:H*.38,w:W*.19,c:'#6db872',s:'#58a060'},
   {x:W*.54, y:H*.30,w:W*.18,c:'#5ea068',s:'#4a8858'},
   {x:W*.72, y:H*.35,w:W*.17,c:'#72b87a',s:'#5ea068'},
   {x:W*.90, y:H*.29,w:W*.18,c:'#5ea068',s:'#4a8858'},
   {x:W*1.07,y:H*.34,w:W*.16,c:'#72b87a',s:'#5ea068'}
  ].forEach(function(p){
    ctx.beginPath(); ctx.moveTo(p.x-p.w*.5,bY); ctx.lineTo(p.x,p.y); ctx.lineTo(p.x-p.w*.05,bY); ctx.closePath();
    ctx.fillStyle=p.s; ctx.fill();
    ctx.beginPath(); ctx.moveTo(p.x-p.w*.05,bY); ctx.lineTo(p.x,p.y); ctx.lineTo(p.x+p.w*.5,bY); ctx.closePath();
    ctx.fillStyle=p.c; ctx.fill();
    ctx.beginPath(); ctx.moveTo(p.x-p.w*.07,p.y+p.w*.09); ctx.lineTo(p.x,p.y); ctx.lineTo(p.x+p.w*.07,p.y+p.w*.09); ctx.closePath();
    ctx.fillStyle='rgba(255,255,255,.88)'; ctx.fill();
  });
}

// ── NUAGES ────────────────────────────────────────────────────────
function _mkClouds(W,H){
  return Array.from({length:7},function(_,i){return{x:W*(0.03+i*.15),y:H*(0.05+(i%3)*.05),r:18+i*6,sp:0.08+i*.032};});
}
function _rClouds(W,H){
  _st.clouds.forEach(function(cl){
    cl.x+=cl.sp; if(cl.x>W+cl.r*3)cl.x=-cl.r*3;
    ctx.save(); ctx.globalAlpha=.92; ctx.fillStyle='#fff';
    [[cl.x,cl.y,cl.r],[cl.x+cl.r*.75,cl.y+cl.r*.12,cl.r*.72],
     [cl.x-cl.r*.68,cl.y+cl.r*.16,cl.r*.62],[cl.x+cl.r*.12,cl.y+cl.r*.40,cl.r*.88],
     [cl.x-cl.r*.30,cl.y+cl.r*.28,cl.r*.54]].forEach(function(p){
      ctx.beginPath(); ctx.arc(p[0],p[1],p[2],0,Math.PI*2); ctx.fill();
    }); ctx.restore();
  });
}

// ── SOL HERBEUX ───────────────────────────────────────────────────
function _rGround(W,H){
  var gY=_gY(H);
  var g=ctx.createLinearGradient(0,gY-10,0,H);
  g.addColorStop(0,'#6ecf5e'); g.addColorStop(.2,'#58b84a'); g.addColorStop(1,'#3a9030');
  ctx.fillStyle=g;
  ctx.beginPath(); ctx.moveTo(0,gY+6); ctx.bezierCurveTo(W*.28,gY-18,W*.68,gY+14,W,gY+4);
  ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath(); ctx.fill();
  // lisière lumineuse
  ctx.fillStyle='rgba(140,230,110,.20)';
  ctx.beginPath(); ctx.moveTo(0,gY+6); ctx.bezierCurveTo(W*.28,gY-18,W*.68,gY+14,W,gY+4);
  ctx.lineTo(W,gY+20); ctx.bezierCurveTo(W*.68,gY+30,W*.28,gY+2,0,gY+22); ctx.closePath(); ctx.fill();
  // fleurs décoratives
  [{x:.06,c:'#c084fc'},{x:.14,c:'#f1c40f'},{x:.28,c:'#ec4899'},{x:.46,c:'#f1c40f'},
   {x:.62,c:'#c084fc'},{x:.75,c:'#ec4899'},{x:.87,c:'#f1c40f'},{x:.95,c:'#c084fc'}
  ].forEach(function(f,i){
    var px=f.x*W,py=gY+8+(i%4)*6;
    ctx.beginPath(); ctx.arc(px,py,3.8,0,Math.PI*2); ctx.fillStyle=f.c; ctx.fill();
    ctx.beginPath(); ctx.arc(px,py,1.6,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();
  });
}

// ── CHEMIN ───────────────────────────────────────────────────────
function _rPath(W,H){
  var gY=_gY(H), n=VILLAGE_ZONES.length;
  function pts(){ var a=[];
    for(var i=0;i<=n;i++){
      var px=_zx(Math.min(i,n-1),W)+(i===n?_sp(W)*.32:0),py=gY+7+Math.sin(i*1.9)*H*.016;
      a.push(px,py);
    } return a;
  }
  ctx.save();
  ctx.lineCap='round'; ctx.lineJoin='round';
  var p=pts();
  // ombre portée
  ctx.strokeStyle='rgba(90,60,15,.30)'; ctx.lineWidth=W*.066;
  ctx.beginPath(); ctx.moveTo(p[0],p[1]+4);
  for(var k=2;k<p.length;k+=2) ctx.lineTo(p[k],p[k+1]+4); ctx.stroke();
  // surface sable
  ctx.strokeStyle='#cca85a'; ctx.lineWidth=W*.058;
  ctx.beginPath(); ctx.moveTo(p[0],p[1]);
  for(var k=2;k<p.length;k+=2) ctx.lineTo(p[k],p[k+1]); ctx.stroke();
  // reflet clair
  ctx.strokeStyle='rgba(220,190,130,.50)'; ctx.lineWidth=W*.024;
  ctx.beginPath(); ctx.moveTo(p[0],p[1]-1);
  for(var k=2;k<p.length;k+=2) ctx.lineTo(p[k],p[k+1]-1); ctx.stroke();
  // pierres
  ctx.fillStyle='rgba(160,120,60,.40)';
  for(var j=0;j<68;j++){
    var t=j/68,px2=t*(_totW(W)+W*.3)-_st.sx;
    if(px2<-20||px2>W+20)continue;
    var py2=gY+7+Math.sin(j*1.15)*H*.016;
    ctx.beginPath(); ctx.ellipse(px2,py2,8+j%4,3.5,j*.35,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

// ── RIVIÈRE + PONT ────────────────────────────────────────────────
function _rRiver(W,H){
  var gY=_gY(H), rx=_zx(3,W)+_sp(W)*.22;
  if(rx<-W*.20||rx>W*1.20)return;
  ctx.save();
  var wg=ctx.createLinearGradient(rx-26,0,rx+26,0);
  wg.addColorStop(0,'#3a8fc5'); wg.addColorStop(.45,'#5bbde8'); wg.addColorStop(1,'#3a8fc5');
  ctx.fillStyle=wg;
  ctx.beginPath(); ctx.moveTo(rx-24,gY-H*.08);
  ctx.bezierCurveTo(rx-30,gY+H*.02,rx+30,gY+H*.04,rx+24,H);
  ctx.bezierCurveTo(rx+34,gY+H*.04,rx-16,gY+H*.02,rx-12,gY-H*.08);
  ctx.closePath(); ctx.fill();
  ctx.globalAlpha=.26; ctx.fillStyle='#b0e4f8';
  for(var k=0;k<6;k++){ctx.fillRect(rx-6+k,gY+k*H*.046+Math.sin(tick*.022+k)*.8,13-k*1.5,2.5);}
  ctx.globalAlpha=1;
  // pont
  var by=gY+H*.038;
  ctx.shadowColor='rgba(0,0,0,.22)'; ctx.shadowBlur=8;
  ctx.fillStyle='#9a7428'; _rr(rx-34,by-8,68,14,5); ctx.fill();
  ctx.strokeStyle='#7a5810'; ctx.lineWidth=1.5; ctx.stroke(); ctx.shadowBlur=0;
  ctx.strokeStyle='#6b4a0e'; ctx.lineWidth=4;
  ctx.beginPath(); ctx.arc(rx,by+28,30,Math.PI,0); ctx.stroke();
  for(var pp=-5;pp<=5;pp++){
    ctx.fillStyle=pp%2===0?'#c09040':'#a87828';
    _rr(rx+pp*6.5-2,by-20,4,13,1); ctx.fill();
  }
  // bateau
  var bx=rx+44+Math.sin(tick*.012)*5,boY=gY+H*.066;
  ctx.fillStyle='#7a4e18'; ctx.strokeStyle='#4a2e08'; ctx.lineWidth=1.2;
  ctx.beginPath(); ctx.moveTo(bx-13,boY); ctx.lineTo(bx+13,boY); ctx.lineTo(bx+10,boY+8); ctx.lineTo(bx-10,boY+8); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.75)';
  ctx.beginPath(); ctx.moveTo(bx,boY); ctx.lineTo(bx,boY-13); ctx.lineTo(bx+11,boY-5); ctx.closePath(); ctx.fill();
  ctx.restore();
}

// ── ARBRES ────────────────────────────────────────────────────────
function _rTrees(W,H){
  var gY=_gY(H);
  var pos=[];
  for(var i=0;i<VILLAGE_ZONES.length+1;i++){
    var zx=_zx(i<VILLAGE_ZONES.length?i:VILLAGE_ZONES.length-1,W);
    pos.push({x:zx-W*.155,y:gY,s:.56},{x:zx+W*.155,y:gY,s:.50},{x:zx-W*.082,y:gY+H*.018,s:.36},{x:zx+W*.092,y:gY+H*.010,s:.42});
  }
  // moulin à vent derrière zone 4
  var mx=_zx(4,W)+W*.10;
  if(mx>-60&&mx<W+60)_rMill(mx,gY-H*.05,H);
  pos.forEach(function(t){if(t.x>-55&&t.x<W+55)_rTree(t.x,t.y,t.s,H);});
}
function _rTree(x,y,sc,H){
  var s=sc*H*.086;
  ctx.save(); ctx.globalAlpha=.16; ctx.fillStyle='#1a5a10';
  ctx.beginPath(); ctx.ellipse(x,y,s*.34,s*.08,0,0,Math.PI*2); ctx.fill(); ctx.restore();
  ctx.fillStyle='#7a4c28'; _rr(x-s*.11,y-s*.30,s*.22,s*.33,2); ctx.fill();
  ctx.strokeStyle='#5a3418'; ctx.lineWidth=.7; ctx.stroke();
  [{dy:-s*.24,r:s*.46,c:'#2a8a38'},{dy:-s*.54,r:s*.38,c:'#38a848'},{dy:-s*.80,r:s*.28,c:'#50cc5e'}].forEach(function(l){
    ctx.beginPath(); ctx.arc(x,y+l.dy,l.r,0,Math.PI*2); ctx.fillStyle=l.c; ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,.08)'; ctx.lineWidth=.5; ctx.stroke();
  });
}
function _rMill(x,y,H){
  var h=H*.145;
  ctx.fillStyle='#c8a06a'; ctx.beginPath();
  ctx.moveTo(x-h*.18,y+h); ctx.lineTo(x+h*.18,y+h); ctx.lineTo(x+h*.10,y); ctx.lineTo(x-h*.10,y); ctx.closePath(); ctx.fill();
  ctx.strokeStyle='#a07840'; ctx.lineWidth=1.5; ctx.stroke();
  ctx.fillStyle='#8e4ab8'; ctx.beginPath();
  ctx.moveTo(x-h*.14,y); ctx.lineTo(x,y-h*.28); ctx.lineTo(x+h*.14,y); ctx.closePath(); ctx.fill();
  ctx.strokeStyle='#5e2880'; ctx.lineWidth=1.2; ctx.stroke();
  ctx.fillStyle='#87ceeb'; _rr(x-h*.08,y+h*.30,h*.16,h*.18,2); ctx.fill();
  ctx.strokeStyle='#7a5010'; ctx.lineWidth=2.8;
  for(var a=0;a<4;a++){
    var ang=(a/4)*Math.PI*2+tick*.010;
    ctx.beginPath(); ctx.moveTo(x+Math.cos(ang)*2,y-h*.04+Math.sin(ang)*2);
    ctx.lineTo(x+Math.cos(ang)*h*.26,y-h*.04+Math.sin(ang)*h*.26); ctx.stroke();
  }
}

// ================================================================
// BÂTIMENTS
// ================================================================
function _rBuildings(W,H){
  var gY=_gY(H), xp=(window.S&&S.xp)||0;
  var bS=Math.min(H*.21,W*.20);

  VILLAGE_ZONES.forEach(function(zone,zi){
    var zx=_zx(zi,W);
    if(zx<-W*.50||zx>W*1.50)return;
    var unlocked=xp>=zone.xpReq;
    var hov=_st.hov===zi;
    var bob=Math.sin(tick*.018+zi*.9)*(hov?0:2.2);
    var bY=gY-bS*.52+bob;

    ctx.save();
    ctx.translate(zx,bY);
    if(hov) ctx.scale(1.065,1.065);

    if(!unlocked){
      // ── VERROUILLÉ : bâtiment fantôme + pill XP ──────────────
      ctx.globalAlpha=.38;
      _bShape(zone.type,0,0,bS,'#888','#666');
      ctx.globalAlpha=1;
      // pill XP manquant — style premium
      var need=zone.xpReq-xp;
      ctx.save();
      ctx.shadowColor='rgba(0,0,0,.50)'; ctx.shadowBlur=10; ctx.shadowOffsetY=3;
      // fond pill
      var pg=ctx.createLinearGradient(-46,-bS*.10,46,-bS*.10+28);
      pg.addColorStop(0,'rgba(20,18,28,.92)'); pg.addColorStop(1,'rgba(30,26,40,.92)');
      ctx.fillStyle=pg; _rr(-50,-bS*.14,100,30,15); ctx.fill();
      ctx.shadowBlur=0;
      ctx.strokeStyle='rgba(255,159,67,.45)'; ctx.lineWidth=1.5; _rr(-50,-bS*.14,100,30,15); ctx.stroke();
      // texte
      ctx.fillStyle='#ff9f43'; ctx.font='bold '+Math.round(bS*.175)+'px system-ui,sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('🔒  +'+need+' XP',0,-bS*.14+15);
      ctx.restore();
    } else {
      // ── DÉBLOQUÉ ─────────────────────────────────────────────
      if(hov){
        // halo glow
        ctx.save();
        var hg=ctx.createRadialGradient(0,-bS*.12,0,0,-bS*.12,bS*.75);
        hg.addColorStop(0,zone.color+'44'); hg.addColorStop(1,zone.color+'00');
        ctx.fillStyle=hg; ctx.beginPath(); ctx.arc(0,-bS*.12,bS*.75,0,Math.PI*2); ctx.fill();
        ctx.restore();
      }
      // ombre au sol
      ctx.save(); ctx.globalAlpha=.22;
      ctx.fillStyle='rgba(0,0,0,1)';
      ctx.beginPath(); ctx.ellipse(0,bS*.50,bS*.42,bS*.08,0,0,Math.PI*2); ctx.fill();
      ctx.restore();
      _bShape(zone.type,0,0,bS,zone.color,_dk(zone.color));
    }
    ctx.restore();

    // ── indicateur sol ──────────────────────────────────────────
    var si=gY+H*.038, sr=H*.029;
    ctx.save(); ctx.shadowColor='rgba(0,0,0,.28)'; ctx.shadowBlur=6;
    ctx.beginPath(); ctx.arc(zx,si,sr,0,Math.PI*2);
    ctx.fillStyle=unlocked?(zi===0?'#4ecf70':'#f9c74f'):'rgba(40,36,50,.75)'; ctx.fill();
    ctx.shadowBlur=0;
    ctx.font='bold '+(sr*1.5)+'px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle='#fff';
    ctx.fillText(unlocked?(zi===0?'✓':'★'):'🔒',zx,si+.5);
    ctx.restore();

    // ── NPC animé devant la porte ────────────────────────────────
    if(unlocked&&zone.npc){
      var npcY=gY-bS*.06+bob+Math.sin(tick*.022+zi*1.3)*1.8;
      ctx.save();
      ctx.font=Math.round(bS*.32)+'px serif'; ctx.textAlign='center'; ctx.textBaseline='bottom';
      ctx.shadowColor='rgba(0,0,0,.35)'; ctx.shadowBlur=8;
      ctx.fillText(zone.npc.emoji,zx+(hov?0:0),npcY);
      ctx.shadowBlur=0;
      if(hov){
        // bulle "Toucher pour entrer" premium
        ctx.save();
        var nl=(window.S&&S.nativeLang)||'fr';
        var lbl={fr:'Toucher pour entrer',en:'Tap to enter',es:'Toca para entrar',ht:'Touche pou antre'}[nl]||'Toucher pour entrer';
        var bw2=Math.min(170,W*.44),bh2=26;
        ctx.shadowColor='rgba(0,0,0,.40)'; ctx.shadowBlur=10; ctx.shadowOffsetY=3;
        var pill=ctx.createLinearGradient(zx-bw2/2,npcY-bS*.62,zx+bw2/2,npcY-bS*.62+bh2);
        pill.addColorStop(0,zone.color); pill.addColorStop(1,_dk(zone.color));
        ctx.fillStyle=pill; _rr(zx-bw2/2,npcY-bS*.72,bw2,bh2,13); ctx.fill();
        ctx.shadowBlur=0; ctx.strokeStyle='rgba(255,255,255,.25)'; ctx.lineWidth=1; _rr(zx-bw2/2,npcY-bS*.72,bw2,bh2,13); ctx.stroke();
        ctx.fillStyle='rgba(0,0,0,.80)'; ctx.font='bold '+(Math.round(bS*.125))+'px system-ui,sans-serif';
        ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.shadowBlur=0;
        ctx.fillText(lbl,zx,npcY-bS*.72+bh2/2);
        ctx.restore();
      }
      ctx.restore();
    }
  });
}

// ── Formes de bâtiments ────────────────────────────────────────────
function _bShape(type,x,y,s,col,dark){
  switch(type){
    case 'cottage': _bCottage(x,y,s,col,dark); break;
    case 'shop':    _bShop(x,y,s,col,dark);    break;
    case 'inn':     _bInn(x,y,s,col,dark);     break;
    case 'mansion': _bMansion(x,y,s,col,dark); break;
    case 'castle':  _bCastle(x,y,s,col,dark);  break;
  }
}

function _bCottage(x,y,s,col,dark){
  var w=s*.72,h=s*.56,rh=s*.46;
  ctx.shadowColor='rgba(0,0,0,.28)'; ctx.shadowBlur=12; ctx.shadowOffsetY=5;
  // murs
  var wg=ctx.createLinearGradient(x-w/2,y-h,x+w/2,y); wg.addColorStop(0,'#f8e8c0'); wg.addColorStop(1,'#e8d0a0');
  ctx.fillStyle=wg; _rr(x-w/2,y-h,w,h,5); ctx.fill();
  ctx.shadowBlur=0; ctx.strokeStyle='#c0a070'; ctx.lineWidth=1.5; ctx.stroke();
  // toit chaume
  var rg=ctx.createLinearGradient(x,y-h,x,y-h-rh); rg.addColorStop(0,col); rg.addColorStop(1,_lt(col));
  ctx.fillStyle=rg;
  ctx.beginPath(); ctx.moveTo(x-w/2-s*.06,y-h+2); ctx.lineTo(x,y-h-rh); ctx.lineTo(x+w/2+s*.06,y-h+2); ctx.closePath(); ctx.fill();
  ctx.strokeStyle=dark; ctx.lineWidth=1.5; ctx.stroke();
  // textures toit
  ctx.save(); ctx.globalAlpha=.18; ctx.strokeStyle='#fff'; ctx.lineWidth=.8;
  for(var ti=0;ti<4;ti++){var tf=ti/4;ctx.beginPath();ctx.moveTo(x-w/2*(1-tf)+x*0,y-h-rh*tf);ctx.lineTo(x+w/2*(1-tf),y-h-rh*tf);ctx.stroke();}
  ctx.restore();
  // fenêtres
  [x-w*.27,x+w*.05].forEach(function(wx){
    var wg2=ctx.createLinearGradient(wx,y-h*.72,wx,y-h*.40); wg2.addColorStop(0,'#c8eeff'); wg2.addColorStop(1,'#a0d8f0');
    ctx.fillStyle=wg2; _rr(wx,y-h*.70,w*.24,h*.31,2); ctx.fill();
    ctx.strokeStyle='#78a8c0'; ctx.lineWidth=.8; ctx.stroke();
    ctx.save(); ctx.strokeStyle='rgba(255,255,255,.55)'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(wx+w*.12,y-h*.70); ctx.lineTo(wx+w*.12,y-h*.70+h*.31); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(wx,y-h*.70+h*.155); ctx.lineTo(wx+w*.24,y-h*.70+h*.155); ctx.stroke();
    ctx.restore();
  });
  // porte
  ctx.fillStyle='#7a4a28'; _rr(x-w*.13,y-h*.44,w*.26,h*.44,s*.04); ctx.fill();
  ctx.strokeStyle='#5a3018'; ctx.lineWidth=1.2; ctx.stroke();
  ctx.beginPath(); ctx.arc(x+w*.04,y-h*.22,2.8,0,Math.PI*2); ctx.fillStyle='#f0c050'; ctx.fill();
  // cheminée + fumée
  ctx.fillStyle='#b89060'; ctx.fillRect(x+w*.16,y-h-rh+rh*.16,s*.11,s*.27);
  for(var fi=0;fi<3;fi++){ctx.save();ctx.globalAlpha=.20-fi*.04;ctx.beginPath();ctx.arc(x+w*.22,y-h-rh-fi*10+Math.sin(tick*.028+fi)*3,5+fi*2.5,0,Math.PI*2);ctx.fillStyle='#ccc';ctx.fill();ctx.restore();}
}

function _bShop(x,y,s,col,dark){
  var w=s*.76,h=s*.60;
  ctx.shadowColor='rgba(0,0,0,.25)'; ctx.shadowBlur=12; ctx.shadowOffsetY=5;
  var wg=ctx.createLinearGradient(x-w/2,y-h,x+w/2,y); wg.addColorStop(0,'#f2e4c2'); wg.addColorStop(1,'#e2d0a0');
  ctx.fillStyle=wg; _rr(x-w/2,y-h,w,h,5); ctx.fill();
  ctx.shadowBlur=0; ctx.strokeStyle='#c0a060'; ctx.lineWidth=1.5; ctx.stroke();
  // auvent
  var ag=ctx.createLinearGradient(0,y-h-s*.07,0,y-h); ag.addColorStop(0,_lt(col)); ag.addColorStop(1,col);
  ctx.fillStyle=ag; _rr(x-w/2-5,y-h-s*.07,w+10,s*.13,4); ctx.fill();
  ctx.save(); ctx.beginPath(); _rr(x-w/2-5,y-h-s*.07,w+10,s*.13,4); ctx.clip();
  ctx.fillStyle='rgba(255,255,255,.30)';
  for(var ai=0;ai<8;ai++)ctx.fillRect(x-w/2-5+ai*(w+10)/8,y-h-s*.07,(w+10)/16,s*.13);
  ctx.restore();
  ctx.strokeStyle=dark; ctx.lineWidth=1.5; _rr(x-w/2-5,y-h-s*.07,w+10,s*.13,4); ctx.stroke();
  // enseigne
  ctx.shadowColor='rgba(0,0,0,.20)'; ctx.shadowBlur=6;
  ctx.fillStyle='#f9c74f'; _rr(x-w*.32,y-h*.90,w*.64,h*.22,4); ctx.fill();
  ctx.shadowBlur=0; ctx.strokeStyle='#c89820'; ctx.lineWidth=.8; ctx.stroke();
  // fenêtres
  [x-w*.28,x+w*.06].forEach(function(wx){
    var fg=ctx.createLinearGradient(wx,y-h*.64,wx,y-h*.36); fg.addColorStop(0,'#c8eeff'); fg.addColorStop(1,'#a0d8f0');
    ctx.fillStyle=fg; _rr(wx,y-h*.62,w*.22,h*.28,2); ctx.fill();
    ctx.strokeStyle='#78a8c0'; ctx.lineWidth=.8; ctx.stroke();
  });
  // porte
  ctx.fillStyle='#7a4a28'; _rr(x-w*.10,y-h*.42,w*.20,h*.42,3); ctx.fill();
  ctx.strokeStyle='#5a3018'; ctx.lineWidth=1.2; ctx.stroke();
  ctx.beginPath(); ctx.arc(x+w*.04,y-h*.20,2.5,0,Math.PI*2); ctx.fillStyle='#f0c050'; ctx.fill();
  // décor panier
  ctx.fillStyle='#b08040'; _rr(x-w*.44,y-h*.12,w*.18,h*.14,2); ctx.fill();
  ctx.strokeStyle='#806020'; ctx.lineWidth=.8; ctx.stroke();
}

function _bInn(x,y,s,col,dark){
  var w=s*.82,h=s*.68,rh=s*.40;
  ctx.shadowColor='rgba(0,0,0,.25)'; ctx.shadowBlur=12; ctx.shadowOffsetY=5;
  var wg=ctx.createLinearGradient(x-w/2,y-h,x,y); wg.addColorStop(0,'#e0ceaa'); wg.addColorStop(1,'#ceba90');
  ctx.fillStyle=wg; _rr(x-w/2,y-h,w,h,5); ctx.fill();
  ctx.shadowBlur=0; ctx.strokeStyle='#a89060'; ctx.lineWidth=1.5; ctx.stroke();
  var rg=ctx.createLinearGradient(x,y-h,x,y-h-rh); rg.addColorStop(0,col); rg.addColorStop(1,_lt(col));
  ctx.fillStyle=rg; ctx.beginPath(); ctx.moveTo(x-w/2-7,y-h+3); ctx.lineTo(x,y-h-rh); ctx.lineTo(x+w/2+7,y-h+3); ctx.closePath(); ctx.fill();
  ctx.strokeStyle=dark; ctx.lineWidth=1.5; ctx.stroke();
  // horloge
  ctx.shadowColor='rgba(0,0,0,.18)'; ctx.shadowBlur=5;
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(x,y-h-rh*.42,s*.095,0,Math.PI*2); ctx.fill();
  ctx.shadowBlur=0; ctx.strokeStyle='#bbb'; ctx.lineWidth=.8; ctx.stroke();
  ctx.strokeStyle='#333'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(x,y-h-rh*.42); ctx.lineTo(x,y-h-rh*.42-s*.062); ctx.stroke();
  ctx.strokeStyle='#666'; ctx.lineWidth=1.1; ctx.beginPath(); ctx.moveTo(x,y-h-rh*.42); ctx.lineTo(x+s*.040,y-h-rh*.42+s*.020); ctx.stroke();
  // 3 fenêtres
  [-w*.28,0,w*.28].forEach(function(ox){
    var fg=ctx.createLinearGradient(x+ox-w*.10,y-h*.64,x+ox,y-h*.34); fg.addColorStop(0,'#c8eeff'); fg.addColorStop(1,'#a0d8f0');
    ctx.fillStyle=fg; _rr(x+ox-w*.10,y-h*.62,w*.20,h*.28,2); ctx.fill();
    ctx.strokeStyle='#78a8c0'; ctx.lineWidth=.8; ctx.stroke();
    ctx.save(); ctx.strokeStyle='rgba(255,255,255,.45)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(x+ox,y-h*.62); ctx.lineTo(x+ox,y-h*.62+h*.28); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+ox-w*.10,y-h*.62+h*.14); ctx.lineTo(x+ox+w*.10,y-h*.62+h*.14); ctx.stroke();
    ctx.restore();
  });
  // porte arrondie
  ctx.fillStyle='#4a2e10'; _rr(x-w*.14,y-h*.40,w*.28,h*.40,s*.05); ctx.fill();
  ctx.strokeStyle='#2a1808'; ctx.lineWidth=1.2; ctx.stroke();
  ctx.fillStyle='#9a7030'; ctx.fillRect(x-w*.40,y-h*.08,w*.22,s*.04); ctx.fillRect(x+w*.18,y-h*.08,w*.22,s*.04);
}

function _bMansion(x,y,s,col,dark){
  var w=s*.90,h=s*.78,rh=s*.48;
  ctx.shadowColor='rgba(0,0,0,.28)'; ctx.shadowBlur=14; ctx.shadowOffsetY=6;
  var wg=ctx.createLinearGradient(x-w/2,y-h,x,y); wg.addColorStop(0,'#ecdcb8'); wg.addColorStop(1,'#d8c8a0');
  ctx.fillStyle=wg; _rr(x-w/2,y-h,w,h,5); ctx.fill();
  ctx.shadowBlur=0; ctx.strokeStyle='#b0a070'; ctx.lineWidth=1.5; ctx.stroke();
  var rg=ctx.createLinearGradient(x,y-h,x,y-h-rh); rg.addColorStop(0,col); rg.addColorStop(1,_lt(col));
  ctx.fillStyle=rg; ctx.beginPath(); ctx.moveTo(x-w/2-8,y-h+3); ctx.lineTo(x,y-h-rh); ctx.lineTo(x+w/2+8,y-h+3); ctx.closePath(); ctx.fill();
  ctx.strokeStyle=dark; ctx.lineWidth=1.5; ctx.stroke();
  // tour gauche
  var tw=s*.22,th=h*.65;
  ctx.fillStyle=_dk(col,-.06); _rr(x-w/2,y-th,tw,th,3); ctx.fill(); ctx.strokeStyle=dark; ctx.lineWidth=1; ctx.stroke();
  ctx.fillStyle=_lt(col);
  ctx.beginPath(); ctx.moveTo(x-w/2,y-th); ctx.lineTo(x-w/2+tw/2,y-th-rh*.50); ctx.lineTo(x-w/2+tw,y-th); ctx.closePath(); ctx.fill();
  // fenêtres
  [-w*.28,0,w*.28].forEach(function(ox){
    var fg=ctx.createLinearGradient(x+ox-w*.10,y-h*.60,x+ox,y-h*.32); fg.addColorStop(0,'#c8eeff'); fg.addColorStop(1,'#a0d8f0');
    ctx.fillStyle=fg; _rr(x+ox-w*.10,y-h*.58,w*.20,h*.28,2); ctx.fill(); ctx.strokeStyle='#78a8c0'; ctx.lineWidth=.8; ctx.stroke();
  });
  ctx.fillStyle='#3a2010'; _rr(x-w*.14,y-h*.40,w*.28,h*.40,s*.05); ctx.fill();
  ctx.strokeStyle='#1a1008'; ctx.lineWidth=1.2; ctx.stroke();
  ctx.beginPath(); ctx.arc(x+w*.04,y-h*.20,2.5,0,Math.PI*2); ctx.fillStyle='#f0c050'; ctx.fill();
}

function _bCastle(x,y,s,col,dark){
  var w=s*1.0,h=s*.88;
  ctx.shadowColor='rgba(0,0,0,.30)'; ctx.shadowBlur=16; ctx.shadowOffsetY=7;
  var wg=ctx.createLinearGradient(x-w/2,y-h,x,y); wg.addColorStop(0,'#d4c4a4'); wg.addColorStop(1,'#c0b090');
  ctx.fillStyle=wg; _rr(x-w/2,y-h,w,h,4); ctx.fill();
  ctx.shadowBlur=0; ctx.strokeStyle='#a09070'; ctx.lineWidth=1.5; ctx.stroke();
  var tw=s*.24,th=h*.68;
  [-w/2+tw*.06,w/2-tw*1.06].forEach(function(tx){
    ctx.fillStyle='#c4b48c'; _rr(x+tx,y-th,tw,th,3); ctx.fill(); ctx.strokeStyle='#907860'; ctx.lineWidth=1.2; ctx.stroke();
    for(var cr=0;cr<3;cr++)ctx.fillRect(x+tx+cr*tw/3+1,y-th-s*.07,tw/3.8,s*.07);
    // toit tour
    var tg=ctx.createLinearGradient(x+tx,y-th,x+tx+tw/2,y-th-s*.34); tg.addColorStop(0,col); tg.addColorStop(1,_lt(col));
    ctx.fillStyle=tg; ctx.beginPath(); ctx.moveTo(x+tx,y-th); ctx.lineTo(x+tx+tw/2,y-th-s*.36); ctx.lineTo(x+tx+tw,y-th); ctx.closePath(); ctx.fill();
    ctx.strokeStyle=dark; ctx.lineWidth=1.2; ctx.stroke();
    // drapeau
    ctx.strokeStyle=dark; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(x+tx+tw/2,y-th-s*.36); ctx.lineTo(x+tx+tw/2,y-th-s*.52); ctx.stroke();
    ctx.fillStyle=col; ctx.beginPath(); ctx.moveTo(x+tx+tw/2,y-th-s*.52); ctx.lineTo(x+tx+tw/2+s*.10,y-th-s*.44); ctx.lineTo(x+tx+tw/2,y-th-s*.36); ctx.closePath(); ctx.fill();
    // fenêtre tour
    var fg=ctx.createLinearGradient(0,0,0,10); fg.addColorStop(0,'#c8eeff'); fg.addColorStop(1,'#a0d8f0');
    ctx.fillStyle=fg; _rr(x+tx+tw*.22,y-th+th*.22,tw*.56,th*.22,2); ctx.fill(); ctx.strokeStyle='#78a8c0'; ctx.lineWidth=.8; ctx.stroke();
  });
  for(var cr2=0;cr2<7;cr2++)ctx.fillRect(x-w*.38+cr2*w*.115,y-h-s*.075,w*.08,s*.075);
  // fenêtres corps
  [-w*.26,0,w*.26].forEach(function(ox){
    var fg=ctx.createLinearGradient(0,0,0,10); fg.addColorStop(0,'#c8eeff'); fg.addColorStop(1,'#a0d8f0');
    ctx.fillStyle=fg; _rr(x+ox-w*.09,y-h*.55,w*.18,h*.28,2); ctx.fill(); ctx.strokeStyle='#78a8c0'; ctx.lineWidth=.8; ctx.stroke();
  });
  // grande porte arc
  ctx.fillStyle='#2a1808';
  ctx.beginPath(); ctx.moveTo(x-w*.14,y-h*.40); ctx.lineTo(x+w*.14,y-h*.40);
  ctx.arc(x,y-h*.40,w*.14,0,Math.PI,true); ctx.closePath(); ctx.fill();
  ctx.strokeStyle='rgba(100,80,40,.5)'; ctx.lineWidth=1.8;
  for(var hb=0;hb<4;hb++){ctx.beginPath();ctx.moveTo(x-w*.09+hb*w*.06,y-h*.40);ctx.lineTo(x-w*.09+hb*w*.06,y-h*.40-h*.22);ctx.stroke();}
  // étoile couronne
  ctx.font=Math.round(s*.16)+'px serif'; ctx.textAlign='center'; ctx.textBaseline='bottom';
  ctx.shadowColor='rgba(0,0,0,.3)'; ctx.shadowBlur=6; ctx.fillText('⭐',x+w/2-s*.05,y-h-s*.04); ctx.shadowBlur=0;
}

// ── BADGES ────────────────────────────────────────────────────────
function _rBadges(W,H){
  var xp=(window.S&&S.xp)||0, nl=(window.S&&S.nativeLang)||'fr';
  VILLAGE_ZONES.forEach(function(zone,zi){
    var zx=_zx(zi,W);
    if(zx<-W*.50||zx>W*1.50)return;
    var unlocked=xp>=zone.xpReq, hov=_st.hov===zi;
    var by=H*.055, bw=Math.min(W*.26,110), bh=48;

    ctx.save();
    ctx.shadowColor='rgba(0,0,0,.35)'; ctx.shadowBlur=10; ctx.shadowOffsetY=4;
    if(unlocked){
      var bg=ctx.createLinearGradient(zx-bw/2,by,zx+bw/2,by+bh);
      bg.addColorStop(0,_lt(zone.color,.15)); bg.addColorStop(1,zone.color);
      ctx.fillStyle=bg;
    } else {
      ctx.fillStyle='rgba(38,36,50,.85)';
    }
    _rr(zx-bw/2,by,bw,bh,12); ctx.fill(); ctx.shadowBlur=0;
    if(hov&&unlocked){ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=1.8;_rr(zx-bw/2,by,bw,bh,12);ctx.stroke();}
    // cercle numéro
    ctx.fillStyle='rgba(0,0,0,.28)'; ctx.beginPath(); ctx.arc(zx-bw/2+18,by+bh/2,13.5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#fff'; ctx.font='bold '+Math.round(H*.021)+'px system-ui,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(zone.num,zx-bw/2+18,by+bh/2);
    // labels
    ctx.fillStyle=unlocked?'rgba(0,0,0,.80)':'rgba(255,255,255,.55)';
    ctx.font='bold '+Math.round(H*.018)+'px system-ui,sans-serif'; ctx.textAlign='left'; ctx.textBaseline='alphabetic';
    ctx.fillText(zone.label[nl]||zone.label.fr,zx-bw/2+38,by+bh*.42);
    ctx.fillStyle=unlocked?'rgba(0,0,0,.50)':'rgba(255,255,255,.32)';
    ctx.font=Math.round(H*.013)+'px system-ui,sans-serif';
    ctx.fillText(zone.sub[nl]||zone.sub.fr,zx-bw/2+38,by+bh*.74);
    // ligne pointillée vers bâtiment
    ctx.strokeStyle=unlocked?zone.color:'rgba(150,150,150,.22)';
    ctx.lineWidth=1.8; ctx.setLineDash([5,5]); ctx.globalAlpha=.45;
    ctx.beginPath(); ctx.moveTo(zx,by+bh); ctx.lineTo(zx,_gY(H)-H*.32); ctx.stroke();
    ctx.setLineDash([]); ctx.globalAlpha=1;
    ctx.restore();
  });
}

// ── PARTICULES ────────────────────────────────────────────────────
function _rParticles(W,H){
  if(tick%16===0&&_st.ptcl.length<20){
    _st.ptcl.push({x:Math.random()*W,y:_gY(H)-Math.random()*H*.22,vx:(Math.random()-.5)*.55,vy:-.35-Math.random()*.45,life:1,decay:.013,r:1.8+Math.random()*3,color:['#4ecf70','#f9c74f','#ff9f43','#4a9eff','#e040fb'][0|Math.random()*5]});
  }
  _st.ptcl=_st.ptcl.filter(function(p){
    p.x+=p.vx;p.y+=p.vy;p.life-=p.decay;if(p.life<=0)return false;
    ctx.save();ctx.globalAlpha=p.life*.45;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.color;ctx.fill();ctx.restore();
    return true;
  });
}

// ================================================================
// EVENTS
// ================================================================
function _tstart(e){
  e.preventDefault();
  var t=e.touches[0];
  _st.touch=true; _st.tx0=t.clientX; _st.stx0=_st.tx; _st.ttime=Date.now(); _st.tmoved=false;
  document.getElementById('villageCanvas').style.cursor='grabbing';
}
function _tmove(e){
  e.preventDefault();
  var dx=_st.tx0-e.touches[0].clientX;
  if(Math.abs(dx)>8){_st.tmoved=true;}
  var W=_cW();
  _st.tx=_st.stx0+dx; _clamp(W);
  // hover sur touch
  var c=document.getElementById('villageCanvas');
  if(c){var rect=c.getBoundingClientRect(),mx=e.touches[0].clientX-rect.left,my=e.touches[0].clientY-rect.top;_st.hov=_hit(mx,my,W,_cH());}
}
function _tend(e){
  document.getElementById('villageCanvas').style.cursor='grab';
  var elapsed=Date.now()-_st.ttime;
  var W=_cW();
  if(!_st.tmoved&&elapsed<320&&e.changedTouches.length){
    var c=document.getElementById('villageCanvas');
    if(c){var rect=c.getBoundingClientRect(),mx=e.changedTouches[0].clientX-rect.left,my=e.changedTouches[0].clientY-rect.top;var hit=_hit(mx,my,W,_cH());if(hit!==null)_click(hit);}
  } else {
    _snap(W);
  }
  _st.touch=false;
}
function _mdown(e){_st.drag=true;_st.dx0=e.clientX;_st.sx0=_st.tx;document.getElementById('villageCanvas').style.cursor='grabbing';}
function _mmove(e){
  var c=document.getElementById('villageCanvas');if(!c)return;
  var dpr=window.devicePixelRatio||1,W=c.width/dpr,H=c.height/dpr;
  if(_st.drag){_st.tx=_st.sx0+(_st.dx0-e.clientX);_clamp(W);}
  var rect=c.getBoundingClientRect();
  _st.hov=_hit(e.clientX-rect.left,e.clientY-rect.top,W,H);
  c.style.cursor=_st.hov!==null?'pointer':(_st.drag?'grabbing':'grab');
}
function _mup(e){
  if(_st.drag){
    _st.drag=false;
    var c=document.getElementById('villageCanvas');if(c)c.style.cursor='grab';
    var W=_cW(); _snap(W);
    // aussi détecter click souris
    if(Math.abs((e.clientX||0)-(_st.dx0||0))<10){
      var cc=document.getElementById('villageCanvas');
      if(cc){var rect=cc.getBoundingClientRect();var hit=_hit(e.clientX-rect.left,e.clientY-rect.top,W,_cH());if(hit!==null)_click(hit);}
    }
  }
}

function _hit(mx,my,W,H){
  var gY=_gY(H),bS=Math.min(H*.21,W*.20),res=null;
  VILLAGE_ZONES.forEach(function(z,i){
    var zx=_zx(i,W),bY=gY-bS*.52;
    if(Math.abs(mx-zx)<bS*.60&&Math.abs(my-bY)<bS*.80)res=i;
  });
  return res;
}

function _click(zi){
  var zone=VILLAGE_ZONES[zi]; if(!zone)return;
  var xp=(window.S&&S.xp)||0;
  if(xp<zone.xpReq){if(typeof showNotif==='function')showNotif('🔒 Il te faut '+(zone.xpReq-xp)+' XP de plus !');return;}
  // burst de particules
  var W=_cW(),H=_cH(),gY=_gY(H),zx=_zx(zi,W);
  for(var i=0;i<14;i++){_st.ptcl.push({x:zx+(Math.random()-.5)*40,y:gY-H*.22,vx:(Math.random()-.5)*3.5,vy:-2.5-Math.random()*2,life:1,decay:.025,r:3+Math.random()*4.5,color:zone.color});}
  openLocation(zone.id);
}

// ================================================================
// openLocation — CORRIGÉ
// Injecte les NPCs dans LOCATIONS puis affiche screen-location
// ================================================================
function openLocation(zoneId){
  var zone=VILLAGE_ZONES.find(function(z){return z.id===zoneId;});
  if(!zone)return;
  var xp=(window.S&&S.xp)||0;
  if(xp<zone.xpReq){if(typeof showNotif==='function')showNotif('🔒 Il te faut '+(zone.xpReq-xp)+' XP de plus !');return;}

  // ── 1. Mettre à jour LOCATIONS pour que openDialogue() fonctionne ──
  _syncLocations();

  // ── 2. Construire l'UI de l'écran-location ────────────────────────
  var nl=(window.S&&S.nativeLang)||'fr';
  var locTitle=document.getElementById('locTitle');
  if(locTitle)locTitle.textContent=(zone.label[nl]||zone.label.fr)+' — '+(zone.sub[nl]||zone.sub.fr);

  var npcList=document.getElementById('npcList');
  if(npcList){
    var npc=zone.npc;
    var role=typeof npc.role==='object'?(npc.role[nl]||npc.role.en):npc.role;
    var enterLabel={fr:'Parler',en:'Talk',es:'Hablar',ht:'Pale'}[nl]||'Parler';
    npcList.innerHTML=
      '<div style="padding:18px 16px 6px;font-size:.72rem;color:rgba(255,215,0,.55);font-weight:800;text-transform:uppercase;letter-spacing:.08em;">Personnages</div>'+
      '<div onclick="openDialogue(\''+zone.id+'\',\''+npc.id+'\')" style="'+
        'display:flex;align-items:center;gap:16px;padding:16px;margin:0 12px 12px;'+
        'background:rgba(255,255,255,.04);border:1px solid rgba(255,215,0,.14);'+
        'border-radius:16px;cursor:pointer;-webkit-tap-highlight-color:transparent;'+
        'transition:background .18s,border-color .18s;active:background:rgba(255,215,0,.08);"'+
        ' ontouchstart="this.style.background=\'rgba(255,215,0,.08)\';this.style.borderColor=\'rgba(255,215,0,.35)\'"'+
        ' ontouchend="this.style.background=\'\';this.style.borderColor=\'\'"'+
        ' onmouseenter="this.style.background=\'rgba(255,215,0,.06)\'"'+
        ' onmouseleave="this.style.background=\'\'"'+
      '>'+
        '<div style="font-size:3.0rem;line-height:1;flex-shrink:0;filter:drop-shadow(0 2px 6px rgba(0,0,0,.4))">'+npc.emoji+'</div>'+
        '<div style="flex:1;min-width:0">'+
          '<div style="font-weight:800;font-size:1.02rem;color:#e8e0d0;margin-bottom:2px">'+npc.name+'</div>'+
          '<div style="font-size:.78rem;color:rgba(255,215,0,.70);margin-bottom:5px">'+role+'</div>'+
          '<div style="font-size:.68rem;color:rgba(255,255,255,.32)">Touchez pour commencer la conversation</div>'+
        '</div>'+
        '<div style="flex-shrink:0;background:'+zone.color+';color:rgba(0,0,0,.75);font-size:.72rem;font-weight:800;padding:6px 14px;border-radius:20px;">'+enterLabel+'</div>'+
      '</div>'+
      '<div style="padding:0 12px 12px">'+
        '<button onclick="window._navTo&&_navTo(\'lessons\')" style="'+
          'width:100%;padding:13px;background:rgba(78,207,112,.08);'+
          'border:1px solid rgba(78,207,112,.25);border-radius:14px;'+
          'color:#4ecf70;font-weight:700;font-size:.88rem;cursor:pointer;'+
          'font-family:var(--font-body,system-ui);-webkit-tap-highlight-color:transparent;">'+
          '📖 Voir les leçons associées'+
        '</button>'+
      '</div>';
  }

  // ── 3. Afficher l'écran ───────────────────────────────────────────
  if(typeof showScreen==='function')showScreen('screen-location');
  else{
    document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active');});
    var sl=document.getElementById('screen-location');if(sl)sl.classList.add('active');
  }
}
window.openLocation=openLocation;

// ================================================================
// BARRE NAV — CORRIGÉE
// ================================================================
function _buildNav(){
  var old=document.querySelector('.village-nav-bar');if(old)old.remove();
  var vs=document.getElementById('screen-village');if(!vs)return;

  var nav=document.createElement('div');
  nav.className='village-nav-bar';
  nav.innerHTML=
    '<button class="vnb active" onclick="_navTo(\'village\')" id="vnb-village"><span class="vnb-i">🏘️</span><span class="vnb-l">Village</span></button>'+
    '<button class="vnb" onclick="_navTo(\'lessons\')" id="vnb-lessons"><span class="vnb-i">📖</span><span class="vnb-l">Leçons</span></button>'+
    '<button class="vnb" onclick="_navTo(\'practice\')" id="vnb-practice"><span class="vnb-i">🎤</span><span class="vnb-l">Pratique</span></button>'+
    '<button class="vnb" onclick="_navTo(\'challenges\')" id="vnb-challenges"><span class="vnb-i">🏆</span><span class="vnb-l">Défis</span></button>'+
    '<button class="vnb" onclick="_navTo(\'profile\')" id="vnb-profile"><span class="vnb-i">👤</span><span class="vnb-l">Profil</span></button>';
  vs.appendChild(nav);

  if(!document.getElementById('vnb-style')){
    var st=document.createElement('style');st.id='vnb-style';
    st.textContent=
      '.village-nav-bar{flex-shrink:0;display:flex;align-items:stretch;justify-content:space-around;'+
        'background:#fff;border-top:1px solid rgba(0,0,0,.10);'+
        'padding:7px 0 max(10px,env(safe-area-inset-bottom));z-index:40;'+
        'box-shadow:0 -3px 24px rgba(0,0,0,.12);}'+
      '.vnb{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;'+
        'gap:3px;background:none;border:none;color:rgba(0,0,0,.35);'+
        'padding:6px 0 2px;cursor:pointer;transition:color .16s,transform .12s;'+
        '-webkit-tap-highlight-color:transparent;user-select:none;}'+
      '.vnb.active{color:#27ae60;}'+
      '.vnb:active{transform:scale(.87);}'+
      '.vnb-i{font-size:1.48rem;line-height:1;transition:transform .16s;}'+
      '.vnb.active .vnb-i{transform:scale(1.24);}'+
      '.vnb-l{font-size:.60rem;font-weight:700;letter-spacing:.01em;}';
    document.head.appendChild(st);
  }
}

window._navTo=function(section){
  document.querySelectorAll('.vnb').forEach(function(b){b.classList.remove('active');});
  var btn=document.getElementById('vnb-'+section);if(btn)btn.classList.add('active');
  switch(section){
    case 'village': break;

    // ✅ FIX : 'screen-lesson' n'existe pas → 'screen-vocab'
    case 'lessons':
      if(typeof showScreen==='function'){
        showScreen('screen-vocab');
        try{if(typeof loadVocab==='function')loadVocab(Object.keys(typeof VOCAB!=='undefined'?VOCAB:{})[0]||'verbes');}catch(e){}
      } else if(typeof showNotif==='function') showNotif('📖 Leçons');
      break;

    case 'practice':
      if(typeof openFlashcards==='function')openFlashcards();
      else if(typeof showNotif==='function')showNotif('🎤 Pratique');
      break;

    case 'challenges':
      if(typeof showDetailedStats==='function')showDetailedStats();
      else if(typeof showNotif==='function')showNotif('🏆 Défis');
      break;

    case 'profile':
      if(typeof showScreen==='function')showScreen('screen-profile');
      else if(typeof showNotif==='function')showNotif('👤 Profil');
      break;
  }
};

// ================================================================
// UTILITAIRES
// ================================================================
function _rr(x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
}
function _dk(hex,ex){
  ex=ex||-0.28;
  var c=hex.replace('#','');if(c.length===3)c=c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
  var r=parseInt(c.slice(0,2),16),g=parseInt(c.slice(2,4),16),b=parseInt(c.slice(4,6),16);
  return 'rgb('+Math.max(0,Math.min(255,0|r+r*ex))+','+Math.max(0,Math.min(255,0|g+g*ex))+','+Math.max(0,Math.min(255,0|b+b*ex))+')';
}
function _lt(hex,ex){return _dk(hex,ex===undefined?.18:ex);}

// ================================================================
// COMPAT / EXPORTS
// ================================================================
function setWeather(w){window.currentWeather=w||'sun';}
function updateTime(){var el=document.getElementById('hudTime');if(el){var n=new Date();el.textContent=n.getHours().toString().padStart(2,'0')+':'+n.getMinutes().toString().padStart(2,'0');}}
function initCanvas(){_initCanvas();}
function drawVillage(){_render();}
function alignLocationsToRings(){}

window.goVillage=goVillage;
window.setWeather=setWeather;
window.updateTime=updateTime;
window.initCanvas=initCanvas;
window.drawVillage=drawVillage;
window.alignLocationsToRings=alignLocationsToRings;
window.openLocation=openLocation;

console.log('✅ village.js v3 FINAL — openLocation+lessons+design OK');
