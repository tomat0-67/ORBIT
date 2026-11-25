# Cible Linux — Arch Linux

## Périmètre

Arch Linux est la première cible desktop de validation. Il s’agit d’un ordre de prototypage, pas d’une promesse de compatibilité avec toutes les distributions Linux. La cible envisagée est un shell desktop Tauri 2 avec le frontend TypeScript/React/Vite défini par l’architecture. Le dépôt ne contient pas encore d’application : aucune installation, compilation, interface native ou intégration de fichiers n’est actuellement vérifiée.

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

Installer également Rust via rustup et Node.js (frontend JavaScript). pnpm sera activé via Corepack si la version de Node installée le fournit. Les versions exactes seront fixées dans le dépôt au moment du prototype, plutôt que présumées ici.

Ces paquets sont des prérequis de développement Tauri, pas une liste finale de dépendances d’exécution ou de paquets ORBIT. Examiner les dépendances réellement utilisées et les paquets générés avant toute distribution.

## Premier prototype attendu

Le prototype Linux devra démontrer avant d’être déclaré compatible :

1. Installation reproductible des outils et dépendances sur une installation Arch à jour.
2. Démarrage du frontend et lancement du shell Tauri en développement.
3. Compilation release locale avec WebKitGTK 4.1.
4. Ouverture, affichage et fermeture propres de la fenêtre sous un environnement graphique Arch pris en charge.
5. Dépendances d’exécution identifiées à partir du paquet produit.
6. Vérification des chemins et permissions avant d’ajouter l’accès aux fichiers de projets DEV.

Le prototype ne doit pas demander de privilèges root à l’exécution. Aucun dossier utilisateur ni projet ne doit être parcouru ou modifié automatiquement.

## Distribution

Le format de distribution Arch reste à choisir après une compilation reproductible. Évaluer un paquet Arch maintenable et les autres formats Linux seulement selon les besoins observés. La publication sur l’AUR n’est pas incluse dans cette étape ; elle exigera un paquet vérifié, des dépendances et mises à jour maintenables, ainsi qu’une autorisation de publication distincte.

Ne pas annoncer Arch comme plateforme supportée avant d’avoir exécuté les étapes de validation et documenté la version du système, le bureau testé, les dépendances et le résultat.

## Références

- [Prérequis Tauri 2 — Arch Linux](https://v2.tauri.app/start/prerequisites/)
- [Distribution Tauri 2 — AUR](https://v2.tauri.app/distribute/aur/)
