# Décisions d’architecture

Journal des décisions de fondation. Réviser une décision lorsque des preuves de prototype la contredisent.

## ADR-001 — Monorepo progressif

**Statut :** adopté.  
Les clients doivent partager contrats et design system, donc un dépôt unique est cohérent. Le workspace pnpm contient maintenant web et desktop. Extraire des packages après apparition de plusieurs consommateurs concrets. Introduire Turborepo quand son orchestration apporte un bénéfice mesuré.

## ADR-002 — Ports et adaptateurs

**Statut :** adopté.  
Les règles métier ne dépendent pas des SDK Supabase, des APIs navigateur ou natives. Les adaptateurs restent aux frontières. Une interface n’est créée que lorsqu’un besoin concret existe.

## ADR-003 — Politique de fichiers

**Statut :** exigence produit.  
Les sources DEV restent locales sur desktop; Git local est utilisé lorsqu’il sera ajouté. PostgreSQL stockera seulement les métadonnées et Supabase Storage ne recevra pas de dépôt complet. Le premier prototype DEV liste en lecture seule les éléments du dossier choisi.

## ADR-004 — Autorisation côté serveur

**Statut :** exigence produit.  
RLS protège les tables privées dès les premières migrations; le serveur contrôle chaque opération. Le masquage d’un contrôle d’interface ne remplace pas une permission.

## ADR-005 — Tauri et Capacitor par preuve

**Statut :** prototype desktop présent; Capacitor reste à évaluer.  
Tauri 2 héberge le shell desktop et ses permissions natives minimales. Le binaire release compile sur l’hôte Arch utilisé; le lancement et le paquetage restent à valider. Aucun autre système n’est présumé compatible. Capacitor sera évalué séparément pour mobile.

## ADR-006 — Outillage progressif

**Statut :** adopté.  
TypeScript, React, Vite, Tailwind, pnpm et les outils de test sont utilisés pour le premier lot. PostgreSQL/Supabase, IndexedDB, SQLite et autres technologies sont retenues selon les besoins de chaque lot. shadcn/ui sera ajouté si ses composants apportent un bénéfice concret; Turborepo reste différé.

## ADR-007 — Arch Linux comme première cible desktop

**Statut :** compilation native confirmée; exécution et distribution non confirmées.  
Arch est le premier système de validation demandé. Le binaire Tauri release compile avec WebKitGTK 4.1 sur l’hôte Arch disponible. Le lancement graphique n’a pas été essayé et le paquetage AppImage/DEB a échoué dans l’environnement de travail en lecture seule. Cela ne prouve pas la compatibilité avec toute installation Arch ni avec les autres distributions.

## ADR-008 — Données du premier prototype

**Statut :** stockage local temporaire.  
Les devoirs de démonstration STUDY sont enregistrés dans IndexedDB de l’appareil courant; ils ne sont ni envoyés, ni synchronisés, ni chiffrés par ORBIT. Cette implémentation locale ne remplace pas le futur PostgreSQL protégé par RLS. Le thème reste une préférence localStorage.
