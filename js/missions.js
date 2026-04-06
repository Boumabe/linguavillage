/* =================================================================
   missions.js — LinguaVillage
   Système de missions, récompenses, streak et boutique de gemmes
   Version corrigée - compatible avec state.js et save.js
   ================================================================= */

// =================================================================
// DONNÉES DES MISSIONS PAR LIEU
// =================================================================
const MISSIONS = {
  // === MARCHÉ ===
  market: [
    {
      id: 'order_coffee',
      icon: '☕',
      xp: 30,
      gem: 1,
      title: { fr: 'Commander un café', en: 'Order a coffee', es: 'Pide un café', ht: 'Kòmande yon kafe' },
      desc: { fr: 'Dis "Je voudrais un café, s\'il vous plaît"', en: 'Say "I\'d like a coffee, please"' },
      hint: { fr: '"Je voudrais un ___"', en: '"I\'d like a ___"' },
      check: ['café', 'coffee', 'cafe', 'kafe', 'koffie', 'koffee', 's\'il vous plaît', 'please']
    },
    {
      id: 'buy_food',
      icon: '🍎',
      xp: 35,
      gem: 1,
      title: { fr: 'Acheter de la nourriture', en: 'Buy food', es: 'Comprar comida', ht: 'Achte manje' },
      desc: { fr: 'Demande le prix des fruits et légumes', en: 'Ask for the price of fruits and vegetables' },
      hint: { fr: '"Combien coûtent les ___ ?"', en: '"How much are the ___?"' },
      check: ['combien', 'prix', 'légumes', 'fruits', 'how much', 'price', 'vegetables', 'fruits']
    },
    {
      id: 'negotiate_price',
      icon: '💰',
      xp: 40,
      gem: 2,
      title: { fr: 'Négocier un prix', en: 'Negotiate price', es: 'Negociar precio', ht: 'Negosye pri' },
      desc: { fr: 'Essaie de négocier le prix', en: 'Try to negotiate the price' },
      hint: { fr: '"C\'est trop cher, un peu moins ?"', en: '"It\'s too expensive, a little less?"' },
      check: ['trop cher', 'cher', 'moins', 'discount', 'expensive', 'less']
    }
  ],
  
  // === ÉCOLE ===
  school: [
    {
      id: 'introduce_yourself',
      icon: '👋',
      xp: 25,
      gem: 1,
      title: { fr: 'Se présenter', en: 'Introduce yourself', es: 'Presentarse', ht: 'Prezante tèt ou' },
      desc: { fr: 'Dis ton nom et ton âge', en: 'Say your name and age' },
      hint: { fr: '"Je m\'appelle ___ et j\'ai ___ ans"', en: '"My name is ___ and I am ___ years old"' },
      check: ['appelle', 'name', 'age', 'ans', 'years']
    },
    {
      id: 'ask_question',
      icon: '❓',
      xp: 30,
      gem: 1,
      title: { fr: 'Poser une question', en: 'Ask a question', es: 'Hacer una pregunta', ht: 'Poze yon kesyon' },
      desc: { fr: 'Pose une question à ton professeur', en: 'Ask your teacher a question' },
      hint: { fr: '"Comment dit-on ___ ?"', en: '"How do you say ___?"' },
      check: ['comment', 'pourquoi', 'quand', 'où', 'how', 'why', 'when', 'where']
    }
  ],
  
  // === PARC ===
  park: [
    {
      id: 'describe_weather',
      icon: '☀️',
      xp: 25,
      gem: 1,
      title: { fr: 'Décrire la météo', en: 'Describe weather', es: 'Describir el clima', ht: 'Dekri tan an' },
      desc: { fr: 'Parle du temps qu\'il fait', en: 'Talk about the weather' },
      hint: { fr: '"Il fait beau / chaud / froid"', en: '"It is nice / hot / cold"' },
      check: ['beau', 'soleil', 'pluie', 'chaud', 'froid', 'nice', 'sun', 'rain', 'hot', 'cold']
    },
    {
      id: 'give_compliment',
      icon: '💝',
      xp: 30,
      gem: 1,
      title: { fr: 'Faire un compliment', en: 'Give a compliment', es: 'Dar un cumplido', ht: 'Fè yon konpliman' },
      desc: { fr: 'Fais un beau compliment', en: 'Give a nice compliment' },
      hint: { fr: '"Tu es très gentil/gentille"', en: '"You are very kind"' },
      check: ['beau', 'joli', 'gentil', 'sympa', 'beautiful', 'nice', 'kind']
    }
  ],
  
  // === MAISON DES AMIS ===
  friends: [
    {
      id: 'make_friends',
      icon: '🤝',
      xp: 35,
      gem: 1,
      title: { fr: 'Se faire des amis', en: 'Make friends', es: 'Hacer amigos', ht: 'Fè zanmi' },
      desc: { fr: 'Propose de devenir ami', en: 'Offer to become friends' },
      hint: { fr: '"Tu veux être mon ami ?"', en: '"Do you want to be my friend?"' },
      check: ['ami', 'friend', 'devenir', 'become']
    },
    {
      id: 'share_opinion',
      icon: '💬',
      xp: 35,
      gem: 1,
      title: { fr: 'Partager son opinion', en: 'Share opinion', es: 'Compartir opinión', ht: 'Pataje opinyon' },
      desc: { fr: 'Donne ton avis sur quelque chose', en: 'Give your opinion on something' },
      hint: { fr: '"À mon avis...", "Je pense que..."', en: '"In my opinion...", "I think that..."' },
      check: ['avis', 'pense', 'opinion', 'think']
    }
  ],
  
  // === TAVERNE ===
  tavern: [
    {
      id: 'order_drink',
      icon: '🍺',
      xp: 30,
      gem: 1,
      title: { fr: 'Commander une boisson', en: 'Order a drink', es: 'Pedir una bebida', ht: 'Kòmande yon bwason' },
      desc: { fr: 'Commande une boisson', en: 'Order a drink' },
      hint: { fr: '"Je voudrais une bière / un jus"', en: '"I would like a beer / juice"' },
      check: ['bière', 'jus', 'eau', 'vin', 'beer', 'juice', 'water', 'wine']
    },
    {
      id: 'tell_story',
      icon: '📖',
      xp: 45,
      gem: 2,
      title: { fr: 'Raconter une histoire', en: 'Tell a story', es: 'Contar una historia', ht: 'Rakonte yon istwa' },
      desc: { fr: 'Raconte une petite histoire', en: 'Tell a short story' },
      hint: { fr: '"Il était une fois..."', en: '"Once upon a time..."' },
      check: ['histoire', 'une fois', 'story', 'once upon']
    }
  ],
  
  // === GARE ===
  station: [
    {
      id: 'buy_ticket',
      icon: '🎫',
      xp: 35,
      gem: 1,
      title: { fr: 'Acheter un billet', en: 'Buy a ticket', es: 'Comprar un billete', ht: 'Achte yon tikè' },
      desc: { fr: 'Achète un billet de train', en: 'Buy a train ticket' },
      hint: { fr: '"Un billet pour ___"', en: '"A ticket to ___"' },
      check: ['billet', 'ticket', 'destination', 'prix', 'price']
    },
    {
      id: 'ask_schedule',
      icon: '📅',
      xp: 35,
      gem: 1,
      title: { fr: 'Demander l\'horaire', en: 'Ask schedule', es: 'Preguntar horario', ht: 'Mande òè' },
      desc: { fr: 'Demande l\'heure du prochain train', en: 'Ask for the next train time' },
      hint: { fr: '"À quelle heure part le prochain train ?"', en: '"What time does the next train leave?"' },
      check: ['heure', 'prochain', 'train', 'time', 'next']
    }
  ],
  
  // === HÔPITAL ===
  hospital: [
    {
      id: 'describe_symptoms',
      icon: '🤒',
      xp: 40,
      gem: 2,
      title: { fr: 'Décrire des symptômes', en: 'Describe symptoms', es: 'Describir síntomas', ht: 'Dekri sentòm' },
      desc: { fr: 'Explique ce qui ne va pas', en: 'Explain what is wrong' },
      hint: { fr: '"J\'ai mal à la tête / de la fièvre"', en: '"I have a headache / fever"' },
      check: ['mal', 'fièvre', 'toux', 'douleur', 'hurt', 'fever', 'cough', 'pain']
    }
  ],
  
  // === BANQUE ===
  bank: [
    {
      id: 'bank_account',
      icon: '🏦',
      xp: 45,
      gem: 2,
      title: { fr: 'Ouvrir un compte', en: 'Open account', es: 'Abrir cuenta', ht: 'Louvri yon kont' },
      desc: { fr: 'Demande comment ouvrir un compte', en: 'Ask how to open an account' },
      hint: { fr: '"Je voudrais ouvrir un compte"', en: '"I would like to open an account"' },
      check: ['compte', 'ouvrir', 'account', 'open']
    }
  ],
  
  // === POLICE ===
  police: [
    {
      id: 'ask_directions',
      icon: '🗺️',
      xp: 35,
      gem: 1,
      title: { fr: 'Demander son chemin', en: 'Ask directions', es: 'Preguntar direcciones', ht: 'Mande direksyon' },
      desc: { fr: 'Demande comment aller quelque part', en: 'Ask how to get somewhere' },
      hint: { fr: '"Où se trouve la gare ?"', en: '"Where is the station?"' },
      check: ['où', 'chemin', 'gare', 'rue', 'where', 'direction', 'station', 'street']
    }
  ],
  
  // === CINÉMA ===
  cinema: [
    {
      id: 'discuss_movie',
      icon: '🎬',
      xp: 40,
      gem: 2,
      title: { fr: 'Discuter d\'un film', en: 'Discuss a movie', es: 'Discutir una película', ht: 'Diskite sou yon fim' },
      desc: { fr: 'Parle du film que tu as vu', en: 'Talk about the movie you saw' },
      hint: { fr: '"J\'ai aimé ce film parce que..."', en: '"I liked this movie because..."' },
      check: ['film', 'movie', 'aimé', 'like', 'histoire', 'story']
    }
  ],
  
  // === FERME ===
  farm: [
    {
      id: 'farm_animals',
      icon: '🐮',
      xp: 30,
      gem: 1,
      title: { fr: 'Animaux de la ferme', en: 'Farm animals', es: 'Animales de granja', ht: 'Bèt fèm yo' },
      desc: { fr: 'Nomme des animaux de la ferme', en: 'Name farm animals' },
      hint: { fr: '"Le cheval, la vache, le cochon"', en: '"The horse, the cow, the pig"' },
      check: ['vache', 'cochon', 'cheval', 'poule', 'cow', 'pig', 'horse', 'chicken']
    }
  ],
  
  // === ATELIER ===
  factory: [
    {
      id: 'job_interview',
      icon: '💼',
      xp: 50,
      gem: 2,
      title: { fr: 'Entretien d\'embauche', en: 'Job interview', es: 'Entrevista de trabajo', ht: 'Entèvyou travay' },
      desc: { fr: 'Présente-toi pour un emploi', en: 'Present yourself for a job' },
      hint: { fr: '"Je suis intéressé par le poste"', en: '"I am interested in the position"' },
      check: ['travail', 'expérience', 'compétence', 'job', 'experience', 'skill', 'position']
    }
  ]
};

// =================================================================
// MISSIONS SPÉCIALES (voyages, culture, etc.)
// =================================================================
const SPECIAL_MISSIONS = {
  travel: [
    {
      id: 'hotel_booking',
      icon: '🏨',
      xp: 50,
      gem: 2,
      title: { fr: 'Réserver un hôtel', en: 'Book a hotel', es: 'Reservar hotel', ht: 'Rezève yon otèl' },
      desc: { fr: 'Réserve une chambre d\'hôtel', en: 'Book a hotel room' },
      hint: { fr: '"Je voudrais réserver une chambre"', en: '"I would like to book a room"' },
      check: ['hôtel', 'chambre', 'réservation', 'hotel', 'room', 'reservation']
    }
  ],
  culture: [
    {
      id: 'understand_song',
      icon: '🎵',
      xp: 45,
      gem: 2,
      title: { fr: 'Comprendre une chanson', en: 'Understand a song', es: 'Entender una canción', ht: 'Konprann yon chante' },
      desc: { fr: 'Parle du sens d\'une chanson', en: 'Talk about the meaning of a song' },
      hint: { fr: '"Les paroles parlent de..."', en: '"The lyrics talk about..."' },
      check: ['chanson', 'paroles', 'refrain', 'song', 'lyrics']
    }
  ]
};

// =================================================================
// FONCTIONS PRINCIPALES
// =================================================================

// Vérifier si une mission est complétée
function isMissionCompleted(missionId) {
  return window.S_missions && S_missions.completed && S_missions.completed[missionId] === true;
}

// Marquer une mission comme complétée
function completeMission(mission) {
  if (!mission || !mission.id) {
    console.warn("completeMission: mission invalide");
    return false;
  }
  
  // Vérifier si déjà complétée
  if (isMissionCompleted(mission.id)) {
    console.log("Mission déjà complétée:", mission.id);
    return false;
  }
  
  // Marquer comme complétée
  if (!window.S_missions) window.S_missions = { completed: {}, current: null, gems: 0 };
  if (!S_missions.completed) S_missions.completed = {};
  S_missions.completed[mission.id] = true;
  
  // Ajouter les récompenses
  const xpReward = mission.xp || 10;
  const gemReward = mission.gem || 0;
  
  if (typeof addXP === 'function') {
    addXP(xpReward);
  } else if (typeof gainXP === 'function') {
    gainXP(xpReward);
  } else if (window.S) {
    window.S.xp = (window.S.xp || 0) + xpReward;
  }
  
  if (gemReward > 0) {
    if (typeof addGems === 'function') {
      addGems(gemReward);
    } else if (window.S_missions) {
      S_missions.gems = (S_missions.gems || 0) + gemReward;
    }
  }
  
  // Notification
  const missionTitle = mission.title?.fr || mission.title?.en || mission.id;
  if (typeof showNotif === 'function') {
    showNotif(`✅ Mission réussie : ${missionTitle} +${xpReward} XP +${gemReward}💎`);
  }
  
  // Sauvegarder
  if (typeof saveGame === 'function') {
    saveGame();
  }
  
  // Mettre à jour l'affichage des gemmes
  const gemDisplay = document.getElementById('gemDisplay');
  if (gemDisplay) {
    gemDisplay.textContent = '💎 ' + (typeof getGems === 'function' ? getGems() : (S_missions.gems || 0));
  }
  
  console.log(`✅ Mission complétée: ${mission.id} (+${xpReward} XP, +${gemReward}💎)`);
  return true;
}

// Obtenir toutes les missions d'un lieu
function getMissionsByLocation(locationId) {
  const missions = MISSIONS[locationId] || [];
  return missions;
}

// Obtenir la prochaine mission non complétée pour un lieu
function getNextMission(locationId) {
  const missions = getMissionsByLocation(locationId);
  for (const mission of missions) {
    if (!isMissionCompleted(mission.id)) {
      return mission;
    }
  }
  return null;
}

// Obtenir le pourcentage de complétion pour un lieu
function getLocationProgress(locationId) {
  const missions = getMissionsByLocation(locationId);
  if (missions.length === 0) return 0;
  
  let completed = 0;
  for (const mission of missions) {
    if (isMissionCompleted(mission.id)) completed++;
  }
  return Math.floor((completed / missions.length) * 100);
}

// Obtenir toutes les missions de tous les lieux
function getAllMissions() {
  let all = [];
  for (const locationId in MISSIONS) {
    all = all.concat(MISSIONS[locationId]);
  }
  for (const category in SPECIAL_MISSIONS) {
    all = all.concat(SPECIAL_MISSIONS[category]);
  }
  return all;
}

// Obtenir le nombre total de missions complétées
function getTotalCompletedMissions() {
  let count = 0;
  const all = getAllMissions();
  for (const mission of all) {
    if (isMissionCompleted(mission.id)) count++;
  }
  return count;
}

// Obtenir le pourcentage global de complétion
function getGlobalProgress() {
  const all = getAllMissions();
  if (all.length === 0) return 0;
  const completed = getTotalCompletedMissions();
  return Math.floor((completed / all.length) * 100);
}

// Démarrer une mission (ouvrir le dialogue approprié)
function startMission(missionId, locationId) {
  let mission = null;
  
  // Chercher la mission
  const allMissions = getAllMissions();
  mission = allMissions.find(m => m.id === missionId);
  
  if (!mission) {
    console.warn("Mission non trouvée:", missionId);
    if (typeof showNotif === 'function') {
      showNotif("❌ Mission introuvable");
    }
    return false;
  }
  
  if (isMissionCompleted(missionId)) {
    if (typeof showNotif === 'function') {
      showNotif("✅ Mission déjà complétée !");
    }
    return false;
  }
  
  // Afficher les instructions
  const title = mission.title?.fr || mission.title?.en || missionId;
  const desc = mission.desc?.fr || mission.desc?.en || "";
  const hint = mission.hint?.fr || mission.hint?.en || "";
  
  if (typeof showNotif === 'function') {
    showNotif(`🎯 Mission: ${title}\n💡 ${hint}`);
  }
  
  console.log(`Mission démarrée: ${title} - ${desc}`);
  return true;
}

// Vérifier la réponse d'une mission (pour validation auto)
function checkMissionAnswer(missionId, userAnswer) {
  const allMissions = getAllMissions();
  const mission = allMissions.find(m => m.id === missionId);
  
  if (!mission) return false;
  if (isMissionCompleted(missionId)) return false;
  
  const keywords = mission.check || [];
  const answerLower = userAnswer.toLowerCase();
  
  // Vérifier si au moins un mot-clé est présent
  const found = keywords.some(keyword => answerLower.includes(keyword.toLowerCase()));
  
  if (found) {
    completeMission(mission);
    return true;
  }
  
  return false;
}

// =================================================================
// SYSTÈME DE STREAK (série de jours)
// =================================================================
function updateStreak() {
  if (typeof updateStreakState === 'function') {
    return updateStreakState();
  }
  
  // Fallback si state.js n'est pas chargé
  if (typeof window.S_streak === 'undefined') {
    window.S_streak = { count: 0, lastDate: null };
  }
  
  const now = new Date();
  const today = now.toDateString();
  
  if (S_streak.lastDate === today) return S_streak.count;
  
  const last = S_streak.lastDate ? new Date(S_streak.lastDate) : null;
  const diff = last ? (now - last) / (1000 * 60 * 60 * 24) : null;
  
  if (diff === null || diff > 1.5) {
    S_streak.count = 1;
  } else {
    S_streak.count++;
  }
  
  S_streak.lastDate = today;
  
  // Bonus pour série de 7 jours
  if (S_streak.count === 7 && typeof addGems === 'function') {
    addGems(10);
    if (typeof showNotif === 'function') {
      showNotif('🔥 7 jours consécutifs ! +10 gemmes');
    }
  }
  
  if (typeof saveGame === 'function') saveGame();
  
  // Mettre à jour l'affichage
  const streakDisplay = document.getElementById('streakDisplay');
  if (streakDisplay) {
    streakDisplay.textContent = '🔥 ' + S_streak.count;
  }
  
  return S_streak.count;
}

// =================================================================
// BOUTIQUE (gemmes)
// =================================================================
const SHOP_ITEMS = [
  { id: 'xp_boost', name: { fr: 'Boost XP x2 (1h)', en: 'XP Boost x2 (1h)' }, price: 50, icon: '⚡', type: 'boost', duration: 3600000 },
  { id: 'theme_pack', name: { fr: 'Pack thème', en: 'Theme pack' }, price: 100, icon: '🎨', type: 'cosmetic' },
  { id: 'skip_mission', name: { fr: 'Passer une mission', en: 'Skip a mission' }, price: 30, icon: '⏭️', type: 'skip' }
];

function buyItem(itemId) {
  const item = SHOP_ITEMS.find(i => i.id === itemId);
  if (!item) {
    if (typeof showNotif === 'function') showNotif("❌ Article introuvable");
    return false;
  }
  
  const gems = typeof getGems === 'function' ? getGems() : (S_missions?.gems || 0);
  if (gems < item.price) {
    if (typeof showNotif === 'function') showNotif(`💎 Pas assez de gemmes (besoin: ${item.price})`);
    return false;
  }
  
  // Déduire les gemmes
  if (typeof addGems === 'function') {
    addGems(-item.price);
  } else if (window.S_missions) {
    S_missions.gems -= item.price;
  }
  
  // Appliquer l'effet
  if (item.type === 'boost' && window.S) {
    S.xpBoostEnd = Date.now() + item.duration;
    if (typeof showNotif === 'function') showNotif(`⚡ Boost XP activé pour 1 heure !`);
  } else {
    if (typeof showNotif === 'function') showNotif(`🎁 Acheté: ${item.name.fr}`);
  }
  
  if (typeof saveGame === 'function') saveGame();
  return true;
}

// =================================================================
// EXPOSER LES FONCTIONS GLOBALEMENT
// =================================================================
window.MISSIONS = MISSIONS;
window.SPECIAL_MISSIONS = SPECIAL_MISSIONS;
window.completeMission = completeMission;
window.getMissionsByLocation = getMissionsByLocation;
window.getNextMission = getNextMission;
window.getLocationProgress = getLocationProgress;
window.getAllMissions = getAllMissions;
window.getTotalCompletedMissions = getTotalCompletedMissions;
window.getGlobalProgress = getGlobalProgress;
window.startMission = startMission;
window.checkMissionAnswer = checkMissionAnswer;
window.updateStreak = updateStreak;
window.SHOP_ITEMS = SHOP_ITEMS;
window.buyItem = buyItem;

// =================================================================
// INITIALISATION
// =================================================================
// S'assurer que S_missions existe
if (typeof window.S_missions === 'undefined') {
  window.S_missions = { completed: {}, current: null, gems: 0 };
}

// S'assurer que S_streak existe
if (typeof window.S_streak === 'undefined') {
  window.S_streak = { count: 0, lastDate: null };
}

// Mettre à jour l'affichage du streak au chargement
const streakDisplay = document.getElementById('streakDisplay');
if (streakDisplay && S_streak) {
  streakDisplay.textContent = '🔥 ' + (S_streak.count || 0);
}

console.log("missions.js: ✅ Chargé - " + getTotalCompletedMissions() + " missions complétées");
