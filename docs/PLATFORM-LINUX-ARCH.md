# Cible Linux — Arch Linux

## Périmètre

Arch Linux est la première cible desktop de validation. Le dépôt comprend une application React/Vite et un shell Tauri 2. Un paquet natif Arch est préparé pour installer l’application, son icône et son entrée dans le menu. Sa construction et son lancement depuis le menu restent à valider sur Arch.

## Prérequis

Les paquets système Tauri 2 pour Arch sont :

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
  xdotool \
  git \
  nodejs \
  pnpm \
  rust
```

Le dépôt requiert Node.js 22.12 ou plus récent, pnpm 11.25.0 et Rust stable 1.90 ou plus récent. Si `pnpm` est introuvable, installe-le avec le script officiel :

```sh
curl -fsSL https://get.pnpm.io | sh -
```

Ferme puis rouvre le terminal après l’installation. Dans le dépôt, `pnpm --version` doit utiliser la version 11.25.0 épinglée dans `package.json`.

## Installer l’application et son icône

Depuis la racine du dépôt cloné :

```sh
cd packaging/arch
makepkg -si
```

`makepkg` construit puis installe le paquet Arch. Il installe le binaire, une entrée `.desktop` et l’icône ORBIT dans le thème hicolor. Une fois l’installation terminée, recherche **ORBIT** dans le menu des applications et lance-le depuis son icône.

Cette procédure compile les sources sur l’ordinateur. Aucun paquet préconstruit téléchargeable ni publication AUR n’est fourni pour le moment. Le paquet et l’entrée du menu n’ont pas encore été construits et vérifiés sur une installation Arch propre.

## Lancer en mode développement

À la racine du dépôt, et non dans `/home/` ou un autre dossier personnel :

```sh
pnpm install
pnpm desktop:dev
```

Le frontend navigateur seul se lance avec `pnpm dev`. Le sélecteur de dossier DEV est disponible uniquement dans l’application Tauri.

## Vérifications

```sh
pnpm typecheck
pnpm test
pnpm build
pnpm desktop:compile
```

`desktop:compile` produit le binaire Rust release sans paquet système. `pnpm desktop:build` génère les formats AppImage et DEB configurés par Tauri; aucun format Arch n’est produit par cette commande.

## État des vérifications

- Compilation web et native release auparavant réussie sur Arch Linux rolling avec WebKitGTK 4.1.
- Les tests Vitest précédents comptaient 8 tests réussis.
- Le paquetage AppImage/DEB avait échoué dans l’environnement de travail avec `Read-only file system (os error 30)`.
- Le nouveau `PKGBUILD`, l’installation système et l’apparition d’ORBIT dans le menu n’ont pas encore été exécutés ni vérifiés.

## Sécurité et distribution

Le paquet lance l’application Tauri avec les permissions existantes : dialogue système et lecture des noms dans le dossier choisi. Il ne donne pas de permission d’écriture aux fichiers DEV. Le paquet Arch ne publie rien sur l’AUR et ne crée pas de release GitHub.

## Références

- [Prérequis Tauri 2 — Arch Linux](https://v2.tauri.app/start/prerequisites/)
- [Distribution Tauri 2 — AUR](https://v2.tauri.app/distribute/aur/)
- [Icônes d’application Tauri](https://v2.tauri.app/develop/icons/)
