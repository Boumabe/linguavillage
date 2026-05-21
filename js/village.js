// village.js - ENTIÈREMENT REVISÉ ET CORRIGÉ
// LinguaVillage — village.js
// Village canvas, météo, interactions, calculs trigonométriques synchro au pixel près
// ===============================================================================

// Variables globales du village synchronisées
window.canvas = null;
window.ctx = null;
window.tick = 0;
window.currentWeather = window.currentWeather || 'sun';
window.hoveredLoc = null;
window._onCanvasResize = null;

// Facteur d'échelle adaptatif pour la grille virtuelle
let villageScale = 1;
const baseWidth = 360;
const baseHeight = 740;

// Grille de coordonnées géométriques sacrées partagée entre le Canvas et le DOM
const VILLAGE_LAYOUT = {
  centerX: 180,
  centerY: 380,
  radii: {
    inner: 65,    // Cercle 1 : District central
    middle: 125,  // Cercle 2 : District intermédiaire
    outer: 180    // Cercle 3 : District périphérique
  }
};

// ================================================================
// NAVIGATION VERS LE VILLAGE
// ================================================================
function goVillage() {
  if (!window.S) return;
  
  // Rendre le conteneur du village actif
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

  // Initialisation ou ré-initialisation complète de l'interface
  initVillageEngine();
}

/**
 * Initialisation du Moteur Graphique et Structurel du Village
 */
function initVillageEngine() {
  console.log("🏘️ Initialisation du Village Visuel Pro...");

  window.canvas = document.getElementById("villageCanvas");
  if (!window.canvas) return;
  window.ctx = window.canvas.getContext("2d");

  // Vérification ou injection propre du conteneur d'éléments HTML superposés
  let elementsContainer = document.getElementById("village-elements-container");
  if (!elementsContainer) {
    elementsContainer = document.createElement("div");
    elementsContainer.id = "village-elements-container";
    window.canvas.parentNode.insertBefore(elementsContainer, window.canvas.nextSibling);
  }

  // Configuration de l'en-tête (HUD) accessible et interactif
  setupProfessionalHUD();

  // Dimensionnement initial adaptatif
  resizeVillagePro();

  // Attacher la fonction globale de redimensionnement de manière sécurisée
  window._onCanvasResize = resizeVillagePro;

  // Construction géométrique des boutons de lieux (Nodes)
  buildVillageNodes();

  // Démarrage de la boucle d'animation fluide pour le fond
  startVillageAnimationLoop();
}

/**
 * Injecte et configure la structure de l'en-tête haut de gamme pour l'accessibilité mobile
 */
function setupProfessionalHUD() {
  var hud = document.querySelector(".village-hud");
  if (!hud) return;

  var nativeLang = (window.S && window.S.nativeLang) ? window.S.nativeLang : 'en';

  // Injecter la structure bi-ligne professionnelle (Données utilisateur / Boutons d'actions rapides au pouce)
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

  // Attribution des événements sur les boutons du HUD mis à jour
  var btnMenu = document.getElementById('hudBtnMenu');
  if (btnMenu) {
    btnMenu.onclick = function() {
      if (typeof window.showScreen === 'function') window.showScreen('screen-menu');
    };
  }

  hud.querySelectorAll('.hud-btn-action').forEach(function(btn) {
    btn.onclick = function() {
      var act = btn.getAttribute('data-action');
      if (act === 'stats' && typeof window.showStats === 'function') window.showStats();
      else if (act === 'badge' && typeof window.showBadges === 'function') window.showBadges();
      else if (act === 'review' && typeof window.openReviewQuick === 'function') window.openReviewQuick();
      else if (act === 'shop' && typeof window.openShop === 'function') window.openShop();
      else if (act === 'reminders' && typeof window.openReminderSettings === 'function') window.openReminderSettings();
      else {
        if (typeof window.showNotif === 'function') window.showNotif("Fonctionnalité active sous peu !");
      }
    };
  });

  // Hydrater immédiatement les valeurs réelles contenues dans le State
  syncHUDValues();
}

/**
 * Synchronise les valeurs de l'état global du joueur avec les éléments du HUD
 */
function syncHUDValues() {
  if (!window.S) return;
  
  var hp = document.getElementById('hudPlayer');
  var hl = document.getElementById('hudLang');
  var hx = document.getElementById('hudXP');
  var sv = document.getElementById('streakVal');
  var hw = document.getElementById('hudWeather');

  if (hp) hp.textContent = '👤 ' + (window.S.playerName || 'Invité');
  if (hl) {
    var flag = (window.FLAGS && window.FLAGS[window.S.targetLang]) ? window.FLAGS[window.S.targetLang] : '';
    var name = (window.LANG_NAMES && window.LANG_NAMES[window.S.targetLang]) ? window.LANG_NAMES[window.S.targetLang] : (window.S.targetLang || '');
    hl.textContent = flag + ' ' + name.toUpperCase();
  }
  if (hx) hx.textContent = (window.S.xp || 0) + ' XP';
  if (sv) sv.textContent = window.S.streak || 0;
  if (hw) hw.textContent = window.WEATHER_ICONS[window.currentWeather] || '☀️';
}

/**
 * Redimensionnement dynamique et calcul du ratio d'adaptation d'écran (Scale)
 */
function resizeVillagePro() {
  if (!window.canvas) return;
  var container = window.canvas.parentElement;
  var w = container.clientWidth;
  var h = container.clientHeight;

  window.canvas.width = w;
  window.canvas.height = h;

  // Calcul du facteur d'échelle pour préserver le centrage virtuel du village
  villageScale = Math.min(w / baseWidth, h / baseHeight);

  // Forcer le repositionnement des éléments HTML pour suivre le redimensionnement du Canvas
  repositionAllNodes();
}

/**
 * Renvoie l'emplacement exact d'une maison sur l'écran en fonction de sa géométrie
 */
function calculateNodeCoordinates(rayType, angleDegrees) {
  // Ajustement à -90° pour démarrer au pôle Nord géométrique
  var angleRad = (angleDegrees - 90) * Math.PI / 180;
  
  // Récupération de la dimension de rayon configurée
  var radiusValue = VILLAGE_LAYOUT.radii[rayType] || VILLAGE_LAYOUT.radii.middle;

  // Calcul des coordonnées locales relatives à notre boîte virtuelle de 360x740
  var localX = VILLAGE_LAYOUT.centerX + radiusValue * Math.cos(angleRad);
  var localY = VILLAGE_LAYOUT.centerY + radiusValue * Math.sin(angleRad);

  // Conversion en coordonnées physiques réelles par rapport au centre absolu du conteneur de l'écran
  var currentWidth = window.canvas.width;
  var currentHeight = window.canvas.height;
  var realCenterX = currentWidth / 2;
  var realCenterY = currentHeight / 2;

  var x = realCenterX + (localX - VILLAGE_LAYOUT.centerX) * villageScale;
  var y = realCenterY + (localY - VILLAGE_LAYOUT.centerY) * villageScale;

  return { x: x, y: y };
}

/**
 * Instancie et injecte les Nodes du Village dans le DOM
 */
function buildVillageNodes() {
  var container = document.getElementById("village-elements-container");
  if (!container) return;
  container.innerHTML = ""; // Nettoyage de sécurité

  if (!window.VILLAGE_DATA || !window.VILLAGE_DATA.locations) {
    console.error("Erreur : Données de localisation VILLAGE_DATA manquantes.");
    return;
  }

  var nativeLang = (window.S && window.S.nativeLang) ? window.S.nativeLang : 'en';

  window.VILLAGE_DATA.locations.forEach(function(loc) {
    var node = document.createElement("div");
    node.className = "village-node";
    node.setAttribute("data-loc", loc.id);

    // Extraction du libellé selon la langue du joueur
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

    // Événement d'ouverture au clic tactile ou souris
    node.onclick = function() {
      openLocation(loc);
    };

    // Prise en charge des info-bulles contextuelles (Tooltips)
    node.onmouseenter = function() { showLocationTooltip(locName, node); };
    node.onmouseleave = function() { hideLocationTooltip(); };

    container.appendChild(node);
  });

  repositionAllNodes();
}

/**
 * Repositionne absolument chaque élément HTML pour correspondre au tracé du Canvas
 */
function repositionAllNodes() {
  if (!window.VILLAGE_DATA || !window.VILLAGE_DATA.locations) return;

  window.VILLAGE_DATA.locations.forEach(function(loc) {
    var node = document.querySelector(`.village-node[data-loc="${loc.id}"]`);
    if (!node) return;

    // Répartition stricte des cercles concentriques et des angles pour éviter toute superposition
    var rayType = "middle";
    var angle = 0;

    if (loc.id === "cinema")     { rayType = "inner";  angle = 0; }
    else if (loc.id === "pak")    { rayType = "inner";  angle = 180; } 
    else if (loc.id === "zanmi")  { rayType = "middle"; angle = -45; }
    else if (loc.id === "polis")  { rayType = "middle"; angle = 45; }
    else if (loc.id === "lopital") { rayType = "outer";  angle = -120; }
    else if (loc.id === "fem")     { rayType = "outer";  angle = 120; }
    else if (loc.id === "legliz")  { rayType = "outer";  angle = -60; }
    else if (loc.id === "estasyon"){ rayType = "middle"; angle = -135; }
    else if (loc.id === "bank")    { rayType = "middle"; angle = 135; }
    else if (loc.id === "taven")   { rayType = "outer";  angle = 60; }
    else if (loc.id === "lekol")   { rayType = "outer";  angle = 180; }

    var coords = calculateNodeCoordinates(rayType, angle);

    // Injection des styles de position brute
    node.style.left = coords.x + "px";
    node.style.top = coords.y + "px";
  });
}

/**
 * Gestion de l'affichage de l'infobulle
 */
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
 * Rendu graphique d'arrière-plan du Canvas (Cercles de repère parfaits)
 */
function drawVillageCanvasBackground() {
  if (!window.ctx || !window.canvas) return;

  var w = window.canvas.width;
  var h = window.canvas.height;

  window.ctx.clearRect(0, 0, w, h);

  var realCenterX = w / 2;
  var realCenterY = h / 2;

  // Récupération des trois rayons précis mis à l'échelle réelle de l'appareil
  var r1 = VILLAGE_LAYOUT.radii.inner * villageScale;
  var r2 = VILLAGE_LAYOUT.radii.middle * villageScale;
  var r3 = VILLAGE_LAYOUT.radii.outer * villageScale;

  window.ctx.strokeStyle = "rgba(139, 94, 60, 0.42)"; // Ta couleur marron d'origine adoucie pour faire pro
  window.ctx.lineWidth = Math.max(1.5, 2 * villageScale);
  window.ctx.setLineDash([]);

  // 1. Tracé des trois cercles concentriques de repère
  [r1, r2, r3].forEach(function(radius) {
    window.ctx.beginPath();
    window.ctx.arc(realCenterX, realCenterY, radius, 0, Math.PI * 2);
    window.ctx.stroke();
  });

  // 2. Tracé des rayons de structure en arrière-plan
  var structuralAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  window.ctx.strokeStyle = "rgba(139, 94, 60, 0.18)";
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

  // Incrément du cycle d'animation et traitement de la météo
  window.tick++;
  if (window.currentWeather === 'rain' || window.currentWeather === 'storm') {
    renderAdvancedRainDrops(w, h);
  }
}

/**
 * Système d'animation de pluie optimisé
 */
var rainDataStore = [];
function renderAdvancedRainDrops(w, h) {
  window.ctx.strokeStyle = "rgba(174, 219, 255, 0.22)";
  window.ctx.lineWidth = 1;
  window.ctx.setLineDash([]);

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
 * Gestionnaire de boucle d'animation
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

// ================================================================
// OUVERTURE D'UN LIEU & SYSTEME DE PNJ
// ================================================================
function openLocation(loc) {
  if (!loc) return;
  console.log("📍 Ouverture du lieu :", loc.id);
  
  var panel = document.getElementById('villagePanel');
  var locTitle = document.getElementById('locTitle');
  var locWeather = document.getElementById('locWeather');
  
  var nativeLang = (window.S && window.S.nativeLang) ? window.S.nativeLang : 'en';
  var locName = (window.LOC_NAMES && window.LOC_NAMES[loc.id] && window.LOC_NAMES[loc.id][nativeLang]) 
                ? window.LOC_NAMES[loc.id][nativeLang] 
                : loc.id;
  
  if (locTitle) locTitle.textContent = loc.emoji + ' ' + locName;
  if (locWeather) locWeather.textContent = window.WEATHER_ICONS[window.currentWeather] || '☀️';
  
  // Cas particulier du Cinéma — redirection immédiate
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

// Expositions et exports globaux pour l'application
window.goVillage = goVillage;
window.closeVillagePanel = closeVillagePanel;
