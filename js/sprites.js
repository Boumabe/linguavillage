// sprites.js – affichage d’émotions (bulle)
window.LV_SPRITES = {
  setExpression: function(expr, duration = 2000) {
    const map = { happy: '😊', confused: '🤔', sad: '😢', angry: '😠', surprised: '😲' };
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
  }
};
console.log("✅ sprites.js chargé");
