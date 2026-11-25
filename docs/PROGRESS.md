# Progression réelle

Mise à jour : 2026-11-25.

## Dépôt et branche

- La PR documentaire #2 et la PR Linux #3 ont été fusionnées dans main.
- La refonte de l’interface est préparée sur la branche `codex/orbit-interface-refinement`, à destination d’une PR vers main.
- Le code a été comparé aux fichiers de main avant modification.

## Refonte de l’interface

- Remplacement de l’accueil promotionnel par une vue sobre listant DEV et STUDY, avec leur disponibilité locale.
- Retrait du décor orbital, des dégradés, des slogans et des éléments de statut décoratifs.
- Palette sombre et claire plus neutre, contrastes mieux lisibles, texte et commandes agrandis.
- Vue STUDY réorganisée autour de l’ajout d’un devoir et de la liste « À faire »; création, validation, clôture, réouverture et suppression conservent leur logique locale.
- Vue DEV simplifiée, avec une explication directe de l’accès en lecture seule.
- Navigation mobile et latérale, bascule de thème et espace local conservés.
- Les libellés attendus par les tests d’interface ont été ajustés aux nouveaux intitulés. Ces tests n’ont pas été exécutés après la refonte.

## État fonctionnel déjà réalisé

- Workspace pnpm avec application web React/TypeScript/Vite et Tailwind CSS.
- Navigation interactive entre Accueil, DEV, STUDY et Compte ; sidebar desktop rétractable ; thèmes clair/sombre mémorisés localement.
- STUDY : devoirs créés, terminés, rouverts et supprimés dans IndexedDB.
- DEV desktop : choix d’un dossier via le sélecteur système Tauri et lecture des noms à sa racine. Aucun contenu source n’est lu ou envoyé.
- Tauri 2, plugins Dialog et File System, permissions limitées au dialogue et à `fs:allow-read-dir`.

## Vérifications précédentes

Avant cette refonte, `pnpm typecheck`, `pnpm test` (8 tests), `pnpm build` et la compilation desktop release avaient réussi sur Arch Linux rolling. Le paquetage AppImage/DEB avait échoué pendant l’étape de paquetage avec `Read-only file system (os error 30)`. L’ouverture graphique de la fenêtre n’avait pas été vérifiée dans cet environnement.

Après les changements visuels, `pnpm typecheck` a réussi. Les tests Vitest, le build web et le lancement graphique n’ont pas été relancés.

## Fonctionnalités non réalisées

Pas d’authentification, compte distant, workspace partagé, rôles/RLS, cours, matières, notes, documents, Git local, éditeur, GitHub, notifications, synchronisation, compression, stockage cloud ou clients mobiles. Le module STUDY reste local et n’est pas relié à PostgreSQL.

## Lanceur desktop Arch

- Ajout d’un `PKGBUILD` qui compile les sources et installe le binaire ORBIT.
- Ajout d’une entrée `.desktop` et de l’icône hicolor pour lancer ORBIT depuis le menu du bureau.
- Ajout d’instructions pour construire et installer le paquet avec `makepkg -si`.
- Le paquet Arch n’a pas été construit ni installé dans cette étape. Aucun paquet binaire n’a été publié et aucune publication AUR n’a été faite.

## Suite logique

Construire et installer le paquet sur Arch, vérifier qu’ORBIT apparaît dans le menu avec son icône et se lance correctement, puis poursuivre le module DEV sans droits d’écriture implicites.
