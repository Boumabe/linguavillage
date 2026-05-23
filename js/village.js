// village2.js — LINGUAVILLAGE V2 ULTRA RESPONSIVE
// ======================================================
// Nouveau moteur de village adaptatif
// Corrige définitivement :
// - zoom excessif
// - bâtiments coupés
// - mauvais scaling mobile
// - overflow canvas
// - problèmes Android viewport
// ======================================================

window.VILLAGE_CAMERA = {
  zoom: 1,
  padding: 80,
  minScale: 0.72,
  maxScale: 1,
};

window.VILLAGE2_CONFIG = {
  centerRadius: 0.08,

  rings: [
    { radius: 0.14, color: 'rgba(180,140,90,0.25)', width: 2 },
    { radius: 0.26, color: 'rgba(180,140,90,0.22)', width: 2 },
    { radius: 0.40, color: 'rgba(180,140,90,0.18)', width: 1.5 },
    { radius: 0.54, color: 'rgba(180,140,90,0.14)', width: 1.2 },
  ],

  buildingScale: {
    inner: 0.06,
    middle: 0.07,
    outer: 0.085,
  },

  hoverScale: 1.08,
  bobAmplitude: 1.8,
  bobSpeed: 0.02,
};

window.LOC_RING_MAP = {
  church:   [0, 90],
  school:   [0, 220],
  friends:  [0, 330],

  market:   [1, 30],
  tavern:   [1, 150],
  park:     [1, 270],

  hospital: [2, 70],
  bank:     [2, 180],
  station:  [2, 300],

  police:   [3, 10],
  factory:  [3, 230],
  cinema:   [3, 120],
};

function alignVillageLocations() {
  if (!window.LOCATIONS) return;

  const rings = VILLAGE2_CONFIG.rings;

  LOCATIONS.forEach(loc => {

    const map = LOC_RING_MAP[loc.id];
    if (!map) return;

    const ring = rings[map[0]];
    if (!ring) return;

    const angle = (map[1] - 90) * Math.PI / 180;

    loc._vx = 0.5 + Math.cos(angle) * ring.radius;
    loc._vy = 0.5 + Math.sin(angle) * ring.radius;
  });
}

function getViewportSize() {

  const vw =
    window.visualViewport?.width ||
    window.innerWidth ||
    360;

  const vh =
    window.visualViewport?.height ||
    window.innerHeight ||
    640;

  return { vw, vh };
}

function computeVillageScale(W, H) {

  const padding = VILLAGE_CAMERA.padding;

  const usableW = W - padding * 2;
  const usableH = H - padding * 2;

  const smallest = Math.min(usableW, usableH);

  const villageMaxRadius = 0.54;
  const buildingMax = 0.09;

  const required =
    villageMaxRadius + buildingMax;

  let scale =
    (smallest * 0.5) / (smallest * required);

  scale *= 0.90;

  scale = Math.max(
    VILLAGE_CAMERA.minScale,
    Math.min(scale, VILLAGE_CAMERA.maxScale)
  );

  return scale;
}

function initVillage2() {

  window.canvas =
    document.getElementById('villageCanvas');

  if (!canvas) return;

  window.ctx = canvas.getContext('2d');

  const dpr = window.devicePixelRatio || 1;

  const hud =
    document.querySelector('.village-hud');

  const hudH =
    hud?.getBoundingClientRect().height || 0;

  const { vw, vh } = getViewportSize();

  const canvasW = vw;
  const canvasH = vh - hudH;

  canvas.width = canvasW * dpr;
  canvas.height = canvasH * dpr;

  canvas.style.width = canvasW + 'px';
  canvas.style.height = canvasH + 'px';

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  alignVillageLocations();

  window.VILLAGE_CAMERA.zoom =
    computeVillageScale(canvasW, canvasH);

  requestAnimationFrame(village2Loop);
}

function village2Loop() {

  drawVillage2();

  requestAnimationFrame(village2Loop);
}

function drawVillage2() {

  if (!canvas || !ctx) return;

  const dpr = window.devicePixelRatio || 1;

  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  drawVillageBackground(W, H);

  const cx = W * 0.5;
  const cy = H * 0.5;

  const rawSize =
    Math.min(W, H);

  const minDim =
    rawSize *
    VILLAGE_CAMERA.zoom;

  drawVillageGround(cx, cy, minDim);

  drawVillageRings(cx, cy, minDim);

  drawVillageRoads(cx, cy, minDim);

  drawVillageCenter(cx, cy, minDim);

  if (window.LOCATIONS) {

    LOCATIONS.forEach(loc => {

      drawVillageBuilding(
        loc,
        cx,
        cy,
        minDim
      );
    });
  }
}

function drawVillageBackground(W, H) {

  const g =
    ctx.createLinearGradient(
      0,
      0,
      0,
      H
    );

  g.addColorStop(0, '#0d1117');
  g.addColorStop(1, '#111827');

  ctx.fillStyle = g;

  ctx.fillRect(0, 0, W, H);
}

function drawVillageGround(cx, cy, size) {

  const g =
    ctx.createRadialGradient(
      cx,
      cy,
      size * 0.05,
      cx,
      cy,
      size * 0.65
    );

  g.addColorStop(0, '#234d20');
  g.addColorStop(1, '#0f2410');

  ctx.fillStyle = g;

  ctx.beginPath();

  ctx.arc(
    cx,
    cy,
    size * 0.65,
    0,
    Math.PI * 2
  );

  ctx.fill();
}

function drawVillageRings(cx, cy, size) {

  VILLAGE2_CONFIG.rings.forEach(ring => {

    ctx.beginPath();

    ctx.arc(
      cx,
      cy,
      size * ring.radius,
      0,
      Math.PI * 2
    );

    ctx.strokeStyle = ring.color;

    ctx.lineWidth = ring.width;

    ctx.stroke();
  });
}

function drawVillageRoads(cx, cy, size) {

  if (!window.LOCATIONS) return;

  ctx.strokeStyle =
    'rgba(255,255,255,0.06)';

  ctx.lineWidth = 1.2;

  LOCATIONS.forEach(loc => {

    const x =
      cx + (loc._vx - 0.5) * size;

    const y =
      cy + (loc._vy - 0.5) * size;

    ctx.beginPath();

    ctx.moveTo(cx, cy);

    ctx.lineTo(x, y);

    ctx.stroke();
  });
}

function drawVillageCenter(cx, cy, size) {

  const r =
    size *
    VILLAGE2_CONFIG.centerRadius;

  const g =
    ctx.createRadialGradient(
      cx,
      cy,
      r * 0.2,
      cx,
      cy,
      r
    );

  g.addColorStop(0, '#ffe082');
  g.addColorStop(1, '#c58f00');

  ctx.fillStyle = g;

  ctx.beginPath();

  ctx.arc(
    cx,
    cy,
    r,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.font =
    `${r * 0.9}px serif`;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillText('🏡', cx, cy);
}

function drawVillageBuilding(
  loc,
  cx,
  cy,
  size
) {

  const map =
    LOC_RING_MAP[loc.id];

  if (!map) return;

  const ringIndex = map[0];

  let scale =
    VILLAGE2_CONFIG.buildingScale.middle;

  if (ringIndex === 0)
    scale =
      VILLAGE2_CONFIG.buildingScale.inner;

  if (ringIndex >= 2)
    scale =
      VILLAGE2_CONFIG.buildingScale.outer;

  const radius =
    size * scale;

  const x =
    cx + (loc._vx - 0.5) * size;

  const y =
    cy + (loc._vy - 0.5) * size;

  const grad =
    ctx.createRadialGradient(
      x - radius * 0.2,
      y - radius * 0.2,
      1,
      x,
      y,
      radius
    );

  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(1, loc.color);

  ctx.fillStyle = grad;

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    radius,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.lineWidth = 2;

  ctx.strokeStyle =
    'rgba(0,0,0,0.4)';

  ctx.stroke();

  ctx.font =
    `${radius * 0.9}px serif`;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillText(
    loc.emoji,
    x,
    y
  );

  const nativeLang =
    window.S?.nativeLang || 'fr';

  const name =
    LOC_NAMES?.[loc.id]?.[nativeLang]
    || loc.id;

  ctx.font =
    `bold ${Math.max(10, radius * 0.22)}px Nunito`;

  ctx.fillStyle =
    'rgba(255,255,255,0.95)';

  ctx.fillText(
    name,
    x,
    y + radius + 18
  );
}

window.addEventListener(
  'resize',
  () => {

    initVillage2();
  }
);

window.addEventListener(
  'orientationchange',
  () => {

    setTimeout(() => {

      initVillage2();

    }, 200);
  }
);

// ======================================================
// INITIALISATION
// ======================================================

setTimeout(() => {

  initVillage2();

}, 200);
