import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Card {
  emoji: string;
  state: 'default' | 'flipped' | 'matched';
}

@Component({
  selector: 'app-find-emoji',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './find-emoji.component.html',
  styleUrls: ['./find-emoji.component.scss']
})
export class FindEmojiComponent implements OnInit {

  // Emojis base para el juego
  private readonly emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'];
  
  cards: Card[] = [];
  flippedCards: Card[] = [];
  gameWon = false;

  ngOnInit(): void {
    this.setupGame();
  }

  /**
   * Prepara e inicia una nueva partida.
   */
  setupGame(): void {
    this.gameWon = false;
    this.flippedCards = [];
    
    // Duplica los emojis para crear pares
    const pairedEmojis = [...this.emojis, ...this.emojis];
    
    // Crea los objetos de carta
    this.cards = pairedEmojis.map(emoji => ({
      emoji: emoji,
      state: 'default'
    }));

    // Baraja las cartas
    this.shuffleCards();
  }

  /**
   * Baraja las cartas usando el algoritmo de Fisher-Yates.
   */
  private shuffleCards(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  /**
   * Maneja el evento de clic en una carta.
   * @param card La carta que fue clickeada.
   */
  cardClicked(card: Card): void {
    // No hacer nada si la carta ya está volteada, emparejada o si ya hay 2 cartas volteadas
    if (card.state !== 'default' || this.flippedCards.length === 2) {
      return;
    }

    card.state = 'flipped';
    this.flippedCards.push(card);

    // Si se han volteado dos cartas, comprobar si coinciden
    if (this.flippedCards.length === 2) {
      this.checkForMatch();
    }
  }

  /**
   * Comprueba si las dos cartas volteadas son un par.
   */
  private checkForMatch(): void {
    const [card1, card2] = this.flippedCards;

    if (card1.emoji === card2.emoji) {
      // Es un par
      card1.state = 'matched';
      card2.state = 'matched';
      this.flippedCards = [];
      this.checkIfGameWon();
    } else {
      // No es un par, voltearlas de nuevo después de un segundo
      setTimeout(() => {
        card1.state = 'default';
        card2.state = 'default';
        this.flippedCards = [];
      }, 1000);
    }
  }

  /**
   * Verifica si todas las cartas han sido emparejadas.
   */
  private checkIfGameWon(): void {
    if (this.cards.every(card => card.state === 'matched')) {
      this.gameWon = true;
    }
  }
}