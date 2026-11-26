# Progression réelle

Mise à jour : 2026-11-25.

## Dépôt et branche

- La PR documentaire #2 et la PR Linux #3 ont été fusionnées dans main.
- La refonte de l’interface a été fusionnée dans main via la PR #6.
- Le lanceur desktop Arch a été ajouté via la PR #7. Le `PKGBUILD` n’a pas encore été construit ni installé.
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

## Priorité Linux desktop

- Nouvelle priorité confirmée : Linux desktop (Arch référence), Web, Windows/macOS, Android/iOS.
- L’utilisateur confirme que l’application se lance sur son Arch et que le parcours des devoirs fonctionne. Ce retour ne valide pas encore l’installation du paquet Arch.
- Le code DEV actuel ne navigue pas dans l’arborescence et ne lit que les noms à la racine d’un dossier choisi. Git local et GitHub restent absents.
- La PR #7 ajoute un `PKGBUILD`, une entrée `.desktop` et une icône hicolor. Le paquet n’a pas été construit ni installé; il n’existe pas de paquet binaire publié ni de publication AUR.
- La compilation reproductible reste à réaliser : la source PKGBUILD pointe vers `main` et somme les sources Git avec `SKIP`.

## Suite logique

Terminer les capacités natives Linux : accès fichiers derrière une interface, Git local, GitHub, puis construire et valider le paquet dans un environnement Arch propre. Web vient ensuite.
