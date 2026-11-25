# Feuille de route

État au 25 novembre 2026 : les fondations documentaires et un premier shell web/desktop existent. Les fonctions distantes, les comptes et la plupart des modules métier restent à construire.

## Lot 0 — Audit et fondations documentaires (fait)

- Lire le dépôt et son cahier des charges.
- Comparer la mission ORBIT au document existant.
- Consolider le cahier des charges en specs.md.
- Définir architecture proposée, stockage, sécurité, décisions et progression initiale.

## Lot 1 — Fondations produit, Linux en premier (en cours)

- Workspace pnpm, client React/TypeScript/Vite/Tailwind et navigation responsive.
- Design sombre/clair, barre latérale rétractable et parcours de navigation.
- Wrapper Tauri 2 pour desktop; Arch Linux est la première cible de validation.
- Premier parcours métier local STUDY : création, complétion, réouverture et suppression des devoirs avec stockage IndexedDB.
- Premier parcours DEV desktop : sélection explicite d’un dossier et liste en lecture seule de ses entrées de premier niveau.
- Scripts de tests, contrôle TypeScript, build web et compilation release desktop.
- À terminer : lancer le binaire sur une session graphique Arch, empaqueter sans erreur, confirmer les dépendances d’exécution et consigner les environnements testés.

**État des contrôles :** 8 tests Vitest passent; typecheck et build web passent; le binaire release a été compilé sur Arch. Le paquetage AppImage/DEB n’a pas abouti dans l’environnement actuel à cause d’une erreur de système de fichiers en lecture seule. Le lancement graphique n’a pas été vérifié.

## Lot 2 — Compte, workspaces et sécurité

Auth/session, profils, workspaces, membres, invitations, rôles et migrations PostgreSQL. RLS testée pour accès permis et refusé. L’isolation et l’autorisation serveur sont des critères de passage.

## Lot 3 — STUDY

Matières, cours, notes, documents et import Notion avec prévisualisation. Migrer les données structurées vers PostgreSQL lorsque les comptes et permissions sont en place; conserver les fichiers locaux par défaut.

## Lot 4 — DEV

Explorateur approfondi et lecture/édition explicite de fichiers, projets locaux, Git local, puis intégration GitHub avec permissions minimales. Aucun push automatique.

## Lot 5 — Sync et stockage optimisé

Hors ligne, file incrémentale, reprise, idempotence, conflits visibles, limites de ressources, compression après mesure et déduplication strictement cloisonnée.

## Lot 6 — Multiplateforme

Étendre web, desktop, Android et iOS selon les prototypes, les APIs natives disponibles, les compilations et les règles de distribution validées. Les autres distributions Linux restent à valider séparément.

## Passage entre lots

Ne pas partager ou synchroniser avant modèle de compte, permissions et migrations testées. Ne pas activer le stockage cloud avant règles d’accès, quotas, export et suppression documentés. Vérifier les offres et coûts à la date de mise en service.
