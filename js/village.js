// village.js — VERSION ULTRA-SIMPLE QUI FONCTIONNE À COUP SÛR
// ================================================================

window.canvas = null;
window.ctx = null;
window.tick = 0;
window.currentWeather = 'sun';
window.hoveredLoc = null;

// Données des lieux - intégrées directement
var VILLAGE_LOCATIONS = [
  { id:'cinema',   x:0.50, y:0.50, emoji:'🎬', color:'#c060c0', name:'Cinéma' },
  { id:'market',   x:0.50, y:0.75, emoji:'🏪', color:'#c0a060', name:'Marché' },
  { id:'park',     x:0.50, y:0.25, emoji:'🌳', color:'#5a8a40', name:'Parc' },
  { id:'friends',  x:0.75, y:0.75, emoji:'🤝', color:'#c09090', name:'Amis' },
  { id:'police',   x:0.25, y:0.75, emoji:'🚔', color:'#6070a0', name:'Police' },
  { id:'station',  x:0.25, y:0.25, emoji:'🚉', color:'#b0a090', name:'Gare' },
  { id:'bank',     x:0.75, y:0.25, emoji:'🏦', color:'#c0c080', name:'Banque' },
  { id:'hospital', x:0.88, y:0.50, emoji:'🏥', color:'#d0e0f0', name:'Hôpital' },
  { id:'church',   x:0.65, y:0.85, emoji:'⛪', color:'#8a7a60', name:'Église' },
  { id:'tavern',   x:0.20, y:0.80, emoji:'🍺', color:'#8a6040', name:'Taverne' },
  { id:'factory',  x:0.20, y:0.20, emoji:'🏭', color:'#808080', name:'Ferme' },
  { id:'school',   x:0.65, y:0.15, emoji:'🏫', color:'#6a8ab0', name:'École' }
];

function goVillage() {
  if (!window.S) return;

  // Mettre à jour le HUD
  var hudPlayer = document.getElementById('hudPlayer');
  var hudLang = document.getElementById('hudLang');
  var hudXP = document.getElementById('hudXP');
  
  if (hudPlayer) hudPlayer.textContent = '👤 ' + (S.playerName || '');
  if (hudLang) hudLang.textContent = (FLAGS?.[S.targetLang] || '') + ' ' + (LANG_NAMES?.[S.targetLang] || '');
  if (hudXP) hudXP.textContent = (S.xp || 0) + ' XP';

  // Afficher l'écran
  if (typeof showScreen === 'function') {
    showScreen('screen-village');
  } else {
    document.querySelectorAll('.screen').forEach(function(s) {
      s.classList.remove('active');
      s.style.display = '';
    });
    var vs = document.getElementById('screen-village');
    if (vs) vs.classList.add('active');
  }

  // Initialiser le canvas
  setTimeout(function() {
    var canvas = document.getElementById('villageCanvas');
    if (!canvas) return;
    
    // Taille adaptée
    var size = Math.min(window.innerWidth - 40, window.innerHeight - 120, 420);
    canvas.width = size;
    canvas.height = size;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    canvas.style.backgroundColor = '#0a1a0a';
    canvas.style.borderRadius = '16px';
    canvas.style.border = '1px solid rgba(255,215,0,0.2)';
    
    window.canvas = canvas;
    window.ctx = canvas.getContext('2d');
    
    // Dessiner
    drawVillageSimple();
    
    // Rafraîchir périodiquement
    if (window._villageInterval) clearInterval(window._villageInterval);
    window._villageInterval = setInterval(function() {
      drawVillageSimple();
    }, 100);
    
  }, 100);
}

function drawVillageSimple() {
  var canvas = window.canvas;
  var ctx = window.ctx;
  if (!canvas || !ctx) return;
  
  var W = canvas.width;
  var H = canvas.height;
  var cx = W / 2;
  var cy = H / 2;
  var minDim = Math.min(W, H);
  
  // Effacer
  ctx.clearRect(0, 0, W, H);
  
  // Ciel
  var grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#1a3a2a');
  grad.addColorStop(1, '#0a1a0a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  
  // Soleil
  ctx.beginPath();
  ctx.arc(W - 40, 30, 18, 0, Math.PI * 2);
  ctx.fillStyle = '#ffe8a0';
  ctx.fill();
  
  // Sol (cercle)
  var groundGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * 0.48);
  groundGrad.addColorStop(0, '#3a7a3a');
  groundGrad.addColorStop(1, '#1a3a1a');
  ctx.fillStyle = groundGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, minDim * 0.48, 0, Math.PI * 2);
  ctx.fill();
  
  // Anneaux
  [0.18, 0.32, 0.48].forEach(function(r) {
    ctx.beginPath();
    ctx.arc(cx, cy, minDim * r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(200,170,100,0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
  
  // Chemins
  ctx.strokeStyle = 'rgba(200,170,100,0.15)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 5]);
  VILLAGE_LOCATIONS.forEach(function(loc) {
    if (loc.id === 'cinema') return;
    var lx = cx + (loc.x - 0.5) * minDim;
    var ly = cy + (loc.y - 0.5) * minDim;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(lx, ly);
    ctx.stroke();
  });
  ctx.setLineDash([]);
  
  // Maison centrale
  var homeR = minDim * 0.05;
  ctx.beginPath();
  ctx.arc(cx, cy, homeR, 0, Math.PI * 2);
  ctx.fillStyle = '#3a2a1a';
  ctx.fill();
  ctx.strokeStyle = '#c0a060';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.font = (homeR * 1.3) + 'px serif';
  ctx.fillStyle = '#ffd700';
  ctx.fillText('🏠', cx, cy);
  
  // Nom du joueur
  if (S && S.playerName) {
    ctx.font = 'bold ' + Math.max(8, homeR * 0.6) + 'px Nunito';
    ctx.fillStyle = 'rgba(255,215,0,0.8)';
    ctx.fillText(S.playerName, cx, cy + homeR + 8);
  }
  
  // Lieux
  VILLAGE_LOCATIONS.forEach(function(loc) {
    var r = minDim * 0.065;
    var x = cx + (loc.x - 0.5) * minDim;
    var y = cy + (loc.y - 0.5) * minDim;
    var isHover = (hoveredLoc === loc.id);
    
    // Ombre
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = isHover ? 8 : 4;
    
    // Cercle
    var grad2 = ctx.createRadialGradient(x - 3, y - 3, 0, x, y, r);
    grad2.addColorStop(0, lightenColor(loc.color, 20));
    grad2.addColorStop(1, loc.color);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = grad2;
    ctx.fill();
    
    // Bordure
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = isHover ? '#FFD700' : 'rgba(255,215,0,0.4)';
    ctx.lineWidth = isHover ? 2.5 : 1.5;
    ctx.stroke();
    
    ctx.shadowColor = 'transparent';
    
    // Emoji
    ctx.font = Math.max(14, Math.min(r * 0.9, 22)) + 'px serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(loc.emoji, x, y);
    
    // Nom
    ctx.font = 'bold ' + Math.max(7, r * 0.3) + 'px Nunito';
    ctx.fillStyle = isHover ? '#FFD700' : 'rgba(255,245,220,0.9)';
    ctx.fillText(loc.name.substring(0, 8), x, y + r + 4);
  });
  
  // Personnage
  if (typeof player !== 'undefined' && player) {
    var px = cx + (player.x - 0.5) * minDim;
    var py = cy + (player.y - 0.5) * minDim;
    var charR = minDim * 0.03;
    ctx.beginPath();
    ctx.arc(px, py, charR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,215,0,0.2)';
    ctx.fill();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.font = (charR * 1.5) + 'px serif';
    ctx.fillStyle = '#ffd700';
    ctx.fillText('🧑', px, py);
  }
}

function lightenColor(color, amount) {
  var r = parseInt(color.slice(1, 3), 16);
  var g = parseInt(color.slice(3, 5), 16);
  var b = parseInt(color.slice(5, 7), 16);
  r = Math.min(255, r + amount);
  g = Math.min(255, g + amount);
  b = Math.min(255, b + amount);
  return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
}

function getLocAt(mx, my) {
  var canvas = window.canvas;
  if (!canvas) return null;
  
  var rect = canvas.getBoundingClientRect();
  var scaleX = canvas.width / rect.width;
  var scaleY = canvas.height / rect.height;
  var x = (mx - rect.left) * scaleX;
  var y = (my - rect.top) * scaleY;
  var W = canvas.width;
  var H = canvas.height;
  var cx = W / 2;
  var cy = H / 2;
  var minDim = Math.min(W, H);
  var r = minDim * 0.065;
  
  for (var i = 0; i < VILLAGE_LOCATIONS.length; i++) {
    var loc = VILLAGE_LOCATIONS[i];
    var lx = cx + (loc.x - 0.5) * minDim;
    var ly = cy + (loc.y - 0.5) * minDim;
    var dx = x - lx;
    var dy = y - ly;
    if (dx * dx + dy * dy <= r * r) {
      return loc;
    }
  }
  return null;
}

function onVillageClick(e) {
  var loc = getLocAt(e.clientX, e.clientY);
  if (!loc) return;
  console.log('Clic sur:', loc.name);
  if (typeof showNotif === 'function') showNotif('📍 ' + loc.name);
}

function onVillageTouch(e) {
  e.preventDefault();
  var touch = e.touches[0];
  var loc = getLocAt(touch.clientX, touch.clientY);
  if (!loc) return;
  console.log('Touch sur:', loc.name);
  if (typeof showNotif === 'function') showNotif('📍 ' + loc.name);
}

function onVillageHover(e) {
  var loc = getLocAt(e.clientX, e.clientY);
  hoveredLoc = loc ? loc.id : null;
  if (window.canvas) window.canvas.style.cursor = loc ? 'pointer' : 'default';
}

// Attacher les événements
document.addEventListener('DOMContentLoaded', function() {
  var canvas = document.getElementById('villageCanvas');
  if (canvas) {
    canvas.addEventListener('click', onVillageClick);
    canvas.addEventListener('mousemove', onVillageHover);
    canvas.addEventListener('touchstart', onVillageTouch, { passive: false });
  }
});

console.log('✅ Village simple chargé');
