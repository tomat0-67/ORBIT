# Progression réelle

Mise à jour : 2026-11-25.

## Dépôt et branche

- La PR documentaire #2 a été fusionnée dans main.
- Branche de cette étape : `codex/orbit-linux-app`, créée depuis le main actuel.
- Le code local a été vérifié avant son transfert dans le dépôt GitHub; ce dossier de travail n’est pas un checkout Git.

## Réalisé dans cette branche

- Workspace pnpm avec application web React/TypeScript/Vite et Tailwind CSS.
- Dashboard de navigation, vues DEV/STUDY/Compte, mode sombre/clair, navigation mobile et sidebar desktop rétractable.
- STUDY : création, état terminé/à faire, réouverture et suppression de devoirs enregistrés dans IndexedDB. Entrées limitées et validées côté client.
- DEV desktop : sélecteur système de dossiers Tauri et affichage en lecture seule des noms à la racine du dossier. Aucun contenu source n’est lu ou envoyé.
- Tauri 2, plugins Dialog et File System, capability restreinte au dialogue et à `fs:allow-read-dir`.
- Lockfiles pnpm et Cargo, icônes Linux, scripts web/desktop et documentation mise à jour.

## Vérifications exécutées

- `pnpm typecheck` : réussi.
- `pnpm test` : réussi, 2 fichiers et 8 tests.
- `pnpm build` : réussi.
- `CARGO_HOME=/tmp/orbit-cargo-home pnpm desktop:compile` : réussi sur Arch Linux rolling avec WebKitGTK 4.1; binaire release créé.
- `pnpm desktop:build` : compilation Rust réussie, étape de paquetage AppImage/DEB échouée avec `Read-only file system (os error 30)` dans l’environnement de travail.
- Le lancement de la fenêtre et le sélecteur de fichiers n’ont pas été vérifiés graphiquement.

## Fonctionnalités non réalisées

Pas d’authentification, compte distant, workspace partagé, rôles/RLS, cours, matières, notes, documents, Git local, éditeur, GitHub, notifications, sync, compression, cloud ni mobile. Le prototype local STUDY n’est pas encore relié à PostgreSQL.

## Suite logique

Corriger le paquetage dans un environnement Arch inscriptible, lancer l’application et vérifier le dialogue d’accès au dossier. Ensuite, étendre DEV sans droits d’écriture implicites, puis définir comptes et workspaces avant d’ajouter sync ou stockage distant.
