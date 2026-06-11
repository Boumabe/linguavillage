// LinguaVillage — exam.js
// Moteur d'évaluations par leçon + Grands Examens avec PNJ examinateurs
// S'intègre dans le village : le PNJ de la leçon devient l'examinateur
// ================================================================

window.LV_EXAM = (function () {

  var _state = {
    open: false,
    type: null,         // 'lesson_eval' | 'grand_exam'
    levelId: null,
    lessonId: null,
    examId: null,
    questions: [],
    currentQ: 0,
    score: 0,
    maxScore: 0,
    answers: [],
    npc: null,
    onComplete: null,
  };

  // ================================================================
  // BANQUES DE QUESTIONS PAR TYPE
  // Générées dynamiquement selon la langue cible
  // ================================================================

  function _buildQuestions(type, lessonId, targetLang, nativeLang) {
    var tl = targetLang || (window.S && window.S.targetLang) || 'fr';
    var nl = nativeLang  || (window.S && window.S.nativeLang) || 'fr';

    var builders = {
      alphabet_recognition: _questionsAlphabet,
      dialogue_choice:      _questionsDialogue,
      fill_blank:           _questionsFillBlank,
      word_match:           _questionsWordMatch,
      conjugation:          _questionsConjugation,
      grammar_correction:   _questionsGrammar,
      sentence_building:    _questionsSentence,
      comprehension:        _questionsComprehension,
      register_match:       _questionsRegister,
      free_write:           _questionsFreeWrite,
      free_dialogue:        _questionsFreeDialogue,
      // Grand exam uses multiple types
      vocabulary:           _questionsWordMatch,
      grammar:              _questionsGrammar,
      phrases:              _questionsDialogue,
      culture:              _questionsComprehension,
    };

    var builder = builders[type] || _questionsWordMatch;
    return builder(lessonId, tl, nl);
  }

  // ── Questions Alphabet ────────────────────────────────────────
  function _questionsAlphabet(lessonId, tl, nl) {
    var pools = {
      ru: [
        { q: { fr:'Quelle lettre russe correspond à "A" ?', en:'Which Russian letter corresponds to "A"?' }, choices: ['А', 'Б', 'В', 'Г'], correct: 0 },
        { q: { fr:'Comment se prononce "Б" ?', en:'How is "Б" pronounced?' }, choices: ['ba', 'va', 'ga', 'da'], correct: 0 },
        { q: { fr:'Quelle lettre fait le son "V" en russe ?', en:'Which letter makes the "V" sound in Russian?' }, choices: ['В', 'Б', 'Д', 'Г'], correct: 0 },
        { q: { fr:'Comment s\'écrit le son "ya" en cyrillique ?', en:'How is the sound "ya" written in Cyrillic?' }, choices: ['Я', 'Е', 'Ю', 'И'], correct: 0 },
        { q: { fr:'Quel est le son de la lettre "Ш" ?', en:'What is the sound of the letter "Ш"?' }, choices: ['sh', 'ch', 'ts', 'zh'], correct: 0 },
      ],
      zh: [
        { q: { fr:'Quel est le ton de "mā" (妈) ?', en:'What tone is "mā" (妈)?' }, choices: ['1er ton (plat)', '2e ton (montant)', '3e ton (creux)', '4e ton (descendant)'], correct: 0 },
        { q: { fr:'Comment se prononce "x" en pinyin ?', en:'How is "x" pronounced in pinyin?' }, choices: ['si (doux)', 'kh', 'tch', 'sh'], correct: 0 },
        { q: { fr:'Quel pinyin correspond au son "dj" doux ?', en:'Which pinyin corresponds to the soft "dj" sound?' }, choices: ['j', 'zh', 'z', 'q'], correct: 0 },
        { q: { fr:'Le 3e ton en mandarin est...', en:'The 3rd tone in Mandarin is...' }, choices: ['Creux (bas puis haut)', 'Plat haut', 'Montant', 'Descendant bref'], correct: 0 },
      ],
      ja: [
        { q: { fr:'Quel hiragana correspond au son "ka" ?', en:'Which hiragana corresponds to the sound "ka"?' }, choices: ['か', 'き', 'く', 'こ'], correct: 0 },
        { q: { fr:'Comment lire "あ" ?', en:'How to read "あ"?' }, choices: ['a', 'i', 'u', 'e'], correct: 0 },
        { q: { fr:'Quel est le son de "し" ?', en:'What is the sound of "し"?' }, choices: ['shi', 'si', 'chi', 'tsu'], correct: 0 },
        { q: { fr:'Quel hiragana correspond à "tsu" ?', en:'Which hiragana is "tsu"?' }, choices: ['つ', 'て', 'と', 'た'], correct: 0 },
      ],
    };

    var defaultPool = [
      { q: { fr:'Quelle lettre vient après "A" dans l\'alphabet ?', en:'Which letter comes after "A" in the alphabet?' }, choices: ['B', 'C', 'D', 'E'], correct: 0 },
      { q: { fr:'Combien de lettres dans l\'alphabet latin ?', en:'How many letters in the Latin alphabet?' }, choices: ['26', '24', '28', '30'], correct: 0 },
      { q: { fr:'Quelle voyelle est absente : A, E, _, O, U ?', en:'Which vowel is missing: A, E, _, O, U?' }, choices: ['I', 'Y', 'W', 'H'], correct: 0 },
    ];

    return (pools[tl] || defaultPool).map(function (item) {
      return {
        type: 'mcq',
        question: item.q[nl] || item.q.fr || item.q.en,
        choices: item.choices,
        correct: item.correct,
        points: 10,
      };
    });
  }

  // ── Questions Dialogue (QCM) ─────────────────────────────────
  function _questionsDialogue(lessonId, tl, nl) {
    var pools = {
      fr: [
        { q: { fr:'Comment dit-on "Bonjour" en français ?', en:'How do you say "Hello" in French?' }, choices: ['Bonjour', 'Bonsoir', 'Au revoir', 'Merci'], correct: 0 },
        { q: { fr:'Que répond-on à "Ça va ?" en français ?', en:'What do you reply to "Ça va?" in French?' }, choices: ['Ça va bien, merci', 'Bonjour', 'Au revoir', 'S\'il vous plaît'], correct: 0 },
        { q: { fr:'Comment demander "Comment t\'appelles-tu ?" ?', en:'How to ask someone\'s name in French?' }, choices: ['Comment tu t\'appelles ?', 'Où tu vas ?', 'Qu\'est-ce que tu fais ?', 'Tu as quel âge ?'], correct: 0 },
      ],
      en: [
        { q: { fr:'Comment dire "Bonjour" en anglais ?', en:'How do you say "Hello" in English?' }, choices: ['Hello', 'Goodbye', 'Please', 'Thank you'], correct: 0 },
        { q: { fr:'Que veut dire "How are you?" ?', en:'What does "How are you?" mean?' }, choices: ['Comment allez-vous ?', 'Où allez-vous ?', 'Que faites-vous ?', 'Qui êtes-vous ?'], correct: 0 },
        { q: { fr:'Comment répondre à "Thank you" ?', en:'How to reply to "Thank you"?' }, choices: ['You\'re welcome', 'Sorry', 'Please', 'Excuse me'], correct: 0 },
      ],
      es: [
        { q: { fr:'Comment dire "Bonjour" le matin en espagnol ?', en:'How to say "Good morning" in Spanish?' }, choices: ['Buenos días', 'Buenas noches', 'Hasta luego', 'Por favor'], correct: 0 },
        { q: { fr:'Que signifie "¿Cómo estás?" ?', en:'What does "¿Cómo estás?" mean?' }, choices: ['Comment vas-tu ?', 'Où vas-tu ?', 'Que fais-tu ?', 'Qui es-tu ?'], correct: 0 },
      ],
      de: [
        { q: { fr:'Comment dire "Bonjour" en allemand ?', en:'How to say "Hello" in German?' }, choices: ['Hallo', 'Auf Wiedersehen', 'Danke', 'Bitte'], correct: 0 },
        { q: { fr:'Que veut dire "Wie geht es Ihnen?" ?', en:'What does "Wie geht es Ihnen?" mean?' }, choices: ['Comment allez-vous ?', 'Où allez-vous ?', 'Merci beaucoup', 'Au revoir'], correct: 0 },
      ],
      ht: [
        { q: { fr:'Comment dire "Bonjour" en créole ?', en:'How to say "Hello" in Creole?' }, choices: ['Bonjou', 'Orevwa', 'Mèsi', 'Tanpri'], correct: 0 },
        { q: { fr:'Que répond-on à "Kijan ou ye?" ?', en:'What do you reply to "Kijan ou ye?"?' }, choices: ['Mwen byen, mèsi', 'Bonjou', 'Orevwa', 'Wi'], correct: 0 },
      ],
    };
    var pool = pools[tl] || pools.fr;
    return pool.map(function (item) {
      return { type: 'mcq', question: item.q[nl] || item.q.fr || item.q.en, choices: item.choices, correct: item.correct, points: 10 };
    });
  }

  // ── Questions Fill-in-the-blank ──────────────────────────────
  function _questionsFillBlank(lessonId, tl, nl) {
    var pools = {
      fr: [
        { q: { fr:'Complète : "Je ___ étudiant."', en:'Complete: "Je ___ étudiant."' }, choices: ['suis', 'ai', 'vais', 'fais'], correct: 0 },
        { q: { fr:'Complète : "Elle ___ une pomme."', en:'Complete: "Elle ___ une pomme."' }, choices: ['mange', 'boire', 'fait', 'va'], correct: 0 },
        { q: { fr:'Complète : "___ vous plaît !"', en:'Complete: "___ vous plaît!"' }, choices: ['S\'il', 'Si le', 'Si la', 'Si les'], correct: 0 },
      ],
      en: [
        { q: { fr:'Complète : "I ___ a student."', en:'Complete: "I ___ a student."' }, choices: ['am', 'is', 'are', 'be'], correct: 0 },
        { q: { fr:'Complète : "She ___ an apple."', en:'Complete: "She ___ an apple."' }, choices: ['eats', 'eat', 'eating', 'eaten'], correct: 0 },
        { q: { fr:'Complète : "Thank ___ very much."', en:'Complete: "Thank ___ very much."' }, choices: ['you', 'me', 'him', 'her'], correct: 0 },
      ],
      es: [
        { q: { fr:'Complète : "Yo ___ estudiante."', en:'Complete: "Yo ___ estudiante."' }, choices: ['soy', 'es', 'eres', 'somos'], correct: 0 },
        { q: { fr:'Complète : "Ella ___ una manzana."', en:'Complete: "Ella ___ una manzana."' }, choices: ['come', 'como', 'comes', 'comen'], correct: 0 },
      ],
    };
    var pool = pools[tl] || pools.fr;
    return pool.map(function (item) {
      return { type: 'mcq', question: item.q[nl] || item.q.fr || item.q.en, choices: item.choices, correct: item.correct, points: 10 };
    });
  }

  // ── Questions Word Match ─────────────────────────────────────
  function _questionsWordMatch(lessonId, tl, nl) {
    var vocabPairs = {
      fr: [
        { native: { fr:'manger', ht:'manje', en:'to eat', es:'comer', de:'essen', ru:'есть', zh:'吃', ja:'食べる' }, target: { fr:'manger', en:'to eat', es:'comer', de:'essen', ru:'есть', zh:'吃', ja:'食べる', ht:'manje' }, wrong: { fr:['boire','dormir','marcher'], en:['drink','sleep','walk'], es:['beber','dormir','caminar'], de:['trinken','schlafen','gehen'], ru:['пить','спать','ходить'], zh:['喝','睡觉','走路'], ja:['飲む','寝る','歩く'], ht:['bwè','dòmi','mache'] } },
        { native: { fr:'maison', ht:'kay', en:'house', es:'casa', de:'Haus', ru:'дом', zh:'房子', ja:'家' }, target: { fr:'maison', en:'house', es:'casa', de:'Haus', ru:'дом', zh:'房子', ja:'家', ht:'kay' }, wrong: { fr:['école','marché','forêt'], en:['school','market','forest'], es:['escuela','mercado','bosque'], de:['Schule','Markt','Wald'], ru:['школа','рынок','лес'], zh:['学校','市场','森林'], ja:['学校','市場','森'], ht:['lekòl','mache','forè'] } },
        { native: { fr:'eau', ht:'dlo', en:'water', es:'agua', de:'Wasser', ru:'вода', zh:'水', ja:'水' }, target: { fr:'eau', en:'water', es:'agua', de:'Wasser', ru:'вода', zh:'水', ja:'水', ht:'dlo' }, wrong: { fr:['feu','pain','lait'], en:['fire','bread','milk'], es:['fuego','pan','leche'], de:['Feuer','Brot','Milch'], ru:['огонь','хлеб','молоко'], zh:['火','面包','牛奶'], ja:['火','パン','牛乳'], ht:['dife','pen','lèt'] } },
      ],
    };

    var pairs = vocabPairs.fr; // Utiliser les paires de base
    return pairs.map(function (pair) {
      var nativeWord  = pair.native[nl]  || pair.native.fr;
      var targetWord  = pair.target[tl]  || pair.target.fr;
      var wrongWords  = (pair.wrong[tl]  || pair.wrong.fr).slice(0, 3);
      var allChoices  = [targetWord].concat(wrongWords).sort(function() { return Math.random() - 0.5; });
      var correctIdx  = allChoices.indexOf(targetWord);
      var questions   = { fr: 'Comment dit-on "' + nativeWord + '" ?', en: 'How do you say "' + nativeWord + '"?', es: '¿Cómo se dice "' + nativeWord + '"?', ht: 'Kijan ou di "' + nativeWord + '" ?', de: 'Wie sagt man "' + nativeWord + '"?', ru: 'Как сказать "' + nativeWord + '"?', zh: '"' + nativeWord + '"怎么说？', ja: '"' + nativeWord + '"はどう言いますか？' };
      return { type: 'mcq', question: questions[nl] || questions.fr, choices: allChoices, correct: correctIdx, points: 10 };
    });
  }

  // ── Questions Conjugaison ────────────────────────────────────
  function _questionsConjugation(lessonId, tl, nl) {
    var pools = {
      fr: [
        { q: { fr:'Conjuguez "être" à la 1ère personne du singulier', en:'Conjugate "être" in 1st person singular' }, choices: ['Je suis', 'Je ai', 'Je est', 'Je avoir'], correct: 0 },
        { q: { fr:'Conjuguez "aller" à la 3ème personne du singulier', en:'Conjugate "aller" in 3rd person singular' }, choices: ['Il va', 'Il aller', 'Il allez', 'Il allons'], correct: 0 },
        { q: { fr:'"Nous" + "avoir" au présent ?', en:'"Nous" + "avoir" in present?' }, choices: ['Nous avons', 'Nous avez', 'Nous ont', 'Nous avo'], correct: 0 },
      ],
      en: [
        { q: { fr:'Conjuguez "to be" à la 1ère personne', en:'Conjugate "to be" in 1st person' }, choices: ['I am', 'I is', 'I be', 'I are'], correct: 0 },
        { q: { fr:'"He" + "to go" au présent ?', en:'"He" + "to go" in present?' }, choices: ['He goes', 'He go', 'He went', 'He going'], correct: 0 },
        { q: { fr:'"They" + "to have" au présent ?', en:'"They" + "to have" in present?' }, choices: ['They have', 'They has', 'They had', 'They haves'], correct: 0 },
      ],
      es: [
        { q: { fr:'Conjuguez "ser" à la 1ère personne', en:'Conjugate "ser" in 1st person' }, choices: ['Yo soy', 'Yo es', 'Yo eres', 'Yo ser'], correct: 0 },
        { q: { fr:'"Él" + "ir" au présent ?', en:'"Él" + "ir" in present?' }, choices: ['Él va', 'Él ir', 'Él vas', 'Él vamos'], correct: 0 },
      ],
    };
    var pool = pools[tl] || pools.fr;
    return pool.map(function (item) {
      return { type: 'mcq', question: item.q[nl] || item.q.fr, choices: item.choices, correct: item.correct, points: 15 };
    });
  }

  // ── Questions Grammaire ──────────────────────────────────────
  function _questionsGrammar(lessonId, tl, nl) {
    var pools = {
      fr: [
        { q: { fr:'Laquelle de ces phrases est correcte ?', en:'Which sentence is correct?' }, choices: ['Je mange une pomme', 'Je mange un pomme', 'Je manger une pomme', 'Moi mange une pomme'], correct: 0 },
        { q: { fr:'Quel est l\'article correct pour "livre" (masculin) ?', en:'What is the correct article for "livre" (masculine)?' }, choices: ['un livre', 'une livre', 'des livre', 'le livres'], correct: 0 },
        { q: { fr:'Quelle phrase utilise le passé composé ?', en:'Which sentence uses past tense?' }, choices: ['J\'ai mangé', 'Je mange', 'Je mangerai', 'Je mangerais'], correct: 0 },
      ],
      en: [
        { q: { fr:'Quelle phrase est correcte ?', en:'Which sentence is correct?' }, choices: ['She is eating', 'She eating', 'She are eating', 'She eat'], correct: 0 },
        { q: { fr:'Quel article pour "umbrella" ?', en:'Which article for "umbrella"?' }, choices: ['an umbrella', 'a umbrella', 'the a umbrella', 'some umbrella'], correct: 0 },
      ],
    };
    var pool = pools[tl] || pools.fr;
    return pool.map(function (item) {
      return { type: 'mcq', question: item.q[nl] || item.q.fr, choices: item.choices, correct: item.correct, points: 15 };
    });
  }

  // ── Questions Construction de phrase ────────────────────────
  function _questionsSentence(lessonId, tl, nl) {
    return _questionsGrammar(lessonId, tl, nl); // fallback grammatical
  }

  // ── Questions Compréhension ──────────────────────────────────
  function _questionsComprehension(lessonId, tl, nl) {
    var pools = {
      fr: [
        { text: { fr:'"Marie mange une pomme dans le jardin."', en:'"Marie eats an apple in the garden."' }, q: { fr:'Où est Marie ?', en:'Where is Marie?' }, choices: ['Dans le jardin', 'Dans la maison', 'Au marché', 'À l\'école'], correct: 0 },
        { text: { fr:'"Il fait beau aujourd\'hui. Paul va à la plage avec ses amis."', en:'"The weather is nice today. Paul goes to the beach with his friends."' }, q: { fr:'Avec qui Paul va-t-il à la plage ?', en:'Who does Paul go to the beach with?' }, choices: ['Ses amis', 'Sa famille', 'Son chien', 'Seul'], correct: 0 },
      ],
      en: [
        { text: { fr:'"Tom reads a book in the park every morning."', en:'"Tom reads a book in the park every morning."' }, q: { fr:'Où Tom lit-il ?', en:'Where does Tom read?' }, choices: ['In the park', 'At home', 'At school', 'In the library'], correct: 0 },
      ],
    };
    var pool = pools[tl] || pools.fr;
    return pool.map(function (item) {
      var textStr = item.text[nl] || item.text.fr;
      var qStr    = item.q[nl]    || item.q.fr;
      return { type: 'comprehension', passage: textStr, question: qStr, choices: item.choices, correct: item.correct, points: 20 };
    });
  }

  // ── Questions Registre ───────────────────────────────────────
  function _questionsRegister(lessonId, tl, nl) {
    return _questionsDialogue(lessonId, tl, nl); // fallback
  }

  // ── Questions Écriture libre ─────────────────────────────────
  function _questionsFreeWrite(lessonId, tl, nl) {
    var prompts = {
      fr: { fr: 'Écrivez 2 phrases pour vous présenter en français.', en: 'Write 2 sentences to introduce yourself in French.' },
      en: { fr: 'Écrivez 2 phrases pour vous présenter en anglais.', en: 'Write 2 sentences to introduce yourself in English.' },
      es: { fr: 'Écrivez 2 phrases pour vous présenter en espagnol.', en: 'Write 2 sentences to introduce yourself in Spanish.' },
      de: { fr: 'Écrivez 2 phrases pour vous présenter en allemand.', en: 'Write 2 sentences to introduce yourself in German.' },
      ht: { fr: 'Écrivez 2 phrases pour vous présenter en créole.', en: 'Write 2 sentences to introduce yourself in Creole.' },
    };
    var prompt = prompts[tl] || prompts.fr;
    return [{ type: 'free_text', question: prompt[nl] || prompt.fr, minLength: 10, points: 30 }];
  }

  // ── Questions Dialogue libre (via IA) ────────────────────────
  function _questionsFreeDialogue(lessonId, tl, nl) {
    var prompts = {
      fr: { fr: 'Parlez librement avec le PNJ pendant 3 échanges pour valider votre niveau.', en: 'Speak freely with the NPC for 3 exchanges to validate your level.' },
      en: { fr: 'Parlez librement avec le PNJ pendant 3 échanges.', en: 'Speak freely with the NPC for 3 exchanges.' },
    };
    var prompt = prompts[tl] || prompts.fr;
    return [{ type: 'free_dialogue', question: prompt[nl] || prompt.fr, minExchanges: 3, points: 40 }];
  }

  // ================================================================
  // OUVERTURE D'UNE ÉVALUATION DE LEÇON
  // ================================================================
  function openLessonEval(levelId, lessonId) {
    var C       = window.LV_CURRICULUM;
    if (!C) { console.error('curriculum.js manquant'); return; }

    var lesson  = C.getLesson(levelId, lessonId);
    if (!lesson) { if (typeof showNotif === 'function') showNotif('❌ Leçon introuvable'); return; }

    if (!C.isEvalUnlocked(levelId, lessonId)) {
      var nl = (window.S && window.S.nativeLang) || 'fr';
      var msg = { fr: '🔒 Gagnez plus de XP dans cette leçon pour débloquer l\'évaluation !', en: '🔒 Earn more XP in this lesson to unlock the evaluation!', es: '🔒 ¡Gana más XP en esta lección para desbloquear la evaluación!', ht: '🔒 Rantre plis XP nan leson sa a pou debloke evaliyasyon an!', de: '🔒 Verdiene mehr XP in dieser Lektion, um die Bewertung freizuschalten!', ru: '🔒 Заработайте больше XP в этом уроке, чтобы разблокировать оценку!', zh: '🔒 在本课中获得更多XP以解锁测验！', ja: '🔒 このレッスンでXPを獲得して評価をアンロックしましょう！' };
      if (typeof showNotif === 'function') showNotif(msg[nl] || msg.fr, 3500);
      return;
    }

    if (C.isEvalPassed(levelId, lessonId)) {
      var nl = (window.S && window.S.nativeLang) || 'fr';
      var msg = { fr: '✅ Vous avez déjà réussi cette évaluation !', en: '✅ You already passed this evaluation!', es: '✅ ¡Ya pasaste esta evaluación!', ht: '✅ Ou deja pase evaliyasyon sa a!', de: '✅ Sie haben diese Bewertung bereits bestanden!', ru: '✅ Вы уже сдали эту оценку!', zh: '✅ 您已通过此测验！', ja: '✅ この評価はすでに合格しています！' };
      if (typeof showNotif === 'function') showNotif(msg[nl] || msg.fr, 3000);
      return;
    }

    var tl = (window.S && window.S.targetLang) || 'fr';
    var nl = (window.S && window.S.nativeLang) || 'fr';

    var questions = _buildQuestions(lesson.evalType, lessonId, tl, nl);
    if (!questions.length) { if (typeof showNotif === 'function') showNotif('❌ Questions non disponibles'); return; }

    _state = {
      open: true,
      type: 'lesson_eval',
      levelId: levelId,
      lessonId: lessonId,
      examId: null,
      questions: questions,
      currentQ: 0,
      score: 0,
      maxScore: questions.reduce(function (s, q) { return s + (q.points || 10); }, 0),
      answers: [],
      npc: lesson.evalNPC,
      onComplete: null,
    };

    _buildEvalUI(lesson, null);
  }

  // ================================================================
  // OUVERTURE D'UN GRAND EXAMEN
  // ================================================================
  function openGrandExam(levelId) {
    var C = window.LV_CURRICULUM;
    if (!C) { console.error('curriculum.js manquant'); return; }

    if (!C.isGrandExamUnlocked(levelId)) {
      var nl  = (window.S && window.S.nativeLang) || 'fr';
      var msg = { fr: '🔒 Réussissez toutes les évaluations du niveau pour accéder au Grand Examen !', en: '🔒 Pass all level evaluations to access the Major Exam!', es: '🔒 ¡Pasa todas las evaluaciones del nivel para acceder al Gran Examen!', ht: '🔒 Pase tout evaliyasyon nivo a pou jwenn aksè nan Gran Egzamen an!', de: '🔒 Bestehe alle Level-Bewertungen, um zur Hauptprüfung zu gelangen!', ru: '🔒 Сдайте все оценки уровня, чтобы получить доступ к главному экзамену!', zh: '🔒 通过所有级别测验以访问大考！', ja: '🔒 レベルの全評価に合格して大試験にアクセスしましょう！' };
      if (typeof showNotif === 'function') showNotif(msg[nl] || msg.fr, 4000);
      return;
    }

    var exam = C.getGrandExam(levelId);
    if (!exam) return;

    var tl = (window.S && window.S.targetLang) || 'fr';
    var nl = (window.S && window.S.nativeLang) || 'fr';

    // Construire un set de questions mixtes pour le grand examen
    var allQ = [];
    exam.sections.forEach(function (section) {
      var qs = _buildQuestions(section, levelId, tl, nl);
      allQ = allQ.concat(qs.slice(0, 2)); // 2 questions par section
    });

    _state = {
      open: true,
      type: 'grand_exam',
      levelId: levelId,
      lessonId: null,
      examId: exam.id,
      questions: allQ,
      currentQ: 0,
      score: 0,
      maxScore: allQ.reduce(function (s, q) { return s + (q.points || 10); }, 0),
      answers: [],
      npc: exam.examinerNPC,
      onComplete: null,
    };

    _buildGrandExamUI(exam, nl);
  }

  // ================================================================
  // CONSTRUCTION UI — ÉVALUATION DE LEÇON
  // ================================================================
  function _buildEvalUI(lesson, callback) {
    var nl    = (window.S && window.S.nativeLang) || 'fr';
    var title = lesson.title[nl] || lesson.title.fr;
    var old   = document.getElementById('lv-exam-overlay');
    if (old) old.remove();

    var overlay = document.createElement('div');
    overlay.id  = 'lv-exam-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:8000;background:rgba(4,6,14,0.97);display:flex;flex-direction:column;animation:examFadeIn 0.25s ease;';
    overlay.innerHTML = '<style>@keyframes examFadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}</style>'
      + '<div style="display:flex;align-items:center;gap:12px;padding:14px 16px;background:rgba(78,207,112,0.06);border-bottom:1px solid rgba(78,207,112,0.15);">'
      + '<button onclick="window.LV_EXAM.close()" style="background:rgba(255,255,255,0.06);border:none;border-radius:50%;width:36px;height:36px;color:#e8e0d0;font-size:1rem;cursor:pointer;">✕</button>'
      + '<div style="font-size:1.4rem;">' + lesson.icon + '</div>'
      + '<div style="flex:1;">'
      + '<div style="font-weight:800;font-size:0.95rem;color:#4ecf70;">' + (window.escapeHtml ? window.escapeHtml(title) : title) + '</div>'
      + '<div style="font-size:0.68rem;color:rgba(255,255,255,0.35);">Évaluation · ' + _state.questions.length + ' questions</div>'
      + '</div></div>'
      + '<div id="lv-exam-progress" style="height:3px;background:rgba(78,207,112,0.12);"><div id="lv-exam-progress-fill" style="height:100%;background:#4ecf70;width:0%;transition:width 0.4s ease;border-radius:2px;"></div></div>'
      + '<div id="lv-exam-body" style="flex:1;overflow-y:auto;padding:20px 16px;display:flex;flex-direction:column;gap:14px;"></div>'
      + '<div id="lv-exam-footer" style="padding:12px 16px;padding-bottom:max(12px,env(safe-area-inset-bottom));border-top:1px solid rgba(255,255,255,0.06);"></div>';

    document.body.appendChild(overlay);
    _renderQuestion();
  }

  // ================================================================
  // CONSTRUCTION UI — GRAND EXAMEN (intro PNJ)
  // ================================================================
  function _buildGrandExamUI(exam, nl) {
    var old = document.getElementById('lv-exam-overlay');
    if (old) old.remove();

    var playerName = (window.S && window.S.playerName) || 'Apprenant';
    var intro      = (exam.examinerIntro[nl] || exam.examinerIntro.fr || '').replace('{name}', playerName);
    var title      = exam.title[nl] || exam.title.fr;

    // NPC data
    var npcData = {
      elder:    { name: 'Grand-père Koffi', emoji: '👴', color: '#4a9eff' },
      teacher:  { name: 'Mme Dupont',       emoji: '👩‍🏫', color: '#4ecf70' },
      director: { name: 'Réalisateur Félix',emoji: '🎥',  color: '#c084fc' },
    };
    var npc = npcData[exam.examinerNPC] || { name: exam.examinerNPC, emoji: '🧑', color: '#ffd700' };

    var overlay = document.createElement('div');
    overlay.id  = 'lv-exam-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:8000;background:rgba(4,6,14,0.97);display:flex;flex-direction:column;animation:examFadeIn 0.25s ease;';
    overlay.innerHTML = '<style>@keyframes examFadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}</style>'
      + '<div style="display:flex;align-items:center;gap:12px;padding:14px 16px;background:rgba(255,215,0,0.05);border-bottom:1px solid rgba(255,215,0,0.15);">'
      + '<button onclick="window.LV_EXAM.close()" style="background:rgba(255,255,255,0.06);border:none;border-radius:50%;width:36px;height:36px;color:#e8e0d0;font-size:1rem;cursor:pointer;">✕</button>'
      + '<div style="font-size:1.6rem;">' + npc.emoji + '</div>'
      + '<div style="flex:1;">'
      + '<div style="font-family:Cinzel,serif;font-weight:800;font-size:0.9rem;color:#ffd700;">🏆 Grand Examen</div>'
      + '<div style="font-size:0.68rem;color:rgba(255,255,255,0.35);">' + npc.name + ' · ' + _state.questions.length + ' questions</div>'
      + '</div></div>'
      + '<div style="flex:1;overflow-y:auto;padding:24px 20px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;text-align:center;">'
      + '<div style="font-size:4rem;">🏛️</div>'
      + '<div style="font-family:Cinzel,serif;font-size:1.1rem;font-weight:700;color:#ffd700;line-height:1.4;">' + (window.escapeHtml ? window.escapeHtml(title) : title) + '</div>'
      + '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,215,0,0.12);border-radius:16px;padding:16px 20px;max-width:360px;">'
      + '<div style="font-size:1.5rem;margin-bottom:8px;">' + npc.emoji + '</div>'
      + '<div style="font-size:0.85rem;color:#e8e0d0;line-height:1.6;font-style:italic;">"' + (window.escapeHtml ? window.escapeHtml(intro) : intro) + '"</div>'
      + '</div>'
      + '<div style="font-size:0.75rem;color:rgba(255,255,255,0.35);">Score minimum requis : ' + exam.passingScore + '%</div>'
      + '<button id="lv-grand-exam-start" style="background:linear-gradient(135deg,#ffd700,#ff9f43);border:none;border-radius:16px;padding:14px 32px;font-family:Cinzel,serif;font-weight:800;font-size:0.95rem;color:#000;cursor:pointer;letter-spacing:0.05em;">⚔️ Commencer l\'Examen</button>'
      + '</div>';

    document.body.appendChild(overlay);

    document.getElementById('lv-grand-exam-start').onclick = function () {
      var body = overlay.querySelector('[style*="flex:1;overflow-y:auto;padding:24px"]');
      if (body) {
        body.style.cssText = 'flex:1;overflow-y:auto;padding:20px 16px;display:flex;flex-direction:column;gap:14px;';
        body.id = 'lv-exam-body';
      }
      // Ajouter le header de progression
      var prog = document.createElement('div');
      prog.id  = 'lv-exam-progress';
      prog.style.cssText = 'height:3px;background:rgba(255,215,0,0.12);';
      prog.innerHTML = '<div id="lv-exam-progress-fill" style="height:100%;background:#ffd700;width:0%;transition:width 0.4s ease;border-radius:2px;"></div>';
      overlay.insertBefore(prog, body);
      // Footer
      var footer = document.createElement('div');
      footer.id  = 'lv-exam-footer';
      footer.style.cssText = 'padding:12px 16px;padding-bottom:max(12px,env(safe-area-inset-bottom));border-top:1px solid rgba(255,255,255,0.06);';
      overlay.appendChild(footer);

      _renderQuestion();
    };
  }

  // ================================================================
  // RENDU D'UNE QUESTION
  // ================================================================
  function _renderQuestion() {
    var body   = document.getElementById('lv-exam-body');
    var footer = document.getElementById('lv-exam-footer');
    if (!body) return;

    var q     = _state.questions[_state.currentQ];
    var nl    = (window.S && window.S.nativeLang) || 'fr';
    var total = _state.questions.length;
    var idx   = _state.currentQ;

    // Update progress bar
    var fill = document.getElementById('lv-exam-progress-fill');
    if (fill) fill.style.width = Math.round((idx / total) * 100) + '%';

    body.innerHTML = '';
    footer.innerHTML = '';

    // Indicateur question
    var qNum = document.createElement('div');
    qNum.style.cssText = 'font-size:0.65rem;font-weight:800;letter-spacing:0.14em;color:rgba(255,255,255,0.28);text-transform:uppercase;';
    qNum.textContent = 'Question ' + (idx + 1) + ' / ' + total + ' · ' + q.points + ' pts';
    body.appendChild(qNum);

    // Passage de compréhension
    if (q.type === 'comprehension' && q.passage) {
      var passage = document.createElement('div');
      passage.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:14px 16px;font-size:0.88rem;color:#d8e8ff;font-style:italic;line-height:1.6;';
      passage.textContent = q.passage;
      body.appendChild(passage);
    }

    // Texte de la question
    var qText = document.createElement('div');
    qText.style.cssText = 'font-size:1rem;font-weight:700;color:#f0e8d0;line-height:1.5;';
    qText.textContent   = q.question;
    body.appendChild(qText);

    // Zone de réponse
    if (q.type === 'mcq' || q.type === 'comprehension') {
      q.choices.forEach(function (choice, ci) {
        var btn = document.createElement('button');
        btn.style.cssText = 'display:block;width:100%;padding:13px 16px;margin:4px 0;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.09);border-radius:14px;color:#e8e0d0;font-size:0.88rem;font-weight:600;text-align:left;cursor:pointer;transition:all 0.15s;-webkit-tap-highlight-color:transparent;';
        btn.textContent = choice;
        btn.onclick = function () { _submitAnswer(ci, btn, q); };
        body.appendChild(btn);
      });

    } else if (q.type === 'free_text' || q.type === 'free_dialogue') {
      var ta = document.createElement('textarea');
      ta.id  = 'lv-exam-textarea';
      ta.style.cssText = 'width:100%;min-height:100px;background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,215,0,0.2);border-radius:14px;padding:12px 14px;color:#f0e8d0;font-size:0.9rem;resize:none;outline:none;box-sizing:border-box;';
      ta.placeholder   = q.type === 'free_dialogue' ? 'Tapez votre réponse en ' + ((window.LANG_NAMES && window.LANG_NAMES[(window.S && window.S.targetLang)]) || 'la langue cible') + '...' : 'Répondez ici...';
      body.appendChild(ta);

      var submitBtn = document.createElement('button');
      submitBtn.style.cssText = 'width:100%;padding:13px;background:rgba(255,215,0,0.12);border:1.5px solid rgba(255,215,0,0.25);border-radius:14px;color:#ffd700;font-weight:800;font-size:0.9rem;cursor:pointer;margin-top:4px;';
      submitBtn.textContent   = '✅ Valider';
      submitBtn.onclick = function () {
        var val = ta.value.trim();
        if (val.length < (q.minLength || 5)) {
          if (typeof showNotif === 'function') showNotif('✏️ Réponse trop courte !');
          return;
        }
        _submitFreeAnswer(val, q);
      };
      body.appendChild(submitBtn);
    }
  }

  // ================================================================
  // SOUMISSION DES RÉPONSES
  // ================================================================
  function _submitAnswer(choiceIdx, btn, q) {
    var allBtns = document.querySelectorAll('#lv-exam-body button');
    allBtns.forEach(function (b) { b.disabled = true; b.style.opacity = '0.5'; });

    var correct = choiceIdx === q.correct;
    btn.style.opacity = '1';
    btn.style.background    = correct ? 'rgba(78,207,112,0.18)' : 'rgba(255,80,80,0.14)';
    btn.style.borderColor   = correct ? '#4ecf70' : '#ff5050';
    btn.style.color         = correct ? '#4ecf70' : '#ff7070';

    if (correct) {
      _state.score += q.points;
      if (typeof window.gainXP === 'function') window.gainXP(5);
    }

    _state.answers.push({ q: _state.currentQ, correct: correct, points: correct ? q.points : 0 });

    // Montrer la bonne réponse si mauvaise
    if (!correct && q.choices) {
      allBtns.forEach(function (b, i) {
        if (i === q.correct) { b.style.opacity = '1'; b.style.background = 'rgba(78,207,112,0.12)'; b.style.borderColor = '#4ecf70'; b.style.color = '#4ecf70'; }
      });
    }

    setTimeout(function () { _nextQuestion(); }, 1200);
  }

  function _submitFreeAnswer(text, q) {
    // Évaluation simple : longueur suffisante = points partiels
    var points = Math.min(q.points, Math.round(q.points * Math.min(1, text.length / 40)));
    _state.score  += points;
    _state.answers.push({ q: _state.currentQ, correct: points > 0, points: points, text: text });
    if (typeof window.gainXP === 'function') window.gainXP(5);
    _nextQuestion();
  }

  function _nextQuestion() {
    _state.currentQ++;
    if (_state.currentQ >= _state.questions.length) {
      _showResults();
    } else {
      _renderQuestion();
    }
  }

  // ================================================================
  // RÉSULTATS
  // ================================================================
  function _showResults() {
    var body   = document.getElementById('lv-exam-body');
    var footer = document.getElementById('lv-exam-footer');
    if (!body) return;

    var pct     = _state.maxScore > 0 ? Math.round((_state.score / _state.maxScore) * 100) : 0;
    var nl      = (window.S && window.S.nativeLang) || 'fr';
    var C       = window.LV_CURRICULUM;
    var passed  = false;

    // Seuil de réussite
    var passingScore = _state.type === 'grand_exam'
      ? ((C && C.getGrandExam(_state.levelId) && C.getGrandExam(_state.levelId).passingScore) || 70)
      : 60;

    passed = pct >= passingScore;

    // Mettre à jour la progression
    if (C) {
      if (_state.type === 'lesson_eval') {
        if (passed) C.markEvalPassed(_state.levelId, _state.lessonId, pct);
      } else if (_state.type === 'grand_exam') {
        if (passed) {
          C.markGrandExamPassed(_state.levelId, pct);
          var exam = C.getGrandExam(_state.levelId);
          if (exam && exam.badgeReward) {
            var M = window.S_missions;
            if (M && !M.badges.includes(exam.badgeReward.id)) {
              M.badges.push(exam.badgeReward.id);
              M.gems = (M.gems || 0) + exam.gemReward;
            }
          }
          if (exam && typeof window.gainXP === 'function') window.gainXP(exam.xpReward);
        }
      }
    }

    if (passed && typeof window.gainXP === 'function') window.gainXP(50);
    if (passed && typeof window.launchConfetti === 'function') window.launchConfetti();

    var fill = document.getElementById('lv-exam-progress-fill');
    if (fill) fill.style.width = '100%';

    // Emoji résultat
    var emoji  = pct >= 90 ? '🏆' : pct >= 75 ? '⭐' : pct >= passingScore ? '✅' : '📚';
    var color  = passed ? '#4ecf70' : '#ff9f43';
    var msgs   = passed
      ? { fr: 'Félicitations !', en: 'Congratulations!', es: '¡Felicitaciones!', ht: 'Felisitasyon!', de: 'Herzlichen Glückwunsch!', ru: 'Поздравляю!', zh: '恭喜！', ja: 'おめでとうございます！' }
      : { fr: 'Continuez vos efforts !', en: 'Keep practicing!', es: '¡Sigue practicando!', ht: 'Kontinye pratike!', de: 'Weiter üben!', ru: 'Продолжайте практиковаться!', zh: '继续加油！', ja: '練習を続けましょう！' };

    body.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px;padding:20px 0;">'
      + '<div style="font-size:4rem;">' + emoji + '</div>'
      + '<div style="font-family:Cinzel,serif;font-size:1.4rem;font-weight:700;color:' + color + ';">' + (msgs[nl] || msgs.fr) + '</div>'
      + '<div style="font-size:3rem;font-weight:900;color:' + color + ';">' + pct + '%</div>'
      + '<div style="font-size:0.8rem;color:rgba(255,255,255,0.35);">' + _state.score + ' / ' + _state.maxScore + ' points</div>'
      + '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:12px 20px;font-size:0.8rem;color:rgba(255,255,255,0.5);">'
      + (passed ? '✅ Réussi — Score minimum : ' + passingScore + '%' : '📚 Score minimum requis : ' + passingScore + '% — Continuez à pratiquer !')
      + '</div>'
      + (passed && _state.type === 'grand_exam' ? '<div style="background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.2);border-radius:14px;padding:12px 20px;font-size:0.82rem;color:#ffd700;font-weight:700;">🔓 Niveau suivant débloqué !</div>' : '')
      + '</div>';

    footer.innerHTML = '';
    var closeBtn = document.createElement('button');
    closeBtn.style.cssText = 'width:100%;padding:14px;background:' + (passed ? 'rgba(78,207,112,0.12)' : 'rgba(255,255,255,0.06)') + ';border:1.5px solid ' + (passed ? 'rgba(78,207,112,0.3)' : 'rgba(255,255,255,0.1)') + ';border-radius:16px;color:' + (passed ? '#4ecf70' : '#e8e0d0') + ';font-weight:800;font-size:0.9rem;cursor:pointer;';
    closeBtn.textContent = passed ? '🎉 Continuer' : '📚 Repratiquer';
    closeBtn.onclick = function () {
      close();
      if (typeof window.LV_PROGRAM !== 'undefined' && typeof window.LV_PROGRAM.open === 'function') {
        window.LV_PROGRAM.open();
      }
    };
    footer.appendChild(closeBtn);

    if (!passed) {
      var retryBtn = document.createElement('button');
      retryBtn.style.cssText = 'width:100%;padding:12px;background:transparent;border:1px solid rgba(255,215,0,0.15);border-radius:16px;color:#ffd700;font-size:0.82rem;cursor:pointer;margin-top:8px;';
      retryBtn.textContent = '🔄 Réessayer';
      retryBtn.onclick = function () {
        if (_state.type === 'lesson_eval') openLessonEval(_state.levelId, _state.lessonId);
        else if (_state.type === 'grand_exam') openGrandExam(_state.levelId);
      };
      footer.appendChild(retryBtn);
    }
  }

  // ================================================================
  // FERMETURE
  // ================================================================
  function close() {
    var overlay = document.getElementById('lv-exam-overlay');
    if (overlay) overlay.remove();
    _state.open = false;
  }

  return {
    openLessonEval,
    openGrandExam,
    close,
  };

})();

console.log('✅ exam.js chargé');
