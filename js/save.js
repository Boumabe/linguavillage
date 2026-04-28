// LinguaVillage — save.js
// Sauvegarde et restauration de la progression du joueur
// CHARGÉ EN PREMIER — définit window.S et window._LINGUA_HAS_SAVE

}
var S = window.S;

// Charger sauvegarde si disponible
(function(){
  try {
    var saved = localStorage.getItem('linguavillage_save');
    if (saved) {
      var d = JSON.parse(saved);
      if (d.S) Object.assign(window.S, d.S);
      window._LINGUA_HAS_SAVE = !!(window.S.playerName && window.S.nativeLang && window.S.targetLang);
    }
  } catch(e) {}
})();
  // =================================================================
// INIT GLOBAL — S_missions, S_game, BADGES, SURPRISE_VIDEOS
// =================================================================
if (!window.S_missions) {
  window.S_missions = { completed:{}, gems:0, badges:[], shield:0, freeHints:0 };
}
var S_missions = window.S_missions;

if (!window.S_game) {
  window.S_game = {
    streak:0, bestStreak:0, lastPlayDate:null,
    streakFreezes:1, streakFreezeUsed:false,
    chestsOpened:0, lastChestDate:null,
    zoneBosses:{}, dailyChallenge:null,
    dailyStreak:0, activeBoss:null, secrets:[],
    stats:{ msgSent:0, wordsTyped:0, sessionsPlayed:0 },
  };
}
var G = window.S_game;

// Charger S_missions et S_game depuis la sauvegarde
(function(){
  try {
    var sv = localStorage.getItem('linguavillage_save');
    if (sv) {
      var d = JSON.parse(sv);
      if (d.missions) Object.assign(window.S_missions, d.missions);
      if (d.game)     Object.assign(window.S_game, d.game);
      S_missions = window.S_missions;
      G          = window.S_game;
    }
  } catch(e) {}
})();

var BADGES = [
  {id:'b1', xp:100,  icon:'🌱', fr:'Apprenti',          en:'Apprentice'},
  {id:'b2', xp:300,  icon:'⭐', fr:'Explorateur',       en:'Explorer'},
  {id:'b3', xp:600,  icon:'🏅', fr:'Voyageur',          en:'Traveler'},
  {id:'b4', xp:1000, icon:'🏆', fr:'Champion',          en:'Champion'},
  {id:'b5', xp:2000, icon:'👑', fr:'Maître des langues', en:'Language Master'},
];

var SURPRISE_VIDEOS = {
  fr:[
    {id:'French1.3',                             t:'FSI Français — Unité 1',         diff:'🟢'},
    {id:'LearnToSpeakFrenchVideo1-11',           t:'Learn French — Video 1-11',       diff:'🟢'},
    {id:'ll-french',                             t:"Let's Learn French",              diff:'🟢'},
    {id:'FrenchIntermediateFSI',                 t:'FSI Français Intermédiaire',      diff:'🟡'},
  ],
  en:[
    {id:'FSIEnglishBasic_Vol1',                  t:'FSI English Basic Vol.1',         diff:'🟢'},
    {id:'PeaceCorpsEnglishCourse',               t:'Peace Corps English',             diff:'🟢'},
    {id:'AmericanEnglishIntermediateFSI',        t:'American English Intermediate',   diff:'🟡'},
  ],
  es:[
    {id:'FsiSpanishBasicCourseVolume1Unit01a',   t:'FSI Español Básico Vol.1',        diff:'🟢'},
    {id:'Fsi-SpanishProgrammaticCourse-Volume1', t:'FSI Español Programático',        diff:'🟡'},
  ],
  ht:[
    {id:'HaitianCreoleBasic_Archive',            t:'Kreyòl Ayisyen — Baz',            diff:'🟢'},
    {id:'PaleKreyol_Archive',                    t:'Pale Kreyòl — Salitasyon',        diff:'🟢'},
  ],
  de:[
    {id:'GermanFSI_Basic_Vol1',                  t:'FSI Deutsch Basiskurs Vol.1',     diff:'🟢'},
    {id:'GermanFSI_Intermediate',                t:'FSI Deutsch Mittelstufe',          diff:'🟡'},
  ],
  ru:[
    {id:'RussianFSI_Basic',                      t:'FSI Русский — Базовый',           diff:'🟢'},
    {id:'RussianFSI_Intermediate',               t:'FSI Русский — Средний',           diff:'🟡'},
  ],
  zh:[
    {id:'MandarinFSI_Basic',                     t:'FSI 普通话 基础',                  diff:'🟢'},
    {id:'MandarinFSI_Intermediate',              t:'FSI 普通话 中级',                  diff:'🟡'},
  ],
  ja:[
    {id:'JapaneseFSI_Basic',                     t:'FSI 日本語 基礎',                  diff:'🟢'},
    {id:'JapaneseFSI_Intermediate',              t:'FSI 日本語 中級',                  diff:'🟡'},
  ],
};

// =================================================================
// WELCOME FLOW — dans DOMContentLoaded pour que le DOM existe
// =================================================================
window.addEventListener('DOMContentLoaded', function() {

  // Restaurer session si sauvegarde valide
  if (window._LINGUA_HAS_SAVE) {
    try { applyUI(S.nativeLang); startMenu(); try{checkDailyStreak();}catch(e){} return; } catch(e) {}
  }

  // 1. Langue maternelle
  document.querySelectorAll('.lang-tile[data-native]').forEach(function(t) {
    t.onclick = function() {
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
    };
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
    t.onclick = function() {
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
    };
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

}); // fin DOMContentLoaded welcome flow

// MENU PRINCIPAL
function startMenu() {
