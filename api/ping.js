// api/ping.js — sonde de santé (GET /api/ping). Ne contacte pas Gemini : aucun coût de quota.
'use strict';
const G = require('../lib/guard');

module.exports = (req, res) => {
  if (!G.preflight(req, res, ['GET', 'HEAD'])) return;
  res.status(200).json({ ok: true, ai: !!process.env.GEMINI_API_KEY, t: Date.now() });
};
