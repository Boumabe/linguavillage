// LinguaVillage — player.js
// Système joueur : maison, personnage animé, marche d'un lieu à l'autre
// Modifier ici pour changer l'apparence ou la vitesse du personnage

const HOME = { x:0.50, y:0.50 };
const player = {
  x:HOME.x, y:HOME.y,
  dest:null, destName:'', onArrival:null,
  walking:false, speed:0.005, currentLoc:'home'
};
function startPlayerWalk(destX,destY,destName,onArrival){
  var dx=destX-player.x, dy=destY-player.y;
  if(Math.sqrt(dx*dx+dy*dy)<0.04){ if(onArrival)onArrival(); return; }
  player.dest={x:destX,y:destY}; player.destName=destName;
  player.onArrival=onArrival; player.walking=true;
}
function updatePlayer(){
  if(!player.dest)return;
  var dx=player.dest.x-player.x, dy=player.dest.y-player.y;
  var dist=Math.sqrt(dx*dx+dy*dy);
  if(dist<player.speed*1.5){
    player.x=player.dest.x; player.y=player.dest.y;
    player.dest=null; player.walking=false;
    var cb=player.onArrival; player.onArrival=null;
    if(cb)cb();
  } else { player.x+=(dx/dist)*player.speed; player.y+=(dy/dist)*player.speed; }
}
function playerGoHome(){
  startPlayerWalk(HOME.x,HOME.y,'Maison',function(){ player.currentLoc='home'; });
}
function roundRect(x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.arcTo(x+w,y,x+w,y+r,r);
  ctx.lineTo(x+w,y+h-r); ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
  ctx.lineTo(x+r,y+h); ctx.arcTo(x,y+h,x,y+h-r,r);
  ctx.lineTo(x,y+r); ctx.arcTo(x,y,x+r,y,r);
  ctx.closePath();
}
function drawPlayerHome(cx,cy,W){
  var hw=W*0.10, hh=W*0.10;
  var hx=cx-hw/2, hy=cy-hh/2;
  if(player.currentLoc==='home'){
    var pulse=0.5+0.5*Math.sin(tick*0.05);
    ctx.beginPath(); ctx.arc(cx,cy,hw*0.75,0,Math.PI*2);
    ctx.fillStyle='rgba(255,215,0,'+(0.05+0.05*pulse)+')'; ctx.fill();
  }
  ctx.fillStyle='#2a1a0a'; ctx.fillRect(hx,hy,hw,hh);
  ctx.strokeStyle='#c0a060'; ctx.lineWidth=2; ctx.strokeRect(hx,hy,hw,hh);
  ctx.beginPath();
  ctx.moveTo(hx-3,hy); ctx.lineTo(cx,hy-hh*0.55); ctx.lineTo(hx+hw+3,hy);
  ctx.fillStyle='#7a3a10'; ctx.fill();
  ctx.strokeStyle='#c07030'; ctx.lineWidth=1.5; ctx.stroke();
  var lit=player.currentLoc==='home'?'rgba(255,230,100,0.85)':'rgba(255,200,80,0.3)';
  ctx.fillStyle=lit;
  ctx.fillRect(hx+hw*0.15,hy+hh*0.18,hw*0.27,hh*0.27);
  ctx.fillRect(hx+hw*0.55,hy+hh*0.18,hw*0.27,hh*0.27);
  ctx.fillStyle='#5a3010'; ctx.fillRect(hx+hw*0.35,hy+hh*0.52,hw*0.30,hh*0.48);
  ctx.font='bold '+Math.max(9,W*0.024)+'px Nunito,sans-serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillStyle='rgba(255,215,0,0.95)';
  ctx.fillText('🏠 '+(window.S&&S.playerName||''),cx,hy-hh*0.72);
}
function drawPlayerCharacter(W,H){
  var px=player.x*W, py=player.y*H;
  var r=Math.max(13,W*0.034);
  var bob=player.walking?Math.sin(tick*0.25)*3:0;
  ctx.beginPath(); ctx.ellipse(px,py+r+2,r*0.55,r*0.18,0,0,Math.PI*2);
  ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.fill();
  ctx.beginPath(); ctx.arc(px,py+bob,r,0,Math.PI*2);
  ctx.fillStyle='rgba(255,215,0,0.12)'; ctx.fill();
  ctx.strokeStyle='#ffd700'; ctx.lineWidth=2; ctx.stroke();
  ctx.font=r*1.3+'px serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('🧑',px,py+bob);
  if(player.walking&&player.destName){
    var txt='→ '+player.destName;
    ctx.font='bold '+Math.max(8,W*0.022)+'px Nunito,sans-serif';
    var tw=ctx.measureText(txt).width;
    var bx=px-tw/2-7, by=py+bob-r-24, bw=tw+14, bh=19;
    ctx.fillStyle='rgba(7,9,15,0.88)';
    roundRect(bx,by,bw,bh,6); ctx.fill();
    ctx.fillStyle='#ffd700'; ctx.fillText(txt,px,by+9.5);
  }
}
