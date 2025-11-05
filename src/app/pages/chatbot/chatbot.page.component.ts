import { Component, ViewChild, ElementRef, AfterViewChecked, effect, inject, signal } from '@angular/core';
import { ChatbotService, ChatMessage } from '../../services/chatbot.service';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafeHtmlPipe } from '../../services/safe-html.pipe';
import { AuthService } from '../../services/auth.service/auth.service';

@Component({
  selector: 'app-chatbot-page',
  standalone: true,
  imports: [ CommonModule, FormsModule, SafeHtmlPipe ],
  templateUrl: './chatbot.page.component.html',
  styleUrls: [ './chatbot.page.component.css' ]
})
export class ChatbotPageComponent implements AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  // Usamos Signals para un manejo de estado más moderno y reactivo
  readonly messages = signal<ChatMessage[]>([
    { sender: 'bot', text: 'Hola. Soy tu asistente de apoyo emocional. Estoy aquí para escucharte y ofrecerte herramientas de bienestar. Recuerda, nuestra conversación es privada. ¿Cómo te sientes hoy y qué te gustaría explorar' }
  ]);
  readonly userMessage = signal('');
  readonly isLoading = signal(false);

  // Inyectamos los servicios necesarios.
  private readonly chatbotService = inject(ChatbotService);
  private readonly authService = inject(AuthService);


  constructor() {
    // effect() se ejecuta cuando una de sus señales dependientes cambia.
    // Lo usamos para hacer scroll automáticamente cuando se añaden nuevos mensajes.
    effect(() => {
      if (this.messages()) {
        this.scrollToBottom();
      }
    });
  }

  ngAfterViewChecked(): void {
    // Mantenemos esto como un respaldo para asegurar el scroll en casos complejos.
    this.scrollToBottom();
  }

sendMessage(): void {
  // 1. Obtener y validar el mensaje
  const messageText = this.userMessage().trim();
  if (!messageText) return;

  // 2. Validación de Autenticación (Mantenida)
  const decodedToken = this.authService.getDecodedToken();
  if (!decodedToken || !decodedToken.user) {
    console.error("No se puede enviar el mensaje: Usuario no autenticado.");
    // NOTA: Considera notificar al usuario en el UI aquí.
    return;
  }

  // 3. Actualizar UI antes de la llamada a la API
  this.messages.update(currentMessages => [ ...currentMessages, { sender: 'user', text: messageText } ]);
  this.isLoading.set(true);
  this.userMessage.set('');

  // 4. Llamada al servicio con manejo de errores y finalización
  this.chatbotService.sendMessage(messageText)
    .pipe(
      // Manejo de Errores: Captura el error y lo reemplaza con un Observable que emite un objeto de error.
      // NOTA: Para una mejor tipificación, es útil tener un tipo para la respuesta de la API, por ejemplo: type ChatResponse = { response: string }
      catchError(error => {
        console.error('Error en la llamada a la API:', error);
        // Devolvemos un objeto que simula la estructura de la respuesta de éxito para que el subscribe no falle.
        return of({ response: 'Lo siento, ocurrió un error. Por favor, inténtalo más tarde.' });
      }),
      // Finalización: Se ejecuta después de que el Observable completa o arroja un error (y es manejado).
      finalize(() => this.isLoading.set(false))
    )
    // 5. Suscripción y Actualización de Mensajes
    // La respuesta ahora siempre será un objeto { response: string } gracias a 'catchError'.
    .subscribe(botResponse => {
      let responseText: string;
      // Comprobamos si botResponse es un string (éxito del servicio) o un objeto (error manejado por catchError).
      if (typeof botResponse === 'string') {
        responseText = botResponse;
      } else {
        responseText = botResponse?.response || 'Respuesta de error inesperada.';
      }

      this.messages.update(msgs => [ ...msgs, { sender: 'bot', text: responseText } ]);
    });
}

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}