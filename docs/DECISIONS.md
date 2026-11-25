# Décisions d’architecture

Journal des décisions de fondation. Réviser une décision lorsque des preuves de prototype la contredisent.

## ADR-001 — Monorepo progressif

**Statut :** adopté comme direction, structure à valider au lot 1.  
Les cibles doivent partager contrats et design system, donc un dépôt unique est cohérent. Commencer avec le minimum réellement consommé ; extraire les packages après apparition de plusieurs consommateurs. Introduire Turborepo quand son orchestration apporte un bénéfice mesuré.

## ADR-002 — Ports et adaptateurs

**Statut :** adopté.  
Les règles métier ne dépendent pas des SDK Supabase, des APIs navigateur ou natives. Les adaptateurs restent aux frontières afin de tester les modules et changer de fournisseur sans réécriture complète. Une interface n’est créée que lorsqu’un besoin concret existe.

## ADR-003 — Politique de fichiers

**Statut :** exigence produit.  
Les sources DEV restent locales sur desktop ; Git local est utilisé lorsqu’il est disponible. PostgreSQL stocke seulement les métadonnées et Supabase Storage ne reçoit pas de dépôt complet. Les fichiers STUDY restent locaux par défaut ; le cloud répond à un besoin explicite.

## ADR-004 — Autorisation côté serveur

**Statut :** exigence produit.  
RLS protège les tables privées dès les premières migrations ; le serveur contrôle chaque opération. Le masquage d’un contrôle d’interface ne remplace pas une permission.

## ADR-005 — Tauri et Capacitor par preuve

**Statut :** prototypes à confirmer.  
Tauri 2 est évalué pour desktop et Capacitor pour mobile, sans supposer que leurs API fichiers, tâches de fond ou permissions sont interchangeables. Aucune cible native n’est annoncée comme compatible avant un build de démonstration.

## ADR-006 — Outillage progressif

**Statut :** adopté.  
TypeScript, React, Vite, Tailwind, pnpm, PostgreSQL/Supabase, IndexedDB, SQLite et les outils de test sont des technologies cibles à valider par lot. shadcn/ui est adopté si ses composants sont utiles ; Turborepo est différé jusqu’à un besoin d’orchestration multi-package.

## ADR-007 — Arch Linux comme première cible desktop

**Statut :** adopté pour l’ordre de prototypage ; compatibilité non vérifiée.  
Commencer la validation Tauri 2 sur Arch afin de prioriser l’expérience Linux demandée. Les prérequis suivent la documentation officielle Tauri (WebKitGTK 4.1 et outils système Arch). Cette décision ne signifie ni que l’application existe, ni qu’un build Arch a réussi, ni que toutes les distributions Linux sont supportées. Garder la distribution et toute publication AUR pour une décision ultérieure après build et vérification des dépendances.
