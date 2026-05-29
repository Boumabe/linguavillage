// LinguaVillage — guided_v2.js
// Système de dialogue guidé repensé
//
// INNOVATIONS v2 :
//   - 4 niveaux de scaffold (choix → complétion → saisie courte → libre)
//   - Transition guidé→libre avec rampe de sécurité (starter chips)
//   - Progression visuelle par scène (barre + numéro)
//   - Feedback reformulé en "découverte" pas en "erreur"
//   - Mémorisation des erreurs pour adaptation future (via S.weakPoints)
//   - Expression NPC dynamique selon le contexte
// ================================================================

window.GUIDED_XP_THRESHOLD = 300;

// ================================================================
// PATCH openDialogue — intercepte les débutants
// ================================================================
(function() {
  function _patch() {
    var orig = window.openDialogue;
    if (!orig || orig._v2_patched) return;

    window.openDialogue = function(locId, npcId) {
      var xp      = (window.S && S.xp) || 0;
      var guided  = window.GUIDED_DIALOGUES && window.GUIDED_DIALOGUES[locId];
      var useGuided = guided && !guided.freeFromStart && xp < window.GUIDED_XP_THRESHOLD;

      if (useGuided) {
        _openGuided(locId, npcId, guided);
      } else {
        orig(locId, npcId);
      }
    };
    window.openDialogue._v2_patched = true;
    console.log('✅ guided_v2.js patché openDialogue');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(_patch, 250); });
  } else {
    setTimeout(_patch, 250);
  }
})();

// ================================================================
// ÉTAT GLOBAL DU GUIDED
// ================================================================
var _gs = null; // guided state

// ================================================================
// OUVERTURE DU DIALOGUE GUIDÉ
// ================================================================
function _openGuided(locId, npcId, guided) {
  var loc = typeof LOCATIONS !== 'undefined'
    ? LOCATIONS.find(function(l) { return l.id === locId; })
    : null;
  if (!loc) return;

  var npc = (loc.npcs || []).find(function(n) { return n.id === npcId; });
  if (!npc) return;

  // Initialiser l'état
  if (window.S) {
    S.currentNPC  = npc;
    S.currentLoc  = loc;
    S.chatHistory = [];
    if (!S.weakPoints) S.weakPoints = {};
  }

  var nl = (window.S && S.nativeLang) || 'fr';
  var tl = (window.S && S.targetLang) || 'en';

  // Construire l'écran dialogue
  _buildDialogueHeader(npc, guided, nl, tl);

  // Cacher le champ libre pendant le guidé
  var inputArea = document.querySelector('.dial-input-area');
  if (inputArea) inputArea.style.display = 'none';

  // Cacher les starter chips (pas encore pertinents)
  var starterRow = document.getElementById('starterRow');
  if (starterRow) starterRow.style.display = 'none';

  // Afficher la PLI bar
  if (typeof PLI !== 'undefined') PLI.updateBar();

  if (typeof showScreen === 'function') showScreen('screen-dialogue');

  // État
  _gs = {
    locId    : locId,
    npcId    : npcId,
    npc      : npc,
    guided   : guided,
    tl       : tl,
    nl       : nl,
    sceneIdx : 0,
    xpEarned : 0,
    errors   : 0,
    history  : []
  };

  // Vider les messages
  var chatMsgs = document.getElementById('chatMsgs');
  if (chatMsgs) chatMsgs.innerHTML = '';

  // Lancer la première scène
  setTimeout(function() { _runScene(0); }, 300);
}

// ── Construction du header dialogue ─────────────────────────────
function _buildDialogueHeader(npc, guided, nl, tl) {
  var dialAv   = document.getElementById('dialAv');
  var dialName = document.getElementById('dialName');
  var dialRole = document.getElementById('dialRole');
  var corrPanel= document.getElementById('corrPanel');

  if (dialAv)   dialAv.textContent   = npc.emoji;
  if (dialName) dialName.textContent = npc.name;
  if (corrPanel) { corrPanel.className = 'correction-panel'; corrPanel.innerHTML = ''; }

  if (dialRole) {
    var theme = (guided.theme && (guided.theme[nl] || guided.theme.fr)) || '';
    dialRole.innerHTML = _escHtml(theme) + ' ' + _guidedBadge(nl);
  }
}

// ── Badge "Guidé" ────────────────────────────────────────────────
function _guidedBadge(nl) {
  var labels = {
    fr:'📖 Guidé', en:'📖 Guided', es:'📖 Guiado',
    ht:'📖 Gide',  de:'📖 Geführt', ru:'📖 Ведомый',
    zh:'📖 引导',   ja:'📖 ガイド'
  };
  return '<span style="' +
    'display:inline-flex;align-items:center;margin-left:8px;' +
    'font-size:0.6rem;font-weight:800;padding:2px 8px;' +
    'background:rgba(78,207,112,0.15);border:1px solid rgba(78,207,112,0.35);' +
    'border-radius:999px;color:#4ecf70;vertical-align:middle;' +
    '">' + (labels[nl] || '📖 Guided') + '</span>';
}

// ================================================================
// AFFICHER UNE SCÈNE
// ================================================================
function _runScene(idx) {
  if (!_gs) return;
  var scenes = _gs.guided.scenes;
  if (!scenes) return;

  // Fin du guided
  if (idx >= scenes.length) {
    _guidedComplete();
    return;
  }

  var scene = scenes[idx];
  var tl = _gs.tl, nl = _gs.nl, npc = _gs.npc;
  var chatMsgs = document.getElementById('chatMsgs');
  if (!chatMsgs) return;

  // Message NPC
  var npcMsg  = scene.npc[tl] || scene.npc.en || '';
  var npcSub  = (tl !== nl) ? _getSub(scene.npc, nl, npcMsg) : '';
  _addBubble('npc', npc.emoji, npcMsg, npcSub);

  // Retirer l'ancien bloc de choix
  var old = document.getElementById('guided-choices');
  if (old) old.remove();

  // Déterminer le type de scaffold selon le niveau de la scène
  var scaffold = scene.scaffold || 'choices'; // choices | fill | short

  // Créer le bloc d'interaction
  var wrap = document.createElement('div');
  wrap.id = 'guided-choices';
  wrap.style.cssText = 'padding:10px 14px;display:flex;flex-direction:column;gap:8px;';

  // Barre de progression
  wrap.appendChild(_makeProgressBar(idx, scenes.length));

  // Rendu selon scaffold
  if (scaffold === 'fill') {
    _renderFillBlank(wrap, scene, idx);
  } else if (scaffold === 'short') {
    _renderShortInput(wrap, scene, idx);
  } else {
    _renderChoices(wrap, scene, idx);
  }

  chatMsgs.appendChild(wrap);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

// ── Barre de progression ─────────────────────────────────────────
function _makeProgressBar(idx, total) {
  var pct = Math.round(((idx) / total) * 100);
  var bar = document.createElement('div');
  bar.className = 'guided-scene-label';
  bar.innerHTML = [
    '<div class="guided-progress-track">',
    '  <div class="guided-progress-fill" style="width:' + pct + '%"></div>',
    '</div>',
    '<span class="guided-scene-num">' + (idx + 1) + '/' + total + '</span>'
  ].join('');
  return bar;
}

// ================================================================
// SCAFFOLD NIVEAU 1 — CHOIX MULTIPLES
// ================================================================
function _renderChoices(wrap, scene, sceneIdx) {
  scene.choices.forEach(function(ch) {
    var btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = ch.label[_gs.tl] || ch.label.en || '';
    btn.addEventListener('click', function() {
      _onChoice(ch, btn, scene, sceneIdx, wrap);
    });
    wrap.appendChild(btn);
  });
}

// ================================================================
// SCAFFOLD NIVEAU 2 — COMPLÉTION DE PHRASE (fill-in-the-blank)
// ================================================================
function _renderFillBlank(wrap, scene, sceneIdx) {
  var tl = _gs.tl;
  var prompt = scene.fillPrompt && (scene.fillPrompt[tl] || scene.fillPrompt.en);
  if (!prompt) {
    _renderChoices(wrap, scene, sceneIdx);
    return;
  }

  // Affiche la phrase avec [___] en évidence
  var promptEl = document.createElement('div');
  promptEl.style.cssText = [
    'font-size:0.95rem;font-weight:600;',
    'color:var(--text-primary);',
    'background:var(--surface-raised);',
    'border:1.5px solid var(--border-faint);',
    'border-radius:var(--r-md);',
    'padding:12px 16px;',
    'line-height:1.6;'
  ].join('');
  promptEl.innerHTML = _escHtml(prompt).replace('[___]',
    '<span style="display:inline-block;min-width:60px;border-bottom:2px solid var(--gold-warm);color:var(--gold-warm);font-weight:800;padding:0 4px;">___</span>'
  );
  wrap.appendChild(promptEl);

  // Input
  var fillWrap = document.createElement('div');
  fillWrap.className = 'fill-blank-wrap';

  var inp = document.createElement('input');
  inp.type = 'text';
  inp.className = 'fill-blank-input';
  var nl = _gs.nl;
  var placeholders = {
    fr:'Complétez la phrase...', en:'Fill in the blank...',
    es:'Complete la oración...', ht:'Konplete fraz la...',
    de:'Ergänzen Sie den Satz...', ru:'Дополните фразу...',
    zh:'填写空白...', ja:'空欄を埋めてください...'
  };
  inp.placeholder = placeholders[nl] || placeholders.fr;

  var checkBtn = document.createElement('button');
  checkBtn.className = 'fill-blank-check';
  checkBtn.textContent = '✓';

  var _check = function() {
    var val = inp.value.trim();
    if (!val) return;
    var correct = scene.fillAnswer;
    var isOk = correct
      ? val.toLowerCase() === correct.toLowerCase()
      : true; // Si pas de réponse définie, accepter tout

    _onFillResult(isOk, val, correct, scene, sceneIdx, wrap, inp, checkBtn);
  };

  checkBtn.addEventListener('click', _check);
  inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') _check(); });

  fillWrap.appendChild(inp);
  fillWrap.appendChild(checkBtn);
  wrap.appendChild(fillWrap);
  setTimeout(function() { inp.focus(); }, 200);

  // Hint discret
  if (scene.hint && scene.hint[_gs.tl]) {
    var hint = document.createElement('div');
    hint.style.cssText = 'font-size:0.68rem;color:var(--text-ghost);font-style:italic;text-align:center;padding-top:4px;';
    hint.textContent = '💡 ' + scene.hint[_gs.tl];
    wrap.appendChild(hint);
  }
}

function _onFillResult(isOk, val, correct, scene, sceneIdx, wrap, inp, checkBtn) {
  inp.disabled = true;
  checkBtn.disabled = true;

  if (isOk) {
    inp.style.borderColor = 'var(--jade)';
    inp.style.color = 'var(--jade)';
    checkBtn.style.background = 'var(--jade)';
    var xpGain = scene.xp || 20;
    _gs.xpEarned += xpGain;
    if (typeof gainXP === 'function') gainXP(xpGain, checkBtn);
    var fb = scene.feedback && (scene.feedback.correct[_gs.tl] || scene.feedback.correct.en);
    if (fb) {
      setTimeout(function() {
        _addBubble('npc', _gs.npc.emoji, fb, null, 'var(--jade)');
        setTimeout(function() {
          _gs.sceneIdx = sceneIdx + 1;
          _runScene(_gs.sceneIdx);
        }, 1600);
      }, 400);
    } else {
      setTimeout(function() {
        _gs.sceneIdx = sceneIdx + 1;
        _runScene(_gs.sceneIdx);
      }, 1000);
    }
  } else {
    inp.style.borderColor = 'var(--coral)';
    inp.style.color = 'var(--coral)';
    // Mémoriser le point faible
    if (window.S && correct) {
      S.weakPoints = S.weakPoints || {};
      S.weakPoints[correct] = (S.weakPoints[correct] || 0) + 1;
    }
    // Montrer la bonne réponse
    var fb = scene.feedback && (scene.feedback.wrong[_gs.tl] || scene.feedback.wrong.en);
    var msg = fb || '';
    if (correct) msg += '\n✨ ' + correct;
    setTimeout(function() {
      _addBubble('npc', _gs.npc.emoji, msg.trim(), null, 'var(--amber)');
      // Réactiver pour réessayer
      setTimeout(function() {
        inp.disabled = false;
        checkBtn.disabled = false;
        inp.value = '';
        inp.style.borderColor = '';
        inp.style.color = '';
        inp.focus();
      }, 1800);
    }, 300);
  }
}

// ================================================================
// SCAFFOLD NIVEAU 3 — SAISIE COURTE LIBRE
// (pour XP ~200, juste avant la liberté totale)
// ================================================================
function _renderShortInput(wrap, scene, sceneIdx) {
  var tl = _gs.tl;

  var promptEl = document.createElement('div');
  promptEl.style.cssText = 'font-size:0.85rem;color:var(--text-secondary);font-style:italic;margin-bottom:6px;';
  var prompts = {
    fr:'Répondez en ' + (LANG_NAMES && LANG_NAMES[tl] || tl) + ' (quelques mots) :',
    en:'Reply in ' + (LANG_NAMES && LANG_NAMES[tl] || tl) + ' (a few words):',
    es:'Responde en ' + (LANG_NAMES && LANG_NAMES[tl] || tl) + ' (pocas palabras):',
  };
  var nl = _gs.nl;
  promptEl.textContent = prompts[nl] || prompts.fr;
  wrap.appendChild(promptEl);

  var fillWrap = document.createElement('div');
  fillWrap.className = 'fill-blank-wrap';

  var inp = document.createElement('input');
  inp.type = 'text';
  inp.className = 'fill-blank-input';
  inp.placeholder = '...';

  var sendBtn = document.createElement('button');
  sendBtn.className = 'fill-blank-check';
  sendBtn.textContent = '→';

  var _send = function() {
    var val = inp.value.trim();
    if (!val) return;
    // Saisie courte : accepter tout, corriger via API si disponible
    inp.disabled = true; sendBtn.disabled = true;
    sendBtn.textContent = '⏳';

    _addBubble('player', '🧑', val, null, null);

    // Appel API optionnel pour correction
    var xpGain = scene.xp || 18;
    _gs.xpEarned += xpGain;
    if (typeof gainXP === 'function') gainXP(xpGain, sendBtn);

    var fb = scene.feedback && (scene.feedback.correct[_gs.tl] || scene.feedback.correct.en);
    if (fb) {
      setTimeout(function() {
        _addBubble('npc', _gs.npc.emoji, fb, null, 'var(--sapphire)');
        setTimeout(function() {
          _gs.sceneIdx = sceneIdx + 1;
          _runScene(_gs.sceneIdx);
        }, 1600);
      }, 600);
    } else {
      setTimeout(function() {
        _gs.sceneIdx = sceneIdx + 1;
        _runScene(_gs.sceneIdx);
      }, 800);
    }
  };

  sendBtn.addEventListener('click', _send);
  inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') _send(); });

  fillWrap.appendChild(inp);
  fillWrap.appendChild(sendBtn);
  wrap.appendChild(fillWrap);
  setTimeout(function() { inp.focus(); }, 200);
}

// ================================================================
// GESTION D'UN CHOIX (scaffold niveau 1)
// ================================================================
function _onChoice(choice, btn, scene, sceneIdx, wrap) {
  // Désactiver tous les boutons
  wrap.querySelectorAll('.choice-btn').forEach(function(b) {
    b.disabled = true; b.style.opacity = '0.45';
  });
  btn.style.opacity = '1';

  if (choice.correct) {
    btn.classList.add('correct');

    var xpGain = choice.xp || 15;
    _gs.xpEarned += xpGain;
    if (typeof gainXP === 'function') gainXP(xpGain, btn);

    var fb    = _getFb(scene.feedback.correct, _gs.tl);
    var fbSub = (_gs.tl !== _gs.nl) ? _getSub(scene.feedback.correct, _gs.nl, fb) : '';

    if (window.LV_SPRITES) window.LV_SPRITES.setExpression('happy', 1500);

    setTimeout(function() {
      _addBubble('npc', _gs.npc.emoji, fb, fbSub, 'var(--jade)');
      setTimeout(function() {
        _gs.sceneIdx = sceneIdx + 1;
        _runScene(_gs.sceneIdx);
      }, 1700);
    }, 350);

  } else {
    btn.classList.add('wrong');

    // Mémoriser le point faible
    if (window.S) {
      S.weakPoints = S.weakPoints || {};
      var key = scene.npc[_gs.tl] || 'unknown';
      S.weakPoints[key] = (S.weakPoints[key] || 0) + 1;
    }
    _gs.errors++;

    if (choice.xp > 0) {
      _gs.xpEarned += choice.xp;
      if (typeof gainXP === 'function') gainXP(choice.xp, btn);
    }

    var fb    = _getFb(scene.feedback.wrong, _gs.tl);
    var fbSub = (_gs.tl !== _gs.nl) ? _getSub(scene.feedback.wrong, _gs.nl, fb) : '';

    if (window.LV_SPRITES) window.LV_SPRITES.setExpression('confused', 1500);

    setTimeout(function() {
      _addBubble('npc', _gs.npc.emoji, fb, fbSub, 'var(--amber)');
      // Réactiver pour réessayer (sauf le mauvais choix)
      setTimeout(function() {
        wrap.querySelectorAll('.choice-btn').forEach(function(b) {
          if (!b.classList.contains('wrong')) {
            b.disabled = false; b.style.opacity = '1';
          }
        });
      }, 1200);
    }, 350);
  }
}

// ================================================================
// COMPLÉTION — Basculement vers dialogue libre
// ================================================================
function _guidedComplete() {
  var total  = _gs.xpEarned;
  var tl     = _gs.tl;
  var nl     = _gs.nl;
  var npc    = _gs.npc;
  var locId  = _gs.locId;
  var errors = _gs.errors;

  // Message de félicitations adapté au score
  var excellent = errors === 0;
  var msgsByLang = {
    fr: excellent
      ? '🏆 Parfait ! +' + total + ' XP !\nMaintenant, parle-moi librement !'
      : '🎉 Bien joué ! +' + total + ' XP !\nEssaie maintenant en écrivant librement.',
    en: excellent
      ? '🏆 Perfect! +' + total + ' XP!\nNow, talk to me freely!'
      : '🎉 Well done! +' + total + ' XP!\nNow try writing to me freely.',
    es: excellent
      ? '🏆 ¡Perfecto! +' + total + ' XP!\n¡Ahora habla conmigo libremente!'
      : '🎉 ¡Bien hecho! +' + total + ' XP!\nAhora intenta escribirme libremente.',
    de: excellent
      ? '🏆 Perfekt! +' + total + ' XP!\nJetzt sprich frei mit mir!'
      : '🎉 Gut gemacht! +' + total + ' XP!\nVersuch jetzt, mir frei zu schreiben.',
    ru: excellent
      ? '🏆 Отлично! +' + total + ' XP!\nТеперь пиши мне свободно!'
      : '🎉 Хорошо! +' + total + ' XP!\nТеперь попробуй писать свободно.',
    zh: excellent
      ? '🏆 完美！+' + total + ' XP！现在自由地和我说话吧！'
      : '🎉 做得好！+' + total + ' XP！现在试着自由地写给我。',
    ja: excellent
      ? '🏆 完璧です！+' + total + ' XP！自由に話しかけてください！'
      : '🎉 よくできました！+' + total + ' XP！自由に書いてみてください。',
    ht: excellent
      ? '🏆 Pafè! +' + total + ' XP!\nKounye a, pale avèk mwen lib!'
      : '🎉 Bon travay! +' + total + ' XP!\nEseye ekri m lib kounye a.'
  };

  var finalMsg = msgsByLang[tl] || msgsByLang.en;
  var finalSub = (tl !== nl && msgsByLang[nl] && msgsByLang[nl] !== finalMsg)
    ? msgsByLang[nl] : null;

  _addBubble('npc', npc.emoji, finalMsg, finalSub, 'var(--gold-warm)');

  if (typeof showNotif    === 'function') showNotif('🎉 +' + total + ' XP !');
  if (typeof launchConfetti === 'function') launchConfetti();

  setTimeout(function() {
    // Nettoyer les choix
    var gc = document.getElementById('guided-choices');
    if (gc) gc.remove();

    // Restaurer currentNPC et currentLoc pour sendMsg()
    if (window.S) {
      S.currentNPC  = npc;
      var loc = (typeof LOCATIONS !== 'undefined')
        ? LOCATIONS.find(function(l) { return l.id === locId; })
        : null;
      S.currentLoc  = loc || { id: locId, npcs: [npc] };
      S.chatHistory = [];
    }
    _gs = null;

    // Activer le champ de saisie libre avec placeholder adapté
    var inp = document.getElementById('dialInput');
    if (inp) {
      var ph = {
        fr:'Écris en ' + (LANG_NAMES && LANG_NAMES[tl] || tl) + '…',
        en:'Write in ' + (LANG_NAMES && LANG_NAMES[tl] || tl) + '…',
        es:'Escribe en ' + (LANG_NAMES && LANG_NAMES[tl] || tl) + '…',
        ht:'Ekri an ' + (LANG_NAMES && LANG_NAMES[tl] || tl) + '…',
        de:'Schreib auf ' + (LANG_NAMES && LANG_NAMES[tl] || tl) + '…',
        ru:'Пиши на ' + (LANG_NAMES && LANG_NAMES[tl] || tl) + '…',
        zh:'用' + (LANG_NAMES && LANG_NAMES[tl] || tl) + '写…',
        ja:(LANG_NAMES && LANG_NAMES[tl] || tl) + 'で書いて…'
      };
      inp.placeholder = ph[nl] || ph.fr;
      inp.disabled    = false;
    }

    // Rebrancher dialSend → sendMsg
    var sendBtn = document.getElementById('dialSend');
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.onclick  = function() { if (typeof sendMsg === 'function') sendMsg(); };
    }

    // Afficher la zone de saisie
    var ia = document.querySelector('.dial-input-area');
    if (ia) { ia.style.display = ''; ia.style.visibility = 'visible'; }

    // RAMPE DE SÉCURITÉ — Afficher les starter chips
    if (typeof window.showStarterSuggestions === 'function') {
      window.showStarterSuggestions();
    }

    setTimeout(function() { if (inp) inp.focus(); }, 200);
  }, 1500);
}

// ================================================================
// UTILITAIRES
// ================================================================
function _getFb(feedbackObj, lang) {
  return feedbackObj[lang] || feedbackObj.en || '';
}

function _getSub(obj, lang, mainText) {
  var candidate = obj[lang] || obj.fr || '';
  return (candidate && candidate !== mainText) ? candidate : '';
}

function _addBubble(type, avatar, text, subtitle, accentColor) {
  var c = document.getElementById('chatMsgs');
  if (!c) return;

  var d = document.createElement('div');
  d.className = 'msg ' + type;

  var isNpc = type === 'npc';
  var bubbleStyle = isNpc
    ? 'background:var(--surface-raised);border:1px solid var(--border-faint);'
    : 'background:rgba(74,158,255,0.12);border:1px solid rgba(74,158,255,0.25);';
  if (accentColor) {
    bubbleStyle += 'border-color:' + accentColor + ';';
  }

  // Formater le texte avec sauts de ligne
  var formattedText = _escHtml(text).replace(/\n/g, '<br>');

  d.innerHTML =
    '<div class="msg-av">' + _escHtml(avatar) + '</div>' +
    '<div class="msg-bubble" style="' + bubbleStyle + '">' + formattedText + '</div>';

  if (subtitle && subtitle !== text) {
    var sub = document.createElement('div');
    sub.style.cssText = [
      'font-size:0.67rem;',
      'color:var(--text-ghost);',
      'margin-top:4px;',
      'padding:0 10px;',
      'font-style:italic;',
      'line-height:1.4;'
    ].join('');
    sub.textContent = subtitle;
    d.appendChild(sub);
  }

  c.appendChild(d);

  // Scroll fluide
  requestAnimationFrame(function() {
    c.scrollTo({ top: c.scrollHeight, behavior: 'smooth' });
  });
}

function _escHtml(t) {
  return String(t)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

console.log('✅ guided_v2.js chargé');
