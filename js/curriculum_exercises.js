// curriculum_exercises.js — Exercices multi-format extraits des 6 manuels
// ============================================================================
// Le quiz existant (launchAdaptiveQuiz dans advanced.js) ne propose qu'un
// seul format : QCM "comment dit-on X". Les manuels analysés en proposent
// 5 autres, chacun entraînant une compétence différente. Ce fichier les
// implémente et les connecte au système XP / SRS / confettis déjà en place,
// sans toucher à launchAdaptiveQuiz ni au quiz QCM existant.
//
// Formats extraits :
//   1. translate     — "Le tour de l'anglais en 365 jours" (Exercice n°X,
//                       traduire une liste de mots/phrases)
//   2. transform      — "Espagnol pour les Nuls" (phrase affirmative → négative
//                       → interrogative)
//   3. distinguish    — "Le chinois à partir de zéro" (Lisez les syllabes et
//                       distinguez les sons : paires minimales bā/bá/bǎ/bà)
//   4. pattern_drill  — "Haitian Creole Basic Course" (CUE → réponse, on
//                       remplace un seul élément de la phrase modèle)
//   5. fill_blank     — "60 leçons pour apprendre l'allemand" (compléter
//                       l'article/genre manquant : ___ Mann, ___ Frau)
// ============================================================================

window.LV_EXERCISES = (function () {
'use strict';

var _state = { active: false, exerciseType: null, items: [], current: 0, score: 0 };

// ============================================================================
// 1. GÉNÉRATEURS — construisent les items d'exercice à partir de
//    CURRICULUM.UNITS (curriculum.js) et VOCAB/PHRASES_DATA (data.js)
// ============================================================================

// Format 1 — TRADUIRE : liste de mots à traduire natif→cible, comme les
// "Exercice n°X. Traduire en anglais" du manuel anglais.
function _genTranslate(targetLang, nativeLang, count) {
  var pool = [];
  Object.values(window.VOCAB || {}).forEach(function (c) {
    (c.words || []).forEach(function (w) {
      if (w.t[targetLang] && w.t[nativeLang]) pool.push(w);
    });
  });
  pool = pool.sort(function () { return Math.random() - 0.5; }).slice(0, count || 5);
  return pool.map(function (w) {
    return {
      type: 'translate',
      prompt: w.t[nativeLang],
      answer: w.t[targetLang],
      hint: w.n,
    };
  });
}

// Format 2 — TRANSFORMER : prend une phrase affirmative connue et demande
// sa version négative ou interrogative, comme "Leçon 2.14/2.15" du manuel
// espagnol. Utilise les marqueurs de négation/question simples par langue.
// NOTE: ces marqueurs sont volontairement simplifiés (pas de conjugaison de
// l'auxiliaire do/did en anglais, pas d'inversion sujet-verbe) — suffisant
// pour un exercice de reconnaissance de structure, pas pour une grammaire
// complète. Limité aux langues listées ci-dessous par honnêteté.
var TRANSFORM_MARKERS = {
  en: { neg: { prefix:'', suffix:'', insertAfterFirstWord:'don\'t ' }, q: { prefix:'Do ', suffix:'?', stripFinalPunct:true } },
  fr: { neg: { prefix:'', wrapFirstVerb:['ne ', ' pas'] }, q: { prefix:'Est-ce que ', suffix:' ?', stripFinalPunct:true } },
  es: { neg: { prefix:'No ' }, q: { prefix:'¿', suffix:'?', stripFinalPunct:true } },
  de: { neg: { suffix:' nicht' }, q: { prefix:'', suffix:'?', moveFirstWordToFront:true } },
};
function _genTransform(targetLang, nativeLang, count) {
  var markers = TRANSFORM_MARKERS[targetLang];
  if (!markers) return []; // langue non couverte par ce format — silencieux
  var pool = [];
  Object.values(window.PHRASES_DATA || {}).forEach(function (c) {
    (c.items || []).forEach(function (it) {
      if (it.t && it.t[targetLang]) pool.push(it);
    });
  });
  pool = pool.sort(function () { return Math.random() - 0.5; }).slice(0, count || 4);
  return pool.map(function (it) {
    var base = it.t[targetLang];
    var mode = Math.random() > 0.5 ? 'neg' : 'q';
    var transformed = _applyTransform(base, markers[mode], mode);
    return {
      type: 'transform',
      prompt: base,
      mode: mode,
      modeLabel: mode === 'neg'
        ? { fr:'Mets cette phrase à la forme négative', en:'Put this sentence in the negative' }
        : { fr:'Transforme cette phrase en question', en:'Turn this sentence into a question' },
      answer: transformed,
      native: it.t[nativeLang],
    };
  });
}

// Applique réellement une transformation différente pour neg vs q — le bug
// initial faisait pointer les deux modes vers la même logique prefix+suffix,
// rendant la transformation interrogative indiscernable de la négative.
function _applyTransform(base, m, mode) {
  if (!m) return base;
  var words = base.split(' ');
  if (mode === 'neg') {
    if (m.wrapFirstVerb) {
      // ex: "ne " + verbe + " pas" — insère autour du 1er mot (approximation
      // du verbe conjugué, suffisant pour un exercice de reconnaissance)
      words[0] = m.wrapFirstVerb[0] + words[0] + m.wrapFirstVerb[1];
      return words.join(' ');
    }
    if (m.insertAfterFirstWord) {
      words.splice(1, 0, m.insertAfterFirstWord.trim());
      return words.join(' ');
    }
    return (m.prefix || '') + base + (m.suffix || '');
  }
  // mode === 'q'
  var core = base.replace(/[.!]+$/, ''); // retire la ponctuation finale avant transformation
  if (m.moveFirstWordToFront) {
    // approximation d'inversion sujet-verbe pour l'allemand
    var w2 = core.split(' ');
    if (w2.length > 1) core = w2[1] + ' ' + w2[0] + ' ' + w2.slice(2).join(' ');
  }
  return (m.prefix || '') + core + (m.suffix || '');
}

// Format 3 — DISTINGUER : paires/quadruplets de sons proches, comme
// "Lisez les syllabes et distinguez les sons" du manuel chinois (tons) —
// généralisé à toute langue ayant des oppositions phonétiques marquées
// dans curriculum.js (pitfalls de type contextual_phonetic/homophone_tonal).
// NOTE: pitfall.example peut être une phrase longue dans certaines unités
// (ex: explication entre parenthèses) — on la tronque pour garder l'écran
// lisible, le texte complet reste disponible dans `explanation`.
function _genDistinguish(targetLang, nativeLang, count) {
  if (!window.CURRICULUM) return [];
  var units = window.CURRICULUM.getUnitsForLang(targetLang);
  var items = [];
  units.forEach(function (u) {
    (u.pitfalls || []).forEach(function (p) {
      if ((p.type === 'contextual_phonetic' || p.type === 'homophone_tonal')
          && p.forNativeLang.indexOf(nativeLang) !== -1 && p.example) {
        var shortExample = p.example.length > 60 ? p.example.slice(0, 57) + '…' : p.example;
        items.push({
          type: 'distinguish',
          prompt: shortExample,
          explanation: p.explanation[nativeLang] || p.explanation.fr,
          unitTitle: u.title[nativeLang] || u.title.fr,
        });
      }
    });
  });
  return items.slice(0, count || 4);
}

// Format 4 — PATTERN DRILL : reprend la mécanique CUE→réponse du manuel
// créole — on donne un mot de remplacement (CUE), le joueur doit produire
// la phrase complète en insérant ce mot dans le patron appris.
function _genPatternDrill(targetLang, nativeLang, count) {
  var pool = [];
  Object.values(window.VOCAB || {}).forEach(function (c) {
    (c.words || []).forEach(function (w) {
      if (w.t[targetLang]) pool.push(w);
    });
  });
  if (pool.length < 2) return [];
  // Choisir un patron simple selon la langue (greeting + nom)
  var patterns = {
    en: 'Hello, ___!', fr: 'Bonjour, ___ !', es: '¡Hola, ___!',
    de: 'Hallo, ___!', ht: 'Bonjou, ___!', zh: '你好，___！',
  };
  var pattern = patterns[targetLang] || patterns.en;
  pool = pool.sort(function () { return Math.random() - 0.5; }).slice(0, count || 4);
  return pool.map(function (w) {
    return {
      type: 'pattern_drill',
      pattern: pattern,
      cue: w.t[nativeLang],
      cueTarget: w.t[targetLang],
      answer: pattern.replace('___', w.t[targetLang]),
    };
  });
}

// Format 5 — COMPLÉTER : trou à remplir (article, genre, particule), comme
// les tableaux "der/die/das ___" du manuel allemand ou les classificateurs
// chinois. Utilise les exemples curriculum.js dont le premier mot est un
// marqueur court (article/particule) — limité aux langues à séparation par
// espace ET où le premier "mot" est effectivement court (heuristique : 1 à
// 4 caractères), pour éviter de prendre un mot de contenu pour un article.
var FILL_BLANK_UNSUPPORTED = ['zh', 'ja']; // pas de séparation par espace fiable
function _genFillBlank(targetLang, nativeLang, count) {
  if (!window.CURRICULUM) return [];
  if (FILL_BLANK_UNSUPPORTED.indexOf(targetLang) !== -1) return [];
  var units = window.CURRICULUM.getUnitsForLang(targetLang);
  var items = [];
  units.forEach(function (u) {
    (u.examples || []).forEach(function (ex) {
      if (!ex.target || ex.target.indexOf(' ') === -1) return;
      var parts = ex.target.split(' ');
      if (parts.length < 2) return;
      // Heuristique : le mot à faire deviner doit être court (article/
      // particule probable), pas un mot de contenu de la phrase.
      if (parts[0].length > 4) return;
      items.push({
        type: 'fill_blank',
        promptNative: ex.native,
        promptBlanked: '___ ' + parts.slice(1).join(' '),
        answer: parts[0],
        fullAnswer: ex.target,
        unitTitle: u.title[nativeLang] || u.title.fr,
      });
    });
  });
  return items.sort(function () { return Math.random() - 0.5; }).slice(0, count || 4);
}

// ============================================================================
// 2. SÉLECTION DE FORMAT — choisit un format adapté à la langue/niveau
// ============================================================================
function _pickAvailableFormats(targetLang, nativeLang) {
  var formats = [];
  if (_genTranslate(targetLang, nativeLang, 1).length)     formats.push('translate');
  if (_genTransform(targetLang, nativeLang, 1).length)     formats.push('transform');
  if (_genDistinguish(targetLang, nativeLang, 1).length)   formats.push('distinguish');
  if (_genPatternDrill(targetLang, nativeLang, 1).length)  formats.push('pattern_drill');
  if (_genFillBlank(targetLang, nativeLang, 1).length)     formats.push('fill_blank');
  return formats;
}

function _generateItems(type, targetLang, nativeLang, count) {
  switch (type) {
    case 'translate':     return _genTranslate(targetLang, nativeLang, count);
    case 'transform':     return _genTransform(targetLang, nativeLang, count);
    case 'distinguish':   return _genDistinguish(targetLang, nativeLang, count);
    case 'pattern_drill': return _genPatternDrill(targetLang, nativeLang, count);
    case 'fill_blank':    return _genFillBlank(targetLang, nativeLang, count);
    default: return [];
  }
}

// ============================================================================
// 3. UI — overlay réutilisant le style visuel du quiz adaptatif existant
// ============================================================================
var FORMAT_META = {
  translate:     { icon:'🔤', label:{ fr:'Traduction', en:'Translation' }, color:'#4a9eff' },
  transform:     { icon:'🔄', label:{ fr:'Transformation', en:'Transformation' }, color:'#ff9f43' },
  distinguish:   { icon:'👂', label:{ fr:'Distinguer les sons', en:'Sound discrimination' }, color:'#c084fc' },
  pattern_drill: { icon:'🗣️', label:{ fr:'Substitution', en:'Pattern drill' }, color:'#4ecf70' },
  fill_blank:    { icon:'✏️', label:{ fr:'Compléter', en:'Fill in the blank' }, color:'#ffd700' },
};

function openExercise(forceType) {
  var tl = (window.S && S.targetLang) || 'en';
  var nl = (window.S && S.nativeLang) || 'fr';

  var available = _pickAvailableFormats(tl, nl);
  if (!available.length) {
    if (typeof showNotif === 'function') showNotif('📚 Pas encore d\'exercices disponibles pour cette langue', 2500);
    return;
  }
  var type = forceType && available.indexOf(forceType) !== -1
    ? forceType
    : available[Math.floor(Math.random() * available.length)];

  var items = _generateItems(type, tl, nl, 5);
  if (!items.length) {
    if (typeof showNotif === 'function') showNotif('📚 Pas assez de contenu pour cet exercice', 2200);
    return;
  }

  _state = { active: true, exerciseType: type, items: items, current: 0, score: 0 };
  _renderOverlay();
}

function _renderOverlay() {
  var ov = document.getElementById('exerciseOv');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'exerciseOv';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.93);z-index:9800;'
      + 'display:flex;align-items:center;justify-content:center;padding:20px;';
    document.body.appendChild(ov);
  }
  var meta = FORMAT_META[_state.exerciseType];
  var nl = (window.S && S.nativeLang) || 'fr';
  var item = _state.items[_state.current];

  // Garde : si l'item est manquant (tableau plus court que prévu), on
  // termine proprement au lieu de planter sur item.type dans _renderItemBody.
  if (!item) { _renderComplete(); return; }

  var pct = Math.round((_state.current / _state.items.length) * 100);

  var bodyHtml = _renderItemBody(item, nl);

  ov.innerHTML =
    '<div style="background:linear-gradient(135deg,#0f1830,#0a0a14);border:1px solid ' + meta.color + '4d;'
    + 'border-radius:22px;padding:24px;max-width:360px;width:100%">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">'
    + '<div style="font-family:Cinzel,serif;font-size:0.86rem;color:' + meta.color + '">' + meta.icon + ' ' + (meta.label[nl] || meta.label.fr) + '</div>'
    + '<span style="font-size:0.65rem;color:rgba(255,255,255,0.35)">' + (_state.current + 1) + '/' + _state.items.length + '</span>'
    + '</div>'
    + '<div style="height:4px;background:rgba(255,255,255,0.07);border-radius:2px;margin-bottom:18px;overflow:hidden">'
    + '<div style="height:100%;width:' + pct + '%;background:' + meta.color + ';border-radius:2px"></div>'
    + '</div>'
    + bodyHtml
    + '</div>';
}

function _renderItemBody(item, nl) {
  if (item.type === 'translate') {
    return '<div style="font-size:0.72rem;color:rgba(255,255,255,0.4);margin-bottom:8px;">'
      + { fr:'Traduis :', en:'Translate:' }[nl]
      + '</div><div style="font-size:1.2rem;font-weight:900;color:#f0e8d0;margin-bottom:18px;text-align:center">' + _escape(item.prompt) + '</div>'
      + '<input id="exInput" type="text" placeholder="..." style="width:100%;box-sizing:border-box;padding:12px;'
      + 'background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.15);border-radius:12px;color:#f0e8d0;'
      + 'font-size:0.92rem;margin-bottom:12px;" onkeydown="if(event.key===\'Enter\')window.LV_EXERCISES._checkInput()">'
      + '<button onclick="window.LV_EXERCISES._checkInput()" style="width:100%;padding:12px;background:linear-gradient(135deg,#1a3a8a,#4a9eff);'
      + 'border:none;border-radius:12px;color:#fff;font-weight:800;cursor:pointer;">' + ({ fr:'Valider', en:'Check' }[nl]) + '</button>'
      + '<div id="exFeedback" style="margin-top:10px;font-size:0.78rem;text-align:center;min-height:18px;"></div>';
  }

  if (item.type === 'transform') {
    return '<div style="font-size:0.72rem;color:rgba(255,255,255,0.4);margin-bottom:8px;">'
      + (item.modeLabel[nl] || item.modeLabel.fr) + '</div>'
      + '<div style="font-size:1.05rem;font-weight:800;color:#f0e8d0;margin-bottom:6px;text-align:center">' + _escape(item.prompt) + '</div>'
      + '<div style="font-size:0.72rem;color:rgba(255,255,255,0.35);margin-bottom:16px;text-align:center;font-style:italic;">(' + _escape(item.native) + ')</div>'
      + '<input id="exInput" type="text" placeholder="..." style="width:100%;box-sizing:border-box;padding:12px;'
      + 'background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.15);border-radius:12px;color:#f0e8d0;'
      + 'font-size:0.92rem;margin-bottom:12px;" onkeydown="if(event.key===\'Enter\')window.LV_EXERCISES._checkInput()">'
      + '<button onclick="window.LV_EXERCISES._checkInput()" style="width:100%;padding:12px;background:linear-gradient(135deg,#c2410c,#ff9f43);'
      + 'border:none;border-radius:12px;color:#fff;font-weight:800;cursor:pointer;">' + ({ fr:'Valider', en:'Check' }[nl]) + '</button>'
      + '<div id="exFeedback" style="margin-top:10px;font-size:0.78rem;text-align:center;min-height:18px;"></div>';
  }

  if (item.type === 'distinguish') {
    return '<div style="font-size:0.72rem;color:rgba(255,255,255,0.4);margin-bottom:10px;">'
      + ({ fr:'Écoute la nuance, puis continue :', en:'Note the nuance, then continue:' }[nl]) + '</div>'
      + '<div style="font-size:1.05rem;font-weight:800;color:#f0e8d0;margin-bottom:12px;text-align:center">' + _escape(item.prompt) + '</div>'
      + '<div style="font-size:0.78rem;color:#c084fc;background:rgba(192,132,252,0.08);border:1px solid rgba(192,132,252,0.2);'
      + 'border-radius:12px;padding:12px;margin-bottom:16px;line-height:1.5;">' + _escape(item.explanation) + '</div>'
      + '<button onclick="window.LV_EXERCISES._nextItem(true)" style="width:100%;padding:12px;background:linear-gradient(135deg,#6d28d9,#c084fc);'
      + 'border:none;border-radius:12px;color:#fff;font-weight:800;cursor:pointer;">' + ({ fr:'Compris !', en:'Got it!' }[nl]) + '</button>';
  }

  if (item.type === 'pattern_drill') {
    return '<div style="font-size:0.72rem;color:rgba(255,255,255,0.4);margin-bottom:8px;">'
      + ({ fr:'Patron : ', en:'Pattern: ' }[nl]) + '<span style="color:#4ecf70;font-weight:700;">' + _escape(item.pattern) + '</span></div>'
      + '<div style="font-size:0.72rem;color:rgba(255,255,255,0.4);margin-bottom:6px;">' + ({ fr:'Mot à insérer :', en:'Word to insert:' }[nl]) + '</div>'
      + '<div style="font-size:1.1rem;font-weight:900;color:#f0e8d0;margin-bottom:18px;text-align:center">' + _escape(item.cue) + '</div>'
      + '<input id="exInput" type="text" placeholder="..." style="width:100%;box-sizing:border-box;padding:12px;'
      + 'background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.15);border-radius:12px;color:#f0e8d0;'
      + 'font-size:0.92rem;margin-bottom:12px;" onkeydown="if(event.key===\'Enter\')window.LV_EXERCISES._checkInput()">'
      + '<button onclick="window.LV_EXERCISES._checkInput()" style="width:100%;padding:12px;background:linear-gradient(135deg,#15803d,#4ecf70);'
      + 'border:none;border-radius:12px;color:#fff;font-weight:800;cursor:pointer;">' + ({ fr:'Valider', en:'Check' }[nl]) + '</button>'
      + '<div id="exFeedback" style="margin-top:10px;font-size:0.78rem;text-align:center;min-height:18px;"></div>';
  }

  if (item.type === 'fill_blank') {
    return '<div style="font-size:0.72rem;color:rgba(255,255,255,0.4);margin-bottom:8px;">' + _escape(item.promptNative) + '</div>'
      + '<div style="font-size:1.1rem;font-weight:900;color:#f0e8d0;margin-bottom:18px;text-align:center">' + _escape(item.promptBlanked) + '</div>'
      + '<input id="exInput" type="text" placeholder="..." style="width:100%;box-sizing:border-box;padding:12px;'
      + 'background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.15);border-radius:12px;color:#f0e8d0;'
      + 'font-size:0.92rem;margin-bottom:12px;" onkeydown="if(event.key===\'Enter\')window.LV_EXERCISES._checkInput()">'
      + '<button onclick="window.LV_EXERCISES._checkInput()" style="width:100%;padding:12px;background:linear-gradient(135deg,#92400e,#ffd700);'
      + 'border:none;border-radius:12px;color:#1a1300;font-weight:800;cursor:pointer;">' + ({ fr:'Valider', en:'Check' }[nl]) + '</button>'
      + '<div id="exFeedback" style="margin-top:10px;font-size:0.78rem;text-align:center;min-height:18px;"></div>';
  }

  return '';
}

function _normalize(s) {
  return (s || '').toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // ignore accents pour tolérance
}

function _checkInput() {
  var input = document.getElementById('exInput');
  var fb = document.getElementById('exFeedback');
  if (!input) return;
  var nl = (window.S && S.nativeLang) || 'fr';
  var item = _state.items[_state.current];
  var given = _normalize(input.value);
  var expected = _normalize(item.answer);
  var correct = given === expected;

  if (fb) {
    fb.style.color = correct ? '#4ecf70' : '#e05555';
    fb.textContent = correct
      ? '✅ ' + item.answer
      : '❌ ' + ({ fr:'Réponse : ', en:'Answer: ' }[nl] || 'Réponse : ') + item.answer;
  }
  input.disabled = true;
  if (correct) _state.score++;

  setTimeout(function () { _nextItem(); }, 1100);
}

// Le format "distinguish" n'a pas de saisie à valider : appuyer sur
// "Compris !" avance simplement à l'item suivant sans pénaliser le score
// (ce n'est pas une question à laquelle on peut se tromper).
function _nextItem(awardCorrect) {
  if (awardCorrect) _state.score++;
  _state.current++;
  if (_state.current >= _state.items.length) {
    _renderComplete();
  } else {
    _renderOverlay();
  }
}

function _renderComplete() {
  var ov = document.getElementById('exerciseOv');
  if (!ov) return;
  var nl = (window.S && S.nativeLang) || 'fr';
  var total = _state.items.length;
  var pct = Math.round((_state.score / total) * 100);
  var xpGain = _state.score * 12;

  ov.innerHTML = '<div style="background:linear-gradient(135deg,#0f1830,#0a0a14);border:1px solid rgba(255,215,0,0.3);'
    + 'border-radius:22px;padding:28px;max-width:340px;width:100%;text-align:center">'
    + '<div style="font-size:2.8rem;margin-bottom:8px">' + (pct >= 80 ? '🏆' : pct >= 50 ? '⭐' : '📚') + '</div>'
    + '<div style="font-family:Cinzel,serif;color:#ffd700;font-size:1rem;margin-bottom:5px">'
    + ({ fr:'Exercice terminé !', en:'Exercise complete!' }[nl]) + '</div>'
    + '<div style="font-size:1.4rem;font-weight:900;color:#f0e8d0;margin-bottom:4px">' + _state.score + '/' + total + '</div>'
    + '<div style="font-size:0.78rem;color:#4ecf70;margin-bottom:18px;font-weight:800">+' + xpGain + ' XP</div>'
    + '<button onclick="document.getElementById(\'exerciseOv\').remove()" style="background:linear-gradient(135deg,#92400e,#ffd700);'
    + 'border:none;border-radius:13px;padding:11px 26px;font-family:Cinzel,serif;font-weight:700;cursor:pointer;font-size:0.85rem;color:#1a1300;">'
    + ({ fr:'Super ! 🎉', en:'Great! 🎉' }[nl]) + '</button></div>';

  if (typeof gainXP === 'function') gainXP(xpGain);
  if (pct >= 80 && typeof launchConfetti === 'function') launchConfetti();
  _state.active = false;
}

function _escape(t) {
  return (t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

return {
  openExercise: openExercise,
  _checkInput: _checkInput,
  _nextItem: _nextItem,
  availableFormats: _pickAvailableFormats,
};

})();

console.log('✅ curriculum_exercises.js chargé — 5 formats extraits des manuels');
