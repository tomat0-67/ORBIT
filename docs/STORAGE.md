# Politique de stockage

Cette politique est normative avec specs.md. Elle précède toute migration ou intégration de fournisseur.

| Catégorie | Emplacement de référence | Règle |
| --- | --- | --- |
| Sources et dépôt DEV sur desktop | Disque local et Git local si disponible | Aucun dépôt complet ou fichier source en PostgreSQL/Supabase Storage. |
| Projet DEV distant | Fournisseur Git, GitHub privilégié | Opérations explicites ; PostgreSQL ne garde que les métadonnées nécessaires. |
| Métadonnées DEV | PostgreSQL | RLS et permission workspace appliquées. |
| Données structurées STUDY | PostgreSQL | Validées, migrées et protégées par RLS. |
| Fichiers STUDY | Local par défaut, cloud si nécessaire | Transfert explicite, limites et droits vérifiés. |
| Cache web / file hors ligne | IndexedDB | Données minimales, progression et isolement par compte. |
| Base native éventuelle | SQLite si besoin démontré | Migrations et protection au repos évaluées avant emploi. |
| Tokens fournisseur | Gestion sécurisée adaptée au serveur ou au système natif | Jamais dans le bundle client, URL ou logs. |

## Transferts et sync

Transférer uniquement les données requises. Les mutations sont autorisées côté serveur pour chaque opération. Synchroniser de façon incrémentale, versionnée et idempotente, avec reprise après erreur. Un conflit ne doit jamais être résolu par écrasement silencieux. Définir rétention, export, suppression, révocation et sauvegardes avant le stockage distant de fichiers.

## Compression et intégrité

Détecter le format réel plutôt que faire confiance à l’extension. Mesurer le résultat et ne le conserver qu’en cas de gain. Éviter les recompressions d’archives, médias déjà encodés, données PostgreSQL ou objets Git. Préserver les originaux des transformations destructives. Vérifier l’intégrité et appliquer limites de taille, durée, mémoire et ratio de décompression.

Évaluer Zstandard/Brotli pour compression sans perte et WebP/AVIF pour transformations d’images lorsqu’elles sont adaptées. Aucune transformation destructive par défaut.

## Déduplication

SHA-256 peut identifier des contenus identiques, jamais autoriser leur partage. La déduplication est cloisonnée par utilisateur ou workspace autorisé et ne doit pas permettre de déduire l’existence d’un fichier d’un autre espace.

## Conservation

Documenter rétention, sauvegardes/restauration, export et suppression avant le cloud. Ne supprimer aucune donnée utilisateur sans autorisation et comportement clairement défini.
