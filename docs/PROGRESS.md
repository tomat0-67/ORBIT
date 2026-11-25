# Progression réelle

Mise à jour : 2026-11-25.

## Audit du dépôt

- main contient README.md (titre seul) et specs.md (cahier des charges initial).
- Aucun code applicatif, manifeste de paquets, test, migration ou répertoire de documentation n’existait sur main.
- L’environnement local initial était un dossier de conversation sans checkout Git fonctionnel ; les fichiers qui y ont été créés ne font pas partie de ce dépôt.
- Le document initial détaillait plusieurs modules mais ne rendait pas explicites certains invariants de la mission récente : limites de PostgreSQL/Supabase Storage pour DEV, progression stricte des lots, documents maintenus et critères de compte rendu réel.

## Réalisé dans cette PR

- Consolidation du cahier des charges vers la version 1.1.
- Mise à jour du README et création de l’architecture, roadmap, journal de décisions, progression, stockage et sécurité.
- Branche de travail : codex/orbit-foundations.

## Pas encore réalisé

Aucune application, authentification, workspace, fonction DEV/STUDY, migration SQL, RLS, synchronisation, compression, stockage cloud ou cible native n’est implémentée. Aucun test ou build applicatif n’a été lancé ; cette PR ne contient que de la documentation.

## Suite proposée

Après revue de cette PR, démarrer le lot 1 : dépôt/outillage reproductible, application web minimale, navigation, design system et tests exécutés. Le modèle de compte et les migrations restent au lot 2.
