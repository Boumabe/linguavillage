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

window.showNotif = function(msg, duration, type) {
  const el = document.getElementById('notif');
  if (!el) return;
  duration = duration || 2800;
  el.textContent = msg;
  el.classList.add('show');
  // Son selon type
  if (window.LV_SOUND) {
    if (type === 'error') window.LV_SOUND.play('wrong');
    else if (type === 'success') window.LV_SOUND.play('correct');
    else window.LV_SOUND.play('notif');
  }
  clearTimeout(window._notifTimer);
  window._notifTimer = setTimeout(() => el.classList.remove('show'), duration);
};

window._comboCount = 0;
window._comboTimer = null;

window.gainXP = function(amount, sourceEl) {
  if (!S) return;
  S.xp = (S.xp || 0) + (amount || 0);
  var hudXP  = document.getElementById('hudXP');
  var menuXP = document.getElementById('menuXP');
  var xpFill = document.getElementById('xpFill');
  if (hudXP)  hudXP.textContent  = S.xp + ' XP';
  if (menuXP) menuXP.textContent = S.xp + ' XP';
  if (xpFill) {
    var pct = (S.xp % 100);
    xpFill.style.transition = 'width 0.6s cubic-bezier(0.22,1,0.36,1)';
    xpFill.style.width = pct + '%';
  }

  // Combo tracking
  clearTimeout(window._comboTimer);
  window._comboCount = (window._comboCount || 0) + 1;
  window._comboTimer = setTimeout(function() { window._comboCount = 0; }, 4000);

  // Son XP
  if (window.LV_SOUND) window.LV_SOUND.play('xp');

  // Animation popup XP
  if (window.LV_ANIM) {
    window.LV_ANIM.xpPop(amount, sourceEl);
    window.LV_ANIM.xpBarPulse();
    // Combo visuel si 3+
    if (window._comboCount >= 3) {
      window.LV_ANIM.comboFlash(window._comboCount);
    }
  }

  if (typeof checkBadges === 'function') checkBadges();
  if (typeof saveGame    === 'function') saveGame();
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
