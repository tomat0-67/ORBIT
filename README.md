# ORBIT

ORBIT réunit un environnement de développement (DEV), une organisation scolaire (STUDY), un tableau de bord, un compte, la synchronisation, le stockage et la collaboration.

**État du dépôt :** cahier des charges et documentation de fondation uniquement. Aucune application fonctionnelle n'est encore présente.

## Documentation

- [Spécifications officielles](specs.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Feuille de route](docs/ROADMAP.md)
- [Décisions](docs/DECISIONS.md)
- [Progression réelle](docs/PROGRESS.md)
- [Politique de stockage](docs/STORAGE.md)
- [Sécurité](docs/SECURITY.md)
- [Préparation Linux — Arch](docs/PLATFORM-LINUX-ARCH.md)

## Développement

Le dépôt ne contient pas encore de code ni de configuration de build. Le lot 1 commencera par un shell desktop Tauri 2 validé en premier sur Arch Linux. Les prérequis et critères sont dans le [guide Arch](docs/PLATFORM-LINUX-ARCH.md). Aucune commande de lancement d'ORBIT n'est disponible avant l'ajout du prototype.

## Principes

- Les sources DEV restent locales ; PostgreSQL conserve les métadonnées nécessaires, jamais les dépôts ou fichiers sources.
- Les permissions sont vérifiées côté serveur et renforcées par RLS.
- Les fichiers STUDY restent locaux par défaut ; le cloud est utilisé seulement si nécessaire.
- Aucun service payant obligatoire, dépense automatique ou publication GitHub sans autorisation.
- Une fonction est décrite comme réalisée uniquement après son implémentation et sa vérification.
