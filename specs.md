# ORBIT — Cahier des charges officiel

**Nom du projet :** ORBIT  
**Type :** Application multiplateforme de productivité, développement et organisation scolaire  
**Version du cahier des charges :** 1.0  
**Statut :** Spécifications initiales  
**Philosophie :** Gratuit, modulaire, performant, évolutif et accessible.

---

# 1. Vision du projet

ORBIT est une application tout-en-un qui rassemble deux environnements complémentaires :

- **ORBIT DEV** : environnement de développement informatique.
- **ORBIT STUDY** : environnement d'organisation scolaire et de gestion des cours.

L'objectif est de proposer une seule application, un seul compte et une interface cohérente permettant de passer facilement d'un environnement à l'autre.

ORBIT doit être suffisamment modulaire pour accueillir de nouvelles fonctionnalités sans devoir reconstruire toute son architecture.

## Principes fondamentaux

1. Une seule application et un seul compte.
2. Une expérience multiplateforme cohérente.
3. Une architecture modulaire.
4. Un stockage optimisé au maximum.
5. Une synchronisation fiable entre appareils.
6. Une utilisation gratuite autant que possible.
7. Aucune dépendance obligatoire à un abonnement payant.
8. Aucune perte silencieuse de données.
9. Une interface moderne, simple et intuitive.
10. Une architecture capable d'évoluer avec le nombre d'utilisateurs.

---

# 2. Plateformes prises en charge

ORBIT doit viser les plateformes suivantes :

| Plateforme | Support |
|---|---|
| Windows | Application native |
| macOS | Application native |
| Linux | Application native |
| Arch Linux | Application native |
| Android | Application mobile |
| iOS | Application mobile |
| Navigateur web | Version web |

L'interface doit s'adapter automatiquement aux écrans et aux méthodes de saisie.

## Adaptation des interfaces

### Ordinateur
- Sidebar rétractable.
- Navigation rapide.
- Raccourcis clavier.
- Interface optimisée pour souris et clavier.
- Éditeurs adaptés aux grands écrans.

### Mobile
- Navigation tactile.
- Menus adaptés aux petits écrans.
- Boutons suffisamment grands.
- Navigation simplifiée.
- Synchronisation en arrière-plan lorsque la plateforme le permet.

### Contraintes techniques
Les fonctionnalités natives doivent être abstraites derrière des interfaces communes.

Les possibilités propres à chaque plateforme doivent être vérifiées avant leur implémentation.

Ne pas supposer que les API du navigateur, Tauri et Capacitor offrent les mêmes capacités.

La compilation iOS doit être réalisée avec les outils Apple nécessaires.

---

# 3. Architecture générale

ORBIT possède un tableau de bord central.

Depuis ce tableau de bord, l'utilisateur peut passer entre DEV et STUDY.

## Organisation

- ORBIT Dashboard
- ORBIT DEV
- ORBIT STUDY
- ORBIT Account
- ORBIT Settings
- ORBIT Sync
- ORBIT Storage
- ORBIT Notifications
- ORBIT Search

Les services communs doivent être réutilisés par DEV et STUDY.

## Compte unique

Un seul compte ORBIT permet d'accéder aux deux environnements.

Le système doit gérer :
- Authentification.
- Profil utilisateur.
- Sessions.
- Préférences.
- Workspaces.
- Invitations.
- Permissions.
- Synchronisation.

---

# 4. ORBIT Dashboard

Le Dashboard est le point d'entrée de l'application.

Il doit permettre de retrouver rapidement son travail.

## Fonctionnalités

- Accès à DEV.
- Accès à STUDY.
- Recherche globale.
- Notifications.
- Derniers projets.
- Derniers cours.
- Devoirs à venir.
- Tâches.
- Activité récente.
- Profil.
- Paramètres.

Le Dashboard doit rester personnalisable sans devenir compliqué.

---

# 5. ORBIT DEV

ORBIT DEV est un environnement de développement informatique.

Il doit permettre de gérer des projets, modifier du code, suivre des tâches et utiliser des services externes.

## 5.1 Gestion des projets

Fonctionnalités :
- Création de projets.
- Importation de projets existants.
- Ouverture de projets locaux.
- Connexion à un dépôt GitHub.
- Gestion des branches.
- Historique des commits.
- Synchronisation.
- Gestion de tâches.
- Documentation.
- Recherche dans les projets.

## 5.2 Philosophie GitHub-first

GitHub est le fournisseur Git privilégié pour les projets synchronisés.

Pour les projets connectés :
- Le dépôt Git est la source de vérité distante.
- Les fichiers ne sont pas stockés dans PostgreSQL.
- Les fichiers ne sont pas automatiquement copiés dans Supabase Storage.
- Les métadonnées du projet sont conservées dans ORBIT.
- Les modifications doivent être synchronisables avec le dépôt distant.

GitHub ne doit cependant pas être obligatoire pour utiliser DEV.

## 5.3 Projets locaux

Sur ordinateur :
- Les fichiers restent sur le disque de l'utilisateur.
- Git local est privilégié.
- Les opérations commit, pull, push et branch doivent être disponibles lorsque Git est installé.
- ORBIT ne doit pas copier automatiquement tous les fichiers dans le cloud.

Sur mobile :
- Proposer un espace de travail local lorsque la plateforme le permet.
- Permettre la consultation et l'édition des projets compatibles.
- Utiliser les API GitHub pour les opérations distantes lorsque Git natif n'est pas disponible.
- Ne pas prétendre fournir les mêmes possibilités qu'un IDE desktop si les contraintes mobiles l'empêchent.

## 5.4 Architecture Git

Créer une abstraction :

`GitProvider`

Implémentation initiale :

`GitHubProvider`

Cette architecture doit permettre d'ajouter ultérieurement :
- GitLab.
- Serveurs Git personnels.
- Autres fournisseurs compatibles.

## 5.5 Synchronisation GitHub

Fonctionnalités :
- Connexion sécurisée.
- Liste des dépôts accessibles.
- Sélection d'un dépôt.
- Sélection de branche.
- Récupération des modifications.
- Envoi des modifications.
- Affichage des conflits.
- État de synchronisation.

Règles :
- Aucun push sans action ou autorisation explicite.
- Respect des limites de l'API GitHub.
- Utilisation des ETags et requêtes conditionnelles lorsque possible.
- Cache des informations.
- Permissions minimales.
- Protection des tokens.
- Gestion des erreurs réseau.

## 5.6 Éditeur

L'éditeur doit être adapté à la plateforme.

Desktop :
- Monaco Editor envisagé.
- Coloration syntaxique.
- Numéros de lignes.
- Recherche.
- Gestion des onglets.
- Arborescence de fichiers.

Mobile :
- Éditeur adapté aux écrans tactiles.
- Interface simplifiée.
- Fonctionnalités compatibles avec les capacités du téléphone.

Ne pas charger inutilement des composants desktop sur mobile.

---

# 6. ORBIT STUDY

ORBIT STUDY est un espace d'organisation scolaire.

Il doit permettre de gérer les cours, matières, notes, devoirs et documents.

## 6.1 Matières

- Création de matières.
- Couleurs personnalisées.
- Icônes.
- Organisation.
- Liste des cours.
- Classement.

## 6.2 Cours

- Création de cours.
- Éditeur de texte riche.
- Titres et sous-titres.
- Listes.
- Tableaux.
- Images.
- Pièces jointes.
- Organisation par matière.
- Recherche.

Un éditeur basé sur TipTap peut être envisagé.

## 6.3 Notes

- Prise de notes.
- Organisation par matière.
- Recherche.
- Modification.
- Historique lorsque nécessaire.
- Sauvegarde automatique contrôlée.

## 6.4 Devoirs

- Création de devoirs.
- Matière associée.
- Date limite.
- Description.
- Priorité.
- État d'avancement.
- Notifications.
- Calendrier.

## 6.5 Importation Notion

ORBIT doit proposer une fonctionnalité d'importation d'un workspace Notion.

Objectifs :
- Importer les données exportées par Notion.
- Importer les pages.
- Préserver les titres et les contenus.
- Préserver autant que possible la structure.
- Récupérer les fichiers et pièces jointes compatibles.
- Reconstituer les relations lorsque les données disponibles le permettent.
- Afficher un rapport d'importation.
- Signaler les éléments non pris en charge.

L'importation ne doit jamais écraser les données existantes sans confirmation.

L'importation directe via API Notion pourra être envisagée ultérieurement, selon les permissions et les possibilités techniques.

---

# 7. Workspaces et collaboration

ORBIT doit permettre à plusieurs comptes de collaborer dans un même workspace.

Un utilisateur peut :
- Créer un workspace.
- Inviter d'autres utilisateurs.
- Accepter une invitation.
- Partager un espace.
- Modifier les permissions.
- Quitter un workspace.

## Rôles

| Rôle | Permissions |
|---|---|
| Owner | Contrôle complet |
| Admin | Gestion des membres et du workspace |
| Editor | Création et modification |
| Viewer | Consultation uniquement |

Les permissions doivent être vérifiées côté serveur.

Les utilisateurs ne doivent jamais pouvoir accéder aux données d'un workspace sans autorisation.

Les invitations doivent être sécurisées et révocables.

---

# 8. Architecture technique

## Technologies principales envisagées

- TypeScript.
- React.
- Vite.
- Tailwind CSS.
- shadcn/ui.
- Supabase.
- PostgreSQL.
- GitHub API.
- Git.
- IndexedDB.
- SQLite.
- Vitest.
- Playwright.
- pnpm.
- Turborepo.

## Architecture multiplateforme

Étudier une architecture combinant :
- Tauri 2 pour les applications desktop.
- Capacitor pour les applications mobiles.
- React pour partager l'interface et la logique métier.
- Une couche d'abstraction pour les fonctionnalités natives.

La séparation des applications desktop, mobile et web doit être claire.

Ne pas forcer le partage de fonctionnalités incompatibles entre plateformes.

## Monorepo envisagé

```text
orbit/
├── apps/
│   ├── web/
│   ├── desktop/
│   └── mobile/
│
├── packages/
│   ├── core/
│   ├── ui/
│   ├── auth/
│   ├── database/
│   ├── storage/
│   ├── sync/
│   ├── permissions/
│   ├── notifications/
│   ├── search/
│   ├── dev/
│   ├── study/
│   └── platform/
│
├── supabase/
│   ├── migrations/
│   ├── functions/
│   └── config.toml
│
├── docs/
├── tests/
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

Cette structure est une cible à adapter si une autre organisation apporte un avantage technique réel.

---

# 9. Base de données

Supabase PostgreSQL est la base de données initiale.

Elle doit stocker les données structurées et les métadonnées nécessaires au fonctionnement d'ORBIT.

## 9.1 Données autorisées

Exemples :
- Profils.
- Workspaces.
- Membres.
- Invitations.
- Matières.
- Cours.
- Notes.
- Devoirs.
- Métadonnées des documents.
- Préférences.
- Métadonnées des projets DEV.
- Intégrations.
- Notifications.
- Journaux d'activité nécessaires.

## 9.2 Données à ne pas stocker dans PostgreSQL

- Dépôts Git complets.
- Fichiers sources DEV.
- Archives volumineuses.
- Images binaires volumineuses.
- PDF volumineux.
- Fichiers encodés en Base64.

Les fichiers DEV restent locaux ou dans les dépôts Git.

Les documents STUDY restent locaux par défaut et peuvent utiliser le stockage cloud lorsqu'un partage ou une synchronisation le nécessite.

## 9.3 Tables envisagées

```text
profiles
workspaces
workspace_members
workspace_invitations

projects
integrations

subjects
courses
notes
assignments

documents
attachments

notifications
activity_logs
```

Les tables définitives doivent être conçues à partir des besoins réels.

Éviter les tables et colonnes inutiles.

## 9.4 Optimisation PostgreSQL

- Indexer uniquement les colonnes utiles.
- Utiliser des requêtes ciblées.
- Éviter SELECT *.
- Paginer les résultats.
- Limiter les jointures inutiles.
- Éviter les doublons.
- Utiliser des transactions.
- Optimiser les sauvegardes automatiques.
- Éviter d'enregistrer chaque frappe.
- Préférer une sauvegarde regroupée et contrôlée.
- Utiliser une synchronisation incrémentale.

## 9.5 Sécurité

- Row Level Security (RLS).
- Vérification serveur des permissions.
- Protection des données privées.
- Validation des entrées.
- Protection contre les accès non autorisés.
- Migrations versionnées.
- Sauvegardes et procédures de restauration.

Les clés privilégiées ne doivent jamais être exposées dans le client.

---

# 10. Stockage local et synchronisation

ORBIT doit fonctionner même lorsque la connexion Internet est absente ou instable.

## Stockage local

Web :
- IndexedDB.

Desktop :
- SQLite pour les données locales.
- Fichiers directement sur le disque.

Mobile :
- SQLite lorsque disponible.
- Stockage local sécurisé adapté à la plateforme.

## Synchronisation

Créer un service commun de synchronisation.

Il doit gérer :
- Modifications locales.
- Modifications distantes.
- File d'attente.
- Reprises après erreur.
- Synchronisation incrémentale.
- Détection de conflits.
- Résolution des conflits.
- État de synchronisation.

Ne jamais écraser silencieusement une modification plus récente.

Pour les documents édités simultanément, étudier Yjs ou une autre solution CRDT lorsque le besoin est confirmé.

La synchronisation doit être testable indépendamment des interfaces.

---

# 11. Compression et optimisation du stockage

La compression doit être une couche commune à DEV et STUDY.

Objectif : réduire les transferts et le stockage sans perte de données.

## 11.1 Traitement selon les formats

| Format | Traitement |
|---|---|
| Texte | Compression sans perte |
| Notes | Compression sans perte si utile |
| JSON | Compression adaptée |
| Images | WebP ou AVIF avec qualité contrôlée |
| PDF | Optimisation uniquement si pertinente |
| ZIP | Ne pas recompresser inutilement |
| Vidéos | Conserver le format original par défaut |
| Code source | Git gère ses mécanismes de compression |
| Métadonnées | Réduction des données inutiles |

## 11.2 Technologies

- Zstandard (Zstd).
- Brotli.
- WebP.
- AVIF.
- SHA-256.

Les technologies retenues doivent être compatibles avec les plateformes ciblées.

## 11.3 Règles obligatoires

1. Identifier le format avant compression.
2. Mesurer la taille avant et après.
3. Ne conserver la version compressée que si elle apporte un gain réel.
4. Ne jamais recompresser inutilement un fichier déjà compressé.
5. Préserver les originaux lorsque le traitement est destructif.
6. Vérifier l'intégrité après traitement.
7. Conserver les métadonnées nécessaires au décodage.
8. Éviter les compressions supplémentaires déjà réalisées par PostgreSQL.
9. Ne jamais stocker de gros fichiers en Base64 dans PostgreSQL.
10. Adapter la compression à la puissance de l'appareil.

## 11.4 Déduplication

Étudier une déduplication basée sur SHA-256.

Si deux fichiers sont identiques :
- Éviter de stocker deux copies cloud lorsque le système le permet.
- Maintenir des références distinctes.
- Vérifier les droits d'accès.
- Ne jamais exposer l'existence d'un fichier privé à un autre utilisateur.

La déduplication doit être sécurisée et ne doit pas permettre de contourner les permissions.

## 11.5 Sécurité de la compression

Prévoir :
- Limites de taille.
- Limites de mémoire.
- Limites de temps.
- Protection contre les bombes de décompression.
- Validation des fichiers.
- Contrôle d'intégrité.

La compression ne doit pas rendre l'application instable.

---

# 12. Hébergement et modèle économique

## Objectif Zero-Cost

ORBIT doit être conçu pour fonctionner avec des offres gratuites au départ.

Technologies envisagées :
- Supabase Free.
- Cloudflare Pages.
- Cloudflare Workers Free si nécessaire.
- GitHub.
- Stockage local.

Les quotas et conditions doivent être vérifiés avant chaque mise en production.

## Règles économiques

- Aucun service payant obligatoire.
- Aucun upgrade automatique.
- Aucune dépense déclenchée sans autorisation explicite.
- Aucun stockage illimité promis.
- Aucun dépassement de quota ignoré.
- Aucune suppression silencieuse des données.

## Gestion des quotas

ORBIT doit :
- Surveiller les quotas.
- Avertir avant saturation.
- Limiter les opérations consommatrices lorsque nécessaire.
- Préserver les données déjà enregistrées.
- Proposer des exports et sauvegardes.
- Prévoir une migration vers un autre fournisseur.

L'architecture doit être indépendante du fournisseur autant que possible.

---

# 13. Interface et design

ORBIT doit avoir une interface moderne, cohérente et minimaliste.

## Direction artistique

- Mode sombre par défaut.
- Mode clair disponible.
- Design moderne.
- Typographie lisible.
- Hiérarchie visuelle claire.
- Animations discrètes.
- Pas d'effets visuels excessifs.
- Pas de surcharge d'informations.

## Ergonomie

- Navigation compréhensible.
- Accès rapide aux fonctions importantes.
- Recherche globale.
- Raccourcis clavier sur desktop.
- Adaptation mobile.
- États de chargement.
- Messages d'erreur compréhensibles.
- États vides utiles.

Les deux environnements doivent avoir une identité propre tout en conservant le même système visuel.

---

# 14. Recherche globale

La recherche globale doit permettre de retrouver :
- Projets DEV.
- Fichiers accessibles.
- Cours.
- Notes.
- Matières.
- Devoirs.
- Workspaces.

La recherche doit respecter les permissions.

Ne jamais retourner de résultats provenant d'un workspace inaccessible.

---

# 15. Notifications

Les notifications doivent concerner :
- Devoirs à venir.
- Invitations.
- Modifications partagées.
- Synchronisations échouées.
- Conflits.
- Quotas proches de la limite.

L'utilisateur doit pouvoir gérer ses préférences.

Ne pas envoyer de notifications inutiles.

---

# 16. Qualité et tests

Le projet doit intégrer des tests dès le début.

## Tests unitaires
- Logique métier.
- Compression.
- Décompression.
- Synchronisation.
- Permissions.
- Validation des données.

## Tests d'intégration
- Authentification.
- Base de données.
- Import Notion.
- GitHub.
- Workspaces.
- Stockage.

## Tests end-to-end
- Inscription.
- Connexion.
- Navigation.
- Création de cours.
- Création de projet.
- Importation.
- Partage.
- Synchronisation.

Outils envisagés :
- Vitest.
- Playwright.

Les fonctionnalités sensibles doivent être testées avant leur livraison.

---

# 17. Organisation du développement

Le développement doit se faire par étapes.

## Phase 1 — Fondations
- Monorepo.
- Architecture.
- Design system.
- Navigation.
- Authentification.
- Services communs.
- Configuration Supabase.

## Phase 2 — Dashboard et comptes
- Profils.
- Workspaces.
- Membres.
- Invitations.
- Permissions.

## Phase 3 — ORBIT STUDY
- Matières.
- Cours.
- Notes.
- Devoirs.
- Documents.
- Import Notion.

## Phase 4 — ORBIT DEV
- Projets.
- Explorateur.
- Éditeur.
- Git local.
- GitHub.
- Synchronisation.

## Phase 5 — Stockage et synchronisation avancés
- Compression.
- Déduplication.
- Synchronisation hors ligne.
- Gestion des conflits.
- Optimisations.

## Phase 6 — Multiplateforme
- Desktop.
- Android.
- iOS.
- Adaptations spécifiques.

## Phase 7 — Tests et publication
- Tests complets.
- Sécurité.
- Performance.
- Documentation.
- Préparation au déploiement.

Les phases peuvent être développées en parallèle lorsque les fondations le permettent, mais les dépendances doivent être respectées.

---

# 18. Critères d'acceptation

ORBIT ne peut être considéré comme fonctionnel que si :

- Un seul compte permet d'utiliser DEV et STUDY.
- Le passage entre les environnements fonctionne.
- Les données privées sont protégées.
- Les workspaces peuvent être partagés.
- Les permissions sont respectées.
- STUDY permet de gérer les cours et devoirs.
- L'import Notion fournit un rapport exploitable.
- DEV peut ouvrir des projets locaux.
- GitHub peut être connecté sans être obligatoire.
- Les fichiers DEV ne sont pas stockés dans PostgreSQL.
- La synchronisation gère les erreurs et conflits.
- La compression ne provoque aucune perte silencieuse.
- Les données restent accessibles hors ligne lorsque cela est prévu.
- Les quotas sont surveillés.
- Aucune dépense payante n'est déclenchée automatiquement.
- Les tests essentiels passent.

---

# 19. Règle finale

Ce document constitue la référence fonctionnelle et technique d'ORBIT.

Toute décision d'architecture ou de développement doit respecter ces principes.

En cas de contradiction :
1. Préserver les données.
2. Préserver la sécurité.
3. Respecter le fonctionnement multiplateforme.
4. Éviter le stockage inutile.
5. Préserver les performances.
6. Garder l'application gratuite autant que possible.

Toute modification importante des spécifications doit être documentée.

Ne jamais prétendre qu'une fonctionnalité est terminée sans l'avoir implémentée et testée.
