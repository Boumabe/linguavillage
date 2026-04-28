// LinguaVillage — save.js
// Sauvegarde et restauration de la progression du joueur
// CHARGÉ EN PREMIER — définit window.S et window._LINGUA_HAS_SAVE

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
