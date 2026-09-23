# LinguaVillage

Application web (PWA) d'apprentissage des langues : un village 3D où l'on parle à des habitants animés par IA,
avec vocabulaire, phrases, grammaire, dictionnaire, alphabet, cinéma et mini-jeux. 8 langues.

## Architecture

```
index.html            écrans + ordre de chargement des scripts (l'ordre compte !)
css/                  styles_v2 (base) → learning/world/program → theme_v3 (thème « Lagon », chargé en dernier)
js/core.js            socle : base d'API, navigation + bouton retour, erreurs, utilitaires (charger EN PREMIER)
js/save.js, state.js  état du joueur, sauvegarde locale (versionnée, groupée)
js/dialogue.js        conversation PNJ : guidé (débutants) puis libre (IA), voix, traduction au toucher
js/village_3d.js      village Three.js : joueur, caméra, collisions, habitants, jour/nuit sur l'heure réelle
js/engage.js          objectif du jour, série, coffres, boutique
js/pwa.js + sw.js     installation et mode hors-ligne
api/*.js, lib/*.js    fonctions serverless Vercel (dialogue, correct, translate, ping) + garde-fous
vendor/three/         Three.js r128 (copie locale)
tools/                make_sw.py (régénère sw.js), rebrand.py (migration de couleurs)
tests/api.test.js     tests des routes /api (node tests/api.test.js)
```

## Déploiement (Vercel)
1. Variables d'environnement : voir `.env.example` (au minimum `GEMINI_API_KEY`).
2. **Après chaque modification des fichiers du site : `python3 tools/make_sw.py`** puis commit
   (met à jour la liste du service worker ; sinon les appareils qui ont installé l'appli gardent d'anciens fichiers hors-ligne).
3. Diagnostic : ouvrir le site avec `?debug` à la fin de l'URL affiche la barre de diagnostic et les erreurs JS.

## Tests
- `node tests/api.test.js` — routes /api avec Gemini simulé.
