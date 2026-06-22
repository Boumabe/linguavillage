// data.js — RESTRUCTURED EDITION v2 (CORRIGÉ - Partie 1/4)
// LinguaVillage — Lieux thématiques + progression pédagogique
// ================================================================

window.API = window.API || 'https://linguavillage-api--marckensbou2.replit.app';

var _apiCache = {};
var lastAPICall = 0;
var MIN_API_INTERVAL = 300;

async function callAPIWithFallback(endpoint, data, options) {
  options = options || {};
  var skipCache = options.skipCache || false;
  var timeout   = options.timeout || 12000;
  // Normaliser l'endpoint : accepter /dialogue et /api/dialogue
  if (endpoint && !endpoint.startsWith('/api/') && !endpoint.startsWith('http')) {
    endpoint = '/api' + endpoint;
  }
  var cacheKey  = endpoint + JSON.stringify(data);
  if (!skipCache && _apiCache[cacheKey]) return _apiCache[cacheKey];
  var now  = Date.now();
  var wait = MIN_API_INTERVAL - (now - lastAPICall);
  if (wait > 0) await new Promise(function(r){ setTimeout(r, wait); });
  lastAPICall = Date.now();
  var controller = new AbortController();
  var timer = setTimeout(function(){ controller.abort(); }, timeout);
  try {
    var r = await fetch(window.API + endpoint, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify(data), signal:controller.signal
    });
    clearTimeout(timer);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    var result = await r.json();
    if (!skipCache) _apiCache[cacheKey] = result;
    return result;
  } catch(e) { clearTimeout(timer); throw e; }
}

// =================================================================
// CONSTANTES
// =================================================================
var FLAGS = {
  fr:'🇫🇷', en:'🇬🇧', es:'🇪🇸', ht:'🇭🇹',
  de:'🇩🇪', ru:'🇷🇺', zh:'🇨🇳', ja:'🇯🇵'
};
var LANG_NAMES = {
  fr:'Français', en:'English', es:'Español', ht:'Kreyòl',
  de:'Deutsch',  ru:'Русский', zh:'中文',    ja:'日本語'
};
var WEATHER_ICONS = {
  sun:'☀️', rain:'🌧️', snow:'❄️', wind:'💨', night:'🌙'
};

// =================================================================
// DIALOGUES GUIDÉS — pour les débutants (niveau zero + beginner)
// =================================================================
window.GUIDED_DIALOGUES = {

  // ── MAISON (Parc) — Salutations ──────────────────────────────
  park: {
    theme: {fr:'Salutations & Présentations', en:'Greetings & Introductions',
            es:'Saludos y presentaciones',    ht:'Bonjou ak prezantasyon',
            de:'Begrüßungen & Vorstellungen', ru:'Приветствия', zh:'问候与介绍', ja:'挨拶と自己紹介'},
    npc: 'elder',
    scenes: [
      {
        npc:    {fr:'Bonjour ! Je m\'appelle Grand-père Koffi. Comment tu t\'appelles ?',
                 en:'Hello! My name is Grandpa Koffi. What is your name?',
                 es:'¡Hola! Me llamo Abuelo Koffi. ¿Cómo te llamas?',
                 ht:'Bonjou! Mwen rele Gran-Père Koffi. Kijan ou rele?',
                 de:'Hallo! Ich bin Großvater Koffi. Wie heißt du?',
                 ru:'Привет! Меня зовут Дедушка Кофи. Как тебя зовут?',
                 zh:'你好！我叫科菲爷爷。你叫什么名字？',
                 ja:'こんにちは！私はコフィおじいさんです。あなたの名前は？'},
        choices:[
          {label:{fr:'Bonjour!',   en:'Hello!',  es:'¡Hola!',   ht:'Bonjou!', de:'Hallo!',    ru:'Привет!',  zh:'你好！',   ja:'こんにちは！'}, correct:true,  xp:15},
          {label:{fr:'Au revoir!', en:'Goodbye!',es:'¡Adiós!',  ht:'Orevwa!', de:'Auf Wiedersehen!', ru:'До свидания!', zh:'再见！', ja:'さようなら！'}, correct:false, xp:0},
          {label:{fr:'Merci!',     en:'Thank you!',es:'¡Gracias!',ht:'Mèsi!', de:'Danke!',    ru:'Спасибо!', zh:'谢谢！',   ja:'ありがとう！'}, correct:false, xp:0},
        ],
        feedback:{
          correct:{fr:'Parfait ! Et toi, comment tu t\'appelles ?',
                   en:'Great! And what is your name?',
                   es:'¡Perfecto! ¿Y tú, cómo te llamas?',
                   ht:'Trè bien ! E ou menm, kijan ou rele?',
                   de:'Perfekt! Und wie heißt du?',
                   ru:'Отлично! А как тебя зовут?',
                   zh:'很好！那你叫什么名字？',
                   ja:'すばらしい！あなたの名前は何ですか？'},
          wrong:  {fr:'Presque ! "Bonjour" est la bonne salutation.',
                   en:'Almost! "Hello" is the right greeting.',
                   es:'¡Casi! "¡Hola!" es el saludo correcto.',
                   ht:'Prèske! "Bonjou" se salitasyon ki kòrèk la.',
                   de:'Fast! "Hallo" ist die richtige Begrüßung.',
                   ru:'Почти! "Привет" — правильное приветствие.',
                   zh:'差不多！"你好"是正确的问候。',
                   ja:'惜しい！「こんにちは」が正しい挨拶です。'}
        }
      },
      {
        npc:    {fr:'Quel âge as-tu ?',
                 en:'How old are you?',
                 es:'¿Cuántos años tienes?',
                 ht:'Ki laj ou genyen?',
                 de:'Wie alt bist du?',
                 ru:'Сколько тебе лет?',
                 zh:'你多少岁？',
                 ja:'何歳ですか？'},
        choices:[
          {label:{fr:'J\'ai [X] ans.',  en:'I am [X] years old.', es:'Tengo [X] años.',  ht:'Mwen gen [X] an.',  de:'Ich bin [X] Jahre alt.', ru:'Мне [X] лет.',     zh:'我[X]岁。',     ja:'[X]歳です。'}, correct:true,  xp:15},
          {label:{fr:'Je suis bien.', en:'I am fine.',          es:'Estoy bien.',       ht:'Mwen byen.',        de:'Mir geht es gut.',       ru:'Я в порядке.',    zh:'我很好。',     ja:'元気です。'}, correct:false, xp:5},
          {label:{fr:'Oui.',          en:'Yes.',                es:'Sí.',              ht:'Wi.',               de:'Ja.',                    ru:'Да.',             zh:'是的。',       ja:'はい。'}, correct:false, xp:5},
        ],
        feedback:{
          correct:{fr:'Très bien ! Tu apprends vite !',
                   en:'Very good! You learn fast!',
                   es:'¡Muy bien! ¡Aprendes rápido!',
                   ht:'Trè bien ! Ou aprann vit!',
                   de:'Sehr gut! Du lernst schnell!',
                   ru:'Очень хорошо! Ты учишься быстро!',
                   zh:'非常好！你学得很快！',
                   ja:'とても良いです！あなたは早く学びます！'},
          wrong:  {fr:'Essaie "J\'ai [X] ans" pour donner ton âge.',
                   en:'Try "I am [X] years old" to give your age.',
                   es:'Intenta "Tengo [X] años" para dar tu edad.',
                   ht:'Eseye "Mwen gen [X] an" pou bay laj ou.',
                   de:'Versuche "Ich bin [X] Jahre alt".',
                   ru:'Попробуй "Мне [X] лет".',
                   zh:'试试"我[X]岁"来说你的年龄。',
                   ja:'「[X]歳です」を試してみてください。'}
        }
      },
      {
        npc:    {fr:'D\'où viens-tu ?',
                 en:'Where are you from?',
                 es:'¿De dónde eres?',
                 ht:'Kote ou soti?',
                 de:'Woher kommst du?',
                 ru:'Откуда ты?',
                 zh:'你从哪里来？',
                 ja:'どこから来ましたか？'},
        choices:[
          {label:{fr:'Je viens de [pays].', en:'I am from [country].', es:'Soy de [país].', ht:'Mwen soti [peyi].', de:'Ich komme aus [Land].', ru:'Я из [страны].', zh:'我来自[国家]。', ja:'[国]から来ました。'}, correct:true,  xp:20},
          {label:{fr:'Je m\'appelle...',    en:'My name is...',        es:'Me llamo...',     ht:'Mwen rele...',      de:'Ich heiße...',          ru:'Меня зовут...',   zh:'我叫...', ja:'私は...です。'}, correct:false, xp:5},
          {label:{fr:'Bonjour !',           en:'Hello!',               es:'¡Hola!',          ht:'Bonjou!',           de:'Hallo!',                ru:'Привет!',         zh:'你好！', ja:'こんにちは！'}, correct:false, xp:0},
        ],
        feedback:{
          correct:{fr:'Excellent ! Tu maîtrises les présentations de base ! +20 XP 🎉',
                   en:'Excellent! You mastered basic introductions! +20 XP 🎉',
                   es:'¡Excelente! ¡Dominaste las presentaciones básicas! +20 XP 🎉',
                   ht:'Ekselan! Ou matrize prezantasyon debaz yo! +20 XP 🎉',
                   de:'Ausgezeichnet! Du hast Grundvorstellungen gemeistert! +20 XP 🎉',
                   ru:'Отлично! Ты освоил базовые представления! +20 XP 🎉',
                   zh:'优秀！你掌握了基本介绍！+20 XP 🎉',
                   ja:'素晴らしい！基本的な自己紹介をマスターしました！+20 XP 🎉'},
          wrong:  {fr:'Utilise "Je viens de..." pour parler de ton pays.',
                   en:'Use "I am from..." to talk about your country.',
                   es:'Usa "Soy de..." para hablar de tu país.',
                   ht:'Itilize "Mwen soti..." pou pale de peyi ou.',
                   de:'Benutze "Ich komme aus..." für dein Land.',
                   ru:'Используй "Я из..." для своей страны.',
                   zh:'用"我来自..."来说你的国家。',
                   ja:'「...から来ました」を使って国を言いましょう。'}
        }
      }
    ]
  },

  // ── ÉCOLE — Alphabet & Chiffres ────────────────────────────
  school: {
    theme:{fr:'Alphabet & Chiffres', en:'Alphabet & Numbers', es:'Alfabeto y números',
           ht:'Alfabè ak chif',      de:'Alphabet & Zahlen', ru:'Алфавит и цифры',
           zh:'字母和数字',           ja:'アルファベットと数字'},
    npc:'teacher',
    scenes:[
      {
        npc:    {fr:'Bienvenue à l\'école ! Comptons ensemble. Combien font 2 + 3 ?',
                 en:'Welcome to school! Let\'s count. What is 2 + 3?',
                 es:'¡Bienvenido a la escuela! Contemos. ¿Cuánto es 2 + 3?',
                 ht:'Byenveni nan lekòl! Ann konte. Konbyen fè 2 + 3?',
                 de:'Willkommen in der Schule! Zählen wir. Was ist 2 + 3?',
                 ru:'Добро пожаловать в школу! Считаем. Сколько будет 2 + 3?',
                 zh:'欢迎来到学校！我们来数数。2+3等于几？',
                 ja:'学校へようこそ！一緒に数えましょう。2+3は？'},
        choices:[
          {label:{fr:'Cinq.',  en:'Five.',  es:'Cinco.', ht:'Senk.', de:'Fünf.',  ru:'Пять.',  zh:'五。',  ja:'五。'}, correct:true,  xp:20},
          {label:{fr:'Quatre.',en:'Four.',  es:'Cuatro.',ht:'Kat.',  de:'Vier.',  ru:'Четыре.',zh:'四。',  ja:'四。'}, correct:false, xp:5},
          {label:{fr:'Six.',   en:'Six.',   es:'Seis.',  ht:'Sis.',  de:'Sechs.', ru:'Шесть.', zh:'六。',  ja:'六。'}, correct:false, xp:5},
        ],
        feedback:{
          correct:{fr:'Bravo ! 2 + 3 = 5. Tu connais les chiffres !',
                   en:'Bravo! 2 + 3 = 5. You know your numbers!',
                   es:'¡Bravo! 2 + 3 = 5. ¡Conoces los números!',
                   ht:'Bravo! 2 + 3 = 5. Ou konnen chif yo!',
                   de:'Bravo! 2 + 3 = 5. Du kennst die Zahlen!',
                   ru:'Браво! 2 + 3 = 5. Ты знаешь цифры!',
                   zh:'太棒了！2+3=5。你认识数字！',
                   ja:'ブラボー！2+3=5。数字を知っていますね！'},
          wrong:  {fr:'Pas tout à fait. 2 + 3 = cinq (5).',
                   en:'Not quite. 2 + 3 = five (5).',
                   es:'No del todo. 2 + 3 = cinco (5).',
                   ht:'Pa tout a fè. 2 + 3 = senk (5).',
                   de:'Nicht ganz. 2 + 3 = fünf (5).',
                   ru:'Не совсем. 2 + 3 = пять (5).',
                   zh:'不完全是。2+3=五（5）。',
                   ja:'惜しい。2+3=五（5）です。'}
        }
      },
      {
        npc:    {fr:'Très bien ! Maintenant, quelle est la première lettre de l\'alphabet ?',
                 en:'Great! Now, what is the first letter of the alphabet?',
                 es:'¡Muy bien! Ahora, ¿cuál es la primera letra del alfabeto?',
                 ht:'Trè bien! Kounye a, kisa ki premye lèt alfabè a?',
                 de:'Sehr gut! Jetzt, was ist der erste Buchstabe des Alphabets?',
                 ru:'Отлично! Теперь, какая первая буква алфавита?',
                 zh:'很好！现在，字母表的第一个字母是什么？',
                 ja:'素晴らしい！では、アルファベットの最初の文字は？'},
        choices:[
          {label:{fr:'A', en:'A', es:'A', ht:'A', de:'A', ru:'А', zh:'A', ja:'A'}, correct:true,  xp:15},
          {label:{fr:'B', en:'B', es:'B', ht:'B', de:'B', ru:'Б', zh:'B', ja:'B'}, correct:false, xp:5},
          {label:{fr:'Z', en:'Z', es:'Z', ht:'Z', de:'Z', ru:'Я', zh:'Z', ja:'Z'}, correct:false, xp:0},
        ],
        feedback:{
          correct:{fr:'Excellent ! A est la première lettre. Tu progresses !',
                   en:'Excellent! A is the first letter. You\'re progressing!',
                   es:'¡Excelente! La A es la primera letra. ¡Progresas!',
                   ht:'Ekselan! A se premye lèt la. Ou ap fè pwogrè!',
                   de:'Ausgezeichnet! A ist der erste Buchstabe. Du machst Fortschritte!',
                   ru:'Отлично! А — первая буква. Ты прогрессируешь!',
                   zh:'优秀！A是第一个字母。你在进步！',
                   ja:'素晴らしい！Aが最初の文字です。上達しています！'},
          wrong:  {fr:'C\'est A ! Le A est toujours le premier.',
                   en:'It\'s A! A is always first.',
                   es:'¡Es la A! La A siempre es la primera.',
                   ht:'Se A! A toujou premye.',
                   de:'Es ist A! A ist immer der erste.',
                   ru:'Это А! А всегда первая.',
                   zh:'是A！A永远是第一个。',
                   ja:'Aです！Aはいつも最初です。'}
        }
      }
    ]
  },

  // ── MARCHÉ — Nourriture & Prix ─────────────────────────────
  market: {
    theme:{fr:'Nourriture & Achats', en:'Food & Shopping', es:'Comida y compras',
           ht:'Manje ak achte',      de:'Essen & Einkaufen', ru:'Еда и покупки',
           zh:'食物和购物',           ja:'食べ物とショッピング'},
    npc:'merchant',
    scenes:[
      {
        npc:    {fr:'Bonjour ! Qu\'est-ce que vous voulez acheter aujourd\'hui ?',
                 en:'Hello! What would you like to buy today?',
                 es:'¡Buenos días! ¿Qué quiere comprar hoy?',
                 ht:'Bonjou! Kisa ou vle achte jodi a?',
                 de:'Guten Tag! Was möchten Sie heute kaufen?',
                 ru:'Здравствуйте! Что вы хотите купить сегодня?',
                 zh:'你好！您今天想买什么？',
                 ja:'こんにちは！今日は何を買いますか？'},
        choices:[
          {label:{fr:'Du pain, s\'il vous plaît.', en:'Bread, please.', es:'Pan, por favor.', ht:'Pen, tanpri.', de:'Brot, bitte.', ru:'Хлеб, пожалуйста.', zh:'面包，请。', ja:'パンをください。'}, correct:true,  xp:20},
          {label:{fr:'Bonjour !',                 en:'Hello!',         es:'¡Hola!',          ht:'Bonjou!',      de:'Hallo!',        ru:'Привет!',           zh:'你好！',       ja:'こんにちは！'}, correct:false, xp:5},
          {label:{fr:'Au revoir.',                en:'Goodbye.',       es:'Adiós.',           ht:'Orevwa.',      de:'Auf Wiedersehen.', ru:'До свидания.',  zh:'再见。',       ja:'さようなら。'}, correct:false, xp:0},
        ],
        feedback:{
          correct:{fr:'Voilà du pain ! Ça fait 2 euros. Parfait !',
                   en:'Here is your bread! That\'s 2 euros. Perfect!',
                   es:'¡Aquí tiene el pan! Son 2 euros. ¡Perfecto!',
                   ht:'Men pen an! Sa fè 2 euro. Pafè!',
                   de:'Hier ist Ihr Brot! Das macht 2 Euro. Perfekt!',
                   ru:'Вот ваш хлеб! Это стоит 2 евро. Отлично!',
                   zh:'这是您的面包！2欧元。完美！',
                   ja:'こちらがパンです！2ユーロです。完璧！'},
          wrong:  {fr:'Dites "Du pain, s\'il vous plaît" pour commander.',
                   en:'Say "Bread, please" to order.',
                   es:'Diga "Pan, por favor" para pedir.',
                   ht:'Di "Pen, tanpri" pou kòmande.',
                   de:'Sagen Sie "Brot, bitte" um zu bestellen.',
                   ru:'Скажи "Хлеб, пожалуйста" чтобы заказать.',
                   zh:'说"面包，请"来点餐。',
                   ja:'注文するには「パンをください」と言いましょう。'}
        }
      },
      {
        npc:    {fr:'C\'est 2 euros. Combien ça coûte en tout avec 3 pommes à 1 euro chacune ?',
                 en:'That\'s 2 euros. How much is it in total with 3 apples at 1 euro each?',
                 es:'Son 2 euros. ¿Cuánto es en total con 3 manzanas a 1 euro cada una?',
                 ht:'Se 2 euro. Konbyen sa koute antou ak 3 pòm a 1 euro chak?',
                 de:'Das sind 2 Euro. Wie viel macht das insgesamt mit 3 Äpfeln à 1 Euro?',
                 ru:'Это 2 евро. Сколько всего с 3 яблоками по 1 евро?',
                 zh:'2欧元。加上3个苹果各1欧元，总共多少钱？',
                 ja:'2ユーロです。1ユーロのリンゴ3つと合わせていくら？'},
        choices:[
          {label:{fr:'5 euros.',  en:'5 euros.',  es:'5 euros.',  ht:'5 euro.',  de:'5 Euro.',  ru:'5 евро.',  zh:'5欧元。', ja:'5ユーロ。'}, correct:true,  xp:25},
          {label:{fr:'3 euros.',  en:'3 euros.',  es:'3 euros.',  ht:'3 euro.',  de:'3 Euro.',  ru:'3 евро.',  zh:'3欧元。', ja:'3ユーロ。'}, correct:false, xp:5},
          {label:{fr:'6 euros.',  en:'6 euros.',  es:'6 euros.',  ht:'6 euro.',  de:'6 Euro.',  ru:'6 евро.',  zh:'6欧元。', ja:'6ユーロ。'}, correct:false, xp:5},
        ],
        feedback:{
          correct:{fr:'Exact ! 2 + 3 = 5 euros. Vous êtes un bon client ! +25 XP 🛒',
                   en:'Correct! 2 + 3 = 5 euros. You\'re a great customer! +25 XP 🛒',
                   es:'¡Correcto! 2 + 3 = 5 euros. ¡Eres un buen cliente! +25 XP 🛒',
                   ht:'Egzak! 2 + 3 = 5 euro. Ou se yon bon kliyan! +25 XP 🛒',
                   de:'Richtig! 2 + 3 = 5 Euro. Sie sind ein toller Kunde! +25 XP 🛒',
                   ru:'Правильно! 2 + 3 = 5 евро. Вы отличный покупатель! +25 XP 🛒',
                   zh:'正确！2+3=5欧元。您是好顾客！+25 XP 🛒',
                   ja:'正解！2+3=5ユーロ。素晴らしいお客様！+25 XP 🛒'},
          wrong:  {fr:'Calculons : pain (2€) + 3 pommes (3€) = 5 euros.',
                   en:'Let\'s calculate: bread (2€) + 3 apples (3€) = 5 euros.',
                   es:'Calculemos: pan (2€) + 3 manzanas (3€) = 5 euros.',
                   ht:'Ann kalkile: pen (2€) + 3 pòm (3€) = 5 euro.',
                   de:'Rechnen wir: Brot (2€) + 3 Äpfel (3€) = 5 Euro.',
                   ru:'Считаем: хлеб (2€) + 3 яблока (3€) = 5 евро.',
                   zh:'计算：面包(2€)+3个苹果(3€)=5欧元。',
                   ja:'計算：パン(2€)+リンゴ3個(3€)=5ユーロ。'}
        }
      }
    ]
  },

  // ── AMIS — Vie quotidienne ──────────────────────────────────
  friends: {
    theme:{fr:'Vie quotidienne & Émotions', en:'Daily Life & Emotions', es:'Vida diaria y emociones',
           ht:'Lavi chak jou ak emosyon',   de:'Alltag & Emotionen',   ru:'Повседневность и эмоции',
           zh:'日常生活和情感',              ja:'日常生活と感情'},
    npc:'friend',
    scenes:[
      {
        npc:    {fr:'Hey ! Comment tu vas aujourd\'hui ?',
                 en:'Hey! How are you today?',
                 es:'¡Hey! ¿Cómo estás hoy?',
                 ht:'Hey! Kijan ou ye jodi a?',
                 de:'Hey! Wie geht es dir heute?',
                 ru:'Эй! Как ты сегодня?',
                 zh:'嘿！你今天怎么样？',
                 ja:'やあ！今日はどうですか？'},
        choices:[
          {label:{fr:'Je vais bien, merci !',    en:'I am fine, thank you!',  es:'¡Estoy bien, gracias!', ht:'Mwen byen, mèsi!',    de:'Mir geht es gut, danke!', ru:'Я в порядке, спасибо!', zh:'我很好，谢谢！', ja:'元気です、ありがとう！'}, correct:true,  xp:15},
          {label:{fr:'Je suis fatigué(e).',      en:'I am tired.',            es:'Estoy cansado/a.',      ht:'Mwen fatige.',         de:'Ich bin müde.',           ru:'Я устал.',              zh:'我很累。',     ja:'疲れています。'}, correct:true,  xp:15},
          {label:{fr:'Quelle heure est-il ?',    en:'What time is it?',       es:'¿Qué hora es?',         ht:'Ki lè li ye?',         de:'Wie spät ist es?',        ru:'Который час?',          zh:'几点了？',     ja:'何時ですか？'}, correct:false, xp:5},
        ],
        feedback:{
          correct:{fr:'Super ! C\'est exactement comment on répond à "Comment ça va ?"',
                   en:'Great! That\'s exactly how you answer "How are you?"',
                   es:'¡Genial! Así es exactamente como se responde a "¿Cómo estás?"',
                   ht:'Super! Se egzakteman kijan ou reponn "Kijan ou ye?"',
                   de:'Super! Genau so antwortet man auf "Wie geht es dir?"',
                   ru:'Супер! Именно так отвечают на "Как ты?"',
                   zh:'太棒了！这正是回答"你怎么样？"的方式。',
                   ja:'すごい！それが「どうですか？」への正しい返答です！'},
          wrong:  {fr:'Réponds à la question ! "Je vais bien" ou "Je suis fatigué(e)".',
                   en:'Answer the question! "I am fine" or "I am tired".',
                   es:'¡Responde la pregunta! "Estoy bien" o "Estoy cansado".',
                   ht:'Reponn kesyon an! "Mwen byen" oswa "Mwen fatige".',
                   de:'Beantworte die Frage! "Mir geht es gut" oder "Ich bin müde".',
                   ru:'Ответь на вопрос! "Я в порядке" или "Я устал".',
                   zh:'回答问题！"我很好"或"我很累"。',
                   ja:'質問に答えましょう！「元気です」または「疲れています」。'}
        }
      }
    ]
  },

  // ── TAVERNE — Commande & Social ────────────────────────────
  tavern: {
    theme:{fr:'Commander & Socialiser', en:'Ordering & Socializing', es:'Pedir y socializar',
           ht:'Kòmande ak sosyalize',   de:'Bestellen & Socializing', ru:'Заказ и общение',
           zh:'点餐和社交',              ja:'注文と交流'},
    npc:'bartender',
    scenes:[
      {
        npc:    {fr:'Bonsoir ! Qu\'est-ce que je vous sers ?',
                 en:'Good evening! What can I get you?',
                 es:'¡Buenas noches! ¿Qué les sirvo?',
                 ht:'Bonswa! Kisa m ap ba ou?',
                 de:'Guten Abend! Was darf ich Ihnen bringen?',
                 ru:'Добрый вечер! Что вам налить?',
                 zh:'晚上好！您想要什么？',
                 ja:'こんばんは！何にしますか？'},
        choices:[
          {label:{fr:'Un verre d\'eau, s\'il vous plaît.', en:'A glass of water, please.', es:'Un vaso de agua, por favor.', ht:'Yon vè dlo, tanpri.', de:'Ein Glas Wasser, bitte.', ru:'Стакан воды, пожалуйста.', zh:'一杯水，请。', ja:'水を一杯ください。'}, correct:true,  xp:20},
          {label:{fr:'Je ne comprends pas.',               en:'I don\'t understand.',       es:'No entiendo.',               ht:'Mwen pa konprann.',   de:'Ich verstehe nicht.',       ru:'Я не понимаю.',             zh:'我不明白。',     ja:'わかりません。'}, correct:false, xp:10},
          {label:{fr:'Merci, au revoir !',                  en:'Thanks, goodbye!',           es:'¡Gracias, adiós!',           ht:'Mèsi, orevwa!',       de:'Danke, auf Wiedersehen!',   ru:'Спасибо, до свидания!',    zh:'谢谢，再见！',   ja:'ありがとう、さようなら！'}, correct:false, xp:0},
        ],
        feedback:{
          correct:{fr:'Voilà votre eau ! Vous parlez très bien !',
                   en:'Here is your water! You speak very well!',
                   es:'¡Aquí tiene su agua! ¡Habla muy bien!',
                   ht:'Men dlo ou! Ou pale trè bien!',
                   de:'Hier ist Ihr Wasser! Sie sprechen sehr gut!',
                   ru:'Вот ваша вода! Вы очень хорошо говорите!',
                   zh:'这是您的水！您说得很好！',
                   ja:'お水です！とても上手に話しています！'},
          wrong:  {fr:'Pour commander, dites "Un verre d\'eau, s\'il vous plaît".',
                   en:'To order, say "A glass of water, please".',
                   es:'Para pedir, di "Un vaso de agua, por favor".',
                   ht:'Pou kòmande, di "Yon vè dlo, tanpri".',
                   de:'Zum Bestellen, sagen Sie "Ein Glas Wasser, bitte".',
                   ru:'Чтобы заказать, скажи "Стакан воды, пожалуйста".',
                   zh:'点餐时说"一杯水，请"。',
                   ja:'注文するには「水を一杯ください」と言いましょう。'}
        }
      }
    ]
  },

  // ── BANQUE — Chiffres & Argent ─────────────────────────────
  bank: {
    theme:{fr:'Chiffres & Argent', en:'Numbers & Money', es:'Números y dinero',
           ht:'Chif ak lajan',     de:'Zahlen & Geld',  ru:'Числа и деньги',
           zh:'数字和金钱',         ja:'数字とお金'},
    npc:'banker',
    scenes:[
      {
        npc:    {fr:'Bonjour. Quel service désirez-vous ? Dépôt ou retrait ?',
                 en:'Hello. What service do you need? Deposit or withdrawal?',
                 es:'Buenos días. ¿Qué servicio desea? ¿Depósito o retiro?',
                 ht:'Bonjou. Ki sèvis ou bezwen? Depo oswa retrè?',
                 de:'Guten Tag. Welchen Service wünschen Sie? Einzahlung oder Abhebung?',
                 ru:'Здравствуйте. Какая услуга нужна? Вклад или снятие?',
                 zh:'你好。您需要什么服务？存款还是取款？',
                 ja:'こんにちは。どのサービスが必要ですか？預け入れか引き出し？'},
        choices:[
          {label:{fr:'Je voudrais déposer de l\'argent.', en:'I would like to deposit money.', es:'Quisiera depositar dinero.', ht:'Mwen ta renmen depoze lajan.', de:'Ich möchte Geld einzahlen.', ru:'Я хочу положить деньги.', zh:'我想存钱。', ja:'お金を預けたいです。'}, correct:true,  xp:25},
          {label:{fr:'Combien ça coûte ?',               en:'How much does it cost?',         es:'¿Cuánto cuesta?',           ht:'Konbyen sa koute?',           de:'Wie viel kostet das?',       ru:'Сколько это стоит?',      zh:'这要多少钱？', ja:'いくらですか？'}, correct:false, xp:10},
          {label:{fr:'Bonjour !',                        en:'Hello!',                         es:'¡Hola!',                    ht:'Bonjou!',                     de:'Hallo!',                     ru:'Привет!',                  zh:'你好！',       ja:'こんにちは！'}, correct:false, xp:5},
        ],
        feedback:{
          correct:{fr:'Parfait ! "Je voudrais" est une formule de politesse essentielle. +25 XP 💰',
                   en:'Perfect! "I would like" is an essential polite phrase. +25 XP 💰',
                   es:'¡Perfecto! "Quisiera" es una fórmula esencial de cortesía. +25 XP 💰',
                   ht:'Pafè! "Mwen ta renmen" se yon fòmil poli esansyèl. +25 XP 💰',
                   de:'Perfekt! "Ich möchte" ist ein wesentlicher Höflichkeitsausdruck. +25 XP 💰',
                   ru:'Отлично! "Я хочу" — важная вежливая фраза. +25 XP 💰',
                   zh:'完美！"我想"是一个重要的礼貌用语。+25 XP 💰',
                   ja:'完璧！「〜したいです」は重要な丁寧な表現です。+25 XP 💰'},
          wrong:  {fr:'Dites "Je voudrais + action" pour faire une demande polie.',
                   en:'Say "I would like + action" for a polite request.',
                   es:'Di "Quisiera + acción" para una solicitud cortés.',
                   ht:'Di "Mwen ta renmen + aksyon" pou yon demann poli.',
                   de:'Sagen Sie "Ich möchte + Aktion" für eine höfliche Bitte.',
                   ru:'Скажи "Я хочу + действие" для вежливой просьбы.',
                   zh:'说"我想+动作"来表达礼貌请求。',
                   ja:'「〜したいです」で丁寧なお願いをしましょう。'}
        }
      }
    ]
  },

  // ── GARE — Directions & Transport ─────────────────────────
  station: {
    theme:{fr:'Directions & Transport', en:'Directions & Transport', es:'Direcciones y transporte',
           ht:'Direksyon ak transpò',  de:'Richtungen & Transport',  ru:'Направления и транспорт',
           zh:'方向和交通',             ja:'方向と交通'},
    npc:'officer',
    scenes:[
      {
        npc:    {fr:'Bonjour ! Vous avez besoin d\'aide ? Où voulez-vous aller ?',
                 en:'Hello! Do you need help? Where do you want to go?',
                 es:'¡Hola! ¿Necesita ayuda? ¿A dónde quiere ir?',
                 ht:'Bonjou! Ou bezwen èd? Kote ou vle ale?',
                 de:'Hallo! Brauchen Sie Hilfe? Wohin möchten Sie?',
                 ru:'Здравствуйте! Нужна помощь? Куда вы хотите?',
                 zh:'你好！需要帮助吗？您想去哪里？',
                 ja:'こんにちは！助けが必要ですか？どこへ行きたいですか？'},
        choices:[
          {label:{fr:'Je cherche la sortie, s\'il vous plaît.', en:'I am looking for the exit, please.', es:'Busco la salida, por favor.', ht:'Mwen ap chèche sòti a, tanpri.', de:'Ich suche den Ausgang, bitte.', ru:'Я ищу выход, пожалуйста.', zh:'我在找出口，请问。', ja:'出口を探しています、お願いします。'}, correct:true,  xp:25},
          {label:{fr:'Je ne sais pas.',                         en:'I don\'t know.',                     es:'No sé.',                     ht:'Mwen pa konnen.',              de:'Ich weiß nicht.',              ru:'Я не знаю.',                  zh:'我不知道。',         ja:'わかりません。'}, correct:false, xp:10},
          {label:{fr:'C\'est loin ?',                          en:'Is it far?',                         es:'¿Está lejos?',              ht:'Èske li lwen?',                de:'Ist es weit?',                 ru:'Это далеко?',                zh:'远吗？',             ja:'遠いですか？'}, correct:false, xp:10},
        ],
        feedback:{
          correct:{fr:'La sortie est à droite ! Excellente formulation ! +25 XP 🚉',
                   en:'The exit is to the right! Excellent phrasing! +25 XP 🚉',
                   es:'¡La salida está a la derecha! ¡Excelente formulación! +25 XP 🚉',
                   ht:'Sòti a sou bò dwat! Ekselan fòmilasyon! +25 XP 🚉',
                   de:'Der Ausgang ist rechts! Hervorragende Formulierung! +25 XP 🚉',
                   ru:'Выход справа! Отличная формулировка! +25 XP 🚉',
                   zh:'出口在右边！措辞完美！+25 XP 🚉',
                   ja:'出口は右です！素晴らしい表現です！+25 XP 🚉'},
          wrong:  {fr:'"Je cherche + lieu" est la formule pour demander son chemin.',
                   en:'"I am looking for + place" is how to ask for directions.',
                   es:'"Busco + lugar" es la fórmula para preguntar el camino.',
                   ht:'"Mwen ap chèche + kote" se fòmil pou mande direksyon.',
                   de:'"Ich suche + Ort" ist die Formel für Wegbeschreibungen.',
                   ru:'"Я ищу + место" — формула для вопроса о дороге.',
                   zh:'"我在找+地点"是问路的公式。',
                   ja:'「〜を探しています」が道を聞く表現です。'}
        }
      }
    ]
  },

  // ── HÔPITAL — Corps & Santé ────────────────────────────────
  hospital: {
    theme:{fr:'Corps & Santé', en:'Body & Health', es:'Cuerpo y salud',
           ht:'Kò ak sante',   de:'Körper & Gesundheit', ru:'Тело и здоровье',
           zh:'身体和健康',     ja:'体と健康'},
    npc:'doctor',
    scenes:[
      {
        npc:    {fr:'Bonjour. Qu\'est-ce qui vous amène ? Où avez-vous mal ?',
                 en:'Hello. What brings you here? Where does it hurt?',
                 es:'Buenos días. ¿Qué le trae por aquí? ¿Dónde le duele?',
                 ht:'Bonjou. Kisa ki mennen ou la? Ki kote ou gen doulè?',
                 de:'Hallo. Was führt Sie her? Wo haben Sie Schmerzen?',
                 ru:'Здравствуйте. Что вас привело? Где болит?',
                 zh:'你好。什么事带您来这里？哪里疼？',
                 ja:'こんにちは。どうされましたか？どこが痛いですか？'},
        choices:[
          {label:{fr:'J\'ai mal à la tête.', en:'I have a headache.', es:'Me duele la cabeza.', ht:'Tèt mwen fè mwen mal.', de:'Ich habe Kopfschmerzen.', ru:'У меня болит голова.', zh:'我头痛。', ja:'頭が痛いです。'}, correct:true,  xp:30},
          {label:{fr:'Je suis heureux.',     en:'I am happy.',        es:'Estoy feliz.',         ht:'Mwen kontan.',         de:'Ich bin glücklich.',       ru:'Я счастлив.',          zh:'我很快乐。', ja:'嬉しいです。'}, correct:false, xp:5},
          {label:{fr:'Il fait chaud.',       en:'It\'s hot.',          es:'Hace calor.',          ht:'Li cho.',              de:'Es ist heiß.',             ru:'Жарко.',               zh:'天气很热。',  ja:'暑いです。'}, correct:false, xp:0},
        ],
        feedback:{
          correct:{fr:'Je comprends. "J\'ai mal à + partie du corps" est essentiel ! +30 XP 🏥',
                   en:'I understand. "I have a + body part + ache" is essential! +30 XP 🏥',
                   es:'Entiendo. "Me duele + parte del cuerpo" es esencial. +30 XP 🏥',
                   ht:'Mwen konprann. "X mwen fè mwen mal" se esansyèl! +30 XP 🏥',
                   de:'Ich verstehe. "Ich habe + Körperteil + Schmerzen" ist wichtig! +30 XP 🏥',
                   ru:'Понятно. "У меня болит + часть тела" — важная фраза! +30 XP 🏥',
                   zh:'我明白了。"我+身体部位+痛"是必备表达！+30 XP 🏥',
                   ja:'わかりました。「〜が痛いです」は必須表現です！+30 XP 🏥'},
          wrong:  {fr:'Dites "J\'ai mal à + partie du corps" pour expliquer vos symptômes.',
                   en:'Say "I have a + body part ache" to explain your symptoms.',
                   es:'Di "Me duele + parte del cuerpo" para explicar síntomas.',
                   ht:'Di "X mwen fè mwen mal" pou eksplike sentòm ou.',
                   de:'Sagen Sie "Ich habe + Körperteil + Schmerzen" für Symptome.',
                   ru:'Скажи "У меня болит + часть тела" для симптомов.',
                   zh:'说"我+身体部位+痛"来描述症状。',
                   ja:'「〜が痛いです」で症状を説明しましょう。'}
        }
      }
    ]
  },

  // ── CINÉMA — Culture & Loisirs ────────────────────────────
  cinema: {
    theme:{fr:'Culture & Loisirs', en:'Culture & Leisure', es:'Cultura y ocio',
           ht:'Kilti ak lwaziou', de:'Kultur & Freizeit', ru:'Культура и досуг',
           zh:'文化和休闲',        ja:'文化と余暇'},
    npc:'director',
    scenes:[
      {
        npc:    {fr:'Bienvenue au cinéma ! Quel genre de film aimez-vous ?',
                 en:'Welcome to the cinema! What kind of movies do you like?',
                 es:'¡Bienvenido al cine! ¿Qué tipo de películas le gustan?',
                 ht:'Byenveni nan sinema! Ki kalite fim ou renmen?',
                 de:'Willkommen im Kino! Welche Art von Filmen mögen Sie?',
                 ru:'Добро пожаловать в кино! Какие фильмы вам нравятся?',
                 zh:'欢迎来到电影院！您喜欢什么类型的电影？',
                 ja:'映画館へようこそ！どんな映画が好きですか？'},
        choices:[
          {label:{fr:'J\'aime les comédies.', en:'I like comedies.', es:'Me gustan las comedias.', ht:'Mwen renmen komedi yo.', de:'Ich mag Komödien.', ru:'Мне нравятся комедии.', zh:'我喜欢喜剧。', ja:'コメディが好きです。'}, correct:true,  xp:25},
          {label:{fr:'Je ne sais pas.',       en:'I don\'t know.',   es:'No sé.',                  ht:'Mwen pa konnen.',       de:'Ich weiß nicht.',  ru:'Я не знаю.',           zh:'我不知道。',   ja:'わかりません。'}, correct:false, xp:5},
          {label:{fr:'Oui.',                  en:'Yes.',             es:'Sí.',                     ht:'Wi.',                   de:'Ja.',              ru:'Да.',                  zh:'是的。',       ja:'はい。'}, correct:false, xp:5},
        ],
        feedback:{
          correct:{fr:'Excellent goût ! "J\'aime + [chose]" est une des phrases les plus utiles ! +25 XP 🎬',
                   en:'Excellent taste! "I like + [thing]" is one of the most useful phrases! +25 XP 🎬',
                   es:'¡Excelente gusto! "Me gusta/n + [cosa]" ¡es una de las frases más útiles! +25 XP 🎬',
                   ht:'Gou ekselan! "Mwen renmen + [bagay]" se youn nan fraz ki pi itil yo! +25 XP 🎬',
                   de:'Ausgezeichneter Geschmack! "Ich mag + [Sache]" ist einer der nützlichsten Sätze! +25 XP 🎬',
                   ru:'Отличный вкус! "Мне нравится + [вещь]" — одна из полезнейших фраз! +25 XP 🎬',
                   zh:'品味极佳！"我喜欢+[东西]"是最有用的句型之一！+25 XP 🎬',
                   ja:'素晴らしいセンス！「〜が好きです」は最も便利な表現の一つ！+25 XP 🎬'},
          wrong:  {fr:'Utilisez "J\'aime + [chose]" pour exprimer vos goûts.',
                   en:'Use "I like + [thing]" to express your preferences.',
                   es:'Use "Me gusta/n + [cosa]" para expresar sus gustos.',
                   ht:'Itilize "Mwen renmen + [bagay]" pou eksprime gou ou.',
                   de:'Benutzen Sie "Ich mag + [Sache]" für Ihre Vorlieben.',
                   ru:'Используй "Мне нравится + [вещь]" для предпочтений.',
                   zh:'用"我喜欢+[东西]"来表达喜好。',
                   ja:'「〜が好きです」で好みを表現しましょう。'}
        }
      }
    ]
  },

  // Lieux sans dialogue guidé (IA libre dès le début)
  church:  { theme:null, freeFromStart:true },
  police:  { theme:null, freeFromStart:true },
};

// =================================================================
// LIEUX DU VILLAGE
// =================================================================
var LOCATIONS = [
  {
    id:'cinema', emoji:'🎬', color:'#c060c0',
    npcs:[
      {id:'director', name:'Réalisateur Félix',
       role:{fr:'Réalisateur', en:'Director', es:'Director', ht:'Reyalizatè', de:'Regisseur', ru:'Режиссёр', zh:'导演', ja:'監督'},
       emoji:'🎥'},
      {id:'actress', name:'Aïda',
       role:{fr:'Actrice', en:'Actress', es:'Actriz', ht:'Aktris', de:'Schauspielerin', ru:'Актриса', zh:'女演员', ja:'女優'},
       emoji:'🎭'}
    ]
  },
  {
    id:'market', emoji:'🏪', color:'#c0a060',
    npcs:[
      {id:'merchant', name:'M. Diallo',
       role:{fr:'Marchand', en:'Merchant', es:'Comerciante', ht:'Machann', de:'Händler', ru:'Торговец', zh:'商人', ja:'商人'},
       emoji:'🧑‍🌾'}
    ]
  },
  {
    id:'park', emoji:'🌳', color:'#5a8a40',
    npcs:[
      {id:'elder', name:'Grand-père Koffi',
       role:{fr:'Sage du village', en:'Village elder', es:'Sabio del pueblo', ht:'Granmoun nan vilaj', de:'Dorfältester', ru:'Старейшина', zh:'村长', ja:'村の長老'},
       emoji:'👴'},
      {id:'child', name:'Mia',
       role:{fr:'Enfant curieuse', en:'Curious child', es:'Niña curiosa', ht:'Ti fi kiriyen', de:'Neugieriges Kind', ru:'Любопытный ребёнок', zh:'好奇的孩子', ja:'好奇心旺盛な子'},
       emoji:'👧'}
    ]
  },
  {
    id:'friends', emoji:'🤝', color:'#c09090',
    npcs:[
      {id:'friend', name:'Léa',
       role:{fr:'Amie', en:'Friend', es:'Amiga', ht:'Zanmi', de:'Freundin', ru:'Подруга', zh:'朋友', ja:'友達'},
       emoji:'👧'}
    ]
  },
  {
    id:'police', emoji:'🚔', color:'#6070a0',
    npcs:[
      {id:'officer2', name:'Cap. Koné',
       role:{fr:'Policier', en:'Police Officer', es:'Policía', ht:'Polisye', de:'Polizist', ru:'Полицейский', zh:'警察', ja:'警察官'},
       emoji:'👮‍♂️'}
    ]
  },
  {
    id:'station', emoji:'🚉', color:'#b0a090',
    npcs:[
      {id:'officer', name:'Agent Kofi',
       role:{fr:'Agent', en:'Officer', es:'Oficial', ht:'Ofisye', de:'Beamter', ru:'Офицер', zh:'警官', ja:'警官'},
       emoji:'👮'}
    ]
  },
  {
    id:'bank', emoji:'🏦', color:'#c0c080',
    npcs:[
      {id:'banker', name:'M. Dupuis',
       role:{fr:'Banquier', en:'Banker', es:'Banquero', ht:'Bankye', de:'Bankier', ru:'Банкир', zh:'银行家', ja:'銀行員'},
       emoji:'👨‍💼'}
    ]
  },
  {
    id:'hospital', emoji:'🏥', color:'#d0e0f0',
    npcs:[
      {id:'doctor', name:'Dr. Martin',
       role:{fr:'Médecin', en:'Doctor', es:'Médico', ht:'Doktè', de:'Arzt', ru:'Врач', zh:'医生', ja:'医者'},
       emoji:'👨‍⚕️'},
      {id:'nurse', name:'Sophie',
       role:{fr:'Infirmière', en:'Nurse', es:'Enfermera', ht:'Enfimyè', de:'Krankenschwester', ru:'Медсестра', zh:'护士', ja:'看護師'},
       emoji:'👩‍⚕️'}
    ]
  },
  {
    id:'church', emoji:'⛪', color:'#8a7a60',
    npcs:[
      {id:'pastor', name:'Père Antoine',
       role:{fr:'Pasteur', en:'Pastor', es:'Pastor', ht:'Pastè', de:'Pfarrer', ru:'Пастор', zh:'牧师', ja:'牧師'},
       emoji:'⛪'}
    ]
  },
  {
    id:'tavern', emoji:'🍺', color:'#c08040',
    npcs:[
      {id:'bartender', name:'Marco',
       role:{fr:'Barman', en:'Bartender', es:'Barman', ht:'Bòs ba a', de:'Barkeeper', ru:'Бармен', zh:'酒吧服务员', ja:'バーテンダー'},
       emoji:'🍺'}
    ]
  },
  {
    id:'school', emoji:'🏫', color:'#6a8ab0',
    npcs:[
      {id:'teacher', name:'Mme Dupont',
       role:{fr:'Professeure', en:'Teacher', es:'Profesora', ht:'Pwofesè', de:'Lehrerin', ru:'Учитель', zh:'老师', ja:'先生'},
       emoji:'👩‍🏫'}
    ]
  },
];

// =================================================================
// NOMS ET DESCRIPTIONS DES LIEUX
// =================================================================
var LOC_NAMES = {};
var LOC_DESC  = {};

var _locMeta = {
  church:   {fr:'Église',    en:'Church',   es:'Iglesia',   ht:'Legliz',   de:'Kirche',        ru:'Церковь',  zh:'教堂',   ja:'教会'},
  school:   {fr:'École',     en:'School',   es:'Escuela',   ht:'Lekòl',    de:'Schule',         ru:'Школа',    zh:'学校',   ja:'学校'},
  friends:  {fr:'Amis',      en:'Friends',  es:'Amigos',    ht:'Zanmi',    de:'Freunde',        ru:'Друзья',   zh:'朋友',   ja:'友達'},
  market:   {fr:'Marché',    en:'Marché',   es:'Mercado',   ht:'Mache',    de:'Markt',          ru:'Рынок',    zh:'市场',   ja:'市場'},
  tavern:   {fr:'Taverne',   en:'Tavern',   es:'Taberna',   ht:'Tavèn',    de:'Kneipe',         ru:'Таверна',  zh:'酒馆',   ja:'居酒屋'},
  park:     {fr:'Parc',      en:'Park',     es:'Parque',    ht:'Pak',      de:'Park',           ru:'Парк',     zh:'公园',   ja:'公園'},
  hospital: {fr:'Hôpital',   en:'Hospital', es:'Hospital',  ht:'Lopital',  de:'Krankenhaus',    ru:'Больница', zh:'医院',   ja:'病院'},
  station:  {fr:'Gare',      en:'Station',  es:'Estación',  ht:'Estasyon', de:'Bahnhof',        ru:'Вокзал',   zh:'车站',   ja:'駅'},
  bank:     {fr:'Banque',    en:'Bank',     es:'Banco',     ht:'Bank',     de:'Bank',           ru:'Банк',     zh:'银行',   ja:'銀行'},
  police:   {fr:'Police',    en:'Police',   es:'Policía',   ht:'Polis',    de:'Polizei',        ru:'Полиция',  zh:'警察局', ja:'警察署'},
  cinema:   {fr:'Cinéma',    en:'Cinema',   es:'Cine',      ht:'Sinema',   de:'Kino',           ru:'Кино',     zh:'电影院', ja:'映画館'},
  factory:  {fr:'Ferme',     en:'Farm',     es:'Granja',    ht:'Fèm',      de:'Bauernhof',      ru:'Ферма',    zh:'农场',   ja:'農場'},
};

LOCATIONS.forEach(function(loc) {
  LOC_NAMES[loc.id] = _locMeta[loc.id] || {fr:loc.id, en:loc.id};
  LOC_DESC[loc.id]  = {fr:'', en:''};
});

// =================================================================
// VOCABULAIRE — 800 mots (catégories étendues)
// =================================================================
var VOCAB = {
  // 1. Verbes (35 mots)
  verbes: {
    icon:'🏃', fr:'Verbes', en:'Verbs', es:'Verbos', ht:'Vèb', de:'Verben', ru:'Глаголы', zh:'动词', ja:'動詞',
    words: [
      {n:'manger', t:{fr:'manger', en:'to eat', es:'comer', ht:'manje', de:'essen', ru:'есть', zh:'吃', ja:'食べる'}},
      {n:'boire', t:{fr:'boire', en:'to drink', es:'beber', ht:'bwè', de:'trinken', ru:'пить', zh:'喝', ja:'飲む'}},
      {n:'dormir', t:{fr:'dormir', en:'to sleep', es:'dormir', ht:'dòmi', de:'schlafen', ru:'спать', zh:'睡觉', ja:'寝る'}},
      {n:'parler', t:{fr:'parler', en:'to speak', es:'hablar', ht:'pale', de:'sprechen', ru:'говорить', zh:'说', ja:'話す'}},
      {n:'comprendre', t:{fr:'comprendre', en:'to understand', es:'comprender', ht:'konprann', de:'verstehen', ru:'понимать', zh:'理解', ja:'理解する'}},
      {n:'apprendre', t:{fr:'apprendre', en:'to learn', es:'aprender', ht:'aprann', de:'lernen', ru:'учить', zh:'学习', ja:'学ぶ'}},
      {n:'travailler', t:{fr:'travailler', en:'to work', es:'trabajar', ht:'travay', de:'arbeiten', ru:'работать', zh:'工作', ja:'働く'}},
      {n:'voyager', t:{fr:'voyager', en:'to travel', es:'viajar', ht:'vwayaje', de:'reisen', ru:'путешествовать', zh:'旅行', ja:'旅行する'}},
      {n:'acheter', t:{fr:'acheter', en:'to buy', es:'comprar', ht:'achte', de:'kaufen', ru:'покупать', zh:'买', ja:'買う'}},
      {n:'vendre', t:{fr:'vendre', en:'to sell', es:'vender', ht:'vann', de:'verkaufen', ru:'продавать', zh:'卖', ja:'売る'}},
      {n:'donner', t:{fr:'donner', en:'to give', es:'dar', ht:'bay', de:'geben', ru:'давать', zh:'给', ja:'あげる'}},
      {n:'prendre', t:{fr:'prendre', en:'to take', es:'tomar', ht:'pran', de:'nehmen', ru:'брать', zh:'拿', ja:'取る'}},
      {n:'marcher', t:{fr:'marcher', en:'to walk', es:'caminar', ht:'mache', de:'gehen', ru:'ходить', zh:'走路', ja:'歩く'}},
      {n:'courir', t:{fr:'courir', en:'to run', es:'correr', ht:'kouri', de:'rennen', ru:'бегать', zh:'跑', ja:'走る'}},
      {n:'écrire', t:{fr:'écrire', en:'to write', es:'escribir', ht:'ekri', de:'schreiben', ru:'писать', zh:'写', ja:'書く'}},
      {n:'lire', t:{fr:'lire', en:'to read', es:'leer', ht:'li', de:'lesen', ru:'читать', zh:'读', ja:'読む'}},
      {n:'ouvrir', t:{fr:'ouvrir', en:'to open', es:'abrir', ht:'louvri', de:'öffnen', ru:'открывать', zh:'打开', ja:'開ける'}},
      {n:'fermer', t:{fr:'fermer', en:'to close', es:'cerrar', ht:'fèmen', de:'schließen', ru:'закрывать', zh:'关闭', ja:'閉じる'}},
      {n:'venir', t:{fr:'venir', en:'to come', es:'venir', ht:'vini', de:'kommen', ru:'приходить', zh:'来', ja:'来る'}},
      {n:'partir', t:{fr:'partir', en:'to leave', es:'salir', ht:'pati', de:'verlassen', ru:'уходить', zh:'离开', ja:'去る'}},
      {n:'attendre', t:{fr:'attendre', en:'to wait', es:'esperar', ht:'tann', de:'warten', ru:'ждать', zh:'等待', ja:'待つ'}},
      {n:'trouver', t:{fr:'trouver', en:'to find', es:'encontrar', ht:'jwenn', de:'finden', ru:'находить', zh:'找到', ja:'見つける'}},
      {n:'chercher', t:{fr:'chercher', en:'to look for', es:'buscar', ht:'chèche', de:'suchen', ru:'искать', zh:'寻找', ja:'探す'}},
      {n:'aimer', t:{fr:'aimer', en:'to like/love', es:'gustar/amar', ht:'renmen', de:'mögen/lieben', ru:'любить', zh:'喜欢/爱', ja:'好き/愛する'}},
      {n:'détester', t:{fr:'détester', en:'to hate', es:'odiar', ht:'rayi', de:'hassen', ru:'ненавидеть', zh:'讨厌', ja:'嫌う'}},
      {n:'pouvoir', t:{fr:'pouvoir', en:'can', es:'poder', ht:'kapab', de:'können', ru:'мочь', zh:'能', ja:'できる'}},
      {n:'vouloir', t:{fr:'vouloir', en:'to want', es:'querer', ht:'vle', de:'wollen', ru:'хотеть', zh:'想要', ja:'欲しい'}},
      {n:'savoir', t:{fr:'savoir', en:'to know', es:'saber', ht:'konnen', de:'wissen', ru:'знать', zh:'知道', ja:'知っている'}},
      {n:'devoir', t:{fr:'devoir', en:'must/have to', es:'deber', ht:'dwe', de:'müssen', ru:'должен', zh:'必须', ja:'なければならない'}},
      {n:'sentir', t:{fr:'sentir', en:'to feel', es:'sentir', ht:'santi', de:'fühlen', ru:'чувствовать', zh:'感觉', ja:'感じる'}},
      {n:'penser', t:{fr:'penser', en:'to think', es:'pensar', ht:'panse', de:'denken', ru:'думать', zh:'想', ja:'思う'}},
      {n:'choisir', t:{fr:'choisir', en:'to choose', es:'elegir', ht:'chwazi', de:'wählen', ru:'выбирать', zh:'选择', ja:'選ぶ'}},
      {n:'finir', t:{fr:'finir', en:'to finish', es:'terminar', ht:'fini', de:'beenden', ru:'заканчивать', zh:'完成', ja:'終わる'}},
      {n:'commencer', t:{fr:'commencer', en:'to start', es:'empezar', ht:'kòmanse', de:'anfangen', ru:'начинать', zh:'开始', ja:'始める'}},
      {n:'vivre', t:{fr:'vivre', en:'to live', es:'vivir', ht:'viv', de:'leben', ru:'жить', zh:'生活', ja:'生きる'}},
    ]
  },
  // 2. Nourriture (60 mots)
  nourriture: {
    icon:'🍎', fr:'Nourriture', en:'Food', es:'Comida', ht:'Manje', de:'Essen', ru:'Еда', zh:'食物', ja:'食べ物',
    words: [
      {n:'pain', t:{fr:'pain', en:'bread', es:'pan', ht:'pen', de:'Brot', ru:'хлеб', zh:'面包', ja:'パン'}},
      {n:'fromage', t:{fr:'fromage', en:'cheese', es:'queso', ht:'fromaj', de:'Käse', ru:'сыр', zh:'奶酪', ja:'チーズ'}},
      {n:'beurre', t:{fr:'beurre', en:'butter', es:'mantequilla', ht:'bè', de:'Butter', ru:'масло', zh:'黄油', ja:'バター'}},
      {n:'œuf', t:{fr:'œuf', en:'egg', es:'huevo', ht:'ze', de:'Ei', ru:'яйцо', zh:'鸡蛋', ja:'卵'}},
      {n:'lait', t:{fr:'lait', en:'milk', es:'leche', ht:'lèt', de:'Milch', ru:'молоко', zh:'牛奶', ja:'牛乳'}},
      {n:'viande', t:{fr:'viande', en:'meat', es:'carne', ht:'vyann', de:'Fleisch', ru:'мясо', zh:'肉', ja:'肉'}},
      {n:'poisson', t:{fr:'poisson', en:'fish', es:'pescado', ht:'pwason', de:'Fisch', ru:'рыба', zh:'鱼', ja:'魚'}},
      {n:'poulet', t:{fr:'poulet', en:'chicken', es:'pollo', ht:'poul', de:'Hähnchen', ru:'курица', zh:'鸡肉', ja:'鶏肉'}},
      {n:'fruit', t:{fr:'fruit', en:'fruit', es:'fruta', ht:'fwi', de:'Obst', ru:'фрукт', zh:'水果', ja:'果物'}},
      {n:'légume', t:{fr:'légume', en:'vegetable', es:'verdura', ht:'legim', de:'Gemüse', ru:'овощ', zh:'蔬菜', ja:'野菜'}},
      {n:'pomme', t:{fr:'pomme', en:'apple', es:'manzana', ht:'pòm', de:'Apfel', ru:'яблоко', zh:'苹果', ja:'リンゴ'}},
      {n:'banane', t:{fr:'banane', en:'banana', es:'plátano', ht:'bannann', de:'Banane', ru:'банан', zh:'香蕉', ja:'バナナ'}},
      {n:'orange', t:{fr:'orange', en:'orange', es:'naranja', ht:'zoranj', de:'Orange', ru:'апельсин', zh:'橙子', ja:'オレンジ'}},
      {n:'carotte', t:{fr:'carotte', en:'carrot', es:'zanahoria', ht:'karòt', de:'Karotte', ru:'морковь', zh:'胡萝卜', ja:'ニンジン'}},
      {n:'tomate', t:{fr:'tomate', en:'tomato', es:'tomate', ht:'tomat', de:'Tomate', ru:'помидор', zh:'番茄', ja:'トマト'}},
      {n:'salade', t:{fr:'salade', en:'lettuce', es:'lechuga', ht:'lad', de:'Salat', ru:'салат', zh:'生菜', ja:'レタス'}},
      {n:'eau', t:{fr:'eau', en:'water', es:'agua', ht:'dlo', de:'Wasser', ru:'вода', zh:'水', ja:'水'}},
      {n:'café', t:{fr:'café', en:'coffee', es:'café', ht:'kafe', de:'Kaffee', ru:'кофе', zh:'咖啡', ja:'コーヒー'}},
      {n:'thé', t:{fr:'thé', en:'tea', es:'té', ht:'te', de:'Tee', ru:'чай', zh:'茶', ja:'お茶'}},
      {n:'jus', t:{fr:'jus', en:'juice', es:'jugo', ht:'ji', de:'Saft', ru:'сок', zh:'果汁', ja:'ジュース'}},
      {n:'riz', t:{fr:'riz', en:'rice', es:'arroz', ht:'diri', de:'Reis', ru:'рис', zh:'米饭', ja:'米'}},
      {n:'pâtes', t:{fr:'pâtes', en:'pasta', es:'pasta', ht:'pasta', de:'Pasta', ru:'паста', zh:'意大利面', ja:'パスタ'}},
      {n:'soupe', t:{fr:'soupe', en:'soup', es:'sopa', ht:'soup', de:'Suppe', ru:'суп', zh:'汤', ja:'スープ'}},
      {n:'dessert', t:{fr:'dessert', en:'dessert', es:'postre', ht:'desè', de:'Dessert', ru:'десерт', zh:'甜点', ja:'デザート'}},
      {n:'gâteau', t:{fr:'gâteau', en:'cake', es:'pastel', ht:'gato', de:'Kuchen', ru:'торт', zh:'蛋糕', ja:'ケーキ'}},
      {n:'chocolat', t:{fr:'chocolat', en:'chocolate', es:'chocolate', ht:'chokola', de:'Schokolade', ru:'шоколад', zh:'巧克力', ja:'チョコレート'}},
      {n:'glace', t:{fr:'glace', en:'ice cream', es:'helado', ht:'krèm', de:'Eis', ru:'мороженое', zh:'冰淇淋', ja:'アイスクリーム'}},
      {n:'sucre', t:{fr:'sucre', en:'sugar', es:'azúcar', ht:'sik', de:'Zucker', ru:'сахар', zh:'糖', ja:'砂糖'}},
      {n:'sel', t:{fr:'sel', en:'salt', es:'sal', ht:'sèl', de:'Salz', ru:'соль', zh:'盐', ja:'塩'}},
      {n:'poivre', t:{fr:'poivre', en:'pepper', es:'pimienta', ht:'piman', de:'Pfeffer', ru:'перец', zh:'胡椒', ja:'コショウ'}},
      {n:'huile', t:{fr:'huile', en:'oil', es:'aceite', ht:'lwil', de:'Öl', ru:'масло', zh:'油', ja:'油'}},
      {n:'vinaigre', t:{fr:'vinaigre', en:'vinegar', es:'vinagre', ht:'venèg', de:'Essig', ru:'уксус', zh:'醋', ja:'酢'}},
      {n:'confiture', t:{fr:'confiture', en:'jam', es:'mermelada', ht:'konfiti', de:'Marmelade', ru:'варенье', zh:'果酱', ja:'ジャム'}},
      {n:'miel', t:{fr:'miel', en:'honey', es:'miel', ht:'siwo myèl', de:'Honig', ru:'мёд', zh:'蜂蜜', ja:'はちみつ'}},
      {n:'céréales', t:{fr:'céréales', en:'cereal', es:'cereales', ht:'sereyal', de:'Getreide', ru:'хлопья', zh:'麦片', ja:'シリアル'}},
      {n:'yaourt', t:{fr:'yaourt', en:'yogurt', es:'yogur', ht:'yogout', de:'Joghurt', ru:'йогурт', zh:'酸奶', ja:'ヨーグルト'}},
      {n:'pizza', t:{fr:'pizza', en:'pizza', es:'pizza', ht:'piza', de:'Pizza', ru:'пицца', zh:'披萨', ja:'ピザ'}},
      {n:'hamburger', t:{fr:'hamburger', en:'hamburger', es:'hamburguesa', ht:'anmbègè', de:'Hamburger', ru:'гамбургер', zh:'汉堡包', ja:'ハンバーガー'}},
      {n:'frites', t:{fr:'frites', en:'fries', es:'patatas fritas', ht:'fritay', de:'Pommes', ru:'картошка фри', zh:'薯条', ja:'フライドポテト'}},
      {n:'sandwich', t:{fr:'sandwich', en:'sandwich', es:'sándwich', ht:'sandwich', de:'Sandwich', ru:'сэндвич', zh:'三明治', ja:'サンドイッチ'}},
      {n:'champignon', t:{fr:'champignon', en:'mushroom', es:'champiñón', ht:'djondjon', de:'Pilz', ru:'гриб', zh:'蘑菇', ja:'キノコ'}},
      {n:'oignon', t:{fr:'oignon', en:'onion', es:'cebolla', ht:'zonyon', de:'Zwiebel', ru:'лук', zh:'洋葱', ja:'タマネギ'}},
      {n:'ail', t:{fr:'ail', en:'garlic', es:'ajo', ht:'lay', de:'Knoblauch', ru:'чеснок', zh:'大蒜', ja:'ニンニク'}},
      {n:'poivron', t:{fr:'poivron', en:'bell pepper', es:'pimiento', ht:'piman', de:'Paprika', ru:'перец', zh:'甜椒', ja:'ピーマン'}},
      {n:'concombre', t:{fr:'concombre', en:'cucumber', es:'pepino', ht:'konkonm', de:'Gurke', ru:'огурец', zh:'黄瓜', ja:'キュウリ'}},
      {n:'aubergine', t:{fr:'aubergine', en:'eggplant', es:'berenjena', ht:'berjènn', de:'Aubergine', ru:'баклажан', zh:'茄子', ja:'ナス'}},
      {n:'citron', t:{fr:'citron', en:'lemon', es:'limón', ht:'siton', de:'Zitrone', ru:'лимон', zh:'柠檬', ja:'レモン'}},
      {n:'ananas', t:{fr:'ananas', en:'pineapple', es:'piña', ht:'anana', de:'Ananas', ru:'ананас', zh:'菠萝', ja:'パイナップル'}},
      {n:'fraise', t:{fr:'fraise', en:'strawberry', es:'fresa', ht:'frez', de:'Erdbeere', ru:'клубника', zh:'草莓', ja:'イチゴ'}},
      {n:'framboise', t:{fr:'framboise', en:'raspberry', es:'frambuesa', ht:'franbwaz', de:'Himbeere', ru:'малина', zh:'覆盆子', ja:'ラズベリー'}},
      {n:'cerise', t:{fr:'cerise', en:'cherry', es:'cereza', ht:'seriz', de:'Kirsche', ru:'вишня', zh:'樱桃', ja:'サクランボ'}},
      {n:'pastèque', t:{fr:'pastèque', en:'watermelon', es:'sandía', ht:'pastèk', de:'Wassermelone', ru:'арбуз', zh:'西瓜', ja:'スイカ'}},
      {n:'melon', t:{fr:'melon', en:'melon', es:'melón', ht:'melon', de:'Melone', ru:'дыня', zh:'甜瓜', ja:'メロン'}},
      {n:'mangue', t:{fr:'mangue', en:'mango', es:'mango', ht:'mango', de:'Mango', ru:'манго', zh:'芒果', ja:'マンゴー'}},
      {n:'kiwi', t:{fr:'kiwi', en:'kiwi', es:'kiwi', ht:'kiwi', de:'Kiwi', ru:'киви', zh:'猕猴桃', ja:'キウイ'}},
      {n:'raisin', t:{fr:'raisin', en:'grape', es:'uva', ht:'rezen', de:'Traube', ru:'виноград', zh:'葡萄', ja:'ブドウ'}},
      {n:'pêche', t:{fr:'pêche', en:'peach', es:'melocotón', ht:'pèch', de:'Pfirsich', ru:'персик', zh:'桃子', ja:'モモ'}},
      {n:'poire', t:{fr:'poire', en:'pear', es:'pera', ht:'pwa', de:'Birne', ru:'груша', zh:'梨', ja:'ナシ'}},
      {n:'abricot', t:{fr:'abricot', en:'apricot', es:'albaricoque', ht:'abriko', de:'Aprikose', ru:'абрикос', zh:'杏', ja:'アプリコット'}},
    ]
  },
  // 3. Animaux (40 mots)
  animaux: {
    icon:'🐕', fr:'Animaux', en:'Animals', es:'Animales', ht:'Bèt', de:'Tiere', ru:'Животные', zh:'动物', ja:'動物',
    words: [
      {n:'chien', t:{fr:'chien', en:'dog', es:'perro', ht:'chen', de:'Hund', ru:'собака', zh:'狗', ja:'犬'}},
      {n:'chat', t:{fr:'chat', en:'cat', es:'gato', ht:'chat', de:'Katze', ru:'кошка', zh:'猫', ja:'猫'}},
      {n:'oiseau', t:{fr:'oiseau', en:'bird', es:'pájaro', ht:'zwazo', de:'Vogel', ru:'птица', zh:'鸟', ja:'鳥'}},
      {n:'poisson', t:{fr:'poisson', en:'fish', es:'pez', ht:'pwason', de:'Fisch', ru:'рыба', zh:'鱼', ja:'魚'}},
      {n:'cheval', t:{fr:'cheval', en:'horse', es:'caballo', ht:'chwal', de:'Pferd', ru:'лошадь', zh:'马', ja:'馬'}},
      {n:'vache', t:{fr:'vache', en:'cow', es:'vaca', ht:'bèf', de:'Kuh', ru:'корова', zh:'牛', ja:'牛'}},
      {n:'cochon', t:{fr:'cochon', en:'pig', es:'cerdo', ht:'kochon', de:'Schwein', ru:'свинья', zh:'猪', ja:'豚'}},
      {n:'mouton', t:{fr:'mouton', en:'sheep', es:'oveja', ht:'mouton', de:'Schaf', ru:'овца', zh:'羊', ja:'羊'}},
      {n:'chèvre', t:{fr:'chèvre', en:'goat', es:'cabra', ht:'kabrit', de:'Ziege', ru:'коза', zh:'山羊', ja:'ヤギ'}},
      {n:'lapin', t:{fr:'lapin', en:'rabbit', es:'conejo', ht:'lapen', de:'Hase', ru:'кролик', zh:'兔子', ja:'ウサギ'}},
      {n:'souris', t:{fr:'souris', en:'mouse', es:'ratón', ht:'sourit', de:'Maus', ru:'мышь', zh:'老鼠', ja:'ネズミ'}},
      {n:'rat', t:{fr:'rat', en:'rat', es:'rata', ht:'rat', de:'Ratte', ru:'крыса', zh:'大鼠', ja:'ラット'}},
      {n:'singe', t:{fr:'singe', en:'monkey', es:'mono', ht:'macaque', de:'Affe', ru:'обезьяна', zh:'猴子', ja:'サル'}},
      {n:'éléphant', t:{fr:'éléphant', en:'elephant', es:'elefante', ht:'elefan', de:'Elefant', ru:'слон', zh:'大象', ja:'ゾウ'}},
      {n:'lion', t:{fr:'lion', en:'lion', es:'león', ht:'lyon', de:'Löwe', ru:'лев', zh:'狮子', ja:'ライオン'}},
      {n:'tigre', t:{fr:'tigre', en:'tiger', es:'tigre', ht:'tig', de:'Tiger', ru:'тигр', zh:'老虎', ja:'トラ'}},
      {n:'girafe', t:{fr:'girafe', en:'giraffe', es:'jirafa', ht:'jiraf', de:'Giraffe', ru:'жираф', zh:'长颈鹿', ja:'キリン'}},
      {n:'zèbre', t:{fr:'zèbre', en:'zebra', es:'cebra', ht:'zeb', de:'Zebra', ru:'зебра', zh:'斑马', ja:'シマウマ'}},
      {n:'ours', t:{fr:'ours', en:'bear', es:'oso', ht:'ous', de:'Bär', ru:'медведь', zh:'熊', ja:'クマ'}},
      {n:'loup', t:{fr:'loup', en:'wolf', es:'lobo', ht:'lou', de:'Wolf', ru:'волк', zh:'狼', ja:'オオカミ'}},
      {n:'renard', t:{fr:'renard', en:'fox', es:'zorro', ht:'renar', de:'Fuchs', ru:'лиса', zh:'狐狸', ja:'キツネ'}},
      {n:'cerf', t:{fr:'cerf', en:'deer', es:'ciervo', ht:'sèf', de:'Hirsch', ru:'олень', zh:'鹿', ja:'シカ'}},
      {n:'écureuil', t:{fr:'écureuil', en:'squirrel', es:'ardilla', ht:'ekirèy', de:'Eichhörnchen', ru:'белка', zh:'松鼠', ja:'リス'}},
      {n:'papillon', t:{fr:'papillon', en:'butterfly', es:'mariposa', ht:'papiyon', de:'Schmetterling', ru:'бабочка', zh:'蝴蝶', ja:'チョウ'}},
      {n:'abeille', t:{fr:'abeille', en:'bee', es:'abeja', ht:'myèl', de:'Biene', ru:'пчела', zh:'蜜蜂', ja:'ハチ'}},
      {n:'araignée', t:{fr:'araignée', en:'spider', es:'araña', ht:'zariyen', de:'Spinne', ru:'паук', zh:'蜘蛛', ja:'クモ'}},
      {n:'fourmi', t:{fr:'fourmi', en:'ant', es:'hormiga', ht:'foumi', de:'Ameise', ru:'муравей', zh:'蚂蚁', ja:'アリ'}},
      {n:'mouche', t:{fr:'mouche', en:'fly', es:'mosca', ht:'mouch', de:'Fliege', ru:'муха', zh:'苍蝇', ja:'ハエ'}},
      {n:'canard', t:{fr:'canard', en:'duck', es:'pato', ht:'kanna', de:'Ente', ru:'утка', zh:'鸭子', ja:'アヒル'}},
      {n:'poule', t:{fr:'poule', en:'hen', es:'gallina', ht:'poul', de:'Huhn', ru:'курица', zh:'母鸡', ja:'ニワトリ'}},
      {n:'grenouille', t:{fr:'grenouille', en:'frog', es:'rana', ht:'krapo', de:'Frosch', ru:'лягушка', zh:'青蛙', ja:'カエル'}},
      {n:'serpent', t:{fr:'serpent', en:'snake', es:'serpiente', ht:'koulèv', de:'Schlange', ru:'змея', zh:'蛇', ja:'ヘビ'}},
      {n:'tortue', t:{fr:'tortue', en:'turtle', es:'tortuga', ht:'tòti', de:'Schildkröte', ru:'черепаха', zh:'乌龟', ja:'カメ'}},
      {n:'dauphin', t:{fr:'dauphin', en:'dolphin', es:'delfín', ht:'dòfen', de:'Delfin', ru:'дельфин', zh:'海豚', ja:'イルカ'}},
      {n:'baleine', t:{fr:'baleine', en:'whale', es:'ballena', ht:'balèn', de:'Wal', ru:'кит', zh:'鲸鱼', ja:'クジラ'}},
      {n:'requin', t:{fr:'requin', en:'shark', es:'tiburón', ht:'reken', de:'Hai', ru:'акула', zh:'鲨鱼', ja:'サメ'}},
      {n:'aigle', t:{fr:'aigle', en:'eagle', es:'águila', ht:'èg', de:'Adler', ru:'орёл', zh:'鹰', ja:'ワシ'}},
      {n:'hibou', t:{fr:'hibou', en:'owl', es:'búho', ht:'chouèt', de:'Eule', ru:'сова', zh:'猫头鹰', ja:'フクロウ'}},
      {n:'pingouin', t:{fr:'pingouin', en:'penguin', es:'pingüino', ht:'pengwen', de:'Pinguin', ru:'пингвин', zh:'企鹅', ja:'ペンギン'}},
      {n:'kangourou', t:{fr:'kangourou', en:'kangaroo', es:'canguro', ht:'kanngouwou', de:'Känguru', ru:'кенгуру', zh:'袋鼠', ja:'カンガルー'}},
    ]
  },
  // 4. Famille (30 mots)
  famille: {
    icon:'👪', fr:'Famille', en:'Family', es:'Familia', ht:'Fanmi', de:'Familie', ru:'Семья', zh:'家庭', ja:'家族',
    words: [
      {n:'père', t:{fr:'père', en:'father', es:'padre', ht:'papa', de:'Vater', ru:'отец', zh:'父亲', ja:'父'}},
      {n:'mère', t:{fr:'mère', en:'mother', es:'madre', ht:'manman', de:'Mutter', ru:'мать', zh:'母亲', ja:'母'}},
      {n:'frère', t:{fr:'frère', en:'brother', es:'hermano', ht:'frè', de:'Bruder', ru:'брат', zh:'兄弟', ja:'兄弟'}},
      {n:'sœur', t:{fr:'sœur', en:'sister', es:'hermana', ht:'sè', de:'Schwester', ru:'сестра', zh:'姐妹', ja:'姉妹'}},
      {n:'fils', t:{fr:'fils', en:'son', es:'hijo', ht:'pitit gason', de:'Sohn', ru:'сын', zh:'儿子', ja:'息子'}},
      {n:'fille', t:{fr:'fille', en:'daughter', es:'hija', ht:'pitit fi', de:'Tochter', ru:'дочь', zh:'女儿', ja:'娘'}},
      {n:'grand-père', t:{fr:'grand-père', en:'grandfather', es:'abuelo', ht:'granpapa', de:'Großvater', ru:'дедушка', zh:'祖父', ja:'祖父'}},
      {n:'grand-mère', t:{fr:'grand-mère', en:'grandmother', es:'abuela', ht:'granmanman', de:'Großmutter', ru:'бабушка', zh:'祖母', ja:'祖母'}},
      {n:'oncle', t:{fr:'oncle', en:'uncle', es:'tío', ht:'tonton', de:'Onkel', ru:'дядя', zh:'叔叔', ja:'おじ'}},
      {n:'tante', t:{fr:'tante', en:'aunt', es:'tía', ht:'matant', de:'Tante', ru:'тетя', zh:'阿姨', ja:'おば'}},
      {n:'cousin', t:{fr:'cousin', en:'cousin (m)', es:'primo', ht:'kousen', de:'Cousin', ru:'двоюродный брат', zh:'表兄弟', ja:'いとこ(男)'}},
      {n:'cousine', t:{fr:'cousine', en:'cousin (f)', es:'prima', ht:'kousin', de:'Cousine', ru:'двоюродная сестра', zh:'表姐妹', ja:'いとこ(女)'}},
      {n:'mari', t:{fr:'mari', en:'husband', es:'marido', ht:'mari', de:'Ehemann', ru:'муж', zh:'丈夫', ja:'夫'}},
      {n:'femme', t:{fr:'femme', en:'wife', es:'esposa', ht:'madanm', de:'Ehefrau', ru:'жена', zh:'妻子', ja:'妻'}},
      {n:'bébé', t:{fr:'bébé', en:'baby', es:'bebé', ht:'bebe', de:'Baby', ru:'ребенок', zh:'婴儿', ja:'赤ちゃん'}},
      {n:'enfant', t:{fr:'enfant', en:'child', es:'niño/a', ht:'timoun', de:'Kind', ru:'ребёнок', zh:'孩子', ja:'子供'}},
      {n:'parent', t:{fr:'parent', en:'parent', es:'padre/madre', ht:'paran', de:'Elternteil', ru:'родитель', zh:'父母', ja:'親'}},
      {n:'beau-père', t:{fr:'beau-père', en:'father-in-law', es:'suegro', ht:'bòpapa', de:'Schwiegervater', ru:'тесть', zh:'岳父', ja:'義父'}},
      {n:'belle-mère', t:{fr:'belle-mère', en:'mother-in-law', es:'suegra', ht:'bòmanman', de:'Schwiegermutter', ru:'тёща', zh:'岳母', ja:'義母'}},
      {n:'gendre', t:{fr:'gendre', en:'son-in-law', es:'yerno', ht:'bofis', de:'Schwiegersohn', ru:'зять', zh:'女婿', ja:'婿'}},
      {n:'belle-fille', t:{fr:'belle-fille', en:'daughter-in-law', es:'nuera', ht:'bèlfi', de:'Schwiegertochter', ru:'невестка', zh:'儿媳', ja:'嫁'}},
      {n:'jumeau', t:{fr:'jumeau', en:'twin', es:'gemelo', ht:'jimo', de:'Zwilling', ru:'близнец', zh:'双胞胎', ja:'双子'}},
      {n:'orphelin', t:{fr:'orphelin', en:'orphan', es:'huérfano', ht:'òfelen', de:'Waise', ru:'сирота', zh:'孤儿', ja:'孤児'}},
      {n:'fiancé', t:{fr:'fiancé', en:'fiancé (m)', es:'prometido', ht:'fiyanse', de:'Verlobter', ru:'жених', zh:'未婚夫', ja:'婚約者'}},
      {n:'fiancée', t:{fr:'fiancée', en:'fiancée (f)', es:'prometida', ht:'fiyanse', de:'Verlobte', ru:'невеста', zh:'未婚妻', ja:'婚約者'}},
      {n:'neveu', t:{fr:'neveu', en:'nephew', es:'sobrino', ht:'neve', de:'Neffe', ru:'племянник', zh:'侄子', ja:'甥'}},
      {n:'nièce', t:{fr:'nièce', en:'niece', es:'sobrina', ht:'nyès', de:'Nichte', ru:'племянница', zh:'侄女', ja:'姪'}},
      {n:'arrière-grand-père', t:{fr:'arrière-grand-père', en:'great-grandfather', es:'bisabuelo', ht:'arriè granpapa', de:'Urgroßvater', ru:'прадедушка', zh:'曾祖父', ja:'曽祖父'}},
      {n:'arrière-grand-mère', t:{fr:'arrière-grand-mère', en:'great-grandmother', es:'bisabuela', ht:'arriè granmanman', de:'Urgroßmutter', ru:'прабабушка', zh:'曾祖母', ja:'曽祖母'}},
      {n:'parrain', t:{fr:'parrain', en:'godfather', es:'padrino', ht:'parenn', de:'Pate', ru:'крёстный отец', zh:'教父', ja:'名付け親'}},
    ]
  },
  // 5. Maison (45 mots)
  maison: {
    icon:'🏠', fr:'Maison', en:'House', es:'Casa', ht:'Kay', de:'Haus', ru:'Дом', zh:'房子', ja:'家',
    words: [
      {n:'appartement', t:{fr:'appartement', en:'apartment', es:'apartamento', ht:'apatman', de:'Wohnung', ru:'квартира', zh:'公寓', ja:'アパート'}},
      {n:'pièce', t:{fr:'pièce', en:'room', es:'habitación', ht:'chanm', de:'Zimmer', ru:'комната', zh:'房间', ja:'部屋'}},
      {n:'cuisine', t:{fr:'cuisine', en:'kitchen', es:'cocina', ht:'kwizin', de:'Küche', ru:'кухня', zh:'厨房', ja:'キッチン'}},
      {n:'salle à manger', t:{fr:'salle à manger', en:'dining room', es:'comedor', ht:'sal manje', de:'Esszimmer', ru:'столовая', zh:'餐厅', ja:'食堂'}},
      {n:'salon', t:{fr:'salon', en:'living room', es:'sala', ht:'salon', de:'Wohnzimmer', ru:'гостиная', zh:'客厅', ja:'リビング'}},
      {n:'chambre', t:{fr:'chambre', en:'bedroom', es:'dormitorio', ht:'chanm', de:'Schlafzimmer', ru:'спальня', zh:'卧室', ja:'寝室'}},
      {n:'salle de bain', t:{fr:'salle de bain', en:'bathroom', es:'baño', ht:'twalèt', de:'Badezimmer', ru:'ванная', zh:'浴室', ja:'浴室'}},
      {n:'toilettes', t:{fr:'toilettes', en:'toilet', es:'inodoro', ht:'twalèt', de:'Toilette', ru:'туалет', zh:'厕所', ja:'トイレ'}},
      {n:'couloir', t:{fr:'couloir', en:'hallway', es:'pasillo', ht:'koulwa', de:'Flur', ru:'коридор', zh:'走廊', ja:'廊下'}},
      {n:'escalier', t:{fr:'escalier', en:'stairs', es:'escaleras', ht:'escalye', de:'Treppe', ru:'лестница', zh:'楼梯', ja:'階段'}},
      {n:'ascenseur', t:{fr:'ascenseur', en:'elevator', es:'ascensor', ht:'asansè', de:'Aufzug', ru:'лифт', zh:'电梯', ja:'エレベーター'}},
      {n:'porte', t:{fr:'porte', en:'door', es:'puerta', ht:'pòt', de:'Tür', ru:'дверь', zh:'门', ja:'ドア'}},
      {n:'fenêtre', t:{fr:'fenêtre', en:'window', es:'ventana', ht:'fenèt', de:'Fenster', ru:'окно', zh:'窗户', ja:'窓'}},
      {n:'mur', t:{fr:'mur', en:'wall', es:'pared', ht:'miray', de:'Wand', ru:'стена', zh:'墙', ja:'壁'}},
      {n:'toit', t:{fr:'toit', en:'roof', es:'techo', ht:'do kay', de:'Dach', ru:'крыша', zh:'屋顶', ja:'屋根'}},
      {n:'plancher', t:{fr:'plancher', en:'floor', es:'piso', ht:'planche', de:'Boden', ru:'пол', zh:'地板', ja:'床'}},
      {n:'meuble', t:{fr:'meuble', en:'furniture', es:'mueble', ht:'mèb', de:'Möbel', ru:'мебель', zh:'家具', ja:'家具'}},
      {n:'table', t:{fr:'table', en:'table', es:'mesa', ht:'tab', de:'Tisch', ru:'стол', zh:'桌子', ja:'テーブル'}},
      {n:'chaise', t:{fr:'chaise', en:'chair', es:'silla', ht:'chèz', de:'Stuhl', ru:'стул', zh:'椅子', ja:'椅子'}},
      {n:'lit', t:{fr:'lit', en:'bed', es:'cama', ht:'kabann', de:'Bett', ru:'кровать', zh:'床', ja:'ベッド'}},
      {n:'armoire', t:{fr:'armoire', en:'wardrobe', es:'armario', ht:'klozèt', de:'Schrank', ru:'шкаф', zh:'衣柜', ja:'クローゼット'}},
      {n:'étagère', t:{fr:'étagère', en:'shelf', es:'estante', ht:'etajè', de:'Regal', ru:'полка', zh:'架子', ja:'棚'}},
      {n:'canapé', t:{fr:'canapé', en:'sofa', es:'sofá', ht:'kanape', de:'Sofa', ru:'диван', zh:'沙发', ja:'ソファ'}},
      {n:'télévision', t:{fr:'télévision', en:'television', es:'televisión', ht:'televizyon', de:'Fernseher', ru:'телевизор', zh:'电视', ja:'テレビ'}},
      {n:'ordinateur', t:{fr:'ordinateur', en:'computer', es:'computadora', ht:'òdinatè', de:'Computer', ru:'компьютер', zh:'电脑', ja:'コンピュータ'}},
      {n:'lampe', t:{fr:'lampe', en:'lamp', es:'lámpara', ht:'lamp', de:'Lampe', ru:'лампа', zh:'灯', ja:'ランプ'}},
      {n:'lit bébé', t:{fr:'lit bébé', en:'crib', es:'cuna', ht:'bèso', de:'Kinderbett', ru:'кроватка', zh:'婴儿床', ja:'ベビーベッド'}},
      {n:'bureau', t:{fr:'bureau', en:'desk', es:'escritorio', ht:'biwo', de:'Schreibtisch', ru:'письменный стол', zh:'书桌', ja:'机'}},
      {n:'réfrigérateur', t:{fr:'réfrigérateur', en:'refrigerator', es:'nevera', ht:'frijidè', de:'Kühlschrank', ru:'холодильник', zh:'冰箱', ja:'冷蔵庫'}},
      {n:'four', t:{fr:'four', en:'oven', es:'horno', ht:'fou', de:'Ofen', ru:'духовка', zh:'烤箱', ja:'オーブン'}},
      {n:'micro-ondes', t:{fr:'micro-ondes', en:'microwave', es:'microondas', ht:'mikwo ond', de:'Mikrowelle', ru:'микроволновка', zh:'微波炉', ja:'電子レンジ'}},
      {n:'lave-vaisselle', t:{fr:'lave-vaisselle', en:'dishwasher', es:'lavavajillas', ht:'lave-vas', de:'Spülmaschine', ru:'посудомойка', zh:'洗碗机', ja:'食器洗い機'}},
      {n:'machine à laver', t:{fr:'machine à laver', en:'washing machine', es:'lavadora', ht:'lave-ling', de:'Waschmaschine', ru:'стиральная машина', zh:'洗衣机', ja:'洗濯機'}},
      {n:'sèche-linge', t:{fr:'sèche-linge', en:'dryer', es:'secadora', ht:'sekèch', de:'Trockner', ru:'сушилка', zh:'烘干机', ja:'乾燥機'}},
      {n:'aspirateur', t:{fr:'aspirateur', en:'vacuum cleaner', es:'aspiradora', ht:'aspiratè', de:'Staubsauger', ru:'пылесос', zh:'吸尘器', ja:'掃除機'}},
      {n:'fer à repasser', t:{fr:'fer à repasser', en:'iron', es:'plancha', ht:'fè', de:'Bügeleisen', ru:'утюг', zh:'熨斗', ja:'アイロン'}},
      {n:'balai', t:{fr:'balai', en:'broom', es:'escoba', ht:'bale', de:'Besen', ru:'метла', zh:'扫帚', ja:'ほうき'}},
      {n:'serpillière', t:{fr:'serpillière', en:'mop', es:'fregona', ht:'sèpyè', de:'Mopp', ru:'швабра', zh:'拖把', ja:'モップ'}},
      {n:'poubelle', t:{fr:'poubelle', en:'trash can', es:'basura', ht:'poubèl', de:'Mülleimer', ru:'мусорное ведро', zh:'垃圾桶', ja:'ゴミ箱'}},
      {n:'jardin', t:{fr:'jardin', en:'garden', es:'jardín', ht:'jaden', de:'Garten', ru:'сад', zh:'花园', ja:'庭'}},
      {n:'balcon', t:{fr:'balcon', en:'balcony', es:'balcón', ht:'balkon', de:'Balkon', ru:'балкон', zh:'阳台', ja:'バルコニー'}},
      {n:'garage', t:{fr:'garage', en:'garage', es:'garaje', ht:'garaj', de:'Garage', ru:'гараж', zh:'车库', ja:'ガレージ'}},
      {n:'cave', t:{fr:'cave', en:'basement', es:'sótano', ht:'kav', de:'Keller', ru:'подвал', zh:'地下室', ja:'地下室'}},
      {n:'grenier', t:{fr:'grenier', en:'attic', es:'ático', ht:'grenye', de:'Dachboden', ru:'чердак', zh:'阁楼', ja:'屋根裏'}},
      {n:'cheminée', t:{fr:'cheminée', en:'fireplace', es:'chimenea', ht:'chemine', de:'Kamin', ru:'камин', zh:'壁炉', ja:'暖炉'}},
    ]
  },
  // 6. Vêtements (35 mots)
  vetements: {
    icon:'👕', fr:'Vêtements', en:'Clothes', es:'Ropa', ht:'Rad', de:'Kleidung', ru:'Одежда', zh:'衣服', ja:'服',
    words: [
      {n:'chemise', t:{fr:'chemise', en:'shirt', es:'camisa', ht:'chemiz', de:'Hemd', ru:'рубашка', zh:'衬衫', ja:'シャツ'}},
      {n:'pantalon', t:{fr:'pantalon', en:'pants', es:'pantalón', ht:'pantalon', de:'Hose', ru:'брюки', zh:'裤子', ja:'ズボン'}},
      {n:'jupe', t:{fr:'jupe', en:'skirt', es:'falda', ht:'jip', de:'Rock', ru:'юбка', zh:'裙子', ja:'スカート'}},
      {n:'robe', t:{fr:'robe', en:'dress', es:'vestido', ht:'wòb', de:'Kleid', ru:'платье', zh:'连衣裙', ja:'ドレス'}},
      {n:'veste', t:{fr:'veste', en:'jacket', es:'chaqueta', ht:'vest', de:'Jacke', ru:'куртка', zh:'夹克', ja:'ジャケット'}},
      {n:'manteau', t:{fr:'manteau', en:'coat', es:'abrigo', ht:'manto', de:'Mantel', ru:'пальто', zh:'外套', ja:'コート'}},
      {n:'chaussures', t:{fr:'chaussures', en:'shoes', es:'zapatos', ht:'soulye', de:'Schuhe', ru:'обувь', zh:'鞋子', ja:'靴'}},
      {n:'chaussettes', t:{fr:'chaussettes', en:'socks', es:'calcetines', ht:'chosèt', de:'Socken', ru:'носки', zh:'袜子', ja:'靴下'}},
      {n:'chapeau', t:{fr:'chapeau', en:'hat', es:'sombrero', ht:'chapo', de:'Hut', ru:'шляпа', zh:'帽子', ja:'帽子'}},
      {n:'écharpe', t:{fr:'écharpe', en:'scarf', es:'bufanda', ht:'foulad', de:'Schal', ru:'шарф', zh:'围巾', ja:'マフラー'}},
      {n:'gants', t:{fr:'gants', en:'gloves', es:'guantes', ht:'gan', de:'Handschuhe', ru:'перчатки', zh:'手套', ja:'手袋'}},
      {n:'ceinture', t:{fr:'ceinture', en:'belt', es:'cinturón', ht:'senti', de:'Gürtel', ru:'ремень', zh:'腰带', ja:'ベルト'}},
      {n:'lunettes', t:{fr:'lunettes', en:'glasses', es:'gafas', ht:'linèt', de:'Brille', ru:'очки', zh:'眼镜', ja:'メガネ'}},
      {n:'montre', t:{fr:'montre', en:'watch', es:'reloj', ht:'mont', de:'Uhr', ru:'часы', zh:'手表', ja:'時計'}},
      {n:'bijou', t:{fr:'bijou', en:'jewelry', es:'joya', ht:'bijou', de:'Schmuck', ru:'ювелирное изделие', zh:'珠宝', ja:'宝石'}},
      {n:'pyjama', t:{fr:'pyjama', en:'pajamas', es:'pijama', ht:'pijama', de:'Pyjama', ru:'пижама', zh:'睡衣', ja:'パジャマ'}},
      {n:'maillot de bain', t:{fr:'maillot de bain', en:'swimsuit', es:'traje de baño', ht:'mayo', de:'Badeanzug', ru:'купальник', zh:'泳衣', ja:'水着'}},
      {n:'short', t:{fr:'short', en:'shorts', es:'pantalón corto', ht:'kout pantalon', de:'Shorts', ru:'шорты', zh:'短裤', ja:'ショートパンツ'}},
      {n:'cravate', t:{fr:'cravate', en:'tie', es:'corbata', ht:'kravat', de:'Krawatte', ru:'галстук', zh:'领带', ja:'ネクタイ'}},
      {n:'chemisier', t:{fr:'chemisier', en:'blouse', es:'blusa', ht:'chemizye', de:'Bluse', ru:'блузка', zh:'女式衬衫', ja:'ブラウス'}},
      {n:'pull', t:{fr:'pull', en:'sweater', es:'suéter', ht:'poul', de:'Pullover', ru:'свитер', zh:'毛衣', ja:'セーター'}},
      {n:'gilet', t:{fr:'gilet', en:'vest', es:'chaleco', ht:'jilèt', de:'Weste', ru:'жилет', zh:'马甲', ja:'ベスト'}},
      {n:'casquette', t:{fr:'casquette', en:'cap', es:'gorra', ht:'kaskèt', de:'Kappe', ru:'кепка', zh:'鸭舌帽', ja:'キャップ'}},
      {n:'bottes', t:{fr:'bottes', en:'boots', es:'botas', ht:'bòt', de:'Stiefel', ru:'сапоги', zh:'靴子', ja:'ブーツ'}},
      {n:'sandales', t:{fr:'sandales', en:'sandals', es:'sandalias', ht:'sandal', de:'Sandalen', ru:'сандалии', zh:'凉鞋', ja:'サンダル'}},
      {n:'lacets', t:{fr:'lacets', en:'laces', es:'cordones', ht:'lase', de:'Schnürsenkel', ru:'шнурки', zh:'鞋带', ja:'靴ひも'}},
      {n:'bouton', t:{fr:'bouton', en:'button', es:'botón', ht:'bouton', de:'Knopf', ru:'пуговица', zh:'纽扣', ja:'ボタン'}},
      {n:'fermeture éclair', t:{fr:'fermeture éclair', en:'zipper', es:'cremallera', ht:'chemine', de:'Reißverschluss', ru:'молния', zh:'拉链', ja:'ジッパー'}},
      {n:'poche', t:{fr:'poche', en:'pocket', es:'bolsillo', ht:'pòch', de:'Tasche', ru:'карман', zh:'口袋', ja:'ポケット'}},
      {n:'robe de chambre', t:{fr:'robe de chambre', en:'bathrobe', es:'bata', ht:'wòb chanm', de:'Bademantel', ru:'халат', zh:'浴袍', ja:'バスローブ'}},
      {n:'caleçon', t:{fr:'caleçon', en:'underpants', es:'calzoncillos', ht:'kalson', de:'Unterhose', ru:'трусы', zh:'内裤', ja:'パンツ'}},
      {n:'soutien-gorge', t:{fr:'soutien-gorge', en:'bra', es:'sujetador', ht:'soutyen', de:'BH', ru:'бюстгальтер', zh:'胸罩', ja:'ブラジャー'}},
      {n:'chandail', t:{fr:'chandail', en:'jumper', es:'jersey', ht:'chanday', de:'Pullover', ru:'джемпер', zh:'套头毛衣', ja:'ジャンパー'}},
      {n:'imperméable', t:{fr:'imperméable', en:'raincoat', es:'impermeable', ht:'enpèmeyab', de:'Regenmantel', ru:'дождевик', zh:'雨衣', ja:'レインコート'}},
      {n:'costume', t:{fr:'costume', en:'suit', es:'traje', ht:'kostim', de:'Anzug', ru:'костюм', zh:'西装', ja:'スーツ'}},
    ]
  },
  // 7. Couleurs (18 mots)
  couleurs: {
    icon:'🎨', fr:'Couleurs', en:'Colors', es:'Colores', ht:'Koulè', de:'Farben', ru:'Цвета', zh:'颜色', ja:'色',
    words: [
      {n:'rouge', t:{fr:'rouge', en:'red', es:'rojo', ht:'wouj', de:'Rot', ru:'красный', zh:'红色', ja:'赤'}},
      {n:'bleu', t:{fr:'bleu', en:'blue', es:'azul', ht:'ble', de:'Blau', ru:'синий', zh:'蓝色', ja:'青'}},
      {n:'vert', t:{fr:'vert', en:'green', es:'verde', ht:'vèt', de:'Grün', ru:'зеленый', zh:'绿色', ja:'緑'}},
      {n:'jaune', t:{fr:'jaune', en:'yellow', es:'amarillo', ht:'jòn', de:'Gelb', ru:'желтый', zh:'黄色', ja:'黄色'}},
      {n:'orange', t:{fr:'orange', en:'orange', es:'naranja', ht:'oranj', de:'Orange', ru:'оранжевый', zh:'橙色', ja:'オレンジ'}},
      {n:'violet', t:{fr:'violet', en:'purple', es:'morado', ht:'vyolèt', de:'Lila', ru:'фиолетовый', zh:'紫色', ja:'紫'}},
      {n:'rose', t:{fr:'rose', en:'pink', es:'rosa', ht:'wòz', de:'Pink', ru:'розовый', zh:'粉色', ja:'ピンク'}},
      {n:'marron', t:{fr:'marron', en:'brown', es:'marrón', ht:'mawon', de:'Braun', ru:'коричневый', zh:'棕色', ja:'茶色'}},
      {n:'gris', t:{fr:'gris', en:'gray', es:'gris', ht:'gri', de:'Grau', ru:'серый', zh:'灰色', ja:'灰色'}},
      {n:'noir', t:{fr:'noir', en:'black', es:'negro', ht:'nwa', de:'Schwarz', ru:'черный', zh:'黑色', ja:'黒'}},
      {n:'blanc', t:{fr:'blanc', en:'white', es:'blanco', ht:'blan', de:'Weiß', ru:'белый', zh:'白色', ja:'白'}},
      {n:'argenté', t:{fr:'argenté', en:'silver', es:'plateado', ht:'ajan', de:'Silber', ru:'серебряный', zh:'银色', ja:'銀色'}},
      {n:'doré', t:{fr:'doré', en:'gold', es:'dorado', ht:'lò', de:'Gold', ru:'золотой', zh:'金色', ja:'金色'}},
      {n:'beige', t:{fr:'beige', en:'beige', es:'beige', ht:'bèj', de:'Beige', ru:'бежевый', zh:'米色', ja:'ベージュ'}},
      {n:'turquoise', t:{fr:'turquoise', en:'turquoise', es:'turquesa', ht:'tirikwaz', de:'Türkis', ru:'бирюзовый', zh:'绿松石色', ja:'ターコイズ'}},
      {n:'pourpre', t:{fr:'pourpre', en:'crimson', es:'carmesí', ht:'poup', de:'Purpur', ru:'пурпурный', zh:'深红', ja:'深紅'}},
      {n:'indigo', t:{fr:'indigo', en:'indigo', es:'índigo', ht:'endigo', de:'Indigo', ru:'индиго', zh:'靛蓝', ja:'インジゴ'}},
      {n:'cyan', t:{fr:'cyan', en:'cyan', es:'cian', ht:'syan', de:'Cyan', ru:'циан', zh:'青色', ja:'シアン'}},
    ]
  },
  // 8. Corps humain (30 mots)
  corps: {
    icon:'🧍', fr:'Corps', en:'Body', es:'Cuerpo', ht:'Kò', de:'Körper', ru:'Тело', zh:'身体', ja:'体',
    words: [
      {n:'tête', t:{fr:'tête', en:'head', es:'cabeza', ht:'tèt', de:'Kopf', ru:'голова', zh:'头', ja:'頭'}},
      {n:'cheveux', t:{fr:'cheveux', en:'hair', es:'pelo', ht:'cheve', de:'Haar', ru:'волосы', zh:'头发', ja:'髪'}},
      {n:'œil', t:{fr:'œil', en:'eye', es:'ojo', ht:'je', de:'Auge', ru:'глаз', zh:'眼睛', ja:'目'}},
      {n:'oreille', t:{fr:'oreille', en:'ear', es:'oreja', ht:'zòrèy', de:'Ohr', ru:'ухо', zh:'耳朵', ja:'耳'}},
      {n:'nez', t:{fr:'nez', en:'nose', es:'nariz', ht:'nen', de:'Nase', ru:'нос', zh:'鼻子', ja:'鼻'}},
      {n:'bouche', t:{fr:'bouche', en:'mouth', es:'boca', ht:'bouch', de:'Mund', ru:'рот', zh:'嘴', ja:'口'}},
      {n:'dent', t:{fr:'dent', en:'tooth', es:'diente', ht:'dan', de:'Zahn', ru:'зуб', zh:'牙齿', ja:'歯'}},
      {n:'langue', t:{fr:'langue', en:'tongue', es:'lengua', ht:'lang', de:'Zunge', ru:'язык', zh:'舌头', ja:'舌'}},
      {n:'cou', t:{fr:'cou', en:'neck', es:'cuello', ht:'kou', de:'Hals', ru:'шея', zh:'脖子', ja:'首'}},
      {n:'épaule', t:{fr:'épaule', en:'shoulder', es:'hombro', ht:'zepòl', de:'Schulter', ru:'плечо', zh:'肩膀', ja:'肩'}},
      {n:'bras', t:{fr:'bras', en:'arm', es:'brazo', ht:'bra', de:'Arm', ru:'рука', zh:'手臂', ja:'腕'}},
      {n:'coude', t:{fr:'coude', en:'elbow', es:'codo', ht:'koud', de:'Ellenbogen', ru:'локоть', zh:'肘部', ja:'肘'}},
      {n:'poignet', t:{fr:'poignet', en:'wrist', es:'muñeca', ht:'pongnèt', de:'Handgelenk', ru:'запястье', zh:'手腕', ja:'手首'}},
      {n:'main', t:{fr:'main', en:'hand', es:'mano', ht:'men', de:'Hand', ru:'кисть', zh:'手', ja:'手'}},
      {n:'doigt', t:{fr:'doigt', en:'finger', es:'dedo', ht:'dwèt', de:'Finger', ru:'палец', zh:'手指', ja:'指'}},
      {n:'ongle', t:{fr:'ongle', en:'nail', es:'uña', ht:'zong', de:'Nagel', ru:'ноготь', zh:'指甲', ja:'爪'}},
      {n:'poitrine', t:{fr:'poitrine', en:'chest', es:'pecho', ht:'pwatrin', de:'Brust', ru:'грудь', zh:'胸部', ja:'胸'}},
      {n:'ventre', t:{fr:'ventre', en:'belly', es:'vientre', ht:'vant', de:'Bauch', ru:'живот', zh:'腹部', ja:'お腹'}},
      {n:'dos', t:{fr:'dos', en:'back', es:'espalda', ht:'do', de:'Rücken', ru:'спина', zh:'背部', ja:'背中'}},
      {n:'jambe', t:{fr:'jambe', en:'leg', es:'pierna', ht:'janm', de:'Bein', ru:'нога', zh:'腿', ja:'脚'}},
      {n:'genou', t:{fr:'genou', en:'knee', es:'rodilla', ht:'jenou', de:'Knie', ru:'колено', zh:'膝盖', ja:'膝'}},
      {n:'cheville', t:{fr:'cheville', en:'ankle', es:'tobillo', ht:'chèvi', de:'Knöchel', ru:'лодыжка', zh:'脚踝', ja:'足首'}},
      {n:'pied', t:{fr:'pied', en:'foot', es:'pie', ht:'pye', de:'Fuß', ru:'стопа', zh:'脚', ja:'足'}},
      {n:'orteil', t:{fr:'orteil', en:'toe', es:'dedo del pie', ht:'zòtèy', de:'Zehe', ru:'палец ноги', zh:'脚趾', ja:'足の指'}},
      {n:'cœur', t:{fr:'cœur', en:'heart', es:'corazón', ht:'kè', de:'Herz', ru:'сердце', zh:'心脏', ja:'心臓'}},
      {n:'poumon', t:{fr:'poumon', en:'lung', es:'pulmón', ht:'poumon', de:'Lunge', ru:'легкое', zh:'肺', ja:'肺'}},
      {n:'foie', t:{fr:'foie', en:'liver', es:'hígado', ht:'fwa', de:'Leber', ru:'печень', zh:'肝脏', ja:'肝臓'}},
      {n:'rein', t:{fr:'rein', en:'kidney', es:'riñón', ht:'ren', de:'Niere', ru:'почка', zh:'肾脏', ja:'腎臓'}},
      {n:'cerveau', t:{fr:'cerveau', en:'brain', es:'cerebro', ht:'sèvo', de:'Gehirn', ru:'мозг', zh:'大脑', ja:'脳'}},
      {n:'squelette', t:{fr:'squelette', en:'skeleton', es:'esqueleto', ht:'skelèt', de:'Skelett', ru:'скелет', zh:'骨架', ja:'骨格'}},
    ]
  },
  // 9. Ville et lieux (40 mots)
  ville: {
    icon:'🏙️', fr:'Ville', en:'City', es:'Ciudad', ht:'Vil', de:'Stadt', ru:'Город', zh:'城市', ja:'都市',
    words: [
      {n:'rue', t:{fr:'rue', en:'street', es:'calle', ht:'lari', de:'Straße', ru:'улица', zh:'街道', ja:'通り'}},
      {n:'avenue', t:{fr:'avenue', en:'avenue', es:'avenida', ht:'avni', de:'Allee', ru:'проспект', zh:'大道', ja:'大通り'}},
      {n:'place', t:{fr:'place', en:'square', es:'plaza', ht:'plas', de:'Platz', ru:'площадь', zh:'广场', ja:'広場'}},
      {n:'pont', t:{fr:'pont', en:'bridge', es:'puente', ht:'pon', de:'Brücke', ru:'мост', zh:'桥', ja:'橋'}},
      {n:'parc', t:{fr:'parc', en:'park', es:'parque', ht:'pak', de:'Park', ru:'парк', zh:'公园', ja:'公園'}},
      {n:'jardin', t:{fr:'jardin', en:'garden', es:'jardín', ht:'jaden', de:'Garten', ru:'сад', zh:'花园', ja:'庭'}},
      {n:'forêt', t:{fr:'forêt', en:'forest', es:'bosque', ht:'forè', de:'Wald', ru:'лес', zh:'森林', ja:'森'}},
      {n:'montagne', t:{fr:'montagne', en:'mountain', es:'montaña', ht:'mòn', de:'Berg', ru:'гора', zh:'山', ja:'山'}},
      {n:'mer', t:{fr:'mer', en:'sea', es:'mar', ht:'lanmè', de:'Meer', ru:'море', zh:'海', ja:'海'}},
      {n:'plage', t:{fr:'plage', en:'beach', es:'playa', ht:'plaj', de:'Strand', ru:'пляж', zh:'海滩', ja:'ビーチ'}},
      {n:'rivière', t:{fr:'rivière', en:'river', es:'río', ht:'rivyè', de:'Fluss', ru:'река', zh:'河流', ja:'川'}},
      {n:'lac', t:{fr:'lac', en:'lake', es:'lago', ht:'lak', de:'See', ru:'озеро', zh:'湖', ja:'湖'}},
      {n:'magasin', t:{fr:'magasin', en:'shop', es:'tienda', ht:'boutik', de:'Geschäft', ru:'магазин', zh:'商店', ja:'店'}},
      {n:'supermarché', t:{fr:'supermarché', en:'supermarket', es:'supermercado', ht:'sipèmache', de:'Supermarkt', ru:'супермаркет', zh:'超市', ja:'スーパー'}},
      {n:'bibliothèque', t:{fr:'bibliothèque', en:'library', es:'biblioteca', ht:'bibliyotèk', de:'Bibliothek', ru:'библиотека', zh:'图书馆', ja:'図書館'}},
      {n:'musée', t:{fr:'musée', en:'museum', es:'museo', ht:'mize', de:'Museum', ru:'музей', zh:'博物馆', ja:'博物館'}},
      {n:'théâtre', t:{fr:'théâtre', en:'theater', es:'teatro', ht:'teyat', de:'Theater', ru:'театр', zh:'剧院', ja:'劇場'}},
      {n:'stade', t:{fr:'stade', en:'stadium', es:'estadio', ht:'stad', de:'Stadion', ru:'стадион', zh:'体育场', ja:'スタジアム'}},
      {n:'piscine', t:{fr:'piscine', en:'swimming pool', es:'piscina', ht:'pisin', de:'Schwimmbad', ru:'бассейн', zh:'游泳池', ja:'プール'}},
      {n:'gymnase', t:{fr:'gymnase', en:'gym', es:'gimnasio', ht:'jimnaz', de:'Turnhalle', ru:'спортзал', zh:'体育馆', ja:'ジム'}},
      {n:'restaurant', t:{fr:'restaurant', en:'restaurant', es:'restaurante', ht:'restoran', de:'Restaurant', ru:'ресторан', zh:'餐厅', ja:'レストラン'}},
      {n:'café', t:{fr:'café', en:'café', es:'cafetería', ht:'kafe', de:'Café', ru:'кафе', zh:'咖啡馆', ja:'カフェ'}},
      {n:'hôtel', t:{fr:'hôtel', en:'hotel', es:'hotel', ht:'otèl', de:'Hotel', ru:'отель', zh:'酒店', ja:'ホテル'}},
      {n:'aéroport', t:{fr:'aéroport', en:'airport', es:'aeropuerto', ht:'ayewopò', de:'Flughafen', ru:'аэропорт', zh:'机场', ja:'空港'}},
      {n:'gare routière', t:{fr:'gare routière', en:'bus station', es:'estación de autobuses', ht:'gar otobis', de:'Busbahnhof', ru:'автовокзал', zh:'公交车站', ja:'バスターミナル'}},
      {n:'gare ferroviaire', t:{fr:'gare', en:'train station', es:'estación de tren', ht:'gar tren', de:'Bahnhof', ru:'вокзал', zh:'火车站', ja:'鉄道駅'}},
      {n:'taxi', t:{fr:'taxi', en:'taxi', es:'taxi', ht:'taksi', de:'Taxi', ru:'такси', zh:'出租车', ja:'タクシー'}},
      {n:'métro', t:{fr:'métro', en:'subway', es:'metro', ht:'metwo', de:'U-Bahn', ru:'метро', zh:'地铁', ja:'地下鉄'}},
      {n:'vélo', t:{fr:'vélo', en:'bicycle', es:'bicicleta', ht:'bisyklèt', de:'Fahrrad', ru:'велосипед', zh:'自行车', ja:'自転車'}},
      {n:'voiture', t:{fr:'voiture', en:'car', es:'coche', ht:'machin', de:'Auto', ru:'машина', zh:'汽车', ja:'車'}},
      {n:'bus', t:{fr:'bus', en:'bus', es:'autobús', ht:'otobis', de:'Bus', ru:'автобус', zh:'公交车', ja:'バス'}},
      {n:'camion', t:{fr:'camion', en:'truck', es:'camión', ht:'kamyon', de:'Lastwagen', ru:'грузовик', zh:'卡车', ja:'トラック'}},
      {n:'moto', t:{fr:'moto', en:'motorcycle', es:'motocicleta', ht:'moto', de:'Motorrad', ru:'мотоцикл', zh:'摩托车', ja:'バイク'}},
      {n:'avion', t:{fr:'avion', en:'plane', es:'avión', ht:'avyon', de:'Flugzeug', ru:'самолёт', zh:'飞机', ja:'飛行機'}},
      {n:'bateau', t:{fr:'bateau', en:'boat', es:'barco', ht:'bato', de:'Boot', ru:'лодка', zh:'船', ja:'ボート'}},
      {n:'hôpital', t:{fr:'hôpital', en:'hospital', es:'hospital', ht:'lopital', de:'Krankenhaus', ru:'больница', zh:'医院', ja:'病院'}},
      {n:'école', t:{fr:'école', en:'school', es:'escuela', ht:'lekòl', de:'Schule', ru:'школа', zh:'学校', ja:'学校'}},
      {n:'université', t:{fr:'université', en:'university', es:'universidad', ht:'inivèsite', de:'Universität', ru:'университет', zh:'大学', ja:'大学'}},
      {n:'église', t:{fr:'église', en:'church', es:'iglesia', ht:'legliz', de:'Kirche', ru:'церковь', zh:'教堂', ja:'教会'}},
      {n:'mosquée', t:{fr:'mosquée', en:'mosque', es:'mezquita', ht:'moske', de:'Moschee', ru:'мечеть', zh:'清真寺', ja:'モスク'}},
    ]
  },
  // 10. Professions (35 mots)
  professions: {
    icon:'💼', fr:'Professions', en:'Professions', es:'Profesiones', ht:'Pwofesyon', de:'Berufe', ru:'Профессии', zh:'职业', ja:'職業',
    words: [
      {n:'médecin', t:{fr:'médecin', en:'doctor', es:'médico', ht:'doktè', de:'Arzt', ru:'врач', zh:'医生', ja:'医者'}},
      {n:'infirmier', t:{fr:'infirmier', en:'nurse', es:'enfermero', ht:'enfimye', de:'Krankenschwester', ru:'медсестра', zh:'护士', ja:'看護師'}},
      {n:'enseignant', t:{fr:'enseignant', en:'teacher', es:'profesor', ht:'pwofesè', de:'Lehrer', ru:'учитель', zh:'老师', ja:'先生'}},
      {n:'ingénieur', t:{fr:'ingénieur', en:'engineer', es:'ingeniero', ht:'enjenyè', de:'Ingenieur', ru:'инженер', zh:'工程师', ja:'エンジニア'}},
      {n:'avocat', t:{fr:'avocat', en:'lawyer', es:'abogado', ht:'avoka', de:'Anwalt', ru:'адвокат', zh:'律师', ja:'弁護士'}},
      {n:'policier', t:{fr:'policier', en:'police officer', es:'policía', ht:'polisye', de:'Polizist', ru:'полицейский', zh:'警察', ja:'警察官'}},
      {n:'pompier', t:{fr:'pompier', en:'firefighter', es:'bombero', ht:'ponpye', de:'Feuerwehrmann', ru:'пожарный', zh:'消防员', ja:'消防士'}},
      {n:'cuisinier', t:{fr:'cuisinier', en:'cook', es:'cocinero', ht:'kwizinye', de:'Koch', ru:'повар', zh:'厨师', ja:'料理人'}},
      {n:'boulanger', t:{fr:'boulanger', en:'baker', es:'panadero', ht:'boulanje', de:'Bäcker', ru:'пекарь', zh:'面包师', ja:'パン屋'}},
      {n:'chauffeur', t:{fr:'chauffeur', en:'driver', es:'conductor', ht:'chofè', de:'Fahrer', ru:'водитель', zh:'司机', ja:'運転手'}},
      {n:'artiste', t:{fr:'artiste', en:'artist', es:'artista', ht:'atis', de:'Künstler', ru:'художник', zh:'艺术家', ja:'芸術家'}},
      {n:'musicien', t:{fr:'musicien', en:'musician', es:'músico', ht:'mizisyen', de:'Musiker', ru:'музыкант', zh:'音乐家', ja:'音楽家'}},
      {n:'écrivain', t:{fr:'écrivain', en:'writer', es:'escritor', ht:'ekriven', de:'Schriftsteller', ru:'писатель', zh:'作家', ja:'作家'}},
      {n:'journaliste', t:{fr:'journaliste', en:'journalist', es:'periodista', ht:'jounalis', de:'Journalist', ru:'журналист', zh:'记者', ja:'ジャーナリスト'}},
      {n:'photographe', t:{fr:'photographe', en:'photographer', es:'fotógrafo', ht:'fotograf', de:'Fotograf', ru:'фотограф', zh:'摄影师', ja:'写真家'}},
      {n:'architecte', t:{fr:'architecte', en:'architect', es:'arquitecto', ht:'achitèk', de:'Architekt', ru:'архитектор', zh:'建筑师', ja:'建築家'}},
      {n:'comptable', t:{fr:'comptable', en:'accountant', es:'contable', ht:'kontab', de:'Buchhalter', ru:'бухгалтер', zh:'会计', ja:'会計士'}},
      {n:'vendeur', t:{fr:'vendeur', en:'salesperson', es:'vendedor', ht:'vandè', de:'Verkäufer', ru:'продавец', zh:'售货员', ja:'販売員'}},
      {n:'coiffeur', t:{fr:'coiffeur', en:'hairdresser', es:'peluquero', ht:'kafè', de:'Friseur', ru:'парикмахер', zh:'理发师', ja:'美容師'}},
      {n:'plombier', t:{fr:'plombier', en:'plumber', es:'fontanero', ht:'plonbye', de:'Klempner', ru:'сантехник', zh:'水管工', ja:'配管工'}},
      {n:'électricien', t:{fr:'électricien', en:'electrician', es:'electricista', ht:'elektrisyen', de:'Elektriker', ru:'электрик', zh:'电工', ja:'電気技師'}},
      {n:'mécanicien', t:{fr:'mécanicien', en:'mechanic', es:'mecánico', ht:'mekanisyen', de:'Mechaniker', ru:'механик', zh:'机械师', ja:'整備士'}},
      {n:'fermier', t:{fr:'fermier', en:'farmer', es:'granjero', ht:'fèmye', de:'Bauer', ru:'фермер', zh:'农民', ja:'農家'}},
      {n:'vétérinaire', t:{fr:'vétérinaire', en:'veterinarian', es:'veterinario', ht:'veterinè', de:'Tierarzt', ru:'ветеринар', zh:'兽医', ja:'獣医'}},
      {n:'dentiste', t:{fr:'dentiste', en:'dentist', es:'dentista', ht:'dantis', de:'Zahnarzt', ru:'стоматолог', zh:'牙医', ja:'歯医者'}},
      {n:'psychologue', t:{fr:'psychologue', en:'psychologist', es:'psicólogo', ht:'sikològ', de:'Psychologe', ru:'психолог', zh:'心理学家', ja:'心理学者'}},
      {n:'pharmacien', t:{fr:'pharmacien', en:'pharmacist', es:'farmacéutico', ht:'famasyen', de:'Apotheker', ru:'фармацевт', zh:'药剂师', ja:'薬剤師'}},
      {n:'juge', t:{fr:'juge', en:'judge', es:'juez', ht:'jij', de:'Richter', ru:'судья', zh:'法官', ja:'裁判官'}},
      {n:'politicien', t:{fr:'politicien', en:'politician', es:'político', ht:'politisyen', de:'Politiker', ru:'политик', zh:'政治家', ja:'政治家'}},
      {n:'astronaute', t:{fr:'astronaute', en:'astronaut', es:'astronauta', ht:'astwonòt', de:'Astronaut', ru:'космонавт', zh:'宇航员', ja:'宇宙飛行士'}},
      {n:'chirurgien', t:{fr:'chirurgien', en:'surgeon', es:'cirujano', ht:'chirijyen', de:'Chirurg', ru:'хирург', zh:'外科医生', ja:'外科医'}},
      {n:'peintre', t:{fr:'peintre', en:'painter', es:'pintor', ht:'pent', de:'Maler', ru:'художник', zh:'画家', ja:'画家'}},
      {n:'sculpteur', t:{fr:'sculpteur', en:'sculptor', es:'escultor', ht:'skiltè', de:'Bildhauer', ru:'скульптор', zh:'雕塑家', ja:'彫刻家'}},
      {n:'danseur', t:{fr:'danseur', en:'dancer', es:'bailarín', ht:'danse', de:'Tänzer', ru:'танцор', zh:'舞者', ja:'ダンサー'}},
      {n:'acteur', t:{fr:'acteur', en:'actor', es:'actor', ht:'aktè', de:'Schauspieler', ru:'актёр', zh:'演员', ja:'俳優'}},
    ]
  },
  // 11. Adjectifs (50 mots)
  adjectifs: {
    icon:'✨', fr:'Adjectifs', en:'Adjectives', es:'Adjetivos', ht:'Adjektif', de:'Adjektive', ru:'Прилагательные', zh:'形容词', ja:'形容詞',
    words: [
      {n:'grand', t:{fr:'grand', en:'big/tall', es:'grande/alto', ht:'gwo', de:'groß', ru:'большой/высокий', zh:'大/高', ja:'大きい/高い'}},
      {n:'petit', t:{fr:'petit', en:'small/short', es:'pequeño/bajo', ht:'piti', de:'klein', ru:'маленький/низкий', zh:'小/矮', ja:'小さい/低い'}},
      {n:'beau', t:{fr:'beau', en:'beautiful (m)', es:'hermoso', ht:'bèl', de:'schön', ru:'красивый', zh:'美丽', ja:'美しい'}},
      {n:'belle', t:{fr:'belle', en:'beautiful (f)', es:'hermosa', ht:'bèl', de:'schön', ru:'красивая', zh:'美丽', ja:'美しい'}},
      {n:'jeune', t:{fr:'jeune', en:'young', es:'joven', ht:'jèn', de:'jung', ru:'молодой', zh:'年轻', ja:'若い'}},
      {n:'vieux', t:{fr:'vieux', en:'old', es:'viejo', ht:'vye', de:'alt', ru:'старый', zh:'老', ja:'古い'}},
      {n:'nouveau', t:{fr:'nouveau', en:'new', es:'nuevo', ht:'nouvo', de:'neu', ru:'новый', zh:'新', ja:'新しい'}},
      {n:'bon', t:{fr:'bon', en:'good', es:'bueno', ht:'bon', de:'gut', ru:'хороший', zh:'好', ja:'良い'}},
      {n:'mauvais', t:{fr:'mauvais', en:'bad', es:'malo', ht:'move', de:'schlecht', ru:'плохой', zh:'坏', ja:'悪い'}},
      {n:'heureux', t:{fr:'heureux', en:'happy', es:'feliz', ht:'kontan', de:'glücklich', ru:'счастливый', zh:'快乐', ja:'幸せ'}},
      {n:'triste', t:{fr:'triste', en:'sad', es:'triste', ht:'tris', de:'traurig', ru:'грустный', zh:'悲伤', ja:'悲しい'}},
      {n:'fatigué', t:{fr:'fatigué', en:'tired', es:'cansado', ht:'fatige', de:'müde', ru:'усталый', zh:'疲倦', ja:'疲れた'}},
      {n:'malade', t:{fr:'malade', en:'sick', es:'enfermo', ht:'malad', de:'krank', ru:'больной', zh:'生病', ja:'病気'}},
      {n:'fort', t:{fr:'fort', en:'strong', es:'fuerte', ht:'fò', de:'stark', ru:'сильный', zh:'强壮', ja:'強い'}},
      {n:'faible', t:{fr:'faible', en:'weak', es:'débil', ht:'fèb', de:'schwach', ru:'слабый', zh:'虚弱', ja:'弱い'}},
      {n:'rapide', t:{fr:'rapide', en:'fast', es:'rápido', ht:'rapid', de:'schnell', ru:'быстрый', zh:'快速', ja:'速い'}},
      {n:'lent', t:{fr:'lent', en:'slow', es:'lento', ht:'lent', de:'langsam', ru:'медленный', zh:'慢', ja:'遅い'}},
      {n:'cher', t:{fr:'cher', en:'expensive', es:'caro', ht:'chè', de:'teuer', ru:'дорогой', zh:'昂贵', ja:'高い'}},
      {n:'bon marché', t:{fr:'bon marché', en:'cheap', es:'barato', ht:'bon mache', de:'billig', ru:'дешёвый', zh:'便宜', ja:'安い'}},
      {n:'facile', t:{fr:'facile', en:'easy', es:'fácil', ht:'fasil', de:'einfach', ru:'лёгкий', zh:'容易', ja:'簡単'}},
      {n:'difficile', t:{fr:'difficile', en:'difficult', es:'difícil', ht:'difikil', de:'schwer', ru:'трудный', zh:'困难', ja:'難しい'}},
      {n:'propre', t:{fr:'propre', en:'clean', es:'limpio', ht:'pwòp', de:'sauber', ru:'чистый', zh:'干净', ja:'きれい'}},
      {n:'sale', t:{fr:'sale', en:'dirty', es:'sucio', ht:'sal', de:'schmutzig', ru:'грязный', zh:'脏', ja:'汚い'}},
      {n:'plein', t:{fr:'plein', en:'full', es:'lleno', ht:'plen', de:'voll', ru:'полный', zh:'满', ja:'いっぱい'}},
      {n:'vide', t:{fr:'vide', en:'empty', es:'vacío', ht:'vid', de:'leer', ru:'пустой', zh:'空', ja:'空っぽ'}},
      {n:'chaud', t:{fr:'chaud', en:'hot', es:'caliente', ht:'cho', de:'heiß', ru:'горячий', zh:'热', ja:'暑い/熱い'}},
      {n:'froid', t:{fr:'froid', en:'cold', es:'frío', ht:'frèt', de:'kalt', ru:'холодный', zh:'冷', ja:'寒い/冷たい'}},
      {n:'doux', t:{fr:'doux', en:'soft', es:'suave', ht:'dous', de:'weich', ru:'мягкий', zh:'柔软', ja:'柔らかい'}},
      {n:'dur', t:{fr:'dur', en:'hard', es:'duro', ht:'di', de:'hart', ru:'твёрдый', zh:'硬', ja:'硬い'}},
      {n:'clair', t:{fr:'clair', en:'light', es:'claro', ht:'klè', de:'hell', ru:'светлый', zh:'明亮', ja:'明るい'}},
      {n:'sombre', t:{fr:'sombre', en:'dark', es:'oscuro', ht:'fènwa', de:'dunkel', ru:'тёмный', zh:'黑暗', ja:'暗い'}},
      {n:'intelligent', t:{fr:'intelligent', en:'intelligent', es:'inteligente', ht:'entelijan', de:'intelligent', ru:'умный', zh:'聪明', ja:'賢い'}},
      {n:'bête', t:{fr:'bête', en:'stupid', es:'tonto', ht:'bèt', de:'dumm', ru:'глупый', zh:'愚蠢', ja:'バカ'}},
      {n:'drôle', t:{fr:'drôle', en:'funny', es:'gracioso', ht:'komik', de:'lustig', ru:'смешной', zh:'有趣', ja:'面白い'}},
      {n:'sérieux', t:{fr:'sérieux', en:'serious', es:'serio', ht:'serye', de:'ernst', ru:'серьёзный', zh:'严肃', ja:'真面目'}},
      {n:'poli', t:{fr:'poli', en:'polite', es:'educado', ht:'poli', de:'höflich', ru:'вежливый', zh:'礼貌', ja:'礼儀正しい'}},
      {n:'impoli', t:{fr:'impoli', en:'rude', es:'grosero', ht:'enpoli', de:'unhöflich', ru:'грубый', zh:'粗鲁', ja:'失礼'}},
      {n:'riche', t:{fr:'riche', en:'rich', es:'rico', ht:'rich', de:'reich', ru:'богатый', zh:'富有', ja:'金持ち'}},
      {n:'pauvre', t:{fr:'pauvre', en:'poor', es:'pobre', ht:'pòv', de:'arm', ru:'бедный', zh:'贫穷', ja:'貧しい'}},
      {n:'simple', t:{fr:'simple', en:'simple', es:'simple', ht:'senp', de:'einfach', ru:'простой', zh:'简单', ja:'単純'}},
      {n:'complexe', t:{fr:'complexe', en:'complex', es:'complejo', ht:'konplèks', de:'komplex', ru:'сложный', zh:'复杂', ja:'複雑'}},
      {n:'moderne', t:{fr:'moderne', en:'modern', es:'moderno', ht:'modèn', de:'modern', ru:'современный', zh:'现代', ja:'現代の'}},
      {n:'ancien', t:{fr:'ancien', en:'ancient', es:'antiguo', ht:'ansyen', de:'alt', ru:'древний', zh:'古老', ja:'古代の'}},
      {n:'futur', t:{fr:'futur', en:'future', es:'futuro', ht:'fitir', de:'zukünftig', ru:'будущий', zh:'未来', ja:'未来の'}},
      {n:'possible', t:{fr:'possible', en:'possible', es:'posible', ht:'posib', de:'möglich', ru:'возможный', zh:'可能', ja:'可能'}},
      {n:'impossible', t:{fr:'impossible', en:'impossible', es:'imposible', ht:'enposib', de:'unmöglich', ru:'невозможный', zh:'不可能', ja:'不可能'}},
      {n:'nécessaire', t:{fr:'nécessaire', en:'necessary', es:'necesario', ht:'nesesè', de:'notwendig', ru:'необходимый', zh:'必要', ja:'必要'}},
      {n:'utile', t:{fr:'utile', en:'useful', es:'útil', ht:'itil', de:'nützlich', ru:'полезный', zh:'有用', ja:'役に立つ'}},
      {n:'inutile', t:{fr:'inutile', en:'useless', es:'inútil', ht:'initil', de:'nutzlos', ru:'бесполезный', zh:'无用', ja:'役に立たない'}},
      {n:'normal', t:{fr:'normal', en:'normal', es:'normal', ht:'nòmal', de:'normal', ru:'нормальный', zh:'正常', ja:'普通'}},
      {n:'spécial', t:{fr:'spécial', en:'special', es:'especial', ht:'espesyal', de:'speziell', ru:'особенный', zh:'特别', ja:'特別な'}},
    ]
  },
  // 12. Chiffres et nombres (0-20, 30,40,50,60,70,80,90,100,1000) -> 30 mots
  nombres: {
    icon:'🔢', fr:'Nombres', en:'Numbers', es:'Números', ht:'Nimewo', de:'Zahlen', ru:'Числа', zh:'数字', ja:'数字',
    words: [
      {n:'zéro', t:{fr:'zéro', en:'zero', es:'cero', ht:'zewo', de:'Null', ru:'ноль', zh:'零', ja:'ゼロ'}},
      {n:'un', t:{fr:'un', en:'one', es:'uno', ht:'youn', de:'eins', ru:'один', zh:'一', ja:'一'}},
      {n:'deux', t:{fr:'deux', en:'two', es:'dos', ht:'de', de:'zwei', ru:'два', zh:'二', ja:'二'}},
      {n:'trois', t:{fr:'trois', en:'three', es:'tres', ht:'twa', de:'drei', ru:'три', zh:'三', ja:'三'}},
      {n:'quatre', t:{fr:'quatre', en:'four', es:'cuatro', ht:'kat', de:'vier', ru:'четыре', zh:'四', ja:'四'}},
      {n:'cinq', t:{fr:'cinq', en:'five', es:'cinco', ht:'senk', de:'fünf', ru:'пять', zh:'五', ja:'五'}},
      {n:'six', t:{fr:'six', en:'six', es:'seis', ht:'sis', de:'sechs', ru:'шесть', zh:'六', ja:'六'}},
      {n:'sept', t:{fr:'sept', en:'seven', es:'siete', ht:'sèt', de:'sieben', ru:'семь', zh:'七', ja:'七'}},
      {n:'huit', t:{fr:'huit', en:'eight', es:'ocho', ht:'uit', de:'acht', ru:'восемь', zh:'八', ja:'八'}},
      {n:'neuf', t:{fr:'neuf', en:'nine', es:'nueve', ht:'nèf', de:'neun', ru:'девять', zh:'九', ja:'九'}},
      {n:'dix', t:{fr:'dix', en:'ten', es:'diez', ht:'dis', de:'zehn', ru:'десять', zh:'十', ja:'十'}},
      {n:'onze', t:{fr:'onze', en:'eleven', es:'once', ht:'onz', de:'elf', ru:'одиннадцать', zh:'十一', ja:'十一'}},
      {n:'douze', t:{fr:'douze', en:'twelve', es:'doce', ht:'douz', de:'zwölf', ru:'двенадцать', zh:'十二', ja:'十二'}},
      {n:'treize', t:{fr:'treize', en:'thirteen', es:'trece', ht:'trèz', de:'dreizehn', ru:'тринадцать', zh:'十三', ja:'十三'}},
      {n:'quatorze', t:{fr:'quatorze', en:'fourteen', es:'catorce', ht:'katòz', de:'vierzehn', ru:'четырнадцать', zh:'十四', ja:'十四'}},
      {n:'quinze', t:{fr:'quinze', en:'fifteen', es:'quince', ht:'kenz', de:'fünfzehn', ru:'пятнадцать', zh:'十五', ja:'十五'}},
      {n:'seize', t:{fr:'seize', en:'sixteen', es:'dieciséis', ht:'sèz', de:'sechzehn', ru:'шестнадцать', zh:'十六', ja:'十六'}},
      {n:'dix-sept', t:{fr:'dix-sept', en:'seventeen', es:'diecisiete', ht:'disèt', de:'siebzehn', ru:'семнадцать', zh:'十七', ja:'十七'}},
      {n:'dix-huit', t:{fr:'dix-huit', en:'eighteen', es:'dieciocho', ht:'dizwit', de:'achtzehn', ru:'восемнадцать', zh:'十八', ja:'十八'}},
      {n:'dix-neuf', t:{fr:'dix-neuf', en:'nineteen', es:'diecinueve', ht:'diznèf', de:'neunzehn', ru:'девятнадцать', zh:'十九', ja:'十九'}},
      {n:'vingt', t:{fr:'vingt', en:'twenty', es:'veinte', ht:'ven', de:'zwanzig', ru:'двадцать', zh:'二十', ja:'二十'}},
      {n:'trente', t:{fr:'trente', en:'thirty', es:'treinta', ht:'trant', de:'dreißig', ru:'тридцать', zh:'三十', ja:'三十'}},
      {n:'quarante', t:{fr:'quarante', en:'forty', es:'cuarenta', ht:'karant', de:'vierzig', ru:'сорок', zh:'四十', ja:'四十'}},
      {n:'cinquante', t:{fr:'cinquante', en:'fifty', es:'cincuenta', ht:'senkant', de:'fünfzig', ru:'пятьдесят', zh:'五十', ja:'五十'}},
      {n:'soixante', t:{fr:'soixante', en:'sixty', es:'sesenta', ht:'swasant', de:'sechzig', ru:'шестьдесят', zh:'六十', ja:'六十'}},
      {n:'soixante-dix', t:{fr:'soixante-dix', en:'seventy', es:'setenta', ht:'swasanndis', de:'siebzig', ru:'семьдесят', zh:'七十', ja:'七十'}},
      {n:'quatre-vingts', t:{fr:'quatre-vingts', en:'eighty', es:'ochenta', ht:'katreven', de:'achtzig', ru:'восемьдесят', zh:'八十', ja:'八十'}},
      {n:'quatre-vingt-dix', t:{fr:'quatre-vingt-dix', en:'ninety', es:'noventa', ht:'katrevendis', de:'neunzig', ru:'девяносто', zh:'九十', ja:'九十'}},
      {n:'cent', t:{fr:'cent', en:'one hundred', es:'cien', ht:'san', de:'hundert', ru:'сто', zh:'一百', ja:'百'}},
      {n:'mille', t:{fr:'mille', en:'one thousand', es:'mil', ht:'mil', de:'tausend', ru:'тысяча', zh:'一千', ja:'千'}},
    ]
  },
  // 13. Jours, mois, saisons (22 mots)
  temps: {
    icon:'📅', fr:'Temps', en:'Time', es:'Tiempo', ht:'Tan', de:'Zeit', ru:'Время', zh:'时间', ja:'時間',
    words: [
      {n:'lundi', t:{fr:'lundi', en:'Monday', es:'lunes', ht:'lendi', de:'Montag', ru:'понедельник', zh:'星期一', ja:'月曜日'}},
      {n:'mardi', t:{fr:'mardi', en:'Tuesday', es:'martes', ht:'madi', de:'Dienstag', ru:'вторник', zh:'星期二', ja:'火曜日'}},
      {n:'mercredi', t:{fr:'mercredi', en:'Wednesday', es:'miércoles', ht:'mèkredi', de:'Mittwoch', ru:'среда', zh:'星期三', ja:'水曜日'}},
      {n:'jeudi', t:{fr:'jeudi', en:'Thursday', es:'jueves', ht:'jedi', de:'Donnerstag', ru:'четверг', zh:'星期四', ja:'木曜日'}},
      {n:'vendredi', t:{fr:'vendredi', en:'Friday', es:'viernes', ht:'vandredi', de:'Freitag', ru:'пятница', zh:'星期五', ja:'金曜日'}},
      {n:'samedi', t:{fr:'samedi', en:'Saturday', es:'sábado', ht:'samdi', de:'Samstag', ru:'суббота', zh:'星期六', ja:'土曜日'}},
      {n:'dimanche', t:{fr:'dimanche', en:'Sunday', es:'domingo', ht:'dimanch', de:'Sonntag', ru:'воскресенье', zh:'星期日', ja:'日曜日'}},
      {n:'janvier', t:{fr:'janvier', en:'January', es:'enero', ht:'janvye', de:'Januar', ru:'январь', zh:'一月', ja:'一月'}},
      {n:'février', t:{fr:'février', en:'February', es:'febrero', ht:'fevriye', de:'Februar', ru:'февраль', zh:'二月', ja:'二月'}},
      {n:'mars', t:{fr:'mars', en:'March', es:'marzo', ht:'mas', de:'März', ru:'март', zh:'三月', ja:'三月'}},
      {n:'avril', t:{fr:'avril', en:'April', es:'abril', ht:'avril', de:'April', ru:'апрель', zh:'四月', ja:'四月'}},
      {n:'mai', t:{fr:'mai', en:'May', es:'mayo', ht:'me', de:'Mai', ru:'май', zh:'五月', ja:'五月'}},
      {n:'juin', t:{fr:'juin', en:'June', es:'junio', ht:'jen', de:'Juni', ru:'июнь', zh:'六月', ja:'六月'}},
      {n:'juillet', t:{fr:'juillet', en:'July', es:'julio', ht:'jiyè', de:'Juli', ru:'июль', zh:'七月', ja:'七月'}},
      {n:'août', t:{fr:'août', en:'August', es:'agosto', ht:'out', de:'August', ru:'август', zh:'八月', ja:'八月'}},
      {n:'septembre', t:{fr:'septembre', en:'September', es:'septiembre', ht:'septanm', de:'September', ru:'сентябрь', zh:'九月', ja:'九月'}},
      {n:'octobre', t:{fr:'octobre', en:'October', es:'octubre', ht:'oktòb', de:'Oktober', ru:'октябрь', zh:'十月', ja:'十月'}},
      {n:'novembre', t:{fr:'novembre', en:'November', es:'noviembre', ht:'novanm', de:'November', ru:'ноябрь', zh:'十一月', ja:'十一月'}},
      {n:'décembre', t:{fr:'décembre', en:'December', es:'diciembre', ht:'desanm', de:'Dezember', ru:'декабрь', zh:'十二月', ja:'十二月'}},
      {n:'printemps', t:{fr:'printemps', en:'spring', es:'primavera', ht:'prentan', de:'Frühling', ru:'весна', zh:'春天', ja:'春'}},
      {n:'été', t:{fr:'été', en:'summer', es:'verano', ht:'ete', de:'Sommer', ru:'лето', zh:'夏天', ja:'夏'}},
      {n:'automne', t:{fr:'automne', en:'autumn', es:'otoño', ht:'oton', de:'Herbst', ru:'осень', zh:'秋天', ja:'秋'}},
      {n:'hiver', t:{fr:'hiver', en:'winter', es:'invierno', ht:'ivè', de:'Winter', ru:'зима', zh:'冬天', ja:'冬'}},
    ]
  },
  // 14. Adverbes (25 mots)
  adverbes: {
    icon:'⚡', fr:'Adverbes', en:'Adverbs', es:'Adverbios', ht:'Advèb', de:'Adverbien', ru:'Наречия', zh:'副词', ja:'副詞',
    words: [
      {n:'bien', t:{fr:'bien', en:'well', es:'bien', ht:'byen', de:'gut', ru:'хорошо', zh:'好', ja:'よく'}},
      {n:'mal', t:{fr:'mal', en:'badly', es:'mal', ht:'mal', de:'schlecht', ru:'плохо', zh:'坏', ja:'悪く'}},
      {n:'vite', t:{fr:'vite', en:'quickly', es:'rápidamente', ht:'vit', de:'schnell', ru:'быстро', zh:'快', ja:'速く'}},
      {n:'lentement', t:{fr:'lentement', en:'slowly', es:'lentamente', ht:'dousman', de:'langsam', ru:'медленно', zh:'慢', ja:'遅く'}},
      {n:'toujours', t:{fr:'toujours', en:'always', es:'siempre', ht:'toujou', de:'immer', ru:'всегда', zh:'总是', ja:'いつも'}},
      {n:'jamais', t:{fr:'jamais', en:'never', es:'nunca', ht:'janm', de:'nie', ru:'никогда', zh:'从不', ja:'決して'}},
      {n:'parfois', t:{fr:'parfois', en:'sometimes', es:'a veces', ht:'pafwa', de:'manchmal', ru:'иногда', zh:'有时', ja:'時々'}},
      {n:'souvent', t:{fr:'souvent', en:'often', es:'a menudo', ht:'souvan', de:'oft', ru:'часто', zh:'经常', ja:'よく'}},
      {n:'rarement', t:{fr:'rarement', en:'rarely', es:'raramente', ht:'ramen', de:'selten', ru:'редко', zh:'很少', ja:'まれに'}},
      {n:'beaucoup', t:{fr:'beaucoup', en:'a lot', es:'mucho', ht:'anpil', de:'viel', ru:'много', zh:'很多', ja:'たくさん'}},
      {n:'peu', t:{fr:'peu', en:'little', es:'poco', ht:'ti kras', de:'wenig', ru:'мало', zh:'很少', ja:'少し'}},
      {n:'très', t:{fr:'très', en:'very', es:'muy', ht:'trè', de:'sehr', ru:'очень', zh:'非常', ja:'非常に'}},
      {n:'assez', t:{fr:'assez', en:'enough', es:'bastante', ht:'ase', de:'genug', ru:'достаточно', zh:'足够', ja:'十分'}},
      {n:'trop', t:{fr:'trop', en:'too much', es:'demasiado', ht:'twò', de:'zu', ru:'слишком', zh:'太', ja:'すぎる'}},
      {n:'ici', t:{fr:'ici', en:'here', es:'aquí', ht:'isit', de:'hier', ru:'здесь', zh:'这里', ja:'ここ'}},
      {n:'là', t:{fr:'là', en:'there', es:'allí', ht:'la', de:'dort', ru:'там', zh:'那里', ja:'そこ'}},
      {n:'partout', t:{fr:'partout', en:'everywhere', es:'en todas partes', ht:'patou', de:'überall', ru:'везде', zh:'到处', ja:'どこでも'}},
      {n:'ailleurs', t:{fr:'ailleurs', en:'elsewhere', es:'en otro lugar', ht:'lòt kote', de:'anderswo', ru:'в другом месте', zh:'别处', ja:'どこかへ'}},
      {n:'maintenant', t:{fr:'maintenant', en:'now', es:'ahora', ht:'kounye a', de:'jetzt', ru:'сейчас', zh:'现在', ja:'今'}},
      {n:'plus tard', t:{fr:'plus tard', en:'later', es:'más tarde', ht:'pita', de:'später', ru:'позже', zh:'以后', ja:'後で'}},
      {n:'aujourd\'hui', t:{fr:'aujourd\'hui', en:'today', es:'hoy', ht:'jodi a', de:'heute', ru:'сегодня', zh:'今天', ja:'今日'}},
      {n:'hier', t:{fr:'hier', en:'yesterday', es:'ayer', ht:'yè', de:'gestern', ru:'вчера', zh:'昨天', ja:'昨日'}},
      {n:'demain', t:{fr:'demain', en:'tomorrow', es:'mañana', ht:'demen', de:'morgen', ru:'завтра', zh:'明天', ja:'明日'}},
      {n:'bientôt', t:{fr:'bientôt', en:'soon', es:'pronto', ht:'byento', de:'bald', ru:'скоро', zh:'很快', ja:'もうすぐ'}},
      {n:'enfin', t:{fr:'enfin', en:'finally', es:'finalmente', ht:'anfen', de:'endlich', ru:'наконец', zh:'终于', ja:'ついに'}},
    ]
  },
  // 15. Prépositions (15 mots)
  prepositions: {
    icon:'📍', fr:'Prépositions', en:'Prepositions', es:'Preposiciones', ht:'Prepozisyon', de:'Präpositionen', ru:'Предлоги', zh:'介词', ja:'前置詞',
    words: [
      {n:'dans', t:{fr:'dans', en:'in', es:'en', ht:'nan', de:'in', ru:'в', zh:'在...里', ja:'の中に'}},
      {n:'sur', t:{fr:'sur', en:'on', es:'sobre', ht:'sou', de:'auf', ru:'на', zh:'在...上', ja:'の上に'}},
      {n:'sous', t:{fr:'sous', en:'under', es:'debajo de', ht:'anba', de:'unter', ru:'под', zh:'在...下', ja:'の下に'}},
      {n:'devant', t:{fr:'devant', en:'in front of', es:'delante de', ht:'devan', de:'vor', ru:'перед', zh:'在...前面', ja:'の前に'}},
      {n:'derrière', t:{fr:'derrière', en:'behind', es:'detrás de', ht:'dèyè', de:'hinter', ru:'за', zh:'在...后面', ja:'の後ろに'}},
      {n:'entre', t:{fr:'entre', en:'between', es:'entre', ht:'ant', de:'zwischen', ru:'между', zh:'在...之间', ja:'の間に'}},
      {n:'parmi', t:{fr:'parmi', en:'among', es:'entre', ht:'pami', de:'unter', ru:'среди', zh:'在...之中', ja:'の中で'}},
      {n:'près de', t:{fr:'près de', en:'near', es:'cerca de', ht:'pre', de:'nahe', ru:'близко', zh:'靠近', ja:'近く'}},
      {n:'loin de', t:{fr:'loin de', en:'far from', es:'lejos de', ht:'lwen', de:'weit weg von', ru:'далеко от', zh:'远离', ja:'遠く'}},
      {n:'avec', t:{fr:'avec', en:'with', es:'con', ht:'avèk', de:'mit', ru:'с', zh:'和', ja:'と一緒に'}},
      {n:'sans', t:{fr:'sans', en:'without', es:'sin', ht:'san', de:'ohne', ru:'без', zh:'没有', ja:'なしで'}},
      {n:'pour', t:{fr:'pour', en:'for', es:'para', ht:'pou', de:'für', ru:'для', zh:'为了', ja:'のために'}},
      {n:'par', t:{fr:'par', en:'by', es:'por', ht:'pa', de:'durch', ru:'через', zh:'通过', ja:'によって'}},
      {n:'contre', t:{fr:'contre', en:'against', es:'contra', ht:'kont', de:'gegen', ru:'против', zh:'反对', ja:'に対して'}},
      {n:'chez', t:{fr:'chez', en:'at/to (someone\'s place)', es:'en casa de', ht:'lakay', de:'bei', ru:'у (кого-то)', zh:'在...家', ja:'の家で'}},
    ]
  },
  // 16. Conjonctions (12 mots)
  conjonctions: {
    icon:'🔗', fr:'Conjonctions', en:'Conjunctions', es:'Conjunciones', ht:'Konjonksyon', de:'Konjunktionen', ru:'Союзы', zh:'连词', ja:'接続詞',
    words: [
      {n:'et', t:{fr:'et', en:'and', es:'y', ht:'ak', de:'und', ru:'и', zh:'和', ja:'と'}},
      {n:'ou', t:{fr:'ou', en:'or', es:'o', ht:'oswa', de:'oder', ru:'или', zh:'或', ja:'または'}},
      {n:'mais', t:{fr:'mais', en:'but', es:'pero', ht:'men', de:'aber', ru:'но', zh:'但是', ja:'しかし'}},
      {n:'donc', t:{fr:'donc', en:'so', es:'entonces', ht:'donk', de:'also', ru:'итак', zh:'所以', ja:'だから'}},
      {n:'parce que', t:{fr:'parce que', en:'because', es:'porque', ht:'paske', de:'weil', ru:'потому что', zh:'因为', ja:'なぜなら'}},
      {n:'car', t:{fr:'car', en:'for', es:'pues', ht:'paske', de:'denn', ru:'потому что', zh:'因为', ja:'なぜなら'}},
      {n:'si', t:{fr:'si', en:'if', es:'si', ht:'si', de:'wenn', ru:'если', zh:'如果', ja:'もし'}},
      {n:'quand', t:{fr:'quand', en:'when', es:'cuando', ht:'lè', de:'wann', ru:'когда', zh:'当', ja:'いつ'}},
      {n:'comme', t:{fr:'comme', en:'as/like', es:'como', ht:'tankou', de:'wie', ru:'как', zh:'像', ja:'のように'}},
      {n:'bien que', t:{fr:'bien que', en:'although', es:'aunque', ht:'byenke', de:'obwohl', ru:'хотя', zh:'虽然', ja:'だけれども'}},
      {n:'cependant', t:{fr:'cependant', en:'however', es:'sin embargo', ht:'sepandan', de:'jedoch', ru:'однако', zh:'然而', ja:'しかしながら'}},
      {n:'donc', t:{fr:'donc', en:'therefore', es:'por lo tanto', ht:'donk', de:'daher', ru:'следовательно', zh:'因此', ja:'従って'}},
    ]
  },
  // 17. Émotions (15 mots)
  emotions: {
    icon:'😊', fr:'Émotions', en:'Emotions', es:'Emociones', ht:'Emosyon', de:'Emotionen', ru:'Эмоции', zh:'情绪', ja:'感情',
    words: [
      {n:'amour', t:{fr:'amour', en:'love', es:'amor', ht:'lanmou', de:'Liebe', ru:'любовь', zh:'爱', ja:'愛'}},
      {n:'joie', t:{fr:'joie', en:'joy', es:'alegría', ht:'la jwa', de:'Freude', ru:'радость', zh:'喜悦', ja:'喜び'}},
      {n:'tristesse', t:{fr:'tristesse', en:'sadness', es:'tristeza', ht:'tristès', de:'Traurigkeit', ru:'печаль', zh:'悲伤', ja:'悲しみ'}},
      {n:'colère', t:{fr:'colère', en:'anger', es:'ira', ht:'kòlè', de:'Wut', ru:'гнев', zh:'愤怒', ja:'怒り'}},
      {n:'peur', t:{fr:'peur', en:'fear', es:'miedo', ht:'pè', de:'Angst', ru:'страх', zh:'恐惧', ja:'恐怖'}},
      {n:'surprise', t:{fr:'surprise', en:'surprise', es:'sorpresa', ht:'sipriz', de:'Überraschung', ru:'удивление', zh:'惊讶', ja:'驚き'}},
      {n:'calme', t:{fr:'calme', en:'calm', es:'calma', ht:'kalm', de:'Ruhe', ru:'спокойствие', zh:'平静', ja:'穏やか'}},
      {n:'ennui', t:{fr:'ennui', en:'boredom', es:'aburrimiento', ht:'anwi', de:'Langeweile', ru:'скука', zh:'无聊', ja:'退屈'}},
      {n:'dégoût', t:{fr:'dégoût', en:'disgust', es:'asco', ht:'degou', de:'Ekel', ru:'отвращение', zh:'厌恶', ja:'嫌悪'}},
      {n:'honte', t:{fr:'honte', en:'shame', es:'vergüenza', ht:'wont', de:'Scham', ru:'стыд', zh:'羞耻', ja:'恥'}},
      {n:'fierté', t:{fr:'fierté', en:'pride', es:'orgullo', ht:'fyète', de:'Stolz', ru:'гордость', zh:'骄傲', ja:'誇り'}},
      {n:'jalousie', t:{fr:'jalousie', en:'jealousy', es:'celos', ht:'jalouzi', de:'Eifersucht', ru:'ревность', zh:'嫉妒', ja:'嫉妬'}},
      {n:'solitude', t:{fr:'solitude', en:'loneliness', es:'soledad', ht:'solitid', de:'Einsamkeit', ru:'одиночество', zh:'孤独', ja:'孤独'}},
      {n:'espoir', t:{fr:'espoir', en:'hope', es:'esperanza', ht:'espwa', de:'Hoffnung', ru:'надежда', zh:'希望', ja:'希望'}},
      {n:'désespoir', t:{fr:'désespoir', en:'despair', es:'desesperación', ht:'dezespwa', de:'Verzweiflung', ru:'отчаяние', zh:'绝望', ja:'絶望'}},
    ]
  },
  // 18. Nature (25 mots)
  nature: {
    icon:'🌿', fr:'Nature', en:'Nature', es:'Naturaleza', ht:'Lanati', de:'Natur', ru:'Природа', zh:'自然', ja:'自然',
    words: [
      {n:'arbre', t:{fr:'arbre', en:'tree', es:'árbol', ht:'pyebwa', de:'Baum', ru:'дерево', zh:'树', ja:'木'}},
      {n:'fleur', t:{fr:'fleur', en:'flower', es:'flor', ht:'flè', de:'Blume', ru:'цветок', zh:'花', ja:'花'}},
      {n:'herbe', t:{fr:'herbe', en:'grass', es:'hierba', ht:'zèb', de:'Gras', ru:'трава', zh:'草', ja:'草'}},
      {n:'ciel', t:{fr:'ciel', en:'sky', es:'cielo', ht:'syèl', de:'Himmel', ru:'небо', zh:'天空', ja:'空'}},
      {n:'terre', t:{fr:'terre', en:'earth', es:'tierra', ht:'tè', de:'Erde', ru:'земля', zh:'地球', ja:'地球'}},
      {n:'soleil', t:{fr:'soleil', en:'sun', es:'sol', ht:'soleil', de:'Sonne', ru:'солнце', zh:'太阳', ja:'太陽'}},
      {n:'lune', t:{fr:'lune', en:'moon', es:'luna', ht:'lalin', de:'Mond', ru:'луна', zh:'月亮', ja:'月'}},
      {n:'étoile', t:{fr:'étoile', en:'star', es:'estrella', ht:'etwal', de:'Stern', ru:'звезда', zh:'星星', ja:'星'}},
      {n:'nuage', t:{fr:'nuage', en:'cloud', es:'nube', ht:'nwaj', de:'Wolke', ru:'облако', zh:'云', ja:'雲'}},
      {n:'pluie', t:{fr:'pluie', en:'rain', es:'lluvia', ht:'lapli', de:'Regen', ru:'дождь', zh:'雨', ja:'雨'}},
      {n:'neige', t:{fr:'neige', en:'snow', es:'nieve', ht:'nèj', de:'Schnee', ru:'снег', zh:'雪', ja:'雪'}},
      {n:'vent', t:{fr:'vent', en:'wind', es:'viento', ht:'van', de:'Wind', ru:'ветер', zh:'风', ja:'風'}},
      {n:'feu', t:{fr:'feu', en:'fire', es:'fuego', ht:'dife', de:'Feuer', ru:'огонь', zh:'火', ja:'火'}},
      {n:'fumée', t:{fr:'fumée', en:'smoke', es:'humo', ht:'lafimen', de:'Rauch', ru:'дым', zh:'烟', ja:'煙'}},
      {n:'pierre', t:{fr:'pierre', en:'stone', es:'piedra', ht:'wòch', de:'Stein', ru:'камень', zh:'石头', ja:'石'}},
      {n:'sable', t:{fr:'sable', en:'sand', es:'arena', ht:'sab', de:'Sand', ru:'песок', zh:'沙子', ja:'砂'}},
      {n:'volcan', t:{fr:'volcan', en:'volcano', es:'volcán', ht:'vòlkan', de:'Vulkan', ru:'вулкан', zh:'火山', ja:'火山'}},
      {n:'cascade', t:{fr:'cascade', en:'waterfall', es:'cascada', ht:'kaskad', de:'Wasserfall', ru:'водопад', zh:'瀑布', ja:'滝'}},
      {n:'grotte', t:{fr:'grotte', en:'cave', es:'cueva', ht:'gwòt', de:'Höhle', ru:'пещера', zh:'洞穴', ja:'洞窟'}},
      {n:'océan', t:{fr:'océan', en:'ocean', es:'océano', ht:'oseyan', de:'Ozean', ru:'океан', zh:'海洋', ja:'海'}},
      {n:'rivière', t:{fr:'rivière', en:'river', es:'río', ht:'rivyè', de:'Fluss', ru:'река', zh:'河流', ja:'川'}},
      {n:'lac', t:{fr:'lac', en:'lake', es:'lago', ht:'lak', de:'See', ru:'озеро', zh:'湖', ja:'湖'}},
      {n:'forêt', t:{fr:'forêt', en:'forest', es:'bosque', ht:'forè', de:'Wald', ru:'лес', zh:'森林', ja:'森'}},
      {n:'montagne', t:{fr:'montagne', en:'mountain', es:'montaña', ht:'mòn', de:'Berg', ru:'гора', zh:'山', ja:'山'}},
      {n:'désert', t:{fr:'désert', en:'desert', es:'desierto', ht:'dezè', de:'Wüste', ru:'пустыня', zh:'沙漠', ja:'砂漠'}},
    ]
  },
  // 19. Sports et loisirs (30 mots)
  sports: {
    icon:'⚽', fr:'Sports', en:'Sports', es:'Deportes', ht:'Espò', de:'Sport', ru:'Спорт', zh:'运动', ja:'スポーツ',
    words: [
      {n:'football', t:{fr:'football', en:'soccer', es:'fútbol', ht:'foutbòl', de:'Fußball', ru:'футбол', zh:'足球', ja:'サッカー'}},
      {n:'basketball', t:{fr:'basketball', en:'basketball', es:'baloncesto', ht:'baskètbòl', de:'Basketball', ru:'баскетбол', zh:'篮球', ja:'バスケットボール'}},
      {n:'tennis', t:{fr:'tennis', en:'tennis', es:'tenis', ht:'tenis', de:'Tennis', ru:'теннис', zh:'网球', ja:'テニス'}},
      {n:'natation', t:{fr:'natation', en:'swimming', es:'natación', ht:'naje', de:'Schwimmen', ru:'плавание', zh:'游泳', ja:'水泳'}},
      {n:'course', t:{fr:'course', en:'running', es:'correr', ht:'kous', de:'Laufen', ru:'бег', zh:'跑步', ja:'ランニング'}},
      {n:'vélo', t:{fr:'vélo', en:'cycling', es:'ciclismo', ht:'bisiklèt', de:'Radfahren', ru:'велоспорт', zh:'自行车', ja:'サイクリング'}},
      {n:'ski', t:{fr:'ski', en:'skiing', es:'esquí', ht:'ski', de:'Skifahren', ru:'лыжи', zh:'滑雪', ja:'スキー'}},
      {n:'boxe', t:{fr:'boxe', en:'boxing', es:'boxeo', ht:'bòks', de:'Boxen', ru:'бокс', zh:'拳击', ja:'ボクシング'}},
      {n:'judo', t:{fr:'judo', en:'judo', es:'judo', ht:'jido', de:'Judo', ru:'дзюдо', zh:'柔道', ja:'柔道'}},
      {n:'gymnastique', t:{fr:'gymnastique', en:'gymnastics', es:'gimnasia', ht:'jimnastik', de:'Gymnastik', ru:'гимнастика', zh:'体操', ja:'体操'}},
      {n:'yoga', t:{fr:'yoga', en:'yoga', es:'yoga', ht:'yoga', de:'Yoga', ru:'йога', zh:'瑜伽', ja:'ヨガ'}},
      {n:'danse', t:{fr:'danse', en:'dance', es:'baile', ht:'dans', de:'Tanz', ru:'танец', zh:'舞蹈', ja:'ダンス'}},
      {n:'escalade', t:{fr:'escalade', en:'climbing', es:'escalada', ht:'eskalad', de:'Klettern', ru:'скалолазание', zh:'攀岩', ja:'クライミング'}},
      {n:'équitation', t:{fr:'équitation', en:'horse riding', es:'equitación', ht:'monte', de:'Reiten', ru:'верховая езда', zh:'骑马', ja:'乗馬'}},
      {n:'voile', t:{fr:'voile', en:'sailing', es:'vela', ht:'vwal', de:'Segeln', ru:'парусный спорт', zh:'帆船', ja:'セーリング'}},
      {n:'surf', t:{fr:'surf', en:'surfing', es:'surf', ht:'sirf', de:'Surfen', ru:'сёрфинг', zh:'冲浪', ja:'サーフィン'}},
      {n:'golf', t:{fr:'golf', en:'golf', es:'golf', ht:'gòlf', de:'Golf', ru:'гольф', zh:'高尔夫', ja:'ゴルフ'}},
      {n:'rugby', t:{fr:'rugby', en:'rugby', es:'rugby', ht:'rigbi', de:'Rugby', ru:'регби', zh:'橄榄球', ja:'ラグビー'}},
      {n:'baseball', t:{fr:'baseball', en:'baseball', es:'béisbol', ht:'bezbol', de:'Baseball', ru:'бейсбол', zh:'棒球', ja:'野球'}},
      {n:'volleyball', t:{fr:'volleyball', en:'volleyball', es:'voleibol', ht:'volebòl', de:'Volleyball', ru:'волейбол', zh:'排球', ja:'バレーボール'}},
      {n:'handball', t:{fr:'handball', en:'handball', es:'balonmano', ht:'anbòl', de:'Handball', ru:'гандбол', zh:'手球', ja:'ハンドボール'}},
      {n:'hockey', t:{fr:'hockey', en:'hockey', es:'hockey', ht:'okè', de:'Hockey', ru:'хоккей', zh:'曲棍球', ja:'ホッケー'}},
      {n:'patinage', t:{fr:'patinage', en:'skating', es:'patinaje', ht:'patinaj', de:'Schlittschuhlaufen', ru:'катание на коньках', zh:'滑冰', ja:'スケート'}},
      {n:'musculation', t:{fr:'musculation', en:'weightlifting', es:'levantamiento de pesas', ht:'miskilasyon', de:'Krafttraining', ru:'тяжёлая атлетика', zh:'举重', ja:'ウェイトリフティング'}},
      {n:'parachutisme', t:{fr:'parachutisme', en:'skydiving', es:'paracaidismo', ht:'parachit', de:'Fallschirmspringen', ru:'парашютный спорт', zh:'跳伞', ja:'スカイダイビング'}},
      {n:'karaté', t:{fr:'karaté', en:'karate', es:'karate', ht:'karate', de:'Karate', ru:'карате', zh:'空手道', ja:'空手'}},
      {n:'taekwondo', t:{fr:'taekwondo', en:'taekwondo', es:'taekwondo', ht:'tekwondo', de:'Taekwondo', ru:'тхэквондо', zh:'跆拳道', ja:'テコンドー'}},
      {n:'escrime', t:{fr:'escrime', en:'fencing', es:'esgrima', ht:'eskrim', de:'Fechten', ru:'фехтование', zh:'击剑', ja:'フェンシング'}},
      {n:'tir à l\'arc', t:{fr:'tir à l\'arc', en:'archery', es:'tiro con arco', ht:'tir ak banza', de:'Bogenschießen', ru:'стрельба из лука', zh:'射箭', ja:'アーチェリー'}},
      {n:'pêche', t:{fr:'pêche', en:'fishing', es:'pesca', ht:'lapèch', de:'Angeln', ru:'рыбалка', zh:'钓鱼', ja:'釣り'}},
    ]
  },
  // 20. Technologie (25 mots)
  technologie: {
    icon:'💻', fr:'Technologie', en:'Technology', es:'Tecnología', ht:'Teknoloji', de:'Technologie', ru:'Технология', zh:'科技', ja:'テクノロジー',
    words: [
      {n:'ordinateur', t:{fr:'ordinateur', en:'computer', es:'computadora', ht:'òdinatè', de:'Computer', ru:'компьютер', zh:'电脑', ja:'コンピュータ'}},
      {n:'portable', t:{fr:'portable', en:'laptop', es:'portátil', ht:'lapòtop', de:'Laptop', ru:'ноутбук', zh:'笔记本电脑', ja:'ノートパソコン'}},
      {n:'téléphone', t:{fr:'téléphone', en:'phone', es:'teléfono', ht:'telefòn', de:'Telefon', ru:'телефон', zh:'电话', ja:'電話'}},
      {n:'smartphone', t:{fr:'smartphone', en:'smartphone', es:'teléfono inteligente', ht:'smatfòn', de:'Smartphone', ru:'смартфон', zh:'智能手机', ja:'スマートフォン'}},
      {n:'tablette', t:{fr:'tablette', en:'tablet', es:'tableta', ht:'tablèt', de:'Tablet', ru:'планшет', zh:'平板电脑', ja:'タブレット'}},
      {n:'internet', t:{fr:'internet', en:'internet', es:'internet', ht:'entènèt', de:'Internet', ru:'интернет', zh:'互联网', ja:'インターネット'}},
      {n:'Wi-Fi', t:{fr:'Wi-Fi', en:'Wi-Fi', es:'Wi-Fi', ht:'Wi-Fi', de:'WLAN', ru:'Wi-Fi', zh:'无线网络', ja:'Wi-Fi'}},
      {n:'email', t:{fr:'email', en:'email', es:'correo electrónico', ht:'imel', de:'E-Mail', ru:'электронная почта', zh:'电子邮件', ja:'メール'}},
      {n:'mot de passe', t:{fr:'mot de passe', en:'password', es:'contraseña', ht:'modpas', de:'Passwort', ru:'пароль', zh:'密码', ja:'パスワード'}},
      {n:'site web', t:{fr:'site web', en:'website', es:'sitio web', ht:'sit entènèt', de:'Webseite', ru:'веб-сайт', zh:'网站', ja:'ウェブサイト'}},
      {n:'application', t:{fr:'application', en:'app', es:'aplicación', ht:'aplikasyon', de:'App', ru:'приложение', zh:'应用', ja:'アプリ'}},
      {n:'jeu vidéo', t:{fr:'jeu vidéo', en:'video game', es:'videojuego', ht:'jwèt videyo', de:'Videospiel', ru:'видеоигра', zh:'电子游戏', ja:'ビデオゲーム'}},
      {n:'clavier', t:{fr:'clavier', en:'keyboard', es:'teclado', ht:'klavye', de:'Tastatur', ru:'клавиатура', zh:'键盘', ja:'キーボード'}},
      {n:'souris', t:{fr:'souris', en:'mouse', es:'ratón', ht:'sourit', de:'Maus', ru:'мышь', zh:'鼠标', ja:'マウス'}},
      {n:'écran', t:{fr:'écran', en:'screen', es:'pantalla', ht:'ekran', de:'Bildschirm', ru:'экран', zh:'屏幕', ja:'画面'}},
      {n:'imprimante', t:{fr:'imprimante', en:'printer', es:'impresora', ht:'enprimant', de:'Drucker', ru:'принтер', zh:'打印机', ja:'プリンター'}},
      {n:'scanner', t:{fr:'scanner', en:'scanner', es:'escáner', ht:'eskànè', de:'Scanner', ru:'сканер', zh:'扫描仪', ja:'スキャナー'}},
      {n:'clé USB', t:{fr:'clé USB', en:'USB drive', es:'memoria USB', ht:'kle USB', de:'USB-Stick', ru:'флешка', zh:'U盘', ja:'USBメモリ'}},
      {n:'logiciel', t:{fr:'logiciel', en:'software', es:'software', ht:'lojisyèl', de:'Software', ru:'программное обеспечение', zh:'软件', ja:'ソフトウェア'}},
      {n:'virus', t:{fr:'virus', en:'virus', es:'virus', ht:'viris', de:'Virus', ru:'вирус', zh:'病毒', ja:'ウイルス'}},
      {n:'bluetooth', t:{fr:'bluetooth', en:'bluetooth', es:'bluetooth', ht:'bluetooth', de:'Bluetooth', ru:'блютуз', zh:'蓝牙', ja:'ブルートゥース'}},
      {n:'cloud', t:{fr:'cloud', en:'cloud', es:'nube', ht:'nwaj', de:'Cloud', ru:'облако', zh:'云存储', ja:'クラウド'}},
      {n:'robot', t:{fr:'robot', en:'robot', es:'robot', ht:'robot', de:'Roboter', ru:'робот', zh:'机器人', ja:'ロボット'}},
      {n:'intelligence artificielle', t:{fr:'intelligence artificielle', en:'artificial intelligence', es:'inteligencia artificial', ht:'entelijans atifisyèl', de:'künstliche Intelligenz', ru:'искусственный интеллект', zh:'人工智能', ja:'人工知能'}},
      {n:'réalité virtuelle', t:{fr:'réalité virtuelle', en:'virtual reality', es:'realidad virtual', ht:'reyalite vityèl', de:'virtuelle Realität', ru:'виртуальная реальность', zh:'虚拟现实', ja:'仮想現実'}},
    ]
  },
  // 21. Santé (20 mots)
  sante: {
    icon:'💊', fr:'Santé', en:'Health', es:'Salud', ht:'Sante', de:'Gesundheit', ru:'Здоровье', zh:'健康', ja:'健康',
    words: [
      {n:'médecin', t:{fr:'médecin', en:'doctor', es:'médico', ht:'doktè', de:'Arzt', ru:'врач', zh:'医生', ja:'医者'}},
      {n:'hôpital', t:{fr:'hôpital', en:'hospital', es:'hospital', ht:'lopital', de:'Krankenhaus', ru:'больница', zh:'医院', ja:'病院'}},
      {n:'pharmacie', t:{fr:'pharmacie', en:'pharmacy', es:'farmacia', ht:'famasi', de:'Apotheke', ru:'аптека', zh:'药房', ja:'薬局'}},
      {n:'médicament', t:{fr:'médicament', en:'medicine', es:'medicamento', ht:'medikaman', de:'Medikament', ru:'лекарство', zh:'药物', ja:'薬'}},
      {n:'ordonnance', t:{fr:'ordonnance', en:'prescription', es:'receta', ht:'òdonans', de:'Rezept', ru:'рецепт', zh:'处方', ja:'処方箋'}},
      {n:'fièvre', t:{fr:'fièvre', en:'fever', es:'fiebre', ht:'lafyèv', de:'Fieber', ru:'жар', zh:'发烧', ja:'熱'}},
      {n:'toux', t:{fr:'toux', en:'cough', es:'tos', ht:'tous', de:'Husten', ru:'кашель', zh:'咳嗽', ja:'咳'}},
      {n:'rhume', t:{fr:'rhume', en:'cold', es:'resfriado', ht:'rim', de:'Erkältung', ru:'простуда', zh:'感冒', ja:'風邪'}},
      {n:'grippe', t:{fr:'grippe', en:'flu', es:'gripe', ht:'grip', de:'Grippe', ru:'грипп', zh:'流感', ja:'インフルエンザ'}},
      {n:'allergie', t:{fr:'allergie', en:'allergy', es:'alergia', ht:'alèji', de:'Allergie', ru:'аллергия', zh:'过敏', ja:'アレルギー'}},
      {n:'douleur', t:{fr:'douleur', en:'pain', es:'dolor', ht:'doulè', de:'Schmerz', ru:'боль', zh:'疼痛', ja:'痛み'}},
      {n:'blessure', t:{fr:'blessure', en:'injury', es:'lesión', ht:'blesi', de:'Verletzung', ru:'травма', zh:'受伤', ja:'怪我'}},
      {n:'ambulance', t:{fr:'ambulance', en:'ambulance', es:'ambulancia', ht:'anbilans', de:'Krankenwagen', ru:'скорая помощь', zh:'救护车', ja:'救急車'}},
      {n:'urgence', t:{fr:'urgence', en:'emergency', es:'emergencia', ht:'ijans', de:'Notfall', ru:'неотложная помощь', zh:'急救', ja:'緊急'}},
      {n:'dentiste', t:{fr:'dentiste', en:'dentist', es:'dentista', ht:'dantis', de:'Zahnarzt', ru:'стоматолог', zh:'牙医', ja:'歯医者'}},
      {n:'opticien', t:{fr:'opticien', en:'optician', es:'óptico', ht:'optisyen', de:'Optiker', ru:'оптик', zh:'验光师', ja:'眼鏡屋'}},
      {n:'kiné', t:{fr:'kiné', en:'physiotherapist', es:'fisioterapeuta', ht:'kine', de:'Physiotherapeut', ru:'физиотерапевт', zh:'理疗师', ja:'理学療法士'}},
      {n:'vaccin', t:{fr:'vaccin', en:'vaccine', es:'vacuna', ht:'vaksen', de:'Impfstoff', ru:'вакцина', zh:'疫苗', ja:'ワクチン'}},
      {n:'opération', t:{fr:'opération', en:'surgery', es:'operación', ht:'operasyon', de:'Operation', ru:'операция', zh:'手术', ja:'手術'}},
      {n:'régime', t:{fr:'régime', en:'diet', es:'dieta', ht:'rejim', de:'Diät', ru:'диета', zh:'饮食', ja:'ダイエット'}},
    ]
  },
  // 22. École (25 mots)
  ecole: {
    icon:'📚', fr:'École', en:'School', es:'Escuela', ht:'Lekòl', de:'Schule', ru:'Школа', zh:'学校', ja:'学校',
    words: [
      {n:'crayon', t:{fr:'crayon', en:'pencil', es:'lápiz', ht:'kreyon', de:'Bleistift', ru:'карандаш', zh:'铅笔', ja:'鉛筆'}},
      {n:'stylo', t:{fr:'stylo', en:'pen', es:'bolígrafo', ht:'stilo', de:'Kugelschreiber', ru:'ручка', zh:'钢笔', ja:'ペン'}},
      {n:'gomme', t:{fr:'gomme', en:'eraser', es:'goma', ht:'gom', de:'Radiergummi', ru:'ластик', zh:'橡皮', ja:'消しゴム'}},
      {n:'règle', t:{fr:'règle', en:'ruler', es:'regla', ht:'règle', de:'Lineal', ru:'линейка', zh:'尺子', ja:'定規'}},
      {n:'cahier', t:{fr:'cahier', en:'notebook', es:'cuaderno', ht:'kaye', de:'Heft', ru:'тетрадь', zh:'笔记本', ja:'ノート'}},
      {n:'livre', t:{fr:'livre', en:'book', es:'libro', ht:'liv', de:'Buch', ru:'книга', zh:'书', ja:'本'}},
      {n:'cartable', t:{fr:'cartable', en:'schoolbag', es:'mochila', ht:'sak', de:'Schulranzen', ru:'рюкзак', zh:'书包', ja:'ランドセル'}},
      {n:'tableau', t:{fr:'tableau', en:'blackboard', es:'pizarra', ht:'tablo', de:'Tafel', ru:'доска', zh:'黑板', ja:'黒板'}},
      {n:'cours', t:{fr:'cours', en:'class', es:'clase', ht:'kou', de:'Unterricht', ru:'урок', zh:'课程', ja:'授業'}},
      {n:'devoir', t:{fr:'devoir', en:'homework', es:'tarea', ht:'devwa', de:'Hausaufgabe', ru:'домашнее задание', zh:'作业', ja:'宿題'}},
      {n:'examen', t:{fr:'examen', en:'exam', es:'examen', ht:'egzamen', de:'Prüfung', ru:'экзамен', zh:'考试', ja:'試験'}},
      {n:'note', t:{fr:'note', en:'grade', es:'nota', ht:'nòt', de:'Note', ru:'оценка', zh:'分数', ja:'点数'}},
      {n:'professeur', t:{fr:'professeur', en:'teacher', es:'profesor', ht:'pwofesè', de:'Lehrer', ru:'учитель', zh:'老师', ja:'先生'}},
      {n:'élève', t:{fr:'élève', en:'student', es:'alumno', ht:'elèv', de:'Schüler', ru:'ученик', zh:'学生', ja:'生徒'}},
      {n:'classe', t:{fr:'classe', en:'classroom', es:'aula', ht:'klas', de:'Klasse', ru:'класс', zh:'教室', ja:'教室'}},
      {n:'récréation', t:{fr:'récréation', en:'recess', es:'recreo', ht:'rekreyasyon', de:'Pause', ru:'перемена', zh:'课间休息', ja:'休み時間'}},
      {n:'bibliothèque', t:{fr:'bibliothèque', en:'library', es:'biblioteca', ht:'bibliyotèk', de:'Bibliothek', ru:'библиотека', zh:'图书馆', ja:'図書館'}},
      {n:'laboratoire', t:{fr:'laboratoire', en:'laboratory', es:'laboratorio', ht:'laboratwa', de:'Labor', ru:'лаборатория', zh:'实验室', ja:'研究室'}},
      {n:'diplôme', t:{fr:'diplôme', en:'diploma', es:'diploma', ht:'diplòm', de:'Diplom', ru:'диплом', zh:'文凭', ja:'卒業証書'}},
      {n:'bourse', t:{fr:'bourse', en:'scholarship', es:'beca', ht:'bous', de:'Stipendium', ru:'стипендия', zh:'奖学金', ja:'奨学金'}},
      {n:'craie', t:{fr:'craie', en:'chalk', es:'tiza', ht:'kray', de:'Kreide', ru:'мел', zh:'粉笔', ja:'チョーク'}},
      {n:'pupitre', t:{fr:'pupitre', en:'desk', es:'pupitre', ht:'pupit', de:'Pult', ru:'парта', zh:'课桌', ja:'机'}},
      {n:'directeur', t:{fr:'directeur', en:'principal', es:'director', ht:'direktè', de:'Direktor', ru:'директор', zh:'校长', ja:'校長'}},
      {n:'cantine', t:{fr:'cantine', en:'cafeteria', es:'comedor', ht:'kantin', de:'Kantine', ru:'столовая', zh:'食堂', ja:'食堂'}},
      {n:'cour de récréation', t:{fr:'cour de récréation', en:'playground', es:'patio de recreo', ht:'lakou rekreyasyon', de:'Pausenhof', ru:'игровая площадка', zh:'操场', ja:'遊び場'}},
    ]
  },
  // 23. Voyage (25 mots)
  voyage: {
    icon:'✈️', fr:'Voyage', en:'Travel', es:'Viaje', ht:'Vwayaj', de:'Reise', ru:'Путешествие', zh:'旅行', ja:'旅行',
    words: [
      {n:'aéroport', t:{fr:'aéroport', en:'airport', es:'aeropuerto', ht:'ayewopò', de:'Flughafen', ru:'аэропорт', zh:'机场', ja:'空港'}},
      {n:'billet', t:{fr:'billet', en:'ticket', es:'billete', ht:'tikè', de:'Fahrkarte', ru:'билет', zh:'票', ja:'切符'}},
      {n:'valise', t:{fr:'valise', en:'suitcase', es:'maleta', ht:'valiz', de:'Koffer', ru:'чемодан', zh:'行李箱', ja:'スーツケース'}},
      {n:'passeport', t:{fr:'passeport', en:'passport', es:'pasaporte', ht:'paspò', de:'Reisepass', ru:'паспорт', zh:'护照', ja:'パスポート'}},
      {n:'visa', t:{fr:'visa', en:'visa', es:'visado', ht:'visa', de:'Visum', ru:'виза', zh:'签证', ja:'ビザ'}},
      {n:'hôtel', t:{fr:'hôtel', en:'hotel', es:'hotel', ht:'otèl', de:'Hotel', ru:'отель', zh:'酒店', ja:'ホテル'}},
      {n:'auberge', t:{fr:'auberge', en:'hostel', es:'hostal', ht:'obèj', de:'Herberge', ru:'хостел', zh:'青年旅舍', ja:'ホステル'}},
      {n:'réservation', t:{fr:'réservation', en:'reservation', es:'reserva', ht:'rezèvasyon', de:'Reservierung', ru:'бронирование', zh:'预订', ja:'予約'}},
      {n:'bagage', t:{fr:'bagage', en:'luggage', es:'equipaje', ht:'bagaj', de:'Gepäck', ru:'багаж', zh:'行李', ja:'荷物'}},
      {n:'avion', t:{fr:'avion', en:'plane', es:'avión', ht:'avyon', de:'Flugzeug', ru:'самолёт', zh:'飞机', ja:'飛行機'}},
      {n:'train', t:{fr:'train', en:'train', es:'tren', ht:'tren', de:'Zug', ru:'поезд', zh:'火车', ja:'電車'}},
      {n:'bus', t:{fr:'bus', en:'bus', es:'autobús', ht:'otobis', de:'Bus', ru:'автобус', zh:'公共汽车', ja:'バス'}},
      {n:'voiture', t:{fr:'voiture', en:'car', es:'coche', ht:'machin', de:'Auto', ru:'машина', zh:'汽车', ja:'車'}},
      {n:'taxi', t:{fr:'taxi', en:'taxi', es:'taxi', ht:'taksi', de:'Taxi', ru:'такси', zh:'出租车', ja:'タクシー'}},
      {n:'métro', t:{fr:'métro', en:'subway', es:'metro', ht:'metwo', de:'U-Bahn', ru:'метро', zh:'地铁', ja:'地下鉄'}},
      {n:'croisière', t:{fr:'croisière', en:'cruise', es:'crucero', ht:'kwozyè', de:'Kreuzfahrt', ru:'круиз', zh:'游轮', ja:'クルーズ'}},
      {n:'excursion', t:{fr:'excursion', en:'excursion', es:'excursión', ht:'èskursyon', de:'Ausflug', ru:'экскурсия', zh:'短途旅行', ja:'遠足'}},
      {n:'guide', t:{fr:'guide', en:'guide', es:'guía', ht:'gid', de:'Reiseführer', ru:'гид', zh:'导游', ja:'ガイド'}},
      {n:'carte', t:{fr:'carte', en:'map', es:'mapa', ht:'kat', de:'Karte', ru:'карта', zh:'地图', ja:'地図'}},
      {n:'souvenir', t:{fr:'souvenir', en:'souvenir', es:'recuerdo', ht:'souvni', de:'Andenken', ru:'сувенир', zh:'纪念品', ja:'お土産'}},
      {n:'devise', t:{fr:'devise', en:'currency', es:'moneda', ht:'monn', de:'Währung', ru:'валюта', zh:'货币', ja:'通貨'}},
      {n:'assurance', t:{fr:'assurance', en:'insurance', es:'seguro', ht:'asirans', de:'Versicherung', ru:'страховка', zh:'保险', ja:'保険'}},
      {n:'bagage à main', t:{fr:'bagage à main', en:'hand luggage', es:'equipaje de mano', ht:'bagaj a men', de:'Handgepäck', ru:'ручная кладь', zh:'手提行李', ja:'手荷物'}},
      {n:'enregistrement', t:{fr:'enregistrement', en:'check-in', es:'facturación', ht:'anrejistreman', de:'Check-in', ru:'регистрация', zh:'登机手续', ja:'チェックイン'}},
      {n:'départ', t:{fr:'départ', en:'departure', es:'salida', ht:'depa', de:'Abfahrt', ru:'отправление', zh:'出发', ja:'出発'}},
    ]
  },
  // 24. Argent (15 mots)
  argent: {
    icon:'💰', fr:'Argent', en:'Money', es:'Dinero', ht:'Lajan', de:'Geld', ru:'Деньги', zh:'钱', ja:'お金',
    words: [
      {n:'euro', t:{fr:'euro', en:'euro', es:'euro', ht:'euro', de:'Euro', ru:'евро', zh:'欧元', ja:'ユーロ'}},
      {n:'dollar', t:{fr:'dollar', en:'dollar', es:'dólar', ht:'dola', de:'Dollar', ru:'доллар', zh:'美元', ja:'ドル'}},
      {n:'centime', t:{fr:'centime', en:'cent', es:'céntimo', ht:'santim', de:'Cent', ru:'цент', zh:'分', ja:'セント'}},
      {n:'billet', t:{fr:'billet', en:'banknote', es:'billete', ht:'bilye', de:'Geldschein', ru:'купюра', zh:'钞票', ja:'紙幣'}},
      {n:'pièce', t:{fr:'pièce', en:'coin', es:'moneda', ht:'pyès', de:'Münze', ru:'монета', zh:'硬币', ja:'硬貨'}},
      {n:'carte bancaire', t:{fr:'carte bancaire', en:'bank card', es:'tarjeta bancaria', ht:'kat bank', de:'Bankkarte', ru:'банковская карта', zh:'银行卡', ja:'銀行カード'}},
      {n:'espèces', t:{fr:'espèces', en:'cash', es:'efectivo', ht:'kach', de:'Bargeld', ru:'наличные', zh:'现金', ja:'現金'}},
      {n:'chèque', t:{fr:'chèque', en:'cheque', es:'cheque', ht:'chèk', de:'Scheck', ru:'чек', zh:'支票', ja:'小切手'}},
      {n:'salaire', t:{fr:'salaire', en:'salary', es:'salario', ht:'salè', de:'Gehalt', ru:'зарплата', zh:'工资', ja:'給料'}},
      {n:'impôt', t:{fr:'impôt', en:'tax', es:'impuesto', ht:'enpo', de:'Steuer', ru:'налог', zh:'税', ja:'税金'}},
      {n:'budget', t:{fr:'budget', en:'budget', es:'presupuesto', ht:'bidjè', de:'Budget', ru:'бюджет', zh:'预算', ja:'予算'}},
      {n:'dépense', t:{fr:'dépense', en:'expense', es:'gasto', ht:'depans', de:'Ausgabe', ru:'расход', zh:'支出', ja:'支出'}},
      {n:'économie', t:{fr:'économie', en:'saving', es:'ahorro', ht:'ekonomi', de:'Ersparnis', ru:'экономия', zh:'储蓄', ja:'貯金'}},
      {n:'prêt', t:{fr:'prêt', en:'loan', es:'préstamo', ht:'prè', de:'Darlehen', ru:'кредит', zh:'贷款', ja:'ローン'}},
      {n:'intérêt', t:{fr:'intérêt', en:'interest', es:'interés', ht:'enterè', de:'Zinsen', ru:'процент', zh:'利息', ja:'利息'}},
    ]
  },
  // 25. Formes (10 mots)
  formes: {
    icon:'⬛', fr:'Formes', en:'Shapes', es:'Formas', ht:'Fòm', de:'Formen', ru:'Формы', zh:'形状', ja:'形',
    words: [
      {n:'cercle', t:{fr:'cercle', en:'circle', es:'círculo', ht:'sèk', de:'Kreis', ru:'круг', zh:'圆形', ja:'丸'}},
      {n:'carré', t:{fr:'carré', en:'square', es:'cuadrado', ht:'kare', de:'Quadrat', ru:'квадрат', zh:'正方形', ja:'正方形'}},
      {n:'triangle', t:{fr:'triangle', en:'triangle', es:'triángulo', ht:'triyang', de:'Dreieck', ru:'треугольник', zh:'三角形', ja:'三角形'}},
      {n:'rectangle', t:{fr:'rectangle', en:'rectangle', es:'rectángulo', ht:'rektang', de:'Rechteck', ru:'прямоугольник', zh:'矩形', ja:'長方形'}},
      {n:'losange', t:{fr:'losange', en:'diamond', es:'rombo', ht:'lozanj', de:'Raute', ru:'ромб', zh:'菱形', ja:'ひし形'}},
      {n:'ovale', t:{fr:'ovale', en:'oval', es:'óvalo', ht:'oval', de:'Oval', ru:'овал', zh:'椭圆形', ja:'楕円'}},
      {n:'étoile', t:{fr:'étoile', en:'star', es:'estrella', ht:'etwal', de:'Stern', ru:'звезда', zh:'星形', ja:'星形'}},
      {n:'cœur', t:{fr:'cœur', en:'heart', es:'corazón', ht:'kè', de:'Herz', ru:'сердце', zh:'心形', ja:'ハート'}},
      {n:'croissant', t:{fr:'croissant', en:'crescent', es:'creciente', ht:'kwasan', de:'Halbmond', ru:'полумесяц', zh:'新月形', ja:'三日月'}},
      {n:'hexagone', t:{fr:'hexagone', en:'hexagon', es:'hexágono', ht:'egzagòn', de:'Sechseck', ru:'шестиугольник', zh:'六边形', ja:'六角形'}},
    ]
  },
  // 26. Matériaux (10 mots)
  materiaux: {
    icon:'🧱', fr:'Matériaux', en:'Materials', es:'Materiales', ht:'Materyo', de:'Materialien', ru:'Материалы', zh:'材料', ja:'材料',
    words: [
      {n:'bois', t:{fr:'bois', en:'wood', es:'madera', ht:'bwa', de:'Holz', ru:'дерево', zh:'木头', ja:'木'}},
      {n:'verre', t:{fr:'verre', en:'glass', es:'vidrio', ht:'vè', de:'Glas', ru:'стекло', zh:'玻璃', ja:'ガラス'}},
      {n:'plastique', t:{fr:'plastique', en:'plastic', es:'plástico', ht:'plastik', de:'Kunststoff', ru:'пластик', zh:'塑料', ja:'プラスチック'}},
      {n:'métal', t:{fr:'métal', en:'metal', es:'metal', ht:'metal', de:'Metall', ru:'металл', zh:'金属', ja:'金属'}},
      {n:'acier', t:{fr:'acier', en:'steel', es:'acero', ht:'asye', de:'Stahl', ru:'сталь', zh:'钢', ja:'鋼'}},
      {n:'cuivre', t:{fr:'cuivre', en:'copper', es:'cobre', ht:'kòb', de:'Kupfer', ru:'медь', zh:'铜', ja:'銅'}},
      {n:'or', t:{fr:'or', en:'gold', es:'oro', ht:'lò', de:'Gold', ru:'золото', zh:'金', ja:'金'}},
      {n:'argent', t:{fr:'argent', en:'silver', es:'plata', ht:'ajan', de:'Silber', ru:'серебро', zh:'银', ja:'銀'}},
      {n:'béton', t:{fr:'béton', en:'concrete', es:'hormigón', ht:'beton', de:'Beton', ru:'бетон', zh:'混凝土', ja:'コンクリート'}},
      {n:'papier', t:{fr:'papier', en:'paper', es:'papel', ht:'papye', de:'Papier', ru:'бумага', zh:'纸', ja:'紙'}},
    ]
  },
  // 27. Politique et société (15 mots)
  politique: {
    icon:'🏛️', fr:'Politique', en:'Politics', es:'Política', ht:'Politik', de:'Politik', ru:'Политика', zh:'政治', ja:'政治',
    words: [
      {n:'président', t:{fr:'président', en:'president', es:'presidente', ht:'prezidan', de:'Präsident', ru:'президент', zh:'总统', ja:'大統領'}},
      {n:'gouvernement', t:{fr:'gouvernement', en:'government', es:'gobierno', ht:'gouvènman', de:'Regierung', ru:'правительство', zh:'政府', ja:'政府'}},
      {n:'élection', t:{fr:'élection', en:'election', es:'elección', ht:'eleksyon', de:'Wahl', ru:'выборы', zh:'选举', ja:'選挙'}},
      {n:'vote', t:{fr:'vote', en:'vote', es:'voto', ht:'vòt', de:'Stimme', ru:'голосование', zh:'投票', ja:'投票'}},
      {n:'citoyen', t:{fr:'citoyen', en:'citizen', es:'ciudadano', ht:'sitwayen', de:'Bürger', ru:'гражданин', zh:'公民', ja:'市民'}},
      {n:'droit', t:{fr:'droit', en:'right', es:'derecho', ht:'dwa', de:'Recht', ru:'право', zh:'权利', ja:'権利'}},
      {n:'devoir', t:{fr:'devoir', en:'duty', es:'deber', ht:'devwa', de:'Pflicht', ru:'обязанность', zh:'义务', ja:'義務'}},
      {n:'loi', t:{fr:'loi', en:'law', es:'ley', ht:'lwa', de:'Gesetz', ru:'закон', zh:'法律', ja:'法律'}},
      {n:'justice', t:{fr:'justice', en:'justice', es:'justicia', ht:'jistis', de:'Gerechtigkeit', ru:'правосудие', zh:'正义', ja:'正義'}},
      {n:'liberté', t:{fr:'liberté', en:'freedom', es:'libertad', ht:'libète', de:'Freiheit', ru:'свобода', zh:'自由', ja:'自由'}},
      {n:'égalité', t:{fr:'égalité', en:'equality', es:'igualdad', ht:'egalite', de:'Gleichheit', ru:'равенство', zh:'平等', ja:'平等'}},
      {n:'fraternité', t:{fr:'fraternité', en:'brotherhood', es:'fraternidad', ht:'fratènite', de:'Brüderlichkeit', ru:'братство', zh:'博爱', ja:'兄弟愛'}},
      {n:'parlement', t:{fr:'parlement', en:'parliament', es:'parlamento', ht:'palman', de:'Parlament', ru:'парламент', zh:'议会', ja:'議会'}},
      {n:'manifestation', t:{fr:'manifestation', en:'protest', es:'manifestación', ht:'manifestasyon', de:'Demonstration', ru:'демонстрация', zh:'示威', ja:'デモ'}},
      {n:'grève', t:{fr:'grève', en:'strike', es:'huelga', ht:'grèv', de:'Streik', ru:'забастовка', zh:'罢工', ja:'ストライキ'}},
    ]
  },
  // 28. Religion (12 mots)
  religion: {
    icon:'⛪', fr:'Religion', en:'Religion', es:'Religión', ht:'Relijyon', de:'Religion', ru:'Религия', zh:'宗教', ja:'宗教',
    words: [
      {n:'Dieu', t:{fr:'Dieu', en:'God', es:'Dios', ht:'Bondye', de:'Gott', ru:'Бог', zh:'上帝', ja:'神'}},
      {n:'église', t:{fr:'église', en:'church', es:'iglesia', ht:'legliz', de:'Kirche', ru:'церковь', zh:'教堂', ja:'教会'}},
      {n:'mosquée', t:{fr:'mosquée', en:'mosque', es:'mezquita', ht:'moske', de:'Moschee', ru:'мечеть', zh:'清真寺', ja:'モスク'}},
      {n:'temple', t:{fr:'temple', en:'temple', es:'templo', ht:'tanp', de:'Tempel', ru:'храм', zh:'寺庙', ja:'寺院'}},
      {n:'prière', t:{fr:'prière', en:'prayer', es:'oración', ht:'lapriyè', de:'Gebet', ru:'молитва', zh:'祈祷', ja:'祈り'}},
      {n:'prier', t:{fr:'prier', en:'to pray', es:'rezar', ht:'priye', de:'beten', ru:'молиться', zh:'祈祷', ja:'祈る'}},
      {n:'croyance', t:{fr:'croyance', en:'belief', es:'creencia', ht:'kwayans', de:'Glaube', ru:'вера', zh:'信仰', ja:'信仰'}},
      {n:'musulman', t:{fr:'musulman', en:'Muslim', es:'musulmán', ht:'mizilman', de:'Muslim', ru:'мусульманин', zh:'穆斯林', ja:'イスラム教徒'}},
      {n:'chrétien', t:{fr:'chrétien', en:'Christian', es:'cristiano', ht:'kretchen', de:'Christ', ru:'христианин', zh:'基督教徒', ja:'キリスト教徒'}},
      {n:'juif', t:{fr:'juif', en:'Jewish', es:'judío', ht:'jwif', de:'jüdisch', ru:'иудей', zh:'犹太人', ja:'ユダヤ人'}},
      {n:'bouddhiste', t:{fr:'bouddhiste', en:'Buddhist', es:'budista', ht:'boudis', de:'buddhistisch', ru:'буддист', zh:'佛教徒', ja:'仏教徒'}},
      {n:'hindou', t:{fr:'hindou', en:'Hindu', es:'hindú', ht:'endou', de:'Hindu', ru:'индус', zh:'印度教徒', ja:'ヒンドゥー教徒'}},
    ]
  },
  // 29. Divers (complément pour atteindre 800)
  divers: {
    icon:'📦', fr:'Divers', en:'Miscellaneous', es:'Varios', ht:'Divès', de:'Verschiedenes', ru:'Разное', zh:'其他', ja:'その他',
    words: [
      {n:'chose', t:{fr:'chose', en:'thing', es:'cosa', ht:'bagay', de:'Sache', ru:'вещь', zh:'东西', ja:'物'}},
      {n:'problème', t:{fr:'problème', en:'problem', es:'problema', ht:'pwoblèm', de:'Problem', ru:'проблема', zh:'问题', ja:'問題'}},
      {n:'solution', t:{fr:'solution', en:'solution', es:'solución', ht:'solisyon', de:'Lösung', ru:'решение', zh:'解决方案', ja:'解決策'}},
      {n:'idée', t:{fr:'idée', en:'idea', es:'idea', ht:'lide', de:'Idee', ru:'идея', zh:'想法', ja:'アイデア'}},
      {n:'raison', t:{fr:'raison', en:'reason', es:'razón', ht:'rezon', de:'Grund', ru:'причина', zh:'理由', ja:'理由'}},
      {n:'exemple', t:{fr:'exemple', en:'example', es:'ejemplo', ht:'egzanp', de:'Beispiel', ru:'пример', zh:'例子', ja:'例'}},
      {n:'but', t:{fr:'but', en:'goal', es:'objetivo', ht:'objektif', de:'Ziel', ru:'цель', zh:'目标', ja:'目標'}},
      {n:'rêve', t:{fr:'rêve', en:'dream', es:'sueño', ht:'rèv', de:'Traum', ru:'мечта', zh:'梦想', ja:'夢'}},
      {n:'réalité', t:{fr:'réalité', en:'reality', es:'realidad', ht:'reyalite', de:'Realität', ru:'реальность', zh:'现实', ja:'現実'}},
      {n:'avantage', t:{fr:'avantage', en:'advantage', es:'ventaja', ht:'avantaj', de:'Vorteil', ru:'преимущество', zh:'优势', ja:'利点'}},
      {n:'inconvénient', t:{fr:'inconvénient', en:'disadvantage', es:'desventaja', ht:'defavor', de:'Nachteil', ru:'недостаток', zh:'缺点', ja:'欠点'}},
      {n:'moyen', t:{fr:'moyen', en:'way/means', es:'medio', ht:'mwayen', de:'Mittel', ru:'способ', zh:'方法', ja:'手段'}},
      {n:'force', t:{fr:'force', en:'strength', es:'fuerza', ht:'fòs', de:'Kraft', ru:'сила', zh:'力量', ja:'力'}},
      {n:'faiblesse', t:{fr:'faiblesse', en:'weakness', es:'debilidad', ht:'fèblès', de:'Schwäche', ru:'слабость', zh:'弱点', ja:'弱さ'}},
      {n:'succès', t:{fr:'succès', en:'success', es:'éxito', ht:'siksè', de:'Erfolg', ru:'успех', zh:'成功', ja:'成功'}},
      {n:'échec', t:{fr:'échec', en:'failure', es:'fracaso', ht:'echèk', de:'Misserfolg', ru:'неудача', zh:'失败', ja:'失敗'}},
      {n:'crise', t:{fr:'crise', en:'crisis', es:'crisis', ht:'kriz', de:'Krise', ru:'кризис', zh:'危机', ja:'危機'}},
      {n:'opportunité', t:{fr:'opportunité', en:'opportunity', es:'oportunidad', ht:'opòtinite', de:'Gelegenheit', ru:'возможность', zh:'机会', ja:'機会'}},
      {n:'défi', t:{fr:'défi', en:'challenge', es:'desafío', ht:'defi', de:'Herausforderung', ru:'вызов', zh:'挑战', ja:'挑戦'}},
      {n:'équilibre', t:{fr:'équilibre', en:'balance', es:'equilibrio', ht:'ekilib', de:'Gleichgewicht', ru:'равновесие', zh:'平衡', ja:'バランス'}},
    ]
  }
};

// data.js — RESTRUCTURED EDITION v2 (CORRIGÉ - Partie 3/4)
// =================================================================
// GRAMMAIRE — Structure étendue et corrigée
// =================================================================

var GRAMMAR_DATA = {
  // ---------- PRONOMS ----------
  pronoms_sujets: {
    icon: '👤', fr: 'Pronoms sujets', en: 'Subject pronouns', es: 'Pronombres sujeto', ht: 'Pwonon sijè', de: 'Subjektpronomen', ru: 'Личные местоимения (подлежащее)', zh: '主格代词', ja: '主語代名詞',
    explanation: { fr: 'Les pronoms sujets remplacent le nom du sujet.', en: 'Subject pronouns replace the subject noun.', es: 'Los pronombres sujeto reemplazan al nombre del sujeto.', ht: 'Pwonon sijè yo ranplase non sijè a.', de: 'Subjektpronomen ersetzen das Subjektsubstantiv.', ru: 'Местоимения-подлежащие заменяют имя существительное-подлежащее.', zh: '主格代词代替主语名词。', ja: '主語代名詞は主語の名詞を置き換えます。' },
    formula: { fr: 'je, tu, il, elle, on, nous, vous, ils, elles', en: 'I, you, he, she, one, we, you, they (m), they (f)' },
    examples: [
      { n: 'Je parle.', t: { fr: 'Je parle.', en: 'I speak.', es: 'Yo hablo.', ht: 'Mwen pale.', de: 'Ich spreche.', ru: 'Я говорю.', zh: '我说话。', ja: '私は話します。' } },
      { n: 'Tu manges.', t: { fr: 'Tu manges.', en: 'You eat.', es: 'Tú comes.', ht: 'Ou manje.', de: 'Du isst.', ru: 'Ты ешь.', zh: '你吃。', ja: 'あなたは食べます。' } },
      { n: 'Il dort.', t: { fr: 'Il dort.', en: 'He sleeps.', es: 'Él duerme.', ht: 'Li dòmi.', de: 'Er schläft.', ru: 'Он спит.', zh: '他睡觉。', ja: '彼は寝ます。' } }
    ]
  },
  pronoms_complement_direct: {
    icon: '🎯', fr: 'Pronoms complément d’objet direct', en: 'Direct object pronouns', es: 'Pronombres de objeto directo', ht: 'Pwonon kòplèman dirèk', de: 'Direkte Objektpronomen', ru: 'Местоимения прямого дополнения', zh: '直接宾语代词', ja: '直接目的語代名詞',
    explanation: { fr: 'Ils remplacent le nom qui reçoit directement l’action (COD).', en: 'They replace the noun that directly receives the action (COD).' },
    formula: { fr: 'me, te, le, la, nous, vous, les', en: 'me, you, him, her, us, you, them' },
    examples: [
      { n: 'Je vois Paul → Je le vois.', t: { fr: 'Je le vois.', en: 'I see him.', es: 'Lo veo.', ht: 'Mwen wè l.', de: 'Ich sehe ihn.', ru: 'Я вижу его.', zh: '我看见他。', ja: '私は彼を見ます。' } }
    ]
  },
  pronoms_complement_indirect: {
    icon: '📬', fr: 'Pronoms complément d’objet indirect', en: 'Indirect object pronouns', es: 'Pronombres de objeto indirecto', ht: 'Pwonon kòplèman endirèk', de: 'Indirekte Objektpronomen', ru: 'Местоимения косвенного дополнения', zh: '间接宾语代词', ja: '間接目的語代名詞',
    explanation: { fr: 'Ils remplacent le nom introduit par "à".', en: 'They replace the noun introduced by "to".' },
    formula: { fr: 'me, te, lui, nous, vous, leur', en: 'to me, to you, to him/her, to us, to you, to them' },
    examples: [
      { n: 'Je parle à Marie → Je lui parle.', t: { fr: 'Je lui parle.', en: 'I speak to her.', es: 'Le hablo.', ht: 'Mwen pale ak li.', de: 'Ich spreche ihr.', ru: 'Я говорю ей.', zh: '我对她说话。', ja: '私は彼女に話します。' } }
    ]
  },
  pronoms_toniques: {
    icon: '🗣️', fr: 'Pronoms toniques', en: 'Stressed pronouns', es: 'Pronombres tónicos', ht: 'Pwonon tonik', de: 'Betonte Pronomen', ru: 'Ударные местоимения', zh: '重读代词', ja: '強勢代名詞',
    explanation: { fr: 'Employés après une préposition ou pour insister.', en: 'Used after a preposition or for emphasis.' },
    formula: { fr: 'moi, toi, lui, elle, soi, nous, vous, eux, elles', en: 'me, you, him, her, oneself, us, you, them (m), them (f)' },
    examples: [
      { n: 'Je pense à toi.', t: { fr: 'Je pense à toi.', en: 'I think of you.', es: 'Pienso en ti.', ht: 'Mwen panse a ou.', de: 'Ich denke an dich.', ru: 'Я думаю о тебе.', zh: '我想你。', ja: '私はあなたのことを思います。' } }
    ]
  },
  pronoms_demonstratifs: {
    icon: '👉', fr: 'Pronoms démonstratifs', en: 'Demonstrative pronouns', es: 'Pronombres demostrativos', ht: 'Pwonon demonstratif', de: 'Demonstrativpronomen', ru: 'Указательные местоимения', zh: '指示代词', ja: '指示代名詞',
    explanation: { fr: 'Désignent une chose ou une personne déjà mentionnée.', en: 'Refer to something already mentioned.' },
    formula: { fr: 'celui (m sing), celle (f sing), ceux (m pl), celles (f pl)', en: 'the one (m), the one (f), the ones (m), the ones (f)' },
    examples: [
      { n: 'Voici mon livre ; celui de Marie est rouge.', t: { fr: 'Voici mon livre ; celui de Marie est rouge.', en: 'Here is my book; Marie\'s is red.', es: 'Aquí está mi libro; el de María es rojo.', ht: 'Men liv mwen; a Marie a wouj.', de: 'Hier ist mein Buch; das von Marie ist rot.', ru: 'Вот моя книга; книга Марии красная.', zh: '这是我的书；玛丽的是红色的。', ja: 'これが私の本です；マリーのは赤いです。' } }
    ]
  },
  pronoms_possessifs: {
    icon: '🔑', fr: 'Pronoms possessifs', en: 'Possessive pronouns', es: 'Pronombres posesivos', ht: 'Pwonon posesif', de: 'Possessivpronomen', ru: 'Притяжательные местоимения', zh: '物主代词', ja: '所有代名詞',
    explanation: { fr: 'Indiquent la possession en remplaçant le nom.', en: 'Indicate possession, replacing the noun.' },
    formula: { fr: 'le mien (m sing), la mienne (f sing), les miens (m pl), les miennes (f pl), etc.', en: 'mine, yours, his, hers, ours, theirs' },
    examples: [
      { n: 'Ce stylo est le mien.', t: { fr: 'Ce stylo est le mien.', en: 'This pen is mine.', es: 'Este bolígrafo es el mío.', ht: 'Plum sa se pa m nan.', de: 'Dieser Stift gehört mir.', ru: 'Эта ручка моя.', zh: '这支笔是我的。', ja: 'このペンは私のものです。' } }
    ]
  },
  pronoms_relatifs_simples: {
    icon: '🔗', fr: 'Pronoms relatifs simples', en: 'Simple relative pronouns', es: 'Pronombres relativos simples', ht: 'Pwonon relatif senp', de: 'Einfache Relativpronomen', ru: 'Простые относительные местоимения', zh: '简单关系代词', ja: '単純関係代名詞',
    explanation: { fr: 'Relient une proposition subordonnée à l’antécédent (qui, que, quoi, dont, où).', en: 'Link a subordinate clause to the antecedent (who, whom, which, whose, where).' },
    formula: { fr: 'qui (sujet), que (COD), dont (complément de nom), où (lieu/temps)', en: 'who (subject), whom (object), whose, where' },
    examples: [
      { n: 'L’homme qui parle est mon voisin.', t: { fr: 'L’homme qui parle est mon voisin.', en: 'The man who is speaking is my neighbor.', es: 'El hombre que habla es mi vecino.', ht: 'Nonm ki pale a se vwazen mwen.', de: 'Der Mann, der spricht, ist mein Nachbar.', ru: 'Человек, который говорит, мой сосед.', zh: '正在说话的那个人是我的邻居。', ja: '話している男性は私の隣人です。' } }
    ]
  },
  pronoms_relatifs_composes: {
    icon: '🔗🔗', fr: 'Pronoms relatifs composés', en: 'Compound relative pronouns', es: 'Pronombres relativos compuestos', ht: 'Pwonon relatif konpoze', de: 'Zusammengesetzte Relativpronomen', ru: 'Составные относительные местоимения', zh: '复合关系代词', ja: '複合関係代名詞',
    explanation: { fr: 'Utilisés après une préposition (lequel, auquel, duquel, etc.).', en: 'Used after a preposition (which, to which, of which, etc.).' },
    formula: { fr: 'lequel (m sing), laquelle (f sing), lesquels (m pl), lesquelles (f pl)', en: 'which (m), which (f), which (m pl), which (f pl)' },
    examples: [
      { n: 'La maison dans laquelle j’habite est grande.', t: { fr: 'La maison dans laquelle j’habite est grande.', en: 'The house in which I live is big.', es: 'La casa en la que vivo es grande.', ht: 'Kay kote mwen rete a se gwo.', de: 'Das Haus, in dem ich wohne, ist groß.', ru: 'Дом, в котором я живу, большой.', zh: '我住的房子很大。', ja: '私が住んでいる家は大きいです。' } }
    ]
  },

  // ---------- ARTICLES ----------
  articles_definis: {
    icon: '🔍', fr: 'Articles définis', en: 'Definite articles', es: 'Artículos definidos', ht: 'Atik defini', de: 'Bestimmte Artikel', ru: 'Определённые артикли', zh: '定冠词', ja: '定冠詞',
    explanation: { fr: 'Le, la, l\', les – pour parler de quelque chose de spécifique.', en: 'The – for something specific.' },
    formula: { fr: 'masculin singulier : le, féminin singulier : la, devant voyelle : l\', pluriel : les', en: 'masculine singular : the, feminine singular : the, vowel : the, plural : the' },
    examples: [
      { n: 'Le livre est sur la table.', t: { fr: 'Le livre est sur la table.', en: 'The book is on the table.', es: 'El libro está sobre la mesa.', ht: 'Liv la sou tab la.', de: 'Das Buch liegt auf dem Tisch.', ru: 'Книга на столе.', zh: '书在桌子上。', ja: '本は机の上にあります。' } }
    ]
  },
  articles_indefinis: {
    icon: '🟢', fr: 'Articles indéfinis', en: 'Indefinite articles', es: 'Artículos indefinidos', ht: 'Atik endefini', de: 'Unbestimmte Artikel', ru: 'Неопределённые артикли', zh: '不定冠词', ja: '不定冠詞',
    explanation: { fr: 'Un, une, des – pour parler de quelque chose de non spécifique.', en: 'A, an, some – for non‑specific things.' },
    formula: { fr: 'masculin : un, féminin : une, pluriel : des', en: 'masculine : a, feminine : an, plural : some' },
    examples: [
      { n: 'J\'ai un chien.', t: { fr: 'J\'ai un chien.', en: 'I have a dog.', es: 'Tengo un perro.', ht: 'Mwen gen yon chen.', de: 'Ich habe einen Hund.', ru: 'У меня есть собака.', zh: '我有一只狗。', ja: '私は犬を一匹飼っています。' } }
    ]
  },
  articles_partitifs: {
    icon: '🧈', fr: 'Articles partitifs', en: 'Partitive articles', es: 'Artículos partitivos', ht: 'Atik patitif', de: 'Partitive Artikel', ru: 'Частичные артикли', zh: '部分冠词', ja: '部分冠詞',
    explanation: { fr: 'Du, de la, de l\', des – pour une quantité indéterminée.', en: 'Some / any – for an unspecified quantity.' },
    formula: { fr: 'du (masculin), de la (féminin), de l\' (voyelle), des (pluriel)', en: 'some (m), some (f), some (vowel), some (plural)' },
    examples: [
      { n: 'Je bois du café.', t: { fr: 'Je bois du café.', en: 'I drink some coffee.', es: 'Bebo café.', ht: 'Mwen bwè kafe.', de: 'Ich trinke Kaffee.', ru: 'Я пью кофе.', zh: '我喝些咖啡。', ja: '私はコーヒーを飲みます。' } }
    ]
  },

  // ---------- ADJECTIFS ----------
  adjectifs_demonstratifs: {
    icon: '👉🏠', fr: 'Adjectifs démonstratifs', en: 'Demonstrative adjectives', es: 'Adjetivos demostrativos', ht: 'Adjektif demonstratif', de: 'Demonstrativadjektive', ru: 'Указательные прилагательные', zh: '指示形容词', ja: '指示形容詞',
    explanation: { fr: 'Accompagnent un nom pour le désigner précisément (ce, cet, cette, ces).', en: 'Accompany a noun to point it out (this, that, these, those).' },
    formula: { fr: 'ce (masc. cons.), cet (masc. voy.), cette (fém.), ces (pluriel)', en: 'this/that + noun' },
    examples: [
      { n: 'Ce livre est intéressant.', t: { fr: 'Ce livre est intéressant.', en: 'This book is interesting.', es: 'Este libro es interesante.', ht: 'Liv sa a enteresan.', de: 'Dieses Buch ist interessant.', ru: 'Эта книга интересная.', zh: '这本书很有趣。', ja: 'この本は面白いです。' } }
    ]
  },
  adjectifs_possessifs: {
    icon: '🔑🏠', fr: 'Adjectifs possessifs', en: 'Possessive adjectives', es: 'Adjetivos posesivos', ht: 'Adjektif posesif', de: 'Possessivadjektive', ru: 'Притяжательные прилагательные', zh: '物主形容词', ja: '所有形容詞',
    explanation: { fr: 'Indiquent la possession devant un nom (mon, ton, son, etc.).', en: 'Indicate possession before a noun (my, your, his, etc.).' },
    formula: { fr: 'mon/ma/mes, ton/ta/tes, son/sa/ses, notre/nos, votre/vos, leur/leurs', en: 'my, your, his/her, our, your, their' },
    examples: [
      { n: 'J’ai perdu mes clés.', t: { fr: 'J’ai perdu mes clés.', en: 'I lost my keys.', es: 'Perdí mis llaves.', ht: 'Mwen pèdi kle mwen yo.', de: 'Ich habe meine Schlüssel verloren.', ru: 'Я потерял свои ключи.', zh: '我丢了钥匙。', ja: '鍵をなくしました。' } }
    ]
  },
  adjectifs_interrogatifs: {
    icon: '❓🏷️', fr: 'Adjectifs interrogatifs', en: 'Interrogative adjectives', es: 'Adjetivos interrogativos', ht: 'Adjektif entèrogatif', de: 'Interrogativadjektive', ru: 'Вопросительные прилагательные', zh: '疑问形容词', ja: '疑問形容詞',
    explanation: { fr: 'Servent à poser une question sur un nom (quel, quelle, quels, quelles).', en: 'Used to ask about a noun (which, what).' },
    formula: { fr: 'quel (m sing), quelle (f sing), quels (m pl), quelles (f pl)', en: 'which/what + noun' },
    examples: [
      { n: 'Quel temps fait-il ?', t: { fr: 'Quel temps fait-il ?', en: 'What is the weather like?', es: '¿Qué tiempo hace?', ht: 'Ki tan li fè?', de: 'Wie ist das Wetter?', ru: 'Какая погода?', zh: '天气怎么样？', ja: '天気はどうですか？' } }
    ]
  },
  adjectifs_indefinis: {
    icon: '🔘', fr: 'Adjectifs indéfinis', en: 'Indefinite adjectives', es: 'Adjetivos indefinidos', ht: 'Adjektif endefini', de: 'Indefinite Adjektive', ru: 'Неопределённые прилагательные', zh: '泛指形容词', ja: '不定形容詞',
    explanation: { fr: 'Donnent une information vague sur la quantité ou l’identité (certains, chaque, plusieurs, etc.).', en: 'Give vague information about quantity or identity (some, each, several, etc.).' },
    formula: { fr: 'aucun, autre, certain, chaque, divers, maint, même, nul, plusieurs, quelque, tel, tout', en: 'no, other, certain, each, various, many, same, no, several, some, such, all' },
    examples: [
      { n: 'Plusieurs personnes sont venues.', t: { fr: 'Plusieurs personnes sont venues.', en: 'Several people came.', es: 'Varias personas vinieron.', ht: 'Plizyè moun te vini.', de: 'Mehrere Personen kamen.', ru: 'Несколько человек пришли.', zh: '来了几个人。', ja: '数人が来ました。' } }
    ]
  },

  // ---------- NÉGATION ET INTERROGATION ----------
  negation_simple: {
    icon: '🚫', fr: 'Négation simple', en: 'Simple negation', es: 'Negación simple', ht: 'Negasyon senp', de: 'Einfache Verneinung', ru: 'Отрицание', zh: '简单否定', ja: '単純否定',
    explanation: { fr: 'On encadre le verbe avec "ne...pas".', en: 'Put "ne...pas" around the verb.' },
    formula: { fr: 'sujet + ne + verbe + pas + complément', en: 'subject + do/does not + verb' },
    examples: [
      { n: 'Je ne mange pas de viande.', t: { fr: 'Je ne mange pas de viande.', en: 'I don\'t eat meat.', es: 'No como carne.', ht: 'Mwen pa manje vyann.', de: 'Ich esse kein Fleisch.', ru: 'Я не ем мясо.', zh: '我不吃肉。', ja: '私は肉を食べません。' } }
    ]
  },
  negation_autres_mots: {
    icon: '❌', fr: 'Autres négations', en: 'Other negative words', es: 'Otras negaciones', ht: 'Lòt mo negasyon', de: 'Andere Verneinungswörter', ru: 'Другие отрицательные слова', zh: '其他否定词', ja: 'その他の否定語',
    explanation: { fr: 'Ne...rien, ne...personne, ne...jamais, ne...plus.', en: 'Nothing, nobody, never, no more.' },
    examples: [
      { n: 'Je ne vois personne.', t: { fr: 'Je ne vois personne.', en: 'I see nobody.', es: 'No veo a nadie.', ht: 'Mwen pa wè pèsonn.', de: 'Ich sehe niemanden.', ru: 'Я никого не вижу.', zh: '我没看见任何人。', ja: '誰も見えません。' } },
      { n: 'Il ne fume jamais.', t: { fr: 'Il ne fume jamais.', en: 'He never smokes.', es: 'Él nunca fuma.', ht: 'Li pa janm fimen.', de: 'Er raucht nie.', ru: 'Он никогда не курит.', zh: '他从不吸烟。', ja: '彼は決してタバコを吸いません。' } }
    ]
  },
  negation_double: {
    icon: '🚫🚫', fr: 'Négation double : ne... ni... ni', en: 'Double negation: neither... nor', es: 'Negación doble: ni... ni', ht: 'Negasyon doub: ni... ni', de: 'Doppelte Verneinung: weder... noch', ru: 'Двойное отрицание: ни... ни', zh: '双重否定：既不...也不', ja: '二重否定：～も～も～ない',
    explanation: { fr: 'Utilisé pour nier deux éléments. Ne + verbe + ni + nom1 + ni + nom2.', en: 'Used to negate two elements. Neither + noun1 + nor + noun2.' },
    formula: { fr: 'ne + verbe + ni + chose1 + ni + chose2', en: 'verb + neither + noun1 + nor + noun2' },
    examples: [
      { n: 'Je n’aime ni le café ni le thé.', t: { fr: 'Je n’aime ni le café ni le thé.', en: 'I like neither coffee nor tea.', es: 'No me gusta ni el café ni el té.', ht: 'Mwen pa renmen ni kafe ni te.', de: 'Ich mag weder Kaffee noch Tee.', ru: 'Я не люблю ни кофе, ни чай.', zh: '我既不喜欢咖啡也不喜欢茶。', ja: '私はコーヒーも紅茶も好きではありません。' } }
    ]
  },
  negation_restrictive: {
    icon: '🔒', fr: 'Négation restrictive : ne... que', en: 'Restrictive negation: only', es: 'Negación restrictiva: solo', ht: 'Negasyon restriktif: sèlman', de: 'Einschränkende Verneinung: nur', ru: 'Ограничительное отрицание: только', zh: '限制性否定：只', ja: '制限否定：～だけ',
    explanation: { fr: 'Signifie "seulement". Ne + verbe + que + élément.', en: 'Means "only". Verb + only + element.' },
    formula: { fr: 'ne + verbe + que + complément', en: 'verb + only + complement' },
    examples: [
      { n: 'Je n’ai que cinq euros.', t: { fr: 'Je n’ai que cinq euros.', en: 'I only have five euros.', es: 'Solo tengo cinco euros.', ht: 'Mwen gen senk sèlman euro.', de: 'Ich habe nur fünf Euro.', ru: 'У меня только пять евро.', zh: '我只有五欧元。', ja: '私は5ユーロしか持っていません。' } }
    ]
  },
  interrogation_est_ce_que: {
    icon: '❓', fr: 'Interrogation avec "est-ce que"', en: 'Questions with "est-ce que"', es: 'Preguntas con "est-ce que"', ht: 'Kesyon ak "est-ce que"', de: 'Fragen mit "est-ce que"', ru: 'Вопросы с "est-ce que"', zh: '使用"est-ce que"的疑问句', ja: '「est-ce que」を使った疑問文',
    explanation: { fr: 'Est-ce que + phrase déclarative = question.', en: 'Est-ce que + statement = question.' },
    formula: { fr: 'Est-ce que + sujet + verbe ?', en: 'Do/does + subject + verb?' },
    examples: [
      { n: 'Est-ce que tu aimes le chocolat ?', t: { fr: 'Est-ce que tu aimes le chocolat ?', en: 'Do you like chocolate?', es: '¿Te gusta el chocolate?', ht: 'Èske ou renmen chokola?', de: 'Magst du Schokolade?', ru: 'Ты любишь шоколад?', zh: '你喜欢巧克力吗？', ja: 'チョコレートは好きですか？' } }
    ]
  },
  inversion_sujet_verbe: {
    icon: '🔄', fr: 'Inversion sujet-verbe', en: 'Subject-verb inversion', es: 'Inversión sujeto-verbo', ht: 'Envèsyon sijè-vèb', de: 'Subjekt-Verb-Inversion', ru: 'Инверсия подлежащего и глагола', zh: '主谓倒装', ja: '主語動詞倒置',
    explanation: { fr: 'On place le verbe avant le sujet, avec un trait d’union.', en: 'Place the verb before the subject with a hyphen.' },
    formula: { fr: 'Verbe + sujet + complément ?', en: 'Verb + subject + complement?' },
    examples: [
      { n: 'Parlez-vous français ?', t: { fr: 'Parlez-vous français ?', en: 'Do you speak French?', es: '¿Habla francés?', ht: 'Èske ou pale franse?', de: 'Sprechen Sie Französisch?', ru: 'Вы говорите по-французски?', zh: '您说法语吗？', ja: 'フランス語を話しますか？' } }
    ]
  },
  interrogation_inversion_nom: {
    icon: '🔄❓', fr: 'Inversion avec sujet nominal', en: 'Inversion with nominal subject', es: 'Inversión con sujeto nominal', ht: 'Envèsyon ak sijè nominal', de: 'Inversion mit nominalem Subjekt', ru: 'Инверсия с именным подлежащим', zh: '名词主语倒装', ja: '名詞主語の倒置',
    explanation: { fr: 'On place le sujet nom avant le verbe, puis on répète le verbe avec un pronom sujet.', en: 'Place the noun subject before the verb, then repeat the verb with a subject pronoun.' },
    formula: { fr: 'sujet nom + verbe + pronom sujet ?', en: 'noun subject + verb + subject pronoun?' },
    examples: [
      { n: 'Paul vient-il demain ?', t: { fr: 'Paul vient-il demain ?', en: 'Is Paul coming tomorrow?', es: '¿Paul viene mañana?', ht: 'Èske Paul ap vini demen?', de: 'Kommt Paul morgen?', ru: 'Придёт ли Поль завтра?', zh: '保罗明天来吗？', ja: 'ポールは明日来ますか？' } }
    ]
  },
  pronoms_interrogatifs: {
    icon: '❓📌', fr: 'Pronoms interrogatifs', en: 'Interrogative pronouns', es: 'Pronombres interrogativos', ht: 'Pwonon entèrogatif', de: 'Interrogativpronomen', ru: 'Вопросительные местоимения', zh: '疑问代词', ja: '疑問代名詞',
    explanation: { fr: 'Qui (personne), que/quoi (chose).', en: 'Who (person), what (thing).' },
    formula: { fr: 'qui, que, quoi, lequel, laquelle, lesquels, lesquelles', en: 'who, what, which' },
    examples: [
      { n: 'Qui est là ?', t: { fr: 'Qui est là ?', en: 'Who is there?', es: '¿Quién está ahí?', ht: 'Kiyès ki la?', de: 'Wer ist da?', ru: 'Кто там?', zh: '谁在那里？', ja: '誰がそこにいますか？' } }
    ]
  },
  adverbes_interrogatifs: {
    icon: '❓⏱️', fr: 'Adverbes interrogatifs', en: 'Interrogative adverbs', es: 'Adverbios interrogativos', ht: 'Advèb entèrogatif', de: 'Interrogativadverbien', ru: 'Вопросительные наречия', zh: '疑问副词', ja: '疑問副詞',
    explanation: { fr: 'Comment, pourquoi, quand, où, combien.', en: 'How, why, when, where, how much.' },
    formula: { fr: 'adverbe interrogatif + verbe + sujet ?', en: 'interrogative adverb + verb + subject?' },
    examples: [
      { n: 'Pourquoi es-tu en retard ?', t: { fr: 'Pourquoi es-tu en retard ?', en: 'Why are you late?', es: '¿Por qué llegas tarde?', ht: 'Poukisa ou an reta?', de: 'Warum bist du zu spät?', ru: 'Почему ты опоздал?', zh: '你为什么迟到？', ja: 'なぜ遅れたのですか？' } }
    ]
  },

  // ---------- VERBES ET TEMPS ----------
  verbes_er_present: {
    icon: '📖', fr: 'Verbes en -ER (présent)', en: '-ER verbs (present tense)', es: 'Verbos en -ER (presente)', ht: 'Vèb nan -ER (prezan)', de: 'Verben auf -ER (Präsens)', ru: 'Глаголы на -ER (настоящее время)', zh: '以 -ER 结尾的动词（现在时）', ja: '-ER動詞（現在形）',
    explanation: { fr: 'Conjugaison : radical + e, es, e, ons, ez, ent.', en: 'Conjugation: stem + e, es, e, ons, ez, ent.' },
    examples: [
      { n: 'Parler → je parle, tu parles, il parle, nous parlons, vous parlez, ils parlent.', t: { fr: 'Je parle français.', en: 'I speak French.', es: 'Hablo francés.', ht: 'Mwen pale franse.', de: 'Ich spreche Französisch.', ru: 'Я говорю по-французски.', zh: '我说法语。', ja: '私はフランス語を話します。' } }
    ]
  },
  verbes_ir_present: {
    icon: '📖', fr: 'Verbes en -IR (présent)', en: '-IR verbs (present tense)', es: 'Verbos en -IR (presente)', ht: 'Vèb nan -IR (prezan)', de: 'Verben auf -IR (Präsens)', ru: 'Глаголы на -IR (настоящее время)', zh: '以 -IR 结尾的动词（现在时）', ja: '-IR動詞（現在形）',
    explanation: { fr: 'Conjugaison : radical + is, is, it, issons, issez, issent.', en: 'Conjugation: stem + is, is, it, issons, issez, issent.' },
    examples: [
      { n: 'Finir → je finis, tu finis, il finit, nous finissons, vous finissez, ils finissent.', t: { fr: 'Nous finissons le travail.', en: 'We finish the work.', es: 'Terminamos el trabajo.', ht: 'Nou fini travay la.', de: 'Wir beenden die Arbeit.', ru: 'Мы заканчиваем работу.', zh: '我们完成工作。', ja: '私たちは仕事を終えます。' } }
    ]
  },
  verbes_re_present: {
    icon: '📖', fr: 'Verbes en -RE (présent)', en: '-RE verbs (present tense)', es: 'Verbos en -RE (presente)', ht: 'Vèb nan -RE (prezan)', de: 'Verben auf -RE (Präsens)', ru: 'Глаголы на -RE (настоящее время)', zh: '以 -RE 结尾的动词（现在时）', ja: '-RE動詞（現在形）',
    explanation: { fr: 'Conjugaison : radical + s, s, (rien), ons, ez, ent.', en: 'Conjugation: stem + s, s, (nothing), ons, ez, ent.' },
    examples: [
      { n: 'Vendre → je vends, tu vends, il vend, nous vendons, vous vendez, ils vendent.', t: { fr: 'Je vends ma voiture.', en: 'I sell my car.', es: 'Vendo mi coche.', ht: 'Mwen vann machin mwen.', de: 'Ich verkaufe mein Auto.', ru: 'Я продаю машину.', zh: '我卖我的车。', ja: '私は自分の車を売ります。' } }
    ]
  },
  verbe_etre_present: {
    icon: '⭐', fr: 'ÊTRE (présent)', en: 'To be (present)', es: 'Ser/estar (presente)', ht: 'YÈ (prezan)', de: 'Sein (Präsens)', ru: 'Быть (настоящее время)', zh: '动词 "être"（现在时）', ja: 'être（現在形）',
    explanation: { fr: 'Je suis, tu es, il/elle/on est, nous sommes, vous êtes, ils/elles sont.', en: 'I am, you are, he is, we are, you are, they are.' },
    examples: [
      { n: 'Je suis étudiant.', t: { fr: 'Je suis étudiant.', en: 'I am a student.', es: 'Soy estudiante.', ht: 'Mwen se elèv.', de: 'Ich bin Student.', ru: 'Я студент.', zh: '我是学生。', ja: '私は学生です。' } }
    ]
  },
  verbe_avoir_present: {
    icon: '⭐', fr: 'AVOIR (présent)', en: 'To have (present)', es: 'Tener (presente)', ht: 'GEN (prezan)', de: 'Haben (Präsens)', ru: 'Иметь (настоящее время)', zh: '动词 "avoir"（现在时）', ja: 'avoir（現在形）',
    explanation: { fr: 'J\'ai, tu as, il/elle/on a, nous avons, vous avez, ils/elles ont.', en: 'I have, you have, he has, we have, you have, they have.' },
    examples: [
      { n: 'J\'ai 20 ans.', t: { fr: 'J\'ai 20 ans.', en: 'I am 20 years old.', es: 'Tengo 20 años.', ht: 'Mwen gen 20 an.', de: 'Ich bin 20 Jahre alt.', ru: 'Мне 20 лет.', zh: '我20岁。', ja: '私は20歳です。' } }
    ]
  },
  verbe_aller_present: {
    icon: '⭐', fr: 'ALLER (présent)', en: 'To go (present)', es: 'Ir (presente)', ht: 'ALE (prezan)', de: 'Gehen (Präsens)', ru: 'Идти (настоящее время)', zh: '动词 "aller"（现在时）', ja: 'aller（現在形）',
    explanation: { fr: 'Je vais, tu vas, il/elle/on va, nous allons, vous allez, ils/elles vont.', en: 'I go, you go, he goes, we go, you go, they go.' },
    examples: [
      { n: 'Nous allons au cinéma.', t: { fr: 'Nous allons au cinéma.', en: 'We are going to the cinema.', es: 'Vamos al cine.', ht: 'Nou ale nan sinema.', de: 'Wir gehen ins Kino.', ru: 'Мы идём в кино.', zh: '我们去电影院。', ja: '私たちは映画館に行きます。' } }
    ]
  },
  verbe_faire_present: {
    icon: '⭐', fr: 'FAIRE (présent)', en: 'To do/make (present)', es: 'Hacer (presente)', ht: 'FÈ (prezan)', de: 'Machen (Präsens)', ru: 'Делать (настоящее время)', zh: '动词 "faire"（现在时）', ja: 'faire（現在形）',
    explanation: { fr: 'Je fais, tu fais, il/elle/on fait, nous faisons, vous faites, ils/elles font.', en: 'I do, you do, he does, we do, you do, they do.' },
    examples: [
      { n: 'Elle fait du sport.', t: { fr: 'Elle fait du sport.', en: 'She does sports.', es: 'Ella hace deporte.', ht: 'Li fè espò.', de: 'Sie macht Sport.', ru: 'Она занимается спортом.', zh: '她做运动。', ja: '彼女はスポーツをします。' } }
    ]
  },
  verbe_dire_present: {
    icon: '⭐', fr: 'DIRE (présent)', en: 'To say/tell (present)', es: 'Decir (presente)', ht: 'DI (prezan)', de: 'Sagen (Präsens)', ru: 'Говорить (настоящее время)', zh: '动词 "dire"（现在时）', ja: 'dire（現在形）',
    explanation: { fr: 'Je dis, tu dis, il/elle/on dit, nous disons, vous dites, ils/elles disent.', en: 'I say, you say, he says, we say, you say, they say.' },
    examples: [
      { n: 'Je dis la vérité.', t: { fr: 'Je dis la vérité.', en: 'I tell the truth.', es: 'Digo la verdad.', ht: 'Mwen di laverite.', de: 'Ich sage die Wahrheit.', ru: 'Я говорю правду.', zh: '我说实话。', ja: '私は真実を言います。' } }
    ]
  },
  verbe_pouvoir_present: {
    icon: '⭐', fr: 'POUVOIR (présent)', en: 'Can/to be able (present)', es: 'Poder (presente)', ht: 'KAPAB (prezan)', de: 'Können (Präsens)', ru: 'Мочь (настоящее время)', zh: '动词 "pouvoir"（现在时）', ja: 'pouvoir（現在形）',
    explanation: { fr: 'Je peux, tu peux, il/elle/on peut, nous pouvons, vous pouvez, ils/elles peuvent.', en: 'I can, you can, he can, we can, you can, they can.' },
    examples: [
      { n: 'Tu peux m\'aider ?', t: { fr: 'Tu peux m\'aider ?', en: 'Can you help me?', es: '¿Puedes ayudarme?', ht: 'Èske ou ka ede m?', de: 'Kannst du mir helfen?', ru: 'Ты можешь мне помочь?', zh: '你能帮我吗？', ja: '手伝ってくれますか？' } }
    ]
  },
  verbe_vouloir_present: {
    icon: '⭐', fr: 'VOULOIR (présent)', en: 'To want (present)', es: 'Querer (presente)', ht: 'VLE (prezan)', de: 'Wollen (Präsens)', ru: 'Хотеть (настоящее время)', zh: '动词 "vouloir"（现在时）', ja: 'vouloir（現在形）',
    explanation: { fr: 'Je veux, tu veux, il/elle/on veut, nous voulons, vous voulez, ils/elles veulent.', en: 'I want, you want, he wants, we want, you want, they want.' },
    examples: [
      { n: 'Je veux un café.', t: { fr: 'Je veux un café.', en: 'I want a coffee.', es: 'Quiero un café.', ht: 'Mwen vle yon kafe.', de: 'Ich möchte einen Kaffee.', ru: 'Я хочу кофе.', zh: '我想要一杯咖啡。', ja: 'コーヒーが欲しいです。' } }
    ]
  },
  verbe_savoir_present: {
    icon: '⭐', fr: 'SAVOIR (présent)', en: 'To know (present)', es: 'Saber (presente)', ht: 'KONNEN (prezan)', de: 'Wissen (Präsens)', ru: 'Знать (настоящее время)', zh: '动词 "savoir"（现在时）', ja: 'savoir（現在形）',
    explanation: { fr: 'Je sais, tu sais, il/elle/on sait, nous savons, vous savez, ils/elles savent.', en: 'I know, you know, he knows, we know, you know, they know.' },
    examples: [
      { n: 'Je sais parler espagnol.', t: { fr: 'Je sais parler espagnol.', en: 'I know how to speak Spanish.', es: 'Sé hablar español.', ht: 'Mwen konnen pale panyòl.', de: 'Ich kann Spanisch sprechen.', ru: 'Я умею говорить по-испански.', zh: '我会说西班牙语。', ja: '私はスペイン語を話せます。' } }
    ]
  },
  verbe_devoir_present: {
    icon: '⭐', fr: 'DEVOIR (présent)', en: 'Must/have to (present)', es: 'Deber (presente)', ht: 'DWE (prezan)', de: 'Müssen (Präsens)', ru: 'Должен (настоящее время)', zh: '动词 "devoir"（现在时）', ja: 'devoir（現在形）',
    explanation: { fr: 'Je dois, tu dois, il/elle/on doit, nous devons, vous devez, ils/elles doivent.', en: 'I must, you must, he must, we must, you must, they must.' },
    examples: [
      { n: 'Tu dois te reposer.', t: { fr: 'Tu dois te reposer.', en: 'You must rest.', es: 'Debes descansar.', ht: 'Ou dwe repoze.', de: 'Du musst dich ausruhen.', ru: 'Ты должен отдохнуть.', zh: '你必须休息。', ja: '休まなければなりません。' } }
    ]
  },
  imparfait: {
    icon: '🕰️', fr: 'Imparfait', en: 'Imperfect tense', es: 'Pretérito imperfecto', ht: 'Enpafè', de: 'Imperfekt', ru: 'Несовершенный вид прошедшего времени', zh: '未完成过去时', ja: '半過去',
    explanation: { fr: 'Action habituelle ou description dans le passé.', en: 'Habitual action or description in the past.' },
    formula: { fr: 'Radical du présent (nous) + ais, ais, ait, ions, iez, aient', en: 'Stem from present "nous" form + endings' },
    examples: [
      { n: 'Quand j\'étais petit, je jouais au foot.', t: { fr: 'Quand j\'étais petit, je jouais au foot.', en: 'When I was little, I played soccer.', es: 'Cuando era pequeño, jugaba al fútbol.', ht: 'Lè mwen te piti, mwen te jwe foutbòl.', de: 'Als ich klein war, spielte ich Fußball.', ru: 'Когда я был маленьким, я играл в футбол.', zh: '我小时候踢足球。', ja: '小さい頃、サッカーをしていました。' } }
    ]
  },
  futur_proche: {
    icon: '🔜', fr: 'Futur proche', en: 'Near future', es: 'Futuro próximo', ht: 'Fitou pre', de: 'Nahe Zukunft', ru: 'Ближайшее будущее', zh: '最近将来时', ja: '近接未来',
    explanation: { fr: 'Aller (présent) + infinitif = action qui va se passer bientôt.', en: 'Going to + verb = action that will happen soon.' },
    formula: { fr: 'sujet + aller conjugué + infinitif', en: 'subject + to be going to + verb' },
    examples: [
      { n: 'Je vais manger.', t: { fr: 'Je vais manger.', en: 'I am going to eat.', es: 'Voy a comer.', ht: 'Mwen pral manje.', de: 'Ich werde essen.', ru: 'Я собираюсь есть.', zh: '我要吃饭了。', ja: '私は食べに行きます。' } }
    ]
  },
  futur_simple: {
    icon: '🔮', fr: 'Futur simple', en: 'Simple future', es: 'Futuro simple', ht: 'Fitou senp', de: 'Einfaches Futur', ru: 'Простое будущее время', zh: '简单将来时', ja: '単純未来',
    explanation: { fr: 'Action future certaine, souvent lointaine.', en: 'Future action, often distant.' },
    formula: { fr: 'Infinitif + ai, as, a, ons, ez, ont (pour -re : enlever le e final)', en: 'Infinitive + endings' },
    examples: [
      { n: 'Je partirai demain.', t: { fr: 'Je partirai demain.', en: 'I will leave tomorrow.', es: 'Me iré mañana.', ht: 'Mwen pral kite demen.', de: 'Ich werde morgen abreisen.', ru: 'Я уеду завтра.', zh: '我明天走。', ja: '私は明日出発します。' } }
    ]
  },
  conditionnel_present: {
    icon: '🤔', fr: 'Conditionnel présent', en: 'Present conditional', es: 'Condicional presente', ht: 'Kondisyonèl prezan', de: 'Konditional Präsens', ru: 'Настоящее условное', zh: '条件式现在时', ja: '条件法現在',
    explanation: { fr: 'Exprimer une hypothèse, un souhait ou une demande polie.', en: 'Express a hypothesis, wish, or polite request.' },
    formula: { fr: 'Infinitif + ais, ais, ait, ions, iez, aient (mêmes terminaisons que l\'imparfait)', en: 'Infinitive + imperfect endings' },
    examples: [
      { n: 'Je voudrais un verre d\'eau.', t: { fr: 'Je voudrais un verre d\'eau.', en: 'I would like a glass of water.', es: 'Quisiera un vaso de agua.', ht: 'Mwen ta renmen yon vè dlo.', de: 'Ich hätte gerne ein Glas Wasser.', ru: 'Я хотел бы стакан воды.', zh: '我想要一杯水。', ja: '水を一杯いただけますか。' } }
    ]
  },
  subjonctif_present: {
    icon: '🌪️', fr: 'Subjonctif présent', en: 'Present subjunctive', es: 'Subjuntivo presente', ht: 'Subjonktif prezan', de: 'Präsens Konjunktiv', ru: 'Настоящее сослагательное', zh: '虚拟式现在时', ja: '接続法現在',
    explanation: { fr: 'Exprimer le doute, l\'émotion, l\'obligation, la volonté.', en: 'Express doubt, emotion, obligation, will.' },
    formula: { fr: 'Que + sujet + radical (ils/elles présent) + e, es, e, ions, iez, ent', en: 'That + subject + stem (they form) + endings' },
    examples: [
      { n: 'Il faut que tu viennes.', t: { fr: 'Il faut que tu viennes.', en: 'You must come.', es: 'Es necesario que vengas.', ht: 'Li fò ke ou vini.', de: 'Du musst kommen.', ru: 'Нужно, чтобы ты пришёл.', zh: '你必须来。', ja: 'あなたが来ることが必要です。' } }
    ]
  },
  imperatif: {
    icon: '❗', fr: 'Impératif', en: 'Imperative', es: 'Imperativo', ht: 'Enperatif', de: 'Imperativ', ru: 'Повелительное наклонение', zh: '命令式', ja: '命令法',
    explanation: { fr: 'Pour donner un ordre, un conseil ou une instruction.', en: 'To give an order, advice, or instruction.' },
    formula: { fr: 'tu, nous, vous (sans pronom) : mange, mangeons, mangez', en: 'you, we, you (without pronoun): eat, let’s eat, eat' },
    examples: [
      { n: 'Regarde !', t: { fr: 'Regarde !', en: 'Look!', es: '¡Mira!', ht: 'Gade!', de: 'Schau!', ru: 'Смотри!', zh: '看！', ja: '見て！' } }
    ]
  },
  voix_passive: {
    icon: '🔄', fr: 'Voix passive', en: 'Passive voice', es: 'Voz pasiva', ht: 'Vwa pasif', de: 'Passiv', ru: 'Пассивный залог', zh: '被动语态', ja: '受動態',
    explanation: { fr: 'L\'action est subie par le sujet.', en: 'The action is received by the subject.' },
    formula: { fr: 'sujet + être (conjugué) + participe passé (+ par + agent)', en: 'subject + to be (conjugated) + past participle (+ by + agent)' },
    examples: [
      { n: 'La lettre est écrite par Marie.', t: { fr: 'La lettre est écrite par Marie.', en: 'The letter is written by Marie.', es: 'La carta está escrita por María.', ht: 'Lèt la ekri pa Marie.', de: 'Der Brief wird von Marie geschrieben.', ru: 'Письмо написано Мари.', zh: '这封信是玛丽写的。', ja: '手紙はマリーによって書かれます。' } }
    ]
  },
  plus_que_parfait: {
    icon: '⏪', fr: 'Plus-que-parfait', en: 'Pluperfect', es: 'Pretérito pluscuamperfecto', ht: 'Pli-ke-pafè', de: 'Plusquamperfekt', ru: 'Предпрошедшее время', zh: '愈过去时', ja: '大過去',
    explanation: { fr: 'Action antérieure à une autre action passée (imparfait, passé composé).', en: 'Action that happened before another past action.' },
    formula: { fr: 'avoir/être (imparfait) + participe passé', en: 'had + past participle' },
    examples: [
      { n: 'Quand je suis arrivé, il avait déjà mangé.', t: { fr: 'Quand je suis arrivé, il avait déjà mangé.', en: 'When I arrived, he had already eaten.', es: 'Cuando llegué, él ya había comido.', ht: 'Lè mwen te rive, li te deja manje.', de: 'Als ich ankam, hatte er schon gegessen.', ru: 'Когда я пришёл, он уже поел.', zh: '当我到达时，他已经吃过了。', ja: '私が着いたとき、彼はもう食べていました。' } }
    ]
  },
  passe_simple_regulier: {
    icon: '📜', fr: 'Passé simple (verbes réguliers)', en: 'Simple past (regular verbs)', es: 'Pretérito perfecto simple (verbos regulares)', ht: 'Pase senp (vèb regilye)', de: 'Einfache Vergangenheit (regelmäßige Verben)', ru: 'Простое прошедшее время (правильные глаголы)', zh: '简单过去时（规则动词）', ja: '単純過去（規則動詞）',
    explanation: { fr: 'Temps littéraire pour des actions ponctuelles dans le passé.', en: 'Literary tense for punctual past actions.' },
    formula: { fr: '-er : ai, as, a, âmes, âtes, èrent ; -ir : is, is, it, îmes, îtes, irent', en: '-ed (except for irregulars)' },
    examples: [
      { n: 'Il parla longtemps.', t: { fr: 'Il parla longtemps.', en: 'He spoke for a long time.', es: 'Habló mucho tiempo.', ht: 'Li pale lontan.', de: 'Er sprach lange.', ru: 'Он говорил долго.', zh: '他讲了很长时间。', ja: '彼は長い間話しました。' } }
    ]
  },
  futur_anterieur: {
    icon: '🔮⏳', fr: 'Futur antérieur', en: 'Future perfect', es: 'Futuro perfecto', ht: 'Fitou anteryè', de: 'Futur II', ru: 'Будущее совершенное', zh: '先将来时', ja: '未来完了',
    explanation: { fr: 'Action qui sera achevée avant une autre action future.', en: 'Action that will be completed before another future action.' },
    formula: { fr: 'avoir/être (futur simple) + participe passé', en: 'will have + past participle' },
    examples: [
      { n: 'Quand tu arriveras, j’aurai fini mon travail.', t: { fr: 'Quand tu arriveras, j’aurai fini mon travail.', en: 'When you arrive, I will have finished my work.', es: 'Cuando llegues, habré terminado mi trabajo.', ht: 'Lè ou rive, mwen pral fini travay mwen.', de: 'Wenn du ankommst, werde ich meine Arbeit beendet haben.', ru: 'Когда ты приедешь, я закончу свою работу.', zh: '当你到达时，我会完成我的工作。', ja: 'あなたが到着するとき、私は仕事を終えているでしょう。' } }
    ]
  },
  conditionnel_passe: {
    icon: '🤔⏳', fr: 'Conditionnel passé', en: 'Past conditional', es: 'Condicional compuesto', ht: 'Kondisyonèl pase', de: 'Konditional II', ru: 'Прошедшее условное', zh: '条件式过去时', ja: '条件法過去',
    explanation: { fr: 'Exprime un regret, une hypothèse non réalisée dans le passé.', en: 'Expresses regret, an unrealized hypothesis in the past.' },
    formula: { fr: 'avoir/être (conditionnel présent) + participe passé', en: 'would have + past participle' },
    examples: [
      { n: 'J’aurais aimé te voir.', t: { fr: 'J’aurais aimé te voir.', en: 'I would have liked to see you.', es: 'Me habría gustado verte.', ht: 'Mwen ta renmen wè ou.', de: 'Ich hätte dich gerne gesehen.', ru: 'Я хотел бы тебя видеть.', zh: '我本想见你。', ja: 'あなたに会いたかったです。' } }
    ]
  },
  subjonctif_passe: {
    icon: '🌪️⏳', fr: 'Subjonctif passé', en: 'Past subjunctive', es: 'Subjuntivo perfecto', ht: 'Subjonktif pase', de: 'Konjunktiv Perfekt', ru: 'Сослагательное прошедшее', zh: '虚拟式过去时', ja: '接続法過去',
    explanation: { fr: 'Employé après une expression de sentiment, doute, volonté, pour une action antérieure au verbe principal.', en: 'Used after expressions of feeling, doubt, will, for an action prior to the main verb.' },
    formula: { fr: 'que + sujet + avoir/être (subjonctif présent) + participe passé', en: 'that + subject + have (subjunctive) + past participle' },
    examples: [
      { n: 'Je doute qu’il ait réussi.', t: { fr: 'Je doute qu’il ait réussi.', en: 'I doubt he succeeded.', es: 'Dudo que él haya tenido éxito.', ht: 'Mwen doute ke li te reyisi.', de: 'Ich bezweifle, dass er erfolgreich war.', ru: 'Я сомневаюсь, что он преуспел.', zh: '我怀疑他是否成功了。', ja: '彼が成功したかどうか疑わしい。' } }
    ]
  },
  imperatif_passe: {
    icon: '❗⏳', fr: 'Impératif passé', en: 'Past imperative', es: 'Imperativo pasado', ht: 'Enperatif pase', de: 'Imperativ Perfekt', ru: 'Повелительное прошедшее', zh: '命令式过去时', ja: '命令法過去',
    explanation: { fr: 'Très rare, exprime un ordre qui doit être exécuté avant une certaine échéance.', en: 'Very rare, expresses an order to be executed before a deadline.' },
    formula: { fr: 'avoir/être (impératif) + participe passé', en: 'have (imperative) + past participle' },
    examples: [
      { n: 'Aie fini avant midi !', t: { fr: 'Aie fini avant midi !', en: 'Have finished before noon!', es: '¡Ten terminado antes del mediodía!', ht: 'Fini anvan midi!', de: 'Hab vor Mittag fertig!', ru: 'Закончи до полудня!', zh: '中午前完成！', ja: '正午までに終わらせてください！' } }
    ]
  },
  infinitif_passe: {
    icon: '∞⏳', fr: 'Infinitif passé', en: 'Past infinitive', es: 'Infinitivo pasado', ht: 'Enfinitif pase', de: 'Infinitiv Perfekt', ru: 'Прошедший инфинитив', zh: '不定式过去时', ja: '過去不定詞',
    explanation: { fr: 'Exprimer une action antérieure au verbe principal.', en: 'Express an action prior to the main verb.' },
    formula: { fr: 'avoir/être + participe passé', en: 'to have + past participle' },
    examples: [
      { n: 'Après avoir mangé, je suis sorti.', t: { fr: 'Après avoir mangé, je suis sorti.', en: 'After having eaten, I went out.', es: 'Después de haber comido, salí.', ht: 'Apre fin manje, mwen soti.', de: 'Nachdem ich gegessen hatte, ging ich aus.', ru: 'Поев, я вышел.', zh: '吃完后，我出去了。', ja: '食べた後、私は出かけました。' } }
    ]
  },
  participe_present: {
    icon: '🔄📝', fr: 'Participe présent', en: 'Present participle', es: 'Participio presente', ht: 'Patisip prezan', de: 'Partizip Präsens', ru: 'Причастие настоящего времени', zh: '现在分词', ja: '現在分詞',
    explanation: { fr: 'Forme en -ant. Peut être utilisé comme adjectif ou gérondif.', en: 'Form ending in -ing. Can be used as an adjective or gerund.' },
    formula: { fr: 'radical + ant (invariable)', en: 'verb + ing' },
    examples: [
      { n: 'Une femme souriante.', t: { fr: 'Une femme souriante.', en: 'A smiling woman.', es: 'Una mujer sonriente.', ht: 'Yon fanm k ap souri.', de: 'Eine lächelnde Frau.', ru: 'Улыбающаяся женщина.', zh: '微笑的女人。', ja: '笑っている女性。' } }
    ]
  },
  gerondif: {
    icon: '🔄⌛', fr: 'Gérondif', en: 'Gerund', es: 'Gerundio', ht: 'Jerondif', de: 'Gerundium', ru: 'Деепричастие', zh: '副动词', ja: 'ジェロンディフ',
    explanation: { fr: 'En + participe présent. Exprime la simultanéité ou la manière.', en: 'By + present participle. Expresses simultaneity or manner.' },
    formula: { fr: 'en + participe présent', en: 'by + verb-ing' },
    examples: [
      { n: 'Il apprend en jouant.', t: { fr: 'Il apprend en jouant.', en: 'He learns by playing.', es: 'Él aprende jugando.', ht: 'Li aprann jwe.', de: 'Er lernt spielend.', ru: 'Он учится играя.', zh: '他边玩边学。', ja: '彼は遊びながら学びます。' } }
    ]
  },

  // ---------- EXPRESSIONS ET RÈGLES SUPP ----------
  comparatif_superiorite: {
    icon: '📈', fr: 'Comparatif de supériorité', en: 'Comparative of superiority', es: 'Comparativo de superioridad', ht: 'Konparatif siperyorite', de: 'Komparativ der Überlegenheit', ru: 'Сравнительная степень превосходства', zh: '比较级（较优）', ja: '優越比較級',
    explanation: { fr: 'Plus + adjectif/adverbe + que = plus ... que.', en: 'More + adjective/adverb + than.' },
    formula: { fr: 'plus + adjectif/adverbe + que', en: 'more + adjective/adverb + than' },
    examples: [
      { n: 'Il est plus grand que moi.', t: { fr: 'Il est plus grand que moi.', en: 'He is taller than me.', es: 'Él es más alto que yo.', ht: 'Li pi gran pase m.', de: 'Er ist größer als ich.', ru: 'Он выше меня.', zh: '他比我高。', ja: '彼は私より背が高いです。' } }
    ]
  },
  comparatif_inferiorite: {
    icon: '📉', fr: 'Comparatif d’infériorité', en: 'Comparative of inferiority', es: 'Comparativo de inferioridad', ht: 'Konparatif enferyorite', de: 'Komparativ der Minderheit', ru: 'Сравнительная степень меньшинства', zh: '比较级（较劣）', ja: '劣勢比較級',
    explanation: { fr: 'Moins + adjectif/adverbe + que = moins ... que.', en: 'Less + adjective/adverb + than.' },
    formula: { fr: 'moins + adjectif/adverbe + que', en: 'less + adjective/adverb + than' },
    examples: [
      { n: 'Ce film est moins intéressant que l’autre.', t: { fr: 'Ce film est moins intéressant que l’autre.', en: 'This movie is less interesting than the other.', es: 'Esta película es menos interesante que la otra.', ht: 'Fim sa a mwens enteresan pase lòt la.', de: 'Dieser Film ist weniger interessant als der andere.', ru: 'Этот фильм менее интересен, чем другой.', zh: '这部电影不如另一部有趣。', ja: 'この映画はもう一方より面白くない。' } }
    ]
  },
  comparatif_egalite: {
    icon: '⚖️', fr: 'Comparatif d’égalité', en: 'Comparative of equality', es: 'Comparativo de igualdad', ht: 'Konparatif egalite', de: 'Komparativ der Gleichheit', ru: 'Сравнительная степень равенства', zh: '比较级（同等）', ja: '同等比較級',
    explanation: { fr: 'Aussi + adjectif/adverbe + que = aussi ... que.', en: 'As + adjective/adverb + as.' },
    formula: { fr: 'aussi + adjectif/adverbe + que', en: 'as + adjective/adverb + as' },
    examples: [
      { n: 'Elle est aussi intelligente que son frère.', t: { fr: 'Elle est aussi intelligente que son frère.', en: 'She is as intelligent as her brother.', es: 'Ella es tan inteligente como su hermano.', ht: 'Li menm entelijan tankou frè l.', de: 'Sie ist genauso intelligent wie ihr Bruder.', ru: 'Она такая же умная, как её брат.', zh: '她和她哥哥一样聪明。', ja: '彼女は兄と同じくらい賢いです。' } }
    ]
  },
  superlatif: {
    icon: '🥇', fr: 'Superlatif', en: 'Superlative', es: 'Superlativo', ht: 'Siperlatif', de: 'Superlativ', ru: 'Превосходная степень', zh: '最高级', ja: '最上級',
    explanation: { fr: 'Le/la/les + plus/moins + adjectif (de ...) = le plus ...', en: 'The most/least + adjective (of ...).' },
    formula: { fr: 'le/la/les plus/moins + adjectif (+ de)', en: 'the most/least + adjective (+ of)' },
    examples: [
      { n: 'C’est la meilleure idée.', t: { fr: 'C’est la meilleure idée.', en: 'That’s the best idea.', es: 'Es la mejor idea.', ht: 'Se pi bon lide a.', de: 'Das ist die beste Idee.', ru: 'Это лучшая идея.', zh: '这是最好的主意。', ja: 'それが一番のアイデアです。' } }
    ]
  },

  // ---------- COMPLÉMENTS CORRIGÉS (Fermeture des objets "fantômes") ----------
  orthographe_elision: {
    icon: '✂️', fr: 'Élision (je + aime → j’aime)', en: 'Elision (I + like → I like - elision of e)', es: 'Elisión (je + aime → j’aime)', ht: 'Elizyon (je + aime → j’aime)', de: 'Elision (je + aime → j’aime)', ru: 'Элизия (je + aime → j’aime)', zh: '省音 (je + aime → j’aime)', ja: 'エリジオン',
    explanation: { fr: 'La voyelle finale de certains mots disparaît devant une voyelle ou un h muet.', en: 'The final vowel of some words disappears before a vowel or silent h.' },
    formula: { fr: 'ce/cet, je/me/te/se/le/la/ne/de/que + voyelle ou h muet → c’, j’, m’, t’, s’, l’, n’, d’, qu’', en: 'ce/cet, I/me/you/him/her/it/not/of/that + vowel or silent h → c’, j’, m’, t’, s’, l’, n’, d’, qu’' },
    examples: [{ n: 'J’aime, l’hôtel, qu’est-ce que', t: { fr: 'J’aime, l’hôtel, qu’est-ce que', en: 'I love, the hotel, what is it that', es: 'Me gusta, el hotel, qué es lo que', ht: 'Mwen renmen, otèl la, kisa', de: 'Ich liebe, das Hotel, was ist das', ru: 'Люблю, отель, что это', zh: '我爱，酒店，什么是', ja: '私は愛しています、ホテル、それは何ですか' } }]
  },
  ajout_cedille: {
    icon: 'ç', fr: 'Cédille (ç)', en: 'Cedilla (ç)', es: 'Cedilla (ç)', ht: 'Sedil (ç)', de: 'Cedille (ç)', ru: 'Седиль (ç)', zh: '软音符 (ç)', ja: 'セディーユ',
    explanation: { fr: 'Se place sous le c pour rendre le son [s] devant a, o, u.', en: 'Placed under c to give [s] sound before a, o, u.' },
    formula: { fr: 'c + a, o, u → ç + a, o, u', en: 'c + a, o, u → ç + a, o, u' },
    examples: [{ n: 'français, leçon, reçu', t: { fr: 'français, leçon, reçu', en: 'French, lesson, received', es: 'francés, lección, recibido', ht: 'franse, leson, resevwa', de: 'Französisch, Lektion, erhalten', ru: 'французский, урок, получено', zh: '法语，课，收到', ja: 'フランス語、授業、受け取った' } }]
  },
  ajout_accent_aigu_grave: {
    icon: 'éè', fr: 'Accents aigu (é) et grave (è)', en: 'Acute (é) and grave (è) accents', es: 'Acentos agudo (é) y grave (è)', ht: 'Aksan egi (é) ak grav (è)', de: 'Akut (é) und Gravis (è)', ru: 'Акут (é) и гравис (è)', zh: '尖音符 (é) 和重音符 (è)', ja: 'アキュートアクセント (é) とグレイヴアクセント (è)',
    explanation: { fr: 'é se prononce [e], è se prononce [ɛ].', en: 'é is pronounced [e], è is pronounced [ɛ].' },
    formula: { fr: 'é (fermé), è (ouvert)', en: 'é (closed), è (open)' },
    examples: [{ n: 'été (summer), père (father)', t: { fr: 'été, père', en: 'summer, father', es: 'verano, padre', ht: 'ete, papa', de: 'Sommer, Vater', ru: 'лето, отец', zh: '夏天，父亲', ja: '夏、父' } }]
  },
  accord_couleurs: {
    icon: '🎨', fr: 'Accord des adjectifs de couleur', en: 'Agreement of color adjectives', es: 'Concordancia de los adjetivos de color', ht: 'Akò adjektif koulè', de: 'Übereinstimmung der Farbadjektive', ru: 'Согласование прилагательных цвета', zh: '颜色形容词的配合', ja: '色形容詞の一致',
    explanation: { fr: 'Les adjectifs de couleur s’accordent sauf s’ils sont composés ou issus de noms.', en: 'Color adjectives agree except when they are compound or derived from nouns.' },
    formula: { fr: 'rouge, verte, bleus → accord ; marron, orange, cerise → invariables', en: 'red, green, blue → agree ; brown, orange, cherry → invariable' },
    examples: [{ n: 'Des chaussures marron.', t: { fr: 'Des chaussures marron.', en: 'Brown shoes.', es: 'Zapatos marrones.', ht: 'Soulye mawon.', de: 'Braune Schuhe.', ru: 'Коричневые туфли.', zh: '棕色的鞋子。', ja: '茶色の靴。' } }]
  },
  adjectif_formation_nom: {
    icon: '📝', fr: 'Formation des adjectifs à partir de noms', en: 'Forming adjectives from nouns', es: 'Formación de adjetivos a partir de sustantivos', ht: 'Fòmasyon adjektif apati non', de: 'Bildung von Adjektiven aus Nomen', ru: 'Образование прилагательных от существительных', zh: '从名词构成形容词', ja: '名詞からの形容詞形成',
    explanation: { fr: 'Ajout de suffixes : -al (national), -el (naturel), -eux (joyeux), -if (sportif), -ique (artistique).', en: 'Add suffixes : -al (national), -el (natural), -ous (joyful), -ive (sporty), -ic (artistic).' },
    formula: { fr: 'nom + suffixe', en: 'noun + suffix' },
    examples: [{ n: 'nature → naturel, joie → joyeux', t: { fr: 'naturel, joyeux', en: 'natural, joyful', es: 'natural, alegre', ht: 'natirèl, kontan', de: 'natürlich, fröhlich', ru: 'натуральный, радостный', zh: '自然的，快乐的', ja: '自然な、楽しい' } }]
  },
  adverbes_lieu_temps_maniere_quantite: {
    icon: '📍⏱️⚡📏', fr: 'Types d’adverbes', en: 'Types of adverbs', es: 'Tipos de adverbios', ht: 'Kalite advèb', de: 'Arten von Adverbien', ru: 'Типы наречий', zh: '副词类型', ja: '副詞の種類',
    explanation: { fr: 'Lieu (ici, là, devant), temps (maintenant, bientôt, hier), manière (bien, mal, vite), quantité (très, peu, beaucoup).', en: 'Place (here, there, in front), time (now, soon, yesterday), manner (well, badly, quickly), quantity (very, little, a lot).' },
    formula: { fr: 'adverbe modifie verbe, adjectif ou autre adverbe', en: 'adverb modifies verb, adjective or another adverb' },
    examples: [{ n: 'Il court vite.', t: { fr: 'Il court vite.', en: 'He runs fast.', es: 'Corre rápido.', ht: 'Li kouri vit.', de: 'Er rennt schnell.', ru: 'Он бегает быстро.', zh: '他跑得快。', ja: '彼は速く走ります。' } }]
  },
  negation_aucun: {
    icon: '0️⃣', fr: 'Négation avec "aucun"', en: 'Negation with "aucun" (none)', es: 'Negación con "ningún"', ht: 'Negasyon ak "okenn"', de: 'Verneinung mit "kein"', ru: 'Отрицание с "aucun" (никакой)', zh: '用"aucun"的否定', ja: '「aucun」を用いた否定',
    explanation: { fr: 'Ne + verbe + aucun(e) + nom = pas un seul.', en: 'Ne + verb + aucun(e) + noun = not a single one.' },
    formula: { fr: 'ne + verbe + aucun(e) + nom', en: 'not + verb + any + noun' },
    examples: [{ n: 'Je n’ai aucune idée.', t: { fr: 'Je n’ai aucune idée.', en: 'I have no idea.', es: 'No tengo ninguna idea.', ht: 'Mwen pa gen okenn lide.', de: 'Ich habe keine Ahnung.', ru: 'У меня нет никакой идеи.', zh: '我没有主意。', ja: '私は何のアイデアもありません。' } }]
  },
  connecteurs_logiques: {
    icon: '🔗🧠', fr: 'Connecteurs logiques', en: 'Logical connectors', es: 'Conectores lógicos', ht: 'Konektè lojik', de: 'Logische Konnektoren', ru: 'Логические связки', zh: '逻辑连接词', ja: '論理接続詞',
    explanation: { fr: 'Organisent le discours : addition (et, de plus), opposition (mais, cependant), cause (car, parce que), conséquence (donc, ainsi), conclusion (en conclusion).', en: 'Organize speech: addition (and, moreover), opposition (but, however), cause (for, because), consequence (so, thus), conclusion (in conclusion).' },
    formula: { fr: 'connecteur + proposition', en: 'connector + clause' },
    examples: [{ n: 'En conclusion, je pense que...', t: { fr: 'En conclusion, je pense que...', en: 'In conclusion, I think that...', es: 'En conclusión, creo que...', ht: 'An konklizyon, mwen panse ke...', de: 'Zusammenfassend denke ich, dass...', ru: 'В заключение, я думаю, что...', zh: '总之，我认为...', ja: '結論として、私は...と思います。' } }]
  },
  condition_si_valeurs: {
    icon: '⚡❓', fr: 'Condition avec "si" (valeurs)', en: 'Conditional "if" clauses (tenses)', es: 'Oraciones condicionales con "si" (tiempos)', ht: 'Kondisyon ak "si" (tan)', de: 'Konditionalsätze mit "si" (Zeiten)', ru: 'Условные предложения с "si" (времена)', zh: '用"si"的条件句（时态）', ja: '「si」を用いた条件文（時制）',
    explanation: { fr: 'Si + présent → présent/futur. Si + imparfait → conditionnel présent. Si + plus-que-parfait → conditionnel passé.', en: 'If + present → present/future. If + imperfect → present conditional. If + pluperfect → past conditional.' },
    formula: { fr: 'si + prés. → prés./futur ; si + imp. → cond. prés. ; si + pqp → cond. passé', en: 'if + present → present/future ; if + past → conditional ; if + past perfect → past conditional' },
    examples: [{ n: 'Si j’avais su, je serais venu.', t: { fr: 'Si j’avais su, je serais venu.', en: 'If I had known, I would have come.', es: 'Si hubiera sabido, habría venido.', ht: 'Si mwen te konnen, mwen ta vini.', de: 'Wenn ich gewusst hätte, wäre ich gekommen.', ru: 'Если бы я знал, я бы пришёл.', zh: '如果我知道，我会来的。', ja: 'もし知っていたら、来ていたでしょう。' } }]
  },
  verbes_factitifs: {
    icon: '🛠️', fr: 'Verbes factitifs (faire + infinitif)', en: 'Causative verbs (make + infinitive)', es: 'Verbos factitivos (hacer + infinitivo)', ht: 'Vèb faktitif (fè + enfinitif)', de: 'Kausative Verben (lassen + Infinitiv)', ru: 'Каузативные глаголы (заставлять + инфинитив)', zh: '使役动词 (faire + 不定式)', ja: '使役動詞 (faire + 不定詞)',
    explanation: { fr: 'Exprimer que quelqu’un fait faire une action par une autre personne.', en: 'Express that someone has something done by someone else.' },
    formula: { fr: 'sujet + faire + infinitif + complément', en: 'subject + make + infinitive + complement' },
    examples: [{ n: 'Je fais réparer la voiture.', t: { fr: 'Je fais réparer la voiture.', en: 'I have the car repaired.', es: 'Hago reparar el coche.', ht: 'Mwen fè repare machin nan.', de: 'Ich lasse das Auto reparieren.', ru: 'Я ремонтирую машину.', zh: '我让人修车。', ja: '私は車を修理してもらいます。' } }]
  }
};

// =================================================================
// VERBES IRRÉGULIERS SUPPLÉMENTAIRES
// =================================================================
var irregular_verbs_extra = {
  prendre: {
    icon: '✋', fr: 'PRENDRE (présent)', en: 'TO TAKE (present)', es: 'TOMAR (presente)', ht: 'PRAN (prezan)', de: 'NEHMEN (Präsens)', ru: 'БРАТЬ (настоящее время)', zh: '动词 PRENDRE（现在时）', ja: 'PRENDRE（現在形）',
    explanation: { fr: 'Verbe irrégulier du 3e groupe.', en: 'Irregular 3rd group verb.' },
    formula: { fr: 'je prends, tu prends, il/elle/on prend, nous prenons, vous prenez, ils/elles prennent', en: 'I take, you take, he takes, we take, you take, they take' },
    examples: [{ n: 'Je prends le train.', t: { fr: 'Je prends le train.', en: 'I take the train.', es: 'Tomo el tren.', ht: 'Mwen pran tren an.', de: 'Ich nehme den Zug.', ru: 'Я беру поезд.', zh: '我坐火车。', ja: '私は電車に乗ります。' } }]
  },
  mettre: {
    icon: '👔', fr: 'METTRE (présent)', en: 'TO PUT (present)', es: 'PONER (presente)', ht: 'METE (prezan)', de: 'SETZEN/LEGEN (Präsens)', ru: 'КЛАСТЬ/СТАВИТЬ (настоящее время)', zh: '动词 METTRE（现在时）', ja: 'METTRE（現在形）',
    explanation: { fr: 'Verbe irrégulier du 3e groupe.', en: 'Irregular 3rd group verb.' },
    formula: { fr: 'je mets, tu mets, il/elle/on met, nous mettons, vous mettez, ils/elles mettent', en: 'I put, you put, he puts, we put, you put, they put' },
    examples: [{ n: 'Je mets la table.', t: { fr: 'Je mets la table.', en: 'I set the table.', es: 'Pongo la mesa.', ht: 'Mwen mete tab la.', de: 'Ich decke den Tisch.', ru: 'Я накрываю стол.', zh: '我摆桌子。', ja: '私はテーブルをセットします。' } }]
  },
  connaitre: {
    icon: '🧠', fr: 'CONNAÎTRE (présent)', en: 'TO KNOW (present)', es: 'CONOCER (presente)', ht: 'KONNEN (prezan)', de: 'KENNEN (Präsens)', ru: 'ЗНАТЬ (настоящее время)', zh: '动词 CONNAÎTRE（现在时）', ja: 'CONNAÎTRE（現在形）',
    explanation: { fr: 'Différent de "savoir" : connais une personne, un lieu.', en: 'Different from "savoir": know a person, a place.' },
    formula: { fr: 'je connais, tu connais, il/elle/on connaît, nous connaissons, vous connaissez, ils/elles connaissent', en: 'I know, you know, he knows, we know, you know, they know' },
    examples: [{ n: 'Je connais Paris.', t: { fr: 'Je connais Paris.', en: 'I know Paris.', es: 'Conozco París.', ht: 'Mwen konnen Pari.', de: 'Ich kenne Paris.', ru: 'Я знаю Париж.', zh: '我认识巴黎。', ja: '私はパリを知っています。' } }]
  },
  venir: {
    icon: '🚶‍♂️', fr: 'VENIR (présent)', en: 'TO COME (present)', es: 'VENIR (presente)', ht: 'VINI (prezan)', de: 'KOMMEN (Präsens)', ru: 'ПРИХОДИТЬ (настоящее время)', zh: '动词 VENIR（现在时）', ja: 'VENIR（現在形）',
    explanation: { fr: 'Verbe irrégulier du 3e groupe.', en: 'Irregular 3rd group verb.' },
    formula: { fr: 'je viens, tu viens, il/elle/on vient, nous venons, vous venez, ils/elles viennent', en: 'I come, you come, he comes, we come, you come, they come' },
    examples: [{ n: 'Je viens de France.', t: { fr: 'Je viens de France.', en: 'I come from France.', es: 'Vengo de Francia.', ht: 'Mwen soti ann Frans.', de: 'Ich komme aus Frankreich.', ru: 'Я из Франции.', zh: '我来自法国。', ja: '私はフランスから来ました。' } }]
  },
  tenir: {
    icon: '🤲', fr: 'TENIR (présent)', en: 'TO HOLD (present)', es: 'SOSTENER (presente)', ht: 'KENBE (prezan)', de: 'HALTEN (Präsens)', ru: 'ДЕРЖАТЬ (настоящее время)', zh: '动词 TENIR（现在时）', ja: 'TENIR（現在形）',
    explanation: { fr: 'Verbe irrégulier du 3e groupe.', en: 'Irregular 3rd group verb.' },
    formula: { fr: 'je tiens, tu tiens, il/elle/on tient, nous tenons, vous tenez, ils/elles tiennent', en: 'I hold, you hold, he holds, we hold, you hold, they hold' },
    examples: [{ n: 'Il tient le bébé.', t: { fr: 'Il tient le bébé.', en: 'He holds the baby.', es: 'Él sostiene al bebé.', ht: 'Li kenbe ti bebe a.', de: 'Er hält das Baby.', ru: 'Он держит ребёнка.', zh: '他抱着婴儿。', ja: '彼は赤ちゃんを抱いています。' } }]
  },
  voir: {
    icon: '👁️', fr: 'VOIR (présent)', en: 'TO SEE (present)', es: 'VER (presente)', ht: 'WÈ (prezan)', de: 'SEHEN (Präsens)', ru: 'ВИДЕТЬ (настоящее время)', zh: '动词 VOIR（现在时）', ja: 'VOIR（現在形）',
    explanation: { fr: 'Verbe irrégulier du 3e groupe.', en: 'Irregular 3rd group verb.' },
    formula: { fr: 'je vois, tu vois, il/elle/on voit, nous voyons, vous voyez, ils/elles voient', en: 'I see, you see, he sees, we see, you see, they see' },
    examples: [{ n: 'Je vois la mer.', t: { fr: 'Je vois la mer.', en: 'I see the sea.', es: 'Veo el mar.', ht: 'Mwen wè lanmè a.', de: 'Ich sehe das Meer.', ru: 'Я вижу море.', zh: '我看见大海。', ja: '私は海が見えます。' } }]
  },
  croire: {
    icon: '🙏', fr: 'CROIRE (présent)', en: 'TO BELIEVE (present)', es: 'CREER (presente)', ht: 'KWÈ (prezan)', de: 'GLAUBEN (Präsens)', ru: 'ВЕРИТЬ (настоящее время)', zh: '动词 CROIRE（现在时）', ja: 'CROIRE（現在形）',
    explanation: { fr: 'Verbe irrégulier du 3e groupe.', en: 'Irregular 3rd group verb.' },
    formula: { fr: 'je crois, tu crois, il/elle/on croit, nous croyons, vous croyez, ils/elles croient', en: 'I believe, you believe, he believes, we believe, you believe, they believe' },
    examples: [{ n: 'Je crois en Dieu.', t: { fr: 'Je crois en Dieu.', en: 'I believe in God.', es: 'Creo en Dios.', ht: 'Mwen kwè nan Bondye.', de: 'Ich glaube an Gott.', ru: 'Я верю в Бога.', zh: '我相信上帝。', ja: '私は神を信じています。' } }]
  }
};

// =================================================================
// PHRASES ET EXPRESSIONS — 500 éléments (expressions quotidiennes)
// =================================================================
var PHRASES_DATA = {

  // 1. Salutations et politesse (25 phrases)
  salutations: {
    icon: '👋',
    fr: 'Salutations et politesse',
    en: 'Greetings and politeness',
    es: 'Saludos y cortesía',
    ht: 'Bonjou ak politès',
    de: 'Begrüßungen und Höflichkeit',
    ru: 'Приветствия и вежливость',
    zh: '问候与礼貌',
    ja: '挨拶と丁寧さ',
    items: [
      { n: 'Bonjour', t: { fr: 'Bonjour', en: 'Hello', es: 'Hola', ht: 'Bonjou', de: 'Hallo', ru: 'Здравствуйте', zh: '你好', ja: 'こんにちは' } },
      { n: 'Bonsoir', t: { fr: 'Bonsoir', en: 'Good evening', es: 'Buenas noches', ht: 'Bonswa', de: 'Guten Abend', ru: 'Добрый вечер', zh: '晚上好', ja: 'こんばんは' } },
      { n: 'Salut', t: { fr: 'Salut', en: 'Hi', es: 'Hola', ht: 'Alo', de: 'Hallo', ru: 'Привет', zh: '嗨', ja: 'やあ' } },
      { n: 'Au revoir', t: { fr: 'Au revoir', en: 'Goodbye', es: 'Adiós', ht: 'Orevwa', de: 'Auf Wiedersehen', ru: 'До свидания', zh: '再见', ja: 'さようなら' } },
      { n: 'À bientôt', t: { fr: 'À bientôt', en: 'See you soon', es: 'Hasta pronto', ht: 'Na byento', de: 'Bis bald', ru: 'До скорого', zh: '一会儿见', ja: 'またね' } },
      { n: 'À demain', t: { fr: 'À demain', en: 'See you tomorrow', es: 'Hasta mañana', ht: 'A demen', de: 'Bis morgen', ru: 'До завтра', zh: '明天见', ja: 'また明日' } },
      { n: 'Merci', t: { fr: 'Merci', en: 'Thank you', es: 'Gracias', ht: 'Mèsi', de: 'Danke', ru: 'Спасибо', zh: '谢谢', ja: 'ありがとう' } },
      { n: 'Merci beaucoup', t: { fr: 'Merci beaucoup', en: 'Thank you very much', es: 'Muchas gracias', ht: 'Mèsi anpil', de: 'Vielen Dank', ru: 'Большое спасибо', zh: '非常感谢', ja: 'どうもありがとう' } },
      { n: 'De rien', t: { fr: 'De rien', en: 'You’re welcome', es: 'De nada', ht: 'Pa de kwa', de: 'Gern geschehen', ru: 'Пожалуйста', zh: '不客气', ja: 'どういたしまして' } },
      { n: 'S’il vous plaît', t: { fr: 'S’il vous plaît', en: 'Please', es: 'Por favor', ht: 'Tanpri', de: 'Bitte', ru: 'Пожалуйста', zh: '请', ja: 'お願いします' } },
      { n: 'Excusez-moi', t: { fr: 'Excusez-moi', en: 'Excuse me', es: 'Disculpe', ht: 'Eskize m', de: 'Entschuldigung', ru: 'Извините', zh: '打扰一下', ja: 'すみません' } },
      { n: 'Pardon', t: { fr: 'Pardon', en: 'Sorry', es: 'Perdón', ht: 'Padon', de: 'Verzeihung', ru: 'Простите', zh: '对不起', ja: 'ごめんなさい' } },
      { n: 'Je suis désolé(e)', t: { fr: 'Je suis désolé(e)', en: 'I am sorry', es: 'Lo siento', ht: 'Mwen dezole', de: 'Es tut mir leid', ru: 'Мне жаль', zh: '我很抱歉', ja: '申し訳ありません' } },
      { n: 'Ce n’est pas grave', t: { fr: 'Ce n’est pas grave', en: 'It doesn’t matter', es: 'No importa', ht: 'Se pa grav', de: 'Das macht nichts', ru: 'Ничего страшного', zh: '没关系', ja: '大丈夫です' } },
      { n: 'Félicitations', t: { fr: 'Félicitations', en: 'Congratulations', es: 'Felicidades', ht: 'Felisitasyon', de: 'Glückwunsch', ru: 'Поздравляю', zh: '恭喜', ja: 'おめでとう' } },
      { n: 'Bonne chance', t: { fr: 'Bonne chance', en: 'Good luck', es: 'Buena suerte', ht: 'Bòn chans', de: 'Viel Glück', ru: 'Удачи', zh: '祝你好运', ja: '幸運を祈ります' } },
      { n: 'Bon courage', t: { fr: 'Bon courage', en: 'Hang in there', es: 'Ánimo', ht: 'Bon kouraj', de: 'Viel Mut', ru: 'Держись', zh: '加油', ja: '頑張って' } },
      { n: 'Bonne journée', t: { fr: 'Bonne journée', en: 'Have a nice day', es: 'Buen día', ht: 'Bòn jounen', de: 'Schönen Tag', ru: 'Хорошего дня', zh: '祝您有美好的一天', ja: '良い一日を' } },
      { n: 'Bonne soirée', t: { fr: 'Bonne soirée', en: 'Have a nice evening', es: 'Buena tarde', ht: 'Bòn sware', de: 'Schönen Abend', ru: 'Хорошего вечера', zh: '晚上愉快', ja: '良い夕方を' } },
      { n: 'Bonne nuit', t: { fr: 'Bonne nuit', en: 'Good night', es: 'Buenas noches', ht: 'Bòn nwit', de: 'Gute Nacht', ru: 'Спокойной ночи', zh: '晚安', ja: 'おやすみなさい' } },
      { n: 'Enchanté(e)', t: { fr: 'Enchanté(e)', en: 'Nice to meet you', es: 'Encantado/a', ht: 'Mwen kontan rankontre ou', de: 'Freut mich', ru: 'Приятно познакомиться', zh: '幸会', ja: 'はじめまして' } },
      { n: 'Comment allez-vous ?', t: { fr: 'Comment allez-vous ?', en: 'How are you?', es: '¿Cómo está usted?', ht: 'Koman ou ye?', de: 'Wie geht es Ihnen?', ru: 'Как дела?', zh: '您好吗？', ja: 'お元気ですか？' } },
      { n: 'Ça va ?', t: { fr: 'Ça va ?', en: 'How’s it going?', es: '¿Qué tal?', ht: 'Sa va?', de: 'Wie geht’s?', ru: 'Как дела?', zh: '怎么样？', ja: '元気？' } },
      { n: 'Ça va bien, merci', t: { fr: 'Ça va bien, merci', en: 'I’m fine, thanks', es: 'Estoy bien, gracias', ht: 'Sa va byen, mèsi', de: 'Mir geht’s gut, danke', ru: 'Хорошо, спасибо', zh: '我很好，谢谢', ja: '元気です、ありがとう' } },
      { n: 'Et vous / toi ?', t: { fr: 'Et vous / toi ?', en: 'And you?', es: '¿Y usted / tú?', ht: 'E ou menm?', de: 'Und Ihnen / dir?', ru: 'А вы / ты?', zh: '您/你呢？', ja: 'あなたは？' } }
    ]
  },

  // 2. Vie quotidienne (30 phrases)
  vie_quotidienne: {
    icon: '🏠',
    fr: 'Vie quotidienne',
    en: 'Daily life',
    es: 'Vida diaria',
    ht: 'Lavi chak jou',
    de: 'Alltag',
    ru: 'Повседневная жизнь',
    zh: '日常生活',
    ja: '日常生活',
    items: [
      { n: 'Je me lève à 7h.', t: { fr: 'Je me lève à 7h.', en: 'I get up at 7 am.', es: 'Me levanto a las 7.', ht: 'Mwen leve a 7 è.', de: 'Ich stehe um 7 Uhr auf.', ru: 'Я встаю в 7 утра.', zh: '我七点起床。', ja: '7時に起きます。' } },
      { n: 'Je prends une douche.', t: { fr: 'Je prends une douche.', en: 'I take a shower.', es: 'Me ducho.', ht: 'Mwen pran yon douch.', de: 'Ich dusche.', ru: 'Я принимаю душ.', zh: '我洗澡。', ja: 'シャワーを浴びます。' } },
      { n: 'Je prends le petit-déjeuner.', t: { fr: 'Je prends le petit-déjeuner.', en: 'I have breakfast.', es: 'Desayuno.', ht: 'Mwen manje maten.', de: 'Ich frühstücke.', ru: 'Я завтракаю.', zh: '我吃早餐。', ja: '朝ごはんを食べます。' } },
      { n: 'Je vais au travail.', t: { fr: 'Je vais au travail.', en: 'I go to work.', es: 'Voy al trabajo.', ht: 'Mwen ale nan travay.', de: 'Ich gehe zur Arbeit.', ru: 'Я иду на работу.', zh: '我去上班。', ja: '仕事に行きます。' } },
      { n: 'Je travaille de 9h à 17h.', t: { fr: 'Je travaille de 9h à 17h.', en: 'I work from 9 to 5.', es: 'Trabajo de 9 a 5.', ht: 'Mwen travay de 9 a 17 è.', de: 'Ich arbeite von 9 bis 17 Uhr.', ru: 'Я работаю с 9 до 17.', zh: '我从九点工作到五点。', ja: '9時から17時まで働きます。' } },
      { n: 'Je déjeune à midi.', t: { fr: 'Je déjeune à midi.', en: 'I have lunch at noon.', es: 'Almuerzo al mediodía.', ht: 'Mwen manje midi.', de: 'Ich esse mittags.', ru: 'Я обедаю в полдень.', zh: '我中午吃午饭。', ja: '正午に昼食をとります。' } },
      { n: 'Je rentre à la maison.', t: { fr: 'Je rentre à la maison.', en: 'I come home.', es: 'Vuelvo a casa.', ht: 'Mwen retounen lakay.', de: 'Ich komme nach Hause.', ru: 'Я возвращаюсь домой.', zh: '我回家。', ja: '家に帰ります。' } },
      { n: 'Je fais la cuisine.', t: { fr: 'Je fais la cuisine.', en: 'I cook.', es: 'Cocino.', ht: 'Mwen kwit manje.', de: 'Ich koche.', ru: 'Я готовлю.', zh: '我做饭。', ja: '料理をします。' } },
      { n: 'Je dîne en famille.', t: { fr: 'Je dîne en famille.', en: 'I have dinner with family.', es: 'Ceno en familia.', ht: 'Mwen dine an fanmi.', de: 'Ich esse mit der Familie zu Abend.', ru: 'Я ужинаю с семьёй.', zh: '我和家人吃晚饭。', ja: '家族と夕食をとります。' } },
      { n: 'Je regarde la télévision.', t: { fr: 'Je regarde la télévision.', en: 'I watch TV.', es: 'Veo la televisión.', ht: 'Mwen gade televizyon.', de: 'Ich sehe fern.', ru: 'Я смотрю телевизор.', zh: '我看电视。', ja: 'テレビを見ます。' } },
      { n: 'Je me brosse les dents.', t: { fr: 'Je me brosse les dents.', en: 'I brush my teeth.', es: 'Me cepillo los dientes.', ht: 'Mwen bwose dan mwen.', de: 'Ich putze mir die Zähne.', ru: 'Я чищу зубы.', zh: '我刷牙。', ja: '歯を磨きます。' } },
      { n: 'Je me couche à 23h.', t: { fr: 'Je me couche à 23h.', en: 'I go to bed at 11 pm.', es: 'Me acuesto a las 11 pm.', ht: 'Mwen kouche a 23 è.', de: 'Ich gehe um 23 Uhr ins Bett.', ru: 'Я ложусь в 23 часа.', zh: '我十一点睡觉。', ja: '23時に寝ます。' } },
      { n: 'Quelle heure est-il ?', t: { fr: 'Quelle heure est-il ?', en: 'What time is it?', es: '¿Qué hora es?', ht: 'Ki lè li ye?', de: 'Wie spät ist es?', ru: 'Который час?', zh: '几点了？', ja: '何時ですか？' } },
      { n: 'Il est 10 heures.', t: { fr: 'Il est 10 heures.', en: 'It is 10 o’clock.', es: 'Son las 10.', ht: 'Li 10 è.', de: 'Es ist 10 Uhr.', ru: '10 часов.', zh: '十点了。', ja: '10時です。' } },
      { n: 'Il est midi / minuit.', t: { fr: 'Il est midi / minuit.', en: 'It’s noon / midnight.', es: 'Es mediodía / medianoche.', ht: 'Li midi / minwi.', de: 'Es ist Mittag / Mitternacht.', ru: 'Полдень / полночь.', zh: '中午/午夜。', ja: '正午/真夜中です。' } },
      { n: 'Je suis fatigué(e).', t: { fr: 'Je suis fatigué(e).', en: 'I am tired.', es: 'Estoy cansado/a.', ht: 'Mwen fatige.', de: 'Ich bin müde.', ru: 'Я устал/устала.', zh: '我累了。', ja: '疲れました。' } },
      { n: 'Je suis content(e).', t: { fr: 'Je suis content(e).', en: 'I am happy.', es: 'Estoy contento/a.', ht: 'Mwen kontan.', de: 'Ich bin glücklich.', ru: 'Я счастлив/счастлива.', zh: '我开心。', ja: '嬉しいです。' } },
      { n: 'Je suis triste.', t: { fr: 'Je suis triste.', en: 'I am sad.', es: 'Estoy triste.', ht: 'Mwen tris.', de: 'Ich bin traurig.', ru: 'Мне грустно.', zh: '我难过。', ja: '悲しいです。' } },
      { n: 'J’ai faim.', t: { fr: 'J’ai faim.', en: 'I am hungry.', es: 'Tengo hambre.', ht: 'Mwen grangou.', de: 'Ich habe Hunger.', ru: 'Я голоден/голодна.', zh: '我饿了。', ja: 'お腹が空きました。' } },
      { n: 'J’ai soif.', t: { fr: 'J’ai soif.', en: 'I am thirsty.', es: 'Tengo sed.', ht: 'Mwen swaf.', de: 'Ich habe Durst.', ru: 'Я хочу пить.', zh: '我渴了。', ja: '喉が渇きました。' } },
      { n: 'J’ai chaud.', t: { fr: 'J’ai chaud.', en: 'I am hot.', es: 'Tengo calor.', ht: 'Mwen cho.', de: 'Mir ist heiß.', ru: 'Мне жарко.', zh: '我热。', ja: '暑いです。' } },
      { n: 'J’ai froid.', t: { fr: 'J’ai froid.', en: 'I am cold.', es: 'Tengo frío.', ht: 'Mwen frèt.', de: 'Mir ist kalt.', ru: 'Мне холодно.', zh: '我冷。', ja: '寒いです。' } },
      { n: 'J’ai sommeil.', t: { fr: 'J’ai sommeil.', en: 'I am sleepy.', es: 'Tengo sueño.', ht: 'Mwen dòmi.', de: 'Ich bin schläfrig.', ru: 'Я хочу спать.', zh: '我困了。', ja: '眠いです。' } },
      { n: 'Je m’ennuie.', t: { fr: 'Je m’ennuie.', en: 'I am bored.', es: 'Me aburro.', ht: 'Mwen anwiye.', de: 'Mir ist langweilig.', ru: 'Мне скучно.', zh: '我无聊。', ja: '退屈です。' } },
      { n: 'Quoi de neuf ?', t: { fr: 'Quoi de neuf ?', en: 'What’s new?', es: '¿Qué hay de nuevo?', ht: 'Kisa nouvo?', de: 'Was gibt’s Neues?', ru: 'Что нового?', zh: '有什么新鲜事？', ja: '何か新しいことは？' } },
      { n: 'Rien de spécial.', t: { fr: 'Rien de spécial.', en: 'Nothing special.', es: 'Nada especial.', ht: 'Pa gen anyen espesyal.', de: 'Nichts Besonderes.', ru: 'Ничего особенного.', zh: '没什么特别的。', ja: '特別なことは何もありません。' } },
      { n: 'Ça m’est égal.', t: { fr: 'Ça m’est égal.', en: 'I don’t care.', es: 'Me da igual.', ht: 'Sa egal pou mwen.', de: 'Das ist mir egal.', ru: 'Мне всё равно.', zh: '我不在乎。', ja: 'どうでもいいです。' } },
      { n: 'Peu importe.', t: { fr: 'Peu importe.', en: 'It doesn’t matter.', es: 'No importa.', ht: 'Kèlkeswa.', de: 'Egal.', ru: 'Неважно.', zh: '无所谓。', ja: '関係ありません。' } },
      { n: 'Tant mieux.', t: { fr: 'Tant mieux.', en: 'So much the better.', es: 'Mejor.', ht: 'Tant pi byen.', de: 'Umso besser.', ru: 'Тем лучше.', zh: '太好了。', ja: 'よかったですね。' } },
      { n: 'Tant pis.', t: { fr: 'Tant pis.', en: 'Too bad.', es: 'Qué pena.', ht: 'Tant pi.', de: 'Schade.', ru: 'Жаль.', zh: '可惜。', ja: '残念です。' } }
    ]
  },

  // 3. Au restaurant (20 phrases)
  restaurant: {
    icon: '🍽️',
    fr: 'Au restaurant',
    en: 'At the restaurant',
    es: 'En el restaurante',
    ht: 'Nan restoran',
    de: 'Im Restaurant',
    ru: 'В ресторане',
    zh: '在餐厅',
    ja: 'レストランで',
    items: [
      { n: 'Une table pour deux, s’il vous plaît.', t: { fr: 'Une table pour deux, s’il vous plaît.', en: 'A table for two, please.', es: 'Una mesa para dos, por favor.', ht: 'Yon tab pou de, tanpri.', de: 'Ein Tisch für zwei, bitte.', ru: 'Столик на двоих, пожалуйста.', zh: '请给我一张两人桌。', ja: '二人用のテーブルをお願いします。' } },
      { n: 'Je voudrais la carte.', t: { fr: 'Je voudrais la carte.', en: 'I would like the menu.', es: 'Quisiera la carta.', ht: 'Mwen ta renmen meni an.', de: 'Ich hätte gerne die Speisekarte.', ru: 'Я бы хотел меню.', zh: '我想要菜单。', ja: 'メニューをください。' } },
      { n: 'Qu’est-ce que vous recommandez ?', t: { fr: 'Qu’est-ce que vous recommandez ?', en: 'What do you recommend?', es: '¿Qué recomienda?', ht: 'Kisa ou rekòmande?', de: 'Was empfehlen Sie?', ru: 'Что вы рекомендуете?', zh: '您推荐什么？', ja: 'おすすめは何ですか？' } },
      { n: 'Je vais prendre le plat du jour.', t: { fr: 'Je vais prendre le plat du jour.', en: 'I’ll have the daily special.', es: 'Tomaré el plato del día.', ht: 'Mwen pran plat jounen an.', de: 'Ich nehme das Tagesgericht.', ru: 'Я возьму дежурное блюдо.', zh: '我要今日特餐。', ja: '日替わり定食をください。' } },
      { n: 'Je suis végétarien(ne).', t: { fr: 'Je suis végétarien(ne).', en: 'I am vegetarian.', es: 'Soy vegetariano/a.', ht: 'Mwen vejetaryen.', de: 'Ich bin Vegetarier/in.', ru: 'Я вегетарианец/вегетарианка.', zh: '我是素食者。', ja: '私はベジタリアンです。' } },
      { n: 'Sans gluten, s’il vous plaît.', t: { fr: 'Sans gluten, s’il vous plaît.', en: 'Gluten-free, please.', es: 'Sin gluten, por favor.', ht: 'San gluten, tanpri.', de: 'Glutenfrei, bitte.', ru: 'Без глютена, пожалуйста.', zh: '请提供无麸质食物。', ja: 'グルテンフリーでお願いします。' } },
      { n: 'L’addition, s’il vous plaît.', t: { fr: 'L’addition, s’il vous plaît.', en: 'The check, please.', es: 'La cuenta, por favor.', ht: 'Ladityon, tanpri.', de: 'Die Rechnung, bitte.', ru: 'Счёт, пожалуйста.', zh: '买单，谢谢。', ja: 'お会計をお願いします。' } },
      { n: 'Je peux payer par carte ?', t: { fr: 'Je peux payer par carte ?', en: 'Can I pay by card?', es: '¿Puedo pagar con tarjeta?', ht: 'Èske mwen ka peye pa kat?', de: 'Kann ich mit Karte zahlen?', ru: 'Можно оплатить картой?', zh: '我可以用卡支付吗？', ja: 'カードで支払えますか？' } },
      { n: 'Le service est inclus ?', t: { fr: 'Le service est inclus ?', en: 'Is service included?', es: '¿El servicio está incluido?', ht: 'Sèvis la enkli?', de: 'Ist der Service inbegriffen?', ru: 'Обслуживание включено?', zh: '服务费包含在内吗？', ja: 'サービス料は含まれていますか？' } },
      { n: 'C’est délicieux !', t: { fr: 'C’est délicieux !', en: 'It’s delicious!', es: '¡Está delicioso!', ht: 'Li bon anpil!', de: 'Es ist köstlich!', ru: 'Это вкусно!', zh: '真好吃！', ja: '美味しいです！' } },
      { n: 'Je n’aime pas ce plat.', t: { fr: 'Je n’aime pas ce plat.', en: 'I don’t like this dish.', es: 'No me gusta este plato.', ht: 'Mwen pa renmen plat sa a.', de: 'Ich mag dieses Gericht nicht.', ru: 'Мне не нравится это блюдо.', zh: '我不喜欢这道菜。', ja: 'この料理は好きではありません。' } },
      { n: 'Il y a une erreur sur l’addition.', t: { fr: 'Il y a une erreur sur l’addition.', en: 'There is a mistake on the bill.', es: 'Hay un error en la cuenta.', ht: 'Gen yon erè sou ladityon an.', de: 'Es gibt einen Fehler auf der Rechnung.', ru: 'В счёте ошибка.', zh: '账单有误。', ja: 'お会計に間違いがあります。' } },
      { n: 'Je voudrais un verre d’eau.', t: { fr: 'Je voudrais un verre d’eau.', en: 'I would like a glass of water.', es: 'Quisiera un vaso de agua.', ht: 'Mwen ta renmen yon vè dlo.', de: 'Ich hätte gerne ein Glas Wasser.', ru: 'Я хотел бы стакан воды.', zh: '我想要一杯水。', ja: '水を一杯ください。' } },
      { n: 'Un café, s’il vous plaît.', t: { fr: 'Un café, s’il vous plaît.', en: 'A coffee, please.', es: 'Un café, por favor.', ht: 'Yon kafe, tanpri.', de: 'Einen Kaffee, bitte.', ru: 'Кофе, пожалуйста.', zh: '请来一杯咖啡。', ja: 'コーヒーをお願いします。' } },
      { n: 'Un dessert, s’il vous plaît.', t: { fr: 'Un dessert, s’il vous plaît.', en: 'A dessert, please.', es: 'Un postre, por favor.', ht: 'Yon desè, tanpri.', de: 'Einen Nachtisch, bitte.', ru: 'Десерт, пожалуйста.', zh: '请来一份甜点。', ja: 'デザートをお願いします。' } },
      { n: 'À emporter, s’il vous plaît.', t: { fr: 'À emporter, s’il vous plaît.', en: 'To go, please.', es: 'Para llevar, por favor.', ht: 'Pou pote ale, tanpri.', de: 'Zum Mitnehmen, bitte.', ru: 'С собой, пожалуйста.', zh: '请打包。', ja: '持ち帰りでお願いします。' } },
      { n: 'Je voudrais réserver une table.', t: { fr: 'Je voudrais réserver une table.', en: 'I would like to book a table.', es: 'Quisiera reservar una mesa.', ht: 'Mwen ta renmen rezève yon tab.', de: 'Ich möchte einen Tisch reservieren.', ru: 'Я хотел бы забронировать столик.', zh: '我想预订一张桌子。', ja: 'テーブルを予約したいです。' } },
      { n: 'Pour ce soir à 20h.', t: { fr: 'Pour ce soir à 20h.', en: 'For tonight at 8 pm.', es: 'Para esta noche a las 8 pm.', ht: 'Pou aswè a a 8 pm.', de: 'Für heute Abend um 20 Uhr.', ru: 'На сегодня в 20:00.', zh: '今晚8点。', ja: '今夜の20時に。' } },
      { n: 'Nous sommes pressés.', t: { fr: 'Nous sommes pressés.', en: 'We are in a hurry.', es: 'Estamos apurados.', ht: 'Nou prese.', de: 'Wir haben es eilig.', ru: 'Мы спешим.', zh: '我们赶时间。', ja: '急いでいます。' } },
      { n: 'Merci, c’était parfait.', t: { fr: 'Merci, c’était parfait.', en: 'Thank you, it was perfect.', es: 'Gracias, estuvo perfecto.', ht: 'Mèsi, se te pafè.', de: 'Danke, es war perfekt.', ru: 'Спасибо, было прекрасно.', zh: '谢谢，完美极了。', ja: 'ありがとう、完璧でした。' } }
    ]
  },

  // 4. Voyages et transports (25 phrases)
  voyages: {
    icon: '✈️',
    fr: 'Voyages et transports',
    en: 'Travel and transport',
    es: 'Viajes y transportes',
    ht: 'Vwayaj ak transpò',
    de: 'Reisen und Transport',
    ru: 'Путешествия и транспорт',
    zh: '旅行和交通',
    ja: '旅行と交通',
    items: [
      { n: 'Où est la gare ?', t: { fr: 'Où est la gare ?', en: 'Where is the station?', es: '¿Dónde está la estación?', ht: 'Ki kote gare a?', de: 'Wo ist der Bahnhof?', ru: 'Где вокзал?', zh: '火车站在哪里？', ja: '駅はどこですか？' } },
      { n: 'Où se trouve l’aéroport ?', t: { fr: 'Où se trouve l’aéroport ?', en: 'Where is the airport?', es: '¿Dónde está el aeropuerto?', ht: 'Ki kote ayewopò a?', de: 'Wo ist der Flughafen?', ru: 'Где аэропорт?', zh: '机场在哪里？', ja: '空港はどこですか？' } },
      { n: 'Je cherche un taxi.', t: { fr: 'Je cherche un taxi.', en: 'I am looking for a taxi.', es: 'Busco un taxi.', ht: 'M ap chèche yon taksi.', de: 'Ich suche ein Taxi.', ru: 'Я ищу такси.', zh: '我在找出租车。', ja: 'タクシーを探しています。' } },
      { n: 'Combien coûte un billet pour Paris ?', t: { fr: 'Combien coûte un billet pour Paris ?', en: 'How much is a ticket to Paris?', es: '¿Cuánto cuesta un billete para París?', ht: 'Konbyen yon tikè pou Pari?', de: 'Wie viel kostet eine Fahrkarte nach Paris?', ru: 'Сколько стоит билет до Парижа?', zh: '去巴黎的票多少钱？', ja: 'パリへの切符はいくらですか？' } },
      { n: 'Un aller simple, s’il vous plaît.', t: { fr: 'Un aller simple, s’il vous plaît.', en: 'A one-way ticket, please.', es: 'Un billete de ida, por favor.', ht: 'Yon tikè ale senp, tanpri.', de: 'Eine einfache Fahrkarte, bitte.', ru: 'Билет в один конец, пожалуйста.', zh: '一张单程票，谢谢。', ja: '片道切符をお願いします。' } },
      { n: 'Un aller-retour, s’il vous plaît.', t: { fr: 'Un aller-retour, s’il vous plaît.', en: 'A round-trip ticket, please.', es: 'Un billete de ida y vuelta, por favor.', ht: 'Yon tikè ale-retou, tanpri.', de: 'Eine Hin- und Rückfahrkarte, bitte.', ru: 'Билет туда и обратно, пожалуйста.', zh: '一张往返票，谢谢。', ja: '往復切符をお願いします。' } },
      { n: 'À quelle heure part le train ?', t: { fr: 'À quelle heure part le train ?', en: 'What time does the train leave?', es: '¿A qué hora sale el tren?', ht: 'A ki lè tren an pati?', de: 'Wann fährt der Zug ab?', ru: 'Когда отправляется поезд?', zh: '火车几点出发？', ja: '電車は何時に出発しますか？' } },
      { n: 'Quel est le quai ?', t: { fr: 'Quel est le quai ?', en: 'Which platform?', es: '¿Qué andén?', ht: 'Ki la kè?', de: 'Welcher Bahnsteig?', ru: 'Какая платформа?', zh: '哪个站台？', ja: '何番線ですか？' } },
      { n: 'Ce bus va-t-il au centre-ville ?', t: { fr: 'Ce bus va-t-il au centre-ville ?', en: 'Does this bus go to downtown?', es: '¿Este bus va al centro?', ht: 'Èske otobis sa a ale nan sant vil la?', de: 'Fährt dieser Bus ins Stadtzentrum?', ru: 'Этот автобус идёт в центр?', zh: '这辆公交车去市中心吗？', ja: 'このバスは市内中心部に行きますか？' } },
      { n: 'Où dois-je descendre ?', t: { fr: 'Où dois-je descendre ?', en: 'Where should I get off?', es: '¿Dónde debo bajar?', ht: 'Ki kote mwen dwe desann?', de: 'Wo muss ich aussteigen?', ru: 'Где мне выходить?', zh: '我应该在哪里下车？', ja: 'どこで降りればいいですか？' } },
      { n: 'J’ai perdu mon passeport.', t: { fr: 'J’ai perdu mon passeport.', en: 'I lost my passport.', es: 'Perdí mi pasaporte.', ht: 'Mwen pèdi paspò mwen.', de: 'Ich habe meinen Pass verloren.', ru: 'Я потерял паспорт.', zh: '我丢了护照。', ja: 'パスポートをなくしました。' } },
      { n: 'Où se trouve l’ambassade ?', t: { fr: 'Où se trouve l’ambassade ?', en: 'Where is the embassy?', es: '¿Dónde está la embajada?', ht: 'Ki kote anbasad la?', de: 'Wo ist die Botschaft?', ru: 'Где посольство?', zh: '大使馆在哪里？', ja: '大使館はどこですか？' } },
      { n: 'Je voudrais louer une voiture.', t: { fr: 'Je voudrais louer une voiture.', en: 'I would like to rent a car.', es: 'Quisiera alquilar un coche.', ht: 'Mwen ta renmen lwe yon machin.', de: 'Ich möchte ein Auto mieten.', ru: 'Я хотел бы арендовать машину.', zh: '我想租一辆车。', ja: '車をレンタルしたいです。' } },
      { n: 'Où puis-je garer ma voiture ?', t: { fr: 'Où puis-je garer ma voiture ?', en: 'Where can I park my car?', es: '¿Dónde puedo aparcar mi coche?', ht: 'Ki kote mwen ka estasyon machin mwen?', de: 'Wo kann ich mein Auto parken?', ru: 'Где я могу припарковать машину?', zh: '我可以在哪里停车？', ja: 'どこに駐車できますか？' } },
      { n: 'Le vol est retardé.', t: { fr: 'Le vol est retardé.', en: 'The flight is delayed.', es: 'El vuelo está retrasado.', ht: 'Vòl la anreta.', de: 'Der Flug hat Verspätung.', ru: 'Рейс задерживается.', zh: '航班延误了。', ja: 'フライトが遅れています。' } },
      { n: 'Mon bagage est perdu.', t: { fr: 'Mon bagage est perdu.', en: 'My luggage is lost.', es: 'Mi equipaje está perdido.', ht: 'Bagaj mwen pèdi.', de: 'Mein Gepäck ist verloren.', ru: 'Мой багаж потерян.', zh: '我的行李丢了。', ja: '荷物が紛失しました。' } },
      { n: 'Y a-t-il une navette pour l’hôtel ?', t: { fr: 'Y a-t-il une navette pour l’hôtel ?', en: 'Is there a shuttle to the hotel?', es: '¿Hay un servicio de transporte al hotel?', ht: 'Èske gen yon navèt pou otèl la?', de: 'Gibt es einen Shuttle zum Hotel?', ru: 'Есть ли трансфер до отеля?', zh: '有去酒店的班车吗？', ja: 'ホテルへのシャトルはありますか？' } },
      { n: 'Je voudrais une chambre pour deux nuits.', t: { fr: 'Je voudrais une chambre pour deux nuits.', en: 'I would like a room for two nights.', es: 'Quisiera una habitación para dos noches.', ht: 'Mwen ta renmen yon chanm pou de nwit.', de: 'Ich hätte gerne ein Zimmer für zwei Nächte.', ru: 'Я хотел бы номер на две ночи.', zh: '我想要一间住两晚的房间。', ja: '二泊の部屋をお願いします。' } },
      { n: 'Le petit-déjeuner est inclus ?', t: { fr: 'Le petit-déjeuner est inclus ?', en: 'Is breakfast included?', es: '¿El desayuno está incluido?', ht: 'Matin manje a enkli?', de: 'Ist das Frühstück inbegriffen?', ru: 'Завтрак включён?', zh: '含早餐吗？', ja: '朝食は含まれていますか？' } },
      { n: 'Je veux visiter le musée.', t: { fr: 'Je veux visiter le musée.', en: 'I want to visit the museum.', es: 'Quiero visitar el museo.', ht: 'Mwen vle vizite mize a.', de: 'Ich möchte das Museum besuchen.', ru: 'Я хочу посетить музей.', zh: '我想参观博物馆。', ja: '美術館を訪れたいです。' } },
      { n: 'Où puis-je acheter des souvenirs ?', t: { fr: 'Où puis-je acheter des souvenirs ?', en: 'Where can I buy souvenirs?', es: '¿Dónde puedo comprar recuerdos?', ht: 'Ki kote mwen ka achte souvni?', de: 'Wo kann ich Souvenirs kaufen?', ru: 'Где можно купить сувениры?', zh: '我在哪里可以买纪念品？', ja: 'お土産はどこで買えますか？' } },
      { n: 'Parlez-vous anglais ?', t: { fr: 'Parlez-vous anglais ?', en: 'Do you speak English?', es: '¿Habla inglés?', ht: 'Èske ou pale angle?', de: 'Sprechen Sie Englisch?', ru: 'Вы говорите по-английски?', zh: '你会说英语吗？', ja: '英語を話せますか？' } },
      { n: 'Je ne parle pas français.', t: { fr: 'Je ne parle pas français.', en: 'I don’t speak French.', es: 'No hablo francés.', ht: 'Mwen pa pale franse.', de: 'Ich spreche kein Französisch.', ru: 'Я не говорю по-французски.', zh: '我不会说法语。', ja: 'フランス語は話せません。' } },
      { n: 'Pouvez-vous m’aider ?', t: { fr: 'Pouvez-vous m’aider ?', en: 'Can you help me?', es: '¿Puede ayudarme?', ht: 'Èske ou ka ede m?', de: 'Können Sie mir helfen?', ru: 'Вы можете мне помочь?', zh: '你能帮我吗？', ja: '手伝ってもらえますか？' } },
      { n: 'Merci pour votre aide.', t: { fr: 'Merci pour votre aide.', en: 'Thank you for your help.', es: 'Gracias por su ayuda.', ht: 'Mèsi pou èd ou.', de: 'Danke für Ihre Hilfe.', ru: 'Спасибо за помощь.', zh: '谢谢你的帮助。', ja: 'ご協力ありがとうございます。' } }
    ]
  },

  // 5. Météo (15 phrases)
  meteo: {
    icon: '🌤️',
    fr: 'Météo',
    en: 'Weather',
    es: 'Clima',
    ht: 'Meteo',
    de: 'Wetter',
    ru: 'Погода',
    zh: '天气',
    ja: '天気',
    items: [
      { n: 'Quel temps fait-il ?', t: { fr: 'Quel temps fait-il ?', en: 'What’s the weather like?', es: '¿Qué tiempo hace?', ht: 'Ki tan li fè?', de: 'Wie ist das Wetter?', ru: 'Какая погода?', zh: '天气怎么样？', ja: '天気はどうですか？' } },
      { n: 'Il fait beau.', t: { fr: 'Il fait beau.', en: 'It’s nice out.', es: 'Hace buen tiempo.', ht: 'Li bèl.', de: 'Es ist schön.', ru: 'Хорошая погода.', zh: '天气很好。', ja: '天気が良いです。' } },
      { n: 'Il fait mauvais.', t: { fr: 'Il fait mauvais.', en: 'The weather is bad.', es: 'Hace mal tiempo.', ht: 'Li move.', de: 'Das Wetter ist schlecht.', ru: 'Плохая погода.', zh: '天气不好。', ja: '天気が悪いです。' } },
      { n: 'Il pleut.', t: { fr: 'Il pleut.', en: 'It’s raining.', es: 'Está lloviendo.', ht: 'Lapli ap tonbe.', de: 'Es regnet.', ru: 'Идёт дождь.', zh: '下雨了。', ja: '雨が降っています。' } },
      { n: 'Il neige.', t: { fr: 'Il neige.', en: 'It’s snowing.', es: 'Está nevando.', ht: 'Nèj ap tonbe.', de: 'Es schneit.', ru: 'Идёт снег.', zh: '下雪了。', ja: '雪が降っています。' } },
      { n: 'Il y a du vent.', t: { fr: 'Il y a du vent.', en: 'It’s windy.', es: 'Hace viento.', ht: 'Gen van.', de: 'Es ist windig.', ru: 'Ветрено.', zh: '刮风了。', ja: '風が強いです。' } },
      { n: 'Il fait chaud.', t: { fr: 'Il fait chaud.', en: 'It’s hot.', es: 'Hace calor.', ht: 'Li cho.', de: 'Es ist heiß.', ru: 'Жарко.', zh: '天热。', ja: '暑いです。' } },
      { n: 'Il fait froid.', t: { fr: 'Il fait froid.', en: 'It’s cold.', es: 'Hace frío.', ht: 'Li frèt.', de: 'Es ist kalt.', ru: 'Холодно.', zh: '天冷。', ja: '寒いです。' } },
      { n: 'Il fait doux.', t: { fr: 'Il fait doux.', en: 'It’s mild.', es: 'Hace templado.', ht: 'Li dous.', de: 'Es ist mild.', ru: 'Мягкая погода.', zh: '天气温和。', ja: '過ごしやすいです。' } },
      { n: 'Il y a des nuages.', t: { fr: 'Il y a des nuages.', en: 'It’s cloudy.', es: 'Hay nubes.', ht: 'Gen nwaj.', de: 'Es ist bewölkt.', ru: 'Облачно.', zh: '多云。', ja: '曇っています。' } },
      { n: 'Il fait du soleil.', t: { fr: 'Il fait du soleil.', en: 'It’s sunny.', es: 'Hace sol.', ht: 'Li gen solèy.', de: 'Die Sonne scheint.', ru: 'Солнечно.', zh: '晴天。', ja: '晴れています。' } },
      { n: 'Il y a un orage.', t: { fr: 'Il y a un orage.', en: 'There’s a storm.', es: 'Hay tormenta.', ht: 'Gen tanpèt.', de: 'Es gibt ein Gewitter.', ru: 'Гроза.', zh: '有暴风雨。', ja: '嵐です。' } },
      { n: 'Il y a du brouillard.', t: { fr: 'Il y a du brouillard.', en: 'It’s foggy.', es: 'Hay niebla.', ht: 'Gen bwouya.', de: 'Es ist neblig.', ru: 'Туманно.', zh: '有雾。', ja: '霧がかかっています。' } },
      { n: 'Quelle température fait-il ?', t: { fr: 'Quelle température fait-il ?', en: 'What’s the temperature?', es: '¿Qué temperatura hace?', ht: 'Ki tanperati li ye?', de: 'Wie ist die Temperatur?', ru: 'Какая температура?', zh: '温度是多少？', ja: '気温は何度ですか？' } },
      { n: 'Il fait 25 degrés.', t: { fr: 'Il fait 25 degrés.', en: 'It’s 25 degrees.', es: 'Hace 25 grados.', ht: 'Li fè 25 degre.', de: 'Es sind 25 Grad.', ru: '25 градусов.', zh: '25度。', ja: '25度です。' } },
      { n: 'Le ciel est dégagé.', t: { fr: 'Le ciel est dégagé.', en: 'The sky is clear.', es: 'El cielo está despejado.', ht: 'Syèl la klè.', de: 'Der Himmel ist klar.', ru: 'Небо ясное.', zh: '天空晴朗。', ja: '空が晴れ渡っています。' } }
    ]
  },

  // 6. Achats et magasins (20 phrases)
  achats: {
    icon: '🛍️',
    fr: 'Achats',
    en: 'Shopping',
    es: 'Compras',
    ht: 'Achte',
    de: 'Einkaufen',
    ru: 'Покупки',
    zh: '购物',
    ja: '買い物',
    items: [
      { n: 'Combien ça coûte ?', t: { fr: 'Combien ça coûte ?', en: 'How much is it?', es: '¿Cuánto cuesta?', ht: 'Konbyen sa koute?', de: 'Wie viel kostet das?', ru: 'Сколько это стоит?', zh: '多少钱？', ja: 'いくらですか？' } },
      { n: 'C’est trop cher.', t: { fr: 'C’est trop cher.', en: 'It’s too expensive.', es: 'Es demasiado caro.', ht: 'Li twò chè.', de: 'Das ist zu teuer.', ru: 'Это слишком дорого.', zh: '太贵了。', ja: '高すぎます。' } },
      { n: 'Je cherche un cadeau.', t: { fr: 'Je cherche un cadeau.', en: 'I’m looking for a gift.', es: 'Busco un regalo.', ht: 'M ap chèche yon kado.', de: 'Ich suche ein Geschenk.', ru: 'Я ищу подарок.', zh: '我在找礼物。', ja: 'プレゼントを探しています。' } },
      { n: 'Je vais le prendre.', t: { fr: 'Je vais le prendre.', en: 'I’ll take it.', es: 'Me lo llevo.', ht: 'Mwen pral pran l.', de: 'Ich nehme es.', ru: 'Я возьму это.', zh: '我买这个。', ja: 'これにします。' } },
      { n: 'Puis-je essayer ?', t: { fr: 'Puis-je essayer ?', en: 'Can I try it on?', es: '¿Puedo probármelo?', ht: 'Èske mwen ka eseye?', de: 'Kann ich es anprobieren?', ru: 'Можно примерить?', zh: '我可以试穿吗？', ja: '試着できますか？' } },
      { n: 'Quelle est votre taille ?', t: { fr: 'Quelle est votre taille ?', en: 'What is your size?', es: '¿Cuál es su talla?', ht: 'Ki gwosè ou?', de: 'Welche Größe haben Sie?', ru: 'Какой у вас размер?', zh: '您穿多大码？', ja: 'サイズは何ですか？' } },
      { n: 'Vous acceptez la carte bancaire ?', t: { fr: 'Vous acceptez la carte bancaire ?', en: 'Do you accept credit card?', es: '¿Aceptan tarjeta?', ht: 'Èske ou aksepte kat kredi?', de: 'Akzeptieren Sie Kreditkarte?', ru: 'Вы принимаете карты?', zh: '你们接受信用卡吗？', ja: 'クレジットカードは使えますか？' } },
      { n: 'Je voudrais un reçu.', t: { fr: 'Je voudrais un reçu.', en: 'I would like a receipt.', es: 'Quisiera un recibo.', ht: 'Mwen ta renmen yon resi.', de: 'Ich hätte gerne eine Quittung.', ru: 'Мне нужен чек.', zh: '我想要收据。', ja: '領収書をお願いします。' } },
      { n: 'Puis-je avoir un sac ?', t: { fr: 'Puis-je avoir un sac ?', en: 'Can I have a bag?', es: '¿Puedo tener una bolsa?', ht: 'Èske mwen ka gen yon sak?', de: 'Kann ich eine Tüte haben?', ru: 'Можно пакет?', zh: '能给我一个袋子吗？', ja: '袋をいただけますか？' } },
      { n: 'Où sont les cabines d’essayage ?', t: { fr: 'Où sont les cabines d’essayage ?', en: 'Where are the fitting rooms?', es: '¿Dónde están los probadores?', ht: 'Ki kote kabin esèyaj yo?', de: 'Wo sind die Umkleidekabinen?', ru: 'Где примерочные?', zh: '试衣间在哪里？', ja: '試着室はどこですか？' } },
      { n: 'Je cherche une taille S.', t: { fr: 'Je cherche une taille S.', en: 'I’m looking for a size S.', es: 'Busco una talla S.', ht: 'M ap chèche yon gwosè S.', de: 'Ich suche Größe S.', ru: 'Мне нужен размер S.', zh: '我在找小号。', ja: 'Sサイズを探しています。' } },
      { n: 'Avez-vous ceci en bleu ?', t: { fr: 'Avez-vous ceci en bleu ?', en: 'Do you have this in blue?', es: '¿Tiene esto en azul?', ht: 'Èske ou gen sa a an ble?', de: 'Haben Sie das in Blau?', ru: 'У вас есть это синего цвета?', zh: '你们有蓝色的吗？', ja: 'これは青色でありますか？' } },
      { n: 'C’est en solde.', t: { fr: 'C’est en solde.', en: 'It’s on sale.', es: 'Está en oferta.', ht: 'Li nan likidasyon.', de: 'Es ist im Angebot.', ru: 'Это со скидкой.', zh: '打折了。', ja: 'セール中です。' } },
      { n: 'Quel est votre meilleur prix ?', t: { fr: 'Quel est votre meilleur prix ?', en: 'What’s your best price?', es: '¿Cuál es su mejor precio?', ht: 'Ki pi bon pri ou?', de: 'Was ist Ihr bester Preis?', ru: 'Какая у вас лучшая цена?', zh: '最低多少钱？', ja: '一番安い値段はいくらですか？' } },
      { n: 'Je peux payer en espèces.', t: { fr: 'Je peux payer en espèces.', en: 'I can pay in cash.', es: 'Puedo pagar en efectivo.', ht: 'Mwen ka peye an kach.', de: 'Ich kann bar bezahlen.', ru: 'Могу заплатить наличными.', zh: '我可以付现金。', ja: '現金で支払えます。' } },
      { n: 'Je voudrais échanger cet article.', t: { fr: 'Je voudrais échanger cet article.', en: 'I would like to exchange this item.', es: 'Quisiera cambiar este artículo.', ht: 'Mwen ta renmen chanje atik sa a.', de: 'Ich möchte diesen Artikel umtauschen.', ru: 'Я хотел бы обменять этот товар.', zh: '我想换这件商品。', ja: 'この商品を交換したいです。' } },
      { n: 'Puis-je avoir un remboursement ?', t: { fr: 'Puis-je avoir un remboursement ?', en: 'Can I get a refund?', es: '¿Puedo obtener un reembolso?', ht: 'Èske mwen ka gen yon ranbousman?', de: 'Kann ich eine Rückerstattung bekommen?', ru: 'Можно вернуть деньги?', zh: '可以退款吗？', ja: '返金してもらえますか？' } },
      { n: 'J’ai perdu mon ticket de caisse.', t: { fr: 'J’ai perdu mon ticket de caisse.', en: 'I lost my receipt.', es: 'Perdí mi ticket.', ht: 'Mwen pèdi tikè kès mwen.', de: 'Ich habe meinen Kassenbon verloren.', ru: 'Я потерял чек.', zh: '我丢了收据。', ja: 'レシートをなくしました。' } },
      { n: 'Quand fermez-vous ?', t: { fr: 'Quand fermez-vous ?', en: 'What time do you close?', es: '¿A qué hora cierran?', ht: 'Ki lè ou fèmen?', de: 'Wann schließen Sie?', ru: 'Во сколько вы закрываетесь?', zh: '你们几点关门？', ja: '何時に閉まりますか？' } },
      { n: 'Merci, bonne journée !', t: { fr: 'Merci, bonne journée !', en: 'Thank you, have a nice day!', es: 'Gracias, ¡buen día!', ht: 'Mèsi, bòn jounen!', de: 'Danke, schönen Tag!', ru: 'Спасибо, хорошего дня!', zh: '谢谢，祝您一天愉快！', ja: 'ありがとう、良い一日を！' } }
    ]
  },

  // 7. Santé et urgences (20 phrases)
  sante_urgences: {
    icon: '🏥',
    fr: 'Santé et urgences',
    en: 'Health and emergencies',
    es: 'Salud y emergencias',
    ht: 'Sante ak ijans',
    de: 'Gesundheit und Notfälle',
    ru: 'Здоровье и чрезвычайные ситуации',
    zh: '健康和紧急情况',
    ja: '健康と緊急事態',
    items: [
      { n: 'Je ne me sens pas bien.', t: { fr: 'Je ne me sens pas bien.', en: 'I don’t feel well.', es: 'No me siento bien.', ht: 'Mwen pa santi m byen.', de: 'Ich fühle mich nicht wohl.', ru: 'Я плохо себя чувствую.', zh: '我感觉不舒服。', ja: '気分が悪いです。' } },
      { n: 'J’ai mal à la tête.', t: { fr: 'J’ai mal à la tête.', en: 'I have a headache.', es: 'Me duele la cabeza.', ht: 'Tèt mwen fè m mal.', de: 'Ich habe Kopfschmerzen.', ru: 'У меня болит голова.', zh: '我头痛。', ja: '頭が痛いです。' } },
      { n: 'J’ai de la fièvre.', t: { fr: 'J’ai de la fièvre.', en: 'I have a fever.', es: 'Tengo fiebre.', ht: 'Mwen gen lafyèv.', de: 'Ich habe Fieber.', ru: 'У меня температура.', zh: '我发烧了。', ja: '熱があります。' } },
      { n: 'J’ai mal au ventre.', t: { fr: 'J’ai mal au ventre.', en: 'I have a stomachache.', es: 'Me duele el estómago.', ht: 'Vant mwen fè m mal.', de: 'Ich habe Bauchschmerzen.', ru: 'У меня болит живот.', zh: '我肚子痛。', ja: 'お腹が痛いです。' } },
      { n: 'J’ai mal à la gorge.', t: { fr: 'J’ai mal à la gorge.', en: 'I have a sore throat.', es: 'Me duele la garganta.', ht: 'Gòj mwen fè m mal.', de: 'Ich habe Halsschmerzen.', ru: 'У меня болит горло.', zh: '我喉咙痛。', ja: '喉が痛いです。' } },
      { n: 'Je suis allergique aux arachides.', t: { fr: 'Je suis allergique aux arachides.', en: 'I am allergic to peanuts.', es: 'Soy alérgico a los cacahuetes.', ht: 'Mwen alèjik ak pistach.', de: 'Ich bin allergisch gegen Erdnüsse.', ru: 'У меня аллергия на арахис.', zh: '我对花生过敏。', ja: 'ピーナッツアレルギーです。' } },
      { n: 'Appelez une ambulance !', t: { fr: 'Appelez une ambulance !', en: 'Call an ambulance!', es: '¡Llame a una ambulancia!', ht: 'Rele yon anbilans!', de: 'Rufen Sie einen Krankenwagen!', ru: 'Вызовите скорую!', zh: '叫救护车！', ja: '救急車を呼んでください！' } },
      { n: 'Où est l’hôpital le plus proche ?', t: { fr: 'Où est l’hôpital le plus proche ?', en: 'Where is the nearest hospital?', es: '¿Dónde está el hospital más cercano?', ht: 'Ki kote lopital ki pi pre a?', de: 'Wo ist das nächste Krankenhaus?', ru: 'Где ближайшая больница?', zh: '最近的医院在哪里？', ja: '最寄りの病院はどこですか？' } },
      { n: 'J’ai besoin d’un médecin.', t: { fr: 'J’ai besoin d’un médecin.', en: 'I need a doctor.', es: 'Necesito un médico.', ht: 'Mwen bezwen yon doktè.', de: 'Ich brauche einen Arzt.', ru: 'Мне нужен врач.', zh: '我需要医生。', ja: '医者が必要です。' } },
      { n: 'Où est la pharmacie ?', t: { fr: 'Où est la pharmacie ?', en: 'Where is the pharmacy?', es: '¿Dónde está la farmacia?', ht: 'Ki kote famasi a?', de: 'Wo ist die Apotheke?', ru: 'Где аптека?', zh: '药店在哪里？', ja: '薬局はどこですか？' } },
      { n: 'Je dois prendre ce médicament.', t: { fr: 'Je dois prendre ce médicament.', en: 'I have to take this medicine.', es: 'Debo tomar este medicamento.', ht: 'Mwen dwe pran medikaman sa a.', de: 'Ich muss dieses Medikament nehmen.', ru: 'Я должен принять это лекарство.', zh: '我必须吃这个药。', ja: 'この薬を飲まなければなりません。' } },
      { n: 'J’ai une ordonnance.', t: { fr: 'J’ai une ordonnance.', en: 'I have a prescription.', es: 'Tengo una receta.', ht: 'Mwen gen yon òdonans.', de: 'Ich habe ein Rezept.', ru: 'У меня есть рецепт.', zh: '我有处方。', ja: '処方箋があります。' } },
      { n: 'Appelez la police !', t: { fr: 'Appelez la police !', en: 'Call the police!', es: '¡Llame a la policía!', ht: 'Rele lapolis!', de: 'Rufen Sie die Polizei!', ru: 'Вызовите полицию!', zh: '叫警察！', ja: '警察を呼んでください！' } },
      { n: 'Je suis perdu(e).', t: { fr: 'Je suis perdu(e).', en: 'I am lost.', es: 'Estoy perdido/a.', ht: 'Mwen pèdi.', de: 'Ich habe mich verlaufen.', ru: 'Я потерялся/потерялась.', zh: '我迷路了。', ja: '道に迷いました。' } },
      { n: 'Pouvez-vous m’indiquer le chemin ?', t: { fr: 'Pouvez-vous m’indiquer le chemin ?', en: 'Can you show me the way?', es: '¿Puede indicarme el camino?', ht: 'Èske ou ka endike m chemen an?', de: 'Können Sie mir den Weg zeigen?', ru: 'Вы можете показать мне дорогу?', zh: '你能给我指路吗？', ja: '道を教えてもらえますか？' } },
      { n: 'Je cherche la sortie.', t: { fr: 'Je cherche la sortie.', en: 'I’m looking for the exit.', es: 'Busco la salida.', ht: 'M ap chèche sòti a.', de: 'Ich suche den Ausgang.', ru: 'Я ищу выход.', zh: '我在找出口。', ja: '出口を探しています。' } },
      { n: 'Attention, danger !', t: { fr: 'Attention, danger !', en: 'Caution, danger!', es: '¡Cuidado, peligro!', ht: 'Atansyon, danje!', de: 'Achtung, Gefahr!', ru: 'Осторожно, опасно!', zh: '小心，危险！', ja: '危険、注意！' } },
      { n: 'Au secours !', t: { fr: 'Au secours !', en: 'Help!', es: '¡Socorro!', ht: 'Anmwe!', de: 'Hilfe!', ru: 'Помогите!', zh: '救命！', ja: '助けて！' } },
      { n: 'Il y a un incendie.', t: { fr: 'Il y a un incendie.', en: 'There is a fire.', es: 'Hay un incendio.', ht: 'Gen yon dife.', de: 'Es gibt ein Feuer.', ru: 'Пожар!', zh: '着火了。', ja: '火事です。' } },
      { n: 'Tout va bien, merci.', t: { fr: 'Tout va bien, merci.', en: 'Everything is fine, thanks.', es: 'Todo está bien, gracias.', ht: 'Tout byen, mèsi.', de: 'Alles ist gut, danke.', ru: 'Всё хорошо, спасибо.', zh: '一切都好，谢谢。', ja: 'すべて大丈夫です、ありがとう。' } }
    ]
  },

  // 8. Travail et école (20 phrases)
  travail_ecole: {
    icon: '💼',
    fr: 'Travail et école',
    en: 'Work and school',
    es: 'Trabajo y escuela',
    ht: 'Travay ak lekòl',
    de: 'Arbeit und Schule',
    ru: 'Работа и школа',
    zh: '工作和学校',
    ja: '仕事と学校',
    items: [
      { n: 'Quel est votre métier ?', t: { fr: 'Quel est votre métier ?', en: 'What is your job?', es: '¿Cuál es su profesión?', ht: 'Ki travay ou fè?', de: 'Was ist Ihr Beruf?', ru: 'Кем вы работаете?', zh: '您做什么工作？', ja: 'お仕事は何ですか？' } },
      { n: 'Je suis étudiant(e).', t: { fr: 'Je suis étudiant(e).', en: 'I am a student.', es: 'Soy estudiante.', ht: 'Mwen se etidyan.', de: 'Ich bin Student/in.', ru: 'Я студент/студентка.', zh: '我是学生。', ja: '私は学生です。' } },
      { n: 'Je cherche un emploi.', t: { fr: 'Je cherche un emploi.', en: 'I am looking for a job.', es: 'Busco empleo.', ht: 'M ap chèche yon travay.', de: 'Ich suche einen Job.', ru: 'Я ищу работу.', zh: '我在找工作。', ja: '仕事を探しています。' } },
      { n: 'Je travaille dans un bureau.', t: { fr: 'Je travaille dans un bureau.', en: 'I work in an office.', es: 'Trabajo en una oficina.', ht: 'Mwen travay nan yon biwo.', de: 'Ich arbeite in einem Büro.', ru: 'Я работаю в офисе.', zh: '我在办公室工作。', ja: '私はオフィスで働いています。' } },
      { n: 'À quelle heure commencez-vous ?', t: { fr: 'À quelle heure commencez-vous ?', en: 'What time do you start?', es: '¿A qué hora empiezas?', ht: 'A ki lè ou komanse?', de: 'Wann fangen Sie an?', ru: 'Во сколько вы начинаете?', zh: '你几点开始？', ja: '何時に始まりますか？' } },
      { n: 'Je finis à 17h.', t: { fr: 'Je finis à 17h.', en: 'I finish at 5 pm.', es: 'Termino a las 5 pm.', ht: 'Mwen fini a 5 pm.', de: 'Ich habe um 17 Uhr Feierabend.', ru: 'Я заканчиваю в 17:00.', zh: '我五点下班。', ja: '17時に終わります。' } },
      { n: 'Nous avons une réunion.', t: { fr: 'Nous avons une réunion.', en: 'We have a meeting.', es: 'Tenemos una reunión.', ht: 'Nou gen yon reyinyon.', de: 'Wir haben eine Besprechung.', ru: 'У нас собрание.', zh: '我们有个会议。', ja: '会議があります。' } },
      { n: 'Je suis en vacances.', t: { fr: 'Je suis en vacances.', en: 'I am on vacation.', es: 'Estoy de vacaciones.', ht: 'Mwen nan vakans.', de: 'Ich bin im Urlaub.', ru: 'Я в отпуске.', zh: '我在度假。', ja: '休暇中です。' } },
      { n: 'J’ai un examen demain.', t: { fr: 'J’ai un examen demain.', en: 'I have an exam tomorrow.', es: 'Tengo un examen mañana.', ht: 'Mwen gen yon egzamen demen.', de: 'Ich habe morgen eine Prüfung.', ru: 'У меня завтра экзамен.', zh: '我明天有考试。', ja: '明日試験があります。' } },
      { n: 'Je dois réviser.', t: { fr: 'Je dois réviser.', en: 'I have to study.', es: 'Debo estudiar.', ht: 'Mwen dwe revize.', de: 'Ich muss lernen.', ru: 'Я должен повторять.', zh: '我必须复习。', ja: '復習しなければなりません。' } },
      { n: 'Quelle est votre matière préférée ?', t: { fr: 'Quelle est votre matière préférée ?', en: 'What is your favorite subject?', es: '¿Cuál es tu materia favorita?', ht: 'Ki matyè ou pi renmen?', de: 'Was ist dein Lieblingsfach?', ru: 'Какой твой любимый предмет?', zh: '你最喜欢的科目是什么？', ja: '好きな科目は何ですか？' } },
      { n: 'J’aime les maths.', t: { fr: 'J’aime les maths.', en: 'I like math.', es: 'Me gustan las matemáticas.', ht: 'Mwen renmen matematik.', de: 'Ich mag Mathe.', ru: 'Я люблю математику.', zh: '我喜欢数学。', ja: '数学が好きです。' } },
      { n: 'Le professeur explique bien.', t: { fr: 'Le professeur explique bien.', en: 'The teacher explains well.', es: 'El profesor explica bien.', ht: 'Pwofesè a eksplike byen.', de: 'Der Lehrer erklärt gut.', ru: 'Учитель хорошо объясняет.', zh: '老师讲得好。', ja: '先生は上手に説明します。' } },
      { n: 'J’ai oublié mon cahier.', t: { fr: 'J’ai oublié mon cahier.', en: 'I forgot my notebook.', es: 'Olvidé mi cuaderno.', ht: 'Mwen bliye kaye mwen.', de: 'Ich habe mein Heft vergessen.', ru: 'Я забыл свою тетрадь.', zh: '我忘了带笔记本。', ja: 'ノートを忘れました。' } },
      { n: 'Puis-je emprunter un stylo ?', t: { fr: 'Puis-je emprunter un stylo ?', en: 'Can I borrow a pen?', es: '¿Puedo tomar prestado un bolígrafo?', ht: 'Èske mwen ka prete yon stylo?', de: 'Kann ich einen Stift ausleihen?', ru: 'Можно взять ручку?', zh: '我可以借支笔吗？', ja: 'ペンを借りてもいいですか？' } },
      { n: 'Je suis en retard.', t: { fr: 'Je suis en retard.', en: 'I am late.', es: 'Llego tarde.', ht: 'Mwen an reta.', de: 'Ich bin zu spät.', ru: 'Я опоздал.', zh: '我迟到了。', ja: '遅れました。' } },
      { n: 'J’ai réussi mon examen.', t: { fr: 'J’ai réussi mon examen.', en: 'I passed my exam.', es: 'Aprobé mi examen.', ht: 'Mwen te reyisi egzamen mwen an.', de: 'Ich habe meine Prüfung bestanden.', ru: 'Я сдал экзамен.', zh: '我通过了考试。', ja: '試験に合格しました。' } },
      { n: 'Je n’ai pas compris.', t: { fr: 'Je n’ai pas compris.', en: 'I didn’t understand.', es: 'No entendí.', ht: 'Mwen pa te konprann.', de: 'Ich habe nicht verstanden.', ru: 'Я не понял.', zh: '我没听懂。', ja: '理解できませんでした。' } },
      { n: 'Pouvez-vous répéter ?', t: { fr: 'Pouvez-vous répéter ?', en: 'Can you repeat?', es: '¿Puede repetir?', ht: 'Èske ou ka repete?', de: 'Können Sie wiederholen?', ru: 'Повторите, пожалуйста.', zh: '你能再说一遍吗？', ja: 'もう一度言ってください。' } },
      { n: 'Bon courage pour ton examen !', t: { fr: 'Bon courage pour ton examen !', en: 'Good luck with your exam!', es: '¡Mucha suerte en tu examen!', ht: 'Bon kouraj pou egzamen ou!', de: 'Viel Glück bei deiner Prüfung!', ru: 'Удачи на экзамене!', zh: '祝你考试顺利！', ja: '試験頑張って！' } }
    ]
  },

  // 9. Famille et amis (15 phrases)
  famille_amis: {
    icon: '👨‍👩‍👧‍👦',
    fr: 'Famille et amis',
    en: 'Family and friends',
    es: 'Familia y amigos',
    ht: 'Fanmi ak zanmi',
    de: 'Familie und Freunde',
    ru: 'Семья и друзья',
    zh: '家人和朋友',
    ja: '家族と友達',
    items: [
      { n: 'Voici mon père.', t: { fr: 'Voici mon père.', en: 'This is my father.', es: 'Este es mi padre.', ht: 'Men papa m.', de: 'Das ist mein Vater.', ru: 'Это мой отец.', zh: '这是我的父亲。', ja: 'こちらは私の父です。' } },
      { n: 'Elle est ma mère.', t: { fr: 'Elle est ma mère.', en: 'She is my mother.', es: 'Ella es mi madre.', ht: 'Li se manman m.', de: 'Sie ist meine Mutter.', ru: 'Это моя мать.', zh: '她是我的母亲。', ja: '彼女は私の母です。' } },
      { n: 'J’ai un frère et une sœur.', t: { fr: 'J’ai un frère et une sœur.', en: 'I have a brother and a sister.', es: 'Tengo un hermano y una hermana.', ht: 'Mwen gen yon frè ak yon sè.', de: 'Ich habe einen Bruder und eine Schwester.', ru: 'У меня есть брат и сестра.', zh: '我有一个兄弟和一个姐妹。', ja: '私には兄と姉がいます。' } },
      { n: 'Je suis marié(e).', t: { fr: 'Je suis marié(e).', en: 'I am married.', es: 'Estoy casado/a.', ht: 'Mwen marye.', de: 'Ich bin verheiratet.', ru: 'Я женат/замужем.', zh: '我结婚了。', ja: '私は結婚しています。' } },
      { n: 'Voici mon époux / mon épouse.', t: { fr: 'Voici mon époux / mon épouse.', en: 'This is my husband / wife.', es: 'Este es mi esposo / esta es mi esposa.', ht: 'Men mari m / madanm m.', de: 'Das ist mein Ehemann / meine Ehefrau.', ru: 'Это мой муж / моя жена.', zh: '这是我的丈夫/妻子。', ja: 'こちらは私の夫/妻です。' } },
      { n: 'Nous avons deux enfants.', t: { fr: 'Nous avons deux enfants.', en: 'We have two children.', es: 'Tenemos dos hijos.', ht: 'Nou gen de timoun.', de: 'Wir haben zwei Kinder.', ru: 'У нас двое детей.', zh: '我们有两个孩子。', ja: '私たちには二人の子供がいます。' } },
      { n: 'Je suis célibataire.', t: { fr: 'Je suis célibataire.', en: 'I am single.', es: 'Soy soltero/a.', ht: 'Mwen selibatè.', de: 'Ich bin ledig.', ru: 'Я холост/не замужем.', zh: '我单身。', ja: '私は独身です。' } },
      { n: 'C’est mon meilleur ami.', t: { fr: 'C’est mon meilleur ami.', en: 'This is my best friend.', es: 'Es mi mejor amigo.', ht: 'Se pi bon zanmi m.', de: 'Das ist mein bester Freund.', ru: 'Это мой лучший друг.', zh: '这是我最好的朋友。', ja: 'こちらは私の親友です。' } },
      { n: 'On se voit ce week-end ?', t: { fr: 'On se voit ce week-end ?', en: 'Shall we meet this weekend?', es: '¿Nos vemos este fin de semana?', ht: 'Nou wè nan wikenn sa a?', de: 'Sehen wir uns dieses Wochenende?', ru: 'Увидимся в эти выходные?', zh: '这个周末见？', ja: '今週末会いましょうか？' } },
      { n: 'Je t’invite au restaurant.', t: { fr: 'Je t’invite au restaurant.', en: 'I invite you to the restaurant.', es: 'Te invito al restaurante.', ht: 'Mwen envite ou nan restoran.', de: 'Ich lade dich ins Restaurant ein.', ru: 'Я приглашаю тебя в ресторан.', zh: '我请你吃饭。', ja: 'レストランに招待します。' } },
      { n: 'Tu me manques.', t: { fr: 'Tu me manques.', en: 'I miss you.', es: 'Te extraño.', ht: 'Ou manke m.', de: 'Du fehlst mir.', ru: 'Я скучаю по тебе.', zh: '我想你。', ja: 'あなたがいなくて寂しいです。' } },
      { n: 'Je t’aime.', t: { fr: 'Je t’aime.', en: 'I love you.', es: 'Te quiero.', ht: 'Mwen renmen ou.', de: 'Ich liebe dich.', ru: 'Я тебя люблю.', zh: '我爱你。', ja: '愛しています。' } },
      { n: 'Fais un bisou à maman.', t: { fr: 'Fais un bisou à maman.', en: 'Give mom a kiss.', es: 'Dale un beso a mamá.', ht: 'Bo manman.', de: 'Gib Mama einen Kuss.', ru: 'Поцелуй маму.', zh: '亲一下妈妈。', ja: 'ママにキスして。' } },
      { n: 'Je suis fier/fière de toi.', t: { fr: 'Je suis fier/fière de toi.', en: 'I am proud of you.', es: 'Estoy orgulloso/a de ti.', ht: 'Mwen fyè de ou.', de: 'Ich bin stolz auf dich.', ru: 'Я горжусь тобой.', zh: '我为你骄傲。', ja: 'あなたを誇りに思います。' } },
      { n: 'Passe le bonjour à ta famille.', t: { fr: 'Passe le bonjour à ta famille.', en: 'Say hello to your family.', es: 'Dale saludos a tu familia.', ht: 'Di bonjou nan fanmi w.', de: 'Grüß deine Familie.', ru: 'Передай привет своей семье.', zh: '代我向你的家人问好。', ja: 'ご家族によろしくお伝えください。' } }
    ]
  },

  // 10. Animaux (10 phrases)
  animaux: {
    icon: '🐕',
    fr: 'Animaux',
    en: 'Animals',
    es: 'Animales',
    ht: 'Bèt',
    de: 'Tiere',
    ru: 'Животные',
    zh: '动物',
    ja: '動物',
    items: [
      { n: 'J’ai un chien.', t: { fr: 'J’ai un chien.', en: 'I have a dog.', es: 'Tengo un perro.', ht: 'Mwen gen yon chen.', de: 'Ich habe einen Hund.', ru: 'У меня есть собака.', zh: '我有一只狗。', ja: '犬を飼っています。' } },
      { n: 'Mon chat est noir.', t: { fr: 'Mon chat est noir.', en: 'My cat is black.', es: 'Mi gato es negro.', ht: 'Chat mwen an nwa.', de: 'Meine Katze ist schwarz.', ru: 'Моя кошка чёрная.', zh: '我的猫是黑色的。', ja: '私の猫は黒いです。' } },
      { n: 'Les oiseaux chantent.', t: { fr: 'Les oiseaux chantent.', en: 'Birds sing.', es: 'Los pájaros cantan.', ht: 'Zwazo yo chante.', de: 'Vögel singen.', ru: 'Птицы поют.', zh: '鸟儿歌唱。', ja: '鳥が歌います。' } },
      { n: 'J’aime les chevaux.', t: { fr: 'J’aime les chevaux.', en: 'I like horses.', es: 'Me gustan los caballos.', ht: 'Mwen renmen chwal yo.', de: 'Ich mag Pferde.', ru: 'Мне нравятся лошади.', zh: '我喜欢马。', ja: '馬が好きです。' } },
      { n: 'Le poisson nage dans l’eau.', t: { fr: 'Le poisson nage dans l’eau.', en: 'The fish swims in water.', es: 'El pez nada en el agua.', ht: 'Pwason an naje nan dlo.', de: 'Der Fisch schwimmt im Wasser.', ru: 'Рыба плавает в воде.', zh: '鱼在水里游。', ja: '魚は水の中で泳ぎます。' } },
      { n: 'J’ai peur des serpents.', t: { fr: 'J’ai peur des serpents.', en: 'I am afraid of snakes.', es: 'Tengo miedo de las serpientes.', ht: 'Mwen pè koulèv.', de: 'Ich habe Angst vor Schlangen.', ru: 'Я боюсь змей.', zh: '我怕蛇。', ja: 'ヘビが怖いです。' } },
      { n: 'Les abeilles font du miel.', t: { fr: 'Les abeilles font du miel.', en: 'Bees make honey.', es: 'Las abejas hacen miel.', ht: 'Myèl yo fè siwo myèl.', de: 'Bienen machen Honig.', ru: 'Пчёлы делают мёд.', zh: '蜜蜂酿蜜。', ja: 'ミツバチは蜂蜜を作ります。' } },
      { n: 'Mon lapin est mignon.', t: { fr: 'Mon lapin est mignon.', en: 'My rabbit is cute.', es: 'Mi conejo es lindo.', ht: 'Lapen mwen an bèl.', de: 'Mein Hase ist süß.', ru: 'Мой кролик милый.', zh: '我的兔子很可爱。', ja: '私のウサギはかわいいです。' } },
      { n: 'Nous allons au zoo.', t: { fr: 'Nous allons au zoo.', en: 'We are going to the zoo.', es: 'Vamos al zoo.', ht: 'Nou pral nan zou a.', de: 'Wir gehen in den Zoo.', ru: 'Мы идём в зоопарк.', zh: '我们去动物园。', ja: '動物園に行きます。' } },
      { n: 'Les lions sont dangereux.', t: { fr: 'Les lions sont dangereux.', en: 'Lions are dangerous.', es: 'Los leones son peligrosos.', ht: 'Lyonyo yo danjere.', de: 'Löwen sind gefährlich.', ru: 'Львы опасны.', zh: '狮子很危险。', ja: 'ライオンは危険です。' } }
    ]
  },

  // 11. Expressions courantes additionnelles (25 phrases)
  expressions_courantes: {
    icon: '💬',
    fr: 'Expressions courantes',
    en: 'Common expressions',
    es: 'Expresiones comunes',
    ht: 'Ekspresyon komen',
    de: 'Häufige Ausdrücke',
    ru: 'Распространённые выражения',
    zh: '常用表达',
    ja: 'よく使う表現',
    items: [
      { n: 'Bien sûr.', t: { fr: 'Bien sûr.', en: 'Of course.', es: 'Por supuesto.', ht: 'Natirèlman.', de: 'Natürlich.', ru: 'Конечно.', zh: '当然。', ja: 'もちろん。' } },
      { n: 'Pas de problème.', t: { fr: 'Pas de problème.', en: 'No problem.', es: 'No hay problema.', ht: 'Pa gen pwoblèm.', de: 'Kein Problem.', ru: 'Без проблем.', zh: '没问题。', ja: '問題ありません。' } },
      { n: 'Tout à fait.', t: { fr: 'Tout à fait.', en: 'Exactly.', es: 'Exactamente.', ht: 'Totalman.', de: 'Genau.', ru: 'Совершенно верно.', zh: '完全正确。', ja: 'その通りです。' } },
      { n: 'Je suis d’accord.', t: { fr: 'Je suis d’accord.', en: 'I agree.', es: 'Estoy de acuerdo.', ht: 'Mwen dakò.', de: 'Ich stimme zu.', ru: 'Я согласен.', zh: '我同意。', ja: '賛成です。' } },
      { n: 'Ce n’est pas vrai.', t: { fr: 'Ce n’est pas vrai.', en: 'It’s not true.', es: 'No es verdad.', ht: 'Se pa vre.', de: 'Das ist nicht wahr.', ru: 'Это неправда.', zh: '这不是真的。', ja: 'それは本当ではありません。' } },
      { n: 'C’est génial !', t: { fr: 'C’est génial !', en: 'That’s great!', es: '¡Es genial!', ht: 'Li jeni al!', de: 'Das ist toll!', ru: 'Это здорово!', zh: '太棒了！', ja: '素晴らしい！' } },
      { n: 'C’est nul.', t: { fr: 'C’est nul.', en: 'It sucks.', es: 'Es malo.', ht: 'Li nul.', de: 'Das ist doof.', ru: 'Отстой.', zh: '真糟糕。', ja: '最悪です。' } },
      { n: 'Je m’en fiche.', t: { fr: 'Je m’en fiche.', en: 'I don’t care.', es: 'Me da igual.', ht: 'Mwen pa gen pwoblèm.', de: 'Das ist mir egal.', ru: 'Мне всё равно.', zh: '我不在乎。', ja: '気にしない。' } },
      { n: 'Laisse tomber.', t: { fr: 'Laisse tomber.', en: 'Forget it.', es: 'Déjalo.', ht: 'Kite tonbe.', de: 'Lass es sein.', ru: 'Забудь.', zh: '算了。', ja: 'やめなさい。' } },
      { n: 'Tant pis.', t: { fr: 'Tant pis.', en: 'Too bad.', es: 'Qué pena.', ht: 'Tant pi.', de: 'Schade.', ru: 'Жаль.', zh: '可惜。', ja: '残念。' } },
      { n: 'Tant mieux.', t: { fr: 'Tant mieux.', en: 'So much the better.', es: 'Mejor.', ht: 'Tant pi byen.', de: 'Umso besser.', ru: 'Тем лучше.', zh: '太好了。', ja: 'よかった。' } },
      { n: 'Ça marche.', t: { fr: 'Ça marche.', en: 'It works.', es: 'Funciona.', ht: 'Sa mache.', de: 'Es funktioniert.', ru: 'Работает.', zh: '可以。', ja: 'うまくいきます。' } },
      { n: 'Impeccable !', t: { fr: 'Impeccable !', en: 'Perfect!', es: 'Impecable.', ht: 'Impekanb!', de: 'Einwandfrei!', ru: 'Отлично!', zh: '无可挑剔！', ja: '完璧です！' } },
      { n: 'On verra.', t: { fr: 'On verra.', en: 'We’ll see.', es: 'Ya veremos.', ht: 'Nou va wè.', de: 'Wir werden sehen.', ru: 'Посмотрим.', zh: '到时候再说。', ja: '見てみましょう。' } },
      { n: 'Ça dépend.', t: { fr: 'Ça dépend.', en: 'It depends.', es: 'Depende.', ht: 'Sa depann.', de: 'Das hängt ab.', ru: 'Смотря.', zh: '看情况。', ja: '場合によります。' } },
      { n: 'Je ne peux pas.', t: { fr: 'Je ne peux pas.', en: 'I can’t.', es: 'No puedo.', ht: 'Mwen pa kapab.', de: 'Ich kann nicht.', ru: 'Я не могу.', zh: '我不能。', ja: 'できません。' } },
      { n: 'Je veux bien.', t: { fr: 'Je veux bien.', en: 'I’d love to.', es: 'Me encantaría.', ht: 'Mwen vle byen.', de: 'Gerne.', ru: 'С удовольствием.', zh: '我很乐意。', ja: '喜んで。' } },
      { n: 'Avec plaisir.', t: { fr: 'Avec plaisir.', en: 'With pleasure.', es: 'Con gusto.', ht: 'Avèk plezi.', de: 'Mit Vergnügen.', ru: 'С удовольствием.', zh: '很乐意。', ja: '喜んで。' } },
      { n: 'Je n’ai pas le temps.', t: { fr: 'Je n’ai pas le temps.', en: 'I don’t have time.', es: 'No tengo tiempo.', ht: 'Mwen pa gen tan.', de: 'Ich habe keine Zeit.', ru: 'У меня нет времени.', zh: '我没时间。', ja: '時間がありません。' } },
      { n: 'Dépêche-toi !', t: { fr: 'Dépêche-toi !', en: 'Hurry up!', es: '¡Apúrate!', ht: 'Prese ou!', de: 'Beeil dich!', ru: 'Поторопись!', zh: '快点！', ja: '急いで！' } },
      { n: 'Allons-y !', t: { fr: 'Allons-y !', en: 'Let’s go!', es: '¡Vamos!', ht: 'Ann ale!', de: 'Los geht’s!', ru: 'Поехали!', zh: '我们走吧！', ja: '行きましょう！' } },
      { n: 'Viens ici !', t: { fr: 'Viens ici !', en: 'Come here!', es: '¡Ven aquí!', ht: 'Vini isit la!', de: 'Komm her!', ru: 'Иди сюда!', zh: '过来！', ja: 'こっちに来て！' } },
      { n: 'Tais-toi !', t: { fr: 'Tais-toi !', en: 'Shut up!', es: '¡Cállate!', ht: 'Fèmen bouch ou!', de: 'Halt den Mund!', ru: 'Заткнись!', zh: '闭嘴！', ja: '黙って！' } },
      { n: 'Je t’appelle plus tard.', t: { fr: 'Je t’appelle plus tard.', en: 'I’ll call you later.', es: 'Te llamo más tarde.', ht: 'M ap rele ou pita.', de: 'Ich rufe dich später an.', ru: 'Я позвоню тебе позже.', zh: '我晚点打给你。', ja: '後で電話します。' } },
      { n: 'Prends soin de toi.', t: { fr: 'Prends soin de toi.', en: 'Take care of yourself.', es: 'Cuídate.', ht: 'Pran swen tèt ou.', de: 'Pass auf dich auf.', ru: 'Береги себя.', zh: '照顾好自己。', ja: 'お大事に。' } }
    ]
  },

  // 12. Nombres, dates, heures (10 phrases)
  nombres_dates: {
    icon: '🔢',
    fr: 'Nombres, dates, heures',
    en: 'Numbers, dates, time',
    es: 'Números, fechas, hora',
    ht: 'Nimewo, dat, lè',
    de: 'Zahlen, Daten, Uhrzeit',
    ru: 'Числа, даты, время',
    zh: '数字、日期、时间',
    ja: '数字、日付、時刻',
    items: [
      { n: 'Quelle est la date aujourd’hui ?', t: { fr: 'Quelle est la date aujourd’hui ?', en: 'What’s today’s date?', es: '¿Qué fecha es hoy?', ht: 'Ki dat jodi a?', de: 'Welches Datum ist heute?', ru: 'Какое сегодня число?', zh: '今天几号？', ja: '今日は何日ですか？' } },
      { n: 'Nous sommes le 14 juillet.', t: { fr: 'Nous sommes le 14 juillet.', en: 'It’s July 14th.', es: 'Es 14 de julio.', ht: 'Nou 14 jiyè.', de: 'Wir haben den 14. Juli.', ru: 'Сегодня 14 июля.', zh: '今天是7月14日。', ja: '7月14日です。' } },
      { n: 'Quel jour sommes-nous ?', t: { fr: 'Quel jour sommes-nous ?', en: 'What day is it?', es: '¿Qué día es hoy?', ht: 'Ki jou nou ye?', de: 'Welcher Tag ist heute?', ru: 'Какой сегодня день?', zh: '今天星期几？', ja: '今日は何曜日ですか？' } },
      { n: 'Nous sommes lundi.', t: { fr: 'Nous sommes lundi.', en: 'It’s Monday.', es: 'Es lunes.', ht: 'Nou lendi.', de: 'Es ist Montag.', ru: 'Понедельник.', zh: '星期一。', ja: '月曜日です。' } },
      { n: 'Mon anniversaire est le 3 mai.', t: { fr: 'Mon anniversaire est le 3 mai.', en: 'My birthday is on May 3rd.', es: 'Mi cumpleaños es el 3 de mayo.', ht: 'Anivèsè mwen se 3 me.', de: 'Mein Geburtstag ist am 3. Mai.', ru: 'Мой день рождения 3 мая.', zh: '我的生日是5月3日。', ja: '私の誕生日は5月3日です。' } },
      { n: 'Il est 8 heures du matin.', t: { fr: 'Il est 8 heures du matin.', en: 'It’s 8 am.', es: 'Son las 8 de la mañana.', ht: 'Li 8 è nan maten.', de: 'Es ist 8 Uhr morgens.', ru: '8 часов утра.', zh: '早上8点。', ja: '朝8時です。' } },
      { n: 'Il est 3 heures de l’après-midi.', t: { fr: 'Il est 3 heures de l’après-midi.', en: 'It’s 3 pm.', es: 'Son las 3 de la tarde.', ht: 'Li 3 è nan apre-midi.', de: 'Es ist 15 Uhr.', ru: '3 часа дня.', zh: '下午3点。', ja: '午後3時です。' } },
      { n: 'Nous sommes en 2025.', t: { fr: 'Nous sommes en 2025.', en: 'It’s 2025.', es: 'Estamos en 2025.', ht: 'Nou nan 2025.', de: 'Wir haben 2025.', ru: 'Сейчас 2025 год.', zh: '现在是2025年。', ja: '2025年です。' } },
      { n: 'J’ai 25 ans.', t: { fr: 'J’ai 25 ans.', en: 'I am 25 years old.', es: 'Tengo 25 años.', ht: 'Mwen gen 25 an.', de: 'Ich bin 25 Jahre alt.', ru: 'Мне 25 лет.', zh: '我25岁。', ja: '25歳です。' } },
      { n: 'Mon numéro de téléphone est le 06...', t: { fr: 'Mon numéro de téléphone est le 06...', en: 'My phone number is 06...', es: 'Mi número de teléfono es el 06...', ht: 'Nimewo telefòn mwen se 06...', de: 'Meine Telefonnummer ist 06...', ru: 'Мой номер телефона 06...', zh: '我的电话号码是06...', ja: '私の電話番号は06...です。' } }
    ]
  },

  // 13. Internet et technologie (10 phrases)
  internet: {
    icon: '💻',
    fr: 'Internet et technologie',
    en: 'Internet and technology',
    es: 'Internet y tecnología',
    ht: 'Entènèt ak teknoloji',
    de: 'Internet und Technologie',
    ru: 'Интернет и технологии',
    zh: '互联网和技术',
    ja: 'インターネットとテクノロジー',
    items: [
      { n: 'Quel est ton mot de passe ?', t: { fr: 'Quel est ton mot de passe ?', en: 'What is your password?', es: '¿Cuál es tu contraseña?', ht: 'Ki modpas ou?', de: 'Wie ist dein Passwort?', ru: 'Какой у тебя пароль?', zh: '你的密码是什么？', ja: 'パスワードは何ですか？' } },
      { n: 'Je ne peux pas me connecter.', t: { fr: 'Je ne peux pas me connecter.', en: 'I can’t connect.', es: 'No puedo conectarme.', ht: 'Mwen pa ka konekte.', de: 'Ich kann mich nicht verbinden.', ru: 'Не могу подключиться.', zh: '我无法连接。', ja: '接続できません。' } },
      { n: 'Envoie-moi un email.', t: { fr: 'Envoie-moi un email.', en: 'Send me an email.', es: 'Envíame un correo.', ht: 'Voye m yon imel.', de: 'Schick mir eine E-Mail.', ru: 'Отправь мне письмо.', zh: '给我发封邮件。', ja: 'メールを送ってください。' } },
      { n: 'Quelle est ton adresse email ?', t: { fr: 'Quelle est ton adresse email ?', en: 'What is your email address?', es: '¿Cuál es tu dirección de correo?', ht: 'Ki adrès imel ou?', de: 'Wie ist deine E-Mail-Adresse?', ru: 'Какой у тебя адрес электронной почты?', zh: '你的邮箱地址是什么？', ja: 'メールアドレスは何ですか？' } },
      { n: 'Je te suivrai sur Instagram.', t: { fr: 'Je te suivrai sur Instagram.', en: 'I will follow you on Instagram.', es: 'Te seguiré en Instagram.', ht: 'M ap swiv ou sou Instagram.', de: 'Ich werde dir auf Instagram folgen.', ru: 'Я подпишусь на тебя в Instagram.', zh: '我会在Instagram上关注你。', ja: 'Instagramでフォローします。' } },
      { n: 'Télécharge l’application.', t: { fr: 'Télécharge l’application.', en: 'Download the app.', es: 'Descarga la aplicación.', ht: 'Telechaje aplikasyon an.', de: 'Lade die App herunter.', ru: 'Скачай приложение.', zh: '下载应用程序。', ja: 'アプリをダウンロードしてください。' } },
      { n: 'Mon ordinateur est lent.', t: { fr: 'Mon ordinateur est lent.', en: 'My computer is slow.', es: 'Mi computadora es lenta.', ht: 'Òdinatè mwen an ralanti.', de: 'Mein Computer ist langsam.', ru: 'Мой компьютер медленный.', zh: '我的电脑很慢。', ja: '私のパソコンは遅いです。' } },
      { n: 'Je dois changer la batterie.', t: { fr: 'Je dois changer la batterie.', en: 'I need to change the battery.', es: 'Debo cambiar la batería.', ht: 'Mwen dwe chanje batri a.', de: 'Ich muss die Batterie wechseln.', ru: 'Мне нужно заменить батарею.', zh: '我需要换电池。', ja: 'バッテリーを交換しなければなりません。' } },
      { n: 'Le Wi-Fi ne marche pas.', t: { fr: 'Le Wi-Fi ne marche pas.', en: 'The Wi-Fi isn’t working.', es: 'El Wi-Fi no funciona.', ht: 'Wi-Fi a pa mache.', de: 'Das WLAN funktioniert nicht.', ru: 'Wi-Fi не работает.', zh: 'Wi-Fi不能用。', ja: 'Wi-Fiが機能していません。' } },
      { n: 'Je vais faire une recherche sur Google.', t: { fr: 'Je vais faire une recherche sur Google.', en: 'I’ll do a Google search.', es: 'Haré una búsqueda en Google.', ht: 'M pral fè yon rechèch sou Google.', de: 'Ich werde bei Google suchen.', ru: 'Я поищу в Google.', zh: '我用谷歌搜索一下。', ja: 'Googleで検索します。' } }
    ]
  }
};

// Vérification : addition du nombre d'items dans chaque catégorie
// salutations:25, vie_quotidienne:30, restaurant:20, voyages:25, meteo:15, achats:20, sante_urgences:20, travail_ecole:20, famille_amis:15, animaux:10, expressions_courantes:25, nombres_dates:10, internet:10.
// Total = 25+30+20+25+15+20+20+20+15+10+25+10+10 = 245 items.
// [CORRECTION — voir aussi js/learning.js loadPhrases() et
// js/curriculum_exercises.js _genTransform()]
// Les 205 items ci-dessous (expressions_complementaires) sont du contenu
// FRANÇAIS UNIQUEMENT : leurs champs t.en/t.es/t.ht/t.de/t.ru/t.zh/t.ja
// contiennent en réalité le même texte français que t.fr (ce n'étaient
// pas de vraies traductions — voir l'ancien commentaire "simplifié, pour
// démonstration" ci-dessous, conservé pour traçabilité). Le contenu
// français lui-même reste intact et utile pour les apprenants de
// français ; il est filtré ailleurs (learning.js, curriculum_exercises.js)
// pour ne pas s'afficher comme "traduction" pour les autres langues
// cibles.
//
// Commentaires d'origine (conservés tels quels) :
// Il manque 255 items pour atteindre 500. L'utilisateur a demandé de continuer pour atteindre 500.
// Je vais ajouter une grande catégorie "Expressions complémentaires" avec 255 phrases supplémentaires (pour simplifier).

  // 14. Expressions complémentaires (255 phrases)
  PHRASES_DATA.expressions_complementaires = {
    icon: '📝',
    fr: 'Expressions complémentaires',
    en: 'Additional expressions',
    es: 'Expresiones adicionales',
    ht: 'Ekspresyon konplemantè',
    de: 'Zusätzliche Ausdrücke',
    ru: 'Дополнительные выражения',
    zh: '补充表达',
    ja: '追加表現',
    items: []
  };

  // Génération rapide de 255 phrases courantes (liste prédéfinie)
  var additionalPhrases = [
    "Je suis ravi(e) de te voir.", "Ça me fait plaisir.", "Je n’en peux plus.", "C’est incroyable !", "Quelle surprise !",
    "Je suis sous le choc.", "C’est la vie.", "Il n’y a pas de fumée sans feu.", "Mieux vaut tard que jamais.", "L’appétit vient en mangeant.",
    "Petit à petit, l’oiseau fait son nid.", "Paris ne s’est pas fait en un jour.", "Qui vivra verra.", "Après la pluie, le beau temps.", "Il ne faut pas vendre la peau de l’ours avant de l’avoir tué.",
    "C’est en forgeant qu’on devient forgeron.", "Les chiens ne font pas des chats.", "Quand on aime, on ne compte pas.", "L’argent ne fait pas le bonheur.", "La santé avant tout.",
    "Je suis pressé(e).", "J’ai hâte.", "C’est urgent.", "Fais vite !", "On n’a pas toute la journée.",
    "Tu as raison.", "Tu as tort.", "C’est juste.", "C’est faux.", "Je te crois.",
    "Je n’y crois pas.", "C’est une bonne idée.", "C’est une mauvaise idée.", "Je réfléchis.", "Laisse-moi réfléchir.",
    "Je prends une décision.", "J’ai changé d’avis.", "Je maintiens.", "Je regrette.", "Tant pis pour toi.",
    "Bonne idée !", "Mauvaise pioche.", "Tope là !", "Je te jure.", "Promis, juré.",
    "C’est dommage.", "Quel malheur !", "Quelle chance !", "Quelle horreur !", "Quelle histoire !",
    "Arrête ton char !", "Tu rigoles ?", "Sérieusement ?", "Pas possible !", "Ça alors !",
    "T’inquiète !", "Ne t’en fais pas.", "Ça va aller.", "Tout va bien.", "C’est sous contrôle.",
    "Je gère.", "Pas de panique.", "Respire un coup.", "Calme-toi.", "Du calme.",
    "À table !", "Bon appétit !", "Santé !", "Tchin tchin !", "À la vôtre !",
    "Je suis au régime.", "Je ne bois pas d’alcool.", "Je fume.", "J’ai arrêté de fumer.", "C’est mauvais pour la santé.",
    "Je fais du sport.", "Je vais à la salle.", "Je cours tous les jours.", "Je nage bien.", "Je suis sportif(ve).",
    "Quel temps !", "Il pleut des cordes.", "Il fait un froid de canard.", "On gèle.", "On crève de chaud.",
    "Quel vent !", "Ouf, on respire.", "Il fait bon.", "C’est agréable.", "Quelle douceur !",
    "Je suis impatient(e).", "Je m’ennuie de toi.", "Tu me manques beaucoup.", "Je pense à toi.", "Gros bisous.",
    "Bonne route !", "Bon voyage !", "Bon vol !", "Bonne continuation !", "Bon rétablissement !",
    "Bon anniversaire !", "Joyeux Noël !", "Bonne année !", "Joyeuses Pâques !", "Bonne fête !",
    "Bon week-end !", "Bonne fin de semaine !", "Bon lundi !", "Mercredi, c’est la mi-semaine.", "Enfin vendredi !",
    "C’est lundi, on se motive.", "J’ai la flemme.", "Pas envie.", "On va y arriver.", "C’est pas gagné.",
    "Je galère.", "C’est compliqué.", "C’est simple.", "C’est du gâteau.", "C’est une formalité.",
    "J’ai pigé.", "J’ai capté.", "J’ai compris.", "Ça roule.", "Nickel.",
    "Impec.", "Top.", "Génial.", "Formidable.", "Extra.",
    "Magnifique.", "Sublime.", "Parfait.", "Idéal.", "Parfaitement.",
    "Exactement.", "Tout juste.", "Clairement.", "Carrément.", "Totalement.",
    "Absolument.", "Bien vu.", "Bravo.", "Félicitations.", "Chapeau.",
    "Respect.", "Je te tire mon chapeau.", "Tu assures.", "T’es un chef.", "T’es le meilleur.",
    "Je suis nul(le).", "J’ai honte.", "Pardon, excuse-moi.", "Je ne le ferai plus.", "C’est de ma faute.",
    "Ce n’est pas de ta faute.", "Ne te blame pas.", "Ça arrive.", "Ce n’est pas grave.", "On s’en fiche.",
    "L’essentiel c’est que...", "Le principal c’est...", "Tout ce qui compte c’est...", "Peu importe le reste.", "Seul le résultat compte.",
    "Je te soutiens.", "Compte sur moi.", "Je serai là.", "Tu peux compter sur moi.", "Je ne te laisserai pas tomber.",
    "On est ensemble.", "Unis comme les doigts de la main.", "La famille d’abord.", "Les amis avant tout.", "L’amour vaincra.",
    "Tout est possible.", "Rêve grand.", "N’abandonne jamais.", "C’est en persévérant qu’on réussit.", "La persévérance paie.",
    "Le succès vient à ceux qui osent.", "Crois en toi.", "Sois confiant.", "Aie du cran.", "Montre ce que tu vaux.",
    "Fonce !", "Vas-y !", "Tente ta chance.", "Tente le coup.", "Quitte à perdre, autant tenter.",
    "Tu n’as rien à perdre.", "Saute le pas.", "Ose.", "Sois audacieux.", "Sois prudent.",
    "Attention à toi.", "Prends soin de toi.", "Sois sage.", "Travaille bien.", "Amuse-toi bien.",
    "Profite bien.", "Régale-toi.", "Bon vent !", "Que la force soit avec toi.", "À la prochaine !"
  ];

  // Ajouter les 205 phrases françaises réellement présentes dans la liste
  // ci-dessus (et non 255 : la boucle s'arrête naturellement à
  // additionalPhrases.length, qui est d'environ 205 — d'où le total
  // réel de PHRASES_DATA constaté à 451 items, pas 500).
  for (var i = 0; i < 255 && i < additionalPhrases.length; i++) {
    var phrase = additionalPhrases[i];
    // [CORRECTION] Seul fr est une vraie traduction ; les autres langues
    // sont explicitement vides plutôt que dupliquées en silence, pour
    // qu'aucun autre code ne les affiche par erreur comme une traduction
    // valide. Le filtrage par langue cible (learning.js, curriculum_exercises.js)
    // n'affiche déjà plus cette catégorie hors français, mais cette
    // correction protège aussi tout futur appelant qui lirait t[lang]
    // directement sans repasser par ces filtres.
    var trads = {
      fr: phrase,
      en: '', es: '', ht: '', de: '', ru: '', zh: '', ja: ''
    };
    PHRASES_DATA.expressions_complementaires.items.push({ n: phrase, t: trads });
  }

console.log('✅ Phrases et expressions chargées avec succès (' + Object.values(PHRASES_DATA).reduce(function(sum, c){ return sum + (c.items||[]).length; }, 0) + ' items au total).');
