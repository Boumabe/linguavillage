// LinguaVillage — wordgame.js
// Mini-jeu : aligner des lettres pour former un mot dans la langue cible
// Difficulté adaptative, collection personnelle, mots favoris dans les PNJ
// Exposé via window.LV_WORDGAME
// ================================================================

window.LV_WORDGAME = (function() {

  // ── Mots par langue et par niveau ───────────────────────────
  const WORD_POOL = {
    fr: {
      zero:         ['eau', 'oui', 'non', 'pain', 'chat', 'chien', 'mer', 'sol', 'lit', 'rue'],
      beginner:     ['bonjour', 'merci', 'maison', 'jardin', 'soleil', 'musique', 'livre', 'table', 'porte', 'fenêtre'],
      elementary:   ['comprendre', 'apprendre', 'travailler', 'manger', 'dormir', 'partir', 'arriver', 'chercher'],
      intermediate: ['extraordinaire', 'développement', 'apprentissage', 'connaissance', 'environnement'],
    },
    es: {
      zero:         ['sí', 'no', 'agua', 'pan', 'sol', 'mar', 'luz', 'voz', 'pie', 'ojo'],
      beginner:     ['hola', 'gracias', 'casa', 'perro', 'gato', 'libro', 'mesa', 'amigo', 'ciudad', 'comida'],
      elementary:   ['hablar', 'comer', 'dormir', 'aprender', 'trabajar', 'comprar', 'caminar', 'escribir'],
      intermediate: ['extraordinario', 'conocimiento', 'aprendizaje', 'desarrollar', 'importante'],
    },
    en: {
      zero:         ['yes', 'no', 'sun', 'cat', 'dog', 'bed', 'sky', 'sea', 'run', 'eat'],
      beginner:     ['hello', 'water', 'house', 'friend', 'music', 'book', 'door', 'food', 'time', 'love'],
      elementary:   ['beautiful', 'important', 'together', 'morning', 'evening', 'language', 'learning'],
      intermediate: ['extraordinary', 'understanding', 'development', 'knowledge', 'independence'],
    },
    de: {
      zero:         ['ja', 'nein', 'gut', 'Tag', 'Haus', 'Kind', 'Mann', 'Frau', 'Brot', 'Wein'],
      beginner:     ['hallo', 'danke', 'Wasser', 'Schule', 'Buch', 'Tisch', 'Stadt', 'Musik', 'Freund'],
      elementary:   ['lernen', 'sprechen', 'arbeiten', 'schreiben', 'verstehen', 'kaufen', 'reisen'],
      intermediate: ['Entwicklung', 'Ausbildung', 'Verständnis', 'Gemeinschaft', 'Wissenschaft'],
    },
    ru: {
      zero:         ['да', 'нет', 'дом', 'кот', 'вода', 'хлеб', 'день', 'ночь', 'мать', 'отец'],
      beginner:     ['привет', 'спасибо', 'школа', 'книга', 'стол', 'город', 'музыка', 'друг'],
      elementary:   ['говорить', 'учиться', 'работать', 'понимать', 'смотреть', 'слушать'],
      intermediate: ['образование', 'развитие', 'понимание', 'возможность', 'сообщество'],
    },
    zh: {
      zero:         ['水', '火', '山', '日', '月', '人', '大', '小', '好', '不'],
      beginner:     ['你好', '谢谢', '学习', '朋友', '家庭', '音乐', '书本', '城市'],
      elementary:   ['努力学习', '理解', '工作', '旅行', '音乐', '文化', '语言'],
      intermediate: ['发展', '知识', '机会', '理解', '环境', '创造'],
    },
    ja: {
      zero:         ['水', '火', '山', '空', '海', '人', '本', '花', '木', '石'],
      beginner:     ['こんにちは', 'ありがとう', '学校', '友達', '音楽', '家', '本'],
      elementary:   ['勉強する', '話す', '理解する', '旅行', '仕事', '文化'],
      intermediate: ['発展', '知識', '機会', '環境', '創造'],
    },
    ht: {
      zero:         ['wi', 'non', 'dlo', 'feu', 'solèy', 'chat', 'chen', 'mango', 'kay', 'moun'],
      beginner:     ['bonjou', 'mèsi', 'lekòl', 'zanmi', 'mizik', 'liv', 'manje', 'dòmi'],
      elementary:   ['aprann', 'travay', 'konprann', 'pale', 'ekri', 'li', 'kouri'],
      intermediate: ['devlopman', 'konesans', 'konprehansyon', 'edikasyon', 'kominote'],
    },
  };

  // ── État du jeu ─────────────────────────────────────────────
  let _state = {
    active:        false,
    targetWord:    '',
    scrambled:     [],
    selected:      [],
    currentAnswer: '',
    score:         0,
    streak:        0,
    level:         'zero',
    lang:          'fr',
    discovered:    [],   // mots trouvés cette session
    usedWords:     [],   // pour éviter répétitions
  };

  // ── Ouvrir le jeu ───────────────────────────────────────────
  function open() {
    _state.lang  = (window.S && S.targetLang) || 'fr';
    _state.level = (window.S && S.userLevel) || 'zero';
    _state.score  = 0;
    _state.streak = 0;
    _state.discovered = [];
    _state.active = true;

    _buildScreen();
    _nextWord();

    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    const sc = document.getElementById('screen-wordgame');
    if (sc) sc.style.display = 'flex';
  }

  function close() {
    _state.active = false;
    const sc = document.getElementById('screen-wordgame');
    if (sc) sc.style.display = 'none';
    if (typeof showScreen === 'function') showScreen('screen-menu');
  }

  // ── Construire l'écran ───────────────────────────────────────
  function _buildScreen() {
    let sc = document.getElementById('screen-wordgame');
    if (!sc) {
      sc = document.createElement('div');
      sc.id = 'screen-wordgame';
      sc.className = 'screen';
      sc.style.cssText = [
        'display:none', 'flex-direction:column', 'align-items:center',
        'background:radial-gradient(ellipse at 50% 20%,#0d1a2e 0%,#07090f 70%)',
        'padding:0', 'overflow:hidden'
      ].join(';');
      document.body.appendChild(sc);
    }
    _renderGame(sc);
  }

  function _renderGame(sc) {
    const lang = _state.lang;
    const langFlag = (window.FLAGS && FLAGS[lang]) || '';
    const level = _state.level;

    sc.innerHTML = `
      <!-- Header -->
      <div style="width:100%;display:flex;align-items:center;padding:12px 16px;
                  border-bottom:1px solid rgba(255,215,0,0.12);background:rgba(7,9,15,0.9);
                  flex-shrink:0;gap:10px;">
        <button onclick="window.LV_WORDGAME.close()"
          style="background:transparent;border:1px solid rgba(255,255,255,0.12);
                 color:rgba(232,224,208,0.5);padding:5px 12px;border-radius:8px;
                 font-size:0.72rem;font-weight:700;cursor:pointer;">← Menu</button>
        <div style="font-family:'Cinzel',serif;font-size:0.9rem;font-weight:700;
                    color:#ffd700;flex:1;">🔤 Jeu de mots ${langFlag}</div>
        <div id="wg-score-display"
          style="font-size:0.82rem;font-weight:800;color:#4ecf70;">
          ⭐ 0 pts
        </div>
      </div>

      <!-- Zone principale -->
      <div style="flex:1;overflow-y:auto;width:100%;max-width:440px;
                  padding:20px 16px;display:flex;flex-direction:column;
                  align-items:center;gap:16px;">

        <!-- Info niveau -->
        <div style="font-size:0.72rem;color:rgba(255,255,255,0.35);text-align:center;">
          Niveau : <strong style="color:#ffd700;">${level}</strong>
          &nbsp;•&nbsp; Série : <span id="wg-streak" style="color:#4ecf70;">0</span>
        </div>

        <!-- Indice / phonétique -->
        <div id="wg-hint" style="min-height:24px;text-align:center;font-size:0.78rem;
                                  color:#4a9eff;font-style:italic;"></div>

        <!-- Zone de réponse (lettres choisies) -->
        <div style="width:100%;">
          <div style="font-size:0.68rem;font-weight:800;letter-spacing:0.1em;
                      text-transform:uppercase;color:rgba(255,215,0,0.5);
                      margin-bottom:8px;text-align:center;">Ton mot</div>
          <div id="wg-answer-zone"
            style="min-height:56px;background:rgba(255,215,0,0.05);
                   border:2px dashed rgba(255,215,0,0.2);border-radius:14px;
                   display:flex;align-items:center;justify-content:center;
                   flex-wrap:wrap;gap:6px;padding:10px;cursor:pointer;"
            onclick="window.LV_WORDGAME.clearLast()">
            <span style="color:rgba(255,255,255,0.2);font-size:0.78rem;">
              Clique sur les lettres ci-dessous
            </span>
          </div>
        </div>

        <!-- Lettres mélangées -->
        <div style="width:100%;">
          <div style="font-size:0.68rem;font-weight:800;letter-spacing:0.1em;
                      text-transform:uppercase;color:rgba(255,255,255,0.3);
                      margin-bottom:8px;text-align:center;">Lettres disponibles</div>
          <div id="wg-letters-zone"
            style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;">
          </div>
        </div>

        <!-- Boutons action -->
        <div style="display:flex;gap:8px;width:100%;">
          <button onclick="window.LV_WORDGAME.clearAll()"
            style="flex:1;background:rgba(255,107,107,0.08);border:1px solid rgba(255,107,107,0.2);
                   color:#ff6b6b;padding:11px;border-radius:12px;font-weight:700;
                   font-size:0.82rem;cursor:pointer;">🗑 Effacer</button>
          <button onclick="window.LV_WORDGAME.check()"
            id="wg-check-btn"
            style="flex:2;background:linear-gradient(135deg,#a86800,#ffd700);border:none;
                   border-radius:12px;padding:11px;font-family:'Cinzel',serif;
                   font-weight:700;font-size:0.88rem;color:#0a0a0a;cursor:pointer;">
            ✓ Valider
          </button>
          <button onclick="window.LV_WORDGAME.skip()"
            style="flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);
                   color:rgba(255,255,255,0.4);padding:11px;border-radius:12px;font-weight:700;
                   font-size:0.82rem;cursor:pointer;">⏭ Passer</button>
        </div>

        <!-- Feedback -->
        <div id="wg-feedback"
          style="min-height:48px;width:100%;text-align:center;
                 border-radius:12px;padding:10px;font-size:0.85rem;
                 font-weight:700;display:none;">
        </div>

        <!-- Collection de mots découverts -->
        <div style="width:100%;margin-top:8px;">
          <div style="font-size:0.68rem;font-weight:800;letter-spacing:0.1em;
                      text-transform:uppercase;color:rgba(255,215,0,0.4);
                      margin-bottom:10px;">Ta collection — cette session</div>
          <div id="wg-collection"
            style="display:flex;flex-wrap:wrap;gap:6px;min-height:32px;">
            <span style="color:rgba(255,255,255,0.2);font-size:0.72rem;">
              Trouve des mots pour les ajouter ici
            </span>
          </div>
        </div>
      </div>
    `;
  }

  // ── Prochain mot ─────────────────────────────────────────────
  function _nextWord() {
    const pool = WORD_POOL[_state.lang]?.[_state.level] || WORD_POOL.fr.zero;
    const available = pool.filter(w => !_state.usedWords.includes(w));
    if (available.length === 0) {
      _state.usedWords = []; // Reset si tous utilisés
    }
    const candidates = pool.filter(w => !_state.usedWords.includes(w));
    _state.targetWord = candidates[Math.floor(Math.random() * candidates.length)] || pool[0];
    _state.usedWords.push(_state.targetWord);
    _state.selected = [];
    _state.currentAnswer = '';

    // Mélanger les lettres
    const letters = _state.targetWord.split('');
    _state.scrambled = _shuffle([...letters]);
    // S'assurer que le mélange est différent du mot
    let tries = 0;
    while (_state.scrambled.join('') === _state.targetWord && tries < 10) {
      _state.scrambled = _shuffle([...letters]);
      tries++;
    }

    _renderLetters();
    _updateAnswerZone();
    _showHint();
  }

  // ── Rendu des lettres ────────────────────────────────────────
  function _renderLetters() {
    const zone = document.getElementById('wg-letters-zone');
    if (!zone) return;
    zone.innerHTML = _state.scrambled.map((letter, i) => {
      const used = _state.selected.includes(i);
      return `<button
        onclick="window.LV_WORDGAME.selectLetter(${i})"
        data-letter-idx="${i}"
        style="
          width:44px;height:44px;
          background:${used ? 'rgba(255,255,255,0.05)' : 'rgba(255,215,0,0.1)'};
          border:2px solid ${used ? 'rgba(255,255,255,0.08)' : 'rgba(255,215,0,0.35)'};
          border-radius:10px;
          color:${used ? 'rgba(255,255,255,0.15)' : '#ffd700'};
          font-size:1.2rem;font-weight:800;cursor:${used ? 'default' : 'pointer'};
          transition:all 0.15s;
          font-family:'Nunito',sans-serif;
          ${used ? '' : 'box-shadow:0 2px 8px rgba(255,215,0,0.15);'}
        "
        ${used ? 'disabled' : ''}>
        ${letter}
      </button>`;
    }).join('');
  }

  // ── Sélectionner une lettre ──────────────────────────────────
  function selectLetter(idx) {
    if (_state.selected.includes(idx)) return;
    _state.selected.push(idx);
    _state.currentAnswer = _state.selected.map(i => _state.scrambled[i]).join('');
    _renderLetters();
    _updateAnswerZone();
  }

  function clearLast() {
    if (_state.selected.length === 0) return;
    _state.selected.pop();
    _state.currentAnswer = _state.selected.map(i => _state.scrambled[i]).join('');
    _renderLetters();
    _updateAnswerZone();
  }

  function clearAll() {
    _state.selected = [];
    _state.currentAnswer = '';
    _renderLetters();
    _updateAnswerZone();
  }

  function skip() {
    _state.streak = 0;
    _updateScoreDisplay();
    _showFeedback('⏭ Mot passé. Le mot était : ' + _state.targetWord, false);
    setTimeout(_nextWord, 1800);
  }

  // ── Mettre à jour la zone réponse ────────────────────────────
  function _updateAnswerZone() {
    const zone = document.getElementById('wg-answer-zone');
    if (!zone) return;
    if (_state.selected.length === 0) {
      zone.innerHTML = '<span style="color:rgba(255,255,255,0.2);font-size:0.78rem;">Clique sur les lettres ci-dessous</span>';
      return;
    }
    zone.innerHTML = _state.selected.map((idx, pos) => `
      <span onclick="window.LV_WORDGAME._removeAt(${pos})"
        style="display:inline-flex;align-items:center;justify-content:center;
               width:40px;height:40px;background:rgba(255,215,0,0.15);
               border:2px solid rgba(255,215,0,0.4);border-radius:9px;
               color:#ffd700;font-size:1.15rem;font-weight:800;cursor:pointer;
               font-family:'Nunito',sans-serif;transition:all 0.1s;"
        title="Retirer cette lettre">
        ${_state.scrambled[idx]}
      </span>`).join('');
  }

  function _removeAt(pos) {
    _state.selected.splice(pos, 1);
    _state.currentAnswer = _state.selected.map(i => _state.scrambled[i]).join('');
    _renderLetters();
    _updateAnswerZone();
  }

  // ── Valider la réponse ───────────────────────────────────────
  function check() {
    const answer = _state.currentAnswer.toLowerCase().trim();
    const target = _state.targetWord.toLowerCase().trim();

    if (answer === target) {
      _state.score  += 10 + (_state.streak * 2);
      _state.streak += 1;
      _addToCollection(_state.targetWord);
      _updateScoreDisplay();
      _showFeedback('✅ Parfait ! +' + (10 + (_state.streak - 1) * 2) + ' pts', true);
      if (window.LV_MEMORY) window.LV_MEMORY.markMastered(_state.targetWord);
      if (typeof gainXP === 'function') gainXP(15);
      if (window.LV_SPRITES) window.LV_SPRITES.setExpression('happy', 2000);
      setTimeout(_nextWord, 1600);
    } else {
      _state.streak = 0;
      _updateScoreDisplay();
      _showFeedback('❌ Pas tout à fait. Essaie encore !', false);
      if (window.LV_MEMORY) window.LV_MEMORY.markWeak(_state.targetWord);
      if (window.LV_SPRITES) window.LV_SPRITES.setExpression('confused', 2000);
      // Secouer visuellement
      _shakeAnswerZone();
    }
  }

  // ── Afficher feedback ────────────────────────────────────────
  function _showFeedback(msg, success) {
    const fb = document.getElementById('wg-feedback');
    if (!fb) return;
    fb.textContent = msg;
    fb.style.display = 'block';
    fb.style.background = success ? 'rgba(78,207,112,0.1)' : 'rgba(255,107,107,0.1)';
    fb.style.border = '1px solid ' + (success ? 'rgba(78,207,112,0.3)' : 'rgba(255,107,107,0.3)');
    fb.style.color = success ? '#4ecf70' : '#ff6b6b';
    setTimeout(() => { if(fb) fb.style.display = 'none'; }, 1500);
  }

  // ── Afficher indice phonétique ───────────────────────────────
  function _showHint() {
    const hint = document.getElementById('wg-hint');
    if (!hint) return;
    const phonetic = window.LV_PHONEMES
      ? window.LV_PHONEMES.getPhonetic(_state.targetWord, _state.lang, window.S?.nativeLang)
      : '';
    if (phonetic) {
      hint.textContent = '🔊 ' + phonetic;
      hint.style.opacity = '0.7';
    } else {
      hint.textContent = '';
    }
    // Énoncer le mot
    if ('speechSynthesis' in window) {
      setTimeout(() => {
        const langMap = {fr:'fr-FR',es:'es-ES',en:'en-US',de:'de-DE',
                         ru:'ru-RU',zh:'zh-CN',ja:'ja-JP',ht:'fr-HT'};
        const u = new SpeechSynthesisUtterance(_state.targetWord);
        u.lang = langMap[_state.lang] || 'fr-FR';
        u.rate = 0.7;
        speechSynthesis.speak(u);
      }, 300);
    }
  }

  // ── Ajouter à la collection ──────────────────────────────────
  function _addToCollection(word) {
    if (!_state.discovered.includes(word)) {
      _state.discovered.push(word);
    }
    const col = document.getElementById('wg-collection');
    if (!col) return;
    const isFav = window.LV_MEMORY
      && (window.LV_MEMORY.get('favoriteWords') || []).find(f => f.word === word);

    col.innerHTML = _state.discovered.map(w => `
      <div style="display:flex;align-items:center;gap:5px;
                  background:rgba(78,207,112,0.08);border:1px solid rgba(78,207,112,0.2);
                  border-radius:10px;padding:5px 10px;">
        <span style="font-size:0.8rem;color:#4ecf70;font-weight:700;">${w}</span>
        <button onclick="window.LV_WORDGAME.addFav('${w}')"
          title="Ajouter aux favoris"
          style="background:none;border:none;cursor:pointer;font-size:0.85rem;
                 opacity:${isFav ? 1 : 0.4};">⭐</button>
      </div>`).join('');
  }

  function addFav(word) {
    if (window.LV_MEMORY) {
      window.LV_MEMORY.addFavorite(word, '');
      // Mettre à jour l'affichage
      _addToCollection(word);
    }
  }

  // ── Mise à jour score ────────────────────────────────────────
  function _updateScoreDisplay() {
    const sc = document.getElementById('wg-score-display');
    if (sc) sc.textContent = '⭐ ' + _state.score + ' pts';
    const st = document.getElementById('wg-streak');
    if (st) st.textContent = _state.streak;
  }

  // ── Secouer la zone réponse (erreur) ─────────────────────────
  function _shakeAnswerZone() {
    const zone = document.getElementById('wg-answer-zone');
    if (!zone) return;
    zone.style.animation = 'wg-shake 0.4s ease';
    setTimeout(() => { if(zone) zone.style.animation = ''; }, 400);
  }

  // ── Utilitaires ──────────────────────────────────────────────
  function _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ── CSS du jeu ───────────────────────────────────────────────
  (function injectStyles() {
    if (document.getElementById('lv-wordgame-styles')) return;
    const style = document.createElement('style');
    style.id = 'lv-wordgame-styles';
    style.textContent = `
      @keyframes wg-shake {
        0%,100%{transform:translateX(0)}
        20%{transform:translateX(-8px)}
        40%{transform:translateX(8px)}
        60%{transform:translateX(-5px)}
        80%{transform:translateX(5px)}
      }
      @keyframes wg-pop {
        0%{transform:scale(1)} 50%{transform:scale(1.15)} 100%{transform:scale(1)}
      }
    `;
    document.head.appendChild(style);
  })();

  return {
    open, close, check, skip,
    selectLetter, clearLast, clearAll,
    addFav, _removeAt,
    get state() { return _state; },
    WORD_POOL,
  };

})();
