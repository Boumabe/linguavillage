// LinguaVillage — village.js
// Village canvas : dessin, météo, interactions, ouverture des lieux
// Modifier ici pour ajouter des lieux ou changer le rendu du village

function goVillage() {
  if (!window.S) return;
  const hudPlayer = document.getElementById('hudPlayer');
  const hudLang   = document.getElementById('hudLang');
  const hudXP     = document.getElementById('hudXP');
  if (hudPlayer) hudPlayer.textContent = '👤 ' + S.playerName;
  if (hudLang)   hudLang.textContent   = (FLAGS[S.targetLang]||'')+' '+(LANG_NAMES[S.targetLang]||'');
  if (hudXP)     hudXP.textContent     = (S.xp||0)+' XP';
  showScreen('screen-village');
  initCanvas();
  setWeather(getWeatherForTime());
  setInterval(updateTime, 30000);
  updateTime();
  player.x=HOME.x; player.y=HOME.y;
  player.dest=null; player.walking=false; player.currentLoc='home';
  setTimeout(() => addCEFRIndicator(), 100);
}

// MÉTÉO
function getWeatherForTime() {
  const h = new Date().getHours();
  if (h >= 21 || h < 6) return 'night';
  return ['sun', 'sun', 'rain', 'wind', 'snow'][Math.floor(Math.random() * 5)];
}

function setWeather(w) {
  currentWeather = w;
  const hudWeather = document.getElementById('hudWeather');
  if (hudWeather) hudWeather.textContent = WEATHER_ICONS[w] || '☀️';
  buildWeatherFX(w);
}

function buildWeatherFX(w) {
  const o = document.getElementById('weatherOverlay');
  if (!o) return;
  o.innerHTML = '';
  if (w === 'rain') {
    for (let i = 0; i < 60; i++) {
      const d = document.createElement('div');
      d.className = 'rain-drop';
      d.style.cssText = `left:${Math.random() * 110 - 5}%;height:${60 + Math.random() * 80}px;top:-${60 + Math.random() * 80}px;animation-duration:${0.4 + Math.random() * 0.4}s;animation-delay:${Math.random() * 2}s;opacity:${0.3 + Math.random() * 0.4}`;
      o.appendChild(d);
    }
  } else if (w === 'snow') {
    for (let i = 0; i < 40; i++) {
      const d = document.createElement('div');
      d.className = 'snow-flake';
      d.textContent = '❄';
      d.style.cssText = `left:${Math.random() * 100}%;font-size:${8 + Math.random() * 10}px;animation-duration:${3 + Math.random() * 4}s;animation-delay:${Math.random() * 5}s;opacity:${0.5 + Math.random() * 0.4}`;
      o.appendChild(d);
    }
  }
}

function updateTime() {
  const n = new Date();
  const hudTime = document.getElementById('hudTime');
  if (hudTime) hudTime.textContent = `${n.getHours().toString().padStart(2, '0')}:${n.getMinutes().toString().padStart(2, '0')}`;
}

// VILLAGE CANVAS
function initCanvas() {
  if (canvas) return;
  canvas = document.getElementById('villageCanvas');
  if (!canvas) return;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  ctx = canvas.getContext('2d');
  
  window.addEventListener('resize', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  });
  canvas.addEventListener('click', onVillageClick);
  canvas.addEventListener('mousemove', onVillageHover);
  canvas.addEventListener('touchstart', onVillageTouch, { passive: true });
  requestAnimationFrame(villageLoop);
}

function villageLoop() {
  tick++;
  updatePlayer();
  drawVillage();
  requestAnimationFrame(villageLoop);
}

function drawVillage() {
  if (!canvas || !ctx) return;
  const W=canvas.width, H=canvas.height;
  const cx=W*0.5, cy=H*0.5;
  const night=currentWeather==='night';
  const sky=ctx.createLinearGradient(0,0,0,H);
  if(night){sky.addColorStop(0,'#01020a');sky.addColorStop(1,'#0a0a1e');}
  else if(currentWeather==='rain'){sky.addColorStop(0,'#1a2535');sky.addColorStop(1,'#2a3848');}
  else{sky.addColorStop(0,'#1a3a1a');sky.addColorStop(1,'#2d5a2d');}
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
  if(night){
    ctx.beginPath(); ctx.arc(W*0.85,H*0.08,14,0,Math.PI*2);
    ctx.fillStyle='#f0e0a0'; ctx.fill();
    for(let i=0;i<50;i++){
      const sx=(Math.sin(i*437)*0.5+0.5)*W, sy=(Math.sin(i*293)*0.5+0.5)*H*0.4;
      ctx.beginPath(); ctx.arc(sx,sy,1,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,200,'+(0.4+0.5*Math.sin(tick*0.02+i))+')'; ctx.fill();
    }
  } else {
    ctx.beginPath(); ctx.arc(W*0.85,H*0.08,18,0,Math.PI*2);
    ctx.fillStyle=currentWeather==='rain'?'#7a8898':'#ffe0a0'; ctx.fill();
  }
  const grass=ctx.createRadialGradient(cx,cy,0,cx,cy,W*0.55);
  grass.addColorStop(0,currentWeather==='snow'?'#d0d8e0':'#3a6b30');
  grass.addColorStop(1,currentWeather==='snow'?'#b0b8c0':'#1e3d1a');
  ctx.fillStyle=grass; ctx.fillRect(0,0,W,H);
  const rings=[
    {r:W*0.46,color:'rgba(160,130,80,0.25)'},{r:W*0.32,color:'rgba(160,130,80,0.30)'},
    {r:W*0.20,color:'rgba(160,130,80,0.38)'},{r:W*0.10,color:'rgba(160,130,80,0.50)'}
  ];
  rings.forEach(ring=>{
    ctx.beginPath(); ctx.arc(cx,cy,ring.r,0,Math.PI*2);
    ctx.fillStyle=ring.color; ctx.fill();
  });
  const wallRadii=[W*0.46,W*0.32,W*0.20,W*0.10];
  const wallColors=['#8a7040','#9a8050','#aa9060','#c0a870'];
  wallRadii.forEach((r,i)=>{
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.strokeStyle=wallColors[i]; ctx.lineWidth=Math.max(3,W*0.012); ctx.stroke();
  });
  // Maison du joueur
  drawPlayerHome(cx, cy, W);
  // Lieux
  LOCATIONS.forEach(loc=>{
    const bob=Math.sin(tick*0.025+loc.x*10)*1.5;
    drawLoc(loc,loc.x*W,loc.y*H+bob,loc.w*W,loc.h*H,hoveredLoc===loc.id);
  });
  // Ligne de marche
  if(player.dest){
    ctx.beginPath(); ctx.moveTo(player.x*W,player.y*H);
    ctx.lineTo(player.dest.x*W,player.dest.y*H);
    ctx.strokeStyle='rgba(255,215,0,0.3)'; ctx.lineWidth=2;
    ctx.setLineDash([4,7]); ctx.stroke(); ctx.setLineDash([]);
  }
  // Personnage
  drawPlayerCharacter(W, H);
  if(currentWeather==='rain'){
    ctx.fillStyle='rgba(0,10,30,0.12)'; ctx.fillRect(0,0,W,H);
  }
}

function drawLoc(loc, x, y, w, h, hov) {
  if (!ctx) return;
  const a = hov ? 1 : 0.85;
  const night = currentWeather === 'night';
  const r = Math.min(w, h) * 0.5;
  const bx = x + w * 0.5, by = y + h * 0.5;
  
  ctx.beginPath();
  ctx.arc(bx + 3, by + 4, r, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.30)';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(bx, by, r, 0, Math.PI * 2);
  ctx.fillStyle = hexA(loc.color, a * (night ? 0.6 : 1));
  ctx.fill();
  
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
  
  if (night) {
    ctx.fillStyle = 'rgba(255,215,100,0.6)';
    ctx.fillRect(bx - r * 0.3, by - r * 0.15, r * 0.22, r * 0.22);
    ctx.fillRect(bx + r * 0.08, by - r * 0.15, r * 0.22, r * 0.22);
  }
  
  ctx.font = Math.min(w, h) * 0.38 + 'px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(loc.emoji, bx, by);
  
  const nm = LOC_NAMES[loc.id] ? LOC_NAMES[loc.id][S.nativeLang] || loc.id : loc.id;
  ctx.font = 'bold ' + Math.max(8, Math.min(w * 0.14, 11)) + 'px Nunito,sans-serif';
  ctx.fillStyle = hov ? '#FFD700' : 'rgba(255,240,200,0.9)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(nm, bx, by + r + 4);
}

function hexA(h, a) {
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function darken(h) {
  return '#' + [1, 3, 5].map(i => Math.max(0, parseInt(h.slice(i, i + 2), 16) - 40).toString(16).padStart(2, '0')).join('');
}

function getLocAt(mx, my) {
  const W = canvas.width, H = canvas.height;
  return LOCATIONS.find(loc => {
    const bx = loc.x * W + loc.w * W * 0.5;
    const by = loc.y * H + loc.h * H * 0.5;
    const r = Math.min(loc.w * W, loc.h * H) * 0.5;
    const dx = mx - bx, dy = my - by;
    return dx * dx + dy * dy <= r * r;
  });
}

function onVillageHover(e) {
  const rect = canvas.getBoundingClientRect();
  const loc = getLocAt(e.clientX - rect.left, e.clientY - rect.top);
  hoveredLoc = loc ? loc.id : null;
  const tip = document.getElementById('locTooltip');
  if (loc && tip) {
    const nm = LOC_NAMES[loc.id] ? LOC_NAMES[loc.id][S.nativeLang] || loc.id : loc.id;
    const ds = LOC_DESC[loc.id] ? LOC_DESC[loc.id][S.nativeLang] || '' : '';
    tip.textContent = WEATHER_ICONS[currentWeather] + ' ' + nm + ' — ' + ds;
    tip.style.left = (loc.x * canvas.width + loc.w * canvas.width / 2) + 'px';
    tip.style.top = (loc.y * canvas.height) + 'px';
    tip.classList.add('show');
  } else if (tip) {
    tip.classList.remove('show');
  }
}

function onVillageClick(e) {
  const rect = canvas.getBoundingClientRect();
  const loc = getLocAt(e.clientX - rect.left, e.clientY - rect.top);
  if (loc) openLoc(loc);
}

function onVillageTouch(e) {
  const rect = canvas.getBoundingClientRect();
  const t = e.touches[0];
  const loc = getLocAt(t.clientX - rect.left, t.clientY - rect.top);
  if (loc) openLoc(loc);
}

// LOCATION
function openLoc(loc) {
  if (!window.S) return;
  S.currentLoc = loc;

  const locTitle   = document.getElementById('locTitle');
  const locWeather = document.getElementById('locWeather');
  // Safe access - LOC_NAMES may not have all loc ids
  const locName = (LOC_NAMES[loc.id] && LOC_NAMES[loc.id][S.nativeLang]) || loc.id;
  if (locTitle)   locTitle.textContent   = loc.emoji + ' ' + locName;
  if (locWeather) locWeather.textContent = WEATHER_ICONS[currentWeather] || '☀️';

  // Cinéma — ouverture directe
  if (loc.id === 'cinema') {
    openCinema();
    return;
  }

  const listEl = document.getElementById('npcList');
  if (!listEl) return;

  listEl.innerHTML = loc.npcs.map(npc => {
    const role = typeof npc.role === 'object' ? (npc.role[S.nativeLang] || npc.role.en) : npc.role;
    const hint = (LOC_DESC[loc.id] && LOC_DESC[loc.id][S.nativeLang]) || '';
    return '<div class="npc-card" onclick="openDialogue('+JSON.stringify(loc.id)+','+JSON.stringify(npc.id)+')">'
      + '<div class="npc-av">' + npc.emoji + '</div>'
      + '<div class="npc-info">'
      + '<div class="npc-name">' + npc.name + '</div>'
      + '<div class="npc-role">' + role + '</div>'
      + (hint ? '<div class="npc-hint">💬 ' + hint + '</div>' : '')
      + '</div>'
      + '<span style="color:var(--dim);font-size:1.2rem">›</span>'
      + '</div>';
  }).join('');

  showScreen('screen-location');

  setTimeout(function() {
    if (typeof openMissionsPanel === 'function') openMissionsPanel(loc.id);
  }, 400);
}

// DIALOGUE — AVEC SPELL CHECKER ET API
