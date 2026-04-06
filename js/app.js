/* =================================================================
   app.js — LinguaVillage (VERSION ULTRA SIMPLE)
   ================================================================= */

// Variables globales
let S = { playerName: '', nativeLang: '', targetLang: '', scriptPref: 'both', xp: 0, level: 1 };
const LANG_NAMES = { en:'anglais', fr:'français', es:'espagnol', ht:'créole haïtien', de:'allemand', ru:'russe', zh:'mandarin', ja:'japonais' };
const FLAGS = { en:'🇬🇧', fr:'🇫🇷', es:'🇪🇸', ht:'🇭🇹', de:'🇩🇪', ru:'🇷🇺', zh:'🇨🇳', ja:'🇯🇵' };

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function showNotif(msg) {
  const n = document.getElementById('notif');
  if (n) { n.textContent = msg; n.classList.add('show'); setTimeout(() => n.classList.remove('show'), 2200); }
}

function gainXP(n) { S.xp += n; showNotif('+' + n + ' XP'); }

const UI_TEXT = { fr: { sub: 'Apprendre en vivant', lbl_native: '🌍 Votre langue maternelle', lbl_name: '✏️ Votre prénom', lbl_target: '🎯 Langue à apprendre', lbl_script: '✍️ Mode d\'écriture', play: '✨ Commencer' } };
for (let lang of ['en','ht','es','de','ru','zh','ja']) { UI_TEXT[lang] = UI_TEXT.fr; }

function applyUI(lang) {
  const ui = UI_TEXT[lang] || UI_TEXT.fr;
  const ws = document.getElementById('ws-sub'); if (ws) ws.textContent = ui.sub;
  const ln = document.getElementById('lbl-native'); if (ln) ln.textContent = ui.lbl_native;
  const lname = document.getElementById('lbl-name'); if (lname) lname.textContent = ui.lbl_name;
  const lt = document.getElementById('lbl-target'); if (lt) lt.textContent = ui.lbl_target;
  const ls = document.getElementById('lbl-script'); if (ls) ls.textContent = ui.lbl_script;
  const pb = document.getElementById('playBtn'); if (pb) pb.textContent = ui.play;
}

function selScript(p, btn) {
  document.querySelectorAll('.sc-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  S.scriptPref = p;
  document.getElementById('playBtn').style.display = 'block';
  document.getElementById('playBtn').disabled = false;
}

function startMenu() {
  document.getElementById('menuPlayer').textContent = '👤 ' + S.playerName;
  document.getElementById('menuLang').textContent = (FLAGS[S.targetLang]||'') + (LANG_NAMES[S.targetLang]||S.targetLang);
  document.getElementById('menuXP').textContent = S.xp + ' XP';
  document.getElementById('gemDisplay').textContent = '💎 0';
  showScreen('screen-menu');
  if (typeof saveGame === 'function') saveGame();
}

function goVillage() {
  document.getElementById('hudPlayer').textContent = '👤 ' + S.playerName;
  document.getElementById('hudLang').textContent = (FLAGS[S.targetLang]||'') + ' ' + (LANG_NAMES[S.targetLang]||'');
  document.getElementById('hudXP').textContent = S.xp + ' XP';
  showScreen('screen-village');
}

function initCanvas() {}
function drawVillage() {}
function setWeather() {}
function updateTime() {}

function loadVocab(c) { document.getElementById('vocabList').innerHTML = '<div>Vocabulaire - Version test</div>'; }
function loadPhrases(c) { document.getElementById('phraseList').innerHTML = '<div>Phrases - Version test</div>'; }
function loadGrammar(c) { document.getElementById('grammarBody').innerHTML = '<div>Grammaire - Version test</div>'; }
function openDict() { showScreen('screen-dict'); }
function openDialogue(l, n) { showScreen('screen-dialogue'); document.getElementById('chatMsgs').innerHTML = '<div class="msg npc"><div class="msg-bubble">Bonjour !</div></div>'; }
function sendMsg() { gainXP(5); document.getElementById('dialInput').value = ''; }
function checkSpelling(t) {}
function lookupWord(w, e) { alert('Traduction: ' + w); }
function closeWordPopup() {}
function speakPopupWord() {}
function toggleVoice() { alert('🎤 Micro'); }

window.addEventListener('DOMContentLoaded', function() {
  console.log('app.js chargé');
  document.querySelectorAll('[data-native]').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('[data-native]').forEach(x => x.classList.remove('sel'));
      t.classList.add('sel');
      S.nativeLang = t.dataset.native;
      applyUI(S.nativeLang);
      document.getElementById('step2').style.display = 'block';
      document.getElementById('playBtn').style.display = 'none';
      document.querySelectorAll('[data-lang]').forEach(o => {
        const same = o.dataset.lang === S.nativeLang;
        o.classList.toggle('disabled', same);
        if (same) o.classList.remove('sel');
      });
    });
  });
  document.getElementById('inputName')?.addEventListener('input', function() {
    document.getElementById('step3').style.display = this.value.trim().length > 0 ? 'block' : 'none';
    document.getElementById('playBtn').style.display = 'none';
  });
  document.querySelectorAll('[data-lang]').forEach(o => {
    o.addEventListener('click', () => {
      if (o.classList.contains('disabled')) return;
      document.querySelectorAll('[data-lang]').forEach(x => x.classList.remove('sel'));
      o.classList.add('sel');
      S.targetLang = o.dataset.lang;
      const cjk = ['zh','ja','ru'].includes(S.targetLang);
      if (cjk) {
        document.getElementById('step4').style.display = 'block';
        document.getElementById('playBtn').style.display = 'none';
      } else {
        S.scriptPref = 'both';
        document.getElementById('step4').style.display = 'none';
        document.getElementById('playBtn').style.display = 'block';
        document.getElementById('playBtn').disabled = false;
      }
    });
  });
  document.getElementById('playBtn')?.addEventListener('click', () => {
    S.playerName = document.getElementById('inputName').value.trim();
    if (!S.playerName || !S.nativeLang || !S.targetLang) { alert('Complétez tous les champs'); return; }
    startMenu();
  });
  document.getElementById('dialInput')?.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });
});
