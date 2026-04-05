// PREMIÈRE LIGNE DE app.js
alert('app.js a commencé à charger');
console.log('app.js a commencé à charger');
// TEST MINIMAL - app.js
console.log('app.js chargé !');

window.applyUI = function(lang) {
    console.log('applyUI appelé avec', lang);
};

window.startMenu = function() {
    console.log('startMenu appelé');
    alert('Menu démarré !');
};

window.showNotif = function(msg) {
    console.log('NOTIF:', msg);
    alert(msg);
};

window.gainXP = function(n) {
    console.log('+', n, 'XP');
};

window.S = { playerName: 'Test', nativeLang: 'fr', targetLang: 'en', xp: 0, level: 1 };

// Simuler le chargement
setTimeout(function() {
    var debugDiv = document.getElementById('debug');
    if (debugDiv) {
        debugDiv.innerHTML = '✅ app.js TEST chargé !';
        debugDiv.style.background = 'green';
    }
}, 100);
