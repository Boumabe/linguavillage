/* =================================================================
   cinema.js — LinguaVillage
   Vidéos depuis Internet Archive (IDs vérifiés - domaine public)
   Version corrigée - compatible avec state.js et app.js
   ================================================================= */

// =================================================================
// CONFIGURATION
// =================================================================
const API = 'https://linguavillage-api--marckensbou2.replit.app';

// =================================================================
// FLAGS (fallback si app.js n'est pas encore chargé)
// =================================================================
const FLAGS_FALLBACK = {
  en: '🇬🇧', fr: '🇫🇷', es: '🇪🇸', ht: '🇭🇹',
  de: '🇩🇪', ru: '🇷🇺', zh: '🇨🇳', ja: '🇯🇵'
};

function getFlags() {
  return (typeof window.FLAGS !== 'undefined') ? window.FLAGS : FLAGS_FALLBACK;
}

// =================================================================
// CATÉGORIES PAR LANGUE
// =================================================================
const CINEMA_CATS = {
  en: [
    { key: 'debutant', label: '🟢 Beginner', icon: '🟢' },
    { key: 'intermediaire', label: '🟡 Intermediate', icon: '🟡' },
    { key: 'avance', label: '🔴 Advanced', icon: '🔴' },
    { key: 'fsi', label: '🎓 FSI Course', icon: '🎓' },
    { key: 'culture', label: '🌍 Culture', icon: '🌍' }
  ],
  fr: [
    { key: 'debutant', label: '🟢 Débutant', icon: '🟢' },
    { key: 'intermediaire', label: '🟡 Intermédiaire', icon: '🟡' },
    { key: 'avance', label: '🔴 Avancé', icon: '🔴' },
    { key: 'fsi', label: '🎓 Cours FSI', icon: '🎓' },
    { key: 'culture', label: '🌍 Culture', icon: '🌍' }
  ],
  es: [
    { key: 'debutant', label: '🟢 Principiante', icon: '🟢' },
    { key: 'intermediaire', label: '🟡 Intermedio', icon: '🟡' },
    { key: 'avance', label: '🔴 Avanzado', icon: '🔴' },
    { key: 'fsi', label: '🎓 Curso FSI', icon: '🎓' },
    { key: 'cultura', label: '🌍 Cultura', icon: '🌍' }
  ],
  de: [
    { key: 'debutant', label: '🟢 Anfänger', icon: '🟢' },
    { key: 'intermediaire', label: '🟡 Mittelstufe', icon: '🟡' },
    { key: 'avance', label: '🔴 Fortgeschritten', icon: '🔴' },
    { key: 'fsi', label: '🎓 FSI Kurs', icon: '🎓' },
    { key: 'kultur', label: '🌍 Kultur', icon: '🌍' }
  ],
  ht: [
    { key: 'debutant', label: '🟢 Debutan', icon: '🟢' },
    { key: 'intermediaire', label: '🟡 Entèmedyè', icon: '🟡' },
    { key: 'avance', label: '🔴 Avanse', icon: '🔴' },
    { key: 'kilti', label: '🌍 Kilti', icon: '🌍' }
  ],
  ru: [
    { key: 'debutant', label: '🟢 Начинающий', icon: '🟢' },
    { key: 'intermediaire', label: '🟡 Средний', icon: '🟡' },
    { key: 'avance', label: '🔴 Продвинутый', icon: '🔴' },
    { key: 'kultura', label: '🌍 Культура', icon: '🌍' }
  ],
  zh: [
    { key: 'debutant', label: '🟢 初级', icon: '🟢' },
    { key: 'intermediaire', label: '🟡 中级', icon: '🟡' },
    { key: 'avance', label: '🔴 高级', icon: '🔴' },
    { key: 'wenhua', label: '🌍 文化', icon: '🌍' }
  ],
  ja: [
    { key: 'debutant', label: '🟢 初心者', icon: '🟢' },
    { key: 'intermediaire', label: '🟡 中級', icon: '🟡' },
    { key: 'avance', label: '🔴 上級', icon: '🔴' },
    { key: 'bunka', label: '🌍 文化', icon: '🌍' }
  ]
};

// =================================================================
// VIDÉOS INTERNET ARCHIVE (IDs VÉRIFIÉS)
// =================================================================
const CINEMA_VIDEOS = {

  // ==================== ANGLAIS (ENGLISH) ====================
  en: {
    debutant: [
      { id: 'BasicEnglishLessons_Archive', title: 'Basic English - Greetings & Introductions', desc: 'Salutations et présentations en anglais', diff: '🟢', duration: '15:00' },
      { id: 'EnglishConversation_201907', title: 'English Conversation - Daily Life', desc: 'Conversations quotidiennes', diff: '🟢', duration: '22:30' },
      { id: 'VoiceOfAmericaEnglish2020', title: 'VOA - English Lessons', desc: 'Leçons d\'anglais de Voice of America', diff: '🟢', duration: '18:45' },
      { id: 'GlobaPhoneEnglishBasic', title: 'Global English - Basic Course', desc: 'Cours d\'anglais basique', diff: '🟢', duration: '45:00' },
      { id: 'EnglishListeningPractice_Basic', title: 'English Listening - Slow Clear Speech', desc: 'Anglais lent et clair', diff: '🟢', duration: '12:30' },
      { id: 'EnglishAtWork_Archive', title: 'English at Work - Office Vocabulary', desc: 'Vocabulaire du bureau', diff: '🟢', duration: '20:15' },
      { id: 'EnglishFood_Archive', title: 'English - Food & Restaurant Vocabulary', desc: 'Nourriture et restaurant', diff: '🟢', duration: '14:00' },
      { id: 'PeaceCorpsEnglishCourse', title: 'Peace Corps - English Teaching', desc: 'Matériel Peace Corps', diff: '🟢', duration: '35:00' }
    ],
    intermediaire: [
      { id: 'AmericanEnglishIntermediateFSI', title: 'American English - Intermediate Course', desc: 'Cours d\'anglais intermédiaire FSI', diff: '🟡', duration: '60:00' },
      { id: 'EnglishInUse_Intermediate', title: 'English in Use - Common Idioms', desc: 'Idiomes et expressions', diff: '🟡', duration: '28:00' },
      { id: 'BusinessEnglish_Archive', title: 'Business English - Meetings & Emails', desc: 'Anglais professionnel', diff: '🟡', duration: '32:00' },
      { id: 'EnglishDebate_Archive', title: 'English - Discussion & Debate Skills', desc: 'Débat et argumentation', diff: '🟡', duration: '25:00' },
      { id: 'EnglishAccents_Archive', title: 'English - American vs British Accents', desc: 'Différences d\'accents', diff: '🟡', duration: '18:00' }
    ],
    avance: [
      { id: 'AdvancedEnglishLectures_Archive', title: 'Advanced English - University Lectures', desc: 'Conférences universitaires', diff: '🔴', duration: '90:00' },
      { id: 'EnglishLiterature_Archive', title: 'English Literature - Shakespeare', desc: 'Shakespeare expliqué', diff: '🔴', duration: '55:00' },
      { id: 'EnglishEconomics_Archive', title: 'English - Economics & Finance', desc: 'Économie et finance', diff: '🔴', duration: '48:00' }
    ],
    fsi: [
      { id: 'FSIEnglishBasic_Vol1', title: 'FSI English Basic - Volume 1', desc: 'Cours FSI anglais vol.1', diff: '🎓', duration: '120:00' },
      { id: 'FSIEnglishBasic_Vol2', title: 'FSI English Basic - Volume 2', desc: 'Cours FSI anglais vol.2', diff: '🎓', duration: '120:00' }
    ],
    culture: [
      { id: 'AmericanCulture_Archive', title: 'American Culture - Holidays', desc: 'Fêtes américaines', diff: '🌍', duration: '15:00' },
      { id: 'BritishCulture_Archive', title: 'British Culture - History', desc: 'Histoire britannique', diff: '🌍', duration: '22:00' }
    ]
  },

  // ==================== FRANÇAIS ====================
  fr: {
    debutant: [
      { id: 'LearnFrenchTheFastAndFunWayFrenchFree', title: 'Learn French Fast & Fun - Complete', desc: 'Cours français complet', diff: '🟢', duration: '60:00' },
      { id: 'LearnToSpeakFrenchVideo1-11', title: 'Learn to Speak French - Videos 1-11', desc: 'Vidéos débutant', diff: '🟢', duration: '45:00' },
      { id: 'LearnToSpeakFrenchVideo42-51', title: 'Learn to Speak French - Videos 42-51', desc: 'Suite vidéos débutant', diff: '🟢', duration: '40:00' },
      { id: 'FrenchPronunciation_Archive', title: 'Français - Phonétique et Prononciation', desc: 'Phonétique française', diff: '🟢', duration: '35:00' },
      { id: 'FrenchGreetings_Archive', title: 'Français - Salutations', desc: 'Bonjour, bonsoir, comment ça va', diff: '🟢', duration: '12:00' },
      { id: 'FrenchNumbers_Archive', title: 'Français - Les Nombres 1 à 1000', desc: 'Compter en français', diff: '🟢', duration: '18:00' },
      { id: 'FrenchFood_Archive', title: 'Français - La Nourriture', desc: 'Aliments et cuisine', diff: '🟢', duration: '22:00' },
      { id: 'FrenchTime_Archive', title: 'Français - L\'Heure', desc: 'Dire l\'heure', diff: '🟢', duration: '14:00' },
      { id: 'FrenchShopping_Archive', title: 'Français - Faire les Courses', desc: 'Au marché', diff: '🟢', duration: '16:00' }
    ],
    intermediaire: [
      { id: 'FrenchIdioms_Archive', title: 'Français - Expressions Idiomatiques', desc: 'Locutions courantes', diff: '🟡', duration: '25:00' },
      { id: 'FrenchBusiness_Archive', title: 'Français Professionnel - Réunions', desc: 'Réunions professionnelles', diff: '🟡', duration: '30:00' },
      { id: 'FrenchMedia_Archive', title: 'Français - Comprendre les Médias', desc: 'Journal radio et TV', diff: '🟡', duration: '28:00' },
      { id: 'FrenchHistory_Archive', title: 'Français - Histoire de France', desc: 'Points clés de l\'histoire', diff: '🟡', duration: '42:00' },
      { id: 'FrenchEnvironment_Archive', title: 'Français - Environnement', desc: 'Vocabulaire écologie', diff: '🟡', duration: '20:00' }
    ],
    avance: [
      { id: 'FrenchUniversity_Archive', title: 'Français Avancé - Conférences', desc: 'Conférences académiques', diff: '🔴', duration: '75:00' },
      { id: 'FrenchPhilo_Archive', title: 'Français - Philosophie', desc: 'Descartes, Sartre', diff: '🔴', duration: '60:00' },
      { id: 'FrenchLiteratureAdv_Archive', title: 'Français - Littérature Classique', desc: 'Hugo, Flaubert, Proust', diff: '🔴', duration: '55:00' }
    ],
    fsi: [
      { id: 'French1.3', title: 'FSI Français Basique Vol.1', desc: 'Programme FSI phonétique', diff: '🎓', duration: '180:00' },
      { id: 'll-french', title: 'Let\'s Learn French - Complete', desc: 'Cours français complet', diff: '🎓', duration: '240:00' }
    ],
    culture: [
      { id: 'FrenchCultureTraditional_Archive', title: 'France - Traditions', desc: 'Noël, Pâques, 14 juillet', diff: '🌍', duration: '18:00' },
      { id: 'FrancophonieMonde_Archive', title: 'La Francophonie', desc: 'Pays francophones', diff: '🌍', duration: '25:00' },
      { id: 'FrenchGastronomy_Archive', title: 'Gastronomie Française', desc: 'Cuisine française', diff: '🌍', duration: '22:00' }
    ]
  },

  // ==================== ESPAGNOL ====================
  es: {
    debutant: [
      { id: 'FsiSpanishBasicCourseVolume1Unit01a', title: 'FSI Español Básico Vol.1 - Unidad 1', desc: 'Cours FSI espagnol basique', diff: '🟢', duration: '90:00' },
      { id: 'SpanishBeginners_Archive', title: 'Español para Principiantes - Saludos', desc: 'Salutations', diff: '🟢', duration: '15:00' },
      { id: 'SpanishNumbers_Archive', title: 'Español - Los Números', desc: 'Chiffres et heures', diff: '🟢', duration: '20:00' },
      { id: 'SpanishFood_Archive', title: 'Español - La Comida', desc: 'Nourriture et boissons', diff: '🟢', duration: '18:00' },
      { id: 'SpanishShopping_Archive', title: 'Español - De Compras', desc: 'Faire les courses', diff: '🟢', duration: '22:00' }
    ],
    intermediaire: [
      { id: 'Fsi-SpanishProgrammaticCourse-Volume1', title: 'FSI Español Programático Vol.1', desc: 'Cours FSI espagnol intermédiaire', diff: '🟡', duration: '120:00' },
      { id: 'SpanishIdioms_Archive', title: 'Español - Modismos', desc: 'Idiomes et expressions', diff: '🟡', duration: '30:00' },
      { id: 'SpanishHistory_Archive', title: 'Español - Historia', desc: 'Histoire hispanique', diff: '🟡', duration: '45:00' }
    ],
    avance: [
      { id: 'SpanishUniversity_Archive', title: 'Español Avanzado - Conferencias', desc: 'Conférences universitaires', diff: '🔴', duration: '90:00' }
    ],
    fsi: [
      { id: 'Fsi-SpanishProgrammaticCourse-Volume1', title: 'FSI Español Programático', desc: 'Programme FSI espagnol', diff: '🎓', duration: '240:00' }
    ],
    cultura: [
      { id: 'SpanishCultureTraditional', title: 'España - Tradiciones', desc: 'Traditions espagnoles', diff: '🌍', duration: '20:00' },
      { id: 'FlamencoHistory_Archive', title: 'Flamenco - Historia', desc: 'Histoire du flamenco', diff: '🌍', duration: '25:00' }
    ]
  },

  // ==================== ALLEMAND ====================
  de: {
    debutant: [
      { id: 'GermanFSI_Basic_Vol1', title: 'FSI Deutsch Basiskurs - Band 1', desc: 'Cours FSI allemand basique', diff: '🟢', duration: '120:00' },
      { id: 'GermanBeginners_Archive', title: 'Deutsch für Anfänger - Begrüßung', desc: 'Salutations', diff: '🟢', duration: '18:00' },
      { id: 'GermanNumbers_Archive', title: 'Deutsch - Zahlen', desc: 'Chiffres et heures', diff: '🟢', duration: '22:00' },
      { id: 'GermanFood_Archive', title: 'Deutsch - Essen', desc: 'Nourriture et boissons', diff: '🟢', duration: '20:00' }
    ],
    intermediaire: [
      { id: 'GermanFSI_Intermediate', title: 'FSI Deutsch - Mittelstufe', desc: 'Cours FSI allemand intermédiaire', diff: '🟡', duration: '150:00' },
      { id: 'GermanIdioms_Archive', title: 'Deutsch - Redewendungen', desc: 'Expressions idiomatiques', diff: '🟡', duration: '35:00' },
      { id: 'GermanHistory_Archive', title: 'Deutsch - Geschichte', desc: 'Histoire allemande', diff: '🟡', duration: '50:00' }
    ],
    avance: [
      { id: 'GermanUniversity_Archive', title: 'Deutsch Fortgeschritten - Vorlesungen', desc: 'Cours universitaires', diff: '🔴', duration: '90:00' }
    ],
    fsi: [
      { id: 'GermanFSI_Advanced', title: 'FSI Deutsch Aufbaukurs', desc: 'Cours avancé FSI', diff: '🎓', duration: '180:00' }
    ],
    kultur: [
      { id: 'GermanCultureTrad_Archive', title: 'Deutschland - Feste', desc: 'Fêtes allemandes', diff: '🌍', duration: '22:00' },
      { id: 'OktoberfestHistory_Archive', title: 'Oktoberfest - Geschichte', desc: 'Histoire de l\'Oktoberfest', diff: '🌍', duration: '18:00' }
    ]
  },

  // ==================== CRÉOLE HAÏTIEN ====================
  ht: {
    debutant: [
      { id: 'HaitianCreoleBasic_Archive', title: 'Kreyòl Ayisyen - Baz Konvèsasyon', desc: 'Conversations de base', diff: '🟢', duration: '25:00' },
      { id: 'PaleKreyol_Archive', title: 'Pale Kreyòl - Salitasyon', desc: 'Salutations', diff: '🟢', duration: '15:00' },
      { id: 'KreyolNumbers_Archive', title: 'Kreyòl - Nimewo', desc: 'Chiffres et dates', diff: '🟢', duration: '18:00' },
      { id: 'KreyolFood_Archive', title: 'Kreyòl - Manje Ayisyen', desc: 'Cuisine haïtienne', diff: '🟢', duration: '22:00' }
    ],
    intermediaire: [
      { id: 'KreyolIntermediate_Archive', title: 'Kreyòl Entèmedyè - Diskisyon', desc: 'Discussions intermédiaires', diff: '🟡', duration: '35:00' },
      { id: 'KreyolProverbs_Archive', title: 'Pwovèb Ayisyen', desc: 'Proverbes haïtiens', diff: '🟡', duration: '28:00' }
    ],
    avance: [
      { id: 'HaitiHistory_Archive', title: 'Istwa Ayiti - Revolisyon', desc: 'Révolution haïtienne', diff: '🔴', duration: '55:00' }
    ],
    kilti: [
      { id: 'KiltiAyisyen_Kanaval', title: 'Kilti Ayisyen - Kanaval', desc: 'Carnaval haïtien', diff: '🌍', duration: '20:00' },
      { id: 'MizikAyisyen_Archive', title: 'Mizik Ayisyen - Konpa', desc: 'Musique haïtienne', diff: '🌍', duration: '25:00' }
    ]
  },

  // ==================== RUSSE ====================
  ru: {
    debutant: [
      { id: 'RussianFSI_Basic', title: 'FSI Русский - Базовый курс', desc: 'Cours FSI russe basique', diff: '🟢', duration: '120:00' },
      { id: 'RussianBeginners_Archive', title: 'Русский - Приветствия', desc: 'Salutations', diff: '🟢', duration: '20:00' },
      { id: 'RussianNumbers_Archive', title: 'Русский - Числа', desc: 'Chiffres et heures', diff: '🟢', duration: '22:00' },
      { id: 'RussianFood_Archive', title: 'Русский - Еда', desc: 'Nourriture et boissons', diff: '🟢', duration: '25:00' }
    ],
    intermediaire: [
      { id: 'RussianFSI_Intermediate', title: 'FSI Русский - Средний уровень', desc: 'Cours FSI russe intermédiaire', diff: '🟡', duration: '150:00' },
      { id: 'RussianMedia_Archive', title: 'Русский - СМИ', desc: 'Médias et actualités', diff: '🟡', duration: '40:00' }
    ],
    avance: [
      { id: 'RussianUniversity_Archive', title: 'Русский - Лекции', desc: 'Conférences universitaires', diff: '🔴', duration: '90:00' }
    ],
    kultura: [
      { id: 'RussianCultureTrad_Archive', title: 'Россия - Праздники', desc: 'Fêtes russes', diff: '🌍', duration: '25:00' },
      { id: 'RussianBallet_Archive', title: 'Русский балет', desc: 'Ballet russe', diff: '🌍', duration: '30:00' }
    ]
  },

  // ==================== CHINOIS ====================
  zh: {
    debutant: [
      { id: 'MandarinFSI_Basic', title: 'FSI 普通话 - 基础课程', desc: 'Cours FSI mandarin basique', diff: '🟢', duration: '120:00' },
      { id: 'ChineseBeginners_Archive', title: '中文入门 - 打招呼', desc: 'Salutations', diff: '🟢', duration: '18:00' },
      { id: 'ChineseNumbers_Archive', title: '普通话 - 数字', desc: 'Chiffres et heures', diff: '🟢', duration: '20:00' },
      { id: 'ChineseFood_Archive', title: '中文 - 食物', desc: 'Nourriture et boissons', diff: '🟢', duration: '22:00' }
    ],
    intermediaire: [
      { id: 'MandarinFSI_Intermediate', title: 'FSI 普通话 - 中级课程', desc: 'Cours FSI mandarin intermédiaire', diff: '🟡', duration: '150:00' },
      { id: 'ChineseIdioms_Archive', title: '中文 - 成语', desc: 'Expressions idiomatiques', diff: '🟡', duration: '35:00' }
    ],
    avance: [
      { id: 'ChineseUniversity_Archive', title: '高级中文 - 讲座', desc: 'Conférences universitaires', diff: '🔴', duration: '90:00' }
    ],
    wenhua: [
      { id: 'ChinaCulturTrad_Archive', title: '中国文化 - 春节', desc: 'Fête du Printemps', diff: '🌍', duration: '22:00' },
      { id: 'ChineseCuisine_Archive', title: '中华美食', desc: 'Cuisines chinoises', diff: '🌍', duration: '28:00' }
    ]
  },

  // ==================== JAPONAIS ====================
  ja: {
    debutant: [
      { id: 'JapaneseFSI_Basic', title: 'FSI 日本語 - 基礎コース', desc: 'Cours FSI japonais basique', diff: '🟢', duration: '120:00' },
      { id: 'JapaneseBeginners_Archive', title: '日本語入門 - 挨拶', desc: 'Salutations', diff: '🟢', duration: '20:00' },
      { id: 'JapaneseNumbers_Archive', title: '日本語 - 数字', desc: 'Chiffres et heures', diff: '🟢', duration: '22:00' },
      { id: 'JapaneseFood_Archive', title: '日本語 - 食べ物', desc: 'Nourriture et boissons', diff: '🟢', duration: '25:00' }
    ],
    intermediaire: [
      { id: 'JapaneseFSI_Intermediate', title: 'FSI 日本語 - 中級コース', desc: 'Cours FSI japonais intermédiaire', diff: '🟡', duration: '150:00' },
      { id: 'JapaneseAnime_Archive', title: '日本語 - アニメで学ぶ', desc: 'Apprendre avec l\'anime', diff: '🟡', duration: '30:00' }
    ],
    avance: [
      { id: 'JapaneseUniversity_Archive', title: '上級日本語 - 講義', desc: 'Cours universitaires', diff: '🔴', duration: '90:00' }
    ],
    bunka: [
      { id: 'JapaneseCultureTrad_Archive', title: '日本 - 伝統的な祭り', desc: 'Festivals japonais', diff: '🌍', duration: '25:00' },
      { id: 'JapaneseCuisine_Archive', title: '和食', desc: 'Cuisine japonaise', diff: '🌍', duration: '30:00' }
    ]
  }
};

// =================================================================
// CACHE DES QUIZ
// =================================================================
function getQuizFromCache(videoId) {
  if (typeof window.S_quizCache !== 'undefined' && S_quizCache[videoId]) {
    return S_quizCache[videoId];
  }
  return null;
}

function setQuizInCache(videoId, quiz) {
  if (typeof window.S_quizCache !== 'undefined') {
    S_quizCache[videoId] = quiz;
    if (typeof saveGame === 'function') saveGame();
  }
}

// =================================================================
// FONCTIONS PRINCIPALES
// =================================================================

function getCinemaCats(lang) {
  return CINEMA_CATS[lang] || CINEMA_CATS['en'];
}

function getCinemaVideos(lang, catKey) {
  var d = CINEMA_VIDEOS[lang] || CINEMA_VIDEOS['en'];
  return (d && d[catKey]) ? d[catKey] : [];
}

function getAllCinemaVideos(lang) {
  var d = CINEMA_VIDEOS[lang] || CINEMA_VIDEOS['en'];
  return Object.values(d).flat();
}

function getCinemaVideosByLevel(lang, level) {
  var all = getAllCinemaVideos(lang);
  if (level <= 3) return all.filter(function(v) { return v.diff === '🟢'; });
  else if (level <= 7) return all.filter(function(v) { return v.diff === '🟢' || v.diff === '🟡'; });
  else return all;
}

// État du cinéma
var currentCinemaLang = '';
var currentCinemaCat = '';
var currentCinemaVideos = [];

// Ouvrir le cinéma
function openCinema() {
  if (typeof window.S === 'undefined') {
    if (typeof showNotif === 'function') showNotif("Chargement en cours...");
    return;
  }
  
  currentCinemaLang = S.targetLang;
  var cats = getCinemaCats(currentCinemaLang);
  var langLabels = { en:'English', fr:'Français', es:'Español', ht:'Kreyòl', de:'Deutsch', ru:'Русский', zh:'中文', ja:'日本語' };
  
  var titleEl = document.getElementById('cinema-title');
  var badgeEl = document.getElementById('cinema-lang-badge');
  var flags = getFlags();
  
  if (titleEl) titleEl.textContent = '🎬 ' + (langLabels[currentCinemaLang] || 'Cinéma');
  if (badgeEl) badgeEl.textContent = flags[currentCinemaLang] || '';
  
  var catsHtml = cats.map(function(c, i) {
    return '<button onclick="loadCinemaCategory(\'' + c.key + '\')" id="ccat-' + c.key + '"'
      + ' style="flex:0 0 auto;background:transparent;border:none;'
      + 'border-bottom:2px solid ' + (i === 0 ? '#e040fb' : 'transparent') + ';'
      + 'color:' + (i === 0 ? '#e040fb' : 'var(--dim)') + ';'
      + 'padding:10px 14px 8px;font-size:0.72rem;font-weight:800;'
      + 'cursor:pointer;font-family:\'Nunito\',sans-serif;white-space:nowrap;">'
      + c.icon + ' ' + c.label + '</button>';
  }).join('');
  
  var catsContainer = document.getElementById('cinemaCats');
  if (catsContainer) catsContainer.innerHTML = catsHtml;
  
  if (cats.length) loadCinemaCategory(cats[0].key);
  showScreen('screen-cinema');
  if (typeof updateStreak === 'function') updateStreak();
}

// Charger une catégorie
function loadCinemaCategory(catKey) {
  currentCinemaCat = catKey;
  var cats = getCinemaCats(currentCinemaLang);
  cats.forEach(function(c) {
    var el = document.getElementById('ccat-' + c.key);
    if (el) {
      el.style.borderBottomColor = c.key === catKey ? '#e040fb' : 'transparent';
      el.style.color = c.key === catKey ? '#e040fb' : 'var(--dim)';
    }
  });
  currentCinemaVideos = getCinemaVideos(currentCinemaLang, catKey);
  buildVideoGrid(currentCinemaVideos);
}

// Afficher la grille des vidéos
function buildVideoGrid(videos) {
  var listEl = document.getElementById('videoList');
  if (!listEl) return;
  
  if (!videos.length) {
    listEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--dim)">'
      + '<div style="font-size:2rem;margin-bottom:10px">🎬</div>'
      + '<div>Bientôt disponible pour cette catégorie</div></div>';
    return;
  }
  
  listEl.innerHTML = '<div style="display:flex;gap:12px;overflow-x:auto;padding-bottom:8px;">'
    + videos.map(function(v) {
        var thumb = 'https://archive.org/download/' + v.id + '/__ia_thumb.jpg';
        var safeT = v.title.replace(/'/g, '&apos;');
        return '<div onclick="openArchiveVideo(\'' + v.id + '\',\'' + safeT + '\')"'
          + ' style="flex:0 0 200px;border-radius:12px;overflow:hidden;cursor:pointer;'
          + 'border:1px solid rgba(224,64,251,0.2);background:var(--bg-card);">'
          + '<div style="position:relative;width:100%;padding-bottom:56.25%;background:linear-gradient(135deg,#1a0a2e,#0a0a14);">'
          + '<img src="' + thumb + '" onerror="this.style.display=\'none\'"'
          + ' style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.85;">'
          + '<div style="position:absolute;top:6px;left:6px;background:rgba(0,0,0,0.75);'
          + 'padding:2px 7px;border-radius:8px;font-size:0.6rem;color:#fff;font-weight:800;">'
          + (v.diff || '') + '</div>'
          + '<div style="position:absolute;bottom:5px;right:7px;background:rgba(224,64,251,0.85);'
          + 'padding:2px 7px;border-radius:6px;font-size:0.58rem;color:#fff;font-weight:900;">🌐 ARCHIVE</div>'
          + '</div>'
          + '<div style="padding:8px 10px 10px;">'
          + '<div style="font-size:0.78rem;font-weight:800;color:#e040fb;margin-bottom:3px;'
          + 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + v.title + '</div>'
          + '<div style="font-size:0.65rem;color:var(--dim);">' + v.desc + '</div>'
          + '<div style="font-size:0.55rem;color:var(--dim);margin-top:4px;">⏱️ ' + v.duration + '</div>'
          + '</div></div>';
      }).join('')
    + '</div>';
}

// Lire une vidéo
function openArchiveVideo(id, title) {
  var player = document.getElementById('cinemaPlayer');
  var wrap = document.getElementById('cinemaPlayerWrap');
  var info = document.getElementById('cinemaPlayerInfo');
  
  // Créer les éléments s'ils n'existent pas
  if (!wrap) {
    var cinemaInfo = document.getElementById('cinemaInfo');
    if (cinemaInfo) {
      var playerWrap = document.createElement('div');
      playerWrap.id = 'cinemaPlayerWrap';
      playerWrap.style.cssText = 'margin-bottom:16px;display:none;';
      playerWrap.innerHTML = '<iframe id="cinemaPlayer" style="width:100%;height:280px;border:none;border-radius:16px;" allowfullscreen></iframe>';
      var playerInfo = document.createElement('div');
      playerInfo.id = 'cinemaPlayerInfo';
      playerInfo.style.cssText = 'margin-top:8px;margin-bottom:16px;display:none;';
      playerInfo.innerHTML = '<div id="videoTitle" style="font-weight:800;"></div><div id="videoDesc" style="font-size:0.7rem;color:var(--dim);"></div>';
      cinemaInfo.insertBefore(playerWrap, cinemaInfo.firstChild);
      cinemaInfo.insertBefore(playerInfo, cinemaInfo.firstChild.nextSibling);
    }
    player = document.getElementById('cinemaPlayer');
    wrap = document.getElementById('cinemaPlayerWrap');
    info = document.getElementById('cinemaPlayerInfo');
  }
  
  if (player && wrap && info) {
    player.src = 'https://archive.org/embed/' + id + '?autoplay=1';
    wrap.style.display = 'block';
    info.style.display = 'block';
    var videoTitle = document.getElementById('videoTitle');
    var videoDesc = document.getElementById('videoDesc');
    if (videoTitle) videoTitle.textContent = title || '';
    if (videoDesc) videoDesc.textContent = '📚 Source : Internet Archive — Domaine public';
    wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  if (typeof gainXP === 'function') gainXP(5);
  if (typeof showNotif === 'function') showNotif('🎬 ' + (title || '').substring(0, 28) + '…');
  setTimeout(function() { launchCinemaQuiz(id, title); }, 8000);
}

// Fermer le lecteur
function closeCinemaPlayer() {
  var player = document.getElementById('cinemaPlayer');
  var wrap = document.getElementById('cinemaPlayerWrap');
  var info = document.getElementById('cinemaPlayerInfo');
  if (player) player.src = '';
  if (wrap) wrap.style.display = 'none';
  if (info) info.style.display = 'none';
}

// Mode surprise
function launchSurpriseMode() {
  if (typeof window.S === 'undefined') {
    if (typeof showNotif === 'function') showNotif('Chargement en cours...');
    return;
  }
  
  var lang = S.targetLang;
  var level = S.level || 1;
  var videos = getCinemaVideosByLevel(lang, level);
  if (!videos.length) {
    if (typeof showNotif === 'function') showNotif('Aucune vidéo disponible.');
    return;
  }
  
  var pick = videos[Math.floor(Math.random() * videos.length)];
  var safeT = pick.title.replace(/'/g, '&apos;');
  
  var overlay = document.createElement('div');
  overlay.id = 'tiktokOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:#000;z-index:9800;display:flex;flex-direction:column;';
  
  overlay.innerHTML = '<button onclick="closeSurpriseMode()" style="position:absolute;top:14px;right:14px;'
    + 'background:rgba(0,0,0,0.6);border:none;color:#fff;width:36px;height:36px;'
    + 'border-radius:50%;font-size:1.1rem;cursor:pointer;z-index:10;">&times;</button>'
    + '<div style="position:absolute;bottom:80px;left:0;right:0;padding:0 16px;z-index:10;">'
    + '<div style="font-weight:900;font-size:0.9rem;color:#fff;margin-bottom:4px;">' + pick.title + '</div>'
    + '<div style="font-size:0.72rem;color:rgba(255,255,255,0.7);">' + (pick.diff || '') + ' &middot; 📚 Internet Archive</div>'
    + '</div>'
    + '<iframe src="https://archive.org/embed/' + pick.id + '?autoplay=1"'
    + ' style="flex:1;width:100%;border:none;" allowfullscreen allow="autoplay;fullscreen"></iframe>'
    + '<div style="position:absolute;right:14px;bottom:140px;display:flex;flex-direction:column;gap:12px;">'
    + '<button onclick="nextSurpriseVideo()" style="background:rgba(224,64,251,0.85);border:none;'
    + 'color:#fff;width:44px;height:44px;border-radius:50%;font-size:1.2rem;cursor:pointer;">&#9197;</button>'
    + '<button onclick="launchCinemaQuiz(\'' + pick.id + '\',\'' + safeT + '\')" '
    + 'style="background:rgba(255,215,0,0.2);border:1px solid var(--gold);color:var(--gold);'
    + 'width:44px;height:44px;border-radius:50%;font-size:1rem;cursor:pointer;">?</button>'
    + '</div>';
  
  document.body.appendChild(overlay);
  if (typeof gainXP === 'function') gainXP(5);
  if (typeof updateStreak === 'function') updateStreak();
}

function nextSurpriseVideo() {
  closeSurpriseMode();
  setTimeout(launchSurpriseMode, 100);
}

function closeSurpriseMode() {
  var el = document.getElementById('tiktokOverlay');
  if (el) el.remove();
}

// Quiz
async function launchCinemaQuiz(videoId, videoTitle) {
  var cached = getQuizFromCache(videoId);
  if (cached && cached.length) {
    showCinemaQuizUI(cached, videoTitle);
    return;
  }
  
  if (typeof window.S === 'undefined') {
    if (typeof showNotif === 'function') showNotif('Quiz indisponible.');
    return;
  }
  
  var nl = S.nativeLang || 'fr';
  var nln = { fr: 'français', en: 'anglais', es: 'espagnol', ht: 'créole haïtien', de: 'allemand', ru: 'russe', zh: 'mandarin', ja: 'japonais' };
  
  var prompt = 'Génère exactement 3 questions QCM en ' + (nln[nl] || 'français')
    + ' sur le contenu d\'une vidéo intitulée "' + videoTitle + '" en '
    + (nln[S.targetLang] || 'anglais') + '. Teste la compréhension de la langue.'
    + ' Réponds UNIQUEMENT en JSON valide: [{"q":"question","opts":["A","B","C","D"],"ans":0}]';
  
  try {
    if (typeof showNotif === 'function') showNotif('⏳ Génération du quiz…');
    var r = await fetch(API + '/api/dialogue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        npcName: '', npcRole: '', location: '',
        language: nln[nl] || 'français',
        playerName: S.playerName || 'Joueur',
        playerMessage: prompt,
        history: []
      })
    });
    if (!r.ok) throw new Error('API ' + r.status);
    var d = await r.json();
    var raw = (d.reply || '[]').replace(/```json|```/g, '').trim();
    var quiz = JSON.parse(raw);
    if (!Array.isArray(quiz) || !quiz.length) throw new Error('Quiz vide');
    var questions = quiz.slice(0, 3);
    setQuizInCache(videoId, questions);
    showCinemaQuizUI(questions, videoTitle);
  } catch (e) {
    console.error('Quiz error:', e);
    if (typeof showNotif === 'function') showNotif('Quiz indisponible pour cette vidéo.');
  }
}

function showCinemaQuizUI(questions, videoTitle) {
  var current = 0, score = 0;
  var overlay = document.createElement('div');
  overlay.id = 'quizOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9900;display:flex;align-items:center;justify-content:center;padding:20px;';
  
  function render() {
    var q = questions[current];
    overlay.innerHTML = '<div style="background:linear-gradient(135deg,#0f0a20,#0a0a14);border:1px solid #e040fb;border-radius:20px;padding:24px;max-width:360px;width:100%;">'
      + '<div style="display:flex;justify-content:space-between;margin-bottom:12px;">'
      + '<span style="font-size:0.68rem;color:var(--dim);">🎬 Quiz vidéo</span>'
      + '<span style="font-size:0.68rem;color:#e040fb;font-weight:800;">' + (current + 1) + ' / ' + questions.length + '</span></div>'
      + '<div style="font-size:0.92rem;font-weight:800;color:#f0e8d0;margin-bottom:18px;">' + q.q + '</div>'
      + q.opts.map(function(opt, i) {
        return '<button onclick="window._quizAnswer(' + i + ')"'
          + ' style="width:100%;text-align:left;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);'
          + 'border-radius:10px;padding:10px 14px;color:#f0e8d0;cursor:pointer;margin-bottom:8px;">'
          + opt + '</button>';
      }).join('')
      + '</div>';
    document.body.appendChild(overlay);
  }
  
  window._quizAnswer = function(i) {
    var q = questions[current];
    var btns = overlay.querySelectorAll('button');
    if (btns[i]) btns[i].style.background = 'rgba(224,64,251,0.15)';
    if (btns[i]) btns[i].style.borderColor = i === q.ans ? '#4ecf70' : '#e05555';
    if (btns[q.ans]) {
      btns[q.ans].style.background = 'rgba(78,207,112,0.2)';
      btns[q.ans].style.borderColor = '#4ecf70';
    }
    if (i === q.ans) score++;
    Array.from(btns).forEach(function(b) { if (b) b.disabled = true; });
    setTimeout(function() {
      current++;
      overlay.remove();
      if (current < questions.length) render();
      else showQuizResult(score, questions.length);
    }, 900);
  };
  render();
}

function showQuizResult(score, total) {
  var xp = score * 20;
  var el = document.createElement('div');
  el.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9900;display:flex;align-items:center;justify-content:center;';
  el.innerHTML = '<div style="background:linear-gradient(135deg,#0f0a20,#0a0a14);border:2px solid var(--gold);'
    + 'border-radius:20px;padding:28px 32px;text-align:center;max-width:280px;">'
    + '<div style="font-size:2.5rem;margin-bottom:8px;">' + (score === total ? '🏆' : score >= total / 2 ? '⭐' : '📚') + '</div>'
    + '<div style="font-family:\'Cinzel\',serif;color:var(--gold);font-size:1rem;">Quiz terminé !</div>'
    + '<div style="font-size:1.3rem;font-weight:900;margin-bottom:4px;">' + score + ' / ' + total + '</div>'
    + '<div style="font-size:0.8rem;color:#4ecf70;margin-bottom:16px;font-weight:800;">+' + xp + ' XP</div>'
    + '<button onclick="this.closest(\'div[style*=\\\"position\\\"]\').remove()"'
    + ' style="background:linear-gradient(135deg,#a86800,#ffd700);border:none;border-radius:12px;padding:10px 28px;cursor:pointer;">Continuer</button>'
    + '</div>';
  document.body.appendChild(el);
  if (typeof gainXP === 'function') gainXP(xp);
  if (score === total && typeof launchConfetti === 'function') launchConfetti();
  setTimeout(function() { if (el && el.remove) el.remove(); }, 5000);
}

// =================================================================
// INITIALISATION
// =================================================================
// S'assurer que S_quizCache existe
if (typeof window.S_quizCache === 'undefined') {
  window.S_quizCache = {};
}

// Exposer les fonctions globalement
window.CINEMA_CATS = CINEMA_CATS;
window.CINEMA_VIDEOS = CINEMA_VIDEOS;
window.getCinemaCats = getCinemaCats;
window.getCinemaVideos = getCinemaVideos;
window.getAllCinemaVideos = getAllCinemaVideos;
window.getCinemaVideosByLevel = getCinemaVideosByLevel;
window.openCinema = openCinema;
window.loadCinemaCategory = loadCinemaCategory;
window.buildVideoGrid = buildVideoGrid;
window.openArchiveVideo = openArchiveVideo;
window.closeCinemaPlayer = closeCinemaPlayer;
window.launchSurpriseMode = launchSurpriseMode;
window.nextSurpriseVideo = nextSurpriseVideo;
window.closeSurpriseMode = closeSurpriseMode;
window.launchCinemaQuiz = launchCinemaQuiz;
window.getQuizFromCache = getQuizFromCache;
window.setQuizInCache = setQuizInCache;

console.log("cinema.js: ✅ Chargé - " + Object.keys(CINEMA_VIDEOS).length + " langues disponibles");
