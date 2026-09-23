// sprites.js — réactions émotionnelles
// Dans un dialogue : l'avatar du PNJ change d'humeur (voir dialogue.js / .dlg-avatar).
// Ailleurs (ex. Jeu de mots) : petite bulle emoji éphémère.
window.LV_SPRITES = {
  setExpression: function (expr, duration) {
    duration = duration || 2000;
    if (document.getElementById('dlg-avatar') && typeof window._dlgSetMood === 'function') {
      window._dlgSetMood(expr, duration);
      return;
    }
    var map = { happy: '😊', confused: '🤔', sad: '😢', angry: '😠', surprised: '😲', neutral: '😐' };
    var b = document.createElement('div');
    b.className = 'lv-react-bubble';
    b.textContent = map[expr] || '😐';
    document.body.appendChild(b);
    setTimeout(function () { b.remove(); }, duration);
  }
};
console.log('✅ sprites.js chargé');
