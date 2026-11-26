# Principes de sécurité

Ces exigences précèdent les premières migrations. Ce document définit les contrôles requis; aucun compte serveur ni contrôle RLS n’est encore implémenté.

## Identité et secrets

- Authentification et sessions derrière une interface commune; révocation prévue côté serveur.
- Tokens GitHub limités aux permissions nécessaires, avec révocation/rotation.
- Aucune clé secrète ou privilégiée Supabase dans le client.
- Ne jamais journaliser tokens, contenu privé ou notes scolaires.

## Autorisation et isolation

- RLS activée pour toutes les tables privées dès leur création.
- Vérification serveur de l’utilisateur, du workspace et du rôle à chaque lecture et mutation.
- Refus par défaut, séparation stricte des workspaces, invitations expirables et révocables.
- Tests d’accès autorisé et refusé entre utilisateurs et workspaces, y compris via accès API direct.
- Cache hors ligne partitionné et traitement sûr lors du changement de compte.

## Client desktop Linux du prototype

- La fenêtre Tauri reçoit `core:default`, `dialog:allow-open`, `fs:allow-read-dir`, `fs:allow-open`, `fs:allow-read` et `fs:allow-fstat`; aucune permission d’écriture n’est accordée.
- Le dialogue natif choisit explicitement un dossier et ajoute son chemin au scope temporaire. L’option récursive limite l’accès aux descendants de cette racine choisie pour la liste et l’aperçu texte borné.
- Aucune permission d’écriture de fichiers, d’exécution shell ou d’accès réseau n’est accordée par cette capacité.
- Le frontend peut lister les entrées des sous-dossiers de la racine choisie et lire en mémoire un fichier sélectionné pour l’aperçu. La taille est vérifiée avant allocation, limitée à 512 Kio, et les octets doivent former du texte UTF-8 valide sans octet nul.
- Tauri retire l’accès temporaire au redémarrage; la sélection doit être renouvelée par l’utilisateur.

## Validation et fichiers

- Valider schéma, taille, type réel, encodage et chemin aux frontières d’entrée.
- Protéger contre traversal, symlinks non sûrs, archives malveillantes, collisions de chemins et bombes de décompression.
- Limiter taille, quantité, profondeur, temps CPU, mémoire et ratio de décompression.
- Traiter noms et métadonnées comme non fiables dans l’interface et les logs.
- Ne pas exécuter automatiquement du contenu importé.

## Opérations et vérifications

- Migrations versionnées et revues; environnements de développement, test et production séparés.
- Vérifier la présence de secrets dans le build client et les journaux.
- Tests requis pour permissions, entrées, limites d’import et données inter-workspaces avant livraison des fonctions concernées.
- Prévoir sauvegarde, restauration, export et suppression avant mise en service.
- Vérifier limites et coûts des fournisseurs avant activation; aucune dépense ou mise à niveau automatique.
