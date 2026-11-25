# Cible Linux — Arch Linux

## Périmètre

Arch Linux est la première cible desktop de validation. Le dépôt comprend maintenant une application React/Vite et un shell Tauri 2. La compilation release native réussit sur l’hôte Arch utilisé ici; l’ouverture graphique de l’application et la génération de paquets restent à vérifier. Cela ne vaut pas promesse de compatibilité pour toutes les installations Arch ou distributions Linux.

## Prérequis de développement

La documentation officielle de Tauri 2 indique les paquets suivants pour Arch :

```sh
sudo pacman -Syu
sudo pacman -S --needed \
  webkit2gtk-4.1 \
  base-devel \
  curl \
  wget \
  file \
  openssl \
  appmenu-gtk-module \
  libappindicator-gtk3 \
  librsvg \
  xdotool
```

Installer également Rust stable (le plugin File System actuel requiert Rust 1.90 ou plus récent), Node.js 22.12 ou plus récent et pnpm 11.25. Le workspace utilise un lockfile pnpm et un Cargo.lock.

## Démarrer

```sh
pnpm install
pnpm desktop:dev
```

Le frontend navigateur seul se lance avec `pnpm dev`. Le sélecteur de dossier DEV et sa liste locale ne sont disponibles que dans la fenêtre desktop.

## Compiler

```sh
pnpm typecheck
pnpm test
pnpm build
pnpm desktop:compile
```

`desktop:compile` produit un binaire Rust release sans créer de paquet. `pnpm desktop:build` demande à Tauri les bundles AppImage et DEB configurés; cela n’implique pas une publication AUR.

## Résultats vérifiés

- Hôte : Arch Linux rolling; WebKitGTK 4.1 détecté en version 2.54.3.
- Typecheck web : réussi.
- Tests Vitest : 8 réussis.
- Build web : réussi.
- Compilation native release : réussie, binaire `apps/desktop/src-tauri/target/release/orbit` produit.
- Paquetage AppImage/DEB : compilation native terminée, puis échec avec `Read-only file system (os error 30)` dans l’environnement de travail.
- Démarrage de la fenêtre et validation du dialogue graphique : non exécutés.

## Sécurité des fichiers

Le frontend Tauri peut ouvrir le sélecteur de dossiers et lire les entrées du dossier explicitement choisi. Il n’a pas de permission d’écriture, ne lit pas les contenus des fichiers et ne transmet pas ces noms. Le choix est temporaire et doit être refait après redémarrage.

## Distribution

Le format Arch reste à décider après le test de lancement et la génération reproductible d’un paquet. La publication sur l’AUR n’est pas incluse; elle demandera un paquet maintenable et une autorisation de publication distincte.

## Références

- [Prérequis Tauri 2 — Arch Linux](https://v2.tauri.app/start/prerequisites/)
- [Plugin Tauri Dialog](https://v2.tauri.app/plugin/dialog/)
- [Plugin Tauri File System](https://v2.tauri.app/plugin/file-system/)
- [Distribution Tauri 2 — AUR](https://v2.tauri.app/distribute/aur/)
