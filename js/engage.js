// LinguaVillage — engage.js
// Boucle d'engagement : objectif du jour → série de jours → coffres (récompenses variables)
// → gemmes → boutique (bouclier de série, boost XP). Tout est local, sans dépendance réseau.
//
// Principes de conception (comportement, pas manipulation) :
//  • objectif quotidien court et atteignable (50 XP ≈ 5 min) : effet « presque arrivé » (goal-gradient)
//  • série de jours + bouclier : aversion à la perte, mais avec un filet de sécurité qui évite la frustration
//  • coffre à récompense variable APRÈS l'effort (pas avant), jamais payant
//  • aucune notification insistante, aucun compte à rebours culpabilisant
// ================================================================
window.LV_ENGAGE = (function () {
  'use strict';

  var GOALS = [30, 50, 100];
  var MODES = {
    'screen-village': { key: 'village', fr: 'le Village',        open: function () { if (typeof goVillage === 'function') goVillage(); } },
    'screen-vocab':   { key: 'vocab',   fr: 'le Vocabulaire',    open: function () { if (typeof ensureLearningBindings === 'function') ensureLearningBindings(); showScreen('screen-vocab'); } },
    'screen-phrases': { key: 'phrases', fr: 'les Phrases',       open: function () { if (typeof ensureLearningBindings === 'function') ensureLearningBindings(); showScreen('screen-phrases'); } },
    'screen-grammar': { key: 'grammar', fr: 'la Grammaire',      open: function () { showScreen('screen-grammar'); } },
    'screen-dict':    { key: 'dict',    fr: 'le Dictionnaire',   open: function () { if (typeof openDict === 'function') openDict(); } }
  };

  // Textes de la carte « Aujourd'hui » (langue maternelle du joueur)
  var T = {
    fr: { goal:"Objectif du jour · XP", done:"Objectif atteint ✓", start:"Commencer avec", again:"Reprendre", keep:"Continuer avec", village:"le Village", vocab:"le Vocabulaire", phrases:"les Phrases", grammar:"la Grammaire", dict:"le Dictionnaire", goalBtn:"Objectif" },
    en: { goal:"Daily goal · XP", done:"Goal reached ✓", start:"Start with", again:"Resume", keep:"Keep going with", village:"the Village", vocab:"Vocabulary", phrases:"Phrases", grammar:"Grammar", dict:"the Dictionary", goalBtn:"Goal" },
    es: { goal:"Objetivo del día · XP", done:"Objetivo cumplido ✓", start:"Empezar con", again:"Retomar", keep:"Seguir con", village:"la Aldea", vocab:"el Vocabulario", phrases:"las Frases", grammar:"la Gramática", dict:"el Diccionario", goalBtn:"Meta" },
    ht: { goal:"Objektif jodi a · XP", done:"Objektif rive ✓", start:"Kòmanse ak", again:"Kontinye ak", keep:"Kontinye ak", village:"Vilaj la", vocab:"Vokabilè", phrases:"Fraz yo", grammar:"Gramè", dict:"Diksyonè a", goalBtn:"Objektif" },
    de: { goal:"Tagesziel · XP", done:"Ziel erreicht ✓", start:"Starte mit", again:"Weiter mit", keep:"Weiter mit", village:"dem Dorf", vocab:"Vokabeln", phrases:"Sätzen", grammar:"Grammatik", dict:"dem Wörterbuch", goalBtn:"Ziel" },
    ru: { goal:"Цель дня · XP", done:"Цель достигнута ✓", start:"Начать:", again:"Продолжить:", keep:"Дальше:", village:"Деревня", vocab:"Слова", phrases:"Фразы", grammar:"Грамматика", dict:"Словарь", goalBtn:"Цель" },
    zh: { goal:"今日目标 · XP", done:"目标达成 ✓", start:"开始：", again:"继续：", keep:"继续：", village:"村庄", vocab:"词汇", phrases:"短语", grammar:"语法", dict:"词典", goalBtn:"目标" },
    ja: { goal:"今日の目標 · XP", done:"目標達成 ✓", start:"始める：", again:"再開：", keep:"続ける：", village:"村", vocab:"単語", phrases:"フレーズ", grammar:"文法", dict:"辞書", goalBtn:"目標" }
  };
  function tt(k) { var l = (window.S && S.nativeLang) || 'fr'; return (T[l] || T.fr)[k] || T.fr[k]; }

  function G() { return window.S_game; }
  function M() { return window.S_missions; }
  function el(id) { return document.getElementById(id); }

  // ── Objectif du jour ───────────────────────────────────────────
  function daily() {
    var g = G(); if (!g) return { xp: 0, goal: 50, done: false };
    var k = LV.dateKey();
    if (!g.daily || g.daily.date !== k) g.daily = { date: k, xp: 0, goal: (g.daily && g.daily.goal) || GOALS[1], done: false };
    return g.daily;
  }

  function onXP(n) {
    var d = daily();
    d.xp += n;
    if (!d.done && d.xp >= d.goal) {
      d.done = true;
      // Récompense garantie (1 gemme) + coffre à contenu variable
      addGems(1);
      setTimeout(function () {
        if (typeof showNotif === 'function') showNotif('🎯 Objectif du jour atteint !', 3000);
        if (typeof launchConfetti === 'function') launchConfetti();
        LV.haptic([30, 50, 30]);
        setTimeout(function () { openChest('common'); }, 900);
      }, 500);
    }
    render();
  }
  function onNewDay() { daily(); render(); }

  function cycleGoal() {
    var d = daily(); if (d.done) return;
    d.goal = GOALS[(GOALS.indexOf(d.goal) + 1) % GOALS.length];
    if (typeof saveGame === 'function') saveGame();
    render();
  }

  // ── Carte « Aujourd'hui » du menu ──────────────────────────────
  function render() {
    var d = daily(), g = G(); if (!g) return;
    var pct = Math.min(1, d.xp / d.goal);
    var ring = el('heroRingFg');
    if (ring) { var C = 2 * Math.PI * 34; ring.style.strokeDasharray = C; ring.style.strokeDashoffset = C * (1 - pct); }
    var t = el('heroGoalVal'); if (t) t.textContent = Math.min(d.xp, d.goal) + '/' + d.goal;
    var hero = el('streakBanner'); if (hero) hero.classList.toggle('done', !!d.done);
    var lab = el('heroGoalLabel'); if (lab) lab.textContent = d.done ? tt('done') : tt('goal');
    var gb = document.querySelector('.hero-pill.ghost'); if (gb) gb.textContent = tt('goalBtn');
    var sh = el('heroShield'); if (sh) sh.textContent = '🛡️ ×' + (g.streakFreezes || 0);
    var gems = el('gemDisplay'); if (gems) gems.textContent = '💎 ' + ((M() && M().gems) || 0);
    var boost = el('heroBoost');
    if (boost) {
      var left = (window.S && S.xpBoostEnd) ? S.xpBoostEnd - Date.now() : 0;
      boost.hidden = left <= 0;
      if (left > 0) boost.textContent = '⚡ ×2 · ' + Math.ceil(left / 60000) + ' min';
    }
    var cta = el('heroCtaLabel');
    if (cta) {
      var m = MODES[(window.S && S.lastScreen)] || MODES['screen-village'];
      var sp = /^(ru|zh|ja)$/.test((window.S && S.nativeLang) || '') ? '' : ' ';
      cta.textContent = (d.done ? tt('keep') : (d.xp > 0 ? tt('again') : tt('start'))) + sp + tt(m.key);
    }
  }

  function resume() {
    var m = MODES[(window.S && S.lastScreen)] || MODES['screen-village'];
    LV.haptic(10);
    m.open();
  }

  // Mémorise le dernier mode d'apprentissage utilisé (pour le bouton « Reprendre »)
  LV.on('screen', function (d) {
    if (MODES[d.id] && window.S) { S.lastScreen = d.id; }
    if (d.id === 'screen-menu') render();
  });

  // ── Gemmes / boost / coffres ───────────────────────────────────
  function addGems(n) {
    var m = M(); if (!m) return;
    m.gems = (m.gems || 0) + n;
    render();
    if (typeof saveGame === 'function') saveGame();
  }
  function addBoost(minutes) {
    var base = Math.max(Date.now(), (window.S && S.xpBoostEnd) || 0);
    S.xpBoostEnd = base + minutes * 60000;
    render();
  }

  function pickReward(chest) {
    var total = chest.rewards.reduce(function (a, r) { return a + r.w; }, 0), x = Math.random() * total;
    for (var i = 0; i < chest.rewards.length; i++) { x -= chest.rewards[i].w; if (x <= 0) return chest.rewards[i]; }
    return chest.rewards[0];
  }

  function openChest(type) {
    var types = window.CHEST_TYPES || {};
    var chest = types[type] || types.common;
    if (!chest) return;
    var g = G(); if (g) { g.chestsOpened = (g.chestsOpened || 0) + 1; }
    var reward = pickReward(chest);

    var ov = document.createElement('div');
    ov.className = 'lv-modal lv-chest';
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', chest.fr);
    ov.innerHTML =
      '<div class="lv-modal-card">' +
        '<div class="lv-chest-name">' + LV.esc(chest.fr) + '</div>' +
        '<div class="lv-chest-box" style="--chest:' + chest.color + '"><span class="lv-chest-icon">' + chest.icon + '</span></div>' +
        '<div class="lv-chest-reward" aria-live="polite"></div>' +
        '<button type="button" class="lv-btn primary lv-chest-ok" hidden>Super !</button>' +
      '</div>';
    document.body.appendChild(ov);
    var box = ov.querySelector('.lv-chest-box'), out = ov.querySelector('.lv-chest-reward'), ok = ov.querySelector('.lv-chest-ok');
    LV.haptic([15, 30, 15]);
    setTimeout(function () {
      box.classList.add('open');
      var txt;
      if (reward.type === 'xp')        { txt = '<b>+' + reward.value + '</b> XP'; }
      else if (reward.type === 'gems') { txt = '<b>+' + reward.value + '</b> 💎'; addGems(reward.value); }
      else                             { txt = '⚡ Boost XP ×2 · <b>' + reward.value + '</b> min'; addBoost(reward.value); }
      out.innerHTML = txt; out.classList.add('show');
      ok.hidden = false; ok.focus();
      LV.haptic(25);
      if (reward.type === 'xp' && typeof gainXP === 'function') gainXP(reward.value);
      if (typeof launchConfetti === 'function' && (type === 'rare' || type === 'epic' || type === 'legendary')) launchConfetti();
      if (typeof saveGame === 'function') saveGame();
    }, LV.reducedMotion ? 100 : 900);
    ok.addEventListener('click', function () { ov.classList.add('closing'); setTimeout(function () { ov.remove(); }, 180); });
  }

  // ── Boutique ───────────────────────────────────────────────────
  var ITEMS = [
    { id: 'shield', icon: '🛡️', name: 'Bouclier de série', desc: 'Sauve ta série si tu rates un jour.', price: 3,
      max: 3, owned: function () { return G().streakFreezes || 0; },
      buy: function () { G().streakFreezes = (G().streakFreezes || 0) + 1; } },
    { id: 'boost', icon: '⚡', name: 'Boost XP ×2', desc: 'Double l’XP pendant 30 minutes.', price: 2,
      buy: function () { addBoost(30); } },
    { id: 'chest', icon: '📦', name: 'Coffre surprise', desc: 'Une récompense au hasard.', price: 4,
      buy: function () { setTimeout(function () { openChest('common'); }, 250); } }
  ];

  function openShop() {
    showScreen('screen-shop'); renderShop();
  }
  function renderShop() {
    var wrap = el('shopItems'); if (!wrap) return;
    var gems = (M() && M().gems) || 0;
    var sg = el('shopGems'); if (sg) sg.textContent = gems;
    wrap.innerHTML = '';
    ITEMS.forEach(function (it) {
      var owned = it.owned ? it.owned() : null;
      var maxed = it.max && owned >= it.max;
      var card = document.createElement('div'); card.className = 'lv-shop-item';
      card.innerHTML =
        '<div class="lv-shop-ic">' + it.icon + '</div>' +
        '<div class="lv-shop-name">' + LV.esc(it.name) + (owned != null ? ' <small>×' + owned + '</small>' : '') + '</div>' +
        '<div class="lv-shop-desc">' + LV.esc(it.desc) + '</div>';
      var b = document.createElement('button'); b.type = 'button'; b.className = 'lv-btn ' + (gems >= it.price && !maxed ? 'primary' : 'ghost');
      b.disabled = gems < it.price || maxed;
      b.textContent = maxed ? 'Maximum' : '💎 ' + it.price;
      b.addEventListener('click', function () { buy(it); });
      card.appendChild(b); wrap.appendChild(card);
    });
    var tip = document.createElement('div'); tip.className = 'lv-shop-tip';
    tip.textContent = 'Gagne des 💎 en atteignant ton objectif du jour et en ouvrant des coffres.';
    wrap.appendChild(tip);
  }
  function buy(it) {
    var m = M(); if (!m || (m.gems || 0) < it.price) return;
    if (it.max && it.owned() >= it.max) return;
    m.gems -= it.price; it.buy();
    LV.haptic(20);
    if (typeof showNotif === 'function') showNotif(it.icon + ' ' + it.name + ' acheté !');
    if (typeof saveGameNow === 'function') saveGameNow();
    renderShop(); render();
  }

  // Bouton « bouclier » de la carte du jour
  function useStreakFreeze() {
    var n = G().streakFreezes || 0;
    if (n > 0) {
      if (typeof showNotif === 'function') showNotif('🛡️ ' + n + ' bouclier' + (n > 1 ? 's' : '') + ' en réserve — utilisé automatiquement si tu rates un jour.', 4200);
    } else openShop();
  }

  function showProgression() {
    if (typeof showDetailedStats === 'function') showDetailedStats();
  }

  // Le boost expire : mise à jour de l'affichage (une fois par minute, seulement si le menu est visible)
  setInterval(function () { if (window.S && S.xpBoostEnd && LV.currentScreen() === 'screen-menu') render(); }, 60000);
  window.addEventListener('load', function () { setTimeout(render, 300); });

  // Exposition globale pour les onclick du HTML
  window.openShop = openShop;
  window.useStreakFreeze = useStreakFreeze;
  window.showProgression = showProgression;

  return { onXP: onXP, onNewDay: onNewDay, render: render, resume: resume, cycleGoal: cycleGoal,
           openChest: openChest, openShop: openShop, addGems: addGems, addBoost: addBoost };
})();
console.log('✅ engage.js chargé');
