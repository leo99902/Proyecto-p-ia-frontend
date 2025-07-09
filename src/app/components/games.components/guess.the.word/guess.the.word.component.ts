import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common'; // Required for *ngFor, *ngIf
import { FormsModule, NgModel } from '@angular/forms'; // Required for [(ngModel)]

@Component({
  selector: 'app-guess-the-word', // The HTML tag for this component
  imports: [NgClass, FormsModule, NgFor, NgIf],
  templateUrl: './guess.the.word.component.html',
  styleUrl: './guess.the.word.component.scss'
  // If not using a standalone component (default for ng new), these imports would be in app.module.ts
  // For simplicity and common setup, we assume traditional module setup or standalone configuration
  // For standalone: imports: [CommonModule, FormsModule]
})
export class GuessTheWordComponent implements OnInit {
  // Array of words for the game (more varied topics)
  words: string[] = [
    "CASA", "ARBOL", "PERRO", "GATO", "PLAYA", "MONTAÑA", "LIBRO", "CIELO",
    "FLOR", "AGUA", "SOL", "LUNA", "ESTRELLA", "AMIGO", "FAMILIA", "FELICIDAD",
    "CHOCOLATE", "CAFE", "MUSICA", "PINTURA", "DEPORTE", "AVION", "COCHE",
    "BICICLETA", "CIUDAD", "PAISAJE", "AVENTURA", "VIAJE", "VERANO", "INVIERNO",
    "PRIMAVERA", "OTOÑO", "HISTORIA", "CIENCIA", "ARTE", "MATEMATICAS",
    "COCINA", "JUEGO", "SONRISA", "RELOJ", "TELEFONO", "ESCUELA", "UNIVERSIDAD",
    "TRABAJO", "VACACIONES", "ORDENADOR", "TECLADO", "RATON", "AURICULARES",
    "COMPUTADORA", "INTERNET", "PROGRAMACION", "DESARROLLO", "ALGORITMO"
  ];
  selectedWord: string = ''; // The word selected for guessing
  guessedWord: string[] = []; // Array representing the word with guessed letters (e.g., ['_', 'A', '_', '_'])
  attempts: number = 6; // Initial number of attempts
  guessedLetterInput: string = ''; // Input for the guessed letter (binds to ngModel)
  guessedLetters: string[] = []; // Letters that have already been guessed
  message: string = ''; // Message displayed to the user
  messageType: 'success' | 'error' | '' = ''; // Type of message for styling
  isGameOver: boolean = false; // Flag to indicate if the game is over

  // Parts of the hangman drawing, in order of appearance
  hangmanParts: string[] = [
    'show-head', 'show-body', 'show-arm-left',
    'show-arm-right', 'show-leg-left', 'show-leg-right'
  ];

  // Lifecycle hook: called once after the component is initialized
  ngOnInit(): void {
    this.initializeGame();
  }

  /**
   * Initializes the game state for a new round.
   */
  initializeGame(): void {
    // Select a random word from the array of words
    this.selectedWord = this.words[Math.floor(Math.random() * this.words.length)];
    // Initialize guessedWord with underscores for each letter of the word
    this.guessedWord = Array(this.selectedWord.length).fill('_');
    this.attempts = 6; // Reset attempts
    this.guessedLetterInput = ''; // Clear input field
    this.guessedLetters = []; // Clear guessed letters

    this.message = ''; // Clear any previous messages
    this.messageType = ''; // Clear message type
    this.isGameOver = false; // Reset game over flag

    // Clear hangman drawing classes
    // Angular's template binding will handle reapplying initial state
  }

  /**
   * Updates the hangman drawing based on failed attempts.
   * This method doesn't directly manipulate the DOM but updates the attempts count,
   * which then triggers CSS classes via [ngClass] in the template.
   */
  getHangmanPartClass(partIndex: number): boolean {
    return partIndex < (6 - this.attempts);
  }

  /**
   * Checks the letter guessed by the user.
   */
  checkGuess(): void {
    // Get the letter from the input and convert it to uppercase
    const guess = this.guessedLetterInput.toUpperCase();
    this.guessedLetterInput = ''; // Clear the input field after guessing


    // Validation: Ensure the input is a single letter
    if (!guess.match(/^[A-Z]$/)) {
      this.showMessage('Por favor, ingresa solo una letra válida (A-Z).', 'error');
      return;
    }

    // Validation: Check if the letter has already been guessed
    if (this.guessedLetters.includes(guess)) {
      this.showMessage(`Ya adivinaste la letra "${guess}".`, 'error');
      return;
    }

    // Add the letter to the list of guessed letters
    this.guessedLetters.push(guess);

    let found = false; // Flag to know if the letter was found in the word
    // Iterate over the selected word to see if the letter matches
    for (let i = 0; i < this.selectedWord.length; i++) {
      if (this.selectedWord[i] === guess) {
        this.guessedWord[i] = guess; // If it matches, reveal the letter in guessedWord
        found = true;
      }
    }

    // Update the word display (handled by Angular's data binding: {{ guessedWord.join(' ') }})

    if (found) {
      // If the letter was correct
      this.showMessage('¡Bien hecho! La letra es correcta.', 'success');
    } else {
      // If the letter was incorrect
      this.attempts--; // Reduce remaining attempts
      this.showMessage(`La letra "${guess}" no está en la palabra.`, 'error');
      // The drawing updates automatically via [ngClass] based on `attempts`
    }

    // Check the current game status (won/lost)
    this.checkGameStatus();
  }

  /**
   * Checks if the game has ended (won or lost).
   */
  checkGameStatus(): void {
    // If the guessed word (joined) is equal to the selected word, the player wins
    if (this.guessedWord.join('') === this.selectedWord) {
      this.showMessage('¡Felicidades! ¡Adivinaste la palabra!', 'success');
      this.endGame(); // End the game
    } else if (this.attempts === 0) {
      // If no attempts left, the player loses
      this.showMessage(`¡Perdiste! La palabra era "${this.selectedWord}".`, 'error');
      this.endGame(); // End the game
    }
  }


  showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
  }

  /**
   * Ends the game, disabling input and showing the reset button.
   */
  endGame(): void {
    this.isGameOver = true; // Set game over flag
  }
}
