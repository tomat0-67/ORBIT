# Architecture technique

## État actuel

Le dépôt a commencé comme documentation seule. Le premier lot ajoute un client React/TypeScript/Vite dans `apps/web` et un shell Tauri 2 dans `apps/desktop`. Ce code n’implémente pas encore les comptes, workspaces ou services distants.

## Organisation

- `apps/web` : application React/Vite partagée par le navigateur et le shell desktop.
- `apps/desktop` : binaire Rust/Tauri, fenêtre principale et plugins natifs limités au dialogue de sélection et à la lecture des entrées d’un dossier choisi.
- `apps/mobile` : à créer après prototype Capacitor validé.
- `packages/contracts` et `packages/ui` : à extraire lorsqu’ils auront réellement plusieurs consommateurs.
- `supabase/migrations` : après définition du modèle de compte et des workspaces.

pnpm gère le workspace. Turborepo est différé jusqu’à un besoin mesuré d’orchestration multi-package.

## Couches

Les modules Dashboard, Account, DEV, STUDY, Sync, Storage, Collaboration, Search et Notifications doivent exprimer les règles métier. Ils dépendront d’interfaces stables; aucun adaptateur Supabase ni API distante n’est encore présent.

La première tranche STUDY conserve des devoirs dans IndexedDB, sur l’appareil courant. Cette persistance locale est un prototype hors ligne, pas le stockage central prévu pour les comptes connectés. La tranche DEV utilise Tauri pour obtenir l’autorisation du sélecteur système puis lister les noms des éléments à la racine du dossier choisi. Elle ne lit pas le contenu des fichiers et n’écrit rien.

Le client n’est jamais l’autorité de permission pour les données distantes. Chaque accès serveur devra vérifier l’identité, le workspace et le rôle.

## Socle technique présent

- Web : TypeScript, React, Vite et Tailwind CSS 4.
- Desktop : Tauri 2 et Rust; le binaire release a été compilé sur Arch Linux.
- Données locales STUDY : IndexedDB; préférences d’affichage : localStorage.
- Qualité web : Vitest, Testing Library et contrôle TypeScript.
- Dépendances de workspace : pnpm avec lockfiles pnpm et Cargo.

## Sécurité desktop

La capability Tauri de la fenêtre principale permet le dialogue d’ouverture et `fs:allow-read-dir`. Le dialogue ajoute un accès temporaire au chemin choisi; il n’est pas conservé après fermeture de l’application. Aucun droit d’écriture au système de fichiers ni accès au shell n’est activé.

## Validations encore nécessaires

Lancer l’application sur un bureau Arch réel, vérifier le sélecteur et les refus d’accès, générer les paquets Linux sans cache en lecture seule, contrôler leurs dépendances d’exécution et documenter le résultat. Les comportements Wayland/X11, liens symboliques, grands projets et environnements non Arch restent à évaluer.
