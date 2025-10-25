import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-puzzle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './puzzle.component.html',
  styleUrl: './puzzle.component.scss'
})
export class PuzzleComponent implements OnInit, AfterViewInit {
  @ViewChild('puzzleBoard') board!: ElementRef;
  @ViewChild('winMessage') winMessageElement!: ElementRef;

  tiles: number[] = [];
  gridSize: number = 3;
  totalTiles: number = this.gridSize * this.gridSize;
  emptyTileIndex: number = this.totalTiles - 1;
  isSolved: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.initializePuzzle();
  }

  ngAfterViewInit(): void {
    this.shufflePuzzle();
  }

  initializePuzzle(): void {
    this.tiles = Array.from({ length: this.totalTiles }, (_, i) => (i + 1));
    this.tiles[this.emptyTileIndex] = 0;
    this.renderBoard();
    this.isSolved = false;
    this.winMessageElement.nativeElement.style.display = 'none';
  }

  renderBoard(): void {
    this.board.nativeElement.innerHTML = '';
    this.tiles.forEach((value, index) => {
      const tile = document.createElement('div');
      tile.classList.add('puzzle-tile');
      
      if (value === 0) {
        tile.classList.add('empty');
        tile.textContent = '';
      } else {
        tile.textContent = value.toString();
        // Añadir atributo data-value para los estilos CSS
        tile.setAttribute('data-value', value.toString());
      }
      
      tile.dataset['index'] = index.toString();
      tile.addEventListener('click', this.handleTileClick.bind(this));
      this.board.nativeElement.appendChild(tile);
    });
  }

  shufflePuzzle(): void {
    let shuffledTiles = Array.from({ length: this.totalTiles - 1 }, (_, i) => i + 1);

    // Barajar usando Fisher-Yates
    for (let i = shuffledTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledTiles[i], shuffledTiles[j]] = [shuffledTiles[j], shuffledTiles[i]];
    }

    shuffledTiles.push(0);
    this.tiles = shuffledTiles;
    this.emptyTileIndex = this.tiles.indexOf(0);
    this.renderBoard();
    this.isSolved = false;
    this.winMessageElement.nativeElement.style.display = 'none';
  }

  handleTileClick(event: Event): void {
    if (this.isSolved) return;
    
    const clickedIndex = parseInt((event.target as HTMLElement).dataset['index'] || '0');
    const rowClicked = Math.floor(clickedIndex / this.gridSize);
    const colClicked = clickedIndex % this.gridSize;
    const rowEmpty = Math.floor(this.emptyTileIndex / this.gridSize);
    const colEmpty = this.emptyTileIndex % this.gridSize;

    const isAdjacent = (
      (Math.abs(rowClicked - rowEmpty) === 1 && colClicked === colEmpty) ||
      (Math.abs(colClicked - colEmpty) === 1 && rowClicked === rowEmpty)
    );

    if (isAdjacent) {
      [this.tiles[clickedIndex], this.tiles[this.emptyTileIndex]] = 
        [this.tiles[this.emptyTileIndex], this.tiles[clickedIndex]];
      this.emptyTileIndex = clickedIndex;
      this.renderBoard();
      this.checkWin();
    }
  }

  checkWin(): void {
    for (let i = 0; i < this.totalTiles - 1; i++) {
      if (this.tiles[i] !== (i + 1)) {
        this.isSolved = false;
        return;
      }
    }
    if (this.tiles[this.totalTiles - 1] !== 0) {
      this.isSolved = false;
      return;
    }

    this.isSolved = true;
    this.winMessageElement.nativeElement.style.display = 'block';
    this.board.nativeElement.querySelectorAll('.puzzle-tile').forEach((tile: HTMLElement) => {
      tile.removeEventListener('click', this.handleTileClick.bind(this));
      tile.style.cursor = 'default';
    });
  }
}