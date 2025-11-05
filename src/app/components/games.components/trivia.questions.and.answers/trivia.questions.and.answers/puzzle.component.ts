import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Tile {
  value: number;
  isCorrect: boolean;
}

@Component({
  selector: 'app-puzzle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss']
})
export class PuzzleComponent implements OnInit {

  tiles: (Tile | null)[] = [];
  isSolved = false;
  private readonly gridSize = 3; // 3x3 grid

  ngOnInit(): void {
    this.setupGame();
  }

  /**
   * Configura e inicia una nueva partida.
   */
  setupGame(): void {
    this.isSolved = false;
    // Crea las piezas del puzzle del 1 al 8
    const initialTiles: (Tile | null)[] = Array.from({ length: this.gridSize * this.gridSize - 1 }, (_, i) => ({
      value: i + 1,
      isCorrect: false
    }));
    // Añade la pieza vacía
    initialTiles.push(null);
    this.tiles = initialTiles;
    this.shuffleTiles();
    this.checkAllTiles();
  }

  /**
   * Baraja las piezas de forma que el puzzle sea resoluble.
   */
  private shuffleTiles(): void {
    // Realiza una serie de movimientos válidos desde el estado resuelto para garantizar que se pueda resolver
    for (let i = 0; i < 100; i++) {
      const emptyIndex = this.tiles.indexOf(null);
      const neighbors = this.getNeighbors(emptyIndex);
      const randomNeighborIndex = neighbors[Math.floor(Math.random() * neighbors.length)];
      this.swapTiles(emptyIndex, randomNeighborIndex);
    }
  }

  /**
   * Maneja el clic en una pieza.
   * @param index El índice de la pieza clickeada.
   */
  onTileClick(index: number): void {
    if (this.isSolved) return;

    const emptyIndex = this.tiles.indexOf(null);
    const neighbors = this.getNeighbors(emptyIndex);

    // Si la pieza clickeada es vecina de la vacía, se intercambian
    if (neighbors.includes(index)) {
      this.swapTiles(index, emptyIndex);
      this.checkAllTiles();
    }
  }

  /**
   * Intercambia dos piezas en el tablero.
   */
  private swapTiles(index1: number, index2: number): void {
    [this.tiles[index1], this.tiles[index2]] = [this.tiles[index2], this.tiles[index1]];
  }

  /**
   * Obtiene los índices de las piezas vecinas a una dada.
   */
  private getNeighbors(index: number): number[] {
    const neighbors: number[] = [];
    const row = Math.floor(index / this.gridSize);
    const col = index % this.gridSize;

    if (row > 0) neighbors.push(index - this.gridSize); // Arriba
    if (row < this.gridSize - 1) neighbors.push(index + this.gridSize); // Abajo
    if (col > 0) neighbors.push(index - 1); // Izquierda
    if (col < this.gridSize - 1) neighbors.push(index + 1); // Derecha

    return neighbors;
  }

  /**
   * Comprueba todas las piezas para ver si están en la posición correcta y si el puzzle está resuelto.
   */
  private checkAllTiles(): void {
    let allCorrect = true;
    this.tiles.forEach((tile, index) => {
      if (tile) {
        tile.isCorrect = tile.value === index + 1;
        if (!tile.isCorrect) {
          allCorrect = false;
        }
      }
    });
    // El puzzle está resuelto si todas las piezas están en su sitio y la última es la vacía
    this.isSolved = allCorrect && this.tiles[this.tiles.length - 1] === null;
  }
}