// api/translate.js — dictionnaire et traduction (POST /api/translate)
'use strict';
const { callGemini, parseJsonLoose, AiError } = require('../lib/gemini');
const G = require('../lib/guard');

// Formes acceptées :
//  • dictionnaire (learning.js) : { word, nativeLang, targetLang }
//  • traduction simple          : { text, targetLanguage|targetLang, mode:'text'|'explain' }
module.exports = async (req, res) => {
  if (!G.preflight(req, res, ['POST'])) return;
  if (!G.rateLimit(req, res, 'translate', 40, 60000)) return;

  const b = G.body(req);
  const text = G.clip(b.word || b.text, 400).trim();
  if (!text) return res.status(400).json({ error: 'text_required' });
  const native = G.lang(b.nativeLang || b.nativeLanguage, 'fr');
  const target = G.lang(b.targetLang || b.targetLanguage || b.language, 'en');
  const mode = b.mode || (b.word ? 'dictionary' : 'text');

  try {
    if (mode === 'dictionary') {
      // Dictionnaire pédagogique entre langue maternelle et langue cible (dans les deux sens).
      const raw = await callGemini({
        system: 'Tu es un dictionnaire pédagogique précis. Tu réponds uniquement par un objet JSON valide.',
        message:
          `Expression : ${JSON.stringify(text)}\nLangue maternelle de l'utilisateur : ${native.name}. Langue apprise : ${target.name}.\n` +
          `Si l'expression est en ${native.name}, donne sa meilleure traduction en ${target.name} ; sinon donne sa traduction en ${native.name}.\n` +
          'JSON : {"translation":"...","roman":"romanisation si la langue est zh/ja/ru sinon vide","grammar":"note grammaticale très brève","example":"une phrase d\'exemple courte et naturelle"}',
        maxTokens: 350, temperature: 0.2, json: true,
      });
      const p = parseJsonLoose(raw) || { translation: raw };
      const out = {
        translation: G.clip(p.translation, 300), roman: G.clip(p.roman, 300),
        grammar: G.clip(p.grammar, 300), example: G.clip(p.example, 400),
      };
      // `reply` : ancien format attendu par l'ancien client (chaîne JSON).
      return res.status(200).json({ ...out, reply: JSON.stringify(out) });
    }

    const explain = mode === 'explain';
    const raw = await callGemini({
      system: 'Tu es un traducteur expert. Tu réponds uniquement par le résultat demandé, sans introduction ni guillemets superflus.',
      message: explain
        ? `Traduis en ${target.name} ce texte, puis explique-le en une phrase simple (en ${target.name}) : ${JSON.stringify(text)}`
        : `Traduis en ${target.name} : ${JSON.stringify(text)}`,
      maxTokens: explain ? 300 : 200, temperature: 0.2,
    });
    return res.status(200).json({ translation: G.clip(raw, 800).trim(), reply: G.clip(raw, 800).trim() });
  } catch (e) {
    const code = e instanceof AiError ? e.code : 'error';
    console.error('[translate]', code);
    return res.status(code === 'missing_key' ? 500 : 503).json({ error: code });
  }
};
