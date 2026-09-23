// pwa.js — enregistrement du service worker + raccourcis d'application (?go=village|vocab)
(function () {
  'use strict';
  if ('serviceWorker' in navigator && location.protocol !== 'file:' && !/[?&]nosw\b/.test(location.search)) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function (e) { console.warn('Service worker non enregistré :', e && e.message); });
    });
  }
  // Raccourcis du manifeste (appui long sur l'icône) : ouvrent directement un mode.
  window.LV_PENDING_GO = (new URLSearchParams(location.search)).get('go');
})();
