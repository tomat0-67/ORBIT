# Progression réelle

Mise à jour : 2026-11-25.

## Audit du dépôt

- main contient README.md, specs.md et la documentation de fondation issue de la PR #1.
- Aucun code applicatif, manifeste de paquets, test, migration ou répertoire de documentation n'existait avant la PR #1 ; le dépôt ne contient toujours pas d'application.
- L'environnement local initial était un dossier de conversation sans checkout Git fonctionnel ; les fichiers qui y ont été créés ne font pas partie de ce dépôt.
- Le cahier des charges consolidé inclut les politiques de stockage, permissions, lots et comptes rendus.

## Préparé dans cette branche

- Cible desktop de prototypage prioritaire : Arch Linux avec Tauri 2, alignée sur la plateforme demandée.
- Guide des prérequis Arch et critères attendus pour un prototype et un futur paquet.
- Architecture, roadmap, journal de décisions et README précisent l'ordre Arch-first et les limites de compatibilité.
- Branche de travail : codex/orbit-linux-arch (créée depuis main).

## Pas encore réalisé

Aucune application, authentification, workspace, fonction DEV/STUDY, migration SQL, RLS, synchronisation, compression, stockage cloud ou cible native n'est implémentée. Le build Tauri, le démarrage sur Arch, les tests et la distribution n'ont pas été exécutés. Cette branche prépare la validation ; elle ne constitue pas une preuve de compatibilité.

## Suite proposée

Après revue, créer le shell web et le prototype Tauri minimal, puis obtenir un build et un test de lancement sur Arch avant de documenter Linux comme cible compatible. Les accès aux fichiers utilisateur viennent après validation de chemins, symlinks et permissions.
