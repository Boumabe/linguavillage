// animation.js — LinguaVillage Motion Design System
// Micro-animations + Animation d'ouverture premium
// Compatible Web/PWA (Canvas + CSS animations)
// 60 FPS, faible batterie, accessible
// ================================================================

window.LV_ANIM = (function() {
  'use strict';

  // ================================================================
  // 1. ANIMATION D'OUVERTURE — Splash Screen (2.5s)
  // Globe lumineux → mots tournants → fusion → logo LinguaVillage
  // ================================================================
  function showSplash(onComplete) {
    // Ne montrer qu'une seule fois
    try {
      if (localStorage.getItem('lv_splash_seen') === '1') {
        if (onComplete) onComplete();
        return;
      }
    } catch(e) {}

    var el = document.createElement('div');
    el.id  = 'lv-splash';
    el.style.cssText = [
      'position:fixed;inset:0;z-index:99999;',
      'background:radial-gradient(ellipse at 50% 45%, #0a1628 0%, #030608 100%);',
      'display:flex;align-items:center;justify-content:center;',
      'overflow:hidden;'
    ].join('');

    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    el.appendChild(canvas);

    // Logo texte (révélé à la fin)
    var logoEl = document.createElement('div');
    logoEl.style.cssText = [
      'position:absolute;text-align:center;',
      'opacity:0;transform:scale(0.8);',
      'transition:opacity 0.6s ease, transform 0.6s ease;',
      'pointer-events:none;'
    ].join('');
    logoEl.innerHTML = [
      '<div style="font-family:Cinzel,serif;font-size:clamp(28px,7vw,42px);',
      'font-weight:700;color:#fff;letter-spacing:0.04em;',
      'text-shadow:0 0 30px rgba(255,215,0,0.8),0 0 60px rgba(255,215,0,0.4);">',
      'Lingua<span style="color:#4ecf70">Village</span></div>',
      '<div style="font-size:clamp(10px,2.5vw,14px);color:rgba(255,255,255,0.45);',
      'letter-spacing:0.18em;margin-top:6px;font-weight:500;">APPRENDS EN VIVANT</div>'
    ].join('');
    el.appendChild(logoEl);

    document.body.appendChild(el);

    var W, H, cx, cy, dpr;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      W   = el.offsetWidth;
      H   = el.offsetHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      cx = W / 2;
      cy = H / 2;
    }
    resize();

    var ctx2d = canvas.getContext('2d');
    ctx2d.scale(dpr, dpr);

    // Mots dans différentes langues
    var words = [
      {t:'Bonjour',   lang:'fr', angle:0,     radius:0, color:'#4a9eff'},
      {t:'Hello',     lang:'en', angle:72,    radius:0, color:'#4ecf70'},
      {t:'Hola',      lang:'es', angle:144,   radius:0, color:'#ff9f43'},
      {t:'こんにちは', lang:'ja', angle:216,   radius:0, color:'#e040fb'},
      {t:'Привет',    lang:'ru', angle:288,   radius:0, color:'#ffd700'},
      {t:'你好',       lang:'zh', angle:36,    radius:0, color:'#ff6b6b'},
      {t:'Bonjou',    lang:'ht', angle:108,   radius:0, color:'#4ecf70'},
      {t:'Hallo',     lang:'de', angle:180,   radius:0, color:'#4a9eff'},
    ];

    var startTime = performance.now();
    var DURATION  = 2500;
    var rafId;
    var done = false;

    function ease(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
    function easeOut(t) { return 1 - Math.pow(1-t, 3); }

    function frame(now) {
      if (done) return;
      var elapsed = now - startTime;
      var p       = Math.min(elapsed / DURATION, 1);
      var ep      = ease(p);

      ctx2d.clearRect(0, 0, W, H);

      // ── Phase 1 (0–0.35) : Globe lumineux apparaît ──
      if (p < 0.65) {
        var gp     = Math.min(p / 0.35, 1);
        var gRadius= easeOut(gp) * Math.min(W, H) * 0.18;
        var gAlpha = easeOut(gp);

        // Globe — 3 couches de lumière
        [gRadius*2.2, gRadius*1.5, gRadius].forEach(function(r, i) {
          var grad = ctx2d.createRadialGradient(cx, cy, 0, cx, cy, r);
          var alpha = [0.06, 0.10, 0.22][i] * gAlpha;
          grad.addColorStop(0, 'rgba(78,207,112,' + (alpha*1.8) + ')');
          grad.addColorStop(0.5,'rgba(74,158,255,' + alpha + ')');
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx2d.fillStyle = grad;
          ctx2d.beginPath();
          ctx2d.arc(cx, cy, r, 0, Math.PI * 2);
          ctx2d.fill();
        });

        // Contour globe
        ctx2d.beginPath();
        ctx2d.arc(cx, cy, gRadius * 0.72, 0, Math.PI * 2);
        ctx2d.strokeStyle = 'rgba(255,215,0,' + (gAlpha * 0.55) + ')';
        ctx2d.lineWidth   = 1.5;
        ctx2d.stroke();
      }

      // ── Phase 2 (0.15–0.65) : Mots apparaissent et tournent ──
      if (p > 0.15 && p < 0.80) {
        var wp      = Math.min((p - 0.15) / 0.50, 1);
        var maxRad  = Math.min(W, H) * 0.30;
        var rotation= p * Math.PI * 2.5;

        words.forEach(function(w, i) {
          var wDelay  = i * 0.06;
          var wAlpha  = Math.max(0, Math.min((wp - wDelay) / 0.25, 1));
          if (wAlpha <= 0) return;

          // En phase de convergence (p > 0.65), les mots reviennent au centre
          var convergePct = p > 0.65 ? Math.min((p - 0.65) / 0.20, 1) : 0;
          var r = (1 - convergePct) * (easeOut(wAlpha) * maxRad);

          var angleRad = (w.angle + rotation * (57.3)) * Math.PI / 180;
          var wx = cx + Math.cos(angleRad) * r;
          var wy = cy + Math.sin(angleRad) * r;

          ctx2d.save();
          ctx2d.globalAlpha = wAlpha * (1 - convergePct * 0.8);
          ctx2d.translate(wx, wy);
          ctx2d.rotate(angleRad + Math.PI / 2);

          var fontSize = Math.max(10, Math.min(W * 0.038, 16));
          ctx2d.font = 'bold ' + fontSize + 'px system-ui, sans-serif';
          ctx2d.fillStyle = w.color;
          ctx2d.textAlign = 'center';
          ctx2d.textBaseline = 'middle';
          ctx2d.shadowColor = w.color;
          ctx2d.shadowBlur  = 8 * wAlpha;
          ctx2d.fillText(w.t, 0, 0);
          ctx2d.restore();
        });
      }

      // ── Phase 3 (0.72–0.90) : Impulsion lumineuse ──
      if (p > 0.72 && p < 0.92) {
        var ip    = (p - 0.72) / 0.20;
        var burst = Math.sin(ip * Math.PI);
        var bRad  = burst * Math.min(W, H) * 0.45;

        var bGrad = ctx2d.createRadialGradient(cx, cy, 0, cx, cy, bRad);
        bGrad.addColorStop(0,   'rgba(255,215,0,' + (burst * 0.55) + ')');
        bGrad.addColorStop(0.4, 'rgba(78,207,112,' + (burst * 0.25) + ')');
        bGrad.addColorStop(1,   'rgba(0,0,0,0)');
        ctx2d.fillStyle = bGrad;
        ctx2d.fillRect(0, 0, W, H);
      }

      // ── Phase 4 (0.85–1.0) : Logo apparaît ──
      if (p > 0.83 && !logoEl.style.opacity.startsWith('1')) {
        logoEl.style.opacity   = '1';
        logoEl.style.transform = 'scale(1)';
      }

      if (p < 1) {
        rafId = requestAnimationFrame(frame);
      } else {
        // Terminé
        done = true;
        setTimeout(function() {
          el.style.transition = 'opacity 0.45s ease';
          el.style.opacity    = '0';
          setTimeout(function() {
            if (el.parentNode) el.remove();
            try { localStorage.setItem('lv_splash_seen', '1'); } catch(e) {}
            if (onComplete) onComplete();
          }, 480);
        }, 400);
      }
    }

    // Jouer le son signature
    setTimeout(function() {
      if (window.LV_SOUND) window.LV_SOUND.play('signature');
    }, 50);

    rafId = requestAnimationFrame(frame);
  }

  // ================================================================
  // 2. MICRO-ANIMATIONS
  // ================================================================

  // ── XP Popup flottant ──
  function xpPop(amount, sourceEl) {
    var pop = document.createElement('div');
    var x   = window.innerWidth / 2;
    var y   = window.innerHeight * 0.35;

    if (sourceEl) {
      var r = sourceEl.getBoundingClientRect();
      x = r.left + r.width / 2;
      y = r.top;
    }

    pop.style.cssText = [
      'position:fixed;left:' + x + 'px;top:' + y + 'px;',
      'transform:translate(-50%,-50%);',
      'font-family:Cinzel,serif;font-size:1.1rem;font-weight:900;',
      'color:#ffd700;text-shadow:0 0 12px rgba(255,215,0,0.8);',
      'pointer-events:none;z-index:9999;',
      'animation:lvXpPop 1.1s cubic-bezier(0.22,1,0.36,1) forwards;'
    ].join('');
    pop.textContent = '+' + amount + ' XP';
    document.body.appendChild(pop);
    setTimeout(function() { pop.remove(); }, 1200);
    if (window.LV_SOUND) window.LV_SOUND.play('xp');
  }

  // ── Badge notification ──
  function badgePop(icon, title, desc) {
    var el = document.createElement('div');
    el.style.cssText = [
      'position:fixed;top:max(60px,env(safe-area-inset-top)+60px);',
      'left:50%;transform:translateX(-50%) translateY(-120px);',
      'background:linear-gradient(135deg,rgba(15,21,32,0.98),rgba(20,28,45,0.98));',
      'border:1.5px solid #ffd700;border-radius:20px;',
      'padding:14px 20px;display:flex;align-items:center;gap:14px;',
      'box-shadow:0 8px 40px rgba(255,215,0,0.25),0 2px 12px rgba(0,0,0,0.6);',
      'z-index:9998;min-width:260px;max-width:90vw;',
      'transition:transform 0.45s cubic-bezier(0.22,1,0.36,1);',
      'will-change:transform;'
    ].join('');
    el.innerHTML = '<div style="font-size:2rem;line-height:1;flex-shrink:0">' + icon + '</div>'
      + '<div><div style="font-weight:800;font-size:0.92rem;color:#ffd700;">🏅 ' + title + '</div>'
      + '<div style="font-size:0.72rem;color:rgba(255,255,255,0.50);margin-top:2px">' + desc + '</div></div>';
    document.body.appendChild(el);
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        el.style.transform = 'translateX(-50%) translateY(0)';
      });
    });
    if (window.LV_SOUND) window.LV_SOUND.play('badge');
    setTimeout(function() {
      el.style.transform = 'translateX(-50%) translateY(-120px)';
      setTimeout(function() { el.remove(); }, 500);
    }, 3200);
  }

  // ── Validation checkmark (pulse vert) ──
  function validPulse(el) {
    if (!el) return;
    el.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
    el.style.transform  = 'scale(1.06)';
    el.style.boxShadow  = '0 0 0 3px rgba(78,207,112,0.5)';
    setTimeout(function() {
      el.style.transform = 'scale(1)';
      el.style.boxShadow = '';
    }, 180);
    if (window.LV_SOUND) window.LV_SOUND.play('correct');
  }

  // ── Erreur shake ──
  function errorShake(el) {
    if (!el) return;
    el.style.animation = 'lvShake 0.38s ease';
    el.addEventListener('animationend', function() { el.style.animation = ''; }, { once: true });
    if (window.LV_SOUND) window.LV_SOUND.play('wrong');
  }

  // ── Combo streak visuel ──
  function comboFlash(count) {
    var el  = document.createElement('div');
    var msg = count >= 7 ? '🔥 COMBO x' + count + ' !!!'
            : count >= 5 ? '⚡ SÉRIE x' + count + ' !'
            : '✨ x' + count;
    var col = count >= 7 ? '#ff9f43' : count >= 5 ? '#ffd700' : '#4ecf70';
    el.style.cssText = [
      'position:fixed;top:50%;left:50%;',
      'transform:translate(-50%,-50%) scale(0.5);',
      'font-family:Cinzel,serif;font-size:clamp(1.2rem,5vw,2rem);',
      'font-weight:900;color:' + col + ';',
      'text-shadow:0 0 20px ' + col + ';',
      'pointer-events:none;z-index:9999;',
      'animation:lvCombo 0.9s cubic-bezier(0.22,1,0.36,1) forwards;'
    ].join('');
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function() { el.remove(); }, 950);
    if (window.LV_SOUND) window.LV_SOUND.play('combo', count);
  }

  // ── Level up cinématique ──
  function levelUpCinema(newLevel, zoneName) {
    var ov = document.createElement('div');
    ov.style.cssText = [
      'position:fixed;inset:0;z-index:9997;',
      'background:rgba(0,0,0,0.88);display:flex;',
      'align-items:center;justify-content:center;',
      'opacity:0;transition:opacity 0.35s ease;'
    ].join('');
    ov.innerHTML = [
      '<div style="text-align:center;padding:32px 24px;animation:lvLevelUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both">',
      '<div style="font-size:4rem;margin-bottom:8px;animation:lvSpin 0.8s ease 0.1s both">⭐</div>',
      '<div style="font-family:Cinzel,serif;font-size:0.72rem;color:#ffd700;letter-spacing:0.2em;margin-bottom:4px">NIVEAU DÉBLOQUÉ</div>',
      '<div style="font-family:Cinzel,serif;font-size:2rem;color:#fff;font-weight:900;margin-bottom:6px">' + (zoneName||'') + '</div>',
      '<div style="font-size:0.82rem;color:rgba(255,255,255,0.45);margin-bottom:24px">Zone ' + newLevel + ' accessible !</div>',
      '<button onclick="this.parentElement.parentElement.parentElement.remove()" ',
      'style="background:linear-gradient(135deg,#4ecf70,#2fa855);border:none;border-radius:16px;',
      'padding:13px 32px;font-family:Cinzel,serif;font-weight:700;font-size:0.9rem;',
      'color:#fff;cursor:pointer;box-shadow:0 4px 20px rgba(78,207,112,0.4)">',
      '✨ Explorer !</button></div>'
    ].join('');
    document.body.appendChild(ov);
    requestAnimationFrame(function() {
      requestAnimationFrame(function() { ov.style.opacity = '1'; });
    });
    if (window.LV_SOUND) window.LV_SOUND.play('levelUp');
    if (window.launchConfetti) window.launchConfetti();
  }

  // ── Coffre ouverture ──
  function chestOpen(el, reward) {
    if (el) {
      el.style.transition = 'transform 0.3s ease';
      el.style.transform  = 'scale(1.2) rotate(5deg)';
      setTimeout(function() { el.style.transform = 'scale(1) rotate(0)'; }, 320);
    }
    var pop = document.createElement('div');
    pop.style.cssText = [
      'position:fixed;top:50%;left:50%;',
      'transform:translate(-50%,-50%);',
      'text-align:center;pointer-events:none;z-index:9998;',
      'animation:lvChest 1.4s cubic-bezier(0.22,1,0.36,1) forwards;'
    ].join('');
    pop.innerHTML = '<div style="font-size:4rem;margin-bottom:6px">🎁</div>'
      + '<div style="font-family:Cinzel,serif;color:#ffd700;font-size:1.1rem;font-weight:800;">' + (reward||'+50 XP') + '</div>';
    document.body.appendChild(pop);
    setTimeout(function() { pop.remove(); }, 1500);
    if (window.LV_SOUND) window.LV_SOUND.play('chest');
    if (window.launchConfetti) window.launchConfetti();
  }

  // ── Notification XP bar pulse ──
  function xpBarPulse() {
    var bar = document.getElementById('xpFill');
    if (!bar) return;
    bar.style.transition    = 'width 0.6s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease';
    bar.style.boxShadow     = '0 0 12px rgba(255,215,0,0.8)';
    setTimeout(function() { bar.style.boxShadow = ''; }, 800);
  }

  // ================================================================
  // 3. CSS KEYFRAMES (injectés une seule fois)
  // ================================================================
  (function injectCSS() {
    if (document.getElementById('lv-anim-css')) return;
    var style = document.createElement('style');
    style.id  = 'lv-anim-css';
    style.textContent = [
      '@keyframes lvXpPop{',
      '0%{opacity:0;transform:translate(-50%,-50%) scale(0.5);}',
      '20%{opacity:1;transform:translate(-50%,-50%) scale(1.2);}',
      '60%{opacity:1;transform:translate(-50%,-150%) scale(1);}',
      '100%{opacity:0;transform:translate(-50%,-250%) scale(0.8);}',
      '}',
      '@keyframes lvShake{',
      '0%{transform:translateX(0);}',
      '18%{transform:translateX(-8px);}',
      '36%{transform:translateX(8px);}',
      '54%{transform:translateX(-6px);}',
      '72%{transform:translateX(6px);}',
      '90%{transform:translateX(-3px);}',
      '100%{transform:translateX(0);}',
      '}',
      '@keyframes lvCombo{',
      '0%{opacity:0;transform:translate(-50%,-50%) scale(0.4);}',
      '35%{opacity:1;transform:translate(-50%,-50%) scale(1.1);}',
      '65%{opacity:1;transform:translate(-50%,-50%) scale(1);}',
      '100%{opacity:0;transform:translate(-50%,-50%) scale(0.85);}',
      '}',
      '@keyframes lvLevelUp{',
      '0%{opacity:0;transform:scale(0.6) translateY(30px);}',
      '100%{opacity:1;transform:scale(1) translateY(0);}',
      '}',
      '@keyframes lvSpin{',
      '0%{transform:rotate(-180deg) scale(0);}',
      '100%{transform:rotate(0deg) scale(1);}',
      '}',
      '@keyframes lvChest{',
      '0%{opacity:0;transform:translate(-50%,-50%) scale(0.3);}',
      '30%{opacity:1;transform:translate(-50%,-50%) scale(1.15);}',
      '65%{opacity:1;transform:translate(-50%,-50%) scale(1);}',
      '100%{opacity:0;transform:translate(-50%,-80%) scale(0.7);}',
      '}',
      // Pulse pour éléments interactifs
      '@keyframes lvPulse{',
      '0%,100%{opacity:1;}50%{opacity:0.6;}',
      '}',
      // Gradient animé pour les boutons principaux
      '@keyframes lvGradShift{',
      '0%{background-position:0% 50%;}',
      '50%{background-position:100% 50%;}',
      '100%{background-position:0% 50%;}',
      '}',
      // Floating pour les éléments de récompense
      '@keyframes lvFloat{',
      '0%,100%{transform:translateY(0);}',
      '50%{transform:translateY(-6px);}',
      '}',
      // Shimmer pour les éléments premium
      '@keyframes lvShimmer{',
      '0%{background-position:-200% center;}',
      '100%{background-position:200% center;}',
      '}',
    ].join('');
    document.head.appendChild(style);
  })();

  // ================================================================
  // 4. RÉTENTION — Mécanismes J1/J7/J30
  // ================================================================

  // J1 : Message de bienvenue personnalisé + défi immédiat
  function checkJ1Retention() {
    try {
      var key = 'lv_j1_welcomed';
      if (localStorage.getItem(key)) return;
      var nl = (window.S && S.nativeLang) || 'fr';
      var msgs = {
        fr: '🎉 Bienvenue ! Complète ta première conversation aujourd\'hui pour débloquer ton 1er badge !',
        en: '🎉 Welcome! Complete your first conversation today to unlock your 1st badge!',
        es: '🎉 ¡Bienvenido! ¡Completa tu primera conversación hoy para desbloquear tu 1er badge!',
        ht: '🎉 Byenveni! Fini premye konvèsasyon ou jodi a pou debloke 1ye badj ou!',
        de: '🎉 Willkommen! Beende heute dein erstes Gespräch um dein 1. Abzeichen zu erhalten!',
        ru: '🎉 Добро пожаловать! Завершите первый разговор сегодня, чтобы получить 1-й значок!',
        zh: '🎉 欢迎！今天完成第一次对话以解锁您的第一个徽章！',
        ja: '🎉 ようこそ！今日最初の会話を完了して最初のバッジを解除しましょう！'
      };
      setTimeout(function() {
        if (window.showNotif) showNotif(msgs[nl] || msgs.fr, 4000);
        localStorage.setItem(key, '1');
      }, 2000);
    } catch(e) {}
  }

  // J7 : Rappel streak + récompense bonus
  function checkJ7Retention() {
    try {
      var streak = (window.S_game && S_game.streak) || 0;
      var nl     = (window.S && S.nativeLang) || 'fr';
      if (streak === 7) {
        var msgs = {
          fr: '🏆 7 jours de suite ! Tu es un vrai linguiste. +50 XP BONUS !',
          en: '🏆 7 days in a row! You\'re a real linguist. +50 XP BONUS!',
          es: '🏆 ¡7 días seguidos! Eres un verdadero lingüista. ¡+50 XP BONUS!',
          ht: '🏆 7 jou youn apre lòt! Ou se yon vrè lengwis. +50 XP BONUS!',
          de: '🏆 7 Tage am Stück! Du bist ein echter Linguist. +50 XP BONUS!',
          ru: '🏆 7 дней подряд! Ты настоящий лингвист. +50 БОНУСНЫХ XP!',
          zh: '🏆 连续7天！你是真正的语言学家。+50 奖励XP！',
          ja: '🏆 7日連続！あなたは本物の言語学者です。+50 ボーナスXP！'
        };
        if (window.gainXP) gainXP(50);
        if (window.showNotif) showNotif(msgs[nl] || msgs.fr, 4500);
        if (window.LV_SOUND) window.LV_SOUND.play('levelUp');
      }
    } catch(e) {}
  }

  // J30 : Palier légendaire
  function checkJ30Retention() {
    try {
      var streak = (window.S_game && S_game.streak) || 0;
      if (streak === 30) {
        levelUpCinema(30, '👑 Légendaire');
        if (window.gainXP) gainXP(200);
      }
    } catch(e) {}
  }

  // Rappel quotidien intelligent (si pas joué depuis 20h)
  function scheduleSmartReminder() {
    try {
      var last = localStorage.getItem('lv_last_active');
      if (!last) { localStorage.setItem('lv_last_active', Date.now()); return; }
      var elapsed = Date.now() - parseInt(last);
      var nl = (window.S && S.nativeLang) || 'fr';
      if (elapsed > 20 * 3600 * 1000) {
        var msgs = {
          fr: '👋 Content de te revoir ! Tes mots t\'ont manqué…',
          en: '👋 Good to see you back! Your words missed you…',
          es: '👋 ¡Qué bueno verte de nuevo! Tus palabras te extrañaron…',
          ht: '👋 Kontan wè ou ankò! Mo ou yo te sonje ou…',
          de: '👋 Schön dich wiederzusehen! Deine Wörter haben dich vermisst…',
          ru: '👋 Рады видеть тебя снова! Твои слова скучали по тебе…',
          zh: '👋 很高兴再次见到你！你的单词想你了…',
          ja: '👋 また会えて嬉しいです！あなたの言葉があなたを恋しがっていました…'
        };
        setTimeout(function() {
          if (window.showNotif) showNotif(msgs[nl] || msgs.fr, 4000);
        }, 1500);
      }
      localStorage.setItem('lv_last_active', Date.now());
    } catch(e) {}
  }

  return {
    showSplash:         showSplash,
    xpPop:              xpPop,
    badgePop:           badgePop,
    validPulse:         validPulse,
    errorShake:         errorShake,
    comboFlash:         comboFlash,
    levelUpCinema:      levelUpCinema,
    chestOpen:          chestOpen,
    xpBarPulse:         xpBarPulse,
    checkJ1Retention:   checkJ1Retention,
    checkJ7Retention:   checkJ7Retention,
    checkJ30Retention:  checkJ30Retention,
    scheduleSmartReminder: scheduleSmartReminder,
  };

})();

// Raccourcis globaux
window.xpPop       = function(a,el) { window.LV_ANIM.xpPop(a,el); };
window.badgePop    = function(i,t,d){ window.LV_ANIM.badgePop(i,t,d); };
window.comboFlash  = function(n)    { window.LV_ANIM.comboFlash(n); };
window.levelUpCinema = function(l,n){ window.LV_ANIM.levelUpCinema(l,n); };
window.chestOpen   = function(el,r) { window.LV_ANIM.chestOpen(el,r); };

console.log('✅ animation.js chargé — Motion Design LinguaVillage');
