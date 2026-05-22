// state.js – corrigé (pas de callAPIWithFallback ici)
window.S = window.S || {
  playerName: '', nativeLang: '', targetLang: '', scriptPref: 'both',
  xp: 0, level: 1, chatHistory: [], currentNPC: null, currentLoc: null,
  userLevel: 'zero', xpBoostEnd: null
};
var S = window.S;

window.showScreen = function(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = '';
  });
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
};

window.applyUI = function(lang) {
  if (!window.UI_TEXT) return;
  const t = UI_TEXT[lang] || UI_TEXT.fr;
  if (!t) return;
  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setText('ws-sub', t.sub);
  setText('lbl-native', t.lbl_native);
  setText('lbl-name', t.lbl_name);
  setText('lbl-target', t.lbl_target);
  setText('lbl-script', t.lbl_script);
  const playBtn = document.getElementById('playBtn');
  if (playBtn) playBtn.textContent = t.play;
  setText('menu-title-text', t.menu_title);
  setText('menu-sub-text', t.menu_sub);
  setText('mb-village', t.mb_village);
  setText('mb-village-d', t.mb_village_d);
  setText('mb-vocab', t.mb_vocab);
  setText('mb-vocab-d', t.mb_vocab_d);
  setText('mb-phrases', t.mb_phrases);
  setText('mb-phrases-d', t.mb_phrases_d);
  setText('mb-grammar', t.mb_grammar);
  setText('mb-grammar-d', t.mb_grammar_d);
  setText('mb-dict', t.mb_dict);
  setText('mb-dict-d', t.mb_dict_d);
};

window.showNotif = function(msg, duration = 2800) {
  const el = document.getElementById('notif');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(window._notifTimer);
  window._notifTimer = setTimeout(() => el.classList.remove('show'), duration);
};

window.gainXP = function(amount) {
  if (!S) return;
  S.xp = (S.xp || 0) + (amount || 0);
  const hudXP = document.getElementById('hudXP');
  if (hudXP) hudXP.textContent = S.xp + ' XP';
  const menuXP = document.getElementById('menuXP');
  if (menuXP) menuXP.textContent = S.xp + ' XP';
  const xpFill = document.getElementById('xpFill');
  if (xpFill) xpFill.style.width = (S.xp % 100) + '%';
  if (typeof checkBadges === 'function') checkBadges();
  if (typeof saveGame === 'function') saveGame();
};

window.saveGame = function() {
  try {
    localStorage.setItem('linguavillage_save', JSON.stringify({
      S: window.S, missions: window.S_missions, game: window.S_game, timestamp: Date.now()
    }));
  } catch(e) { console.warn(e); }
};

window.updateStreak = function() {
  if (typeof checkDailyStreak === 'function') checkDailyStreak();
  if (typeof updateStreakDisplay === 'function') updateStreakDisplay();
};

window.launchConfetti = function() {
  const colors = ['#FFD700','#4ecf70','#4a9eff','#e040fb','#ff9f43'];
  for (let i = 0; i < 60; i++) setTimeout(() => {
    const c = document.createElement('div');
    c.style.cssText = `position:fixed;top:-10px;left:${Math.random()*100}%;width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${Math.random()>0.5?'50%':'2px'};z-index:99999;pointer-events:none;opacity:1;transition:transform 1s ease-out, opacity 0.5s ease 0.8s`;
    document.body.appendChild(c);
    setTimeout(() => { c.style.transform = `translateY(${window.innerHeight+20}px) rotate(${Math.random()*720}deg)`; c.style.opacity = '0'; }, 20);
    setTimeout(() => c.remove(), 2000);
  }, i * 30);
};

console.log("✅ state.js chargé");
