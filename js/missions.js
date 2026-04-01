/* =================================================================
   missions.js — LinguaVillage
   Système de missions, récompenses et progression
   Dépendances: app.js (S, gainXP, showNotif, showScreen)
   ================================================================= */

// MISSIONS SYSTEM 🎯
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
    {id:'m9', icon:'💶', xp:35, gem:1,
     title:{fr:'Retire de l\'argent',en:'Withdraw money',es:'Saca dinero',ht:'Retire lajan',de:'Hebe Geld ab',ru:'Сними деньги',zh:'取款',ja:'お金を引き出す'},
     desc:{fr:'Demande à retirer de l\'argent au guichet',en:'Ask to withdraw money at the counter',es:'Pide retirar dinero en la ventanilla',ht:'Mande retire lajan nan fenèt la',de:'Bitte um Geldabhebung am Schalter',ru:'Попроси снять деньги',zh:'在柜台申请取款',ja:'窓口でお金を引き出す'},
     hint:{fr:'"Je voudrais retirer ___"',en:'"I\'d like to withdraw ___"',es:'"Quisiera retirar ___"',ht:'"Mwen ta renmen retire ___"',de:'"Ich möchte ___ abheben"',ru:'"Хочу снять ___"',zh:'"我想取___"',ja:'「___を引き出したいのですが」'},
     check:['retirer','withdraw','retirar','retire','abheben','снять','取','引き出']},
  ],
  hospital:[
    {id:'m10', icon:'🩺', xp:40, gem:1,
     title:{fr:'Décris tes symptômes',en:'Describe your symptoms',es:'Describe tus síntomas',ht:'Dekri sentòm ou',de:'Beschreibe deine Symptome',ru:'Опиши симптомы',zh:'描述症状',ja:'症状を説明する'},
     desc:{fr:'Dis au médecin où tu as mal',en:'Tell the doctor where it hurts',es:'Dile al médico dónde te duele',ht:'Di doktè a kote ou fè mal',de:'Sag dem Arzt wo es wehtut',ru:'Скажи врачу что болит',zh:'告诉医生哪里痛',ja:'医者に痛い場所を伝える'},
     hint:{fr:'"J\'ai mal à ___"',en:'"My ___ hurts"',es:'"Me duele el/la ___"',ht:'"___ mwen fè mal"',de:'"Mein ___ tut weh"',ru:'"У меня болит ___"',zh:'"我___痛"',ja:'「___が痛いです」'},
     check:['mal','hurts','duele','fè mal','weh','болит','痛','痛い']},
    {id:'m11', icon:'💊', xp:45, gem:2,
     title:{fr:'Demande une ordonnance',en:'Ask for a prescription',es:'Pide una receta',ht:'Mande yon òdonans',de:'Bitte um ein Rezept',ru:'Попроси рецепт',zh:'要处方',ja:'処方箋をもらう'},
     desc:{fr:'Demande au médecin de te prescrire un médicament',en:'Ask the doctor to prescribe medicine',es:'Pide al médico que te recete',ht:'Mande doktè a ekri yon preskripsyon',de:'Bitte den Arzt um ein Rezept',ru:'Попроси доктора выписать лекарство',zh:'请医生开药',ja:'医者に薬を処方してもらう'},
     hint:{fr:'"Pouvez-vous me prescrire ___?"',en:'"Can you prescribe ___ for me?"',es:'"¿Me puede recetar ___?"',ht:'"Èske ou ka ekri ___ pou mwen?"',de:'"Können Sie mir ___ verschreiben?"',ru:'"Пропишите мне, пожалуйста, ___"',zh:'"能给我开___吗?"',ja:'「___を処方してもらえますか?」'},
     check:['prescrire','prescribe','recetar','ekri','verschreiben','прописать','开','処方']},
  ],
  school:[
    {id:'m12', icon:'📚', xp:35, gem:1,
     title:{fr:'Pose une question en classe',en:'Ask a question in class',es:'Haz una pregunta en clase',ht:'Poze yon kesyon nan klas',de:'Stell eine Frage im Unterricht',ru:'Задай вопрос на уроке',zh:'在课堂上提问',ja:'授業で質問する'},
     desc:{fr:'Demande au professeur d\'expliquer quelque chose',en:'Ask the teacher to explain something',es:'Pide al profesor que explique algo',ht:'Mande pwofesè a eksplike yon bagay',de:'Bitte den Lehrer etwas zu erklären',ru:'Попроси учителя объяснить',zh:'请老师解释某件事',ja:'先生に何かを説明してもらう'},
     hint:{fr:'"Pouvez-vous expliquer ___?"',en:'"Can you explain ___?"',es:'"¿Puede explicar ___?"',ht:'"Èske ou ka eksplike ___?"',de:'"Können Sie ___ erklären?"',ru:'"Объясните, пожалуйста, ___"',zh:'"能解释一下___吗?"',ja:'「___を説明してもらえますか?」'},
     check:['expliquer','explain','explicar','eksplike','erklären','объясните','解释','説明']},
    {id:'m13', icon:'✏️', xp:50, gem:2,
     title:{fr:'Écris une phrase complète',en:'Write a complete sentence',es:'Escribe una oración completa',ht:'Ekri yon fraz konplè',de:'Schreib einen vollständigen Satz',ru:'Напиши полное предложение',zh:'写一个完整的句子',ja:'完全な文を書く'},
     desc:{fr:'Écris 5 mots minimum en langue cible',en:'Write at least 5 words in target language',es:'Escribe al menos 5 palabras',ht:'Ekri omwen 5 mo',de:'Schreib mindestens 5 Wörter',ru:'Напиши минимум 5 слов',zh:'用目标语言写至少5个词',ja:'目標言語で5語以上書く'},
     hint:{fr:'Sujet + Verbe + Complément + ...',en:'Subject + Verb + Object + ...',es:'Sujeto + Verbo + Complemento + ...',ht:'Sijè + Vèb + Konplèman + ...',de:'Subjekt + Verb + Objekt + ...',ru:'Подлежащее + Глагол + Дополнение',zh:'主语+动词+宾语+...',ja:'主語+動詞+目的語+...'},
     check:['je ','i ','yo ','ich ','я ','我 ','は ']},
  ],
  police:[
    {id:'m14', icon:'🗺️', xp:30, gem:1,
     title:{fr:'Demande ton chemin',en:'Ask for directions',es:'Pide indicaciones',ht:'Mande chemen ou',de:'Frag nach dem Weg',ru:'Спроси дорогу',zh:'问路',ja:'道を聞く'},
     desc:{fr:'Demande comment aller à un endroit précis',en:'Ask how to get to a specific place',es:'Pregunta cómo llegar a un lugar',ht:'Mande kijan pou rive nan yon kote',de:'Frage wie man zu einem Ort kommt',ru:'Спроси как добраться до места',zh:'询问如何到达某个地方',ja:'特定の場所への行き方を聞く'},
     hint:{fr:'"Comment aller à ___?"',en:'"How do I get to ___?"',es:'"¿Cómo llego a ___?"',ht:'"Kijan pou rive nan ___?"',de:'"Wie komme ich zu ___?"',ru:'"Как добраться до ___?"',zh:'"怎么去___?"',ja:'「___への行き方は？」'},
     check:['comment','how','cómo','kijan','wie','как','怎么','どうやって']},
    {id:'m15', icon:'🚨', xp:60, gem:3,
     title:{fr:'Signale une urgence',en:'Report an emergency',es:'Reporta una emergencia',ht:'Rapòte yon ijans',de:'Melde einen Notfall',ru:'Сообщи о чрезвычайной ситуации',zh:'报告紧急情况',ja:'緊急事態を報告する'},
     desc:{fr:'Décris une situation d\'urgence et demande de l\'aide',en:'Describe an emergency and ask for help',es:'Describe una emergencia y pide ayuda',ht:'Dekri yon ijans epi mande èd',de:'Beschreibe einen Notfall und bitte um Hilfe',ru:'Опиши чрезвычайную ситуацию и попроси помощь',zh:'描述紧急情况并请求帮助',ja:'緊急事態を説明して助けを求める'},
     hint:{fr:'"Au secours! J\'ai besoin d\'aide!"',en:'"Help! I need help!"',es:'"¡Ayuda! ¡Necesito ayuda!"',ht:'"Ede m! Mwen bezwen èd!"',de:'"Hilfe! Ich brauche Hilfe!"',ru:'"Помогите! Мне нужна помощь!"',zh:'"救命！我需要帮助！"',ja:'「助けて！助けが必要です！」'},
     check:['secours','help','ayuda','ede','hilfe','помогите','救命','助けて']},
  ],
  farm:[
    {id:'m16', icon:'🌱', xp:30, gem:1,
     title:{fr:'Identifie 5 plantes',en:'Identify 5 plants',es:'Identifica 5 plantas',ht:'Idantifye 5 plant',de:'Benenne 5 Pflanzen',ru:'Назови 5 растений',zh:'认识5种植物',ja:'植物を5つ特定する'},
     desc:{fr:'Nomme 5 plantes ou légumes en langue cible',en:'Name 5 plants or vegetables',es:'Nombra 5 plantas o verduras',ht:'Nonmen 5 plant oswa legim',de:'Nenne 5 Pflanzen oder Gemüse',ru:'Назови 5 растений или овощей',zh:'用目标语言说出5种植物或蔬菜',ja:'目標言語で植物や野菜を5つ言う'},
     hint:{fr:'tomate, carotte, herbe, fleur...',en:'tomato, carrot, grass, flower...',es:'tomate, zanahoria, hierba...',ht:'tomat, kawòt, zèb, flè...',de:'Tomate, Karotte, Gras, Blume...',ru:'томат, морковь, трава, цветок...',zh:'西红柿、胡萝卜、草、花...',ja:'トマト、にんじん、草、花...'},
     check:['tomate','tomato','carrot','kawòt','karotte','томат','西红柿','トマト']},
    {id:'m17', icon:'🐄', xp:40, gem:1,
     title:{fr:'Parle des animaux de la ferme',en:'Talk about farm animals',es:'Habla de animales de granja',ht:'Pale de bèt fèm',de:'Sprich über Nutztiere',ru:'Поговори о животных',zh:'谈论农场动物',ja:'農場の動物について話す'},
     desc:{fr:'Cite et décris 4 animaux de la ferme',en:'Name and describe 4 farm animals',es:'Cita y describe 4 animales',ht:'Site ak dekri 4 bèt fèm',de:'Nenne und beschreibe 4 Nutztiere',ru:'Назови и опиши 4 животных',zh:'说出并描述4种农场动物',ja:'農場の動物を4つ言って説明する'},
     hint:{fr:'vache, cochon, poulet, mouton...',en:'cow, pig, chicken, sheep...',es:'vaca, cerdo, pollo, oveja...',ht:'vach, kochon, poul, mouton...',de:'Kuh, Schwein, Huhn, Schaf...',ru:'корова, свинья, курица, овца...',zh:'牛、猪、鸡、羊...',ja:'牛、豚、鶏、羊...'},
     check:['vache','cow','vaca','vach','kuh','корова','牛','うし']},
  ],
  friends:[
    {id:'m18', icon:'🎂', xp:35, gem:1,
     title:{fr:'Souhaite un anniversaire',en:'Wish happy birthday',es:'Felicita el cumpleaños',ht:'Swete yon bon fèt',de:'Wünsche alles Gute zum Geburtstag',ru:'Поздравь с днём рождения',zh:'祝生日快乐',ja:'誕生日を祝う'},
     desc:{fr:'Dis joyeux anniversaire et offre un message',en:'Say happy birthday and offer a message',es:'Di feliz cumpleaños con un mensaje',ht:'Di bon fèt ak yon mesaj',de:'Sag alles Gute und schreib eine Nachricht',ru:'Поздравь и скажи пожелание',zh:'说生日快乐并送上祝福',ja:'誕生日おめでとうとメッセージを贈る'},
     hint:{fr:'"Joyeux anniversaire! Je te souhaite ___"',en:'"Happy birthday! I wish you ___"',es:'"¡Feliz cumpleaños! Te deseo ___"',ht:'"Bon fèt! Mwen swete ou ___"',de:'"Alles Gute! Ich wünsche dir ___"',ru:'"С днём рождения! Желаю тебе ___"',zh:'"生日快乐！祝你___"',ja:'「誕生日おめでとう！___を願っています」'},
     check:['anniversaire','birthday','cumpleaños','fèt','geburtstag','рождения','生日','誕生日']},
    {id:'m19', icon:'🤗', xp:50, gem:2,
     title:{fr:'Invite un ami à sortir',en:'Invite a friend out',es:'Invita a un amigo a salir',ht:'Envite yon zanmi pou soti',de:'Lade einen Freund ein',ru:'Пригласи друга',zh:'邀请朋友出去',ja:'友達を誘う'},
     desc:{fr:'Propose une activité à ton ami',en:'Suggest an activity to your friend',es:'Propón una actividad a tu amigo',ht:'Pwopoze yon aktivite bay zanmi ou',de:'Schlage deinem Freund eine Aktivität vor',ru:'Предложи другу занятие',zh:'向朋友提议一项活动',ja:'友達に活動を提案する'},
     hint:{fr:'"Tu veux ___ avec moi?"',en:'"Do you want to ___ with me?"',es:'"¿Quieres ___ conmigo?"',ht:'"Ou vle ___ avè m?"',de:'"Willst du ___ mit mir?"',ru:'"Хочешь ___ со мной?"',zh:'"你想和我一起___吗?"',ja:'「一緒に___しませんか?」'},
     check:['veux','want','quieres','vle','willst','хочешь','想','したい']},
  ],
  park:[
    {id:'m20', icon:'💝', xp:60, gem:3,
     title:{fr:'Fais un compliment sincère',en:'Give a sincere compliment',es:'Haz un cumplido sincero',ht:'Fè yon konpliman sensè',de:'Mach ein aufrichtiges Kompliment',ru:'Сделай искренний комплимент',zh:'给出真诚的赞美',ja:'心からの褒め言葉を言う'},
     desc:{fr:'Dis quelque chose de beau à ton partenaire',en:'Say something beautiful to your partner',es:'Di algo bonito a tu pareja',ht:'Di yon bèl bagay bay patnè ou',de:'Sag deinem Partner etwas Schönes',ru:'Скажи что-то красивое партнёру',zh:'对伴侣说一些美好的话',ja:'パートナーに美しいことを言う'},
     hint:{fr:'"Tu es ___ parce que ___"',en:'"You are ___ because ___"',es:'"Eres ___ porque ___"',ht:'"Ou ___ paske ___"',de:'"Du bist ___ weil ___"',ru:'"Ты ___ потому что ___"',zh:'"你___因为___"',ja:'「あなたは___です、なぜなら___」'},
     check:['magnifique','beautiful','hermoso','bèl','wunderschön','красивый','美','美しい']},
  ],
  church:[
    {id:'m21', icon:'🙏', xp:25, gem:1,
     title:{fr:'Utilise le vouvoiement',en:'Use formal "you"',es:'Usa el "usted" formal',ht:'Itilize fòm poli',de:'Benutze Sie-Form',ru:'Используй «Вы»',zh:'使用正式称呼',ja:'丁寧語を使う'},
     desc:{fr:'Parle formellement au pasteur (vous/Sie/usted)',en:'Speak formally using polite form',es:'Habla formalmente con el pastor',ht:'Pale poli ak pastè a',de:'Spreche formal mit dem Pastor',ru:'Говори уважительно с пастором',zh:'用正式语言和牧师交谈',ja:'牧師に丁寧語で話す'},
     hint:{fr:'"Bonjour Monsieur, comment allez-vous?"',en:'"Good morning, how are you? (formal)"',es:'"Buenos días, ¿cómo está usted?"',ht:'"Bonjou Mesye, kijan ou ye?"',de:'"Guten Morgen, wie geht es Ihnen?"',ru:'"Добрый день, как Вы?"',zh:'"您好，您好吗?"',ja:'「おはようございます、お元気ですか？」'},
     check:['allez-vous','how are you','está usted','wie geht es Ihnen','как вы','您好','お元気']},
  ],
  cinema:[
    {id:'m22', icon:'🎬', xp:40, gem:2,
     title:{fr:'Résume un film',en:'Summarize a film',es:'Resume una película',ht:'Rezime yon fim',de:'Fasse einen Film zusammen',ru:'Расскажи о фильме',zh:'总结一部电影',ja:'映画を要約する'},
     desc:{fr:'Décris en 3 phrases un film ou extrait vu au cinéma',en:'Describe in 3 sentences a film you watched',es:'Describe en 3 frases una película vista',ht:'Dekri nan 3 fraz yon fim ou wè',de:'Beschreibe in 3 Sätzen einen gesehenen Film',ru:'Опиши фильм тремя предложениями',zh:'用3句话描述一部你看过的电影',ja:'見た映画を3文で説明する'},
     hint:{fr:'"Ce film parle de ___, il se passe ___"',en:'"This film is about ___, it takes place ___"',es:'"Esta película trata de ___, ocurre ___"',ht:'"Fim sa pale de ___, li pase ___"',de:'"Dieser Film handelt von ___, spielt in ___"',ru:'"Этот фильм о ___, происходит в ___"',zh:'"这部电影讲的是___，发生在___"',ja:'「この映画は___について、___が舞台」'},
     check:['parle','about','trata','pale','handelt','о том','讲','ついて']},
  ],
};

// Récompenses par niveau
const REWARDS = {
  gem:{
    1: {icon:'💎', name:{fr:'Gemme',en:'Gem',es:'Gema',ht:'Jèm',de:'Edelstein',ru:'Камень',zh:'宝石',ja:'宝石'}},
    2: {icon:'💎💎', name:{fr:'Double Gemme',en:'Double Gem',es:'Doble Gema',ht:'Dòb Jèm',de:'Doppelstein',ru:'Двойной камень',zh:'双宝石',ja:'ダブル宝石'}},
    3: {icon:'💎💎💎', name:{fr:'Triple Gemme',en:'Triple Gem',es:'Triple Gema',ht:'Trip Jèm',de:'Dreifachstein',ru:'Тройной камень',zh:'三重宝石',ja:'トリプル宝石'}},
  },
  badges:[
    {id:'b1', xp:100,  icon:'🌱', name:{fr:'Apprenti',en:'Apprentice',es:'Aprendiz',ht:'Apranti',de:'Azubi',ru:'Ученик',zh:'学徒',ja:'見習い'}},
    {id:'b2', xp:300,  icon:'⭐', name:{fr:'Explorateur',en:'Explorer',es:'Explorador',ht:'Eksploratè',de:'Entdecker',ru:'Исследователь',zh:'探险家',ja:'探検家'}},
    {id:'b3', xp:600,  icon:'🏅', name:{fr:'Voyageur',en:'Traveler',es:'Viajero',ht:'Vwayajè',de:'Reisender',ru:'Путешественник',zh:'旅行者',ja:'旅人'}},
    {id:'b4', xp:1000, icon:'🏆', name:{fr:'Champion',en:'Champion',es:'Campeón',ht:'Chanpyon',de:'Champion',ru:'Чемпион',zh:'冠军',ja:'チャンピオン'}},
    {id:'b5', xp:2000, icon:'👑', name:{fr:'Maître des Langues',en:'Language Master',es:'Maestro de Idiomas',ht:'Mèt Lang',de:'Sprachmeister',ru:'Мастер языков',zh:'语言大师',ja:'言語マスター'}},
  ],
};

// État missions
let S_missions = {
  completed: {},  // {missionId: true}
  gems: 0,
  badges: [],
};

function getMissionsForLoc(locId){
  return MISSIONS[locId] || [];
}

function openMissionsPanel(locId){
  const missions = getMissionsForLoc(locId);
  if(!missions.length) return;
  const nl = S.nativeLang || 'fr';
  const panel = document.getElementById('missionsPanel');
  if(!panel) return;

  // Header
  let html = '<div style="padding:12px 16px 8px;background:rgba(255,215,0,0.06);border-bottom:1px solid var(--border);">'
    + '<div style="font-family:Cinzel,serif;font-size:0.9rem;color:var(--gold);margin-bottom:2px;">🎯 Missions</div>'
    + '<div style="font-size:0.68rem;color:var(--dim)">💎 ' + S_missions.gems + ' gemmes &middot; ' + Object.keys(S_missions.completed).length + ' missions complètes</div>'
    + '</div><div style="overflow-y:auto;max-height:220px;padding:8px;">';

  missions.forEach(function(m){
    var done = S_missions.completed[m.id];
    var title = (m.title[nl]||m.title.fr||'').replace(/'/g,"&apos;");
    var desc  = (m.desc[nl] ||m.desc.fr ||'').replace(/'/g,"&apos;");
    var hint  = (m.hint[nl] ||m.hint.fr ||'').replace(/'/g,"&apos;");
    var xpBadge = done ? '&#x2705;' : ('+'+m.xp+' XP &middot; '+'💎'.repeat(m.gem));
    var clickAttr = done ? '' : ('onclick="startMission(\'' + m.id + '\',\'' + locId + '\')"');
    html += '<div style="background:' + (done?'rgba(78,207,112,0.08)':'var(--bg-card)')
      + ';border:1px solid ' + (done?'rgba(78,207,112,0.3)':'var(--border)')
      + ';border-radius:12px;padding:10px 12px;margin-bottom:7px;cursor:'+(done?'default':'pointer')+';transition:all 0.2s;" '
      + clickAttr + '>'
      + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">'
      + '<span style="font-size:1.2rem">'+m.icon+'</span>'
      + '<span style="font-weight:900;font-size:0.85rem;color:'+(done?'var(--green)':'var(--text)')+'">'+title+'</span>'
      + '<span style="margin-left:auto;font-size:0.7rem;color:'+(done?'var(--green)':'var(--gold)')+'">'+xpBadge+'</span>'
      + '</div>'
      + '<div style="font-size:0.72rem;color:var(--dim)">'+desc+'</div>'
      + (done ? '' : '<div style="font-size:0.68rem;color:rgba(255,215,0,0.6);margin-top:5px;font-style:italic">💡 '+hint+'</div>')
      + '</div>';
  });

  html += '</div>';
  panel.innerHTML = html;
  panel.style.display = 'block';
}

let activeMission = null;
function startMission(missionId, locId){
  const missions = getMissionsForLoc(locId);
  activeMission = missions.find(m=>m.id===missionId);
  if(!activeMission) return;
  const nl = S.nativeLang || 'fr';
  showNotif('🎯 Mission: '+activeMission.title[nl]||activeMission.title.fr);
  // Highlight input
  const inp = document.getElementById('dialInput');
  if(inp){
    inp.placeholder = '💡 '+( activeMission.hint[nl]||activeMission.hint.fr);
    inp.style.borderColor='var(--gold)';
  }
}

function checkMissionInMessage(text){
  if(!activeMission) return;
  const lower = text.toLowerCase();
  const done = activeMission.check.some(kw=>lower.includes(kw.toLowerCase()));
  if(done){
    completeMission(activeMission);
    activeMission = null;
    const inp = document.getElementById('dialInput');
    if(inp){inp.placeholder='Votre réponse...';inp.style.borderColor='';}
  }
}

function completeMission(mission){
  if(S_missions.completed[mission.id]) return;
  S_missions.completed[mission.id] = true;
  S_missions.gems += mission.gem;
  gainXP(mission.xp);
  // Update gem display
  const gd = document.getElementById('gemDisplay');
  if(gd) gd.textContent = '💎 '+S_missions.gems;
  // Check badges
  checkBadges();
  // Celebrate
  const nl = S.nativeLang||'fr';
  showMissionReward(mission, nl);
}

function showMissionReward(mission, nl){
  const overlay = document.createElement('div');
  overlay.style.cssText=`position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s;`;
  overlay.innerHTML=`
    <div style="background:linear-gradient(135deg,#1a0a2e,#0a0a14);border:2px solid var(--gold);border-radius:24px;padding:28px 32px;text-align:center;max-width:300px;animation:popIn 0.4s;">
      <div style="font-size:3rem;margin-bottom:8px;">${mission.icon}</div>
      <div style="font-family:'Cinzel',serif;color:var(--gold);font-size:1.1rem;margin-bottom:4px;">✅ Mission réussie!</div>
      <div style="color:var(--text);font-size:0.9rem;font-weight:800;margin-bottom:12px;" id="missionRewardTitle"></div>
      <div style="display:flex;justify-content:center;gap:16px;margin-bottom:16px;">
        <span style="background:rgba(255,215,0,0.15);border:1px solid var(--gold);border-radius:12px;padding:6px 14px;color:var(--gold);font-weight:900;">+${mission.xp} XP ⭐</span>
        <span style="background:rgba(100,200,255,0.15);border:1px solid #4a9eff;border-radius:12px;padding:6px 14px;color:#4a9eff;font-weight:900;">${'💎'.repeat(mission.gem)} x${mission.gem}</span>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" style="background:linear-gradient(135deg,#a86800,#ffd700);border:none;border-radius:12px;padding:10px 28px;font-family:'Cinzel',serif;font-weight:700;cursor:pointer;font-size:0.85rem;">🎉 Super!</button>
    </div>`;
  document.body.appendChild(overlay);
  var rt=document.getElementById('missionRewardTitle');
  if(rt) rt.textContent = mission.title[nl]||mission.title.fr;
  setTimeout(()=>overlay.remove(),4000);
  // Confetti effect
  launchConfetti();
}

function launchConfetti(){
  const colors=['#FFD700','#4ecf70','#4a9eff','#e040fb','#ff6b6b'];
  for(let i=0;i<40;i++){
    const c=document.createElement('div');
    const color=colors[Math.floor(Math.random()*colors.length)];
    c.style.cssText=`position:fixed;width:8px;height:8px;background:${color};border-radius:50%;
      left:${Math.random()*100}%;top:-10px;z-index:10000;
      animation:confettiFall ${1+Math.random()*2}s linear forwards;animation-delay:${Math.random()*0.5}s;`;
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),3000);
  }
}

function checkBadges(){
  REWARDS.badges.forEach(badge=>{
    if(!S_missions.badges.includes(badge.id) && S.xp>=badge.xp){
      S_missions.badges.push(badge.id);
      showBadgeUnlocked(badge);
    }
  });
}

function showBadgeUnlocked(badge){
  const nl = S.nativeLang||'fr';
  setTimeout(()=>{
    showNotif(badge.icon+' Badge débloqué: '+(badge.name[nl]||badge.name.fr));
  },2000);
}

// Progression screen
function showProgression(){
  var nl = S.nativeLang||'fr';
  var totalMissions = Object.values(MISSIONS).flat().length;
  var done = Object.keys(S_missions.completed).length;
  var pct = Math.round((done/totalMissions)*100);
  var nextBadge = REWARDS.badges.find(function(b){return S.xp>=b.xp && S_missions.badges.indexOf(b.id)<0;});
  var xpToNext = nextBadge ? nextBadge.xp - S.xp : 0;

  var overlay = document.createElement('div');
  overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9500;overflow-y:auto;display:flex;align-items:center;justify-content:center;padding:20px;';

  var badgesHTML = REWARDS.badges.map(function(b){
    var unlocked = S_missions.badges.includes(b.id);
    var name = (b.name[nl]||b.name.fr||'').replace(/'/g,"&apos;");
    return '<div style="background:'+(unlocked?'rgba(255,215,0,0.12)':'rgba(255,255,255,0.04)')
      +';border:1px solid '+(unlocked?'var(--gold)':'var(--border)')
      +';border-radius:12px;padding:8px 12px;text-align:center;opacity:'+(unlocked?1:0.4)+';">'
      +'<div style="font-size:1.3rem;">'+b.icon+'</div>'
      +'<div style="font-size:0.6rem;color:'+(unlocked?'var(--gold)':'var(--dim)')+';margin-top:2px;">'+name+'</div>'
      +'<div style="font-size:0.55rem;color:var(--dim);">'+b.xp+' XP</div></div>';
  }).join('');

  var missionsDetail = Object.entries(MISSIONS).map(function(entry){
    var loc=entry[0], ms=entry[1];
    var locName = ((LOC_NAMES[loc]||{})[nl]||loc).replace(/'/g,"&apos;");
    var rows = ms.map(function(m){
      var d2=S_missions.completed[m.id];
      var t=(m.title[nl]||m.title.fr||'').replace(/'/g,"&apos;");
      return '<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.04);">'
        +'<span>'+m.icon+'</span>'
        +'<span style="flex:1;font-size:0.75rem;color:'+(d2?'var(--green)':'var(--text)')+'">'+t+'</span>'
        +'<span style="font-size:0.7rem;color:'+(d2?'var(--green)':'var(--dim)')+'">'+( d2?'&#x2705;':'+'+m.xp+' XP')+'</span>'
        +'</div>';
    }).join('');
    return '<div style="margin-bottom:8px;"><div style="font-size:0.68rem;color:var(--gold-dim);font-weight:800;margin-bottom:4px;">'+locName+'</div>'+rows+'</div>';
  }).join('');

  var nextHTML = nextBadge
    ? '<div style="background:rgba(255,215,0,0.06);border:1px solid rgba(255,215,0,0.2);border-radius:12px;padding:12px;">'
      +'<div style="font-size:0.72rem;color:var(--gold);font-weight:800;margin-bottom:4px;">⚡ Prochain: '+(nextBadge.name[nl]||nextBadge.name.fr)+'</div>'
      +'<div style="font-size:0.68rem;color:var(--dim)">'+xpToNext+' XP restants</div>'
      +'<div style="height:5px;background:rgba(255,255,255,0.08);border-radius:3px;margin-top:8px;overflow:hidden;">'
      +'<div style="height:100%;width:'+Math.round((S.xp/nextBadge.xp)*100)+'%;background:linear-gradient(90deg,#a86800,#ffd700);border-radius:3px;"></div></div></div>'
    : '\<div style=\"text-align:center;padding:10px;color:var(--gold);font-family:Cinzel;font-size:0.9rem;\"\u003e\u0026#x1F451; Tous les badges!\u003c/div\u003e';

  overlay.innerHTML = '<div style="background:linear-gradient(135deg,#0f1a30,#0a0a14);border:1px solid var(--border);border-radius:24px;padding:24px;max-width:400px;width:100%;">'
    +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">'
    +'<div style="font-family:Cinzel,serif;font-size:1.1rem;color:var(--gold);">&#x1F4CA; Ma Progression</div>'
    +'<button onclick="this.closest('div[style*=position]').remove()" style="background:transparent;border:1px solid var(--border);color:var(--dim);padding:4px 10px;border-radius:12px;cursor:pointer;font-size:0.75rem;">&#x2715;</button>'
    +'</div>'
    +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;">'
    +'<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:12px;text-align:center;"><div style="font-size:1.4rem;font-weight:900;color:var(--gold);">'+S.xp+'</div><div style="font-size:0.65rem;color:var(--dim);">XP Total</div></div>'
    +'<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:12px;text-align:center;"><div style="font-size:1.4rem;font-weight:900;color:#4a9eff;">'+S_missions.gems+'</div><div style="font-size:0.65rem;color:var(--dim);">&#x1F48E; Gemmes</div></div>'
    +'<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:12px;text-align:center;"><div style="font-size:1.4rem;font-weight:900;color:var(--green);">'+done+'/'+totalMissions+'</div><div style="font-size:0.65rem;color:var(--dim);">Missions</div></div>'
    +'</div>'
    +'<div style="margin-bottom:20px;">'
    +'<div style="display:flex;justify-content:space-between;font-size:0.72rem;color:var(--dim);margin-bottom:6px;"><span>Missions</span><span>'+pct+'%</span></div>'
    +'<div style="height:8px;background:rgba(255,255,255,0.08);border-radius:4px;overflow:hidden;">'
    +'<div style="height:100%;width:'+pct+'%;background:linear-gradient(90deg,#4ecf70,#4a9eff);border-radius:4px;"></div></div></div>'
    +'<div style="margin-bottom:20px;"><div style="font-size:0.75rem;color:var(--dim);letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">&#x1F3C5; Badges</div>'
    +'<div style="display:flex;gap:8px;flex-wrap:wrap;">'+badgesHTML+'</div></div>'
    +nextHTML
    +'<div style="margin-top:16px;"><div style="font-size:0.75rem;color:var(--dim);letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">&#x1F3AF; Missions</div>'
    +missionsDetail+'</div></div>';

  document.body.appendChild(overlay);
}

// =================================================================
