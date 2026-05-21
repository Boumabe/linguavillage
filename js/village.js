// village.js — VERSION COMPLÈTE ET AUTONOME
// LinguaVillage — Village circulaire pour mobile
// ================================================================

window.canvas = null;
window.ctx = null;
window.tick = 0;
window.currentWeather = window.currentWeather || 'sun';
window.hoveredLoc = null;

// ================================================================
// DONNÉES DES LIEUX
// ================================================================
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

// Exporter pour compatibilité
if (typeof window.LOCATIONS === 'undefined') {
  window.LOCATIONS = VILLAGE_LOCATIONS;
}

// ================================================================
// FONCTIONS UTILITAIRES (définies en premier)
// ================================================================
function lightenColor(color, amount) {
  if (!color || color.length < 7) return '#888888';
  var r = parseInt(color.slice(1, 3), 16);
  var g = parseInt(color.slice(3, 5), 16);
  var b = parseInt(color.slice(5, 7), 16);
  r = Math.min(255, Math.max(0, r + amount));
  g = Math.min(255, Math.max(0, g + amount));
  b = Math.min(255, Math.max(0, b + amount));
  return '#' + r.toString(16).padStart(2, '0') + 
              g.toString(16).padStart(2, '0') + 
              b.toString(16).padStart(2, '0');
}

function darkenColor(color) {
  return lightenColor(color, -40);
}

function getLocationName(locId) {
  var nativeLang = (window.S && window.S.nativeLang) ? window.S.nativeLang : 'fr';
  var names = {
    cinema: { fr: 'Cinéma', en: 'Cinema', es: 'Cine', ht: 'Sinema', de: 'Kino', ru: 'Кино', zh: '电影院', ja: '映画館' },
    market: { fr: 'Marché', en: 'Market', es: 'Mercado', ht: 'Mache', de: 'Markt', ru: 'Рынок', zh: '市场', ja: '市場' },
    park: { fr: 'Parc', en: 'Park', es: 'Parque', ht: 'Pak', de: 'Park', ru: 'Парк', zh: '公园', ja: '公園' },
    friends: { fr: 'Amis', en: 'Friends', es: 'Amigos', ht: 'Zanmi', de: 'Freunde', ru: 'Друзья', zh: '朋友', ja: '友達' },
    police: { fr: 'Police', en: 'Police', es: 'Policía', ht: 'Polis', de: 'Polizei', ru: 'Полиция', zh: '警察', ja: '警察' },
    station: { fr: 'Gare', en: 'Station', es: 'Estación', ht: 'Estasyon', de: 'Bahnhof', ru: 'Вокзал', zh: '车站', ja: '駅' },
    bank: { fr: 'Banque', en: 'Bank', es: 'Banco', ht: 'Bank', de: 'Bank', ru: 'Банк', zh: '银行', ja: '銀行' },
    hospital: { fr: 'Hôpital', en: 'Hospital', es: 'Hospital', ht: 'Lopital', de: 'Krankenhaus', ru: 'Больница', zh: '医院', ja: '病院' },
    church: { fr: 'Église', en: 'Church', es: 'Iglesia', ht: 'Legliz', de: 'Kirche', ru: 'Церковь', zh: '教堂', ja: '教会' },
    tavern: { fr: 'Taverne', en: 'Tavern', es: 'Taberna', ht: 'Tavèn', de: 'Kneipe', ru: 'Таверна', zh: '酒馆', ja: '居酒屋' },
    factory: { fr: 'Ferme', en: 'Farm', es: 'Granja', ht: 'Fèm', de: 'Bauernhof', ru: 'Ферма', zh: '农场', ja: '農場' },
    school: { fr: 'École', en: 'School', es: 'Escuela', ht: 'Lekòl', de: 'Schule', ru: 'Школа', zh: '学校', ja: '学校' }
  };
  return (names[locId] && names[locId][nativeLang]) || (names[locId] && names[locId].en) || locId;
}

// ================================================================
// DESSIN DU VILLAGE
// ================================================================
function drawVillage() {
  if (!window.canvas || !window.ctx) return;

  var canvas = window.canvas;
  var ctx = window.ctx;
  var W = canvas.width;
  var H = canvas.height;
  var cx = W / 2;
  var cy = H / 2;
  var minDim = Math.min(W, H);
  var night = window.currentWeather === 'night';

  // Effacer
  ctx.clearRect(0, 0, W, H);

  // Ciel
  var grad = ctx.createLinearGradient(0, 0, 0, H);
  if (night) {
    grad.addColorStop(0, '#0a0a2a');
    grad.addColorStop(1, '#050510');
  } else {
    grad.addColorStop(0, '#1a3a2a');
    grad.addColorStop(1, '#0a1a0a');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Soleil/Lune
  if (night) {
    ctx.beginPath();
    ctx.arc(W - 35, 30, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#e0d8a0';
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(W - 35, 30, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#ffe8a0';
    ctx.fill();
  }

  // Étoiles la nuit
  if (night) {
    for (var i = 0; i < 40; i++) {
      var sx = (Math.sin(i * 437) * 0.5 + 0.5) * W;
      var sy = (Math.sin(i * 293) * 0.5 + 0.5) * H * 0.4;
      var twinkle = 0.3 + 0.7 * Math.sin(window.tick * 0.02 + i);
      ctx.beginPath();
      ctx.arc(sx, sy, 1 + Math.sin(i) * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,200,' + twinkle + ')';
      ctx.fill();
    }
  }

  // Sol (cercle)
  var groundGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * 0.48);
  if (night) {
    groundGrad.addColorStop(0, '#1a3a1a');
    groundGrad.addColorStop(1, '#0a1a0a');
  } else {
    groundGrad.addColorStop(0, '#3a7a3a');
    groundGrad.addColorStop(1, '#1a3a1a');
  }
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
  for (var li = 0; li < VILLAGE_LOCATIONS.length; li++) {
    var locPath = VILLAGE_LOCATIONS[li];
    if (locPath.id === 'cinema') continue;
    var lx = cx + (locPath.x - 0.5) * minDim;
    var ly = cy + (locPath.y - 0.5) * minDim;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(lx, ly);
    ctx.stroke();
  }
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
  if (window.S && window.S.playerName) {
    ctx.font = 'bold ' + Math.max(8, homeR * 0.6) + 'px Nunito';
    ctx.fillStyle = 'rgba(255,215,0,0.8)';
    ctx.fillText(window.S.playerName, cx, cy + homeR + 8);
  }

  // Dessiner tous les lieux
  for (var i = 0; i < VILLAGE_LOCATIONS.length; i++) {
    var loc = VILLAGE_LOCATIONS[i];
    var r = minDim * 0.065;
    var x = cx + (loc.x - 0.5) * minDim;
    var y = cy + (loc.y - 0.5) * minDim;
    var isHover = (window.hoveredLoc === loc.id);
    
    // Ombre
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = isHover ? 8 : 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Cercle avec gradient
    var grad2 = ctx.createRadialGradient(x - 3, y - 3, 0, x, y, r);
    var brighter = lightenColor(loc.color, 20);
    grad2.addColorStop(0, brighter);
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
    
    // Nom du lieu (traduit)
    var locName = getLocationName(loc.id);
    ctx.font = 'bold ' + Math.max(7, r * 0.3) + 'px Nunito';
    ctx.fillStyle = isHover ? '#FFD700' : 'rgba(255,245,220,0.9)';
    ctx.fillText(locName.substring(0, 8), x, y + r + 4);
  }
  
  // Personnage
  if (typeof window.player !== 'undefined' && window.player) {
    var px = cx + (window.player.x - 0.5) * minDim;
    var py = cy + (window.player.y - 0.5) * minDim;
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
    
    // Destination si en marche
    if (window.player.dest && window.player.destName) {
      ctx.font = 'bold ' + Math.max(7, charR * 0.8) + 'px Nunito';
      ctx.fillStyle = 'rgba(255,215,0,0.6)';
      ctx.fillText('→ ' + window.player.destName.substring(0, 10), px + 12, py - 8);
    }
  }

  // Pluie légère
  if (window.currentWeather === 'rain') {
    ctx.fillStyle = 'rgba(0,15,30,0.06)';
    ctx.fillRect(0, 0, W, H);
  }
}

// ================================================================
// INTERACTIONS
// ================================================================
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
  if (typeof showNotif === 'function') showNotif('📍 ' + getLocationName(loc.id));
}

function onVillageTouch(e) {
  e.preventDefault();
  var touch = e.touches[0];
  var loc = getLocAt(touch.clientX, touch.clientY);
  if (!loc) return;
  if (typeof showNotif === 'function') showNotif('📍 ' + getLocationName(loc.id));
}

function onVillageHover(e) {
  var loc = getLocAt(e.clientX, e.clientY);
  window.hoveredLoc = loc ? loc.id : null;
  if (window.canvas) window.canvas.style.cursor = loc ? 'pointer' : 'default';
}

// ================================================================
// MÉTÉO
// ================================================================
function getWeatherForTime() {
  var h = new Date().getHours();
  if (h >= 21 || h < 6) return 'night';
  return 'sun';
}

function setWeather(w) {
  window.currentWeather = w;
  var hudWeather = document.getElementById('hudWeather');
  if (hudWeather) {
    var icons = { sun: '☀️', rain: '🌧️', snow: '❄️', wind: '💨', night: '🌙' };
    hudWeather.textContent = icons[w] || '☀️';
  }
  buildWeatherFX(w);
}

function buildWeatherFX(w) {
  var o = document.getElementById('weatherOverlay');
  if (!o) return;
  o.innerHTML = '';

  if (w === 'rain') {
    for (var i = 0; i < 40; i++) {
      var d = document.createElement('div');
      d.className = 'rain-drop';
      d.style.cssText = 'left:' + (Math.random() * 100) + '%;' +
        'height:' + (40 + Math.random() * 60) + 'px;' +
        'top:-' + (40 + Math.random() * 60) + 'px;' +
        'animation-duration:' + (0.5 + Math.random() * 0.5) + 's;' +
        'animation-delay:' + (Math.random() * 2) + 's;' +
        'opacity:' + (0.3 + Math.random() * 0.4);
      o.appendChild(d);
    }
  } else if (w === 'snow') {
    for (var j = 0; j < 30; j++) {
      var f = document.createElement('div');
      f.className = 'snow-flake';
      f.textContent = '❄';
      f.style.cssText = 'left:' + (Math.random() * 100) + '%;' +
        'font-size:' + (6 + Math.random() * 8) + 'px;' +
        'animation-duration:' + (3 + Math.random() * 4) + 's;' +
        'animation-delay:' + (Math.random() * 5) + 's;' +
        'opacity:' + (0.5 + Math.random() * 0.4);
      o.appendChild(f);
    }
  }
}

function updateTime() {
  var n = new Date();
  var hudTime = document.getElementById('hudTime');
  if (hudTime) {
    hudTime.textContent = n.getHours().toString().padStart(2, '0') + ':' + 
                          n.getMinutes().toString().padStart(2, '0');
  }
}

// ================================================================
// INITIALISATION
// ================================================================
function initCanvas() {
  var canvasEl = document.getElementById('villageCanvas');
  if (!canvasEl) {
    console.error('Canvas non trouvé');
    return;
  }

  // Taille adaptée pour mobile
  var size = Math.min(window.innerWidth - 40, window.innerHeight - 120, 420);
  canvasEl.width = size;
  canvasEl.height = size;
  canvasEl.style.width = size + 'px';
  canvasEl.style.height = size + 'px';
  canvasEl.style.display = 'block';
  canvasEl.style.margin = '0 auto';
  canvasEl.style.backgroundColor = '#0a1a0a';
  canvasEl.style.borderRadius = '16px';
  canvasEl.style.border = '1px solid rgba(255,215,0,0.2)';

  window.canvas = canvasEl;
  window.ctx = canvasEl.getContext('2d');

  // Dessiner immédiatement
  drawVillage();

  // Rafraîchir périodiquement
  if (window._villageInterval) clearInterval(window._villageInterval);
  window._villageInterval = setInterval(function() {
    window.tick++;
    drawVillage();
  }, 100);

  // Attacher les événements
  canvasEl.removeEventListener('click', onVillageClick);
  canvasEl.removeEventListener('mousemove', onVillageHover);
  canvasEl.removeEventListener('touchstart', onVillageTouch);
  canvasEl.addEventListener('click', onVillageClick);
  canvasEl.addEventListener('mousemove', onVillageHover);
  canvasEl.addEventListener('touchstart', onVillageTouch, { passive: false });
}

// ================================================================
// FONCTION PRINCIPALE - goVillage
// ================================================================
function goVillage() {
  if (!window.S) return;

  // Mettre à jour le HUD
  var hudPlayer = document.getElementById('hudPlayer');
  var hudLang = document.getElementById('hudLang');
  var hudXP = document.getElementById('hudXP');
  
  if (hudPlayer) hudPlayer.textContent = '👤 ' + (window.S.playerName || '');
  if (hudLang && typeof window.FLAGS !== 'undefined') {
    var flag = window.FLAGS[window.S.targetLang] || '';
    var langName = (window.LANG_NAMES && window.LANG_NAMES[window.S.targetLang]) || window.S.targetLang || '';
    hudLang.textContent = flag + ' ' + langName;
  }
  if (hudXP) hudXP.textContent = (window.S.xp || 0) + ' XP';

  // Afficher l'écran
  if (typeof window.showScreen === 'function') {
    window.showScreen('screen-village');
  } else {
    document.querySelectorAll('.screen').forEach(function(s) {
      s.classList.remove('active');
      s.style.display = '';
    });
    var vs = document.getElementById('screen-village');
    if (vs) vs.classList.add('active');
  }

  // Initialiser le canvas après un court délai
  setTimeout(function() {
    initCanvas();
    setWeather(getWeatherForTime());
    updateTime();
    
    // Réinitialiser la position du joueur
    if (typeof window.player !== 'undefined') {
      window.player.x = 0.5;
      window.player.y = 0.5;
      window.player.dest = null;
      window.player.walking = false;
    }
  }, 200);
}

// Nettoyer l'intervalle
window.addEventListener('beforeunload', function() {
  if (window._villageInterval) clearInterval(window._villageInterval);
});

console.log('✅ village.js chargé - Version autonome');
