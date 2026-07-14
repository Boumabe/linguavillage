// api/correct.js — équivalent de POST /api/correct du server.js original
const { callGemini, setCors } = require('../lib/gemini');

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { text, language = 'anglais', nativeLanguage = 'français' } = req.body;
  if (!text) return res.status(400).json({ error: 'Texte manquant.' });

  const systemInstruction = `Tu es un professeur de langue expert. Tu analyses des phrases et tu réponds UNIQUEMENT en JSON valide sans aucun markdown ni texte supplémentaire.`;

  const userMessage = `Phrase en ${language} : "${text}"
JSON uniquement (pas de markdown) :
Correcte → {"correct":true,"corrected":"${text}","explanation":""}
Incorrecte → {"correct":false,"corrected":"VERSION CORRIGÉE","explanation":"RAISON COURTE en ${nativeLanguage}"}`;

  try {
    const raw = await callGemini(systemInstruction, userMessage, [], 250, true);
    const cleaned = raw.replace(/```json\n?|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    res.json(parsed);
  } catch (e) {
    console.error('Erreur correction parse:', e.message);
    res.json({ correct: true, corrected: text, explanation: '' });
  }
};
