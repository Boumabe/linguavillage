/* =================================================================
   missions.js — LinguaVillage
   Système de missions, récompenses, streak et boutique de gemmes
   Dépendances : save.js (S_streak, updateStreak, saveGame)
                 app.js  (S, gainXP, showNotif, showScreen, LANG_NAMES)
   ================================================================= */

// =================================================================
// DONNÉES MISSIONS
// =================================================================
const MISSIONS = {
  market:[
    {id:'m1', icon:'☕', xp:30, gem:1,
     title:{fr:'Commande un café',en:'Order a coffee',es:'Pide un café',ht:'Kòmande yon kafe',de:'Bestell einen Kaffee',ru:'Закажи кофе',zh:'点一杯咖啡',ja:'コーヒーを注文'},
     desc:{fr:'Dis "Je voudrais un café, s\'il vous plaît" au vendeur',en:'Say "I\'d like a coffee, please"',es:'Di "Quisiera un café, por favor"',ht:'Di "Mwen ta renmen yon kafe, tanpri"',de:'Sag "Ich möchte einen Kaffee, bitte"',ru:'Скажи «Кофе, пожалуйста»',zh:'说"我要一杯咖啡，谢谢"',ja:'「コーヒーをください」と言う'},
     hint:{fr:'"Je voudrais un ___"',en:'"I\'d like a ___"',es:'"Quisiera un ___"',ht:'"Mwen ta renmen ___"',de:'"Ich möchte ein/e ___"',ru:'"Мне, пожалуйста, ___"',zh:'"我要一___"',ja:'「___をください」'},
     check:['café','coffee','kafe','kaffee','кофе','咖啡','コーヒー']},
    {id:'m2', icon:'🧺', xp:40, gem:1,
     title:{fr:'Achète 3 légumes',en:'Buy 3 vegetables',es:'Compra 3 verduras',ht:'Achte 3 legim',de:'Kauf 3 Gemüse',ru:'Купи 3 овоща',zh:'买三种蔬菜',ja:'野菜を3つ買う'},
     desc:{fr:'Demande le prix de 3 légumes différents',en:'Ask the price of 3 different vegetables',es:'Pregunta el precio de 3 verduras',ht:'Mande pri 3 legim diferan',de:'Frage den Preis von 3 verschiedenen Gemüsen',ru:'Спроси цену на 3 овоща',zh:'询问3种蔬菜的价格',ja:'野菜3つの値段を聞く'},
     hint:{fr:'"Combien coûte ___?"',en:'"How much is ___?"',es:'"¿Cuánto cuesta ___?"',ht:'"Konbyen ___ koute?"',de:'"Wie viel kostet ___?"',ru:'"Сколько стоит ___?"',zh:'"___多少钱?"',ja:'「___はいくらですか?」'},
     check:['combien','how much','cuánto','konbyen','wie viel','сколько','多少','いくら']},
    {id:'m3', icon:'💰', xp:50, gem:2,
     title:{fr:'Négocie un prix',en:'Negotiate a price',es:'Negocia un precio',ht:'Negosye yon pri',de:'Verhandle einen Preis',ru:'Торгуйся',zh:'讨价还价',ja:'値段交渉する'},
     desc:{fr:'Dis que c\'est trop cher et propose un autre prix',en:'Say it\'s too expensive and offer a lower price',es:'Di que es muy caro y ofrece menos',ht:'Di li twò chè epi ofri yon lòt pri',de:'Sag es ist zu teuer und biete weniger',ru:'Скажи что дорого и предложи меньше',zh:'说太贵了并还价',ja:'高すぎると言って値下げを提案'},
     hint:{fr:'"C\'est trop cher. Je propose ___"',en:'"Too expensive. I offer ___"',es:'"Muy caro. Ofrezco ___"',ht:'"Twò chè. M ofri ___"',de:'"Zu teuer. Ich biete ___"',ru:'"Дорого. Предлагаю ___"',zh:'"太贵了。我出___"',ja:'「高すぎます。___はどうですか」'},
     check:['trop cher','too expensive','muy caro','twò chè','zu teuer','дорого','太贵','高すぎ']},
  ],
  tavern:[
    {id:'m4', icon:'🍺', xp:25, gem:1,
     title:{fr:'Commande une boisson',en:'Order a drink',es:'Pide una bebida',ht:'Kòmande yon bwason',de:'Bestell ein Getränk',ru:'Закажи напиток',zh:'点一杯饮料',ja:'飲み物を注文'},
     desc:{fr:'Commande ta boisson préférée au barman',en:'Order your favorite drink from the bartender',es:'Pide tu bebida favorita',ht:'Kòmande bwason ou pi renmen an',de:'Bestell dein Lieblingsgetränk',ru:'Закажи любимый напиток',zh:'向酒保点你喜欢的饮料',ja:'バーテンダーに好きな飲み物を注文'},
     hint:{fr:'"Je voudrais ___"',en:'"I\'d like ___"',es:'"Quisiera ___"',ht:'"Mwen ta renmen ___"',de:'"Ich hätte gerne ___"',ru:'"Мне ___"',zh:'"我要___"',ja:'「___をください」'},
     check:['voudrais','like','quisiera','renmen','hätte','мне','我要','ください']},
    {id:'m5', icon:'😂', xp:35, gem:1,
     title:{fr:'Fais une blague',en:'Tell a joke',es:'Cuenta un chiste',ht:'Fè yon blag',de:'Mach einen Witz',ru:'Расскажи анекдот',zh:'讲个笑话',ja:'冗談を言う'},
     desc:{fr:'Raconte une blague simple en langue cible',en:'Tell a simple joke in the target language',es:'Cuenta un chiste simple',ht:'Rakonte yon blag senp',de:'Erzähle einen einfachen Witz',ru:'Расскажи простой анекдот',zh:'用目标语言讲个简单笑话',ja:'目標言語で簡単な冗談を言う'},
     hint:{fr:'"Tu connais la blague de ___?"',en:'"Why did ___ cross the road?"',es:'"¿Por qué ___ cruzó la calle?"',ht:'"Poukisa ___ te travèse lari a?"',de:'"Warum ___?"',ru:'"Почему ___?"',zh:'"为什么___?"',ja:'「なぜ___ですか？」'},
     check:['blague','joke','chiste','blag','witz','анекдот','笑话','冗談']},
  ],
  station:[
    {id:'m6', icon:'🚂', xp:45, gem:2,
     title:{fr:'Achète un billet',en:'Buy a ticket',es:'Compra un billete',ht:'Achte yon tikè',de:'Kauf eine Fahrkarte',ru:'Купи билет',zh:'买张票',ja:'切符を買う'},
     desc:{fr:'Demande un billet pour une destination',en:'Ask for a ticket to a destination',es:'Pide un billete a una ciudad',ht:'Mande yon tikè pou yon destinasyon',de:'Frage nach einer Fahrkarte zu einem Ziel',ru:'Попроси билет до пункта назначения',zh:'询问去某地的车票',ja:'目的地への切符を頼む'},
     hint:{fr:'"Un billet pour ___, s\'il vous plaît"',en:'"One ticket to ___, please"',es:'"Un billete para ___, por favor"',ht:'"Yon tikè pou ___, tanpri"',de:'"Eine Fahrkarte nach ___, bitte"',ru:'"Один билет до ___, пожалуйста"',zh:'"一张去___的票，谢谢"',ja:'「___まで一枚ください」'},
     check:['billet','ticket','billete','tikè','fahrkarte','билет','票','切符']},
    {id:'m7', icon:'🕐', xp:30, gem:1,
     title:{fr:'Demande l\'horaire',en:'Ask for the schedule',es:'Pregunta el horario',ht:'Mande orè a',de:'Frag nach dem Fahrplan',ru:'Спроси расписание',zh:'询问时刻表',ja:'時刻表を聞く'},
     desc:{fr:'Demande à quelle heure part le prochain train',en:'Ask what time the next train departs',es:'Pregunta a qué hora sale el próximo tren',ht:'Mande ki lè pwochen tren an ap pati',de:'Frage wann der nächste Zug abfährt',ru:'Спроси когда следующий поезд',zh:'询问下一班列车的出发时间',ja:'次の電車の発車時刻を聞く'},
     hint:{fr:'"À quelle heure part le ___?"',en:'"What time does the ___ leave?"',es:'"¿A qué hora sale el ___?"',ht:'"Ki lè ___ ap pati?"',de:'"Wann fährt der ___ ab?"',ru:'"В котором часу отправляется ___?"',zh:'"___几点出发?"',ja:'「___は何時に出発しますか?」'},
     check:['quelle heure','what time','qué hora','ki lè','wann','котором часу','几点','何時']},
  ],
  bank:[
    {id:'m8', icon:'💳', xp:50, gem:2,
     title:{fr:'Ouvre un compte',en:'Open an account',es:'Abre una cuenta',ht:'Ouvri yon kont',de:'Öffne ein Konto',ru:'Открой счёт',zh:'开一个账户',ja:'口座を開く'},
     desc:{fr:'Demande à ouvrir un compte bancaire',en:'Ask to open a bank account',es:'Pide abrir una cuenta bancaria',ht:'Mande pou ouvri yon kont labank',de:'Bitte um Eröffnung eines Kontos',ru:'Попроси открыть счёт',zh:'申请开设银行账户',ja:'銀行口座の開設を申し込む'},
     hint:{fr:'"Je voudrais ouvrir un compte"',en:'"I\'d like to open an account"',es:'"Quisiera abrir una cuenta"',ht:'"Mwen ta renmen ouvri yon kont"',de:'"Ich möchte ein Konto eröffnen"',ru:'"Хочу открыть счёт"',zh:'"我想开一个账户"',ja:'「口座を開設したいのですが」'},
     check:['ouvrir','open','abrir','ouvri','eröffnen','открыть','开','開設']},
  ],
  hospital:[
    {id:'m9', icon:'🩺', xp:40, gem:1,
     title:{fr:'Décris tes symptômes',en:'Describe your symptoms',es:'Describe tus síntomas',ht:'Dekri sentòm ou',de:'Beschreibe deine Symptome',ru:'Опиши симптомы',zh:'描述症状',ja:'症状を説明する'},
     desc:{fr:'Dis au médecin où tu as mal',en:'Tell the doctor where it hurts',es:'Dile al médico dónde te duele',ht:'Di doktè a kote ou fè mal',de:'Sag dem Arzt wo es wehtut',ru:'Скажи врачу что болит',zh:'告诉医生哪里痛',ja:'医者に痛い場所を伝える'},
     hint:{fr:'"J\'ai mal à ___"',en:'"My ___ hurts"',es:'"Me duele el/la ___"',ht:'"___ mwen fè mal"',de:'"Mein ___ tut weh"',ru:'"У меня болит ___"',zh:'"我___痛"',ja:'「___が痛いです」'},
     check:['mal','hurts','duele','fè mal','weh','болит','痛','痛い']},
  ],
  school:[
    {id:'m10', icon:'📚', xp:35, gem:1,
     title:{fr:'Pose une question en classe',en:'Ask a question in class',es:'Haz una pregunta en clase',ht:'Poze yon kesyon nan klas',de:'Stell eine Frage im Unterricht',ru:'Задай вопрос на уроке',zh:'在课堂上提问',ja:'授業で質問する'},
     desc:{fr:'Demande au professeur d\'expliquer quelque chose',en:'Ask the teacher to explain something',es:'Pide al profesor que explique algo',ht:'Mande pwofesè a eksplike yon bagay',de:'Bitte den Lehrer etwas zu erklären',ru:'Попроси учителя объяснить',zh:'请老师解释某件事',ja:'先生に何かを説明してもらう'},
     hint:{fr:'"Pouvez-vous expliquer ___?"',en:'"Can you explain ___?"',es:'"¿Puede explicar ___?"',ht:'"Èske ou ka eksplike ___?"',de:'"Können Sie ___ erklären?"',ru:'"Объясните, пожалуйста, ___"',zh:'"能解释一下___吗?"',ja:'「___を説明してもらえますか?」'},
     check:['expliquer','explain','explicar','eksplike','erklären','объясните','解释','説明']},
  ],
  police:[
    {id:'m11', icon:'🗺️', xp:30, gem:1,
     title:{fr:'Demande ton chemin',en:'Ask for directions',es:'Pide indicaciones',ht:'Mande chemen ou',de:'Frag nach dem Weg',ru:'Спроси дорогу',zh:'问路',ja:'道を聞く'},
     desc:{fr:'Demande comment aller à un endroit précis',en:'Ask how to get to a specific place',es:'Pregunta cómo llegar a un lugar',ht:'Mande kijan pou rive nan yon kote',de:'Frage wie man zu einem Ort kommt',ru:'Спроси как добраться до места',zh:'询问如何到达某个地方',ja:'特定の場所への行き方を聞く'},
     hint:{fr:'"Comment aller à ___?"',en:'"How do I get to ___?"',es:'"¿Cómo llego a ___?"',ht:'"Kijan pou rive nan ___?"',de:'"Wie komme ich zu ___?"',ru:'"Как добраться до ___?"',zh:'"怎么去___?"',ja:'「___への行き方は？」'},
     check:['comment','how','cómo','kijan','wie','как','怎么','どうやって']},
  ],
  friends:[
    {id:'m12', icon:'🎂', xp:35, gem:1,
     title:{fr:'Souhaite un anniversaire',en:'Wish happy birthday',es:'Felicita el cumpleaños',ht:'Swete yon bon fèt',de:'Wünsche alles Gute zum Geburtstag',ru:'Поздравь с днём рождения',zh:'祝生日快乐',ja:'誕生日を祝う'},
     desc:{fr:'Dis joyeux anniversaire avec un message sincère',en:'Say happy birthday with a sincere message',es:'Di feliz cumpleaños con un mensaje',ht:'Di bon fèt ak yon mesaj sensè',de:'Sag alles Gute mit einer Nachricht',ru:'Поздравь с пожеланием',zh:'说生日快乐并送上祝福',ja:'誕生日おめでとうとメッセージを贈る'},
     hint:{fr:'"Joyeux anniversaire! Je te souhaite ___"',en:'"Happy birthday! I wish you ___"',es:'"¡Feliz cumpleaños! Te deseo ___"',ht:'"Bon fèt! Mwen swete ou ___"',de:'"Alles Gute! Ich wünsche dir ___"',ru:'"С днём рождения! Желаю тебе ___"',zh:'"生日快乐！祝你___"',ja:'「誕生日おめでとう！___を願っています」'},
     check:['anniversaire','birthday','cumpleaños','fèt','geburtstag','рождения','生日','誕生日']},
  ],
  park:[
    {id:'m13', icon:'💝', xp:60, gem:3,
     title:{fr:'Fais un compliment sincère',en:'Give a sincere compliment',es:'Haz un cumplido sincero',ht:'Fè yon konpliman sensè',de:'Mach ein aufrichtiges Kompliment',ru:'Сделай искренний комплимент',zh:'给出真诚的赞美',ja:'心からの褒め言葉を言う'},
     desc:{fr:'Dis quelque chose de beau à ton partenaire de conversation',en:'Say something beautiful in your target language',es:'Di algo bonito en tu idioma objetivo',ht:'Di yon bèl bagay nan lang ou ap aprann',de:'Sag etwas Schönes auf Zielsprache',ru:'Скажи что-то красивое на целевом языке',zh:'用目标语言说一些美好的话',ja:'目標言語で美しいことを言う'},
     hint:{fr:'"Tu es ___ parce que ___"',en:'"You are ___ because ___"',es:'"Eres ___ porque ___"',ht:'"Ou ___ paske ___"',de:'"Du bist ___ weil ___"',ru:'"Ты ___ потому что ___"',zh:'"你___因为___"',ja:'「あなたは___です、なぜなら___」'},
     check:['magnifique','beautiful','hermoso','bèl','wunderschön','красивый','美','美しい']},
  ],
  cinema:[
    {id:'m14', icon:'🎬', xp:40, gem:2,
     title:{fr:'Résume un film',en:'Summarize a film',es:'Resume una película',ht:'Rezime yon fim',de:'Fasse einen Film zusammen',ru:'Расскажи о фильме',zh:'总结一部电影',ja:'映画を要約する'},
     desc:{fr:'Décris en 3 phrases un film ou extrait vu au cinéma',en:'Describe in 3 sentences a film you watched',es:'Describe en 3 frases una película vista',ht:'Dekri nan 3 fraz yon fim ou wè',de:'Beschreibe in 3 Sätzen einen Film',ru:'Опиши фильм тремя предложениями',zh:'用3句话描述一部你看过的电影',ja:'見た映画を3文で説明する'},
     hint:{fr:'"Ce film parle de ___, il se passe ___"',en:'"This film is about ___, set in ___"',es:'"Esta película trata de ___, ocurre ___"',ht:'"Fim sa pale de ___, li pase ___"',de:'"Dieser Film handelt von ___, spielt in ___"',ru:'"Этот фильм о ___, происходит в ___"',zh:'"这部电影讲的是___，发生在___"',ja:'「この映画は___について、___が舞台」'},
     check:['parle','about','trata','pale','handelt','о том','讲','ついて']},
  ],
};

// =================================================================
// RÉCOMPENSES — badges progressifs
// =================================================================
const REWARDS = {
  badges:[
    {id:'b1', xp:100,  icon:'🌱', name:{fr:'Apprenti',        en:'Apprentice',    es:'Aprendiz',    ht:'Apranti',   de:'Azubi',          ru:'Ученик',          zh:'学徒',     ja:'見習い'}},
    {id:'b2', xp:300,  icon:'⭐', name:{fr:'Explorateur',     en:'Explorer',      es:'Explorador',  ht:'Eksploratè',de:'Entdecker',      ru:'Исследователь',   zh:'探险家',   ja:'探検家'}},
    {id:'b3', xp:600,  icon:'🏅', name:{fr:'Voyageur',        en:'Traveler',      es:'Viajero',     ht:'Vwayajè',   de:'Reisender',      ru:'Путешественник',  zh:'旅行者',   ja:'旅人'}},
    {id:'b4', xp:1000, icon:'🏆', name:{fr:'Champion',        en:'Champion',      es:'Campeón',     ht:'Chanpyon',  de:'Champion',       ru:'Чемпион',         zh:'冠军',     ja:'チャンピオン'}},
    {id:'b5', xp:2000, icon:'👑', name:{fr:'Maître des Langues',en:'Language Master',es:'Maestro de Idiomas',ht:'Mèt Lang',de:'Sprachmeister',ru:'Мастер языков',zh:'语言大师',ja:'言語マスター'}},
  ],
};

// =================================================================
// ÉTAT MISSIONS
// =================================================================
let S_missions = {
  completed: {},
  gems:      0,
  badges:    [],
};

// =================================================================
// MISSIONS — logique de jeu
// =================================================================
function getMissionsForLoc(locId) {
  return MISSIONS[locId] || [];
}

function openMissionsPanel(locId) {
  var missions = getMissionsForLoc(locId);
  if (!missions.length) return;
  var nl    = S.nativeLang || 'fr';
  var panel = document.getElementById('missionsPanel');
  if (!panel) return;

  var html = '<div style="padding:12px 16px 8px;background:rgba(255,215,0,0.06);border-bottom:1px solid var(--border);">'
    + '<div style="font-family:Cinzel,serif;font-size:0.9rem;color:var(--gold);margin-bottom:2px;">🎯 Missions</div>'
    + '<div style="font-size:0.68rem;color:var(--dim)">💎 ' + S_missions.gems
    + ' gemmes &middot; ' + Object.keys(S_missions.completed).length + ' missions complètes</div>'
    + '</div><div style="overflow-y:auto;max-height:220px;padding:8px;">';

  missions.forEach(function(m) {
    var done      = S_missions.completed[m.id];
    var title     = (m.title[nl] || m.title.fr || '').replace(/'/g, '&apos;');
    var desc      = (m.desc[nl]  || m.desc.fr  || '').replace(/'/g, '&apos;');
    var hint      = (m.hint[nl]  || m.hint.fr  || '').replace(/'/g, '&apos;');
    var xpBadge   = done ? '&#x2705;' : ('+' + m.xp + ' XP &middot; ' + '💎'.repeat(m.gem));
    var clickAttr = done ? '' : ('onclick="startMission(\'' + m.id + '\',\'' + locId + '\')"');

    html += '<div style="background:' + (done ? 'rgba(78,207,112,0.08)' : 'var(--bg-card)')
      + ';border:1px solid ' + (done ? 'rgba(78,207,112,0.3)' : 'var(--border)')
      + ';border-radius:12px;padding:10px 12px;margin-bottom:7px;cursor:' + (done ? 'default' : 'pointer') + ';transition:all 0.2s;" '
      + clickAttr + '>'
      + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">'
      + '<span style="font-size:1.2rem">' + m.icon + '</span>'
      + '<span style="font-weight:900;font-size:0.85rem;color:' + (done ? 'var(--green)' : 'var(--text)') + '">' + title + '</span>'
      + '<span style="margin-left:auto;font-size:0.7rem;color:' + (done ? 'var(--green)' : 'var(--gold)') + '">' + xpBadge + '</span>'
      + '</div>'
      + '<div style="font-size:0.72rem;color:var(--dim)">' + desc + '</div>'
      + (done ? '' : '<div style="font-size:0.68rem;color:rgba(255,215,0,0.6);margin-top:5px;font-style:italic">💡 ' + hint + '</div>')
      + '</div>';
  });

  html += '</div>';
  panel.innerHTML = html;
  panel.style.display = 'block';
}

var activeMission = null;

function startMission(missionId, locId) {
  var missions  = getMissionsForLoc(locId);
  activeMission = missions.find(function(m) { return m.id === missionId; });
  if (!activeMission) return;
  var nl  = S.nativeLang || 'fr';
  var inp = document.getElementById('dialInput');
  if (inp) {
    inp.placeholder      = '💡 ' + (activeMission.hint[nl] || activeMission.hint.fr);
    inp.style.borderColor = 'var(--gold)';
  }
  showNotif('🎯 ' + (activeMission.title[nl] || activeMission.title.fr));
}

function checkMissionInMessage(text) {
  if (!activeMission) return;
  var lower = text.toLowerCase();
  var done  = activeMission.check.some(function(kw) {
    return lower.includes(kw.toLowerCase());
  });
  if (done) {
    completeMission(activeMission);
    activeMission = null;
    var inp = document.getElementById('dialInput');
    if (inp) { inp.placeholder = 'Votre réponse...'; inp.style.borderColor = ''; }
  }
}

function completeMission(mission) {
  if (S_missions.completed[mission.id]) return;
  S_missions.completed[mission.id] = true;
  S_missions.gems += mission.gem;
  gainXP(mission.xp);

  var gd = document.getElementById('gemDisplay');
  if (gd) gd.textContent = '💎 ' + S_missions.gems;

  checkBadges();
  var nl = S.nativeLang || 'fr';
  showMissionReward(mission, nl);
  if (typeof saveGame === 'function') saveGame();
}

function showMissionReward(mission, nl) {
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;'
    + 'display:flex;align-items:center;justify-content:center;';
  var title   = (mission.title[nl] || mission.title.fr || '').replace(/'/g, '&apos;');
  overlay.innerHTML =
    '<div style="background:linear-gradient(135deg,#1a0a2e,#0a0a14);border:2px solid var(--gold);'
    + 'border-radius:24px;padding:28px 32px;text-align:center;max-width:300px;">'
    + '<div style="font-size:3rem;margin-bottom:8px;">' + mission.icon + '</div>'
    + '<div style="font-family:\'Cinzel\',serif;color:var(--gold);font-size:1.1rem;margin-bottom:4px;">&#x2705; Mission réussie!</div>'
    + '<div style="color:var(--text);font-size:0.9rem;font-weight:800;margin-bottom:12px;">' + title + '</div>'
    + '<div style="display:flex;justify-content:center;gap:16px;margin-bottom:16px;">'
    + '<span style="background:rgba(255,215,0,0.15);border:1px solid var(--gold);border-radius:12px;padding:6px 14px;color:var(--gold);font-weight:900;">+' + mission.xp + ' XP ⭐</span>'
    + '<span style="background:rgba(100,200,255,0.15);border:1px solid #4a9eff;border-radius:12px;padding:6px 14px;color:#4a9eff;font-weight:900;">' + '💎'.repeat(mission.gem) + ' x' + mission.gem + '</span>'
    + '</div>'
    + '<button onclick="this.closest(\'div\').parentElement.remove()" style="background:linear-gradient(135deg,#a86800,#ffd700);border:none;border-radius:12px;padding:10px 28px;font-family:\'Cinzel\',serif;font-weight:700;cursor:pointer;font-size:0.85rem;">🎉 Super!</button>'
    + '</div>';
  document.body.appendChild(overlay);
  setTimeout(function() { if (overlay.parentElement) overlay.remove(); }, 4000);
  launchConfetti();
}

function launchConfetti() {
  var colors = ['#FFD700','#4ecf70','#4a9eff','#e040fb','#ff6b6b'];
  for (var i = 0; i < 40; i++) {
    (function() {
      var c     = document.createElement('div');
      var color = colors[Math.floor(Math.random() * colors.length)];
      c.style.cssText = 'position:fixed;width:8px;height:8px;background:' + color
        + ';border-radius:50%;left:' + (Math.random()*100) + '%;top:-10px;z-index:10000;'
        + 'animation:confettiFall ' + (1+Math.random()*2) + 's linear forwards;'
        + 'animation-delay:' + (Math.random()*0.5) + 's;';
      document.body.appendChild(c);
      setTimeout(function() { c.remove(); }, 3000);
    })();
  }
}

function checkBadges() {
  REWARDS.badges.forEach(function(badge) {
    if (!S_missions.badges.includes(badge.id) && S.xp >= badge.xp) {
      S_missions.badges.push(badge.id);
      showBadgeUnlocked(badge);
    }
  });
}

function showBadgeUnlocked(badge) {
  var nl = S.nativeLang || 'fr';
  setTimeout(function() {
    showNotif(badge.icon + ' Badge débloqué : ' + (badge.name[nl] || badge.name.fr));
  }, 2000);
}

// =================================================================
// ÉCRAN PROGRESSION
// =================================================================
function showProgression() {
  var nl           = S.nativeLang || 'fr';
  var totalMissions = Object.values(MISSIONS).flat().length;
  var done         = Object.keys(S_missions.completed).length;
  var pct          = Math.round((done / totalMissions) * 100);
  var nextBadge    = REWARDS.badges.find(function(b) { return S.xp < b.xp; });
  var xpToNext     = nextBadge ? nextBadge.xp - S.xp : 0;

  var badgesHTML = REWARDS.badges.map(function(b) {
    var unlocked = S_missions.badges.includes(b.id);
    return '<div style="background:' + (unlocked ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.04)')
      + ';border:1px solid ' + (unlocked ? 'var(--gold)' : 'var(--border)')
      + ';border-radius:12px;padding:8px 12px;text-align:center;opacity:' + (unlocked ? 1 : 0.4) + ';">'
      + '<div style="font-size:1.3rem;">' + b.icon + '</div>'
      + '<div style="font-size:0.6rem;color:' + (unlocked ? 'var(--gold)' : 'var(--dim)') + ';margin-top:2px;">' + (b.name[nl] || b.name.fr) + '</div>'
      + '<div style="font-size:0.55rem;color:var(--dim);">' + b.xp + ' XP</div>'
      + '</div>';
  }).join('');

  var nextBadgeHTML = nextBadge
    ? '<div style="background:rgba(255,215,0,0.06);border:1px solid rgba(255,215,0,0.2);border-radius:12px;padding:12px;">'
      + '<div style="font-size:0.72rem;color:var(--gold);font-weight:800;margin-bottom:4px;">⚡ Prochain : ' + nextBadge.icon + ' ' + (nextBadge.name[nl] || nextBadge.name.fr) + '</div>'
      + '<div style="font-size:0.68rem;color:var(--dim);">Il manque ' + xpToNext + ' XP</div>'
      + '<div style="height:5px;background:rgba(255,255,255,0.08);border-radius:3px;margin-top:8px;overflow:hidden;">'
      + '<div style="height:100%;width:' + Math.round((S.xp / nextBadge.xp) * 100) + '%;background:linear-gradient(90deg,#a86800,#ffd700);border-radius:3px;"></div>'
      + '</div></div>'
    : '<div style="text-align:center;padding:10px;color:var(--gold);font-family:Cinzel;font-size:0.9rem;">👑 Tous les badges débloqués!</div>';

  var missionsDetailHTML = Object.entries(MISSIONS).map(function(e) {
    var loc = e[0], ms = e[1];
    var rows = ms.map(function(m) {
      var d2 = S_missions.completed[m.id];
      return '<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.04);">'
        + '<span>' + m.icon + '</span>'
        + '<span style="flex:1;font-size:0.75rem;color:' + (d2 ? 'var(--green)' : 'var(--text)') + '">' + (m.title[nl] || m.title.fr) + '</span>'
        + '<span style="font-size:0.7rem;color:' + (d2 ? 'var(--green)' : 'var(--dim)') + '">' + (d2 ? '✅' : '+' + m.xp + ' XP') + '</span>'
        + '</div>';
    }).join('');
    var locName = (typeof LOC_NAMES !== 'undefined' && LOC_NAMES[loc]) ? (LOC_NAMES[loc][nl] || loc) : loc;
    return '<div style="margin-bottom:8px;">'
      + '<div style="font-size:0.68rem;color:var(--gold-dim);font-weight:800;margin-bottom:4px;">' + locName + '</div>'
      + rows + '</div>';
  }).join('');

  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9500;'
    + 'overflow-y:auto;display:flex;align-items:flex-start;justify-content:center;padding:20px;';
  overlay.innerHTML =
    '<div style="background:linear-gradient(135deg,#0f1a30,#0a0a14);border:1px solid var(--border);'
    + 'border-radius:24px;padding:24px;max-width:400px;width:100%;margin:auto;">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">'
    + '<div style="font-family:\'Cinzel\',serif;font-size:1.1rem;color:var(--gold);">📊 Ma Progression</div>'
    + '<button onclick="this.closest(\'div\').parentElement.remove()" style="background:transparent;border:1px solid var(--border);'
    + 'color:var(--dim);padding:4px 10px;border-radius:12px;cursor:pointer;font-size:0.75rem;">✕</button>'
    + '</div>'
    // Stats
    + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;">'
    + '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:12px;text-align:center;">'
    + '<div style="font-size:1.4rem;font-weight:900;color:var(--gold);">' + S.xp + '</div>'
    + '<div style="font-size:0.65rem;color:var(--dim);">XP Total</div></div>'
    + '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:12px;text-align:center;">'
    + '<div style="font-size:1.4rem;font-weight:900;color:#4a9eff;">' + S_missions.gems + '</div>'
    + '<div style="font-size:0.65rem;color:var(--dim);">💎 Gemmes</div></div>'
    + '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:12px;text-align:center;">'
    + '<div style="font-size:1.4rem;font-weight:900;color:var(--green)">' + done + '/' + totalMissions + '</div>'
    + '<div style="font-size:0.65rem;color:var(--dim);">Missions</div></div>'
    + '</div>'
    // Streak
    + (typeof S_streak !== 'undefined'
      ? '<div style="background:rgba(255,159,67,0.08);border:1px solid rgba(255,159,67,0.25);border-radius:12px;padding:12px;margin-bottom:20px;display:flex;align-items:center;gap:12px;">'
        + '<span style="font-size:1.8rem;">🔥</span>'
        + '<div><div style="font-weight:900;font-size:0.9rem;color:#ff9f43;">' + S_streak.current + ' jours consécutifs</div>'
        + '<div style="font-size:0.68rem;color:var(--dim);">Record : ' + S_streak.best + ' jours &middot; Bouclier : ' + S_streak.shield + '</div></div>'
        + '</div>'
      : '')
    // Barre missions
    + '<div style="margin-bottom:20px;">'
    + '<div style="display:flex;justify-content:space-between;font-size:0.72rem;color:var(--dim);margin-bottom:6px;">'
    + '<span>Missions complétées</span><span>' + pct + '%</span></div>'
    + '<div style="height:8px;background:rgba(255,255,255,0.08);border-radius:4px;overflow:hidden;">'
    + '<div style="height:100%;width:' + pct + '%;background:linear-gradient(90deg,#4ecf70,#4a9eff);border-radius:4px;transition:width 0.5s;"></div>'
    + '</div></div>'
    // Badges
    + '<div style="margin-bottom:20px;">'
    + '<div style="font-size:0.75rem;color:var(--dim);letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">🏅 Badges</div>'
    + '<div style="display:flex;gap:8px;flex-wrap:wrap;">' + badgesHTML + '</div>'
    + '</div>'
    + nextBadgeHTML
    // Missions détail
    + '<div style="margin-top:16px;">'
    + '<div style="font-size:0.75rem;color:var(--dim);letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">🎯 Toutes les missions</div>'
    + missionsDetailHTML
    + '</div>'
    // Bouton boutique
    + '<button onclick="this.closest(\'div\').parentElement.remove();openShop()" '
    + 'style="width:100%;margin-top:16px;background:rgba(255,215,0,0.1);border:1px solid var(--gold);'
    + 'color:var(--gold);padding:10px;border-radius:14px;cursor:pointer;font-weight:800;'
    + 'font-family:\'Nunito\',sans-serif;font-size:0.85rem;">🏪 Ouvrir la Boutique</button>'
    + '</div>';

  document.body.appendChild(overlay);
}

// =================================================================
// BOUTIQUE DE GEMMES
// =================================================================
const SHOP_ITEMS = [
  {id:'hint_x5',    icon:'💡', price:2,
   name:{fr:'5 indices gratuits',    en:'5 free hints',       es:'5 pistas gratis',    ht:'5 endis gratis',      de:'5 kostenlose Tipps',  ru:'5 бесплатных подсказок', zh:'5次免费提示', ja:'5回無料ヒント'},
   desc:{fr:'Débloque 5 indices sans consommer de gemmes',en:'Use 5 hints for free',es:'Usa 5 pistas gratis',ht:'Itilize 5 endis gratis',de:'5 Tipps kostenlos nutzen',ru:'5 подсказок бесплатно',zh:'免费使用5次提示',ja:'5回ヒントを無料で使用'}},
  {id:'shield',     icon:'🛡️', price:3,
   name:{fr:'Bouclier de streak',    en:'Streak shield',      es:'Escudo de racha',    ht:'Bouclier streak',     de:'Streak-Schutzschild',  ru:'Защита серии',           zh:'连胜保护盾',  ja:'ストリーク盾'},
   desc:{fr:'Protège ton streak si tu rates un jour',en:'Protects streak for 1 day',es:'Protege tu racha 1 día',ht:'Pwoteje streak ou 1 jou',de:'Schützt Streak für 1 Tag',ru:'Защищает серию на 1 день',zh:'保护一天连胜',ja:'1日ストリーク保護'}},
  {id:'xp_boost',   icon:'⚡', price:4,
   name:{fr:'Double XP — 1 heure',   en:'Double XP — 1h',     es:'Doble XP — 1h',      ht:'Double XP — 1h',      de:'Doppel-XP — 1h',       ru:'Двойной XP — 1ч',        zh:'双倍XP-1小时', ja:'ダブルXP-1時間'},
   desc:{fr:'Tous tes XP sont doublés pendant 60 min',en:'Double XP for 60 minutes',es:'XP doble por 60 min',ht:'Double XP pou 60 minit',de:'Doppel-XP für 60 Min.',ru:'Двойной XP 60 минут',zh:'60分钟双倍XP',ja:'60分間ダブルXP'}},
  {id:'translate_x5',icon:'🔤',price:1,
   name:{fr:'5 traductions flash',   en:'5 flash translations',es:'5 traducciones flash',ht:'5 tradiksyon flash', de:'5 Schnellübersetzungen',ru:'5 быстрых переводов',     zh:'5次快速翻译', ja:'5回クイック翻訳'},
   desc:{fr:'Traductions instantanées sans limite de temps',en:'Instant translations ×5',es:'Traducciones instantáneas ×5',ht:'Tradiksyon imedyat ×5',de:'Sofortübersetzungen ×5',ru:'Мгновенный перевод ×5',zh:'即时翻译×5',ja:'即時翻訳×5'}},
];

function openShop() {
  var nl = S.nativeLang || 'fr';
  var overlay = document.createElement('div');
  overlay.id  = 'shopOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9500;'
    + 'display:flex;align-items:center;justify-content:center;padding:20px;';

  overlay.innerHTML =
    '<div style="background:linear-gradient(135deg,#0f0a20,#0a0a14);border:1px solid var(--gold);'
    + 'border-radius:24px;padding:24px;max-width:380px;width:100%;max-height:90vh;overflow-y:auto;">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">'
    + '<span style="font-family:\'Cinzel\',serif;color:var(--gold);font-size:1rem;">🏪 Boutique</span>'
    + '<span style="color:var(--gold);font-weight:900;font-size:0.9rem;">💎 ' + S_missions.gems + '</span>'
    + '</div>'
    + SHOP_ITEMS.map(function(item) {
        var canBuy  = S_missions.gems >= item.price;
        var name    = item.name[nl] || item.name.fr;
        var desc    = item.desc[nl] || item.desc.fr;
        return '<div style="display:flex;align-items:center;gap:12px;padding:12px;'
          + 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,215,0,0.15);'
          + 'border-radius:12px;margin-bottom:8px;">'
          + '<span style="font-size:1.6rem;flex-shrink:0;">' + item.icon + '</span>'
          + '<div style="flex:1;">'
          + '<div style="font-weight:800;font-size:0.85rem;color:var(--text);">' + name + '</div>'
          + '<div style="font-size:0.7rem;color:var(--dim);line-height:1.4;">' + desc + '</div>'
          + '</div>'
          + '<button onclick="buyItem(\'' + item.id + '\',' + item.price + ')"'
          + ' style="background:' + (canBuy ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)') + ';'
          + 'border:1px solid ' + (canBuy ? 'var(--gold)' : 'var(--border)') + ';'
          + 'border-radius:10px;color:' + (canBuy ? 'var(--gold)' : 'var(--dim)') + ';'
          + 'padding:5px 12px;cursor:' + (canBuy ? 'pointer' : 'not-allowed') + ';'
          + 'font-weight:800;font-family:\'Nunito\',sans-serif;font-size:0.82rem;flex-shrink:0;">'
          + '💎 ' + item.price
          + '</button></div>';
      }).join('')
    + '<button onclick="document.getElementById(\'shopOverlay\').remove()" '
    + 'style="width:100%;margin-top:8px;background:transparent;border:1px solid var(--border);'
    + 'color:var(--dim);padding:8px;border-radius:12px;cursor:pointer;font-family:\'Nunito\',sans-serif;">'
    + 'Fermer</button>'
    + '</div>';

  document.body.appendChild(overlay);
}

function buyItem(id, price) {
  if (S_missions.gems < price) {
    showNotif('💎 Gemmes insuffisantes !');
    return;
  }
  S_missions.gems -= price;

  var gd = document.getElementById('gemDisplay');
  if (gd) gd.textContent = '💎 ' + S_missions.gems;

  if (id === 'shield'      && typeof S_streak !== 'undefined') {
    S_streak.shield++;
    showNotif('🛡️ Bouclier de streak activé !');
  }
  if (id === 'hint_x5')    { S.freeHints  = (S.freeHints  || 0) + 5;  showNotif('💡 5 indices débloqués !'); }
  if (id === 'xp_boost')   { S.xpBoostEnd = Date.now() + 3600000;      showNotif('⚡ Double XP pendant 1h !'); }
  if (id === 'translate_x5'){ S.freeTranslations = (S.freeTranslations || 0) + 5; showNotif('🔤 5 traductions flash !'); }

  // Rafraîchir la boutique si elle est encore ouverte
  var shopEl = document.getElementById('shopOverlay');
  if (shopEl) { shopEl.remove(); openShop(); }

  if (typeof saveGame === 'function') saveGame();
     }
