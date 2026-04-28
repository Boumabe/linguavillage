// LinguaVillage — advanced.js
// Fonctionnalités avancées : oral, flashcards SRS, leaderboard,
// statistiques, rappels intelligents, quiz adaptatif, lieux verrouillés

}









// =================================================================
// ████████╗██████╗  ██████╗ ██╗███████╗
//    ██╔══╝██╔══██╗██╔═══██╗██║██╔════╝
//    ██║   ██████╔╝██║   ██║██║███████╗
//    ██║   ██╔══██╗██║   ██║██║╚════██║
//    ██║   ██║  ██║╚██████╔╝██║███████║
//    ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝╚══════╝
// LinguaVillage — 8 Features Pack
// =================================================================

// ════════════════════════════════════════════════════════════════
// 1. 🎤 RÉPÉTITION ORALE — Score de prononciation
// ════════════════════════════════════════════════════════════════
var _oralTargetWord = '';
var _oralTargetLang = '';
var _oralResolve    = null;

function openOralPractice(word, targetLang) {
  var nl = S.nativeLang || 'fr';
  _oralTargetWord = word;
  _oralTargetLang = targetLang || S.targetLang || 'fr';

  var ov = document.createElement('div');
  ov.id = 'oralOverlay';
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.93);z-index:9700;display:flex;align-items:center;justify-content:center;padding:20px;';
  ov.innerHTML =
    '<div style="background:linear-gradient(135deg,#0f1830,#0a0a14);border:1px solid rgba(78,207,112,0.3);border-radius:22px;padding:26px;max-width:340px;width:100%;text-align:center">'
    +'<div style="font-size:0.62rem;letter-spacing:3px;color:rgba(78,207,112,0.6);margin-bottom:8px">🎤 PRONONCIATION</div>'
    +'<div style="font-size:2rem;font-weight:900;color:#f0e8d0;margin-bottom:4px" id="oralWord">'+escapeHtml(word)+'</div>'
    +'<div style="font-size:0.7rem;color:rgba(255,255,255,0.4);margin-bottom:20px">Prononce ce mot en '+(_oralTargetLang)+'</div>'
    +'<div id="oralMic" style="font-size:4rem;margin-bottom:16px;cursor:pointer;transition:transform .2s" onclick="oralStartListening()">🎤</div>'
    +'<div id="oralStatus" style="font-size:0.78rem;color:rgba(255,255,255,0.5);margin-bottom:10px">Appuie sur le micro pour parler</div>'
    +'<div id="oralScore" style="display:none;margin-bottom:14px"></div>'
    +'<div style="display:flex;gap:8px;justify-content:center">'
    +'<button onclick="speakW(\''+escapeHtml(word).replace(/'/g,"\\'")+'\');gainXP(2)" style="background:rgba(78,207,112,0.1);border:1px solid rgba(78,207,112,0.3);border-radius:10px;padding:7px 14px;color:#4ecf70;font-size:0.75rem;cursor:pointer">🔊 Écouter</button>'
    +'<button onclick="document.getElementById(\'oralOverlay\').remove()" style="background:transparent;border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:7px 14px;color:rgba(255,255,255,0.4);font-size:0.75rem;cursor:pointer">Fermer</button>'
    +'</div></div>';
  document.body.appendChild(ov);
}

function oralStartListening() {
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { showNotif('🎤 Micro non supporté sur ce navigateur'); return; }

  var langMap = {fr:'fr-FR',en:'en-US',es:'es-ES',ht:'fr-HT',de:'de-DE',ru:'ru-RU',zh:'zh-CN',ja:'ja-JP'};
  var mic     = document.getElementById('oralMic');
  var status  = document.getElementById('oralStatus');
  var scoreEl = document.getElementById('oralScore');
  if (!mic || !status) return;

  var rec = new SR();
  rec.lang        = langMap[_oralTargetLang] || 'fr-FR';
  rec.interimResults = false;
  rec.maxAlternatives= 5;

  mic.style.transform = 'scale(1.2)';
  mic.textContent     = '🔴';
  status.textContent  = '🔴 En écoute...';

  rec.onresult = function(e) {
    mic.style.transform = 'scale(1)';
    mic.textContent     = '🎤';

    var spoken = Array.from(e.results[0]).map(function(a){ return a.transcript.toLowerCase().trim(); });
    var target = _oralTargetWord.toLowerCase().trim();
    var score  = _calcPronScore(target, spoken);

    if (scoreEl) {
      scoreEl.style.display = 'block';
      var color = score >= 80 ? '#4ecf70' : score >= 50 ? '#FFD700' : '#e05555';
      var emoji = score >= 80 ? '🏆' : score >= 50 ? '👍' : '💪';
      var msg   = score >= 80 ? 'Excellent!' : score >= 50 ? 'Bien!' : 'Essaie encore!';
      scoreEl.innerHTML =
        '<div style="font-size:2.5rem;margin-bottom:4px">'+emoji+'</div>'
        +'<div style="font-size:2rem;font-weight:900;color:'+color+'">'+score+'%</div>'
        +'<div style="font-size:0.75rem;color:'+color+';margin-bottom:4px">'+msg+'</div>'
        +'<div style="font-size:0.65rem;color:rgba(255,255,255,0.4)">Tu as dit: "'+escapeHtml(spoken[0])+'"</div>';
      if (score > 0) gainXP(Math.round(score / 20));
      if (score >= 80) {
        launchConfetti();
        // Marquer mot comme pratiqué dans SRS
        _srsMarkPracticed(_oralTargetWord, score >= 80);
      }
    }
    status.textContent = '';
  };

  rec.onerror = function() {
    mic.style.transform='scale(1)';
    mic.textContent='🎤';
    status.textContent = '❌ Erreur — réessaie';
  };

  rec.start();
}

function _calcPronScore(target, spokenList) {
  var best = 0;
  spokenList.forEach(function(spoken) {
    var score = _similarity(target, spoken);
    if (score > best) best = score;
  });
  return Math.round(best * 100);
}

function _similarity(a, b) {
  if (a === b) return 1;
  if (!a.length || !b.length) return 0;
  // Algorithme : ratio de caractères communs (Levenshtein simplifié)
  var longer  = a.length > b.length ? a : b;
  var shorter = a.length > b.length ? b : a;
  var len     = longer.length;
  var dist    = _levenshtein(longer, shorter);
  return (len - dist) / len;
}

function _levenshtein(a, b) {
  var matrix = [];
  for (var i = 0; i <= b.length; i++) { matrix[i] = [i]; }
  for (var j = 0; j <= a.length; j++) { matrix[0][j] = j; }
  for (var i = 1; i <= b.length; i++) {
    for (var j = 1; j <= a.length; j++) {
      if (b.charAt(i-1) === a.charAt(j-1)) {
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i-1][j-1]+1,
          matrix[i][j-1]+1,
          matrix[i-1][j]+1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// ════════════════════════════════════════════════════════════════
// 2. 🃏 FLASHCARDS SRS (Spaced Repetition System)
// ════════════════════════════════════════════════════════════════
var _srsData = {}; // {word: {interval, easeFactor, due, reps, lapses}}

function _srsLoad() {
  try {
    var sv = localStorage.getItem('lv_srs');
    if (sv) _srsData = JSON.parse(sv);
  } catch(e) {}
}

function _srsSave() {
  try { localStorage.setItem('lv_srs', JSON.stringify(_srsData)); } catch(e) {}
}

function _srsMarkPracticed(word, correct) {
  if (!_srsData[word]) {
    _srsData[word] = { interval:1, ease:2.5, due:Date.now(), reps:0, lapses:0 };
  }
  var c = _srsData[word];
  var grade = correct ? 4 : 1; // 0-5 scale
  // SM-2 algorithm
  c.ease = Math.max(1.3, c.ease + 0.1 - (5-grade)*(0.08+(5-grade)*0.02));
  if (grade < 3) {
    c.interval = 1;
    c.reps     = 0;
    c.lapses++;
  } else {
    if (c.reps === 0)      c.interval = 1;
    else if (c.reps === 1) c.interval = 6;
    else                    c.interval = Math.round(c.interval * c.ease);
    c.reps++;
  }
  c.due = Date.now() + c.interval * 86400000;
  _srsSave();
}

function _srsGetDueWords(catKey) {
  var cat   = VOCAB[catKey];
  if (!cat) return [];
  var now   = Date.now();
  var words = cat.words.slice();
  // Trier: mots dus en premier, puis nouveaux
  return words.sort(function(a, b) {
    var da = (_srsData[a.n] || {}).due || 0;
    var db = (_srsData[b.n] || {}).due || 0;
    var aOverdue = da <= now;
    var bOverdue = db <= now;
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    return da - db;
  });
}

function openFlashcards(catKey) {
  _srsLoad();
  var cat   = VOCAB[catKey || Object.keys(VOCAB)[0]];
  if (!cat) { showNotif('Aucune catégorie disponible'); return; }
  var words = _srsGetDueWords(catKey || Object.keys(VOCAB)[0]);
  if (!words.length) { showNotif('Aucun mot disponible'); return; }

  var idx     = 0;
  var flipped = false;
  var session = { correct:0, total:0 };
  var nl = S.nativeLang  || 'fr';
  var tl = S.targetLang  || 'en';

  function render() {
    var ov = document.getElementById('flashOverlay');
    if (!ov) return;
    var w    = words[idx];
    var due  = (_srsData[w.n] || {}).due;
    var overdue = due && due <= Date.now();
    var target  = w.t[tl] || w.t.en || w.n;
    var native  = w.t[nl] || w.t.en  || w.n;
    // Clean CJK
    var m      = target.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    var chars  = m ? m[1].trim() : target;
    var roman  = m ? m[2].trim() : '';

    ov.innerHTML =
      '<div style="background:linear-gradient(135deg,#0f1830,#0a0a14);border:1px solid rgba(255,215,0,0.25);border-radius:22px;padding:22px;max-width:360px;width:100%;margin:auto">'
      +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">'
      +'<div style="font-family:Cinzel,serif;font-size:0.9rem;color:#FFD700">🃏 Flashcards</div>'
      +'<div style="display:flex;align-items:center;gap:10px">'
      +'<span style="font-size:0.62rem;color:rgba(255,255,255,0.35)">'+(idx+1)+'/'+words.length+'</span>'
      +'<button onclick="document.getElementById(\'flashOverlay\').remove()" style="background:transparent;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:2px 8px;color:rgba(255,255,255,0.35);font-size:0.65rem;cursor:pointer">✕</button>'
      +'</div></div>'
      // Barre progression
      +'<div style="height:4px;background:rgba(255,255,255,0.07);border-radius:2px;margin-bottom:18px;overflow:hidden">'
      +'<div style="height:100%;width:'+(Math.round((idx/words.length)*100))+'%;background:linear-gradient(90deg,#FFD700,#4ecf70);border-radius:2px"></div>'
      +'</div>'
      // Carte
      +'<div id="flashCard" onclick="flashFlip()" style="background:rgba(255,255,255,0.04);border:2px solid '+(overdue?'rgba(255,100,100,0.3)':'rgba(255,215,0,0.15)')+';border-radius:16px;padding:30px 20px;text-align:center;cursor:pointer;min-height:160px;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:all .3s">'
      +(flipped
        ? '<div style="font-size:1.7rem;font-weight:900;color:#f0e8d0;margin-bottom:8px">'+escapeHtml(chars)+'</div>'
          +(roman?'<div style="font-size:0.85rem;color:rgba(255,215,0,0.6);margin-bottom:8px">'+escapeHtml(roman)+'</div>':'')
          +'<button onclick="event.stopPropagation();speakW(\''+escapeHtml(chars).replace(/'/g,"\\'")+'\');gainXP(1)" style="background:rgba(78,207,112,0.1);border:1px solid rgba(78,207,112,0.3);border-radius:8px;padding:4px 12px;color:#4ecf70;font-size:0.7rem;cursor:pointer;margin-top:6px">🔊 Écouter</button>'
        : '<div style="font-size:0.7rem;color:rgba(255,255,255,0.4);margin-bottom:10px">'+cat.icon+' '+escapeHtml(cat[nl]||cat.fr||'')+'</div>'
          +'<div style="font-size:1.4rem;color:#f0e8d0;font-weight:800">'+escapeHtml(native)+'</div>'
          +'<div style="font-size:0.65rem;color:rgba(255,255,255,0.3);margin-top:12px">Touche pour révéler →</div>')
      +'</div>'
      // Stats session
      +'<div style="display:flex;justify-content:center;gap:16px;margin:14px 0;font-size:0.65rem;color:rgba(255,255,255,0.35)">'
      +'<span>✅ '+session.correct+'</span>'
      +'<span>❌ '+(session.total-session.correct)+'</span>'
      +'<span>🃏 '+session.total+'/'+words.length+'</span>'
      +'</div>'
      // Boutons réponse (visibles seulement après flip)
      +(flipped
        ? '<div style="display:flex;gap:8px">'
          +'<button onclick="flashAnswer(false)" style="flex:1;background:rgba(224,85,85,0.12);border:1px solid rgba(224,85,85,0.3);border-radius:12px;padding:10px;color:#e05555;font-weight:800;cursor:pointer;font-size:0.8rem">❌ Raté</button>'
          +'<button onclick="flashAnswer(true)" style="flex:1;background:rgba(78,207,112,0.12);border:1px solid rgba(78,207,112,0.3);border-radius:12px;padding:10px;color:#4ecf70;font-weight:800;cursor:pointer;font-size:0.8rem">✅ Su!</button>'
          +'</div>'
        : '<button onclick="flashFlip()" style="width:100%;background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.2);border-radius:12px;padding:10px;color:#FFD700;font-weight:800;cursor:pointer;font-size:0.8rem">👁 Révéler</button>')
      +'</div>';
  }

  window.flashFlip = function() {
    flipped = !flipped;
    render();
  };

  window.flashAnswer = function(correct) {
    _srsMarkPracticed(words[idx].n, correct);
    session.total++;
    if (correct) { session.correct++; gainXP(correct ? 3 : 1); }
    flipped = false;
    idx++;
    if (idx >= words.length) {
      // Fin de session
      var ov = document.getElementById('flashOverlay');
      if (!ov) return;
      var pct = session.total ? Math.round((session.correct/session.total)*100) : 0;
      ov.innerHTML = '<div style="background:linear-gradient(135deg,#0f1830,#0a0a14);border:1px solid rgba(255,215,0,0.25);border-radius:22px;padding:30px;max-width:360px;width:100%;margin:auto;text-align:center">'
        +'<div style="font-size:3rem;margin-bottom:10px">'+(pct>=80?'🏆':pct>=50?'⭐':'📚')+'</div>'
        +'<div style="font-family:Cinzel,serif;color:#FFD700;font-size:1.1rem;margin-bottom:6px">Session terminée!</div>'
        +'<div style="font-size:0.88rem;color:#f0e8d0;margin-bottom:4px">'+session.correct+'/'+session.total+' mots sus ('+pct+'%)</div>'
        +'<div style="font-size:0.72rem;color:rgba(255,255,255,0.4);margin-bottom:20px">La répétition espacée planifie tes révisions</div>'
        +'<div style="display:flex;gap:8px;justify-content:center">'
        +'<button onclick="document.getElementById(\'flashOverlay\').remove();openFlashcards(\''+catKey+'\')" style="background:rgba(255,215,0,0.1);border:1px solid #FFD700;border-radius:12px;padding:9px 18px;color:#FFD700;font-weight:800;cursor:pointer;font-size:0.78rem">🔄 Recommencer</button>'
        +'<button onclick="document.getElementById(\'flashOverlay\').remove()" style="background:transparent;border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:9px 18px;color:rgba(255,255,255,0.4);cursor:pointer;font-size:0.78rem">Fermer</button>'
        +'</div></div>';
      if (pct >= 80) launchConfetti();
      return;
    }
    render();
  };

  // Créer l'overlay
  var ov = document.createElement('div');
  ov.id = 'flashOverlay';
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.93);z-index:9600;display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto;';
  document.body.appendChild(ov);
  render();
}

// ════════════════════════════════════════════════════════════════
// 3. 🏆 CLASSEMENT & DÉFIS QUOTIDIENS (amélioré)
// ════════════════════════════════════════════════════════════════
function showLeaderboard() {
  var nl     = S.nativeLang || 'fr';
  var today  = new Date().toISOString().split('T')[0];

  // Charger scores locaux
  var scores = {};
  try { scores = JSON.parse(localStorage.getItem('lv_scores') || '{}'); } catch(e) {}

  // Score du joueur aujourd'hui
  var myScore = scores[today] || { xp:0, words:0, streak:G.streak||0, msgs:G.stats.msgSent||0 };
  myScore.name = S.playerName || 'Joueur';

  var dc = G.dailyChallenge;
  var dcData = null;
  if (dc) {
    var _DC = [
      {id:'dc1',icon:'💬',type:'dialogue',fr:'5 messages envoyés',target:5,reward:{xp:40,gems:1}},
      {id:'dc2',icon:'📖',type:'vocab',   fr:'Voir 10 mots',      target:10,reward:{xp:30,gems:1}},
      {id:'dc3',icon:'🎯',type:'mission', fr:'1 mission',         target:1, reward:{xp:50,gems:2}},
      {id:'dc4',icon:'🎬',type:'cinema',  fr:'1 vidéo',           target:1, reward:{xp:35,gems:1}},
      {id:'dc5',icon:'⭐',type:'xp',      fr:'100 XP',            target:100,reward:{xp:50,gems:2}},
      {id:'dc6',icon:'🔥',type:'streak',  fr:'Streak actif',      target:1, reward:{xp:20,gems:1}},
      {id:'dc7',icon:'💎',type:'boss',    fr:'2 dégâts au boss',  target:2, reward:{xp:80,gems:3}},
    ];
    dcData = _DC.find(function(d){ return d.id===dc.id; });
  }

  var dcProg = dc ? Math.min(100, Math.round(((dc.progress||0)/(dc.target||1))*100)) : 0;

  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.93);z-index:9500;overflow-y:auto;display:flex;align-items:flex-start;justify-content:center;padding:20px;';
  ov.innerHTML =
    '<div style="max-width:380px;width:100%;margin:auto">'
    +'<div style="background:linear-gradient(135deg,#0f1830,#0a0a14);border:1px solid rgba(255,215,0,0.25);border-radius:22px;padding:22px">'
    +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">'
    +'<div style="font-family:Cinzel,serif;font-size:1rem;color:#FFD700">🏆 Classement & Défis</div>'
    +'<button onclick="this.closest(\'div\').parentElement.parentElement.remove()" style="background:transparent;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:2px 8px;color:rgba(255,255,255,0.35);font-size:0.65rem;cursor:pointer">✕</button>'
    +'</div>'
    // Stats joueur
    +'<div style="background:rgba(255,215,0,0.05);border:1px solid rgba(255,215,0,0.15);border-radius:14px;padding:14px;margin-bottom:14px">'
    +'<div style="font-size:0.62rem;color:rgba(255,215,0,0.6);letter-spacing:2px;margin-bottom:10px">TON SCORE AUJOURD\'HUI</div>'
    +'<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">'
    +'<div style="text-align:center"><div style="font-size:1.2rem;font-weight:900;color:#FFD700">'+(S.xp||0)+'</div><div style="font-size:0.58rem;color:rgba(255,255,255,0.35)">XP</div></div>'
    +'<div style="text-align:center"><div style="font-size:1.2rem;font-weight:900;color:#4a9eff">'+(S_missions.gems||0)+'</div><div style="font-size:0.58rem;color:rgba(255,255,255,0.35)">💎</div></div>'
    +'<div style="text-align:center"><div style="font-size:1.2rem;font-weight:900;color:#ff9f43">'+(G.streak||0)+'</div><div style="font-size:0.58rem;color:rgba(255,255,255,0.35)">🔥</div></div>'
    +'<div style="text-align:center"><div style="font-size:1.2rem;font-weight:900;color:#e040fb">'+(G.stats.msgSent||0)+'</div><div style="font-size:0.58rem;color:rgba(255,255,255,0.35)">msgs</div></div>'
    +'</div></div>'
    // Défi quotidien
    +(dcData ? '<div style="background:rgba(78,207,112,0.05);border:1px solid rgba(78,207,112,0.2);border-radius:14px;padding:14px;margin-bottom:14px">'
      +'<div style="font-size:0.62rem;color:rgba(78,207,112,0.7);letter-spacing:2px;margin-bottom:8px">🎯 DÉFI DU JOUR</div>'
      +'<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">'
      +'<span style="font-size:1.5rem">'+dcData.icon+'</span>'
      +'<div style="flex:1">'
      +'<div style="font-weight:800;font-size:0.82rem;color:#f0e8d0">'+escapeHtml(dcData.fr)+'</div>'
      +'<div style="font-size:0.65rem;color:rgba(255,255,255,0.35)">Récompense: +'+dcData.reward.xp+' XP · 💎'+dcData.reward.gems+'</div>'
      +'</div>'
      +(dc.done ? '<span style="color:#4ecf70;font-size:1.2rem">✅</span>' : '')
      +'</div>'
      +'<div style="height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden"><div style="height:100%;width:'+dcProg+'%;background:linear-gradient(90deg,#4ecf70,#4a9eff);border-radius:3px;transition:width .5s"></div></div>'
      +'<div style="font-size:0.6rem;color:rgba(255,255,255,0.3);margin-top:4px">'+((dc.progress||0)+' / '+(dc.target||1))+'</div>'
      +'</div>' : '')
    // Top scores historiques
    +'<div style="font-size:0.62rem;color:rgba(255,255,255,0.3);letter-spacing:2px;margin-bottom:10px">📈 MEILLEURES PERFORMANCES</div>'
    +'<div id="lbList">'+_buildLeaderboard(scores, myScore)+'</div>'
    +'</div></div>';
  document.body.appendChild(ov);

  // Sauvegarder score du jour
  scores[today] = { xp:S.xp||0, words:G.stats.wordsTyped||0, streak:G.streak||0, msgs:G.stats.msgSent||0, name:S.playerName||'Joueur' };
  try { localStorage.setItem('lv_scores', JSON.stringify(scores)); } catch(e) {}
}

function _buildLeaderboard(scores, current) {
  var entries = Object.entries(scores).sort(function(a,b){ return b[1].xp - a[1].xp; }).slice(0,7);
  if (!entries.length) return '<div style="font-size:0.72rem;color:rgba(255,255,255,0.3);text-align:center;padding:12px">Aucun score enregistré</div>';
  return entries.map(function(e,i){
    var date  = e[0];
    var score = e[1];
    var medal = i===0?'🥇':i===1?'🥈':i===2?'🥉':'#'+(i+1);
    return '<div style="display:flex;align-items:center;gap:10px;padding:8px;background:rgba(255,255,255,0.03);border-radius:10px;margin-bottom:5px">'
      +'<span style="font-size:1.1rem;width:28px;text-align:center">'+medal+'</span>'
      +'<div style="flex:1"><div style="font-size:0.78rem;font-weight:800;color:#f0e8d0">'+escapeHtml(score.name||'Joueur')+'</div>'
      +'<div style="font-size:0.6rem;color:rgba(255,255,255,0.3)">'+date+'</div></div>'
      +'<div style="text-align:right"><div style="font-size:0.82rem;font-weight:900;color:#FFD700">'+(score.xp||0)+' XP</div>'
      +'<div style="font-size:0.6rem;color:rgba(255,255,255,0.3)">🔥'+(score.streak||0)+'</div></div>'
      +'</div>';
  }).join('');
}

  // ════════════════════════════════════════════════════════════════
// 4. 🌙 MODE NUIT ADAPTATIF — Village dynamique selon l'heure
// ════════════════════════════════════════════════════════════════
var _shootingStars = [];
var _sunMoonAngle  = 0;
var _lastHourCheck = -1;

function getDetailedTimeOfDay() {
  var h = new Date().getHours();
  var m = new Date().getMinutes();
  var frac = h + m/60;
  if (frac >= 5  && frac < 7)  return 'dawn';
  if (frac >= 7  && frac < 12) return 'morning';
  if (frac >= 12 && frac < 14) return 'noon';
  if (frac >= 14 && frac < 18) return 'afternoon';
  if (frac >= 18 && frac < 20) return 'dusk';
  if (frac >= 20 && frac < 21) return 'evening';
  return 'night';
}

function updateAdaptiveWeather() {
  var h = new Date().getHours();
  if (h === _lastHourCheck) return;
  _lastHourCheck = h;
  var tod = getDetailedTimeOfDay();
  var weatherMap = { dawn:'sun', morning:'sun', noon:'sun', afternoon:'sun', dusk:'sun', evening:'night', night:'night' };
  setWeather(weatherMap[tod]);
  _sunMoonAngle = (h / 24) * Math.PI * 2;
}

function drawAdaptiveSky(ctx, W, H, tick) {
  var tod  = getDetailedTimeOfDay();
  var h    = new Date().getHours();
  var m    = new Date().getMinutes();
  var frac = h + m/60;

  // Ciel gradient selon l'heure
  var sky = ctx.createLinearGradient(0, 0, 0, H * 0.6);
  if (tod === 'dawn') {
    sky.addColorStop(0, '#1a0a3a');
    sky.addColorStop(0.5, '#ff6b35');
    sky.addColorStop(1, '#ffaa55');
  } else if (tod === 'morning') {
    sky.addColorStop(0, '#1a4a8a');
    sky.addColorStop(1, '#4a9aff');
  } else if (tod === 'noon') {
    sky.addColorStop(0, '#0a3070');
    sky.addColorStop(1, '#2a7aff');
  } else if (tod === 'afternoon') {
    sky.addColorStop(0, '#1a3a7a');
    sky.addColorStop(1, '#3a6aee');
  } else if (tod === 'dusk') {
    sky.addColorStop(0, '#2a1a4a');
    sky.addColorStop(0.5, '#ee4433');
    sky.addColorStop(1, '#ff9955');
  } else if (tod === 'evening') {
    sky.addColorStop(0, '#050510');
    sky.addColorStop(1, '#1a1040');
  } else { // night
    sky.addColorStop(0, '#01020a');
    sky.addColorStop(1, '#050520');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H * 0.6);

  // Soleil ou Lune avec position orbitale
  var angle     = ((frac / 24) * Math.PI * 2) - Math.PI / 2;
  var orbitR    = W * 0.42;
  var sunX      = W * 0.5 + Math.cos(angle) * orbitR;
  var sunY      = H * 0.3 + Math.sin(angle) * orbitR * 0.4;
  var isDay     = tod !== 'night' && tod !== 'evening';

  if (sunY < H * 0.55) { // Seulement si visible
    if (isDay) {
      // Soleil avec halo
      var grd = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 30);
      grd.addColorStop(0, tod==='noon'?'#ffffff':'#ffe080');
      grd.addColorStop(0.3, tod==='noon'?'#ffe060':'#ffaa40');
      grd.addColorStop(1, 'rgba(255,180,60,0)');
      ctx.beginPath();
      ctx.arc(sunX, sunY, 30, 0, Math.PI*2);
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sunX, sunY, 14, 0, Math.PI*2);
      ctx.fillStyle = tod==='noon'?'#ffffff':'#ffe080';
      ctx.fill();
    } else {
      // Lune
      ctx.beginPath();
      ctx.arc(sunX, sunY, 13, 0, Math.PI*2);
      ctx.fillStyle = '#f0e0a0';
      ctx.fill();
      // Phase lunaire (croissant)
      ctx.beginPath();
      ctx.arc(sunX+4, sunY, 10, 0, Math.PI*2);
      ctx.fillStyle = tod==='evening'?'#050520':'#01020a';
      ctx.fill();
    }
  }

  // Étoiles la nuit + étoiles filantes
  if (tod === 'night' || tod === 'evening') {
    var opacity = tod === 'night' ? 0.9 : 0.4;
    for (var i = 0; i < 60; i++) {
      var sx = (Math.sin(i*437)*0.5+0.5)*W;
      var sy = (Math.sin(i*293)*0.5+0.5)*H*0.45;
      var tw = 0.4 + 0.5*Math.sin(tick*0.02+i);
      ctx.beginPath();
      ctx.arc(sx, sy, 1+Math.sin(i*127)*0.5, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,255,200,'+(tw*opacity)+')';
      ctx.fill();
    }

    // Étoiles filantes
    if (Math.random() < 0.003) {
      _shootingStars.push({x:Math.random()*W, y:Math.random()*H*0.3, vx:3+Math.random()*4, vy:1+Math.random()*2, life:40});
    }
    _shootingStars = _shootingStars.filter(function(s){ return s.life>0; });
    _shootingStars.forEach(function(s) {
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x-s.vx*6, s.y-s.vy*6);
      ctx.strokeStyle = 'rgba(255,255,200,'+(s.life/40)+')';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      s.x += s.vx; s.y += s.vy; s.life--;
    });
  }

  // Nuages animés le jour
  if (isDay && currentWeather !== 'night') {
    var cloudCount = currentWeather === 'rain' ? 5 : 2;
    for (var c = 0; c < cloudCount; c++) {
      var cx2 = ((tick*0.3+c*W/cloudCount) % (W+200)) - 100;
      var cy2 = H*0.1 + c*30;
      var ca  = currentWeather==='rain'?0.5:0.25;
      ctx.beginPath();
      ctx.ellipse(cx2, cy2, 50, 22, 0, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(220,230,255,'+ca+')';
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx2+30, cy2-8, 35, 18, 0, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(220,230,255,'+ca+')';
      ctx.fill();
    }
  }
}

// Patcher drawVillage pour utiliser le nouveau ciel
var _origDrawVillage = drawVillage;
drawVillage = function() {
  if (!canvas || !ctx) return;
  var W = canvas.width, H = canvas.height;
  var cx = W*0.5, cy = H*0.5;

  // Vérifier changement d'heure toutes les minutes
  updateAdaptiveWeather();

  // Ciel adaptatif
  drawAdaptiveSky(ctx, W, H, tick);

  // Terrain (repris de l'original — pelouse)
  var night2 = currentWeather === 'night' || getDetailedTimeOfDay() === 'night';
  var grass = ctx.createRadialGradient(cx, cy, 0, cx, cy, W*0.55);
  grass.addColorStop(0, night2?'#1a3020':currentWeather==='snow'?'#d0d8e0':'#3a6b30');
  grass.addColorStop(1, night2?'#0a1a0a':currentWeather==='snow'?'#b0b8c0':'#1e3d1a');
  ctx.fillStyle = grass;
  ctx.fillRect(0, 0, W, H);

  // Cercles muraux
  var rings = [{r:0.46,w:6,c:'#6a5030'},{r:0.32,w:5,c:'#7a6040'},{r:0.20,w:4,c:'#8a7050'},{r:0.10,w:3,c:'#c0a870'}];
  rings.forEach(function(ring) {
    ctx.beginPath();
    ctx.arc(cx, cy, ring.r*W, 0, Math.PI*2);
    ctx.strokeStyle = night2?darken(ring.c):ring.c;
    ctx.lineWidth = ring.w;
    ctx.stroke();
  });

  // Routes
  var wallRadii = [W*0.46,W*0.32,W*0.20,W*0.10];
  var wallColors= ['#8a7040','#9a8050','#aa9060','#c0a870'];
  for (var ri=0;ri<4;ri++) {
    var wc = night2?darken(wallColors[ri]):wallColors[ri];
    var diag = [[0.3,0.3],[0.7,0.3],[0.3,0.7],[0.7,0.7]];
    diag.forEach(function(d){
      ctx.beginPath();
      ctx.moveTo(cx,cy);
      ctx.lineTo(d[0]*W,d[1]*H);
      ctx.strokeStyle = 'rgba('+parseInt(wc.slice(1,3),16)+','+parseInt(wc.slice(3,5),16)+','+parseInt(wc.slice(5,7),16)+',0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  // Lieux
  LOCATIONS.forEach(function(loc) {
    var lx = loc.x*W, ly = loc.y*H, lw = loc.w*W, lh = loc.h*H;
    var hov = hoveredLoc && hoveredLoc.id === loc.id;
    var xp  = S.xp || 0;
    var unlocked = !loc.xpMin || xp >= loc.xpMin;
    drawLocWithLock(loc, lx, ly, lw, lh, hov, unlocked);
  });
};

// ════════════════════════════════════════════════════════════════
// 5. 📊 STATISTIQUES DÉTAILLÉES — Graphe progression
// ════════════════════════════════════════════════════════════════
function showDetailedStats() {
  // Charger historique XP
  var history = {};
  try { history = JSON.parse(localStorage.getItem('lv_xp_history') || '{}'); } catch(e) {}

  // Enregistrer XP du jour
  var today = new Date().toISOString().split('T')[0];
  history[today] = S.xp || 0;
  try { localStorage.setItem('lv_xp_history', JSON.stringify(history)); } catch(e) {}

  // Générer les 14 derniers jours
  var days = [];
  for (var d = 13; d >= 0; d--) {
    var dt = new Date(Date.now() - d*86400000).toISOString().split('T')[0];
    days.push({ date:dt, xp:history[dt]||0, label: new Date(Date.now()-d*86400000).toLocaleDateString('fr-FR',{weekday:'short'}) });
  }
  var maxXP = Math.max.apply(null, days.map(function(d){ return d.xp; })) || 100;

  // Statistiques calculées
  var totalDays    = Object.keys(history).length;
  var avgXP        = totalDays ? Math.round(Object.values(history).reduce(function(a,b){return a+b;},0)/totalDays) : 0;
  var wordsLearned = Object.keys(_srsData || {}).length;
  var sessTime     = Math.round((G.stats.sessionsPlayed||0) * 8); // ~8min par session

  // SVG graphe barres
  var bw = 18, gap = 5, gh = 80;
  var svgW = days.length * (bw+gap) + 20;
  var bars  = days.map(function(d,i){
    var bh = maxXP > 0 ? Math.round((d.xp/maxXP)*gh) : 0;
    var by = gh - bh;
    var isToday = d.date === today;
    var color   = isToday ? '#FFD700' : d.xp > 0 ? '#4a9eff' : '#1a1a2e';
    return '<rect x="'+(i*(bw+gap)+10)+'" y="'+by+'" width="'+bw+'" height="'+Math.max(2,bh)+'" fill="'+color+'" rx="3"/>'
      +(isToday?'<rect x="'+(i*(bw+gap)+10+bw/2-1)+'" y="'+(by-6)+'" width="2" height="6" fill="#FFD700"/>':'')
      +'<text x="'+(i*(bw+gap)+10+bw/2)+'" y="'+(gh+12)+'" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="8">'+d.label.slice(0,2)+'</text>';
  }).join('');

  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.93);z-index:9500;overflow-y:auto;display:flex;align-items:flex-start;justify-content:center;padding:20px;';
  ov.innerHTML =
    '<div style="max-width:380px;width:100%;margin:auto">'
    +'<div style="background:linear-gradient(135deg,#0f1830,#0a0a14);border:1px solid rgba(255,215,0,0.22);border-radius:22px;padding:22px">'
    +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">'
    +'<div style="font-family:Cinzel,serif;font-size:1rem;color:#FFD700">📊 Statistiques</div>'
    +'<button onclick="this.closest(\'div\').parentElement.parentElement.remove()" style="background:transparent;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:2px 8px;color:rgba(255,255,255,0.35);font-size:0.65rem;cursor:pointer">✕</button>'
    +'</div>'
    // Graphe 14 jours
    +'<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:14px;margin-bottom:14px;overflow-x:auto">'
    +'<div style="font-size:0.62rem;color:rgba(255,215,0,0.6);letter-spacing:2px;margin-bottom:10px">XP — 14 DERNIERS JOURS</div>'
    +'<svg viewBox="0 0 '+(svgW)+' '+(gh+20)+'" style="width:100%;min-width:260px;height:'+(gh+20)+'px">'+bars+'</svg>'
    +'</div>'
    // Stats grille
    +'<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:14px">'
    +_statBox('XP Total', S.xp||0, '⭐', '#FFD700')
    +_statBox('Moy./jour', avgXP+' XP', '📈', '#4a9eff')
    +_statBox('Mots SRS', wordsLearned, '🃏', '#e040fb')
    +_statBox('Streak', (G.streak||0)+' jours', '🔥', '#ff9f43')
    +_statBox('Sessions', G.stats.sessionsPlayed||0, '🎮', '#4ecf70')
    +_statBox('Temps ~', sessTime+'min', '⏱', '#FFD700')
    +_statBox('Messages', G.stats.msgSent||0, '💬', '#4a9eff')
    +_statBox('Gemmes', S_missions.gems||0, '💎', '#e040fb')
    +'</div>'
    // Langues pratiquées
    +'<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:12px;margin-bottom:12px">'
    +'<div style="font-size:0.62rem;color:rgba(255,255,255,0.35);letter-spacing:2px;margin-bottom:8px">LANGUE PRATIQUÉE</div>'
    +'<div style="font-size:1.1rem">'+((FLAGS||{})[S.targetLang]||'🌍')+' <span style="font-size:0.82rem;color:#f0e8d0;font-weight:800">'+((LANG_NAMES||{})[S.targetLang]||S.targetLang||'—')+'</span></div>'
    +'</div>'
    // Bouton flashcards
    +'<button onclick="this.closest(\'div\').parentElement.parentElement.remove();openFlashcards(Object.keys(VOCAB)[0])" style="width:100%;background:rgba(224,64,251,0.08);border:1px solid rgba(224,64,251,0.25);border-radius:12px;padding:10px;color:#e040fb;font-weight:800;cursor:pointer;font-size:0.78rem">🃏 Lancer les Flashcards SRS</button>'
    +'</div></div>';
  document.body.appendChild(ov);
}

function _statBox(label, val, icon, color) {
  return '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:10px">'
    +'<div style="font-size:0.95rem;font-weight:900;color:'+color+'">'+icon+' '+escapeHtml(String(val))+'</div>'
    +'<div style="font-size:0.6rem;color:rgba(255,255,255,0.32);margin-top:2px">'+escapeHtml(label)+'</div>'
    +'</div>';
}

// ════════════════════════════════════════════════════════════════
// 6. 🔔 RAPPELS INTELLIGENTS — PWA Notifications
// ════════════════════════════════════════════════════════════════
var _notifCheckInterval = null;

function initSmartReminders() {
  // Vérifier si les notifications sont supportées
  if (!('Notification' in window)) return;

  // Vérifier si c'est le bon moment pour notifier (app pas ouverte depuis >4h)
  var lastOpen = parseInt(localStorage.getItem('lv_last_open') || '0', 10);
  var now      = Date.now();
  localStorage.setItem('lv_last_open', now);

  if (lastOpen > 0 && (now - lastOpen) > 4 * 3600000) {
    // Plus de 4h — proposer d'activer les rappels
    var asked = localStorage.getItem('lv_notif_asked');
    if (!asked) _proposeNotifications();
  }

  // Interval de vérification chaque 30min
  if (_notifCheckInterval) clearInterval(_notifCheckInterval);
  _notifCheckInterval = setInterval(function() {
    localStorage.setItem('lv_last_open', Date.now());
  }, 30 * 60000);
}

function _proposeNotifications() {
  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:9999;max-width:320px;width:90%;';
  ov.innerHTML =
    '<div style="background:linear-gradient(135deg,#0f1830,#0a0a14);border:1px solid rgba(255,215,0,0.3);border-radius:16px;padding:16px;box-shadow:0 8px 32px rgba(0,0,0,0.5)">'
    +'<div style="font-size:0.85rem;font-weight:800;color:#FFD700;margin-bottom:4px">🔔 Rappels d\'apprentissage</div>'
    +'<div style="font-size:0.72rem;color:rgba(255,255,255,0.55);margin-bottom:12px">Reçois un rappel si tu n\'as pas pratiqué depuis 4h</div>'
    +'<div style="display:flex;gap:8px">'
    +'<button onclick="requestNotifPermission();this.closest(\'div\').parentElement.remove()" style="flex:1;background:rgba(255,215,0,0.12);border:1px solid #FFD700;border-radius:10px;padding:8px;color:#FFD700;font-weight:800;font-size:0.72rem;cursor:pointer">✅ Activer</button>'
    +'<button onclick="localStorage.setItem(\'lv_notif_asked\',\'no\');this.closest(\'div\').parentElement.remove()" style="background:transparent;border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:8px 12px;color:rgba(255,255,255,0.35);font-size:0.72rem;cursor:pointer">Non merci</button>'
    +'</div></div>';
  document.body.appendChild(ov);
  setTimeout(function(){ if(ov.parentElement) ov.remove(); }, 8000);
}

function requestNotifPermission() {
  localStorage.setItem('lv_notif_asked', 'yes');
  Notification.requestPermission().then(function(perm) {
    if (perm === 'granted') {
      showNotif('🔔 Rappels activés!');
      _scheduleReminder();
    }
  });
}

function _scheduleReminder() {
  // Envoyer une notification après 4h d'inactivité simulée
  setTimeout(function() {
    var lastOpen = parseInt(localStorage.getItem('lv_last_open')||'0', 10);
    if (Date.now() - lastOpen > 4*3600000 && Notification.permission === 'granted') {
      new Notification('🌍 LinguaVillage t\'attend!', {
        body: 'Tu n\'as pas pratiqué depuis ' + Math.round((Date.now()-lastOpen)/3600000) + 'h. Ton streak de '+(G.streak||0)+' jours t\'attend! 🔥',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌍</text></svg>'
      });
    }
  }, 4 * 3600000);
}

function openReminderSettings() {
  var current = localStorage.getItem('lv_notif_asked') || 'no';
  var perm    = ('Notification' in window) ? Notification.permission : 'unavailable';
  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9500;display:flex;align-items:center;justify-content:center;padding:20px;';
  ov.innerHTML =
    '<div style="background:linear-gradient(135deg,#0f1830,#0a0a14);border:1px solid rgba(255,165,0,0.3);border-radius:22px;padding:24px;max-width:340px;width:100%">'
    +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">'
    +'<div style="font-family:Cinzel,serif;font-size:0.95rem;color:#ff9f43">🔔 Rappels</div>'
    +'<button onclick="this.closest(\'div\').parentElement.remove()" style="background:transparent;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:2px 8px;color:rgba(255,255,255,0.35);font-size:0.65rem;cursor:pointer">✕</button>'
    +'</div>'
    +'<div style="font-size:0.75rem;color:rgba(255,255,255,0.5);margin-bottom:14px">Permission: <span style="color:'+(perm==='granted'?'#4ecf70':perm==='denied'?'#e05555':'#FFD700')+'">'+perm+'</span></div>'
    +'<div style="display:flex;flex-direction:column;gap:8px">'
    +(perm !== 'granted'
      ? '<button onclick="requestNotifPermission()" style="background:rgba(255,165,0,0.1);border:1px solid #ff9f43;border-radius:12px;padding:10px;color:#ff9f43;font-weight:800;cursor:pointer;font-size:0.8rem">🔔 Activer les rappels</button>'
      : '<div style="background:rgba(78,207,112,0.08);border:1px solid rgba(78,207,112,0.25);border-radius:12px;padding:10px;font-size:0.75rem;color:#4ecf70;text-align:center">✅ Notifications activées</div>')
    +'<div style="font-size:0.7rem;color:rgba(255,255,255,0.35);text-align:center;padding-top:6px">Rappel envoyé après 4h sans ouvrir l\'app</div>'
    +'</div></div>';
  document.body.appendChild(ov);
}

// ════════════════════════════════════════════════════════════════
// 7. 🎯 QUIZ ADAPTATIF — après dialogue NPC
// ════════════════════════════════════════════════════════════════
var _quizWordPool = [];

function collectWordsFromConversation(text) {
  // Extraire les mots de la langue cible depuis l'historique de chat
  var tl = S.targetLang || 'en';
  var cat = VOCAB[Object.keys(VOCAB)[0]];
  if (!cat) return;
  var allWords = [];
  Object.values(VOCAB).forEach(function(c){ allWords = allWords.concat(c.words||[]); });

  var lower = text.toLowerCase();
  var found = allWords.filter(function(w){
    var t = (w.t[tl]||'').toLowerCase();
    return t && t.length > 2 && lower.includes(t.split('(')[0].trim());
  });
  found.forEach(function(w){ if (!_quizWordPool.some(function(x){return x.n===w.n;})) _quizWordPool.push(w); });
  if (_quizWordPool.length > 8) _quizWordPool = _quizWordPool.slice(-8);
}

function launchAdaptiveQuiz() {
  var nl   = S.nativeLang || 'fr';
  var tl   = S.targetLang || 'en';
  var pool = _quizWordPool.slice();

  if (pool.length < 2) {
    // Pas assez de mots de la conv → prendre des mots aléatoires du vocab
    var allWords = [];
    Object.values(VOCAB).forEach(function(c){ allWords = allWords.concat(c.words||[]); });
    while (pool.length < 4 && allWords.length > 0) {
      var pick = allWords.splice(Math.floor(Math.random()*allWords.length), 1)[0];
      if (!pool.some(function(x){return x.n===pick.n;})) pool.push(pick);
    }
  }
  if (pool.length < 2) { showNotif('Pas assez de mots pour le quiz'); return; }

  // Générer 3 questions depuis le pool
  var questions = pool.slice(0, Math.min(3, pool.length)).map(function(w) {
    var correct = w.t[tl] || w.t.en || w.n;
    // Mauvaises réponses
    var allWords2 = [];
    Object.values(VOCAB).forEach(function(c){ allWords2 = allWords2.concat(c.words||[]); });
    var wrongs = allWords2.filter(function(x){return x.n!==w.n && (x.t[tl]||x.t.en);})
      .sort(function(){return Math.random()-0.5;}).slice(0,3)
      .map(function(x){ return x.t[tl]||x.t.en||x.n; });
    while (wrongs.length < 3) wrongs.push('???');
    var opts = [correct].concat(wrongs).sort(function(){return Math.random()-0.5;});
    return { q: w.t[nl]||w.t.en||w.n, answer: correct, opts: opts };
  });

  var current = 0, score = 0;
  var ov = document.createElement('div');
  ov.id = 'adaptQuizOv';
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.93);z-index:9800;display:flex;align-items:center;justify-content:center;padding:20px;';

  function renderQ() {
    var q = questions[current];
    ov.innerHTML =
      '<div style="background:linear-gradient(135deg,#0f1830,#0a0a14);border:1px solid rgba(74,158,255,0.3);border-radius:22px;padding:24px;max-width:340px;width:100%">'
      +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">'
      +'<div style="font-family:Cinzel,serif;font-size:0.88rem;color:#4a9eff">🎯 Quiz du dialogue</div>'
      +'<span style="font-size:0.65rem;color:rgba(255,255,255,0.35)">'+(current+1)+'/'+questions.length+'</span>'
      +'</div>'
      +'<div style="height:4px;background:rgba(255,255,255,0.07);border-radius:2px;margin-bottom:18px;overflow:hidden">'
      +'<div style="height:100%;width:'+Math.round((current/questions.length)*100)+'%;background:#4a9eff;border-radius:2px"></div>'
      +'</div>'
      +'<div style="font-size:0.72rem;color:rgba(255,255,255,0.4);margin-bottom:8px">Comment dit-on en '+tl+' :</div>'
      +'<div style="font-size:1.2rem;font-weight:900;color:#f0e8d0;margin-bottom:20px;text-align:center">'+escapeHtml(q.q)+'</div>'
      +'<div style="display:flex;flex-direction:column;gap:8px">'
      +q.opts.map(function(opt,i){
        return '<button data-opt="'+i+'" onclick="adaptQuizAnswer(this,\''+escapeHtml(opt).replace(/'/g,"\\'")+'\')" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:11px;color:#f0e8d0;font-size:0.82rem;cursor:pointer;text-align:left;transition:all .2s">'+escapeHtml(opt)+'</button>';
      }).join('')
      +'</div></div>';
    document.body.appendChild(ov);
  }

  window.adaptQuizAnswer = function(btn, chosen) {
    var q = questions[current];
    var correct = chosen === q.answer;
    btn.style.background = correct ? 'rgba(78,207,112,0.2)' : 'rgba(224,85,85,0.2)';
    btn.style.borderColor = correct ? '#4ecf70' : '#e05555';
    // Montrer la bonne réponse
    ov.querySelectorAll('button').forEach(function(b){
      if (b.textContent.trim() === q.answer) { b.style.background='rgba(78,207,112,0.2)'; b.style.borderColor='#4ecf70'; }
      b.disabled = true;
    });
    if (correct) score++;
    _srsMarkPracticed(questions[current].q, correct);
    setTimeout(function(){
      current++;
      if (current >= questions.length) {
        var pct = Math.round((score/questions.length)*100);
        ov.innerHTML =
          '<div style="background:linear-gradient(135deg,#0f1830,#0a0a14);border:1px solid rgba(74,158,255,0.3);border-radius:22px;padding:28px;max-width:340px;width:100%;text-align:center">'
          +'<div style="font-size:2.8rem;margin-bottom:8px">'+(pct>=80?'🏆':pct>=50?'⭐':'📚')+'</div>'
          +'<div style="font-family:Cinzel,serif;color:#4a9eff;font-size:1rem;margin-bottom:5px">Quiz terminé!</div>'
          +'<div style="font-size:1.4rem;font-weight:900;color:#f0e8d0;margin-bottom:4px">'+score+'/'+questions.length+'</div>'
          +'<div style="font-size:0.78rem;color:#4ecf70;margin-bottom:18px;font-weight:800">+'+score*15+' XP</div>'
          +'<button onclick="document.getElementById(\'adaptQuizOv\').remove()" style="background:linear-gradient(135deg,#1a3a8a,#4a9eff);border:none;border-radius:13px;padding:11px 26px;font-family:Cinzel,serif;font-weight:700;cursor:pointer;font-size:0.85rem;color:#fff">Super! 🎉</button>'
          +'</div>';
        gainXP(score*15);
        if (pct >= 80) launchConfetti();
        _quizWordPool = [];
      } else {
        renderQ();
      }
    }, 800);
  };

  renderQ();
}

// Hook dans sendMsg pour collecter les mots
var _origOnMessageSent = typeof onMessageSent === 'function' ? onMessageSent : null;
onMessageSent = function(text) {
  if (_origOnMessageSent) _origOnMessageSent(text);
  collectWordsFromConversation(text);
  // Proposer le quiz après 5 messages
  var msgs = G.stats.msgSent || 0;
  if (msgs > 0 && msgs % 5 === 0 && _quizWordPool.length >= 2) {
    setTimeout(function() {
      var ov2 = document.createElement('div');
      ov2.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:9400;max-width:300px;width:90%;';
      ov2.innerHTML = '<div style="background:rgba(74,158,255,0.15);border:1px solid rgba(74,158,255,0.4);border-radius:14px;padding:12px;display:flex;align-items:center;gap:12px;cursor:pointer" onclick="this.parentElement.remove();launchAdaptiveQuiz()">'
        +'<span style="font-size:1.5rem">🎯</span>'
        +'<div><div style="font-size:0.78rem;font-weight:800;color:#4a9eff">Quiz rapide disponible!</div>'
        +'<div style="font-size:0.65rem;color:rgba(255,255,255,0.45)">Teste les mots de ce dialogue →</div></div>'
        +'</div>';
      document.body.appendChild(ov2);
      setTimeout(function(){ if(ov2.parentElement) ov2.remove(); }, 5000);
    }, 1500);
  }
};

// ════════════════════════════════════════════════════════════════
// 8. 🗺️ CARTE — Lieux verrouillés visuellement avec cadenas
// ════════════════════════════════════════════════════════════════

// Mapping lieux → XP requis
var LOC_XP_REQUIREMENTS = {
  church:   0,   school:  0,   friends: 0,
  market:   50,  tavern:  50,  park:    50,
  hospital: 150, bank:    150, station: 150,
  police:   300, factory: 300, cinema:  400,
};

function drawLocWithLock(loc, x, y, w, h, hov, unlocked) {
  if (!ctx) return;
  var a    = hov ? 1 : 0.85;
  var isNight = currentWeather === 'night' || getDetailedTimeOfDay()==='night';
  var r    = Math.min(w, h) * 0.5;
  var bx   = x + w * 0.5, by = y + h * 0.5;

  // Ombre
  ctx.beginPath();
  ctx.arc(bx+3, by+4, r, 0, Math.PI*2);
  ctx.fillStyle = 'rgba(0,0,0,0.30)';
  ctx.fill();

  if (!unlocked) {
    // Lieu verrouillé — gris avec cadenas
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI*2);
    ctx.fillStyle = isNight ? 'rgba(20,20,30,0.8)' : 'rgba(40,40,60,0.7)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(100,100,140,0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Emoji cadenas
    ctx.font = Math.round(r*0.9)+'px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(150,150,200,0.7)';
    ctx.fillText('🔒', bx, by);
    // XP requis
    var xpReq = LOC_XP_REQUIREMENTS[loc.id] || 0;
    if (xpReq > 0) {
      ctx.font = 'bold '+(Math.round(r*0.35))+'px sans-serif';
      ctx.fillStyle = 'rgba(200,180,100,0.8)';
      ctx.fillText(xpReq+' XP', bx, by+r*0.75);
    }
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  } else {
    // Lieu débloqué — rendu normal enrichi
    // Halo couleur + animation hover
    if (hov) {
      ctx.beginPath();
      ctx.arc(bx, by, r+5, 0, Math.PI*2);
      ctx.fillStyle = hexA(loc.color, 0.15);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI*2);
    ctx.fillStyle = hexA(loc.color, a*(isNight?0.7:1));
    ctx.fill();
    if (hov) {
      ctx.beginPath();
      ctx.arc(bx, by, r, 0, Math.PI*2);
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(bx, by, r, 0, Math.PI*2);
      ctx.strokeStyle = hexA(darken(loc.color), isNight?0.3:0.6);
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    // Emoji lieu
    ctx.font = Math.round(r*1.05)+'px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,255,255,'+(isNight?0.7:1)+')';
    var bob = Math.sin(tick*0.025+loc.x*10)*1.5;
    ctx.fillText(loc.emoji, bx, by+bob);

    // Nom du lieu
    ctx.font = 'bold '+(Math.round(r*0.38))+'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = isNight?'rgba(255,255,200,0.65)':'rgba(255,255,255,0.8)';
    var nm = LOC_NAMES[loc.id] ? (LOC_NAMES[loc.id][S.nativeLang||'fr']||loc.id) : loc.id;
    ctx.fillText(nm, bx, by+r+4);

    // Point vert si missions disponibles
    var mForLoc = _MISSIONS_DATA && _MISSIONS_DATA[loc.id];
    if (mForLoc && mForLoc.length > 0) {
      var doneAll = mForLoc.every(function(m){ return S_missions.completed && S_missions.completed[m.id]; });
      if (!doneAll) {
        ctx.beginPath();
        ctx.arc(bx+r*0.7, by-r*0.7, r*0.18, 0, Math.PI*2);
        ctx.fillStyle = '#4ecf70';
        ctx.fill();
      }
    }

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }
}

// Patcher onVillageClick pour bloquer les lieux verrouillés
var _origOnVillageClick = onVillageClick;
onVillageClick = function(e) {
  var rect = canvas.getBoundingClientRect();
  var loc  = getLocAt(e.clientX - rect.left, e.clientY - rect.top);
  if (loc) {
    var xpReq = LOC_XP_REQUIREMENTS[loc.id] || 0;
    if ((S.xp||0) < xpReq) {
      showNotif('🔒 '+((LOC_NAMES[loc.id]&&LOC_NAMES[loc.id][S.nativeLang||'fr'])||loc.id)+' — '+xpReq+' XP requis');
      return;
    }
  }
  _origOnVillageClick(e);
};

var _origOnVillageTouch = onVillageTouch;
onVillageTouch = function(e) {
  var rect = canvas.getBoundingClientRect();
  var t    = e.touches[0];
  var loc  = getLocAt(t.clientX - rect.left, t.clientY - rect.top);
  if (loc) {
    var xpReq = LOC_XP_REQUIREMENTS[loc.id] || 0;
    if ((S.xp||0) < xpReq) {
      showNotif('🔒 '+((LOC_NAMES[loc.id]&&LOC_NAMES[loc.id][S.nativeLang||'fr'])||loc.id)+' — '+xpReq+' XP requis');
      return;
    }
  }
  _origOnVillageTouch(e);
};

// ════════════════════════════════════════════════════════════════
// INITIALISATION DES 8 FONCTIONNALITÉS
// ════════════════════════════════════════════════════════════════
(function initAllFeatures() {
  _srsLoad();
  initSmartReminders();

  // Enregistrer XP quotidien toutes les 5min
  setInterval(function() {
    var today = new Date().toISOString().split('T')[0];
    var history = {};
    try { history = JSON.parse(localStorage.getItem('lv_xp_history')||'{}'); } catch(e) {}
    history[today] = S.xp || 0;
    try { localStorage.setItem('lv_xp_history', JSON.stringify(history)); } catch(e) {}
  }, 5*60000);

  // Mettre à jour le ciel toutes les minutes
  setInterval(updateAdaptiveWeather, 60000);

  console.log('✅ LinguaVillage Features Pack — 8 systèmes chargés');
})();

