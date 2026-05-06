// LinguaVillage — sprites.js
// Sprites SVG animés pour les PNJ : neutre, sourire, confus, enthousiaste
// Zéro dépendance — SVG inline + CSS animations
// Exposé via window.LV_SPRITES
// ================================================================

window.LV_SPRITES = (function() {

  // ── Expressions SVG par type de PNJ ────────────────────────
  // 4 expressions : neutral | happy | confused | excited
  // Chaque sprite = SVG 80×100 self-contained

  const EXPRESSIONS = {
    neutral:  { eyes:'normal',  mouth:'neutral',  color:'#ffd700', label:'En attente...' },
    happy:    { eyes:'happy',   mouth:'smile',    color:'#4ecf70', label:'Bonne réponse !' },
    confused: { eyes:'confused', mouth:'worried', color:'#ff9f43', label:'Essaie encore...' },
    excited:  { eyes:'excited',  mouth:'big_smile', color:'#c084fc', label:'Excellent !' },
  };

  // ── Générateur SVG par archétype de PNJ ─────────────────────
  function _buildSVG(archetype, expression) {
    const expr = EXPRESSIONS[expression] || EXPRESSIONS.neutral;

    // Paramètres visuels par archétype
    const archetypes = {
      teacher:    { skinTone:'#f5c2a0', hairColor:'#4a3020', hairStyle:'bun',    accessory:'glasses', robe:'#2a4a8a' },
      merchant:   { skinTone:'#d4956a', hairColor:'#8B4513', hairStyle:'short',  accessory:'apron',   robe:'#6b3a1e' },
      doctor:     { skinTone:'#fde9d4', hairColor:'#2a2a2a', hairStyle:'neat',   accessory:'stethoscope', robe:'#e8f4ff' },
      pastor:     { skinTone:'#c8946a', hairColor:'#1a1a1a', hairStyle:'none',   accessory:'collar',  robe:'#1a1a3a' },
      farmer:     { skinTone:'#b8793a', hairColor:'#7a5020', hairStyle:'hat',    accessory:'hoe',     robe:'#5a8a40' },
      bartender:  { skinTone:'#e8b090', hairColor:'#5a3010', hairStyle:'medium', accessory:'mustache', robe:'#3a1a0a' },
      officer:    { skinTone:'#f0c890', hairColor:'#2a1a0a', hairStyle:'cap',    accessory:'badge',   robe:'#1a3a6a' },
      banker:     { skinTone:'#f5d5b5', hairColor:'#3a2a10', hairStyle:'slick',  accessory:'tie',     robe:'#1a1a2a' },
      nurse:      { skinTone:'#fde0c8', hairColor:'#5a2a10', hairStyle:'ponytail', accessory:'cap',   robe:'#e8fffe' },
      friend:     { skinTone:'#d4a56a', hairColor:'#5a3510', hairStyle:'curly',  accessory:'none',    robe:'#ff6b9a' },
      default:    { skinTone:'#d4956a', hairColor:'#4a3020', hairStyle:'short',  accessory:'none',    robe:'#4a6a9a' },
    };

    const at = archetypes[archetype] || archetypes.default;

    // Yeux selon expression
    const eyes = {
      normal:   `<ellipse cx="32" cy="35" rx="4" ry="4.5" fill="#2a1a0a"/><ellipse cx="48" cy="35" rx="4" ry="4.5" fill="#2a1a0a"/><circle cx="33" cy="33.5" r="1.2" fill="white"/><circle cx="49" cy="33.5" r="1.2" fill="white"/>`,
      happy:    `<path d="M28 35 Q32 30 36 35" stroke="#2a1a0a" stroke-width="2.5" fill="none"/><path d="M44 35 Q48 30 52 35" stroke="#2a1a0a" stroke-width="2.5" fill="none"/>`,
      confused: `<ellipse cx="32" cy="35" rx="4" ry="4.5" fill="#2a1a0a"/><ellipse cx="48" cy="35" rx="4" ry="4.5" fill="#2a1a0a"/><path d="M28 28 Q32 26 36 29" stroke="#2a1a0a" stroke-width="2" fill="none"/><path d="M44 30 Q48 26 52 28" stroke="#2a1a0a" stroke-width="2" fill="none"/>`,
      excited:  `<circle cx="32" cy="35" r="5" fill="#2a1a0a"/><circle cx="48" cy="35" r="5" fill="#2a1a0a"/><circle cx="33.5" cy="33" r="1.8" fill="white"/><circle cx="49.5" cy="33" r="1.8" fill="white"/><path d="M26 28 Q32 24 38 27" stroke="${expr.color}" stroke-width="2" fill="none"/><path d="M42 27 Q48 24 54 28" stroke="${expr.color}" stroke-width="2" fill="none"/>`,
    };

    // Bouches selon expression
    const mouths = {
      neutral:   `<path d="M34 48 Q40 51 46 48" stroke="#8a4a20" stroke-width="2" fill="none" stroke-linecap="round"/>`,
      smile:     `<path d="M31 46 Q40 55 49 46" stroke="#8a4a20" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M31 46 Q40 56 49 46" fill="#ff9a9a" opacity="0.4"/>`,
      worried:   `<path d="M34 51 Q40 46 46 51" stroke="#8a4a20" stroke-width="2" fill="none" stroke-linecap="round"/>`,
      big_smile: `<path d="M28 44 Q40 58 52 44" stroke="#8a4a20" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="40" cy="52" rx="8" ry="5" fill="#ff9a9a" opacity="0.3"/>`,
    };

    // Corps selon la robe
    const bodyColor = at.robe;

    // Accessoire
    let accessoryHTML = '';
    if (at.accessory === 'glasses') {
      accessoryHTML = `<circle cx="31" cy="35" r="7" stroke="#8a6020" stroke-width="1.5" fill="none" opacity="0.7"/><circle cx="49" cy="35" r="7" stroke="#8a6020" stroke-width="1.5" fill="none" opacity="0.7"/><line x1="38" y1="35" x2="42" y2="35" stroke="#8a6020" stroke-width="1.5" opacity="0.7"/>`;
    } else if (at.accessory === 'stethoscope') {
      accessoryHTML = `<path d="M30 75 Q40 85 50 75" stroke="#c0c0c0" stroke-width="2" fill="none"/><circle cx="40" cy="88" r="4" stroke="#c0c0c0" stroke-width="2" fill="none"/>`;
    } else if (at.accessory === 'tie') {
      accessoryHTML = `<polygon points="40,68 36,80 40,95 44,80" fill="#ff4040" opacity="0.9"/><rect x="37" y="66" width="6" height="4" fill="#cc2020"/>`;
    } else if (at.accessory === 'badge') {
      accessoryHTML = `<rect x="25" y="72" width="12" height="8" rx="1" fill="#ffd700" opacity="0.9"/><rect x="26" y="73" width="10" height="6" rx="1" fill="#c0a000"/>`;
    }

    // Cheveux
    let hairHTML = '';
    if (at.hairStyle === 'bun') {
      hairHTML = `<ellipse cx="40" cy="18" rx="16" ry="12" fill="${at.hairColor}"/><circle cx="40" cy="12" r="7" fill="${at.hairColor}"/>`;
    } else if (at.hairStyle === 'short') {
      hairHTML = `<ellipse cx="40" cy="18" rx="16" ry="10" fill="${at.hairColor}"/>`;
    } else if (at.hairStyle === 'curly') {
      hairHTML = `<ellipse cx="40" cy="17" rx="17" ry="11" fill="${at.hairColor}"/><circle cx="26" cy="22" r="5" fill="${at.hairColor}"/><circle cx="54" cy="22" r="5" fill="${at.hairColor}"/><circle cx="33" cy="14" r="4" fill="${at.hairColor}"/><circle cx="47" cy="14" r="4" fill="${at.hairColor}"/>`;
    } else if (at.hairStyle === 'neat') {
      hairHTML = `<ellipse cx="40" cy="18" rx="16" ry="10" fill="${at.hairColor}"/><rect x="24" y="18" width="32" height="6" fill="${at.hairColor}"/>`;
    } else if (at.hairStyle === 'slick') {
      hairHTML = `<ellipse cx="40" cy="17" rx="16" ry="9" fill="${at.hairColor}"/><path d="M24 20 Q40 12 56 20" fill="${at.hairColor}"/>`;
    } else if (at.hairStyle === 'hat') {
      hairHTML = `<rect x="22" y="12" width="36" height="4" fill="#5a3010" rx="2"/><rect x="28" y="2" width="24" height="12" fill="#4a2808" rx="2"/>`;
    } else if (at.hairStyle === 'cap') {
      hairHTML = `<ellipse cx="40" cy="18" rx="18" ry="8" fill="#1a3a6a"/><rect x="22" y="14" width="36" height="7" fill="#1a3a6a"/><rect x="16" y="18" width="12" height="4" fill="#1a3a6a" rx="1"/>`;
    } else if (at.hairStyle === 'ponytail') {
      hairHTML = `<ellipse cx="40" cy="18" rx="16" ry="10" fill="${at.hairColor}"/><path d="M56 20 Q65 30 58 45" stroke="${at.hairColor}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    } else if (at.hairStyle === 'medium') {
      hairHTML = `<ellipse cx="40" cy="18" rx="16" ry="11" fill="${at.hairColor}"/><rect x="24" y="20" width="6" height="18" fill="${at.hairColor}" rx="3"/><rect x="50" y="20" width="6" height="18" fill="${at.hairColor}" rx="3"/>`;
    }

    const isExcited = expression === 'excited';
    const anim = isExcited ? 'lv-bounce-anim' : (expression === 'happy' ? 'lv-sway-anim' : '');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 110" width="80" height="100" class="${anim}">
  <defs>
    <style>
      @keyframes lv-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      @keyframes lv-sway   { 0%,100%{transform:rotate(0deg)} 33%{transform:rotate(2deg)} 66%{transform:rotate(-2deg)} }
      .lv-bounce-anim { animation: lv-bounce 0.6s ease-in-out 3; }
      .lv-sway-anim   { animation: lv-sway 1s ease-in-out infinite; transform-origin: 40px 100px; }
    </style>
    <radialGradient id="glow_${archetype}" cx="50%" cy="30%" r="60%">
      <stop offset="0%" stop-color="${expr.color}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${expr.color}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Halo d'émotion -->
  <ellipse cx="40" cy="30" rx="36" ry="30" fill="url(#glow_${archetype})"/>

  <!-- Corps -->
  <path d="M18 68 Q20 58 40 57 Q60 58 62 68 L65 110 H15 Z" fill="${bodyColor}"/>

  <!-- Cou -->
  <rect x="34" y="54" width="12" height="8" fill="${at.skinTone}" rx="2"/>

  <!-- Tête -->
  <ellipse cx="40" cy="32" rx="18" ry="20" fill="${at.skinTone}"/>

  <!-- Cheveux -->
  ${hairHTML}

  <!-- Sourcils -->
  <path d="M28 26 Q32 24 36 26" stroke="${at.hairColor}" stroke-width="1.8" fill="none"/>
  <path d="M44 26 Q48 24 52 26" stroke="${at.hairColor}" stroke-width="1.8" fill="none"/>

  <!-- Yeux -->
  ${eyes[EXPRESSIONS[expression]?.eyes] || eyes.normal}

  <!-- Nez -->
  <path d="M38 38 Q40 43 42 38" stroke="${at.skinTone === '#fde9d4' ? '#daa07a' : '#9a6030'}" stroke-width="1.5" fill="none"/>

  <!-- Bouche -->
  ${mouths[EXPRESSIONS[expression]?.mouth] || mouths.neutral}

  <!-- Joues (rouge sur happy/excited) -->
  ${['happy','excited'].includes(expression) ? `<ellipse cx="28" cy="44" rx="5" ry="3" fill="#ff9090" opacity="0.4"/><ellipse cx="52" cy="44" rx="5" ry="3" fill="#ff9090" opacity="0.4"/>` : ''}

  <!-- Accessoires -->
  ${accessoryHTML}

  <!-- Bras -->
  <path d="M20 68 Q14 80 18 95" stroke="${bodyColor}" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M60 68 Q66 80 62 95" stroke="${bodyColor}" stroke-width="8" fill="none" stroke-linecap="round"/>
</svg>`;
  }

  // ── Cache des sprites générés ────────────────────────────────
  const _cache = {};

  function getSprite(archetype, expression) {
    const key = `${archetype}_${expression}`;
    if (!_cache[key]) _cache[key] = _buildSVG(archetype, expression);
    return _cache[key];
  }

  // ── Montrer une expression sur le sprite affiché ────────────
  let _currentExpression = 'neutral';
  let _exprTimer = null;

  function setExpression(expression, durationMs) {
    const container = document.getElementById('npc-sprite-container');
    if (!container) return;
    _currentExpression = expression;

    const archetype = container.dataset.archetype || 'default';
    container.innerHTML = getSprite(archetype, expression);

    // Label d'émotion
    const label = document.getElementById('npc-sprite-label');
    if (label) {
      const expr = EXPRESSIONS[expression];
      label.textContent = expr ? expr.label : '';
      label.style.color = expr ? expr.color : '#ffd700';
      label.style.opacity = '1';
      setTimeout(() => { if(label) label.style.opacity = '0'; }, 2000);
    }

    // Retour à neutral après durationMs
    if (durationMs && durationMs > 0) {
      clearTimeout(_exprTimer);
      _exprTimer = setTimeout(() => setExpression('neutral', 0), durationMs);
    }
  }

  // ── Initialiser le sprite dans l'interface de dialogue ───────
  function initInDialogue(npc) {
    const dialHeader = document.querySelector('.dial-header');
    if (!dialHeader) return;

    // Créer le conteneur sprite s'il n'existe pas
    let wrap = document.getElementById('npc-sprite-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'npc-sprite-wrap';
      wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;flex-shrink:0;';

      const container = document.createElement('div');
      container.id = 'npc-sprite-container';
      container.style.cssText = 'width:70px;height:88px;';

      const label = document.createElement('div');
      label.id = 'npc-sprite-label';
      label.style.cssText = 'font-size:0.6rem;font-weight:700;text-align:center;'
        + 'opacity:0;transition:opacity 0.3s;min-height:14px;color:#ffd700;';

      wrap.appendChild(container);
      wrap.appendChild(label);
      dialHeader.insertBefore(wrap, dialHeader.firstChild);
    }

    // Définir l'archétype selon le NPC
    const container = document.getElementById('npc-sprite-container');
    if (container) {
      const archetype = _getNPCArchetype(npc);
      container.dataset.archetype = archetype;
      container.innerHTML = getSprite(archetype, 'neutral');
    }
  }

  // ── Correspondance NPC → archétype ──────────────────────────
  function _getNPCArchetype(npc) {
    if (!npc) return 'default';
    const id = npc.id || '';
    const role = (typeof npc.role === 'string' ? npc.role : (npc.role && npc.role.en)) || '';
    const map = {
      'teacher':'teacher', 'professeur':'teacher', 'professor':'teacher',
      'vendor':'merchant',  'vendeur':'merchant',   'marchande':'merchant',
      'doctor':'doctor',    'médecin':'doctor',      'docteur':'doctor',
      'pastor':'pastor',    'pasteur':'pastor',
      'farmer':'farmer',    'fermier':'farmer',
      'bartender':'bartender', 'barman':'bartender',
      'officer':'officer',  'policier':'officer',   'police':'officer',
      'banker':'banker',    'banquier':'banker',
      'nurse':'nurse',      'infirmier':'nurse',     'infirmière':'nurse',
      'friend':'friend',    'ami':'friend',          'amie':'friend',
    };
    for (const [key, val] of Object.entries(map)) {
      if (id.includes(key) || role.toLowerCase().includes(key)) return val;
    }
    return 'default';
  }

  // ── Réagir aux événements du dialogue ────────────────────────
  function reactToCorrection(isCorrect) {
    setExpression(isCorrect ? 'happy' : 'confused', 3000);
  }

  function reactToMission() {
    setExpression('excited', 4000);
  }

  function reactToIdle() {
    setExpression('neutral', 0);
  }

  // CSS global pour les sprites
  function injectStyles() {
    if (document.getElementById('lv-sprite-styles')) return;
    const style = document.createElement('style');
    style.id = 'lv-sprite-styles';
    style.textContent = `
      #npc-sprite-wrap { margin-right: 4px; }
      #npc-sprite-container svg { transition: all 0.3s ease; }
      #npc-sprite-container:hover svg { transform: scale(1.05); }
    `;
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectStyles);
  } else {
    injectStyles();
  }

  return {
    getSprite, setExpression,
    initInDialogue,
    reactToCorrection, reactToMission, reactToIdle,
    EXPRESSIONS,
  };

})();
