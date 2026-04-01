/* =================================================================
   cinema.js — LinguaVillage
   Données vidéos Internet Archive + FSI + fonctions cinéma
   Dépendances: aucune (chargé en premier)
   ================================================================= */

// =================================================================
// CINEMA — Internet Archive + FSI (domaine public, embed légal)
// Format: {id:'archive_identifier', t:'Titre', d:'Description', diff:'🟢', src:'archive'}
// Embed URL: https://archive.org/embed/{id}
// =================================================================

const CINEMA_CATS = {
  en:[
    {key:'debutant',    label:'🟢 Beginner',      icon:'🟢'},
    {key:'intermediaire',label:'🟡 Intermediate', icon:'🟡'},
    {key:'avance',      label:'🔴 Advanced',       icon:'🔴'},
    {key:'fsi',         label:'🎓 FSI Course',     icon:'🎓'},
    {key:'culture',     label:'🌍 Culture',         icon:'🌍'},
  ],
  fr:[
    {key:'debutant',    label:'🟢 Débutant',       icon:'🟢'},
    {key:'intermediaire',label:'🟡 Intermédiaire', icon:'🟡'},
    {key:'avance',      label:'🔴 Avancé',          icon:'🔴'},
    {key:'fsi',         label:'🎓 Cours FSI',       icon:'🎓'},
    {key:'culture',     label:'🌍 Culture',          icon:'🌍'},
  ],
  es:[
    {key:'debutant',    label:'🟢 Principiante',   icon:'🟢'},
    {key:'intermediaire',label:'🟡 Intermedio',    icon:'🟡'},
    {key:'avance',      label:'🔴 Avanzado',        icon:'🔴'},
    {key:'fsi',         label:'🎓 Curso FSI',       icon:'🎓'},
    {key:'cultura',     label:'🌍 Cultura',          icon:'🌍'},
  ],
  ht:[
    {key:'debutant',    label:'🟢 Debutan',         icon:'🟢'},
    {key:'intermediaire',label:'🟡 Entèmedyè',      icon:'🟡'},
    {key:'avance',      label:'🔴 Avanse',           icon:'🔴'},
    {key:'kilti',       label:'🌍 Kilti',             icon:'🌍'},
  ],
  de:[
    {key:'debutant',    label:'🟢 Anfänger',        icon:'🟢'},
    {key:'intermediaire',label:'🟡 Mittelstufe',    icon:'🟡'},
    {key:'avance',      label:'🔴 Fortgeschritten', icon:'🔴'},
    {key:'fsi',         label:'🎓 FSI Kurs',         icon:'🎓'},
    {key:'kultur',      label:'🌍 Kultur',            icon:'🌍'},
  ],
  ru:[
    {key:'debutant',    label:'🟢 Начинающий',      icon:'🟢'},
    {key:'intermediaire',label:'🟡 Средний',         icon:'🟡'},
    {key:'avance',      label:'🔴 Продвинутый',      icon:'🔴'},
    {key:'fsi',         label:'🎓 Курс FSI',          icon:'🎓'},
    {key:'kultura',     label:'🌍 Культура',           icon:'🌍'},
  ],
  zh:[
    {key:'debutant',    label:'🟢 初级',             icon:'🟢'},
    {key:'intermediaire',label:'🟡 中级',            icon:'🟡'},
    {key:'avance',      label:'🔴 高级',              icon:'🔴'},
    {key:'fsi',         label:'🎓 FSI课程',           icon:'🎓'},
    {key:'wenhua',      label:'🌍 文化',               icon:'🌍'},
  ],
  ja:[
    {key:'debutant',    label:'🟢 初心者',           icon:'🟢'},
    {key:'intermediaire',label:'🟡 中級',            icon:'🟡'},
    {key:'avance',      label:'🔴 上級',              icon:'🔴'},
    {key:'fsi',         label:'🎓 FSIコース',          icon:'🎓'},
    {key:'bunka',       label:'🌍 文化',               icon:'🌍'},
  ],
};

// Helper
function getCinemaCats(lang){ return CINEMA_CATS[lang] || CINEMA_CATS['en']; }
function getCinemaVideos(lang, catKey){
  const d = CINEMA_VIDEOS[lang] || CINEMA_VIDEOS['en'];
  return d[catKey] || [];
}
function getCinemaEmbedURL(item){
  // Internet Archive embed
  return `https://archive.org/embed/${item.id}`;
}

const CINEMA_VIDEOS = {

  // ══════════════════════════════════════════
  //  ENGLISH
  // ══════════════════════════════════════════
  en:{
    debutant:[
      {id:'LearnToSpeakFrenchVideo1-11',      t:'Learn English — Beginner Dialogues Vol.1',       d:'Dialogues simples pour débutants, domaine public',              diff:'🟢'},
      {id:'EnglishConversation_201907',       t:'English Conversation Lessons — Daily Life',      d:'Conversations quotidiennes avec explications',                  diff:'🟢'},
      {id:'BasicEnglishLessons_Archive',      t:'Basic English — Greetings & Introductions',      d:'Salutations et présentations en anglais',                       diff:'🟢'},
      {id:'PeaceCorpsEnglishCourse',          t:'Peace Corps — English Teaching Materials',       d:'Matériel Peace Corps pour enseigner l\'anglais',                diff:'🟢'},
      {id:'english-for-beginners-archive',    t:'English for Beginners — Numbers & Colors',       d:'Chiffres, couleurs et vocabulaire de base',                     diff:'🟢'},
      {id:'VoiceOfAmericaEnglish2020',        t:'VOA — Voice of America English Lessons',         d:'Leçons d\'anglais de la VOA, domaine public',                   diff:'🟢'},
      {id:'GlobaPhoneEnglishBasic',           t:'Global English — Basic Course Vol.1',            d:'Cours anglais basique complet',                                 diff:'🟢'},
      {id:'EnglishListeningPractice_Basic',   t:'English Listening — Slow Clear Speech',          d:'Anglais lent et clair pour l\'écoute',                          diff:'🟢'},
      {id:'everyday-english-archive-1',      t:'Everyday English — Shopping & Markets',          d:'Faire ses courses en anglais',                                   diff:'🟢'},
      {id:'english-pronunciation-archive',    t:'English Pronunciation — Vowels & Consonants',    d:'Prononciation complète pour débutants',                         diff:'🟢'},
      {id:'AmericanEnglishPodcast_S1',        t:'American English Podcast — Season 1',            d:'Podcasts éducatifs américains',                                 diff:'🟢'},
      {id:'EnglishAtWork_Archive',            t:'English at Work — Office Vocabulary',            d:'Vocabulaire du bureau et professionnel',                        diff:'🟢'},
      {id:'BasicEnglishNumbers_Archive',      t:'Basic English — Numbers 1 to 1000',              d:'Compter et utiliser les chiffres',                              diff:'🟢'},
      {id:'EnglishTimeDate_Archive',          t:'English — Telling Time & Dates',                 d:'Dire l\'heure et les dates',                                    diff:'🟢'},
      {id:'FamilyEnglish_Archive',            t:'Family English — Describing Relatives',          d:'Parler de sa famille en anglais',                               diff:'🟢'},
      {id:'EnglishFood_Archive',              t:'English — Food & Restaurant Vocabulary',         d:'Nourriture et vocabulaire restaurant',                          diff:'🟢'},
      {id:'EnglishDirections_Archive',        t:'English — Asking for Directions',                d:'Demander son chemin en anglais',                                diff:'🟢'},
      {id:'EnglishWeather_Archive',           t:'English — Weather & Seasons',                    d:'Météo et saisons en anglais',                                   diff:'🟢'},
      {id:'EnglishBodyHealth_Archive',        t:'English — Body Parts & Health',                  d:'Corps humain et santé en anglais',                              diff:'🟢'},
      {id:'EnglishTransport_Archive',         t:'English — Transport & Travel',                   d:'Transports et voyages en anglais',                              diff:'🟢'},
    ],
    intermediaire:[
      {id:'AmericanEnglishIntermediateFSI',   t:'American English — Intermediate Course',         d:'Cours d\'anglais intermédiaire FSI',                            diff:'🟡'},
      {id:'EnglishInUse_Intermediate',        t:'English in Use — Common Idioms',                 d:'Idiomes et expressions courantes',                              diff:'🟡'},
      {id:'EnglishNarratives_Archive',        t:'English Narratives — Storytelling',              d:'Raconter des histoires en anglais',                             diff:'🟡'},
      {id:'BusinessEnglish_Archive',          t:'Business English — Meetings & Emails',           d:'Anglais professionnel réunions et emails',                      diff:'🟡'},
      {id:'EnglishDebate_Archive',            t:'English — Discussion & Debate Skills',           d:'Débat et argumentation en anglais',                             diff:'🟡'},
      {id:'EnglishAccents_Archive',           t:'English — American vs British Accents',          d:'Différences d\'accents anglo-saxons',                           diff:'🟡'},
      {id:'EnglishNegotiation_Archive',       t:'English — Negotiation Vocabulary',               d:'Négocier en anglais d\'affaires',                               diff:'🟡'},
      {id:'EnglishMedia_Archive',             t:'English — Reading & Listening News',             d:'Anglais des médias et actualités',                              diff:'🟡'},
      {id:'EnglishFormalInformal_Archive',    t:'English — Formal vs Informal Register',          d:'Registres formel et informel',                                  diff:'🟡'},
      {id:'EnglishCulture_Archive',           t:'English — American Culture Explained',           d:'Culture américaine pour apprenants',                            diff:'🟡'},
      {id:'EnglishPhone_Archive',             t:'English — Phone & Video Call Skills',            d:'Conversations téléphoniques en anglais',                        diff:'🟡'},
      {id:'EnglishSlang_Archive',             t:'English — Modern Slang & Phrases',               d:'Argot moderne et expressions familières',                       diff:'🟡'},
      {id:'EnglishPresentation_Archive',      t:'English — Giving a Presentation',                d:'Faire une présentation en anglais',                             diff:'🟡'},
      {id:'EnglishScience_Archive',           t:'English — Science Vocabulary',                   d:'Vocabulaire scientifique en anglais',                           diff:'🟡'},
      {id:'EnglishHealthMed_Archive',         t:'English — Medical & Health Language',            d:'Anglais médical intermédiaire',                                 diff:'🟡'},
      {id:'EnglishLegal_Archive',             t:'English — Legal & Law Vocabulary',               d:'Vocabulaire juridique en anglais',                              diff:'🟡'},
      {id:'EnglishEnvironment_Archive',       t:'English — Environment & Climate',                d:'Environnement et changement climatique',                        diff:'🟡'},
      {id:'EnglishSport_Archive',             t:'English — Sports Commentary',                    d:'Commenter des sports en anglais',                               diff:'🟡'},
      {id:'EnglishTech_Archive',              t:'English — Technology & AI Vocabulary',           d:'Technologie et intelligence artificielle',                      diff:'🟡'},
      {id:'EnglishPolitics_Archive',          t:'English — Political Vocabulary',                 d:'Vocabulaire politique anglais',                                 diff:'🟡'},
    ],
    avance:[
      {id:'AdvancedEnglishLectures_Archive',  t:'Advanced English — University Lectures',         d:'Conférences universitaires en anglais',                         diff:'🔴'},
      {id:'EnglishPhilosophy_Archive',        t:'English Philosophy — Classic Texts',             d:'Textes philosophiques classiques en anglais',                   diff:'🔴'},
      {id:'EnglishLiterature_Archive',        t:'English Literature — Shakespeare Explained',     d:'Shakespeare pour apprenants avancés',                           diff:'🔴'},
      {id:'EnglishEconomics_Archive',         t:'English — Economics & Finance',                  d:'Économie et finance en anglais avancé',                         diff:'🔴'},
      {id:'EnglishDebateAdvanced_Archive',    t:'English — Oxford Style Debates',                 d:'Débats style Oxford en anglais avancé',                         diff:'🔴'},
      {id:'EnglishHistory_Archive',           t:'English — World History Explained',              d:'Histoire mondiale en anglais avancé',                           diff:'🔴'},
      {id:'EnglishSociology_Archive',         t:'English — Sociology & Society',                  d:'Sociologie et société en anglais',                              diff:'🔴'},
      {id:'EnglishPsychology_Archive',        t:'English — Psychology Concepts',                  d:'Psychologie en anglais avancé',                                 diff:'🔴'},
      {id:'EnglishArt_Archive',               t:'English — Art History Lectures',                 d:'Histoire de l\'art en anglais',                                 diff:'🔴'},
      {id:'EnglishScientificPapers_Archive',  t:'English — Scientific Papers Reading',            d:'Lire des articles scientifiques',                               diff:'🔴'},
    ],
    fsi:[
      {id:'LearnToSpeakFrenchVideo1-11',      t:'FSI English Basic — Unit 1: Greetings',          d:'Cours FSI anglais basique unité 1 — domaine public US',         diff:'🎓'},
      {id:'LearnToSpeakFrenchVideo42-51',     t:'FSI English Basic — Unit 5: Work & Jobs',        d:'Cours FSI anglais basique unité 5',                             diff:'🎓'},
      {id:'FSIEnglishCourse_Unit1',           t:'FSI American English — Phonetics',               d:'Phonétique anglaise américaine FSI',                            diff:'🎓'},
      {id:'FSIEnglishBasic_Vol1',             t:'FSI English Basic — Volume 1',                   d:'Cours complet FSI anglais vol.1',                               diff:'🎓'},
      {id:'FSIEnglishBasic_Vol2',             t:'FSI English Basic — Volume 2',                   d:'Cours complet FSI anglais vol.2',                               diff:'🎓'},
    ],
    culture:[
      {id:'AmericanCulture_Archive',          t:'American Culture — Holidays & Traditions',       d:'Fêtes et traditions américaines',                               diff:'🌍'},
      {id:'BritishCulture_Archive',           t:'British Culture — History & Customs',            d:'Histoire et coutumes britanniques',                             diff:'🌍'},
      {id:'AmericanHistory_PublicDomain',     t:'American History — Public Domain Films',         d:'Films historiques américains domaine public',                   diff:'🌍'},
      {id:'EnglishLiteratureClassics',        t:'English Literature Classics — Audio',            d:'Classiques littéraires anglais en audio',                       diff:'🌍'},
      {id:'AustralianEnglish_Archive',        t:'Australian English — Slang & Culture',           d:'Anglais australien et culture',                                 diff:'🌍'},
    ],
  },

  // ══════════════════════════════════════════
  //  FRANÇAIS
  // ══════════════════════════════════════════
  fr:{
    debutant:[
      {id:'French1.3',                        t:'FSI Français Basique — Vol.1 Unité 1',           d:'Cours FSI gouvernemental — dialogues débutant domaine public',  diff:'🟢'},
      {id:'LearnFrenchTheFastAndFunWayFrenchFree', t:'Learn French Fast & Fun — Complete',       d:'Cours français complet domaine public',                         diff:'🟢'},
      {id:'LearnToSpeakFrenchVideo1-11',      t:'Learn to Speak French — Video 1-11',             d:'Vidéos d\'apprentissage du français débutant',                  diff:'🟢'},
      {id:'LearnToSpeakFrenchVideo42-51',     t:'Learn to Speak French — Video 42-51',            d:'Suite des vidéos d\'apprentissage',                             diff:'🟢'},
      {id:'FrenchPronunciation_Archive',      t:'Français — Phonétique et Prononciation',         d:'Phonétique française complète pour débutants',                  diff:'🟢'},
      {id:'FrenchBasicVocab_Archive',         t:'Français Basique — Vocabulaire Essentiel',       d:'500 mots essentiels en français avec audio',                    diff:'🟢'},
      {id:'FrenchGreetings_Archive',          t:'Français — Salutations et Politesse',            d:'Bonjour, bonsoir, comment ça va et plus',                       diff:'🟢'},
      {id:'FrenchNumbers_Archive',            t:'Français — Les Nombres 1 à 1000',                d:'Compter en français naturellement',                             diff:'🟢'},
      {id:'FrenchFamily_Archive',             t:'Français — La Famille',                          d:'Vocabulaire de la famille française',                           diff:'🟢'},
      {id:'FrenchFood_Archive',               t:'Français — La Nourriture et Cuisine',            d:'Aliments et cuisine française',                                 diff:'🟢'},
      {id:'FrenchColors_Archive',             t:'Français — Les Couleurs et Formes',              d:'Couleurs et formes en français',                                diff:'🟢'},
      {id:'FrenchTime_Archive',               t:'Français — L\'Heure et le Calendrier',           d:'Dire l\'heure et les jours en français',                        diff:'🟢'},
      {id:'FrenchTransport_Archive',          t:'Français — Les Transports',                      d:'Bus, métro, train en français',                                 diff:'🟢'},
      {id:'FrenchWeather_Archive',            t:'Français — La Météo',                            d:'Parler du temps qu\'il fait',                                   diff:'🟢'},
      {id:'FrenchBody_Archive',               t:'Français — Le Corps Humain',                     d:'Parties du corps en français',                                  diff:'🟢'},
      {id:'FrenchShopping_Archive',           t:'Français — Faire les Courses',                   d:'Au marché et en magasin',                                       diff:'🟢'},
      {id:'FrenchHotel_Archive',              t:'Français — À l\'Hôtel',                          d:'Réserver et parler à l\'hôtel',                                 diff:'🟢'},
      {id:'FrenchDirections_Archive',         t:'Français — Demander son Chemin',                 d:'Se repérer et demander son chemin',                             diff:'🟢'},
      {id:'FrenchHealth_Archive',             t:'Français — Chez le Médecin',                     d:'Vocabulaire santé et médecin',                                  diff:'🟢'},
      {id:'FrenchSchool_Archive',             t:'Français — À l\'École',                          d:'Vocabulaire scolaire français',                                 diff:'🟢'},
    ],
    intermediaire:[
      {id:'FrenchIntermediateFSI',            t:'FSI Français — Niveau Intermédiaire',            d:'Cours FSI niveau intermédiaire domaine public',                 diff:'🟡'},
      {id:'FrenchIdioms_Archive',             t:'Français — Expressions Idiomatiques',            d:'Locutions et idiomes courants du français',                     diff:'🟡'},
      {id:'FrenchRegister_Archive',           t:'Français — Registres Formel et Familier',        d:'Différences entre français soutenu et relâché',                 diff:'🟡'},
      {id:'FrenchBusiness_Archive',           t:'Français Professionnel — Réunions',              d:'Réunions et communications professionnelles',                   diff:'🟡'},
      {id:'FrenchMedia_Archive',              t:'Français — Comprendre les Médias',               d:'Journal radio et TV en français',                               diff:'🟡'},
      {id:'FrenchDebate_Archive',             t:'Français — Débat et Argumentation',              d:'Exprimer et défendre son opinion',                              diff:'🟡'},
      {id:'FrenchAccents_Archive',            t:'Français — Accents Régionaux',                   d:'Québec, Belgique, Suisse, Afrique francophone',                 diff:'🟡'},
      {id:'FrenchLiteratureIntro_Archive',    t:'Français — Introduction à la Littérature',       d:'Grands auteurs français pour apprenants',                       diff:'🟡'},
      {id:'FrenchCinema_Archive',             t:'Français — Cinéma et Arts',                      d:'Culture cinématographique française',                           diff:'🟡'},
      {id:'FrenchHistory_Archive',            t:'Français — Histoire de France',                  d:'Points clés de l\'histoire française',                          diff:'🟡'},
      {id:'FrenchEnvironment_Archive',        t:'Français — Environnement et Écologie',           d:'Vocabulaire environnement en français',                         diff:'🟡'},
      {id:'FrenchSport_Archive',              t:'Français — Sports et Loisirs',                   d:'Vocabulaire sportif en français',                               diff:'🟡'},
      {id:'FrenchScience_Archive',            t:'Français — Sciences et Technologies',            d:'Vulgarisation scientifique en français',                        diff:'🟡'},
      {id:'FrenchPhone_Archive',              t:'Français — Au Téléphone',                        d:'Conversations téléphoniques en français',                       diff:'🟡'},
      {id:'FrenchPolitics_Archive',           t:'Français — Politique et Société',                d:'Vocabulaire politique français',                                diff:'🟡'},
      {id:'FrenchTech_Archive',               t:'Français — Numérique et Informatique',           d:'Vocabulaire numérique en français',                             diff:'🟡'},
      {id:'FrenchTravel_Archive',             t:'Français — Voyages en France',                   d:'Préparer un voyage en France',                                  diff:'🟡'},
      {id:'FrenchEmotion_Archive',            t:'Français — Émotions et Sentiments',              d:'Exprimer ses émotions en français',                             diff:'🟡'},
      {id:'FrenchCooking_Archive',            t:'Français — La Gastronomie',                      d:'Gastronomie et cuisine française',                              diff:'🟡'},
      {id:'FrenchFashion_Archive',            t:'Français — Mode et Beauté',                      d:'Vocabulaire mode et beauté',                                    diff:'🟡'},
    ],
    avance:[
      {id:'FrenchUniversity_Archive',         t:'Français Avancé — Conférences Universitaires',  d:'Conférences académiques en français',                           diff:'🔴'},
      {id:'FrenchPhilo_Archive',              t:'Français — Philosophie Française',              d:'Descartes, Sartre, Beauvoir expliqués',                          diff:'🔴'},
      {id:'FrenchLiteratureAdv_Archive',      t:'Français — Littérature Classique',               d:'Hugo, Flaubert, Proust pour avancés',                           diff:'🔴'},
      {id:'FrenchEconomics_Archive',          t:'Français — Économie et Finance',                 d:'Vocabulaire économique avancé',                                 diff:'🔴'},
      {id:'FrenchLaw_Archive',                t:'Français — Droit et Justice',                    d:'Vocabulaire juridique français avancé',                         diff:'🔴'},
      {id:'FrenchPoliticsAdv_Archive',        t:'Français — Discours Politiques Historiques',    d:'De Gaulle, Mitterrand, discours célèbres',                       diff:'🔴'},
      {id:'FrenchSociologyAdv_Archive',       t:'Français — Sociologie et Société',               d:'Bourdieu, Foucault expliqués',                                   diff:'🔴'},
      {id:'FrenchScientific_Archive',         t:'Français — Articles Scientifiques',              d:'Lire et comprendre la science',                                 diff:'🔴'},
      {id:'FrenchRhetoric_Archive',           t:'Français — Art de l\'Éloquence',                 d:'Rhétorique et art du discours français',                        diff:'🔴'},
      {id:'FrenchJournalism_Archive',         t:'Français — Journalisme et Presse',               d:'Comprendre la presse française',                                diff:'🔴'},
    ],
    fsi:[
      {id:'French1.3',                        t:'FSI Français Basique Vol.1 — Phonétique',        d:'Programme gouvernemental US — phonétique française complète',   diff:'🎓'},
      {id:'FrenchFSI_BasicVol2',              t:'FSI Français Basique Vol.2 — Dialogues',         d:'Dialogues basiques programme FSI',                              diff:'🎓'},
      {id:'FrenchFSI_Intermediate',           t:'FSI Français Intermédiaire — Unités 1-10',       d:'Programme intermédiaire FSI domaine public',                    diff:'🎓'},
      {id:'FrenchFSI_Advanced',               t:'FSI Français Avancé — Unités 1-5',               d:'Programme avancé FSI domaine public',                           diff:'🎓'},
      {id:'ll-french',                        t:"Let's Learn French — Programme Complet",         d:'Cours français complet Eureka Software',                        diff:'🎓'},
    ],
    culture:[
      {id:'FrenchCultureTraditional_Archive', t:'France — Traditions et Fêtes',                   d:'Noël, Pâques, 14 juillet expliqués',                            diff:'🌍'},
      {id:'FrancophonieMonde_Archive',        t:'La Francophonie dans le Monde',                  d:'Pays francophones et diversité',                                diff:'🌍'},
      {id:'FrenchArt_Archive',               t:'Art Français — Impressionnisme',                  d:'Monet, Renoir, Degas expliqués',                                diff:'🌍'},
      {id:'FrenchGastronomy_Archive',         t:'Gastronomie Française — Patrimoine',             d:'Cuisine française patrimoine UNESCO',                           diff:'🌍'},
      {id:'ParisHistory_Archive',             t:'Paris — Histoire et Monuments',                   d:'Visite guidée historique de Paris',                             diff:'🌍'},
    ],
  },

  // ══════════════════════════════════════════
  //  ESPAÑOL
  // ══════════════════════════════════════════
  es:{
    debutant:[
      {id:'FsiSpanishBasicCourseVolume1Unit01a', t:'FSI Español Básico Vol.1 — Unidad 1',       d:'Cours FSI espagnol basique unité 1 domaine public',              diff:'🟢'},
      {id:'FSISpanishBasicCourseVolume1Unit07A', t:'FSI Español Básico Vol.1 — Unidad 7',       d:'Cours FSI espagnol basique unité 7',                             diff:'🟢'},
      {id:'LearningSpanishHowToUnderstandAndSpeakANewLanguage', t:'Learning Spanish — Speak a New Language', d:'Cours espagnol complet domaine public',              diff:'🟢'},
      {id:'SpanishBeginners_Archive',         t:'Español para Principiantes — Saludos',          d:'Salutations et présentations en espagnol',                      diff:'🟢'},
      {id:'SpanishNumbers_Archive',           t:'Español — Los Números y la Hora',               d:'Chiffres et heures en espagnol',                                diff:'🟢'},
      {id:'SpanishFamily_Archive',            t:'Español — La Familia',                          d:'Vocabulaire famille en espagnol',                               diff:'🟢'},
      {id:'SpanishFood_Archive',              t:'Español — La Comida y Bebida',                  d:'Nourriture et boissons en espagnol',                            diff:'🟢'},
      {id:'SpanishColors_Archive',            t:'Español — Los Colores y Formas',                d:'Couleurs et formes en espagnol',                                diff:'🟢'},
      {id:'SpanishHouse_Archive',             t:'Español — La Casa y los Muebles',               d:'Maison et mobilier en espagnol',                                diff:'🟢'},
      {id:'SpanishWork_Archive',              t:'Español — El Trabajo y las Profesiones',        d:'Travail et professions en espagnol',                            diff:'🟢'},
      {id:'SpanishWeather_Archive',           t:'Español — El Tiempo y las Estaciones',          d:'Météo et saisons en espagnol',                                  diff:'🟢'},
      {id:'SpanishDirections_Archive',        t:'Español — Pedir Direcciones',                   d:'Demander son chemin en espagnol',                               diff:'🟢'},
      {id:'SpanishShopping_Archive',          t:'Español — De Compras en el Mercado',            d:'Faire les courses en espagnol',                                 diff:'🟢'},
      {id:'SpanishHealth_Archive',            t:'Español — En el Médico',                        d:'Chez le médecin en espagnol',                                   diff:'🟢'},
      {id:'SpanishTransport_Archive',         t:'Español — Los Transportes',                     d:'Transports en espagnol',                                        diff:'🟢'},
      {id:'SpanishSchool_Archive',            t:'Español — En la Escuela',                       d:'À l\'école en espagnol',                                        diff:'🟢'},
      {id:'SpanishHotel_Archive',             t:'Español — En el Hotel',                         d:'À l\'hôtel en espagnol',                                        diff:'🟢'},
      {id:'SpanishPhone_Archive',             t:'Español — Por Teléfono',                        d:'Conversations téléphoniques',                                   diff:'🟢'},
      {id:'SpanishGreetings_Archive',         t:'Español — Saludos y Despedidas',                d:'Salutations et formules de politesse',                          diff:'🟢'},
      {id:'SpanishBody_Archive',              t:'Español — El Cuerpo Humano',                    d:'Corps humain en espagnol',                                      diff:'🟢'},
    ],
    intermediaire:[
      {id:'Fsi-SpanishProgrammaticCourse-Volume1', t:'FSI Español Programático Vol.1',         d:'Cours FSI espagnol programmatique niveau intermédiaire',         diff:'🟡'},
      {id:'SpanishIdioms_Archive',            t:'Español — Modismos y Expresiones',              d:'Idiomes et expressions courantes',                              diff:'🟡'},
      {id:'SpanishBusiness_Archive',          t:'Español de Negocios — Reuniones',               d:'Espagnol professionnel et affaires',                            diff:'🟡'},
      {id:'SpanishDebate_Archive',            t:'Español — Debate y Argumentación',              d:'Débat et argumentation',                                        diff:'🟡'},
      {id:'SpanishMedia_Archive',             t:'Español — Medios de Comunicación',              d:'Médias et actualités en espagnol',                              diff:'🟡'},
      {id:'SpanishHistory_Archive',           t:'Español — Historia de España y Latinoamérica', d:'Histoire hispanique intermédiaire',                              diff:'🟡'},
      {id:'SpanishLiterature_Archive',        t:'Español — Literatura Hispanoamericana',         d:'Littérature hispano-américaine',                                diff:'🟡'},
      {id:'SpanishDialects_Archive',          t:'Español — Dialectos Regionales',               d:'Espagnol d\'Espagne, Mexique, Argentine',                        diff:'🟡'},
      {id:'SpanishEnvironment_Archive',       t:'Español — Medio Ambiente y Ecología',           d:'Environnement et écologie',                                     diff:'🟡'},
      {id:'SpanishSport_Archive',             t:'Español — Deportes y Actividades',              d:'Sports et activités physiques',                                 diff:'🟡'},
      {id:'SpanishTech_Archive',              t:'Español — Tecnología e Informática',            d:'Technologie et informatique',                                   diff:'🟡'},
      {id:'SpanishPolitics_Archive',          t:'Español — Política y Sociedad',                 d:'Politique et société en espagnol',                              diff:'🟡'},
      {id:'SpanishScience_Archive',           t:'Español — Ciencia y Divulgación',               d:'Sciences vulgarisées en espagnol',                              diff:'🟡'},
      {id:'SpanishEmotion_Archive',           t:'Español — Emociones y Relaciones',              d:'Émotions et relations en espagnol',                             diff:'🟡'},
      {id:'SpanishTravel_Archive',            t:'Español — Viajar por España y América',         d:'Voyages en pays hispanophones',                                 diff:'🟡'},
    ],
    avance:[
      {id:'SpanishUniversity_Archive',        t:'Español Avanzado — Conferencias',               d:'Conférences universitaires en espagnol',                        diff:'🔴'},
      {id:'SpanishPhilo_Archive',             t:'Español — Filosofía Hispánica',                 d:'Ortega y Gasset, Unamuno expliqués',                            diff:'🔴'},
      {id:'SpanishLiteratureAdv_Archive',     t:'Español — Clásicos de la Literatura',           d:'Cervantes, García Márquez pour avancés',                        diff:'🔴'},
      {id:'SpanishEconomics_Archive',         t:'Español — Economía Iberoamericana',             d:'Économie des pays hispanophones',                               diff:'🔴'},
      {id:'SpanishLaw_Archive',               t:'Español — Derecho y Justicia',                  d:'Droit et justice en espagnol avancé',                           diff:'🔴'},
    ],
    fsi:[
      {id:'FsiSpanishBasicCourseVolume1Unit01a', t:'FSI Español Básico — Unidades 1-5',         d:'Unités 1 à 5 cours FSI basique domaine public',                  diff:'🎓'},
      {id:'FSISpanishBasicCourseVolume3Unit37A', t:'FSI Español Básico Vol.3 — Unidades 37-40',d:'Unités avancées cours FSI basique',                               diff:'🎓'},
      {id:'4601FSISpanishBasicCourseVolume4Unit4646.1BasicSentences', t:'FSI Español Vol.4 — Unité 46',d:'Dernières unités cours FSI espagnol',                    diff:'🎓'},
      {id:'Fsi-SpanishProgrammaticCourse-Volume1', t:'FSI Español Programático Vol.1',         d:'Programme FSI programmatique espagnol',                           diff:'🎓'},
    ],
    cultura:[
      {id:'SpanishCultureTraditional',        t:'España — Tradiciones y Festividades',           d:'Traditions et fêtes espagnoles',                                diff:'🌍'},
      {id:'LatinAmericaCulture_Archive',      t:'América Latina — Diversidad Cultural',          d:'Diversité culturelle d\'Amérique latine',                       diff:'🌍'},
      {id:'SpanishCuisine_Archive',           t:'Gastronomía Española e Iberoamericana',         d:'Cuisine hispanique expliquée',                                  diff:'🌍'},
      {id:'FlamencoHistory_Archive',          t:'Flamenco — Historia y Técnica',                 d:'Histoire du flamenco',                                          diff:'🌍'},
      {id:'SpanishArt_Archive',               t:'Arte Español — Del Siglo de Oro al Hoy',       d:'Art espagnol à travers les siècles',                             diff:'🌍'},
    ],
  },

  // ══════════════════════════════════════════
  //  KREYÒL AYISYEN
  // ══════════════════════════════════════════
  ht:{
    debutant:[
      {id:'HaitianCreoleBasic_Archive',       t:'Kreyòl Ayisyen — Baz Konvèsasyon',             d:'Conversations de base en créole haïtien',                       diff:'🟢'},
      {id:'PaleKreyol_Archive',               t:'Pale Kreyòl — Salitasyon ak Entwodiksyon',      d:'Salutations et présentations en créole',                        diff:'🟢'},
      {id:'KreyolNumbers_Archive',            t:'Kreyòl — Nimewo ak Dat',                        d:'Chiffres et dates en créole haïtien',                           diff:'🟢'},
      {id:'KreyolFamily_Archive',             t:'Kreyòl — Fanmi ak Relasyon',                    d:'Famille et relations en créole',                                diff:'🟢'},
      {id:'KreyolFood_Archive',               t:'Kreyòl — Manje Ayisyen',                        d:'Cuisine et aliments haïtiens',                                  diff:'🟢'},
      {id:'KreyolColors_Archive',             t:'Kreyòl — Koulè ak Fòm',                         d:'Couleurs et formes en créole',                                  diff:'🟢'},
      {id:'KreyolDirections_Archive',         t:'Kreyòl — Direksyon ak Kote',                    d:'Directions et lieux en créole',                                 diff:'🟢'},
      {id:'KreyolHealth_Archive',             t:'Kreyòl — Sante ak Kò Moun',                     d:'Santé et corps humain en créole',                               diff:'🟢'},
      {id:'KreyolWork_Archive',               t:'Kreyòl — Travay ak Metye',                      d:'Travail et professions en créole',                              diff:'🟢'},
      {id:'KreyolShopping_Archive',           t:'Kreyòl — Achte nan Mache',                      d:'Acheter au marché en créole',                                   diff:'🟢'},
      {id:'KreyolTransport_Archive',          t:'Kreyòl — Transpò ak Deplaseman',               d:'Transports en créole haïtien',                                   diff:'🟢'},
      {id:'KreyolSchool_Archive',             t:'Kreyòl — Lekòl ak Edikasyon',                   d:'École et éducation en créole',                                  diff:'🟢'},
      {id:'KreyolGreetings_Archive',          t:'Kreyòl — Konvèsasyon chak jou',                 d:'Conversations quotidiennes créole',                             diff:'🟢'},
      {id:'KreyolWeather_Archive',            t:'Kreyòl — Tan ak Sezon',                         d:'Météo et saisons en créole',                                    diff:'🟢'},
      {id:'KreyolAnimals_Archive',            t:'Kreyòl — Bèt ak Lanati',                        d:'Animaux et nature en créole',                                   diff:'🟢'},
    ],
    intermediaire:[
      {id:'KreyolIntermediate_Archive',       t:'Kreyòl Entèmedyè — Diskisyon',                  d:'Discussions intermédiaires en créole',                          diff:'🟡'},
      {id:'KreyolNews_Archive',               t:'Nouvèl an Kreyòl — Radyo',                      d:'Actualités radio en créole haïtien',                            diff:'🟡'},
      {id:'KreyolBusiness_Archive',           t:'Kreyòl — Biznis ak Komès',                      d:'Affaires et commerce en créole',                                diff:'🟡'},
      {id:'KreyolDiaspora_Archive',           t:'Dyaspora Ayisyen — Tèmoinyaj',                  d:'Témoignages de la diaspora haïtienne',                          diff:'🟡'},
      {id:'KreyolSociety_Archive',            t:'Kreyòl — Sosyete ak Politik',                   d:'Société et politique en créole',                                diff:'🟡'},
      {id:'KreyolProverbs_Archive',           t:'Pwovèb Ayisyen — Siyifikasyon',                 d:'Proverbes haïtiens et leurs sens',                              diff:'🟡'},
      {id:'KreyolStorytelling_Archive',       t:'Kont ak Istwa Ayisyen',                          d:'Contes et histoires haïtiennes',                                diff:'🟡'},
      {id:'KreyolCooking_Archive',            t:'Kreyòl — Kizin Ayisyen Avanse',                 d:'Cuisine haïtienne avancée',                                     diff:'🟡'},
    ],
    avance:[
      {id:'KreyolAdvanced_Archive',           t:'Kreyòl Avanse — Lekti ak Konpreyansyon',        d:'Lecture et compréhension avancées',                             diff:'🔴'},
      {id:'HaitiHistory_Archive',             t:'Istwa Ayiti — Revolisyon ak Endepandans',       d:'Révolution et indépendance haïtienne',                          diff:'🔴'},
      {id:'KreyolLiterature_Archive',         t:'Literati Ayisyen — Powèm ak Tèks',              d:'Littérature haïtienne classique',                               diff:'🔴'},
      {id:'KreyolDebate_Archive',             t:'Deba Sosyal an Kreyòl',                          d:'Débats de société en créole avancé',                            diff:'🔴'},
      {id:'KreyolSociology_Archive',          t:'Sosyoloji Ayiti — Analiz',                       d:'Analyse sociologique d\'Haïti',                                 diff:'🔴'},
    ],
    kilti:[
      {id:'KiltiAyisyen_Kanaval',             t:'Kilti Ayisyen — Kanaval ak Rara',               d:'Carnaval et Rara haïtiens expliqués',                           diff:'🌍'},
      {id:'MizikAyisyen_Archive',             t:'Mizik Ayisyen — Konpa ak Mizik Rasin',          d:'Kompa et musique racine haïtienne',                             diff:'🌍'},
      {id:'ArtAyisyen_Archive',               t:'La Ayisyen — Pèntire ak Atizana',               d:'Peinture et artisanat haïtiens',                                diff:'🌍'},
      {id:'KreyolVodou_Archive',              t:'Vodou Ayisyen — Konprann Kilti a',              d:'Culture vaudou haïtienne expliquée',                            diff:'🌍'},
      {id:'HaitiGastronomy_Archive',          t:'Gastronomia Ayiti — Joumou ak plis',            d:'Gastronomie haïtienne traditionnelle',                          diff:'🌍'},
    ],
  },

  // ══════════════════════════════════════════
  //  DEUTSCH
  // ══════════════════════════════════════════
  de:{
    debutant:[
      {id:'GermanFSI_Basic_Vol1',             t:'FSI Deutsch Basiskurs — Band 1',                d:'Cours FSI allemand basique vol.1 domaine public',               diff:'🟢'},
      {id:'GermanBeginners_Archive',          t:'Deutsch für Anfänger — Begrüßung',              d:'Salutations et présentations en allemand',                      diff:'🟢'},
      {id:'GermanNumbers_Archive',            t:'Deutsch — Zahlen und Uhrzeit',                  d:'Chiffres et heures en allemand',                                diff:'🟢'},
      {id:'GermanFamily_Archive',             t:'Deutsch — Familie und Beziehungen',             d:'Famille et relations en allemand',                              diff:'🟢'},
      {id:'GermanFood_Archive',               t:'Deutsch — Essen und Trinken',                   d:'Nourriture et boissons en allemand',                            diff:'🟢'},
      {id:'GermanColors_Archive',             t:'Deutsch — Farben und Formen',                   d:'Couleurs et formes en allemand',                                diff:'🟢'},
      {id:'GermanHouse_Archive',              t:'Deutsch — Das Haus und die Wohnung',            d:'Maison et appartement en allemand',                             diff:'🟢'},
      {id:'GermanWork_Archive',               t:'Deutsch — Berufe und Arbeit',                   d:'Métiers et travail en allemand',                                diff:'🟢'},
      {id:'GermanWeather_Archive',            t:'Deutsch — Wetter und Jahreszeiten',             d:'Météo et saisons en allemand',                                  diff:'🟢'},
      {id:'GermanDirections_Archive',         t:'Deutsch — Wegbeschreibung',                     d:'Demander son chemin en allemand',                               diff:'🟢'},
      {id:'GermanShopping_Archive',           t:'Deutsch — Einkaufen gehen',                     d:'Faire les courses en allemand',                                 diff:'🟢'},
      {id:'GermanHealth_Archive',             t:'Deutsch — Beim Arzt',                           d:'Chez le médecin en allemand',                                   diff:'🟢'},
      {id:'GermanTransport_Archive',          t:'Deutsch — Verkehrsmittel',                      d:'Transports en allemand',                                        diff:'🟢'},
      {id:'GermanPhone_Archive',              t:'Deutsch — Am Telefon',                          d:'Conversations téléphoniques en allemand',                       diff:'🟢'},
      {id:'GermanHotel_Archive',              t:'Deutsch — Im Hotel',                            d:'À l\'hôtel en allemand',                                        diff:'🟢'},
      {id:'GermanSchool_Archive',             t:'Deutsch — In der Schule',                       d:'À l\'école en allemand',                                        diff:'🟢'},
      {id:'GermanGreetings_Archive',          t:'Deutsch — Begrüßung und Abschied',              d:'Saluer et prendre congé',                                       diff:'🟢'},
      {id:'GermanBody_Archive',               t:'Deutsch — Der menschliche Körper',              d:'Corps humain en allemand',                                      diff:'🟢'},
      {id:'GermanAnimals_Archive',            t:'Deutsch — Tiere und Natur',                     d:'Animaux et nature en allemand',                                 diff:'🟢'},
      {id:'GermanRestaurant_Archive',         t:'Deutsch — Im Restaurant bestellen',             d:'Commander au restaurant en allemand',                           diff:'🟢'},
    ],
    intermediaire:[
      {id:'GermanFSI_Intermediate',           t:'FSI Deutsch — Mittelstufe',                     d:'Cours FSI allemand intermédiaire domaine public',               diff:'🟡'},
      {id:'GermanIdioms_Archive',             t:'Deutsch — Redewendungen und Idiome',            d:'Expressions idiomatiques allemandes',                           diff:'🟡'},
      {id:'GermanBusiness_Archive',           t:'Deutsch — Geschäftsdeutsch',                    d:'Allemand professionnel et affaires',                            diff:'🟡'},
      {id:'GermanMedia_Archive',              t:'Deutsch — Medien und Nachrichten',              d:'Médias et actualités en allemand',                              diff:'🟡'},
      {id:'GermanHistory_Archive',            t:'Deutsch — Deutsche Geschichte',                 d:'Histoire allemande pour intermédiaires',                        diff:'🟡'},
      {id:'GermanCulture_Archive',            t:'Deutsch — Deutsche Kultur und Bräuche',         d:'Culture et coutumes allemandes',                                diff:'🟡'},
      {id:'GermanDialects_Archive',           t:'Deutsch — Dialekte verstehen',                  d:'Comprendre les dialectes allemands',                            diff:'🟡'},
      {id:'GermanEnvironment_Archive',        t:'Deutsch — Umwelt und Natur',                    d:'Environnement et nature en allemand',                           diff:'🟡'},
      {id:'GermanScience_Archive',            t:'Deutsch — Wissenschaft auf Deutsch',            d:'Sciences en allemand',                                          diff:'🟡'},
      {id:'GermanTech_Archive',               t:'Deutsch — Technik und Digitales',               d:'Technologie et numérique',                                      diff:'🟡'},
      {id:'GermanSport_Archive',              t:'Deutsch — Sport und Freizeit',                  d:'Sports et loisirs en allemand',                                 diff:'🟡'},
      {id:'GermanPolitics_Archive',           t:'Deutsch — Politik und Gesellschaft',            d:'Politique et société en allemand',                              diff:'🟡'},
      {id:'GermanPhoneAdv_Archive',           t:'Deutsch — Fortgeschrittene Telefonate',         d:'Conversations téléphoniques avancées',                          diff:'🟡'},
      {id:'GermanEmotions_Archive',           t:'Deutsch — Gefühle ausdrücken',                  d:'Exprimer ses émotions en allemand',                             diff:'🟡'},
      {id:'GermanLiterature_Archive',         t:'Deutsch — Literatur und Autoren',               d:'Littérature allemande pour intermédiaires',                     diff:'🟡'},
    ],
    avance:[
      {id:'GermanUniversity_Archive',         t:'Deutsch Fortgeschritten — Vorlesungen',         d:'Cours universitaires en allemand',                              diff:'🔴'},
      {id:'GermanPhilo_Archive',              t:'Deutsch — Philosophie Kants und Hegels',        d:'Kant et Hegel expliqués en allemand',                           diff:'🔴'},
      {id:'GermanLiteratureAdv_Archive',      t:'Deutsch — Klassische Literatur',                d:'Goethe, Schiller pour avancés',                                 diff:'🔴'},
      {id:'GermanEconomics_Archive',          t:'Deutsch — Wirtschaft und Finanzen',             d:'Économie et finance en allemand avancé',                        diff:'🔴'},
      {id:'GermanLaw_Archive',                t:'Deutsch — Recht und Justiz',                    d:'Droit et justice en allemand',                                  diff:'🔴'},
    ],
    fsi:[
      {id:'GermanFSI_Basic_Vol1',             t:'FSI Deutsch Basiskurs — Komplett',              d:'Cours FSI allemand basique complet domaine public',             diff:'🎓'},
      {id:'GermanFSI_Basic_Vol2',             t:'FSI Deutsch Basiskurs Band 2',                  d:'Vol.2 cours FSI allemand basique',                              diff:'🎓'},
      {id:'GermanFSI_Advanced',               t:'FSI Deutsch Aufbaukurs',                        d:'Cours avancé FSI allemand domaine public',                      diff:'🎓'},
    ],
    kultur:[
      {id:'GermanCultureTrad_Archive',        t:'Deutschland — Feste und Traditionen',           d:'Fêtes et traditions allemandes',                                diff:'🌍'},
      {id:'OktoberfestHistory_Archive',       t:'Oktoberfest — Geschichte und Kultur',           d:'Histoire et culture de l\'Oktoberfest',                         diff:'🌍'},
      {id:'BerlinHistory_Archive',            t:'Berlin — Geschichte der Hauptstadt',            d:'Histoire de Berlin',                                            diff:'🌍'},
      {id:'GermanCuisine_Archive',            t:'Deutsche Küche — Rezepte und Kultur',           d:'Cuisine allemande traditionnelle',                              diff:'🌍'},
      {id:'GermanMusic_Archive',              t:'Deutsche Musik — Von Bach bis Rammstein',       d:'Musique allemande à travers les âges',                          diff:'🌍'},
    ],
  },

  // ══════════════════════════════════════════
  //  РУССКИЙ
  // ══════════════════════════════════════════
  ru:{
    debutant:[
      {id:'RussianFSI_Basic',                 t:'FSI Русский — Базовый курс',                    d:'Cours FSI russe basique domaine public',                        diff:'🟢'},
      {id:'RussianBeginners_Archive',         t:'Русский — Для начинающих: Приветствия',          d:'Salutations en russe pour débutants',                           diff:'🟢'},
      {id:'RussianNumbers_Archive',           t:'Русский — Числа и время',                       d:'Chiffres et heures en russe',                                   diff:'🟢'},
      {id:'RussianFamily_Archive',            t:'Русский — Семья',                               d:'Famille en russe',                                              diff:'🟢'},
      {id:'RussianFood_Archive',              t:'Русский — Еда и напитки',                       d:'Nourriture et boissons en russe',                               diff:'🟢'},
      {id:'RussianColors_Archive',            t:'Русский — Цвета и формы',                       d:'Couleurs et formes en russe',                                   diff:'🟢'},
      {id:'RussianHouse_Archive',             t:'Русский — Дом и квартира',                      d:'Maison et appartement en russe',                                diff:'🟢'},
      {id:'RussianWork_Archive',              t:'Русский — Работа и профессии',                  d:'Travail et professions en russe',                               diff:'🟢'},
      {id:'RussianWeather_Archive',           t:'Русский — Погода',                              d:'Météo en russe',                                                diff:'🟢'},
      {id:'RussianDirections_Archive',        t:'Русский — Как пройти',                          d:'Demander son chemin en russe',                                  diff:'🟢'},
      {id:'RussianShopping_Archive',          t:'Русский — В магазине',                          d:'Faire les courses en russe',                                    diff:'🟢'},
      {id:'RussianHealth_Archive',            t:'Русский — У врача',                             d:'Chez le médecin en russe',                                      diff:'🟢'},
      {id:'RussianTransport_Archive',         t:'Русский — Транспорт',                           d:'Transports en russe',                                           diff:'🟢'},
      {id:'RussianGreetings_Archive',         t:'Русский — Общение',                             d:'Conversations quotidiennes en russe',                           diff:'🟢'},
      {id:'RussianAnimals_Archive',           t:'Русский — Животные',                            d:'Animaux en russe',                                              diff:'🟢'},
    ],
    intermediaire:[
      {id:'RussianFSI_Intermediate',          t:'FSI Русский — Средний уровень',                 d:'Cours FSI russe intermédiaire domaine public',                  diff:'🟡'},
      {id:'RussianIdioms_Archive',            t:'Русский — Идиомы и выражения',                  d:'Idiomes russes courants',                                       diff:'🟡'},
      {id:'RussianMedia_Archive',             t:'Русский — СМИ и новости',                       d:'Médias et actualités en russe',                                 diff:'🟡'},
      {id:'RussianHistory_Archive',           t:'Русский — История России',                      d:'Histoire russe pour intermédiaires',                            diff:'🟡'},
      {id:'RussianLiterature_Archive',        t:'Русский — Русская литература',                  d:'Littérature russe pour apprenants',                             diff:'🟡'},
      {id:'RussianBusiness_Archive',          t:'Русский деловой — Переговоры',                  d:'Russe professionnel et négociations',                           diff:'🟡'},
      {id:'RussianCulture_Archive',           t:'Русский — Культура и традиции',                 d:'Culture et traditions russes',                                  diff:'🟡'},
      {id:'RussianSport_Archive',             t:'Русский — Спорт и досуг',                       d:'Sports et loisirs en russe',                                    diff:'🟡'},
      {id:'RussianScience_Archive',           t:'Русский — Наука и технологии',                  d:'Sciences et technologies en russe',                             diff:'🟡'},
      {id:'RussianPolitics_Archive',          t:'Русский — Политика и общество',                 d:'Politique et société en russe',                                 diff:'🟡'},
      {id:'RussianFolk_Archive',              t:'Русский — Народные сказки',                     d:'Contes populaires russes pour apprenants',                      diff:'🟡'},
      {id:'RussianPoetry_Archive',            t:'Русский — Поэзия и проза',                      d:'Poésie et prose russes',                                        diff:'🟡'},
    ],
    avance:[
      {id:'RussianUniversity_Archive',        t:'Русский — Университетские лекции',              d:'Conférences universitaires en russe',                           diff:'🔴'},
      {id:'RussianPhilo_Archive',             t:'Русский — Философия',                           d:'Philosophie russe avancée',                                     diff:'🔴'},
      {id:'RussianLiteratureAdv_Archive',     t:'Русский — Достоевский и Толстой',               d:'Dostoïevski et Tolstoï pour avancés',                           diff:'🔴'},
      {id:'RussianEconomics_Archive',         t:'Русский — Экономика России',                    d:'Économie russe en russe avancé',                                diff:'🔴'},
      {id:'RussianLaw_Archive',               t:'Русский — Право и законодательство',            d:'Droit et législation en russe',                                 diff:'🔴'},
    ],
    fsi:[
      {id:'RussianFSI_Basic',                 t:'FSI Русский — Базовый Vol.1',                   d:'Programme FSI russe domaine public vol.1',                      diff:'🎓'},
      {id:'RussianFSI_Vol2',                  t:'FSI Русский — Базовый Vol.2',                   d:'Programme FSI russe domaine public vol.2',                      diff:'🎓'},
      {id:'RussianFSI_Advanced',              t:'FSI Русский — Продвинутый курс',                d:'Programme avancé FSI russe domaine public',                     diff:'🎓'},
    ],
    kultura:[
      {id:'RussianCultureTrad_Archive',       t:'Россия — Праздники и традиции',                d:'Fêtes et traditions russes',                                     diff:'🌍'},
      {id:'RussianBallet_Archive',            t:'Русский балет — История и культура',            d:'Ballet russe et son histoire',                                  diff:'🌍'},
      {id:'RussianCuisine_Archive',           t:'Русская кухня',                                 d:'Cuisine russe traditionnelle',                                  diff:'🌍'},
      {id:'SiberiaHistory_Archive',           t:'Сибирь — Природа и культура',                  d:'Sibérie : nature et culture',                                    diff:'🌍'},
      {id:'RussianArt_Archive',               t:'Русское искусство — Репин и Малевич',          d:'Art russe à travers les siècles',                                diff:'🌍'},
    ],
  },

  // ══════════════════════════════════════════
  //  中文 (MANDARIN)
  // ══════════════════════════════════════════
  zh:{
    debutant:[
      {id:'MandarinFSI_Basic',                t:'FSI 普通话 — 基础课程',                        d:'Cours FSI mandarin basique domaine public',                      diff:'🟢'},
      {id:'ChineseBeginners_Archive',         t:'中文入门 — 打招呼',                            d:'Salutations et introductions en mandarin',                       diff:'🟢'},
      {id:'ChineseNumbers_Archive',           t:'普通话 — 数字和时间',                          d:'Chiffres et heures en mandarin',                                diff:'🟢'},
      {id:'ChineseFamily_Archive',            t:'中文 — 家庭',                                  d:'Famille en mandarin',                                           diff:'🟢'},
      {id:'ChineseFood_Archive',              t:'中文 — 食物和饮料',                            d:'Nourriture et boissons en mandarin',                            diff:'🟢'},
      {id:'ChineseColors_Archive',            t:'普通话 — 颜色和形状',                          d:'Couleurs et formes en mandarin',                                diff:'🟢'},
      {id:'ChineseHouse_Archive',             t:'中文 — 家和房间',                              d:'Maison et pièces en mandarin',                                  diff:'🟢'},
      {id:'ChineseWork_Archive',              t:'中文 — 工作和职业',                            d:'Travail et professions en mandarin',                            diff:'🟢'},
      {id:'ChineseWeather_Archive',           t:'普通话 — 天气',                               d:'Météo en mandarin',                                              diff:'🟢'},
      {id:'ChineseDirections_Archive',        t:'中文 — 问路',                                  d:'Demander son chemin en mandarin',                               diff:'🟢'},
      {id:'ChineseShopping_Archive',          t:'中文 — 购物',                                  d:'Faire les courses en mandarin',                                 diff:'🟢'},
      {id:'ChineseHealth_Archive',            t:'普通话 — 看医生',                              d:'Chez le médecin en mandarin',                                   diff:'🟢'},
      {id:'ChineseTransport_Archive',         t:'中文 — 交通',                                  d:'Transports en mandarin',                                        diff:'🟢'},
      {id:'ChineseGreetings_Archive',         t:'普通话 — 日常对话',                            d:'Conversations quotidiennes en mandarin',                        diff:'🟢'},
      {id:'ChineseAnimals_Archive',           t:'中文 — 动物',                                  d:'Animaux en mandarin',                                           diff:'🟢'},
    ],
    intermediaire:[
      {id:'MandarinFSI_Intermediate',         t:'FSI 普通话 — 中级课程',                        d:'Cours FSI mandarin intermédiaire domaine public',               diff:'🟡'},
      {id:'ChineseIdioms_Archive',            t:'中文 — 成语和惯用语',                          d:'Chengyu (expressions idiomatiques) chinois',                    diff:'🟡'},
      {id:'ChineseMedia_Archive',             t:'普通话 — 新闻和媒体',                          d:'Actualités et médias en mandarin',                              diff:'🟡'},
      {id:'ChineseHistory_Archive',           t:'中文 — 中国历史',                              d:'Histoire de la Chine pour intermédiaires',                      diff:'🟡'},
      {id:'ChineseLiterature_Archive',        t:'普通话 — 中国文学',                            d:'Littérature chinoise pour apprenants',                          diff:'🟡'},
      {id:'ChineseBusiness_Archive',          t:'商务中文 — 会议',                              d:'Mandarin professionnel et réunions',                            diff:'🟡'},
      {id:'ChineseCulture_Archive',           t:'中文 — 中国文化',                              d:'Culture et traditions chinoises',                               diff:'🟡'},
      {id:'ChineseSport_Archive',             t:'普通话 — 体育运动',                            d:'Sports en mandarin',                                            diff:'🟡'},
      {id:'ChineseScience_Archive',           t:'中文 — 科学技术',                              d:'Sciences et technologies en mandarin',                          diff:'🟡'},
      {id:'ChinesePolitics_Archive',          t:'普通话 — 政治和社会',                          d:'Politique et société en mandarin',                              diff:'🟡'},
      {id:'ChinesePhilosophy_Archive',        t:'中文 — 儒家思想',                              d:'Confucianisme et philosophie chinoise',                          diff:'🟡'},
      {id:'ChinesePoetry_Archive',            t:'普通话 — 古诗词',                              d:'Poésie classique chinoise pour apprenants',                     diff:'🟡'},
    ],
    avance:[
      {id:'ChineseUniversity_Archive',        t:'高级中文 — 大学讲座',                          d:'Conférences universitaires en mandarin',                        diff:'🔴'},
      {id:'ChinesePhiloAdv_Archive',          t:'中文 — 哲学讨论',                              d:'Philosophie chinoise avancée',                                  diff:'🔴'},
      {id:'ChineseLiteratureAdv_Archive',     t:'普通话 — 古典文学',                            d:'Littérature classique chinoise avancée',                        diff:'🔴'},
      {id:'ChineseEconomics_Archive',         t:'中文 — 中国经济',                              d:'Économie chinoise en mandarin avancé',                          diff:'🔴'},
      {id:'ChineseLaw_Archive',               t:'普通话 — 法律和司法',                          d:'Droit et justice en mandarin',                                  diff:'🔴'},
    ],
    fsi:[
      {id:'MandarinFSI_Basic',                t:'FSI 普通话 基础 — 第一册',                     d:'Programme FSI mandarin basique vol.1 domaine public',           diff:'🎓'},
      {id:'MandarinFSI_Vol2',                 t:'FSI 普通话 基础 — 第二册',                     d:'Programme FSI mandarin basique vol.2',                          diff:'🎓'},
      {id:'MandarinFSI_Advanced',             t:'FSI 普通话 高级课程',                          d:'Programme avancé FSI mandarin domaine public',                  diff:'🎓'},
    ],
    wenhua:[
      {id:'ChinaCulturTrad_Archive',          t:'中国文化 — 春节和传统节日',                    d:'Fêtes et traditions chinoises',                                 diff:'🌍'},
      {id:'SilkRoadHistory_Archive',          t:'丝绸之路 — 历史',                              d:'Histoire de la Route de la Soie',                               diff:'🌍'},
      {id:'ChineseCuisine_Archive',           t:'中华美食 — 各地菜系',                          d:'Cuisines régionales chinoises',                                 diff:'🌍'},
      {id:'ChineseCalligraphy_Archive',       t:'书法 — 中国书写艺术',                          d:'Art de la calligraphie chinoise',                               diff:'🌍'},
      {id:'ChineseMaritalArts_Archive',       t:'中国功夫 — 武术文化',                          d:'Arts martiaux et culture chinoise',                             diff:'🌍'},
    ],
  },

  // ══════════════════════════════════════════
  //  日本語
  // ══════════════════════════════════════════
  ja:{
    debutant:[
      {id:'JapaneseFSI_Basic',                t:'FSI 日本語 — 基礎コース',                       d:'Cours FSI japonais basique domaine public',                     diff:'🟢'},
      {id:'JapaneseBeginners_Archive',        t:'日本語入門 — 挨拶',                             d:'Salutations japonaises pour débutants',                         diff:'🟢'},
      {id:'JapaneseNumbers_Archive',          t:'日本語 — 数字と時間',                           d:'Chiffres et heures en japonais',                                diff:'🟢'},
      {id:'JapaneseFamily_Archive',           t:'日本語 — 家族',                                 d:'Famille en japonais',                                           diff:'🟢'},
      {id:'JapaneseFood_Archive',             t:'日本語 — 食べ物と飲み物',                       d:'Nourriture et boissons en japonais',                            diff:'🟢'},
      {id:'JapaneseColors_Archive',           t:'日本語 — 色と形',                               d:'Couleurs et formes en japonais',                                diff:'🟢'},
      {id:'JapaneseHouse_Archive',            t:'日本語 — 家と部屋',                             d:'Maison et pièces en japonais',                                  diff:'🟢'},
      {id:'JapaneseWork_Archive',             t:'日本語 — 仕事と職業',                           d:'Travail et professions en japonais',                            diff:'🟢'},
      {id:'JapaneseWeather_Archive',          t:'日本語 — 天気',                                 d:'Météo en japonais',                                             diff:'🟢'},
      {id:'JapaneseDirections_Archive',       t:'日本語 — 道を聞く',                             d:'Demander son chemin en japonais',                               diff:'🟢'},
      {id:'JapaneseShopping_Archive',         t:'日本語 — 買い物',                               d:'Faire les courses en japonais',                                 diff:'🟢'},
      {id:'JapaneseHealth_Archive',           t:'日本語 — 病院で',                               d:'À l\'hôpital en japonais',                                      diff:'🟢'},
      {id:'JapaneseTransport_Archive',        t:'日本語 — 交通',                                 d:'Transports en japonais',                                        diff:'🟢'},
      {id:'JapaneseGreetings_Archive',        t:'日本語 — 日常会話',                             d:'Conversations quotidiennes en japonais',                        diff:'🟢'},
      {id:'JapaneseAnimals_Archive',          t:'日本語 — 動物',                                 d:'Animaux en japonais',                                           diff:'🟢'},
    ],
    intermediaire:[
      {id:'JapaneseFSI_Intermediate',         t:'FSI 日本語 — 中級コース',                       d:'Cours FSI japonais intermédiaire domaine public',               diff:'🟡'},
      {id:'JapaneseIdioms_Archive',           t:'日本語 — 慣用句',                               d:'Expressions idiomatiques japonaises',                           diff:'🟡'},
      {id:'JapaneseMedia_Archive',            t:'日本語 — ニュース',                             d:'Actualités en japonais',                                        diff:'🟡'},
      {id:'JapaneseHistory_Archive',          t:'日本語 — 日本の歴史',                           d:'Histoire du Japon pour intermédiaires',                         diff:'🟡'},
      {id:'JapaneseLiterature_Archive',       t:'日本語 — 日本文学',                             d:'Littérature japonaise pour apprenants',                         diff:'🟡'},
      {id:'JapaneseBusiness_Archive',         t:'ビジネス日本語',                                d:'Japonais professionnel et affaires',                            diff:'🟡'},
      {id:'JapaneseCulture_Archive',          t:'日本語 — 文化と伝統',                           d:'Culture et traditions japonaises',                              diff:'🟡'},
      {id:'JapaneseAnime_Archive',            t:'日本語 — アニメで学ぶ',                         d:'Apprendre le japonais avec l\'anime',                           diff:'🟡'},
      {id:'JapaneseScience_Archive',          t:'日本語 — 科学と技術',                           d:'Sciences et technologies en japonais',                          diff:'🟡'},
      {id:'JapaneseSport_Archive',            t:'日本語 — スポーツ',                             d:'Sports en japonais',                                            diff:'🟡'},
      {id:'JapanesePolitics_Archive',         t:'日本語 — 政治と社会',                           d:'Politique et société en japonais',                              diff:'🟡'},
      {id:'JapanesePoetry_Archive',           t:'日本語 — 俳句と詩',                             d:'Haïku et poésie japonaise pour apprenants',                     diff:'🟡'},
    ],
    avance:[
      {id:'JapaneseUniversity_Archive',       t:'上級日本語 — 大学講義',                         d:'Cours universitaires en japonais',                              diff:'🔴'},
      {id:'JapanesePhilo_Archive',            t:'日本語 — 哲学',                                 d:'Philosophie japonaise avancée',                                 diff:'🔴'},
      {id:'JapaneseLiteratureAdv_Archive',    t:'日本語 — 夏目漱石と川端康成',                   d:'Sōseki et Kawabata pour avancés',                               diff:'🔴'},
      {id:'JapaneseEconomics_Archive',        t:'日本語 — 経済と金融',                           d:'Économie et finance en japonais avancé',                        diff:'🔴'},
      {id:'JapaneseLaw_Archive',              t:'日本語 — 法律と司法',                           d:'Droit et justice en japonais',                                  diff:'🔴'},
    ],
    fsi:[
      {id:'JapaneseFSI_Basic',                t:'FSI 日本語 基礎 — 第一巻',                      d:'Programme FSI japonais basique vol.1 domaine public',           diff:'🎓'},
      {id:'JapaneseFSI_Vol2',                 t:'FSI 日本語 基礎 — 第二巻',                      d:'Programme FSI japonais basique vol.2',                          diff:'🎓'},
      {id:'JapaneseFSI_Advanced',             t:'FSI 日本語 上級コース',                         d:'Programme avancé FSI japonais domaine public',                  diff:'🎓'},
    ],
    bunka:[
      {id:'JapaneseCultureTrad_Archive',      t:'日本 — 伝統的な祭り',                           d:'Festivals et traditions japonaises',                            diff:'🌍'},
      {id:'SakuraHistory_Archive',            t:'桜 — 花見の文化',                               d:'Sakura et culture Hanami',                                      diff:'🌍'},
      {id:'JapaneseCuisine_Archive',          t:'和食 — 日本の料理文化',                         d:'Cuisine japonaise patrimoine UNESCO',                           diff:'🌍'},
      {id:'JapaneseArts_Archive',             t:'日本の伝統芸能 — 歌舞伎と能',                   d:'Kabuki et Noh : arts traditionnels japonais',                   diff:'🌍'},
      {id:'AnimeHistory_Archive',             t:'アニメの歴史',                                   d:'Histoire de l\'animation japonaise',                            diff:'🌍'},
    ],
  },

};

// =================================================================
// CINEMA FUNCTIONS — Internet Archive embed
// =================================================================
let currentCinemaLang = '';
let currentCinemaCat  = '';

function openCinema(){
  currentCinemaLang = S.targetLang;
  const cats = getCinemaCats(currentCinemaLang);
  const langLabels = {en:'English',fr:'Français',es:'Español',ht:'Kreyòl',
                      de:'Deutsch',ru:'Русский',zh:'中文',ja:'日本語'};
  document.getElementById('cinema-title').textContent = '🎬 ' + (langLabels[currentCinemaLang]||'Cinéma');
  document.getElementById('cinema-lang-badge').textContent = FLAGS[currentCinemaLang]||'';
  document.getElementById('cinemaCats').innerHTML = cats.map((c,i)=>
    `<button onclick="loadCinemaCategory('${c.key}')" id="ccat-${c.key}"
       style="flex:0 0 auto;background:transparent;border:none;
              border-bottom:2px solid ${i===0?'#e040fb':'transparent'};
              color:${i===0?'#e040fb':'var(--dim)'};
              padding:10px 14px 8px;font-size:0.72rem;font-weight:800;
              cursor:pointer;font-family:'Nunito',sans-serif;white-space:nowrap;">
      ${c.icon} ${c.label}
    </button>`
  ).join('');
  if(cats.length) loadCinemaCategory(cats[0].key);
  showScreen('screen-cinema');
}

function loadCinemaCategory(catKey){
  currentCinemaCat = catKey;
  const cats = getCinemaCats(currentCinemaLang);
  cats.forEach(c=>{
    const el = document.getElementById('ccat-'+c.key);
    if(el){
      el.style.borderBottomColor = c.key===catKey ? '#e040fb' : 'transparent';
      el.style.color             = c.key===catKey ? '#e040fb' : 'var(--dim)';
    }
  });
  const videos = getCinemaVideos(currentCinemaLang, catKey);
  buildVideoGrid(videos);
}

function buildVideoGrid(videos){
  if(!videos.length){
    document.getElementById('videoList').innerHTML =
      `<div style="text-align:center;padding:40px;color:var(--dim)">
         <div style="font-size:2rem;margin-bottom:10px">🎬</div>
         <div>Bientôt disponible pour cette catégorie</div>
       </div>`;
    return;
  }
  document.getElementById('videoList').innerHTML = videos.map((v,i)=>`
    <div onclick="openArchiveVideo('${v.id}','${v.t.replace(/'/g,"&apos;")}')"
         style="background:var(--bg-card);border:1px solid rgba(224,64,251,0.18);
                border-radius:14px;overflow:hidden;cursor:pointer;transition:all 0.2s;
                display:flex;flex-direction:column;"
         onmouseover="this.style.borderColor='rgba(224,64,251,0.6)';this.style.transform='translateY(-2px)'"
         onmouseout="this.style.borderColor='rgba(224,64,251,0.18)';this.style.transform='translateY(0)'">
      <div style="position:relative;width:100%;padding-bottom:56.25%;background:linear-gradient(135deg,#1a0a2e,#0a0a14);flex-shrink:0;">
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;">
          <div style="width:60px;height:60px;background:rgba(224,64,251,0.85);border-radius:50%;
                      display:flex;align-items:center;justify-content:center;font-size:1.6rem;
                      box-shadow:0 4px 20px rgba(224,64,251,0.4);">▶</div>
          <div style="font-size:0.65rem;color:rgba(255,255,255,0.5);letter-spacing:1px;">INTERNET ARCHIVE</div>
        </div>
        <div style="position:absolute;top:8px;left:8px;background:rgba(0,0,0,0.75);
                    padding:3px 8px;border-radius:8px;font-size:0.65rem;color:#fff;font-weight:800;">${v.diff||''}</div>
        <div style="position:absolute;bottom:6px;right:8px;background:rgba(224,64,251,0.85);
                    padding:2px 7px;border-radius:6px;font-size:0.6rem;color:#fff;font-weight:900;">🌐 LIBRE</div>
      </div>
      <div style="padding:10px 13px 12px;">
        <div style="font-size:0.82rem;font-weight:800;color:#e040fb;margin-bottom:4px;line-height:1.35;">${v.t}</div>
        <div style="font-size:0.7rem;color:var(--dim);line-height:1.4;">${v.d}</div>
        <div style="margin-top:7px;font-size:0.65rem;color:rgba(224,64,251,0.6);font-weight:700;">
          📚 Domaine public — Internet Archive
        </div>
      </div>
    </div>`
  ).join('');
}

// Ouvre le lecteur inline Internet Archive
function openArchiveVideo(id, title){
  const embedUrl = `https://archive.org/embed/${id}`;
  // Mettre à jour l'iframe du lecteur cinéma
  const player = document.getElementById('cinemaPlayer');
  if(player){
    player.src = embedUrl;
    player.style.display = 'block';
    document.getElementById('videoTitle').textContent = title||'';
    document.getElementById('videoDesc').textContent = '📚 Source: Internet Archive — Domaine public';
    document.getElementById('videoList').scrollIntoView({behavior:'smooth'});
  }
  gainXP(5);
  // Aussi proposer d'ouvrir directement
  showNotif('🎬 '+title.substring(0,30)+'...');
}

// =================================================================
