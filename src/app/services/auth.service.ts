import { Injectable, signal } from '@angular/core';

// En una aplicación real, esta interfaz sería más compleja.
export interface User {
  username: string;
  // email?: string;
  // etc.
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Usamos un signal para almacenar el usuario actual.
  // El valor inicial es null, lo que significa que no hay nadie logueado.
  readonly currentUser = signal<User | null>(null);

  constructor() {
    // Para este ejemplo, simularemos un inicio de sesión después de 2 segundos.
    // En una app real, esto ocurriría después de un formulario de login exitoso.
    setTimeout(() => {
      this.login({ username: 'Ana_García' });
    }, 2000);
  }

  login(user: User) {
    this.currentUser.set(user);
  }
}