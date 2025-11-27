// ruta: src/app/services/chatbot.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { API_URL } from '../../shared/constants/app.constants';
import { AuthService } from './auth.service/auth.service';

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

// Asegúrate de que esta interfaz coincida con la respuesta JSON de tu backend.
// Si tu backend devuelve { "texto": "..." }, deberías cambiar "reply" por "texto".
interface ApiResponse {
  response: string;
}

interface PromptsCountResponse {
  // La respuesta real del backend es { "count": N }
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  
  // URL actualizada para apuntar a tu API del chatbot
  private apiUrl = `${API_URL}/gemini/generate`;

  sendMessage(message: string, userId: string): Observable<string> {
    // El backend espera un objeto con la clave "prompt" y el "_id" del usuario.
    const payload = { prompt: message, _id: userId };
    console.log(payload)

    return this.http.post<ApiResponse>(this.apiUrl, payload).pipe(
      // Imprimimos la respuesta completa de la API en la consola para depuración.
      tap(response => console.log('Respuesta completa de la API:', response)),
      // La respuesta de tu backend es un JSON con una propiedad "response".
      // Extraemos el texto de esa propiedad.
      map(apiResponse => apiResponse.response)
      
    );
  }

  getNumberOfPrompts(userId: string): Observable<number> {
    const url = `${API_URL}/gemini/number/promts`;
    const payload = { _id: userId };

    return this.http.post<PromptsCountResponse>(url, payload).pipe(
      tap(response => console.log('Respuesta de número de prompts:', response)),
      // Extraemos el valor de la propiedad 'count' que devuelve el backend.
      map(response => response.count)
    );
  }
}
