// data.js — RESTRUCTURED EDITION v2
// LinguaVillage — Lieux thématiques + progression pédagogique
// ================================================================

window.API = window.API || 'https://linguavillage-api--marckensbou2.replit.app';

var _apiCache = {};
var lastAPICall = 0;
var MIN_API_INTERVAL = 300;

async function callAPIWithFallback(endpoint, data, options) {
  options = options || {};
  var skipCache = options.skipCache || false;
  var timeout   = options.timeout || 10000;
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
    _apiCache[cacheKey] = result;
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
// Structure : scènes linéaires avec choix multiples
// Chaque scène : message NPC + 3 options joueur + réaction NPC
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
  market:   {fr:'Marché',    en:'Market',   es:'Mercado',   ht:'Mache',    de:'Markt',          ru:'Рынок',    zh:'市场',   ja:'市場'},
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
// VOCABULAIRE
// =================================================================
var VOCAB = {
  verbes:{
    icon:'🏃', fr:'Verbes', en:'Verbs', es:'Verbos', ht:'Vèb', de:'Verben', ru:'Глаголы', zh:'动词', ja:'動詞',
    words:[
      {n:'manger',      t:{fr:'manger',      en:'to eat',         es:'comer',      ht:'manje',    de:'essen',         ru:'есть',          zh:'吃',    ja:'食べる'}},
      {n:'boire',       t:{fr:'boire',        en:'to drink',       es:'beber',      ht:'bwè',      de:'trinken',       ru:'пить',          zh:'喝',    ja:'飲む'}},
      {n:'dormir',      t:{fr:'dormir',       en:'to sleep',       es:'dormir',     ht:'dòmi',     de:'schlafen',      ru:'спать',         zh:'睡觉',  ja:'寝る'}},
      {n:'parler',      t:{fr:'parler',       en:'to speak',       es:'hablar',     ht:'pale',     de:'sprechen',      ru:'говорить',      zh:'说',    ja:'話す'}},
      {n:'comprendre',  t:{fr:'comprendre',   en:'to understand',  es:'comprender', ht:'konprann', de:'verstehen',     ru:'понимать',      zh:'理解',  ja:'理解する'}},
      {n:'apprendre',   t:{fr:'apprendre',    en:'to learn',       es:'aprender',   ht:'aprann',   de:'lernen',        ru:'учить',         zh:'学习',  ja:'学ぶ'}},
      {n:'travailler',  t:{fr:'travailler',   en:'to work',        es:'trabajar',   ht:'travay',   de:'arbeiten',      ru:'работать',      zh:'工作',  ja:'働く'}},
      {n:'voyager',     t:{fr:'voyager',      en:'to travel',      es:'viajar',     ht:'vwayaje',  de:'reisen',        ru:'путешествовать',zh:'旅行',  ja:'旅行する'}},
    ]
  },
  salutations:{
    icon:'👋', fr:'Salutations', en:'Greetings', es:'Saludos', ht:'Bonjou', de:'Begrüßungen', ru:'Приветствия', zh:'问候', ja:'挨拶',
    words:[
      {n:'bonjour',          t:{fr:'bonjour',          en:'hello',           es:'hola',        ht:'bonjou',  de:'hallo',             ru:'здравствуйте', zh:'你好',   ja:'こんにちは'}},
      {n:'au revoir',        t:{fr:'au revoir',         en:'goodbye',         es:'adiós',       ht:'oke',     de:'auf wiedersehen',   ru:'до свидания',  zh:'再见',   ja:'さようなら'}},
      {n:'merci',            t:{fr:'merci',             en:'thank you',       es:'gracias',     ht:'mèsi',    de:'danke',             ru:'спасибо',       zh:'谢谢',   ja:'ありがとう'}},
      {n:'s\'il vous plaît', t:{fr:'s\'il vous plaît',  en:'please',          es:'por favor',   ht:'tanpri',  de:'bitte',             ru:'пожалуйста',    zh:'请',     ja:'お願いします'}},
      {n:'bonsoir',          t:{fr:'bonsoir',           en:'good evening',    es:'buenas noches',ht:'bonswa', de:'guten abend',       ru:'добрый вечер',  zh:'晚上好', ja:'こんばんは'}},
    ]
  },
  voyage:{
    icon:'✈️', fr:'Voyage', en:'Travel', es:'Viaje', ht:'Vwayaj', de:'Reise', ru:'Путешествие', zh:'旅行', ja:'旅行',
    words:[
      {n:'aéroport', t:{fr:'aéroport', en:'airport',   es:'aeropuerto', ht:'ayewopò', de:'Flughafen',  ru:'аэропорт', zh:'机场',   ja:'空港'}},
      {n:'billet',   t:{fr:'billet',   en:'ticket',    es:'billete',    ht:'tikè',    de:'Fahrkarte',  ru:'билет',    zh:'票',     ja:'切符'}},
      {n:'valise',   t:{fr:'valise',   en:'suitcase',  es:'maleta',     ht:'valiz',   de:'Koffer',     ru:'чемодан',  zh:'行李箱', ja:'スーツケース'}},
      {n:'passeport',t:{fr:'passeport',en:'passport',  es:'pasaporte',  ht:'paspò',   de:'Reisepass',  ru:'паспорт',  zh:'护照',   ja:'パスポート'}},
    ]
  }
};

// =================================================================
// PHRASES
// =================================================================
var PHRASES_DATA = {
  quotidien:{
    icon:'💬', fr:'Quotidien', en:'Daily Life', es:'Vida diaria', ht:'Lavi chak jou', de:'Alltag', ru:'Повседневная жизнь', zh:'日常生活', ja:'日常生活',
    items:[
      {n:'Comment ça va ?',       t:{fr:'Comment ça va ?',      en:'How are you?',          es:'¿Cómo estás?',     ht:'Kijan ou ye?',       de:'Wie geht es dir?',    ru:'Как дела?',         zh:'你好吗？',    ja:'お元気ですか？'}},
      {n:'Je vais bien, merci.',  t:{fr:'Je vais bien, merci.', en:'I am fine, thank you.', es:'Estoy bien, gracias.',ht:'Mwen byen, mèsi.', de:'Mir geht es gut.',    ru:'У меня всё хорошо.',zh:'我很好，谢谢。',ja:'元気です、ありがとう。'}},
      {n:'Quel temps fait-il ?',  t:{fr:'Quel temps fait-il ?', en:'What\'s the weather like?',es:'¿Qué tiempo hace?',ht:'Ki tan li fè?',     de:'Wie ist das Wetter?', ru:'Какая погода?',      zh:'天气怎么样？', ja:'天気はどうですか？'}},
    ]
  },
  restaurant:{
    icon:'🍽️', fr:'Restaurant', en:'Restaurant', es:'Restaurante', ht:'Restoran', de:'Restaurant', ru:'Ресторан', zh:'餐厅', ja:'レストラン',
    items:[
      {n:'Je voudrais commander.', t:{fr:'Je voudrais commander.',en:'I would like to order.',es:'Me gustaría pedir.',ht:'Mwen ta renmen kòmande.',de:'Ich möchte bestellen.',ru:'Я хотел бы заказать.',zh:'我想点餐。',ja:'注文したいです。'}},
      {n:'L\'addition, s\'il vous plaît.', t:{fr:'L\'addition, s\'il vous plaît.',en:'The bill, please.',es:'La cuenta, por favor.',ht:'Ladityon, tanpri.',de:'Die Rechnung, bitte.',ru:'Счет, пожалуйста.',zh:'买单，谢谢。',ja:'お会計をお願いします。'}},
    ]
  }
};

// =================================================================
// GRAMMAIRE
// =================================================================
var GRAMMAR_DATA = {
  present:{
    icon:'⏰', fr:'Présent', en:'Present tense', es:'Presente', ht:'Prezan', de:'Präsens', ru:'Настоящее время', zh:'现在时', ja:'現在形',
    explanation:{fr:'Le présent exprime une action qui se déroule maintenant.',en:'The present tense expresses an action happening now.'},
    formula:{fr:'Sujet + verbe conjugué + complément',en:'Subject + conjugated verb + complement'},
    examples:[
      {n:'Je mange une pomme.', t:{fr:'Je mange une pomme.',en:'I eat an apple.',es:'Yo como una manzana.',ht:'Mwen manje yon pòm.',de:'Ich esse einen Apfel.',ru:'Я ем яблоко.',zh:'我吃一个苹果。',ja:'私はリンゴを食べます。'}},
    ]
  },
  passe_compose:{
    icon:'📅', fr:'Passé composé', en:'Past tense', es:'Pasado compuesto', ht:'Pase konpoze', de:'Perfekt', ru:'Прошедшее время', zh:'过去时', ja:'過去形',
    explanation:{fr:'Le passé composé exprime une action terminée.',en:'The past tense expresses a completed action.'},
    formula:{fr:'Sujet + auxiliaire + participe passé',en:'Subject + auxiliary + past participle'},
    examples:[
      {n:'J\'ai mangé une pomme.', t:{fr:'J\'ai mangé une pomme.',en:'I ate an apple.',es:'Yo comí una manzana.',ht:'Mwen te manje yon pòm.',de:'Ich habe einen Apfel gegessen.',ru:'Я съел яблоко.',zh:'我吃了一个苹果。',ja:'私はリンゴを食べました。'}},
    ]
  }
};

console.log('✅ data.js v2 — Lieux thématiques + dialogues guidés chargés');
