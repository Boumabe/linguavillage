// lib/gemini.js — logique Gemini partagée par toutes les routes /api

async function callGemini(systemInstruction, userMessage, history = [], maxTokens = 200, noThinking = false) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Clé GEMINI_API_KEY manquante.');

  const modeles = ['gemini-2.5-flash'];

  for (const modele of modeles) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modele}:generateContent?key=${apiKey}`;

    const contents = [];

    for (const h of history) {
      contents.push({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
      });
    }

    const lastItem = contents[contents.length - 1];
    const alreadyAdded = lastItem && lastItem.role === 'user' && lastItem.parts[0].text === userMessage;
    if (!alreadyAdded) {
      contents.push({ role: 'user', parts: [{ text: userMessage }] });
    }

    const body = {
      contents,
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: 0.9,
        ...(noThinking && { thinkingConfig: { thinkingBudget: 0 } })
      }
    };

    if (systemInstruction) {
      body.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`Modèle ${modele} erreur HTTP:`, data);
        continue;
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim()) {
        return text.trim();
      }

      console.error(`Modèle ${modele} réponse vide:`, JSON.stringify(data).slice(0, 300));

    } catch (e) {
      console.error(`Modèle ${modele} exception:`, e.message);
    }
  }

  throw new Error('Tous les modèles ont échoué.');
}

// Applique les headers CORS — appelé au début de chaque route /api
function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = { callGemini, setCors };
