// village_rpg.js — LINGORIA LIVING WORLD ENGINE
// Remplace village.js — Village comme RPG vivant
// Bâtiments narratifs, PNJ avec routines, quêtes, progression visible
// ================================================================

window.canvas = null;
window.ctx    = null;
window.tick   = 0;
window.currentWeather = window.currentWeather || 'sun';

// ================================================================
// MONDE NARRATIF — Lingoria, Le Village de Krova
// Histoire : Krova est le point d'entrée de Lingoria.
// Autrefois prospère, le village attend quelqu'un capable de
// rouvrir ses routes commerciales, réparer son pont et éveiller
// ses habitants de leur torpeur collective.
// ================================================================

window.KROVA_LORE = {
  name: 'Krova',
  tagline: {
    fr: 'Un village qui renaît.',
    en: 'A village awakening.',
    es: 'Un pueblo que renace.',
    ht: 'Yon vilaj k ap reveye.',
  },
  lore: {
    fr: 'Krova dormait depuis des années. Personne n\'entrait, personne ne sortait. Jusqu\'à ce que vous arriviez.',
    en: 'Krova had been sleeping for years. Nobody entered, nobody left. Until you arrived.',
    es: 'Krova llevaba años dormida. Nadie entraba, nadie salía. Hasta que tú llegaste.',
    ht: 'Krova t ap dòmi pou plizyè ane. Pèsonn pa t antre, pèsonn pa t soti. Jiskaske ou te rive.',
  },
};

// ================================================================
// BÂTIMENTS NARRATIFS — chaque bâtiment a une raison d'exister
// Les noms de catégories remplacent les labels "leçon"
// ================================================================
window.KROVA_BUILDINGS = [
  // ── CENTRE : Maison de l'Étranger (HOME) ──────────────────────
  {
    id: 'home', ring: 0, angle: 0,
    emoji: '🏠',
    name:  {fr:'Ta Maison',    en:'Your Home',    es:'Tu Casa',      ht:'Kay Ou'},
    lore:  {fr:'Brigitte t\'a loué cette chambre. C\'est ici que tu te reposes, lis et prépares tes journées.',
            en:'Brigitte rented you this room. This is where you rest, read and plan your days.',
            es:'Brigitte te alquiló esta habitación. Aquí descansas, lees y planeas tus días.',
            ht:'Brigitte te lwe chanm sa a pou ou. Se isit ou repoze, li ak prepare jou ou yo.'},
    npcId: null,
    theme: null,  // pas de leçon directe — point de départ
    buildState: 1,  // toujours construite
    glow: 'rgba(255,215,0,0.4)',
  },

  // ── ANNEAU 1 : Le Cœur du Village ─────────────────────────────
  {
    id: 'well', ring: 1, angle: 90,
    emoji: '⛲',
    name:  {fr:'Le Puits Central', en:'The Central Well', es:'El Pozo Central', ht:'Pi Santral la'},
    lore:  {fr:'Les habitants se retrouvent ici chaque matin. C\'est là que les nouvelles circulent.',
            en:'Villagers meet here every morning. This is where news travels.',
            es:'Los aldeanos se reúnen aquí cada mañana. Aquí es donde circulan las noticias.',
            ht:'Abitan yo reyini isit chak maten. Se isit nouvèl yo vwayaje.'},
    npcId: 'elder',
    theme: 'greetings',
    buildState: 1,
    glow: 'rgba(74,158,255,0.3)',
    routineMsg: {fr:'Koffi est assis sur le banc, il observe la place.',
                 en:'Koffi sits on the bench, watching the square.',
                 es:'Koffi está sentado en el banco, observando la plaza.',
                 ht:'Koffi chita sou ban an, l ap gade plas la.'},
  },
  {
    id: 'school', ring: 1, angle: 210,
    emoji: '🏫',
    name:  {fr:'L\'École de Mme Amara', en:'Ms. Amara\'s School', es:'La Escuela de la Sra. Amara', ht:'Lekòl Madan Amara'},
    lore:  {fr:'Amara enseigne ici depuis 15 ans. Les enfants adorent ses histoires. Les adultes, moins.',
            en:'Amara has been teaching here for 15 years. Children love her stories. Adults, less so.',
            es:'Amara lleva 15 años enseñando aquí. A los niños les encantan sus historias. A los adultos, menos.',
            ht:'Amara ap anseye isit depi 15 an. Timoun yo renmen istwa li yo. Granmoun yo, mwens.'},
    npcId: 'teacher',
    theme: 'alphabet_numbers',
    buildState: 1,
    glow: 'rgba(78,207,112,0.35)',
    routineMsg: {fr:'Des voix d\'enfants sortent de l\'école.',
                 en:'Children\'s voices come from the school.',
                 es:'Voces de niños salen de la escuela.',
                 ht:'Vwa timoun soti nan lekòl la.'},
  },
  {
    id: 'tavern', ring: 1, angle: 330,
    emoji: '🍺',
    name:  {fr:'La Taverne de Marco', en:'Marco\'s Tavern', es:'La Taberna de Marco', ht:'Tavèn Marco'},
    lore:  {fr:'Marco dit qu\'il connaît chaque secret de Krova. Après deux verres, il en partage quelques-uns.',
            en:'Marco says he knows every secret in Krova. After two drinks, he shares a few.',
            es:'Marco dice que conoce cada secreto de Krova. Tras dos copas, comparte algunos.',
            ht:'Marco di li konnen chak sekrè Krova. Apre de vè, li pataje kèk.'},
    npcId: 'bartender',
    theme: 'social_drinks',
    buildState: 1,
    glow: 'rgba(255,159,67,0.35)',
    routineMsg: {fr:'Une odeur de cuisine chaude sort de la taverne.',
                 en:'A warm cooking smell drifts from the tavern.',
                 es:'Un olor a cocina caliente sale de la taberna.',
                 ht:'Yon sant manje cho soti nan tavèn nan.'},
  },

  // ── ANNEAU 2 : Vie Économique ──────────────────────────────────
  {
    id: 'market', ring: 2, angle: 30,
    emoji: '🏪',
    name:  {fr:'Le Marché de Diallo', en:'Diallo\'s Market', es:'El Mercado de Diallo', ht:'Mache Diallo'},
    lore:  {fr:'Diallo vend de tout : épices, outils, mystère. Son prix change selon ton humeur.',
            en:'Diallo sells everything: spices, tools, mystery. His price changes with your mood.',
            es:'Diallo vende de todo: especias, herramientas, misterio. Su precio cambia según tu humor.',
            ht:'Diallo vann tout bagay: epis, zouti, mistè. Pri li chanje selon imè ou.'},
    npcId: 'merchant',
    theme: 'shopping_numbers',
    buildState: 1,
    glow: 'rgba(255,215,0,0.3)',
    routineMsg: {fr:'Diallo dispose ses marchandises en chantonnant.',
                 en:'Diallo arranges his goods while humming.',
                 es:'Diallo coloca sus mercancías tarareando.',
                 ht:'Diallo ranje machandiz li yo pandan l ap fredonen.'},
  },
  {
    id: 'forge', ring: 2, angle: 150,
    emoji: '⚒️',
    name:  {fr:'La Forge d\'Eitan', en:'Eitan\'s Forge', es:'La Fragua de Eitan', ht:'Fòj Eitan'},
    lore:  {fr:'Eitan ne parle pas beaucoup. Mais quand il parle, chaque mot a le poids du métal.',
            en:'Eitan doesn\'t talk much. But when he does, every word has the weight of metal.',
            es:'Eitan no habla mucho. Pero cuando lo hace, cada palabra tiene el peso del metal.',
            ht:'Eitan pa pale anpil. Men lè l pale, chak mo gen pwa metal la.'},
    npcId: 'blacksmith',
    theme: 'materials_tools',
    buildState: 1,
    glow: 'rgba(255,120,50,0.35)',
    routineMsg: {fr:'Le bruit du métal frappé résonne depuis la forge.',
                 en:'The sound of struck metal echoes from the forge.',
                 es:'El sonido del metal golpeado resuena desde la fragua.',
                 ht:'Son metal frape a retantis depi fòj la.'},
  },
  {
    id: 'farm', ring: 2, angle: 270,
    emoji: '🌾',
    name:  {fr:'La Ferme de Léa', en:'Léa\'s Farm', es:'La Granja de Léa', ht:'Fèm Léa'},
    lore:  {fr:'Léa cultive des légumes introuvables ailleurs. Elle connaît les noms de toutes ses plantes.',
            en:'Léa grows vegetables found nowhere else. She knows the names of all her plants.',
            es:'Léa cultiva verduras que no se encuentran en otro lugar. Conoce los nombres de todas sus plantas.',
            ht:'Léa kiltivre legim ou pa ka jwenn okòt. Li konnen non tout plant li yo.'},
    npcId: 'farmer',
    theme: 'nature_food',
    buildState: 1,
    glow: 'rgba(78,207,112,0.30)',
    routineMsg: {fr:'Léa arrose ses plants en sifflotant.',
                 en:'Léa waters her plants, whistling softly.',
                 es:'Léa riega sus plantas silbando suavemente.',
                 ht:'Léa wouze plant li yo pandan l ap sifle dousman.'},
  },

  // ── ANNEAU 3 : Services & Mystère ─────────────────────────────
  {
    id: 'hospital', ring: 3, angle: 0,
    emoji: '🏥',
    name:  {fr:'La Maison du Dr. Martin', en:'Dr. Martin\'s House', es:'La Casa del Dr. Martín', ht:'Kay Doktè Martin'},
    lore:  {fr:'Martin soigne le corps et écoute l\'âme. Il connaît les secrets de la moitié du village.',
            en:'Martin heals the body and listens to the soul. He knows half the village\'s secrets.',
            es:'Martín cura el cuerpo y escucha el alma. Conoce los secretos de medio pueblo.',
            ht:'Martin geri kò a epi koute nanm nan. Li konnen sekrè mwatye nan vilaj la.'},
    npcId: 'doctor',
    theme: 'health_body',
    buildState: 1,
    glow: 'rgba(74,158,255,0.30)',
    routineMsg: {fr:'Le Dr. Martin lit son journal sur le perron.',
                 en:'Dr. Martin reads his newspaper on the porch.',
                 es:'El Dr. Martín lee su periódico en el porche.',
                 ht:'Doktè Martin ap li jounal li sou galri a.'},
  },
  {
    id: 'library', ring: 3, angle: 120,
    emoji: '📚',
    name:  {fr:'La Bibliothèque des Langues', en:'The Language Library', es:'La Biblioteca de Idiomas', ht:'Bibliyotèk Lang yo'},
    lore:  {fr:'Des centaines de livres dans toutes les langues. Certains racontent des histoires de Lingoria que personne ne connaît encore.',
            en:'Hundreds of books in every language. Some tell stories of Lingoria nobody knows yet.',
            es:'Cientos de libros en todos los idiomas. Algunos cuentan historias de Lingoria que nadie conoce todavía.',
            ht:'Dè santèn liv nan tout lang. Kèk rakonte istwa Lingoria pèsonn pa konnen toujou.'},
    npcId: 'librarian',
    theme: 'reading_culture',
    buildState: 0,  // À DÉBLOQUER — quête narrative
    buildXP: 400,
    glow: 'rgba(192,132,252,0.35)',
    routineMsg: {fr:'La bibliothécaire classe des livres en silence.',
                 en:'The librarian sorts books in silence.',
                 es:'La bibliotecaria clasifica libros en silencio.',
                 ht:'Bibliyotekè a klase liv yo an silans.'},
    questUnlock: {
      fr: 'Pour ouvrir la bibliothèque, parle d\'abord avec Grand-père Koffi. Il connaît l\'histoire.',
      en: 'To open the library, first speak with Grandpa Koffi. He knows the story.',
      es: 'Para abrir la biblioteca, primero habla con el abuelo Koffi. Él conoce la historia.',
      ht: 'Pou ouvri bibliyotèk la, pale premye ak Gran-Pè Koffi. Li konnen istwa a.',
    },
  },
  {
    id: 'bridge', ring: 3, angle: 240,
    emoji: '🌉',
    name:  {fr:'Le Pont Cassé', en:'The Broken Bridge', es:'El Puente Roto', ht:'Pon Kase a'},
    lore:  {fr:'Ce pont menait vers le marché du sud. Il s\'est effondré il y a 3 ans. Personne n\'a eu le courage de le réparer.',
            en:'This bridge led to the southern market. It collapsed 3 years ago. Nobody had the courage to fix it.',
            es:'Este puente llevaba al mercado del sur. Se derrumbó hace 3 años. Nadie tuvo el valor de repararlo.',
            ht:'Pon sa a te mennen nan mache sid la. Li te tonbe 3 an de sa. Pèsonn pa te gen kouraj pou repare li.'},
    npcId: null,
    theme: null,
    buildState: 0,
    buildXP: 800,
    glow: 'rgba(255,159,67,0.20)',
    questUnlock: {
      fr: '800 XP pour réparer le pont et ouvrir la route vers le Sud.',
      en: '800 XP to repair the bridge and open the road south.',
      es: '800 XP para reparar el puente y abrir el camino al sur.',
      ht: '800 XP pou repare pon an ak ouvri wout sid la.',
    },
    progressMsg: {
      fr: 'Le pont montre des signes de reconstruction.',
      en: 'The bridge shows signs of reconstruction.',
      es: 'El puente muestra signos de reconstrucción.',
      ht: 'Pon an montre siy rekonstriksyon.',
    },
  },

  // ── EXTÉRIEUR : Lieux spéciaux ─────────────────────────────────
  {
    id: 'cinema', ring: null, angle: null,
    x: 0.82, y: 0.12,
    emoji: '🎬',
    name:  {fr:'Le Théâtre de Lingoria', en:'Lingoria Theater', es:'Teatro de Lingoria', ht:'Teyat Lingoria'},
    lore:  {fr:'Des films et pièces en langues étrangères. Chaque représentation raconte une histoire vraie.',
            en:'Films and plays in foreign languages. Each show tells a true story.',
            es:'Películas y obras en idiomas extranjeros. Cada representación cuenta una historia real.',
            ht:'Film ak pyès nan lang etranje. Chak reprezantasyon rakonte yon istwa reyèl.'},
    npcId: 'director',
    theme: 'culture_cinema',
    buildState: 1,
    glow: 'rgba(192,132,252,0.40)',
  },
];

// ================================================================
// PNJ VIVANTS — profils enrichis avec routines et histoires
// ================================================================
window.KROVA_NPCS = {
  elder: {
    id: 'elder', name: 'Grand-père Koffi', emoji: '👴',
    role: {fr:'Sage du Village',en:'Village Elder',es:'Anciano del Pueblo',ht:'Granmoun Vilaj'},
    bio: {
      fr: 'Koffi a fondé Krova avec 6 autres familles. Il connaît chaque pierre, chaque arbre. Ses histoires durent des heures.',
      en: 'Koffi founded Krova with 6 other families. He knows every stone, every tree. His stories last for hours.',
    },
    relations: {teacher:'vieil ami',merchant:'méfiance amicale',bartender:'ils jouent aux cartes chaque vendredi'},
    currentActivity: {fr:'méditation matinale',en:'morning meditation'},
    questGiver: true,
    questId: 'library_key',
  },
  teacher: {
    id: 'teacher', name: 'Mme Amara', emoji: '👩‍🏫',
    role: {fr:'Institutrice',en:'Schoolteacher',es:'Maestra',ht:'Pwofesè'},
    bio: {
      fr: 'Amara est venue de loin pour enseigner. Elle cherche quelque chose dans les archives du village.',
      en: 'Amara came from far away to teach. She\'s looking for something in the village archives.',
    },
    relations: {librarian:'cherche les mêmes archives',elder:'respect mutuel profond'},
    currentActivity: {fr:'correction de copies',en:'grading papers'},
    questGiver: false,
    secret: {fr:'Elle connaît la vérité sur la disparition du bibliothécaire.',en:'She knows the truth about the librarian\'s disappearance.'},
  },
  merchant: {
    id: 'merchant', name: 'M. Diallo', emoji: '🧑‍🌾',
    role: {fr:'Marchand',en:'Merchant',es:'Comerciante',ht:'Machann'},
    bio: {
      fr: 'Diallo voyage entre Krova et la capitale. Il transporte des messages autant que des marchandises.',
      en: 'Diallo travels between Krova and the capital. He carries messages as much as goods.',
    },
    relations: {banker:'partenaire commercial',bartender:'client régulier'},
    currentActivity: {fr:'comptage de sa caisse',en:'counting his cash register'},
    questGiver: true,
    questId: 'southern_delivery',
  },
  bartender: {
    id: 'bartender', name: 'Marco', emoji: '🍺',
    role: {fr:'Tavernier',en:'Bartender',es:'Tabernero',ht:'Bòs Tavèn'},
    bio: {
      fr: 'Marco a tout vu, tout entendu. Il ne répète rien — sauf les bonnes histoires.',
      en: 'Marco has seen everything, heard everything. He repeats nothing — except the good stories.',
    },
    relations: {elder:'clients du vendredi soir',doctor:'fournisseur officieux'},
    currentActivity: {fr:'essuyage de verres',en:'polishing glasses'},
    questGiver: false,
    gossip: {fr:'Il murmure que quelqu\'un creuse sous la bibliothèque la nuit.',en:'He whispers someone is digging under the library at night.'},
  },
  doctor: {
    id: 'doctor', name: 'Dr. Martin', emoji: '👨‍⚕️',
    role: {fr:'Médecin',en:'Doctor',es:'Médico',ht:'Doktè'},
    bio: {
      fr: 'Martin a étudié en 4 pays. Il est revenu à Krova pour des raisons qu\'il ne raconte pas facilement.',
      en: 'Martin studied in 4 countries. He returned to Krova for reasons he doesn\'t share easily.',
    },
    relations: {librarian:'ancienne liaison non confirmée',elder:'confiance totale'},
    currentActivity: {fr:'consultation matinale',en:'morning consultation'},
    questGiver: true,
    questId: 'missing_herbs',
  },
  blacksmith: {
    id: 'blacksmith', name: 'Eitan', emoji: '⚒️',
    role: {fr:'Forgeron',en:'Blacksmith',es:'Herrero',ht:'Fòjeron'},
    bio: {
      fr: 'Eitan forge depuis l\'enfance. Il dit que le métal parle si tu l\'écoutes assez longtemps.',
      en: 'Eitan has been forging since childhood. He says metal speaks if you listen long enough.',
    },
    relations: {farmer:'il répare ses outils gratuitement',merchant:'fournisseur principal'},
    currentActivity: {fr:'travail à la forge',en:'working at the forge'},
    questGiver: false,
  },
  farmer: {
    id: 'farmer', name: 'Léa', emoji: '👩‍🌾',
    role: {fr:'Agricultrice',en:'Farmer',es:'Agricultora',ht:'Agrikiltis'},
    bio: {
      fr: 'Léa a découvert des graines anciennes dans son champ. Elle ne sait pas encore ce qu\'elles donneront.',
      en: 'Léa discovered ancient seeds in her field. She doesn\'t know yet what they\'ll grow into.',
    },
    relations: {elder:'sa grand-mère était la sœur de Koffi'},
    currentActivity: {fr:'arrosage des cultures',en:'watering crops'},
    questGiver: true,
    questId: 'ancient_seeds',
  },
  librarian: {
    id: 'librarian', name: 'Sorana', emoji: '📚',
    role: {fr:'Bibliothécaire',en:'Librarian',es:'Bibliotecaria',ht:'Bibliyotekè'},
    bio: {
      fr: 'Sorana garde des livres que personne ne peut lire. Elle cherche quelqu\'un capable de les déchiffrer.',
      en: 'Sorana keeps books nobody can read. She\'s looking for someone who can decipher them.',
    },
    relations: {teacher:'elles cherchent la même chose'},
    currentActivity: {fr:'classement silencieux',en:'silent sorting'},
    questGiver: true,
    questId: 'lost_manuscripts',
    unlockRequired: 'library',
  },
  director: {
    id: 'director', name: 'Réalisateur Félix', emoji: '🎬',
    role: {fr:'Réalisateur',en:'Director',es:'Director',ht:'Reyalizatè'},
    bio: {
      fr: 'Félix tourne un film sur Lingoria. Il cherche des histoires vraies auprès des habitants.',
      en: 'Félix is filming a documentary about Lingoria. He\'s looking for true stories from the locals.',
    },
    relations: {merchant:'finance son film partiellement'},
    currentActivity: {fr:'répétition de scènes',en:'rehearsing scenes'},
    questGiver: true,
    questId: 'documentary_interview',
  },
};

// ================================================================
// SYSTÈME DE QUÊTES NARRATIVES
// ================================================================
window.KROVA_QUESTS = {
  library_key: {
    id: 'library_key',
    title: {fr:'La Clé de la Bibliothèque', en:'The Library Key'},
    giver: 'elder',
    steps: [
      {action:'talk', npc:'elder',    msg:{fr:'Koffi te parle d\'une clé perdue. Elle ouvre la bibliothèque.',en:'Koffi tells you about a lost key that opens the library.'}},
      {action:'talk', npc:'bartender',msg:{fr:'Marco sait quelque chose sur la clé.',en:'Marco knows something about the key.'}},
      {action:'xp',   amount:100,     msg:{fr:'Tu réunis assez de connaissances pour convaincre Marco.',en:'You gather enough knowledge to convince Marco.'}},
    ],
    reward: {type:'unlock', target:'library', xp:150,
             msg:{fr:'La bibliothèque est ouverte ! Sorana vous attendait.',en:'The library is open! Sorana was waiting for you.'}},
  },
  southern_delivery: {
    id: 'southern_delivery',
    title: {fr:'La Livraison du Sud', en:'The Southern Delivery'},
    giver: 'merchant',
    condition: {type:'xp', value:200},
    steps: [
      {action:'talk', npc:'merchant', msg:{fr:'Diallo a un colis pour le marché du sud. Mais le pont est cassé.',en:'Diallo has a package for the south market. But the bridge is broken.'}},
      {action:'xp',   amount:600,     msg:{fr:'Tes efforts contribuent à réparer le pont.',en:'Your efforts contribute to repairing the bridge.'}},
    ],
    reward: {type:'unlock', target:'bridge', xp:200,
             msg:{fr:'Le pont est réparé ! La route du sud est ouverte.',en:'The bridge is repaired! The southern road is open.'}},
  },
  ancient_seeds: {
    id: 'ancient_seeds',
    title: {fr:'Les Graines Anciennes', en:'The Ancient Seeds'},
    giver: 'farmer',
    condition: {type:'rank', value:'resident'},
    steps: [
      {action:'talk', npc:'farmer',  msg:{fr:'Léa a besoin d\'aide pour identifier les graines.',en:'Léa needs help identifying the seeds.'}},
      {action:'talk', npc:'librarian',msg:{fr:'La bibliothèque cache peut-être des informations sur ces graines.',en:'The library might hold information about these seeds.'}},
    ],
    reward: {type:'item', item:'ancient_recipe', xp:120,
             msg:{fr:'Les graines donnent une plante inconnue. Son nom est dans l\'ancienne langue.',en:'The seeds grow into an unknown plant. Its name is in the old language.'}},
  },
  documentary_interview: {
    id: 'documentary_interview',
    title: {fr:'L\'Interview', en:'The Interview'},
    giver: 'director',
    condition: {type:'xp', value:300},
    steps: [
      {action:'talk', npc:'director', msg:{fr:'Félix veut t\'interviewer pour son film.',en:'Félix wants to interview you for his film.'}},
      {action:'xp',   amount:200,     msg:{fr:'Tu parles suffisamment bien pour être filmé.',en:'You speak well enough to be filmed.'}},
    ],
    reward: {type:'status', status:'celebrity', xp:180,
             msg:{fr:'Tu es dans le film. Les habitants de Krova te regardent différemment.',en:'You\'re in the film. Krova\'s residents look at you differently.'}},
  },
};

// ================================================================
// ÉTAT DU VILLAGE — sauvegardé et persistant
// ================================================================
function _loadVillageState() {
  try {
    var raw = localStorage.getItem('lv_krova_state');
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return {
    builtBuildings: [],
    activeQuests:   [],
    completedQuests:[],
    npcMoods:       {},
    worldEvents:    [],
    bridgeProgress: 0,
    libraryOpen:    false,
  };
}
function _saveVillageState(state) {
  try { localStorage.setItem('lv_krova_state', JSON.stringify(state)); } catch(e) {}
}
window.KROVA_STATE = _loadVillageState();

function checkBuildUnlocks(xp) {
  var state   = window.KROVA_STATE;
  var changed = false;
  window.KROVA_BUILDINGS.forEach(function(b) {
    if (b.buildState === 0 && b.buildXP && xp >= b.buildXP) {
      if (!state.builtBuildings.includes(b.id)) {
        state.builtBuildings.push(b.id);
        changed = true;
        var nl = (window.S && S.nativeLang) || 'fr';
        var msg = b.progressMsg ? (b.progressMsg[nl]||b.progressMsg.fr) : null;
        if (msg && typeof showNotif === 'function') showNotif('🏗️ ' + msg);
        if (window.LV_SOUND) window.LV_SOUND.play('levelUp');
      }
    }
  });
  if (changed) _saveVillageState(state);
}

function isBuildingActive(building) {
  if (building.buildState === 1) return true;
  return window.KROVA_STATE.builtBuildings.includes(building.id);
}

// ================================================================
// ÉTAT ISO — rendu isométrique
// ================================================================
var ISO = {
  scrollX:0, targetScrollX:0,
  isDragging:false, dragStartX:0, dragScrollX:0,
  touchStartX:0, touchScrollX:0, touchMoved:false,
  hoveredBuilding:null,
  particles:[],
  clouds:[],
  npcs:[],        // PNJ animés sur la carte
  tapTime:0,
};

// ================================================================
// POINT D'ENTRÉE
// ================================================================
function goVillage() {
  if (!window.S) return;

  var xp = (window.S && S.xp) || 0;
  checkBuildUnlocks(xp);

  var el;
  el=document.getElementById('hudPlayer');  if(el) el.textContent='👤 '+(S.playerName||'');
  el=document.getElementById('hudLang');    if(el) el.textContent=((window.FLAGS&&FLAGS[S.targetLang])||'')+' '+((window.LANG_NAMES&&LANG_NAMES[S.targetLang])||'');
  el=document.getElementById('hudXP');      if(el) el.textContent=xp+' XP';

  if(typeof window.showScreen==='function') window.showScreen('screen-village');
  else {
    document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active');});
    var vs=document.getElementById('screen-village');
    if(vs) vs.classList.add('active');
  }

  canvas=null; ctx=null; tick=0;
  window._villageLoopRunning=false;
  window._villageLoopActive=false;
  ISO.particles=[]; ISO.scrollX=0; ISO.targetScrollX=0;
  ISO.npcs=[];

  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      _buildNavBar();
      _fixLayout();
      _initCanvas();
      // Positionner sur le centre au démarrage
      setTimeout(function(){_scrollToBuilding('well',true);},80);
    });
  });

  if(window._timeUpdateInterval) clearInterval(window._timeUpdateInterval);
  window._timeUpdateInterval=setInterval(updateTime,30000);
  if(typeof updateTime==='function') updateTime();
}

function _fixLayout(){
  var vs=document.getElementById('screen-village');
  if(!vs) return;
  var c=document.getElementById('villageCanvas');
  var wrap=document.querySelector('.village-canvas-wrap');
  if(c&&c.parentElement===vs&&!wrap){
    var div=document.createElement('div');
    div.className='village-canvas-wrap';
    vs.insertBefore(div,c); div.appendChild(c);
    var tip=document.getElementById('locTooltip');
    if(tip&&tip.parentElement===vs) div.appendChild(tip);
  }
}

// ================================================================
// CANVAS INIT
// ================================================================
function _initCanvas(){
  var c=document.getElementById('villageCanvas');
  if(!c) return;
  var dpr=window.devicePixelRatio||1;
  var wrap=document.querySelector('.village-canvas-wrap')||document.getElementById('screen-village');
  var r=wrap?wrap.getBoundingClientRect():null;
  var W,H;
  if(r&&r.width>0&&r.height>0){W=Math.floor(r.width);H=Math.floor(r.height);}
  else{
    var hud=document.querySelector('.village-hud');
    var nav=document.querySelector('.village-nav-bar');
    var hudH=(hud?hud.getBoundingClientRect().height:52)+(nav?nav.getBoundingClientRect().height:56);
    var visH=(window.visualViewport?window.visualViewport.height:null)||window.innerHeight||640;
    W=Math.floor((window.visualViewport?window.visualViewport.width:null)||window.innerWidth||360);
    H=Math.max(200,Math.floor(visH-hudH));
  }
  c.width=W*dpr; c.height=H*dpr;
  c.style.cssText='display:block;width:'+W+'px;height:'+H+'px;touch-action:none;cursor:grab;';
  ISO.clouds=_genClouds(W,H);
  _spawnNPCs(W,H);

  var nc=c.cloneNode(false);
  c.parentNode.replaceChild(nc,c); c=nc;
  c.addEventListener('touchstart',_onTouchStart,{passive:false});
  c.addEventListener('touchmove', _onTouchMove, {passive:false});
  c.addEventListener('touchend',  _onTouchEnd,  {passive:true});
  c.addEventListener('mousedown', _onMouseDown);
  c.addEventListener('mousemove', _onMouseMove);
  c.addEventListener('mouseup',   _onMouseUp);
  c.addEventListener('click',     _onClick);

  if(window._onCanvasResize) window.removeEventListener('resize',window._onCanvasResize);
  window._onCanvasResize=function(){if(document.getElementById('screen-village').classList.contains('active'))_initCanvas();};
  window.addEventListener('resize',window._onCanvasResize);

  if(!window._villageLoopRunning){
    window._villageLoopRunning=true;
    window._villageLoopActive=true;
    requestAnimationFrame(_loop);
  }
}

// ================================================================
// PNJ ANIMÉS SUR LA CARTE
// ================================================================
function _spawnNPCs(W,H){
  ISO.npcs=[];
  var groundY=_groundY(H);
  window.KROVA_BUILDINGS.forEach(function(b){
    if(!b.npcId||!isBuildingActive(b)) return;
    var npc=window.KROVA_NPCS[b.npcId];
    if(!npc) return;
    var pos=_buildingPos(b,W,H);
    ISO.npcs.push({
      id:b.npcId, emoji:npc.emoji,
      x:pos.x+20, y:pos.y,
      baseX:pos.x+20, baseY:pos.y,
      vx:(Math.random()-0.5)*0.3,
      bobOffset:Math.random()*Math.PI*2,
      buildingId:b.id,
    });
  });
}

// ================================================================
// BOUCLE PRINCIPALE
// ================================================================
function _loop(){
  if(!window._villageLoopActive) return;
  tick++;
  ISO.scrollX+=(ISO.targetScrollX-ISO.scrollX)*0.11;
  _draw();
  requestAnimationFrame(_loop);
}

// ================================================================
// DESSIN PRINCIPAL
// ================================================================
function _draw(){
  var c=document.getElementById('villageCanvas');
  if(!c){canvas=null;ctx=null;return;}
  if(c!==canvas){canvas=c;ctx=c.getContext('2d');}
  var dpr=window.devicePixelRatio||1;
  var W=c.width/dpr, H=c.height/dpr;
  if(W<10||H<10) return;
  ctx.save();
  ctx.scale(dpr,dpr);
  var night=(currentWeather==='night');
  var rain =(currentWeather==='rain');

  // SKY
  var sg=ctx.createLinearGradient(0,0,0,H*0.60);
  if(night){sg.addColorStop(0,'#05080f');sg.addColorStop(1,'#0b1220');}
  else if(rain){sg.addColorStop(0,'#2a3545');sg.addColorStop(1,'#3a4a5a');}
  else{sg.addColorStop(0,'#5bb8f5');sg.addColorStop(0.6,'#a8d8f0');sg.addColorStop(1,'#cce8f5');}
  ctx.fillStyle=sg; ctx.fillRect(0,0,W,H);
  if(night) _drawStars(W,H);
  _drawCelestial(W,H,night,rain);
  if(!night&&!rain) _drawClouds(W,H);
  _drawMountains(W,H,night);
  _drawGround(W,H);
  _drawPath(W,H);
  _drawRiver(W,H);
  _drawTrees(W,H);
  _drawBuildings(W,H);
  _drawNPCs(W,H);
  _drawParticles(W,H);
  ctx.restore();
}

// ── Dessin des bâtiments ──────────────────────────────────────────
function _drawBuildings(W,H){
  var xp=(window.S&&S.xp)||0;
  var nl=(window.S&&S.nativeLang)||'fr';
  var gy=_groundY(H);

  window.KROVA_BUILDINGS.forEach(function(b){
    var pos=_buildingPos(b,W,H);
    if(pos.x<-W*0.5||pos.x>W*1.5) return;
    var active=isBuildingActive(b);
    var hovered=ISO.hoveredBuilding===b.id;
    var progress=active?1:_buildProgress(b,xp);
    _drawOneBuilding(pos.x,pos.y,b,active,hovered,progress,W,H,nl);
  });
}

function _drawOneBuilding(x,y,b,active,hovered,progress,W,H,nl){
  var s=H*0.145;
  var bob=active?Math.sin(tick*0.020+x*0.008)*2.5:0;
  var sc=hovered?1.09:1;
  var by=y-s*0.80+bob;

  ctx.save();
  ctx.translate(x,by);
  ctx.scale(sc,sc);

  if(!active&&progress===0){
    // Bâtiment en ruines / à construire
    ctx.globalAlpha=0.28;
    _buildShape(0,0,s,'#444','#333','#555');
    ctx.globalAlpha=1;
    ctx.font=Math.round(s*0.52)+'px serif';
    ctx.textAlign='center';
    ctx.fillText('🔒',0,s*0.08);
    // Barre de progression vers le déblocage
    if(b.buildXP){
      var xp=(window.S&&S.xp)||0;
      var pct=Math.min(xp/b.buildXP,1);
      var bw=s*0.9, bh=6, bx=-s*0.45, bwy=s*0.55;
      ctx.fillStyle='rgba(255,255,255,0.10)';
      _rrect(bx,bwy,bw,bh,3); ctx.fill();
      ctx.fillStyle=b.glow||'rgba(78,207,112,0.5)';
      _rrect(bx,bwy,bw*pct,bh,3); ctx.fill();
    }
  } else if(!active&&progress>0){
    // En construction
    ctx.globalAlpha=0.55;
    _buildShape(0,0,s,'#8a6020','#6a4010','#aa8040');
    ctx.globalAlpha=1;
    ctx.font=Math.round(s*0.40)+'px serif';
    ctx.textAlign='center';
    ctx.fillText('🏗️',0,-s*0.2);
  } else {
    // Actif
    if(hovered){
      ctx.save();
      ctx.shadowColor=b.glow||'rgba(255,215,0,0.4)';
      ctx.shadowBlur=28;
      ctx.beginPath(); ctx.arc(0,-s*0.22,s*0.65,0,Math.PI*2);
      ctx.fillStyle=(b.glow||'rgba(255,215,0,0.4)').replace('0.4','0.12');
      ctx.fill(); ctx.restore();
    }
    // Corps 3D isométrique (couleur unique par bâtiment)
    var col=b.glow?b.glow.replace(/[\d.]+\)$/,'1)').replace('rgba','rgb').replace(',1)',')'):'#4ecf70';
    _buildShape(0,0,s,_shade(col,-0.20),_shade(col,-0.42),_shade(col,0.15));

    // Emoji
    ctx.font=Math.round(s*0.54)+'px serif';
    ctx.textAlign='center';
    ctx.shadowColor='rgba(0,0,0,0.40)'; ctx.shadowBlur=4;
    ctx.fillText(b.emoji,0,s*0.06);
    ctx.shadowBlur=0;

    // Nom du lieu
    var bName=(b.name&&(b.name[((window.S&&S.nativeLang)||'fr')]||b.name.fr))||b.id;
    ctx.font='bold '+Math.round(H*0.018)+'px Sora,Nunito,system-ui';
    ctx.fillStyle='#fff';
    ctx.shadowColor='rgba(0,0,0,0.65)'; ctx.shadowBlur=5; ctx.shadowOffsetY=1;
    ctx.fillText(bName,0,s*0.82);
    ctx.shadowBlur=0;

    // Message d'activité au survol
    if(hovered&&b.routineMsg){
      var rm=(b.routineMsg[(window.S&&S.nativeLang)||'fr']||b.routineMsg.fr);
      ctx.font='italic '+Math.round(H*0.013)+'px Sora,system-ui';
      ctx.fillStyle='rgba(255,255,255,0.60)';
      ctx.fillText(rm,0,s*1.02);
    }
    // Indicateur de quête
    if(b.npcId&&window.KROVA_NPCS[b.npcId]&&window.KROVA_NPCS[b.npcId].questGiver){
      var hasQuest=_hasActiveQuest(b.npcId);
      if(hasQuest){
        ctx.font=Math.round(s*0.28)+'px serif';
        ctx.fillText('❕',s*0.52,-s*0.82);
      }
    }
  }
  ctx.restore();
}

function _hasActiveQuest(npcId){
  var npc=window.KROVA_NPCS[npcId];
  if(!npc||!npc.questGiver||!npc.questId) return false;
  var state=window.KROVA_STATE;
  return !state.completedQuests.includes(npc.questId);
}

// ── PNJ animés ───────────────────────────────────────────────────
function _drawNPCs(W,H){
  ISO.npcs.forEach(function(npc){
    npc.x=npc.baseX+Math.sin(tick*0.015+npc.bobOffset)*6;
    var y=npc.baseY+Math.sin(tick*0.020+npc.bobOffset*1.3)*3-H*0.095*0.40;
    if(npc.x<-30||npc.x>W+30) return;
    ctx.save();
    ctx.font=Math.round(H*0.052)+'px serif';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.shadowColor='rgba(0,0,0,0.35)';
    ctx.shadowBlur=4;
    ctx.fillText(npc.emoji,npc.x,y);
    ctx.restore();
  });
}

// ── Géométrie ────────────────────────────────────────────────────
function _groundY(H){return H*0.60;}

function _buildingPos(b,W,H){
  if(b.ring===null){
    return {x:b.x*W-ISO.scrollX, y:_groundY(H)};
  }
  var totalW=_totalW(W);
  var rings=[W*0.08,W*0.22,W*0.38,W*0.56];
  var centerX=totalW*0.45-ISO.scrollX;
  var centerY=_groundY(H)*0.78;
  if(b.ring===0) return {x:centerX,y:centerY};
  var r=rings[b.ring];
  var a=(b.angle-90)*Math.PI/180;
  return {x:centerX+Math.cos(a)*r, y:centerY+Math.sin(a)*r*0.45};
}

function _totalW(W){return W*1.2;}

function _scrollToBuilding(id,instant){
  var c=document.getElementById('villageCanvas');
  if(!c) return;
  var dpr=window.devicePixelRatio||1, W=c.width/dpr, H=c.height/dpr;
  var b=window.KROVA_BUILDINGS.find(function(bb){return bb.id===id;});
  if(!b) return;
  var target=0;
  var max=Math.max(0,_totalW(W)-W);
  ISO.targetScrollX=Math.max(0,Math.min(target,max));
  if(instant) ISO.scrollX=ISO.targetScrollX;
}

// ── Hit test ─────────────────────────────────────────────────────
function _hitBuilding(mx,my,W,H){
  var s=H*0.145;
  var result=null;
  window.KROVA_BUILDINGS.forEach(function(b){
    var pos=_buildingPos(b,W,H);
    var bob=Math.sin(tick*0.020+pos.x*0.008)*2.5;
    var by=pos.y-s*0.80+bob;
    var cx2=pos.x, cy2=by-s*0.30;
    if(Math.abs(mx-cx2)<s*0.60&&Math.abs(my-cy2)<s*0.72) result=b.id;
  });
  return result;
}

// ── Clic sur bâtiment ────────────────────────────────────────────
function _clickBuilding(id){
  var b=window.KROVA_BUILDINGS.find(function(bb){return bb.id===id;});
  if(!b) return;
  var nl=(window.S&&S.nativeLang)||'fr';
  var xp=(window.S&&S.xp)||0;
  if(window.LV_SOUND) window.LV_SOUND.play('tap');

  if(!isBuildingActive(b)){
    // Afficher l'info de déblocage narratif
    var questMsg=b.questUnlock?(b.questUnlock[nl]||b.questUnlock.fr):null;
    var xpMsg=b.buildXP?'🔒 '+(b.buildXP-xp)+' XP requis':null;
    var msg=questMsg||(b.name&&(b.name[nl]||b.name.fr))||b.id;
    if(typeof showNotif==='function') showNotif((questMsg||xpMsg||msg),3500);
    return;
  }

  // Afficher le panneau du lieu avec le lore
  _openLocationPanel(b,nl);
}

function _openLocationPanel(b,nl){
  var name=(b.name&&(b.name[nl]||b.name.fr))||b.id;
  var lore=(b.lore&&(b.lore[nl]||b.lore.fr))||'';
  var npc=b.npcId?window.KROVA_NPCS[b.npcId]:null;

  // Mettre à jour screen-location
  var locTitle=document.getElementById('locTitle');
  var npcList =document.getElementById('npcList');
  if(locTitle) locTitle.textContent=b.emoji+' '+name;

  if(npcList){
    var loreHtml='<div style="padding:14px 18px 0;font-size:0.78rem;color:rgba(255,255,255,0.42);'
      +'font-style:italic;line-height:1.55;border-left:3px solid rgba(255,255,255,0.10);'
      +'padding-left:14px;margin:0 16px 12px;">'+lore+'</div>';

    if(!npc){
      npcList.innerHTML=loreHtml+'<div style="padding:24px 20px;text-align:center;color:rgba(255,255,255,0.22);">Aucun habitant ici en ce moment.</div>';
    } else {
      var role=(npc.role&&(npc.role[nl]||npc.role.fr))||'';
      var bio =(npc.bio &&(npc.bio [nl]||npc.bio .fr))||'';
      var questIcon=npc.questGiver&&!window.KROVA_STATE.completedQuests.includes(npc.questId)?'❕ ':'';
      var questTxt='';
      if(npc.questGiver&&!window.KROVA_STATE.completedQuests.includes(npc.questId)){
        var q=window.KROVA_QUESTS[npc.questId];
        questTxt='<div style="margin-top:8px;padding:8px 12px;background:rgba(255,215,0,0.08);'
          +'border:1px solid rgba(255,215,0,0.18);border-radius:10px;font-size:0.70rem;color:#ffd700;">'
          +'❕ '+(q&&q.title?(q.title[nl]||q.title.fr):'Quête disponible')+'</div>';
      }
      npcList.innerHTML=loreHtml
        +'<button onclick="openDialogue(\''+b.id+'\',\''+b.npcId+'\')" style="'
        +'display:flex;align-items:flex-start;gap:14px;width:100%;padding:16px 18px;'
        +'background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.08);'
        +'border-radius:18px;margin:8px 16px;cursor:pointer;text-align:left;color:inherit;'
        +'transition:all 0.2s;max-width:calc(100% - 32px);'
        +'" onmouseover="this.style.background=\'rgba(255,255,255,0.08)\'" onmouseout="this.style.background=\'rgba(255,255,255,0.04)\'">'
        +'<div style="font-size:2.4rem;flex-shrink:0;line-height:1">'+npc.emoji+'</div>'
        +'<div style="flex:1;min-width:0;">'
        +'<div style="font-weight:800;font-size:0.95rem;color:#f0e8d0">'+questIcon+npc.name+'</div>'
        +'<div style="font-size:0.68rem;color:rgba(255,255,255,0.35);margin-top:2px">'+role+'</div>'
        +'<div style="font-size:0.74rem;color:rgba(255,255,255,0.48);margin-top:6px;font-style:italic;line-height:1.4;">'+bio+'</div>'
        +questTxt
        +'</div>'
        +'<div style="color:rgba(255,215,0,0.40);font-size:1.3rem;flex-shrink:0;align-self:center">›</div>'
        +'</button>';
    }
  }

  window._villageLoopActive=false;
  if(typeof showScreen==='function') showScreen('screen-location');

  var backBtn=document.querySelector('#screen-location .back-btn');
  if(backBtn&&!backBtn._rpgPatched){
    backBtn._rpgPatched=true;
    var orig=backBtn.onclick;
    backBtn.onclick=function(){
      if(typeof orig==='function') orig.call(this);
      else if(typeof showScreen==='function') showScreen('screen-village');
      window._villageLoopActive=true;
      window._villageLoopRunning=true;
      requestAnimationFrame(_loop);
    };
  }
}

// ================================================================
// ELEMENTS VISUELS
// ================================================================
function _drawStars(W,H){
  ctx.save();
  for(var i=0;i<70;i++){
    var sx=(Math.sin(i*437.1)*0.5+0.5)*W;
    var sy=(Math.sin(i*293.3)*0.5+0.5)*H*0.45;
    var tw=0.3+0.7*Math.sin(tick*0.015+i*0.7);
    ctx.beginPath();ctx.arc(sx,sy,0.4+Math.sin(i*127)*0.5,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,220,'+tw.toFixed(2)+')';ctx.fill();
  }
  ctx.restore();
}

function _drawCelestial(W,H,night,rain){
  var x=W*0.82,y=H*0.12;
  if(night){
    ctx.save();
    var mg=ctx.createRadialGradient(x,y,0,x,y,40);
    mg.addColorStop(0,'rgba(200,190,130,0.22)');mg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=mg;ctx.fillRect(x-40,y-40,80,80);
    ctx.beginPath();ctx.arc(x,y,13,0,Math.PI*2);ctx.fillStyle='#eee8a0';ctx.fill();
    ctx.restore();
  } else if(!rain){
    ctx.save();
    var glow=ctx.createRadialGradient(x,y,0,x,y,52);
    glow.addColorStop(0,'rgba(255,230,80,0.28)');glow.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=glow;ctx.fillRect(x-52,y-52,104,104);
    ctx.beginPath();ctx.arc(x,y,19,0,Math.PI*2);ctx.fillStyle='#ffe055';ctx.fill();
    for(var r=0;r<8;r++){
      var a=(r/8)*Math.PI*2+tick*0.005;
      ctx.beginPath();ctx.moveTo(x+Math.cos(a)*24,y+Math.sin(a)*24);ctx.lineTo(x+Math.cos(a)*33,y+Math.sin(a)*33);
      ctx.strokeStyle='rgba(255,220,60,0.45)';ctx.lineWidth=2;ctx.stroke();
    }
    ctx.restore();
  }
}

function _genClouds(W,H){
  var cl=[];
  for(var i=0;i<6;i++) cl.push({x:W*(0.05+i*0.18),y:H*(0.07+((i%3)*0.05)),r:16+i*6,spd:0.10+i*0.04});
  return cl;
}
function _drawClouds(W,H){
  ISO.clouds.forEach(function(cl){
    cl.x+=cl.spd; if(cl.x>W+cl.r*2) cl.x=-cl.r*2;
    ctx.save();ctx.globalAlpha=0.65;ctx.fillStyle='#fff';
    [[cl.x,cl.y,cl.r],[cl.x+cl.r*0.6,cl.y+cl.r*0.12,cl.r*0.72],
     [cl.x-cl.r*0.55,cl.y+cl.r*0.15,cl.r*0.62],[cl.x+cl.r*0.05,cl.y+cl.r*0.36,cl.r*0.88]]
    .forEach(function(b){ctx.beginPath();ctx.arc(b[0],b[1],b[2],0,Math.PI*2);ctx.fill();});
    ctx.restore();
  });
}

function _drawMountains(W,H,night){
  var gy=_groundY(H);
  var cols=night?['#14182a','#0f1322','#0a0e1a']:['#6aaf88','#52906e','#3d7853'];
  var peaks=[[W*0.04,gy-H*0.20,W*0.17],[W*0.20,gy-H*0.27,W*0.14],
             [W*0.40,gy-H*0.22,W*0.16],[W*0.60,gy-H*0.30,W*0.17],
             [W*0.78,gy-H*0.23,W*0.14],[W*0.95,gy-H*0.26,W*0.15]];
  peaks.forEach(function(p,i){
    ctx.beginPath();ctx.moveTo(p[0]-p[2]*0.5,gy);ctx.lineTo(p[0],p[1]);ctx.lineTo(p[0]+p[2]*0.5,gy);ctx.closePath();
    ctx.fillStyle=cols[i%cols.length];ctx.fill();
    if(!night){
      ctx.beginPath();ctx.moveTo(p[0]-p[2]*0.06,p[1]+p[2]*0.10);ctx.lineTo(p[0],p[1]);ctx.lineTo(p[0]+p[2]*0.06,p[1]+p[2]*0.10);ctx.closePath();
      ctx.fillStyle='rgba(255,255,255,0.80)';ctx.fill();
    }
  });
}

function _drawGround(W,H){
  var gy=_groundY(H);
  var gg=ctx.createLinearGradient(0,gy-H*0.02,0,H);
  gg.addColorStop(0,'#55a858');gg.addColorStop(0.25,'#479a4a');gg.addColorStop(1,'#35783a');
  ctx.fillStyle=gg;
  ctx.beginPath();ctx.moveTo(0,gy-H*0.02);
  ctx.bezierCurveTo(W*0.3,gy-H*0.06,W*0.7,gy+H*0.02,W,gy-H*0.01);
  ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(130,220,110,0.16)';
  ctx.beginPath();ctx.moveTo(0,gy-H*0.02);
  ctx.bezierCurveTo(W*0.3,gy-H*0.06,W*0.7,gy+H*0.02,W,gy-H*0.01);
  ctx.lineTo(W,gy+H*0.018);ctx.bezierCurveTo(W*0.7,gy+H*0.038,W*0.3,gy-H*0.042,0,gy+H*0.016);
  ctx.closePath();ctx.fill();
}

function _drawPath(W,H){
  var gy=_groundY(H);
  ctx.save();
  ctx.strokeStyle='rgba(0,0,0,0.14)';ctx.lineWidth=W*0.055;ctx.lineCap='round';ctx.lineJoin='round';
  ctx.beginPath();ctx.arc(W*0.5-ISO.scrollX*0,_groundY(H)*0.78,W*0.22*0.92,0,Math.PI*2);ctx.stroke();
  [W*0.38,W*0.22,W*0.56,W*0.08].forEach(function(r){
    ctx.beginPath();ctx.arc(W*0.5-ISO.scrollX*0,_groundY(H)*0.78,r,0,Math.PI*2);
    ctx.strokeStyle='rgba(196,160,80,0.25)';ctx.lineWidth=W*0.022;ctx.stroke();
  });
  // Chemin principal de la maison
  ctx.strokeStyle='#c4a050';ctx.lineWidth=W*0.028;
  ctx.beginPath();ctx.moveTo(W*0.5-ISO.scrollX*0,_groundY(H)*0.78);ctx.lineTo(W*0.5-ISO.scrollX*0,_groundY(H)+H*0.02);ctx.stroke();
  ctx.restore();
}

function _drawRiver(W,H){
  var gy=_groundY(H);
  var rx=W*0.82;
  if(rx<-W*0.15||rx>W*1.15) return;
  ctx.save();
  var rg=ctx.createLinearGradient(rx-14,0,rx+14,0);
  rg.addColorStop(0,'#3a80a8');rg.addColorStop(0.5,'#52aad0');rg.addColorStop(1,'#3a80a8');
  ctx.fillStyle=rg;
  ctx.beginPath();ctx.moveTo(rx-14,gy-H*0.04);
  ctx.bezierCurveTo(rx-18,gy,rx+18,gy+H*0.015,rx+14,H*0.95);
  ctx.bezierCurveTo(rx+22,gy+H*0.015,rx-10,gy,rx-6,gy-H*0.04);ctx.closePath();ctx.fill();
  ctx.globalAlpha=0.25;ctx.fillStyle='#90d0ee';
  for(var r2=0;r2<5;r2++){var ry2=gy+r2*H*0.05;ctx.fillRect(rx-5+r2,ry2,10-r2*1.5,2.5);}
  ctx.globalAlpha=1;
  var by2=gy+H*0.016;
  ctx.fillStyle='#7a5c10';ctx.fillRect(rx-26,by2-5,52,9);
  ctx.strokeStyle='#5a3e08';ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(rx,by2+20,22,Math.PI,0);ctx.stroke();
  ctx.fillStyle='#9a7a28';
  for(var p2=-3;p2<=3;p2++){ctx.fillRect(rx+p2*7-1.5,by2-13,3,9);}
  ctx.restore();
}

function _drawTrees(W,H){
  var gy=_groundY(H);
  var pts=[];
  window.KROVA_BUILDINGS.forEach(function(b){
    if(b.ring===null) return;
    var pos=_buildingPos(b,W,H);
    pts.push({x:pos.x-W*0.06,y:gy,s:0.40});
  });
  [W*0.05,W*0.95,W*0.15,W*0.88].forEach(function(tx,i){
    pts.push({x:tx,y:gy,s:0.48+i*0.04});
  });
  pts.forEach(function(t){
    if(t.x<-50||t.x>W+50) return;
    _tree(t.x,t.y,t.s,H);
  });
}
function _tree(x,y,sc,H){
  var s=sc*H*0.065;
  ctx.fillStyle='#5a3218';ctx.fillRect(x-s*0.10,y-s*0.28,s*0.20,s*0.32);
  [{dy:-s*0.22,r:s*0.40,c:'#267530'},{dy:-s*0.48,r:s*0.34,c:'#32954a'},{dy:-s*0.70,r:s*0.24,c:'#3fbb5e'}]
  .forEach(function(l){ctx.beginPath();ctx.arc(x,y+l.dy,l.r,0,Math.PI*2);ctx.fillStyle=l.c;ctx.fill();});
}

function _drawParticles(W,H){
  if(tick%14===0&&ISO.particles.length<16){
    var gy2=_groundY(H);
    ISO.particles.push({x:Math.random()*W,y:gy2-Math.random()*H*0.18,
      vx:(Math.random()-0.5)*0.7,vy:-0.5-Math.random()*0.5,life:1,decay:0.010,
      r:1.5+Math.random()*3,col:['#4ecf70','#ffd700','#ff9f43','#4a9eff'][Math.floor(Math.random()*4)]});
  }
  ISO.particles=ISO.particles.filter(function(p){
    p.x+=p.vx;p.y+=p.vy;p.life-=p.decay;if(p.life<=0) return false;
    ctx.save();ctx.globalAlpha=p.life*0.50;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=p.col;ctx.fill();ctx.restore();return true;
  });
}

function _buildProgress(b,xp){
  if(!b.buildXP) return 0;
  return Math.min(xp/b.buildXP,1);
}

// ── Utilitaires ──────────────────────────────────────────────────
function _buildShape(x,y,s,L,R,T){
  var hw=s*0.44,hh=s*0.48,th=s*0.18;
  ctx.beginPath();ctx.moveTo(x-hw,y);ctx.lineTo(x,y-hh);ctx.lineTo(x,y-hh-th*0.5);ctx.lineTo(x-hw,y-th*0.5);ctx.closePath();ctx.fillStyle=L;ctx.fill();
  ctx.beginPath();ctx.moveTo(x,y-hh);ctx.lineTo(x+hw,y);ctx.lineTo(x+hw,y-th*0.5);ctx.lineTo(x,y-hh-th*0.5);ctx.closePath();ctx.fillStyle=R;ctx.fill();
  ctx.beginPath();ctx.moveTo(x-hw,y-th*0.5);ctx.lineTo(x,y-hh-th);ctx.lineTo(x+hw,y-th*0.5);ctx.lineTo(x,y-th*0.20);ctx.closePath();ctx.fillStyle=T;ctx.fill();
  ctx.strokeStyle='rgba(0,0,0,0.12)';ctx.lineWidth=0.8;ctx.stroke();
}
function _rrect(x,y,w,h,r){
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
}
function _shade(hex,p){
  var c=hex.replace('#','');if(c.length===3)c=c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
  if(c.length<6||c.includes('('))return '#4ecf70';
  var r2=parseInt(c.slice(0,2),16),g=parseInt(c.slice(2,4),16),b2=parseInt(c.slice(4,6),16);
  return 'rgb('+Math.max(0,Math.min(255,Math.round(r2+r2*p)))+','+Math.max(0,Math.min(255,Math.round(g+g*p)))+','+Math.max(0,Math.min(255,Math.round(b2+b2*p)))+')';
}

// ================================================================
// ÉVÉNEMENTS TOUCH / SOURIS
// ================================================================
function _onTouchStart(e){e.preventDefault();ISO.touchStartX=e.touches[0].clientX;ISO.touchScrollX=ISO.targetScrollX;ISO.touchMoved=false;ISO.tapTime=Date.now();}
function _onTouchMove(e){e.preventDefault();var dx=ISO.touchStartX-e.touches[0].clientX;if(Math.abs(dx)>6)ISO.touchMoved=true;var c=document.getElementById('villageCanvas');var dpr=window.devicePixelRatio||1,W=c?c.width/dpr:360;ISO.targetScrollX=Math.max(0,Math.min(ISO.touchScrollX+dx,Math.max(0,_totalW(W)-W)));}
function _onTouchEnd(e){var c=document.getElementById('villageCanvas');var dpr=window.devicePixelRatio||1,W=c?c.width/dpr:360,H=c?c.height/dpr:640;if(!ISO.touchMoved&&Date.now()-ISO.tapTime<300){var t=e.changedTouches[0];var rect=c.getBoundingClientRect();_clickBuilding(_hitBuilding(t.clientX-rect.left,t.clientY-rect.top,W,H)||'');}ISO.touchMoved=false;}
function _onMouseDown(e){ISO.isDragging=true;ISO.dragStartX=e.clientX;ISO.dragScrollX=ISO.targetScrollX;ISO.touchMoved=false;var c=document.getElementById('villageCanvas');if(c)c.style.cursor='grabbing';}
function _onMouseMove(e){var c=document.getElementById('villageCanvas');if(!c)return;var dpr=window.devicePixelRatio||1,W=c.width/dpr,H=c.height/dpr;var rect=c.getBoundingClientRect();var mx=e.clientX-rect.left,my=e.clientY-rect.top;if(ISO.isDragging){var dx=ISO.dragStartX-e.clientX;if(Math.abs(dx)>5)ISO.touchMoved=true;ISO.targetScrollX=Math.max(0,Math.min(ISO.dragScrollX+dx,Math.max(0,_totalW(W)-W)));}else{var h=_hitBuilding(mx,my,W,H);ISO.hoveredBuilding=h;c.style.cursor=h?'pointer':'grab';}}
function _onMouseUp(e){var c=document.getElementById('villageCanvas');var dpr=window.devicePixelRatio||1,W=c?c.width/dpr:360;if(ISO.isDragging){ISO.isDragging=false;if(c)c.style.cursor=ISO.hoveredBuilding?'pointer':'grab';}ISO.touchMoved=false;}
function _onClick(e){if(ISO.touchMoved||ISO.isDragging)return;var c=document.getElementById('villageCanvas');if(!c)return;var dpr=window.devicePixelRatio||1,W=c.width/dpr,H=c.height/dpr;var rect=c.getBoundingClientRect();_clickBuilding(_hitBuilding(e.clientX-rect.left,e.clientY-rect.top,W,H)||'');}

// ================================================================
// NAV BAR
// ================================================================
var NAV_LABELS={
  village:  {fr:'Krova',   en:'Krova',   es:'Krova',   ht:'Krova'},
  lessons:  {fr:'Leçons',  en:'Lessons', es:'Lecciones',ht:'Leson'},
  practice: {fr:'Pratique',en:'Practice',es:'Práctica', ht:'Pratik'},
  alphabet: {fr:'Langues', en:'Languages',es:'Idiomas',  ht:'Lang'},
  profile:  {fr:'Profil',  en:'Profile', es:'Perfil',   ht:'Pwofil'}
};

function _buildNavBar(){
  var old=document.querySelector('.village-nav-bar');if(old)old.remove();
  var vs=document.getElementById('screen-village');if(!vs)return;
  var tl=(window.S&&S.targetLang)||'fr';
  var tabs=[{id:'village',icon:'🏘️'},{id:'lessons',icon:'📖'},{id:'practice',icon:'💬'},{id:'alphabet',icon:'🔤'},{id:'profile',icon:'👤'}];
  var nav=document.createElement('nav');nav.className='village-nav-bar';
  nav.innerHTML=tabs.map(function(t){
    var lbl=(NAV_LABELS[t.id]&&(NAV_LABELS[t.id][tl]||NAV_LABELS[t.id].fr))||t.id;
    return '<button class="vnb-btn'+(t.id==='village'?' active':'')+'" id="vnb-'+t.id+'" onclick="window._navTo(\''+t.id+'\')"><span class="vnb-icon">'+t.icon+'</span><span class="vnb-label">'+lbl+'</span></button>';
  }).join('');
  vs.appendChild(nav);
  if(!document.getElementById('vnb-css')){
    var st=document.createElement('style');st.id='vnb-css';
    st.textContent='.village-nav-bar{flex-shrink:0;display:flex;align-items:stretch;justify-content:space-around;background:rgba(6,8,16,0.98);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,0.06);padding:6px 0 max(6px,env(safe-area-inset-bottom));z-index:30;}'
    +'.vnb-btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;background:none;border:none;color:rgba(255,255,255,0.32);font-size:0.58rem;font-weight:800;letter-spacing:0.03em;padding:6px 0;cursor:pointer;transition:color 0.18s;-webkit-tap-highlight-color:transparent;}'
    +'.vnb-btn.active{color:#4ecf70;}.vnb-btn:active{opacity:0.7;}'
    +'.vnb-icon{font-size:1.25rem;line-height:1;transition:transform 0.18s;}.vnb-btn.active .vnb-icon{transform:scale(1.18);}'
    +'.vnb-label{font-size:0.56rem;font-family:Sora,Nunito,system-ui;}';
    document.head.appendChild(st);
  }
}

window._navTo=function(section){
  document.querySelectorAll('.vnb-btn').forEach(function(b){b.classList.remove('active');});
  var btn=document.getElementById('vnb-'+section);if(btn)btn.classList.add('active');
  switch(section){
    case 'village': window._villageLoopActive=true;window._villageLoopRunning=true;requestAnimationFrame(_loop);break;
    case 'lessons':
      window._villageLoopActive=false;
      if(typeof ensureLearningBindings==='function')ensureLearningBindings();
      var fvk=window.VOCAB?Object.keys(window.VOCAB)[0]:null;
      if(fvk&&typeof loadVocab==='function')loadVocab(fvk);
      if(typeof showScreen==='function')showScreen('screen-vocab');break;
    case 'practice':
      window._villageLoopActive=false;
      var fpk=window.PHRASES_DATA?Object.keys(window.PHRASES_DATA)[0]:null;
      if(fpk&&typeof loadPhrases==='function')loadPhrases(fpk);
      if(typeof showScreen==='function')showScreen('screen-phrases');break;
    case 'alphabet':
      window._villageLoopActive=false;
      if(typeof openAlphabet==='function')openAlphabet((window.S&&S.targetLang)||'en',(window.S&&S.nativeLang)||'fr');break;
    case 'profile':
      window._villageLoopActive=false;
      if(typeof showScreen==='function')showScreen('screen-profile');break;
  }
};

// ================================================================
// MÉTÉO + TEMPS
// ================================================================
function setWeather(w){window.currentWeather=w||'sun';}
function getWeatherForTime(){var h=new Date().getHours();if(h>=21||h<6)return 'night';return Math.random()<0.10?'rain':'sun';}
function updateTime(){
  var el=document.getElementById('hudTime');
  if(el){var n=new Date();el.textContent=('0'+n.getHours()).slice(-2)+':'+('0'+n.getMinutes()).slice(-2);}
  var we=document.getElementById('hudWeather');
  if(we&&window.WEATHER_ICONS)we.textContent=WEATHER_ICONS[currentWeather]||'☀️';
}

// ================================================================
// COMPATIBILITÉ
// ================================================================
function alignLocationsToRings(){}
function initCanvas(){_initCanvas();}
function drawVillage(){_draw();}
window.goVillage=goVillage;window.setWeather=setWeather;window.updateTime=updateTime;
window.initCanvas=initCanvas;window.drawVillage=drawVillage;window.alignLocationsToRings=alignLocationsToRings;
window.checkBuildUnlocks=checkBuildUnlocks;

console.log('✅ village_rpg.js chargé — KROVA LIVING WORLD');
