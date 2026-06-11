// LinguaVillage — curriculum_hooks.js
// Patch d'intégration : connecte les modules existants (vocab, phrases, grammar,
// alphabet, dialogue) au système de curriculum sans modifier leurs fichiers sources.
// Stratégie : intercepter gainXP et les appels de navigation pour créditer
// la progression des leçons courantes.
// ================================================================

(function () {
  'use strict';

  // ── Attendre que tous les modules soient prêts ───────────────
  function _whenReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      setTimeout(fn, 200);
    }
  }

  _whenReady(function () {

    // ================================================================
    // 1. HOOK gainXP → créditer la leçon en cours
    // ================================================================
    var _origGainXP = window.gainXP;
    if (_origGainXP && !_origGainXP._curriculum_patched) {
      window.gainXP = function (amount, sourceEl) {
        // Appel original
        if (_origGainXP) _origGainXP.call(this, amount, sourceEl);

        // Créditer le curriculum
        if (window.LV_PROGRAM && typeof window.LV_PROGRAM.creditLessonXP === 'function') {
          var module = _detectCurrentModule();
          if (module) {
            window.LV_PROGRAM.creditLessonXP(module, amount || 0);
          }
        }
      };
      window.gainXP._curriculum_patched = true;
    }

    // ================================================================
    // 2. PATCH showScreen → détecter le module actif
    // ================================================================
    var _origShowScreen = window.showScreen;
    if (_origShowScreen && !_origShowScreen._curriculum_patched) {
      window.showScreen = function (id) {
        _origShowScreen.call(this, id);
        _updateProgramBadge();
      };
      window.showScreen._curriculum_patched = true;
    }

    // ================================================================
    // 3. MISE À JOUR DU BADGE NIVEAU dans le menu
    // ================================================================
    window._updateProgramBadge = _updateProgramBadge;

    function _updateProgramBadge() {
      var C    = window.LV_CURRICULUM;
      if (!C) return;
      var prog = C.getProgress();
      var lvl  = prog.currentLevel || 'beginner';
      var pct  = C.getLevelProgress(lvl);

      // Badge bouton programme
      var badge = document.getElementById('program-level-badge');
      if (badge) {
        var icons  = { beginner: '🌱', intermediate: '⭐', advanced: '🏆', pro: '👑' };
        var labels = {
          beginner:     { fr: 'Débutant',     en: 'Beginner',     es: 'Principiante', ht: 'Debitant',    de: 'Anfänger',      ru: 'Начальный',  zh: '初级', ja: '初級' },
          intermediate: { fr: 'Intermédiaire',en: 'Intermediate', es: 'Intermedio',   ht: 'Entèmedyè',   de: 'Mittelstufe',   ru: 'Средний',    zh: '中级', ja: '中級' },
          advanced:     { fr: 'Avancé',       en: 'Advanced',     es: 'Avanzado',     ht: 'Avanse',       de: 'Fortgeschritten',ru: 'Продвинутый',zh: '高级', ja: '上級' },
          pro:          { fr: 'Pro',           en: 'Pro',          es: 'Pro',          ht: 'Pro',          de: 'Profi',         ru: 'Профи',      zh: '精通', ja: 'プロ' },
        };
        var nl    = (window.S && window.S.nativeLang) || 'fr';
        var label = (labels[lvl] && (labels[lvl][nl] || labels[lvl].fr)) || lvl;
        badge.textContent = (icons[lvl] || '🌱') + ' ' + label + ' · ' + pct + '%';
      }

      // Barre indicateur de niveau
      var bar = document.getElementById('level-indicator-bar');
      if (bar) {
        var colors = { beginner: '#4ecf70', intermediate: '#4a9eff', advanced: '#c084fc', pro: '#ffd700' };
        var color  = colors[lvl] || '#4ecf70';
        bar.innerHTML = '<div style="flex:1;height:4px;background:rgba(255,255,255,0.06);border-radius:4px;overflow:hidden;">'
          + '<div style="height:100%;width:' + pct + '%;background:' + color + ';transition:width 0.8s cubic-bezier(0.22,1,0.36,1);border-radius:4px;"></div>'
          + '</div>'
          + '<span style="font-size:0.6rem;font-weight:700;color:rgba(255,255,255,0.25);">' + pct + '%</span>';
      }
    }

    // Appel initial au chargement
    setTimeout(_updateProgramBadge, 500);

    // ================================================================
    // 4. HOOK SUR LES DIALOGUES NPC — créditer module 'dialogue'
    // ================================================================
    var _origSendMsg = window.sendMsg;
    if (_origSendMsg && !_origSendMsg._curriculum_patched) {
      window.sendMsg = function () {
        if (_origSendMsg) _origSendMsg.apply(this, arguments);
        if (window.LV_PROGRAM) window.LV_PROGRAM.creditLessonXP('dialogue', 10);
      };
      window.sendMsg._curriculum_patched = true;
    }

    // ================================================================
    // 5. INTÉGRATION PNJ EXAMINATEUR dans le village
    // Quand un grand examen est disponible, afficher un marqueur sur le PNJ
    // ================================================================
    var _origGoVillage = window.goVillage;
    if (_origGoVillage && !_origGoVillage._curriculum_patched) {
      window.goVillage = function () {
        if (_origGoVillage) _origGoVillage.apply(this, arguments);
        setTimeout(_injectExamMarkers, 800);
      };
      window.goVillage._curriculum_patched = true;
    }

    function _injectExamMarkers() {
      var C = window.LV_CURRICULUM;
      if (!C) return;
      var levels = ['beginner', 'intermediate', 'advanced'];
      levels.forEach(function (lvl) {
        if (C.isGrandExamUnlocked(lvl)) {
          var exam    = C.getGrandExam(lvl);
          if (!exam)  return;
          var npcId   = exam.examinerNPC;
          // Chercher le PNJ dans le canvas tooltip ou les cartes
          _markExaminerNPC(npcId, lvl);
        }
      });
    }

    function _markExaminerNPC(npcId, levelId) {
      // Ajouter une pulsation dorée sur le bâtiment examinateur si visible
      // Fonctionne via un overlay DOM si le canvas n'est pas accessible
      var tooltip = document.getElementById('locTooltip');
      if (!tooltip) return;
      // Note: l'effet visuel complet se fait dans le canvas via village_world.js
      // Ici on stocke juste l'info pour que le tooltip l'affiche
      if (!window._pendingExamNPCs) window._pendingExamNPCs = {};
      window._pendingExamNPCs[npcId] = levelId;
    }

    // ================================================================
    // 6. HOOK openDialogue → vérifier si c'est un examinateur
    // ================================================================
    var _origOpenDialogue = window.openDialogue;
    if (_origOpenDialogue && !_origOpenDialogue._curriculum_exam_patched) {
      window.openDialogue = function (locId, npcId) {
        // Vérifier si ce PNJ est un examinateur avec exam débloqué
        var C = window.LV_CURRICULUM;
        if (C) {
          var examLevel = _getExamLevelForNPC(npcId, locId, C);
          if (examLevel) {
            // Proposer le grand examen avant le dialogue normal
            _promptGrandExam(examLevel, npcId, locId, function (launchExam) {
              if (launchExam) {
                window.LV_EXAM.openGrandExam(examLevel);
              } else {
                if (_origOpenDialogue) _origOpenDialogue.call(this, locId, npcId);
              }
            });
            return;
          }
        }
        if (_origOpenDialogue) _origOpenDialogue.call(this, locId, npcId);
      };
      window.openDialogue._curriculum_exam_patched = true;
    }

    function _getExamLevelForNPC(npcId, locId, C) {
      var levels = ['beginner', 'intermediate', 'advanced'];
      for (var i = 0; i < levels.length; i++) {
        var lvl  = levels[i];
        var exam = C.getGrandExam(lvl);
        if (exam && exam.examinerNPC === npcId && C.isGrandExamUnlocked(lvl)) {
          var prog = C.getProgress();
          if (!prog.grandExams[lvl] || !prog.grandExams[lvl].passed) {
            return lvl;
          }
        }
      }
      return null;
    }

    function _promptGrandExam(levelId, npcId, locId, callback) {
      var C    = window.LV_CURRICULUM;
      var exam = C && C.getGrandExam(levelId);
      if (!exam) { callback(false); return; }

      var nl    = (window.S && window.S.nativeLang) || 'fr';
      var title = exam.title[nl] || exam.title.fr;
      var intro = (exam.examinerIntro[nl] || exam.examinerIntro.fr || '')
        .replace('{name}', (window.S && window.S.playerName) || 'Apprenant');

      // Créer une modale légère de choix
      var old = document.getElementById('lv-exam-prompt');
      if (old) old.remove();

      var modal = document.createElement('div');
      modal.id  = 'lv-exam-prompt';
      modal.style.cssText = 'position:fixed;inset:0;z-index:7500;background:rgba(4,6,14,0.92);display:flex;align-items:flex-end;justify-content:center;padding:0 0 20px;animation:examFadeIn 0.22s ease;';
      modal.innerHTML = '<div style="width:100%;max-width:440px;background:#0e1322;border:1.5px solid rgba(255,215,0,0.22);border-radius:24px 24px 16px 16px;padding:20px 20px 16px;display:flex;flex-direction:column;gap:14px;">'
        + '<div style="text-align:center;">'
        + '<div style="font-size:2.5rem;margin-bottom:6px;">🏆</div>'
        + '<div style="font-family:Cinzel,serif;font-weight:800;font-size:0.9rem;color:#ffd700;margin-bottom:6px;">' + (window.escapeHtml ? window.escapeHtml(title) : title) + '</div>'
        + '<div style="font-size:0.8rem;color:rgba(255,255,255,0.5);line-height:1.5;font-style:italic;">"' + (window.escapeHtml ? window.escapeHtml(intro.substring(0, 120)) : intro.substring(0, 120)) + '…"</div>'
        + '</div>'
        + '<button id="lv-ep-exam" style="width:100%;padding:13px;background:rgba(255,215,0,0.12);border:1.5px solid rgba(255,215,0,0.3);border-radius:14px;color:#ffd700;font-family:Cinzel,serif;font-weight:800;font-size:0.88rem;cursor:pointer;">⚔️ Passer le Grand Examen</button>'
        + '<button id="lv-ep-chat" style="width:100%;padding:11px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;color:rgba(255,255,255,0.5);font-size:0.8rem;cursor:pointer;">💬 Juste discuter</button>'
        + '</div>';

      document.body.appendChild(modal);

      document.getElementById('lv-ep-exam').onclick = function () { modal.remove(); callback(true);  };
      document.getElementById('lv-ep-chat').onclick = function () { modal.remove(); callback(false); };
      modal.onclick = function (e) { if (e.target === modal) { modal.remove(); callback(false); } };
    }

    // ================================================================
    // 7. HOOK VOCAB / PHRASES / GRAMMAR → créditer lessonXP
    // ================================================================
    // Écouter les clics sur les boutons d'action (écouter, pratiquer)
    document.addEventListener('click', function (e) {
      var P = window.LV_PROGRAM;
      if (!P) return;

      // Boutons dans screen-vocab
      if (e.target.closest('#vocabList')) {
        P.creditLessonXP('vocab', 5);
      }
      // Boutons dans screen-phrases
      if (e.target.closest('#phraseList')) {
        P.creditLessonXP('phrases', 5);
      }
      // Boutons dans screen-grammar
      if (e.target.closest('#grammarBody')) {
        P.creditLessonXP('grammar', 5);
      }
      // Boutons dans screen-alphabet
      if (e.target.closest('#alphaBody')) {
        P.creditLessonXP('alphabet', 8);
      }
    }, true);

    console.log('✅ curriculum_hooks.js — intégration complète');
  });

  // ── Détecter le module actif selon l'écran visible ──────────
  function _detectCurrentModule() {
    var screens = ['screen-vocab', 'screen-phrases', 'screen-grammar', 'screen-alphabet', 'screen-dialogue'];
    var map     = { 'screen-vocab': 'vocab', 'screen-phrases': 'phrases', 'screen-grammar': 'grammar', 'screen-alphabet': 'alphabet', 'screen-dialogue': 'dialogue' };
    for (var i = 0; i < screens.length; i++) {
      var el = document.getElementById(screens[i]);
      if (el && el.classList.contains('active')) return map[screens[i]];
    }
    return null;
  }

})();
