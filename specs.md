# ORBIT — Cahier des charges officiel

**Version :** 1.1 (consolidation)  
**Date :** 2026-11-25  
**Statut :** référence fonctionnelle et technique du projet. Cette version consolide le cahier initial avec la mission ORBIT fournie par le propriétaire du projet. Les options techniques restent des options jusqu’à leur validation.

## 1. Vision et principes

ORBIT est une application multiplateforme qui réunit ORBIT DEV, ORBIT STUDY, un Dashboard, un compte unique, Sync, Storage et Collaboration. L’expérience doit être cohérente, modulaire, performante, accessible et gratuite autant que possible.

Principes directeurs : protéger les données, éviter les pertes silencieuses, isoler les workspaces, préférer le stockage local lorsque spécifié, garder les fournisseurs remplaçables et décrire honnêtement l’état réel du produit.

## 2. Portée fonctionnelle

- **Dashboard :** accès à DEV et STUDY, recherche, activité et raccourcis vers le travail récent lorsque ces fonctions existent.
- **Account :** identité, profil, sessions, préférences et accès aux workspaces.
- **DEV :** projets locaux, explorateur et éditeur adaptés à la plateforme, Git local quand disponible, intégration GitHub privilégiée, documentation et tâches.
- **STUDY :** matières, cours, notes, devoirs, documents et import Notion avec rapport et signalement des éléments non pris en charge.
- **Collaboration :** workspaces, membres, invitations révocables et rôles Owner, Admin, Editor et Viewer.
- **Sync, Storage, Notifications et Search :** services communs aux modules, avec mode hors ligne prévu, reprise, respect des permissions et état visible.

La recherche et les notifications ne doivent révéler aucune donnée inaccessible. Un import ne doit pas écraser des données existantes sans confirmation. GitHub n’est pas obligatoire pour utiliser DEV.

## 3. Plateformes et présentation

Plateformes visées : navigateur web, Windows, macOS, Linux (dont Arch Linux), Android et iOS. L’interface s’adapte aux dimensions et aux méthodes de saisie. Desktop : sidebar rétractable, clavier et grand écran. Mobile : navigation tactile, contrôles adaptés et fonctions limitées aux capacités réelles de l’appareil.

Direction visuelle : moderne, minimaliste, sombre par défaut, mode clair, navigation intuitive, animations discrètes et design system partagé. DEV et STUDY ont des fonctions distinctes, mais une présentation cohérente. Une maquette ou un état vide ne constitue pas une fonction métier.

Tauri 2 (desktop) et Capacitor (mobile) sont à étudier. Vérifier les APIs natives, permissions, plugins, empaquetage, signature et compilation réelle avant de retenir les plateformes. Les contraintes propres à iOS, Android, navigateur et desktop doivent être documentées.

## 4. Architecture et technologies

Cible à évaluer : TypeScript, React, Vite, Tailwind CSS, shadcn/ui, pnpm, Supabase/PostgreSQL, IndexedDB, SQLite, Vitest et Playwright. Turborepo est conditionnel à un besoin réel d’orchestration multi-package. Ne pas ajouter de dépendance sans justification.

Le monorepo est recommandé si le partage des contrats, de l’interface et de la logique entre cibles le justifie. Commencer par les applications et modules réellement nécessaires ; ne pas créer une arborescence de packages vides. Les modules métier dépendent d’interfaces communes, pas directement des SDK d’un fournisseur.

Prévoir des interfaces pour : authentification/session, accès base de données, stockage, synchronisation, permissions, notifications, recherche, capacités natives et fournisseurs Git. Les adaptateurs peuvent varier selon la plateforme.

## 5. Stockage et données

### DEV
- Desktop : fichiers sur le disque de l’utilisateur ; Git local lorsqu’il est disponible.
- GitHub est le fournisseur distant privilégié ; pour un projet connecté, le dépôt Git est la source distante de vérité.
- PostgreSQL contient seulement les métadonnées nécessaires. Aucun fichier source ou dépôt complet dans PostgreSQL ou Supabase Storage.
- Aucun push sans action ou autorisation explicite. GitHub ne doit pas être obligatoire pour un projet local.

### STUDY
- Données structurées dans PostgreSQL.
- Fichiers locaux par défaut ; stockage cloud seulement si le partage ou la synchronisation le nécessite.
- Synchronisation incrémentale ; ne jamais écraser silencieusement une modification.

IndexedDB est la cible de cache web/hors ligne. SQLite est à retenir uniquement lorsqu’un besoin natif le justifie. Tout stockage est derrière une abstraction permettant de changer de fournisseur sans réécrire les modules.

Les données Base64 volumineuses sont interdites en PostgreSQL. Les migrations sont versionnées ; index, pagination et sauvegardes répondent à des besoins mesurés.

## 6. Sync, compression et stockage optimisé

La synchronisation gère changements locaux et distants, file d’attente, reprise, idempotence, progression et conflits visibles. Elle est testable indépendamment des interfaces. Étudier Yjs/CRDT seulement si l’édition collaborative simultanée le nécessite.

Le service de compression partagé identifie le format, choisit une méthode compatible, mesure le gain, évite les recompressions inutiles, préserve les originaux si transformation destructive, vérifie l’intégrité, gère les erreurs et limite taille, mémoire et durée. Évaluer Zstandard, Brotli, WebP et AVIF ; préserver les originaux par défaut pour les médias destructifs. Ne pas dupliquer les mécanismes de compression de PostgreSQL ou Git et ne conserver un résultat que s’il apporte un gain réel.

La protection contre les bombes de décompression est obligatoire avant traitement de fichiers non fiables. Une déduplication SHA-256 ne peut jamais franchir l’isolation des utilisateurs ou workspaces, ni révéler qu’un autre utilisateur possède un fichier.

## 7. Sécurité et permissions

- RLS sur les tables privées dès les premières migrations ; permissions vérifiées côté serveur.
- Isolation par utilisateur et workspace ; refus par défaut et vérification à chaque lecture/écriture.
- Validation des données et protection des sessions et tokens GitHub.
- Aucune clé secrète ou privilégiée dans le client ; droits OAuth minimaux, révocation et rotation prévues.
- Limites sur taille, nombre de fichiers, profondeur, temps et mémoire des imports.
- Protection contre traversal de chemins, archives malveillantes et bombes de décompression.
- Invitations sécurisées, expirables et révocables.
- Les caches locaux sont cloisonnés par compte et traités au changement de session.

## 8. Coûts et fournisseurs

Privilégier les offres gratuites et le stockage local. Aucun abonnement obligatoire, upgrade, achat ou dépassement payant automatique. Vérifier quotas, tarifs, limites, conditions et capacités de migration avant chaque mise en production. Avertir avant saturation, protéger les données existantes et prévoir export, sauvegarde et restauration. Aucun stockage illimité ne doit être promis.

## 9. Qualité, documentation et livraison

Pour chaque fonction : définir le comportement, implémenter, ajouter les tests pertinents, exécuter les contrôles, corriger, documenter et vérifier les régressions. Ne jamais annoncer un test réussi sans l’avoir lancé.

Maintenir : specs.md, README.md, docs/ARCHITECTURE.md, docs/ROADMAP.md, docs/DECISIONS.md, docs/PROGRESS.md, docs/STORAGE.md et docs/SECURITY.md.

Aucun fichier ne doit annoncer une fonction comme livrée sans preuve correspondante. Avant une publication GitHub : vérifier l’isolation et les changements ; ne pas fusionner ou pousser sans autorisation explicite.

## 10. Lots indicatifs

1. **Fondations :** structure, configuration, choix monorepo, design system, navigation, interfaces communes minimales, tests de base et documentation.
2. **Comptes et workspaces :** authentification, profils, workspaces, membres, invitations, permissions et RLS.
3. **STUDY :** matières, cours, notes, devoirs, documents, puis import Notion.
4. **DEV :** projets locaux, explorateur, éditeur, Git local, GitHub et synchronisation.
5. **Sync et Storage :** hors ligne, reprise, conflits, compression mesurée, déduplication isolée et optimisation.
6. **Multiplateforme :** web, desktop, Android et iOS, selon compatibilité validée.

L’ordre peut évoluer si l’audit technique le justifie. Les permissions et le modèle de données précèdent le partage et la sync multi-appareil.

## 11. Conditions d’acceptation

ORBIT n’est déclaré fonctionnel que lorsque les parcours concernés existent réellement, que l’isolation et les permissions sont vérifiées, que les fichiers suivent la politique ci-dessus, que les pertes silencieuses sont évitées et que les contrôles annoncés ont été exécutés. Toute fonction incomplète, limite technique ou risque reste documenté.

En cas de conflit, l’ordre de priorité est : préserver les données, la sécurité et l’isolation ; respecter les capacités des plateformes ; éviter le stockage inutile ; préserver les performances et maîtriser les coûts.


## Annexe A — Détail fonctionnel conservé

Cette annexe conserve les exigences du cahier initial qui guident les lots correspondants. Les bibliothèques et fournisseurs restent des options à valider.

### Dashboard et navigation
Le Dashboard donne accès à DEV, STUDY, profil et paramètres. Quand les modules existent, il peut montrer recherche globale, notifications, projets et cours récents, devoirs à venir, tâches et activité. Il reste personnalisable sans devenir chargé. Desktop : clavier, navigation rapide et sidebar rétractable. Mobile : contrôles tactiles adaptés et navigation simplifiée.

### DEV, projets et éditeur
DEV couvre création/import/ouverture de projets, dépôt distant, branches et historique, tâches, documentation, recherche et synchronisation. Sur desktop, les fichiers restent sur disque et Git local est utilisé quand disponible. Sur mobile, les possibilités suivent les capacités de la plateforme ; les opérations distantes via API ne prétendent pas fournir un IDE desktop.

L’éditeur desktop peut évaluer Monaco ; fonctions visées : coloration, numéros de lignes, recherche, onglets et arborescence. L’éditeur mobile est distinct et simplifié ; ne pas charger inutilement de composants desktop.

L’interface Git distante peut lister les dépôts accessibles, sélectionner dépôt et branche, récupérer les changements, afficher conflits et état réseau/sync, et envoyer une modification après action explicite. Respecter limites d’API, permissions minimales, protection des tokens, gestion d’erreur, cache et ETags/requêtes conditionnelles lorsque pertinentes. GitHub reste facultatif.

### STUDY et import Notion
STUDY permet création, couleur, icône, classement et liste de cours par matière. Les cours offrent un éditeur structuré (titres, sous-titres, listes, tableaux, images et pièces jointes) et une recherche. Les notes se créent, se modifient, s’organisent par matière et peuvent garder un historique si nécessaire ; les sauvegardes sont contrôlées et ne doivent pas envoyer chaque frappe.

Un devoir a matière, date limite, description, priorité et état d’avancement ; il peut alimenter calendrier et notifications configurables.

L’import Notion commence par des exports autorisés : pages, titres, contenu et structure conservée autant que possible, pièces jointes compatibles, relations reconstituées si les sources le permettent. Prévisualiser, produire un rapport, signaler les éléments non supportés et demander confirmation avant tout remplacement. Une intégration directe Notion est reportée et dépend de ses permissions et contraintes.

### Workspaces et collaboration
Un membre peut créer ou quitter un workspace, inviter et accepter des invitations, partager l’espace et gérer les permissions selon son rôle. Owner contrôle l’espace ; Admin gère espace et membres ; Editor crée/modifie ; Viewer consulte. Les permissions sont vérifiées côté serveur à chaque requête, invitations révocables et données strictement isolées.

### Données PostgreSQL et exploitation
Les exemples de données structurées incluent profils, workspaces, membres/invitations, matières, cours, notes, devoirs, métadonnées de documents/projets, intégrations, notifications et journaux d’activité nécessaires. Le schéma définitif suit les besoins observés. Éviter colonnes et tables inutiles, SELECT *, jointures ou index sans justification ; paginer, utiliser des transactions et requêtes ciblées. Regrouper les sauvegardes plutôt que les enregistrer à chaque frappe. Prévoir migrations et restauration.

### Sync, fichiers et formats
Le fonctionnement hors ligne prévoit file d’attente, reprise après erreur, incrémentalité, détection/résolution explicite de conflits et état visible. Les contenus édités simultanément peuvent évaluer Yjs/CRDT après confirmation du besoin.

Traitements indicatifs : texte/notes/JSON en compression sans perte si utile ; images WebP/AVIF seulement avec qualité contrôlée et original préservé ; PDF seulement si bénéfice démontré ; ZIP et médias déjà compressés non recompressés ; vidéo originale par défaut ; code laissé aux mécanismes Git. Toutes les transformations suivent les limites et contrôles d’intégrité de la section 6.

### Fournisseurs et quotas
Supabase, GitHub, Cloudflare Pages/Workers et stockage local sont des options, non des engagements. Vérifier offres, limites, conditions et coûts avant déploiement. Prévoir mesure de quotas, avertissement avant saturation, limitation contrôlée des opérations, préservation des données, export/sauvegarde et migration. Aucun dépassement payant automatique, upgrade ou stockage illimité promis.

### Recherche, notifications et tests
La recherche globale vise projets et fichiers accessibles, cours, notes, matières, devoirs et workspaces ; elle applique les mêmes permissions que les vues. Les notifications configurables peuvent couvrir échéances, invitations, changements partagés, sync échouée, conflits et quotas proches de la limite ; éviter les messages inutiles.

Tests à prévoir par niveau : unitaires pour logique, compression/décompression, sync, permissions et validation ; intégration pour auth, base, import, GitHub, workspaces et stockage ; parcours de bout en bout pour inscription/connexion, navigation, cours, projets, import, partage et sync. Vitest et Playwright sont des outils cibles. Les fonctions sensibles sont testées avant livraison.

### Critères de livraison des fonctions
Avant d’annoncer une fonction : vérifier le compte partagé DEV/STUDY, l’isolation, les rôles, parcours métier, import et son rapport, fichiers DEV hors PostgreSQL, intégration GitHub facultative, sync/reprise/conflits, compression sans perte silencieuse, accès hors ligne prévu, quotas et tests pertinents. Ne déclarer réussis que les contrôles exécutés.
