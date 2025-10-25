import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FindTheEmojiComponentComponent } from '../../components/games.components/find.the.emoji.component/find.the.emoji.component.component';
import { GuessTheWordComponent } from '../../components/games.components/guess.the.word/guess.the.word.component';
import { TriviaQuestionsAndAnswersComponent } from '../../components/games.components/trivia.questions.and.answers/trivia.questions.and.answers/trivia.questions.and.answers.component';
import { PuzzleComponent } from '../../components/games.components/puzzle.component/puzzle/puzzle.component';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [
    CommonModule,
    FindTheEmojiComponentComponent,
    GuessTheWordComponent,
    TriviaQuestionsAndAnswersComponent,
    PuzzleComponent
  ],
  templateUrl: './games.patients.page.component.html',
  styleUrl: './games.patients.page.component.scss'
})

export class GamesPatientsPageComponent implements OnInit, OnDestroy {
  @ViewChild('gameModal') gameModal!: ElementRef;

  modalGameTitle: string = '';
  activeGameId: string | null = null; 

  private keyboardListener: any;

  constructor() { }

  ngOnInit(): void {
    this.keyboardListener = this.onKeyDown.bind(this);
    document.addEventListener('keydown', this.keyboardListener);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.keyboardListener);
  }

  openGameModal(gameId: string, gameTitle: string): void {
    this.modalGameTitle = gameTitle;
    this.activeGameId = gameId;
    this.gameModal.nativeElement.classList.add('open');
  }

  closeGameModal(): void {
    this.gameModal.nativeElement.classList.remove('open');
    this.activeGameId = null;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.gameModal && this.gameModal.nativeElement && this.gameModal.nativeElement.classList.contains('open') && event.key === 'Escape') {
      this.closeGameModal();
    }
  }
}
