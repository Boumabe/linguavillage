// LinguaVillage — ambient_dialogue.js
// ================================================================
// Moteur de "rencontres ambiantes" : quand deux PNJ ambulants se
// croisent dans le village, ils s'arrêtent, une bulle de dialogue
// apparaît au-dessus d'eux, et le joueur peut cliquer dessus pour
// rejoindre la conversation (transition de caméra + ouverture du
// vrai système de dialogue IA, voir openDialogue/_v3dDialogue).
//
// PRINCIPE CLÉ — AUCUN APPEL API ICI :
// Le texte des bulles est généré par combinaison de fragments courts
// pré-écrits (salutations, observations météo/heure, mentions d'un
// tiers connu...), pas par l'IA. Ça peut donc tourner en continu, pour
// un nombre quelconque de PNJ, sans coût ni latence réseau. L'appel à
// l'IA (et donc le vrai coût) ne se déclenche que si le joueur clique
// explicitement sur une bulle pour rejoindre la conversation — à ce
// moment-là, on retombe sur le système existant (openDialogue), donc le
// coût reste strictement proportionnel à l'activité réelle du joueur,
// exactement comme avant cette fonctionnalité.
//
// CE FICHIER NE MODIFIE AUCUN FICHIER EXISTANT. Il s'attend à être
// chargé après citizens.js et village_3d.js (pour profiter des hooks
// déjà ajoutés dans ce dernier), mais reste silencieux et sans effet si
// l'un des deux est absent.
// ================================================================

window.LV_AMBIENT = (function () {
  'use strict';

  var _walkers = [];
  var _scene = null;
  var _meetings = {};       // id -> { a, b, bubble, expiresAt, locId, npcId }
  var _meetingCounter = 0;
  var _lastCheckAt = 0;
  var CHECK_INTERVAL = 0.4;     // secondes entre deux vérifications de croisement (perf : pas à chaque frame)
  var MEETING_RADIUS = 14;      // distance sous laquelle deux marcheurs "se croisent"
  var MEETING_COOLDOWN = 25;    // secondes avant qu'une même paire puisse se rencontrer à nouveau
  var BUBBLE_DURATION = 7;      // secondes d'affichage d'une bulle avant qu'elle disparaisse

  var _lastMetAt = {}; // clé "idA|idB" triée -> timestamp de la dernière rencontre
  // Note perf : cette table est bornée par le nombre de PAIRES possibles
  // (n*(n-1)/2), pas par le nombre de rencontres dans le temps. Même à
  // l'échelle visée par la demande (15 citoyens + 50 figurants = 65
  // marcheurs), ça reste au plus ~2080 entrées de quelques octets
  // chacune — aucun risque de fuite mémoire au fil du temps.

  // ── Fragments de dialogue ambiant ───────────────────────────
  // Volontairement courts et combinables, en français (langue de
  // référence du contenu, comme data.js). {a} et {b} sont remplacés par
  // les prénoms des deux citoyens au moment de l'affichage.
  var GREETINGS = {
    close:  ["Tiens, {a} !", "Ah, {b}, justement je pensais à toi.", "Salut toi !"],
    normal: ["Bonjour {a}.", "Tiens, bonjour.", "Ah, bonjour !"],
    far:    ["Bonjour.", "Bien le bonjour.", "Salutations."]
  };

  var WEATHER_LINES = {
    sun:   ["Belle journée, non ?", "Ce soleil fait du bien.", "Quel beau ciel aujourd'hui."],
    rain:  ["Cette pluie n'arrête pas...", "Pas le temps de s'attarder dehors.", "Tu n'as pas de parapluie ?"],
    snow:  ["Cette neige est magnifique.", "Couvre-toi bien.", "Le village est tout blanc aujourd'hui."],
    wind:  ["Ce vent décoiffe !", "Tiens bon ton chapeau.", "Quel vent aujourd'hui."],
    night: ["La nuit tombe vite.", "Il commence à faire frais.", "Le village est calme ce soir."]
  };

  var TIME_LINES = {
    dawn:      ["Tu es bien matinal.", "Le village se réveille à peine."],
    morning:   ["Bonne matinée à toi.", "La journée commence bien."],
    noon:      ["Tu vas manger ?", "C'est bientôt l'heure de midi."],
    afternoon: ["L'après-midi passe vite.", "Tu as bien avancé aujourd'hui ?"],
    dusk:      ["Le soir approche.", "On rentre bientôt ?"],
    evening:   ["Tu sors tard, ce soir.", "Le village se vide doucement."],
    night:     ["Tu rentres tard.", "Il est bien tard pour être encore dehors."]
  };

  var VILLAGE_LINES = [
    "Le village a bien changé ces derniers temps.",
    "As-tu vu la fontaine sur la place ?",
    "Le marché était animé aujourd'hui.",
    "On dit que la rivière monte un peu.",
    "Le village m'a toujours plu, malgré tout."
  ];

  var PLAYER_LINES = [
    "Tu as croisé le nouvel arrivant ?",
    "Il apprend vite, pour quelqu'un de nouveau ici.",
    "On devrait lui montrer le village un de ces jours.",
    "Il pose toujours plein de questions, c'est attachant."
  ];

  var JOB_LINES = {
    teacher:      ["J'ai encore une pile de cahiers à corriger.", "Les élèves progressent bien cette semaine."],
    doctor:       ["Journée chargée à la clinique.", "J'ai encore deux visites à faire."],
    pastor:       ["La paix soit avec toi.", "J'ai une cérémonie à préparer."],
    banker:       ["Les comptes n'attendent pas.", "Encore des chiffres à vérifier."],
    merchant:     ["Les affaires vont plutôt bien ce mois-ci.", "J'ai reçu une nouvelle marchandise."],
    bartender:    ["La taverne était pleine hier soir.", "Il me faut réapprovisionner le comptoir."],
    baker:        ["Le pain du matin est déjà presque fini.", "Il faut que je relance le four."],
    farmer:       ["La récolte s'annonce bonne cette année.", "Le temps n'aide pas beaucoup, ces jours-ci."],
    librarian:    ["J'ai reçu de nouveaux livres cette semaine.", "Il faut que je range la section du fond."],
    blacksmith:   ["J'ai trois commandes en retard.", "Le four chauffe encore trop lentement."],
    tailor:       ["Je termine une commande importante.", "J'ai reçu un beau tissu cette semaine."],
    waiter:       ["Service chargé, comme toujours.", "Je n'ai pas eu une minute aujourd'hui."],
    musician:     ["Je travaille sur une nouvelle mélodie.", "J'ai joué hier soir, c'était une belle ambiance."],
    psychologist: ["Belle journée pour prendre le temps de réfléchir.", "Comment vas-tu, toi, vraiment ?"]
  };

  var FAREWELLS = ["Allez, je file.", "On se recroise bientôt !", "Bonne journée à toi.", "À plus tard !"];

  function _pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // ── Construction d'une réplique pour une rencontre donnée ───
  function _buildLine(speakerId, otherId, relation) {
    var parts = [];
    var closeness = relation ? relation.closeness : 0;
    var greetBucket = closeness >= 3 ? 'close' : (closeness >= 1 ? 'normal' : 'far');

    var citizen = window.LV_CITIZENS ? window.LV_CITIZENS.getCitizen(speakerId) : null;
    var other = window.LV_CITIZENS ? window.LV_CITIZENS.getCitizen(otherId) : null;
    var nl = (window.S && window.S.nativeLang) || 'fr';
    var aName = citizen ? (citizen.name[nl] || citizen.name.fr) : speakerId;
    var bName = other ? (other.name[nl] || other.name.fr) : otherId;

    parts.push(_pick(GREETINGS[greetBucket]).replace('{a}', aName).replace('{b}', bName));

    // Choix d'un second fragment selon un mélange de contextes disponibles
    var pool = [];
    var weather = window.currentWeather || 'sun';
    if (WEATHER_LINES[weather]) pool.push.apply(pool, WEATHER_LINES[weather]);
    if (typeof getDetailedTimeOfDay === 'function') {
      try {
        var tod = getDetailedTimeOfDay();
        if (TIME_LINES[tod]) pool.push.apply(pool, TIME_LINES[tod]);
      } catch (e) {}
    }
    pool.push.apply(pool, VILLAGE_LINES);
    if (Math.random() < 0.3) pool.push.apply(pool, PLAYER_LINES);
    if (citizen && JOB_LINES[citizen.job]) pool.push.apply(pool, JOB_LINES[citizen.job]);
    if (relation && relation.note && Math.random() < 0.4) {
      pool.push("Au fait... " + relation.note + ".");
    }

    if (pool.length) parts.push(_pick(pool));
    if (Math.random() < 0.25) parts.push(_pick(FAREWELLS));

    return parts.join(' ');
  }

  // ── Bulle de dialogue 3D ─────────────────────────────────────
  // Réutilise le pattern canvas->texture->sprite déjà utilisé ailleurs
  // dans village_3d.js (_makeEmojiSprite/_makeLabelSprite), en autonome
  // ici pour ne dépendre d'aucune fonction privée de ce fichier.
  function _makeBubble(text) {
    var THREE = window.THREE;
    if (!THREE) return null;
    var dpr = 2;
    var maxWidth = 320;
    var c = document.createElement('canvas');
    var ctx2 = c.getContext('2d');
    ctx2.font = (14 * dpr) + 'px sans-serif';

    // Découpage simple du texte sur plusieurs lignes si trop long
    var words = text.split(' ');
    var lines = [];
    var current = '';
    words.forEach(function (w) {
      var test = current ? current + ' ' + w : w;
      if (ctx2.measureText(test).width > (maxWidth - 24) * dpr && current) {
        lines.push(current);
        current = w;
      } else {
        current = test;
      }
    });
    if (current) lines.push(current);

    var lineHeight = 20 * dpr;
    var padding = 14 * dpr;
    var w = maxWidth * dpr;
    var h = lines.length * lineHeight + padding * 2;
    c.width = w;
    c.height = h;
    ctx2.font = (14 * dpr) + 'px sans-serif';

    // Bulle arrondie
    var r = 14 * dpr;
    ctx2.fillStyle = 'rgba(20,20,30,0.88)';
    ctx2.strokeStyle = 'rgba(255,215,0,0.4)';
    ctx2.lineWidth = 2 * dpr;
    ctx2.beginPath();
    ctx2.moveTo(r, 0);
    ctx2.arcTo(w, 0, w, h, r);
    ctx2.arcTo(w, h, 0, h, r);
    ctx2.arcTo(0, h, 0, 0, r);
    ctx2.arcTo(0, 0, w, 0, r);
    ctx2.closePath();
    ctx2.fill();
    ctx2.stroke();

    ctx2.fillStyle = '#f0e8d0';
    ctx2.textAlign = 'center';
    ctx2.textBaseline = 'middle';
    lines.forEach(function (line, i) {
      ctx2.fillText(line, w / 2, padding + lineHeight * i + lineHeight / 2);
    });

    var tex = new THREE.CanvasTexture(c);
    var mat = new THREE.SpriteMaterial({ map: tex, depthWrite: false, depthTest: false });
    var sprite = new THREE.Sprite(mat);
    var scale = 0.16;
    sprite.scale.set(w * scale / dpr, h * scale / dpr, 1);
    return sprite;
  }

  // ── API publique : enregistrement des marcheurs ─────────────
  // IMPORTANT : seuls les marcheurs représentant un des 15 citoyens
  // intelligents (citizens.js) doivent être passés ici. Les futurs
  // figurants (point 7 de la demande : ~50 silhouettes décoratives sans
  // intelligence) ne doivent PAS être enregistrés via cette fonction —
  // ils n'ont pas de personnalité/relations dans citizens.js, et leur
  // donner des bulles de dialogue contredirait leur rôle voulu de pur
  // décor. Un futur module figurants.js pourra avoir sa propre logique
  // d'animation (s'asseoir, regarder la fontaine, etc.) sans jamais
  // appeler registerWalkers.
  function registerWalkers(walkers, scene) {
    _walkers = walkers;
    _scene = scene;
  }

  // ── Détection de croisement + gestion des rencontres actives ─
  function update(t, deltaTime) {
    if (!_scene || !_walkers.length) return;

    // Mise à jour des rencontres actives (expiration des bulles)
    for (var id in _meetings) {
      var m = _meetings[id];
      if (t > m.expiresAt) {
        if (m.bubble && m.bubble.parent) m.bubble.parent.remove(m.bubble);
        delete _meetings[id];
      } else if (m.bubble) {
        // La bulle suit le point milieu entre les deux PNJ et flotte légèrement
        m.bubble.position.set(
          (m.a.position.x + m.b.position.x) / 2,
          Math.max(m.a.position.y, m.b.position.y) + 9 + Math.sin(t * 1.5) * 0.4,
          (m.a.position.z + m.b.position.z) / 2
        );
      }
    }

    // Détection de croisement, limitée en fréquence pour la performance
    // (point 10 de la demande : éviter les calculs inutiles à chaque frame)
    if (t - _lastCheckAt < CHECK_INTERVAL) return;
    _lastCheckAt = t;

    for (var i = 0; i < _walkers.length; i++) {
      for (var j = i + 1; j < _walkers.length; j++) {
        var a = _walkers[i], b = _walkers[j];
        if (!a.userData.citizenId || !b.userData.citizenId) continue;
        if (a.userData.isWaiting || b.userData.isWaiting) continue; // déjà en pause (rencontre ou attente normale)

        var dx = a.position.x - b.position.x;
        var dz = a.position.z - b.position.z;
        var dist = Math.sqrt(dx * dx + dz * dz);
        if (dist > MEETING_RADIUS) continue;

        var pairKey = [a.userData.citizenId, b.userData.citizenId].sort().join('|');
        var lastMet = _lastMetAt[pairKey] || -Infinity;
        if (t - lastMet < MEETING_COOLDOWN) continue;

        _startMeeting(a, b, t);
        _lastMetAt[pairKey] = t;
      }
    }
  }

  function _startMeeting(a, b, t) {
    // Les deux PNJ s'arrêtent, réutilisant l'état isWaiting déjà géré par
    // la boucle de déplacement existante dans village_3d.js (aucune
    // duplication de logique de mouvement).
    a.userData.isWaiting = true;
    a.userData.waitTime = BUBBLE_DURATION + 1;
    b.userData.isWaiting = true;
    b.userData.waitTime = BUBBLE_DURATION + 1;

    var relation = window.LV_CITIZENS ? window.LV_CITIZENS.getRelation(a.userData.citizenId, b.userData.citizenId) : null;
    var speakerFirst = Math.random() < 0.5 ? a : b;
    var speakerSecond = speakerFirst === a ? b : a;
    var line = _buildLine(speakerFirst.userData.citizenId, speakerSecond.userData.citizenId, relation);

    var bubble = _makeBubble(line);
    if (!bubble) return;
    bubble.position.set((a.position.x + b.position.x) / 2, Math.max(a.position.y, b.position.y) + 9, (a.position.z + b.position.z) / 2);

    var meetingId = 'meet_' + (++_meetingCounter);
    bubble.userData.ambientMeetingId = meetingId;
    _scene.add(bubble);

    _meetings[meetingId] = {
      a: a, b: b, bubble: bubble,
      expiresAt: t + BUBBLE_DURATION,
      citizenIdA: a.userData.citizenId,
      citizenIdB: b.userData.citizenId
    };
  }

  // ── Clic sur une bulle : transition immersive vers le vrai dialogue ─
  function onTapMeeting(meetingId) {
    var m = _meetings[meetingId];
    if (!m) return;

    // On rejoint la conversation avec le premier des deux citoyens
    // (choix simple ; les deux PNJ restent visibles côte à côte dans
    // la scène, même si le dialogue se concentre sur l'un d'eux).
    var citizenId = m.citizenIdA;

    var meetX = (m.a.position.x + m.b.position.x) / 2;
    var meetZ = (m.a.position.z + m.b.position.z) / 2;

    // Fermer la bulle immédiatement (le joueur a choisi de rejoindre)
    if (m.bubble && m.bubble.parent) m.bubble.parent.remove(m.bubble);
    delete _meetings[meetingId];

    if (window.LV_SOUND && typeof window.LV_SOUND.play === 'function') {
      try { window.LV_SOUND.play('tap'); } catch (e) {}
    }

    // Transition de caméra puis ouverture du vrai dialogue IA. Si
    // _v3dFlyTo/_v3dResolveLocId ne sont pas disponibles (ancienne
    // version de village_3d.js sans ces hooks), on n'ouvre rien plutôt
    // que de risquer un appel cassé — dégradation silencieuse, pas de
    // crash.
    var openReal = function () {
      if (typeof window._v3dResolveLocId !== 'function' || typeof window._v3dDialogue !== 'function') return;
      var locId = window._v3dResolveLocId(citizenId);
      if (locId) {
        window._v3dDialogue(locId, citizenId);
      } else {
        // Citoyen "homeless" (pas encore de bâtiment) : on ne peut pas
        // ouvrir le vrai dialogue IA. Mieux vaut le signaler discrètement
        // que de rester silencieux sans explication.
        if (typeof showNotif === 'function') {
          showNotif('💬 ' + citizenId + " n'a pas encore de lieu où s'installer dans le village.", 2500);
        }
      }
    };

    if (typeof window._v3dFlyTo === 'function') {
      window._v3dFlyTo(meetX, meetZ, 700, openReal);
    } else {
      openReal();
    }
  }

  return {
    registerWalkers: registerWalkers,
    update: update,
    onTapMeeting: onTapMeeting
  };
})();

console.log('✅ ambient_dialogue.js chargé');
