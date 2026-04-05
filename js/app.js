/* =================================================================
   app.js — LinguaVillage (VERSION MINIMALISTE)
   ================================================================= */

const API = 'https://linguavillage-api--marckensbou2.replit.app';

// =================================================================
// UI TRANSLATIONS
// =================================================================
const UI_TEXT = {
  fr:{sub:'Apprendre en vivant',lbl_native:'🌍 Votre langue maternelle',lbl_name:'✏️ Votre prénom',lbl_target:'🎯 Langue à apprendre',lbl_script:'✍️ Mode d\'écriture',play:'✨ Commencer',menu_title:'Que voulez-vous faire ?',menu_sub:'Choisissez votre mode d\'apprentissage',mb_village:'Village',mb_village_d:'Conversations IA + correcteur temps réel',mb_vocab:'Vocabulaire',mb_vocab_d:'1500 mots essentiels par catégories',mb_phrases:'Phrases & Structures',mb_phrases_d:'1000 phrases du quotidien',mb_grammar:'Grammaire',mb_grammar_d:'6 temps + 500 exemples expliqués',mb_dict:'Dictionnaire',mb_dict_d:'Traduction mot ou phrase complète'},
  en:{sub:'Learn by living',lbl_native:'🌍 Your native language',lbl_name:'✏️ Your first name',lbl_target:'🎯 Language to learn',lbl_script:'✍️ Writing mode',play:'✨ Start',menu_title:'What do you want to do?',menu_sub:'Choose your learning mode',mb_village:'Village',mb_village_d:'AI conversations + real-time corrector',mb_vocab:'Vocabulary',mb_vocab_d:'1500 essential words by category',mb_phrases:'Phrases & Structures',mb_phrases_d:'1000 everyday phrases',mb_grammar:'Grammar',mb_grammar_d:'6 tenses + 500 explained examples',mb_dict:'Dictionary',mb_dict_d:'Translate word or full phrase'},
};

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

const LANG_NAMES = {en:'anglais',fr:'français',es:'espagnol',ht:'créole haïtien',de:'allemand',ru:'russe',zh:'mandarin',ja:'japonais'};
const FLAGS = {en:'🇬🇧',fr:'🇫🇷',es:'🇪🇸',ht:'🇭🇹',de:'🇩🇪',ru:'🇷🇺',zh:'🇨🇳',ja:'🇯🇵'};

// =================================================================
// FONCTIONS
// =================================================================

function applyUI(lang) {
  const ui = UI_TEXT[lang] || UI_TEXT['fr'];
  const wsSub = document.getElementById('ws-sub');
  const lblNative = document.getElementById('lbl-native');
  const lblName = document.getElementById('lbl-name');
  const lblTarget = document.getElementById('lbl-target');
  const lblScript = document.getElementById('lbl-script');
  const playBtn = document.getElementById('playBtn');
  if (wsSub) wsSub.textContent = ui.sub;
  if (lblNative) lblNative.textContent = ui.lbl_native;
  if (lblName) lblName.textContent = ui.lbl_name;
  if (lblTarget) lblTarget.textContent = ui.lbl_target;
  if (lblScript) lblScript.textContent = ui.lbl_script;
  if (playBtn) playBtn.textContent = ui.play;
}

function showNotif(msg) {
  const n = document.getElementById('notif');
  if (!n) return;
  n.textContent = msg;
  n.classList.add('show');
  clearTimeout(n._t);
  n._t = setTimeout(() => n.classList.remove('show'), 2200);
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}

function startMenu() {
  const menuPlayer = document.getElementById('menuPlayer');
  const menuLang = document.getElementById('menuLang');
  const menuXP = document.getElementById('menuXP');
  if (menuPlayer) menuPlayer.textContent = '👤 ' + S.playerName;
  if (menuLang) menuLang.textContent = (FLAGS[S.targetLang] || '') + (LANG_NAMES[S.targetLang] || S.targetLang);
  if (menuXP) menuXP.textContent = S.xp + ' XP';
  showScreen('screen-menu');
}

function gainXP(n) {
  S.xp += n;
  const menuXP = document.getElementById('menuXP');
  const hudXP = document.getElementById('hudXP');
  if (menuXP) menuXP.textContent = S.xp + ' XP';
  if (hudXP) hudXP.textContent = S.xp + ' XP';
  const xpFill = document.getElementById('xpFill');
  if (xpFill) xpFill.style.width = (S.xp % 100) + '%';
  showNotif('+' + n + ' XP ⭐');
}

// =================================================================
// INITIALISATION DES ÉCOUTEURS
// =================================================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM chargé - initialisation des écouteurs');

  // Étoiles
  const starsContainer = document.getElementById('wStars');
  if (starsContainer) {
    for (let i = 0; i < 100; i++) {
      const s = document.createElement('div');
      s.className = 'w-star';
      const z = Math.random() * 2 + 0.5;
      s.style.cssText = 'width:' + z + 'px;height:' + z + 'px;left:' + Math.random() * 100 + '%;top:' + Math.random() * 100 + '%;animation-delay:' + Math.random() * 5 + 's;animation-duration:' + (2 + Math.random() * 4) + 's';
      starsContainer.appendChild(s);
    }
  }

  // 1. Sélection langue maternelle
  document.querySelectorAll('[data-native]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('[data-native]').forEach(function(x) { x.classList.remove('sel'); });
      btn.classList.add('sel');
      S.nativeLang = btn.dataset.native;
      applyUI(S.nativeLang);
      
      const step2 = document.getElementById('step2');
      if (step2) step2.style.display = 'block';
      
      // Désactiver langue identique
      document.querySelectorAll('[data-lang]').forEach(function(langBtn) {
        langBtn.classList.toggle('disabled', langBtn.dataset.lang === S.nativeLang);
        if (langBtn.dataset.lang === S.nativeLang) langBtn.classList.remove('sel');
      });
    });
  });

  // 2. Saisie du nom
  const inputName = document.getElementById('inputName');
  if (inputName) {
    inputName.addEventListener('input', function() {
      const hasValue = this.value.trim().length > 0;
      const step3 = document.getElementById('step3');
      if (step3) step3.style.display = hasValue ? 'block' : 'none';
    });
  }

  // 3. Sélection langue cible
  document.querySelectorAll('[data-lang]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (btn.classList.contains('disabled')) return;
      document.querySelectorAll('[data-lang]').forEach(function(x) { x.classList.remove('sel'); });
      btn.classList.add('sel');
      S.targetLang = btn.dataset.lang;
      
      const cjk = ['zh', 'ja', 'ru'].includes(S.targetLang);
      const step4 = document.getElementById('step4');
      const playBtn = document.getElementById('playBtn');
      
      if (cjk && step4) {
        step4.style.display = 'block';
        const lb = { zh: { n: '你好', r: 'Nǐ hǎo' }, ja: { n: 'こんにちは', r: 'Konnichiwa' }, ru: { n: 'Привет', r: 'Privyet' } };
        const scN = document.getElementById('sc-n');
        const scR = document.getElementById('sc-r');
        if (scN) scN.textContent = lb[S.targetLang].n;
        if (scR) scR.textContent = lb[S.targetLang].r;
        if (playBtn) { playBtn.style.display = 'none'; playBtn.disabled = true; }
      } else {
        S.scriptPref = 'both';
        if (step4) step4.style.display = 'none';
        if (playBtn) { playBtn.style.display = 'block'; playBtn.disabled = false; }
      }
    });
  });

  // 4. Sélection script (CJK)
  window.selScript = function(p, btn) {
    document.querySelectorAll('.sc-btn').forEach(function(b) { b.classList.remove('sel'); });
    btn.classList.add('sel');
    S.scriptPref = p;
    const playBtn = document.getElementById('playBtn');
    if (playBtn) { playBtn.style.display = 'block'; playBtn.disabled = false; }
  };

  // 5. Bouton Commencer
  const playBtn = document.getElementById('playBtn');
  if (playBtn) {
    playBtn.addEventListener('click', function() {
      const nameInput = document.getElementById('inputName');
      S.playerName = nameInput ? nameInput.value.trim() : '';
      if (!S.playerName || !S.nativeLang || !S.targetLang) {
        showNotif('⚠️ Complétez tous les champs !');
        return;
      }
      startMenu();
    });
  }

  console.log('État initial S:', S);
});
