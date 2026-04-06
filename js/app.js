/* =================================================================
   app.js — LinguaVillage (VERSION MINIMALE DE TEST)
   ================================================================= */

// =================================================================
// STATE
// =================================================================
let S = {
  playerName: '',
  nativeLang: '',
  targetLang: '',
  scriptPref: 'both',
  xp: 0,
  level: 1,
  currentLoc: null,
  currentNPC: null,
  chatHistory: []
};

// =================================================================
// VARIABLES GLOBALES
// =================================================================
const LANG_NAMES = {en:'anglais',fr:'français',es:'espagnol',ht:'créole haïtien',de:'allemand',ru:'russe',zh:'mandarin',ja:'japonais'};
const FLAGS = {en:'🇬🇧',fr:'🇫🇷',es:'🇪🇸',ht:'🇭🇹',de:'🇩🇪',ru:'🇷🇺',zh:'🇨🇳',ja:'🇯🇵'};

// =================================================================
// FONCTIONS UI DE BASE
// =================================================================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function showNotif(msg) {
  const n = document.getElementById('notif');
  if (n) {
    n.textContent = msg;
    n.classList.add('show');
    setTimeout(() => n.classList.remove('show'), 2200);
  } else {
    alert(msg);
  }
}

function gainXP(n) {
  S.xp += n;
  const lv = Math.floor(S.xp / 100) + 1;
  if (lv > S.level) {
    S.level = lv;
    showNotif('🎉 Niveau ' + S.level + ' !');
  } else {
    showNotif('+' + n + ' XP ⭐');
  }
}

// =================================================================
// UI TEXTES
// =================================================================
const UI_TEXT = {
  fr: { sub: 'Apprendre en vivant', lbl_native: '🌍 Votre langue maternelle', lbl_name: '✏️ Votre prénom', lbl_target: '🎯 Langue à apprendre', lbl_script: '✍️ Mode d\'écriture', play: '✨ Commencer' },
  en: { sub: 'Learn by living', lbl_native: '🌍 Your native language', lbl_name: '✏️ Your first name', lbl_target: '🎯 Language to learn', lbl_script: '✍️ Writing mode', play: '✨ Start' },
  ht: { sub: 'Aprann pandan w ap viv', lbl_native: '🌍 Lang manman ou', lbl_name: '✏️ Prenon ou', lbl_target: '🎯 Lang ou vle aprann', lbl_script: '✍️ Fason pou ekri', play: '✨ Kòmanse' },
  es: { sub: 'Aprender viviendo', lbl_native: '🌍 Tu idioma nativo', lbl_name: '✏️ Tu nombre', lbl_target: '🎯 Idioma a aprender', lbl_script: '✍️ Modo escritura', play: '✨ Empezar' },
  de: { sub: 'Durch Leben lernen', lbl_native: '🌍 Deine Muttersprache', lbl_name: '✏️ Dein Vorname', lbl_target: '🎯 Zu lernende Sprache', lbl_script: '✍️ Schreibmodus', play: '✨ Starten' },
  ru: { sub: 'Учиться живя', lbl_native: '🌍 Ваш родной язык', lbl_name: '✏️ Ваше имя', lbl_target: '🎯 Язык для изучения', lbl_script: '✍️ Режим письма', play: '✨ Начать' },
  zh: { sub: '在生活中学习', lbl_native: '🌍 您的母语', lbl_name: '✏️ 您的名字', lbl_target: '🎯 要学习的语言', lbl_script: '✍️ 书写模式', play: '✨ 开始' },
  ja: { sub: '生きながら学ぶ', lbl_native: '🌍 あなたの母国語', lbl_name: '✏️ あなたの名前', lbl_target: '🎯 学ぶ言語', lbl_script: '✍️ 書き方', play: '✨ 始める' }
};

function applyUI(lang) {
  const ui = UI_TEXT[lang] || UI_TEXT.fr;
  const el = document.getElementById('ws-sub'); if (el) el.textContent = ui.sub;
  const el2 = document.getElementById('lbl-native'); if (el2) el2.textContent = ui.lbl_native;
  const el3 = document.getElementById('lbl-name'); if (el3) el3.textContent = ui.lbl_name;
  const el4 = document.getElementById('lbl-target'); if (el4) el4.textContent = ui.lbl_target;
  const el5 = document.getElementById('lbl-script'); if (el5) el5.textContent = ui.lbl_script;
  const el6 = document.getElementById('playBtn'); if (el6) el6.textContent = ui.play;
  S.currentUI = ui;
}

function selScript(p, btn) {
  document.querySelectorAll('.sc-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  S.scriptPref = p;
  const playBtn = document.getElementById('playBtn');
  if (playBtn) { playBtn.style.display = 'block'; playBtn.disabled = false; }
}

function startMenu() {
  const menuPlayer = document.getElementById('menuPlayer');
  if (menuPlayer) menuPlayer.textContent = '👤 ' + S.playerName;
  const menuLang = document.getElementById('menuLang');
  if (menuLang) menuLang.textContent = (FLAGS[S.targetLang] || '') + (LANG_NAMES[S.targetLang] || S.targetLang);
  const menuXP = document.getElementById('menuXP');
  if (menuXP) menuXP.textContent = S.xp + ' XP';
  const gemDisplay = document.getElementById('gemDisplay');
  if (gemDisplay) gemDisplay.textContent = '💎 0';
  showScreen('screen-menu');
  if (typeof saveGame === 'function') saveGame();
}

function goVillage() {
  const hudPlayer = document.getElementById('hudPlayer');
  if (hudPlayer) hudPlayer.textContent = '👤 ' + S.playerName;
  const hudLang = document.getElementById('hudLang');
  if (hudLang) hudLang.textContent = (FLAGS[S.targetLang] || '') + ' ' + (LANG_NAMES[S.targetLang] || '');
  const hudXP = document.getElementById('hudXP');
  if (hudXP) hudXP.textContent = S.xp + ' XP';
  showScreen('screen-village');
}

function openDict() {
  showScreen('screen-dict');
}

// =================================================================
// VILLAGE
// =================================================================
function initCanvas() {}
function drawVillage() {}
function setWeather(w) {}
function updateTime() {}

// =================================================================
// VOCABULAIRE SIMPLE
// =================================================================
const VOCAB = { verbes: { fr: 'Verbes', words: [{ n: 'être', t: { en: 'to be', fr: 'être' } }] } };

function loadVocab(catKey) {
  const vocabList = document.getElementById('vocabList');
  if (vocabList) vocabList.innerHTML = '<div>Vocabulaire - Version test</div>';
}

function loadPhrases(catKey) {
  const phraseList = document.getElementById('phraseList');
  if (phraseList) phraseList.innerHTML = '<div>Phrases - Version test</div>';
}

function loadGrammar(catKey) {
  const grammarBody = document.getElementById('grammarBody');
  if (grammarBody) grammarBody.innerHTML = '<div>Grammaire - Version test</div>';
}

// =================================================================
// DIALOGUE SIMPLE
// =================================================================
function openDialogue(locId, npcId) {
  showScreen('screen-dialogue');
  const chatMsgs = document.getElementById('chatMsgs');
  if (chatMsgs) chatMsgs.innerHTML = '<div class="msg npc"><div class="msg-bubble">Bonjour ! Comment vas-tu ?</div></div>';
}

function sendMsg() {
  const inp = document.getElementById('dialInput');
  if (!inp) return;
  const text = inp.value.trim();
  if (!text) return;
  const chatMsgs = document.getElementById('chatMsgs');
  if (chatMsgs) {
    chatMsgs.innerHTML += '<div class="msg player"><div class="msg-bubble">' + text.replace(/</g, '&lt;') + '</div></div>';
    setTimeout(() => {
      chatMsgs.innerHTML += '<div class="msg npc"><div class="msg-bubble">Merci pour votre message !</div></div>';
      chatMsgs.scrollTop = chatMsgs.scrollHeight;
    }, 500);
  }
  inp.value = '';
  gainXP(5);
}

function checkSpelling(text) {}
function lookupWord(word, event) { alert('Traduction de : ' + word); }
function closeWordPopup() {}
function speakPopupWord() {}
function toggleVoice() { alert('🎤 Fonction vocale à activer'); }

// =================================================================
// INITIALISATION
// =================================================================
window.addEventListener('DOMContentLoaded', function() {
  console.log('app.js chargé - Version test');

  // Langue maternelle
  document.querySelectorAll('[data-native]').forEach(function(t) {
    t.addEventListener('click', function() {
      document.querySelectorAll('[data-native]').forEach(x => x.classList.remove('sel'));
      t.classList.add('sel');
      S.nativeLang = t.dataset.native;
      applyUI(S.nativeLang);
      const step2 = document.getElementById('step2');
      if (step2) step2.style.display = 'block';
      const playBtn = document.getElementById('playBtn');
      if (playBtn) { playBtn.style.display = 'none'; playBtn.disabled = true; }
      document.querySelectorAll('[data-lang]').forEach(o => {
        const same = o.dataset.lang === S.nativeLang;
        o.classList.toggle('disabled', same);
        if (same) o.classList.remove('sel');
      });
    });
  });

  // Prénom
  const inputName = document.getElementById('inputName');
  if (inputName) {
    inputName.addEventListener('input', function() {
      const hasValue = this.value.trim().length > 0;
      const step3 = document.getElementById('step3');
      if (step3) step3.style.display = hasValue ? 'block' : 'none';
      const playBtn = document.getElementById('playBtn');
      if (playBtn) playBtn.style.display = 'none';
    });
  }

  // Langue cible
  document.querySelectorAll('[data-lang]').forEach(function(o) {
    o.addEventListener('click', function() {
      if (o.classList.contains('disabled')) return;
      document.querySelectorAll('[data-lang]').forEach(x => x.classList.remove('sel'));
      o.classList.add('sel');
      S.targetLang = o.dataset.lang;
      const cjk = ['zh', 'ja', 'ru'].includes(S.targetLang);
      const playBtn = document.getElementById('playBtn');
      if (cjk) {
        const step4 = document.getElementById('step4');
        if (step4) step4.style.display = 'block';
        if (playBtn) { playBtn.style.display = 'none'; playBtn.disabled = true; }
      } else {
        S.scriptPref = 'both';
        const step4 = document.getElementById('step4');
        if (step4) step4.style.display = 'none';
        if (playBtn) { playBtn.style.display = 'block'; playBtn.disabled = false; }
      }
    });
  });

  // Bouton Commencer
  const playBtn = document.getElementById('playBtn');
  if (playBtn) {
    playBtn.addEventListener('click', function() {
      const inputNameEl = document.getElementById('inputName');
      S.playerName = inputNameEl ? inputNameEl.value.trim() : '';
      if (!S.playerName || !S.nativeLang || !S.targetLang) {
        alert('⚠️ Complétez tous les champs !');
        return;
      }
      startMenu();
    });
  }

  // Dialogue
  const dialInput = document.getElementById('dialInput');
  if (dialInput) {
    dialInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') sendMsg();
    });
  }
});

// Fin du fichier
