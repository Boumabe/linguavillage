// LinguaVillage — pnj.js
// PNJ vivants propulsés par l'IA : conversation pédagogique adaptative
// Intègre : mémoire (LV_MEMORY), sprites (LV_SPRITES), phonèmes (LV_PHONEMES)
// Patch de dialogue.js — enrichit npcOpen() et sendMsg() sans les remplacer
// ================================================================

window.LV_PNJ = (function() {

  const API = window.API || 'https://linguavillage-api--marckensbou2.replit.app';

  // ── Profils pédagogiques par rôle de PNJ ────────────────────
  const NPC_PEDAGOGY = {
    teacher: {
      style:    'formel et encourageant',
      domain:   'grammaire, vocabulaire scolaire, prononciation',
      corrects: true,
      introduces: 'règles grammaticales',
      sample:   'Très bien ! Maintenant essayons avec un autre verbe.',
    },
    merchant: {
      style:    'familier et pratique',
      domain:   'nombres, prix, marchandises, négociation',
      corrects: false,  // corrige naturellement par reformulation
      introduces: 'vocabulaire commercial',
      sample:   'Ce pain coûte deux euros. Et avec ça ?',
    },
    doctor: {
      style:    'professionnel et clair',
      domain:   'corps humain, symptômes, soins, urgences',
      corrects: true,
      introduces: 'vocabulaire médical de base',
      sample:   'Où avez-vous mal ? Depuis combien de temps ?',
    },
    pastor: {
      style:    'solennel et bienveillant',
      domain:   'valeurs, communauté, expressions formelles',
      corrects: false,
      introduces: 'expressions formelles et de respect',
      sample:   'Bienvenue, mon ami. Comment puis-je vous aider aujourd\'hui ?',
    },
    bartender: {
      style:    'décontracté et sociable',
      domain:   'boissons, nourriture, conversations informelles',
      corrects: false,
      introduces: 'expressions du quotidien',
      sample:   'Qu\'est-ce que je vous sers ? On a de tout ici.',
    },
    farmer: {
      style:    'direct et simple',
      domain:   'nature, animaux, saisons, travail',
      corrects: false,
      introduces: 'vocabulaire de la nature',
      sample:   'Belle journée pour travailler la terre, non ?',
    },
    officer: {
      style:    'formel et direct',
      domain:   'directions, identité, urgences, règles',
      corrects: true,
      introduces: 'vocabulaire civique et de la sécurité',
      sample:   'Vos papiers, s\'il vous plaît. Comment puis-je vous aider ?',
    },
    banker: {
      style:    'professionnel et précis',
      domain:   'argent, chiffres, transactions, formulaires',
      corrects: true,
      introduces: 'vocabulaire financier de base',
      sample:   'Bonjour. Quelle opération souhaitez-vous effectuer aujourd\'hui ?',
    },
    nurse: {
      style:    'chaleureux et rassurant',
      domain:   'santé, symptômes, soins courants, émotions',
      corrects: false,
      introduces: 'vocabulaire de la santé et du bien-être',
      sample:   'Comment vous sentez-vous aujourd\'hui ? Pas d\'inquiétude, je suis là.',
    },
    friend: {
      style:    'très informel et enthousiaste',
      domain:   'vie quotidienne, loisirs, émotions, amitié',
      corrects: false,
      introduces: 'argot doux et expressions courantes',
      sample:   'Hey ! Ça fait plaisir de te voir ! T\'as passé une bonne journée ?',
    },
    default: {
      style:    'simple et pédagogique',
      domain:   'vocabulaire général',
      corrects: true,
      introduces: 'expressions de base',
      sample:   'Bonjour ! Comment puis-je vous aider ?',
    },
  };

  // ── Construire le prompt système complet ─────────────────────
  function buildSystemPrompt(npc, loc) {
    const S = window.S || {};
    const role = typeof npc.role === 'object'
      ? (npc.role[S.nativeLang] || npc.role.fr || npc.role.en)
      : (npc.role || 'habitant');

    const locName = (window.LOC_NAMES && LOC_NAMES[loc?.id]?.fr) || loc?.id || 'le village';
    const targetLang = (window.LANG_NAMES && LANG_NAMES[S.targetLang]) || S.targetLang || 'français';
    const nativeLang = (window.LANG_NAMES && LANG_NAMES[S.nativeLang]) || S.nativeLang || 'français';
    const level = S.userLevel || 'débutant';

    const pedagogy = _getPedagogy(role);

    // Contexte mémoire utilisateur
    const memContext = (window.LV_MEMORY && window.LV_MEMORY.getLVContext) 
      ? window.LV_MEMORY.getLVContext() 
      : '';

    // Mots favoris pour les réutiliser
    const favWords = (window.LV_MEMORY && window.LV_MEMORY.get('favoriteWords') || [])
      .slice(-5).map(f => f.word).join(', ');

    return `Tu es ${npc.name}, ${role} à ${locName} dans un village d'apprentissage des langues.
L'apprenant s'appelle ${S.playerName || 'l\'apprenant'}.
Sa langue maternelle est le ${nativeLang}.
Il apprend le ${targetLang}.
Son niveau actuel : ${level}.

${memContext}

TON RÔLE PÉDAGOGIQUE :
- Tu es ${npc.name}, tu parles UNIQUEMENT en ${targetLang}.
- Ton style : ${pedagogy.style}.
- Ton domaine : ${pedagogy.domain}.
- Tu introduis progressivement : ${pedagogy.introduces}.
${favWords ? `- Réutilise naturellement ces mots que l'apprenant aime : ${favWords}.` : ''}
- Si l'apprenant fait une faute, ${pedagogy.corrects 
    ? 'corrige-le gentiment en incluant la forme correcte dans ta réponse.' 
    : 'reformule naturellement la phrase correcte sans le signaler.'}
- Adapte ta complexité à son niveau : ${level === 'zero' ? 'phrases très courtes, mots simples.' 
    : level === 'beginner' ? 'phrases courtes, vocabulaire de base.' 
    : 'phrases normales, vocabulaire varié.'}
- Si hors sujet, redirige : "En tant que ${role}, parlons plutôt de [ton domaine]."
- Maximum 2-3 phrases par réponse.
- Ne traduis pas. N'explique pas en ${nativeLang} sauf si l'apprenant est complètement bloqué.
- Sois pédagogique et chaleureux, pas un jeu — une vraie interaction formatrice.`;
  }

  // ── Appel API enrichi (remplace callAPIWithFallback pour les PNJ) ──
  async function callPNJ(npc, loc, message, history) {
    const systemPrompt = buildSystemPrompt(npc, loc);

    const payload = {
      npcName:       npc.name,
      npcRole:       typeof npc.role === 'object' ? (npc.role.fr || npc.role.en) : npc.role,
      location:      (window.LOC_NAMES && LOC_NAMES[loc?.id]?.fr) || loc?.id || '',
      language:      (window.LANG_NAMES && LANG_NAMES[window.S?.targetLang]) || 'français',
      playerName:    window.S?.playerName || '',
      playerMessage: message,
      history:       (history || []).slice(-8),
      systemContext: systemPrompt,
    };

    const r = await fetch(API + '/api/dialogue', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    if (!r.ok) throw new Error('API ' + r.status);
    return r.json();
  }

  // ── Analyser la réponse pour détecter correction / mission ───
  function analyzeResponse(reply) {
    const lowerReply = reply.toLowerCase();
    const correctionSignals = [
      'on dit', 'il faut dire', 'la forme correcte', 'vous devriez dire',
      'devrait être', 'c\'est plutôt', 'mais on dit', 'koreksyon',
      'correction', 'correcto', 'richtig ist',
    ];
    const successSignals = [
      'parfait', 'excellent', 'bravo', 'très bien', 'super', 'fantastique',
      'félicitations', 'exselans', 'perfecto', 'genau richtig', 'sehr gut',
      'perfectly', 'great job', 'well done',
    ];

    const hasCorrection = correctionSignals.some(s => lowerReply.includes(s));
    const hasSuccess    = successSignals.some(s => lowerReply.includes(s));

    return { hasCorrection, hasSuccess };
  }

  // ── Patch de dialogue.js : enrichit sans remplacer ───────────
  function patchDialogue() {
    // On patche openDialogue pour init le sprite
    const origOpenDialogue = window.openDialogue;
    if (origOpenDialogue && !origOpenDialogue._lv_patched) {
      window.openDialogue = function(locId, npcId) {
        origOpenDialogue(locId, npcId);
        // Initialiser le sprite après que le DOM soit prêt
        setTimeout(function() {
          const npc = window.S && S.currentNPC;
          if (npc && window.LV_SPRITES) {
            window.LV_SPRITES.initInDialogue(npc);
            window.LV_SPRITES.setExpression('neutral', 0);
          }
          // Incrémenter session mémoire
          if (window.LV_MEMORY) window.LV_MEMORY.newSession();
        }, 100);
      };
      window.openDialogue._lv_patched = true;
    }

    // Patch npcOpen pour utiliser le prompt enrichi
    const origNpcOpen = window.npcOpen;
    if (origNpcOpen && !origNpcOpen._lv_patched) {
      window.npcOpen = async function() {
        const npc = window.S && S.currentNPC;
        const loc = window.S && S.currentLoc;
        if (!npc || !loc) { return origNpcOpen(); }

        if (typeof showTyping === 'function') showTyping();
        const sendBtn = document.getElementById('dialSend');
        if (sendBtn) sendBtn.disabled = true;

        try {
          const result = await callPNJ(npc, loc, '__OPEN__', []);
          if (typeof removeTyping === 'function') removeTyping();
          const reply = result.reply || ('Bonjour ' + (S.playerName || '') + ' !');
          if (typeof addClickableMsg === 'function') addClickableMsg('npc', npc.emoji, reply);
          if (S.chatHistory) S.chatHistory.push({ role: 'assistant', content: reply });
          // Sprite neutre à l'ouverture
          if (window.LV_SPRITES) window.LV_SPRITES.setExpression('neutral', 0);
        } catch(e) {
          if (typeof removeTyping === 'function') removeTyping();
          if (typeof addClickableMsg === 'function')
            addClickableMsg('npc', npc.emoji, 'Bonjour ' + (S.playerName || '') + ' !');
        }
        if (sendBtn) sendBtn.disabled = false;
      };
      window.npcOpen._lv_patched = true;
    }

    // Patch sendMsg pour réactions sprites + mémoire
    const origSendMsg = window.sendMsg;
    if (origSendMsg && !origSendMsg._lv_patched) {
      window.sendMsg = async function() {
        const input = document.getElementById('dialInput');
        const msg = input ? input.value.trim() : '';
        if (!msg) return;

        // Mémoire : incrémenter messages
        if (window.LV_MEMORY) window.LV_MEMORY.newMessage();

        // Appeler l'original d'abord pour afficher le message
        const npc = window.S && S.currentNPC;
        const loc = window.S && S.currentLoc;
        if (!npc || !loc) { return origSendMsg(); }

        if (typeof addClickableMsg === 'function') addClickableMsg('player', '👤', msg);
        if (input) input.value = '';
        if (S.chatHistory) S.chatHistory.push({ role: 'user', content: msg });
        if (typeof gainXP === 'function') gainXP(10);
        if (typeof checkMissionInMessage === 'function') checkMissionInMessage(msg);

        if (typeof showTyping === 'function') showTyping();
        const sendBtn = document.getElementById('dialSend');
        if (sendBtn) sendBtn.disabled = true;

        try {
          const result = await callPNJ(npc, loc, msg, S.chatHistory || []);
          if (typeof removeTyping === 'function') removeTyping();
          const reply = result.reply || 'Merci !';

          // Analyser la réponse
          const { hasCorrection, hasSuccess } = analyzeResponse(reply);

          // Réaction sprite
          if (window.LV_SPRITES) {
            if (hasSuccess)         window.LV_SPRITES.reactToMission();
            else if (hasCorrection) window.LV_SPRITES.reactToCorrection(false);
            else                    window.LV_SPRITES.reactToCorrection(true);
          }

          // Mémoire : noter correction
          if (hasCorrection && window.LV_MEMORY) {
            // Extraire approximativement le mot corrigé
            const words = msg.split(' ').filter(w => w.length > 2);
            if (words.length > 0) window.LV_MEMORY.markWeak(words[0]);
          }
          if (hasSuccess && window.LV_MEMORY) {
            const words = msg.split(' ').filter(w => w.length > 2);
            if (words.length > 0) window.LV_MEMORY.markMastered(words[0]);
            if (typeof gainXP === 'function') gainXP(5);
          }

          if (typeof addClickableMsg === 'function') addClickableMsg('npc', npc.emoji, reply);
          if (S.chatHistory) S.chatHistory.push({ role: 'assistant', content: reply });

        } catch(e) {
          if (typeof removeTyping === 'function') removeTyping();
          if (typeof addClickableMsg === 'function')
            addClickableMsg('npc', npc.emoji || '🧑', 'Merci pour votre message !');
        }
        if (sendBtn) sendBtn.disabled = false;
      };
      window.sendMsg._lv_patched = true;
    }
  }

  // ── Interne ─────────────────────────────────────────────────
  function _getPedagogy(role) {
    const r = role.toLowerCase();
    for (const [key, val] of Object.entries(NPC_PEDAGOGY)) {
      if (r.includes(key)) return val;
    }
    return NPC_PEDAGOGY.default;
  }

  // ── Init : appliquer le patch dès que les fonctions existent ─
  function init() {
    function tryPatch() {
      if (window.openDialogue && window.npcOpen && window.sendMsg) {
        patchDialogue();
      }
    }
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', function() { setTimeout(tryPatch, 200); });
    } else {
      setTimeout(tryPatch, 200);
    }
  }

  init();

  return { buildSystemPrompt, callPNJ, analyzeResponse, NPC_PEDAGOGY, patchDialogue };

})();
