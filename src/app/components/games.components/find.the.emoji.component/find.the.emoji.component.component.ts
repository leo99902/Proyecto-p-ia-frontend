import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Card {
  id: string;
  content: string;
  type: string;
  isFlipped: boolean;
  isMatched: boolean;
}

@Component({
  selector: 'app-find-emoji',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './find.the.emoji.component.component.html',
  styleUrl: './find.the.emoji.component.component.scss'
})
export class FindTheEmojiComponentComponent implements OnInit, OnDestroy {

  emotionData = [
    { emoji1: '😄', emoji2: '😊', type: 'alegria' },
    { emoji1: '😢', emoji2: '😔', type: 'tristeza' },
    { emoji1: '😡', emoji2: '😠', type: 'enojo' },
    { emoji1: '😨', emoji2: '😱', type: 'miedo' },
    { emoji1: '😮', emoji2: '😲', type: 'sorpresa' },
    { emoji1: '😌', emoji2: '🧘', type: 'calma' },
    { emoji1: '🤩', emoji2: '✨', type: 'asombro' },
    { emoji1: '😴', emoji2: '💤', type: 'cansancio' }
  ];

  cards: Card[] = [];
  flippedCards: Card[] = [];
  matchedPairs: number = 0;
  attempts: number = 0;
  lockBoard: boolean = false;
  
  showGameOverMessageBox: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.initializeGame();
  }

  ngOnDestroy(): void {
  }

  private shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  initializeGame(): void {
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.attempts = 0;
    this.lockBoard = false;
    this.showGameOverMessageBox = false;

    const gameCards: Card[] = [];
    this.emotionData.forEach((emotion, idx) => {
      gameCards.push({
        id: `card-${idx}-emoji1`,
        content: emotion.emoji1,
        type: emotion.type,
        isFlipped: false,
        isMatched: false
      });
      gameCards.push({
        id: `card-${idx}-emoji2`,
        content: emotion.emoji2,
        type: emotion.type,
        isFlipped: false,
        isMatched: false
      });
    });

    this.cards = this.shuffle(gameCards);
  }

  flipCard(clickedCard: Card): void {
    if (this.lockBoard || clickedCard.isFlipped || clickedCard.isMatched) {
      return;
    }

    clickedCard.isFlipped = true;
    this.flippedCards.push(clickedCard);

    if (this.flippedCards.length === 2) {
      this.attempts++;
      this.lockBoard = true;
      setTimeout(() => this.checkForMatch(), 1000);
    }
  }

  private checkForMatch(): void {
    const [card1, card2] = this.flippedCards;
    const isMatch = card1.type === card2.type;

    if (isMatch) {
      this.matchedPairs++;
      card1.isMatched = true;
      card2.isMatched = true;
      this.resetFlippedCards();
      if (this.matchedPairs === this.emotionData.length) {
        setTimeout(() => this.showGameOverMessageBox = true, 500);
      }
    } else {
      setTimeout(() => {
        card1.isFlipped = false;
        card2.isFlipped = false;
        this.resetFlippedCards();
      }, 1000);
    }
  }

  private resetFlippedCards(): void {
    this.flippedCards = [];
    this.lockBoard = false;
  }
}
