// village.js - CORRIGÉ (bug _onCanvasResize résolu)
// LinguaVillage — village.js
// Village canvas, météo, interactions, ouverture des lieux
// ================================================================

// Variables globales du village
window.canvas = null;
window.ctx = null;
window.tick = 0;
window.currentWeather = window.currentWeather || 'sun';
window.hoveredLoc = null;
window._onCanvasResize = window._onCanvasResize || null;

// ================================================================
// NAVIGATION VERS LE VILLAGE
// ================================================================
function goVillage() {
  if (!window.S) return;
  
  // Mise à jour du HUD
  var hudPlayer = document.getElementById('hudPlayer');
  var hudLang   = document.getElementById('hudLang');
  var hudXP     = document.getElementById('hudXP');
  
  if (hudPlayer) hudPlayer.textContent = '👤 ' + S.playerName;
  if (hudLang)   hudLang.textContent   = (FLAGS[S.targetLang]||'') + ' ' + (LANG_NAMES[S.targetLang]||'');
  if (hudXP)     hudXP.textContent     = (S.xp||0) + ' XP';
  
  // Afficher l'écran village via showScreen (reset les style.display inline)
  if (typeof window.showScreen === 'function') {
    window.showScreen('screen-village');
  } else {
    // fallback si showScreen pas encore disponible
    document.querySelectorAll('.screen').forEach(function(s) {
      s.classList.remove('active');
      s.style.display = '';
    });
    var vs = document.getElementById('screen-village');
    if (vs) vs.classList.add('active');
  }
  
  // Réinitialiser complètement le canvas
  canvas = null;
  ctx = null;
  tick = 0;
  window._villageLoopRunning = false;
  window._villageLoopActive = false; // flag d'arrêt pour villageLoop
  
  // Attendre que le DOM soit prêt puis initialiser le canvas
  setTimeout(function() {
    var c = document.getElementById('villageCanvas');
    if (c) {
      // Toujours utiliser window.innerWidth/Height :
      // getBoundingClientRect retourne 0 sur un écran position:fixed fraîchement affiché
      var W = window.innerWidth  || document.documentElement.clientWidth  || 360;
      var H = window.innerHeight || document.documentElement.clientHeight || 640;
      c.width  = W;
      c.height = H;
      c.style.width  = W + 'px';
      c.style.height = H + 'px';
      c.style.display = 'block';
    }
    
    initCanvas();
    setWeather(getWeatherForTime());
    updateTime();

    
    // Positionner le joueur à la maison
    if (typeof player !== 'undefined') {
      player.x = HOME.x;
      player.y = HOME.y;
      player.dest = null;
      player.walking = false;
      player.currentLoc = 'home';
    }
    
    setTimeout(function() {
      if (typeof addCEFRIndicator === 'function') addCEFRIndicator();
    }, 100);
  }, 300);
  
  // Nettoyer l'ancien intervalle de temps s'il existe
  if (window._timeUpdateInterval) {
    clearInterval(window._timeUpdateInterval);
  }
  window._timeUpdateInterval = setInterval(updateTime, 30000);
}

// ================================================================
// MÉTÉO
// ================================================================
function getWeatherForTime() {
  var h = new Date().getHours();
  if (h >= 21 || h < 6) return 'night';
  var weathers = ['sun', 'sun', 'rain', 'wind', 'snow'];
  return weathers[Math.floor(Math.random() * weathers.length)];
}

function setWeather(w) {
  currentWeather = w;
  var hudWeather = document.getElementById('hudWeather');
  if (hudWeather) hudWeather.textContent = WEATHER_ICONS[w] || '☀️';
  buildWeatherFX(w);
}

function buildWeatherFX(w) {
  var o = document.getElementById('weatherOverlay');
  if (!o) return;
  o.innerHTML = '';
  
  if (w === 'rain') {
    for (var i = 0; i < 60; i++) {
      var d = document.createElement('div');
      d.className = 'rain-drop';
      d.style.cssText = 'left:' + (Math.random() * 110 - 5) + '%;' +
        'height:' + (60 + Math.random() * 80) + 'px;' +
        'top:-' + (60 + Math.random() * 80) + 'px;' +
        'animation-duration:' + (0.4 + Math.random() * 0.4) + 's;' +
        'animation-delay:' + (Math.random() * 2) + 's;' +
        'opacity:' + (0.3 + Math.random() * 0.4);
      o.appendChild(d);
    }
  } else if (w === 'snow') {
    for (var j = 0; j < 40; j++) {
      var f = document.createElement('div');
      f.className = 'snow-flake';
      f.textContent = '❄';
      f.style.cssText = 'left:' + (Math.random() * 100) + '%;' +
        'font-size:' + (8 + Math.random() * 10) + 'px;' +
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
// INITIALISATION DU CANVAS
// ================================================================
function initCanvas() {
  canvas = document.getElementById('villageCanvas');
  if (!canvas) return;
  
  // Si les dimensions sont à 0, les forcer avec window dimensions
  if (canvas.width === 0 || canvas.height === 0) {
    canvas.width  = window.innerWidth  || document.documentElement.clientWidth  || 360;
    canvas.height = window.innerHeight || document.documentElement.clientHeight || 640;
  }
  
  // S'assurer que le canvas est visible
  canvas.style.display = 'block';
  
  ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Dessiner immédiatement un fond pour confirmer que le canvas fonctionne
  ctx.fillStyle = '#0a0a14';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Dessiner le village
  tick = 0;
  drawVillage();
  
  // Gérer le redimensionnement de la fenêtre
  // Supprimer l'ancien écouteur s'il existe
  if (window._onCanvasResize) {
    window.removeEventListener('resize', window._onCanvasResize);
  }
  
  // Définir le nouveau gestionnaire et le garder en référence globale
  window._onCanvasResize = function() {
    if (canvas && canvas.parentElement) {
      var r = canvas.parentElement.getBoundingClientRect();
      canvas.width = r.width || window.innerWidth;
      canvas.height = r.height || window.innerHeight;
      drawVillage();
    }
  };
  window.addEventListener('resize', window._onCanvasResize);
  
  // Nettoyer les anciens event listeners de la souris/tactile
  canvas.removeEventListener('click', onVillageClick);
  canvas.removeEventListener('mousemove', onVillageHover);
  canvas.removeEventListener('touchstart', onVillageTouch);
  
  // Ajouter les nouveaux event listeners
  canvas.addEventListener('click', onVillageClick);
  canvas.addEventListener('mousemove', onVillageHover);
  canvas.addEventListener('touchstart', onVillageTouch, { passive: true });
  
  // Lancer la boucle d'animation
  if (!window._villageLoopRunning) {
    window._villageLoopRunning = true;
    window._villageLoopActive = true;
    requestAnimationFrame(villageLoop);
  }
}

// ================================================================
// BOUCLE D'ANIMATION
// ================================================================
function villageLoop() {
  if (!window._villageLoopActive) return; // arrêt propre si on quitte le village
  tick++;
  if (typeof updatePlayer === 'function') updatePlayer();
  drawVillage();
  requestAnimationFrame(villageLoop);
}

// ================================================================
// DESSIN DU VILLAGE
// ================================================================
function drawVillage() {
  if (!canvas || !ctx) return;
  
  var W = canvas.width;
  var H = canvas.height;
  
  // Si le canvas est invisible (taille 0), ne pas dessiner
  if (W === 0 || H === 0) return;
  
  var cx = W * 0.5;
  var cy = H * 0.5;
  var night = currentWeather === 'night';
  
  // ---- Fond de ciel ----
  var sky = ctx.createLinearGradient(0, 0, 0, H);
  if (night) {
    sky.addColorStop(0, '#01020a');
    sky.addColorStop(1, '#0a0a1e');
  } else if (currentWeather === 'rain') {
    sky.addColorStop(0, '#1a2535');
    sky.addColorStop(1, '#2a3848');
  } else {
    sky.addColorStop(0, '#1a3a1a');
    sky.addColorStop(1, '#2d5a2d');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);
  
  // ---- Lune ou soleil ----
  if (night) {
    ctx.beginPath();
    ctx.arc(W * 0.85, H * 0.08, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#f0e0a0';
    ctx.fill();
    
    for (var i = 0; i < 50; i++) {
      var sx = (Math.sin(i * 437) * 0.5 + 0.5) * W;
      var sy = (Math.sin(i * 293) * 0.5 + 0.5) * H * 0.4;
      ctx.beginPath();
      ctx.arc(sx, sy, 1, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,200,' + (0.4 + 0.5 * Math.sin(tick * 0.02 + i)) + ')';
      ctx.fill();
    }
  } else {
    ctx.beginPath();
    ctx.arc(W * 0.85, H * 0.08, 18, 0, Math.PI * 2);
    ctx.fillStyle = currentWeather === 'rain' ? '#7a8898' : '#ffe0a0';
    ctx.fill();
  }
  
  // ---- Herbe / sol ----
  var grass = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.55);
  grass.addColorStop(0, currentWeather === 'snow' ? '#d0d8e0' : '#3a6b30');
  grass.addColorStop(1, currentWeather === 'snow' ? '#b0b8c0' : '#1e3d1a');
  ctx.fillStyle = grass;
  ctx.fillRect(0, 0, W, H);
  
  // ---- Cercles concentriques (zones) ----
  var rings = [
    { r: W * 0.46, color: 'rgba(160,130,80,0.25)' },
    { r: W * 0.32, color: 'rgba(160,130,80,0.30)' },
    { r: W * 0.20, color: 'rgba(160,130,80,0.38)' },
    { r: W * 0.10, color: 'rgba(160,130,80,0.50)' }
  ];
  
  rings.forEach(function(ring) {
    ctx.beginPath();
    ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
    ctx.fillStyle = ring.color;
    ctx.fill();
  });
  
  // ---- Murs circulaires ----
  var wallRadii = [W * 0.46, W * 0.32, W * 0.20, W * 0.10];
  var wallColors = ['#8a7040', '#9a8050', '#aa9060', '#c0a870'];
  
  wallRadii.forEach(function(r, i) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = wallColors[i];
    ctx.lineWidth = Math.max(3, W * 0.012);
    ctx.stroke();
  });
  
  // ---- Maison du joueur ----
  if (typeof drawPlayerHome === 'function') {
    drawPlayerHome(cx, cy, W);
  }
  
  // ---- Lieux ----
  if (typeof LOCATIONS !== 'undefined') {
    LOCATIONS.forEach(function(loc) {
      var bob = Math.sin(tick * 0.025 + loc.x * 10) * 1.5;
      drawLoc(loc, loc.x * W, loc.y * H + bob, loc.w * W, loc.h * H, hoveredLoc === loc.id);
    });
  }
  
  // ---- Ligne de marche ----
  if (typeof player !== 'undefined' && player.dest) {
    ctx.beginPath();
    ctx.moveTo(player.x * W, player.y * H);
    ctx.lineTo(player.dest.x * W, player.dest.y * H);
    ctx.strokeStyle = 'rgba(255,215,0,0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 7]);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  
  // ---- Personnage ----
  if (typeof drawPlayerCharacter === 'function') {
    drawPlayerCharacter(W, H);
  }
  
  // ---- Effet de pluie global ----
  if (currentWeather === 'rain') {
    ctx.fillStyle = 'rgba(0,10,30,0.12)';
    ctx.fillRect(0, 0, W, H);
  }
}

// ================================================================
// DESSIN D'UN LIEU
// ================================================================
function drawLoc(loc, x, y, w, h, hov) {
  if (!ctx) return;
  
  var a = hov ? 1 : 0.85;
  var night = currentWeather === 'night';
  var r = Math.min(w, h) * 0.5;
  var bx = x + w * 0.5;
  var by = y + h * 0.5;
  
  // Ombre portée
  ctx.beginPath();
  ctx.arc(bx + 3, by + 4, r, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.30)';
  ctx.fill();
  
  // Cercle principal
  ctx.beginPath();
  ctx.arc(bx, by, r, 0, Math.PI * 2);
  ctx.fillStyle = hexA(loc.color, a * (night ? 0.6 : 1));
  ctx.fill();
  
  // Bordure
  if (hov) {
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.strokeStyle = hexA(darken(loc.color), 0.8);
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  
  // Fenêtres éclairées la nuit
  if (night) {
    ctx.fillStyle = 'rgba(255,215,100,0.6)';
    ctx.fillRect(bx - r * 0.3, by - r * 0.15, r * 0.22, r * 0.22);
    ctx.fillRect(bx + r * 0.08, by - r * 0.15, r * 0.22, r * 0.22);
  }
  
  // Emoji du lieu
  ctx.font = Math.min(w, h) * 0.38 + 'px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(loc.emoji, bx, by);
  
  // Nom du lieu
  var nativeLang = (window.S && window.S.nativeLang) ? window.S.nativeLang : 'en';
  var nm = (LOC_NAMES && LOC_NAMES[loc.id] && LOC_NAMES[loc.id][nativeLang]) ? LOC_NAMES[loc.id][nativeLang] : loc.id;
  ctx.font = 'bold ' + Math.max(8, Math.min(w * 0.14, 11)) + 'px Nunito,sans-serif';
  ctx.fillStyle = hov ? '#FFD700' : 'rgba(255,240,200,0.9)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(nm, bx, by + r + 4);
}

// ================================================================
// UTILITAIRES COULEURS
// ================================================================
function hexA(h, a) {
  var r = parseInt(h.slice(1, 3), 16);
  var g = parseInt(h.slice(3, 5), 16);
  var b = parseInt(h.slice(5, 7), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

function darken(h) {
  var parts = [1, 3, 5].map(function(i) {
    return Math.max(0, parseInt(h.slice(i, i + 2), 16) - 40)
      .toString(16)
      .padStart(2, '0');
  });
  return '#' + parts.join('');
}

// ================================================================
// INTERACTIONS SOURIS / TACTILE
// ================================================================
function getLocAt(mx, my) {
  if (!canvas || typeof LOCATIONS === 'undefined') return null;
  var W = canvas.width;
  var H = canvas.height;
  
  return LOCATIONS.find(function(loc) {
    var bx = loc.x * W + loc.w * W * 0.5;
    var by = loc.y * H + loc.h * H * 0.5;
    var r = Math.min(loc.w * W, loc.h * H) * 0.5;
    var dx = mx - bx;
    var dy = my - by;
    return dx * dx + dy * dy <= r * r;
  });
}

function onVillageHover(e) {
  var rect = canvas.getBoundingClientRect();
  var loc = getLocAt(e.clientX - rect.left, e.clientY - rect.top);
  hoveredLoc = loc ? loc.id : null;
  
  var tip = document.getElementById('locTooltip');
  if (loc && tip) {
    var nativeLang = (window.S && window.S.nativeLang) ? window.S.nativeLang : 'en';
    var nm = (LOC_NAMES[loc.id] && LOC_NAMES[loc.id][nativeLang]) ? LOC_NAMES[loc.id][nativeLang] : loc.id;
    var ds = (LOC_DESC[loc.id] && LOC_DESC[loc.id][nativeLang]) ? LOC_DESC[loc.id][nativeLang] : '';
    tip.textContent = (WEATHER_ICONS[currentWeather] || '') + ' ' + nm + ' — ' + ds;
    tip.style.left = (loc.x * canvas.width + loc.w * canvas.width / 2) + 'px';
    tip.style.top = (loc.y * canvas.height) + 'px';
    tip.classList.add('show');
  } else if (tip) {
    tip.classList.remove('show');
  }
}

function onVillageClick(e) {
  var rect = canvas.getBoundingClientRect();
  var loc = getLocAt(e.clientX - rect.left, e.clientY - rect.top);
  if (loc) openLoc(loc);
}

function onVillageTouch(e) {
  var rect = canvas.getBoundingClientRect();
  var t = e.touches[0];
  var loc = getLocAt(t.clientX - rect.left, t.clientY - rect.top);
  if (loc) openLoc(loc);
}

// ================================================================
// OUVERTURE D'UN LIEU
// ================================================================
function openLoc(loc) {
  if (!window.S) return;
  
  S.currentLoc = loc;
  
  var locTitle   = document.getElementById('locTitle');
  var locWeather = document.getElementById('locWeather');
  var nativeLang = (window.S && window.S.nativeLang) ? window.S.nativeLang : 'en';
  var locName = (LOC_NAMES[loc.id] && LOC_NAMES[loc.id][nativeLang]) ? LOC_NAMES[loc.id][nativeLang] : loc.id;
  
  if (locTitle)   locTitle.textContent   = loc.emoji + ' ' + locName;
  if (locWeather) locWeather.textContent = WEATHER_ICONS[currentWeather] || '☀️';
  
  // Cinéma — ouverture directe
  if (loc.id === 'cinema') {
    if (typeof openCinema === 'function') openCinema();
    return;
  }
  
  var listEl = document.getElementById('npcList');
  if (!listEl) return;
  
  listEl.innerHTML = (loc.npcs || []).map(function(npc) {
    var role = typeof npc.role === 'object' ? (npc.role[nativeLang] || npc.role.en) : npc.role;
    var hint = (LOC_DESC[loc.id] && LOC_DESC[loc.id][nativeLang]) ? LOC_DESC[loc.id][nativeLang] : '';
    
    return '<div class="npc-card" onclick="openDialogue(\'' + loc.id + '\',\'' + npc.id + '\')">' +
      '<div class="npc-av">' + npc.emoji + '</div>' +
      '<div class="npc-info">' +
      '<div class="npc-name">' + npc.name + '</div>' +
      '<div class="npc-role">' + role + '</div>' +
      (hint ? '<div class="npc-hint">💬 ' + hint + '</div>' : '') +
      '</div>' +
      '<span style="color:var(--dim);font-size:1.2rem">›</span>' +
      '</div>';
  }).join('');
  
  if (typeof showScreen === 'function') showScreen('screen-location');

  setTimeout(function() {
    if (typeof openMissionsPanel === 'function') openMissionsPanel(loc.id);
  }, 400);
}
