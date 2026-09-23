// LinguaVillage — dialogue.js (v3)
// Module UNIQUE de conversation avec les PNJ : dialogue guidé (débutants) puis dialogue libre (IA).
// Remplace l'ancien trio dialogue.js + guided_v2.js + pnj.js (qui se « patchaient » entre eux
// avec des délais de 350 ms et comptaient certaines sessions en double).
// Nouveautés : traduction au toucher, saisie vocale, suggestions, avatar animé (humeur),
// bouton retour Android géré, village mis en pause pendant la conversation, XP via gainXP,
// erreurs réseau expliquées clairement (plus de fausse réponse en anglais).
// ================================================================

var GUIDED_XP_THRESHOLD = 300;           // en dessous : guidé ; au-dessus : IA libre
window.GUIDED_XP_THRESHOLD = GUIDED_XP_THRESHOLD;

var _dlgState = {
  locId: null, npcId: null, npc: null, guided: null,
  sceneIdx: 0, history: [], isOpen: false, xpEarned: 0, errors: 0,
  busy: false, lastXpAt: 0, tl: 'en', nl: 'fr'
};
window._dlgState = _dlgState;

function _dlgPick(obj, lang, alt) {
  if (!obj) return '';
  return obj[lang] || obj[alt || 'en'] || obj.fr || obj.en || '';
}
function _dlgSub(obj, nl, main) {
  var c = _dlgPick(obj, nl, 'fr');
  return c && c !== main ? c : '';
}
var _DLG_ICON = {
  close: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  send:  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  mic:   '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  speak: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>'
};
var _DLG_BCP47 = { en:'en-US', fr:'fr-FR', es:'es-ES', ht:'ht-HT', de:'de-DE', ru:'ru-RU', zh:'zh-CN', ja:'ja-JP' };

var _DLG_TXT = {
  guided: { fr:'Guidé', en:'Guided', es:'Guiado', ht:'Gide', de:'Geführt', ru:'Урок', zh:'引导', ja:'ガイド' },
  free:   { fr:'Libre', en:'Free', es:'Libre', ht:'Lib', de:'Frei', ru:'Свободно', zh:'自由', ja:'自由' },
  write:  { fr:'Écris en', en:'Write in', es:'Escribe en', ht:'Ekri an', de:'Schreib auf', ru:'Пиши на', zh:'用', ja:'' },
  mic:    { fr:'Parler', en:'Speak', es:'Hablar', ht:'Pale', de:'Sprechen', ru:'Говорить', zh:'说话', ja:'話す' },
  err:    { fr:"Désolé, je n'ai pas pu répondre. Réessaie dans un instant !", en:"Sorry, I couldn't answer. Try again in a moment!",
            es:'Lo siento, no pude responder. ¡Inténtalo de nuevo!', ht:'Padon, mwen pa t kapab reponn. Eseye ankò!',
            de:'Entschuldigung, ich konnte nicht antworten. Versuche es erneut!', ru:'Извини, не смог ответить. Попробуй снова!',
            zh:'抱歉，我无法回复。请再试！', ja:'申し訳ありません、返答できませんでした。もう一度どうぞ！' },
  offline:{ fr:'Pas de connexion internet. Vérifie ton réseau puis réessaie.', en:'No internet connection. Check your network and try again.',
            es:'Sin conexión a internet. Revisa tu red.', ht:'Pa gen entènèt. Verifye rezo a.', de:'Keine Internetverbindung.', ru:'Нет подключения к интернету.', zh:'没有网络连接。', ja:'インターネットに接続されていません。' },
  busy:   { fr:"Trop de messages d'un coup — attends quelques secondes.", en:'Too many messages at once — wait a few seconds.',
            es:'Demasiados mensajes seguidos — espera unos segundos.', ht:'Twòp mesaj alafwa — tann kèk segonn.', de:'Zu viele Nachrichten — bitte kurz warten.', ru:'Слишком много сообщений — подожди немного.', zh:'消息太多，请稍等几秒。', ja:'メッセージが多すぎます。少し待ってください。' },
  hello:  { fr:'Bonjour ! Je suis {n}. Parlons en {l} !', en:"Hello! I am {n}. Let's chat in {l}!", es:'¡Hola! Soy {n}. ¡Hablemos en {l}!',
            ht:'Bonjou! Mwen se {n}. Ann pale an {l}!', de:'Hallo! Ich bin {n}. Lass uns auf {l} reden!', ru:'Привет! Я {n}. Поговорим на {l}!',
            zh:'你好！我是{n}。让我们说{l}！', ja:'こんにちは！私は{n}です。{l}で話しましょう！' },
  done:   { fr:'🎉 Bravo ! Dialogue terminé : +{x} XP. Tu peux maintenant parler librement avec moi !', en:'🎉 Well done! Dialogue complete: +{x} XP. You can now talk freely with me!',
            es:'🎉 ¡Bravo! Diálogo completado: +{x} XP. ¡Ahora puedes hablar libremente conmigo!', ht:'🎉 Bravo! Dyalòg fini: +{x} XP. Kounye a ou ka pale lib avèk mwen!',
            de:'🎉 Bravo! Dialog beendet: +{x} XP. Jetzt kannst du frei mit mir sprechen!', ru:'🎉 Браво! Диалог завершён: +{x} XP. Теперь говори со мной свободно!',
            zh:'🎉 太棒了！对话完成：+{x} XP。现在可以自由交谈了！', ja:'🎉 ブラボー！対話完了：+{x} XP。自由に話しかけてください！' }
};
function _dlgT(key, lang) { var t = _DLG_TXT[key]; return (t && (t[lang] || t.fr)) || ''; }

// ================================================================
// POINT D'ENTRÉE
// ================================================================
function openDialogue(locId, npcId) {
  var loc = (typeof LOCATIONS !== 'undefined') && LOCATIONS.find(function (l) { return l.id === locId; });
  if (!loc) { console.warn('Lieu introuvable:', locId); return; }
  var npc = (loc.npcs || []).find(function (n) { return n.id === npcId; }) || (loc.npcs || [])[0];
  if (!npc) { console.warn('PNJ introuvable dans', locId); return; }

  if (_dlgState.isOpen) _closeDlg(true, true);   // jamais deux dialogues empilés

  var xp = (window.S && S.xp) || 0;
  var guided = window.GUIDED_DIALOGUES && window.GUIDED_DIALOGUES[locId];
  var useGuided = !!(guided && guided.scenes && guided.scenes.length && !guided.freeFromStart && xp < GUIDED_XP_THRESHOLD);

  _dlgState.locId = locId; _dlgState.npcId = npc.id; _dlgState.npc = npc;
  _dlgState.guided = useGuided ? guided : null;
  _dlgState.sceneIdx = 0; _dlgState.history = []; _dlgState.isOpen = true;
  _dlgState.xpEarned = 0; _dlgState.errors = 0; _dlgState.busy = false;
  _dlgState.tl = (window.S && S.targetLang) || 'en';
  _dlgState.nl = (window.S && S.nativeLang) || 'fr';

  if (window.S) { S.currentNPC = npc; S.currentLoc = loc; S.chatHistory = []; if (!S.weakPoints) S.weakPoints = {}; }
  if (window.LV_MEMORY && LV_MEMORY.newSession) { try { LV_MEMORY.newSession(); } catch (e) {} }
  if (window.LV_VILLAGE && LV_VILLAGE.suspend) LV_VILLAGE.suspend('dialogue');

  _buildDialogueUI(npc, useGuided ? guided : null);
  if (window.LV && LV.nav) LV.nav.pushLayer('dialogue', function () { _closeDlg(true); });
  if (window.LV) { LV.haptic(12); LV.emit('dialogue-open', { locId: locId, npcId: npc.id, guided: useGuided }); }

  if (useGuided) _runScene(0); else _switchToFreeMode();
}

// ================================================================
// INTERFACE
// ================================================================
function _buildDialogueUI(npc, guided) {
  var old = document.getElementById('dlg-overlay'); if (old) old.remove();
  var nl = _dlgState.nl, tl = _dlgState.tl, esc = LV.esc;
  var role = (npc.role && (npc.role[nl] || npc.role.fr)) || '';
  var theme = guided && guided.theme ? _dlgPick(guided.theme, nl, 'fr') : '';
  var pct = (typeof PLI !== 'undefined' && PLI.ratio) ? Math.round(PLI.ratio() * 100) : 45;
  var lname = (window.LANG_NAMES && LANG_NAMES[tl]) || tl;

  var ov = document.createElement('div');
  ov.id = 'dlg-overlay'; ov.className = 'dlg';
  ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', npc.name);
  ov.innerHTML =
    '<header class="dlg-head">' +
      '<button class="dlg-close" type="button" aria-label="Fermer" onclick="_closeDlg()">' + _DLG_ICON.close + '</button>' +
      '<div class="dlg-avatar" id="dlg-avatar" data-mood="neutral"><span>' + esc(npc.emoji || '🙂') + '</span></div>' +
      '<div class="dlg-who"><div class="dlg-name">' + esc(npc.name) + '</div>' +
        '<div class="dlg-role">' + esc(role) + (theme ? ' · ' + esc(theme) : '') + '</div></div>' +
      '<span class="dlg-mode' + (guided ? ' guided' : '') + '" id="dlg-mode">' + esc(_dlgT(guided ? 'guided' : 'free', nl)) + '</span>' +
    '</header>' +
    '<div class="dlg-immersion" id="dlg-immersion"><span>immersion</span>' +
      '<div class="dlg-track"><div style="width:' + pct + '%"></div></div><b>' + pct + '% ' + esc(lname) + '</b></div>' +
    '<div id="dlg-messages" class="dlg-messages" aria-live="polite"></div>' +
    '<div id="dlg-choices" class="dlg-choices"></div>' +
    '<div id="dlg-free-input" class="dlg-free" style="display:none">' +
      '<div class="dlg-chips" id="dlg-chips"></div>' +
      '<div class="dlg-inputrow">' +
        '<button id="dlg-mic" class="dlg-icon-btn" type="button" aria-label="' + esc(_dlgT('mic', nl)) + '" style="display:none">' + _DLG_ICON.mic + '</button>' +
        '<input id="dlg-input" type="text" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="send" maxlength="300" ' +
          'placeholder="' + esc((_dlgT('write', nl) + ' ' + lname + '…').trim()) + '" aria-label="Message">' +
        '<button id="dlg-send" class="dlg-send" type="button" aria-label="Envoyer">' + _DLG_ICON.send + '</button>' +
      '</div>' +
    '</div>' +
    '<div id="dlg-xp-bar" class="dlg-xp"><div class="dlg-xp-fill"></div></div>';
  document.body.appendChild(ov);

  var inp = document.getElementById('dlg-input');
  inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); _sendFreeMsg(); } });
  inp.addEventListener('input', function () {
    var c = document.getElementById('dlg-chips'); if (c) c.classList.toggle('hide', inp.value.length > 0);
  });
  // Mission en cours (choisie dans le panneau du lieu) : on affiche son indice dans le champ
  if (window._activeMission && window._activeMission.hint) {
    var mh = window._activeMission.hint[nl] || window._activeMission.hint.fr;
    if (mh) inp.placeholder = '💡 ' + mh;
  }
  document.getElementById('dlg-send').addEventListener('click', function () { _sendFreeMsg(); });
  ov.addEventListener('keydown', function (e) { if (e.key === 'Escape') _closeDlg(); });
  _bindMessagesDelegation(document.getElementById('dlg-messages'));
  _bindMic();
  _updateXPBar();
}

// 🔊 et « toucher une bulle = voir la traduction » : un seul gestionnaire (aucun texte de l'IA dans un onclick)
function _bindMessagesDelegation(el) {
  el.addEventListener('click', function (e) {
    var say = e.target.closest('.dlg-speak');
    if (say) { e.stopPropagation(); if (typeof window.speakW === 'function') window.speakW(say.getAttribute('data-speak-text')); return; }
    var b = e.target.closest('.dlg-bubble.has-sub');
    if (b) { var open = b.classList.toggle('sub-open'); b.setAttribute('aria-expanded', open ? 'true' : 'false'); }
  });
}

// Humeur de l'avatar (appelée aussi par sprites.js)
window._dlgSetMood = function (mood, ms) {
  var av = document.getElementById('dlg-avatar'); if (!av) return;
  av.setAttribute('data-mood', mood || 'neutral');
  clearTimeout(av._t);
  if (ms) av._t = setTimeout(function () { av.setAttribute('data-mood', 'neutral'); }, ms);
};

// ================================================================
// DIALOGUE GUIDÉ
// ================================================================
function _runScene(idx) {
  var g = _dlgState.guided;
  if (!g || !_dlgState.isOpen) return;
  if (idx >= g.scenes.length) { _guidedComplete(); return; }
  _dlgState.sceneIdx = idx;
  var scene = g.scenes[idx], tl = _dlgState.tl, nl = _dlgState.nl;

  var msg = _dlgPick(scene.npc, tl);
  _addBubble('npc', msg, tl !== nl ? _dlgSub(scene.npc, nl, msg) : '');

  var wrap = document.getElementById('dlg-choices');
  if (!wrap) return;
  wrap.innerHTML = ''; wrap.style.display = 'block';
  var pct = Math.round((idx / g.scenes.length) * 100);
  var prog = document.createElement('div');
  prog.className = 'dlg-prog';
  prog.innerHTML = '<div class="dlg-prog-track"><div style="width:' + pct + '%"></div></div><span>' + (idx + 1) + '/' + g.scenes.length + '</span>';
  wrap.appendChild(prog);

  if (scene.scaffold === 'fill' && scene.fillPrompt) _renderFill(wrap, scene, idx);
  else _renderChoices(wrap, scene, idx);
}

function _renderChoices(wrap, scene, idx) {
  (scene.choices || []).forEach(function (ch) {
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'dlg-choice';
    btn.textContent = _dlgPick(ch.label, _dlgState.tl);
    btn.addEventListener('click', function () { _onChoice(ch, btn, scene, idx, wrap); });
    wrap.appendChild(btn);
  });
}

function _renderFill(wrap, scene, idx) {
  var prompt = _dlgPick(scene.fillPrompt, _dlgState.tl);
  var p = document.createElement('div'); p.className = 'dlg-fillprompt';
  p.innerHTML = LV.esc(prompt).replace('[___]', '<span class="dlg-blank">___</span>');
  wrap.appendChild(p);
  var row = document.createElement('div'); row.className = 'dlg-fillrow';
  var inp = document.createElement('input'); inp.type = 'text'; inp.className = 'dlg-fillinput';
  inp.placeholder = '…'; inp.autocomplete = 'off'; inp.setAttribute('autocapitalize', 'off'); inp.setAttribute('aria-label', 'Réponse');
  var ok = document.createElement('button'); ok.type = 'button'; ok.className = 'dlg-fillbtn'; ok.textContent = '✓'; ok.setAttribute('aria-label', 'Valider');
  function check() {
    var v = inp.value.trim(); if (!v) return;
    var ans = scene.fillAnswer;
    _onFillResult(ans ? v.toLowerCase() === String(ans).toLowerCase() : true, ans, scene, idx, inp, ok);
  }
  ok.addEventListener('click', check);
  inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); });
  row.appendChild(inp); row.appendChild(ok); wrap.appendChild(row);
  setTimeout(function () { inp.focus(); }, 200);
}

function _award(xp) {          // toujours via gainXP : toast, rang, badges, objectif du jour, sauvegarde
  if (!xp) return;
  _dlgState.xpEarned += xp;
  if (typeof gainXP === 'function') gainXP(xp); else if (window.S) S.xp = (S.xp || 0) + xp;
  _updateXPBar();
}
function _weak(key) {
  if (!window.S || !key) return;
  S.weakPoints = S.weakPoints || {}; S.weakPoints[key] = (S.weakPoints[key] || 0) + 1;
}

function _onFillResult(ok, answer, scene, idx, inp, btn) {
  var tl = _dlgState.tl, nl = _dlgState.nl;
  inp.disabled = true; btn.disabled = true;
  if (ok) {
    inp.classList.add('correct'); LV.haptic(15);
    _award(scene.xp || 18);
    var fb = _dlgPick(scene.feedback && scene.feedback.correct, tl);
    window._dlgSetMood('happy', 1500);
    setTimeout(function () {
      if (fb) _addBubble('npc', fb, _dlgSub(scene.feedback.correct, nl, fb), 'ok');
      setTimeout(function () { _runScene(idx + 1); }, 1500);
    }, 350);
  } else {
    inp.classList.add('wrong'); _dlgState.errors++; LV.haptic([20, 40, 20]);
    _weak(answer);
    var fb2 = _dlgPick(scene.feedback && scene.feedback.wrong, tl);
    window._dlgSetMood('confused', 1500);
    setTimeout(function () {
      _addBubble('npc', (fb2 || '') + (answer ? '\n✨ ' + answer : ''), null, 'warn');
      setTimeout(function () { inp.disabled = false; btn.disabled = false; inp.value = ''; inp.classList.remove('wrong'); inp.focus(); }, 1600);
    }, 300);
  }
}

function _onChoice(choice, btn, scene, idx, wrap) {
  var tl = _dlgState.tl, nl = _dlgState.nl;
  wrap.querySelectorAll('.dlg-choice').forEach(function (b) { b.disabled = true; b.classList.add('dim'); });
  btn.classList.remove('dim');
  if (choice.correct) {
    btn.classList.add('correct'); LV.haptic(15);
    _award(choice.xp || 15);
    var fb = _dlgPick(scene.feedback && scene.feedback.correct, tl);
    window._dlgSetMood('happy', 1500);
    setTimeout(function () {
      _addBubble('npc', fb, tl !== nl ? _dlgSub(scene.feedback.correct, nl, fb) : '', 'ok');
      setTimeout(function () { _runScene(idx + 1); }, 1600);
    }, 350);
  } else {
    btn.classList.add('wrong'); _dlgState.errors++; LV.haptic([20, 40, 20]);
    _weak(_dlgPick(scene.npc, tl));
    if (choice.xp > 0) _award(choice.xp);
    var fb2 = _dlgPick(scene.feedback && scene.feedback.wrong, tl);
    window._dlgSetMood('confused', 1500);
    setTimeout(function () {
      _addBubble('npc', fb2, tl !== nl ? _dlgSub(scene.feedback.wrong, nl, fb2) : '', 'warn');
      setTimeout(function () {
        wrap.querySelectorAll('.dlg-choice').forEach(function (b) { if (!b.classList.contains('wrong')) { b.disabled = false; b.classList.remove('dim'); } });
      }, 1000);
    }, 350);
  }
}

function _guidedComplete() {
  var tl = _dlgState.tl, nl = _dlgState.nl, total = _dlgState.xpEarned;
  var msg = _dlgT('done', tl).replace('{x}', total);
  var sub = tl !== nl ? _dlgT('done', nl).replace('{x}', total) : '';
  _addBubble('npc', msg, sub, 'gold');
  window._dlgSetMood('happy', 2500);
  if (typeof launchConfetti === 'function' && _dlgState.errors === 0) launchConfetti();
  _dlgState.guided = null;
  setTimeout(function () { if (_dlgState.isOpen) _switchToFreeMode(true); }, 1500);
}

// ================================================================
// DIALOGUE LIBRE (IA)
// ================================================================
function _switchToFreeMode(afterGuided) {
  var ch = document.getElementById('dlg-choices'); if (ch) { ch.innerHTML = ''; ch.style.display = 'none'; }
  var free = document.getElementById('dlg-free-input'); if (free) free.style.display = 'block';
  var mode = document.getElementById('dlg-mode');
  if (mode) { mode.classList.remove('guided'); mode.textContent = _dlgT('free', _dlgState.nl); }

  var tl = _dlgState.tl, nl = _dlgState.nl, npc = _dlgState.npc;
  if (!afterGuided && _dlgState.history.length === 0) {
    var lname = (window.LANG_NAMES && LANG_NAMES[tl]) || tl;
    var nm = npc ? npc.name : '';
    var m = _dlgT('hello', tl).replace('{n}', nm).replace('{l}', lname);
    var s = tl !== nl ? _dlgT('hello', nl).replace('{n}', nm).replace('{l}', lname) : '';
    _addBubble('npc', m, s);
  }
  _renderChips();
  setTimeout(function () { var i = document.getElementById('dlg-input'); if (i && _dlgState.isOpen) i.focus(); }, 300);
}

function _renderChips() {
  var box = document.getElementById('dlg-chips'); if (!box) return;
  var pool = (window.STARTERS && (STARTERS[_dlgState.tl] || STARTERS.en)) || [];
  box.innerHTML = ''; box.classList.remove('hide');
  pool.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 3).forEach(function (t) {
    var c = document.createElement('button'); c.type = 'button'; c.className = 'dlg-chip'; c.textContent = t;
    c.addEventListener('click', function () {
      var i = document.getElementById('dlg-input'); if (i) { i.value = t; i.focus(); }
      box.classList.add('hide');
    });
    box.appendChild(c);
  });
}

function _sendFreeMsg() {
  var inp = document.getElementById('dlg-input');
  if (!inp || _dlgState.busy) return;
  var msg = inp.value.trim();
  if (!msg) return;
  inp.value = '';
  _stopMic();
  _dlgState.busy = true;
  var sendBtn = document.getElementById('dlg-send'); if (sendBtn) sendBtn.disabled = true;

  _addBubble('player', msg);
  if (window.S) { S.chatHistory = S.chatHistory || []; S.chatHistory.push({ role: 'user', content: msg }); }
  var typing = _addTypingIndicator();
  window._dlgSetMood('thinking', 0);

  _callNPCAPI(msg, function (reply, translation) {
    _removeTypingIndicator(typing);
    _addBubble('npc', reply, translation);
    if (window.S) S.chatHistory.push({ role: 'assistant', content: reply });
    _dlgState.busy = false; if (sendBtn) sendBtn.disabled = false;
    var i = document.getElementById('dlg-input'); if (i) i.focus();
  }, function (err) {
    _removeTypingIndicator(typing);
    var code = err && err.code;
    var key = code === 'offline' ? 'offline' : (code === 'rate_limited' ? 'busy' : 'err');
    _addBubble('npc', _dlgT(key, _dlgState.nl), null, 'warn');
    window._dlgSetMood('sad', 2000);
    var i = document.getElementById('dlg-input'); if (i) { i.value = msg; i.focus(); }   // renvoi d'un toucher
    _dlgState.busy = false; if (sendBtn) sendBtn.disabled = false;
  });
}

// ── Contexte enrichi (personnalité du PNJ, mémoire, pièges pédagogiques) ─
var NPC_PEDAGOGY = {
  teacher:   { style:'formel et encourageant', domain:'grammaire, vocabulaire scolaire, prononciation', corrects:true,  introduces:'règles grammaticales' },
  merchant:  { style:'familier et pratique', domain:'nombres, prix, marchandises, négociation', corrects:false, introduces:'vocabulaire commercial' },
  doctor:    { style:'professionnel et clair', domain:'corps humain, symptômes, soins, urgences', corrects:true,  introduces:'vocabulaire médical de base' },
  pastor:    { style:'solennel et bienveillant', domain:'valeurs, communauté, expressions formelles', corrects:false, introduces:'expressions formelles et de respect' },
  bartender: { style:'décontracté et sociable', domain:'boissons, nourriture, conversations informelles', corrects:false, introduces:'expressions du quotidien' },
  officer:   { style:'formel et direct', domain:'directions, identité, urgences, règles', corrects:true,  introduces:'vocabulaire civique et de la sécurité' },
  officer2:  { style:'formel et direct', domain:'directions, identité, urgences, règles', corrects:true,  introduces:'vocabulaire civique et de la sécurité' },
  banker:    { style:'professionnel et précis', domain:'argent, chiffres, transactions, formulaires', corrects:true,  introduces:'vocabulaire financier de base' },
  nurse:     { style:'chaleureux et rassurant', domain:'santé, symptômes, soins courants, émotions', corrects:false, introduces:'vocabulaire de la santé et du bien-être' },
  friend:    { style:'très informel et enthousiaste', domain:'vie quotidienne, loisirs, émotions, amitié', corrects:false, introduces:'argot doux et expressions courantes' },
  psychologist: { style:"à l'écoute, douce, jamais pressée ni jugeante", domain:'émotions, ressenti, vie intérieure', corrects:false, introduces:'vocabulaire des émotions et du ressenti', openQuestionsOnly:true },
  default:   { style:'simple et pédagogique', domain:'vocabulaire général', corrects:true,  introduces:'expressions de base' }
};
var _FIRST_PERSON_MARKERS = {
  fr: ['je ', "j'", 'moi', 'mon ', 'ma ', 'mes '], en: ['i ', "i'm", 'my ', 'me ', 'mine'], es: ['yo ', 'mi ', 'mis ', 'me '],
  ht: ['mwen'], de: ['ich ', 'mein', 'mir '], ru: ['я ', 'мой', 'моя', 'мне'], zh: ['我'], ja: ['私', 'わたし', '僕', 'ぼく']
};
function _messageHasFirstPersonMarker(msg, lang) {
  var lower = String(msg || '').toLowerCase();
  return (_FIRST_PERSON_MARKERS[lang] || _FIRST_PERSON_MARKERS.fr).some(function (m) { return lower.indexOf(m) !== -1; });
}
function _analyzeNpcReply(reply) {
  var lower = String(reply || '').toLowerCase();
  var corr = ['on dit', 'il faut dire', 'la forme correcte', 'vous devriez dire', 'devrait être', "c'est plutôt", 'mais on dit', 'koreksyon', 'correction', 'correcto', 'richtig ist', 'you should say', 'we say', 'correct form', '✨'];
  var succ = ['parfait', 'excellent', 'bravo', 'très bien', 'super', 'fantastique', 'félicitations', 'exselans', 'perfecto', 'genau richtig', 'sehr gut', 'perfectly', 'great job', 'well done', 'perfect', 'great!'];
  return {
    hasCorrection: corr.some(function (s) { return lower.indexOf(s) !== -1; }),
    hasSuccess: succ.some(function (s) { return lower.indexOf(s) !== -1; })
  };
}
function _buildEnrichedContext(npc, nl, tl, userMsg) {
  var parts = [];
  var ped = NPC_PEDAGOGY[npc ? npc.id : null] || NPC_PEDAGOGY.default;
  parts.push('Style du PNJ: ' + ped.style + '. Domaine: ' + ped.domain + '. Introduit: ' + ped.introduces + '.');
  parts.push(ped.corrects
    ? "Si l'apprenant fait une faute, corrige-le gentiment en incluant la forme correcte."
    : "Si l'apprenant fait une faute, reformule naturellement la phrase correcte sans le signaler explicitement.");
  if (ped.openQuestionsOnly && (_messageHasFirstPersonMarker(userMsg, tl) || _messageHasFirstPersonMarker(userMsg, nl))) {
    parts.push("L'apprenant parle de lui-même : réponds UNIQUEMENT par une question ouverte qui l'invite à développer ce qu'il ressent (jamais oui/non, jamais de conseil ni de jugement). Reste bref.");
  }
  if (window.LV_CITIZENS && npc && LV_CITIZENS.getCitizenContext) { try { var c = LV_CITIZENS.getCitizenContext(npc.id); if (c) parts.push(c); } catch (e) {} }
  if (window.LV_MEMORY && LV_MEMORY.getLVContext) { try { parts.push(LV_MEMORY.getLVContext()); } catch (e) {} }
  if (window.CURRICULUM && CURRICULUM.buildPitfallPromptSnippet) { try { var sn = CURRICULUM.buildPitfallPromptSnippet(tl, nl); if (sn) parts.push(sn); } catch (e) {} }
  return parts.join('\n');
}

function _callNPCAPI(userMsg, onSuccess, onError) {
  var nl = _dlgState.nl, tl = _dlgState.tl, npc = _dlgState.npc, loc = _dlgState.locId;
  var guided = window.GUIDED_DIALOGUES && window.GUIDED_DIALOGUES[loc];
  var theme = guided && guided.theme ? _dlgPick(guided.theme, nl, 'fr') : '';
  var history = _dlgState.history.slice(-8).map(function (h) {
    return { role: h.role === 'player' ? 'user' : 'assistant', content: h.text };
  });
  _dlgState.history.push({ role: 'player', text: userMsg });
  if (window.LV_MEMORY && LV_MEMORY.newMessage) { try { LV_MEMORY.newMessage(); } catch (e) {} }
  if (typeof onMessageSent === 'function') { try { onMessageSent(userMsg); } catch (e) {} }

  var locName = (window.LOC_NAMES && LOC_NAMES[loc] && (LOC_NAMES[loc][nl] || LOC_NAMES[loc].fr)) || loc;
  callAPIWithFallback('/api/dialogue', {
    userMessage: userMsg, nativeLang: nl, targetLang: tl,
    npcName: npc ? npc.name : 'PNJ', npcRole: npc && npc.role ? (npc.role[nl] || npc.role.fr) : '',
    location: locName, theme: theme, playerXP: (window.S && S.xp) || 0,
    playerName: (window.S && S.playerName) || '', scriptPref: (window.S && S.scriptPref) || 'both',
    history: history, systemContext: _buildEnrichedContext(npc, nl, tl, userMsg)
  }, { skipCache: true }).then(function (result) {
    var reply = String(result.reply || result.message || '').trim();
    if (!reply) throw Object.assign(new Error('empty'), { code: 'empty' });
    _dlgState.history.push({ role: 'npc', text: reply });

    // XP : 5 par vrai message, sans farm (≥ 2 mots ou 8 caractères, 4 s d'écart)
    var now = Date.now(), words = userMsg.split(/\s+/).length;
    if ((words >= 2 || userMsg.length >= 8) && now - _dlgState.lastXpAt > 4000) { _dlgState.lastXpAt = now; _award(5); }

    var a = _analyzeNpcReply(reply);
    window._dlgSetMood(a.hasSuccess ? 'happy' : a.hasCorrection ? 'confused' : 'neutral', 1800);
    if (window.LV_MEMORY) {
      var fw = (userMsg.split(' ').filter(function (w) { return w.length > 2; })[0]) || null;
      try { if (a.hasCorrection && fw) LV_MEMORY.markWeak(fw); if (a.hasSuccess && fw) LV_MEMORY.markMastered(fw); } catch (e) {}
    }
    onSuccess(reply, result.translation && result.translation !== reply ? result.translation : null);
  }).catch(function (e) {
    console.warn('Dialogue IA :', e && (e.code || e.message));
    onError(e);
  });
}

// ================================================================
// BULLES
// ================================================================
function _addBubble(role, text, subtitle, tone) {
  var msgs = document.getElementById('dlg-messages');
  if (!msgs) return null;
  var isNpc = role === 'npc';
  var row = document.createElement('div');
  row.className = 'dlg-row ' + (isNpc ? 'npc' : 'player');

  var b = document.createElement('div');
  b.className = 'dlg-bubble' + (tone ? ' tone-' + tone : '');
  if (isNpc) {
    b.innerHTML = '<span class="dlg-text">' + LV.esc(text).replace(/\n/g, '<br>') + '</span>' +
      '<button type="button" class="dlg-speak" data-speak-text="' + LV.esc(text) + '" aria-label="Écouter">' + _DLG_ICON.speak + '</button>';
    if (subtitle) {
      var sub = document.createElement('div'); sub.className = 'dlg-sub'; sub.textContent = subtitle;
      b.appendChild(sub);
      b.classList.add('has-sub');
      b.setAttribute('role', 'button'); b.setAttribute('tabindex', '0');
      // Débutants : sous-titre visible. Avancés : caché, à révéler d'un toucher (entraîne la compréhension).
      var show = ((window.S && S.xp) || 0) < GUIDED_XP_THRESHOLD;
      if (show) b.classList.add('sub-open');
      b.setAttribute('aria-expanded', show ? 'true' : 'false');
      b.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.click(); } });
    }
  } else {
    b.textContent = text;
  }
  row.appendChild(b);
  msgs.appendChild(row);
  msgs.scrollTop = msgs.scrollHeight;
  return row;
}

function _addTypingIndicator() {
  var msgs = document.getElementById('dlg-messages'); if (!msgs) return null;
  var row = document.createElement('div');
  row.className = 'dlg-row npc dlg-typing';
  row.innerHTML = '<div class="dlg-bubble"><span class="dlg-dots"><i></i><i></i><i></i></span></div>';
  msgs.appendChild(row); msgs.scrollTop = msgs.scrollHeight;
  return row;
}
function _removeTypingIndicator(el) { if (el && el.parentNode) el.parentNode.removeChild(el); }

// ================================================================
// SAISIE VOCALE (Web Speech API — masquée si non supportée)
// ================================================================
var _mic = { rec: null, on: false };
function _bindMic() {
  var btn = document.getElementById('dlg-mic'); if (!btn) return;
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  btn.style.display = '';
  btn.addEventListener('click', function () {
    if (_mic.on) { _stopMic(); return; }
    try {
      var r = new SR();
      r.lang = _DLG_BCP47[_dlgState.tl] || 'en-US'; r.interimResults = true; r.maxAlternatives = 1; r.continuous = false;
      r.onresult = function (e) {
        var t = ''; for (var i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
        var inp = document.getElementById('dlg-input'); if (inp) { inp.value = t; inp.dispatchEvent(new Event('input')); }
      };
      r.onerror = function (e) {
        _stopMic();
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') showNotif('🎤 Autorise le micro pour parler.', 3500);
        else if (e.error === 'language-not-supported') showNotif("🎤 Cette langue n'est pas reconnue par ton appareil.", 3500);
      };
      r.onend = function () { _stopMic(true); var inp = document.getElementById('dlg-input'); if (inp) inp.focus(); };
      _mic.rec = r; _mic.on = true; btn.classList.add('rec'); r.start(); LV.haptic(10);
    } catch (e) { _stopMic(); }
  });
}
function _stopMic(fromEnd) {
  var btn = document.getElementById('dlg-mic'); if (btn) btn.classList.remove('rec');
  if (_mic.rec && !fromEnd) { try { _mic.rec.stop(); } catch (e) {} }
  _mic.on = false; if (!fromEnd) _mic.rec = null;
}

// ================================================================
// FERMETURE
// ================================================================
function _updateXPBar() {
  var f = document.querySelector('#dlg-xp-bar .dlg-xp-fill'); if (!f) return;
  f.style.width = (((window.S && S.xp) || 0) % 100) + '%';
}

function _closeDlg(fromNav, silent) {
  var ov = document.getElementById('dlg-overlay');
  var wasOpen = _dlgState.isOpen;
  _stopMic();
  _dlgState.isOpen = false; _dlgState.busy = false;
  if (ov) {
    ov.classList.add('closing');
    setTimeout(function () { if (ov.parentNode) ov.remove(); }, 200);
  }
  if (!wasOpen) return;
  if (fromNav !== true && window.LV && LV.nav) LV.nav.popLayer('dialogue');   // retire l'entrée d'historique
  if (window.LV_VILLAGE && LV_VILLAGE.resume) LV_VILLAGE.resume('dialogue');
  window._villageDialogueMode = false;
  if (silent) return;
  if (_dlgState.xpEarned > 0) {
    if (typeof updateStreak === 'function') { try { updateStreak(); } catch (e) {} }
    if (typeof saveGameNow === 'function') saveGameNow();
    if (typeof showNotif === 'function') showNotif('💬 +' + _dlgState.xpEarned + ' XP');
  }
  if (window.LV) LV.emit('dialogue-close', { xp: _dlgState.xpEarned, locId: _dlgState.locId });
}

window.openDialogue = openDialogue;
window._closeDlg = _closeDlg;
window._sendFreeMsg = _sendFreeMsg;
window._switchToFreeMode = _switchToFreeMode;
window._addBubble = _addBubble;

console.log('✅ dialogue.js v3 — guidé + libre + voix');
