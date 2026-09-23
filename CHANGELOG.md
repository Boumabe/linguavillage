# LinguaVillage v3 — journal des changements

Branche : `optimisation-v3` · 64 fichiers · +8 041 / −2 998 lignes.
Tout ce qui est marqué ✅ a été vérifié par un test automatique (navigateur Chrome sans tête, réseau et IA simulés).
Ce qui n'a PAS pu être vérifié est listé en fin de document.

## 1. Bugs corrigés (constatés dans le code d'origine)

| # | Bug | Effet pour le joueur | Correction |
|---|-----|----------------------|-----------|
| 1 | `app_v2.js` définissait `API = …replit.app` et s'exécutait en dernier : il écrasait l'URL Vercel de `data.js` | Toute l'IA (dialogue, dictionnaire) appelait l'ancien serveur Replit | Une seule base d'API dans `core.js` (même origine sur Vercel, URL Vercel depuis GitHub Pages) ✅ |
| 2 | Le front envoyait `userMessage/targetLang…`, le serveur lisait `playerMessage/language…` | Message vide → erreur Gemini → toujours « Interesting! Can you tell me more? » en anglais | Le serveur accepte les deux formats ; message vide refusé (400) ; panne → erreur claire côté joueur, jamais une fausse réponse ✅ |
| 3 | `systemContext` (contexte du jeu) REMPLAÇAIT tout le prompt | Le PNJ perdait son rôle et la langue cible ; n'importe qui pouvait imposer son propre prompt (proxy IA gratuit) | Prompt construit côté serveur (rôle, langue, niveau, règles) ; `systemContext` = contexte additionnel, tronqué à 3 000 caractères, ne peut pas modifier les règles ✅ |
| 4 | Gemini 2.5 « réfléchit » en consommant `maxOutputTokens` | Réponses tronquées ou vides | `thinkingBudget: 0`, texte reconstitué depuis toutes les parties, JSON strict ✅ |
| 5 | `openDict()` : `popupWord`, `dictHistory` jamais déclarés ; `/api/translate` attendait `{text}`, le front envoyait `{word}` et lisait `reply` | Dictionnaire inutilisable (planté à l'ouverture) | Dictionnaire réécrit + route compatible ; résultats affichés sans injecter de texte de l'IA dans un `onclick` ✅ |
| 6 | `useStreakFreeze`, `reqHint`, `reqTranslate`, `toggleVoice` non définis | Bouton « Protéger » : erreur ; écran de dialogue hérité inaccessible | Bouclier fonctionnel (boutique) ; ancien écran de dialogue supprimé ✅ |
| 7 | Cycle jour/nuit démarrant à minuit à chaque ouverture | Le village s'ouvrait toujours de nuit | Le village suit l'heure réelle ; nuit réellement sombre (lumière + exposition) ✅ |
| 8 | Série de jours calculée en UTC | En Haïti (UTC-5), le « jour » changeait à 19 h : séries faussées | Dates locales (`LV.dateKey`) partout ✅ |
| 9 | Un bouclier couvrait n'importe quelle absence ; coffres sans récompense ; `xpBoostEnd` jamais appliqué ; boutique = notification vide | Gamification à moitié vide | Un bouclier = un jour manqué ; coffres avec vraies récompenses ; boost ×2 appliqué ; boutique fonctionnelle ✅ |
| 10 | « Bonsoir » à 14 h, « Bonne nuit » dès 18 h | Salutation fausse | Matin / après-midi / soir, 8 langues ✅ |
| 11 | Barre `#debug` (« ✅ Chargement… », « MODELE OK… ») visible en production | Cachait le HUD du village | Masquée ; visible seulement avec `?debug` ✅ |
| 12 | Boucle de rendu 3D : démarrée en double (onglet « Village »), figée après un dialogue, jamais arrêtée hors du village | Batterie, chauffe, village gelé | Une seule boucle, active uniquement si village visible + onglet actif + aucun dialogue ✅ |
| 13 | Joystick relatif au monde (pas à la caméra) | « Haut » n'allait plus vers l'avant après un virage | Joystick relatif à la caméra ; glisser = tourner la vue ✅ |
| 14 | Aucune collision, aucune limite | Traverser les bâtiments, se perdre hors carte | Collisions bâtiments + fontaine, limite du village ✅ (poussé à exactement 27,0 du centre du bâtiment) |
| 15 | Habitants : emoji marchant de centre de bâtiment à centre de bâtiment | Traversaient les murs | Itinéraires porte → allée circulaire → porte ; ils s'arrêtent à ton approche ✅ |
| 16 | `initGame()` avant le chargement de `showNotif` | Badge gagné au démarrage = erreur JS | Lancé après chargement ✅ |
| 17 | `pnj.js` + `guided_v2.js` + `dialogue.js` se patchaient entre eux ; `newSession` compté en double | Comportements imprévisibles | Un seul module `dialogue.js` ✅ |
| 18 | Un même modèle 3D téléchargé/décodé plusieurs fois en parallèle (arbres) | Chargement inutilement long | File d'attente par fichier ✅ |
| 19 | 6 objets `THREE.Color` créés à chaque image | Saccades (ramasse-miettes) | Objets réutilisés ✅ |
| 20 | `viewport … user-scalable=no` | Zoom impossible (accessibilité) | Retiré ✅ |
| 21 | `inset:0` (Chrome ≥ 87) ; `100dvh` avant `100vh` | Écrans cassés sur vieux Android | `top/right/bottom/left:0`, ordre corrigé ✅ (à confirmer sur un vieux téléphone) |
| 22 | Grain plein écran (`mix-blend-mode`) au-dessus du canvas 3D | Coût GPU permanent | Supprimé |
| 23 | Splash de ~5 s à chaque lancement | Frein à la rétention | 1,8 s pour les joueurs qui reviennent, toucher = passer ✅ (un double appel d'initialisation que j'avais introduit a été détecté par les tests et corrigé) |
| 24 | Vibration avant le premier toucher | Avertissements console | Attendre le premier toucher ✅ |

## 2. Sécurité (backend)
- `api/test.js` supprimé (endpoint public qui consommait le quota) → `api/ping.js` (aucun appel IA).
- CORS restreint (site officiel, prévisualisations Vercel, GitHub Pages, localhost) ✅
- Limitation de débit par IP : dialogue 25/min, correct 25/min, translate 40/min ✅ (en mémoire par instance : freine les abus simples, pas un pare-feu — voir « Limites »).
- Entrées bornées (message 500 car., historique 8 × 400, contexte 3 000) ; texte utilisateur passé en `JSON.stringify` dans les prompts (injection neutralisée) ✅
- Clé Gemini en en-tête `x-goog-api-key` (plus dans l'URL) ; modèle de secours automatique ; budget de temps 8,5 s (limite Vercel 10 s) ✅
- `.env.example`, `.gitignore`, en-têtes de sécurité dans `vercel.json`.
- Iframes vidéo (cinéma, mode surprise) : `sandbox` + `referrerpolicy="no-referrer"`.

## 3. Architecture
- **`js/core.js`** (nouveau, chargé en premier) : base d'API, `LV.api.post` (timeout + 1 nouvel essai), `callAPIWithFallback` (cache borné), navigation avec historique (bouton retour Android), couches (dialogue), capture d'erreurs, dates locales, vibration, auto-diagnostic des boutons sans fonction.
- **`js/dialogue.js`** (réécrit, remplace 3 fichiers) : guidé → libre, traduction au toucher (masquée pour les avancés), micro, suggestions, avatar à humeurs, XP via `gainXP`, mission en cours affichée, bouton retour géré, village en pause.
- **`js/engage.js`** (nouveau) : objectif du jour (30/50/100 XP), carte « Aujourd'hui », coffres, boutique, boucliers, boost.
- `js/save.js` : lecture unique, sauvegarde groupée (400 ms) + vidage à la fermeture, copie de secours `linguavillage_save_corrupt`, numéro de version.
- `js/state.js` allégé (doublons `showScreen`, `gainXP`, `saveGame`… supprimés).
- Supprimés : `pnj.js`, `guided_v2.js`, `player.js` (jamais utilisé), `api/test.js`, `assets/models/a` (fichier de 1 octet).

## 4. Design « Lagon »
- Palette : encre de lagon (fonds), papaye (action), menthe (succès), sable (texte) ; script `tools/rebrand.py` appliqué à 28 fichiers (CSS, JS, HTML).
- Typographie : Fraunces (titres) + Sora (interface) ; 2 familles au lieu de 3.
- Menu : en-tête compact, carte « Aujourd'hui » (anneau d'objectif + série + « Reprendre »), tuiles avec icônes SVG, boutons accessibles.
- Dialogue, village (HUD, barre de navigation SVG, joystick, bouton « Parler »), coffres, boutique : nouveaux composants dans `css/theme_v3.css`.
- Accessibilité : tuiles de langue au clavier, `aria-live` sur les notifications, focus visible, respect de « réduire les animations ».

## 5. Jeu : communication et mouvement des personnages
- Bouton « 💬 Parler à … » qui apparaît près d'un bâtiment ou d'un habitant (1 toucher au lieu de 3) ✅
- Les habitants s'arrêtent quand tu approches ✅
- Déplacement lissé (accélération / freinage), rebond de marche proportionnel à la vitesse.

## 6. PWA / performance
- Vrais icônes 192/512/maskable, manifest corrigé (`start_url` relatif, `id`, raccourcis `?go=village|vocab` réellement gérés).
- `sw.js` (généré) : pages/scripts en « réseau d'abord », modèles/icônes/polices en « cache d'abord + mise à jour ». Rechargement hors-ligne testé : 47 fichiers en cache, menu complet + Three.js ✅
- Three.js r128 en copie locale (`vendor/three`) : plus de dépendance au CDN.
- Polices : `@import` en double supprimé.

## 7. Limites — à savoir avant de déployer
- **Jamais testé avec ta vraie clé Gemini** : les 12 tests du backend utilisent un Gemini simulé. Vérifie que `GEMINI_API_KEY` existe dans l'environnement Vercel utilisé (Production ET Preview).
- Tests visuels faits en rendu logiciel (lent, ~2 images/s) : la fluidité réelle sur téléphone n'est pas mesurée. La police Fraunces n'a pas pu se charger dans mon environnement (elle s'affichera normalement chez toi).
- Non testé : iOS/Safari, vieux Android, reconnaissance vocale réelle (dépend de l'appareil ; bouton masqué si non supportée).
- Pas relus en détail (seulement migration de couleurs + corrections ciblées) : `curriculum*.js`, `exam.js`, `program.js`, `onboarding.js`, `world.js`, `cinema.js`, `wordgame.js`, `advanced.js`, `alphabet.js`.
- Limitation de débit en mémoire : chaque instance serverless a son compteur. Pour une protection stricte, brancher Upstash/Vercel KV dans `lib/guard.js` (même signature).
- Les montants de l'économie (objectif 50 XP, bouclier 3 💎, boost 2 💎, coffres) sont des valeurs de départ à ajuster selon tes joueurs.
- Les JS ne sont pas minifiés (~1,1 Mo) ; les modèles 3D (14 Mo) ne sont pas compressés — pas de problème bloquant mesuré, mais pistes d'amélioration.
- **Après chaque modification du site : `python3 tools/make_sw.py`.**
