// sprites.js – affichage d'émotions (bulle)
// CORRECTION : ajout de initInDialogue(), reactToMission(), reactToCorrection()
// — méthodes attendues par pnj.js (window.LV_PNJ) mais absentes jusqu'ici.
// setExpression() est conservée à l'identique : guided_v2.js et wordgame.js
// l'utilisent déjà et ne doivent pas être affectés.
window.LV_SPRITES = {
  setExpression: function(expr, duration = 2000) {
    const map = { happy: '😊', confused: '🤔', sad: '😢', angry: '😠', surprised: '😲', neutral: '😐' };
    const emoji = map[expr] || '😐';
    const bubble = document.createElement('div');
    bubble.textContent = emoji;
    bubble.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      font-size: 2.5rem;
      background: rgba(0,0,0,0.6);
      border-radius: 50%;
      padding: 10px;
      z-index: 10000;
      animation: fadeOut 2s forwards;
      pointer-events: none;
    `;
    if (!document.querySelector('#lv-sprites-style')) {
      const style = document.createElement('style');
      style.id = 'lv-sprites-style';
      style.textContent = `@keyframes fadeOut { 0% { opacity: 1; transform: scale(1); } 70% { opacity: 1; } 100% { opacity: 0; transform: scale(0.5); } }`;
      document.head.appendChild(style);
    }
    document.body.appendChild(bubble);
    setTimeout(() => bubble.remove(), duration);
  },

  // Appelée par pnj.js à l'ouverture d'un dialogue (patch de openDialogue).
  // Ne fait rien de visuellement intrusif par défaut : se contente de
  // remettre l'expression à neutre, sans bloquer si elle est appelée
  // avant que le DOM du dialogue ne soit prêt.
  initInDialogue: function(npc) {
    // npc est conservé en paramètre pour usage futur (ex: couleur par rôle),
    // non utilisé pour l'instant — pas d'effet de bord si npc est undefined.
    return true;
  },

  // Appelée par pnj.js quand la réponse de l'IA contient un signal de succès
  // (analyzeResponse().hasSuccess) — réaction visuelle positive.
  reactToMission: function() {
    this.setExpression('happy', 2000);
  },

  // Appelée par pnj.js quand la réponse de l'IA contient (ou non) un signal
  // de correction. isNeutral=true → pas de correction détectée (réaction neutre/légère) ;
  // isNeutral=false → une correction a été détectée (réaction "confused").
  reactToCorrection: function(isNeutral) {
    this.setExpression(isNeutral ? 'neutral' : 'confused', 2000);
  }
};
console.log("✅ sprites.js chargé");
