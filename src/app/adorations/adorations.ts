import { Component, signal, computed, inject, PLATFORM_ID } from '@angular/core'; // outils Angular
import { isPlatformBrowser } from '@angular/common'; // permet de savoir si on est dans le navigateur

interface Song { title: string; artist: string; src: string; image: string; } // forme d'un chant

@Component({
  selector: 'app-adorations', // nom de la balise du composant
  templateUrl: './adorations.html', // votre fichier HTML (adaptez le nom)
  styleUrl: './adorations.css', // votre fichier CSS (adaptez le nom)
})
export class Adorations {
  songs: Song[] = [ // liste de vos chants
    { title: 'Tantum Ergo', artist: 'Artiste', src: '/music/sacramentus.mp3', image: '/images/sacre1.jpg' }, // exemple : adaptez les chemins
    { title: 'Loué Soit à tout moment', artist: 'Artiste', src: '/music/Loué_soit_a_tout_moment.mp3', image: '/images/sacre2.jpg' }, // exemple
    { title: 'Vous Etes là', artist: 'Artiste', src: '/music/Vous_etes_la.mp3', image: '/images/sacre3.jpg'},
    { title: 'Que tes vives eaux', artist: 'Artiste', src: '/music/Que_tes_vives_eaux .mp3', image: '/images/sacre4.jpeg'},
    { title: 'Jésus me voici devant toi', artist: 'Artiste', src: '/music/Jésus_me_voici_devant_toi.mp3', image: '/images/sacre5.jpeg'}
    
  ];

  currentIndex = signal(0); // position du chant actuel
  isPlaying = signal(false); // true si la musique joue
  currentTime = signal(0); // temps écoulé en secondes
  duration = signal(0); // durée totale en secondes
  currentSong = computed(() => this.songs[this.currentIndex()]); // chant actuel, mis à jour automatiquement

  private platformId = inject(PLATFORM_ID); // indique si on est sur le serveur ou le navigateur
  private audio?: HTMLAudioElement; // le lecteur audio (créé seulement dans le navigateur)

  constructor() {
    if (isPlatformBrowser(this.platformId)) { // on ne crée l'audio que dans le navigateur
      this.audio = new Audio(); // crée le lecteur audio
      this.audio.src = this.songs[0].src; // charge le premier chant
      this.audio.addEventListener('timeupdate', () => this.currentTime.set(this.audio!.currentTime)); // met à jour la barre pendant la lecture
      this.audio.addEventListener('loadedmetadata', () => this.duration.set(this.audio!.duration)); // récupère la durée quand le chant est chargé
      this.audio.addEventListener('play', () => this.isPlaying.set(true)); // passe l'icône en ⏸
      this.audio.addEventListener('pause', () => this.isPlaying.set(false)); // passe l'icône en ▶
      this.audio.addEventListener('ended', () => this.next()); // enchaîne sur le chant suivant à la fin
      this.audio.addEventListener('error', () => console.error('Fichier audio introuvable :', this.audio!.src)); // affiche l'erreur si le fichier manque
    }
  }

  async togglePlay() { // bouton play/pause
    if (!this.audio) return; // sécurité : pas d'audio côté serveur
    try {
      if (this.audio.paused) await this.audio.play(); // si en pause : lance la lecture
      else this.audio.pause(); // sinon : met en pause
    } catch (e) {
      console.error('Lecture impossible :', e); // affiche la cause dans la console F12
    }
  }

  selectSong(i: number) { // clic sur un chant de la liste
    if (!this.audio) return; // sécurité
    this.currentIndex.set(i); // change le chant actuel
    this.audio.src = this.songs[i].src; // charge le nouveau fichier
    this.currentTime.set(0); // remet la barre à zéro
    this.audio.play().catch(e => console.error('Lecture impossible :', e)); // lance la lecture
  }

  next() { this.selectSong((this.currentIndex() + 1) % this.songs.length); } // chant suivant (revient au premier après le dernier)
  prev() { this.selectSong((this.currentIndex() - 1 + this.songs.length) % this.songs.length); } // chant précédent

  seek(event: Event) { // quand on déplace la barre
    if (!this.audio) return; // sécurité
    this.audio.currentTime = +(event.target as HTMLInputElement).value; // saute au temps choisi
  }

  formatTime(s: number): string { // convertit des secondes en "m:ss"
    if (!s || isNaN(s)) return '0:00'; // évite d'afficher NaN
    const m = Math.floor(s / 60); // minutes
    const sec = Math.floor(s % 60).toString().padStart(2, '0'); // secondes sur 2 chiffres
    return `${m}:${sec}`; // exemple : 3:07
  }
}