// world.js — LinguaVillage World Architecture
// Le pays de LINGORIA — monde vivant, carte interactive, progression sociale
// ================================================================

window.LV_WORLD = (function() {
'use strict';

// ================================================================
// LE PAYS : LINGORIA
// Un pays insulaire imaginaire où convergent toutes les langues du monde.
// Histoire : Lingoria fut fondée par des explorateurs de 8 nations différentes
// qui choisirent de construire ensemble une cité de l'échange.
// Chaque région porte l'empreinte d'une culture, d'une époque, d'une ambiance.
// ================================================================

var STORY = {
  intro: {
    fr: [
      "Il y a des années, tu as reçu une lettre mystérieuse.",
      "Elle portait le sceau d'un pays que personne autour de toi ne connaissait.",
      "LINGORIA.",
      "Une île au carrefour des mondes. Une cité des langues.",
      "La lettre disait : « Nous avons besoin de quelqu'un comme vous. »",
      "Tu as traversé l'océan. Le bateau t'a déposé à l'aube.",
      "La ville dormait encore. Mais ses lumières te regardaient.",
      "Tu ne parlais pas encore leur langue.",
      "Mais tu allais apprendre.",
    ],
    en: [
      "Years ago, you received a mysterious letter.",
      "It bore the seal of a country nobody around you had ever heard of.",
      "LINGORIA.",
      "An island at the crossroads of worlds. A city of languages.",
      "The letter said: 'We need someone like you.'",
      "You crossed the ocean. The ship left you at dawn.",
      "The city was still asleep. But its lights were watching you.",
      "You didn't speak their language yet.",
      "But you were going to learn.",
    ],
    es: [
      "Hace años, recibiste una carta misteriosa.",
      "Llevaba el sello de un país que nadie a tu alrededor conocía.",
      "LINGORIA.",
      "Una isla en el cruce de los mundos. Una ciudad de idiomas.",
      "La carta decía: 'Necesitamos a alguien como usted.'",
      "Cruzaste el océano. El barco te dejó al amanecer.",
      "La ciudad aún dormía. Pero sus luces te observaban.",
      "Aún no hablabas su idioma.",
      "Pero ibas a aprenderlo.",
    ],
    ht: [
      "Ane pase, ou te resevwa yon lèt misterye.",
      "Li te gen sèl yon peyi pèsonn autou ou pa te konnen.",
      "LINGORIA.",
      "Yon zile nan kafou monn yo. Yon vil lang.",
      "Lèt la te di: 'Nou bezwen yon moun tankou ou.'",
      "Ou te travèse oseyan an. Bato a te kite ou nan lotbò.",
      "Vil la t ap dòmi toujou. Men limyè li yo t ap gade ou.",
      "Ou pa te pale lang yo toujou.",
      "Men ou t ap aprann.",
    ]
  }
};

// ================================================================
// STATUTS SOCIAUX — remplace XP → Niveau
// ================================================================
var SOCIAL_RANKS = [
  {
    id:       'stranger',
    xp:       0,
    icon:     '🚢',
    label:    {fr:'Étranger',      en:'Stranger',      es:'Extranjero',    ht:'Etranje'},
    desc:     {fr:'Tu viens d\'arriver. Personne ne te connaît encore. La ville t\'observe.',
               en:'You just arrived. Nobody knows you yet. The city watches you.',
               es:'Acabas de llegar. Nadie te conoce todavía. La ciudad te observa.',
               ht:'Ou fèk rive. Pèsonn pa konnen ou toujou. Vil la ap gade ou.'},
    unlocks:  ['port','village_center'],
    color:    '#8899aa',
    ceremony: false,
  },
  {
    id:       'traveler',
    xp:       150,
    icon:     '🎒',
    label:    {fr:'Voyageur',      en:'Traveler',      es:'Viajero',       ht:'Vwayajè'},
    desc:     {fr:'Tu te repères dans les rues. Les commerçants commencent à te reconnaître.',
               en:'You find your way around. The merchants are starting to recognize you.',
               es:'Te orientas por las calles. Los comerciantes empiezan a reconocerte.',
               ht:'Ou koumanse konnen ri yo. Machann yo ap koumanse rekonèt ou.'},
    unlocks:  ['market_district','inn','river_bridge'],
    color:    '#66aacc',
    ceremony: true,
  },
  {
    id:       'resident',
    xp:       400,
    icon:     '🏠',
    label:    {fr:'Résident',      en:'Resident',      es:'Residente',     ht:'Rezidan'},
    desc:     {fr:'Tu as ta propre chambre. Les voisins te saluent par ton prénom.',
               en:'You have your own room. The neighbors greet you by name.',
               es:'Tienes tu propia habitación. Los vecinos te saludan por tu nombre.',
               ht:'Ou gen chanm pa ou. Vwazen yo salye ou pa non ou.'},
    unlocks:  ['residential_quarter','library','school_district'],
    color:    '#4ecf70',
    ceremony: true,
  },
  {
    id:       'citizen',
    xp:       800,
    icon:     '📋',
    label:    {fr:'Citoyen',       en:'Citizen',       es:'Ciudadano',     ht:'Sitwayen'},
    desc:     {fr:'Tu as ta carte de résident. Tu peux voter, travailler, témoigner.',
               en:'You have your residency card. You can vote, work, testify.',
               es:'Tienes tu tarjeta de residente. Puedes votar, trabajar, atestiguar.',
               ht:'Ou gen kat rezidans ou. Ou ka vote, travay, temwaye.'},
    unlocks:  ['city_hall','courthouse','artisan_quarter','north_forest'],
    color:    '#4a9eff',
    ceremony: true,
  },
  {
    id:       'merchant',
    xp:       1400,
    icon:     '⚖️',
    label:    {fr:'Marchand',      en:'Merchant',      es:'Mercader',      ht:'Machann'},
    desc:     {fr:'Tu négocie, tu échange, tu construis des liens économiques dans le pays.',
               en:'You negotiate, exchange, and build economic ties across the land.',
               es:'Negocias, intercambias, construyes lazos económicos por todo el país.',
               ht:'Ou negosye, ou echanje, ou bati lyen ekonomik atravè peyi a.'},
    unlocks:  ['trade_port','mountain_pass','southern_village'],
    color:    '#ff9f43',
    ceremony: true,
  },
  {
    id:       'counselor',
    xp:       2200,
    icon:     '🏛️',
    label:    {fr:'Conseiller',    en:'Counselor',     es:'Consejero',     ht:'Konseyè'},
    desc:     {fr:'Le gouverneur te consulte. Tes mots influencent les décisions de la cité.',
               en:'The governor consults you. Your words influence the city\'s decisions.',
               es:'El gobernador te consulta. Tus palabras influyen en las decisiones de la ciudad.',
               ht:'Gouvènè a konsulte ou. Mo ou yo enfliyanse desizyon vil la.'},
    unlocks:  ['governors_palace','ancient_ruins','mountain_peak'],
    color:    '#e040fb',
    ceremony: true,
  },
  {
    id:       'ambassador',
    xp:       3500,
    icon:     '🌍',
    label:    {fr:'Ambassadeur',   en:'Ambassador',    es:'Embajador',     ht:'Ambassadè'},
    desc:     {fr:'Tu représentes Lingoria dans les négociations internationales.',
               en:'You represent Lingoria in international negotiations.',
               es:'Representas a Lingoria en las negociaciones internacionales.',
               ht:'Ou reprezante Lingoria nan negosyasyon entènasyonal.'},
    unlocks:  ['embassy_row','lighthouse_isle','capital_spire'],
    color:    '#ffd700',
    ceremony: true,
  },
  {
    id:       'master',
    xp:       6000,
    icon:     '👑',
    label:    {fr:'Maître des langues', en:'Language Master', es:'Maestro de idiomas', ht:'Mèt lang'},
    desc:     {fr:'Lingoria te considère comme l\'un des siens. Ta voix est celle de la cité.',
               en:'Lingoria considers you one of its own. Your voice is the voice of the city.',
               es:'Lingoria te considera uno de los suyos. Tu voz es la voz de la ciudad.',
               ht:'Lingoria konsidere ou youn nan pa yo. Vwa ou se vwa vil la.'},
    unlocks:  ['all'],
    color:    '#ff6b6b',
    ceremony: true,
  },
];

// ================================================================
// CARTE DU PAYS — régions et lieux
// ================================================================
var WORLD_MAP = {
  country: 'Lingoria',
  regions: [
    // ── RÉGION 1 : LE PORT D'ARRIVÉE ────────────────────────────
    {
      id: 'arrival_coast',
      name: {fr:'La Côte d\'Arrivée', en:'Arrival Coast', es:'Costa de llegada', ht:'Kòt Rive'},
      desc: {fr:'Le premier souffle de Lingoria. Le port bruisse de langues mélangées.',
             en:'The first breath of Lingoria. The port buzzes with mixed languages.',
             es:'El primer aliento de Lingoria. El puerto zumba con idiomas mezclados.',
             ht:'Premye souf Lingoria. Pò a plen ak lang melanje.'},
      ambiance: 'coastal',
      emoji: '⚓',
      color: '#4a9eff',
      xMin:0.05, yMin:0.75, xMax:0.35, yMax:0.95,
      requiredRank: 'stranger',
      locations: [
        {id:'port', name:{fr:'Le Port',en:'The Port',es:'El Puerto',ht:'Pò a'}, emoji:'🚢',
         npcId:'harbor_master', mood:'busy', x:0.12, y:0.88},
        {id:'customs', name:{fr:'La Douane',en:'Customs',es:'La Aduana',ht:'Ladwann'}, emoji:'🛃',
         npcId:'customs_officer', mood:'strict', x:0.22, y:0.82},
        {id:'inn', name:{fr:'L\'Auberge du Marin',en:'Sailor\'s Inn',es:'Posada del Marinero',ht:'Otèl Maren'}, emoji:'🏨',
         npcId:'innkeeper', mood:'warm', x:0.18, y:0.78},
      ]
    },

    // ── RÉGION 2 : LE VILLAGE CENTRAL ────────────────────────────
    {
      id: 'village_heart',
      name: {fr:'Le Cœur du Village', en:'Village Heart', es:'Corazón del pueblo', ht:'Kè Vilaj la'},
      desc: {fr:'La vie quotidienne de Lingoria. Ici, chaque rue a sa propre histoire.',
             en:'The daily life of Lingoria. Here, every street has its own story.',
             es:'La vida cotidiana de Lingoria. Aquí, cada calle tiene su propia historia.',
             ht:'Lavi chak jou Lingoria. Isit, chak ri gen pwòp istwa pa li.'},
      ambiance: 'village',
      emoji: '🏘️',
      color: '#4ecf70',
      xMin:0.25, yMin:0.50, xMax:0.60, yMax:0.80,
      requiredRank: 'stranger',
      locations: [
        {id:'park', name:{fr:'Le Parc Central',en:'Central Park',es:'Parque Central',ht:'Pak Santral'}, emoji:'🌳',
         npcId:'elder', mood:'peaceful', x:0.38, y:0.62},
        {id:'school', name:{fr:'L\'École',en:'The School',es:'La Escuela',ht:'Lekòl la'}, emoji:'🏫',
         npcId:'teacher', mood:'encouraging', x:0.45, y:0.58},
        {id:'market', name:{fr:'Le Marché',en:'The Market',es:'El Mercado',ht:'Mache a'}, emoji:'🏪',
         npcId:'merchant', mood:'lively', x:0.32, y:0.70},
        {id:'church', name:{fr:'L\'Église',en:'The Church',es:'La Iglesia',ht:'Legliz la'}, emoji:'⛪',
         npcId:'pastor', mood:'solemn', x:0.50, y:0.66},
        {id:'tavern', name:{fr:'La Taverne',en:'The Tavern',es:'La Taberna',ht:'Tavèn nan'}, emoji:'🍺',
         npcId:'bartender', mood:'lively', x:0.28, y:0.76},
      ]
    },

    // ── RÉGION 3 : LE QUARTIER DES ARTISANS ──────────────────────
    {
      id: 'artisan_quarter',
      name: {fr:'Le Quartier des Artisans', en:'Artisan Quarter', es:'Barrio de los Artesanos', ht:'Katye Atizan yo'},
      desc: {fr:'Les ateliers sentent le bois et la forge. Chaque artisan a sa technique secrète.',
             en:'The workshops smell of wood and forge. Each artisan has a secret technique.',
             es:'Los talleres huelen a madera y fragua. Cada artesano tiene su técnica secreta.',
             ht:'Atelye yo santi bwa ak fòj. Chak atizán gen teknik sekrè pa li.'},
      ambiance: 'workshop',
      emoji: '⚒️',
      color: '#ff9f43',
      xMin:0.55, yMin:0.55, xMax:0.85, yMax:0.80,
      requiredRank: 'citizen',
      locations: [
        {id:'blacksmith', name:{fr:'La Forge',en:'The Forge',es:'La Fragua',ht:'Fòj la'}, emoji:'⚒️',
         npcId:'blacksmith', mood:'focused', x:0.62, y:0.72},
        {id:'library', name:{fr:'La Bibliothèque',en:'The Library',es:'La Biblioteca',ht:'Bibliyotèk la'}, emoji:'📚',
         npcId:'librarian', mood:'calm', x:0.72, y:0.62},
        {id:'hospital', name:{fr:'L\'Hôpital',en:'The Hospital',es:'El Hospital',ht:'Lopital la'}, emoji:'🏥',
         npcId:'doctor', mood:'professional', x:0.78, y:0.68},
        {id:'bank', name:{fr:'La Banque',en:'The Bank',es:'El Banco',ht:'Bank la'}, emoji:'🏦',
         npcId:'banker', mood:'precise', x:0.68, y:0.58},
      ]
    },

    // ── RÉGION 4 : LE QUARTIER NORD — La Forêt ────────────────────
    {
      id: 'north_forest',
      name: {fr:'La Forêt du Nord', en:'Northern Forest', es:'Bosque del Norte', ht:'Forè Nò'},
      desc: {fr:'Une forêt ancienne gardée par des traditions orales. Les arbres murmurent.',
             en:'An ancient forest kept by oral traditions. The trees whisper.',
             es:'Un bosque antiguo guardado por tradiciones orales. Los árboles susurran.',
             ht:'Yon forè ansyen ki kenbe pa tradisyon oral. Pyebwa yo ap chichote.'},
      ambiance: 'forest',
      emoji: '🌲',
      color: '#2d8a3a',
      xMin:0.60, yMin:0.15, xMax:0.95, yMax:0.55,
      requiredRank: 'citizen',
      locations: [
        {id:'forest_shrine', name:{fr:'Le Sanctuaire',en:'The Shrine',es:'El Santuario',ht:'Sanktiyè a'}, emoji:'⛩️',
         npcId:'forest_keeper', mood:'mystical', x:0.78, y:0.32},
        {id:'lumber_camp', name:{fr:'Le Camp',en:'The Camp',es:'El Campamento',ht:'Kan an'}, emoji:'🪵',
         npcId:'woodcutter', mood:'direct', x:0.68, y:0.42},
      ]
    },

    // ── RÉGION 5 : LE PORT COMMERCIAL ─────────────────────────────
    {
      id: 'trade_port',
      name: {fr:'Le Port Commercial', en:'Trade Port', es:'Puerto Comercial', ht:'Pò Komès'},
      desc: {fr:'Des navires du monde entier s\'arrêtent ici. C\'est là que tout se négocie.',
             en:'Ships from around the world stop here. This is where everything is negotiated.',
             es:'Barcos de todo el mundo se detienen aquí. Aquí es donde se negocia todo.',
             ht:'Bato soti toupatou vin kanpe isit. Se isit tout bagay ap negosye.'},
      ambiance: 'trading',
      emoji: '🚢',
      color: '#4a9eff',
      xMin:0.05, yMin:0.40, xMax:0.30, yMax:0.70,
      requiredRank: 'merchant',
      locations: [
        {id:'trade_office', name:{fr:'Bureau Commercial',en:'Trade Office',es:'Oficina Comercial',ht:'Biwo Komès'}, emoji:'📊',
         npcId:'trade_agent', mood:'sharp', x:0.14, y:0.52},
        {id:'warehouse', name:{fr:'L\'Entrepôt',en:'Warehouse',es:'El Almacén',ht:'Depo a'}, emoji:'🏭',
         npcId:'warehouse_boss', mood:'busy', x:0.22, y:0.60},
      ]
    },

    // ── RÉGION 6 : LES MONTAGNES ──────────────────────────────────
    {
      id: 'mountain_pass',
      name: {fr:'Le Col de la Montagne', en:'Mountain Pass', es:'Paso de Montaña', ht:'Kòl Mòn'},
      desc: {fr:'Les anciens disent que la langue originale de Lingoria vient d\'ici.',
             en:'The elders say Lingoria\'s original language came from here.',
             es:'Los ancianos dicen que el idioma original de Lingoria viene de aquí.',
             ht:'Granmoun yo di lang orijinal Lingoria soti isit.'},
      ambiance: 'mountain',
      emoji: '⛰️',
      color: '#8899bb',
      xMin:0.30, yMin:0.10, xMax:0.62, yMax:0.48,
      requiredRank: 'merchant',
      locations: [
        {id:'mountain_village', name:{fr:'Village de Montagne',en:'Mountain Village',es:'Pueblo de Montaña',ht:'Vilaj Mòn'}, emoji:'🏔️',
         npcId:'mountain_elder', mood:'wise', x:0.42, y:0.28},
        {id:'ancient_ruins', name:{fr:'Les Ruines',en:'The Ruins',es:'Las Ruinas',ht:'Rin yo'}, emoji:'🏛️',
         npcId:'archaeologist', mood:'excited', x:0.52, y:0.20},
      ]
    },

    // ── RÉGION 7 : LA CAPITALE ────────────────────────────────────
    {
      id: 'capital',
      name: {fr:'La Capitale : Linguoria', en:'Capital: Linguoria', es:'Capital: Linguoria', ht:'Kapital: Linguoria'},
      desc: {fr:'Le cœur politique de Lingoria. Ici, les mots ont un vrai poids.',
             en:'The political heart of Lingoria. Here, words carry real weight.',
             es:'El corazón político de Lingoria. Aquí, las palabras tienen peso real.',
             ht:'Kè politik Lingoria. Isit, mo yo gen yon pwa reyèl.'},
      ambiance: 'capital',
      emoji: '🏛️',
      color: '#ffd700',
      xMin:0.30, yMin:0.48, xMax:0.60, yMax:0.52,
      requiredRank: 'counselor',
      locations: [
        {id:'governors_palace', name:{fr:'Palais du Gouverneur',en:'Governor\'s Palace',es:'Palacio del Gobernador',ht:'Palè Gouvènè'}, emoji:'🏰',
         npcId:'governor', mood:'regal', x:0.42, y:0.50},
        {id:'city_hall', name:{fr:'Hôtel de Ville',en:'City Hall',es:'Ayuntamiento',ht:'Mairie'}, emoji:'🏛️',
         npcId:'city_clerk', mood:'official', x:0.50, y:0.50},
        {id:'embassy_row', name:{fr:'Avenue des Ambassades',en:'Embassy Row',es:'Avenida de Embajadas',ht:'Avenue Ambassad yo'}, emoji:'🌍',
         npcId:'head_diplomat', mood:'diplomatic', x:0.38, y:0.50},
      ]
    },
  ],

  // ── ROUTES entre régions ──────────────────────────────────────
  routes: [
    {from:'arrival_coast', to:'village_heart', type:'road', label:{fr:'Route principale',en:'Main road'}},
    {from:'village_heart', to:'artisan_quarter', type:'road', label:{fr:'Rue des Artisans',en:'Artisan Street'}},
    {from:'village_heart', to:'north_forest', type:'path', label:{fr:'Sentier du Nord',en:'Northern Path'}},
    {from:'arrival_coast', to:'trade_port', type:'road', label:{fr:'Quai Commercial',en:'Commerce Quay'}},
    {from:'village_heart', to:'mountain_pass', type:'mountain_road', label:{fr:'Route des Cols',en:'Pass Road'}},
    {from:'village_heart', to:'capital', type:'boulevard', label:{fr:'Grand Boulevard',en:'Grand Boulevard'}},
    {from:'artisan_quarter', to:'capital', type:'road', label:{fr:'Rue de la Cité',en:'City Road'}},
  ],
};

// ================================================================
// NPC WORLD — personnages avec biographies complètes et mémoire
// ================================================================
var WORLD_NPCS = {

  harbor_master: {
    name: 'Capitaine Solène',
    emoji: '⚓',
    role: {fr:'Maître de Port', en:'Harbor Master', es:'Maestra del Puerto', ht:'Mèt Pò'},
    bio:  {fr:'Solène a passé 30 ans à voir des étrangers arriver. Elle sait exactement quand quelqu\'un a l\'âme d\'un futur citoyen.',
           en:'Solène spent 30 years watching strangers arrive. She knows exactly when someone has the soul of a future citizen.'},
    firstMeet: {fr:'Alors, encore un nouveau ? Bienvenue à Lingoria. Je suis Capitaine Solène, maître de ce port. Vous voulez rester longtemps ?',
                en:'Another newcomer? Welcome to Lingoria. I\'m Captain Solène, master of this port. Planning to stay long?'},
    memory_hooks: ['first_arrival', 'sea_mention', 'travel_history'],
    teaches: ['greetings', 'directions', 'basic_questions'],
    unlocks_after_xp: 0,
  },

  customs_officer: {
    name: 'Inspecteur Rodrigo',
    emoji: '🛃',
    role: {fr:'Officier de Douane', en:'Customs Officer', es:'Inspector de Aduana', ht:'Ofisye Ladwann'},
    bio:  {fr:'Rodrigo est strict mais juste. Il parle 6 langues et n\'en montre aucune facilement.',
           en:'Rodrigo is strict but fair. He speaks 6 languages and shows none of them easily.'},
    firstMeet: {fr:'Documents, s\'il vous plaît. Nom ? Nationalité ? Durée du séjour prévue ?',
                en:'Documents, please. Name? Nationality? Planned length of stay?'},
    memory_hooks: ['nationality', 'purpose_of_visit', 'paperwork'],
    teaches: ['formal_language', 'identity', 'numbers'],
    unlocks_after_xp: 0,
  },

  innkeeper: {
    name: 'Madame Brigitte',
    emoji: '🏨',
    role: {fr:'Aubergiste', en:'Innkeeper', es:'Posaderera', ht:'Mèt Otèl'},
    bio:  {fr:'Brigitte accueille les voyageurs depuis 20 ans. Son auberge est la première maison de beaucoup.',
           en:'Brigitte has welcomed travelers for 20 years. Her inn is the first home for many.'},
    firstMeet: {fr:'Bienvenue à l\'Auberge du Marin ! Vous cherchez une chambre ? J\'en ai justement une qui se libère ce soir.',
                en:'Welcome to the Sailor\'s Inn! Looking for a room? I just happen to have one freeing up tonight.'},
    memory_hooks: ['room_preference', 'breakfast_order', 'length_of_stay'],
    teaches: ['accommodation', 'food', 'daily_routine'],
    unlocks_after_xp: 0,
  },

  elder: {
    name: 'Grand-père Koffi',
    emoji: '👴',
    role: {fr:'Sage du Village', en:'Village Elder', es:'Anciano del Pueblo', ht:'Granmoun Vilaj'},
    bio:  {fr:'Koffi est né dans ce village et n\'en est jamais parti. Sa mémoire est la mémoire de Lingoria.',
           en:'Koffi was born in this village and never left. His memory is Lingoria\'s memory.'},
    firstMeet: {fr:'Ah, un nouveau visage. Je m\'appelle Koffi. J\'ai vu beaucoup d\'étrangers devenir des citoyens ici. Avez-vous faim ?',
                en:'Ah, a new face. My name is Koffi. I\'ve seen many strangers become citizens here. Are you hungry?'},
    memory_hooks: ['first_conversation', 'personal_story', 'goals'],
    teaches: ['introductions', 'family', 'community_values'],
    unlocks_after_xp: 0,
  },

  teacher: {
    name: 'Professeure Amara',
    emoji: '👩‍🏫',
    role: {fr:'Professeure', en:'Teacher', es:'Profesora', ht:'Pwofesè'},
    bio:  {fr:'Amara croit que tout le monde peut apprendre. Elle a une méthode radicale : jamais deux fois le même exercice.',
           en:'Amara believes everyone can learn. She has a radical method: never the same exercise twice.'},
    firstMeet: {fr:'Bonjour ! Je suis Professeure Amara. On m\'a dit qu\'il y avait un nouvel élève potentiel. Asseyez-vous, montrez-moi ce que vous savez déjà.',
                en:'Hello! I\'m Professor Amara. I was told there was a new potential student. Sit down, show me what you already know.'},
    memory_hooks: ['learning_mistakes', 'progress_moments', 'favorite_topics'],
    teaches: ['grammar', 'vocabulary', 'writing'],
    unlocks_after_xp: 100,
  },

  merchant: {
    name: 'M. Diallo',
    emoji: '🧑‍🌾',
    role: {fr:'Marchand', en:'Merchant', es:'Comerciante', ht:'Machann'},
    bio:  {fr:'Diallo vend tout et achète tout. Son secret : il comprend toujours plus que ce qu\'il laisse paraître.',
           en:'Diallo sells everything and buys everything. His secret: he always understands more than he lets on.'},
    firstMeet: {fr:'Regardez mais touchez pas ! Ah non, je plaisante. Qu\'est-ce que je peux faire pour vous ?',
                en:'Look but don\'t touch! Ah no, I\'m joking. What can I do for you?'},
    memory_hooks: ['purchases', 'price_negotiations', 'product_preferences'],
    teaches: ['shopping', 'numbers', 'negotiation'],
    unlocks_after_xp: 50,
  },

  doctor: {
    name: 'Dr. Martin',
    emoji: '👨‍⚕️',
    role: {fr:'Médecin', en:'Doctor', es:'Médico', ht:'Doktè'},
    bio:  {fr:'Martin a étudié en 4 pays. Il prescrit d\'abord l\'écoute, ensuite les médicaments.',
           en:'Martin studied in 4 countries. He prescribes listening first, then medication.'},
    firstMeet: {fr:'Bonjour. Je suis le Dr. Martin. Qu\'est-ce qui vous amène ? Prenez votre temps.',
                en:'Hello. I\'m Dr. Martin. What brings you here? Take your time.'},
    memory_hooks: ['health_complaints', 'medical_history', 'follow_up_visits'],
    teaches: ['body_vocabulary', 'symptoms', 'health_phrases'],
    unlocks_after_xp: 300,
  },

  governor: {
    name: 'Gouverneur Isabeau',
    emoji: '🏛️',
    role: {fr:'Gouverneur de Lingoria', en:'Governor of Lingoria', es:'Gobernadora de Lingoria', ht:'Gouvènè Lingoria'},
    bio:  {fr:'Isabeau dirige Lingoria depuis 12 ans. Elle parle 8 langues et lit les visages mieux que les livres.',
           en:'Isabeau has governed Lingoria for 12 years. She speaks 8 languages and reads faces better than books.'},
    firstMeet: {fr:'On m\'a beaucoup parlé de vous. Il paraît que vous progressez vite. Lingoria a besoin de gens comme vous.',
                en:'I\'ve heard a lot about you. Word is you\'re progressing quickly. Lingoria needs people like you.'},
    memory_hooks: ['political_opinions', 'civic_actions', 'key_decisions'],
    teaches: ['formal_speech', 'politics', 'debate'],
    unlocks_after_xp: 2200,
  },
};

// ================================================================
// SYSTÈME DE PROGRESSION SOCIALE
// ================================================================

function getCurrentRank(xp) {
  var rank = SOCIAL_RANKS[0];
  for (var i = SOCIAL_RANKS.length - 1; i >= 0; i--) {
    if (xp >= SOCIAL_RANKS[i].xp) { rank = SOCIAL_RANKS[i]; break; }
  }
  return rank;
}

function getNextRank(xp) {
  for (var i = 0; i < SOCIAL_RANKS.length; i++) {
    if (SOCIAL_RANKS[i].xp > xp) return SOCIAL_RANKS[i];
  }
  return null;
}

function getProgressToNext(xp) {
  var current = getCurrentRank(xp);
  var next    = getNextRank(xp);
  if (!next) return 1;
  var range = next.xp - current.xp;
  var progress = xp - current.xp;
  return Math.min(progress / range, 1);
}

function checkRankUp(oldXP, newXP, nativeLang) {
  var oldRank = getCurrentRank(oldXP);
  var newRank = getCurrentRank(newXP);
  if (oldRank.id !== newRank.id && newRank.ceremony) {
    _triggerRankUpCeremony(newRank, nativeLang || 'fr');
    return true;
  }
  return false;
}

function _triggerRankUpCeremony(rank, nl) {
  var overlay = document.createElement('div');
  overlay.id  = 'rank-ceremony';
  overlay.style.cssText = [
    'position:fixed;inset:0;z-index:99990;',
    'background:rgba(0,0,0,0.95);display:flex;',
    'align-items:center;justify-content:center;',
    'opacity:0;transition:opacity 0.5s ease;',
  ].join('');

  var rankLabel = rank.label[nl] || rank.label.fr;
  var rankDesc  = rank.desc[nl]  || rank.desc.fr;
  var unlockMsg = {
    fr:'Nouvelles zones débloquées !',
    en:'New zones unlocked!',
    es:'¡Nuevas zonas desbloqueadas!',
    ht:'Nouvo zòn debloke!'
  }[nl] || 'New zones unlocked!';

  overlay.innerHTML = [
    '<div style="text-align:center;padding:32px 24px;max-width:340px;">',
    '<div style="font-size:0.7rem;font-weight:800;letter-spacing:0.20em;color:rgba(255,215,0,0.6);',
    'text-transform:uppercase;margin-bottom:12px;">LINGORIA VOUS RECONNAÎT</div>',
    '<div style="font-size:5rem;margin-bottom:16px;animation:rankSpin 0.8s cubic-bezier(0.22,1,0.36,1)">'+rank.icon+'</div>',
    '<div style="font-family:Cinzel,serif;font-size:1.8rem;font-weight:900;color:'+rank.color+';',
    'text-shadow:0 0 30px '+rank.color+';margin-bottom:10px;">'+rankLabel+'</div>',
    '<div style="font-size:0.88rem;color:rgba(255,255,255,0.65);line-height:1.6;margin-bottom:20px;">'+rankDesc+'</div>',
    '<div style="font-size:0.72rem;color:#4ecf70;background:rgba(78,207,112,0.1);border:1px solid rgba(78,207,112,0.3);',
    'border-radius:12px;padding:8px 16px;margin-bottom:24px;">🗺️ '+unlockMsg+'</div>',
    '<button onclick="document.getElementById(\'rank-ceremony\').remove()" ',
    'style="background:'+rank.color+';border:none;border-radius:16px;padding:14px 36px;',
    'font-family:Cinzel,serif;font-weight:800;font-size:0.92rem;color:#000;cursor:pointer;',
    'box-shadow:0 4px 24px '+rank.color+'66;">✨ Explorer</button>',
    '</div>',
  ].join('');

  // CSS animation
  if (!document.getElementById('rank-ceremony-css')) {
    var s = document.createElement('style');
    s.id  = 'rank-ceremony-css';
    s.textContent = '@keyframes rankSpin{0%{transform:rotate(-180deg) scale(0);opacity:0;}100%{transform:rotate(0deg) scale(1);opacity:1;}}';
    document.head.appendChild(s);
  }

  document.body.appendChild(overlay);
  requestAnimationFrame(function() {
    requestAnimationFrame(function() { overlay.style.opacity = '1'; });
  });

  if (window.LV_SOUND) window.LV_SOUND.play('levelUp');
  if (window.launchConfetti) window.launchConfetti();
}

// ================================================================
// CARTE INTERACTIVE — rendu canvas
// ================================================================
function openWorldMap() {
  var nl = (window.S && S.nativeLang) || 'fr';
  var xp = (window.S && S.xp) || 0;
  var rank = getCurrentRank(xp);

  var overlay = document.createElement('div');
  overlay.id  = 'world-map-overlay';
  overlay.style.cssText = [
    'position:fixed;inset:0;z-index:9500;',
    'background:#060c1a;',
    'display:flex;flex-direction:column;',
    'animation:mapFadeIn 0.35s ease;',
  ].join('');

  // Header
  var header = document.createElement('div');
  header.style.cssText = 'display:flex;align-items:center;gap:12px;padding:14px 16px;'
    + 'background:rgba(255,255,255,0.03);border-bottom:1px solid rgba(255,255,255,0.07);flex-shrink:0;';
  header.innerHTML = '<button onclick="document.getElementById(\'world-map-overlay\').remove()" '
    + 'style="background:rgba(255,255,255,0.08);border:none;border-radius:50%;width:36px;height:36px;'
    + 'color:#e8e0d0;font-size:1rem;cursor:pointer;flex-shrink:0;">✕</button>'
    + '<div><div style="font-family:Cinzel,serif;font-size:1rem;font-weight:700;color:#ffd700;">🗺️ LINGORIA</div>'
    + '<div style="font-size:0.68rem;color:rgba(255,255,255,0.35);margin-top:1px;">'
    + rank.icon + ' ' + (rank.label[nl]||rank.label.fr) + ' · ' + xp + ' XP</div></div>';

  // Canvas
  var canvas = document.createElement('canvas');
  canvas.id  = 'world-map-canvas';
  canvas.style.cssText = 'flex:1;width:100%;touch-action:none;cursor:grab;';

  // Info panel (bas)
  var infoPanel = document.createElement('div');
  infoPanel.id  = 'map-info-panel';
  infoPanel.style.cssText = [
    'flex-shrink:0;padding:12px 16px;',
    'background:rgba(6,12,26,0.98);',
    'border-top:1px solid rgba(255,255,255,0.07);',
    'min-height:64px;transition:all 0.3s ease;',
  ].join('');
  infoPanel.innerHTML = '<div style="font-size:0.78rem;color:rgba(255,255,255,0.28);text-align:center;">'
    + {fr:'Touchez une région pour explorer',en:'Tap a region to explore',es:'Toca una región para explorar',ht:'Touche yon rejyon pou eksplore'}[nl]
    + '</div>';

  overlay.appendChild(header);
  overlay.appendChild(canvas);
  overlay.appendChild(infoPanel);
  document.body.appendChild(overlay);

  // CSS
  if (!document.getElementById('world-map-css')) {
    var s = document.createElement('style');
    s.id  = 'world-map-css';
    s.textContent = '@keyframes mapFadeIn{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:none;}}';
    document.head.appendChild(s);
  }

  // Rendre la carte
  requestAnimationFrame(function() {
    _renderMap(canvas, xp, nl, rank, infoPanel);
  });
}

function _renderMap(canvas, xp, nl, rank, infoPanel) {
  var dpr = window.devicePixelRatio || 1;
  var W   = canvas.offsetWidth  || window.innerWidth;
  var H   = canvas.offsetHeight || window.innerHeight * 0.72;
  canvas.width  = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  var ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  // ── Fond : océan ──
  var ocean = ctx.createLinearGradient(0, 0, W, H);
  ocean.addColorStop(0, '#060c1a');
  ocean.addColorStop(1, '#0a1628');
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, W, H);

  // Grille d'eau subtile
  ctx.strokeStyle = 'rgba(74,158,255,0.06)';
  ctx.lineWidth   = 0.5;
  for (var gx = 0; gx < W; gx += 40) {
    ctx.beginPath(); ctx.moveTo(gx,0); ctx.lineTo(gx,H); ctx.stroke();
  }
  for (var gy = 0; gy < H; gy += 40) {
    ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(W,gy); ctx.stroke();
  }

  // ── Île principale (forme organique) ──
  ctx.save();
  ctx.fillStyle = '#1a3a1a';
  ctx.shadowColor = 'rgba(78,207,112,0.15)';
  ctx.shadowBlur  = 30;
  ctx.beginPath();
  ctx.moveTo(W*0.04, H*0.50);
  ctx.bezierCurveTo(W*0.02, H*0.30, W*0.10, H*0.10, W*0.35, H*0.08);
  ctx.bezierCurveTo(W*0.60, H*0.06, W*0.92, H*0.12, W*0.96, H*0.35);
  ctx.bezierCurveTo(W*0.99, H*0.55, W*0.90, H*0.90, W*0.70, H*0.95);
  ctx.bezierCurveTo(W*0.45, H*1.00, W*0.12, H*0.96, W*0.04, H*0.75);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Contour de l'île
  ctx.strokeStyle = 'rgba(78,207,112,0.25)';
  ctx.lineWidth   = 1.5;
  ctx.stroke();

  // ── Routes ──
  WORLD_MAP.routes.forEach(function(route) {
    var fromReg = WORLD_MAP.regions.find(function(r){ return r.id === route.from; });
    var toReg   = WORLD_MAP.regions.find(function(r){ return r.id === route.to; });
    if (!fromReg || !toReg) return;
    var fx = ((fromReg.xMin + fromReg.xMax)/2) * W;
    var fy = ((fromReg.yMin + fromReg.yMax)/2) * H;
    var tx = ((toReg.xMin   + toReg.xMax)/2)   * W;
    var ty = ((toReg.yMin   + toReg.yMax)/2)    * H;
    ctx.save();
    ctx.strokeStyle = route.type === 'boulevard'
      ? 'rgba(255,215,0,0.30)'
      : route.type === 'mountain_road'
      ? 'rgba(180,180,180,0.20)'
      : 'rgba(200,170,100,0.22)';
    ctx.lineWidth   = route.type === 'boulevard' ? 3 : 1.5;
    ctx.setLineDash(route.type === 'path' ? [4,6] : []);
    ctx.beginPath(); ctx.moveTo(fx,fy); ctx.lineTo(tx,ty); ctx.stroke();
    ctx.restore();
  });

  // ── Régions ──
  var regionHitAreas = [];
  WORLD_MAP.regions.forEach(function(region) {
    var unlocked = _isRegionUnlocked(region.requiredRank, xp);
    var cx = ((region.xMin + region.xMax) / 2) * W;
    var cy = ((region.yMin + region.yMax) / 2) * H;
    var rw = (region.xMax - region.xMin) * W * 0.40;
    var rh = (region.yMax - region.yMin) * H * 0.38;

    // Zone de région
    ctx.save();
    ctx.globalAlpha = unlocked ? 0.85 : 0.30;
    ctx.fillStyle   = region.color + '22';
    ctx.strokeStyle = region.color + (unlocked ? '88' : '33');
    ctx.lineWidth   = 1.5;
    ctx.setLineDash(unlocked ? [] : [5,5]);
    ctx.beginPath();
    ctx.ellipse(cx, cy, rw, rh, 0, 0, Math.PI*2);
    ctx.fill(); ctx.stroke();
    ctx.restore();

    // Emoji région
    ctx.save();
    ctx.globalAlpha = unlocked ? 1 : 0.30;
    ctx.font = Math.round(Math.min(rw,rh)*0.35) + 'px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(region.emoji, cx, cy - 8);
    ctx.restore();

    // Nom région
    ctx.save();
    ctx.globalAlpha = unlocked ? 1 : 0.25;
    ctx.font = 'bold ' + Math.round(Math.min(W,H)*0.022) + 'px Cinzel,serif';
    ctx.fillStyle   = unlocked ? region.color : '#666';
    ctx.textAlign   = 'center';
    ctx.textBaseline= 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur  = 6;
    ctx.fillText(region.name[nl]||region.name.fr, cx, cy + 14);
    ctx.restore();

    // Cadenas si verrouillé
    if (!unlocked) {
      ctx.save();
      ctx.font = Math.round(Math.min(rw,rh)*0.28) + 'px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🔒', cx, cy - 6);
      ctx.restore();
    }

    regionHitAreas.push({
      region: region,
      cx: cx, cy: cy, rw: rw, rh: rh,
      unlocked: unlocked,
    });
  });

  // Nom du pays en titre
  ctx.save();
  ctx.font        = 'bold ' + Math.round(W*0.045) + 'px Cinzel,serif';
  ctx.fillStyle   = 'rgba(255,215,0,0.18)';
  ctx.textAlign   = 'center';
  ctx.textBaseline= 'top';
  ctx.fillText('LINGORIA', W/2, H*0.02);
  ctx.restore();

  // ── Interactivité ──
  canvas.onclick = function(e) {
    var rect = canvas.getBoundingClientRect();
    var mx   = e.clientX - rect.left;
    var my   = e.clientY - rect.top;
    var hit  = null;
    regionHitAreas.forEach(function(area) {
      var dx = (mx - area.cx) / area.rw;
      var dy = (my - area.cy) / area.rh;
      if (dx*dx + dy*dy <= 1) hit = area;
    });
    if (hit) _onRegionTap(hit.region, hit.unlocked, nl, xp, infoPanel);
  };
  canvas.style.cursor = 'grab';
}

function _isRegionUnlocked(requiredRank, xp) {
  var rankIdx = SOCIAL_RANKS.findIndex(function(r){ return r.id === requiredRank; });
  var currentIdx = SOCIAL_RANKS.findIndex(function(r){ return r.id === getCurrentRank(xp).id; });
  return currentIdx >= rankIdx;
}

function _onRegionTap(region, unlocked, nl, xp, infoPanel) {
  if (window.LV_SOUND) window.LV_SOUND.play('tap');
  var name = region.name[nl] || region.name.fr;
  var desc = region.desc[nl] || region.desc.fr;

  if (!unlocked) {
    var reqRank = SOCIAL_RANKS.find(function(r){ return r.id === region.requiredRank; });
    var reqLabel = reqRank ? (reqRank.label[nl]||reqRank.label.fr) : '';
    var lockedMsg = {fr:'Rang requis : ',en:'Required rank: ',es:'Rango requerido: ',ht:'Grad obligatwa: '}[nl] || 'Required rank: ';
    infoPanel.innerHTML = '<div style="display:flex;align-items:center;gap:12px;">'
      + '<div style="font-size:2rem">' + region.emoji + '</div>'
      + '<div><div style="font-weight:800;font-size:0.92rem;color:#fff">' + name + '</div>'
      + '<div style="font-size:0.72rem;color:#ff9f43;margin-top:3px;">🔒 ' + lockedMsg + reqLabel + '</div></div></div>';
    return;
  }

  infoPanel.innerHTML = '<div style="display:flex;align-items:center;gap:12px;">'
    + '<div style="font-size:2rem">' + region.emoji + '</div>'
    + '<div style="flex:1;min-width:0;">'
    + '<div style="font-weight:800;font-size:0.92rem;color:' + region.color + '">' + name + '</div>'
    + '<div style="font-size:0.70rem;color:rgba(255,255,255,0.50);margin-top:2px;line-height:1.4;">' + desc + '</div></div>'
    + '<button onclick="window.LV_WORLD.enterRegion(\'' + region.id + '\')" '
    + 'style="flex-shrink:0;background:' + region.color + ';border:none;border-radius:12px;padding:8px 16px;'
    + 'font-weight:800;font-size:0.78rem;color:#000;cursor:pointer;">→</button></div>';
}

function enterRegion(regionId) {
  var region = WORLD_MAP.regions.find(function(r){ return r.id === regionId; });
  if (!region) return;
  var overlay = document.getElementById('world-map-overlay');
  if (overlay) overlay.remove();
  // Aller vers le village avec la région sélectionnée
  window._currentWorldRegion = regionId;
  if (typeof goVillage === 'function') goVillage();
  if (window.LV_SOUND) window.LV_SOUND.play('swipe');
}

// ================================================================
// SÉQUENCE D'INTRODUCTION NARRATIVE
// ================================================================
function playIntroStory(nativeLang, onComplete) {
  var nl    = nativeLang || 'fr';
  var lines = STORY.intro[nl] || STORY.intro.fr;

  var overlay = document.createElement('div');
  overlay.id  = 'intro-story';
  overlay.style.cssText = [
    'position:fixed;inset:0;z-index:99995;',
    'background:#000;display:flex;',
    'align-items:center;justify-content:center;',
    'flex-direction:column;',
    'cursor:pointer;-webkit-tap-highlight-color:transparent;',
  ].join('');

  var textEl = document.createElement('div');
  textEl.style.cssText = [
    'font-family:Cinzel,serif;font-size:clamp(1rem,4vw,1.4rem);',
    'color:rgba(255,255,255,0.85);text-align:center;',
    'max-width:320px;line-height:1.8;padding:24px;',
    'opacity:0;transition:opacity 0.8s ease;',
  ].join('');

  var skipEl = document.createElement('div');
  skipEl.style.cssText = 'position:absolute;bottom:32px;right:32px;'
    + 'font-size:0.70rem;color:rgba(255,255,255,0.25);font-weight:700;letter-spacing:0.1em;';
  skipEl.textContent = {fr:'PASSER →',en:'SKIP →',es:'OMITIR →',ht:'PASE →'}[nl] || 'SKIP →';

  overlay.appendChild(textEl);
  overlay.appendChild(skipEl);
  document.body.appendChild(overlay);

  var idx  = 0;
  var done = false;

  function _finish() {
    if (done) return;
    done = true;
    overlay.style.transition = 'opacity 0.6s ease';
    overlay.style.opacity    = '0';
    setTimeout(function() {
      overlay.remove();
      if (onComplete) onComplete();
    }, 650);
  }

  function _showLine() {
    if (idx >= lines.length) { setTimeout(_finish, 600); return; }
    textEl.style.opacity = '0';
    setTimeout(function() {
      textEl.textContent   = lines[idx];
      textEl.style.opacity = '1';
      idx++;
      setTimeout(_showLine, 2400);
    }, 400);
  }

  overlay.onclick   = _finish;
  skipEl.onclick    = _finish;
  _showLine();

  if (window.LV_SOUND) window.LV_SOUND.play('signature');
}

// ================================================================
// API PUBLIQUE
// ================================================================
return {
  SOCIAL_RANKS:    SOCIAL_RANKS,
  WORLD_MAP:       WORLD_MAP,
  WORLD_NPCS:      WORLD_NPCS,
  STORY:           STORY,
  getCurrentRank:  getCurrentRank,
  getNextRank:     getNextRank,
  getProgressToNext: getProgressToNext,
  checkRankUp:     checkRankUp,
  openWorldMap:    openWorldMap,
  enterRegion:     enterRegion,
  playIntroStory:  playIntroStory,
};

})();

// Raccourcis globaux
window.openWorldMap   = function() { window.LV_WORLD.openWorldMap(); };
window.playIntroStory = function(nl, cb) { window.LV_WORLD.playIntroStory(nl, cb); };
console.log('✅ world.js chargé — LINGORIA');
