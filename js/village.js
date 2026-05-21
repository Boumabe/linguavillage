// village.js - ENTIÈREMENT CORRIGÉ ET ADAPTÉ AUX TABLEAUX DE DATA NATIVES
// LinguaVillage — village.js
// Village canvas, météo, interactions et distribution des cercles synchro
// ===============================================================================

window.canvas = null;
window.ctx = null;
window.tick = 0;
window.currentWeather = window.currentWeather || 'sun';
window.hoveredLoc = null;
window._onCanvasResize = window._onCanvasResize || null;

// Facteur d'adaptation de la matrice d'affichage
let villageScale = 1;
const baseWidth = 360;
const baseHeight = 740;

// Configuration de la grille géométrique ( recentrage Y ajusté à 390 pour un meilleur équilibre )
const VILLAGE_LAYOUT = {
  centerX: 180,
  centerY: 390,
  radii: {
    inner: 65,    // Cercle 1
    middle: 125,  // Cercle 2
    outer: 185    // Cercle 3
  }
};

/**
 * Point d'entrée de la vue Village
 */
function goVillage() {
  if (!window.S) return;

  // Affichage de l'écran principal du village
  if (typeof window.showScreen === 'function') {
    window.showScreen('screen-village');
  } else {
    document.querySelectorAll('.screen').forEach(function(s) {
      s.classList.remove('active');
      s.style.display = 'none';
    });
    var sv = document.getElementById('screen-village');
    if (sv) { sv.classList.add('active'); sv.style.display = 'flex'; }
  }

  // Lancement du moteur d'affichage du village
  initVillageEngine();
}

/**
 * Démarre et lie les composants du village
 */
function initVillageEngine() {
  window.canvas = document.getElementById("villageCanvas");
  if (!window.canvas) return;
  window.ctx = window.canvas.getContext("2d");

  // Création dynamique sécurisée du calque HTML des icônes
  let elementsContainer = document.getElementById("village-elements-container");
  if (!elementsContainer) {
    elementsContainer = document.createElement("div");
    elementsContainer.id = "village-elements-container";
    window.canvas.parentNode.insertBefore(elementsContainer, window.canvas.nextSibling);
  }

  // Injection du HUD moderne et accessible
  setupProfessionalHUD();

  // Premier calcul des dimensions
  resizeVillagePro();

  // Attachement de la fonction adaptative globale au redimensionnement
  window._onCanvasResize = resizeVillagePro;
  window.addEventListener("resize", resizeVillagePro);

  // Instanciation des icônes de lieux
  buildVillageNodes();

  // Démarrage de l'animation en tâche de fond (cercles et pluie)
  startVillageAnimationLoop();
}

/**
 * Construit l'en-tête utilisateur et sa barre d'outils tactile optimisée
 */
function setupProfessionalHUD() {
  var hud = document.querySelector(".village-hud");
  if (!hud) return;

  // Rendu de l'architecture du HUD
  hud.innerHTML = `
    <div class="village-hud-top">
      <div class="hud-profile-group">
        <span class="hud-player" id="hudPlayer">👤 --</span>
        <span class="hud-lang" id="hudLang">--</span>
      </div>
      <div class="hud-stats-group">
        <span class="hud-weather" id="hudWeather">☀️</span>
        <span class="hud-time" id="hudTime">12:00</span>
        <span id="streakDisplay">🔥 <span id="streakVal">0</span></span>
        <span id="hudXP">0 XP</span>
      </div>
    </div>
    <div class="hud-btns">
      <button class="hud-btn-menu" id="hudBtnMenu">← Menu</button>
      <button class="hud-btn-action" data-action="stats" title="Statistiques">📊</button>
      <button class="hud-btn-action" data-action="badge" title="Badges">🏆</button>
      <button class="hud-btn-action" data-action="review" title="Révision">⚡</button>
      <button class="hud-btn-action" data-action="shop" title="Boutique">🏪</button>
      <button class="hud-btn-action" data-action="reminders" title="Notifications">🔔</button>
    </div>
  `;

  // Événement du bouton Menu de retour
  var btnMenu = document.getElementById('hudBtnMenu');
  if (btnMenu) {
    btnMenu.onclick = function() {
      if (typeof window.showScreen === 'function') window.showScreen('screen-menu');
    };
  }

  // Liaison des boutons d'actions aux fonctions globales existantes
  hud.querySelectorAll('.hud-btn-action').forEach(function(btn) {
    btn.onclick = function() {
      var act = btn.getAttribute('data-action');
      if (act === 'stats' && typeof window.showStats === 'function') window.showStats();
      else if (act === 'badge' && typeof window.showBadges === 'function') window.showBadges();
      else if (act === 'review' && typeof window.openReviewQuick === 'function') window.openReviewQuick();
      else if (act === 'shop' && typeof window.openShop === 'function') window.openShop();
      else if (act === 'reminders' && typeof window.openReminderSettings === 'function') window.openReminderSettings();
      else {
        if (typeof window.showNotif === 'function') window.showNotif("Bientôt disponible");
      }
    };
  });

  // Remplissage avec les données en cache du joueur
  syncHUDValues();
}

/**
 * Hydrate le contenu textuel du HUD avec des verrous anti-crash (fallbacks)
 */
function syncHUDValues() {
  if (!window.S) return;
  
  var hp = document.getElementById('hudPlayer');
  var hl = document.getElementById('hudLang');
  var hx = document.getElementById('hudXP');
  var sv = document.getElementById('streakVal');
  var hw = document.getElementById('hudWeather');

  if (hp) hp.textContent = '👤 ' + (window.S.playerName || 'Player');
  if (hl) {
    var flg = (window.FLAGS && window.FLAGS[window.S.targetLang]) ? window.FLAGS[window.S.targetLang] : '';
    var nme = (window.LANG_NAMES && window.LANG_NAMES[window.S.targetLang]) ? window.LANG_NAMES[window.S.targetLang] : (window.S.targetLang || 'JA');
    hl.textContent = flg + ' ' + nme.toUpperCase();
  }
  if (hx) hx.textContent = (window.S.xp || 0) + ' XP';
  if (sv) sv.textContent = window.S.streak || 0;
  if (hw) {
    var icons = window.WEATHER_ICONS || { sun: '☀️', rain: '🌧️', night: '🌙', storm: '⚡' };
    hw.textContent = icons[window.currentWeather] || '☀️';
  }
}

/**
 * Recalcule la matrice d'adaptation écran
 */
function resizeVillagePro() {
  if (!window.canvas) return;
  var container = window.canvas.parentElement;
  var w = container.clientWidth;
  var h = container.clientHeight;

  window.canvas.width = w;
  window.canvas.height = h;

  // Calcul du ratio d'adaptation d'échelle
  villageScale = Math.min(w / baseWidth, h / baseHeight);

  // Déplacer les nodes au pixel près
  repositionAllNodes();
}

/**
 * Résout l'emplacement absolu sur l'écran d'après un type de rayon et un angle
 */
function calculateNodeCoordinates(rayType, angleDegrees) {
  var angleRad = (angleDegrees - 90) * Math.PI / 180; // Alignement nord
  var radiusValue = VILLAGE_LAYOUT.radii[rayType] || VILLAGE_LAYOUT.radii.middle;

  // Emplacement sur la matrice virtuelle
  var localX = VILLAGE_LAYOUT.centerX + radiusValue * Math.cos(angleRad);
  var localY = VILLAGE_LAYOUT.centerY + radiusValue * Math.sin(angleRad);

  // Projection réelle sur les dimensions physiques de l'écran
  var realCenterX = window.canvas.width / 2;
  var realCenterY = window.canvas.height / 2;

  var x = realCenterX + (localX - VILLAGE_LAYOUT.centerX) * villageScale;
  var y = realCenterY + (localY - VILLAGE_LAYOUT.centerY) * villageScale;

  return { x: x, y: y };
}

/**
 * Parcourt ton tableau natif de localisations et génère les éléments HTML
 */
function buildVillageNodes() {
  var container = document.getElementById("village-elements-container");
  if (!container) return;
  container.innerHTML = ""; 

  if (!window.VILLAGE_DATA || !window.VILLAGE_DATA.locations) {
    console.error("VILLAGE_DATA introuvable.");
    return;
  }

  var nativeLang = (window.S && window.S.nativeLang) ? window.S.nativeLang : 'en';

  // Utilisation directe du format tableau .forEach natif de ton data.js
  window.VILLAGE_DATA.locations.forEach(function(loc) {
    var node = document.createElement("div");
    node.className = "village-node";
    node.setAttribute("data-loc", loc.id);

    var locName = (window.LOC_NAMES && window.LOC_NAMES[loc.id] && window.LOC_NAMES[loc.id][nativeLang]) 
                  ? window.LOC_NAMES[loc.id][nativeLang] 
                  : loc.id;

    node.innerHTML = `
      <div class="node-bubble">
        <span class="node-icon">${loc.emoji || '🏠'}</span>
        ${loc.available !== false ? '<div class="node-badge"></div>' : ''}
      </div>
      <div class="node-label">${locName}</div>
    `;

    // Lien avec ton système d'ouverture d'origine
    node.onclick = function() {
      openLocation(loc);
    };

    node.onmouseenter = function() { showLocationTooltip(locName, node); };
    node.onmouseleave = function() { hideLocationTooltip(); };

    container.appendChild(node);
  });

  repositionAllNodes();
}

/**
 * Aligne au pixel près chaque icône HTML sur la ligne de repère correspondante du Canvas
 */
function repositionAllNodes() {
  if (!window.VILLAGE_DATA || !window.VILLAGE_DATA.locations) return;

  window.VILLAGE_DATA.locations.forEach(function(loc) {
    var node = document.querySelector(`.village-node[data-loc="${loc.id}"]`);
    if (!node) return;

    var rayType = "middle";
    var angle = 0;

    // Répartition équilibrée de ton catalogue de maisons sur les 3 anneaux
    if (loc.id === "cinema")      { rayType = "inner";  angle = 0; }
    else if (loc.id === "pak")     { rayType = "inner";  angle = 180; } 
    else if (loc.id === "zanmi")   { rayType = "middle"; angle = -45; }
    else if (loc.id === "polis")   { rayType = "middle"; angle = 45; }
    else if (loc.id === "lopital") { rayType = "outer";  angle = -120; }
    else if (loc.id === "fem")     { rayType = "outer";  angle = 120; }
    else if (loc.id === "legliz")  { rayType = "outer";  angle = -50; }
    else if (loc.id === "estasyon") { rayType = "middle"; angle = -135; }
    else if (loc.id === "bank")    { rayType = "middle"; angle = 135; }
    else if (loc.id === "taven")   { rayType = "outer";  angle = 50; }
    else if (loc.id === "lekol")   { rayType = "outer";  angle = 180; }

    var coords = calculateNodeCoordinates(rayType, angle);

    node.style.left = coords.x + "px";
    node.style.top = coords.y + "px";
  });
}

function showLocationTooltip(text, targetNode) {
  var tooltip = document.getElementById("locTooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "locTooltip";
    tooltip.className = "loc-tooltip";
    document.body.appendChild(tooltip);
  }
  tooltip.textContent = text;

  var rect = targetNode.getBoundingClientRect();
  tooltip.style.left = (rect.left + rect.width / 2) + "px";
  tooltip.style.top = rect.top + "px";
  tooltip.classList.add("active");
}

function hideLocationTooltip() {
  var tooltip = document.getElementById("locTooltip");
  if (tooltip) tooltip.classList.remove("active");
}

/**
 * Dessine les axes radiaux et les cercles concentriques marrons parfaits sur le Canvas
 */
function drawVillageCanvasBackground() {
  if (!window.ctx || !window.canvas) return;

  var w = window.canvas.width;
  var h = window.canvas.height;

  window.ctx.clearRect(0, 0, w, h);

  var realCenterX = w / 2;
  var realCenterY = h / 2;

  var r1 = VILLAGE_LAYOUT.radii.inner * villageScale;
  var r2 = VILLAGE_LAYOUT.radii.middle * villageScale;
  var r3 = VILLAGE_LAYOUT.radii.outer * villageScale;

  // Dessin des cercles
  window.ctx.strokeStyle = "rgba(139, 94, 60, 0.45)"; 
  window.ctx.lineWidth = Math.max(1.5, 2 * villageScale);
  window.ctx.setLineDash([]);

  [r1, r2, r3].forEach(function(radius) {
    window.ctx.beginPath();
    window.ctx.arc(realCenterX, realCenterY, radius, 0, Math.PI * 2);
    window.ctx.stroke();
  });

  // Dessin des axes directeurs (Lignes radiales de repère)
  var structuralAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  window.ctx.strokeStyle = "rgba(139, 94, 60, 0.2)";
  window.ctx.lineWidth = Math.max(1, 1 * villageScale);

  structuralAngles.forEach(function(angleDeg) {
    var angleRad = angleDeg * Math.PI / 180;
    window.ctx.beginPath();
    window.ctx.moveTo(realCenterX, realCenterY);
    window.ctx.lineTo(
      realCenterX + r3 * Math.cos(angleRad),
      realCenterY + r3 * Math.sin(angleRad)
    );
    window.ctx.stroke();
  });

  window.tick++;
  if (window.currentWeather === 'rain' || window.currentWeather === 'storm') {
    renderAdvancedRainDrops(w, h);
  }
}

/**
 * Effet de pluie fluide
 */
var rainDataStore = [];
function renderAdvancedRainDrops(w, h) {
  window.ctx.strokeStyle = "rgba(174, 219, 255, 0.25)";
  window.ctx.lineWidth = 1;

  if (rainDataStore.length === 0) {
    for (var i = 0; i < 40; i++) {
      rainDataStore.push({
        x: Math.random() * w,
        y: Math.random() * h,
        len: Math.random() * 12 + 10,
        speed: Math.random() * 6 + 10
      });
    }
  }

  rainDataStore.forEach(function(drop) {
    window.ctx.beginPath();
    window.ctx.moveTo(drop.x, drop.y);
    window.ctx.lineTo(drop.x - 0.5, drop.y + drop.len);
    window.ctx.stroke();

    drop.y += drop.speed;
    if (drop.y > h) {
      drop.y = -drop.len;
      drop.x = Math.random() * w;
    }
  });
}

/**
 * Boucle d'actualisation de la scène
 */
var villageLoopAnimationId = null;
function startVillageAnimationLoop() {
  if (villageLoopAnimationId) cancelAnimationFrame(villageLoopAnimationId);

  function animationFrameLoop() {
    drawVillageCanvasBackground();
    villageLoopAnimationId = requestAnimationFrame(animationFrameLoop);
  }
  animationFrameLoop();
}

/**
 * Panneau d'action PNJ d'origine re-connecté
 */
function openLocation(loc) {
  if (!loc) return;
  
  var panel = document.getElementById('villagePanel');
  var locTitle = document.getElementById('locTitle');
  var locWeather = document.getElementById('locWeather');
  
  var nativeLang = (window.S && window.S.nativeLang) ? window.S.nativeLang : 'en';
  var locName = (window.LOC_NAMES && window.LOC_NAMES[loc.id] && window.LOC_NAMES[loc.id][nativeLang]) 
                ? window.LOC_NAMES[loc.id][nativeLang] 
                : loc.id;
  
  if (locTitle) locTitle.textContent = (loc.emoji || '🏠') + ' ' + locName;
  if (locWeather) {
    var icons = window.WEATHER_ICONS || { sun: '☀️', rain: '🌧️', night: '🌙', storm: '⚡' };
    locWeather.textContent = icons[window.currentWeather] || '☀️';
  }
  
  if (loc.id === 'cinema') {
    if (typeof window.openCinema === 'function') window.openCinema();
    return;
  }
  
  var listEl = document.getElementById('npcList');
  if (!listEl) return;
  
  listEl.innerHTML = (loc.npcs || []).map(function(npc) {
    var role = typeof npc.role === 'object' ? (npc.role[nativeLang] || npc.role.en) : npc.role;
    return `
      <div class="npc-card" onclick="closeVillagePanel(); openDialogue('${loc.id}','${npc.id}')">
        <div class="npc-av">${npc.emoji || '👤'}</div>
        <div class="npc-info">
          <div class="npc-name">${npc.name}</div>
          <div class="npc-role">${role}</div>
        </div>
        <div class="npc-go">➔</div>
      </div>
    `;
  }).join('');
  
  if (panel) {
    panel.style.display = 'flex';
    setTimeout(function() { panel.classList.add('active'); }, 10);
  }
}

function closeVillagePanel() {
  var panel = document.getElementById('villagePanel');
  if (!panel) return;
  panel.classList.remove('active');
  setTimeout(function() { panel.style.display = 'none'; }, 300);
}

// Liaisons d'exécution globales
window.goVillage = goVillage;
window.closeVillagePanel = closeVillagePanel;
