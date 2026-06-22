// curriculum_ui.js — Pont léger entre curriculum.js et l'interface existante
// ============================================================================
// ÉTAT (constaté lors de cet audit) : CHARGÉ dans index.html mais JAMAIS
// APPELÉ. Ses deux points d'entrée prévus sont :
//   - maybeShowRelevantPitfall(unitId) : n'est invoqué que par
//     js/_archive/curriculum_hooks.js, qui est désormais archivé (non
//     chargé) car il dépend lui-même de window.LV_CURRICULUM, jamais
//     défini. Preuve : grep "CURRICULUM_UI\." sur tout le projet hors
//     curriculum_ui.js et curriculum_hooks.js → aucun résultat.
//   - updateCurriculumBadge() : même situation, jamais appelée.
// De plus, showPitfallHint() dépend de addSysMsg(), une fonction que le
// commentaire ci-dessous affirme être "déjà présente" dans dialogue.js —
// or elle n'existe nulle part dans le projet (vérifié par recherche
// exhaustive). Même réactivé, ce fichier ne ferait donc rien tant que
// addSysMsg() ne sera pas implémentée quelque part.
//
// CE FICHIER N'A PAS ÉTÉ MODIFIÉ FONCTIONNELLEMENT NI ARCHIVÉ : il reste
// chargé tel quel dans index.html, sans effet, en attendant une décision
// explicite (le brancher en créant addSysMsg() + un appelant réel comme
// js/dialogue.js, ou l'archiver comme curriculum_hooks.js).
// ============================================================================
// N'ajoute AUCUN écran. Utilise addSysMsg() déjà présente dans dialogue.js
// pour afficher, sous forme de bulle système discrète dans le fil de
// conversation, le piège pédagogique précis quand l'IA vient de corriger
// le joueur sur un point identifié dans curriculum.js.
//
// Ce fichier ne modifie ni dialogue.js ni pnj.js : il les observe.
// ============================================================================

window.CURRICULUM_UI = (function () {
'use strict';

var _shownThisSession = {}; // évite de répéter le même indice en boucle

// Affiche un indice de piège sous forme de bulle système discrète,
// dans le style déjà utilisé par addSysMsg() de dialogue.js.
function showPitfallHint(pitfall, nativeLang) {
  if (!pitfall || typeof addSysMsg !== 'function') return;
  var key = pitfall.type + '|' + pitfall.explanation.slice(0, 30);
  if (_shownThisSession[key]) return; // déjà montré cette session
  _shownThisSession[key] = true;

  var icon = pitfall.icon || '💡';
  var html = '<span style="opacity:0.55;font-size:0.78em;">'
    + icon + ' ' + pitfall.explanation
    + (pitfall.example ? '<br><span style="opacity:0.7;font-style:italic;">' + pitfall.example + '</span>' : '')
    + '</span>';
  addSysMsg(html);
}

// À appeler après une réponse NPC reçue (depuis dialogue.js sendMsg ou
// npcOpen) pour vérifier si le joueur tombe dans un piège connu.
// Heuristique légère : on ne fait pas d'analyse syntaxique, on s'appuie sur
// le fait que l'IA elle-même a déjà reçu les pièges en system prompt
// (via pnj.js) — ce hook sert seulement à RENDRE VISIBLE pour le joueur
// le piège que l'IA vient potentiellement de corriger dans sa réponse.
function maybeShowRelevantPitfall(unitId) {
  if (!window.CURRICULUM || !window.S) return;
  var targetLang = S.targetLang;
  var nativeLang = S.nativeLang;
  if (!targetLang || !nativeLang) return;

  var pitfalls = window.CURRICULUM.getPitfallsForPrompt(targetLang, nativeLang, unitId);
  if (!pitfalls.length) return;

  // Affiche le premier piège non encore montré cette session pour cette unité
  for (var i = 0; i < pitfalls.length; i++) {
    var key = pitfalls[i].type + '|' + pitfalls[i].explanation.slice(0, 30);
    if (!_shownThisSession[key]) {
      showPitfallHint(pitfalls[i], nativeLang);
      break;
    }
  }
}

// Petit badge "unité courante" optionnel, affichable dans le HUD du village
// (#hudCurriculum si présent dans le DOM — sinon ne fait rien, non-invasif)
function updateCurriculumBadge() {
  if (!window.CURRICULUM || !window.S) return;
  var el = document.getElementById('hudCurriculum');
  if (!el) return; // l'élément n'existe pas forcément dans l'index actuel — silencieux

  var xp = S.xp || 0;
  var unit = window.CURRICULUM.getCurrentUnit(S.targetLang, xp);
  var next = window.CURRICULUM.getNextUnit(S.targetLang, xp);
  var nl = S.nativeLang || 'fr';

  if (unit) {
    el.textContent = (unit.title[nl] || unit.title.fr || unit.title.en || unit.id);
    el.title = next ? ('Prochain: ' + (next.title[nl] || next.title.fr)) : 'Niveau maximal atteint';
  }
}

// Réinitialise les indices déjà montrés (utile au changement de NPC/lieu)
function resetSessionHints() {
  _shownThisSession = {};
}

return {
  showPitfallHint: showPitfallHint,
  maybeShowRelevantPitfall: maybeShowRelevantPitfall,
  updateCurriculumBadge: updateCurriculumBadge,
  resetSessionHints: resetSessionHints,
};

})();

console.log('✅ curriculum_ui.js chargé — pont curriculum ↔ interface existante');
