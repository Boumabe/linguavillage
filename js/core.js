// LinguaVillage — core.js
// Socle commun, chargé AVANT tous les autres scripts.
//   • LV.apiBase / LV.api     : appels réseau uniques (fini les 3 URLs différentes)
//   • showScreen + historique : le bouton retour d'Android ramène à l'écran précédent
//   • LV.nav.pushLayer        : idem pour les fenêtres superposées (dialogue…)
//   • capture d'erreurs       : plus de barre "debug" visible pour les joueurs
//   • LV.dateKey / LV.haptic  : petits utilitaires partagés
// ================================================================
(function () {
  'use strict';
  var LV = window.LV = window.LV || {};

  // ── Mode debug : ?debug dans l'URL, ou localStorage lv_debug=1 ───
  var DEBUG = /[?&]debug\b/.test(location.search);
  try { if (localStorage.getItem('lv_debug') === '1') DEBUG = true; } catch (e) {}
  LV.debug = DEBUG;
  document.documentElement.classList.toggle('lv-debug', DEBUG);

  // ── Base de l'API ────────────────────────────────────────────────
  // Même origine par défaut (Vercel sert le site ET /api). Depuis GitHub Pages
  // ou un fichier local, on pointe vers le déploiement Vercel officiel.
  var host = location.hostname;
  var base = window.LV_API_BASE;
  if (typeof base !== 'string') {
    base = (/\.github\.io$/i.test(host) || location.protocol === 'file:')
      ? 'https://linguavillage.vercel.app' : '';
  }
  LV.apiBase = base.replace(/\/$/, '');
  window.API = LV.apiBase; // compatibilité avec le code existant (window.API + '/api/…')

  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  /**
   * POST JSON vers /api/<path>. Réessaie une fois sur erreur réseau / 5xx.
   * Lève une Error avec .status et .code (ex: 'rate_limited', 'timeout', 'offline').
   */
  LV.api = {
    post: function (path, data, opts) {
      opts = opts || {};
      var url = LV.apiBase + (path.charAt(0) === '/' ? path : '/api/' + path);
      var timeout = opts.timeout || 15000;
      var retries = opts.retries == null ? 1 : opts.retries;

      function attempt(n) {
        if (navigator.onLine === false) {
          var off = new Error('offline'); off.code = 'offline'; return Promise.reject(off);
        }
        var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
        var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, timeout);
        return fetch(url, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data || {}), signal: ctrl ? ctrl.signal : undefined
        }).then(function (r) {
          clearTimeout(timer);
          return r.json().catch(function () { return {}; }).then(function (j) {
            if (r.ok) return j;
            var e = new Error('HTTP ' + r.status); e.status = r.status; e.code = (j && j.error) || 'http_' + r.status;
            throw e;
          });
        }).catch(function (e) {
          clearTimeout(timer);
          if (e && e.name === 'AbortError') { e = new Error('timeout'); e.code = 'timeout'; }
          var retryable = !e.status || e.status >= 500;
          if (retryable && n < retries && e.code !== 'rate_limited') {
            return sleep(600 * (n + 1)).then(function () { return attempt(n + 1); });
          }
          if (!e.code) e.code = 'network';
          throw e;
        });
      }
      return attempt(0);
    },
    // Sonde silencieuse pour réveiller la fonction serverless (cold start).
    warmup: function () {
      try { fetch(LV.apiBase + '/api/ping', { method: 'GET' }).catch(function () {}); } catch (e) {}
    }
  };

  // Ancienne API appelée un peu partout (dialogue.js, learning.js). Cache borné, plus de fuite mémoire.
  var _cache = {}, _cacheKeys = [];
  window.callAPIWithFallback = function (endpoint, data, options) {
    options = options || {};
    var path = endpoint;
    if (path.indexOf('/api/') !== 0 && !/^https?:/.test(path)) path = '/api' + (path.charAt(0) === '/' ? '' : '/') + path;
    var cacheable = !options.skipCache && /\/(translate|correct)$/.test(path); // jamais de cache pour les dialogues
    var key = path + JSON.stringify(data);
    if (cacheable && _cache[key]) return Promise.resolve(_cache[key]);
    return LV.api.post(path, data, { timeout: options.timeout || 15000 }).then(function (res) {
      if (cacheable) {
        _cache[key] = res; _cacheKeys.push(key);
        if (_cacheKeys.length > 80) delete _cache[_cacheKeys.shift()];
      }
      return res;
    });
  };

  // ── Utilitaires ──────────────────────────────────────────────────
  // Date locale AAAA-MM-JJ (toISOString donne la date UTC : en Haïti le "jour"
  // basculait à 19 h et faussait les séries de jours consécutifs).
  LV.dateKey = function (d) {
    d = d || new Date();
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  };
  // Les navigateurs refusent (et signalent en console) toute vibration avant le premier toucher de l'utilisateur.
  LV._touched = false;
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
    window.addEventListener(ev, function () { LV._touched = true; }, { once: true, capture: true, passive: true });
  });
  LV.haptic = function (p) {
    try { if (LV._touched && navigator.vibrate && !LV.reducedMotion && (!LV.prefs || LV.prefs.haptics)) navigator.vibrate(p || 10); } catch (e) {}
  };
  LV.reducedMotion = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  LV.esc = function (t) {
    return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };
  LV.debounce = function (fn, ms) {
    var t; return function () { var a = arguments, s = this; clearTimeout(t); t = setTimeout(function () { fn.apply(s, a); }, ms); };
  };

  // Éléments cliquables non-<button> (tuiles de langue…) : Entrée / Espace = clic (clavier, lecteurs d'écran)
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.getAttribute && e.target.getAttribute('role') === 'button' && e.target.tagName !== 'BUTTON') {
      e.preventDefault(); e.target.click();
    }
  });

  // ── Mini bus d'évènements ────────────────────────────────────────
  LV.on = function (name, fn) { document.addEventListener('lv:' + name, function (e) { fn(e.detail || {}); }); };
  LV.emit = function (name, detail) { document.dispatchEvent(new CustomEvent('lv:' + name, { detail: detail })); };

  // ── Navigation ───────────────────────────────────────────────────
  var current = null;
  var layers = [];           // fenêtres superposées ouvertes (dialogue, etc.)
  var ignorePop = 0;

  LV.currentScreen = function () { return current; };

  // Implémentation interne. window.showScreen l'enveloppe (d'autres modules, comme
  // curriculum_hooks.js, ajoutent leur propre enveloppe par-dessus).
  LV._show = function (id, opts) {
    opts = opts || {};
    var target = document.getElementById(id);
    if (!target) { console.warn('showScreen: écran introuvable', id); return; }
    var prev = current;
    document.querySelectorAll('.screen.active').forEach(function (s) {
      s.classList.remove('active'); s.style.display = '';
    });
    target.classList.add('active');
    current = id;
    document.body.setAttribute('data-screen', id);
    if (!opts.keepScroll) target.scrollTop = 0;
    // Historique : un écran = une entrée, pour que "retour" fonctionne comme dans une vraie app.
    try {
      if (opts.silent) { /* déclenché par popstate */ }
      else if (prev === null || opts.replace) history.replaceState({ lvScreen: id }, '');
      else if (prev !== id) history.pushState({ lvScreen: id }, '');
    } catch (e) {}
    if (prev !== id) LV.emit('screen', { id: id, prev: prev });
  };
  window.showScreen = function (id, opts) { return LV._show(id, opts); };

  // Fenêtres superposées : le bouton retour les ferme avant de quitter l'écran.
  LV.nav = {
    pushLayer: function (name, closeFn) {
      layers.push({ name: name, close: closeFn });
      try { history.pushState({ lvLayer: name }, ''); } catch (e) {}
    },
    // À appeler quand la fenêtre se ferme par un autre moyen (bouton ✕).
    popLayer: function (name) {
      var i = layers.map(function (l) { return l.name; }).lastIndexOf(name);
      if (i < 0) return;
      layers.splice(i, 1);
      ignorePop++;
      try { history.back(); } catch (e) { ignorePop--; }
    }
  };

  window.addEventListener('popstate', function (e) {
    if (ignorePop > 0) { ignorePop--; return; }
    if (layers.length) { // une fenêtre est ouverte : on la ferme
      var top = layers.pop();
      try { top.close(true); } catch (err) {}
      return;
    }
    var st = e.state;
    if (st && st.lvScreen) {
      LV._show(st.lvScreen, { silent: true });
      try { if (typeof window._updateProgramBadge === 'function') window._updateProgramBadge(); } catch (err) {}
    }
  });

  // ── Capture des erreurs ──────────────────────────────────────────
  LV.errors = [];
  function report(msg, src) {
    LV.errors.push({ msg: msg, src: src || '', t: Date.now() });
    if (LV.errors.length > 30) LV.errors.shift();
    if (DEBUG) {
      var el = document.getElementById('debug');
      if (el) { el.textContent = 'ERREUR JS : ' + msg + (src ? ' (' + src + ')' : ''); el.classList.add('err'); }
    }
  }
  window.addEventListener('error', function (e) {
    report(e.message, (e.filename || '').split('/').pop() + ':' + e.lineno);
  });
  window.addEventListener('unhandledrejection', function (e) {
    report('Promesse rejetée : ' + (e.reason && e.reason.message || e.reason), '');
  });
  LV.debugMsg = function (msg, isErr) {
    if (!DEBUG) return;
    var el = document.getElementById('debug');
    if (el) { el.textContent = msg; el.classList.toggle('err', !!isErr); }
  };

  // ── Auto-diagnostic (console) : liste les boutons dont la fonction manque ─
  window.addEventListener('load', function () {
    setTimeout(function () {
      var missing = [];
      document.querySelectorAll('[onclick]').forEach(function (el) {
        var m = /^\s*([A-Za-z_$][\w$]*)\s*\(/.exec(el.getAttribute('onclick') || '');
        if (m && typeof window[m[1]] !== 'function' && missing.indexOf(m[1]) < 0) missing.push(m[1]);
      });
      if (missing.length) {
        console.warn('[LinguaVillage] Fonctions manquantes pour des boutons :', missing.join(', '));
        report('Fonctions manquantes : ' + missing.join(', '), 'auto-diagnostic');
      }
    }, 1500);
  });

  // Vibration/son désactivables (réglage futur) : LV.prefs
  LV.prefs = { haptics: true, sound: true };

  console.log('✅ core.js chargé — API : ' + (LV.apiBase || '(même origine)'));
})();
