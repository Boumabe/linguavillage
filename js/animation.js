// animation.js v2 — LinguaVillage Motion Design
// BUGS CORRIGÉS : canvas 0x0, localStorage skip, écran noir
// ================================================================
window.LV_ANIM = (function() {
  'use strict';

  // ================================================================
  // SPLASH SCREEN — 2.5s, canvas correctement dimensionné
  // ================================================================
  function showSplash(onComplete) {
    // Sécurité absolue : timeout 5s pour éviter tout blocage
    var _safety = setTimeout(function() {
      _done();
    }, 5000);

    function _done() {
      clearTimeout(_safety);
      var sp = document.getElementById('lv-splash');
      if (sp) {
        sp.style.transition = 'opacity 0.35s ease';
        sp.style.opacity    = '0';
        setTimeout(function() { if (sp.parentNode) sp.remove(); }, 380);
      }
      document.querySelectorAll('.screen').forEach(function(s) {
        s.style.visibility = '';
      });
      if (onComplete) onComplete();
    }

    // Créer le conteneur splash
    var el = document.createElement('div');
    el.id  = 'lv-splash';
    el.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#030a18;overflow:hidden;';
    document.body.appendChild(el);

    // Canvas — dimensionné avec window.innerWidth/Height (fiable dès le début)
    var canvas = document.createElement('canvas');
    el.appendChild(canvas);

    // Logo (révélé à la fin)
    var logoEl = document.createElement('div');
    logoEl.style.cssText = [
      'position:absolute;top:50%;left:50%;',
      'transform:translate(-50%,-50%) scale(0.85);',
      'text-align:center;opacity:0;',
      'transition:opacity 0.55s ease,transform 0.55s cubic-bezier(0.22,1,0.36,1);',
      'pointer-events:none;z-index:2;white-space:nowrap;'
    ].join('');
    logoEl.innerHTML = '<div style="font-family:Cinzel,serif;font-size:clamp(26px,8vw,44px);'
      + 'font-weight:700;color:#fff;letter-spacing:0.05em;'
      + 'text-shadow:0 0 32px rgba(255,215,0,0.9),0 0 64px rgba(255,215,0,0.4);">'
      + 'Lingua<span style="color:#4ecf70">Village</span></div>'
      + '<div style="font-size:clamp(9px,2.8vw,13px);color:rgba(255,255,255,0.42);'
      + 'letter-spacing:0.20em;margin-top:8px;font-weight:600;">APPRENDS EN VIVANT</div>';
    el.appendChild(logoEl);

    // Dimensionner le canvas
    var dpr = window.devicePixelRatio || 1;
    var W   = window.innerWidth  || 360;
    var H   = window.innerHeight || 640;
    canvas.width        = Math.round(W * dpr);
    canvas.height       = Math.round(H * dpr);
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:' + W + 'px;height:' + H + 'px;';
    var cx = W / 2;
    var cy = H / 2;

    var ctx = canvas.getContext('2d');

    var words = [
      {t:'Bonjour',   a:0,   c:'#4a9eff'},
      {t:'Hello',     a:72,  c:'#4ecf70'},
      {t:'Hola',      a:144, c:'#ff9f43'},
      {t:'こんにちは', a:216, c:'#e040fb'},
      {t:'Привет',    a:288, c:'#ffd700'},
      {t:'你好',       a:36,  c:'#ff6b6b'},
      {t:'Bonjou',    a:108, c:'#4ecf70'},
      {t:'Hallo',     a:180, c:'#4a9eff'},
    ];

    var DURATION = 2600;
    var start    = null;
    var rafId    = null;
    var logoShown = false;

    function easeOut(t) { return 1 - Math.pow(1-t, 3); }
    function easeSin(t) { return Math.sin(t * Math.PI); }

    function frame(now) {
      if (!start) start = now;
      var elapsed = now - start;
      var p = Math.min(elapsed / DURATION, 1);

      // Reset
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // Fond dégradé
      var bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#030a18');
      bg.addColorStop(1, '#060e22');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // ── Globe lumineux (p 0 → 0.65) ──
      var gProg  = Math.min(p / 0.32, 1);
      var gAlpha = easeOut(gProg);
      var gRad   = gAlpha * Math.min(W, H) * 0.20;
      if (gRad > 1) {
        var layers = [[gRad*2.5, 0.05], [gRad*1.6, 0.11], [gRad, 0.26]];
        layers.forEach(function(l) {
          var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, l[0]);
          g.addColorStop(0,   'rgba(78,207,112,' + (l[1]*gAlpha*1.8) + ')');
          g.addColorStop(0.5, 'rgba(74,158,255,' + (l[1]*gAlpha)     + ')');
          g.addColorStop(1,   'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(cx, cy, l[0], 0, Math.PI*2); ctx.fill();
        });
        ctx.beginPath(); ctx.arc(cx, cy, gRad*0.70, 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(255,215,0,' + (gAlpha*0.50) + ')';
        ctx.lineWidth = 1.5; ctx.stroke();
      }

      // ── Mots en rotation (p 0.12 → 0.82) ──
      if (p > 0.10) {
        var wProgress   = Math.min((p - 0.10) / 0.55, 1);
        var rotDeg      = p * 900; // ~2.5 tours
        var maxR        = Math.min(W, H) * 0.30;
        var convergePct = p > 0.65 ? easeOut(Math.min((p-0.65)/0.18, 1)) : 0;

        words.forEach(function(w, i) {
          var delay  = i * 0.062;
          var wAlpha = Math.max(0, Math.min((wProgress - delay) / 0.20, 1));
          if (wAlpha <= 0) return;
          var r      = (1 - convergePct) * easeOut(wAlpha) * maxR;
          var ang    = (w.a + rotDeg) * Math.PI / 180;
          var wx     = cx + Math.cos(ang) * r;
          var wy     = cy + Math.sin(ang) * r;
          var fa     = wAlpha * (1 - convergePct * 0.88);

          ctx.save();
          ctx.globalAlpha  = fa;
          ctx.font         = '700 ' + Math.max(11, Math.min(W*0.038, 16)) + 'px system-ui,sans-serif';
          ctx.fillStyle    = w.c;
          ctx.textAlign    = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor  = w.c;
          ctx.shadowBlur   = 10 * fa;
          ctx.fillText(w.t, wx, wy);
          ctx.restore();
        });
      }

      // ── Impulsion lumineuse (p 0.72 → 0.91) ──
      if (p > 0.72 && p < 0.92) {
        var ip    = (p - 0.72) / 0.20;
        var burst = easeSin(ip);
        var bRad  = burst * Math.min(W, H) * 0.52;
        var bG    = ctx.createRadialGradient(cx, cy, 0, cx, cy, bRad);
        bG.addColorStop(0,   'rgba(255,215,0,' + (burst*0.50) + ')');
        bG.addColorStop(0.35,'rgba(78,207,112,' + (burst*0.20) + ')');
        bG.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = bG;
        ctx.fillRect(0, 0, W, H);
      }

      // ── Logo (p > 0.82) ──
      if (p > 0.82 && !logoShown) {
        logoShown = true;
        logoEl.style.opacity   = '1';
        logoEl.style.transform = 'translate(-50%,-50%) scale(1)';
      }

      if (p < 1) {
        rafId = requestAnimationFrame(frame);
      } else {
        // Animation terminée → fermer proprement
        clearTimeout(_safety);
        setTimeout(function() {
          el.style.transition = 'opacity 0.40s ease';
          el.style.opacity    = '0';
          setTimeout(function() {
            if (el.parentNode) el.remove();
            document.querySelectorAll('.screen').forEach(function(s) {
              s.style.visibility = '';
            });
            if (onComplete) onComplete();
          }, 420);
        }, 350);
      }
    }

    // Son signature légèrement différé
    setTimeout(function() {
      if (window.LV_SOUND) window.LV_SOUND.play('signature');
    }, 80);

    // Démarrer la boucle
    rafId = requestAnimationFrame(frame);
  }

  // ================================================================
  // MICRO-ANIMATIONS
  // ================================================================

  function xpPop(amount, sourceEl) {
    var pop = document.createElement('div');
    var x = window.innerWidth / 2;
    var y = window.innerHeight * 0.35;
    if (sourceEl) {
      var r = sourceEl.getBoundingClientRect();
      x = r.left + r.width / 2; y = r.top;
    }
    pop.style.cssText = 'position:fixed;left:'+x+'px;top:'+y+'px;'
      +'transform:translate(-50%,-50%);font-family:Cinzel,serif;font-size:1.1rem;'
      +'font-weight:900;color:#ffd700;text-shadow:0 0 12px rgba(255,215,0,0.8);'
      +'pointer-events:none;z-index:9999;animation:lvXpPop 1.1s cubic-bezier(0.22,1,0.36,1) forwards;';
    pop.textContent = '+' + amount + ' XP';
    document.body.appendChild(pop);
    setTimeout(function() { pop.remove(); }, 1200);
    if (window.LV_SOUND) window.LV_SOUND.play('xp');
  }

  function badgePop(icon, title, desc) {
    var el = document.createElement('div');
    el.style.cssText = 'position:fixed;top:max(60px,env(safe-area-inset-top,0px)+60px);'
      +'left:50%;transform:translateX(-50%) translateY(-130px);'
      +'background:linear-gradient(135deg,rgba(15,21,32,0.98),rgba(20,28,45,0.98));'
      +'border:1.5px solid #ffd700;border-radius:20px;padding:14px 20px;'
      +'display:flex;align-items:center;gap:14px;'
      +'box-shadow:0 8px 40px rgba(255,215,0,0.25),0 2px 12px rgba(0,0,0,0.6);'
      +'z-index:9998;min-width:260px;max-width:90vw;'
      +'transition:transform 0.45s cubic-bezier(0.22,1,0.36,1);will-change:transform;';
    el.innerHTML = '<div style="font-size:2rem;line-height:1;flex-shrink:0">'+icon+'</div>'
      +'<div><div style="font-weight:800;font-size:0.92rem;color:#ffd700;">🏅 '+title+'</div>'
      +'<div style="font-size:0.72rem;color:rgba(255,255,255,0.50);margin-top:2px">'+desc+'</div></div>';
    document.body.appendChild(el);
    requestAnimationFrame(function() { requestAnimationFrame(function() {
      el.style.transform = 'translateX(-50%) translateY(0)';
    }); });
    if (window.LV_SOUND) window.LV_SOUND.play('badge');
    setTimeout(function() {
      el.style.transform = 'translateX(-50%) translateY(-130px)';
      setTimeout(function() { el.remove(); }, 500);
    }, 3200);
  }

  function validPulse(el) {
    if (!el) return;
    el.style.transition = 'transform 0.15s ease,box-shadow 0.15s ease';
    el.style.transform  = 'scale(1.06)';
    el.style.boxShadow  = '0 0 0 3px rgba(78,207,112,0.5)';
    setTimeout(function() { el.style.transform='scale(1)'; el.style.boxShadow=''; }, 180);
    if (window.LV_SOUND) window.LV_SOUND.play('correct');
  }

  function errorShake(el) {
    if (!el) return;
    el.style.animation = 'lvShake 0.38s ease';
    el.addEventListener('animationend', function() { el.style.animation=''; }, {once:true});
    if (window.LV_SOUND) window.LV_SOUND.play('wrong');
  }

  function comboFlash(count) {
    var el  = document.createElement('div');
    var msg = count>=7?'🔥 COMBO x'+count+' !!!' : count>=5?'⚡ SÉRIE x'+count+' !' : '✨ x'+count;
    var col = count>=7?'#ff9f43' : count>=5?'#ffd700' : '#4ecf70';
    el.style.cssText = 'position:fixed;top:50%;left:50%;'
      +'transform:translate(-50%,-50%) scale(0.5);'
      +'font-family:Cinzel,serif;font-size:clamp(1.2rem,5vw,2rem);'
      +'font-weight:900;color:'+col+';text-shadow:0 0 20px '+col+';'
      +'pointer-events:none;z-index:9999;'
      +'animation:lvCombo 0.9s cubic-bezier(0.22,1,0.36,1) forwards;';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function() { el.remove(); }, 950);
    if (window.LV_SOUND) window.LV_SOUND.play('combo', count);
  }

  function levelUpCinema(newLevel, zoneName) {
    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;z-index:9997;background:rgba(0,0,0,0.88);'
      +'display:flex;align-items:center;justify-content:center;'
      +'opacity:0;transition:opacity 0.35s ease;';
    ov.innerHTML = '<div style="text-align:center;padding:32px 24px;animation:lvLevelUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both">'
      +'<div style="font-size:4rem;margin-bottom:8px;animation:lvSpin 0.8s ease 0.1s both">⭐</div>'
      +'<div style="font-family:Cinzel,serif;font-size:0.72rem;color:#ffd700;letter-spacing:0.2em;margin-bottom:4px">NIVEAU DÉBLOQUÉ</div>'
      +'<div style="font-family:Cinzel,serif;font-size:2rem;color:#fff;font-weight:900;margin-bottom:6px">'+(zoneName||'')+'</div>'
      +'<div style="font-size:0.82rem;color:rgba(255,255,255,0.45);margin-bottom:24px">Zone '+newLevel+' accessible !</div>'
      +'<button onclick="this.closest(\'div[style*=fixed]\').remove()" '
      +'style="background:linear-gradient(135deg,#4ecf70,#2fa855);border:none;border-radius:16px;'
      +'padding:13px 32px;font-family:Cinzel,serif;font-weight:700;font-size:0.9rem;'
      +'color:#fff;cursor:pointer;box-shadow:0 4px 20px rgba(78,207,112,0.4)">✨ Explorer !</button></div>';
    document.body.appendChild(ov);
    requestAnimationFrame(function() { requestAnimationFrame(function() { ov.style.opacity='1'; }); });
    if (window.LV_SOUND) window.LV_SOUND.play('levelUp');
    if (window.launchConfetti) window.launchConfetti();
  }

  function chestOpen(el, reward) {
    if (el) {
      el.style.transition='transform 0.3s ease';
      el.style.transform='scale(1.2) rotate(5deg)';
      setTimeout(function(){el.style.transform='scale(1) rotate(0)';},320);
    }
    var pop = document.createElement('div');
    pop.style.cssText = 'position:fixed;top:50%;left:50%;'
      +'transform:translate(-50%,-50%);text-align:center;'
      +'pointer-events:none;z-index:9998;'
      +'animation:lvChest 1.4s cubic-bezier(0.22,1,0.36,1) forwards;';
    pop.innerHTML='<div style="font-size:4rem;margin-bottom:6px">🎁</div>'
      +'<div style="font-family:Cinzel,serif;color:#ffd700;font-size:1.1rem;font-weight:800;">'+(reward||'+50 XP')+'</div>';
    document.body.appendChild(pop);
    setTimeout(function(){pop.remove();},1500);
    if (window.LV_SOUND) window.LV_SOUND.play('chest');
    if (window.launchConfetti) window.launchConfetti();
  }

  function xpBarPulse() {
    var bar = document.getElementById('xpFill');
    if (!bar) return;
    bar.style.boxShadow = '0 0 12px rgba(255,215,0,0.8)';
    setTimeout(function() { bar.style.boxShadow=''; }, 800);
  }

  // ================================================================
  // CSS KEYFRAMES
  // ================================================================
  (function() {
    if (document.getElementById('lv-anim-css')) return;
    var s = document.createElement('style');
    s.id  = 'lv-anim-css';
    s.textContent = [
      '@keyframes lvXpPop{0%{opacity:0;transform:translate(-50%,-50%) scale(0.5);}20%{opacity:1;transform:translate(-50%,-50%) scale(1.2);}60%{opacity:1;transform:translate(-50%,-150%) scale(1);}100%{opacity:0;transform:translate(-50%,-250%) scale(0.8);}}',
      '@keyframes lvShake{0%{transform:translateX(0);}18%{transform:translateX(-8px);}36%{transform:translateX(8px);}54%{transform:translateX(-6px);}72%{transform:translateX(6px);}90%{transform:translateX(-3px);}100%{transform:translateX(0);}}',
      '@keyframes lvCombo{0%{opacity:0;transform:translate(-50%,-50%) scale(0.4);}35%{opacity:1;transform:translate(-50%,-50%) scale(1.1);}65%{opacity:1;transform:translate(-50%,-50%) scale(1);}100%{opacity:0;transform:translate(-50%,-50%) scale(0.85);}}',
      '@keyframes lvLevelUp{0%{opacity:0;transform:scale(0.6) translateY(30px);}100%{opacity:1;transform:scale(1) translateY(0);}}',
      '@keyframes lvSpin{0%{transform:rotate(-180deg) scale(0);}100%{transform:rotate(0deg) scale(1);}}',
      '@keyframes lvChest{0%{opacity:0;transform:translate(-50%,-50%) scale(0.3);}30%{opacity:1;transform:translate(-50%,-50%) scale(1.15);}65%{opacity:1;transform:translate(-50%,-50%) scale(1);}100%{opacity:0;transform:translate(-50%,-80%) scale(0.7);}}',
      '@keyframes lvPulse{0%,100%{opacity:1;}50%{opacity:0.6;}}',
      '@keyframes lvGradShift{0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}',
      '@keyframes lvFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);}}',
      '@keyframes lvShimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}',
      '@keyframes lvScreenIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}',
    ].join('');
    document.head.appendChild(s);
  })();

  // ================================================================
  // RÉTENTION J1/J7/J30
  // ================================================================
  function checkJ1Retention() {
    try {
      if (localStorage.getItem('lv_j1_welcomed')) return;
      var nl   = (window.S && S.nativeLang) || 'fr';
      var msgs = {fr:'🎉 Bienvenue ! Complète ta 1re conversation pour débloquer ton 1er badge !',en:'🎉 Welcome! Complete your 1st conversation to unlock your 1st badge!',es:'🎉 ¡Bienvenido! ¡Completa tu 1ª conversación para desbloquear tu 1er badge!',ht:'🎉 Byenveni! Fini 1ye konvèsasyon ou pou debloke 1ye badj ou!',de:'🎉 Willkommen! Beende dein 1. Gespräch um dein 1. Abzeichen zu erhalten!',ru:'🎉 Добро пожаловать! Завершите 1-й разговор, чтобы получить значок!',zh:'🎉 欢迎！完成第一次对话以解锁徽章！',ja:'🎉 ようこそ！最初の会話を完了してバッジを解除しましょう！'};
      setTimeout(function() {
        if (window.showNotif) showNotif(msgs[nl]||msgs.fr, 4000);
        localStorage.setItem('lv_j1_welcomed', '1');
      }, 2000);
    } catch(e) {}
  }

  function checkJ7Retention() {
    try {
      var streak = (window.S_game && S_game.streak) || 0;
      var nl     = (window.S && S.nativeLang) || 'fr';
      if (streak === 7) {
        var msgs = {fr:'🏆 7 jours de suite ! Tu es un vrai linguiste. +50 XP BONUS !',en:'🏆 7 days in a row! You\'re a real linguist. +50 XP BONUS!',es:'🏆 ¡7 días seguidos! Eres un verdadero lingüista. ¡+50 XP BONUS!',ht:'🏆 7 jou konsekatif! Ou se yon vrè lengwis. +50 XP BONUS!',de:'🏆 7 Tage am Stück! Du bist ein Linguist. +50 XP BONUS!',ru:'🏆 7 дней подряд! +50 БОНУСНЫХ XP!',zh:'🏆 连续7天！+50 奖励XP！',ja:'🏆 7日連続！+50 ボーナスXP！'};
        if (window.gainXP) gainXP(50);
        if (window.showNotif) showNotif(msgs[nl]||msgs.fr, 4500);
        if (window.LV_SOUND) window.LV_SOUND.play('levelUp');
      }
    } catch(e) {}
  }

  function checkJ30Retention() {
    try {
      var streak = (window.S_game && S_game.streak) || 0;
      if (streak === 30) { levelUpCinema(30, '👑 Légendaire'); if (window.gainXP) gainXP(200); }
    } catch(e) {}
  }

  function scheduleSmartReminder() {
    try {
      var last    = localStorage.getItem('lv_last_active');
      var nl      = (window.S && S.nativeLang) || 'fr';
      var msgs    = {fr:'👋 Content de te revoir ! Tes mots t\'ont manqué…',en:'👋 Good to see you back! Your words missed you…',es:'👋 ¡Qué bueno verte! Tus palabras te extrañaron…',ht:'👋 Kontan wè ou ankò! Mo ou yo te sonje ou…',de:'👋 Schön dich zu sehen! Deine Wörter haben dich vermisst…',ru:'👋 Рады видеть тебя снова!',zh:'👋 很高兴再次见到你！',ja:'👋 また会えて嬉しいです！'};
      if (last && Date.now() - parseInt(last) > 20*3600*1000) {
        setTimeout(function() { if (window.showNotif) showNotif(msgs[nl]||msgs.fr, 4000); }, 1500);
      }
      localStorage.setItem('lv_last_active', Date.now());
    } catch(e) {}
  }

  return {
    showSplash: showSplash, xpPop: xpPop, badgePop: badgePop,
    validPulse: validPulse, errorShake: errorShake, comboFlash: comboFlash,
    levelUpCinema: levelUpCinema, chestOpen: chestOpen, xpBarPulse: xpBarPulse,
    checkJ1Retention: checkJ1Retention, checkJ7Retention: checkJ7Retention,
    checkJ30Retention: checkJ30Retention, scheduleSmartReminder: scheduleSmartReminder,
  };
})();

window.xpPop        = function(a,el){ window.LV_ANIM.xpPop(a,el); };
window.badgePop     = function(i,t,d){ window.LV_ANIM.badgePop(i,t,d); };
window.comboFlash   = function(n){ window.LV_ANIM.comboFlash(n); };
window.levelUpCinema= function(l,n){ window.LV_ANIM.levelUpCinema(l,n); };
window.chestOpen    = function(el,r){ window.LV_ANIM.chestOpen(el,r); };
console.log('✅ animation.js v2 chargé');
