// api/test.js — équivalent de la route GET /test du server.js original
const { setCors } = require('../lib/gemini');

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.json({ erreur: 'Clé GEMINI_API_KEY manquante dans les variables d\'environnement Vercel !' });

  const modele = 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modele}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Réponds juste: Je fonctionne!' }] }],
        generationConfig: { maxOutputTokens: 200 }
      })
    });
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      return res.json({ succes: true, modele_qui_fonctionne: modele, reponse: text });
    }
    return res.json({ erreur: 'Aucun modèle ne fonctionne. Vérifiez votre clé API.', details: data });
  } catch (e) {
    return res.json({ erreur: e.message });
  }
};
