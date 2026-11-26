# Architecture technique

Mise à jour : 2026-11-26.

## Priorité des plateformes

La cible première est ORBIT Desktop Linux, avec Arch Linux comme environnement de référence. L’ordre de livraison est : Linux desktop, Web, Windows/macOS, Android/iOS. Chaque cible possède ses propres adaptateurs natifs; la réutilisation porte sur les composants métier et contrats réellement indépendants de l’OS.

## Audit de l’implémentation actuelle

- `apps/web` contient le shell React/TypeScript/Vite, les vues Dashboard/DEV/STUDY/Compte et les styles.
- `apps/desktop` contient la fenêtre Tauri 2/Rust et les plugins Dialog/File System.
- `DevPanel.tsx` dépend de `FileSystemPort`; l’adaptateur `tauriFileSystem.ts` encapsule le dialogue et `readDir`. Il permet de naviguer dans les sous-dossiers du répertoire choisi et ne lit que leurs noms.
- `StudyPanel.tsx` contient formulaire, états et accès à IndexedDB au travers de `taskStore`. Ce module reste local au navigateur/WebView.
- Les permissions Tauri ne donnent pas d’écriture au système de fichiers ni d’accès au shell.
- Git local et GitHub ne sont pas encore implémentés.
- Le paquet Arch `PKGBUILD`/fichier `.desktop` est présent, mais n’a pas encore été construit ni installé. Le PKGBUILD source une branche mutable et saute les sommes de source Git; cela n’est pas une compilation reproductible.
- L’utilisateur confirme que l’application démarre sur Arch et que la gestion des devoirs fonctionne. Le lancement depuis un paquet Arch installé n’a pas encore été validé.

Le port et l’adaptateur rendent la frontière fichiers explicite, mais il n’existe pas encore d’adaptateur navigateur ni d’interface Git. Cette tranche autorise la navigation du dossier choisi et la lecture bornée pour aperçu; elle ne modifie pas les fichiers.n’existe pas encore d’adaptateur navigateur ni d’interface Git. Cette tranche autorise la navigation de dossiers choisis; elle ne lit pas les fichiers.

## Frontières à conserver

Pas de package partagé vide à ce stade. Ajouter une frontière seulement avec un second consommateur réel ou lorsqu’elle permet de tester et remplacer un fournisseur.

- **UI** : navigation, rendu, saisie utilisateur; aucun SDK Tauri/Supabase/GitHub directement si plusieurs plateformes doivent la réutiliser.
- **Cas d’usage** : ouvrir un projet, lister/lire/écrire un fichier, consulter l’état Git; validation et résultats métier indépendants de l’OS.
- **Ports** : contrats TypeScript/Rust uniquement quand l’appel traverse une vraie frontière. Exemples : `FileSystemPort`, `GitProvider`, `StoragePort`, `AuthSession`.
- **Adaptateurs** : Tauri/Rust pour Linux desktop, API de fichiers navigateur pour Web si disponible, adaptateurs natifs distincts pour Windows/macOS et plus tard mobile.
- **Persistance** : IndexedDB pour la tranche locale Web existante; interfaces dédiées avant de connecter SQLite ou PostgreSQL.
- **Backend** : Supabase/PostgreSQL seulement après auth, workspaces et RLS; le serveur reste autorité des permissions.

Flux cible : `UI → cas d’usage → port → adaptateur plateforme`. Les dépendances ne remontent pas depuis un adaptateur vers les règles métier.

## Natif Linux

### Système de fichiers

Garder l’accès natif derrière le port; l’adaptateur actuel appelle le plugin File System Tauri. Le port expose uniquement les opérations nécessaires aux cas d’usage. L’aperçu ouvre un handle en lecture seule, vérifie la taille avant allocation et refuse les fichiers de plus de 512 Kio ou le texte UTF-8 invalide. L’accès commence depuis un dossier explicitement choisi; vérifier les chemins canoniques, traversal et liens symboliques au moment de chaque opération. Les écritures doivent être explicites, atomiques autant que possible, et testées contre les échecs disque/permission. Ne pas accorder `fs:allow-write` global à l’interface.n File System Tauri. Le port expose uniquement les opérations nécessaires aux cas d’usage. Ajouter une commande Rust personnalisée seulement si un besoin de limites de lecture ou de validation ne peut pas être garanti par le plugin. L’accès commence depuis un dossier explicitement choisi; vérifier les chemins canoniques, traversal et liens symboliques au moment de chaque opération. Les écritures doivent être explicites, atomiques autant que possible, et testées contre les échecs disque/permission. Ne pas accorder `fs:allow-write` global à l’interface.

L’adaptateur Web n’imite pas ces droits : il utilise uniquement les API navigateur avec autorisation utilisateur et informe des différences.

### Git local et GitHub

Git local doit être derrière le port `GitProvider`. Une décision entre Git CLI et bibliothèque Rust reste à prendre après un prototype comparant sécurité des arguments, gestion des dépôts, installation et compatibilité. Si un processus Git est retenu, utiliser un exécutable et des arguments séparés sans shell, vérifier le dépôt cible et limiter les opérations; les opérations modificatrices doivent venir d’une action explicite. Aucun plugin shell générique n’est requis.

GitHub sera un adaptateur distant de la même famille, avec OAuth à portée minimale, jetons gardés côté serveur ou dans un coffre-fort système approprié, révocation et aucune clé secrète dans le frontend. Les pushes restent explicites.

## Compilation et distribution Linux

Le paquet Arch doit installer le binaire Tauri, l’entrée `.desktop` et l’icône hicolor; `PKGBUILD` existe, mais son résultat n’est pas validé. Pour fiabiliser :
- pinner tag/commit source et versions Node, pnpm, Rust/Tauri; conserver pnpm-lock et Cargo.lock;
- remplacer les sommes `SKIP` par source immuable vérifiée;
- construire dans un chroot propre `devtools`, vérifier dépendances déclarées avec `namcap`;
- refaire la construction depuis le même commit et comparer les fichiers du paquet, puis traiter toute différence avant d’annoncer une reproductibilité;
- tester installation, lancement depuis menu et désinstallation sur Arch propre.

Un build réussi sur une seule machine ne suffit pas à établir la reproductibilité. Un binaire compilé ne suffit pas à valider le lancement graphique ou le paquet.

## Socle actuel

- TypeScript, React, Vite, Tailwind CSS 4; pnpm workspace.
- Tauri 2 et Rust pour le desktop Linux.
- IndexedDB pour les devoirs locaux; localStorage pour le thème.
- Vitest/Testing Library et contrôles TypeScript sont configurés.
- Pas de monorepo de packages partagés, Turborepo, backend, SQLite, Git ou GitHub actif.

## Suite technique

1. Ajouter des tests pour la lecture de texte bornée derrière `FileSystemPort`, sans permission d’écriture.
2. Choisir et intégrer Git local via un port commun.
3. Construire/installer le paquet Arch et valider le lancement depuis menu dans un environnement propre.
4. Ajouter GitHub après l’authentification et la gestion sûre des jetons.
5. Stabiliser le cœur desktop, puis construire l’adaptateur Web.
6. Évaluer séparément Windows/macOS puis Android/iOS.
