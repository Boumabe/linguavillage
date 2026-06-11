// LinguaVillage — curriculum.js
// Programme pédagogique formel : leçons → évaluations → grands examens
// Architecture : 3 niveaux × N leçons × 1 évaluation par leçon + 1 grand examen par niveau
// ================================================================

window.LV_CURRICULUM = (function () {

  // ── Niveaux principaux ───────────────────────────────────────
  var LEVELS = {
    beginner:     { id: 'beginner',     order: 1, xpRequired: 0,    color: '#4ecf70', icon: '🌱' },
    intermediate: { id: 'intermediate', order: 2, xpRequired: 1500, color: '#4a9eff', icon: '⭐' },
    advanced:     { id: 'advanced',     order: 3, xpRequired: 4000, color: '#c084fc', icon: '🏆' },
  };

  // ── Programme des leçons par niveau ─────────────────────────
  // Chaque leçon a : id, ordre, icône, titre multilingue, description,
  //   XP requis pour débloquer l'évaluation, NPC examinateur lié,
  //   lieu du village associé, type de questions d'évaluation
  var CURRICULUM = {

    beginner: [
      {
        id: 'alphabet',
        order: 1,
        icon: '🔤',
        title: { fr: 'Alphabet & Sons', en: 'Alphabet & Sounds', es: 'Alfabeto y Sonidos', ht: 'Alfabè ak Son', de: 'Alphabet & Laute', ru: 'Алфавит и звуки', zh: '字母与发音', ja: 'アルファベットと音' },
        desc:  { fr: 'Lettres, sons fondamentaux, prononciation de base', en: 'Letters, fundamental sounds, basic pronunciation', es: 'Letras, sonidos fundamentales, pronunciación básica', ht: 'Lèt, son fondamantal, prononsiasyon debaz', de: 'Buchstaben, Grundlaute, Grundaussprache', ru: 'Буквы, основные звуки, базовое произношение', zh: '字母、基本发音、基础读音', ja: '文字、基本的な音、基本発音' },
        xpToUnlockEval: 30,
        evalNPC: 'teacher',
        evalLoc: 'school',
        modules: ['alphabet'],
        evalType: 'alphabet_recognition',
      },
      {
        id: 'greetings',
        order: 2,
        icon: '👋',
        title: { fr: 'Salutations & Présentations', en: 'Greetings & Introductions', es: 'Saludos y Presentaciones', ht: 'Salitasyon ak Prezantasyon', de: 'Begrüßungen & Vorstellungen', ru: 'Приветствия и представления', zh: '问候与自我介绍', ja: '挨拶と自己紹介' },
        desc:  { fr: 'Bonjour, au revoir, se présenter', en: 'Hello, goodbye, introducing yourself', es: 'Hola, adiós, presentarse', ht: 'Bonjou, orevwa, prezante tèt ou', de: 'Hallo, Auf Wiedersehen, sich vorstellen', ru: 'Здравствуйте, до свидания, представиться', zh: '你好、再见、自我介绍', ja: 'こんにちは、さようなら、自己紹介' },
        xpToUnlockEval: 50,
        evalNPC: 'elder',
        evalLoc: 'park',
        modules: ['vocab', 'phrases'],
        evalType: 'dialogue_choice',
      },
      {
        id: 'numbers',
        order: 3,
        icon: '🔢',
        title: { fr: 'Nombres & Chiffres', en: 'Numbers & Counting', es: 'Números y Cantidades', ht: 'Nimewo ak Konte', de: 'Zahlen & Zählen', ru: 'Числа и счёт', zh: '数字与计数', ja: '数字と数え方' },
        desc:  { fr: '1 à 100, ordinal, heure, prix', en: '1 to 100, ordinal, time, prices', es: '1 al 100, ordinal, hora, precios', ht: '1 pou rive 100, òdinal, lè, pri', de: '1 bis 100, Ordinalzahlen, Zeit, Preise', ru: 'От 1 до 100, порядковые, время, цены', zh: '1到100、序数词、时间、价格', ja: '1〜100、序数、時間、値段' },
        xpToUnlockEval: 60,
        evalNPC: 'merchant',
        evalLoc: 'market',
        modules: ['vocab'],
        evalType: 'fill_blank',
      },
      {
        id: 'basic_vocab',
        order: 4,
        icon: '📖',
        title: { fr: 'Vocabulaire Essentiel', en: 'Essential Vocabulary', es: 'Vocabulario Esencial', ht: 'Vokabilè Esansyèl', de: 'Grundwortschatz', ru: 'Основной словарный запас', zh: '基本词汇', ja: '基本語彙' },
        desc:  { fr: 'Corps, famille, maison, nourriture, couleurs', en: 'Body, family, home, food, colors', es: 'Cuerpo, familia, casa, comida, colores', ht: 'Kò, fanmi, kay, manje, koulè', de: 'Körper, Familie, Haus, Essen, Farben', ru: 'Тело, семья, дом, еда, цвета', zh: '身体、家庭、家、食物、颜色', ja: '体、家族、家、食べ物、色' },
        xpToUnlockEval: 80,
        evalNPC: 'teacher',
        evalLoc: 'school',
        modules: ['vocab'],
        evalType: 'word_match',
      },
      {
        id: 'basic_verbs',
        order: 5,
        icon: '⚡',
        title: { fr: 'Verbes Essentiels', en: 'Essential Verbs', es: 'Verbos Esenciales', ht: 'Vèb Esansyèl', de: 'Grundverben', ru: 'Основные глаголы', zh: '基本动词', ja: '基本動詞' },
        desc:  { fr: 'Être, avoir, aller, faire, vouloir, pouvoir', en: 'To be, have, go, do, want, can', es: 'Ser/estar, tener, ir, hacer, querer, poder', ht: 'Être, gen, ale, fè, vle, kapab', de: 'Sein, haben, gehen, machen, wollen, können', ru: 'Быть, иметь, идти, делать, хотеть, мочь', zh: '是、有、去、做、想要、能', ja: 'ある/いる、持つ、行く、する、欲しい、できる' },
        xpToUnlockEval: 100,
        evalNPC: 'teacher',
        evalLoc: 'school',
        modules: ['grammar', 'vocab'],
        evalType: 'conjugation',
      },
      {
        id: 'basic_grammar',
        order: 6,
        icon: '✏️',
        title: { fr: 'Grammaire Fondamentale', en: 'Basic Grammar', es: 'Gramática Fundamental', ht: 'Gramè Fondamantal', de: 'Grundgrammatik', ru: 'Основная грамматика', zh: '基础语法', ja: '基本文法' },
        desc:  { fr: 'Articles, pronoms, adjectifs, phrase simple', en: 'Articles, pronouns, adjectives, simple sentence', es: 'Artículos, pronombres, adjetivos, oración simple', ht: 'Atik, pwonon, adjektif, fraz senp', de: 'Artikel, Pronomen, Adjektive, einfacher Satz', ru: 'Артикли, местоимения, прилагательные, простое предложение', zh: '冠词、代词、形容词、简单句', ja: '冠詞、代名詞、形容詞、単純文' },
        xpToUnlockEval: 120,
        evalNPC: 'teacher',
        evalLoc: 'school',
        modules: ['grammar'],
        evalType: 'grammar_correction',
      },
      {
        id: 'daily_phrases',
        order: 7,
        icon: '💬',
        title: { fr: 'Phrases du Quotidien', en: 'Daily Phrases', es: 'Frases Cotidianas', ht: 'Fraz Chak Jou', de: 'Alltagssätze', ru: 'Повседневные фразы', zh: '日常用语', ja: '日常フレーズ' },
        desc:  { fr: 'Commander, demander, remercier, s\'excuser', en: 'Ordering, asking, thanking, apologizing', es: 'Pedir, preguntar, agradecer, disculparse', ht: 'Kòmande, mande, remèsye, eskize', de: 'Bestellen, fragen, danken, entschuldigen', ru: 'Заказывать, спрашивать, благодарить, извиняться', zh: '点餐、询问、感谢、道歉', ja: '注文、質問、感謝、謝罪' },
        xpToUnlockEval: 100,
        evalNPC: 'bartender',
        evalLoc: 'tavern',
        modules: ['phrases'],
        evalType: 'dialogue_choice',
      },
    ],

    intermediate: [
      {
        id: 'tenses',
        order: 1,
        icon: '⏰',
        title: { fr: 'Temps Verbaux', en: 'Verb Tenses', es: 'Tiempos Verbales', ht: 'Tan Vèbal', de: 'Zeitformen', ru: 'Времена глаголов', zh: '动词时态', ja: '動詞の時制' },
        desc:  { fr: 'Passé, présent, futur — conjugaisons avancées', en: 'Past, present, future — advanced conjugations', es: 'Pasado, presente, futuro — conjugaciones avanzadas', ht: 'Tan pase, prezan, fiti — konjigèzon avanse', de: 'Vergangenheit, Gegenwart, Zukunft — fortgeschrittene Konjugation', ru: 'Прошедшее, настоящее, будущее — продвинутое спряжение', zh: '过去、现在、将来——高级变位', ja: '過去・現在・未来——応用活用' },
        xpToUnlockEval: 150,
        evalNPC: 'teacher',
        evalLoc: 'school',
        modules: ['grammar'],
        evalType: 'conjugation',
      },
      {
        id: 'complex_sentences',
        order: 2,
        icon: '🔗',
        title: { fr: 'Phrases Complexes', en: 'Complex Sentences', es: 'Frases Complejas', ht: 'Fraz Konplèks', de: 'Komplexe Sätze', ru: 'Сложные предложения', zh: '复杂句子', ja: '複合文' },
        desc:  { fr: 'Connecteurs, subordonnées, conditionnel', en: 'Connectors, subordinate clauses, conditional', es: 'Conectores, subordinadas, condicional', ht: 'Konektè, klopse, kondisyonèl', de: 'Konnektoren, Nebensätze, Konditional', ru: 'Союзы, придаточные предложения, условное наклонение', zh: '连接词、从句、条件句', ja: '接続詞、従属節、条件文' },
        xpToUnlockEval: 160,
        evalNPC: 'teacher',
        evalLoc: 'school',
        modules: ['grammar'],
        evalType: 'sentence_building',
      },
      {
        id: 'reading',
        order: 3,
        icon: '📖',
        title: { fr: 'Lecture & Compréhension', en: 'Reading & Comprehension', es: 'Lectura y Comprensión', ht: 'Lekti ak Konpreyansyon', de: 'Lesen & Verstehen', ru: 'Чтение и понимание', zh: '阅读与理解', ja: '読解と理解' },
        desc:  { fr: 'Textes courts, extraire l\'information, inférer le sens', en: 'Short texts, extracting info, inferring meaning', es: 'Textos cortos, extraer información, inferir significado', ht: 'Tèks kout, ekstrè enfòmasyon, konprann sans', de: 'Kurztexte, Informationen extrahieren, Bedeutung erschließen', ru: 'Короткие тексты, извлечение информации, понимание смысла', zh: '短文、提取信息、推断含义', ja: '短文、情報抽出、意味推測' },
        xpToUnlockEval: 140,
        evalNPC: 'librarian',
        evalLoc: 'library',
        modules: ['vocab', 'phrases'],
        evalType: 'comprehension',
      },
      {
        id: 'writing',
        order: 4,
        icon: '✍️',
        title: { fr: 'Expression Écrite', en: 'Written Expression', es: 'Expresión Escrita', ht: 'Ekspresyon Ekri', de: 'Schriftlicher Ausdruck', ru: 'Письменное выражение', zh: '书面表达', ja: '作文表現' },
        desc:  { fr: 'Décrire, raconter, argumenter à l\'écrit', en: 'Describing, narrating, arguing in writing', es: 'Describir, narrar, argumentar por escrito', ht: 'Dekri, rakonte, agiman nan ekri', de: 'Beschreiben, erzählen, argumentieren schriftlich', ru: 'Описывать, рассказывать, аргументировать письменно', zh: '描述、叙述、书面论证', ja: '描写、語り、書面上の議論' },
        xpToUnlockEval: 150,
        evalNPC: 'teacher',
        evalLoc: 'school',
        modules: ['grammar', 'vocab'],
        evalType: 'free_write',
      },
      {
        id: 'conversation',
        order: 5,
        icon: '🗣️',
        title: { fr: 'Conversation Naturelle', en: 'Natural Conversation', es: 'Conversación Natural', ht: 'Konvèsasyon Natirèl', de: 'Natürliche Konversation', ru: 'Естественный разговор', zh: '自然对话', ja: '自然な会話' },
        desc:  { fr: 'Discussions spontanées sur des sujets variés', en: 'Spontaneous discussions on various topics', es: 'Discusiones espontáneas sobre temas variados', ht: 'Diskisyon spontane sou diferan sijè', de: 'Spontane Gespräche über verschiedene Themen', ru: 'Спонтанные беседы на разные темы', zh: '自发的各类话题对话', ja: 'さまざまなテーマの自発的な会話' },
        xpToUnlockEval: 160,
        evalNPC: 'friend',
        evalLoc: 'friends',
        modules: ['dialogue'],
        evalType: 'free_dialogue',
      },
      {
        id: 'culture',
        order: 6,
        icon: '🌍',
        title: { fr: 'Culture & Société', en: 'Culture & Society', es: 'Cultura y Sociedad', ht: 'Kilti ak Sosyete', de: 'Kultur & Gesellschaft', ru: 'Культура и общество', zh: '文化与社会', ja: '文化と社会' },
        desc:  { fr: 'Traditions, expressions culturelles, vie sociale', en: 'Traditions, cultural expressions, social life', es: 'Tradiciones, expresiones culturales, vida social', ht: 'Tradisyon, ekspresyon kiltirèl, lavi sosyal', de: 'Traditionen, kulturelle Ausdrücke, soziales Leben', ru: 'Традиции, культурные выражения, социальная жизнь', zh: '传统、文化表达、社会生活', ja: '伝統、文化表現、社会生活' },
        xpToUnlockEval: 140,
        evalNPC: 'elder',
        evalLoc: 'park',
        modules: ['phrases', 'vocab'],
        evalType: 'dialogue_choice',
      },
    ],

    advanced: [
      {
        id: 'nuances',
        order: 1,
        icon: '🎨',
        title: { fr: 'Nuances & Registres', en: 'Nuances & Registers', es: 'Matices y Registros', ht: 'Niyans ak Rejis', de: 'Nuancen & Register', ru: 'Нюансы и регистры', zh: '语气与语域', ja: 'ニュアンスとレジスター' },
        desc:  { fr: 'Formel, informel, argot, expressions idiomatiques', en: 'Formal, informal, slang, idiomatic expressions', es: 'Formal, informal, argot, expresiones idiomáticas', ht: 'Fòmèl, enfòmèl, agò, ekspresyon idiomatik', de: 'Formell, informell, Slang, idiomatische Ausdrücke', ru: 'Формальный, неформальный, сленг, идиомы', zh: '正式、非正式、俚语、成语', ja: 'フォーマル、カジュアル、スラング、慣用表現' },
        xpToUnlockEval: 200,
        evalNPC: 'bartender',
        evalLoc: 'tavern',
        modules: ['phrases', 'vocab'],
        evalType: 'register_match',
      },
      {
        id: 'advanced_writing',
        order: 2,
        icon: '📝',
        title: { fr: 'Rédaction Avancée', en: 'Advanced Writing', es: 'Redacción Avanzada', ht: 'Rédaksyon Avanse', de: 'Fortgeschrittenes Schreiben', ru: 'Продвинутое письмо', zh: '高级写作', ja: '上級ライティング' },
        desc:  { fr: 'Essais, lettres formelles, argumentation élaborée', en: 'Essays, formal letters, elaborate argumentation', es: 'Ensayos, cartas formales, argumentación elaborada', ht: 'Esè, lèt fòmèl, agimantasyon elabore', de: 'Aufsätze, formelle Briefe, ausgearbeitete Argumentation', ru: 'Эссе, официальные письма, развёрнутая аргументация', zh: '议论文、正式信件、详细论证', ja: 'エッセイ、正式な手紙、詳細な論証' },
        xpToUnlockEval: 200,
        evalNPC: 'teacher',
        evalLoc: 'school',
        modules: ['grammar', 'vocab'],
        evalType: 'free_write',
      },
      {
        id: 'advanced_culture',
        order: 3,
        icon: '🏛️',
        title: { fr: 'Culture & Contexte Profond', en: 'Deep Culture & Context', es: 'Cultura y Contexto Profundo', ht: 'Kilti ak Kontèks Pwofon', de: 'Tiefe Kultur & Kontext', ru: 'Глубокая культура и контекст', zh: '深度文化与语境', ja: '深い文化とコンテキスト' },
        desc:  { fr: 'Littérature, humour, sous-entendus culturels', en: 'Literature, humor, cultural undertones', es: 'Literatura, humor, matices culturales', ht: 'Literati, imò, niyans kiltirèl', de: 'Literatur, Humor, kulturelle Untertöne', ru: 'Литература, юмор, культурные коннотации', zh: '文学、幽默、文化隐义', ja: '文学、ユーモア、文化的含意' },
        xpToUnlockEval: 180,
        evalNPC: 'director',
        evalLoc: 'cinema',
        modules: ['phrases', 'vocab'],
        evalType: 'comprehension',
      },
      {
        id: 'oral_advanced',
        order: 4,
        icon: '🎤',
        title: { fr: 'Compréhension Orale', en: 'Oral Comprehension', es: 'Comprensión Oral', ht: 'Konpreyansyon Oral', de: 'Hörverstehen', ru: 'Аудирование', zh: '听力理解', ja: '聴解' },
        desc:  { fr: 'Discours naturels, accents, vitesse normale', en: 'Natural speech, accents, normal speed', es: 'Habla natural, acentos, velocidad normal', ht: 'Pale natirèl, aksan, vitès nòmal', de: 'Natürliche Sprache, Akzente, normale Geschwindigkeit', ru: 'Естественная речь, акценты, нормальная скорость', zh: '自然语音、口音、正常语速', ja: '自然な発話、アクセント、通常速度' },
        xpToUnlockEval: 200,
        evalNPC: 'doctor',
        evalLoc: 'hospital',
        modules: ['dialogue'],
        evalType: 'free_dialogue',
      },
    ],
  };

  // ── Grands examens (1 par niveau) ────────────────────────────
  var GRAND_EXAMS = {
    beginner: {
      id: 'grand_exam_beginner',
      title: { fr: 'Grand Examen — Débutant → Intermédiaire', en: 'Major Exam — Beginner → Intermediate', es: 'Gran Examen — Principiante → Intermedio', ht: 'Gran Egzamen — Debitant → Entèmedyè', de: 'Hauptprüfung — Anfänger → Mittel', ru: 'Главный экзамен — Начальный → Средний', zh: '大考——初级→中级', ja: '大試験——初級→中級' },
      examinerNPC: 'elder',
      examinerLoc: 'park',
      examinerIntro: {
        fr: 'Bienvenue, {name}. Je suis Grand-père Koffi. Si tu réussis cet examen, tu rejoindras le rang des apprenants intermédiaires. Es-tu prêt ?',
        en: 'Welcome, {name}. I am Grandfather Koffi. If you pass this exam, you will join the rank of intermediate learners. Are you ready?',
        es: 'Bienvenido, {name}. Soy el Abuelo Koffi. Si apruebas este examen, te unirás al rango de los estudiantes intermedios. ¿Estás listo?',
        ht: 'Byenveni, {name}. Mwen se Gran-Père Koffi. Si ou pase egzamen sa a, ou pral rejwenn ran aprann entèmedyè yo. Èske ou prè?',
        de: 'Willkommen, {name}. Ich bin Großvater Koffi. Wenn du diese Prüfung bestehst, wirst du den mittleren Lernenden beitreten. Bist du bereit?',
        ru: 'Добро пожаловать, {name}. Я — дедушка Кофи. Если ты сдашь этот экзамен, ты перейдёшь на средний уровень. Ты готов?',
        zh: '欢迎，{name}。我是科菲爷爷。如果你通过这次考试，你将晋升为中级学习者。准备好了吗？',
        ja: 'ようこそ、{name}。私はコフィおじいさんです。この試験に合格すれば、中級学習者の仲間入りです。準備はできていますか？',
      },
      xpReward: 500,
      gemReward: 10,
      badgeReward: { id: 'badge_intermediate', icon: '⭐', fr: 'Intermédiaire', en: 'Intermediate' },
      sections: ['vocabulary', 'grammar', 'phrases', 'dialogue'],
      passingScore: 70,
      unlocksLevel: 'intermediate',
    },
    intermediate: {
      id: 'grand_exam_intermediate',
      title: { fr: 'Grand Examen — Intermédiaire → Avancé', en: 'Major Exam — Intermediate → Advanced', es: 'Gran Examen — Intermedio → Avanzado', ht: 'Gran Egzamen — Entèmedyè → Avanse', de: 'Hauptprüfung — Mittel → Fortgeschritten', ru: 'Главный экзамен — Средний → Продвинутый', zh: '大考——中级→高级', ja: '大試験——中級→上級' },
      examinerNPC: 'teacher',
      examinerLoc: 'school',
      examinerIntro: {
        fr: '{name}, vous avez progressé remarquablement. Cet examen déterminera si vous êtes prêt pour le niveau avancé. Bonne chance.',
        en: '{name}, you have progressed remarkably. This exam will determine if you are ready for the advanced level. Good luck.',
        es: '{name}, has progresado notablemente. Este examen determinará si estás listo para el nivel avanzado. Buena suerte.',
        ht: '{name}, ou fè pwogrè remakab. Egzamen sa a pral detèmine si ou prè pou nivo avanse a. Bòn chans.',
        de: '{name}, Sie haben bemerkenswerte Fortschritte gemacht. Diese Prüfung entscheidet, ob Sie für das Fortgeschrittenenniveau bereit sind. Viel Erfolg.',
        ru: '{name}, вы сделали замечательный прогресс. Этот экзамен определит, готовы ли вы к продвинутому уровню. Удачи.',
        zh: '{name}，您进步显著。本次考试将决定您是否准备好进入高级阶段。祝您好运。',
        ja: '{name}、あなたは著しく進歩しました。この試験で上級レベルへの準備ができているか判断します。頑張ってください。',
      },
      xpReward: 1000,
      gemReward: 20,
      badgeReward: { id: 'badge_advanced', icon: '🏅', fr: 'Avancé', en: 'Advanced' },
      sections: ['vocabulary', 'grammar', 'comprehension', 'free_dialogue'],
      passingScore: 75,
      unlocksLevel: 'advanced',
    },
    advanced: {
      id: 'grand_exam_advanced',
      title: { fr: 'Grand Examen Final — Avancé → Pro', en: 'Final Major Exam — Advanced → Pro', es: 'Gran Examen Final — Avanzado → Pro', ht: 'Gran Egzamen Final — Avanse → Pro', de: 'Abschlussprüfung — Fortgeschritten → Profi', ru: 'Финальный экзамен — Продвинутый → Профи', zh: '最终大考——高级→精通', ja: '最終大試験——上級→プロ' },
      examinerNPC: 'elder',
      examinerLoc: 'park',
      examinerIntro: {
        fr: 'Mon ami {name}... cet examen est le dernier. Il mesure non seulement votre langue, mais votre âme dans cette langue. Je vous regarde depuis votre premier mot. Soyez vous-même.',
        en: 'My friend {name}... this is the final exam. It measures not only your language, but your soul in this language. I have watched you since your first word. Be yourself.',
        es: 'Mi amigo {name}... este es el examen final. Mide no solo tu idioma, sino tu alma en este idioma. Te he visto desde tu primera palabra. Sé tú mismo.',
        ht: 'Zanmi mwen {name}... egzamen sa a se dènye a. Li mezire non sèlman lang ou, men nanm ou nan lang sa a. Mwen ap gade ou depi premye mo ou. Swa tèt ou.',
        de: 'Mein Freund {name}... dies ist die letzte Prüfung. Sie misst nicht nur Ihre Sprache, sondern Ihre Seele in dieser Sprache. Ich beobachte Sie seit Ihrem ersten Wort. Seien Sie Sie selbst.',
        ru: 'Мой друг {name}... это последний экзамен. Он измеряет не только ваш язык, но и вашу душу в этом языке. Я наблюдал за вами с вашего первого слова. Будьте собой.',
        zh: '我的朋友{name}……这是最后一次考试。它衡量的不仅是你的语言，更是你的灵魂。我从你说出第一个词时就在关注你。做你自己。',
        ja: '友よ{name}……これが最後の試験です。これはあなたの言語だけでなく、その言語の中のあなたの魂を測ります。あなたが最初の言葉を言った時から見てきました。あなた自身でいてください。',
      },
      xpReward: 2000,
      gemReward: 50,
      badgeReward: { id: 'badge_pro', icon: '👑', fr: 'Maître des Langues', en: 'Language Master' },
      sections: ['vocabulary', 'grammar', 'comprehension', 'culture', 'free_dialogue'],
      passingScore: 80,
      unlocksLevel: 'pro',
    },
  };

  // ================================================================
  // API PUBLIQUE
  // ================================================================

  // Obtenir toutes les leçons d'un niveau
  function getLessons(levelId) {
    return CURRICULUM[levelId] || [];
  }

  // Obtenir une leçon spécifique
  function getLesson(levelId, lessonId) {
    var lessons = getLessons(levelId);
    return lessons.find(function (l) { return l.id === lessonId; }) || null;
  }

  // Obtenir le grand examen d'un niveau
  function getGrandExam(levelId) {
    return GRAND_EXAMS[levelId] || null;
  }

  // Obtenir la progression de l'utilisateur (depuis S)
  function getProgress() {
    var S = window.S || {};
    return S.curriculum || _defaultProgress();
  }

  function _defaultProgress() {
    return {
      currentLevel: 'beginner',
      lessons: {},        // { 'beginner.alphabet': { completed: bool, evalPassed: bool, evalScore: 0, xpEarned: 0 } }
      grandExams: {},     // { 'beginner': { passed: bool, score: 0, date: null } }
      unlockedLevels: ['beginner'],
    };
  }

  // Initialiser la progression si absente
  function initProgress() {
    var S = window.S || {};
    if (!S.curriculum) {
      S.curriculum = _defaultProgress();
      if (typeof saveGame === 'function') saveGame();
    }
    return S.curriculum;
  }

  // Marquer une leçon comme accédée (XP cumulé)
  function markLessonXP(levelId, lessonId, xpAmount) {
    var prog = initProgress();
    var key  = levelId + '.' + lessonId;
    if (!prog.lessons[key]) prog.lessons[key] = { completed: false, evalUnlocked: false, evalPassed: false, evalScore: 0, xpEarned: 0 };
    prog.lessons[key].xpEarned = (prog.lessons[key].xpEarned || 0) + xpAmount;

    // Vérifier si l'évaluation est débloquée
    var lesson = getLesson(levelId, lessonId);
    if (lesson && prog.lessons[key].xpEarned >= lesson.xpToUnlockEval) {
      if (!prog.lessons[key].evalUnlocked) {
        prog.lessons[key].evalUnlocked = true;
        _notifyEvalUnlocked(lesson);
      }
    }
    if (window.S) window.S.curriculum = prog;
    if (typeof saveGame === 'function') saveGame();
    return prog.lessons[key];
  }

  // Marquer une évaluation comme passée
  function markEvalPassed(levelId, lessonId, score) {
    var prog = initProgress();
    var key  = levelId + '.' + lessonId;
    if (!prog.lessons[key]) prog.lessons[key] = { completed: false, evalUnlocked: true, evalPassed: false, evalScore: 0, xpEarned: 0 };
    prog.lessons[key].evalPassed = true;
    prog.lessons[key].evalScore  = score;
    prog.lessons[key].completed  = true;
    if (window.S) window.S.curriculum = prog;
    if (typeof saveGame === 'function') saveGame();
    _checkGrandExamUnlock(levelId);
  }

  // Marquer le grand examen comme passé
  function markGrandExamPassed(levelId, score) {
    var prog = initProgress();
    prog.grandExams[levelId] = { passed: true, score: score, date: Date.now() };
    var exam = GRAND_EXAMS[levelId];
    if (exam && exam.unlocksLevel && !prog.unlockedLevels.includes(exam.unlocksLevel)) {
      prog.unlockedLevels.push(exam.unlocksLevel);
      prog.currentLevel = exam.unlocksLevel;
    }
    if (window.S) window.S.curriculum = prog;
    if (typeof saveGame === 'function') saveGame();
  }

  // Vérifier si le grand examen d'un niveau est débloqué
  function isGrandExamUnlocked(levelId) {
    var prog    = getProgress();
    var lessons = getLessons(levelId);
    if (!lessons.length) return false;
    return lessons.every(function (lesson) {
      var key = levelId + '.' + lesson.id;
      return prog.lessons[key] && prog.lessons[key].evalPassed;
    });
  }

  // Vérifier si une évaluation est débloquée
  function isEvalUnlocked(levelId, lessonId) {
    var prog = getProgress();
    var key  = levelId + '.' + lessonId;
    return !!(prog.lessons[key] && prog.lessons[key].evalUnlocked);
  }

  // Vérifier si une évaluation est passée
  function isEvalPassed(levelId, lessonId) {
    var prog = getProgress();
    var key  = levelId + '.' + lessonId;
    return !!(prog.lessons[key] && prog.lessons[key].evalPassed);
  }

  // Calcul du pourcentage de progression d'un niveau
  function getLevelProgress(levelId) {
    var lessons = getLessons(levelId);
    if (!lessons.length) return 0;
    var passed = lessons.filter(function (l) { return isEvalPassed(levelId, l.id); }).length;
    return Math.round((passed / lessons.length) * 100);
  }

  // ── Notifications internes ───────────────────────────────────
  function _notifyEvalUnlocked(lesson) {
    var nl = (window.S && window.S.nativeLang) || 'fr';
    var title = lesson.title[nl] || lesson.title.fr;
    var msgs = {
      fr: '🎯 Évaluation débloquée : ' + title + ' !',
      en: '🎯 Evaluation unlocked: ' + title + '!',
      es: '🎯 Evaluación desbloqueada: ' + title + '!',
      ht: '🎯 Evaliyasyon debloke: ' + title + '!',
      de: '🎯 Bewertung freigeschaltet: ' + title + '!',
      ru: '🎯 Оценка разблокирована: ' + title + '!',
      zh: '🎯 测验已解锁：' + title + '！',
      ja: '🎯 評価がアンロックされました：' + title + '！',
    };
    if (typeof showNotif === 'function') showNotif(msgs[nl] || msgs.fr, 4000);
  }

  function _checkGrandExamUnlock(levelId) {
    if (isGrandExamUnlocked(levelId)) {
      var nl   = (window.S && window.S.nativeLang) || 'fr';
      var exam = GRAND_EXAMS[levelId];
      if (!exam) return;
      var title = exam.title[nl] || exam.title.fr;
      var msgs = {
        fr: '🏆 Grand Examen débloqué : ' + title + ' ! Rendez-vous avec ' + exam.examinerNPC + ' dans le village !',
        en: '🏆 Major Exam unlocked: ' + title + '! Visit ' + exam.examinerNPC + ' in the village!',
        es: '🏆 Gran Examen desbloqueado: ' + title + '! ¡Visita a ' + exam.examinerNPC + ' en el pueblo!',
        ht: '🏆 Gran Egzamen debloke: ' + title + '! Vizite ' + exam.examinerNPC + ' nan vilaj la!',
        de: '🏆 Hauptprüfung freigeschaltet: ' + title + '! Besuche ' + exam.examinerNPC + ' im Dorf!',
        ru: '🏆 Главный экзамен разблокирован: ' + title + '! Посетите ' + exam.examinerNPC + ' в деревне!',
        zh: '🏆 大考已解锁：' + title + '！前往村庄拜访' + exam.examinerNPC + '！',
        ja: '🏆 大試験アンロック：' + title + '！村で' + exam.examinerNPC + 'に会いに行きましょう！',
      };
      if (typeof showNotif === 'function') showNotif(msgs[nl] || msgs.fr, 5000);
    }
  }

  return {
    LEVELS, CURRICULUM, GRAND_EXAMS,
    getLessons, getLesson, getGrandExam,
    getProgress, initProgress,
    markLessonXP, markEvalPassed, markGrandExamPassed,
    isGrandExamUnlocked, isEvalUnlocked, isEvalPassed,
    getLevelProgress,
  };

})();

console.log('✅ curriculum.js chargé');
