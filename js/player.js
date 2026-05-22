// player.js – gestion du joueur dans le village
window.player = { x: 0.5, y: 0.5, dest: null, walking: false, currentLoc: 'home' };
window.HOME = { x: 0.5, y: 0.5 };

window.startPlayerWalk = function(destX, destY, locName, callback) {
  player.dest = { x: destX, y: destY, callback, name: locName };
  player.walking = true;
};

window.updatePlayer = function() {
  if (!player.walking || !player.dest) return;
  const dx = player.dest.x - player.x;
  const dy = player.dest.y - player.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 0.02) {
    player.x = player.dest.x;
    player.y = player.dest.y;
    player.walking = false;
    if (player.dest.callback) player.dest.callback();
    player.dest = null;
  } else {
    const step = Math.min(0.03, dist);
    player.x += (dx / dist) * step;
    player.y += (dy / dist) * step;
  }
};

window.playerGoHome = function() {
  player.x = HOME.x;
  player.y = HOME.y;
  player.dest = null;
  player.walking = false;
};

window.drawPlayerHome = function(cx, cy, size) {
  if (!window.ctx) return;
  ctx.save();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#8B5A2B';
  ctx.beginPath();
  ctx.rect(cx - size/2, cy - size/3, size, size*0.6);
  ctx.fill();
  ctx.fillStyle = '#D2691E';
  ctx.beginPath();
  ctx.moveTo(cx - size/1.5, cy - size/3);
  ctx.lineTo(cx, cy - size);
  ctx.lineTo(cx + size/1.5, cy - size/3);
  ctx.fill();
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.rect(cx - size/8, cy - size/8, size/4, size/4);
  ctx.fill();
  ctx.restore();
};

window.drawPlayerCharacter = function(W, H) {
  if (!window.ctx) return;
  const cx = W/2, cy = H/2;
  const minDim = Math.min(W, H);
  const px = cx + (player.x - 0.5) * minDim;
  const py = cy + (player.y - 0.5) * minDim;
  ctx.beginPath();
  ctx.arc(px, py, 10, 0, 2*Math.PI);
  ctx.fillStyle = '#FFD966';
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.font = '16px "Segoe UI Emoji"';
  ctx.fillText('🧑', px-8, py+6);
  if (player.walking && player.dest) {
    ctx.beginPath();
    ctx.moveTo(px, py);
    const dx = player.dest.x - player.x;
    const dy = player.dest.y - player.y;
    const angle = Math.atan2(dy, dx);
    const ex = px + Math.cos(angle) * 15;
    const ey = py + Math.sin(angle) * 15;
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.setLineDash([]);
  }
};

console.log("✅ player.js chargé");
