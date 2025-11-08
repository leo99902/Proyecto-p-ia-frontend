import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService, Note } from '../../services/notes.service';
import { SafeHtmlPipe } from '../../services/safe-html.pipe';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  templateUrl: './notes-list.component.html',
  styleUrl: 'notes-list.component.css',
})
export class NotesListComponent implements OnInit {
  private notesService = inject(NotesService);

  notes = signal<Note[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Para el filtro de búsqueda
  private searchSubject = new Subject<string>();
  searchTerm = signal<string>('');

  constructor() {
    // Escucha los cambios en el término de búsqueda
    this.searchSubject.pipe(
      debounceTime(300), // Espera 300ms después de la última pulsación
      distinctUntilChanged() // Solo emite si el valor ha cambiado
    ).subscribe(searchValue => {
      this.loadNotes(searchValue);
    });
  }

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(name?: string): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.notesService.listAllNotes(name).subscribe({
      next: (notes) => {
        this.notes.set(notes);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar las notas. Inténtalo de nuevo más tarde.');
        this.isLoading.set(false);
        console.error(err);
      },
    });
  }

  // Método para ser llamado desde el input de búsqueda en el HTML
  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.searchSubject.next(value.trim());
  }
}