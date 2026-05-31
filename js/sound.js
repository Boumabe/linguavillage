// sound.js — LinguaVillage Audio Architecture
// Système sonore complet généré via Web Audio API
// Sons synthétiques <500ms, non-agressifs, psychologie positive
// Compatible mobile (iOS/Android), pas de fichiers externes
// ================================================================

window.LV_SOUND = (function() {
  'use strict';

  var ctx = null;
  var masterGain = null;
  var enabled = true;
  var volume = 0.55;

  // Charger préférence volume
  try {
    var sv = localStorage.getItem('lv_sound');
    if (sv !== null) enabled = (sv === '1');
    var vv = localStorage.getItem('lv_volume');
    if (vv !== null) volume = parseFloat(vv) || 0.55;
  } catch(e) {}

  function _init() {
    if (ctx) return true;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      return true;
    } catch(e) { return false; }
  }

  function _resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  // ── Utilitaires de synthèse ──────────────────────────────────

  function _osc(type, freq, startTime, duration, gainPeak, gainNode) {
    var osc = ctx.createOscillator();
    var g   = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(gainPeak, startTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(g);
    g.connect(gainNode || masterGain);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
    return osc;
  }

  function _sweep(type, freqStart, freqEnd, startTime, duration, gainPeak) {
    var osc = ctx.createOscillator();
    var g   = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, startTime);
    osc.frequency.linearRampToValueAtTime(freqEnd, startTime + duration);
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(gainPeak, startTime + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  function _noise(startTime, duration, gainPeak, filterFreq) {
    var bufSize = ctx.sampleRate * duration;
    var buf     = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    var data    = buf.getChannelData(0);
    for (var i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    var src = ctx.createBufferSource();
    src.buffer = buf;
    var filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = filterFreq || 800;
    filter.Q.value = 0.5;
    var g = ctx.createGain();
    g.gain.setValueAtTime(gainPeak, startTime);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    src.connect(filter);
    filter.connect(g);
    g.connect(masterGain);
    src.start(startTime);
    src.stop(startTime + duration);
  }

  function _vibrato(freq, vibratoFreq, vibratoDepth, startTime, duration, gainPeak) {
    var osc = ctx.createOscillator();
    var lfo = ctx.createOscillator();
    var lfoGain = ctx.createGain();
    var g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(vibratoFreq, startTime);
    lfoGain.gain.setValueAtTime(vibratoDepth, startTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(gainPeak, startTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
    lfo.start(startTime);
    lfo.stop(startTime + duration + 0.02);
  }

  // ================================================================
  // SONS INDIVIDUELS
  // ================================================================

  var sounds = {

    // ── Gain XP — pièce qui tinte (350ms) ──
    xp: function() {
      if (!enabled || !_init()) return; _resume();
      var t = ctx.currentTime;
      _osc('sine',  880, t,       0.15, 0.30);
      _osc('sine',  1108, t+0.06, 0.12, 0.18);
      _osc('triangle', 1320, t+0.12, 0.10, 0.22);
      _noise(t, 0.04, 0.08, 1200);
    },

    // ── Réponse correcte — validation satisfaisante (280ms) ──
    correct: function() {
      if (!enabled || !_init()) return; _resume();
      var t = ctx.currentTime;
      _sweep('sine', 440, 660, t, 0.12, 0.35);
      _osc('sine', 880, t+0.10, 0.18, 0.25);
    },

    // ── Réponse incorrecte — dissonance douce (200ms) ──
    wrong: function() {
      if (!enabled || !_init()) return; _resume();
      var t = ctx.currentTime;
      _sweep('sawtooth', 320, 220, t, 0.18, 0.20);
      _osc('sine', 180, t+0.06, 0.14, 0.15);
    },

    // ── Déblocage niveau — fanfare mini (480ms) ──
    levelUp: function() {
      if (!enabled || !_init()) return; _resume();
      var t = ctx.currentTime;
      // Accord montant sol-si-ré-sol
      _osc('sine', 392, t,       0.20, 0.28);
      _osc('sine', 494, t+0.08,  0.20, 0.28);
      _osc('sine', 587, t+0.16,  0.20, 0.28);
      _osc('sine', 784, t+0.24,  0.45, 0.40);
      _osc('triangle', 1568, t+0.28, 0.20, 0.30);
      _noise(t+0.24, 0.06, 0.12, 2000);
    },

    // ── Fin de leçon — réussite douce (420ms) ──
    lessonComplete: function() {
      if (!enabled || !_init()) return; _resume();
      var t = ctx.currentTime;
      _osc('sine', 523, t,       0.22, 0.32);
      _osc('sine', 659, t+0.09,  0.22, 0.32);
      _osc('sine', 784, t+0.18,  0.22, 0.32);
      _osc('sine', 1047, t+0.27, 0.38, 0.42);
      _vibrato(1047, 5, 8, t+0.27, 0.20, 0.10);
    },

    // ── Récompense quotidienne — marimba chaleureux (400ms) ──
    dailyReward: function() {
      if (!enabled || !_init()) return; _resume();
      var t = ctx.currentTime;
      _osc('triangle', 523,  t,       0.20, 0.30);
      _osc('triangle', 659,  t+0.07,  0.18, 0.28);
      _osc('triangle', 784,  t+0.14,  0.18, 0.28);
      _osc('triangle', 1047, t+0.21,  0.16, 0.26);
      _osc('triangle', 1319, t+0.28,  0.30, 0.38);
      _noise(t, 0.02, 0.06, 400);
    },

    // ── Série de succès (combo 3+) — montée d'adrénaline (300ms) ──
    combo: function(count) {
      if (!enabled || !_init()) return; _resume();
      var t = ctx.currentTime;
      var baseFreq = 440 * Math.pow(1.12, Math.min(count-2, 6));
      _sweep('sine', baseFreq, baseFreq * 1.5, t, 0.25, 0.35);
      _osc('triangle', baseFreq * 2, t+0.10, 0.18, 0.25);
      if (count >= 5) {
        _osc('sine', baseFreq * 3, t+0.18, 0.12, 0.28);
        _noise(t, 0.03, 0.10, 1800);
      }
    },

    // ── Badge gagné — médaille qui tinte (450ms) ──
    badge: function() {
      if (!enabled || !_init()) return; _resume();
      var t = ctx.currentTime;
      _noise(t, 0.03, 0.15, 3000);
      _osc('sine',  1174, t,       0.22, 0.20);
      _osc('sine',  1480, t+0.04,  0.20, 0.22);
      _osc('sine',  1760, t+0.08,  0.18, 0.25);
      _osc('triangle', 880, t+0.12, 0.32, 0.40);
      _vibrato(880, 6, 12, t+0.15, 0.30, 0.08);
    },

    // ── Validation importante — click profond (150ms) ──
    confirm: function() {
      if (!enabled || !_init()) return; _resume();
      var t = ctx.currentTime;
      _sweep('sine', 220, 330, t, 0.10, 0.30);
      _noise(t, 0.02, 0.12, 600);
    },

    // ── Ouverture coffre — magie + surprise (480ms) ──
    chest: function() {
      if (!enabled || !_init()) return; _resume();
      var t = ctx.currentTime;
      // Crescendo mystérieux
      _sweep('sine', 220, 110, t, 0.08, 0.18);
      _noise(t+0.05, 0.06, 0.18, 800);
      // Ouverture
      _osc('sine', 523,  t+0.12, 0.22, 0.35);
      _osc('sine', 659,  t+0.16, 0.20, 0.32);
      _osc('sine', 784,  t+0.20, 0.18, 0.30);
      _osc('sine', 1047, t+0.24, 0.16, 0.28);
      // Étincelles
      for (var i = 0; i < 4; i++) {
        _noise(t + 0.28 + i*0.04, 0.03, 0.08, 2000 + i*800);
      }
    },

    // ── Tap / interaction légère (80ms) ──
    tap: function() {
      if (!enabled || !_init()) return; _resume();
      var t = ctx.currentTime;
      _sweep('sine', 440, 380, t, 0.06, 0.15);
    },

    // ── Swipe / navigation (120ms) ──
    swipe: function() {
      if (!enabled || !_init()) return; _resume();
      var t = ctx.currentTime;
      _sweep('sine', 330, 440, t, 0.10, 0.12);
    },

    // ── Streak (flamme qui monte) (250ms) ──
    streak: function() {
      if (!enabled || !_init()) return; _resume();
      var t = ctx.currentTime;
      _sweep('sawtooth', 200, 600, t, 0.20, 0.22);
      _osc('sine', 800, t+0.10, 0.15, 0.20);
      _noise(t+0.15, 0.08, 0.10, 1200);
    },

    // ── Notification douce (200ms) ──
    notif: function() {
      if (!enabled || !_init()) return; _resume();
      var t = ctx.currentTime;
      _osc('sine', 587, t,      0.12, 0.18);
      _osc('sine', 784, t+0.08, 0.10, 0.15);
    },

    // ================================================================
    // SON SIGNATURE LINGUAVILLAGE — 3 secondes
    // Description technique :
    // - 0.00s : Arpège ascendant pentatonique (do-mi-sol-la-do)
    //           Instrument : sinusoïdes douces + triangle
    //           Évoque : découverte, ouverture
    // - 0.60s : Accord de sol majeur avec vibrato
    //           Instrument : cordes synthétiques (oscillateurs en couche)
    //           Évoque : progression, voyage
    // - 1.20s : Mélodie principale 4 notes (sol-la-do-mi)
    //           Instrument : "marimba" (triangle avec enveloppe rapide)
    //           Évoque : apprentissage, légèreté
    // - 2.00s : Impact lumineux — accord parfait montant
    //           Instrument : sine + triangle + noise burst
    //           Évoque : réussite, arrivée
    // - 2.40s : Résonance finale qui s'éteint doucement
    //           Évoque : satisfaction, appartenance
    // ================================================================
    signature: function() {
      if (!_init()) return; _resume();
      var t = ctx.currentTime;
      var gl = ctx.createGain();
      gl.gain.setValueAtTime(volume, t);
      gl.connect(ctx.destination);

      // Phase 1 : Arpège pentatonique (0.00–0.55s)
      // Notes : C4(262) E4(330) G4(392) A4(440) C5(523)
      var arp = [262, 330, 392, 440, 523];
      arp.forEach(function(freq, i) {
        var osc = ctx.createOscillator();
        var g   = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + i*0.10);
        g.gain.setValueAtTime(0, t + i*0.10);
        g.gain.linearRampToValueAtTime(0.22, t + i*0.10 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + i*0.10 + 0.35);
        osc.connect(g); g.connect(gl);
        osc.start(t + i*0.10);
        osc.stop(t + i*0.10 + 0.40);

        // Harmonique douce
        var osc2 = ctx.createOscillator();
        var g2   = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2, t + i*0.10);
        g2.gain.setValueAtTime(0, t + i*0.10);
        g2.gain.linearRampToValueAtTime(0.08, t + i*0.10 + 0.02);
        g2.gain.exponentialRampToValueAtTime(0.001, t + i*0.10 + 0.25);
        osc2.connect(g2); g2.connect(gl);
        osc2.start(t + i*0.10);
        osc2.stop(t + i*0.10 + 0.30);
      });

      // Phase 2 : Accord + vibrato (0.60–1.15s)
      // Sol majeur en couche 3 oscillateurs
      var chord = [392, 494, 587];
      chord.forEach(function(freq) {
        var osc = ctx.createOscillator();
        var lfo = ctx.createOscillator();
        var lfoG = ctx.createGain();
        var g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + 0.60);
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(4.5, t + 0.60);
        lfoG.gain.setValueAtTime(6, t + 0.65);
        lfo.connect(lfoG); lfoG.connect(osc.frequency);
        g.gain.setValueAtTime(0, t + 0.60);
        g.gain.linearRampToValueAtTime(0.18, t + 0.68);
        g.gain.setValueAtTime(0.18, t + 1.00);
        g.gain.exponentialRampToValueAtTime(0.001, t + 1.20);
        osc.connect(g); g.connect(gl);
        osc.start(t + 0.60); osc.stop(t + 1.25);
        lfo.start(t + 0.60); lfo.stop(t + 1.25);
      });

      // Phase 3 : Mélodie principale (1.20–1.95s)
      // Sol-La-Do-Mi (392-440-523-659)
      var melody = [392, 440, 523, 659];
      melody.forEach(function(freq, i) {
        var osc = ctx.createOscillator();
        var g   = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + 1.20 + i*0.18);
        g.gain.setValueAtTime(0, t + 1.20 + i*0.18);
        g.gain.linearRampToValueAtTime(0.28, t + 1.20 + i*0.18 + 0.015);
        g.gain.exponentialRampToValueAtTime(0.001, t + 1.20 + i*0.18 + 0.28);
        osc.connect(g); g.connect(gl);
        osc.start(t + 1.20 + i*0.18);
        osc.stop(t + 1.20 + i*0.18 + 0.32);
      });

      // Phase 4 : Impact lumineux (2.00–2.35s)
      // Do majeur montant avec noise burst
      var impact = [523, 659, 784, 1047];
      impact.forEach(function(freq, i) {
        var osc = ctx.createOscillator();
        var g   = ctx.createGain();
        osc.type = i < 2 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, t + 2.00 + i*0.04);
        g.gain.setValueAtTime(0, t + 2.00 + i*0.04);
        g.gain.linearRampToValueAtTime(0.30 - i*0.04, t + 2.00 + i*0.04 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, t + 2.00 + i*0.04 + 0.45);
        osc.connect(g); g.connect(gl);
        osc.start(t + 2.00 + i*0.04);
        osc.stop(t + 2.00 + i*0.04 + 0.50);
      });

      // Noise burst pour l'impact
      var nbuf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
      var nd = nbuf.getChannelData(0);
      for (var ni = 0; ni < nd.length; ni++) nd[ni] = Math.random() * 2 - 1;
      var nsrc = ctx.createBufferSource();
      nsrc.buffer = nbuf;
      var nfilt = ctx.createBiquadFilter();
      nfilt.type = 'highpass'; nfilt.frequency.value = 3000;
      var ng = ctx.createGain();
      ng.gain.setValueAtTime(0.20, t + 2.00);
      ng.gain.exponentialRampToValueAtTime(0.001, t + 2.06);
      nsrc.connect(nfilt); nfilt.connect(ng); ng.connect(gl);
      nsrc.start(t + 2.00); nsrc.stop(t + 2.10);

      // Phase 5 : Résonance finale (2.35–3.00s)
      var res = ctx.createOscillator();
      var resG = ctx.createGain();
      res.type = 'sine';
      res.frequency.setValueAtTime(1047, t + 2.35);
      res.frequency.exponentialRampToValueAtTime(1047, t + 3.00);
      resG.gain.setValueAtTime(0.22, t + 2.35);
      resG.gain.exponentialRampToValueAtTime(0.001, t + 3.00);
      res.connect(resG); resG.connect(gl);
      res.start(t + 2.35); res.stop(t + 3.05);

      // Harmonique résonance
      var res2 = ctx.createOscillator();
      var res2G = ctx.createGain();
      res2.type = 'triangle';
      res2.frequency.setValueAtTime(2094, t + 2.35);
      res2G.gain.setValueAtTime(0.08, t + 2.35);
      res2G.gain.exponentialRampToValueAtTime(0.001, t + 2.80);
      res2.connect(res2G); res2G.connect(gl);
      res2.start(t + 2.35); res2.stop(t + 2.85);
    }
  };

  // ================================================================
  // API PUBLIQUE
  // ================================================================
  function play(name, param) {
    if (!enabled) return;
    try {
      if (sounds[name]) sounds[name](param);
    } catch(e) { console.warn('Sound error:', name, e); }
  }

  function toggle() {
    enabled = !enabled;
    try { localStorage.setItem('lv_sound', enabled ? '1' : '0'); } catch(e) {}
    return enabled;
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    if (masterGain) masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    try { localStorage.setItem('lv_volume', String(volume)); } catch(e) {}
  }

  function isEnabled() { return enabled; }

  // Init au premier geste utilisateur (iOS requirement)
  function _unlock() {
    if (!ctx) _init();
    else if (ctx.state === 'suspended') ctx.resume();
  }

  document.addEventListener('touchstart', _unlock, { once: false, passive: true });
  document.addEventListener('click', _unlock, { once: false, passive: true });

  return { play: play, toggle: toggle, setVolume: setVolume, isEnabled: isEnabled };

})();

// Raccourcis globaux utilisés partout dans l'app
window.playSound = function(name, p) { window.LV_SOUND.play(name, p); };

console.log('✅ sound.js chargé — Architecture audio LinguaVillage');
