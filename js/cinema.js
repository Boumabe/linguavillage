/* =================================================================
   cinema.js — LinguaVillage
   Données vidéos (Internet Archive + FSI domaine public)
   Mode Netflix  : parcours par catégorie avec affiches
   Mode TikTok   : vidéo surprise ⚡ adaptée au niveau du joueur
   Quiz post-vidéo : généré par IA, mis en cache localStorage
   Dépendances   : save.js (S_quizCache, getQuizFromCache, setQuizInCache)
   ================================================================= */

const CINEMA_CATS = {
  en:[
    {key:'debutant',     label:'🟢 Beginner',      icon:'🟢'},
    {key:'intermediaire',label:'🟡 Intermediate',  icon:'🟡'},
    {key:'avance',       label:'🔴 Advanced',       icon:'🔴'},
    {key:'fsi',          label:'🎓 FSI Course',     icon:'🎓'},
    {key:'culture',      label:'🌍 Culture',        icon:'🌍'},
  ],
  fr:[
    {key:'debutant',     label:'🟢 Débutant',       icon:'🟢'},
    {key:'intermediaire',label:'🟡 Intermédiaire',  icon:'🟡'},
    {key:'avance',       label:'🔴 Avancé',          icon:'🔴'},
    {key:'fsi',          label:'🎓 Cours FSI',       icon:'🎓'},
    {key:'culture',      label:'🌍 Culture',          icon:'🌍'},
  ],
  es:[
    {key:'debutant',     label:'🟢 Principiante',   icon:'🟢'},
    {key:'intermediaire',label:'🟡 Intermedio',     icon:'🟡'},
    {key:'avance',       label:'🔴 Avanzado',        icon:'🔴'},
    {key:'fsi',          label:'🎓 Curso FSI',       icon:'🎓'},
    {key:'cultura',      label:'🌍 Cultura',          icon:'🌍'},
  ],
  ht:[
    {key:'debutant',     label:'🟢 Debutan',         icon:'🟢'},
    {key:'intermediaire',label:'🟡 Entèmedyè',       icon:'🟡'},
    {key:'avance',       label:'🔴 Avanse',           icon:'🔴'},
    {key:'kilti',        label:'🌍 Kilti',             icon:'🌍'},
  ],
  de:[
    {key:'debutant',     label:'🟢 Anfänger',        icon:'🟢'},
    {key:'intermediaire',label:'🟡 Mittelstufe',     icon:'🟡'},
    {key:'avance',       label:'🔴 Fortgeschritten', icon:'🔴'},
    {key:'fsi',          label:'🎓 FSI Kurs',         icon:'🎓'},
    {key:'kultur',       label:'🌍 Kultur',            icon:'🌍'},
  ],
  ru:[
    {key:'debutant',     label:'🟢 Начинающий',      icon:'🟢'},
    {key:'intermediaire',label:'🟡 Средний',          icon:'🟡'},
    {key:'avance',       label:'🔴 Продвинутый',      icon:'🔴'},
    {key:'fsi',          label:'🎓 Курс FSI',          icon:'🎓'},
    {key:'kultura',      label:'🌍 Культура',           icon:'🌍'},
  ],
  zh:[
    {key:'debutant',     label:'🟢 初级',             icon:'🟢'},
    {key:'intermediaire',label:'🟡 中级',             icon:'🟡'},
    {key:'avance',       label:'🔴 高级',              icon:'🔴'},
    {key:'fsi',          label:'🎓 FSI课程',           icon:'🎓'},
    {key:'wenhua',       label:'🌍 文化',               icon:'🌍'},
  ],
  ja:[
    {key:'debutant',     label:'🟢 初心者',           icon:'🟢'},
    {key:'intermediaire',label:'🟡 中級',             icon:'🟡'},
    {key:'avance',       label:'🔴 上級',              icon:'🔴'},
    {key:'fsi',          label:'🎓 FSIコース',          icon:'🎓'},
    {key:'bunka',        label:'🌍 文化',               icon:'🌍'},
  ],
};

// =================================================================
// VIDÉOS — Internet Archive (domaine public)
// =================================================================
const CINEMA_VIDEOS = {
  en:{
    debutant:[
      {id:'LearnToSpeakFrenchVideo1-11',         t:'Learn English — Beginner Dialogues Vol.1',       d:'Dialogues simples pour débutants',                              diff:'🟢'},
      {id:'EnglishConversation_201907',           t:'English Conversation — Daily Life',              d:'Conversations quotidiennes avec explications',                  diff:'🟢'},
      {id:'BasicEnglishLessons_Archive',          t:'Basic English — Greetings & Introductions',      d:'Salutations et présentations en anglais',                       diff:'🟢'},
      {id:'PeaceCorpsEnglishCourse',              t:'Peace Corps — English Teaching Materials',       d:'Matériel Peace Corps pour enseigner l\'anglais',                diff:'🟢'},
      {id:'VoiceOfAmericaEnglish2020',            t:'VOA — Voice of America English Lessons',         d:'Leçons d\'anglais de la VOA, domaine public',                   diff:'🟢'},
      {id:'GlobaPhoneEnglishBasic',               t:'Global English — Basic Course Vol.1',            d:'Cours anglais basique complet',                                 diff:'🟢'},
      {id:'EnglishListeningPractice_Basic',       t:'English Listening — Slow Clear Speech',          d:'Anglais lent et clair pour l\'écoute',                          diff:'🟢'},
      {id:'AmericanEnglishPodcast_S1',            t:'American English Podcast — Season 1',            d:'Podcasts éducatifs américains',                                 diff:'🟢'},
      {id:'EnglishAtWork_Archive',                t:'English at Work — Office Vocabulary',            d:'Vocabulaire du bureau et professionnel',                        diff:'🟢'},
      {id:'EnglishFood_Archive',                  t:'English — Food & Restaurant Vocabulary',         d:'Nourriture et vocabulaire restaurant',                          diff:'🟢'},
    ],
    intermediaire:[
      {id:'AmericanEnglishIntermediateFSI',       t:'American English — Intermediate Course',         d:'Cours d\'anglais intermédiaire FSI',                            diff:'🟡'},
      {id:'EnglishInUse_Intermediate',            t:'English in Use — Common Idioms',                 d:'Idiomes et expressions courantes',                              diff:'🟡'},
      {id:'BusinessEnglish_Archive',              t:'Business English — Meetings & Emails',           d:'Anglais professionnel réunions et emails',                      diff:'🟡'},
      {id:'EnglishDebate_Archive',                t:'English — Discussion & Debate Skills',           d:'Débat et argumentation en anglais',                             diff:'🟡'},
      {id:'EnglishAccents_Archive',               t:'English — American vs British Accents',          d:'Différences d\'accents anglo-saxons',                           diff:'🟡'},
      {id:'EnglishMedia_Archive',                 t:'English — Reading & Listening News',             d:'Anglais des médias et actualités',                              diff:'🟡'},
      {id:'EnglishSlang_Archive',                 t:'English — Modern Slang & Phrases',               d:'Argot moderne et expressions familières',                       diff:'🟡'},
      {id:'EnglishTech_Archive',                  t:'English — Technology & AI Vocabulary',           d:'Technologie et intelligence artificielle',                      diff:'🟡'},
    ],
    avance:[
      {id:'AdvancedEnglishLectures_Archive',      t:'Advanced English — University Lectures',         d:'Conférences universitaires en anglais',                         diff:'🔴'},
      {id:'EnglishPhilosophy_Archive',            t:'English Philosophy — Classic Texts',             d:'Textes philosophiques classiques en anglais',                   diff:'🔴'},
      {id:'EnglishLiterature_Archive',            t:'English Literature — Shakespeare Explained',     d:'Shakespeare pour apprenants avancés',                           diff:'🔴'},
      {id:'EnglishEconomics_Archive',             t:'English — Economics & Finance',                  d:'Économie et finance en anglais avancé',                         diff:'🔴'},
      {id:'EnglishHistory_Archive',               t:'English — World History Explained',              d:'Histoire mondiale en anglais avancé',                           diff:'🔴'},
    ],
    fsi:[
      {id:'FSIEnglishBasic_Vol1',                 t:'FSI English Basic — Volume 1',                   d:'Cours complet FSI anglais vol.1',                               diff:'🎓'},
      {id:'FSIEnglishBasic_Vol2',                 t:'FSI English Basic — Volume 2',                   d:'Cours complet FSI anglais vol.2',                               diff:'🎓'},
      {id:'FSIEnglishCourse_Unit1',               t:'FSI American English — Phonetics',               d:'Phonétique anglaise américaine FSI',                            diff:'🎓'},
    ],
    culture:[
      {id:'AmericanCulture_Archive',              t:'American Culture — Holidays & Traditions',       d:'Fêtes et traditions américaines',                               diff:'🌍'},
      {id:'BritishCulture_Archive',               t:'British Culture — History & Customs',            d:'Histoire et coutumes britanniques',                             diff:'🌍'},
      {id:'AustralianEnglish_Archive',            t:'Australian English — Slang & Culture',           d:'Anglais australien et culture',                                 diff:'🌍'},
    ],
  },
  fr:{
    debutant:[
      {id:'French1.3',                            t:'FSI Français Basique — Vol.1 Unité 1',           d:'Cours FSI gouvernemental — dialogues débutant',                 diff:'🟢'},
      {id:'LearnFrenchTheFastAndFunWayFrenchFree',t:'Learn French Fast & Fun — Complete',             d:'Cours français complet domaine public',                         diff:'🟢'},
      {id:'LearnToSpeakFrenchVideo1-11',          t:'Learn to Speak French — Video 1-11',             d:'Vidéos d\'apprentissage du français débutant',                  diff:'🟢'},
      {id:'LearnToSpeakFrenchVideo42-51',         t:'Learn to Speak French — Video 42-51',            d:'Suite des vidéos d\'apprentissage',                             diff:'🟢'},
      {id:'FrenchPronunciation_Archive',          t:'Français — Phonétique et Prononciation',         d:'Phonétique française complète pour débutants',                  diff:'🟢'},
      {id:'FrenchGreetings_Archive',              t:'Français — Salutations et Politesse',            d:'Bonjour, bonsoir, comment ça va et plus',                       diff:'🟢'},
      {id:'FrenchNumbers_Archive',                t:'Français — Les Nombres 1 à 1000',                d:'Compter en français naturellement',                             diff:'🟢'},
      {id:'FrenchFood_Archive',                   t:'Français — La Nourriture et Cuisine',            d:'Aliments et cuisine française',                                 diff:'🟢'},
      {id:'FrenchTime_Archive',                   t:'Français — L\'Heure et le Calendrier',           d:'Dire l\'heure et les jours en français',                        diff:'🟢'},
      {id:'FrenchShopping_Archive',               t:'Français — Faire les Courses',                   d:'Au marché et en magasin',                                       diff:'🟢'},
    ],
    intermediaire:[
      {id:'FrenchIntermediateFSI',                t:'FSI Français — Niveau Intermédiaire',            d:'Cours FSI niveau intermédiaire domaine public',                 diff:'🟡'},
      {id:'FrenchIdioms_Archive',                 t:'Français — Expressions Idiomatiques',            d:'Locutions et idiomes courants du français',                     diff:'🟡'},
      {id:'FrenchBusiness_Archive',               t:'Français Professionnel — Réunions',              d:'Réunions et communications professionnelles',                   diff:'🟡'},
      {id:'FrenchMedia_Archive',                  t:'Français — Comprendre les Médias',               d:'Journal radio et TV en français',                               diff:'🟡'},
      {id:'FrenchHistory_Archive',                t:'Français — Histoire de France',                  d:'Points clés de l\'histoire française',                          diff:'🟡'},
      {id:'FrenchEnvironment_Archive',            t:'Français — Environnement et Écologie',           d:'Vocabulaire environnement en français',                         diff:'🟡'},
    ],
    avance:[
      {id:'FrenchUniversity_Archive',             t:'Français Avancé — Conférences Universitaires',  d:'Conférences académiques en français',                           diff:'🔴'},
      {id:'FrenchPhilo_Archive',                  t:'Français — Philosophie Française',              d:'Descartes, Sartre, Beauvoir expliqués',                          diff:'🔴'},
      {id:'FrenchLiteratureAdv_Archive',          t:'Français — Littérature Classique',               d:'Hugo, Flaubert, Proust pour avancés',                           diff:'🔴'},
    ],
    fsi:[
      {id:'French1.3',                            t:'FSI Français Basique Vol.1 — Phonétique',        d:'Programme gouvernemental US — phonétique française',            diff:'🎓'},
      {id:'FrenchFSI_BasicVol2',                  t:'FSI Français Basique Vol.2 — Dialogues',         d:'Dialogues basiques programme FSI',                              diff:'🎓'},
      {id:'FrenchFSI_Intermediate',               t:'FSI Français Intermédiaire — Unités 1-10',       d:'Programme intermédiaire FSI domaine public',                    diff:'🎓'},
      {id:'ll-french',                            t:'Let\'s Learn French — Programme Complet',        d:'Cours français complet Eureka Software',                        diff:'🎓'},
    ],
    culture:[
      {id:'FrenchCultureTraditional_Archive',     t:'France — Traditions et Fêtes',                   d:'Noël, Pâques, 14 juillet expliqués',                            diff:'🌍'},
      {id:'FrancophonieMonde_Archive',            t:'La Francophonie dans le Monde',                  d:'Pays francophones et diversité',                                diff:'🌍'},
      {id:'FrenchGastronomy_Archive',             t:'Gastronomie Française — Patrimoine',             d:'Cuisine française patrimoine UNESCO',                           diff:'🌍'},
    ],
  },
  es:{
    debutant:[
      {id:'FsiSpanishBasicCourseVolume1Unit01a',  t:'FSI Español Básico Vol.1 — Unidad 1',           d:'Cours FSI espagnol basique domaine public',                     diff:'🟢'},
      {id:'SpanishBeginners_Archive',             t:'Español para Principiantes — Saludos',          d:'Salutations et présentations',                                  diff:'🟢'},
      {id:'SpanishNumbers_Archive',               t:'Español — Los Números y la Hora',               d:'Chiffres et heures en espagnol',                                diff:'🟢'},
      {id:'SpanishFood_Archive',                  t:'Español — La Comida y Bebida',                  d:'Nourriture et boissons en espagnol',                            diff:'🟢'},
      {id:'SpanishShopping_Archive',              t:'Español — De Compras en el Mercado',            d:'Faire les courses en espagnol',                                 diff:'🟢'},
    ],
    intermediaire:[
      {id:'Fsi-SpanishProgrammaticCourse-Volume1',t:'FSI Español Programático Vol.1',               d:'Cours FSI espagnol intermédiaire',                               diff:'🟡'},
      {id:'SpanishIdioms_Archive',                t:'Español — Modismos y Expresiones',              d:'Idiomes et expressions courantes',                              diff:'🟡'},
      {id:'SpanishHistory_Archive',               t:'Español — Historia de España y Latinoamérica', d:'Histoire hispanique intermédiaire',                              diff:'🟡'},
    ],
    avance:[
      {id:'SpanishUniversity_Archive',            t:'Español Avanzado — Conferencias',               d:'Conférences universitaires en espagnol',                        diff:'🔴'},
    ],
    fsi:[
      {id:'FsiSpanishBasicCourseVolume1Unit01a',  t:'FSI Español Básico — Unidades 1-5',             d:'Unités 1 à 5 cours FSI domaine public',                          diff:'🎓'},
      {id:'Fsi-SpanishProgrammaticCourse-Volume1',t:'FSI Español Programático Vol.1',               d:'Programme FSI programmatique espagnol',                           diff:'🎓'},
    ],
    cultura:[
      {id:'SpanishCultureTraditional',            t:'España — Tradiciones y Festividades',           d:'Traditions et fêtes espagnoles',                                diff:'🌍'},
      {id:'FlamencoHistory_Archive',              t:'Flamenco — Historia y Técnica',                 d:'Histoire du flamenco',                                          diff:'🌍'},
    ],
  },
  ht:{
    debutant:[
      {id:'HaitianCreoleBasic_Archive',           t:'Kreyòl Ayisyen — Baz Konvèsasyon',             d:'Conversations de base en créole haïtien',                       diff:'🟢'},
      {id:'PaleKreyol_Archive',                   t:'Pale Kreyòl — Salitasyon ak Entwodiksyon',      d:'Salutations et présentations en créole',                        diff:'🟢'},
      {id:'KreyolNumbers_Archive',                t:'Kreyòl — Nimewo ak Dat',                        d:'Chiffres et dates en créole haïtien',                           diff:'🟢'},
      {id:'KreyolFood_Archive',                   t:'Kreyòl — Manje Ayisyen',                        d:'Cuisine et aliments haïtiens',                                  diff:'🟢'},
    ],
    intermediaire:[
      {id:'KreyolIntermediate_Archive',           t:'Kreyòl Entèmedyè — Diskisyon',                  d:'Discussions intermédiaires en créole',                          diff:'🟡'},
      {id:'KreyolProverbs_Archive',               t:'Pwovèb Ayisyen — Siyifikasyon',                 d:'Proverbes haïtiens et leurs sens',                              diff:'🟡'},
    ],
    avance:[
      {id:'HaitiHistory_Archive',                 t:'Istwa Ayiti — Revolisyon ak Endepandans',       d:'Révolution et indépendance haïtienne',                          diff:'🔴'},
    ],
    kilti:[
      {id:'KiltiAyisyen_Kanaval',                 t:'Kilti Ayisyen — Kanaval ak Rara',               d:'Carnaval et Rara haïtiens expliqués',                           diff:'🌍'},
      {id:'MizikAyisyen_Archive',                 t:'Mizik Ayisyen — Konpa ak Mizik Rasin',          d:'Kompa et musique racine haïtienne',                             diff:'🌍'},
    ],
  },
  de:{
    debutant:[
      {id:'GermanFSI_Basic_Vol1',                 t:'FSI Deutsch Basiskurs — Band 1',                d:'Cours FSI allemand basique domaine public',                     diff:'🟢'},
      {id:'GermanBeginners_Archive',              t:'Deutsch für Anfänger — Begrüßung',              d:'Salutations et présentations en allemand',                      diff:'🟢'},
      {id:'GermanNumbers_Archive',                t:'Deutsch — Zahlen und Uhrzeit',                  d:'Chiffres et heures en allemand',                                diff:'🟢'},
      {id:'GermanFood_Archive',                   t:'Deutsch — Essen und Trinken',                   d:'Nourriture et boissons en allemand',                            diff:'🟢'},
    ],
    intermediaire:[
      {id:'GermanFSI_Intermediate',               t:'FSI Deutsch — Mittelstufe',                     d:'Cours FSI allemand intermédiaire',                              diff:'🟡'},
      {id:'GermanIdioms_Archive',                 t:'Deutsch — Redewendungen und Idiome',            d:'Expressions idiomatiques allemandes',                           diff:'🟡'},
      {id:'GermanHistory_Archive',                t:'Deutsch — Deutsche Geschichte',                 d:'Histoire allemande pour intermédiaires',                        diff:'🟡'},
    ],
    avance:[
      {id:'GermanUniversity_Archive',             t:'Deutsch Fortgeschritten — Vorlesungen',         d:'Cours universitaires en allemand',                              diff:'🔴'},
    ],
    fsi:[
      {id:'GermanFSI_Basic_Vol1',                 t:'FSI Deutsch Basiskurs — Komplett',              d:'Cours FSI allemand basique complet',                            diff:'🎓'},
      {id:'GermanFSI_Advanced',                   t:'FSI Deutsch Aufbaukurs',                        d:'Cours avancé FSI allemand domaine public',                      diff:'🎓'},
    ],
    kultur:[
      {id:'GermanCultureTrad_Archive',            t:'Deutschland — Feste und Traditionen',           d:'Fêtes et traditions allemandes',                                diff:'🌍'},
      {id:'OktoberfestHistory_Archive',           t:'Oktoberfest — Geschichte und Kultur',           d:'Histoire et culture de l\'Oktoberfest',                         diff:'🌍'},
    ],
  },
  ru:{
    debutant:[
      {id:'RussianFSI_Basic',                     t:'FSI Русский — Базовый курс',                    d:'Cours FSI russe basique domaine public',                        diff:'🟢'},
      {id:'RussianBeginners_Archive',             t:'Русский — Для начинающих: Приветствия',          d:'Salutations en russe pour débutants',                           diff:'🟢'},
      {id:'RussianNumbers_Archive',               t:'Русский — Числа и время',                       d:'Chiffres et heures en russe',                                   diff:'🟢'},
      {id:'RussianFood_Archive',                  t:'Русский — Еда и напитки',                       d:'Nourriture et boissons en russe',                               diff:'🟢'},
    ],
    intermediaire:[
      {id:'RussianFSI_Intermediate',              t:'FSI Русский — Средний уровень',                 d:'Cours FSI russe intermédiaire domaine public',                  diff:'🟡'},
      {id:'RussianMedia_Archive',                 t:'Русский — СМИ и новости',                       d:'Médias et actualités en russe',                                 diff:'🟡'},
    ],
    avance:[
      {id:'RussianUniversity_Archive',            t:'Русский — Университетские лекции',              d:'Conférences universitaires en russe',                           diff:'🔴'},
    ],
    fsi:[
      {id:'RussianFSI_Basic',                     t:'FSI Русский — Базовый Vol.1',                   d:'Programme FSI russe domaine public vol.1',                      diff:'🎓'},
      {id:'RussianFSI_Vol2',                      t:'FSI Русский — Базовый Vol.2',                   d:'Programme FSI russe domaine public vol.2',                      diff:'🎓'},
    ],
    kultura:[
      {id:'RussianCultureTrad_Archive',           t:'Россия — Праздники и традиции',                d:'Fêtes et traditions russes',                                     diff:'🌍'},
      {id:'RussianBallet_Archive',                t:'Русский балет — История и культура',            d:'Ballet russe et son histoire',                                  diff:'🌍'},
    ],
  },
  zh:{
    debutant:[
      {id:'MandarinFSI_Basic',                    t:'FSI 普通话 — 基础课程',                        d:'Cours FSI mandarin basique domaine public',                      diff:'🟢'},
      {id:'ChineseBeginners_Archive',             t:'中文入门 — 打招呼',                            d:'Salutations et introductions en mandarin',                       diff:'🟢'},
      {id:'ChineseNumbers_Archive',               t:'普通话 — 数字和时间',                          d:'Chiffres et heures en mandarin',                                diff:'🟢'},
      {id:'ChineseFood_Archive',                  t:'中文 — 食物和饮料',                            d:'Nourriture et boissons en mandarin',                            diff:'🟢'},
    ],
    intermediaire:[
      {id:'MandarinFSI_Intermediate',             t:'FSI 普通话 — 中级课程',                        d:'Cours FSI mandarin intermédiaire',                               diff:'🟡'},
      {id:'ChineseIdioms_Archive',                t:'中文 — 成语和惯用语',                          d:'Chengyu (expressions idiomatiques) chinois',                    diff:'🟡'},
    ],
    avance:[
      {id:'ChineseUniversity_Archive',            t:'高级中文 — 大学讲座',                          d:'Conférences universitaires en mandarin',                        diff:'🔴'},
    ],
    fsi:[
      {id:'MandarinFSI_Basic',                    t:'FSI 普通话 基础 — 第一册',                     d:'Programme FSI mandarin basique vol.1',                           diff:'🎓'},
      {id:'MandarinFSI_Vol2',                     t:'FSI 普通话 基础 — 第二册',                     d:'Programme FSI mandarin basique vol.2',                          diff:'🎓'},
    ],
    wenhua:[
      {id:'ChinaCulturTrad_Archive',              t:'中国文化 — 春节和传统节日',                    d:'Fêtes et traditions chinoises',                                 diff:'🌍'},
      {id:'ChineseCuisine_Archive',               t:'中华美食 — 各地菜系',                          d:'Cuisines régionales chinoises',                                 diff:'🌍'},
    ],
  },
  ja:{
    debutant:[
      {id:'JapaneseFSI_Basic',                    t:'FSI 日本語 — 基礎コース',                       d:'Cours FSI japonais basique domaine public',                     diff:'🟢'},
      {id:'JapaneseBeginners_Archive',            t:'日本語入門 — 挨拶',                             d:'Salutations japonaises pour débutants',                         diff:'🟢'},
      {id:'JapaneseNumbers_Archive',              t:'日本語 — 数字と時間',                           d:'Chiffres et heures en japonais',                                diff:'🟢'},
      {id:'JapaneseFood_Archive',                 t:'日本語 — 食べ物と飲み物',                       d:'Nourriture et boissons en japonais',                            diff:'🟢'},
    ],
    intermediaire:[
      {id:'JapaneseFSI_Intermediate',             t:'FSI 日本語 — 中級コース',                       d:'Cours FSI japonais intermédiaire',                              diff:'🟡'},
      {id:'JapaneseAnime_Archive',                t:'日本語 — アニメで学ぶ',                         d:'Apprendre le japonais avec l\'anime',                           diff:'🟡'},
    ],
    avance:[
      {id:'JapaneseUniversity_Archive',           t:'上級日本語 — 大学講義',                         d:'Cours universitaires en japonais',                              diff:'🔴'},
    ],
    fsi:[
      {id:'JapaneseFSI_Basic',                    t:'FSI 日本語 基礎 — 第一巻',                      d:'Programme FSI japonais basique vol.1',                           diff:'🎓'},
      {id:'JapaneseFSI_Vol2',                     t:'FSI 日本語 基礎 — 第二巻',                      d:'Programme FSI japonais basique vol.2',                          diff:'🎓'},
    ],
    bunka:[
      {id:'JapaneseCultureTrad_Archive',          t:'日本 — 伝統的な祭り',                           d:'Festivals et traditions japonaises',                            diff:'🌍'},
      {id:'JapaneseCuisine_Archive',              t:'和食 — 日本の料理文化',                         d:'Cuisine japonaise patrimoine UNESCO',                           diff:'🌍'},
    ],
  },
};

// =================================================================
// HELPERS
// =================================================================
function getCinemaCats(lang)            { return CINEMA_CATS[lang] || CINEMA_CATS['en']; }
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
  if (level <= 3)      return all.filter(function(v){ return v.diff === '🟢'; });
  else if (level <= 7) return all.filter(function(v){ return v.diff === '🟢' || v.diff === '🟡'; });
  else                 return all;
}

// =================================================================
// ÉTAT CINÉMA
// =================================================================
var currentCinemaLang   = '';
var currentCinemaCat    = '';
var currentCinemaVideos = [];

// =================================================================
// MODE NETFLIX
// =================================================================
function openCinema() {
  currentCinemaLang = S.targetLang;
  var cats = getCinemaCats(currentCinemaLang);
  var langLabels = {en:'English',fr:'Français',es:'Español',ht:'Kreyòl',
                    de:'Deutsch',ru:'Русский',zh:'中文',ja:'日本語'};
  document.getElementById('cinema-title').textContent =
    '🎬 ' + (langLabels[currentCinemaLang] || 'Cinéma');
  document.getElementById('cinema-lang-badge').textContent =
    FLAGS[currentCinemaLang] || '';

  document.getElementById('cinemaCats').innerHTML = cats.map(function(c, i) {
    return '<button onclick="loadCinemaCategory(\'' + c.key + '\')" id="ccat-' + c.key + '"'
      + ' style="flex:0 0 auto;background:transparent;border:none;'
      + 'border-bottom:2px solid ' + (i===0 ? '#e040fb' : 'transparent') + ';'
      + 'color:' + (i===0 ? '#e040fb' : 'var(--dim)') + ';'
      + 'padding:10px 14px 8px;font-size:0.72rem;font-weight:800;'
      + 'cursor:pointer;font-family:\'Nunito\',sans-serif;white-space:nowrap;">'
      + c.icon + ' ' + c.label + '</button>';
  }).join('');

  if (cats.length) loadCinemaCategory(cats[0].key);
  showScreen('screen-cinema');
  if (typeof updateStreak === 'function') updateStreak();
}

function loadCinemaCategory(catKey) {
  currentCinemaCat = catKey;
  var cats = getCinemaCats(currentCinemaLang);
  cats.forEach(function(c) {
    var el = document.getElementById('ccat-' + c.key);
    if (el) {
      el.style.borderBottomColor = c.key === catKey ? '#e040fb' : 'transparent';
      el.style.color             = c.key === catKey ? '#e040fb' : 'var(--dim)';
    }
  });
  currentCinemaVideos = getCinemaVideos(currentCinemaLang, catKey);
  buildVideoGrid(currentCinemaVideos);
}

// =================================================================
// GRILLE STYLE NETFLIX — scroll horizontal
// =================================================================
function buildVideoGrid(videos) {
  var listEl = document.getElementById('videoList');
  if (!listEl) return;

  if (!videos.length) {
    listEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--dim)">'
      + '<div style="font-size:2rem;margin-bottom:10px">🎬</div>'
      + '<div>Bientôt disponible pour cette catégorie</div></div>';
    return;
  }

  listEl.innerHTML = '<div style="display:flex;gap:12px;overflow-x:auto;padding-bottom:8px;'
    + 'scrollbar-width:thin;scrollbar-color:rgba(224,64,251,0.3) transparent;'
    + 'scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;">'
    + videos.map(function(v) {
        var thumb = 'https://img.youtube.com/vi/' + v.id + '/mqdefault.jpg';
        var safeT = v.t.replace(/'/g, '&apos;');
        return '<div onclick="openArchiveVideo(\'' + v.id + '\',\'' + safeT + '\')"'
          + ' style="flex:0 0 200px;border-radius:12px;overflow:hidden;cursor:pointer;'
          + 'border:1px solid rgba(224,64,251,0.2);scroll-snap-align:start;'
          + 'transition:transform 0.18s,border-color 0.18s;background:var(--bg-card);"'
          + ' onmouseover="this.style.transform=\'scale(1.05)\';this.style.borderColor=\'rgba(224,64,251,0.7)\'"'
          + ' onmouseout="this.style.transform=\'scale(1)\';this.style.borderColor=\'rgba(224,64,251,0.2)\'">'
          + '<div style="position:relative;width:100%;padding-bottom:56.25%;background:linear-gradient(135deg,#1a0a2e,#0a0a14);">'
          + '<img src="' + thumb + '" onerror="this.style.display=\'none\'"'
          + ' style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.85;">'
          + '<div style="position:absolute;top:6px;left:6px;background:rgba(0,0,0,0.75);'
          + 'padding:2px 7px;border-radius:8px;font-size:0.6rem;color:#fff;font-weight:800;">'
          + (v.diff||'') + '</div>'
          + '<div style="position:absolute;bottom:5px;right:7px;background:rgba(224,64,251,0.85);'
          + 'padding:2px 7px;border-radius:6px;font-size:0.58rem;color:#fff;font-weight:900;">🌐 LIBRE</div>'
          + '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;'
          + 'background:rgba(0,0,0,0.35);opacity:0;transition:opacity .2s;"'
          + ' onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0">'
          + '<div style="width:40px;height:40px;background:rgba(224,64,251,0.9);border-radius:50%;'
          + 'display:flex;align-items:center;justify-content:center;font-size:1.1rem;">▶</div></div>'
          + '</div>'
          + '<div style="padding:8px 10px 10px;">'
          + '<div style="font-size:0.78rem;font-weight:800;color:#e040fb;margin-bottom:3px;line-height:1.3;'
          + 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + v.t + '</div>'
          + '<div style="font-size:0.65rem;color:var(--dim);line-height:1.4;'
          + 'display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">'
          + v.d + '</div>'
          + '</div></div>';
      }).join('')
    + '</div>';
}

// =================================================================
// LECTEUR INLINE
// =================================================================
function openArchiveVideo(id, title) {
  var player = document.getElementById('cinemaPlayer');
  var wrap   = document.getElementById('cinemaPlayerWrap');
  var info   = document.getElementById('cinemaPlayerInfo');
  if (player && wrap && info) {
    player.src         = 'https://archive.org/embed/' + id + '?autoplay=1';
    wrap.style.display = 'block';
    info.style.display = 'block';
    document.getElementById('videoTitle').textContent = title || '';
    document.getElementById('videoDesc').textContent  =
      '📚 Source : Internet Archive — Domaine public';
    wrap.scrollIntoView({behavior:'smooth', block:'start'});
  }
  gainXP(5);
  showNotif('🎬 ' + (title||'').substring(0,28) + '…');
  setTimeout(function() { launchCinemaQuiz(id, title); }, 8000);
}

function closeCinemaPlayer() {
  var player = document.getElementById('cinemaPlayer');
  var wrap   = document.getElementById('cinemaPlayerWrap');
  var info   = document.getElementById('cinemaPlayerInfo');
  if (player) player.src = '';
  if (wrap)   wrap.style.display = 'none';
  if (info)   info.style.display = 'none';
}

// =================================================================
// MODE TIKTOK — bouton ⚡ Surprise dans le HUD village
// =================================================================
function launchSurpriseMode() {
  var lang   = S.targetLang;
  var level  = S.level || 1;
  var videos = getCinemaVideosByLevel(lang, level);
  if (!videos.length) { showNotif('Aucune vidéo disponible.'); return; }

  var pick = videos[Math.floor(Math.random() * videos.length)];
  var safeT = pick.t.replace(/'/g, '&apos;');

  var overlay = document.createElement('div');
  overlay.id  = 'tiktokOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:#000;z-index:9800;'
    + 'display:flex;flex-direction:column;';

  overlay.innerHTML =
    '<button onclick="closeSurpriseMode()" style="position:absolute;top:14px;right:14px;'
    + 'background:rgba(0,0,0,0.6);border:none;color:#fff;width:36px;height:36px;'
    + 'border-radius:50%;font-size:1.1rem;cursor:pointer;z-index:10;">&times;</button>'
    + '<div style="position:absolute;bottom:80px;left:0;right:0;padding:0 16px;z-index:10;">'
    + '<div style="font-weight:900;font-size:0.9rem;color:#fff;margin-bottom:4px;'
    + 'text-shadow:0 1px 8px rgba(0,0,0,0.8);">' + pick.t + '</div>'
    + '<div style="font-size:0.72rem;color:rgba(255,255,255,0.7);">'
    + pick.diff + ' &middot; 📚 Internet Archive</div>'
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
  gainXP(5);
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

// =================================================================
// QUIZ POST-VIDÉO — IA + cache localStorage
// =================================================================
async function launchCinemaQuiz(videoId, videoTitle) {
  var cached = (typeof getQuizFromCache === 'function') ? getQuizFromCache(videoId) : null;
  if (cached && cached.length) { showCinemaQuizUI(cached, videoTitle); return; }

  var nl  = S.nativeLang || 'fr';
  var nln = {fr:'français',en:'anglais',es:'espagnol',ht:'créole haïtien',
             de:'allemand',ru:'russe',zh:'mandarin',ja:'japonais'};

  var prompt = 'Génère exactement 3 questions QCM en ' + (nln[nl]||'français')
    + ' sur le contenu d\'une vidéo intitulée "' + videoTitle + '" en '
    + (nln[S.targetLang]||'anglais') + '. Teste la compréhension de la langue.'
    + ' Réponds UNIQUEMENT en JSON valide sans texte avant ni après :'
    + ' [{"q":"question","opts":["A","B","C","D"],"ans":0}]'
    + ' "ans" est l\'index 0-3 de la bonne réponse.';

  try {
    showNotif('⏳ Génération du quiz…');
    var r = await fetch(API + '/api/dialogue', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({npcName:'',npcRole:'',location:'',
        language: nln[nl]||'français',
        playerName: S.playerName||'Joueur',
        playerMessage: prompt, history:[]})
    });
    if (!r.ok) throw new Error('API ' + r.status);
    var d    = await r.json();
    var raw  = (d.reply||'[]').replace(/```json|```/g,'').trim();
    var quiz = JSON.parse(raw);
    if (!Array.isArray(quiz) || !quiz.length) throw new Error('Quiz vide');
    var questions = quiz.slice(0,3);
    if (typeof setQuizInCache === 'function') setQuizInCache(videoId, questions);
    showCinemaQuizUI(questions, videoTitle);
  } catch(e) {
    console.error('Quiz error:', e);
    showNotif('Quiz indisponible pour cette vidéo.');
  }
}

function showCinemaQuizUI(questions, videoTitle) {
  var current = 0, score = 0;
  var overlay = document.createElement('div');
  overlay.id  = 'quizOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);'
    + 'z-index:9900;display:flex;align-items:center;justify-content:center;padding:20px;';

  function render() {
    var q = questions[current];
    overlay.innerHTML =
      '<div style="background:linear-gradient(135deg,#0f0a20,#0a0a14);'
      + 'border:1px solid #e040fb;border-radius:20px;padding:24px;max-width:360px;width:100%;">'
      + '<div style="display:flex;justify-content:space-between;margin-bottom:12px;">'
      + '<span style="font-size:0.68rem;color:var(--dim);">🎬 Quiz vidéo</span>'
      + '<span style="font-size:0.68rem;color:#e040fb;font-weight:800;">'
      + (current+1) + ' / ' + questions.length + '</span></div>'
      + '<div style="font-size:0.92rem;font-weight:800;color:#f0e8d0;margin-bottom:18px;line-height:1.4;">'
      + q.q + '</div>'
      + q.opts.map(function(opt,i) {
          return '<button onclick="window._quizAnswer(' + i + ')"'
            + ' style="width:100%;text-align:left;background:rgba(255,255,255,0.05);'
            + 'border:1px solid rgba(255,255,255,0.12);border-radius:10px;'
            + 'padding:10px 14px;color:#f0e8d0;cursor:pointer;margin-bottom:8px;'
            + 'font-family:\'Nunito\',sans-serif;font-size:0.85rem;transition:all 0.15s;"'
            + ' onmouseover="this.style.background=\'rgba(224,64,251,0.15)\'"'
            + ' onmouseout="this.style.background=\'rgba(255,255,255,0.05)\'">'
            + opt + '</button>';
        }).join('')
      + '</div>';
    document.body.appendChild(overlay);
  }

  window._quizAnswer = function(i) {
    var q    = questions[current];
    var btns = overlay.querySelectorAll('button');
    btns[i].style.background           = 'rgba(224,64,251,0.15)';
    btns[i].style.borderColor          = i===q.ans ? '#4ecf70' : '#e05555';
    btns[q.ans].style.background       = 'rgba(78,207,112,0.2)';
    btns[q.ans].style.borderColor      = '#4ecf70';
    if (i === q.ans) score++;
    Array.from(btns).forEach(function(b){ b.disabled = true; });
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
  var xp  = score * 20;
  var el  = document.createElement('div');
  el.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);'
    + 'z-index:9900;display:flex;align-items:center;justify-content:center;';
  el.innerHTML =
    '<div style="background:linear-gradient(135deg,#0f0a20,#0a0a14);'
    + 'border:2px solid var(--gold);border-radius:20px;padding:28px 32px;text-align:center;max-width:280px;">'
    + '<div style="font-size:2.5rem;margin-bottom:8px;">'
    + (score===total?'🏆':score>=total/2?'⭐':'📚') + '</div>'
    + '<div style="font-family:\'Cinzel\',serif;color:var(--gold);font-size:1rem;margin-bottom:6px;">Quiz terminé !</div>'
    + '<div style="font-size:1.3rem;font-weight:900;color:#f0e8d0;margin-bottom:4px;">'
    + score + ' / ' + total + '</div>'
    + '<div style="font-size:0.8rem;color:#4ecf70;margin-bottom:16px;font-weight:800;">+' + xp + ' XP</div>'
    + '<button onclick="this.closest(\'div[style*=\\\"position\\\"\]\'+ \')\').remove()"'
    + ' style="background:linear-gradient(135deg,#a86800,#ffd700);border:none;'
    + 'border-radius:12px;padding:10px 28px;font-family:\'Cinzel\',serif;font-weight:700;cursor:pointer;">Continuer</button>'
    + '</div>';
  document.body.appendChild(el);
  gainXP(xp);
  if (score === total && typeof launchConfetti === 'function') launchConfetti();
  setTimeout(function(){ el.remove(); }, 5000);
       }
