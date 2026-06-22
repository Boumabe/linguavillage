// LinguaVillage — learning.js
// Vocabulaire, phrases, grammaire, dictionnaire, CEFR, profil enrichi
// ================================================================

const LEARNING_STATE = window.LEARNING_STATE || (window.LEARNING_STATE = {
  vocabCat: null,
  phraseCat: null,
  grammarCat: null,
  bindingsReady: false
});

function normalizeStudyText(value) {
  return (value || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function getLocalizedStudyLabel(obj, fallback) {
  if (!obj) return fallback || '';
  return obj[S.nativeLang] || obj.fr || obj.en || fallback || '';
}

function parseLearningTarget(target) {
  const raw = target || '';
  const match = raw.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  const chars = match ? match[1].trim() : raw.trim();
  const roman = match ? match[2].trim() : '';
  return {
    raw,
    chars,
    roman,
    speakText: chars || raw
  };
}

function ensureLearningBindings() {
  if (LEARNING_STATE.bindingsReady) return;

  const vocabSearch = document.getElementById('vocabSearch');
  if (vocabSearch) {
    vocabSearch.addEventListener('input', function() {
      loadVocab(LEARNING_STATE.vocabCat || Object.keys(VOCAB || {})[0]);
    });
  }

  const phraseSearch = document.getElementById('phraseSearch');
  if (phraseSearch) {
    phraseSearch.addEventListener('input', function() {
      loadPhrases(LEARNING_STATE.phraseCat || Object.keys(PHRASES_DATA || {})[0]);
    });
  }

  const grammarSearch = document.getElementById('grammarSearch');
  if (grammarSearch) {
    grammarSearch.addEventListener('input', function() {
      loadGrammar(LEARNING_STATE.grammarCat || Object.keys(GRAMMAR_DATA || {})[0]);
    });
  }

  LEARNING_STATE.bindingsReady = true;
}

function renderLearningEmptyState(icon, title, text) {
  return '<div class="learn-empty">'
    + '<div class="learn-empty-icon">' + icon + '</div>'
    + '<div class="learn-empty-title">' + title + '</div>'
    + '<div class="learn-empty-text">' + text + '</div>'
    + '</div>';
}

function launchVocabFlashcards() {
  const key = LEARNING_STATE.vocabCat || Object.keys(VOCAB || {})[0];
  if (key && typeof openFlashcards === 'function') {
    openFlashcards(key);
  } else {
    showNotif('🃏 Flashcards indisponibles pour le moment');
  }
}

function launchVocabOralPractice() {
  const key = LEARNING_STATE.vocabCat || Object.keys(VOCAB || {})[0];
  const cat = key && VOCAB ? VOCAB[key] : null;
  const first = cat && cat.words && cat.words[0];
  const target = first && (first.t[S.targetLang] || first.t.en || '');
  const parsed = parseLearningTarget(target);
  if (parsed.speakText && typeof openOralPractice === 'function') {
    openOralPractice(parsed.speakText, S.targetLang);
  } else {
    showNotif('🎤 Révision orale indisponible');
  }
}

function getCurrentPhrasePool() {
  const key = LEARNING_STATE.phraseCat || Object.keys(PHRASES_DATA || {})[0];
  const cat = key && PHRASES_DATA ? PHRASES_DATA[key] : null;
  if (!cat || !cat.items) return [];
  const query = normalizeStudyText((document.getElementById('phraseSearch') || {}).value || '');
  return cat.items.filter(function(item) {
    if (!query) return true;
    const target = item.t[S.targetLang] || item.t.en || '';
    const parsed = parseLearningTarget(target);
    const nativeText = item.t[S.nativeLang] || item.t.en || item.n || '';
    return [nativeText, parsed.chars, parsed.roman, target].some(function(value) {
      return normalizeStudyText(value).includes(query);
    });
  });
}

function speakFocusedPhrase() {
  const pool = getCurrentPhrasePool();
  if (!pool.length) {
    showNotif('🔍 Aucune phrase disponible avec ce filtre');
    return;
  }
  const phrase = pool[0];
  const target = phrase.t[S.targetLang] || phrase.t.en || '';
  speakW(parseLearningTarget(target).speakText);
}

function copyFocusedPhrase() {
  const pool = getCurrentPhrasePool();
  if (!pool.length) {
    showNotif('🔍 Aucune phrase à copier');
    return;
  }
  const phrase = pool[0];
  const target = phrase.t[S.targetLang] || phrase.t.en || '';
  copyPhrase(parseLearningTarget(target).chars || target);
}

function getCurrentGrammarCategory() {
  const key = LEARNING_STATE.grammarCat || Object.keys(GRAMMAR_DATA || {})[0];
  return key && GRAMMAR_DATA ? GRAMMAR_DATA[key] : null;
}

function playGrammarExample() {
  const cat = getCurrentGrammarCategory();
  if (!cat || !cat.examples || !cat.examples.length) {
    showNotif('🔊 Aucun exemple disponible');
    return;
  }
  const query = normalizeStudyText((document.getElementById('grammarSearch') || {}).value || '');
  const example = cat.examples.find(function(ex) {
    if (!query) return true;
    const target = ex.t[S.targetLang] || ex.t.en || '';
    const nativeText = ex.t[S.nativeLang] || ex.t.en || ex.n || '';
    return [target, nativeText].some(function(value) {
      return normalizeStudyText(value).includes(query);
    });
  }) || cat.examples[0];
  const target = example.t[S.targetLang] || example.t.en || '';
  speakW(parseLearningTarget(target).speakText);
}

function copyGrammarFormula() {
  const cat = getCurrentGrammarCategory();
  if (!cat || !cat.formula) {
    showNotif('📐 Aucune formule disponible');
    return;
  }
  const formula = cat.formula[S.targetLang] || cat.formula.en || cat.formula.fr || '';
  if (!formula) {
    showNotif('📐 Aucune formule disponible');
    return;
  }
  copyPhrase(formula);
}

function loadVocab(catKey) {
  ensureLearningBindings();

  const cats = Object.keys(VOCAB || {});
  if (!cats.length) return;
  LEARNING_STATE.vocabCat = catKey || LEARNING_STATE.vocabCat || cats[0];
  const activeKey = VOCAB[LEARNING_STATE.vocabCat] ? LEARNING_STATE.vocabCat : cats[0];
  LEARNING_STATE.vocabCat = activeKey;

  const catsBar = document.getElementById('vocabCats');
  if (catsBar) {
    const activeCat = VOCAB[activeKey];
    const activeIcon  = activeCat ? (activeCat.icon || '📖') : '📖';
    const activeLabel = activeCat ? getLocalizedStudyLabel(activeCat, activeKey) : activeKey;
    const totalCats   = cats.length;

    catsBar.innerHTML = ''
      // ── Tiroir fermé : affiche la catégorie active + bouton changer ──
      + '<div id="catDrawerClosed" style="display:flex;align-items:center;gap:10px;padding:10px 16px;cursor:pointer;" onclick="_toggleCatDrawer(\'vocab\')">'
      +   '<span style="font-size:1.1rem">' + activeIcon + '</span>'
      +   '<span style="font-weight:700;font-size:0.85rem;color:#F0EAD6;flex:1;">' + escapeHtml(activeLabel) + '</span>'
      +   '<span style="font-size:0.68rem;color:rgba(255,255,255,0.30);">' + totalCats + ' catégories</span>'
      +   '<span id="catDrawerArrow" style="color:rgba(255,255,255,0.30);font-size:0.80rem;transition:transform 0.22s;">▼</span>'
      + '</div>'
      // ── Tiroir ouvert : toutes les catégories en flex-wrap ──
      + '<div id="catDrawerOpen" style="display:none;flex-wrap:wrap;gap:6px;padding:4px 16px 12px;">'
      + cats.map(function(k) {
          const a = k === activeKey ? ' active' : '';
          const icon  = VOCAB[k].icon || '📖';
          const label = getLocalizedStudyLabel(VOCAB[k], k);
          const count = (VOCAB[k].words || []).length;
          return '<button class="vcat' + a + '" onclick="loadVocab(\'' + k + '\');_toggleCatDrawer(\'vocab\',false)">'
            + '<span>' + icon + ' ' + escapeHtml(label) + '</span>'
            + '<span class="cat-count">' + count + '</span>'
            + '</button>';
        }).join('')
      + '</div>';
  }

  const cat = VOCAB[activeKey];
  if (!cat) return;

  const search = normalizeStudyText((document.getElementById('vocabSearch') || {}).value || '');
  const words = (cat.words || []).filter(function(w) {
    if (!search) return true;
    const target = w.t[S.targetLang] || w.t.en || '';
    const parsed = parseLearningTarget(target);
    const nativeText = w.t[S.nativeLang] || w.t.en || w.n || '';
    return [nativeText, parsed.chars, parsed.roman, target].some(function(value) {
      return normalizeStudyText(value).includes(search);
    });
  });

  const vocabCount = document.getElementById('vocabCount');
  if (vocabCount) vocabCount.textContent = words.length + ' mots';
  const vocabActiveLabel = document.getElementById('vocabActiveLabel');
  if (vocabActiveLabel) vocabActiveLabel.textContent = getLocalizedStudyLabel(cat, activeKey);
  const vocabVisibleCount = document.getElementById('vocabVisibleCount');
  if (vocabVisibleCount) vocabVisibleCount.textContent = String(words.length);

  const isCJK = ['zh', 'ja', 'ru'].includes(S.targetLang);
  const showRoman = isCJK && S.scriptPref !== 'native';
  const showNative = !isCJK || S.scriptPref !== 'roman';

  const vocabList = document.getElementById('vocabList');
  if (!vocabList) return;

  if (!words.length) {
    vocabList.innerHTML = renderLearningEmptyState('🔎', 'Aucun mot trouvé', 'Essaie un autre mot-clé ou change de catégorie.');
    return;
  }

  const label = getLocalizedStudyLabel(cat, activeKey);
  vocabList.innerHTML = words.map(function(w, index) {
    const nativeText = w.t[S.nativeLang] || w.t.en || w.n || '';
    const target = w.t[S.targetLang] || w.t.en || '';
    const parsed = parseLearningTarget(target);
    const charsHtml = showNative && parsed.chars ? '<span class="vi-word">' + escapeHtml(parsed.chars) + '</span>' : '';
    const romanHtml = showRoman && parsed.roman ? '<span class="vi-roman">' + escapeHtml(parsed.roman) + '</span>' : '';
    const fallbackTarget = !charsHtml && !romanHtml ? '<span class="vi-word">' + escapeHtml(target) + '</span>' : '';
    const order = String(index + 1).padStart(2, '0');
    return '<article class="vocab-item">'
      + '<div class="vi-main">'
      + '<div class="vi-meta"><span class="vi-kicker">Mot-clé</span><span class="vi-chip">' + escapeHtml(label) + ' · ' + order + '</span></div>'
      + '<div class="vi-native">' + escapeHtml(nativeText) + '</div>'
      + '<div class="vi-target">' + charsHtml + romanHtml + fallbackTarget + '</div>'
      + '</div>'
      + '<div class="vi-actions">'
      + '<button class="vi-listen" onclick="speakW(\'' + escapeHtml(parsed.speakText).replace(/'/g, "\\'") + '\')">🔊 Écouter</button>'
      + '<button class="vi-listen vi-practice" onclick="openOralPractice(\'' + escapeHtml(parsed.speakText).replace(/'/g, "\\'") + '\')">🎤 Oral</button>'
      + '</div>'
      + '</article>';
  }).join('');
}

function speakW(w) {
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(w);
    const lm = { en: 'en-US', fr: 'fr-FR', es: 'es-ES', ht: 'fr-HT', de: 'de-DE', ru: 'ru-RU', zh: 'zh-CN', ja: 'ja-JP' };
    u.lang = lm[S.targetLang] || 'en-US';
    speechSynthesis.speak(u);
  }
  showNotif('🔊 ' + w);
}

function loadPhrases(catKey) {
  ensureLearningBindings();

  // [CORRECTION] La catégorie 'expressions_complementaires' (data.js) n'a
  // jamais été réellement traduite : ses 205 items ont la même valeur
  // pour fr/en/es/ht/de/ru/zh/ja (voir le commentaire "// simplifié, pour
  // démonstration" dans data.js). Pour ne pas afficher du texte français
  // non traduit comme si c'était la traduction cible, cette catégorie
  // n'est proposée que si la langue cible du joueur est le français —
  // elle reste alors authentique et utile.
  const allCats = Object.keys(PHRASES_DATA || {});
  const cats = (S.targetLang === 'fr')
    ? allCats
    : allCats.filter(function(k) { return k !== 'expressions_complementaires'; });
  if (!cats.length) return;
  LEARNING_STATE.phraseCat = catKey || LEARNING_STATE.phraseCat || cats[0];
  const activeKey = (PHRASES_DATA[LEARNING_STATE.phraseCat] && cats.indexOf(LEARNING_STATE.phraseCat) !== -1)
    ? LEARNING_STATE.phraseCat : cats[0];
  LEARNING_STATE.phraseCat = activeKey;

  const phraseCats = document.getElementById('phraseCats');
  if (phraseCats) {
    const activePhrCat = PHRASES_DATA[activeKey];
    const activePhrIcon  = activePhrCat ? (activePhrCat.icon || '💬') : '💬';
    const activePhrLabel = activePhrCat ? getLocalizedStudyLabel(activePhrCat, activeKey) : activeKey;
    phraseCats.innerHTML = ''
      + '<div id="catDrawerClosed" style="display:flex;align-items:center;gap:10px;padding:10px 16px;cursor:pointer;" onclick="_toggleCatDrawer(\'phrases\')">'
      +   '<span style="font-size:1.1rem">' + activePhrIcon + '</span>'
      +   '<span style="font-weight:700;font-size:0.85rem;color:#F0EAD6;flex:1;">' + escapeHtml(activePhrLabel) + '</span>'
      +   '<span style="font-size:0.68rem;color:rgba(255,255,255,0.30);">' + cats.length + ' catégories</span>'
      +   '<span id="catDrawerArrow" style="color:rgba(255,255,255,0.30);font-size:0.80rem;transition:transform 0.22s;">▼</span>'
      + '</div>'
      + '<div id="catDrawerOpen" style="display:none;flex-wrap:wrap;gap:6px;padding:4px 16px 12px;">'
      + cats.map(function(k) {
          const a = k === activeKey ? ' active' : '';
          const icon  = PHRASES_DATA[k].icon || '💬';
          const label = getLocalizedStudyLabel(PHRASES_DATA[k], k);
          const count = (PHRASES_DATA[k].items || []).length;
          return '<button class="pcat' + a + '" onclick="loadPhrases(\'' + k + '\');_toggleCatDrawer(\'phrases\',false)">'
            + '<span>' + icon + ' ' + escapeHtml(label) + '</span>'
            + '<span class="cat-count">' + count + '</span>'
            + '</button>';
        }).join('')
      + '</div>';
  }

  const cat = PHRASES_DATA[activeKey];
  if (!cat) return;

  const query = normalizeStudyText((document.getElementById('phraseSearch') || {}).value || '');
  const items = (cat.items || []).filter(function(p) {
    if (!query) return true;
    const target = p.t[S.targetLang] || p.t.en || '';
    const parsed = parseLearningTarget(target);
    const nativeText = p.t[S.nativeLang] || p.t.en || p.n || '';
    return [nativeText, parsed.chars, parsed.roman, target].some(function(value) {
      return normalizeStudyText(value).includes(query);
    });
  });

  const phrasesCount = document.getElementById('phrasesCount');
  if (phrasesCount) phrasesCount.textContent = items.length + ' phrases';
  const phrasesActiveLabel = document.getElementById('phrasesActiveLabel');
  if (phrasesActiveLabel) phrasesActiveLabel.textContent = getLocalizedStudyLabel(cat, activeKey);
  const phrasesVisibleCount = document.getElementById('phrasesVisibleCount');
  if (phrasesVisibleCount) phrasesVisibleCount.textContent = String(items.length);

  const isCJK = ['zh', 'ja', 'ru'].includes(S.targetLang);
  const showRoman = isCJK && S.scriptPref !== 'native';
  const showNative = !isCJK || S.scriptPref !== 'roman';

  const phraseList = document.getElementById('phraseList');
  if (!phraseList) return;
  if (!items.length) {
    phraseList.innerHTML = renderLearningEmptyState('💬', 'Aucune phrase trouvée', 'Essaie un autre mot-clé pour retrouver une expression utile.');
    return;
  }

  phraseList.innerHTML = items.map(function(p, index) {
    const target = p.t[S.targetLang] || p.t.en || '';
    const parsed = parseLearningTarget(target);
    const nativeText = p.t[S.nativeLang] || p.t.en || p.n || '';
    const romanHtml = (showRoman && parsed.roman) ? '<div class="pi-roman">' + escapeHtml(parsed.roman) + '</div>' : '';
    const targetText = showNative ? escapeHtml(parsed.chars || target) : escapeHtml(target);
    return '<article class="phrase-item">'
      + '<div class="pi-head"><span class="pi-kicker">Phrase utile</span><span class="pi-index">#' + String(index + 1).padStart(2, '0') + '</span></div>'
      + '<div class="pi-native">' + escapeHtml(nativeText) + '</div>'
      + '<div class="pi-target">' + targetText + '</div>'
      + romanHtml
      + '<div class="pi-actions">'
      + '<button class="pi-btn" onclick="speakW(\'' + escapeHtml(parsed.speakText).replace(/'/g, "\\'") + '\')">🔊 Écouter</button>'
      + '<button class="pi-btn" onclick="copyPhrase(\'' + escapeHtml(parsed.chars || target).replace(/'/g, "\\'") + '\')">📋 Copier</button>'
      + '</div>'
      + '</article>';
  }).join('');
}

function copyPhrase(t) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(t).then(function() {
      showNotif('📋 Copié !');
    }).catch(function() {
      showNotif('❌ Erreur');
    });
  } else {
    const ta = document.createElement('textarea');
    ta.value = t;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showNotif('📋 Copié !');
  }
}

function loadGrammar(catKey) {
  ensureLearningBindings();

  const cats = Object.keys(GRAMMAR_DATA || {});
  if (!cats.length) return;
  LEARNING_STATE.grammarCat = catKey || LEARNING_STATE.grammarCat || cats[0];
  const activeKey = GRAMMAR_DATA[LEARNING_STATE.grammarCat] ? LEARNING_STATE.grammarCat : cats[0];
  LEARNING_STATE.grammarCat = activeKey;

  const grammarCats = document.getElementById('grammarCats');
  if (grammarCats) {
    const activeGrCat  = GRAMMAR_DATA[activeKey];
    const activeGrIcon  = activeGrCat ? (activeGrCat.icon || '✏️') : '✏️';
    const activeGrLabel = activeGrCat ? getLocalizedStudyLabel(activeGrCat, activeKey) : activeKey;
    grammarCats.innerHTML = ''
      + '<div id="catDrawerClosed" style="display:flex;align-items:center;gap:10px;padding:10px 16px;cursor:pointer;" onclick="_toggleCatDrawer(\'grammar\')">'
      +   '<span style="font-size:1.1rem">' + activeGrIcon + '</span>'
      +   '<span style="font-weight:700;font-size:0.85rem;color:#F0EAD6;flex:1;">' + escapeHtml(activeGrLabel) + '</span>'
      +   '<span style="font-size:0.68rem;color:rgba(255,255,255,0.30);">' + cats.length + ' catégories</span>'
      +   '<span id="catDrawerArrow" style="color:rgba(255,255,255,0.30);font-size:0.80rem;transition:transform 0.22s;">▼</span>'
      + '</div>'
      + '<div id="catDrawerOpen" style="display:none;flex-wrap:wrap;gap:6px;padding:4px 16px 12px;">'
      + cats.map(function(k) {
          const a = k === activeKey ? ' active' : '';
          const icon  = GRAMMAR_DATA[k].icon || '✏️';
          const label = getLocalizedStudyLabel(GRAMMAR_DATA[k], k);
          const count = (GRAMMAR_DATA[k].examples || []).length;
          return '<button class="gcat' + a + '" onclick="loadGrammar(\'' + k + '\');_toggleCatDrawer(\'grammar\',false)">'
            + '<span>' + icon + ' ' + escapeHtml(label) + '</span>'
            + '<span class="cat-count">' + count + '</span>'
            + '</button>';
        }).join('')
      + '</div>';
  }

  const cat = GRAMMAR_DATA[activeKey];
  if (!cat) return;

  const nl = S.nativeLang;
  const tl = S.targetLang;
  const isCJK = ['zh', 'ja', 'ru'].includes(tl);
  const showRoman = isCJK && S.scriptPref !== 'native';
  const showNative = !isCJK || S.scriptPref !== 'roman';
  const query = normalizeStudyText((document.getElementById('grammarSearch') || {}).value || '');

  const expl = cat.explanation ? (cat.explanation[nl] || cat.explanation.fr || cat.explanation.en || '') : '';
  const formula = cat.formula ? (cat.formula[tl] || cat.formula.en || cat.formula.fr || '') : '';
  const allExamples = cat.examples || [];
  const examples = allExamples.filter(function(ex) {
    if (!query) return true;
    const target = ex.t[tl] || ex.t.en || '';
    const parsed = parseLearningTarget(target);
    const nativeText = ex.t[nl] || ex.t.en || ex.n || '';
    return [nativeText, parsed.chars, parsed.roman, expl, formula].some(function(value) {
      return normalizeStudyText(value).includes(query);
    });
  });

  const grammarActiveLabel = document.getElementById('grammarActiveLabel');
  if (grammarActiveLabel) grammarActiveLabel.textContent = getLocalizedStudyLabel(cat, activeKey);
  const grammarExampleCount = document.getElementById('grammarExampleCount');
  if (grammarExampleCount) grammarExampleCount.textContent = String(examples.length);

  const grammarBody = document.getElementById('grammarBody');
  if (!grammarBody) return;

  const examplesHTML = examples.length ? examples.map(function(ex, index) {
    const target = ex.t[tl] || ex.t.en || '';
    const parsed = parseLearningTarget(target);
    const nativeText = ex.t[nl] || ex.t.en || ex.n || '';
    const romanHTML = (showRoman && parsed.roman) ? '<div class="roman">' + escapeHtml(parsed.roman) + '</div>' : '';
    const targetHTML = showNative ? escapeHtml(parsed.chars || target) : escapeHtml(target);
    return '<article class="gram-ex">'
      + '<div class="gram-ex-head"><span class="gram-ex-index">Exemple ' + String(index + 1).padStart(2, '0') + '</span>'
      + '<button class="gram-audio" onclick="speakW(\'' + escapeHtml(parsed.speakText).replace(/'/g, "\\'") + '\')">🔊 Écouter</button></div>'
      + '<div class="gram-ex-native">' + escapeHtml(nativeText) + '</div>'
      + '<div class="gram-ex-target">' + targetHTML + '</div>'
      + romanHTML
      + '</article>';
  }).join('') : renderLearningEmptyState('📐', 'Aucun exemple trouvé', 'Change le mot-clé ou la catégorie pour afficher d’autres exemples.');

  grammarBody.innerHTML = '<section class="gram-section">'
    + '<div class="gram-topbar">'
    + '<div><div class="gram-kicker">Point de grammaire</div><div class="gram-title">' + escapeHtml((cat.icon || '') + ' ' + getLocalizedStudyLabel(cat, activeKey)) + '</div></div>'
    + '<div class="gram-tag">' + examples.length + ' exemples</div>'
    + '</div>'
    + '<div class="gram-card"><div class="gram-card-label">Explication simple</div><div class="gram-explanation">' + escapeHtml(expl) + '</div></div>'
    + (formula ? '<div class="gram-card gram-formula-card"><div class="gram-card-label">Formule à retenir</div><div class="gram-formula">' + escapeHtml(formula) + '</div></div>' : '')
    + '<div class="gram-card"><div class="gram-card-label">Exemples guidés</div><div class="gram-examples">' + examplesHTML + '</div></div>'
    + '</section>';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ensureLearningBindings);
} else {
  setTimeout(ensureLearningBindings, 0);
}

// =================================================================
// DICTIONNAIRE
// =================================================================
function openDict() {
  dictFromScreen = document.querySelector('.screen.active')?.id || 'screen-menu';
  showScreen('screen-dict');
  const input = document.getElementById('dictInput');
  if (input) {
    input.focus();
    if (popupWord && !input.value.trim()) input.value = popupWord;
  }
  const result = document.getElementById('dictResult');
  if (result && !result.innerHTML.trim()) {
    result.innerHTML = '<div class="dict-empty"><div class="dict-empty-icon">📚</div>Entrez un mot ou une expression</div>';
  }
}

async function searchDict() {
  const input = document.getElementById('dictInput');
  const result = document.getElementById('dictResult');
  if (!input || !result) return;
  const q = input.value.trim();
  if (!q) {
    result.innerHTML = '<div class="dict-empty"><div class="dict-empty-icon">📚</div>Entrez un mot ou une expression</div>';
    return;
  }
  if (dictHistory[0] !== q) {
    dictHistory = [q].concat(dictHistory.filter(item => item !== q)).slice(0, 10);
  }
  result.innerHTML = '<div class="dict-empty"><div class="dict-empty-icon">⏳</div>Recherche en cours...</div>';
  const nl = LANG_NAMES[S.nativeLang] || 'français';
  const tl = LANG_NAMES[S.targetLang] || 'anglais';
  const isCJK = ['zh', 'ja', 'ru'].includes(S.targetLang);
  const showRoman = isCJK && S.scriptPref !== 'native';
  try {
    const prompt = `You are a pedagogical dictionary. For the expression "${q}" between ${nl} and ${tl}, reply ONLY with valid JSON (no markdown, no explanation): {"translation":"...","roman":"...","grammar":"...","example":"..."}. "translation" = best translation. "roman" = romanization if useful else empty string. "grammar" = very brief grammatical note. "example" = one short natural example sentence.`;
    let resultData;
    if (typeof callAPIWithFallback === 'function') {
      try {
        resultData = await callAPIWithFallback('/api/translate', {
          word: q, nativeLang: S.nativeLang, targetLang: S.targetLang
        });
      } catch(e) { resultData = null; }
    }
    // [CORRECTION] L'ancien fallback appelait directement
    // https://api.anthropic.com/v1/messages depuis le navigateur avec
    // 'x-api-key': '' (clé vide). Cet appel échouait toujours (401) et,
    // s'il avait un jour reçu une vraie clé, l'aurait exposée publiquement
    // dans le code source livré au client. Retiré : en cas d'échec de
    // callAPIWithFallback, on tombe directement sur le bloc catch
    // ci-dessous, qui affichait déjà un message "Indisponible pour le
    // moment" — comportement final inchangé pour l'utilisateur, sans le
    // risque de sécurité ni l'appel mort.
    if (!resultData || !resultData.reply) {
      throw new Error('Dictionnaire indisponible : callAPIWithFallback a échoué ou est absent.');
    }
    let p;
    try {
      p = JSON.parse((resultData.reply || '{}').replace(/```json|```/g, '').trim());
    } catch {
      p = { translation: resultData.reply || q, roman: '', grammar: '', example: '' };
    }
    const hist = dictHistory.slice(1, 9);
    const translation = escapeHtml(p.translation || q);
    const roman = escapeHtml(p.roman || '');
    const grammar = escapeHtml(p.grammar || '');
    const example = escapeHtml(p.example || '');
    let histHTML = '';
    if (hist.length) {
      histHTML = '<div style="font-size:0.65rem;color:var(--dim);letter-spacing:2px;text-transform:uppercase;margin:15px 0 8px 0">Historique</div>'
        + '<div class="dict-chips">'
        + hist.map(h => `<span class="dict-chip" onclick="searchDictWord('${escapeHtml(h).replace(/'/g, "\\'")}')">${escapeHtml(h)}</span>`).join('')
        + '</div>';
    }
    result.innerHTML = '<div class="dict-card">'
      + '<div style="font-size:0.68rem;color:var(--dim);margin-bottom:5px">"' + escapeHtml(q) + '"</div>'
      + '<div class="dict-word">' + translation + '</div>'
      + (roman && showRoman ? '<div class="dict-roman">' + roman + '</div>' : '')
      + (grammar ? '<div style="font-size:0.7rem;color:var(--purple);font-weight:800;margin:5px 0">' + grammar + '</div>' : '')
      + (example ? '<div class="dict-example">💡 ' + example + '</div>' : '')
      + '<button class="dict-listen-btn" onclick="speakW(\'' + translation.replace(/'/g, "\\'") + '\')">🔊 Écouter</button>'
      + '</div>'
      + histHTML;
  } catch (e) {
    console.warn('Dictionary search failed:', e);
    result.innerHTML = '<div class="dict-empty"><div class="dict-empty-icon">❌</div>Indisponible pour le moment</div>';
  }
}

function searchDictWord(w) {
  const input = document.getElementById('dictInput');
  if (input) input.value = w;
  searchDict();
}

function setDictMode(mode, btn) {
  dictMode = mode;
  document.querySelectorAll('.dict-mode').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function closeDictBack() {
  showScreen('screen-menu');
}

// =================================================================
// INDICATEUR CEFR
// =================================================================
function addCEFRIndicator() {
  const hud = document.querySelector('.village-hud');
  if (!hud) return;
  if (document.getElementById('cefrIndicator')) return;
  const totalXP = S.xp || 0;
  let currentLevel = "A1", nextLevel = "A2", progressPercent = 0, levelColor = "#4ecf70", levelIcon = "🌱";
  if (totalXP < 300) {
    currentLevel = "A1"; nextLevel = "A2";
    progressPercent = Math.min(100, Math.floor((totalXP / 300) * 100));
    levelColor = "#4ecf70"; levelIcon = "🌱";
  } else if (totalXP < 800) {
    currentLevel = "A2"; nextLevel = "B1";
    progressPercent = Math.min(100, Math.floor(((totalXP - 300) / 500) * 100));
    levelColor = "#4a9eff"; levelIcon = "🌟";
  } else if (totalXP < 1500) {
    currentLevel = "B1"; nextLevel = "B2";
    progressPercent = Math.min(100, Math.floor(((totalXP - 800) / 700) * 100));
    levelColor = "#ff9f43"; levelIcon = "🏆";
  } else if (totalXP < 2500) {
    currentLevel = "B2"; nextLevel = "C1";
    progressPercent = Math.min(100, Math.floor(((totalXP - 1500) / 1000) * 100));
    levelColor = "#e040fb"; levelIcon = "👑";
  } else {
    currentLevel = "C1"; nextLevel = null;
    progressPercent = 100; levelColor = "#ff6b6b"; levelIcon = "🏅";
  }
  const indicator = document.createElement('div');
  indicator.id = 'cefrIndicator';
  indicator.style.cssText = `display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.5); padding: 2px 8px; border-radius: 20px; margin-left: auto; margin-right: 8px; font-size: 0.7rem; cursor: pointer;`;
  indicator.onclick = () => showNotif('🗺️ Niveau ' + currentLevel + ' → ' + (nextLevel || '🏆 Maître !') + ' (' + progressPercent + '%)');
  indicator.innerHTML = `
    <span style="font-size:0.85rem;">${levelIcon}</span>
    <span style="font-weight:800;color:${levelColor}">${currentLevel}</span>
    <div style="width:40px;height:4px;background:rgba(255,255,255,0.2);border-radius:2px;overflow:hidden;">
      <div style="width:${progressPercent}%;height:100%;background:${levelColor};border-radius:2px;"></div>
    </div>
    ${nextLevel ? `<span style="font-size:0.6rem;color:var(--dim);">→ ${nextLevel}</span>` : '🏆'}
  `;
  hud.appendChild(indicator);
}

// =================================================================
// ZONES DU MONDE
// =================================================================
var ZONES = {
  zone_debutant:     { id:'zone_debutant',     icon:'🌱', order:1, xpRequired:0,    fr:'Village de l\'Aube',    en:'Dawn Village',      color:'#4ecf70', locs:['church','school','friends'],  boss:{fr:'Le Vieil Érudit',    en:'The Old Scholar',  icon:'📚', hp:5, reward:{xp:100,gems:3,chest:'rare'},     challenge:'Mène une conversation complète de 5 échanges sur ta famille sans fautes.', check:5}},
  zone_elementaire:  { id:'zone_elementaire',  icon:'⭐', order:2, xpRequired:300,  fr:'Bourg du Marché',       en:'Market Town',       color:'#4a9eff', locs:['market','tavern','park'],     boss:{fr:'Le Marchand Pressé', en:'The Busy Merchant', icon:'💼', hp:6, reward:{xp:200,gems:5,chest:'epic'},     challenge:'Négocie un prix, commande 3 choses ET demande des directions.'}},
  zone_intermediaire:{ id:'zone_intermediaire', icon:'🏅', order:3, xpRequired:800,  fr:'Cité des Voyageurs',    en:'Traveler\'s City',  color:'#e040fb', locs:['station','bank','hospital'],  boss:{fr:'Le Diplomate',       en:'The Diplomat',     icon:'🎩', hp:8, reward:{xp:350,gems:8,chest:'legendary'}, challenge:'Explique un problème complexe et négocie une solution formelle.'}},
  zone_avance:       { id:'zone_avance',        icon:'🏆', order:4, xpRequired:1500, fr:'Tour de la Maîtrise',   en:'Mastery Tower',     color:'#FFD700', locs:['police','factory','cinema'],  boss:{fr:'Le Maître des Langues',en:'Language Master', icon:'👑', hp:10,reward:{xp:500,gems:15,chest:'legendary'},challenge:'Conversation libre de 10 échanges sur un sujet complexe. Niveau C1.'}},
};

function isZoneUnlocked(zoneId) {
  var zone = ZONES[zoneId];
  return zone ? (S.xp||0) >= zone.xpRequired : false;
}

function hexToRgb(hex) {
  return parseInt(hex.slice(1,3),16)+','+parseInt(hex.slice(3,5),16)+','+parseInt(hex.slice(5,7),16);
}

// =================================================================
// PROFIL ENRICHIE (mots favoris / difficiles)
// =================================================================
function loadProfileData() {
  if (!window.LV_MEMORY) return;
  var favWords = LV_MEMORY.get('favoriteWords') || [];
  var weakWords = LV_MEMORY.get('weakWords') || [];
  var masteredCount = (LV_MEMORY.get('masteredWords') || []).length;
  var totalMessages = LV_MEMORY.get('totalMessages') || 0;
  var sessions = LV_MEMORY.get('sessionsCount') || 0;
  var favContainer = document.getElementById('favWordsList');
  var weakContainer = document.getElementById('weakWordsList');
  var masteredEl = document.getElementById('profileMasteredCount');
  var messagesEl = document.getElementById('profileMessages');
  var sessionsEl = document.getElementById('profileSessions');
  if (favContainer) favContainer.innerHTML = favWords.slice(0,10).map(f => `<span class="fav-tag" style="display:inline-block;background:rgba(78,207,112,0.12);padding:4px 8px;border-radius:12px;margin:2px;font-size:0.7rem;">${escapeHtml(f.word)}</span>`).join('') || 'Aucun favori';
  if (weakContainer) weakContainer.innerHTML = weakWords.slice(0,10).map(w => `<span class="weak-tag" style="display:inline-block;background:rgba(255,107,107,0.12);padding:4px 8px;border-radius:12px;margin:2px;font-size:0.7rem;">${escapeHtml(w)}</span>`).join('') || 'Aucun mot difficile';
  if (masteredEl) masteredEl.textContent = masteredCount;
  if (messagesEl) messagesEl.textContent = totalMessages;
  if (sessionsEl) sessionsEl.textContent = sessions;
    }
