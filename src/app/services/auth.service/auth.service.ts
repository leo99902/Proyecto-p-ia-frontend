// src/app/core/services/auth.service/auth.service.ts

import { Injectable, PLATFORM_ID, inject } from '@angular/core'; // Importar PLATFORM_ID e inject
import { isPlatformBrowser } from '@angular/common'; // Importar isPlatformBrowser
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // Importación correcta de la librería instalada

// Interfaz que define la estructura del payload de tu token JWT
export interface DecodedTokenPayload {
  user: string;
  name: string;
  email: string;
  oxcj: string; // Campo 'oxcj' del token que parece ser el rol/tipo de usuario
  state: string;
  menu: string[]; // El array 'menu' que contiene los IDs de los menús permitidos
  iat: number;
  exp: number;
  [key: string]: any; // Permite otras propiedades si tu token las tiene
}

// Interfaz para un elemento de menú que será renderizado en tu aplicación
export interface MenuItem {
  id: string; // <-- ¡ATENCIÓN A ESTO!: Este ID DEBE coincidir con los strings del array 'menu' de tu token (ej. 'users', 'patients')
  name: string; // Nombre amigable para mostrar en la UI (ej. "Gestión de Usuarios")
  icon?: string; // <-- ¡ATENCIÓN A ESTO!: Nombre del icono de Boxicons (ej. 'bx-home-alt', 'bx-user'). NO INCLUYE 'bx '
  path?: string; // Ruta de Angular a la que navegar (ej. '/usuarios')
  submenus?: MenuItem[]; // Opcional: para menús anidados
}

@Injectable({
  providedIn: 'root' // Hace que este servicio sea un singleton y esté disponible en toda la aplicación
})
export class AuthService {
  private platformId = inject(PLATFORM_ID); // Inyectar PLATFORM_ID

  // Obtener el token de forma segura para SSR
  private get _tokenFromLocalStorage(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  // BehaviorSubject para el estado de autenticación (true si hay token, false si no)
  private _isLoggedIn = new BehaviorSubject<boolean>(!!this._tokenFromLocalStorage); // Usar el getter seguro
  readonly isLoggedIn$ = this._isLoggedIn.asObservable(); // Observable público para suscribirse

  // BehaviorSubject para la lista de menús que el usuario tiene permitido ver
  private _userMenus = new BehaviorSubject<MenuItem[]>([]);
  readonly userMenus$ = this._userMenus.asObservable(); // Observable público para suscribirse

  private allAppMenus: MenuItem[] = [
    // Ejemplo: Si tu token tiene "home", el id aquí es "home". El icono es la clase de Boxicon.
    { id: 'home', name: 'Inicio', icon: 'bx-home-alt', path: '/home' }, // <-- VERIFICA ID, ICONO Y RUTA
    { id: 'patients', name: 'Pacientes', icon: 'bx-group', path: '/pacientes' }, // <-- VERIFICA ID, ICONO Y RUTA
    { id: 'chats', name: 'ChatBot', icon: 'bx-chat', path: '/chatbot' },     // <-- VERIFICA ID, ICONO Y RUTA
    { id: 'users', name: 'Usuarios', icon: 'bx-user', path: '/usuarios' },   // <-- VERIFICA ID, ICONO Y RUTA
    // Ejemplo: Si tu token devuelve "juegos" para los juegos, el id debe ser "juegos".
    { id: 'games', name: 'Juegos', icon: 'bx-joystick', path: '/juegos' },   // <-- VERIFICA ID, ICONO Y RUTA (ej. bx-joystick o bx-game)
    { id: 'notes', name: 'Notas', icon: 'bx-note', path: '/notas' },       // <-- VERIFICA ID, ICONO Y RUTA
    { id: 'notes-list', name: 'Lista de notas', icon: 'bx-list-ul', path: '/notes-list' },       // <-- VERIFICA ID, ICONO Y RUTA
    { id: 'reports', name: 'Reportes', icon: 'bx-file', path: '/reportes' }, // <-- VERIFICA ID, ICONO Y RUTA
    // Agrega aquí más ítems de menú según las necesidades de tu aplicación
    
  ];

  constructor() {
    
    this.loadMenusFromToken();

    // Suscribirse al estado de login: cuando cambia (ej. login/logout),
    // se recargan/limpian los menús.
    this.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.loadMenusFromToken(); // Si el usuario se loguea, carga los menús
      } else {
        this._userMenus.next([]); // Si el usuario cierra sesión, limpia los menús
      }
    });
  }


  setLoggedIn(value: boolean): void {
    this._isLoggedIn.next(value);
  }

  /**
   * Obtiene el token JWT del `localStorage` de forma segura para SSR.
   * @returns El token como string o `null` si no existe o no está en el navegador.
   */
  getToken(): string | null {
    return this._tokenFromLocalStorage; // Usar el getter seguro
  }

  getDecodedToken(): DecodedTokenPayload | null {
    const token = this.getToken();
    if (token) {
      try {
        const decoded = jwtDecode<DecodedTokenPayload>(token); // Uso de jwtDecode
        return decoded;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  /**
   * Carga y filtra los menús disponibles para el usuario basándose en el array 'menu' del token.
   * Los menús filtrados se emiten a través del `_userMenus` BehaviorSubject.
   */
  private loadMenusFromToken(): void {
    // Solo intentar cargar menús si estamos en un navegador
    if (!isPlatformBrowser(this.platformId)) {
      this._userMenus.next([]);
      return;
    }

    const decodedToken = this.getDecodedToken();
    // Verifica si hay un token decodificado y si contiene un array 'menu' válido
    if (decodedToken && decodedToken.menu && Array.isArray(decodedToken.menu)) {
      // Crea un Set para búsquedas eficientes de los IDs de menú permitidos
      const allowedMenuIds = new Set(decodedToken.menu);

      const filteredMenus: MenuItem[] = [];
      // Itera sobre todos los menús posibles de la aplicación
      this.allAppMenus.forEach(menuItem => {
        // Si el ID del menú principal está en la lista de IDs permitidos por el token
        if (allowedMenuIds.has(menuItem.id)) {
          let menuItemToAdd: MenuItem = { ...menuItem }; // Clona el objeto para no modificar el original

          // Si el menú principal tiene submenús, también los procesa.
          // Se asume que si un menú padre está permitido, sus submenús también lo están.
          // Si necesitas filtrar submenús individualmente por IDs en el token,
          // esta lógica de submenús necesitaría ser más compleja (ej. recursiva).
          if (menuItem.submenus && menuItem.submenus.length > 0) {
            // Filtra los submenús si sus IDs también deben estar en `allowedMenuIds`
            menuItemToAdd.submenus = menuItem.submenus.filter(subItem => allowedMenuIds.has(subItem.id));
          }
          filteredMenus.push(menuItemToAdd); // Añade el menú (con sus submenús filtrados, si aplica)
        }
      });

      this._userMenus.next(filteredMenus); // Emite la lista de menús filtrados
    } else {
      this._userMenus.next([]); // Si no hay token o la información de menú es inválida, emite un array vacío
    }
  }

  /**
   * Cierra la sesión del usuario: remueve el token, actualiza el estado de login y limpia los menús.
   */
  logout(): void {
    // Solo remover de localStorage si estamos en un navegador
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token'); // Remueve el token del localStorage
      // Si tu backend guarda información de usuario extra en localStorage (ej. 'user'), bórrala también
      localStorage.removeItem('user');
    }
    this.setLoggedIn(false); // Actualiza el estado de login a false
    this._userMenus.next([]); // Limpia los menús de la UI
  }


  getUser() {
  // Devuelve el usuario autenticado, por ejemplo desde localStorage o un BehaviorSubject
  return JSON.parse(localStorage.getItem('user') || '{}');
}


}
