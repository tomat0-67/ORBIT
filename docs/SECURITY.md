# Principes de sécurité

Ces exigences précèdent les premières migrations. Ce document définit les contrôles requis ; aucun contrôle n’est encore implémenté.

## Identité et secrets

- Authentification et sessions derrière une interface commune ; révocation prévue côté serveur.
- Tokens GitHub limités aux permissions nécessaires, avec révocation/rotation.
- Aucune clé secrète Supabase ou clé privilégiée dans le client.
- Ne jamais journaliser tokens, contenu privé ou notes scolaires.

## Autorisation et isolation

- RLS activée pour toutes les tables privées dès leur création.
- Vérification serveur de l’utilisateur, du workspace et du rôle à chaque lecture et mutation.
- Refus par défaut, séparation stricte des workspaces, invitations expirables et révocables.
- Tests d’accès autorisé et refusé entre utilisateurs et workspaces, y compris en appelant directement les API.
- Cache hors ligne partitionné et traitement sûr lors du changement de compte.

## Validation et fichiers

- Valider schéma, taille, type réel, encodage et chemin aux frontières d’entrée.
- Protéger contre traversal, symlinks non sûrs, archives malveillantes, collisions de chemins et bombes de décompression.
- Limiter taille, quantité, profondeur, temps CPU, mémoire et ratio de décompression.
- Traiter noms et métadonnées comme non fiables dans UI et logs.
- Ne pas exécuter automatiquement du contenu importé.

## Opérations et vérifications

- Migrations versionnées et revues ; environnements de développement, test et production séparés.
- Vérifier la présence de secrets dans le build client et les journaux.
- Tests requis pour permissions, entrées, limites d’import et données inter-workspaces avant livraison des fonctions concernées.
- Prévoir sauvegarde, restauration, export et suppression avant mise en service.
- Vérifier limites et coûts des fournisseurs avant activation ; aucune dépense ou upgrade automatique.
