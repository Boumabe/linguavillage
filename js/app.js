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
   // =================================================================
// VILLAGE COMPLET
// =================================================================
let canvas, ctx, tick = 0, hoveredLoc = null;
let currentWeather = 'sun';
const WEATHER_ICONS = { sun: '☀️', rain: '🌧️', wind: '💨', night: '🌙', snow: '❄️' };

function initCanvas() {
  if (canvas) return;
  canvas = document.getElementById('villageCanvas');
  if (!canvas) return;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  ctx = canvas.getContext('2d');
  window.addEventListener('resize', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  });
  canvas.addEventListener('click', onVillageClick);
  canvas.addEventListener('mousemove', onVillageHover);
  canvas.addEventListener('touchstart', onVillageTouch, { passive: true });
  requestAnimationFrame(villageLoop);
}

function villageLoop() { tick++; drawVillage(); requestAnimationFrame(villageLoop); }

function drawVillage() {
  if (!canvas || !ctx) return;
  const W = canvas.width, H = canvas.height;
  ctx.fillStyle = '#2d5a2d';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#fff';
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🏘️ Bienvenue au Village', W/2, 50);
  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#ddd';
  ctx.fillText('Cliquez sur un bâtiment pour parler', W/2, H - 30);
}

function onVillageClick(e) { alert('Village - Version test'); }
function onVillageHover(e) {}
function onVillageTouch(e) {}

function getWeatherForTime() { return 'sun'; }
function setWeather(w) { currentWeather = w; }
function buildWeatherFX(w) {}
function updateTime() {
  const n = new Date();
  const timeEl = document.getElementById('hudTime');
  if (timeEl) timeEl.textContent = `${n.getHours().toString().padStart(2,'0')}:${n.getMinutes().toString().padStart(2,'0')}`;
}

// Remplacer goVillage par la version complète
window.goVillage = function() {
  const hudPlayer = document.getElementById('hudPlayer');
  if (hudPlayer) hudPlayer.textContent = '👤 ' + S.playerName;
  const hudLang = document.getElementById('hudLang');
  if (hudLang) hudLang.textContent = (FLAGS[S.targetLang] || '') + ' ' + (LANG_NAMES[S.targetLang] || '');
  const hudXP = document.getElementById('hudXP');
  if (hudXP) hudXP.textContent = S.xp + ' XP';
  showScreen('screen-village');
  initCanvas();
  setWeather(getWeatherForTime());
  setInterval(updateTime, 30000);
  updateTime();
};
 // =================================================================
// FONCTIONS MANQUANTES
// =================================================================
function applyMenuUI() {
  const menuUi = S.currentUI || UI_TEXT.fr;
  const titles = {
    'menu-title-text': menuUi.menu_title || 'Que voulez-vous faire ?',
    'mb-village': menuUi.mb_village || 'Village',
    'mb-vocab': menuUi.mb_vocab || 'Vocabulaire',
    'mb-phrases': menuUi.mb_phrases || 'Phrases',
    'mb-grammar': menuUi.mb_grammar || 'Grammaire',
    'mb-dict': menuUi.mb_dict || 'Dictionnaire'
  };
  for (const [id, text] of Object.entries(titles)) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }
}

function openLoc(loc) {
  alert('Lieu: ' + (LOC_NAMES?.[loc.id]?.[S.nativeLang] || loc.id));
               }  
});
