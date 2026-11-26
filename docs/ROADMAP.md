# Feuille de route ORBIT

Mise à jour : 2026-11-26. La priorité produit est maintenant Linux desktop, avec Arch Linux comme environnement de référence. La progression est conditionnée par des validations réelles sur Linux avant d’étendre les autres clients.

## Ordre des plateformes

1. **ORBIT Desktop Linux** — parcours natifs utilisables et distribution Arch installable.
2. **ORBIT Web** — application web complète, réutilisant la logique indépendante de la plateforme.
3. **Windows et macOS** — adaptateurs, paquets, signatures et tests propres à chaque système.
4. **Android et iOS** — clients adaptés aux capacités mobiles, après validation d’un prototype natif.

Une fonctionnalité native ne sera annoncée comme partagée que si son API et son comportement sont réellement disponibles sur chaque cible.

## Audit du dépôt

### Déjà présent

- React/TypeScript/Vite et Tailwind dans `apps/web`; Tauri 2/Rust dans `apps/desktop`.
- L’application démarre sur l’environnement Arch de référence selon la confirmation de l’utilisateur.
- STUDY crée, termine, rouvre et supprime des devoirs stockés sur l’appareil avec IndexedDB.
- DEV ouvre un dossier choisi et affiche les noms des entrées directement à sa racine.
- Le shell Tauri ne donne que les permissions nécessaires au dialogue et à la lecture de liste de dossiers.
- Un `PKGBUILD` et une entrée `.desktop` existent pour installer un binaire, une icône et un raccourci de menu; le paquet n’a pas encore été construit/validé.

### Manquant pour une cible Linux aboutie

- DEV n’a pas d’explorateur navigable, de lecture/édition de fichier ni d’abstraction de système de fichiers. Le composant web importe directement les plugins Tauri.
- Git local, gestion de dépôt et interface Git sont absents.
- GitHub n’est pas intégré.
- Le `PKGBUILD` suit actuellement la branche mutable `main` et saute la vérification de somme pour la source Git. Les versions Node/pnpm/Rust ne sont pas toutes verrouillées ensemble.
- La compilation native a déjà réussi dans un environnement Arch, mais la construction du paquet Arch, l’installation par pacman et le lancement depuis le menu restent à vérifier.
- Le dépôt ne fournit pas encore de test reproductible du paquet dans un chroot Arch propre ni de comparaison entre deux constructions.

## Étape 1 — ORBIT Desktop Linux (prioritaire)

### 1.1 Socle desktop natif
- Garder Tauri 2 et remplacer les imports natifs directs de l’UI par des ports de capacités.
- Ajouter un adaptateur Rust/Tauri pour le système de fichiers; garder un adaptateur navigateur séparé pour le client Web.
- Définir les limites d’accès à partir d’un dossier choisi. Prévenir traversal, liens symboliques inattendus, lectures excessives et écritures involontaires.
- Commencer par une navigation réelle de l’arborescence et une lecture explicitement autorisée; ajouter l’écriture seulement avec sauvegarde/confirmation et tests de non-perte.

### 1.2 Git local
- Définir un port Git indépendant de Tauri et de l’interface.
- Faire un prototype comparatif entre l’exécutable Git et une bibliothèque Rust avant de choisir.
- Restreindre chaque dépôt et chemin aux projets ouverts; aucune commande shell arbitraire ni push automatique.
- Ajouter état, diff et opérations locales, puis tester erreurs, dépôts incomplets et chemins invalides.

### 1.3 GitHub
- Fournir un adaptateur distant derrière une interface de fournisseur Git commune.
- Définir connexion OAuth, portée minimale, stockage sûr/révocation des jetons avant d’activer l’intégration.
- Rendre explicites les actions distantes; ne jamais pousser une modification sans demande de l’utilisateur.
- Valider API, quotas, réseau absent et erreurs d’authentification.

### 1.4 Paquet Arch et compilation reproductible
- Construire le `.pkg.tar.zst` avec dépendances déclarées, entrée `.desktop` et icône.
- Pinner la révision source ainsi que les versions d’outillage nécessaires; remplacer les sommes `SKIP` dès qu’une archive/version immuable est utilisée.
- Construire dans un chroot propre `devtools`; contrôler les dépendances du paquet avec `namcap`.
- Répéter une construction à partir du même commit et comparer les contenus; documenter les différences si les binaires ne sont pas byte-identiques.
- Installer sur Arch via pacman; vérifier menu, icône, lancement, désinstallation propre et dépendances runtime.
- Ne publier aucun paquet/AUR/release sans validation du paquet et autorisation de publication.

### 1.5 Validation desktop Linux
- Vérifier le démarrage et les parcours sur une session graphique Arch réelle.
- Vérifier sélection/refus d’accès, dossiers vides/grands, noms inhabituels, liens symboliques, fermeture/réouverture et absence de perte de données.
- Valider Wayland et X11 si disponibles, puis consigner les versions de système, WebKitGTK, Rust et paquets.
- Terminer l’étape quand le paquet s’installe proprement et que DEV/Study fonctionnent depuis l’application de bureau, sans commande de développement.

## Étape 2 — ORBIT Web

- Conserver les composants et cas d’usage qui ne dépendent pas des API natives.
- Implémenter un adaptateur Web pour les capacités effectivement prises en charge par le navigateur.
- Décrire clairement les limites de sélection et persistance de fichiers propres au navigateur.
- Ajouter comptes, workspaces, permissions et backend avant sync multi-appareil ou données cloud.

## Étape 3 — Windows et macOS

- Réutiliser les ports métier et le shell Tauri seulement après validation des API natives par OS.
- Ajouter les adaptateurs système, installateurs, signatures, mises à jour et tests de permissions propres à chaque cible.
- Ne pas déduire la compatibilité à partir d’une compilation Linux.

## Étape 4 — Android et iOS

- Évaluer Capacitor ou une autre approche dans un prototype limité.
- Définir les fonctions compatibles avec les permissions, stockage, cycle de vie et interfaces tactiles mobiles.
- Ne pas promettre un IDE desktop/Git local complet sur mobile; privilégier les opérations distantes autorisées.

## Étapes transverses ultérieures

Après validation de comptes, workspaces et permissions : données PostgreSQL/RLS, synchronisation, conflits, recherche, notifications et stockage. Compression et déduplication uniquement après mesures, limites et règles d’isolation.

## Critères de progression

- Pas de saut vers Web/Windows/macOS/mobile pour masquer une intégration Linux native manquante.
- Chaque étape doit avoir un parcours réel, une stratégie de permissions, les contrôles pertinents et une mise à jour de documentation.
- Les builds ou tests ne sont décrits comme réussis que s’ils ont été exécutés dans l’environnement indiqué.
