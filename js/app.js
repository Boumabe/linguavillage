// LinguaVillage — app.js
// Point d'entrée principal : welcome flow + startMenu
// CHARGÉ EN DERNIER

window.API = 'https://linguavillage-api--marckensbou2.replit.app';

window.addEventListener('DOMContentLoaded', function() {

  // Restaurer session si sauvegarde valide
  if (window._LINGUA_HAS_SAVE) {
    try { applyUI(S.nativeLang); startMenu(); try{checkDailyStreak();}catch(e){} return; } catch(e) {}
  }

  // 1. Langue maternelle
  document.querySelectorAll('.lang-tile[data-native]').forEach(function(t) {
    t.addEventListener('click', function() {
      document.querySelectorAll('.lang-tile[data-native]').forEach(function(x){ x.classList.remove('active','sel'); });
      this.classList.add('active','sel');
      S.nativeLang = this.dataset.native;
      try { applyUI(S.nativeLang); } catch(e) {}
      // Affiche le champ prénom
      var s2 = document.getElementById('step2');
      if (s2) { s2.style.display='block'; s2.scrollIntoView({behavior:'smooth',block:'center'}); }
      // Cache le reste
      ['step3','step4'].forEach(function(id){
        var el=document.getElementById(id); if(el) el.style.display='none';
      });
      var pb=document.getElementById('playBtn'); if(pb){pb.style.display='none';pb.disabled=true;}
      // Désactive la même langue dans la cible
      document.querySelectorAll('.lang-tile[data-lang]').forEach(function(o){
        var same=o.dataset.lang===S.nativeLang;
        o.classList.toggle('disabled',same);
        if(same) o.classList.remove('active','sel');
      });
      // Focus sur le champ
      var inp=document.getElementById('inputName'); if(inp) setTimeout(function(){inp.focus();},300);
    });
  });

  // 2. Saisie prénom → affiche les langues cibles
  var inputName = document.getElementById('inputName');
  if (inputName) {
    inputName.addEventListener('input', function() {
      var has = this.value.trim().length > 0;
      var s3 = document.getElementById('step3');
      if (s3) s3.style.display = has ? 'block' : 'none';
      var s4 = document.getElementById('step4'); if(s4) s4.style.display='none';
      var pb = document.getElementById('playBtn'); if(pb) pb.style.display='none';
    });
  }

  // 3. Langue cible
  document.querySelectorAll('.lang-tile[data-lang]').forEach(function(t) {
    t.addEventListener('click', function() {
      if (this.classList.contains('disabled')) return;
      document.querySelectorAll('.lang-tile[data-lang]').forEach(function(x){ x.classList.remove('active','sel'); });
      this.classList.add('active','sel');
      S.targetLang = this.dataset.lang;
      var cjk = ['zh','ja','ru'].includes(S.targetLang);
      if (cjk) {
        var s4=document.getElementById('step4'); if(s4) s4.style.display='block';
        var lb={zh:{n:'你好',r:'Nǐ hǎo'},ja:{n:'こんにちは',r:'Konnichiwa'},ru:{n:'Привет',r:'Privyet'}};
        var sn=document.getElementById('sc-n'); if(sn) sn.textContent=lb[S.targetLang].n;
        var sr=document.getElementById('sc-r'); if(sr) sr.textContent=lb[S.targetLang].r;
        var pb=document.getElementById('playBtn'); if(pb){pb.style.display='none';pb.disabled=true;}
      } else {
        S.scriptPref='both';
        var s4=document.getElementById('step4'); if(s4) s4.style.display='none';
        var pb=document.getElementById('playBtn'); if(pb){pb.style.display='block';pb.disabled=false;}
      }
    });
  });

  // 3b. Choix du mode d'écriture (CJK uniquement)
  window.selScript = function(pref, btn) {
    document.querySelectorAll('.sc-btn').forEach(function(b) { b.classList.remove('sel','active'); });
    btn.classList.add('sel','active');
    S.scriptPref = pref;
    var pb = document.getElementById('playBtn');
    if (pb) { pb.style.display = 'block'; pb.disabled = false; }
  };

  // 4. Bouton Commencer
  var playBtnElement = document.getElementById('playBtn');
  if (playBtnElement) {
    playBtnElement.addEventListener('click', function() {
      var nm = document.getElementById('inputName');
      S.playerName = nm ? nm.value.trim() : '';
      if (!S.playerName || !S.nativeLang || !S.targetLang) {
        try{showNotif('⚠️ Complétez tous les champs !');}catch(e){alert('Complétez tous les champs !');}
        return;
      }
      try { if (typeof saveGame==='function') saveGame(); } catch(e) {}
      try { startMenu(); } catch(e) { console.error('startMenu:', e); }
    });
  }

}); // fin DOMContentLoaded

// ================================================================
// MENU PRINCIPAL
// ================================================================
function startMenu() {
  if (!window.S) return;

  var menuPlayer = document.getElementById('menuPlayer');
  var menuLang   = document.getElementById('menuLang');
  var menuXP     = document.getElementById('menuXP');
  var gemDisplay = document.getElementById('gemDisplay');
  var xpFill     = document.getElementById('xpFill');

  if (menuPlayer) menuPlayer.textContent = '👤 ' + S.playerName;
  if (menuLang)   menuLang.textContent   = (FLAGS[S.targetLang]||'') + ' ' + (LANG_NAMES[S.targetLang]||S.targetLang);
  if (menuXP)     menuXP.textContent     = (S.xp||0) + ' XP';
  if (gemDisplay) gemDisplay.textContent = '💎 ' + ((window.S_missions && S_missions.gems)||0);
  if (xpFill)     xpFill.style.width     = ((S.xp||0) % 100) + '%';

  if (typeof saveGame   === 'function') saveGame();
  if (typeof updateStreak === 'function') updateStreak();

  _launchMenu();
}

// ================================================================
// LANCEMENT DU MENU (avec citation si disponible)
// ================================================================
function _launchMenu() {
  if (typeof showDailyQuote === 'function') {
    showDailyQuote(function() { applyMenuUI(); showScreen('screen-menu'); });
  } else {
    applyMenuUI();
    showScreen('screen-menu');
  }
}

// ================================================================
// MISE À JOUR DE L'UI DU MENU
// ================================================================
function applyMenuUI() {
  if (typeof FLAGS === 'undefined' || typeof LANG_NAMES === 'undefined') return;
  var menuLang = document.getElementById('menuLang');
  if (menuLang) menuLang.textContent = (FLAGS[S.targetLang]||'') + ' ' + (LANG_NAMES[S.targetLang]||S.targetLang);
}
