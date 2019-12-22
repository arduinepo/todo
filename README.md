# MIASHS-M2-TP3-Projet

## Installation
Après le git clone, exécutez `npm install` à la racine du dossier, puis `ng serve` pour lancer le serveur : consultez la page localhost:4200 pour accéder à l'application, de préférence sur Chrome si vous voulez utiliser la reconnaissance vocale.

## Fonctionnalités :
* ajout/suppression/modification d'items de la liste.
* affichage filtré des items suivant leur état de complétion : tous/actifs/complétés.
* complétion de tous les items.
* **suppression de tous les items**.
* **annuler/refaire** l'action précédente.
* **stockage et récupération des données en Local Storage** : la liste courante, et les données précédentes avant les 100 dernières modifications.


* **reconnaissance vocale** :
  * Fonctionne uniquement sur Chrome, via le module webkitSpeechRecognition.
  * un input vocal est entré dans un nouvel item, affiché après un délai compris entre 2 et 3 secondes. Si la page n'est pas rechargée ou si un autre item entré avant le dernier chargement n'est pas modifié, il est impossible de modifier le contenu de ce nouvel item par un double clic ou le cocher (voir dernier point).
  * un input vocal composé du contenu d'un item puis des mots "fait", "fais" ou "c'est" - suivant le contexte, l'API différencie mal "fait" de "c'est" - entraîne la complétion d'un item **entré avant le dernier chargement** (voir dernier point).
  * un input vocal composé du contenu d'un item puis des mots "supprimer", "enlever" ou "effacer" entraîne la suppression d'un item **entré avant le dernier chargement** (voir dernier point).
  * avant toute autre action, l'input "effacer tout" entraîne la suppression du contenu entier de la liste. Ne marche pas si un ou      plusieurs inputs vocaux sont traités précédemment depuis le dernier chargement de l'application (voir dernier point).
  * au début, les inputs vocaux étaient bien reconnus et stockés en mémoire, comme le montrait la console ; mais le html ne changeait pas avant actualisation de la page. J'ai résolu ce problème en utlisant *ChangeDetectorRef* et sa méthode *detectChanges()* en consultant des forums Web : l'affichage est bien actualisé, mais le composant ne paraît pas entièrement chargé. Il semblerait que ces erreurs viennent de l'exécution de fonctions asynchrones en-dehors d'Angular. 
  * j'ai défini un SpeechRecognitionService, fournissant les inputs vocaux aux composants via un Observable : l'utilisation de ChangeDetectorRef.detectChanges() a nécessité cet éparpillement. Ma tentative d'inscrire uniquement le TodoService à ce service, pour centraliser cette fonction, a échoué : l'affichage ne s'actualisait pas, la console renvoyant une erreur à l'exécution de detectChanges().
  
