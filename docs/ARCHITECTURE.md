# Architecture technique

## État de départ

L'audit de main (25 novembre 2026) trouve une documentation de projet uniquement. Aucun code, manifeste, test, migration ou configuration n'est présent. Cette architecture décrit une cible proposée, pas un système déjà implémenté.

## Organisation recommandée

Un monorepo pnpm est adapté à terme aux clients web, desktop et mobile qui partageront contrats, composants et logique métier. Démarrer par un seul client web et extraire des packages lorsqu'ils ont des consommateurs concrets. Ajouter Turborepo lorsque plusieurs packages ont des tâches répétées à orchestrer ou mettre en cache. Ne pas précréer de packages vides.

Applications prévues :
- apps/web : composition de l'application React/Vite.
- apps/desktop : à créer après prototype Tauri validé.
- apps/mobile : à créer après prototype Capacitor validé.
- packages/contracts et packages/ui : à extraire lorsqu'ils sont réellement partagés.
- supabase/migrations : schéma versionné, après définition du modèle.

## Couches

Les modules Dashboard, Account, DEV, STUDY, Sync, Storage, Collaboration, Search et Notifications expriment les règles métier. Ils dépendent d'interfaces définies par le produit. Des adaptateurs relient ces interfaces à Supabase/PostgreSQL, IndexedDB, SQLite éventuel, système de fichiers, GitHub et notifications natives.

Les frontières communes à définir quand elles sont utilisées : identité/session, base de données, stockage de fichiers, synchronisation, permissions, notifications, recherche, capacités natives et fournisseur Git. Le client n'est jamais une autorité de permission ; les décisions sont validées côté serveur.

## Socle cible à valider

- Web : TypeScript, React, Vite, Tailwind CSS ; shadcn/ui si ses composants répondent à un besoin concret.
- Données distantes : PostgreSQL via Supabase, derrière les interfaces d'accès ; RLS et migrations versionnées.
- Cache web : IndexedDB. SQLite seulement pour un cas natif établi.
- Qualité : Vitest pour logique et modules ; Playwright pour les parcours web.
- Desktop : prototype Tauri 2, en commençant par Arch Linux ; valider accès fichiers, Git, permissions et distribution avant d'étendre la cible.
- Mobile : prototype Capacitor distinct, avec validation des fichiers, tâches de fond, notifications et builds Android/iOS.

Aucune compatibilité multiplateforme n'est présumée. Vérifier APIs, plugins, chaîne de compilation, signature et exigences Apple avant engagement. Voir [Linux — Arch](PLATFORM-LINUX-ARCH.md) pour les prérequis et critères de validation.

## Séquence de données

UI → service métier (validation et règles) → interface du module → adaptateur local ou distant. Chaque écriture distante revalide identité, appartenance et permission. Sync transmet des changements incrémentaux versionnés ; un conflit reste visible et n'écrase pas une version silencieusement.

## Validations techniques ouvertes

Prototype Arch avec projets volumineux, chemins, liens symboliques, environnements Wayland/X11 et dépendances d'exécution ; fonctionnement mobile hors ligne ; auth et révocation ; modèle d'invitations et de rôles ; reprise et conflits ; export/restauration ; coûts et limites des fournisseurs avant activation.
