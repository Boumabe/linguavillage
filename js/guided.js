// guided.js — Dialogues guidés pour débutants
// S'intègre APRÈS dialogue.js sans le remplacer
// Patch openDialogue pour intercepter les débutants
// ================================================================

window.GUIDED_XP_THRESHOLD = 300;

// ── Patch openDialogue : si débutant → guided, sinon → original ──
(function() {
  function _patchWhenReady() {
    var orig = window.openDialogue;
    if (!orig || orig._guided_patched) return;

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
    window.openDialogue._guided_patched = true;
    console.log('✅ guided.js patché openDialogue');
  }

  // Patcher après chargement complet
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(_patchWhenReady, 200); });
  } else {
    setTimeout(_patchWhenReady, 200);
  }
})();

// ================================================================
// OUVERTURE DU DIALOGUE GUIDÉ
// ================================================================
function _openGuided(locId, npcId, guided) {
  var loc = (typeof LOCATIONS !== 'undefined') && LOCATIONS.find(function(l) { return l.id === locId; });
  if (!loc) return;
  var npc = (loc.npcs || []).find(function(n) { return n.id === npcId; });
  if (!npc) return;

  if (window.S) {
    S.currentNPC = npc;
    S.currentLoc = loc;
    S.chatHistory = [];
  }

  var nl = (window.S && S.nativeLang) || 'fr';
  var tl = (window.S && S.targetLang) || 'en';

  // Mettre à jour le header du screen-dialogue
  var dialAv   = document.getElementById('dialAv');
  var dialName = document.getElementById('dialName');
  var dialRole = document.getElementById('dialRole');
  var chatMsgs = document.getElementById('chatMsgs');
  var corrPanel= document.getElementById('corrPanel');
  var dialInput= document.getElementById('dialInput');
  var dialArea = document.getElementById('dialInput') && document.getElementById('dialInput').closest('.dial-input-area');

  if (dialAv)   dialAv.textContent   = npc.emoji;
  if (dialName) dialName.textContent = npc.name;
  if (dialRole) dialRole.textContent = (guided.theme && (guided.theme[nl] || guided.theme.fr)) || '';
  if (chatMsgs) chatMsgs.innerHTML   = '';
  if (corrPanel) corrPanel.className  = 'correction-panel';
  if (dialInput) dialInput.value      = '';

  // Cacher la zone de saisie libre pendant le guided
  var inputArea = document.querySelector('.dial-input-area');
  if (inputArea) inputArea.style.display = 'none';

  // Badge "Dialogue guidé"
  _showGuidedBadge(dialRole, nl);

  if (typeof showScreen === 'function') showScreen('screen-dialogue');

  // Démarrer la première scène
  _guidedState = { locId: locId, npcId: npcId, npc: npc, guided: guided, sceneIdx: 0, xpEarned: 0 };
  _runScene(0, tl, nl, npc);
}

var _guidedState = null;
var _guidedChoicesEl = null;

function _showGuidedBadge(roleEl, nl) {
  var badges = {fr:'📖 Guidé', en:'📖 Guided', es:'📖 Guiado', ht:'📖 Gide', de:'📖 Geführt', ru:'📖 Ведомый', zh:'📖 引导', ja:'📖 ガイド'};
  var badge = document.createElement('span');
  badge.style.cssText = 'display:inline-block;margin-left:8px;font-size:0.65rem;font-weight:800;padding:2px 7px;background:rgba(78,207,112,0.18);border:1px solid #4ecf70;border-radius:8px;color:#4ecf70;vertical-align:middle;';
  badge.textContent = badges[nl] || '📖 Guided';
  if (roleEl) roleEl.appendChild(badge);
}

// ================================================================
// AFFICHER UNE SCÈNE
// ================================================================
function _runScene(idx, tl, nl, npc) {
  if (!_guidedState || !_guidedState.guided.scenes) return;
  var scenes = _guidedState.guided.scenes;

  if (idx >= scenes.length) {
    _guidedComplete(tl, nl, npc);
    return;
  }

  var scene = scenes[idx];
  var chatMsgs = document.getElementById('chatMsgs');
  if (!chatMsgs) return;

  // Message NPC
  var npcMsg = scene.npc[tl] || scene.npc.en || '';
  var npcSub = (tl !== nl) ? (scene.npc[nl] || scene.npc.fr || '') : '';
  _addGuidedBubble('npc', npc.emoji, npcMsg, npcSub);

  // Supprimer l'ancien bloc de choix
  var old = document.getElementById('guided-choices');
  if (old) old.remove();

  // Créer le bloc de choix
  var wrap = document.createElement('div');
  wrap.id  = 'guided-choices';
  wrap.style.cssText = 'padding:10px 16px;display:flex;flex-direction:column;gap:7px;';

  // Indicateur de progression
  var prog = document.createElement('div');
  prog.style.cssText = 'text-align:center;font-size:0.62rem;color:rgba(255,255,255,0.22);margin-bottom:4px;font-weight:700;letter-spacing:0.05em;';
  prog.textContent   = 'SCÈNE ' + (idx + 1) + ' / ' + scenes.length;
  wrap.appendChild(prog);

  scene.choices.forEach(function(ch) {
    var btn = document.createElement('button');
    btn.style.cssText = [
      'display:block;width:100%;padding:13px 16px;',
      'background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,215,0,0.15);',
      'border-radius:14px;color:#e8e0d0;font-size:0.87rem;font-weight:600;',
      'text-align:left;cursor:pointer;transition:all 0.18s;',
      '-webkit-tap-highlight-color:transparent;'
    ].join('');
    btn.textContent = ch.label[tl] || ch.label.en || '';
    btn.addEventListener('click', function() {
      _onChoice(ch, btn, scene, idx, tl, nl, npc, wrap);
    });
    wrap.appendChild(btn);
  });

  chatMsgs.appendChild(wrap);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
  _guidedChoicesEl = wrap;
}

// ================================================================
// CHOIX SÉLECTIONNÉ
// ================================================================
function _onChoice(choice, btn, scene, sceneIdx, tl, nl, npc, wrap) {
  // Désactiver tous les boutons
  wrap.querySelectorAll('button').forEach(function(b) {
    b.disabled = true; b.style.opacity = '0.5';
  });
  btn.style.opacity = '1';

  if (choice.correct) {
    btn.style.background  = 'rgba(78,207,112,0.18)';
    btn.style.borderColor = '#4ecf70';
    btn.style.color       = '#4ecf70';

    // XP
    var xpGain = choice.xp || 15;
    _guidedState.xpEarned += xpGain;
    if (typeof gainXP === 'function') gainXP(xpGain);
    else if (window.S) { S.xp = (S.xp || 0) + xpGain; if (typeof saveGame === 'function') saveGame(); }
    _updateHUD();

    // Feedback
    var fb = scene.feedback.correct[tl] || scene.feedback.correct.en || '';
    var fbSub = (tl !== nl) ? (scene.feedback.correct[nl] || scene.feedback.correct.fr || '') : '';
    setTimeout(function() {
      _addGuidedBubble('npc', npc.emoji, fb, fbSub, '#4ecf70');
      // Sprites
      if (window.LV_SPRITES) window.LV_SPRITES.setExpression('happy', 1500);
      setTimeout(function() {
        _guidedState.sceneIdx = sceneIdx + 1;
        _runScene(_guidedState.sceneIdx, tl, nl, npc);
      }, 1800);
    }, 350);

  } else {
    btn.style.background  = 'rgba(255,80,80,0.12)';
    btn.style.borderColor = '#ff5050';
    btn.style.color       = '#ff7070';

    var fb = scene.feedback.wrong[tl] || scene.feedback.wrong.en || '';
    var fbSub = (tl !== nl) ? (scene.feedback.wrong[nl] || scene.feedback.wrong.fr || '') : '';
    if (window.LV_SPRITES) window.LV_SPRITES.setExpression('confused', 1500);

    // XP partiel
    if (choice.xp > 0) {
      _guidedState.xpEarned += choice.xp;
      if (typeof gainXP === 'function') gainXP(choice.xp);
      _updateHUD();
    }

    setTimeout(function() {
      _addGuidedBubble('npc', npc.emoji, fb, fbSub, '#ff7070');
      // Réactiver les boutons corrects pour réessayer
      setTimeout(function() {
        wrap.querySelectorAll('button').forEach(function(b) {
          if (b.style.color !== 'rgb(255, 112, 112)') {
            b.disabled = false; b.style.opacity = '1';
          }
        });
      }, 1200);
    }, 350);
  }
}

// ================================================================
// FIN DU GUIDED → BASCULER EN LIBRE
// ================================================================
function _guidedComplete(tl, nl, npc) {
  var total = _guidedState.xpEarned;
  var msgs  = {
    fr: '🎉 Bravo ! Tu as terminé ce dialogue. +' + total + ' XP !\nParlons maintenant librement !',
    en: '🎉 Well done! Dialogue complete. +' + total + ' XP!\nLet\'s chat freely now!',
    es: '🎉 ¡Bravo! Diálogo completado. +' + total + ' XP!\n¡Ahora hablemos libremente!',
    ht: '🎉 Bravo! Dyalòg fini. +' + total + ' XP!\nAnn pale lib kounye a!',
    de: '🎉 Bravo! Dialog abgeschlossen. +' + total + ' XP!\nJetzt reden wir frei!',
    ru: '🎉 Браво! Диалог завершён. +' + total + ' XP!\nТеперь говорим свободно!',
    zh: '🎉 太棒了！对话完成。+' + total + ' XP！\n现在自由聊天！',
    ja: '🎉 ブラボー！対話完了。+' + total + ' XP！\n自由に話しましょう！'
  };
  _addGuidedBubble('npc', npc.emoji, msgs[tl] || msgs.en, msgs[nl] !== msgs[tl] ? msgs[nl] : null, '#ffd700');
  if (typeof showNotif === 'function') showNotif('🎉 +' + total + ' XP !');
  if (typeof launchConfetti === 'function') launchConfetti();

  // Supprimer les choix guidés
  var gc = document.getElementById('guided-choices');
  if (gc) setTimeout(function() { gc.remove(); }, 300);

  // Afficher la zone de saisie libre
  setTimeout(function() {
    var inputArea = document.querySelector('.dial-input-area');
    if (inputArea) inputArea.style.display = '';
    var inp = document.getElementById('dialInput');
    if (inp) { inp.placeholder = '...'; setTimeout(function() { inp.focus(); }, 200); }
    _guidedState = null;
  }, 1500);
}

// ================================================================
// UTILITAIRES
// ================================================================
function _addGuidedBubble(type, avatar, text, subtitle, accentColor) {
  var c = document.getElementById('chatMsgs');
  if (!c) return;
  var isNpc = type === 'npc';
  var d = document.createElement('div');
  d.className = 'msg ' + type;

  var bubbleStyle = isNpc
    ? 'background:rgba(255,255,255,0.07);border:1.5px solid rgba(255,255,255,0.10);'
    : 'background:rgba(74,158,255,0.15);border:1.5px solid rgba(74,158,255,0.22);';
  if (accentColor) bubbleStyle += 'border-color:' + accentColor + '55;';

  d.innerHTML = '<div class="msg-av">' + avatar + '</div>'
    + '<div class="msg-bubble" style="' + bubbleStyle + '">' + _escHtml(text) + '</div>';

  if (subtitle && subtitle !== text) {
    var sub = document.createElement('div');
    sub.style.cssText = 'font-size:0.68rem;color:rgba(255,255,255,0.28);margin-top:3px;padding:0 12px;font-style:italic;';
    sub.textContent   = subtitle;
    d.appendChild(sub);
  }
  c.appendChild(d);
  c.scrollTop = c.scrollHeight;
}

function _updateHUD() {
  var xp = (window.S && S.xp) || 0;
  var el = document.getElementById('hudXP');   if (el) el.textContent = xp + ' XP';
  var e2 = document.getElementById('menuXP');  if (e2) e2.textContent = xp + ' XP';
  var xf = document.getElementById('xpFill');  if (xf) xf.style.width = (xp % 100) + '%';
}

function _escHtml(t) {
  return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

console.log('✅ guided.js chargé');
