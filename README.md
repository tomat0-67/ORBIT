# ORBIT

ORBIT réunit un environnement de développement (DEV), une organisation scolaire (STUDY), un tableau de bord, un compte, la synchronisation, le stockage et la collaboration.

**État actuel :** première application web et coquille desktop Tauri 2. Les parcours locaux DEV et STUDY sont disponibles. Les comptes, workspaces distants, Git, l’éditeur, la synchronisation et le stockage cloud ne sont pas encore implémentés.

## Fonctions du premier lot

- Navigation entre Accueil, DEV, STUDY et Compte, avec thème sombre/clair et barre latérale rétractable.
- **DEV desktop :** choisir un dossier avec le sélecteur système et consulter les éléments à sa racine. Lecture des noms seulement; aucun fichier n’est modifié ou envoyé.
- **STUDY :** créer, terminer, rouvrir et supprimer des devoirs. Les devoirs sont enregistrés dans IndexedDB sur l’appareil.
- Les préférences de thème restent dans le stockage local du navigateur ou de la WebView.

Les données STUDY de ce prototype sont locales et ne sont ni synchronisées ni chiffrées par ORBIT. L’authentification n’est pas configurée.

## Documentation

- [Spécifications officielles](specs.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Feuille de route](docs/ROADMAP.md)
- [Décisions](docs/DECISIONS.md)
- [Progression réelle](docs/PROGRESS.md)
- [Politique de stockage](docs/STORAGE.md)
- [Sécurité](docs/SECURITY.md)
- [Linux — Arch](docs/PLATFORM-LINUX-ARCH.md)

## Installer ORBIT sur Arch Linux

Depuis le dépôt cloné, construis et installe le paquet Arch :

```sh
cd packaging/arch
makepkg -si
```

Après l’installation, ORBIT apparaît dans le menu des applications avec son icône. Tu peux le lancer depuis le menu comme les autres applications, sans taper de commande de lancement.

Le paquet est construit depuis les sources sur l’ordinateur. Aucun paquet binaire préconstruit ni publication AUR n’est fourni pour le moment. Les détails sont dans le [guide Arch](docs/PLATFORM-LINUX-ARCH.md).

## Développement

Prérequis : paquets système Tauri/WebKitGTK 4.1 indiqués dans le [guide Arch](docs/PLATFORM-LINUX-ARCH.md), Rust 1.90 ou plus récent, Node.js 22.12 ou plus récent et pnpm 11.25.

Si `pnpm` est introuvable, installe-le avec `curl -fsSL https://get.pnpm.io | sh -`, puis ferme et rouvre le terminal.

À la racine du dépôt, lance :

```sh
pnpm install
pnpm desktop:dev
```

Pour lancer uniquement le frontend dans le navigateur : `pnpm dev`. La sélection des dossiers locaux est réservée au desktop Tauri.

## Vérifications

```sh
pnpm typecheck
pnpm test
pnpm build
pnpm desktop:compile
```

`desktop:compile` produit un binaire Rust release sans paquet système. `desktop:build` lance le paquetage AppImage et DEB configuré par Tauri; les paquets de distribution ne sont pas encore validés pour publication.

## Principes

- Les sources DEV restent sur le disque local ; PostgreSQL ne stockera que les métadonnées autorisées.
- Les permissions sont vérifiées côté serveur et renforcées par RLS lorsqu’un backend sera ajouté.
- Les fichiers STUDY restent locaux par défaut ; le cloud est utilisé seulement si nécessaire.
- Aucun service payant obligatoire, dépense automatique ou publication GitHub sans autorisation.
- Une fonction est décrite comme réalisée uniquement après son implémentation et sa vérification.
