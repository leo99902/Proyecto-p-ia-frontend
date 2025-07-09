import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para directivas como *ngIf, *ngFor
import { FormsModule } from '@angular/forms'; // Necesario si se usaran formularios

@Component({
  selector: 'app-puzzle', // Selector HTML para usar este componente
  standalone: true, // Define el componente como autónomo
  imports: [CommonModule, FormsModule], // Módulos necesarios
  templateUrl: './puzzle.component.html',
  styleUrl: './puzzle.component.scss'
})
export class PuzzleComponent implements OnInit, AfterViewInit {
  // Referencias a elementos del DOM usando @ViewChild
  @ViewChild('puzzleBoard') board!: ElementRef;
  @ViewChild('winMessage') winMessageElement!: ElementRef;

  tiles: number[] = []; // Array para almacenar el estado actual del puzzle
  gridSize: number = 3; // Para un puzzle 3x3
  totalTiles: number = this.gridSize * this.gridSize; // 9 tiles en total (8 números + 1 vacío)
  emptyTileIndex: number = this.totalTiles - 1; // El último tile es el vacío

  isSolved: boolean = false; // Bandera para indicar si el puzzle está resuelto

  constructor() { }

  ngOnInit(): void {
    // Inicializa el puzzle en su estado resuelto al cargar el componente
    this.initializePuzzle();
  }

  ngAfterViewInit(): void {
    // Barajar el puzzle después de que la vista se haya inicializado
    // Esto asegura que el tablero ya esté renderizado en el DOM
    this.shufflePuzzle();
  }

  /**
   * Inicializa el puzzle en su estado resuelto (números en orden).
   */
  initializePuzzle(): void {
    this.tiles = Array.from({ length: this.totalTiles }, (_, i) => (i + 1));
    this.tiles[this.emptyTileIndex] = 0; // 0 representa el espacio vacío
    this.renderBoard();
    this.isSolved = false; // Asegurarse de que el mensaje de victoria esté oculto
    this.winMessageElement.nativeElement.style.display = 'none';
  }

  /**
   * Renderiza el tablero del puzzle en el DOM.
   * Se manipula directamente el DOM para la creación de los tiles.
   */
  renderBoard(): void {
    this.board.nativeElement.innerHTML = ''; // Limpiar el tablero actual
    this.tiles.forEach((value, index) => {
      const tile = document.createElement('div');
      tile.classList.add('puzzle-tile');
      if (value === 0) {
        tile.classList.add('empty');
        tile.textContent = ''; // El espacio vacío no tiene número
      } else {
        tile.textContent = value.toString();
      }
      tile.dataset['index'] = index.toString(); // Guardar el índice en el DOM
      tile.addEventListener('click', this.handleTileClick.bind(this)); // Enlazar el evento
      this.board.nativeElement.appendChild(tile);
    });
  }

  /**
   * Baraja el puzzle de forma aleatoria.
   */
  shufflePuzzle(): void {
    let shuffledTiles = Array.from({ length: this.totalTiles - 1 }, (_, i) => i + 1);

    // Algoritmo de Fisher-Yates para barajar
    for (let i = shuffledTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledTiles[i], shuffledTiles[j]] = [shuffledTiles[j], shuffledTiles[i]];
    }

    // Añadir el espacio vacío (0) al final
    shuffledTiles.push(0);
    this.tiles = shuffledTiles;
    this.emptyTileIndex = this.tiles.indexOf(0); // Actualizar el índice del espacio vacío

    this.renderBoard();
    this.isSolved = false; // Ocultar mensaje de victoria
    this.winMessageElement.nativeElement.style.display = 'none';
  }

  /**
   * Maneja el clic en una pieza del puzzle.
   * @param event El evento de clic.
   */
  handleTileClick(event: Event): void {
    const clickedIndex = parseInt((event.target as HTMLElement).dataset['index'] || '0');

    // Determinar si la pieza clicada es adyacente al espacio vacío
    const rowClicked = Math.floor(clickedIndex / this.gridSize);
    const colClicked = clickedIndex % this.gridSize;
    const rowEmpty = Math.floor(this.emptyTileIndex / this.gridSize);
    const colEmpty = this.emptyTileIndex % this.gridSize;

    const isAdjacent = (
      (Math.abs(rowClicked - rowEmpty) === 1 && colClicked === colEmpty) || // Arriba/Abajo
      (Math.abs(colClicked - colEmpty) === 1 && rowClicked === rowEmpty)    // Izquierda/Derecha
    );

    if (isAdjacent) {
      // Intercambiar la pieza clicada con la pieza vacía
      [this.tiles[clickedIndex], this.tiles[this.emptyTileIndex]] = [this.tiles[this.emptyTileIndex], this.tiles[clickedIndex]];
      this.emptyTileIndex = clickedIndex; // Actualizar el índice del espacio vacío
      this.renderBoard(); // Volver a dibujar el tablero
      this.checkWin(); // Verificar si el puzzle está resuelto
    }
  }

  /**
   * Verifica si el puzzle está resuelto.
   */
  checkWin(): void {
    // El puzzle está resuelto si los números están en orden (1, 2, 3... 8) y el último es 0
    for (let i = 0; i < this.totalTiles - 1; i++) {
      if (this.tiles[i] !== (i + 1)) {
        this.isSolved = false;
        return; // No está resuelto
      }
    }
    if (this.tiles[this.totalTiles - 1] !== 0) {
      this.isSolved = false;
      return; // El último no es el espacio vacío
    }

    // Si llegamos aquí, el puzzle está resuelto
    this.isSolved = true;
    this.winMessageElement.nativeElement.style.display = 'block'; // Mostrar mensaje de victoria
    // Deshabilitar clics en las piezas
    this.board.nativeElement.querySelectorAll('.puzzle-tile').forEach((tile: HTMLElement) => {
      tile.removeEventListener('click', this.handleTileClick.bind(this));
      tile.style.cursor = 'default';
    });
  }
}


