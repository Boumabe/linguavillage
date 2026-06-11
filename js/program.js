// LinguaVillage — program.js
// Écran "Programme" : roadmap complète visible par l'utilisateur
// Affiche les leçons, leur état (verrouillé/disponible/évaluation/validé),
// les grands examens et le niveau actuel
// ================================================================

window.LV_PROGRAM = (function () {

  // ================================================================
  // OUVERTURE DE L'ÉCRAN PROGRAMME
  // ================================================================
  function open() {
    var C  = window.LV_CURRICULUM;
    if (!C) { if (typeof showNotif === 'function') showNotif('❌ Curriculum non chargé'); return; }

    var nl      = (window.S && window.S.nativeLang)  || 'fr';
    var tl      = (window.S && window.S.targetLang)  || 'en';
    var prog    = C.getProgress();
    var levels  = ['beginner', 'intermediate', 'advanced'];

    // Retirer l'overlay précédent s'il existe
    var old = document.getElementById('lv-program-overlay');
    if (old) old.remove();

    var overlay = document.createElement('div');
    overlay.id  = 'lv-program-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:7000;background:#090c15;display:flex;flex-direction:column;animation:progFadeIn 0.25s ease;';
    overlay.innerHTML = '<style>@keyframes progFadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}</style>';

    // ── Header ────────────────────────────────────────────────
    var tnames = { fr:'Français', en:'English', es:'Español', ht:'Kreyòl', de:'Deutsch', ru:'Русский', zh:'中文', ja:'日本語' };
    var flags  = { fr:'🇫🇷', en:'🇬🇧', es:'🇪🇸', ht:'🇭🇹', de:'🇩🇪', ru:'🇷🇺', zh:'🇨🇳', ja:'🇯🇵' };
    var titles = { fr:'Programme d\'apprentissage', en:'Learning Program', es:'Programa de aprendizaje', ht:'Pwogram aprantisaj', de:'Lernprogramm', ru:'Программа обучения', zh:'学习计划', ja:'学習プログラム' };

    var header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;gap:12px;padding:14px 16px;background:rgba(255,255,255,0.03);border-bottom:1px solid rgba(255,255,255,0.06);flex-shrink:0;';
    header.innerHTML = '<button id="lv-prog-back" style="background:rgba(255,255,255,0.06);border:none;border-radius:50%;width:36px;height:36px;color:#e8e0d0;font-size:1rem;cursor:pointer;">←</button>'
      + '<div style="flex:1;">'
      + '<div style="font-family:Cinzel,serif;font-weight:800;font-size:0.95rem;color:#ffd700;">' + (titles[nl] || titles.fr) + '</div>'
      + '<div style="font-size:0.68rem;color:rgba(255,255,255,0.35);">' + (flags[tl] || '') + ' ' + (tnames[tl] || tl) + '</div>'
      + '</div>'
      + '<div id="lv-prog-xp" style="font-size:0.8rem;font-weight:800;color:#ffd700;background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.18);padding:4px 12px;border-radius:999px;">' + ((window.S && window.S.xp) || 0) + ' XP</div>';
    overlay.appendChild(header);

    // ── Corps scrollable ─────────────────────────────────────
    var body = document.createElement('div');
    body.id  = 'lv-program-body';
    body.style.cssText = 'flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:20px;';
    overlay.appendChild(body);

    document.body.appendChild(overlay);

    // Back button
    document.getElementById('lv-prog-back').onclick = function () {
      overlay.remove();
    };

    // ── Construire chaque niveau ─────────────────────────────
    levels.forEach(function (levelId) {
      var level       = C.LEVELS[levelId];
      var lessons     = C.getLessons(levelId);
      var levelProg   = C.getLevelProgress(levelId);
      var isUnlocked  = prog.unlockedLevels && prog.unlockedLevels.includes(levelId);
      var isCurrent   = prog.currentLevel === levelId;
      var grandExam   = C.getGrandExam(levelId);
      var examUnlocked= C.isGrandExamUnlocked(levelId);
      var examPassed  = prog.grandExams && prog.grandExams[levelId] && prog.grandExams[levelId].passed;

      // Section niveau
      var section = document.createElement('div');
      section.style.cssText = 'border-radius:20px;overflow:hidden;border:1.5px solid ' + (isUnlocked ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)') + ';opacity:' + (isUnlocked ? '1' : '0.45') + ';';

      // Header du niveau
      var lvHeader = document.createElement('div');
      lvHeader.style.cssText = 'padding:14px 16px;background:' + (isCurrent ? 'rgba(' + _hexToRgb(level.color) + ',0.10)' : 'rgba(255,255,255,0.03)') + ';border-bottom:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;gap:12px;';
      var lvLabels = { beginner: { fr:'Débutant', en:'Beginner', es:'Principiante', ht:'Debitant', de:'Anfänger', ru:'Начальный', zh:'初级', ja:'初級' }, intermediate: { fr:'Intermédiaire', en:'Intermediate', es:'Intermedio', ht:'Entèmedyè', de:'Mittelstufe', ru:'Средний', zh:'中级', ja:'中級' }, advanced: { fr:'Avancé', en:'Advanced', es:'Avanzado', ht:'Avanse', de:'Fortgeschritten', ru:'Продвинутый', zh:'高级', ja:'上級' } };
      var lvLabel  = (lvLabels[levelId] && (lvLabels[levelId][nl] || lvLabels[levelId].fr)) || levelId;
      var refDur   = { fr:'~6 mois d\'usage régulier', en:'~6 months regular use', es:'~6 meses de uso regular', ht:'~6 mwa itilizasyon regilye', de:'~6 Monate regelmäßige Nutzung', ru:'~6 месяцев регулярного использования', zh:'~6个月定期学习', ja:'~6ヶ月の定期利用' };

      lvHeader.innerHTML = '<div style="font-size:1.6rem;">' + level.icon + '</div>'
        + '<div style="flex:1;">'
        + '<div style="font-family:Cinzel,serif;font-weight:800;font-size:0.95rem;color:' + level.color + ';">' + lvLabel + '</div>'
        + '<div style="font-size:0.65rem;color:rgba(255,255,255,0.3);">' + (refDur[nl] || refDur.fr) + '</div>'
        + '</div>'
        + (isCurrent ? '<div style="font-size:0.62rem;font-weight:800;background:rgba(' + _hexToRgb(level.color) + ',0.15);color:' + level.color + ';padding:3px 9px;border-radius:8px;">EN COURS</div>' : '')
        + (examPassed ? '<div style="font-size:0.62rem;font-weight:800;background:rgba(78,207,112,0.15);color:#4ecf70;padding:3px 9px;border-radius:8px;">✅ VALIDÉ</div>' : '')
        + (!isUnlocked ? '<div style="font-size:1rem;">🔒</div>' : '')
        + '<div style="font-size:0.75rem;font-weight:800;color:' + level.color + ';">' + levelProg + '%</div>';

      // Barre de progression du niveau
      var lvProg = document.createElement('div');
      lvProg.style.cssText = 'height:3px;background:rgba(255,255,255,0.06);';
      lvProg.innerHTML = '<div style="height:100%;width:' + levelProg + '%;background:' + level.color + ';transition:width 0.6s ease;"></div>';

      section.appendChild(lvHeader);
      section.appendChild(lvProg);

      // Liste des leçons
      var lessonsList = document.createElement('div');
      lessonsList.style.cssText = 'padding:8px;display:flex;flex-direction:column;gap:6px;';

      lessons.forEach(function (lesson, lIdx) {
        var evalUnlocked = C.isEvalUnlocked(levelId, lesson.id);
        var evalPassed   = C.isEvalPassed(levelId, lesson.id);
        var lessonKey    = levelId + '.' + lesson.id;
        var lessonData   = (prog.lessons && prog.lessons[lessonKey]) || {};
        var xpEarned     = lessonData.xpEarned || 0;
        var xpNeeded     = lesson.xpToUnlockEval;
        var lessonTitle  = lesson.title[nl] || lesson.title.fr;
        var lessonDesc   = lesson.desc[nl]  || lesson.desc.fr;

        var lCard = document.createElement('div');
        lCard.style.cssText = 'display:flex;align-items:flex-start;gap:12px;padding:12px 12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;transition:all 0.2s;cursor:' + (isUnlocked ? 'pointer' : 'default') + ';';

        // État visuel
        var stateIcon = evalPassed ? '✅' : evalUnlocked ? '🎯' : '📚';
        var stateColor = evalPassed ? '#4ecf70' : evalUnlocked ? '#ffd700' : 'rgba(255,255,255,0.25)';

        // Barre de progression XP de la leçon
        var xpPct  = Math.min(100, Math.round((xpEarned / xpNeeded) * 100));

        lCard.innerHTML = '<div style="font-size:1.4rem;flex-shrink:0;margin-top:2px;">' + lesson.icon + '</div>'
          + '<div style="flex:1;min-width:0;">'
          + '<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">'
          + '<span style="font-weight:800;font-size:0.85rem;color:#f0e8d0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + (window.escapeHtml ? window.escapeHtml(lessonTitle) : lessonTitle) + '</span>'
          + '<span style="margin-left:auto;font-size:0.9rem;flex-shrink:0;">' + stateIcon + '</span>'
          + '</div>'
          + '<div style="font-size:0.68rem;color:rgba(255,255,255,0.35);margin-bottom:6px;line-height:1.4;">' + (window.escapeHtml ? window.escapeHtml(lessonDesc) : lessonDesc) + '</div>'
          + '<div style="display:flex;align-items:center;gap:8px;">'
          + '<div style="flex:1;height:4px;background:rgba(255,255,255,0.06);border-radius:4px;overflow:hidden;">'
          + '<div style="height:100%;width:' + xpPct + '%;background:' + stateColor + ';border-radius:4px;transition:width 0.5s;"></div>'
          + '</div>'
          + '<span style="font-size:0.6rem;color:rgba(255,255,255,0.28);white-space:nowrap;">' + xpEarned + '/' + xpNeeded + ' XP</span>'
          + '</div>'
          + (evalUnlocked && !evalPassed
            ? '<button data-level="' + levelId + '" data-lesson="' + lesson.id + '" class="lv-eval-btn" style="margin-top:7px;padding:6px 14px;background:rgba(255,215,0,0.1);border:1px solid rgba(255,215,0,0.25);border-radius:999px;color:#ffd700;font-size:0.72rem;font-weight:800;cursor:pointer;transition:all 0.15s;">🎯 Passer l\'évaluation</button>'
            : '')
          + (evalPassed
            ? '<div style="margin-top:5px;font-size:0.68rem;color:#4ecf70;font-weight:700;">✅ Évaluation réussie · ' + (lessonData.evalScore || 0) + '%</div>'
            : '')
          + '</div>';

        // Clic sur la carte : aller à la section correspondante du menu
        if (isUnlocked) {
          lCard.onmouseenter = function () { this.style.background = 'rgba(255,255,255,0.06)'; };
          lCard.onmouseleave = function () { this.style.background = 'rgba(255,255,255,0.03)'; };
          lCard.onclick = function (e) {
            if (e.target.classList.contains('lv-eval-btn') || e.target.closest('.lv-eval-btn')) return;
            var mod = lesson.modules && lesson.modules[0];
            overlay.remove();
            _goToModule(mod);
          };
        }

        lessonsList.appendChild(lCard);
      });

      section.appendChild(lessonsList);

      // Grand examen
      if (grandExam) {
        var examCard = document.createElement('div');
        examCard.style.cssText = 'margin:0 8px 12px;padding:14px 16px;background:' + (examPassed ? 'rgba(78,207,112,0.06)' : examUnlocked ? 'rgba(255,215,0,0.06)' : 'rgba(255,255,255,0.02)') + ';border:1.5px solid ' + (examPassed ? 'rgba(78,207,112,0.25)' : examUnlocked ? 'rgba(255,215,0,0.22)' : 'rgba(255,255,255,0.06)') + ';border-radius:16px;display:flex;align-items:center;gap:12px;cursor:' + (examUnlocked && !examPassed && isUnlocked ? 'pointer' : 'default') + ';transition:all 0.2s;';

        var examTitle = grandExam.title[nl] || grandExam.title.fr;
        var npcData   = { elder: '👴', teacher: '👩‍🏫', director: '🎥' };
        var examEmoji = npcData[grandExam.examinerNPC] || '🏆';

        examCard.innerHTML = '<div style="font-size:1.8rem;">' + (examPassed ? '🏆' : examUnlocked ? '⚔️' : '🔒') + '</div>'
          + '<div style="flex:1;">'
          + '<div style="font-family:Cinzel,serif;font-weight:800;font-size:0.82rem;color:' + (examPassed ? '#4ecf70' : examUnlocked ? '#ffd700' : 'rgba(255,255,255,0.3)') + ';">' + (window.escapeHtml ? window.escapeHtml(examTitle) : examTitle) + '</div>'
          + '<div style="font-size:0.65rem;color:rgba(255,255,255,0.3);margin-top:2px;">'
          + examEmoji + ' Examinateur · Score requis : ' + grandExam.passingScore + '%'
          + (examPassed ? ' · Score obtenu : ' + (prog.grandExams[levelId] && prog.grandExams[levelId].score || 0) + '%' : '')
          + '</div>'
          + '</div>';

        if (examUnlocked && !examPassed && isUnlocked) {
          examCard.onmouseenter = function () { this.style.background = 'rgba(255,215,0,0.10)'; };
          examCard.onmouseleave = function () { this.style.background = 'rgba(255,215,0,0.06)'; };
          examCard.onclick = function () {
            overlay.remove();
            window.LV_EXAM.openGrandExam(levelId);
          };
        }

        section.appendChild(examCard);
      }

      body.appendChild(section);
    });

    // Délégation sur les boutons d'évaluation
    body.addEventListener('click', function (e) {
      var btn = e.target.closest('.lv-eval-btn');
      if (!btn) return;
      var lvId = btn.dataset.level;
      var lsId = btn.dataset.lesson;
      if (lvId && lsId) {
        overlay.remove();
        window.LV_EXAM.openLessonEval(lvId, lsId);
      }
    });
  }

  // ── Navigation vers un module ────────────────────────────────
  function _goToModule(mod) {
    var moduleMap = {
      alphabet: function () { if (typeof openAlphabet === 'function') openAlphabet(); else if (typeof showScreen === 'function') showScreen('screen-alphabet'); },
      vocab:    function () { if (typeof showScreen === 'function') { showScreen('screen-vocab'); if (typeof ensureLearningBindings === 'function') ensureLearningBindings(); if (typeof loadVocab === 'function') loadVocab(Object.keys(window.VOCAB || {})[0] || 'verbes'); } },
      phrases:  function () { if (typeof showScreen === 'function') { showScreen('screen-phrases'); if (typeof ensureLearningBindings === 'function') ensureLearningBindings(); if (typeof loadPhrases === 'function') loadPhrases(Object.keys(window.PHRASES_DATA || {})[0] || 'quotidien'); } },
      grammar:  function () { if (typeof showScreen === 'function') { showScreen('screen-grammar'); if (typeof loadGrammar === 'function') loadGrammar('present'); } },
      dialogue: function () { if (typeof showScreen === 'function') showScreen('screen-menu'); },
    };
    var fn = moduleMap[mod] || moduleMap.vocab;
    fn();
  }

  // ── Helper hex → rgb ─────────────────────────────────────────
  function _hexToRgb(hex) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return r + ',' + g + ',' + b;
  }

  // ================================================================
  // HOOK : créditer XP de leçon quand l'utilisateur utilise un module
  // Appelé depuis learning.js, alphabet.js, dialogue.js via gainLessonXP()
  // ================================================================
  function creditLessonXP(module, xpAmount) {
    var C    = window.LV_CURRICULUM;
    if (!C) return;
    var prog = C.getProgress();
    var lvl  = prog.currentLevel || 'beginner';

    // Trouver la leçon active du niveau courant qui correspond au module
    var lessons = C.getLessons(lvl);
    var target  = lessons.find(function (l) { return l.modules && l.modules.includes(module) && !C.isEvalPassed(lvl, l.id); });
    if (!target) return;

    C.markLessonXP(lvl, target.id, xpAmount);
  }

  // Exposer creditLessonXP globalement pour les autres modules
  window.gainLessonXP = creditLessonXP;

  return { open, creditLessonXP };

})();

console.log('✅ program.js chargé');
