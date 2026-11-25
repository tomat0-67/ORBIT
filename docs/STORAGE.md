# Politique de stockage

Cette politique est normative avec specs.md. Elle précède toute migration ou intégration de fournisseur.

| Catégorie | Emplacement de référence | Règle |
| --- | --- | --- |
| Sources et dépôt DEV sur desktop | Disque local et Git local lorsqu’il sera ajouté | Aucun dépôt complet ou fichier source en PostgreSQL/Supabase Storage. |
| Projet DEV distant | Fournisseur Git, GitHub privilégié | Opérations explicites; PostgreSQL ne garde que les métadonnées nécessaires. |
| Métadonnées DEV | PostgreSQL à terme | RLS et permission workspace appliquées. |
| Données STUDY connectées | PostgreSQL à terme | Données validées, migrées et protégées par RLS. |
| Devoirs STUDY du prototype | IndexedDB local | Restent sur l’appareil courant; ni sync, ni cloud, ni chiffrement ORBIT. |
| Fichiers STUDY | Local par défaut, cloud si nécessaire | Transfert explicite, limites et droits vérifiés. |
| Préférences UI | localStorage | Préférences non sensibles comme le thème. |
| Cache web / file hors ligne | IndexedDB | Données minimales, progression et isolation par compte lorsqu’il existera. |
| Base native éventuelle | SQLite si besoin démontré | Migrations et protection au repos évaluées avant emploi. |
| Tokens fournisseur | Gestion sécurisée côté serveur ou système natif | Jamais dans le bundle client, URL ou logs. |

## Accès DEV du prototype

Le sélecteur système demande à l’utilisateur de choisir le dossier. Tauri autorise alors la lecture des entrées du dossier sélectionné. ORBIT liste uniquement les éléments immédiatement présents; il ne lit pas leur contenu et ne les modifie pas. La sélection n’est pas conservée après fermeture et doit être renouvelée lors d’une prochaine session.

## Transferts et sync

Aucun transfert distant n’est implémenté. À l’avenir, transférer uniquement les données requises. Les mutations seront autorisées côté serveur pour chaque opération. Synchroniser de façon incrémentale, versionnée et idempotente, avec reprise après erreur. Un conflit ne doit jamais être résolu par écrasement silencieux.

## Compression et intégrité

Détecter le format réel plutôt que faire confiance à l’extension. Mesurer le résultat et ne le conserver qu’en cas de gain. Éviter les recompressions d’archives, médias déjà encodés, données PostgreSQL ou objets Git. Préserver les originaux des transformations destructives. Vérifier l’intégrité et appliquer limites de taille, durée, mémoire et ratio de décompression.

Évaluer Zstandard/Brotli pour compression sans perte et WebP/AVIF pour transformations d’images lorsqu’elles sont adaptées. Aucune transformation destructive par défaut.

## Déduplication

SHA-256 peut identifier des contenus identiques, jamais autoriser leur partage. La déduplication est cloisonnée par utilisateur ou workspace autorisé et ne doit pas permettre de déduire l’existence d’un fichier d’un autre espace.

## Conservation

Définir rétention, sauvegardes/restauration, export et suppression avant le cloud. Ne supprimer aucune donnée utilisateur sans autorisation et comportement clairement défini. Les données IndexedDB du prototype n’ont pas encore de sauvegarde ou d’export intégré.
