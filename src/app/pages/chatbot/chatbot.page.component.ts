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
    { sender: 'bot', text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?' }
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
    const messageText = this.userMessage().trim();
    if (!messageText) return;

    const decodedToken = this.authService.getDecodedToken();
    if (!decodedToken || !decodedToken.user) {
      // Opcional: Manejar el caso en que el usuario no esté logueado.
      console.error("No se puede enviar el mensaje: Usuario no autenticado.");
      // Podrías mostrar un mensaje al usuario aquí.
      return;
    }

    this.messages.update(currentMessages => [ ...currentMessages, { sender: 'user', text: messageText } ]);
    this.isLoading.set(true);
    this.userMessage.set('');

    this.chatbotService.sendMessage(messageText,)
      .pipe(
        catchError(error => {
          console.error('Error en la llamada a la API:', error);
          return of('Lo siento, ocurrió un error. Por favor, inténtalo más tarde.');
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe(botResponse => {
        this.messages.update(msgs => [ ...msgs, { sender: 'bot', text: botResponse } ]);
      });
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}