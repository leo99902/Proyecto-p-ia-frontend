// ruta: src/app/services/chatbot.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

// Asegúrate de que esta interfaz coincida con la respuesta JSON de tu backend.
// Si tu backend devuelve { "texto": "..." }, deberías cambiar "reply" por "texto".
interface ApiResponse {
  response: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private http = inject(HttpClient);
  
  // URL actualizada para apuntar a tu API del chatbot
  private apiUrl = 'http://localhost:6060/gemini/generate';

  sendMessage(message: string): Observable<string> {
    // El backend espera un objeto con la clave "prompt".
    const payload = { prompt: message };
    console.log(payload)

    return this.http.post<ApiResponse>(this.apiUrl, payload).pipe(
      // Imprimimos la respuesta completa de la API en la consola para depuración.
      tap(response => console.log('Respuesta completa de la API:', response)),
      // La respuesta de tu backend es un JSON con una propiedad "response".
      // Extraemos el texto de esa propiedad.
      map(apiResponse => apiResponse.response)
      
    );
  }
}
