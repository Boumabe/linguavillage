// LinguaVillage — dialogue.js
// Dialogues NPC, IA, correcteur, popup mots, voix

function openDialogue(locId, npcId) {
  const loc = LOCATIONS.find(l => l.id === locId);
  const npc = loc.npcs.find(n => n.id === npcId);
  if (!window.S) return;
  S.currentNPC = npc;
  S.currentLoc = loc;
  S.chatHistory = [];
  
  const role = typeof npc.role === 'object' ? (npc.role[S.nativeLang] || npc.role.en) : npc.role;
  const dialAv = document.getElementById('dialAv');
  const dialName = document.getElementById('dialName');
  const dialRole = document.getElementById('dialRole');
  const chatMsgs = document.getElementById('chatMsgs');
  const corrPanel = document.getElementById('corrPanel');
  const dialInput = document.getElementById('dialInput');
  
  if (dialAv) dialAv.textContent = npc.emoji;
  if (dialName) dialName.textContent = npc.name;
  if (dialRole) dialRole.textContent = role + ' — ' + (LOC_NAMES[loc.id] ? LOC_NAMES[loc.id][S.nativeLang] || loc.id : loc.id);
  if (chatMsgs) chatMsgs.innerHTML = '';
  if (corrPanel) corrPanel.className = 'correction-panel';
  if (dialInput) dialInput.value = '';
  
  showScreen('screen-dialogue');
  addSysMsg('💡 Touchez un mot pour le traduire');
  setTimeout(() => npcOpen(), 400);
}

function getScriptInstr() {
  if (!['zh', 'ja', 'ru'].includes(S.targetLang)) return '';
  if (S.scriptPref === 'roman') {
    if (S.targetLang === 'zh') return '\nÉcris UNIQUEMENT en pinyin, PAS de caractères chinois.';
    if (S.targetLang === 'ja') return '\nÉcris UNIQUEMENT en romaji, PAS de japonais.';
    if (S.targetLang === 'ru') return '\nÉcris UNIQUEMENT en translittération latine, PAS de cyrillique.';
  }
  if (S.scriptPref === 'both') {
    if (S.targetLang === 'zh') return '\nÉcris en chinois ET pinyin entre parenthèses. Ex: 你好 (Nǐ hǎo)';
    if (S.targetLang === 'ja') return '\nÉcris en japonais ET romaji entre parenthèses. Ex: こんにちは (Konnichiwa)';
    if (S.targetLang === 'ru') return '\nÉcris en cyrillique ET translittération entre parenthèses. Ex: Привет (Privyet)';
  }
  return '';
}

async function npcOpen() {
  const npc=S.currentNPC, loc=S.currentLoc;
  if(!npc||!loc)return;
  const si=getScriptInstr();
  const wctx={sun:'Il fait beau.',rain:'Il pleut.',snow:'Il neige.',wind:'Il fait du vent.',night:'Il fait nuit.'};
  const role=typeof npc.role==='object'?(npc.role.fr||npc.role.en):npc.role;
  const locName=(typeof LOC_NAMES!=='undefined'&&LOC_NAMES[loc.id])?LOC_NAMES[loc.id].fr||loc.id:loc.id;
  const prompt=npc.ctx+'\nTu es '+npc.name+', '+role+' à '+locName+'.\nJoueur: '+S.playerName+'. Météo: '+(wctx[currentWeather]||'')+'\nRÈGLES STRICTES:\n1. Réponds UNIQUEMENT en '+LANG_NAMES[S.targetLang]+'.'+si+'\n2. Reste TOUJOURS dans ton rôle de '+role+'. Ne réponds JAMAIS hors de ce rôle.\n3. Si hors-sujet: "En tant que '+role+', parlons plutôt de [ton domaine]."\n4. Phrases courtes (2-3 max). Vocabulaire simple.';
  showTyping();
  const sendBtn=document.getElementById('dialSend');
  if(sendBtn)sendBtn.disabled=true;
  try{
    const result=await callAPIWithFallback('/api/dialogue',{
      npcName:npc.name,
      npcRole:role,
      location:locName,
      language:LANG_NAMES[S.targetLang],
      playerName:S.playerName,
      playerMessage:'__OPEN__',
      history:[],
      systemContext:prompt
    });
    removeTyping();
    const reply=result.reply||'Bonjour '+S.playerName+' !';
    addClickableMsg('npc',npc.emoji,reply);
    if(S.chatHistory)S.chatHistory.push({role:'assistant',content:reply});
  }catch(e){
    removeTyping();
    addClickableMsg('npc',npc.emoji,'Bonjour '+S.playerName+' !');
  }
  if(sendBtn)sendBtn.disabled=false;
}

async function sendMsg() {
  const input = document.getElementById('dialInput');
  const msg = input ? input.value.trim() : '';
  if (!msg) return;
  
  addClickableMsg('player', '👤', msg);
  if (input) input.value = '';
  if (S.chatHistory) S.chatHistory.push({ role: 'user', content: msg });
  if (typeof gainXP === 'function') gainXP(10);
  if (typeof checkMissionInMessage === 'function') checkMissionInMessage(msg);
  if (typeof onMessageSent === 'function') onMessageSent(msg);
  
  await checkSpelling(msg);
  
  showTyping();
  const sendBtn = document.getElementById('dialSend');
  if (sendBtn) sendBtn.disabled = true;
  
  try {
    const npc = S.currentNPC;
    const loc = S.currentLoc;
    const si = getScriptInstr();
    const result = await callAPIWithFallback('/api/dialogue', {
      npcName: npc.name,
      npcRole: typeof npc.role === 'object' ? npc.role.fr : npc.role,
      location: LOC_NAMES[loc.id]?.fr || loc.id,
      language: LANG_NAMES[S.targetLang],
      playerName: S.playerName,
      playerMessage: msg,
      history: S.chatHistory.slice(-6),
      systemContext: `Tu es ${S.currentNPC?.name}, ${typeof S.currentNPC?.role==='object'?(S.currentNPC?.role?.fr||S.currentNPC?.role?.en):S.currentNPC?.role}. Réponds UNIQUEMENT en ${LANG_NAMES[S.targetLang]}.${si} RÈGLE: reste dans ton rôle. Si hors-sujet dis: "Revenons à mon domaine." Max 2 phrases.`
    });
    removeTyping();
    const reply = result.reply || `Merci pour votre message !`;
    addClickableMsg('npc', npc.emoji, reply);
    if (S.chatHistory) S.chatHistory.push({ role: 'assistant', content: reply });
    gainXP(5);
  } catch (e) {
    removeTyping();
    addClickableMsg('npc', S.currentNPC?.emoji || '🧑', `Merci pour votre message ! Je vous répondrai bientôt.`);
  }
  if (sendBtn) sendBtn.disabled = false;
}

async function checkSpelling(text) {
  try {
    const result = await callAPIWithFallback('/api/correct', {
      text: text,
      language: LANG_NAMES[S.targetLang] || 'anglais',
      nativeLanguage: LANG_NAMES[S.nativeLang] || 'français'
    });
    
    const panel = document.getElementById('corrPanel');
    const corrTitle = document.getElementById('corrTitle');
    const corrOrig = document.getElementById('corrOrig');
    const corrFixed = document.getElementById('corrFixed');
    const corrExplain = document.getElementById('corrExplain');
    
    if (!panel || !corrTitle || !corrOrig || !corrFixed || !corrExplain) return;
    
    if (result.correct) {
      panel.className = 'correction-panel ok show';
      corrTitle.textContent = '✅ CORRECT';
      corrOrig.textContent = '';
      corrFixed.textContent = result.corrected || text;
      corrExplain.textContent = 'Parfait !';
    } else {
      panel.className = 'correction-panel show';
      corrTitle.textContent = '✏️ CORRECTION';
      corrOrig.textContent = text;
      corrFixed.textContent = result.corrected || '';
      corrExplain.textContent = result.explanation || '';
      underlineLastPlayerMsg(text, result.corrected);
    }
  } catch (e) {
    console.warn('Spell check failed:', e);
  }
}

function underlineLastPlayerMsg(original, corrected) {
  const msgs = document.querySelectorAll('.msg.player .msg-bubble');
  if (!msgs.length) return;
  const last = msgs[msgs.length - 1];
  if (original !== corrected) {
    last.style.borderBottom = '2px wavy var(--red)';
    last.title = 'Cliquez ✏️ Correction pour voir la correction';
  }
}

async function reqHint() {
  const last = S.chatHistory?.filter(m => m.role === 'assistant').slice(-1)[0]?.content;
  if (!last) {
    showNotif('💡 Aucun message récent pour un indice');
    return;
  }
  try {
    const result = await callAPIWithFallback('/api/dialogue', {
      npcName: '', npcRole: '', location: '',
      language: LANG_NAMES[S.nativeLang] || 'français',
      playerName: S.playerName,
      playerMessage: `Donne un indice court en ${LANG_NAMES[S.nativeLang] || 'français'} pour répondre à: "${last}". Max 1 phrase.`,
      history: []
    });
    showNotif('💡 ' + (result.reply || 'Essayez de reformuler votre réponse'));
  } catch (e) {
    showNotif('💡 Essayez de répondre simplement');
  }
}

async function reqTranslate() {
  const last = S.chatHistory?.filter(m => m.role === 'assistant').slice(-1)[0]?.content;
  if (!last) {
    showNotif('🔤 Aucun message à traduire');
    return;
  }
  try {
    const result = await callAPIWithFallback('/api/translate', {
      text: last,
      targetLanguage: LANG_NAMES[S.nativeLang] || 'français'
    });
    showNotif('🔤 ' + (result.translation || last));
  } catch (e) {
    showNotif('🔤 Traduction non disponible');
  }
}

function toggleVoice() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    showNotif('🎤 Non supporté sur ce navigateur');
    return;
  }
  if (isRecording) {
    if (recognition) recognition.stop();
    isRecording = false;
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn) {
      voiceBtn.classList.remove('rec');
      voiceBtn.textContent = '🎤 Parler';
    }
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  const lm = { en: 'en-US', fr: 'fr-FR', es: 'es-ES', ht: 'fr-HT', de: 'de-DE', ru: 'ru-RU', zh: 'zh-CN', ja: 'ja-JP' };
  recognition.lang = lm[S.targetLang] || 'en-US';
  recognition.interimResults = false;
  recognition.onstart = () => {
    isRecording = true;
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn) {
      voiceBtn.classList.add('rec');
      voiceBtn.textContent = '⏹️ Stop';
    }
    showNotif('🎤 Parlez...');
  };
  recognition.onresult = (e) => {
    const t = e.results[0][0].transcript;
    const dialInput = document.getElementById('dialInput');
    if (dialInput) dialInput.value = t;
    showNotif('✅ "' + t + '"');
  };
  recognition.onerror = () => {
    showNotif('❌ Erreur micro');
  };
  recognition.onend = () => {
    isRecording = false;
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn) {
      voiceBtn.classList.remove('rec');
      voiceBtn.textContent = '🎤 Parler';
    }
  };
  recognition.start();
}

function addClickableMsg(type, avatar, text) {
  const c = document.getElementById('chatMsgs');
  if (!c) return;
  const d = document.createElement('div');
  d.className = `msg ${type}`;
  const content = type === 'npc' ? makeClickable(text) : escapeHtml(text);
  d.innerHTML = `<div class="msg-av">${avatar}</div><div class="msg-bubble">${content}</div>`;
  c.appendChild(d);
  c.scrollTop = c.scrollHeight;
}

function addSysMsg(t) {
  const c = document.getElementById('chatMsgs');
  if (!c) return;
  const d = document.createElement('div');
  d.className = 'msg system';
  d.innerHTML = `<div class="msg-bubble">${t}</div>`;
  c.appendChild(d);
  c.scrollTop = c.scrollHeight;
}

function makeClickable(text) {
  return text.split(/(\s+|[,\.!?;:'"()\[\]{}])/g).map(tok => {
    if (tok.trim() && tok.trim().length > 1 && !/^[,\.!?;:'"()\[\]{}]+$/.test(tok.trim())) {
      const s = escapeHtml(tok);
      return `<span class="clickable-word" onclick="lookupWord('${s.replace(/'/g, "\\'")}', event)">${s}</span>`;
    }
    return escapeHtml(tok);
  }).join('');
}

function escapeHtml(t) {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function showTyping() {
  const c = document.getElementById('chatMsgs');
  if (!c) return;
  const d = document.createElement('div');
  d.className = 'msg npc';
  d.id = 'typInd';
  d.innerHTML = `<div class="msg-av">${S.currentNPC?.emoji || '🧑'}</div><div class="msg-bubble"><div class="typing-ind"><div class="td"></div><div class="td"></div><div class="td"></div></div></div>`;
  c.appendChild(d);
  c.scrollTop = c.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typInd');
  if (el) el.remove();
}

async function lookupWord(word, event) {
  popupWord = word;
  const pop = document.getElementById('wordPopup');
  const wpWord = document.getElementById('wpWord');
  const wpRoman = document.getElementById('wpRoman');
  const wpTranslation = document.getElementById('wpTranslation');
  const wpGrammar = document.getElementById('wpGrammar');
  
  if (!pop || !wpWord || !wpTranslation) return;
  
  wpWord.textContent = word;
  if (wpRoman) wpRoman.textContent = '';
  wpTranslation.textContent = '...';
  if (wpGrammar) wpGrammar.textContent = '';
  
  const x = Math.min(event.clientX, window.innerWidth - 290);
  const y = Math.max(event.clientY - 170, 10);
  pop.style.left = x + 'px';
  pop.style.top = y + 'px';
  pop.classList.add('show');
  
  try {
    const result = await callAPIWithFallback('/api/dialogue', {
      npcName: '', npcRole: '', location: '',
      language: LANG_NAMES[S.nativeLang] || 'français',
      playerName: S.playerName,
      playerMessage: `Pour le mot "${word}" en ${LANG_NAMES[S.targetLang]}, donne en ${LANG_NAMES[S.nativeLang] || 'français'}: 1.Traduction 2.Romanisation si applicable 3.Catégorie grammaticale. JSON: {"translation":"...","roman":"...","grammar":"..."}`,
      history: []
    });
    let p;
    try {
      p = JSON.parse((result.reply || '{}').replace(/```json|```/g, '').trim());
    } catch {
      p = { translation: result.reply || word, roman: '', grammar: '' };
    }
    if (wpTranslation) wpTranslation.textContent = p.translation || word;
    if (wpRoman) wpRoman.textContent = p.roman || '';
    if (wpGrammar) wpGrammar.textContent = p.grammar || '';
  } catch (e) {
    if (wpTranslation) wpTranslation.textContent = 'Indisponible';
  }
}

function closeWordPopup() {
  const pop = document.getElementById('wordPopup');
  if (pop) pop.classList.remove('show');
}

function speakPopupWord() {
  if (popupWord && 'speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(popupWord);
    const lm = { en: 'en-US', fr: 'fr-FR', es: 'es-ES', ht: 'fr-HT', de: 'de-DE', ru: 'ru-RU', zh: 'zh-CN', ja: 'ja-JP' };
    u.lang = lm[S.targetLang] || 'en-US';
    speechSynthesis.speak(u);
    showNotif('🔊 ' + popupWord);
  }
}

// VOCABULAIRE
