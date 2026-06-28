// dialogue.js — GUIDED + FREE EDITION v2
// LinguaVillage — Dialogues guidés pour débutants, IA libre pour avancés
// ================================================================

// ================================================================
// SEUIL XP : en dessous → dialogue guidé, au-dessus → IA libre
// ================================================================
var GUIDED_XP_THRESHOLD = 300; // élémentaire = dialogue libre

// ================================================================
// ÉTAT DU DIALOGUE
// ================================================================
var _dlgState = {
  locId:      null,
  npcId:      null,
  npc:        null,
  guided:     null,   // référence au GUIDED_DIALOGUE actif
  sceneIdx:   0,      // scène actuelle dans le guided
  history:    [],     // historique pour l'IA libre
  isOpen:     false,
  xpEarned:   0,
};

// ================================================================
// POINT D'ENTRÉE
// ================================================================
function openDialogue(locId, npcId) {
  var loc = LOCATIONS.find(function(l) { return l.id === locId; });
  if (!loc) { console.warn('Lieu introuvable:', locId); return; }
  var npc = (loc.npcs || []).find(function(n) { return n.id === npcId; });
  if (!npc) { console.warn('NPC introuvable:', npcId, 'dans', locId); return; }

  var xp      = (window.S && S.xp) || 0;
  var guided  = window.GUIDED_DIALOGUES && window.GUIDED_DIALOGUES[locId];
  var useGuided = guided && !guided.freeFromStart && xp < GUIDED_XP_THRESHOLD;

  _dlgState.locId    = locId;
  _dlgState.npcId    = npcId;
  _dlgState.npc      = npc;
  _dlgState.guided   = useGuided ? guided : null;
  _dlgState.sceneIdx = 0;
  _dlgState.history  = [];
  _dlgState.isOpen   = true;
  _dlgState.xpEarned = 0;

  // Mémoire : nouvelle session de conversation (no-op silencieux si LV_MEMORY absent)
  if (window.LV_MEMORY && typeof window.LV_MEMORY.newSession === 'function') {
    try { window.LV_MEMORY.newSession(); } catch(e) {}
  }
  if (window.LV_SPRITES && typeof window.LV_SPRITES.setExpression === 'function') {
    try { window.LV_SPRITES.setExpression('neutral', 0); } catch(e) {}
  }

  _buildDialogueUI(npc, locId, useGuided ? guided : null);

  if (useGuided) {
    // [CORRIGÉ] Si guided_v2.js est chargé, il va de toute façon effacer
    // et reconstruire cette même scène 50ms plus tard (_hijackForGuided),
    // pour ajouter sa barre de progression PLI. Afficher puis effacer
    // produisait un clignotement, et laissait une fenêtre de quelques
    // centaines de ms où l'écran de dialogue restait vide (description du
    // lieu visible, aucun message ni bouton de choix) — c'est exactement
    // ce qui pouvait être observé si l'utilisateur regardait l'écran
    // pendant cette transition. window.LV_GUIDED_V2_ACTIVE est posé par
    // guided_v2.js dès que son patch sur openDialogue est en place (voir
    // ce fichier) ; s'il est absent (guided_v2.js non chargé ou pas
    // encore patché), on garde le comportement original ci-dessous.
    if (!window.LV_GUIDED_V2_ACTIVE) {
      _showGuidedScene(0);
    }
  }
}

// ================================================================
// CONSTRUCTION DE L'UI DIALOGUE
// ================================================================
function _buildDialogueUI(npc, locId, guided) {
  // Supprimer l'ancien overlay s'il existe
  var old = document.getElementById('dlg-overlay');
  if (old) old.remove();

  var nl = (window.S && S.nativeLang) || 'fr';
  var tl = (window.S && S.targetLang) || 'en';

  var overlay = document.createElement('div');
  overlay.id  = 'dlg-overlay';
  overlay.style.cssText = [
    'position:fixed;inset:0;z-index:1000;',
    'display:flex;flex-direction:column;',
    'background:rgba(4,6,14,0.96);',
    'backdrop-filter:blur(12px);',
    '-webkit-backdrop-filter:blur(12px);',
    'animation:dlgFadeIn 0.25s ease;'
  ].join('');

  // ── Header ──
  var npcRole = (npc.role && (npc.role[nl] || npc.role.fr)) || '';
  var themeLabel = guided && guided.theme ? (guided.theme[nl] || guided.theme.fr) : '';
  var modeLabel  = guided
    ? {fr:'Dialogue guidé 📖', en:'Guided Dialogue 📖', es:'Diálogo guiado 📖',
       ht:'Dyalòg gide 📖',   de:'Geführter Dialog 📖', ru:'Диалог под руководством 📖',
       zh:'引导对话 📖',       ja:'ガイド付き対話 📖'}[nl] || 'Guided Dialogue 📖'
    : {fr:'Dialogue libre 🤖', en:'Free Dialogue 🤖', es:'Diálogo libre 🤖',
       ht:'Dyalòg lib 🤖',     de:'Freier Dialog 🤖',  ru:'Свободный диалог 🤖',
       zh:'自由对话 🤖',        ja:'フリー対話 🤖'}[nl] || 'Free Dialogue 🤖';

  overlay.innerHTML = '\
    <style>\
      @keyframes dlgFadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}\
      @keyframes dlgBubble{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}\
      .dlg-choice-btn{display:block;width:100%;padding:13px 16px;margin:6px 0;\
        background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,215,0,0.18);\
        border-radius:14px;color:#e8e0d0;font-size:0.88rem;font-weight:600;\
        text-align:left;cursor:pointer;transition:all 0.18s;\
        -webkit-tap-highlight-color:transparent;}\
      .dlg-choice-btn:hover,.dlg-choice-btn:active{background:rgba(255,215,0,0.10);border-color:#ffd700;}\
      .dlg-choice-btn.correct{background:rgba(78,207,112,0.15);border-color:#4ecf70;color:#4ecf70;}\
      .dlg-choice-btn.wrong{background:rgba(255,80,80,0.12);border-color:#ff5050;color:#ff7070;}\
      .dlg-msg-npc{animation:dlgBubble 0.22s ease;}\
      #dlg-input{background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,215,0,0.18);\
        border-radius:24px;padding:12px 18px;color:#e8e0d0;font-size:0.92rem;\
        width:100%;outline:none;transition:border 0.18s;}\
      #dlg-input:focus{border-color:#ffd700;}\
      #dlg-send{background:#ffd700;border:none;border-radius:50%;width:44px;height:44px;\
        color:#000;font-size:1.2rem;cursor:pointer;flex-shrink:0;transition:transform 0.14s;}\
      #dlg-send:active{transform:scale(0.9);}\
    </style>\
    <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;\
      background:rgba(255,255,255,0.03);border-bottom:1px solid rgba(255,255,255,0.07);">\
      <button onclick="_closeDlg()" style="background:rgba(255,255,255,0.08);border:none;\
        border-radius:50%;width:36px;height:36px;color:#e8e0d0;font-size:1rem;cursor:pointer;">✕</button>\
      <div style="font-size:2rem;line-height:1">' + npc.emoji + '</div>\
      <div style="flex:1;min-width:0">\
        <div style="font-weight:800;font-size:0.95rem;color:#f0e8d0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + npc.name + '</div>\
        <div style="font-size:0.70rem;color:rgba(255,255,255,0.38)">' + npcRole + (themeLabel ? ' · ' + themeLabel : '') + '</div>\
      </div>\
      <div style="font-size:0.62rem;font-weight:700;padding:4px 8px;\
        background:' + (guided ? 'rgba(78,207,112,0.15)' : 'rgba(74,158,255,0.15)') + ';\
        border-radius:8px;color:' + (guided ? '#4ecf70' : '#4a9eff') + ';white-space:nowrap">' + modeLabel + '</div>\
    </div>\
    <div id="dlg-messages" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;"></div>\
    <div id="dlg-choices" style="padding:0 16px 8px;"></div>\
    <div id="dlg-free-input" style="display:none;padding:10px 16px 16px;\
      padding-bottom:max(16px,env(safe-area-inset-bottom));">\
      <div style="display:flex;gap:10px;align-items:center;">\
        <input id="dlg-input" type="text" placeholder="Écrire en ' + (LANG_NAMES[tl]||tl) + '..." />\
        <button id="dlg-send" onclick="_sendFreeMsg()">➤</button>\
      </div>\
    </div>\
    <div id="dlg-xp-bar" style="height:3px;background:rgba(255,215,0,0.08);"></div>';

  document.body.appendChild(overlay);

  // Enter pour envoyer
  var inp = document.getElementById('dlg-input');
  if (inp) inp.addEventListener('keydown', function(e){ if(e.key==='Enter') _sendFreeMsg(); });

  // Si dialogue libre dès le début
  if (!guided) _switchToFreeMode();
}

// ================================================================
// DIALOGUE GUIDÉ — afficher une scène
// ================================================================
function _showGuidedScene(idx) {
  var guided = _dlgState.guided;
  if (!guided || !guided.scenes) return;
  if (idx >= guided.scenes.length) {
    // Fin du dialogue guidé → basculer en mode libre
    _guidedComplete();
    return;
  }

  var scene = guided.scenes[idx];
  var nl    = (window.S && S.nativeLang) || 'fr';
  var tl    = (window.S && S.targetLang) || 'en';

  // Message NPC dans la langue CIBLE (avec traduction en dessous en langue native)
  var npcMsg_tl = scene.npc[tl] || scene.npc.en || '';
  var npcMsg_nl = scene.npc[nl] || scene.npc.fr || '';

  _addBubble('npc', npcMsg_tl, npcMsg_nl !== npcMsg_tl ? npcMsg_nl : null);

  // Afficher les choix
  var choicesEl = document.getElementById('dlg-choices');
  if (!choicesEl) return;
  choicesEl.innerHTML = '';

  // Indicateur de scène
  var total = guided.scenes.length;
  var prog  = document.createElement('div');
  prog.style.cssText = 'text-align:center;font-size:0.65rem;color:rgba(255,255,255,0.25);margin-bottom:6px;';
  prog.textContent   = (idx+1) + ' / ' + total;
  choicesEl.appendChild(prog);

  scene.choices.forEach(function(ch, ci) {
    var btn = document.createElement('button');
    btn.className = 'dlg-choice-btn';
    var label = ch.label[tl] || ch.label.en || '';
    btn.textContent = label;
    btn.onclick = function() { _onChoiceClick(ch, btn, scene, idx); };
    choicesEl.appendChild(btn);
  });
}

// ================================================================
// CHOIX CLIQUÉ
// ================================================================
function _onChoiceClick(choice, btn, scene, sceneIdx) {
  // Désactiver tous les boutons
  var all = document.querySelectorAll('.dlg-choice-btn');
  all.forEach(function(b){ b.disabled=true; b.style.opacity='0.5'; });
  btn.style.opacity = '1';

  var nl = (window.S && S.nativeLang) || 'fr';
  var tl = (window.S && S.targetLang) || 'en';

  if (choice.correct) {
    btn.classList.add('correct');
    // XP
    var xpGain = choice.xp || 10;
    _dlgState.xpEarned += xpGain;
    if (window.S) S.xp = (S.xp || 0) + xpGain;
    if (typeof saveGame === 'function') try { saveGame(); } catch(e){}
    _updateXPBar();
    _updateHUDXP();

    // Feedback correct
    var fb_tl = scene.feedback.correct[tl] || scene.feedback.correct.en || '';
    var fb_nl = scene.feedback.correct[nl] || scene.feedback.correct.fr || '';
    setTimeout(function(){
      _addBubble('npc', fb_tl, fb_nl !== fb_tl ? fb_nl : null, '#4ecf70');
      // Passer à la scène suivante
      setTimeout(function(){
        _dlgState.sceneIdx = sceneIdx + 1;
        _showGuidedScene(_dlgState.sceneIdx);
      }, 1600);
    }, 400);
  } else {
    btn.classList.add('wrong');
    var fb_tl = scene.feedback.wrong[tl] || scene.feedback.wrong.en || '';
    var fb_nl = scene.feedback.wrong[nl] || scene.feedback.wrong.fr || '';
    setTimeout(function(){
      _addBubble('npc', fb_tl, fb_nl !== fb_tl ? fb_nl : null, '#ff7070');
      // XP partiel
      var xpGain = choice.xp || 0;
      if (xpGain > 0) {
        _dlgState.xpEarned += xpGain;
        if (window.S) S.xp = (S.xp || 0) + xpGain;
        if (typeof saveGame === 'function') try { saveGame(); } catch(e){}
        _updateHUDXP();
      }
      // Réactiver les bons boutons pour réessayer
      setTimeout(function(){
        all.forEach(function(b){
          if (!b.classList.contains('wrong')) {
            b.disabled=false; b.style.opacity='1';
          }
        });
      }, 1200);
    }, 400);
  }
}

// ================================================================
// FIN DU DIALOGUE GUIDÉ
// ================================================================
function _guidedComplete() {
  var nl = (window.S && S.nativeLang) || 'fr';
  var tl = (window.S && S.targetLang) || 'en';

  var completeMsgs = {
    fr:'🎉 Bravo ! Tu as terminé ce dialogue guidé ! Tu as gagné ' + _dlgState.xpEarned + ' XP.\nTu peux maintenant parler librement avec moi !',
    en:'🎉 Well done! You finished this guided dialogue! You earned ' + _dlgState.xpEarned + ' XP.\nYou can now speak freely with me!',
    es:'🎉 ¡Bravo! ¡Terminaste este diálogo guiado! Ganaste ' + _dlgState.xpEarned + ' XP.\n¡Ahora puedes hablar libremente conmigo!',
    ht:'🎉 Bravo! Ou fin dyalòg gide sa a! Ou te rantre ' + _dlgState.xpEarned + ' XP.\nKounye a ou ka pale lib avèk mwen!',
    de:'🎉 Bravo! Du hast diesen geführten Dialog abgeschlossen! Du hast ' + _dlgState.xpEarned + ' XP verdient.\nJetzt kannst du frei mit mir sprechen!',
    ru:'🎉 Браво! Ты завершил этот диалог! Ты заработал ' + _dlgState.xpEarned + ' XP.\nТеперь ты можешь свободно разговаривать со мной!',
    zh:'🎉 太棒了！您完成了引导对话！获得 ' + _dlgState.xpEarned + ' XP。\n现在您可以自由地与我交谈了！',
    ja:'🎉 ブラボー！ガイド付き対話を完了しました！' + _dlgState.xpEarned + ' XP獲得。\n今は自由に話しかけてください！'
  };

  var msg_tl = completeMsgs[tl] || completeMsgs.en;
  var msg_nl = completeMsgs[nl] || completeMsgs.fr;

  var choicesEl = document.getElementById('dlg-choices');
  if (choicesEl) choicesEl.innerHTML = '';

  _addBubble('npc', msg_tl, msg_nl !== msg_tl ? msg_nl : null, '#ffd700');

  // Notification XP
  if (typeof showNotif === 'function') {
    showNotif('🎉 +' + _dlgState.xpEarned + ' XP !');
  }

  // Passer en mode libre après 1.5s
  setTimeout(function(){
    _dlgState.guided = null;
    _switchToFreeMode();
  }, 1800);
}

// ================================================================
// MODE LIBRE (IA)
// ================================================================
function _switchToFreeMode() {
  var choicesEl = document.getElementById('dlg-choices');
  if (choicesEl) choicesEl.style.display = 'none';
  var freeEl = document.getElementById('dlg-free-input');
  if (freeEl) freeEl.style.display = 'block';

  // Message d'accueil IA si pas de guided
  if (!_dlgState.guided && _dlgState.history.length === 0) {
    var nl  = (window.S && S.nativeLang) || 'fr';
    var tl  = (window.S && S.targetLang) || 'en';
    var npc = _dlgState.npc;
    var loc = _dlgState.locId;

    var greetings = {
      fr:'Bonjour ! Je suis ' + (npc ? npc.name : 'ici') + '. Parlons en ' + (LANG_NAMES[tl]||tl) + ' !',
      en:'Hello! I am ' + (npc ? npc.name : 'here') + '. Let\'s chat in ' + (LANG_NAMES[tl]||tl) + '!',
      es:'¡Hola! Soy ' + (npc ? npc.name : 'aquí') + '. ¡Hablemos en ' + (LANG_NAMES[tl]||tl) + '!',
      ht:'Bonjou! Mwen se ' + (npc ? npc.name : 'isit') + '. Ann pale an ' + (LANG_NAMES[tl]||tl) + '!',
      de:'Hallo! Ich bin ' + (npc ? npc.name : 'hier') + '. Lass uns auf ' + (LANG_NAMES[tl]||tl) + ' reden!',
      ru:'Привет! Я ' + (npc ? npc.name : 'здесь') + '. Поговорим на ' + (LANG_NAMES[tl]||tl) + '!',
      zh:'你好！我是' + (npc ? npc.name : '这里') + '。让我们说' + (LANG_NAMES[tl]||tl) + '！',
      ja:'こんにちは！私は' + (npc ? npc.name : 'ここ') + 'です。' + (LANG_NAMES[tl]||tl) + 'で話しましょう！'
    };
    _addBubble('npc', greetings[tl]||greetings.en, greetings[nl]!==greetings[tl]?greetings[nl]:null);
  }

  // Focus sur l'input
  setTimeout(function(){
    var inp = document.getElementById('dlg-input');
    if (inp) inp.focus();
  }, 300);
}

function _sendFreeMsg() {
  var inp = document.getElementById('dlg-input');
  if (!inp) return;
  var msg = inp.value.trim();
  if (!msg) return;
  inp.value = '';

  _addBubble('player', msg, null);

  // Indicateur de frappe
  var typingId = _addTypingIndicator();

  // Appel API
  _callNPCAPI(msg, function(reply, translation) {
    _removeTypingIndicator(typingId);
    _addBubble('npc', reply, translation);
    _updateXPBar();
    _updateHUDXP();
  }, function(err) {
    _removeTypingIndicator(typingId);
    var nl = (window.S && S.nativeLang) || 'fr';
    var errMsgs = {fr:'Désolé, je n\'ai pas pu répondre. Réessaie!',en:'Sorry, I couldn\'t respond. Try again!',es:'Lo siento, no pude responder. ¡Inténtalo de nuevo!',ht:'Padon, mwen pa kapab reponn. Eseye ankò!',de:'Entschuldigung, ich konnte nicht antworten. Versuche es erneut!',ru:'Извини, не смог ответить. Попробуй снова!',zh:'抱歉，我无法回复。请再试！',ja:'申し訳ありません、返答できませんでした。もう一度試してください！'};
    _addBubble('npc', errMsgs[nl]||errMsgs.fr, null, '#ff7070');
  });
}

// ================================================================
// PÉDAGOGIE PAR RÔLE DE PNJ
// Reprise de la table NPC_PEDAGOGY (anciennement dans pnj.js, qui n'était
// jamais exécuté en pratique — voir js/_archive/pnj.js). Indexée par
// npc.id (ex: 'merchant', 'teacher') plutôt que par le libellé traduit,
// pour fonctionner quelle que soit la langue native du joueur.
// ================================================================
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
  default:   { style:'simple et pédagogique', domain:'vocabulaire général', corrects:true,  introduces:'expressions de base' },
};

function _getNpcPedagogy(npcId) {
  return NPC_PEDAGOGY[npcId] || NPC_PEDAGOGY.default;
}

// ================================================================
// ANALYSE DE LA RÉPONSE IA — détecte succès / correction
// Reprise fidèle de analyzeResponse() (anciennement pnj.js).
// ================================================================
function _analyzeNpcReply(reply) {
  var lower = String(reply || '').toLowerCase();
  var correctionSignals = ['on dit', 'il faut dire', 'la forme correcte', 'vous devriez dire', 'devrait être', "c'est plutôt", 'mais on dit', 'koreksyon', 'correction', 'correcto', 'richtig ist'];
  var successSignals    = ['parfait', 'excellent', 'bravo', 'très bien', 'super', 'fantastique', 'félicitations', 'exselans', 'perfecto', 'genau richtig', 'sehr gut', 'perfectly', 'great job', 'well done'];
  return {
    hasCorrection: correctionSignals.some(function(s){ return lower.indexOf(s) !== -1; }),
    hasSuccess:    successSignals.some(function(s){ return lower.indexOf(s) !== -1; })
  };
}

// ================================================================
// CONTEXTE ENRICHI (mémoire + pièges pédagogiques)
// Construit une note additionnelle, envoyée au backend dans le champ
// systemContext, en plus des champs déjà utilisés par l'API existante.
// N'ALTÈRE PAS les champs déjà consommés par le backend ; ajoute des
// informations facultatives qu'il peut ignorer s'il ne les lit pas.
// ================================================================
function _buildEnrichedContext(npc, nl, tl) {
  var parts = [];

  var pedagogy = _getNpcPedagogy(npc ? npc.id : null);
  parts.push('Style du PNJ: ' + pedagogy.style + '. Domaine: ' + pedagogy.domain + '. Introduit: ' + pedagogy.introduces + '.');
  parts.push(pedagogy.corrects
    ? "Si l'apprenant fait une faute, corrige-le gentiment en incluant la forme correcte."
    : "Si l'apprenant fait une faute, reformule naturellement la phrase correcte sans le signaler explicitement.");

  // [AJOUTÉ] Personnalité/émotions/objectifs/relations du citoyen
  // (citizens.js), en complément du profil pédagogique ci-dessus.
  if (window.LV_CITIZENS && npc && typeof window.LV_CITIZENS.getCitizenContext === 'function') {
    try {
      var citizenCtx = window.LV_CITIZENS.getCitizenContext(npc.id);
      if (citizenCtx) parts.push(citizenCtx);
    } catch (e) {}
  }

  if (window.LV_MEMORY && typeof window.LV_MEMORY.getLVContext === 'function') {
    try { parts.push(window.LV_MEMORY.getLVContext()); } catch(e) {}
  }

  if (window.CURRICULUM && typeof window.CURRICULUM.buildPitfallPromptSnippet === 'function') {
    try {
      var snippet = window.CURRICULUM.buildPitfallPromptSnippet(tl, nl);
      if (snippet) parts.push(snippet);
    } catch(e) {}
  }

  return parts.join('\n');
}

// ================================================================
// APPEL API NPC
// ================================================================
async function _callNPCAPI(userMsg, onSuccess, onError) {
  var nl  = (window.S && S.nativeLang) || 'fr';
  var tl  = (window.S && S.targetLang) || 'en';
  var xp  = (window.S && S.xp) || 0;
  var npc = _dlgState.npc;
  var loc = _dlgState.locId;

  var guided = window.GUIDED_DIALOGUES && window.GUIDED_DIALOGUES[loc];
  var theme  = guided && guided.theme ? (guided.theme[nl] || guided.theme.fr) : '';

  // Construire l'historique pour le contexte
  var history = _dlgState.history.slice(-6).map(function(h){
    return {role: h.role === 'player' ? 'user' : 'assistant', content: h.text};
  });

  _dlgState.history.push({role:'player', text: userMsg});

  // Mémoire : incrémenter le compteur de messages (no-op silencieux si LV_MEMORY absent)
  if (window.LV_MEMORY && typeof window.LV_MEMORY.newMessage === 'function') {
    try { window.LV_MEMORY.newMessage(); } catch(e) {}
  }

  try {
    var result = await callAPIWithFallback('/dialogue', {
      userMessage:  userMsg,
      nativeLang:   nl,
      targetLang:   tl,
      npcName:      npc ? npc.name : 'NPC',
      npcRole:      npc && npc.role ? (npc.role[nl] || npc.role.fr) : '',
      location:     loc,
      theme:        theme,
      playerXP:     xp,
      scriptPref:   (window.S && S.scriptPref) || 'both',
      history:      history,
      // Champ additionnel : mémoire utilisateur + pièges pédagogiques +
      // profil du PNJ. Le backend peut l'ignorer s'il ne le consomme pas
      // encore — aucun champ existant n'est modifié.
      systemContext: _buildEnrichedContext(npc, nl, tl),
    });

    var reply       = result.reply       || result.message || '';
    var translation = result.translation || result.tr      || '';
    var xpGain      = result.xp          || 5;

    if (xpGain > 0) {
      if (window.S) S.xp = (S.xp || 0) + xpGain;
      _dlgState.xpEarned += xpGain;
      if (typeof saveGame === 'function') try { saveGame(); } catch(e){}
    }

    _dlgState.history.push({role:'npc', text: reply});

    // Réaction sprite + mémoire selon le contenu de la réponse
    var analysis = _analyzeNpcReply(reply);
    if (window.LV_SPRITES) {
      try {
        if (analysis.hasSuccess)         window.LV_SPRITES.reactToMission();
        else if (analysis.hasCorrection) window.LV_SPRITES.reactToCorrection(false);
        else                              window.LV_SPRITES.reactToCorrection(true);
      } catch(e) {}
    }
    if (window.LV_MEMORY) {
      var firstWord = (userMsg.split(' ').filter(function(w){ return w.length > 2; })[0]) || null;
      try {
        if (analysis.hasCorrection && firstWord) window.LV_MEMORY.markWeak(firstWord);
        if (analysis.hasSuccess && firstWord)    window.LV_MEMORY.markMastered(firstWord);
      } catch(e) {}
    }

    onSuccess(reply, translation !== reply ? translation : null);
  } catch(e) {
    console.error('API dialogue error:', e);
    onError(e);
  }
}

// ================================================================
// BULLES DE DIALOGUE
// ================================================================

// [AJOUTÉ] Gestionnaire délégué unique pour les boutons de lecture audio
// des bulles NPC. Posé une seule fois par conteneur #dlg-messages (qui
// est recréé à chaque ouverture de dialogue par _buildDialogueUI), grâce
// au marqueur _speakDelegationSet sur l'élément lui-même.
function _ensureSpeakDelegation(msgsEl) {
  if (!msgsEl || msgsEl._speakDelegationSet) return;
  msgsEl._speakDelegationSet = true;
  msgsEl.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.dlg-speak-btn') : null;
    if (!btn) return;
    var txt = btn.getAttribute('data-speak-text');
    if (txt && typeof window.speakW === 'function') {
      // data-speak-text est échappé en HTML (lecture via getAttribute
      // renvoie déjà le texte décodé, donc speakW reçoit le vrai texte).
      window.speakW(txt);
    }
  });
}

function _addBubble(role, text, subtitle, color) {
  var msgsEl = document.getElementById('dlg-messages');
  if (!msgsEl) return null;

  var isNpc    = role === 'npc';
  var isPlayer = role === 'player';
  var div      = document.createElement('div');
  div.className= isNpc ? 'dlg-msg-npc' : '';
  div.style.cssText = 'display:flex;flex-direction:column;align-items:' + (isPlayer?'flex-end':'flex-start') + ';max-width:88%;' + (isPlayer?'align-self:flex-end':'align-self:flex-start');

  var bubble = document.createElement('div');
  bubble.style.cssText = [
    'padding:12px 16px;border-radius:' + (isPlayer?'18px 18px 4px 18px':'18px 18px 18px 4px') + ';',
    'font-size:0.92rem;line-height:1.5;word-break:break-word;',
    isPlayer
      ? 'background:rgba(74,158,255,0.18);border:1.5px solid rgba(74,158,255,0.25);color:#d8eeff;'
      : 'background:rgba(255,255,255,0.07);border:1.5px solid rgba(255,255,255,0.10);color:#f0e8d0;',
    color ? 'border-color:' + color + '33;' : ''
  ].join('');

  // [AJOUTÉ] Bouton de lecture audio sur les bulles de PNJ uniquement
  // (pas sur les messages du joueur — lire ses propres mots n'a pas de
  // sens). Réutilise speakW() (learning.js), déjà fonctionnelle pour les
  // 8 langues du jeu (fr/en/es/ht/de/ru/zh/ja) via la table de codes
  // BCP-47 qu'elle contient déjà — aucune duplication de logique audio.
  // Échappement de secours local si window.escapeHtml (app_v2.js, chargé
  // en defer) n'est pas encore prêt — ne jamais retomber sur du texte
  // brut non échappé puisqu'il peut venir de l'IA.
  var _escFn = window.escapeHtml || function (t) {
    return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  };
  var safeText = _escFn(text);
  if (isNpc) {
    // [SÉCURITÉ] Le texte est passé via data-speak-text (échappé HTML
    // uniquement) plutôt que dans un attribut onclick. Un onclick inline
    // aurait demandé un DEUXIÈME niveau d'échappement (HTML d'attribut +
    // JavaScript), et un texte IA contenant un guillemet double aurait pu
    // casser l'attribut et permettre une injection. Un data-attribute lu
    // par un gestionnaire délégué (voir _ensureSpeakDelegation ci-dessous)
    // évite ce risque : un seul niveau d'échappement HTML suffit.
    bubble.innerHTML =
      '<span class="dlg-bubble-text">' + safeText + '</span>' +
      '<button type="button" class="dlg-speak-btn" data-speak-text="' + safeText + '" ' +
      'style="margin-left:8px;background:none;border:none;cursor:pointer;font-size:0.95em;opacity:0.7;vertical-align:middle;padding:2px 4px;" ' +
      'aria-label="Écouter">🔊</button>';
    _ensureSpeakDelegation(msgsEl);
  } else {
    bubble.textContent = text;
  }
  div.appendChild(bubble);

  if (subtitle) {
    var sub = document.createElement('div');
    sub.style.cssText = 'font-size:0.70rem;color:rgba(255,255,255,0.30);margin-top:4px;padding:0 4px;font-style:italic;';
    sub.textContent   = subtitle;
    div.appendChild(sub);
  }

  msgsEl.appendChild(div);
  msgsEl.scrollTop = msgsEl.scrollHeight;
  return div.id;
}

function _addTypingIndicator() {
  var msgsEl = document.getElementById('dlg-messages');
  if (!msgsEl) return null;
  var id  = 'typing-' + Date.now();
  var div = document.createElement('div');
  div.id  = id;
  div.style.cssText = 'align-self:flex-start;padding:12px 16px;background:rgba(255,255,255,0.07);border:1.5px solid rgba(255,255,255,0.10);border-radius:18px 18px 18px 4px;';
  div.innerHTML = '<span style="display:inline-flex;gap:4px">'
    + '<span style="width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,0.4);animation:dlgDot 1s infinite 0s"></span>'
    + '<span style="width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,0.4);animation:dlgDot 1s infinite 0.2s"></span>'
    + '<span style="width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,0.4);animation:dlgDot 1s infinite 0.4s"></span>'
    + '</span>';
  // CSS animation points
  if (!document.getElementById('dlg-dot-css')) {
    var st = document.createElement('style');
    st.id  = 'dlg-dot-css';
    st.textContent = '@keyframes dlgDot{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}';
    document.head.appendChild(st);
  }
  msgsEl.appendChild(div);
  msgsEl.scrollTop = msgsEl.scrollHeight;
  return id;
}

function _removeTypingIndicator(id) {
  if (!id) return;
  var el = document.getElementById(id);
  if (el) el.remove();
}

// ================================================================
// UTILITAIRES
// ================================================================
function _updateXPBar() {
  var bar = document.getElementById('dlg-xp-bar');
  if (!bar) return;
  var xp      = (window.S && S.xp) || 0;
  var maxXP   = 2000;
  var pct     = Math.min(100, (xp / maxXP) * 100);
  var inner   = bar.querySelector('.dlg-xp-fill');
  if (!inner) {
    inner = document.createElement('div');
    inner.className = 'dlg-xp-fill';
    inner.style.cssText = 'height:100%;background:linear-gradient(90deg,#4ecf70,#ffd700);transition:width 0.5s ease;border-radius:2px;';
    bar.appendChild(inner);
  }
  inner.style.width = pct + '%';
}

function _updateHUDXP() {
  var el = document.getElementById('hudXP');
  if (el && window.S) el.textContent = (S.xp || 0) + ' XP';
  var el2 = document.getElementById('menuXP');
  if (el2 && window.S) el2.textContent = (S.xp || 0) + ' XP';
}

function _closeDlg() {
  var overlay = document.getElementById('dlg-overlay');
  if (overlay) {
    overlay.style.animation = 'dlgFadeOut 0.20s ease forwards';
    if (!document.getElementById('dlg-fadeout-css')) {
      var st = document.createElement('style');
      st.id  = 'dlg-fadeout-css';
      st.textContent = '@keyframes dlgFadeOut{to{opacity:0;transform:translateY(16px)}}';
      document.head.appendChild(st);
    }
    setTimeout(function(){ if(overlay.parentNode) overlay.remove(); }, 220);
  }
  _dlgState.isOpen = false;
  // Si XP gagné → mettre à jour streak + sauvegarder
  if (_dlgState.xpEarned > 0) {
    if (typeof updateStreak === 'function') try { updateStreak(); } catch(e){}
    if (typeof saveGame    === 'function') try { saveGame();      } catch(e){}
    if (typeof showNotif   === 'function') showNotif('💬 +' + _dlgState.xpEarned + ' XP gagnés !');
  }
}

// Exposer globalement
window.openDialogue = openDialogue;
window._closeDlg    = _closeDlg;

console.log('✅ dialogue.js v2 — Guidé + Libre chargé');
