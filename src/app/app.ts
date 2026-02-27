import { Component, signal, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Mood {
  label: string;
  emoji: string;
  color: string;
  secondaryColor: string;
  quote: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Magic Mood ✨');
  protected readonly currentMood = signal<Mood | null>(null);
  protected readonly showCard = signal(false);

  // Pour limiter le débit de poussière
  private lastX = 0;
  private lastY = 0;

  moods: Mood[] = [
    { label: 'Magique', emoji: '✨', color: '#cdb4db', secondaryColor: '#5e35b1', quote: 'De la poussière d\'étoiles dans les yeux !' },
    { label: 'Joyeuse', emoji: '🌈', color: '#ffc8dd', secondaryColor: '#ff4d6d', quote: 'Rire, c\'est comme voler !' },
    { label: 'Rêveuse', emoji: '🌙', color: '#bde0fe', secondaryColor: '#023e8a', quote: 'Deuxième étoile à droite...' },
    { label: 'Espiègle', emoji: '🧚', color: '#99ff33', secondaryColor: '#2d5a27', quote: 'Prête pour l\'aventure ?' }
  ];

  // La méthode de la souris doit être à l'intérieur de la classe !
@HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const distance = Math.sqrt(Math.pow(event.clientX - this.lastX, 2) + Math.pow(event.clientY - this.lastY, 2));
    if (distance < 20) return;

    this.lastX = event.clientX;
    this.lastY = event.clientY;

    this.createStar(event.clientX, event.clientY, false);
  }

  pickRandomMood(event: MouseEvent) {
    // Relance l'animation
    this.showCard.set(false);
    
    const index = Math.floor(Math.random() * this.moods.length);
    this.currentMood.set(this.moods[index]);

    // Explosion de particules
    for (let i = 0; i < 10; i++) {
      this.createStar(event.clientX, event.clientY, true);
    }

    setTimeout(() => this.showCard.set(true), 10);
  }

  private createStar(x: number, y: number, isExplosion: boolean) {
  const container = document.getElementById('pixie-container');
  if (!container) return;

  const star = document.createElement('div');
  
  // --- ON AJOUTE LES STYLES CRITIQUES DIRECTEMENT ICI ---
  star.style.position = 'absolute';
  star.style.left = `${x}px`;
  star.style.top = `${y}px`;
  star.style.transform = 'translate(-50%, -50%)';
  star.style.pointerEvents = 'none';
  star.style.zIndex = '10000';
  star.style.color = this.currentMood()?.color || '#99ff33';
  // ------------------------------------------------------

  star.className = isExplosion ? 'pixie-dust explosion' : 'pixie-dust';
  star.innerHTML = '✨';
  
  const randomX = (Math.random() * 100 - 50) + 'px';
  const randomY = isExplosion ? (Math.random() * 100 - 50) + 'px' : '50px';
  
  star.style.setProperty('--diff-x', randomX);
  star.style.setProperty('--diff-y', randomY);

  container.appendChild(star);
  setTimeout(() => star.remove(), 100);
}
}