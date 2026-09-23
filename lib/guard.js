// lib/guard.js — garde-fous communs à toutes les routes /api
// (CORS restreint, limitation de débit, validation/nettoyage des entrées)
'use strict';

// ── Origines autorisées ──────────────────────────────────────────
// Le site officiel, ses déploiements de prévisualisation Vercel, GitHub Pages
// et le développement local. Ajoute d'autres origines via la variable
// d'environnement Vercel ALLOWED_ORIGINS (séparées par des virgules).
const EXTRA_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',').map((s) => s.trim()).filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin) return true; // appel same-origin ou outil serveur : la limitation de débit s'applique quand même
  if (EXTRA_ORIGINS.includes(origin)) return true;
  if (/^https:\/\/linguavillage[a-z0-9-]*\.vercel\.app$/i.test(origin)) return true;
  if (/^https:\/\/boumabe\.github\.io$/i.test(origin)) return true;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) return true;
  return false;
}

// Renvoie true si la requête peut continuer, false si la réponse a déjà été envoyée.
function preflight(req, res, methods) {
  const origin = req.headers.origin;
  if (!isAllowedOrigin(origin)) {
    res.status(403).json({ error: 'origin_not_allowed' });
    return false;
  }
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', (methods || ['POST']).concat('OPTIONS').join(', '));
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') { res.status(204).end(); return false; }
  if (methods && !methods.includes(req.method)) {
    res.status(405).json({ error: 'method_not_allowed' });
    return false;
  }
  return true;
}

// ── Limitation de débit (en mémoire, par instance) ───────────────
// Sur Vercel chaque instance serverless garde sa propre mémoire : ce n'est pas
// un pare-feu parfait, mais ça stoppe les rafales et l'abus par script simple.
// Pour une protection stricte, brancher Upstash/Vercel KV ici (même signature).
const buckets = new Map();
function clientIp(req) {
  const xff = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return xff || (req.socket && req.socket.remoteAddress) || 'unknown';
}
function rateLimit(req, res, name, limit, windowMs) {
  const now = Date.now();
  const key = name + ':' + clientIp(req);
  let b = buckets.get(key);
  if (!b || now > b.reset) { b = { count: 0, reset: now + windowMs }; buckets.set(key, b); }
  b.count += 1;
  if (buckets.size > 5000) { // nettoyage
    for (const [k, v] of buckets) if (now > v.reset) buckets.delete(k);
  }
  if (b.count > limit) {
    res.setHeader('Retry-After', String(Math.ceil((b.reset - now) / 1000)));
    res.status(429).json({ error: 'rate_limited' });
    return false;
  }
  return true;
}

// ── Entrées ──────────────────────────────────────────────────────
function body(req) {
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  return b && typeof b === 'object' ? b : {};
}
function clip(v, n) {
  return String(v == null ? '' : v).replace(/\u0000/g, '').slice(0, n);
}
const LANGS = {
  fr: 'français', en: 'anglais', es: 'espagnol', ht: 'créole haïtien',
  de: 'allemand', ru: 'russe', zh: 'chinois (mandarin)', ja: 'japonais',
};
const LANG_ALIASES = { francais: 'fr', 'français': 'fr', french: 'fr', anglais: 'en', english: 'en',
  espagnol: 'es', 'español': 'es', spanish: 'es', 'créole': 'ht', creole: 'ht', 'kreyòl': 'ht',
  allemand: 'de', deutsch: 'de', german: 'de', russe: 'ru', russian: 'ru',
  chinois: 'zh', mandarin: 'zh', chinese: 'zh', japonais: 'ja', japanese: 'ja' };
// Accepte un code ('en'), un nom ('anglais') ou une chaîne quelconque ; renvoie {code, name}.
function lang(v, fallbackCode) {
  const raw = clip(v, 30).trim().toLowerCase();
  let code = LANGS[raw] ? raw : LANG_ALIASES[raw] || null;
  if (!code) {
    for (const k of Object.keys(LANGS)) if (raw && LANGS[k].toLowerCase().startsWith(raw)) { code = k; break; }
  }
  if (!code) code = fallbackCode;
  return { code, name: LANGS[code] || clip(v, 30) || LANGS[fallbackCode] };
}
function history(arr, maxItems, maxChars) {
  if (!Array.isArray(arr)) return [];
  return arr.slice(-maxItems)
    .map((h) => ({
      role: h && (h.role === 'assistant' || h.role === 'npc' || h.role === 'model') ? 'assistant' : 'user',
      content: clip(h && (h.content != null ? h.content : h.text), maxChars),
    }))
    .filter((h) => h.content.trim());
}

module.exports = { preflight, rateLimit, body, clip, lang, history, LANGS, isAllowedOrigin };
