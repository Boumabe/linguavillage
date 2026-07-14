// api/translate.js — équivalent de POST /api/translate du server.js original
const { callGemini, setCors } = require('../lib/gemini');

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { text, targetLanguage = 'français' } = req.body;
  if (!text) return res.status(400).json({ error: 'Texte manquant.' });

  const systemInstruction = `Tu es un traducteur expert. Tu traduis le texte demandé et tu réponds UNIQUEMENT avec la traduction, sans aucune explication ni ponctuation supplémentaire.`;

  try {
    const translation = await callGemini(
      systemInstruction,
      `Traduis ce texte en ${targetLanguage} : "${text}"`,
      [],
      100,
      true
    );
    res.json({ translation: translation.trim() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
