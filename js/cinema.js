// LinguaVillage — cinema.js
// Cinéma : CINEMA_DATA avec vraies vidéos Internet Archive par langue
// Pour ajouter une vidéo : ajouter un objet dans CINEMA_DATA[langue]

const CINEMA_DATA = {
  fr: [
    {
      id: 'french_in_action',
      title: 'French in Action — Méthode Capretz',
      desc: 'Série complète 52 épisodes — immersion totale en français',
      level: '🟢 Débutant → Avancé',
      embed: 'https://archive.org/embed/french_in_action',
      thumb: '🎬'
    },
    {
      id: 'French1.3',
      title: 'FSI French Basic Course Vol.1',
      desc: 'Cours officiel du gouvernement américain — 80h audio',
      level: '🟢 Débutant',
      embed: 'https://archive.org/embed/French1.3',
      thumb: '🎓'
    },
    {
      id: 'FSIFrenchBasicCourseRevisedVolume1Unit1212.02',
      title: 'FSI French Basic Course — Révisé Vol.1',
      desc: 'Version révisée du cours FSI avec dialogues modernisés',
      level: '🟢 Débutant',
      embed: 'https://archive.org/embed/FSIFrenchBasicCourseRevisedVolume1Unit1212.02',
      thumb: '📚'
    },
    {
      id: 'LearnFrenchTheFastAndFunWayFrenchFree',
      title: 'Learn French — The Fast and Fun Way',
      desc: 'Méthode rapide et ludique pour apprendre le français',
      level: '🟢 Débutant',
      embed: 'https://archive.org/embed/LearnFrenchTheFastAndFunWayFrenchFree',
      thumb: '⚡'
    },
    {
      id: 'LearningFrenchARendezvousWithFrench-speakingCultures',
      title: 'Learning French — Rendez-vous avec la Francophonie',
      desc: 'Français et cultures francophones du monde',
      level: '🟡 Intermédiaire',
      embed: 'https://archive.org/embed/LearningFrenchARendezvousWithFrench-speakingCultures',
      thumb: '🌍'
    },
    {
      id: 'the-french-experience-disc-1',
      title: 'The French Experience — BBC',
      desc: 'Cours BBC pour débutants avec dialogues authentiques',
      level: '🟢 Débutant',
      embed: 'https://archive.org/embed/the-french-experience-disc-1',
      thumb: '📺'
    }
  ],
  es: [
    {
      id: 'se-habla-espanol',
      title: 'Se Habla Español — Palomar College',
      desc: 'Cours TV complet — 42 leçons de 30 minutes',
      level: '🟢 Débutant → Intermédiaire',
      embed: 'https://archive.org/embed/se-habla-espanol',
      thumb: '🎬'
    },
    {
      id: 'FSISpanishBasicCourseVolume1Unit07A',
      title: 'FSI Spanish Basic Course Vol.1',
      desc: 'Cours officiel gouvernement américain — espagnol',
      level: '🟢 Débutant',
      embed: 'https://archive.org/embed/FSISpanishBasicCourseVolume1Unit07A',
      thumb: '🎓'
    },
    {
      id: 'LearningSpanishHowToUnderstandAndSpeakANewLanguage',
      title: 'Learning Spanish — How to Understand and Speak',
      desc: 'Méthode complète compréhension et expression',
      level: '🟢 Débutant',
      embed: 'https://archive.org/embed/LearningSpanishHowToUnderstandAndSpeakANewLanguage',
      thumb: '📚'
    },
    {
      id: 'lp_living-spanish-a-complete-language-cour_living-spanish-a-complete-language-cour',
      title: 'Living Spanish — Cours Complet',
      desc: 'Méthode audio complète — dialogues naturels',
      level: '🟢 Débutant',
      embed: 'https://archive.org/embed/lp_living-spanish-a-complete-language-cour_living-spanish-a-complete-language-cour',
      thumb: '🎧'
    }
  ],
  en: [
    {
      id: 'EnglishConversationForThaiStudents',
      title: 'English Conversation — Complete Course',
      desc: 'Cours de conversation anglaise avec dialogues réels',
      level: '🟢 Débutant',
      embed: 'https://archive.org/embed/EnglishConversationForThaiStudents',
      thumb: '🎬'
    },
    {
      id: 'USGovernmentEnglishLanguageCourse',
      title: 'US Government English Course — FSI',
      desc: "Cours officiel d'anglais du gouvernement américain",
      level: '🟢 Débutant → Intermédiaire',
      embed: 'https://archive.org/embed/USGovernmentEnglishLanguageCourse',
      thumb: '🎓'
    },
    {
      id: 'EnglishListeningLessonLibraryOnline',
      title: 'ELLLO — English Listening Lessons Online',
      desc: "1000+ leçons d'écoute anglaise authentiques",
      level: '🟡 Intermédiaire',
      embed: 'https://archive.org/embed/EnglishListeningLessonLibraryOnline',
      thumb: '🎧'
    }
  ],
  de: [
    {
      id: 'FSIGermanBasicCourseVolume1Unit022.2',
      title: 'FSI German Basic Course Vol.1',
      desc: 'Cours officiel allemand du gouvernement américain',
      level: '🟢 Débutant',
      embed: 'https://archive.org/embed/FSIGermanBasicCourseVolume1Unit022.2',
      thumb: '🎓'
    },
    {
      id: 'FSIGermanBasicCourseVolume2Unit2121.1',
      title: 'FSI German Basic Course Vol.2',
      desc: 'Suite du cours FSI — grammaire et conversations',
      level: '🟡 Intermédiaire',
      embed: 'https://archive.org/embed/FSIGermanBasicCourseVolume2Unit2121.1',
      thumb: '📚'
    },
    {
      id: 'learn-german-for-beginners-an-immersive-language-journey-a-1',
      title: 'Learn German — Immersive Journey A1+',
      desc: 'Cours immersif avec exercices pratiques et vidéos',
      level: '🟢 Débutant',
      embed: 'https://archive.org/embed/learn-german-for-beginners-an-immersive-language-journey-a-1',
      thumb: '🎬'
    },
    {
      id: 'LearnGerman-CompletePcCourse',
      title: 'Learn German — Complete PC Course',
      desc: 'Cours complet multimédia avec exercices interactifs',
      level: '🟢 Débutant → Avancé',
      embed: 'https://archive.org/embed/LearnGerman-CompletePcCourse',
      thumb: '💻'
    }
  ],
  ru: [
    {
      id: 'FSIRussianFAST',
      title: 'FSI Russian FAST Course',
      desc: 'Cours accéléré de russe — gouvernement américain',
      level: '🟢 Débutant',
      embed: 'https://archive.org/embed/FSIRussianFAST',
      thumb: '🎓'
    },
    {
      id: 'RussianFSI',
      title: 'FSI Russian Basic Course',
      desc: 'Cours complet de russe avec prononciation cyrillique',
      level: '🟢 Débutant',
      embed: 'https://archive.org/embed/RussianFSI',
      thumb: '📚'
    },
    {
      id: 'LearnRussianComplete',
      title: 'Learn Russian — Living Language Complete',
      desc: 'Méthode complète russe — dialogue et grammaire',
      level: '🟢 Débutant',
      embed: 'https://archive.org/embed/LearnRussianComplete',
      thumb: '🎧'
    }
  ],
  zh: [
    {
      id: 'MandarinM1U1',
      title: 'FSI Mandarin — Module 1 Unité 1',
      desc: 'Cours FSI mandarin — prononciation et tons de base',
      level: '🟢 Débutant',
      embed: 'https://archive.org/embed/MandarinM1U1',
      thumb: '🎓'
    },
    {
      id: 'MandarinM1U2',
      title: 'FSI Mandarin — Module 1 Unité 2',
      desc: 'Salutations, nombres et expressions du quotidien',
      level: '🟢 Débutant',
      embed: 'https://archive.org/embed/MandarinM1U2',
      thumb: '📚'
    },
    {
      id: 'FSIStandardChinese',
      title: 'FSI Standard Chinese — Cours Complet',
      desc: 'Programme complet mandarin du gouvernement américain',
      level: '🟢 → 🔴 Tous niveaux',
      embed: 'https://archive.org/embed/FSIStandardChinese',
      thumb: '🎬'
    },
    {
      id: 'PronunciationAndRomanization',
      title: 'Chinese Pronunciation & Romanisation',
      desc: 'Maîtriser les tons et le système pinyin',
      level: '🟢 Débutant',
      embed: 'https://archive.org/embed/PronunciationAndRomanization',
      thumb: '🗣️'
    }
  ],
  ja: [
    {
      id: 'BBCJapaneseLanguageAndPeopleEp00Of10PreliminaryProgram1991',
      title: 'BBC Japanese Language and People',
      desc: 'Série BBC 1991 — japonais et culture japonaise',
      level: '🟢 Débutant',
      embed: 'https://archive.org/embed/BBCJapaneseLanguageAndPeopleEp00Of10PreliminaryProgram1991',
      thumb: '📺'
    },
    {
      id: 'audio_lesson_01',
      title: 'NHK Japanese Beginners Course',
      desc: 'Cours NHK officiel pour débutants absolus',
      level: '🟢 Débutant',
      embed: 'https://archive.org/embed/audio_lesson_01',
      thumb: '🎓'
    },
    {
      id: 'JapaneseLT',
      title: 'Japanese Listening Test — DLI',
      desc: 'Cours complet japonais — Defense Language Institute',
      level: '🟡 Intermédiaire',
      embed: 'https://archive.org/embed/JapaneseLT',
      thumb: '🎧'
    },
    {
      id: 'HowToSpeakJapaneseVideo',
      title: 'How to Speak Japanese — Video Course',
      desc: 'Cours vidéo japonais pour débutants',
      level: '🟢 Débutant',
      embed: 'https://archive.org/embed/HowToSpeakJapaneseVideo',
      thumb: '🎬'
    }
  ],
  ht: [
    {
      id: 'FSIHaitianCreoleCourse',
      title: 'FSI Haitian Creole — Cours Complet',
      desc: 'Cours officiel créole haïtien du gouvernement américain',
      level: '🟢 Débutant',
      embed: 'https://archive.org/embed/FSIHaitianCreoleCourse',
      thumb: '🎓'
    },
    {
      id: 'HaitianCreoleBasics',
      title: 'Haitian Creole Basics',
      desc: 'Introduction au créole haïtien — base et culture',
      level: '🟢 Débutant',
      embed: 'https://archive.org/embed/HaitianCreoleBasics',
      thumb: '📚'
    }
  ]
};

function openCinema() {
  var lang      = S.targetLang || 'fr';
  var videos    = CINEMA_DATA[lang] || CINEMA_DATA['fr'];
  var langNames = {fr:'Français',es:'Español',en:'English',de:'Deutsch',
                   ru:'Русский',zh:'中文',ja:'日本語',ht:'Kreyòl'};

  // Badge langue
  var badge = document.getElementById('cinema-lang-badge');
  if (badge) badge.textContent = (FLAGS[lang]||'') + ' ' + (langNames[lang]||lang);

  // Titre
  var titleEl = document.getElementById('cinema-title');
  if (titleEl) titleEl.textContent = '🎬 Cinéma — ' + (langNames[lang]||lang);

  // Stocker les données vidéo sur window pour cinemaPlay par index
  window._cinemaVideos = videos;

  // Zone player (réutilisée sans être détruite)
  var wrap  = document.getElementById('cinema-player-wrap');
  var info  = document.getElementById('cinema-playing-info');
  if (wrap && info) {
    // Conserver le player existant, juste cacher si rien en cours
    var player = document.getElementById('cinema-player');
    if (!player || !player.src || player.src === '' || player.src === window.location.href) {
      wrap.style.display = 'none';
      info.style.display = 'none';
    }
  }

  // Compteur
  var countEl = document.getElementById('cinema-count');
  if (countEl) countEl.textContent = videos.length + ' ressources en ' + (langNames[lang]||lang) + ' • Internet Archive';

  // Construire la liste de vidéos
  var listEl = document.getElementById('videoList');
  if (!listEl) return;

  var html = '';
  for (var idx = 0; idx < videos.length; idx++) {
    var v     = videos[idx];
    var safeT = escapeHtml(v.title || '');
    var safeD = escapeHtml(v.desc  || '');
    var safeLv= escapeHtml(v.level || '');
    html += '<div class="cinema-card" data-vidx="' + idx + '"'
      + ' style="display:flex;align-items:center;gap:12px;padding:14px;background:rgba(224,64,251,0.06);'
      + 'border:1px solid rgba(224,64,251,0.18);border-radius:14px;cursor:pointer;transition:all 0.2s;margin-bottom:10px;">'
      + '<div style="font-size:2rem;flex-shrink:0;">' + (v.thumb||'🎬') + '</div>'
      + '<div style="flex:1;min-width:0;">'
      + '<div style="font-weight:800;font-size:0.88rem;color:#e040fb;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + safeT + '</div>'
      + '<div style="font-size:0.72rem;color:var(--dim);margin-bottom:5px;">' + safeD + '</div>'
      + '<span style="font-size:0.65rem;font-weight:700;background:rgba(224,64,251,0.12);color:#e040fb;padding:2px 8px;border-radius:8px;">' + safeLv + '</span>'
      + '</div>'
      + '<div style="flex-shrink:0;font-size:1.5rem;">▶</div>'
      + '</div>';
  }
  listEl.innerHTML = html;

  // Délégation d'événements (robuste, pas de onclick inline)
  listEl.onclick = function(e) {
    var card = e.target.closest('[data-vidx]');
    if (!card) return;
    var vidx = parseInt(card.dataset.vidx, 10);
    var vd   = (window._cinemaVideos || [])[vidx];
    if (vd) cinemaPlay(vd.embed, vd.title, vd.desc);
  };

  showScreen('screen-cinema');
  gainXP(5);
  updateDailyProgress('cinema', 1);
}

function cinemaPlay(embedUrl, title, desc) {
  var player  = document.getElementById('cinema-player');
  var wrap    = document.getElementById('cinema-player-wrap');
  var info    = document.getElementById('cinema-playing-info');
  var titleEl = document.getElementById('cinema-playing-title');
  var descEl  = document.getElementById('cinema-playing-desc');

  if (!player) { showNotif('❌ Lecteur introuvable'); return; }
  if (!embedUrl) { showNotif('❌ URL manquante'); return; }

  // Forcer autoplay et fullscreen dans l'URL Internet Archive
  var url = embedUrl;
  if (url.indexOf('?') === -1) {
    url += '?autoplay=1&playlist=1';
  } else if (url.indexOf('autoplay') === -1) {
    url += '&autoplay=1';
  }

  // Mettre à jour l'iframe
  // Reset propre avant nouvelle lecture
  if (player.src && player.src !== '' && player.src !== 'about:blank') {
    player.src = 'about:blank';
  }
  player.src = url;
  player.allow = 'autoplay; fullscreen; picture-in-picture';

  if (wrap)    { wrap.style.display = 'block'; }
  if (info)    { info.style.display = 'block'; }
  if (titleEl) { titleEl.textContent = title || ''; }
  if (descEl)  { descEl.textContent  = desc  || ''; }

  // Scroll vers le player
  setTimeout(function() {
    if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);

  gainXP(10);
  showNotif('▶ Lecture : ' + (title || 'Vidéo'));
}

function cinemaStop() {
  var player = document.getElementById('cinema-player');
  var wrap   = document.getElementById('cinema-player-wrap');
  var info   = document.getElementById('cinema-playing-info');
  // Remplacer src par about:blank stoppe vraiment la lecture
  if (player) { player.src = 'about:blank'; player.src = ''; }
  if (wrap)   { wrap.style.display = 'none'; }
  if (info)   { info.style.display = 'none'; }
}
