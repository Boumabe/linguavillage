// LinguaVillage — memory.js
// Mémoire personnalisée : mots maîtrisés, points faibles, favoris, niveau
// Indépendant — exposé via window.LV_MEMORY
// Les PNJ lisent cette mémoire via getLVContext()
// ================================================================

window.LV_MEMORY = (function() {

  const KEY = 'lv_memory_v1';

  // ── Structure par défaut ────────────────────────────────────
  function _default() {
    return {
      level:         'zero',      // zero | beginner | elementary | intermediate
      masteredWords: [],          // mots bien connus
      weakWords:     [],          // mots ratés 2+ fois
      favoriteWords: [],          // favoris ajoutés manuellement
      recentWords:   [],          // mots vus récemment (max 20)
      corrections:   {},          // { mot: nb_erreurs }
      sessionsCount: 0,
      totalMessages: 0,
      grammarWeak:   [],          // points de grammaire faibles
      lastSeen:      {},          // { mot: timestamp }
      customData:    {},          // clé-valeur libre
    };
  }

  // ── Chargement / Sauvegarde ─────────────────────────────────
  let _mem = _default();

  function _load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        _mem = Object.assign(_default(), parsed);
      }
    } catch(e) { _mem = _default(); }
  }

  function _save() {
    try { localStorage.setItem(KEY, JSON.stringify(_mem)); }
    catch(e) {}
  }

  _load();  // Charger au démarrage

  // ── API publique ────────────────────────────────────────────

  /** Lire une valeur */
  function get(key) { return _mem[key]; }

  /** Écrire une valeur */
  function set(key, value) { _mem[key] = value; _save(); }

  /** Marquer un mot comme maîtrisé */
  function markMastered(word) {
    if (!_mem.masteredWords.includes(word)) {
      _mem.masteredWords.push(word);
    }
    // Retirer des faibles si présent
    _mem.weakWords = _mem.weakWords.filter(w => w !== word);
    _mem.lastSeen[word] = Date.now();
    _addRecent(word);
    _save();
  }

  /** Marquer un mot comme difficile */
  function markWeak(word) {
    _mem.corrections[word] = (_mem.corrections[word] || 0) + 1;
    if (_mem.corrections[word] >= 2 && !_mem.weakWords.includes(word)) {
      _mem.weakWords.push(word);
    }
    _addRecent(word);
    _save();
  }

  /** Ajouter aux favoris */
  function addFavorite(word, translation) {
    const exists = _mem.favoriteWords.find(f => f.word === word);
    if (!exists) {
      _mem.favoriteWords.push({ word, translation, addedAt: Date.now() });
      _save();
      if (typeof showNotif === 'function') showNotif('⭐ "' + word + '" ajouté aux favoris !');
    }
  }

  /** Retirer des favoris */
  function removeFavorite(word) {
    _mem.favoriteWords = _mem.favoriteWords.filter(f => f.word !== word);
    _save();
  }

  /** Incrémenter session */
  function newSession() {
    _mem.sessionsCount++;
    _save();
  }

  /** Incrémenter messages */
  function newMessage() {
    _mem.totalMessages++;
    _save();
  }

  /** Marquer un point de grammaire faible */
  function markGrammarWeak(point) {
    if (!_mem.grammarWeak.includes(point)) {
      _mem.grammarWeak.push(point);
      _save();
    }
  }

  /** Obtenir le contexte formaté pour les PNJ (injecté dans le prompt) */
  function getLVContext() {
    const mastered = _mem.masteredWords.slice(-15).join(', ') || 'aucun encore';
    const weak     = _mem.weakWords.slice(-8).join(', ')     || 'aucun identifié';
    const favs     = _mem.favoriteWords.slice(-5).map(f => f.word).join(', ') || 'aucun';
    const recent   = _mem.recentWords.slice(-10).join(', ')  || 'aucun';
    const level    = _mem.level || 'débutant';
    const grammar  = _mem.grammarWeak.slice(-4).join(', ')   || 'aucun';

    return `
[MÉMOIRE APPRENANT]
Niveau : ${level}
Mots maîtrisés récents : ${mastered}
Mots difficiles (à éviter ou simplifier) : ${weak}
Mots favoris (à réutiliser) : ${favs}
Vu récemment : ${recent}
Points de grammaire faibles : ${grammar}
Messages total : ${_mem.totalMessages}
[FIN MÉMOIRE]`;
  }

  /** Réinitialiser la mémoire */
  function reset() {
    _mem = _default();
    _save();
  }

  /** Exporter toute la mémoire (debug) */
  function dump() { return JSON.parse(JSON.stringify(_mem)); }

  // ── Interne ─────────────────────────────────────────────────
  function _addRecent(word) {
    _mem.recentWords = _mem.recentWords.filter(w => w !== word);
    _mem.recentWords.unshift(word);
    if (_mem.recentWords.length > 20) _mem.recentWords.pop();
  }

  return {
    get, set,
    markMastered, markWeak,
    addFavorite, removeFavorite,
    newSession, newMessage,
    markGrammarWeak,
    getLVContext,
    reset, dump,
  };

})();
