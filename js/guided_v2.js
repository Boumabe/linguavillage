// LinguaVillage — guided_v2.js (FIXED)
// Fonctionne DANS l'overlay de dialogue.js
//
// CORRECTION CRITIQUE v2.1 :
//   - Utilise #dlg-messages, #dlg-choices, #dlg-free-input de dialogue.js
//   - Après guided → appelle _switchToFreeMode() de dialogue.js
//   - Plus de conflit avec les éléments statiques #dialInput / #dialSend
//   - Starter chips injectés dans la zone dlg-free-input
// ================================================================

window.GUIDED_XP_THRESHOLD = 300;

// ================================================================
// PATCH openDialogue — APRÈS le chargement de dialogue.js
// ================================================================
(function() {
  function _patch() {
    var orig = window.openDialogue;
    if (!orig || orig._v2_patched) return;

    // [CORRIGÉ] Marqueur posé dès que ce patch est en place, pour que
    // dialogue.js sache qu'il ne doit plus construire sa propre scène 0
    // (voir openDialogue dans dialogue.js) — évite le clignotement
    // afficher-puis-effacer et la fenêtre d'écran vide qui en résultait.
    window.LV_GUIDED_V2_ACTIVE = true;

    window.openDialogue = function(locId, npcId) {
      var xp      = (window.S && S.xp) || 0;
      var guided  = window.GUIDED_DIALOGUES && window.GUIDED_DIALOGUES[locId];
      var useGuided = guided && !guided.freeFromStart && xp < window.GUIDED_XP_THRESHOLD;

      if (useGuided) {
        orig(locId, npcId);
        // [CORRIGÉ] Plus de setTimeout(...,50) : comme dialogue.js ne
        // construit plus la scène 0 lui-même quand ce module est actif,
        // il n'y a plus rien à effacer — _hijackForGuided peut construire
        // directement la scène, sans délai ni clignotement intermédiaire.
        _hijackForGuided(locId, npcId, guided);
      } else {
        orig(locId, npcId);
      }
    };
    window.openDialogue._v2_patched = true;
    console.log('✅ guided_v2.js patché openDialogue (mode overlay)');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(_patch, 350); });
  } else {
    setTimeout(_patch, 350);
  }
})();

// ================================================================
// ÉTAT GLOBAL DU GUIDED
// ================================================================
var _gs = null;

// ================================================================
// HIJACK DE L'OVERLAY dialogue.js
// ================================================================
function _hijackForGuided(locId, npcId, guided) {
  var overlay = document.getElementById('dlg-overlay');
  if (!overlay) { console.warn('guided_v2: dlg-overlay introuvable'); return; }

  var loc = typeof LOCATIONS !== 'undefined'
    ? LOCATIONS.find(function(l) { return l.id === locId; })
    : null;
  if (!loc) return;
  var npc = (loc.npcs || []).find(function(n) { return n.id === npcId; });
  if (!npc) return;

  var nl = (window.S && S.nativeLang) || 'fr';
  var tl = (window.S && S.targetLang) || 'en';

  _gs = { locId:locId, npcId:npcId, npc:npc, guided:guided, tl:tl, nl:nl, sceneIdx:0, xpEarned:0, errors:0 };

  if (window.S) {
    S.currentNPC = npc; S.currentLoc = loc; S.chatHistory = [];
    if (!S.weakPoints) S.weakPoints = {};
  }

  // Vider les messages (dialogue.js a peut-être déjà mis un message d'accueil)
  var msgsEl = document.getElementById('dlg-messages');
  if (msgsEl) msgsEl.innerHTML = '';

  // Cacher l'input libre
  var freeInput = document.getElementById('dlg-free-input');
  if (freeInput) freeInput.style.display = 'none';

  // Injecter badge "Guidé" dans le header de l'overlay
  var modeLabel = overlay.querySelector('[style*="0.62rem"][style*="font-weight:700"], [style*="0.62rem"][style*="font-weight: 700"]');
  if (modeLabel) {
    var labels = {fr:'Dialogue guidé 📖',en:'Guided Dialogue 📖',es:'Diálogo guiado 📖',ht:'Dyalòg gide 📖',de:'Geführter Dialog 📖',ru:'Диалог под руководством 📖',zh:'引导对话 📖',ja:'ガイド付き対話 📖'};
    modeLabel.textContent = labels[nl] || 'Guided Dialogue 📖';
    modeLabel.style.background = 'rgba(78,207,112,0.15)';
    modeLabel.style.color      = '#4ecf70';
  }

  // Injecter PLI bar
  _injectPLIBar(overlay, tl);

  // Injecter styles
  _injectGuidedStyles();

  // [CORRIGÉ] Plus de setTimeout(...,200) : ce délai ne servait à rien
  // techniquement (le DOM est déjà prêt, _buildDialogueUI ayant construit
  // l'overlay de façon synchrone) et créait une fenêtre visible où
  // l'utilisateur voyait la barre PLI sans aucun message ni bouton de
  // choix — exactement l'écran vide observé.
  _runScene(0);
}

function _injectPLIBar(overlay, tl) {
  if (document.getElementById('guided-pli')) return;
  var ratio = (typeof PLI !== 'undefined') ? PLI.ratio() : 0.45;
  var pct   = Math.round(ratio * 100);
  var bar   = document.createElement('div');
  bar.id    = 'guided-pli';
  bar.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 16px;background:rgba(6,8,14,0.6);border-bottom:1px solid rgba(255,255,255,0.06);font-size:0.62rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.2);flex-shrink:0;';
  bar.innerHTML = 'immersion<div style="flex:1;height:2px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden;"><div style="width:'+pct+'%;height:100%;background:linear-gradient(90deg,#4a9eff,#4ecf70);border-radius:2px;"></div></div><span style="color:#4ecf70;font-weight:700;">'+pct+'% '+((window.LANG_NAMES&&LANG_NAMES[tl])||tl)+'</span>';
  var first = overlay.firstElementChild;
  if (first && first.nextSibling) { overlay.insertBefore(bar, first.nextSibling); }
  else { overlay.appendChild(bar); }
}

function _injectGuidedStyles() {
  if (document.getElementById('guided-css-v2')) return;
  var st = document.createElement('style');
  st.id  = 'guided-css-v2';
  st.textContent = '.g-choice{display:block;width:100%;padding:13px 16px;margin:6px 0;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,215,0,0.14);border-radius:14px;color:#e8e0d0;font-size:0.87rem;font-weight:600;text-align:left;cursor:pointer;transition:all 0.18s;-webkit-tap-highlight-color:transparent;}.g-choice:hover:not(:disabled){background:rgba(255,215,0,0.08);border-color:#ffd700;transform:translateX(3px);}.g-choice.correct{background:rgba(78,207,112,0.15);border-color:#4ecf70;color:#4ecf70;}.g-choice.wrong{background:rgba(255,80,80,0.12);border-color:#ff5050;color:#ff7070;}.g-choice:disabled{pointer-events:none;}.g-prog{display:flex;align-items:center;gap:8px;margin-bottom:8px;}.g-prog-track{flex:1;height:2px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden;}.g-prog-fill{height:100%;background:linear-gradient(90deg,#4ecf70,#4a9eff);border-radius:2px;transition:width 0.5s ease;}.g-prog-num{font-size:0.6rem;font-weight:800;color:rgba(255,255,255,0.2);white-space:nowrap;}.g-fill-wrap{display:flex;gap:8px;padding:4px 0;}.g-fill-inp{flex:1;background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,215,0,0.18);border-radius:12px;padding:12px 16px;color:#e8e0d0;font-size:0.95rem;font-weight:600;outline:none;transition:border 0.18s;}.g-fill-inp:focus{border-color:#ffd700;}.g-fill-btn{background:#ffd700;border:none;border-radius:12px;padding:12px 18px;font-weight:800;font-size:0.9rem;color:#09090e;cursor:pointer;transition:all 0.18s;}.g-fill-btn:hover{transform:scale(1.04);filter:brightness(1.1);}.g-starter-row{display:flex;gap:7px;padding:8px 16px 4px;overflow-x:auto;scrollbar-width:none;}.g-starter-row::-webkit-scrollbar{display:none;}.g-starter-chip{flex-shrink:0;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:999px;padding:6px 14px;font-size:0.72rem;font-weight:600;color:#9B8E77;cursor:pointer;white-space:nowrap;transition:all 0.16s;}.g-starter-chip:hover{background:rgba(74,158,255,0.12);border-color:rgba(74,158,255,0.35);color:#4a9eff;transform:translateY(-1px);}';
  document.head.appendChild(st);
}

// ================================================================
// AFFICHER UNE SCÈNE
// ================================================================
function _runScene(idx) {
  if (!_gs) return;
  var scenes = _gs.guided.scenes;
  if (!scenes || !scenes.length || idx >= scenes.length) { _guidedComplete(); return; }

  var scene = scenes[idx];
  var tl = _gs.tl, nl = _gs.nl, npc = _gs.npc;

  var npcMsg = scene.npc[tl] || scene.npc.en || '';
  var npcSub = (tl !== nl) ? _getSub(scene.npc, nl, npcMsg) : '';
  _dlgAddBubble('npc', npcMsg, npcSub);

  var choicesEl = document.getElementById('dlg-choices');
  if (choicesEl) { choicesEl.innerHTML = ''; choicesEl.style.display = 'block'; }

  var pct  = Math.round((idx / scenes.length) * 100);
  var prog = document.createElement('div');
  prog.className = 'g-prog';
  prog.innerHTML = '<div class="g-prog-track"><div class="g-prog-fill" style="width:'+pct+'%"></div></div><span class="g-prog-num">'+(idx+1)+'/'+scenes.length+'</span>';
  if (choicesEl) choicesEl.appendChild(prog);

  var scaffold = scene.scaffold || 'choices';
  if (scaffold === 'fill') { _renderFill(choicesEl, scene, idx); }
  else                     { _renderChoices(choicesEl, scene, idx); }
}

function _renderChoices(wrap, scene, sceneIdx) {
  if (!wrap) return;
  scene.choices.forEach(function(ch) {
    var btn = document.createElement('button');
    btn.className   = 'g-choice';
    btn.textContent = ch.label[_gs.tl] || ch.label.en || '';
    btn.addEventListener('click', function() { _onChoice(ch, btn, scene, sceneIdx, wrap); });
    wrap.appendChild(btn);
  });
}

function _renderFill(wrap, scene, sceneIdx) {
  if (!wrap) return;
  var tl     = _gs.tl;
  var prompt = scene.fillPrompt && (scene.fillPrompt[tl] || scene.fillPrompt.en);
  if (!prompt) { _renderChoices(wrap, scene, sceneIdx); return; }

  var promptEl = document.createElement('div');
  promptEl.style.cssText = 'font-size:0.95rem;font-weight:600;color:#e8e0d0;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,215,0,0.14);border-radius:12px;padding:12px 16px;line-height:1.6;margin-bottom:8px;';
  promptEl.innerHTML = _gEsc(prompt).replace('[___]','<span style="display:inline-block;min-width:60px;border-bottom:2px solid #ffd700;color:#ffd700;font-weight:800;padding:0 4px;">___</span>');
  wrap.appendChild(promptEl);

  var fw = document.createElement('div'); fw.className = 'g-fill-wrap';
  var inp = document.createElement('input'); inp.type = 'text'; inp.className = 'g-fill-inp'; inp.placeholder = '...';
  var cb  = document.createElement('button'); cb.className = 'g-fill-btn'; cb.textContent = '✓';
  var chk = function() { var v=inp.value.trim(); if(!v) return; var correct=scene.fillAnswer; _onFillResult(correct?v.toLowerCase()===correct.toLowerCase():true, v, correct, scene, sceneIdx, wrap, inp, cb); };
  cb.addEventListener('click', chk); inp.addEventListener('keydown', function(e){if(e.key==='Enter')chk();});
  fw.appendChild(inp); fw.appendChild(cb); wrap.appendChild(fw);
  setTimeout(function(){inp.focus();}, 200);
}

function _onFillResult(isOk, val, correct, scene, sceneIdx, wrap, inp, cb) {
  inp.disabled=true; cb.disabled=true;
  if (isOk) {
    inp.style.borderColor='#4ecf70'; inp.style.color='#4ecf70'; cb.style.background='#4ecf70';
    var xp=scene.xp||18; _gs.xpEarned+=xp; if(typeof gainXP==='function') gainXP(xp);
    var fb=scene.feedback&&(scene.feedback.correct[_gs.tl]||scene.feedback.correct.en);
    setTimeout(function(){ if(fb)_dlgAddBubble('npc',fb,null,'#4ecf70'); setTimeout(function(){_gs.sceneIdx=sceneIdx+1;_runScene(_gs.sceneIdx);},1600);},400);
  } else {
    inp.style.borderColor='#ff5050'; inp.style.color='#ff7070';
    if(window.S&&correct){S.weakPoints=S.weakPoints||{};S.weakPoints[correct]=(S.weakPoints[correct]||0)+1;}
    var fb2=scene.feedback&&(scene.feedback.wrong[_gs.tl]||scene.feedback.wrong.en);
    setTimeout(function(){
      _dlgAddBubble('npc',(fb2||'')+(correct?'\n✨ '+correct:''),null,'#ff9f43');
      setTimeout(function(){inp.disabled=false;cb.disabled=false;inp.value='';inp.style.borderColor='';inp.style.color='';inp.focus();},1800);
    },300);
  }
}

function _onChoice(choice, btn, scene, sceneIdx, wrap) {
  wrap.querySelectorAll('.g-choice').forEach(function(b){b.disabled=true;b.style.opacity='0.45';});
  btn.style.opacity='1';
  if (choice.correct) {
    btn.classList.add('correct');
    var xp=choice.xp||15; _gs.xpEarned+=xp; if(typeof gainXP==='function') gainXP(xp);
    var fb=_getFb(scene.feedback.correct,_gs.tl); var fbSub=(_gs.tl!==_gs.nl)?_getSub(scene.feedback.correct,_gs.nl,fb):'';
    if(window.LV_SPRITES) window.LV_SPRITES.setExpression('happy',1500);
    setTimeout(function(){ _dlgAddBubble('npc',fb,fbSub,'#4ecf70'); setTimeout(function(){_gs.sceneIdx=sceneIdx+1;_runScene(_gs.sceneIdx);},1700);},350);
  } else {
    btn.classList.add('wrong'); _gs.errors++;
    if(window.S){S.weakPoints=S.weakPoints||{};var k=scene.npc[_gs.tl]||'u';S.weakPoints[k]=(S.weakPoints[k]||0)+1;}
    if(choice.xp>0){_gs.xpEarned+=choice.xp;if(typeof gainXP==='function') gainXP(choice.xp);}
    var fb2=_getFb(scene.feedback.wrong,_gs.tl); var fbSub2=(_gs.tl!==_gs.nl)?_getSub(scene.feedback.wrong,_gs.nl,fb2):'';
    if(window.LV_SPRITES) window.LV_SPRITES.setExpression('confused',1500);
    setTimeout(function(){ _dlgAddBubble('npc',fb2,fbSub2,'#ff9f43'); setTimeout(function(){ wrap.querySelectorAll('.g-choice').forEach(function(b){if(!b.classList.contains('wrong')){b.disabled=false;b.style.opacity='1';}});},1200);},350);
  }
}

// ================================================================
// FIN GUIDED → MODE LIBRE
// ================================================================
function _guidedComplete() {
  var total=_gs.xpEarned, tl=_gs.tl, nl=_gs.nl, npc=_gs.npc, locId=_gs.locId, errors=_gs.errors;
  var ok=errors===0;
  var msgs={
    fr:ok?'🏆 Parfait ! +'+total+' XP !\nParle-moi librement maintenant !':'🎉 Bravo ! +'+total+' XP !\nÉcris-moi pour continuer librement.',
    en:ok?'🏆 Perfect! +'+total+' XP!\nTalk to me freely now!':'🎉 Well done! +'+total+' XP!\nWrite to me to continue freely.',
    es:ok?'🏆 ¡Perfecto! +'+total+' XP!\n¡Habla conmigo libremente!':'🎉 ¡Bravo! +'+total+' XP!\nEscríbeme para continuar.',
    ht:ok?'🏆 Pafè! +'+total+' XP!\nPale avèm lib kounye a!':'🎉 Bravo! +'+total+' XP!\nEkri mwen pou kontinye lib.',
    de:ok?'🏆 Perfekt! +'+total+' XP!\nSprich jetzt frei mit mir!':'🎉 Gut! +'+total+' XP!\nSchreib mir weiter.',
    ru:ok?'🏆 Отлично! +'+total+' XP!\nТеперь говори свободно!':'🎉 Хорошо! +'+total+' XP!\nНапиши мне свободно.',
    zh:ok?'🏆 完美！+'+total+' XP！现在自由说话！':'🎉 很好！+'+total+' XP！继续写信给我。',
    ja:ok?'🏆 完璧！+'+total+' XP！自由に話して！':'🎉 よくできました！+'+total+' XP！自由に書いてください。'
  };
  var finalMsg=msgs[tl]||msgs.en;
  var finalSub=(tl!==nl&&msgs[nl]&&msgs[nl]!==finalMsg)?msgs[nl]:null;
  _dlgAddBubble('npc',finalMsg,finalSub,'#ffd700');
  if(typeof showNotif==='function') showNotif('🎉 +'+total+' XP !');
  if(typeof launchConfetti==='function') launchConfetti();

  setTimeout(function() {
    var gc=document.getElementById('dlg-choices'); if(gc){gc.innerHTML='';gc.style.display='none';}
    var pliBar=document.getElementById('guided-pli'); if(pliBar) pliBar.remove();

    // Restaurer _dlgState pour _sendFreeMsg() de dialogue.js
    if(window.S){ S.currentNPC=npc; var loc=(typeof LOCATIONS!=='undefined')?LOCATIONS.find(function(l){return l.id===locId;}):null; S.currentLoc=loc||{id:locId,npcs:[npc]}; S.chatHistory=[]; }
    if(window._dlgState){ window._dlgState.npc=npc; window._dlgState.locId=locId; window._dlgState.guided=null; window._dlgState.history=[]; window._dlgState.isOpen=true; }
    _gs=null;

    // Afficher l'input libre de dialogue.js
    var freeEl=document.getElementById('dlg-free-input');
    if(freeEl) freeEl.style.display='block';

    // Placeholder dans la langue cible
    var inp=document.getElementById('dlg-input');
    if(inp){
      var lname=(window.LANG_NAMES&&LANG_NAMES[tl])||tl;
      var phs={fr:'Écris en '+lname+'…',en:'Write in '+lname+'…',es:'Escribe en '+lname+'…',ht:'Ekri an '+lname+'…',de:'Schreib auf '+lname+'…',ru:'Пиши на '+lname+'…',zh:'用'+lname+'写…',ja:lname+'で書いて…'};
      inp.placeholder=phs[nl]||phs.fr; inp.disabled=false;
    }

    // CORRECTION CRITIQUE : binder #dlg-send sur _sendFreeMsg() de dialogue.js
    var sendBtn=document.getElementById('dlg-send');
    if(sendBtn){
      sendBtn.disabled=false;
      sendBtn.onclick=function(){ if(typeof _sendFreeMsg==='function') _sendFreeMsg(); };
    }

    // Aussi : Enter pour envoyer
    if(inp){
      inp.onkeydown=function(e){ if(e.key==='Enter'&&typeof _sendFreeMsg==='function') _sendFreeMsg(); };
    }

    // Starter chips
    _injectStarterChips(tl, nl, inp);

    setTimeout(function(){ if(inp) inp.focus(); }, 200);
  }, 1500);
}

// ── Starter chips ─────────────────────────────────────────────────
var _STARTERS = {
  fr:['Bonjour ! Comment ça va ?',"Pouvez-vous m'aider ?",'Je ne comprends pas…','Répétez, s\'il vous plaît.','Merci beaucoup !'],
  en:["Hello! How are you?","Can you help me?","I don't understand…","Please repeat that.","Thank you very much!"],
  es:["¡Hola! ¿Cómo estás?","¿Me puedes ayudar?","No entiendo…","Repita, por favor.","¡Muchas gracias!"],
  de:["Hallo! Wie geht's?","Können Sie mir helfen?","Ich verstehe nicht…","Bitte wiederholen.","Danke sehr!"],
  ru:["Привет! Как дела?","Можете помочь мне?","Я не понимаю…","Повторите, пожалуйста.","Большое спасибо!"],
  zh:["你好！你好吗？","你能帮我吗？","我不明白…","请再说一遍。","非常感谢！"],
  ja:["こんにちは！","手伝ってもらえますか？","わかりません…","もう一度言ってください。","ありがとうございます！"],
  ht:["Bonjou! Kijan ou ye?","Eske ou ka ede mwen?","Mwen pa konprann…","Repete, tanpri.","Mèsi anpil!"]
};

function _injectStarterChips(tl, nl, inp) {
  var freeEl=document.getElementById('dlg-free-input'); if(!freeEl) return;
  if(document.getElementById('g-starters')) return;
  var pool=(_STARTERS[tl]||_STARTERS.en).slice().sort(function(){return Math.random()-0.5;}).slice(0,3);
  var row=document.createElement('div'); row.id='g-starters'; row.className='g-starter-row';
  pool.forEach(function(text){
    var chip=document.createElement('button'); chip.className='g-starter-chip'; chip.textContent=text;
    chip.onclick=function(){ if(inp){inp.value=text;inp.focus();} chip.style.opacity='0'; chip.style.transform='scale(0.9)'; setTimeout(function(){chip.remove();},180); };
    row.appendChild(chip);
  });
  freeEl.insertBefore(row, freeEl.firstChild);
  if(inp){ inp.addEventListener('input',function(){ var r=document.getElementById('g-starters'); if(!r) return; if(this.value.length>0){r.style.opacity='0';setTimeout(function(){if(r)r.style.display='none';},200);}else{r.style.display='flex';r.style.opacity='1';} }); }
}

// ================================================================
// UTILITAIRES
// ================================================================
function _dlgAddBubble(role,text,subtitle,color) {
  if(typeof _addBubble==='function'){ _addBubble(role,text,subtitle,color); return; }
  var msgsEl=document.getElementById('dlg-messages'); if(!msgsEl) return;
  var isP=role==='player';
  var d=document.createElement('div'); d.style.cssText='display:flex;flex-direction:column;align-items:'+(isP?'flex-end':'flex-start')+';max-width:88%;'+(isP?'align-self:flex-end':'align-self:flex-start');
  var b=document.createElement('div'); b.style.cssText='padding:12px 16px;border-radius:'+(isP?'18px 18px 4px 18px':'18px 18px 18px 4px')+';font-size:0.9rem;line-height:1.5;'+(isP?'background:rgba(74,158,255,0.18);border:1.5px solid rgba(74,158,255,0.25);color:#d8eeff;':'background:rgba(255,255,255,0.07);border:1.5px solid rgba(255,255,255,0.10);color:#f0e8d0;')+(color?'border-color:'+color+'44;':'');
  b.innerHTML=_gEsc(text).replace(/\n/g,'<br>'); d.appendChild(b);
  if(subtitle){var s=document.createElement('div');s.style.cssText='font-size:0.7rem;color:rgba(255,255,255,0.28);margin-top:4px;padding:0 4px;font-style:italic;';s.textContent=subtitle;d.appendChild(s);}
  msgsEl.appendChild(d); msgsEl.scrollTop=msgsEl.scrollHeight;
}

function _getFb(obj,lang){ return obj[lang]||obj.en||''; }
function _getSub(obj,lang,main){ var c=obj[lang]||obj.fr||''; return(c&&c!==main)?c:''; }
function _gEsc(t){ return String(t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

console.log('✅ guided_v2.js chargé (mode overlay — bouton envoi corrigé)');
