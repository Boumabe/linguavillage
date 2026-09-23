// lib/gemini.js — appel Gemini partagé par toutes les routes /api
'use strict';

// Modèles essayés dans l'ordre (le second sert de secours en cas de quota/erreur).
// Modifiable sans toucher au code : variable Vercel GEMINI_MODELS="modele1,modele2".
const MODELS = (process.env.GEMINI_MODELS || 'gemini-2.5-flash,gemini-2.5-flash-lite')
  .split(',').map((s) => s.trim()).filter(Boolean);

// Budget total : Vercel (plan gratuit) coupe une fonction à 10 s.
const TOTAL_BUDGET_MS = 8500;

class AiError extends Error {
  constructor(code, detail) { super(code + (detail ? ': ' + detail : '')); this.code = code; }
}

function extractText(data) {
  const cand = data && data.candidates && data.candidates[0];
  if (!cand) {
    const block = data && data.promptFeedback && data.promptFeedback.blockReason;
    throw new AiError(block ? 'blocked' : 'empty', block);
  }
  const parts = (cand.content && cand.content.parts) || [];
  // On ignore les éventuelles "pensées" internes du modèle et on concatène le reste.
  const text = parts.filter((p) => p && !p.thought && typeof p.text === 'string').map((p) => p.text).join('').trim();
  if (!text) throw new AiError(cand.finishReason === 'SAFETY' ? 'blocked' : 'empty', cand.finishReason);
  return text;
}

/**
 * @param {object} o
 * @param {string} o.system       instructions système
 * @param {string} o.message      message utilisateur (jamais vide)
 * @param {Array}  [o.history]    [{role:'user'|'assistant', content}]
 * @param {number} [o.maxTokens]
 * @param {number} [o.temperature]
 * @param {boolean}[o.json]       demande une sortie JSON valide
 */
async function callGemini(o) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new AiError('missing_key');
  if (!o.message || !String(o.message).trim()) throw new AiError('empty_message');

  const contents = (o.history || []).map((h) => ({
    role: h.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: h.content }],
  }));
  // Gemini exige une alternance user/model qui commence par user : on fusionne les doublons consécutifs.
  const merged = [];
  for (const c of contents) {
    const last = merged[merged.length - 1];
    if (last && last.role === c.role) last.parts[0].text += '\n' + c.parts[0].text;
    else merged.push(c);
  }
  while (merged.length && merged[0].role !== 'user') merged.shift();
  const last = merged[merged.length - 1];
  if (last && last.role === 'user') last.parts[0].text += '\n' + o.message;
  else merged.push({ role: 'user', parts: [{ text: o.message }] });

  const body = {
    contents: merged,
    generationConfig: {
      maxOutputTokens: o.maxTokens || 300,
      temperature: o.temperature == null ? 0.8 : o.temperature,
      // Sans ceci, Gemini 2.5 "réfléchit" en consommant le budget de sortie :
      // les réponses courtes sortaient tronquées ou vides.
      thinkingConfig: { thinkingBudget: 0 },
      ...(o.json ? { responseMimeType: 'application/json' } : {}),
    },
  };
  if (o.system) body.systemInstruction = { parts: [{ text: o.system }] };

  const started = Date.now();
  let lastErr = new AiError('unavailable');
  for (const model of MODELS) {
    const remaining = TOTAL_BUDGET_MS - (Date.now() - started);
    if (remaining < 1500) break;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), remaining);
    try {
      const resp = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey }, // clé en en-tête, pas dans l'URL (évite les fuites dans les logs)
          body: JSON.stringify(body),
          signal: ctrl.signal,
        }
      );
      clearTimeout(timer);
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        console.error('[gemini]', model, resp.status, JSON.stringify(data && data.error || data).slice(0, 200));
        lastErr = new AiError(resp.status === 429 ? 'quota' : 'upstream_' + resp.status);
        continue; // essaie le modèle suivant
      }
      return extractText(data);
    } catch (e) {
      clearTimeout(timer);
      lastErr = e instanceof AiError ? e : new AiError(e && e.name === 'AbortError' ? 'timeout' : 'network');
      if (lastErr.code === 'blocked') throw lastErr; // inutile de réessayer un contenu bloqué
    }
  }
  throw lastErr;
}

// JSON tolérant : accepte ```json ... ``` ou du texte autour de l'objet.
function parseJsonLoose(text) {
  const cleaned = String(text).replace(/```json|```/gi, '').trim();
  try { return JSON.parse(cleaned); } catch (e) { /* on tente l'extraction */ }
  const a = cleaned.indexOf('{'); const b = cleaned.lastIndexOf('}');
  if (a >= 0 && b > a) { try { return JSON.parse(cleaned.slice(a, b + 1)); } catch (e) { /* rien */ } }
  return null;
}

module.exports = { callGemini, parseJsonLoose, AiError };
