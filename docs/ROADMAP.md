# Feuille de route

État au 25 novembre 2026 : main contient la documentation de fondation et aucun code produit. Les lots ci-dessous sont des étapes futures et ne décrivent pas des fonctions livrées.

## Lot 0 — Audit et fondations documentaires (fait)

- Lire le dépôt et son cahier des charges.
- Comparer la mission ORBIT au document existant.
- Consolider le cahier des charges en specs.md.
- Définir architecture proposée, stockage, sécurité, décisions et progression initiale.

## Lot 1 — Fondations produit, Linux en premier

- Initialiser la structure et l’outillage TypeScript/React/Vite/Tailwind/pnpm.
- Choisir un monorepo minimal si les frontières de partage sont justifiées ; différer Turborepo jusqu’au besoin.
- Mettre en place design system, navigation desktop/mobile et thèmes.
- Définir les interfaces communes progressivement, sans packages vides.
- Ajouter des tests ciblés, scripts de vérification, documentation et CI utile.
- Prototyper le shell desktop Tauri 2 sur Arch Linux en premier ; écrire les commandes reproductibles, identifier les dépendances d’exécution et effectuer un build local avant d’annoncer la compatibilité Linux.

**Sortie attendue :** installation reproductible, shell de navigation et build desktop local vérifiés sur Arch, contrôles web disponibles, documentation des versions et limites. Pas de données ou comptes fictifs présentés comme réels.

## Lot 2 — Compte, workspaces et sécurité

Auth/session, profils, workspaces, membres, invitations, rôles et migrations PostgreSQL. RLS testée pour accès permis et refusé. L’isolation et l’autorisation serveur sont des critères de passage.

## Lot 3 — STUDY

Matières, cours, notes, devoirs et documents structurés. Stockage local des fichiers par défaut. Ajouter ensuite l’import Notion avec prévisualisation, limites, rapport et confirmation avant tout remplacement.

## Lot 4 — DEV

D’abord prototype desktop et capacités de fichiers, puis projets locaux, explorateur, éditeur et Git local. Ajouter GitHub via permissions minimales et opérations explicites, sans push automatique.

## Lot 5 — Sync et stockage optimisé

Hors ligne, file incrémentale, reprise, idempotence, conflits visibles, limites de ressources, compression après mesure et déduplication strictement cloisonnée.

## Lot 6 — Multiplateforme

Étendre web, desktop, Android et iOS selon les prototypes, les APIs natives disponibles, la compilation et les règles de distribution validées. Arch est le premier environnement desktop ; les autres distributions Linux restent à valider séparément.

## Passage entre lots

Ne pas partager ou synchroniser avant modèle de compte, permissions et migrations testées. Ne pas activer le stockage cloud avant règles d’accès, quotas, export et suppression documentés. Vérifier les offres et coûts à la date de mise en service.
