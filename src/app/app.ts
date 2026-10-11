import { Component } from '@angular/core'; // importe l'outil pour créer un composant
import { Adorations } from './adorations/adorations'; // importe notre page d'adoration

@Component({ // déclare le composant principal de l'application
  selector: 'app-root', // nom de la balise principale (déjà présente dans index.html)
  standalone: true, // fonctionne sans module
  imports: [Adorations], // autorise l'utilisation de notre composant dans ce fichier
  template: '<app-adorations/>', // affiche directement la page d'adoration
}) // fin de la configuration
export class App{} // classe vide : ce composant ne fait qu'afficher la page