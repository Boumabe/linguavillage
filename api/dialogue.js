// api/dialogue.js — équivalent de POST /api/dialogue du server.js original
const { callGemini, setCors } = require('../lib/gemini');

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  console.log('Requête reçue de:', req.headers.origin);

  const {
    npcName = 'Villageois',
    npcRole = 'Habitant',
    location = 'Village',
    language = 'anglais',
    playerName = 'Joueur',
    playerMessage = '',
    history = [],
    systemContext
  } = req.body;

  const isOpening = playerMessage === '__OPEN__';

  const systemInstruction = systemContext ||
    `Tu es ${npcName}, ${npcRole} dans le lieu "${location}" d'un jeu d'apprentissage des langues.
Tu parles TOUJOURS et UNIQUEMENT en ${language}.
Tu restes dans ton personnage à tout moment.
Tes réponses sont courtes : 1 à 2 phrases maximum.
Si le joueur fait une faute de langue, tu reformules naturellement dans ta réponse sans le corriger explicitement.
Le joueur s'appelle ${playerName}.`;

  const userMessage = isOpening
    ? `Commence la conversation. Accueille ${playerName} chaleureusement et pose-lui une question simple liée à ton rôle de ${npcRole}.`
    : playerMessage;

  try {
    const reply = await callGemini(
      systemInstruction,
      userMessage,
      isOpening ? [] : history.slice(-6),
      300
    );
    res.json({ reply });
  } catch (e) {
    console.error('Erreur dialogue:', e.message);
    const fallback = isOpening
      ? `Hello ${playerName}! Welcome! How are you today?`
      : `Interesting! Can you tell me more?`;
    res.json({ reply: fallback, fallback: true });
  }
};
