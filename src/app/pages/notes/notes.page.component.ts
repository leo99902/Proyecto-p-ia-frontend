import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotesService, Note } from '../../services/notes.service';
import { AuthService } from '../../services/auth.service/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-notes-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './notes.page.component.html',
  styleUrls: ['./notes.page.component.scss']
})
export class NotesPageComponent implements OnInit {
  private readonly notesService = inject(NotesService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly notes = signal<Note[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  // Signals para controlar el modal de confirmación
  readonly showDeleteModal = signal(false);
  private noteToDeleteId = signal<string | null>(null);

  noteForm!: FormGroup;

  ngOnInit(): void {
    this.noteForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.maxLength(2000)]]
    });

    this.loadNotes();
  }

  loadNotes(): void {
    this.isLoading.set(true);
    this.error.set(null);
    const currentUser = this.authService.getDecodedToken()?.user;

    if (!currentUser) {
      this.error.set('Usuario no autenticado. No se pueden cargar las notas.');
      this.isLoading.set(false);
      return;
    }

    this.notesService.listORNotes(currentUser)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (notes) => this.notes.set(notes),
        error: () => this.error.set('Error al cargar las notas. Inténtalo de nuevo más tarde.')
      });
  }

  createNote(): void {
    if (this.noteForm.invalid) return;

    const currentUser = this.authService.getDecodedToken()?.user;
    if (!currentUser) {
      this.error.set('No se puede crear la nota: Usuario no autenticado.');
      return;
    }

    const newNote = { ...this.noteForm.value, user: currentUser };

    this.notesService.createNote(newNote).subscribe({
      next: () => {
        this.noteForm.reset();
        this.loadNotes(); // Recargar la lista de notas
      },
      error: () => this.error.set('Error al crear la nota. Inténtalo de nuevo.')
    });
  }

  deleteNote(noteId: string): void {
    // Abre el modal de confirmación y guarda el ID de la nota a eliminar
    this.noteToDeleteId.set(noteId);
    this.showDeleteModal.set(true);
  }

  confirmDelete(): void {
    const noteId = this.noteToDeleteId();
    if (!noteId) return;

    this.notesService.deleteNote(noteId).subscribe({
      next: () => {
        this.loadNotes(); // Recargar la lista de notas tras eliminar
        this.cancelDelete(); // Cierra el modal
      },
      error: () => this.error.set('Error al eliminar la nota. Inténtalo de nuevo.')
    });
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.noteToDeleteId.set(null);
  }
}