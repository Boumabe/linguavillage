// LinguaVillage — learning.js
// Apprentissage : vocabulaire, phrases, grammaire, dictionnaire, CEFR
// Modifier ici pour changer l'affichage des leçons

function loadVocab(catKey) {
  const cats = Object.keys(VOCAB);
  const catsBar = document.getElementById('vocabCats');
  if (catsBar) {
    catsBar.innerHTML = cats.map(k => {
      const a = k === catKey ? ' active' : '';
      const icon = VOCAB[k].icon || '📖';
      const label = VOCAB[k][S.nativeLang] || VOCAB[k].fr;
      return `<button class="vcat${a}" onclick="loadVocab('${k}')">${icon} ${label}</button>`;
    }).join('');
  }

  const cat = VOCAB[catKey];
  if (!cat) return;

  const searchInput = document.getElementById('vocabSearch');
  const search = searchInput ? searchInput.value.toLowerCase() : '';
  const words = cat.words.filter(w =>
    !search ||
    (w.t[S.nativeLang] || w.n || '').toLowerCase().includes(search) ||
    (w.t[S.targetLang] || '').toLowerCase().includes(search)
  );

  const vocabCount = document.getElementById('vocabCount');
  if (vocabCount) vocabCount.textContent = words.length + ' mots';

  const isCJK = ['zh','ja','ru'].includes(S.targetLang);

  const vocabList = document.getElementById('vocabList');
  if (!vocabList) return;

  vocabList.innerHTML = words.map(w => {
    const nativeText = w.t[S.nativeLang] || w.t.en || w.n || '';
    const target = w.t[S.targetLang] || w.t.en || '';

    let charsHtml = '', romanHtml = '';

    if (isCJK) {
      // Format: "你好 (Nǐ hǎo)" ou "быть (byt)"
      const m = target.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
      const chars = m ? m[1].trim() : target;
      const roman = m ? m[2].trim() : '';
      if (S.scriptPref !== 'roman' && chars) {
        charsHtml = `<span class="vi-word">${escapeHtml(chars)}</span>`;
      }
      if (S.scriptPref !== 'native' && roman) {
        romanHtml = `<span class="vi-roman">${escapeHtml(roman)}</span>`;
      }
      // Si pas de romanisation dans les données, afficher les chars seuls
      if (!roman && chars) {
        charsHtml = `<span class="vi-word">${escapeHtml(chars)}</span>`;
        romanHtml = '';
      }
    } else {
      // Langues normales (fr, en, es, ht, de) : afficher directement la traduction
      charsHtml = `<span class="vi-word">${escapeHtml(target)}</span>`;
      romanHtml = '';
    }

    const speakText = (target.match(/^(.*?)\s*\(([^)]+)\)\s*$/) || [,'',target])[1].trim() || target;
    return `
      <div class="vocab-item">
        <span class="vi-native">${escapeHtml(nativeText)}</span>
        <span class="vi-target">
          ${charsHtml}
          ${romanHtml}
        </span>
        <button class="vi-listen" onclick="speakW('${escapeHtml(speakText).replace(/'/g, "\\'")}')">🔊</button>
        <button class="oral-btn" onclick="openOralPractice('${escapeHtml(speakText).replace(/'/g, "\\'")}')">🎤</button>
      </div>`;
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

// PHRASES
function loadPhrases(catKey) {
  const cats = Object.keys(PHRASES_DATA);
  const phraseCats = document.getElementById('phraseCats');
  if (phraseCats) {
    phraseCats.innerHTML = cats.map(k => {
      const a = k === catKey ? ' active' : '';
      const icon = PHRASES_DATA[k].icon || '';
      const label = PHRASES_DATA[k][S.nativeLang] || PHRASES_DATA[k].fr;
      return `<button class="pcat${a}" onclick="loadPhrases('${k}')">${icon} ${label}</button>`;
    }).join('');
  }
  
  const cat = PHRASES_DATA[catKey];
  if (!cat) return;
  
  const phraseList = document.getElementById('phraseList');
  const phrasesCount = document.getElementById('phrasesCount');
  if (phrasesCount) phrasesCount.textContent = cat.items.length + ' phrases';
  
  const isCJK = ['zh', 'ja', 'ru'].includes(S.targetLang);
  const showRoman = isCJK && S.scriptPref !== 'native';
  const showNative = !isCJK || S.scriptPref !== 'roman';
  
  if (phraseList) {
    phraseList.innerHTML = cat.items.map(p => {
      const target = p.t[S.targetLang] || p.t.en || '';
      const match = target.match(/^(.*)\s*\(([^)]+)\)\s*$/);
      const chars = match ? match[1] : target;
      const roman = match ? match[2] : '';
      const romanHtml = (showRoman && roman) ? `<div class="pi-roman">${roman}</div>` : '';
      const nativeText = p.t[S.nativeLang] || p.t.en || p.n || '';
      return `
        <div class="phrase-item">
          <div class="pi-native">${escapeHtml(nativeText)}</div>
          <div class="pi-target">${showNative ? escapeHtml(chars) : target}</div>
          ${romanHtml}
          <div class="pi-actions">
            <button class="pi-btn" onclick="speakW('${escapeHtml(chars).replace(/'/g, "\\'")}')">🔊</button>
            <button class="pi-btn" onclick="copyPhrase('${escapeHtml(chars).replace(/'/g, "\\'")}')">📋</button>
          </div>
        </div>`;
    }).join('');
  }
}

function copyPhrase(t) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(t).then(() => showNotif('📋 Copié !')).catch(() => showNotif('❌ Erreur'));
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

// GRAMMAIRE
function loadGrammar(catKey) {
  const cats = Object.keys(GRAMMAR_DATA);
  const grammarCats = document.getElementById('grammarCats');
  if (grammarCats) {
    grammarCats.innerHTML = cats.map(k => {
      const a = k === catKey ? ' active' : '';
      const icon = GRAMMAR_DATA[k].icon || '';
      const label = GRAMMAR_DATA[k][S.nativeLang] || GRAMMAR_DATA[k].fr;
      return `<button class="gcat${a}" onclick="loadGrammar('${k}')">${icon} ${label}</button>`;
    }).join('');
  }
  
  const cat = GRAMMAR_DATA[catKey];
  if (!cat) return;
  
  const grammarBody = document.getElementById('grammarBody');
  if (!grammarBody) return;
  
  const nl = S.nativeLang;
  const tl = S.targetLang;
  const isCJK = ['zh', 'ja', 'ru'].includes(tl);
  const showRoman = isCJK && S.scriptPref !== 'native';
  const showNative = !isCJK || S.scriptPref !== 'roman';
  
  const expl = cat.explanation ? (cat.explanation[nl] || cat.explanation.fr || '') : '';
  const formula = cat.formula ? (cat.formula[tl] || cat.formula.en || cat.formula.fr || '') : '';
  const examples = cat.examples || [];
  
  var gramRowsHTML = examples.map(function(ex) {
    var target = ex.t[tl] || ex.t.en || '';
    var match  = target.match(/^(.*)\s*\(([^)]+)\)\s*$/);
    var chars  = match ? match[1] : target;
    var roman  = match ? match[2] : '';
    var romanSpan = (showRoman && roman) ? '<span class="roman">'+roman+'</span>' : '';
    var nativeText = ex.t[nl] || ex.t.en || ex.n || '';
    return '<div class="gram-ex">'
      + '<span class="gram-ex-native">'+escapeHtml(nativeText)+'</span>'
      + '<span class="gram-ex-target">'
      + (showNative ? escapeHtml(chars) : target) + ' ' + romanSpan
      + '<button onclick="speakW(\''+escapeHtml(chars).replace(/\'/g,"\\\'")+'\')">&#128266;</button>'
      + '</span></div>';
  }).join('');
  var formulaHTML = formula ? '<div class="gram-formula">'+formula+'</div>' : '';
  grammarBody.innerHTML = '<div class="gram-section">'
    + '<div class="gram-title">'+(cat.icon||'')+' '+(cat[nl]||cat.fr||'')+'</div>'
    + '<div class="gram-explanation">'+expl+'</div>'
    + formulaHTML
    + '<div class="gram-examples">'+gramRowsHTML+'</div>'
    + '</div>';
}

// DICTIONNAIRE
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
    const prompt = `Pour l'expression "${q}" et la paire de langues ${nl} ↔ ${tl}, agis comme un dictionnaire pédagogique. Réponds UNIQUEMENT avec un JSON valide au format {"translation":"...","roman":"...","grammar":"...","example":"..."}. "translation" = meilleure traduction dans la langue opposée selon le sens le plus courant. "roman" = romanisation si utile, sinon chaîne vide. "grammar" = catégorie grammaticale ou note d'usage très brève. "example" = un exemple court et naturel. Pas de markdown, pas d'explication supplémentaire.`;
    
    const resultData = await callAPIWithFallback('/api/dialogue', {
      npcName: '', npcRole: 'Dictionary', location: 'Dictionary',
      language: tl, playerName: S.playerName, playerMessage: prompt, history: []
    });
    
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

// INDICATEUR CEFR
function addCEFRIndicator() {
  const hud = document.querySelector('.village-hud');
  if (!hud) return;
  if (document.getElementById('cefrIndicator')) return;
  
  const totalXP = S.xp || 0;
  let currentLevel = "A1", nextLevel = "A2", progressPercent = 0, levelColor = "#4ecf70", levelIcon = "🌱";
