// alphabet.js v2 — Options B + C
// Alphabet/phonétique + Mnémotechniques pour TOUTES les langues
// Affiché en langue maternelle (nativeLang)
// Rendu identique aux écrans vocab/phrases (u-header + u-badge + listes)
// ================================================================

window.LV_ALPHABET = (function() {

// ================================================================
// LABELS UI PAR LANGUE MATERNELLE
// ================================================================
var UI = {
  alpha_title:   {fr:'Alphabet & Phonétique',en:'Alphabet & Phonetics',es:'Alfabeto y fonética',ht:'Alfabè ak Fonetik',de:'Alphabet & Phonetik',ru:'Алфавит и фонетика',zh:'字母和音标',ja:'アルファベットと音声'},
  mnem_title:    {fr:'Mnémotechniques',en:'Mnemonics',es:'Reglas mnemónicas',ht:'Teknik memwa',de:'Gedächtnisstützen',ru:'Мнемоники',zh:'记忆技巧',ja:'記憶術'},
  alpha_sub:     {fr:'Clique sur chaque lettre pour entendre sa prononciation',en:'Tap each character to hear it',es:'Toca cada carácter para escucharlo',ht:'Klike sou chak lèt pou tande li',de:'Tippe auf jeden Buchstaben zum Anhören',ru:'Нажми на букву, чтобы услышать',zh:'点击每个字符来听发音',ja:'各文字をタップして発音を聞く'},
  mnem_sub:      {fr:'Trucs mémoire adaptés à ta langue natale',en:'Memory tricks for your native language',es:'Trucos de memoria para tu idioma',ht:'Teknik memwa adapte pou lang ou',de:'Gedächtnistricks für deine Sprache',ru:'Мнемоники для твоего языка',zh:'适合你母语的记忆技巧',ja:'母国語に適した記憶テクニック'},
  tap_hear:      {fr:'Toucher pour entendre',en:'Tap to hear',es:'Toca para escuchar',ht:'Touche pou tande',de:'Tippen zum Hören',ru:'Нажми чтобы услышать',zh:'点击聆听',ja:'タップして聴く'},
  coming_soon:   {fr:'Mnémotechniques à venir pour cette langue !',en:'Mnemonics coming soon for this language!',es:'¡Reglas mnemónicas próximamente!',ht:'Teknik memwa ap vini pou lang sa!',de:'Gedächtnisstützen kommen bald!',ru:'Мнемоники скоро!',zh:'记忆技巧即将推出！',ja:'この言語の記憶術は近日公開！'},
  see_mnemo:     {fr:'💡 Voir les mnémotechniques',en:'💡 See mnemonics',es:'💡 Ver reglas mnemónicas',ht:'💡 Wè teknik memwa',de:'💡 Gedächtnisstützen',ru:'💡 Мнемоники',zh:'💡 查看记忆技巧',ja:'💡 記憶術を見る'},
  back_menu:     {fr:'← Menu',en:'← Menu',es:'← Menú',ht:'← Meni',de:'← Menü',ru:'← Меню',zh:'← 菜单',ja:'← メニュー'},
  back_alpha:    {fr:'← Alphabet',en:'← Alphabet',es:'← Alfabeto',ht:'← Alfabè',de:'← Alphabet',ru:'← Алфавит',zh:'← 字母',ja:'← アルファベット'},
};
function ui(key, nl) { return (UI[key] && (UI[key][nl] || UI[key].fr)) || key; }

// ================================================================
// ALPHABETS — données complètes pour toutes les langues
// Pour les langues latines : phonétique + accents spéciaux
// ================================================================
var ALPHABETS = {

  ja: {
    groups:[
      {label:{fr:'Voyelles',en:'Vowels',es:'Vocales',ht:'Vwayèl',de:'Vokale',ru:'Гласные',zh:'元音',ja:'母音'},
       chars:[
        {c:'あ',r:'a', m:{fr:'comme "a" dans "chat"',en:'"a" in "father"',es:'"a" en "casa"',ht:'"a" nan "chat"',de:'"a" in "Vater"',ru:'как "а" в "мама"',zh:'如"啊"',ja:'「ア」'}},
        {c:'い',r:'i', m:{fr:'comme "i" dans "île"',en:'"ee" in "feet"',es:'"i" en "isla"',ht:'"i" nan "île"',de:'"ie" in "Brief"',ru:'как "и" в "игра"',zh:'如"依"',ja:'「イ」'}},
        {c:'う',r:'u', m:{fr:'lèvres non arrondies',en:'unrounded "u"',es:'labios planos',ht:'bouch pa wonn',de:'ungepresste Lippen',ru:'нераспространённый "у"',zh:'嘴唇不圆',ja:'唇を丸めない'}},
        {c:'え',r:'e', m:{fr:'comme "é" français',en:'"e" in "bed"',es:'"e" en "mesa"',ht:'"é" an fransè',de:'"e" in "Bett"',ru:'как "э" в "это"',zh:'如"欸"',ja:'「エ」'}},
        {c:'お',r:'o', m:{fr:'comme "o" dans "eau"',en:'"o" in "go"',es:'"o" en "no"',ht:'"o" nan "eau"',de:'"o" in "Not"',ru:'как "о" в "осень"',zh:'如"哦"',ja:'「オ」'}},
      ]},
      {label:{fr:'K·',en:'K·',es:'K·',ht:'K·',de:'K·',ru:'К·',zh:'K·',ja:'か行'},
       chars:[
        {c:'か',r:'ka',m:{fr:'"ka"',en:'"ca" in car',es:'"ca"',ht:'"ka"',de:'"ka"',ru:'"ка"',zh:'"卡"',ja:'「カ」'}},
        {c:'き',r:'ki',m:{fr:'"ki"',en:'"key"',es:'"ki"',ht:'"ki"',de:'"ki"',ru:'"ки"',zh:'"基"',ja:'「キ」'}},
        {c:'く',r:'ku',m:{fr:'"kou"',en:'"coo"',es:'"cu"',ht:'"ku"',de:'"ku"',ru:'"ку"',zh:'"库"',ja:'「ク」'}},
        {c:'け',r:'ke',m:{fr:'"ké"',en:'"keg"',es:'"ke"',ht:'"ké"',de:'"ke"',ru:'"кэ"',zh:'"克"',ja:'「ケ」'}},
        {c:'こ',r:'ko',m:{fr:'"ko"',en:'"coat"',es:'"co"',ht:'"ko"',de:'"ko"',ru:'"ко"',zh:'"可"',ja:'「コ」'}},
      ]},
      {label:{fr:'S·',en:'S·',es:'S·',ht:'S·',de:'S·',ru:'С·',zh:'S·',ja:'さ行'},
       chars:[
        {c:'さ',r:'sa', m:{fr:'"sa"',en:'"sa"',es:'"sa"',ht:'"sa"',de:'"sa"',ru:'"са"',zh:'"萨"',ja:'「サ」'}},
        {c:'し',r:'shi',m:{fr:'"chi" (palatal)',en:'"she"',es:'"shi"',ht:'"chi"',de:'"schi"',ru:'"ши"',zh:'"西"',ja:'「シ」'}},
        {c:'す',r:'su', m:{fr:'"sou"',en:'"sue"',es:'"su"',ht:'"su"',de:'"su"',ru:'"су"',zh:'"苏"',ja:'「ス」'}},
        {c:'せ',r:'se', m:{fr:'"sé"',en:'"set"',es:'"se"',ht:'"sé"',de:'"se"',ru:'"сэ"',zh:'"塞"',ja:'「セ」'}},
        {c:'そ',r:'so', m:{fr:'"so"',en:'"so"',es:'"so"',ht:'"so"',de:'"so"',ru:'"со"',zh:'"索"',ja:'「ソ」'}},
      ]},
      {label:{fr:'T·',en:'T·',es:'T·',ht:'T·',de:'T·',ru:'Т·',zh:'T·',ja:'た行'},
       chars:[
        {c:'た',r:'ta', m:{fr:'"ta"',en:'"top"',es:'"ta"',ht:'"ta"',de:'"ta"',ru:'"та"',zh:'"塔"',ja:'「タ」'}},
        {c:'ち',r:'chi',m:{fr:'"tchi"',en:'"cheer"',es:'"chi"',ht:'"tchi"',de:'"tschi"',ru:'"чи"',zh:'"七"',ja:'「チ」'}},
        {c:'つ',r:'tsu',m:{fr:'"tsou" rapide',en:'quick "ts"',es:'"tsu"',ht:'"tsu"',de:'schnelles "tsu"',ru:'"цу"',zh:'"次"',ja:'「ツ」'}},
        {c:'て',r:'te', m:{fr:'"té"',en:'"ten"',es:'"te"',ht:'"té"',de:'"te"',ru:'"тэ"',zh:'"特"',ja:'「テ」'}},
        {c:'と',r:'to', m:{fr:'"to"',en:'"toe"',es:'"to"',ht:'"to"',de:'"to"',ru:'"то"',zh:'"托"',ja:'「ト」'}},
      ]},
      {label:{fr:'N·',en:'N·',es:'N·',ht:'N·',de:'N·',ru:'Н·',zh:'N·',ja:'な行'},
       chars:[
        {c:'な',r:'na',m:{fr:'"na"',en:'"na"',es:'"na"',ht:'"na"',de:'"na"',ru:'"на"',zh:'"那"',ja:'「ナ」'}},
        {c:'に',r:'ni',m:{fr:'"ni"',en:'"knee"',es:'"ni"',ht:'"ni"',de:'"ni"',ru:'"ни"',zh:'"你"',ja:'「ニ」'}},
        {c:'ぬ',r:'nu',m:{fr:'"nu"',en:'"new"',es:'"nu"',ht:'"nu"',de:'"nu"',ru:'"ну"',zh:'"奴"',ja:'「ヌ」'}},
        {c:'ね',r:'ne',m:{fr:'"né"',en:'"net"',es:'"ne"',ht:'"né"',de:'"ne"',ru:'"нэ"',zh:'"内"',ja:'「ネ」'}},
        {c:'の',r:'no',m:{fr:'"no"',en:'"no"',es:'"no"',ht:'"no"',de:'"no"',ru:'"но"',zh:'"那"',ja:'「ノ」'}},
      ]},
    ]
  },

  ru: {
    groups:[
      {label:{fr:'Identiques au latin',en:'Same as Latin',es:'Igual al latín',ht:'Idantik ak latin',de:'Wie Latein',ru:'Как в латинице',zh:'与拉丁字母相同',ja:'ラテン文字と同じ'},
       chars:[
        {c:'А а',r:'A a',  m:{fr:'identique !',en:'identical!',es:'¡idéntico!',ht:'idantik!',de:'identisch!',ru:'точно так же!',zh:'完全相同！',ja:'同じ！'}},
        {c:'Е е',r:'YE ye',m:{fr:'"YÉ" comme "hier"',en:'"YE" like "yet"',es:'"YE" como "ayer"',ht:'"YE"',de:'"JE"',ru:'"е" в "если"',zh:'"叶"',ja:'「イェ」'}},
        {c:'М м',r:'M m',  m:{fr:'identique !',en:'identical!',es:'¡idéntico!',ht:'idantik!',de:'identisch!',ru:'точно так же!',zh:'完全相同！',ja:'同じ！'}},
        {c:'О о',r:'O o',  m:{fr:'identique !',en:'identical!',es:'¡idéntico!',ht:'idantik!',de:'identisch!',ru:'точно так же!',zh:'完全相同！',ja:'同じ！'}},
        {c:'Т т',r:'T t',  m:{fr:'identique maj, minusc. différent',en:'cap same, lower different',es:'mayús igual, min diferente',ht:'majiskil menm, miniskil diferan',de:'Groß gleich, klein anders',ru:'заглавная та же',zh:'大写相同，小写不同',ja:'大文字は同じ'}},
        {c:'К к',r:'K k',  m:{fr:'identique !',en:'identical!',es:'¡idéntico!',ht:'idantik!',de:'identisch!',ru:'точно так же!',zh:'完全相同！',ja:'同じ！'}},
      ]},
      {label:{fr:'⚠️ Faux amis',en:'⚠️ False friends',es:'⚠️ Falsos amigos',ht:'⚠️ Fo zanmi',de:'⚠️ Falsche Freunde',ru:'⚠️ Ложные друзья',zh:'⚠️ 假朋友',ja:'⚠️ 偽の友達'},
       chars:[
        {c:'В в',r:'V v',  m:{fr:'ressemble B → se lit V !',en:'looks B → reads V!',es:'parece B → suena V!',ht:'sanble B → li V!',de:'sieht aus wie B → ist V!',ru:'похожа на B → читается В',zh:'像B→读V！',ja:'Bに見える→Vと読む！'}},
        {c:'Н н',r:'N n',  m:{fr:'ressemble H → se lit N !',en:'looks H → reads N!',es:'parece H → suena N!',ht:'sanble H → li N!',de:'sieht aus wie H → ist N!',ru:'похожа на H → читается Н',zh:'像H→读N！',ja:'Hに見える→Nと読む！'}},
        {c:'Р р',r:'R r',  m:{fr:'ressemble P → se lit R !',en:'looks P → reads R!',es:'parece P → suena R!',ht:'sanble P → li R!',de:'sieht aus wie P → ist R!',ru:'похожа на P → читается Р',zh:'像P→读R！',ja:'Pに見える→Rと読む！'}},
        {c:'С с',r:'S s',  m:{fr:'ressemble C → se lit S !',en:'looks C → reads S!',es:'parece C → suena S!',ht:'sanble C → li S!',de:'sieht aus wie C → ist S!',ru:'похожа на C → читается С',zh:'像C→读S！',ja:'Cに見える→Sと読む！'}},
        {c:'У у',r:'U u',  m:{fr:'ressemble Y → se lit OU !',en:'looks Y → reads OO!',es:'parece Y → suena U!',ht:'sanble Y → li OU!',de:'sieht aus wie Y → ist U!',ru:'похожа на Y → читается У',zh:'像Y→读U！',ja:'Yに見える→Uと読む！'}},
        {c:'Х х',r:'KH kh',m:{fr:'ressemble X → se lit KH !',en:'looks X → reads KH!',es:'parece X → suena J!',ht:'sanble X → li KH!',de:'sieht aus wie X → ist CH!',ru:'похожа на X → читается Х',zh:'像X→读KH！',ja:'Xに見える→KHと読む！'}},
      ]},
      {label:{fr:'Nouvelles lettres',en:'New letters',es:'Letras nuevas',ht:'Nouvo lèt',de:'Neue Buchstaben',ru:'Новые буквы',zh:'新字母',ja:'新しい文字'},
       chars:[
        {c:'Б б',r:'B b',  m:{fr:'"B"',en:'"B"',es:'"B"',ht:'"B"',de:'"B"',ru:'"б" в "быть"',zh:'"波"',ja:'「ブ」'}},
        {c:'Г г',r:'G g',  m:{fr:'"G"',en:'"G"',es:'"G"',ht:'"G"',de:'"G"',ru:'"г" в "год"',zh:'"格"',ja:'「グ」'}},
        {c:'Д д',r:'D d',  m:{fr:'"D"',en:'"D"',es:'"D"',ht:'"D"',de:'"D"',ru:'"д" в "да"',zh:'"德"',ja:'「ドゥ」'}},
        {c:'З з',r:'Z z',  m:{fr:'"Z"',en:'"Z"',es:'"Z"',ht:'"Z"',de:'"Z"',ru:'"з" в "зима"',zh:'"兹"',ja:'「ズ」'}},
        {c:'И и',r:'I i',  m:{fr:'"I"',en:'"EE"',es:'"I"',ht:'"I"',de:'"I"',ru:'"и" в "иметь"',zh:'"依"',ja:'「イ」'}},
        {c:'Л л',r:'L l',  m:{fr:'"L"',en:'"L"',es:'"L"',ht:'"L"',de:'"L"',ru:'"л" в "лес"',zh:'"勒"',ja:'「ル」'}},
        {c:'П п',r:'P p',  m:{fr:'"P"',en:'"P"',es:'"P"',ht:'"P"',de:'"P"',ru:'"п" в "папа"',zh:'"普"',ja:'「プ」'}},
        {c:'Ш ш',r:'SH sh',m:{fr:'"CH" comme "chat"',en:'"SH" like "shop"',es:'"SH"',ht:'"CH"',de:'"SCH"',ru:'"ш" в "шум"',zh:'"诶斯阿兹"',ja:'「シュ」'}},
        {c:'Щ щ',r:'SHCH', m:{fr:'"CHTCH" long',en:'"SHCH" soft',es:'"SHCH"',ht:'"SHTCH"',de:'"SCHTSCH"',ru:'"щ" в "щи"',zh:'"西西"（软）',ja:'「シッチ」'}},
        {c:'Ж ж',r:'ZH zh',m:{fr:'"J" comme "jour"',en:'"ZH" like measure',es:'"J" suave',ht:'"J" tankou "jour"',de:'"SCH" (stimmhaft)',ru:'"ж" в "жара"',zh:'"热"',ja:'「ジュ」'}},
      ]},
    ]
  },

  zh: {
    groups:[
      {label:{fr:'Les 4 tons',en:'The 4 tones',es:'Los 4 tonos',ht:'4 ton yo',de:'Die 4 Töne',ru:'4 тона',zh:'四个声调',ja:'4つの声調'},
       chars:[
        {c:'mā',r:'1er ton ¯',m:{fr:'↔ Plat-haut : mā=maman',en:'↔ High level: mā=mother',es:'↔ Tono alto: mā=mamá',ht:'↔ Plat-wo: mā=manman',de:'↔ Hoch-flach: mā=Mutter',ru:'↔ Высокий ровный: mā=мама',zh:'→平声：妈',ja:'→高平調：お母さん'}},
        {c:'má',r:'2e ton /',m:{fr:'↑ Montant : má=chanvre',en:'↑ Rising: má=hemp',es:'↑ Subiendo: má=cáñamo',ht:'↑ ap monte: má=chanm',de:'↑ Steigend: má=Hanf',ru:'↑ Восходящий: má=конопля',zh:'↗升声：麻',ja:'↗上昇調：麻'}},
        {c:'mǎ',r:'3e ton ∨',m:{fr:'↓↑ Creux : mǎ=cheval',en:'↓↑ Dip: mǎ=horse',es:'↓↑ Valle: mǎ=caballo',ht:'↓↑ kreyòl val: mǎ=cheval',de:'↓↑ Senke: mǎ=Pferd',ru:'↓↑ Вогнутый: mǎ=лошадь',zh:'↕曲声：马',ja:'↕低降上昇調：馬'}},
        {c:'mà',r:'4e ton \\',m:{fr:'↓ Descendant : mà=gronder',en:'↓ Falling: mà=scold',es:'↓ Cayendo: mà=regañar',ht:'↓ desann: mà=gronde',de:'↓ Fallend: mà=schimpfen',ru:'↓ Нисходящий: mà=ругать',zh:'↘去声：骂',ja:'↘下降調：叱る'}},
        {c:'ma',r:'Neutre ·',m:{fr:'Sans ton : particule ?',en:'Neutral: question particle',es:'Neutro: partícula ?',ht:'San ton: patikil ?',de:'Neutral: Fragepartikel',ru:'Нейтральный: частица?',zh:'轻声：疑问助词吗',ja:'中立調：疑問助詞'}},
      ]},
      {label:{fr:'Consonnes initiales',en:'Initial consonants',es:'Consonantes iniciales',ht:'Konsòn inisyal',de:'Anlautkonsonanten',ru:'Начальные согласные',zh:'声母',ja:'頭子音'},
       chars:[
        {c:'b p',  r:'b p',  m:{fr:'b doux / p aspiré',en:'b soft / p aspirated',es:'b suave / p aspirada',ht:'b dou / p aspiré',de:'b weich / p aspiriert',ru:'б мягкий / п придыхательное',zh:'b不送气/p送气',ja:'bソフト/p気息'}},
        {c:'d t',  r:'d t',  m:{fr:'d doux / t aspiré',en:'d soft / t aspirated',es:'d suave / t aspirada',ht:'d dou / t aspiré',de:'d weich / t aspiriert',ru:'д мягкий / т придыхательное',zh:'d不送气/t送气',ja:'dソフト/t気息'}},
        {c:'g k',  r:'g k',  m:{fr:'g doux / k aspiré',en:'g soft / k aspirated',es:'g suave / k aspirada',ht:'g dou / k aspiré',de:'g weich / k aspiriert',ru:'г мягкий / к придыхательное',zh:'g不送气/k送气',ja:'gソフト/k気息'}},
        {c:'zh ch',r:'zh ch',m:{fr:'"dj" / "tch" rétroflexes',en:'retroflexed "j"/"ch"',es:'"j"/"ch" retroflejas',ht:'"dj"/"tch" retro',de:'retroflexes "dsch"/"tsch"',ru:'ретрофлексные "дж"/"ч"',zh:'翘舌zh/ch',ja:'そり舌zh/ch'}},
        {c:'x q j',r:'x q j',m:{fr:'"ss" / "tch" / "dj" palataux',en:'palatal "ss"/"ch"/"j"',es:'palatales "ss"/"ch"/"j"',ht:'palatal "ss"/"tch"/"dj"',de:'palatale "ss"/"tsch"/"dsch"',ru:'палатальные "сс"/"ч"/"дж"',zh:'舌面x/q/j',ja:'口蓋音x/q/j'}},
        {c:'sh r', r:'sh r', m:{fr:'"ch" / "r" rétroflexes',en:'retroflexed "sh"/"r"',es:'"sh"/"r" retroflejas',ht:'"sh"/"r" retro',de:'retroflexes "sch"/"r"',ru:'ретрофлексные "ш"/"р"',zh:'翘舌sh/r',ja:'そり舌sh/r'}},
      ]},
    ]
  },

  de: {
    groups:[
      {label:{fr:'Lettres spéciales',en:'Special letters',es:'Letras especiales',ht:'Lèt espesyal',de:'Sonderbuchstaben',ru:'Особые буквы',zh:'特殊字母',ja:'特殊文字'},
       chars:[
        {c:'Ä ä',r:'ae',m:{fr:'"è" long — Bär=ours',en:'"e" in "bed" — Bär=bear',es:'"e" abierta — Bär=oso',ht:'"è" long — Bär=lous',de:'langes "ä" — Bär',ru:'"э" долгое — Bär=медведь',zh:'近"哎"音',ja:'長い"エ"音'}},
        {c:'Ö ö',r:'oe',m:{fr:'"eu" français — schön=beau',en:'no equiv — schön=beautiful',es:'"o"+"e" — schön=bonito',ht:'"eu" fransè',de:'schön=hübsch',ru:'"ё" — schön=красивый',zh:'近"哦"但嘴形更圆',ja:'丸い「オ」'}},
        {c:'Ü ü',r:'ue',m:{fr:'"u" français — grün=vert',en:'French "u" — grün=green',es:'como "u" francesa — grün=verde',ht:'"u" fransè — grün=vèt',de:'grün=grün',ru:'"ю" — grün=зелёный',zh:'近"于"音',ja:'フランス語の「ユ」'}},
        {c:'ß',  r:'ss',m:{fr:'"ss" double — Straße=rue',en:'double "ss" — Straße=street',es:'"ss" — Straße=calle',ht:'"ss" — Straße=ri',de:'Straße=Straße',ru:'"сс" — Straße=улица',zh:'双"ss"音',ja:'二重「SS」音'}},
        {c:'ch', r:'ch/k',m:{fr:'après a,o,u : "kh" / sinon "ch"',en:'after a,o,u: "kh" / else "sh"',es:'tras a,o,u: "j" / sino "sh"',ht:'apre a,o,u: "kh" / sinon "ch"',de:'nach a,o,u: "ch" sonst "ich"',ru:'после a,o,u: "х" / иначе "щ"',zh:'a/o/u后"哈"/其他"希"',ja:'a/o/uの後「ハ」/その他「ヒ」'}},
      ]},
      {label:{fr:'Sons difficiles',en:'Tricky sounds',es:'Sonidos difíciles',ht:'Son difisil',de:'Knifflige Laute',ru:'Сложные звуки',zh:'难发音',ja:'難しい音'},
       chars:[
        {c:'ie',r:'ee',m:{fr:'"î" long — die=le/la',en:'long "ee" — die=the',es:'"i" larga — die=el/la',ht:'"î" long — die=atik',de:'langes "ie"',ru:'долгое "и"',zh:'长"依"音',ja:'長い「イー」'}},
        {c:'ei',r:'eye',m:{fr:'"aï" — ein=un',en:'"eye" — ein=one/a',es:'"ai" — ein=un',ht:'"aï" — ein=yon',de:'"ei" in "ein"',ru:'"ай" — ein=один',zh:'"爱"音',ja:'「アイ」'}},
        {c:'eu',r:'oy',m:{fr:'"eu" arrondi — neu=nouveau',en:'rounded "oy" — neu=new',es:'"oi" — neu=nuevo',ht:'"eu" — neu=nouvo',de:'"eu" in "neu"',ru:'"ой" — neu=новый',zh:'圆唇"哦依"',ja:'丸い「オイ」'}},
        {c:'w',  r:'v',m:{fr:'"v" — Wasser=eau',en:'"v" — Wasser=water',es:'"v" — Wasser=agua',ht:'"v" — Wasser=dlo',de:'"w" klingt wie "v"',ru:'"в" — Wasser=вода',zh:'"v"音',ja:'「ヴ」音'}},
        {c:'v',  r:'f',m:{fr:'"f" — Vogel=oiseau',en:'"f" — Vogel=bird',es:'"f" — Vogel=pájaro',ht:'"f" — Vogel=zwazo',de:'"v" klingt wie "f"',ru:'"ф" — Vogel=птица',zh:'"f"音',ja:'「フ」音'}},
      ]},
    ]
  },

  es: {
    groups:[
      {label:{fr:'Sons espagnols particuliers',en:'Unique Spanish sounds',es:'Sonidos únicos del español',ht:'Son espagnol espesyal',de:'Besondere Laute',ru:'Особые испанские звуки',zh:'特殊西班牙语音',ja:'スペイン語特有の音'},
       chars:[
        {c:'rr',r:'rr',m:{fr:'R roulé fort — perro=chien',en:'rolled R — perro=dog',es:'R fuerte — perro=perro',ht:'R woule fò — perro=chen',de:'gerolltes R — perro=Hund',ru:'раскатистый Р',zh:'颤音r',ja:'巻き舌R'}},
        {c:'ñ', r:'ny',m:{fr:'"gn" français — año=an',en:'"ny" — año=year',es:'ñ — año=año',ht:'"ny" — año=ane',de:'"nj" — año=Jahr',ru:'"нь" — año=год',zh:'"你"的"n"音',ja:'「ニャ」行'}},
        {c:'ll', r:'y/zh',m:{fr:'"y" ou "dj" selon pays',en:'"y" or "zh" by region',es:'"ll" suena "y" o "j"',ht:'"y" ou "dj" selon peyi',de:'"j" oder "sch"',ru:'"й" или "дж"',zh:'"y"或"zh"音（地区差异）',ja:'「ヤ」または「ジャ」行'}},
        {c:'j',  r:'h',m:{fr:'"h" aspiré — juego=jeu',en:'breathy "h" — juego=game',es:'j fuerte — juego=juego',ht:'"h" aspiré — juego=jwèt',de:'wie "ch" in Bach',ru:'как "х" — juego=игра',zh:'强"h"音',ja:'強い「ハ」行'}},
        {c:'z/c',r:'s/th',m:{fr:'"s" (Amérique) ou "th" (Espagne)',en:'"s" (LatAm) or "th" (Spain)',es:'"s" o "c" ceceo — España',ht:'"s" (Amerik) ou "th" (Espay)',de:'"s" oder "th"',ru:'"с" или "т(h)"',zh:'美洲"s"/西班牙"θ"音',ja:'南米「ス」/スペイン「ス(θ)」'}},
      ]},
    ]
  },

  en: {
    groups:[
      {label:{fr:'Sons anglais difficiles',en:'Tricky English sounds',es:'Sonidos ingleses difíciles',ht:'Son anglè difisil',de:'Schwierige Englisc',ru:'Сложные английские звуки',zh:'英语难发音',ja:'英語の難しい音'},
       chars:[
        {c:'th',r:'θ / ð',m:{fr:'"th" sourd (think) / sonore (the)',en:'voiceless think / voiced the',es:'th sorda (think) / sonora (the)',ht:'th soud / sonò',de:'stimmloses/stimmhaftes "th"',ru:'"ф"(think) / "в"(the)',zh:'清th(think)/浊th(the)',ja:'無声th/有声th'}},
        {c:'w', r:'w',m:{fr:'"ou" rapide — water=eau',en:'quick "w" — no lip rounding',es:'"gu" rápida — water=agua',ht:'"ou" rapid — water=dlo',de:'kurzes "u" — water=Wasser',ru:'быстрое "у"',zh:'圆唇快速"ua"',ja:'素早い「ウ」'}},
        {c:'v', r:'v',m:{fr:'"v" dents sur lèvre basse',en:'teeth on lower lip — very',es:'"v" dental — very',ht:'"v" dan sou lèv ba',de:'"w" dental',ru:'"в" зубной',zh:'上牙碰下唇发"v"',ja:'下唇を噛む「ヴ」'}},
        {c:'æ', r:'ae',m:{fr:'"a" écarté — cat, bad',en:'wide "a" — cat, bad',es:'"a" abierta — cat',ht:'"a" louvri — cat',de:'breites "a"',ru:'широкое "а"',zh:'扁"a"音：cat',ja:'広い「ア」：cat'}},
        {c:'ŋ', r:'ng',m:{fr:'"ng" nasal — sing, ring',en:'nasal "ng" — sing, ring',es:'"ng" nasal — sing',ht:'"ng" nazal',de:'nasales "ng"',ru:'носовое "нг"',zh:'鼻音ng',ja:'鼻音「ング」'}},
      ]},
    ]
  },

  fr: {
    groups:[
      {label:{fr:'Sons français particuliers',en:'Unique French sounds',es:'Sonidos únicos del francés',ht:'Son fransè espesyal',de:'Besondere Franz. Laute',ru:'Особые французские звуки',zh:'法语特殊音',ja:'フランス語特有の音'},
       chars:[
        {c:'u',  r:'y',m:{fr:'"u" arrondi — aucun équiv.',en:'rounded "u" — no equiv',es:'"u" redondeada — sin equiv',ht:'"u" fransè — pa gen ekivalan',de:'wie "ü" — très=sehr',ru:'как "ю" — un=один',zh:'圆唇"于"音',ja:'丸い「ユ」音'}},
        {c:'r',  r:'ʁ',m:{fr:'R uvulaire — gorge',en:'uvular R — throat',es:'R uvular — garganta',ht:'R gorj',de:'uvulares R — Rachen',ru:'увулярный Р',zh:'悬雍垂R音',ja:'口蓋垂R'}},
        {c:'eu', r:'ø',m:{fr:'entre "e" et "o" — feu, bleu',en:'between "e"+"o" — feu',es:'entre "e" y "o" — feu',ht:'ant "e" ak "o"',de:'wie "ö" — feu=Feuer',ru:'как "ё" — feu=огонь',zh:'介于"哦"和"哎"之间',ja:'「エ」と「オ」の間'}},
        {c:'gn', r:'ɲ',m:{fr:'"gn" espagnol — montagne',en:'like Spanish ñ — montagne',es:'como ñ — montagne',ht:'tankou "ny" — montagne',de:'wie "nj"',ru:'как "нь"',zh:'类似汉语"ni"的鼻音',ja:'スペイン語ñと同じ'}},
        {c:'on/an',r:'ɔ̃/ɑ̃',m:{fr:'voyelles nasales — son, dans',en:'nasal vowels — son, dans',es:'vocales nasales',ht:'vwayèl nazal',de:'Nasalvokale',ru:'носовые гласные',zh:'鼻化元音',ja:'鼻母音'}},
      ]},
    ]
  },

  ht: {
    groups:[
      {label:{fr:'Phonétique du créole',en:'Creole phonetics',es:'Fonética créole',ht:'Fonetik kreyòl',de:'Kreol-Phonetik',ru:'Фонетика креольского',zh:'克里奥尔语音标',ja:'クレオール語音声'},
       chars:[
        {c:'ou',r:'u',m:{fr:'"ou" — toujours "ou"',en:'"oo" always',es:'"u" siempre',ht:'"ou" toujou "ou"',de:'immer "u"',ru:'всегда "у"',zh:'始终"ou"音',ja:'常に「ウー」'}},
        {c:'an',r:'ɑ̃',m:{fr:'voyelle nasale — tan',en:'nasal vowel — tan',es:'vocal nasal',ht:'vwayèl nazal',de:'Nasalvokal',ru:'носовой гласный',zh:'鼻化元音',ja:'鼻母音'}},
        {c:'en',r:'ɛ̃',m:{fr:'nasale fermée — pren',en:'closed nasal — pren',es:'nasal cerrada',ht:'nazal fèmen',de:'geschlossener Nasal',ru:'закрытый носовой',zh:'闭鼻化元音',ja:'閉鼻母音'}},
        {c:'on',r:'ɔ̃',m:{fr:'nasale ouverte — bon',en:'open nasal — bon',es:'nasal abierta',ht:'nazal louvri',de:'offener Nasal',ru:'открытый носовой',zh:'开鼻化元音',ja:'開鼻母音'}},
        {c:'ch',r:'ʃ',m:{fr:'"ch" français — chèz=chaise',en:'like "sh" — chèz=chair',es:'"sh" — chèz=silla',ht:'"ch" — chèz=chèz',de:'"sch" — chèz=Stuhl',ru:'"ш" — chèz=стул',zh:'"sh"音',ja:'「シュ」音'}},
      ]},
    ]
  },
};

// ================================================================
// MNÉMOTECHNIQUES — TOUTES LES LANGUES
// ================================================================
var MNEMONICS = {
  ja:[
    {word:'食べる',roman:'taberu',meaning:{fr:'manger',en:'eat',es:'comer',ht:'manje',de:'essen',ru:'есть',zh:'吃',ja:'食べる'},
     tip:{fr:'🍽️ TABLE — ta-be-ru → on mange à la TABLE',en:'🍽️ TABLE — ta-be-ru → eat at the TABLE',es:'🍽️ TABLA — ta-be-ru',ht:'🍽️ TAB — ta-be-ru → manje sou TAB la',de:'🍽️ TABEL — ta-be-ru → essen am TISCH',ru:'🍽️ ТАБЛО — ta-be-ru → есть за СТОЛОМ',zh:'🍽️ 桌子TABLE — ta-be-ru',ja:'🍽️ テーブル — ta-be-ru'}},
    {word:'寝る',roman:'neru',meaning:{fr:'dormir',en:'sleep',es:'dormir',ht:'dòmi',de:'schlafen',ru:'спать',zh:'睡觉',ja:'寝る'},
     tip:{fr:'😴 NUIT — ne-ru → la NUIT on dort',en:'😴 NIGHT — ne-ru → sleep at NIGHT',es:'😴 NOCHE — ne-ru → dormir de NOCHE',ht:'😴 NWI — ne-ru → NWI nou dòmi',de:'😴 NACHT — ne-ru → schlafen in der NACHT',ru:'😴 НОЧЬ — ne-ru → спать НОЧЬЮ',zh:'😴 "呢ru"→睡觉',ja:'😴 ねる → 夜に寝る'}},
    {word:'見る',roman:'miru',meaning:{fr:'voir',en:'see',es:'ver',ht:'wè',de:'sehen',ru:'видеть',zh:'看',ja:'見る'},
     tip:{fr:'🪞 MIROIR — mi-ru → le MIROIR pour voir',en:'🪞 MIRROR — mi-ru → see in the MIRROR',es:'🪞 MIRAR/ESPEJO — mi-ru',ht:'🪞 MIWA — mi-ru → wè nan MIWA',de:'🪞 MIRROR — mi-ru → Spiegel zum Sehen',ru:'🪞 ЗЕРКАЛО — mi-ru → видеть в ЗЕРКАЛЕ',zh:'🪞 镜子Mirror — mi-ru',ja:'🪞 ミラー — mi-ru'}},
    {word:'行く',roman:'iku',meaning:{fr:'aller',en:'go',es:'ir',ht:'ale',de:'gehen',ru:'идти',zh:'去',ja:'行く'},
     tip:{fr:'🚶 IKU → "I GO" en anglais — aller !',en:'🚶 IKU → "I GO" — just say it!',es:'🚶 IKU → IR — "i-ku" suena "ir"',ht:'🚶 IKU → "I GO" — ale!',de:'🚶 IKU → "I GO" — gehen!',ru:'🚶 ИДУ — iku → иду',zh:'🚶 iku → 我去(I go)',ja:'🚶 いく → I GO'}},
    {word:'来る',roman:'kuru',meaning:{fr:'venir',en:'come',es:'venir',ht:'vini',de:'kommen',ru:'приходить',zh:'来',ja:'来る'},
     tip:{fr:'🏃 COURIR pour venir — ku-ru → COURIR',en:'🏃 COURIER comes to you — ku-ru',es:'🏃 CORRER para venir — ku-ru',ht:'🏃 KOURI vini — ku-ru',de:'🏃 KOMMEN — ku-ru',ru:'🏃 КУРЬЕР приходит — ku-ru',zh:'🏃 快跑来ku-ru',ja:'🏃 クル → 来る'}},
    {word:'水',roman:'mizu',meaning:{fr:'eau',en:'water',es:'agua',ht:'dlo',de:'Wasser',ru:'вода',zh:'水',ja:'水'},
     tip:{fr:'💧 MISE à l\'eau — mi-zu',en:'💧 MEADOW water — mi-zu',es:'💧 MIrar el agua — mi-zu',ht:'💧 MIZE dlo — mi-zu',de:'💧 MIZELLEN (Wasser) — mi-zu',ru:'💧 МИЗЕРНЫЙ водоём — mi-zu',zh:'💧 密水mizu',ja:'💧 みず → 水'}},
    {word:'ありがとう',roman:'arigatou',meaning:{fr:'merci',en:'thank you',es:'gracias',ht:'mèsi',de:'danke',ru:'спасибо',zh:'谢谢',ja:'ありがとう'},
     tip:{fr:'🙏 ARRIVÉE GATÉE OÙ — ari-ga-tou',en:'🙏 "Alligator" thankful — ari-ga-to',es:'🙏 "Aligátor" agradecido — ari-ga-tou',ht:'🙏 "Aligato" — ari-ga-tou',de:'🙏 "Ali GATOR" — ari-ga-to',ru:'🙏 "АЛЛИГАТОР" — ari-ga-to',zh:'🙏 阿里嘎多 → ありがとう',ja:'🙏 ありがとう → 感謝'}},
  ],
  ru:[
    {word:'есть',roman:'yest',meaning:{fr:'manger',en:'eat',es:'comer',ht:'manje',de:'essen',ru:'есть',zh:'吃',ja:'食べる'},
     tip:{fr:'🍽️ FESTIN sans le F — yest → FEAST',en:'🍽️ FEAST without F — yest',es:'🍽️ FEST(ín) — yest',ht:'🍽️ FÈT manje — yest',de:'🍽️ FEST essen — yest',ru:'🍽️ есть = кушать',zh:'🍽️ 宴feast — yest',ja:'🍽️ フィースト — yest'}},
    {word:'пить',roman:'pit',meaning:{fr:'boire',en:'drink',es:'beber',ht:'bwè',de:'trinken',ru:'пить',zh:'喝',ja:'飲む'},
     tip:{fr:'🍺 PIT — comme pitcher qu\'on vide',en:'🍺 PITCHER — pit to drink from',es:'🍺 PITCHER — pit para beber',ht:'🍺 PITCHA dlo — pit',de:'🍺 PITSCHE — pit trinken',ru:'🍺 пить — просто пить',zh:'🍺 皮特pitcher — pit',ja:'🍺 ピット（ピッチャー）— pit'}},
    {word:'Привет',roman:'privet',meaning:{fr:'salut',en:'hello',es:'hola',ht:'salye',de:'hallo',ru:'привет',zh:'你好',ja:'こんにちは'},
     tip:{fr:'👋 PRIVÉ — privet → salut en privé',en:'👋 PRIVATE greeting — privet',es:'👋 PRIVADO — privet → saludo',ht:'👋 PRIVE — privet → salye',de:'👋 PRIVAT grüßen — privet',ru:'👋 привет → от слова "приватный"',zh:'👋 私下问候privet',ja:'👋 プライベート挨拶 — privet'}},
    {word:'да',roman:'da',meaning:{fr:'oui',en:'yes',es:'sí',ht:'wi',de:'ja',ru:'да',zh:'是',ja:'はい'},
     tip:{fr:'✅ DA — court et affirmatif comme "ouDA !"',en:'✅ DA — short sharp "yes"!',es:'✅ DA — corto y afirmativo',ht:'✅ DA — kout ak afirmatif',de:'✅ DA — kurz und bejahend',ru:'✅ да — просто да!',zh:'✅ 对da',ja:'✅ ダ — 短くYES'}},
    {word:'нет',roman:'nyet',meaning:{fr:'non',en:'no',es:'no',ht:'non',de:'nein',ru:'нет',zh:'不',ja:'いいえ'},
     tip:{fr:'❌ NOT YET = NYET — "pas encore" = non !',en:'❌ NOT YET = NYET!',es:'❌ NOT YET = NYET',ht:'❌ PA ENCORE = NYET',de:'❌ NOCH NICHT = NJET',ru:'❌ нет — просто нет!',zh:'❌ 还没有NOT YET = nyet',ja:'❌ まだない NOT YET = nyet'}},
    {word:'спасибо',roman:'spasibo',meaning:{fr:'merci',en:'thank you',es:'gracias',ht:'mèsi',de:'danke',ru:'спасибо',zh:'谢谢',ja:'ありがとう'},
     tip:{fr:'🙏 SPA-SI-BO → le SPA c\'est SI BON, merci !',en:'🙏 SPA-SI-BO → SPA is SO GOOD, thanks!',es:'🙏 SPA-SI-BO → el SPA es TAN BUENO',ht:'🙏 SPA-SI-BO → SPA a SI BON, mèsi!',de:'🙏 SPA-SI-BO → das SPA ist SO GUT, danke!',ru:'🙏 спасибо → спаси Бог',zh:'🙏 SPA是如此好spasibo',ja:'🙏 スパシーボ — ありがとう'}},
  ],
  zh:[
    {word:'你好',roman:'nǐ hǎo',meaning:{fr:'bonjour',en:'hello',es:'hola',ht:'bonjou',de:'hallo',ru:'привет',zh:'你好',ja:'こんにちは'},
     tip:{fr:'👋 NI HAO → "ni vas HAUT" = tu vas bien !',en:'👋 NI HAO → "knee HOW" — bow your knee!',es:'👋 NI HAO → "ni JAO"',ht:'👋 NI HAO → "ni ale WO"',de:'👋 NI HAO → "nie hoch" — Hallo!',ru:'👋 НИ ХАО → "ни хао"',zh:'👋 你好',ja:'👋 ニーハオ → こんにちは'}},
    {word:'谢谢',roman:'xiè xie',meaning:{fr:'merci',en:'thank you',es:'gracias',ht:'mèsi',de:'danke',ru:'спасибо',zh:'谢谢',ja:'ありがとう'},
     tip:{fr:'🙏 CHIÉ CHIÉ (x2) — répéter = insister sur la gratitude',en:'🙏 SHYEH SHYEH — repeat = extra thanks',es:'🙏 SHIÉ SHIÉ — repetir = gratitud doble',ht:'🙏 CHIÉ CHIÉ — repete = mèsi ampil',de:'🙏 SCHIEH SCHIEH — Doppeldank',ru:'🙏 СЕ СЕ — повтор усиливает',zh:'🙏 谢谢（重复加强感谢）',ja:'🙏 シェシェ（繰り返し）'}},
    {word:'我',roman:'wǒ',meaning:{fr:'je/moi',en:'I/me',es:'yo/mí',ht:'mwen',de:'ich/mich',ru:'я/меня',zh:'我',ja:'私'},
     tip:{fr:'🙋 WO → WOi c\'est MOI !',en:'🙋 WO → WOW that\'s ME!',es:'🙋 WO → ¡WO soy YO!',ht:'🙋 WO → WO se MWEN!',de:'🙋 WO → WO bin ich!',ru:'🙋 ВО → ВОТ Я!',zh:'🙋 我wǒ',ja:'🙋 ウォ → 私'}},
    {word:'吃',roman:'chī',meaning:{fr:'manger',en:'eat',es:'comer',ht:'manje',de:'essen',ru:'есть',zh:'吃',ja:'食べる'},
     tip:{fr:'🍽️ TCHIP pour manger des chips !',en:'🍽️ CHEE → CHEEse to eat!',es:'🍽️ CHI → CHIpa para comer',ht:'🍽️ TCHI → manje chip!',de:'🍽️ TSCHI → essen wie Chips!',ru:'🍽️ ЧИ → чипсы есть!',zh:'🍽️ 吃chī',ja:'🍽️ チー → 食べる'}},
    {word:'不',roman:'bù',meaning:{fr:'non/pas',en:'no/not',es:'no',ht:'non/pa',de:'nein/nicht',ru:'нет/не',zh:'不',ja:'いいえ/〜ない'},
     tip:{fr:'❌ BU → BOO ! — refus !',en:'❌ BU → BOO! — refusal!',es:'❌ BU → ¡BOO! — negación',ht:'❌ BU → BOO! — refize',de:'❌ BU → BOO! — Verneinung',ru:'❌ БУ → БУ! — отказ',zh:'❌ 不bù',ja:'❌ ブー → 否定'}},
  ],
  de:[
    {word:'Hallo',roman:'hallo',meaning:{fr:'bonjour',en:'hello',es:'hola',ht:'bonjou',de:'hallo',ru:'привет',zh:'你好',ja:'こんにちは'},
     tip:{fr:'👋 HALO lumineux — Hallo !',en:'👋 HALO of greeting — Hallo!',es:'👋 HALO de saludo',ht:'👋 HALO limyè — Hallo!',de:'👋 HALO — Hallo!',ru:'👋 НИМБ — Hallo',zh:'👋 光环HALO=Hallo',ja:'👋 ハロー → こんにちは'}},
    {word:'Danke',roman:'danke',meaning:{fr:'merci',en:'thank you',es:'gracias',ht:'mèsi',de:'danke',ru:'спасибо',zh:'谢谢',ja:'ありがとう'},
     tip:{fr:'🙏 DAN-KÉ → "Dan quitte" — il nous remercie',en:'🙏 DONKEY says danke!',es:'🙏 DON-KE — Don gracias',ht:'🙏 DAN-KE — Dan mèsi',de:'🙏 Danke = einfach Danke!',ru:'🙏 ДАНКЕ → спасибо по-немецки',zh:'🙏 唐克Danke谢谢',ja:'🙏 ダンケ → ありがとう'}},
    {word:'Bitte',roman:'bitte',meaning:{fr:'s\'il vous plaît / de rien',en:'please / you\'re welcome',es:'por favor / de nada',ht:'tanpri / pa gen pwoblèm',de:'bitte',ru:'пожалуйста',zh:'请/不客气',ja:'どうぞ/どういたしまして'},
     tip:{fr:'🙏 BITTE → "bite" dans la langue — demande polie',en:'🙏 BITTE → "a bit please"',es:'🙏 BITTE → "un poquito" — por favor',ht:'🙏 BITTE → "yon ti" tanpri',de:'🙏 Bitte = bitte!',ru:'🙏 БИТТЕ → пожалуйста',zh:'🙏 比特Bitte请',ja:'🙏 ビッテ → どうぞ'}},
  ],
  en:[
    {word:'hello',roman:'hello',meaning:{fr:'bonjour',en:'hello',es:'hola',ht:'bonjou',de:'hallo',ru:'привет',zh:'你好',ja:'こんにちは'},
     tip:{fr:'👋 HE-LLO → "Hé, là !" — on attire l\'attention',en:'👋 HELLO — as simple as it sounds!',es:'👋 HELLO → "hola" se pronuncia similar',ht:'👋 HELLO → "Hé, la !" ann pale',de:'👋 HELLO → einfach hallo!',ru:'👋 ХЭЛЛОУ → просто привет!',zh:'👋 哈喽hello',ja:'👋 ハロー → こんにちは'}},
    {word:'please',roman:'pleez',meaning:{fr:'s\'il vous plaît',en:'please',es:'por favor',ht:'tanpri',de:'bitte',ru:'пожалуйста',zh:'请',ja:'お願いします'},
     tip:{fr:'🙏 PLEASE → "pliz" — comme supplier avec les yeux',en:'🙏 PLEASE — the magic word!',es:'🙏 PLEASE → suena a "pliz"',ht:'🙏 PLEASE → "pliz" — sipye',de:'🙏 PLEASE → "plies" — bitten',ru:'🙏 ПЛИЗ → пожалуйста',zh:'🙏 普里斯please请',ja:'🙏 プリーズ → お願いします'}},
    {word:'thank you',roman:'θæŋk ju',meaning:{fr:'merci',en:'thank you',es:'gracias',ht:'mèsi',de:'danke',ru:'спасибо',zh:'谢谢',ja:'ありがとう'},
     tip:{fr:'🙏 THANK YOU → "thénk iou" — pratique la langue entre les dents !',en:'🙏 THANK YOU — tongue between teeth for "th"!',es:'🙏 THANK YOU → lengua entre dientes',ht:'🙏 THANK YOU → lang ant dan',de:'🙏 THANK YOU → Zunge zwischen Zähnen',ru:'🙏 ТЭНК Ю → спасибо по-английски',zh:'🙏 谢谢thank you',ja:'🙏 サンキュー → ありがとう'}},
  ],
  es:[
    {word:'hola',roman:'ola',meaning:{fr:'bonjour',en:'hello',es:'hola',ht:'bonjou',de:'hallo',ru:'привет',zh:'你好',ja:'こんにちは'},
     tip:{fr:'👋 OLA → vague (OLA) de bonne humeur — bonjour !',en:'👋 OLA → wave hello like an ocean wave!',es:'👋 HOLA → ¡ola de alegría!',ht:'👋 OLA → vag lanmè — bonjou!',de:'👋 OLA → Welle — hallo!',ru:'👋 ОЛА → волна — привет!',zh:'👋 海浪ola=hola你好',ja:'👋 オラ → こんにちは'}},
    {word:'gracias',roman:'grasias',meaning:{fr:'merci',en:'thank you',es:'gracias',ht:'mèsi',de:'danke',ru:'спасибо',zh:'谢谢',ja:'ありがとう'},
     tip:{fr:'🙏 GRÂCE — gra-cias → la GRÂCE de dire merci',en:'🙏 GRACE — gra-cias → gracious thanks',es:'🙏 GRACIAS → agradecido con GRACIA',ht:'🙏 GRASIA — gra-cias → dis mèsi ak GRASI',de:'🙏 GRAZIE — gra-cias → Dankbarkeit',ru:'🙏 ГРАСИОС → грациозная благодарность',zh:'🙏 优雅GRACIAS谢谢',ja:'🙏 グラシアス → ありがとう'}},
  ],
  fr:[
    {word:'bonjour',roman:'bɔ̃ʒuʁ',meaning:{fr:'bonjour',en:'hello',es:'hola',ht:'bonjou',de:'hallo',ru:'привет',zh:'你好',ja:'こんにちは'},
     tip:{fr:'☀️ BON JOUR → littéralement "bonne journée" !',en:'☀️ GOOD DAY — bon=good, jour=day',es:'☀️ BUEN DÍA — bon=bueno, jour=día',ht:'☀️ BON JOU — literally "good day"!',de:'☀️ GUTEN TAG — bon=gut, jour=Tag',ru:'☀️ ДОБРЫЙ ДЕНЬ — bon=добрый, jour=день',zh:'☀️ 美好一天bon(好)+jour(天)',ja:'☀️ 良い日 — bon(良い)+jour(日)'}},
    {word:'merci',roman:'mɛʁsi',meaning:{fr:'merci',en:'thank you',es:'gracias',ht:'mèsi',de:'danke',ru:'спасибо',zh:'谢谢',ja:'ありがとう'},
     tip:{fr:'🙏 MERCI → MERCY en anglais — on fait grâce !',en:'🙏 MERCY → merci means mercy/thanks',es:'🙏 MERCED → merci como merced',ht:'🙏 MÈSI → mercy an anglè',de:'🙏 MERCY → merci = Gnade/Dank',ru:'🙏 МЕРСИ → спасибо по-французски',zh:'🙏 怜悯mercy=merci谢谢',ja:'🙏 マーシー(慈悲)=メルシー'}},
  ],
  ht:[
    {word:'mèsi',roman:'mesi',meaning:{fr:'merci',en:'thank you',es:'gracias',ht:'mèsi',de:'danke',ru:'спасибо',zh:'谢谢',ja:'ありがとう'},
     tip:{fr:'🙏 MÈSI → du français MERCI — même famille !',en:'🙏 MÈSI → from French MERCI — same family!',es:'🙏 MÈSI → del francés MERCI',ht:'🙏 MÈSI → soti nan MERCI fransè',de:'🙏 MÈSI → vom franz. MERCI',ru:'🙏 МЭСИ → от фр. МЕРСИ',zh:'🙏 来自法语MERCI',ja:'🙏 フランス語MERCIから'}},
    {word:'bonjou',roman:'bõʒu',meaning:{fr:'bonjour',en:'hello',es:'hola',ht:'bonjou',de:'hallo',ru:'привет',zh:'你好',ja:'こんにちは'},
     tip:{fr:'☀️ BON JOU → du français BONJOUR — même mot !',en:'☀️ BON JOU → from French BONJOUR!',es:'☀️ BON JOU → del francés BONJOUR',ht:'☀️ BONJOU → soti nan BONJOUR fransè',de:'☀️ BON JOU → vom franz. BONJOUR',ru:'☀️ БОН ЖУ → от фр. БОНЖУР',zh:'☀️ 来自法语BONJOUR',ja:'☀️ フランス語BONJOURから'}},
  ],
};

// ================================================================
// RENDER — écran identique à vocab/phrases (u-header + liste)
// ================================================================
function openAlphabet(lang, nativeLang) {
  lang       = lang       || (window.S && S.targetLang) || 'en';
  nativeLang = nativeLang || (window.S && S.nativeLang)  || 'fr';
  var data   = ALPHABETS[lang];
  if (!data) { openMnemonics(lang, nativeLang); return; }
  if (typeof showScreen === 'function') showScreen('screen-alphabet');
  _renderAlphaScreen(lang, nativeLang, data);
}

function openMnemonics(lang, nativeLang) {
  lang       = lang       || (window.S && S.targetLang) || 'en';
  nativeLang = nativeLang || (window.S && S.nativeLang)  || 'fr';
  if (typeof showScreen === 'function') showScreen('screen-mnemonics');
  _renderMnemoScreen(lang, nativeLang);
}

function _renderAlphaScreen(lang, nativeLang, data) {
  var nl = nativeLang;
  // Header
  var titleEl = document.getElementById('alphaTitle');
  var countEl = document.getElementById('alphaCount');
  var subEl   = document.getElementById('alphaSub');
  var bodyEl  = document.getElementById('alphaBody');
  if (titleEl) titleEl.textContent = ui('alpha_title', nl);
  var total = data.groups.reduce(function(s,g){return s+g.chars.length;},0);
  if (countEl) countEl.textContent = total;
  if (subEl)   subEl.textContent   = ui('tap_hear', nl);
  if (!bodyEl) return;
  bodyEl.innerHTML = '';

  data.groups.forEach(function(group) {
    var lbl = (group.label && (group.label[nl] || group.label.fr)) || '';
    var sec = document.createElement('div');
    sec.style.marginBottom = '20px';
    sec.innerHTML = '<div class="vocab-cat-label" style="font-size:0.68rem;font-weight:800;color:rgba(255,215,0,0.55);letter-spacing:0.08em;margin-bottom:10px;text-transform:uppercase;padding:0 4px;">' + lbl + '</div>';
    var grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(72px,1fr));gap:8px;';
    group.chars.forEach(function(ch) {
      var mnem = ch.m && (ch.m[nl] || ch.m.fr) || '';
      var card = document.createElement('div');
      card.style.cssText = [
        'display:flex;flex-direction:column;align-items:center;justify-content:center;',
        'background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,215,0,0.14);',
        'border-radius:14px;padding:14px 6px;cursor:pointer;transition:all 0.18s;',
        '-webkit-tap-highlight-color:transparent;text-align:center;'
      ].join('');
      card.innerHTML = '<div style="font-size:1.9rem;line-height:1;margin-bottom:4px;">' + ch.c + '</div>'
        + '<div style="font-size:0.70rem;font-weight:800;color:#ffd700;margin-bottom:3px;">' + ch.r + '</div>'
        + '<div style="font-size:0.58rem;color:rgba(255,255,255,0.32);line-height:1.3;">' + mnem + '</div>';
      card.addEventListener('click', function() {
        _speak(ch.c, lang);
        card.style.borderColor = '#4ecf70';
        card.style.background  = 'rgba(78,207,112,0.10)';
        setTimeout(function() {
          card.style.borderColor = 'rgba(255,215,0,0.14)';
          card.style.background  = 'rgba(255,255,255,0.05)';
        }, 700);
      });
      grid.appendChild(card);
    });
    sec.appendChild(grid);
    bodyEl.appendChild(sec);
  });

  // Bouton mnémo en bas
  var btnWrap = document.createElement('div');
  btnWrap.style.cssText = 'padding:12px 0 24px;';
  var btn = document.createElement('button');
  btn.style.cssText = 'width:100%;padding:14px;background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.25);border-radius:16px;color:#ffd700;font-weight:800;font-size:0.88rem;cursor:pointer;';
  btn.textContent = ui('see_mnemo', nl);
  btn.onclick = function() { openMnemonics(lang, nl); };
  btnWrap.appendChild(btn);
  bodyEl.appendChild(btnWrap);
}

function _renderMnemoScreen(lang, nativeLang) {
  var nl   = nativeLang;
  var list = MNEMONICS[lang] || [];
  var titleEl = document.getElementById('mnemTitle');
  var countEl = document.getElementById('mnemCount');
  var bodyEl  = document.getElementById('mnemBody');
  if (titleEl) titleEl.textContent = ui('mnem_title', nl);
  if (countEl) countEl.textContent = list.length;
  if (!bodyEl) return;
  bodyEl.innerHTML = '';

  if (!list.length) {
    bodyEl.innerHTML = '<div style="text-align:center;padding:48px 20px;color:rgba(255,255,255,0.28);font-size:0.88rem;">' + ui('coming_soon', nl) + '</div>';
    return;
  }
  list.forEach(function(item) {
    var meaning = item.meaning[nl] || item.meaning.fr;
    var tip     = item.tip[nl]     || item.tip.fr;
    var card    = document.createElement('div');
    card.className = 'vocab-item';
    card.style.cssText = 'cursor:pointer;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,0.06);';
    card.innerHTML = '<div style="display:flex;align-items:center;gap:12px;">'
      + '<div style="font-size:1.8rem;line-height:1;">' + item.word + '</div>'
      + '<div style="flex:1;">'
      + '<div style="font-size:0.78rem;color:rgba(255,255,255,0.40);margin-bottom:1px;">' + item.roman + '</div>'
      + '<div style="font-weight:800;font-size:0.92rem;color:#e8e0d0;">→ ' + meaning + '</div>'
      + '</div>'
      + '<div style="font-size:1.2rem;color:rgba(255,215,0,0.4);">🔊</div>'
      + '</div>'
      + '<div style="margin-top:10px;padding:10px 12px;background:rgba(78,207,112,0.07);border-left:3px solid #4ecf70;border-radius:0 10px 10px 0;font-size:0.82rem;color:#4ecf70;line-height:1.5;">' + tip + '</div>';
    card.addEventListener('click', function() { _speak(item.word, lang); });
    bodyEl.appendChild(card);
  });
}

function _speak(text, lang) {
  if (!('speechSynthesis' in window)) return;
  // [CORRIGÉ] 'fr-HT' demandait une voix française avec variante
  // haïtienne, pas du créole — le vrai code BCP-47 est 'ht-HT'.
  var lmap = {fr:'fr-FR',en:'en-US',es:'es-ES',ht:'ht-HT',de:'de-DE',ru:'ru-RU',zh:'zh-CN',ja:'ja-JP'};
  var u = new SpeechSynthesisUtterance(text);
  u.lang = lmap[lang] || 'en-US';
  u.rate = 0.8;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

function maybeShowOnboarding() {
  var tl = window.S && S.targetLang;
  if (['ja','ru','zh'].includes(tl)) {
    var seen = localStorage.getItem('lv_alphabet_seen_' + tl);
    if (!seen) {
      setTimeout(function() {
        openAlphabet(tl, window.S && S.nativeLang);
        localStorage.setItem('lv_alphabet_seen_' + tl, '1');
      }, 800);
    }
  }
}

return { openAlphabet:openAlphabet, openMnemonics:openMnemonics, maybeShowOnboarding:maybeShowOnboarding };
})();

window.openAlphabet  = window.LV_ALPHABET.openAlphabet;
window.openMnemonics = window.LV_ALPHABET.openMnemonics;
window._openMnemonics= window.LV_ALPHABET.openMnemonics;
console.log('✅ alphabet.js v2 chargé — Options B+C toutes langues');
