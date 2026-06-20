// curriculum.js — Moteur de progression pédagogique LinguaVillage
// ============================================================================
// Structure extraite par analyse comparative de 6 manuels :
//   - Le tour de l'anglais en 365 jours (Gérald Leroy)
//   - 60 leçons pour apprendre l'allemand (Eden Moreau)
//   - Le chinois à partir de zéro (Linlin Shen Lao)
//   - L'espagnol pour les Nuls (Jessica Langemeier)
//   - Petit manuel de la langue russe à l'usage des Français (1860, structure
//     réutilisée — vocabulaire régénéré en orthographe moderne, voir note
//     dans curriculum_analysis.md)
//   - Haitian Creole Basic Course (Defense Language Institute)
//
// Ce fichier ne remplace aucun écran existant. Il pilote l'ordre dans lequel
// les bâtiments de village_3d.js / GUIDED_DIALOGUES de data.js se débloquent,
// et fournit les pièges typés (pitfalls) consommés par pnj.js pour enrichir
// les corrections de l'IA avec la nuance exacte que les manuels papier
// réservent à un locuteur natif du français.
// ============================================================================

window.CURRICULUM = (function () {
'use strict';

// ============================================================================
// 1. TYPES DE PIÈGES — 6 catégories universelles extraites des 6 manuels
// ============================================================================
var PITFALL_TYPES = {
  false_friend:          { icon: '🪤', label: { fr:'Faux-ami',            en:'False friend' } },
  fixed_rule:             { icon: '📏', label: { fr:'Règle fixe',          en:'Fixed rule' } },
  morphology_exception:   { icon: '🔀', label: { fr:'Exception',           en:'Exception' } },
  register_nuance:        { icon: '🎩', label: { fr:'Registre',            en:'Register' } },
  contextual_phonetic:    { icon: '🔊', label: { fr:'Son contextuel',      en:'Contextual sound' } },
  homophone_tonal:        { icon: '🎵', label: { fr:'Homophone',           en:'Homophone' } },
  social_register:        { icon: '🤝', label: { fr:'Usage social',        en:'Social usage' } },
};

// ============================================================================
// 2. CURRICULUM_UNITS — séquence par langue cible
// category: 'survival' | 'structure' | 'situational' (structure en 3 actes,
// extraite d'Espagnol pour les Nuls — remplace la simple liste séquentielle)
// ============================================================================

var UNITS = {

  // ==========================================================================
  // ANGLAIS — séquence extraite du "Tour de l'anglais en 365 jours"
  // ==========================================================================
  en: [
    {
      id: 'en_pronouns', order: 1, category: 'survival',
      title: { fr:'Les pronoms', en:'Pronouns' },
      recommendedBefore: null,
      examples: [
        { target:'I', native:'je' }, { target:'you', native:'tu / vous' },
        { target:'he / she / it', native:'il / elle / cela' },
        { target:'we', native:'nous' }, { target:'they', native:'ils / elles' },
      ],
      pitfalls: [
        {
          type: 'fixed_rule', forNativeLang: ['fr'],
          explanation: { fr:'"I" (je) s\'écrit TOUJOURS avec une majuscule, même au milieu d\'une phrase.' },
          example: 'Yesterday I went home. (jamais "i")',
        },
        {
          type: 'morphology_exception', forNativeLang: ['fr'],
          explanation: { fr:'L\'anglais a 3 pronoms pour "il/elle" : he (homme), she (femme), it (objet/animal non familier) — le français n\'en a que 2.' },
          example: 'The dog is hungry, it wants food.',
        },
      ],
      rule: { fr:'Sujet toujours exprimé, jamais omis (contrairement à certaines langues).' },
      unlocksBuilding: 'park',
    },
    {
      id: 'en_articles', order: 2, category: 'survival',
      title: { fr:'Articles indéfinis et défini', en:'Articles' },
      recommendedBefore: 'en_pronouns',
      examples: [
        { target:'a teacher', native:'un professeur' },
        { target:'an hour', native:'une heure (h muet)' },
        { target:'a house', native:'une maison (h aspiré)' },
        { target:'the dog', native:'le chien' },
      ],
      pitfalls: [
        {
          type: 'contextual_phonetic', forNativeLang: ['fr'],
          explanation: { fr:'"a" devant consonne ou h ASPIRÉ, "an" devant voyelle ou h MUET. Même lettre h, deux comportements.' },
          example: 'an hour [h muet] vs a house [h aspiré]',
        },
        {
          type: 'fixed_rule', forNativeLang: ['fr'],
          explanation: { fr:'"the" est invariable : un seul mot pour le/la/les, contre 3 en français.' },
          example: 'the book, the books — jamais "thes"',
        },
      ],
      rule: { fr:'a/an = un/une (singulier indéfini) ; the = le/la/les (défini, invariable).' },
      unlocksBuilding: 'school',
    },
    {
      id: 'en_plurals_irregular', order: 3, category: 'structure',
      title: { fr:'Pluriels irréguliers', en:'Irregular plurals' },
      recommendedBefore: 'en_articles',
      examples: [
        { target:'man → men', native:'homme → hommes' },
        { target:'woman → women', native:'femme → femmes' },
        { target:'child → children', native:'enfant → enfants' },
        { target:'sheep → sheep', native:'mouton → moutons (invariable)' },
      ],
      pitfalls: [
        {
          type: 'morphology_exception', forNativeLang: ['fr'],
          explanation: { fr:'Une liste fermée de pluriels irréguliers à mémoriser : man/men, woman/women, foot/feet, tooth/teeth, child/children, mouse/mice, sheep/sheep (invariable).' },
          example: 'one sheep, two sheep — jamais "sheeps"',
        },
      ],
      rule: { fr:'Pluriel régulier = +s. Mais une dizaine de mots très fréquents sont irréguliers.' },
      unlocksBuilding: 'friends',
    },
    {
      id: 'en_adjective_order', order: 4, category: 'structure',
      title: { fr:'Adjectifs avant le nom', en:'Adjective placement' },
      recommendedBefore: 'en_plurals_irregular',
      examples: [
        { target:'a big black cloud', native:'un gros nuage noir' },
        { target:'a young American teacher', native:'un jeune professeur américain' },
      ],
      pitfalls: [
        {
          type: 'fixed_rule', forNativeLang: ['fr'],
          explanation: { fr:'En anglais, l\'adjectif épithète se place TOUJOURS avant le nom, jamais après — contrairement au français qui peut faire les deux.' },
          example: 'a red apple, jamais "an apple red"',
        },
        {
          type: 'fixed_rule', forNativeLang: ['fr'],
          explanation: { fr:'Les adjectifs anglais sont invariables : pas d\'accord en genre ni en nombre.' },
          example: 'a tall man, a tall woman, tall men — "tall" ne change jamais',
        },
        {
          type: 'register_nuance', forNativeLang: ['fr'],
          explanation: { fr:'Les adjectifs de nationalité prennent une majuscule en anglais, pas en français.' },
          example: 'an American teacher (A majuscule)',
        },
      ],
      rule: { fr:'Ordre fixe adjectif+nom, adjectifs invariables, nationalités avec majuscule.' },
      unlocksBuilding: 'market',
    },
    {
      id: 'en_greetings', order: 5, category: 'survival',
      title: { fr:'Salutations et registres', en:'Greetings' },
      recommendedBefore: null,
      examples: [
        { target:'Good morning', native:'Bonjour (matin)' },
        { target:'Good afternoon', native:'Bonjour (après-midi)' },
        { target:'Good evening', native:'Bonsoir' },
      ],
      pitfalls: [
        {
          type: 'register_nuance', forNativeLang: ['fr'],
          explanation: { fr:'"sir" seul = Monsieur. Mais avec un nom propre, on utilise "Mr" (jamais "sir" + nom).' },
          example: 'Mr Young is my friend — jamais "Sir Young"',
        },
        {
          type: 'false_friend', forNativeLang: ['fr'],
          explanation: { fr:'"surname" ne veut pas dire surnom — ça veut dire nom de famille. Le surnom se dit "nickname".' },
          example: 'My surname is Smith (= mon nom de famille)',
        },
      ],
      rule: { fr:'Le choix de salutation dépend du moment de la journée, pas juste "bonjour" universel.' },
      unlocksBuilding: 'bank',
    },
  ],

  // ==========================================================================
  // ALLEMAND — séquence extraite de "60 leçons pour apprendre l'allemand"
  // ==========================================================================
  de: [
    {
      id: 'de_alphabet', order: 1, category: 'survival',
      title: { fr:'Alphabet et caractères spéciaux', en:'Alphabet' },
      recommendedBefore: null,
      examples: [
        { target:'ä', native:'comme le "e" dans "bet"' },
        { target:'ö', native:'similaire au "i" dans "girl"' },
        { target:'ü', native:'similaire au "ue" dans "blue"' },
        { target:'ß (Eszett)', native:'un "s" fort, comme "hiss"' },
      ],
      pitfalls: [
        {
          type: 'contextual_phonetic', forNativeLang: ['fr'],
          explanation: { fr:'Le "v" allemand se prononce comme un "f" français. Le "w" allemand se prononce comme le "v" français.' },
          example: 'Vater [Fater], Wasser [Vasser]',
        },
        {
          type: 'contextual_phonetic', forNativeLang: ['fr'],
          explanation: { fr:'Le "s" en début de mot se prononce comme un "z" français.' },
          example: 'sehen se prononce [zé-èn]',
        },
      ],
      rule: { fr:'4 lettres en plus du français : ä, ö, ü, ß — leur prononciation est non négociable.' },
      unlocksBuilding: 'park',
    },
    {
      id: 'de_greetings', order: 2, category: 'survival',
      title: { fr:'Salutations courantes', en:'Greetings' },
      recommendedBefore: 'de_alphabet',
      examples: [
        { target:'Hallo!', native:'Bonjour !' },
        { target:'Guten Morgen!', native:'Bon matin !' },
        { target:'Tschüss!', native:'Au revoir ! (informel)' },
        { target:'Auf Wiedersehen!', native:'Au revoir ! (formel)' },
      ],
      pitfalls: [
        {
          type: 'register_nuance', forNativeLang: ['fr'],
          explanation: { fr:'"Tschüss" est informel (entre amis), "Auf Wiedersehen" est formel (collègues, inconnus) — comme tu/vous mais sur le mot d\'adieu lui-même.' },
          example: 'À un collègue : Auf Wiedersehen, pas Tschüss',
        },
      ],
      rule: { fr:'Le formel/informel se marque aussi sur les salutations, pas seulement sur "tu/vous".' },
      unlocksBuilding: 'school',
    },
    {
      id: 'de_numbers', order: 3, category: 'structure',
      title: { fr:'Les nombres 1 à 20', en:'Numbers' },
      recommendedBefore: 'de_greetings',
      examples: [
        { target:'eins, zwei, drei', native:'un, deux, trois' },
        { target:'dreizehn', native:'treize (3+10)' },
      ],
      pitfalls: [
        {
          type: 'morphology_exception', forNativeLang: ['fr'],
          explanation: { fr:'1 à 12 sont uniques à mémoriser. À partir de 13, formation régulière : chiffre + "zehn" (dix).' },
          example: 'vierzehn = vier (4) + zehn (10) = quatorze',
        },
      ],
      rule: { fr:'L\'âge s\'exprime avec "sein" (être) : "Ich bin 20 Jahre alt" et non avec "avoir".' },
      unlocksBuilding: 'market',
    },
    {
      id: 'de_articles_gender', order: 4, category: 'structure',
      title: { fr:'Articles et genres', en:'Articles & gender' },
      recommendedBefore: 'de_numbers',
      examples: [
        { target:'der Mann', native:'l\'homme (masculin)' },
        { target:'die Frau', native:'la femme (féminin)' },
        { target:'das Kind', native:'l\'enfant (neutre)' },
      ],
      pitfalls: [
        {
          type: 'fixed_rule', forNativeLang: ['fr'],
          explanation: { fr:'L\'allemand a 3 genres (masculin/féminin/NEUTRE), le français n\'en a que 2. Le genre d\'un nom allemand n\'a souvent aucun lien logique avec son sens.' },
          example: 'das Mädchen (la fille) est neutre, pas féminin !',
        },
        {
          type: 'morphology_exception', forNativeLang: ['fr'],
          explanation: { fr:'Toujours apprendre un nom AVEC son article — il n\'y a pas de règle fiable pour deviner le genre.' },
          example: 'Apprendre "der Hund" et pas juste "Hund"',
        },
      ],
      rule: { fr:'der/die/das = le/la/le(neutre). Le genre se mémorise avec le mot, jamais déduit.' },
      unlocksBuilding: 'library', lockXP: 400,
    },
  ],

  // ==========================================================================
  // MANDARIN — séquence extraite de "Le chinois à partir de zéro"
  // ==========================================================================
  zh: [
    {
      id: 'zh_pinyin_initials', order: 1, category: 'survival',
      title: { fr:'Pinyin : les initiales', en:'Pinyin initials' },
      recommendedBefore: null,
      examples: [
        { target:'b, p, m, f', native:'comme en français' },
        { target:'zh, ch, sh', native:'sons rétroflexes sans équivalent français' },
        { target:'x', native:'ressemble au "see" anglais' },
      ],
      pitfalls: [
        {
          type: 'contextual_phonetic', forNativeLang: ['fr'],
          explanation: { fr:'b/p, d/t, g/k ne s\'opposent pas par voisé/non-voisé comme en français, mais par aspiré/non-aspiré. "p" est un souffle d\'air, pas une histoire de cordes vocales.' },
          example: 'pà (avoir peur) vs bà (papa) — différence de souffle, pas de voix',
        },
      ],
      rule: { fr:'23 initiales, plusieurs sans équivalent en français — l\'écoute prime sur la lecture.' },
      unlocksBuilding: 'park',
    },
    {
      id: 'zh_tones', order: 2, category: 'survival',
      title: { fr:'Les 5 tons', en:'The 5 tones' },
      recommendedBefore: 'zh_pinyin_initials',
      examples: [
        { target:'mā (1er ton)', native:'maman' },
        { target:'má (2e ton)', native:'chanvre' },
        { target:'mǎ (3e ton)', native:'cheval' },
        { target:'mà (4e ton)', native:'insulter' },
      ],
      pitfalls: [
        {
          type: 'homophone_tonal', forNativeLang: ['fr'],
          explanation: { fr:'La même syllabe avec un ton différent est un mot totalement différent. Le ton n\'est pas une nuance, c\'est une lettre à part entière.' },
          example: 'mā/má/mǎ/mà = 4 mots différents, pas 4 variantes d\'un mot',
        },
        {
          type: 'homophone_tonal', forNativeLang: ['fr'],
          explanation: { fr:'Même AVEC le bon ton, des homophones existent : wén (écriture) et wén (sentir) se prononcent identiquement.' },
          example: 'Le contexte de la phrase départage les vrais homophones.',
        },
      ],
      rule: { fr:'5 tons (4 + neutre). Le ton change le sens — jamais facultatif.' },
      unlocksBuilding: 'school',
    },
    {
      id: 'zh_sentence_structure', order: 3, category: 'structure',
      title: { fr:'Structure de phrase de base', en:'Basic sentence structure' },
      recommendedBefore: 'zh_tones',
      examples: [
        { target:'wǒ xué zhōngwén', native:'j\'apprends le chinois (je-étudier-chinois)' },
      ],
      pitfalls: [
        {
          type: 'fixed_rule', forNativeLang: ['fr'],
          explanation: { fr:'Pas de conjugaison du tout en chinois ! Le verbe reste identique quel que soit le sujet, le temps ou le nombre.' },
          example: 'wǒ xué / tā xué — "xué" ne change jamais',
        },
        {
          type: 'fixed_rule', forNativeLang: ['fr'],
          explanation: { fr:'Les mots interrogatifs restent À LA PLACE du mot qu\'ils remplacent, pas en début de phrase comme en français.' },
          example: 'nǐ xué shénme ? = tu étudies QUOI ? (pas "que étudies-tu")',
        },
      ],
      rule: { fr:'Sujet + Verbe + Objet, verbe invariable, mots interrogatifs en place.' },
      unlocksBuilding: 'market',
    },
    {
      id: 'zh_negation_le', order: 4, category: 'structure',
      title: { fr:'Négation bù/méi et particule le', en:'Negation and aspect marker' },
      recommendedBefore: 'zh_sentence_structure',
      examples: [
        { target:'wǒ bú shì xuéshēng', native:'je ne suis pas élève (présent/futur)' },
        { target:'wǒ méi shàngkè', native:'je ne suis pas allé en cours (passé)' },
      ],
      pitfalls: [
        {
          type: 'fixed_rule', forNativeLang: ['fr'],
          explanation: { fr:'bù sert pour présent/futur, méi sert pour le passé — ce ne sont pas des synonymes interchangeables comme on pourrait le croire.' },
          example: 'wǒ bú qù (je n\'y vais pas) vs wǒ méi qù (je n\'y suis pas allé)',
        },
        {
          type: 'morphology_exception', forNativeLang: ['fr'],
          explanation: { fr:'méi et la particule le ne s\'utilisent jamais ensemble pour une action qui n\'a pas eu lieu.' },
          example: '"wǒ méi shàngkè le" est grammaticalement incorrect',
        },
      ],
      rule: { fr:'bù = négation présent/futur ; méi = négation passé. Jamais interchangeables.' },
      unlocksBuilding: 'hospital', lockXP: 200,
    },
  ],

  // ==========================================================================
  // CRÉOLE HAÏTIEN — structure extraite du Haitian Creole Basic Course (DLI)
  // ==========================================================================
  ht: [
    {
      id: 'ht_greetings_konpe', order: 1, category: 'survival',
      title: { fr:'Salutations et termes d\'adresse', en:'Greetings & address terms' },
      recommendedBefore: null,
      examples: [
        { target:'Bonjou', native:'Bonjour' },
        { target:'Ki jan ou ye?', native:'Comment vas-tu ?' },
        { target:'Nou pa pi mal', native:'On ne va pas trop mal' },
      ],
      pitfalls: [
        {
          type: 'social_register', forNativeLang: ['fr', 'en'],
          explanation: { fr:'"konpè" et "kòmè" indiquent une proximité ou un respect, mais un nouvel arrivant doit les utiliser avec prudence, surtout en milieu urbain — ce ne sont pas de simples mots de vocabulaire neutres.' },
          example: 'Konpè/kòmè ont aussi un sens religieux précis : parrain/marraine de baptême.',
        },
        {
          type: 'social_register', forNativeLang: ['fr', 'en'],
          explanation: { fr:'"bòs" s\'adresse à un artisan (cordonnier, menuisier, mécanicien) — utilisé de façon familière ou badine, ça peut sous-entendre une supériorité mal vue venant d\'un étranger.' },
          example: 'À utiliser avec prudence si on ne connaît pas bien son interlocuteur.',
        },
      ],
      rule: { fr:'Les termes d\'adresse créoles portent une charge sociale forte — pas juste une traduction de politesse.' },
      unlocksBuilding: 'park',
    },
    {
      id: 'ht_pronouns_contraction', order: 2, category: 'structure',
      title: { fr:'Pronoms et contractions orales', en:'Pronouns & oral contractions' },
      recommendedBefore: 'ht_greetings_konpe',
      examples: [
        { target:'Mwen / M', native:'Je / Me (forme contractée)' },
        { target:'Ban-m nouvèl ou', native:'Donne-moi de tes nouvelles' },
      ],
      pitfalls: [
        {
          type: 'register_nuance', forNativeLang: ['fr', 'en'],
          explanation: { fr:'À l\'oral rapide, "mwen" se contracte souvent en "m" — les deux formes sont correctes, mais il faut reconnaître la version courte à l\'écoute.' },
          example: 'Ban-m nouvèl ou = Ban mwen nouvèl ou',
        },
      ],
      rule: { fr:'Le créole oral courant contracte fréquemment les pronoms — l\'écoute doit anticiper ces formes courtes.' },
      unlocksBuilding: 'school',
    },
  ],

};

// ============================================================================
// 3. TABLE DE CONJUGAISON — donnée séparée, consultable à la demande
// Extraite de l'annexe "Espagnol pour les Nuls" ; structure réutilisable
// pour toute langue à conjugaison rendue dans pnj.js / dialogue.js
// ============================================================================
var CONJUGATION_TABLE = {
  es: {
    hablar: { meaning:{fr:'parler'},
      present:{yo:'hablo',tu:'hablas','él/ella':'habla',nosotros:'hablamos',vosotros:'habláis','ellos/ellas':'hablan'},
      past:{yo:'hablé',tu:'hablaste','él/ella':'habló',nosotros:'hablamos',vosotros:'hablasteis','ellos/ellas':'hablaron'},
      future:{yo:'hablaré',tu:'hablarás','él/ella':'hablará',nosotros:'hablaremos',vosotros:'hablaréis','ellos/ellas':'hablarán'},
      gerund:'hablando' },
    ir: { meaning:{fr:'aller'},
      present:{yo:'voy',tu:'vas','él/ella':'va',nosotros:'vamos',vosotros:'vais','ellos/ellas':'van'},
      past:{yo:'fui',tu:'fuiste','él/ella':'fue',nosotros:'fuimos',vosotros:'fuisteis','ellos/ellas':'fueron'},
      future:{yo:'iré',tu:'irás','él/ella':'irá',nosotros:'iremos',vosotros:'iréis','ellos/ellas':'irán'},
      gerund:'yendo' },
    hacer: { meaning:{fr:'faire'},
      present:{yo:'hago',tu:'haces','él/ella':'hace',nosotros:'hacemos',vosotros:'hacéis','ellos/ellas':'hacen'},
      past:{yo:'hice',tu:'hiciste','él/ella':'hizo',nosotros:'hicimos',vosotros:'hicisteis','ellos/ellas':'hicieron'},
      future:{yo:'haré',tu:'harás','él/ella':'hará',nosotros:'haremos',vosotros:'haréis','ellos/ellas':'harán'},
      gerund:'haciendo' },
  },
};

// ============================================================================
// 4. API PUBLIQUE
// ============================================================================

function getUnitsForLang(targetLang) {
  return UNITS[targetLang] || [];
}

function getCurrentUnit(targetLang, xp) {
  var units = getUnitsForLang(targetLang);
  var current = null;
  units.forEach(function (u) {
    var threshold = u.lockXP || (u.order - 1) * 80;
    if (xp >= threshold) current = u;
  });
  return current;
}

function getNextUnit(targetLang, xp) {
  var units = getUnitsForLang(targetLang);
  for (var i = 0; i < units.length; i++) {
    var threshold = units[i].lockXP || (units[i].order - 1) * 80;
    if (xp < threshold) return units[i];
  }
  return null;
}

// Pièges pertinents pour la paire (langue native du joueur → langue cible),
// filtrés et prêts à être injectés dans un system prompt IA (pnj.js)
function getPitfallsForPrompt(targetLang, nativeLang, unitId) {
  var units = getUnitsForLang(targetLang);
  var unit = unitId
    ? units.find(function (u) { return u.id === unitId; })
    : null;
  var pool = unit ? [unit] : units;
  var result = [];
  pool.forEach(function (u) {
    (u.pitfalls || []).forEach(function (p) {
      if (p.forNativeLang.indexOf(nativeLang) !== -1) {
        result.push({
          type: p.type,
          icon: PITFALL_TYPES[p.type] ? PITFALL_TYPES[p.type].icon : '⚠️',
          explanation: p.explanation[nativeLang] || p.explanation.fr,
          example: p.example,
        });
      }
    });
  });
  return result;
}

// Formate les pièges pertinents en texte court injectable dans un system prompt
function buildPitfallPromptSnippet(targetLang, nativeLang, unitId) {
  var pitfalls = getPitfallsForPrompt(targetLang, nativeLang, unitId);
  if (!pitfalls.length) return '';
  var lines = pitfalls.slice(0, 4).map(function (p) {
    return '- ' + p.explanation + (p.example ? ' (ex: ' + p.example + ')' : '');
  });
  return 'Pièges fréquents à surveiller pour ce joueur:\n' + lines.join('\n');
}

function getConjugation(lang, verb) {
  return (CONJUGATION_TABLE[lang] && CONJUGATION_TABLE[lang][verb]) || null;
}

return {
  PITFALL_TYPES: PITFALL_TYPES,
  UNITS: UNITS,
  CONJUGATION_TABLE: CONJUGATION_TABLE,
  getUnitsForLang: getUnitsForLang,
  getCurrentUnit: getCurrentUnit,
  getNextUnit: getNextUnit,
  getPitfallsForPrompt: getPitfallsForPrompt,
  buildPitfallPromptSnippet: buildPitfallPromptSnippet,
  getConjugation: getConjugation,
};

})();

console.log('✅ curriculum.js chargé —', Object.keys(window.CURRICULUM.UNITS).length, 'langues structurées');
