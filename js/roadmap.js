/* =================================================================
   roadmap.js — LinguaVillage
   Structure CEFR (A1 à C1) : niveaux, modules, missions
   Intégration avec missions.js et save.js existants
   Version complète, corrigée et sécurisée
   ================================================================= */

// =================================================================
// STRUCTURE CEFR COMPLÈTE
// =================================================================
const CEFR_ROADMAP = {
  levels: {
    A1: {
      id: "A1",
      name: "Découvreur",
      nameEn: "Discoverer",
      requiredXP: 0,
      icon: "🌱",
      color: "#4ecf70",
      modules: {
        survival: {
          id: "survival",
          name: "Survie de base",
          nameEn: "Basic Survival",
          order: 1,
          icon: "🛡️",
          missions: ["order_coffee", "introduce_yourself", "ask_directions"]
        },
        everyday: {
          id: "everyday",
          name: "Vie quotidienne",
          nameEn: "Everyday Life",
          order: 2,
          icon: "🏠",
          missions: ["buy_food", "tell_time", "describe_weather"]
        },
        shopping: {
          id: "shopping",
          name: "Achats et chiffres",
          nameEn: "Shopping & Numbers",
          order: 3,
          icon: "🛒",
          missions: ["negotiate_price", "count_numbers", "order_drink"]
        }
      }
    },
    A2: {
      id: "A2",
      name: "Explorateur",
      nameEn: "Explorer",
      requiredXP: 300,
      icon: "🌟",
      color: "#4a9eff",
      modules: {
        travel: {
          id: "travel",
          name: "Voyages et transports",
          nameEn: "Travel & Transport",
          order: 1,
          icon: "✈️",
          missions: ["buy_ticket", "ask_schedule", "hotel_booking"]
        },
        social: {
          id: "social",
          name: "Vie sociale",
          nameEn: "Social Life",
          order: 2,
          icon: "👥",
          missions: ["make_friends", "give_compliment", "share_opinion"]
        },
        daily_advanced: {
          id: "daily_advanced",
          name: "Quotidien avancé",
          nameEn: "Advanced Daily",
          order: 3,
          icon: "📅",
          missions: ["describe_symptoms", "bank_account", "job_interview"]
        }
      }
    },
    B1: {
      id: "B1",
      name: "Voyageur",
      nameEn: "Traveler",
      requiredXP: 800,
      icon: "🏆",
      color: "#ff9f43",
      modules: {
        work: {
          id: "work",
          name: "Monde professionnel",
          nameEn: "Professional World",
          order: 1,
          icon: "💼",
          missions: ["write_email", "meeting_talk", "present_project"]
        },
        culture: {
          id: "culture",
          name: "Culture et médias",
          nameEn: "Culture & Media",
          order: 2,
          icon: "🎭",
          missions: ["discuss_movie", "read_news", "understand_song"]
        },
        expression: {
          id: "expression",
          name: "Expression avancée",
          nameEn: "Advanced Expression",
          order: 3,
          icon: "🗣️",
          missions: ["express_feelings", "give_advice", "tell_story"]
        }
      }
    },
    B2: {
      id: "B2",
      name: "Conquérant",
      nameEn: "Conqueror",
      requiredXP: 1500,
      icon: "👑",
      color: "#e040fb",
      modules: {
        debate: {
          id: "debate",
          name: "Débat et argumentation",
          nameEn: "Debate & Argumentation",
          order: 1,
          icon: "⚖️",
          missions: ["argue_persuade", "defend_position", "analyze_text"]
        },
        professional: {
          id: "professional",
          name: "Professionnel avancé",
          nameEn: "Advanced Professional",
          order: 2,
          icon: "📊",
          missions: ["lead_meeting", "write_report", "negotiate_contract"]
        },
        media: {
          id: "media",
          name: "Médias et actualités",
          nameEn: "Media & News",
          order: 3,
          icon: "📺",
          missions: ["analyze_article", "watch_documentary", "discuss_politics"]
        }
      }
    },
    C1: {
      id: "C1",
      name: "Maître des Langues",
      nameEn: "Language Master",
      requiredXP: 2500,
      icon: "🏅",
      color: "#ff6b6b",
      modules: {
        mastery: {
          id: "mastery",
          name: "Maîtrise complète",
          nameEn: "Complete Mastery",
          order: 1,
          icon: "🎯",
          missions: ["give_speech", "write_essay", "teach_others"]
        },
        nuance: {
          id: "nuance",
          name: "Nuances et subtilités",
          nameEn: "Nuances & Subtleties",
          order: 2,
          icon: "🎨",
          missions: ["use_idioms", "understand_humor", "master_registers"]
        }
      }
    }
  },

  // DÉFINITION COMPLÈTE DES MISSIONS CEFR
  missions: {
    // === NIVEAU A1 ===
    order_coffee: {
      id: "order_coffee",
      title: "Commander un café",
      titleEn: "Order Coffee",
      level: "A1",
      moduleId: "survival",
      order: 1,
      xpReward: 50,
      gemReward: 1,
      icon: "☕",
      keywords: ["café", "coffee", "kafe", "s'il vous plaît", "please", "je voudrais", "merci"],
      location: "market",
      videoId: "French1.3",
      phrases: ["Je voudrais un café s'il vous plaît", "Merci beaucoup"],
      description: "Apprenez à commander un café dans un café ou au marché"
    },
    introduce_yourself: {
      id: "introduce_yourself",
      title: "Se présenter",
      titleEn: "Introduce Yourself",
      level: "A1",
      moduleId: "survival",
      order: 2,
      xpReward: 50,
      gemReward: 1,
      icon: "👋",
      keywords: ["appelle", "name", "je m'appelle", "viens", "from", "habite"],
      location: "friends",
      videoId: "FrenchGreetings_Archive",
      phrases: ["Je m'appelle...", "Je viens de...", "J'habite à..."],
      description: "Dites votre nom, votre origine et où vous habitez"
    },
    ask_directions: {
      id: "ask_directions",
      title: "Demander son chemin",
      titleEn: "Ask for Directions",
      level: "A1",
      moduleId: "survival",
      order: 3,
      xpReward: 50,
      gemReward: 1,
      icon: "🗺️",
      keywords: ["où", "where", "chemin", "direction", "gauche", "droite", "tout droit"],
      location: "police",
      videoId: "FrenchShopping_Archive",
      phrases: ["Où se trouve...?", "À gauche, à droite, tout droit"],
      description: "Demandez et comprenez des indications"
    },
    buy_food: {
      id: "buy_food",
      title: "Acheter de la nourriture",
      titleEn: "Buy Food",
      level: "A1",
      moduleId: "everyday",
      order: 4,
      xpReward: 50,
      gemReward: 1,
      icon: "🍎",
      keywords: ["combien", "how much", "prix", "price", "acheter", "légume", "fruit"],
      location: "market",
      videoId: "FrenchFood_Archive",
      phrases: ["Combien coûte...?", "Je voudrais...", "C'est trop cher"],
      description: "Achetez des fruits et légumes au marché"
    },
    tell_time: {
      id: "tell_time",
      title: "Dire l'heure",
      titleEn: "Tell Time",
      level: "A1",
      moduleId: "everyday",
      order: 5,
      xpReward: 40,
      gemReward: 1,
      icon: "🕐",
      keywords: ["heure", "time", "quelle heure", "minutes", "midi", "minuit"],
      location: "station",
      videoId: "FrenchTime_Archive",
      phrases: ["Il est... heures", "À quelle heure...?"],
      description: "Demandez et donnez l'heure"
    },
    describe_weather: {
      id: "describe_weather",
      title: "Décrire la météo",
      titleEn: "Describe Weather",
      level: "A1",
      moduleId: "everyday",
      order: 6,
      xpReward: 40,
      gemReward: 1,
      icon: "☀️",
      keywords: ["soleil", "pluie", "neige", "chaud", "froid", "temps"],
      location: "park",
      videoId: "FrenchEnvironment_Archive",
      phrases: ["Il fait beau", "Il pleut", "Il neige", "Il fait chaud/froid"],
      description: "Parlez de la météo et des saisons"
    },
    count_numbers: {
      id: "count_numbers",
      title: "Compter jusqu'à 100",
      titleEn: "Count to 100",
      level: "A1",
      moduleId: "shopping",
      order: 7,
      xpReward: 40,
      gemReward: 1,
      icon: "🔢",
      keywords: ["un", "deux", "trois", "dix", "vingt", "cent", "nombre"],
      location: "bank",
      videoId: "FrenchNumbers_Archive",
      phrases: ["1,2,3...", "Combien ça fait?", "Le total est..."],
      description: "Maîtrisez les nombres pour les achats"
    },
    negotiate_price: {
      id: "negotiate_price",
      title: "Négocier un prix",
      titleEn: "Negotiate Price",
      level: "A1",
      moduleId: "shopping",
      order: 8,
      xpReward: 60,
      gemReward: 2,
      icon: "💰",
      keywords: ["trop cher", "expensive", "prix", "réduction", "discount", "moins cher"],
      location: "market",
      videoId: "FrenchShopping_Archive",
      phrases: ["C'est trop cher", "Un peu moins?", "Je vous propose..."],
      description: "Apprenez à négocier poliment"
    },
    order_drink: {
      id: "order_drink",
      title: "Commander une boisson",
      titleEn: "Order a Drink",
      level: "A1",
      moduleId: "shopping",
      order: 9,
      xpReward: 50,
      gemReward: 1,
      icon: "🍺",
      keywords: ["boisson", "drink", "jus", "eau", "bière", "vin"],
      location: "tavern",
      videoId: "FrenchFood_Archive",
      phrases: ["Je voudrais un jus", "Une bière s'il vous plaît"],
      description: "Commandez des boissons à la taverne"
    },

    // === NIVEAU A2 ===
    buy_ticket: {
      id: "buy_ticket",
      title: "Acheter un billet",
      titleEn: "Buy a Ticket",
      level: "A2",
      moduleId: "travel",
      order: 10,
      xpReward: 60,
      gemReward: 2,
      icon: "🎫",
      keywords: ["billet", "ticket", "aller simple", "aller-retour", "destination", "prix"],
      location: "station",
      videoId: "FrenchIntermediateFSI",
      phrases: ["Un billet pour...", "Aller simple ou aller-retour?", "Combien ça coûte?"],
      description: "Achetez des billets de train ou de bus"
    },
    ask_schedule: {
      id: "ask_schedule",
      title: "Demander l'horaire",
      titleEn: "Ask Schedule",
      level: "A2",
      moduleId: "travel",
      order: 11,
      xpReward: 60,
      gemReward: 2,
      icon: "📅",
      keywords: ["horaire", "schedule", "départ", "arrivée", "quand", "prochain"],
      location: "station",
      videoId: "FrenchIntermediateFSI",
      phrases: ["À quelle heure part le prochain...?", "Quand arrive-t-il?"],
      description: "Consultez et comprenez les horaires"
    },
    hotel_booking: {
      id: "hotel_booking",
      title: "Réserver un hôtel",
      titleEn: "Hotel Booking",
      level: "A2",
      moduleId: "travel",
      order: 12,
      xpReward: 70,
      gemReward: 2,
      icon: "🏨",
      keywords: ["hôtel", "réservation", "chambre", "nuit", "prix", "disponible"],
      location: "bank",
      videoId: "FrenchBusiness_Archive",
      phrases: ["Je voudrais réserver une chambre", "Pour une nuit", "Avez-vous de la disponibilité?"],
      description: "Réservez une chambre d'hôtel"
    },
    make_friends: {
      id: "make_friends",
      title: "Se faire des amis",
      titleEn: "Make Friends",
      level: "A2",
      moduleId: "social",
      order: 13,
      xpReward: 60,
      gemReward: 2,
      icon: "🤝",
      keywords: ["ami", "friend", "rencontrer", "passer du temps", "ensemble"],
      location: "friends",
      videoId: "FrenchCultureTraditional_Archive",
      phrases: ["Tu veux être mon ami?", "On peut se revoir?", "J'aime passer du temps avec toi"],
      description: "Créez des liens sociaux naturels"
    },
    give_compliment: {
      id: "give_compliment",
      title: "Faire un compliment",
      titleEn: "Give a Compliment",
      level: "A2",
      moduleId: "social",
      order: 14,
      xpReward: 60,
      gemReward: 2,
      icon: "💝",
      keywords: ["beau", "beau/belle", "magnifique", "gentil", "sympa", "joli"],
      location: "park",
      videoId: "FrenchIdioms_Archive",
      phrases: ["Tu es très...", "J'aime ton...", "C'est magnifique!"],
      description: "Faites des compliments sincères"
    },
    share_opinion: {
      id: "share_opinion",
      title: "Partager son opinion",
      titleEn: "Share Opinion",
      level: "A2",
      moduleId: "social",
      order: 15,
      xpReward: 70,
      gemReward: 2,
      icon: "💬",
      keywords: ["pense", "think", "opinion", "avis", "crois", "trouve"],
      location: "school",
      videoId: "FrenchMedia_Archive",
      phrases: ["À mon avis...", "Je pense que...", "Selon moi..."],
      description: "Exprimez ce que vous pensez"
    },
    describe_symptoms: {
      id: "describe_symptoms",
      title: "Décrire des symptômes",
      titleEn: "Describe Symptoms",
      level: "A2",
      moduleId: "daily_advanced",
      order: 16,
      xpReward: 70,
      gemReward: 2,
      icon: "🤒",
      keywords: ["mal", "hurt", "fièvre", "toux", "douleur", "médecin"],
      location: "hospital",
      videoId: "FrenchHealth_Archive",
      phrases: ["J'ai mal à...", "J'ai de la fièvre", "Je tousse"],
      description: "Expliquez ce qui ne va pas"
    },
    bank_account: {
      id: "bank_account",
      title: "Ouvrir un compte",
      titleEn: "Open Account",
      level: "A2",
      moduleId: "daily_advanced",
      order: 17,
      xpReward: 80,
      gemReward: 3,
      icon: "🏦",
      keywords: ["compte", "account", "ouvrir", "banque", "argent", "dépôt"],
      location: "bank",
      videoId: "FrenchBusiness_Archive",
      phrases: ["Je voudrais ouvrir un compte", "Quels sont les documents nécessaires?"],
      description: "Ouvrez un compte bancaire"
    },
    job_interview: {
      id: "job_interview",
      title: "Entretien d'embauche",
      titleEn: "Job Interview",
      level: "A2",
      moduleId: "daily_advanced",
      order: 18,
      xpReward: 100,
      gemReward: 3,
      icon: "💼",
      keywords: ["travail", "job", "expérience", "compétence", "poste", "embauche"],
      location: "factory",
      videoId: "FrenchBusiness_Archive",
      phrases: ["Je suis intéressé par le poste", "J'ai de l'expérience en...", "Mes compétences sont..."],
      description: "Présentez-vous pour un emploi"
    },

    // === NIVEAU B1 ===
    write_email: {
      id: "write_email",
      title: "Rédiger un email",
      titleEn: "Write an Email",
      level: "B1",
      moduleId: "work",
      order: 19,
      xpReward: 80,
      gemReward: 3,
      icon: "📧",
      keywords: ["email", "courriel", "objet", "cordialement", "cher", "merci"],
      location: "school",
      videoId: "FrenchBusiness_Archive",
      phrases: ["Objet:", "Cher Monsieur/Madame", "Dans l'attente de votre réponse"],
      description: "Rédigez des emails professionnels"
    },
    meeting_talk: {
      id: "meeting_talk",
      title: "Parler en réunion",
      titleEn: "Talk in Meeting",
      level: "B1",
      moduleId: "work",
      order: 20,
      xpReward: 90,
      gemReward: 3,
      icon: "👔",
      keywords: ["réunion", "meeting", "projet", "proposition", "accord", "désaccord"],
      location: "factory",
      videoId: "FrenchBusiness_Archive",
      phrases: ["Je propose que...", "Je suis d'accord avec...", "Je ne suis pas d'accord"],
      description: "Participez activement aux réunions"
    },
    present_project: {
      id: "present_project",
      title: "Présenter un projet",
      titleEn: "Present a Project",
      level: "B1",
      moduleId: "work",
      order: 21,
      xpReward: 100,
      gemReward: 4,
      icon: "📊",
      keywords: ["projet", "project", "présentation", "objectif", "résultat", "conclusion"],
      location: "school",
      videoId: "FrenchUniversity_Archive",
      phrases: ["Le but de ce projet est...", "Nous avons atteint...", "En conclusion..."],
      description: "Présentez un projet de manière structurée"
    },
    discuss_movie: {
      id: "discuss_movie",
      title: "Discuter d'un film",
      titleEn: "Discuss a Movie",
      level: "B1",
      moduleId: "culture",
      order: 22,
      xpReward: 80,
      gemReward: 3,
      icon: "🎬",
      keywords: ["film", "movie", "histoire", "acteur", "scène", "réalisation"],
      location: "cinema",
      videoId: "FrenchCultureTraditional_Archive",
      phrases: ["L'histoire parle de...", "J'ai aimé parce que...", "Le meilleur moment était..."],
      description: "Échangez sur des films"
    },
    read_news: {
      id: "read_news",
      title: "Lire les actualités",
      titleEn: "Read News",
      level: "B1",
      moduleId: "culture",
      order: 23,
      xpReward: 80,
      gemReward: 3,
      icon: "📰",
      keywords: ["actualité", "news", "journal", "article", "information", "événement"],
      location: "tavern",
      videoId: "FrenchMedia_Archive",
      phrases: ["J'ai lu que...", "Selon l'article...", "Cet événement a eu lieu..."],
      description: "Comprenez et discutez des actualités"
    },
    understand_song: {
      id: "understand_song",
      title: "Comprendre une chanson",
      titleEn: "Understand a Song",
      level: "B1",
      moduleId: "culture",
      order: 24,
      xpReward: 70,
      gemReward: 2,
      icon: "🎵",
      keywords: ["chanson", "song", "paroles", "refrain", "musique", "rythme"],
      location: "tavern",
      videoId: "FrenchCultureTraditional_Archive",
      phrases: ["Les paroles parlent de...", "J'aime le refrain", "Cette chanson évoque..."],
      description: "Analysez le sens d'une chanson"
    },
    express_feelings: {
      id: "express_feelings",
      title: "Exprimer ses sentiments",
      titleEn: "Express Feelings",
      level: "B1",
      moduleId: "expression",
      order: 25,
      xpReward: 80,
      gemReward: 3,
      icon: "❤️",
      keywords: ["sentiment", "feeling", "heureux", "triste", "fâché", "inquiet"],
      location: "park",
      videoId: "FrenchIdioms_Archive",
      phrases: ["Je me sens...", "Ça me rend...", "Je suis inquiet à propos de..."],
      description: "Exprimez vos émotions avec nuance"
    },
    give_advice: {
      id: "give_advice",
      title: "Donner des conseils",
      titleEn: "Give Advice",
      level: "B1",
      moduleId: "expression",
      order: 26,
      xpReward: 80,
      gemReward: 3,
      icon: "💡",
      keywords: ["conseil", "advice", "devrais", "should", "recommander", "suggérer"],
      location: "friends",
      videoId: "FrenchIdioms_Archive",
      phrases: ["Je te conseille de...", "Tu devrais...", "Pourquoi ne pas...?"],
      description: "Donnez des conseils utiles"
    },
    tell_story: {
      id: "tell_story",
      title: "Raconter une histoire",
      titleEn: "Tell a Story",
      level: "B1",
      moduleId: "expression",
      order: 27,
      xpReward: 100,
      gemReward: 4,
      icon: "📖",
      keywords: ["histoire", "story", "arrivé", "happened", "une fois", "alors"],
      location: "tavern",
      videoId: "FrenchLiteratureAdv_Archive",
      phrases: ["Il était une fois...", "Soudain...", "À la fin..."],
      description: "Racontez des anecdotes captivantes"
    },

    // === NIVEAU B2 ===
    argue_persuade: {
      id: "argue_persuade",
      title: "Argumenter et persuader",
      titleEn: "Argue & Persuade",
      level: "B2",
      moduleId: "debate",
      order: 28,
      xpReward: 120,
      gemReward: 5,
      icon: "⚖️",
      keywords: ["argument", "persuader", "convaincre", "preuve", "raison", "logique"],
      location: "school",
      videoId: "FrenchUniversity_Archive",
      phrases: ["Je soutiens que...", "D'une part... d'autre part...", "Il est évident que..."],
      description: "Défendez vos idées avec force"
    },
    defend_position: {
      id: "defend_position",
      title: "Défendre une position",
      titleEn: "Defend a Position",
      level: "B2",
      moduleId: "debate",
      order: 29,
      xpReward: 120,
      gemReward: 5,
      icon: "🛡️",
      keywords: ["position", "défendre", "contre-argument", "objection", "réfuter"],
      location: "police",
      videoId: "FrenchUniversity_Archive",
      phrases: ["Je comprends votre point de vue, mais...", "En réalité...", "Cependant..."],
      description: "Répondez aux objections"
    },
    analyze_text: {
      id: "analyze_text",
      title: "Analyser un texte",
      titleEn: "Analyze a Text",
      level: "B2",
      moduleId: "debate",
      order: 30,
      xpReward: 120,
      gemReward: 5,
      icon: "📝",
      keywords: ["analyser", "analyse", "texte", "thème", "conclusion", "structure"],
      location: "school",
      videoId: "FrenchLiteratureAdv_Archive",
      phrases: ["Le thème principal est...", "L'auteur veut dire...", "La structure montre que..."],
      description: "Analysez des textes complexes"
    },
    lead_meeting: {
      id: "lead_meeting",
      title: "Animer une réunion",
      titleEn: "Lead a Meeting",
      level: "B2",
      moduleId: "professional",
      order: 31,
      xpReward: 140,
      gemReward: 5,
      icon: "🎯",
      keywords: ["animer", "réunion", "ordre du jour", "synthèse", "décision"],
      location: "factory",
      videoId: "FrenchBusiness_Archive",
      phrases: ["L'ordre du jour est...", "Je fais la synthèse...", "La décision est prise de..."],
      description: "Animez des réunions professionnelles"
    },
    write_report: {
      id: "write_report",
      title: "Rédiger un rapport",
      titleEn: "Write a Report",
      level: "B2",
      moduleId: "professional",
      order: 32,
      xpReward: 140,
      gemReward: 5,
      icon: "📄",
      keywords: ["rapport", "report", "analyse", "recommandation", "conclusion"],
      location: "school",
      videoId: "FrenchBusiness_Archive",
      phrases: ["Ce rapport présente...", "L'analyse montre...", "Je recommande de..."],
      description: "Rédigez des rapports détaillés"
    },
    negotiate_contract: {
      id: "negotiate_contract",
      title: "Négocier un contrat",
      titleEn: "Negotiate a Contract",
      level: "B2",
      moduleId: "professional",
      order: 33,
      xpReward: 160,
      gemReward: 6,
      icon: "📑",
      keywords: ["contrat", "contract", "négocier", "clause", "accord", "condition"],
      location: "bank",
      videoId: "FrenchBusiness_Archive",
      phrases: ["Les conditions suivantes...", "Nous proposons...", "L'accord est conclu."],
      description: "Négociez des contrats professionnels"
    },
    analyze_article: {
      id: "analyze_article",
      title: "Analyser un article",
      titleEn: "Analyze an Article",
      level: "B2",
      moduleId: "media",
      order: 34,
      xpReward: 120,
      gemReward: 5,
      icon: "📰",
      keywords: ["article", "analyse", "opinion", "fait", "source", "biais"],
      location: "tavern",
      videoId: "FrenchMedia_Archive",
      phrases: ["Cet article affirme que...", "Les faits montrent...", "Le journaliste a un biais..."],
      description: "Analysez des articles de presse"
    },
    watch_documentary: {
      id: "watch_documentary",
      title: "Regarder un documentaire",
      titleEn: "Watch a Documentary",
      level: "B2",
      moduleId: "media",
      order: 35,
      xpReward: 120,
      gemReward: 5,
      icon: "🎥",
      keywords: ["documentaire", "documentary", "sujet", "témoignage", "conclusion"],
      location: "cinema",
      videoId: "FrenchUniversity_Archive",
      phrases: ["Le documentaire traite de...", "Les témoins disent...", "La conclusion est que..."],
      description: "Comprenez et discutez des documentaires"
    },
    discuss_politics: {
      id: "discuss_politics",
      title: "Discuter politique",
      titleEn: "Discuss Politics",
      level: "B2",
      moduleId: "media",
      order: 36,
      xpReward: 140,
      gemReward: 6,
      icon: "🏛️",
      keywords: ["politique", "politics", "gouvernement", "élection", "décision", "citoyen"],
      location: "police",
      videoId: "FrenchUniversity_Archive",
      phrases: ["La politique actuelle...", "Le gouvernement devrait...", "En tant que citoyen..."],
      description: "Participez à des discussions politiques"
    },

    // === NIVEAU C1 ===
    give_speech: {
      id: "give_speech",
      title: "Faire un discours",
      titleEn: "Give a Speech",
      level: "C1",
      moduleId: "mastery",
      order: 37,
      xpReward: 200,
      gemReward: 8,
      icon: "🎤",
      keywords: ["discours", "speech", "public", "émouvoir", "convaincre", "auditoire"],
      location: "school",
      videoId: "FrenchUniversity_Archive",
      phrases: ["Mesdames, Messieurs...", "Je tiens à souligner...", "En conclusion..."],
      description: "Prononcez des discours éloquents"
    },
    write_essay: {
      id: "write_essay",
      title: "Rédiger une dissertation",
      titleEn: "Write an Essay",
      level: "C1",
      moduleId: "mastery",
      order: 38,
      xpReward: 200,
      gemReward: 8,
      icon: "✍️",
      keywords: ["dissertation", "essay", "thèse", "argument", "développement", "conclusion"],
      location: "school",
      videoId: "FrenchLiteratureAdv_Archive",
      phrases: ["La thèse défendue est...", "Dans un premier temps...", "Il convient de nuancer..."],
      description: "Rédigez des dissertations structurées"
    },
    teach_others: {
      id: "teach_others",
      title: "Enseigner aux autres",
      titleEn: "Teach Others",
      level: "C1",
      moduleId: "mastery",
      order: 39,
      xpReward: 200,
      gemReward: 8,
      icon: "👨‍🏫",
      keywords: ["enseigner", "expliquer", "pédagogie", "exemple", "démonstration"],
      location: "school",
      videoId: "FrenchUniversity_Archive",
      phrases: ["Je vais vous expliquer...", "Voici un exemple...", "Ce point important..."],
      description: "Expliquez des concepts complexes"
    },
    use_idioms: {
      id: "use_idioms",
      title: "Utiliser les expressions",
      titleEn: "Use Idioms",
      level: "C1",
      moduleId: "nuance",
      order: 40,
      xpReward: 180,
      gemReward: 7,
      icon: "💬",
      keywords: ["expression", "idiome", "proverbe", "image", "métaphore", "figé"],
      location: "tavern",
      videoId: "FrenchIdioms_Archive",
      phrases: ["Comme on dit...", "Pour reprendre l'expression...", "Métaphoriquement parlant..."],
      description: "Maîtrisez les expressions idiomatiques"
    },
    understand_humor: {
      id: "understand_humor",
      title: "Comprendre l'humour",
      titleEn: "Understand Humor",
      level: "C1",
      moduleId: "nuance",
      order: 41,
      xpReward: 180,
      gemReward: 7,
      icon: "😂",
      keywords: ["humour", "ironie", "second degré", "rire", "blague", "jeu de mots"],
      location: "tavern",
      videoId: "FrenchIdioms_Archive",
      phrases: ["C'est une blague", "Au second degré", "L'ironie veut dire que..."],
      description: "Saisissez l'humour et l'ironie"
    },
    master_registers: {
      id: "master_registers",
      title: "Maîtriser les registres",
      titleEn: "Master Registers",
      level: "C1",
      moduleId: "nuance",
      order: 42,
      xpReward: 180,
      gemReward: 7,
      icon: "🎭",
      keywords: ["registre", "soutenu", "familier", "courant", "niveau de langue", "style"],
      location: "church",
      videoId: "FrenchLiteratureAdv_Archive",
      phrases: ["De manière soutenue...", "Familèrement...", "Le registre courant est..."],
      description: "Adaptez votre langage à la situation"
    }
  }
};

// =================================================================
// FONCTIONS D'ACCÈS AU ROADMAP
// =================================================================

function getCurrentLevel() {
  if (typeof S === 'undefined' || !S.xp) return "A1";
  const totalXP = S.xp || 0;
  const levels = CEFR_ROADMAP.levels;
  let currentLevel = "A1";
  
  for (const [levelId, levelData] of Object.entries(levels)) {
    if (totalXP >= levelData.requiredXP) {
      currentLevel = levelId;
    }
  }
  return currentLevel;
}

function getNextLevel() {
  const current = getCurrentLevel();
  const levels = ["A1", "A2", "B1", "B2", "C1"];
  const currentIndex = levels.indexOf(current);
  return levels[currentIndex + 1] || null;
}

function getLevelProgress() {
  if (typeof S === 'undefined') {
    return { current: "A1", next: "A2", progress: 0, xpNeeded: 300, xpInLevel: 0 };
  }
  const totalXP = S.xp || 0;
  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  
  if (!nextLevel) {
    return { current: currentLevel, next: null, progress: 100, xpNeeded: 0, xpInLevel: totalXP };
  }
  
  const nextRequiredXP = CEFR_ROADMAP.levels[nextLevel].requiredXP;
  const currentRequiredXP = CEFR_ROADMAP.levels[currentLevel].requiredXP;
  const xpInLevel = totalXP - currentRequiredXP;
  const xpNeeded = nextRequiredXP - currentRequiredXP;
  const progress = Math.min(100, Math.floor((xpInLevel / xpNeeded) * 100));
  
  return {
    current: currentLevel,
    next: nextLevel,
    progress: progress,
    xpNeeded: xpNeeded,
    xpInLevel: xpInLevel
  };
}

function getAvailableMissionsForLevel(levelId) {
  // Guard pour éviter les erreurs si CEFR_ROADMAP n'est pas complètement chargé
  if (!CEFR_ROADMAP || !CEFR_ROADMAP.levels) return [];
  
  const missions = [];
  const levelData = CEFR_ROADMAP.levels[levelId];
  if (!levelData) return missions;
  
  for (const moduleData of Object.values(levelData.modules)) {
    for (const missionId of moduleData.missions) {
      const mission = CEFR_ROADMAP.missions[missionId];
      if (mission) {
        missions.push(mission);
      }
    }
  }
  return missions.sort((a, b) => a.order - b.order);
}

function getUnlockedMissions() {
  let completedIds = [];
  if (typeof S_missions !== 'undefined' && S_missions.completed) {
    completedIds = Object.keys(S_missions.completed);
  }
  const allMissions = Object.values(CEFR_ROADMAP.missions);
  
  return allMissions.filter(mission => {
    if (completedIds.includes(mission.id)) return true;
    
    const levelMissions = getAvailableMissionsForLevel(mission.level);
    const missionIndex = levelMissions.findIndex(m => m.id === mission.id);
    
    if (missionIndex === 0) return true;
    
    const previousMissions = levelMissions.slice(0, missionIndex);
    return previousMissions.every(prev => completedIds.includes(prev.id));
  });
}

function getMissionByLocation(locId) {
  const allMissions = Object.values(CEFR_ROADMAP.missions);
  return allMissions.filter(m => m.location === locId);
}

function getNextMission() {
  const unlocked = getUnlockedMissions();
  let completed = {};
  if (typeof S_missions !== 'undefined' && S_missions.completed) {
    completed = S_missions.completed;
  }
  
  for (const mission of unlocked) {
    if (!completed[mission.id]) {
      return mission;
    }
  }
  return null;
}

function getModuleMissions(levelId, moduleId) {
  const level = CEFR_ROADMAP.levels[levelId];
  if (!level || !level.modules[moduleId]) return [];
  
  const missions = [];
  for (const missionId of level.modules[moduleId].missions) {
    const mission = CEFR_ROADMAP.missions[missionId];
    if (mission) missions.push(mission);
  }
  return missions;
}

// =================================================================
// EXTENSION DE missions.js — AJOUT DES MISSIONS CEFR
// =================================================================

function syncCEFRMissions() {
  if (typeof MISSIONS === 'undefined') {
    console.warn("syncCEFRMissions: MISSIONS non défini, synchronisation impossible");
    return;
  }
  
  const allCEFRMissions = Object.values(CEFR_ROADMAP.missions);
  
  for (const mission of allCEFRMissions) {
    const locId = mission.location;
    if (!MISSIONS[locId]) {
      MISSIONS[locId] = [];
    }
    
    const exists = MISSIONS[locId].some(m => m.id === mission.id);
    if (!exists) {
      MISSIONS[locId].push({
        id: mission.id,
        icon: mission.icon,
        xp: mission.xpReward,
        gem: mission.gemReward,
        title: { fr: mission.title, en: mission.titleEn },
        desc: { fr: mission.description, en: mission.description },
        hint: { fr: mission.phrases.join(" ou "), en: mission.phrases.join(" or ") },
        check: mission.keywords
      });
    }
  }
  console.log("syncCEFRMissions: Synchronisation terminée");
}

// =================================================================
// FONCTION D'AFFICHAGE DU ROADMAP UI
// =================================================================

function showRoadmap() {
  if (typeof S === 'undefined') {
    if (typeof showNotif === 'function') showNotif("Chargement en cours...");
    return;
  }
  
  const nl = (typeof S !== 'undefined' && S.nativeLang) ? S.nativeLang : 'fr';
  const progress = getLevelProgress();
  let completedMissions = {};
  if (typeof S_missions !== 'undefined' && S_missions.completed) {
    completedMissions = S_missions.completed;
  }
  
  let overlay = document.createElement('div');
  overlay.id = 'roadmapOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.94);z-index:9600;'
    + 'overflow-y:auto;display:flex;align-items:flex-start;justify-content:center;padding:20px;';
  
  let html = `
    <div style="background:linear-gradient(135deg,#0f1a30,#0a0a14);border:1px solid var(--gold);
                border-radius:24px;padding:24px;max-width:700px;width:100%;margin:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <div style="font-family:"Cinzel",serif;font-size:1.1rem;color:var(--gold);">
          🗺️ Parcours CEFR
        </div>
        <button onclick="document.getElementById('roadmapOverlay').remove()" 
                style="background:transparent;border:1px solid var(--border);
                       color:var(--dim);padding:4px 10px;border-radius:12px;cursor:pointer;">✕</button>
      </div>
      
      <div style="margin-bottom:24px;">
        <div style="display:flex;justify-content:space-between;font-size:0.72rem;color:var(--dim);margin-bottom:6px;">
          <span>Progression globale</span>
          <span>${progress.current} → ${progress.next || '🏆'}</span>
        </div>
        <div style="height:10px;background:rgba(255,255,255,0.08);border-radius:5px;overflow:hidden;">
          <div style="height:100%;width:${progress.progress}%;
                      background:linear-gradient(90deg,var(--gold),var(--purple));
                      border-radius:5px;"></div>
        </div>
        <div style="font-size:0.68rem;color:var(--dim);margin-top:6px;">
          ${progress.xpInLevel || 0} / ${progress.xpNeeded} XP pour ${progress.next || 'le titre de Maître'}
        </div>
      </div>
  `;
  
  for (const [levelId, levelData] of Object.entries(CEFR_ROADMAP.levels)) {
    const levelMissions = getAvailableMissionsForLevel(levelId);
    const completedCount = levelMissions.filter(m => completedMissions[m.id]).length;
    const totalCount = levelMissions.length;
    let isUnlocked = false;
    if (typeof S !== 'undefined') {
      isUnlocked = progress.current === levelId || (levelData.requiredXP <= (S.xp || 0));
    }
    
    const levelColor = levelData.color;
    const r = parseInt(levelColor.slice(1,3), 16);
    const g = parseInt(levelColor.slice(3,5), 16);
    const b = parseInt(levelColor.slice(5,7), 16);
    
    html += `
      <div style="margin-bottom:20px;border:1px solid ${isUnlocked ? 'rgba(255,215,0,0.3)' : 'var(--border)'};
                  border-radius:16px;overflow:hidden;opacity:${isUnlocked ? 1 : 0.6};">
        <div style="background:rgba(${r},${g},${b},0.12);
                    padding:12px 16px;display:flex;align-items:center;gap:12px;">
          <span style="font-size:1.5rem;">${levelData.icon}</span>
          <div style="flex:1;">
            <div style="font-weight:900;font-size:0.9rem;color:${levelData.color}">
              ${levelId} · ${levelData[nl] || levelData.name}
            </div>
            <div style="font-size:0.68rem;color:var(--dim);">
              ${completedCount}/${totalCount} missions · ${levelData.requiredXP} XP requis
            </div>
          </div>
          <div style="width:40px;height:40px;border-radius:50%;
                      background:rgba(${r},${g},${b},0.2);
                      display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:900;">
            ${totalCount === 0 ? 0 : Math.round((completedCount/totalCount)*100)}%
          </div>
        </div>
        <div style="padding:12px;">
    `;
    
    for (const [moduleId, moduleData] of Object.entries(levelData.modules)) {
      const moduleMissions = getModuleMissions(levelId, moduleId);
      const moduleCompleted = moduleMissions.filter(m => completedMissions[m.id]).length;
      
      html += `
        <div style="margin-bottom:12px;">
          <div style="font-size:0.7rem;font-weight:800;color:var(--dim);margin-bottom:6px;">
            ${moduleData.icon} ${moduleData[nl] || moduleData.name}
            <span style="margin-left:8px;color:var(--gold);">${moduleCompleted}/${moduleMissions.length}</span>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">
      `;
      
      for (const mission of moduleMissions) {
        const isCompleted = completedMissions[mission.id];
        const missionTitle = mission[nl] || mission.title;
        html += `
          <button onclick="startCEFRMission('${mission.id}')" 
                  style="background:${isCompleted ? 'rgba(78,207,112,0.15)' : 'rgba(255,255,255,0.05)'};
                         border:1px solid ${isCompleted ? 'rgba(78,207,112,0.5)' : 'var(--border)'};
                         border-radius:20px;padding:6px 14px;font-size:0.7rem;
                         color:${isCompleted ? 'var(--green)' : 'var(--text)'};
                         cursor:${isCompleted ? 'default' : 'pointer'};display:flex;align-items:center;gap:6px;">
            ${mission.icon} ${missionTitle.length > 20 ? missionTitle.substring(0,18)+'...' : missionTitle}
            ${isCompleted ? '✓' : `+${mission.xpReward}`}
          </button>
        `;
      }
      
      html += `</div></div>`;
    }
    
    html += `</div></div>`;
  }
  
  html += `
      <button onclick="document.getElementById('roadmapOverlay').remove();if(typeof showProgression === 'function'){showProgression();}else if(typeof showNotif === 'function'){showNotif('📊 Progression disponible dans l\\'onglet Missions');}" 
              style="width:100%;margin-top:8px;background:rgba(255,215,0,0.1);
                     border:1px solid var(--gold);color:var(--gold);padding:10px;
                     border-radius:14px;cursor:pointer;font-weight:800;">
        📊 Voir progression détaillée
      </button>
    </div>`;
  
  overlay.innerHTML = html;
  document.body.appendChild(overlay);
}

// =================================================================
// LANCEMENT D'UNE MISSION CEFR
// =================================================================

function startCEFRMission(missionId) {
  // Guard pour vérifier que la mission existe
  if (!CEFR_ROADMAP || !CEFR_ROADMAP.missions || !CEFR_ROADMAP.missions[missionId]) {
    if (typeof showNotif === 'function') showNotif("❌ Mission introuvable");
    return;
  }
  
  const mission = CEFR_ROADMAP.missions[missionId];
  if (!mission) return;
  
  let completed = {};
  if (typeof S_missions !== 'undefined' && S_missions.completed) {
    completed = S_missions.completed;
  }
  if (completed[missionId]) {
    if (typeof showNotif === 'function') showNotif("✅ Mission déjà complétée !");
    return;
  }
  
  const levelMissions = getAvailableMissionsForLevel(mission.level);
  const missionIndex = levelMissions.findIndex(m => m.id === missionId);
  const previousMissions = levelMissions.slice(0, missionIndex);
  const missing = previousMissions.filter(m => !completed[m.id]);
  
  if (missing.length > 0) {
    if (typeof showNotif === 'function') {
      showNotif(`🔒 Complétez d'abord: ${missing.map(m => m.title).slice(0,2).join(", ")}${missing.length > 2 ? "..." : ""}`);
    }
    return;
  }
  
  if (typeof goVillage === 'function') {
    if (document.getElementById('screen-village') && !document.getElementById('screen-village').classList.contains('active')) {
      goVillage();
    }
  }
  
  setTimeout(() => {
    if (typeof LOCATIONS !== 'undefined') {
      const location = LOCATIONS.find(loc => loc.id === mission.location);
      if (location && typeof openLoc === 'function') {
        openLoc(location);
      }
    }
  }, 300);
  
  setTimeout(() => {
    if (typeof MISSIONS !== 'undefined' && typeof startMission === 'function') {
      const existingMission = MISSIONS[mission.location]?.find(m => m.id === missionId);
      if (existingMission) {
        startMission(missionId, mission.location);
      }
    }
    if (typeof showNotif === 'function') showNotif(`🎯 Mission: ${mission.title}`);
  }, 600);
}

// =================================================================
// AJOUTER LE BOUTON ROADMAP AU MENU
// =================================================================

function addRoadmapButton() {
  const menuContent = document.querySelector('#screen-menu .menu-content');
  if (menuContent && !document.getElementById('roadmapBtn')) {
    const roadmapBtn = document.createElement('button');
    roadmapBtn.id = 'roadmapBtn';
    roadmapBtn.className = 'menu-dict-btn';
    roadmapBtn.style.marginTop = '16px';
    roadmapBtn.onclick = function() { 
      if (typeof showRoadmap === 'function') showRoadmap(); 
      else if (typeof showNotif === 'function') showNotif("🗺️ Parcours CEFR bientôt disponible");
    };
    roadmapBtn.innerHTML = `
      <span class="menu-dict-icon">🗺️</span>
      <div class="menu-dict-text">
        <div class="menu-dict-title">Parcours CEFR</div>
        <div class="menu-dict-sub">A1 → A2 → B1 → B2 → C1 · Progression structurée</div>
      </div>
      <span style="color:var(--dim);margin-left:auto">›</span>
    `;
    menuContent.appendChild(roadmapBtn);
    console.log("addRoadmapButton: Bouton ajouté avec succès");
  }
}

// =================================================================
// INITIALISATION AUTOMATIQUE AVEC LIMITE DE TENTATIVES
// =================================================================

let initAttempts = 0;
const MAX_INIT_ATTEMPTS = 10;

function attemptInit() {
  initAttempts++;
  
  // Vérifier les dépendances nécessaires
  const dependenciesReady = (typeof S !== 'undefined' && typeof MISSIONS !== 'undefined');
  
  if (dependenciesReady) {
    console.log("roadmap.js: Dépendances chargées, initialisation...");
    if (typeof syncCEFRMissions === 'function') {
      syncCEFRMissions();
    }
    if (document.getElementById('screen-menu')) {
      addRoadmapButton();
    }
    return true;
  }
  
  if (initAttempts < MAX_INIT_ATTEMPTS) {
    console.log(`roadmap.js: Tentative ${initAttempts}/${MAX_INIT_ATTEMPTS} - Attente des dépendances...`);
    setTimeout(attemptInit, 500);
  } else {
    console.warn("roadmap.js: Initialization failed after " + MAX_INIT_ATTEMPTS + " attempts");
  }
  return false;
}

// Lancer l'initialisation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attemptInit);
} else {
  attemptInit();
           }
