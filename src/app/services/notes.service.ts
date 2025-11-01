import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { API_URL } from '../../shared/constants/app.constants';

export interface Note {
  _id: string;
  title: string;
  content: string;
  // La API devuelve 'createdBy' en lugar de 'user' para las notas listadas.
  createdBy: string;
  createdAt: string;
}

export interface NewNote {
  title: string;
  content: string;
  user: string;
}

// Interfaz para la respuesta de la API que envuelve la lista de notas.
interface NotesApiResponse {
  notes: Note[];
}

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private http = inject(HttpClient);
  private readonly BASE_URL = API_URL;

  listNotes(user: string): Observable<Note[]> {
    // La petición POST ahora espera un objeto NotesApiResponse.
    return this.http.post<NotesApiResponse>(`${this.BASE_URL}/listNotes`, { user }).pipe(
      tap(response => console.log('Respuesta cruda de la API de notas:', response)),
      map(response => response.notes || []) // Extraemos el array de la propiedad 'notes'.
    );
  }

  createNote(note: NewNote): Observable<any> {
    return this.http.post(`${this.BASE_URL}/createNote`, note);
  }

  deleteNote(noteId: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/deleteNote`, { _id: noteId });
  }


}