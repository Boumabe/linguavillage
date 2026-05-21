// LinguaVillage — memory.js (avec updateWeeklyProgress)
// ================================================================

window.LV_MEMORY = (function() {
  const KEY = 'lv_memory_v1';
  function _default() {
    return {
      level: 'zero',
      masteredWords: [],
      weakWords: [],
      favoriteWords: [],
      recentWords: [],
      corrections: {},
      sessionsCount: 0,
      totalMessages: 0,
      grammarWeak: [],
      lastSeen: {},
      customData: {}
    };
  }
  let _mem = _default();
  function _load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) _mem = Object.assign(_default(), JSON.parse(raw));
    } catch(e) { _mem = _default(); }
  }
  function _save() { try { localStorage.setItem(KEY, JSON.stringify(_mem)); } catch(e) {} }
  _load();

  function get(key) { return _mem[key]; }
  function set(key, value) { _mem[key] = value; _save(); }

  function markMastered(word) {
    if (!_mem.masteredWords.includes(word)) _mem.masteredWords.push(word);
    _mem.weakWords = _mem.weakWords.filter(w => w !== word);
    _mem.lastSeen[word] = Date.now();
    _addRecent(word);
    _save();
    if (typeof updateWeeklyProgress === 'function') updateWeeklyProgress('learn_word', 1);
  }

  function markWeak(word) {
    _mem.corrections[word] = (_mem.corrections[word] || 0) + 1;
    if (_mem.corrections[word] >= 2 && !_mem.weakWords.includes(word)) _mem.weakWords.push(word);
    _addRecent(word);
    _save();
  }

  function addFavorite(word, translation) {
    const exists = _mem.favoriteWords.find(f => f.word === word);
    if (!exists) {
      _mem.favoriteWords.push({ word, translation, addedAt: Date.now() });
      _save();
      if (typeof showNotif === 'function') showNotif('⭐ "' + word + '" ajouté aux favoris !');
    }
  }
  function removeFavorite(word) {
    _mem.favoriteWords = _mem.favoriteWords.filter(f => f.word !== word);
    _save();
  }
  function newSession() { _mem.sessionsCount++; _save(); }
  function newMessage() { _mem.totalMessages++; _save(); }
  function markGrammarWeak(point) {
    if (!_mem.grammarWeak.includes(point)) { _mem.grammarWeak.push(point); _save(); }
  }
  function getLVContext() {
    const mastered = _mem.masteredWords.slice(-15).join(', ') || 'aucun encore';
    const weak     = _mem.weakWords.slice(-8).join(', ')     || 'aucun identifié';
    const favs     = _mem.favoriteWords.slice(-5).map(f => f.word).join(', ') || 'aucun';
    const recent   = _mem.recentWords.slice(-10).join(', ')  || 'aucun';
    const level    = _mem.level || 'débutant';
    const grammar  = _mem.grammarWeak.slice(-4).join(', ')   || 'aucun';
    return `[MÉMOIRE APPRENANT]\nNiveau : ${level}\nMots maîtrisés récents : ${mastered}\nMots difficiles (à éviter ou simplifier) : ${weak}\nMots favoris (à réutiliser) : ${favs}\nVu récemment : ${recent}\nPoints de grammaire faibles : ${grammar}\nMessages total : ${_mem.totalMessages}\n[FIN MÉMOIRE]`;
  }
  function reset() { _mem = _default(); _save(); }
  function dump() { return JSON.parse(JSON.stringify(_mem)); }

  function _addRecent(word) {
    _mem.recentWords = _mem.recentWords.filter(w => w !== word);
    _mem.recentWords.unshift(word);
    if (_mem.recentWords.length > 20) _mem.recentWords.pop();
  }

  return {
    get, set, markMastered, markWeak, addFavorite, removeFavorite,
    newSession, newMessage, markGrammarWeak, getLVContext, reset, dump
  };
})();
